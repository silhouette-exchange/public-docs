/*
 * docusaurus-plugin-structured-data-fix
 *
 * Local Docusaurus plugin that post-processes the output of
 * @stackql/docusaurus-plugin-structured-data. That plugin has a bug in
 * its BreadcrumbList generator: for any route with a length-1 ancestor
 * segment that is NOT `docs` or `blog` (e.g. `/api/authentication`,
 * `/concepts/tee`, `/architecture/overview`), the switch(routeArray.length)
 * case 1 branch only handles 'docs' and 'blog'. Everything else falls
 * through with pageName undefined and elementIndex still at its init
 * value of 1, producing malformed JSON-LD like:
 *
 *   { "@type": "BreadcrumbList",
 *     "itemListElement": [
 *       { "position": 1, "name": "Home", "item": "..." },
 *       { "position": 1, "name": "undefined" }
 *     ]
 *   }
 *
 * Two list items with the same position. One with name "undefined".
 * Google's Rich Results Test rejects it. AI citation scorers ignore it.
 *
 * This plugin runs `postBuild` after the stackql plugin has written its
 * JSON-LD into each HTML file. For every HTML file we:
 *   1. Read the file.
 *   2. Find each <script type="application/ld+json"> block.
 *   3. If the block is a @graph that contains a BreadcrumbList, check for
 *      the bug signature (duplicate positions or any "undefined" names).
 *   4. If broken, rebuild the BreadcrumbList from the route using the
 *      `breadcrumbLabelMap` from themeConfig.structuredData so every item
 *      has a unique, sequential position and a real name.
 *   5. Write the file back.
 *
 * The fix is route-driven: it walks the route segments and builds the
 * ListItem array in order. It does NOT depend on the sidebar shape, so it
 * works across /docs, /api, /concepts, /architecture, /trading, /guides,
 * etc.
 *
 * Registration order matters. The stackql plugin must run before this one
 * so our postBuild sees the stackql-written JSON-LD. Docusaurus runs
 * postBuild hooks in plugins-array order. See docusaurus.config.ts where
 * this plugin is registered immediately after `@stackql/...`.
 */

const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const LD_SCRIPT_SELECTOR = 'script[type="application/ld+json"]';

/**
 * Detect the stackql breadcrumb bug signature.
 * Returns true if the BreadcrumbList has a duplicate position
 * or any item with name "undefined" / missing name.
 */
function isBrokenBreadcrumb(breadcrumb) {
  if (!breadcrumb || breadcrumb['@type'] !== 'BreadcrumbList') {
    return false;
  }
  const items = breadcrumb.itemListElement;
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }
  const positions = new Set();
  for (const item of items) {
    if (!item || typeof item !== 'object') return true;
    if (item.name === undefined || item.name === null || item.name === 'undefined' || item.name === '') {
      return true;
    }
    if (item.position === undefined || item.position === null) {
      return true;
    }
    if (positions.has(item.position)) {
      return true;
    }
    positions.add(item.position);
  }
  // Also catch non-sequential positions (should be 1, 2, 3, ...).
  const sorted = [...positions].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) return true;
  }
  return false;
}

/**
 * Build a correct BreadcrumbList for a given route.
 *
 * @param {string} route e.g. "/api/authentication"
 * @param {string} webPageTitle e.g. "Authentication"
 * @param {string} baseUrl e.g. "https://docs.silhouette.exchange"
 * @param {string} breadcrumbId keep the existing @id so references resolve
 * @param {Record<string,string>} labelMap breadcrumbLabelMap from themeConfig
 */
function buildBreadcrumb(route, webPageTitle, baseUrl, breadcrumbId, labelMap) {
  const itemListElement = [];
  let position = 1;

  // Always start with Home.
  itemListElement.push({
    '@type': 'ListItem',
    position,
    name: 'Home',
    item: `${baseUrl}/`,
  });
  position += 1;

  // Walk the route segments. Skip empty strings from leading slashes.
  const segments = route.split('/').filter((s) => s.length > 0);

  // If there are no segments, the route is "/" - already handled by Home above.
  if (segments.length === 0) {
    return {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement,
    };
  }

  // Build ancestor items: every segment except the final one.
  // The final segment is the current page and gets `webPageTitle` as its name.
  let cumulativePath = '';
  for (let i = 0; i < segments.length; i += 1) {
    const token = segments[i];
    cumulativePath += `/${token}`;
    const isLeaf = i === segments.length - 1;
    const label = isLeaf
      ? webPageTitle
      : (labelMap && labelMap[token]) || humanizeToken(token);

    itemListElement.push({
      '@type': 'ListItem',
      position,
      name: label,
      item: `${baseUrl}${cumulativePath}`,
    });
    position += 1;
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement,
  };
}

/**
 * Convert a URL slug like "quick-start" to "Quick Start" as a sane fallback
 * for tokens not explicitly mapped in breadcrumbLabelMap.
 */
function humanizeToken(token) {
  return token
    .split('-')
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/**
 * Find the WebPage entry in a graph and return its `name` field.
 * Used to recover the current page title when the stackql plugin
 * wrote "undefined" into the breadcrumb leaf.
 */
function readWebPageName(graph) {
  if (!Array.isArray(graph)) return null;
  for (const node of graph) {
    if (node && node['@type'] === 'WebPage' && typeof node.name === 'string') {
      return node.name;
    }
  }
  return null;
}

/**
 * Walk a directory recursively, returning every .html file path.
 */
function walkHtmlFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

module.exports = function structuredDataFixPlugin(context) {
  const { siteConfig } = context;
  const themeConfig = siteConfig.themeConfig || {};
  const structuredData = themeConfig.structuredData || {};
  const labelMap = structuredData.breadcrumbLabelMap || {};
  const baseUrl = siteConfig.url;

  return {
    name: 'docusaurus-plugin-structured-data-fix',

    async postBuild({ outDir }) {
      if (!fs.existsSync(outDir)) return;

      const htmlFiles = walkHtmlFiles(outDir);
      let fixedCount = 0;

      for (const filePath of htmlFiles) {
        let html;
        try {
          html = fs.readFileSync(filePath, 'utf8');
        } catch (e) {
          continue;
        }

        // Cheap early exit: if the file has no JSON-LD at all, skip jsdom.
        if (!html.includes('application/ld+json')) continue;

        let dom;
        try {
          dom = new JSDOM(html);
        } catch (e) {
          continue;
        }

        const doc = dom.window.document;
        const scripts = Array.from(doc.querySelectorAll(LD_SCRIPT_SELECTOR));
        let mutated = false;

        // Derive the route from the file path. e.g.
        // outDir/api/authentication/index.html -> /api/authentication
        // outDir/api.html -> /api (rare, HTML-file route)
        const rel = path.relative(outDir, filePath).replace(/\\/g, '/');
        let route;
        if (rel === 'index.html') {
          route = '/';
        } else if (rel.endsWith('/index.html')) {
          route = `/${rel.slice(0, -'/index.html'.length)}`;
        } else if (rel.endsWith('.html')) {
          route = `/${rel.slice(0, -'.html'.length)}`;
        } else {
          continue;
        }

        for (const script of scripts) {
          const raw = script.textContent;
          if (!raw) continue;

          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch (e) {
            continue;
          }

          // Case 1: the stackql @graph payload. Walk the graph and fix any
          // broken BreadcrumbList in-place.
          if (parsed && Array.isArray(parsed['@graph'])) {
            let graphMutated = false;
            for (let i = 0; i < parsed['@graph'].length; i += 1) {
              const node = parsed['@graph'][i];
              if (!isBrokenBreadcrumb(node)) continue;

              const breadcrumbId = node['@id'] || `${baseUrl}${route}/#breadcrumb`;
              // Recover the page title from the WebPage entry in the same graph.
              const webPageName = readWebPageName(parsed['@graph']);
              const leafTitle = webPageName || humanizeToken(route.split('/').filter(Boolean).pop() || '');

              parsed['@graph'][i] = buildBreadcrumb(
                route,
                leafTitle,
                baseUrl,
                breadcrumbId,
                labelMap,
              );
              graphMutated = true;
            }
            if (graphMutated) {
              script.textContent = JSON.stringify(parsed);
              mutated = true;
              fixedCount += 1;
            }
            continue;
          }

          // Case 2: a standalone BreadcrumbList (not inside a graph) that is
          // broken. This path isn't currently hit in Silhouette's build -
          // Docusaurus' native DocBreadcrumbs emits a minimal-but-valid
          // BreadcrumbList - but we handle it defensively for forward-compat.
          if (parsed && parsed['@type'] === 'BreadcrumbList' && isBrokenBreadcrumb(parsed)) {
            const breadcrumbId = parsed['@id'] || `${baseUrl}${route}/#breadcrumb`;
            const titleEl = doc.querySelector('title');
            const leafTitle = (titleEl && titleEl.textContent) || humanizeToken(route.split('/').filter(Boolean).pop() || '');
            const fixed = buildBreadcrumb(route, leafTitle, baseUrl, breadcrumbId, labelMap);
            // Preserve the top-level @context when present.
            if (parsed['@context']) fixed['@context'] = parsed['@context'];
            script.textContent = JSON.stringify(fixed);
            mutated = true;
            fixedCount += 1;
          }
        }

        if (mutated) {
          fs.writeFileSync(filePath, dom.serialize());
        }
      }

      if (fixedCount > 0) {
        console.log(
          `[structured-data-fix] repaired ${fixedCount} malformed BreadcrumbList entries`,
        );
      }
    },
  };
};

// Exported for unit tests. Not part of the plugin's public surface.
module.exports._test = {
  isBrokenBreadcrumb,
  buildBreadcrumb,
  humanizeToken,
  readWebPageName,
};

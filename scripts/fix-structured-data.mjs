#!/usr/bin/env node
/*
 * fix-structured-data
 *
 * Standalone post-build script that repairs the malformed BreadcrumbList
 * JSON-LD emitted by @stackql/docusaurus-plugin-structured-data.
 *
 * Why a standalone script and not a Docusaurus plugin?
 *
 * The same fix logic was originally a Docusaurus plugin
 * (src/plugins/structured-data-fix). Empirically, Docusaurus does NOT
 * guarantee that postBuild hooks run in plugin-registration order, and
 * the stackql plugin's postBuild was racing ours and overwriting the
 * repaired output. Running the fix as a separate Node script after
 * `docusaurus build` exits sidesteps the race entirely.
 *
 * Invoked from the npm `postbuild` lifecycle in package.json. Runs after
 * Docusaurus has fully finished writing the build/ directory.
 *
 * The bug being repaired: stackql's BreadcrumbList generator switch on
 * routeArray.length only handles ancestor tokens `docs` and `blog`. For
 * any other ancestor token (api, trading, architecture, concepts, etc.)
 * the case-1 branch falls through with pageName undefined and
 * elementIndex still at its init value of 1. The result is a
 * BreadcrumbList where the second item has position 1 (duplicate) and
 * name "undefined". Google Rich Results Test rejects it. AI citation
 * scorers ignore it.
 *
 * The fix rebuilds the BreadcrumbList from the route path using the
 * breadcrumbLabelMap from docusaurus.config.ts so every item has a
 * unique sequential position and a real name.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve, basename, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import matter from 'gray-matter';

const BASE_URL = 'https://docs.silhouette.exchange';
const OUT_DIR = resolve(process.cwd(), 'build');

// Mirrors themeConfig.structuredData.breadcrumbLabelMap in docusaurus.config.ts.
// Keep in sync with that map when adding new top-level sections.
const LABEL_MAP = {
  'about-silhouette': 'About',
  quickstart: 'Quickstart',
  trading: 'Trading',
  architecture: 'Architecture',
  api: 'API',
  sdk: 'Python SDK',
  guides: 'Guides',
  glossary: 'Glossary',
  faq: 'FAQs',
  onboarding: 'Onboarding',
};

const LD_SELECTOR = 'script[type="application/ld+json"]';
/*
 * Sentinel value that the upstream @stackql plugin emits when no per-page
 * datePublished is configured (themeConfig.structuredData.webpage.datePublished
 * defaults to '2025-01-01' in docusaurus.config.ts). Our TechArticleSchema
 * component mirrors this default. We only patch datePublished values that
 * match this sentinel, never overwriting a real value the source has set.
 */
const STUB_DATE_PUBLISHED = '2025-01-01';
const DOCS_DIR = resolve(process.cwd(), 'docs');
const BLOG_DIR = resolve(process.cwd(), 'blog');
const PAGES_DIR = resolve(process.cwd(), 'src/pages');

/*
 * Build a map of { route -> ISO publication date } by walking the docs/
 * and blog/ source trees, deriving each file's published route the way
 * Docusaurus does (strip the leading `\d+-` from each path segment, honour
 * front-matter slug/id where set), and reading the first-commit date
 * from git history.
 *
 * Why this map exists: the @stackql plugin only supports a single global
 * datePublished value in themeConfig (currently '2025-01-01'), which is
 * a placeholder and undermines the freshness signal for AI citation
 * scorers. Patching per-page datePublished in postBuild restores real
 * publication dates without touching upstream.
 */
function stripPrefix(segment) {
  return segment.replace(/^\d+-/, '');
}

function gitFirstCommitISO(filePath) {
  try {
    // execFile not execSync: filePath is data, must not go through a shell.
    // `--` ensures filePath is interpreted as a pathspec even if it starts
    // with a dash. `--follow` collapses renames; `--diff-filter=A` keeps
    // only Add events. In the common single-add case we get one line; in
    // the rare add->delete->re-add case the LAST line is the oldest add
    // (git log is reverse-chronological), which is what we want.
    const out = execFileSync(
      'git',
      ['log', '--diff-filter=A', '--follow', '--format=%aI', '--', filePath],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    )
      .trim()
      .split('\n')
      .filter(Boolean);
    if (out.length === 0) return null;
    return out[out.length - 1];
  } catch {
    return null;
  }
}

function deriveRouteFromSource(sourceAbsPath, baseDir, routePrefix) {
  const rel = relative(baseDir, sourceAbsPath).replace(/\\/g, '/');
  const ext = extname(rel);
  if (!['.md', '.mdx'].includes(ext)) return null;

  // Read front matter for slug/id overrides.
  let fm = {};
  try {
    fm = matter(readFileSync(sourceAbsPath, 'utf8')).data || {};
  } catch {
    fm = {};
  }

  const withoutExt = rel.slice(0, -ext.length);
  let parts = withoutExt.split('/').map(stripPrefix);

  if (typeof fm.slug === 'string' && fm.slug.length > 0) {
    if (fm.slug.startsWith('/')) {
      // Absolute slug overrides the entire path.
      parts = fm.slug.slice(1).split('/').filter(Boolean);
    } else {
      // Relative slug overrides only the final segment.
      parts[parts.length - 1] = fm.slug;
    }
  }

  const leaf = parts[parts.length - 1];
  if (leaf === 'index' || leaf === 'README') {
    parts.pop();
  }

  return `${routePrefix}${parts.join('/')}`.replace(/\/+$/, '') || '/';
}

function walkSources(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSources(full, out);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      out.push(full);
    }
  }
  return out;
}

function buildPubDateMap() {
  const map = new Map();
  // docs/ is mounted at routeBasePath '/' (see docusaurus.config.ts presets.docs).
  for (const f of walkSources(DOCS_DIR)) {
    const route = deriveRouteFromSource(f, DOCS_DIR, '/');
    if (!route) continue;
    const date = gitFirstCommitISO(f);
    if (date) map.set(route, date);
  }
  // src/pages/ holds non-markdown React routes (homepage, privacy, terms,
  // blog-preview). These never have markdown front-matter so route derivation
  // is filename-only. They share the same git-first-commit fallback as docs.
  if (existsSync(PAGES_DIR)) {
    for (const entry of readdirSync(PAGES_DIR, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const ext = extname(entry.name);
      if (!['.tsx', '.jsx', '.ts', '.js', '.md', '.mdx'].includes(ext)) continue;
      const base = entry.name.slice(0, -ext.length);
      if (base.startsWith('_') || base.includes('.test')) continue;
      const route = base === 'index' ? '/' : `/${base}`;
      const full = join(PAGES_DIR, entry.name);
      const date = gitFirstCommitISO(full);
      if (date && !map.has(route)) map.set(route, date);
    }
  }
  // blog/ is mounted at routeBasePath '/blog'. Docusaurus generates per-post
  // routes from the filename (or slug front-matter); we only need a
  // best-effort match here, the post-level Article schema lives elsewhere.
  for (const f of walkSources(BLOG_DIR)) {
    const rel = relative(BLOG_DIR, f).replace(/\\/g, '/');
    const ext = extname(rel);
    if (!['.md', '.mdx'].includes(ext)) continue;
    let fm = {};
    try {
      fm = matter(readFileSync(f, 'utf8')).data || {};
    } catch {
      fm = {};
    }
    const base = basename(rel, ext);
    // Docusaurus blog default: strip leading YYYY-MM-DD- prefix from filename.
    const cleanedBase = base.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const slug = typeof fm.slug === 'string' && fm.slug.length > 0
      ? (fm.slug.startsWith('/') ? fm.slug.slice(1) : fm.slug)
      : cleanedBase;
    const route = `/blog/${slug}`;
    const date =
      (typeof fm.date === 'string' && fm.date) ||
      (fm.date instanceof Date && fm.date.toISOString()) ||
      gitFirstCommitISO(f);
    if (date) map.set(route, date);
  }
  return map;
}

function humanizeToken(token) {
  return token
    .split('-')
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function isBrokenBreadcrumb(node) {
  if (!node || node['@type'] !== 'BreadcrumbList') return false;
  const items = node.itemListElement;
  if (!Array.isArray(items) || items.length === 0) return false;
  const positions = new Set();
  for (const item of items) {
    if (!item || typeof item !== 'object') return true;
    if (
      item.name === undefined ||
      item.name === null ||
      item.name === 'undefined' ||
      item.name === ''
    ) {
      return true;
    }
    if (item.position === undefined || item.position === null) return true;
    if (positions.has(item.position)) return true;
    positions.add(item.position);
  }
  const sorted = [...positions].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) return true;
  }
  return false;
}

function readWebPageName(graph) {
  if (!Array.isArray(graph)) return null;
  for (const node of graph) {
    if (node && node['@type'] === 'WebPage' && typeof node.name === 'string') {
      return node.name;
    }
  }
  return null;
}

function buildBreadcrumb(route, webPageTitle, breadcrumbId) {
  const itemListElement = [];
  let position = 1;

  itemListElement.push({
    '@type': 'ListItem',
    position,
    name: 'Home',
    item: `${BASE_URL}/`,
  });
  position += 1;

  const segments = route.split('/').filter((s) => s.length > 0);
  if (segments.length === 0) {
    return {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement,
    };
  }

  let cumulativePath = '';
  for (let i = 0; i < segments.length; i += 1) {
    const token = segments[i];
    cumulativePath += `/${token}`;
    const isLeaf = i === segments.length - 1;
    const label = isLeaf ? webPageTitle : LABEL_MAP[token] || humanizeToken(token);

    itemListElement.push({
      '@type': 'ListItem',
      position,
      name: label,
      item: `${BASE_URL}${cumulativePath}`,
    });
    position += 1;
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement,
  };
}

function walkHtmlFiles(dir, out = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function routeFromPath(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}`;
  if (rel.endsWith('.html')) return `/${rel.slice(0, -'.html'.length)}`;
  return null;
}

function fixFile(filePath, pubDateMap) {
  const html = readFileSync(filePath, 'utf8');
  if (!html.includes('application/ld+json')) return { breadcrumb: false, datePublished: false };

  const rel = relative(OUT_DIR, filePath).replace(/\\/g, '/');
  const route = routeFromPath(rel);
  if (!route) return { breadcrumb: false, datePublished: false };

  const needsBreadcrumbFix =
    html.includes('"name":"undefined"') || html.includes('"name": "undefined"');
  const realPubDate = pubDateMap.get(route);
  const needsDateFix = !!realPubDate && html.includes(`"datePublished":"${STUB_DATE_PUBLISHED}"`);

  if (!needsBreadcrumbFix && !needsDateFix) {
    return { breadcrumb: false, datePublished: false };
  }

  let dom;
  try {
    dom = new JSDOM(html);
  } catch {
    return { breadcrumb: false, datePublished: false };
  }

  const doc = dom.window.document;
  const scripts = Array.from(doc.querySelectorAll(LD_SELECTOR));
  let breadcrumbFixed = false;
  let dateFixed = false;

  for (const script of scripts) {
    const raw = script.textContent;
    if (!raw) continue;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }

    let mutated = false;

    if (parsed && Array.isArray(parsed['@graph'])) {
      for (let i = 0; i < parsed['@graph'].length; i += 1) {
        const node = parsed['@graph'][i];
        if (isBrokenBreadcrumb(node)) {
          const breadcrumbId = node['@id'] || `${BASE_URL}${route}/#breadcrumb`;
          const webPageName = readWebPageName(parsed['@graph']);
          const leafTitle =
            webPageName || humanizeToken(route.split('/').filter(Boolean).pop() || 'Home');
          parsed['@graph'][i] = buildBreadcrumb(route, leafTitle, breadcrumbId);
          breadcrumbFixed = true;
          mutated = true;
        }
        // Patch any node carrying the stub datePublished placeholder.
        // Today stackql only sets it on WebPage and we set it on TechArticle
        // separately, but matching by value (not type) keeps us correct if
        // upstream consolidates the graph or another schema component lands
        // inside it later.
        if (
          realPubDate &&
          node &&
          typeof node === 'object' &&
          node.datePublished === STUB_DATE_PUBLISHED
        ) {
          node.datePublished = realPubDate;
          dateFixed = true;
          mutated = true;
        }
      }
      if (mutated) {
        script.textContent = JSON.stringify(parsed);
      }
      continue;
    }

    if (parsed && parsed['@type'] === 'BreadcrumbList' && isBrokenBreadcrumb(parsed)) {
      const breadcrumbId = parsed['@id'] || `${BASE_URL}${route}/#breadcrumb`;
      const titleEl = doc.querySelector('title');
      const leafTitle =
        (titleEl && titleEl.textContent) ||
        humanizeToken(route.split('/').filter(Boolean).pop() || 'Home');
      const fixed = buildBreadcrumb(route, leafTitle, breadcrumbId);
      if (parsed['@context']) fixed['@context'] = parsed['@context'];
      script.textContent = JSON.stringify(fixed);
      breadcrumbFixed = true;
    }

    if (
      realPubDate &&
      parsed &&
      typeof parsed === 'object' &&
      parsed.datePublished === STUB_DATE_PUBLISHED
    ) {
      parsed.datePublished = realPubDate;
      script.textContent = JSON.stringify(parsed);
      dateFixed = true;
    }
  }

  if (breadcrumbFixed || dateFixed) {
    writeFileSync(filePath, dom.serialize());
  }
  return { breadcrumb: breadcrumbFixed, datePublished: dateFixed };
}

function main() {
  if (!existsSync(OUT_DIR) || !statSync(OUT_DIR).isDirectory()) {
    console.log('[fix-structured-data] no build/ directory, skipping');
    return;
  }

  const pubDateMap = buildPubDateMap();
  console.log(
    `[fix-structured-data] built publication-date map from git history: ${pubDateMap.size} routes`,
  );

  const files = walkHtmlFiles(OUT_DIR);
  let breadcrumbFixed = 0;
  let dateFixed = 0;
  for (const f of files) {
    const result = fixFile(f, pubDateMap);
    if (result.breadcrumb) breadcrumbFixed += 1;
    if (result.datePublished) dateFixed += 1;
  }
  console.log(
    `[fix-structured-data] repaired ${breadcrumbFixed} BreadcrumbList entries, ` +
      `patched ${dateFixed} datePublished values from git history`,
  );
}

// Run only when invoked directly (not when imported by tests). Use
// pathToFileURL so a working-tree path containing spaces (or any other
// URL-special character) round-trips correctly. The naive
// `'file://' + process.argv[1]` comparison silently fails on those paths
// because import.meta.url percent-encodes them.
const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main();
}

// Exports for unit tests. Not part of the script's public surface.
export const __test = {
  isBrokenBreadcrumb,
  buildBreadcrumb,
  humanizeToken,
  deriveRouteFromSource,
  fixFile,
  readWebPageName,
  stripPrefix,
  routeFromPath,
};

import { describe, it, expect } from 'vitest';

// The plugin is plain CJS. Require it through a relative path so the
// Node resolver picks up the .js file directly.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('./index.js');
const { isBrokenBreadcrumb, buildBreadcrumb, humanizeToken, readWebPageName } = plugin._test;

describe('structured-data-fix helpers', () => {
  describe('isBrokenBreadcrumb', () => {
    it('detects duplicate positions', () => {
      const breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
          { '@type': 'ListItem', position: 1, name: 'undefined' },
        ],
      };
      expect(isBrokenBreadcrumb(breadcrumb)).toBe(true);
    });

    it('detects "undefined" name items', () => {
      const breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
          { '@type': 'ListItem', position: 2, name: 'undefined' },
        ],
      };
      expect(isBrokenBreadcrumb(breadcrumb)).toBe(true);
    });

    it('detects missing names', () => {
      const breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
          { '@type': 'ListItem', position: 2 },
        ],
      };
      expect(isBrokenBreadcrumb(breadcrumb)).toBe(true);
    });

    it('detects non-sequential positions', () => {
      const breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home' },
          { '@type': 'ListItem', position: 3, name: 'Leaf' },
        ],
      };
      expect(isBrokenBreadcrumb(breadcrumb)).toBe(true);
    });

    it('passes a valid two-item breadcrumb', () => {
      const breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
          { '@type': 'ListItem', position: 2, name: 'FAQs', item: 'https://example.com/faq' },
        ],
      };
      expect(isBrokenBreadcrumb(breadcrumb)).toBe(false);
    });

    it('passes a valid three-item nested breadcrumb', () => {
      const breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
          { '@type': 'ListItem', position: 2, name: 'API', item: 'https://example.com/api' },
          { '@type': 'ListItem', position: 3, name: 'Authentication', item: 'https://example.com/api/authentication' },
        ],
      };
      expect(isBrokenBreadcrumb(breadcrumb)).toBe(false);
    });

    it('ignores non-BreadcrumbList nodes', () => {
      expect(isBrokenBreadcrumb({ '@type': 'WebPage' })).toBe(false);
      expect(isBrokenBreadcrumb(null)).toBe(false);
      expect(isBrokenBreadcrumb(undefined)).toBe(false);
    });
  });

  describe('buildBreadcrumb', () => {
    const baseUrl = 'https://docs.silhouette.exchange';
    const labelMap = {
      api: 'API',
      concepts: 'Core Concepts',
      architecture: 'Architecture',
    };

    it('builds a nested breadcrumb for /api/authentication', () => {
      const result = buildBreadcrumb('/api/authentication', 'Authentication', baseUrl, '#breadcrumb', labelMap);
      expect(result['@type']).toBe('BreadcrumbList');
      expect(result['@id']).toBe('#breadcrumb');
      expect(result.itemListElement).toHaveLength(3);
      expect(result.itemListElement[0]).toMatchObject({
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      });
      expect(result.itemListElement[1]).toMatchObject({
        position: 2,
        name: 'API',
        item: `${baseUrl}/api`,
      });
      expect(result.itemListElement[2]).toMatchObject({
        position: 3,
        name: 'Authentication',
        item: `${baseUrl}/api/authentication`,
      });
    });

    it('builds a two-item breadcrumb for a top-level page', () => {
      const result = buildBreadcrumb('/faq', 'FAQs', baseUrl, '#bc', labelMap);
      expect(result.itemListElement).toHaveLength(2);
      expect(result.itemListElement[0].name).toBe('Home');
      expect(result.itemListElement[1]).toMatchObject({
        position: 2,
        name: 'FAQs',
        item: `${baseUrl}/faq`,
      });
    });

    it('falls back to humanized token when labelMap has no entry', () => {
      const result = buildBreadcrumb('/concepts/tee', 'TEE', baseUrl, '#bc', labelMap);
      expect(result.itemListElement[1].name).toBe('Core Concepts');
      expect(result.itemListElement[2].name).toBe('TEE');
    });

    it('produces unique sequential positions', () => {
      const result = buildBreadcrumb('/a/b/c/d', 'Leaf', baseUrl, '#bc', {});
      const positions = result.itemListElement.map((it: { position: number }) => it.position);
      expect(positions).toEqual([1, 2, 3, 4, 5]);
    });

    it('passes isBrokenBreadcrumb after being rebuilt', () => {
      const result = buildBreadcrumb('/api/authentication', 'Authentication', baseUrl, '#bc', labelMap);
      expect(isBrokenBreadcrumb(result)).toBe(false);
    });
  });

  describe('humanizeToken', () => {
    it('converts kebab-case to Title Case', () => {
      expect(humanizeToken('quick-start')).toBe('Quick Start');
      expect(humanizeToken('naked-vs-shielded')).toBe('Naked Vs Shielded');
      expect(humanizeToken('tee')).toBe('Tee');
    });
  });

  describe('readWebPageName', () => {
    it('extracts the WebPage name from a graph', () => {
      const graph = [
        { '@type': 'WebPage', name: 'Authentication' },
        { '@type': 'BreadcrumbList', itemListElement: [] },
      ];
      expect(readWebPageName(graph)).toBe('Authentication');
    });

    it('returns null when no WebPage is present', () => {
      expect(readWebPageName([{ '@type': 'WebSite' }])).toBeNull();
      expect(readWebPageName([])).toBeNull();
      expect(readWebPageName(null)).toBeNull();
    });
  });
});

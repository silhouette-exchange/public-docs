import { describe, it, expect } from 'vitest';
// @ts-ignore: reaching across into a .mjs script; the script exposes its
// pure helpers via the `__test` named export specifically for this test.
import { __test } from '../../scripts/fix-structured-data.mjs';

const { isBrokenBreadcrumb, buildBreadcrumb, humanizeToken, readWebPageName, routeFromPath } =
  __test;

describe('isBrokenBreadcrumb', () => {
  it('flags duplicate positions as broken', () => {
    expect(
      isBrokenBreadcrumb({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://x/' },
          { '@type': 'ListItem', position: 1, name: 'undefined' },
        ],
      }),
    ).toBe(true);
  });

  it('flags name="undefined" as broken', () => {
    expect(
      isBrokenBreadcrumb({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'undefined', item: 'https://x/' },
        ],
      }),
    ).toBe(true);
  });

  it('flags missing name as broken', () => {
    expect(
      isBrokenBreadcrumb({
        '@type': 'BreadcrumbList',
        itemListElement: [{ '@type': 'ListItem', position: 1, item: 'https://x/' }],
      }),
    ).toBe(true);
  });

  it('flags non-sequential positions as broken', () => {
    expect(
      isBrokenBreadcrumb({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://x/' },
          { '@type': 'ListItem', position: 3, name: 'Skip', item: 'https://x/skip' },
        ],
      }),
    ).toBe(true);
  });

  it('accepts well-formed sequential breadcrumbs', () => {
    expect(
      isBrokenBreadcrumb({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://x/' },
          { '@type': 'ListItem', position: 2, name: 'Trading', item: 'https://x/trading' },
          { '@type': 'ListItem', position: 3, name: 'Fees', item: 'https://x/trading/fees' },
        ],
      }),
    ).toBe(false);
  });

  it('returns false for non-BreadcrumbList nodes', () => {
    expect(isBrokenBreadcrumb({ '@type': 'WebPage', name: 'whatever' })).toBe(false);
    expect(isBrokenBreadcrumb(null)).toBe(false);
    expect(isBrokenBreadcrumb({ '@type': 'BreadcrumbList', itemListElement: [] })).toBe(false);
  });
});

describe('buildBreadcrumb', () => {
  it('emits sequential positions and humanises unknown tokens', () => {
    const built = buildBreadcrumb('/api/authentication', 'Authentication', 'https://x/api/authentication/#breadcrumb');
    expect(built.itemListElement).toHaveLength(3);
    expect(built.itemListElement[0]).toMatchObject({ position: 1, name: 'Home' });
    // 'api' is not in the default label map of the helper (lives in the
    // main script), so it humanises to "Api" via the fallback.
    expect(built.itemListElement[1].position).toBe(2);
    expect(built.itemListElement[2]).toMatchObject({ position: 3, name: 'Authentication' });
  });

  it('returns a Home-only breadcrumb for "/"', () => {
    const built = buildBreadcrumb('/', 'Home', 'https://x/#breadcrumb');
    expect(built.itemListElement).toHaveLength(1);
    expect(built.itemListElement[0]).toMatchObject({ position: 1, name: 'Home' });
  });

  it('preserves the supplied @id', () => {
    const built = buildBreadcrumb('/faq', 'FAQs', 'custom-id');
    expect(built['@id']).toBe('custom-id');
  });
});

describe('humanizeToken', () => {
  it('converts kebab-case to Title Case', () => {
    expect(humanizeToken('shielded-trading')).toBe('Shielded Trading');
    expect(humanizeToken('about-silhouette')).toBe('About Silhouette');
  });

  it('handles single tokens', () => {
    expect(humanizeToken('faq')).toBe('Faq');
  });
});

describe('readWebPageName', () => {
  it('returns the WebPage name from a graph', () => {
    const graph = [
      { '@type': 'WebSite', name: 'Site' },
      { '@type': 'WebPage', name: 'Fees' },
    ];
    expect(readWebPageName(graph)).toBe('Fees');
  });

  it('returns null when no WebPage is present', () => {
    expect(readWebPageName([{ '@type': 'WebSite', name: 'Site' }])).toBe(null);
    expect(readWebPageName(null)).toBe(null);
  });
});

describe('routeFromPath', () => {
  it('maps index.html to /', () => {
    expect(routeFromPath('index.html')).toBe('/');
  });

  it('maps section/index.html to /section', () => {
    expect(routeFromPath('trading/fees/index.html')).toBe('/trading/fees');
  });

  it('maps page.html to /page', () => {
    expect(routeFromPath('api.html')).toBe('/api');
  });

  it('returns null for non-html paths', () => {
    expect(routeFromPath('robots.txt')).toBe(null);
  });
});

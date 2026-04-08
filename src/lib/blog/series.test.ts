// src/lib/blog/series.test.ts
import { describe, it, expect } from 'vitest';
import {
  getSeriesPosts,
  getSeriesNavigation,
  getSeries,
  validateSeriesFrontmatter,
  type BlogPostLike,
} from './series';

function makePost(
  permalink: string,
  frontMatter: Record<string, unknown>
): BlogPostLike {
  return {
    metadata: {
      permalink,
      frontMatter,
    },
  };
}

describe('getSeries', () => {
  it('returns the silhouette-primer series definition', () => {
    const series = getSeries('silhouette-primer');
    expect(series.slug).toBe('silhouette-primer');
    expect(series.label).toBe('The Silhouette Series');
    expect(series.eyebrow).toBe('THE SILHOUETTE SERIES');
  });

  it('throws on unknown series slug', () => {
    expect(() => getSeries('nonexistent')).toThrow(/unknown series/i);
  });
});

describe('getSeriesPosts', () => {
  it('returns empty array when no posts are in the series', () => {
    const posts = [
      makePost('/blog/one', { category: 'research' }),
      makePost('/blog/two', { category: 'research' }),
    ];
    expect(getSeriesPosts('silhouette-primer', posts)).toEqual([]);
  });

  it('returns posts filtered by series and sorted by series_order', () => {
    const posts = [
      makePost('/blog/c', { series: 'silhouette-primer', series_order: 3 }),
      makePost('/blog/a', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/b', { series: 'silhouette-primer', series_order: 2 }),
      makePost('/blog/not-in-series', {}),
    ];
    const result = getSeriesPosts('silhouette-primer', posts);
    expect(result).toHaveLength(3);
    expect(result.map((p) => p.metadata.permalink)).toEqual([
      '/blog/a',
      '/blog/b',
      '/blog/c',
    ]);
  });

  it('ignores posts that belong to a different series', () => {
    const posts = [
      makePost('/blog/a', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/b', { series: 'other', series_order: 1 }),
    ];
    expect(getSeriesPosts('silhouette-primer', posts)).toHaveLength(1);
  });
});

describe('getSeriesNavigation', () => {
  const seriesPosts = [
    makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
    makePost('/blog/2', { series: 'silhouette-primer', series_order: 2 }),
    makePost('/blog/3', { series: 'silhouette-primer', series_order: 3 }),
  ];

  it('returns null for both when post is not in a series', () => {
    const orphan = makePost('/blog/orphan', {});
    const nav = getSeriesNavigation(orphan, seriesPosts);
    expect(nav.previous).toBe(null);
    expect(nav.next).toBe(null);
  });

  it('returns null previous for the first post', () => {
    const first = seriesPosts[0];
    const nav = getSeriesNavigation(first, seriesPosts);
    expect(nav.previous).toBe(null);
    expect(nav.next?.metadata.permalink).toBe('/blog/2');
  });

  it('returns previous and next for a middle post', () => {
    const middle = seriesPosts[1];
    const nav = getSeriesNavigation(middle, seriesPosts);
    expect(nav.previous?.metadata.permalink).toBe('/blog/1');
    expect(nav.next?.metadata.permalink).toBe('/blog/3');
  });

  it('returns null next for the last post', () => {
    const last = seriesPosts[2];
    const nav = getSeriesNavigation(last, seriesPosts);
    expect(nav.previous?.metadata.permalink).toBe('/blog/2');
    expect(nav.next).toBe(null);
  });

  it('returns nulls when current post is alone in its series', () => {
    const lone = makePost('/blog/lone', {
      series: 'silhouette-primer',
      series_order: 1,
    });
    const nav = getSeriesNavigation(lone, [lone]);
    expect(nav.previous).toBe(null);
    expect(nav.next).toBe(null);
  });
});

describe('validateSeriesFrontmatter', () => {
  it('returns no errors for a valid series set', () => {
    const posts = [
      makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/2', { series: 'silhouette-primer', series_order: 2 }),
      makePost('/blog/3', { series: 'silhouette-primer', series_order: 3 }),
    ];
    expect(validateSeriesFrontmatter(posts)).toEqual([]);
  });

  it('returns no errors when no posts have a series', () => {
    const posts = [
      makePost('/blog/a', { category: 'research' }),
      makePost('/blog/b', { category: 'guides' }),
    ];
    expect(validateSeriesFrontmatter(posts)).toEqual([]);
  });

  it('flags a post with series but no series_order', () => {
    const posts = [makePost('/blog/broken', { series: 'silhouette-primer' })];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/series_order/);
  });

  it('flags duplicate series_order within a series', () => {
    const posts = [
      makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/2', { series: 'silhouette-primer', series_order: 1 }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors.join(' ')).toMatch(/duplicate/i);
  });

  it('flags a gap in series_order', () => {
    const posts = [
      makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/3', { series: 'silhouette-primer', series_order: 3 }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.join(' ')).toMatch(/gap/i);
  });

  it('flags a reference to an unknown series', () => {
    const posts = [
      makePost('/blog/x', { series: 'not-a-series', series_order: 1 }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.join(' ')).toMatch(/unknown series/i);
  });

  it('flags a non-integer series_order', () => {
    const posts = [
      makePost('/blog/x', { series: 'silhouette-primer', series_order: 'first' }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it('flags a zero or negative series_order', () => {
    const posts = [
      makePost('/blog/x', { series: 'silhouette-primer', series_order: 0 }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });
});

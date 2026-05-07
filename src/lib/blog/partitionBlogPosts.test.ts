// src/lib/blog/partitionBlogPosts.test.ts
import { describe, it, expect } from 'vitest';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';
import { partitionBlogPosts } from './partitionBlogPosts';

/**
 * makePost builds a valid BlogPostLike for tests with sensible defaults
 * so individual test cases only need to pass the fields they care about.
 */
function makePost(overrides: Partial<BlogPostLike> & { slug: string }): BlogPostLike {
  return {
    slug: overrides.slug,
    title: `Title for ${overrides.slug}`,
    permalink: `/blog/${overrides.slug}`,
    category: 'research',
    readingTime: 3,
    authorName: 'Silhouette Team',
    date: '2026-04-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('partitionBlogPosts', () => {
  describe('All view (activeFilter = null)', () => {
    it('returns everything under filtered and the first post as hero', () => {
      const posts = [
        makePost({ slug: 'a' }),
        makePost({ slug: 'b' }),
        makePost({ slug: 'c' }),
      ];
      const result = partitionBlogPosts(posts, null, 6);
      expect(result.filtered).toHaveLength(3);
      expect(result.hero?.slug).toBe('a');
      expect(result.latest.map((p) => p.slug)).toEqual(['b', 'c']);
      expect(result.archive).toEqual([]);
    });

    it('excludes series posts from latest/archive on All', () => {
      const posts = [
        makePost({ slug: 'a' }),
        makePost({ slug: 'b', series: 'silhouette-primer', seriesOrder: 1 }),
        makePost({ slug: 'c' }),
        makePost({ slug: 'd', series: 'silhouette-primer', seriesOrder: 2 }),
      ];
      const result = partitionBlogPosts(posts, null, 6);
      // Hero is first overall (not series-filtered). b and d are gone.
      expect(result.hero?.slug).toBe('a');
      expect(result.latest.map((p) => p.slug)).toEqual(['c']);
      expect(result.archive).toEqual([]);
    });

    it('still exposes series posts through filtered for the SeriesBand', () => {
      const posts = [
        makePost({ slug: 'a' }),
        makePost({ slug: 'b', series: 'silhouette-primer', seriesOrder: 1 }),
      ];
      const result = partitionBlogPosts(posts, null, 6);
      // filtered contains ALL posts; SeriesBand uses this, not latest.
      expect(result.filtered.map((p) => p.slug)).toEqual(['a', 'b']);
    });

    it('overflows into archive beyond maxLatest', () => {
      const posts = Array.from({ length: 9 }, (_, i) =>
        makePost({ slug: `p${i + 1}` }),
      );
      const result = partitionBlogPosts(posts, null, 6);
      expect(result.hero?.slug).toBe('p1');
      expect(result.latest.map((p) => p.slug)).toEqual([
        'p2',
        'p3',
        'p4',
        'p5',
        'p6',
        'p7',
      ]);
      expect(result.archive.map((p) => p.slug)).toEqual(['p8', 'p9']);
    });
  });

  describe('filtered view (activeFilter set)', () => {
    it('returns only posts matching the active filter', () => {
      const posts = [
        makePost({ slug: 'r1', category: 'research' }),
        makePost({ slug: 'g1', category: 'guides' }),
        makePost({ slug: 'r2', category: 'research' }),
      ];
      const result = partitionBlogPosts(posts, 'research', 6);
      expect(result.filtered.map((p) => p.slug)).toEqual(['r1', 'r2']);
      expect(result.hero?.slug).toBe('r1');
      expect(result.latest.map((p) => p.slug)).toEqual(['r2']);
    });

    it('does NOT exclude series posts on a filtered view', () => {
      // On Research view, series posts in the Research category
      // should still appear because the user has opted in to a flat
      // category listing.
      const posts = [
        makePost({
          slug: 'r1',
          category: 'research',
          series: 'silhouette-primer',
          seriesOrder: 1,
        }),
        makePost({
          slug: 'r2',
          category: 'research',
          series: 'silhouette-primer',
          seriesOrder: 2,
        }),
        makePost({ slug: 'r3', category: 'research' }),
      ];
      const result = partitionBlogPosts(posts, 'research', 6);
      expect(result.filtered).toHaveLength(3);
      expect(result.hero?.slug).toBe('r1');
      expect(result.latest.map((p) => p.slug)).toEqual(['r2', 'r3']);
    });

    it('returns undefined hero and empty arrays when no posts match', () => {
      const posts = [
        makePost({ slug: 'r1', category: 'research' }),
        makePost({ slug: 'e1', category: 'explainers' }),
      ];
      const result = partitionBlogPosts(posts, 'guides', 6);
      expect(result.filtered).toEqual([]);
      expect(result.hero).toBeUndefined();
      expect(result.latest).toEqual([]);
      expect(result.archive).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('handles empty input', () => {
      const result = partitionBlogPosts([], null, 6);
      expect(result.filtered).toEqual([]);
      expect(result.hero).toBeUndefined();
      expect(result.latest).toEqual([]);
      expect(result.archive).toEqual([]);
    });

    it('handles a single-post list (hero only, no latest or archive)', () => {
      const posts = [makePost({ slug: 'solo' })];
      const result = partitionBlogPosts(posts, null, 6);
      expect(result.hero?.slug).toBe('solo');
      expect(result.latest).toEqual([]);
      expect(result.archive).toEqual([]);
    });

    it('respects a custom maxLatest of 0 (archive takes everything)', () => {
      const posts = [
        makePost({ slug: 'a' }),
        makePost({ slug: 'b' }),
        makePost({ slug: 'c' }),
      ];
      const result = partitionBlogPosts(posts, null, 0);
      expect(result.hero?.slug).toBe('a');
      expect(result.latest).toEqual([]);
      expect(result.archive.map((p) => p.slug)).toEqual(['b', 'c']);
    });
  });
});

// src/lib/blog/toBlogPostLike.test.ts
import { describe, it, expect } from 'vitest';
import { toBlogPostLike, type DocusaurusBlogItem } from './toBlogPostLike';

/**
 * makeItem builds a valid minimal Docusaurus blog item for tests and
 * lets each test override a subset of the fields it cares about. The
 * override object is shallow-merged so nested metadata / frontMatter
 * patches land in the right place.
 */
function makeItem(
  overrides: {
    metadata?: Partial<DocusaurusBlogItem['content']['metadata']>;
    /**
     * If set, REPLACES the default frontmatter entirely. Pass {} to
     * build a post with no category (for negative tests). Pass
     * { category: 'research', slug: 'x' } to build a valid post with
     * a custom slug.
     */
    frontMatter?: Record<string, unknown>;
    /**
     * Bundler-processed assets. Simulates what Docusaurus puts on
     * item.content.assets after resolving relative `image:` paths.
     */
    assets?: { image?: string };
  } = {},
): DocusaurusBlogItem {
  return {
    content: {
      metadata: {
        permalink: '/blog/example-post',
        title: 'Example post',
        description: 'An example blog post used only in tests.',
        date: '2026-04-01T00:00:00.000Z',
        readingTime: 3.4,
        authors: [{ name: 'Silhouette Team', imageURL: '/img/team.png' }],
        ...overrides.metadata,
      },
      frontMatter: overrides.frontMatter ?? { category: 'research' },
      assets: overrides.assets,
    },
  };
}

describe('toBlogPostLike', () => {
  describe('happy path', () => {
    it('maps every expected field onto the slim shape', () => {
      const post = toBlogPostLike(makeItem());
      expect(post).toEqual({
        slug: 'example-post',
        title: 'Example post',
        permalink: '/blog/example-post',
        category: 'research',
        dek: 'An example blog post used only in tests.',
        coverImage: undefined,
        readingTime: 3,
        authorName: 'Silhouette Team',
        authorImageUrl: '/img/team.png',
        date: '2026-04-01T00:00:00.000Z',
        series: undefined,
        seriesOrder: undefined,
      });
    });

    it('reads custom frontmatter (cover, series, series_order)', () => {
      const post = toBlogPostLike(
        makeItem({
          frontMatter: {
            category: 'research',
            cover: '/img/cover.png',
            series: 'silhouette-primer',
            series_order: 2,
          },
        }),
      );
      expect(post.coverImage).toBe('/img/cover.png');
      expect(post.series).toBe('silhouette-primer');
      expect(post.seriesOrder).toBe(2);
    });

    it('prefers Docusaurus standard `image` frontmatter over custom `cover`', () => {
      const post = toBlogPostLike(
        makeItem({
          frontMatter: {
            category: 'research',
            image: '/img/from-image-field.png',
            cover: '/img/from-cover-field.png',
          },
        }),
      );
      expect(post.coverImage).toBe('/img/from-image-field.png');
    });

    it('prefers bundler-processed assets.image (hashed URL) over raw frontmatter paths', () => {
      const post = toBlogPostLike(
        makeItem({
          frontMatter: {
            category: 'research',
            image: './images/foo.png',
          },
          assets: { image: '/assets/images/foo-abc123hash.png' },
        }),
      );
      expect(post.coverImage).toBe('/assets/images/foo-abc123hash.png');
    });

    it('falls back to frontmatter image when assets.image is undefined (external URL)', () => {
      const post = toBlogPostLike(
        makeItem({
          frontMatter: {
            category: 'research',
            image: 'https://cdn.example.com/foo.png',
          },
          assets: { image: undefined },
        }),
      );
      expect(post.coverImage).toBe('https://cdn.example.com/foo.png');
    });
  });

  describe('category validation', () => {
    it('throws when category frontmatter is missing', () => {
      const item = makeItem({ frontMatter: {} });
      expect(() => toBlogPostLike(item)).toThrow(/missing a required.*category/);
    });

    it('throws when category is not a string', () => {
      const item = makeItem({ frontMatter: { category: 42 } });
      expect(() => toBlogPostLike(item)).toThrow(/category/);
    });

    it('throws when category is an empty string', () => {
      const item = makeItem({ frontMatter: { category: '' } });
      expect(() => toBlogPostLike(item)).toThrow(/category/);
    });

    it('includes the post permalink in the thrown error for debugging', () => {
      const item = makeItem({
        metadata: { permalink: '/blog/broken-post' },
        frontMatter: {},
      });
      expect(() => toBlogPostLike(item)).toThrow(/\/blog\/broken-post/);
    });
  });

  describe('slug derivation', () => {
    it('prefers the frontmatter slug when present', () => {
      const post = toBlogPostLike(
        makeItem({
          metadata: { permalink: '/blog/auto-derived' },
          frontMatter: { category: 'research', slug: 'custom-slug' },
        }),
      );
      expect(post.slug).toBe('custom-slug');
    });

    it('derives the slug from the permalink tail when no frontmatter slug', () => {
      const post = toBlogPostLike(
        makeItem({
          metadata: { permalink: '/blog/2026/tail-segment' },
        }),
      );
      expect(post.slug).toBe('tail-segment');
    });

    it('trims trailing slashes from the permalink when deriving the slug', () => {
      const post = toBlogPostLike(
        makeItem({
          metadata: { permalink: '/blog/tail/' },
        }),
      );
      expect(post.slug).toBe('tail');
    });
  });

  describe('reading time normalization', () => {
    it('rounds float minutes to the nearest int', () => {
      const post = toBlogPostLike(
        makeItem({ metadata: { readingTime: 4.6 } }),
      );
      expect(post.readingTime).toBe(5);
    });

    it('enforces a floor of 1 minute', () => {
      const post = toBlogPostLike(
        makeItem({ metadata: { readingTime: 0.2 } }),
      );
      expect(post.readingTime).toBe(1);
    });

    it('enforces a floor of 1 minute when readingTime is undefined', () => {
      const post = toBlogPostLike(
        makeItem({ metadata: { readingTime: undefined } }),
      );
      expect(post.readingTime).toBe(1);
    });
  });

  describe('author fallback', () => {
    it('falls back to Silhouette Team when authors array is empty', () => {
      const post = toBlogPostLike(
        makeItem({ metadata: { authors: [] } }),
      );
      expect(post.authorName).toBe('Silhouette Team');
      expect(post.authorImageUrl).toBeUndefined();
    });

    it('uses the first author when multiple authors are set', () => {
      const post = toBlogPostLike(
        makeItem({
          metadata: {
            authors: [
              { name: 'Wayne', imageURL: '/img/wayne.png' },
              { name: 'Jerri', imageURL: '/img/jerri.png' },
            ],
          },
        }),
      );
      expect(post.authorName).toBe('Wayne');
      expect(post.authorImageUrl).toBe('/img/wayne.png');
    });

    it('handles an author with no name', () => {
      const post = toBlogPostLike(
        makeItem({ metadata: { authors: [{ imageURL: '/img/anon.png' }] } }),
      );
      expect(post.authorName).toBe('Silhouette Team');
      expect(post.authorImageUrl).toBe('/img/anon.png');
    });
  });

  describe('dek (description)', () => {
    it('uses metadata.description when present', () => {
      const post = toBlogPostLike(
        makeItem({ metadata: { description: 'A dek.' } }),
      );
      expect(post.dek).toBe('A dek.');
    });

    it('returns undefined dek for empty description', () => {
      const post = toBlogPostLike(
        makeItem({ metadata: { description: '' } }),
      );
      expect(post.dek).toBeUndefined();
    });
  });
});

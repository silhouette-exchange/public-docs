// src/lib/blog/series.ts
//
// Series resolution helpers. See design doc §7 for the schema.
//
// BlogPostLike is a structural subset of Docusaurus's blog post type
// that contains only the fields we need. This lets the lib be tested
// in isolation without importing Docusaurus types.

import { SERIES, type SeriesDefinition } from '@site/src/data/blog/series';

export interface BlogPostLike {
  metadata: {
    permalink: string;
    frontMatter: Record<string, unknown>;
  };
}

/** Get a series definition by slug. Throws on unknown slug. */
export function getSeries(slug: string): SeriesDefinition {
  const series = SERIES[slug];
  if (!series) {
    throw new Error(
      `Unknown series: "${slug}". Valid slugs: ${Object.keys(SERIES).join(', ')}`
    );
  }
  return series;
}

/** Get all posts that belong to a series, sorted by series_order ascending. */
export function getSeriesPosts<T extends BlogPostLike>(
  seriesSlug: string,
  allPosts: readonly T[]
): T[] {
  return allPosts
    .filter((post) => post.metadata.frontMatter.series === seriesSlug)
    .slice()
    .sort((a, b) => {
      const aOrder = Number(a.metadata.frontMatter.series_order ?? 0);
      const bOrder = Number(b.metadata.frontMatter.series_order ?? 0);
      return aOrder - bOrder;
    });
}

/**
 * Given a post and the full list of posts, return the previous and next
 * posts in the same series. Returns null if the post is not in a series
 * or if the post is at the respective boundary.
 */
export function getSeriesNavigation<T extends BlogPostLike>(
  currentPost: T,
  allPosts: readonly T[]
): { previous: T | null; next: T | null } {
  const series = currentPost.metadata.frontMatter.series;
  if (!series || typeof series !== 'string') {
    return { previous: null, next: null };
  }

  const seriesPosts = getSeriesPosts(series, allPosts);
  if (seriesPosts.length < 2) {
    return { previous: null, next: null };
  }

  const currentIndex = seriesPosts.findIndex(
    (p) => p.metadata.permalink === currentPost.metadata.permalink
  );
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next:
      currentIndex < seriesPosts.length - 1
        ? seriesPosts[currentIndex + 1]
        : null,
  };
}

/**
 * Validate frontmatter across all posts. Returns a list of human-readable
 * error messages (empty array if valid). Called from the prebuild script
 * to fail the build on series misconfiguration before Docusaurus runs.
 */
export function validateSeriesFrontmatter<T extends BlogPostLike>(
  allPosts: readonly T[]
): string[] {
  const errors: string[] = [];
  const postsBySeriesSlug: Record<string, T[]> = {};

  for (const post of allPosts) {
    const series = post.metadata.frontMatter.series;
    if (series === undefined || series === null) continue;

    if (typeof series !== 'string') {
      errors.push(
        `${post.metadata.permalink}: frontmatter 'series' must be a string`
      );
      continue;
    }

    if (!(series in SERIES)) {
      errors.push(
        `${post.metadata.permalink}: unknown series "${series}". Valid: ${Object.keys(SERIES).join(', ')}`
      );
      continue;
    }

    const order = post.metadata.frontMatter.series_order;
    if (order === undefined || order === null) {
      errors.push(
        `${post.metadata.permalink}: frontmatter 'series' requires 'series_order' (missing)`
      );
      continue;
    }
    if (typeof order !== 'number' || !Number.isInteger(order) || order < 1) {
      errors.push(
        `${post.metadata.permalink}: 'series_order' must be a positive integer (got ${String(order)})`
      );
      continue;
    }

    postsBySeriesSlug[series] ??= [];
    postsBySeriesSlug[series].push(post);
  }

  // Check for duplicates and gaps within each series
  for (const [slug, posts] of Object.entries(postsBySeriesSlug)) {
    const orders = posts
      .map((p) => Number(p.metadata.frontMatter.series_order))
      .sort((a, b) => a - b);

    // duplicates
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] === orders[i - 1]) {
        errors.push(
          `Series "${slug}" has duplicate series_order=${orders[i]} (multiple posts claim the same position)`
        );
      }
    }

    // gaps (orders must be contiguous starting from 1)
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        errors.push(
          `Series "${slug}" has a gap in series_order: expected ${i + 1}, found ${orders[i]}`
        );
        break;
      }
    }
  }

  return errors;
}

export { SERIES } from '@site/src/data/blog/series';
export type { SeriesDefinition } from '@site/src/data/blog/series';

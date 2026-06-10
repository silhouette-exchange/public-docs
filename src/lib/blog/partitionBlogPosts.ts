// src/lib/blog/partitionBlogPosts.ts
//
// Pure partitioning logic for the blog listing page.
//
// Given the full list of posts (already adapted to the slim shape),
// the active category filter, and the hero / latest / archive caps,
// this function produces the arrays that the listing page hands to
// BlogHero, BlogLatestBand, and BlogArchiveList.
//
// The listing page swizzle used to inline all of this inside
// useMemo blocks. That made the swizzle harder to test because the
// logic was welded to React state and URL sync concerns. Splitting
// it out keeps the swizzle thin and gives us a single place to
// reason about the "what shows where" rules.
//
// Rules (per docs/plans/2026-04-09-blog-redesign-design.md §4):
//
// 1. activeFilter is matched against post.category. null means
//    "All", which shows every post.
// 2. The hero is the most-recent post in the filtered set (index 0
//    after the caller sorts). On an empty set the hero is undefined
//    and the listing page should not render a hero slot.
// 3. On the All view, posts belonging to an editorial series are
//    hoisted into the Silhouette Series band and excluded from the
//    Latest / Archive bands to avoid double-exposure.
// 4. On a category-filtered view, series exclusion does NOT apply -
//    category filters and series sequencing are orthogonal concepts
//    and the user has opted in to a flat category listing.
// 5. The Latest band takes up to `maxLatest` posts; the Archive band
//    takes the remainder.

import type { BlogPostLike } from "@site/src/components/blog/BlogPostCard";

export interface PartitionedPosts {
  /** All posts that match the current filter, in input order. */
  readonly filtered: readonly BlogPostLike[];
  /** Most recent matching post, or undefined if the filter matches nothing. */
  readonly hero: BlogPostLike | undefined;
  /** Up to maxLatest posts for the Latest band, minus the hero. */
  readonly latest: readonly BlogPostLike[];
  /** Posts beyond the Latest cap, for the text-only Archive tail. */
  readonly archive: readonly BlogPostLike[];
}

/**
 * Partition the full post list into the hero / latest / archive
 * buckets that the listing page renders.
 *
 * @param allPosts - Already-adapted slim posts, sorted newest first.
 * @param activeFilter - Category slug to filter by, or null for "All".
 * @param maxLatest - Max posts in the Latest band. Archive takes the rest.
 */
export function partitionBlogPosts(
  allPosts: readonly BlogPostLike[],
  activeFilter: string | null,
  maxLatest: number,
): PartitionedPosts {
  // Rule 1: filter by category. null means show everything.
  const filtered =
    activeFilter === null
      ? allPosts
      : allPosts.filter((post) => post.category === activeFilter);

  // Rule 2: hero is the first matching post (caller sorts newest first).
  const hero = filtered[0];
  const nonHeroPosts = filtered.slice(1);

  // Rule 3/4: on All, pull series posts out of the Latest / Archive
  // flow so they only appear in the Silhouette Series band. On a
  // filtered view, keep every matching post regardless of series.
  const nonHeroForBands =
    activeFilter === null
      ? nonHeroPosts.filter((post) => !post.series)
      : nonHeroPosts;

  // Rule 5: slice into Latest (up to maxLatest) and Archive (the rest).
  const latest = nonHeroForBands.slice(0, maxLatest);
  const archive = nonHeroForBands.slice(maxLatest);

  return { filtered, hero, latest, archive };
}

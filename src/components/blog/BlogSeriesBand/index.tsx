import BlogSeriesCard from '@site/src/components/blog/BlogSeriesCard';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';
import { SERIES } from '@site/src/data/blog/series';
import styles from './styles.module.css';

export interface BlogSeriesBandProps {
  /** All posts in the listing (already adapted to the slim shape). */
  allPosts: readonly BlogPostLike[];
  /** Active category filter. null means "all". The band hides on filtered views. */
  activeFilter: string | null;
  /** Series slug to filter on. Defaults to silhouette-primer. */
  seriesSlug?: string;
  /** Optional extra class merged onto the root element. */
  className?: string;
}

/*
 * BlogSeriesBand
 *
 * Conditional band wrapper for the Silhouette Series cards on the
 * blog listing. Renders nothing in two cases:
 *   1. The user has applied a category filter (filters and editorial
 *      sequence are orthogonal; mixing them confuses the reader)
 *   2. There are zero series posts in the supplied list
 *
 * Otherwise, renders a label header + sub-line + a horizontal grid of
 * BlogSeriesCard items, ordered by seriesOrder ascending. The band
 * accepts the slim BlogPostLike shape and filters / sorts directly
 * (no dependency on the lib helper, which operates on the Docusaurus
 * shape consumed by the listing page swizzle in Phase 3).
 *
 * The series definition (label, sub-line, accent family) lives in
 * src/data/blog/series.ts. Defaults to silhouette-primer; the
 * `seriesSlug` prop is here so a future second series can re-use the
 * same band component without code changes.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4f
 */
export default function BlogSeriesBand({
  allPosts,
  activeFilter,
  seriesSlug = 'silhouette-primer',
  className,
}: BlogSeriesBandProps) {
  // Hide on filtered views. Series are editorial sequences and filters
  // are categorical; the band only makes sense in the unfiltered view.
  if (activeFilter !== null) {
    return null;
  }

  // Filter to series posts and sort by seriesOrder ascending. Posts
  // missing seriesOrder fall back to 0 (which puts them at the front,
  // matching the lib helper's behavior).
  const seriesPosts = allPosts
    .filter((post) => post.series === seriesSlug)
    .slice()
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

  if (seriesPosts.length === 0) {
    return null;
  }

  const series = SERIES[seriesSlug];
  // If a caller passes a seriesSlug that has no entry in the data
  // layer, we still hide the band rather than throwing - this is a
  // soft failure mode for the listing page that prefers degradation
  // over a hard crash.
  if (!series) {
    return null;
  }

  const total = seriesPosts.length;

  const rootClassName = className
    ? `${styles.band} ${className}`
    : styles.band;

  return (
    <section className={rootClassName} aria-labelledby="series-band-label">
      <header className={styles.header}>
        <div className={styles.dividerRow}>
          <span className={styles.divider} aria-hidden="true" />
          <h2 id="series-band-label" className={styles.label}>
            {series.eyebrow}
          </h2>
          <span className={styles.divider} aria-hidden="true" />
        </div>
        <p className={styles.subline}>{series.description}</p>
      </header>

      <div className={styles.grid}>
        {seriesPosts.map((post, index) => (
          <BlogSeriesCard
            key={post.slug ?? post.permalink}
            post={post}
            seriesOrder={index + 1}
            seriesTotal={total}
          />
        ))}
      </div>
    </section>
  );
}

import BlogPostCard, {
  type BlogPostLike,
} from '@site/src/components/blog/BlogPostCard';
import { getCategory } from '@site/src/lib/blog/categories';
import styles from './styles.module.css';

export interface BlogLatestBandProps {
  /** Posts to render. The band slices to maxPosts; the parent does the filter. */
  posts: readonly BlogPostLike[];
  /** Active category filter. null means "all" → label is "LATEST". */
  activeFilter: string | null;
  /** Maximum number of cards to render. Defaults to 6 per spec 4g. */
  maxPosts?: number;
  /** Optional extra class merged onto the root section. */
  className?: string;
}

/*
 * BlogLatestBand
 *
 * Labelled band wrapper around a 2-column grid of BlogPostCard items.
 *
 * Label rules:
 *   - activeFilter null → "LATEST"
 *   - activeFilter set  → category label uppercased (e.g. "RESEARCH")
 *
 * Slicing: the band is presentation-only - the parent listing page is
 * expected to do the filter logic and pass an already-filtered array.
 * The band only enforces the maxPosts cap so a too-large input does
 * not blow out the listing layout. Default cap is 6 per spec 4g.
 *
 * Edge cases:
 *   - Empty posts array → returns null (the listing page should not
 *     render an empty band; suppression is the cleanest signal).
 *   - Unknown filter slug → throws via getCategory. The same failure
 *     mode as the cards. Routing slugs are the parent's contract; the
 *     band surfaces violations rather than rendering "NOPE" as a label.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4g
 */
export default function BlogLatestBand({
  posts,
  activeFilter,
  maxPosts = 6,
  className,
}: BlogLatestBandProps) {
  if (posts.length === 0) {
    return null;
  }

  // Validate filter slug up front so a bogus value fails loudly.
  // Null means "all" so we skip the lookup.
  const label =
    activeFilter === null
      ? 'LATEST'
      : getCategory(activeFilter).label.toUpperCase();

  const visiblePosts = posts.slice(0, maxPosts);

  const rootClassName = className
    ? `${styles.band} ${className}`
    : styles.band;

  return (
    <section className={rootClassName} aria-labelledby="latest-band-label">
      <header className={styles.header}>
        <div className={styles.dividerRow}>
          <span className={styles.divider} aria-hidden="true" />
          <h2 id="latest-band-label" className={styles.label}>
            {label}
          </h2>
          <span className={styles.divider} aria-hidden="true" />
        </div>
      </header>

      <div className={styles.grid}>
        {visiblePosts.map((post) => (
          <BlogPostCard key={post.slug ?? post.permalink} post={post} />
        ))}
      </div>
    </section>
  );
}

import Link from '@docusaurus/Link';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';
import { getCategory } from '@site/src/lib/blog/categories';
import styles from './styles.module.css';

export interface BlogArchiveListProps {
  /** Posts to render in the archive tail. The parent supplies the slice. */
  posts: readonly BlogPostLike[];
  /** Optional extra class merged onto the root list element. */
  className?: string;
}

/*
 * formatArchiveDate - same UTC-pinned formatter used by BlogPostCard
 * and BlogHero. Mirrors BlogEyebrow's "full" format ("APR 08 2026").
 * Kept local because the archive list does not import BlogEyebrow
 * (different layout, no category dot, no reading time).
 */
function formatArchiveDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const month = date
    .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${month} ${day} ${year}`;
}

/*
 * BlogArchiveList
 *
 * Text-only "more essays" archive tail for posts beyond the first 6
 * latest + the series posts. Rendered as a <ul> with no bullet
 * markers; each row is two lines (category + date metadata above the
 * title) and the whole row is an anchor.
 *
 * This is deliberately not a card grid. The archive tail's job is to
 * say "we have more, here is the list" without adding visual weight
 * to a page that already has a hero, a series band, and a card grid.
 *
 * Empty input → null. The listing page should not render an empty
 * archive section; suppression is the cleanest signal.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4h
 */
export default function BlogArchiveList({
  posts,
  className,
}: BlogArchiveListProps) {
  if (posts.length === 0) {
    return null;
  }

  const rootClassName = className
    ? `${styles.list} ${className}`
    : styles.list;

  return (
    <ul className={rootClassName}>
      {posts.map((post) => {
        // Validate per-row so an unknown category in the archive
        // surfaces as a hard failure (same contract as the cards).
        const category = getCategory(post.category);
        const isoDate = (
          typeof post.date === 'string' ? new Date(post.date) : post.date
        ).toISOString();

        return (
          <li key={post.slug ?? post.permalink} className={styles.item}>
            <Link to={post.permalink} className={styles.row}>
              <div className={styles.meta}>
                <span className={styles.category}>
                  {category.label.toUpperCase()}
                </span>
                <span className={styles.metaSep} aria-hidden="true">
                  ·
                </span>
                <time className={styles.date} dateTime={isoDate}>
                  {formatArchiveDate(post.date)}
                </time>
              </div>
              <span className={styles.title}>{post.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

import Link from '@docusaurus/Link';
import BlogCoverImage from '@site/src/components/blog/BlogCoverImage';
import { getCategory } from '@site/src/lib/blog/categories';
import { formatReadingTime } from '@site/src/lib/blog/readingTime';
import styles from './styles.module.css';

export interface BlogPostLike {
  /** Stable slug used for the hash and (implicitly) the link target. */
  slug: string;
  /** Post title (rendered as the H2). */
  title: string;
  /** Permalink (the href on the wrapping anchor). */
  permalink: string;
  /** Category slug. Validated via getCategory; throws on unknown. */
  category: string;
  /** Optional dek / description / excerpt. Rendered with a 2-line clamp. */
  dek?: string;
  /** Cover image URL passed to BlogCoverImage. Falls back to BlogCoverFallback. */
  coverImage?: string;
  /** Reading time in whole minutes. Rendered in the eyebrow as "N MIN". */
  readingTime: number;
  /** First author's display name. Only one author shows on the listing card. */
  authorName: string;
  /** Publication date (ISO string or Date). Rendered in the footer. */
  date: string | Date;
}

export interface BlogPostCardProps {
  /** Post metadata shaped into a presentation-friendly subset. */
  post: BlogPostLike;
  /** Optional extra class merged onto the root anchor. */
  className?: string;
}

/*
 * slugHash - djb2-style unsigned hash.
 *
 * Stable across rerenders, deterministic for a given slug, no
 * dependencies. Used to assign each card one of two accent glow
 * colours so the listing has visual rhythm without the colours
 * flickering when the array order changes (e.g. category filtering,
 * pagination, search). Keeping the hash on the slug, not the array
 * index, is the whole point.
 *
 * Kept inline rather than split into src/lib/blog/slugHash.ts because
 * the helper is two dozen lines, has a single consumer, and the scope
 * of Task 2.7 deliberately prefers inlining.
 */
function slugHash(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) + hash) + slug.charCodeAt(i);
  }
  return hash >>> 0; // force unsigned int
}

/*
 * formatCardDate - uppercase Plex-Mono-ready date token.
 *
 * Mirrors the BlogEyebrow "full" format ("APR 08 2026") but is kept
 * local to this file because the card footer is not a BlogEyebrow.
 * All three components (month / day / year) come from the UTC side
 * of the Date to avoid day-boundary drift (the same bug fixed in
 * BlogEyebrow's formatDate). Short month name is pinned to en-US.
 */
function formatCardDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const month = date
    .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${month} ${day} ${year}`;
}

/*
 * BlogPostCard
 *
 * Standard grid card used on the blog listing page (Latest band and
 * filtered views). Composes BlogCoverImage at the top with a body
 * that holds a hand-rolled eyebrow row, the H2 title, an optional
 * dek, and a slim byline footer. The whole card is a single <a> so
 * native keyboard focus and right-click-to-copy behave correctly.
 *
 * Eyebrow decision: the card spec (4g) explicitly excludes the date
 * from the eyebrow (the date lives in the footer instead). BlogEyebrow
 * requires a `date` prop and always renders it, so re-using BlogEyebrow
 * here would mean either duplicating the date or hiding it with CSS.
 * Neither is clean. The card hand-rolls its own small eyebrow using
 * the same Plex Mono / 11px / uppercase / wide-tracking typographic
 * recipe as BlogEyebrow but without the date slot. Spec fidelity first.
 *
 * Title decision: rendered as a <h2> in Inter (var(--font-sans)).
 * Orbitron (var(--font-display)) is reserved for H1 only per brand
 * rules, and Inter is the body/heading default for H2+ across the
 * site.
 *
 * Glow decision: the alternating magenta/cyan glow on hover is keyed
 * on slugHash(post.slug) % 2. The goal is stability across filter
 * changes - a post's glow colour must not flicker when it moves rank
 * in the listing array. Keying on slug, not index, is the whole
 * trick. The codebase does not expose --accent-primary-rgb or
 * --accent-secondary-rgb triplets, so the actual box-shadow values
 * live in styles.module.css as raw rgba with inline token
 * justification (same convention as BlogCoverFallback).
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4g
 */
export default function BlogPostCard({ post, className }: BlogPostCardProps) {
  // Validate up front. Throws on unknown slug per the getCategory
  // contract. This is the same failure mode BlogEyebrow exposes and
  // mirrors the design doc rule that category is required on all posts.
  const category = getCategory(post.category);

  const glowClass =
    slugHash(post.slug) % 2 === 0 ? styles.glowMagenta : styles.glowCyan;

  const rootClassName = [styles.card, glowClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Link to={post.permalink} className={rootClassName}>
      <div className={styles.cover}>
        <BlogCoverImage src={post.coverImage} title={post.title} />
      </div>

      <div className={styles.body}>
        {/*
         * Hand-rolled eyebrow: category + reading time only. See the
         * component-level comment for why BlogEyebrow is not reused
         * here.
         */}
        <div className={styles.eyebrow}>
          <span className={styles.category}>
            <span
              className={styles.dot}
              aria-hidden="true"
              style={{ color: category.accent }}
            >
              ●
            </span>
            {category.label.toUpperCase()}
          </span>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <span className={styles.readingTime}>
            {formatReadingTime(post.readingTime)}
          </span>
        </div>

        <h2 className={styles.title}>{post.title}</h2>

        {post.dek && (
          <p className={styles.dek} data-testid="post-card-dek">
            {post.dek}
          </p>
        )}

        <div className={styles.footer}>
          <span className={styles.authorName}>{post.authorName}</span>
          <span className={styles.footerSep} aria-hidden="true">
            ·
          </span>
          <time
            className={styles.date}
            dateTime={
              (typeof post.date === 'string'
                ? new Date(post.date)
                : post.date
              ).toISOString()
            }
          >
            {formatCardDate(post.date)}
          </time>
        </div>
      </div>
    </Link>
  );
}

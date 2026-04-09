import { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import BlogCoverImage from '@site/src/components/blog/BlogCoverImage';
import {
  BlogPostLike,
} from '@site/src/components/blog/BlogPostCard';
import { getCategory } from '@site/src/lib/blog/categories';
import { formatReadingTime } from '@site/src/lib/blog/readingTime';
import styles from './styles.module.css';

export type { BlogPostLike };

export interface BlogHeroProps {
  /** Featured post. The hero is one card; multi-post layouts compose multiple. */
  post: BlogPostLike;
  /** Optional extra class merged onto the root anchor. */
  className?: string;
}

/*
 * formatHeroDate - mirrors BlogPostCard's formatCardDate, kept local
 * for the same reason: BlogEyebrow's formatter is not reachable from
 * outside the component, and the hero footer hand-rolls its own slot.
 * UTC pinning prevents the day-boundary drift bug fixed in BlogEyebrow.
 */
function formatHeroDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const month = date
    .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${month} ${day} ${year}`;
}

/*
 * getInitial - mirrors BlogByline's getInitial. First character of the
 * first whitespace-trimmed word, uppercased, with a "?" guard for
 * empty names so the avatar circle never collapses.
 */
function getInitial(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? '';
  if (first.length === 0) return '?';
  return first.charAt(0).toUpperCase();
}

interface HeroAvatarProps {
  name: string;
  imageUrl?: string;
}

/*
 * HeroAvatar - 32px circular avatar with onError → initials fallback.
 *
 * This duplicates the AuthorAvatar pattern in BlogByline. Two reasons
 * the duplication is intentional rather than extracted into a shared
 * primitive:
 *   1. The pattern is small (~25 lines) and the cost of inlining is
 *      lower than the cost of designing a generic avatar primitive
 *      and migrating both consumers.
 *   2. BlogByline's AuthorAvatar takes a richer "author" shape and
 *      lives in a multi-author cluster context. The hero needs only
 *      a single avatar with a flat (name, imageUrl) input. A shared
 *      primitive would have to bridge both shapes.
 *
 * If a third consumer (e.g. BlogShareRow in Phase 4) needs an avatar,
 * extract a shared <BlogAvatar> primitive then.
 */
function HeroAvatar({ name, imageUrl }: HeroAvatarProps) {
  const [errored, setErrored] = useState(false);

  // Reset on imageUrl swap so a runtime URL change can recover the
  // real image even if a previous URL errored.
  useEffect(() => {
    setErrored(false);
  }, [imageUrl]);

  const showInitials = !imageUrl || errored;

  if (showInitials) {
    return (
      <span className={`${styles.avatar} ${styles.initials}`} aria-hidden="true">
        {getInitial(name)}
      </span>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      loading="lazy"
      onError={() => setErrored(true)}
      className={styles.avatar}
    />
  );
}

/*
 * BlogHero
 *
 * Featured hero card at the top of the blog listing. Split layout
 * (cover left 60%, copy right 40%) at >=996px, stacked vertically
 * below 996px with cover on top. The whole hero is a single anchor
 * for native keyboard focus and right-click-to-copy.
 *
 * Composes:
 *   - BlogCoverImage for the cover (real image or BlogCoverFallback)
 *   - hand-rolled eyebrow (category + reading time, no date) using
 *     the same Plex Mono recipe as BlogEyebrow / BlogPostCard. The
 *     eyebrow is hand-rolled rather than reusing BlogEyebrow because
 *     BlogEyebrow always renders a date and the hero spec puts the
 *     date in the footer instead.
 *   - hand-rolled footer with HeroAvatar + name + date. The avatar
 *     mirrors BlogByline's onError-to-initials pattern; see the
 *     HeroAvatar component comment for why duplication beats
 *     premature abstraction here.
 *
 * Hover state: border brightens, card lifts -2px on Y, cover overlay
 * fades, and a magenta accent glow appears. The translateY is
 * suppressed under prefers-reduced-motion. Per spec, the hero glow is
 * single-colour magenta (not the BlogPostCard alternating pattern,
 * because the hero is one featured card and there is no rhythm to
 * preserve).
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4e
 */
export default function BlogHero({ post, className }: BlogHeroProps) {
  // Throws on unknown slug per the getCategory contract. Same failure
  // mode as BlogPostCard and BlogEyebrow.
  const category = getCategory(post.category);

  const rootClassName = [styles.hero, styles.split, className]
    .filter(Boolean)
    .join(' ');

  const isoDate = (
    typeof post.date === 'string' ? new Date(post.date) : post.date
  ).toISOString();

  return (
    <Link to={post.permalink} className={rootClassName}>
      <div className={styles.cover}>
        <BlogCoverImage src={post.coverImage} title={post.title} />
      </div>

      <div className={styles.copy}>
        <div className={styles.eyebrow} data-testid="hero-eyebrow">
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
          <p className={styles.dek} data-testid="hero-dek">
            {post.dek}
          </p>
        )}

        <div className={styles.footer}>
          <HeroAvatar name={post.authorName} imageUrl={post.authorImageUrl} />
          <span className={styles.authorName}>{post.authorName}</span>
          <span className={styles.footerSep} aria-hidden="true">
            ·
          </span>
          <time className={styles.date} dateTime={isoDate}>
            {formatHeroDate(post.date)}
          </time>
        </div>
      </div>
    </Link>
  );
}

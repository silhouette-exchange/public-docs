import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export interface BlogBylineAuthor {
  /** Display name. Used for alt text, name slot, and initials fallback. */
  name: string;
  /** Author role/title. Rendered directly under the name when present. */
  title?: string;
  /** Avatar image URL. When missing (or on runtime error), initials render. */
  imageUrl?: string;
  /** Optional profile URL. When set, wraps the name block (not the avatar). */
  url?: string;
}

export interface BlogBylineProps {
  authors: BlogBylineAuthor[];
  /** Avatar size variant. sm=32px (listing), md=40px (article). Default md. */
  avatarSize?: 'sm' | 'md';
  /** Optional extra class merged onto the root element. */
  className?: string;
}

/*
 * BlogByline
 *
 * Presentational author row. Two usage contexts:
 *
 *   1. Listing cards (avatarSize="sm", 32x32 avatars)
 *   2. Article page header (avatarSize="md", 40x40 avatars)
 *
 * Multi-author cluster renders up to two visible avatars with a 24px
 * horizontal overlap. Additional authors are collapsed into a "+N more"
 * suffix in the comma-joined name slot. When an author has no imageUrl,
 * or when the real <img> fires an onError at runtime (broken URL, CORS,
 * network failure), the avatar swaps to an Orbitron initial glyph over
 * the brand magenta->cyan gradient. Only the first character of the
 * first word is rendered; single-character initials keep the visual
 * consistent regardless of name length.
 *
 * The name block is wrapped in an <a> when the author has a `url`.
 * The avatar stays non-interactive even when a URL is present; this
 * follows the Medium pattern and avoids stacked tap targets.
 *
 * Share row: the article page share buttons (Share on X / Copy link /
 * RSS) live in a separate component (Task 4.2: BlogShareRow) and will
 * be composed alongside this component on article pages. BlogByline
 * intentionally does NOT own a share row prop.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 5c
 */

function getInitial(name: string): string {
  // First character of the first whitespace-trimmed word, uppercased.
  // Empty-name guard returns "?" so the avatar still renders something
  // rather than collapsing its box in a broken-looking way.
  const first = name.trim().split(/\s+/)[0] ?? '';
  if (first.length === 0) {
    return '?';
  }
  return first.charAt(0).toUpperCase();
}

interface AuthorAvatarProps {
  author: BlogBylineAuthor;
  sizeClass: string;
  initialSizeClass: string;
}

function AuthorAvatar({
  author,
  sizeClass,
  initialSizeClass,
}: AuthorAvatarProps) {
  const [errored, setErrored] = useState(false);

  // Reset the error flag whenever the imageUrl prop changes. Without this
  // an author whose avatar URL is swapped at runtime (e.g. by a parent
  // re-render) would remain stuck on the initials fallback even after a
  // valid URL arrives.
  useEffect(() => {
    setErrored(false);
  }, [author.imageUrl]);

  const showInitials = !author.imageUrl || errored;

  if (showInitials) {
    return (
      <span
        className={`${styles.avatar} ${styles.initials} ${sizeClass} ${initialSizeClass}`}
        aria-hidden="true"
      >
        {getInitial(author.name)}
      </span>
    );
  }

  return (
    <img
      src={author.imageUrl}
      alt={author.name}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`${styles.avatar} ${sizeClass}`}
    />
  );
}

export default function BlogByline({
  authors,
  avatarSize = 'md',
  className,
}: BlogBylineProps) {
  if (authors.length === 0) {
    // Defensive: render nothing rather than a hollow row. Upstream callers
    // (listing cards, article headers) never ship zero-author content but
    // belt-and-braces.
    return null;
  }

  const sizeClass =
    avatarSize === 'sm' ? styles.avatarSm : styles.avatarMd;
  const initialSizeClass =
    avatarSize === 'sm' ? styles.initialsSm : styles.initialsMd;

  const visibleAvatarAuthors = authors.slice(0, 2);
  const overflowCount = Math.max(0, authors.length - 2);

  // Name slot shows the names of the visible authors (max 2), comma-
  // joined, with a "+N more" suffix when the cluster has additional
  // authors beyond the visible cap. Full-list rendering was considered
  // but gets ugly fast past three authors.
  const visibleNames = visibleAvatarAuthors.map((a) => a.name).join(', ');
  const nameLabel =
    overflowCount > 0 ? `${visibleNames}, +${overflowCount} more` : visibleNames;

  // The "title" slot uses the first author's title only. Multi-author
  // posts show the combined names in the name slot and the lead author's
  // role as the secondary line. This keeps the row vertically stable and
  // matches the design doc's "Name: ..., Role: ..." structure.
  const primaryTitle = authors[0].title;

  // When the first author has a URL we wrap the name block (NOT the
  // avatar). Multi-author clusters skip the link - a cluster of authors
  // has no single canonical destination.
  const firstAuthorUrl =
    authors.length === 1 ? authors[0].url : undefined;

  const rootClassName = className
    ? `${styles.byline} ${className}`
    : styles.byline;

  return (
    <div className={rootClassName}>
      <div className={styles.cluster}>
        {visibleAvatarAuthors.map((author, index) => (
          <span
            key={`${author.name}-${index}`}
            className={`${styles.avatarSlot} ${sizeClass}`}
            style={{
              // Subsequent avatars overlap the previous by 24px. Inline
              // style keeps the overlap logic on the component so the CSS
              // file stays index-agnostic. z-index decreases down the
              // stack so the first avatar paints on top, which makes the
              // overlap border read cleanly.
              marginLeft: index === 0 ? 0 : 'var(--blog-byline-overlap)',
              zIndex: visibleAvatarAuthors.length - index,
            }}
          >
            <AuthorAvatar
              author={author}
              sizeClass={sizeClass}
              initialSizeClass={initialSizeClass}
            />
          </span>
        ))}
      </div>

      <div className={styles.meta}>
        {firstAuthorUrl ? (
          <a href={firstAuthorUrl} className={styles.nameLink}>
            <span className={styles.name}>{nameLabel}</span>
          </a>
        ) : (
          <span className={styles.name}>{nameLabel}</span>
        )}
        {primaryTitle && <span className={styles.title}>{primaryTitle}</span>}
      </div>
    </div>
  );
}

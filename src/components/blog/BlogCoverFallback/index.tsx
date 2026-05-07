import React from 'react';
import styles from './styles.module.css';

export interface BlogCoverFallbackProps {
  /** Post title overlaid bottom-left and used as the accessible name. */
  title: string;
  /** Optional extra class, merged onto the root element. */
  className?: string;
}

/*
 * BlogCoverFallback
 *
 * Rendered by <BlogCoverImage> (Task 2.4) when a post has no `image`
 * frontmatter. Pure presentational. No hooks, no state, no logic.
 *
 * Visual structure (bottom to top in z-order):
 *   1. .fallback        root card, 16:9, inner border, rounded corner
 *   2. .gradient        135deg base -> magenta -> cyan atmosphere
 *   3. .noise           2% opacity radial grain for depth
 *   4. .wordmark        Orbitron "SILHOUETTE" signature top-right
 *   5. .title           Inter post title anchored bottom-left
 *
 * Accessibility: the root carries role="img" with the post title as
 * aria-label so screen readers announce the card as a single labelled
 * image. The gradient, noise, and wordmark layers are aria-hidden since
 * they are purely decorative. The title stays in an <h3> so it remains
 * part of the document outline for sighted users scanning the listing.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4i
 */
export default function BlogCoverFallback({
  title,
  className,
}: BlogCoverFallbackProps) {
  const rootClassName = className
    ? `${styles.fallback} ${className}`
    : styles.fallback;

  return (
    <div className={rootClassName} role="img" aria-label={title}>
      <div className={styles.gradient} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <span className={styles.wordmark} aria-hidden="true">
        SILHOUETTE
      </span>
      {/*
       * Title text is rendered in a div, NOT a heading element. The
       * cover fallback's parent already exposes role="img" with the
       * title as aria-label, so screen readers announce the card as
       * one labelled image. Using an h3 here would inject a second
       * heading into the document outline whenever a parent (like
       * BlogPostCard) ALSO renders the title in its own heading,
       * which produces a real double-announcement bug. Visual stays
       * identical; only the semantic role changes.
       */}
      <div className={styles.title}>{title}</div>
    </div>
  );
}

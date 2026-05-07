import BlogCoverFallback from '@site/src/components/blog/BlogCoverFallback';
import styles from './styles.module.css';

export interface BlogCoverImageProps {
  /** Cover image URL. When undefined or empty, BlogCoverFallback renders. */
  src?: string;
  /** Alt text for the real image. Falls back to title if missing or empty. */
  alt?: string;
  /** Post title. Used as the BlogCoverFallback name and as alt fallback. */
  title: string;
  /** Optional extra class merged onto the rendered root element. */
  className?: string;
}

/*
 * BlogCoverImage
 *
 * Single entry point for cover image rendering on the listing page.
 * Pure switch: real <img> when src is set, otherwise delegates to
 * <BlogCoverFallback>. The wrapper holds the 16:9 frame and the
 * hover overlay; BlogCoverFallback owns its own root frame so the
 * fallback path skips the wrapper entirely.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4i
 */
export default function BlogCoverImage({
  src,
  alt,
  title,
  className,
}: BlogCoverImageProps) {
  if (!src) {
    return <BlogCoverFallback title={title} className={className} />;
  }

  const wrapperClassName = className
    ? `${styles.wrapper} ${className}`
    : styles.wrapper;

  return (
    <div className={wrapperClassName}>
      <img
        src={src}
        alt={alt && alt.length > 0 ? alt : title}
        loading="lazy"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
    </div>
  );
}

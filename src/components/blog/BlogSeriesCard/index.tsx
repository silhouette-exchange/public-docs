import Link from '@docusaurus/Link';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';
import styles from './styles.module.css';

export interface BlogSeriesCardProps {
  /** The post being rendered as a series step. */
  post: BlogPostLike;
  /** 1-indexed position of this post in the series (e.g. 3 for "Part 3 of 7"). */
  seriesOrder: number;
  /** Total number of posts in the series (e.g. 7). */
  seriesTotal: number;
  /** Optional extra class merged onto the root anchor. */
  className?: string;
}

/*
 * BlogSeriesCard
 *
 * Numbered step card used inside the Silhouette Series band on the
 * blog listing. Visually quieter than BlogPostCard / BlogHero: no
 * cover image, no eyebrow, no byline. Just a step indicator, the
 * title, an optional dek, and a decorative arrow footer. The whole
 * card is one anchor.
 *
 * Accessibility detail: the visible step indicator says "PART 1 OF 7"
 * in Orbitron all caps (a legitimate Orbitron use - it is a single
 * uppercase label, not a heading). For screen readers we ALSO include
 * an off-screen "Part 1 of 7: " prefix INSIDE the heading element so
 * the title is announced as "Part 1 of 7: What Is Silhouette?". This
 * gives SR users the same sequencing context that sighted users get
 * from seeing the indicator above the title. Per design doc §4l.
 *
 * The "→ READ" footer is purely decorative because the whole card
 * is already an anchor. It is wrapped in aria-hidden so screen
 * readers do not announce a second read affordance.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4f
 */
export default function BlogSeriesCard({
  post,
  seriesOrder,
  seriesTotal,
  className,
}: BlogSeriesCardProps) {
  const rootClassName = className
    ? `${styles.card} ${className}`
    : styles.card;

  const stepLabel = `PART ${seriesOrder} OF ${seriesTotal}`;
  const srPrefix = `Part ${seriesOrder} of ${seriesTotal}: `;

  return (
    <Link to={post.permalink} className={rootClassName}>
      <div className={styles.step} aria-hidden="true">
        {stepLabel}
      </div>

      <h3 className={styles.title}>
        {/*
         * SR-only sequencing prefix. Sighted users see the .step row
         * above; SR users hear the prefix as part of the heading so
         * the announcement is "Part 1 of 7: What Is Silhouette?".
         */}
        <span className={styles.srOnly}>{srPrefix}</span>
        {post.title}
      </h3>

      {post.dek && (
        <p className={styles.dek} data-testid="series-card-dek">
          {post.dek}
        </p>
      )}

      <div className={styles.footer} aria-hidden="true">
        → READ
      </div>
    </Link>
  );
}

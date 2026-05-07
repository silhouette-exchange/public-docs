import Link from '@docusaurus/Link';
import { getCategory } from '@site/src/lib/blog/categories';
import { formatReadingTime } from '@site/src/lib/blog/readingTime';
import styles from './styles.module.css';

export interface BlogEyebrowProps {
  /** Category slug. Throws on unknown slug (validated against the registry). */
  category: string;
  /** Reading time in whole minutes. Omitted from the row when undefined. */
  readingTime?: number;
  /** Absolute publication date. ISO string or Date object. */
  date: string | Date;
  /** When true, the category renders as a link to the filtered blog view. */
  linkCategory?: boolean;
  /** Date format. "full" → "APR 08 2026". "month-year" → "APR 2026". */
  dateFormat?: 'month-year' | 'full';
  /** Optional extra class merged onto the root row. */
  className?: string;
}

/*
 * formatDate - render an absolute date as an uppercase Plex Mono token.
 *
 * IMPORTANT: this function uses UTC for ALL three components (month,
 * day, year). An earlier draft mixed local-TZ toLocaleDateString with
 * UTC getUTCDate / getUTCFullYear, which produced wrong output near
 * day boundaries (e.g. "2026-04-01" parsed as UTC midnight, viewed in
 * UTC-5, gave local month "MAR" + UTC day "01" → "MAR 01 2026"). Pin
 * the locale to UTC to keep all three components on the same calendar.
 */
function formatDate(
  input: string | Date,
  format: 'month-year' | 'full'
): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const month = date
    .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  return format === 'month-year' ? `${month} ${year}` : `${month} ${day} ${year}`;
}

/*
 * BlogEyebrow
 *
 * Plex Mono uppercase metadata row used on listing cards and the
 * article page header. Format: {CATEGORY} · {READING TIME} · {DATE}.
 * The category dot inherits its colour from the registry entry's
 * `accent` token reference. linkCategory=true makes the category an
 * anchor to the filtered listing view (used on article pages, not on
 * the listing itself where the whole card is already a link).
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md sections 4e and 5b
 */
export default function BlogEyebrow({
  category,
  readingTime,
  date,
  linkCategory = false,
  dateFormat = 'full',
  className,
}: BlogEyebrowProps) {
  const cat = getCategory(category);
  const categoryLabel = cat.label.toUpperCase();
  const dotStyle: React.CSSProperties = { color: cat.accent };

  const categoryInner = (
    <>
      <span className={styles.dot} aria-hidden="true" style={dotStyle}>
        ●
      </span>
      {categoryLabel}
    </>
  );

  const categoryNode = linkCategory ? (
    <Link
      className={styles.categoryLink}
      to={`/blog?category=${cat.slug}`}
    >
      {categoryInner}
    </Link>
  ) : (
    <span className={styles.category}>{categoryInner}</span>
  );

  const rootClassName = className
    ? `${styles.eyebrow} ${className}`
    : styles.eyebrow;

  const isoDate = (typeof date === 'string' ? new Date(date) : date).toISOString();

  return (
    <div className={rootClassName}>
      {categoryNode}
      {readingTime !== undefined && (
        <>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <span className={styles.readingTime}>
            {formatReadingTime(readingTime)}
          </span>
        </>
      )}
      <span className={styles.sep} aria-hidden="true">
        ·
      </span>
      <time className={styles.date} dateTime={isoDate}>
        {formatDate(date, dateFormat)}
      </time>
    </div>
  );
}

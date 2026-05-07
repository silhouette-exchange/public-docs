// src/data/blog/series.ts
//
// Editorial series definitions for the Silhouette blog.
// A series is a curated reading sequence of posts in a specific order.
// Posts join a series via frontmatter `series: <slug>` and `series_order: <n>`.
//
// See docs/plans/2026-04-09-blog-redesign-design.md §7 for the full spec.

export interface SeriesDefinition {
  /** URL slug and frontmatter reference */
  slug: string;
  /** Display name used in article page series badge */
  label: string;
  /** UPPERCASE label used in the listing band header (Orbitron) */
  eyebrow: string;
  /** Sub-line rendered under the band header on the listing page */
  description: string;
  /**
   * Accent color family: 'primary' = magenta, 'secondary' = cyan.
   * Used for the series band border tint and article page series badge.
   */
  accent: 'primary' | 'secondary';
}

export const SERIES: Record<string, SeriesDefinition> = {
  'silhouette-primer': {
    slug: 'silhouette-primer',
    label: 'The Silhouette Series',
    eyebrow: 'THE SILHOUETTE SERIES',
    description: 'Start here. Seven essays on why shielded trading matters.',
    accent: 'secondary',
  },
};

export type SeriesSlug = keyof typeof SERIES;

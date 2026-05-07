// src/data/blog/categories.ts
//
// The canonical category taxonomy for the Silhouette blog.
// 5 categories mapped 1:1 to the actual content pipeline.
// See docs/plans/2026-04-09-blog-redesign-design.md §4d.
//
// Do NOT add a 6th category without updating the design doc
// and the BlogCategoryPills component. Cognitive overload kicks
// in at 6+ pills per the listing research.

export interface CategoryDefinition {
  /** URL slug and frontmatter value */
  slug: string;
  /** Display label used in pills, eyebrows, and band headers */
  label: string;
  /**
   * CSS token reference for the 6px accent dot rendered before
   * the category name on article page eyebrows. Does NOT affect
   * pill fill color on the listing (pills use the shared
   * magenta-cyan gradient).
   */
  accent: string;
  /** Short description (used in future category index pages, dormant now) */
  description?: string;
}

export const CATEGORIES: readonly CategoryDefinition[] = [
  {
    slug: 'research',
    label: 'Research',
    accent: 'var(--accent-primary)',
    description:
      'Deep essays on shielded trading, TEE architecture, and the road to private perps.',
  },
  {
    slug: 'guides',
    label: 'Guides',
    accent: 'var(--accent-secondary)',
    description:
      'Step-by-step walkthroughs for traders, developers, and institutions.',
  },
  {
    slug: 'explainers',
    label: 'Explainers',
    accent: 'var(--accent-secondary-text)',
    description: 'What is this? Comparisons, definitions, and mental models.',
  },
  {
    slug: 'product',
    label: 'Product',
    accent: 'var(--success)',
    description: 'Product launches, updates, and releases.',
  },
  {
    slug: 'announcements',
    label: 'Announcements',
    accent: 'var(--warning)',
    description: 'Partnerships, raises, milestones.',
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

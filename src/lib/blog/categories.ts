// src/lib/blog/categories.ts
//
// Resolution helpers around the category registry in src/data/blog/categories.ts.
// See docs/plans/2026-04-09-blog-redesign-design.md §4d.

import {
  CATEGORIES,
  type CategoryDefinition,
} from '@site/src/data/blog/categories';

/** Get a category by slug. Throws on unknown slug. */
export function getCategory(slug: string): CategoryDefinition {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    throw new Error(
      `Unknown category: "${slug}". Valid slugs: ${CATEGORIES.map((c) => c.slug).join(', ')}`
    );
  }
  return category;
}

/** Check if a slug is a valid category slug. */
export function isValidCategorySlug(slug: string): boolean {
  return CATEGORIES.some((c) => c.slug === slug);
}

/** Get a category by slug, returning null if not found or undefined. */
export function getCategoryBySlugOrNull(
  slug: string | undefined
): CategoryDefinition | null {
  if (!slug) return null;
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export { CATEGORIES } from '@site/src/data/blog/categories';
export type { CategoryDefinition } from '@site/src/data/blog/categories';

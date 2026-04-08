// src/lib/blog/categories.test.ts
import { describe, it, expect, vi } from 'vitest';
import {
  getCategory,
  isValidCategorySlug,
  getCategoryBySlugOrNull,
} from './categories';

describe('getCategory', () => {
  it('returns the category for a known slug', () => {
    const research = getCategory('research');
    expect(research.slug).toBe('research');
    expect(research.label).toBe('Research');
    expect(research.accent).toBe('var(--accent-primary)');
  });

  it('throws for an unknown slug', () => {
    expect(() => getCategory('not-a-real-category')).toThrow(/unknown category/i);
  });

  it('is case-sensitive', () => {
    expect(() => getCategory('Research')).toThrow();
  });
});

describe('isValidCategorySlug', () => {
  it.each(['research', 'guides', 'explainers', 'product', 'announcements'])(
    'returns true for %s',
    (slug) => {
      expect(isValidCategorySlug(slug)).toBe(true);
    }
  );

  it('returns false for an unknown slug', () => {
    expect(isValidCategorySlug('article')).toBe(false);
    expect(isValidCategorySlug('')).toBe(false);
    expect(isValidCategorySlug('Research')).toBe(false);
  });
});

describe('getCategoryBySlugOrNull', () => {
  it('returns the category for a known slug', () => {
    const result = getCategoryBySlugOrNull('guides');
    expect(result?.label).toBe('Guides');
  });

  it('returns null for an unknown slug', () => {
    expect(getCategoryBySlugOrNull('nope')).toBe(null);
  });

  it('returns null for undefined', () => {
    expect(getCategoryBySlugOrNull(undefined)).toBe(null);
  });
});

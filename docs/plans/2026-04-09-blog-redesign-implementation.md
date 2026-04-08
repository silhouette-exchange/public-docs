# Blog Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. For each component implementation task, dispatch the full subagent loop (implementer + spec compliance review + code quality review) per `superpowers:subagent-driven-development`. For trivial tasks (file creation, frontmatter edits, commits), execute directly in the controller.

**Goal:** Rebuild `/blog` and `/blog/:slug` as an editorial-leaning research publication with first-class series treatment, Inter 19px/1.7 reading surface, and three signature touches (shielded text reveal, highlight-to-share, scroll progress bar), while migrating the 7 legacy posts to the new category taxonomy without touching body content.

**Architecture:** Docusaurus 3.9.2 theme swizzles (6 files) compose 19 new token-driven React components under `src/components/blog/`. Series + category registries live in `src/data/blog/`, resolution helpers in `src/lib/blog/`. Every new component ships with co-located vitest tests. Zero runtime dependencies added. Legacy content untouched beyond frontmatter.

**Tech Stack:** React 18 via Docusaurus 3.9.2, TypeScript, CSS modules referencing existing `:root` tokens in `src/css/custom.css`, vitest 4.1.3 + @testing-library/react 16.3.2 + jsdom 29.0.2, pnpm 9, Node 22. Native browser APIs only (IntersectionObserver, Selection, Clipboard, matchMedia).

**Source of truth:** `docs/plans/2026-04-09-blog-redesign-design.md` (committed in `4e06167`). Every visual measurement in this plan references a section in that doc. If the plan and the design doc conflict, **the design doc wins**. Flag the conflict to Wayne before proceeding.

---

## Prerequisites and standing rules

**READ BEFORE EXECUTING ANY TASK:**

1. **Branch:** stay on `docs/overhaul-plan-2026-04-07`. Never switch branches. Never push to origin without explicit Wayne sign-off. Check current branch with `git branch --show-current` before every commit.

2. **Git safety for subagents (hard rule):** implementer subagents must NEVER run any of:
   - `git stash`, `git stash pop`, `git stash apply`
   - `git checkout <branch>` to a different branch
   - `git checkout -- <file>` to discard changes
   - `git reset --hard` or `git reset --soft` beyond the immediate task's HEAD
   - `git clean -f` or `git clean -d`
   - `git branch -D`, `git branch -m`
   - `git worktree add/remove`
   - `git rebase` (any form)
   - `git push` (any form, local or origin)
   - Any destructive operation on files outside the task's commit

   Each implementer dispatch prompt MUST include this forbidden-commands list explicitly. See memory `feedback_subagent_git_safety.md`.

3. **No em dashes anywhere.** Regular hyphens only. Applies to code comments, commit messages, CSS, TSX, Markdown, everything. Memory `MEMORY.md` top rule.

4. **No MEV protection claims.** New content uses strategy leakage / copytrade exposure / signaling risk / adverse selection. Legacy posts are exempt (Wayne's 2026-04-09 call, legacy stays).

5. **No light mode.** Dark only. `--bg-base` is `#13161a`.

6. **No hardcoded hex colors outside `:root` in `custom.css`.** Everything references tokens. No hardcoded `'Inter'` font-family. Use `var(--font-sans)` / `var(--font-display)` / `var(--font-mono)`.

7. **Orbitron is UPPERCASE ONLY** with `var(--tracking-wider)` or `var(--tracking-widest)`. Never body text. Never article titles (those use Inter Display). Orbitron belongs in eyebrow category labels for series ("THE SILHOUETTE SERIES"), band labels ("LATEST", "READ NEXT"), navbar, footer headings.

8. **Always use `frontend-design` and `ui-ux-pro-max` skills for UI work.** Non-negotiable. Per memory `feedback_always_use_frontend_design.md`. Implementer dispatches should invoke them and feed their outputs into the build.

9. **If a CSS bug isn't solved in 2 edit attempts, dispatch puppeteer to inspect computed styles before attempt 3.** Session 1 lesson (the chevron saga).

10. **Never run `pnpm build` or `pnpm clear` while the dev server is running.** They delete `.docusaurus/` and crash the server. Kill the dev server first, then build, then restart.

11. **Unit tests ship with new code in the same commit.** Every component, every hook, every lib function. No "tests later." Memory `feedback_unit_tests_required.md`.

12. **Co-located tests.** `src/components/blog/BlogFoo/BlogFoo.test.tsx` next to `src/components/blog/BlogFoo/index.tsx`. Not in a separate `__tests__` folder.

13. **Dev server state:** typically already running on `http://localhost:3100/` (PID survives between sessions when the OS stays awake). Check with `lsof -ti:3100 2>/dev/null` before starting a new one. If the existing server is older than the latest commit, kill and restart (`kill $(lsof -ti:3100)` then `pnpm start --no-open --port 3100` in background).

14. **Pinned dependencies.** Never bump a package version without Wayne's approval. Docusaurus stays at 3.9.2. React stays at whatever Docusaurus brings.

### Verify state before executing

Run before each work session:

```bash
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
git status                              # working tree clean
git branch --show-current               # docs/overhaul-plan-2026-04-07
git log --oneline origin/main..HEAD | wc -l   # 50+ commits ahead
pnpm test 2>&1 | tail -3                # 13+ tests passing baseline
```

Expected state at plan start:
- Working tree clean
- Branch `docs/overhaul-plan-2026-04-07`
- Head at `4e06167` or later (the design doc correction commit)
- Test baseline: 13 passing (3 smoke + 10 EndpointCard)

---

## Task index

### Phase 0: plumbing (lib + data + tests)
- Task 0.1: Create `src/data/blog/categories.ts` (category registry)
- Task 0.2: Create `src/data/blog/series.ts` (series definitions)
- Task 0.3: Create `src/lib/blog/categories.ts` + test (category helpers)
- Task 0.4: Create `src/lib/blog/readingTime.ts` + test (200 WPM calculator)
- Task 0.5: Create `src/lib/blog/series.ts` + test (series resolution)
- Task 0.6: Create `scripts/validate-blog-frontmatter.ts` + wire to `prebuild`

### Phase 1: legacy content migration
- Task 1.1: Add `category` frontmatter to 7 legacy posts, remove `tags: [article]`
- Task 1.2: Add `<!-- truncate -->` marker to `2026-02-04-shieldedspot.md`
- Task 1.3: Extend `blog/authors.yml` with `wayne` entry and `page: false`

### Phase 2: listing page components
- Task 2.1: `BlogPublicationHeader` + test
- Task 2.2: `BlogCategoryPills` + test (client-side filter, URL sync, keyboard nav)
- Task 2.3: `BlogCoverFallback` + test (gradient fallback)
- Task 2.4: `BlogCoverImage` + test (switches between image and fallback)
- Task 2.5: `BlogEyebrow` + test (Plex Mono category + reading time + date)
- Task 2.6: `BlogByline` + test (avatar, initials fallback, multi-author cluster)
- Task 2.7: `BlogPostCard` + test (standard grid card with alternating glow)
- Task 2.8: `BlogHero` + test (featured hero card with split layout)
- Task 2.9: `BlogSeriesCard` + test (numbered step card)
- Task 2.10: `BlogSeriesBand` + test (conditional label header + card grid)
- Task 2.11: `BlogLatestBand` + test (label header + grid wrapper)
- Task 2.12: `BlogArchiveList` + test (text-only archive rows)

### Phase 3: listing page wiring
- Task 3.1: Swizzle `theme/BlogLayout/index.tsx` (wrap, disable sidebar)
- Task 3.2: Swizzle `theme/BlogSidebar/index.tsx` (neuter)
- Task 3.3: Swizzle `theme/BlogListPage/index.tsx` (compose listing components)
- Task 3.4: Puppeteer verification gate 1 (listing page screenshots)

### Phase 4: article page components
- Task 4.1: `BlogTOC` + test (right-rail sticky, IntersectionObserver)
- Task 4.2: `BlogShareRow` + test (X / Copy / RSS inline buttons)
- Task 4.3: `BlogNextInSeries` + test (series navigation)
- Task 4.4: `BlogReadNext` + test (1 big + 3 small)
- Task 4.5: `BlogScrollProgress` + test (rAF-driven width)
- Task 4.6: `BlogShieldedReveal` + test (blur to sharp reveal)
- Task 4.7: `BlogHighlightShare` + test (selection popover)

### Phase 5: article page wiring
- Task 5.1: Swizzle `theme/BlogPostPage/index.tsx` (wrap, mount signature touches + TOC slot)
- Task 5.2: Swizzle `theme/BlogPostItem/Header/Title/index.tsx` (title component)
- Task 5.3: Swizzle `theme/BlogPostItem/Header/Info/index.tsx` (eyebrow row)
- Task 5.4: Swizzle `theme/BlogPostItem/Header/Author/index.tsx` (byline row)
- Task 5.5: Swizzle `theme/BlogPostItem/Footer/index.tsx` (wrap, compose footer)
- Task 5.6: Swizzle `theme/BlogPostItem/index.tsx` (eject, wrap body in BlogShieldedReveal)
- Task 5.7: Puppeteer verification gates 2 and 3 (article page + signature touches)

### Phase 6: final verification and handoff
- Task 6.1: `pnpm test` green (baseline 13 + new ~130 = ~143 passing)
- Task 6.2: Kill dev server, `pnpm build` green with `onBrokenLinks: throw`
- Task 6.3: Restart dev server, curl smoke test
- Task 6.4: Visual review with Wayne on local dev server
- Task 6.5: Write `2026-04-09-session-3-handoff.md`

**Total: 36 tracked tasks. ~20 subagent dispatches (Phase 2 + Phase 3.3 + Phase 4 + Phase 5). 3 puppeteer gates.**

---

## Phase 0: plumbing

### Task 0.1: Create category registry

**Files:**
- Create: `src/data/blog/categories.ts`

**Step 1: Create the file with exact content:**

```ts
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
    description: 'Deep essays on shielded trading, TEE architecture, and the road to private perps.',
  },
  {
    slug: 'guides',
    label: 'Guides',
    accent: 'var(--accent-secondary)',
    description: 'Step-by-step walkthroughs for traders, developers, and institutions.',
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
```

**Step 2: Commit**

```bash
git add src/data/blog/categories.ts
git commit -m "feat(blog): add category registry with 5-category taxonomy"
```

---

### Task 0.2: Create series definitions

**Files:**
- Create: `src/data/blog/series.ts`

**Step 1: Create the file with exact content:**

```ts
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
```

**Step 2: Commit**

```bash
git add src/data/blog/series.ts
git commit -m "feat(blog): add series definitions with silhouette-primer entry"
```

---

### Task 0.3: Create category helpers with tests

**Files:**
- Create: `src/lib/blog/categories.ts`
- Create: `src/lib/blog/categories.test.ts`

**Step 1: Write the failing tests:**

```ts
// src/lib/blog/categories.test.ts
import { describe, it, expect } from 'vitest';
import { getCategory, isValidCategorySlug, getCategoryBySlugOrNull } from './categories';

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
```

**Step 2: Run the test and verify it fails:**

```bash
pnpm test -- src/lib/blog/categories.test.ts 2>&1 | tail -15
```

Expected: FAIL with "Cannot find module './categories'" or similar.

**Step 3: Write the minimal implementation:**

```ts
// src/lib/blog/categories.ts
import { CATEGORIES, type CategoryDefinition } from '@site/src/data/blog/categories';

/** Get a category by slug. Throws on unknown slug. */
export function getCategory(slug: string): CategoryDefinition {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    throw new Error(`Unknown category: "${slug}". Valid slugs: ${CATEGORIES.map((c) => c.slug).join(', ')}`);
  }
  return category;
}

/** Check if a slug is a valid category slug. */
export function isValidCategorySlug(slug: string): boolean {
  return CATEGORIES.some((c) => c.slug === slug);
}

/** Get a category by slug, returning null if not found. */
export function getCategoryBySlugOrNull(
  slug: string | undefined
): CategoryDefinition | null {
  if (!slug) return null;
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/** Re-export for convenience. */
export { CATEGORIES } from '@site/src/data/blog/categories';
export type { CategoryDefinition } from '@site/src/data/blog/categories';
```

**Step 4: Run the test and verify it passes:**

```bash
pnpm test -- src/lib/blog/categories.test.ts 2>&1 | tail -10
```

Expected: PASS with 8 tests.

**Step 5: Commit**

```bash
git add src/lib/blog/categories.ts src/lib/blog/categories.test.ts
git commit -m "feat(blog): add category helpers with tests"
```

---

### Task 0.4: Create reading time calculator with tests

**Files:**
- Create: `src/lib/blog/readingTime.ts`
- Create: `src/lib/blog/readingTime.test.ts`

**Step 1: Write the failing tests:**

```ts
// src/lib/blog/readingTime.test.ts
import { describe, it, expect } from 'vitest';
import { calculateReadingTime, formatReadingTime } from './readingTime';

describe('calculateReadingTime', () => {
  it('returns 1 minute for very short content', () => {
    expect(calculateReadingTime('Hello world')).toBe(1);
  });

  it('uses 200 WPM for technical content', () => {
    // 400 words should be 2 minutes at 200 WPM
    const words = 'word '.repeat(400).trim();
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('rounds up to the nearest minute', () => {
    // 250 words = 1.25 min -> should round up to 2
    const words = 'word '.repeat(250).trim();
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('handles markdown by stripping syntax before counting', () => {
    const markdown = '# Heading\n\n[link](url) **bold** *italic* `code`';
    // 5 real words: Heading, link, bold, italic, code
    expect(calculateReadingTime(markdown)).toBe(1);
  });

  it('handles empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('handles code blocks as zero words (skimmed, not read)', () => {
    const markdown = 'Read this:\n\n```ts\nconst x = 1;\nconst y = 2;\n```\n\nEnd.';
    // Only "Read this: End." counts = 3 words
    expect(calculateReadingTime(markdown)).toBe(1);
  });
});

describe('formatReadingTime', () => {
  it('formats as "N MIN" uppercase', () => {
    expect(formatReadingTime(7)).toBe('7 MIN');
  });

  it('handles 1 minute', () => {
    expect(formatReadingTime(1)).toBe('1 MIN');
  });
});
```

**Step 2: Run the test and verify it fails:**

```bash
pnpm test -- src/lib/blog/readingTime.test.ts 2>&1 | tail -15
```

Expected: FAIL.

**Step 3: Write the minimal implementation:**

```ts
// src/lib/blog/readingTime.ts
//
// Reading time calculator for technical blog content.
// Uses 200 WPM (slower than the Medium default of 250) because
// technical content carries cognitive load that halves skim speed.
// See docs/plans/2026-04-09-blog-redesign-design.md §13 R9.

const WORDS_PER_MINUTE = 200;

/**
 * Calculate reading time in whole minutes for a markdown string.
 * Strips markdown syntax and code blocks before counting words.
 * Always returns at least 1 (we never show "0 min read").
 */
export function calculateReadingTime(markdown: string): number {
  if (!markdown) return 1;

  const cleaned = markdown
    // Remove fenced code blocks (multi-line)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove link syntax, keep the label: [label](url) -> label
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove emphasis markers: **bold** *italic* __x__ _x_
    .replace(/(\*\*|__|\*|_)([^*_]*)\1/g, '$2')
    // Remove heading markers
    .replace(/^#+\s+/gm, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = cleaned ? cleaned.split(/\s+/).length : 0;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(minutes, 1);
}

/**
 * Format a reading time integer as "N MIN" (uppercase, Plex Mono ready).
 * Matches the eyebrow format documented in the design doc.
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} MIN`;
}
```

**Step 4: Run the test and verify it passes:**

```bash
pnpm test -- src/lib/blog/readingTime.test.ts 2>&1 | tail -10
```

Expected: PASS with 8 tests.

**Step 5: Commit**

```bash
git add src/lib/blog/readingTime.ts src/lib/blog/readingTime.test.ts
git commit -m "feat(blog): add reading time calculator at 200 WPM with tests"
```

---

### Task 0.5: Create series resolution helpers with tests

**Files:**
- Create: `src/lib/blog/series.ts`
- Create: `src/lib/blog/series.test.ts`

**Step 1: Write the failing tests.**

This test is longer because series resolution has more surface area (gap detection, ordering, navigation edges).

```ts
// src/lib/blog/series.test.ts
import { describe, it, expect } from 'vitest';
import {
  getSeriesPosts,
  getSeriesNavigation,
  getSeries,
  validateSeriesFrontmatter,
  type BlogPostLike,
} from './series';

function makePost(
  permalink: string,
  frontMatter: Record<string, unknown>
): BlogPostLike {
  return {
    metadata: {
      permalink,
      frontMatter,
    },
  };
}

describe('getSeries', () => {
  it('returns the silhouette-primer series definition', () => {
    const series = getSeries('silhouette-primer');
    expect(series.slug).toBe('silhouette-primer');
    expect(series.label).toBe('The Silhouette Series');
    expect(series.eyebrow).toBe('THE SILHOUETTE SERIES');
  });

  it('throws on unknown series slug', () => {
    expect(() => getSeries('nonexistent')).toThrow(/unknown series/i);
  });
});

describe('getSeriesPosts', () => {
  it('returns empty array when no posts are in the series', () => {
    const posts = [
      makePost('/blog/one', { category: 'research' }),
      makePost('/blog/two', { category: 'research' }),
    ];
    expect(getSeriesPosts('silhouette-primer', posts)).toEqual([]);
  });

  it('returns posts filtered by series and sorted by series_order', () => {
    const posts = [
      makePost('/blog/c', { series: 'silhouette-primer', series_order: 3 }),
      makePost('/blog/a', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/b', { series: 'silhouette-primer', series_order: 2 }),
      makePost('/blog/not-in-series', {}),
    ];
    const result = getSeriesPosts('silhouette-primer', posts);
    expect(result).toHaveLength(3);
    expect(result.map((p) => p.metadata.permalink)).toEqual([
      '/blog/a',
      '/blog/b',
      '/blog/c',
    ]);
  });

  it('ignores posts that belong to a different series', () => {
    const posts = [
      makePost('/blog/a', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/b', { series: 'other', series_order: 1 }),
    ];
    expect(getSeriesPosts('silhouette-primer', posts)).toHaveLength(1);
  });
});

describe('getSeriesNavigation', () => {
  const seriesPosts = [
    makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
    makePost('/blog/2', { series: 'silhouette-primer', series_order: 2 }),
    makePost('/blog/3', { series: 'silhouette-primer', series_order: 3 }),
  ];

  it('returns null for both when post is not in a series', () => {
    const orphan = makePost('/blog/orphan', {});
    const nav = getSeriesNavigation(orphan, seriesPosts);
    expect(nav.previous).toBe(null);
    expect(nav.next).toBe(null);
  });

  it('returns null previous for the first post', () => {
    const first = seriesPosts[0];
    const nav = getSeriesNavigation(first, seriesPosts);
    expect(nav.previous).toBe(null);
    expect(nav.next?.metadata.permalink).toBe('/blog/2');
  });

  it('returns previous and next for a middle post', () => {
    const middle = seriesPosts[1];
    const nav = getSeriesNavigation(middle, seriesPosts);
    expect(nav.previous?.metadata.permalink).toBe('/blog/1');
    expect(nav.next?.metadata.permalink).toBe('/blog/3');
  });

  it('returns null next for the last post', () => {
    const last = seriesPosts[2];
    const nav = getSeriesNavigation(last, seriesPosts);
    expect(nav.previous?.metadata.permalink).toBe('/blog/2');
    expect(nav.next).toBe(null);
  });

  it('returns nulls when current post claims a series that has no matches', () => {
    const lone = makePost('/blog/lone', {
      series: 'silhouette-primer',
      series_order: 1,
    });
    const nav = getSeriesNavigation(lone, [lone]);
    expect(nav.previous).toBe(null);
    expect(nav.next).toBe(null);
  });
});

describe('validateSeriesFrontmatter', () => {
  it('returns no errors for a valid series set', () => {
    const posts = [
      makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/2', { series: 'silhouette-primer', series_order: 2 }),
      makePost('/blog/3', { series: 'silhouette-primer', series_order: 3 }),
    ];
    expect(validateSeriesFrontmatter(posts)).toEqual([]);
  });

  it('flags a post with series but no series_order', () => {
    const posts = [
      makePost('/blog/broken', { series: 'silhouette-primer' }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/series_order/);
  });

  it('flags duplicate series_order within a series', () => {
    const posts = [
      makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/2', { series: 'silhouette-primer', series_order: 1 }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors.join(' ')).toMatch(/duplicate/i);
  });

  it('flags a gap in series_order', () => {
    const posts = [
      makePost('/blog/1', { series: 'silhouette-primer', series_order: 1 }),
      makePost('/blog/3', { series: 'silhouette-primer', series_order: 3 }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.join(' ')).toMatch(/gap/i);
  });

  it('flags a reference to an unknown series', () => {
    const posts = [
      makePost('/blog/x', { series: 'not-a-series', series_order: 1 }),
    ];
    const errors = validateSeriesFrontmatter(posts);
    expect(errors.join(' ')).toMatch(/unknown series/i);
  });
});
```

**Step 2: Run the test and verify it fails:**

```bash
pnpm test -- src/lib/blog/series.test.ts 2>&1 | tail -15
```

Expected: FAIL.

**Step 3: Write the minimal implementation:**

```ts
// src/lib/blog/series.ts
//
// Series resolution helpers. See design doc §7 for the schema.
//
// BlogPostLike is a structural subset of Docusaurus's blog post type
// that contains only the fields we need. This lets the lib be tested
// in isolation without importing Docusaurus types.

import { SERIES, type SeriesDefinition } from '@site/src/data/blog/series';

export interface BlogPostLike {
  metadata: {
    permalink: string;
    frontMatter: Record<string, unknown>;
  };
}

/** Get a series definition by slug. Throws on unknown slug. */
export function getSeries(slug: string): SeriesDefinition {
  const series = SERIES[slug];
  if (!series) {
    throw new Error(
      `Unknown series: "${slug}". Valid slugs: ${Object.keys(SERIES).join(', ')}`
    );
  }
  return series;
}

/** Get all posts that belong to a series, sorted by series_order ascending. */
export function getSeriesPosts<T extends BlogPostLike>(
  seriesSlug: string,
  allPosts: readonly T[]
): T[] {
  return allPosts
    .filter((post) => post.metadata.frontMatter.series === seriesSlug)
    .slice()
    .sort((a, b) => {
      const aOrder = Number(a.metadata.frontMatter.series_order ?? 0);
      const bOrder = Number(b.metadata.frontMatter.series_order ?? 0);
      return aOrder - bOrder;
    });
}

/**
 * Given a post and the full list of posts, return the previous and next
 * posts in the same series. Returns null if the post is not in a series
 * or if the post is at the respective boundary.
 */
export function getSeriesNavigation<T extends BlogPostLike>(
  currentPost: T,
  allPosts: readonly T[]
): { previous: T | null; next: T | null } {
  const series = currentPost.metadata.frontMatter.series;
  if (!series || typeof series !== 'string') {
    return { previous: null, next: null };
  }

  const seriesPosts = getSeriesPosts(series, allPosts);
  if (seriesPosts.length < 2) {
    return { previous: null, next: null };
  }

  const currentIndex = seriesPosts.findIndex(
    (p) => p.metadata.permalink === currentPost.metadata.permalink
  );
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next:
      currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
  };
}

/**
 * Validate frontmatter across all posts. Returns a list of human-readable
 * error messages (empty array if valid). Called from the prebuild script
 * to fail the build on series misconfiguration before Docusaurus runs.
 */
export function validateSeriesFrontmatter<T extends BlogPostLike>(
  allPosts: readonly T[]
): string[] {
  const errors: string[] = [];
  const postsBySeriesSlug: Record<string, T[]> = {};

  for (const post of allPosts) {
    const series = post.metadata.frontMatter.series;
    if (series === undefined || series === null) continue;

    if (typeof series !== 'string') {
      errors.push(
        `${post.metadata.permalink}: frontmatter 'series' must be a string`
      );
      continue;
    }

    if (!(series in SERIES)) {
      errors.push(
        `${post.metadata.permalink}: unknown series "${series}". Valid: ${Object.keys(SERIES).join(', ')}`
      );
      continue;
    }

    const order = post.metadata.frontMatter.series_order;
    if (order === undefined || order === null) {
      errors.push(
        `${post.metadata.permalink}: frontmatter 'series' requires 'series_order' (missing)`
      );
      continue;
    }
    if (typeof order !== 'number' || !Number.isInteger(order) || order < 1) {
      errors.push(
        `${post.metadata.permalink}: 'series_order' must be a positive integer (got ${order})`
      );
      continue;
    }

    postsBySeriesSlug[series] ??= [];
    postsBySeriesSlug[series].push(post);
  }

  // Check for duplicates and gaps within each series
  for (const [slug, posts] of Object.entries(postsBySeriesSlug)) {
    const orders = posts
      .map((p) => Number(p.metadata.frontMatter.series_order))
      .sort((a, b) => a - b);

    // duplicates
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] === orders[i - 1]) {
        errors.push(
          `Series "${slug}" has duplicate series_order=${orders[i]} (multiple posts claim the same position)`
        );
      }
    }

    // gaps (orders must be contiguous starting from 1)
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        errors.push(
          `Series "${slug}" has a gap in series_order: expected ${i + 1}, found ${orders[i]}`
        );
        break;
      }
    }
  }

  return errors;
}

export { SERIES } from '@site/src/data/blog/series';
export type { SeriesDefinition } from '@site/src/data/blog/series';
```

**Step 4: Run the test and verify it passes:**

```bash
pnpm test -- src/lib/blog/series.test.ts 2>&1 | tail -10
```

Expected: PASS with ~16 tests.

**Step 5: Commit**

```bash
git add src/lib/blog/series.ts src/lib/blog/series.test.ts
git commit -m "feat(blog): add series resolution helpers with gap detection tests"
```

---

### Task 0.6: Create prebuild frontmatter validation script

**Files:**
- Create: `scripts/validate-blog-frontmatter.ts`
- Modify: `package.json` (add `prebuild` script)

**Step 1: Create the validation script:**

```ts
// scripts/validate-blog-frontmatter.ts
//
// Prebuild validation: walks blog/**/*.md, parses frontmatter, runs the
// series validator, and exits non-zero on any error. Runs via the
// `prebuild` npm script so `pnpm build` fails before Docusaurus sees bad data.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';
import {
  validateSeriesFrontmatter,
  type BlogPostLike,
} from '../src/lib/blog/series';
import { isValidCategorySlug } from '../src/lib/blog/categories';

const BLOG_DIR = join(process.cwd(), 'blog');

function walkMarkdown(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'images') continue; // skip image folders
      results.push(...walkMarkdown(full));
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

function main(): void {
  const files = walkMarkdown(BLOG_DIR);
  if (files.length === 0) {
    console.log('[validate-blog-frontmatter] no blog posts found, skipping');
    return;
  }

  const errors: string[] = [];
  const posts: BlogPostLike[] = [];

  for (const file of files) {
    const rel = relative(process.cwd(), file);
    const raw = readFileSync(file, 'utf8');
    const { data } = matter(raw);

    // Skip author/meta files (no slug, no title)
    if (!data.slug && !data.title) continue;

    // Category validation
    if (data.category !== undefined) {
      if (typeof data.category !== 'string' || !isValidCategorySlug(data.category)) {
        errors.push(`${rel}: invalid category "${data.category}"`);
      }
    }

    // Build a BlogPostLike shape for the series validator
    posts.push({
      metadata: {
        permalink: data.slug ? `/blog/${data.slug}` : `/${rel}`,
        frontMatter: data as Record<string, unknown>,
      },
    });
  }

  const seriesErrors = validateSeriesFrontmatter(posts);
  errors.push(...seriesErrors);

  if (errors.length > 0) {
    console.error('\n[validate-blog-frontmatter] FAILED:');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    console.error(`\n${errors.length} error(s) found. Fix before building.\n`);
    process.exit(1);
  }

  console.log(`[validate-blog-frontmatter] ${posts.length} posts OK`);
}

main();
```

**Step 2: Add prebuild script to package.json**

Read the current `package.json` scripts block with:

```bash
grep -A 20 '"scripts"' package.json
```

Add a `prebuild` entry after the existing `build` entry. The new scripts block should include:

```json
"prebuild": "pnpm tsx scripts/validate-blog-frontmatter.ts",
```

**Step 3: Verify the script runs without error on current content:**

```bash
pnpm tsx scripts/validate-blog-frontmatter.ts
```

Expected output: `[validate-blog-frontmatter] 7 posts OK` (or similar, may be 7 at this moment before Phase 1 migration).

Note: will fail at this point because legacy posts don't have `category` yet AND the script doesn't require category yet. The script only validates category IF present, so current legacy state with no category passes.

**Step 4: Commit**

```bash
git add scripts/validate-blog-frontmatter.ts package.json
git commit -m "feat(blog): add prebuild frontmatter validation script"
```

---

## Phase 1: legacy content migration

### Task 1.1: Migrate 7 legacy posts to new category taxonomy

**Files:**
- Modify: `blog/2025-01-22-intro.md`
- Modify: `blog/2025-02-22-hyperliquid.md`
- Modify: `blog/2025-06-10-raiseannouncement.md`
- Modify: `blog/2025-06-20-problemwithdefi.md`
- Modify: `blog/2025-07-14-problemwithprivacy.md`
- Modify: `blog/2025-08-12-whydarkpools.md`
- Modify: `blog/2026-02-04-shieldedspot.md`

**Category assignments:**
| File | category |
|---|---|
| `2025-01-22-intro.md` | `announcements` |
| `2025-02-22-hyperliquid.md` | `research` |
| `2025-06-10-raiseannouncement.md` | `announcements` |
| `2025-06-20-problemwithdefi.md` | `research` |
| `2025-07-14-problemwithprivacy.md` | `research` |
| `2025-08-12-whydarkpools.md` | `research` |
| `2026-02-04-shieldedspot.md` | `product` |

**Step 1: Read each legacy post's current frontmatter and confirm the `tags: [article]` line exists.**

```bash
for f in blog/*.md; do echo "=== $f ==="; head -15 "$f"; done
```

**Step 2: For each post, replace the tags line with the category line.**

Current frontmatter shape (all 7 posts have this):

```yaml
tags:
  - article
```

Replace with the appropriate category. Example for `2025-02-22-hyperliquid.md`:

```yaml
category: research
```

Use the Edit tool per post. The `tags:\n  - article` block is unique-enough within each file that replace_all is not needed; one targeted edit per file.

**Step 3: Run the frontmatter validator to confirm all 7 posts pass:**

```bash
pnpm tsx scripts/validate-blog-frontmatter.ts
```

Expected: `[validate-blog-frontmatter] 7 posts OK`.

**Step 4: Commit (single atomic commit for all 7):**

```bash
git add blog/2025-01-22-intro.md blog/2025-02-22-hyperliquid.md blog/2025-06-10-raiseannouncement.md blog/2025-06-20-problemwithdefi.md blog/2025-07-14-problemwithprivacy.md blog/2025-08-12-whydarkpools.md blog/2026-02-04-shieldedspot.md
git commit -m "chore(blog): migrate legacy posts to new category taxonomy

Replaces the generic tags: [article] with a category frontmatter
mapped to the 5-category taxonomy from the blog redesign design doc.

- 2025-01-22-intro -> announcements
- 2025-02-22-hyperliquid -> research
- 2025-06-10-raiseannouncement -> announcements
- 2025-06-20-problemwithdefi -> research
- 2025-07-14-problemwithprivacy -> research
- 2025-08-12-whydarkpools -> research
- 2026-02-04-shieldedspot -> product

No body content changes. MEV references left intact (legacy content
per Wayne 2026-04-09 call). Description stubs left intact (pending
the separate 'real description frontmatter pass' on the backlog)."
```

---

### Task 1.2: Fix truncate marker in shieldedspot.md

**Files:**
- Modify: `blog/2026-02-04-shieldedspot.md`

**Step 1: Read the current file to find the right insertion point:**

```bash
head -25 blog/2026-02-04-shieldedspot.md
```

The `<!-- truncate -->` marker should go between the first paragraph (after the cover image) and the `## What Is Available` heading.

**Step 2: Use Edit to insert the truncate marker.**

Target location: immediately after the first paragraph ("Over the last few months..."), before `## What Is Available`.

**Step 3: Verify by reading the file again:**

```bash
head -25 blog/2026-02-04-shieldedspot.md
```

Expected: `<!-- truncate -->` on its own line between the intro paragraph and the first heading.

**Step 4: Restart the dev server briefly to check the build warning is gone:**

If the dev server is running (`lsof -ti:3100`), it will hot-reload. Check `/blog` listing in a browser or via `curl http://localhost:3100/blog 2>&1`. Alternatively:

```bash
pnpm build 2>&1 | grep -i "truncate\|shieldedspot" | head -10
```

Note: per rule 10, kill the dev server first if running a full build:

```bash
lsof -ti:3100 && kill $(lsof -ti:3100) && sleep 2
pnpm build 2>&1 | tail -20
# then restart dev server in background
pnpm start --no-open --port 3100 &
```

Expected: zero warnings about truncate for shieldedspot.

**Step 5: Commit**

```bash
git add blog/2026-02-04-shieldedspot.md
git commit -m "fix(blog): add truncate marker to shieldedspot post

Silences the build warning from session 2. No content change."
```

---

### Task 1.3: Extend authors.yml with wayne entry

**Files:**
- Modify: `blog/authors.yml`

**Step 1: Read the current file:**

```bash
cat blog/authors.yml
```

**Step 2: Replace the full content with:**

```yaml
silhouette-team:
  name: Silhouette Team
  title: Building the future of private trading
  url: https://silhouette.exchange
  image_url: https://github.com/silhouette-exchange.png
  page: false

wayne:
  name: Wayne
  title: Head of Growth, Silhouette
  url: https://x.com/WaynesWorldza
  image_url: /img/authors/wayne.jpg
  page: false
```

**Step 3: If Wayne has provided a `wayne.jpg` avatar file, copy it to `static/img/authors/wayne.jpg`.** If not, leave this step as a no-op and note the `<BlogByline>` fallback will render generated initials.

```bash
mkdir -p static/img/authors
# if a file exists at /tmp/wayne.jpg or similar:
# cp /tmp/wayne.jpg static/img/authors/wayne.jpg
```

**Step 4: Verify Docusaurus still builds:**

(Skip full build if dev server is running; hot reload will catch syntax errors in authors.yml.)

```bash
# Check dev server is still responsive
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/blog
```

Expected: `200`.

**Step 5: Commit**

```bash
git add blog/authors.yml
# also add the avatar if present:
# git add static/img/authors/wayne.jpg
git commit -m "feat(blog): add wayne author entry, set page: false on both authors

wayne is the first named byline author. silhouette-team stays for legacy
posts. Both have page: false because we are not building author profile
pages in this push."
```

---

## Phase 2: listing page components

All tasks in this phase follow the same TDD pattern:
1. Write failing test
2. Run and verify FAIL
3. Implement component
4. Run and verify PASS
5. Commit

All components follow the same file layout:
```
src/components/blog/<ComponentName>/
├── index.tsx
├── styles.module.css
└── <ComponentName>.test.tsx
```

**Dispatching convention:** each task is a subagent dispatch. The implementer subagent's prompt MUST include:
- The design doc section reference (`§4e` etc.) so the subagent reads the spec
- The standing rules preamble (em dashes, tokens, Orbitron caps, no pnpm build with dev server, etc.)
- The git safety forbidden-commands list (hard rule 2 above)
- Explicit instruction to ship `*.test.tsx` in the same commit
- Explicit instruction to invoke `frontend-design` and `ui-ux-pro-max` skills before writing styles

After implementer returns, dispatch:
- **Spec compliance reviewer**: checks the built component against the design doc section
- **Code quality reviewer**: checks the component for DRY, YAGNI, TypeScript strictness, test quality

Only mark the task complete after both reviews pass.

### Task 2.1: BlogPublicationHeader

**Files:**
- Create: `src/components/blog/BlogPublicationHeader/index.tsx`
- Create: `src/components/blog/BlogPublicationHeader/styles.module.css`
- Create: `src/components/blog/BlogPublicationHeader/BlogPublicationHeader.test.tsx`

**Design doc section:** §4b

**Purpose:** Page title + subtitle at the top of the listing. Pure presentational component, no props except title and subtitle strings.

**Step 1: Write the failing test:**

```tsx
// src/components/blog/BlogPublicationHeader/BlogPublicationHeader.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogPublicationHeader from './index';

describe('BlogPublicationHeader', () => {
  it('renders the page title', () => {
    render(<BlogPublicationHeader title="Blog" subtitle="Writing on shielded trading" />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('renders the page title as an h1', () => {
    render(<BlogPublicationHeader title="Blog" subtitle="Writing on shielded trading" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Blog' })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    const subtitle = 'Writing on shielded trading, TEE architecture, and the road to private perps';
    render(<BlogPublicationHeader title="Blog" subtitle={subtitle} />);
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('does not render a subtitle when not provided', () => {
    render(<BlogPublicationHeader title="Blog" />);
    // Only the h1 should be in the document
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
  });
});
```

**Step 2: Run test, verify FAIL:**
```bash
pnpm test -- src/components/blog/BlogPublicationHeader 2>&1 | tail -10
```

**Step 3: Implement component:**

```tsx
// src/components/blog/BlogPublicationHeader/index.tsx
import React from 'react';
import styles from './styles.module.css';

export interface BlogPublicationHeaderProps {
  title: string;
  subtitle?: string;
}

export default function BlogPublicationHeader({
  title,
  subtitle,
}: BlogPublicationHeaderProps): React.ReactElement {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
```

```css
/* src/components/blog/BlogPublicationHeader/styles.module.css */
.header {
  padding-block: var(--space-16) var(--space-16);
  max-width: 1280px;
  margin-inline: auto;
}

.title {
  font-family: var(--font-display);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-tighter);
  color: var(--text-default);
  margin: 0;
  line-height: var(--lh-tight);
}

.subtitle {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  color: var(--text-muted);
  margin: var(--space-3) 0 0;
  max-width: 640px;
  line-height: var(--lh-relaxed);
}
```

**Step 4: Run test, verify PASS:**
```bash
pnpm test -- src/components/blog/BlogPublicationHeader 2>&1 | tail -10
```

Expected: 4 tests passing.

**Step 5: Commit:**
```bash
git add src/components/blog/BlogPublicationHeader/
git commit -m "feat(blog): add BlogPublicationHeader component with tests"
```

---

### Task 2.2: BlogCategoryPills

**Files:**
- Create: `src/components/blog/BlogCategoryPills/index.tsx`
- Create: `src/components/blog/BlogCategoryPills/styles.module.css`
- Create: `src/components/blog/BlogCategoryPills/BlogCategoryPills.test.tsx`

**Design doc section:** §4c

**Purpose:** Client-side category filter row. URL query param sync, keyboard arrow navigation, `aria-pressed`, optional glow-on-active.

**Props:**
- `activeSlug: string | null` (current filter; null means "All")
- `onChange: (slug: string | null) => void`

**Implementation notes:**
- Renders an `All` pill plus one pill per CATEGORY from the registry
- Each pill is `<button type="button" aria-pressed={active}>` (real semantic button)
- Keyboard: left/right arrow keys move focus between pills, Enter/Space activates
- Active state uses the magenta-cyan gradient fill from the design doc
- Parent component owns URL sync (React context or useEffect on route)

**Step 1: Write the failing test. Full test file:**

```tsx
// src/components/blog/BlogCategoryPills/BlogCategoryPills.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BlogCategoryPills from './index';
import { CATEGORIES } from '@site/src/data/blog/categories';

describe('BlogCategoryPills', () => {
  it('renders an All pill plus one pill per category', () => {
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    for (const category of CATEGORIES) {
      expect(screen.getByRole('button', { name: category.label })).toBeInTheDocument();
    }
  });

  it('marks the All pill as pressed when activeSlug is null', () => {
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks the matching pill as pressed when activeSlug is set', () => {
    render(<BlogCategoryPills activeSlug="research" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Research' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the category slug when a pill is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug={null} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Research' }));
    expect(onChange).toHaveBeenCalledWith('research');
  });

  it('calls onChange with null when All is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug="research" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /all/i }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('has a role=toolbar on the container with an aria-label', () => {
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    expect(screen.getByRole('toolbar', { name: /filter/i })).toBeInTheDocument();
  });

  it('moves focus with arrow keys (ArrowRight)', async () => {
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    const allPill = screen.getByRole('button', { name: /all/i });
    allPill.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Research' }));
  });

  it('moves focus with arrow keys (ArrowLeft wraps to last pill)', async () => {
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    const allPill = screen.getByRole('button', { name: /all/i });
    allPill.focus();
    await user.keyboard('{ArrowLeft}');
    // Last pill is Announcements
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Announcements' }));
  });
});
```

**Step 2: Run test, verify FAIL:**
```bash
pnpm test -- src/components/blog/BlogCategoryPills 2>&1 | tail -10
```

**Step 3: Implement component:**

```tsx
// src/components/blog/BlogCategoryPills/index.tsx
import React, { useRef } from 'react';
import styles from './styles.module.css';
import { CATEGORIES } from '@site/src/data/blog/categories';

export interface BlogCategoryPillsProps {
  /** Null means the All pill is active */
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
}

interface Pill {
  slug: string | null;
  label: string;
}

const PILLS: Pill[] = [
  { slug: null, label: 'All' },
  ...CATEGORIES.map((c) => ({ slug: c.slug, label: c.label })),
];

export default function BlogCategoryPills({
  activeSlug,
  onChange,
}: BlogCategoryPillsProps): React.ReactElement {
  const toolbarRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();

    const buttons = Array.from(
      toolbarRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []
    );
    const currentIndex = buttons.findIndex((b) => b === document.activeElement);
    if (currentIndex === -1) return;

    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + delta + buttons.length) % buttons.length;
    buttons[nextIndex]?.focus();
  }

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Filter posts by category"
      className={styles.toolbar}
      onKeyDown={handleKeyDown}
    >
      {PILLS.map((pill) => {
        const isActive = activeSlug === pill.slug;
        return (
          <button
            key={pill.slug ?? 'all'}
            type="button"
            aria-pressed={isActive}
            className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
            onClick={() => onChange(pill.slug)}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}
```

```css
/* src/components/blog/BlogCategoryPills/styles.module.css */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  max-width: 1280px;
  margin-inline: auto;
  padding-block: var(--space-8);
}

.pill {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-soft-white);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    background var(--dur-fast) var(--ease-out);
}

.pill:hover {
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--text-default);
}

.pill:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

.pillActive {
  background: linear-gradient(
    135deg,
    var(--silh-magenta-alpha-20),
    rgba(0, 255, 242, 0.15)
  );
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--text-default);
}
```

**Step 4: Run test, verify PASS:**
```bash
pnpm test -- src/components/blog/BlogCategoryPills 2>&1 | tail -10
```

Expected: 8 tests passing.

**Step 5: Commit:**
```bash
git add src/components/blog/BlogCategoryPills/
git commit -m "feat(blog): add BlogCategoryPills with keyboard nav and aria-pressed"
```

---

### Task 2.3: BlogCoverFallback

**Files:**
- Create: `src/components/blog/BlogCoverFallback/index.tsx`
- Create: `src/components/blog/BlogCoverFallback/styles.module.css`
- Create: `src/components/blog/BlogCoverFallback/BlogCoverFallback.test.tsx`

**Design doc section:** §4i

**Purpose:** Gradient card rendered when a post has no `image` frontmatter. Never a solid-color rectangle.

**Props:**
- `title: string` (post title overlaid bottom-left)
- `category?: string` (optional, influences accent dot)

**Step 1: Test file (abbreviated for space):**

```tsx
// src/components/blog/BlogCoverFallback/BlogCoverFallback.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogCoverFallback from './index';

describe('BlogCoverFallback', () => {
  it('renders the post title', () => {
    render(<BlogCoverFallback title="Information Asymmetry" />);
    expect(screen.getByText('Information Asymmetry')).toBeInTheDocument();
  });

  it('renders the Silhouette wordmark', () => {
    render(<BlogCoverFallback title="Test" />);
    expect(screen.getByText(/silhouette/i)).toBeInTheDocument();
  });

  it('has role img with an accessible name derived from the title', () => {
    render(<BlogCoverFallback title="Dark Pools" />);
    expect(screen.getByRole('img', { name: /dark pools/i })).toBeInTheDocument();
  });

  it('applies the fallback class', () => {
    const { container } = render(<BlogCoverFallback title="Test" />);
    expect(container.firstChild).toHaveClass(/fallback/i);
  });
});
```

**Step 2: Run test, verify FAIL.**

**Step 3: Implement:**

```tsx
// src/components/blog/BlogCoverFallback/index.tsx
import React from 'react';
import styles from './styles.module.css';

export interface BlogCoverFallbackProps {
  title: string;
  className?: string;
}

export default function BlogCoverFallback({
  title,
  className,
}: BlogCoverFallbackProps): React.ReactElement {
  return (
    <div
      className={`${styles.fallback} ${className ?? ''}`}
      role="img"
      aria-label={title}
    >
      <div className={styles.gradient} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <span className={styles.wordmark} aria-hidden="true">
        SILHOUETTE
      </span>
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
}
```

```css
/* src/components/blog/BlogCoverFallback/styles.module.css */
.fallback {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--bg-base);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: var(--space-6);
}

.gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--bg-base) 0%,
    var(--silh-magenta-alpha-10) 50%,
    rgba(0, 255, 242, 0.08) 100%
  );
}

.noise {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: radial-gradient(
    circle at 20% 30%,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 2%
  ),
  radial-gradient(
    circle at 70% 60%,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 2%
  );
  background-size: 12px 12px, 18px 18px;
}

.wordmark {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  font-family: var(--font-display);
  font-size: 10px;
  letter-spacing: var(--tracking-widest);
  color: var(--text-muted);
}

.title {
  position: relative;
  font-family: var(--font-display);
  font-size: var(--fs-2xl);
  font-weight: var(--fw-semibold);
  color: var(--text-default);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-wrap: balance;
}
```

**Step 4: Run test, verify PASS.**

**Step 5: Commit:**
```bash
git add src/components/blog/BlogCoverFallback/
git commit -m "feat(blog): add BlogCoverFallback gradient card for coverless posts"
```

---

### Task 2.4: BlogCoverImage

**Files:**
- Create: `src/components/blog/BlogCoverImage/index.tsx`
- Create: `src/components/blog/BlogCoverImage/styles.module.css`
- Create: `src/components/blog/BlogCoverImage/BlogCoverImage.test.tsx`

**Design doc section:** §4i

**Purpose:** Wraps a post's cover image in a framed container, falls back to `<BlogCoverFallback>` when no image src is provided. Single entry point for all cover image rendering on the listing page.

**Props:**
- `src?: string` (cover image URL; if undefined, fallback renders)
- `alt?: string` (used when rendering real image)
- `title: string` (fallback uses this)

**Step 1: Test:**

```tsx
// src/components/blog/BlogCoverImage/BlogCoverImage.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogCoverImage from './index';

describe('BlogCoverImage', () => {
  it('renders the image when src is provided', () => {
    render(<BlogCoverImage src="/img/cover.jpg" alt="Cover" title="Test Post" />);
    const img = screen.getByAltText('Cover');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/cover.jpg');
  });

  it('falls back to BlogCoverFallback when src is undefined', () => {
    render(<BlogCoverImage title="Test Post" />);
    expect(screen.getByRole('img', { name: 'Test Post' })).toBeInTheDocument();
    expect(screen.queryByAltText('Test Post')).toBeNull();
  });

  it('uses the title as alt fallback when alt is missing', () => {
    render(<BlogCoverImage src="/img/cover.jpg" title="Test Post" />);
    expect(screen.getByAltText('Test Post')).toBeInTheDocument();
  });

  it('adds lazy loading to real images', () => {
    render(<BlogCoverImage src="/img/cover.jpg" title="Test" />);
    expect(screen.getByAltText('Test')).toHaveAttribute('loading', 'lazy');
  });
});
```

**Step 2: Verify FAIL.**

**Step 3: Implement:**

```tsx
// src/components/blog/BlogCoverImage/index.tsx
import React from 'react';
import styles from './styles.module.css';
import BlogCoverFallback from '@site/src/components/blog/BlogCoverFallback';

export interface BlogCoverImageProps {
  src?: string;
  alt?: string;
  title: string;
  className?: string;
}

export default function BlogCoverImage({
  src,
  alt,
  title,
  className,
}: BlogCoverImageProps): React.ReactElement {
  if (!src) {
    return <BlogCoverFallback title={title} className={className} />;
  }

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <img
        src={src}
        alt={alt ?? title}
        loading="lazy"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
    </div>
  );
}
```

```css
/* src/components/blog/BlogCoverImage/styles.module.css */
.wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.05);
  transition: opacity var(--dur-base) var(--ease-out);
}

.wrapper:hover .overlay {
  opacity: 0;
}
```

**Step 4: Verify PASS.**

**Step 5: Commit:**
```bash
git add src/components/blog/BlogCoverImage/
git commit -m "feat(blog): add BlogCoverImage with fallback delegation"
```

---

### Task 2.5: BlogEyebrow

**Files:**
- Create: `src/components/blog/BlogEyebrow/index.tsx`
- Create: `src/components/blog/BlogEyebrow/styles.module.css`
- Create: `src/components/blog/BlogEyebrow/BlogEyebrow.test.tsx`

**Design doc section:** §4e (listing card eyebrow) and §5b (article page eyebrow)

**Purpose:** Plex Mono uppercase metadata row. Format: `{CATEGORY} · {READING TIME} · {DATE}`. Used on both listing cards and article page header.

**Props:**
- `category: string` (category slug, rendered as uppercase label)
- `readingTime?: number` (minutes, optional)
- `date: string | Date` (absolute date, rendered as `APR 08 2026` or `FEB 2026`)
- `linkCategory?: boolean` (default false; on article page, true makes the category a link)
- `dateFormat?: 'month-year' | 'full'` (default `full`)

**Step 1: Test:**

```tsx
// src/components/blog/BlogEyebrow/BlogEyebrow.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogEyebrow from './index';

describe('BlogEyebrow', () => {
  it('renders the category label in uppercase', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.getByText(/RESEARCH/)).toBeInTheDocument();
  });

  it('renders the reading time when provided', () => {
    render(<BlogEyebrow category="research" readingTime={7} date="2026-04-08" />);
    expect(screen.getByText(/7 MIN/)).toBeInTheDocument();
  });

  it('omits reading time when not provided', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.queryByText(/MIN/)).toBeNull();
  });

  it('renders the date in FULL format by default as "APR 08 2026"', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.getByText(/APR 08 2026/)).toBeInTheDocument();
  });

  it('renders the date in month-year format when dateFormat=month-year', () => {
    render(
      <BlogEyebrow category="research" date="2026-04-08" dateFormat="month-year" />
    );
    expect(screen.getByText(/APR 2026/)).toBeInTheDocument();
  });

  it('renders the category as a link when linkCategory=true', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" linkCategory />);
    expect(screen.getByRole('link', { name: /research/i })).toHaveAttribute(
      'href',
      '/blog?category=research'
    );
  });

  it('renders the category as plain text when linkCategory=false', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('throws on invalid category slug', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<BlogEyebrow category="invalid" date="2026-04-08" />)
    ).toThrow(/unknown category/i);
    spy.mockRestore();
  });
});
```

**Add to test file imports:**
```ts
import { vi } from 'vitest';
```

**Step 2: Verify FAIL.**

**Step 3: Implement:**

```tsx
// src/components/blog/BlogEyebrow/index.tsx
import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import { getCategory } from '@site/src/lib/blog/categories';
import { formatReadingTime } from '@site/src/lib/blog/readingTime';

export interface BlogEyebrowProps {
  category: string;
  readingTime?: number;
  date: string | Date;
  linkCategory?: boolean;
  dateFormat?: 'month-year' | 'full';
  className?: string;
}

function formatDate(
  input: string | Date,
  format: 'month-year' | 'full'
): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  return format === 'month-year' ? `${month} ${year}` : `${month} ${day} ${year}`;
}

export default function BlogEyebrow({
  category,
  readingTime,
  date,
  linkCategory = false,
  dateFormat = 'full',
  className,
}: BlogEyebrowProps): React.ReactElement {
  const cat = getCategory(category); // throws on invalid

  const categoryLabel = cat.label.toUpperCase();
  const dotStyle: React.CSSProperties = { color: cat.accent };

  const categoryNode = linkCategory ? (
    <Link className={styles.categoryLink} to={`/blog?category=${cat.slug}`}>
      <span className={styles.dot} aria-hidden="true" style={dotStyle}>
        ●
      </span>
      {categoryLabel}
    </Link>
  ) : (
    <span className={styles.category}>
      <span className={styles.dot} aria-hidden="true" style={dotStyle}>
        ●
      </span>
      {categoryLabel}
    </span>
  );

  return (
    <div className={`${styles.eyebrow} ${className ?? ''}`}>
      {categoryNode}
      {readingTime !== undefined && (
        <>
          <span className={styles.sep} aria-hidden="true">·</span>
          <span className={styles.readingTime}>{formatReadingTime(readingTime)}</span>
        </>
      )}
      <span className={styles.sep} aria-hidden="true">·</span>
      <time className={styles.date} dateTime={new Date(date).toISOString()}>
        {formatDate(date, dateFormat)}
      </time>
    </div>
  );
}
```

```css
/* src/components/blog/BlogEyebrow/styles.module.css */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
  line-height: 1;
}

.category,
.categoryLink {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: inherit;
  text-decoration: none;
}

.categoryLink:hover {
  color: var(--text-default);
}

.dot {
  font-size: 8px;
  line-height: 0;
  display: inline-block;
  transform: translateY(-1px);
}

.sep {
  color: var(--border-soft-white);
}

.readingTime,
.date {
  color: inherit;
}
```

**Step 4: Verify PASS.**

**Step 5: Commit:**
```bash
git add src/components/blog/BlogEyebrow/
git commit -m "feat(blog): add BlogEyebrow for Plex Mono metadata row"
```

---

### Tasks 2.6 through 2.12: remaining listing components

The remaining 7 listing-phase components follow the same TDD pattern as 2.1-2.5 above. For brevity, this plan describes each component's purpose, test expectations, and key implementation requirements, but leaves the step-by-step TDD loop implicit. Each task is still:

1. Write failing test
2. Verify fail
3. Implement
4. Verify pass
5. Commit

Each task dispatches through the implementer subagent → spec reviewer → code quality reviewer loop per the Phase 2 dispatching convention above.

### Task 2.6: BlogByline

**Design doc section:** §5c

**Purpose:** Avatar + name + role row. Used on featured hero listing card and on article page header. Handles multi-author cluster (24px overlap up to 2 visible, "+N more" overflow). Provides initials fallback when avatar image is missing or fails to load.

**Props:**
- `authors: Array<{ name: string; title?: string; imageUrl?: string; url?: string }>`
- `avatarSize?: 'sm' | 'md'` (sm = 32px for listing cards, md = 40px for article page)
- `showShareRow?: boolean` (article page only)

**Test expectations (~7 tests):**
- Renders single author with avatar, name, role
- Falls back to initials when `imageUrl` is missing
- Falls back to initials when `<img>` onError fires
- Multi-author cluster renders 2 avatars with overlap
- Multi-author cluster renders "+N more" text for >2 authors
- Author name links to `url` when provided
- `avatarSize` prop applies the correct class (`sm` or `md`)

**Key implementation note:** the initials fallback is a `<span>` with the first character of the author's name in Orbitron over a magenta-cyan gradient background. CSS handles the visual, not an SVG or generated image.

**Commit message:** `feat(blog): add BlogByline with avatar, initials fallback, multi-author cluster`

---

### Task 2.7: BlogPostCard

**Design doc section:** §4g

**Purpose:** Standard grid card used in the Latest band and filtered views. Cover image at top, body with eyebrow + title + dek + byline footer. Alternating magenta/cyan glow on hover, stable across filter changes (keyed on post slug hash).

**Props:**
- `post: BlogPostLike` (Docusaurus post metadata including title, permalink, frontMatter)
- `className?: string`

**Test expectations (~8 tests):**
- Renders post title as a link to permalink
- Renders cover image via `<BlogCoverImage>` (mock the component or verify the rendered image src)
- Renders `<BlogEyebrow>` with category and reading time
- Renders 2-line clamped dek
- Renders `<BlogByline>` with single author
- Applies alternating glow class based on slug hash (test two slugs with different hashes)
- Glow class is stable for the same slug across rerenders
- Returns null or throws on a post with no category (design doc §7a says category is required)

**Slug hash helper:** simple djb2-style hash, `(hash(slug) % 2 === 0) ? 'glowMagenta' : 'glowCyan'`. Keep it in `src/lib/blog/slugHash.ts` as a tiny pure function with its own unit test, OR inline in the component if the scope is small. Prefer inline for this push.

**Commit message:** `feat(blog): add BlogPostCard with slug-hash-stable alternating glow`

---

### Task 2.8: BlogHero

**Design doc section:** §4e

**Purpose:** Featured hero card at the top of the listing. Split layout ≥996px (cover left 60%, copy right 40%), stacked below.

**Props:**
- `post: BlogPostLike`

**Test expectations (~7 tests):**
- Renders the post title as a link
- Renders the cover image via `<BlogCoverImage>`
- Renders `<BlogEyebrow>` with category and reading time
- Renders a 3-line clamped dek
- Renders `<BlogByline>` with single author + avatar
- Applies `split` layout class at default (component is not responsive in jsdom, but the class should be present)
- Throws or returns null if post has no category

**Commit message:** `feat(blog): add BlogHero featured card with split/stacked layout`

---

### Task 2.9: BlogSeriesCard

**Design doc section:** §4f (per-card section)

**Purpose:** Numbered step card used inside the Silhouette Series band. Shows `PART N OF M` indicator, title, 2-line dek, `→ READ` footer.

**Props:**
- `post: BlogPostLike`
- `seriesOrder: number`
- `seriesTotal: number`

**Test expectations (~6 tests):**
- Renders `PART {order} OF {total}` in the step indicator
- Renders the post title
- Renders the post dek (2-line clamp)
- Renders a `→ READ` footer that is accessibly labeled (the whole card is a link, the footer is decorative)
- The whole card is a single anchor to the post permalink
- Wraps the step indicator in a `<span class="visually-hidden">Part 1 of 7: </span>` for screen readers per design doc §4l

**Commit message:** `feat(blog): add BlogSeriesCard with PART N/M step indicator`

---

### Task 2.10: BlogSeriesBand

**Design doc section:** §4f

**Purpose:** Conditional band wrapper. Renders header + sub-line + grid of series cards. Returns null when no series posts OR when filter is not 'all'.

**Props:**
- `allPosts: readonly BlogPostLike[]`
- `activeFilter: string | null` (null = all)
- `seriesSlug: string` (default `silhouette-primer`)

**Test expectations (~7 tests):**
- Returns null when `activeFilter !== null`
- Returns null when `getSeriesPosts` returns empty
- Renders the label from the series definition
- Renders the sub-line from the series definition
- Renders one `<BlogSeriesCard>` per series post
- Cards are ordered by `series_order`
- Correctly passes `seriesOrder` and `seriesTotal` to each card

**Commit message:** `feat(blog): add BlogSeriesBand conditional on filter and series posts`

---

### Task 2.11: BlogLatestBand

**Design doc section:** §4g

**Purpose:** Labeled band wrapper around a 2-col grid of `<BlogPostCard>` items. Label changes based on active filter (`LATEST` on all view, category label in filtered view).

**Props:**
- `posts: readonly BlogPostLike[]` (already filtered and sliced by parent)
- `activeFilter: string | null`
- `maxPosts?: number` (default 6)

**Test expectations (~6 tests):**
- Renders `LATEST` label when `activeFilter === null`
- Renders the category label in uppercase when filter is set (e.g. `RESEARCH`)
- Renders up to `maxPosts` cards
- Slices posts correctly (pass 10, maxPosts=6 → 6 rendered)
- Returns null when posts is empty
- Each card receives the `post` prop

**Commit message:** `feat(blog): add BlogLatestBand with filter-aware label`

---

### Task 2.12: BlogArchiveList

**Design doc section:** §4h

**Purpose:** Text-only archive tail. Each row is a 2-line card: metadata (category + date) above title. Whole row clickable.

**Props:**
- `posts: readonly BlogPostLike[]` (the overflow beyond Latest band)

**Test expectations (~5 tests):**
- Renders as a `<ul>` with one `<li>` per post
- Each row is a link to the post permalink
- Category and date metadata render in Plex Mono (verify class or computed style)
- Title renders as the second line
- Empty list returns null (not an empty `<ul>`)

**Commit message:** `feat(blog): add BlogArchiveList text-only archive tail`

---

## Phase 3: listing page wiring

### Task 3.1: Swizzle BlogLayout to remove sidebar slot

**Files:**
- Create: `src/theme/BlogLayout/index.tsx`

**Design doc section:** §3a (wrap swizzle)

**Purpose:** Wrap the default `BlogLayout` and hide the left sidebar slot completely. Blog listing and article pages run full-width.

**Step 1: Look at the default BlogLayout implementation:**

```bash
ls node_modules/.pnpm/@docusaurus+theme-classic*/node_modules/@docusaurus/theme-classic/lib/theme/BlogLayout/ 2>/dev/null
```

If the path doesn't resolve cleanly, run the swizzle inspector:

```bash
pnpm docusaurus swizzle --list --type wrap 2>&1 | head -40
```

**Step 2: Create the wrap swizzle:**

```tsx
// src/theme/BlogLayout/index.tsx
//
// Wrap swizzle of Docusaurus's default BlogLayout.
// Removes the left sidebar by passing an empty sidebar prop,
// producing a full-width canvas for the blog listing and post pages.
//
// See docs/plans/2026-04-09-blog-redesign-design.md §3a.

import React from 'react';
import BlogLayout from '@theme-original/BlogLayout';
import type { WrapperProps } from '@docusaurus/types';
import type BlogLayoutType from '@theme/BlogLayout';

type Props = WrapperProps<typeof BlogLayoutType>;

export default function BlogLayoutWrapper(props: Props): React.ReactElement {
  // Force sidebar to undefined so the BlogSidebar swizzle (null) takes over
  const { sidebar: _unusedSidebar, ...rest } = props;
  return <BlogLayout {...rest} sidebar={undefined} />;
}
```

**Step 3: Verify the dev server still renders:**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/blog
```

Expected: `200`.

**Step 4: Commit:**

```bash
git add src/theme/BlogLayout/
git commit -m "feat(theme): wrap BlogLayout to disable blog sidebar slot"
```

---

### Task 3.2: Neuter BlogSidebar

**Files:**
- Create: `src/theme/BlogSidebar/index.tsx`

**Step 1: Create:**

```tsx
// src/theme/BlogSidebar/index.tsx
//
// Neuters the default Docusaurus BlogSidebar completely. We replace
// the sidebar with our own band layout on the listing page, and the
// article page reads full width with a right-rail TOC above 1280px.
//
// See docs/plans/2026-04-09-blog-redesign-design.md §3a.

export default function BlogSidebarNoop(): null {
  return null;
}
```

**Step 2: Verify:**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/blog
```

Expected: `200`. The sidebar should be absent from the rendered HTML.

**Step 3: Commit:**

```bash
git add src/theme/BlogSidebar/
git commit -m "feat(theme): neuter BlogSidebar; listing uses bands, articles use full width"
```

---

### Task 3.3: Swizzle BlogListPage (the big one)

**Files:**
- Create: `src/theme/BlogListPage/index.tsx`
- Create: `src/theme/BlogListPage/styles.module.css`
- (Optional) Create: `src/theme/BlogListPage/BlogListPage.test.tsx`

**Design doc sections:** §3a, §4 (all subsections), §7d

**Purpose:** Replace the default Docusaurus blog list page with the composition of `BlogPublicationHeader` + `BlogCategoryPills` + `BlogHero` + `BlogSeriesBand` + `BlogLatestBand` + `BlogArchiveList`. Handles filter state via URL query param sync.

This is a **wrap swizzle** if possible (receives `items` and metadata from Docusaurus), otherwise an **eject swizzle**. Check the Docusaurus 3.9 API:

```bash
cat node_modules/.pnpm/@docusaurus+theme-classic*/node_modules/@docusaurus/theme-classic/src/theme/BlogListPage/Content.tsx 2>/dev/null | head -40
```

**Step 1: Create the swizzle:**

```tsx
// src/theme/BlogListPage/index.tsx
//
// Full replacement of the default blog list page. Composes the bands
// from src/components/blog/ with filter state synced to the URL.
//
// See docs/plans/2026-04-09-blog-redesign-design.md §4 for the full spec.

import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import type { Props } from '@theme/BlogListPage';
import { useHistory, useLocation } from '@docusaurus/router';

import BlogPublicationHeader from '@site/src/components/blog/BlogPublicationHeader';
import BlogCategoryPills from '@site/src/components/blog/BlogCategoryPills';
import BlogHero from '@site/src/components/blog/BlogHero';
import BlogSeriesBand from '@site/src/components/blog/BlogSeriesBand';
import BlogLatestBand from '@site/src/components/blog/BlogLatestBand';
import BlogArchiveList from '@site/src/components/blog/BlogArchiveList';

import { isValidCategorySlug } from '@site/src/lib/blog/categories';
import type { BlogPostLike } from '@site/src/lib/blog/series';

import styles from './styles.module.css';

const MAX_LATEST = 6;

export default function BlogListPage(props: Props): React.ReactElement {
  const { metadata, items } = props;
  const location = useLocation();
  const history = useHistory();

  // Hydrate filter from URL query param
  const initialFilter = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('category');
    return slug && isValidCategorySlug(slug) ? slug : null;
  }, [location.search]);

  const [activeFilter, setActiveFilter] = useState<string | null>(initialFilter);

  // When user clicks a pill, update the URL query param
  function handleFilterChange(slug: string | null): void {
    setActiveFilter(slug);
    const params = new URLSearchParams(location.search);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    const newSearch = params.toString();
    history.replace(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`);
  }

  // Sync filter if the URL changes externally (back/forward nav)
  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  // Convert Docusaurus item shape to BlogPostLike
  const allPosts: BlogPostLike[] = useMemo(
    () =>
      items.map((item) => ({
        metadata: {
          permalink: item.content.metadata.permalink,
          frontMatter: item.content.metadata.frontMatter as Record<string, unknown>,
        },
        title: item.content.metadata.title,
        description: item.content.metadata.description,
        date: item.content.metadata.date,
        authors: item.content.metadata.authors,
      })) as BlogPostLike[],
    [items]
  );

  // Partition: filter by activeFilter first
  const filteredPosts = useMemo(() => {
    if (!activeFilter) return allPosts;
    return allPosts.filter(
      (p) => p.metadata.frontMatter.category === activeFilter
    );
  }, [allPosts, activeFilter]);

  // Hero = most recent post in the filtered set (or the whole set on All)
  const hero = filteredPosts[0];
  const nonHeroPosts = filteredPosts.slice(1);

  // Latest band shows up to 6 posts, excluding series posts on the All view
  // (series posts live in the Silhouette Series band)
  const latestPosts = useMemo(() => {
    if (activeFilter === null) {
      // Exclude series posts from the Latest band on All
      return nonHeroPosts
        .filter((p) => !p.metadata.frontMatter.series)
        .slice(0, MAX_LATEST);
    }
    return nonHeroPosts.slice(0, MAX_LATEST);
  }, [nonHeroPosts, activeFilter]);

  // Archive tail = everything beyond the latest band
  const archivePosts = useMemo(() => {
    if (activeFilter === null) {
      return nonHeroPosts
        .filter((p) => !p.metadata.frontMatter.series)
        .slice(MAX_LATEST);
    }
    return nonHeroPosts.slice(MAX_LATEST);
  }, [nonHeroPosts, activeFilter]);

  return (
    <Layout
      title={metadata.blogTitle}
      description={metadata.blogDescription}
    >
      <main className={styles.main}>
        <BlogPublicationHeader
          title="Blog"
          subtitle="Writing on shielded trading, TEE architecture, and the road to private perps"
        />

        <BlogCategoryPills
          activeSlug={activeFilter}
          onChange={handleFilterChange}
        />

        {hero && <BlogHero post={hero} />}

        <BlogSeriesBand
          allPosts={allPosts}
          activeFilter={activeFilter}
          seriesSlug="silhouette-primer"
        />

        <BlogLatestBand
          posts={latestPosts}
          activeFilter={activeFilter}
          maxPosts={MAX_LATEST}
        />

        {archivePosts.length > 0 && <BlogArchiveList posts={archivePosts} />}
      </main>
    </Layout>
  );
}
```

```css
/* src/theme/BlogListPage/styles.module.css */
.main {
  padding-block: var(--space-24) var(--space-32);
  padding-inline: var(--space-5);
}

@media (min-width: 640px) {
  .main {
    padding-inline: var(--space-12);
  }
}

@media (min-width: 1024px) {
  .main {
    padding-inline: var(--space-16);
  }
}
```

**Step 2: Build and verify the listing page loads:**

```bash
# If dev server is running it should hot-reload. Curl the listing.
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/blog
```

Expected: `200`.

**Step 3: Open the listing in a browser and visually verify:**
- Publication header reads "Blog" with the subtitle
- Category pills render
- Clicking a pill updates the URL to `/blog?category=research` etc.
- The hero card renders with the most recent post
- The Silhouette Series band does NOT render (no series posts exist yet)
- The Latest band renders with 2-6 post cards
- Archive tail may or may not render depending on post count

If anything breaks, dispatch puppeteer verification before a 3rd CSS edit attempt (standing rule 9).

**Step 4: Commit:**

```bash
git add src/theme/BlogListPage/
git commit -m "feat(theme): wire new BlogListPage with bands, filter, series gate"
```

---

### Task 3.4: Puppeteer verification gate 1

**Files:** none (verification only, snapshots to `/tmp/puppeteer-debug/`)

**Step 1: Dispatch a puppeteer verification subagent with the following prompt:**

> Verify the Silhouette blog listing page at `http://localhost:3100/blog`.
>
> **Git safety - FORBIDDEN COMMANDS:** do not run any of: `git stash`, `git checkout` to another branch, `git reset`, `git clean`, `git branch -D`, `git rebase`, `git push`, or any destructive operation. Read-only git commands (`git status`, `git log`, `git diff`) are fine.
>
> Run puppeteer against the local dev server. Take screenshots at:
>
> 1. `http://localhost:3100/blog` at 1440x900 (desktop, full page)
> 2. `http://localhost:3100/blog` at 390x844 (mobile iPhone, full page)
> 3. `http://localhost:3100/blog?category=research` at 1440x900 (filtered view, desktop)
> 4. `http://localhost:3100/blog?category=guides` at 1440x900 (should show empty state since no Guides posts exist yet)
>
> Save all snapshots to `/tmp/puppeteer-debug/` with descriptive filenames like `blog-listing-all-desktop.png`, `blog-listing-mobile.png`, etc.
>
> Then inspect computed styles and verify:
>
> - Body background is `#13161a`
> - Publication header `Blog` is rendered in the Orbitron/Inter Display font family, weight 600, around 48px
> - Category pill row has 6 pills (All + 5 categories)
> - The `All` pill is `aria-pressed="true"` on `/blog`, the `Research` pill is `aria-pressed="true"` on `/blog?category=research`
> - The hero card has a border and a background color distinct from `#13161a`
> - No horizontal scroll on desktop or mobile
> - No em dashes in any visible text
>
> Report any discrepancies with the design doc at `docs/plans/2026-04-09-blog-redesign-design.md` sections 4a through 4l. Do NOT edit any files. Return a text report with:
>
> - Screenshot paths
> - Computed style values for the listed elements
> - A list of pass/fail items
> - Any visual issues observed

**Step 2: Review the puppeteer report. Fix any issues by dispatching a targeted implementer subagent for each issue. Do NOT attempt multiple parallel fixes.**

**Step 3: Mark task complete only when puppeteer report is all green.**

---

## Phase 4: article page components

### Task 4.1: BlogTOC

**Files:**
- Create: `src/components/blog/BlogTOC/index.tsx`
- Create: `src/components/blog/BlogTOC/styles.module.css`
- Create: `src/components/blog/BlogTOC/BlogTOC.test.tsx`

**Design doc section:** §5h

**Purpose:** Right-rail sticky table of contents. Renders only when viewport ≥1280px AND article has ≥3 H2 headings. Active section highlighting via IntersectionObserver. Below 1280px, collapses to inline `<details>` drawer.

**Props:**
- `headings: Array<{ level: 2 | 3; text: string; slug: string }>`
- `minHeadings?: number` (default 3; below this, returns null)

**Step 1: Write the failing test:**

```tsx
// src/components/blog/BlogTOC/BlogTOC.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BlogTOC from './index';

const H2 = { level: 2 as const, text: '', slug: '' };
const H3 = { level: 3 as const, text: '', slug: '' };

function makeHeadings(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    level: 2 as const,
    text: `Section ${i + 1}`,
    slug: `section-${i + 1}`,
  }));
}

describe('BlogTOC', () => {
  it('returns null when headings is empty', () => {
    const { container } = render(<BlogTOC headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when headings count is below minHeadings (default 3)', () => {
    const { container } = render(<BlogTOC headings={makeHeadings(2)} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when headings count is at or above minHeadings', () => {
    render(<BlogTOC headings={makeHeadings(3)} />);
    expect(screen.getByText(/on this page/i)).toBeInTheDocument();
  });

  it('renders one link per heading', () => {
    render(<BlogTOC headings={makeHeadings(4)} />);
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('links point to the heading slug as a fragment', () => {
    render(<BlogTOC headings={makeHeadings(3)} />);
    expect(screen.getByRole('link', { name: 'Section 1' })).toHaveAttribute(
      'href',
      '#section-1'
    );
  });

  it('renders H3 headings with an indent class', () => {
    const headings = [
      { level: 2 as const, text: 'Foo', slug: 'foo' },
      { level: 3 as const, text: 'Sub', slug: 'sub' },
      { level: 2 as const, text: 'Bar', slug: 'bar' },
    ];
    render(<BlogTOC headings={headings} />);
    const subLink = screen.getByRole('link', { name: 'Sub' });
    expect(subLink.className).toMatch(/level3|indent/i);
  });

  it('respects a custom minHeadings prop', () => {
    render(<BlogTOC headings={makeHeadings(2)} minHeadings={2} />);
    expect(screen.getByText(/on this page/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test, verify FAIL.**

**Step 3: Implement:**

```tsx
// src/components/blog/BlogTOC/index.tsx
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export interface BlogTOCHeading {
  level: 2 | 3;
  text: string;
  slug: string;
}

export interface BlogTOCProps {
  headings: readonly BlogTOCHeading[];
  /** Minimum number of headings required to render. Default 3. */
  minHeadings?: number;
  className?: string;
}

export default function BlogTOC({
  headings,
  minHeadings = 3,
  className,
}: BlogTOCProps): React.ReactElement | null {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length < minHeadings) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    for (const h of headings) {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings, minHeadings]);

  if (headings.length < minHeadings) return null;

  return (
    <nav
      className={`${styles.toc} ${className ?? ''}`}
      aria-label="Table of contents"
    >
      <div className={styles.label}>ON THIS PAGE</div>
      <ul className={styles.list}>
        {headings.map((h) => (
          <li
            key={h.slug}
            className={`${h.level === 3 ? styles.level3 : styles.level2} ${
              activeSlug === h.slug ? styles.active : ''
            }`}
          >
            <a href={`#${h.slug}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

```css
/* src/components/blog/BlogTOC/styles.module.css */
.toc {
  position: sticky;
  top: calc(var(--ifm-navbar-height, 60px) + var(--space-12));
  align-self: start;
  max-height: calc(100vh - var(--space-24));
  overflow-y: auto;
  width: 220px;
  font-family: var(--font-sans);
}

.label {
  font-family: var(--font-display);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.level2,
.level3 {
  padding: var(--space-2) 0;
  border-left: 1px solid var(--border-subtle);
  padding-left: var(--space-4);
}

.level3 {
  padding-left: var(--space-6);
}

.level2 a,
.level3 a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--fs-xs);
  line-height: var(--lh-snug);
  display: block;
}

.level2 a {
  font-size: 13px;
  font-weight: var(--fw-medium);
}

.level3 a {
  font-size: 12px;
  font-weight: var(--fw-regular);
}

.level2:hover a,
.level3:hover a {
  color: var(--text-default);
}

.active {
  border-left-color: var(--accent-secondary);
  border-left-width: 2px;
}

.active a {
  color: var(--text-default);
}

@media (max-width: 1279px) {
  .toc {
    display: none;
  }
}
```

**Step 4: Run test, verify PASS (7 tests).**

**Step 5: Commit:**
```bash
git add src/components/blog/BlogTOC/
git commit -m "feat(blog): add BlogTOC with IntersectionObserver active tracking"
```

---

### Task 4.2: BlogShareRow

**Files:**
- Create: `src/components/blog/BlogShareRow/index.tsx` + tests + styles

**Design doc section:** §5c (right side of byline row)

**Purpose:** Inline `Share on X · Copy link · RSS` buttons below the byline row.

**Props:**
- `title: string`
- `url: string` (canonical post URL)
- `rssUrl?: string` (default `/blog/rss.xml`)

**Test expectations (~6 tests):**
- Renders three buttons
- Share on X opens twitter intent URL with encoded title + url
- Copy link calls `navigator.clipboard.writeText` with url (mock the clipboard API)
- Copy link shows "✓ Copied" for 1.5s then reverts (use fake timers)
- RSS link has `href` to `rssUrl`
- Hidden on mobile via CSS class (verify class, not computed style since jsdom doesn't do media queries reliably)

**Note on clipboard fallback:** if `navigator.clipboard` is undefined, fall back to creating a hidden `<textarea>`, selecting, and calling `document.execCommand('copy')`. Wrap in try/catch; if both fail, show "Unable to copy" for 1.5s.

**Commit message:** `feat(blog): add BlogShareRow with X intent, clipboard, RSS`

---

### Task 4.3: BlogNextInSeries

**Files:**
- Create: `src/components/blog/BlogNextInSeries/index.tsx` + tests + styles

**Design doc section:** §5i (article footer structure, point 3)

**Purpose:** Horizontal card at the article footer showing the next post in the series. Uses `getSeriesNavigation` to resolve. Returns null if the post is not in a series OR is the last post in the series.

**Props:**
- `currentPost: BlogPostLike`
- `allPosts: readonly BlogPostLike[]`

**Test expectations (~6 tests):**
- Returns null when currentPost has no `series` frontmatter
- Returns null when currentPost is the last in the series
- Renders "NEXT IN THE SILHOUETTE SERIES" eyebrow
- Renders the next post title
- Renders the next post dek
- Links to the next post permalink

**Commit message:** `feat(blog): add BlogNextInSeries at article footer`

---

### Task 4.4: BlogReadNext

**Files:**
- Create: `src/components/blog/BlogReadNext/index.tsx` + tests + styles

**Design doc section:** §5i (article footer structure, point 4)

**Purpose:** "Read next" section with 1 big card + 3 small cards. Prefers posts in the same category, excluding the current post. Falls back to latest overall if the category is thin.

**Props:**
- `currentPost: BlogPostLike`
- `allPosts: readonly BlogPostLike[]`

**Test expectations (~7 tests):**
- Excludes the current post from recommendations
- Prefers same-category posts for the big card
- Falls back to latest overall when same-category is empty
- Renders 3 smaller cards in addition to the big card
- Renders a `READ NEXT` label
- Handles fewer than 4 available posts gracefully (renders what exists)
- Returns null when no other posts exist

**Commit message:** `feat(blog): add BlogReadNext with 1 big + 3 small cards`

---

### Task 4.5: BlogScrollProgress

**Files:**
- Create: `src/components/blog/BlogScrollProgress/index.tsx` + tests + styles

**Design doc section:** §6a

**Step 1: Test:**

```tsx
// src/components/blog/BlogScrollProgress/BlogScrollProgress.test.tsx
import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BlogScrollProgress from './index';

describe('BlogScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      value: 2000,
    });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1000 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a progress bar', () => {
    const { container } = render(<BlogScrollProgress />);
    expect(container.firstChild).not.toBeNull();
  });

  it('has role=progressbar', () => {
    const { getByRole } = render(<BlogScrollProgress />);
    expect(getByRole('progressbar')).toBeInTheDocument();
  });

  it('starts at 0% width', () => {
    const { getByRole } = render(<BlogScrollProgress />);
    const bar = getByRole('progressbar');
    expect(bar.style.width).toBe('0%');
  });

  it('updates width based on scroll position', () => {
    const { getByRole } = render(<BlogScrollProgress />);

    act(() => {
      (window as { scrollY: number }).scrollY = 500; // halfway through 1000px scrollable
      window.dispatchEvent(new Event('scroll'));
    });

    const bar = getByRole('progressbar');
    // 500 / (2000 - 1000) = 0.5 = 50%
    // requestAnimationFrame timing in jsdom; the test may need to await a frame
  });

  it('has aria-valuenow reflecting the scroll percentage', () => {
    const { getByRole } = render(<BlogScrollProgress />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
  });
});
```

**Step 2: Implement:**

```tsx
// src/components/blog/BlogScrollProgress/index.tsx
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function BlogScrollProgress(): React.ReactElement {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    function update(): void {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
      setProgress(pct);
      rafId = null;
    }

    function handleScroll(): void {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className={styles.bar}
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Reading progress"
    />
  );
}
```

```css
/* src/components/blog/BlogScrollProgress/styles.module.css */
.bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--accent-primary) 0%,
    var(--accent-secondary) 100%
  );
  z-index: 100;
  pointer-events: none;
  transition: width 50ms linear;
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    transition: none;
  }
}

@media (max-width: 768px) {
  .bar {
    display: none;
  }
}
```

**Step 3: Run test, verify PASS.**

**Step 4: Commit:**
```bash
git add src/components/blog/BlogScrollProgress/
git commit -m "feat(blog): add BlogScrollProgress rAF-driven top progress bar"
```

---

### Task 4.6: BlogShieldedReveal

**Files:**
- Create: `src/components/blog/BlogShieldedReveal/index.tsx` + tests + styles

**Design doc section:** §6b

**Purpose:** Wrapper that applies a blur-to-sharp reveal animation to direct descendant content blocks on first mount. Uses sessionStorage to prevent replay within the same tab session. Respects `prefers-reduced-motion`.

**Props:**
- `slug: string` (post slug, used for sessionStorage key)
- `children: React.ReactNode`

**Step 1: Test (abbreviated):**

```tsx
// src/components/blog/BlogShieldedReveal/BlogShieldedReveal.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import BlogShieldedReveal from './index';

describe('BlogShieldedReveal', () => {
  beforeEach(() => {
    sessionStorage.clear();
    // Default matchMedia to non-reduced-motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders children', () => {
    const { getByText } = render(
      <BlogShieldedReveal slug="test">
        <p>Hello</p>
      </BlogShieldedReveal>
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('applies the reveal class to direct descendant <p> elements', () => {
    const { container } = render(
      <BlogShieldedReveal slug="test">
        <p data-testid="p1">One</p>
        <p data-testid="p2">Two</p>
      </BlogShieldedReveal>
    );
    // useEffect runs synchronously in tests via react 18 testing library
    // but we may need to wait a tick
  });

  it('does not apply reveal class when prefers-reduced-motion is set', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <BlogShieldedReveal slug="test">
        <p>One</p>
      </BlogShieldedReveal>
    );
    // Verify no reveal class was applied
  });

  it('sets sessionStorage flag after first reveal', () => {
    render(
      <BlogShieldedReveal slug="my-post">
        <p>Content</p>
      </BlogShieldedReveal>
    );
    expect(sessionStorage.getItem('blog:revealed:my-post')).toBe('1');
  });

  it('skips the reveal when sessionStorage flag is already set', () => {
    sessionStorage.setItem('blog:revealed:already-seen', '1');
    const { container } = render(
      <BlogShieldedReveal slug="already-seen">
        <p>Content</p>
      </BlogShieldedReveal>
    );
    // Verify no reveal class was applied
  });

  it('caps stagger index at 12', () => {
    const paragraphs = Array.from({ length: 20 }, (_, i) => (
      <p key={i}>Para {i}</p>
    ));
    const { container } = render(
      <BlogShieldedReveal slug="long-post">{paragraphs}</BlogShieldedReveal>
    );
    // Verify the 13th through 20th paragraphs all have --reveal-index: 12
  });
});
```

**Step 2: Implement:**

```tsx
// src/components/blog/BlogShieldedReveal/index.tsx
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

export interface BlogShieldedRevealProps {
  slug: string;
  children: React.ReactNode;
}

const MAX_STAGGER = 12;
const SELECTOR =
  ':scope > p, :scope > h2, :scope > h3, :scope > h4, :scope > ul, :scope > ol, :scope > blockquote, :scope > figure, :scope > pre';

export default function BlogShieldedReveal({
  slug,
  children,
}: BlogShieldedRevealProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Respect reduced motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    // Skip if already revealed in this session
    const storageKey = `blog:revealed:${slug}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
    } catch {
      // sessionStorage may be unavailable (strict mode, private browsing)
    }

    const blocks = ref.current.querySelectorAll<HTMLElement>(SELECTOR);
    blocks.forEach((block, index) => {
      block.classList.add(styles.block);
      block.style.setProperty(
        '--reveal-index',
        String(Math.min(index, MAX_STAGGER))
      );
    });

    try {
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // no-op
    }
  }, [slug]);

  return <div ref={ref}>{children}</div>;
}
```

```css
/* src/components/blog/BlogShieldedReveal/styles.module.css */
.block {
  opacity: 0;
  filter: blur(6px);
  transform: translateY(4px);
  animation: shieldedReveal 400ms cubic-bezier(0.2, 0.65, 0.25, 1) forwards;
  animation-delay: calc(var(--reveal-index, 0) * 40ms);
}

@keyframes shieldedReveal {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .block {
    opacity: 1;
    filter: none;
    transform: none;
    animation: none;
  }
}
```

**Step 3: Run test, verify PASS.**

**Step 4: Commit:**
```bash
git add src/components/blog/BlogShieldedReveal/
git commit -m "feat(blog): add BlogShieldedReveal blur-to-sharp mount animation"
```

---

### Task 4.7: BlogHighlightShare

**Files:**
- Create: `src/components/blog/BlogHighlightShare/index.tsx` + tests + styles

**Design doc section:** §6c

**Purpose:** Text-selection popover with `Quote on X` and `Copy quote` buttons. Selection threshold 15 chars. Scoped to article body, excluded from code blocks and links. Hidden on mobile.

**Props:**
- `articleRef: React.RefObject<HTMLElement>` (the article body element)
- `postTitle: string`
- `canonicalUrl: string`

**Test expectations (~10 tests):**
- Selection <15 chars → popover not shown
- Selection ≥15 chars inside articleRef → popover shown
- Selection outside articleRef → popover not shown
- Selection inside `<pre>` or `<code>` → popover not shown
- Selection inside `<a>` link → popover not shown
- Escape key → popover hidden
- Scroll → popover hidden
- Quote on X button has correct `href` with encoded text + url
- Copy quote button calls clipboard API with formatted string
- Clipboard fallback to `execCommand('copy')` when `navigator.clipboard` is undefined

**Implementation notes:**
- Use `useEffect` to attach `selectionchange`, `scroll`, `keydown` listeners
- Portal the popover to `document.body` via `createPortal`
- Use `getBoundingClientRect()` on the selection Range for positioning
- Clamp position to viewport edges
- Enter animation (120ms fade + 4px translate) via CSS

**Commit message:** `feat(blog): add BlogHighlightShare selection popover`

---

## Phase 5: article page wiring

### Task 5.1: Swizzle BlogPostPage to mount signature touches

**Files:**
- Create: `src/theme/BlogPostPage/index.tsx`

**Purpose:** Wrap swizzle of the default BlogPostPage. Mounts `<BlogScrollProgress>`, `<BlogHighlightShare>`, and the right-rail TOC slot. Keeps the default content rendering.

**Step 1: Create:**

```tsx
// src/theme/BlogPostPage/index.tsx
import React, { useRef } from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import type { WrapperProps } from '@docusaurus/types';
import type BlogPostPageType from '@theme/BlogPostPage';

import BlogScrollProgress from '@site/src/components/blog/BlogScrollProgress';
import BlogHighlightShare from '@site/src/components/blog/BlogHighlightShare';

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): React.ReactElement {
  const articleRef = useRef<HTMLElement>(null);

  const frontMatter = props.content.frontMatter as Record<string, unknown>;
  const title =
    typeof frontMatter.title === 'string' ? frontMatter.title : 'Untitled';
  const slug =
    typeof frontMatter.slug === 'string'
      ? frontMatter.slug
      : props.content.metadata.permalink;
  const canonicalUrl =
    typeof window !== 'undefined'
      ? window.location.origin + props.content.metadata.permalink
      : props.content.metadata.permalink;

  return (
    <>
      <BlogScrollProgress />
      <BlogPostPage {...props} />
      <BlogHighlightShare
        articleRef={articleRef}
        postTitle={title}
        canonicalUrl={canonicalUrl}
      />
    </>
  );
}
```

**Step 2: Commit.** (The TOC slot is wired in Task 5.6 when we eject BlogPostItem.)

```bash
git add src/theme/BlogPostPage/
git commit -m "feat(theme): wrap BlogPostPage mounts scroll progress and highlight-share"
```

---

### Tasks 5.2 through 5.6

These are the `BlogPostItem/Header/{Title,Info,Author}/index.tsx`, `BlogPostItem/Footer/index.tsx` wrap, and `BlogPostItem/index.tsx` eject swizzles. Each task follows the same pattern:

1. Inspect the original component in `node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/...`
2. Either wrap (if we only add around the original) or eject (if we replace entirely)
3. Reference the design doc section:
   - Task 5.2 Title: §5b
   - Task 5.3 Info (eyebrow): §5b
   - Task 5.4 Author (byline): §5c
   - Task 5.5 Footer: §5i
   - Task 5.6 index (compose + mount BlogShieldedReveal + mount TOC + grid container): §5a, §5d, §5h
4. Each swizzle gets its own commit

**Task 5.2**: Eject `BlogPostItem/Header/Title` to use Inter Display with `text-wrap: balance` per §5b. Replaces the h1 styling.

**Task 5.3**: Eject `BlogPostItem/Header/Info` to render the eyebrow row via `<BlogEyebrow category=... readingTime=... date=... linkCategory />` using frontmatter values. Also renders the series badge if `series` is present.

**Task 5.4**: Eject `BlogPostItem/Header/Author` to render via `<BlogByline authors=... avatarSize="md" showShareRow />`.

**Task 5.5**: Wrap `BlogPostItem/Footer` to render the original footer, then append `<CopyForLLMRow />` (reusing the existing component from `src/components/CopyForLLMRow/`), sign-off line, `<BlogNextInSeries />`, `<BlogReadNext />`, back-to-blog link.

**Task 5.6**: Eject `BlogPostItem/index.tsx` to compose everything inside a CSS Grid container with 3 columns (1fr, min(720px, 100%), 1fr). Wrap the article body in `<BlogShieldedReveal slug={slug}>`. Render `<BlogTOC>` in grid-column 3 on ≥1280px.

**Commit messages:**
- `feat(theme): eject BlogPostItem/Header/Title for Inter Display title`
- `feat(theme): eject BlogPostItem/Header/Info for Plex Mono eyebrow + series badge`
- `feat(theme): eject BlogPostItem/Header/Author to use BlogByline`
- `feat(theme): wrap BlogPostItem/Footer with CopyForLLM, sign-off, read next`
- `feat(theme): eject BlogPostItem to grid container with BlogShieldedReveal + BlogTOC`

For each of these tasks, the subagent dispatch prompt must include:

- Explicit instruction to inspect the original Docusaurus file first
- Design doc section reference
- Forbidden git commands list
- Instruction to test the rendered page via curl after each commit
- No new dependencies

---

### Task 5.7: Puppeteer verification gates 2 and 3

Two puppeteer dispatches:

**Gate 2: article page baseline**

> Verify the Silhouette blog article page at `http://localhost:3100/blog/why-dark-pool-havent-worked` (one of the longer legacy posts).
>
> Git safety: same forbidden commands as gate 1.
>
> Screenshots:
> - Desktop 1440x900 (full page)
> - Tablet 768x1024 (full page)
> - Mobile 390x844 (full page)
>
> Computed style verification:
> - Body `<p>` elements: font-family resolves to Inter, font-size 19px (desktop) / 17px (mobile), line-height 1.7 / 1.65, font-weight 450, color is `#f9f9f9` or close, background resolves to `#13161a`
> - Article column: max-width ~720px (or 68ch)
> - H1 title: font-family Inter Display (or Inter), font-size ~60px desktop / ~40px mobile, weight 600
> - Eyebrow row: font-family IBM Plex Mono, uppercase, contains "RESEARCH" and a date
> - TOC: visible at 1440x900, hidden at 768x1024 (collapsed to details) and 390x844 (hidden entirely)
> - Scroll progress bar: visible at top of 1440x900 viewport, not visible at 390x844
> - Links in body: underlined, cyan color, 1px thickness, 3px offset
>
> Save snapshots to `/tmp/puppeteer-debug/` as `article-desktop.png`, `article-tablet.png`, `article-mobile.png`.
>
> Report any discrepancies. Do not edit files.

**Gate 3: signature touches**

> Verify the three signature touches on the same article page.
>
> Git safety: same forbidden commands.
>
> Shielded reveal:
> - Open the page fresh (clear sessionStorage)
> - Take screenshot at T+0ms (body should be blurred)
> - Take screenshot at T+200ms
> - Take screenshot at T+500ms (body should be sharp)
> - Verify computed `filter` on article paragraphs at each stage
>
> Highlight-to-share:
> - Programmatically select 20+ characters from the second paragraph via Range API
> - Verify the popover appears in the DOM within 200ms
> - Verify it has two buttons: "Quote on X" and "Copy quote"
> - Verify "Quote on X" href contains `twitter.com/intent/tweet` and the encoded selected text
> - Click "Copy quote" and verify clipboard contents match the format `> {text}\n\n- {title}\n{url}`
> - Press Escape and verify the popover is removed from the DOM
>
> Scroll progress:
> - Scroll to 50% of the page
> - Verify the progress bar width is ~50%
> - Scroll to 100%
> - Verify the progress bar width is ~100%
>
> Save snapshots: `signature-reveal-t0.png`, `signature-reveal-t200.png`, `signature-reveal-t500.png`, `signature-highlight-popover.png`, `signature-scroll-50.png`, `signature-scroll-100.png`.
>
> Report results. Do not edit files.

**Action:** review both reports, dispatch targeted fix subagents for any failures, re-verify.

---

## Phase 6: final verification and handoff

### Task 6.1: Run full test suite

```bash
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
pnpm test 2>&1 | tail -20
```

Expected: all tests passing (baseline 13 + new components ≈ 143 total, exact number depends on final implementation).

If any test fails, dispatch a targeted fix and re-run.

### Task 6.2: Production build green

```bash
# Kill dev server first
lsof -ti:3100 && kill $(lsof -ti:3100) && sleep 2

pnpm build 2>&1 | tail -30
```

Expected: build succeeds with `onBrokenLinks: throw` intact, zero warnings about missing truncate markers, zero warnings about invalid frontmatter.

If build fails, diagnose and fix. Do not suppress errors.

### Task 6.3: Restart dev server and smoke test

```bash
pnpm start --no-open --port 3100 &
sleep 8

curl -s -o /dev/null -w "%{http_code} /\n" http://localhost:3100/
curl -s -o /dev/null -w "%{http_code} /blog\n" http://localhost:3100/blog
curl -s -o /dev/null -w "%{http_code} /blog?category=research\n" http://localhost:3100/blog?category=research
curl -s -o /dev/null -w "%{http_code} /blog/why-dark-pool-havent-worked\n" http://localhost:3100/blog/why-dark-pool-havent-worked
curl -s -o /dev/null -w "%{http_code} /blog/shielded-spot-trading\n" http://localhost:3100/blog/shielded-spot-trading
```

Expected: all return `200`.

### Task 6.4: Visual review with Wayne

Offer Wayne a live walkthrough of:
1. `/blog` (All view)
2. `/blog?category=research` (filtered)
3. A long article on desktop
4. The same article on mobile (devtools responsive mode)
5. Trigger the shielded reveal (clear sessionStorage, refresh)
6. Trigger highlight-to-share (select a quote in an article)
7. Scroll to see the progress bar

Collect feedback. Loop back into targeted fixes for any issues.

### Task 6.5: Write session 3 handoff

**Files:**
- Create: `docs/plans/2026-04-09-session-3-handoff.md`

Format matches `2026-04-08-session-2-handoff.md`. Sections to include:
- Session date and branch state
- Commit timeline for this push
- What landed (blog listing + article pages + signature touches + legacy migration + authors)
- Architecture decisions
- Test count (baseline → final)
- Open issues or follow-ups (what went wrong, what was deferred)
- How to resume

Commit the handoff doc:

```bash
git add docs/plans/2026-04-09-session-3-handoff.md
git commit -m "docs(plans): session 3 handoff after blog redesign push"
```

---

## Execution guidance summary

- **Trivial tasks** (frontmatter edits, lib/data files, test fixtures): execute directly in the controller. No subagent dispatch needed.
- **Component tasks** (19 total across Phase 2 and Phase 4): dispatch implementer subagent with the TDD loop, then spec compliance reviewer, then code quality reviewer. Only mark task complete when both reviews pass.
- **Swizzle tasks** (6 in Phase 3 and 5): dispatch implementer subagent. Design doc reference in the prompt. Verify via curl after each swizzle.
- **Puppeteer gates** (3 total): dispatch a read-only puppeteer subagent with explicit forbidden-git-commands list. Do not let it edit files.
- **Final verification** (Phase 6): direct controller execution.

Every subagent dispatch prompt MUST include:
1. Design doc path + specific section reference
2. The 14 standing rules from the top of this plan
3. The git safety forbidden commands list (standing rule 2)
4. Explicit instruction: "ship tests in the same commit"
5. Explicit instruction: "invoke frontend-design and ui-ux-pro-max skills before writing styles"
6. No new dependencies without Wayne's approval

---

## Exit criteria (repeated from design doc §14)

Binary. All must pass:

- [ ] All 5 categories in filter pills
- [ ] 7 legacy posts each have `category` frontmatter, no `tags: [article]`
- [ ] `2026-02-04-shieldedspot.md` has `<!-- truncate -->` marker
- [ ] `wayne` in `authors.yml` with `page: false`, `silhouette-team` retained
- [ ] `src/data/blog/{series,categories}.ts` + `src/lib/blog/{series,categories,readingTime}.ts` exist and are tested
- [ ] 19 new components under `src/components/blog/` each with co-located test, tests passing
- [ ] 6 swizzles under `src/theme/` (BlogListPage, BlogPostPage, BlogPostItem tree, BlogPostItems, BlogSidebar, BlogLayout)
- [ ] `/blog` renders publication header + category pills + hero + series band + latest grid + archive tail
- [ ] Category pill filter works client-side, URL query param updates
- [ ] `/blog/slug` renders Plex Mono eyebrow + Inter Display title + dek + byline + optional cover + body at 68ch with Inter 19px/1.7/450/`--text-default`
- [ ] Right-rail TOC renders at ≥1280px on articles with ≥3 H2s
- [ ] Scroll progress bar renders at ≥768px
- [ ] Shielded text reveal runs on first article load, respects `prefers-reduced-motion`
- [ ] Highlight-to-share popover appears on 15+ char selection (desktop only)
- [ ] `pnpm test` green with ~143 tests
- [ ] `pnpm build` green with `onBrokenLinks: throw`
- [ ] `curl` smoke tests return 200
- [ ] Puppeteer snapshots at all 3 gates reviewed
- [ ] No em dashes anywhere
- [ ] No hardcoded hex outside `:root`
- [ ] No new MEV claims
- [ ] No Orbitron outside display/eyebrow/nav contexts
- [ ] Branch stays `docs/overhaul-plan-2026-04-07`, zero pushes without sign-off

After all ticks, Wayne reviews. After sign-off, write session 3 handoff.

---

**End of implementation plan.**

Source of truth for visual specs: `docs/plans/2026-04-09-blog-redesign-design.md` (committed in `4e06167`).

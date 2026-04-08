# Blog Redesign Design Doc

**Date:** 2026-04-09
**Author:** Wayne (+ Claude brainstorming pass with two parallel deep-research subagents)
**Status:** Approved, proceed to implementation plan
**Target repo:** `silhouette-exchange/public-docs` (Docusaurus 3.9.2)
**Branch:** `docs/overhaul-plan-2026-04-07` (DO NOT switch, DO NOT push without explicit sign-off)
**Supersedes:** §9 (Blog CMS / Notion pipeline) + Phase 3 of `2026-04-07-silhouette-docs-overhaul-design.md`

---

## 0. How to read this doc

This design doc captures the blog redesign push after Phase 2 Group A foundation shipped (Scalar API explorer + vitest infrastructure + EndpointCard component) and the API content tasks were paused pending API team review. The scope here is the blog only. The API work resumes in a later session when Wayne's API-team colleague has reviewed the foundation.

This doc is the decision record. It covers:

- The scope decision (redesign only, Notion CMS dropped)
- Research synthesis from two parallel deep-research subagents
- Architecture and file layout
- Listing page visual and interaction design
- Article reading page visual and typographic design
- Three signature touches (shielded text reveal, highlight-to-share, scroll progress bar)
- Series system (frontmatter schema, definitions, resolution)
- Legacy content migration plan
- Author configuration
- Future backlog (what we deliberately did not build, and why)
- Testing strategy
- Build sequence with task bundles
- Risk list with mitigations
- Exit criteria

A separate implementation plan will be written after this doc is committed, via the `superpowers:writing-plans` skill, and saved alongside as `2026-04-09-blog-redesign-implementation.md`.

---

## 1. Scope and decisions

### 1a. Scope

- **In scope:** blog listing page redesign, blog article reading page redesign, series system, legacy content frontmatter migration, new named author in `authors.yml`, three signature touches (shielded reveal, highlight-to-share, scroll progress bar), co-located vitest unit tests for every new component.
- **Out of scope (deferred or killed):** see §11 Future Backlog.

### 1b. Decisions locked in

1. **Notion CMS pipeline is dropped entirely.** Wayne's 2026-04-09 call: the team will use Claude Code to push blog posts from Notion into the repo manually rather than building an automated sync. No sync script, no GitHub Action, no schema migration. Ignore §9 of `2026-04-07-silhouette-docs-overhaul-design.md` going forward.

2. **Legacy blog posts stay as-is.** Three of the seven existing posts reference MEV (`intro`, `problemwithdefi`, `whydarkpools`), which violates the anti-MEV rule set in Phase 1. Wayne's call: the legacy posts are frozen. The anti-MEV rule applies to new content only, not retroactively.

3. **Blog section keeps the label "Blog"** rather than renaming to "Field Notes" or "Dispatches", for searchability and familiarity.

4. **Editorial positioning leans research-publication.** Closer to Every / Stripe Press / Linear-blog in feel than Vercel-blog. Earned by the Silhouette audience (developers, institutions, privacy-minded traders) and the 2000-2500 word research essays the archive is trending toward (24 upcoming articles in the Notion pipeline, of which 7 form a numbered foundational series).

5. **5-category taxonomy**: Research / Guides / Explainers / Product / Announcements. Retire the generic `article` tag from all 7 legacy posts.

6. **Series system** with first-class visual treatment. The numbered 1-7 Silhouette Series from the Notion pipeline gets a dedicated band on the listing page and series-aware chrome on the article page. This is the single highest-leverage editorial asset in the pipeline.

7. **Dark only.** No light-mode reading surface. `#13161a` base background stays.

8. **Three signature touches** (and only these three, everything else deferred to v2):
   - Shielded text reveal (body content blurs-then-sharpens on first article load)
   - Highlight-to-share popover (text selection → Quote on X / Copy quote)
   - Scroll progress bar (2px magenta-cyan gradient fixed at top of viewport, desktop only)

9. **All new components ship with vitest unit tests in the same commit** (Wayne's standing feedback rule from 2026-04-08, `feedback_unit_tests_required.md`).

10. **All UI work dispatched through frontend-design + ui-ux-pro-max skills** (Wayne's standing feedback rule, `feedback_always_use_frontend_design.md`).

### 1c. Upcoming content pipeline context

The Notion "Articles" database (https://www.notion.so/322921f363a480c79cb9e3859c0e6e6b, DB ID `322921f3-63a4-80c7-9cb9-e3859c0e6e6b`) contains 24 articles in draft or idea stage as of 2026-04-09. Once graphics are finalised, these will be pushed into `blog/` via Claude Code manually. The pipeline breaks down as:

**The Silhouette Series (numbered 1-7, all Draft stage, graphics pending):**
1. What Is Silhouette? Shielded Trading on Hyperliquid Explained
2. Why Silhouette Built on Hyperliquid
3. Information Asymmetry Is DeFi's Unsolved Problem
4. Order Flow Extraction: How Public Blockchains Cost Traders Billions
5. Why Full Opacity Breaks DeFi: The Liquidity Paradox
6. Why Onchain Dark Pools Failed and What Replaces Them
7. Shielded Spot Trading on Hyperliquid: How It Works and How to Start

This is a coherent editorial primer sequence. A reader who lands on #1 should naturally be guided through #2-#7. It functions as the "Start Here" onboarding path.

**Long-tail SEO / AI-citability posts (~16, mostly Idea stage):**
- Explainers and comparisons: TEE vs ZK vs MPC, Are TEEs Actually Safe, RFQ in DeFi
- Ultimate guides: Shielded Trading 2026, Hyperliquid 2026, TEEs in DeFi 2026
- How-to step-by-steps: How to Buy HYPE Without Showing Your Hand, HIP-4 information leakage
- Listicles: 5 Ways DeFi Bots Extract Value, 7 Reasons Serious Traders Are Switching
- Audience-specific: How Institutional Traders Execute on Hyperliquid in 2026

The design assumes the blog scales from 7 posts today to ~31 posts within the push horizon, so discovery mechanics (category filters, labeled bands, archive tail) are built for the 30-post state, not the 7-post state.

---

## 2. Research synthesis

Two parallel deep-research subagents fetched live HTML and CSS from 15+ reference publications each plus primary typography sources (Matthew Butterick, WCAG 2.2, Pimp My Type, dark-mode reading literature). Full reports are embedded in the conversation log. The load-bearing findings:

### 2a. Listing page findings (agent A, ~4,600 words)

- **Hero + list archetype** is the right skeleton at 7-30 posts. Single load-bearing featured card, then a calm grid, then optional archive tail. Scales cleanly from 7 to 100 posts without restructuring. Reference: Dagster, Linear, Notion, Every homepage, Vercel.
- **At 7 posts, skip filter chips.** At 30+ posts, filter chips become essential because the grid gets too large to scan. Since we're designing for the 30-post horizon, we include the filter pills from day one.
- **Labeled bands beat filter chips for young archives.** Bands communicate curation; filters communicate volume. Reference: Every.to labeled bands ("Recent Essays", "Every Studio", "Dispatches"), Linear blog, Notion blog.
- **Cards in dark mode use 1px borders, not shadows.** Shadows die on dark (a shadow is a darker region, dark-on-dark is invisible). Borders at `rgba(255,255,255,0.06)` are the standard. Hover brightens to `rgba(255,255,255,0.12)` and translates the card `-2px` on Y. Optional faint accent glow (magenta or cyan at 0.05-0.10 opacity) fits Silhouette's palette.
- **Absolute date beats relative date** on listings. `Feb 2026` not `2 months ago`. Relative dates age badly.
- **One category pill per card is the ceiling**; multi-tag stacks are clutter.
- **Cover image fallback must not be a solid-color rectangle.** Build a gradient fallback with the post title overlaid in Inter Display, plus a wordmark lockup.
- **Skip reading time on grid cards.** It's noise when post lengths vary. It does belong in the article page eyebrow, not the card.
- **5 categories is the upper limit** before cognitive overload. 4 is safer. We commit to 5 because the actual content pipeline maps to 5 distinct jobs (Research / Guides / Explainers / Product / Announcements).

### 2b. Article reading page findings (agent B, ~4,500 words)

- **Typography is the decisive factor.** Specific numbers from the research:
  - **Body:** Inter Variable 19px desktop / 17px mobile, line-height 1.7 (desktop) / 1.65 (mobile), weight 450 (not 400, dark mode optically thins), color `#E5E7EB` on `#13161a` = 13.8:1 contrast AAA with headroom.
  - **Measure:** `min(68ch, 720px)`. Medium uses 680px at 18-21px ≈ 65-72 cpl; Overreacted uses 672px. 68ch on Inter 19px ≈ 648px actual.
  - **Line-height bump for dark mode** is real. Dark-mode reading adds +0.05-0.1 over light-mode equivalents to compensate for halation. 1.7 is the sweet spot.
  - **Never pure white on pure black.** Pure `#fff` on `#000` causes halation fatigue. Use off-white (`#E5E7EB` or `#D4D4D8`) on dark-grey (`#13161a` or similar). Silhouette's existing `#13161a` is already in the right zone.
- **Left-aligned article hero, not centered.** Linear, Vercel, Notion, Overreacted, Rauno, Josh Comeau all left-align. Centered titles (Stripe Press, Every) are for literary essays; left-aligned is the technical-publication default.
- **Inter Display 56-60px desktop / 40px mobile** for titles, weight 600, letter-spacing -0.025em, line-height 1.05, `text-wrap: balance`. Tailwind's `text-[2.5rem]/10 tracking-tight` mobile → `text-6xl` desktop is exemplary.
- **IBM Plex Mono for eyebrow metadata, not Orbitron.** The research agent explicitly flagged this: Plex Mono gives terminal/privacy-tooling feel that matches the Silhouette brand better than Orbitron in the chrome. Orbitron stays reserved for category pills, section labels, navbar, footer headings. Never body, never article titles.
- **Right-rail sticky TOC only at ≥1280px.** Below that, collapse to inline `<details>` drawer. Hide entirely on mobile (mobile readers don't scrub).
- **Code blocks one step raised from body bg** (`#1A1E24` on article `#13161a`), subtle 1px border, custom syntax theme (not Dracula/OneDark). Magenta keywords, cyan strings, lilac functions, amber numbers, muted comments.
- **Three signature touches to build, not five.** Scroll progress bar + shielded text reveal + highlight-to-share. Skip sidenotes (4-8h for minimal ROI this push), cursor-glow background (noise-to-signal borderline), drop caps (twee), reading-mode toggle (base surface is already optimized).
- **Full-bleed cover image on mobile.** `margin: 0 -20px; width: calc(100% + 40px); border-radius: 0`. On desktop, contained at one step wider than the reading column (~960px) with a subtle 1px frame.

### 2c. Agreed anti-patterns

Both reports flagged the same mistakes:

- Default Docusaurus blog theme ("the platonic form of generic tech blog")
- Pure white text on dark (halation)
- Measure too wide (Docusaurus default ~80-100 cpl is wrong)
- Line height too tight (anything under 1.6 in dark mode fights the reader)
- Font size too small (14-15px is cramped; 18-19px is the modern standard)
- Competing sticky chrome (sticky header + sticky TOC + sticky share rail all at once)
- Solid-color rectangles as cover-image fallbacks
- Mid-article CTAs and newsletter modals
- Author bios that waste more space than they earn
- `READ MORE →` buttons on cards when the whole card is clickable
- Reading time in primary-accent color (should be muted metadata, not a loud badge)

---

## 3. Architecture and file layout

### 3a. Docusaurus swizzles

| Component | Swizzle mode | Purpose |
|---|---|---|
| `theme/BlogListPage/index.tsx` | wrap (or eject if wrap proves insufficient) | Custom listing layout with bands, filters, hero, grid, archive tail |
| `theme/BlogPostPage/index.tsx` | wrap | Custom article page chrome, mounts `<BlogScrollProgress>` and `<BlogHighlightShare>` |
| `theme/BlogPostItem/index.tsx` | eject | Individual post rendering with `<BlogShieldedReveal>` wrapping the body |
| `theme/BlogPostItem/Header/Title/index.tsx` | eject | Left-aligned Inter Display title with `text-wrap: balance` |
| `theme/BlogPostItem/Header/Info/index.tsx` | eject | Eyebrow row (Plex Mono, category + reading time + date) |
| `theme/BlogPostItem/Header/Author/index.tsx` | eject | 40px avatar byline row with inline share buttons |
| `theme/BlogPostItem/Footer/index.tsx` | wrap | Hosts `<CopyForLLMRow>`, sign-off, `<BlogNextInSeries>`, `<BlogReadNext>` |
| `theme/BlogPostItems/index.tsx` | eject | Listing card iteration, replaced with custom card components |
| `theme/BlogSidebar/index.tsx` | eject and neuter | Default blog sidebar is replaced by the band layout; we return null |
| `theme/BlogLayout/index.tsx` | wrap | Removes the default left sidebar slot, gives a full-width canvas |

**Swizzle safety note:** several blog components are marked "unsafe" by Docusaurus, meaning they can break on minor version bumps. We accept this risk because (a) Docusaurus is pinned to 3.9.2 via `pnpm-lock.yaml`, (b) the repo is already swizzle-heavy (`DocItem/Footer`, `Footer`, `Root` from Phase 1), and (c) any future bump gets a test pass on a throwaway branch before landing.

### 3b. New components

All in `src/components/blog/`, each with `index.tsx`, `styles.module.css`, and co-located `*.test.tsx`:

```
src/components/blog/
├── BlogHero/                 # featured hero card (listing page)
├── BlogSeriesBand/           # THE SILHOUETTE SERIES horizontal band
├── BlogSeriesCard/           # numbered step card (PART N/7 + title + dek)
├── BlogLatestBand/           # labeled LATEST grid wrapper
├── BlogPostCard/             # standard 2-col grid card
├── BlogArchiveList/          # text-only archive tail list
├── BlogCategoryPills/        # client-side filter pills
├── BlogPublicationHeader/    # page title + subtitle at top of listing
├── BlogEyebrow/              # Plex Mono uppercase eyebrow row
├── BlogByline/               # 40px avatar + name + role + share row
├── BlogShareRow/             # X / Copy link / RSS inline buttons
├── BlogNextInSeries/         # previous/next series navigation
├── BlogReadNext/             # 1 big card + 3 small cards
├── BlogScrollProgress/       # 2px gradient fixed bar
├── BlogShieldedReveal/       # blur to sharp intro wrapper
├── BlogHighlightShare/       # text selection popover
├── BlogCoverImage/           # cover image with border + fallback trigger
├── BlogCoverFallback/        # gradient fallback card when no cover
└── BlogTOC/                  # right-rail sticky table of contents
```

19 components. Each tested. Nothing registered in `MDXComponents.tsx` (these are internal to the blog theme, not MDX-callable).

### 3c. New lib and data files

```
src/lib/blog/
├── series.ts                 # getSeriesPosts, getSeriesNavigation, getSeries
├── categories.ts             # CATEGORIES array, getCategoryMetadata
├── readingTime.ts            # 200 WPM calculator for technical content
└── sortByDate.ts             # shared sort helpers

src/data/blog/
├── series.ts                 # SeriesDefinition registry
└── categories.ts             # CategoryDefinition registry
```

Series definitions live separately from components because they are cross-post editorial structure, not per-post metadata. A series is defined once, posts reference it via frontmatter.

### 3d. Config changes

**`docusaurus.config.ts`** minor additions only:

- `blog.blogSidebarHidden: true` (disable default sidebar)
- Blog listing, tags, authors, archive routes stay excluded from structured data (schema markup pass is a separate task)
- **No navbar label change.** Stays "Blog" per Wayne's call.

**`src/css/custom.css`** zero new root tokens. Everything in blog theme styles references existing tokens in `:root`. If a blog-specific semantic token is needed (e.g. `--blog-card-bg`), it lives in `:root` and references an existing primitive.

**`blog/authors.yml`** extended with `wayne` entry (see §8 Authors).

### 3e. Dependencies

No new runtime dependencies. Everything uses:

- React 18 (already in Docusaurus 3.9.2)
- Native `IntersectionObserver` (scroll progress, image fade-in)
- Native `Selection` API (highlight-to-share)
- Native `prefers-reduced-motion` (shielded reveal gating)
- Native `navigator.clipboard` with `document.execCommand('copy')` fallback

Any missing primitive gets called out to Wayne before reaching for a dependency.

### 3f. Directory tree after the push

```
src/
├── components/
│   ├── blog/                 (19 new component dirs, each with test)
│   └── (existing components unchanged: EndpointCard, Hero, RoleCard, etc.)
├── lib/
│   └── blog/                 (new)
├── data/
│   └── blog/                 (new)
├── theme/
│   ├── BlogListPage/         (new swizzle)
│   ├── BlogPostPage/         (new swizzle)
│   ├── BlogPostItem/         (new swizzle tree: index + Header subtree + Footer wrap)
│   ├── BlogPostItems/        (new swizzle)
│   ├── BlogSidebar/          (new swizzle, neutered)
│   ├── BlogLayout/           (new swizzle wrap)
│   ├── DocItem/Footer/       (unchanged)
│   ├── Footer/               (unchanged)
│   ├── Root.js               (unchanged)
│   └── MDXComponents.tsx     (unchanged)
└── css/
    └── custom.css            (minor additions, no root changes)
```

---

## 4. Listing page design

### 4a. Visual structure (top to bottom)

```
┌─────────────────────────────────────────────────┐
│  Navbar (existing, unchanged)                   │
├─────────────────────────────────────────────────┤
│                                                 │
│    Blog                            ← Inter      │
│    Writing on shielded trading,    Display 48   │
│    TEE architecture, and the road  Plex Mono    │
│    to private perps                14 subtitle  │
│                                                 │
│   [All][Research][Guides][Explainers]...        │  ← 6 pills
│                                                 │
│  ┌───────────────┬─────────────────────┐        │
│  │               │ RESEARCH · 7 MIN    │        │
│  │ [cover image] │                     │        │
│  │               │ Title in Inter      │        │  ← FEATURED HERO
│  │               │ Display 32px        │        │     (most recent)
│  │               │                     │        │
│  │               │ 3-line dek...       │        │
│  │               │                     │        │
│  │               │ wayne · APR 08 2026 │        │
│  └───────────────┴─────────────────────┘        │
│                                                 │
│  ───── THE SILHOUETTE SERIES ─────              │
│  Start here. Seven essays on why shielded       │  ← labeled band
│  trading matters.                               │     (only on "All" filter)
│                                                 │
│  ┌────┬────┬────┬────┬────┬────┬────┐           │
│  │ P1 │ P2 │ P3 │ P4 │ P5 │ P6 │ P7 │           │  ← 7 numbered cards
│  └────┴────┴────┴────┴────┴────┴────┘           │
│                                                 │
│  ───── LATEST ─────                             │  ← labeled band
│                                                 │
│  ┌─────────────┐ ┌─────────────┐                │
│  │ cover       │ │ cover       │                │
│  │ ...         │ │ ...         │                │  ← 2-col grid
│  │ Title       │ │ Title       │                │     (4-6 recent posts)
│  │ Dek...      │ │ Dek...      │                │
│  │ wayne · FEB │ │ wayne · APR │                │
│  └─────────────┘ └─────────────┘                │
│                                                 │
│  ───── MORE ESSAYS ─────                        │  ← archive tail
│                                                 │
│  RESEARCH    APR 08 2026                        │
│  Order Flow Extraction: How Public...           │  ← text-only rows
│  ──────────────────────────────────             │
│  RESEARCH    FEB 22 2025                        │
│  Hyperliquid: Shielded Trading                  │
│                                                 │
│  (footer)                                       │
└─────────────────────────────────────────────────┘
```

**Container**: max-width 1280px, centered. Page padding 20px mobile / 48px tablet / 64px desktop. Vertical rhythm 128px from publication header to hero, 96px between bands, 128px from final band to footer.

### 4b. Publication header

- Title: `Blog` in Inter Display 48px / weight 600 / letter-spacing -0.02em / color `var(--text-default)` (resolved `#E5E7EB`)
- Subtitle: `Writing on shielded trading, TEE architecture, and the road to private perps` in IBM Plex Mono 14px / weight 400 / color `var(--text-muted)`
- Spacing: 12px between title and subtitle, 64px from subtitle to pills
- Left-aligned

### 4c. Category pill filters

**6 pills in horizontal flex**: `All` / `Research` / `Guides` / `Explainers` / `Product` / `Announcements`, 12px gap.

**Style**:
- Border: 1px `rgba(255,255,255,0.1)`
- Text color: `var(--text-muted)`
- Padding: `8px 16px`
- Border radius: `999px`
- Hover: border brightens to `rgba(255,255,255,0.18)`, text to `var(--text-default)`, 150ms ease-out, cursor pointer
- Active: fills with `linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.15), rgba(var(--accent-secondary-rgb), 0.15))`, border at `rgba(255,255,255,0.3)`, text at full contrast
- Focus: 2px outline ring in `var(--accent-secondary)`, 2px offset

**Interaction**: client-side filter only. URL updates to `?category=research`. No server round-trip. Keyboard arrow keys move between pills; Enter/Space activates. `aria-pressed={active}` on each `<button type="button">`.

**Not sticky by default.** Revisit if user testing shows stickiness is wanted.

### 4d. Category registry

`src/data/blog/categories.ts`:

```ts
export interface CategoryDefinition {
  slug: string;
  label: string;
  accent: string; // CSS token reference for the accent dot on article eyebrows
  description?: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  { slug: 'research',      label: 'Research',      accent: 'var(--accent-primary)'   },
  { slug: 'guides',        label: 'Guides',        accent: 'var(--accent-secondary)' },
  { slug: 'explainers',    label: 'Explainers',    accent: 'var(--accent-tertiary)'  },
  { slug: 'product',       label: 'Product',       accent: 'var(--color-success)'    },
  { slug: 'announcements', label: 'Announcements', accent: 'var(--color-warning)'    },
];
```

Accent colors render as a 6px dot before the category name on article page eyebrows. They do NOT affect the pill fill on the listing (which uses the shared magenta-cyan gradient).

### 4e. Featured hero card

**Layout**: split into cover (60%) and copy (40%) at ≥996px. Stacks vertically below 996px with cover on top (16:9 aspect ratio).

**Cover area**: `object-fit: cover`. Aspect ratio `1/1` split / `16/9` stacked. 5% black overlay by default (removed on hover). 1px `rgba(255,255,255,0.08)` border inside the card.

**Copy area** (top to bottom):
- Eyebrow: `{CATEGORY} · {READING TIME}`, IBM Plex Mono 11px, uppercase, letter-spacing 0.1em, color `var(--text-muted)`
- Title: Inter Display 32px desktop / 26px mobile, weight 600, letter-spacing -0.02em, `text-wrap: balance`, color `var(--text-default)`, `-webkit-line-clamp: 3`
- Dek: Inter 16px, weight 400, line-height 1.55, color `var(--text-muted)`, `-webkit-line-clamp: 3`
- 32px gap
- Byline footer: 32px avatar + `{name}` in Inter 14px + `· {DATE}` in Plex Mono 11px uppercase muted

**Card style**:
- Background: `var(--bg-secondary)` (one step raised from `var(--bg-base)`)
- Border: 1px `rgba(255,255,255,0.06)`
- Border radius: 12px
- Copy area padding: 40px desktop / 24px mobile

**Hover**: border brightens to `rgba(255,255,255,0.12)`, card translates `-2px` on Y, cover overlay fades from 5% to 0%, `box-shadow: 0 0 48px rgba(var(--accent-primary-rgb), 0.08)`. 200ms ease-out on all.

**Click target**: entire card is one `<Link>`. No separate button.

### 4f. The Silhouette Series band

**Visibility rule**: renders only when `filter === 'all'` AND `series: silhouette-primer` posts exist in the listing. Hidden in filtered views because filters are orthogonal to editorial sequence.

**Band header**:
- Label: `THE SILHOUETTE SERIES` in Orbitron 13px uppercase letter-spacing 0.16em color `var(--accent-secondary)`
- Dashed dividers flanking: `───── LABEL ─────` (thin 1px `rgba(255,255,255,0.08)` rules)
- Sub-line: `Start here. Seven essays on why shielded trading matters.` in Inter 15px weight 400 color `var(--text-muted)`, max-width 560px
- 24px below sub-line before the cards

**Card grid**:
- Desktop (≥1280px): 4-column grid wrapping to 2 rows (4 + 3)
- Tablet (996-1279px): 3-column grid
- Mobile (<996px): horizontal scroll with `scroll-snap-type: x proximity`, cards 72% viewport width

**Per card**:
- Background: `var(--bg-secondary)`
- Border: 1px `rgba(var(--accent-secondary-rgb), 0.15)` (cyan tint distinguishes series cards from regular post cards)
- Border radius: 12px
- Padding: 24px
- Step indicator row: `PART 1 OF 7` in Orbitron 11px uppercase letter-spacing 0.14em color `var(--accent-secondary)`
- 16px space
- Title: Inter 18px weight 600 `text-wrap: balance` color `var(--text-default)` `-webkit-line-clamp: 3`
- 12px space
- Dek: Inter 14px weight 400 color `var(--text-muted)` `-webkit-line-clamp: 2`
- 24px space
- Footer: `→ READ` in Plex Mono 11px uppercase letter-spacing 0.1em color `var(--text-muted)`

**Hover**: border brightens, -2px Y translate, cyan glow (`box-shadow: 0 0 48px rgba(var(--accent-secondary-rgb), 0.08)`). On hover the footer arrow translates +2px on X and the label brightens to `var(--accent-secondary)`.

### 4g. Latest band

**Header**: `LATEST` in same style as the Silhouette Series band header, no sub-line.

**Grid**: 2-column at ≥996px, 1-column below. Horizontal gap 40px, vertical gap 64px. Shows up to **6 posts** (non-series, non-hero, newest first) on "All" view. In filtered views, the hero slot collapses to "latest post in this category", the series band hides, and this grid fills with all filtered posts.

**Card anatomy**:
- Cover image 16:9 top of card, edge-to-edge
- Padding 24px below the image
- Eyebrow: `{CATEGORY} · {READING TIME}` Plex Mono 11px muted
- Title: Inter 22px weight 600 `text-wrap: balance` color `var(--text-default)` `-webkit-line-clamp: 2`
- Dek: Inter 15px weight 400 color `var(--text-muted)` `-webkit-line-clamp: 2`
- Footer: `{name} · {DATE}` with `margin-top: auto` (pins to card bottom). Name in Inter 13px weight 500. Date in Plex Mono 11px uppercase muted.

**Card style**: `var(--bg-secondary)` bg, 1px `rgba(255,255,255,0.06)` border, 12px radius, overflow hidden.

**Hover**: same -2px translate + border brighten. **Alternating accent glow** deterministic by post slug hash: `hash(slug) % 2 === 0 ? magenta : cyan`. Stable across filter changes because it's keyed on slug, not array index. Glow at `box-shadow: 0 0 32px rgba(<accent>, 0.08)`.

### 4h. More essays archive tail

Minimal text-only list of posts beyond the first 6 latest + 7 series. Rendered as `<ul>` with no bullet markers.

**Per row**:
- Top metadata line: category + date, Plex Mono 11px uppercase muted, 12px gap between them
- Bottom title line: Inter 17px weight 500 `var(--text-default)`, 4px margin-top
- Separator: 1px bottom border `rgba(255,255,255,0.05)`, omitted on last row
- Row padding: 24px vertical, 0 horizontal
- Hover: background shifts to `rgba(255,255,255,0.02)`, title brightens to `var(--text-default)` at full opacity, cursor pointer

This is not a grid. It is a reading list. It carries "we have more" without visual noise.

### 4i. Cover image fallback

When a post has no `image` frontmatter, `<BlogCoverImage>` renders `<BlogCoverFallback>` instead:

- Background: `linear-gradient(135deg, var(--bg-base) 0%, rgba(var(--accent-primary-rgb), 0.08) 50%, rgba(var(--accent-secondary-rgb), 0.08) 100%)`
- 1px inner border `rgba(255,255,255,0.08)`
- Post title overlaid bottom-left in Inter Display 24px weight 600 `var(--text-default)`, `-webkit-line-clamp: 3`, 24px padding
- Silhouette wordmark in Orbitron 10px top-right, 24px inset, color `var(--text-muted)`
- 2% opacity noise texture for depth
- Same 16:9 aspect ratio as real covers
- Same hover treatment (overlay fade) as real covers

Never a solid-color placeholder rectangle.

### 4j. Responsive breakpoints

| Breakpoint | Layout |
|---|---|
| ≥1280px | Full layout. 2-col grid. Series band 4-col. |
| 996-1279px | 2-col grid. Series band 3-col. Hero splits. |
| 640-995px | 1-col grid. Series band horizontal scroll with snap. Hero stacks. |
| <640px | Same as above. Page padding 20px. Title drops to 32px. |

### 4k. Filtered state behavior

On category pill click:

1. URL updates to `/blog?category=research`
2. Publication header stays visible
3. Pills row stays visible with active state
4. **Hero becomes "latest post in this category"** (or empty state if category is empty)
5. **Silhouette Series band hides** (orthogonal to filtering)
6. **Latest band becomes full filtered grid**, label changes from `LATEST` to `{CATEGORY}` (`RESEARCH`, `GUIDES`, etc)
7. **Archive tail shows remaining filtered posts** beyond the grid fill

Empty state: small card saying `No {category} posts yet. Check back soon.` with `← Back to all posts` link.

### 4l. Keyboard and screen reader

- Every card is a single `<a>` (not a div with onClick handler). Native keyboard focus, right-click-to-copy-URL.
- Category pills are `<button type="button">` with `aria-pressed`. Arrow keys move between pills.
- Band labels are `<h2>` so SRs announce section headings.
- Archive tail is `<ul role="list">`.
- Series cards wrap step numbering in `<span class="visually-hidden">Part 1 of 7: </span>{title}` so SRs read "Part 1 of 7: What Is Silhouette".

### 4m. Explicitly NOT on the listing page

No blog search, no load-more button, no pagination, no sidebar, no newsletter signup, no tag cloud, no social share counts, no "most popular" section, no author carousel, no featured author, no related-posts rail.

---

## 5. Article reading page design

### 5a. Page grid

CSS Grid with three columns so images can break out:

```css
.blogArticleContainer {
  display: grid;
  grid-template-columns: 1fr min(720px, 100%) 1fr;
  column-gap: 64px;
  padding: 96px 20px 128px;
}

.blogArticleBody > * {
  grid-column: 2;              /* default: inside reading column */
}

.blogArticleBody > .wide {
  grid-column: 1 / -1;
  max-width: 960px;
  margin-inline: auto;
}

.blogArticleBody > .fullBleed {
  grid-column: 1 / -1;
  max-width: 100%;
}
```

At viewports ≥1280px, the right-rail TOC occupies `grid-column: 3` with `position: sticky`.

### 5b. Top chrome

**Back link**: `← Blog` in Inter 14px weight 500 color `var(--text-muted)`, hover to `var(--accent-secondary)`. Flush-left inside the reading column, 48px above the eyebrow. Not sticky.

**Series badge** (only if post has `series` frontmatter): small pill `PART 3 OF 7 · THE SILHOUETTE SERIES` in Orbitron 11px uppercase letter-spacing 0.14em color `var(--accent-secondary)`, 1px `rgba(var(--accent-secondary-rgb), 0.3)` border, padding `6px 14px`, corner radius `999px`. 32px above the eyebrow. Links to the series filtered view.

**Eyebrow row**:
- Format: `{CATEGORY} · {READING TIME} · {DATE}`
- Example: `RESEARCH · 7 MIN · APR 08 2026`
- Font: IBM Plex Mono 12px weight 500 uppercase letter-spacing 0.12em color `var(--text-muted)`
- 6px accent dot before category name (color from `categories[slug].accent`)
- Category token is clickable, links to `/blog?category=<slug>`
- 16px below back link, 24px above title

**Title**: Inter Display 60px desktop / 48px tablet / 40px mobile, weight 600, letter-spacing -0.025em, line-height 1.05, `text-wrap: balance`, color `var(--text-default)`. Left-aligned. 32px below eyebrow.

**Dek** (only if `description` frontmatter is not a stub): Inter 22px desktop / 19px mobile, weight 400, line-height 1.4, color `var(--text-muted)`, `max-width: 40em`, `-webkit-line-clamp: 3`. 16px below title. 32px above byline row.

### 5c. Byline row

Single horizontal flex, 32px below dek (or 32px below title if no dek), 64px above the cover image or body.

**Left side** - author block:
- Avatar: 40x40px `border-radius: 50%`, 1px `rgba(255,255,255,0.1)` border
- Name: Inter 15px weight 500 `var(--text-default)`
- Role: Inter 13px weight 400 `var(--text-muted)` directly under name
- 12px gap between avatar and name block

**Multi-author**: avatars stack with 24px overlap, up to 2 visible, "+N more" text if applicable. Names comma-joined.

**Right side** - share row:
- `Share on X` · `Copy link` · `RSS` as three text buttons separated by 16px gap and `·` dividers
- Each: Inter 13px weight 500 `var(--text-muted)`, hover to `var(--accent-secondary)`
- Share on X: `https://twitter.com/intent/tweet?text={title}&url={url}` in new tab
- Copy link: clipboard write, inline "✓ Copied" confirmation for 1.5s
- RSS: links to `/blog/rss.xml`
- Hidden below 640px (mobile already has native share)

### 5d. Cover image

Optional. If present, renders at `class="wide"` (max-width 960px, one step wider than reading column) between byline row and body. 48px top margin, 64px bottom margin.

**Treatment**:
- 1px `rgba(255,255,255,0.08)` border
- Border radius 8px
- Overflow hidden
- No shadow (shadows die in dark mode)
- Caption (optional) in Inter 14px italic `var(--text-muted)` center-aligned below

**Mobile (<640px)**: full-bleed. `margin-left: -20px; margin-right: -20px; width: calc(100% + 40px); border-radius: 0`.

If no cover image, body starts immediately after byline row. No placeholder.

### 5e. Body typography

This is the decisive section. Every measurement is load-bearing.

```css
.blogArticleBody p {
  font-family: var(--font-sans);           /* Inter Variable */
  font-size: 19px;                         /* desktop */
  line-height: 1.7;                        /* 32.3px */
  font-weight: 450;                        /* optical correction for dark */
  letter-spacing: 0;                       /* Inter is calibrated */
  color: var(--text-default);               /* #E5E7EB, 13.8:1 on #13161a, AAA */
  font-feature-settings: "cv11", "ss01", "ss03";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-block: 1.5em;                     /* ~28px between paragraphs */
  max-width: min(68ch, 720px);
}

/* Mobile */
@media (max-width: 640px) {
  .blogArticleBody p {
    font-size: 17px;
    line-height: 1.65;
  }
}
```

**Headings**:

| Element | Desktop | Mobile | Weight | Margin-top | Margin-bottom |
|---|---|---|---|---|---|
| H2 | 32px | 28px | 600 | 2.5em | 0.5em |
| H3 | 24px | 22px | 600 | 1.75em | 0.5em |
| H4 | 19px | 17px | 600 | 1.5em | 0.4em |

All headings: `letter-spacing: -0.015em`, `line-height: 1.25`, `scroll-margin-top: 80px`, color `var(--text-default)`.

Hover on H2/H3 reveals a `#` anchor character to the left at 50% opacity, clickable, copies URL with heading slug as fragment. 120ms fade-in.

### 5f. Inline elements

- **Inline code**: `background: rgba(255,255,255,0.06); padding: 2px 5px; border-radius: 4px; font-size: 0.92em; color: var(--accent-secondary); font-family: var(--font-mono);`
- **Emphasis (`<em>`)**: italic, color unchanged
- **Strong (`<strong>`)**: weight 600, color unchanged
- **Links in body**:
  ```css
  color: var(--accent-secondary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(var(--accent-secondary-rgb), 0.4);
  transition: text-decoration-color 150ms, text-decoration-thickness 150ms;
  ```
  Hover: `text-decoration-thickness: 1.5px; text-decoration-color: var(--accent-secondary);`
- **Selection**: `::selection { background: rgba(var(--accent-secondary-rgb), 0.28); color: var(--text-default); }`

### 5g. In-body element styling

**Blockquote**:
```css
border-left: 3px solid rgba(var(--accent-primary-rgb), 0.6);
padding-left: 1.25em;
color: var(--text-default);               /* NOT muted - quotes read clearly */
font-style: normal;                      /* italics off */
margin-block: 1.75em;
```
No quotation marks (a border already signals "quote").

**Pull quote** (MDX component, optional, max 1 per long post):
- `<PullQuote>...</PullQuote>`
- Center-aligned, 1.5em body-font, weight 500, color `var(--text-default)`, no border, 48px margin block, small cyan dash `-` above

**Code block**:
```css
background: var(--bg-modal);            /* one step raised from article bg */
border: 1px solid rgba(255,255,255,0.06);
border-radius: 10px;
padding: 24px;
font-family: var(--font-mono);           /* IBM Plex Mono */
font-size: 14px;
line-height: 1.6;
overflow-x: auto;
margin-block: 1.75em;
```

- Language label top-right in Plex Mono 11px uppercase muted, fades to cyan on code block hover
- Copy button top-right (below language label), icon-only, reveals on code block hover, shows "✓" for 1.5s on click
- Custom syntax theme (not Dracula/OneDark):
  - Keywords: `var(--accent-primary)` (magenta)
  - Strings: `var(--accent-secondary)` (cyan)
  - Numbers: `#fbbf24` (amber)
  - Comments: `rgba(255,255,255,0.4)`, italic
  - Identifiers: `var(--text-default)`
  - Function names: `#a78bfa` (lilac, matches Trader role from Phase 1)
  - Operators, punctuation: `var(--text-muted)`
- Diff highlighting: `+` lines `background: rgba(34,197,94,0.12)`, `-` lines `rgba(239,68,68,0.12)`

**Callouts / admonitions** (3 variants):
- `note` (cyan), `warning` (amber), `privacy` (magenta, Silhouette-branded)
- Soft 8% bg tint, 3px left border in variant color, 16-20px padding, 8px border radius
- `🔐 PRIVACY NOTE` label in Plex Mono 12px uppercase, body inherits article typography

**Lists**:
- `ul`: custom 6px cyan dot marker, 24px left of text
- `ol`: Plex Mono 13px numbers `var(--text-muted)`, not default serif
- `li` margin-block: 0.5em
- Nested: 1.5em indent, tighter line-height

**Tables**:
- Wrapper `<div class="tableWrap">` with horizontal scroll on narrow viewports
- Header row: `background: rgba(255,255,255,0.04); font-weight: 600`
- Header font: Plex Mono 12px uppercase letter-spacing 0.08em
- Zebra: odd rows `rgba(255,255,255,0.02)`
- Borders: `1px solid rgba(255,255,255,0.06)`
- Cell padding: 12px 16px

**Images inside body**:
- Default: contained inside reading column (max 720px)
- `class="wide"`: 960px centered
- `class="fullBleed"`: edge-to-edge
- All wrapped in `<figure>` with `1px rgba(255,255,255,0.08)` border, 6px radius, overflow hidden
- `<figcaption>`: Inter 14px italic `var(--text-muted)` centered, 12px top margin
- `loading="lazy"` default, `fetchpriority="high"` on first image
- Scroll-triggered fade-in via IntersectionObserver: `opacity: 0.6; filter: blur(6px)` → `opacity: 1; filter: blur(0)` over 400ms. Respects `prefers-reduced-motion`.

**Footnotes**: numbered block at bottom of article (Tailwind prose style). Not margin sidenotes (deferred to v2).

**Horizontal rules**: rare. Centered `···` flourish in Plex Mono 18px `var(--text-muted)`, not a solid line, 48px vertical margin.

### 5h. Right-rail TOC

Renders only when:
1. Viewport width ≥1280px
2. Article has ≥3 H2 headings

**Position**: `grid-column: 3`, `position: sticky`, `top: calc(var(--navbar-height) + 48px)`, `align-self: start`, `max-height: calc(100vh - 96px)`, `overflow-y: auto`.

**Width**: 220px.

**Style**:
- Label: `ON THIS PAGE` in Orbitron 11px uppercase letter-spacing 0.14em color `var(--text-muted)`
- H2 rows: Inter 13px weight 500 `var(--text-muted)`, padding 8px 0, 1px left border `rgba(255,255,255,0.06)` with `padding-left: 16px`, hover to `var(--text-default)`
- H3 rows: Inter 12px weight 400 `var(--text-muted)`, indented further
- **Active highlighting** via IntersectionObserver tracks which H2/H3 is in view (top of viewport): matching row gets `border-left: 2px solid var(--accent-secondary)` and `color: var(--text-default)`
- Smooth scroll on click, URL fragment updates

**Below 1280px**: TOC collapses into inline `<details>` drawer directly after byline row, labeled `On this page ▾`, auto-collapsed. Below 640px: hidden entirely.

### 5i. Article footer

Rendered in order, below the article body:

1. **Sign-off line** (only if `authors[0]` is a named individual): `- Wayne` in Plex Mono 15px `var(--text-muted)`, left-aligned, 48px top margin
2. **Copy for LLM row**: reuse existing `<CopyForLLMRow>` from docs theme via wrap swizzle on `theme/BlogPostItem/Footer/index.tsx`
3. **Next in series** (only if post has `series`): horizontal card with `NEXT IN THE SILHOUETTE SERIES` Orbitron eyebrow, next post title + dek, styled as a smaller version of the featured hero with cyan border tint
4. **Read next**:
   - 1 big card (editorially chosen, defaults to most recent in same category excluding current)
   - 3 smaller cards (next most recent in same category)
   - Label: `READ NEXT` in Orbitron 13px uppercase letter-spacing 0.16em `var(--accent-secondary)`, 96px above the big card
5. **Back to blog**: `← Back to all posts` in Inter 14px `var(--text-muted)` centered, 96px below last card

### 5j. Scroll progress bar

See §6a.

### 5k. Responsive breakpoints (article)

| Viewport | Layout |
|---|---|
| ≥1280px | Full layout. TOC in grid column 3. Body column `min(68ch, 720px)`. Cover 960px wide. |
| 996-1279px | TOC collapses to inline `<details>`. Everything else unchanged. |
| 640-995px | Title drops to 48px. Byline share row stays. |
| <640px | Title 40px. Body 17px / line-height 1.65. Padding 20px. Cover full-bleed. Share row hidden. Scroll progress hidden. TOC hidden. |

### 5l. Explicitly NOT on the article page

No sticky header. No sticky share rail. No sticky back-to-blog. No mid-article CTA. No newsletter popup. No claps or reactions. No comments. No estimated read counter bar. No reading mode toggle. No drop caps. No sidenotes (v2). No cursor-glow background. No social share counts. No bottom author bio box (Plex Mono sign-off replaces it). No tag cloud. No "also on Medium" callouts. No inline subscribe form.

---

## 6. Signature touches

Three, and only three, signature moves this push.

### 6a. Scroll progress bar

**Component**: `<BlogScrollProgress />` mounted in `theme/BlogPostPage/index.tsx` swizzle.

**Behavior**:
- Fixed 2px bar at `top: 0`
- `position: fixed; width: 100%; z-index: 100; pointer-events: none`
- Background: `linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)`
- Width driven by `(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100%`, throttled via `requestAnimationFrame`
- Hidden below 768px (`@media (max-width: 768px) { display: none; }`)
- Respects `prefers-reduced-motion`: updates still work (width update, not animation), but no transition on the width change so it snaps cleanly

**Tests**: mock `window.scrollY`, verify inline style width; mock matchMedia to verify hidden at mobile; confirm class applied under reduced motion.

### 6b. Shielded text reveal

**Concept**: body content arrives blurred and faded, decloaks over 400ms with a 40ms paragraph-by-paragraph stagger. Reads as a metaphor for the Silhouette product. Zero other crypto blogs do this.

**Component**: `<BlogShieldedReveal>` wrapper inside `theme/BlogPostItem/index.tsx`, wrapping the body only (not the eyebrow/title/dek/byline).

**CSS**:
```css
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

**Behavior**:
- On mount, find every direct descendant content block (`p`, `h2-h4`, `ul`, `ol`, `blockquote`, `figure`, `pre`)
- Apply `.block` class with a `--reveal-index` custom property, capped at 12 (so the first dozen paragraphs stagger, the rest appear together)
- Only runs on first mount per session (sessionStorage flag `blog:revealed:{slug}` prevents replay on back-navigation)
- Early-return if `prefers-reduced-motion: reduce`

**FOUC mitigation**: the initial blur state is set in the SAME class that triggers the animation. SSR HTML and client hydration render identically. If JS never loads, `@supports` or a `<noscript>` tag disables the blur class. Content is always readable as a fallback.

**Tests**: class application, stagger cap at 12, reduced-motion early return, sessionStorage flag behavior, empty children no-op.

### 6c. Highlight-to-share popover

**Concept**: text selection ≥15 chars inside the article body triggers a small popover with `Quote on X` and `Copy quote` buttons. Drives crypto-Twitter distribution directly.

**Component**: `<BlogHighlightShare articleRef={...} />` mounted in `theme/BlogPostPage/index.tsx`.

**Trigger criteria**:
1. `selectionchange` event fires
2. Selection is not collapsed and trimmed length ≥15 chars
3. Selection is contained within `.blogArticleBody`
4. Selection is not inside a `<pre>` or `<code>` block
5. Selection is not inside an `<a>` link

**Popover**:
- Portal-mounted to `document.body`
- Positioned via `getBoundingClientRect()` of the selection Range, 8px below the selection bottom edge, horizontally centered on the selection
- Flips to above/left/right if it would overflow the viewport
- Background: `var(--bg-modal)`
- Border: 1px `rgba(255,255,255,0.12)`
- Border radius: 10px
- Padding: 8px
- Box shadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(var(--accent-primary-rgb), 0.1)`
- Enter animation: 120ms fade + 4px translate-up
- Two buttons separated by 1px vertical divider:
  - **Quote on X**: opens `https://twitter.com/intent/tweet?text=${encodeURIComponent('"' + selectedText + '"\n\n- from ' + postTitle)}&url=${encodeURIComponent(canonicalUrl)}` in new tab
  - **Copy quote**: clipboard write of `> {selectedText}\n\n- {postTitle}\n{canonicalUrl}` via `navigator.clipboard.writeText()` with `document.execCommand('copy')` fallback. Label swaps to "✓ Copied" for 1.5s.

**Dismiss triggers**: click-outside, scroll, Escape, selection cleared, new selection that doesn't meet criteria.

**Mobile**: hidden entirely below 768px. Mobile uses native text-selection share sheet. Decision is explicit.

**Accessibility**:
- `role="toolbar"` with `aria-label="Share selected quote"`
- Each button is `<button type="button">` with descriptive `aria-label`
- Popover does not steal focus; tab order puts it after the selected content
- `prefers-reduced-motion: reduce`: enter animation disabled, appears instantly

**Tests**: 15-char threshold, inside-article scoping, code-block/link exclusion, Escape dismiss, scroll dismiss, tweet URL encoding, clipboard fallback.

### 6d. Signature touches explicitly NOT built

- Tufte-style sidenotes (deferred to v2, 4-8h build)
- Cursor-following radial gradient background (deferred, noise-to-signal borderline)
- Drop caps on research posts (deferred, twee)
- Scroll-triggered reveals on body paragraphs (competes with one-shot mount reveal)
- Sentence-highlighting following scroll (competes with reading flow)
- Reading mode toggle (base surface already optimized)
- "About to read for ~7 minutes" modal (eyebrow reading time is sufficient)

---

## 7. Series system

### 7a. Frontmatter schema

New optional fields added to blog post frontmatter:

```yaml
---
slug: information-asymmetry-defi
title: Information Asymmetry Is DeFi's Unsolved Problem
authors:
  - wayne
category: research
description: Why every public orderbook is a broadcast of your strategy, and what Silhouette does about it.
image: ./images/information-asymmetry-cover.jpg
series: silhouette-primer
series_order: 3
---
```

**New fields**:
- `category` (required going forward): must match a `CategoryDefinition` slug from `src/data/blog/categories.ts`. Build fails on unknown category. Replaces the generic `article` tag.
- `series` (optional): slug referencing a `SeriesDefinition` from `src/data/blog/series.ts`. Posts without `series` render normally.
- `series_order` (required if `series` set): integer position in the series. Build fails on duplicate order or gap.

**Existing fields** stay unchanged: `slug`, `title`, `authors`, `description`, `image`, `tags`. The `tags` field is kept for forward compatibility but all current posts have `tags: [article]` removed during migration. Not surfaced in UI this push.

### 7b. Series definition file

`src/data/blog/series.ts`:

```ts
export interface SeriesDefinition {
  slug: string;
  label: string;
  eyebrow: string;
  description: string;
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
```

A future second series ("Institutional Playbook" say) gets added as a single entry. No component changes needed.

### 7c. Resolution helpers

`src/lib/blog/series.ts`:

```ts
import { SERIES, type SeriesDefinition } from '@site/src/data/blog/series';

export function getSeriesPosts(series: string, allPosts: BlogPost[]): BlogPost[] {
  return allPosts
    .filter((post) => post.metadata.frontMatter.series === series)
    .sort((a, b) => {
      const aOrder = a.metadata.frontMatter.series_order ?? 0;
      const bOrder = b.metadata.frontMatter.series_order ?? 0;
      return aOrder - bOrder;
    });
}

export function getSeriesNavigation(
  currentPost: BlogPost,
  allPosts: BlogPost[]
): { previous: BlogPost | null; next: BlogPost | null } {
  const series = currentPost.metadata.frontMatter.series;
  if (!series) return { previous: null, next: null };

  const seriesPosts = getSeriesPosts(series, allPosts);
  const currentIndex = seriesPosts.findIndex(
    (p) => p.metadata.permalink === currentPost.metadata.permalink
  );
  if (currentIndex === -1) return { previous: null, next: null };

  return {
    previous: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
  };
}

export function getSeries(slug: string): SeriesDefinition {
  const series = SERIES[slug];
  if (!series) throw new Error(`Unknown series: ${slug}`);
  return series;
}
```

**Tests**: empty series returns empty, correct order resolved, gap detection throws, duplicate order detection throws, previous/next edge cases (first, last, only post), unknown series throws.

### 7d. Where series data plumbs through

- **Listing page** (`BlogListPage` swizzle): calls `getSeriesPosts('silhouette-primer', allPosts)`. If result is non-empty AND filter is `all`, renders `<BlogSeriesBand />`. Otherwise nothing.
- **Article page** (`BlogPostPage` swizzle): if current post has `series`, renders series badge at top (above eyebrow) and `<BlogNextInSeries />` in the footer.
- **Build-time validation**: small check runs as a `prebuild` npm script over `blog/**/*.md` via `gray-matter` (not via Docusaurus's internal data pipeline, so timing is independent). Validates that every post with `series` also has `series_order`, that orders are contiguous, that no duplicates exist, that the series slug resolves. Fails the build on any violation.

---

## 8. Content migration (legacy posts)

Policy: **no body content changes.** Frontmatter only. MEV references stay. This is a metadata migration, not a rewrite.

### 8a. Per-post changes

| File | New frontmatter |
|---|---|
| `blog/2025-01-22-intro.md` | `category: announcements`, remove `tags: [article]` |
| `blog/2025-02-22-hyperliquid.md` | `category: research`, remove `tags: [article]` |
| `blog/2025-06-10-raiseannouncement.md` | `category: announcements`, remove `tags: [article]` |
| `blog/2025-06-20-problemwithdefi.md` | `category: research`, remove `tags: [article]` |
| `blog/2025-07-14-problemwithprivacy.md` | `category: research`, remove `tags: [article]` |
| `blog/2025-08-12-whydarkpools.md` | `category: research`, remove `tags: [article]` |
| `blog/2026-02-04-shieldedspot.md` | `category: product`, remove `tags: [article]`, add `<!-- truncate -->` after first paragraph |

**None of these get `series` or `series_order`**. The 7 Silhouette Series posts are the upcoming Notion pipeline posts, not the legacy 7.

**None of these get `wayne`** as author. They keep `silhouette-team`. Reattribution is a content decision, not a migration decision. Can be a future commit if desired.

**Descriptions stay stubbed.** Real descriptions are on the backlog as the "real description frontmatter pass" from the session 2 handoff. Separate pass.

### 8b. The `<!-- truncate -->` fix

`2026-02-04-shieldedspot.md` currently triggers a build warning. Fix is one line: insert `<!-- truncate -->` after the opening paragraph (between the image reference and the `## What Is Available` heading). Zero content change.

### 8c. Commit structure

- **One commit** for all 7 frontmatter migrations (single atomic migration)
- **Separate commit** for the truncate fix (cherry-pickable if needed)

---

## 9. Authors

### 9a. New `authors.yml`

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

`page: false` disables Docusaurus's automatic author profile page generation (`/blog/authors/wayne`). Not building those this push.

### 9b. Avatar file

`static/img/authors/wayne.jpg` - 256x256 square headshot. **Wayne provides this file.** If not available by implementation time, `<BlogByline>` falls back to a generated initials avatar (single `W` in Orbitron over magenta-cyan gradient square). Fallback is built into the component regardless.

### 9c. Future authors

Entries for Jason / Chandler / Stent / Rory / Ciaran get added to `authors.yml` one at a time when their first post ships. Not pre-populated.

### 9d. Legacy posts

Keep `silhouette-team`. No retroactive reattribution.

---

## 10. Testing strategy

### 10a. Vitest unit tests

Every new component ships with a co-located `*.test.tsx` in the same commit. Baseline coverage per component:

- Renders children / renders label correctly
- Applies correct CSS module classes for variant props
- Handles empty/null data without throwing (e.g. `<BlogSeriesBand>` with no posts returns null)
- Interactive behavior (click, keyboard, selection)
- Accessibility attributes (`aria-label`, `aria-pressed`, `role`)
- Respects `prefers-reduced-motion` for components with animation

**Target**: 5-10 tests per component. 19 components × ~7 average = **~130 new tests** on top of the existing 13 from session 2 (3 smoke + 10 EndpointCard). All running in the existing vitest infrastructure.

**Notable test cases per component** - see §12 Build Sequence for specifics.

### 10b. Integration tests

**None in this push.** Docusaurus integration tests are expensive and brittle at this scale. Signal-to-effort is wrong. Relying on puppeteer visual verification gates instead.

### 10c. Puppeteer visual verification gates

Manual dispatches, not CI. Three gates:

1. **After listing page lands**: screenshot `/blog` at 1440x900 and 390x844, verify hero + series band + latest grid + archive tail all visible and not clipped, verify category pill active state after click, verify `?category=research` filter reduces the visible cards. Snapshots to `/tmp/puppeteer-debug/` (not committed).
2. **After article page lands**: screenshot a long legacy post (e.g. `/blog/why-dark-pool-havent-worked`) at 1440x900, verify typography matches spec (measure, line-height, color), TOC rail visible at ≥1280px, eyebrow Plex Mono rendering, code block custom syntax theme. Then at 768x1024 and 390x844, verify responsive collapse.
3. **After signature touches land**: scripted puppeteer interaction. Trigger shielded reveal (screenshot at T+0, T+200ms, T+500ms), trigger highlight-to-share via programmatic selection + snapshot the popover + click the copy button + verify clipboard contents, scroll to 50% and snapshot the progress bar width.

**Per session 1 lesson**: if any CSS bug is not solved in 2 edit attempts, dispatch puppeteer to inspect computed styles before attempt 3. Standing rule.

### 10d. Contrast verification

Three new color pairings to verify via math or Stark:

- Body text on card surface: `#E5E7EB` on `var(--bg-secondary)` → must be ≥7:1 AAA
- Eyebrow muted text on card surface: `rgba(229,231,235,0.55)` on `var(--bg-secondary)` → must be ≥4.5:1 AA
- Link cyan on body background: `var(--accent-secondary)` on `#13161a` → must be ≥4.5:1 AA

All three should pass given session 1's WCAG 2.2 pass, but re-verify during implementation.

### 10e. Build validation

`pnpm build` green with `onBrokenLinks: throw` intact. Any broken link in the blog redesign fails the build. Primary safety net.

---

## 11. Future backlog

Organized by theme with intent markers so future sessions know what's waiting vs killed.

**Intent key**:
- **[v2]** - deferred to a future push, likely within this docs overhaul arc
- **[later]** - lower priority, no committed timeline
- **[owned elsewhere]** - another track or team member owns it
- **[killed]** - explicitly decided against; do not resurrect without Wayne's go

### 11a. Discovery features (revisit at 30+ posts)

- **Blog-scoped search input** - **[v2]** - client-side fuzzy match over titles + descriptions + category. Revisit around 40 posts.
- **Load-more / pagination** - **[v2]** - currently renders everything inline. Revisit when listing scroll gets painful.
- **`/blog/archive` flat list page** - **[v2]** - chronological text-only archive. Useful SEO landing.
- **Category index pages** (`/blog/research/`) - **[later]** - only build if a specific category becomes a dedicated SEO target.
- **Tag cloud / tag index pages** - **[killed]** - we use categories not tags. `tags` frontmatter stays dormant for forward compat.
- **"Most popular" / "Top essays" heuristics** - **[later]** - needs analytics integration.
- **Author index carousel / featured author** - **[killed]** - not relevant for single-company blog.

### 11b. Engagement features (intentionally skipped)

- **Newsletter subscribe form** - **[v2]** - requires ESP choice first. Inline at article footer + publication header. No popups.
- **Newsletter popup / modal** - **[killed]** - trust-destroyer.
- **Related-posts sidebar rail on listing** - **[killed]** - competes with archive tail.
- **Claps / reactions** - **[killed]** - not Silhouette's voice.
- **Comments** - **[killed]** - moderation burden, wrong audience (crypto-Twitter is the discussion layer).
- **Social share counts** - **[killed]** - vanity metric.
- **Mid-article CTA** - **[killed]** - breaks reading flow.

### 11c. Reading experience quality ceiling (v2)

- **Tufte-style sidenotes** - **[v2]** - 4-8h build. Right-margin sidenotes ≥1280px, collapsed footnotes mobile. Highest-value v2 signature touch.
- **Drop caps on research posts** - **[later]** - editorial flourish, restricted to long-form research essays.
- **Scroll-triggered reveals on body paragraphs** - **[killed]** - competes with shielded reveal at mount.
- **Sentence-highlighting following scroll** - **[killed]** - competes with reading flow.
- **Cursor-following radial gradient background** - **[later]** - Vercel/Linear signature. Noise-to-signal borderline.
- **Reading mode toggle** - **[killed]** - base surface already optimized.
- **"About to read for ~7 minutes" modal** - **[killed]** - eyebrow reading time is enough.
- **Highlight-to-share on mobile** - **[later]** - currently relies on native share sheet. Revisit if inadequate.

### 11d. Content and frontmatter passes

- **Real description frontmatter pass** - **[v2]** - 150-char hand-written SEO descriptions across docs + blog. Already on session 2 backlog.
- **Legacy post MEV rewrite** - **[killed]** - Wayne's 2026-04-09 call. Legacy stays.
- **Legacy post reattribution** - **[later]** - only if Wayne wants specific posts bylined to named authors.
- **`blog/` → `content/blog/` file move** - **[killed]** - Docusaurus expects posts at `blog/`.
- **`blog/images/` per-post subdirectories** - **[later]** - low priority until 40+ posts.
- **Image optimization pass** - **[later]** - compress + WebP + `srcset`.

### 11e. Author and attribution

- **Author profile pages** (`/blog/authors/wayne`) - **[later]** - flip `page: false` to `true` in `authors.yml` when there's a "meet the team" story.
- **Additional authors** (Jason, Chandler, Stent, Rory, Ciaran) - **[as needed]** - add when their first post ships.

### 11f. Series and editorial

- **Second series beyond `silhouette-primer`** - **[as needed]** - system supports multiple series out of the box.
- **Migration of legacy posts into a series** - **[killed]** - legacy posts are independent.
- **Series completion tracker** (localStorage, shows ✓ on read posts) - **[later]** - delightful if the series gets traction.
- **Series-specific landing page** (`/blog/series/silhouette-primer`) - **[v2]** - dedicated page per series with hand-written intro.

### 11g. Structured data and SEO

- **Blog post JSON-LD** (`BlogPosting` schema) - **[v2]** - per-post `headTags` via swizzle. Currently the blog routes are excluded from the `@stackql` structured-data plugin.
- **Schema markup pass on non-API pages** - **[v2]** - session 2 backlog item.
- **AI SEO audit of live state** - **[v2]** - session 2 backlog item.

### 11h. Phase 4 distribution (owned elsewhere)

- **MCP server deployment** (`silhouette-exchange/docs-mcp`) - **[owned elsewhere]** - half-done Python repo, needs deployment + `context7` listing.
- **Wikipedia draft** - **[owned elsewhere]** - Jerri owns per project memory.
- **Messari / DeFiLlama / CoinGecko / CMC listings** - **[owned elsewhere]** - distribution track.
- **X announcement of rebuilt docs + blog** - **[later]** - after visual sign-off.

### 11i. Notion CMS

- **Full Notion-to-docs sync pipeline** - **[killed]** - Wayne's 2026-04-09 call. Claude Code manual push instead.
- **Notion CRM integration** - **[unchanged]** - different DB, different token, not part of docs overhaul.

---

## 12. Build sequence

Each bullet is a task unit. "Trivial" runs controller-direct. "Subagent-dispatch" gets a full implementer task with the `feature-dev:feature-dev` or a general implementer subagent plus spec compliance review plus code quality review.

### Phase 0: plumbing (trivial, controller-direct)

1. Create `src/data/blog/categories.ts` with the 5-category registry
2. Create `src/data/blog/series.ts` with the Silhouette Series definition
3. Create `src/lib/blog/categories.ts` with helpers + tests
4. Create `src/lib/blog/series.ts` with helpers + tests
5. Create `src/lib/blog/readingTime.ts` with 200 WPM calculator + tests
6. Write a `prebuild` script that validates series frontmatter across `blog/**/*.md`

### Phase 1: legacy content migration (trivial, controller-direct)

7. Migrate 7 legacy posts: add `category` frontmatter, remove `tags: [article]`. One commit.
8. Fix `<!-- truncate -->` in `2026-02-04-shieldedspot.md`. Separate commit.
9. Extend `authors.yml` with `wayne` + `page: false`. Separate commit.
10. (Optional) Add `static/img/authors/wayne.jpg` if Wayne provides it.

### Phase 2: listing page components (subagent-dispatch, TDD)

11. `BlogPublicationHeader`
12. `BlogCategoryPills` - client-side filter, URL query param sync, keyboard nav (~8 tests)
13. `BlogCoverFallback` + `BlogCoverImage`
14. `BlogEyebrow`
15. `BlogByline` - avatar, initials fallback, multi-author cluster
16. `BlogPostCard` - alternating glow deterministic by slug hash
17. `BlogHero` - split layout ≥996px, stacked below
18. `BlogSeriesCard` - numbered step card
19. `BlogSeriesBand` - header + card grid + conditional render
20. `BlogLatestBand`
21. `BlogArchiveList`

Likely bundled into ~8 subagent tasks (small components paired, larger ones solo).

### Phase 3: listing page wiring (subagent-dispatch)

22. Swizzle `theme/BlogLayout/index.tsx` (wrap, removes sidebar slot)
23. Swizzle `theme/BlogListPage/index.tsx` (compose everything, handle filter state branching)
24. Swizzle `theme/BlogSidebar/index.tsx` (neuter)
25. **Puppeteer verification gate 1** (listing page)

### Phase 4: article page components (subagent-dispatch, TDD)

26. `BlogTOC` - right-rail sticky, IntersectionObserver active tracking
27. `BlogShareRow` - X / Copy / RSS with clipboard fallback
28. `BlogNextInSeries`
29. `BlogReadNext` - 1 big + 3 small
30. `BlogScrollProgress` - rAF-driven width
31. `BlogShieldedReveal` - stagger cap + sessionStorage flag
32. `BlogHighlightShare` - selection popover + scope check

~5 subagent tasks.

### Phase 5: article page wiring (subagent-dispatch)

33. Swizzle `theme/BlogPostPage/index.tsx` (wrap, mounts `BlogScrollProgress` + `BlogHighlightShare` + grid container + right-rail TOC slot)
34. Swizzle `theme/BlogPostItem/Header/` tree (4 files: Title, Info, Author, index)
35. Swizzle `theme/BlogPostItem/Footer/index.tsx` (wrap, adds `<CopyForLLMRow>` + sign-off + `<BlogNextInSeries>` + `<BlogReadNext>`)
36. Swizzle `theme/BlogPostItem/index.tsx` (eject, composes full article with `<BlogShieldedReveal>` wrapping body)
37. **Puppeteer verification gates 2 and 3** (article page + signature touches)

### Phase 6: final verification (trivial, controller-direct)

38. `pnpm test` - all ~143 tests green
39. Kill dev server, `pnpm build` green with `onBrokenLinks: throw`
40. Restart dev server, curl smoke test on `/blog`, `/blog?category=research`, one article URL
41. Visual review session with Wayne on local dev server
42. Commit this design doc (already done by the time Phase 6 runs, but confirm)
43. Write `2026-04-09-session-3-handoff.md` with what shipped

### Total task count

- Phase 0: 6 trivial tasks
- Phase 1: 3 trivial tasks
- Phase 2: ~8 subagent dispatches
- Phase 3: 1 subagent dispatch + 1 puppeteer gate
- Phase 4: ~5 subagent dispatches
- Phase 5: 1 subagent dispatch + 1 puppeteer gate
- Phase 6: 5 trivial tasks

**~30 tracked tasks, ~15 subagent dispatches, 3 puppeteer gates.** Roughly 1-2 focused working sessions.

---

## 13. Risks

Ordered by likelihood × impact.

### R1: Docusaurus blog swizzle breakage on minor version bump [HIGH × LOW]

**Risk**: several blog components are marked "unsafe" for ejection. Minor version bumps can break them.

**Mitigation**: pinned 3.9.2. No auto-bumps. Any future bump gets a throwaway test branch. Inline comment at top of each swizzle file documents the unsafe status.

### R2: Shielded reveal FOUC on slow connections [MEDIUM × LOW]

**Risk**: between SSR and hydration, the body could be fully visible (no blur) then blur out and decloak again on slow connections.

**Mitigation**: apply the initial blur state via inline CSS in the SSR HTML, not via JS-added class. SSR and hydrated first paint render identically. `@supports` or `<noscript>` fallback disables blur when JS is unavailable.

### R3: Highlight-to-share popover positioning across browsers [MEDIUM × LOW]

**Risk**: selection bounding rects differ across Safari / Chrome / Firefox, especially for cross-paragraph selections.

**Mitigation**: test on all three during puppeteer gate 3. Fall back to `endContainer` rect if the full Range rect is unusual. Min/max viewport clamp prevents off-screen rendering.

### R4: Series band horizontal scroll on touch devices [MEDIUM × MEDIUM]

**Risk**: `scroll-snap-type: x mandatory` behaves differently on Android Chrome vs iOS Safari. Momentum scrolling can jump awkwardly.

**Mitigation**: start with `scroll-snap-type: x proximity` (less aggressive), bump to `mandatory` only if testing shows it's worth it. Fallback: drop scroll-snap.

### R5: Series build validation timing [LOW × LOW]

**Risk**: build validator runs before Docusaurus loads post metadata.

**Mitigation**: validation runs as `prebuild` npm script reading `blog/**/*.md` directly via `gray-matter`. Independent of Docusaurus lifecycle.

### R6: Alternating glow inconsistency after filter [LOW × MEDIUM]

**Risk**: glow keyed on array index changes when the array gets filtered, causing cards to swap glow color.

**Mitigation**: key on post slug hash (`hash(slug) % 2`). Stable across filter changes. 3 lines of code.

### R7: Inter Display unavailable [LOW × LOW]

**Risk**: we reference `Inter Display` for titles but the Google Fonts stylesheet might not load it.

**Mitigation**: verify the font stack in `docusaurus.config.ts` headTags. If missing, either add it or drop "Display" and rely on Inter Variable. Decided at implementation time.

### R8: Copy for LLM row on blog posts [LOW × LOW]

**Risk**: existing `<CopyForLLMRow>` may assume doc-route context and not resolve blog `.md` paths.

**Mitigation**: check the component during Phase 5. If it needs extension, add a `path` prop defaulting to current route. Blog posts have `.md` alternates via session 1's routing.

### R9: Reading time inaccuracy on code-heavy posts [LOW × LOW]

**Risk**: 200 WPM overestimates reading time on posts with significant code.

**Mitigation**: 200 WPM is a coarse signal. Accept the minor inaccuracy. Code-subtracted calculation is v2.

---

## 14. Exit criteria

Binary. Either all pass or the push isn't done.

- [ ] All 5 categories represented in the filter pills
- [ ] 7 legacy posts each carry a `category` frontmatter, `tags: [article]` removed
- [ ] `2026-02-04-shieldedspot.md` has a `<!-- truncate -->` marker, no more build warning
- [ ] `wayne` in `authors.yml`, `silhouette-team` retained, both `page: false`
- [ ] `src/data/blog/{series,categories}.ts` + `src/lib/blog/{series,categories,readingTime}.ts` exist and are tested
- [ ] 19 new components under `src/components/blog/` each with co-located test, tests passing
- [ ] 6 swizzles under `src/theme/` (BlogListPage, BlogPostPage, BlogPostItem tree, BlogPostItems, BlogSidebar, BlogLayout)
- [ ] `/blog` renders publication header + category pills + hero + series band (empty state graceful if no series posts yet) + latest grid + archive tail
- [ ] Category pill filter works client-side, URL query param updates, active state reflects
- [ ] `/blog/slug` renders Plex Mono eyebrow + Inter Display title + dek + byline row + optional cover + body at 68ch with Inter 19px/1.7/450/`#E5E7EB`
- [ ] Right-rail TOC renders at ≥1280px on articles with ≥3 H2s
- [ ] Scroll progress bar renders at ≥768px
- [ ] Shielded text reveal runs on first article load, respects `prefers-reduced-motion`
- [ ] Highlight-to-share popover appears on 15+ char selection within article body (desktop only)
- [ ] `pnpm test` green with ~143 tests passing
- [ ] `pnpm build` green with `onBrokenLinks: throw` intact
- [ ] `curl http://localhost:3100/blog` + `/blog?category=research` + one article URL all return 200
- [ ] Puppeteer snapshots at 3 gates committed to `/tmp/puppeteer-debug/` for review
- [ ] No em dashes introduced anywhere (standing rule)
- [ ] No hardcoded hex outside `:root` in `custom.css` (standing rule)
- [ ] No new MEV claims introduced (legacy stays, new content uses correct language)
- [ ] No Orbitron outside display/eyebrow/nav contexts
- [ ] Branch stays `docs/overhaul-plan-2026-04-07`, zero pushes to origin without Wayne sign-off

After all boxes tick, visual review session with Wayne on the local dev server. After Wayne signs off, write `2026-04-09-session-3-handoff.md` and decide whether to open a PR or continue local-only.

---

## 15. Where this lives

This design doc is the decision record for the blog redesign push. It is committed to the branch so future sessions can read it instead of re-brainstorming. The companion implementation plan will be produced by the `superpowers:writing-plans` skill immediately after this doc is committed, and will live at `docs/plans/2026-04-09-blog-redesign-implementation.md`.

Project memory (`/Users/waynempro/.claude/projects/-Users-waynempro/memory/project_silhouette_docs_overhaul.md`) has been updated to note:
- Notion CMS is dropped
- Upcoming content lives in the Notion "Articles" DB (ID `322921f3-63a4-80c7-9cb9-e3859c0e6e6b`)
- Legacy blog posts stay as-is

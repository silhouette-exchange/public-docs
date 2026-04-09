---
title: Docs overhaul session 3 handoff
description: State, commit timeline, decisions, and pause point at the end of the third execution session of the docs overhaul. Phase 2 listing components shipped end-to-end, Mintlify-style heading cleanup landed, designer Vercel preview wired up, ready for Phase 3 listing page wiring.
---

# Docs overhaul - session 3 handoff

**Session date:** 2026-04-09
**Operator:** Claude Code (opus 4.6, 1M context) driven by Wayne
**Branch:** `docs/overhaul-plan-2026-04-07` (local + private remote, NOT pushed to public origin)
**State at session end:** 78+ commits ahead of `origin/main`, working tree clean apart from the optional .gitignore Vercel additions, build green, dev server running on `http://localhost:3100/`, designer preview live at `https://silhouette-docs-preview.vercel.app/`

## Session goal vs outcome

**Plan:** Continue from the Task 2.1 BlogPublicationHeader / Task 2.2 BlogCategoryPills state at the end of session 2 and ship as much of Phase 2 (blog redesign listing components) as possible, with visual review checkpoints along the way.

**Outcome:** All 12 Phase 2 listing components shipped, 4 plan-stub bugs caught and patched along the way, the global docs heading hierarchy was rewritten in a Mintlify-style restrained scale (Wayne flagged Orbitron overuse mid-session), a private GitHub repo + Vercel preview deployment was set up so Wayne's designer can review the work asynchronously, and the visual harness page at `/blog-preview` now mounts every Phase 2 component plus an end-to-end composition that approximates how the BlogListPage swizzle (Phase 3 Task 3.3) will assemble them on `/blog`.

The session did not start Phase 3. The next push picks up at Phase 3.1 (BlogLayout swizzle).

## Branch state at session close

- **Branch:** `docs/overhaul-plan-2026-04-07`
- **Head:** `83e0c5e` (BlogArchiveList) - note the next session will likely add a session-handoff commit on top of this
- **Commits ahead of origin/main:** 78+
- **Commits ahead of private/main:** 0 (caught up via the explicit push at the end of session 3)
- **Working tree:** clean apart from `.gitignore` (Vercel CLI added `.vercel` and `.env*.local` entries; left uncommitted pending Wayne's call) and `src/pages/blog-preview.tsx` (the harness page; will be committed in the same commit as this handoff doc)
- **Build:** green (`pnpm build` succeeds)
- **Dev server:** running on `http://localhost:3100/` (background task, will not survive reboot)
- **Test suite:** **150 passing across 17 files** (started session at 55, +95 over the session)
- **Designer preview:** live at `https://silhouette-docs-preview.vercel.app/`, wired to `wizzle93/silhouette-docs-preview` GitHub repo, builds via `silhouette-exchange/silhouette-docs-preview` Vercel project

## Commit timeline

Newest first.

### Phase 2 finale + plumbing

- `83e0c5e` feat(blog): add BlogArchiveList text-only archive tail **[Task 2.12]**
- `76931f8` feat(blog): add BlogLatestBand and fix BlogCoverFallback double-heading **[Task 2.11 + accessibility bug fix]**
- `f428fcb` feat(blog): add BlogSeriesBand conditional on filter and series posts **[Task 2.10]**
- `c934e89` feat(blog): add BlogSeriesCard with PART N OF M step indicator **[Task 2.9]**
- `0f3901f` feat(blog): add BlogHero featured card with split/stacked layout **[Task 2.8]**
- `157885c` feat(blog): add BlogPostCard with slug-hash-stable alternating glow **[Task 2.7 - subagent dispatch]**
- `3cc55cf` ci: trigger initial Vercel preview build **[empty commit to fire the auto-deploy webhook]**

### Mintlify-style heading cleanup

- `e1a8405` style(docs): strip Orbitron from H2-H6, switch to Mintlify-style scale **[5 file edits + the iterative size/weight tuning rounds]**

### Phase 2 atom components (BlogByline → BlogEyebrow → BlogCoverImage → BlogCoverFallback)

- `65e0d5e` feat(blog): add BlogByline with avatar cluster and initials fallback **[Task 2.6 - subagent dispatch]**
- `c01563c` docs(plans): patch BlogEyebrow plan stub timezone bug **[plan stub fix]**
- `ca86149` feat(blog): add BlogEyebrow Plex Mono metadata row with UTC date format **[Task 2.5]**
- `7d2a8b3` polish(blog): bump BlogCoverImage hover veil from 0.05 to 0.15 **[visual review feedback]**
- `29ad1a5` feat(blog): add BlogCoverImage with fallback delegation **[Task 2.4]**
- `45756bc` docs(plans): patch BlogPublicationHeader plan stub Orbitron trap **[plan stub fix]**
- `70091c7` polish(blog): apply BlogCoverFallback review nits + patch plan trap **[code review nits + plan stub fix]**
- `354423d` feat(blog): add BlogCoverFallback gradient card for coverless posts **[Task 2.3 - subagent dispatch with two-stage review]**
- `e830121` feat(blog): add BlogCategoryPills with keyboard nav and aria-pressed **[Task 2.2 - finished from session 2]**

(See `2026-04-08-session-2-handoff.md` for the prior 46 commits from session 2.)

## What landed this session

### Phase 2 listing components (12/12 ✅)

| Task | Component | Tests | Highlights |
|---|---|---|---|
| 2.1 | BlogPublicationHeader | (session 2) | H1 in Inter, post-fix Orbitron trap |
| 2.2 | BlogCategoryPills | 8 | Real semantic buttons, aria-pressed, arrow-key wraparound |
| 2.3 | BlogCoverFallback | 6 | Gradient card, "SILHOUETTE" wordmark in Orbitron, title in Inter |
| 2.4 | BlogCoverImage | 7 | Switch component: real img or fallback delegation |
| 2.5 | BlogEyebrow | 10 | Plex Mono metadata, UTC date pinning, throws on bad category |
| 2.6 | BlogByline | 9 | Multi-author cluster, initials onError fallback, two avatar sizes |
| 2.7 | BlogPostCard | 11 | First composition; slug-hash-stable alternating magenta/cyan glow |
| 2.8 | BlogHero | 12 | Split layout (60/40 ≥996px, stacked below); single magenta glow |
| 2.9 | BlogSeriesCard | 8 | "PART N OF M" indicator (legit Orbitron use), SR-only sequencing prefix |
| 2.10 | BlogSeriesBand | 9 | Conditional band (hides on filter or empty); responsive 4/3/scroll grid |
| 2.11 | BlogLatestBand | 8 | "LATEST" / category label; throws on unknown filter slug |
| 2.12 | BlogArchiveList | 7 | Text-only ul; per-row hover background brighten |

**Test count progression: 55 → 95 → 150 (started session at 55 from session 2's 13, ended at 150 across 17 test files).**

### Plan stub bug patches (4 caught and fixed)

The implementation plan at `docs/plans/2026-04-09-blog-redesign-implementation.md` was authored in one sitting and contained four bugs in the per-task stubs that bit live implementers. Each was caught during implementation and the plan was patched in-place so future re-runs do not re-introduce them.

| Plan trap | Where | How it fired | Plan patch commit |
|---|---|---|---|
| Orbitron on `.title` (BlogPublicationHeader) | Task 2.1 stub line 1324 | Force-uppercased "Silhouette Stories" into Orbitron caps; fixed post-commit in `088d2b6` (session 2) | `45756bc` |
| Orbitron on `.title` (BlogCoverFallback) | Task 2.3 stub line 1726 | Same trap; would have force-uppercased mixed-case post titles into Orbitron caps | `70091c7` |
| Timezone-mixed `formatDate` (BlogEyebrow) | Task 2.5 stub | `toLocaleDateString` (local TZ) mixed with `getUTCDate`/`getUTCFullYear`; "2026-04-01" in UTC-5 would render "MAR 01 2026" | `c01563c` |
| Orbitron on `<h3>` (BlogCoverFallback) | BlogCoverFallback Task 2.3 itself | The `<h3>` rendered the post title, and BlogPostCard ALSO renders the title in `<h2>`. When composed together, screen readers announced the title twice. Surfaced when BlogLatestBand tests queried by heading role. Fix: demote `<h3>` to `<div>`. | `76931f8` |

The fourth one is the most interesting because it was an emergent bug, not a stub copy-paste trap. BlogCoverFallback's tests in isolation (commit `354423d`) passed because they only tested the fallback in isolation. The double-heading only surfaced when BlogPostCard composed BlogCoverFallback inside its body AND a parent test queried by heading role. The fix is in `76931f8`: demote the cover fallback's title from `<h3>` to `<div>` (visual stays; the parent `role="img" aria-label={title}` already labels the whole card as one image, so the inner element does not need to be a heading).

### Mintlify-style heading cleanup (mid-session)

Wayne reviewed the live docs site mid-session and flagged that **Orbitron was overused across the heading hierarchy**, making the page read as "all loud, no hierarchy". The new rule is:

> In the H1-H6 hierarchy, Orbitron is reserved for H1 only (and only when H1 is all-caps). H2 through H6 use Inter. Non-heading Orbitron uses (eyebrow labels, band labels, navbar items, footer headings, wordmarks, single-character initials) remain valid.

This is now `feedback_orbitron_h1_only.md` in user memory.

The cleanup audit found 5 violations across 3 files:

1. `src/css/custom.css:198` `--ifm-heading-font-family` - global default (cascaded to all unstyled headings)
2. `src/css/custom.css` `.markdown h2` - explicit Orbitron + wide tracking
3. `src/css/custom.css` `.markdown h3` - same
4. `src/pages/index.module.css` `.roleTitleInner` - wrapped an `<h2>` and force-uppercased "Three doors. One shielded venue." into Orbitron caps
5. `src/components/RoleCard/styles.module.css` `.titleInner` - wrapped an `<h3>` and force-uppercased "Developers" / "Institutions" / "Traders"

All five were flipped to `var(--font-sans)` in commit `e1a8405`. Two further iterations followed Wayne's feedback after the first pass:
- "Inter looks too big and spaced and bold" → reduced H2 from `--fs-2xl` (28px) to `--fs-xl` (22px), dropped semibold to medium, dropped wide tracking, removed border-top + padding ornaments. Adopted slight negative letter-spacing (-0.01em) for the Mintlify feel.
- "Across the board feels big" → fixed an IFM token leak (`--ifm-h2-font-size` was still 28px so theme-level H2s outside `.markdown` were 28px while body H2s were 22px). Aligned the IFM tokens to the new scale.

The Hero `.headline` (homepage H1) and the H1 styling on docs pages keep Orbitron + uppercase + wide tracking. The brand voice still lives at H1.

### Designer Vercel preview deployment

Wayne wanted to share the docs hero page with a designer asynchronously. The setup:

- **Private GitHub repo:** `wizzle93/silhouette-docs-preview` (Wayne's personal account, deliberately separate from the public `silhouette-exchange/public-docs` so the in-flight branch is not exposed to the public infrastructure)
- **Vercel project:** `silhouette-exchange/silhouette-docs-preview` (under the silhouette-exchange Vercel team because the designer is on the team)
- **Stable preview URL:** `https://silhouette-docs-preview.vercel.app/`
- **Auto-deploy:** any push to `wizzle93/silhouette-docs-preview/main` triggers a Vercel build (~30-45s)

**Setup gotchas (for future reference):**

1. **First `vercel link` defaulted to the wrong scope.** It linked to `silhouette-exchange/silhouette-docs-preview` (the team scope, which turned out to be correct because the designer is on the team). I initially thought it was wrong and tried to delete the project, then Wayne clarified the designer is on the team. Re-linked with explicit `--scope silhouette-exchange`.
2. **`vercel deploy --prod --yes` failed** because Docusaurus' `showLastUpdateTime` shells out to `git log` per file, and `vercel deploy` from local uploads the working files WITHOUT `.git`. The build crashed with `fatal: not a git repository`. **The fix is to deploy via the GitHub webhook instead** - `vercel git connect <repo>` connects the project, then any push triggers a build that clones the repo with full git history. We seeded the first auto-build with an empty commit (`3cc55cf`).
3. **`.gitignore` got Vercel-augmented** with `.vercel` and `.env*.local` entries by `vercel link`. Both are sensible additions but they are currently uncommitted and need Wayne's call on whether to commit them.
4. **Stable URL is publicly accessible (HTTP 200), deployment-specific URLs are gated by Vercel team auth (HTTP 401).** The designer can hit the stable URL without logging in. If Wayne wants to lock the stable URL down too, Vercel password protection or "team-only access" can be enabled.

To push updates to the preview going forward:
```
git push private HEAD:main
```

### Visual harness page (`/blog-preview`)

The dev-only diagnostic page at `src/pages/blog-preview.tsx` now has 16 sections covering every Phase 2 component plus an end-to-end composition that approximates how `BlogListPage` (Task 3.3) will compose them on the real `/blog` route. The page is reachable at `http://localhost:3100/blog-preview` (and at `https://silhouette-docs-preview.vercel.app/blog-preview` after the next push lands).

Note: the file has a `DELETE BEFORE MERGE TO MAIN` comment at the top. The deletion only applies to merging into the public `silhouette-exchange/public-docs` repo. It is fine for it to live on the private preview repo for as long as the designer is reviewing the work.

## Architecture decisions recorded this session

### `BlogPostLike` is the canonical slim post shape

The codebase has TWO `BlogPostLike` interfaces:
1. **Slim presentation shape** at `src/components/blog/BlogPostCard/index.tsx` - exported and consumed by every component (BlogPostCard, BlogHero, BlogSeriesCard, BlogSeriesBand, BlogLatestBand, BlogArchiveList).
2. **Docusaurus-compatible shape** at `src/lib/blog/series.ts` - has `metadata.frontMatter.*` nested structure. Used by the lib helpers (`getSeriesPosts`, `getSeriesNavigation`, `validateSeriesFrontmatter`).

The slim shape is the source of truth for component data. The Docusaurus shape is for the lib helpers. **The Phase 3 BlogListPage swizzle (Task 3.3) is the adapter layer** that converts Docusaurus-shaped posts into the slim shape before passing them to components.

The slim shape grew TWO new optional fields this session as components needed them:
- `authorImageUrl?: string` - added when BlogHero needed to show a 32px avatar in its byline footer (`0f3901f`). BlogPostCard ignores it (its slim footer has no avatar per spec 4g).
- `series?: string` and `seriesOrder?: number` - added when BlogSeriesBand needed to filter and sort by series without importing the lib helper (`f428fcb`). Keeps the band decoupled from the Docusaurus shape.

### Hand-rolled eyebrow / footer pattern (vs reusing BlogEyebrow / BlogByline)

Both BlogPostCard (`157885c`) and BlogHero (`0f3901f`) hand-roll their own eyebrow row inline rather than reusing `<BlogEyebrow>`. The reason: BlogEyebrow requires a `date` prop and always renders it, but the §4g (post card) and §4e (hero) specs both put the date in the footer, not the eyebrow. Reusing BlogEyebrow would mean either passing the date and hiding it via CSS (ugly) or duplicating it (confusing). Hand-rolling uses the same Plex Mono / 11px / uppercase / wide-tracking typographic recipe but slims to category + reading time.

BlogHero hand-rolls its footer too - the `HeroAvatar` child component duplicates BlogByline's `AuthorAvatar` pattern (~25 lines, useState + useEffect onError reset). Documented in the component comment that this duplication is intentional and a future refactor could extract a shared `<BlogAvatar>` primitive if a third consumer surfaces. For now: two consumers, two inlinings, the cost of inlining is lower than the cost of designing a shared primitive that bridges two slightly different shapes.

### Slug-hash-stable alternating glow (BlogPostCard)

BlogPostCard's hover glow alternates magenta/cyan **deterministically by slug hash** (`hash(slug) % 2 === 0 ? magenta : cyan`), not by array index. The point is **stability across filter changes**: if the listing array reorders (category filter applied, search filter applied, pagination), each post's glow color must NOT flicker. Keying on the slug (which never changes) instead of the index (which changes constantly) achieves this. The hash function is a tiny djb2-style helper inlined into `BlogPostCard/index.tsx`. The test pins two slugs (`post-a` hash 356150873 odd → cyan, `post-b` hash 356150874 even → magenta) with documented hash values so a future refactor can verify the same parity.

### Subagent dispatch vs controller-direct

This session continued the subagent vs controller-direct decision pattern from session 2. **Two big tasks were dispatched to opus 4.6 subagents:**

- Task 2.6 BlogByline (most complex atom: multi-author cluster + initials onError fallback + two avatar sizes; spec-only stub so design freedom is high)
- Task 2.7 BlogPostCard (first composition component, full plan-stub code, complex enough to benefit from independent verification)

**The remaining tasks (2.4, 2.5, 2.8, 2.9, 2.10, 2.11, 2.12) ran controller-direct** because the pattern was locked in by the third component and the subagent overhead was no longer earning its keep. Controller-direct uses the same TDD discipline (failing test → implement → green) but skips the dispatch + report cycle.

**Subagent feedback for future runs:** the subagents could not run `git add` / `git commit` directly because of sandbox permission denials. I committed on their behalf after verifying the test count and reading their reports. The pattern works fine but the subagent prompts should anticipate that they may not be able to close the loop themselves.

### Test cadence calibration

Wayne flagged on 2026-04-09 that I was running `pnpm test` after every micro-edit (CSS polish, single-file tweak). Now logged as `feedback_test_run_frequency.md`: **one full-suite run per logical unit of work**, not after every Edit. CSS-only / single-file polish edits batch and run once at the end. TDD red→green still uses the standard cadence (failing test, then passing test). Don't apologize for the reduced cadence; the signal is in the diffs, not the test output.

## Testing infrastructure (carry over)

- **17 test files**, 150 passing, 0 failing, 0 skipped at session close
- All component tests live next to their components: `src/components/blog/<Name>/<Name>.test.tsx`
- vitest config at `vitest.config.ts` with Docusaurus module mocks at `src/test/mocks/{Link,router,BrowserOnly}.tsx`
- Run scoped: `pnpm test src/components/blog/BlogPostCard`
- Run full suite: `pnpm test`
- Run with UI: `pnpm test:ui`
- Cross-timezone verification (used during BlogEyebrow): `TZ=America/Chicago pnpm test src/components/blog/BlogEyebrow`

## Memory entries added this session

Three new feedback entries written to `~/.claude/projects/-Users-waynempro/memory/`:

- `feedback_orbitron_h1_only.md` - Orbitron is reserved for H1 only in the heading hierarchy. H2-H6 use Inter. Non-heading Orbitron uses still valid.
- `feedback_test_run_frequency.md` - One test run per logical unit of work, not after every micro-edit.
- `feedback_subagent_git_safety.md` (carried over from session 2, applied to every dispatch this session) - every subagent prompt explicitly forbids git stash / checkout / reset / clean / branch ops / worktrees / push.

`MEMORY.md` index updated to reference the new entries.

## What's next: Phase 3 - listing page wiring

The components are all built. Phase 3 wires them onto the real `/blog` route by swizzling Docusaurus' default blog theme.

**4 tasks in Phase 3** (per `docs/plans/2026-04-09-blog-redesign-implementation.md`):

| Task | What it builds | Notes |
|---|---|---|
| 3.1 | Swizzle `theme/BlogLayout/index.tsx` (wrap, disable sidebar) | Foundation: removes the default sidebar, gives the listing full width |
| 3.2 | Swizzle `theme/BlogSidebar/index.tsx` (neuter) | Renders nothing; Docusaurus calls it but it returns null |
| 3.3 | Swizzle `theme/BlogListPage/index.tsx` (compose listing components) | **The big one.** Adapts Docusaurus posts to slim BlogPostLike, manages activeFilter via URL query param, composes BlogPublicationHeader + BlogCategoryPills + BlogHero + BlogSeriesBand + BlogLatestBand + BlogArchiveList |
| 3.4 | Puppeteer verification gate 1 (listing page screenshots) | Visual verification that the swizzle composes everything correctly |

**Task 3.3 is the highest-leverage task in Phase 3.** It is where all 12 components stop being abstract building blocks and become a real page on the real `/blog` route. This is also where the URL query param sync for category filtering lives, and where the Docusaurus → slim BlogPostLike adapter logic gets implemented.

After Phase 3, **Phase 4** is article-page components (BlogTOC, BlogShareRow, BlogNextInSeries, BlogReadNext, BlogScrollProgress, BlogShieldedReveal, BlogHighlightShare) and **Phase 5** is article-page wiring (more swizzles).

## Known follow-ups (not blocking)

- **Final description frontmatter pass.** Real 150-char SEO descriptions across docs and blog posts (deferred from Phase 1).
- **AI SEO audit** of the live state once everything is wired.
- **20 manual baseline queries** for the AI visibility baseline (Phase 1 Task 18 leftover).
- **Heimdall team review** of the paused API content tasks (Phase 2 Group A Tasks 9-18).
- **Wikipedia draft** (Phase 4 of the original plan, owned by Jerri).
- **Real blog content** from Wayne's team. The 24 articles in the Notion "Articles" DB (URL: `https://www.notion.so/322921f363a480c79cb9e3859c0e6e6b`) need to be migrated to the public-docs blog folder once the Phase 3 wiring lands. Wayne's team is finalising the authors and graphics.
- **`.gitignore` Vercel additions.** Currently uncommitted. Wayne's call whether to commit the `.vercel` + `.env*.local` lines added by `vercel link`.
- **`src/pages/blog-preview.tsx`.** The diagnostic page is committed in this session's final commit (alongside this handoff doc) so the designer can review components in isolation. Per the file header comment, it should be deleted before any merge to the public `silhouette-exchange/public-docs` main.
- **TODO sweep for `--accent-secondary-alpha-20` token.** Three components (BlogCoverFallback, BlogByline, BlogHero) use `rgba(0, 255, 242, 0.20)` raw with an inline TODO comment. If the design system later adds a cyan-alpha token, all three should be flipped at once.

## How to resume

### Verify state
```bash
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
git status                              # should be clean
git branch --show-current               # docs/overhaul-plan-2026-04-07
git log --oneline origin/main..HEAD | wc -l   # should be 80+ depending on the final session-3 commit
git log --oneline private/main..HEAD | wc -l   # should be 0 (or 1 if the handoff commit has not been pushed)
pnpm test                               # should be 150+ passing
```

### Start dev server
```bash
pnpm start --no-open --port 3100
```

### Check the designer preview
```
https://silhouette-docs-preview.vercel.app/
https://silhouette-docs-preview.vercel.app/blog-preview
```

### Read the new plan files
1. `docs/plans/2026-04-09-session-3-handoff.md` - **this document**
2. `docs/plans/2026-04-08-session-2-handoff.md` - prior session
3. `docs/plans/2026-04-07-session-1-handoff.md` - earlier still
4. `docs/plans/2026-04-09-blog-redesign-design.md` - design doc (the reference)
5. `docs/plans/2026-04-09-blog-redesign-implementation.md` - blog redesign plan, Phase 3 onwards is the active plan
6. `docs/plans/2026-04-07-silhouette-docs-overhaul-design.md` - master design doc (Notion CMS section is dropped)

### Hard rules (carry over)

1. Stay on `docs/overhaul-plan-2026-04-07`. Do not switch branches. Do not push to `origin` (the public repo) without explicit Wayne sign-off.
2. Push to `private` (the designer preview) is pre-authorised. Use `git push private HEAD:main`.
3. Never claim MEV protection. Use strategy leakage / copytrade exposure / signaling risk / adverse selection.
4. No em dashes anywhere. Regular hyphens only.
5. No light mode. Dark only, `#13161a` base.
6. **Orbitron is H1 only among headings.** H2-H6 use Inter. Other Orbitron uses (eyebrow labels, band labels, navbar, footer, wordmarks, single-letter initials, single-line all-caps step indicators) remain valid.
7. All colors / fonts / spacing reference tokens in `:root`. Raw rgba is allowed with inline comments where no semantic token exists.
8. Always invoke `frontend-design` for UI work (per Wayne's standing feedback). For larger UI questions also invoke `ui-ux-pro-max`.
9. If a CSS bug is not solved in 2 attempts, dispatch puppeteer before attempt 3.
10. Never run `pnpm build` while the dev server is running. Kill the server first.
11. New components, hooks, lib functions ship with vitest unit tests in the same commit.
12. **One test run per logical unit of work**, not after every Edit. Batch CSS-only and single-file polish edits.
13. For trivial tasks move fast (controller-direct). For meaty tasks dispatch a subagent. The cutoff is roughly: composition components or anything involving runtime logic with state → consider subagent; pure styling polish → controller-direct.
14. Subagent prompts MUST explicitly list forbidden git commands (stash, checkout, reset, clean, branch ops, worktrees, push, remote ops). The list is in `feedback_subagent_git_safety.md`.

### Where things live (additions from this session)

| Need | Location |
|---|---|
| All Phase 2 listing components | `src/components/blog/<Name>/` |
| Slim post shape (canonical) | `src/components/blog/BlogPostCard/index.tsx` exports `BlogPostLike` |
| Docusaurus-shaped post helpers | `src/lib/blog/series.ts`, `src/lib/blog/categories.ts`, `src/lib/blog/readingTime.ts` |
| Category registry | `src/data/blog/categories.ts` |
| Series definitions | `src/data/blog/series.ts` |
| Visual harness page | `src/pages/blog-preview.tsx` (DELETE BEFORE PUBLIC MERGE) |
| Designer Vercel project link state | `.vercel/project.json` (gitignored) |
| Private remote | `git remote -v` shows `private` → `wizzle93/silhouette-docs-preview` |
| Push to designer preview | `git push private HEAD:main` |
| Designer preview URL | `https://silhouette-docs-preview.vercel.app/` |

### First action on resume

The natural next move is **Task 3.1 (BlogLayout swizzle)**. This is a small foundational task: create `src/theme/BlogLayout/index.tsx` that wraps the default Docusaurus BlogLayout, removes the sidebar slot, and lets the listing render full width. Should be ~15 minutes controller-direct. After that, Task 3.2 (BlogSidebar neuter) is even smaller. Then Task 3.3 (BlogListPage swizzle) is the meaty composition piece.

If Wayne wants visual feedback before Task 3.3, the existing `/blog-preview` page already shows the end-to-end composition; Task 3.3 just moves that composition onto the real `/blog` route with real Docusaurus post data.

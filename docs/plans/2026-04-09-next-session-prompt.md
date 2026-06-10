---
title: Next session prompt - blog redesign + Notion CMS push
description: Copy-paste this into a fresh Claude Code session to resume the docs overhaul. The Group A foundation is done; the next push is blog redesign (Medium/Substack feel) plus the Notion CMS pipeline.
---

# Next session prompt

Copy the entire block below into a fresh `claude` session.

---

I'm resuming work on the Silhouette docs overhaul. Two prior sessions have already shipped Phase 1, Phase 1.5, and the Phase 2 Group A foundation. The most recent session (2026-04-08) wrapped up the Scalar API explorer + EndpointCard component + vitest infrastructure, then paused the API-content tasks pending Wayne's API-team colleague's review and pivoted toward Wayne's actual wheelhouse for this push: **blog redesign (Medium/Substack feel) + Notion CMS pipeline**.

The full session 2 handoff document is at `docs/plans/2026-04-08-session-2-handoff.md` - read it first before doing anything else. It contains the commit timeline, paused tasks, architectural decisions, the EndpointCard visual flags awaiting API team review, and the rationale for the pivot.

## Working directory and branch

```bash
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
```

Branch: `docs/overhaul-plan-2026-04-07`. Do NOT switch branches. Do NOT touch any other branch. Do NOT push to origin without my explicit sign-off - everything stays local until colleagues have reviewed the local dev server.

State you should expect:
- Working tree clean
- 47+ commits ahead of `origin/main`
- Head at `865edbe` (or later if I added cleanup commits between sessions)
- `pnpm build` green
- `pnpm test` 13 passing (3 smoke + 10 EndpointCard)

Verify with:
```bash
git status
git branch --show-current
git log --oneline origin/main..HEAD | wc -l
git log --oneline -5
pnpm test 2>&1 | tail -5
```

## Start the dev server

The server from the last session has died. Start a fresh one:

```bash
pnpm start --no-open --port 3100
```

If port 3100 is busy (SillySwap docs sometimes reclaim it), pick any free port. The site is locally reviewable at http://localhost:3100/.

**Important:** new plugin entries in `docusaurus.config.ts` require a full dev server restart, not just hot reload. Hot reload does not re-run plugin lifecycle hooks like `injectHtmlTags`. This bit us in session 2 with Scalar.

## Files to read before doing ANYTHING

In this order:

1. `docs/plans/2026-04-08-session-2-handoff.md` - **start here** - latest state, what's done, what's paused, what's next
2. `docs/plans/2026-04-07-session-1-handoff.md` - prior state from the end of Phase 1 + Phase 1.5
3. `docs/plans/2026-04-07-silhouette-docs-overhaul-design.md` - the original design doc, especially §9 Blog CMS - Notion pipeline (Phase 3)
4. `docs/plans/2026-04-07-docs-overhaul-phase-2-implementation.md` - Phase 2 scaffold (Group F changelog references the same Linear source we'll need)
5. `docs/plans/2026-04-08-phase-2-group-a-api-reference-implementation.md` - Group A plan (Tasks 9-18 are PAUSED, do NOT execute them this session)
6. `/Users/waynempro/.claude/projects/-Users-waynempro/memory/MEMORY.md` - my memory notes, especially the feedback entries

Then ask me what I want to work on. Don't start editing anything until I tell you.

## Hard rules (standing instructions, do not violate)

1. **Stay on `docs/overhaul-plan-2026-04-07`.** Do not switch branches. Do not push without explicit sign-off.
2. **API content tasks 9-18 in the Group A plan are PAUSED** pending API team review. Do not resume them this session unless I explicitly say so. The next push is blog/CMS, not API content.
3. **Never claim MEV protection.** Use strategy leakage / copytrade exposure / signaling risk / adverse selection.
4. **No em dashes anywhere.** Regular hyphens only.
5. **No light mode.** Dark only, `#13161a` base. (The blog redesign might need light-mode-ish reading surfaces because Medium/Substack are light - if so, check with me first. Default is dark.)
6. **Orbitron is ALL CAPS only** with `--tracking-wider` or `--tracking-widest`. Mixed-case Orbitron looks like a CAPTCHA.
7. **All colors / fonts / spacing reference tokens** in `:root` of `src/css/custom.css`. No hardcoded `#hex` outside the token block. No hardcoded `'Inter'` font-family.
8. **Always invoke `frontend-design` AND `ui-ux-pro-max`** for UI work. Do not go solo on the chrome, components, or accessibility. This is a hard rule per Wayne's standing feedback in memory.
9. **If a CSS bug is not solved in 2 attempts, dispatch a puppeteer subagent** to inspect computed styles BEFORE attempting a third edit. Lesson from the chevron saga in session 1 and the Scalar `.scalar-card` cascade in session 2: ground truth beats cascade reasoning every time.
10. **Never run `pnpm build` or `pnpm clear` while the dev server is running.** Kill the dev server first. Running them concurrently deletes the `.docusaurus/` directory that the dev server holds, crashing it.
11. **New components, hooks, lib functions, and API clients ship with vitest unit tests in the same commit.** The test infrastructure is wired (vitest 4.1.3 + @testing-library/react + jsdom) - just write the test alongside the component. No "tests later." See `feedback_unit_tests_required.md` in memory.
12. **Trivial tasks move fast, big tasks use the full subagent loop.** Trivial = single-line edits, package installs, simple file moves; do directly with controller-side verification. Big = component builds, content rewrites, infrastructure setup; dispatch implementer subagent + spec compliance reviewer + code quality reviewer.
13. **Do not create files beyond what the task requires.** No speculative abstractions, no helper utilities, no README additions unless I explicitly ask.

## What's done vs pending (high level)

### Done (do not redo)

- Phase 1 + Phase 1.5: visual shell, chrome rewrite, agentic findability stack (`/llms.txt`, `/llms-full.txt`, JSON-LD via @stackql, robots.txt with AI bot allow-list, per-page `.md` routing, Copy-for-LLM row swizzled into DocItem/Footer), two-tree IA (Docs + Guides), token system in `src/css/custom.css :root`, role-based home page, WCAG 2.2 AA contrast pass
- Phase 2 Group A foundation: Scalar `@scalar/docusaurus@0.8.6` installed/wired/themed at `/api/explorer` with multi-spec (v0+v1), sidebar entry, broken OpenAPI URL fixed, vitest infrastructure standing, EndpointCard component with 10 unit tests, AuthorByline removed from `/about-silhouette`, Node engine bumped, Scalar telemetry disabled, MDX plans-exclusion hotfix
- Production build green, 14 smoke-test URLs all 200, JSON-LD on every production HTML page

### Paused for API team review (do not resume this session)

Tasks 9-18 in `docs/plans/2026-04-08-phase-2-group-a-api-reference-implementation.md`:
- Task 9: LanguageTabs MDX component
- Task 10: RateLimit pill component
- Tasks 11-12: `/api/rate-limits` page
- Tasks 13-14: `/api/errors` page
- Tasks 15-16: `/api/websocket` page (or stub)
- Task 17: Refactor `## login` operation in `/api/reference` to use EndpointCard + LanguageTabs
- Task 18: TechArticle JSON-LD on API pages

These resume only when Wayne's colleague has reviewed the EndpointCard pattern + the Scalar explorer and given the go-ahead.

### Pending non-API work in the design doc and Phase 2 scaffold

- **Blog redesign + Notion CMS** (THIS PUSH - Medium/Substack feel for both discovery and reading)
- Real description frontmatter pass (Group K from Phase 2 scaffold)
- Schema markup pass on non-API pages (Group I from Phase 2 scaffold)
- AI SEO audit of the live state
- Voice pass on existing hero pages (Group B from Phase 2 scaffold) - some non-API pages
- New concept stub pages (Group C - the 8 Core Concepts) - content rewrites
- Vale linting (Group L)
- Phase 4 distribution: Wikipedia draft (owned by Jerri), MCP server deployment (the existing `silhouette-exchange/docs-mcp` Python repo is already half of this)

## Likely first task this session

**Brainstorm the blog redesign + Notion CMS scope.** Wayne flagged in session 2 that the current blog reads "horrible" both as a collection (article discovery + sorting) and as a reading experience. He wants Medium / Substack feel.

Use the **`superpowers:brainstorming` skill** to walk through:
- What's wrong with the current blog (visit http://localhost:3100/blog and inspect)
- Reference points: Medium and Substack patterns (cards, featured post, tags, search/filter on the listing; reading time, large typography, generous whitespace, side-rail TOC, share affordances on the article page)
- Whether the redesign should go light mode for the article reading surface (Wayne's call - default is dark)
- The Notion CMS piece: schema, sync direction, GitHub Action cadence, Vale linting in the sync workflow, hand-migration of the 6 existing posts
- Whether this is one push or splits into "blog redesign first, CMS second"

After brainstorming, use the **`superpowers:writing-plans` skill** to write a bite-sized implementation plan and save it to `docs/plans/2026-04-09-blog-redesign-and-notion-cms-implementation.md` (or whatever date the session lands on).

## Useful context references

- **Linear project for changelog source:** https://linear.app/silhouette-exchange/project/webapp-for-open-beta-359904d73b95/updates - Sydney (product lead) writes project updates here. Filter on "pushed to production" for the public changelog. Exclude security entries unless explicitly allow-listed. Monthly cron cadence.
- **Existing MCP server repo:** https://github.com/silhouette-exchange/docs-mcp - Python MCP server that already indexes `public-docs/docs/**`, `blog/**`, `static/llms.txt`. Phase 4 distribution Task "MCP server" is half-done. Just needs deployment + context7 listing. Lives next to `public-docs` as a sibling directory.
- **Existing blog state:** the blog uses default Docusaurus blog theme. There's at least one existing post at `blog/2026-02-04-shieldedspot.md` (build warns it has no truncation marker, which is a small fix). The Phase 3 plan in §9 of the design doc references "6 existing posts" to migrate.
- **Team roles:** Sydney = product lead (Linear updates source). Jerri = marketing lead (Wikipedia draft owner). Other team in `project_silhouette_team.md` memory entry.

## Skills you should use this session

- `superpowers:brainstorming` - mandatory for the blog redesign scope discussion
- `superpowers:writing-plans` - for the implementation plan after brainstorming
- `superpowers:executing-plans` OR `superpowers:subagent-driven-development` - for executing the plan
- `frontend-design` AND `ui-ux-pro-max` - mandatory for any UI work (per memory feedback)
- `copywriting` - for any blog post content rewrites if needed
- `seo-audit` or `ai-seo` - if reviewing agentic findability gaps
- `marketing-psychology` or `content-strategy` - if shaping the blog discovery / featured post strategy
- Puppeteer via Bash subagent - for ground-truth CSS debugging when hot reload is misleading

## Where things live

The session 1 handoff has the canonical "where things live" table. Session 2 added:

| I need to... | Look in... |
|---|---|
| Run unit tests | `pnpm test` (vitest), `pnpm test:watch`, `pnpm test:ui` |
| Add a new component test | `src/components/<Name>/<Name>.test.tsx` next to the component |
| Test config | `vitest.config.ts` (repo root), `vitest.setup.ts` |
| Docusaurus module mocks for tests | `src/test/mocks/` (Link.tsx, router.ts, BrowserOnly.tsx) |
| Change Scalar plugin config | `docusaurus.config.ts` plugins array |
| Override Scalar's CSS variables | `src/css/custom.css` bottom section (~lines 1824-1945) - DO NOT modify the `:root` block |
| Exclude routes from structured-data | `themeConfig.structuredData.excludedRoutes` in `docusaurus.config.ts` |
| Exclude files from docs route | `docs.exclude` in the preset config in `docusaurus.config.ts` |
| Blog page layout | `blog/` directory + Docusaurus blog plugin defaults (we'll likely swizzle `@theme/BlogListPage` and `@theme/BlogPostPage` for the redesign) |

Start by reading the session 2 handoff. Then ask me what I want to work on. Don't assume.

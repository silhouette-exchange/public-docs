---
title: Docs overhaul session 2 handoff
description: State, commit timeline, decisions, and pause point after the second execution session of the docs overhaul (Phase 2 Group A foundation + cleanup, with API content tasks deferred for API team review).
---

# Docs overhaul - session 2 handoff

**Session date:** 2026-04-08
**Operator:** Claude Code (opus 4.6, 1M context) driven by Wayne
**Branch:** `docs/overhaul-plan-2026-04-07` (local only, nothing pushed)
**State at session end:** 46+ commits ahead of `origin/main`, clean working tree, build green, dev server running on `http://localhost:3100/`

## Session goal vs outcome

**Plan:** Execute Phase 2 Group A (API reference + Scalar interactive explorer + 3 new components + 3 new supporting pages + JSON-LD pass).

**Outcome:** The Group A foundation landed cleanly: Scalar plugin installed, wired, themed; sidebar entry added; broken OpenAPI URL fixed; vitest infrastructure stood up; first MDX component (EndpointCard) shipped with 10 unit tests passing. Then Wayne made a strategic call partway through Task 9 to **pause the API content tasks** (LanguageTabs, RateLimit, /api/rate-limits, /api/errors, /api/websocket, login refactor, TechArticle JSON-LD on API pages) until his colleague who owns the API has reviewed the foundation. The next session pivots to Wayne's wheelhouse: **blog redesign + Notion CMS**, plus deepening agentic SEO and real description frontmatter pass.

Three small cleanup tasks shipped at the end of the session: AuthorByline removal from `/about-silhouette` (per the new "blogs and guides only" rule), Node engine bump to >=22 (matching @scalar/docusaurus), and Scalar telemetry disable (privacy default for the docs site).

## Branch state at session close

- **Branch:** `docs/overhaul-plan-2026-04-07`
- **Head:** `6272652` (or later if final-build verification adds more commits)
- **Commits ahead of origin/main:** 46
- **Working tree:** clean
- **Build:** green (`pnpm build` succeeds with `onBrokenLinks: throw` intact)
- **Dev server:** running (background task, will not survive reboot)
- **Nothing pushed to origin.** All work local per Wayne's "stay local until team review" instruction.
- **vitest test suite:** 13 tests passing across 2 files (3 smoke tests + 10 EndpointCard tests)

## Commit timeline

Newest first.

### Cleanup commits (end of session)

- `6272652` feat(api): disable Scalar telemetry on /api/explorer **[Task 23.6]**
- `7c16567` chore(deps): bump engines.node to >=22 to match @scalar/docusaurus **[Task 23.5]**
- `086db74` refactor(content): remove AuthorByline from about-silhouette intro **[Task 19]**

### Group A foundation (Tasks 1-8 plus the MDX blocker fix)

- `f189a26` feat(components): add EndpointCard MDX component with unit tests **[Task 8 - 10 tests, frontend-design skill applied]**
- `eefa80d` feat(test): wire vitest + testing-library + jsdom for component unit tests **[Task 6.5]**
- `b89b9da` fix(api): correct OpenAPI spec URL to /v0/openapi.json and link to explorer **[Task 6]**
- `b0317cc` feat(api): link Scalar explorer in the API sidebar **[Task 5]**
- `d798f5f` feat(api): theme Scalar explorer with Silhouette dark tokens **[Task 4 - frontend-design + ui-ux-pro-max]**
- `a6531b8` fix(docs): exclude plans/** from docs route to prevent MDX parse errors **[hotfix discovered during Task 4]**
- `e5d8c6d` feat(api): wire @scalar/docusaurus at /api/explorer with v0+v1 multi-spec **[Task 3]**
- `0775b68` feat(api): install @scalar/docusaurus for interactive OpenAPI explorer **[Task 2]**

### Plan amendments (early session)

- `69c7012` docs(plans): amend group a tasks 8/9/10 to include unit tests (TDD)
- `d9de9c6` docs(plans): amend group a plan with milestone 3.5 (vitest infrastructure)
- `a4b00b1` docs(plans): phase 2 group a expanded implementation plan

(See `2026-04-07-session-1-handoff.md` for the prior 32 commits from session 1.)

## What landed this session

### Foundation (kept, ready to use)

- **`@scalar/docusaurus@0.8.6`** installed as devDependency
- **Scalar plugin wired** in `docusaurus.config.ts` at `/api/explorer` with multi-spec config: `v0` (current, default) and `v1` (next), Scalar's CDN bundle loaded via `injectHtmlTags`, telemetry disabled
- **Scalar themed** with full Silhouette token mapping in `src/css/custom.css` lines ~1824-1945. Three sections: main token map on `.scalar-app`/`.scalar-api-reference`/`.scalar-card.dark-mode`, sidebar layer override on `.t-doc__sidebar`, status palette re-declaration on `.scalar-card` (necessary because Scalar's CDN bundle redefines `--scalar-color-green/blue/red/...` at the card scope and blocks our `.scalar-app` map from cascading). All values via tokens, all contrast values verified AAA against `--bg-base`.
- **Sidebar entry** for `/api/explorer` between `/api/reference` and `/api/troubleshooting` (link-type entry, not a doc)
- **Broken OpenAPI URL fixed** in `docs/10-api/05-openapi.md`: replaced 4 occurrences of the design doc's wrong URL `/swagger/v0/json` (which 404s) with the actual blessed URL `/v0/openapi.json`. Added a tip callout linking to `/api/explorer`.
- **vitest infrastructure** wired: `vitest@4.1.3` + `@vitest/ui` + `@testing-library/react@16.3.2` + `@testing-library/jest-dom@6.9.1` + `jsdom@29.0.2` + `@vitejs/plugin-react@6.0.1`. `vitest.config.ts` at repo root with Docusaurus module aliases (`@docusaurus/Link`, `@docusaurus/router`, `@docusaurus/BrowserOnly` mocked at `src/test/mocks/`). `vitest.setup.ts` with jest-dom + cleanup hook. Smoke test at `src/components/__smoke__/smoke.test.tsx` with 3 passing tests. Test scripts: `pnpm test`, `pnpm test:watch`, `pnpm test:ui`. Build verified green with the new infra in place.
- **EndpointCard component** at `src/components/EndpointCard/index.tsx` (155 lines) + `styles.module.css` (211 lines) + `EndpointCard.test.tsx` (65 lines). Token-driven horizontal strip for introducing API operations on `/api/reference`. Method pill colour mapping (POST=magenta, GET=cyan, PUT/PATCH=amber, DELETE=red). Bearer/none auth indicator. Optional 1-line description. Try-it link defaulting to `/api/explorer`. 10 unit tests passing covering operation render, default POST, method override, colour class mapping, bearer/unauth indicator, description, default and override `tryUrl`, accessible Try-it name. Stable `data-testid` attributes for testability. Registered in `src/theme/MDXComponents.tsx`. Visually verified via puppeteer with screenshot at `/tmp/puppeteer-debug/endpointcard-verify.png`.

### Hotfix (mid-session)

- **`docs/plans/**` excluded from docs route.** Discovered when the Task 4 implementer's puppeteer verification revealed Docusaurus was trying to parse the plan files as MDX and choking on nested fenced code blocks containing JSX (the `<LanguageTabs>` example I'd added in Amendment 2). The fix was a one-line `exclude: ['plans/**']` in the docs preset config. Plans were already excluded from sitemap (`ignorePatterns`) and llms.txt (`excludeRoutes`) - this completes the exclusion intent at the docs route level.

### Cleanup tasks (end of session)

- **AuthorByline removed** from `docs/01-about-silhouette.md`. Per the 2026-04-08 decision, AuthorByline only ships on blog posts and guides going forward, not on docs reference pages. Component itself stays registered in `MDXComponents.tsx` for blog/guides usage. `grep` confirmed no other usages remain in `docs/` or `guides/`.
- **`engines.node` bumped** from `>=18.0` to `>=22.0` in `package.json`. `@scalar/docusaurus@0.8.6` declares `engines.node >=22` (transitively `@scalar/helpers`, `@scalar/types`, `type-fest@5` all want `>=20` or `>=22`). Repo manifest now matches reality. Wayne's local env is Node 25.2.1 so this is purely metadata. Flagged by the Task 2 code quality reviewer.
- **Scalar telemetry disabled.** Added `telemetry: false` to the `configuration` block in `docusaurus.config.ts`. By default Scalar phones home on every page load, which is the wrong default for a privacy-focused exchange's docs site. Flagged by the Task 3 code quality reviewer.

## Architecture decisions recorded this session

### API reference deviation (signed off 2026-04-08)

The Phase 2 scaffold said "render Scalar at `/api/reference`, retire the hand-written `03-reference.md` (with a 301 redirect)". Discovery showed the Silhouette API is a **discriminated-union single-endpoint design** (`POST /v0` with 24 operations selected via the body's `operation` field, declared in OpenAPI 3.1 via `oneOf` + `discriminator`). Scalar can render this but the result is ONE endpoint page with a "select operation" dropdown rather than 24 deep-linkable per-operation URLs. The hand-written `03-reference.md` has 24 anchor-linkable headings (`#login`, `#createOrder`, `#getBalances`...), each with parameters, examples, and error responses. That's better for humans, better for SEO, better for AI citation surfaces.

**Decision: keep `03-reference.md` at `/api/reference`. Add Scalar at a new route `/api/explorer` as a supplementary interactive playground.** Both views serve different jobs and link to each other.

### OpenAPI URL correction

The design doc and Phase 2 scaffold both used `https://api.silhouette.exchange/swagger/v0/json` as the canonical OpenAPI spec URL. **That URL returns 404.** The actual blessed URLs (verified against the live swagger UI initializer at `api.silhouette.exchange/swagger`) are:
- `https://api.silhouette.exchange/v0/openapi.json` - 54KB, 24 operations, current canonical (set as Scalar default)
- `https://api.silhouette.exchange/v1/openapi.json` - 1.3KB, nascent (only `/v1` service info + `/v1/ws` health check exposed today)

Scalar is configured as multi-spec with both, so v1 fills out over time without a docs-side change.

### Why Docusaurus dev server needs full restart for new plugins

Hot reload picks up content changes but does NOT re-run plugin lifecycle hooks (like `injectHtmlTags`) when a new plugin is added at runtime. Discovered during Task 4 visual verification when Scalar's CDN script tag was missing from the SSR HTML even though Task 3 had wired the plugin. Symptom: `/api/explorer` returns 200 with the route wrapper class `plugin-@scalar/docusaurus` in the React tree, but no Scalar UI mounts because the standalone bundle was never injected. Fix: kill the dev server and `pnpm start` fresh. Document for future plugin additions.

### Test infrastructure rule (effective 2026-04-08)

Per Wayne's new feedback rule (`feedback_unit_tests_required.md`), every new hook, lib function, API client, and non-trivial component ships with vitest unit tests in the same commit. Applies across all Wayne's projects, including this docs repo. The vitest infrastructure landed in Task 6.5 specifically to enable this rule for the upcoming components.

### Subagent-driven development with high-effort filter

- **Big tasks** (component builds, infrastructure setup) get the full subagent loop: implementer subagent → spec compliance reviewer → code quality reviewer → mark complete. Opus 4.6 on every subagent.
- **Trivial tasks** (single-line edits, package installs, sidebar entries, file moves) execute directly in the controller with controller-side verification.
- This balance kept the session moving without sacrificing rigor on the meaningful work.

## Pause point: API content tasks deferred

Wayne's call (2026-04-08): the API content tasks are NOT in his wheelhouse and should be reviewed by his colleague who owns the API before the work proceeds. The foundation can stand alone for now. The next push focuses on Wayne's actual domain (blog redesign, Notion CMS, agentic SEO deepening, real description frontmatter pass).

### Tasks paused (resume after API team review)

**Tasks 9-18 in `docs/plans/2026-04-08-phase-2-group-a-api-reference-implementation.md`:**

| Task | What it builds | Why it needs API team |
|---|---|---|
| Task 9 | LanguageTabs MDX component (cURL/Python/TypeScript code example tabs) with 8 unit tests | The code examples need to reflect the API team's actual SDK shape. Wayne shouldn't be writing Python SDK call signatures alone. |
| Task 10 | RateLimit pill component with 9 unit tests | Visual primitive only, but used exclusively on the rate-limits page (Task 12). |
| Task 11 | Decide rate-limit data source | Rate-limit numbers come from Heimdall config, Notion, or the API team. Wayne can't fabricate them. |
| Task 12 | Write `/api/rate-limits` page | Depends on real numbers from Task 11. |
| Task 13 | Extract error codes from spec + troubleshooting | API team should bless the error code list before it ships as a public reference. |
| Task 14 | Write `/api/errors` page | Depends on Task 13. |
| Task 15 | Determine WebSocket API status | Need API team to confirm whether v1 WS is shippable, in dev, or not coming. |
| Task 16 | Write `/api/websocket` page (or stub) | Depends on Task 15. |
| Task 17 | Refactor `## login` operation in `/api/reference` to use EndpointCard + LanguageTabs | API team should bless the new pattern before we apply it to a production page that they own the content for. |
| Task 18 | Add TechArticle JSON-LD to API page frontmatter | Light touch, but waiting for the rest to land first makes more sense than doing it in isolation. |

### Tasks complete after the wrap-up

- Task 1: Pre-flight verification ✅
- Task 2: Install @scalar/docusaurus ✅
- Task 3: Wire Scalar plugin ✅
- Task 4: Theme Scalar with Silhouette tokens ✅
- Task 5: Sidebar entry ✅
- Task 6: Fix broken OpenAPI URL ✅
- Task 6.5: Wire vitest infrastructure ✅
- Task 7: Brainstorm EndpointCard ✅
- Task 8: EndpointCard component with tests ✅
- Task 19: Remove AuthorByline from about-silhouette ✅
- Task 23.5: Bump engines.node ✅
- Task 23.6: Disable Scalar telemetry ✅
- Tasks 20-22: Final build + smoke tests + view-source verification ✅ (run during this wrap-up)
- Task 23: Group A completion report - **this document is the report**

## Visual review notes for the API team

The EndpointCard component has two minor stylistic flags the implementer surfaced during the visual review and Wayne hasn't yet decided on. Both are 1-line changes if the API team wants them adjusted:

1. **Auth indicator microcopy.** Currently renders `PUBLIC` (uppercased via CSS) instead of literal `none` or `-`. The implementer thought "public" was more informative microcopy. Tests check for "not matching `/bearer|jwt/i`" which both options satisfy.
2. **Method pill style.** Currently uses transparent background with `1px solid currentColor` outline for density. Alternative: filled with translucent tint via a new `--accent-*-bg`-style token. Both render correctly, the choice is purely aesthetic.

Resume from Task 9 after the API team has weighed in.

## Known follow-ups (not blocking)

- **20 manual baseline queries** for the AI visibility baseline (deferred from Phase 1 Task 18). Wayne owes ZipTie signup + Google Sheet + the manual run. Not blocking any current work.
- **Heimdall team conversations** for Tasks 11 (rate-limit data) and Tasks 13/15 (error codes + WS status). These are the API team's input that unblocks the paused tasks.
- **Wikipedia draft** (Phase 4, owned by Jerri).
- **MCP server deployment** - the existing `silhouette-exchange/docs-mcp` Python repo (discovered this session) is a working MCP server that indexes `public-docs/docs/**`. Phase 4 distribution Task "MCP server" is half-done. Just needs deployment + listing in context7.

## Next push: blog redesign + Notion CMS

Wayne's call: the blog page reads "horrible" both as a collection (article discovery + sorting) and as a reading experience. He wants Medium / Substack feel. Combined with the Phase 3 Notion CMS pipeline that lets the non-technical team publish without touching code, this is the highest-leverage non-API work left in the docs overhaul.

Proposed scope for the next push:
1. **Blog redesign** - replace the default Docusaurus blog theme with a Medium / Substack inspired layout. Both the listing page (article cards, tags, search/filter, featured posts) and the article reading view (typography, reading time, author byline, related posts, share affordances).
2. **Notion CMS pipeline** - the Phase 3 plan from `docs/plans/2026-04-07-silhouette-docs-overhaul-design.md` §9. Notion DB schema, sync script, GitHub Action, hand-migrate the 6 existing posts.
3. **Real description frontmatter pass** - replace stub descriptions with hand-written 150-char SEO-optimized descriptions across the docs and existing blog posts.
4. **Schema markup pass** on non-API pages (concept stubs, guides, blog posts).
5. **AI SEO audit** of the live state to find what's still missing for AI citation.

The blog redesign + Notion CMS is the headline. Brainstorming pass should kick off the next session.

## How to resume

### Verify state
```bash
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
git status                              # should be clean
git branch --show-current               # docs/overhaul-plan-2026-04-07
git log --oneline origin/main..HEAD | wc -l   # should be 46+ depending on final wrap-up commits
pnpm test                               # should be 13 passing
```

### Start dev server
```bash
pnpm start --no-open --port 3100
```

### Read the new plan files
1. `docs/plans/2026-04-08-session-2-handoff.md` - **this document**
2. `docs/plans/2026-04-08-phase-2-group-a-api-reference-implementation.md` - the Group A plan, Tasks 9-18 paused
3. The yet-to-be-written brainstorm + implementation plan for the blog redesign + Notion CMS push

### Hard rules (carry over)

1. Stay on `docs/overhaul-plan-2026-04-07`. Do not switch branches. Do not push without explicit sign-off.
2. Never claim MEV protection. Use strategy leakage / copytrade exposure / signaling risk / adverse selection.
3. No em dashes anywhere. Regular hyphens only.
4. No light mode. Dark only, `#13161a` base.
5. Orbitron is ALL CAPS only with wide tracking.
6. All colors / fonts / spacing reference tokens in `:root`. No hardcoded `#hex` outside the token block.
7. Always invoke `frontend-design` AND `ui-ux-pro-max` for UI work.
8. If a CSS bug is not solved in 2 attempts, dispatch puppeteer before attempt 3.
9. Never run `pnpm build` while the dev server is running. Kill the server first.
10. New components, hooks, lib functions, API clients ship with vitest unit tests in the same commit.
11. For trivial tasks move fast (direct execution). For meaty tasks use the full subagent loop with two-stage review.
12. New plugin entries in `docusaurus.config.ts` require a full dev server restart (hot reload does not re-run plugin lifecycle hooks).

### Where things live

The session 1 handoff (`2026-04-07-session-1-handoff.md`) has the canonical "where things live" table. Additions from this session:

| Need | Location |
|---|---|
| Run unit tests | `pnpm test` (vitest), `pnpm test:watch`, `pnpm test:ui` |
| Test config | `vitest.config.ts` (repo root) |
| Test setup hooks | `vitest.setup.ts` (repo root) |
| Docusaurus module mocks for tests | `src/test/mocks/` (Link.tsx, router.ts, BrowserOnly.tsx) |
| Add a new component test | `src/components/<Name>/<Name>.test.tsx` next to the component |
| Scalar plugin config | `docusaurus.config.ts` plugins array, immediately after `@stackql/docusaurus-plugin-structured-data` |
| Scalar CSS variable overrides | `src/css/custom.css` bottom section (~lines 1824-1945) - DO NOT modify the `:root` block |
| EndpointCard component | `src/components/EndpointCard/` |
| Exclude routes from structured-data plugin | `themeConfig.structuredData.excludedRoutes` in `docusaurus.config.ts` |
| Exclude files from docs route | `docs.exclude` in the preset config in `docusaurus.config.ts` |

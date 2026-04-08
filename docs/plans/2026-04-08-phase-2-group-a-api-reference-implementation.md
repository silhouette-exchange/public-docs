---
title: Phase 2 Group A - API Reference Implementation Plan
description: Bite-sized task plan to ship the interactive Scalar OpenAPI explorer, the EndpointCard / LanguageTabs / RateLimit components, and the new API reference pages without retiring the hand-written reference.
---

# Phase 2 Group A - API Reference Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. REQUIRED SUB-SKILL: Use superpowers:brainstorming + frontend-design BEFORE building any of the three new MDX components (EndpointCard, LanguageTabs, RateLimit).

**Goal:** Ship an interactive Scalar OpenAPI explorer for v0 and v1, three new MDX components (EndpointCard, LanguageTabs, RateLimit pill), three new supporting pages (rate-limits, errors, websocket), TechArticle JSON-LD on every API page, and surgical fixes to the broken OpenAPI URL and the AuthorByline cleanup. Keep the hand-written `03-reference.md` because the API is a discriminated-union single-endpoint design that Scalar cannot deep-link per operation.

**Architecture:** Add Scalar at a NEW route (`/api/explorer`) so the existing per-operation `#anchors` in `03-reference.md` survive for humans and SEO. The Scalar route is the machine-readable interactive playground; the hand-written reference is the human-friendly per-operation lookup. Both link to each other.

**Tech Stack:** Docusaurus 3.9.2, `@scalar/docusaurus` (new dep), existing `@stackql/docusaurus-plugin-structured-data` for JSON-LD, existing `@docusaurus/theme-common` for Tabs, token-driven CSS in `src/css/custom.css`.

**Branch:** `docs/overhaul-plan-2026-04-07` - DO NOT switch branches, DO NOT push.

---

## Deviations from the Phase 2 scaffold (Wayne sign-off required before execution)

The Phase 2 scaffold (`docs/plans/2026-04-07-docs-overhaul-phase-2-implementation.md`) lists Group A as 11 bullets that assumed the API was RESTful. Discovery on 2026-04-08 found that the Silhouette API is a discriminated-union single-endpoint design (`POST /v0` with 24 operations selected via the body's `operation` field, declared in OpenAPI 3.1 via `oneOf` + `discriminator`). This changes 3 things:

| Phase 2 scaffold said | This plan does | Why |
|---|---|---|
| Render Scalar at `/docs/api/reference` | Render Scalar at NEW route `/api/explorer` | The slug `/api/reference` already serves the hand-written per-operation page with `#anchors`. Replacing it would break links and lose SEO depth. |
| Retire `docs/10-api/03-reference.md` (keep a 301) | Keep it. Link bidirectionally to `/api/explorer`. | Scalar shows ONE endpoint with a discriminator dropdown - no deep links per operation. The hand-written page has 24 deep-linkable anchors. They serve different jobs. |
| Point at `https://api.silhouette.exchange/swagger/v0/json` | Point at `https://api.silhouette.exchange/v0/openapi.json` AND `/v1/openapi.json` (multi-spec, version tabs) | The scaffold URL was wrong - it 404s. The real URLs are `/v0/openapi.json` and `/v1/openapi.json`. |

Everything else from the Group A scaffold is preserved.

**Wayne: please skim the table above and confirm before execution starts.** This is a real architectural call, not a trivial path change.

---

## Pre-flight state (verify before Task 1)

- Branch: `docs/overhaul-plan-2026-04-07`
- HEAD: at or after `8c16b17` (handoff commit) with the post-handoff cleanup of `CopyPageButton` / `DocItem/Layout` / `Navbar` already applied
- Working tree: clean
- Dev server: running on `http://localhost:3100/`
- `pnpm build`: green at last verification (pre-Task 1, do not re-run while dev server is up)

---

## Task list

### Milestone 1 - Pre-flight verification

#### Task 1: Verify branch state and dev server

**Step 1:** Run `git status` - expect "nothing to commit, working tree clean"
**Step 2:** Run `git branch --show-current` - expect `docs/overhaul-plan-2026-04-07`
**Step 3:** Run `git log --oneline -1` - expect `8c16b17` or a later local commit with no `(HEAD -> main)` markers
**Step 4:** Run `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/` - expect `200`
**Step 5:** Run `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/api` - expect `200` (current API index page)

If any check fails, STOP and report. Do not proceed.

---

### Milestone 2 - Install and wire Scalar

#### Task 2: Install `@scalar/docusaurus`

**Files:**
- Modify: `package.json` (devDependencies)
- Modify: `pnpm-lock.yaml` (auto)

**Step 1:** Run `pnpm add -D @scalar/docusaurus`
**Step 2:** Verify the version landed: `cat package.json | grep '@scalar/docusaurus'` - expect a version line
**Step 3:** Wait for hot reload OR if dev server crashed, restart it: `pnpm start --no-open --port 3100`
**Step 4:** Commit:
```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(api): install @scalar/docusaurus for interactive OpenAPI explorer"
```

#### Task 3: Wire Scalar plugin in `docusaurus.config.ts`

**Files:**
- Modify: `docusaurus.config.ts` (add to `plugins` array)

**Step 1:** Add the plugin entry inside the `plugins` array, right after the `@stackql/docusaurus-plugin-structured-data` entry. Use this exact config:

```ts
[
  '@scalar/docusaurus',
  {
    label: 'API Explorer',
    route: '/api/explorer',
    showNavLink: false, // we add it to the docs sidebar instead
    configuration: {
      sources: [
        {
          url: 'https://api.silhouette.exchange/v0/openapi.json',
          title: 'v0 (current)',
          slug: 'v0',
          default: true,
        },
        {
          url: 'https://api.silhouette.exchange/v1/openapi.json',
          title: 'v1 (next)',
          slug: 'v1',
        },
      ],
      darkMode: true,
      hideClientButton: false,
      hideDarkModeToggle: true,
      theme: 'none', // we override CSS variables in custom.css
      layout: 'modern',
      hiddenClients: ['c', 'clojure', 'http', 'ocaml', 'powershell', 'objc', 'r'],
      defaultHttpClient: {
        targetKey: 'shell',
        clientKey: 'curl',
      },
    },
  },
],
```

**Step 2:** Save. Hot reload will pick it up. If it crashes, restart dev server.
**Step 3:** Verify: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/api/explorer` - expect `200`
**Step 4:** Open `http://localhost:3100/api/explorer` in browser, confirm the explorer renders, check that the v0/v1 version selector appears, confirm the `POST /v0` endpoint with 24 operations shows under the discriminator selector.
**Step 5:** Commit:
```bash
git add docusaurus.config.ts
git commit -m "feat(api): wire @scalar/docusaurus at /api/explorer with v0+v1 multi-spec"
```

#### Task 4: Theme Scalar to match Silhouette dark tokens

**Files:**
- Modify: `src/css/custom.css` (add a new section at the bottom, AFTER existing chrome rules)

**Step 1:** Inspect Scalar's exposed CSS variables in dev server: `curl -s http://localhost:3100/api/explorer | grep -o '\-\-scalar-[a-z-]*' | sort -u | head -50`

**Step 2:** Append a new section to `src/css/custom.css` (DO NOT modify the `:root` block - put this AFTER the chrome rules):

```css
/* ============================================================
 * Scalar API Explorer theming
 * Maps Scalar's CSS variables to Silhouette tokens.
 * Updated 2026-04-08 for Phase 2 Group A.
 * ============================================================ */
.scalar-app,
.scalar-api-reference,
[data-theme='dark'] .scalar-app,
[data-theme='dark'] .scalar-api-reference {
  --scalar-color-1: var(--text-primary);
  --scalar-color-2: var(--text-muted);
  --scalar-color-3: var(--text-tertiary);
  --scalar-color-accent: var(--accent-secondary);
  --scalar-background-1: var(--bg-base);
  --scalar-background-2: var(--bg-surface);
  --scalar-background-3: var(--bg-elevated);
  --scalar-background-accent: var(--accent-primary);
  --scalar-border-color: var(--border-default);
  --scalar-button-1: var(--accent-secondary);
  --scalar-button-1-color: var(--bg-base);
  --scalar-button-1-hover: var(--accent-primary);
  --scalar-radius: var(--radius-md);
  --scalar-radius-lg: var(--radius-lg);
  --scalar-radius-xl: var(--radius-xl);
  --scalar-font: var(--font-sans);
  --scalar-font-code: var(--font-mono);
}

/* Scalar's body wrapper sometimes overrides our base background */
.scalar-app {
  background: var(--bg-base) !important;
}
```

**Step 3:** Save. Hot reload. Visit `http://localhost:3100/api/explorer`. Verify:
- Background matches `#13161a` base
- Text colors match the rest of the docs
- Cyan accent appears on links and buttons
- No light backgrounds anywhere
- IBM Plex Mono on code blocks

**Step 4:** If any of the above is wrong, dispatch a puppeteer subagent to read computed styles. Do NOT make a third blind CSS edit.

**Step 5:** Commit:
```bash
git add src/css/custom.css
git commit -m "feat(api): theme Scalar explorer with Silhouette dark tokens"
```

#### Task 5: Add `/api/explorer` to the sidebar

**Files:**
- Modify: `sidebars.ts` (the API category's `items` array)

**Step 1:** Insert `'api/explorer'` in the API category between `'api/reference'` and `'api/troubleshooting'`. The category becomes:

```ts
{
  type: 'category',
  label: 'API',
  collapsed: true,
  items: [
    'api/index',
    'api/quick-start',
    'api/authentication',
    'api/reference',
    { type: 'link', label: 'Interactive Explorer', href: '/api/explorer' },
    'api/rate-limits',
    'api/errors',
    'api/websocket',
    'api/troubleshooting',
    'api/openapi',
  ],
},
```

Note: `api/explorer` is rendered by the Scalar plugin (NOT a `.md` file), so it's added as a `link` type, not a `doc` type. The other three new entries (`rate-limits`, `errors`, `websocket`) ARE markdown files we'll create in later tasks; if they don't exist yet at the moment of save, the build will fail. So save this AFTER the new pages exist (i.e. after Tasks 14, 15, 16). For now, only add the explorer link.

**Step 1 (revised):** Insert ONLY the explorer link. The category becomes:

```ts
{
  type: 'category',
  label: 'API',
  collapsed: true,
  items: [
    'api/index',
    'api/quick-start',
    'api/authentication',
    'api/reference',
    { type: 'link', label: 'Interactive Explorer', href: '/api/explorer' },
    'api/troubleshooting',
    'api/openapi',
  ],
},
```

**Step 2:** Save. Hot reload. Verify the sidebar shows "Interactive Explorer" entry under API.
**Step 3:** Commit:
```bash
git add sidebars.ts
git commit -m "feat(api): link Scalar explorer in the API sidebar"
```

---

### Milestone 3 - Fix the broken OpenAPI URL

#### Task 6: Update `docs/10-api/05-openapi.md` to use the correct spec URL

**Files:**
- Modify: `docs/10-api/05-openapi.md`

**Step 1:** Replace every occurrence of `https://api.silhouette.exchange/swagger/v0/json` with `https://api.silhouette.exchange/v0/openapi.json`. There are 4 occurrences (the inline code block, the typescript-axios example, the python example, the docker swagger-ui example).

**Step 2:** Add a callout near the top pointing users to the new explorer:

```mdx
:::tip Interactive explorer
Prefer to click around instead of generating a client? The full API is rendered live at [/api/explorer](/api/explorer) - no setup, no install, no auth needed for read-only endpoints.
:::
```

**Step 3:** Verify by curling the doc page: `curl -s http://localhost:3100/api/openapi | grep -o 'v0/openapi.json' | head -1` - expect a match.
**Step 4:** Verify the broken URL is gone: `curl -s http://localhost:3100/api/openapi | grep -c 'swagger/v0/json'` - expect `0`.
**Step 5:** Commit:
```bash
git add docs/10-api/05-openapi.md
git commit -m "fix(api): correct OpenAPI spec URL to /v0/openapi.json and link to /api/explorer"
```

---

### Milestone 4 - Build the EndpointCard MDX component

> **REQUIRED SUB-SKILL:** Before Task 7, invoke `superpowers:brainstorming` to align on what an EndpointCard should communicate. Then `frontend-design` for the actual implementation.

#### Task 7: Brainstorm EndpointCard purpose and shape

**Action:** Invoke `superpowers:brainstorming` skill with this prompt:

> EndpointCard is an MDX component used to introduce a single API operation in a hand-written reference page. It needs to show: the operation name (e.g. `createOrder`), HTTP method (always POST for v0), path (always `/v0`), auth requirement (none / bearer JWT), the body discriminator value (e.g. `"operation": "createOrder"`), and a 1-line description. It should also include a "Try in explorer" link to the Scalar page anchored at the relevant operation. Goal: dense, scannable, brand-on, dark-themed, token-driven CSS, accessible. Used 24 times on `/api/reference`. Should look like a status badge + monospace identifier strip - NOT a giant marketing card.

Capture the output as a short spec. Decide: is this a single horizontal strip, or a multi-row block? Does it have a hover state? Where does the "Try in explorer" CTA go?

#### Task 8: Build the EndpointCard component

> **REQUIRED SUB-SKILL:** Invoke `frontend-design` for this task with the brainstorm output as context.

**Files:**
- Create: `src/components/EndpointCard/index.tsx`
- Create: `src/components/EndpointCard/styles.module.css`

**Step 1:** Implementation must:
- Use TypeScript
- Use the project's existing token system (no hardcoded colors / fonts)
- Accept props: `operation: string`, `method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'` (default `POST`), `path?: string` (default `/v0`), `auth?: 'none' | 'bearer'`, `description?: string`, `tryUrl?: string`
- Render the operation name in IBM Plex Mono with `--text-primary`
- Render the method as a colored pill (POST = magenta, GET = cyan, PUT = amber, DELETE = red)
- Render the auth state as a small icon + label (lock icon for bearer, dash for none)
- Render `Try it →` link aligned right that opens `/api/explorer` (or the `tryUrl` prop if provided)
- Be accessible: button-like elements have `aria-label`, focus ring uses `--accent-secondary`
- Be visually dense - max ~50px tall

**Step 2:** Register in `src/theme/MDXComponents.tsx`:
```tsx
import EndpointCard from '@site/src/components/EndpointCard';
// ...
const MDXComponents = {
  // ...existing
  EndpointCard,
};
```

**Step 3:** Save and let dev server reload.
**Step 4:** Test by adding `<EndpointCard operation="login" auth="none" description="Authenticate via SIWE and obtain a JWT" />` at the top of `docs/10-api/03-reference.md` (just temporarily, above the existing `## login` heading, so we can see what it looks like rendered).
**Step 5:** Visit `http://localhost:3100/api/reference#login` and visually verify.
**Step 6:** Remove the temporary instance from `03-reference.md` (we'll add real ones in Task 18).
**Step 7:** Commit:
```bash
git add src/components/EndpointCard src/theme/MDXComponents.tsx
git commit -m "feat(components): add EndpointCard MDX component for API reference operations"
```

---

### Milestone 5 - Build the LanguageTabs MDX component

#### Task 9: Build LanguageTabs

> **REQUIRED SUB-SKILL:** `frontend-design` (lighter touch - this is a thin wrapper around Docusaurus Tabs)

**Files:**
- Create: `src/components/LanguageTabs/index.tsx`
- Create: `src/components/LanguageTabs/styles.module.css`

**Step 1:** Implementation:
- Wraps `@theme/Tabs` and `@theme/TabItem` from `@docusaurus/theme-common`
- Children: cURL / Python / TypeScript code blocks
- Props: `defaultValue?: 'curl' | 'python' | 'typescript'` (default `curl`)
- Persists user's choice via `groupId="api-language"` so all tabs on the page sync
- Tab labels: cURL / Python (SDK) / TypeScript (community)

**Step 2:** Register in `src/theme/MDXComponents.tsx`:
```tsx
import LanguageTabs from '@site/src/components/LanguageTabs';
// ...
LanguageTabs,
```

**Step 3:** Verify by adding to `docs/10-api/03-reference.md` temporarily under `## login`:

```mdx
<LanguageTabs>
  <CurlBlock>
    ```bash
    curl https://api.silhouette.exchange/v0 -H "Content-Type: application/json" -d '{"operation":"login",...}'
    ```
  </CurlBlock>
  <PythonBlock>
    ```python
    from silhouette import Client
    client = Client.login_with_siwe(...)
    ```
  </PythonBlock>
  <TypeScriptBlock>
    ```typescript
    const client = await silhouette.loginWithSiwe(...)
    ```
  </TypeScriptBlock>
</LanguageTabs>
```

NOTE: You may simplify the API. The point is the consumer writes 3 code blocks and gets language-tabbed output. Pick the cleanest API.

**Step 4:** Visit `http://localhost:3100/api/reference#login`, verify all three tabs render and the persistence works (switching to Python on one tab should persist to other LanguageTabs on the same page).
**Step 5:** Remove the temporary block from `03-reference.md`.
**Step 6:** Commit:
```bash
git add src/components/LanguageTabs src/theme/MDXComponents.tsx
git commit -m "feat(components): add LanguageTabs MDX component for cURL/Python/TS API examples"
```

---

### Milestone 6 - Build the RateLimit pill

#### Task 10: Build RateLimit component

> **REQUIRED SUB-SKILL:** `frontend-design` (small and visual)

**Files:**
- Create: `src/components/RateLimit/index.tsx`
- Create: `src/components/RateLimit/styles.module.css`

**Step 1:** Implementation:
- Inline pill: `<RateLimit per="second" limit={10} />` renders as `10 req / sec`
- Accepts: `limit: number`, `per: 'second' | 'minute' | 'hour' | 'day'`, `tier?: 'public' | 'authenticated' | 'institutional'` (default `public`)
- Pill background varies by tier: public = `--bg-elevated`, authenticated = magenta tinted, institutional = lilac tinted
- Mono font, small (text size matching `--text-tertiary`)
- Accessible: includes a tooltip via `title` attribute explaining which tier this is for

**Step 2:** Register in `src/theme/MDXComponents.tsx`.

**Step 3:** Sanity-check render: add `<RateLimit per="second" limit={10} />` somewhere in `docs/10-api/index.md` temporarily, verify it renders inline.
**Step 4:** Remove the temporary instance.
**Step 5:** Commit:
```bash
git add src/components/RateLimit src/theme/MDXComponents.tsx
git commit -m "feat(components): add RateLimit pill component for API tier annotations"
```

---

### Milestone 7 - New supporting page: `/api/rate-limits`

#### Task 11: Decide rate-limit data source

**Action:** Before writing the page, you need real numbers. Three options:
1. The Heimdall config has them - check if any internal repo / Notion doc has the rate-limit table
2. Wayne sources them from the Heimdall team
3. Stub the page with `<ShieldedCallout type="warning" title="Rate limits coming soon">` and a placeholder structure

**Default if source not findable in 5 minutes:** Option 3 (stub). Mark a TODO so Wayne knows real numbers are needed before this page goes public-facing.

#### Task 12: Write `/api/rate-limits` page

**Files:**
- Create: `docs/10-api/06-rate-limits.md`

**Step 1:** Frontmatter:
```markdown
---
title: Rate Limits
sidebar_label: Rate Limits
slug: /api/rate-limits
description: "Silhouette API rate limits per tier. Public, authenticated, and institutional limits for both REST and WebSocket endpoints."
keywords:
  - Silhouette API
  - rate limits
  - API quotas
  - Hyperliquid API
  - throttling
---
```

**Step 2:** Body skeleton (use real data from Task 11 or stubs):

```mdx
:::warning
The Silhouette API and SDK are in beta. Rate limits may change as we tune capacity.
:::

## Overview

The Silhouette API enforces per-tier rate limits to protect the trading layer and keep the explorer responsive. Limits apply per IP for unauthenticated requests and per JWT for authenticated requests.

## Tiers

| Tier | How to qualify | Read limit | Write limit |
|---|---|---|---|
| Public | No authentication | <RateLimit per="second" limit={10} tier="public" /> | n/a |
| Authenticated | Bearer JWT (login operation) | <RateLimit per="second" limit={50} tier="authenticated" /> | <RateLimit per="second" limit={20} tier="authenticated" /> |
| Institutional | Contact the team | <RateLimit per="second" limit={500} tier="institutional" /> | <RateLimit per="second" limit={200} tier="institutional" /> |

:::info Need higher limits?
Reach out via [Telegram](https://t.me/silhouette_exchange) if you're a desk, market maker, or running a strategy that needs institutional capacity.
:::

## Headers

Every API response includes rate-limit headers so clients can throttle gracefully:

```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1712592000
```

When you exceed your limit, you'll receive a `429 Too Many Requests` response with a `Retry-After` header.

## Best practices

- Cache `getMarkets`, `getTokens`, and `getFees` responses on your client - these change rarely and count against your read budget
- Use the WebSocket subscription channels for live order book and fill updates instead of polling
- Implement exponential backoff on 429s - the `Retry-After` value is the minimum wait
```

**Step 3:** Verify: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/api/rate-limits` - expect `200`
**Step 4:** Visual check at `http://localhost:3100/api/rate-limits` - confirm the RateLimit pills render with tier-appropriate colors.
**Step 5:** Add the entry to `sidebars.ts` API category:
```ts
'api/rate-limits',
```
(Insert AFTER the explorer link, BEFORE `'api/troubleshooting'`)
**Step 6:** Commit:
```bash
git add docs/10-api/06-rate-limits.md sidebars.ts
git commit -m "feat(api): add /api/rate-limits page with tier table and best practices"
```

---

### Milestone 8 - New supporting page: `/api/errors`

#### Task 13: Extract error codes

**Action:** Build the source data for the page from three sources:
1. `docs/10-api/04-troubleshooting.md` - has `UNAUTHORIZED`, `INVALID_SIGNATURE`, `INVALID_INPUT` etc. inline in JSON examples
2. The OpenAPI v0 spec at `https://api.silhouette.exchange/v0/openapi.json` - check each operation's error responses
3. `docs/10-api/03-reference.md` - has more error examples per operation

**Quick extraction script:**
```bash
curl -s "https://api.silhouette.exchange/v0/openapi.json" | python3 -c "
import sys, json
d = json.load(sys.stdin)
schemas = d.get('components', {}).get('schemas', {})
codes = set()
def walk(node):
    if isinstance(node, dict):
        if node.get('description', '').startswith('Error code'):
            for v in node.get('enum', []):
                codes.add(v)
        for v in node.values():
            walk(v)
    elif isinstance(node, list):
        for v in node:
            walk(v)
walk(schemas)
for c in sorted(codes):
    print(c)
"
```

If the spec doesn't enumerate codes, scrape `04-troubleshooting.md` and `03-reference.md` for `\"code\": \"...\"` patterns.

#### Task 14: Write `/api/errors` page

**Files:**
- Create: `docs/10-api/07-errors.md`

**Step 1:** Frontmatter:
```markdown
---
title: Error Codes
sidebar_label: Error Codes
slug: /api/errors
description: "Complete error code reference for the Silhouette API. HTTP status codes, error code strings, causes, and resolution steps."
keywords:
  - Silhouette API
  - API errors
  - error codes
  - troubleshooting
  - Hyperliquid API
---
```

**Step 2:** Body structure:
- Intro paragraph explaining the error envelope (`{operation, error, code, details, responseMetadata}`)
- A table grouped by category (Auth / Input / State / Server) with columns: HTTP status, code string, when it happens, how to resolve
- A short JSON example of the error envelope
- A link to `/api/troubleshooting` for narrative-style debugging guides
- A link to `/api/explorer` to retry interactively

**Step 3:** Add to sidebar:
```ts
'api/errors',
```
(After `api/rate-limits`)

**Step 4:** Verify: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/api/errors` - expect `200`
**Step 5:** Commit:
```bash
git add docs/10-api/07-errors.md sidebars.ts
git commit -m "feat(api): add /api/errors page with full error code reference"
```

---

### Milestone 9 - New supporting page: `/api/websocket`

#### Task 15: Determine if a WebSocket API exists

**Action:** Probe the API for WebSocket support:
```bash
curl -sI "https://api.silhouette.exchange/v0/ws" 2>&1 | head -3
curl -sI "https://api.silhouette.exchange/v1/ws" 2>&1 | head -3
curl -s "https://api.silhouette.exchange/v0/openapi.json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps(d.get('paths', {}).get('/v0/ws', d.get('paths', {}).get('/ws', {})), indent=2))"
```

Three possible outcomes:
- A: Full WebSocket protocol exists - write a real `/api/websocket` page documenting subscribe / unsubscribe / message format
- B: Only the WS health check exists (`/v1/ws`) - stub the page with "WebSocket API coming in v1" callout
- C: No WS endpoint at all - skip this milestone, remove from sidebar plan, note in the final report

#### Task 16: Write `/api/websocket` page (or stub)

**Files:**
- Create: `docs/10-api/08-websocket.md`

**Step 1 (outcome A):** Document subscription channels (orderBook, trades, fills, position updates), message envelope shape, auth flow for private channels, reconnect / heartbeat behavior, code example using `ws` library.

**Step 1 (outcome B):** Stub page:
```mdx
---
title: WebSocket API
sidebar_label: WebSocket
slug: /api/websocket
description: "WebSocket subscription channels for live order book, trades, and fill updates on the Silhouette API."
---

:::warning Coming in v1
The full WebSocket API ships with v1. The v1 health check endpoint at `wss://api.silhouette.exchange/v1/ws` is live today. Subscription channels for order book, trades, fills, and private account streams are in development.
:::

## What will be supported

- Live order book snapshots and deltas
- Live trade prints
- Live fill updates (authenticated)
- Position update streams (authenticated)

## How to follow progress

Watch [/changelog](/changelog) once it ships, or [follow @silhouette_ex on X](https://x.com/silhouette_ex) for v1 release notes.

For now, use the [REST `getUserOrders` operation](/api/reference#getUserOrders) to poll for fills.
```

**Step 1 (outcome C):** Skip this milestone. Remove the planned sidebar entry. Note in final report.

**Step 2:** Add to sidebar (only if A or B):
```ts
'api/websocket',
```

**Step 3:** Verify: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/api/websocket` - expect `200`
**Step 4:** Commit:
```bash
git add docs/10-api/08-websocket.md sidebars.ts
git commit -m "feat(api): add /api/websocket page documenting subscription channels"
```

---

### Milestone 10 - Apply EndpointCard + LanguageTabs to one operation as proof

#### Task 17: Refactor `## login` in `03-reference.md` to use new components

**Files:**
- Modify: `docs/10-api/03-reference.md` (only the `## login` section, lines ~24-100)

**Step 1:** Replace the `## login` section header and its preamble with:

```mdx
## login

<EndpointCard operation="login" auth="none" description="Authenticate via SIWE and receive a JWT bearer token. First step in the API flow." />

Authenticate with the Silhouette API using [Sign-In With Ethereum (SIWE)](https://docs.login.xyz/) to obtain a [bearer token](https://datatracker.ietf.org/doc/html/rfc6750). This operation does not require an existing bearer token - it's the first step in using the API.

**Endpoint:** `POST https://api.silhouette.exchange/v0`

**Request parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| operation | string | Yes | Must be `"login"` |
| message | string | Yes | The SIWE message to verify. Must include the statement "Sign in with Ethereum to the app." |
| signature | string | Yes | The cryptographic signature of the SIWE message, signed with your wallet's private key |
| primaryAddress | string | No | Primary wallet address when signing with a Hyperliquid API wallet... |

<LanguageTabs>
  ```bash title="cURL"
  curl https://api.silhouette.exchange/v0 \
    -H "Content-Type: application/json" \
    -d '{
      "operation": "login",
      "message": "...",
      "signature": "0x..."
    }'
  ```

  ```python title="Python"
  from silhouette import Client

  client = Client.login_with_siwe(
      message="...",
      signature="0x...",
  )
  ```

  ```typescript title="TypeScript"
  import { Silhouette } from "@silhouette/sdk";

  const client = await Silhouette.loginWithSiwe({
    message: "...",
    signature: "0x...",
  });
  ```
</LanguageTabs>
```

(Keep the existing success response and error response sections below this, no changes needed.)

**Step 2:** Verify at `http://localhost:3100/api/reference#login` - confirm the EndpointCard renders, the LanguageTabs work, and the rest of the page below is unchanged.
**Step 3:** Commit:
```bash
git add docs/10-api/03-reference.md
git commit -m "refactor(api): apply EndpointCard and LanguageTabs to login operation as proof of concept"
```

NOTE: We do NOT refactor all 24 operations in this plan. That's a separate cleanup task for after Group A. This refactor is just to prove the components work in real content.

---

### Milestone 11 - JSON-LD TechArticle on API pages

#### Task 18: Add TechArticle JSON-LD to API page frontmatter

**Files:**
- Modify: `docusaurus.config.ts` (extend `themeConfig.structuredData` if needed)
- OR: Modify each `docs/10-api/*.md` page's frontmatter to add a `structured_data:` block

**Step 1:** Read the `@stackql/docusaurus-plugin-structured-data` README at `node_modules/@stackql/docusaurus-plugin-structured-data/README.md` to confirm the per-page configuration mechanism.

**Step 2:** Choose the path that produces the cleanest result (config-side OR frontmatter-side).

**Step 3:** Add this JSON-LD shape to each API page (the executor will need to specialize per page):

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "<page title>",
  "description": "<page description>",
  "proficiencyLevel": "Expert",
  "dependencies": "Hyperliquid wallet, SIWE message signing",
  "author": {
    "@type": "Organization",
    "name": "Silhouette Exchange"
  },
  "datePublished": "<page first commit date>",
  "dateModified": "<git last-modified>"
}
```

**Step 4:** Verify in dev server: `curl -s http://localhost:3100/api/reference | grep -c '"TechArticle"'` - expect `1` or more.
**Step 5:** View-source check on each API page (visit in browser, view source, look for `application/ld+json` with `TechArticle`).
**Step 6:** Commit:
```bash
git add docusaurus.config.ts docs/10-api/
git commit -m "feat(seo): add TechArticle JSON-LD to all API reference pages"
```

---

### Milestone 12 - Surgical cleanup

#### Task 19: Remove AuthorByline from `01-about-silhouette.md`

**Files:**
- Modify: `docs/01-about-silhouette.md`

Per Wayne's instruction (2026-04-08): AuthorByline should only appear on blog and guides, not on docs. Strip the usage from the introduction page.

**Step 1:** Read the file, locate the `<AuthorByline ... />` element.
**Step 2:** Remove it (don't replace with anything - the page should flow naturally without it).
**Step 3:** Verify the file still parses: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/about-silhouette` - expect `200`.
**Step 4:** Verify no other docs page uses AuthorByline:
```bash
grep -rn 'AuthorByline' docs/ --include='*.md' --include='*.mdx'
```
Expect empty output. (The component itself in `src/components/AuthorByline/` STAYS - it's still used by blog and will be used by guides.)
**Step 5:** Commit:
```bash
git add docs/01-about-silhouette.md
git commit -m "refactor(content): remove AuthorByline from docs introduction (kept for blog/guides only)"
```

---

### Milestone 13 - Final verification

#### Task 20: Kill dev server and run production build

**Step 1:** Find the dev server background task: check the running processes for `pnpm start` or list background tasks.
**Step 2:** Kill the dev server.
**Step 3:** Run `pnpm build` and capture the output.
**Step 4:** Expect: build succeeds with `onBrokenLinks: throw` intact, all new pages indexed, all new structured data emitted, sitemap includes new URLs, llms.txt includes new pages.
**Step 5:** If build fails: read the error, fix the cause, retry. Do NOT skip the build step.
**Step 6:** Once green, restart the dev server: `pnpm start --no-open --port 3100`

#### Task 21: Smoke test all new URLs

Run each of these and confirm `200`:

```bash
curl -s -o /dev/null -w "%{http_code} /api/explorer\n" http://localhost:3100/api/explorer
curl -s -o /dev/null -w "%{http_code} /api/rate-limits\n" http://localhost:3100/api/rate-limits
curl -s -o /dev/null -w "%{http_code} /api/errors\n" http://localhost:3100/api/errors
curl -s -o /dev/null -w "%{http_code} /api/websocket\n" http://localhost:3100/api/websocket
curl -s -o /dev/null -w "%{http_code} /api/reference\n" http://localhost:3100/api/reference
curl -s -o /dev/null -w "%{http_code} /api/openapi\n" http://localhost:3100/api/openapi
curl -s -o /dev/null -w "%{http_code} /api/quick-start\n" http://localhost:3100/api/quick-start
curl -s -o /dev/null -w "%{http_code} /llms.txt\n" http://localhost:3100/llms.txt
```

Then verify `/llms.txt` contains the new pages:
```bash
curl -s http://localhost:3100/llms.txt | grep -c -E '/api/(rate-limits|errors|websocket|explorer)'
```
Expect at least 3 (explorer might not be indexed because it's plugin-rendered, not a markdown file).

#### Task 22: View-source JSON-LD check

For each API page, visit in browser and view-source:
- `http://localhost:3100/api/quick-start`
- `http://localhost:3100/api/reference`
- `http://localhost:3100/api/errors`
- `http://localhost:3100/api/rate-limits`

Look for `<script type="application/ld+json">` containing `"TechArticle"` AND `"BreadcrumbList"`. Both should be present per page.

#### Task 23: Final report

Write a short status section in the dev server that summarizes:
- All commits added in Group A
- New routes shipped
- New components shipped
- Known TODO (e.g. real rate-limit data, real WebSocket spec, voice pass on remaining 23 operations)
- Whether the original Phase 2 scaffold's task list is now complete for Group A (yes/no per bullet)

Output to console for Wayne to read. Do NOT commit this as a doc - it's a session report, not a deliverable.

---

## Exit criteria for Group A

- [ ] `pnpm build` is green with `onBrokenLinks: throw` intact
- [ ] `/api/explorer` returns 200 with Scalar rendering both v0 and v1 specs in version tabs
- [ ] Scalar styling matches Silhouette dark theme (no light backgrounds, cyan accent, IBM Plex Mono on code)
- [ ] `/api/rate-limits`, `/api/errors`, and `/api/websocket` (or stub) all return 200
- [ ] `/api/openapi` no longer references the broken `swagger/v0/json` URL
- [ ] EndpointCard renders correctly on the `## login` section of `/api/reference`
- [ ] LanguageTabs renders correctly with cURL/Python/TypeScript on the `## login` section
- [ ] RateLimit pill renders with tier-appropriate colors on `/api/rate-limits`
- [ ] All API pages emit TechArticle JSON-LD (verified in view-source)
- [ ] `/llms.txt` includes the new pages
- [ ] AuthorByline removed from `docs/01-about-silhouette.md`; AuthorByline component still exists for blog/guides
- [ ] Working tree clean, all 23 task commits on `docs/overhaul-plan-2026-04-07`
- [ ] Wayne signs off on the visual + functional review of `/api/explorer`

---

## Hard rules (carry over from session 1 handoff)

1. Stay on `docs/overhaul-plan-2026-04-07`. Do not switch branches. Do not push.
2. No claim of MEV protection. Use strategy leakage / copytrade exposure / signaling risk / adverse selection.
3. No em dashes. Regular hyphens only.
4. No light mode. Dark only, `#13161a` base.
5. Orbitron is ALL CAPS only.
6. All colors / fonts / spacing reference tokens in `:root`. No hardcoded `#hex` outside the token block.
7. Always invoke `frontend-design` or `ui-ux-pro-max` for UI work (Tasks 8, 9, 10).
8. If a CSS bug is not solved in 2 attempts, dispatch puppeteer before attempt 3.
9. Never run `pnpm build` while the dev server is running. Kill the server first.
10. No speculative abstractions. No helper utilities beyond what each task creates.

---

## Out of scope for Group A (deferred to later groups)

- Voice pass on `/api/quick-start`, `/api/authentication`, `/api/troubleshooting` (Group B)
- Refactoring all 24 operations in `03-reference.md` to use EndpointCard + LanguageTabs (post-Group-A cleanup)
- Real rate-limit numbers (depends on Heimdall team source)
- Real WebSocket protocol spec (depends on v1 release)
- Changelog plugin and Linear sync (Group F)
- Schema markup pass on non-API pages (Group I)
- Vale linting (Group L)

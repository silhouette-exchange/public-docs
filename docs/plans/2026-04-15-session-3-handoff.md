---
title: Docs overhaul session 3 handoff
description: State, commit timeline, decisions, and next steps after the third execution session (hero redesign from Figma, footer update, copy polish, product screenshots, docs screenshot placements).
---

# Docs overhaul - session 3 handoff

**Session date:** 2026-04-15
**Operator:** Claude Code (opus 4.6, 1M context) driven by Wayne
**Branch:** `docs/overhaul-plan-2026-04-07` (local + pushed to `private` remote)
**State at session end:** 123 commits ahead of `origin/main`, pushed to `private/main` for Vercel preview
**Preview URL:** https://silhouette-docs-preview.vercel.app/

## Session goal vs outcome

**Plan:** Implement the updated Figma hero design, polish copy across the landing page, capture product screenshots, and place them in the docs.

**Outcome:** All of the above shipped. 16 commits this session covering hero redesign, footer update, copy corrections, 22+ product screenshots captured and placed across 8 docs pages, and site meta description rewritten.

## Preview workflow (established this session)

All pushes go to `private` remote (`wizzle93/silhouette-docs-preview`) which deploys to Vercel. The public repo (`origin/silhouette-exchange/public-docs`) stays untouched until the full design + content overhaul is signed off.

```bash
git push private docs/overhaul-plan-2026-04-07:main
```

## Commit timeline (this session)

Newest first:

- `bf8bbf5` feat(docs): add screenshots to 6 docs pages covering webapp UI
- `281de85` fix(copy): update site description + add referral/shielded/orders screenshots
- `d20c365` feat(screenshots): add order type screenshots for all live modes
- `d11c2b6` fix(hero): make SLH/SYS panel background opaque
- `39d618e` fix(hero): simplify chart mask to single gradient - avoid mask-composite
- `5c97ee4` feat(screenshots): add manual app screenshots + soft edge CSS + automated capture script
- `db73bfb` fix(config): remove "Edit this page" links across all pages
- `354c540` fix(home): remove "docs are organised" hint copy from role section
- `1954ef3` feat(hero): polish pass - copy, colors, chart background
- `feaea70` fix(hero): remove Engine/TEE row from panel
- `13546b9` fix(footer): fix Launch App button spacing and style
- `a9cc1b4` fix(footer): spread columns evenly instead of bunching right
- `4048052` fix(footer): match updated Figma footer design
- `00dd493` fix(hero): comprehensive Figma fidelity pass
- `2f6e334` fix(config): revert experimental_faster rename - lock file pins 3.9.2
- `ecc7c5a` feat(hero): update hero section to match new Figma design

## What landed this session

### Hero redesign (from Figma)

- Headline: 62px Orbitron Regular (was 84px Medium), 4.34px tracking, no trailing period
- Layout: 120px side padding, 720px content column, 56px gap
- CTAs: Inter 14px capitalize (was Mono 12px uppercase), arrows removed, secondary button now magenta
- Accent gradient: #94fff9 -> #73f1ea -> #57e4dc with 69px shadow
- Background: removed grid + scanline, added blurred trading chart image (`hero-chart-bg.png`) as atmosphere layer with single-gradient mask (avoids LightningCSS mask-composite bug), magenta glow moved to top-right
- Panel: solid border (was gradient), 92% opaque bg (was 36% - backdrop-filter doesn't work reliably with mix-blend-mode:screen in production builds)
- Eyebrow pill: opaque bg with backdrop-blur
- Stats: 12px labels, 41px top padding, 0.44px value tracking
- Spacing: 80px top padding (was min-height 900px centered)

### Footer update (from Figma)

- Added "Launch App" button (outline style, pushed to bottom with space-between)
- Added "Documentation" column (Docs, Guides, API)
- Fixed column layout: 3 columns spread evenly with `grid-template-columns: repeat(3, 1fr)` + `flex: 1`

### Copy corrections

- **Panel rows:** Removed "Engine / TEE Attested" row (doesn't fit glanceable spec pattern), changed "Leakage" from "0 bytes" to "None"
- **Stats strip:** "Taker rebate 95%" -> "Taker fee -95%", "Order leakage 0 bytes" -> "Order leakage None", "Settlement L1" -> "Settlement HyperCore"
- **Headline:** Removed trailing period
- **Body text:** "orderbook" -> "order book", "copytrade" -> "copy trade"
- **Site meta description:** Replaced "shielded perpetuals exchange" with "shielded trading platform on Hyperliquid. Trade without exposing your wallet, your strategy, or your size. The cheapest venue to accumulate assets onchain." Updated in index.tsx, llms.txt plugin, and structured data config.
- **Removed:** "Edit this page" links across all pages, "Whatever brought you here, the docs are organised..." hint copy

### Product screenshots

**Automated capture script:** `scripts/take-screenshots.mjs` - injects a mock `window.ethereum` provider using `TEST_WALLET_PK` from `.env.local`, handles `personal_sign`/`eth_signTypedData` via ethers.js bridge. Auth works, but Transfer modal requires a funded/active Silhouette session.

**Screenshots captured and committed** (in `static/img/app-screenshots/`):
- `trade-full.png` - full authenticated trade page (Puppeteer)
- `balances-panel.png` - shielded spot balances table (manual)
- `transfer-modal.png` - transfer funds modal (manual)
- `portfolio-sidebar.png` - portfolio sidebar with account values (manual)
- `openPositions.png` - open positions panel (manual)
- `ReferralPage.png` - referral code page (manual)
- `ShieldedMarketsSelector.png` - shielded markets asset selector (manual)
- 19x order type screenshots: naked spot/perps (market/limit/scale/twap, buy+sell / long+short), naked margin mode select, shielded spot market (buy+sell)

**CSS class:** `.app-screenshot` in `custom.css` - radial mask for soft feathered edges + box-shadow

**Screenshots placed in docs** (20 placements across 6 pages):
- `docs/onboarding/start-trading.md` - 4 screenshots (spot market, spot limit, margin mode, perps market)
- `docs/onboarding/withdraw.md` - 3 screenshots (transfer modal, balances panel, portfolio sidebar)
- `docs/06-trading/order-types.md` - 8 screenshots (market/limit/TWAP/scale for spot + perps)
- `docs/06-trading/shielded-trading.md` - 2 screenshots (shielded order, shielded markets selector) + balances
- `docs/06-trading/naked-trading.md` - 1 screenshot (naked spot order)
- `docs/06-trading/order-lifecycle.md` - 1 screenshot (open positions)
- `docs/03-how-silhouette-works.md` - 2 screenshots (trade overview, portfolio sidebar)
- `docs/05-referrals.md` - 1 screenshot (referral page)

## Architecture decisions

### LightningCSS mask-composite bug
The Rspack/LightningCSS minifier mangles `mask-composite: intersect` into incorrect `-webkit-mask-composite: source-in,xor`. Fix: use a single gradient mask instead of compositing two masks. This caused the chart background to render differently between dev (unminified) and Vercel production (minified).

### Panel opacity
`backdrop-filter: blur()` doesn't work reliably when a sibling element uses `mix-blend-mode: screen` in the same stacking context. The panel background was 36% opaque and relied on backdrop-filter to look solid - this broke in production. Fix: bump to 92% opacity so the panel is self-sufficient.

### "Shielded perpetuals" language audit
Wayne's call: the roadmap mentions ("shielded perpetuals are on the roadmap", "we are building shielded perpetuals") are accurate disclosures and stay. Only the identity/marketing claims ("Silhouette is a shielded perpetuals exchange") were corrected to "shielded trading platform". The `hyperliquid-integration.md` meta description mentioning "95% volume discount" stays because it's a technical architecture page where specifics are appropriate.

## What's next

### Screenshots still needed
- **Deposit flow** - the deposit modal/process
- **Shielded limit/scale/twap** - currently in staging, add when they ship (~1 week)

### Content gaps identified (from audit)
Pages that describe webapp UI but have thin or missing content:
1. **Account Dashboard overview** - referenced in multiple pages but no dedicated page
2. **Balances panel / account management** - no dedicated walkthrough
3. **Naked vs Shielded mode toggle** - central feature, no detailed guide with screenshots
4. **"What Stays Private" table** on shielded-trading.md - Wayne flagged for cleanup (empty left cell on last row)

### Blog redesign
Still queued from session 2. Blog listing and reading experience needs Medium/Substack-level polish. 24 articles in the Notion pipeline.

### Phase 2 Group A API content (paused)
Tasks 9-18 still waiting on API team review. Resume after Wayne's colleague reviews the foundation.

### Phase 4 distribution
- MCP server deployment (half-done, needs Cloudflare Worker deploy + context7 listing)
- Wikipedia draft (Jerri owns)

## How to resume

### Verify state
```bash
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
git status                              # should be clean (aside from .pnpm-store, package.json, untracked trade screenshots)
git branch --show-current               # docs/overhaul-plan-2026-04-07
git log --oneline origin/main..HEAD | wc -l   # 123
```

### Start dev server
```bash
pnpm start --no-open --port 3100
```

### Push to preview
```bash
git push private docs/overhaul-plan-2026-04-07:main
```

### Hard rules (carry over from session 2)

1. Stay on `docs/overhaul-plan-2026-04-07`. Do not switch branches. Push to `private` remote only.
2. Never claim MEV protection. Use strategy leakage / copytrade exposure / signaling risk / adverse selection.
3. No em dashes anywhere. Regular hyphens only.
4. No light mode. Dark only.
5. Orbitron is ALL CAPS only with wide tracking. H1 only among headings.
6. All colors / fonts / spacing reference tokens in `:root`. No hardcoded `#hex` outside the token block (hero atmosphere layer is an exception - uses direct values for gradients/blurs).
7. Always invoke `frontend-design` AND `ui-ux-pro-max` for UI work.
8. If a CSS bug is not solved in 2 attempts, dispatch puppeteer before attempt 3.
9. Never run `pnpm build` while the dev server is running.
10. New components, hooks, lib functions ship with vitest unit tests.
11. LightningCSS will mangle `mask-composite` - use single-gradient masks instead.
12. Panel/card backgrounds need 85%+ opacity - don't rely on backdrop-filter with mix-blend-mode siblings.
13. Silhouette is a "shielded trading platform" not a "shielded perpetuals exchange". Roadmap disclosures about shielded perps are fine.
14. Test wallet PK in `.env.local` - screenshot script at `scripts/take-screenshots.mjs`.

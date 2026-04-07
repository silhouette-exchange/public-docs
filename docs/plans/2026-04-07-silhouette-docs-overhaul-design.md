# Silhouette Docs Overhaul — Design Doc

**Date:** 2026-04-07
**Author:** Wayne (+ Claude research pass)
**Status:** Approved — proceed to implementation plan
**Target repo:** `silhouette-exchange/public-docs` (Docusaurus 3.9)
**Branch:** `docs/overhaul-plan-2026-04-07`
**Baseline score:** 3/10 (see audit findings below)
**Target score:** 11/10 — MAG7-tier, agent-first docs site
**Platform decision:** Stay on Docusaurus, overhaul hard

---

## 0. How to read this doc

This is the design doc, not the implementation plan. It captures:

- The thesis and the 11/10 grading rubric
- Audience priorities and page journeys
- Information architecture (new sidebar + URL map)
- Visual direction grounded in `tokens.json`
- Editorial voice and sample rewrites
- The agentic layer (llms.txt pipeline, schema, robots.txt, Copy-for-LLM buttons, MCP)
- Blog CMS (Notion pipeline)
- Content gap list and target queries
- Phased build plan (3 phases + parallel distribution track)
- Success metrics and open questions

A separate implementation plan — phase by phase, task by task with acceptance criteria — will be written next via `superpowers:writing-plans` and saved alongside this doc.

---

## 1. Thesis

> **Every trade on a public orderbook is a confession to copytrade bots, signal-aware LPs, and every desk watching your wallet. Silhouette is where you stop confessing.**

The docs today are a Docusaurus default install with workmanlike content on top. The raw material is there (the fees page buries a killer stat — "95% of our volume discount goes to you"; `about-silhouette` has the best sentence on the site; the dark-pools blog series is genuine thought leadership) but almost nothing is optimized for how integrators, institutions, and agents actually find Silhouette in 2026.

**The overhaul has one single thesis: `docs.silhouette.exchange` exists to get Silhouette cited by AI agents, adopted by integrators, and trusted by institutions — in that order.** Everything else (visual polish, editorial voice, blog cadence) serves those three jobs.

**The competitive opening:** Hyperliquid's docs are a GitBook default — jargon-first landing, no role-based entry, community-maintained SDKs listed without vetting, zero agentic features. Silhouette can leap-frog the entire Hyperliquid ecosystem on DX in one focused sprint.

### 1a. A note on MEV

Earlier versions of the docs (including the current `static/llms.txt`) talk about "MEV protection." HyperCore runs an on-chain CLOB with batched settlement, not an Ethereum-style public mempool. Flashbots-style MEV does not map, and Hyperliquid actively markets that MEV is not a problem on their venue. Claiming to "solve MEV on Hyperliquid" puts us in unnecessary conflict with their messaging and is technically imprecise.

What Silhouette actually protects against is concrete and more interesting:

- **Strategy leakage** — public fills let observers reverse-engineer your alpha
- **Copytrade exploitation** — bots replicate known-good wallets' trades
- **Signaling risk on size** — large orders move books before they fill
- **Adverse selection for LPs** — liquidity providers who can see your intent price against you

Every page, llms.txt included, must be updated to drop "MEV" and lean into these four named enemies. This reframe is load-bearing for both the voice and the SEO strategy.

---

## 2. Current state (audit baseline, 2026-04-07)

Full audit by research pass is logged separately. Summary:

| Area | Finding |
|---|---|
| Overall score | **3/10** |
| `llms.txt` | **Exists** as hand-maintained `static/llms.txt` (270 lines). Not plugin-generated, drifts from content, contains MEV language, no `llms-full.txt`, no per-page `.md`. |
| `robots.txt` | **404 / missing**. Cannot confirm which AI bots are allowed. |
| Meta descriptions | Missing sitewide (~0 / 50 pages). |
| Last-updated dates + authors | Missing sitewide. Docusaurus flags `showLastUpdateTime` / `showLastUpdateAuthor` not enabled. |
| Sitemap `<lastmod>` | Zero of 50 entries have it. |
| JSON-LD schema | Only `BreadcrumbList` on `/about-silhouette`. No `FAQPage` on `/faq`, no `HowTo` on `/quickstart`, no `Organization`, no `TechArticle`. |
| Typography | Inter only. Orbitron imported in `docusaurus.config.ts` but never applied. IBM Plex Mono imported but underused. |
| Visual tokens | `src/css/custom.css` uses a drifted token schema with bluish greys and wrong link color (`#00b8ae` vs webapp `#4dfff6`). Does not match `tokens.json`. |
| IA | Single flat tree. No `/docs` vs `/guides` split. No dev landing, no institutional landing, no "why Silhouette" comparison page. |
| Home page | Default Docusaurus tiles ("What is / Get Started / FAQ"). Generic H1 "Welcome to Silhouette Docs." TradingView attribution blurb on landing. |
| API reference | Hand-written, cURL-only. OpenAPI spec exists at `api.silhouette.exchange/swagger/v0/json` but is not rendered in docs. |
| Blog | 6–7 posts over 13 months with a 5.5-month publishing gap. Author is always "Silhouette Team" (no named attribution). Markdown-in-repo only. |
| AI visibility | Zero citations for category queries (privacy DEX, shielded trading Hyperliquid, strategy leakage DeFi). Brand-name queries surface correctly. |
| Third-party entity presence | Zero of five (no Wikipedia, Messari, DeFiLlama, CoinGecko, CoinMarketCap entries reliably citing the docs). |

---

## 3. Non-negotiables (the 11/10 grading rubric)

A page qualifies as MAG7-tier only if it ticks **every** item below. This is the grading rubric for the whole overhaul.

| # | Criterion | Current | Target |
|---|---|---|---|
| 1 | `llms.txt` + `llms-full.txt` at root, plugin-generated and auto-synced with content | Hand-maintained, drifty, no full variant | Both plugin-generated |
| 2 | Every page URL also serves clean `.md` | No | Yes |
| 3 | "Copy for LLM / Open in ChatGPT / Open in Claude / Add to Cursor" row on every article | No | Yes |
| 4 | JSON-LD schema (`TechArticle` + `FAQPage` + `HowTo` + `Organization` + `BreadcrumbList` + `DefinedTerm`) | Only `BreadcrumbList` | Full stack |
| 5 | `robots.txt` explicitly allows `GPTBot`, `Claude-SearchBot`, `PerplexityBot`, `OAI-SearchBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`, `cohere-ai` | Missing | Explicit allow-list |
| 6 | Brand typeface matches webapp 1:1 | Inter only (wrong) | Orbitron display + Inter body + IBM Plex Mono |
| 7 | Visual tokens 1:1 with webapp (`tokens.json` as source of truth) | Major drift | Match |
| 8 | Two-tree IA: `/docs` reference vs `/guides` narrative | Single tree, muddled | Split |
| 9 | Role-based landing (Developers / Institutions / Traders cards) | Generic three-card default | Role-split |
| 10 | OpenAPI-rendered API reference with try-it + language tabs (cURL / Python / TypeScript) | Hand-written, cURL-only | Scalar plugin rendering existing `swagger/v0/json` |
| 11 | Every page has `description:`, last-updated date, named author | Zero pages | All pages |
| 12 | Blog cadence non-dead, editable by non-technical team | 5.5-month gap, markdown-only | Notion CMS, monthly minimum |
| 13 | Wikipedia / Messari / DeFiLlama / CMC / CoinGecko entity presence with `sameAs` links back from docs | 0 of 5 | 4 of 5 (parallel track) |
| 14 | AI citation rate for 20 target queries | 0 of 20 | 8+ of 20 at 90 days |

---

## 4. Audience → page journeys

Every page maps to one primary audience. Secondary audiences can consume but shouldn't drive the copy. Priority order per Wayne: **AI agents → Integrators → Institutions → Traders.**

| Audience | Primary jobs | Entry pages | Proof they need |
|---|---|---|---|
| **AI agents** | Index the whole corpus cheaply; answer "what is shielded trading on Hyperliquid" | `/llms.txt`, `/llms-full.txt`, per-page `.md`, MCP server (Phase 4), schema markup | Clean markdown, cited sources, stats with dates, self-contained 40–60 word answer blocks |
| **Integrators / quant devs** | Place a shielded order from code in under 15 minutes | `/guides/for-developers`, `/docs/api/reference`, `/docs/sdk`, "Build an autonomous agent" recipe | OpenAPI spec rendered, language tabs, rate limits, try-it, error codes, example repos, testnet quickstart |
| **Institutions / desks** | Due-diligence the TEE threat model in one sitting | `/guides/for-institutions`, `/docs/architecture/tee-attestation`, `/docs/security/audits`, `/docs/security/reproducible-builds` | Named founders with credentials, TEE attestation walkthrough, audit reports, PCR0 hashes, custody model, jurisdiction |
| **Traders** | Place their first shielded order in under 5 minutes | `/`, `/docs/quickstart`, `/docs/trading/shielded-trading`, `/docs/trading/fees`, `/docs/faq` | Screenshots, 5-step visual walkthrough, fee comparison vs public Hyperliquid, FAQ |

---

## 5. Information architecture

### 5a. URL structure (two-tree split)

```
docs.silhouette.exchange/
├── /                                  Home (role-based tiles)
├── /llms.txt                          Agent index (plugin-generated from docs tree)
├── /llms-full.txt                     Full corpus concat (plugin-generated)
├── /robots.txt                        Explicit AI allow-list (NEW)
├── /sitemap.xml                       With <lastmod> on every entry
│
├── /docs/                             REFERENCE TREE (evergreen, extractable, LLM-friendly)
│   ├── introduction                   "What Silhouette is" — category definition
│   ├── why-silhouette                 Comparison page (NEW, high-priority)
│   ├── quickstart                     5-step visual walkthrough
│   ├── concepts/
│   │   ├── shielded-trading           Definition + threat model
│   │   ├── tee                        TEE primer + attestation
│   │   ├── strategy-leakage           Replaces MEV framing (NEW)
│   │   ├── copytrade-exposure         Replaces MEV framing (NEW)
│   │   ├── signaling-risk             Replaces MEV framing (NEW)
│   │   ├── adverse-selection          LP-side framing (NEW)
│   │   ├── hyperliquid-integration    How Silhouette sits on top
│   │   ├── privacy-model              What's hidden, what's revealed, threat model
│   │   └── naked-vs-shielded          Comparison table
│   ├── trading/
│   │   ├── shielded-trading           (rewritten)
│   │   ├── naked-trading
│   │   ├── order-types                Limit / market / stop / TWAP
│   │   ├── fees                       With "95% passthrough" as headline
│   │   ├── funding-rates              (NEW or surfaced)
│   │   ├── margin-and-leverage        (NEW or surfaced)
│   │   └── liquidations               (NEW or surfaced)
│   ├── architecture/
│   │   ├── overview                   Mermaid sequence diagrams, not ASCII
│   │   ├── tee-attestation            PCR0 hashes + verification steps (NEW)
│   │   ├── smart-contracts
│   │   ├── hyperliquid
│   │   └── threat-model               (NEW)
│   ├── security/
│   │   ├── audits                     (NEW)
│   │   ├── bug-bounty                 (NEW)
│   │   └── reproducible-builds        (NEW)
│   ├── api/
│   │   ├── overview
│   │   ├── authentication
│   │   ├── reference                  OpenAPI-rendered via Scalar
│   │   ├── rate-limits                (NEW)
│   │   ├── errors                     (NEW)
│   │   ├── websocket                  (NEW)
│   │   └── troubleshooting
│   ├── sdk/
│   │   ├── python
│   │   ├── typescript                 (NEW or community)
│   │   └── rust                       (roadmap stub)
│   ├── referrals
│   ├── faq                            FAQPage schema
│   ├── glossary                       DefinedTerm schema (NEW)
│   └── changelog                      (NEW, RSS-enabled)
│
├── /guides/                           NARRATIVE TREE (how-to, playbooks, case studies)
│   ├── /for-developers/               Role landing
│   │   ├── building-a-market-making-bot
│   │   ├── integrating-silhouette-into-a-trading-frontend
│   │   ├── running-a-shielded-twap-strategy
│   │   ├── build-an-autonomous-trading-agent    ← the big agentic story
│   │   └── testnet-playbook
│   ├── /for-institutions/             Role landing
│   │   ├── compliance-and-custody
│   │   ├── attestation-walkthrough
│   │   ├── onboarding-your-desk
│   │   └── reporting-and-audit-trail
│   ├── /for-traders/                  Role landing
│   │   ├── your-first-shielded-trade
│   │   ├── choosing-an-order-type
│   │   ├── understanding-fees
│   │   └── common-mistakes
│   └── /comparisons/
│       ├── silhouette-vs-hyperliquid-public
│       ├── silhouette-vs-aster-hidden-orders
│       ├── silhouette-vs-renegade
│       ├── silhouette-vs-penumbra
│       ├── tee-vs-zk-for-defi-privacy
│       └── silhouette-vs-cow-batch-auctions
│
├── /blog/                             Notion-sourced from Phase 3 onwards
└── /changelog/                        Docusaurus blog plugin instance #2, RSS-enabled
```

### 5b. Why two trees

- **`/docs`** is reference. Short, dense, extractable, self-contained. Primary tree LLMs crawl and cite. Matches Stripe/Vercel/Cloudflare reference split.
- **`/guides`** is narrative. Longer, opinionated, case-study-heavy. Primary tree humans read to learn *how to think about* Silhouette. Matches Tailwind/Linear editorial voice.

Both trees get their own sidebar (separate Docusaurus plugin instances), both share the same header. Search indexes both. `llms-full.txt` includes both but weights `/docs` higher.

### 5c. New home page layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Shielded trading on Hyperliquid.                                │
│                                                                  │
│  Every trade on a public orderbook is a confession to copytrade  │
│  bots, signal-aware LPs, and every desk watching your wallet.    │
│  Silhouette encrypts your orders until match and passes 95% of   │
│  the Hyperliquid volume discount back to you.                    │
│                                                                  │
│  [ Read the docs → ]   [ Build on Silhouette → ]                 │
└──────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  DEVELOPERS  │  │ INSTITUTIONS │  │    TRADERS   │
│              │  │              │  │              │
│ Build bots,  │  │ Due-diligence│  │ Start        │
│ agents, and  │  │ the TEE,     │  │ shielding    │
│ integrations │  │ attestation, │  │ trades in    │
│ in minutes.  │  │ and custody. │  │ 5 minutes.   │
│              │  │              │  │              │
│ → API docs   │  │ → Security   │  │ → Quickstart │
└──────────────┘  └──────────────┘  └──────────────┘

  Featured guides        Recent changelog         From the blog
  ────────────           ────────────             ────────────
```

Agent "card" = `<link rel="alternate" type="text/markdown" href="/llms.txt">` in the head, plus `llms.txt` referenced explicitly in `robots.txt`.

---

## 6. Visual direction

### 6a. Tokens (source of truth = `tokens.json`)

Replace the entire token block in `src/css/custom.css`. Full mapping is in the research log; the abbreviated source of truth:

| Role | Token | Value |
|---|---|---|
| Base surface | `--bg-base` | `#13161a` |
| Secondary surface | `--bg-secondary` | `#18181b` |
| Tertiary surface | `--bg-tertiary` | `#27272a` |
| Card surface | `--bg-card` | `rgba(255,255,255,0.04)` |
| Modal surface | `--bg-modal` | `#1c1f23` |
| Text default | `--text-default` | `#f9f9f9` |
| Text secondary | `--text-secondary` | `#d4d4d8` |
| Text muted | `--text-muted` | `#a1a1aa` |
| Text tertiary | `--text-tertiary` | `#71717a` |
| Border subtle | `--border-subtle` | `rgba(255,255,255,0.04)` |
| Border default | `--border-default` | `#27272a` |
| Border strong | `--border-strong` | `#3f3f46` |
| Accent primary (magenta) | `--accent-primary` | `#fa00ff` |
| Accent primary text (readable) | `--accent-primary-text` | `#fd80ff` |
| Accent secondary (cyan) | `--accent-secondary` | `#00fff2` |
| Accent secondary text (readable) | `--accent-secondary-text` | `#4dfff6` |
| Success | `--success` | `#88ffe3` |
| Danger | `--danger` | `#ff65b4` |
| Warning | `--warning` | `#fbbf24` |
| Hyperliquid tint | `--hl-medium` | `#50d2c1` |

Radius stays sharp (`--radius-none: 0` default; `--radius-sm: 4px` only for kbd chips and small inputs). Spacing scale from `tokens.json`.units (4px grid). Motion defaults: `120 / 200 / 320 / 480ms` with `cubic-bezier(0.4, 0, 0.2, 1)`. No drop shadows on cards (matches webapp austerity); glow only on hover for primary CTAs. Remove the current `static/img/main-bg.png` background image — adopt solid `--bg-base`.

### 6b. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display headings (H1, H2) | **Orbitron** | 500 | Geometric, matches marketing 1:1 |
| Body headings (H3-H6) | **Inter Display** | 600 | Keeps density readable |
| Body | **Inter** | 400/500 | 16px base, 1.6 line-height |
| Mono / code | **IBM Plex Mono** | 400/500 | |
| UI labels (tiny caps) | **IBM Plex Mono** | 500 | 0.16em tracking — matches webapp labels |

Type scale: `12 / 14 / 16 / 18 / 20 / 22 / 28 / 36 / 48 / 64` px.

- H1 = 36px Orbitron 500, `-0.01em` tracking
- H2 = 28px Orbitron 500
- H3 = 20px Inter Display 600
- Body = 16px Inter 400, `1.6` line-height

**Current docs uses Inter on everything — this is wrong.** Orbitron is already imported in `docusaurus.config.ts` but `--ifm-heading-font-family` is hardcoded to `"Inter"`. First fix of the visual pass: wire up `--font-display` and apply to headings.

### 6c. Custom MDX component library

Build under `src/components/`:

| Component | Purpose | Audience tag |
|---|---|---|
| `<Hero>` | Landing hero with headline + CTAs | home |
| `<RoleCard>` | Developer / Institution / Trader landing tiles | home |
| `<ShieldedCallout type="note\|tip\|warning\|danger">` | Themed admonitions | all |
| `<FeeTable>` | Standardized fee table with staking tier rows | traders |
| `<EndpointCard method slug>` | API endpoint header with auth + rate-limit pills | devs |
| `<RateLimit tier>` | Inline rate-limit badge | devs |
| `<LanguageTabs>` | cURL / Python / TypeScript code tabs | devs |
| `<OrderFlowDiagram>` | Mermaid sequence diagrams for order lifecycle | all |
| `<AttestationBadge pcr0>` | TEE attestation hash display | institutions |
| `<ComparisonTable>` | Silhouette vs X tables (highly cited by AI) | all |
| `<CopyForLLMRow>` | Footer row with Copy + Open-in-ChatGPT/Claude/Cursor buttons | agents |
| `<AuthorByline name role date lastUpdated>` | Named attribution + freshness | all |
| `<GlossaryTerm term>` | Links to `/docs/glossary` anchor with `DefinedTerm` schema | all |

### 6d. Page template skeleton

```
┌─────────────────────────────────────────────────────────────────┐
│ [logo] Silhouette   Docs  Guides  API  Blog   [⌘K]   [→ App]    │ ← sticky, 56px
├──────────┬──────────────────────────────────────┬───────────────┤
│          │ Breadcrumb                           │  On this page │
│ Sidebar  │ ────────                             │  ────────     │
│ (flat,   │                                      │  Section 1    │
│ 2 deep)  │ H1 in Orbitron 500                   │  Section 2    │
│          │                                      │               │
│          │ Lead paragraph — definition-first    │               │
│          │ self-contained in 40–60 words.       │               │
│          │                                      │  ────────     │
│          │ ## Section H2                        │  Author       │
│          │ Content…                             │  Updated      │
│          │                                      │  Edit on GH   │
│          │ [Copy for LLM] [ChatGPT] [Claude]    │  [Feedback]   │
│          │                                      │               │
│          │ ← Previous    Next →                 │               │
└──────────┴──────────────────────────────────────┴───────────────┘
```

---

## 7. Voice and editorial system

### 7a. Voice rules (sitewide)

1. **Definition-first paragraph on every page.** Self-contained, 40–60 words, answers "what is this page about" to a reader arriving from Google.
2. **No em dashes.** Regular hyphens only.
3. **No buzzword stacking.** "Seamless," "cutting-edge," "leverage," "streamline," "robust" — banned.
4. **No symmetric parallelism.** One sentence's structure does not mirror the next.
5. **Active voice, concrete verbs.** "Silhouette encrypts your orders" not "Orders are encrypted by Silhouette."
6. **Stats with dates and sources.** "As of 2026-04-07, Silhouette passes 95% of its Hyperliquid volume discount back to takers." Not "we save you money."
7. **Named authors on technical pages.** Founding engineers or Wayne, with a one-line bio.
8. **Enemies are concrete.** Copytrade bots, signal-aware LPs, desks watching your wallet. Not "MEV."
9. **Editorial voice on concept pages; clinical voice on reference pages.** Mirrors the two-tree IA.

### 7b. Sample rewrite — home hero

**Current:**

- H1: "Welcome to Silhouette Docs"
- Sub: "Learn how to trade on Hyperliquid"

**Problems:** H1 targets no query. "Welcome" wastes the most valuable string on the site. Sub undersells — it's not a Hyperliquid tutorial site.

**Rewrite (recommended):**

> **Shielded trading on Hyperliquid.**
>
> Every trade on a public orderbook is a confession to copytrade bots, signal-aware LPs, and every desk watching your wallet. Silhouette encrypts your orders until match and passes 95% of the Hyperliquid volume discount back to you.
>
> `[Read the docs →]` `[Build on Silhouette →]`

**Why:** H1 is an exact match for "shielded trading hyperliquid" (priority #1 in the 20 target queries). Sub plants the narrative in one sentence, names the four concrete enemies, and follows with the hard stat. CTAs are role-routed.

### 7c. Sample rewrite — `/about-silhouette`

**Current opener (strongest sentence on the site):**

> "We sit between you and Hyperliquid's order book, processing your trade instructions while keeping your strategy, size, and intent confidential."

**Rewrite:**

> **What Silhouette is**
>
> Silhouette is a shielded perpetuals exchange on Hyperliquid. It sits between you and Hyperliquid's public order book, encrypting your orders inside a Trusted Execution Environment and settling them through delegated wallets so the market sees your fills but never your strategy, size, or identity.
>
> Shielded trading is not a dark pool. Dark pools fragment liquidity. Silhouette uses Hyperliquid's book directly — the deepest on-chain liquidity in crypto — and adds a confidentiality layer on top. You get the same prices, the same fills, and the same funding rates public traders get. You just stop broadcasting your intent.

110 words, three self-contained claims, two stats-adjacent facts, zero buzzwords. Princeton GEO target length.

### 7d. Sample rewrite — `/quickstart` lead

**Current:**

- H1: "Get trading on Silhouette in five steps..."

**Rewrite:**

> **Your first shielded trade**
>
> Placing a shielded trade on Silhouette takes about three minutes if you already hold HYPE or USDC on Hyperliquid. You will connect a wallet, switch from Naked to Shielded mode, sign the Silhouette onboarding message, deposit funds, and place your first encrypted order. The five steps below show each screen with annotations.
>
> **Before you start:** you need a wallet with HYPE or USDC on Hypercore and a browser that can run the Silhouette webapp (Chrome, Brave, Arc, or Firefox).

Then the 5 steps, each with an annotated screenshot and a "what to expect" callout.

---

## 8. Agentic layer

### 8a. Stack

| Layer | Package / file | Purpose |
|---|---|---|
| llms.txt + llms-full.txt + per-page .md | `@signalwire/docusaurus-plugin-llms-txt` | Replaces hand-maintained static llms.txt with plugin-generated output that stays in sync with the docs tree |
| Schema | `@stackql/docusaurus-plugin-structured-data` + per-page frontmatter | `TechArticle`, `FAQPage`, `HowTo`, `Organization`, `BreadcrumbList`, `DefinedTerm` |
| OpenAPI API reference | `@scalar/docusaurus` pointing at existing `api.silhouette.exchange/swagger/v0/json` | Interactive reference with try-it |
| robots.txt | `static/robots.txt` | Explicit allow-list for all modern AI bots including `Claude-SearchBot` |
| Copy-for-LLM buttons | Swizzled `@theme/DocItem/Layout` | Copy as Markdown / Open in ChatGPT / Open in Claude / Add to Cursor |
| MCP server (Phase 4) | Cloudflare Worker + `search_docs` / `get_page` / `list_pages` | Agent-native docs surface |

### 8b. robots.txt (drafted)

Explicit allow for: `Googlebot`, `Bingbot`, `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `anthropic-ai`, `Claude-Web`, `Google-Extended`, `PerplexityBot`, `Perplexity-User`, `Applebot`, `Applebot-Extended`, `Amazonbot`, `cohere-ai`, `Meta-ExternalAgent`, `CCBot`. Default `User-agent: *` = `Allow: /`. `Sitemap` directive referenced. Commented reference to `llms.txt` / `llms-full.txt` paths for agents that read comments.

### 8c. llms.txt pipeline

Current state: hand-maintained `static/llms.txt` (270 lines) that drifts from content and contains MEV language.

Target state: `@signalwire/docusaurus-plugin-llms-txt` generates both `llms.txt` and `llms-full.txt` at build time from the docs frontmatter + MDX. Per-page `.md` suffix routing is a free byproduct. The plugin respects frontmatter `description:`, page ordering, and categorized sections.

Migration: delete `static/llms.txt`, configure the plugin to produce the same H1/summary/sections, verify the diff in a dry build before merging. Keep the hand-written `What is Silhouette?` summary paragraph as the plugin's `siteDescription` config — that's the single bit of hand-crafted copy worth preserving.

### 8d. Schema markup per page type

| Page type | Schemas |
|---|---|
| Home | `Organization` (with `sameAs` → X, GitHub, Messari, DeFiLlama, CoinGecko, Wikipedia) + `WebSite` + `SoftwareApplication` |
| Concept / reference pages | `TechArticle` + `BreadcrumbList` |
| FAQ page | `FAQPage` |
| Quickstart / guides | `HowTo` + `TechArticle` |
| Glossary | `DefinedTermSet` with `DefinedTerm` per entry |
| Blog posts | `Article` + author `Person` with `sameAs` |
| API reference | `TechArticle` with `proficiencyLevel: Expert` |

### 8e. Copy-for-LLM row

Swizzle `@theme/DocItem/Layout` to inject a client component at the bottom of every docs page:

- **Copy as Markdown** → fetches `window.location.pathname + '.md'` and writes to clipboard
- **Open in ChatGPT** → `https://chat.openai.com/?q=<encoded prompt with page markdown>`
- **Open in Claude** → `https://claude.ai/new?q=<...>`
- **Add to Cursor** → Cursor deeplink `cursor://anysphere.cursor-deeplink/...`

Visual: icon-only buttons in a row, aligned right under the article body, above prev/next pagination. Uses `--accent-secondary-text` (`#4dfff6`) on hover.

---

## 9. Blog CMS — Notion pipeline (Phase 3)

**Pattern:** custom ~200-line Node/TS sync script + GitHub Action (cron every 15 min + `workflow_dispatch` + `repository_dispatch` webhook). Script uses `@notionhq/client` + `notion-to-md@alpha` + `gray-matter` + `p-limit`. Commits generated markdown + downloaded images back to `blog/` under a `silhouette-notion-bot` identity.

**Notion DB schema:** Title / Slug / Status / Publish Date / Authors (multi-select validated against `blog/authors.yml`) / Tags / Excerpt / Cover Image / SEO Title / SEO Description / Last Synced / Last Sync Status / Sync Error.

**Migration:** hand-migrate the 6 existing posts into Notion (paste-markdown handles 90%). Leave the original `.md` files in git for two sync cycles, then delete in a separate PR. The prune step in the sync script only touches files with `notion_page_id` in frontmatter, so hand-written posts are safe.

**Image handling:** download to `blog/images/`, filenames hashed by `{pageId-short}-{blockId-short}.{ext}` so reruns don't churn git.

**Guardrails:** Action runs `pnpm build` dry-check before committing; validates authors against `authors.yml`; fails loudly with `Sync Error` written back to Notion; uses a new blog-DB-scoped integration token (not the CRM token).

---

## 10. Content gap list (ranked by impact)

| # | Page | Phase | Why |
|---|---|---|---|
| 1 | `/docs/why-silhouette` | 2 | Comparison page. Targets "silhouette vs hyperliquid," "silhouette vs aster," "best privacy dex 2026." Comparison tables are ~33% of all AI citations. |
| 2 | `/docs/concepts/strategy-leakage` | 2 | Replaces MEV framing. Category-defining. |
| 3 | `/docs/concepts/copytrade-exposure` | 2 | The concrete enemy. |
| 4 | `/docs/concepts/signaling-risk` | 2 | The institutional angle. |
| 5 | `/docs/concepts/adverse-selection` | 2 | LP-side framing. |
| 6 | `/guides/for-developers/` landing + "Build an autonomous trading agent" recipe | 2 | The agentic story. |
| 7 | `/guides/for-institutions/` landing | 2 | DD target. |
| 8 | `/docs/architecture/tee-attestation` | 2 | PCR0 hashes, verification, reproducible builds. Institutional proof page. |
| 9 | `/docs/security/audits`, `/bug-bounty`, `/reproducible-builds` | 2 | Trust surface. |
| 10 | `/docs/glossary` | 2 | `DefinedTerm` schema for every domain term. |
| 11 | `/docs/changelog` | 2 | Freshness signal, RSS feed, freshness compounds with AI citation. |
| 12 | `/guides/comparisons/*` (6 pages) | 2 | Highest-citation-share content format. |
| 13 | `/docs/api/rate-limits`, `/errors`, `/websocket` | 2 | Dev-side gaps. |
| 14 | `/docs/concepts/naked-vs-shielded` | 2 | Comparison table. |
| 15 | `/docs/trading/funding-rates`, `/margin-and-leverage`, `/liquidations` | 2 | Trading reference gaps. |
| 16 | `/guides/for-developers/building-a-market-making-bot` | 2 | High-value dev guide. |
| 17 | `/guides/for-traders/common-mistakes` | 2 | High-value trader guide. |

---

## 11. Target queries (20)

Ordered by commercial value. Each needs a dedicated page, `TechArticle` + `FAQPage` schema, 3+ cited external sources, a last-updated date, a named byline, and a Copy-for-LLM row.

**Top-of-funnel awareness (9)**

1. shielded trading hyperliquid
2. what is a shielded dex
3. how to trade privately on hyperliquid
4. how to stop copytrade bots on hyperliquid
5. private perpetuals exchange
6. defi dark pool 2026
7. hide order size hyperliquid
8. institutional privacy defi trading
9. tee-based dex

**Comparison (5)**

10. silhouette vs hyperliquid
11. silhouette vs aster hidden orders
12. silhouette vs renegade
13. best privacy dex 2026
14. tee vs zk for defi privacy

**Implementation / developer (6)**

15. how to place a shielded order on hyperliquid
16. silhouette api documentation
17. how to integrate silhouette into a trading bot
18. silhouette websocket api
19. silhouette fees and rebates
20. silhouette tee attestation

Note: "MEV protection hyperliquid" was removed from the original 20 and replaced with more concrete strategy-leakage queries per the Section 1a reframe.

---

## 12. Phased build plan

Three phases plus a parallel Phase 4 distribution track that starts the day Phase 1 ships.

### Phase 1 — Look, feel, and findability

*Everything that changes how the site presents itself to humans and agents, without rewriting content.*

**Visual shell**

- Rewrite `src/css/custom.css` against `tokens.json` (zinc scale, magenta/cyan accents, surfaces, borders, status colors)
- Load Orbitron + IBM Plex Mono + Inter via `stylesheets` array; wire `--ifm-heading-font-family: var(--font-display)`
- Remove `static/img/main-bg.png` background; adopt solid `--bg-base`
- Build the MDX component library listed in §6c
- Rewrite home page (`src/pages/index.tsx`) with role-based tiles + new hero copy
- Implement two-tree IA: add `/guides` Docusaurus `@docusaurus/plugin-content-docs` second instance; update sidebars; update header nav
- Restructure existing docs into new sidebar categories (move files, add redirects)

**Agentic hygiene (bundled because it's the same theme and config surface)**

- Ship `static/robots.txt` with explicit AI allow-list
- Install `@signalwire/docusaurus-plugin-llms-txt`; delete `static/llms.txt`; configure plugin to generate `llms.txt` + `llms-full.txt` + per-page `.md` suffix routing
- Install `@stackql/docusaurus-plugin-structured-data`; add `Organization` + `WebSite` + `SoftwareApplication` JSON-LD sitewide; default `TechArticle` + `BreadcrumbList` on every docs page
- Swizzle `@theme/DocItem/Layout`; inject `<CopyForLLMRow>` component (Copy / ChatGPT / Claude / Cursor buttons)
- Enable `showLastUpdateTime` + `showLastUpdateAuthor` in docs plugin config
- Configure `@docusaurus/plugin-sitemap` with `<lastmod>` on every entry
- Bulk pass: add `description:` frontmatter to every existing page (stub OK, content pass owns rewrites)
- Add `<link rel="alternate" type="text/markdown">` tags in head

**Measurement baseline**

- Sign up for ZipTie at $69/mo
- Record baseline for the 20 target queries across ChatGPT / Perplexity / Google AI Overviews / Gemini / Claude web
- Create a Google Sheet for monthly tracking

**Phase 1 outcome:** site looks like the webapp, every page has the agentic layer wired even if the content is still the current copy, baseline metrics captured, foundation is done.

**Phase 1 exit criteria:**

- `docs.silhouette.exchange` loads with Orbitron H1s on the new home page
- `docs.silhouette.exchange/robots.txt` returns 200 with explicit AI allow-list
- `docs.silhouette.exchange/llms.txt` returns 200 from the plugin (not the static file)
- `docs.silhouette.exchange/llms-full.txt` returns 200
- `docs.silhouette.exchange/quickstart.md` returns raw markdown
- Every page renders with a Copy-for-LLM row and a last-updated date
- `view-source` on home shows `Organization` + `WebSite` JSON-LD in head
- Rich Results Test passes on home + one concept page
- Two-tree IA is navigable (header has Docs + Guides + Blog)
- Lighthouse visual regression diff passes in PR
- Wayne signs off on the visual shell

### Phase 2 — Content and what's missing

*Rewrite hero pages with the new voice. Build the missing pages. Ship the proof surfaces. Turn the shell into a product.*

**Voice pass on existing pages**

- `/docs/introduction` — rewrite per §7c sample
- `/docs/quickstart` — rewrite per §7d sample, add real screenshots, add HowTo schema
- `/docs/trading/shielded-trading` — add Mermaid sequence diagram, add `<ComparisonTable>` vs Naked
- `/docs/trading/fees` — surface "95% volume discount passthrough" as the hero stat
- `/docs/architecture/overview` — replace ASCII diagram with Mermaid sequence diagrams
- `/docs/faq` — add `FAQPage` JSON-LD, rewrite any thin answers
- All concept pages — add definition-first paragraph, named author, last-updated

**Build missing pages (per §10 content gap list)**

- `/docs/why-silhouette` with comparison tables
- `/docs/concepts/strategy-leakage`, `/copytrade-exposure`, `/signaling-risk`, `/adverse-selection`
- `/docs/glossary` with `DefinedTerm` schema
- `/docs/changelog` as second Docusaurus blog plugin instance with RSS
- `/docs/architecture/tee-attestation` + `/threat-model`
- `/docs/security/audits`, `/bug-bounty`, `/reproducible-builds`
- `/docs/api/rate-limits`, `/errors`, `/websocket`
- `/docs/concepts/naked-vs-shielded`
- `/docs/trading/funding-rates`, `/margin-and-leverage`, `/liquidations`

**Guides tree population**

- `/guides/for-developers/` landing + "Build an autonomous trading agent" recipe + "Building a market-making bot" + "Integrating Silhouette into a trading frontend" + "Testnet playbook"
- `/guides/for-institutions/` landing + "Compliance and custody" + "Attestation walkthrough" + "Onboarding your desk" + "Reporting and audit trail"
- `/guides/for-traders/` landing + "Your first shielded trade" + "Choosing an order type" + "Understanding fees" + "Common mistakes"
- `/guides/comparisons/` — the 6 vs-pages

**API reference**

- Install `@scalar/docusaurus`
- Point at `https://api.silhouette.exchange/swagger/v0/json`
- Render interactive API reference at `/docs/api/reference`
- Add language tabs (cURL / Python / TypeScript)
- Retire hand-written endpoint pages (keep redirects)

**Screenshot pass**

- Puppeteer the marketing site and all public docs surfaces
- For auth-gated flows (Naked→Shielded toggle, Connect Shielded, Deposit, Order submission), Wayne captures manually per an explicit shot-list produced during implementation

**Phase 2 exit criteria:**

- All 20 target queries have a dedicated page with schema, byline, last-updated, cited sources, Copy-for-LLM row
- `/docs/api/reference` is the Scalar-rendered OpenAPI view
- All sample rewrites from §7 are live
- Screenshot pass complete for public surfaces; shot-list delivered to Wayne for auth-gated flows
- Vale (style linter) passes on every page
- Wayne signs off on content

### Phase 3 — Blog hosting

*Non-technical team can publish from Notion. The six existing posts survive the migration.*

- Create Notion Blog DB with the schema in §9; share with new integration (NOT the CRM token)
- Write `scripts/sync-notion-blog.ts` per the research log
- Write `.github/workflows/sync-notion-blog.yml` (cron 15min + workflow_dispatch + repository_dispatch)
- Add `pnpm sync:notion` + `pnpm sync:notion:dry` scripts to `package.json`
- Add GitHub secrets: `NOTION_TOKEN`, `NOTION_BLOG_DB_ID`
- Local dry run against one test Notion page
- Hand-migrate the 6 existing posts into Notion
- First end-to-end live run with `create-pull-request` wrapper (safer for first 2 weeks)
- After 2 sync cycles: delete original `blog/*.md` files in a separate PR
- Add Vale step to the sync Action for brand voice linting
- One-page Notion doc for non-tech editors on how to publish

**Phase 3 exit criteria:**

- Publishing a post in Notion → live on docs.silhouette.exchange within 15 minutes
- Non-technical team member successfully publishes a post unaided
- Sync failures surface in Notion (`Sync Error` property) and Slack
- Existing 6 posts render identically to before the migration

### Phase 4 — Distribution (parallel, post-Phase-1, non-blocking)

*Not part of the docs overhaul. Starts the day Phase 1 ships and runs in parallel with Phases 2–3. Flagged here so it doesn't disappear.*

- **MCP server** on Cloudflare Worker at `mcp.silhouette.exchange/docs`, exposing `search_docs(query)`, `get_page(path)`, `list_pages()`. Stretch: `get_fee_schedule()`, `get_funding_rate(market)` as read-only on-chain tools. Get listed in `context7` registry. Announce on X with a walkthrough.
- **Wikipedia draft** — drafted by Wayne with legal review. Target: published within 180 days.
- **Third-party entity presence** — pitch Messari, DeFiLlama, CoinGecko, CoinMarketCap listings with full metadata. Update the `Organization` JSON-LD `sameAs` array as each lands.
- **Reddit + community presence** — genuine, helpful explainers in r/CryptoCurrency, r/Hyperliquid, r/defi that naturally reference Silhouette.
- **ZipTie monthly report** — tracks the baseline vs current for 20 target queries. First report at 30 days, then monthly.
- **X announcement** — the "we rebuilt our docs and shipped an MCP server" launch post, timed to Phase 2 wrap.

---

## 13. Success metrics

| Metric | Baseline 2026-04-07 | 90 days | 180 days |
|---|---|---|---|
| Overall grade | 3/10 | 7/10 | 9/10 |
| Pages with `description:` frontmatter | ~0/50 | 100% | 100% |
| Pages with last-updated + author | 0/50 | 100% | 100% |
| `llms.txt` plugin-generated (not hand-maintained) | No | Yes | Yes |
| `llms-full.txt` shipped | No | Yes | Yes |
| Per-page `.md` routing | No | Yes | Yes |
| `robots.txt` explicitly allows modern AI bots | Missing | Yes | Yes |
| JSON-LD beyond BreadcrumbList | 0 pages | 100% docs pages | 100% |
| AI citations for "shielded trading hyperliquid" | brand-only | category-owning | category-owning |
| AI citations for "privacy dex hyperliquid" | 0 | 1 of top 5 | 2 of top 5 |
| AI citations for "how to stop copytrade bots hyperliquid" | 0 | 1 of top 5 | 2 of top 5 |
| Pages from `llms.txt` cited verbatim in ChatGPT answers | 0 | 3+ | 10+ |
| Blog posts shipped trailing 90d | 1 | 12 | 12 |
| Third-party entity presence (Wiki / Messari / DeFiLlama / CMC / CoinGecko) | 0 | 3 | 5 |
| MCP server installs (via context7) | n/a | 50+ | 500+ |
| "Build an autonomous trading agent" recipe exists | No | Yes | Yes |
| OpenAPI-rendered API reference with language tabs | No | Yes | Yes |

---

## 14. Open questions / needs from Wayne

These block no work but will change implementation details. Answering during Phase 1 is ideal.

1. **Webapp CSS source.** `app.silhouette.exchange` returned 403 to the research agent. If there's a Silhouette webapp repo with `tailwind.config` + `globals.css`, share the path so tokens are reconciled against the live system and not just `tokens.json`. Otherwise `tokens.json` is authoritative.
2. **Motion tokens.** `tokens.json` doesn't export durations or easings. Current design doc defaults are `120 / 200 / 320 / 480ms` with `cubic-bezier(0.4, 0, 0.2, 1)`. Confirm or replace with the app's real motion presets.
3. **Screenshots for auth-gated flows.** Puppeteer handles marketing site and public docs. For Naked→Shielded toggle, Connect Shielded, Deposit dialog, and Order submission, Wayne needs to capture. A shot-list will be delivered during Phase 2.
4. **Author bylines.** Who's on the masthead? Wayne for editorial, Jason / Chandler / Stent / Rory / Ciaran for technical posts, or do we name founding engineers for credibility? Named authors with credentials give +25–30% citation lift per the Princeton GEO study.
5. **Orbitron on docs.** Confirm Orbitron matching marketing 1:1. It's a strong geometric display face — great for brand, heavier reading cost on long headings. Fallback plan: Inter Display for H2-H6 and keep Orbitron only on H1 (home + page headers).
6. **Changelog content source.** Git tags? Internal Slack? Notion? Or start fresh from today?
7. **Wikipedia page authorship.** Wayne drafts, legal reviews, or Silhouette engages someone external? Blocking criterion: notability per Wikipedia's NCRYPTO guidelines (need multiple independent secondary sources — fundraise coverage + RockawayX + Impossible Finance + DL News should qualify).
8. **Testnet access for agents.** For the "Build an autonomous trading agent" recipe, can agents get an unmetered testnet API key? Having the recipe work out of the box with a public testnet key is a force multiplier.

---

## 15. Ground-truth corrections to the original audit

The research audit scored the site 3/10 with the assumption that `llms.txt` was 404. That was a bot fetch failure — verified via `curl -sI`, the file returns 200. Corrections to the audit, logged for transparency:

| Audit claim | Correction |
|---|---|
| `llms.txt` is 404 | **False.** `static/llms.txt` exists (270 lines, hand-maintained). It contains MEV language that needs correcting, drifts from content, and has no plugin automation. Phase 1 replaces it with plugin-generated. |
| `robots.txt` is "indeterminate" | **Confirmed 404.** Needs shipping. |
| Meta descriptions missing | Confirmed. |
| No dates/authors | Confirmed. |
| No OpenAPI rendering | Confirmed, but OpenAPI **spec exists** at `api.silhouette.exchange/swagger/v0/json`. Phase 2 just points Scalar at it rather than writing a spec. |
| `/fees` → 404 | Confirmed. Needs 301 to `/docs/trading/fees`. |
| AI visibility near zero for category queries | Confirmed. |

Net: baseline score moves from 3/10 → ~3.5/10 (the existing llms.txt is worth something, even hand-maintained). Target state unchanged.

---

## 16. Approval

This design doc was approved by Wayne on 2026-04-07 with the following directives:

1. Drop "MEV protection" framing sitewide; replace with strategy leakage, copytrade exposure, signaling risk, and adverse selection.
2. Structure the build into 3 phases (Look & Feel → Content → Blog) with a parallel non-blocking Phase 4 distribution track.
3. Phase 1 bundles visual overhaul with agentic hygiene (llms.txt, robots.txt, schema, Copy-for-LLM) because they share the same files and swizzles. Decoupling them defers the biggest lever.
4. MCP server, Wikipedia, third-party listings live in Phase 4 (parallel), not in the core overhaul.

Next step: `superpowers:writing-plans` turns each phase into an executable implementation plan with tasks, acceptance criteria, and verification commands, saved alongside this doc.

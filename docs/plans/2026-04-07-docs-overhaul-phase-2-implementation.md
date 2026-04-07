# Docs Overhaul — Phase 2 Implementation Plan (Scaffold)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to expand this scaffold into full bite-sized tasks BEFORE execution. REQUIRED SUB-SKILL: Use superpowers:executing-plans once expanded.

**Status:** Scaffold only. Expand to full task-by-task plan at Phase 2 kickoff.

**Goal:** Turn the Phase 1 shell into a product by rewriting every hero page with the new voice, building the missing pages, rendering the real OpenAPI spec, and shipping the proof surfaces institutions and agents need to trust Silhouette.

**Depends on:** Phase 1 merged to `main`. Requires answers to open questions in the design doc §14 (author bylines, Orbitron confirmation, auth-gated screenshots, OpenAPI spec stability, changelog content source).

**Design doc:** [`2026-04-07-silhouette-docs-overhaul-design.md`](./2026-04-07-silhouette-docs-overhaul-design.md)

**Exit criteria (Phase 2 is DONE when all true):**

- [ ] All 20 target queries have a dedicated page with schema, byline, last-updated, cited sources, Copy-for-LLM row
- [ ] `/docs/api/reference` is Scalar-rendered OpenAPI view against `api.silhouette.exchange/swagger/v0/json`
- [ ] Home, `/about-silhouette`, `/quickstart`, `/trading/shielded-trading`, `/architecture/overview` all rewritten to new voice
- [ ] All concept pages (`strategy-leakage`, `copytrade-exposure`, `signaling-risk`, `adverse-selection`, `hyperliquid-integration`, `naked-vs-shielded`) shipped with real content
- [ ] All new architecture/security pages (`tee-attestation`, `threat-model`, `audits`, `bug-bounty`, `reproducible-builds`) shipped
- [ ] `/docs/glossary` populated with `DefinedTerm` schema per entry
- [ ] `/docs/changelog` shipped with RSS feed
- [ ] `/guides/for-developers`, `/guides/for-institutions`, `/guides/for-traders`, `/guides/comparisons` populated
- [ ] "Build an autonomous trading agent" recipe live at `/guides/for-developers/build-an-autonomous-trading-agent`
- [ ] Six comparison pages shipped under `/guides/comparisons/`
- [ ] Screenshot pass complete for public surfaces; shot-list delivered to Wayne for auth-gated flows
- [ ] Vale passes on every page
- [ ] `FAQPage` schema on `/faq`, `HowTo` schema on `/quickstart` and all for-traders guides
- [ ] Every page has real (non-stub) `description:` frontmatter
- [ ] Wayne signs off on content

---

## Task groups (expand each into bite-sized tasks at kickoff)

### Group A — API reference via Scalar (Week 1 of Phase 2)

1. Install `@scalar/docusaurus` and wire to `api.silhouette.exchange/swagger/v0/json`
2. Render interactive API reference at `/docs/api/reference`
3. Configure language tabs: cURL / Python SDK / TypeScript (community)
4. Add `TechArticle` + `proficiencyLevel: Expert` JSON-LD
5. Retire hand-written `docs/10-api/03-reference.md` (keep a 301 redirect)
6. Ship `/docs/api/rate-limits` with real current rate-limit tier data
7. Ship `/docs/api/errors` with the full error-code table
8. Ship `/docs/api/websocket` with subscription channels + message formats
9. Add `@site/src/components/EndpointCard` MDX component and use it on each endpoint
10. Add `@site/src/components/LanguageTabs` MDX component wrapping Docusaurus Tabs
11. Add `@site/src/components/RateLimit` pill component

### Group B — Voice pass on existing hero pages (Week 1-2)

1. `/about-silhouette` — apply the design doc §7c rewrite
2. `/quickstart` — apply §7d rewrite, capture real screenshots, add `HowTo` schema
3. `/trading/shielded-trading` — add Mermaid sequence diagram, `ComparisonTable` vs Naked
4. `/trading/fees` — surface "95% volume discount passthrough" as the page hero stat
5. `/architecture/overview` — replace ASCII with Mermaid sequence diagrams
6. `/faq` — add `FAQPage` JSON-LD, rewrite any thin answers, add named authors
7. `/trading/naked-trading` — voice pass
8. `/trading/order-types` — voice pass, add comparison table
9. `/architecture/tee`, `/architecture/smart-contract`, `/architecture/hyperliquid` — voice pass + named author bylines

### Group C — New concept pages (Week 2-3)

1. `/concepts/shielded-trading` — full content, replaces Phase 1 stub
2. `/concepts/tee` — TEE primer for non-cryptographers + attestation link-out
3. `/concepts/strategy-leakage` — the new category story. Cite academic sources on front-running and alpha decay. Comparison table vs naked trading.
4. `/concepts/copytrade-exposure` — concrete copytrade bot behavior. Cite known incidents.
5. `/concepts/signaling-risk` — institutional framing. Cite traditional-finance dark-pool literature.
6. `/concepts/adverse-selection` — LP-side framing. Cite Kyle (1985) and modern market microstructure.
7. `/concepts/hyperliquid-integration` — how Silhouette sits on top
8. `/concepts/naked-vs-shielded` — the canonical comparison table

### Group D — Architecture and security (Week 2-3)

1. `/architecture/tee-attestation` — PCR0 hashes, verification steps, reproducible builds, `AttestationBadge` component usage
2. `/architecture/threat-model` — adversary model, trust assumptions, what breaks under what
3. `/security/audits` — audit report links (pending real reports)
4. `/security/bug-bounty` — program details (pending legal sign-off)
5. `/security/reproducible-builds` — how to verify the enclave image

### Group E — Trading reference gaps (Week 3)

1. `/trading/funding-rates` — how funding is computed, paid, and displayed
2. `/trading/margin-and-leverage` — cross vs isolated, max leverage per market
3. `/trading/liquidations` — liquidation mechanics on shielded positions

### Group F — Glossary + changelog (Week 3)

1. `/glossary` — build `DefinedTerm` schema MDX component, populate ~30 terms
2. `/changelog` — set up second Docusaurus blog plugin instance, enable RSS, seed with real release notes from git tags + Slack archive

### Group G — Guides tree content (Week 3-4)

1. `/guides/for-developers/index` — landing hub with 4 tile CTAs
2. `/guides/for-developers/building-a-market-making-bot` — full walkthrough
3. `/guides/for-developers/integrating-silhouette-into-a-trading-frontend` — frontend integration
4. `/guides/for-developers/running-a-shielded-twap-strategy` — TWAP playbook
5. `/guides/for-developers/build-an-autonomous-trading-agent` — THE agentic recipe. Python + Claude SDK example. This is the flagship Phase 2 deliverable.
6. `/guides/for-developers/testnet-playbook` — testnet onboarding + API key flow
7. `/guides/for-institutions/index` — landing hub
8. `/guides/for-institutions/compliance-and-custody` — compliance surface
9. `/guides/for-institutions/attestation-walkthrough` — step-by-step TEE attestation verify
10. `/guides/for-institutions/onboarding-your-desk` — how a desk brings Silhouette in
11. `/guides/for-institutions/reporting-and-audit-trail` — what auditors see
12. `/guides/for-traders/index` — landing hub
13. `/guides/for-traders/your-first-shielded-trade` — narrative version of quickstart
14. `/guides/for-traders/choosing-an-order-type` — decision tree
15. `/guides/for-traders/understanding-fees` — the fee story with worked examples
16. `/guides/for-traders/common-mistakes` — the postmortem angle

### Group H — Comparison pages (Week 4)

1. `/guides/comparisons/silhouette-vs-hyperliquid-public` — the primary comparison
2. `/guides/comparisons/silhouette-vs-aster-hidden-orders` — vs the closest competitor
3. `/guides/comparisons/silhouette-vs-renegade` — vs the other TEE DEX
4. `/guides/comparisons/silhouette-vs-penumbra` — vs the ZK competitor
5. `/guides/comparisons/tee-vs-zk-for-defi-privacy` — educational, cite-magnet
6. `/guides/comparisons/silhouette-vs-cow-batch-auctions` — vs batch-auction private pools

### Group I — Schema markup pass (Week 4, runs alongside content)

1. Add `FAQPage` JSON-LD to `/faq`
2. Add `HowTo` JSON-LD to `/quickstart`
3. Add `HowTo` JSON-LD to each `/guides/for-traders/*`
4. Add `DefinedTerm` schema to `/glossary` entries
5. Add `TechArticle` JSON-LD to all concept + architecture + security pages
6. Verify every new page passes Rich Results Test

### Group J — Screenshot pass (Week 4)

1. Puppeteer script captures marketing site + public docs screenshots
2. Generate shot-list for Wayne for auth-gated flows:
   - Connect Wallet dialog
   - Naked/Shielded toggle
   - Connect Shielded flow
   - Deposit dialog
   - First shielded order submission
   - Order fill confirmation
3. Wayne captures and uploads to `static/img/flows/`
4. Wire captured screenshots into relevant guides and quickstart

### Group K — Description frontmatter real pass

1. Replace all stub `description:` frontmatter from Phase 1 Task 6 with real, hand-written 150-char descriptions optimized for SERPs

### Group L — Vale clean pass

1. Run `vale docs/` and `vale guides/` across the entire tree
2. Fix every warning
3. Add any new brand-voice rules to `.vale/styles/` as discovered

### Group M — Phase 2 ZipTie re-baseline

1. Re-run the 20-query baseline
2. Diff against the Phase 1 snapshot
3. Document in `docs/plans/ai-visibility-baseline-2026-04-07.md` as "Phase 1 shipped snapshot"

---

## Notes for expansion

When expanding this scaffold into a full plan, use the Phase 1 plan as the format template. Each group above should become 5–15 bite-sized tasks with:

- Exact file paths
- Complete content (not "rewrite X" — actually include the new content as code blocks)
- Screenshots needed per task
- Schema markup code per task
- Commit messages per task
- Acceptance criteria per task

**Phase 2 expansion is an engineering task in its own right.** Budget for a focused session to write the full task-level plan before any content work starts, and block that session on Wayne answering the open questions in design doc §14 (especially authors and screenshot access).

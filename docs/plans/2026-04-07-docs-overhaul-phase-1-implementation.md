# Docs Overhaul — Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship the look, feel, layout, information architecture, and agentic findability foundation for `docs.silhouette.exchange` in a single integrated sprint. Turns the site from a Docusaurus default install into a MAG7-tier shell that matches the Silhouette webapp 1:1, with full agentic plumbing (llms.txt, robots.txt, schema, Copy-for-LLM, dates, authors) wired before any content rewrites.

**Architecture:** Stay on Docusaurus 3.9. Replace the current `src/css/custom.css` token schema with `tokens.json`-derived values. Wire Orbitron + Inter + IBM Plex Mono. Bundle three new Docusaurus plugins (`@signalwire/docusaurus-plugin-llms-txt`, `@stackql/docusaurus-plugin-structured-data`, `@scalar/docusaurus` — the last one is Phase 2, noted here for reference). Swizzle `@theme/DocItem/Layout` for the Copy-for-LLM row. Build a custom MDX component library. Restructure sidebars into a two-tree IA with a second `@docusaurus/plugin-content-docs` instance for `/guides`. Ship a static `robots.txt`. Add stub `description:` frontmatter to every existing page. Delete `static/llms.txt` and replace with plugin-generated output. No content rewrites in Phase 1.

**Tech Stack:** Docusaurus 3.9.2, React 19, TypeScript, pnpm, MDX, Mermaid, Orbitron / Inter / IBM Plex Mono (Google Fonts), custom CSS properties, Swizzle (eject), GitHub Actions (existing), Vale (existing).

**Design doc:** [`2026-04-07-silhouette-docs-overhaul-design.md`](./2026-04-07-silhouette-docs-overhaul-design.md) — read this first.

**Branch:** `docs/overhaul-plan-2026-04-07` (already created, tracking `origin/main`).

**Exit criteria (Phase 1 is DONE when all true):**

- [ ] `docs.silhouette.exchange` loads with Orbitron H1s on a new home page
- [ ] `/robots.txt` returns 200 with explicit AI allow-list
- [ ] `/llms.txt` returns 200 from the plugin (not from `static/`)
- [ ] `/llms-full.txt` returns 200
- [ ] `/quickstart.md` returns raw markdown
- [ ] Every page renders with a Copy-for-LLM row and a "Last updated" line
- [ ] `view-source` on `/` shows `Organization` + `WebSite` JSON-LD in head
- [ ] Rich Results Test passes on home + one concept page
- [ ] Two-tree IA is navigable (header has Docs + Guides + Blog)
- [ ] `pnpm build` completes with zero errors and `onBrokenLinks: throw` intact
- [ ] Wayne signs off on the visual shell

---

## Prerequisites

Before starting, verify:

```bash
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
git branch --show-current
# Expected: docs/overhaul-plan-2026-04-07

git status
# Expected: clean, or only the committed design doc

node --version
# Expected: >= 18

pnpm --version
# Expected: 9.x
```

If `git branch --show-current` is not `docs/overhaul-plan-2026-04-07`, STOP and switch to that branch. Never execute tasks on another branch (per standing rule in `CLAUDE.md`).

Read the following before the first task:

- `/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs/docusaurus.config.ts` — current config
- `/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs/sidebars.ts` — current sidebar
- `/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs/src/css/custom.css` — current tokens
- `/Users/waynempro/Desktop/Projects/Silhouette Exchange/tokens.json` — source of truth for visual tokens
- `/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs/docs/plans/2026-04-07-silhouette-docs-overhaul-design.md` — the design doc

---

## Task 1: Ship static robots.txt

**Files:**

- Create: `static/robots.txt`

**Step 1: Confirm current state is 404**

```bash
curl -sI https://docs.silhouette.exchange/robots.txt | head -1
```

Expected: `HTTP/2 404`.

**Step 2: Write the file**

Create `static/robots.txt` with the following content:

```
# robots.txt for docs.silhouette.exchange
# Last updated: 2026-04-07
# Policy: allow all AI crawlers. Docs exist to be cited.

# ---------- Standard search ----------
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

# ---------- OpenAI / ChatGPT ----------
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# ---------- Anthropic / Claude ----------
User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

# ---------- Google Gemini / AI Overviews ----------
User-agent: Google-Extended
Allow: /

# ---------- Perplexity ----------
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# ---------- Apple Intelligence ----------
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# ---------- Other serious AI players ----------
User-agent: Amazonbot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Diffbot
Allow: /

User-agent: CCBot
Allow: /

# ---------- Block noisy scrapers with no citation value ----------
User-agent: Bytespider
Disallow: /

User-agent: MJ12bot
Disallow: /

# ---------- Default ----------
User-agent: *
Allow: /

# ---------- Sitemaps ----------
Sitemap: https://docs.silhouette.exchange/sitemap.xml

# ---------- LLM context files (not a robots standard, for humans/agents reading this) ----------
# llms.txt: https://docs.silhouette.exchange/llms.txt
# llms-full.txt: https://docs.silhouette.exchange/llms-full.txt
```

**Step 3: Verify the file builds into the output**

```bash
pnpm build
ls build/robots.txt
```

Expected: file exists in `build/robots.txt`.

**Step 4: Commit**

```bash
git add static/robots.txt
git commit -m "feat(seo): ship robots.txt with explicit AI bot allow-list

Ships robots.txt allowing all modern AI search bots including
Claude-SearchBot, GPTBot, OAI-SearchBot, PerplexityBot, and
Google-Extended. Blocks Bytespider and MJ12bot as low-value
scrapers. References sitemap and llms.txt paths.

Part of Phase 1 agentic hygiene."
```

---

## Task 2: Install and configure `@signalwire/docusaurus-plugin-llms-txt`

**Files:**

- Modify: `package.json`
- Modify: `docusaurus.config.ts`
- Delete: `static/llms.txt` (the hand-maintained one)

**Step 1: Install the package**

```bash
pnpm add -D @signalwire/docusaurus-plugin-llms-txt
```

Expected: package appears in `devDependencies`. Record the exact version that lands.

**Step 2: Read the plugin README**

Use WebFetch on `https://www.npmjs.com/package/@signalwire/docusaurus-plugin-llms-txt` and on the GitHub repo `https://github.com/signalwire/docusaurus-plugins/tree/main/packages/docusaurus-plugin-llms-txt` to confirm the current config API. If the option names below have changed, adapt them.

**Step 3: Add the plugin to `docusaurus.config.ts`**

In the `plugins:` array (currently only contains `localSearch`), append:

```ts
[
  '@signalwire/docusaurus-plugin-llms-txt',
  {
    // Site-level metadata
    siteTitle: 'Silhouette',
    siteDescription:
      'Silhouette is a shielded perpetuals exchange on Hyperliquid. Orders are encrypted inside a Trusted Execution Environment and settled through delegated wallets, so the market sees fills but never strategy, size, or identity. Silhouette passes 95% of its Hyperliquid volume discount back to takers.',

    // What to index
    include: ['docs/**/*.md', 'docs/**/*.mdx', 'blog/**/*.md', 'blog/**/*.mdx'],
    exclude: ['docs/_*.md', 'docs/**/_*.md', 'docs/plans/**'],

    // Output three artefacts
    generateLLMsTxt: true,
    generateLLMsFullTxt: true,
    generatePerPageMarkdown: true,

    // Link descriptions come from frontmatter description, fall back to first paragraph
    descriptionFromFrontmatter: 'description',
    fallbackToFirstParagraph: true,

    // Category mapping to llms.txt sections
    categories: [
      { label: 'Getting Started', match: ['introduction', 'quickstart'] },
      { label: 'Core Concepts', match: ['concepts/**'] },
      { label: 'Trading', match: ['trading/**', 'fees', 'referrals'] },
      { label: 'Architecture', match: ['architecture/**'] },
      { label: 'Security', match: ['security/**'] },
      { label: 'API Reference', match: ['api/**'] },
      { label: 'SDKs', match: ['sdk/**', 'sdk'] },
      { label: 'Guides', match: ['guides/**'] },
      { label: 'Glossary', match: ['glossary', 'faq'] },
      { label: 'Optional', match: ['changelog'] },
    ],
  },
],
```

**Note:** exact option names depend on the plugin version. If the plugin uses different names (e.g. `docs: { include: ... }`), adapt but keep the same semantics.

**Step 4: Delete the old hand-maintained llms.txt**

```bash
git rm static/llms.txt
```

**Step 5: Build and verify the plugin generates the files**

```bash
pnpm build
ls build/llms.txt build/llms-full.txt
```

Expected: both files exist. Open `build/llms.txt` and confirm:

- H1 is `# Silhouette`
- `> Silhouette is a shielded perpetuals exchange on Hyperliquid...` appears as the blockquote summary
- Sections match the category list above
- Links end in `.md`

Open `build/llms-full.txt` and confirm it's a concatenation of all docs pages.

Check per-page markdown generation:

```bash
ls build/quickstart.md build/about-silhouette.md
```

Expected: both files exist.

**Step 6: Run the dev server and confirm routing**

```bash
pnpm start
```

In another terminal:

```bash
curl -sI http://localhost:3000/llms.txt
curl -sI http://localhost:3000/llms-full.txt
curl -sI http://localhost:3000/quickstart.md
```

Expected: all three return 200.

Kill the dev server when done.

**Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml docusaurus.config.ts static/llms.txt
git commit -m "feat(agentic): replace hand-maintained llms.txt with plugin-generated

Installs @signalwire/docusaurus-plugin-llms-txt and configures it
to generate llms.txt, llms-full.txt, and per-page .md routing.
Deletes the hand-maintained static/llms.txt (270 lines, drifted
from content, contained MEV language).

Plugin output stays in sync with docs frontmatter automatically.
Per-page .md routing unlocks the Copy-for-LLM button pattern
and raw-markdown fetches by agents.

Part of Phase 1 agentic hygiene."
```

---

## Task 3: Install and configure `@stackql/docusaurus-plugin-structured-data`

**Files:**

- Modify: `package.json`
- Modify: `docusaurus.config.ts`

**Step 1: Install**

```bash
pnpm add -D @stackql/docusaurus-plugin-structured-data
```

**Step 2: Add plugin config**

Append to `plugins:` array in `docusaurus.config.ts`:

```ts
[
  '@stackql/docusaurus-plugin-structured-data',
  {
    verbose: true,
    featureFlags: {
      structuredData: {
        excludePaths: ['/search'],
      },
    },
    structuredData: {
      organization: {
        '@type': 'Organization',
        name: 'Silhouette Exchange',
        legalName: 'Silhouette Exchange',
        url: 'https://silhouette.exchange',
        logo: 'https://docs.silhouette.exchange/img/silhouette-title-logo.svg',
        sameAs: [
          'https://x.com/silhouette_ex',
          'https://t.me/silhouette_exchange',
          'https://github.com/silhouette-exchange',
        ],
        description:
          'Silhouette is a shielded perpetuals exchange on Hyperliquid. Orders are encrypted inside a Trusted Execution Environment and settled through delegated wallets.',
      },
      website: {
        '@type': 'WebSite',
        url: 'https://docs.silhouette.exchange',
        name: 'Silhouette Docs',
        description:
          'Documentation for Silhouette, the shielded perpetuals exchange on Hyperliquid.',
        publisher: {
          '@type': 'Organization',
          name: 'Silhouette Exchange',
        },
      },
      softwareApp: {
        '@type': 'SoftwareApplication',
        name: 'Silhouette Exchange',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://app.silhouette.exchange',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      breadcrumbLD: true,
      sitePage: true,
    },
  },
],
```

**Note:** option names may differ between plugin versions. Check the plugin README at `https://github.com/stackql/docusaurus-plugin-structured-data` and adapt.

**Step 3: Build and verify JSON-LD in head**

```bash
pnpm build
grep -c "application/ld+json" build/index.html
```

Expected: count >= 3 (Organization + WebSite + SoftwareApplication + BreadcrumbList).

**Step 4: Validate with Rich Results Test**

Deploy to a preview URL (or use `pnpm serve` locally and tunnel via ngrok if needed) and run:

- `https://search.google.com/test/rich-results?url=<preview-url>`

Expected: no errors on Organization, WebSite, or BreadcrumbList.

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml docusaurus.config.ts
git commit -m "feat(agentic): add JSON-LD structured data via @stackql plugin

Ships sitewide Organization, WebSite, and SoftwareApplication
JSON-LD with sameAs links to X, Telegram, and GitHub. Per-page
BreadcrumbList is auto-generated.

Paves the way for per-page TechArticle, FAQPage, HowTo, and
DefinedTerm schemas to be added in Phase 2 content rewrites.

Part of Phase 1 agentic hygiene."
```

---

## Task 4: Enable last-updated dates and authors

**Files:**

- Modify: `docusaurus.config.ts`

**Step 1: Update docs preset config**

In `docusaurus.config.ts`, inside `presets.classic.docs`, add:

```ts
docs: {
  sidebarPath: require.resolve('./sidebars.ts'),
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
  editUrl: 'https://github.com/silhouette-exchange/public-docs/tree/main/',
},
```

Do the same for the blog config:

```ts
blog: {
  showReadingTime: true,
  routeBasePath: '/docs/blog',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
  editUrl: 'https://github.com/silhouette-exchange/public-docs/tree/main/',
},
```

**Step 2: Build and verify**

```bash
pnpm build
```

Open `build/quickstart/index.html` in a browser (or grep for "Last updated"):

```bash
grep -c "Last updated" build/quickstart/index.html
```

Expected: count >= 1.

**Step 3: Commit**

```bash
git add docusaurus.config.ts
git commit -m "feat(seo): enable last-updated dates, authors, and edit-on-github links

Enables showLastUpdateTime, showLastUpdateAuthor, and editUrl on
both docs and blog presets. Freshness signal + named attribution
are top citation-rate boosters per Princeton GEO study (+25-30%).

Edit-on-github links double as trust signals and contributor
onboarding path.

Part of Phase 1 agentic hygiene."
```

---

## Task 5: Configure sitemap with `<lastmod>`

**Files:**

- Modify: `docusaurus.config.ts`

**Step 1: Add sitemap plugin config**

The classic preset already bundles `@docusaurus/plugin-sitemap`. Add to `presets.classic`:

```ts
sitemap: {
  changefreq: 'weekly',
  priority: 0.7,
  ignorePatterns: ['/plans/**'],
  filename: 'sitemap.xml',
  lastmod: 'date',
},
```

**Step 2: Build and verify**

```bash
pnpm build
grep -c "<lastmod>" build/sitemap.xml
```

Expected: count matches the number of docs pages (~50).

**Step 3: Commit**

```bash
git add docusaurus.config.ts
git commit -m "feat(seo): add <lastmod> to sitemap entries

Enables lastmod on sitemap.xml. Perplexity and Google AI Overviews
weight freshness heavily; currently sitemap has zero lastmod
entries. Ignores /plans/** since those are internal design docs.

Part of Phase 1 agentic hygiene."
```

---

## Task 6: Bulk-add stub `description:` frontmatter

**Files:**

- Modify: every `.md` and `.mdx` under `docs/` that lacks a `description:` field

**Step 1: Write a one-off script**

Create `scripts/stub-descriptions.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DOCS_DIR = path.resolve(__dirname, '../docs');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue;
    if (entry.name === 'plans') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function stub(file: string): boolean {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  if (parsed.data.description) return false;

  // Use the H1 as fallback stub description
  const h1Match = parsed.content.match(/^#\s+(.+)$/m);
  const stub = h1Match
    ? `${h1Match[1]} — Silhouette Exchange documentation.`
    : `${path.basename(file, path.extname(file))} — Silhouette Exchange documentation.`;

  parsed.data.description = stub;
  fs.writeFileSync(file, matter.stringify(parsed.content, parsed.data), 'utf8');
  return true;
}

const files = walk(DOCS_DIR);
let changed = 0;
for (const f of files) if (stub(f)) changed++;
console.log(`Stubbed ${changed} of ${files.length} files`);
```

**Step 2: Install `gray-matter` if missing**

```bash
pnpm add -D gray-matter tsx
```

**Step 3: Run it**

```bash
pnpm tsx scripts/stub-descriptions.ts
```

Expected output: `Stubbed ~40 of ~50 files` (some already have descriptions).

**Step 4: Verify the diff is sane**

```bash
git diff docs/ | head -60
```

Confirm the only change per file is an added `description:` line in frontmatter.

**Step 5: Build to confirm nothing broke**

```bash
pnpm build
```

Expected: build succeeds with `onBrokenLinks: 'throw'`.

**Step 6: Commit**

```bash
git add docs/ scripts/stub-descriptions.ts package.json pnpm-lock.yaml
git commit -m "chore(seo): bulk-add stub description frontmatter to docs pages

Every page now has a description: field in frontmatter so Docusaurus
emits <meta name=\"description\"> and the llms.txt plugin gets clean
per-page descriptions. Stubs are H1-derived placeholders that will
be rewritten with real marketing copy in Phase 2.

Part of Phase 1 agentic hygiene."
```

---

## Task 7: Rewrite `src/css/custom.css` tokens to match webapp

**Files:**

- Modify: `src/css/custom.css` (full token block rewrite; keep accessibility/focus sections)

**Step 1: Read the current file in full**

```bash
wc -l src/css/custom.css
```

Expected: ~3100 lines. Read it in chunks (2000-line Read limit) and note:

- Which selectors reference `--brand-teal-*` and `--brand-pink-*` (to replace)
- Which selectors reference `--gray-*` (to replace with zinc)
- The `main-bg.png` background rule (to remove)
- The focus ring rule (keep as-is; already correct)
- The sidebar shadow rule (keep, promote to token)

**Step 2: Replace the `:root` token block**

Replace lines 8–185 (the `:root` block) with the new canonical tokens from the design doc §6a. Full token CSS is in `docs/plans/2026-04-07-silhouette-docs-overhaul-design.md` but the authoritative source is the visual-capture research report:

```css
:root {
  /* ============================================
     SILHOUETTE DESIGN SYSTEM — canonical
     Source: tokens.json + silhouette.exchange
     ============================================ */

  /* ---------- Brand primitives ---------- */
  --silh-magenta-100: #fa00ff;
  --silh-magenta-tint-50: #fd80ff;
  --silh-magenta-tint-70: #feb3ff;
  --silh-magenta-alpha-10: #fa00ff19;
  --silh-magenta-alpha-20: #fa00ff33;

  --silh-cyan-100: #00fff2;
  --silh-cyan-tint-30: #4dfff6;
  --silh-cyan-tint-40: #66fff7;
  --silh-cyan-tint-50: #80fff9;

  --silh-lilac-100: #ce7fff;

  --silh-red: #ff3da1;
  --silh-red-tint: #ff65b4;
  --silh-green: #55ffd7;
  --silh-green-tint: #88ffe3;

  --silh-hl-light: #97fce4;
  --silh-hl-medium: #50d2c1;

  /* ---------- Zinc neutral scale ---------- */
  --silh-zinc-50:  #f9f9f9;
  --silh-zinc-100: #f4f4f5;
  --silh-zinc-200: #e4e4e7;
  --silh-zinc-300: #d4d4d8;
  --silh-zinc-400: #a1a1aa;
  --silh-zinc-500: #71717a;
  --silh-zinc-600: #52525b;
  --silh-zinc-700: #3f3f46;
  --silh-zinc-800: #27272a;
  --silh-zinc-900: #18181b;
  --silh-zinc-950: #09090b;

  /* ---------- Semantic — surfaces ---------- */
  --bg-base:       #13161a;
  --bg-secondary:  #18181b;
  --bg-tertiary:   #27272a;
  --bg-card:       rgba(255, 255, 255, 0.04);
  --bg-modal:      #1c1f23;
  --bg-muted:      #171717;
  --bg-overlay:    rgba(0, 0, 0, 0.16);

  /* ---------- Semantic — text ---------- */
  --text-default:   #f9f9f9;
  --text-secondary: #d4d4d8;
  --text-muted:     #a1a1aa;
  --text-tertiary:  #71717a;
  --text-inverse:   #09090b;
  --text-label:     #94fff9;
  --text-success:   #88ffe3;
  --text-error:     #ff65b4;

  /* ---------- Semantic — borders ---------- */
  --border-subtle:     rgba(255, 255, 255, 0.04);
  --border-default:    #27272a;
  --border-strong:     #3f3f46;
  --border-contrast:   #71717a;
  --border-ui:         #1c1c21;
  --border-soft-white: rgba(255, 255, 255, 0.16);

  /* ---------- Accent roles ---------- */
  --accent-primary:       var(--silh-magenta-100);
  --accent-primary-text:  var(--silh-magenta-tint-50);
  --accent-primary-hover: var(--silh-magenta-tint-70);
  --accent-primary-muted: var(--silh-magenta-alpha-20);

  --accent-secondary:       var(--silh-cyan-100);
  --accent-secondary-text:  var(--silh-cyan-tint-30);
  --accent-secondary-hover: var(--silh-cyan-tint-50);

  /* ---------- Status ---------- */
  --success:    var(--silh-green-tint);
  --success-bg: rgba(85, 255, 215, 0.12);
  --warning:    #fbbf24;
  --danger:     var(--silh-red-tint);
  --danger-bg:  rgba(255, 61, 161, 0.12);
  --info:       var(--silh-cyan-tint-30);

  /* ---------- Typography ---------- */
  --font-display: 'Orbitron', 'Inter', system-ui, sans-serif;
  --font-sans:    'Inter', system-ui, sans-serif;
  --font-mono:    'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  --fs-xs:   12px;
  --fs-sm:   14px;
  --fs-base: 16px;
  --fs-md:   18px;
  --fs-lg:   20px;
  --fs-xl:   22px;
  --fs-2xl:  28px;
  --fs-3xl:  36px;
  --fs-4xl:  48px;
  --fs-5xl:  64px;

  --lh-tight:   1.15;
  --lh-snug:    1.3;
  --lh-normal:  1.45;
  --lh-relaxed: 1.6;

  --tracking-tighter: -0.02em;
  --tracking-tight:   -0.01em;
  --tracking-normal:  0;
  --tracking-wide:    0.02em;
  --tracking-wider:   0.08em;
  --tracking-widest:  0.16em;

  --fw-regular:  400;
  --fw-medium:   500;
  --fw-semibold: 600;
  --fw-bold:     700;

  /* ---------- Radius ---------- */
  --radius-none: 0;
  --radius-xs:   2px;
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-xl:   12px;
  --radius-2xl:  16px;
  --radius-full: 9999px;

  /* ---------- Shadows ---------- */
  --shadow-sm:    0 1px 2px rgba(0, 0, 0, 0.25);
  --shadow-md:    0 4px 12px rgba(0, 0, 0, 0.30);
  --shadow-lg:    2px 0 8px rgba(0, 0, 0, 0.15);
  --shadow-xl:    0 16px 48px rgba(0, 0, 0, 0.50);
  --glow-cyan:    0 0 24px rgba(0, 255, 242, 0.35);
  --glow-magenta: 0 0 24px rgba(250, 0, 255, 0.35);

  /* ---------- Blur ---------- */
  --blur-sm: 4px;
  --blur-md: 9.55px;
  --blur-lg: 16px;
  --blur-xl: 24px;

  /* ---------- Spacing ---------- */
  --space-0:  0;
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-7:  28px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-14: 56px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  /* ---------- Motion ---------- */
  --dur-fast:      120ms;
  --dur-base:      200ms;
  --dur-slow:      320ms;
  --dur-slower:    480ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:      cubic-bezier(0, 0, 0.2, 1);
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);
  --ease-emphasis: cubic-bezier(0.2, 0.8, 0.2, 1);

  /* ---------- Docusaurus bridge ---------- */
  --ifm-background-color:      var(--bg-base);
  --ifm-color-primary:         var(--accent-secondary-text);
  --ifm-color-primary-dark:    var(--silh-cyan-100);
  --ifm-color-primary-darker:  var(--silh-cyan-100);
  --ifm-color-primary-light:   var(--silh-cyan-tint-50);
  --ifm-heading-color:         var(--text-default);
  --ifm-font-color-base:       var(--text-default);
  --ifm-font-family-base:      var(--font-sans);
  --ifm-heading-font-family:   var(--font-display);
  --ifm-font-family-monospace: var(--font-mono);
  --ifm-code-font-size: 92%;
  --focus-ring-color: var(--accent-secondary);

  --ifm-h1-font-size: var(--fs-3xl);
  --ifm-h2-font-size: var(--fs-2xl);
  --ifm-h3-font-size: var(--fs-lg);
  --ifm-h4-font-size: var(--fs-md);
  --ifm-h5-font-size: var(--fs-base);
  --ifm-h6-font-size: var(--fs-sm);

  --docusaurus-highlighted-code-line-bg: rgba(250, 0, 255, 0.10);
}
```

**Step 3: Delete `[data-theme='dark']` light-mode divergence**

The site is dark-only (config: `disableSwitch: true, defaultMode: 'dark'`). Consolidate to a single `:root` block. Delete any `[data-theme='dark']` overrides that restate the same dark values.

**Step 4: Remove the `main-bg.png` background**

Find the rule that sets `html { background-image: url('/img/main-bg.png'); ... }` and replace with:

```css
html {
  background: var(--bg-base);
}
```

Do not delete the file yet — Phase 2 may reuse it as a hero decoration.

**Step 5: Build**

```bash
pnpm build
```

Expected: build succeeds. If any `--gray-*` or `--brand-teal-*` or `--white-white*` tokens are still referenced, the build may succeed but visual regressions will appear. Grep for them:

```bash
grep -n "brand-teal\|brand-pink\|gray-1000\|white-white" src/css/custom.css
```

Replace each hit with the matching new token.

**Step 6: Visual spot check**

```bash
pnpm start
```

Open `http://localhost:3000/` and confirm:

- Background is solid `#13161a`
- Body text is `#f9f9f9`
- Links are cyan `#4dfff6`
- Sidebar text is readable
- Code blocks render

Kill the dev server.

**Step 7: Commit**

```bash
git add src/css/custom.css
git commit -m "feat(design): rewrite custom.css tokens to match webapp 1:1

Replaces the drifted token schema (bluish grays, wrong link color,
collapsed white opacities) with canonical zinc + magenta + cyan
tokens derived from tokens.json. Adds motion, shadow, and spacing
tokens that were previously missing.

Removes main-bg.png background in favor of solid --bg-base
matching the webapp.

Headings now use var(--font-display) (Orbitron) instead of Inter.
Orbitron font loading wired in Task 8.

Part of Phase 1 visual overhaul."
```

---

## Task 8: Load Orbitron and remove duplicate font imports

**Files:**

- Modify: `docusaurus.config.ts`

**Step 1: Current state**

The current `headTags` array already imports Inter, Orbitron, and IBM Plex Mono from Google Fonts. Verify by reading lines 45–82 of `docusaurus.config.ts`. If Orbitron is there, skip straight to verification. If not, add it.

**Step 2: Consolidate font loading**

Replace the current `headTags` array with `stylesheets` in the preset (Docusaurus-preferred pattern):

```ts
stylesheets: [
  {
    href: 'https://fonts.googleapis.com',
    rel: 'preconnect',
  },
  {
    href: 'https://fonts.gstatic.com',
    rel: 'preconnect',
    crossOrigin: 'anonymous' as const,
  },
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap',
    rel: 'stylesheet',
  },
],
```

Delete the old `headTags: [...]` block.

**Step 3: Build and verify**

```bash
pnpm build
grep "Orbitron" build/index.html
```

Expected: at least one match (the font stylesheet link).

**Step 4: Visual spot check**

```bash
pnpm start
```

Open `http://localhost:3000/quickstart` and confirm the H1 renders in Orbitron (not Inter). Check in browser devtools: inspect the H1, confirm `font-family` computed value starts with `Orbitron`.

**Step 5: Commit**

```bash
git add docusaurus.config.ts
git commit -m "feat(design): consolidate font loading under stylesheets preset config

Moves Inter, Orbitron, and IBM Plex Mono font loading from headTags
into the classic preset's stylesheets config. Uses preconnect + single
combined stylesheet URL for faster font load.

Orbitron now actually renders on headings; previously it was imported
but never applied because --ifm-heading-font-family was hardcoded to Inter.

Part of Phase 1 visual overhaul."
```

---

## Task 9: Build the MDX component library — `ShieldedCallout`

**Files:**

- Create: `src/components/ShieldedCallout/index.tsx`
- Create: `src/components/ShieldedCallout/styles.module.css`
- Create: `src/components/ShieldedCallout/ShieldedCallout.test.tsx` (optional; Docusaurus doesn't bundle a test runner by default)

**Rationale:** Themed admonitions that use the new magenta/cyan/success/danger tokens. Starts the component library. This is the smallest component, safest to build first.

**Step 1: Create the component**

Create `src/components/ShieldedCallout/index.tsx`:

```tsx
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type ShieldedCalloutType = 'note' | 'tip' | 'warning' | 'danger';

export interface ShieldedCalloutProps {
  type?: ShieldedCalloutType;
  title?: string;
  children: React.ReactNode;
}

export default function ShieldedCallout({
  type = 'note',
  title,
  children,
}: ShieldedCalloutProps) {
  return (
    <aside className={clsx(styles.callout, styles[type])}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
```

Create `src/components/ShieldedCallout/styles.module.css`:

```css
.callout {
  display: block;
  padding: var(--space-4) var(--space-5);
  margin: var(--space-6) 0;
  border-left: 2px solid var(--border-strong);
  background: var(--bg-card);
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-none);
  font-size: var(--fs-base);
  line-height: var(--lh-relaxed);
  color: var(--text-secondary);
}

.title {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

.body > :first-child { margin-top: 0; }
.body > :last-child  { margin-bottom: 0; }

.note    { border-left-color: var(--accent-secondary); }
.note    .title { color: var(--accent-secondary-text); }

.tip     { border-left-color: var(--success); }
.tip     .title { color: var(--success); }

.warning { border-left-color: var(--warning); }
.warning .title { color: var(--warning); }

.danger  { border-left-color: var(--danger); }
.danger  .title { color: var(--danger); }
```

**Step 2: Register globally in `docusaurus.config.ts`**

In `presets.classic.theme.customCss`, customCss is already wired. Components need to be registered via MDX `providerComponents`. Instead, use the easier pattern: create `src/theme/MDXComponents.tsx` (swizzle-less wrap):

```tsx
import MDXComponents from '@theme-original/MDXComponents';
import ShieldedCallout from '@site/src/components/ShieldedCallout';

export default {
  ...MDXComponents,
  ShieldedCallout,
};
```

This makes `<ShieldedCallout>` usable in any `.mdx` without imports.

**Step 3: Test it in an existing MDX page**

Edit `docs/07-architecture/overview.mdx` (if it exists) and add at the top of the body:

```mdx
<ShieldedCallout type="note" title="Under active development">
  Silhouette is currently under development. These docs and the information within them are subject to change.
</ShieldedCallout>
```

**Step 4: Build**

```bash
pnpm build
```

Expected: build succeeds. Open the rendered page and confirm the callout renders with the new styling.

**Step 5: Commit**

```bash
git add src/components/ShieldedCallout src/theme/MDXComponents.tsx docs/07-architecture/overview.mdx
git commit -m "feat(components): add ShieldedCallout MDX component

Themed admonitions (note/tip/warning/danger) that use the new
design tokens. Left-border accents map to --accent-secondary (note),
--success (tip), --warning (warning), --danger (danger).

Registered globally via src/theme/MDXComponents so any .mdx file
can use <ShieldedCallout> without imports.

First component in the Phase 1 MDX component library."
```

---

## Task 10: Build MDX components — `AuthorByline`

**Files:**

- Create: `src/components/AuthorByline/index.tsx`
- Create: `src/components/AuthorByline/styles.module.css`
- Modify: `src/theme/MDXComponents.tsx`

**Step 1: Create the component**

Create `src/components/AuthorByline/index.tsx`:

```tsx
import React from 'react';
import styles from './styles.module.css';

export interface AuthorBylineProps {
  name: string;
  role?: string;
  date?: string;
  lastUpdated?: string;
  sameAs?: string;
}

export default function AuthorByline({
  name,
  role,
  date,
  lastUpdated,
  sameAs,
}: AuthorBylineProps) {
  return (
    <div
      className={styles.byline}
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className={styles.avatar} aria-hidden>
        {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
      </div>
      <div className={styles.meta}>
        <div className={styles.name}>
          {sameAs ? (
            <a href={sameAs} itemProp="url" rel="author">
              <span itemProp="name">{name}</span>
            </a>
          ) : (
            <span itemProp="name">{name}</span>
          )}
        </div>
        {role && <div className={styles.role} itemProp="jobTitle">{role}</div>}
        <div className={styles.dates}>
          {date && (
            <time dateTime={date} itemProp="datePublished">
              Published {date}
            </time>
          )}
          {lastUpdated && (
            <time dateTime={lastUpdated} itemProp="dateModified">
              Updated {lastUpdated}
            </time>
          )}
        </div>
      </div>
    </div>
  );
}
```

Create `src/components/AuthorByline/styles.module.css`:

```css
.byline {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-4) 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  margin: var(--space-6) 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--accent-primary-muted);
  color: var(--accent-primary-text);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  display: grid;
  place-items: center;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  flex-shrink: 0;
}

.meta { display: flex; flex-direction: column; gap: 2px; }

.name {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-default);
}
.name a { color: inherit; text-decoration: none; }
.name a:hover { color: var(--accent-secondary-text); }

.role {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.dates {
  display: flex;
  gap: var(--space-4);
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}
```

**Step 2: Register in MDXComponents**

Add to `src/theme/MDXComponents.tsx`:

```tsx
import AuthorByline from '@site/src/components/AuthorByline';

export default {
  ...MDXComponents,
  ShieldedCallout,
  AuthorByline,
};
```

**Step 3: Use it on one existing page**

Add to the bottom of `docs/01-about-silhouette.md`:

```mdx
<AuthorByline
  name="Wayne"
  role="Head of Growth, Silhouette"
  date="2026-04-07"
  sameAs="https://x.com/WaynesWorldza"
/>
```

**Step 4: Build + visual check**

```bash
pnpm build
pnpm start
```

Open `http://localhost:3000/about-silhouette` and confirm the byline renders. Kill server.

**Step 5: Commit**

```bash
git add src/components/AuthorByline src/theme/MDXComponents.tsx docs/01-about-silhouette.md
git commit -m "feat(components): add AuthorByline MDX component

Named author attribution with Person schema microdata. Renders
initials-avatar + name + role + published/updated dates. Link to
sameAs (typically X handle) if provided.

Princeton GEO study: named author with credentials gives
+25-30% AI citation lift.

Part of Phase 1 MDX component library."
```

---

## Task 11: Build MDX components — `ComparisonTable`, `RoleCard`, `Hero`

**Rationale:** Three components in one task because each is straightforward and they're composition primitives for the home page rewrite (Task 14).

**Files:**

- Create: `src/components/ComparisonTable/{index.tsx,styles.module.css}`
- Create: `src/components/RoleCard/{index.tsx,styles.module.css}`
- Create: `src/components/Hero/{index.tsx,styles.module.css}`
- Modify: `src/theme/MDXComponents.tsx`

**Step 1: ComparisonTable**

```tsx
// src/components/ComparisonTable/index.tsx
import React from 'react';
import styles from './styles.module.css';

export interface ComparisonColumn { label: string; accent?: boolean; }
export interface ComparisonRow { criterion: string; values: (string | React.ReactNode)[]; }
export interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  caption?: string;
}

export default function ComparisonTable({ columns, rows, caption }: ComparisonTableProps) {
  return (
    <figure className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" />
            {columns.map((c, i) => (
              <th key={i} scope="col" className={c.accent ? styles.accent : ''}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th scope="row">{r.criterion}</th>
              {r.values.map((v, j) => <td key={j}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
```

```css
/* src/components/ComparisonTable/styles.module.css */
.wrap {
  margin: var(--space-6) 0;
  overflow-x: auto;
  border: 1px solid var(--border-default);
  background: var(--bg-card);
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
  font-variant-numeric: tabular-nums;
}
.table th,
.table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-default);
  text-align: left;
  vertical-align: top;
}
.table thead th {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
  background: var(--bg-secondary);
}
.table thead th.accent {
  color: var(--accent-primary-text);
  background: var(--accent-primary-muted);
}
.table tbody th {
  font-weight: var(--fw-medium);
  color: var(--text-default);
  width: 28%;
}
.table tbody td { color: var(--text-secondary); }
.wrap figcaption {
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
  border-top: 1px solid var(--border-subtle);
}
```

**Step 2: RoleCard**

```tsx
// src/components/RoleCard/index.tsx
import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface RoleCardProps {
  role: 'developer' | 'institution' | 'trader';
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
}

export default function RoleCard({ role, title, description, href, ctaLabel = 'Start here' }: RoleCardProps) {
  return (
    <Link to={href} className={`${styles.card} ${styles[role]}`}>
      <div className={styles.tag}>{role}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.cta}>{ctaLabel} →</div>
    </Link>
  );
}
```

```css
/* src/components/RoleCard/styles.module.css */
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  color: var(--text-default);
  text-decoration: none !important;
  transition: background var(--dur-base) var(--ease-standard),
              border-color var(--dur-base) var(--ease-standard);
  min-height: 240px;
}
.card:hover {
  background: var(--bg-secondary);
  border-color: var(--border-strong);
  text-decoration: none !important;
}
.tag {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--text-muted);
}
.card.developer   .tag { color: var(--accent-secondary-text); }
.card.institution .tag { color: var(--accent-primary-text); }
.card.trader      .tag { color: var(--silh-lilac-100); }
.title {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: var(--fw-medium);
  color: var(--text-default);
  margin: 0;
}
.description {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  flex-grow: 1;
  margin: 0;
}
.cta {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent-secondary-text);
  margin-top: var(--space-4);
}
```

**Step 3: Hero**

```tsx
// src/components/Hero/index.tsx
import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface HeroCTA { label: string; href: string; variant?: 'primary' | 'secondary'; }
export interface HeroProps {
  headline: string;
  sub: string;
  ctas?: HeroCTA[];
}

export default function Hero({ headline, sub, ctas = [] }: HeroProps) {
  return (
    <section className={styles.hero}>
      <h1 className={styles.headline}>{headline}</h1>
      <p className={styles.sub}>{sub}</p>
      {ctas.length > 0 && (
        <div className={styles.ctaRow}>
          {ctas.map((c, i) => (
            <Link
              key={i}
              to={c.href}
              className={`${styles.cta} ${c.variant === 'secondary' ? styles.secondary : styles.primary}`}
            >
              {c.label} →
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
```

```css
/* src/components/Hero/styles.module.css */
.hero {
  padding: var(--space-16) var(--space-6) var(--space-12);
  max-width: 900px;
  margin: 0 auto;
}
.headline {
  font-family: var(--font-display);
  font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
  font-weight: var(--fw-medium);
  line-height: var(--lh-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-default);
  margin: 0 0 var(--space-5);
}
.sub {
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0 0 var(--space-8);
}
.ctaRow {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  font-weight: var(--fw-medium);
  text-decoration: none !important;
  transition: all var(--dur-base) var(--ease-standard);
  min-height: 44px;
}
.primary {
  background: var(--accent-secondary);
  color: var(--text-inverse);
  border: 1px solid var(--accent-secondary);
}
.primary:hover {
  background: var(--accent-secondary-hover);
  box-shadow: var(--glow-cyan);
}
.secondary {
  background: transparent;
  color: var(--accent-primary-text);
  border: 1px solid var(--accent-primary-text);
}
.secondary:hover {
  background: var(--accent-primary-muted);
  box-shadow: var(--glow-magenta);
}
```

**Step 4: Register all three**

Update `src/theme/MDXComponents.tsx`:

```tsx
import MDXComponents from '@theme-original/MDXComponents';
import ShieldedCallout from '@site/src/components/ShieldedCallout';
import AuthorByline from '@site/src/components/AuthorByline';
import ComparisonTable from '@site/src/components/ComparisonTable';
import RoleCard from '@site/src/components/RoleCard';
import Hero from '@site/src/components/Hero';

export default {
  ...MDXComponents,
  ShieldedCallout,
  AuthorByline,
  ComparisonTable,
  RoleCard,
  Hero,
};
```

**Step 5: Build**

```bash
pnpm build
```

Expected: succeeds.

**Step 6: Commit**

```bash
git add src/components src/theme/MDXComponents.tsx
git commit -m "feat(components): add ComparisonTable, RoleCard, Hero components

Three composition primitives for the Phase 1 component library.
ComparisonTable is the highest-citation-rate content format per
competitive research (~33% of AI citations). RoleCard and Hero
power the new home page landing.

All three use the new design tokens and register globally via
MDXComponents.

Part of Phase 1 MDX component library."
```

---

## Task 12: Build the `CopyForLLMRow` component

**Files:**

- Create: `src/components/CopyForLLMRow/index.tsx`
- Create: `src/components/CopyForLLMRow/styles.module.css`

**Rationale:** The standalone component. Wiring it into every page happens in Task 13 via a theme swizzle.

**Step 1: Create the component**

```tsx
// src/components/CopyForLLMRow/index.tsx
import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

function getMarkdownUrl(pathname: string): string {
  // Drop trailing slash, append .md
  const clean = pathname.replace(/\/$/, '');
  return `${clean}.md`;
}

function buildPromptPrefix(): string {
  return 'Here are the Silhouette Exchange docs for the page I was just reading. Answer my follow-up questions using only what is in these docs when possible.\n\n';
}

export default function CopyForLLMRow(): JSX.Element {
  return (
    <BrowserOnly>
      {() => <CopyForLLMRowInner />}
    </BrowserOnly>
  );
}

function CopyForLLMRowInner(): JSX.Element {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const mdUrl = getMarkdownUrl(location.pathname);
  const absoluteMdUrl = typeof window !== 'undefined'
    ? new URL(mdUrl, window.location.origin).toString()
    : mdUrl;

  async function handleCopy() {
    try {
      const res = await fetch(mdUrl);
      if (!res.ok) throw new Error('markdown fetch failed');
      const md = await res.text();
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error(e);
      setCopied(false);
    }
  }

  function handleOpenInChatGPT() {
    const prompt = buildPromptPrefix() + `Source: ${absoluteMdUrl}`;
    window.open(
      `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  function handleOpenInClaude() {
    const prompt = buildPromptPrefix() + `Source: ${absoluteMdUrl}`;
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <div className={styles.row} aria-label="Open this page in an AI assistant">
      <span className={styles.label}>Use with AI</span>
      <button type="button" className={styles.btn} onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy as Markdown'}
      </button>
      <button type="button" className={styles.btn} onClick={handleOpenInChatGPT}>
        Open in ChatGPT
      </button>
      <button type="button" className={styles.btn} onClick={handleOpenInClaude}>
        Open in Claude
      </button>
      <a
        className={styles.btn}
        href={mdUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        View .md
      </a>
    </div>
  );
}
```

**Step 2: Styles**

```css
/* src/components/CopyForLLMRow/styles.module.css */
.row {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  flex-wrap: wrap;
  padding: var(--space-4) 0;
  margin: var(--space-8) 0 var(--space-4);
  border-top: 1px solid var(--border-subtle);
}
.label {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--text-muted);
  margin-right: var(--space-2);
}
.btn {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  text-transform: none;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none !important;
  min-height: 32px;
  transition: all var(--dur-base) var(--ease-standard);
}
.btn:hover {
  color: var(--accent-secondary-text);
  border-color: var(--accent-secondary-text);
  background: rgba(77, 255, 246, 0.06);
}
```

**Step 3: Build**

```bash
pnpm build
```

**Step 4: Commit**

```bash
git add src/components/CopyForLLMRow
git commit -m "feat(components): add CopyForLLMRow component

Standalone component providing Copy-as-Markdown, Open-in-ChatGPT,
Open-in-Claude, and View-.md buttons. Fetches the per-page .md
file (generated by @signalwire/docusaurus-plugin-llms-txt) for
the clipboard action.

BrowserOnly-wrapped so server render stays clean.

Will be wired into every docs page via theme swizzle in Task 13."
```

---

## Task 13: Swizzle `@theme/DocItem/Layout` to inject `CopyForLLMRow`

**Files:**

- Create (via swizzle): `src/theme/DocItem/Layout/index.tsx`
- Create: `src/theme/DocItem/Layout/styles.module.css` (if needed)

**Step 1: Swizzle the component**

```bash
pnpm run swizzle @docusaurus/theme-classic DocItem/Layout -- --eject --typescript
```

When prompted, confirm `y`. This copies the original into `src/theme/DocItem/Layout/index.tsx`.

**Step 2: Inject `CopyForLLMRow` above pagination**

Read the swizzled file. Find where the content body renders (usually a `<DocItemContent>` or similar inside a `<main>` or a `<div className="theme-doc-markdown markdown">`). Add just below the content body and before the footer/pagination:

```tsx
import CopyForLLMRow from '@site/src/components/CopyForLLMRow';

// ... inside the return JSX:
<DocItemContent>
  {children}
</DocItemContent>
<CopyForLLMRow />
<DocItemFooter />
```

Exact insertion point depends on the version of Docusaurus. The key is: between the MDX body and the footer/pagination block.

**Step 3: Build**

```bash
pnpm build
```

Expected: succeeds.

**Step 4: Visual verify**

```bash
pnpm start
```

Open any docs page (e.g. `/quickstart`) and confirm:

1. The Copy-for-LLM row renders below the content and above the prev/next nav
2. Clicking "Copy as Markdown" succeeds (toast says "Copied")
3. Clicking "Open in ChatGPT" opens a new tab to chat.openai.com with the prefilled query
4. Clicking "View .md" opens the raw markdown in a new tab

Kill dev server.

**Step 5: Commit**

```bash
git add src/theme/DocItem
git commit -m "feat(theme): swizzle DocItem/Layout to inject CopyForLLMRow

Ejects the DocItem/Layout theme component so every docs page renders
a Copy-for-LLM row (Copy as Markdown / Open in ChatGPT / Open in
Claude / View .md) between the content body and the prev/next nav.

Turns every docs page into an agent distribution surface. Matches
the Mintlify/Stripe/Anthropic pattern flagged in competitive research.

Part of Phase 1 agentic hygiene."
```

---

## Task 14: Rewrite `src/pages/index.tsx` as the new role-based home

**Files:**

- Modify: `src/pages/index.tsx` (currently the default Docusaurus landing)

**Rationale:** Replace the "Welcome to Silhouette Docs" default with the Hero + three RoleCards.

**Step 1: Read current state**

```bash
cat src/pages/index.tsx
```

**Step 2: Rewrite**

Replace the file with:

```tsx
import React from 'react';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import RoleCard from '@site/src/components/RoleCard';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Shielded trading on Hyperliquid"
      description="Silhouette is a shielded perpetuals exchange on Hyperliquid. Orders are encrypted until match. 95% of the Hyperliquid volume discount passes back to takers."
    >
      <Hero
        headline="Shielded trading on Hyperliquid."
        sub="Every trade on a public orderbook is a confession to copytrade bots, signal-aware LPs, and every desk watching your wallet. Silhouette encrypts your orders until match and passes 95% of the Hyperliquid volume discount back to you."
        ctas={[
          { label: 'Read the docs', href: '/about-silhouette', variant: 'primary' },
          { label: 'Build on Silhouette', href: '/api/', variant: 'secondary' },
        ]}
      />

      <section className={styles.roles}>
        <div className={styles.rolesGrid}>
          <RoleCard
            role="developer"
            title="Developers"
            description="Build bots, agents, and integrations against Silhouette's shielded API. OpenAPI spec, SDKs, rate limits, and a testnet quickstart."
            href="/api/"
            ctaLabel="API reference"
          />
          <RoleCard
            role="institution"
            title="Institutions"
            description="Due-diligence the TEE threat model, attestation walkthrough, audit reports, reproducible builds, and custody model in one place."
            href="/architecture/overview"
            ctaLabel="Security & architecture"
          />
          <RoleCard
            role="trader"
            title="Traders"
            description="Place your first shielded trade in about three minutes. Quickstart, fees, naked vs shielded, and common mistakes."
            href="/quickstart"
            ctaLabel="Quickstart"
          />
        </div>
      </section>
    </Layout>
  );
}
```

**Step 3: Create styles**

Create `src/pages/index.module.css`:

```css
.roles {
  padding: 0 var(--space-6) var(--space-16);
  max-width: 1200px;
  margin: 0 auto;
}
.rolesGrid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

**Step 4: Build + verify**

```bash
pnpm build
pnpm start
```

Open `http://localhost:3000/` and confirm:

- H1 in Orbitron reads "Shielded trading on Hyperliquid."
- Sub paragraph with the "confession" copy
- Three RoleCards below
- Clicking each card navigates correctly

Kill dev server.

**Step 5: Commit**

```bash
git add src/pages/index.tsx src/pages/index.module.css
git commit -m "feat(home): rewrite landing with role-based tiles and new hero

Replaces the default Docusaurus 'Welcome to Silhouette Docs'
landing with:
- Hero in Orbitron: 'Shielded trading on Hyperliquid.'
- Sub copy naming concrete enemies (copytrade bots, signal-aware
  LPs, desks watching wallets) instead of MEV
- '95% of Hyperliquid volume discount' as the hard stat
- Three RoleCards: Developers / Institutions / Traders

Routes each audience to their primary entry page instead of the
old What-is / Get-started / FAQ tile grid that optimized for
no one.

Part of Phase 1 layout."
```

---

## Task 15: Update `sidebars.ts` to match new IA (single-tree first pass)

**Rationale:** Two-tree IA (`/docs` + `/guides` with two separate plugin instances) is a bigger structural change. Phase 1 ships a single-tree update that at least restructures the existing content to match the planned categories, so navigation feels intentional. Full two-tree split is **Task 16**.

**Files:**

- Modify: `sidebars.ts`
- Modify: existing docs files (rename or move a few to align with new category slugs)

**Step 1: Read current sidebar**

Already read above. Current structure: About / Quickstart / Onboarding / Trading / Architecture / Fees / Referrals / FAQs / (divider) API / SDK / (divider) Brand links.

**Step 2: Draft new sidebar**

Replace `sidebars.ts` with:

```ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  Sidebar: [
    { type: 'doc', id: 'about-silhouette', label: 'Introduction' },
    { type: 'doc', id: 'quickstart', label: 'Quickstart' },

    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'concepts/shielded-trading',
        'concepts/tee',
        'concepts/strategy-leakage',
        'concepts/copytrade-exposure',
        'concepts/signaling-risk',
        'concepts/adverse-selection',
        'concepts/hyperliquid-integration',
        'concepts/naked-vs-shielded',
      ],
    },

    {
      type: 'category',
      label: 'Trading',
      collapsed: true,
      items: [
        'trading/shielded-trading',
        'trading/naked-trading',
        'trading/order-types',
        'trading/fees',
      ],
    },

    {
      type: 'category',
      label: 'Architecture',
      collapsed: true,
      items: [
        'architecture/overview',
        'architecture/tee',
        'architecture/smart-contract',
        'architecture/hyperliquid',
      ],
    },

    { type: 'doc', id: 'referrals', label: 'Referrals' },
    { type: 'doc', id: 'faq', label: 'FAQs' },
    { type: 'doc', id: 'glossary', label: 'Glossary' },

    { type: 'html', value: '<div class="sidebar-divider"></div>' },
    { type: 'html', value: '<div class="sidebar-section-title">For Developers</div>', className: 'sidebar-section-header' },

    {
      type: 'category',
      label: 'API',
      collapsed: true,
      items: [
        'api/index',
        'api/quick-start',
        'api/authentication',
        'api/reference',
        'api/troubleshooting',
        'api/openapi',
      ],
    },
    { type: 'doc', id: 'sdk', label: 'Python SDK' },

    { type: 'html', value: '<div class="sidebar-divider"></div>' },
    { type: 'html', value: '<div class="sidebar-section-title">Ecosystem</div>', className: 'sidebar-section-header' },

    { type: 'link', href: 'https://silhouette-exchange.notion.site/brand-kit', label: 'Brand Kit' },
    { type: 'link', href: 'https://app.silhouette.exchange', label: 'Launch App' },
    { type: 'link', href: 'https://silhouette.exchange', label: 'Website' },
    { type: 'link', href: 'https://x.com/silhouette_ex', label: 'X' },
    { type: 'link', href: 'https://t.me/silhouette_exchange', label: 'Telegram' },
  ],
};

export default sidebars;
```

**Step 3: Create stub files for any new IDs that don't exist yet**

The new sidebar references IDs that don't exist as pages (`concepts/*`, `glossary`). For Phase 1 we create **empty stub pages with a "Coming in Phase 2" callout** so the sidebar builds successfully. The actual content ships in Phase 2.

For each missing page, create a minimal file. Example:

```bash
mkdir -p docs/concepts
```

Create `docs/concepts/strategy-leakage.md`:

```md
---
title: Strategy leakage
sidebar_label: Strategy leakage
description: How public orderbook fills leak trading alpha to copytrade bots and signal-aware LPs, and how Silhouette prevents it.
---

# Strategy leakage

<ShieldedCallout type="note" title="Coming in Phase 2">
  This page is under active development and will ship as part of the Phase 2 content pass. For now, see [Shielded Trading](/trading/shielded-trading) for the current explanation of how Silhouette protects trading strategies.
</ShieldedCallout>
```

Repeat for: `concepts/shielded-trading`, `concepts/tee`, `concepts/copytrade-exposure`, `concepts/signaling-risk`, `concepts/adverse-selection`, `concepts/hyperliquid-integration`, `concepts/naked-vs-shielded`, `glossary`.

**Step 4: Build**

```bash
pnpm build
```

Expected: succeeds. If it fails on `onBrokenLinks: throw`, fix the broken IDs until clean.

**Step 5: Commit**

```bash
git add sidebars.ts docs/concepts docs/glossary.md
git commit -m "feat(ia): restructure sidebar to new category layout

Replaces the existing sidebar with the Phase 1 target structure:
- Introduction / Quickstart
- Core Concepts (strategy-leakage, copytrade-exposure, etc)
- Trading
- Architecture
- Referrals / FAQs / Glossary
- For Developers divider with API + SDK
- Ecosystem divider with external links

Creates stub pages for Core Concepts entries and Glossary with
'Coming in Phase 2' callouts so the build succeeds. Actual content
ships in Phase 2.

Part of Phase 1 layout."
```

---

## Task 16: Two-tree IA — add `/guides` plugin instance

**Rationale:** Full two-tree split. This task is deferred-friendly: if Phase 1 timeline is tight, ship Tasks 1-15 + 17-20 and do Task 16 at the start of Phase 2. But if there's appetite, do it now while the config is already being touched.

**Files:**

- Modify: `docusaurus.config.ts`
- Create: `guides/` directory at repo root
- Create: `guidesSidebars.ts`
- Create: minimal index MDX files for the three role landings

**Step 1: Add a second `@docusaurus/plugin-content-docs` instance**

Docusaurus supports multiple docs instances. Add to `plugins:` in `docusaurus.config.ts`:

```ts
[
  '@docusaurus/plugin-content-docs',
  {
    id: 'guides',
    path: 'guides',
    routeBasePath: 'guides',
    sidebarPath: require.resolve('./guidesSidebars.ts'),
    showLastUpdateTime: true,
    showLastUpdateAuthor: true,
    editUrl: 'https://github.com/silhouette-exchange/public-docs/tree/main/',
  },
],
```

**Step 2: Create `guidesSidebars.ts`**

```ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const guidesSidebars: SidebarsConfig = {
  guidesSidebar: [
    { type: 'doc', id: 'index', label: 'Guides' },
    {
      type: 'category',
      label: 'For Developers',
      collapsed: false,
      items: ['for-developers/index'],
    },
    {
      type: 'category',
      label: 'For Institutions',
      collapsed: false,
      items: ['for-institutions/index'],
    },
    {
      type: 'category',
      label: 'For Traders',
      collapsed: false,
      items: ['for-traders/index'],
    },
    {
      type: 'category',
      label: 'Comparisons',
      collapsed: true,
      items: ['comparisons/index'],
    },
  ],
};

export default guidesSidebars;
```

**Step 3: Create minimal index pages**

```bash
mkdir -p guides/for-developers guides/for-institutions guides/for-traders guides/comparisons
```

Create `guides/index.md`:

```md
---
title: Silhouette Guides
sidebar_label: Guides
description: How-to guides, integration walkthroughs, and comparison content for developers, institutions, and traders on Silhouette.
---

# Silhouette Guides

Narrative walkthroughs, integration playbooks, and comparisons. Pick a role to get started.

- [**For Developers**](/guides/for-developers) — Build bots, agents, and integrations.
- [**For Institutions**](/guides/for-institutions) — Due-diligence, onboarding, and compliance.
- [**For Traders**](/guides/for-traders) — Your first shielded trade, choosing order types, common mistakes.
- [**Comparisons**](/guides/comparisons) — Silhouette versus other venues.
```

Create the four subdirectory `index.md` files with the same "Coming in Phase 2" pattern as Task 15.

**Step 4: Add Guides to header nav**

In `docusaurus.config.ts`, update `themeConfig.navbar.items`:

```ts
navbar: {
  title: 'Silhouette',
  logo: {
    alt: 'Silhouette Exchange',
    src: 'img/silhouette-title-logo.svg',
    height: 18,
  },
  items: [
    { to: '/about-silhouette', label: 'Docs', position: 'left' },
    { to: '/guides', label: 'Guides', position: 'left', docsPluginId: 'guides' },
    { to: '/docs/blog', label: 'Blog', position: 'left' },
    { href: 'https://app.silhouette.exchange', label: 'Launch App', position: 'right' },
  ],
},
```

**Step 5: Build**

```bash
pnpm build
```

**Step 6: Verify**

Open `http://localhost:3000/guides` and confirm it renders, navigation between `/about-silhouette` and `/guides` works, and both show the correct sidebar.

**Step 7: Commit**

```bash
git add docusaurus.config.ts guidesSidebars.ts guides/
git commit -m "feat(ia): add second docs plugin instance for /guides narrative tree

Implements the two-tree IA: /docs stays as the reference tree
(evergreen, extractable, LLM-friendly); /guides is the narrative
tree (how-to, walkthroughs, comparisons).

Ships minimal index pages with 'Coming in Phase 2' stubs so the
build succeeds and navigation works. Phase 2 populates with real
content.

Updates header nav to show Docs / Guides / Blog.

Part of Phase 1 layout."
```

---

## Task 17: Add agent-friendly head tags to layout

**Files:**

- Modify: `docusaurus.config.ts` OR swizzle `src/theme/Root.tsx`

**Rationale:** `<link rel="alternate" type="text/markdown">` on every page tells agents where the .md version is. Different from the llms-txt plugin output.

**Step 1: Add via `themeConfig` `headTags`**

In `docusaurus.config.ts`, alongside the existing `themeConfig` section:

```ts
themeConfig: {
  // ... existing config ...
  metadata: [
    { name: 'theme-color', content: '#13161a' },
    { name: 'og:site_name', content: 'Silhouette Docs' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@silhouette_ex' },
  ],
  // ...
},
```

For the dynamic per-page `.md` alternate link, swizzle `src/theme/Root.tsx` or use a hook. Simpler path: add a client-side effect in `src/theme/Root.tsx`:

```bash
pnpm run swizzle @docusaurus/theme-classic Root -- --wrap --typescript
```

Then edit the wrapped `src/theme/Root/index.tsx`:

```tsx
import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    const existing = document.querySelector('link[rel="alternate"][type="text/markdown"]');
    if (existing) existing.remove();

    const link = document.createElement('link');
    link.rel = 'alternate';
    link.type = 'text/markdown';
    link.href = location.pathname.replace(/\/$/, '') + '.md';
    document.head.appendChild(link);
  }, [location.pathname]);

  return <>{children}</>;
}
```

**Step 2: Build + verify**

```bash
pnpm build
pnpm start
```

Open devtools on any page and confirm `<link rel="alternate" type="text/markdown" href="/quickstart.md">` appears in `<head>`.

**Step 3: Commit**

```bash
git add docusaurus.config.ts src/theme/Root
git commit -m "feat(agentic): add alternate text/markdown head link per page

Injects <link rel=\"alternate\" type=\"text/markdown\" href=\"...md\">
into every page's head so agents discovering a page via HTML know
where to fetch the clean markdown version.

Also adds theme-color, og:site_name, and twitter:card metadata.

Part of Phase 1 agentic hygiene."
```

---

## Task 18: ZipTie baseline measurement

**Files:** none (external account setup + Google Sheet)

**Rationale:** Not code, but listed as a plan task because it's a Phase 1 exit criterion. Baseline the 20 target queries before anything goes live.

**Step 1: Sign up**

- Go to `https://ziptie.dev/` and sign up for the $69/mo plan
- Add `docs.silhouette.exchange` as the tracked domain
- Add the 20 target queries from design doc §11

**Step 2: Create baseline Google Sheet**

Create a sheet at `Silhouette / Docs overhaul / AI visibility baseline 2026-04-07` with columns:

| Query | ChatGPT cited? | Perplexity cited? | Google AI Overview cited? | Gemini cited? | Claude (web) cited? | Competitor cited | Notes |
|---|---|---|---|---|---|---|---|

Run each of the 20 queries manually and fill in the baseline row.

**Step 3: Document in the repo**

Create `docs/plans/ai-visibility-baseline-2026-04-07.md`:

```md
---
title: AI visibility baseline 2026-04-07
description: Pre-overhaul baseline of Silhouette docs AI citation rate across 20 target queries.
---

# AI visibility baseline — 2026-04-07

Baseline captured before Phase 1 ships. Tracked via ZipTie + manual Google Sheet. Source sheet: [link when created].

## Summary

- Queries tracked: 20
- Queries where Silhouette is cited (any platform): [fill in]
- Queries where Silhouette dominates (cited by 3+ platforms): [fill in]

## Baseline findings

(Paste the sheet as a markdown table here once the 20-query pass is done)

## Measurement cadence

- **Monthly** ZipTie report
- **Quarterly** manual re-run of the 20-query Google Sheet pass
- **Phase exit checkpoints** at end of Phase 1, Phase 2, Phase 3
```

**Step 4: Commit**

```bash
git add docs/plans/ai-visibility-baseline-2026-04-07.md
git commit -m "docs(plans): capture AI visibility baseline pre-overhaul

Baseline measurement of 20 target queries across ChatGPT, Perplexity,
Google AI Overviews, Gemini, and Claude web. Captured 2026-04-07
before Phase 1 ships.

Tracks via ZipTie ($69/mo) plus a manual Google Sheet for monthly
re-runs. Phase 1 exit criterion.

Part of Phase 1 measurement baseline."
```

---

## Task 19: Full build + broken-link sweep + performance sanity check

**Files:** none (verification task)

**Step 1: Clean build**

```bash
pnpm clear
pnpm build 2>&1 | tee build.log
```

Expected: exits 0, no `[ERROR]` lines.

**Step 2: Grep for broken links warnings**

```bash
grep -i "broken" build.log
```

Expected: zero hits (onBrokenLinks is 'throw' so any broken link would have failed the build; this is a belt-and-braces check).

**Step 3: Inspect build output**

```bash
ls -la build/
du -sh build/
```

Confirm:

- `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml` all present
- A handful of `.md` files at the top level (per-page markdown)
- `index.html` present
- `assets/css/*.css` + `assets/js/*.js` present

**Step 4: Serve and Lighthouse spot-check**

```bash
pnpm serve &
# wait a sec, then:
curl -s http://localhost:3000/ | grep -E "ld\+json|alternate.*markdown" | head
```

Expected: sees JSON-LD tags and the markdown alternate link.

Run Lighthouse against `http://localhost:3000/`:

```bash
npx lighthouse http://localhost:3000/ --only-categories=seo,accessibility --preset=desktop --quiet --chrome-flags="--headless"
```

Expected: SEO score >= 95. Accessibility >= 90. If accessibility drops, the most likely culprit is color contrast on `--text-tertiary` over `--bg-base` — verify against WCAG AA.

Kill the server.

**Step 5: Commit (if any fixes needed)**

If issues surfaced, fix them in a follow-up commit titled `chore(p1): broken-link and lighthouse fixes`.

---

## Task 20: Open PR, request review, wait for Wayne's sign-off

**Files:** none (GitHub)

**Step 1: Push the branch**

```bash
git push -u origin docs/overhaul-plan-2026-04-07
```

**Step 2: Open the PR**

```bash
gh pr create --title "docs: Phase 1 overhaul (look, feel, and agentic foundation)" --body "$(cat <<'EOF'
## Summary

Phase 1 of the docs overhaul per [`docs/plans/2026-04-07-silhouette-docs-overhaul-design.md`](./docs/plans/2026-04-07-silhouette-docs-overhaul-design.md).

Ships the visual shell + agentic foundation in one integrated sprint:

- **Visual:** new tokens from `tokens.json`, Orbitron + Inter + IBM Plex Mono, solid `#13161a` background, new MDX component library (Hero, RoleCard, ShieldedCallout, AuthorByline, ComparisonTable, CopyForLLMRow), new role-based home page.
- **IA:** new sidebar with Core Concepts category, two-tree split with `/guides` plugin instance, updated header nav (Docs / Guides / Blog).
- **Agentic:** `robots.txt` with explicit AI bot allow-list, `@signalwire/docusaurus-plugin-llms-txt` replacing hand-maintained `static/llms.txt`, per-page `.md` routing, `llms-full.txt`, `@stackql/docusaurus-plugin-structured-data` (Organization + WebSite + SoftwareApplication + BreadcrumbList JSON-LD), Copy-for-LLM row on every page via `DocItem/Layout` swizzle, sitemap `<lastmod>`, `showLastUpdateTime` / `showLastUpdateAuthor`, alternate text/markdown link per page, stub `description:` frontmatter on all pages.
- **Measurement:** ZipTie baseline captured for 20 target queries.

No content rewrites in this PR. Phase 2 follows.

## Test plan

- [ ] `pnpm build` succeeds with zero errors
- [ ] `/robots.txt` returns 200 with AI allow-list
- [ ] `/llms.txt` and `/llms-full.txt` return 200 (plugin-generated)
- [ ] `/quickstart.md` returns raw markdown
- [ ] Home page renders with Orbitron H1 + three RoleCards
- [ ] Copy-for-LLM row renders on every docs page
- [ ] `view-source` shows `Organization` + `WebSite` JSON-LD on home
- [ ] Rich Results Test passes on home + `/about-silhouette`
- [ ] Lighthouse SEO >= 95, Accessibility >= 90
- [ ] Two-tree IA navigable (header + `/guides` works)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Step 3: Tag Wayne for review**

```bash
# Wayne's GitHub handle — confirm before running
gh pr edit --add-reviewer wizzle93
```

**Step 4: Wait**

Stop. Do not merge. Wayne reviews the preview deploy, signs off on the visual shell, and either merges himself or asks for changes.

---

## Phase 1 exit verification checklist

Before declaring Phase 1 done, verify:

- [ ] All 20 tasks in this plan marked complete
- [ ] All commits pushed to `docs/overhaul-plan-2026-04-07`
- [ ] PR opened and linked to this plan
- [ ] Preview deploy URL shared with Wayne
- [ ] Wayne signed off on the visual shell
- [ ] All Phase 1 exit criteria from the top of this document tick green

Once Phase 1 is merged, Task 1 of Phase 2 is: **re-baseline the 20 queries** to establish the "Phase 1 shipped" snapshot, then start the content rewrite sprint.

---

## Notes for the executing engineer

**Do not touch branches you did not create.** This is a Silhouette standing rule. The `docs/overhaul-plan-2026-04-07` branch is yours. If you discover uncommitted work in the repo root when you start, stop and ask — never stash, reset, or clean.

**Do not use em dashes in any copy.** Use regular hyphens. This is Wayne's standing rule.

**Do not claim MEV protection anywhere.** The narrative is strategy leakage, copytrade exposure, signaling risk, and adverse selection. HyperCore does not have an Ethereum-style public mempool.

**If a plugin option name has changed** in the version that installs today vs what this plan documents, adapt to the current API but preserve the semantics. Document any adaptations in the PR description.

**Frequent commits.** Each task is one atomic commit. If a task touches multiple files, still one commit. If a task needs a fix-up during execution, squash before PR.

**Run `pnpm build` after every task.** `onBrokenLinks: 'throw'` is unforgiving. Catching failures per-task is faster than debugging at the end.

**Use Vale if you touch any content.** Phase 1 intentionally does not rewrite content, but if you add a stub page, run `vale docs/` before committing.

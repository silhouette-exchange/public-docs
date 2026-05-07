---
title: Next session prompt (2026-04-08)
description: Copy-paste this into a fresh Claude Code session to resume the docs overhaul work from 2026-04-07.
---

# Next session prompt

**Instructions for Wayne:** copy everything between the `---BEGIN PROMPT---` and `---END PROMPT---` markers below into a fresh Claude Code session. Do not include the markers themselves.

---BEGIN PROMPT---

I'm resuming work on the Silhouette docs overhaul. A prior session already executed Phase 1 and an unplanned Phase 1.5 visual polish pass. The full handoff document is at `/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs/docs/plans/2026-04-07-session-1-handoff.md` - **read it first before doing anything else**. It contains the commit timeline, architecture decisions, known gaps, and lessons learned from the prior session.

## Working directory and branch

```
cd "/Users/waynempro/Desktop/Projects/Silhouette Exchange/Code/public-docs"
```

**Branch:** `docs/overhaul-plan-2026-04-07`. Do NOT switch branches. Do NOT touch any other branch. Do NOT push to origin without my explicit sign-off - everything stays local until colleagues have reviewed the local dev server.

**State you should expect:**
- Working tree clean
- 31 commits ahead of `origin/main`
- Head at `b716252`
- `pnpm build` green

Verify with:
```bash
git status
git branch --show-current
git log --oneline origin/main..HEAD | wc -l
pnpm build 2>&1 | tail -5
```

## Start the dev server

The server from last session has died. Start a fresh one:

```bash
pnpm start --no-open --port 3100
```

If port 3100 is busy (SillySwap docs sometimes reclaim it), pick any free port. The site is locally reviewable at http://localhost:3100/.

## Files to read before doing ANYTHING

In this order:

1. `docs/plans/2026-04-07-session-1-handoff.md` - **this is your context, read it in full**
2. `docs/plans/2026-04-07-silhouette-docs-overhaul-design.md` - the original design doc (reference only)
3. `docs/plans/2026-04-07-docs-overhaul-phase-1-implementation.md` - plan executed last session (19/20 done)
4. `docs/plans/2026-04-07-docs-overhaul-phase-2-implementation.md` - Phase 2 skeleton, not yet expanded
5. `/Users/waynempro/.claude/projects/-Users-waynempro/memory/MEMORY.md` - my memory notes, especially the feedback entries

Then ask me what I want to work on. Do not start editing anything until I tell you.

## Hard rules (standing instructions, do not violate)

1. **Stay on `docs/overhaul-plan-2026-04-07`.** Do not switch branches. Do not push without explicit sign-off.
2. **Never claim MEV protection.** Use strategy leakage / copytrade exposure / signaling risk / adverse selection.
3. **No em dashes anywhere.** Regular hyphens only.
4. **No light mode.** Dark only, `#13161a` base.
5. **Orbitron is ALL CAPS only** with `--tracking-wider` or `--tracking-widest`. Mixed-case Orbitron looks like a CAPTCHA. This is a hard design rule.
6. **All colors, fonts, spacing reference tokens** defined in `:root` in `src/css/custom.css`. No hardcoded `#hex` values outside the token block. No hardcoded `'Inter'` font-family.
7. **Always invoke the `frontend-design` or `ui-ux-pro-max` skill for UI work.** This is a standing feedback entry in memory. Do not go solo on UI, especially not for chrome, components, or accessibility.
8. **If a CSS layout or visual bug is not solved in 2 attempts, dispatch a puppeteer subagent to inspect computed styles BEFORE attempting a third edit.** This is the lesson from the 8-attempt chevron saga - ground truth beats cascade reasoning every time.
9. **Never run `pnpm build` or `pnpm clear` while the dev server is running.** Kill the dev server first. Running them concurrently deletes the `.docusaurus/` directory that the dev server holds, crashing it.
10. **Do not create files beyond what the task requires.** No speculative abstractions, no helper utilities, no README additions unless I explicitly ask. Phase 2 content stubs only when the corresponding page is being rewritten.

## What's done vs pending

**Phase 1 (20 tasks):** 19/20 committed. Task 20 (open PR) deliberately skipped pending local team review. See session-1-handoff.md for the commit-by-commit breakdown.

**Phase 1.5 visual polish (not in the original plan):** home page HUD redesign, full chrome rewrite (1100 lines, token-driven), WCAG 2.2 contrast audit, navbar swizzle deletion, CopyPageButton deletion, chevron saga fix. All committed.

**Phase 2 content (not started):** 8 Core Concepts stub pages under `docs/concepts/`, 5 Guides stub pages under `guides/`, all with "Coming in Phase 2" callouts. These need real content.

**Phase 3 distribution (not started):** MCP server, Wikipedia, Messari/DeFiLlama/CoinGecko/CMC listings, context7, X announcement.

**Manual blockers Wayne owes:** 8 open questions in the Phase 1 plan prerequisites section + ZipTie signup + 20-query manual baseline pass. See session-1-handoff.md "Known gaps and blockers for Phase 2" for the full list.

## Likely next tasks, ordered by priority

1. **Local review with the team.** The docs site is visually ready. Let colleagues click around http://localhost:3100/ and give feedback. This is the bottleneck on Phase 2 starting.
2. **Address Wayne's 8 open questions** - Phase 2 cannot start until he has committed to answers (webapp CSS source, motion tokens, named authors, Orbitron, changelog source, OpenAPI stability, Wikipedia ownership, testnet API key).
3. **Phase 2 Core Concepts content rewrites** - 8 stub pages. These are the most AI-citable pages because they define proper nouns. Each one wants ~800-1500 words of clean, structured, AI-friendly content with real ComparisonTables, AuthorBylines, and ShieldedCallouts.
4. **Phase 2 Guides content rewrites** - 5 stub pages. These are narrative walkthroughs (less AI-citable but higher human conversion).
5. **Small polish items** if Wayne flags them during review.
6. **Open the PR** when Wayne signs off (Task 20 of the original Phase 1 plan).

## Skills you should use

- **`superpowers:executing-plans`** - if resuming plan execution
- **`frontend-design`** - for any UI / component / visual work (mandatory per memory feedback)
- **`ui-ux-pro-max`** - for accessibility audits, design system decisions, contrast work
- **`superpowers:brainstorming`** - before any creative work like content rewrites
- **`copywriting`** - for home page or content rewrites if that comes up
- **`seo-audit`** or **`ai-seo`** - if reviewing agentic findability
- **Puppeteer via general-purpose subagent** - for ground-truth CSS debugging when hot reload is misleading

## Where things live

| Need | Location |
|---|---|
| Change a token (color, size, font, spacing) | `src/css/custom.css` `:root` block |
| Change chrome styling | `src/css/custom.css` below `:root` |
| Home page | `src/pages/index.tsx` + `src/pages/index.module.css` |
| Hero component | `src/components/Hero/` |
| Role cards | `src/components/RoleCard/` |
| Callouts | `src/components/ShieldedCallout/` |
| Copy-for-LLM button row | `src/components/CopyForLLMRow/` |
| Wrapper that injects the row on every docs page | `src/theme/DocItem/Footer/index.tsx` |
| Sidebar IA | `sidebars.ts` |
| Guides IA | `guidesSidebars.ts` |
| Plugins, navbar items, structured data | `docusaurus.config.ts` |
| robots.txt | `static/robots.txt` |
| llms.txt | generated by plugin at build time, do not hand-edit |
| Per-page `.md` files | generated by plugin at build time |

Start by reading the session-1-handoff.md. Then ask me what I want to work on today. Don't assume.

---END PROMPT---

## Tips for using this prompt

- Paste it into a **fresh** Claude Code session (not into an existing one with context pollution).
- If Claude Code asks for permissions on the first Bash call (e.g. `pnpm start`), approve them - this is a recognized working directory from the prior session.
- If the dev server is still running from today's session (unlikely but possible), Claude Code will get an EADDRINUSE error on port 3100 - tell it to use any free port or kill the existing process first.
- The handoff doc and this prompt both live in `docs/plans/` so they're version-controlled on the branch. If the next session makes significant progress, have it update `session-1-handoff.md` or create a `session-2-handoff.md` at the end for continuity.

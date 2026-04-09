# Docs Overhaul - Phase 3 Implementation Plan (Scaffold)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to expand this scaffold into full bite-sized tasks BEFORE execution. REQUIRED SUB-SKILL: Use superpowers:executing-plans once expanded.

**Status:** Scaffold only. Expand to full task-by-task plan at Phase 3 kickoff.

**Goal:** Ship a Notion-as-CMS pipeline so Silhouette's non-technical team can publish blog posts from Notion and have them auto-sync to `docs.silhouette.exchange/docs/blog`. Migrate the 6 existing posts into Notion without losing them.

**Depends on:** Phase 1 merged. Phase 2 does not block Phase 3, but ideally both land close together so the blog voice matches the newly-rewritten docs voice.

**Design doc:** [`2026-04-07-silhouette-docs-overhaul-design.md`](./2026-04-07-silhouette-docs-overhaul-design.md), §9

**Research log:** [`/tasks/a76c071911338fcc6.output`](#) - the Notion-as-CMS research produced the architecture and sync-script pseudocode this plan draws from

**Exit criteria (Phase 3 is DONE when all true):**

- [ ] Publishing a post in Notion → live on `docs.silhouette.exchange` within 15 minutes
- [ ] A non-technical team member successfully publishes a post unaided
- [ ] Sync failures surface in Notion (`Sync Error` property) and Slack DM
- [ ] The existing 6 blog posts render identically post-migration
- [ ] The sync GitHub Action runs on cron (every 15 min) + `workflow_dispatch` + `repository_dispatch`
- [ ] Vale runs inside the sync Action against Notion-sourced markdown
- [ ] Image pipeline handles Notion S3 URL expiry via commit-to-repo pattern
- [ ] One-page non-tech editor doc exists in Notion explaining the workflow

---

## Task groups (expand each into bite-sized tasks at kickoff)

### Group A - Notion setup

1. Create Notion database **"Silhouette Blog Posts"** in the Silhouette workspace
2. Add all properties from design doc §9 schema (Title, Slug, Status, Publish Date, Authors, Tags, Excerpt, Cover Image, SEO Title, SEO Description, Last Synced, Last Sync Status, Sync Error)
3. Create a **new** Notion integration named `silhouette-blog-sync` (NOT the CRM integration). Scope it only to the Blog Posts DB
4. Share the Blog Posts DB with the new integration
5. Record the integration token + DB ID in 1Password for the Silhouette team
6. Write a one-page editor guide in Notion: "How to publish a blog post on docs.silhouette.exchange"

### Group B - Sync script

1. Install dependencies: `pnpm add -D @notionhq/client notion-to-md@alpha gray-matter p-limit dotenv tsx`
2. Create `scripts/sync-notion-blog.ts` per the pseudocode in the Notion-as-CMS research log
3. Implement `queryAllPublishable(notion, dbId)` - queries the DB for `Status in {Published, Scheduled where Publish Date <= now}`
4. Implement `extractProps(page)` - maps Notion properties to a typed `BlogPostProps` interface
5. Implement `validateAuthors(authors, authorsYaml)` - fails fast if an author is not in `blog/authors.yml`
6. Implement `NotionConverter.convert(pageId)` with `downloadMediaTo('blog/images')` and hashed filenames: `sha1(pageId + blockId).slice(0, 12) + ext`
7. Implement `injectTruncate(content, excerpt)` - inserts `<!-- truncate -->` marker after the excerpt
8. Implement `writeFile(path, frontmatter, body)` using `gray-matter`
9. Implement `markSynced(notion, pageId, status, error?)` - writes `Last Synced`, `Last Sync Status`, and `Sync Error` properties back to Notion
10. Implement `pruneOrphans(blogDir, managedFilenames)` - deletes only files with `notion_page_id` in frontmatter that are no longer in the DB
11. Implement `refuseOverwriteUnmanagedFile()` - guards against clobbering hand-written posts
12. Add `pnpm sync:notion` + `pnpm sync:notion:dry` to `package.json`
13. Add a `.env.example` with `NOTION_TOKEN=` and `NOTION_BLOG_DB_ID=`
14. Write unit tests for `extractProps`, `validateAuthors`, `hashFilename` (use `vitest` - install if missing)

### Group C - GitHub Action

1. Create `.github/workflows/sync-notion-blog.yml` per design doc §9
2. Triggers: `schedule` (cron `*/15 * * * *`), `workflow_dispatch`, `repository_dispatch` (type `notion-publish`)
3. `concurrency` group `sync-notion-blog` to prevent race conditions
4. Permissions: `contents: write`
5. Add GitHub secrets: `NOTION_TOKEN`, `NOTION_BLOG_DB_ID`
6. Step: checkout, pnpm setup, install, run sync script, run Vale against `blog/`, run `pnpm build` dry-check against changed files
7. Step: commit with `silhouette-notion-bot` identity, push
8. Optional: wrap in `peter-evans/create-pull-request@v6` for the first 2 weeks (safer cutover)
9. Step: post to Slack on failure via existing Slack webhook (Wayne's DM user ID: `U08HWE6RHQR`)

### Group D - Local dev flow

1. Verify `pnpm sync:notion:dry` runs locally against one test Notion page
2. Confirm the dry run writes nothing back to Notion
3. Confirm the dry run generates a valid `blog/*.md` file locally

### Group E - Migration of existing 6 posts

1. For each of the 6 existing posts in `blog/2025-*.md`, create a Notion page in the Blog Posts DB by:
   - Copy-pasting the markdown body into a new Notion page (Notion renders markdown as blocks automatically)
   - Setting all properties to match the frontmatter
   - Setting Status = `Published`
2. Leave the original `blog/*.md` files in git for TWO successful sync cycles - the prune step cannot touch them (no `notion_page_id` in frontmatter)
3. After 2 sync cycles, delete the original files in a separate PR titled "chore(blog): remove hand-written posts migrated to Notion"

### Group F - Production cutover

1. Enable the GitHub Action (merge to main)
2. First live run: `workflow_dispatch` manually, observe output in Actions tab
3. Verify the bot commits appear on `main` under `silhouette-notion-bot` identity
4. Verify `docs.silhouette.exchange/docs/blog` renders the Notion-sourced posts identically
5. Verify the 6 migrated posts still render correctly
6. After 48 hours of clean runs, flip the Action trigger from PR mode to direct-commit mode

### Group G - Non-tech editor flow

1. Wayne + one non-technical team member publish a test post end-to-end
2. If any friction surfaces, fix the editor doc or the script
3. Record a 2-minute Loom video for team onboarding: "publishing a post on docs.silhouette.exchange from Notion"

### Group H - Guardrails

1. Add a failing-author alert: if `validateAuthors` rejects, the Action fails with a clear message pointing to `blog/authors.yml`
2. Add an expired-image check: if a Notion page has a cover image URL that 401s, the Action fails
3. Add a slug-collision check: if two Notion pages have the same slug, fail with a clear message
4. Add a dry-run PR comment: when the Action runs in `repository_dispatch` or `workflow_dispatch` mode with `DRY_RUN=1`, post a comment listing what would change

### Group I - Documentation

1. Create `docs/plans/notion-blog-pipeline.md` documenting the architecture for future maintainers
2. Update `README.md` with a "Publishing blog posts" section pointing at the Notion workflow
3. Update `CONTRIBUTING.md` to note that blog content is Notion-sourced

---

## Notes for expansion

When expanding this scaffold into a full plan, use the Phase 1 plan format:

- Each task is 2-5 minutes of work
- Exact file paths
- Complete code in the plan (not "implement X" - include the actual TypeScript)
- Exact pnpm / gh commands with expected output
- Commit messages per task

**The sync script is the bulk of the work.** Budget for TDD: write the unit tests for `extractProps`, `validateAuthors`, `hashFilename`, `injectTruncate`, and `pruneOrphans` before implementing them. The rest of the script is glue.

**Do not reuse the CRM Notion token.** Use a new integration scoped only to the blog DB. If the CRM token leaks, it shouldn't also give write access to the blog. If the blog token leaks, the CRM stays safe.

**Don't delete the original 6 posts until at least 2 clean sync cycles.** The safest cutover is: publish to Notion → verify render → leave both copies in the repo → wait 48 hours → delete hand-written copies in a separate PR that's easy to revert.

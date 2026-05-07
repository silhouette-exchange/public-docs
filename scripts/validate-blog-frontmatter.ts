// scripts/validate-blog-frontmatter.ts
//
// Prebuild validation: walks blog/**/*.md, parses frontmatter, runs the
// series validator + category validator, and exits non-zero on any error.
// Runs via the `prebuild` npm script so `pnpm build` fails before
// Docusaurus sees bad data.
//
// Independent of Docusaurus's content lifecycle, so timing issues
// inside the Docusaurus build pipeline cannot affect validation.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';
import {
  validateSeriesFrontmatter,
  type BlogPostLike,
} from '../src/lib/blog/series';
import { isValidCategorySlug } from '../src/lib/blog/categories';

const BLOG_DIR = join(process.cwd(), 'blog');

function walkMarkdown(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'images') continue;
      results.push(...walkMarkdown(full));
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

function main(): void {
  const files = walkMarkdown(BLOG_DIR);
  if (files.length === 0) {
    console.log('[validate-blog-frontmatter] no blog posts found, skipping');
    return;
  }

  const errors: string[] = [];
  const posts: BlogPostLike[] = [];

  for (const file of files) {
    const rel = relative(process.cwd(), file);
    const raw = readFileSync(file, 'utf8');
    const { data } = matter(raw);

    // Skip author/meta files (no slug, no title)
    if (!data.slug && !data.title) continue;

    // Category validation
    if (data.category !== undefined) {
      if (
        typeof data.category !== 'string' ||
        !isValidCategorySlug(data.category)
      ) {
        errors.push(`${rel}: invalid category "${String(data.category)}"`);
      }
    }

    // Description validation (SEO requirement - meta desc is the SERP snippet)
    if (data.description !== undefined) {
      if (typeof data.description !== 'string') {
        errors.push(`${rel}: description must be a string`);
      } else {
        const desc = data.description.trim();
        if (desc.length < 120) {
          errors.push(
            `${rel}: description is ${desc.length} chars; target 120-160 for SERP snippet`,
          );
        }
        if (desc.length > 180) {
          errors.push(
            `${rel}: description is ${desc.length} chars; Google truncates around 160`,
          );
        }
        // Reject the pre-2026-04-09 boilerplate pattern. The old template
        // for every post was `<title> - Silhouette Exchange documentation.`
        // which is keyword-free and repeats the title. Catch any drift
        // back to that pattern or any similar "- Silhouette documentation"
        // trailer.
        if (/- Silhouette Exchange documentation\.?$/i.test(desc)) {
          errors.push(
            `${rel}: description uses the legacy "- Silhouette Exchange documentation." boilerplate; rewrite with a unique, keyword-rich SERP snippet`,
          );
        }
      }
    }

    // Alt text validation on inline images - the raw body is a markdown
    // string with `![alt](path)` patterns. Every alt must be descriptive.
    // "Test image" is the historical copy-paste placeholder that the
    // traditional SEO audit flagged as a P0 accessibility + SEO issue.
    const altMatches = raw.matchAll(/!\[([^\]]*)\]\([^)]+\)/g);
    for (const match of altMatches) {
      const alt = match[1]?.trim() ?? '';
      if (alt.length === 0) {
        errors.push(
          `${rel}: inline image has empty alt text; use a descriptive alt that reflects the image content`,
        );
      } else if (/^(test image|image|img|placeholder|tbd)$/i.test(alt)) {
        errors.push(
          `${rel}: inline image uses the placeholder alt "${alt}"; use a descriptive alt that reflects the image content`,
        );
      }
    }

    // Build a BlogPostLike shape for the series validator
    posts.push({
      metadata: {
        permalink: data.slug ? `/blog/${data.slug}` : `/${rel}`,
        frontMatter: data as Record<string, unknown>,
      },
    });
  }

  const seriesErrors = validateSeriesFrontmatter(posts);
  errors.push(...seriesErrors);

  if (errors.length > 0) {
    console.error('\n[validate-blog-frontmatter] FAILED:');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    console.error(`\n${errors.length} error(s) found. Fix before building.\n`);
    process.exit(1);
  }

  console.log(`[validate-blog-frontmatter] ${posts.length} posts OK`);
}

main();

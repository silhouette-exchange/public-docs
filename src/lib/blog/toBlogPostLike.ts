// src/lib/blog/toBlogPostLike.ts
//
// Adapter that converts a Docusaurus blog list item into the slim
// BlogPostLike shape that every component under src/components/blog/
// consumes.
//
// The Docusaurus shape (PropBlogPostContent from
// @docusaurus/plugin-content-blog) nests fields under .content.metadata
// and .content.frontMatter. The slim shape is flat. This function is
// the one place we do the conversion, so the swizzle at
// src/theme/BlogListPage/index.tsx and any future consumers stay
// untangled from the Docusaurus nesting.
//
// Behaviour notes:
//
// - category is required. It lives in frontmatter (custom field, not
//   in Docusaurus's declared BlogPostFrontMatter type). Missing or
//   non-string values throw loudly so bad content surfaces in local
//   dev rather than silently rendering as "undefined".
// - slug prefers the frontmatter slug when authors have set one, and
//   otherwise derives it from the permalink tail. Matches how
//   Docusaurus itself resolves the route.
// - readingTime comes in from Docusaurus as a float in minutes. The
//   slim shape stores an integer. We round and enforce a floor of 1
//   so a 30-second post does not render as "0 MIN".
// - authorName / authorImageUrl pull from the first entry in the
//   authors array. Empty authors falls back to "Silhouette Team".
// - cover, series, series_order are our own custom frontmatter fields
//   and are read through a Record<string, unknown> cast since the
//   Docusaurus types do not know about them.
//
// See docs/plans/2026-04-09-blog-redesign-design.md §4.

import type { BlogPostLike } from "@site/src/components/blog/BlogPostCard";

/**
 * Minimal subset of the Docusaurus blog list item shape that the
 * adapter reads. Narrower than the full PropBlogPostContent so tests
 * can construct fixtures without having to mock the entire LoadedMDXContent
 * interface. The real swizzle call site passes in the full item; the
 * extra fields are simply ignored.
 */
export interface DocusaurusBlogItem {
  readonly content: {
    readonly metadata: {
      readonly permalink: string;
      readonly title: string;
      readonly description: string;
      readonly date: string;
      readonly readingTime?: number;
      readonly authors: ReadonlyArray<{
        readonly name?: string;
        readonly imageURL?: string;
      }>;
    };
    readonly frontMatter: Record<string, unknown>;
    /**
     * Bundler-processed assets. Docusaurus resolves relative `image:`
     * frontmatter paths (e.g. `./images/foo.png`) into hashed URLs at
     * build time and exposes them here. For external URLs in `image:`,
     * `assets.image` is undefined and we should fall back to
     * `frontMatter.image` directly.
     */
    readonly assets?: {
      readonly image?: string;
    };
  };
}

function readString(
  frontMatter: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = frontMatter[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readNumber(
  frontMatter: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = frontMatter[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function deriveSlugFromPermalink(permalink: string): string {
  const parts = permalink.split("/").filter(Boolean);
  const tail = parts[parts.length - 1];
  if (!tail) {
    throw new Error(
      `Cannot derive a slug from permalink "${permalink}". ` +
        "Expected a non-empty trailing path segment.",
    );
  }
  return tail;
}

/**
 * Convert one Docusaurus blog list item into the slim BlogPostLike
 * shape consumed by every listing component. Throws on bad input
 * rather than returning partial / undefined data, so authoring
 * mistakes fail loudly in local dev instead of silently masking.
 */
export function toBlogPostLike(item: DocusaurusBlogItem): BlogPostLike {
  const { metadata, frontMatter, assets } = item.content;

  const category = readString(frontMatter, "category");
  if (!category) {
    throw new Error(
      `Blog post at ${metadata.permalink} is missing a required ` +
        `"category" frontmatter field. Valid categories are defined in ` +
        "src/data/blog/categories.ts.",
    );
  }

  const slugFromFrontMatter = readString(frontMatter, "slug");
  const slug = slugFromFrontMatter ?? deriveSlugFromPermalink(metadata.permalink);

  const firstAuthor = metadata.authors[0];
  const authorName = firstAuthor?.name ?? "Silhouette Team";
  const authorImageUrl = firstAuthor?.imageURL;

  // Docusaurus hands us reading time as a float in minutes. Round to
  // the nearest whole minute and enforce a floor of 1 so a short post
  // never renders as "0 MIN".
  const rawReadingTime = metadata.readingTime ?? 0;
  const readingTime = Math.max(1, Math.round(rawReadingTime));

  const dek = metadata.description.length > 0 ? metadata.description : undefined;
  // Docusaurus resolves a relative `image:` frontmatter path (e.g.
  // `./images/foo.png`) into a hashed asset URL at build time and exposes
  // it on `item.content.assets.image`. That is the URL we want to render -
  // the raw `frontMatter.image` string is only relative to the post's MDX
  // file and does not resolve when the listing page tries to render it.
  // Order of preference:
  //   1. assets.image - the bundler-processed hashed URL (collocated)
  //   2. frontMatter.image - external URLs that the bundler did not touch
  //   3. frontMatter.cover - legacy custom field from the earlier adapter
  const coverImage =
    (typeof assets?.image === "string" && assets.image.length > 0
      ? assets.image
      : undefined) ??
    readString(frontMatter, "image") ??
    readString(frontMatter, "cover");
  const series = readString(frontMatter, "series");
  const seriesOrder = readNumber(frontMatter, "series_order");

  return {
    slug,
    title: metadata.title,
    permalink: metadata.permalink,
    category,
    dek,
    coverImage,
    readingTime,
    authorName,
    authorImageUrl,
    date: metadata.date,
    series,
    seriesOrder,
  };
}

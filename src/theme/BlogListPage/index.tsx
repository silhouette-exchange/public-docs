import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import type { Props } from "@theme/BlogListPage";
import {
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import SearchMetadata from "@theme/SearchMetadata";
import BlogListPageStructuredData from "@theme/BlogListPage/StructuredData";
import { useHistory, useLocation } from "@docusaurus/router";

import BlogPublicationHeader from "@site/src/components/blog/BlogPublicationHeader";
import BlogCategoryPills from "@site/src/components/blog/BlogCategoryPills";
import BlogHero from "@site/src/components/blog/BlogHero";
import BlogSeriesBand from "@site/src/components/blog/BlogSeriesBand";
import BlogLatestBand from "@site/src/components/blog/BlogLatestBand";
import BlogArchiveList from "@site/src/components/blog/BlogArchiveList";
import type { BlogPostLike } from "@site/src/components/blog/BlogPostCard";

import { isValidCategorySlug } from "@site/src/lib/blog/categories";
import {
  toBlogPostLike,
  type DocusaurusBlogItem,
} from "@site/src/lib/blog/toBlogPostLike";
import { partitionBlogPosts } from "@site/src/lib/blog/partitionBlogPosts";

import styles from "./styles.module.css";

// Eject swizzle of the default Docusaurus blog listing. Fully replaces
// the default "sidebar + post items + paginator" layout with the
// Silhouette band composition: publication header, category pills,
// hero, optional Silhouette Series band, Latest band, and Archive tail.
//
// The swizzle preserves the default listing page's SEO plumbing:
//
// - HtmlClassNameProvider applies the Docusaurus theme class names
//   that external CSS and Algolia's search hook expect.
// - BlogListPageStructuredData mounts the JSON-LD schema.org
//   BlogPosting feed that the default page emits. Dropping this
//   would regress our search ranking posture.
// - SearchMetadata tags the page as blog_posts_list so Algolia
//   (or any crawler reading the search metadata) scopes correctly.
// - Layout still handles <title>, <meta description>, and the
//   rest of the site chrome via its title / description props.
//
// Runtime logic:
//
// 1. Posts are converted from the Docusaurus item shape (nested
//    content.metadata + content.frontMatter) into the slim
//    BlogPostLike shape that every listing component consumes, via
//    the pure adapter at src/lib/blog/toBlogPostLike.ts.
// 2. The active category filter is hydrated from the URL query
//    param (?category=research) and written back to the URL via
//    history.replace when the user clicks a pill. History back /
//    forward replays the state because useMemo re-derives from
//    location.search.
// 3. Filtered / hero / latest / archive bucket assignment is
//    handled by src/lib/blog/partitionBlogPosts.ts.
//
// Everything that involves pure logic lives in src/lib/blog/ and is
// unit-tested in isolation. The swizzle itself is composition plus
// React state, deliberately kept thin so it does not need its own
// dedicated test harness (which would need to mock
// @docusaurus/router, @docusaurus/theme-common, and the
// StructuredData + SearchMetadata theme modules).
//
// See docs/plans/2026-04-09-blog-redesign-design.md §4.

const MAX_LATEST = 6;

/**
 * Query param key for the active category filter. Kept as a constant
 * so the pill-click handler and the initial hydration read the same
 * name. Matches the design doc's /blog?category=research convention.
 */
const FILTER_PARAM = "category";

function BlogListPageContent(props: Props): ReactNode {
  const { metadata, items } = props;
  const location = useLocation();
  const history = useHistory();

  // Hydrate the active filter from the URL on every render. useMemo
  // keyed on location.search lets back / forward navigation restore
  // the correct pill highlight without adding a dedicated popstate
  // listener.
  const filterFromUrl = useMemo<string | null>(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get(FILTER_PARAM);
    if (!slug) {
      return null;
    }
    // Unknown slug in the URL falls back to "All" rather than
    // throwing. A stale or hand-mangled URL should degrade, not
    // crash the listing.
    return isValidCategorySlug(slug) ? slug : null;
  }, [location.search]);

  const [activeFilter, setActiveFilter] = useState<string | null>(filterFromUrl);

  // Keep the local state in sync with the URL when navigation happens
  // outside of the pill click handler (back / forward, external link
  // landing on /blog?category=...).
  useEffect(() => {
    setActiveFilter(filterFromUrl);
  }, [filterFromUrl]);

  const handleFilterChange = useCallback(
    (slug: string | null): void => {
      setActiveFilter(slug);
      const params = new URLSearchParams(location.search);
      if (slug) {
        params.set(FILTER_PARAM, slug);
      } else {
        params.delete(FILTER_PARAM);
      }
      const search = params.toString();
      history.replace(
        `${location.pathname}${search.length > 0 ? `?${search}` : ""}`,
      );
    },
    [history, location.pathname, location.search],
  );

  // Adapt Docusaurus post items into the slim BlogPostLike shape.
  // The cast to DocusaurusBlogItem is a narrowing: Props.items is
  // typed as readonly { content: PropBlogPostContent }[], and the
  // adapter only reads a subset of those fields.
  const allPosts: readonly BlogPostLike[] = useMemo(
    () =>
      items.map((item) => toBlogPostLike(item as unknown as DocusaurusBlogItem)),
    [items],
  );

  const partition = useMemo(
    () => partitionBlogPosts(allPosts, activeFilter, MAX_LATEST),
    [allPosts, activeFilter],
  );

  const hasNoResults =
    activeFilter !== null && partition.filtered.length === 0;

  return (
    <Layout
      title={metadata.blogTitle}
      description={metadata.blogDescription}
    >
      <SearchMetadata tag="blog_posts_list" />
      <main className={styles.main}>
        {/*
         * Decorative atmospheric layer behind the listing content.
         * Absolutely positioned inside the relative main. Calm
         * single-glow + faint grid variant of the homepage Hero
         * treatment. Aria-hidden since it is purely visual.
         */}
        <div className={styles.atmosphere} aria-hidden="true" />
        <div className={styles.content}>
          <BlogPublicationHeader
            title="Blog"
            subtitle="Writing on shielded trading, TEE architecture, and the road to private perps"
          />

          <BlogCategoryPills
            activeSlug={activeFilter}
            onChange={handleFilterChange}
          />

          {hasNoResults ? (
            <p className={styles.emptyState} role="status">
              No posts in this category yet. Check back soon, or browse{" "}
              <button
                type="button"
                className={styles.emptyResetButton}
                onClick={() => handleFilterChange(null)}
              >
                everything
              </button>
              .
            </p>
          ) : (
            <>
              {partition.hero && <BlogHero post={partition.hero} />}

              <BlogSeriesBand
                allPosts={allPosts}
                activeFilter={activeFilter}
                seriesSlug="silhouette-primer"
              />

              <BlogLatestBand
                posts={partition.latest}
                activeFilter={activeFilter}
                maxPosts={MAX_LATEST}
              />

              {partition.archive.length > 0 && (
                <BlogArchiveList posts={partition.archive} />
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  const className = clsx(
    ThemeClassNames.wrapper.blogPages,
    ThemeClassNames.page.blogListPage,
  );
  const children = (
    <>
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </>
  );
  return (
    <HtmlClassNameProvider className={className} children={children} />
  );
}

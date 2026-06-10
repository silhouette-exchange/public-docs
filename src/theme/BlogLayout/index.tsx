import React, { type ReactNode } from "react";
import BlogLayout from "@theme-original/BlogLayout";
import type { Props } from "@theme/BlogLayout";

// Wrap swizzle of Docusaurus's default BlogLayout.
//
// Drops the incoming sidebar prop and forwards sidebar={undefined} to the
// original BlogLayout. That flips hasSidebar to false inside the default
// layout, so the main column takes the wider "col--9 col--offset-1" preset
// instead of being squeezed to "col--7" by a left sidebar column.
//
// True full-width layout for the listing and article pages is achieved at
// the BlogListPage / BlogPostPage swizzles (Phase 3.3 and Phase 5), which
// control their own inner container widths. This wrap exists only to stop
// BlogLayout from reserving horizontal space for a sidebar we do not use.
//
// Belt and braces: src/theme/BlogSidebar/index.tsx also returns null, so
// even if a downstream caller passed sidebar data directly, nothing would
// render. The default BlogSidebar already handles sidebar=undefined safely
// via optional chaining, but the explicit neuter is defence-in-depth.
//
// See docs/plans/2026-04-09-blog-redesign-design.md §3a.

export default function BlogLayoutWrapper(props: Props): ReactNode {
  const { sidebar: _sidebar, ...rest } = props;
  return <BlogLayout {...rest} sidebar={undefined} />;
}

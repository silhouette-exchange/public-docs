import { type ReactNode } from "react";
import type { Props } from "@theme/BlogSidebar";

// Eject-and-neuter swizzle of Docusaurus's default BlogSidebar.
//
// Unconditionally returns null. The listing page replaces the sidebar
// with a band layout (hero, series, latest, archive). The article page
// reads full width, with a right-rail table of contents introduced at
// Phase 4 via the BlogTOC component, not via this sidebar slot.
//
// Paired with src/theme/BlogLayout/index.tsx, which drops the sidebar
// prop before forwarding to the original BlogLayout. Either would be
// sufficient on its own; running both is defence-in-depth so a future
// swizzle or upstream Docusaurus change cannot sneak the sidebar back
// into the layout.
//
// Props are accepted to match the shape the original BlogSidebar
// declared, so callers that destructure the sidebar prop still
// typecheck, but the prop is intentionally unused here.
//
// See docs/plans/2026-04-09-blog-redesign-design.md §3a.

export default function BlogSidebar(_props: Props): ReactNode {
  return null;
}

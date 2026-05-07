import React from 'react';

/*
 * Vitest mock for `@docusaurus/Head` (which wraps react-helmet-async).
 *
 * In tests we don't want to pull in the full Docusaurus runtime just
 * to render structured-data components. This mock renders the children
 * inline so components like FAQSchema and TechArticleSchema still emit
 * their `<script type="application/ld+json">` nodes into the DOM,
 * which lets tests assert on the JSON-LD payload via querySelector.
 */
interface HeadProps {
  children?: React.ReactNode;
}

export default function Head({ children }: HeadProps) {
  return <>{children}</>;
}

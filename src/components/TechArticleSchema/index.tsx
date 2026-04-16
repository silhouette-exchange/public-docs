import React from 'react';

/*
 * TechArticleSchema
 *
 * Emits TechArticle JSON-LD inline in the page body for high-value
 * reference pages. AI systems prioritize TechArticle for technical
 * documentation, so every unshielded reference page is leaking
 * citation-worthiness.
 *
 * JSON-LD is emitted inline rather than via Docusaurus Head because
 * React 19's stricter children typing interacts badly with the Head
 * wrapper in a way that silently drops script content. Inline
 * placement still satisfies every schema consumer (Google, ChatGPT,
 * Perplexity, Claude, Gemini all accept JSON-LD anywhere in the doc).
 *
 * Mount by hand on the highest-value reference pages. A plugin-driven
 * sweep across every doc can happen in a later pass; for now we pick
 * 3-5 pages and mount the component explicitly in the MDX body so
 * the schema lives next to the content it describes.
 *
 * Deliberately does NOT emit on blog routes. Blog posts get
 * BlogPosting from the Docusaurus blog plugin + Article from the
 * stackql plugin, so a TechArticle would duplicate.
 */

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface TechArticleSchemaProps {
  /** Page headline, usually matches the H1 / title frontmatter */
  headline: string;
  /** Short description, usually matches the meta description frontmatter */
  description: string;
  /** ISO 8601 date the page was first published. Defaults to site launch. */
  datePublished?: string;
  /** ISO 8601 date the page was last modified. Defaults to today. */
  dateModified?: string;
  /** Reader skill level. Defaults to Intermediate. */
  proficiencyLevel?: ProficiencyLevel;
  /** Optional keyword list. Pulled from frontmatter keywords where available. */
  keywords?: string[];
}

const DEFAULT_DATE_PUBLISHED = '2025-01-01';
const SITE_URL = 'https://docs.silhouette.exchange';
const BRAND_URL = 'https://silhouette.exchange';
const LOGO_URL = 'https://docs.silhouette.exchange/img/silhouette-social-card.png';

export default function TechArticleSchema({
  headline,
  description,
  datePublished = DEFAULT_DATE_PUBLISHED,
  dateModified,
  proficiencyLevel = 'Intermediate',
  keywords,
}: TechArticleSchemaProps) {
  if (!headline || !description) {
    return null;
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    datePublished,
    author: {
      '@type': 'Organization',
      name: 'Silhouette Exchange',
      url: BRAND_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Silhouette Exchange',
      url: BRAND_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    proficiencyLevel,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
    },
  };

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  if (keywords && keywords.length > 0) {
    schema.keywords = keywords;
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

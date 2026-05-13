import React from 'react';

/*
 * DefinedTermSetSchema
 *
 * Emits a schema.org DefinedTermSet with one DefinedTerm per glossary
 * entry. Glossaries are unusually high-leverage for AI citation because
 * every entry is a self-contained "What is X?" answer in 1-2 sentences,
 * which is exactly the extraction shape that ChatGPT, Perplexity, and
 * Google AI Overviews look for. DefinedTermSet tells AI systems that
 * the page IS a glossary, and DefinedTerm gives them a clean lookup
 * surface keyed by term name.
 *
 * Each DefinedTerm gets a stable `@id` of `${pageUrl}#${anchor}` where
 * anchor is the heading slug Docusaurus already emits for the term.
 * This lets external references (and AI citations) deep-link to the
 * specific definition rather than the page top.
 *
 * Mounted in MDX after the term list. Sibling to TechArticleSchema on
 * the glossary page - TechArticle covers the page as a document,
 * DefinedTermSet covers the term-by-term semantics.
 */

const SITE_URL = 'https://docs.silhouette.exchange';

export interface DefinedTermItem {
  /** Term name as it appears in the glossary (e.g. "TEE (Trusted Execution Environment)") */
  term: string;
  /** Definition body, 1-3 sentences */
  description: string;
  /** Optional anchor slug. If omitted, defaults to a kebab-case of the term. */
  anchor?: string;
}

export interface DefinedTermSetSchemaProps {
  /** Set name, e.g. "Silhouette Glossary" */
  name: string;
  /** Set description, usually matches the page meta description */
  description: string;
  /** Path-only URL of the glossary page, e.g. "/glossary" */
  pagePath: string;
  /** Term entries */
  terms: DefinedTermItem[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function DefinedTermSetSchema({
  name,
  description,
  pagePath,
  terms,
}: DefinedTermSetSchemaProps) {
  if (!terms || terms.length === 0) {
    return null;
  }

  const pageUrl = `${SITE_URL}${pagePath}`;
  const setId = `${pageUrl}#defined-term-set`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': setId,
    name,
    description,
    url: pageUrl,
    inLanguage: 'en-US',
    hasDefinedTerm: terms.map((item) => {
      const anchor = item.anchor || slugify(item.term);
      return {
        '@type': 'DefinedTerm',
        '@id': `${pageUrl}#${anchor}`,
        name: item.term,
        description: item.description,
        url: `${pageUrl}#${anchor}`,
        inDefinedTermSet: setId,
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

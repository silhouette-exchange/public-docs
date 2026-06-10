import React from 'react';

/*
 * FAQSchema
 *
 * Emits FAQPage JSON-LD inline in the page body. Google and every AI
 * crawler (ChatGPT, Perplexity, Claude, Gemini, Copilot) accept
 * JSON-LD structured data from any location in the HTML document,
 * not just `<head>`. Placing the script inline sidesteps an
 * interaction between React 19's stricter JSX children typing and
 * Docusaurus' Head (react-helmet-async) that was silently dropping
 * script content passed via dangerouslySetInnerHTML.
 *
 * The questions prop mirrors the visible Q&A content on the page
 * body. The JSON-LD block lives alongside the page body, it does
 * NOT replace or duplicate the human-visible content.
 *
 * Per Princeton GEO research, FAQPage schema is one of the highest
 * leverage schemas for AI citation and gives a meaningful lift in
 * AI Overview / LLM answer visibility for "What is X?" style queries.
 *
 * Keep answer text between ~40 and ~60 words for AI snippet extraction.
 * The component does not enforce the length, but the mounted data
 * should respect it.
 */

export interface FAQItem {
  /** The question, rendered verbatim as FAQPage.mainEntity[n].name */
  q: string;
  /** The answer text, rendered verbatim as acceptedAnswer.text */
  a: string;
}

export interface FAQSchemaProps {
  questions: FAQItem[];
}

export default function FAQSchema({ questions }: FAQSchemaProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

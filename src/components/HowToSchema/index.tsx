import React from 'react';

/*
 * HowToSchema
 *
 * Emits HowTo JSON-LD inline in the page body. HowTo schema enables
 * rich results in Google Search (step-by-step carousel) and gives AI
 * systems structured step data for "how to" query answers.
 *
 * Inline placement for the same React 19 / Docusaurus Head reason
 * documented in FAQSchema and TechArticleSchema.
 */

export interface HowToStep {
  /** Step name / title */
  name: string;
  /** Step description text */
  text: string;
  /** Optional URL(s) to step-specific image(s) */
  image?: string | string[];
}

export interface HowToSchemaProps {
  /** The how-to title, usually matches the page H1 */
  name: string;
  /** Short description of what the how-to achieves */
  description: string;
  /** Ordered list of steps */
  steps: HowToStep[];
}

const SITE_URL = 'https://docs.silhouette.exchange';

function resolveImage(url: string): string {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

export default function HowToSchema({
  name,
  description,
  steps,
}: HowToSchemaProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s) => {
      const step: Record<string, unknown> = {
        '@type': 'HowToStep',
        name: s.name,
        text: s.text,
      };
      if (s.image) {
        const images = Array.isArray(s.image) ? s.image : [s.image];
        const resolved = images.map(resolveImage);
        step.image = resolved.length === 1 ? resolved[0] : resolved;
      }
      return step;
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

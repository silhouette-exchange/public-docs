import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FAQSchema, { type FAQItem } from './index';

const sample: FAQItem[] = [
  {
    q: 'What is Silhouette?',
    a: 'Silhouette is shielded trading on Hyperliquid. It hides strategy, size, and intent while settling on the same order book everyone else uses.',
  },
  {
    q: 'Is Silhouette a separate exchange?',
    a: 'No. Every trade on Silhouette settles on Hyperliquid. It is not a separate venue with separate liquidity.',
  },
];

function readEmittedSchema(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse((script as HTMLScriptElement).textContent || '');
}

describe('FAQSchema', () => {
  it('emits a FAQPage JSON-LD block with the supplied questions', () => {
    const { container } = render(<FAQSchema questions={sample} />);
    const schema = readEmittedSchema(container);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    const mainEntity = schema.mainEntity as Array<Record<string, unknown>>;
    expect(mainEntity).toHaveLength(2);
    expect(mainEntity[0]['@type']).toBe('Question');
    expect(mainEntity[0].name).toBe('What is Silhouette?');
    const answer = mainEntity[0].acceptedAnswer as Record<string, unknown>;
    expect(answer['@type']).toBe('Answer');
    expect(answer.text).toContain('shielded trading on Hyperliquid');
  });

  it('returns null when passed an empty list', () => {
    const { container } = render(<FAQSchema questions={[]} />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DefinedTermSetSchema, { type DefinedTermItem } from './index';

const sample: DefinedTermItem[] = [
  {
    term: 'TEE (Trusted Execution Environment)',
    anchor: 'tee',
    description:
      'A hardware-isolated computing environment that enables confidential computation. Silhouette uses AWS Nitro Enclaves.',
  },
  {
    term: 'Shielded Trading',
    anchor: 'shielded-trading',
    description:
      'Trading on Silhouette where your orders are processed inside the TEE and executed via delegated wallets.',
  },
];

function readEmittedSchema(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse((script as HTMLScriptElement).textContent || '');
}

describe('DefinedTermSetSchema', () => {
  it('emits a DefinedTermSet with a DefinedTerm per item', () => {
    const { container } = render(
      <DefinedTermSetSchema
        name="Silhouette Glossary"
        description="Comprehensive glossary"
        pagePath="/glossary"
        terms={sample}
      />,
    );

    const schema = readEmittedSchema(container);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('DefinedTermSet');
    expect(schema['@id']).toBe('https://docs.silhouette.exchange/glossary#defined-term-set');
    expect(schema.url).toBe('https://docs.silhouette.exchange/glossary');

    const terms = schema.hasDefinedTerm as Array<Record<string, unknown>>;
    expect(terms).toHaveLength(2);
    expect(terms[0]['@type']).toBe('DefinedTerm');
    expect(terms[0]['@id']).toBe('https://docs.silhouette.exchange/glossary#tee');
    expect(terms[0].url).toBe('https://docs.silhouette.exchange/glossary#tee');
    expect(terms[0].name).toBe('TEE (Trusted Execution Environment)');
    expect(terms[0].inDefinedTermSet).toBe(
      'https://docs.silhouette.exchange/glossary#defined-term-set',
    );
  });

  it('falls back to a slugified anchor when none is supplied', () => {
    const { container } = render(
      <DefinedTermSetSchema
        name="Glossary"
        description="d"
        pagePath="/glossary"
        terms={[{ term: 'Order Book', description: 'List of buy and sell orders.' }]}
      />,
    );
    const schema = readEmittedSchema(container);
    const terms = schema.hasDefinedTerm as Array<Record<string, unknown>>;
    expect(terms[0]['@id']).toBe('https://docs.silhouette.exchange/glossary#order-book');
  });

  it('strips parenthetical asides from the auto-anchor', () => {
    const { container } = render(
      <DefinedTermSetSchema
        name="Glossary"
        description="d"
        pagePath="/glossary"
        terms={[
          { term: 'TEE (Trusted Execution Environment)', description: 'hardware enclave.' },
        ]}
      />,
    );
    const schema = readEmittedSchema(container);
    const terms = schema.hasDefinedTerm as Array<Record<string, unknown>>;
    expect(terms[0]['@id']).toBe('https://docs.silhouette.exchange/glossary#tee');
  });

  it('returns null when the term list is empty', () => {
    const { container } = render(
      <DefinedTermSetSchema name="x" description="d" pagePath="/glossary" terms={[]} />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TechArticleSchema from './index';

function readEmittedSchema(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse((script as HTMLScriptElement).textContent || '');
}

describe('TechArticleSchema', () => {
  it('emits a TechArticle JSON-LD block with required fields', () => {
    const { container } = render(
      <TechArticleSchema
        headline="Authentication"
        description="Authenticate with the Silhouette API using SIWE."
        datePublished="2025-01-15"
        dateModified="2026-04-01"
        keywords={['SIWE', 'Silhouette API']}
      />
    );
    const schema = readEmittedSchema(container);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('TechArticle');
    expect(schema.headline).toBe('Authentication');
    expect(schema.description).toBe('Authenticate with the Silhouette API using SIWE.');
    expect(schema.datePublished).toBe('2025-01-15');
    expect(schema.dateModified).toBe('2026-04-01');
    expect(schema.proficiencyLevel).toBe('Intermediate');
    const author = schema.author as Record<string, unknown>;
    expect(author.name).toBe('Silhouette Exchange');
    const publisher = schema.publisher as Record<string, unknown>;
    expect(publisher.name).toBe('Silhouette Exchange');
    expect(schema.keywords).toEqual(['SIWE', 'Silhouette API']);
  });

  it('omits dateModified when not provided', () => {
    const { container } = render(
      <TechArticleSchema headline="Quickstart" description="Start trading in five steps." />
    );
    const schema = readEmittedSchema(container);
    expect(schema.dateModified).toBeUndefined();
    expect(schema.datePublished).toBe('2025-01-01');
  });

  it('includes dateModified when explicitly provided', () => {
    const { container } = render(
      <TechArticleSchema headline="Test" description="Test." dateModified="2026-04-10" />
    );
    const schema = readEmittedSchema(container);
    expect(schema.dateModified).toBe('2026-04-10');
  });

  it('omits keywords when none supplied', () => {
    const { container } = render(
      <TechArticleSchema headline="Intro" description="Plain description." />
    );
    const schema = readEmittedSchema(container);
    expect(schema.keywords).toBeUndefined();
  });

  it('returns null when headline or description is missing', () => {
    const { container } = render(
      <TechArticleSchema headline="" description="Just a description." />
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});

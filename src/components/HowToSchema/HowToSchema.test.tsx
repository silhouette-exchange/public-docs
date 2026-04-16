import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HowToSchema from './index';

function readEmittedSchema(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse((script as HTMLScriptElement).textContent || '');
}

describe('HowToSchema', () => {
  const baseSteps = [
    { name: 'Connect Wallet', text: 'Click Connect Wallet on the app.' },
    { name: 'Deposit Funds', text: 'Transfer funds from HyperCore.' },
  ];

  it('emits a HowTo JSON-LD block with correct structure', () => {
    const { container } = render(
      <HowToSchema
        name="How to Trade on Silhouette"
        description="Start shielded trading in two steps."
        steps={baseSteps}
      />
    );
    const schema = readEmittedSchema(container);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('HowTo');
    expect(schema.name).toBe('How to Trade on Silhouette');
    expect(schema.description).toBe('Start shielded trading in two steps.');
    const steps = schema.step as Record<string, unknown>[];
    expect(steps).toHaveLength(2);
    expect(steps[0]['@type']).toBe('HowToStep');
    expect(steps[0].name).toBe('Connect Wallet');
    expect(steps[0].text).toBe('Click Connect Wallet on the app.');
    expect(steps[1].name).toBe('Deposit Funds');
  });

  it('does not emit position on steps', () => {
    const { container } = render(
      <HowToSchema
        name="Test"
        description="Test"
        steps={baseSteps}
      />
    );
    const schema = readEmittedSchema(container);
    const steps = schema.step as Record<string, unknown>[];
    expect(steps[0]).not.toHaveProperty('position');
  });

  it('resolves relative image paths to absolute URLs', () => {
    const { container } = render(
      <HowToSchema
        name="Test"
        description="Test"
        steps={[{ name: 'Step', text: 'Do it.', image: '/img/screenshot.png' }]}
      />
    );
    const schema = readEmittedSchema(container);
    const steps = schema.step as Record<string, unknown>[];
    expect(steps[0].image).toBe('https://docs.silhouette.exchange/img/screenshot.png');
  });

  it('passes through absolute image URLs unchanged', () => {
    const { container } = render(
      <HowToSchema
        name="Test"
        description="Test"
        steps={[{ name: 'Step', text: 'Do it.', image: 'https://example.com/img.png' }]}
      />
    );
    const schema = readEmittedSchema(container);
    const steps = schema.step as Record<string, unknown>[];
    expect(steps[0].image).toBe('https://example.com/img.png');
  });

  it('handles image arrays (multiple images per step)', () => {
    const { container } = render(
      <HowToSchema
        name="Test"
        description="Test"
        steps={[{
          name: 'Step',
          text: 'Do it.',
          image: ['/img/a.png', '/img/b.png'],
        }]}
      />
    );
    const schema = readEmittedSchema(container);
    const steps = schema.step as Record<string, unknown>[];
    expect(steps[0].image).toEqual([
      'https://docs.silhouette.exchange/img/a.png',
      'https://docs.silhouette.exchange/img/b.png',
    ]);
  });

  it('emits single string (not array) when step has one image', () => {
    const { container } = render(
      <HowToSchema
        name="Test"
        description="Test"
        steps={[{ name: 'Step', text: 'Do it.', image: ['/img/only.png'] }]}
      />
    );
    const schema = readEmittedSchema(container);
    const steps = schema.step as Record<string, unknown>[];
    expect(steps[0].image).toBe('https://docs.silhouette.exchange/img/only.png');
  });

  it('returns null when steps array is empty', () => {
    const { container } = render(
      <HowToSchema name="Test" description="Test" steps={[]} />
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});

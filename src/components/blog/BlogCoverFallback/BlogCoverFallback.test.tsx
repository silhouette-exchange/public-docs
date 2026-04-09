import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogCoverFallback from './index';

describe('BlogCoverFallback', () => {
  it('renders the post title in a heading', () => {
    render(<BlogCoverFallback title="Information Asymmetry" />);
    expect(
      screen.getByRole('heading', { name: 'Information Asymmetry' })
    ).toBeInTheDocument();
  });

  it('renders the Silhouette wordmark in literal all caps', () => {
    render(<BlogCoverFallback title="Test" />);
    // The wordmark must be the literal string "SILHOUETTE" (Orbitron is
    // all-caps only per brand rules). Matching exact case here, not /i.
    expect(screen.getByText('SILHOUETTE')).toBeInTheDocument();
  });

  it('exposes role=img with an accessible name derived from the title', () => {
    render(<BlogCoverFallback title="Dark Pools" />);
    expect(
      screen.getByRole('img', { name: /dark pools/i })
    ).toBeInTheDocument();
  });

  it('applies the fallback class to the root element', () => {
    const { container } = render(<BlogCoverFallback title="Test" />);
    expect(container.firstChild).toHaveClass(/fallback/i);
  });

  it('passes through a custom className alongside the fallback class', () => {
    const { container } = render(
      <BlogCoverFallback title="Test" className="custom-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('custom-class');
    expect(root.className).toMatch(/fallback/i);
  });

  it('hides the decorative gradient, noise, and wordmark layers from AT', () => {
    const { container } = render(<BlogCoverFallback title="Visible Title" />);
    const ariaHiddenNodes = container.querySelectorAll('[aria-hidden="true"]');
    // Three decorative layers: gradient, noise, wordmark.
    expect(ariaHiddenNodes.length).toBe(3);
  });
});

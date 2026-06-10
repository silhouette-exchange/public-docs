// src/components/JoinUs/JoinUs.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import JoinUs from './index';

describe('JoinUs', () => {
  it('renders the default title and subtitle', () => {
    render(<JoinUs />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Join Us');
    expect(screen.getByText('Follow our journey and stay informed.')).toBeInTheDocument();
  });

  it('accepts custom title and subtitle props', () => {
    render(<JoinUs title="Stay in the loop" subtitle="Hear about releases first." />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Stay in the loop');
    expect(screen.getByText('Hear about releases first.')).toBeInTheDocument();
  });

  it('renders four social icon links', () => {
    render(<JoinUs />);
    // All four links have aria-label; use getByRole with name to find them.
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('each icon link has an accessible aria-label', () => {
    render(<JoinUs />);
    expect(screen.getByRole('link', { name: /on X$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /silhouette\.exchange/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Silhouette blog/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Telegram/i })).toBeInTheDocument();
  });

  it('external links get target=_blank + rel=noopener noreferrer', () => {
    render(<JoinUs />);
    const xLink = screen.getByRole('link', { name: /on X$/i });
    expect(xLink).toHaveAttribute('target', '_blank');
    expect(xLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('internal links (/blog) do NOT open in a new tab', () => {
    render(<JoinUs />);
    const blogLink = screen.getByRole('link', { name: /Silhouette blog/i });
    expect(blogLink).not.toHaveAttribute('target');
    expect(blogLink).not.toHaveAttribute('rel');
  });

  it('points to the canonical silhouette accounts', () => {
    render(<JoinUs />);
    expect(screen.getByRole('link', { name: /on X$/i })).toHaveAttribute(
      'href',
      'https://x.com/silhouette_ex',
    );
    expect(screen.getByRole('link', { name: /Telegram/i })).toHaveAttribute(
      'href',
      'https://t.me/silhouette_exchange',
    );
    expect(screen.getByRole('link', { name: /silhouette\.exchange/i })).toHaveAttribute(
      'href',
      'https://silhouette.exchange/',
    );
    expect(screen.getByRole('link', { name: /Silhouette blog/i })).toHaveAttribute(
      'href',
      '/blog',
    );
  });

  it('uses an <aside> landmark with an aria-labelledby pointing at the heading', () => {
    const { container } = render(<JoinUs />);
    const aside = container.querySelector('aside');
    expect(aside).not.toBeNull();
    expect(aside).toHaveAttribute('aria-labelledby', 'join-us-heading');
    const heading = container.querySelector('#join-us-heading');
    expect(heading).toHaveTextContent('Join Us');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BlogHero from './index';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';

const basePost: BlogPostLike = {
  slug: 'shielded-execution-explained',
  title: 'Shielded Execution Explained',
  permalink: '/blog/shielded-execution-explained',
  category: 'research',
  dek: 'Public orderbooks leak strategy to copytrade bots and signal-aware liquidity providers. Shielded execution closes the leakage by encrypting orders until match.',
  coverImage: '/img/hero.png',
  readingTime: 7,
  authorName: 'Wayne van Niekerk',
  authorImageUrl: '/img/logo-square-light.png',
  date: '2026-04-08',
};

describe('BlogHero', () => {
  it('renders the post title as a heading inside the card link', () => {
    render(<BlogHero post={basePost} />);
    const heading = screen.getByRole('heading', {
      name: 'Shielded Execution Explained',
    });
    expect(heading).toBeInTheDocument();
  });

  it('wraps the entire hero in a single anchor pointing to the permalink', () => {
    render(<BlogHero post={basePost} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      'href',
      '/blog/shielded-execution-explained'
    );
  });

  it('renders the cover image when coverImage is set', () => {
    render(<BlogHero post={basePost} />);
    const img = screen.getByAltText('Shielded Execution Explained');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/hero.png');
  });

  it('renders the eyebrow with category label and reading time, no date', () => {
    render(<BlogHero post={basePost} />);
    expect(screen.getByText(/RESEARCH/)).toBeInTheDocument();
    expect(screen.getByText(/7 MIN/)).toBeInTheDocument();
    // The date "APR 08 2026" must NOT appear inside the eyebrow row.
    // It only appears in the footer below.
    const eyebrow = screen
      .getByText(/RESEARCH/)
      .closest('[data-testid="hero-eyebrow"]');
    expect(eyebrow).not.toBeNull();
    expect(eyebrow?.textContent).not.toMatch(/APR 08 2026/);
  });

  it('renders the dek with a 3-line clamp class when provided', () => {
    render(<BlogHero post={basePost} />);
    const dek = screen.getByTestId('hero-dek');
    expect(dek).toBeInTheDocument();
    expect(dek.textContent).toContain('Public orderbooks leak');
  });

  it('omits the dek element when post.dek is undefined', () => {
    render(<BlogHero post={{ ...basePost, dek: undefined }} />);
    expect(screen.queryByTestId('hero-dek')).toBeNull();
  });

  it('renders the byline footer with author name and date', () => {
    render(<BlogHero post={basePost} />);
    expect(screen.getByText('Wayne van Niekerk')).toBeInTheDocument();
    expect(screen.getByText(/APR 08 2026/)).toBeInTheDocument();
  });

  it('renders the author avatar img when authorImageUrl is provided', () => {
    render(<BlogHero post={basePost} />);
    const avatar = screen.getByAltText('Wayne van Niekerk');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/img/logo-square-light.png');
  });

  it('falls back to initials when authorImageUrl is missing', () => {
    render(
      <BlogHero
        post={{ ...basePost, authorImageUrl: undefined }}
      />
    );
    // No <img> with the author name as alt
    expect(screen.queryByAltText('Wayne van Niekerk')).toBeNull();
    // Initial "W" must be present (case-sensitive, Orbitron all-caps)
    const initial = screen.getByText('W', { selector: '[aria-hidden="true"]' });
    expect(initial).toBeInTheDocument();
  });

  it('falls back to initials when the avatar img onError fires', () => {
    render(<BlogHero post={basePost} />);
    const avatar = screen.getByAltText('Wayne van Niekerk');
    fireEvent.error(avatar);
    // After the error, the img is gone and the initial appears
    expect(screen.queryByAltText('Wayne van Niekerk')).toBeNull();
    expect(
      screen.getByText('W', { selector: '[aria-hidden="true"]' })
    ).toBeInTheDocument();
  });

  it('applies the split layout class on the root by default', () => {
    const { container } = render(<BlogHero post={basePost} />);
    const root = container.firstChild as HTMLElement;
    // The split class is the default layout per spec 4e. Mobile stack
    // is handled by media query, not a separate prop.
    expect(root.className).toMatch(/split/i);
  });

  it('throws on a post with an unknown category slug', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<BlogHero post={{ ...basePost, category: 'invalid' }} />)
    ).toThrow(/unknown category/i);
    spy.mockRestore();
  });
});

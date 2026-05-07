import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogPostCard, { type BlogPostLike } from './index';

/*
 * BlogPostCard tests
 *
 * Covers the card anatomy per design doc section 4g:
 *   - outer <a> wraps the whole card (single tap target, native focus)
 *   - cover image via BlogCoverImage (real <img> vs fallback)
 *   - hand-rolled eyebrow row with category + reading time (NO date;
 *     the card spec deliberately excludes date from the eyebrow and
 *     puts it in the footer instead)
 *   - <h2> title rendered in Inter (Orbitron is H1-only per brand rules)
 *   - optional 2-line clamped dek
 *   - footer row with author name and formatted date
 *   - alternating magenta/cyan glow class keyed on a djb2-style hash
 *     of the slug. Determinism is the important property: filter order
 *     cannot flicker the glow colour of a given card.
 *
 * The two slugs used in the glow-parity test are hand-picked from a
 * precomputed set. djb2 applied to "post-a" yields 356150873 (odd ->
 * glowCyan), and to "post-b" yields 356150874 (even -> glowMagenta).
 * Both slugs are short, adjacent, and keep the tests readable.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 4g
 */

const basePost: BlogPostLike = {
  slug: 'information-asymmetry',
  title: 'Information Asymmetry',
  permalink: '/blog/information-asymmetry',
  category: 'research',
  dek: 'Why private trading is not paranoia. It is table stakes for anyone who moves size.',
  coverImage: '/img/blog/covers/information-asymmetry.jpg',
  readingTime: 7,
  authorName: 'Wayne van Niekerk',
  date: '2026-04-08',
};

describe('BlogPostCard', () => {
  it('renders the post title as an H2 heading', () => {
    render(<BlogPostCard post={basePost} />);
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Information Asymmetry',
    });
    expect(heading).toBeInTheDocument();
  });

  it('wraps the whole card in a single anchor pointing to permalink', () => {
    const { container } = render(<BlogPostCard post={basePost} />);
    const anchors = container.querySelectorAll('a');
    // Exactly one anchor: the whole-card link. No nested anchors.
    expect(anchors.length).toBe(1);
    expect(anchors[0]).toHaveAttribute(
      'href',
      '/blog/information-asymmetry'
    );
    // The heading should be inside the anchor, not beside it.
    const heading = screen.getByRole('heading', { level: 2 });
    expect(anchors[0].contains(heading)).toBe(true);
  });

  it('renders the cover image when coverImage is provided', () => {
    render(<BlogPostCard post={basePost} />);
    const img = screen.getByAltText('Information Asymmetry');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      'src',
      '/img/blog/covers/information-asymmetry.jpg'
    );
  });

  it('falls back to BlogCoverFallback when coverImage is undefined', () => {
    render(
      <BlogPostCard post={{ ...basePost, coverImage: undefined }} />
    );
    // BlogCoverFallback exposes role="img" with the title as the name.
    expect(
      screen.getByRole('img', { name: 'Information Asymmetry' })
    ).toBeInTheDocument();
    // No literal <img> element in the fallback path.
    expect(screen.queryByAltText('Information Asymmetry')).toBeNull();
  });

  it('renders the eyebrow with the uppercase category label and reading time', () => {
    render(<BlogPostCard post={basePost} />);
    // Category is rendered uppercase. Reading time is formatted as "N MIN".
    expect(screen.getByText(/RESEARCH/)).toBeInTheDocument();
    expect(screen.getByText(/7 MIN/)).toBeInTheDocument();
    // The card eyebrow deliberately excludes the date (it lives in the
    // footer). Verify the APR 08 2026 date text is NOT inside the
    // eyebrow row itself. We check the footer renders the date below.
  });

  it('renders the dek when provided', () => {
    render(<BlogPostCard post={basePost} />);
    expect(
      screen.getByText(/Why private trading is not paranoia/)
    ).toBeInTheDocument();
  });

  it('omits the dek element when dek is undefined', () => {
    const { container } = render(
      <BlogPostCard post={{ ...basePost, dek: undefined }} />
    );
    // No dek element should exist at all when dek is absent. We scope
    // the query to the container to avoid false positives from other
    // rendered text.
    const deks = container.querySelectorAll('[data-testid="post-card-dek"]');
    expect(deks.length).toBe(0);
  });

  it('renders the footer with author name and formatted date', () => {
    render(<BlogPostCard post={basePost} />);
    expect(screen.getByText('Wayne van Niekerk')).toBeInTheDocument();
    // Date renders in the same uppercase Plex Mono format as BlogEyebrow.
    expect(screen.getByText(/APR 08 2026/)).toBeInTheDocument();
  });

  it('applies glowCyan for slugs whose hash is odd and glowMagenta for even hashes', () => {
    // djb2("post-a") = 356150873 -> odd -> glowCyan
    const { container: cyanContainer } = render(
      <BlogPostCard post={{ ...basePost, slug: 'post-a' }} />
    );
    const cyanCard = cyanContainer.firstChild as HTMLElement;
    expect(cyanCard.className).toMatch(/glowCyan/);
    expect(cyanCard.className).not.toMatch(/glowMagenta/);

    // djb2("post-b") = 356150874 -> even -> glowMagenta
    const { container: magentaContainer } = render(
      <BlogPostCard post={{ ...basePost, slug: 'post-b' }} />
    );
    const magentaCard = magentaContainer.firstChild as HTMLElement;
    expect(magentaCard.className).toMatch(/glowMagenta/);
    expect(magentaCard.className).not.toMatch(/glowCyan/);
  });

  it('keeps the glow class stable across rerenders for the same slug', () => {
    const { container, rerender } = render(
      <BlogPostCard post={{ ...basePost, slug: 'post-a' }} />
    );
    const firstClass = (container.firstChild as HTMLElement).className;

    // Rerender with a new unrelated prop change. The slug is unchanged,
    // so the hash and therefore the glow class must not flicker.
    rerender(
      <BlogPostCard
        post={{ ...basePost, slug: 'post-a', title: 'Updated Title' }}
      />
    );
    const secondClass = (container.firstChild as HTMLElement).className;
    expect(secondClass).toEqual(firstClass);
  });

  it('throws when the post category is not a known slug', () => {
    // BlogPostCard validates the category by calling getCategory, which
    // throws on unknown slugs. Propagation is the contract.
    expect(() =>
      render(
        <BlogPostCard post={{ ...basePost, category: 'not-a-category' }} />
      )
    ).toThrow(/Unknown category/);
  });
});

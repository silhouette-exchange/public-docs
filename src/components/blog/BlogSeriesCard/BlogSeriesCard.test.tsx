import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogSeriesCard from './index';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';

const basePost: BlogPostLike = {
  slug: 'what-is-silhouette',
  title: 'What Is Silhouette?',
  permalink: '/blog/what-is-silhouette',
  category: 'explainers',
  dek: 'A quick primer on shielded perpetuals and why a private orderbook matters when bots watch every wallet.',
  readingTime: 4,
  authorName: 'Wayne van Niekerk',
  date: '2026-04-01',
};

describe('BlogSeriesCard', () => {
  it('renders the visible step indicator as "PART N OF M" in uppercase', () => {
    render(<BlogSeriesCard post={basePost} seriesOrder={1} seriesTotal={7} />);
    expect(screen.getByText('PART 1 OF 7')).toBeInTheDocument();
  });

  it('renders the post title as a heading', () => {
    render(<BlogSeriesCard post={basePost} seriesOrder={1} seriesTotal={7} />);
    expect(
      screen.getByRole('heading', { name: /What Is Silhouette\?/ })
    ).toBeInTheDocument();
  });

  it('includes a screen-reader-only "Part N of M:" prefix on the title for SR users', () => {
    render(<BlogSeriesCard post={basePost} seriesOrder={3} seriesTotal={7} />);
    // The visually hidden span lives inside the heading so screen
    // readers announce the title as "Part 3 of 7: What Is Silhouette?"
    const heading = screen.getByRole('heading', { name: /Part 3 of 7/ });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(/Part 3 of 7:\s*What Is Silhouette\?/);
  });

  it('renders the post dek with a 2-line clamp data-testid', () => {
    render(<BlogSeriesCard post={basePost} seriesOrder={1} seriesTotal={7} />);
    const dek = screen.getByTestId('series-card-dek');
    expect(dek).toBeInTheDocument();
    expect(dek.textContent).toContain('shielded perpetuals');
  });

  it('omits the dek element when post.dek is undefined', () => {
    render(
      <BlogSeriesCard
        post={{ ...basePost, dek: undefined }}
        seriesOrder={1}
        seriesTotal={7}
      />
    );
    expect(screen.queryByTestId('series-card-dek')).toBeNull();
  });

  it('renders a decorative "→ READ" footer marked aria-hidden', () => {
    render(<BlogSeriesCard post={basePost} seriesOrder={1} seriesTotal={7} />);
    const footer = screen.getByText(/→ READ/);
    expect(footer).toBeInTheDocument();
    // The footer is decorative because the whole card is already a
    // single anchor; SRs should not announce a second read affordance.
    expect(footer.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('wraps the entire card in a single anchor pointing to the permalink', () => {
    render(<BlogSeriesCard post={basePost} seriesOrder={1} seriesTotal={7} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/blog/what-is-silhouette');
  });

  it('renders different step indicators for different series positions', () => {
    const { rerender } = render(
      <BlogSeriesCard post={basePost} seriesOrder={1} seriesTotal={7} />
    );
    expect(screen.getByText('PART 1 OF 7')).toBeInTheDocument();

    rerender(<BlogSeriesCard post={basePost} seriesOrder={5} seriesTotal={7} />);
    expect(screen.getByText('PART 5 OF 7')).toBeInTheDocument();
  });
});

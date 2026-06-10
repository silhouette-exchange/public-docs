import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogSeriesBand from './index';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';

function makePost(
  overrides: Partial<BlogPostLike> & { slug: string; title: string }
): BlogPostLike {
  return {
    permalink: `/blog/${overrides.slug}`,
    category: 'explainers',
    readingTime: 5,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-08',
    ...overrides,
  };
}

const seriesPosts: BlogPostLike[] = [
  makePost({
    slug: 'what-is-silhouette',
    title: 'What Is Silhouette?',
    series: 'silhouette-primer',
    seriesOrder: 1,
  }),
  makePost({
    slug: 'why-shielded',
    title: 'Why Shielded Trading Matters',
    series: 'silhouette-primer',
    seriesOrder: 2,
  }),
  makePost({
    slug: 'tee-architecture',
    title: 'TEE Architecture for Crypto',
    series: 'silhouette-primer',
    seriesOrder: 3,
  }),
];

const nonSeriesPost = makePost({
  slug: 'random-post',
  title: 'A Random Standalone Post',
});

describe('BlogSeriesBand', () => {
  it('returns null when activeFilter is not null', () => {
    const { container } = render(
      <BlogSeriesBand allPosts={seriesPosts} activeFilter="research" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when no posts in the listing belong to the series', () => {
    const { container } = render(
      <BlogSeriesBand allPosts={[nonSeriesPost]} activeFilter={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the band label from the series definition', () => {
    render(
      <BlogSeriesBand allPosts={seriesPosts} activeFilter={null} />
    );
    expect(screen.getByText('THE SILHOUETTE SERIES')).toBeInTheDocument();
  });

  it('renders the sub-line from the series definition', () => {
    render(
      <BlogSeriesBand allPosts={seriesPosts} activeFilter={null} />
    );
    expect(
      screen.getByText(/Start here\. Seven essays on why shielded trading matters\./)
    ).toBeInTheDocument();
  });

  it('renders one card per series post', () => {
    render(
      <BlogSeriesBand allPosts={seriesPosts} activeFilter={null} />
    );
    // Each card is one anchor, so we count anchors inside the band
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('orders cards by seriesOrder regardless of input array order', () => {
    // Pass the posts deliberately out of order
    const shuffled = [seriesPosts[2], seriesPosts[0], seriesPosts[1]];
    render(<BlogSeriesBand allPosts={shuffled} activeFilter={null} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/blog/what-is-silhouette');
    expect(links[1]).toHaveAttribute('href', '/blog/why-shielded');
    expect(links[2]).toHaveAttribute('href', '/blog/tee-architecture');
  });

  it('passes seriesOrder and seriesTotal to each card', () => {
    render(
      <BlogSeriesBand allPosts={seriesPosts} activeFilter={null} />
    );
    expect(screen.getByText('PART 1 OF 3')).toBeInTheDocument();
    expect(screen.getByText('PART 2 OF 3')).toBeInTheDocument();
    expect(screen.getByText('PART 3 OF 3')).toBeInTheDocument();
  });

  it('ignores non-series posts when calculating the series total', () => {
    // Mix series posts with a standalone post; the band should still
    // see exactly 3 series posts and render PART 1/3, 2/3, 3/3.
    render(
      <BlogSeriesBand
        allPosts={[...seriesPosts, nonSeriesPost]}
        activeFilter={null}
      />
    );
    expect(screen.getByText('PART 3 OF 3')).toBeInTheDocument();
    // The standalone post should NOT appear as a card.
    expect(screen.queryByText('A Random Standalone Post')).toBeNull();
  });

  it('respects a non-default seriesSlug prop', () => {
    // Posts tagged with a different series slug should be ignored.
    const otherSeriesPost = makePost({
      slug: 'other',
      title: 'Other Series Post',
      series: 'something-else',
      seriesOrder: 1,
    });
    const { container } = render(
      <BlogSeriesBand
        allPosts={[otherSeriesPost]}
        activeFilter={null}
        seriesSlug="silhouette-primer"
      />
    );
    // No silhouette-primer posts → null
    expect(container.firstChild).toBeNull();
  });
});

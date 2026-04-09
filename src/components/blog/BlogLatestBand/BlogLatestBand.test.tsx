import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogLatestBand from './index';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';

function makePost(slug: string, title: string): BlogPostLike {
  return {
    slug,
    title,
    permalink: `/blog/${slug}`,
    category: 'research',
    readingTime: 5,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-08',
  };
}

const posts: BlogPostLike[] = [
  makePost('post-1', 'Post One'),
  makePost('post-2', 'Post Two'),
  makePost('post-3', 'Post Three'),
];

describe('BlogLatestBand', () => {
  it('renders the LATEST label when activeFilter is null', () => {
    render(<BlogLatestBand posts={posts} activeFilter={null} />);
    // Scope to the band's heading element. The post cards each have
    // their own eyebrow row that may also contain category text, so
    // a plain getByText('LATEST') would risk a false match.
    expect(
      screen.getByRole('heading', { name: 'LATEST' })
    ).toBeInTheDocument();
  });

  it('renders the category label in uppercase when filter is set', () => {
    render(<BlogLatestBand posts={posts} activeFilter="research" />);
    // Scope to the band heading. Each card's eyebrow ALSO renders
    // "RESEARCH" because the test fixtures all use that category;
    // querying by role/heading targets only the band label.
    expect(
      screen.getByRole('heading', { name: 'RESEARCH' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'LATEST' })
    ).toBeNull();
  });

  it('renders one BlogPostCard per post', () => {
    render(<BlogLatestBand posts={posts} activeFilter={null} />);
    // Each card is one anchor
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('slices the input to maxPosts when more posts are passed than the cap', () => {
    const tenPosts = Array.from({ length: 10 }, (_, i) =>
      makePost(`post-${i + 1}`, `Post ${i + 1}`)
    );
    render(<BlogLatestBand posts={tenPosts} activeFilter={null} maxPosts={6} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  it('defaults maxPosts to 6 when not provided', () => {
    const eightPosts = Array.from({ length: 8 }, (_, i) =>
      makePost(`post-${i + 1}`, `Post ${i + 1}`)
    );
    render(<BlogLatestBand posts={eightPosts} activeFilter={null} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  it('returns null when posts is empty', () => {
    const { container } = render(
      <BlogLatestBand posts={[]} activeFilter={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('throws when filter is set to an unknown category slug', () => {
    // Filter routing is the parent's responsibility, but if someone
    // passes a bogus slug we surface it via getCategory rather than
    // silently rendering "INVALID" as the label.
    expect(() =>
      render(<BlogLatestBand posts={posts} activeFilter="nope" />)
    ).toThrow(/unknown category/i);
  });

  it('passes each post through to BlogPostCard so card titles render', () => {
    render(<BlogLatestBand posts={posts} activeFilter={null} />);
    expect(
      screen.getByRole('heading', { name: 'Post One' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Post Two' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Post Three' })
    ).toBeInTheDocument();
  });
});

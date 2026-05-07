import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogArchiveList from './index';
import type { BlogPostLike } from '@site/src/components/blog/BlogPostCard';

function makePost(overrides: Partial<BlogPostLike> & { slug: string; title: string }): BlogPostLike {
  return {
    permalink: `/blog/${overrides.slug}`,
    category: 'research',
    readingTime: 5,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-08',
    ...overrides,
  };
}

const posts: BlogPostLike[] = [
  makePost({ slug: 'older-1', title: 'An Older Essay' }),
  makePost({ slug: 'older-2', title: 'Another Older Essay', category: 'guides' }),
  makePost({ slug: 'older-3', title: 'Yet Another Older Essay', category: 'product' }),
];

describe('BlogArchiveList', () => {
  it('renders as an unordered list with one li per post', () => {
    render(<BlogArchiveList posts={posts} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('UL');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('wraps each row in an anchor pointing to the post permalink', () => {
    render(<BlogArchiveList posts={posts} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/blog/older-1');
    expect(links[1]).toHaveAttribute('href', '/blog/older-2');
    expect(links[2]).toHaveAttribute('href', '/blog/older-3');
  });

  it('renders the category label uppercased in the metadata line', () => {
    render(<BlogArchiveList posts={posts} />);
    expect(screen.getByText(/RESEARCH/)).toBeInTheDocument();
    expect(screen.getByText(/GUIDES/)).toBeInTheDocument();
    expect(screen.getByText(/PRODUCT/)).toBeInTheDocument();
  });

  it('renders the date in APR 08 2026 format inside the metadata line', () => {
    render(<BlogArchiveList posts={posts} />);
    // All three posts share the same date in the fixture.
    const dates = screen.getAllByText(/APR 08 2026/);
    expect(dates).toHaveLength(3);
  });

  it('renders the post title as the second line of each row', () => {
    render(<BlogArchiveList posts={posts} />);
    expect(screen.getByText('An Older Essay')).toBeInTheDocument();
    expect(screen.getByText('Another Older Essay')).toBeInTheDocument();
    expect(screen.getByText('Yet Another Older Essay')).toBeInTheDocument();
  });

  it('returns null when the posts array is empty', () => {
    const { container } = render(<BlogArchiveList posts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('throws on a post with an unknown category slug', () => {
    expect(() =>
      render(
        <BlogArchiveList
          posts={[makePost({ slug: 'bad', title: 'Bad', category: 'invalid' })]}
        />
      )
    ).toThrow(/unknown category/i);
  });
});

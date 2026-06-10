import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogCoverImage from './index';

describe('BlogCoverImage', () => {
  it('renders the image when src is provided', () => {
    render(
      <BlogCoverImage src="/img/cover.jpg" alt="Cover" title="Test Post" />
    );
    const img = screen.getByAltText('Cover');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/cover.jpg');
  });

  it('falls back to BlogCoverFallback when src is undefined', () => {
    render(<BlogCoverImage title="Test Post" />);
    // BlogCoverFallback exposes role="img" with the title as accessible name.
    expect(screen.getByRole('img', { name: 'Test Post' })).toBeInTheDocument();
    // No <img> element should exist when falling back.
    expect(screen.queryByAltText('Test Post')).toBeNull();
  });

  it('uses the title as alt text when alt prop is missing', () => {
    render(<BlogCoverImage src="/img/cover.jpg" title="Test Post" />);
    expect(screen.getByAltText('Test Post')).toBeInTheDocument();
  });

  it('uses the title as alt text when alt prop is an empty string', () => {
    // alt="" would normally mark an image as decorative, but for blog
    // covers we always want the title as the accessible name. Verify
    // empty alt is treated like undefined alt.
    render(<BlogCoverImage src="/img/cover.jpg" alt="" title="Test Post" />);
    expect(screen.getByAltText('Test Post')).toBeInTheDocument();
  });

  it('marks real images as lazy-loaded', () => {
    render(<BlogCoverImage src="/img/cover.jpg" title="Test" />);
    expect(screen.getByAltText('Test')).toHaveAttribute('loading', 'lazy');
  });

  it('passes className through to the wrapper when src is provided', () => {
    const { container } = render(
      <BlogCoverImage
        src="/img/cover.jpg"
        title="Test"
        className="custom-class"
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('custom-class');
  });

  it('passes className through to BlogCoverFallback when src is undefined', () => {
    const { container } = render(
      <BlogCoverImage title="Test" className="custom-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('custom-class');
  });
});

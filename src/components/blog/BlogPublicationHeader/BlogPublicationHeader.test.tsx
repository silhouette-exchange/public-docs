import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogPublicationHeader from './index';

describe('BlogPublicationHeader', () => {
  it('renders the page title', () => {
    render(<BlogPublicationHeader title="Blog" subtitle="Writing on shielded trading" />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('renders the page title as an h1', () => {
    render(<BlogPublicationHeader title="Blog" subtitle="Writing on shielded trading" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Blog' })).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    const subtitle = 'Writing on shielded trading, TEE architecture, and the road to private perps';
    render(<BlogPublicationHeader title="Blog" subtitle={subtitle} />);
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('does not render a subtitle when not provided', () => {
    render(<BlogPublicationHeader title="Blog" />);
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    // Verify there is no <p> sibling
    const { container } = render(<BlogPublicationHeader title="Standalone" />);
    expect(container.querySelector('p')).toBeNull();
  });
});

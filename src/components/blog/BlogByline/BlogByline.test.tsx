import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogByline from './index';

/*
 * BlogByline tests
 *
 * Covers the avatar cluster, initials fallback (missing URL and runtime
 * onError), multi-author overflow, link behaviour on the name block,
 * the avatar size variant, and the initials extraction rule. The initials
 * rule is "first character of the first word, capitalised" - single char.
 *
 * Spec: docs/plans/2026-04-09-blog-redesign-design.md section 5c
 */

describe('BlogByline', () => {
  it('renders a single author with avatar, name, and title', () => {
    render(
      <BlogByline
        authors={[
          {
            name: 'Wayne van Niekerk',
            title: 'Head of Growth',
            imageUrl: '/img/wayne.jpg',
          },
        ]}
      />
    );

    const img = screen.getByAltText('Wayne van Niekerk');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/wayne.jpg');
    expect(screen.getByText('Wayne van Niekerk')).toBeInTheDocument();
    expect(screen.getByText('Head of Growth')).toBeInTheDocument();
  });

  it('falls back to initials when imageUrl is undefined', () => {
    render(<BlogByline authors={[{ name: 'Wayne van Niekerk' }]} />);

    // No <img> should exist for this author.
    expect(screen.queryByAltText('Wayne van Niekerk')).toBeNull();
    // Initials should be rendered. "Wayne van Niekerk" -> "W".
    expect(screen.getByText('W')).toBeInTheDocument();
  });

  it('falls back to initials when the <img> onError handler fires', () => {
    render(
      <BlogByline
        authors={[
          {
            name: 'Sydney Smith',
            imageUrl: '/img/broken.jpg',
          },
        ]}
      />
    );

    const img = screen.getByAltText('Sydney Smith');
    expect(img).toBeInTheDocument();

    // Fire a synthetic error event. Component should swap to initials.
    fireEvent.error(img);

    expect(screen.queryByAltText('Sydney Smith')).toBeNull();
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('renders two visible avatars for a two-author cluster', () => {
    render(
      <BlogByline
        authors={[
          { name: 'Wayne', imageUrl: '/img/wayne.jpg' },
          { name: 'Sydney', imageUrl: '/img/sydney.jpg' },
        ]}
      />
    );

    expect(screen.getByAltText('Wayne')).toBeInTheDocument();
    expect(screen.getByAltText('Sydney')).toBeInTheDocument();
    // Comma-joined names in the name slot.
    expect(screen.getByText('Wayne, Sydney')).toBeInTheDocument();
    // No "+N more" for exactly two authors.
    expect(screen.queryByText(/\+\d+ more/)).toBeNull();
  });

  it('renders two avatars plus "+1 more" text for three authors', () => {
    render(
      <BlogByline
        authors={[
          { name: 'Wayne', imageUrl: '/img/wayne.jpg' },
          { name: 'Sydney', imageUrl: '/img/sydney.jpg' },
          { name: 'Jerri', imageUrl: '/img/jerri.jpg' },
        ]}
      />
    );

    // Only the first two authors render as avatars.
    expect(screen.getByAltText('Wayne')).toBeInTheDocument();
    expect(screen.getByAltText('Sydney')).toBeInTheDocument();
    expect(screen.queryByAltText('Jerri')).toBeNull();

    // Names are comma-joined with the "+N more" suffix.
    expect(screen.getByText('Wayne, Sydney, +1 more')).toBeInTheDocument();
  });

  it('renders two avatars plus "+3 more" text for five authors', () => {
    render(
      <BlogByline
        authors={[
          { name: 'Wayne' },
          { name: 'Sydney' },
          { name: 'Jerri' },
          { name: 'Stent' },
          { name: 'Chandler' },
        ]}
      />
    );

    // The third through fifth authors never render as avatars.
    expect(screen.getByText('Wayne, Sydney, +3 more')).toBeInTheDocument();
  });

  it('wraps the author name block in a link when url is provided', () => {
    render(
      <BlogByline
        authors={[
          {
            name: 'Wayne van Niekerk',
            title: 'Head of Growth',
            imageUrl: '/img/wayne.jpg',
            url: 'https://silhouette.exchange/team/wayne',
          },
        ]}
      />
    );

    const link = screen.getByRole('link', { name: /Wayne van Niekerk/ });
    expect(link).toHaveAttribute(
      'href',
      'https://silhouette.exchange/team/wayne'
    );
    // The avatar itself must NOT be wrapped in the link. The Medium pattern:
    // only the name block navigates. Verify the <img> is not a descendant
    // of the anchor element.
    const img = screen.getByAltText('Wayne van Niekerk');
    expect(link.contains(img)).toBe(false);
  });

  it('applies a different avatar class for sm vs md size variants', () => {
    const { container: smContainer } = render(
      <BlogByline
        authors={[{ name: 'Wayne', imageUrl: '/img/wayne.jpg' }]}
        avatarSize="sm"
      />
    );
    const smImg = smContainer.querySelector('img');
    const smClasses = smImg?.className ?? '';

    const { container: mdContainer } = render(
      <BlogByline
        authors={[{ name: 'Wayne', imageUrl: '/img/wayne.jpg' }]}
        avatarSize="md"
      />
    );
    const mdImg = mdContainer.querySelector('img');
    const mdClasses = mdImg?.className ?? '';

    // A visible class swap, not just a style change.
    expect(smClasses).not.toEqual(mdClasses);
    expect(smClasses.length).toBeGreaterThan(0);
    expect(mdClasses.length).toBeGreaterThan(0);
  });

  it('extracts initials as the first character of the first word, uppercased', () => {
    // Lowercase single-word name -> uppercased single char.
    const { rerender } = render(
      <BlogByline authors={[{ name: 'wayne' }]} />
    );
    expect(screen.getByText('W')).toBeInTheDocument();

    // Multi-word name -> still just the first char of the first word.
    rerender(<BlogByline authors={[{ name: 'Sydney Smith' }]} />);
    expect(screen.getByText('S')).toBeInTheDocument();

    // Multi-word lowercase name.
    rerender(<BlogByline authors={[{ name: 'jerri de wit' }]} />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });
});

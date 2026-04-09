import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BlogEyebrow from './index';

describe('BlogEyebrow', () => {
  it('renders the category label in uppercase', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.getByText(/RESEARCH/)).toBeInTheDocument();
  });

  it('renders the reading time when provided', () => {
    render(
      <BlogEyebrow category="research" readingTime={7} date="2026-04-08" />
    );
    expect(screen.getByText(/7 MIN/)).toBeInTheDocument();
  });

  it('omits reading time when not provided', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.queryByText(/MIN/)).toBeNull();
  });

  it('renders the date in FULL format by default as "APR 08 2026"', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.getByText(/APR 08 2026/)).toBeInTheDocument();
  });

  it('renders the date in month-year format when dateFormat=month-year', () => {
    render(
      <BlogEyebrow
        category="research"
        date="2026-04-08"
        dateFormat="month-year"
      />
    );
    expect(screen.getByText(/APR 2026/)).toBeInTheDocument();
  });

  it('renders the category as a link when linkCategory=true', () => {
    render(
      <BlogEyebrow category="research" date="2026-04-08" linkCategory />
    );
    expect(screen.getByRole('link', { name: /research/i })).toHaveAttribute(
      'href',
      '/blog?category=research'
    );
  });

  it('renders the category as plain text when linkCategory=false', () => {
    render(<BlogEyebrow category="research" date="2026-04-08" />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('throws on invalid category slug', () => {
    // Suppress React's expected console.error from the throw.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<BlogEyebrow category="invalid" date="2026-04-08" />)
    ).toThrow(/unknown category/i);
    spy.mockRestore();
  });

  it('formats the date in UTC regardless of test runner timezone', () => {
    // Regression guard: an earlier draft of formatDate mixed
    // toLocaleDateString (local TZ) with getUTCDate (UTC), so an
    // input like "2026-04-01" parsed as UTC midnight in a UTC-5
    // environment would render the local month "MAR" alongside the
    // UTC day "01" → "MAR 01 2026", which is wrong. The fix is to
    // use timeZone: 'UTC' in the locale options too. This test pins
    // a UTC-midnight date right at a month boundary so the bug
    // would surface in any non-UTC test environment.
    render(<BlogEyebrow category="research" date="2026-04-01" />);
    expect(screen.getByText(/APR 01 2026/)).toBeInTheDocument();
  });

  it('emits a machine-readable <time dateTime> attribute', () => {
    const { container } = render(
      <BlogEyebrow category="research" date="2026-04-08" />
    );
    const timeEl = container.querySelector('time');
    expect(timeEl).not.toBeNull();
    expect(timeEl).toHaveAttribute('dateTime');
    // ISO date string starts with the year.
    expect(timeEl?.getAttribute('dateTime')).toMatch(/^2026-04-08/);
  });
});

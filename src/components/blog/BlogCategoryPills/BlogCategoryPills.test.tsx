import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BlogCategoryPills from './index';
import { CATEGORIES } from '@site/src/data/blog/categories';

describe('BlogCategoryPills', () => {
  it('renders an All pill plus one pill per category from the registry', () => {
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    for (const category of CATEGORIES) {
      expect(
        screen.getByRole('button', { name: category.label })
      ).toBeInTheDocument();
    }
  });

  it('marks the All pill as pressed when activeSlug is null', () => {
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    for (const category of CATEGORIES) {
      expect(
        screen.getByRole('button', { name: category.label })
      ).toHaveAttribute('aria-pressed', 'false');
    }
  });

  it('marks the matching pill as pressed when activeSlug is set', () => {
    render(<BlogCategoryPills activeSlug="research" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Research' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('calls onChange with the category slug when a pill is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug={null} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Research' }));
    expect(onChange).toHaveBeenCalledWith('research');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange with null when the All pill is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug="research" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('renders the container with role=toolbar and an aria-label', () => {
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    expect(
      screen.getByRole('toolbar', { name: /filter posts by category/i })
    ).toBeInTheDocument();
  });

  it('moves focus from All to the next pill on ArrowRight', async () => {
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    const allPill = screen.getByRole('button', { name: 'All' });
    allPill.focus();
    expect(document.activeElement).toBe(allPill);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Research' })
    );
  });

  it('wraps focus to the last pill when pressing ArrowLeft on the All pill', async () => {
    const user = userEvent.setup();
    render(<BlogCategoryPills activeSlug={null} onChange={() => {}} />);
    const allPill = screen.getByRole('button', { name: 'All' });
    allPill.focus();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Announcements' })
    );
  });
});

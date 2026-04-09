import React, { useRef } from 'react';
import { CATEGORIES } from '@site/src/data/blog/categories';
import styles from './styles.module.css';

export interface BlogCategoryPillsProps {
  /** The currently active filter slug. null means the All pill is active. */
  activeSlug: string | null;
  /** Called when a pill is clicked. Passes null for the All pill, otherwise the category slug. */
  onChange: (slug: string | null) => void;
}

interface PillDescriptor {
  slug: string | null;
  label: string;
}

/*
 * The pill list is built at render time from the CATEGORIES registry.
 * Order is: All (slug null) + every category in registry order. Do not
 * hardcode the 5 category labels here. If the registry changes, this
 * component picks it up without edits.
 */
function buildPills(): PillDescriptor[] {
  return [
    { slug: null, label: 'All' },
    ...CATEGORIES.map((c) => ({ slug: c.slug, label: c.label })),
  ];
}

export default function BlogCategoryPills({
  activeSlug,
  onChange,
}: BlogCategoryPillsProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const pills = buildPills();

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const buttons = Array.from(
      toolbarRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []
    );
    const currentIndex = buttons.findIndex((b) => b === document.activeElement);
    if (currentIndex === -1) return;
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + delta + buttons.length) % buttons.length;
    buttons[nextIndex]?.focus();
  }

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Filter posts by category"
      className={styles.toolbar}
      onKeyDown={handleKeyDown}
    >
      {pills.map((pill) => {
        const isActive = pill.slug === activeSlug;
        return (
          <button
            key={pill.slug ?? 'all'}
            type="button"
            aria-pressed={isActive}
            className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
            onClick={() => onChange(pill.slug)}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}

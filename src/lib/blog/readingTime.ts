// src/lib/blog/readingTime.ts
//
// Reading time calculator for technical blog content.
// Uses 200 WPM (slower than the Medium default of 250) because
// technical content carries cognitive load that halves skim speed.
// See docs/plans/2026-04-09-blog-redesign-design.md §13 R9.

const WORDS_PER_MINUTE = 200;

/**
 * Calculate reading time in whole minutes for a markdown string.
 * Strips markdown syntax and code blocks before counting words.
 * Always returns at least 1 (we never show "0 min read").
 */
export function calculateReadingTime(markdown: string): number {
  if (!markdown) return 1;

  const cleaned = markdown
    // Remove fenced code blocks (multi-line)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove link syntax, keep the label: [label](url) -> label
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove emphasis markers: **bold** *italic* __x__ _x_
    .replace(/(\*\*|__|\*|_)([^*_]*)\1/g, '$2')
    // Remove heading markers
    .replace(/^#+\s+/gm, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = cleaned ? cleaned.split(/\s+/).length : 0;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(minutes, 1);
}

/**
 * Format a reading time integer as "N MIN" (uppercase, Plex Mono ready).
 * Matches the eyebrow format documented in the design doc.
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} MIN`;
}

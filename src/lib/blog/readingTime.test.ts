// src/lib/blog/readingTime.test.ts
import { describe, it, expect } from 'vitest';
import { calculateReadingTime, formatReadingTime } from './readingTime';

describe('calculateReadingTime', () => {
  it('returns 1 minute for very short content', () => {
    expect(calculateReadingTime('Hello world')).toBe(1);
  });

  it('uses 200 WPM for technical content', () => {
    // 400 words should be 2 minutes at 200 WPM
    const words = 'word '.repeat(400).trim();
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('rounds up to the nearest minute', () => {
    // 250 words = 1.25 min, should round up to 2
    const words = 'word '.repeat(250).trim();
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('handles markdown by stripping syntax before counting', () => {
    const markdown = '# Heading\n\n[link](url) **bold** *italic* `code`';
    // 5 real words: Heading, link, bold, italic, code
    expect(calculateReadingTime(markdown)).toBe(1);
  });

  it('handles empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('handles code blocks as zero words (skimmed, not read)', () => {
    const markdown =
      'Read this:\n\n```ts\nconst x = 1;\nconst y = 2;\n```\n\nEnd.';
    // Only "Read this: End." counts = 3 words
    expect(calculateReadingTime(markdown)).toBe(1);
  });
});

describe('formatReadingTime', () => {
  it('formats as "N MIN" uppercase', () => {
    expect(formatReadingTime(7)).toBe('7 MIN');
  });

  it('handles 1 minute', () => {
    expect(formatReadingTime(1)).toBe('1 MIN');
  });
});

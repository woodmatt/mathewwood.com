import { describe, expect, test } from 'vite-plus/test';
import {
  metaContent,
  nextStored,
  parseStored,
  renderedScheme,
  themeColorMedia,
  type Stored,
} from '../src/lib/theme';

describe('parseStored', () => {
  test('accepts light and dark', () => {
    expect(parseStored('light')).toBe('light');
    expect(parseStored('dark')).toBe('dark');
  });
  test('treats anything else as following the system', () => {
    expect(parseStored(null)).toBeNull();
    expect(parseStored('light dark')).toBeNull();
    expect(parseStored('purple')).toBeNull();
  });
});

describe('renderedScheme', () => {
  test('follows the system when nothing is stored', () => {
    expect(renderedScheme(null, false)).toBe('light');
    expect(renderedScheme(null, true)).toBe('dark');
  });
  test('a stored value wins over the system', () => {
    expect(renderedScheme('dark', false)).toBe('dark');
    expect(renderedScheme('light', true)).toBe('light');
  });
});

describe('nextStored', () => {
  test('pins the opposite of the system', () => {
    expect(nextStored(null, false)).toBe('dark');
    expect(nextStored(null, true)).toBe('light');
  });
  test('toggling back to the system clears the pin instead of storing it', () => {
    expect(nextStored('dark', false)).toBeNull();
    expect(nextStored('light', true)).toBeNull();
  });
  test('flips what is on screen, even when the pin now matches the system', () => {
    // Pinned dark, then the OS switched to dark: the visitor sees dark, so toggling goes light.
    expect(nextStored('dark', true)).toBe('light');
  });

  test('a pin survives the OS changing scheme (time-of-day switching)', () => {
    // OS light → visitor pins dark.
    let stored: Stored = nextStored(null, false);
    expect(stored).toBe('dark');
    // OS goes dark, then back to light: nothing toggles, so the pin is kept throughout.
    expect(renderedScheme(stored, true)).toBe('dark');
    expect(renderedScheme(stored, false)).toBe('dark');
    // The visitor toggles with the OS light: back to following the system.
    stored = nextStored(stored, false);
    expect(stored).toBeNull();
    expect(renderedScheme(stored, false)).toBe('light');
  });
});

describe('metaContent', () => {
  test('defaults to following the system', () => {
    expect(metaContent(null)).toBe('light dark');
    expect(metaContent('dark')).toBe('dark');
  });
});

describe('themeColorMedia', () => {
  test('uses the system query when nothing is pinned', () => {
    expect(themeColorMedia('dark', null)).toBe('(prefers-color-scheme: dark)');
  });
  test('turns the pinned scheme on and the other off', () => {
    expect(themeColorMedia('dark', 'dark')).toBe('all');
    expect(themeColorMedia('light', 'dark')).toBe('not all');
  });
});

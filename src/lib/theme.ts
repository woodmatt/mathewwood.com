/**
 * Colour-scheme toggle logic, kept free of the DOM so it can be unit tested.
 *
 * The site follows the system preference unless the visitor pins the opposite one.
 * Two-state toggle, three underlying states:
 *   null    → follow the system (nothing stored; <meta name="color-scheme"> is "light dark")
 *   'light' → pinned light
 *   'dark'  → pinned dark
 * A pinned value that matches the system is only ever cleared by the visitor toggling,
 * never automatically, so a pin survives an OS that switches schemes by time of day.
 */

export type Scheme = 'light' | 'dark';
export type Stored = Scheme | null;

/** localStorage key. The inline script in BaseLayout reads the same key. */
export const STORAGE_KEY = 'color-scheme';

/** Reads a stored value, treating anything unexpected as "follow the system". */
export function parseStored(value: string | null): Stored {
  return value === 'light' || value === 'dark' ? value : null;
}

/** The scheme the visitor actually sees. */
export function renderedScheme(stored: Stored, systemDark: boolean): Scheme {
  return stored ?? (systemDark ? 'dark' : 'light');
}

/**
 * What to store after a toggle: the opposite of what's on screen, unless that
 * is the system scheme, in which case the visitor is undoing their override.
 */
export function nextStored(stored: Stored, systemDark: boolean): Stored {
  const target: Scheme = renderedScheme(stored, systemDark) === 'dark' ? 'light' : 'dark';
  const system: Scheme = systemDark ? 'dark' : 'light';
  return target === system ? null : target;
}

/** Content for <meta name="color-scheme">. */
export function metaContent(stored: Stored): string {
  return stored ?? 'light dark';
}

/**
 * `media` for a <meta name="theme-color"> that belongs to `scheme`, so the browser
 * chrome follows a pinned scheme instead of only the system preference.
 */
export function themeColorMedia(scheme: Scheme, stored: Stored): string {
  if (stored === null) return `(prefers-color-scheme: ${scheme})`;
  return stored === scheme ? 'all' : 'not all';
}

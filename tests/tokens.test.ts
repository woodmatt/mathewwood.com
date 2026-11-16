// Guards the design system: raw colours, font sizes, spacing and breakpoints may only be
// written in src/styles/tokens.css. Everything else uses var(--…) tokens, so sections and
// pages can't drift apart.
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, test } from 'vite-plus/test';

const SRC = join(import.meta.dirname, '..', 'src');

/** Files allowed to hold raw values. */
const EXEMPT = new Set([
  'styles/tokens.css',
  // The ATS resume is a standalone print document in points, deliberately outside the site design.
  'pages/resume/print.astro',
]);

const ALLOWED_BREAKPOINTS = new Set(['48rem', '64rem']);

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path);
    return /\.(astro|css)$/.test(entry.name) ? [path] : [];
  });
}

/** The CSS in a file: whole .css files, plus <style> blocks and style="" attributes in .astro. */
function css(path: string): string {
  const text = readFileSync(path, 'utf8');
  if (path.endsWith('.css')) return text;
  const blocks = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const attrs = [...text.matchAll(/\sstyle=["'`{]([^"'`}]*)/g)].map((m) => m[1]);
  return [...blocks, ...attrs].join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
}

const sources = files(SRC)
  .map((path) => ({ file: relative(SRC, path), css: css(path) }))
  .filter(({ file }) => !EXEMPT.has(file));

function violations(pattern: RegExp, allow?: (match: RegExpMatchArray) => boolean) {
  return sources.flatMap(({ file, css }) =>
    [...css.matchAll(pattern)].filter((m) => !allow?.(m)).map((m) => `${file}: ${m[0].trim()}`),
  );
}

describe('design tokens', () => {
  test('scans the component styles', () => {
    expect(sources.length).toBeGreaterThan(10);
  });

  test('colours come from tokens', () => {
    expect(violations(/#[0-9a-f]{3,8}\b|\b(?:rgb|hsl)a?\(/gi)).toEqual([]);
  });

  test('font sizes come from the type scale', () => {
    expect(
      violations(/font-size:\s*([^;]+);/g, (m) =>
        /^var\(--text-[\w-]+\)$|^inherit$/.test(m[1].trim()),
      ),
    ).toEqual([]);
  });

  test('spacing comes from the spacing scale', () => {
    const value = /^(?:0|auto|var\(--[\w-]+\)|calc\(.*var\(--[\w-]+\).*\))$/;
    expect(
      violations(
        /\b(?:margin|padding|gap|row-gap|column-gap|inset)(?:-[a-z-]+)?:\s*([^;{]+);/g,
        (m) =>
          m[1]
            .trim()
            .split(/\s+(?![^(]*\))/)
            .every((part) => value.test(part)),
      ),
    ).toEqual([]);
  });

  test('media queries use the two grid breakpoints', () => {
    expect(
      violations(/@media[^{]*\(\s*(?:min-|max-)?width\s*(?:[<>]=?|:)\s*([\d.]+\w+)/g, (m) =>
        ALLOWED_BREAKPOINTS.has(m[1]),
      ),
    ).toEqual([]);
  });
});

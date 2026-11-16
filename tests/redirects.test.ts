// Every redirect in netlify.toml must land on a page (and section) that still exists,
// so renaming a case study or a section id can't silently break old links.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vite-plus/test';

const ROOT = join(import.meta.dirname, '..');
const toml = readFileSync(join(ROOT, 'netlify.toml'), 'utf8');

const redirects = [...toml.matchAll(/\[\[redirects\]\]\s*from = "([^"]+)"\s*to = "([^"]+)"/g)].map(
  ([, from, to]) => ({ from, to }),
);

/** Section ids that exist on the homepage (index.astro plus the shared footer). */
const homeIds = new Set(
  ['src/pages/index.astro', 'src/components/SiteFooter.astro'].flatMap((f) =>
    [...readFileSync(join(ROOT, f), 'utf8').matchAll(/\sid="([\w-]+)"/g)].map((m) => m[1]),
  ),
);

function pageExists(path: string): boolean {
  if (path === '/') return true;
  const work = path.match(/^\/work\/([\w-]+)\/$/);
  if (work) return existsSync(join(ROOT, 'src/content/projects', `${work[1]}.md`));
  const page = path.match(/^\/([\w-]+)\/$/);
  return page ? existsSync(join(ROOT, 'src/pages', `${page[1]}.astro`)) : false;
}

describe('netlify redirects', () => {
  test('are parsed from netlify.toml', () => {
    expect(redirects.length).toBeGreaterThanOrEqual(11);
  });

  test.each(redirects)('$from → $to', ({ to }) => {
    const [path, hash] = to.split('#');
    expect(pageExists(path), `missing page ${path}`).toBe(true);
    if (hash) expect(homeIds.has(hash), `missing #${hash} on the homepage`).toBe(true);
  });

  test('specific project rules come before the /project/* catch-all', () => {
    const catchAll = redirects.findIndex((r) => r.from === '/project/*');
    const lastSpecific = redirects.findLastIndex(
      (r) => r.from.startsWith('/project/') && r.from !== '/project/*',
    );
    expect(catchAll).toBeGreaterThan(lastSpecific);
  });
});

// Accessibility and semantics audit for every built page.
//
//   vp run build && pnpm a11y
//
// For each route it runs axe-core (WCAG 2.0–2.2 A/AA rules plus best practices) and
// its own structural checks: exactly one <h1>, no skipped heading levels, a single
// <main>, and every <section>/<article> named by a heading. Exits non-zero on any
// failure so it can gate CI.
import { access, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { preview } from 'astro';
import { chromium, type Page } from 'playwright-core';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

const ROUTES = [
  '/',
  '/resume/',
  '/resume/print/',
  '/work/colorado-geological-survey/',
  '/work/csu-parking/',
  '/work/humane-colorado/',
  '/work/ms-cc/',
  '/work/remedy-medical-properties/',
  '/404.html',
];
const WIDTHS = [1440, 390];
// Every page is audited in both colour schemes, so dark-mode contrast is gated too.
const SCHEMES = ['light', 'dark'] as const;

interface Finding {
  route: string;
  width: number;
  scheme: (typeof SCHEMES)[number];
  rule: string;
  detail: string;
}

await access('dist/index.html').catch(() => {
  console.error('a11y: dist/ is missing. Run `vp run build` first.');
  process.exit(1);
});

async function structure(page: Page) {
  return page.evaluate(() => {
    const problems: { rule: string; detail: string }[] = [];
    const visible = (el: Element) => !el.closest('[hidden], [aria-hidden="true"]');
    const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(visible);

    const h1s = headings.filter((h) => h.tagName === 'H1');
    if (h1s.length !== 1)
      problems.push({ rule: 'one-h1', detail: `found ${h1s.length} <h1> elements` });
    if (headings[0] && headings[0].tagName !== 'H1') {
      problems.push({
        rule: 'h1-first',
        detail: `first heading is <${headings[0].tagName.toLowerCase()}>`,
      });
    }

    let previous = 0;
    for (const h of headings) {
      const level = Number(h.tagName[1]);
      if (previous && level > previous + 1) {
        problems.push({
          rule: 'heading-order',
          detail: `<h${previous}> → <h${level}> skips a level at "${h.textContent?.trim().slice(0, 50)}"`,
        });
      }
      previous = level;
    }

    const mains = document.querySelectorAll('main');
    if (mains.length !== 1)
      problems.push({ rule: 'one-main', detail: `found ${mains.length} <main> elements` });

    for (const el of document.querySelectorAll('section, article')) {
      if (!visible(el)) continue;
      const named = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
      const heading = el.querySelector(':scope h1, :scope h2, :scope h3, :scope h4');
      if (!named && !heading) {
        const tag = el.tagName.toLowerCase();
        const cls = el.getAttribute('class')?.split(' ')[0] ?? '';
        problems.push({
          rule: 'sectioning-heading',
          detail: `<${tag} class="${cls}"> has no heading or label`,
        });
      }
    }

    for (const el of document.querySelectorAll('div[aria-labelledby], span[aria-labelledby]')) {
      if (!el.hasAttribute('role')) {
        problems.push({
          rule: 'aria-label-on-generic',
          detail: `<${el.tagName.toLowerCase()}> uses aria-labelledby without a role; use <section>`,
        });
      }
    }
    return problems;
  });
}

const server = await preview({ root: process.cwd(), logLevel: 'error', server: { port: 4398 } });
const browser = await chromium.launch({ channel: process.env.RESUME_CHROME_CHANNEL ?? 'chrome' });
const findings: Finding[] = [];

try {
  for (const scheme of SCHEMES)
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
      for (const route of ROUTES) {
        await page.goto(`http://localhost:${server.port}${route}`, { waitUntil: 'networkidle' });
        await page.addScriptTag({ content: axeSource });
        const axe = await page.evaluate(async () => {
          // @ts-expect-error axe is injected above
          const result = await window.axe.run(document, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
            },
          });
          return (result.violations as { id: string; nodes: { target: string[] }[] }[]).map(
            (v) => ({
              rule: v.id,
              detail: v.nodes.map((n) => n.target.join(' ')).join(', '),
            }),
          );
        });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        if (overflow)
          findings.push({
            route,
            width,
            scheme,
            rule: 'horizontal-scroll',
            detail: 'page scrolls sideways',
          });
        for (const f of [...axe, ...(await structure(page))])
          findings.push({ route, width, scheme, ...f });
      }
      await page.close();
    }
} finally {
  await browser.close();
  await server.stop();
}

// Structural rules don't change with width; report each once.
const seen = new Set<string>();
const unique = findings.filter((f) => {
  const key = `${f.route}|${f.rule}|${f.detail}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

if (unique.length === 0) {
  console.log(
    `a11y: ${ROUTES.length} pages × ${WIDTHS.length} widths × ${SCHEMES.length} schemes, no problems found.`,
  );
} else {
  for (const f of unique)
    console.log(`✗ ${f.route} @${f.width}px ${f.scheme}  ${f.rule}: ${f.detail}`);
  console.log(`\na11y: ${unique.length} problem(s).`);
  process.exit(1);
}

// Prints /resume/print/ to PDF with the Google Chrome already installed on this machine.
//
//   pnpm resume:pdf            → public/resume.pdf (no phone; safe to publish)
//   pnpm resume:pdf:private    → private/<name>.pdf for job applications (git-ignored)
//
// The private copy reads RESUME_PHONE (required) and RESUME_EMAIL (optional) from the
// environment, so personal contact details never land in the repo or the deployed site:
//   RESUME_PHONE="303-555-0100" pnpm resume:pdf:private
//
// Run `vp run build` first; this script serves the built site from dist/.
import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { preview } from 'astro';
import { chromium } from 'playwright-core';

const FILE_NAME = 'Mathew-Wood-Front-End-Developer-Resume.pdf';
const isPrivate = process.argv.includes('--private');

function fail(message: string): never {
  console.error(`resume-pdf: ${message}`);
  process.exit(1);
}

await access('dist/resume/print/index.html').catch(() =>
  fail('dist/ is missing the resume page. Run `vp run build` first.'),
);

const phone = process.env.RESUME_PHONE?.trim();
const email = process.env.RESUME_EMAIL?.trim();
if (isPrivate && !phone)
  fail('set RESUME_PHONE for the private copy, e.g. RESUME_PHONE="303-555-0100".');

const server = await preview({ root: process.cwd(), logLevel: 'error', server: { port: 4399 } });
const browser = await chromium
  .launch({ channel: process.env.RESUME_CHROME_CHANNEL ?? 'chrome' })
  .catch(() =>
    fail(
      'could not start Google Chrome. Install it, or set RESUME_CHROME_CHANNEL (e.g. "msedge").',
    ),
  );

try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.port}/resume/print/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  if (isPrivate) {
    await page.evaluate(
      ({ phone, email }) => {
        const phoneEl = document.querySelector<HTMLElement>('[data-private="phone"]');
        if (phoneEl && phone) {
          phoneEl.textContent = phone;
          phoneEl.hidden = false;
        }
        const emailEl = document.querySelector<HTMLElement>('[data-private="email"]');
        if (emailEl && email) emailEl.textContent = email;
      },
      { phone, email },
    );
  }

  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: false, tagged: true });

  if (isPrivate) {
    await mkdir('private', { recursive: true });
    await writeFile(`private/${FILE_NAME}`, pdf);
    console.log(`resume-pdf: wrote private/${FILE_NAME}`);
  } else {
    await mkdir('public', { recursive: true });
    await writeFile('public/resume.pdf', pdf);
    await copyFile('public/resume.pdf', 'dist/resume.pdf');
    console.log('resume-pdf: wrote public/resume.pdf (and dist/resume.pdf)');
  }
} finally {
  await browser.close();
  await server.stop();
}

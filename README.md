# mathewwood.com

Portfolio of Mathew Wood, front-end developer. The design borrows from print production: crop marks, registration marks, a CMYK colour bar, and a career told as four printing plates.

## Stack

- **Astro** (static output) for pages, with **React** islands only where something is interactive
- **Vite+** (`vp`) for formatting (Oxfmt), linting and type-aware checks (Oxlint), and tests (Vitest)
- **TypeScript** strict, **modern CSS** (custom properties, nesting, cascade layers), **IBM Plex** self-hosted
- **Content collections** with Zod schemas for projects and résumé entries, so the build fails on bad content
- **Native View Transitions** between pages, with no JavaScript

## Commands

| Command        | What it does                                                          |
| -------------- | --------------------------------------------------------------------- |
| `vp install`   | Install dependencies                                                  |
| `vp run dev`   | Astro dev server at `localhost:4321`                                  |
| `vp check`     | Format, lint and type-check                                           |
| `vp test`      | Run unit tests                                                        |
| `vp run build` | Type-check `.astro` files and build to `dist/`                        |
| `pnpm a11y`    | Audit every built page with axe-core plus heading and landmark checks |

`vp dev` and `vp build` start plain Vite, not Astro, so always use `vp run dev` and `vp run build` here.

## Content

- Case studies: `src/content/projects/*.md`, one file per project. Front matter is validated by `src/content.config.ts`.
- Résumé entries: `src/content/experience/*.md`. Dates are `YYYY` or `YYYY-MM`; leave `end` out for a current role.
- Site details and skills: `src/data/`.

## Accessibility

WCAG 2.2 AA is the floor: a skip link, landmarks, visible focus, 44px touch targets, `prefers-reduced-motion` respected, and text colours checked at 4.5:1 or better. The CMYK process colours are decorative and never carry text.

## Notes

- TypeScript is pinned to 6.x because `astro check` does not support TypeScript 7 yet.
- Production deploys from `main` only (see `netlify.toml`); branches get deploy previews.

## Resume PDF

The site's resume page and `public/resume.pdf` come from the same content (`src/content/experience/`, `src/content/projects/`, `src/data/resume.ts`). The PDF is a plain, single-column layout at `/resume/print/`, built to parse cleanly in applicant tracking systems.

| Command                                    | What it does                                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `pnpm resume:pdf`                          | Rebuild `public/resume.pdf` (no phone number; safe to publish)                                                            |
| `RESUME_PHONE="…" pnpm resume:pdf:private` | Write an application copy with a phone number to `private/` (git-ignored). `RESUME_EMAIL` optionally overrides the email. |

Run `vp run build` first. The script prints with the installed Google Chrome via `playwright-core`; set `RESUME_CHROME_CHANNEL` to use another browser.

## Design system

All colours, type sizes, spacing and breakpoints live in `src/styles/tokens.css`, and `tests/tokens.test.ts` fails if a raw value appears anywhere else. Layouts sit on one grid: 4 columns on phones, 8 from 48rem, 12 from 64rem, placed with `.grid`, `.subgrid` and `.md-span-N` / `.lg-span-N` classes. Press Shift+G in `vp run dev` to overlay the columns.

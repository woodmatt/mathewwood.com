# mathewwood.com — project guide for Claude Code

Personal portfolio for Mathew (Matt) Wood. **Goal: land an in-house front-end developer role at a product company** (on-site or hybrid, Denver metro; Littleton, CO). Every decision should serve a hiring manager scanning the site in under a minute. The repo itself is part of the portfolio, so code quality and the README matter.

## Commands

- `vp install` — install deps (pnpm under the hood)
- `vp run dev` — Astro dev server (localhost:4321)
- `vp check` — format (Oxfmt) + lint/type-aware checks (Oxlint). Use `vp check --fix` to auto-format.
- `vp test --run` — Vitest unit tests (`tests/**/*.test.{ts,tsx}`, jsdom)
- `vp run build` — `astro check` then `astro build` to `dist/`
- `pnpm a11y` — after a build: axe-core (WCAG 2.2 AA + best practices) plus heading/landmark checks on every page at desktop and phone widths, in both light and dark schemes

**Never use bare `vp dev` or `vp build`** — those start plain Vite, not Astro. Always `vp run dev` / `vp run build`.
Run `vp check`, `vp test --run`, `vp run build` and `pnpm a11y` before calling any task done.

## Stack and decisions (settled — don't relitigate)

- Astro 7, static output. React (TSX) **only** for interactive islands; everything else is `.astro`.
- React was chosen over Vue because it dominates US front-end job postings.
- TypeScript strict. **TypeScript is pinned to 6.x** because `astro check` doesn't support TS 7 yet.
- Modern CSS: custom properties, native nesting, `@layer reset, tokens, base, components, utilities`, Astro scoped styles. No Tailwind, no SCSS.
- Content in the repo as Astro content collections with Zod schemas (`src/content.config.ts`). No CMS.
- Fonts self-hosted via Fontsource: Fraunces (variable) for display, IBM Plex Sans + Mono for body and labels. `base.css` sets `font-size-adjust: from-font` on every element so fallbacks match each font's x-height (no layout shift on swap).
- Native cross-document View Transitions (`@view-transition`, opted in only under `prefers-reduced-motion: no-preference`), no JS router. Plain page crossfade only; a card-to-case-study morph was tried and rejected, so don't add one.
- Speculation Rules (`<script type="speculationrules">` in `BaseLayout`) prerender same-site links on hover (`moderate`). Links with `download` or `rel=nofollow` are excluded.
- Hosting: Netlify free tier, production deploys from `main` only (free plan meters production deploys); branches use deploy previews.
- Imports in tests come from `vite-plus/test`, not `vitest`.

## Design: "Press Proof"

Print-production aesthetic reflecting Matt's background (print → design → web → front-end): crop marks (`CropFrame`), registration mark (`RegMark`), slug line (`SlugLine`), CMYK colour bar (`ColorBar`), and the career shown as four plates — C print & operations, M design, Y agency web, K front-end (current, printed solid).

- Tokens live in `src/styles/tokens.css`: colour, type scale (`--text-*`), spacing (`--space-*`), grid and line tokens. Paper `#F6F3EC`, ink `#16161A`, accent magenta `#B0005A` (6.3:1 on paper). **Never write a raw colour, font size, spacing value or breakpoint anywhere else** — `tests/tokens.test.ts` fails the build if you do. Need a new value? Add a token.
- Heading sizes are set once in `base.css` (h1 `--text-6xl`, h2 `--text-4xl`, h3 `--text-2xl`). Don't resize headings per page.
- **Layout grid:** 4 columns on phones, 8 from 48rem, 12 from 64rem; column gap = page gutter. Lay out with `.wrap.grid` and span classes (`.md-span-N`, `.lg-span-N`); use `.subgrid` when a child's children must sit on the same columns. Don't create one-off `grid-template-columns`. The only breakpoints are 48rem and 64rem. In `vp run dev`, Shift+G toggles a column overlay.
- **Process colours (C/M/Y) are decoration only — never text.**
- **Light and dark themes.** Each colour is a raw `--x-light`/`--x-dark` pair in `tokens.css`, combined with `light-dark()`; components use only the combined tokens, never the raw pairs. Dark is "black stock": paper `#1C1B19`, ink `#EEEAE1`, accent `#FF6EAE`. Three surface roles: `--ink` used as a background is an **inverse** surface and flips with the theme (K plate, pressed buttons, skip link; text on it uses `--paper`/`--inverse-*`). The footer is the **solid** surface (`--solid`, `--on-solid*`), which stays dark in both themes. Everything else sits on `--paper*`. Any new colour needs both values and ≥ 4.5:1 text contrast in each theme.
- **Theme toggle** (`ThemeToggle.astro` + `src/lib/theme.ts`, tested): two-state, follow the system or pin the opposite. It writes `<meta name="color-scheme">`, and `base.css` maps that meta to `color-scheme` on `:root`. A tiny inline script in `BaseLayout` applies a stored pin before first paint. For non-colour differences between themes, use the `.if-light`/`.if-dark` utilities; never a JS-applied `.dark` class.
- Display: **Fraunces** (variable, weight + optical-size axes via `@fontsource-variable/fraunces`), 600, mixed case. Body: IBM Plex Sans. Labels: IBM Plex Mono. The display look (font, weight, case, tracking, leading) is controlled by the `--font-display` / `--display-*` tokens; set `--display-case: uppercase` for all-caps headings.
- Keep the print marks small details on a clean, modern layout; never gimmicky.
- Design mockups (Home + Résumé) exist on a Claude design canvas; the built pages already match them.

## Accessibility is the headline skill — the site must prove it

WCAG 2.2 AA minimum: skip link, landmarks, exactly one `h1` per page, no skipped heading levels, every `<section>`/`<article>` named by a heading, visible `:focus-visible`, 44px minimum touch targets, `prefers-reduced-motion` respected (per animation, with the `@media` nested beside it; no global `0.01ms` override; prefer opting in with `no-preference`), text contrast ≥ 4.5:1, decorative SVGs `aria-hidden`, real `<a>`/`<button>` elements. No horizontal scroll at 390px wide.

## Content

- Case studies: `src/content/projects/*.md`. Order: Colorado Geological Survey (featured), CSU Parking, Humane Colorado, MS-CC, Remedy Medical Properties. All five have written bodies (a page shows an "on press now" note only if its body is empty). Body headings: Problem · My role · Approach · Accessibility · Outcome.
- Résumé: `src/content/experience/*.md`, one file per role, dates `YYYY` or `YYYY-MM`, omit `end` for current role. Current title is **Full Stack Developer** at Fireant Studios (Oct 2022–present).
- `src/data/site.ts` (name, location, availability, email, links) and `src/data/skills.ts`.
- Don't invent facts, numbers, or outcomes about Matt's projects — ask him or leave a clear placeholder.
- Keep personal phone/email off the web pages; site email is hello@mathewwood.com.

## Resume PDF

- `/resume/print/` is a plain, ATS-friendly layout (single column, standard headings, no tables/icons/images). Keep it that way.
- `pnpm resume:pdf` regenerates `public/resume.pdf` after `vp run build`; `RESUME_PHONE=… pnpm resume:pdf:private` writes an application copy to git-ignored `private/`. Never commit a phone number.
- Per application, tailor `summary` and skills order in `src/data/resume.ts`. Only list skills the experience or projects back up.
- Project screenshots live in `src/assets/projects/<slug>/` and are wired via `cover`, `coverAlt` and `gallery` front matter.

## Roadmap

- **Phase 1 — MVP (current):** home, 3 case studies written (CGS, CSU Parking, Humane Colorado), résumé page + PDF, 404. Launch gate: Lighthouse accessibility 100, 3 case studies live.
- **Phase 2 — v1.1:** remaining 2 case studies, About page, `ResumeFilter` React island (filter roles by tag, `aria-pressed` buttons) with tests, Playwright + axe in CI, Open Graph images.
  - Dark theme with header toggle: done.
  - `ResumeFilter` filtering animation: done. It uses an **element-scoped** view transition (`list.startViewTransition()` + `flushSync`) so the rest of the page stays interactive; in browsers without scoped transitions the list updates instantly (no document-level fallback, by design). Role names (`match-element`) apply only under `@supports (view-transition-scope: all)` so the page-navigation crossfade never captures them.
- **Later:** notes/blog, interactive demos inside case studies.

## Open items

- None tracked.

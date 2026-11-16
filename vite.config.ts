import { defineConfig } from 'vite-plus';

// Vite+ handles formatting, linting, type-aware checks and tests.
// Astro's own CLI handles dev and build: run them with `vp run dev` / `vp run build`.
export default defineConfig({
  fmt: {
    ignorePatterns: ['dist/**', '.astro/**', 'pnpm-lock.yaml'],
    singleQuote: true,
    semi: true,
  },
  lint: {
    // node_modules is listed explicitly: Oxlint's default skip relies on .gitignore,
    // and without it type-aware linting walks every dependency and stalls.
    ignorePatterns: ['node_modules/**', 'dist/**', '.astro/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
  },
});

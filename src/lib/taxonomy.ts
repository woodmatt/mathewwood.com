// Shared vocabulary for content. Kept free of `astro:*` imports so React islands
// and Vitest can use it; `src/content.config.ts` builds its Zod enums from these.

export const TAGS = ['development', 'accessibility', 'design', 'print'] as const;
export type Tag = (typeof TAGS)[number];

export const TAG_LABEL: Record<Tag, string> = {
  development: 'Development',
  accessibility: 'Accessibility',
  design: 'Design',
  print: 'Print',
};

/** The career as four printing plates; K (current) is printed solid. */
export const PLATES = ['C', 'M', 'Y', 'K'] as const;
export type Plate = (typeof PLATES)[number];

export const PLATE_LABEL: Record<Plate, string> = {
  C: 'Print & operations',
  M: 'Design',
  Y: 'Web',
  K: 'Development',
};

/** Process colours are decoration only, never text. */
export const PLATE_COLOR: Record<Plate, string> = {
  C: 'var(--process-c)',
  M: 'var(--process-m)',
  Y: 'var(--process-y)',
  K: 'var(--process-k)',
};

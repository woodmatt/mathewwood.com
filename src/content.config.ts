import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PLATES, TAGS } from './lib/taxonomy';

const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, 'Use YYYY or YYYY-MM');

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      year: z.number().int().optional(),
      role: z.string(),
      summary: z.string().max(160),
      featured: z.boolean().default(false),
      order: z.number().int(),
      stack: z.array(z.string()),
      tags: z.array(z.enum(TAGS)),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      liveUrl: z.url().optional(),
      visibility: z.enum(['public', 'description-only']),
      draft: z.boolean().default(false),
    }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    plate: z.enum(PLATES),
    title: z.string(),
    promotions: z.string().optional(),
    company: z.string(),
    location: z.string(),
    start: yearMonth,
    end: yearMonth.optional(),
    bullets: z.array(z.string()).min(1),
    tags: z.array(z.enum(TAGS)).min(1),
  }),
});

export const collections = { projects, experience };

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a YYYY-MM-DD calendar date').refine((value) => {
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}, 'Expected a valid calendar date');

const daily = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/daily' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(30).max(220),
    datePT: calendarDate,
    publishedAtCST: z.coerce.date(),
    language: z.enum(['zh', 'en']),
    author: z.string(),
    categories: z.array(z.enum([
      'models',
      'products',
      'research',
      'devtools',
      'business',
      'policy',
      'security',
    ])).min(1),
    cover: z.string().startsWith('/covers/'),
    sourceFile: z.string(),
    itemCount: z.number().int().positive(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { daily };

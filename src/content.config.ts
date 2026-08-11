import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const daily = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/daily' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(30).max(220),
    datePT: z.coerce.date(),
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

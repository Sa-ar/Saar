import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const navLink = z.object({
  href: z.string(),
  label: z.string(),
});

export const collections = {
  caseStudies: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/caseStudies' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      eyebrow: z.string(),
      h1: z.string(),
      /** Short intro under the title (Markdown: **bold**, `code`). */
      lead: z.string(),
      navPrev: navLink.optional(),
      navNext: navLink.optional(),
    }),
  }),
};

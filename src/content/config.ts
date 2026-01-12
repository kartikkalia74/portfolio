import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Kartik kalia'),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    link: z.string().optional(),
    github: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    pubDate: z.date(),
    carousel: z.array(z.object({
      img: z.string(),
      description: z.string()
    })).optional(),
  }),
});

export const collections = { blog, projects };
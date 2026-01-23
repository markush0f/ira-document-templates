import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().default('General'),
    order: z.number().default(0),
    content: z.string().optional(),
    diagram: z.string().optional(),
    sql: z.string().optional(),
    endpoints: z.array(z.object({
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
      path: z.string(),
      description: z.string(),
    })).optional(),
  }),
});

export const collections = { docs };

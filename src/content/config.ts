import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'data',
  schema: z.union([
    // Documentation Page
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      content_markdown: z.string(),
      diagram_mermaid: z.string().nullable().optional(),
      related_files: z.array(z.string()).nullable().optional(),
    }),
    // Sidebar Configuration
    z.object({
      project_name: z.string(),
      tree: z.array(z.any()),
    }),
    // Metadata
    z.object({
      project: z.string(),
      generated_at: z.string().optional(),
      total_duration: z.number().optional(),
      pages: z.array(z.any()).optional(),
      navigation_duration: z.number().optional(),
    }).passthrough()
  ]),
});

export const collections = { docs };

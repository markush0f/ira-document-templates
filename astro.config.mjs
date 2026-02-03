// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), react()],

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },

  adapter: node({
    mode: 'standalone'
  }),
  output: 'server'
});
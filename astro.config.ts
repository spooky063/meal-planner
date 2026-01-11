// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://spooky063.github.io',
  base: '/meal-planner',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    preact({
      include: ['**/preact/*'],
    }),
  ],
});
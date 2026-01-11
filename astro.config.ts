// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    preact({ include: ['**/preact/*'] }),
    db()
  ],

  adapter: netlify(),
});
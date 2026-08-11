import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ai.concitech.org',
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://aurora-design-system.vercel.app',
  integrations: [react()],
  trailingSlash: 'never',
  // PREVIEW=1 builds flat .html files for the static preview export (scripts/export-preview.mjs)
  build: { format: process.env.PREVIEW ? 'file' : 'directory', assets: process.env.PREVIEW ? 'assets' : '_astro' },
  outDir: process.env.PREVIEW ? 'dist-preview' : 'dist',
  devToolbar: { enabled: false },
});

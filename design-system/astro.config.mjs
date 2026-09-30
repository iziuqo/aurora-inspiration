import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const preview = !!process.env.PREVIEW;

export default defineConfig({
  site: 'https://izaias.xyz',
  // Served at izaias.xyz/aurora/design from the same Vercel project as the concept page.
  base: preview ? '/' : '/aurora/design',
  integrations: [react()],
  trailingSlash: 'never',
  // PREVIEW=1 builds flat .html files for the static preview export (scripts/export-preview.mjs)
  build: { format: preview ? 'file' : 'directory', assets: preview ? 'assets' : '_astro' },
  outDir: preview ? 'dist-preview' : 'dist',
  devToolbar: { enabled: false },
});

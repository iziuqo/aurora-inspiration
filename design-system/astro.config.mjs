import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://aurora-design-system.vercel.app',
  integrations: [react()],
  trailingSlash: 'never',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});

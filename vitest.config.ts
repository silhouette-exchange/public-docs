import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@site': path.resolve(__dirname, './'),
      '@docusaurus/Link': path.resolve(__dirname, './src/test/mocks/Link.tsx'),
      '@docusaurus/router': path.resolve(__dirname, './src/test/mocks/router.ts'),
      '@docusaurus/BrowserOnly': path.resolve(__dirname, './src/test/mocks/BrowserOnly.tsx'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: { modules: { classNameStrategy: 'non-scoped' } },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'build', '.docusaurus'],
  },
});

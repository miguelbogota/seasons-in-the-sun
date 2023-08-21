/// <reference types="vitest" />

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts', '**/*.test.tsx'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
  },
  plugins: [vanillaExtractPlugin(), tsconfigPaths()],
});

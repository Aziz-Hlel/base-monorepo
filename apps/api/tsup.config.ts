/// <reference types="node" />

import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  clean: true,
  sourcemap: true,
  bundle: true,
  esbuildOptions(options) {
    options.alias = {
      '@': path.resolve(__dirname, 'src'),
      '@repo/contracts': path.resolve(__dirname, '../../packages/contracts/src'),
    };
  },
});

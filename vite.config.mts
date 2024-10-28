import { resolve } from 'path';
import { defineConfig } from 'vite';

const NAME = 'PositionObserver';

const mainFile = {
  es: `index.mjs`,
  cjs: `index.cjs`,
  iife: `index.js`,
};

export default defineConfig({
  base: './',
  esbuild: {
    legalComments: 'none',
  },
  build: {
    minify: 'esbuild',
    emptyOutDir: true,
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'), // main file
      ],
      name: NAME,
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => mainFile[format]
    },
    sourcemap: true,
  },
});

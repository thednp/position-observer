import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";

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
  plugins: [
    {
      ...dts({
        outDir: 'dist',
        copyDtsFiles: true,
        rollupTypes: true,
      }),
      apply: 'build'
    }
  ],
  build: {
    minify: 'esbuild',
    emptyOutDir: true,
    target: 'ESNext',
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

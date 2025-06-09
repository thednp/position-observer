import { defineConfig } from 'tsdown'

export default defineConfig(
  {
    exports: true,
    target: "esnext",
    entry: {
      'index': 'src/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    globalName: "PositionObserver",
    skipNodeModulesBundle: true,
    external: ["@thednp/shorty"],
  },
);

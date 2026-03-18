import { defineConfig } from 'tsdown'

export default defineConfig(
  {
    exports: true,
    target: "esnext",
    entry: {
      'index': 'src/index.ts',
    },
    format: ['esm'],
    platform: "neutral",
    dts: true,
    clean: true,
    sourcemap: true,
    globalName: "PositionObserver",
    deps: {
      skipNodeModulesBundle: true,
      neverBundle: ["@thednp/shorty"],
    }
  },
);

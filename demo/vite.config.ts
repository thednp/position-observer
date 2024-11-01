import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: "../docs",
    emptyOutDir: true,
  },
});

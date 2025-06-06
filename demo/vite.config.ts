import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [],
  server: {
    port: 3000,
  },
  build: {
    target: "es2020",
    outDir: "../docs",
    emptyOutDir: true,
  },
});

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
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "..", "src"),
      "@": path.resolve(__dirname, "assets"),
    },
  },
});

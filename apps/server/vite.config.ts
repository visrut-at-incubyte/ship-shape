import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "main.ts",
    },
    target: "node18",
    minify: false,
    emptyOutDir: true,
  },
});

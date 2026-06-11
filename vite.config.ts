import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base:'/new_silvertoss/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Remove the dev server proxy for `/uploads`.  In the static build we serve
  // uploaded images from the `public/uploads` folder directly, so proxying to
  // a backend causes images to fail to load during development.
  server: {
    // No proxy configuration is needed for a purely static site.
  },
});

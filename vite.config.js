import { defineConfig } from "vite";

// The repository name, used as the GitHub Pages sub-path.
// Override it when you need a different base:
//   VITE_BASE=/ npm run build            -> for USERNAME.github.io
//   VITE_BASE=./ npm run build           -> for itch.io / a plain folder
const REPO = "luna-little-universe";

export default defineConfig({
  base: process.env.VITE_BASE || `/${REPO}/`,
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    target: "es2020",
    // Phaser is ~1.4 MB on its own; one bundle is simpler than code-splitting
    // a game this size, so the default warning isn't telling us anything.
    chunkSizeWarningLimit: 2000
  },
  server: {
    port: 5173,
    open: false
  },
  preview: {
    port: 4173
  }
});

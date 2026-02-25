import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import mdx from "@mdx-js/rollup";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeMathjax from "rehype-mathjax";
import path from "node:path";

export default defineConfig({
  plugins: [
    mdx({
      jsxImportSource: "preact",
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter" }],
      ],
      rehypePlugins: [rehypeMathjax],
    }),
    fresh(),
  ],

  // ─── STARTUP PERFORMANCE ────────────────────────────────────────────────────
  server: {
    watch: {
      // Vite's file watcher (chokidar) does NOT respect .gitignore.
      // Explicitly ignore heavy directories to prevent scanning thousands of files.
      ignored: [
        "**/wasm/target/**", // Rust build artifacts — tens of thousands of files
        "**/node_modules/**",
        "**/.git/**",
        "**/docs/**", // Static markdown — no impact on the app
        "**/subjects/**", // Research/planning txt files
      ],
    },
  },

  // Pre-bundle only what is actually needed. Keeps cold-start lean.
  optimizeDeps: {
    exclude: [
      // These are server-side remark/rehype plugins run at build time only.
      // Pre-bundling them adds overhead without benefit.
      "rehype-mathjax",
      "remark-math",
      "remark-gfm",
    ],
  },

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
});

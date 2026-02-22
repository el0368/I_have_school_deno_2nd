import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import mdx from "@mdx-js/rollup";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  plugins: [
    mdx({
      jsxImportSource: "preact",
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    fresh(),
  ],
});

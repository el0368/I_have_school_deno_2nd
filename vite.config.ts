import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import mdx from "@mdx-js/rollup";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  plugins: [
    mdx({
      jsxImportSource: "preact",
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    fresh(),
  ],
});

import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import mdx from "@mdx-js/rollup";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeMathjax from "rehype-mathjax";

export default defineConfig({
  plugins: [
    mdx({
      jsxImportSource: "preact",
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeMathjax],
    }),
    fresh(),
  ],
});

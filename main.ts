import { h } from "preact";
import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import mdxRoutes from "./mdx-routes.ts";
import { CurriculumLayout } from "./components/CurriculumLayout.tsx";
import { log } from "./lib/logger.ts";
import { loadEnv } from "./config/env.ts";
import { computeLessonNeighbors } from "./utils/lesson_nav.ts";

// Validate all required environment variables at startup.
// This will throw immediately if SESSION_SECRET (or other required vars) is missing.
loadEnv();

export const app = new App<State>();

app.use(staticFiles());

// Security middleware — CORS + basic headers
app.use(async (ctx) => {
  const res = await ctx.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Only allow API calls from our own origin in production
  const origin = ctx.req.headers.get("origin") ?? "";
  const allowed = Deno.env.get("APP_URL") ?? "http://localhost:5173";
  if (origin === allowed || origin === "") {
    res.headers.set("Access-Control-Allow-Origin", origin || "*");
  }
  return res;
});

// Request logger
app.use(async (ctx) => {
  const start = Date.now();
  const res = await ctx.next();
  log.debug(`${ctx.req.method} ${new URL(ctx.req.url).pathname}`, {
    ms: Date.now() - start,
  });
  return res;
});

// Include file-system based routes here
app.fsRoutes();

/**
 * THE "BULLETPROOF" MDX ROUTER
 * This catch-all handler handles our .mdx pages.
 * It is positioned AFTER app.fsRoutes(), so .tsx files always have priority!
 */
app.get("*", async (ctx) => {
  const url = new URL(ctx.req.url);
  let path = url.pathname;

  log.debug(`[MDX Router] ${path}`);

  /**
   * 1. URL NORMALIZATION (Trailing Slash Fix)
   * Users sometimes type "/hello/" instead of "/hello".
   * This code "cleans" the URL so it matches our registry even if
   * there is an extra slash at the end.
   */
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  // Look for the requested path in our Auto-Discovered MDX registry
  const mdxLoader = mdxRoutes[path];

  // If we don't find an MDX file for this path, move back to Fresh
  // to show the standard 404 page.
  if (!mdxLoader) return ctx.next();

  log.debug(`[MDX Registry] Found loader for: ${path}`);

  try {
    // Dynamically load the MDX file (Vite handles the translation to JS)
    const mdxModule = await mdxLoader();
    const MDXContent = mdxModule.default;

    if (!MDXContent) {
      log.warn(`[MDX] No default export found for: ${path}`);
      return ctx.next();
    }

    /**
     * 2. LAYOUT FLEXIBILITY
     * We render the MDX content directly.
     * If the path starts with /learn/, we wrap it in our CurriculumLayout side-bar.
     * Math is rendered by MathJax (rehype-mathjax, server-side) and MathLive (islands).
     * No CDN dependencies needed here.
     */
    if (path.startsWith("/learn/")) {
      // ─── Prev / Next lesson computation ─────────────────────────────
      const { prevLesson, nextLesson } = computeLessonNeighbors(
        path,
        Object.keys(mdxRoutes),
      );

      return ctx.render(
        h(CurriculumLayout, {
          path,
          prevLesson,
          nextLesson,
          children: h(MDXContent, null),
        }),
      );
    }

    return ctx.render(h(MDXContent, null));
  } catch (e) {
    /**
     * 3. FATAL ERROR REPORTING
     * If an MDX file has a syntax error that crashes the compiler,
     * we catch it here and show a 500 Error message.
     * This is much better than a silent 404!
     */
    log.error(`[MDX] Error loading ${path}`, { error: String(e) });

    return new Response(
      `500 Internal Server Error\n\nFailed to compile MDX file for path: ${path}\nCheck the terminal for details.`,
      { status: 500 },
    );
  }
});

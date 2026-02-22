import { h } from "preact";
import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";
import mdxRoutes from "./mdx-routes.ts";
import { CurriculumLayout } from "./components/CurriculumLayout.tsx";

export const app = new App<State>();

app.use(staticFiles());

// Pass a shared value from a middleware
app.use(async (ctx) => {
  ctx.state.shared = "hello";
  return await ctx.next();
});

// this is the same as the /api/:name route defined via a file. feel free to delete this!
app.get("/api2/:name", (ctx) => {
  const name = ctx.params.name;
  return new Response(
    `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
  );
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(exampleLoggerMiddleware);

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

  console.log(`[Router Trace] Intercepted path: ${path}`);

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

  console.log(`[MDX Registry] Found loader for: ${path}`);

  try {
    // Dynamically load the MDX file (Vite handles the translation to JS)
    const mdxModule = await mdxLoader();
    const MDXContent = mdxModule.default;

    if (!MDXContent) {
      console.error(`[MDX Error] No default export found for: ${path}`);
      return ctx.next();
    }

    /**
     * 2. LAYOUT FLEXIBILITY
     * We render the MDX content directly.
     * If the path starts with /learn/, we wrap it in our CurriculumLayout side-bar.
     */
    if (path.startsWith("/learn/")) {
      return ctx.render(
        h(CurriculumLayout, { path, children: h(MDXContent, null) }),
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
    console.error(`[MDX Exception] Error loading ${path}:`, e);

    return new Response(
      `500 Internal Server Error\n\nFailed to compile MDX file for path: ${path}\nCheck the terminal for details.`,
      { status: 500 },
    );
  }
});

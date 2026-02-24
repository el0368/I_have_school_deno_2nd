import type { FreshContext } from "fresh";

interface ErrorPageProps {
  error: unknown;
  ctx: FreshContext;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  const isDev = Deno.env.get("DENO_ENV") !== "production";
  const message = error instanceof Error ? error.message : "Unknown error";

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>500 — Server Error</title>
        <style>
          {`
          body {
            font-family: system-ui, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
          }
          .container { text-align: center; padding: 2rem; max-width: 600px; }
          h1 { font-size: 6rem; margin: 0; color: #ef4444; font-weight: 800; }
          h2 { font-size: 1.5rem; margin: 0.5rem 0 1rem; }
          p { color: #94a3b8; margin-bottom: 2rem; }
          pre {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 0.5rem;
            padding: 1rem;
            text-align: left;
            font-size: 0.8rem;
            color: #f87171;
            overflow: auto;
            margin-bottom: 2rem;
          }
          a {
            background: #6366f1;
            color: white;
            padding: 0.6rem 1.4rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
          }
          a:hover { background: #4f46e5; }
        `}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>500</h1>
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred on the server.</p>
          {isDev && <pre>{message}</pre>}
          <a href="/">Go Home</a>
        </div>
      </body>
    </html>
  );
}

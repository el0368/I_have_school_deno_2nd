export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>404 — Page Not Found</title>
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
          .container { text-align: center; padding: 2rem; }
          h1 { font-size: 6rem; margin: 0; color: #6366f1; font-weight: 800; }
          h2 { font-size: 1.5rem; margin: 0.5rem 0 1rem; }
          p { color: #94a3b8; margin-bottom: 2rem; }
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
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist or has been moved.</p>
          <a href="/">Go Home</a>
        </div>
      </body>
    </html>
  );
}

import { define } from "../utils.ts";
import { GlobalNav } from "../components/GlobalNav.tsx";
import { UserStatusBar } from "../components/UserStatusBar.tsx";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sovereign Academy</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body>
        <GlobalNav />
        <UserStatusBar />
        <Component />
      </body>
    </html>
  );
});

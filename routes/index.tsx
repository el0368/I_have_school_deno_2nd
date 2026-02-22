import { signal } from "@preact/signals";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Counter from "../islands/Counter.tsx";

export default define.page(function Home(ctx) {
  const count = signal(3);

  console.log("Shared value " + ctx.state.shared);

  return (
    <div class="home-container fresh-gradient">
      <Head>
        <title>Fresh counter</title>
      </Head>
      <div class="hero-section">
        <img
          class="logo"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="hero-title">Welcome to Fresh</h1>
        <p class="hero-text">
          Try updating this message in the
          <code class="code-snippet">./routes/index.tsx</code>{" "}
          file, and refresh.
        </p>
        <Counter count={count} />
      </div>
    </div>
  );
});

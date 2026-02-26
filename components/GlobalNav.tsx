export function GlobalNav() {
  return (
    <nav class="global-nav">
      <div class="global-nav-left">
        <a href="/" class="global-nav-brand">
          Sovereign Academy
        </a>
        <div class="global-nav-links">
          <a href="/curriculum/math" class="global-nav-link">Math</a>
          <a href="/curriculum/math/by_grade" class="global-nav-link">
            By Grade
          </a>
          <a href="/curriculum/math/by_topics" class="global-nav-link">
            By Topics
          </a>
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          class="global-nav-search"
        />
      </div>
      <div class="global-nav-right">
        <a href="/settings" class="global-nav-link">Settings</a>
        <div class="global-nav-avatar">SA</div>
      </div>
    </nav>
  );
}

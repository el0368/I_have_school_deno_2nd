export function UserStatusBar() {
  return (
    <div class="user-status-bar">
      <div class="streak-counter">
        <span class="streak-icon">🔥</span>
        <span class="streak-text">0 Days</span>
        <span class="streak-hint">Start your streak!</span>
      </div>
      <div class="status-divider"></div>
      <div class="xp-section">
        <span class="xp-label">Level 1</span>
        <div class="xp-bar">
          <div class="xp-fill" style="width: 0%;"></div>
        </div>
        <span class="xp-amount">0 XP</span>
      </div>
    </div>
  );
}

// ============================================================================
// Welcome Email Template
// ============================================================================
// Usage: send via your email provider (Resend, SendGrid, etc.)

export function welcomeEmail(displayName: string): {
  subject: string;
  html: string;
} {
  return {
    subject: "Welcome to Sovereign Academy! 🎓",
    html: `
      <h1>Hi ${displayName}, welcome aboard!</h1>
      <p>You now have access to your free account. Start learning today.</p>
      <p><a href="$APP_URL/learn">Go to your dashboard →</a></p>
    `,
  };
}

// ============================================================================
// Password Reset Email Template
// ============================================================================

export function resetEmail(resetUrl: string): {
  subject: string;
  html: string;
} {
  return {
    subject: "Reset your Sovereign Academy password",
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset Password →</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  };
}

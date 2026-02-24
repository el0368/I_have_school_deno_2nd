// ============================================================================
// Subscription Invoice Email Template
// ============================================================================

export function invoiceEmail(opts: {
  displayName: string;
  planName: string;
  amount: number; // USD cents
  periodEnd: Date;
}): { subject: string; html: string } {
  const dollars = (opts.amount / 100).toFixed(2);
  return {
    subject: `Your Sovereign Academy receipt — $${dollars}`,
    html: `
      <h1>Thanks, ${opts.displayName}!</h1>
      <p>Your <strong>${opts.planName}</strong> subscription has been renewed.</p>
      <p>Amount charged: <strong>$${dollars}</strong></p>
      <p>Next billing date: <strong>${opts.periodEnd.toLocaleDateString()}</strong></p>
      <p><a href="$APP_URL/settings/billing">Manage subscription →</a></p>
    `,
  };
}

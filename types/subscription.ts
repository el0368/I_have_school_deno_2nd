// ============================================================================
// Subscription & Billing Types
// ============================================================================

export type PlanId = "free" | "pro" | "phd";

export type BillingStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "unpaid";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number; // USD cents
  features: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  status: BillingStatus;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

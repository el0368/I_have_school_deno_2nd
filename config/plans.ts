// ============================================================================
// Subscription Plans Definition
// ============================================================================

import type { Plan } from "../types/subscription.ts";

export const PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    features: [
      "Access to Grade 1–8 content",
      "Basic math input (MathLive)",
      "Practice quizzes",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 999, // $9.99
    features: [
      "Everything in Free",
      "Grade 9–12 & AP courses",
      "Step-by-step solutions",
      "Progress tracking",
    ],
  },
  phd: {
    id: "phd",
    name: "PhD",
    priceMonthly: 2999, // $29.99
    features: [
      "Everything in Pro",
      "University & PhD level content",
      "Full CAS access (SymPy via Rust engine)",
      "Symbolic integration, ODEs, Linear Algebra",
      "Priority support",
    ],
  },
};

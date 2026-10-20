/** Subscription policy: never infer an entitlement from a browser flag or URL. */
export type BillingPlan = "free" | "junior"
export type BillingStatus = "none" | "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused"

export type BillingAccount = {
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: BillingPlan
  status: BillingStatus
  current_period_end: string | null
}

export function hasPremiumAccess(record: Pick<BillingAccount, "plan" | "status" | "current_period_end"> | null): boolean {
  if (record?.plan !== "junior" || (record.status !== "active" && record.status !== "trialing")) return false
  // Fail closed if a known entitlement period has expired and webhooks were missed.
  if (record.current_period_end && Date.parse(record.current_period_end) < Date.now()) return false
  return true
}

export function normalizeSubscriptionStatus(value: unknown): BillingStatus {
  const valid: BillingStatus[] = ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"]
  return typeof value === "string" && valid.includes(value as BillingStatus) ? value as BillingStatus : "none"
}

export function normalizePaidPlan(value: unknown): BillingPlan {
  return value === "junior" ? "junior" : "free"
}

export function unixPeriodEnd(seconds: unknown): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) return null
  return new Date(seconds * 1000).toISOString()
}

export function isSafeUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

/**
 * Billing server adapter. Import only from Next.js server routes.
 * Stripe is called over its documented REST API to avoid new runtime dependencies.
 * Browser-visible Supabase keys NEVER authorize paid features.
 */
import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest } from "next/server"
import { hasPremiumAccess, isSafeUuid, normalizePaidPlan, normalizeSubscriptionStatus, unixPeriodEnd } from "./billing-policy"
import type { BillingAccount } from "./billing-policy"

const NO_STORE = { "Cache-Control": "private, no-store, max-age=0" }
export const billingHeaders = NO_STORE

function config() {
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!supabase || !anonKey || !adminKey || !stripeKey) throw new Error("Billing is not configured.")
  return { supabase, anonKey, adminKey, stripeKey }
}

export function isBillingEnabled() {
  try { config(); return Boolean(process.env.OPENLAB_ENABLE_PAID_CHECKOUT === "true" && process.env.STRIPE_JUNIOR_PRICE_ID && process.env.STRIPE_WEBHOOK_SECRET && process.env.OPENLAB_SITE_URL && process.env.OPENLAB_LEGAL_ENTITY && process.env.OPENLAB_SUPPORT_EMAIL) }
  catch { return false }
}

export function siteUrl() {
  const raw = process.env.OPENLAB_SITE_URL
  if (!raw) throw new Error("OPENLAB_SITE_URL is missing.")
  const url = new URL(raw)
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("OPENLAB_SITE_URL must use HTTPS in production.")
  }
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) throw new Error("OPENLAB_SITE_URL must be an origin.")
  return url.origin
}

export async function getAuthorizedUser(request: NextRequest): Promise<{ id: string; email: string | null }> {
  const header = request.headers.get("authorization") || ""
  if (!/^Bearer [A-Za-z0-9._~-]+$/.test(header)) throw new Error("SIGN_IN_REQUIRED")
  const token = header.slice(7)
  const { supabase, anonKey } = config()
  const response = await fetch(`${supabase}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error("SIGN_IN_REQUIRED")
  const user = await response.json() as { id?: unknown; email?: unknown }
  if (!isSafeUuid(user.id)) throw new Error("SIGN_IN_REQUIRED")
  return { id: user.id, email: typeof user.email === "string" ? user.email : null }
}

async function dbRequest(path: string, init: RequestInit = {}): Promise<unknown> {
  const { supabase, adminKey } = config()
  const res = await fetch(`${supabase}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: adminKey,
      Authorization: `Bearer ${adminKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Billing storage error (${res.status}). Apply the billing migration.`)
  if (res.status === 204) return null
  return res.json().catch(() => null)
}

export async function getBillingAccount(userId: string): Promise<BillingAccount | null> {
  if (!isSafeUuid(userId)) throw new Error("Invalid user identifier.")
  const rows = await dbRequest(`billing_accounts?user_id=eq.${userId}&select=*&limit=1`) as BillingAccount[]
  return rows?.[0] || null
}

export async function accountByCustomer(customerId: string): Promise<BillingAccount | null> {
  if (!/^cus_[A-Za-z0-9]+$/.test(customerId)) return null
  const rows = await dbRequest(`billing_accounts?stripe_customer_id=eq.${encodeURIComponent(customerId)}&select=*&limit=1`) as BillingAccount[]
  return rows?.[0] || null
}

export async function saveBillingAccount(record: Partial<BillingAccount> & { user_id: string }) {
  const previous = await getBillingAccount(record.user_id)
  const merged = {
    user_id: record.user_id,
    stripe_customer_id: record.stripe_customer_id === undefined ? previous?.stripe_customer_id || null : record.stripe_customer_id,
    stripe_subscription_id: record.stripe_subscription_id === undefined ? previous?.stripe_subscription_id || null : record.stripe_subscription_id,
    plan: record.plan === undefined ? previous?.plan || "free" : record.plan,
    status: record.status === undefined ? previous?.status || "none" : record.status,
    current_period_end: record.current_period_end === undefined ? previous?.current_period_end || null : record.current_period_end,
  }
  await dbRequest("billing_accounts?on_conflict=user_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(merged),
  })
}

export async function eventAlreadyProcessed(eventId: string): Promise<boolean> {
  if (!/^evt_[A-Za-z0-9]+$/.test(eventId)) throw new Error("Invalid Stripe event ID.")
  const rows = await dbRequest(`billing_events?event_id=eq.${eventId}&select=event_id&limit=1`) as unknown[]
  return rows.length > 0
}

export async function markEventProcessed(eventId: string) {
  await dbRequest("billing_events?on_conflict=event_id", {
    method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ event_id: eventId }),
  })
}

export async function stripeRequest(path: string, form?: URLSearchParams, idempotencyKey?: string): Promise<Record<string, unknown>> {
  const { stripeKey } = config()
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: form ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    ...(form ? { body: form.toString() } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  })
  const payload = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(`Payment provider request failed (${response.status}).`)
  return payload
}

export function verifyStripeWebhook(raw: string, signature: string | null, secret: string, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  if (!secret || !signature || Buffer.byteLength(raw, "utf8") > 262144) return false
  const parts = signature.split(",").map(part => part.trim().split("=", 2))
  const timestamp = parts.find(part => part[0] === "t")?.[1]
  const signatures = parts.filter(part => part[0] === "v1").map(part => part[1])
  if (!timestamp || !/^\d{10,}$/.test(timestamp) || Math.abs(nowSeconds - Number(timestamp)) > 300) return false
  const expected = createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex")
  return signatures.some(candidate => {
    if (!/^[0-9a-f]{64}$/i.test(candidate)) return false
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(candidate, "hex"))
  })
}

export function subscriptionFields(subscription: Record<string, unknown>): Pick<BillingAccount, "plan" | "status" | "stripe_subscription_id" | "current_period_end"> {
  const metadata = (subscription.metadata || {}) as Record<string, unknown>
  const status = normalizeSubscriptionStatus(subscription.status)
  return {
    plan: normalizePaidPlan(metadata.openlab_plan),
    status,
    stripe_subscription_id: typeof subscription.id === "string" ? subscription.id : null,
    current_period_end: unixPeriodEnd(subscription.current_period_end),
  }
}

export async function updateFromSubscription(subscription: Record<string, unknown>) {
  const customer = typeof subscription.customer === "string" ? subscription.customer : null
  const metadata = (subscription.metadata || {}) as Record<string, unknown>
  const fromMeta = metadata.openlab_user_id
  const existing = customer ? await accountByCustomer(customer) : null
  const userId = isSafeUuid(fromMeta) ? fromMeta : existing?.user_id
  if (!userId) throw new Error("Unknown subscription customer: reconciliation required.")
  // Avoid allowing one user's Stripe subscription to overwrite another user's account.
  if (existing && existing.user_id !== userId) throw new Error("Subscription ownership mismatch.")
  await saveBillingAccount({
    user_id: userId,
    stripe_customer_id: customer,
    ...subscriptionFields(subscription),
  })
}

export { hasPremiumAccess }

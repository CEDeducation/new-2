import { NextRequest, NextResponse } from "next/server"
import { eventAlreadyProcessed, markEventProcessed, stripeRequest, updateFromSubscription, verifyStripeWebhook } from "@/lib/server-billing"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** A forged or stale payment callback MUST never grant access. */
export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") || 0) > 262144) return NextResponse.json({ error: "Payload too large." }, { status: 413 })
  const raw = await request.text()
  if (!verifyStripeWebhook(raw, request.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET || "")) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }
  try {
    const event = JSON.parse(raw) as { id?: unknown; type?: unknown; data?: { object?: Record<string, unknown> } }
    if (typeof event.id !== "string" || !/^evt_[A-Za-z0-9]+$/.test(event.id)) return NextResponse.json({ error: "Invalid event." }, { status: 400 })
    if (await eventAlreadyProcessed(event.id)) return NextResponse.json({ received: true, duplicate: true })
    const object = event.data?.object || {}
    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(String(event.type))) {
      // Fetch the latest provider state: Stripe can deliver older events after newer ones.
      const id = typeof object.id === "string" ? object.id : ""
      if (!/^sub_[A-Za-z0-9]+$/.test(id)) throw new Error("Invalid subscription reference.")
      const latest = await stripeRequest(`subscriptions/${encodeURIComponent(id)}`).catch(error => {
        if (event.type === "customer.subscription.deleted") return object
        throw error
      })
      await updateFromSubscription(latest)
    } else if (event.type === "checkout.session.completed") {
      const id = typeof object.subscription === "string" ? object.subscription : ""
      if (id.startsWith("sub_")) await updateFromSubscription(await stripeRequest(`subscriptions/${encodeURIComponent(id)}`))
    }
    await markEventProcessed(event.id)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Billing webhook reconciliation failed:", error instanceof Error ? error.message : "unknown error")
    // Non-2xx makes Stripe retry instead of silently losing a paid entitlement.
    return NextResponse.json({ error: "Please retry webhook." }, { status: 503 })
  }
}

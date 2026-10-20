import { NextRequest, NextResponse } from "next/server"
import { billingHeaders, getAuthorizedUser, getBillingAccount, hasPremiumAccess, isBillingEnabled, saveBillingAccount, siteUrl, stripeRequest } from "@/lib/server-billing"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  if (!isBillingEnabled()) return NextResponse.json({ error: "Paid checkout is not enabled." }, { status: 503, headers: billingHeaders })
  if (Number(request.headers.get("content-length") || 0) > 4096) return NextResponse.json({ error: "Request too large." }, { status: 413 })
  try {
    const user = await getAuthorizedUser(request)
    const body = await request.json().catch(() => null) as { plan?: unknown; payerAdult?: unknown } | null
    if (body?.payerAdult !== true) return NextResponse.json({ error: "An adult authorized payer must confirm the purchase." }, { status: 400 })
    if (body?.plan !== "junior") return NextResponse.json({ error: "Unsupported plan." }, { status: 400 })
    const existing = await getBillingAccount(user.id)
    if (hasPremiumAccess(existing)) return NextResponse.json({ error: "Your plan is already active. Use the billing portal." }, { status: 409 })
    if (!user.email) return NextResponse.json({ error: "A verified account email is required." }, { status: 400 })
    let customerId = existing?.stripe_customer_id
    if (!customerId) {
      const customerForm = new URLSearchParams({ email: user.email, "metadata[openlab_user_id]": user.id })
      const customer = await stripeRequest("customers", customerForm, `openlab-customer-${user.id}`)
      if (typeof customer.id !== "string") throw new Error("Payment provider returned an invalid customer.")
      customerId = customer.id
      await saveBillingAccount({ user_id: user.id, stripe_customer_id: customerId })
    }
    const form = new URLSearchParams({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      "line_items[0][price]": process.env.STRIPE_JUNIOR_PRICE_ID!,
      "line_items[0][quantity]": "1",
      success_url: `${siteUrl()}/billing?checkout=success`,
      cancel_url: `${siteUrl()}/billing?checkout=cancelled`,
      "metadata[openlab_user_id]": user.id,
      "metadata[openlab_plan]": "junior",
      "subscription_data[metadata][openlab_user_id]": user.id,
      "subscription_data[metadata][openlab_plan]": "junior",
      billing_address_collection: "required",
    })
    const session = await stripeRequest("checkout/sessions", form)
    if (typeof session.url !== "string" || !session.url.startsWith("https://checkout.stripe.com/")) throw new Error("Invalid checkout URL.")
    return NextResponse.json({ url: session.url }, { headers: billingHeaders })
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === "SIGN_IN_REQUIRED"
    return NextResponse.json({ error: unauthorized ? "Please sign in." : "Checkout could not be started. Please try again." }, { status: unauthorized ? 401 : 503, headers: billingHeaders })
  }
}

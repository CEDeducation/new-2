import { NextRequest, NextResponse } from "next/server"
import { billingHeaders, getAuthorizedUser, getBillingAccount, isBillingEnabled, siteUrl, stripeRequest } from "@/lib/server-billing"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  if (!isBillingEnabled()) return NextResponse.json({ error: "Billing is not configured." }, { status: 503 })
  try {
    const user = await getAuthorizedUser(request)
    const account = await getBillingAccount(user.id)
    if (!account?.stripe_customer_id) return NextResponse.json({ error: "No billing customer exists for this account." }, { status: 404 })
    const form = new URLSearchParams({ customer: account.stripe_customer_id, return_url: `${siteUrl()}/billing` })
    const session = await stripeRequest("billing_portal/sessions", form)
    if (typeof session.url !== "string" || !session.url.startsWith("https://billing.stripe.com/")) throw new Error("Invalid portal URL.")
    return NextResponse.json({ url: session.url }, { headers: billingHeaders })
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === "SIGN_IN_REQUIRED"
    return NextResponse.json({ error: unauthorized ? "Please sign in." : "Billing portal is temporarily unavailable." }, { status: unauthorized ? 401 : 503, headers: billingHeaders })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { billingHeaders, getAuthorizedUser, getBillingAccount, hasPremiumAccess, isBillingEnabled } from "@/lib/server-billing"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  if (!isBillingEnabled()) return NextResponse.json({ available: false, active: false, plan: "free", status: "unconfigured" }, { headers: billingHeaders })
  try {
    const user = await getAuthorizedUser(request)
    const account = await getBillingAccount(user.id)
    return NextResponse.json({ available: true, active: hasPremiumAccess(account), plan: account?.plan || "free", status: account?.status || "none", periodEnd: account?.current_period_end || null }, { headers: billingHeaders })
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === "SIGN_IN_REQUIRED"
    return NextResponse.json({ error: unauthorized ? "Sign in to view billing." : "Billing status is temporarily unavailable." }, { status: unauthorized ? 401 : 503, headers: billingHeaders })
  }
}

import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export function GET() {
  const cloudConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const billingConfigured = Boolean(process.env.OPENLAB_ENABLE_PAID_CHECKOUT === "true" && cloudConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.STRIPE_SECRET_KEY && process.env.STRIPE_JUNIOR_PRICE_ID && process.env.STRIPE_WEBHOOK_SECRET && process.env.OPENLAB_SITE_URL && process.env.OPENLAB_LEGAL_ENTITY && process.env.OPENLAB_SUPPORT_EMAIL)
  return NextResponse.json({ service: "openlab", status: "ok", cloudConfigured, billingConfigured, note: "Process health only; scientific and payment test readiness is a separate release gate." }, { headers: { "Cache-Control": "no-store" } })
}

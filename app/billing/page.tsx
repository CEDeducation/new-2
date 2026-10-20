"use client"

import Link from "next/link"
import "./billing.css"
import { useEffect, useState } from "react"
import { getCurrentCloudAccessToken } from "@/lib/cloud"

type Status = { available: boolean; active: boolean; plan: string; status: string; periodEnd?: string | null }

export default function BillingPage() {
  const [status, setStatus] = useState<Status | null>(null)
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [adultPayer, setAdultPayer] = useState(false)
  const [fields, setFields] = useState({ title: "", question: "", method: "", observations: "", conclusion: "" })

  async function auth() {
    const token = await getCurrentCloudAccessToken()
    if (!token) throw new Error("Sign in to OpenLab with a cloud account to manage a subscription. Browser-only demo accounts cannot buy plans.")
    return { Authorization: `Bearer ${token}` }
  }
  async function refresh() {
    try {
      const response = await fetch("/api/billing/status", { headers: await auth(), cache: "no-store" })
      const body = await response.json() as Status & { error?: string }
      if (!response.ok) throw new Error(body.error || "Billing unavailable")
      setStatus(body)
    } catch (error) { setMessage(error instanceof Error ? error.message : "Billing is unavailable") }
  }
  useEffect(() => { void refresh() }, [])

  async function redirectToBilling(path: "checkout" | "portal") {
    setBusy(true); setMessage("")
    try {
      const response = await fetch(`/api/billing/${path}`, {
        method: "POST", headers: { ...await auth(), "Content-Type": "application/json" },
        body: JSON.stringify(path === "checkout" ? { plan: "junior", payerAdult: adultPayer } : {}),
      })
      const result = await response.json() as { error?: string; url?: string }
      if (!response.ok || !result.url) throw new Error(result.error || "Could not open secure checkout")
      window.location.assign(result.url)
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to continue"); setBusy(false) }
  }

  async function exportReport() {
    setBusy(true); setMessage("")
    try {
      const response = await fetch("/api/premium/lab-report", { method: "POST", headers: { ...await auth(), "Content-Type": "application/json" }, body: JSON.stringify(fields) })
      if (!response.ok) {
        const body = await response.json() as { error?: string }
        throw new Error(body.error || "Export unavailable")
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url; link.download = "OpenLab-Science-Report.html"; link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage("Your report was generated. Open it in your browser and choose Print → Save as PDF if needed.")
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to export report") }
    finally { setBusy(false) }
  }

  const fieldDescriptions: { key: keyof typeof fields; title: string; rows: number }[] = [
    { key: "title", title: "Experiment title", rows: 1 },
    { key: "question", title: "Research question", rows: 2 },
    { key: "method", title: "Method and variables", rows: 3 },
    { key: "observations", title: "Observations and measurements", rows: 4 },
    { key: "conclusion", title: "Conclusion and limitations", rows: 3 },
  ]

  return <div className="billing-page">
    <Link href="/junior" className="billing-back">← Back to Junior Science Studio</Link>
    <div className="billing-hero"><span>OPENLAB · ACCOUNT</span><h1>Plans and lab reports</h1><p>Learn freely. Subscribe only when you need the additional report-building tools. Access is connected to your verified cloud account.</p></div>
    <div className="billing-grid">
      <section className="billing-card"><span className="billing-overline">FREE SCIENCE ACCESS</span><h2>Explorer</h2><p>Browse the current interactive labs, chapter revision summaries and quizzes. Some labs are still in development.</p><ul><li>Research + Junior navigation</li><li>Current interactive educational models</li><li>Theory Atlas and quizzes</li></ul><strong>Free</strong></section>
      <section className="billing-card featured"><span className="billing-overline">OPTIONAL SUPPORTER SUBSCRIPTION</span><h2>Junior Plus</h2><p>Generate printable scientific reports from your own observations. This does not add 50 finished simulations or teacher-validated course material.</p><ul><li>All current Explorer features</li><li>Server-protected report export</li><li>Manage or cancel via secure billing portal</li></ul><strong>Price and currency displayed at Stripe checkout</strong>
        {status?.active ? <button onClick={() => void redirectToBilling("portal")} disabled={busy}>Manage subscription →</button> : <><label className="billing-payer"><input type="checkbox" checked={adultPayer} onChange={e => setAdultPayer(e.target.checked)}/> I am an adult authorized to make this recurring purchase, including on behalf of a student.</label><button onClick={() => void redirectToBilling("checkout")} disabled={busy || !status?.available || !adultPayer}>{busy ? "Please wait…" : "Continue to secure checkout →"}</button></>}
      </section>
    </div>
    {!status?.available && <p className="billing-notice">Payments are not currently enabled on this deployment. No charges can be made until the administrator completes and verifies payment setup.</p>}
    {status && <p className="billing-status" role="status">Plan status: <strong>{status.status}</strong>{status.periodEnd ? ` · Current period ends ${new Date(status.periodEnd).toLocaleDateString()}` : ""}</p>}
    {message && <p role="alert" className="billing-notice">{message}</p>}
    {status?.active && <section className="billing-report"><span className="billing-overline">JUNIOR PLUS TOOL</span><h2>Build your scientific report</h2><p>Enter your own experiment information. Save an accessible HTML file, then print or save it as PDF from your browser.</p><div className="billing-fields">{fieldDescriptions.map(field => <label key={field.key}>{field.title}<textarea rows={field.rows} value={fields[field.key]} maxLength={field.key === "observations" ? 9000 : 4000} onChange={event => setFields(current => ({ ...current, [field.key]: event.target.value }))}/></label>)}</div><button onClick={() => void exportReport()} disabled={busy || !fields.title.trim() || !fields.question.trim() || !fields.observations.trim()}>Generate report →</button></section>}
    <p className="billing-legal">Payment processing is provided by Stripe when enabled. A paid subscription does not mean that every roadmap experiment is finished. <Link href="/legal/privacy">Privacy and data</Link> · <Link href="/legal/terms">Service terms</Link></p>
  </div>
}

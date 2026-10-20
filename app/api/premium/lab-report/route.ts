import { NextRequest, NextResponse } from "next/server"
import { getAuthorizedUser, getBillingAccount, hasPremiumAccess } from "@/lib/server-billing"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c)
}

/** An actual server-gated premium output: printable scientific report for school projects. */
export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") || 0) > 30000) return NextResponse.json({ error: "Report is too large." }, { status: 413 })
  try {
    const user = await getAuthorizedUser(request)
    if (!hasPremiumAccess(await getBillingAccount(user.id))) {
      return NextResponse.json({ error: "An active Junior subscription is required to export a report." }, { status: 403, headers: { "Cache-Control": "no-store" } })
    }
    const input = await request.json().catch(() => null) as Record<string, unknown> | null
    const value = (key: string, limit: number) => typeof input?.[key] === "string" ? (input[key] as string).trim().slice(0, limit) : ""
    const title = value("title", 150)
    const question = value("question", 1200)
    const method = value("method", 4000)
    const observations = value("observations", 9000)
    const conclusion = value("conclusion", 4000)
    if (!title || !question || !observations) return NextResponse.json({ error: "Title, question and observations are required." }, { status: 400 })
    const section = (name: string, text: string) => `<section><h2>${name}</h2><p>${escapeHtml(text || "Not provided").replace(/\r?\n/g, "<br>")}</p></section>`
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | OpenLab Report</title><style>body{font:16px/1.65 system-ui,sans-serif;color:#172637;max-width:810px;margin:40px auto;padding:0 25px}h1{font-size:30px}h2{font-size:19px;border-bottom:1px solid #cbd5e1;padding-bottom:5px}header{border-bottom:3px solid #3568b0;padding-bottom:18px;margin-bottom:30px}small,footer{color:#64748b}section{break-inside:avoid;margin:28px 0}p{white-space:normal;overflow-wrap:anywhere}footer{border-top:1px solid #cbd5e1;margin-top:45px;padding-top:12px;font-size:12px}@media print{body{margin:0;max-width:none}}</style></head><body><header><small>OPENLAB JUNIOR · STUDENT SCIENCE REPORT</small><h1>${escapeHtml(title)}</h1><small>Prepared ${new Date().toISOString().slice(0,10)}</small></header>${section("Research question",question)}${section("Experimental method",method)}${section("Observations",observations)}${section("Conclusion and limitations",conclusion)}<footer>Student-authored observations. Virtual models are educational approximations; confirm results against teacher guidance and real measurements where applicable.</footer></body></html>`
    return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Content-Disposition": "attachment; filename=OpenLab-Science-Report.html", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } })
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === "SIGN_IN_REQUIRED"
    return NextResponse.json({ error: unauthorized ? "Please sign in." : "Report export is currently unavailable." }, { status: unauthorized ? 401 : 503 })
  }
}

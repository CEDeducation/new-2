import Link from "next/link"
export const metadata = { title: "Terms | OpenLab" }
export default function TermsPage() {
  const owner = process.env.OPENLAB_LEGAL_ENTITY || "[Operator identity to be supplied before public launch]"
  const support = process.env.OPENLAB_SUPPORT_EMAIL || "[Support email to be supplied before public launch]"
  return <main style={{maxWidth:800,margin:"3rem auto",padding:"0 22px",lineHeight:1.75}}>
    <Link href="/">← OpenLab</Link><h1>OpenLab service terms — draft pending operator review</h1>
    <p><strong>Service operator:</strong> {owner}<br/><strong>Customer support:</strong> {support}</p>
    <h2>Educational scope</h2><p>OpenLab Research and Junior provide educational software and simplified scientific models. Virtual experiments are not substitutes for accredited laboratory tests, medical advice or actual measurements. Some of the 50-topic curriculum entries remain demonstrations rather than complete experimental simulations.</p>
    <h2>Accounts</h2><p>Users must protect their credentials, keep account information accurate and follow applicable school policies. Parents, guardians or schools must provide any consent legally required for younger students.</p>
    <h2>Subscriptions</h2><p>If Junior Plus is available, the recurring price, currency, taxes, billing period and applicable discounts are displayed in Stripe checkout before payment. Students should not purchase without appropriate adult approval. Active subscriptions can be managed or canceled through the billing portal; canceling generally stops future renewals while preserving access through the paid period, subject to payment-provider terms.</p>
    <h2>Refunds, support and consumer rights</h2><p>Send billing concerns or refund requests to {support}. Applicable non-waivable consumer rights still apply. The operator must finalize specific refund terms and applicable jurisdiction before accepting live payments.</p>
    <h2>Original material and research content</h2><p>OpenLab content and illustrations are educational resources, not official NCERT or PhET materials. Users retain responsibility for the information they upload. Avoid uploading material you are not authorized to use.</p>
    <h2>Availability and limitations</h2><p>Educational features may be updated. Never rely on a virtual experiment alone for safety-critical decisions. Users should export copies of important research because offline data may be lost with their device.</p>
    <p><em>Commercial activation requires legal review, business identification and support arrangements. This draft is not a legal certification.</em></p>
    <p><Link href="/legal/privacy">Privacy information</Link></p>
  </main>
}

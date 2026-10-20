import Link from "next/link"
export const metadata = { title: "Privacy | OpenLab" }
export default function PrivacyPage() {
  const owner = process.env.OPENLAB_LEGAL_ENTITY || "[Operator identity to be supplied before public launch]"
  const contact = process.env.OPENLAB_SUPPORT_EMAIL || "[Support email to be supplied before public launch]"
  return <main style={{maxWidth:800,margin:"3rem auto",padding:"0 22px",lineHeight:1.75}}>
    <Link href="/">← OpenLab</Link><h1>OpenLab privacy information</h1>
    <p><strong>Operator:</strong> {owner}<br/><strong>Privacy contact:</strong> {contact}</p>
    <h2>What data is processed?</h2><p>Cloud login and account email are handled by Supabase Auth when configured. Research notebook and experimental records may be stored in your Supabase workspace and in your browser. Local browser storage and IndexedDB can retain work on the device until you clear it.</p>
    <h2>Payments</h2><p>When subscriptions are enabled, Stripe processes checkout, payment details, billing and subscription management. OpenLab stores the Stripe customer reference and subscription status on its server. Card numbers are not collected through the OpenLab website.</p>
    <h2>Education and minors</h2><p>OpenLab Jr. is designed for educational use. Students should use accounts under the supervision and consent arrangements required by their school, guardian, and local law. Do not enter medical records or sensitive personal information into experimental reports.</p>
    <h2>Data protection and requests</h2><p>The service uses authenticated cloud access and database access controls when correctly deployed. For deletion, access, correction or privacy questions, contact the operator above. Before commercial launch the operator must publish jurisdiction-specific retention, subprocessors, child-consent and data-rights procedures.</p>
    <p><em>This page describes implemented data flows; it is not a claim of regulatory certification.</em></p>
    <p><Link href="/legal/terms">Terms of service</Link></p>
  </main>
}

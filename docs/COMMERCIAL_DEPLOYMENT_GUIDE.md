# OpenLab Research + Junior: paid-release deployment guide

**Release type:** commercial infrastructure candidate. **Not approved to collect money** without the gates below. All 50 labs are accessible in the roadmap, but only 25 currently use a dedicated educational model and the remaining 25 link to related demonstrations. None of the 50 has completed independent end-to-end scientific and classroom certification.

## 1. Run cloud identity and persistence

1. Create your private Supabase project; keep its service role key secret.
2. Apply SQL files in `supabase/migrations/` in order: `0001_init.sql`, `0002_lab_profiles.sql`, `0003_workspace_history.sql`, **`0004_billing.sql`**.
3. Confirm **RLS is enabled** and signed-out users cannot read `workspaces`, profiles, snapshots, `billing_accounts`, or `billing_events`.
4. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project. These are public keys, not the service role key.
5. Configure `SUPABASE_SERVICE_ROLE_KEY` as a **server-only** secret. Never prefix it `NEXT_PUBLIC_`.
6. Keep `NEXT_PUBLIC_ENABLE_LOCAL_DEMO=false` for a paid/public deployment. Set it to `true` **only on a private staging preview** if you need a browser-only local test without Supabase.
7. Configure SMTP, Supabase email confirmation, password recovery and authorized redirect URLs. Account creation must send confirmation messages and recovery should work on your real domain.

## 2. Payment service setup (Stripe example)

This integration uses Stripe Checkout and Billing Portal. **You need an active business account that can legally accept payments in your country.** Prices and taxes are not hardcoded. Supporters get the currently implemented server-verified printable science-report export; the roadmap does not represent a promise that every virtual lab is finished.

1. Create **one recurring-price Junior Plus product** in the Stripe Dashboard in **test mode** first. Copy its `price_...` ID to `STRIPE_JUNIOR_PRICE_ID`.
2. Set `STRIPE_SECRET_KEY` to the matching **test** secret key (server-only).
3. Register webhook endpoint `https://YOUR_DOMAIN/api/billing/webhook` for `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
4. Enable and configure the Stripe customer billing portal (cancellation, invoice access, payment updates). Ensure the portal's settings and refund policy match your published terms.
5. Set `OPENLAB_SITE_URL=https://YOUR_DOMAIN`, `OPENLAB_LEGAL_ENTITY` and `OPENLAB_SUPPORT_EMAIL` to your actual registered business and reachable support address.
6. Keep `OPENLAB_ENABLE_PAID_CHECKOUT=false` through QA. Only the operator may set it `true` after all gates and legal review pass. **Secrets must never be committed to Git.**
7. Test a successful payment, webhook delivery, duplicate webhook, late webhook, expired/trialing/past-due subscription, cancellation, refund, billing portal, and report export for subscribed and unsubscribed accounts. Test in Stripe mode before switching to live keys.
8. For payments and taxes, arrange local professional review (jurisdiction, chargebacks, refunds, invoices, child consent and consumer rights). The provided draft policy pages need a legal review. Never state that this code is a compliance certification.

## 3. Deploy

From your private repo:

```bash
npm install
npm run typecheck
npm run unified:test
npm run build
npm run launch:gate           # expected FAIL until ALL 50 labs certified
```

`npm run launch:gate` failing does **not** mean you cannot deploy a free preview. It means you cannot truthfully market 50 completed PhET-equivalent labs. A full production `npm run build` must pass before even a staging deploy is accepted. Generate and commit `package-lock.json` after installing online, then use `npm ci` in CI for reproducibility.

In Vercel, set the project root to the directory containing `package.json`. The site includes `/` (Research), `/junior` (Junior), `/billing` (account and secure checkout when enabled), `/legal/terms`, `/legal/privacy` and `/api/health` (diagnostic endpoint, not a proof of functionality).

## 4. Commercial and education acceptance

**Payment-security gate:** no checkout until a signed webhook updates the correct account and the customer portal works. The server rejects unauthorized premium reports regardless of JavaScript or localStorage state. Subscription state never comes from client input.

**Quality gate:** every advertised experiment needs a verified browser test of its critical manipulation, correct scientific results, appropriate animations, undo/reset, accessible alternative controls, and a teacher-reviewed explanation. For chemistry, valence/stoichiometry must be checked; for biology, anatomical correctness, physiology assumptions and limitations must be checked. Document exact model ranges, avoiding claims that all reactions can be predicted.

**Child safety and privacy gate:** publish real operator identity, privacy policy, deletion process, guardian/school consent process, clear refunds, and accessible contact. Conduct data backup/recovery, device accessibility, browser compatibility and vulnerability tests before paid launch. Review Indian DPDP/US COPPA implications for intended users. Do not enable ad profiling for minors.

**Operator gate:** have support staffing, error monitoring and incident response. Roll back release on critical breakage. Record teacher approval and at least two rounds of student observation-based usability testing.

## 5. Important limitations of this code

- The scientific roadmap is **not** 50 independently verified simulators.
- Paid access is enforced server-side for the report-generation endpoint. Most existing browser-rendered labs and theory data remain freely accessible **by design**. Do not advertise them as secure paid-only content; JavaScript UI locks do not protect data bundled to the browser.
- Supabase access tokens are currently browser-managed; perform a professional security review before institutional use.
- Full Next.js production build, Stripe webhook against real test events, Supabase migration execution, email recovery, and real-browser drag-and-drop could not be tested inside this offline environment.
- Research profiles share a main lab Auth account; a profile PIN is not strong isolation for untrusted users.
- The terms and privacy pages describe basic data flows but require operator-specific legal and policy work.

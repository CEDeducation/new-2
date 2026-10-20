# Turning this science module into a paid educational product

These are necessary integration tasks, **not completed features** in v4.0.

## Secure subscriptions

1. Use the parent OpenLab application's existing verified authentication and database; do **not** trust a front-end boolean, a cookie that is not signed, or `localStorage` as proof of payment.
2. Integrate a suitable payment provider in your **server** with secrets stored in deployment environment variables. Choose the provider based on which jurisdictions, businesses and currencies it can legally support.
3. Create subscription checkout only from authenticated, CSRF-protected or equivalently authorised endpoints. Receive and verify signed payment webhooks; make webhook event processing idempotent.
4. Persist entitlements on the server, keyed to a user/workspace. Check entitlement **server-side** before allowing paid content, export or premium resource access. Consider an explicit free tier with a few sample labs so students can evaluate usability before paying.
5. Implement cancellation, refund policy, receipts/invoices, failed-payment handling, dispute handling and accessible support contact details. Test sandbox payments and a full refund flow.

## Students and privacy

- If users may be under 18, obtain legal advice appropriate to the target country (India's DPDP framework and child-consent rules, and potentially US COPPA and school district requirements). Do not launch unnecessary advertising or behavioural profiling against minors.
- Keep progress data minimised and protected; offer account export, deletion, retention limits, consent/guardian procedures where legally required, and a privacy policy.
- Add classroom/teacher account roles and safeguards for shared computers before storing real student identity or grades in the cloud.

## Content and quality gates

- Science teacher/editor approval of all 68 chapters, original diagrams, 680 assessment questions and each lab's model assumptions.
- Full review of NCERT 2026–27 editions and chapter coverage: five high-level cards per chapter are **revision summaries**, not entire official lessons.
- At least two rounds of usability testing with independent Class 9–12 students (time to first useful interaction, confusion rate, completion rate, error recovery) and observation-based updates.
- Cross-browser/screen reader/keyboard testing, performance and availability monitoring, incident reporting, backups, security tests and staged rollback.
- Website terms, licensing review, refund policy, accessible contact channel, tax compliance, payments and age-appropriate parental controls.

## Revenue positioning

The strongest premium offer is **teacher-reviewed detailed courses, scenario-based labs, classroom dashboards, saved portfolios and more powerful simulations**, not repackaged public NCERT textbook content. Validate teacher/student demand and willingness to pay before setting subscription prices. Revenue is not guaranteed simply by publishing the website.

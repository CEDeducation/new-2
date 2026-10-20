# Release QA — commercial foundation candidate

## Verified in this offline build environment

- Research scientific regression tests: PASS.
- Existing Junior scientific and curriculum checks: PASS.
- New billing entitlement and Stripe HMAC logic: 27 checks PASS.
- Mocked subscription and paid-report handler tests: 9 checks PASS.
- Isolated server and billing page TypeScript checks: PASS using declaration stubs.
- JS/TS source syntax parser: PASS.
- Billing without provider configuration: deliberately disabled; account billing state remains server-derived.
- Draft privacy and service-terms routes included. Commercial operators must edit/review them.

## Not verified / fails release certification

- Real Next.js production build: `next: not found` because npm registry DNS cannot be resolved. This is not proof it would pass on Vercel.
- No live Stripe checkout, signed test webhook, cancellation, portal, refund or tax settings verified.
- Supabase migrations and Row Level Security have not been executed against a real database here.
- No real-browser end-to-end React/Next interactions verified. No touch/tablet/accessibility usability audit.
- 0/50 **independently certified** full-blueprint labs (not the same as 0 available experiments). The app has 25 dedicated educational models and 25 related lab links; none has passed every acceptance item.
- Paid premium content: only the server-side report endpoint is entitlement-protected. Existing labs and theory material are free and client-readable.
- Legal policy, account deletion, payments in target jurisdictions and underage consent need human review.

## Go/no-go

**NO-GO for marketing 50 finished labs or collecting paid student subscriptions today.**
**GO for code review and a private Vercel staging build once npm installation and full build pass.**

The strict `launch:gate` is intentionally red and cannot be overridden by advertising language. A genuinely finished product requires completing the outstanding scientific, browser, legal and operational validations.

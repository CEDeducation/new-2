# OpenLab unified — commercial foundation candidate

**What this ZIP contains:** All previous unified Research and Junior code, 50-topic navigation, the current lab implementations, the improved heart/genetics/bonding components, and a new **server-verified subscription and printable report workflow**.

**What this ZIP does not contain:** 50 PhET-equivalent completed laboratories, an independently verified production build, legally approved policies, a live payment merchant account, or real Stripe/Supabase integration credentials. The code is not certified ready to charge students.

## Deploy an inspection preview

1. Upload the extracted source to a **private** GitHub repository. Preserve `app`, `components`, `lib`, `qa`, `scripts`, `supabase`, and `public`.
2. In Vercel, import the repository. The root must contain `package.json`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for real cloud accounts. For **staging only**, if Supabase has not yet been connected, set `NEXT_PUBLIC_ENABLE_LOCAL_DEMO=true` to enable local single-browser accounts. Do not turn this flag on in a paid deployment.
4. Leave `OPENLAB_ENABLE_PAID_CHECKOUT=false` during preview. Payment is disabled unless the administrator explicitly activates it.
5. Run `npm install`, `npm run typecheck`, `npm run unified:test`, and `npm run build` in a computer with npm access. You must get a successful build before deploying.
6. Visit `/` to see OpenLab Research, `/junior` for the Junior science studio, and `/billing` for the subscription UI. If the Vercel build fails, use the actual build log to fix the specific error; do not publish the deploy.

## Live billing preparation

Follow `docs/COMMERCIAL_DEPLOYMENT_GUIDE.md` exactly. It covers Supabase migration `0004_billing.sql`, Stripe test-mode setup, signed webhooks, payment portal, privacy and minor-consent obligations, and refund/incident handling. Do not enable paid checkout until the end-to-end sandbox tests and legal review pass.

## Checks

- `npm run qa:commercial`: 27 offline security-policy checks
- `npm run qa:commercial-routes`: 9 mocked API checks
- `npm run qa:commercial-types`: isolated server-side TypeScript stub check
- `npm run qa:commercial-ui-types`: isolated new billing page TypeScript stub check
- `npm run unified:test`: all existing Scientific, Research, Junior, and billing regression checks
- `npm run build`: complete Next.js production bundle (**not verified in this environment due unavailable npm dependencies**)
- `npm run commercial:status`: prints exactly how many of the 50 topics are independently certified and which deployment variables are absent
- `npm run launch:gate`: intentionally fails while any full blueprint experiment remains uncertified

**Most labs still need substantial interactive/educational development and classroom validation.** A code test is not proof of PhET/Molecular Workbench parity. The existing Research content is not designed for regulated medical or GxP applications.

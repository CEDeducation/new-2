# Unified OpenLab — Integration QA (2026-10-13)

## What was combined

- Research base: user-supplied OpenLab v2.2 chemistry ZIP; unmodified research workspaces, account, Supabase code, and migrations retained.
- Junior base: existing Junior v4.0 Theory Atlas + 14-science-lab package.
- Unified routes: `/` (Research), `/junior` (Junior); no separate hosting or second account.
- New homepage action + feature banner, prominent sidebar Jr. launcher, Junior-to-Research return link.
- Junior uses its original standalone visual layout (no second Research topbar or sidebar).

## Automated checks PASSED

1. Research scientific regression suite (`npm run scientific:regression`): pUC19 annotations / length / GC / restriction sites, GenBank/translation guards, reference compound mass/formula.
2. Junior model suite (`npm run junior:test`): 41 numerical/scientific-engine tests.
3. Junior theory suite: 68 mapped chapters, 340 concept cards, 680 quiz-choice checks, progress validation.
4. Integration guard (`node scripts/integration-regression.mjs`): route presence, homepage and sidebar open buttons, return-to-Research link, shared authentication, retained research migration directory.
5. Source parser check: 99 `.ts`, `.tsx`, `.js` or `.jsx` files parsed without syntax diagnostics; 253 static imports scanned without missing local paths.
6. CSS parser check: main and junior stylesheets parsed with zero top-level syntax errors.
7. Standalone Theory Atlas JavaScript syntax check (`node --check demo/preview.js`) passed.

## NOT verified

- `npm install` could not complete because the execution environment cannot resolve `registry.npmjs.org` (network DNS unavailable). Therefore **Next.js production build, typechecking against actual installed packages, and Vercel deployment were NOT verified**.
- Real-browser smoke checks on the unified React website and full auth workflow were not performed in this integration environment. Prior isolated Junior preview tests do not substitute for this.
- Live Supabase sign-up, multi-user RLS, cloud sync, passwords, server/API security, payment system, data privacy compliance, student/teacher testing, and scientific expert evaluation remain outstanding.
- The Junior educational models are simplified, and five concept cards per chapter are revision summaries, not exhaustive NCERT chapter coverage.
- No payment processing or subscription gating was introduced in this merge.

## Minimum prelaunch gate

On the extracted **OpenLab-Unified/** project root:

```bash
npm install
npm run typecheck
npm run unified:test
npm run build
npm run dev
```

Browse `/` and `/junior`; test the homepage/side launchers, Research return link, account flows, theory cards and quizzes, a Chemistry bonding lab, circuit lab, and database sync on desktop and tablet. Audit auth for school students and privacy/legal obligations before charging.

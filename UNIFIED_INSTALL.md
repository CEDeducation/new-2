# OpenLab Unified — Research + Junior

This is one Next.js application. The **Research workspace** remains the homepage at `/`, and the **Jr. OpenLab science academy** opens at `/junior`. On the homepage, click **Open OpenLab Jr.** (or the prominent Academy banner). The Junior header has a link **OpenLab Research** to return.

## Deploy using Vercel

1. Extract this ZIP. The folder **OpenLab-Unified/** is the project root; `package.json`, `app/`, and `next.config.mjs` are inside.
2. Upload the extracted folder to a **private GitHub repository** (recommended). Do not commit `.env.local`, passwords, or API keys. Vercel deploys repositories, not unextracted ZIP archives.
3. In Vercel, choose **Add New > Project > Import Git Repository**, select the repository, and set the **root directory** to `OpenLab-Unified` if you uploaded the containing folder. Framework should be detected as Next.js.
4. Set build command to `npm run build` and install command to `npm install` (Vercel defaults should work). Follow the `.env.example` guidance for optional Supabase/cloud setup; secrets belong in Vercel environment settings, not the repository.
5. Deploy; visit `/` for Research and `/junior` for Junior.

## Local verification

```bash
npm install
npm run typecheck
npm run junior:test
npm run build
npm run dev
```

## Account and data limitations

- Both sections are behind the **same existing OpenLab account/profile gate**. Junior notes/progress use browser-local storage; they are not cloud-synced even if Research sync is enabled.
- Without Supabase, authentication is **local-device mode**; it is not a production account system. Read `SECURITY.md` and configure a secure cloud backend before a paid public launch.
- **No Stripe/Razorpay subscription processing or server-side paid entitlement system is added.** Do not collect customer payments based on this archive alone.
- The 68 Chemistry/Biology chapter summaries are concise revision guides and require teacher review for full NCERT coverage and scientific correctness.
- `content/chapters.txt` is the editable curriculum source; run `python content/build-content.py` to regenerate the TypeScript content.
- No original OpenLab Research tools, API routes, database migrations or environment templates were removed. Some Junior simulations are simplified teaching models, not PhET/Molecular Workbench equivalents.

## What's integrated

- Research: dashboard, notebooks, plasmid and sequence tools, chemistry, protocols, registry, projects, workflows, research utilities, existing account system and database bindings.
- Junior: 14 interactive labs, 68 Chemistry/Biology chapters for Classes 9–12, 340 study concepts, 680 chapter questions, notebook and subject navigation.
- One app, one account entry, homepage and sidebar launchers, full-width Junior space, return to Research.

## Changes from the supplied archives

- Base: OpenLab v2.2 (archive internal folder named `OpenLab-v2.1`).
- Junior: OpenLab Jr v4.0; installed `app/junior` and `components/junior` and included editable content and QA scripts.
- Updated `components/AppShell.tsx`, `components/Sidebar.tsx`, `components/Dashboard.tsx`, `components/Topbar.tsx`, `app/globals.css`, and `package.json` to unify navigation.

## Testing

See `INTEGRATION_QA.md` for verified checks and anything unavailable in the build environment. A successful local compilation does not substitute for browser/teacher/security reviews.

# OpenLab Unified — V8 Science Workbench Upgrade

**This is not the 50-lab commercial final release.** It is an improved unified Research + Junior application with new science engines. Deploy to a *staging Vercel project*, not your existing paid production environment.

## What changed in this package

1. **Molecule builder:** Atom-palette elements can now be dragged directly onto its SVG stage; dropping near an atom automatically attempts a single bond, checks introductory neutral valence constraints, and gives a reason when bonding is rejected. Existing click-to-place, move, bond order, challenges and 3D shape view are retained.
2. **Heart and circulation (#35):** Four chamber diagram; inspectable anatomy and valves; moving blood-flow markers; schematic ECG; live cardiac phases and valve states; controls for heart rate, end-diastolic volume, ejection fraction and regurgitant fraction; forward cardiac-output calculations and CSV measurement export. Educational simplification, not a diagnostic or full hemodynamic CFD simulator.
3. **Gene expression (#44, #45):** Strand orientation, transcription, intron splicing by drag/click, mature mRNA, nucleotide substitutions, codon translation, ribosome stepping, mutation classification and notes export. Limited illustrative gene, not a general genomic workflow.
4. **Regression coverage:** 220 new focused assertions for these three engines; isolated TS checking, legacy scientific checks and Research navigation tests.
5. **50-topic navigation:** 25 dedicated educational models and 25 related-lab links. Related links are **not** counted as full topic implementations or certified simulations.

## Install

1. Extract this ZIP into a **new private GitHub repository** or staging branch. The ZIP contents have `package.json` at the root.
2. In a network-connected development environment run `npm install`, then `npm run typecheck`, `npm run unified:test`, and `npm run build`.
3. Import that repository into Vercel as a Next.js project; configure environment variables following `.env.example` and the existing Supabase setup documents.
4. Check Vercel build logs and open `/junior` on the staging URL; use the '50-topic blueprint' navigation for heart (#35) and Gene Expression (#44/#45). The molecule builder appears as Chemistry > Molecule Builder 3D.
5. Test with a real browser on a desktop and tablet. Verify drag from the palette to the canvas, chamber inspection, intron splicing, changing variables and CSV export. Run account, notebook and Research regression tests. Do not enable paid subscriptions before security review and student testing.

## Automated checks available here

- `npm run unified:test` — passes.
- `npm run qa:flagship` — passes 220 added science-model assertions and isolated new-component TypeScript checks.
- `npm run qa:syntax` — parses source successfully; not a type/build check.
- `npm run build` — not completed in this environment: `next: not found`. Dependencies were not installed because npm registry DNS/network access failed.
- `npm run launch:gate` — intentionally fails: the entire 50-topic commercial acceptance matrix is not certified.

**Browser testing**: This workspace did not provide a usable React 18 browser build. A standalone QA harness was attempted but did not faithfully run the React 18 application, so no live-browser pass is claimed.

## Release blockers

- 25 of 50 topics still route to related activities, not dedicated specification-complete labs.
- None of the 50 have completed independent teacher/scientist review and end-to-end student usability certification.
- Many theory cards are short summaries, not 200–300-word reviewed lessons.
- High fidelity anatomical 3D assets, molecular dynamics, classroom multiplayer, role-based teacher administration, subscriptions, and payment processing remain incomplete.
- Full production build, authenticated access, deployment environment, data policy and accessibility have not been verified.

Please do **not** represent this ZIP as a finished commercial product or scientifically validated virtual laboratory suite.

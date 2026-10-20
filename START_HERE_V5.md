# OpenLab Unified — Junior Science Expansion (development candidate)

This package is a **single Next.js source project**, with `package.json` at the ZIP root. It combines the existing OpenLab Research application with a more capable OpenLab Junior module under `/junior`. The homepage already links to Junior; Junior links back to Research.

## What was implemented in this iteration

- **20 navigable Junior lab entries** in Chemistry, Biology and Physics (the original 14 plus six new entries):
  1. Titration: interactive burette dispensing in 0.05/0.5/2 mL increments; strong monoprotic acid–strong base pH computation, a theoretical curve and CSV export. **Not** a general equilibrium solver, buffer chemistry, kinetic simulation or real chemical mixing engine.
  2. Gas laws: ideal gas PV=nRT, nitrogen RMS speed and particle illustration; a labelled example pressure threshold. **Not** a vessel integrity or real-gas model.
  3. Mendelian inheritance: monohybrid and dihybrid Punnett matrices, seven pea traits, three crosses and a seeded 100-offspring sample. **Not** a genome simulation or realistic breeding environment.
  4. Salt analysis: reference flame, hydroxide, acid-carbonate, silver nitrate and barium tests for selected ions, with explanatory outcomes. **Not** a complete wet-chemistry or unknown-mixture solver.
  5. Organic structure workbench: straight C1–C8 chains, supported single/double/triple C–C bonds, terminal alcohol/aldehyde/carboxylic acid structures, live formula and basic naming. **Not** branched/aromatic/nonsimple functional chemistry or general IUPAC.
  6. Photosynthesis: illustrative relative response to light, CO2, water, temperature and wavelength, with a live response graph and CSV export. **Not** experimentally calibrated biology or a crop predictor.
- **Teacher Board tab**: mouse/stylus freehand drawing, chemistry and biology stencils (atom, benzene, water, reaction arrow, plant cell, schematic heart, DNA), annotations, undo/redo and SVG/PNG exports. It is a **drawing workspace only**; there is no separate verified teacher account/role, assignments, classroom database or student dashboard.
- **Atomic Explorer**: proton/element identity, electron/ion controls and new neutron/isotope mass-number controls for the first 20 elements, with a clear simplified-model notice.
- Preserved the source tree's **revised BondingStudio and DigestionStudio**, including drag-to-bond handling, connected anatomy schematic and adjustable digestional variables.
- Preserved Research, existing local account design, notebooks and other workspace source files.
- Preserved Class 9–12 Theory Atlas: 68 mapped Chemistry/Biology chapters, 340 summary concept cards and 680 generated quiz questions. Only **10 curated topic cards** currently have detailed 200–300-word explanations; most cards are still short revisions. Topic diagrams are original schematics; **not copied from NCERT textbooks**. The entire curriculum has **not** been professionally fact-checked.

## How to run locally

1. Extract the ZIP into a new private repository or local folder **as a fresh project**. Do not merge this ZIP over an existing live production repo without a backup and code review.
2. Use Node.js 20 or later, then run `npm install` to retrieve dependencies.
3. Copy `.env.example` to `.env.local` and configure the required research/cloud services as described in README / UNIFIED_INSTALL.md.
4. Run `npm run unified:test` and `npm run typecheck`, then `npm run build`. Run `npm run dev` for browser testing.
5. Verify Research (`/` and tool routes), Junior (`/junior`), Teacher Board, Bonding, Digestion, new labs, data saves, keyboard and mouse interactions.
6. Deploy the repository in Vercel, choose Next.js, and enter required environment variables. Ensure **the project root containing `package.json`** is selected. Vercel deployments need their own successful builds.

## Tested in the supplied environment

- 41 prior science-engine tests and 32 new engine tests passed.
- 68 mapped chapters, 340 topic records, and 680 theory question-answer checks passed.
- Existing Research regression tests and unified-navigation regression tests passed.
- Parsed all 37 Junior TypeScript/TSX source files without syntax diagnostics.
- **Not tested**: full TypeScript typecheck, full Next.js production build, browser interactions of the new components, mobile/tablet controls, production identity/payment/cloud behaviour. The build dependencies were unavailable because DNS requests to registry.npmjs.org returned EAI_AGAIN. Do **not** turn off TypeScript, ESLint, or build errors to bypass these checks.

## Commercial launch gate (not yet met)

- Full passing production build and smoke tests, cross-browser pointer/keyboard usability and accessibility audit.
- Science teacher and subject expert review of the engines, diagrams, all 340 cards and all quiz distractors; comprehensive NCERT topic parity.
- Content editorial work: 200–300 original words per topic, diagram appropriateness, real-life explanations and source/rights audit.
- Account roles, teacher/student authorization, parental/minor privacy and data-retention controls; assignment delivery and school administration.
- Authenticated, conflict-resolved real-time collaboration and durable notebook sync; payment billing and customer support.
- Threat model, security testing, privacy notices, robust backups, abuse controls, account recovery.
- Independently tested student learning outcomes and user experience, not simulated claims of parity with PhET or Molecular Workbench.

Never present illustrative consequence animations as measured chemical hazard severity. No toxic mixing instructions or unrestricted reactant database are in this package.

## Third-party and intellectual-property policy

Design principles may resemble other educational simulators, but code and new schematic art are original. No PhET, Concord or NCERT source code or copyrighted textbook figures have been imported into this project. Credit and license any external assets before commercialization.

# OpenLab Jr v6 engineering and QA report

## Scope

Source base: OpenLab Unified v5 Research + Junior, with a 50-topic catalogue. Junior now exposes 23 new direct-interaction educational models and 27 related existing lab links. OpenLab Research routes, authentication code, databases and existing components remain in the source unchanged except for Junior-related wiring.

### New files
- `components/junior/AdvancedWorkbench.tsx` — 23 dedicated laboratory workbench interfaces and controlled interactions.
- `components/junior/advanced-engines.ts` — pure numerical models and explicit assumptions.
- `components/junior/advanced.css` — consistent responsive experiment UI, device-friendly control layout and reduced-motion support.
- `qa/advanced-engines-tests.cjs` — deterministic scientific sanity/invariant tests.
- `qa/roadmap-coverage-tests.cjs` — mapping and feature-label integrity tests.

### Modified files
- `components/junior/MasterRoadmap.tsx` — exposes dedicated full-width experiment view, distinguishes new models from related workbenches.
- `qa/run-science-tests.sh`, `qa/run-release-checks.sh`, `qa/check-progressive-types.py` — include new engines, UI checks and catalogue QA.

## Science boundaries and examples
- Solution chemistry: ideal complete dissolving and final volumetric concentration; *not* molecular dynamics.
- Equilibrium: 1:1 FeSCN formation at fixed constant with ideal activities.
- Calorimetry: **coffee-cup at constant pressure**, not a bomb calorimeter.
- Permanganate: titration stoichiometry in acidic solution, *not* kinetic or safety predictions.
- pH: example household solution pH; ideal dilution approximation.
- Human organs: schematic flows and selected numerical indicators; *not* medical diagnoses.
- Photosynthesis, genetics and bonding: existing labs retained; they have not been upgraded to requested multiscale physical engines in this iteration.
- High-level ecology: a user-supplied trophic transfer factor is a **scenario**, not a measured environmental law.

## Checks performed

- `bash qa/run-science-tests.sh`: existing regressions and 21 new engine checks passed.
- `python qa/check-progressive-types.py`: isolated TypeScript/JSX and model file check passed with synthetic React declarations.
- `node qa/roadmap-coverage-tests.cjs`: 23 dedicated + 27 related links; no unlinked blueprint topic.
- `bash qa/run-release-checks.sh`: existing and new release checks passed.
- `npm install`: **FAILED** because registry lookup `EAI_AGAIN` / no registry DNS access, so `npm run build` and live browser test could not be executed here. This is a validation gap; do not infer that Vercel will pass.

## Acceptance tests required before a public paid launch
1. Full `npm ci`/`npm install` and `npm run build` in a clean environment.
2. Test every new workbench in actual desktop Chromium, Safari and tablet browsers; specifically drag/drop vs button fallback, graph rendering, route restoration and CSV output.
3. Confirm persistent save isolation and read/write permissions on Research and Junior accounts.
4. Independent science teacher review of each model and each NCERT lesson card; verify curriculum structure against the locally relevant textbook edition.
5. Accessibility: screen-reader labels, keyboard operability, contrast, motion settings.
6. Real-world student tests measuring independent completion, errors, retention and preference vs competing products.
7. Subscription, payments, age/child privacy policy and server-side authorization completed and reviewed.

**Release verdict:** development candidate only, not commercial GA.

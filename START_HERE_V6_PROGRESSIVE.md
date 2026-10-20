# OpenLab Unified v6.1 · Progressive Science Studio

**Research + Junior together, one existing Next.js application.**

This is a **development candidate**, not a completed PhET/Molecular Workbench competitor, commercial launch approval, or a classroom-validated final product. The current release adds depth to selected exercises, and preserves your existing Research workspace and existing Junior labs.

## What's actually new

- A browsable **50-topic blueprint** derived from the exact new user-supplied curriculum document: 25 Chemistry and 25 Biology topics, Class 9–12. Subject/grade filters, text search, and full proposed interactions/outcomes are visible. No topic is falsely labelled as fully playable. See `docs/JUNIOR_50_TOPIC_COVERAGE.md`.
- Four purpose-built labs:
  - **Mixtures and Compounds (Class 9)**: draggable magnet interacting with Fe filings, collector, heat-to-FeS atom-accounting model, macro/micro modes, conserved atom counts.
  - **Aufbau Orbital Filler (Class 11)**: draggable electron-spin arrows, orbital occupancy, Hund/Aufbau/Pauli enforcement and checks for selected elements 1–20.
  - **Galvanic Cell & Nernst (Class 12)**: draggable salt bridge, switchable wire, temperature/concentration parameters, E°/Nernst calculation, measurement capture and CSV export.
  - **Microscope Wet Mount (Class 9)**: drag or click specimen-preparation tools in the correct order, stain, add cover slip, transfer slide, coarse/fine focus and magnification.
- **Four original interactive concept cards** with diagrams, 200–300 words on the front, real-world application on the reverse.
- **Bonding drag-to-connect fix:** dragging one atom to another now preserves a visually meaningful snapped bond position rather than snapping the atom back to its old location.
- Previous OpenLab Research, existing Junior 20 labs, theory, 680 quiz questions, Teacher Drawing Board, and main/OpenLab Jr. navigation remain in the source tree.

## Installation: ZIP into GitHub and Vercel

1. Back up your current GitHub repository, secrets, and any cloud data.
2. Extract this ZIP. **Upload all extracted contents into the repository root**, so that `package.json` and `app/` are at the same root. Avoid nesting the whole project under an extra folder.
3. Confirm in GitHub that `app/junior/page.tsx`, `components/junior/`, and the Research routes are all present.
4. Configure the project’s existing authentication/environment variables based on `.env.example`. Do not commit credentials or `.env.local`.
5. In Vercel, set **Root Directory** to the folder containing `package.json` (normally repository root). Select Next.js framework, install command `npm install`, build command `npm run build`.
6. After a successful deployment, open `/` (Research), select **Open OpenLab Jr.**, then `/junior`. Select `50-topic blueprint`, navigate to topics 1, 15, 24, 26, and open their dedicated labs.
7. Test mouse/pointer drag, keyboard/click alternatives, theory flips, mobile/tablet sizing, save-to-journal, teacher drawing exports, and sign-in permissions in a real browser before enabling public use.

If Vercel displays an error, fix the *first* reported error rather than disabling TypeScript or skipping the build. Do not use `ignoreBuildErrors` to ship a broken product.

## Run checks locally

```bash
npm install
npm run unified:test
bash qa/run-release-checks.sh
npm run typecheck
npm run build
```

**Environment limitation on this delivery:** the dependency registry returned `EAI_AGAIN` in the build environment, so `npm install`, full React/Next.js type checking, and a production Next.js build were not possible here. The new modules were type-checked separately using strict TypeScript stubs and source syntax checks; the full app build must still be verified in Vercel.

## Scientific scope and content

- The Fe/S display is a visual atom-count and magnetism teaching model, not a reactive molecular-dynamics engine.
- Aufbau fills an introductory, guided ground state up to Z=20, not a quantum chemistry solver.
- The microscope shows a stylized onion-epidermis illustration, not an optical reconstruction or microscopy data.
- Nernst calculates an ideal EMF approximation, not a kinetic/real operating-current simulation. The displayed I≈E/R ignores internal losses.
- Legacy chapter summaries and most simulations still require scientific review, expanded content, and richer controls to satisfy the full user blueprint.
- All added scientific illustrations are original SVG. No NCERT pages or copyrighted diagrams are copied into the project.

**No payment collection should be enabled based on this candidate alone.** Production authentication, permissions for teacher/student roles, payments, accessibility, security review and user testing still need verification.

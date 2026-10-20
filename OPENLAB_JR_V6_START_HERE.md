# OpenLab Unified v6 — 50-topic interactive expansion

## Read this before deploying

This ZIP is the **combined OpenLab Research + OpenLab Jr. source project**. It extends the prior v5 project. The source at the root of the archive contains `package.json`, the `app/` route tree and both the Research and Junior components.

**Do not call this a finished PhET/Molecular Workbench replacement, NCERT-certified course, or a ready-to-charge commercial release.** It has not passed a complete Next.js production build or independent teacher/student review. The computer running the code inspection could not fetch npm packages (`EAI_AGAIN registry.npmjs.org`), so full Vercel build and runtime UI regression tests remain unverified.

## Open the new experiments

1. Deploy the combined source (see below).
2. Visit your OpenLab homepage and click **Open OpenLab Jr.**
3. In Junior choose **50-topic blueprint**.
4. Choose Chemistry or Biology, then Class 9–12, and select a topic.
5. For one of the 23 new models, click **Open experimental workbench**. It expands to a full-width lab with input controls, changing models, measurement readouts, experiment log and downloadable **CSV**.
6. Other blueprint topics open the existing **related lab**. A related lab does *not* mean every requested sub-feature has been implemented.

## New educational workbenches

Chemistry: 05 conservation of mass; 09 pH and indicators; 12 solution preparation; 14 orbital shapes; 16 coffee-cup calorimetry; 17 FeSCN equilibrium; 19 permanganate redox titration; 23 flame testing; 25 freezing-point depression.

Biology: 28 specialized cell atlas; 29 skeleton placement; 32 membrane transport and ATP; 35 cardiac circulation; 36 monocot/dicot tissue sections; 37 transpiration; 40 breathing; 41 enzyme kinetics; 42 reflex conduction; 43 nephron filtration; 46 linkage mapping; 47 immune-defense steps; 48 Hardy–Weinberg selection; 50 biomagnification.

Several workbenches support native mouse drag/drop plus equivalent buttons for touch/keyboard input. Others use laboratory-appropriate calibrated sliders and switches. Models include their scientific assumptions and limits; models do not simulate arbitrary molecular reactions.

## Verified here

- 21 new mathematical model tests passed.
- Existing Junior science tests, theory data tests, research regression tests and prior module checks passed.
- Isolated JSX/TypeScript compilation with stub React declarations passed for newly changed components.
- Structural coverage check found 23 new educational models and 27 existing related lab links (50 topic entries total).
- These do not establish real-browser usability, full application compilation, or feature parity.

Run checks in the repository after install:

```bash
npm install
npm run build
bash qa/run-release-checks.sh
```

## Deploy with Vercel

1. **Back up your current repository and database**. Do not delete user data.
2. Extract this ZIP and upload the **contents** to a new private GitHub repository or a fresh branch of your existing one. Do not overwrite your live production branch until staging tests pass.
3. Import the repository at https://vercel.com/new. `package.json` should be at the selected root.
4. Transfer the environment variables of your *existing* deployment into the new Vercel project. `.env.example` is only a reference and contains no live credentials.
5. Run a preview deployment and test routes `/`, `/junior`, existing Research workspaces, login flows, notebooks and all 50 catalogue entries.
6. Only promote preview to production after full build and acceptance checks succeed.

## Not delivered (still open requirements)

- Exact 50-topic blueprint parity: 27 catalogue topics link to existing related labs, not dedicated replicas of every described interaction. The new 23 labs implement bounded educational models, not all promised microphysics or 3D mechanisms.
- NCERT theory: the existing 68 chapters, 340 cards and 680 quiz questions remain. Most cards are **not** independently authored 200–300-word lessons; only some have been expanded.
- Photorealistic / clinically complete human anatomy; 3D multiscale dissection; universally accurate 3D molecular mechanics.
- Collaborative multi-user benches, teacher admin roles and permission rules, payments/subscriptions, teacher-graded assignments, cloud classroom sync and export-to-XLSX/PDF.
- Professional scientific/NCERT reviewer sign-off, student testing, accessibility audit, full Next.js production build, and browser regression suite.

## Security / legal reminders

Do not sell this as a clinically reliable medical system or use it for laboratory hazard prediction. Keep any school account data private, enforce server-side authorization before adding multiplayer, and obtain proper licenses for any third-party scientific figures. Original SVG diagrams are used for the new models; no NCERT textbook artwork or external copyrighted simulator source was copied.

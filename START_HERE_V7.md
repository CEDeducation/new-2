# OpenLab Research + Junior v7 · Lab Experience Rebuild

## What is in this ZIP?

This is **one unified Next.js source project**. OpenLab Research is preserved, and the Junior section remains accessible at `/junior` from the Research home page. **This is a development release, not a verified commercial launch package or feature-complete replacement for PhET or Molecular Workbench.**

### Real functionality added to the Junior code

1. **Class 12 titration bench rebuilt** (`components/junior/TitrationWorkbench.tsx`): actual drag-and-drop apparatus setup for HCl flask, NaOH burette, indicator and pH electrode (with click/keyboard alternatives), pre-flight requirements, concentrations and initial volume, dropwise additions via mouse wheel/button/D shortcut, computed strong-acid/strong-base pH, live theoretical/measurement curves, observation export to CSV, and notebook notes. It rejects setups whose calculated endpoint exceeds trial capacity. The particle inset is conceptual, not molecular dynamics.
2. **Digestive model made more experimental** (`DigestionStudio.tsx` and `digestion-engine.ts`): drag secretions to the appropriate compartment or numbered anatomy hotspot. Stomach pepsin now has a meaningful effect on protein breakdown. Incorrect location gives feedback. The existing mass-conserving model, anatomical diagram, nutrient bars, and configurable pH, bile and pancreatic activity remain. A conceptual micro-view is added. The model is explicitly illustrative, not clinical data.
3. **Atomic Explorer**: adds draggable proton/neutron/electron tools. Protons change element identity, neutrons change isotope mass number, electrons change charge. Introductory shell visualization remains limited to the first 20 elements.
4. **Detailed Theory Atlas**: eight new manually written 200–300-word senior-secondary explanations with practical examples, plus eight dedicated original SVG diagrams. Detailed subjects include the Nernst equation, nephron, alveoli, transcription, independent assortment, enthalpy, equilibrium constant, and activation energy. Existing content is preserved.
5. **Existing functionality kept:** Research tools, previous Junior lab modules, the 50-topic blueprint catalogue, Chapter Atlas, 680 quiz questions, and Teacher Drawing Board.

### Installing from ZIP into GitHub and Vercel

1. Back up your current GitHub repository, existing cloud data, and environment settings. **Do not overwrite your production branch until a staging deployment passes.**
2. Extract this ZIP and place the extracted files in the **repository root**. You should see `package.json`, `app/`, `components/`, `lib/`, `public/`, `scripts/`, and `supabase/` at that level, not inside an extra subfolder.
3. Check `.env.example` and configure the proper environment secrets under **Vercel Project Settings → Environment Variables**. Never commit `.env.local`, service-role keys, or private tokens.
4. Use Node.js 20+ and run `npm install`. Next.js is pinned in `package.json`. For local checks run `npm run unified:test`, `npm run typecheck`, and `npm run build`.
5. Import the repository in Vercel with **Next.js framework**, Root Directory containing `package.json`, build command `npm run build`, install command `npm install`. Keep TypeScript build checks enabled.
6. Only after deployment is Ready, check the Research home page, the **Open OpenLab Jr.** button, `/junior`, the titration bench, digestive lab and Atomic Explorer. Confirm pointer/drag/drop, alternative buttons, CSV download, notes, theory flips, quizzes and teacher drawing export on desktop/tablet browsers.
7. Review login, storage security, RLS, privacy requirements for minors, deployment logs, teacher/student access, subscription/payments, and accessibility **before collecting any payment or letting schools rely on it**.

### How to test the three rebuilt experiences

- **Titration**: open Chemistry → Titration Bench. Drag each instrument from the tray into the dotted bench or click it, set concentrations, dispense drops. Check 0.10 M HCl / 25 mL versus 0.10 M NaOH: equivalence is 25 mL, pH 7.0 exactly at that point under ideal assumptions. Try unrealistic conditions and confirm the pre-flight warning. Export CSV and compare measured points.
- **Digestion**: open Biology → Human Digestion; press **Begin enzyme challenge**; drag the four secretion tools to **Mouth**, **Stomach**, **Duodenum**, or their numbered anatomy hotspots. Try pepsin on the mouth (should be rejected) and on the stomach (accepted). Toggle pepsin availability and compare protein processing while inspecting conservation bars.
- **Atomic Explorer**: open Chemistry → Atomic Explorer, choose an element with atomic number ≤20, drag a neutron to increase mass number or an electron to change charge. Click a particle as a keyboard-accessible alternative.

### Technical verification performed

- Existing Research scientific regressions passed.
- Existing Junior model, navigation, curriculum, and isolated module tests passed.
- Eight expanded 200–300-word cards and accompanying application text passed independent content-length checks.
- The digestive-model checks passed across all food and organ-stage combinations with and without pepsin, including mass conservation.
- Titration endpoint and pH-direction regression tests passed.
- Newly added components passed isolated TypeScript checks with React declarations stubbed; updated TSX files passed a TypeScript parser/transpiler syntax check.

**Not verified:** `npm install`, `npm run typecheck` with the actual React/Next.js types, full `next build`, live authentication, real-browser drag/drop of the complete application, security testing, teacher content review, classroom student testing, production performance, billing, and feature parity with PhET or Molecular Workbench. Dependency registry access was unavailable in this environment.

### Important scientific limitations

- The titration model uses an ideal strong monoprotic acid and strong base at 25 °C. It is not suitable for arbitrary reagent combinations or real hazard prediction.
- The digestive fractions are illustrative mass-conserving quantities, not human clinical digestion percentages or enzyme kinetics.
- The atom builder is a school-level shell/ion model, not a quantum orbital solver for all elements.
- The broad catalogue is **not** 50 fully specified, experimentally validated simulations. Some topics remain links to related labs and many theory cards remain concise summaries. Read `V7_FEATURE_COVERAGE.md` before considering a launch.
- All new diagrams are original schematic SVGs. They are not NCERT copies, clinical anatomy photographs, or licensed textbook artwork.

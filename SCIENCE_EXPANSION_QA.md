# Junior expansion QA record

Automated engine tests: `bash qa/run-science-tests.sh` — **73 checks** (41 previous, 32 added in this iteration). Deterministic engines cover acid-base titration, ideal gas, monohybrid/dihybrid inheritance, salt test lookup, simple organic naming and mass/valence, and a relative photosynthesis model. Run `bash qa/run-release-checks.sh` to include theory checks. Run `node scripts/integration-regression.mjs` and `npm run scientific:regression` to check preserved unified navigation and Research regressions.

A clean `npm install && npm run build` has **not** been demonstrated locally because npm registry was inaccessible. This release cannot be certified for Vercel or for charging customers. Existing app environment variables and remote services are not provided by the source package.

## Scope status against supplied chemistry and biology blueprints

**Implemented, scoped:** periodic table/ion controls + isotopes; supported ionic and covalent bonding; school-level equation balancing; selected salt tests and flame colors; limited organic chain naming; strong acid/base titration and pH plot; ideal gas/PV=nRT; plant cell viewer; DNA/genetic expression activity; membrane transport; digestion anatomical diagram + illustrative kinetics; Mendelian Punnett crosses; simplified ecology; relative photosynthesis chamber; selectable teacher drawing board.

**Not implemented / not parity:** unrestricted 3D molecular dynamics, automatic prediction for arbitrary mixtures, safety accidents + incident reports, live spectrophotometers, real-time multiplayer, advanced chemical equilibrium/thermodynamics/kinetics, complete cation/anion analytical separation, branched organic structures, student-editable codon assembly and peptide folding, realistic medical/surgical simulators, heart+ECG, lung alveoli, nephron filtration, skeleton stress mechanics, plant root/tropism/cycles, evolution, ecological network simulator and full teaching administration. Existing physics studios remain scoped.

## Editorial status

68 chapter map entries exist with 340 short theory cards. Ten of these have carefully written longer explanations in `components/junior/theory-deep-content.ts`. Do not imply that the remaining 330 are 200–300 words each. Chapter/theory visuals are original scalable schematic art; they are *not* NCERT figure reproductions. A licensing and expert review is still required before advertising syllabus-complete content.

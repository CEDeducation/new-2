# Jr. OpenLab v4.0 — verification results

Verified in the available isolated workspace on 2026-10-13.

## Automated checks — passed

- `qa/run-all.sh`: isolated TypeScript compilation of the Junior module using temporary React/Next type shims.
- `qa/run-science-tests.sh`: 41 numerical and conservation-model checks covering chemistry graphs and equations, particle transport, simple genetics, ideal projectile motion, lenses and ideal circuits.
- `qa/theory-tests.cjs`: 68 chapter records, exactly 340 individual science concepts, 680 constructed question/answer pairs; checks correct-answer uniqueness among four alternatives, full-score grading and progress input validation.
- Node syntax verification for standalone `demo/preview.js`.
- CSS syntax parser on studio, theory, and preview stylesheets.

## Headless Chromium interactions — passed

Using the standalone Theory Atlas preview injected into a restricted local browser environment:

- Desktop 1440 × 900, tablet 768 × 1024, mobile 390 × 844.
- Subject switching, Class 11 Biology selection (19 chapter cards), chapter opening, studying and flipping a card.
- Ten-question quiz from start to results, on all three viewport sizes.
- No JavaScript page errors or horizontal scroll overflow in those tested flows.

## Implementation scope

- 14 existing interactive Junior science labs from v3.0; not replaced by PhET or Molecular Workbench software.
- Chemistry and Biology theory organised by grades 9–12, concise 5-card original revision summaries and 10-question short assessments per mapped chapter.
- Reusable React/Next module integrated at `/junior`, and a dependency-free preview for Theory Atlas alone.
- Original topic-themed vector schematic illustrations and animated flip cards. Illustrations are educational schematic drawings, not photographs or experimentally validated anatomical diagrams.

## Not proven / not production certified

- Full parent Next.js application build, login/entitlement server, cloud storage and checkout: not provided in source archive.
- Classroom usability or learning outcomes, comprehensive official textbook subheading coverage, research-grade simulation fidelity, independent teacher sign-off, browser performance across all platforms, safety/security review, or reliable revenue potential.
- Human authorship: the files were developed with AI assistance. The structure is intended to remain editable by a human developer; no claim of exclusive human authorship or AI-undetectability is made.

**Recommendation:** Integrate in a staging branch, run real build and browser tests with the complete application, obtain teacher review of every chapter and questions, then launch a free trial. Charge only after server-side access control, privacy policies, payment processing and support are working.

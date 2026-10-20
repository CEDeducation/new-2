# OpenLab Research + Junior — commercial readiness assessment

## Release decision

**NOT APPROVED for paid student launch.** This is a source-code quality and anatomy improvement of v7, not a final 50-experiment science product. Nothing in a menu or successful unit test proves a student can perform a full experiment.

### Working improvements in this package

- **Skeletal anatomy landmark trainer:** increased from 5 unconditional placements to **15** anatomically categorized landmarks. Incorrect positions are rejected, successful positioning explains the organ/bone's role, and students can use drag/drop or click/keyboard alternatives. Original 2D teaching schematic; **not** a realistic interactive 3D skeleton.
- Preserves Research + Junior integration, existing Chemistry/Biology/Physics workbenches, 50-topic catalogue, Teacher Board, and Theory Atlas.
- `npm run qa:skeleton` validates 15 target positions, invalid drops, region classification, and completion logic.
- `npm run qa:syntax` parses all project TypeScript and JSX source files without requiring installed React/Next dependencies. It is **not a typecheck**.
- `.github/workflows/openlab-build.yml` attempts `npm install`, full `typecheck`, scientific and integration regressions, and `next build` in GitHub Actions. Build must actually pass there and in Vercel.
- `npm run launch:gate` intentionally FAILS until each of the **50 experiments** has dedicated behavior, tested manipulation, meaningful animation, expert-reviewed scientific models, completed browser interactions, and classroom usability evidence. The `qa/launch-matrix.json` starts all checks at false because they have not been independently certified; it is **not** claiming already built features are absent.

## Why it is not possible to certify this as 100% usable

Existing roadmap: 23 dedicated educational models and 27 related links. These numbers describe code organization, **not full blueprint completion**. Independent science validation, scientific animation fidelity, full Class 9–12 lesson coverage, privacy/security for students, authentication entitlements, payments, accessible desktop/tablet interactions, reliable saves, and testing on real deployed browsers remain open.

### Technical limitations encountered here

- Full Next.js production build could not run because `node_modules` is absent and npm registry resolution returns `EAI_AGAIN`.
- No browser instrumentation of the entire integrated app with installed Next/React was possible; new interactions pass isolated tests, not end-to-end browser tests.
- No teacher or independent science expert reviewed the full curriculum.
- Commercial payment enforcement / user permissions cannot be called ready without backend integration and adversarial tests.

### Next commands on a networked CI runner

```bash
npm install
npm run qa:syntax
npm run typecheck
npm run unified:test
npm run build
npm run launch:gate
```

A zero exit code from the first five commands is necessary but not sufficient. The **launch gate should remain red** until actual evidence has been collected for all 50 experimental requirements. Do not set its fields to `true` just to make the gate green.

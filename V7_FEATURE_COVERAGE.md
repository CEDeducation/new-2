# Implementation status · scope and launch gate

The supplied master blueprint specifies **50 experiments** (25 Chemistry and 25 Biology) and additionally requests full teacher administration, payment, high-fidelity molecular/physiological engines, multi-user collaboration, chapter-length content and strong desktop UX.

## Added or enhanced in v7

| Experience | Implemented | Independently checked | Browser verified here |
| --- | --- | --- | --- |
| Titration: apparatus drag/drop, preflight, live pH, curves, CSV | Yes, scoped strong HCl + NaOH | Scientific equation and isolated TS checks | No |
| Digestion: secretion drag/drop on organ zones and SVG anatomy, feedback | Yes, scoped illustrated nutrition model | Conservation and pepsin response | No |
| Atomic Explorer: drag proton, neutron, electron | Yes, first 20 elements for shell view | Syntax/source validation only | No |
| Detailed Theory Atlas: eight new advanced topics, original SVG | Yes, plus existing detailed lessons | 200–300 words and example per new topic; syntax | No |
| Teacher freehand Drawing Board | Existing, kept | Existing source checks | No |
| Research + Junior unified navigation | Existing, kept | Integration regression passes | No |

## Existing catalogue, not fully achieved

- 50 blueprint topics are **listed** with descriptions and links.
- The roadmap reports **23 dedicated educational models** and **27 related links**; this must **not** be interpreted as 50 finished full-depth labs.
- 68 chapters, 340 concept cards and 680 questions exist; only a limited number of cards currently meet the requested 200–300-word detail level. Editorial and educator review is unfinished.
- Several simulations use deterministic classroom equations, illustrative particles or schematic diagrams, rather than a general molecular dynamics / human physiology solver.
- Teacher/student account permissions, classroom assignment and grading infrastructure, multiplayer collaboration, and payment subscription enforcement are not implemented end to end.
- Full Next.js build and QA in real browsers must pass before the software is suitable for a paid launch.

## Mandatory release acceptance

- `npm ci` (or `npm install` when no lock file), `npm run typecheck`, `npm run build` on a clean machine; deploy preview succeeds.
- Student can finish the major labs without needing an explanation from a developer; no dead controls, consistent input mouse+keyboard, undo and reset.
- Teacher and a qualified science reviewer check the correctness of each topic's equations, units, references, diagrams and safety notes.
- Functional coverage of requested simulations mapped one-to-one with the 50 experiments, not merely a related link.
- Accessibility audit, consent/privacy for children and schools, authentication/RLS and session security, paid subscription entitlement enforcement, staging load tests, backups and rollback strategy.
- Real student usability testing compared against PhET and Molecular Workbench. No competitive claim without evidence.

**Release decision: NOT FINAL / NOT READY TO CHARGE USERS.**

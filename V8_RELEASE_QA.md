# OpenLab Unified V8 — Release Evidence & Limitations

## Product coverage

| Check | Result |
|---|---|
| Unified Research + Junior source | Preserved |
| Chemistry + Biology curriculum index | 50 accessible topics (25+25) |
| Dedicated educational workbenches | 25; model depth varies |
| Related lab links only | 25; **not** complete topic implementation |
| Theory catalogue | 68 chapters, 340 concept cards, 680 questions |
| Full 200–300-word reviewed lesson cards | Partial; do not claim completion |
| Teacher freehand board | Retained from prior release; no new role-based admin |
| Atom palette drag to SVG stage with bond attempt | New; engine and isolated TS checks passed |
| Interactive cardiovascular anatomy and volume model | New; engine and isolated TS checks passed |
| Intron splicing and mutation/translation model | New; engine and isolated TS checks passed |
| 220 new assertions, all passing | Verified offline |
| Existing unified scientific regression | Passed |
| Standalone TS component stubs | Passed, **not** actual React type validation |
| Full Next.js production build | Blocked: Next not installed, npm registry DNS failed |
| Live React/Next browser interaction tests | Not verified |
| All 50 blueprint-specific labs completed | **No** |
| Commercial release gate | **Blocked** |

### Scientific limitations in new simulators

**Heart**: A four-chamber flow and valve-timing teaching model. QRS/P/T wave trace is schematic; it does not solve electromechanical coupling or capture real clinical ECG signals. Forward stroke volume = EDV × EF × (1 − regurgitant fraction). Forward output = heart rate × forward stroke volume. Valve states are deterministic approximations for phases of a cardiac cycle.

**Gene Expression**: Uses the standard 64-codon nuclear code and one short illustrative protein-coding sequence with one intron. Splicing is manual at the known intron boundary, not splice-site prediction. RNA substitutions change computed translation and classify simplified mutation outcomes, but not protein folding or transcription regulation.

**Bonding**: Atoms/bond connections are validated against common neutral valences for six elements. Drag-to-bond is chemically constrained and the interaction can reject a saturated atom. This is a Lewis structure teaching model, not a quantum/force-field calculation or general reaction solver.

### Required before students pay

Run the real production build; complete the detailed spec for every topic; obtain subject matter review for all teaching content and quantitative models; perform live drag/click/tablet/keyboard tests; verify multi-user account authorization and durable saves; establish privacy/security/payment policies and incident reporting; run a monitored public beta; and get genuine feedback from students and teachers.

# Jr. OpenLab v4.0 — Interactive Theory Atlas + Science Labs

**Release designation: pre-launch candidate (not a certified or production-hardened commercial release).**

This is a replacement for **only the Junior module** inside your existing Next.js OpenLab project. The uploaded archive did not contain the parent application, authentication, payments, or deployment configuration. It is therefore **not possible** to verify a complete public deployment or implement secure paid subscriptions from this archive alone.

## Contents

- 14 existing interactive Chemistry, Biology, and Physics laboratory activities, preserving the scientific engines from v3.0.
- A new, integrated **Theory Atlas** with **68 chapter-level Chemistry and Biology revision modules** across Classes 9–12, reflecting the 2026 NCERT curriculum structure. The 68 chapters have 5 **original concise core-concept cards each** (340 cards) and 10 generated concept-recall/application questions each (680 questions).
- Topic navigation, class and subject filters, chapter and topic search, book marking, illustrated study-card flipping, quiz results with explanations, and local best-score progress.
- Original vector schematic diagrams for common molecular, atomic, ecological, biochemical, organ and plant subjects. These are **schematic illustrations**, not photographs, clinical images, or exact models of every subtopic.
- Responsive design for desktop/tablet, with additional small-screen fallbacks. This is not a mobile-app download.
- Local-only progress storage, scoped to an existing OpenLab lab-session profile when one exists. **No cloud synchronization or cross-device login has been added in this module.**

## Install into the existing OpenLab Next.js repository

1. Create a **new Git branch** and back up the existing production version.
2. Extract the `app/junior/` and `components/junior/` folders from this archive into the **root of your current OpenLab project**. Only overwrite matching files within these two paths.
3. **Do not delete** your prior authentication service, account settings, database, Research workspace, notebooks, server routes, environment variables or payment configuration.
4. The parent application must already supply `@/components/InterfaceLanguage`, `@/lib/lab-session`, a compatible React/Next.js installation and the alias mapping `@/*`.
5. In your full repository, run `npm install`, `npm run build`, then `npm run dev` (or your project's existing equivalent scripts).
6. Open `/junior`, click **Theory atlas**, select a subject, Class 9–12, a chapter and a topic; test all five flip cards and all ten quiz questions. Repeat with **Science labs**. Check mobile/tablet input, local progress, and user/account isolation.
7. Do not deploy to the live branch until the full build, teacher validation, accessibility, security and payments checks pass.

## Editable content without disturbing code

- `content/chapters.txt` is the **primary human-editable lesson source**. Each chapter uses:
  `grade|subject|chapter title|diagram key|related lab ID (or -)|name~explanation~example^...`
- Exactly five concepts are supplied per chapter to keep the revision experience concise. This **does not cover every NCERT subheading or exercise in detail**.
- Run `python content/build-content.py` to regenerate `components/junior/theory-data.ts` and `content/chapters.json`.
- Run `python content/build-demo.py` to regenerate `demo/chapters-data.js` for the self-contained theory preview.
- To expand a course beyond concise summary cards, extend `TheoryTopic` and `createChapterQuiz()` and add reviewed questions written by a qualified science educator.

## Interactive preview (no Next.js required)

Open `demo/index.html` in a web browser with `preview.css`, `preview.js` and `chapters-data.js` in the same directory. It contains the **68-chapter theory preview only**; the 14 React/Next.js laboratory activities require your OpenLab app. No sign-in or server is needed for the standalone preview. It can also be hosted as a static page to collect early usability feedback.

## Verification performed in this workspace

- 41 existing numerical/science-engine invariant checks passed.
- Isolated TypeScript checks for all replacement Junior React modules passed using local type shims.
- 68 chapters with 340 concept entries and 680 questions validated for structure and a single intended correct answer per question.
- All 14 lab IDs checked; only chapters with relevant available activities receive direct experiment links.
- CSS syntax parsed; theory preview JavaScript syntax verified.
- Static theory preview navigated and quizzed in a sandbox Chromium browser at **1440 px desktop, 768 px tablet, 390 px phone**: no reported JavaScript errors and no horizontal page overflow in those smoke checks.

## NOT verified / outstanding before charging students

- **Entire Next.js production build and deployment** (full parent repo unavailable).
- Real-world experiments against the breadth/depth of PhET and Molecular Workbench; older labs still have the v3 scientifically simplified models. This is not feature parity with these products.
- Independent teacher/editor assessment of every explanation and question; question templates are deliberately simple recall/application checks and are **not a validated NCERT or CBSE question bank**.
- Authentication, paid access, server-side entitlement checks, payment provider integration, invoices, refunds, user support, student account security, data deletion, and safety/legal reviews for minors.
- Real classroom outcomes, production analytics, automated accessibility audit, network/performance tests, multi-browser compatibility, or full mobile touch-device tests.

## Attribution and legal notes

This release **uses independently worded summaries** and original schematic art; no NCERT book scans or third-party simulation assets are bundled. 'NCERT-aligned' identifies the source curriculum context; OpenLab is not affiliated with or approved by NCERT, CBSE, PhET, or Concord Consortium. Chapter labels and sequence may change across editions; verify annually at https://ncert.nic.in/textbook.php and the current CBSE curriculum. Students should use their official books and teacher guidance for complete syllabus study.

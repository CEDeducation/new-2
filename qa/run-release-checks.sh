#!/usr/bin/env bash
# Run the science and theory engine tests from the installed Junior module.
# UI source checking/build verification belongs to the parent Next.js project.
set -euo pipefail
cd "$(dirname "$0")/.."
echo '[1/3] Physics, chemistry and biology model invariants'
bash qa/run-science-tests.sh
echo '[2/3] Curriculum data, quiz choices and grading'
tsc --target ES2021 --module commonjs --skipLibCheck --outDir .qa-js components/junior/theory-data.ts components/junior/theory-engine.ts
node qa/theory-tests.cjs
echo '[3/5] New concept-card depth checks'
node qa/lesson-depth-tests.cjs
echo '[4/5] Isolated new component types'
python qa/check-progressive-types.py
echo '[5/6] Junior navigation integrity'
node qa/progressive-integrity.mjs
echo '[6/7] Blueprint links and honest completion states'
node qa/roadmap-coverage-tests.cjs
echo '[7/7] Standalone preview syntax'
node --check demo/preview.js
printf '\nAll module-level automated checks passed. Run the full Next.js build before release.\n'

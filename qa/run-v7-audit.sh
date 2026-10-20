#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .qa-js
tsc --target ES2021 --module commonjs --skipLibCheck --outDir .qa-js \
    components/junior/digestion-engine.ts components/junior/quantitative-engine.ts
node qa/v7-experiments.cjs
python qa/check-v7-types.py
node scripts/integration-regression.mjs
printf '\nV7 source and scientific regressions passed (not a full Next.js production build).\n'

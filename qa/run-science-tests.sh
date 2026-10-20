#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .qa-js
tsc --target ES2021 --module commonjs --skipLibCheck --outDir .qa-js \
  components/junior/motion-engine.ts \
  components/junior/genetics-engine.ts \
  components/junior/transport-engine.ts \
  components/junior/lens-engine.ts \
  components/junior/build-circuit-engine.ts \
  components/junior/reaction-engine.ts \
  components/junior/bond-engine.ts \
  components/junior/circuit-engine.ts \
  components/junior/quantitative-engine.ts \
  components/junior/inheritance-engine.ts \
  components/junior/qualitative-engine.ts \
  components/junior/organic-engine.ts \
  components/junior/photosynthesis-engine.ts \
  components/junior/mixture-engine.ts \
  components/junior/aufbau-engine.ts \
  components/junior/electrochem-engine.ts \
  components/junior/master-roadmap.ts \
  components/junior/advanced-engines.ts
node qa/science-tests.cjs

node qa/new-labs-tests.cjs
node qa/progressive-labs-tests.cjs

node qa/advanced-engines-tests.cjs

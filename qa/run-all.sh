#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run unified:test
node --check demo/preview.js

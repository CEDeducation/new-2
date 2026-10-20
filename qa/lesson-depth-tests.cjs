'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('components/junior/lab-concept-content.ts','utf8');
const concepts = [...source.matchAll(/(?:mixtures|aufbau|microscope|electrochem):\{name:.*?explanation:`([\s\S]*?)`,application:`([\s\S]*?)`\}/g)];
assert.equal(concepts.length,4,'Four separate new concept cards are required');
for(const m of concepts){const words=m[1].trim().split(/\s+/).length;assert(words>=200&&words<=300,`Concept should be 200–300 words, got ${words}`);assert(m[2].trim().split(/\s+/).length>=60,'Examples need substantial real-world context');console.log('PASS detailed card:',words,'words + application');}
console.log('Four illustration-backed detailed concept cards validated');

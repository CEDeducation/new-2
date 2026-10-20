'use strict';
const fs=require('node:fs');const assert=require('node:assert/strict');
const a=fs.readFileSync('components/junior/AdvancedWorkbench.tsx','utf8');
const r=fs.readFileSync('components/junior/MasterRoadmap.tsx','utf8');
const m=a.match(/NEW_WORKBENCH_TOPICS = \[([^\]]+)\]/);assert.ok(m,'missing dedicated lab list');
const dedicated=m[1].split(',').map(Number);
const labMap=a.split('const labs:Record<number,()=>ReactNode> = {')[1]?.split('};')[0] || '';
const declared=new Set([...labMap.matchAll(/\b(\d+):/g)].map(x=>+x[1]));
for(const id of dedicated){assert.ok(declared.has(id),`topic ${id} has no corresponding lab component`)}
assert.equal(new Set(dedicated).size,dedicated.length,'duplicate dedicated topic');
const related=[...r.matchAll(/\b(\d+):'[-a-z]+'/g)].map(x=>+x[1]);
assert.equal(new Set(related).size,related.length,'duplicate related topic');
const overlap=related.filter(x=>dedicated.includes(x));assert.deepEqual(overlap,[]);
const uncovered=Array.from({length:50},(_,i)=>i+1).filter(x=>!dedicated.includes(x)&&!related.includes(x));
assert.deepEqual(uncovered,[],'every blueprint topic must link to a dedicated or related lab');
console.log(`PASS: ${dedicated.length} dedicated interactive educational models, ${related.length} related lab links, 0 catalogue topics without a link.`);
console.log('NOTICE: related links do not equal full blueprint implementation or verified PhET/Molecular Workbench parity.');

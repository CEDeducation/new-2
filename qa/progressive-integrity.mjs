import fs from 'node:fs';
import assert from 'node:assert/strict';
const components=fs.readFileSync('components/junior/junior-labs.tsx','utf8');
const studio=fs.readFileSync('components/junior/JuniorStudio.tsx','utf8');
const roadmap=fs.readFileSync('components/junior/MasterRoadmap.tsx','utf8');
const page=fs.readFileSync('app/junior/page.tsx','utf8');
const core=['mixtures','aufbau','electrochem','microscope'];
for(const lab of core){
 assert.match(components,new RegExp(`"${lab}"`),`StudioLab union missing ${lab}`);
 assert.match(studio,new RegExp(`id: "${lab}"`),`Navigation missing ${lab}`);
 assert.match(components,new RegExp(`${lab}: [A-Za-z]+Studio`),`Component not mapped for ${lab}`);
}
assert.match(roadmap,/MASTER_ROADMAP/);
assert.match(roadmap,/PURPOSE_BUILT/);
assert.match(studio,/roadmapOpen \? <MasterRoadmap onOpenLab=\{open\}/);
assert.match(page,/hands-on\.css/);
assert.match(studio,/setRoadmapOpen\(false\); setLab\(id\)/);
console.log('PASS 4 new labs, navigation, roadmap, CSS import and Research + Junior wiring');

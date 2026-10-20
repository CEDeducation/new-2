'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {digestFood,FOODS,STAGES,DEFAULT_SETTINGS,checkDigestionBalance}=require('../.qa-js/digestion-engine.js');
const {titrationPh}=require('../.qa-js/quantitative-engine.js');
const txt=fs.readFileSync('components/junior/theory-deep-content.ts','utf8');
const newCards=['12-chemistry-02:Nernst equation','11-biology-16:Nephron','11-biology-14:Alveoli','12-biology-05:Transcription','12-biology-04:Independent assortment','11-chemistry-05:Enthalpy','11-chemistry-06:Equilibrium constant','12-chemistry-03:Activation energy'];
for(const key of newCards){
  const esc=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const r=new RegExp('"'+esc+'": \\{\\s*"explanation": "([^"]+)",\\s*"example": "([^"]+)"');
  const match=txt.match(r);
  assert(match,'Detailed lesson missing '+key);
  const words=match[1].trim().split(/\s+/).length;
  assert(words>=200 && words<=300,`${key} has ${words} words`);
  assert(match[2].trim().split(/\s+/).length>=55,`Missing substantial real-world application: ${key}`);
}
console.log('PASS eight independently written 200–300-word theory cards plus applications');
for(const food of Object.values(FOODS)){
  for(let index=0;index<STAGES.length;index++){
    const standard=digestFood(food,index,DEFAULT_SETTINGS);
    assert(checkDigestionBalance(standard));
    const absent=digestFood(food,index,{...DEFAULT_SETTINGS,pepsinAvailable:false});
    assert(checkDigestionBalance(absent));
    if(index>=2) assert(absent.nutrients.protein.undigested>=standard.nutrients.protein.undigested-1e-9);
  }
}
console.log('PASS 56 digestive checks including optional pepsin and nutrient-mass conservation');
const acidM=.12, acidMl=25, baseM=.10, end=acidM*acidMl/baseM;
assert.equal(end,30);
assert(Math.abs(titrationPh(acidM,acidMl,baseM,end).ph-7)<1e-9);
assert(titrationPh(acidM,acidMl,baseM,end-.1).ph<7);
assert(titrationPh(acidM,acidMl,baseM,end+.1).ph>7);
console.log('PASS titration endpoint and pH direction regression');

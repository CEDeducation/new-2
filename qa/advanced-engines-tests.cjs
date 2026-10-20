'use strict';
// Run against TypeScript compiled to CommonJS by qa/run-science-tests.sh.
const assert=require('node:assert/strict');
const science=require('../.qa-js/advanced-engines.js');
let checks=0;
function check(name,fn){fn();checks++;process.stdout.write(`PASS ${name}\n`)}
const close=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<=eps,`${a} != ${b}`);
check('Conservation of mass: sealed system',()=>{for(const m of [5,30,125,500]){const result=science.conservationOfMass(m,true,true);close(result.massBefore,result.massAfter);assert.equal(result.precipitateVisible,true)}});
check('pH: neutrality and Kw',()=>{const {ph,hydrogen,hydroxide}=science.indicatorModel('water');close(ph,7);close(hydrogen*hydroxide,1e-14,1e-18)});
check('Acid dilution approaches neutral',()=>{const a=science.indicatorModel('lemon',1),b=science.indicatorModel('lemon',100);assert.ok(b.ph>a.ph&&b.ph<7)});
check('Ideal molarity',()=>{close(science.solutionModel(5.844,58.44,100).molarity,1)});
check('Neutralization calorimetry enthalpy and mass',()=>{const m=science.neutralizationCalorimetry(50,50,1);close(m.heatJ,2865);close(m.temperatureRiseC,2865/(100*4.184))});
check('Equilibrium model satisfies mass balance',()=>{for(const f of [.0001,.001,.01])for(const s of [.0001,.001,.01]){const m=science.complexEquilibrium(f,s);close(m.complexM+m.freeFeM,f);close(m.complexM+m.freeScnM,s);assert.ok(m.complexM>=0)}});
check('Freezing point depression',()=>{close(science.freezingPoint(18.016,180.16,1,1).freezingC,-.186)});
check('Cardiac output',()=>{close(science.cardiacOutput(75,80).outputLitresPerMinute,6)});
check('Ventilation correction',()=>{close(science.respiratoryModel(500,12).alveolarVentilationL,4.2)});
check('Nephron ADH increases reabsorption',()=>{const a=science.nephronModel(10,0),b=science.nephronModel(10,1);close(a.gfrMlMin,125);assert.ok(b.urineMlMin<a.urineMlMin)});
check('Hardy-Weinberg proportions sum to one',()=>{for(let i=0;i<=100;i++){const m=science.hardyWeinberg(i/100);close(m.sum,1);close(m.AA+m.Aa+m.aa,1)}});
check('Selection maintains valid allele frequencies',()=>{const h=science.selectedPopulation(.3,.5,100);assert.equal(h.length,101);assert.ok(h.every(p=>p.p>=0&&p.p<=1));assert.ok(h.at(-1).p>h[0].p)});
check('Linkage recombination',()=>{close(science.linkageMap(410,390,96,104).distanceCm,20)});
check('Illustrative trophic progression',()=>{const t=science.trophicIllustration(.002,4);close(t.at(-1).ppm,.512)});
check('Reflex conduction delay',()=>{const m=science.reflexTime(2,50,2);close(m.totalMs,41.5)});
check('Redox equivalence by 2:5 ratio',()=>{const m=science.permanganateEndpoint(.05,20,.02,20);close(m.equivalenceMl,20);close(m.excessMoles,0)});
check('Stomatal flux responds to humidity',()=>{assert.ok(science.stomatalWaterFlux(.7,.3,25).relativeFlux>science.stomatalWaterFlux(.7,.8,25).relativeFlux)});
check('Enzyme activity near optimum exceeds far pH',()=>{assert.ok(science.enzymeRate(3,2,1,7,7,37).relativeRate>science.enzymeRate(3,2,1,2,7,37).relativeRate)});
check('Passive transport conserves particles',()=>{const m=science.diffusionStep(24,6,.8,false,'passive');assert.equal(m.left+m.right,30);assert.ok(m.left<24)});
check('ATP-driven transport uses no phantom particles',()=>{const m=science.diffusionStep(24,0,.8,true,'active');assert.equal(m.left+m.right,24);assert.equal(m.atpUsed,0)});
check('Active transport conserves particles and ATP',()=>{const m=science.diffusionStep(24,6,.8,true,'active');assert.equal(m.left+m.right,30);assert.equal(m.atpUsed,1)});
console.log(`\n${checks} advanced science model tests passed`);

const assert=require('node:assert/strict');
const {titrationPh,titrationCurve,idealGas,downloadCsv}=require('../.qa-js/quantitative-engine');
const {gametes,offspring,punnett,phenotype,seededPopulation}=require('../.qa-js/inheritance-engine');
const {testIon,knownPositive,SAMPLES}=require('../.qa-js/qualitative-engine');
let n=0;function test(name,fn){fn();n++;console.log('PASS',name)};
function near(a,b,eps=1e-6){assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`)};
test('strong-acid titration at 0 mL has pH 1',()=>near(titrationPh(.1,25,.1,0).ph,1));
test('equivalence is neutral pH 7',()=>near(titrationPh(.1,25,.1,25).ph,7));
test('excess strong base yields basic pH',()=>near(titrationPh(.1,25,.1,50).ph,14+Math.log10(2.5/75))); // 2.5 mmol / 75mL = 0.0333M
// Actually ensure acid/base after 50 mL: 5 - 2.5 = 2.5 mmol / 75 mL.
test('pH rises monotonically through titration',()=>{let last=0;for(const p of titrationCurve(.1,25,.1,60)){assert.ok(p.ph+1e-9>=last);last=p.ph}});
test('acid/base input validation',()=>{assert.throws(()=>titrationPh(0,20,.1,20));assert.throws(()=>titrationPh(.1,20,.1,-2));});
test('titration CSV has headers',()=>assert.match(downloadCsv(titrationCurve(.1,25,.1,1)),/volume_mL,pH/));
test('ideal gas PV = nRT units',()=>near(idealGas(10,300,.5,28.014).pressureKPa*10,.5*8.314462618*300));
test('ideal gas Boyle and Charles relations',()=>{const a=idealGas(10,300,.5,28.014);near(idealGas(20,300,.5,28.014).pressureKPa,a.pressureKPa/2);near(idealGas(10,600,.5,28.014).pressureKPa,a.pressureKPa*2)});
test('molecular RMS speed follows sqrt(T)',()=>{const a=idealGas(10,250,.5,28.014);near(idealGas(10,500,.5,28.014).rmsSpeed/a.rmsSpeed,Math.sqrt(2))});
test('one-locus gametes',()=>assert.deepEqual(gametes('Tt'),['T','t']));
test('monohybrid 1:2:1 genotype',()=>assert.deepEqual(punnett('Tt','Tt').frequencies,{TT:1,Tt:2,tt:1}));
test('dihybrid 16 genotype combinations',()=>assert.equal(punnett('TtRr','TtRr').total,16));
test('dihybrid 9:3:3:1 phenotype ratios',()=>{const p=punnett('TtRr','TtRr');const c={};for(const row of p.grid)for(const g of row){const group=`${phenotype(g.slice(0,2),'T','t')}${phenotype(g.slice(2),'R','r')}`;c[group]=(c[group]||0)+1}assert.deepEqual(c,{TR:9,Tr:3,tR:3,tr:1})});
test('seeded population deterministic',()=>assert.deepEqual(seededPopulation('Tt','Tt',100,123),seededPopulation('Tt','Tt',100,123)));
test('invalid gamete genotypes rejected',()=>assert.throws(()=>gametes('Ab')));
test('known ion diagnostic results',()=>{assert.match(testIon('Cu2+','naoh').name,/blue/i);assert.match(testIon('Cl-','silverNitrate').name,/AgCl/);assert.match(testIon('CO3_2-','diluteAcid').description,/CO₂/);});
test('unknown combination returns non-diagnostic',()=>assert.match(testIon('Na+','naoh').name,/No diagnostic/));
test('every sample has at least one reference positive',()=>SAMPLES.forEach(s=>assert.ok(knownPositive(s.ion).length)));
const {carbonChain}=require('../.qa-js/organic-engine');
test('hydrocarbon: methane',()=>assert.deepEqual(carbonChain(1,[]).name,'methane'));
test('hydrocarbon: ethene',()=>assert.equal(carbonChain(2,[2]).formula,'C₂H₄'));
test('hydrocarbon: ethyne',()=>assert.equal(carbonChain(2,[3]).formula,'C₂H₂'));
test('alcohol: ethanol formula',()=>assert.equal(carbonChain(2,[1],'alcohol').formula,'C₂H₆O'));
test('aldehyde: ethanal formula',()=>assert.equal(carbonChain(2,[1],'aldehyde').formula,'C₂H₄O'));
test('acid: ethanoic acid formula',()=>assert.equal(carbonChain(2,[1],'acid').formula,'C₂H₄O₂'));
test('unsupported multiple C=C bonds blocked',()=>assert.throws(()=>carbonChain(3,[2,2])));
test('carbon valence exceeding 4 rejected',()=>assert.throws(()=>carbonChain(3,[3,3])));
const {photosynthesis,photosynthesisCsv}=require('../.qa-js/photosynthesis-engine');
test('no light no photosynthesis',()=>near(photosynthesis({light:0,co2:400,water:90,temperature:25,wavelength:650}).relativeRate,0));
test('no CO2 no photosynthesis',()=>near(photosynthesis({light:90,co2:0,water:90,temperature:25,wavelength:650}).relativeRate,0));
test('no water no photosynthesis',()=>near(photosynthesis({light:90,co2:400,water:0,temperature:25,wavelength:650}).relativeRate,0));
test('adding light increases output at fixed factors',()=>{const common={co2:420,water:90,temperature:28,wavelength:650};assert.ok(photosynthesis({...common,light:80}).relativeRate>photosynthesis({...common,light:20}).relativeRate)});
test('temperature optimum higher than extreme cold',()=>{const common={co2:420,water:90,light:80,wavelength:650};assert.ok(photosynthesis({...common,temperature:28}).relativeRate>photosynthesis({...common,temperature:0}).relativeRate)});
test('photosynthesis bounds and export',()=>{assert.throws(()=>photosynthesis({light:100,co2:420,water:100,temperature:28,wavelength:1000}));assert.match(photosynthesisCsv({light:70,co2:420,water:85,temperature:28,wavelength:650}),/co2_ppm/)})

console.log(`PASS ${n} new lab science checks`);

'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const read=(x)=>require(path.join(__dirname,'../.qa-js/',x));
const mix=read('mixture-engine.js'),orbit=read('aufbau-engine.js'),elec=read('electrochem-engine.js'),road=read('master-roadmap.js');
let checks=0;
function test(label,fn){fn();checks++;console.log('PASS',label);}
test('Exactly 50 original topic specifications',()=>{assert.equal(road.MASTER_ROADMAP.length,50);assert.deepEqual(road.MASTER_ROADMAP.map(t=>t.number),Array.from({length:50},(_,i)=>i+1));});
test('Chemistry 25 / Biology 25',()=>{assert.equal(road.MASTER_ROADMAP.filter(t=>t.subject==='chemistry').length,25);assert.equal(road.MASTER_ROADMAP.filter(t=>t.subject==='biology').length,25);});
test('Every topic has stated learning outcome and interaction',()=>{assert(road.MASTER_ROADMAP.every(t=>t.title.length>8&&t.objective.length>20&&t.experience.length>90));});
test('All grade tiers within 9–12',()=>{assert.deepEqual([...new Set(road.MASTER_ROADMAP.map(t=>t.grade))].sort((a,b)=>a-b),[9,10,11,12]);});
const p=mix.makeMixture();
test('Mixture has equal Fe and S inventory',()=>{assert.equal(mix.inventory(p).ironAtoms,22);assert.equal(mix.inventory(p).sulfurAtoms,22)});
test('Moving magnet affects iron only',()=>{const trial=[{id:1,type:'Fe',x:250,y:250,collected:false},{id:2,type:'S',x:255,y:250,collected:false},{id:3,type:'FeS',x:240,y:245,collected:false}];const n=mix.dragMagnet(trial,300,250);assert(n[0].x>trial[0].x);assert.deepEqual(n[1],trial[1]);assert.deepEqual(n[2],trial[2]);});
test('Magnet collecting does not change atom count',()=>{const trial=[{id:1,type:'Fe',x:640,y:200,collected:false},{id:2,type:'S',x:640,y:210,collected:false}];const after=mix.dragMagnet(trial,725,200,{x:645,y:200});assert.equal(mix.inventory(after).separated,1);assert.equal(mix.inventory(after).ironAtoms,1);});
test('FeS preserves Fe and S atoms exactly',()=>{const end=mix.makeIronSulfide(p),b=mix.inventory(p),a=mix.inventory(end);assert.equal(a.ironAtoms,b.ironAtoms);assert.equal(a.sulfurAtoms,b.sulfurAtoms);assert.equal(a.compound,22);assert.equal(a.freeSulfur,0);});
test('Collected Fe is excluded from reaction',()=>{const start=[{id:1,type:'Fe',x:0,y:0,collected:true},{id:2,type:'Fe',x:0,y:0,collected:false},{id:3,type:'S',x:0,y:0,collected:false}];const out=mix.makeIronSulfide(start);assert.equal(mix.inventory(out).compound,1);assert.equal(mix.inventory(out).separated,1);});
test('Aufbau blank state is empty',()=>assert.equal(orbit.count(orbit.blank()),0));
test('Pauli prohibits same spin in an orbital',()=>{let st=orbit.blank();st=orbit.addSpin(st,0,0,'up').state;assert.match(orbit.addSpin(st,0,0,'up').error,/Pauli/);});
test('Aufbau prohibits filling 2p before 1s/2s',()=>assert.match(orbit.addSpin(orbit.blank(),2,0,'up').error,/Aufbau/));
test('Hund prohibits premature pairing',()=>{let s=orbit.groundState(6);assert.match(orbit.addSpin(s,2,0,'down').error,/Hund/);});
test('Carbon 6 electrons occupy separate p orbitals',()=>{const s=orbit.groundState(6);assert.deepEqual(s[2], [['up'],['up'],[]]);});
test('Neon gives full 2p shell',()=>{const s=orbit.groundState(10);assert.equal(orbit.count(s),10);assert.equal(orbit.electronConfiguration(s),'1s2 2s2 2p6');});
test('Chlorine gives 3p5',()=>{const s=orbit.groundState(17);assert.equal(orbit.electronConfiguration(s),'1s2 2s2 2p6 3s2 3p5');});
test('Calcium fills 4s2',()=>{const s=orbit.groundState(20);assert.equal(orbit.electronConfiguration(s),'1s2 2s2 2p6 3s2 3p6 4s2');});
test('Aufbau remove-last yields one fewer electron',()=>{const s=orbit.groundState(20);assert.equal(orbit.count(orbit.removeLast(s)),19);});
test('Nernst standard Zn/Cu gives 1.10 V',()=>assert(Math.abs(elec.nernst({zinc:1,copper:1})-1.10)<1e-12));
test('Increasing Zn2+ lowers cell EMF',()=>assert(elec.nernst({zinc:2,copper:1})<1.1));
test('Increasing Cu2+ increases cell EMF',()=>assert(elec.nernst({zinc:1,copper:2})>1.1));
test('Gibbs energy is negative for spontaneous cell',()=>assert(elec.cellSummary(.1,1).gibbsKJ<0));
test('Nernst concentration validation',()=>assert.throws(()=>elec.nernst({zinc:0,copper:1})));
test('Nernst temperature dependence for nonunity quotient',()=>assert(elec.nernst({zinc:2,copper:1,temperature:333.15})<elec.nernst({zinc:2,copper:1,temperature:283.15})));

const bond=read('bond-engine.js');
test('Dragged atom connects without jumping to old position',()=>{
 const before={atoms:[{id:1,symbol:'H',x:95,y:160},{id:2,symbol:'H',x:360,y:160}],bonds:[]};
 const r=bond.connectDroppedAtoms(before,1,2,{x:360,y:160});
 assert.equal(r.error,undefined);assert.equal(r.graph.bonds.length,1);
 assert.notEqual(r.graph.atoms[0].x,before.atoms[0].x);
 const d=Math.hypot(r.graph.atoms[0].x-r.graph.atoms[1].x,r.graph.atoms[0].y-r.graph.atoms[1].y);
 assert(d>=75&&d<=95);
});
test('Drag cannot exceed allowed neutral valence',()=>{
 const before={atoms:[{id:1,symbol:'H',x:90,y:150},{id:2,symbol:'H',x:320,y:150},{id:3,symbol:'H',x:550,y:150}],bonds:[{a:1,b:2,order:1}]};
 const r=bond.connectDroppedAtoms(before,3,1,{x:100,y:150});
 assert.match(r.error,/valenc/);
});

console.log(`${checks} progressive lab and bonding regression checks passed`);

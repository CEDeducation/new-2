'use strict';
/** Deliberately strict commercial release gate. An accessible menu route does NOT certify a lab. */
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const labs=JSON.parse(fs.readFileSync(path.join(__dirname,'launch-matrix.json'),'utf8'));
assert.equal(labs.length,50,'All 50 numbered experiments are required');
const required=['dedicatedExperiment','dragDropOrDirectManipulation','responsiveAnimation','scientificModelReview','browserInteractionTest','classroomUsabilityTest'];
const rows=[];
for(let index=0;index<50;index++){
 const lab=labs[index];assert.equal(lab.number,index+1);
 for(const field of required)assert.equal(typeof lab[field],'boolean',`Topic ${lab.number} missing gate ${field}`);
 rows.push({number:lab.number,title:lab.title,pass:required.every(key=>lab[key])});
}
const passed=rows.filter(row=>row.pass).length;
const failed=rows.filter(row=>!row.pass);
console.log(`Science lab release status: ${passed}/50 topics independently certified`);
if(failed.length)console.log(`Uncertified topics: ${failed.map(row=>row.number).join(', ')}`);
if(passed!==50){console.error('RELEASE BLOCKED: All 50 topics must pass every acceptance criterion. No status is inferred from source-file presence.');process.exitCode=1;}

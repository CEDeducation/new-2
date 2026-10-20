'use strict';
const assert=require('node:assert/strict');
const {BONE_LANDMARKS,matchSkeletonDrop,skeletonProgress}=require('../.qa-js/skeleton-engine.js');
assert.equal(BONE_LANDMARKS.length,15,'expected 15 distinct bone zones');
assert.equal(new Set(BONE_LANDMARKS.map(b=>b.id)).size,15,'no duplicate zones');
for(const landmark of BONE_LANDMARKS){
  assert.ok(matchSkeletonDrop(landmark.id,landmark.x,landmark.y).correct,`expected matching drop ${landmark.id}`);
  assert.equal(matchSkeletonDrop(landmark.id,-999,-999).correct,false,`off-stage drop ${landmark.id}`);
  assert.equal(matchSkeletonDrop('not-a-bone',landmark.x,landmark.y).correct,false);
}
assert.equal(skeletonProgress(new Set()).complete,false);
assert.equal(skeletonProgress(new Set(BONE_LANDMARKS.map(b=>b.id))).complete,true);
assert.equal(skeletonProgress(new Set(BONE_LANDMARKS.filter(b=>b.region==='axial').map(b=>b.id))).axial,BONE_LANDMARKS.filter(b=>b.region==='axial').length);
console.log('PASS: 15 anatomical targets, on-target/off-target rejection, regional classification and completion checks.');

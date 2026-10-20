"use strict"
const assert = require("node:assert/strict")
const { chapters } = require("../.qa-js/theory-data.js")
const { createChapterQuiz, gradeAttempt, safeProgress } = require("../.qa-js/theory-engine.js")
const allowedLabs = new Set(["elements","ionic","covalent","reactions","transport","genetics","cells","dna","ecology","digestion","motion","lenses","circuits","optics"])
assert.equal(chapters.length,68)
assert.equal(new Set(chapters.map(c=>c.id)).size,chapters.length)
let n = 0
for (const chapter of chapters) {
 assert.ok(["9","10","11","12"].includes(chapter.grade))
 assert.ok(["biology","chemistry"].includes(chapter.subject))
 assert.ok(!chapter.lab || allowedLabs.has(chapter.lab), `Unsupported lab ${chapter.lab} in ${chapter.id}`)
 assert.equal(chapter.topics.length,5)
 for(const item of chapter.topics) {
  assert.ok(item.title.length >= 2 && item.explanation.length >= 35 && item.example.length >= 10)
 }
 const quiz=createChapterQuiz(chapter)
 assert.equal(quiz.length,10)
 const answers={}
 for(const question of quiz){
   assert.equal(question.choices.length,4)
   assert.equal(new Set(question.choices).size,4,`${chapter.id}: duplicate choice`)
   assert.ok(question.answer>=0&&question.answer<4)
   answers[question.id]=question.answer
   n++
 }
 assert.equal(gradeAttempt(quiz,answers),10)
 assert.equal(gradeAttempt(quiz,{}),0)
}
assert.deepEqual(safeProgress({"10-biology-01":7,"evil":{"x":1},"11-chemistry-02":-3}),{"10-biology-01":7})
console.log(`PASS ${chapters.length} chapters, ${chapters.length*5} scientific concepts, ${n} unique-answer question checks, progress validation`)

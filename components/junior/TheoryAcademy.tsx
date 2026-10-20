"use client"

import { useEffect, useMemo, useState } from "react"
import { getActiveLabSession } from "@/lib/lab-session"
import TheoryIllustration from "./TheoryIllustrations"
import { deepContent } from "./theory-deep-content"
import { chapters, type TheoryChapter, type TheoryGrade, type TheorySubject } from "./theory-data"
import { createChapterQuiz, gradeAttempt, safeProgress } from "./theory-engine"
import "./theory.css"

type Props = {
  onOpenLab: (labId: string) => void
  initialGrade?: TheoryGrade
}
type View = "catalogue" | "overview" | "lesson" | "quiz" | "results"
const grades: TheoryGrade[] = ["9", "10", "11", "12"]
const subjects: { id: TheorySubject; name: string; glyph: string; blurb: string }[] = [
  { id: "chemistry", name: "Chemistry", glyph: "⚗", blurb: "Understand matter, reactions and the bonds between atoms." },
  { id: "biology", name: "Biology", glyph: "⌁", blurb: "Explore the living world from cells to entire ecosystems." },
]

/** Local-only progress; scoped by the existing workspace/profile when available. */
const PROGRESS_KEY = "openlab.junior.theory.progress.v1"

export default function TheoryAcademy({ onOpenLab, initialGrade = "9" }: Props) {
  const [grade, setGrade] = useState<TheoryGrade>(initialGrade)
  const [subject, setSubject] = useState<TheorySubject>("chemistry")
  const [search, setSearch] = useState("")
  const [chosen, setChosen] = useState<TheoryChapter | null>(null)
  const [view, setView] = useState<View>("catalogue")
  const [step, setStep] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState<Record<string, number>>({})
  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [saveNotice, setSaveNotice] = useState("")
  const [hasLoaded, setHasLoaded] = useState(false)
  const [progressKey, setProgressKey] = useState(PROGRESS_KEY)

  useEffect(() => {
    const session = getActiveLabSession()
    const key = session
      ? `${PROGRESS_KEY}.${session.mode}.${session.workspaceId}.${session.profile.id}`
      : PROGRESS_KEY
    setProgressKey(key)
    try {
      const data = JSON.parse(localStorage.getItem(key) || "{}") as { scores?: unknown; bookmarks?: unknown }
      setFinished(safeProgress(data.scores))
      if (Array.isArray(data.bookmarks)) setBookmarked(data.bookmarks.filter((id): id is string => typeof id === "string" && chapters.some(c => c.id === id)).slice(0, 100))
    } catch { /* Browser storage may be disabled. Lessons still work. */ }
    setHasLoaded(true)
  }, [])
  useEffect(() => {
    if (!hasLoaded) return
    try { localStorage.setItem(progressKey, JSON.stringify({ scores: finished, bookmarks: bookmarked })) }
    catch { setSaveNotice("This browser blocks local saves. Quiz results will last only until you leave.") }
  }, [bookmarked, finished, hasLoaded, progressKey])

  const visible = useMemo(() => chapters.filter(c => c.grade === grade && c.subject === subject && [c.title, ...c.topics.map(t => t.title)].join(" ").toLowerCase().includes(search.trim().toLowerCase())), [grade, subject, search])
  const subjectTotal = chapters.filter(c => c.grade === grade && c.subject === subject).length
  const scoreCount = chapters.filter(c => finished[c.id] !== undefined).length
  const questions = useMemo(() => chosen ? createChapterQuiz(chosen) : [], [chosen])
  const question = questions[quizStep]
  const score = gradeAttempt(questions, answers)
  const expandedLesson = chosen ? deepContent[`${chosen.id}:${chosen.topics[step].title}`] : undefined
  const selectChapter = (chapter: TheoryChapter) => {
    setChosen(chapter); setView("overview"); setStep(0); setFlipped(false); setQuizStep(0); setAnswers({})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const goToTopic = (index: number) => { setStep(index); setFlipped(false); setView("lesson") }
  const toNext = () => {
    setFlipped(false)
    if (step >= 4) { setView("quiz"); setQuizStep(0) }
    else setStep(step + 1)
  }
  const openQuiz = () => { setView("quiz"); setQuizStep(0); setAnswers({}) }
  const finishQuiz = () => {
    if (!chosen || questions.some(q => answers[q.id] === undefined)) return
    const newScore = gradeAttempt(questions, answers)
    setFinished(previous => ({ ...previous, [chosen.id]: Math.max(newScore, previous[chosen.id] || 0) }))
    setView("results")
  }
  const chooseAnswer = (index: number) => {
    if (question) setAnswers(current => ({ ...current, [question.id]: index }))
  }
  const toggleBookmark = () => {
    if (!chosen) return
    setBookmarked(previous => previous.includes(chosen.id) ? previous.filter(id => id !== chosen.id) : [...previous, chosen.id])
  }

  return <section className="theory-root" aria-label="Interactive Chemistry and Biology theory library">
    <div className="theory-topline">
      <button type="button" className="theory-crumb" onClick={() => { setChosen(null); setView("catalogue") }}>⌂ &nbsp;Theory library</button>
      {chosen && <><span aria-hidden="true">/</span><button type="button" className="theory-crumb" onClick={() => setView("catalogue")}>Class {chosen.grade} · {chosen.subject}</button><span aria-hidden="true">/</span><span className="theory-crumb-current">{chosen.title}</span></>}
      <span className="theory-edition">Original revision content · 2026 curriculum-oriented</span>
    </div>

    {view === "catalogue" && <>
      <header className="theory-heading">
        <div><span className="theory-overline">THE INTERACTIVE THEORY ATLAS</span><h1>Discover it. Flip it. <em>Remember it.</em></h1><p>Choose your subject, class and chapter. Learn the essential ideas through visual cards, then challenge yourself with 10 questions.</p></div>
        <div className="theory-headStats"><b>{chapters.length}</b><span>Chapters mapped</span><strong>{scoreCount} practiced</strong></div>
      </header>
      <div className="theory-selector" aria-label="Select a subject and class">
        <div className="theory-stepLabel"><b>01</b><span>Choose a subject</span></div>
        <div className="theory-subjects">{subjects.map(item => <button type="button" key={item.id} className={`theory-subject ${item.id} ${subject === item.id ? "selected" : ""}`} aria-pressed={subject === item.id} onClick={() => { setSubject(item.id); setSearch("") }}><span className="theory-subjectGlyph">{item.glyph}</span><span><strong>{item.name}</strong><small>{item.blurb}</small></span><span aria-hidden="true">↗</span></button>)}</div>
        <div className="theory-stepLabel"><b>02</b><span>Choose your class</span></div>
        <div className="theory-grades">{grades.map(id => <button key={id} type="button" className={grade === id ? "selected" : ""} aria-pressed={grade === id} onClick={() => { setGrade(id); setSearch("") }}>Class <strong>{id}</strong></button>)}</div>
      </div>
      <div className="theory-catalogueHeader"><div><span className="theory-overline">03 · PICK A CHAPTER</span><h2>Class {grade} {subject === "biology" ? "Biology" : "Chemistry"}</h2><p>{subjectTotal} chapter{subjectTotal !== 1 ? "s" : ""} · 5 illustrated concept cards and 10 questions per chapter</p></div><label className="theory-search"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} aria-label="Search chapters and concepts" placeholder="Search a chapter or topic…" /></label></div>
      {saveNotice && <p className="theory-storageNotice" role="status">{saveNotice}</p>}
      <div className="theory-chapterGrid">{visible.map((chapter, idx) => <button type="button" className="theory-chapter" key={chapter.id} onClick={() => selectChapter(chapter)}><div className="theory-chapterTop"><span>CHAPTER {String(idx + 1).padStart(2, "0")}</span><span>{bookmarked.includes(chapter.id) ? "★" : "↗"}</span></div><TheoryIllustration kind={chapter.diagram} compact /><div className="theory-chapterBody"><h3>{chapter.title}</h3><p>{chapter.topics.slice(0, 3).map(t => t.title).join(" · ")}</p></div><div className="theory-chapterBottom"><span>{finished[chapter.id] !== undefined ? `Best quiz: ${finished[chapter.id]}/10` : "5 cards · 10 questions"}</span><b>Explore →</b></div></button>)}</div>
      {visible.length === 0 && <p className="theory-empty">No chapters match your search. Try another topic.</p>}
    </>}

    {chosen && view === "overview" && <>
      <div className="theory-lessonHeading"><div><span className="theory-overline">CLASS {chosen.grade} / {chosen.subject.toUpperCase()} / CHAPTER OVERVIEW</span><h1>{chosen.title}</h1><p>Five illustrated concepts with real-life applications. Selected lessons have full 200–300-word chapters; other topics remain concise summaries pending editorial expansion. Choose a topic, or start from the beginning.</p><div className="theory-headingActions"><button className="theory-primary" onClick={() => goToTopic(0)}>Start lesson <span>→</span></button><button className="theory-outline" onClick={toggleBookmark}>{bookmarked.includes(chosen.id) ? "★ Bookmarked" : "☆ Bookmark chapter"}</button></div></div><TheoryIllustration kind={chosen.diagram} /></div>
      <div className="theory-topicGrid">{chosen.topics.map((topic, i) => <button key={topic.title} className="theory-topic" onClick={() => goToTopic(i)}><span>{String(i + 1).padStart(2, "0")}</span><strong>{topic.title}</strong><small>{topic.explanation}</small><b>View card →</b></button>)}<button className="theory-topic quiz" onClick={openQuiz}><span>✓</span><strong>10-question challenge</strong><small>Check what you remember, reveal explanations and save your best score locally.</small><b>Start quiz →</b></button></div>
      {chosen.lab ? <div className="theory-labCallout"><div><b>TAKE THE NEXT STEP</b><h3>Learn it, then experiment with it.</h3><p>Launch a related educational model. The lab is not a substitute for the entire chapter.</p></div><button onClick={() => onOpenLab(chosen.lab)}>Open related lab ↗</button></div> : <div className="theory-labCallout"><div><b>THEORY FIRST</b><h3>More experiments are under development.</h3><p>This chapter has its own revision cards and quiz, but no scientifically matching interactive lab yet.</p></div></div>}
    </>}

    {chosen && view === "lesson" && <>
      <div className="theory-readingHeader"><div><span className="theory-overline">STUDY CARDS / {chosen.title.toUpperCase()}</span><h2>{chosen.topics[step].title}</h2></div><button className="theory-outline" onClick={() => setView("overview")}>All topics ×</button></div>
      <div className="theory-learningLayout"><div className="theory-lessonSide"><span className="theory-sideTitle">IN THIS CHAPTER</span>{chosen.topics.map((t, i) => <button key={t.title} onClick={() => goToTopic(i)} className={step === i ? "active" : ""}><span>{String(i + 1).padStart(2, "0")}</span>{t.title}</button>)}<button onClick={openQuiz}><span>✓</span>10-question checkpoint</button><p>Tip: click the large card to flip it and see a real-world example.</p></div>
        <div className="theory-studyStage"><div className="theory-progressTop"><span>CARD {step + 1} OF 5</span><span>{Math.round((step + 1) / 5 * 100)}% COMPLETE</span></div><div className="theory-progress"><span style={{ width: `${(step + 1) * 20}%` }} /></div>
          <div className={`theory-flipCard ${flipped ? "flipped" : ""}`} aria-label={`Study card for ${chosen.topics[step].title}`}>
            <div className="theory-flipInner">
              <article className="theory-flipFace theory-flipFront" aria-hidden={flipped}>
                <span className="theory-faceBadge">✦ CONCEPT {String(step + 1).padStart(2, '0')} · {expandedLesson ? 'DETAILED LESSON' : 'REVISION SUMMARY'}</span>
                <div className="theory-cardSplit">
                  <figure className="theory-topicFigure"><TheoryIllustration kind={chosen.diagram} topic={chosen.topics[step].title} /><figcaption>Original, topic-matched scientific schematic (not copied textbook artwork)</figcaption></figure>
                  <div className="theory-article"><span className="theory-cardEyebrow">THE SCIENCE EXPLAINED</span><h3>{chosen.topics[step].title}</h3>
                    <p>{expandedLesson?.explanation || chosen.topics[step].explanation}</p>
                    {expandedLesson ? <span className="theory-wordBadge">{expandedLesson.explanation.trim().split(/\s+/).length} words · Extended concept explanation</span> : <span className="theory-wordBadge isShort">Concise revision card · Extended explanation not yet reviewed</span>}
                  </div>
                </div>
              </article>
              <article className="theory-flipFace theory-flipBack" aria-hidden={!flipped}><span className="theory-faceBadge">✧ SCIENCE IN EVERYDAY LIFE</span><div className="theory-exampleMark">↗</div><h3>See it in the real world.</h3><p>{expandedLesson?.example || chosen.topics[step].example}</p><span className="theory-flipHint">Use the Flip card button to return to the concept.</span></article>
            </div>
          </div>
          <div className="theory-flipControl"><button type="button" onClick={() => setFlipped(v => !v)} aria-pressed={flipped}>{flipped ? '↶ Return to explanation' : '↻ Flip card · real-life application'}</button><span>Each topic has its own schematic illustration</span></div>
          <div className="theory-readerActions"><button type="button" className="theory-outline" onClick={() => { setStep(s => Math.max(0, s - 1)); setFlipped(false) }} disabled={step === 0}>← Previous</button><span>Read, flip, then move to the next concept</span><button type="button" className="theory-primary" onClick={toNext}>{step === 4 ? "Start 10-question quiz" : "Next concept"} →</button></div>
        </div></div>
    </>}

    {chosen && view === "quiz" && question && <div className="theory-quizStage"><div className="theory-quizHead"><div><span className="theory-overline">CHAPTER CHECKPOINT / {chosen.title.toUpperCase()}</span><h1>Put your knowledge to the test.</h1><p>Ten questions. Four choices each. Your answers stay on this device.</p></div><div className="theory-quizCount"><b>{quizStep + 1}</b><span>/ 10</span></div></div><div className="theory-progress"><span style={{ width: `${(quizStep + 1) * 10}%` }} /></div><div className="theory-questionBox"><span className="theory-faceBadge">QUESTION {String(quizStep + 1).padStart(2, "0")} / {quizStep < 5 ? "CONCEPT RECALL" : "EXAMPLE APPLICATION"}</span><h2>{question.prompt}</h2><div className="theory-answers">{question.choices.map((choice, index) => <button type="button" key={`${question.id}-${index}`} className={answers[question.id] === index ? "selected" : ""} aria-pressed={answers[question.id] === index} onClick={() => chooseAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div><div className="theory-readerActions"><button type="button" className="theory-outline" disabled={quizStep === 0} onClick={() => setQuizStep(v => v - 1)}>← Previous</button><span>{Object.keys(answers).length} of 10 answered</span>{quizStep === 9 ? <button className="theory-primary" disabled={questions.some(q => answers[q.id] === undefined)} onClick={finishQuiz}>Finish quiz ✓</button> : <button className="theory-primary" disabled={answers[question.id] === undefined} onClick={() => setQuizStep(v => v + 1)}>Next question →</button>}</div></div></div>}

    {chosen && view === "results" && <div className="theory-results"><span className="theory-overline">CHAPTER COMPLETE</span><div className="theory-score">{score}<span>/ 10</span></div><h1>{score >= 8 ? "Fantastic progress." : score >= 5 ? "Keep building confidence." : "Every scientist learns by trying."}</h1><p>{score >= 8 ? "Great recall. Review any missed questions below." : "Review the explanations, flip through the cards again, and improve your score."}</p><div className="theory-headingActions"><button className="theory-primary" onClick={openQuiz}>Retry challenge ↻</button><button className="theory-outline" onClick={() => setView("overview")}>Back to chapter</button>{chosen.lab && <button className="theory-outline" onClick={() => onOpenLab(chosen.lab)}>Explore related lab ↗</button>}</div><div className="theory-reviewList">{questions.map((q, i) => <div key={q.id} className={answers[q.id] === q.answer ? "correct" : "incorrect"}><b>{answers[q.id] === q.answer ? "✓" : "✕"} Question {i + 1}</b><p>{q.prompt}</p><strong>Correct answer: {q.choices[q.answer]}</strong><small>{q.explanation}</small></div>)}</div></div>}

    <footer className="theory-attribution"><span>Original educational summaries & diagrams. Independent and not affiliated with NCERT, CBSE, PhET or Concord Consortium.</span><a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noreferrer noopener">Consult official NCERT textbooks ↗</a></footer>
  </section>
}

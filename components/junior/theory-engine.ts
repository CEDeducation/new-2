import type { TheoryChapter } from "./theory-data"

export type QuizQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: number
  explanation: string
}

/** Ten repeatable, answerable recall-and-application checks per chapter.
 * Five identify concepts from scientific descriptions, five match examples to concepts.
 * Shuffling is deterministic so review and persisted scores remain reproducible.
 */
export function createChapterQuiz(chapter: TheoryChapter): QuizQuestion[] {
  const facts = chapter.topics
  if (facts.length !== 5) throw new Error(`Chapter ${chapter.id} must have five topics`)
  return Array.from({ length: 10 }, (_, questionIndex) => {
    const target = questionIndex % 5
    const isExample = questionIndex >= 5
    const order = [0, 1, 2, 3, 4]
      .filter(index => index !== target)
      .sort((a, b) => ((a * 3 + questionIndex * 7) % 11) - ((b * 3 + questionIndex * 7) % 11))
      .slice(0, 3)
    const correct = facts[target]
    const options = [target, ...order]
    const rotate = (questionIndex * 3 + 1) % 4
    const arranged = [...options.slice(rotate), ...options.slice(0, rotate)]
    return {
      id: `${chapter.id}-${questionIndex + 1}`,
      prompt: isExample
        ? `Which real-world example best demonstrates “${correct.title}”?`
        : `Which concept matches this explanation? “${correct.explanation}”`,
      choices: arranged.map(index => isExample ? facts[index].example : facts[index].title),
      answer: arranged.indexOf(target),
      explanation: `${correct.title}: ${correct.explanation} Example: ${correct.example}`,
    }
  })
}

export function gradeAttempt(questions: QuizQuestion[], answers: Record<string, number>): number {
  return questions.reduce((score, q) => score + (answers[q.id] === q.answer ? 1 : 0), 0)
}

export function safeProgress(raw: unknown): Record<string, number> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {}
  const allowed: Record<string, number> = {}
  Object.entries(raw).slice(0, 200).forEach(([id, score]) => {
    if (/^(9|10|11|12)-(biology|chemistry)-\d{2}$/.test(id) && typeof score === "number" && Number.isInteger(score) && score >= 0 && score <= 10) allowed[id] = score
  })
  return allowed
}

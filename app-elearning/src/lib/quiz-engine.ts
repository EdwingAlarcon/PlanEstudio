// Pure TypeScript quiz engine — ported from evaluaciones-simulador.js

export type QuestionType = "single" | "multi";

export interface Question {
  id: string;           // "module-{moduleId}-{index}"
  moduleId: number;
  type: QuestionType;
  prompt: string;
  options: string[];
  answer: number[];     // indices of correct options
  explanation: string;
}

export interface QuizAttempt {
  questionId: string;
  selected: number[];
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizSession {
  moduleId: number | null; // null = simulator (mixed)
  questions: Question[];
  attempts: QuizAttempt[];
  startedAt: number;
  finishedAt: number | null;
  timeLimit: number | null; // seconds, null = unlimited
}

export interface QuizResult {
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
  attempts: QuizAttempt[];
}

// ─── Seeded shuffle (Fisher-Yates) ───────────────────────────────────────────

export function shuffleArray<T>(arr: T[], seed?: number): T[] {
  const copy = [...arr];
  let currentIndex = copy.length;
  let seedVal = seed ?? Date.now();

  const random = () => {
    seedVal = (seedVal * 1664525 + 1013904223) & 0xffffffff;
    return (seedVal >>> 0) / 0xffffffff;
  };

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    const temp = copy[currentIndex]!;
    copy[currentIndex] = copy[randomIndex]!;
    copy[randomIndex] = temp;
  }
  return copy;
}

// ─── Answer evaluation ────────────────────────────────────────────────────────

export function evaluateAnswer(question: Question, selected: number[]): boolean {
  if (question.answer.length !== selected.length) return false;
  const sortedCorrect = [...question.answer].sort((a, b) => a - b);
  const sortedSelected = [...selected].sort((a, b) => a - b);
  return sortedCorrect.every((val, i) => val === sortedSelected[i]);
}

// ─── Session management ───────────────────────────────────────────────────────

export function createSession(
  questions: Question[],
  options: { moduleId?: number; timeLimit?: number; shuffle?: boolean } = {}
): QuizSession {
  const { moduleId = null, timeLimit = null, shuffle = true } = options;
  return {
    moduleId,
    questions: shuffle ? shuffleArray(questions) : questions,
    attempts: [],
    startedAt: Date.now(),
    finishedAt: null,
    timeLimit,
  };
}

export function recordAttempt(
  session: QuizSession,
  questionId: string,
  selected: number[]
): QuizSession {
  const question = session.questions.find((q) => q.id === questionId);
  if (!question) return session;

  const isCorrect = evaluateAnswer(question, selected);
  const attempt: QuizAttempt = {
    questionId,
    selected,
    isCorrect,
    timestamp: Date.now(),
  };

  // Replace existing attempt for same question, or append
  const existingIdx = session.attempts.findIndex((a) => a.questionId === questionId);
  const attempts =
    existingIdx >= 0
      ? session.attempts.map((a, i) => (i === existingIdx ? attempt : a))
      : [...session.attempts, attempt];

  return { ...session, attempts };
}

export function finishSession(session: QuizSession): QuizSession {
  return { ...session, finishedAt: Date.now() };
}

export function calculateResult(session: QuizSession): QuizResult {
  const total = session.questions.length;
  const correct = session.attempts.filter((a) => a.isCorrect).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return {
    correct,
    total,
    percentage,
    passed: percentage >= 70,
    attempts: session.attempts,
  };
}

// ─── Simulator helpers ────────────────────────────────────────────────────────

export function pickSimulatorQuestions(
  allQuestions: Question[],
  count: number,
  seed?: number
): Question[] {
  const shuffled = shuffleArray(allQuestions, seed);
  return shuffled.slice(0, count);
}

export function getElapsedSeconds(session: QuizSession): number {
  const end = session.finishedAt ?? Date.now();
  return Math.floor((end - session.startedAt) / 1000);
}

export function getRemainingSeconds(session: QuizSession): number | null {
  if (!session.timeLimit) return null;
  const elapsed = getElapsedSeconds(session);
  return Math.max(0, session.timeLimit - elapsed);
}

// ─── Module-level helpers ─────────────────────────────────────────────────────

export function certForModule(moduleId: number): string {
  if (moduleId <= 8) return "PL-900";
  if (moduleId <= 17) return "PL-200";
  if (moduleId <= 30) return "PL-400";
  return "PL-600";
}

export function levelForModule(moduleId: number): string {
  if (moduleId <= 8) return "basico";
  if (moduleId <= 17) return "intermedio";
  if (moduleId <= 30) return "avanzado";
  return "arquitecto";
}

export function getAnsweredCount(session: QuizSession): number {
  return session.attempts.length;
}

export function isSessionComplete(session: QuizSession): boolean {
  return session.attempts.length >= session.questions.length;
}

export function getCurrentQuestion(session: QuizSession): Question | undefined {
  const answeredIds = new Set(session.attempts.map((a) => a.questionId));
  return session.questions.find((q) => !answeredIds.has(q.id));
}

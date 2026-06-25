import type { Question, QuestionType } from "./quiz-engine";
import { LEVEL_MODULE_RANGE } from "./i18n";
import MODULE_QUESTIONS from "../data/questions";

// ─── Cache ────────────────────────────────────────────────────────────────────

let _cache: Question[] | null = null;

export function getAllQuestions(): Question[] {
  if (_cache) return _cache;

  const questions: Question[] = [];

  for (const [moduleIdStr, rawQuestions] of Object.entries(MODULE_QUESTIONS)) {
    const moduleId = Number(moduleIdStr);
    rawQuestions.forEach((raw, idx) => {
      questions.push({
        id: `module-${moduleId}-${idx}`,
        moduleId,
        type: raw.type as QuestionType,
        prompt: raw.prompt,
        options: raw.options,
        answer: raw.answer,
        explanation: raw.explanation,
      });
    });
  }

  _cache = questions;
  return questions;
}

export function getQuestionsForModule(moduleId: number): Question[] {
  return getAllQuestions().filter((q) => q.moduleId === moduleId);
}

export function getQuestionsForLevel(levelId: string): Question[] {
  const range = LEVEL_MODULE_RANGE[levelId as keyof typeof LEVEL_MODULE_RANGE];
  if (!range) return [];
  const [min, max] = range;
  return getAllQuestions().filter((q) => q.moduleId >= min && q.moduleId <= max);
}

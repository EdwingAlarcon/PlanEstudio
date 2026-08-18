import type { Question, QuestionType } from "./quiz-engine";
import { LEVEL_MODULE_RANGE } from "./i18n";
import MODULE_QUESTIONS from "../data/questions";
import { ContentValidationError, getAllModules } from "./content";

// ─── Cache ────────────────────────────────────────────────────────────────────

let _cache: Question[] | null = null;

function getAllParsedQuestions(): Question[] {
  if (_cache) return _cache;

  const questions: Question[] = [];
  const validModuleIds = new Set(getAllModules().map((mod) => mod.moduleId));

  for (const [moduleIdStr, rawQuestions] of Object.entries(MODULE_QUESTIONS)) {
    const moduleId = Number(moduleIdStr);
    if (!validModuleIds.has(moduleId)) {
      throw new ContentValidationError(`questions: moduleId ${moduleId} no existe en el contenido de módulos`);
    }

    rawQuestions.forEach((raw, idx) => {
      const id = `module-${moduleId}-${idx}`;
      if (!["single", "multi"].includes(raw.type)) {
        throw new ContentValidationError(`${id}: tipo de pregunta inválido '${raw.type}'`);
      }
      if (!raw.prompt.trim()) {
        throw new ContentValidationError(`${id}: prompt vacío`);
      }
      if (raw.answer.some((answer) => answer < 0 || answer >= raw.options.length)) {
        throw new ContentValidationError(`${id}: respuesta fuera del rango de opciones`);
      }
      if (raw.appliesTo !== undefined && !["quiz", "caso"].includes(raw.appliesTo)) {
        throw new ContentValidationError(`${id}: appliesTo inválido '${raw.appliesTo}'`);
      }

      questions.push({
        id,
        moduleId,
        type: raw.type as QuestionType,
        prompt: raw.prompt,
        options: raw.options,
        answer: raw.answer,
        explanation: raw.explanation,
        appliesTo: raw.appliesTo ?? "quiz",
      });
    });
  }

  _cache = questions;
  return questions;
}

/** Question bank consumed by module quizzes, the simulator and the dashboard — excludes "caso" questions. */
export function getAllQuestions(): Question[] {
  return getAllParsedQuestions().filter((q) => q.appliesTo === "quiz");
}

/** Full bank (quiz + case-diagnosis) — the spaced repetition engine resolves review cards against this. */
export function getAllReviewableQuestions(): Question[] {
  return getAllParsedQuestions();
}

/** O(1)-ish lookup map by question id, for resolving review cards to their question content. */
export function getQuestionById(id: string): Question | undefined {
  return getAllParsedQuestions().find((q) => q.id === id);
}

/** Preguntas del "Diagnóstico de caso aplicado" para un módulo (vacío si el módulo no tiene piloto). */
export function getCaseDiagnosisForModule(moduleId: number): Question[] {
  return getAllParsedQuestions().filter((q) => q.moduleId === moduleId && q.appliesTo === "caso");
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

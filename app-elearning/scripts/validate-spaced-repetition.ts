// Fails fast in CI if the spaced repetition engine's invariants break —
// mirrors scripts/validate-interactive-practices.ts.

import { ContentValidationError } from "../src/lib/content";
import { getAllReviewableQuestions } from "../src/lib/questions-parser";
import { validateSpacedRepetition, isQuestionEligibleForReview, type ReviewCardMap } from "../src/lib/review-queue";
import { sm2Scheduler, MAX_INTERVAL_DAYS, MIN_INTERVAL_DAYS, type ReviewCardState } from "../src/lib/review-scheduler";
import { REVIEW_SCHEMA_VERSION, REVIEW_STORAGE_KEY } from "../src/lib/review-store";

function main(): void {
  const errors: string[] = [];
  const questions = getAllReviewableQuestions();
  const knownIds = new Set(questions.map((q) => q.id));

  // §15 guardrail: a card must never be eligible before the question was answered.
  const emptyCards: ReviewCardMap = {};
  if (isQuestionEligibleForReview(questions[0]!.id, emptyCards)) {
    errors.push("isQuestionEligibleForReview: una pregunta sin tarjeta no debería ser elegible");
  }

  // Scheduler invariants on synthetic input — cheap smoke test against real question ids.
  const now = new Date();
  const sampleId = questions[0]!.id;
  const sampleModuleId = questions[0]!.moduleId;

  const correct = sm2Scheduler.schedule({
    card: null, questionId: sampleId, moduleId: sampleModuleId, itemType: "quiz-question",
    isCorrect: true, confidence: "good", now,
  });
  if (correct.intervalDays < MIN_INTERVAL_DAYS || correct.intervalDays > MAX_INTERVAL_DAYS) {
    errors.push(`scheduler: intervalDays fuera de rango para una tarjeta nueva correcta (${correct.intervalDays})`);
  }

  const incorrectAfterEasy = sm2Scheduler.schedule({
    card: correct, questionId: sampleId, moduleId: sampleModuleId, itemType: "quiz-question",
    isCorrect: false, confidence: "easy", now,
  });
  if (incorrectAfterEasy.lastConfidence === "easy") {
    errors.push("scheduler: §27 violado — una respuesta incorrecta produjo confidence \"easy\"");
  }

  // Cross-check validateSpacedRepetition against a small synthetic card map.
  const syntheticCards: ReviewCardMap = {
    [sampleId]: { ...correct, questionId: sampleId },
    "orphan-question-id": {
      questionId: "orphan-question-id", moduleId: 999, itemType: "quiz-question",
      repetitions: 1, intervalDays: -5, easeFactor: 2.5, nextReviewAt: now.toISOString(),
      lapses: 0, totalReviews: 1, correctReviews: 1, incorrectReviews: 0, isLeech: false, status: "review",
    } as ReviewCardState,
  };
  const invariantErrors = validateSpacedRepetition(syntheticCards, knownIds);
  if (invariantErrors.length > 0) {
    errors.push(...invariantErrors.map((e) => `validateSpacedRepetition: ${e}`));
  }

  if (REVIEW_SCHEMA_VERSION !== 1) {
    errors.push(`review-store: se esperaba REVIEW_SCHEMA_VERSION 1, se encontró ${REVIEW_SCHEMA_VERSION}`);
  }
  if (REVIEW_STORAGE_KEY !== "planestudio.spaced-repetition.v1") {
    errors.push(`review-store: clave de almacenamiento inesperada (${REVIEW_STORAGE_KEY})`);
  }

  if (errors.length > 0) {
    throw new ContentValidationError(errors.join("; "));
  }

  console.log(`✓ ${questions.length} preguntas disponibles para el motor de repaso`);
  console.log("✓ elegibilidad: una pregunta sin tarjeta nunca es elegible para repaso");
  console.log("✓ scheduler: invariantes de intervalo y coherencia incorrecta→no-easy verificados");
  console.log(`✓ store: clave "${REVIEW_STORAGE_KEY}", schemaVersion ${REVIEW_SCHEMA_VERSION}`);
}

try {
  main();
} catch (error) {
  if (error instanceof Error) {
    console.error(`✗ Validación de repaso espaciado falló: ${error.message}`);
  } else {
    console.error("✗ Validación de repaso espaciado falló con error inesperado:", error);
  }
  process.exit(1);
}

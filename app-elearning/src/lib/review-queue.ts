// Eligibility, due-queue ordering and interleaving for the spaced repetition engine.
// Pure functions over a `Record<questionId, ReviewCardState>` — no store, no I/O.

import { isDueOn, localDaysBetween, addDays } from "./review-date";
import type { ReviewCardState, ReviewItemType } from "./review-scheduler";
import { LEECH_LAPSE_THRESHOLD } from "./review-scheduler";

export type ReviewCardMap = Record<string, ReviewCardState>;

/**
 * §15 guardrail: a question can only ever be reviewed if the student already
 * answered it — a card exists for it. Nothing "unlocks" future content by being
 * marked complete; this is what keeps `/repaso` from ever showing Módulo 42
 * content to a Módulo 8 student.
 */
export function isQuestionEligibleForReview(questionId: string, cards: ReviewCardMap): boolean {
  return Object.prototype.hasOwnProperty.call(cards, questionId);
}

const TYPE_WEIGHT: Record<ReviewItemType, number> = {
  "quiz-question": 0,
  "case-diagnosis": 1,
};

/**
 * Due cards ordered by: most overdue → highest lapses → quiz-question before
 * case-diagnosis → interleaved by module so the same module never repeats back
 * to back. Deterministic — no randomness (§73).
 */
export function getDueReviewItems(cards: ReviewCardMap, now: Date, limit?: number): ReviewCardState[] {
  const due = Object.values(cards)
    .filter((card) => card.status !== "suspended" && isDueOn(card.nextReviewAt, now))
    .sort((a, b) => {
      const overdueA = -localDaysBetween(now, new Date(a.nextReviewAt));
      const overdueB = -localDaysBetween(now, new Date(b.nextReviewAt));
      if (overdueA !== overdueB) return overdueB - overdueA;
      if (a.lapses !== b.lapses) return b.lapses - a.lapses;
      if (TYPE_WEIGHT[a.itemType] !== TYPE_WEIGHT[b.itemType]) return TYPE_WEIGHT[a.itemType] - TYPE_WEIGHT[b.itemType];
      return a.questionId.localeCompare(b.questionId);
    });

  const interleaved = interleaveByModule(due);
  return typeof limit === "number" ? interleaved.slice(0, limit) : interleaved;
}

/**
 * Round-robin by moduleId so a session never presents many consecutive
 * questions from the same module (§22-23). Stable and deterministic: preserves
 * the relative order produced by getDueReviewItems within each module bucket.
 */
export function interleaveByModule(items: ReviewCardState[]): ReviewCardState[] {
  const buckets = new Map<number, ReviewCardState[]>();
  const moduleOrder: number[] = [];
  for (const item of items) {
    if (!buckets.has(item.moduleId)) {
      buckets.set(item.moduleId, []);
      moduleOrder.push(item.moduleId);
    }
    buckets.get(item.moduleId)!.push(item);
  }

  const result: ReviewCardState[] = [];
  let remaining = items.length;
  while (remaining > 0) {
    for (const moduleId of moduleOrder) {
      const bucket = buckets.get(moduleId)!;
      const next = bucket.shift();
      if (next) {
        result.push(next);
        remaining--;
      }
    }
  }
  return result;
}

/** §39: "needs reinforcement" is a lens over the same store, not a second store. */
export function getIncorrectReviewItems(cards: ReviewCardMap): ReviewCardState[] {
  return Object.values(cards).filter((card) => card.lapses >= 2 || card.isLeech);
}

export function getLeechItems(cards: ReviewCardMap): ReviewCardState[] {
  return Object.values(cards).filter((card) => card.lapses >= LEECH_LAPSE_THRESHOLD);
}

export interface RetentionSummary {
  total: number;
  dueToday: number;
  dueTomorrow: number;
  dueNext7Days: number;
  learning: number;
  review: number;
  needsReinforcement: number;
}

export function getRetentionSummary(cards: ReviewCardMap, now: Date): RetentionSummary {
  const values = Object.values(cards);
  const tomorrow = addDays(now, 1);
  const in7Days = addDays(now, 7);
  return {
    total: values.length,
    dueToday: values.filter((c) => c.status !== "suspended" && isDueOn(c.nextReviewAt, now)).length,
    dueTomorrow: values.filter((c) => c.status !== "suspended" && isDueOn(c.nextReviewAt, tomorrow) && !isDueOn(c.nextReviewAt, now)).length,
    dueNext7Days: values.filter((c) => c.status !== "suspended" && isDueOn(c.nextReviewAt, in7Days)).length,
    learning: values.filter((c) => c.status === "learning" || c.status === "relearning").length,
    review: values.filter((c) => c.status === "review").length,
    needsReinforcement: getIncorrectReviewItems(cards).length,
  };
}

export interface ModuleReinforcementGroup {
  moduleId: number;
  count: number;
}

export function groupReinforcementByModule(cards: ReviewCardMap): ModuleReinforcementGroup[] {
  const counts = new Map<number, number>();
  for (const card of getIncorrectReviewItems(cards)) {
    counts.set(card.moduleId, (counts.get(card.moduleId) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([moduleId, count]) => ({ moduleId, count }))
    .sort((a, b) => a.moduleId - b.moduleId);
}

export type ReviewSessionSize = "corta" | "normal" | "larga";

export const SESSION_SIZE_LIMITS: Record<ReviewSessionSize, number> = {
  corta: 10,
  normal: 20,
  larga: 30,
};

/** Pure invariant checks consumed by scripts/validate-spaced-repetition.ts. */
export function validateSpacedRepetition(cards: ReviewCardMap, knownQuestionIds: Set<string>): string[] {
  const errors: string[] = [];
  for (const [id, card] of Object.entries(cards)) {
    if (id !== card.questionId) errors.push(`${id}: questionId no coincide con la clave del mapa`);
    if (!knownQuestionIds.has(id)) continue; // orphaned card — not an error, just excluded from queues
    if (card.intervalDays < 0 || !Number.isFinite(card.intervalDays)) errors.push(`${id}: intervalDays inválido (${card.intervalDays})`);
    if (card.easeFactor < 1.3 - 1e-9 || card.easeFactor > 2.8 + 1e-9) errors.push(`${id}: easeFactor fuera de rango (${card.easeFactor})`);
    if (card.lapses < 0) errors.push(`${id}: lapses negativo`);
    if (card.lastResult === "incorrect" && card.lastConfidence === "easy") {
      errors.push(`${id}: respuesta incorrecta no puede tener confidence "easy"`);
    }
  }
  return errors;
}

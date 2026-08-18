// Pure, deterministic SM-2-inspired scheduler for the spaced repetition engine.
// No I/O, no localStorage, no Date.now() — every call receives `now` explicitly,
// and the same input always produces the same output (see review-scheduler.test.ts).
//
// Kept behind the `ReviewScheduler` interface so a future algorithm can replace
// sm2Scheduler without touching the store, the UI or the question bank.

import { addDays, toIsoDate } from "./review-date";

export type ReviewConfidence = "again" | "hard" | "good" | "easy";
export type ReviewStatus = "new" | "learning" | "review" | "relearning" | "suspended";
export type ReviewItemType = "quiz-question" | "case-diagnosis";

export interface ReviewCardState {
  questionId: string;
  moduleId: number;
  itemType: ReviewItemType;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string; // ISO
  lastReviewedAt?: string;
  lastResult?: "correct" | "incorrect";
  lastConfidence?: ReviewConfidence;
  lapses: number;
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  isLeech: boolean;
  status: ReviewStatus;
}

export const LEARNING_STEPS_DAYS = [1, 3, 7] as const;
export const MIN_INTERVAL_DAYS = 1;
export const MAX_INTERVAL_DAYS = 180;
export const MIN_EASE = 1.3;
export const MAX_EASE = 2.8;
export const DEFAULT_EASE = 2.5;
export const HARD_INTERVAL_FACTOR = 1.2;
export const EASY_INTERVAL_BONUS = 1.3;
export const LEECH_LAPSE_THRESHOLD = 5;

export interface ReviewScheduleInput {
  card: ReviewCardState | null; // null = brand-new card
  questionId: string;
  moduleId: number;
  itemType: ReviewItemType;
  isCorrect: boolean;
  confidence: ReviewConfidence;
  now: Date;
}

export interface ReviewScheduler {
  schedule(input: ReviewScheduleInput): ReviewCardState;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function newCard(questionId: string, moduleId: number, itemType: ReviewItemType): ReviewCardState {
  return {
    questionId,
    moduleId,
    itemType,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: DEFAULT_EASE,
    nextReviewAt: "",
    lapses: 0,
    totalReviews: 0,
    correctReviews: 0,
    incorrectReviews: 0,
    isLeech: false,
    status: "new",
  };
}

export const sm2Scheduler: ReviewScheduler = {
  schedule(input: ReviewScheduleInput): ReviewCardState {
    const base = input.card ?? newCard(input.questionId, input.moduleId, input.itemType);

    // Rule §27: an incorrect answer can never yield an "easy" outcome — coherence
    // is enforced here, once, rather than trusted to every UI call site.
    const confidence: ReviewConfidence = input.isCorrect ? input.confidence : "again";

    const totalReviews = base.totalReviews + 1;
    const correctReviews = base.correctReviews + (input.isCorrect ? 1 : 0);
    const incorrectReviews = base.incorrectReviews + (input.isCorrect ? 0 : 1);

    if (!input.isCorrect) {
      const lapses = base.lapses + 1;
      const easeFactor = clamp(base.easeFactor - 0.2, MIN_EASE, MAX_EASE);
      const intervalDays = MIN_INTERVAL_DAYS;
      return {
        ...base,
        repetitions: 0,
        intervalDays,
        easeFactor,
        nextReviewAt: toIsoDate(addDays(input.now, intervalDays)),
        lastReviewedAt: toIsoDate(input.now),
        lastResult: "incorrect",
        lastConfidence: confidence,
        lapses,
        totalReviews,
        correctReviews,
        incorrectReviews,
        isLeech: lapses >= LEECH_LAPSE_THRESHOLD,
        status: "relearning",
      };
    }

    // §26: "again" is offered even on a correct answer — it means "I guessed
    // right but didn't really know it." Treated as a soft lapse: the ease
    // penalty of an incorrect answer, but lapses/incorrectReviews stay untouched
    // because the answer WAS objectively correct.
    if (confidence === "again") {
      const easeFactor = clamp(base.easeFactor - 0.2, MIN_EASE, MAX_EASE);
      const intervalDays = MIN_INTERVAL_DAYS;
      return {
        ...base,
        repetitions: 0,
        intervalDays,
        easeFactor,
        nextReviewAt: toIsoDate(addDays(input.now, intervalDays)),
        lastReviewedAt: toIsoDate(input.now),
        lastResult: "correct",
        lastConfidence: confidence,
        totalReviews,
        correctReviews,
        incorrectReviews,
        isLeech: base.lapses >= LEECH_LAPSE_THRESHOLD,
        status: "relearning",
      };
    }

    const repetitions = base.repetitions + 1;
    let intervalDays: number;
    let easeFactor = base.easeFactor;
    let status: ReviewStatus;

    if (base.status === "new" || base.status === "learning" || base.status === "relearning") {
      // Learning-step ladder for cards not yet in steady-state review.
      const step = Math.min(repetitions - 1, LEARNING_STEPS_DAYS.length - 1);
      const stepInterval = LEARNING_STEPS_DAYS[step]!;
      if (confidence === "hard") {
        intervalDays = Math.max(MIN_INTERVAL_DAYS, Math.round(stepInterval * 0.7));
        easeFactor = clamp(easeFactor - 0.15, MIN_EASE, MAX_EASE);
      } else if (confidence === "easy") {
        intervalDays = Math.round(stepInterval * EASY_INTERVAL_BONUS);
        easeFactor = clamp(easeFactor + 0.15, MIN_EASE, MAX_EASE);
      } else {
        intervalDays = stepInterval;
      }
      status = repetitions >= LEARNING_STEPS_DAYS.length ? "review" : "learning";
    } else {
      // Steady-state review: interval grows from ease, shaped by confidence.
      const priorInterval = Math.max(base.intervalDays, MIN_INTERVAL_DAYS);
      if (confidence === "hard") {
        intervalDays = Math.round(priorInterval * HARD_INTERVAL_FACTOR);
        easeFactor = clamp(easeFactor - 0.15, MIN_EASE, MAX_EASE);
      } else if (confidence === "easy") {
        intervalDays = Math.round(priorInterval * easeFactor * EASY_INTERVAL_BONUS);
        easeFactor = clamp(easeFactor + 0.15, MIN_EASE, MAX_EASE);
      } else {
        intervalDays = Math.round(priorInterval * easeFactor);
      }
      status = "review";
    }

    intervalDays = clamp(intervalDays, MIN_INTERVAL_DAYS, MAX_INTERVAL_DAYS);

    return {
      ...base,
      repetitions,
      intervalDays,
      easeFactor,
      nextReviewAt: toIsoDate(addDays(input.now, intervalDays)),
      lastReviewedAt: toIsoDate(input.now),
      lastResult: "correct",
      lastConfidence: confidence,
      lapses: base.lapses,
      totalReviews,
      correctReviews,
      incorrectReviews,
      isLeech: base.lapses >= LEECH_LAPSE_THRESHOLD,
      status,
    };
  },
};

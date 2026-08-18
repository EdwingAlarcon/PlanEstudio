"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Question } from "./quiz-engine";
import { toLocalDayKey } from "./review-date";
import {
  DEFAULT_EASE,
  sm2Scheduler,
  type ReviewCardState,
  type ReviewConfidence,
  type ReviewItemType,
} from "./review-scheduler";
import type { ReviewCardMap, ReviewSessionSize } from "./review-queue";

export const REVIEW_STORAGE_KEY = "planestudio.spaced-repetition.v1";
export const REVIEW_SCHEMA_VERSION = 1;

const VALID_ITEM_TYPES: ReviewItemType[] = ["quiz-question", "case-diagnosis"];
const VALID_STATUSES = ["new", "learning", "review", "relearning", "suspended"];
const VALID_CONFIDENCE: ReviewConfidence[] = ["again", "hard", "good", "easy"];
const VALID_SESSION_SIZES: ReviewSessionSize[] = ["corta", "normal", "larga"];
const MAX_DAY_LOGS = 90;

export interface ReviewDayLog {
  day: string; // "YYYY-MM-DD"
  reviewed: number;
  correct: number;
  incorrect: number;
  seconds: number;
  moduleIds: number[];
}

export interface ReviewState {
  schemaVersion: number;
  cards: ReviewCardMap;
  dayLogs: ReviewDayLog[];
  sessionSize: ReviewSessionSize;
}

interface ReviewActions {
  registerQuestionForReview: (question: Pick<Question, "id" | "moduleId" | "appliesTo">, isCorrect: boolean, now: Date) => void;
  reviewCard: (questionId: string, isCorrect: boolean, confidence: ReviewConfidence, now: Date, elapsedSeconds?: number) => void;
  setSessionSize: (size: ReviewSessionSize) => void;
  resetReviewProgress: () => void;
  importCards: (cards: ReviewCardMap, dayLogs: ReviewDayLog[], strategy: "merge" | "replace") => void;
}

const INITIAL_STATE: ReviewState = {
  schemaVersion: REVIEW_SCHEMA_VERSION,
  cards: {},
  dayLogs: [],
  sessionSize: "normal",
};

function itemTypeForQuestion(question: Pick<Question, "appliesTo">): ReviewItemType {
  return question.appliesTo === "caso" ? "case-diagnosis" : "quiz-question";
}

function sanitizeCard(value: unknown): ReviewCardState | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.questionId !== "string" || !raw.questionId) return null;
  if (typeof raw.moduleId !== "number" || !Number.isFinite(raw.moduleId)) return null;
  const itemType = typeof raw.itemType === "string" && (VALID_ITEM_TYPES as string[]).includes(raw.itemType)
    ? raw.itemType as ReviewItemType
    : "quiz-question";
  const status = typeof raw.status === "string" && VALID_STATUSES.includes(raw.status)
    ? raw.status as ReviewCardState["status"]
    : "new";
  const intervalDays = typeof raw.intervalDays === "number" && Number.isFinite(raw.intervalDays) && raw.intervalDays >= 0
    ? raw.intervalDays
    : 0;
  const easeFactor = typeof raw.easeFactor === "number" && Number.isFinite(raw.easeFactor) && raw.easeFactor >= 1.3 && raw.easeFactor <= 2.8
    ? raw.easeFactor
    : DEFAULT_EASE;
  const nextReviewAt = typeof raw.nextReviewAt === "string" && !Number.isNaN(Date.parse(raw.nextReviewAt))
    ? raw.nextReviewAt
    : "";
  const lapses = typeof raw.lapses === "number" && Number.isFinite(raw.lapses) && raw.lapses >= 0 ? raw.lapses : 0;
  const lastConfidence = typeof raw.lastConfidence === "string" && (VALID_CONFIDENCE as string[]).includes(raw.lastConfidence)
    ? raw.lastConfidence as ReviewConfidence
    : undefined;

  return {
    questionId: raw.questionId,
    moduleId: raw.moduleId,
    itemType,
    repetitions: typeof raw.repetitions === "number" && raw.repetitions >= 0 ? raw.repetitions : 0,
    intervalDays,
    easeFactor,
    nextReviewAt,
    lastReviewedAt: typeof raw.lastReviewedAt === "string" ? raw.lastReviewedAt : undefined,
    lastResult: raw.lastResult === "correct" || raw.lastResult === "incorrect" ? raw.lastResult : undefined,
    lastConfidence,
    lapses,
    totalReviews: typeof raw.totalReviews === "number" && raw.totalReviews >= 0 ? raw.totalReviews : 0,
    correctReviews: typeof raw.correctReviews === "number" && raw.correctReviews >= 0 ? raw.correctReviews : 0,
    incorrectReviews: typeof raw.incorrectReviews === "number" && raw.incorrectReviews >= 0 ? raw.incorrectReviews : 0,
    isLeech: Boolean(raw.isLeech),
    status,
  };
}

function sanitizeDayLog(value: unknown): ReviewDayLog | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw.day)) return null;
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0);
  return {
    day: raw.day,
    reviewed: num(raw.reviewed),
    correct: num(raw.correct),
    incorrect: num(raw.incorrect),
    seconds: num(raw.seconds),
    moduleIds: Array.isArray(raw.moduleIds) ? raw.moduleIds.filter((m): m is number => typeof m === "number") : [],
  };
}

export function sanitizeReviewState(value: unknown): ReviewState {
  if (!value || typeof value !== "object") return INITIAL_STATE;
  const raw = value as Record<string, unknown>;

  const cards: ReviewCardMap = {};
  if (raw.cards && typeof raw.cards === "object") {
    for (const [id, cardValue] of Object.entries(raw.cards as Record<string, unknown>)) {
      const sanitized = sanitizeCard(cardValue);
      if (sanitized && sanitized.questionId === id) cards[id] = sanitized;
    }
  }

  const dayLogs = Array.isArray(raw.dayLogs)
    ? raw.dayLogs.map(sanitizeDayLog).filter((log): log is ReviewDayLog => log !== null).slice(-MAX_DAY_LOGS)
    : [];

  const sessionSize = typeof raw.sessionSize === "string" && (VALID_SESSION_SIZES as string[]).includes(raw.sessionSize)
    ? raw.sessionSize as ReviewSessionSize
    : "normal";

  return { schemaVersion: REVIEW_SCHEMA_VERSION, cards, dayLogs, sessionSize };
}

function recordDayLog(dayLogs: ReviewDayLog[], now: Date, isCorrect: boolean, moduleId: number, elapsedSeconds: number): ReviewDayLog[] {
  const day = toLocalDayKey(now);
  const idx = dayLogs.findIndex((log) => log.day === day);
  if (idx === -1) {
    const next: ReviewDayLog = {
      day,
      reviewed: 1,
      correct: isCorrect ? 1 : 0,
      incorrect: isCorrect ? 0 : 1,
      seconds: elapsedSeconds,
      moduleIds: [moduleId],
    };
    return [...dayLogs, next].slice(-MAX_DAY_LOGS);
  }
  const existing = dayLogs[idx]!;
  const updated: ReviewDayLog = {
    ...existing,
    reviewed: existing.reviewed + 1,
    correct: existing.correct + (isCorrect ? 1 : 0),
    incorrect: existing.incorrect + (isCorrect ? 0 : 1),
    seconds: existing.seconds + elapsedSeconds,
    moduleIds: existing.moduleIds.includes(moduleId) ? existing.moduleIds : [...existing.moduleIds, moduleId],
  };
  return [...dayLogs.slice(0, idx), updated, ...dayLogs.slice(idx + 1)];
}

export const useReviewStore = create<ReviewState & ReviewActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      registerQuestionForReview: (question, isCorrect, now) =>
        set((state) => {
          const existing = state.cards[question.id] ?? null;
          const card = sm2Scheduler.schedule({
            card: existing,
            questionId: question.id,
            moduleId: question.moduleId,
            itemType: itemTypeForQuestion(question),
            isCorrect,
            confidence: isCorrect ? "good" : "again",
            now,
          });
          return {
            cards: { ...state.cards, [question.id]: card },
            dayLogs: recordDayLog(state.dayLogs, now, isCorrect, question.moduleId, 0),
          };
        }),

      reviewCard: (questionId, isCorrect, confidence, now, elapsedSeconds = 0) =>
        set((state) => {
          const existing = state.cards[questionId];
          if (!existing) return state;
          const card = sm2Scheduler.schedule({
            card: existing,
            questionId,
            moduleId: existing.moduleId,
            itemType: existing.itemType,
            isCorrect,
            confidence,
            now,
          });
          return {
            cards: { ...state.cards, [questionId]: card },
            dayLogs: recordDayLog(state.dayLogs, now, isCorrect, existing.moduleId, elapsedSeconds),
          };
        }),

      setSessionSize: (size) => set({ sessionSize: size }),

      resetReviewProgress: () => set(INITIAL_STATE),

      importCards: (cards, dayLogs, strategy) =>
        set((state) => {
          if (strategy === "replace") return { cards, dayLogs };
          const mergedCards = { ...state.cards };
          for (const [id, incoming] of Object.entries(cards)) {
            const local = mergedCards[id];
            mergedCards[id] = !local || (incoming.lastReviewedAt ?? "") > (local.lastReviewedAt ?? "")
              ? incoming
              : local;
          }
          const mergedLogsByDay = new Map(state.dayLogs.map((log) => [log.day, log]));
          for (const log of dayLogs) {
            const existing = mergedLogsByDay.get(log.day);
            mergedLogsByDay.set(log.day, existing
              ? {
                  day: log.day,
                  reviewed: existing.reviewed + log.reviewed,
                  correct: existing.correct + log.correct,
                  incorrect: existing.incorrect + log.incorrect,
                  seconds: existing.seconds + log.seconds,
                  moduleIds: [...new Set([...existing.moduleIds, ...log.moduleIds])],
                }
              : log);
          }
          return {
            cards: mergedCards,
            dayLogs: [...mergedLogsByDay.values()].sort((a, b) => a.day.localeCompare(b.day)).slice(-MAX_DAY_LOGS),
          };
        }),
    }),
    {
      name: REVIEW_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: REVIEW_SCHEMA_VERSION,
      migrate: (persisted) => sanitizeReviewState(persisted),
      merge: (persisted, current) => ({ ...current, ...sanitizeReviewState(persisted) }),
    }
  )
);

"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { InteractiveEvaluationResult, InteractivePracticeMastery } from "@/lib/interactive-practices";
import { calculateInteractiveMastery } from "@/lib/interactive-practices";

export const INTERACTIVE_PRACTICE_STORAGE_KEY = "planestudio.interactive-practice.v1";

export type InteractivePracticeStatus = "not-started" | "in-progress" | "completed";
export type InteractivePracticeEventType = "opened" | "attempted" | "completed" | "hint" | "solution" | "abandoned";

export interface InteractivePracticeEvent {
  type: InteractivePracticeEventType;
  at: string;
  score?: number;
  detail?: string;
}

export interface InteractivePracticeRecord {
  schemaVersion: 1;
  practiceId: string;
  status: InteractivePracticeStatus;
  mastery: InteractivePracticeMastery;
  startedAt?: string;
  lastActivityAt?: string;
  completedAt?: string;
  attemptCount: number;
  bestScore: number;
  lastScore: number;
  hintsUsed: string[];
  solutionRevealed: boolean;
  feedbackSeen: boolean;
  totalDurationSeconds: number;
  lastAnswer?: unknown;
  mode: "practice";
  events: InteractivePracticeEvent[];
}

interface InteractivePracticeProgressState {
  records: Record<string, InteractivePracticeRecord>;
  openPractice: (practiceId: string) => void;
  recordAttempt: (practiceId: string, result: InteractiveEvaluationResult, answer: unknown) => void;
  revealHint: (practiceId: string, hintId: string) => void;
  revealSolution: (practiceId: string) => void;
  markAbandoned: (practiceId: string) => void;
  resetPractice: (practiceId: string) => void;
  resetAllInteractivePractices: () => void;
}

export function createInteractivePracticeRecord(practiceId: string, now = new Date().toISOString()): InteractivePracticeRecord {
  return {
    schemaVersion: 1,
    practiceId,
    status: "not-started",
    mastery: "not-started",
    startedAt: now,
    lastActivityAt: now,
    attemptCount: 0,
    bestScore: 0,
    lastScore: 0,
    hintsUsed: [],
    solutionRevealed: false,
    feedbackSeen: false,
    totalDurationSeconds: 0,
    mode: "practice",
    events: [{ type: "opened", at: now }],
  };
}

function withRecord(records: Record<string, InteractivePracticeRecord>, practiceId: string): InteractivePracticeRecord {
  return records[practiceId] ?? createInteractivePracticeRecord(practiceId);
}

function appendEvent(record: InteractivePracticeRecord, event: InteractivePracticeEvent): InteractivePracticeRecord {
  return {
    ...record,
    lastActivityAt: event.at,
    events: [...record.events.slice(-29), event],
  };
}

export function summarizeInteractivePracticeProgress(records: Record<string, InteractivePracticeRecord>, practiceIds: string[]) {
  const scoped = practiceIds.map((id) => records[id]).filter(Boolean) as InteractivePracticeRecord[];
  const completed = scoped.filter((record) => record.status === "completed").length;
  const proficient = scoped.filter((record) => record.mastery === "proficient").length;
  const needsReview = scoped.filter((record) => record.mastery === "needs-review").length;
  const inProgress = scoped.filter((record) => record.status === "in-progress").length;
  const attempts = scoped.reduce((total, record) => total + record.attemptCount, 0);
  const bestScoreAverage = completed > 0
    ? Math.round(scoped.filter((record) => record.status === "completed").reduce((total, record) => total + record.bestScore, 0) / completed)
    : 0;

  return {
    total: practiceIds.length,
    completed,
    proficient,
    needsReview,
    inProgress,
    attempts,
    bestScoreAverage,
    percentage: practiceIds.length > 0 ? Math.round((completed / practiceIds.length) * 100) : 0,
  };
}

export const useInteractivePracticeProgressStore = create<InteractivePracticeProgressState>()(
  persist(
    (set) => ({
      records: {},
      openPractice: (practiceId) =>
        set((state) => {
          const now = new Date().toISOString();
          const current = withRecord(state.records, practiceId);
          const status = current.status === "not-started" ? "in-progress" : current.status;
          return {
            records: {
              ...state.records,
              [practiceId]: appendEvent({ ...current, status }, { type: "opened", at: now }),
            },
          };
        }),
      recordAttempt: (practiceId, result, answer) =>
        set((state) => {
          const now = new Date().toISOString();
          const current = withRecord(state.records, practiceId);
          const attemptCount = current.attemptCount + 1;
          const bestScore = Math.max(current.bestScore, result.score);
          const completed = result.status === "correct" || bestScore >= 80;
          const mastery = calculateInteractiveMastery({
            correct: completed,
            attempts: attemptCount,
            hintsUsed: current.hintsUsed.length,
            solutionRevealed: current.solutionRevealed,
          });
          const next = appendEvent(
            {
              ...current,
              status: completed ? "completed" : "in-progress",
              mastery,
              attemptCount,
              bestScore,
              lastScore: result.score,
              feedbackSeen: true,
              completedAt: completed ? current.completedAt ?? now : current.completedAt,
              lastAnswer: answer,
            },
            { type: completed ? "completed" : "attempted", at: now, score: result.score }
          );
          return { records: { ...state.records, [practiceId]: next } };
        }),
      revealHint: (practiceId, hintId) =>
        set((state) => {
          const now = new Date().toISOString();
          const current = withRecord(state.records, practiceId);
          const hintsUsed = current.hintsUsed.includes(hintId) ? current.hintsUsed : [...current.hintsUsed, hintId];
          return {
            records: {
              ...state.records,
              [practiceId]: appendEvent({ ...current, status: "in-progress", hintsUsed }, { type: "hint", at: now, detail: hintId }),
            },
          };
        }),
      revealSolution: (practiceId) =>
        set((state) => {
          const now = new Date().toISOString();
          const current = withRecord(state.records, practiceId);
          return {
            records: {
              ...state.records,
              [practiceId]: appendEvent({ ...current, solutionRevealed: true, mastery: "needs-review" }, { type: "solution", at: now }),
            },
          };
        }),
      markAbandoned: (practiceId) =>
        set((state) => {
          const now = new Date().toISOString();
          const current = withRecord(state.records, practiceId);
          return {
            records: {
              ...state.records,
              [practiceId]: appendEvent(current, { type: "abandoned", at: now }),
            },
          };
        }),
      resetPractice: (practiceId) =>
        set((state) => {
          const next = { ...state.records };
          delete next[practiceId];
          return { records: next };
        }),
      resetAllInteractivePractices: () => set({ records: {} }),
    }),
    {
      name: INTERACTIVE_PRACTICE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ records: state.records }),
    }
  )
);

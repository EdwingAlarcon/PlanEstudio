"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { InteractiveEvaluationResult, InteractivePracticeMastery } from "@/lib/interactive-practices";
import { calculateInteractiveMastery } from "@/lib/interactive-practices";

export const INTERACTIVE_PRACTICE_STORAGE_KEY = "planestudio.interactive-practice.v1";
export const INTERACTIVE_PRACTICE_EXPORT_SOURCE = "planestudio.interactive-practice";
export const INTERACTIVE_PRACTICE_EXPORT_SCHEMA_VERSION = 1;
export const MAX_INTERACTIVE_IMPORT_BYTES = 512_000;

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

export interface InteractivePracticeProgressExport {
  schemaVersion: 1;
  exportedAt: string;
  source: typeof INTERACTIVE_PRACTICE_EXPORT_SOURCE;
  practices: Record<string, InteractivePracticeRecord>;
}

export interface InteractivePracticeImportPreview {
  incoming: number;
  known: number;
  unknown: number;
  willAdd: number;
  willUpdate: number;
}

export type InteractivePracticeImportResult =
  | {
      ok: true;
      data: InteractivePracticeProgressExport;
      unknownPracticeIds: string[];
      preview: InteractivePracticeImportPreview;
    }
  | { ok: false; error: string };

interface InteractivePracticeProgressState {
  records: Record<string, InteractivePracticeRecord>;
  openPractice: (practiceId: string) => void;
  recordAttempt: (practiceId: string, result: InteractiveEvaluationResult, answer: unknown) => void;
  revealHint: (practiceId: string, hintId: string) => void;
  revealSolution: (practiceId: string) => void;
  markAbandoned: (practiceId: string) => void;
  resetPractice: (practiceId: string) => void;
  resetAllInteractivePractices: () => void;
  setInteractivePracticeRecords: (records: Record<string, InteractivePracticeRecord>) => void;
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

export function createInteractivePracticeProgressExport(
  records: Record<string, InteractivePracticeRecord>,
  practiceIds: string[],
  now = new Date().toISOString()
): InteractivePracticeProgressExport {
  const allowedIds = new Set(practiceIds);
  const scoped = Object.fromEntries(
    Object.entries(records)
      .filter(([id, record]) => allowedIds.has(id) && isInteractivePracticeRecord(record, id))
      .map(([id, record]) => [id, cloneRecord(record)])
  );
  return {
    schemaVersion: INTERACTIVE_PRACTICE_EXPORT_SCHEMA_VERSION,
    exportedAt: now,
    source: INTERACTIVE_PRACTICE_EXPORT_SOURCE,
    practices: scoped,
  };
}

export function parseInteractivePracticeImport(
  text: string,
  knownPracticeIds: string[],
  currentRecords: Record<string, InteractivePracticeRecord> = {}
): InteractivePracticeImportResult {
  if (new Blob([text]).size > MAX_INTERACTIVE_IMPORT_BYTES) {
    return { ok: false, error: "El archivo supera el tamaño máximo permitido para importar progreso interactivo." };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "El archivo no es JSON válido." };
  }

  if (!raw || typeof raw !== "object") return { ok: false, error: "El archivo no contiene un objeto de progreso válido." };
  const source = (raw as { source?: unknown }).source;
  if (source !== INTERACTIVE_PRACTICE_EXPORT_SOURCE) {
    return { ok: false, error: "El archivo no corresponde al progreso interactivo de PlanEstudio." };
  }

  const schemaVersion = (raw as { schemaVersion?: unknown }).schemaVersion;
  if (schemaVersion === 0) return migrateInteractivePracticeImport(raw, knownPracticeIds, currentRecords);
  if (schemaVersion !== INTERACTIVE_PRACTICE_EXPORT_SCHEMA_VERSION) {
    return { ok: false, error: "Este archivo fue creado por una versión más reciente de PlanEstudio." };
  }

  const practices = (raw as { practices?: unknown }).practices;
  if (!practices || typeof practices !== "object" || Array.isArray(practices)) {
    return { ok: false, error: "El archivo no incluye prácticas importables." };
  }

  return buildImportResult(practices as Record<string, unknown>, knownPracticeIds, currentRecords, (raw as { exportedAt?: unknown }).exportedAt);
}

export function mergeInteractivePracticeRecords(
  currentRecords: Record<string, InteractivePracticeRecord>,
  incomingRecords: Record<string, InteractivePracticeRecord>,
  knownPracticeIds: string[]
): Record<string, InteractivePracticeRecord> {
  const allowedIds = new Set(knownPracticeIds);
  const next = { ...currentRecords };
  for (const [id, incoming] of Object.entries(incomingRecords)) {
    if (!allowedIds.has(id) || !isInteractivePracticeRecord(incoming, id)) continue;
    const current = next[id];
    next[id] = current && isInteractivePracticeRecord(current, id) ? mergeRecord(current, incoming) : cloneRecord(incoming);
  }
  return next;
}

export function replaceInteractivePracticeRecords(
  incomingRecords: Record<string, InteractivePracticeRecord>,
  knownPracticeIds: string[]
): Record<string, InteractivePracticeRecord> {
  const allowedIds = new Set(knownPracticeIds);
  return Object.fromEntries(
    Object.entries(incomingRecords)
      .filter(([id, record]) => allowedIds.has(id) && isInteractivePracticeRecord(record, id))
      .map(([id, record]) => [id, cloneRecord(record)])
  );
}

export function getInteractivePracticeReviewQueue<T extends { id: string; level: "starter" | "junior" | "advanced" }>(
  practices: T[],
  records: Record<string, InteractivePracticeRecord>
): T[] {
  const levelRank = { starter: 0, junior: 1, advanced: 2 };
  return practices
    .filter((practice) => {
      const record = records[practice.id];
      if (!record) return false;
      return record.mastery === "needs-review" || record.solutionRevealed || record.attemptCount >= 2 || record.events.some((event) => event.type === "abandoned");
    })
    .sort((a, b) => {
      const recordA = records[a.id]!;
      const recordB = records[b.id]!;
      const priorityA = reviewPriority(recordA);
      const priorityB = reviewPriority(recordB);
      if (priorityA !== priorityB) return priorityB - priorityA;
      const dateA = Date.parse(recordA.lastActivityAt ?? recordA.startedAt ?? "") || 0;
      const dateB = Date.parse(recordB.lastActivityAt ?? recordB.startedAt ?? "") || 0;
      if (dateA !== dateB) return dateA - dateB;
      return levelRank[a.level] - levelRank[b.level];
    });
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
      setInteractivePracticeRecords: (records) => set({ records }),
    }),
    {
      name: INTERACTIVE_PRACTICE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ records: state.records }),
    }
  )
);

function migrateInteractivePracticeImport(
  raw: unknown,
  knownPracticeIds: string[],
  currentRecords: Record<string, InteractivePracticeRecord>
): InteractivePracticeImportResult {
  const practices = (raw as { practices?: unknown; records?: unknown }).practices ?? (raw as { records?: unknown }).records;
  if (!practices || typeof practices !== "object" || Array.isArray(practices)) {
    return { ok: false, error: "La versión anterior no incluye registros migrables." };
  }
  return buildImportResult(practices as Record<string, unknown>, knownPracticeIds, currentRecords, (raw as { exportedAt?: unknown }).exportedAt);
}

function buildImportResult(
  practices: Record<string, unknown>,
  knownPracticeIds: string[],
  currentRecords: Record<string, InteractivePracticeRecord>,
  exportedAt: unknown
): InteractivePracticeImportResult {
  const allowedIds = new Set(knownPracticeIds);
  const unknownPracticeIds = Object.keys(practices).filter((id) => !allowedIds.has(id));
  const validKnownRecords = Object.fromEntries(
    Object.entries(practices)
      .filter(([id, record]) => allowedIds.has(id) && isInteractivePracticeRecord(record, id))
      .map(([id, record]) => [id, cloneRecord(record as InteractivePracticeRecord)])
  );
  const invalidKnownCount = Object.entries(practices).filter(([id, record]) => allowedIds.has(id) && !isInteractivePracticeRecord(record, id)).length;
  if (Object.keys(validKnownRecords).length === 0 && invalidKnownCount > 0) {
    return { ok: false, error: "El archivo tiene campos faltantes o registros corruptos." };
  }
  return {
    ok: true,
    data: {
      schemaVersion: 1,
      exportedAt: typeof exportedAt === "string" ? exportedAt : new Date().toISOString(),
      source: INTERACTIVE_PRACTICE_EXPORT_SOURCE,
      practices: validKnownRecords,
    },
    unknownPracticeIds,
    preview: {
      incoming: Object.keys(practices).length,
      known: Object.keys(validKnownRecords).length,
      unknown: unknownPracticeIds.length,
      willAdd: Object.keys(validKnownRecords).filter((id) => !currentRecords[id]).length,
      willUpdate: Object.keys(validKnownRecords).filter((id) => Boolean(currentRecords[id])).length,
    },
  };
}

function isInteractivePracticeRecord(value: unknown, expectedId: string): value is InteractivePracticeRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<InteractivePracticeRecord>;
  return record.schemaVersion === 1 &&
    record.practiceId === expectedId &&
    ["not-started", "in-progress", "completed"].includes(record.status ?? "") &&
    ["not-started", "learning", "needs-review", "proficient"].includes(record.mastery ?? "") &&
    typeof record.attemptCount === "number" &&
    typeof record.bestScore === "number" &&
    typeof record.lastScore === "number" &&
    Array.isArray(record.hintsUsed) &&
    typeof record.solutionRevealed === "boolean" &&
    typeof record.feedbackSeen === "boolean" &&
    record.mode === "practice" &&
    Array.isArray(record.events);
}

function cloneRecord(record: InteractivePracticeRecord): InteractivePracticeRecord {
  return {
    ...record,
    hintsUsed: [...record.hintsUsed],
    events: record.events.slice(-30).map((event) => ({ ...event })),
  };
}

function mergeRecord(current: InteractivePracticeRecord, incoming: InteractivePracticeRecord): InteractivePracticeRecord {
  const lastActivityAt = latestIso(current.lastActivityAt, incoming.lastActivityAt) ?? current.lastActivityAt ?? incoming.lastActivityAt;
  const status = statusRank(incoming.status) > statusRank(current.status) ? incoming.status : current.status;
  const mastery = masteryRank(incoming.mastery) > masteryRank(current.mastery) ? incoming.mastery : current.mastery;
  const events = [...current.events, ...incoming.events]
    .filter((event) => event && typeof event.at === "string")
    .sort((a, b) => (Date.parse(a.at) || 0) - (Date.parse(b.at) || 0))
    .slice(-30);
  return {
    ...current,
    status,
    mastery,
    startedAt: earliestIso(current.startedAt, incoming.startedAt) ?? current.startedAt ?? incoming.startedAt,
    lastActivityAt,
    completedAt: earliestIso(current.completedAt, incoming.completedAt) ?? current.completedAt ?? incoming.completedAt,
    attemptCount: Math.max(current.attemptCount, incoming.attemptCount),
    bestScore: Math.max(current.bestScore, incoming.bestScore),
    lastScore: latestIso(current.lastActivityAt, incoming.lastActivityAt) === incoming.lastActivityAt ? incoming.lastScore : current.lastScore,
    hintsUsed: Array.from(new Set([...current.hintsUsed, ...incoming.hintsUsed])),
    solutionRevealed: current.solutionRevealed || incoming.solutionRevealed,
    feedbackSeen: current.feedbackSeen || incoming.feedbackSeen,
    totalDurationSeconds: Math.max(current.totalDurationSeconds, incoming.totalDurationSeconds),
    lastAnswer: latestIso(current.lastActivityAt, incoming.lastActivityAt) === incoming.lastActivityAt ? incoming.lastAnswer : current.lastAnswer,
    events,
  };
}

function masteryRank(mastery: InteractivePracticeMastery): number {
  return { "not-started": 0, "needs-review": 1, learning: 2, proficient: 3 }[mastery];
}

function statusRank(status: InteractivePracticeStatus): number {
  return { "not-started": 0, "in-progress": 1, completed: 2 }[status];
}

function latestIso(a?: string, b?: string): string | undefined {
  const timeA = Date.parse(a ?? "");
  const timeB = Date.parse(b ?? "");
  if (!Number.isFinite(timeA)) return Number.isFinite(timeB) ? b : undefined;
  if (!Number.isFinite(timeB)) return a;
  return timeB > timeA ? b : a;
}

function earliestIso(a?: string, b?: string): string | undefined {
  const timeA = Date.parse(a ?? "");
  const timeB = Date.parse(b ?? "");
  if (!Number.isFinite(timeA)) return Number.isFinite(timeB) ? b : undefined;
  if (!Number.isFinite(timeB)) return a;
  return timeB < timeA ? b : a;
}

function reviewPriority(record: InteractivePracticeRecord): number {
  if (record.mastery === "needs-review") return 4;
  if (record.solutionRevealed) return 3;
  if (record.attemptCount >= 2) return 2;
  if (record.events.some((event) => event.type === "abandoned")) return 1;
  return 0;
}

"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PracticeDomain, PracticeInfo } from "./practices";

export const PRACTICE_PROGRESS_STORAGE_KEY = "planestudio.practice-progress.v1";
export const PRACTICE_PROGRESS_SCHEMA_VERSION = 1;

export type PracticeStatus =
  | "not_started"
  | "in_progress"
  | "attempted"
  | "reviewed"
  | "completed"
  | "needs_reinforcement";

export type AssessmentLevel = "none" | "partial" | "adequate" | "solid" | "excellent";

export interface PracticeAssessmentCriterion {
  criterion: string;
  weight: number;
  level: AssessmentLevel;
  comment?: string;
}

export interface PracticeSelfAssessment {
  criteria: PracticeAssessmentCriterion[];
  criticalFailures: string[];
  score: number;
  satisfactory: boolean;
  recommendation: string;
  assessedAt: string;
}

export interface PracticeProgressRecord {
  practiceId: string;
  status: PracticeStatus;
  schemaVersion: number;
  firstStartedAt?: string;
  lastActivityAt?: string;
  completedAt?: string;
  attemptCount: number;
  revealedHints: string[];
  solutionViewed: boolean;
  evidenceChecklist: Record<string, boolean>;
  selfAssessment?: PracticeSelfAssessment;
  notes?: string;
}

export interface PracticeRecommendation {
  practiceId: string;
  slug: string;
  title: string;
  reason: string;
}

interface PracticeProgressState {
  records: Record<string, PracticeProgressRecord>;
}

interface PracticeProgressActions {
  getRecord: (practiceId: string, evidenceKeys?: string[]) => PracticeProgressRecord;
  startPractice: (practiceId: string, evidenceKeys?: string[]) => void;
  registerAttempt: (practiceId: string, evidenceKeys?: string[]) => void;
  revealHint: (practiceId: string, hintId: string, evidenceKeys?: string[]) => void;
  viewSolution: (practiceId: string, evidenceKeys?: string[]) => void;
  setEvidenceProduced: (practiceId: string, evidenceKey: string, produced: boolean, evidenceKeys?: string[]) => void;
  saveNotes: (practiceId: string, notes: string, evidenceKeys?: string[]) => void;
  clearNotes: (practiceId: string, evidenceKeys?: string[]) => void;
  saveSelfAssessment: (practiceId: string, assessment: PracticeSelfAssessment, evidenceKeys?: string[]) => void;
  completePractice: (practiceId: string, evidenceKeys: string[]) => boolean;
  markNeedsReinforcement: (practiceId: string, evidenceKeys?: string[]) => void;
  resetPractice: (practiceId: string) => void;
  resetAllPracticeProgress: () => void;
  exportPracticeProgress: () => string;
}

const STATUS_LABELS: Record<PracticeStatus, string> = {
  not_started: "No iniciada",
  in_progress: "En progreso",
  attempted: "Intentada",
  reviewed: "Revisada",
  completed: "Completada",
  needs_reinforcement: "Requiere refuerzo",
};

const ASSESSMENT_MULTIPLIER: Record<AssessmentLevel, number> = {
  none: 0,
  partial: 0.4,
  adequate: 0.7,
  solid: 0.85,
  excellent: 1,
};

export const CRITICAL_FAILURE_OPTIONS = [
  "Otorgué privilegios excesivos",
  "Modifiqué producción directamente",
  "Omití pruebas o regresión",
  "No contemplé rollback",
  "Incluí o ignoré datos sensibles",
  "Cerré sin validación mínima",
];

export function getPracticeStatusLabel(status: PracticeStatus): string {
  return STATUS_LABELS[status];
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createPracticeRecord(practiceId: string, evidenceKeys: string[] = []): PracticeProgressRecord {
  return {
    practiceId,
    status: "not_started",
    schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
    attemptCount: 0,
    revealedHints: [],
    solutionViewed: false,
    evidenceChecklist: Object.fromEntries(evidenceKeys.map((key) => [key, false])),
    notes: "",
  };
}

function ensureEvidence(record: PracticeProgressRecord, evidenceKeys: string[] = []): PracticeProgressRecord {
  if (evidenceKeys.length === 0) return record;
  const nextChecklist = { ...record.evidenceChecklist };
  for (const key of evidenceKeys) {
    if (typeof nextChecklist[key] !== "boolean") nextChecklist[key] = false;
  }
  return { ...record, evidenceChecklist: nextChecklist };
}

export function transitionPracticeStatus(current: PracticeStatus, next: PracticeStatus): PracticeStatus {
  const allowed: Record<PracticeStatus, PracticeStatus[]> = {
    not_started: ["in_progress"],
    in_progress: ["attempted", "needs_reinforcement"],
    attempted: ["reviewed", "needs_reinforcement"],
    reviewed: ["completed", "needs_reinforcement"],
    completed: ["needs_reinforcement", "in_progress"],
    needs_reinforcement: ["in_progress", "attempted"],
  };
  if (current === next || allowed[current].includes(next)) return next;
  return current;
}

export function buildSelfAssessment(
  rubric: { criterion: string; weight: number }[],
  levels: Record<string, AssessmentLevel>,
  comments: Record<string, string> = {},
  criticalFailures: string[] = []
): PracticeSelfAssessment {
  const criteria = rubric.map((item) => ({
    criterion: item.criterion,
    weight: item.weight,
    level: levels[item.criterion] ?? "none",
    comment: comments[item.criterion]?.trim() || undefined,
  }));
  const score = Math.round(criteria.reduce((sum, item) => sum + item.weight * ASSESSMENT_MULTIPLIER[item.level], 0));
  const weakCriteria = criteria.filter((item) => item.level === "none" || item.level === "partial").map((item) => item.criterion);
  const satisfactory = score >= 70 && criticalFailures.length === 0 && weakCriteria.length === 0;
  const recommendation = criticalFailures.length > 0
    ? "Requiere refuerzo: hay fallos críticos que impiden considerar satisfactoria la práctica."
    : score >= 85
      ? "Resultado sólido. Repite sin pistas o defiende decisiones con otra persona."
      : score >= 70
        ? "Resolución funcional, pero conviene reforzar criterios débiles antes de cerrar."
        : "Requiere refuerzo antes de marcar la práctica como completada.";

  return {
    criteria,
    criticalFailures: [...new Set(criticalFailures)],
    score,
    satisfactory,
    recommendation,
    assessedAt: nowIso(),
  };
}

export function canCompletePractice(record: PracticeProgressRecord, evidenceKeys: string[]): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (record.attemptCount < 1) missing.push("registrar un intento");
  if (!record.selfAssessment) missing.push("guardar la autoevaluación");
  if (record.selfAssessment && !record.selfAssessment.satisfactory) missing.push("resolver refuerzos de rúbrica");
  const pendingEvidence = evidenceKeys.filter((key) => record.evidenceChecklist[key] !== true);
  if (pendingEvidence.length > 0) missing.push("marcar evidencias producidas");
  return { ok: missing.length === 0, missing };
}

function sanitizeRecord(value: unknown): PracticeProgressRecord | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const practiceId = typeof raw.practiceId === "string" && raw.practiceId.trim() ? raw.practiceId.trim() : null;
  if (!practiceId) return null;
  const status = typeof raw.status === "string" && raw.status in STATUS_LABELS ? raw.status as PracticeStatus : "not_started";
  const checklist = raw.evidenceChecklist && typeof raw.evidenceChecklist === "object"
    ? Object.fromEntries(Object.entries(raw.evidenceChecklist as Record<string, unknown>).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"))
    : {};
  return {
    practiceId,
    status,
    schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
    firstStartedAt: typeof raw.firstStartedAt === "string" ? raw.firstStartedAt : undefined,
    lastActivityAt: typeof raw.lastActivityAt === "string" ? raw.lastActivityAt : undefined,
    completedAt: typeof raw.completedAt === "string" ? raw.completedAt : undefined,
    attemptCount: Number.isFinite(Number(raw.attemptCount)) ? Math.max(0, Math.floor(Number(raw.attemptCount))) : 0,
    revealedHints: Array.isArray(raw.revealedHints) ? raw.revealedHints.filter((h): h is string => typeof h === "string") : [],
    solutionViewed: raw.solutionViewed === true,
    evidenceChecklist: checklist,
    selfAssessment: raw.selfAssessment && typeof raw.selfAssessment === "object" ? raw.selfAssessment as PracticeSelfAssessment : undefined,
    notes: typeof raw.notes === "string" ? raw.notes.slice(0, 8000) : "",
  };
}

export function sanitizePracticeProgressState(value: unknown): PracticeProgressState {
  if (!value || typeof value !== "object") return { records: {} };
  const raw = value as Record<string, unknown>;
  const source = raw.records && typeof raw.records === "object" ? raw.records as Record<string, unknown> : {};
  const records: Record<string, PracticeProgressRecord> = {};
  for (const item of Object.values(source)) {
    const record = sanitizeRecord(item);
    if (record) records[record.practiceId] = record;
  }
  return { records };
}

function patchRecord(
  state: PracticeProgressState,
  practiceId: string,
  evidenceKeys: string[] | undefined,
  updater: (record: PracticeProgressRecord, timestamp: string) => PracticeProgressRecord
): PracticeProgressState {
  const base = ensureEvidence(state.records[practiceId] ?? createPracticeRecord(practiceId, evidenceKeys), evidenceKeys);
  const next = updater(base, nowIso());
  return { records: { ...state.records, [practiceId]: next } };
}

export function calculatePracticeCounts(records: Record<string, PracticeProgressRecord>) {
  const values = Object.values(records);
  return {
    started: values.filter((r) => r.status !== "not_started").length,
    attempted: values.filter((r) => r.attemptCount > 0).length,
    reviewed: values.filter((r) => r.solutionViewed || r.status === "reviewed" || r.status === "completed").length,
    completed: values.filter((r) => r.status === "completed").length,
    needsReinforcement: values.filter((r) => r.status === "needs_reinforcement").length,
    completedWithoutHints: values.filter((r) => r.status === "completed" && r.revealedHints.length === 0).length,
    completedWithHints: values.filter((r) => r.status === "completed" && r.revealedHints.length > 0).length,
  };
}

export function getRecommendedPractice(
  practices: Array<Pick<PracticeInfo, "id" | "slug" | "title" | "prerequisites" | "domain" | "practiceType">>,
  records: Record<string, PracticeProgressRecord>,
  completedModuleIds: string[] = []
): PracticeRecommendation | null {
  const completedNumeric = new Set(completedModuleIds.map((id) => Number(id.split("-").pop())).filter(Number.isFinite));
  const byId = new Map(practices.map((practice) => [practice.id, practice]));
  const pick = (status: PracticeStatus, reason: string) => {
    const record = Object.values(records)
      .filter((item) => item.status === status)
      .sort((a, b) => (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? ""))[0];
    const practice = record ? byId.get(record.practiceId) : undefined;
    return practice ? { practiceId: practice.id, slug: practice.slug, title: practice.title, reason } : null;
  };
  const inProgress = pick("in_progress", "Continúa la práctica que ya está en progreso.");
  if (inProgress) return inProgress;
  const reinforcement = pick("needs_reinforcement", "Retoma una práctica marcada para refuerzo.");
  if (reinforcement) return reinforcement;
  const eligible = practices.find((practice) =>
    !records[practice.id] && practice.prerequisites.modules.some((moduleId) => completedNumeric.has(moduleId))
  );
  if (eligible) return { practiceId: eligible.id, slug: eligible.slug, title: eligible.title, reason: "Sugerida por prerrequisitos académicos ya completados." };
  const next = practices.find((practice) => !records[practice.id]) ?? practices[0];
  return next ? { practiceId: next.id, slug: next.slug, title: next.title, reason: "Primera práctica disponible del piloto profesional." } : null;
}

export function summarizeByDomain(
  practices: Array<Pick<PracticeInfo, "id" | "domain">>,
  records: Record<string, PracticeProgressRecord>
): Record<PracticeDomain, { total: number; started: number; completed: number }> {
  return practices.reduce((acc, practice) => {
    const current = acc[practice.domain] ?? { total: 0, started: 0, completed: 0 };
    const record = records[practice.id];
    acc[practice.domain] = {
      total: current.total + 1,
      started: current.started + (record && record.status !== "not_started" ? 1 : 0),
      completed: current.completed + (record?.status === "completed" ? 1 : 0),
    };
    return acc;
  }, {} as Record<PracticeDomain, { total: number; started: number; completed: number }>);
}

const INITIAL_STATE: PracticeProgressState = { records: {} };

export const usePracticeProgressStore = create<PracticeProgressState & PracticeProgressActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      getRecord: (practiceId, evidenceKeys) => ensureEvidence(get().records[practiceId] ?? createPracticeRecord(practiceId, evidenceKeys), evidenceKeys),
      startPractice: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: record.status === "not_started" ? "in_progress" : transitionPracticeStatus(record.status, "in_progress"),
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        completedAt: record.status === "completed" ? undefined : record.completedAt,
      }))),
      registerAttempt: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: transitionPracticeStatus(record.status === "not_started" ? "in_progress" : record.status, "attempted"),
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        completedAt: undefined,
        attemptCount: record.attemptCount + 1,
      }))),
      revealHint: (practiceId, hintId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        revealedHints: record.revealedHints.includes(hintId) ? record.revealedHints : [...record.revealedHints, hintId],
      }))),
      viewSolution: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: transitionPracticeStatus(record.status === "not_started" ? "in_progress" : record.status, "reviewed"),
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        solutionViewed: true,
      }))),
      setEvidenceProduced: (practiceId, evidenceKey, produced, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        evidenceChecklist: { ...record.evidenceChecklist, [evidenceKey]: produced },
      }))),
      saveNotes: (practiceId, notes, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        notes: notes.slice(0, 8000),
      }))),
      clearNotes: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        lastActivityAt: timestamp,
        notes: "",
      }))),
      saveSelfAssessment: (practiceId, assessment, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        selfAssessment: assessment,
      }))),
      completePractice: (practiceId, evidenceKeys) => {
        const record = ensureEvidence(get().records[practiceId] ?? createPracticeRecord(practiceId, evidenceKeys), evidenceKeys);
        if (!canCompletePractice(record, evidenceKeys).ok) return false;
        set((state) => patchRecord(state, practiceId, evidenceKeys, (current, timestamp) => ({
          ...current,
          status: "completed",
          firstStartedAt: current.firstStartedAt ?? timestamp,
          lastActivityAt: timestamp,
          completedAt: timestamp,
        })));
        return true;
      },
      markNeedsReinforcement: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...record,
        status: "needs_reinforcement",
        lastActivityAt: timestamp,
        completedAt: undefined,
      }))),
      resetPractice: (practiceId) => set((state) => {
        const next = { ...state.records };
        delete next[practiceId];
        return { records: next };
      }),
      resetAllPracticeProgress: () => set(INITIAL_STATE),
      exportPracticeProgress: () => JSON.stringify({
        schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
        exportedAt: nowIso(),
        records: get().records,
      }, null, 2),
    }),
    {
      name: PRACTICE_PROGRESS_STORAGE_KEY,
      version: PRACTICE_PROGRESS_SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted) => sanitizePracticeProgressState(persisted),
      merge: (persisted, current) => ({ ...current, ...sanitizePracticeProgressState(persisted) }),
    }
  )
);

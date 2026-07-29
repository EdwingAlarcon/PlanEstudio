"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PracticeDomain, PracticeInfo } from "./practices";

export const PRACTICE_PROGRESS_STORAGE_KEY = "planestudio.practice-progress.v1";
export const PRACTICE_PROGRESS_SCHEMA_VERSION = 2;

export type PracticeStatus =
  | "not_started"
  | "in_progress"
  | "attempted"
  | "reviewed"
  | "completed"
  | "needs_reinforcement";

export type AssessmentLevel = "none" | "partial" | "adequate" | "solid" | "excellent";
export type PracticeAttemptStatus = "active" | "submitted" | "reviewed" | "completed" | "abandoned";
export type PracticeValidationStatus =
  | "unvalidated"
  | "self_assessed"
  | "evidence_prepared"
  | "sent_for_review"
  | "externally_reviewed"
  | "sandbox_validated";
export type ExternalPracticeReviewResult =
  | "pending"
  | "reviewed"
  | "approved"
  | "approved_with_observations"
  | "requires_adjustments"
  | "not_approved";

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

export interface ExternalPracticeReview {
  id: string;
  practiceId: string;
  attemptId: string;
  reviewedAt: string;
  reviewerAlias: string;
  reviewerType: "mentor" | "peer" | "lead" | "instructor" | "other";
  result: ExternalPracticeReviewResult;
  criterionScores: Record<string, AssessmentLevel>;
  criticalFailures: string[];
  comments: string;
  strengths: string;
  improvements: string;
  requiresResubmission: boolean;
  status: "draft" | "final";
  source: "manual" | "imported";
  schemaVersion: number;
}

export interface PracticeAttempt {
  id: string;
  attemptNumber: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  status: PracticeAttemptStatus;
  revealedHintIds: string[];
  solutionViewed: boolean;
  evidenceChecklist: Record<string, boolean>;
  selfAssessment?: PracticeSelfAssessment;
  score?: number;
  criticalFailures: string[];
  reflection?: string;
  result?: string;
  externalReview?: ExternalPracticeReview;
  schemaVersion: number;
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
  validationStatus: PracticeValidationStatus;
  activeAttemptId?: string;
  attempts: PracticeAttempt[];
  externalReviews: ExternalPracticeReview[];
  archived?: boolean;
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
  importPracticeProgress: (records: Record<string, PracticeProgressRecord>) => void;
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

const VALIDATION_LABELS: Record<PracticeValidationStatus, string> = {
  unvalidated: "Sin validar",
  self_assessed: "Autoevaluada",
  evidence_prepared: "Evidencia preparada",
  sent_for_review: "Enviada a revisión",
  externally_reviewed: "Revisada externamente",
  sandbox_validated: "Validada en sandbox",
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

export function getPracticeValidationStatusLabel(status: PracticeValidationStatus): string {
  return VALIDATION_LABELS[status];
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  const random = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
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
    validationStatus: "unvalidated",
    attempts: [],
    externalReviews: [],
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

function getActiveAttempt(record: PracticeProgressRecord): PracticeAttempt | undefined {
  return record.attempts.find((attempt) => attempt.id === record.activeAttemptId && attempt.status === "active")
    ?? record.attempts.find((attempt) => attempt.status === "active");
}

function syncAttemptAggregate(record: PracticeProgressRecord, attempt: PracticeAttempt): PracticeProgressRecord {
  const validationStatus: PracticeValidationStatus = attempt.externalReview
    ? "externally_reviewed"
    : attempt.selfAssessment
      ? "self_assessed"
      : record.validationStatus;

  return {
    ...record,
    activeAttemptId: attempt.status === "active" ? attempt.id : record.activeAttemptId,
    revealedHints: attempt.revealedHintIds,
    solutionViewed: attempt.solutionViewed,
    evidenceChecklist: attempt.evidenceChecklist,
    selfAssessment: attempt.selfAssessment,
    notes: attempt.reflection ?? record.notes ?? "",
    validationStatus,
  };
}

function createAttempt(record: PracticeProgressRecord, timestamp: string, evidenceKeys: string[] = []): PracticeAttempt {
  return {
    id: newId(`attempt-${record.practiceId.toLowerCase()}`),
    attemptNumber: record.attempts.length + 1,
    startedAt: timestamp,
    updatedAt: timestamp,
    status: "active",
    revealedHintIds: [],
    solutionViewed: false,
    evidenceChecklist: Object.fromEntries(evidenceKeys.map((key) => [key, false])),
    criticalFailures: [],
    reflection: "",
    schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
  };
}

function ensureActiveAttempt(record: PracticeProgressRecord, timestamp: string, evidenceKeys: string[] = []): PracticeProgressRecord {
  const active = getActiveAttempt(record);
  if (active) return syncAttemptAggregate(record, ensureAttemptEvidence(active, evidenceKeys));
  const attempt = createAttempt(record, timestamp, evidenceKeys);
  return syncAttemptAggregate({
    ...record,
    attempts: [...record.attempts, attempt],
    activeAttemptId: attempt.id,
    attemptCount: Math.max(record.attemptCount, attempt.attemptNumber),
  }, attempt);
}

function ensureAttemptEvidence(attempt: PracticeAttempt, evidenceKeys: string[] = []): PracticeAttempt {
  if (evidenceKeys.length === 0) return attempt;
  const next = { ...attempt.evidenceChecklist };
  for (const key of evidenceKeys) {
    if (typeof next[key] !== "boolean") next[key] = false;
  }
  return { ...attempt, evidenceChecklist: next };
}

function updateActiveAttempt(
  record: PracticeProgressRecord,
  timestamp: string,
  evidenceKeys: string[] | undefined,
  updater: (attempt: PracticeAttempt) => PracticeAttempt
): PracticeProgressRecord {
  const withAttempt = ensureActiveAttempt(record, timestamp, evidenceKeys);
  const active = getActiveAttempt(withAttempt);
  if (!active) return withAttempt;
  const updated = { ...updater(ensureAttemptEvidence(active, evidenceKeys)), updatedAt: timestamp };
  const attempts = withAttempt.attempts.map((attempt) => attempt.id === updated.id ? updated : attempt);
  return syncAttemptAggregate({ ...withAttempt, attempts, activeAttemptId: updated.status === "active" ? updated.id : undefined }, updated);
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
  const attempts = sanitizeAttempts(raw.attempts, practiceId, checklist);
  if (attempts.length === 0 && Number(raw.attemptCount ?? 0) > 0) {
    const timestamp = typeof raw.lastActivityAt === "string" ? raw.lastActivityAt : nowIso();
    attempts.push({
      id: `attempt-${practiceId.toLowerCase()}-legacy-1`,
      attemptNumber: 1,
      startedAt: typeof raw.firstStartedAt === "string" ? raw.firstStartedAt : timestamp,
      updatedAt: timestamp,
      completedAt: typeof raw.completedAt === "string" ? raw.completedAt : undefined,
      status: raw.status === "completed" ? "completed" : "submitted",
      revealedHintIds: Array.isArray(raw.revealedHints) ? raw.revealedHints.filter((h): h is string => typeof h === "string") : [],
      solutionViewed: raw.solutionViewed === true,
      evidenceChecklist: checklist,
      selfAssessment: raw.selfAssessment && typeof raw.selfAssessment === "object" ? raw.selfAssessment as PracticeSelfAssessment : undefined,
      score: raw.selfAssessment && typeof raw.selfAssessment === "object" ? (raw.selfAssessment as PracticeSelfAssessment).score : undefined,
      criticalFailures: raw.selfAssessment && typeof raw.selfAssessment === "object" ? (raw.selfAssessment as PracticeSelfAssessment).criticalFailures : [],
      reflection: typeof raw.notes === "string" ? raw.notes.slice(0, 8000) : "",
      schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
    });
  }
  const sortedAttempts = attempts.sort((a, b) => a.attemptNumber - b.attemptNumber);
  const latestAttempt = sortedAttempts.at(-1);
  const externalReviews = sanitizeReviews(raw.externalReviews, practiceId, attempts);
  const validationStatus = typeof raw.validationStatus === "string" && raw.validationStatus in VALIDATION_LABELS
    ? raw.validationStatus as PracticeValidationStatus
    : raw.selfAssessment ? "self_assessed" : "unvalidated";

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
    validationStatus,
    activeAttemptId: typeof raw.activeAttemptId === "string" ? raw.activeAttemptId : latestAttempt?.status === "active" ? latestAttempt.id : undefined,
    attempts: sortedAttempts,
    externalReviews,
    archived: raw.archived === true,
  };
}

function sanitizeAttempts(value: unknown, practiceId: string, fallbackEvidence: Record<string, boolean>): PracticeAttempt[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const raw = item as Record<string, unknown>;
    const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : `attempt-${practiceId.toLowerCase()}-legacy-${index + 1}`;
    if (seen.has(id)) return [];
    seen.add(id);
    const attemptNumber = Number.isInteger(Number(raw.attemptNumber)) ? Math.max(1, Number(raw.attemptNumber)) : index + 1;
    const startedAt = typeof raw.startedAt === "string" ? raw.startedAt : typeof raw.updatedAt === "string" ? raw.updatedAt : nowIso();
    const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : startedAt;
    const status = typeof raw.status === "string" && ["active", "submitted", "reviewed", "completed", "abandoned"].includes(raw.status)
      ? raw.status as PracticeAttemptStatus
      : "submitted";
    const evidenceChecklist = raw.evidenceChecklist && typeof raw.evidenceChecklist === "object"
      ? Object.fromEntries(Object.entries(raw.evidenceChecklist as Record<string, unknown>).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"))
      : fallbackEvidence;
    const selfAssessment = raw.selfAssessment && typeof raw.selfAssessment === "object" ? raw.selfAssessment as PracticeSelfAssessment : undefined;
    return [{
      id,
      attemptNumber,
      startedAt,
      updatedAt,
      completedAt: typeof raw.completedAt === "string" ? raw.completedAt : undefined,
      status,
      revealedHintIds: Array.isArray(raw.revealedHintIds) ? raw.revealedHintIds.filter((h): h is string => typeof h === "string") : [],
      solutionViewed: raw.solutionViewed === true,
      evidenceChecklist,
      selfAssessment,
      score: Number.isFinite(Number(raw.score)) ? Number(raw.score) : selfAssessment?.score,
      criticalFailures: Array.isArray(raw.criticalFailures) ? raw.criticalFailures.filter((h): h is string => typeof h === "string") : selfAssessment?.criticalFailures ?? [],
      reflection: typeof raw.reflection === "string" ? raw.reflection.slice(0, 8000) : "",
      result: typeof raw.result === "string" ? raw.result.slice(0, 500) : undefined,
      externalReview: raw.externalReview && typeof raw.externalReview === "object" ? raw.externalReview as ExternalPracticeReview : undefined,
      schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
    }];
  }).sort((a, b) => a.attemptNumber - b.attemptNumber);
}

function sanitizeReviews(value: unknown, practiceId: string, attempts: PracticeAttempt[]): ExternalPracticeReview[] {
  if (!Array.isArray(value)) return [];
  const attemptIds = new Set(attempts.map((attempt) => attempt.id));
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const raw = item as Record<string, unknown>;
    if (typeof raw.id !== "string" || typeof raw.attemptId !== "string" || !attemptIds.has(raw.attemptId)) return [];
    return [{
      id: raw.id,
      practiceId,
      attemptId: raw.attemptId,
      reviewedAt: typeof raw.reviewedAt === "string" ? raw.reviewedAt : nowIso(),
      reviewerAlias: typeof raw.reviewerAlias === "string" ? raw.reviewerAlias.slice(0, 120) : "Revisor",
      reviewerType: ["mentor", "peer", "lead", "instructor", "other"].includes(String(raw.reviewerType)) ? raw.reviewerType as ExternalPracticeReview["reviewerType"] : "other",
      result: ["pending", "reviewed", "approved", "approved_with_observations", "requires_adjustments", "not_approved"].includes(String(raw.result)) ? raw.result as ExternalPracticeReviewResult : "reviewed",
      criterionScores: raw.criterionScores && typeof raw.criterionScores === "object" ? raw.criterionScores as Record<string, AssessmentLevel> : {},
      criticalFailures: Array.isArray(raw.criticalFailures) ? raw.criticalFailures.filter((v): v is string => typeof v === "string") : [],
      comments: typeof raw.comments === "string" ? raw.comments.slice(0, 4000) : "",
      strengths: typeof raw.strengths === "string" ? raw.strengths.slice(0, 2000) : "",
      improvements: typeof raw.improvements === "string" ? raw.improvements.slice(0, 2000) : "",
      requiresResubmission: raw.requiresResubmission === true,
      status: raw.status === "draft" ? "draft" : "final",
      source: raw.source === "imported" ? "imported" : "manual",
      schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
    }];
  });
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
    multiAttempt: values.filter((r) => r.attempts.length > 1).length,
    improved: values.filter((r) => compareLatestAttempts(r).improved.length > 0).length,
    externallyReviewed: values.filter((r) => r.validationStatus === "externally_reviewed").length,
    evidencePrepared: values.filter((r) => r.validationStatus === "evidence_prepared").length,
    sandboxValidated: values.filter((r) => r.validationStatus === "sandbox_validated").length,
  };
}

export function compareLatestAttempts(record: PracticeProgressRecord) {
  const assessed = record.attempts.filter((attempt) => attempt.selfAssessment).sort((a, b) => a.attemptNumber - b.attemptNumber);
  const previous = assessed.at(-2);
  const current = assessed.at(-1);
  if (!previous || !current || !previous.selfAssessment || !current.selfAssessment) {
    return { previous, current, improved: [] as string[], worsened: [] as string[], unchanged: [] as string[], scoreDelta: 0 };
  }
  const previousLevels = new Map(previous.selfAssessment.criteria.map((item) => [item.criterion, ASSESSMENT_MULTIPLIER[item.level]]));
  const improved: string[] = [];
  const worsened: string[] = [];
  const unchanged: string[] = [];
  for (const criterion of current.selfAssessment.criteria) {
    const before = previousLevels.get(criterion.criterion) ?? 0;
    const after = ASSESSMENT_MULTIPLIER[criterion.level];
    if (after > before) improved.push(criterion.criterion);
    else if (after < before) worsened.push(criterion.criterion);
    else unchanged.push(criterion.criterion);
  }
  return { previous, current, improved, worsened, unchanged, scoreDelta: current.selfAssessment.score - previous.selfAssessment.score };
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
        ...ensureActiveAttempt(record, timestamp, evidenceKeys),
        status: record.status === "not_started" ? "in_progress" : transitionPracticeStatus(record.status, "in_progress"),
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        completedAt: record.status === "completed" ? undefined : record.completedAt,
      }))),
      registerAttempt: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => {
        const closedAttempts = record.attempts.map((attempt) => attempt.status === "active" ? { ...attempt, status: "submitted" as const, completedAt: attempt.completedAt ?? timestamp, updatedAt: timestamp } : attempt);
        const attempt = createAttempt({ ...record, attempts: closedAttempts }, timestamp, evidenceKeys);
        return {
          ...syncAttemptAggregate({ ...record, attempts: [...closedAttempts, attempt], activeAttemptId: attempt.id }, attempt),
          status: transitionPracticeStatus(record.status === "not_started" ? "in_progress" : record.status, "attempted"),
          firstStartedAt: record.firstStartedAt ?? timestamp,
          lastActivityAt: timestamp,
          completedAt: undefined,
          attemptCount: closedAttempts.length + 1,
        };
      })),
      revealHint: (practiceId, hintId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...updateActiveAttempt(record, timestamp, evidenceKeys, (attempt) => ({
          ...attempt,
          revealedHintIds: attempt.revealedHintIds.includes(hintId) ? attempt.revealedHintIds : [...attempt.revealedHintIds, hintId],
        })),
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
      }))),
      viewSolution: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...updateActiveAttempt(record, timestamp, evidenceKeys, (attempt) => ({ ...attempt, solutionViewed: true })),
        status: transitionPracticeStatus(record.status === "not_started" ? "in_progress" : record.status, "reviewed"),
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        solutionViewed: true,
      }))),
      setEvidenceProduced: (practiceId, evidenceKey, produced, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...updateActiveAttempt(record, timestamp, evidenceKeys, (attempt) => ({
          ...attempt,
          evidenceChecklist: { ...attempt.evidenceChecklist, [evidenceKey]: produced },
        })),
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
      }))),
      saveNotes: (practiceId, notes, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...updateActiveAttempt(record, timestamp, evidenceKeys, (attempt) => ({ ...attempt, reflection: notes.slice(0, 8000) })),
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        notes: notes.slice(0, 8000),
      }))),
      clearNotes: (practiceId, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...updateActiveAttempt(record, timestamp, evidenceKeys, (attempt) => ({ ...attempt, reflection: "" })),
        lastActivityAt: timestamp,
        notes: "",
      }))),
      saveSelfAssessment: (practiceId, assessment, evidenceKeys) => set((state) => patchRecord(state, practiceId, evidenceKeys, (record, timestamp) => ({
        ...updateActiveAttempt(record, timestamp, evidenceKeys, (attempt) => ({ ...attempt, selfAssessment: assessment, score: assessment.score, criticalFailures: assessment.criticalFailures })),
        status: record.status === "not_started" ? "in_progress" : record.status,
        firstStartedAt: record.firstStartedAt ?? timestamp,
        lastActivityAt: timestamp,
        selfAssessment: assessment,
        validationStatus: "self_assessed",
      }))),
      completePractice: (practiceId, evidenceKeys) => {
        const record = ensureEvidence(get().records[practiceId] ?? createPracticeRecord(practiceId, evidenceKeys), evidenceKeys);
        if (!canCompletePractice(record, evidenceKeys).ok) return false;
        set((state) => patchRecord(state, practiceId, evidenceKeys, (current, timestamp) => ({
          ...updateActiveAttempt(current, timestamp, evidenceKeys, (attempt) => ({ ...attempt, status: "completed", completedAt: timestamp })),
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
        format: "planestudio-practice-progress",
        schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
        exportedAt: nowIso(),
        product: "PlanEstudio",
        records: get().records,
      }, null, 2),
      importPracticeProgress: (records) => set({ records }),
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

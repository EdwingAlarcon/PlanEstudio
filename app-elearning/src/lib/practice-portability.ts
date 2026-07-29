import type { PracticeInfo } from "./practices";
import {
  PRACTICE_PROGRESS_SCHEMA_VERSION,
  sanitizePracticeProgressState,
  type AssessmentLevel,
  type ExternalPracticeReview,
  type PracticeAttempt,
  type PracticeProgressRecord,
} from "./practice-progress";

export const PRACTICE_EXPORT_FORMAT = "planestudio-practice-progress";
export const PRACTICE_REVIEW_FORMAT = "planestudio-practice-review";
export const EXTERNAL_REVIEW_FORMAT = "planestudio-external-review";
export const PRACTICE_EVIDENCE_FORMAT = "planestudio-practice-evidence-package";
export const PRACTICE_IMPORT_MAX_BYTES = 1_000_000;
export const EXTERNAL_REVIEW_IMPORT_MAX_BYTES = 500_000;

export type ImportStrategy = "merge" | "replace";
export type ImportPreviewStatus = "valid" | "warning" | "incompatible" | "corrupt";

export interface PracticeProgressExport {
  format: typeof PRACTICE_EXPORT_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  appVersion?: string;
  product: "PlanEstudio";
  storageKey: "planestudio.practice-progress.v1";
  metadata: {
    recordCount: number;
    attemptCount: number;
    notesIncluded: boolean;
  };
  records: Record<string, PracticeProgressRecord>;
}

export interface PracticeImportPreview {
  status: ImportPreviewStatus;
  schemaVersion?: number;
  exportedAt?: string;
  recordCount: number;
  attemptCount: number;
  noteCount: number;
  assessmentCount: number;
  reviewCount: number;
  validPracticeIds: string[];
  unknownPracticeIds: string[];
  rejectedPracticeIds: string[];
  warnings: string[];
  errors: string[];
  records: Record<string, PracticeProgressRecord>;
}

export interface EvidencePackage {
  format: typeof PRACTICE_EVIDENCE_FORMAT;
  schemaVersion: number;
  generatedAt: string;
  product: "PlanEstudio";
  practice: Pick<PracticeInfo, "id" | "slug" | "title" | "practiceType" | "difficulty" | "domain" | "roles" | "rubric" | "evidence">;
  attempt: PracticeAttempt | null;
  validation: {
    executionStatus: PracticeProgressRecord["status"];
    validationStatus: PracticeProgressRecord["validationStatus"];
  };
  externalReviews: ExternalPracticeReview[];
  reviewerQuestions: string[];
  privacyNotice: string;
}

export type EvidencePackagePractice = EvidencePackage["practice"];

export type ExternalReviewPreviewStatus = "valid" | "warning" | "incompatible" | "corrupt" | "duplicate" | "conflict";

export interface ExternalReviewImportPreview {
  status: ExternalReviewPreviewStatus;
  review?: ExternalPracticeReview;
  practiceId?: string;
  attemptId?: string;
  reviewId?: string;
  reviewedAt?: string;
  reviewer?: string;
  result?: ExternalPracticeReview["result"];
  score?: number;
  duplicateIdentical: boolean;
  conflictingReview: boolean;
  existingReview?: ExternalPracticeReview;
  warnings: string[];
  errors: string[];
}

export function createPracticeProgressExport(
  records: Record<string, PracticeProgressRecord>,
  options: { includeNotes?: boolean; appVersion?: string } = {}
): PracticeProgressExport {
  const includeNotes = options.includeNotes !== false;
  const exportedRecords = Object.fromEntries(Object.entries(records).map(([id, record]) => {
    const next = includeNotes ? record : {
      ...record,
      notes: "",
      attempts: record.attempts.map((attempt) => ({ ...attempt, reflection: "" })),
    };
    return [id, next];
  }));
  const attempts = Object.values(exportedRecords).flatMap((record) => record.attempts);

  return {
    format: PRACTICE_EXPORT_FORMAT,
    schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: options.appVersion,
    product: "PlanEstudio",
    storageKey: "planestudio.practice-progress.v1",
    metadata: {
      recordCount: Object.keys(exportedRecords).length,
      attemptCount: attempts.length,
      notesIncluded: includeNotes,
    },
    records: exportedRecords,
  };
}

export function serializePracticeProgressExport(payload: PracticeProgressExport): string {
  return JSON.stringify(payload, null, 2);
}

export function practiceBackupFileName(date = new Date()): string {
  return `planestudio-practicas-${date.toISOString().slice(0, 10)}.json`;
}

export function evidencePackageBaseName(practiceId: string, attemptNumber?: number, date = new Date()): string {
  const suffix = attemptNumber ? `intento-${attemptNumber}` : "sin-intento";
  return `planestudio-evidencia-${practiceId.toLowerCase()}-${suffix}-${date.toISOString().slice(0, 10)}`;
}

export function parsePracticeImportText(text: string, knownPracticeIds: string[]): PracticeImportPreview {
  if (text.length > PRACTICE_IMPORT_MAX_BYTES) {
    return corruptPreview("El archivo supera el tamaño máximo permitido para una importación local segura.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return corruptPreview("El archivo no es JSON válido.");
  }
  return validatePracticeImportPayload(parsed, knownPracticeIds);
}

export function parseExternalReviewImportText(
  text: string,
  practice: EvidencePackagePractice,
  record: PracticeProgressRecord
): ExternalReviewImportPreview {
  if (text.length > EXTERNAL_REVIEW_IMPORT_MAX_BYTES) return corruptReviewPreview("El archivo supera el tamaño máximo permitido para una revisión externa.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return corruptReviewPreview("El archivo no es JSON válido.");
  }
  return validateExternalReviewPayload(parsed, practice, record);
}

export function validateExternalReviewPayload(
  payload: unknown,
  practice: EvidencePackagePractice,
  record: PracticeProgressRecord
): ExternalReviewImportPreview {
  const dangerous = findDangerousKey(payload);
  if (dangerous) return corruptReviewPreview(`El archivo contiene un campo no permitido: ${dangerous}.`);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return corruptReviewPreview("La revisión debe ser un objeto JSON.");
  const raw = payload as Record<string, unknown>;
  const format = raw.format;
  if (format !== EXTERNAL_REVIEW_FORMAT && format !== PRACTICE_REVIEW_FORMAT) return corruptReviewPreview("El formato no corresponde a una revisión externa de PlanEstudio.");
  const schemaVersion = Number(raw.schemaVersion ?? 1);
  if (!Number.isInteger(schemaVersion) || schemaVersion < 1) return corruptReviewPreview("La versión de esquema no es válida.");
  if (schemaVersion > 1) {
    return {
      ...emptyReviewPreview(),
      status: "incompatible",
      errors: ["La revisión pertenece a una versión futura de PlanEstudio y no se importará."],
    };
  }

  const reviewId = stringField(raw.reviewId ?? raw.id, 120);
  const practiceId = stringField(raw.practiceId, 80);
  const attemptId = stringField(raw.attemptId, 160);
  const reviewedAt = stringField(raw.reviewedAt, 80);
  const result = normalizeReviewResult(raw.result);
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!reviewId) errors.push("Falta reviewId.");
  if (!practiceId) errors.push("Falta practiceId.");
  if (practiceId && practiceId !== practice.id) errors.push(`La revisión corresponde a ${practiceId}, no a ${practice.id}.`);
  if (!attemptId) errors.push("Falta attemptId.");
  const attempt = attemptId ? record.attempts.find((item) => item.id === attemptId) : undefined;
  if (attemptId && !attempt) errors.push("El intento indicado no existe en esta práctica.");
  if (!reviewedAt || Number.isNaN(Date.parse(reviewedAt))) errors.push("reviewedAt no es una fecha válida.");
  if (reviewedAt && !Number.isNaN(Date.parse(reviewedAt)) && Date.parse(reviewedAt) > Date.now() + 5 * 60_000) warnings.push("La fecha de revisión está en el futuro.");
  if (!result) errors.push("Resultado de revisión inválido.");

  const reviewer = parseReviewer(raw.reviewer, raw);
  if (!reviewer.alias) errors.push("Falta reviewer.displayName o reviewerAlias.");

  const criteriaValidation = parseReviewCriteria(raw.criteria, raw.criterionScores, practice.rubric);
  errors.push(...criteriaValidation.errors);
  warnings.push(...criteriaValidation.warnings);

  const summary = stringField(raw.summary ?? raw.comments, 4000);
  const strengths = textListOrString(raw.strengths, 2000);
  const improvements = textListOrString(raw.improvements, 2000);
  const criticalFailures = textArray(raw.criticalFindings ?? raw.criticalFailures, 1000);
  const requiresResubmission = raw.resubmissionRequired === true || raw.requiresResubmission === true;
  if (!summary) errors.push("Falta summary.");
  if ((result === "requires_changes" || requiresResubmission) && !improvements.trim()) errors.push("Una revisión que requiere ajustes debe incluir mejoras solicitadas.");
  if (result === "approved" && requiresResubmission) errors.push("approved no puede coexistir con resubmissionRequired.");
  if (result === "approved" && criticalFailures.length > 0) errors.push("approved no puede tener fallos críticos.");
  if (result === "rejected" && summary.length < 8) errors.push("rejected requiere un resumen claro.");

  const score = criteriaValidation.score;
  const declaredScore = Number(raw.score ?? raw.totalScore);
  if (Number.isFinite(declaredScore) && Math.round(declaredScore) !== score) errors.push(`El puntaje declarado (${Math.round(declaredScore)}) no coincide con el recalculado (${score}).`);

  const review: ExternalPracticeReview | undefined = errors.length === 0 && reviewId && attemptId && result ? {
    id: reviewId,
    reviewId,
    practiceId: practice.id,
    attemptId,
    reviewedAt: reviewedAt || new Date().toISOString(),
    reviewerAlias: reviewer.alias,
    reviewerDisplayName: reviewer.displayName,
    reviewerRole: reviewer.role,
    reviewerOrganization: reviewer.organization,
    reviewerType: reviewer.type,
    result,
    criterionScores: Object.fromEntries(criteriaValidation.criteria.map((item) => [item.criterion, item.level])),
    criteria: criteriaValidation.criteria,
    score,
    criticalFailures,
    comments: summary,
    strengths,
    improvements,
    requiresResubmission,
    suggestedDueDate: stringField(raw.suggestedDueDate, 80),
    evidenceComments: parseTextRecord(raw.evidenceComments),
    securityNotes: stringField(raw.securityNotes ?? raw.securityObservations, 2000),
    reviewedPackage: raw.reviewedPackage && typeof raw.reviewedPackage === "object" ? raw.reviewedPackage as ExternalPracticeReview["reviewedPackage"] : undefined,
    status: "final",
    source: "imported",
    schemaVersion: 1,
  } : undefined;

  const existing = reviewId ? record.externalReviews.find((item) => item.id === reviewId) : undefined;
  const duplicateIdentical = Boolean(existing && review && stableStringify(canonicalReviewForComparison(existing)) === stableStringify(canonicalReviewForComparison(review)));
  const conflictingReview = Boolean(existing && review && stableStringify(canonicalReviewForComparison(existing)) !== stableStringify(canonicalReviewForComparison(review)));
  const status: ExternalReviewPreviewStatus = errors.length > 0
    ? "corrupt"
    : conflictingReview
      ? "conflict"
      : duplicateIdentical
        ? "duplicate"
        : warnings.length > 0
          ? "warning"
          : "valid";

  return {
    status,
    review,
    practiceId,
    attemptId,
    reviewId,
    reviewedAt,
    reviewer: reviewer.displayName || reviewer.alias,
    result: result ?? undefined,
    score,
    duplicateIdentical,
    conflictingReview,
    existingReview: existing,
    warnings,
    errors,
  };
}

export function validatePracticeImportPayload(payload: unknown, knownPracticeIds: string[]): PracticeImportPreview {
  if (!payload || typeof payload !== "object") return corruptPreview("El archivo no contiene un objeto de progreso.");
  const raw = payload as Record<string, unknown>;
  if (raw.format !== PRACTICE_EXPORT_FORMAT && raw.schemaVersion !== 1) {
    return corruptPreview("El archivo no pertenece al formato de progreso práctico de PlanEstudio.");
  }
  const schemaVersion = Number(raw.schemaVersion ?? 1);
  if (!Number.isInteger(schemaVersion)) return corruptPreview("La versión del esquema no es válida.");
  if (schemaVersion > PRACTICE_PROGRESS_SCHEMA_VERSION) {
    return {
      ...emptyPreview(),
      status: "incompatible",
      schemaVersion,
      errors: ["El archivo pertenece a una versión futura de PlanEstudio y no puede importarse de forma segura."],
    };
  }

  const migrated = sanitizePracticeProgressState(schemaVersion === 1 && raw.records ? { records: raw.records } : raw);
  const known = new Set(knownPracticeIds);
  const warnings: string[] = [];
  const errors: string[] = [];
  const records: Record<string, PracticeProgressRecord> = {};
  const validPracticeIds: string[] = [];
  const unknownPracticeIds: string[] = [];
  const rejectedPracticeIds: string[] = [];

  for (const [id, record] of Object.entries(migrated.records)) {
    const validation = validateRecord(record, known);
    if (validation.errors.length > 0) {
      rejectedPracticeIds.push(id);
      errors.push(...validation.errors.map((error) => `${id}: ${error}`));
      continue;
    }
    if (validation.warnings.length > 0) warnings.push(...validation.warnings.map((warning) => `${id}: ${warning}`));
    if (known.has(id)) validPracticeIds.push(id);
    else {
      unknownPracticeIds.push(id);
      warnings.push(`${id}: la práctica ya no existe en esta versión; se conservará como archivo histórico si importas combinando.`);
    }
    records[id] = known.has(id) ? record : { ...record, archived: true };
  }

  const values = Object.values(records);
  const attempts = values.flatMap((record) => record.attempts);
  const status: ImportPreviewStatus = errors.length > 0 && values.length === 0
    ? "corrupt"
    : warnings.length > 0 || unknownPracticeIds.length > 0
      ? "warning"
      : "valid";

  return {
    status,
    schemaVersion,
    exportedAt: typeof raw.exportedAt === "string" ? raw.exportedAt : undefined,
    recordCount: values.length,
    attemptCount: attempts.length,
    noteCount: values.filter((record) => Boolean(record.notes?.trim()) || record.attempts.some((attempt) => Boolean(attempt.reflection?.trim()))).length,
    assessmentCount: attempts.filter((attempt) => attempt.selfAssessment).length,
    reviewCount: values.reduce((sum, record) => sum + record.externalReviews.length, 0),
    validPracticeIds,
    unknownPracticeIds,
    rejectedPracticeIds,
    warnings,
    errors,
    records,
  };
}

function validateRecord(record: PracticeProgressRecord, known: Set<string>) {
  const warnings: string[] = [];
  const errors: string[] = [];
  if (!record.practiceId) errors.push("falta el ID de práctica.");
  if (!known.has(record.practiceId)) warnings.push("ID desconocido.");
  const activeAttempts = record.attempts.filter((attempt) => attempt.status === "active");
  if (activeAttempts.length > 1) errors.push("hay más de un intento activo.");
  const attemptIds = new Set<string>();
  const numbers = new Set<number>();
  for (const attempt of record.attempts) {
    if (attemptIds.has(attempt.id)) errors.push(`intento duplicado ${attempt.id}.`);
    attemptIds.add(attempt.id);
    if (numbers.has(attempt.attemptNumber)) warnings.push(`número de intento repetido ${attempt.attemptNumber}.`);
    numbers.add(attempt.attemptNumber);
    if (!isIsoLike(attempt.startedAt) || !isIsoLike(attempt.updatedAt)) errors.push(`fechas inválidas en intento ${attempt.attemptNumber}.`);
    if (attempt.completedAt && attempt.completedAt < attempt.startedAt) errors.push(`completedAt anterior a startedAt en intento ${attempt.attemptNumber}.`);
    if (attempt.selfAssessment && !validateAssessment(attempt.selfAssessment)) errors.push(`rúbrica corrupta en intento ${attempt.attemptNumber}.`);
  }
  for (const review of record.externalReviews) {
    if (!attemptIds.has(review.attemptId)) errors.push(`revisión ${review.id} apunta a un intento inexistente.`);
  }
  return { warnings, errors };
}

function validateAssessment(assessment: PracticeProgressRecord["selfAssessment"]): boolean {
  if (!assessment) return true;
  const total = assessment.criteria.reduce((sum, item) => sum + item.weight, 0);
  const levels: AssessmentLevel[] = ["none", "partial", "adequate", "solid", "excellent"];
  return total === 100 && assessment.criteria.every((item) => levels.includes(item.level));
}

function isIsoLike(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function applyPracticeImport(
  current: Record<string, PracticeProgressRecord>,
  incoming: Record<string, PracticeProgressRecord>,
  strategy: ImportStrategy
): Record<string, PracticeProgressRecord> {
  if (strategy === "replace") return { ...incoming };
  const result = { ...current };
  for (const [practiceId, imported] of Object.entries(incoming)) {
    const local = result[practiceId];
    result[practiceId] = local ? mergePracticeRecord(local, imported) : imported;
  }
  return result;
}

export function mergePracticeRecord(local: PracticeProgressRecord, imported: PracticeProgressRecord): PracticeProgressRecord {
  const attemptsById = new Map<string, PracticeAttempt>();
  for (const attempt of [...local.attempts, ...imported.attempts]) {
    const existing = attemptsById.get(attempt.id);
    if (!existing || attempt.updatedAt > existing.updatedAt) attemptsById.set(attempt.id, attempt);
  }
  const attempts = [...attemptsById.values()].sort((a, b) => a.attemptNumber - b.attemptNumber);
  const externalReviews = uniqueBy([...local.externalReviews, ...imported.externalReviews], (review) => review.id);
  const latest = [local, imported].sort((a, b) => (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? ""))[0] ?? local;
  const revealedHints = uniqueByValue([...local.revealedHints, ...imported.revealedHints]);
  const evidenceChecklist = { ...local.evidenceChecklist, ...imported.evidenceChecklist };
  const validationStatus = rankValidation(imported.validationStatus) > rankValidation(local.validationStatus)
    ? imported.validationStatus
    : local.validationStatus;

  return {
    ...latest,
    practiceId: local.practiceId,
    attempts,
    attemptCount: Math.max(local.attemptCount, imported.attemptCount, attempts.length),
    activeAttemptId: attempts.find((attempt) => attempt.status === "active")?.id,
    revealedHints,
    evidenceChecklist,
    externalReviews,
    validationStatus,
    notes: mergeNotes(local.notes, imported.notes),
    lastActivityAt: latest.lastActivityAt,
  };
}

function mergeNotes(local?: string, imported?: string): string {
  const left = local?.trim() ?? "";
  const right = imported?.trim() ?? "";
  if (!left) return right;
  if (!right || left === right) return left;
  return `${left}\n\n--- Nota importada ---\n\n${right}`.slice(0, 8000);
}

function rankValidation(status: PracticeProgressRecord["validationStatus"]): number {
  return ["unvalidated", "self_assessed", "evidence_prepared", "sent_for_review", "externally_reviewed", "sandbox_validated"].indexOf(status);
}

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  return [...new Map(items.map((item) => [key(item), item])).values()];
}

function uniqueByValue(items: string[]): string[] {
  return [...new Set(items)];
}

export function createEvidencePackage(practice: EvidencePackagePractice, record: PracticeProgressRecord, attemptId?: string): EvidencePackage {
  const attempt = attemptId
    ? record.attempts.find((item) => item.id === attemptId) ?? null
    : record.attempts.at(-1) ?? null;
  return {
    format: PRACTICE_EVIDENCE_FORMAT,
    schemaVersion: PRACTICE_PROGRESS_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    product: "PlanEstudio",
    practice: {
      id: practice.id,
      slug: practice.slug,
      title: practice.title,
      practiceType: practice.practiceType,
      difficulty: practice.difficulty,
      domain: practice.domain,
      roles: practice.roles,
      rubric: practice.rubric,
      evidence: practice.evidence,
    },
    attempt,
    validation: {
      executionStatus: record.status,
      validationStatus: record.validationStatus,
    },
    externalReviews: attempt ? record.externalReviews.filter((review) => review.attemptId === attempt.id) : record.externalReviews,
    reviewerQuestions: [
      "¿La evidencia demuestra el criterio de aceptación principal?",
      "¿Hay riesgos de seguridad, ALM o datos sensibles que deban corregirse?",
      "¿Qué criterio de la rúbrica requiere el siguiente intento?",
    ],
    privacyNotice: "Revisa y anonimiza notas, capturas, URLs, usuarios, nombres de clientes y cualquier secreto antes de compartir este paquete.",
  };
}

export function evidencePackageMarkdown(packageData: EvidencePackage): string {
  const attempt = packageData.attempt;
  const assessment = attempt?.selfAssessment;
  const criteria = assessment?.criteria.map((item) => `| ${item.criterion} | ${item.level} | ${item.weight}% | ${item.comment ?? ""} |`).join("\n")
    ?? "| Sin autoevaluación | - | - | - |";
  return `# Paquete de evidencia — ${packageData.practice.id}

## Práctica

- Título: ${packageData.practice.title}
- Tipo: ${packageData.practice.practiceType}
- Dominio: ${packageData.practice.domain}
- Estado de ejecución: ${packageData.validation.executionStatus}
- Estado de validación: ${packageData.validation.validationStatus}

## Intento

- Intento: ${attempt?.attemptNumber ?? "sin intento"}
- Fecha: ${attempt?.updatedAt ?? packageData.generatedAt}
- Solución consultada: ${attempt?.solutionViewed ? "sí" : "no"}
- Pistas usadas: ${attempt?.revealedHintIds.join(", ") || "ninguna"}
- Puntaje autoevaluado: ${assessment?.score ?? "sin autoevaluación"}

## Evidencias declaradas

${Object.entries(attempt?.evidenceChecklist ?? {}).map(([key, value]) => `- ${value ? "[x]" : "[ ]"} ${key}`).join("\n") || "- Sin evidencias marcadas"}

## Rúbrica

| Criterio | Nivel | Peso | Comentario |
| --- | --- | ---: | --- |
${criteria}

## Reflexión / notas

${attempt?.reflection?.trim() || "Sin reflexión registrada."}

## Preguntas para revisión

${packageData.reviewerQuestions.map((question) => `- ${question}`).join("\n")}

## Privacidad

${packageData.privacyNotice}
`;
}

export function createReviewTemplate(practice: EvidencePackagePractice, attempt: PracticeAttempt | null): string {
  const criteria = practice.rubric.map((item) => ({
    criterion: item.criterion,
    weight: item.weight,
    level: "adequate",
    comment: "",
  }));
  const review = {
    format: EXTERNAL_REVIEW_FORMAT,
    schemaVersion: 1,
    reviewId: `REV-${new Date().toISOString().slice(0, 10)}-${practice.id}`,
    practiceId: practice.id,
    attemptId: attempt?.id ?? "REEMPLAZAR-CON-ID-DE-INTENTO",
    reviewedAt: new Date().toISOString(),
    reviewer: {
      displayName: "Revisor externo",
      role: "Power Platform Consultant",
      organization: "",
      alias: "mentor-externo",
    },
    result: "reviewed",
    criteria,
    score: 70,
    criticalFindings: [],
    strengths: ["Fortaleza observada."],
    improvements: ["Mejora sugerida."],
    summary: "Comentario específico sobre la evidencia revisada.",
    resubmissionRequired: false,
    suggestedDueDate: "",
    evidenceComments: {},
    securityNotes: "Sin datos sensibles observados en la muestra revisada.",
    reviewedPackage: {
      format: PRACTICE_EVIDENCE_FORMAT,
      attemptNumber: attempt?.attemptNumber,
    },
  };
  return JSON.stringify(review, null, 2);
}

const REVIEW_RESULT_VALUES: ExternalPracticeReview["result"][] = ["reviewed", "approved", "approved_with_observations", "requires_changes", "rejected"];
const LEVEL_VALUES: AssessmentLevel[] = ["none", "partial", "adequate", "solid", "excellent"];
const LEVEL_MULTIPLIER: Record<AssessmentLevel, number> = { none: 0, partial: 0.4, adequate: 0.7, solid: 0.85, excellent: 1 };

function normalizeReviewResult(value: unknown): ExternalPracticeReview["result"] | null {
  if (value === "requires_adjustments") return "requires_changes";
  if (value === "not_approved") return "rejected";
  return typeof value === "string" && REVIEW_RESULT_VALUES.includes(value as ExternalPracticeReview["result"])
    ? value as ExternalPracticeReview["result"]
    : null;
}

function parseReviewCriteria(criteriaValue: unknown, criterionScoresValue: unknown, rubric: PracticeInfo["rubric"]) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const expected = new Map(rubric.map((item) => [item.criterion, item.weight]));
  const seen = new Set<string>();
  const criteria: NonNullable<ExternalPracticeReview["criteria"]> = [];
  if (Array.isArray(criteriaValue)) {
    for (const item of criteriaValue) {
      if (!item || typeof item !== "object") {
        errors.push("Cada criterio debe ser un objeto.");
        continue;
      }
      const raw = item as Record<string, unknown>;
      const criterion = stringField(raw.criterion, 240);
      const level = stringField(raw.level ?? raw.score, 40) as AssessmentLevel;
      const weight = Number(raw.weight);
      if (!criterion || !expected.has(criterion)) errors.push(`Criterio inexistente: ${criterion || "(vacío)"}.`);
      if (criterion && seen.has(criterion)) errors.push(`Criterio duplicado: ${criterion}.`);
      if (criterion) seen.add(criterion);
      if (!LEVEL_VALUES.includes(level)) errors.push(`Nivel inválido para ${criterion}.`);
      if (criterion && expected.has(criterion) && weight !== expected.get(criterion)) errors.push(`Peso incorrecto para ${criterion}: esperado ${expected.get(criterion)}, recibido ${weight}.`);
      if (criterion && LEVEL_VALUES.includes(level)) criteria.push({ criterion, weight, level, comment: stringField(raw.comment, 1000) || undefined });
    }
  } else if (criterionScoresValue && typeof criterionScoresValue === "object") {
    const scores = criterionScoresValue as Record<string, unknown>;
    for (const item of rubric) {
      const level = scores[item.criterion] as AssessmentLevel;
      if (!LEVEL_VALUES.includes(level)) errors.push(`Nivel inválido para ${item.criterion}.`);
      else criteria.push({ criterion: item.criterion, weight: item.weight, level });
      seen.add(item.criterion);
    }
  } else {
    errors.push("Falta criteria.");
  }
  for (const item of rubric) {
    if (!seen.has(item.criterion)) errors.push(`Falta criterio de rúbrica: ${item.criterion}.`);
  }
  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0);
  if (criteria.length > 0 && totalWeight !== 100) errors.push(`La suma de pesos debe ser 100; recibida ${totalWeight}.`);
  if (criteria.length !== rubric.length && errors.length === 0) warnings.push("La rúbrica no tiene la misma cantidad de criterios que la práctica actual.");
  const score = Math.round(criteria.reduce((sum, item) => sum + item.weight * LEVEL_MULTIPLIER[item.level], 0));
  return { criteria, score, errors, warnings };
}

function parseReviewer(value: unknown, raw: Record<string, unknown>) {
  const reviewer = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const displayName = stringField(reviewer.displayName ?? raw.reviewerDisplayName, 160);
  const alias = stringField(reviewer.alias ?? raw.reviewerAlias ?? displayName, 120);
  const role = stringField(reviewer.role ?? raw.reviewerRole, 160);
  const organization = stringField(reviewer.organization ?? raw.reviewerOrganization, 160);
  const type = ["mentor", "peer", "lead", "instructor", "other"].includes(String(raw.reviewerType)) ? raw.reviewerType as ExternalPracticeReview["reviewerType"] : "other";
  return { displayName, alias, role, organization, type };
}

function findDangerousKey(value: unknown, depth = 0): string | null {
  if (depth > 12) return "profundidad excesiva";
  if (!value || typeof value !== "object") return null;
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (["__proto__", "constructor", "prototype"].includes(key)) return key;
    const found = findDangerousKey(nested, depth + 1);
    if (found) return found;
  }
  return null;
}

function stringField(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, maxLength) : "";
}

function textArray(value: unknown, maxItemLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => stringField(item, maxItemLength)).filter(Boolean).slice(0, 20);
}

function textListOrString(value: unknown, maxLength: number): string {
  if (Array.isArray(value)) return textArray(value, Math.min(maxLength, 500)).join("\n");
  return stringField(value, maxLength);
}

function parseTextRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(([key, text]) => [stringField(key, 120), stringField(text, 1000)] as const)
    .filter(([key, text]) => key && text);
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortObject(value));
}

function canonicalReviewForComparison(review: ExternalPracticeReview): Omit<ExternalPracticeReview, "schemaVersion" | "source"> {
  const stableReview: Partial<ExternalPracticeReview> = { ...review };
  delete stableReview.schemaVersion;
  delete stableReview.source;
  return stableReview as Omit<ExternalPracticeReview, "schemaVersion" | "source">;
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, nested]) => [key, sortObject(nested)]));
}

function corruptReviewPreview(message: string): ExternalReviewImportPreview {
  return { ...emptyReviewPreview(), status: "corrupt", errors: [message] };
}

function emptyReviewPreview(): ExternalReviewImportPreview {
  return {
    status: "valid",
    duplicateIdentical: false,
    conflictingReview: false,
    warnings: [],
    errors: [],
  };
}

function corruptPreview(message: string): PracticeImportPreview {
  return { ...emptyPreview(), status: "corrupt", errors: [message] };
}

function emptyPreview(): PracticeImportPreview {
  return {
    status: "valid",
    recordCount: 0,
    attemptCount: 0,
    noteCount: 0,
    assessmentCount: 0,
    reviewCount: 0,
    validPracticeIds: [],
    unknownPracticeIds: [],
    rejectedPracticeIds: [],
    warnings: [],
    errors: [],
    records: {},
  };
}

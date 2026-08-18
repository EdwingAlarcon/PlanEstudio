// Export/import for the spaced repetition store — mirrors the mature pattern
// in practice-portability.ts (versioned payload, prototype-pollution guard,
// merge/replace preview) but stays entirely independent: it never touches
// practice-progress, interactive-practice-progress, progress or workstation.

import { REVIEW_SCHEMA_VERSION, sanitizeReviewState, type ReviewDayLog, type ReviewState } from "./review-store";
import type { ReviewCardMap } from "./review-queue";

export const RETENTION_EXPORT_FORMAT = "planestudio-retention";
export const RETENTION_IMPORT_MAX_BYTES = 1_000_000;

export type RetentionImportStrategy = "merge" | "replace";
export type RetentionImportStatus = "valid" | "warning" | "incompatible" | "corrupt";

export interface RetentionExport {
  format: typeof RETENTION_EXPORT_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  product: "PlanEstudio";
  storageKey: "planestudio.spaced-repetition.v1";
  metadata: {
    cardCount: number;
    dayLogCount: number;
  };
  cards: ReviewCardMap;
  dayLogs: ReviewDayLog[];
}

export interface RetentionImportPreview {
  status: RetentionImportStatus;
  schemaVersion?: number;
  exportedAt?: string;
  cardCount: number;
  dayLogCount: number;
  unknownQuestionIds: string[];
  warnings: string[];
  errors: string[];
  cards: ReviewCardMap;
  dayLogs: ReviewDayLog[];
}

export function createRetentionExport(state: Pick<ReviewState, "cards" | "dayLogs">): RetentionExport {
  return {
    format: RETENTION_EXPORT_FORMAT,
    schemaVersion: REVIEW_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    product: "PlanEstudio",
    storageKey: "planestudio.spaced-repetition.v1",
    metadata: {
      cardCount: Object.keys(state.cards).length,
      dayLogCount: state.dayLogs.length,
    },
    cards: state.cards,
    dayLogs: state.dayLogs,
  };
}

export function serializeRetentionExport(payload: RetentionExport): string {
  return JSON.stringify(payload, null, 2);
}

export function retentionBackupFileName(date = new Date()): string {
  return `planestudio-repaso-${date.toISOString().slice(0, 10)}.json`;
}

export function parseRetentionImportText(text: string, knownQuestionIds: string[]): RetentionImportPreview {
  if (text.length > RETENTION_IMPORT_MAX_BYTES) {
    return corruptPreview("El archivo supera el tamaño máximo permitido para una importación local segura.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return corruptPreview("El archivo no es JSON válido.");
  }
  return validateRetentionImportPayload(parsed, knownQuestionIds);
}

export function validateRetentionImportPayload(payload: unknown, knownQuestionIds: string[]): RetentionImportPreview {
  if (!payload || typeof payload !== "object") return corruptPreview("El archivo no contiene un objeto de repaso.");

  const dangerousKey = findDangerousKey(payload);
  if (dangerousKey) return corruptPreview(`El archivo contiene una clave no permitida ("${dangerousKey}").`);

  const raw = payload as Record<string, unknown>;
  if (raw.format !== RETENTION_EXPORT_FORMAT) {
    return corruptPreview("El archivo no pertenece al formato de repaso espaciado de PlanEstudio.");
  }
  const schemaVersion = Number(raw.schemaVersion);
  if (!Number.isInteger(schemaVersion)) return corruptPreview("La versión del esquema no es válida.");
  if (schemaVersion > REVIEW_SCHEMA_VERSION) {
    return {
      ...emptyPreview(),
      status: "incompatible",
      schemaVersion,
      errors: ["El archivo pertenece a una versión futura de PlanEstudio y no puede importarse de forma segura."],
    };
  }

  const sanitized = sanitizeReviewState(raw);
  const known = new Set(knownQuestionIds);
  const unknownQuestionIds: string[] = [];
  const warnings: string[] = [];

  for (const id of Object.keys(sanitized.cards)) {
    if (!known.has(id)) unknownQuestionIds.push(id);
  }
  if (unknownQuestionIds.length > 0) {
    warnings.push(`${unknownQuestionIds.length} pregunta(s) del archivo ya no existen en el banco actual — se ignoran sin bloquear la importación.`);
  }

  const cards: ReviewCardMap = {};
  for (const [id, card] of Object.entries(sanitized.cards)) {
    if (known.has(id)) cards[id] = card;
  }

  return {
    status: warnings.length > 0 ? "warning" : "valid",
    schemaVersion,
    exportedAt: typeof raw.exportedAt === "string" ? raw.exportedAt : undefined,
    cardCount: Object.keys(cards).length,
    dayLogCount: sanitized.dayLogs.length,
    unknownQuestionIds,
    warnings,
    errors: [],
    cards,
    dayLogs: sanitized.dayLogs,
  };
}

export function applyRetentionImport(
  current: ReviewCardMap,
  incoming: ReviewCardMap,
  strategy: RetentionImportStrategy
): ReviewCardMap {
  if (strategy === "replace") return { ...incoming };
  const result = { ...current };
  for (const [questionId, importedCard] of Object.entries(incoming)) {
    const local = result[questionId];
    result[questionId] = !local || (importedCard.lastReviewedAt ?? "") > (local.lastReviewedAt ?? "")
      ? importedCard
      : local;
  }
  return result;
}

// ─── Internal helpers ──────────────────────────────────────────────────────

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

function corruptPreview(message: string): RetentionImportPreview {
  return { ...emptyPreview(), status: "corrupt", errors: [message] };
}

function emptyPreview(): RetentionImportPreview {
  return {
    status: "valid",
    cardCount: 0,
    dayLogCount: 0,
    unknownQuestionIds: [],
    warnings: [],
    errors: [],
    cards: {},
    dayLogs: [],
  };
}

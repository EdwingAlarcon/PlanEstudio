// Full-progress backup: one JSON file that snapshots every persisted store.
// Stores stay independent at runtime (never merged); this module only reads and
// writes their raw persisted payloads ({ state, version }) so each store's own
// migrate/sanitize step runs on the next rehydration (i.e. after a page reload).
// Pure over a Storage-like object so it can be unit-tested without a DOM.

import { INTERACTIVE_PRACTICE_STORAGE_KEY } from "./interactive-practice-progress";
import { PRACTICE_PROGRESS_STORAGE_KEY } from "./practice-progress";
import { REVIEW_STORAGE_KEY } from "./review-store";
import { WORKSTATION_STORAGE_KEY } from "./workstation-store";

export const BACKUP_FORMAT = "planestudio-full-backup";
export const BACKUP_SCHEMA_VERSION = 1;
export const BACKUP_IMPORT_MAX_BYTES = 3_000_000;

export const PROGRESS_STORAGE_KEY = "plan-estudio-progress";
export const ONBOARDING_STORAGE_KEY = "plan-estudio-onboarding";

export const BACKUP_STORE_LABELS: Record<string, string> = {
  [PROGRESS_STORAGE_KEY]: "Progreso académico (módulos, quizzes, labs, checklist, notas)",
  [ONBOARDING_STORAGE_KEY]: "Recorrido guiado",
  [PRACTICE_PROGRESS_STORAGE_KEY]: "Prácticas profesionales",
  [INTERACTIVE_PRACTICE_STORAGE_KEY]: "Prácticas interactivas",
  [REVIEW_STORAGE_KEY]: "Repaso espaciado",
  [WORKSTATION_STORAGE_KEY]: "Estación de trabajo",
};
export const BACKUP_STORE_KEYS = Object.keys(BACKUP_STORE_LABELS);

export type BackupStrategy = "merge" | "replace";
export type BackupStatus = "valid" | "incompatible" | "corrupt";

type PersistedStore = { state: Record<string, unknown>; version?: number };
export type BackupStores = Record<string, PersistedStore>;

export interface FullBackup {
  format: typeof BACKUP_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  product: "PlanEstudio";
  stores: BackupStores;
}

export interface BackupPreview {
  status: BackupStatus;
  exportedAt?: string;
  stores: BackupStores;
  storeKeys: string[];
  ignoredKeys: string[];
  errors: string[];
}

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "getItem" | "setItem">;

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function findDangerousKey(value: unknown, depth = 0): string | null {
  if (depth > 12 || !value || typeof value !== "object") return null;
  for (const [key, child] of Object.entries(value)) {
    if (DANGEROUS_KEYS.has(key)) return key;
    const nested = findDangerousKey(child, depth + 1);
    if (nested) return nested;
  }
  return null;
}

function readPersisted(storage: ReadableStorage, key: string): PersistedStore | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) && isRecord(parsed.state) ? (parsed as PersistedStore) : null;
  } catch {
    return null;
  }
}

export function createFullBackup(storage: ReadableStorage, now = new Date()): FullBackup {
  const stores: BackupStores = {};
  for (const key of BACKUP_STORE_KEYS) {
    const persisted = readPersisted(storage, key);
    if (persisted) stores[key] = persisted;
  }
  return {
    format: BACKUP_FORMAT,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    product: "PlanEstudio",
    stores,
  };
}

export function serializeFullBackup(backup: FullBackup): string {
  return JSON.stringify(backup, null, 2);
}

export function fullBackupFileName(date = new Date()): string {
  return `planestudio-backup-${date.toISOString().slice(0, 10)}.json`;
}

function failed(status: BackupStatus, message: string): BackupPreview {
  return { status, stores: {}, storeKeys: [], ignoredKeys: [], errors: [message] };
}

export function parseBackupText(text: string): BackupPreview {
  if (text.length > BACKUP_IMPORT_MAX_BYTES) {
    return failed("corrupt", "El archivo supera el tamaño máximo permitido para una importación local segura.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return failed("corrupt", "El archivo no es JSON válido.");
  }
  if (!isRecord(parsed)) return failed("corrupt", "El archivo no contiene un objeto de backup.");
  const dangerous = findDangerousKey(parsed);
  if (dangerous) return failed("corrupt", `El archivo contiene una clave no permitida ("${dangerous}").`);
  if (parsed.format !== BACKUP_FORMAT) {
    return failed("corrupt", "El archivo no es un backup completo de PlanEstudio.");
  }
  const schemaVersion = Number(parsed.schemaVersion);
  if (!Number.isInteger(schemaVersion)) return failed("corrupt", "La versión del esquema no es válida.");
  if (schemaVersion > BACKUP_SCHEMA_VERSION) {
    return failed("incompatible", "El archivo pertenece a una versión futura de PlanEstudio y no puede importarse de forma segura.");
  }
  if (!isRecord(parsed.stores)) return failed("corrupt", "El backup no contiene la sección de stores.");

  const stores: BackupStores = {};
  const ignoredKeys: string[] = [];
  for (const [key, value] of Object.entries(parsed.stores)) {
    if (!BACKUP_STORE_KEYS.includes(key)) {
      ignoredKeys.push(key);
      continue;
    }
    if (!isRecord(value) || !isRecord(value.state)) {
      return failed("corrupt", `El store "${key}" no tiene el formato esperado.`);
    }
    stores[key] = value as PersistedStore;
  }
  const storeKeys = Object.keys(stores);
  if (storeKeys.length === 0) return failed("corrupt", "El backup no contiene ningún store reconocido.");
  return {
    status: "valid",
    exportedAt: typeof parsed.exportedAt === "string" ? parsed.exportedAt : undefined,
    stores,
    storeKeys,
    ignoredKeys,
    errors: [],
  };
}

// ─── Merge (academic progress only) ───────────────────────────────────────────

function union(a: unknown, b: unknown): string[] {
  const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  return [...new Set([...list(a), ...list(b)])];
}

export function mergeProgressStates(
  local: Record<string, unknown>,
  incoming: Record<string, unknown>
): Record<string, unknown> {
  const scores: Record<string, number> = {};
  for (const source of [local.quizScores, incoming.quizScores]) {
    if (!isRecord(source)) continue;
    for (const [id, value] of Object.entries(source)) {
      if (typeof value === "number") scores[id] = Math.max(scores[id] ?? 0, value);
    }
  }
  const checklist: Record<string, unknown> = isRecord(local.checklistItems) ? { ...local.checklistItems } : {};
  if (isRecord(incoming.checklistItems)) {
    for (const [id, item] of Object.entries(incoming.checklistItems)) {
      const mine = checklist[id];
      const mineDone = isRecord(mine) && mine.completed === true;
      const theirsDone = isRecord(item) && item.completed === true;
      if (!mine || (!mineDone && theirsDone)) checklist[id] = item;
    }
  }
  const notes: Record<string, string> = {};
  for (const source of [incoming.moduleNotes, local.moduleNotes]) {
    if (!isRecord(source)) continue;
    for (const [id, value] of Object.entries(source)) {
      if (typeof value === "string" && value.trim()) notes[id] = value;
    }
  }
  return {
    ...incoming,
    ...local,
    completedModules: union(local.completedModules, incoming.completedModules),
    completedLabs: union(local.completedLabs, incoming.completedLabs),
    quizScores: scores,
    checklistItems: checklist,
    moduleNotes: notes,
    lastVisited: local.lastVisited ?? incoming.lastVisited ?? null,
    userName: local.userName ?? incoming.userName ?? null,
  };
}

// Writes the previewed stores into storage. Returns the keys actually written.
// merge  → academic progress is unioned; every other store is only filled when
//          absent locally (their dedicated panels offer a finer per-item merge).
// replace → every store in the backup overwrites its local counterpart; stores
//          absent from the backup are left untouched.
export function applyBackup(
  storage: WritableStorage,
  preview: BackupPreview,
  strategy: BackupStrategy
): string[] {
  const written: string[] = [];
  for (const key of preview.storeKeys) {
    const incoming = preview.stores[key];
    if (!incoming) continue;
    const local = readPersisted(storage, key);
    let next: PersistedStore = incoming;
    if (strategy === "merge" && local) {
      if (key === PROGRESS_STORAGE_KEY) {
        next = { ...local, state: mergeProgressStates(local.state, incoming.state) };
      } else {
        continue;
      }
    }
    storage.setItem(key, JSON.stringify(next));
    written.push(key);
  }
  return written;
}

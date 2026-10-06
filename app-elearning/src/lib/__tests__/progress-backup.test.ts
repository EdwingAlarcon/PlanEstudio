import { describe, expect, it } from "vitest";
import {
  BACKUP_FORMAT,
  PROGRESS_STORAGE_KEY,
  applyBackup,
  createFullBackup,
  mergeProgressStates,
  parseBackupText,
  serializeFullBackup,
} from "../progress-backup";

function memoryStorage(initial: Record<string, unknown> = {}) {
  const data = new Map<string, string>(Object.entries(initial).map(([k, v]) => [k, JSON.stringify(v)]));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
}

const progress = (state: Record<string, unknown>) => ({ state, version: 0 });

describe("progress-backup", () => {
  it("exporta solo los stores presentes y válidos", () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: progress({ completedModules: ["basico-1"] }) });
    const backup = createFullBackup(storage, new Date("2026-09-30T00:00:00Z"));
    expect(backup.format).toBe(BACKUP_FORMAT);
    expect(Object.keys(backup.stores)).toEqual([PROGRESS_STORAGE_KEY]);
  });

  it("ida y vuelta: parsea lo exportado", () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: progress({ completedLabs: ["lab-02"] }) });
    const preview = parseBackupText(serializeFullBackup(createFullBackup(storage)));
    expect(preview.status).toBe("valid");
    expect(preview.storeKeys).toEqual([PROGRESS_STORAGE_KEY]);
  });

  it("rechaza JSON inválido, formato ajeno, versión futura y claves peligrosas", () => {
    expect(parseBackupText("{no").status).toBe("corrupt");
    expect(parseBackupText(JSON.stringify({ format: "otro" })).status).toBe("corrupt");
    expect(parseBackupText(JSON.stringify({ format: BACKUP_FORMAT, schemaVersion: 99, stores: {} })).status).toBe("incompatible");
    const poisoned = `{"format":"${BACKUP_FORMAT}","schemaVersion":1,"stores":{"${PROGRESS_STORAGE_KEY}":{"state":{"__proto__":{"x":1}}}}}`;
    expect(parseBackupText(poisoned).status).toBe("corrupt");
  });

  it("ignora stores desconocidos y falla si no queda ninguno", () => {
    const text = JSON.stringify({ format: BACKUP_FORMAT, schemaVersion: 1, stores: { "otra-app": { state: {} } } });
    expect(parseBackupText(text).status).toBe("corrupt");
    const mixed = JSON.stringify({
      format: BACKUP_FORMAT,
      schemaVersion: 1,
      stores: { "otra-app": { state: {} }, [PROGRESS_STORAGE_KEY]: progress({}) },
    });
    const preview = parseBackupText(mixed);
    expect(preview.status).toBe("valid");
    expect(preview.ignoredKeys).toEqual(["otra-app"]);
  });

  it("merge une progreso académico; replace sobrescribe", () => {
    const incoming = parseBackupText(
      JSON.stringify({
        format: BACKUP_FORMAT,
        schemaVersion: 1,
        stores: { [PROGRESS_STORAGE_KEY]: progress({ completedModules: ["basico-2"], quizScores: { "1": 90 } }) },
      })
    );
    const merged = memoryStorage({ [PROGRESS_STORAGE_KEY]: progress({ completedModules: ["basico-1"], quizScores: { "1": 60 } }) });
    applyBackup(merged, incoming, "merge");
    const state = JSON.parse(merged.getItem(PROGRESS_STORAGE_KEY)!).state;
    expect(state.completedModules.sort()).toEqual(["basico-1", "basico-2"]);
    expect(state.quizScores["1"]).toBe(90);

    const replaced = memoryStorage({ [PROGRESS_STORAGE_KEY]: progress({ completedModules: ["basico-1"] }) });
    applyBackup(replaced, incoming, "replace");
    expect(JSON.parse(replaced.getItem(PROGRESS_STORAGE_KEY)!).state.completedModules).toEqual(["basico-2"]);
  });

  it("merge no pisa stores no académicos ya existentes", () => {
    const key = "planestudio.workstation.v1";
    const incoming = parseBackupText(
      JSON.stringify({ format: BACKUP_FORMAT, schemaVersion: 1, stores: { [key]: { state: { a: 2 } } } })
    );
    const storage = memoryStorage({ [key]: { state: { a: 1 } } });
    expect(applyBackup(storage, incoming, "merge")).toEqual([]);
    expect(JSON.parse(storage.getItem(key)!).state.a).toBe(1);
    const empty = memoryStorage();
    expect(applyBackup(empty, incoming, "merge")).toEqual([key]);
  });

  it("mergeProgressStates conserva notas, prioriza local y no pierde checklist completado", () => {
    const result = mergeProgressStates(
      { moduleNotes: { "basico-1": "local" }, checklistItems: { c1: { completed: false } }, userName: null },
      { moduleNotes: { "basico-1": "remota", "basico-2": "otra" }, checklistItems: { c1: { completed: true } }, userName: "Ana" }
    );
    expect(result.moduleNotes).toEqual({ "basico-1": "local", "basico-2": "otra" });
    expect((result.checklistItems as Record<string, { completed: boolean }>).c1?.completed).toBe(true);
    expect(result.userName).toBe("Ana");
  });
});

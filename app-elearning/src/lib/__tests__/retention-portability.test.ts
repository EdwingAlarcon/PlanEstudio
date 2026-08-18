import { describe, expect, it } from "vitest";
import {
  RETENTION_EXPORT_FORMAT,
  applyRetentionImport,
  createRetentionExport,
  parseRetentionImportText,
  retentionBackupFileName,
  serializeRetentionExport,
  validateRetentionImportPayload,
} from "../retention-portability";
import type { ReviewCardState } from "../review-scheduler";

function card(questionId: string, moduleId: number, overrides: Partial<ReviewCardState> = {}): ReviewCardState {
  return {
    questionId, moduleId, itemType: "quiz-question",
    repetitions: 1, intervalDays: 3, easeFactor: 2.5, nextReviewAt: "2026-06-01T00:00:00.000Z",
    lapses: 0, totalReviews: 1, correctReviews: 1, incorrectReviews: 0, isLeech: false, status: "review",
    ...overrides,
  };
}

describe("createRetentionExport / serializeRetentionExport", () => {
  it("produces a versioned, self-describing payload", () => {
    const state = { cards: { "module-1-0": card("module-1-0", 1) }, dayLogs: [] };
    const payload = createRetentionExport(state);
    expect(payload.format).toBe(RETENTION_EXPORT_FORMAT);
    expect(payload.storageKey).toBe("planestudio.spaced-repetition.v1");
    expect(payload.metadata.cardCount).toBe(1);
    expect(() => JSON.parse(serializeRetentionExport(payload))).not.toThrow();
  });
});

describe("retentionBackupFileName", () => {
  it("includes the ISO date", () => {
    expect(retentionBackupFileName(new Date("2026-06-15T00:00:00.000Z"))).toBe("planestudio-repaso-2026-06-15.json");
  });
});

describe("validateRetentionImportPayload", () => {
  const known = ["module-1-0"];

  it("accepts a valid, matching export", () => {
    const payload = createRetentionExport({ cards: { "module-1-0": card("module-1-0", 1) }, dayLogs: [] });
    const preview = validateRetentionImportPayload(payload, known);
    expect(preview.status).toBe("valid");
    expect(preview.cardCount).toBe(1);
  });

  it("rejects a payload of the wrong format", () => {
    const preview = validateRetentionImportPayload({ format: "something-else" }, known);
    expect(preview.status).toBe("corrupt");
  });

  it("marks a future schemaVersion as incompatible", () => {
    const payload = { ...createRetentionExport({ cards: {}, dayLogs: [] }), schemaVersion: 999 };
    const preview = validateRetentionImportPayload(payload, known);
    expect(preview.status).toBe("incompatible");
  });

  it("warns but does not abort on unknown question ids", () => {
    const payload = createRetentionExport({ cards: { "module-99-0": card("module-99-0", 99) }, dayLogs: [] });
    const preview = validateRetentionImportPayload(payload, known);
    expect(preview.status).toBe("warning");
    expect(preview.unknownQuestionIds).toEqual(["module-99-0"]);
    expect(preview.cardCount).toBe(0); // unknown card excluded from the applied set
  });

  it("rejects prototype-pollution attempts", () => {
    const malicious = JSON.parse('{"format":"planestudio-retention","schemaVersion":1,"__proto__":{"polluted":true}}');
    const preview = validateRetentionImportPayload(malicious, known);
    expect(preview.status).toBe("corrupt");
  });

  it("rejects a payload above the max size via parseRetentionImportText", () => {
    const huge = "x".repeat(1_000_001);
    const preview = parseRetentionImportText(huge, known);
    expect(preview.status).toBe("corrupt");
  });

  it("rejects invalid JSON text", () => {
    const preview = parseRetentionImportText("{not json", known);
    expect(preview.status).toBe("corrupt");
  });

  it("clamps an absurd ease factor instead of trusting it", () => {
    const payload = createRetentionExport({
      cards: { "module-1-0": card("module-1-0", 1, { easeFactor: 999 }) },
      dayLogs: [],
    });
    const preview = validateRetentionImportPayload(payload, known);
    expect(preview.cards["module-1-0"]?.easeFactor).toBeLessThanOrEqual(2.8);
  });
});

describe("applyRetentionImport", () => {
  it("replace strategy fully overwrites current cards", () => {
    const current = { "module-1-0": card("module-1-0", 1) };
    const incoming = { "module-2-0": card("module-2-0", 2) };
    expect(applyRetentionImport(current, incoming, "replace")).toEqual(incoming);
  });

  it("merge strategy keeps the more recently reviewed card per question", () => {
    const current = { "module-1-0": card("module-1-0", 1, { lastReviewedAt: "2026-06-01T00:00:00.000Z" }) };
    const incoming = { "module-1-0": card("module-1-0", 1, { lastReviewedAt: "2026-06-10T00:00:00.000Z", intervalDays: 20 }) };
    const merged = applyRetentionImport(current, incoming, "merge");
    expect(merged["module-1-0"]!.intervalDays).toBe(20);
  });

  it("merge strategy never touches unrelated existing cards", () => {
    const current = {
      "module-1-0": card("module-1-0", 1),
      "module-2-0": card("module-2-0", 2),
    };
    const incoming = { "module-1-0": card("module-1-0", 1, { lastReviewedAt: "2099-01-01T00:00:00.000Z" }) };
    const merged = applyRetentionImport(current, incoming, "merge");
    expect(merged["module-2-0"]).toEqual(current["module-2-0"]);
  });
});

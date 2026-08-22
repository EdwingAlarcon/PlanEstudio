import { describe, expect, it } from "vitest";
import {
  createInteractivePracticeProgressExport,
  createInteractivePracticeRecord,
  getInteractivePracticeReviewQueue,
  mergeInteractivePracticeRecords,
  parseInteractivePracticeImport,
  replaceInteractivePracticeRecords,
  summarizeInteractivePracticeProgress,
  useInteractivePracticeProgressStore,
  type InteractivePracticeRecord,
} from "../interactive-practice-progress";

describe("interactive practice progress helpers", () => {
  it("creates independent records with the interactive storage schema", () => {
    const record = createInteractivePracticeRecord("IP-DV-001", "2026-08-11T00:00:00.000Z");
    expect(record.schemaVersion).toBe(1);
    expect(record.practiceId).toBe("IP-DV-001");
    expect(record.status).toBe("not-started");
    expect(record.mastery).toBe("not-started");
    expect(record.events[0]?.type).toBe("opened");
  });

  it("summarizes scoped practice progress", () => {
    const records: Record<string, InteractivePracticeRecord> = {
      "IP-DV-001": {
        ...createInteractivePracticeRecord("IP-DV-001"),
        status: "completed",
        mastery: "proficient",
        attemptCount: 1,
        bestScore: 100,
      },
      "IP-QRY-001": {
        ...createInteractivePracticeRecord("IP-QRY-001"),
        status: "in-progress",
        mastery: "needs-review",
        attemptCount: 2,
        bestScore: 60,
      },
    };
    const summary = summarizeInteractivePracticeProgress(records, ["IP-DV-001", "IP-QRY-001", "IP-PA-001"]);
    expect(summary.total).toBe(3);
    expect(summary.completed).toBe(1);
    expect(summary.proficient).toBe(1);
    expect(summary.needsReview).toBe(1);
    expect(summary.inProgress).toBe(1);
    expect(summary.attempts).toBe(3);
    expect(summary.percentage).toBe(33);
  });

  it("records attempts, hints, solution reveal and reset actions", () => {
    const store = useInteractivePracticeProgressStore;
    store.setState({ records: {} });
    store.getState().openPractice("IP-DV-001");
    store.getState().revealHint("IP-DV-001", "h1");
    store.getState().recordAttempt("IP-DV-001", { status: "correct", score: 100, feedback: "ok", consequences: [] }, ["one-many"]);
    store.getState().revealSolution("IP-DV-001");
    store.getState().markAbandoned("IP-DV-001");
    const record = store.getState().records["IP-DV-001"];
    expect(record?.status).toBe("completed");
    expect(record?.hintsUsed).toContain("h1");
    expect(record?.solutionRevealed).toBe(true);
    expect(record?.events.map((event) => event.type)).toContain("abandoned");
    store.getState().resetPractice("IP-DV-001");
    expect(store.getState().records["IP-DV-001"]).toBeUndefined();
    store.getState().openPractice("IP-QRY-001");
    store.getState().resetAllInteractivePractices();
    expect(store.getState().records).toEqual({});
  });

  it("exports scoped interactive progress with a versioned schema", () => {
    const record = { ...createInteractivePracticeRecord("IP-DV-001"), status: "completed" as const, mastery: "proficient" as const };
    const payload = createInteractivePracticeProgressExport({ "IP-DV-001": record, "IP-OLD-999": createInteractivePracticeRecord("IP-OLD-999") }, ["IP-DV-001"], "2026-08-11T12:00:00.000Z");
    expect(payload.schemaVersion).toBe(1);
    expect(payload.source).toBe("planestudio.interactive-practice");
    expect(payload.exportedAt).toBe("2026-08-11T12:00:00.000Z");
    expect(Object.keys(payload.practices)).toEqual(["IP-DV-001"]);
  });

  it("validates import schema, unknown ids, corrupt files and future versions", () => {
    const record = createInteractivePracticeRecord("IP-DV-001");
    const valid = JSON.stringify({ schemaVersion: 1, source: "planestudio.interactive-practice", exportedAt: "2026-08-11T00:00:00.000Z", practices: { "IP-DV-001": record, "IP-OLD-999": createInteractivePracticeRecord("IP-OLD-999") } });
    const parsed = parseInteractivePracticeImport(valid, ["IP-DV-001"], {});
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.preview.known).toBe(1);
      expect(parsed.preview.unknown).toBe(1);
      expect(parsed.unknownPracticeIds).toEqual(["IP-OLD-999"]);
    }
    expect(parseInteractivePracticeImport("{", ["IP-DV-001"]).ok).toBe(false);
    expect(parseInteractivePracticeImport(JSON.stringify({ schemaVersion: 2, source: "planestudio.interactive-practice", practices: {} }), ["IP-DV-001"])).toEqual({
      ok: false,
      error: "Este archivo fue creado por una versión más reciente de PlanEstudio.",
    });
    expect(parseInteractivePracticeImport(JSON.stringify({ schemaVersion: 1, source: "otro", practices: {} }), ["IP-DV-001"]).ok).toBe(false);
    expect(parseInteractivePracticeImport("null", ["IP-DV-001"]).ok).toBe(false);
    expect(parseInteractivePracticeImport(JSON.stringify({ schemaVersion: 1, source: "planestudio.interactive-practice" }), ["IP-DV-001"]).ok).toBe(false);
    expect(parseInteractivePracticeImport(JSON.stringify({ schemaVersion: 1, source: "planestudio.interactive-practice", practices: { "IP-DV-001": { practiceId: "IP-DV-001" } } }), ["IP-DV-001"])).toEqual({
      ok: false,
      error: "El archivo tiene campos faltantes o registros corruptos.",
    });
    expect(parseInteractivePracticeImport("x".repeat(512_001), ["IP-DV-001"]).ok).toBe(false);
  });

  it("migrates version 0 imports and reports add/update preview", () => {
    const record = createInteractivePracticeRecord("IP-DV-001");
    const migrated = parseInteractivePracticeImport(
      JSON.stringify({ schemaVersion: 0, source: "planestudio.interactive-practice", records: { "IP-DV-001": record } }),
      ["IP-DV-001"],
      { "IP-DV-001": record }
    );
    expect(migrated.ok).toBe(true);
    if (migrated.ok) {
      expect(migrated.preview.willUpdate).toBe(1);
      expect(migrated.data.practices["IP-DV-001"]?.schemaVersion).toBe(1);
    }
    expect(parseInteractivePracticeImport(JSON.stringify({ schemaVersion: 0, source: "planestudio.interactive-practice" }), ["IP-DV-001"]).ok).toBe(false);
  });

  it("merges preserving mastery, hints, solution reveal and newest activity", () => {
    const current: InteractivePracticeRecord = {
      ...createInteractivePracticeRecord("IP-DV-001", "2026-08-10T00:00:00.000Z"),
      status: "completed",
      mastery: "learning",
      attemptCount: 1,
      bestScore: 80,
      hintsUsed: ["h1"],
      lastActivityAt: "2026-08-10T01:00:00.000Z",
    };
    const incoming: InteractivePracticeRecord = {
      ...createInteractivePracticeRecord("IP-DV-001", "2026-08-09T00:00:00.000Z"),
      status: "in-progress",
      mastery: "proficient",
      attemptCount: 3,
      bestScore: 100,
      lastScore: 100,
      hintsUsed: ["h2"],
      solutionRevealed: true,
      lastActivityAt: "2026-08-11T01:00:00.000Z",
      lastAnswer: ["one-many"],
    };
    const merged = mergeInteractivePracticeRecords({ "IP-DV-001": current }, { "IP-DV-001": incoming }, ["IP-DV-001"]);
    expect(merged["IP-DV-001"]?.status).toBe("completed");
    expect(merged["IP-DV-001"]?.mastery).toBe("proficient");
    expect(merged["IP-DV-001"]?.attemptCount).toBe(3);
    expect(merged["IP-DV-001"]?.hintsUsed).toEqual(["h1", "h2"]);
    expect(merged["IP-DV-001"]?.solutionRevealed).toBe(true);
    expect(merged["IP-DV-001"]?.lastAnswer).toEqual(["one-many"]);
    expect(mergeInteractivePracticeRecords({}, { "IP-OLD-999": incoming }, ["IP-DV-001"])).toEqual({});
  });

  it("keeps current last activity when it is newer and imports a new known record", () => {
    const current: InteractivePracticeRecord = {
      ...createInteractivePracticeRecord("IP-DV-001", "2026-08-11T00:00:00.000Z"),
      status: "completed",
      mastery: "proficient",
      lastScore: 100,
      lastAnswer: ["current"],
      lastActivityAt: "2026-08-12T00:00:00.000Z",
    };
    const incoming: InteractivePracticeRecord = {
      ...createInteractivePracticeRecord("IP-DV-001", "not-a-date"),
      status: "in-progress",
      mastery: "needs-review",
      lastScore: 20,
      lastAnswer: ["incoming"],
      lastActivityAt: "2026-08-10T00:00:00.000Z",
      completedAt: undefined,
    };
    const added = createInteractivePracticeRecord("IP-QRY-001");
    const merged = mergeInteractivePracticeRecords({ "IP-DV-001": current }, { "IP-DV-001": incoming, "IP-QRY-001": added }, ["IP-DV-001", "IP-QRY-001"]);
    expect(merged["IP-DV-001"]?.lastScore).toBe(100);
    expect(merged["IP-DV-001"]?.lastAnswer).toEqual(["current"]);
    expect(merged["IP-QRY-001"]?.practiceId).toBe("IP-QRY-001");
  });

  it("replaces only known interactive records and builds review queue", () => {
    const needsReview = { ...createInteractivePracticeRecord("IP-DV-001"), mastery: "needs-review" as const, attemptCount: 2 };
    const solved = { ...createInteractivePracticeRecord("IP-QRY-001"), mastery: "proficient" as const, solutionRevealed: true };
    const replaced = replaceInteractivePracticeRecords({ "IP-DV-001": needsReview, "IP-QRY-001": solved, "IP-OLD-999": createInteractivePracticeRecord("IP-OLD-999") }, ["IP-DV-001", "IP-QRY-001"]);
    expect(Object.keys(replaced).sort()).toEqual(["IP-DV-001", "IP-QRY-001"]);
    const queue = getInteractivePracticeReviewQueue(
      [
        { id: "IP-QRY-001", level: "advanced" as const },
        { id: "IP-DV-001", level: "starter" as const },
        { id: "IP-PA-001", level: "junior" as const },
        { id: "IP-PA-002", level: "starter" as const },
      ],
      {
        ...replaced,
        "IP-PA-001": { ...createInteractivePracticeRecord("IP-PA-001"), events: [{ type: "abandoned", at: "2026-08-11T00:00:00.000Z" }] },
        "IP-PA-002": { ...createInteractivePracticeRecord("IP-PA-002") },
      }
    );
    expect(queue.map((practice) => practice.id)).toEqual(["IP-DV-001", "IP-QRY-001", "IP-PA-001"]);
  });
});

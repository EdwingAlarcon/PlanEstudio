import { describe, expect, it } from "vitest";
import {
  buildSelfAssessment,
  calculatePracticeCounts,
  canCompletePractice,
  createPracticeRecord,
  getRecommendedPractice,
  sanitizePracticeProgressState,
  transitionPracticeStatus,
} from "../practice-progress";

const rubric = [
  { criterion: "Diagnóstico", weight: 50 },
  { criterion: "Validación", weight: 50 },
];

describe("practice progress model", () => {
  it("creates a safe initial record with evidence defaults", () => {
    const record = createPracticeRecord("INC-001", ["incident-report", "test-results"]);

    expect(record.status).toBe("not_started");
    expect(record.schemaVersion).toBe(1);
    expect(record.attemptCount).toBe(0);
    expect(record.evidenceChecklist).toEqual({ "incident-report": false, "test-results": false });
  });

  it("supports the explicit transition path and rejects unrelated jumps", () => {
    expect(transitionPracticeStatus("not_started", "in_progress")).toBe("in_progress");
    expect(transitionPracticeStatus("in_progress", "attempted")).toBe("attempted");
    expect(transitionPracticeStatus("attempted", "reviewed")).toBe("reviewed");
    expect(transitionPracticeStatus("reviewed", "completed")).toBe("completed");
    expect(transitionPracticeStatus("completed", "needs_reinforcement")).toBe("needs_reinforcement");
    expect(transitionPracticeStatus("needs_reinforcement", "in_progress")).toBe("in_progress");
    expect(transitionPracticeStatus("not_started", "completed")).toBe("not_started");
  });

  it("calculates rubric score and blocks critical failures", () => {
    const good = buildSelfAssessment(rubric, { Diagnóstico: "solid", Validación: "excellent" });
    const critical = buildSelfAssessment(rubric, { Diagnóstico: "excellent", Validación: "excellent" }, {}, ["No contemplé rollback"]);

    expect(good.score).toBe(93);
    expect(good.satisfactory).toBe(true);
    expect(critical.score).toBe(100);
    expect(critical.satisfactory).toBe(false);
  });

  it("requires attempt, evidence and satisfactory self-assessment before completion", () => {
    const record = createPracticeRecord("CH-001", ["test-plan"]);
    expect(canCompletePractice(record, ["test-plan"]).ok).toBe(false);

    const ready = {
      ...record,
      status: "reviewed" as const,
      attemptCount: 1,
      evidenceChecklist: { "test-plan": true },
      selfAssessment: buildSelfAssessment(rubric, { Diagnóstico: "solid", Validación: "solid" }),
    };
    expect(canCompletePractice(ready, ["test-plan"]).ok).toBe(true);
  });

  it("sanitizes corrupt or legacy persisted data", () => {
    const state = sanitizePracticeProgressState({
      records: {
        bad: { practiceId: "", status: "completed" },
        good: { practiceId: "INC-002", status: "wat", attemptCount: "2", revealedHints: ["hint-1", 99], evidenceChecklist: { a: true, b: "no" } },
      },
    });

    expect(Object.keys(state.records)).toEqual(["INC-002"]);
    expect(state.records["INC-002"]?.status).toBe("not_started");
    expect(state.records["INC-002"]?.attemptCount).toBe(2);
    expect(state.records["INC-002"]?.revealedHints).toEqual(["hint-1"]);
    expect(state.records["INC-002"]?.evidenceChecklist).toEqual({ a: true });
    expect(sanitizePracticeProgressState("not json")).toEqual({ records: {} });
  });

  it("summarizes counts and recommends deterministically", () => {
    const practices = [
      { id: "INC-001", slug: "inc-001", title: "Incidente", prerequisites: { modules: [16], labs: [] }, domain: "support-troubleshooting" as const, practiceType: "incident" as const },
      { id: "CH-001", slug: "ch-001", title: "Challenge", prerequisites: { modules: [2], labs: [] }, domain: "configuration-implementation" as const, practiceType: "challenge" as const },
    ];
    const records = {
      "INC-001": { ...createPracticeRecord("INC-001"), status: "in_progress" as const, lastActivityAt: "2026-01-01T00:00:00.000Z" },
    };

    expect(calculatePracticeCounts(records).started).toBe(1);
    expect(getRecommendedPractice(practices, records, ["basico-2"])?.practiceId).toBe("INC-001");
    expect(getRecommendedPractice(practices, { "INC-001": { ...records["INC-001"], status: "completed" as const } }, ["basico-2"])?.practiceId).toBe("CH-001");
  });
});

import { describe, expect, it } from "vitest";
import {
  buildSelfAssessment,
  addExternalReviewToRecord,
  calculatePracticeCounts,
  canCompletePractice,
  compareLatestAttempts,
  createPracticeRecord,
  getAttemptReviews,
  getLatestExternalReview,
  getPracticeValidationStatusLabel,
  getRecommendedPractice,
  sanitizePracticeProgressState,
  transitionPracticeStatus,
  type ExternalPracticeReview,
} from "../practice-progress";

const rubric = [
  { criterion: "Diagnóstico", weight: 50 },
  { criterion: "Validación", weight: 50 },
];

describe("practice progress model", () => {
  function review(overrides: Partial<ExternalPracticeReview> = {}): ExternalPracticeReview {
    return {
      id: "REV-1",
      reviewId: "REV-1",
      practiceId: "INC-001",
      attemptId: "attempt-1",
      reviewedAt: "2026-01-02T00:00:00.000Z",
      reviewerAlias: "mentora",
      reviewerDisplayName: "Mentora externa",
      reviewerType: "mentor",
      result: "requires_changes",
      criterionScores: { Diagnóstico: "solid", Validación: "partial" },
      criteria: [
        { criterion: "Diagnóstico", weight: 50, level: "solid" },
        { criterion: "Validación", weight: 50, level: "partial" },
      ],
      score: 63,
      criticalFailures: [],
      comments: "Debe reforzar validación.",
      strengths: "Buen diagnóstico.",
      improvements: "Agregar evidencia de regresión.",
      requiresResubmission: true,
      status: "final",
      source: "imported",
      schemaVersion: 2,
      ...overrides,
    };
  }

  it("creates a safe initial record with evidence defaults", () => {
    const record = createPracticeRecord("INC-001", ["incident-report", "test-results"]);

    expect(record.status).toBe("not_started");
    expect(record.schemaVersion).toBe(2);
    expect(record.attemptCount).toBe(0);
    expect(record.attempts).toEqual([]);
    expect(record.validationStatus).toBe("unvalidated");
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

  it("migrates legacy aggregate data into a historical attempt", () => {
    const state = sanitizePracticeProgressState({
      records: {
        "INC-001": {
          practiceId: "INC-001",
          status: "completed",
          attemptCount: 1,
          firstStartedAt: "2026-01-01T00:00:00.000Z",
          lastActivityAt: "2026-01-01T00:10:00.000Z",
          completedAt: "2026-01-01T00:20:00.000Z",
          revealedHints: ["hint-1"],
          solutionViewed: true,
          evidenceChecklist: { a: true },
          notes: "legacy note",
          selfAssessment: buildSelfAssessment(rubric, { Diagnóstico: "solid", Validación: "solid" }),
        },
      },
    });

    const record = state.records["INC-001"];
    expect(record?.attempts).toHaveLength(1);
    expect(record?.attempts[0]?.status).toBe("completed");
    expect(record?.attempts[0]?.reflection).toBe("legacy note");
    expect(record?.validationStatus).toBe("self_assessed");
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

  it("compares attempts only when two assessed attempts exist", () => {
    const empty = createPracticeRecord("INC-001");
    expect(compareLatestAttempts(empty).scoreDelta).toBe(0);
    expect(getPracticeValidationStatusLabel("externally_reviewed")).toBe("Revisada externamente");

    const weak = buildSelfAssessment(rubric, { Diagnóstico: "partial", Validación: "partial" });
    const strong = buildSelfAssessment(rubric, { Diagnóstico: "solid", Validación: "excellent" });
    const compared = compareLatestAttempts({
      ...empty,
      attempts: [
        {
          id: "a1",
          attemptNumber: 1,
          startedAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
          status: "completed",
          revealedHintIds: ["hint-1"],
          solutionViewed: true,
          evidenceChecklist: {},
          selfAssessment: weak,
          score: weak.score,
          criticalFailures: [],
          schemaVersion: 2,
        },
        {
          id: "a2",
          attemptNumber: 2,
          startedAt: "2026-01-02T00:00:00.000Z",
          updatedAt: "2026-01-02T00:00:00.000Z",
          status: "active",
          revealedHintIds: [],
          solutionViewed: false,
          evidenceChecklist: {},
          selfAssessment: strong,
          score: strong.score,
          criticalFailures: [],
          schemaVersion: 2,
        },
      ],
    });

    expect(compared.improved).toEqual(["Diagnóstico", "Validación"]);
    expect(compared.scoreDelta).toBeGreaterThan(0);
  });

  it("associates multiple external reviews with attempts and updates validation counts", () => {
    const assessment = buildSelfAssessment(rubric, { Diagnóstico: "solid", Validación: "solid" });
    const record = {
      ...createPracticeRecord("INC-001"),
      status: "attempted" as const,
      attemptCount: 1,
      attempts: [{
        id: "attempt-1",
        attemptNumber: 1,
        startedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        status: "submitted" as const,
        revealedHintIds: [],
        solutionViewed: false,
        evidenceChecklist: {},
        selfAssessment: assessment,
        score: assessment.score,
        criticalFailures: [],
        schemaVersion: 2,
      }],
      externalReviews: [],
    };

    const first = addExternalReviewToRecord(record, review());
    const second = addExternalReviewToRecord(first, review({ id: "REV-2", reviewId: "REV-2", reviewedAt: "2026-01-03T00:00:00.000Z", result: "approved", requiresResubmission: false, improvements: "" }));
    const counts = calculatePracticeCounts({ "INC-001": second });

    expect(first.status).toBe("needs_reinforcement");
    expect(second.validationStatus).toBe("externally_reviewed");
    expect(getAttemptReviews(second, "attempt-1")).toHaveLength(2);
    expect(getLatestExternalReview(second)?.id).toBe("REV-2");
    expect(counts.externalReviews).toBe(2);
    expect(counts.externallyApproved).toBe(1);
  });
});

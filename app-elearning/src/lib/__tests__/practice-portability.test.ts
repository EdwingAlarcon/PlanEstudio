import { describe, expect, it } from "vitest";
import {
  applyPracticeImport,
  createEvidencePackage,
  createPracticeProgressExport,
  createReviewTemplate,
  evidencePackageMarkdown,
  mergePracticeRecord,
  parseExternalReviewImportText,
  parsePracticeImportText,
  practiceBackupFileName,
  serializePracticeProgressExport,
  validatePracticeImportPayload,
} from "../practice-portability";
import {
  buildSelfAssessment,
  compareLatestAttempts,
  createPracticeRecord,
  type PracticeProgressRecord,
} from "../practice-progress";
import type { PracticeInfo } from "../practices";

const rubric = [
  { criterion: "Diagnóstico", weight: 50 },
  { criterion: "Validación", weight: 50 },
];

const practice = {
  id: "INC-001",
  slug: "inc-001-seguridad",
  title: "Seguridad",
  practiceType: "incident",
  difficulty: "practitioner",
  domain: "support-troubleshooting",
  roles: ["support-analyst"],
  rubric,
  evidence: {
    required: ["incident-report"],
    optional: [],
    format: "Markdown",
    qualityCriteria: ["Sin secretos"],
    sensitiveDataWarning: "No uses datos reales.",
    artifactTypes: ["simulated", "sandbox-reproducible"],
  },
} satisfies Pick<PracticeInfo, "id" | "slug" | "title" | "practiceType" | "difficulty" | "domain" | "roles" | "rubric" | "evidence">;

function recordWithAttempt(scoreLevel: "partial" | "solid", attemptNumber = 1): PracticeProgressRecord {
  const assessment = buildSelfAssessment(rubric, { Diagnóstico: scoreLevel, Validación: scoreLevel });
  return {
    ...createPracticeRecord("INC-001", ["incident-report"]),
    status: "attempted",
    firstStartedAt: "2026-01-01T00:00:00.000Z",
    lastActivityAt: `2026-01-0${attemptNumber}T00:00:00.000Z`,
    attemptCount: attemptNumber,
    evidenceChecklist: { "incident-report": true },
    selfAssessment: assessment,
    notes: "nota local",
    validationStatus: "self_assessed",
    activeAttemptId: `attempt-${attemptNumber}`,
    attempts: [{
      id: `attempt-${attemptNumber}`,
      attemptNumber,
      startedAt: `2026-01-0${attemptNumber}T00:00:00.000Z`,
      updatedAt: `2026-01-0${attemptNumber}T00:10:00.000Z`,
      status: "active",
      revealedHintIds: attemptNumber === 1 ? ["hint-1"] : [],
      solutionViewed: false,
      evidenceChecklist: { "incident-report": true },
      selfAssessment: assessment,
      score: assessment.score,
      criticalFailures: [],
      reflection: `reflexión ${attemptNumber}`,
      schemaVersion: 2,
    }],
    externalReviews: [],
  };
}

describe("practice portability", () => {
  function externalReviewPayload(overrides: Record<string, unknown> = {}) {
    return {
      format: "planestudio-external-review",
      schemaVersion: 1,
      reviewId: "REV-INC-001-1",
      practiceId: "INC-001",
      attemptId: "attempt-1",
      reviewedAt: "2026-01-02T00:00:00.000Z",
      reviewer: { displayName: "Mentora externa", alias: "mentora" },
      result: "approved_with_observations",
      criteria: [
        { criterion: "Diagnóstico", weight: 50, level: "solid", comment: "Bien sustentado." },
        { criterion: "Validación", weight: 50, level: "adequate", comment: "Falta evidencia visual." },
      ],
      score: 78,
      criticalFindings: [],
      strengths: ["Buen análisis de causa raíz."],
      improvements: ["Añadir prueba de regresión."],
      summary: "Revisión externa importable.",
      resubmissionRequired: false,
      ...overrides,
    };
  }

  it("exports a versioned backup without academic progress", () => {
    const payload = createPracticeProgressExport({ "INC-001": recordWithAttempt("solid") });
    const json = serializePracticeProgressExport(payload);

    expect(payload.format).toBe("planestudio-practice-progress");
    expect(payload.schemaVersion).toBe(2);
    expect(payload.metadata.recordCount).toBe(1);
    expect(json).toContain("INC-001");
    expect(json).not.toContain("completedModules");
    expect(practiceBackupFileName(new Date("2026-07-29T00:00:00.000Z"))).toBe("planestudio-practicas-2026-07-29.json");
  });

  it("can exclude notes from backup", () => {
    const payload = createPracticeProgressExport({ "INC-001": recordWithAttempt("solid") }, { includeNotes: false });

    expect(payload.records["INC-001"]?.notes).toBe("");
    expect(payload.records["INC-001"]?.attempts[0]?.reflection).toBe("");
  });

  it("validates valid, corrupt, future and unknown-practice imports", () => {
    const payload = createPracticeProgressExport({ "INC-001": recordWithAttempt("solid") });
    expect(parsePracticeImportText(JSON.stringify(payload), ["INC-001"]).status).toBe("valid");
    expect(parsePracticeImportText("{bad", ["INC-001"]).status).toBe("corrupt");
    expect(parsePracticeImportText("x".repeat(1_000_001), ["INC-001"]).errors[0]).toMatch(/tamaño máximo/);
    expect(validatePracticeImportPayload("no object", ["INC-001"]).status).toBe("corrupt");
    expect(validatePracticeImportPayload({ format: "otro", schemaVersion: 2 }, ["INC-001"]).errors[0]).toMatch(/formato/);
    expect(validatePracticeImportPayload({ ...payload, schemaVersion: 99 }, ["INC-001"]).status).toBe("incompatible");
    const unknown = validatePracticeImportPayload(createPracticeProgressExport({ "OLD-001": { ...recordWithAttempt("solid"), practiceId: "OLD-001" } }), ["INC-001"]);
    expect(unknown.unknownPracticeIds).toEqual(["OLD-001"]);
    expect(unknown.records["OLD-001"]?.archived).toBe(true);
  });

  it("rejects structurally unsafe records before import", () => {
    const record = recordWithAttempt("solid");
    const firstAttempt = record.attempts[0];
    if (!firstAttempt) throw new Error("fixture inválida");
    const duplicateActive = {
      ...record,
      attempts: [
        firstAttempt,
        { ...firstAttempt, id: "attempt-2", attemptNumber: 2, completedAt: "2025-01-01T00:00:00.000Z" },
      ],
    };
    const preview = validatePracticeImportPayload(createPracticeProgressExport({ "INC-001": duplicateActive }), ["INC-001"]);

    expect(preview.status).toBe("corrupt");
    expect(preview.errors.join(" ")).toMatch(/más de un intento activo|completedAt anterior/);
  });

  it("migrates legacy v1 records into attempt history", () => {
    const preview = validatePracticeImportPayload({
      schemaVersion: 1,
      records: {
        "INC-001": {
          practiceId: "INC-001",
          status: "attempted",
          attemptCount: 1,
          lastActivityAt: "2026-01-01T00:00:00.000Z",
          evidenceChecklist: { "incident-report": true },
        },
      },
    }, ["INC-001"]);

    expect(preview.status).toBe("valid");
    expect(preview.records["INC-001"]?.attempts).toHaveLength(1);
  });

  it("merges deterministically without duplicating attempts and concatenates conflicting notes", () => {
    const local = recordWithAttempt("partial", 1);
    const imported = { ...recordWithAttempt("solid", 2), notes: "nota importada" };
    const merged = mergePracticeRecord(local, imported);

    expect(merged.attempts).toHaveLength(2);
    expect(merged.attemptCount).toBe(2);
    expect(merged.notes).toContain("Nota importada");
    expect(applyPracticeImport({ "INC-001": local }, { "INC-001": imported }, "replace")["INC-001"]?.attemptCount).toBe(2);
  });

  it("compares latest assessed attempts and creates evidence/review artifacts", () => {
    const first = recordWithAttempt("partial", 1);
    const second = recordWithAttempt("solid", 2);
    const merged = { ...second, attempts: [...first.attempts, ...second.attempts] };
    const comparison = compareLatestAttempts(merged);
    const packageData = createEvidencePackage(practice, merged);
    const markdown = evidencePackageMarkdown(packageData);
    const review = createReviewTemplate(practice, merged.attempts.at(-1) ?? null);

    expect(comparison.scoreDelta).toBeGreaterThan(0);
    expect(markdown).toContain("Paquete de evidencia");
    expect(packageData.externalReviews).toEqual([]);
    expect(review).toContain("planestudio-external-review");
  });

  it("validates and normalizes external human review imports", () => {
    const record = recordWithAttempt("solid");
    const preview = parseExternalReviewImportText(JSON.stringify(externalReviewPayload()), practice, record);

    expect(preview.status).toBe("valid");
    expect(preview.review?.id).toBe("REV-INC-001-1");
    expect(preview.review?.score).toBe(78);
    expect(preview.review?.result).toBe("approved_with_observations");
    expect(preview.review?.criteria).toHaveLength(2);
  });

  it("rejects unsafe or inconsistent external reviews", () => {
    const record = recordWithAttempt("solid");
    const wrongPractice = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({ practiceId: "INC-999" })), practice, record);
    const wrongScore = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({ score: 99 })), practice, record);
    const unsafeJson = JSON.stringify(externalReviewPayload()).replace(/}$/, ',"__proto__":{"polluted":true}}');
    const unsafe = parseExternalReviewImportText(unsafeJson, practice, record);

    expect(wrongPractice.status).toBe("corrupt");
    expect(wrongPractice.errors.join(" ")).toMatch(/INC-999/);
    expect(wrongScore.errors.join(" ")).toMatch(/puntaje declarado/);
    expect(unsafe.status).toBe("corrupt");
  });

  it("covers external review parser edge cases and legacy score maps", () => {
    const record = recordWithAttempt("solid");
    expect(parseExternalReviewImportText("{bad", practice, record).status).toBe("corrupt");
    expect(parseExternalReviewImportText("x".repeat(500_001), practice, record).errors[0]).toMatch(/tamaño máximo/);
    expect(parseExternalReviewImportText(JSON.stringify({ ...externalReviewPayload(), schemaVersion: 99 }), practice, record).status).toBe("incompatible");
    expect(parseExternalReviewImportText(JSON.stringify({ ...externalReviewPayload(), format: "otro" }), practice, record).status).toBe("corrupt");

    const legacyScores = parseExternalReviewImportText(JSON.stringify({
      ...externalReviewPayload({
        format: "planestudio-practice-review",
        criteria: undefined,
        criterionScores: { Diagnóstico: "solid", Validación: "adequate" },
        reviewedAt: "2099-01-01T00:00:00.000Z",
      }),
    }), practice, record);
    expect(legacyScores.status).toBe("warning");
    expect(legacyScores.review?.score).toBe(78);
    expect(legacyScores.warnings.join(" ")).toMatch(/futuro/);
  });

  it("rejects contradictory external review decisions", () => {
    const record = recordWithAttempt("solid");
    const requiresNoImprovements = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({
      result: "requires_changes",
      improvements: [],
    })), practice, record);
    const approvedWithResubmission = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({
      result: "approved",
      score: 78,
      resubmissionRequired: true,
      improvements: ["Reentregar."],
    })), practice, record);
    const approvedWithCritical = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({
      result: "approved",
      score: 78,
      criticalFindings: ["Privilegios excesivos."],
    })), practice, record);
    const rejectedWithoutSummary = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({
      result: "rejected",
      summary: "No",
    })), practice, record);
    const missingAttempt = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({
      attemptId: "attempt-inexistente",
    })), practice, record);
    const missingReviewer = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({
      reviewer: {},
      reviewerAlias: "",
      reviewerDisplayName: "",
    })), practice, record);

    expect(requiresNoImprovements.errors.join(" ")).toMatch(/mejoras solicitadas/);
    expect(approvedWithResubmission.errors.join(" ")).toMatch(/approved no puede/);
    expect(approvedWithCritical.errors.join(" ")).toMatch(/fallos críticos/);
    expect(rejectedWithoutSummary.errors.join(" ")).toMatch(/resumen claro/);
    expect(missingAttempt.errors.join(" ")).toMatch(/intento indicado/);
    expect(missingReviewer.errors.join(" ")).toMatch(/reviewer/);
  });

  it("detects duplicate and conflicting external review IDs", () => {
    const record = recordWithAttempt("solid");
    const imported = parseExternalReviewImportText(JSON.stringify(externalReviewPayload()), practice, record).review;
    if (!imported) throw new Error("fixture inválida");
    const withReview = { ...record, externalReviews: [imported] };

    const duplicate = parseExternalReviewImportText(JSON.stringify(externalReviewPayload()), practice, withReview);
    const conflict = parseExternalReviewImportText(JSON.stringify(externalReviewPayload({ summary: "Cambio posterior del revisor." })), practice, withReview);

    expect(duplicate.status).toBe("duplicate");
    expect(conflict.status).toBe("conflict");
  });
});

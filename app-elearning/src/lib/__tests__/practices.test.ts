import { describe, expect, it } from "vitest";
import {
  getAllPractices,
  getPracticeBySlug,
  getPracticeCompetencyMatrix,
  getPracticeCounts,
  getPracticeSearchDocuments,
  PRACTICE_DIFFICULTIES,
  PRACTICE_DOMAINS,
  PRACTICE_ROLES,
  PRACTICE_TYPES,
  EVIDENCE_ARTIFACT_TYPES,
} from "../practices";

describe("professional practices content", () => {
  it("loads the expanded professional practice scope", () => {
    const counts = getPracticeCounts();

    expect(counts.total).toBe(27);
    expect(counts.incidents).toBe(13);
    expect(counts.challenges).toBe(6);
    expect(counts.simulations).toBe(2);
    expect(counts.guided).toBe(6);
  });

  it("validates controlled metadata vocabulary", () => {
    for (const practice of getAllPractices()) {
      expect(PRACTICE_TYPES).toContain(practice.practiceType);
      expect(PRACTICE_DOMAINS).toContain(practice.domain);
      expect(PRACTICE_DIFFICULTIES).toContain(practice.difficulty);
      expect(practice.roles.length).toBeGreaterThan(0);
      for (const role of practice.roles) expect(PRACTICE_ROLES).toContain(role);
      expect(practice.evidence.required.length).toBeGreaterThan(0);
      expect(practice.evidence.artifactTypes.length).toBeGreaterThan(0);
      for (const artifactType of practice.evidence.artifactTypes) expect(EVIDENCE_ARTIFACT_TYPES).toContain(artifactType);
      expect(practice.prerequisites.modules.length).toBeGreaterThan(0);
      expect(practice.prerequisites.labs.length).toBeGreaterThan(0);
    }
  });

  it("has stable unique routes and ids", () => {
    const practices = getAllPractices();
    const ids = new Set(practices.map((practice) => practice.id));
    const slugs = new Set(practices.map((practice) => practice.slug));

    expect(ids.size).toBe(practices.length);
    expect(slugs.size).toBe(practices.length);
    expect(getPracticeBySlug("inc-001-seguridad-dataverse-oportunidades")?.id).toBe("INC-001");
  });

  it("rubrics sum to 100 percent", () => {
    for (const practice of getAllPractices()) {
      const total = practice.rubric.reduce((sum, item) => sum + item.weight, 0);
      expect(total).toBe(100);
    }
  });

  it("validates staged hints and indexes practices for global search", () => {
    for (const practice of getAllPractices()) {
      expect(practice.hints).toHaveLength(4);
      expect(practice.hints.map((hint) => hint.id)).toEqual(["hint-1", "hint-2", "hint-3", "hint-4"]);
      expect(practice.hints.every((hint) => hint.title.length > 0 && hint.content.length > 0)).toBe(true);
    }

    const searchDocs = getPracticeSearchDocuments();
    expect(searchDocs).toHaveLength(27);
    expect(searchDocs.find((doc) => doc.practiceId === "INC-001")?.content).toMatch(/security-roles|Dataverse/i);
    expect(searchDocs.map((doc) => doc.href)).toContain("/experiencia-practica/inc-001-seguridad-dataverse-oportunidades");
  });

  it("incident labs include protected solution material and RCA language", () => {
    const incidents = getAllPractices().filter((practice) => practice.practiceType === "incident");

    expect(incidents).toHaveLength(13);
    for (const incident of incidents) {
      expect(incident.rawContent).toContain("## Solución de referencia");
      expect(incident.rawContent.toLowerCase()).toContain("causa raíz");
      expect(incident.evidence.required).toContain("root-cause-analysis");
    }
  });

  it("competency matrix covers the required professional competencies honestly", () => {
    const matrix = getPracticeCompetencyMatrix();
    const competencies = matrix.map((row) => row.competency);

    expect(matrix.length).toBeGreaterThanOrEqual(20);
    expect(competencies).toContain("análisis de requerimientos");
    expect(competencies).toContain("debugging");
    expect(competencies).toContain("observabilidad");
    expect(matrix.some((row) => row.coverageState === "partial")).toBe(true);
    expect(matrix.some((row) => row.gap.includes("tenant") || row.gap.includes("real"))).toBe(true);
  });
});

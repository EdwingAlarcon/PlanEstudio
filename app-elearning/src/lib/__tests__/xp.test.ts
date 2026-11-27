import { describe, expect, it } from "vitest";
import { createInteractivePracticeRecord, type InteractivePracticeRecord } from "../interactive-practice-progress";
import type { ReviewCardMap } from "../review-queue";
import type { LabEvidence } from "../lab-mission";
import { getAllLevels, getLabsForLevel } from "../content";
import { CERTIFICATION_LEVEL_ORDER } from "../i18n";
import { getAllInteractivePractices } from "../interactive-practices";
import { calculateXp, formatXp, getRank, isPracticeEarned, isQuizEarned, RANKS, XP_RULES } from "../xp";

function practice(id: string, patch: Partial<InteractivePracticeRecord>): InteractivePracticeRecord {
  return { ...createInteractivePracticeRecord(id, "2026-11-27T10:00:00.000Z"), ...patch };
}

const empty = { quizScores: {}, completedLabs: [], practiceRecords: {}, reviewCards: {} as ReviewCardMap };

describe("calculateXp", () => {
  it("empieza en 0 y no da XP por marcar módulos como leídos", () => {
    expect(calculateXp(empty).total).toBe(0);
  });

  it("solo cuenta prácticas completadas sin ver la solución", () => {
    const xp = calculateXp({
      ...empty,
      practiceRecords: {
        a: practice("a", { status: "completed" }),
        b: practice("b", { status: "completed", solutionRevealed: true }),
        c: practice("c", { status: "in-progress" }),
      },
    });
    expect(xp.counts.practices).toBe(1);
    expect(xp.practices).toBe(XP_RULES.practice);
  });

  it("cuenta quizzes con 80 % o más, labs únicos y respuestas correctas del repaso", () => {
    const xp = calculateXp({
      quizScores: { "1": 80, "2": 79, "3": 100 },
      completedLabs: ["lab-02", "lab-02", "lab-03"],
      practiceRecords: {},
      reviewCards: {
        q1: { correctReviews: 3 },
        q2: { correctReviews: 2 },
        q3: { correctReviews: Number.NaN },
      } as unknown as ReviewCardMap,
    });
    expect(xp.quizzes).toBe(2 * XP_RULES.quiz);
    expect(xp.labs).toBe(2 * XP_RULES.lab);
    expect(xp.review).toBe(5 * XP_RULES.reviewCorrect);
    expect(xp.total).toBe(xp.quizzes + xp.labs + xp.review);
  });

  it("expone los criterios de ganancia por separado", () => {
    expect(isQuizEarned(undefined)).toBe(false);
    expect(isQuizEarned(80)).toBe(true);
    expect(isPracticeEarned(undefined)).toBe(false);
  });
});

describe("getRank", () => {
  it("empieza en Aprendiz I", () => {
    const rank = getRank(0);
    expect(rank.label).toBe("Aprendiz I");
    expect(rank.next).toBe(150);
    expect(rank.percentage).toBe(0);
  });

  it("calcula el grado y el avance dentro de él", () => {
    const rank = getRank(1850);
    expect(rank.label).toBe("Consultor funcional I");
    expect(rank.nextLabel).toBe("Consultor funcional II");
    expect(rank.percentage).toBe(50);
  });

  it("los umbrales suben siempre y el último grado no tiene siguiente", () => {
    const floors = RANKS.flatMap((r) => [...r.thresholds]);
    expect(floors).toEqual([...floors].sort((a, b) => a - b));
    expect(new Set(floors).size).toBe(floors.length);
    const top = getRank(1_000_000);
    expect(top.label).toBe("Arquitecto III");
    expect(top.next).toBeNull();
    expect(top.percentage).toBe(100);
  });

  it("tolera valores no válidos", () => {
    expect(getRank(-10).label).toBe("Aprendiz I");
    expect(getRank(Number.NaN).label).toBe("Aprendiz I");
  });
});

describe("formatXp", () => {
  it("agrupa miles con punto", () => {
    expect(formatXp(0)).toBe("0");
    expect(formatXp(1840)).toBe("1.840");
    expect(formatXp(1234567)).toBe("1.234.567");
  });
});

// Calibración con el contenido real: terminar cada nivel de certificación (todas sus prácticas sin solución, sus
// quizzes aprobados y sus labs obligatorios, sin repaso) debe dejar al alumno en el rol de ese nivel.
describe("labs con evidencia", () => {
  it("un lab completado vale 25 y, con la evidencia entregada, 100", () => {
    const labs = ["lab-a", "lab-b"];
    const plain = calculateXp({ ...empty, completedLabs: labs });
    expect(plain.labs).toBe(2 * XP_RULES.lab);
    const withEvidence = calculateXp({
      ...empty,
      completedLabs: labs,
      labEvidence: { "lab-a": { checks: [], note: "x", verifiedAt: "2026-11-27" }, "lab-c": { checks: [], note: "", verifiedAt: "2026-11-27" } },
    });
    expect(withEvidence.labs).toBe(XP_RULES.labVerified + XP_RULES.lab);
    expect(withEvidence.counts.verifiedLabs).toBe(1);
  });
});

describe("rank calibration", () => {
  const expected = ["Maker", "Consultor funcional", "Desarrollador", "Arquitecto"];
  const levels = getAllLevels();
  const practices = getAllInteractivePractices();

  it("cada nivel completo lleva al rol que prepara", () => {
    const quizScores: Record<string, number> = {};
    const completedLabs: string[] = [];
    const labEvidence: Record<string, LabEvidence> = {};
    const practiceRecords: Record<string, InteractivePracticeRecord> = {};

    CERTIFICATION_LEVEL_ORDER.forEach((levelId, index) => {
      const level = levels.find((l) => l.id === levelId)!;
      const moduleIds = new Set(level.modules.map((m) => m.moduleId));
      for (const id of moduleIds) quizScores[String(id)] = 100;
      for (const lab of getLabsForLevel(levelId)) {
        completedLabs.push(lab.slug);
        labEvidence[lab.slug] = { checks: [], note: "", verifiedAt: "2026-11-27T10:00:00.000Z" };
      }
      for (const p of practices) {
        if (moduleIds.has(p.relatedModuleIds[0] ?? -1)) practiceRecords[p.id] = practice(p.id, { status: "completed" });
      }
      const xp = calculateXp({ quizScores, completedLabs, labEvidence, practiceRecords, reviewCards: {} });
      expect(getRank(xp.total).name, `${levelId}: ${xp.total} XP`).toBe(expected[index]);
    });
  });
});

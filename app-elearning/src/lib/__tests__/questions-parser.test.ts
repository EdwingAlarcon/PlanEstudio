import { describe, it, expect } from "vitest";
import { getAllQuestions, getQuestionsForModule, getQuestionsForLevel } from "../questions-parser";
import { LEVEL_MODULE_RANGE } from "../i18n";

// ─── Integrity of the full question bank ─────────────────────────────────────

describe("getAllQuestions — bank integrity", () => {
  const all = getAllQuestions();

  it("loads at least 200 questions", () => {
    expect(all.length).toBeGreaterThanOrEqual(200);
  });

  it("every question has a unique id", () => {
    const ids = all.map((q) => q.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every question has a non-empty prompt", () => {
    all.forEach((q) => {
      expect(q.prompt.trim().length, `${q.id}: empty prompt`).toBeGreaterThan(0);
    });
  });

  it("every question has at least 2 options", () => {
    all.forEach((q) => {
      expect(q.options.length, `${q.id}: too few options`).toBeGreaterThanOrEqual(2);
    });
  });

  it("every option is a non-empty string", () => {
    all.forEach((q) => {
      q.options.forEach((opt, i) => {
        expect(typeof opt, `${q.id} option[${i}]: not a string`).toBe("string");
        expect(opt.trim().length, `${q.id} option[${i}]: empty string`).toBeGreaterThan(0);
      });
    });
  });

  it("every answer index is within options range", () => {
    all.forEach((q) => {
      q.answer.forEach((a) => {
        expect(a, `${q.id}: answer index ${a} out of range`).toBeGreaterThanOrEqual(0);
        expect(a, `${q.id}: answer index ${a} >= ${q.options.length}`).toBeLessThan(q.options.length);
      });
    });
  });

  it("every question has at least one correct answer", () => {
    all.forEach((q) => {
      expect(q.answer.length, `${q.id}: no correct answer`).toBeGreaterThan(0);
    });
  });

  it("single-type questions have exactly one correct answer", () => {
    all
      .filter((q) => q.type === "single")
      .forEach((q) => {
        expect(q.answer.length, `${q.id}: single question with ${q.answer.length} answers`).toBe(1);
      });
  });

  it("multi-type questions have at least 2 correct answers", () => {
    all
      .filter((q) => q.type === "multi")
      .forEach((q) => {
        expect(q.answer.length, `${q.id}: multi question with only 1 answer`).toBeGreaterThanOrEqual(2);
      });
  });

  it("every question type is 'single' or 'multi'", () => {
    all.forEach((q) => {
      expect(["single", "multi"], `${q.id}: invalid type "${q.type}"`).toContain(q.type);
    });
  });

  it("moduleId values are between 1 and 41", () => {
    all.forEach((q) => {
      expect(q.moduleId, `${q.id}: moduleId out of range`).toBeGreaterThanOrEqual(1);
      expect(q.moduleId, `${q.id}: moduleId out of range`).toBeLessThanOrEqual(41);
    });
  });

  it("answer indices have no duplicates within a question", () => {
    all.forEach((q) => {
      const unique = new Set(q.answer);
      expect(unique.size, `${q.id}: duplicate answer indices`).toBe(q.answer.length);
    });
  });
});

// ─── getQuestionsForModule ────────────────────────────────────────────────────

describe("getQuestionsForModule", () => {
  it("returns questions for a known module", () => {
    const qs = getQuestionsForModule(1);
    expect(qs.length).toBeGreaterThan(0);
    qs.forEach((q) => expect(q.moduleId).toBe(1));
  });

  it("returns empty array for an unknown module", () => {
    expect(getQuestionsForModule(999)).toHaveLength(0);
  });

  it("all returned questions belong to the requested module", () => {
    [1, 5, 9, 18, 31].forEach((moduleId) => {
      getQuestionsForModule(moduleId).forEach((q) => {
        expect(q.moduleId).toBe(moduleId);
      });
    });
  });
});

// ─── getQuestionsForLevel ─────────────────────────────────────────────────────

describe("getQuestionsForLevel", () => {
  it("returns questions for basico (modules 1-8)", () => {
    const qs = getQuestionsForLevel("basico");
    expect(qs.length).toBeGreaterThan(0);
    const [min, max] = LEVEL_MODULE_RANGE.basico;
    qs.forEach((q) => {
      expect(q.moduleId).toBeGreaterThanOrEqual(min);
      expect(q.moduleId).toBeLessThanOrEqual(max);
    });
  });

  it("returns questions for all 4 levels", () => {
    (["basico", "intermedio", "avanzado", "arquitecto"] as const).forEach((level) => {
      const qs = getQuestionsForLevel(level);
      expect(qs.length, `No questions for level: ${level}`).toBeGreaterThan(0);
    });
  });

  it("returns empty array for unknown level", () => {
    expect(getQuestionsForLevel("desconocido")).toHaveLength(0);
  });

  it("level ranges do not overlap", () => {
    const basico = getQuestionsForLevel("basico").map((q) => q.moduleId);
    const intermedio = getQuestionsForLevel("intermedio").map((q) => q.moduleId);
    const avanzado = getQuestionsForLevel("avanzado").map((q) => q.moduleId);
    const arquitecto = getQuestionsForLevel("arquitecto").map((q) => q.moduleId);

    const basicoSet = new Set(basico);
    intermedio.forEach((id) => expect(basicoSet.has(id)).toBe(false));
    avanzado.forEach((id) => expect(basicoSet.has(id)).toBe(false));
    arquitecto.forEach((id) => expect(basicoSet.has(id)).toBe(false));
  });

  it("union of all levels equals full question bank", () => {
    const all = getAllQuestions().length;
    const sum =
      getQuestionsForLevel("basico").length +
      getQuestionsForLevel("intermedio").length +
      getQuestionsForLevel("avanzado").length +
      getQuestionsForLevel("arquitecto").length;
    expect(sum).toBe(all);
  });
});

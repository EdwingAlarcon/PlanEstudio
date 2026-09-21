import { describe, expect, it } from "vitest";
import { createInteractivePracticeRecord } from "../interactive-practice-progress";
import type { InteractivePracticeRecord } from "../interactive-practice-progress";
import { calculateModule11PilotMastery } from "../pilot-mastery";

function completed(id: string, overrides: Partial<InteractivePracticeRecord> = {}): InteractivePracticeRecord {
  return { ...createInteractivePracticeRecord(id), status: "completed", bestScore: 100, ...overrides };
}

describe("calculateModule11PilotMastery", () => {
  it("returns no-iniciado when nothing was opened", () => {
    expect(calculateModule11PilotMastery({})).toBe("no-iniciado");
  });

  it("returns aprendiendo once something started but the guided set isn't complete", () => {
    const records = { "IP-PA-002": createInteractivePracticeRecord("IP-PA-002", "2026-01-01T00:00:00.000Z") };
    records["IP-PA-002"].status = "in-progress";
    expect(calculateModule11PilotMastery(records)).toBe("aprendiendo");
  });

  it("returns practicado when guided + diagnosticar are complete but hints/attempts were heavy", () => {
    const records = {
      "IP-PA-002": completed("IP-PA-002"),
      "IP-PA-004": completed("IP-PA-004"),
      "IP-PA-005": completed("IP-PA-005", { hintsUsed: ["h1", "h2", "h3"], attemptCount: 4 }),
    };
    expect(calculateModule11PilotMastery(records)).toBe("practicado");
  });

  it("returns autonomo when diagnosticar was solved with minimal help and no transfer yet", () => {
    const records = {
      "IP-PA-002": completed("IP-PA-002"),
      "IP-PA-004": completed("IP-PA-004"),
      "IP-PA-005": completed("IP-PA-005", { hintsUsed: [], attemptCount: 1 }),
    };
    expect(calculateModule11PilotMastery(records)).toBe("autonomo");
  });

  it("returns transferido only when the transfer challenge is completed without revealing its solution", () => {
    const records = {
      "IP-PA-002": completed("IP-PA-002"),
      "IP-PA-004": completed("IP-PA-004"),
      "IP-PA-005": completed("IP-PA-005", { hintsUsed: [], attemptCount: 1 }),
      "IP-PA-006": completed("IP-PA-006", { solutionRevealed: false }),
    };
    expect(calculateModule11PilotMastery(records)).toBe("transferido");
  });

  it("caps at practicado when the transfer challenge was completed by revealing the solution", () => {
    const records = {
      "IP-PA-002": completed("IP-PA-002"),
      "IP-PA-004": completed("IP-PA-004"),
      "IP-PA-005": completed("IP-PA-005", { hintsUsed: [], attemptCount: 1 }),
      "IP-PA-006": completed("IP-PA-006", { solutionRevealed: true }),
    };
    expect(calculateModule11PilotMastery(records)).toBe("practicado");
  });
});

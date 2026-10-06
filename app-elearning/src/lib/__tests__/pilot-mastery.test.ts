import { describe, expect, it } from "vitest";
import { createInteractivePracticeRecord } from "../interactive-practice-progress";
import type { InteractivePracticeRecord } from "../interactive-practice-progress";
import { calculateModule10PilotMastery, calculateModule11PilotMastery, calculateModule13PilotMastery } from "../pilot-mastery";

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

  it("stays at autonomo (does not regress to practicado) when the transfer challenge was completed by revealing the solution", () => {
    const records = {
      "IP-PA-002": completed("IP-PA-002"),
      "IP-PA-004": completed("IP-PA-004"),
      "IP-PA-005": completed("IP-PA-005", { hintsUsed: [], attemptCount: 1 }),
      "IP-PA-006": completed("IP-PA-006", { solutionRevealed: true }),
    };
    expect(calculateModule11PilotMastery(records)).toBe("autonomo");
  });

  it("cannot reach transferido through the transfer challenge alone if diagnosticar used heavy help", () => {
    const records = {
      "IP-PA-002": completed("IP-PA-002"),
      "IP-PA-004": completed("IP-PA-004"),
      "IP-PA-005": completed("IP-PA-005", { hintsUsed: ["h1", "h2", "h3"], solutionRevealed: false }),
      "IP-PA-006": completed("IP-PA-006", { solutionRevealed: false }),
    };
    expect(calculateModule11PilotMastery(records)).toBe("practicado");
  });

  it("one hint on diagnosticar still allows autonomo — help is not automatic failure", () => {
    const records = {
      "IP-PA-002": completed("IP-PA-002"),
      "IP-PA-004": completed("IP-PA-004"),
      "IP-PA-005": completed("IP-PA-005", { hintsUsed: ["h1"], attemptCount: 2 }),
    };
    expect(calculateModule11PilotMastery(records)).toBe("autonomo");
  });
});

describe("calculateModule10PilotMastery (generalized calculatePilotMastery, Módulo 10 config)", () => {
  it("uses IP-APP ids instead of IP-PA and reproduces the same 5-state logic", () => {
    expect(calculateModule10PilotMastery({})).toBe("no-iniciado");

    const learning = { "IP-APP-003": { ...createInteractivePracticeRecord("IP-APP-003"), status: "in-progress" as const } };
    expect(calculateModule10PilotMastery(learning)).toBe("aprendiendo");

    const practiced = {
      "IP-APP-003": completed("IP-APP-003"),
      "IP-APP-004": completed("IP-APP-004"),
      "IP-APP-005": completed("IP-APP-005", { hintsUsed: ["h1", "h2", "h3"] }),
    };
    expect(calculateModule10PilotMastery(practiced)).toBe("practicado");

    const autonomous = {
      "IP-APP-003": completed("IP-APP-003"),
      "IP-APP-004": completed("IP-APP-004"),
      "IP-APP-005": completed("IP-APP-005", { hintsUsed: [] }),
    };
    expect(calculateModule10PilotMastery(autonomous)).toBe("autonomo");

    const transferred = {
      ...autonomous,
      "IP-APP-006": completed("IP-APP-006", { solutionRevealed: false }),
    };
    expect(calculateModule10PilotMastery(transferred)).toBe("transferido");
  });
});

describe("calculateModule13PilotMastery (generalized calculatePilotMastery, Módulo 13 config)", () => {
  it("uses IP-JS ids instead of IP-PA/IP-APP and reproduces the same 5-state logic", () => {
    expect(calculateModule13PilotMastery({})).toBe("no-iniciado");

    const learning = { "IP-JS-001": { ...createInteractivePracticeRecord("IP-JS-001"), status: "in-progress" as const } };
    expect(calculateModule13PilotMastery(learning)).toBe("aprendiendo");

    const practiced = {
      "IP-JS-001": completed("IP-JS-001"),
      "IP-JS-002": completed("IP-JS-002"),
      "IP-JS-003": completed("IP-JS-003", { hintsUsed: ["h1", "h2", "h3"] }),
    };
    expect(calculateModule13PilotMastery(practiced)).toBe("practicado");

    const autonomous = {
      "IP-JS-001": completed("IP-JS-001"),
      "IP-JS-002": completed("IP-JS-002"),
      "IP-JS-003": completed("IP-JS-003", { hintsUsed: [] }),
    };
    expect(calculateModule13PilotMastery(autonomous)).toBe("autonomo");

    const transferred = {
      ...autonomous,
      "IP-JS-004": completed("IP-JS-004", { solutionRevealed: false }),
    };
    expect(calculateModule13PilotMastery(transferred)).toBe("transferido");
  });
});

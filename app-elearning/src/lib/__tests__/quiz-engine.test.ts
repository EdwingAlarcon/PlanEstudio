import { describe, it, expect } from "vitest";
import {
  shuffleArray,
  evaluateAnswer,
  createSession,
  recordAttempt,
  finishSession,
  calculateResult,
  getCurrentQuestion,
  getAnsweredCount,
  isSessionComplete,
  certForModule,
  levelForModule,
  pickSimulatorQuestions,
  getRemainingSeconds,
  getElapsedSeconds,
} from "../quiz-engine";
import type { Question } from "../quiz-engine";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const singleQuestion: Question = {
  id: "module-1-0",
  moduleId: 1,
  type: "single",
  prompt: "¿Qué es Dataverse?",
  options: ["SharePoint", "Dataverse", "Excel", "Blob Storage"],
  answer: [1],
  explanation: "Dataverse es la base de datos nativa de Power Platform.",
};

const multiQuestion: Question = {
  id: "module-1-1",
  moduleId: 1,
  type: "multi",
  prompt: "¿Cuáles son componentes de Power Platform?",
  options: ["Power Apps", "GitHub", "Power Automate", "Jenkins"],
  answer: [0, 2],
  explanation: "Power Apps y Power Automate son componentes nativos.",
};

const questions: Question[] = [singleQuestion, multiQuestion];

// ─── shuffleArray ─────────────────────────────────────────────────────────────

describe("shuffleArray", () => {
  it("returns an array of the same length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffleArray(arr)).toHaveLength(arr.length);
  });

  it("contains all original elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect([...shuffled].sort()).toEqual([...arr].sort());
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3];
    shuffleArray(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("produces deterministic output with the same seed", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffleArray(arr, 42)).toEqual(shuffleArray(arr, 42));
  });
});

// ─── evaluateAnswer ───────────────────────────────────────────────────────────

describe("evaluateAnswer", () => {
  it("returns true for correct single answer", () => {
    expect(evaluateAnswer(singleQuestion, [1])).toBe(true);
  });

  it("returns false for wrong single answer", () => {
    expect(evaluateAnswer(singleQuestion, [0])).toBe(false);
  });

  it("returns true for correct multi answer (any order)", () => {
    expect(evaluateAnswer(multiQuestion, [2, 0])).toBe(true);
    expect(evaluateAnswer(multiQuestion, [0, 2])).toBe(true);
  });

  it("returns false for partial multi answer", () => {
    expect(evaluateAnswer(multiQuestion, [0])).toBe(false);
  });

  it("returns false for extra selections", () => {
    expect(evaluateAnswer(multiQuestion, [0, 1, 2])).toBe(false);
  });

  it("returns false for empty selection", () => {
    expect(evaluateAnswer(singleQuestion, [])).toBe(false);
  });
});

// ─── createSession ────────────────────────────────────────────────────────────

describe("createSession", () => {
  it("creates a session with provided questions", () => {
    const session = createSession(questions, { shuffle: false });
    expect(session.questions).toHaveLength(2);
    expect(session.attempts).toHaveLength(0);
    expect(session.finishedAt).toBeNull();
  });

  it("sets moduleId correctly", () => {
    const session = createSession(questions, { moduleId: 1 });
    expect(session.moduleId).toBe(1);
  });

  it("sets timeLimit when provided", () => {
    const session = createSession(questions, { timeLimit: 3000 });
    expect(session.timeLimit).toBe(3000);
  });

  it("starts with no timeLimit by default", () => {
    const session = createSession(questions);
    expect(session.timeLimit).toBeNull();
  });
});

// ─── recordAttempt ────────────────────────────────────────────────────────────

describe("recordAttempt", () => {
  it("records a correct attempt", () => {
    const session = createSession(questions, { shuffle: false });
    const updated = recordAttempt(session, "module-1-0", [1]);
    expect(updated.attempts).toHaveLength(1);
    expect(updated.attempts[0]?.isCorrect).toBe(true);
  });

  it("records an incorrect attempt", () => {
    const session = createSession(questions, { shuffle: false });
    const updated = recordAttempt(session, "module-1-0", [0]);
    expect(updated.attempts[0]?.isCorrect).toBe(false);
  });

  it("replaces an existing attempt for the same question", () => {
    let session = createSession(questions, { shuffle: false });
    session = recordAttempt(session, "module-1-0", [0]);
    session = recordAttempt(session, "module-1-0", [1]);
    expect(session.attempts).toHaveLength(1);
    expect(session.attempts[0]?.isCorrect).toBe(true);
  });

  it("does nothing for unknown question id", () => {
    const session = createSession(questions, { shuffle: false });
    const updated = recordAttempt(session, "nonexistent", [0]);
    expect(updated.attempts).toHaveLength(0);
  });
});

// ─── calculateResult ──────────────────────────────────────────────────────────

describe("calculateResult", () => {
  it("calculates 100% when all answers correct", () => {
    let session = createSession(questions, { shuffle: false });
    session = recordAttempt(session, "module-1-0", [1]);
    session = recordAttempt(session, "module-1-1", [0, 2]);
    const result = calculateResult(session);
    expect(result.correct).toBe(2);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("calculates 0% when no answers correct", () => {
    let session = createSession(questions, { shuffle: false });
    session = recordAttempt(session, "module-1-0", [0]);
    session = recordAttempt(session, "module-1-1", [1, 3]);
    const result = calculateResult(session);
    expect(result.correct).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("passes at exactly 70%", () => {
    // 7 correct out of 10
    const qs = Array.from({ length: 10 }, (_, i) => ({
      ...singleQuestion,
      id: `module-1-${i}`,
      answer: [0],
    }));
    let session = createSession(qs, { shuffle: false });
    for (let i = 0; i < 7; i++) {
      session = recordAttempt(session, `module-1-${i}`, [0]);
    }
    for (let i = 7; i < 10; i++) {
      session = recordAttempt(session, `module-1-${i}`, [1]);
    }
    const result = calculateResult(session);
    expect(result.percentage).toBe(70);
    expect(result.passed).toBe(true);
  });

  it("returns 0 for empty session", () => {
    const session = createSession([], { shuffle: false });
    const result = calculateResult(session);
    expect(result.percentage).toBe(0);
  });
});

// ─── getCurrentQuestion ───────────────────────────────────────────────────────

describe("getCurrentQuestion", () => {
  it("returns first unanswered question", () => {
    const session = createSession(questions, { shuffle: false });
    expect(getCurrentQuestion(session)?.id).toBe("module-1-0");
  });

  it("returns second question after first is answered", () => {
    let session = createSession(questions, { shuffle: false });
    session = recordAttempt(session, "module-1-0", [1]);
    expect(getCurrentQuestion(session)?.id).toBe("module-1-1");
  });

  it("returns undefined when all answered", () => {
    let session = createSession(questions, { shuffle: false });
    session = recordAttempt(session, "module-1-0", [1]);
    session = recordAttempt(session, "module-1-1", [0, 2]);
    expect(getCurrentQuestion(session)).toBeUndefined();
  });
});

// ─── isSessionComplete ────────────────────────────────────────────────────────

describe("isSessionComplete", () => {
  it("returns false when questions remain", () => {
    const session = createSession(questions, { shuffle: false });
    expect(isSessionComplete(session)).toBe(false);
  });

  it("returns true when all questions answered", () => {
    let session = createSession(questions, { shuffle: false });
    session = recordAttempt(session, "module-1-0", [1]);
    session = recordAttempt(session, "module-1-1", [0, 2]);
    expect(isSessionComplete(session)).toBe(true);
  });
});

// ─── getAnsweredCount ─────────────────────────────────────────────────────────

describe("getAnsweredCount", () => {
  it("returns 0 initially", () => {
    const session = createSession(questions);
    expect(getAnsweredCount(session)).toBe(0);
  });

  it("increments after each answer", () => {
    let session = createSession(questions, { shuffle: false });
    session = recordAttempt(session, "module-1-0", [1]);
    expect(getAnsweredCount(session)).toBe(1);
  });
});

// ─── certForModule ────────────────────────────────────────────────────────────

describe("certForModule", () => {
  it("returns PL-900 for modules 1-8", () => {
    for (let i = 1; i <= 8; i++) expect(certForModule(i)).toBe("PL-900");
  });
  it("returns PL-200 for modules 9-17", () => {
    expect(certForModule(9)).toBe("PL-200");
    expect(certForModule(17)).toBe("PL-200");
  });
  it("returns PL-400 for modules 18-30", () => {
    expect(certForModule(18)).toBe("PL-400");
    expect(certForModule(30)).toBe("PL-400");
  });
  it("returns PL-600 for modules 31+", () => {
    expect(certForModule(31)).toBe("PL-600");
    expect(certForModule(41)).toBe("PL-600");
  });
});

// ─── levelForModule ───────────────────────────────────────────────────────────

describe("levelForModule", () => {
  it("maps module ranges to level ids", () => {
    expect(levelForModule(1)).toBe("basico");
    expect(levelForModule(8)).toBe("basico");
    expect(levelForModule(9)).toBe("intermedio");
    expect(levelForModule(17)).toBe("intermedio");
    expect(levelForModule(18)).toBe("avanzado");
    expect(levelForModule(30)).toBe("avanzado");
    expect(levelForModule(31)).toBe("arquitecto");
    expect(levelForModule(41)).toBe("arquitecto");
  });
});

// ─── pickSimulatorQuestions ───────────────────────────────────────────────────

describe("pickSimulatorQuestions", () => {
  it("picks the requested count", () => {
    const qs = Array.from({ length: 20 }, (_, i) => ({
      ...singleQuestion,
      id: `q-${i}`,
    }));
    expect(pickSimulatorQuestions(qs, 10)).toHaveLength(10);
  });

  it("returns all when count exceeds available", () => {
    expect(pickSimulatorQuestions(questions, 100)).toHaveLength(2);
  });
});

// ─── timing helpers ───────────────────────────────────────────────────────────

describe("timing helpers", () => {
  it("getRemainingSeconds returns null when no timeLimit", () => {
    const session = createSession(questions);
    expect(getRemainingSeconds(session)).toBeNull();
  });

  it("getElapsedSeconds returns a non-negative number", () => {
    const session = createSession(questions);
    expect(getElapsedSeconds(session)).toBeGreaterThanOrEqual(0);
  });

  it("finishSession sets finishedAt", () => {
    const session = createSession(questions);
    const finished = finishSession(session);
    expect(finished.finishedAt).not.toBeNull();
  });
});

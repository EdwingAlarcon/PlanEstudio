import { describe, expect, it } from "vitest";
import {
  getDueReviewItems,
  getIncorrectReviewItems,
  getLeechItems,
  getRetentionSummary,
  groupReinforcementByModule,
  interleaveByModule,
  isQuestionEligibleForReview,
  validateSpacedRepetition,
  type ReviewCardMap,
} from "../review-queue";
import type { ReviewCardState } from "../review-scheduler";

const NOW = new Date(2026, 5, 15);

function card(overrides: Partial<ReviewCardState> & Pick<ReviewCardState, "questionId" | "moduleId">): ReviewCardState {
  return {
    itemType: "quiz-question",
    repetitions: 1,
    intervalDays: 1,
    easeFactor: 2.5,
    nextReviewAt: NOW.toISOString(),
    lapses: 0,
    totalReviews: 1,
    correctReviews: 1,
    incorrectReviews: 0,
    isLeech: false,
    status: "review",
    ...overrides,
  };
}

describe("isQuestionEligibleForReview", () => {
  it("is only eligible once a card exists (i.e. the question was answered)", () => {
    const cards: ReviewCardMap = { "module-3-0": card({ questionId: "module-3-0", moduleId: 3 }) };
    expect(isQuestionEligibleForReview("module-3-0", cards)).toBe(true);
    expect(isQuestionEligibleForReview("module-42-0", cards)).toBe(false);
  });

  it("never treats a completed module's unanswered questions as eligible", () => {
    // Módulo 8 completo, pero solo 2 de sus 6 preguntas fueron respondidas.
    const cards: ReviewCardMap = {
      "module-8-0": card({ questionId: "module-8-0", moduleId: 8 }),
      "module-8-1": card({ questionId: "module-8-1", moduleId: 8 }),
    };
    expect(isQuestionEligibleForReview("module-8-2", cards)).toBe(false);
  });
});

describe("getDueReviewItems", () => {
  it("excludes cards not yet due", () => {
    const cards: ReviewCardMap = {
      due: card({ questionId: "due", moduleId: 1, nextReviewAt: NOW.toISOString() }),
      future: card({ questionId: "future", moduleId: 1, nextReviewAt: new Date(2026, 5, 20).toISOString() }),
    };
    const due = getDueReviewItems(cards, NOW);
    expect(due.map((c) => c.questionId)).toEqual(["due"]);
  });

  it("excludes suspended cards", () => {
    const cards: ReviewCardMap = {
      a: card({ questionId: "a", moduleId: 1, status: "suspended" }),
    };
    expect(getDueReviewItems(cards, NOW)).toHaveLength(0);
  });

  it("orders more-overdue cards before less-overdue ones", () => {
    const cards: ReviewCardMap = {
      lessOverdue: card({ questionId: "lessOverdue", moduleId: 1, nextReviewAt: new Date(2026, 5, 14).toISOString() }),
      moreOverdue: card({ questionId: "moreOverdue", moduleId: 2, nextReviewAt: new Date(2026, 5, 5).toISOString() }),
    };
    const due = getDueReviewItems(cards, NOW);
    expect(due[0]!.questionId).toBe("moreOverdue");
  });

  it("prioritizes quiz-question over case-diagnosis at equal overdue/lapses", () => {
    const cards: ReviewCardMap = {
      caso: card({ questionId: "caso", moduleId: 1, itemType: "case-diagnosis" }),
      quiz: card({ questionId: "quiz", moduleId: 1, itemType: "quiz-question" }),
    };
    const due = getDueReviewItems(cards, NOW);
    expect(due[0]!.questionId).toBe("quiz");
  });

  it("respects an explicit limit", () => {
    const cards: ReviewCardMap = {
      a: card({ questionId: "a", moduleId: 1 }),
      b: card({ questionId: "b", moduleId: 2 }),
      c: card({ questionId: "c", moduleId: 3 }),
    };
    expect(getDueReviewItems(cards, NOW, 2)).toHaveLength(2);
  });
});

describe("interleaveByModule", () => {
  it("never places two consecutive items from the same module when others are available", () => {
    const items: ReviewCardState[] = [
      card({ questionId: "d1", moduleId: 9 }),
      card({ questionId: "d2", moduleId: 9 }),
      card({ questionId: "d3", moduleId: 9 }),
      card({ questionId: "p1", moduleId: 12 }),
    ];
    const result = interleaveByModule(items);
    for (let i = 1; i < result.length; i++) {
      if (result[i]!.moduleId === result[i - 1]!.moduleId) {
        // only acceptable once every other module's items are exhausted
        const remainingOtherModules = result.slice(i).some((c) => c.moduleId !== result[i]!.moduleId);
        expect(remainingOtherModules).toBe(false);
      }
    }
  });

  it("is deterministic for the same input", () => {
    const items: ReviewCardState[] = [
      card({ questionId: "a", moduleId: 1 }),
      card({ questionId: "b", moduleId: 2 }),
    ];
    expect(interleaveByModule(items)).toEqual(interleaveByModule(items));
  });

  it("preserves every item without loss or duplication", () => {
    const items: ReviewCardState[] = [
      card({ questionId: "a", moduleId: 1 }),
      card({ questionId: "b", moduleId: 1 }),
      card({ questionId: "c", moduleId: 2 }),
    ];
    expect(interleaveByModule(items).map((c) => c.questionId).sort()).toEqual(["a", "b", "c"]);
  });
});

describe("getIncorrectReviewItems / getLeechItems", () => {
  it("surfaces cards with lapses >= 2 as needing reinforcement without a second store", () => {
    const cards: ReviewCardMap = {
      shaky: card({ questionId: "shaky", moduleId: 1, lapses: 2 }),
      solid: card({ questionId: "solid", moduleId: 1, lapses: 0 }),
    };
    expect(getIncorrectReviewItems(cards).map((c) => c.questionId)).toEqual(["shaky"]);
  });

  it("getLeechItems only returns cards past the leech threshold", () => {
    const cards: ReviewCardMap = {
      leech: card({ questionId: "leech", moduleId: 1, lapses: 5 }),
      shaky: card({ questionId: "shaky", moduleId: 1, lapses: 2 }),
    };
    expect(getLeechItems(cards).map((c) => c.questionId)).toEqual(["leech"]);
  });
});

describe("getRetentionSummary", () => {
  it("never reports a knowledge percentage — only observable counts", () => {
    const cards: ReviewCardMap = {
      a: card({ questionId: "a", moduleId: 1, status: "learning" }),
      b: card({ questionId: "b", moduleId: 2, status: "review" }),
    };
    const summary = getRetentionSummary(cards, NOW);
    expect(summary).toEqual(
      expect.objectContaining({ total: 2, learning: 1, review: 1 })
    );
    expect(Object.keys(summary)).not.toContain("percentage");
  });
});

describe("groupReinforcementByModule", () => {
  it("groups needs-reinforcement cards by module, sorted ascending", () => {
    const cards: ReviewCardMap = {
      a: card({ questionId: "a", moduleId: 9, lapses: 3 }),
      b: card({ questionId: "b", moduleId: 3, lapses: 4 }),
      c: card({ questionId: "c", moduleId: 3, lapses: 2 }),
    };
    expect(groupReinforcementByModule(cards)).toEqual([
      { moduleId: 3, count: 2 },
      { moduleId: 9, count: 1 },
    ]);
  });
});

describe("validateSpacedRepetition", () => {
  it("passes on a clean card map", () => {
    const cards: ReviewCardMap = { "module-1-0": card({ questionId: "module-1-0", moduleId: 1 }) };
    expect(validateSpacedRepetition(cards, new Set(["module-1-0"]))).toEqual([]);
  });

  it("flags negative or NaN intervals", () => {
    const cards: ReviewCardMap = { "module-1-0": card({ questionId: "module-1-0", moduleId: 1, intervalDays: -3 }) };
    expect(validateSpacedRepetition(cards, new Set(["module-1-0"]))).not.toEqual([]);
  });

  it("flags an incoherent incorrect+easy card", () => {
    const cards: ReviewCardMap = {
      "module-1-0": card({ questionId: "module-1-0", moduleId: 1, lastResult: "incorrect", lastConfidence: "easy" }),
    };
    expect(validateSpacedRepetition(cards, new Set(["module-1-0"]))).toHaveLength(1);
  });

  it("ignores orphaned cards whose question id no longer exists in the bank", () => {
    const cards: ReviewCardMap = { "module-1-0": card({ questionId: "module-1-0", moduleId: 1, intervalDays: -3 }) };
    expect(validateSpacedRepetition(cards, new Set())).toEqual([]);
  });
});

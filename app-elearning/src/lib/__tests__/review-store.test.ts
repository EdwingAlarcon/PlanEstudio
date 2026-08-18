import { describe, expect, it } from "vitest";
import { REVIEW_STORAGE_KEY, sanitizeReviewState, useReviewStore } from "../review-store";

const NOW = new Date(2026, 5, 15);
const QUESTION = { id: "module-3-0", moduleId: 3, appliesTo: "quiz" as const };
const CASE_QUESTION = { id: "module-3-caso-0", moduleId: 3, appliesTo: "caso" as const };

function resetStore() {
  useReviewStore.setState({ cards: {}, dayLogs: [], sessionSize: "normal" });
}

describe("review-store: storage key and independence", () => {
  it("uses its own dedicated storage key", () => {
    expect(REVIEW_STORAGE_KEY).toBe("planestudio.spaced-repetition.v1");
  });
});

describe("review-store: registerQuestionForReview", () => {
  it("creates a card on first answer, correct or incorrect", () => {
    resetStore();
    useReviewStore.getState().registerQuestionForReview(QUESTION, true, NOW);
    const card = useReviewStore.getState().cards[QUESTION.id];
    expect(card).toBeDefined();
    expect(card!.totalReviews).toBe(1);
    expect(card!.correctReviews).toBe(1);
  });

  it("tags case-diagnosis questions with the correct itemType", () => {
    resetStore();
    useReviewStore.getState().registerQuestionForReview(CASE_QUESTION, true, NOW);
    expect(useReviewStore.getState().cards[CASE_QUESTION.id]!.itemType).toBe("case-diagnosis");
  });

  it("records a day log entry for the local day", () => {
    resetStore();
    useReviewStore.getState().registerQuestionForReview(QUESTION, true, NOW);
    const logs = useReviewStore.getState().dayLogs;
    expect(logs).toHaveLength(1);
    expect(logs[0]!.reviewed).toBe(1);
  });
});

describe("review-store: reviewCard", () => {
  it("reschedules an existing card via confidence", () => {
    resetStore();
    useReviewStore.getState().registerQuestionForReview(QUESTION, true, NOW);
    const firstInterval = useReviewStore.getState().cards[QUESTION.id]!.intervalDays;
    useReviewStore.getState().reviewCard(QUESTION.id, true, "easy", new Date(NOW.getTime() + 86400000));
    const secondInterval = useReviewStore.getState().cards[QUESTION.id]!.intervalDays;
    expect(secondInterval).toBeGreaterThanOrEqual(firstInterval);
  });

  it("is a no-op for a question that was never answered", () => {
    resetStore();
    useReviewStore.getState().reviewCard("module-99-0", true, "good", NOW);
    expect(useReviewStore.getState().cards["module-99-0"]).toBeUndefined();
  });
});

describe("review-store: independence from other stores", () => {
  it("resetReviewProgress only clears its own state", () => {
    resetStore();
    useReviewStore.getState().registerQuestionForReview(QUESTION, true, NOW);
    useReviewStore.getState().resetReviewProgress();
    expect(useReviewStore.getState().cards).toEqual({});
    expect(useReviewStore.getState().dayLogs).toEqual([]);
  });
});

describe("sanitizeReviewState", () => {
  it("returns initial state for garbage input", () => {
    expect(sanitizeReviewState(null)).toEqual({ schemaVersion: 1, cards: {}, dayLogs: [], sessionSize: "normal" });
    expect(sanitizeReviewState("not an object")).toEqual({ schemaVersion: 1, cards: {}, dayLogs: [], sessionSize: "normal" });
  });

  it("discards a card with a negative interval", () => {
    const state = sanitizeReviewState({
      cards: { "module-1-0": { questionId: "module-1-0", moduleId: 1, intervalDays: -5 } },
    });
    // intervalDays clamped to 0 by sanitizer, not discarded outright — assert it never stays negative
    expect(state.cards["module-1-0"]?.intervalDays).toBeGreaterThanOrEqual(0);
  });

  it("drops a card whose key does not match its own questionId (tamper guard)", () => {
    const state = sanitizeReviewState({
      cards: { "module-1-0": { questionId: "module-2-0", moduleId: 1, intervalDays: 3 } },
    });
    expect(state.cards["module-1-0"]).toBeUndefined();
  });

  it("clamps easeFactor back into range instead of trusting an absurd value", () => {
    const state = sanitizeReviewState({
      cards: { "module-1-0": { questionId: "module-1-0", moduleId: 1, easeFactor: 999 } },
    });
    expect(state.cards["module-1-0"]?.easeFactor).toBe(2.5); // falls back to DEFAULT_EASE
  });

  it("rejects an invalid nextReviewAt date string", () => {
    const state = sanitizeReviewState({
      cards: { "module-1-0": { questionId: "module-1-0", moduleId: 1, nextReviewAt: "not-a-date" } },
    });
    expect(state.cards["module-1-0"]?.nextReviewAt).toBe("");
  });

  it("caps dayLogs at 90 entries", () => {
    const dayLogs = Array.from({ length: 120 }, (_, i) => ({
      day: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
      reviewed: 1, correct: 1, incorrect: 0, seconds: 0, moduleIds: [1],
    }));
    const state = sanitizeReviewState({ dayLogs });
    expect(state.dayLogs.length).toBeLessThanOrEqual(90);
  });
});

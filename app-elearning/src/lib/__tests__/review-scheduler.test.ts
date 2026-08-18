import { describe, expect, it } from "vitest";
import { sm2Scheduler, MAX_INTERVAL_DAYS, MIN_INTERVAL_DAYS, type ReviewCardState } from "../review-scheduler";
import { toLocalDayKey } from "../review-date";

const NOW = new Date(2026, 5, 1); // June 1, 2026

function schedule(card: ReviewCardState | null, isCorrect: boolean, confidence: "again" | "hard" | "good" | "easy", now = NOW) {
  return sm2Scheduler.schedule({
    card,
    questionId: "module-3-0",
    moduleId: 3,
    itemType: "quiz-question",
    isCorrect,
    confidence,
    now,
  });
}

describe("sm2Scheduler", () => {
  it("new + again reviews again ~1 day later", () => {
    const result = schedule(null, false, "again");
    expect(result.intervalDays).toBe(1);
    expect(result.status).toBe("relearning");
    expect(toLocalDayKey(new Date(result.nextReviewAt))).toBe(toLocalDayKey(new Date(2026, 5, 2)));
  });

  it("new + good sets the first learning-step interval", () => {
    const result = schedule(null, true, "good");
    expect(result.intervalDays).toBe(1);
    expect(result.status).toBe("learning");
    expect(result.repetitions).toBe(1);
  });

  it("review + hard yields a smaller interval than review + good", () => {
    const reviewCard: ReviewCardState = {
      questionId: "module-3-0", moduleId: 3, itemType: "quiz-question",
      repetitions: 4, intervalDays: 10, easeFactor: 2.5, nextReviewAt: NOW.toISOString(),
      lapses: 0, totalReviews: 4, correctReviews: 4, incorrectReviews: 0, isLeech: false, status: "review",
    };
    const hard = schedule({ ...reviewCard }, true, "hard");
    const good = schedule({ ...reviewCard }, true, "good");
    expect(hard.intervalDays).toBeLessThan(good.intervalDays);
  });

  it("review + good yields a smaller interval than review + easy", () => {
    const reviewCard: ReviewCardState = {
      questionId: "module-3-0", moduleId: 3, itemType: "quiz-question",
      repetitions: 4, intervalDays: 10, easeFactor: 2.5, nextReviewAt: NOW.toISOString(),
      lapses: 0, totalReviews: 4, correctReviews: 4, incorrectReviews: 0, isLeech: false, status: "review",
    };
    const good = schedule({ ...reviewCard }, true, "good");
    const easy = schedule({ ...reviewCard }, true, "easy");
    expect(good.intervalDays).toBeLessThan(easy.intervalDays);
  });

  it("an incorrect answer after a long interval falls back to relearning", () => {
    const matureCard: ReviewCardState = {
      questionId: "module-3-0", moduleId: 3, itemType: "quiz-question",
      repetitions: 8, intervalDays: 90, easeFactor: 2.6, nextReviewAt: NOW.toISOString(),
      lapses: 0, totalReviews: 8, correctReviews: 8, incorrectReviews: 0, isLeech: false, status: "review",
    };
    const result = schedule(matureCard, false, "good"); // confidence irrelevant when incorrect
    expect(result.status).toBe("relearning");
    expect(result.intervalDays).toBe(MIN_INTERVAL_DAYS);
    expect(result.lapses).toBe(1);
  });

  it("§27: an incorrect answer can never produce an easy-sized interval", () => {
    const matureCard: ReviewCardState = {
      questionId: "module-3-0", moduleId: 3, itemType: "quiz-question",
      repetitions: 8, intervalDays: 90, easeFactor: 2.6, nextReviewAt: NOW.toISOString(),
      lapses: 0, totalReviews: 8, correctReviews: 8, incorrectReviews: 0, isLeech: false, status: "review",
    };
    const incorrectWithEasy = schedule(matureCard, false, "easy");
    expect(incorrectWithEasy.lastConfidence).toBe("again");
    expect(incorrectWithEasy.intervalDays).toBe(MIN_INTERVAL_DAYS);
  });

  it("intervals never exceed MAX_INTERVAL_DAYS", () => {
    const nearMax: ReviewCardState = {
      questionId: "module-3-0", moduleId: 3, itemType: "quiz-question",
      repetitions: 20, intervalDays: 170, easeFactor: 2.8, nextReviewAt: NOW.toISOString(),
      lapses: 0, totalReviews: 20, correctReviews: 20, incorrectReviews: 0, isLeech: false, status: "review",
    };
    const result = schedule(nearMax, true, "easy");
    expect(result.intervalDays).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
  });

  it("ease factor never drops below MIN_EASE across repeated lapses", () => {
    let card: ReviewCardState | null = null;
    for (let i = 0; i < 20; i++) {
      card = schedule(card, false, "again");
    }
    expect(card!.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("marks a card as a leech once lapses reach the threshold", () => {
    let card: ReviewCardState | null = null;
    for (let i = 0; i < 5; i++) {
      card = schedule(card, false, "again");
    }
    expect(card!.lapses).toBe(5);
    expect(card!.isLeech).toBe(true);
    expect(card!.status).toBe("relearning"); // leech never auto-suspends (§43)
  });

  it("is deterministic: same input always produces the same schedule", () => {
    const a = schedule(null, true, "good", new Date(2026, 5, 1));
    const b = schedule(null, true, "good", new Date(2026, 5, 1));
    expect(a).toEqual(b);
  });

  it("correct + again is a soft lapse: short interval, but lapses/incorrectReviews stay untouched", () => {
    const matureCard: ReviewCardState = {
      questionId: "module-3-0", moduleId: 3, itemType: "quiz-question",
      repetitions: 6, intervalDays: 40, easeFactor: 2.5, nextReviewAt: NOW.toISOString(),
      lapses: 1, totalReviews: 6, correctReviews: 6, incorrectReviews: 0, isLeech: false, status: "review",
    };
    const result = schedule(matureCard, true, "again");
    expect(result.status).toBe("relearning");
    expect(result.intervalDays).toBe(MIN_INTERVAL_DAYS);
    expect(result.lapses).toBe(1); // unchanged — the answer WAS correct
    expect(result.incorrectReviews).toBe(0);
    expect(result.correctReviews).toBe(7);
  });

  it("learning ladder eventually promotes a card to review status", () => {
    let card: ReviewCardState | null = null;
    let day = NOW;
    for (let i = 0; i < 3; i++) {
      card = schedule(card, true, "good", day);
      day = new Date(card.nextReviewAt);
    }
    expect(card!.status).toBe("review");
  });
});

import { describe, expect, it } from "vitest";
import {
  createInteractivePracticeRecord,
  summarizeInteractivePracticeProgress,
  useInteractivePracticeProgressStore,
  type InteractivePracticeRecord,
} from "../interactive-practice-progress";

describe("interactive practice progress helpers", () => {
  it("creates independent records with the interactive storage schema", () => {
    const record = createInteractivePracticeRecord("IP-DV-001", "2026-08-11T00:00:00.000Z");
    expect(record.schemaVersion).toBe(1);
    expect(record.practiceId).toBe("IP-DV-001");
    expect(record.status).toBe("not-started");
    expect(record.mastery).toBe("not-started");
    expect(record.events[0]?.type).toBe("opened");
  });

  it("summarizes scoped practice progress", () => {
    const records: Record<string, InteractivePracticeRecord> = {
      "IP-DV-001": {
        ...createInteractivePracticeRecord("IP-DV-001"),
        status: "completed",
        mastery: "proficient",
        attemptCount: 1,
        bestScore: 100,
      },
      "IP-QRY-001": {
        ...createInteractivePracticeRecord("IP-QRY-001"),
        status: "in-progress",
        mastery: "needs-review",
        attemptCount: 2,
        bestScore: 60,
      },
    };
    const summary = summarizeInteractivePracticeProgress(records, ["IP-DV-001", "IP-QRY-001", "IP-PA-001"]);
    expect(summary.total).toBe(3);
    expect(summary.completed).toBe(1);
    expect(summary.proficient).toBe(1);
    expect(summary.needsReview).toBe(1);
    expect(summary.inProgress).toBe(1);
    expect(summary.attempts).toBe(3);
    expect(summary.percentage).toBe(33);
  });

  it("records attempts, hints, solution reveal and reset actions", () => {
    const store = useInteractivePracticeProgressStore;
    store.setState({ records: {} });
    store.getState().openPractice("IP-DV-001");
    store.getState().revealHint("IP-DV-001", "h1");
    store.getState().recordAttempt("IP-DV-001", { status: "correct", score: 100, feedback: "ok", consequences: [] }, ["one-many"]);
    store.getState().revealSolution("IP-DV-001");
    store.getState().markAbandoned("IP-DV-001");
    const record = store.getState().records["IP-DV-001"];
    expect(record?.status).toBe("completed");
    expect(record?.hintsUsed).toContain("h1");
    expect(record?.solutionRevealed).toBe(true);
    expect(record?.events.map((event) => event.type)).toContain("abandoned");
    store.getState().resetPractice("IP-DV-001");
    expect(store.getState().records["IP-DV-001"]).toBeUndefined();
    store.getState().openPractice("IP-QRY-001");
    store.getState().resetAllInteractivePractices();
    expect(store.getState().records).toEqual({});
  });
});

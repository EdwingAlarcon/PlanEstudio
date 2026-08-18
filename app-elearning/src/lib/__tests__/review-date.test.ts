import { describe, expect, it } from "vitest";
import { addDays, isDueOn, localDaysBetween, parseIsoDate, startOfLocalDay, toLocalDayKey } from "../review-date";

describe("review-date", () => {
  it("formats a local day key without UTC drift", () => {
    const date = new Date(2026, 0, 5, 23, 30); // Jan 5, 2026, 23:30 local
    expect(toLocalDayKey(date)).toBe("2026-01-05");
  });

  it("addDays crosses month boundaries correctly", () => {
    const date = new Date(2026, 0, 30); // Jan 30, 2026
    const next = addDays(date, 3);
    expect(toLocalDayKey(next)).toBe("2026-02-02");
  });

  it("addDays handles a leap year", () => {
    const date = new Date(2028, 1, 28); // Feb 28, 2028 (leap year)
    const next = addDays(date, 1);
    expect(toLocalDayKey(next)).toBe("2028-02-29");
  });

  it("isDueOn is true when the due day has arrived", () => {
    const now = new Date(2026, 2, 10);
    const due = new Date(2026, 2, 10, 8, 0).toISOString();
    expect(isDueOn(due, now)).toBe(true);
  });

  it("isDueOn is true when overdue by several days", () => {
    const now = new Date(2026, 2, 15);
    const due = new Date(2026, 2, 10).toISOString();
    expect(isDueOn(due, now)).toBe(true);
  });

  it("isDueOn is false for a future day", () => {
    const now = new Date(2026, 2, 10);
    const due = new Date(2026, 2, 11).toISOString();
    expect(isDueOn(due, now)).toBe(false);
  });

  it("isDueOn is false for a corrupt date string", () => {
    expect(isDueOn("not-a-date", new Date())).toBe(false);
  });

  it("parseIsoDate rejects NaN/invalid input", () => {
    expect(parseIsoDate("not-a-date")).toBeNull();
    expect(parseIsoDate("")).toBeNull();
    expect(parseIsoDate(undefined)).toBeNull();
    expect(parseIsoDate(new Date(NaN))).toBeNull();
  });

  it("parseIsoDate accepts a valid ISO string", () => {
    const parsed = parseIsoDate("2026-01-05T00:00:00.000Z");
    expect(parsed).not.toBeNull();
  });

  it("localDaysBetween counts whole local days", () => {
    const from = new Date(2026, 0, 1);
    const to = new Date(2026, 0, 8);
    expect(localDaysBetween(from, to)).toBe(7);
  });

  it("startOfLocalDay zeroes out the time portion", () => {
    const date = new Date(2026, 5, 15, 23, 59, 59);
    const start = startOfLocalDay(date);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
  });
});

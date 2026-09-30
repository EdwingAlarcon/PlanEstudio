import { describe, expect, it } from "vitest";
import { getFreshness, isValidLastVerified, monthsSince } from "../content-freshness";

const NOW = new Date("2026-09-30T12:00:00Z");

describe("content-freshness", () => {
  it("valida el formato AAAA-MM", () => {
    expect(isValidLastVerified("2026-09")).toBe(true);
    expect(isValidLastVerified("2026-13")).toBe(false);
    expect(isValidLastVerified("2026-9")).toBe(false);
    expect(isValidLastVerified("2026-09-01")).toBe(false);
  });

  it("calcula meses transcurridos entre años", () => {
    expect(monthsSince("2026-09", NOW)).toBe(0);
    expect(monthsSince("2025-12", NOW)).toBe(9);
    expect(monthsSince("nope", NOW)).toBe(Number.POSITIVE_INFINITY);
  });

  it("clasifica fresh / stale / unknown", () => {
    expect(getFreshness("2026-09", NOW)).toBe("fresh");
    expect(getFreshness("2026-03", NOW)).toBe("fresh"); // exactamente 6 meses
    expect(getFreshness("2026-02", NOW)).toBe("stale");
    expect(getFreshness(undefined, NOW)).toBe("unknown");
    expect(getFreshness("basura", NOW)).toBe("unknown");
  });
});

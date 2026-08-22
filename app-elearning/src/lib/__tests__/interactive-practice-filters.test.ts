import { describe, expect, it } from "vitest";
import { INTERACTIVE_PRACTICES } from "../interactive-practices";
import { createInteractivePracticeRecord, type InteractivePracticeRecord } from "../interactive-practice-progress";
import {
  DEFAULT_INTERACTIVE_PRACTICE_FILTERS,
  filterInteractivePractices,
  hasActiveInteractivePracticeFilters,
  syncSelectedInteractivePracticeSlug,
} from "../interactive-practice-filters";

describe("interactive practice filters", () => {
  it("filters by domain, engine, difficulty, state and search text", () => {
    const completed: InteractivePracticeRecord = {
      ...createInteractivePracticeRecord("IP-QRY-001"),
      status: "completed",
      mastery: "proficient",
      bestScore: 100,
    };
    const filtered = filterInteractivePractices(
      INTERACTIVE_PRACTICES,
      { "IP-QRY-001": completed },
      {
        ...DEFAULT_INTERACTIVE_PRACTICE_FILTERS,
        domain: "fetchxml",
        type: "query-playground",
        level: "junior",
        mastery: "completed",
        query: "bogotá",
      }
    );
    expect(filtered.map((practice) => practice.id)).toEqual(["IP-QRY-001"]);
  });

  it("keeps current selection when visible and selects first result when hidden", () => {
    const flowOnly = filterInteractivePractices(INTERACTIVE_PRACTICES, {}, { ...DEFAULT_INTERACTIVE_PRACTICE_FILTERS, type: "flow-builder" });
    expect(syncSelectedInteractivePracticeSlug(flowOnly[0]!.slug, flowOnly)).toBe(flowOnly[0]!.slug);
    expect(syncSelectedInteractivePracticeSlug("ip-dv-001-relacion-cliente-pedidos", flowOnly)).toBe(flowOnly[0]!.slug);
    expect(syncSelectedInteractivePracticeSlug("ip-dv-001-relacion-cliente-pedidos", [])).toBe("");
  });

  it("detects empty filter states and active filters", () => {
    const empty = filterInteractivePractices(INTERACTIVE_PRACTICES, {}, { ...DEFAULT_INTERACTIVE_PRACTICE_FILTERS, query: "sin resultados posibles" });
    expect(empty).toEqual([]);
    expect(hasActiveInteractivePracticeFilters(DEFAULT_INTERACTIVE_PRACTICE_FILTERS)).toBe(false);
    expect(hasActiveInteractivePracticeFilters({ ...DEFAULT_INTERACTIVE_PRACTICE_FILTERS, query: "dataverse" })).toBe(true);
  });
});

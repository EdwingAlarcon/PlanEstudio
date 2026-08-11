import { describe, expect, it } from "vitest";
import {
  INTERACTIVE_PRACTICE_TYPES,
  calculateInteractiveMastery,
  evaluateInteractivePractice,
  getAllInteractivePractices,
  getFixtureSummary,
  getInteractivePracticeSearchDocuments,
  getRecommendedInteractivePractice,
  validateInteractivePractices,
} from "../interactive-practices";

describe("interactive practice bank", () => {
  it("keeps the pilot intentionally small and covers all engines", () => {
    const practices = getAllInteractivePractices();
    expect(practices.length).toBeGreaterThanOrEqual(12);
    expect(practices.length).toBeLessThanOrEqual(15);
    for (const type of INTERACTIVE_PRACTICE_TYPES) {
      expect(practices.some((practice) => practice.type === type)).toBe(true);
    }
    expect(validateInteractivePractices()).toEqual([]);
  });

  it("indexes practices for global search", () => {
    const docs = getInteractivePracticeSearchDocuments();
    expect(docs).toHaveLength(getAllInteractivePractices().length);
    expect(docs[0]?.type).toBe("interactive-practice");
    expect(docs.some((doc) => doc.href.startsWith("/practica/"))).toBe(true);
  });

  it("uses local fixtures only", () => {
    expect(getFixtureSummary()).toEqual({ accounts: 4, requests: 4, products: 4 });
  });
});

describe("interactive practice engines", () => {
  it("evaluates multiple-decision answers with consequences", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-DV-001")!;
    const correct = evaluateInteractivePractice(practice, ["one-many"], 1);
    const wrong = evaluateInteractivePractice(practice, ["nn"], 1);
    const empty = evaluateInteractivePractice(practice, [], 1);
    expect(correct.status).toBe("correct");
    expect(correct.score).toBe(100);
    expect(wrong.status).toBe("incorrect");
    expect(empty.score).toBe(0);
    expect(wrong.consequences.length).toBeGreaterThan(0);
  });

  it("evaluates flow order and local test cases", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-PA-002")!;
    const correct = evaluateInteractivePractice(practice, ["trigger-row-added", "condition-amount-gt", "start-approval", "update-approved", "send-notification"], 1);
    const partial = evaluateInteractivePractice(practice, ["condition-amount-gt", "trigger-row-added", "start-approval"], 1);
    expect(correct.status).toBe("correct");
    expect(correct.testResults?.every((test) => test.pass)).toBe(true);
    expect(partial.score).toBeLessThan(correct.score);
  });

  it("reports missing flow blocks clearly", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-PA-002")!;
    const result = evaluateInteractivePractice(practice, ["trigger-row-added"], 1);
    expect(result.status).toBe("incorrect");
    expect(result.consequences[0]).toMatch(/Faltan bloques/);
  });

  it("parses safe FetchXML and rejects unsafe input", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-QRY-001")!;
    const safe = evaluateInteractivePractice(practice, '<fetch top="2"><entity name="account"><attribute name="name" /><attribute name="city" /><filter><condition attribute="city" operator="eq" value="Bogotá" /></filter></entity></fetch>', 1);
    const unsafe = evaluateInteractivePractice(practice, "<script>fetch('https://example.com')</script>", 1);
    expect(safe.status).toBe("correct");
    expect(safe.rows?.length).toBe(2);
    expect(unsafe.status).toBe("incorrect");
  });

  it("rejects unsupported FetchXML and oversized queries", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-QRY-001")!;
    expect(evaluateInteractivePractice(practice, "<fetch />", 1).status).toBe("incorrect");
    expect(evaluateInteractivePractice(practice, '<fetch><entity name="contact" /></fetch>', 1).score).toBe(10);
    expect(evaluateInteractivePractice(practice, "x".repeat(1201), 1).feedback).toMatch(/excede/);
  });

  it("parses a limited OData query", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-QRY-002")!;
    const result = evaluateInteractivePractice(practice, "/accounts?$select=name,revenue&$filter=status eq 'active'&$orderby=revenue desc&$top=2", 1);
    expect(result.status).toBe("correct");
    expect(result.rows?.map((row) => row.name)).toEqual(["Litware Capital", "Fabrikam Andina"]);
  });

  it("rejects unsupported OData shapes", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-QRY-002")!;
    expect(evaluateInteractivePractice(practice, "/contacts?$select=name", 1).status).toBe("incorrect");
    expect(evaluateInteractivePractice(practice, "/accounts?$select=name", 1).status).toBe("incorrect");
  });

  it("evaluates debug scenarios with accepted fixes", () => {
    const practice = getAllInteractivePractices().find((item) => item.id === "IP-TRB-001")!;
    const result = evaluateInteractivePractice(practice, "Agregaría coalesce, validación null y una condición previa para manejar amount empty antes de comparar.", 1);
    expect(result.status).toBe("correct");
    expect(result.consequences).toHaveLength(2);
  });
});

describe("interactive practice mastery and recommendations", () => {
  it("does not use expert labels for mastery", () => {
    expect(calculateInteractiveMastery({ correct: true, attempts: 1, hintsUsed: 0 })).toBe("proficient");
    expect(calculateInteractiveMastery({ correct: true, attempts: 3, hintsUsed: 0 })).toBe("learning");
    expect(calculateInteractiveMastery({ correct: true, attempts: 1, hintsUsed: 1, solutionRevealed: true })).toBe("needs-review");
  });

  it("prioritizes practices that need review, then module context, then the first pending item", () => {
    const practices = getAllInteractivePractices();
    expect(getRecommendedInteractivePractice({ "IP-QRY-001": { mastery: "needs-review" } })?.id).toBe("IP-QRY-001");
    expect(getRecommendedInteractivePractice({ "IP-PA-001": { mastery: "learning" } })?.id).toBe("IP-PA-001");
    expect(getRecommendedInteractivePractice({ "IP-DV-001": { mastery: "proficient" } }, ["basico-5"])?.relatedModuleIds).toContain(5);
    expect(getRecommendedInteractivePractice({})?.id).toBe(practices[0]?.id);
  });
});

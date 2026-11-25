import { describe, expect, it } from "vitest";
import { findDangerousKey } from "../safe-json";
import { parseInteractivePracticeImport, INTERACTIVE_PRACTICE_EXPORT_SOURCE } from "../interactive-practice-progress";
import { parsePracticeImportText, PRACTICE_EXPORT_FORMAT } from "../practice-portability";

const KEYS = ["__proto__", "constructor", "prototype"];
const nest = (levels: number): unknown => (levels === 0 ? 1 : { a: nest(levels - 1) });

describe("findDangerousKey", () => {
  it("detecta claves peligrosas anidadas", () => {
    for (const key of KEYS) expect(findDangerousKey(JSON.parse(`{"a":[{"${key}":1}]}`))).toBe(key);
    expect(findDangerousKey({ a: [{ b: 1 }] })).toBeNull();
  });

  it("rechaza anidamiento excesivo, pero no valores simples en el límite", () => {
    expect(findDangerousKey(nest(13))).toBeNull();
    expect(findDangerousKey(nest(14))).toBe("profundidad excesiva");
  });
});

describe("importaciones con claves peligrosas", () => {
  it.each(KEYS)("progreso interactivo rechaza %s", (key) => {
    const text = `{"source":"${INTERACTIVE_PRACTICE_EXPORT_SOURCE}","schemaVersion":1,"practices":{"${key}":{}}}`;
    const result = parseInteractivePracticeImport(text, []);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(key);
  });

  it.each(KEYS)("progreso práctico rechaza %s", (key) => {
    const text = `{"format":"${PRACTICE_EXPORT_FORMAT}","schemaVersion":1,"records":{"${key}":{}}}`;
    const preview = parsePracticeImportText(text, []);
    expect(preview.status).toBe("corrupt");
    expect(preview.errors[0]).toContain(key);
  });
});

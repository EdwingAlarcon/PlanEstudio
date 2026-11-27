import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { buildLessonSteps, hasStepMode, stepProgressId, STEP_MODE_MODULE_KEYS } from "../lesson-steps";
import { getInteractivePracticeBySlug } from "../interactive-practices";

const modulo11 = fs.readFileSync(path.resolve(process.cwd(), "content/modules/intermedio/11-power-automate-avanzado.md"), "utf-8").replace(/^---[\s\S]*?---\s*/, "");

describe("buildLessonSteps", () => {
  const steps = buildLessonSteps(modulo11);

  it("parte el Módulo 11 en intro, tres pasos por microlección, reto y cierre", () => {
    expect(steps[0]!.id).toBe("intro");
    expect(steps.at(-1)!.id).toBe("comprueba");
    expect(steps.at(-2)!.id).toBe("reto");
    for (const n of [1, 2, 3, 4]) expect(steps.some((s) => s.id === `m${n}-concepto`), `m${n}`).toBe(true);
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
  });

  it("enlaza la micropráctica con una práctica interactiva que existe", () => {
    const practicas = steps.filter((s) => s.kind === "practica");
    expect(practicas.length).toBeGreaterThan(0);
    for (const s of practicas) {
      expect(s.practiceSlug, s.id).toBeDefined();
      expect(getInteractivePracticeBySlug(s.practiceSlug!), s.practiceSlug).toBeDefined();
    }
    expect(steps.find((s) => s.id === "m1-practica")!.practiceSlug).toBe("ip-pa-004-retry-scope-try-catch");
  });

  it("no pierde contenido de las microlecciones ni arrastra las secciones fijas", () => {
    const m1 = steps.filter((s) => s.id.startsWith("m1-")).map((s) => s.markdown).join("\n");
    expect(m1).toContain("**¿Qué vas a aprender?**");
    expect(m1).toContain("**Evidencia a reportar");
    expect(steps.find((s) => s.id === "m1-concepto")!.markdown).not.toContain("Ahora haz algo");
    const todo = steps.map((s) => s.markdown).join("\n");
    expect(todo).not.toContain("Caso Real de Negocio");
    expect(todo).not.toContain("Criterios de Validación");
  });

  it("devuelve [] para un módulo sin microlecciones", () => {
    expect(buildLessonSteps("### 🎯 Objetivo\n\nTexto.\n\n### 🧪 Criterios de Validación\n\n- [ ] Algo")).toEqual([]);
  });

  it("ignora encabezados dentro de bloques de código", () => {
    const md = "Intro\n\n## 🧩 Microlección 1 — Uno\n\nConcepto\n\n```\n## 🧩 Microlección 9 — Falsa\n```\n\n**Práctica real en tu entorno:** hazlo";
    const result = buildLessonSteps(md);
    expect(result.map((s) => s.id)).toEqual(["intro", "m1-concepto", "m1-ambiente", "comprueba"]);
  });
});

describe("modo por pasos", () => {
  it("solo el piloto lo tiene y los ids de progreso llevan el módulo", () => {
    expect(STEP_MODE_MODULE_KEYS).toEqual(["intermedio-11"]);
    expect(hasStepMode("intermedio-11")).toBe(true);
    expect(hasStepMode("basico-1")).toBe(false);
    expect(stepProgressId("intermedio-11", "m1-concepto")).toBe("intermedio-11#m1-concepto");
  });
});

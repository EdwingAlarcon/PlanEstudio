import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { buildLessonSteps, hasStepMode, MAX_STEP_LENGTH, stepProgressId } from "../lesson-steps";
import { getAllLevels } from "../content";
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
  it("todos los módulos lo tienen y los ids de progreso llevan el módulo", () => {
    expect(hasStepMode(modulo11)).toBe(true);
    expect(hasStepMode("### 🎯 Objetivo\n\nTexto.")).toBe(false);
    expect(stepProgressId("intermedio-11", "m1-concepto")).toBe("intermedio-11#m1-concepto");
  });

  it("F5: cada módulo del curso tiene pasos, ids únicos, reto y pantallas no demasiado largas", () => {
    for (const level of getAllLevels()) {
      for (const mod of level.modules) {
        const steps = buildLessonSteps(mod.rawContent);
        expect(steps.length, mod.id).toBeGreaterThan(3);
        expect(new Set(steps.map((s) => s.id)).size, mod.id).toBe(steps.length);
        expect(steps.some((s) => s.kind === "reto"), mod.id).toBe(true);
        for (const step of steps) {
          if (step.practiceSlug) expect(getInteractivePracticeBySlug(step.practiceSlug), `${mod.id} ${step.id}`).toBeDefined();
        }
        // Una lista numerada de pasos o un bloque de código no se parten nunca; el límite evita muros de texto.
        const longest = Math.max(...steps.map((s) => s.markdown.length));
        expect(longest, mod.id).toBeLessThan(MAX_STEP_LENGTH * 3);
      }
    }
  });

  it("parte un paso largo por sus H3 y conserva el id del primero", () => {
    const long = Array.from({ length: 4 }, (_, i) => `### Parte ${i + 1}\n\n${"texto ".repeat(300)}`).join("\n\n");
    const steps = buildLessonSteps(`Intro\n\n## 🧩 Microlección 1 — Uno\n\n${long}\n\n## Mini lab\n\nHazlo`);
    const ids = steps.map((s) => s.id);
    expect(ids[1]).toBe("m1-concepto");
    expect(ids).toContain("m1-concepto-2");
    expect(ids).toContain("b1");
    expect(steps.find((s) => s.id === "b1")!.group).toBe("Mini lab");
  });

  it("separa la profundización opcional, no corta listas y no deja pantallas colgando de un ':'", () => {
    const filler = (n: number) => "texto ".repeat(n);
    const steps = buildLessonSteps(
      `Intro\n\n## 🧩 Microlección 1 — Uno\n\n${filler(80)}\n\n#### 🔧 Profundización opcional — Más\n\n${filler(80)}\n\n### Siguiente\n\nSigue estos pasos:\n\n1. ${filler(300)}\n2. ${filler(300)}\n3. ${filler(300)}`,
    );
    const optional = steps.filter((s) => s.optional);
    expect(optional).toHaveLength(1);
    expect(optional[0]!.markdown).toContain("Profundización opcional");
    for (const step of steps) {
      expect(step.markdown.trimEnd().endsWith(":"), step.id).toBe(false);
      // Los tres pasos de la lista numerada quedan en la misma pantalla.
      if (step.markdown.includes("1. texto")) expect(step.markdown).toContain("3. texto");
    }
  });
});

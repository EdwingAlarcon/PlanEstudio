import { describe, expect, it } from "vitest";
import { parseChecklistMarkdown, summarizeChecklistProgress } from "../checklist";

const SAMPLE = `# Checklist

## 🟢 NIVEL 1: BÁSICO

### Módulo 1: Introducción

- [ ] **Conocimiento**: Explico la plataforma | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Creo un ambiente | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 1:** ___/2 checkboxes completados

### Módulo 2: Dataverse

- [ ] **Práctica**: Creo una tabla | Dominio: ___/5 | Fecha: ___

## 🔵 NIVEL 2: INTERMEDIO

### Módulo 9: Avanzado

- [ ] **Conocimiento**: Explico relaciones N:N | Dominio: ___/5 | Fecha: ___
`;

describe("parseChecklistMarkdown", () => {
  it("groups checklist criteria by level and module", () => {
    const checklist = parseChecklistMarkdown(SAMPLE);

    expect(checklist.levels).toHaveLength(2);
    expect(checklist.levels[0]?.levelId).toBe("basico");
    expect(checklist.levels[0]?.modules[0]?.moduleId).toBe(1);
    expect(checklist.levels[0]?.modules[0]?.items).toHaveLength(2);
    expect(checklist.levels[0]?.modules[0]?.items[0]).toMatchObject({
      id: "module-1-1",
      category: "Conocimiento",
      text: "Explico la plataforma",
    });
  });

  it("returns aggregate counts for parsed content", () => {
    const checklist = parseChecklistMarkdown(SAMPLE);

    expect(checklist.totalModules).toBe(3);
    expect(checklist.totalItems).toBe(4);
  });
});

describe("summarizeChecklistProgress", () => {
  it("calculates completion and average mastery from item state", () => {
    const checklist = parseChecklistMarkdown(SAMPLE);
    const summary = summarizeChecklistProgress(checklist, {
      "module-1-1": { completed: true, mastery: 4, completedAt: "2026-07-03" },
      "module-1-2": { completed: true, mastery: 2, completedAt: "2026-07-03" },
    });

    expect(summary.total).toBe(4);
    expect(summary.completed).toBe(2);
    expect(summary.percentage).toBe(50);
    expect(summary.averageMastery).toBe(3);
  });
});

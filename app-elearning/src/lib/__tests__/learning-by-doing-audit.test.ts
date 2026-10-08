import { describe, expect, it } from "vitest";
import { auditModules, classifyModule, formatAuditTable, summarizeAudit, type LearningByDoingInput } from "../learning-by-doing-audit";

function mod(overrides: Partial<LearningByDoingInput> = {}): LearningByDoingInput {
  return { moduleId: 1, levelId: "basico", title: "Módulo de prueba", rawContent: "### 🎯 Objetivo\n\nTexto.", interactivePractices: 0, ...overrides };
}

describe("learning-by-doing audit", () => {
  it("clasifica como ninguno un módulo sin marcas ni prácticas", () => {
    const row = classifyModule(mod());
    expect(row).toMatchObject({ hasMicrolessons: false, hasTransferChallenge: false, status: "ninguno" });
  });

  it("clasifica como piloto solo con microlecciones Y reto de transferencia", () => {
    const content = "## 🧩 Microlección 1 — Algo\n\ntexto\n\n## 🔁 Reto de transferencia\n\ntexto";
    expect(classifyModule(mod({ rawContent: content })).status).toBe("piloto");
  });

  it("clasifica como parcial si solo tiene una marca o prácticas interactivas", () => {
    expect(classifyModule(mod({ rawContent: "## 🧩 Microlección 1 — Algo" })).status).toBe("parcial");
    expect(classifyModule(mod({ rawContent: "## 🔁 Reto de transferencia" })).status).toBe("parcial");
    expect(classifyModule(mod({ interactivePractices: 2 })).status).toBe("parcial");
  });

  it("no confunde la palabra en el cuerpo con un encabezado", () => {
    const row = classifyModule(mod({ rawContent: "Aquí hablamos de una microlección y un reto de transferencia en prosa." }));
    expect(row.status).toBe("ninguno");
  });

  it("acepta microlección con y sin tilde", () => {
    expect(classifyModule(mod({ rawContent: "### Microleccion 2" })).hasMicrolessons).toBe(true);
    expect(classifyModule(mod({ rawContent: "### Microlección 2" })).hasMicrolessons).toBe(true);
  });

  it("ordena por moduleId y resume con porcentaje redondeado a un decimal", () => {
    const pilot = "## 🧩 Microlección 1\n\n## 🔁 Reto de transferencia";
    const rows = auditModules([
      mod({ moduleId: 3, rawContent: pilot }),
      mod({ moduleId: 1 }),
      mod({ moduleId: 2, interactivePractices: 1 }),
    ]);
    expect(rows.map((row) => row.moduleId)).toEqual([1, 2, 3]);
    expect(summarizeAudit(rows)).toEqual({
      total: 3, piloto: 1, parcial: 1, ninguno: 1, withTransferChallenge: 1, withTransferChallengePercent: 33.3,
    });
  });

  it("resume una lista vacía sin dividir entre cero", () => {
    expect(summarizeAudit([]).withTransferChallengePercent).toBe(0);
  });

  it("formatea una tabla Markdown con una fila por módulo", () => {
    const table = formatAuditTable(auditModules([mod({ moduleId: 7, title: "Siete" })]));
    expect(table.split("\n")).toHaveLength(3);
    expect(table).toContain("| 7 | basico | Siete | no | no | 0 | ninguno |");
  });
});

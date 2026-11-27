import { describe, expect, it } from "vitest";
import { getAllLabs } from "../content";
import {
  buildLabMission,
  isEvidenceComplete,
  isLabVerified,
  MAX_MISSION_CHECKS,
  sanitizeLabEvidenceMap,
} from "../lab-mission";

const sample = [
  "# Lab 99 — Prueba",
  "",
  "## Objetivo",
  "",
  "Construir una **solución** con [Dataverse](https://learn.microsoft.com/power-apps/maker/data-platform/) y `sit_`.",
  "",
  "## Ejercicio 1",
  "",
  "Ver [la doc](https://learn.microsoft.com/power-apps/maker/data-platform/?tabs=x) y [otra](https://learn.microsoft.com/power-automate/).",
  "",
  "## Checklist final",
  "",
  "- [ ] Tabla `Solicitud` creada",
  "- [ ] Flujo activo",
  "  con su conexión",
  "- [ ] Flujo activo",
  "",
  "## Evidencia esperada",
  "",
  "- Captura de la tabla",
  "1. ID de la ejecución",
  "",
  "## Criterios de aprobación",
  "",
  "- No se usa porque hay checklist",
].join("\n");

describe("buildLabMission", () => {
  it("saca objetivo, comprobaciones, evidencia y enlaces a Learn", () => {
    const mission = buildLabMission(sample);
    expect(mission.objective).toBe("Construir una solución con Dataverse y sit_.");
    expect(mission.checksSource).toBe("Checklist final");
    expect(mission.checks).toEqual(["Tabla Solicitud creada", "Flujo activo con su conexión", "Flujo activo"]);
    expect(mission.evidence).toEqual(["Captura de la tabla", "ID de la ejecución"]);
    expect(mission.learnLinks.map((l) => l.url)).toEqual([
      "https://learn.microsoft.com/power-apps/maker/data-platform/",
      "https://learn.microsoft.com/power-automate/",
    ]);
  });

  it("sin checklist usa la siguiente sección de cierre", () => {
    const mission = buildLabMission("## Objetivo\n\nX\n\n## Criterios de aprobación\n\n- Uno\n- Dos\n");
    expect(mission.checksSource).toBe("Criterios de aprobación");
    expect(mission.checks).toEqual(["Uno", "Dos"]);
  });

  it("todos los labs del curso tienen algo que comprobar y un objetivo", () => {
    for (const lab of getAllLabs()) {
      const mission = buildLabMission(lab.rawContent);
      expect(mission.checks.length, lab.slug).toBeGreaterThan(0);
      expect(mission.checks.length, lab.slug).toBeLessThanOrEqual(MAX_MISSION_CHECKS);
      expect(mission.objective.length, lab.slug).toBeGreaterThan(0);
    }
  });
});

describe("evidencia", () => {
  const checks = ["A", "B"];

  it("está completa con todas las comprobaciones y una nota suficiente", () => {
    expect(isEvidenceComplete(undefined, checks)).toBe(false);
    expect(isEvidenceComplete({ checks: ["A"], note: "x".repeat(40) }, checks)).toBe(false);
    expect(isEvidenceComplete({ checks: ["A", "B"], note: "corta" }, checks)).toBe(false);
    expect(isEvidenceComplete({ checks: ["B", "A"], note: "Tabla sit_solicitud, ejecución 0858…" }, checks)).toBe(true);
  });

  it("solo cuenta como entregada con fecha", () => {
    expect(isLabVerified({ checks: [], note: "" })).toBe(false);
    expect(isLabVerified({ checks: [], note: "", verifiedAt: "2026-11-27T10:00:00.000Z" })).toBe(true);
  });

  it("limpia valores corruptos", () => {
    expect(sanitizeLabEvidenceMap(null)).toEqual({});
    expect(
      sanitizeLabEvidenceMap({ a: { checks: ["x", 3], note: 5, verifiedAt: "" }, b: "no", c: { note: "n", verifiedAt: "2026" } }),
    ).toEqual({ a: { checks: ["x"], note: "" }, c: { checks: [], note: "n", verifiedAt: "2026" } });
  });
});

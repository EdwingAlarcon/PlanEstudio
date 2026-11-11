import { describe, expect, it } from "vitest";
import { formatActivityReport, summarizeActivity, type ActivityEvent } from "../rpa-sandbox-activity";

const table = (...ids: string[]) => ids.map((requestId) => ({ requestId }));

describe("summarizeActivity", () => {
  it("sin actividad no inventa resultados", () => {
    const summary = summarizeActivity([], table("SOL-2026-0001"));
    expect(summary.hasActivity).toBe(false);
    expect(summary.rows).toEqual([]);
    expect(formatActivityReport(summary)).toMatch(/Sin actividad/);
  });

  it("una corrida idempotente: consulta, registra una vez y todos los controles salen OK", () => {
    const events: ActivityEvent[] = [
      { kind: "consulta", requestId: "SOL-2026-0031", result: "No encontrado" },
      { kind: "registrar", requestId: "SOL-2026-0031", outcome: "insertado" },
      { kind: "consulta", requestId: "SOL-2026-0031", result: "Registrado" },
    ];
    const summary = summarizeActivity(events, table("SOL-2026-0031"));
    expect(summary.rows).toEqual([{ requestId: "SOL-2026-0031", consultas: 2, intentos: 1, insertados: 1, rechazados: 0, vecesEnTabla: 1 }]);
    expect(summary.intentosRedundantes).toBe(0);
    expect(summary.filasRepetidas).toBe(0);
    expect(summary.checks.every((check) => check.ok)).toBe(true);
    expect(formatActivityReport(summary)).toContain("[OK] Ninguna solicitud aparece más de una vez en Registros");
  });

  it("un reintento sobre una solicitud ya registrada cuenta como intento redundante", () => {
    const events: ActivityEvent[] = [
      { kind: "consulta", requestId: "SOL-2026-0032", result: "No encontrado" },
      { kind: "registrar", requestId: "SOL-2026-0032", outcome: "insertado" },
      { kind: "registrar", requestId: "SOL-2026-0032", outcome: "duplicado" },
    ];
    const summary = summarizeActivity(events, table("SOL-2026-0032"));
    expect(summary.intentosRedundantes).toBe(1);
    const check = summary.checks.find((item) => item.id === "sin-intentos-redundantes");
    expect(check?.ok).toBe(false);
    expect(check?.detail).toMatch(/1 intento/);
    expect(formatActivityReport(summary)).toContain("[REVISAR]");
  });

  it("detecta una fila repetida en la tabla (doble pulsación durante la confirmación lenta)", () => {
    const events: ActivityEvent[] = [
      { kind: "consulta", requestId: "SOL-2026-0040", result: "No encontrado" },
      { kind: "registrar", requestId: "SOL-2026-0040", outcome: "insertado" },
      { kind: "registrar", requestId: "SOL-2026-0040", outcome: "insertado" },
    ];
    const summary = summarizeActivity(events, table("SOL-2026-0040", "SOL-2026-0040"));
    expect(summary.filasRepetidas).toBe(1);
    expect(summary.rows[0]?.vecesEnTabla).toBe(2);
    expect(summary.checks.find((item) => item.id === "sin-filas-repetidas")?.ok).toBe(false);
  });

  it("marca las solicitudes insertadas sin consulta previa, y no las rechazadas", () => {
    const events: ActivityEvent[] = [
      { kind: "registrar", requestId: "SOL-2026-0050", outcome: "insertado" },
      { kind: "registrar", requestId: "SOL-2026-0051", outcome: "bloqueado" },
      { kind: "consulta", requestId: "SOL-2026-0052", result: "No encontrado" },
      { kind: "registrar", requestId: "SOL-2026-0052", outcome: "insertado" },
    ];
    const summary = summarizeActivity(events, table("SOL-2026-0050", "SOL-2026-0052"));
    expect(summary.sinConsultaPrevia).toEqual(["SOL-2026-0050"]);
    expect(summary.rows.find((row) => row.requestId === "SOL-2026-0051")).toMatchObject({ intentos: 1, insertados: 0, rechazados: 1 });
    expect(summary.checks.find((item) => item.id === "consulta-previa")?.detail).toContain("SOL-2026-0050");
  });

  it("el aviso cerrado se cuenta aparte y no altera intentos ni comprobaciones", () => {
    const base: ActivityEvent[] = [
      { kind: "consulta", requestId: "SOL-2026-0070", result: "No encontrado" },
      { kind: "registrar", requestId: "SOL-2026-0070", outcome: "insertado" },
    ];
    const sinAviso = summarizeActivity(base, table("SOL-2026-0070"));
    const conAviso = summarizeActivity([base[0]!, { kind: "aviso-cerrado" }, base[1]!], table("SOL-2026-0070"));
    expect(conAviso.avisosCerrados).toBe(1);
    expect(conAviso.rows).toEqual(sinAviso.rows);
    expect(conAviso.checks).toEqual(sinAviso.checks);
    expect(formatActivityReport(conAviso)).toContain("Avisos inesperados cerrados: 1");
    // En los demás modos el informe no cambia: sin aviso, no aparece la línea.
    expect(sinAviso.avisosCerrados).toBe(0);
    expect(formatActivityReport(sinAviso)).not.toContain("Avisos inesperados");
  });

  it("agrupa los identificadores vacíos y recorta espacios", () => {
    const events: ActivityEvent[] = [
      { kind: "registrar", requestId: "  ", outcome: "incompleto" },
      { kind: "consulta", requestId: " SOL-2026-0060 ", result: "No encontrado" },
    ];
    const summary = summarizeActivity(events, []);
    expect(summary.rows.map((row) => row.requestId)).toEqual(["(vacío)", "SOL-2026-0060"]);
  });
});

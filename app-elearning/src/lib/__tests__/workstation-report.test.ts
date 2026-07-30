import { describe, expect, it } from "vitest";
import {
  VERIFIABLE_TOOL_IDS,
  WORKSTATION_REPORT_FORMAT,
  WORKSTATION_REPORT_MAX_BYTES,
  parseWorkstationReportText,
  validateWorkstationReportPayload,
} from "../workstation-report";
import { WORKSTATION_TOOLS } from "../workstation";

function validPayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    format: WORKSTATION_REPORT_FORMAT,
    schemaVersion: 1,
    generatedAt: "2026-07-30T12:00:00Z",
    os: "windows",
    tools: [
      { id: "git", command: "git --version", detected: true, rawVersion: "git version 2.45.1", status: "installed" },
      { id: "node", command: "node --version", detected: false, rawVersion: "", status: "not_installed" },
    ],
    ...overrides,
  };
}

describe("workstation-report", () => {
  it("acepta un reporte válido y produce entries", () => {
    const preview = validateWorkstationReportPayload(validPayload());
    expect(preview.status).toBe("valid");
    expect(preview.os).toBe("windows");
    expect(preview.entries).toEqual([
      { toolId: "git", status: "installed", detectedVersion: "git version 2.45.1" },
      { toolId: "node", status: "not_installed", detectedVersion: undefined },
    ]);
    expect(preview.errors).toHaveLength(0);
  });

  it("rechaza JSON inválido", () => {
    const preview = parseWorkstationReportText("{ esto no es json");
    expect(preview.status).toBe("corrupt");
    expect(preview.errors[0]).toMatch(/JSON válido/);
  });

  it("rechaza un formato incorrecto", () => {
    const preview = validateWorkstationReportPayload(validPayload({ format: "otro-formato" }));
    expect(preview.status).toBe("corrupt");
    expect(preview.errors[0]).toMatch(/formato no corresponde/);
  });

  it("marca como incompatible una versión de esquema futura", () => {
    const preview = validateWorkstationReportPayload(validPayload({ schemaVersion: 2 }));
    expect(preview.status).toBe("incompatible");
  });

  it("rechaza una clave peligrosa", () => {
    const unsafeJson = JSON.stringify(validPayload()).replace(/}$/, ',"__proto__":{"polluted":true}}');
    const preview = parseWorkstationReportText(unsafeJson);
    expect(preview.status).toBe("corrupt");
  });

  it("rechaza un os inválido", () => {
    const preview = validateWorkstationReportPayload(validPayload({ os: "amiga-os" }));
    expect(preview.status).toBe("corrupt");
    expect(preview.errors.join(" ")).toMatch(/sistema operativo/);
  });

  it("ignora con warning una herramienta desconocida y conserva las válidas", () => {
    const preview = validateWorkstationReportPayload(
      validPayload({
        tools: [
          { id: "git", status: "installed", rawVersion: "git version 2.45.1" },
          { id: "herramienta-inexistente", status: "installed", rawVersion: "1.0" },
        ],
      })
    );
    expect(preview.status).toBe("valid");
    expect(preview.entries).toHaveLength(1);
    expect(preview.entries[0]?.toolId).toBe("git");
    expect(preview.warnings.some((warning) => warning.includes("herramienta-inexistente"))).toBe(true);
  });

  it("rechaza un texto que excede el tamaño máximo", () => {
    const oversized = "x".repeat(WORKSTATION_REPORT_MAX_BYTES + 1);
    const preview = parseWorkstationReportText(oversized);
    expect(preview.status).toBe("corrupt");
    expect(preview.errors[0]).toMatch(/tamaño máximo/);
  });

  it("guardarraíl anti-drift: todo VERIFIABLE_TOOL_ID tiene verification.command en WORKSTATION_TOOLS", () => {
    const toolsWithVerification = new Set(
      WORKSTATION_TOOLS.filter((tool) => Boolean(tool.verification)).map((tool) => tool.id)
    );
    for (const id of VERIFIABLE_TOOL_IDS) {
      expect(toolsWithVerification.has(id)).toBe(true);
    }
    expect(VERIFIABLE_TOOL_IDS.length).toBeGreaterThan(0);
  });
});

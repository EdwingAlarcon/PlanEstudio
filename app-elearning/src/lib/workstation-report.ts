import { OPERATING_SYSTEMS, WORKSTATION_TOOLS, type OperatingSystem, type ToolStatus } from "./workstation";

export const WORKSTATION_REPORT_FORMAT = "planestudio-workstation-report";
export const WORKSTATION_REPORT_SCHEMA_VERSION = 1;
export const WORKSTATION_REPORT_MAX_BYTES = 200_000;

const VALID_TOOL_STATUSES: ToolStatus[] = ["installed", "not_installed"];

export const VERIFIABLE_TOOL_IDS: string[] = WORKSTATION_TOOLS
  .filter((tool) => Boolean(tool.verification))
  .map((tool) => tool.id);

export interface WorkstationReportEntry {
  toolId: string;
  status: ToolStatus;
  detectedVersion?: string;
}

export interface WorkstationReportPreview {
  status: "valid" | "incompatible" | "corrupt";
  os: OperatingSystem | null;
  generatedAt: string | null;
  entries: WorkstationReportEntry[];
  warnings: string[];
  errors: string[];
}

function emptyReportPreview(): WorkstationReportPreview {
  return { status: "corrupt", os: null, generatedAt: null, entries: [], warnings: [], errors: [] };
}

function corruptReportPreview(message: string): WorkstationReportPreview {
  return { ...emptyReportPreview(), errors: [message] };
}

function findDangerousKey(value: unknown, depth = 0): string | null {
  if (depth > 12) return "profundidad excesiva";
  if (!value || typeof value !== "object") return null;
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (["__proto__", "constructor", "prototype"].includes(key)) return key;
    const found = findDangerousKey(nested, depth + 1);
    if (found) return found;
  }
  return null;
}

function stringField(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, maxLength) : "";
}

export function parseWorkstationReportText(text: string): WorkstationReportPreview {
  if (text.length > WORKSTATION_REPORT_MAX_BYTES) {
    return corruptReportPreview("El reporte supera el tamaño máximo permitido para una importación local segura.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return corruptReportPreview("El reporte no es JSON válido.");
  }
  return validateWorkstationReportPayload(parsed);
}

export function validateWorkstationReportPayload(payload: unknown): WorkstationReportPreview {
  const dangerous = findDangerousKey(payload);
  if (dangerous) return corruptReportPreview(`El reporte contiene un campo no permitido: ${dangerous}.`);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return corruptReportPreview("El reporte debe ser un objeto JSON.");
  }

  const raw = payload as Record<string, unknown>;
  if (raw.format !== WORKSTATION_REPORT_FORMAT) {
    return corruptReportPreview("El formato no corresponde a un reporte del verificador de estación de PlanEstudio.");
  }

  const schemaVersion = Number(raw.schemaVersion ?? 0);
  if (!Number.isInteger(schemaVersion) || schemaVersion < 1) {
    return corruptReportPreview("La versión de esquema no es válida.");
  }
  if (schemaVersion > WORKSTATION_REPORT_SCHEMA_VERSION) {
    return {
      ...emptyReportPreview(),
      status: "incompatible",
      errors: ["El reporte pertenece a una versión futura de PlanEstudio y no se importará."],
    };
  }

  const warnings: string[] = [];
  const errors: string[] = [];

  const os = (OPERATING_SYSTEMS as readonly string[]).includes(raw.os as string) ? (raw.os as OperatingSystem) : null;
  if (!os) errors.push("El campo os no es un sistema operativo reconocido.");

  const generatedAt = stringField(raw.generatedAt, 80) || null;
  if (generatedAt && Number.isNaN(Date.parse(generatedAt))) warnings.push("generatedAt no es una fecha válida; se ignoró.");

  const toolsRaw = raw.tools;
  if (!Array.isArray(toolsRaw) || toolsRaw.length === 0) {
    errors.push("El reporte no contiene ninguna herramienta.");
  }

  const entries: WorkstationReportEntry[] = [];
  if (Array.isArray(toolsRaw)) {
    for (const item of toolsRaw) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        warnings.push("Se ignoró una entrada de herramienta con formato inválido.");
        continue;
      }
      const entry = item as Record<string, unknown>;
      const toolId = stringField(entry.id, 60);
      if (!toolId) {
        warnings.push("Se ignoró una entrada de herramienta sin id.");
        continue;
      }
      if (!VERIFIABLE_TOOL_IDS.includes(toolId)) {
        warnings.push(`Herramienta desconocida ignorada: ${toolId}.`);
        continue;
      }
      const statusValue = stringField(entry.status, 40);
      if (!(VALID_TOOL_STATUSES as string[]).includes(statusValue)) {
        warnings.push(`Estado inválido para ${toolId}; se ignoró.`);
        continue;
      }
      const detectedVersion = stringField(entry.rawVersion, 120) || undefined;
      entries.push({ toolId, status: statusValue as ToolStatus, detectedVersion });
    }
  }

  if (entries.length === 0 && errors.length === 0) {
    errors.push("Ninguna herramienta del reporte coincide con herramientas verificables de PlanEstudio.");
  }

  if (errors.length > 0) {
    return { status: "corrupt", os, generatedAt, entries: [], warnings, errors };
  }

  return { status: "valid", os, generatedAt, entries, warnings, errors };
}

/**
 * Registro de actividad del sandbox "SIT Registro Legacy".
 *
 * El sandbox es nuestro, así que puede dar evidencia objetiva de lo que hizo el bot: cuántas veces pulsó Registrar sobre
 * cada solicitud, si consultó antes y si alguna quedó repetida en la tabla. No valida nada contra un tenant real.
 */

export type LegacyOutcome = "insertado" | "duplicado" | "bloqueado" | "incompleto";

export type ActivityEvent =
  | { kind: "consulta"; requestId: string; result: string }
  | { kind: "registrar"; requestId: string; outcome: LegacyOutcome };

export interface RequestActivity {
  requestId: string;
  consultas: number;
  intentos: number;
  insertados: number;
  rechazados: number;
  vecesEnTabla: number;
}

export interface ActivityCheck {
  id: "sin-filas-repetidas" | "sin-intentos-redundantes" | "consulta-previa";
  label: string;
  ok: boolean;
  detail: string;
}

export interface ActivitySummary {
  rows: RequestActivity[];
  /** Pulsaciones de Registrar rechazadas por duplicado (la solicitud ya existía). */
  intentosRedundantes: number;
  /** Filas sobrantes en la tabla Registros: una solicitud presente N veces suma N-1. */
  filasRepetidas: number;
  /** Solicitudes insertadas sin una consulta por ID anterior a su primer Registrar. */
  sinConsultaPrevia: string[];
  checks: ActivityCheck[];
  hasActivity: boolean;
}

const EMPTY_ID = "(vacío)";

export function summarizeActivity(events: ActivityEvent[], records: Array<{ requestId: string }>): ActivitySummary {
  const byId = new Map<string, RequestActivity>();
  const touch = (rawId: string) => {
    const id = rawId.trim() || EMPTY_ID;
    let row = byId.get(id);
    if (!row) {
      row = { requestId: id, consultas: 0, intentos: 0, insertados: 0, rechazados: 0, vecesEnTabla: 0 };
      byId.set(id, row);
    }
    return row;
  };

  const consultedBefore = new Set<string>();
  const firstRegisterSeen = new Set<string>();
  const insertedWithoutLookup = new Set<string>();
  let intentosRedundantes = 0;

  for (const event of events) {
    const row = touch(event.requestId);
    if (event.kind === "consulta") {
      row.consultas += 1;
      consultedBefore.add(row.requestId);
      continue;
    }
    row.intentos += 1;
    if (event.outcome === "insertado") row.insertados += 1;
    else row.rechazados += 1;
    if (event.outcome === "duplicado") intentosRedundantes += 1;
    if (!firstRegisterSeen.has(row.requestId)) {
      firstRegisterSeen.add(row.requestId);
      if (event.outcome === "insertado" && !consultedBefore.has(row.requestId)) insertedWithoutLookup.add(row.requestId);
    }
  }

  const counts = new Map<string, number>();
  for (const record of records) counts.set(record.requestId, (counts.get(record.requestId) ?? 0) + 1);
  let filasRepetidas = 0;
  for (const [id, count] of counts) {
    if (count > 1) filasRepetidas += count - 1;
    const row = byId.get(id);
    if (row) row.vecesEnTabla = count;
  }

  const rows = [...byId.values()].sort((a, b) => a.requestId.localeCompare(b.requestId));
  const sinConsultaPrevia = [...insertedWithoutLookup].sort();
  const hasActivity = events.length > 0;

  const checks: ActivityCheck[] = [
    {
      id: "sin-filas-repetidas",
      label: "Ninguna solicitud aparece más de una vez en Registros",
      ok: filasRepetidas === 0,
      detail: filasRepetidas === 0 ? "0 filas repetidas" : `${filasRepetidas} fila(s) repetida(s) en la tabla`,
    },
    {
      id: "sin-intentos-redundantes",
      label: "Ningún Registrar se pulsó sobre una solicitud ya registrada",
      ok: intentosRedundantes === 0,
      detail:
        intentosRedundantes === 0
          ? "0 intentos redundantes"
          : `${intentosRedundantes} intento(s) rechazado(s) por duplicado: en una app sin esa protección, serían registros repetidos`,
    },
    {
      id: "consulta-previa",
      label: "Cada solicitud insertada se consultó por ID antes de registrarla",
      ok: sinConsultaPrevia.length === 0,
      detail: sinConsultaPrevia.length === 0 ? "todas consultadas antes" : `sin consulta previa: ${sinConsultaPrevia.join(", ")}`,
    },
  ];

  return { rows, intentosRedundantes, filasRepetidas, sinConsultaPrevia, checks, hasActivity };
}

/** Texto plano para copiar como evidencia (el alumno lo pega en su tabla de evidencia). */
export function formatActivityReport(summary: ActivitySummary): string {
  if (!summary.hasActivity) return "Sin actividad todavía. Consulta o registra una solicitud y vuelve a abrir este registro.";
  const lines = ["Solicitud | Consultas | Intentos de Registrar | Insertados | Rechazados | Veces en Registros"];
  for (const row of summary.rows) {
    lines.push(`${row.requestId} | ${row.consultas} | ${row.intentos} | ${row.insertados} | ${row.rechazados} | ${row.vecesEnTabla}`);
  }
  lines.push("");
  for (const check of summary.checks) lines.push(`[${check.ok ? "OK" : "REVISAR"}] ${check.label}: ${check.detail}`);
  return lines.join("\n");
}

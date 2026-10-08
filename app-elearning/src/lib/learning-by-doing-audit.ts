/**
 * Línea base del rediseño "Aprender haciendo" (Fase 1).
 *
 * Clasifica módulos según marcas objetivas del patrón validado en los pilotos
 * (Módulos 10, 11 y 13). Solo detecta lo que se puede comprobar en el texto:
 *  - encabezado "Microlección" (contenido troceado con práctica entre medias)
 *  - encabezado "Reto de transferencia" (reto sin pasos con requisito distinto)
 *  - prácticas interactivas vinculadas al módulo
 *
 * Limitación conocida: el troubleshooting "síntoma-primero" y la evidencia de tenant
 * estructurada no tienen un encabezado fijo en los pilotos, así que NO se miden aquí.
 * Un módulo `ninguno` puede tener actividades de decisión valiosas (p. ej. el Módulo 18);
 * esta clasificación mide el patrón del piloto, no la calidad pedagógica general.
 */

export type LearningByDoingStatus = "piloto" | "parcial" | "ninguno";

export interface LearningByDoingInput {
  moduleId: number;
  levelId: string;
  title: string;
  rawContent: string;
  interactivePractices: number;
}

export interface LearningByDoingRow extends LearningByDoingInput {
  hasMicrolessons: boolean;
  hasTransferChallenge: boolean;
  status: LearningByDoingStatus;
}

export interface LearningByDoingSummary {
  total: number;
  piloto: number;
  parcial: number;
  ninguno: number;
  withTransferChallenge: number;
  withTransferChallengePercent: number;
}

const MICROLESSON_HEADING = /^#{2,4}\s+.*Microlecci[oó]n/im;
const TRANSFER_HEADING = /^#{2,4}\s+.*Reto de transferencia/im;

export function classifyModule(input: LearningByDoingInput): LearningByDoingRow {
  const hasMicrolessons = MICROLESSON_HEADING.test(input.rawContent);
  const hasTransferChallenge = TRANSFER_HEADING.test(input.rawContent);
  let status: LearningByDoingStatus = "ninguno";
  if (hasMicrolessons && hasTransferChallenge) status = "piloto";
  else if (hasMicrolessons || hasTransferChallenge || input.interactivePractices > 0) status = "parcial";
  return { ...input, hasMicrolessons, hasTransferChallenge, status };
}

export function auditModules(inputs: LearningByDoingInput[]): LearningByDoingRow[] {
  return inputs.map(classifyModule).sort((a, b) => a.moduleId - b.moduleId);
}

export function summarizeAudit(rows: LearningByDoingRow[]): LearningByDoingSummary {
  const total = rows.length;
  const withTransferChallenge = rows.filter((row) => row.hasTransferChallenge).length;
  return {
    total,
    piloto: rows.filter((row) => row.status === "piloto").length,
    parcial: rows.filter((row) => row.status === "parcial").length,
    ninguno: rows.filter((row) => row.status === "ninguno").length,
    withTransferChallenge,
    withTransferChallengePercent: total === 0 ? 0 : Math.round((withTransferChallenge / total) * 1000) / 10,
  };
}

export function formatAuditTable(rows: LearningByDoingRow[]): string {
  const mark = (value: boolean) => (value ? "sí" : "no");
  const lines = [
    "| Módulo | Nivel | Título | Microlecciones | Reto de transferencia | Prácticas interactivas | Estado |",
    "|---|---|---|---|---|---|---|",
    ...rows.map(
      (row) =>
        `| ${row.moduleId} | ${row.levelId} | ${row.title} | ${mark(row.hasMicrolessons)} | ${mark(row.hasTransferChallenge)} | ${row.interactivePractices} | ${row.status} |`,
    ),
  ];
  return lines.join("\n");
}

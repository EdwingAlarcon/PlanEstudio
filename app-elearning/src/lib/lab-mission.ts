// Lab como misión (F3 de "El camino jugable", 2026-11-27).
// Saca del Markdown del lab, sin tocarlo, lo que el panel de misión necesita: el objetivo, la lista de comprobación
// que el alumno marca al terminar, la evidencia que se espera y los enlaces a Microsoft Learn del propio lab.
// La app no ve el tenant: la evidencia es lo que el alumno anota (IDs, nombres, cifras), por eso un lab entregado con
// evidencia vale 100 XP y uno solo marcado, 25 (xp.ts).

export interface LabMission {
  objective: string;
  /** Comprobaciones que el alumno marca, en el orden del lab. */
  checks: string[];
  /** Título de la sección de la que salen las comprobaciones (para decir de dónde vienen). */
  checksSource: string | null;
  /** Qué evidencia pide el lab (sección "Evidencia esperada"). */
  evidence: string[];
  learnLinks: { title: string; url: string }[];
}

export interface LabEvidence {
  /** Comprobaciones marcadas (su texto, tal como sale de `buildLabMission`). */
  checks: string[];
  note: string;
  /** Fecha ISO en que se entregó la evidencia completa. */
  verifiedAt?: string;
}

/** Secciones de cierre, por preferencia: la primera que tenga elementos es la lista de comprobación. */
const CHECK_SECTIONS = [
  "Checklist final",
  "Criterios de aprobación",
  "Criterios de validación",
  "Validaciones",
  "Entregables",
  "Evidencia esperada",
];

export const MAX_MISSION_CHECKS = 12;
export const MIN_EVIDENCE_NOTE_LENGTH = 30;

/** Quita la marca de Markdown que no se ve bien en texto plano. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Cuerpo de una sección `## Título` (hasta la siguiente `## `), o null si no existe. */
function getSection(markdown: string, title: string): string | null {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim().toLowerCase() === `## ${title}`.toLowerCase());
  if (start === -1) return null;
  const body: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^##\s/.test(line)) break;
    body.push(line);
  }
  return body.join("\n");
}

/** Elementos de lista de primer nivel ("- ", "- [ ] ", "1. "); una línea sangrada continúa el elemento anterior. */
function getListItems(section: string): string[] {
  const items: string[] = [];
  for (const line of section.split(/\n/)) {
    const top = /^(?:[-*]|\d+\.)\s+(?:\[[ xX]\]\s+)?(.*)$/.exec(line);
    if (top) {
      items.push(top[1] ?? "");
    } else if (/^\s{2,}\S/.test(line) && items.length > 0 && !/^\s+(?:[-*]|\d+\.)\s/.test(line)) {
      items[items.length - 1] += ` ${line.trim()}`;
    }
  }
  return items.map(plainText).filter((item) => item.length > 0);
}

function getObjective(markdown: string): string {
  const section = getSection(markdown, "Objetivo") ?? "";
  const paragraph = section
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p.length > 0 && !p.startsWith("#") && !p.startsWith(">"));
  return paragraph ? plainText(paragraph) : "";
}

/** "Learn: Columnas" → "Columnas"; un "Learn" a secas toma el nombre de la última parte de la URL. */
function learnTitle(text: string, url: string): string {
  const title = plainText(text).replace(/^(Microsoft )?Learn\s*[:—-]\s*/i, "");
  if (title && !/^(Microsoft )?Learn$/i.test(title)) return title;
  const last = url.replace(/\/+$/, "").split("/").pop() ?? "";
  const words = decodeURIComponent(last).replace(/\.[a-z]+$/, "").replace(/[-_]+/g, " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "Microsoft Learn";
}

function getLearnLinks(markdown: string): { title: string; url: string }[] {
  const seen = new Set<string>();
  const links: { title: string; url: string }[] = [];
  for (const match of markdown.matchAll(/\[([^\]]+)\]\((https:\/\/learn\.microsoft\.com\/[^)\s]+)\)/g)) {
    const url = (match[2] ?? "").replace(/[?#].*$/, "");
    if (seen.has(url)) continue;
    seen.add(url);
    links.push({ title: learnTitle(match[1] ?? "", url), url: match[2] ?? url });
    if (links.length === 3) break;
  }
  return links;
}

export function buildLabMission(markdown: string): LabMission {
  let checks: string[] = [];
  let checksSource: string | null = null;
  for (const title of CHECK_SECTIONS) {
    const section = getSection(markdown, title);
    const items = section ? getListItems(section) : [];
    if (items.length > 0) {
      checks = [...new Set(items)].slice(0, MAX_MISSION_CHECKS);
      checksSource = title;
      break;
    }
  }
  const evidenceSection = getSection(markdown, "Evidencia esperada");
  return {
    objective: getObjective(markdown),
    checks,
    checksSource,
    evidence: evidenceSection ? getListItems(evidenceSection).slice(0, 6) : [],
    learnLinks: getLearnLinks(markdown),
  };
}

/** La evidencia está completa si marcó todas las comprobaciones y anotó qué produjo. */
export function isEvidenceComplete(evidence: LabEvidence | undefined, checks: string[]): boolean {
  if (!evidence) return false;
  const marked = new Set(evidence.checks);
  return checks.every((check) => marked.has(check)) && evidence.note.trim().length >= MIN_EVIDENCE_NOTE_LENGTH;
}

export function isLabVerified(evidence: LabEvidence | undefined): boolean {
  return Boolean(evidence && typeof evidence.verifiedAt === "string" && evidence.verifiedAt.length > 0);
}

export function sanitizeLabEvidenceMap(raw: unknown): Record<string, LabEvidence> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result: Record<string, LabEvidence> = {};
  for (const [slug, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const v = value as Record<string, unknown>;
    const checks = Array.isArray(v.checks) ? v.checks.filter((c): c is string => typeof c === "string") : [];
    const note = typeof v.note === "string" ? v.note.slice(0, 4000) : "";
    const entry: LabEvidence = { checks, note };
    if (typeof v.verifiedAt === "string" && v.verifiedAt.length > 0) entry.verifiedAt = v.verifiedAt;
    result[slug] = entry;
  }
  return result;
}

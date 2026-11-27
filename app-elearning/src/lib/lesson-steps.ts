// Lección por pasos (F2 de "El camino jugable", 2026-11-27; piloto en el Módulo 11).
// Parte el Markdown de un módulo con microlecciones en pasos cortos, uno por pantalla, sin tocar el contenido:
//   - "Antes de empezar": lo que va antes de la primera microlección (objetivo y requisitos).
//   - Por cada "## 🧩 Microlección": el concepto, la micropráctica (si enlaza una práctica interactiva) y lo que
//     se hace en el ambiente (práctica real o reto de construcción, con su evidencia).
//   - El reto de transferencia, si existe.
//   - "Comprueba": el cierre, que remite al quiz del módulo.
// Lo que sigue al reto (Caso Real, Buenas Prácticas, Errores Comunes, Criterios) se queda en la página del módulo.

export type LessonStepKind = "intro" | "concepto" | "practica" | "ambiente" | "reto" | "comprueba";

export interface LessonStep {
  /** Estable dentro del módulo: "intro", "m1-concepto", "m1-practica", "m1-ambiente", "reto", "comprueba". */
  id: string;
  kind: LessonStepKind;
  /** Título de la microlección a la que pertenece (o del bloque). */
  group: string;
  markdown: string;
  /** Slug de la práctica interactiva que enlaza el paso de micropráctica. */
  practiceSlug?: string;
}

/** Módulos que tienen el modo por pasos. Se amplía por niveles en la F5. */
export const STEP_MODE_MODULE_KEYS = ["intermedio-11"] as const;

export function hasStepMode(moduleKey: string): boolean {
  return (STEP_MODE_MODULE_KEYS as readonly string[]).includes(moduleKey);
}

/** Id del paso tal como se guarda en el progreso académico (`completedSteps`). */
export function stepProgressId(moduleKey: string, stepId: string): string {
  return `${moduleKey}#${stepId}`;
}

const FENCE = /^\s*(```|~~~)/;
const H2 = /^##\s+(.*)$/;
const MICRO = /^##\s+🧩\s*Microlecci[oó]n\s+(\d+)\s*[—–-]\s*(.*)$/u;
const TRANSFER = /^##\s+🔁\s*Reto de transferencia/u;
const FIXED_SECTION = /^#{2,3}\s+(?:💼|✅ Buenas|⚠️|🧪|📸|➡️)/u;
const PRACTICE_MARKER = /^\*\*Ahora haz algo/;
const AMBIENTE_MARKER = /^\*\*(?:Práctica real|🏗️ Reto)/u;
const PRACTICE_LINK = /\]\(\/practica\/([a-z0-9-]+)\)/;

interface Block {
  heading: string;
  lines: string[];
}

function splitByH2(markdown: string): { intro: string[]; blocks: Block[] } {
  const intro: string[] = [];
  const blocks: Block[] = [];
  let current: Block | null = null;
  let inFence = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (FENCE.test(line)) inFence = !inFence;
    const isBreak = !inFence && (H2.test(line) || FIXED_SECTION.test(line));
    if (isBreak) {
      current = { heading: line, lines: [] };
      blocks.push(current);
      continue;
    }
    (current ? current.lines : intro).push(line);
  }
  return { intro, blocks };
}

const clean = (lines: string[]) => lines.join("\n").replace(/\n-{3,}\s*$/, "").trim();
const stripSeparators = (text: string) => text.replace(/^-{3,}\s*$/gm, "").trim();

export function buildLessonSteps(markdown: string): LessonStep[] {
  const { intro, blocks } = splitByH2(markdown);
  const steps: LessonStep[] = [];
  const introText = stripSeparators(clean(intro));
  if (introText) steps.push({ id: "intro", kind: "intro", group: "Antes de empezar", markdown: introText });

  for (const block of blocks) {
    const micro = MICRO.exec(block.heading);
    if (micro) {
      const n = micro[1]!;
      const group = `Microlección ${n} — ${micro[2]!.replace(/\*\*/g, "").trim()}`;
      const parts: Record<"concepto" | "practica" | "ambiente", string[]> = { concepto: [], practica: [], ambiente: [] };
      let section: "concepto" | "practica" | "ambiente" = "concepto";
      let inFence = false;
      for (const line of block.lines) {
        if (FENCE.test(line)) inFence = !inFence;
        if (!inFence && PRACTICE_MARKER.test(line) && section === "concepto") section = "practica";
        else if (!inFence && AMBIENTE_MARKER.test(line) && section !== "ambiente") section = "ambiente";
        parts[section].push(line);
      }
      for (const kind of ["concepto", "practica", "ambiente"] as const) {
        const text = stripSeparators(clean(parts[kind]));
        if (!text) continue;
        const practiceSlug = kind === "practica" ? PRACTICE_LINK.exec(text)?.[1] : undefined;
        steps.push({ id: `m${n}-${kind}`, kind, group, markdown: text, ...(practiceSlug ? { practiceSlug } : {}) });
      }
      continue;
    }
    if (TRANSFER.test(block.heading)) {
      const text = stripSeparators(clean(block.lines));
      if (text) steps.push({ id: "reto", kind: "reto", group: "Reto de transferencia", markdown: text });
    }
  }

  if (!steps.some((s) => s.kind === "concepto")) return [];
  steps.push({ id: "comprueba", kind: "comprueba", group: "Comprueba", markdown: "" });
  return steps;
}

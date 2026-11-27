// Lección por pasos (F2 de "El camino jugable", 2026-11-27, piloto en el Módulo 11; F5 la amplía a todo el curso).
// Parte el Markdown de un módulo con microlecciones en pasos cortos, uno por pantalla, sin tocar el contenido:
//   - "Antes de empezar": lo que va antes de la primera microlección (objetivo y requisitos), en varias pantallas si
//     es largo.
//   - Por cada "🧩 Microlección" (H2, o H3 en los proyectos integradores): el concepto, la micropráctica (si enlaza
//     una práctica interactiva) y lo que se hace en el ambiente (práctica real o reto de construcción).
//   - Los bloques H2 que hay entre microlecciones (un mini lab, una etapa del proyecto) como pasos propios.
//   - El reto de transferencia, si existe.
//   - "Comprueba": el cierre, que remite al quiz del módulo.
// Un paso muy largo se parte por sus H3 en varias pantallas; la primera conserva el id, así el avance guardado no se
// pierde. Lo que sigue al reto (Caso Real, Buenas Prácticas, Errores Comunes, Criterios) se queda en la página.

export type LessonStepKind = "intro" | "concepto" | "practica" | "ambiente" | "reto" | "comprueba";

export interface LessonStep {
  /** Estable dentro del módulo: "intro", "m1-concepto", "m1-practica", "m1-ambiente", "b1", "reto", "comprueba";
   *  las continuaciones de un paso largo llevan "-2", "-3"… */
  id: string;
  kind: LessonStepKind;
  /** Título de la microlección a la que pertenece (o del bloque). */
  group: string;
  markdown: string;
  /** Slug de la práctica interactiva que enlaza el paso de micropráctica. */
  practiceSlug?: string;
  /** Pantalla de "🔧 Profundización opcional": se puede saltar. */
  optional?: boolean;
}

/** Todo módulo con microlecciones tiene el modo por pasos (F5). */
export function hasStepMode(markdown: string): boolean {
  return buildLessonSteps(markdown).length > 0;
}

/** Id del paso tal como se guarda en el progreso académico (`completedSteps`). */
export function stepProgressId(moduleKey: string, stepId: string): string {
  return `${moduleKey}#${stepId}`;
}

/** Un paso con más caracteres que esto se parte; cada pantalla junta trozos hasta unos `TARGET_STEP_LENGTH`. */
export const MAX_STEP_LENGTH = 3500;
const TARGET_STEP_LENGTH = 2500;
/** Una pantalla más corta que esto se une a la anterior (salvo que la anterior sea de otra clase). */
const MIN_STEP_LENGTH = 400;

const FENCE = /^\s*(```|~~~)/;
const H2 = /^##\s+(.*)$/;
const HEADING = /^(#{1,6})\s+/;
/** Donde se puede cortar un paso largo: un encabezado H3-H6 o un párrafo que empieza con una etiqueta en negrita
 *  ("**Paso 2 —**", "**Evidencia a reportar:**"). Nunca dentro de una lista. */
const CUT_POINT = /^(?:#{3,6}\s+|\*\*[^*\n]{2,80}\*\*)/u;
/** Párrafos que explican los pasos anteriores: van con ellos, no abren pantalla. */
const NOT_A_CUT = /^\*\*(?:Si no lo ves|Si algo sale distinto|Qué deberías ver|Comprueba)/u;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;
/** Una pantalla no puede terminar en un título, un rótulo en cursiva o una frase que presenta lo que sigue (":"). */
const DANGLING = /^(?:#{1,6}\s.*|\*[^*\s][^*]*\*|_[^_\s][^_]*_|\*\*[^*]+\*\*:?)$|:$/u;
const OPTIONAL = /^(#{3,6})\s+🔧\s*Profundizaci[oó]n opcional/u;
const AMBIENTE_HINT = /^\*\*(?:Práctica|🏗️ Reto|Construye|Sin trial|Evidencia a reportar)/mu;
const MICRO = /^#{2,3}\s+🧩\s*Microlecci[oó]n\s+(\d+)\s*[—–-]\s*(.*)$/u;
const TRANSFER = /^##\s+🔁\s*Reto de transferencia/u;
const FIXED_SECTION = /^#{2,3}\s+(?:💼|✅ Buenas|⚠️|🧪|📸|➡️|📌)/u;
const PRACTICE_MARKER = /^\*\*Ahora haz algo/;
const AMBIENTE_MARKER = /^\*\*(?:Práctica real|Práctica del núcleo|Práctica en|🏗️ Reto|Construye en tu entorno)/u;
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
    const isBreak = !inFence && (H2.test(line) || FIXED_SECTION.test(line) || MICRO.test(line));
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
const headingText = (line: string) => line.replace(/^#+\s+/, "").replace(/\*\*/g, "").trim();

const lastLine = (text: string) => text.trimEnd().split("\n").at(-1)?.trim() ?? "";
const previousNonBlank = (lines: string[], i: number) => {
  for (let j = i - 1; j >= 0; j--) if (lines[j]!.trim()) return lines[j]!;
  return "";
};

/** Trocea `lines` (fuera de bloques de código y de listas) en las líneas que cumplen `isCut`. */
function cutLines(lines: string[], isCut: (line: string, previous: string) => boolean): string[] {
  const sections: string[][] = [[]];
  let inFence = false;
  lines.forEach((line, i) => {
    const fence = FENCE.test(line);
    const opening = fence && !inFence;
    if (fence) inFence = !inFence;
    const inList = LIST_ITEM.test(line) || /^\s{2,}\S/.test(line) || (LIST_ITEM.test(previousNonBlank(lines, i)) && !HEADING.test(line));
    if ((!inFence || opening) && !inList && isCut(line, lines[i - 1] ?? "") && sections.at(-1)!.some((l) => l.trim())) {
      sections.push([]);
    }
    sections.at(-1)!.push(line);
  });
  return sections.map((section) => section.join("\n").trim()).filter(Boolean);
}

/** Separa las "🔧 Profundización opcional" (hasta el siguiente título de su nivel o superior) del resto. */
function splitOptional(text: string): { markdown: string; optional: boolean }[] {
  const segments: { lines: string[]; optional: boolean }[] = [{ lines: [], optional: false }];
  let level = 0;
  let inFence = false;
  for (const line of text.split("\n")) {
    if (FENCE.test(line)) inFence = !inFence;
    const heading = !inFence ? HEADING.exec(line) : null;
    const opt = !inFence ? OPTIONAL.exec(line) : null;
    if (opt) {
      level = opt[1]!.length;
      segments.push({ lines: [], optional: true });
    } else if (heading && level > 0 && heading[1]!.length <= level) {
      level = 0;
      segments.push({ lines: [], optional: false });
    }
    segments.at(-1)!.lines.push(line);
  }
  return segments
    .map((seg) => ({ markdown: seg.lines.join("\n").trim(), optional: seg.optional }))
    .filter((seg) => seg.markdown);
}

/** Parte un texto largo por sus puntos de corte y, si un trozo sigue siendo largo, por párrafos; después junta
 *  trozos hasta TARGET_STEP_LENGTH sin dejar una pantalla colgando de un título o de un ":". */
function splitLong(text: string): string[] {
  if (text.length <= MAX_STEP_LENGTH) return [text];
  const byParagraph = (piece: string) =>
    cutLines(piece.split("\n"), (line, previous) => previous.trim() === "" && line.trim() !== "" && !NOT_A_CUT.test(line));
  // Último recurso, para listas de referencia enormes (Conceptos Clave, glosarios): cortar entre viñetas de primer
  // nivel. Nunca entre los pasos de una lista numerada.
  const byBullet = (piece: string) => {
    const sections: string[][] = [[]];
    let inFence = false;
    for (const line of piece.split("\n")) {
      if (FENCE.test(line)) inFence = !inFence;
      if (!inFence && /^[-*]\s/.test(line) && sections.at(-1)!.join("\n").length > TARGET_STEP_LENGTH) sections.push([]);
      sections.at(-1)!.push(line);
    }
    return sections.map((x) => x.join("\n").trim()).filter(Boolean);
  };
  const pieces = cutLines(text.split("\n"), (line) => CUT_POINT.test(line) && !NOT_A_CUT.test(line))
    .flatMap((piece) => (piece.length <= MAX_STEP_LENGTH ? [piece] : byParagraph(piece)))
    .flatMap((piece) => (piece.length <= MAX_STEP_LENGTH ? [piece] : byBullet(piece)));
  const chunks: string[] = [];
  let buffer = "";
  for (const piece of pieces) {
    const canCut = buffer.length >= MIN_STEP_LENGTH && !DANGLING.test(lastLine(buffer));
    if (buffer && canCut && buffer.length + piece.length > TARGET_STEP_LENGTH) {
      chunks.push(buffer);
      buffer = piece;
    } else {
      buffer = buffer ? `${buffer}\n\n${piece}` : piece;
    }
  }
  if (buffer) {
    if (chunks.length > 0 && buffer.length < MIN_STEP_LENGTH) chunks[chunks.length - 1] += `\n\n${buffer}`;
    else chunks.push(buffer);
  }
  return chunks.length > 0 ? chunks : [text];
}

function pushSplit(steps: LessonStep[], step: LessonStep) {
  let n = 0;
  const segments = splitOptional(step.markdown);
  segments.forEach((segment, s) => {
    let parts = splitLong(segment.markdown);
    // Un trozo obligatorio muy corto entre opcionales (o al final) se une al anterior del mismo tipo, si lo hay.
    const prev = steps.at(-1);
    if (!segment.optional && s > 0 && segment.markdown.length < MIN_STEP_LENGTH && prev && !prev.optional && prev.id.startsWith(step.id)) {
      prev.markdown += `\n\n${segment.markdown}`;
      return;
    }
    parts = parts.filter(Boolean);
    parts.forEach((markdown) => {
      n += 1;
      if (n === 1) {
        steps.push({ ...step, markdown, ...(segment.optional ? { optional: true } : {}) });
        return;
      }
      // La continuación de una micropráctica es trabajo en el ambiente: la práctica interactiva va solo en la primera.
      const { practiceSlug: _slug, ...rest } = step;
      void _slug;
      const kind: LessonStepKind =
        step.kind === "practica" || (step.kind === "concepto" && AMBIENTE_HINT.test(markdown)) ? "ambiente" : step.kind;
      steps.push({ ...rest, id: `${step.id}-${n}`, kind, markdown, ...(segment.optional ? { optional: true } : {}) });
    });
  });
}

export function buildLessonSteps(markdown: string): LessonStep[] {
  const { intro, blocks } = splitByH2(markdown);
  const steps: LessonStep[] = [];
  const introText = stripSeparators(clean(intro));
  if (introText) pushSplit(steps, { id: "intro", kind: "intro", group: "Antes de empezar", markdown: introText });

  let extra = 0;
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
        pushSplit(steps, { id: `m${n}-${kind}`, kind, group, markdown: text, ...(practiceSlug ? { practiceSlug } : {}) });
      }
      continue;
    }
    if (TRANSFER.test(block.heading)) {
      const text = stripSeparators(clean(block.lines));
      if (text) pushSplit(steps, { id: "reto", kind: "reto", group: "Reto de transferencia", markdown: text });
      break;
    }
    // Bloque H2 antes del reto (mini lab, etapa del proyecto): paso propio. Las secciones fijas, no.
    if (H2.test(block.heading) && !FIXED_SECTION.test(block.heading)) {
      const text = stripSeparators(clean(block.lines));
      if (!text) continue;
      extra += 1;
      pushSplit(steps, { id: `b${extra}`, kind: "concepto", group: headingText(block.heading), markdown: text });
    }
  }

  if (!steps.some((s) => s.kind === "concepto")) return [];
  steps.push({ id: "comprueba", kind: "comprueba", group: "Comprueba", markdown: "" });
  return steps;
}

// Divide el Markdown de un módulo en tramos para presentarlo por capas:
// las secciones opcionales (suplementos y repasos "opcional si ya los conoces") se muestran plegadas,
// y los títulos ## (microlecciones, mini labs, retos) forman el índice del módulo.
// No cambia el contenido: solo cómo se agrupa al mostrarlo.

export interface ModuleSegment {
  optional: boolean;
  title?: string;     // título del tramo opcional, sin almohadillas
  markdown: string;
}

export interface ModuleOutlineItem {
  title: string;
  slug: string;
}

const OPTIONAL_HEADING = /^(#{2,3})\s+(.*(?:Suplemento|\(opcional|opcional si).*)$/i;
const HEADING = /^(#{1,6})\s+(.*)$/;
const FENCE = /^\s*(```|~~~)/;

export function splitModuleSections(markdown: string): ModuleSegment[] {
  const segments: ModuleSegment[] = [];
  let current: ModuleSegment = { optional: false, markdown: "" };
  let optionalLevel = 0;
  let inFence = false;

  const push = () => {
    if (current.markdown.trim()) segments.push(current);
  };

  for (const line of markdown.split("\n")) {
    if (FENCE.test(line)) inFence = !inFence;
    const heading = inFence ? null : HEADING.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      const optional = OPTIONAL_HEADING.exec(line);
      if (optional) {
        push();
        optionalLevel = level;
        current = { optional: true, title: cleanHeading(optional[2]!), markdown: "" };
        continue; // el título va en el <summary>, no se repite dentro
      }
      if (current.optional && level <= optionalLevel) {
        push();
        optionalLevel = 0;
        current = { optional: false, markdown: "" };
      }
    }
    current.markdown += `${line}\n`;
  }
  push();
  return segments;
}

/** Títulos ## del módulo (fuera de bloques de código), con el slug que genera rehype-slug. */
export function getModuleOutline(markdown: string): ModuleOutlineItem[] {
  const items: ModuleOutlineItem[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (FENCE.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = /^##\s+(.*)$/.exec(line);
    if (match && !OPTIONAL_HEADING.test(line)) {
      const title = cleanHeading(match[1]!);
      items.push({ title, slug: githubSlug(match[1]!) });
    }
  }
  return items;
}

function cleanHeading(text: string): string {
  return text
    .replace(/\*\*|__|`/g, "")
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .trim();
}

// Mismo algoritmo que github-slugger (usado por rehype-slug) para el texto plano de un título.
export function githubSlug(text: string): string {
  return text
    .replace(/\*\*|__|`/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "")
    .replace(/ /g, "-");
}

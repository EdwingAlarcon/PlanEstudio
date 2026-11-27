// Quita el emoji decorativo con el que empiezan títulos y párrafos del contenido, solo al mostrarlo: los archivos no
// cambian porque el modo por pasos y las secciones del módulo reconocen esos marcadores. Un emoji solo (por ejemplo
// ✅ en una celda) se conserva, porque ahí es el dato.
interface Node {
  type: string;
  tagName?: string;
  value?: string;
  children?: Node[];
}

const LEADING = /^\s*(?:[\p{Extended_Pictographic}\u{2705}][\u{FE0F}\u{200D}\p{Extended_Pictographic}]*\s*)+/u;
const TARGETS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "strong"]);

export function stripLeadingEmoji(text: string): string {
  const rest = text.replace(LEADING, "");
  return rest.trim() ? rest : text;
}

function visit(node: Node) {
  if (node.type === "element" && node.tagName && TARGETS.has(node.tagName)) {
    const first = node.children?.[0];
    if (first?.type === "text" && first.value) {
      // Si detrás del emoji hay más contenido (una negrita, un enlace), se puede quitar entero.
      const alone = (node.children?.length ?? 0) === 1;
      first.value = alone ? stripLeadingEmoji(first.value) : first.value.replace(LEADING, "");
    }
  }
  node.children?.forEach(visit);
}

export function rehypeStripLeadingEmoji() {
  return (tree: Node) => visit(tree);
}

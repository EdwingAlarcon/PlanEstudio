// Escritura mínima de documentos .docx sin dependencias, a partir de bloques simples.
// Determinista: mismos bloques, mismos bytes (usa zipStore con fecha fija).
import { zipStore } from "./zip-xlsx.mjs";

/**
 * Bloques admitidos:
 *   { type: "h1" | "h2" | "p", text }
 *   { type: "li", text }                      (viñeta)
 *   { type: "table", header: string[], rows: string[][] }
 * En `text`, **negrita** se convierte en una ejecución en negrita.
 */

function escapeXml(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function runs(text, { bold = false, size } = {}) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0);
  return parts
    .map((part) => {
      const isBold = bold || (part.startsWith("**") && part.endsWith("**"));
      const value = part.startsWith("**") && part.endsWith("**") ? part.slice(2, -2) : part;
      const props = [isBold ? "<w:b/>" : "", size ? `<w:sz w:val="${size}"/>` : ""].join("");
      return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${escapeXml(value)}</w:t></w:r>`;
    })
    .join("");
}

function paragraph(text, { bold = false, size, spacingAfter = 120, indent = 0 } = {}) {
  const ind = indent ? `<w:ind w:left="${indent}" w:hanging="240"/>` : "";
  return `<w:p><w:pPr><w:spacing w:after="${spacingAfter}"/>${ind}</w:pPr>${runs(text, { bold, size })}</w:p>`;
}

function table(header, rows) {
  const border = '<w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="808080"/>';
  const cell = (text, bold) => `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>${paragraph(text, { bold, spacingAfter: 0 })}</w:tc>`;
  const row = (cells, bold) => `<w:tr>${cells.map((value) => cell(value, bold)).join("")}</w:tr>`;
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${border}</w:tblBorders></w:tblPr>${row(header, true)}${rows.map((r) => row(r, false)).join("")}</w:tbl>${paragraph("", { spacingAfter: 0 })}`;
}

function bodyXml(blocks) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h1":
          return paragraph(block.text, { bold: true, size: 36, spacingAfter: 240 });
        case "h2":
          return paragraph(block.text, { bold: true, size: 28, spacingAfter: 120 });
        case "li":
          return paragraph(`• ${block.text}`, { indent: 480 });
        case "table":
          return table(block.header, block.rows);
        default:
          return paragraph(block.text);
      }
    })
    .join("");
}

/** blocks → Buffer de un .docx (Word lo abre; Copilot Studio lo admite como conocimiento). */
export function buildDocx(blocks, { title = "Documento" } = {}) {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(title)}</dc:title><dc:creator>PlanEstudio</dc:creator><dc:language>es-ES</dc:language></cp:coreProperties>`;
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${bodyXml(blocks)}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  return zipStore([
    { name: "[Content_Types].xml", content: contentTypes },
    { name: "_rels/.rels", content: rels },
    { name: "docProps/core.xml", content: core },
    { name: "word/document.xml", content: document },
  ]);
}

/** blocks → Markdown equivalente (mismo contenido que el .docx). */
export function blocksToMarkdown(blocks) {
  const lines = [];
  for (const block of blocks) {
    if (block.type === "h1") lines.push(`# ${block.text}`, "");
    else if (block.type === "h2") lines.push(`## ${block.text}`, "");
    else if (block.type === "li") lines.push(`- ${block.text}`);
    else if (block.type === "table") {
      if (lines.length && lines[lines.length - 1].startsWith("- ")) lines.push("");
      lines.push(`| ${block.header.join(" | ")} |`, `|${block.header.map(() => "---").join("|")}|`);
      for (const row of block.rows) lines.push(`| ${row.join(" | ")} |`);
      lines.push("");
    } else {
      if (lines.length && lines[lines.length - 1].startsWith("- ")) lines.push("");
      lines.push(block.text, "");
    }
  }
  // Cierra listas que quedaron al final de una sección.
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    out.push(lines[i]);
    const next = lines[i + 1];
    if (lines[i].startsWith("- ") && next !== undefined && next !== "" && !next.startsWith("- ")) out.push("");
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

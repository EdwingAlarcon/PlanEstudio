import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const assetRoot = path.resolve(process.cwd(), "public", "practice-assets", "copilotstudio", "asistente-compras");
const sitCompras = path.resolve(process.cwd(), "public", "practice-assets", "powerautomate", "sit-compras");
const readText = (relative: string) => fs.readFileSync(path.join(assetRoot, relative), "utf-8");
const readJson = <T>(relative: string): T => JSON.parse(readText(relative)) as T;
const readLab = (slug: string) => fs.readFileSync(path.resolve(process.cwd(), "content", "labs", `${slug}.md`), "utf-8");

interface Pregunta {
  id: string;
  categoria: string;
  pregunta: string;
  debeContener?: string[];
  comportamientoEsperado?: string;
}
interface Expected {
  politica: { umbrales: number[] };
  preguntas: { total: number; porCategoria: Record<string, number> };
  lab144: {
    topicNivel: { importe: number; nivel: number }[];
    flujoRegistrar: { cantidad: number; precioUnitario: number; importe: number; nivel: number }[];
    preguntasDeConocimiento: string[];
  };
}

describe("Copilot Studio practice assets (Asistente de compras SIT)", () => {
  const manifest = readJson<{ format: string; assetPackId: string; files: string[]; bundle: string }>("manifest.json");
  const expected = readJson<Expected>("expected/respuestas-esperadas.json");
  const preguntas = readJson<{ preguntas: Pregunta[] }>("preguntas-prueba.json").preguntas;

  it("lists every file of the package and the downloadable bundle exists", () => {
    expect(manifest.format).toBe("planestudio-copilotstudio-practice-assets");
    expect(manifest.assetPackId).toBe("asistente-compras");
    for (const file of manifest.files) {
      expect(fs.existsSync(path.join(assetRoot, file)), file).toBe(true);
    }
    expect(manifest.files).toEqual(expect.arrayContaining(["manual-compras.docx", "manual-compras.md", "preguntas-prueba.json"]));
    expect(fs.statSync(path.join(assetRoot, manifest.bundle)).size).toBeGreaterThan(5_000);
  });

  it("writes the .docx files as zip packages with a Word document inside", () => {
    for (const file of ["manual-compras.docx", "faq-proveedores.docx"]) {
      const bytes = fs.readFileSync(path.join(assetRoot, file));
      expect(bytes.subarray(0, 2).toString("latin1"), file).toBe("PK");
      expect(bytes.includes(Buffer.from("word/document.xml")), file).toBe(true);
    }
  });

  it("keeps the manual aligned with the SIT Compras approval policy", () => {
    const politica = JSON.parse(fs.readFileSync(path.join(sitCompras, "politica-aprobacion.json"), "utf-8")) as {
      niveles: { importeHasta: number | null }[];
      plazoRespuestaDiasHabiles: number;
    };
    expect(expected.politica.umbrales).toEqual(politica.niveles.slice(0, 2).map((n) => n.importeHasta));
    const manual = readText("manual-compras.md");
    for (const fragment of ["Hasta 1.000 USD", "Más de 10.000 USD", "1.000,01 USD es de nivel 2", `${politica.plazoRespuestaDiasHabiles} días hábiles`, "Fraccionar una compra"]) {
      expect(manual, fragment).toContain(fragment);
    }
  });

  it("covers every test category and gives each question something to check", () => {
    expect(preguntas).toHaveLength(expected.preguntas.total);
    expect(new Set(preguntas.map((p) => p.id)).size).toBe(preguntas.length);
    expect(Object.keys(expected.preguntas.porCategoria).sort()).toEqual(
      ["ambigua", "datos-de-otra-persona", "en-alcance", "fuera-de-alcance", "instruccion-maliciosa", "limite"],
    );
    for (const pregunta of preguntas) {
      const checkable = (pregunta.debeContener?.length ?? 0) > 0 || Boolean(pregunta.comportamientoEsperado);
      expect(checkable, pregunta.id).toBe(true);
    }
  });

  it("computes the approval levels the topic and the agent flow must return, boundaries included", () => {
    expect(expected.lab144.topicNivel).toEqual([
      { importe: 1000, nivel: 1 },
      { importe: 1000.01, nivel: 2 },
      { importe: 4200, nivel: 2 },
      { importe: 10000, nivel: 2 },
      { importe: 10000.01, nivel: 3 },
      { importe: 18500, nivel: 3 },
    ]);
    expect(expected.lab144.flujoRegistrar.map((c) => [c.importe, c.nivel])).toEqual([[840, 1], [1000, 1], [4200, 2]]);
    for (const caso of expected.lab144.flujoRegistrar) expect(caso.importe).toBe(caso.cantidad * caso.precioUnitario);
  });

  it("matches what LAB-144 quotes", () => {
    const lab = readLab("lab-144-copilot-studio-en-un-dia");
    expect(lab).toContain("/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip");
    expect(lab).toContain("If(Topic.Importe <= 1000, 1, Topic.Importe <= 10000, 2, 3)");
    expect(lab).toContain(`Tiene ${preguntas.length} preguntas`);
    for (const id of expected.lab144.preguntasDeConocimiento) {
      const pregunta = preguntas.find((p) => p.id === id);
      expect(pregunta, id).toBeDefined();
      expect(lab, id).toContain(`| ${id} | ${pregunta!.pregunta} |`);
    }
  });
});

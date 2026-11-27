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

  it("keeps the LAB-145 entities and test messages consistent with the policy", () => {
    const entidades = readJson<{ listaCerrada: { valores: { valor: string; sinonimos: string[] }[] }; regex: { patron: string; validos: string[]; invalidos: string[] } }>("lab145/entidades.json");
    expect(entidades.listaCerrada.valores.map((v) => v.valor)).toEqual(["Tecnología", "Mobiliario", "Servicios profesionales", "Capacitación", "Viajes", "Papelería"]);
    const regex = new RegExp(`^${entidades.regex.patron.replace("(?i)", "")}$`, "i");
    for (const valido of entidades.regex.validos) expect(regex.test(valido), valido).toBe(true);
    for (const invalido of entidades.regex.invalidos) expect(regex.test(invalido), invalido).toBe(false);
    const lab145 = (readJson<{ lab145: { mensajes: { id: string; categoria: string | null; nivel: number | null; revisionTI: boolean }[] } }>("expected/respuestas-esperadas.json")).lab145;
    expect(lab145.mensajes.map((m) => [m.id, m.categoria, m.nivel, m.revisionTI])).toEqual([
      ["M1", "Tecnología", 2, true],
      ["M2", "Tecnología", 1, false],
      ["M3", "Mobiliario", 2, false],
      ["M4", "Servicios profesionales", 3, false],
      ["M5", null, null, false],
      ["M6", "Tecnología", 1, false],
    ]);
    const lab = readLab("lab-145-copilot-studio-topics-a-fondo");
    expect(lab).toContain("(?i)\\bPRV-\\d{3}\\b");
    for (const m of readJson<{ mensajes: { id: string; mensaje: string }[] }>("lab145/mensajes-prueba.json").mensajes) {
      expect(lab, m.id).toContain(`| ${m.id} | ${m.mensaje} |`);
    }
  });

  it("changes only what LAB-146 says between manual versions", () => {
    const v1 = readText("manual-compras.md");
    const v2 = readText("lab146/manual-compras-v2.md");
    expect(v1).toContain("Toda compra de más de **50 USD**");
    expect(v2).toContain("Toda compra de más de **100 USD**");
    expect(v1).toContain("2 días hábiles");
    expect(v2).toContain("3 días hábiles");
    expect(v1).not.toContain("Compras urgentes");
    expect(v2).toContain("## 10. Compras urgentes");
    const lab = readLab("lab-146-copilot-studio-conocimiento");
    expect(lab).toContain("https://learn.microsoft.com/es-es/power-automate");
    expect(lab).toContain("K1 y K2 dan 100 USD y 3 días hábiles");
  });

  it("gives LAB-147 a harness answer for every scenario", () => {
    const { escenarios } = readJson<{ escenarios: { id: string; harness: string; razon: string }[] }>("lab147/escenarios-harness.json");
    expect(escenarios.map((e) => e.id)).toEqual(["H1", "H2", "H3", "H4", "H5", "H6"]);
    for (const e of escenarios) {
      expect(["estándar", "Microsoft Copilot", "Customer Conversation"]).toContain(e.harness);
      expect(e.razon.length, e.id).toBeGreaterThan(30);
    }
    const lab = readLab("lab-147-copilot-studio-orquestacion-y-harness");
    for (const m of readJson<{ mensajes: { id: string; mensaje: string }[] }>("lab147/mensajes-orquestacion.json").mensajes) {
      expect(lab, m.id).toContain(m.id);
    }
  });

  it("gives LAB-148 validation cases that match the policy and the catalog", () => {
    const { casos, categoriasValidas, cajaMenorHasta } = readJson<{
      casos: { id: string; cantidad: number; precioUnitario: number; categoria: string; correo: string; resultadoEsperado: string; errores: string[]; importe: number | null; nivel: number | null }[];
      categoriasValidas: string[];
      cajaMenorHasta: number;
    }>("lab148/casos-validacion.json");
    expect(casos.map((c) => c.id)).toEqual(["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"]);
    expect(categoriasValidas).toHaveLength(6);
    for (const c of casos) {
      const ok = Number.isInteger(c.cantidad) && c.cantidad >= 1 && c.precioUnitario > 0 && categoriasValidas.includes(c.categoria) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.correo) && c.cantidad * c.precioUnitario > cajaMenorHasta;
      expect(c.resultadoEsperado, c.id).toBe(ok ? "OK" : "RECHAZADA");
      expect(c.errores.length > 0, c.id).toBe(!ok);
    }
    expect(casos.find((c) => c.id === "V1")).toMatchObject({ importe: 840, nivel: 1 });
    expect(casos.find((c) => c.id === "V8")!.errores).toHaveLength(2);

    const catalogo = [1, 2, 3].flatMap((p) => (JSON.parse(fs.readFileSync(path.join(sitCompras, "catalogo", `pagina-${p}.json`), "utf-8")) as { value: { CatalogoID: string; PrecioUSD: number; Categoria: string; Activo: boolean }[] }).value);
    const papeleria = catalogo.filter((c) => c.Categoria === "Papelería").sort((a, b) => a.PrecioUSD - b.PrecioUSD);
    expect(papeleria[0]!.CatalogoID).toBe("CAT-039");
    expect(catalogo.find((c) => c.CatalogoID === "CAT-002")!.PrecioUSD).toBe(320);
    expect(catalogo.find((c) => c.CatalogoID === "CAT-018")!.Activo).toBe(false);

    for (const file of ["lab148/catalogo-sit-openapi.json", "lab148/catalogo-sit-openapi-tres-operaciones.json"]) {
      const spec = readJson<{ swagger: string; host: string; basePath: string; paths: Record<string, unknown> }>(file);
      expect(spec.swagger, file).toBe("2.0");
      expect(spec.host).toBe("planestudio.vercel.app");
      for (const route of Object.keys(spec.paths)) {
        const local = route.replace("{pagina}", "1");
        expect(fs.existsSync(path.join(sitCompras, local)), `${file} ${route}`).toBe(true);
      }
    }
    const lab = readLab("lab-148-copilot-studio-herramientas");
    for (const m of readJson<{ mensajes: { id: string }[] }>("lab148/mensajes-herramientas.json").mensajes) expect(lab, m.id).toContain(`| ${m.id} |`);
    for (const c of casos) expect(lab, c.id).toContain(`| ${c.id} |`);
  });

  it("gives LAB-149 an Adaptive Card whose inputs the lab names", () => {
    const card = readJson<{ version: string; body: { type: string; id?: string }[]; actions: { type: string; data?: { actionSubmitId: string } }[] }>("lab149/tarjeta-solicitud.json");
    expect(card.version).toBe("1.5");
    const ids = card.body.filter((b) => b.type.startsWith("Input.")).map((b) => b.id);
    expect(ids).toEqual(["titulo", "area", "categoria", "cantidad", "precioUnitario"]);
    expect(card.actions.map((a) => a.data?.actionSubmitId)).toEqual(["revisar", "cancelar"]);
    const lab = readLab("lab-149-copilot-studio-experiencia-de-conversacion");
    for (const id of ids) expect(lab, id).toContain(`Topic.${id}`);
    for (const e of readJson<{ escenarios: { id: string }[] }>("lab149/escenarios-conversacion.json").escenarios) expect(lab, e.id).toContain(`| ${e.id} |`);
    expect(lab).toContain("950 USD");
    expect(lab).toContain("4.200 USD");
  });

  it("gives LAB-150 another person's rows and the identity tests it quotes", () => {
    const { filas } = readJson<{ filas: { correo: string; cantidad: number; precioUnitario: number; importe: number }[] }>("lab150/filas-otra-persona.json");
    expect(filas).toHaveLength(2);
    for (const f of filas) {
      expect(f.correo).toBe("ana.gomez@sit.example.com");
      expect(f.importe).toBe(f.cantidad * f.precioUnitario);
    }
    const lab = readLab("lab-150-copilot-studio-identidad-del-usuario");
    for (const id of ["I2", "I3", "I5", "I6"]) expect(lab, id).toContain(`| ${id} |`);
    for (const d of readJson<{ situaciones: { id: string }[] }>("lab150/decisiones-identidad.json").situaciones) expect(lab, d.id).toContain(`| ${d.id} |`);
    expect(lab).toContain("750 USD");
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

import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const assetRoot = path.resolve(process.cwd(), "public", "practice-assets", "powerautomate", "sit-compras");
const readJson = <T>(relative: string): T => JSON.parse(fs.readFileSync(path.join(assetRoot, relative), "utf-8")) as T;
const readLab = (slug: string) => fs.readFileSync(path.resolve(process.cwd(), "content", "labs", `${slug}.md`), "utf-8");

interface Politica {
  niveles: { nivel: number; importeHasta: number | null }[];
}
interface Expected {
  filas: Record<string, number>;
  lab128: { casos: { titulo: string; importe: number; nivel: number }[] };
  solicitudes: { porEstado: Record<string, number>; porNivel: Record<string, number>; suciedad: Record<string, string[]> };
  lab129: { umbralAlertaUSD: number; casosQueDisparan: string[]; casosQueNoDisparan: string[] };
  lab130: {
    filasLimpias: number;
    filasRechazadas: string[];
    fechasConvertidas: number;
    preciosConvertidos: number;
    categoriasConEspacios: number;
    importeTotalLimpio: number;
    filasPorMesLimpio: Record<string, number>;
    importePendientesLimpias: number;
    pendientesLimpias: { id: string; importe: number; nivel: number }[];
  };
  lab131: { casos: { caso: string; importe: number; nivel: number; etapas: string[] }[] };
}
interface CatalogPage {
  "@odata.count": number;
  value: { CatalogoID: string }[];
  "@odata.nextLink"?: string;
}

describe("Power Automate practice assets (SIT Compras)", () => {
  const manifest = readJson<{ format: string; assetPackId: string; files: string[]; bundle: string }>("manifest.json");
  const expected = readJson<Expected>("expected/cifras-esperadas.json");

  it("lists every file of the package and the downloadable bundle exists", () => {
    expect(manifest.format).toBe("planestudio-powerautomate-practice-assets");
    expect(manifest.assetPackId).toBe("sit-compras");
    for (const file of manifest.files) {
      expect(fs.existsSync(path.join(assetRoot, file)), file).toBe(true);
    }
    expect(manifest.files).toContain("solicitudes-compra.xlsx");
    expect(fs.statSync(path.join(assetRoot, manifest.bundle)).size).toBeGreaterThan(10_000);
  });

  it("keeps the approval policy thresholds the labs quote", () => {
    const politica = readJson<Politica>("politica-aprobacion.json");
    expect(politica.niveles.map((n) => n.importeHasta)).toEqual([1000, 10000, null]);
  });

  it("serves the catalogue as linked pages that add up to the declared count", () => {
    const ids: string[] = [];
    let page = readJson<CatalogPage>("catalogo/pagina-1.json");
    let guard = 0;
    for (;;) {
      ids.push(...page.value.map((item) => item.CatalogoID));
      const next = page["@odata.nextLink"];
      if (!next || guard++ > 10) break;
      page = readJson<CatalogPage>(`catalogo/${next.split("/").pop()}`);
    }
    expect(ids.length).toBe(page["@odata.count"]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(expected.filas["paginasCatalogo"]).toBe(3);
  });

  it("matches the figures quoted in LAB-128", () => {
    const niveles = expected.lab128.casos.map((c) => [c.importe, c.nivel]);
    expect(niveles).toEqual([
      [840, 1],
      [1000, 1],
      [4200, 2],
      [18500, 3],
    ]);
    const lab = readLab("lab-128-power-automate-en-un-dia");
    expect(lab).toContain("| A | 840 | **1** | Aprobada |");
    expect(lab).toContain("| D | 18500 | **3** | Pendiente");
    expect(lab).toContain("lessOrEquals(outputs('Calcular_importe'), 1000), 1");
  });

  it("keeps the historical requests consistent", () => {
    const total = Object.values(expected.solicitudes.porEstado).reduce((a, b) => a + b, 0);
    expect(total).toBe(expected.filas["solicitudes"]);
    expect(Object.values(expected.solicitudes.porNivel).reduce((a, b) => a + b, 0)).toBe(150);
  });

  it("matches the figures quoted in LAB-129", () => {
    expect(expected.lab129.umbralAlertaUSD).toBe(10000);
    expect(expected.lab129.casosQueDisparan).toEqual(["Estudio de mercado regional"]);
    const lab = readLab("lab-129-power-automate-desencadenadores");
    expect(lab).toContain("greater(coalesce(triggerOutputs()?['body/sit_importe'], 0), 10000)");
    expect(lab).toContain("sit_importe gt 10000");
    expect(lab).toContain("| P2 | 12.000 | **1** |");
    expect(lab).toContain("2026-12-25");
  });

  it("matches the figures quoted in LAB-130", () => {
    const l = expected.lab130;
    expect(l.filasLimpias).toBe(146);
    expect(l.filasRechazadas).toEqual(["SC-2026-0026", "SC-2026-0074", "SC-2026-0108", "SC-2026-0133"]);
    expect(l.importeTotalLimpio).toBe(458365);
    expect(l.importePendientesLimpias).toBe(10997);
    const lab = readLab("lab-130-power-automate-expresiones-y-datos");
    const s = expected.solicitudes.suciedad;
    expect(lab).toContain(
      `fechas=${s["fechaDMY"]!.length} precios=${s["precioTexto"]!.length} cantidades=${s["cantidadVacia"]!.length} categorías=${s["categoriaConEspacios"]!.length}`,
    );
    expect(lab).toContain("**458365**");
    expect(lab).toContain("| Válidas de marzo de 2026 | **" + l.filasPorMesLimpio["2026-03"] + "** |");
    expect(lab).toContain("| Válidas de octubre de 2026 | **" + l.filasPorMesLimpio["2026-10"] + "** |");
    for (const row of l.pendientesLimpias) expect(lab).toContain(`| ${row.id} |`);
    expect(lab).toContain("**10.997**");
  });

  it("matches the figures quoted in LAB-131", () => {
    expect(expected.lab131.casos.map((c) => [c.caso, c.importe, c.nivel, c.etapas.length])).toEqual([
      ["A", 840, 1, 1],
      ["E", 4200, 2, 2],
      ["F", 3300, 2, 2],
      ["D", 18500, 3, 3],
    ]);
    const lab = readLab("lab-131-power-automate-aprobaciones");
    expect(lab).toContain("| A | 840 | 1 | 1 (jefe) | **Aprobada** |");
    expect(lab).toContain("| F | 3300 | 2 | 2 (jefe; Finanzas, que rechaza) | **Rechazada** |");
    expect(lab).toContain("| D | 18500 | 3 | 3 (jefe, Finanzas, Gerencia) | **Aprobada** |");
  });
});

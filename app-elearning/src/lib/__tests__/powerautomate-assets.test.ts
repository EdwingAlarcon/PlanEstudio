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
  solicitudes: { porEstado: Record<string, number>; porNivel: Record<string, number> };
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
});

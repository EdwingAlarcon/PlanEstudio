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
  lab132: {
    proveedoresInicial: { filas: number; activos: number };
    actualizacion: { filas: number; nuevos: string[]; modificados: string[]; activosDespues: number };
    historico: {
      filas: number;
      porEstado: Record<string, number>;
      nivel2o3: number;
      tecnologiaNivel2o3: number;
      pendientesDeNivel2o3: string[];
      solicitudesDelProveedor013: number;
      importeDelProveedor013: number;
    };
  };
  lab135: { facturasEnElLote: number; facturasDistintas: number; resultadosPorTipo: Record<string, number>; importeConciliado: number; importeAPagarSinRevision: number };
  lab134: {
    paginas: number;
    filasPorPagina: number[];
    articulos: number;
    articulosActivos: number;
    sumaPreciosActivos: number;
    articulosTecnologia: number;
  };
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

  it("matches the figures quoted in LAB-132", () => {
    const l = expected.lab132;
    expect(l.proveedoresInicial).toEqual({ filas: 17, activos: 15 });
    expect(l.actualizacion).toMatchObject({ filas: 18, nuevos: ["PRV-018"], modificados: ["PRV-003", "PRV-005"], activosDespues: 17 });
    expect(l.historico.filas).toBe(146);
    expect(l.historico.porEstado).toEqual({ Aprobada: 127, Rechazada: 14, Pendiente: 5 });
    expect(l.historico.nivel2o3).toBe(94);
    expect(l.historico.tecnologiaNivel2o3).toBe(20);
    expect(l.historico.pendientesDeNivel2o3).toEqual(["SC-2026-0035", "SC-2026-0114"]);
    expect(l.historico.solicitudesDelProveedor013).toBe(22);
    expect(l.historico.importeDelProveedor013).toBe(59960);
    const lab = readLab("lab-132-power-automate-dataverse-a-fondo");
    for (const figure of ["| Q1 |", "**94**", "**2** (SC-2026-0035 y SC-2026-0114)", "**20**", "**127 / 14 / 5**", "**22** (importe total **59.960**)", "**PRV-018**", "**18**"]) {
      expect(lab).toContain(figure);
    }
    const csv = fs.readFileSync(path.join(assetRoot, "proveedores-actualizacion.csv"), "utf-8");
    expect(csv.trim().split(/\r?\n/).length).toBe(19);
  });

  it("matches the figures quoted in LAB-134 and serves the v2 catalogue", () => {
    const l = expected.lab134;
    expect(l.filasPorPagina).toEqual([20, 20, 1]);
    expect(l.articulos).toBe(41);
    expect(l.articulosActivos).toBe(40);
    expect(l.articulosTecnologia).toBe(10);
    expect(l.sumaPreciosActivos).toBe(48967);
    const lab = readLab("lab-134-power-automate-integracion-con-apis");
    expect(lab).toContain("**48.967**");
    expect(lab).toContain("| v1 | 41 | **40** | **10** |");
    expect(lab).toContain("| v2 | 41 | **40** | **10** |");
    type V2 = { value: { Precio: { valor: number }; Estado: string; PrecioUSD?: number; Activo?: boolean }[]; "@odata.nextLink"?: string };
    let page = readJson<V2>("catalogo-v2/pagina-1.json");
    const items: V2["value"] = [];
    let guard = 0;
    for (;;) {
      items.push(...page.value);
      const next = page["@odata.nextLink"];
      if (!next || guard++ > 10) break;
      page = readJson<V2>(`catalogo-v2/${next.split("/").pop()}`);
    }
    expect(items.length).toBe(41);
    expect(items.every((i) => i.PrecioUSD === undefined && i.Activo === undefined)).toBe(true);
    const activos = items.filter((i) => i.Estado === "activo");
    expect(activos.length).toBe(40);
    expect(activos.reduce((sum, i) => sum + i.Precio.valor, 0)).toBe(48967);
    expect(readJson<{ facturaId: string }>("webhook/ejemplo-factura.json").facturaId).toBe("FAC-2026-0001");
  });

  it("matches the figures quoted in LAB-135 and the invoice files", () => {
    const l = expected.lab135;
    expect(l.facturasEnElLote).toBe(14);
    expect(l.facturasDistintas).toBe(13);
    expect(l.resultadosPorTipo).toEqual({
      Conciliada: 6,
      Duplicada: 1,
      "Conciliada con diferencia": 2,
      "Fuera de tolerancia": 1,
      "Proveedor distinto": 1,
      "Moneda distinta": 1,
      "Sin solicitud": 1,
      "Solicitud no aprobada": 1,
    });
    expect(l.importeConciliado).toBe(28086.6);
    expect(l.importeAPagarSinRevision).toBe(23594);
    const lab = readLab("lab-135-power-automate-documentos-y-conciliacion");
    for (const figure of ["28.086,60", "23.594", "**13**", "| Conciliada | 6"]) {
      expect(lab).toContain(figure);
    }
    const lote = readJson<{ facturaId: string; importe: number }[]>("facturas/lote-facturas.json");
    expect(lote.length).toBe(14);
    expect(new Set(lote.map((f) => f.facturaId)).size).toBe(13);
    expect(readJson<{ toleranciaPorcentaje: number }>("reglas-conciliacion.json").toleranciaPorcentaje).toBe(2);
  });

  it("keeps LAB-133 consistent with the tools it teaches", () => {
    const lab = readLab("lab-133-power-automate-errores-reintentos-idempotencia");
    expect(lab).toContain("result('Try')");
    expect(lab).toContain("Terminate");
    expect(lab).toContain("range(1, 10)");
    expect(lab).toContain("no se puede deshacer");
  });
});

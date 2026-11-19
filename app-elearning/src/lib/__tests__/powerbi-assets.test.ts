import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const assetRoot = path.resolve(process.cwd(), "public", "practice-assets", "powerbi", "sit-ventas");
const lab116 = path.resolve(process.cwd(), "content", "labs", "lab-116-power-bi-en-un-dia.md");

function readCsvRows(relative: string): string[][] {
  const text = fs.readFileSync(path.join(assetRoot, relative), "utf-8").replace(/^﻿/, "").trim();
  return text.split(/\r?\n/).slice(1).map((line) => line.split(","));
}

const importe = (row: string[]) => Number(row[8]) * Number(row[9]) * (1 - Number(row[10]) / 100);

describe("Power BI practice assets (SIT Ventas)", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(assetRoot, "manifest.json"), "utf-8")) as {
    format: string;
    assetPackId: string;
    files: string[];
    bundle: string;
  };
  const expected = JSON.parse(fs.readFileSync(path.join(assetRoot, "expected", "metricas-esperadas.json"), "utf-8")) as {
    filas: Record<string, number>;
    pedidos: Record<string, number>;
    importePorAnio: Record<string, number>;
  };

  it("lists every file of the package and the downloadable bundle exists", () => {
    expect(manifest.format).toBe("planestudio-powerbi-practice-assets");
    expect(manifest.assetPackId).toBe("sit-ventas");
    for (const file of manifest.files) {
      expect(fs.existsSync(path.join(assetRoot, file)), file).toBe(true);
    }
    expect(manifest.files).toContain("productos.xlsx");
    expect(manifest.files).toContain("ventas-2026/ventas-2026-10.csv");
    expect(fs.statSync(path.join(assetRoot, manifest.bundle)).size).toBeGreaterThan(100_000);
  });

  it("keeps the expected metrics consistent with the CSV files", () => {
    const ventas2025 = readCsvRows("ventas-2025.csv");
    expect(ventas2025.length).toBe(expected.filas["ventas-2025.csv"]);
    expect(new Set(ventas2025.map((r) => r[0])).size).toBe(expected.pedidos["2025"]);
    const total = ventas2025.reduce((sum, row) => sum + importe(row), 0);
    expect(total).toBeCloseTo(expected.importePorAnio["2025"] ?? Number.NaN, 2);
  });

  it("keeps the deliberate data-quality traps the labs rely on", () => {
    expect(readCsvRows("ventas-2024.csv")[0]?.[2]).toMatch(/^\d{2}\/\d{2}\/2024$/);
    const marzo = readCsvRows("ventas-2026/ventas-2026-03.csv");
    expect(marzo.at(-1)?.[0]).toBe("TOTAL MARZO");
    const clientes = readCsvRows("clientes.csv");
    expect(clientes.length).toBe(153);
    expect(new Set(clientes.map((r) => r[0])).size).toBe(150);
  });

  it("matches the figures quoted in LABs 117-119", () => {
    const read = (slug: string) => fs.readFileSync(path.resolve(process.cwd(), "content", "labs", `${slug}.md`), "utf-8");
    const all = expected as unknown as Record<string, unknown>;
    expect(all["erroresFecha2024ConIngles"]).toBe(719);
    expect(read("lab-117-power-bi-obtener-y-perfilar-datos")).toContain("**719**");
    expect(all["lineasTotales"]).toBe(3995);
    expect(all["filasObjetivosLargo"]).toBe(288);
    expect((all["objetivosPorAnio"] as Record<string, number>)["2025"]).toBe(19884000);
    expect(all["filasTiposCambioLargo"]).toBe(136);
    const lab118 = read("lab-118-power-bi-transformar-y-cargar");
    expect(lab118).toContain("**3.995**");
    expect(lab118).toContain("**19.884.000**");
    expect(lab118).toContain("**17.714.901,00**");
    expect(all["importe2025PorEntrega"]).toBe(20799528.9);
    expect(all["importeDic2025PorEntrega"]).toBe(2205201.1);
    expect(all["importeSinFechaEntrega"]).toBe(780903.5);
    const lab119 = read("lab-119-power-bi-modelo-semantico-estrella");
    expect(lab119).toContain("**20.799.528,90**");
    expect(lab119).toContain("**2.205.201,10**");
    expect(lab119).toContain("**780.903,50**");
  });

  it("matches the figures quoted in LABs 120-122 (verified with a DAX engine)", () => {
    const read = (slug: string) => fs.readFileSync(path.resolve(process.cwd(), "content", "labs", `${slug}.md`), "utf-8");
    const all = expected as unknown as Record<string, Record<string, unknown>>;
    const l120 = all["lab120"]!;
    const l121 = all["lab121"]!;
    expect(l120["ticketPromedio2025"]).toBe(27862.25);
    expect(l120["medianaImporteLinea2025"]).toBe(9540);
    expect((l120["carteraPendiente"] as Record<string, number>)["2025-12-31"]).toBe(611900);
    expect((l120["carteraPendiente"] as Record<string, number>)["2026-12-31"]).toBe(780903.5);
    expect(l120["sumaCarterasFinDeMes2025"]).toBe(7508388.4);
    const lab120 = read("lab-120-power-bi-dax-esencial");
    for (const figure of ["**27.862,25**", "**149**", "**9.540,00**", "**611.900,00**", "**7.508.388,40**", "**943.978,50**"]) {
      expect(lab120).toContain(figure);
    }
    expect(l121["ytdOct2025"]).toBe(16568491.5);
    expect(l121["crecimientoIngenuo2026"]).toBe(-9.14);
    expect(l121["crecimientoComparable2026"]).toBe(14.29);
    expect(l121["pctAntioquiaSobreColombia2025"]).toBe(46.73);
    expect([l121["clientesSegmentoA"], l121["clientesSegmentoB"], l121["clientesSegmentoC"]]).toEqual([32, 111, 7]);
    expect(l121["clientesYtdOct2025"]).toBe(149);
    expect(l121["sumaClientesMensualesEneOct2025"]).toBe(482);
    expect(l121["clientesYtdOct2026"]).toBe(150);
    const lab121 = read("lab-121-power-bi-contexto-filtro-inteligencia-tiempo");
    for (const figure of ["**16.568.491,50**", "**−9,14 %**", "**+14,29 %**", "**46,73 %**", "**32**", "**149**", "**482**", "**6.243.067,40**"]) {
      expect(lab121).toContain(figure);
    }
    const lab122 = read("lab-122-power-bi-rendimiento-performance-analyzer-dax-query-view");
    expect(lab122).toContain("**13.799.948,40**");
    expect(lab122).toContain("**2.088**");
  });

  it("matches the figures quoted in LAB-116", () => {
    const lab = fs.readFileSync(lab116, "utf-8");
    expect(lab).toContain("20.840.961,90");
    expect(lab).toContain("**748**");
    expect(lab).toContain("/practice-assets/powerbi/sit-ventas/sit-ventas.zip");
    expect(expected.importePorAnio["2025"]).toBe(20840961.9);
    expect(expected.pedidos["2025"]).toBe(748);
  });
});

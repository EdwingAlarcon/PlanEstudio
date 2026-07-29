import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const assetRoot = path.resolve(process.cwd(), "public", "practice-assets", "rpa", "sit-automation-case");

describe("RPA practice assets", () => {
  it("publishes the reproducible SIT Automation Case package", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(assetRoot, "manifest.json"), "utf-8")) as {
      assetPackId: string;
      version: string;
      totals: { inputRecords: number; expectedValid: number; expectedRejected: number };
      scenarios: string[];
    };

    expect(manifest.assetPackId).toBe("sit-automation-case");
    expect(manifest.version).toBe("1.0.0");
    expect(manifest.totals).toEqual({ inputRecords: 10, expectedValid: 9, expectedRejected: 1 });
    expect(manifest.scenarios).toContain("selector-shift");
    expect(manifest.scenarios).toContain("expired-session");
  });

  it("includes templates, matrices and lab mapping for the RPA labs", () => {
    const templates = fs.readdirSync(path.join(assetRoot, "templates")).filter((file) => file.endsWith(".md"));
    const labMap = fs.readFileSync(path.join(assetRoot, "reference", "lab_asset_map.csv"), "utf-8");

    expect(templates).toHaveLength(20);
    expect(templates).toContain("pdd-ligero.md");
    expect(templates).toContain("runbook.md");
    expect(fs.existsSync(path.join(assetRoot, "reference", "matriz_viabilidad_rpa.csv"))).toBe(true);
    expect(fs.existsSync(path.join(assetRoot, "reference", "comparativa_tecnologica.csv"))).toBe(true);
    for (const lab of ["LAB-104", "LAB-105", "LAB-106", "LAB-107", "LAB-108", "LAB-109", "LAB-110", "LAB-111", "LAB-112"]) {
      expect(labMap).toContain(lab);
    }
  });

  it("keeps generated workbook assets macro-free and downloadable", () => {
    for (const file of ["ventas_bogota_2026_07.xlsx", "ventas_medellin_2026_07.xlsx", "ventas_caribe_2026_07.xlsx"]) {
      const buffer = fs.readFileSync(path.join(assetRoot, "input", file));

      expect(buffer.subarray(0, 2).toString("utf-8")).toBe("PK");
      expect(buffer.includes(Buffer.from("vbaProject.bin"))).toBe(false);
    }
  });
});

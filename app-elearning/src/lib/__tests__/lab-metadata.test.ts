import { describe, expect, it } from "vitest";
import { getLabBySlug } from "../content";
import { getLabPresentationMeta } from "../lab-metadata";

describe("lab presentation metadata", () => {
  it("identifica capstones y conserva la ruta profesional asociada", () => {
    const lab = getLabBySlug("lab-64-capstone-fo-awareness-arquitectura-erp-crm");
    expect(lab).toBeDefined();

    const meta = getLabPresentationMeta(lab!);

    expect(lab?.displayId).toBe("LAB-064");
    expect(meta.kind).toBe("Capstone");
    expect(meta.routes).toContain("Ruta Finance & Operations");
    expect(meta.difficulty).toBe("Enterprise");
  });

  it("resume evidencia y competencias desde el contenido del lab", () => {
    const lab = getLabBySlug("lab-66-sales-lead-to-cash");
    expect(lab).toBeDefined();

    const meta = getLabPresentationMeta(lab!);

    expect(lab?.displayId).toBe("LAB-066");
    expect(meta.kind).toBe("Laboratorio");
    expect(meta.kindLabel).toBe("Laboratorio práctico");
    expect(meta.routes).toContain("Ruta Dynamics 365 Customer Engagement");
    expect(meta.certificationBadges).toContain("Competencia Sales");
    expect(meta.certificationBadges).not.toContain("MB-210");
    expect(meta.historicalCertifications).toContain("MB-210");
    expect(meta.evidenceSummary).toContain("Captura");
    expect(meta.competencies.join(" ")).toContain("lead-to-cash");
  });
});

import { describe, expect, it } from "vitest";
import { getAllLabs, getLabBySlug } from "../content";
import { getLabDomains, getLabPresentationMeta } from "../lab-metadata";

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

  it("clasifica LAB-059 como UAT y no como etiqueta de producto", () => {
    const lab = getLabBySlug("lab-59-field-service-work-order-uat");
    expect(lab).toBeDefined();

    const meta = getLabPresentationMeta(lab!);

    expect(lab?.displayId).toBe("LAB-059");
    expect(meta.kindLabel).toBe("UAT");
    expect(meta.routes).toContain("Ruta Dynamics 365 Customer Engagement");
  });

  it("no expone certificaciones retiradas como badges principales", () => {
    const retired = new Set(["MB-210", "MB-220", "MB-240", "MB-300"]);
    const salesLab = getLabBySlug("lab-66-sales-lead-to-cash");
    const consultorCapstone = getLabBySlug("lab-62-capstone-consultor-funcional-proyecto-completo");

    for (const lab of [salesLab, consultorCapstone]) {
      expect(lab).toBeDefined();
      const meta = getLabPresentationMeta(lab!);
      expect(meta.certificationBadges.some((cert) => retired.has(cert))).toBe(false);
      expect(meta.historicalCertifications).toContain("MB-210");
    }
  });
});

describe("lab domain classification", () => {
  it("assigns at least one domain to every lab", () => {
    for (const lab of getAllLabs()) {
      const domains = getLabDomains(lab);
      expect(domains.length, `${lab.slug} should have at least one domain`).toBeGreaterThan(0);
    }
  });

  it("classifies a job-ready CRM developer lab as Empleabilidad + Dynamics 365 + Power Platform", () => {
    const lab = getLabBySlug("lab-72-jr-002-crm-javascript-customization");
    expect(lab).toBeDefined();
    expect(getLabDomains(lab!)).toEqual(["Power Platform", "Dynamics 365", "Empleabilidad"]);
  });

  it("classifies CE + F&O integration labs as Integración and Dynamics 365", () => {
    const lab = getLabBySlug("lab-70-ce-fo-integration-architecture");
    expect(lab).toBeDefined();
    const domains = getLabDomains(lab!);
    expect(domains).toContain("Integración");
    expect(domains).toContain("Dynamics 365");
  });

  it("classifies AI/Copilot labs (nivel IA) as IA", () => {
    const lab = getLabBySlug("lab-52-cli-conexion-tenant");
    expect(lab).toBeDefined();
    expect(getLabDomains(lab!)).toContain("IA");
  });

  it("classifies a basic Power Apps lab as Power Platform only", () => {
    const lab = getLabBySlug("lab-03-canvas-primera-app");
    expect(lab).toBeDefined();
    expect(getLabDomains(lab!)).toEqual(["Power Platform"]);
  });

  it("classifies a Nivel D365 lab as Dynamics 365 even without a Dataverse product tag", () => {
    const lab = getLabBySlug("lab-90-capstone-enterprise-d365");
    expect(lab).toBeDefined();
    expect(getLabDomains(lab!)).toEqual(["Dynamics 365"]);
  });
});

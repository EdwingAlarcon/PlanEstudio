import { describe, expect, it } from "vitest";
import { getAllLabs, getAllLevels, getLabBySlug } from "../content";
import { getLabDomains, getLabPresentationMeta } from "../lab-metadata";

const RETIRED_CERTIFICATIONS = new Set(["PL-600", "MB-210", "MB-220", "MB-240", "MB-260", "MB-300"]);

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
    expect(meta.certificationBadges).toContain("Dynamics 365 Sales");
    expect(meta.certificationBadges).not.toContain("MB-210");
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
    const slugs = [
      "lab-66-sales-lead-to-cash",
      "lab-62-capstone-consultor-funcional-proyecto-completo",
      "lab-74-jr-004-crm-integration-challenge",
      "lab-75-jr-005-data-migration-dynamics",
      "lab-76-jr-006-ppac-governance-assessment",
      "lab-78-jr-008-crm-legacy-health-assessment",
      "lab-79-jr-009-technical-interview-simulation",
      "lab-67-customer-360-insights-data",
      "lab-86-field-service-agreement-preventive-maintenance",
      "lab-87-field-service-mobile-offline-work-order",
    ];

    for (const slug of slugs) {
      const lab = getLabBySlug(slug);
      expect(lab, slug).toBeDefined();
      // El frontmatter ya usa la etiqueta de competencia (skill path), no el código de examen retirado.
      expect(lab!.certifications.some((cert) => RETIRED_CERTIFICATIONS.has(cert)), slug).toBe(false);
      const meta = getLabPresentationMeta(lab!);
      expect(meta.certificationBadges.some((cert) => RETIRED_CERTIFICATIONS.has(cert)), slug).toBe(false);
    }
  });

  it("ningún lab expone un código de examen/certificación retirado en su frontmatter", () => {
    for (const lab of getAllLabs()) {
      expect(
        lab.certifications.some((cert) => RETIRED_CERTIFICATIONS.has(cert)),
        `${lab.slug}: ${lab.certifications.join(", ")}`
      ).toBe(false);
    }
  });

  it("ningún nivel expone un código de examen/certificación retirado como certificación principal", () => {
    for (const level of getAllLevels()) {
      expect(
        RETIRED_CERTIFICATIONS.has(level.certification),
        `${level.id}: ${level.certification}`
      ).toBe(false);
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

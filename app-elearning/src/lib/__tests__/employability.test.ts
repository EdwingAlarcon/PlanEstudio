import { describe, expect, it } from "vitest";
import { getEmployabilityHub } from "../employability";

describe("employability hub", () => {
  it("separates job-readiness from learning levels", () => {
    const hub = getEmployabilityHub();

    expect(hub.title).toBe("Empleabilidad");
    expect(hub.promise).toContain("vacantes");
    expect(hub.primarySteps.map((step) => step.label)).toEqual([
      "Entender perfiles",
      "Cruzar skills",
      "Practicar evidencias",
      "Preparar entrevista",
    ]);
  });

  it("groups existing resources without creating modules or labs", () => {
    const hub = getEmployabilityHub();
    const hrefs = hub.sections.flatMap((section) => section.links.map((link) => link.href));

    expect(hrefs).toContain("/recursos/matriz-skills-laborales");
    expect(hrefs).toContain("/recursos/job-ready-crm-functional");
    expect(hrefs).toContain("/recursos/job-ready-crm-developer");
    expect(hrefs).toContain("/recursos/job-ready-interview-readiness");
    expect(hrefs.every((href) => href.startsWith("/recursos/") || href.startsWith("/portafolio"))).toBe(true);
  });

  it("keeps roadmap items explicit instead of presenting them as covered content", () => {
    const hub = getEmployabilityHub();

    expect(hub.roadmap.href).toBe("/recursos/roadmap-especializacion-avanzada");
    expect(hub.roadmap.description).toContain("no cubiertas");
  });
});

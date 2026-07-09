import { describe, expect, it } from "vitest";
import { getAllLabs, getAllModules } from "../content";
import { getAllProfessionalRoutes, getProfessionalRouteBySlug } from "../professional-routes";

describe("professional routes", () => {
  it("defines the seven academy routes requested for Sprint 2", () => {
    expect(getAllProfessionalRoutes().map((route) => route.slug)).toEqual([
      "maker",
      "consultor-funcional",
      "developer",
      "solution-architect",
      "dynamics-365-customer-engagement",
      "finance-operations",
      "ai-copilot",
    ]);
  });

  it("keeps route slugs unique and lookup stable", () => {
    const routes = getAllProfessionalRoutes();
    const slugs = routes.map((route) => route.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const route of routes) {
      expect(getProfessionalRouteBySlug(route.slug)).toEqual(route);
    }
  });

  it("uses professional coverage language instead of backlog wording", () => {
    const routes = getAllProfessionalRoutes();

    expect(routes.map((route) => route.status)).not.toContain("Brecha prioritaria");
    expect(getProfessionalRouteBySlug("finance-operations")?.status).toBe("Cobertura en expansión");
  });

  it("resolves each recommended next route when configured", () => {
    for (const route of getAllProfessionalRoutes()) {
      if (!route.nextRouteSlug) continue;

      const nextRoute = getProfessionalRouteBySlug(route.nextRouteSlug);
      expect(nextRoute, `${route.slug} references missing next route ${route.nextRouteSlug}`).toBeDefined();
      expect(nextRoute?.slug).not.toBe(route.slug);
    }
  });

  it("references only existing modules and labs", () => {
    const moduleIds = new Set(getAllModules().map((module) => module.moduleId));
    const labSlugs = new Set(getAllLabs().map((lab) => lab.slug));

    for (const route of getAllProfessionalRoutes()) {
      expect(route.modules.length, `${route.slug} should curate at least three modules`).toBeGreaterThanOrEqual(3);

      for (const moduleId of route.modules) {
        expect(moduleIds.has(moduleId), `${route.slug} references missing module ${moduleId}`).toBe(true);
      }

      for (const labSlug of route.labs) {
        expect(labSlugs.has(labSlug), `${route.slug} references missing lab ${labSlug}`).toBe(true);
      }
    }
  });
});

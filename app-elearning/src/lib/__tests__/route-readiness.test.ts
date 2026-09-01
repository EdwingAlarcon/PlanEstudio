import { describe, expect, it } from "vitest";
import { getAllProfessionalRoutes } from "../professional-routes";
import { getRouteReadinessTargets } from "../route-readiness";
import { computeRouteReadiness } from "../route-readiness-types";

describe("route readiness", () => {
  it("resolves module ids to the levelId-moduleId format used by the progress store, for every route", () => {
    for (const route of getAllProfessionalRoutes()) {
      const targets = getRouteReadinessTargets(route);
      expect(targets.moduleIds.length).toBe(route.modules.length);
      for (const id of targets.moduleIds) {
        expect(id).toMatch(/^[a-z0-9]+-\d+$/);
      }
    }
  });

  it("reports zero progress when nothing is complete, scoped only to this route", () => {
    const route = getAllProfessionalRoutes()[0]!;
    const targets = getRouteReadinessTargets(route);
    const readiness = computeRouteReadiness(targets, () => false, () => false);
    expect(readiness.completedModules).toBe(0);
    expect(readiness.completedLabs).toBe(0);
    expect(readiness.capstoneDone).toBe(false);
  });

  it("reports full progress when every module/lab of the route is complete, without depending on other routes", () => {
    const route = getAllProfessionalRoutes()[0]!;
    const targets = getRouteReadinessTargets(route);
    const readiness = computeRouteReadiness(
      targets,
      (id) => targets.moduleIds.includes(id),
      (slug) => targets.labSlugs.includes(slug)
    );
    expect(readiness.completedModules).toBe(readiness.totalModules);
    expect(readiness.completedLabs).toBe(readiness.totalLabs);
  });

  it("every route declares a capstone that computeRouteReadiness can evaluate", () => {
    for (const route of getAllProfessionalRoutes()) {
      const targets = getRouteReadinessTargets(route);
      const readiness = computeRouteReadiness(targets, () => true, () => true);
      expect(readiness.hasCapstone).toBe(true);
      expect(readiness.capstoneDone).toBe(true);
    }
  });
});

import { describe, expect, it } from "vitest";
import { getAllLabs, getAllModules, getAllResourcePages } from "../content";
import { getAllProfessionalRoutes } from "../professional-routes";
import {
  getDynamics365Hub,
  getIntegrationHub,
  getPowerPlatformHub,
  type DomainHub,
} from "../domain-hubs";

const HUBS: Record<string, () => DomainHub> = {
  "power-platform": getPowerPlatformHub,
  "dynamics-365": getDynamics365Hub,
  "integracion": getIntegrationHub,
};

function resolvableHrefs(): Set<string> {
  const modules = getAllModules();
  const labs = getAllLabs();
  const resources = getAllResourcePages();
  const routes = getAllProfessionalRoutes();

  const hrefs = new Set<string>();
  for (const mod of modules) hrefs.add(`/nivel/${mod.levelId}/modulo/${mod.slug}`);
  for (const level of new Set(modules.map((m) => m.levelId))) hrefs.add(`/nivel/${level}`);
  for (const lab of labs) hrefs.add(`/labs/${lab.slug}`);
  for (const resource of resources) hrefs.add(`/recursos/${resource.slug}`);
  for (const route of routes) hrefs.add(`/rutas/${route.slug}`);
  hrefs.add("/portafolio");
  hrefs.add("/empleabilidad");

  return hrefs;
}

describe("domain hubs", () => {
  it("defines the three domain hubs without creating new modules or labs", () => {
    const validHrefs = resolvableHrefs();

    for (const [name, getHub] of Object.entries(HUBS)) {
      const hub = getHub();
      const hrefs = hub.sections.flatMap((section) => section.links.map((link) => link.href));

      expect(hrefs.length, `${name} should have links`).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(validHrefs.has(href), `${name} references missing route ${href}`).toBe(true);
      }
    }
  });

  it("each hub declares a roadmap pointing to the shared advanced roadmap resource", () => {
    for (const getHub of Object.values(HUBS)) {
      const hub = getHub();
      expect(hub.roadmap.href).toBe("/recursos/roadmap-especializacion-avanzada");
    }
  });

  it("Dynamics 365 hub explicitly disclaims full D365 expertise", () => {
    const hub = getDynamics365Hub();
    expect(hub.promise).toContain("No es una certificación de experto D365 completo");
    expect(hub.promise).toContain("awareness");
  });

  it("keeps each hub's primary steps non-empty", () => {
    for (const getHub of Object.values(HUBS)) {
      const hub = getHub();
      expect(hub.primarySteps.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("surfaces the 4 Academia D365 Expert Tracks without claiming full expertise", () => {
    const hub = getDynamics365Hub();
    const tracksSection = hub.sections.find((s) => s.title === "Academia D365 Expert Tracks");

    expect(tracksSection).toBeDefined();
    expect(tracksSection!.links).toHaveLength(4);
    for (const link of tracksSection!.links) {
      expect(link.title.toLowerCase()).not.toContain("experto");
      expect(link.href).toBe("/recursos/roadmap-especializacion-avanzada");
    }
  });
});

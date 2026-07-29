import { describe, expect, it } from "vitest";
import { getAllLabs } from "../content";
import { getProfessionalRouteBySlug } from "../professional-routes";
import { getLaborProfileBySlug, getLaborProfiles } from "../labor-profiles";

describe("labor profiles", () => {
  it("defines the job-ready profiles from the employability hub", () => {
    expect(getLaborProfiles().map((p) => p.slug)).toEqual([
      "crm-functional-specialist",
      "crm-developer",
      "admin-governance",
      "data-migration-crm-legacy",
      "rpa-developer-automation-engineer",
    ]);
  });

  it("keeps profile slugs unique and lookup stable", () => {
    const profiles = getLaborProfiles();
    const slugs = profiles.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const profile of profiles) {
      expect(getLaborProfileBySlug(profile.slug)).toEqual(profile);
    }
  });

  it("references only existing routes and job-ready labs", () => {
    const labSlugs = new Set(getAllLabs().map((lab) => lab.slug));

    for (const profile of getLaborProfiles()) {
      for (const routeSlug of profile.routeSlugs) {
        expect(getProfessionalRouteBySlug(routeSlug), `${profile.slug} references missing route ${routeSlug}`).toBeDefined();
      }
      for (const labSlug of profile.jobReadyLabSlugs) {
        expect(labSlugs.has(labSlug), `${profile.slug} references missing lab ${labSlug}`).toBe(true);
      }
    }
  });

  it("does not fabricate portfolio evidence — reuses each route's evidence verbatim", () => {
    for (const profile of getLaborProfiles()) {
      expect(profile.minimumEvidence.length, `${profile.slug} should list minimum evidence`).toBeGreaterThan(0);
      const combinedRouteEvidence = profile.routeSlugs.flatMap(
        (slug) => getProfessionalRouteBySlug(slug)?.portfolioEvidence ?? []
      );
      for (const item of profile.minimumEvidence) {
        expect(combinedRouteEvidence, `${profile.slug} evidence item not found in its routes: ${item}`).toContain(item);
      }
    }
  });

  it("points every profile to the shared interview readiness resource", () => {
    for (const profile of getLaborProfiles()) {
      expect(profile.interviewHref).toBe("/recursos/job-ready-interview-readiness");
    }
  });
});

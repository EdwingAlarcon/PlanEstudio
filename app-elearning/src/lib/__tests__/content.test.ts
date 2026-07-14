import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── fs mock ─────────────────────────────────────────────────────────────────
// Mock the entire `fs` module so tests don't depend on the real filesystem.
// existsSync returns false for content/modules/ so hybrid loading falls back
// to the legacy monolithic-file path (simpler and cheaper to test here).
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn((p: string) => {
      // Returning false for new content dirs forces the legacy code path
      if (String(p).endsWith("labs") || String(p).includes("labs")) return true;
      if (String(p).includes("content")) return false;
      return true;
    }),
    readdirSync: vi.fn(() => []),
    readFileSync: vi.fn((filePath: string) => {
      if (filePath.includes("NIVEL_1")) {
        return `# 🟢 NIVEL 1: BÁSICO

### **Módulo 1: Introducción al Ecosistema Power Platform**
*Duración: 1-2 semanas*

#### 🎯 Objetivo
Comprender la arquitectura de Power Platform.

#### 📖 Conceptos Clave
- Microsoft Dataverse
- Power Apps
- Power Automate

### **Módulo 2: Dataverse — Fundamentos y Modelado Básico**
*Duración: 1-2 semanas*

#### 🎯 Objetivo
Modelar datos en Dataverse.
`;
      }
      if (filePath.includes("NIVEL_2")) return "# NIVEL 2\n\n## MÓDULO 9: Dataverse Avanzado\nContenido Nivel 2.";
      if (filePath.includes("NIVEL_3")) return "# NIVEL 3\n\n## MÓDULO 18: Arquitectura\nContenido Nivel 3.";
      if (filePath.includes("NIVEL_4")) return "# NIVEL 4\n\n## MÓDULO 31: Enterprise\nContenido Nivel 4.";
      if (filePath.includes("CHECKLIST")) return "# ✅ Checklist de Progreso\nContenido checklist.";
      if (filePath.includes("GLOSARIO")) return "# 📖 Glosario de Términos\nContenido glosario.";
      if (filePath.includes("CERTIFICACIONES")) return "# 🏆 Certificaciones\nContenido certificaciones.";
      if (filePath.includes("EVALUACIONES")) return "# 📝 Banco de Preguntas\nContenido banco.";
      if (filePath.includes("SIMULADOR")) return "# 🎯 Simulador\nContenido simulador.";
      if (filePath.includes("LENGUAJES_PROGRAMACION")) return "# Lenguajes de Programación\nContenido lenguajes.";
      if (filePath.includes("RUBRICAS_PLANTILLAS")) return "# Rúbricas y Plantillas de Evaluación\nContenido rúbricas.";
      if (filePath.includes("MATRIZ_SKILLS_LABORALES")) return "# Matriz de Skills Laborales\nPower Platform Development.";
      if (filePath.includes("JOB_READY_CRM_DEVELOPER")) return "# Ruta Job-Ready Dynamics 365 CRM Developer\nDynamics 365 CRM Developer.";
      if (filePath.includes("JOB_READY_CRM_FUNCTIONAL")) return "# Ruta Job-Ready Dynamics 365 CRM Functional Specialist\nDynamics 365 CRM Functional.";
      if (filePath.includes("JOB_READY_DATA_MIGRATION_LEGACY")) return "# Ruta Job-Ready Data Migration + CRM Legacy\nData Migration.";
      if (filePath.includes("JOB_READY_INTERVIEW_READINESS")) return "# Ruta Job-Ready Interview Readiness + Portafolio Laboral\nInterview Readiness.";
      if (filePath.includes("JOB_READY_ADMIN_GOVERNANCE")) return "# Ruta Job-Ready Power Platform Admin / Governance\nPower Platform Admin.";
      if (filePath.includes("D365_TENANT_READINESS")) return "# Dynamics 365 Tenant Readiness Checklist\nSimulado\nProductivo controlado.";
      return "# Sin contenido";
    }),
  },
}));

// Reset module registry cache between tests so _levelsCache / _labsCache are cleared
beforeEach(() => {
  vi.resetModules();
});

import { getAllLevels, getLevelById, getModuleById, getModuleBySlug, getAllResourcePages, getResourceBySlug, getAllLabs, getSearchDocuments, parseDuration } from "../content";

// ─── getAllLevels ─────────────────────────────────────────────────────────────

describe("getAllLevels", () => {
  it("returns 6 levels", () => {
    const levels = getAllLevels();
    expect(levels).toHaveLength(6);
  });

  it("returns levels in correct order", () => {
    const levels = getAllLevels();
    expect(levels[0]?.id).toBe("basico");
    expect(levels[1]?.id).toBe("intermedio");
    expect(levels[2]?.id).toBe("avanzado");
    expect(levels[3]?.id).toBe("arquitecto");
  });

  it("each level has an id, title, certification, and modules array", () => {
    getAllLevels().forEach((level) => {
      expect(level.id).toBeTruthy();
      expect(level.title).toBeTruthy();
      expect(level.certification).toBeTruthy();
      expect(Array.isArray(level.modules)).toBe(true);
    });
  });
});

// ─── getLevelById ─────────────────────────────────────────────────────────────

describe("getLevelById", () => {
  it("returns the correct level for a valid id", () => {
    const level = getLevelById("basico");
    expect(level?.id).toBe("basico");
    expect(level?.certification).toBe("PL-900");
  });

  it("returns undefined for an invalid id", () => {
    // @ts-expect-error testing invalid input
    expect(getLevelById("invalid")).toBeUndefined();
  });
});

// ─── module extraction from Nivel 1 ──────────────────────────────────────────

describe("module extraction from Nivel 1", () => {
  it("extracts modules from the markdown content", () => {
    const level = getLevelById("basico");
    expect(level?.modules.length).toBeGreaterThanOrEqual(1);
  });

  it("assigns correct moduleId", () => {
    const level = getLevelById("basico");
    const mod1 = level?.modules.find((m) => m.moduleId === 1);
    expect(mod1).toBeDefined();
    expect(mod1?.title).toContain("Introducción");
  });

  it("generates a slug from the title", () => {
    const level = getLevelById("basico");
    const mod1 = level?.modules.find((m) => m.moduleId === 1);
    expect(mod1?.slug).toBeTruthy();
    expect(mod1?.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("estimates reading time as at least 5 minutes", () => {
    const level = getLevelById("basico");
    level?.modules.forEach((mod) => {
      expect(mod.estimatedMinutes).toBeGreaterThanOrEqual(5);
    });
  });
});

// ─── getModuleBySlug ──────────────────────────────────────────────────────────

describe("getModuleBySlug", () => {
  it("returns module when slug exists", () => {
    const level = getLevelById("basico");
    const firstModule = level?.modules[0];
    if (firstModule) {
      const found = getModuleBySlug("basico", firstModule.slug);
      expect(found?.id).toBe(firstModule.id);
    }
  });

  it("returns undefined for nonexistent slug", () => {
    expect(getModuleBySlug("basico", "slug-que-no-existe")).toBeUndefined();
  });
});

// ─── getModuleById ────────────────────────────────────────────────────────────

describe("getModuleById", () => {
  it("returns module when moduleId exists in the level", () => {
    const found = getModuleById("basico", 1);
    expect(found?.moduleId).toBe(1);
  });

  it("returns undefined for a moduleId not present in the level", () => {
    expect(getModuleById("basico", 999)).toBeUndefined();
  });
});

// ─── getResourceBySlug ────────────────────────────────────────────────────────

describe("getResourceBySlug", () => {
  it("returns the resource page when the slug exists", () => {
    expect(getResourceBySlug("checklist")?.slug).toBe("checklist");
  });

  it("returns undefined for a nonexistent slug", () => {
    expect(getResourceBySlug("slug-que-no-existe")).toBeUndefined();
  });
});

// ─── getAllResourcePages ───────────────────────────────────────────────────────

describe("getAllResourcePages", () => {
  it("returns 18 resource pages (incluyendo lenguajes-programacion, prompts-ia, rubricas-plantillas, matriz-competencias, matriz-skills-laborales, job-ready-crm-developer, job-ready-crm-functional, job-ready-data-migration-legacy, job-ready-interview-readiness, job-ready-admin-governance, portafolio-profesional, roadmap-especializacion-avanzada y d365-tenant-readiness)", () => {
    const pages = getAllResourcePages();
    expect(pages).toHaveLength(18);
  });

  it("includes checklist, glosario, certificaciones, lenguajes-programacion, prompts-ia, rubricas-plantillas, matriz-competencias, matriz-skills-laborales, job-ready-crm-developer, job-ready-crm-functional, job-ready-data-migration-legacy, job-ready-interview-readiness, job-ready-admin-governance, portafolio-profesional y roadmap-especializacion-avanzada", () => {
    const pages = getAllResourcePages();
    const slugs = pages.map((p) => p.slug);
    expect(slugs).toContain("checklist");
    expect(slugs).toContain("glosario");
    expect(slugs).toContain("certificaciones");
    expect(slugs).toContain("lenguajes-programacion");
    expect(slugs).toContain("prompts-ia");
    expect(slugs).toContain("rubricas-plantillas");
    expect(slugs).toContain("matriz-competencias");
    expect(slugs).toContain("matriz-skills-laborales");
    expect(slugs).toContain("job-ready-crm-developer");
    expect(slugs).toContain("job-ready-crm-functional");
    expect(slugs).toContain("job-ready-data-migration-legacy");
    expect(slugs).toContain("job-ready-interview-readiness");
    expect(slugs).toContain("job-ready-admin-governance");
    expect(slugs).toContain("portafolio-profesional");
    expect(slugs).toContain("roadmap-especializacion-avanzada");
    expect(slugs).toContain("d365-tenant-readiness");
  });

  it("loads the D365 tenant readiness resource", () => {
    const resource = getResourceBySlug("d365-tenant-readiness");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Dynamics 365 Tenant Readiness Checklist");
    expect(resource?.rawContent).toContain("Simulado");
    expect(resource?.rawContent).toContain("Productivo controlado");
  });

  it("loads the labor skills matrix resource", () => {
    const resource = getResourceBySlug("matriz-skills-laborales");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Matriz de Skills Laborales");
    expect(resource?.rawContent).toContain("Power Platform Development");
  });

  it("loads the CRM Developer job-ready resource", () => {
    const resource = getResourceBySlug("job-ready-crm-developer");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Ruta Job-Ready Dynamics 365 CRM Developer");
    expect(resource?.rawContent).toContain("Dynamics 365 CRM Developer");
  });

  it("loads the CRM Functional job-ready resource", () => {
    const resource = getResourceBySlug("job-ready-crm-functional");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Ruta Job-Ready Dynamics 365 CRM Functional Specialist");
    expect(resource?.rawContent).toContain("Dynamics 365 CRM Functional");
  });

  it("loads the Data Migration Legacy job-ready resource", () => {
    const resource = getResourceBySlug("job-ready-data-migration-legacy");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Ruta Job-Ready Data Migration + CRM Legacy");
    expect(resource?.rawContent).toContain("Data Migration");
  });

  it("loads the Interview Readiness job-ready resource", () => {
    const resource = getResourceBySlug("job-ready-interview-readiness");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Ruta Job-Ready Interview Readiness + Portafolio Laboral");
    expect(resource?.rawContent).toContain("Interview Readiness");
  });

  it("loads the Admin Governance job-ready resource", () => {
    const resource = getResourceBySlug("job-ready-admin-governance");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Ruta Job-Ready Power Platform Admin / Governance");
    expect(resource?.rawContent).toContain("Power Platform Admin");
  });

  it("each page has a slug, title, and rawContent", () => {
    getAllResourcePages().forEach((page) => {
      expect(page.slug).toBeTruthy();
      expect(page.title).toBeTruthy();
      expect(page.rawContent).toBeTruthy();
    });
  });
});

// ─── getSearchDocuments ───────────────────────────────────────────────────────

describe("getSearchDocuments", () => {
  it("returns at least one document per level", () => {
    const docs = getSearchDocuments();
    expect(docs.length).toBeGreaterThanOrEqual(4);
  });

  it("every document has required fields", () => {
    getSearchDocuments().forEach((doc) => {
      expect(doc.id).toBeTruthy();
      expect(doc.title).toBeTruthy();
      expect(doc.href).toBeTruthy();
      expect(["module", "lab", "resource"]).toContain(doc.type);
    });
  });

  it("module documents have href matching /nivel/X/modulo/Y pattern", () => {
    const moduleDocs = getSearchDocuments().filter((d) => d.type === "module");
    expect(moduleDocs.length).toBeGreaterThan(0);
    moduleDocs.forEach((doc) => {
      expect(doc.href).toMatch(/^\/nivel\/.+\/modulo\/.+$/);
    });
  });

  it("content field is truncated to max 2000 chars", () => {
    getSearchDocuments().forEach((doc) => {
      expect(doc.content.length).toBeLessThanOrEqual(2000);
    });
  });
});

// ─── getAllLabs ────────────────────────────────────────────────────────────────

describe("getAllLabs", () => {
  it("returns an empty array when labs directory exists without markdown files", () => {
    const labs = getAllLabs();
    expect(Array.isArray(labs)).toBe(true);
    expect(labs).toHaveLength(0);
  });

  it("does not throw when labs directory is empty", () => {
    expect(() => getAllLabs()).not.toThrow();
  });
});

// ─── parseDuration ────────────────────────────────────────────────────────────

describe("parseDuration", () => {
  it("returns number as-is when given an integer", () => {
    expect(parseDuration(90)).toBe(90);
    expect(parseDuration(0)).toBe(0);
    expect(parseDuration(130)).toBe(130);
  });

  it("parses a string with 'min' suffix", () => {
    expect(parseDuration("90 min")).toBe(90);
    expect(parseDuration("120 min")).toBe(120);
  });

  it("parses a string with 'minutos' suffix", () => {
    expect(parseDuration("60 minutos")).toBe(60);
  });

  it("parses a bare numeric string", () => {
    expect(parseDuration("45")).toBe(45);
  });

  it("returns 0 for empty or invalid values", () => {
    expect(parseDuration("")).toBe(0);
    expect(parseDuration(null)).toBe(0);
    expect(parseDuration(undefined)).toBe(0);
    expect(parseDuration("no hay número")).toBe(0);
  });

  it("returns 0 for non-finite numbers", () => {
    expect(parseDuration(NaN)).toBe(0);
    expect(parseDuration(Infinity)).toBe(0);
  });
});

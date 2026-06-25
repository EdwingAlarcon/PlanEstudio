import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── fs mock ─────────────────────────────────────────────────────────────────
// Mock the entire `fs` module so tests don't depend on the real filesystem.
// existsSync returns false for content/modules/ so hybrid loading falls back
// to the legacy monolithic-file path (simpler and cheaper to test here).
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn((p: string) => {
      // Returning false for new content dirs forces the legacy code path
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
      return "# Sin contenido";
    }),
  },
}));

// Reset module registry cache between tests so _levelsCache / _labsCache are cleared
beforeEach(() => {
  vi.resetModules();
});

import { getAllLevels, getLevelById, getModuleBySlug, getAllResourcePages, getAllLabs, parseDuration } from "../content";

// ─── getAllLevels ─────────────────────────────────────────────────────────────

describe("getAllLevels", () => {
  it("returns 4 levels", () => {
    const levels = getAllLevels();
    expect(levels).toHaveLength(4);
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

// ─── getAllResourcePages ───────────────────────────────────────────────────────

describe("getAllResourcePages", () => {
  it("returns 5 resource pages", () => {
    const pages = getAllResourcePages();
    expect(pages).toHaveLength(5);
  });

  it("includes checklist, glosario, certificaciones", () => {
    const pages = getAllResourcePages();
    const slugs = pages.map((p) => p.slug);
    expect(slugs).toContain("checklist");
    expect(slugs).toContain("glosario");
    expect(slugs).toContain("certificaciones");
  });

  it("each page has a slug, title, and rawContent", () => {
    getAllResourcePages().forEach((page) => {
      expect(page.slug).toBeTruthy();
      expect(page.title).toBeTruthy();
      expect(page.rawContent).toBeTruthy();
    });
  });
});

// ─── getAllLabs ────────────────────────────────────────────────────────────────

describe("getAllLabs", () => {
  it("returns an empty array when labs directory does not exist", () => {
    // existsSync returns false for content/ paths (see mock above)
    const labs = getAllLabs();
    expect(Array.isArray(labs)).toBe(true);
  });

  it("does not throw when labs directory is missing", () => {
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

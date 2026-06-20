import { describe, it, expect, vi } from "vitest";

// Mock fs so tests don't depend on the real docs/ directory
vi.mock("fs", () => ({
  default: {
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
      if (filePath.includes("NIVEL_2")) return "# NIVEL 2\n\n### Módulo 9: Dataverse Avanzado\nContenido Nivel 2.";
      if (filePath.includes("NIVEL_3")) return "# NIVEL 3\n\n### Módulo 18: Arquitectura\nContenido Nivel 3.";
      if (filePath.includes("NIVEL_4")) return "# NIVEL 4\n\n### Módulo 31: Enterprise\nContenido Nivel 4.";
      if (filePath.includes("CHECKLIST")) return "# ✅ Checklist de Progreso\nContenido checklist.";
      if (filePath.includes("GLOSARIO")) return "# 📖 Glosario de Términos\nContenido glosario.";
      if (filePath.includes("CERTIFICACIONES")) return "# 🏆 Certificaciones\nContenido certificaciones.";
      if (filePath.includes("EVALUACIONES")) return "# 📝 Banco de Preguntas\nContenido banco.";
      if (filePath.includes("SIMULADOR")) return "# 🎯 Simulador\nContenido simulador.";
      return "# Sin contenido";
    }),
  },
}));

// Reset module cache between tests
vi.mock("../content", async () => {
  const actual = await vi.importActual<typeof import("../content")>("../content");
  return actual;
});

import { getAllLevels, getLevelById, getModuleBySlug, getAllResourcePages } from "../content";

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

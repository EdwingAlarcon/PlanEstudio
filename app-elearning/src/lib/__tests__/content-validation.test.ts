import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Module frontmatter fixtures ───────────────────────────────────────────────

const VALID_MODULE_1 = `---
moduleId: 1
title: "Introducción al Ecosistema Power Platform"
level: "basico"
certification: "PL-900"
estimatedMinutes: 9
slug: "introduccion-al-ecosistema-power-platform"
---

### 🎯 Objetivo
Comprender la arquitectura de Power Platform.
`;

const VALID_MODULE_2 = `---
moduleId: 2
title: "Dataverse Fundamentos"
level: "basico"
certification: "PL-900"
estimatedMinutes: 8
slug: "dataverse-fundamentos"
---

### 🎯 Objetivo
Modelar datos en Dataverse.
`;

const MODULE_ID_OUT_OF_RANGE = `---
moduleId: 99
title: "Fuera de Rango"
level: "basico"
certification: "PL-900"
estimatedMinutes: 5
slug: "fuera-de-rango"
---

### 🎯 Objetivo
Contenido.
`;

const MODULE_LEVEL_MISMATCH = `---
moduleId: 1
title: "Nivel Incorrecto"
level: "intermedio"
certification: "PL-900"
estimatedMinutes: 5
slug: "nivel-incorrecto"
---

### 🎯 Objetivo
Contenido.
`;

const MODULE_BAD_SLUG = `---
moduleId: 1
title: "Slug Inválido"
level: "basico"
certification: "PL-900"
estimatedMinutes: 5
slug: "Slug_Invalido"
---

### 🎯 Objetivo
Contenido.
`;

const MODULE_BAD_ESTIMATED_MINUTES = `---
moduleId: 1
title: "Minutos Inválidos"
level: "basico"
certification: "PL-900"
estimatedMinutes: 0
slug: "minutos-invalidos"
---

### 🎯 Objetivo
Contenido.
`;

const MODULE_DUPLICATE_ID = `---
moduleId: 1
title: "Duplicado"
level: "basico"
certification: "PL-900"
estimatedMinutes: 5
slug: "duplicado"
---

### 🎯 Objetivo
Contenido.
`;

// ─── fs mock — content/modules/<level> directory EXISTS ───────────────────────

let moduleFilesByLevel: Record<string, string[]> = {};
let moduleFixtures: Record<string, string> = {};

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn((p: string) => {
      const path = String(p);
      if (path.endsWith("labs") || path.includes("labs")) return false;
      for (const level of Object.keys(moduleFilesByLevel)) {
        if (path.includes("modules") && path.endsWith(level)) return true;
      }
      for (const name of Object.keys(moduleFixtures)) {
        if (path.includes(name)) return true;
      }
      if (path.includes("content")) return false;
      return true;
    }),
    readdirSync: vi.fn((p: string) => {
      const path = String(p);
      for (const [level, files] of Object.entries(moduleFilesByLevel)) {
        if (path.endsWith(level)) return files;
      }
      return [];
    }),
    readFileSync: vi.fn((filePath: string) => {
      const path = String(filePath);
      for (const [name, content] of Object.entries(moduleFixtures)) {
        if (path.includes(name)) return content;
      }
      if (path.includes("NIVEL_1")) return "# NIVEL 1\n\nSin módulos legacy.";
      if (path.includes("NIVEL_2")) return "# NIVEL 2\n\nSin módulos legacy.";
      if (path.includes("NIVEL_3")) return "# NIVEL 3\n\nSin módulos legacy.";
      if (path.includes("NIVEL_4")) return "# NIVEL 4\n\nSin módulos legacy.";
      if (path.includes("CHECKLIST")) return "# Checklist\nContenido.";
      if (path.includes("GLOSARIO")) return "# Glosario\nContenido.";
      if (path.includes("CERTIFICACIONES")) return "# Certificaciones\nContenido.";
      if (path.includes("EVALUACIONES")) return "# Banco\nContenido.";
      if (path.includes("SIMULADOR")) return "# Simulador\nContenido.";
      if (path.includes("LENGUAJES_PROGRAMACION")) return "# Lenguajes\nContenido.";
      return "# Vacío";
    }),
  },
}));

beforeEach(() => {
  vi.resetModules();
  moduleFilesByLevel = {};
  moduleFixtures = {};
});

describe("validateModuleFrontmatter — individual module files", () => {
  it("carga un módulo con frontmatter válido", async () => {
    moduleFilesByLevel = { basico: ["01-intro.md"] };
    moduleFixtures = { "01-intro.md": VALID_MODULE_1 };
    const { getModuleBySlug } = await import("../content");

    const mod = getModuleBySlug("basico", "introduccion-al-ecosistema-power-platform");
    expect(mod?.moduleId).toBe(1);
    expect(mod?.estimatedMinutes).toBe(9);
  });

  it("rechaza un moduleId fuera del rango del nivel", async () => {
    moduleFilesByLevel = { basico: ["99-fuera.md"] };
    moduleFixtures = { "99-fuera.md": MODULE_ID_OUT_OF_RANGE };
    const { getAllLevels } = await import("../content");

    expect(() => getAllLevels()).toThrow(/moduleId.*entre/i);
  });

  it("rechaza cuando 'level' del frontmatter no coincide con el directorio", async () => {
    moduleFilesByLevel = { basico: ["01-mismatch.md"] };
    moduleFixtures = { "01-mismatch.md": MODULE_LEVEL_MISMATCH };
    const { getAllLevels } = await import("../content");

    expect(() => getAllLevels()).toThrow(/'level' debe ser 'basico'/i);
  });

  it("rechaza un slug que no está en kebab-case ASCII", async () => {
    moduleFilesByLevel = { basico: ["01-bad-slug.md"] };
    moduleFixtures = { "01-bad-slug.md": MODULE_BAD_SLUG };
    const { getAllLevels } = await import("../content");

    expect(() => getAllLevels()).toThrow(/kebab-case/i);
  });

  it("rechaza estimatedMinutes no positivo", async () => {
    moduleFilesByLevel = { basico: ["01-bad-minutes.md"] };
    moduleFixtures = { "01-bad-minutes.md": MODULE_BAD_ESTIMATED_MINUTES };
    const { getAllLevels } = await import("../content");

    expect(() => getAllLevels()).toThrow(/estimatedMinutes.*positivo/i);
  });

  it("rechaza moduleId duplicado dentro del mismo nivel", async () => {
    moduleFilesByLevel = { basico: ["01-a.md", "01-b.md"] };
    moduleFixtures = { "01-a.md": VALID_MODULE_1, "01-b.md": MODULE_DUPLICATE_ID };
    const { getAllLevels } = await import("../content");

    expect(() => getAllLevels()).toThrow(/moduleId duplicado/i);
  });

  it("rechaza slug duplicado dentro del mismo nivel", async () => {
    const duplicateSlugModule = VALID_MODULE_2.replace(
      'slug: "dataverse-fundamentos"',
      'slug: "introduccion-al-ecosistema-power-platform"',
    );
    moduleFilesByLevel = { basico: ["01-a.md", "02-b.md"] };
    moduleFixtures = { "01-a.md": VALID_MODULE_1, "02-b.md": duplicateSlugModule };
    const { getAllLevels } = await import("../content");

    expect(() => getAllLevels()).toThrow(/slug duplicado/i);
  });
});

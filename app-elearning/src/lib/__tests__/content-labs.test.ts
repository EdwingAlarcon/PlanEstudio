import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Lab frontmatter fixtures ──────────────────────────────────────────────────

const LAB_FIXTURE_INTEGER = `---
id: lab-02
title: "Dataverse — Modelado de Datos"
level: "N1"
duration: 90
product:
  - "Dataverse"
certifications:
  - "PL-900"
role:
  - "Developer"
prerequisites:
  - "Cuenta de Power Platform"
---

# Lab 02

Contenido del laboratorio de Dataverse.

## Tarea 1

Instrucciones paso a paso.
`;

const LAB_FIXTURE_STRING_DURATION = `---
id: lab-03
title: "Canvas App — Primera Aplicación"
level: "N1"
duration: "90 min"
product:
  - "Power Apps"
certifications:
  - "PL-900"
role:
  - "Maker"
prerequisites: []
---

# Lab 03

Contenido del laboratorio de Canvas Apps.
`;

const LAB_FIXTURE_MINIMAL = `---
id: lab-05
title: "Power Automate Básico"
level: "N1"
duration: 80
product: []
certifications: []
role: []
prerequisites: []
---

# Lab 05

Contenido mínimo.
`;

// ─── fs mock — labs directory EXISTS ─────────────────────────────────────────
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn((p: string) => {
      // Labs dir exists; modules dir does not (forces legacy code path for levels)
      if (String(p).endsWith("labs") || String(p).includes("labs")) return true;
      if (String(p).includes("content")) return false;
      return true;
    }),
    readdirSync: vi.fn((p: string) => {
      if (String(p).includes("labs")) {
        return ["lab-02-dataverse.md", "lab-03-canvas.md", "lab-05-automate.md"];
      }
      return [];
    }),
    readFileSync: vi.fn((filePath: string) => {
      if (filePath.includes("lab-02")) return LAB_FIXTURE_INTEGER;
      if (filePath.includes("lab-03")) return LAB_FIXTURE_STRING_DURATION;
      if (filePath.includes("lab-05")) return LAB_FIXTURE_MINIMAL;
      if (filePath.includes("NIVEL_1")) return "# NIVEL 1\n\n### **Módulo 1: Intro**\nContenido.";
      if (filePath.includes("NIVEL_2")) return "# NIVEL 2\n\n## MÓDULO 9: Avanzado\nContenido.";
      if (filePath.includes("NIVEL_3")) return "# NIVEL 3\n\n## MÓDULO 18: Arq\nContenido.";
      if (filePath.includes("NIVEL_4")) return "# NIVEL 4\n\n## MÓDULO 31: Ent\nContenido.";
      if (filePath.includes("CHECKLIST")) return "# Checklist\nContenido.";
      if (filePath.includes("GLOSARIO")) return "# Glosario\nContenido.";
      if (filePath.includes("CERTIFICACIONES")) return "# Certificaciones\nContenido.";
      if (filePath.includes("EVALUACIONES")) return "# Banco\nContenido.";
      if (filePath.includes("SIMULADOR")) return "# Simulador\nContenido.";
      if (filePath.includes("LENGUAJES_PROGRAMACION")) return "# Lenguajes\nContenido.";
      return "# Vacío";
    }),
  },
}));

beforeEach(() => {
  vi.resetModules();
});

import { getAllLabs, getLabBySlug, getSearchDocuments } from "../content";

// ─── getAllLabs con datos ─────────────────────────────────────────────────────

describe("getAllLabs — con datos", () => {
  it("devuelve los labs del directorio mockeado", () => {
    const labs = getAllLabs();
    expect(labs).toHaveLength(3);
  });

  it("parsea correctamente duration como número entero", () => {
    const lab = getAllLabs().find((l) => l.id === "lab-02");
    expect(lab?.duration).toBe(90);
  });

  it("parsea correctamente duration como string '90 min'", () => {
    const lab = getAllLabs().find((l) => l.id === "lab-03");
    expect(lab?.duration).toBe(90);
  });

  it("cada lab tiene id, slug, title, level y rawContent", () => {
    getAllLabs().forEach((lab) => {
      expect(lab.id).toBeTruthy();
      expect(lab.slug).toBeTruthy();
      expect(lab.title).toBeTruthy();
      expect(lab.level).toBeTruthy();
      expect(lab.rawContent).toBeTruthy();
    });
  });

  it("slug se extrae del nombre de archivo sin extensión", () => {
    const slugs = getAllLabs().map((l) => l.slug);
    expect(slugs).toContain("lab-02-dataverse");
    expect(slugs).toContain("lab-03-canvas");
    expect(slugs).toContain("lab-05-automate");
  });

  it("parsea arrays de products, certifications, role y prerequisites", () => {
    const lab = getAllLabs().find((l) => l.id === "lab-02");
    expect(Array.isArray(lab?.products)).toBe(true);
    expect(Array.isArray(lab?.certifications)).toBe(true);
    expect(Array.isArray(lab?.role)).toBe(true);
    expect(Array.isArray(lab?.prerequisites)).toBe(true);
    expect(lab?.products).toContain("Dataverse");
    expect(lab?.certifications).toContain("PL-900");
  });

  it("lab con arrays vacíos no produce errores", () => {
    const lab = getAllLabs().find((l) => l.id === "lab-05");
    expect(lab?.products).toHaveLength(0);
    expect(lab?.prerequisites).toHaveLength(0);
  });
});

// ─── getLabBySlug ──────────────────────────────────────────────────────────────

describe("getLabBySlug", () => {
  it("devuelve el lab correcto para un slug válido", () => {
    const lab = getLabBySlug("lab-02-dataverse");
    expect(lab?.id).toBe("lab-02");
    expect(lab?.title).toBe("Dataverse — Modelado de Datos");
  });

  it("devuelve undefined para un slug inexistente", () => {
    expect(getLabBySlug("slug-que-no-existe")).toBeUndefined();
  });
});

// ─── getSearchDocuments incluye labs ─────────────────────────────────────────

describe("getSearchDocuments — incluye labs", () => {
  it("incluye documentos de tipo 'lab'", () => {
    const docs = getSearchDocuments();
    const labDocs = docs.filter((d) => d.type === "lab");
    expect(labDocs.length).toBeGreaterThan(0);
  });

  it("lab documents tienen href /labs/:slug", () => {
    const labDocs = getSearchDocuments().filter((d) => d.type === "lab");
    labDocs.forEach((doc) => {
      expect(doc.href).toMatch(/^\/labs\/.+$/);
    });
  });

  it("incluye tanto módulos como labs en el índice", () => {
    const docs = getSearchDocuments();
    const types = new Set(docs.map((d) => d.type));
    expect(types.has("module")).toBe(true);
    expect(types.has("lab")).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Lab frontmatter fixtures — invalid cases ─────────────────────────────────

const LAB_BAD_ID = `---
id: laboratorio-02
title: "ID inválido"
level: "N1"
duration: 90
product: ["Dataverse"]
certifications: ["PL-900"]
role: ["Developer"]
prerequisites: []
---

# Lab
Contenido.
`;

const LAB_MISSING_ID = `---
title: "Lab sin id explicito"
level: "N1"
duration: 90
product: ["Dataverse"]
certifications: ["PL-900"]
role: ["Developer"]
prerequisites: []
---

# Lab derivado
Contenido.
`;

const LAB_MISMATCHED_ID = `---
id: lab-03
title: "Lab con id inconsistente"
level: "N1"
duration: 90
product: ["Dataverse"]
certifications: ["PL-900"]
role: ["Developer"]
prerequisites: []
---

# Lab inconsistente
Contenido.
`;

const LAB_BAD_LEVEL = `---
id: lab-02
title: "Nivel inválido"
level: "N9"
duration: 90
product: ["Dataverse"]
certifications: ["PL-900"]
role: ["Developer"]
prerequisites: []
---

# Lab
Contenido.
`;

const LAB_BAD_DURATION = `---
id: lab-02
title: "Duración inválida"
level: "N1"
duration: "sin número"
product: ["Dataverse"]
certifications: ["PL-900"]
role: ["Developer"]
prerequisites: []
---

# Lab
Contenido.
`;

const LAB_VALID_A = `---
id: lab-02
title: "Lab A"
level: "N1"
duration: 90
product: ["Dataverse"]
certifications: ["PL-900"]
role: ["Developer"]
prerequisites: []
---

# Lab A
Contenido.
`;

const LAB_VALID_B_SAME_ID = `---
id: lab-02
title: "Lab B"
level: "N1"
duration: 60
product: ["Power Apps"]
certifications: ["PL-900"]
role: ["Maker"]
prerequisites: []
---

# Lab B
Contenido.
`;

let labFiles: string[] = [];
let labFixtures: Record<string, string> = {};
let labsDirExists = true;

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn((p: string) => {
      const path = String(p);
      if (path.endsWith("labs")) return labsDirExists;
      if (path.includes("labs")) return labsDirExists;
      if (path.includes("content")) return false;
      return true;
    }),
    readdirSync: vi.fn((p: string) => {
      const path = String(p);
      if (path.includes("labs")) return labFiles;
      return [];
    }),
    readFileSync: vi.fn((filePath: string) => {
      const path = String(filePath);
      for (const [name, content] of Object.entries(labFixtures)) {
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
  labFiles = [];
  labFixtures = {};
  labsDirExists = true;
});

describe("validateLabFrontmatter — casos inválidos", () => {
  it("rechaza un id que no sigue el formato lab-NN", async () => {
    labFiles = ["lab-02-bad-id.md"];
    labFixtures = { "lab-02-bad-id.md": LAB_BAD_ID };
    const { getAllLabs } = await import("../content");

    expect(() => getAllLabs()).toThrow(/formato lab-NN/i);
  });

  it("rechaza un level fuera de N1-N6 o RPA", async () => {
    labFiles = ["lab-02-bad-level.md"];
    labFixtures = { "lab-02-bad-level.md": LAB_BAD_LEVEL };
    const { getAllLabs } = await import("../content");

    expect(() => getAllLabs()).toThrow(/N1, N2, N3, N4, N5, N6 o RPA/i);
  });

  it("rechaza una duration que no contiene ningún número", async () => {
    labFiles = ["lab-02-bad-duration.md"];
    labFixtures = { "lab-02-bad-duration.md": LAB_BAD_DURATION };
    const { getAllLabs } = await import("../content");

    expect(() => getAllLabs()).toThrow(/duration.*positivo/i);
  });

  it("rechaza id de lab duplicado", async () => {
    labFiles = ["lab-02-a.md", "lab-02-b.md"];
    labFixtures = { "lab-02-a.md": LAB_VALID_A, "lab-02-b.md": LAB_VALID_B_SAME_ID };
    const { getAllLabs } = await import("../content");

    expect(() => getAllLabs()).toThrow(/id duplicado/i);
  });

  it("deriva el id desde el slug cuando el frontmatter no lo declara", async () => {
    labFiles = ["lab-07-derived.md"];
    labFixtures = { "lab-07-derived.md": LAB_MISSING_ID };
    const { getAllLabs } = await import("../content");

    const [lab] = getAllLabs();
    expect(lab?.id).toBe("lab-07");
    expect(lab?.displayId).toBe("LAB-007");
  });

  it("rechaza un id que no coincide con el identificador del archivo", async () => {
    labFiles = ["lab-02-mismatch.md"];
    labFixtures = { "lab-02-mismatch.md": LAB_MISMATCHED_ID };
    const { getAllLabs } = await import("../content");

    expect(() => getAllLabs()).toThrow(/debe coincidir/i);
  });

  it("lanza un error claro cuando el directorio de labs no existe", async () => {
    labsDirExists = false;
    const { getAllLabs } = await import("../content");

    expect(() => getAllLabs()).toThrow(/directorio requerido de laboratorios no encontrado/i);
  });
});

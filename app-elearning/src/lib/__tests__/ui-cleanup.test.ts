import { describe, expect, it } from "vitest";
import { stripLeadingEmoji } from "../rehype-strip-leading-emoji";
import { roleFamilies, roleFamily } from "../role-family";
import { getAllLabs, getAllResourcePages } from "../content";

describe("stripLeadingEmoji", () => {
  it("quita el emoji decorativo del principio y conserva un emoji que es el dato", () => {
    expect(stripLeadingEmoji("🎯 Objetivo")).toBe("Objetivo");
    expect(stripLeadingEmoji("⚠️ Errores Comunes")).toBe("Errores Comunes");
    expect(stripLeadingEmoji("Objetivo 🎯")).toBe("Objetivo 🎯");
    expect(stripLeadingEmoji("✅")).toBe("✅");
    expect(stripLeadingEmoji("1. Primer paso")).toBe("1. Primer paso");
  });
});

describe("roleFamily", () => {
  it("une variantes de idioma y escritura", () => {
    expect(roleFamilies(["Consultor funcional", "Consultor Funcional", "Functional Consultant"])).toEqual(["Consultor funcional"]);
    expect(roleFamilies(["Developer", "Desarrollador"])).toEqual(["Desarrollador"]);
    expect(roleFamilies(["Admin", "Administrador", "Administrator"])).toEqual(["Administración y gobierno"]);
    expect(roleFamily("Maker")).toBe("Maker");
  });

  it("deja pocas familias para todos los labs y ninguna sin clasificar", () => {
    const families = roleFamilies(getAllLabs().flatMap((lab) => lab.role));
    expect(families.length).toBeLessThanOrEqual(8);
    expect(families).not.toContain("Otros");
  });
});

describe("títulos de recursos", () => {
  it("ningún recurso se muestra con su nombre interno", () => {
    for (const page of getAllResourcePages()) expect(page.title, page.slug).not.toBe(page.slug);
  });
});

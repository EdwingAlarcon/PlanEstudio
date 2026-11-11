import { describe, expect, it } from "vitest";
import { getAllLevels, getAllResourcePages } from "../content";
import { getModuleOutline, githubSlug, splitModuleSections } from "../module-sections";
import { getNextCurriculumModule, type CurriculumModule } from "../learning-path";
import { DEFAULT_ONBOARDING_STATE, FOUNDATION_ACTIVITIES, getNextBestAction } from "../guided-journey";
import { RESOURCE_GROUPS } from "../resource-catalog";

const curriculum: CurriculumModule[] = getAllLevels().flatMap((level) =>
  level.modules.map((mod) => ({
    key: mod.id,
    moduleId: mod.moduleId,
    levelId: level.id,
    title: mod.title,
    href: `/nivel/${level.id}/modulo/${mod.slug}`,
    minutes: mod.estimatedMinutes,
  })),
);

describe("splitModuleSections", () => {
  it("pliega suplementos hasta el siguiente título del mismo nivel", () => {
    const md = "### 🎯 Objetivo\nA\n### 📌 Suplemento 1A: AI Builder\nB\n#### Detalle\nC\n### 🧪 Criterios\nD\n";
    const segments = splitModuleSections(md);
    expect(segments.map((s) => s.optional)).toEqual([false, true, false]);
    expect(segments[1]!.title).toBe("Suplemento 1A: AI Builder");
    expect(segments[1]!.markdown).toContain("#### Detalle");
    expect(segments[2]!.markdown).toContain("Criterios");
  });

  it("pliega 'Profundización opcional' con sus prácticas H5, deja visible el aviso 'Qué queda' y acepta CRLF", () => {
    const md = "### 🔧 Qué queda para después (Profundización opcional)\r\nX\r\n#### 🔧 Profundización opcional\r\n##### Práctica 3.2\r\nY\r\n### 💼 Caso Real\r\nZ\r\n";
    const segments = splitModuleSections(md);
    expect(segments.map((s) => s.optional)).toEqual([false, true, false]);
    expect(segments[1]!.markdown).toContain("Práctica 3.2");
    expect(getModuleOutline("## 🧩 Microlección 1 — A\r\n")).toHaveLength(1);
  });

  it("ignora títulos dentro de bloques de código", () => {
    const md = "Texto\n```md\n### Suplemento falso\n```\nFin\n";
    expect(splitModuleSections(md)).toHaveLength(1);
  });

  it("no pierde texto: la concatenación conserva todas las líneas salvo los títulos plegados", () => {
    for (const mod of getAllLevels().flatMap((l) => l.modules)) {
      const segments = splitModuleSections(mod.rawContent);
      const joined = segments.map((s) => s.markdown).join("");
      const removed = segments.filter((s) => s.optional).length;
      expect(joined.split("\n").length).toBeGreaterThanOrEqual(mod.rawContent.split("\n").length - removed - 1);
    }
  });

  it("el índice usa los slugs de rehype-slug", () => {
    expect(githubSlug("🧩 Microlección 1 — Tu tenant")).toBe("-microlección-1--tu-tenant");
    const outline = getModuleOutline("## 🧩 Microlección 1 — Tu tenant\n```\n## no\n```\n");
    expect(outline).toEqual([{ title: "Microlección 1 — Tu tenant", slug: "-microlección-1--tu-tenant" }]);
  });
});

describe("siguiente paso después de Fundamentos", () => {
  it("sigue la cadena de certificación cuando no hay ruta", () => {
    const next = getNextCurriculumModule(curriculum, ["basico-1", "basico-2"]);
    expect(next?.key).toBe("basico-3");
  });

  it("respeta el orden de la ruta elegida y nunca propone un transversal fuera de ella", () => {
    const next = getNextCurriculumModule(curriculum, ["basico-1"], [1, 13, 2]);
    expect(next?.moduleId).toBe(13);
    const all = curriculum.filter((m) => ["basico", "intermedio", "avanzado", "arquitecto"].includes(m.levelId)).map((m) => m.key);
    expect(getNextCurriculumModule(curriculum, all)).toBeNull();
  });

  it("al completar Fundamentos y elegir ruta, recomienda un módulo y no 'Descubre tu ruta'", () => {
    const foundationModules = FOUNDATION_ACTIVITIES.filter((a) => a.moduleId).map((a) => `basico-${a.moduleId}`);
    const labs = FOUNDATION_ACTIVITIES.filter((a) => a.labSlug).map((a) => a.labSlug!);
    const action = getNextBestAction(foundationModules, labs, {
      ...DEFAULT_ONBOARDING_STATE,
      stage: "route_selected",
      selectedRouteSlug: "maker",
      currentActivityId: null,
    }, { curriculum, routeModuleIds: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11], routeTitle: "Maker" });
    expect(action.activity.type).toBe("module");
    expect(action.activity.href).toContain("/modulo/");
    expect(action.route).toBe("Maker");
  });
});

describe("catálogo de recursos", () => {
  it("cada recurso publicado está en exactamente un grupo", () => {
    const grouped = RESOURCE_GROUPS.flatMap((g) => g.slugs);
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual(getAllResourcePages().map((p) => p.slug).sort());
  });
});

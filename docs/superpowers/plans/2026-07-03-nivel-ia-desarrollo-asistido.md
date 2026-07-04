# Nivel IA — Desarrollo Asistido por IA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 5th, transversal `LevelId` ("ia") to the Power Platform study plan app — 10 modules, 2 labs, 80 quiz questions, and a checklist section — covering AI-assisted development (Copilot, GitHub Copilot, Claude Code, Codex), without gating or being gated by the 4 existing PL-900→PL-600 levels.

**Architecture:** Purely additive extension of the existing generic `LevelId`-driven system. Every page (`/nivel/[level]`, `/nivel/[level]/modulo/[slug]`, `/certificado/[nivel]`) already derives its routes from `getAllLevels()`/`LEVEL_ORDER` dynamically — no new routes or components are created. The work is: (1) add `"ia"` everywhere `LevelId` is used as a `Record` key (a closed set of ~11 files), (2) author the 10 module + 2 lab content files, 80 questions, and checklist section, (3) special-case two pieces of copy (`LevelCompleteBanner`, `CertificateDiploma`) so the transversal level doesn't inherit "PL-xxx exam" language or auto-suggest itself after Arquitecto.

**Tech Stack:** Next.js 15 (App Router, static export), TypeScript, Zustand, Vitest + Testing Library, Playwright, gray-matter (frontmatter), MkDocs Material (legacy, untouched by this feature except one required stub file).

## Global Constraints

- Follow the spec exactly: `docs/superpowers/specs/2026-07-03-nivel-ia-desarrollo-asistido-design.md`.
- No large redesigns or unrelated refactors. Every change is additive to an existing `Record<LevelId, ...>` or array, following the established pattern for `basico`/`intermedio`/`avanzado`/`arquitecto`.
- Spanish content throughout (per `CLAUDE.md` language rule). Technical terms (Copilot, GitHub Copilot, Claude Code, Codex, PR, CI/CD, diff) stay in English/product-name form.
- Module content keeps the fixed 7-section structure: Objetivo, Conceptos Clave, Actividades Prácticas Paso a Paso, Casos Reales de Negocio, Buenas Prácticas, Errores Comunes, Criterios de Validación.
- **Correction vs. spec:** the spec said `docs/Niveles/*.md` would not need to be touched. This plan found that `content.ts`'s `getAllLevels()` unconditionally calls `readRequiredFile()` on every `LEVEL_FILES[levelId]` entry, so a `docs/Niveles/NIVEL_5_IA.md` stub file **must** exist (Task 1) or the entire app fails to build once `"ia"` is added to `LevelId`. Its content is inert (overridden by the individual files in `app-elearning/content/modules/ia/`), matching how the other 4 levels' legacy files are already dead code in practice per `CLAUDE.md`.
- **Correction vs. spec:** the spec did not mention `checklist-client.tsx`'s `LEVEL_STYLE` map or `quiz-engine.ts`'s `certForModule`/`levelForModule` functions. Both were found during planning and are in scope (Tasks 3, 10).
- Work happens on branch `feature/nivel-ia-desarrollo-asistido`, created in Task 1. Do not push to `master` until Task 16 (final verification) passes in full — intermediate commits will fail CI's "Validate content" step because `validate:content` requires full coverage (all modules have ≥1 question, checklist has all levels/modules/items) the moment `LEVEL_MODULE_RANGE.ia` exists, which won't be true until Task 9.
- Content-authoring tasks (modules, labs, questions, checklist) are specified below as complete, ready-to-use text — not briefs to reinterpret. Where a task says "write the following", copy it verbatim into the target file.

---

## File Map

| File | Change |
|---|---|
| `docs/Niveles/NIVEL_5_IA.md` | New — legacy stub (Task 1) |
| `app-elearning/src/lib/i18n.ts` | Modify — `LevelId`, `LEVEL_ORDER`, `LEVEL_MODULE_RANGE`, `UI.levels.*` (Task 2) |
| `app-elearning/src/lib/content.ts` | Modify — `LEVEL_FILES`, `LEVEL_META`, `validateLabFrontmatter` level whitelist (Task 2) |
| `app-elearning/src/lib/checklist.ts` | Modify — `LEVEL_BY_NUMBER` (Task 2) |
| `app-elearning/src/components/ui/badge.tsx` | Modify — new `ia` variant (Task 2) |
| `app-elearning/src/lib/quiz-engine.ts` | Modify — fix `certForModule`/`levelForModule` (Task 3) |
| `app-elearning/src/lib/__tests__/quiz-engine.test.ts` | Modify — tests for the fix (Task 3) |
| `app-elearning/src/lib/__tests__/checklist.test.ts` | Modify — 5-level fixtures (Task 4) |
| `app-elearning/src/lib/__tests__/progress.test.ts` | Modify — total 41→51 (Task 5) |
| `app-elearning/src/lib/__tests__/questions-parser.test.ts` | Modify — range 41→51 (Task 5) |
| `app-elearning/content/modules/ia/42-fundamentos-ia-desarrollo.md` … `51-flujo-recomendado-humano-ia-ci.md` | New — 10 module files (Task 6) |
| `docs/javascripts/evaluaciones-simulador.js` | Modify — add keys 42-51 (Task 7) |
| `docs/Recursos/CHECKLIST_PROGRESO.md` | Modify — add NIVEL 5 section (Task 8) |
| `app-elearning/src/components/layout/sidebar.tsx` | Modify — `LEVEL_CONFIG.ia` (Task 10) |
| `app-elearning/src/app/page.tsx` | Modify — `LEVEL_CONFIG.ia`, hero copy (Task 10) |
| `app-elearning/src/app/labs/page.tsx` | Modify — `LEVEL_CONFIG.N5`, `CERT_VARIANT`, `levelOrder` (Task 10) |
| `app-elearning/src/components/checklist/checklist-client.tsx` | Modify — `LEVEL_STYLE.ia` (Task 10) |
| `app-elearning/src/components/modules/level-progress-banner.tsx` | Modify — colors + `isFinal`/messaging (Task 11) |
| `app-elearning/src/components/modules/certificate-diploma.tsx` | Modify — colors + IA-specific phrase (Task 12) |
| `app-elearning/content/labs/lab-45-copilot-implementacion-guiada.md`, `lab-51-flujo-completo-humano-ia-ci.md` | New — 2 labs (Task 13) |
| `app-elearning/e2e/smoke.spec.ts` | Modify — IA level + certificate smoke tests (Task 14) |
| `CLAUDE.md`, `README.md`, `AGENTS.md` | Modify — counts, structure, IA note (Task 15) |

---

### Task 1: Feature branch + legacy stub file

**Files:**
- Create: `docs/Niveles/NIVEL_5_IA.md`

**Interfaces:**
- Produces: a file at `docs/Niveles/NIVEL_5_IA.md` that `content.ts`'s `readRequiredFile()` can read. Its content is never parsed into real modules (no `### Módulo NN:` headings), so `extractModulesFromContent` returns `[]` for it — that's fine, Task 2 wires `LEVEL_MODULE_RANGE.ia` but real module data comes from `app-elearning/content/modules/ia/` (Task 6).

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b feature/nivel-ia-desarrollo-asistido
```

- [ ] **Step 2: Write the stub file**

```markdown
# 🟣 NIVEL 5: DESARROLLO ASISTIDO POR IA

> Contenido oficial para la app en `app-elearning/content/modules/ia/`. Este archivo es un
> stub legacy requerido por `content.ts` (mismo patrón que los otros 4 niveles) y no se
> renderiza en la app Next.js — ver `CLAUDE.md` para el porqué.

Nivel transversal de buenas prácticas de desarrollo asistido por IA (Copilot, GitHub
Copilot, Claude Code, Codex) aplicado a soluciones Power Platform y Dynamics 365. No es
prerequisito de los niveles PL-900 → PL-600 ni depende de ellos.
```

- [ ] **Step 3: Commit**

```bash
git add docs/Niveles/NIVEL_5_IA.md
git commit -m "docs: agregar stub legacy para el nivel IA (requerido por content.ts)"
```

---

### Task 2: Core type plumbing (LevelId, LEVEL_ORDER, LEVEL_MODULE_RANGE, badge variant)

**Files:**
- Modify: `app-elearning/src/lib/i18n.ts`
- Modify: `app-elearning/src/lib/content.ts`
- Modify: `app-elearning/src/lib/checklist.ts`
- Modify: `app-elearning/src/components/ui/badge.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `LevelId = "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia"`; `LEVEL_ORDER` includes `"ia"` last; `LEVEL_MODULE_RANGE.ia = [42, 51]`; `UI.levels.{badge,cert,description,modules}.ia`; `content.ts`'s `LEVEL_FILES.ia`, `LEVEL_META.ia`; `validateLabFrontmatter` accepts `level: "N5"`; `checklist.ts`'s `LEVEL_BY_NUMBER[5] = "ia"`; `badgeVariants` has an `ia` variant. All later tasks depend on these existing.

This task changes 4 files together because TypeScript enforces every `Record<LevelId, ...>` to have all keys the moment `"ia"` is added to the union — a partial change won't compile.

- [ ] **Step 1: Update `i18n.ts`**

In `app-elearning/src/lib/i18n.ts`, update the `UI.levels` object — add `ia` alongside the existing 4 keys in `badge`, `cert`, `description`, and `modules`:

```typescript
  levels: {
    basico: "Básico",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
    arquitecto: "Arquitecto",
    ia: "Desarrollo Asistido por IA",
    badge: {
      basico: "🟢 Nivel 1",
      intermedio: "🔵 Nivel 2",
      avanzado: "🟠 Nivel 3",
      arquitecto: "🔴 Nivel 4",
      ia: "🟣 IA",
    },
    cert: {
      basico: "PL-900",
      intermedio: "PL-200",
      avanzado: "PL-400",
      arquitecto: "PL-600",
      ia: "Buenas Prácticas",
    },
    description: {
      basico: "Fundamentos de Power Platform y Dataverse",
      intermedio: "Canvas Apps, Model-Driven, Power Automate y Power BI avanzados",
      avanzado: "Arquitectura, ALM, D365, Copilot Studio y extensibilidad",
      arquitecto: "Gobernanza enterprise, multi-tenant, Azure integrations y liderazgo",
      ia: "Copilot, GitHub Copilot, Claude Code y Codex aplicados de forma segura y auditable al desarrollo en Power Platform y D365",
    },
    modules: {
      basico: 8,
      intermedio: 9,
      avanzado: 13,
      arquitecto: 11,
      ia: 10,
    },
  },
```

Then update the type and constants below it:

```typescript
export type LevelId = "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia";

export const LEVEL_ORDER: LevelId[] = ["basico", "intermedio", "avanzado", "arquitecto", "ia"];

export const LEVEL_MODULE_RANGE: Record<LevelId, [number, number]> = {
  basico: [1, 8],
  intermedio: [9, 17],
  avanzado: [18, 30],
  arquitecto: [31, 41],
  ia: [42, 51],
};
```

- [ ] **Step 2: Update `content.ts`**

Add an `ia` entry to `LEVEL_FILES` (pointing at the stub from Task 1):

```typescript
const LEVEL_FILES: Record<LevelId, string> = {
  basico: "Niveles/NIVEL_1_BASICO.md",
  intermedio: "Niveles/NIVEL_2_INTERMEDIO.md",
  avanzado: "Niveles/NIVEL_3_AVANZADO.md",
  arquitecto: "Niveles/NIVEL_4_ARQUITECTO.md",
  ia: "Niveles/NIVEL_5_IA.md",
};
```

Add an `ia` entry to `LEVEL_META`:

```typescript
const LEVEL_META: Record<LevelId, { title: string; description: string; certification: string }> = {
  basico: {
    title: "Nivel 1 — Básico",
    description: "Fundamentos de Power Platform y Dataverse",
    certification: "PL-900",
  },
  intermedio: {
    title: "Nivel 2 — Intermedio",
    description: "Canvas Apps, Model-Driven, Power Automate y Power BI avanzados",
    certification: "PL-200",
  },
  avanzado: {
    title: "Nivel 3 — Avanzado",
    description: "Arquitectura, ALM, D365, Copilot Studio y extensibilidad",
    certification: "PL-400",
  },
  arquitecto: {
    title: "Nivel 4 — Arquitecto",
    description: "Gobernanza enterprise, multi-tenant, Azure integrations y liderazgo",
    certification: "PL-600",
  },
  ia: {
    title: "Desarrollo Asistido por IA",
    description: "Copilot, GitHub Copilot, Claude Code y Codex aplicados de forma segura y auditable al desarrollo en Power Platform y D365",
    certification: "Buenas Prácticas",
  },
};
```

In `validateLabFrontmatter`, extend the allowed `level` values:

```typescript
  const level = requireString(data, "level", filePath);
  if (!["N1", "N2", "N3", "N4", "N5"].includes(level)) {
    failContent(filePath, `frontmatter 'level' debe ser N1, N2, N3, N4 o N5, recibido '${level}'`);
  }
```

- [ ] **Step 3: Update `checklist.ts`**

```typescript
const LEVEL_BY_NUMBER: Record<number, LevelId> = {
  1: "basico",
  2: "intermedio",
  3: "avanzado",
  4: "arquitecto",
  5: "ia",
};
```

- [ ] **Step 4: Update `badge.tsx`**

```typescript
      variants: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        basico:     "border-transparent bg-[#107C10] text-white",
        intermedio: "border-transparent bg-[#0078D4] text-white",
        avanzado:   "border-transparent bg-orange-500 text-white",
        arquitecto: "border-transparent bg-[#D13438] text-white",
        ia:         "border-transparent bg-purple-600 text-white",
      },
```

- [ ] **Step 5: Verify it compiles**

Run: `cd app-elearning && npx tsc --noEmit`
Expected: no output (success). If it errors, the error will name the file/`Record` still missing an `ia` key — fix it there.

- [ ] **Step 6: Run lint**

Run: `npm run lint`
Expected: no output (success).

- [ ] **Step 7: Commit**

```bash
git add app-elearning/src/lib/i18n.ts app-elearning/src/lib/content.ts app-elearning/src/lib/checklist.ts app-elearning/src/components/ui/badge.tsx
git commit -m "feat: agregar LevelId 'ia' y su plumbing (i18n, content, checklist, badge)"
```

Note: `npm run validate:content` will **fail** at this point (no modules/questions/checklist exist yet for `ia`) — that's expected, do not run it as a gate until Task 9.

---

### Task 3: Fix `certForModule`/`levelForModule` to cover module 42+ (bug found during planning)

**Files:**
- Modify: `app-elearning/src/lib/quiz-engine.ts:154-166`
- Test: `app-elearning/src/lib/__tests__/quiz-engine.test.ts:260-290`

**Interfaces:**
- Consumes: `LEVEL_ORDER`, `LEVEL_MODULE_RANGE`, `UI` from `./i18n` (new import in `quiz-engine.ts`).
- Produces: `certForModule(moduleId: number): string`, `levelForModule(moduleId: number): LevelId` (return type narrows from `string` to `LevelId` — a supertype-compatible, non-breaking change since no other file consumes these two functions today).

These two exported functions currently hardcode numeric thresholds (`moduleId <= 30` → `"arquitecto"`/`"PL-600"`, with no upper bound), so modules 42-51 would silently be misreported as Arquitecto/PL-600 once they exist. Fix by deriving from `LEVEL_MODULE_RANGE` instead of duplicating the thresholds.

- [ ] **Step 1: Update the failing expectations first**

In `app-elearning/src/lib/__tests__/quiz-engine.test.ts`, replace the `certForModule` and `levelForModule` describe blocks:

```typescript
describe("certForModule", () => {
  it("returns PL-900 for modules 1-8", () => {
    for (let i = 1; i <= 8; i++) expect(certForModule(i)).toBe("PL-900");
  });
  it("returns PL-200 for modules 9-17", () => {
    expect(certForModule(9)).toBe("PL-200");
    expect(certForModule(17)).toBe("PL-200");
  });
  it("returns PL-400 for modules 18-30", () => {
    expect(certForModule(18)).toBe("PL-400");
    expect(certForModule(30)).toBe("PL-400");
  });
  it("returns PL-600 for modules 31-41", () => {
    expect(certForModule(31)).toBe("PL-600");
    expect(certForModule(41)).toBe("PL-600");
  });
  it("returns Buenas Prácticas for modules 42-51 (nivel IA)", () => {
    expect(certForModule(42)).toBe("Buenas Prácticas");
    expect(certForModule(51)).toBe("Buenas Prácticas");
  });
});

// ─── levelForModule ───────────────────────────────────────────────────────────

describe("levelForModule", () => {
  it("maps module ranges to level ids", () => {
    expect(levelForModule(1)).toBe("basico");
    expect(levelForModule(8)).toBe("basico");
    expect(levelForModule(9)).toBe("intermedio");
    expect(levelForModule(17)).toBe("intermedio");
    expect(levelForModule(18)).toBe("avanzado");
    expect(levelForModule(30)).toBe("avanzado");
    expect(levelForModule(31)).toBe("arquitecto");
    expect(levelForModule(41)).toBe("arquitecto");
    expect(levelForModule(42)).toBe("ia");
    expect(levelForModule(51)).toBe("ia");
  });
});
```

- [ ] **Step 2: Run the tests to verify the new expectations fail**

Run: `cd app-elearning && npx vitest run src/lib/__tests__/quiz-engine.test.ts -t "certForModule|levelForModule"`
Expected: FAIL — `certForModule(42)` currently returns `"PL-600"`, not `"Buenas Prácticas"`; `levelForModule(42)` currently returns `"arquitecto"`, not `"ia"`.

- [ ] **Step 3: Fix the implementation**

In `app-elearning/src/lib/quiz-engine.ts`, add the import at the top of the file:

```typescript
import { LEVEL_ORDER, LEVEL_MODULE_RANGE, UI, type LevelId } from "./i18n";
```

Replace the two functions:

```typescript
export function levelForModule(moduleId: number): LevelId {
  for (const levelId of LEVEL_ORDER) {
    const [min, max] = LEVEL_MODULE_RANGE[levelId];
    if (moduleId >= min && moduleId <= max) return levelId;
  }
  return LEVEL_ORDER[LEVEL_ORDER.length - 1]!;
}

export function certForModule(moduleId: number): string {
  return UI.levels.cert[levelForModule(moduleId)];
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/quiz-engine.test.ts`
Expected: PASS (all tests in the file, not just the two describe blocks — confirm no other test in this file broke).

- [ ] **Step 5: Commit**

```bash
git add app-elearning/src/lib/quiz-engine.ts app-elearning/src/lib/__tests__/quiz-engine.test.ts
git commit -m "fix: certForModule/levelForModule ahora cubren el nivel IA (42-51) derivando de LEVEL_MODULE_RANGE"
```

---

### Task 4: Fix `checklist.test.ts` fixtures for 5 levels

**Files:**
- Modify: `app-elearning/src/lib/__tests__/checklist.test.ts`

**Interfaces:**
- Consumes: `LEVEL_ORDER`/`LEVEL_MODULE_RANGE` (transitively, via `validateChecklistData` now requiring all 5 levels).
- Produces: nothing new — restores these tests to passing now that `LEVEL_ORDER` has 5 entries.

`validateChecklistData` requires every `LEVEL_ORDER` entry to be present. After Task 2, `LEVEL_ORDER` includes `"ia"`, so 3 of the tests in this file — which build a fixture covering exactly the 4 pre-existing levels/41 modules — will start failing with "Faltan niveles del checklist" instead of testing what they're meant to test. Fix by extending the fixtures to 5 levels / 51 modules. This is pure test-fixture maintenance, not new behavior.

- [ ] **Step 1: Run the suite first to see the breakage**

Run: `cd app-elearning && npx vitest run src/lib/__tests__/checklist.test.ts`
Expected: FAIL — 3 tests fail with `Faltan niveles del checklist` where they previously expected `not.toThrow()`, `Faltan módulos del checklist`, or `Categoría de checklist inválida`.

- [ ] **Step 2: Replace the three affected tests and the two shared helpers**

In `app-elearning/src/lib/__tests__/checklist.test.ts`, replace the `"accepts a checklist with all expected modules and valid categories"` test:

```typescript
  it("accepts a checklist with all expected modules and valid categories", () => {
    const modules = Array.from({ length: 51 }, (_, index) => {
      const moduleId = index + 1;
      return `### Módulo ${moduleId}: Módulo ${moduleId}

- [ ] **Conocimiento**: Criterio ${moduleId}
`;
    });
    const markdown = `## NIVEL 1: BÁSICO

${modules.slice(0, 8).join("\n")}
## NIVEL 2: INTERMEDIO

${modules.slice(8, 17).join("\n")}
## NIVEL 3: AVANZADO

${modules.slice(17, 30).join("\n")}
## NIVEL 4: ARQUITECTO

${modules.slice(30, 41).join("\n")}
## NIVEL 5: IA

${modules.slice(41).join("\n")}`;

    expect(() => validateChecklistData(parseChecklistMarkdown(markdown))).not.toThrow();
  });
```

Replace the `"throws a clear error when checklist modules are missing"` test (add a NIVEL 5 section with one module so the test still exercises "some modules missing", not "a level is missing"):

```typescript
  it("throws a clear error when checklist modules are missing", () => {
    const markdown = `## NIVEL 1: BÁSICO

### Módulo 1: Introducción

- [ ] **Conocimiento**: Criterio

## NIVEL 2: INTERMEDIO

### Módulo 9: Intermedio

- [ ] **Conocimiento**: Criterio

## NIVEL 3: AVANZADO

### Módulo 18: Avanzado

- [ ] **Conocimiento**: Criterio

## NIVEL 4: ARQUITECTO

### Módulo 31: Arquitecto

- [ ] **Conocimiento**: Criterio

## NIVEL 5: IA

### Módulo 42: Fundamentos de IA para Desarrollo

- [ ] **Conocimiento**: Criterio
`;
    const checklist = parseChecklistMarkdown(markdown);

    expect(() => validateChecklistData(checklist)).toThrow(/Faltan módulos del checklist/i);
  });
```

Replace the `"throws a clear error when a criterion category is invalid"` test:

```typescript
  it("throws a clear error when a criterion category is invalid", () => {
    const modules = Array.from({ length: 51 }, (_, index) => {
      const moduleId = index + 1;
      const category = moduleId === 1 ? "Otro" : "Conocimiento";
      return `### Módulo ${moduleId}: Módulo ${moduleId}

- [ ] **${category}**: Criterio ${moduleId}
`;
    });
    const markdown = `## NIVEL 1: BÁSICO

${modules.slice(0, 8).join("\n")}
## NIVEL 2: INTERMEDIO

${modules.slice(8, 17).join("\n")}
## NIVEL 3: AVANZADO

${modules.slice(17, 30).join("\n")}
## NIVEL 4: ARQUITECTO

${modules.slice(30, 41).join("\n")}
## NIVEL 5: IA

${modules.slice(41).join("\n")}`;

    expect(() => validateChecklistData(parseChecklistMarkdown(markdown))).toThrow(
      /Categoría de checklist inválida/i,
    );
  });
```

Leave `"throws a clear error when a checklist level is missing"` (the test that omits NIVEL 1 entirely) **unchanged** — it already tests "a level is missing" using only 4 of the now-5 required levels, which still correctly triggers `Faltan niveles del checklist`.

Replace the two shared helpers (`buildFullChecklistMarkdown`, `assembleLevels`):

```typescript
  // Helper that builds a complete, valid 51-module checklist (one criterion
  // per module) so individual violation tests can tweak a single module
  // without also tripping the "missing levels/modules" checks first.
  function buildFullChecklistMarkdown(): string[] {
    return Array.from({ length: 51 }, (_, index) => {
      const moduleId = index + 1;
      return `### Módulo ${moduleId}: Módulo ${moduleId}

- [ ] **Conocimiento**: Criterio ${moduleId}
`;
    });
  }

  function assembleLevels(modules: string[]): string {
    return `## NIVEL 1: BÁSICO

${modules.slice(0, 8).join("\n")}
## NIVEL 2: INTERMEDIO

${modules.slice(8, 17).join("\n")}
## NIVEL 3: AVANZADO

${modules.slice(17, 30).join("\n")}
## NIVEL 4: ARQUITECTO

${modules.slice(30, 41).join("\n")}
## NIVEL 5: IA

${modules.slice(41).join("\n")}`;
  }
```

Leave the 4 tests that use these helpers (`"duplicated across levels"`, `"outside its level range"`, `"no checklist criteria"`, `"item ids are duplicated"`) **unchanged** — they only reference `modules[0]`, `modules[8]`, `modules[40]`, and `checklist.levels[0]`, all of which still resolve correctly against the extended 51-module fixture.

- [ ] **Step 3: Run the suite to verify it passes**

Run: `npx vitest run src/lib/__tests__/checklist.test.ts`
Expected: PASS (13 tests).

- [ ] **Step 4: Commit**

```bash
git add app-elearning/src/lib/__tests__/checklist.test.ts
git commit -m "test: actualizar fixtures de checklist a 5 niveles / 51 módulos"
```

---

### Task 5: Fix hardcoded `41` expectations in `progress.test.ts` and `questions-parser.test.ts`

**Files:**
- Modify: `app-elearning/src/lib/__tests__/progress.test.ts:153-157`
- Modify: `app-elearning/src/lib/__tests__/questions-parser.test.ts:78-83`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — these are the last two pre-existing tests that hardcode the old module count; after this task, no test in the suite references `41` as if it were the total.

These two tests currently pass, but will start failing once Task 6 adds modules 42-51 and Task 7 adds their questions (not because of a bug — because the numbers genuinely change from 41 to 51). Fixing them now, ahead of the content tasks, keeps each task's test run meaningful; re-run them again after Tasks 6-7 to confirm.

- [ ] **Step 1: Update `progress.test.ts`**

```typescript
  describe("getOverallProgress", () => {
    it("counts total as 51", () => {
      const prog = useProgressStore.getState().getOverallProgress();
      expect(prog.total).toBe(51);
    });
```

- [ ] **Step 2: Update `questions-parser.test.ts`**

```typescript
  it("moduleId values are between 1 and 51", () => {
    all.forEach((q) => {
      expect(q.moduleId, `${q.id}: moduleId out of range`).toBeGreaterThanOrEqual(1);
      expect(q.moduleId, `${q.id}: moduleId out of range`).toBeLessThanOrEqual(51);
    });
  });
```

- [ ] **Step 3: Run both files to confirm current state**

Run: `cd app-elearning && npx vitest run src/lib/__tests__/progress.test.ts src/lib/__tests__/questions-parser.test.ts`
Expected: PASS for both. `getOverallProgress` sums `LEVEL_MODULE_RANGE` directly (not real content files), and that constant already includes `ia: [42, 51]` since Task 2, so the total is already 51. `"moduleId values are between 1 and 51"` also passes trivially (no questions for 42-51 exist yet, so the loop has nothing new to check) — it starts meaningfully covering the new IDs once Task 7 lands.

- [ ] **Step 4: Commit**

```bash
git add app-elearning/src/lib/__tests__/progress.test.ts app-elearning/src/lib/__tests__/questions-parser.test.ts
git commit -m "test: actualizar expectativas de total de módulos (41 → 51)"
```

---

### Task 6: Write the 10 module content files

**Files:**
- Create: `app-elearning/content/modules/ia/42-fundamentos-ia-desarrollo.md`
- Create: `app-elearning/content/modules/ia/43-copilot-en-power-platform.md`
- Create: `app-elearning/content/modules/ia/44-github-copilot-en-vscode.md`
- Create: `app-elearning/content/modules/ia/45-claude-code-y-codex.md`
- Create: `app-elearning/content/modules/ia/46-vibe-coding-controlado.md`
- Create: `app-elearning/content/modules/ia/47-prompts-tecnicos-reutilizables.md`
- Create: `app-elearning/content/modules/ia/48-revision-de-diffs-y-prs.md`
- Create: `app-elearning/content/modules/ia/49-seguridad-secretos-y-compliance.md`
- Create: `app-elearning/content/modules/ia/50-tests-cicd-y-guardrails.md`
- Create: `app-elearning/content/modules/ia/51-flujo-recomendado-humano-ia-ci.md`

**Interfaces:**
- Consumes: `LEVEL_MODULE_RANGE.ia = [42, 51]` (Task 2) — `validateModuleFrontmatter` will reject any `moduleId` outside this range or any `level` other than `"ia"`.
- Produces: 10 `ModuleInfo` entries once `getAllLevels()` runs, consumed by Task 7 (question coverage check), Task 8 (checklist coverage check), Task 9 (`validate:content`), and Task 14 (e2e).

Each file uses the fixed 7-section structure from `CLAUDE.md`: 🎯 Objetivo, 📖 Conceptos Clave, 👨‍💻 Actividades Prácticas Paso a Paso, 💼 Casos Reales de Negocio, ✅ Buenas Prácticas, ⚠️ Errores Comunes, 🧪 Criterios de Validación. The body starts directly with `### 🎯 Objetivo` (no "Módulo N: Title" heading — title comes from frontmatter).

- [ ] **Step 1: Create the directory and module 42**

```bash
mkdir -p app-elearning/content/modules/ia
```

Write `app-elearning/content/modules/ia/42-fundamentos-ia-desarrollo.md`:

```markdown
---
moduleId: 42
title: "Fundamentos de IA para Desarrollo"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 7
slug: "fundamentos-ia-desarrollo"
---
### 🎯 Objetivo
Entender qué es un modelo de lenguaje (LLM) aplicado a generación de código, distinguir entre autocompletado, chat y agentes, y reconocer los límites reales de estas herramientas antes de usarlas en proyectos de Power Platform y Dynamics 365.

### 📖 Conceptos Clave
- **LLM aplicado a código:** un modelo entrenado para predecir texto, incluyendo código, a partir del contexto que recibe (el archivo abierto, el historial de chat, el repositorio). No "entiende" el negocio: infiere patrones estadísticamente probables.
- **Autocompletado vs Chat vs Agente:** el autocompletado (GitHub Copilot inline) sugiere la siguiente línea mientras escribes; el chat (Copilot Chat, Claude, ChatGPT) responde preguntas o genera bloques a partir de una instrucción; un agente (Claude Code, Codex, Copilot Agent Mode) puede leer múltiples archivos, ejecutar comandos y editar el repositorio de forma autónoma dentro de los límites que le des.
- **Contexto y ventana de contexto:** cuanto más contexto relevante (archivos, historial, documentación) reciba el modelo, mejor su respuesta — pero hay un límite de tokens; en repos grandes hay que decidir qué mostrarle.
- **Alucinaciones:** el modelo puede generar código sintácticamente válido que referencia una función, tabla o campo de Dataverse que no existe. Esto no es un bug del modelo, es una consecuencia de cómo funciona — siempre hay que verificar contra la fuente real (el esquema, la documentación oficial).
- **Determinismo relativo:** la misma pregunta puede producir respuestas distintas en ejecuciones diferentes. Esto es aceptable para explorar ideas, pero exige revisión humana antes de aceptar cualquier cambio en código de producción.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Abre un editor con Copilot o Claude Code instalado y pide "generar una función de Power Fx que valide un email" — observa que la respuesta es plausible pero puede usar sintaxis de otro lenguaje si no se le da contexto de Power Fx.
2. Repite la misma petición aclarando explícitamente "en Power Fx, para un control de texto en Canvas Apps" — compara la diferencia de precisión.
3. Pide al modelo que genere una función que use un campo de una tabla de Dataverse que no existe en tu entorno (invéntalo) y observa cómo el modelo no te avisa que el campo es inventado — así se ve una alucinación en la práctica.
4. Documenta en un párrafo la diferencia que observaste entre pedirle algo con contexto específico vs. sin contexto.

### 💼 Casos Reales de Negocio
Un equipo de Servicios Integrados Tecnológicos S.A. (SIT) pidió a un desarrollador junior generar un plugin C# completo con Copilot Chat sin revisar el resultado. El código compiló y pasó el Solution Checker, pero llamaba a una API de Dataverse en modo síncrono dentro de un bucle, generando timeouts en producción con volúmenes reales. La causa no fue el modelo — fue no verificar el resultado contra las buenas prácticas de rendimiento ya conocidas por el equipo antes de este módulo.

### ✅ Buenas Prácticas
- Dar siempre contexto explícito (lenguaje, plataforma, versión) antes de pedir código.
- Tratar toda alucinación como un riesgo esperado, no una excepción rara — verificar nombres de campos, tablas y APIs contra la fuente real.
- Usar el modelo para explorar y acelerar, nunca como sustituto de conocimiento del dominio (Power Platform, Dataverse, C#).

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aceptar código generado sin verificar que las tablas/campos referenciados existen | Confiar en que el modelo "sabe" el esquema real del entorno | Siempre contrastar contra el esquema real de Dataverse antes de aceptar |
| Pedir tareas sin contexto de plataforma | Asumir que el modelo infiere correctamente Power Fx vs JavaScript vs C# | Especificar siempre lenguaje, plataforma y versión en el prompt |
| Tratar la primera respuesta como definitiva | Falta de familiaridad con la naturaleza no determinista del modelo | Iterar el prompt y comparar 2-3 respuestas antes de decidir |

### 🧪 Criterios de Validación
- [ ] Explico la diferencia entre autocompletado, chat y agente con un ejemplo de cada uno
- [ ] Identifico una alucinación de código provocada intencionalmente en la actividad práctica
- [ ] Puedo enumerar 2 riesgos de aceptar código generado sin verificación
```

- [ ] **Step 2: Create module 43**

Write `app-elearning/content/modules/ia/43-copilot-en-power-platform.md`:

```markdown
---
moduleId: 43
title: "Copilot en Power Platform"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "copilot-en-power-platform"
---
### 🎯 Objetivo
Usar las capacidades de Copilot integradas en Power Apps, Power Automate y Copilot Studio para acelerar la construcción de soluciones, entendiendo qué gobierna cada una en materia de datos y permisos.

### 📖 Conceptos Clave
- **Copilot en Power Apps:** genera una app Canvas a partir de una descripción en lenguaje natural, y puede generar/editar fórmulas Power Fx a partir de una instrucción dentro del editor.
- **Copilot en Power Automate:** genera un flujo (trigger + acciones) a partir de una descripción, o explica qué hace un flujo existente paso a paso.
- **Copilot Studio como IA generativa de agentes:** a diferencia de los dos anteriores (que asisten al maker), Copilot Studio construye agentes conversacionales que el usuario final interactúa directamente — el generative answers usa fuentes de conocimiento (SharePoint, sitios web, Dataverse) para responder.
- **Gobernanza de datos:** cualquier dato que el maker exponga a Copilot para generar una app o flujo puede quedar reflejado en la sugerencia generada (ej. nombres de columnas reales de una tabla). Los tenants con datos sensibles deben revisar la configuración de Copilot en el Power Platform Admin Center (a nivel de entorno) antes de habilitarlo ampliamente.
- **Límites de generación:** Copilot en Power Apps/Automate es un punto de partida, no una solución final — genera un primer boceto funcional que casi siempre requiere ajustes de UX, manejo de errores y performance.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. En Power Apps Studio, usa "Crear con Copilot" describiendo una app simple de seguimiento de solicitudes (título, estado, fecha) y observa qué estructura de datos propone.
2. Pide a Copilot dentro del editor de fórmulas que genere una fórmula Power Fx para filtrar una galería por el estado "Pendiente" y compárala con cómo la escribirías manualmente.
3. En Power Automate, crea un flujo nuevo usando "Describe it to design it" pidiendo "cuando se cree un registro en una tabla, enviar un correo al responsable" y revisa las acciones que propuso.
4. En el Power Platform Admin Center, ubica la configuración de Copilot a nivel de entorno y documenta qué opciones de gobernanza de datos existen.

### 💼 Casos Reales de Negocio
En SIT, un Power Platform Admin activó Copilot en Power Apps para todo el tenant sin revisar antes qué entornos contenían datos de clientes bajo NDA. Un maker generó una app describiendo el proceso de negocio, y la sugerencia de Copilot incluyó nombres reales de columnas de una tabla confidencial visibles en la fórmula generada, expuestos luego en una captura de pantalla compartida externamente. La corrección: habilitar Copilot entorno por entorno, revisando primero el Data Loss Prevention (DLP) policy y la clasificación de datos de cada entorno.

### ✅ Buenas Prácticas
- Habilitar Copilot por entorno, no por defecto en todo el tenant, revisando la política DLP de cada uno primero.
- Tratar cualquier app/flujo generado por Copilot como un primer borrador: siempre revisar manejo de errores, seguridad y rendimiento antes de publicar.
- Usar Copilot Studio generative answers solo con fuentes de conocimiento ya validadas y con control de acceso correcto.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Habilitar Copilot en un entorno con datos sensibles sin revisar DLP | Activación por defecto sin evaluación previa | Revisar la política DLP y clasificación de datos del entorno antes de habilitar |
| Publicar en producción una app/flujo generado sin revisión | Asumir que el resultado de Copilot ya está listo para producción | Tratar siempre el resultado como borrador: revisar manejo de errores y seguridad |
| Confundir Copilot Studio (agentes para usuarios finales) con Copilot en Power Apps/Automate (asistente para makers) | Uso indistinto del término "Copilot" en el ecosistema | Distinguir explícitamente el rol: asistente de autor vs agente conversacional |

### 🧪 Criterios de Validación
- [ ] Genero una app Canvas simple usando Copilot y documento qué ajustes manuales necesitó
- [ ] Genero un flujo con "Describe it to design it" y explico cada acción propuesta
- [ ] Ubico y documento la configuración de gobernanza de Copilot en el Admin Center
```

- [ ] **Step 3: Run lint/typecheck to confirm no build regressions so far**

Run: `cd app-elearning && npm run lint && npx tsc --noEmit`
Expected: no output (both succeed). This does not yet validate content coverage (Task 9 does).

- [ ] **Step 4: Commit modules 42-43**

```bash
git add app-elearning/content/modules/ia/42-fundamentos-ia-desarrollo.md app-elearning/content/modules/ia/43-copilot-en-power-platform.md
git commit -m "feat: agregar módulos 42-43 del nivel IA (fundamentos, Copilot en Power Platform)"
```

- [ ] **Step 5: Create module 44**

Write `app-elearning/content/modules/ia/44-github-copilot-en-vscode.md`:

```markdown
---
moduleId: 44
title: "GitHub Copilot en VS Code"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "github-copilot-en-vscode"
---
### 🎯 Objetivo
Usar GitHub Copilot en VS Code (autocompletado, Copilot Chat y Copilot Edits) de forma productiva en proyectos reales del plan de estudio: componentes PCF, Code Apps y plugins C#.

### 📖 Conceptos Clave
- **Autocompletado inline:** sugiere la continuación del código mientras escribes, basado en el archivo actual y archivos abiertos relacionados; se acepta con Tab.
- **Copilot Chat:** panel de conversación dentro del editor para hacer preguntas sobre el código abierto, pedir explicaciones o generar bloques específicos sin tocar directamente el archivo.
- **Copilot Edits / Agent Mode:** modo que puede proponer y aplicar cambios a través de múltiples archivos del proyecto a partir de una instrucción, mostrando el diff antes de aceptarlo.
- **Contexto del workspace:** Copilot usa como contexto los archivos abiertos, el árbol del proyecto y (según configuración) el repositorio completo — mientras más específico el contexto abierto, más preciso el resultado en un componente PCF o plugin C# concreto.
- **`.github/copilot-instructions.md`:** archivo de convenciones de proyecto que Copilot lee automáticamente, útil para fijar patrones propios del repo (ej. convención de prefijos `sit_` de Dataverse, estilo de manejo de errores en plugins).

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Abre un componente PCF existente del proyecto SIT y usa el autocompletado para escribir una función `updateView` — observa qué tan bien predice la firma del método al tener el archivo real como contexto.
2. Abre Copilot Chat y pregunta "¿qué hace este componente PCF?" con el archivo abierto — evalúa si la explicación es correcta contra lo que tú ya sabes que hace.
3. Usa Copilot Edits para pedir "agregar manejo de errores try/catch a este plugin C#" sobre un plugin ya existente, revisa el diff propuesto antes de aceptarlo.
4. Crea un archivo `.github/copilot-instructions.md` con al menos 2 convenciones del proyecto (ej. prefijo de columnas, patrón de logging) y repite el paso 1 para comparar la mejora en la sugerencia.

### 💼 Casos Reales de Negocio
Un desarrollador de SIT usó Copilot Chat para generar un plugin C# de validación de un campo de Dataverse sin tener abierto el archivo del plugin base del proyecto (que ya tenía un patrón establecido de logging con `ITracingService`). El código generado usó `Console.WriteLine`, que no funciona dentro de un plugin de Dataverse y no genera ningún log visible. El equipo perdió tiempo depurando en producción hasta notar que el patrón de logging del proyecto no se había seguido — la causa raíz fue no dar a Copilot el contexto del patrón ya establecido.

### ✅ Buenas Prácticas
- Mantener abiertos los archivos relevantes (o un archivo de referencia con el patrón esperado) antes de pedir generación de código.
- Usar `.github/copilot-instructions.md` para fijar convenciones del proyecto una sola vez, en lugar de repetirlas en cada prompt.
- Revisar siempre el diff propuesto por Copilot Edits antes de aplicarlo — nunca aceptar cambios multi-archivo a ciegas.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Código generado no sigue el patrón de logging/errores del proyecto | Copilot no tenía contexto del patrón ya establecido | Abrir un archivo de referencia o documentarlo en `.github/copilot-instructions.md` |
| Aceptar cambios de Copilot Edits sin revisar el diff | Confiar en el resultado por ser multi-archivo y "coherente" | Revisar cada archivo modificado en el diff antes de aplicar |
| Repetir las mismas convenciones de proyecto en cada prompt | No usar el archivo de instrucciones del repositorio | Centralizar convenciones en `.github/copilot-instructions.md` |

### 🧪 Criterios de Validación
- [ ] Genero un fragmento de código en un componente PCF real usando autocompletado y explico qué contexto ayudó a la precisión
- [ ] Uso Copilot Chat para explicar un archivo existente y verifico la explicación contra mi propio conocimiento
- [ ] Aplico un cambio con Copilot Edits revisando el diff antes de aceptarlo
- [ ] Creo un `.github/copilot-instructions.md` con al menos 2 convenciones del proyecto
```

- [ ] **Step 6: Create module 45**

Write `app-elearning/content/modules/ia/45-claude-code-y-codex.md`:

```markdown
---
moduleId: 45
title: "Claude Code y Codex para Análisis e Implementación"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 9
slug: "claude-code-y-codex"
---
### 🎯 Objetivo
Usar agentes de código (Claude Code, Codex) para analizar repositorios grandes y ejecutar cambios acotados con herramientas (lectura, edición, bash), entendiendo qué los diferencia de un simple chat y cuándo delegarles una tarea real.

### 📖 Conceptos Clave
- **Agente vs chat:** un agente de código puede usar herramientas — leer archivos, buscar en el repo, ejecutar comandos (tests, lint, build), y editar archivos directamente — encadenando varios pasos sin que el humano copie/pegue manualmente cada resultado.
- **Análisis de repos grandes:** en un monorepo como este (`app-elearning/` + `docs/`), un agente puede explorar la estructura, encontrar todos los lugares donde una convención se repite (ej. cada `Record<LevelId, ...>`) antes de proponer un cambio — algo que un chat sin herramientas no puede hacer por sí mismo.
- **Alcance de la tarea (scope):** un agente rinde mejor con una tarea acotada y verificable ("agregar un campo a este formulario y correr los tests") que con una tarea vaga ("mejora el proyecto").
- **Diferencias de enfoque:** Claude Code tiende a un modelo de herramientas explícito con confirmación de pasos; Codex (integrado en OpenAI/GitHub Copilot Agent Mode) sigue un patrón similar de plan→ejecución→verificación. Ambos requieren que el humano defina el alcance y revise el resultado final.
- **Verificación como parte del ciclo:** un agente que corre los tests o el linter después de un cambio y reporta el resultado da más confianza que uno que solo entrega código sin ejecutar nada.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Pide a un agente de código "busca todos los archivos donde se recorre `LEVEL_ORDER` o se define un `Record<LevelId, ...>` en este repo" y compara el resultado contra una búsqueda manual con el buscador del editor.
2. Dale una tarea acotada: "agrega un console.log temporal a la función `calculateLevelProgress` en `progress.ts` y quítalo después de confirmar que se ejecuta" — observa si el agente verifica su propio trabajo (revierte el cambio) al terminar.
3. Pide una tarea vaga ("mejora el rendimiento de la app") y compara la calidad de la respuesta contra una tarea acotada del mismo tamaño — documenta la diferencia.
4. Pide al agente que ejecute `npm run lint` después de un cambio suyo y que te muestre el resultado, no solo el código.

### 💼 Casos Reales de Negocio
Un arquitecto de SIT le pidió a un agente de código "optimiza el proyecto" sin más contexto. El agente hizo cambios extensos en archivos no relacionados con el problema real (un formulario lento), incluyendo un refactor de componentes que nadie pidió, generando un PR de 40 archivos imposible de revisar en una sola sesión. La lección adoptada por el equipo: toda tarea delegada a un agente debe tener un alcance explícito y un criterio de éxito verificable (ej. "reduce el tiempo de carga de este formulario específico; no toques otros archivos").

### ✅ Buenas Prácticas
- Delegar tareas acotadas y verificables, nunca instrucciones vagas tipo "mejora esto".
- Pedir siempre que el agente ejecute la verificación disponible (tests, lint, build) como parte de la tarea, no como un paso aparte olvidado.
- Revisar el plan que el agente propone antes de dejarlo ejecutar cambios extensos, sobre todo en un monorepo con múltiples superficies (app + docs).

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Delegar una tarea vaga y obtener un cambio enorme e inmanejable | Falta de alcance explícito en la instrucción | Definir siempre el archivo/función objetivo y el criterio de éxito antes de delegar |
| No pedir verificación automática (tests/lint) tras el cambio | Asumir que el código generado es correcto sin ejecutarlo | Incluir la ejecución de tests/lint como parte explícita de la tarea |
| Confundir "agente" con "chat que da buenas respuestas" | No distinguir la capacidad de usar herramientas del agente | Verificar si la herramienta puede ejecutar comandos/leer archivos antes de asumir ese nivel de autonomía |

### 🧪 Criterios de Validación
- [ ] Uso un agente para localizar todas las ocurrencias de un patrón en el repo y confirmo el resultado manualmente
- [ ] Delego una tarea acotada con criterio de éxito verificable y reviso que el agente la haya cumplido
- [ ] Comparo el resultado de una tarea vaga vs. una acotada y documento la diferencia de calidad
```

- [ ] **Step 7: Commit modules 44-45**

```bash
git add app-elearning/content/modules/ia/44-github-copilot-en-vscode.md app-elearning/content/modules/ia/45-claude-code-y-codex.md
git commit -m "feat: agregar módulos 44-45 del nivel IA (GitHub Copilot en VS Code, Claude Code y Codex)"
```

- [ ] **Step 8: Create module 46**

Write `app-elearning/content/modules/ia/46-vibe-coding-controlado.md`:

```markdown
---
moduleId: 46
title: "Vibe Coding Controlado"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 7
slug: "vibe-coding-controlado"
---
### 🎯 Objetivo
Distinguir cuándo generar código sin especificación exhaustiva ("vibe coding") es aceptable en un contexto empresarial, y qué controles mínimos lo convierten en una práctica segura en lugar de un riesgo.

### 📖 Conceptos Clave
- **Vibe coding:** dejar que un modelo genere una implementación completa a partir de una descripción de alto nivel, iterando sobre el resultado en lugar de especificar cada detalle por adelantado.
- **Cuándo es aceptable:** prototipos descartables, scripts de un solo uso, exploración de una idea antes de comprometerse a una arquitectura, componentes de UI sin lógica de negocio sensible.
- **Cuándo NO es aceptable sin controles:** código que toca datos de producción, seguridad, lógica de negocio con impacto financiero/legal, o cualquier cosa que se vaya a desplegar sin pasar por code review humano.
- **Controles mínimos que lo hacen seguro:** alcance acotado (un archivo o módulo, no todo el sistema), tests que validen el comportamiento esperado (no solo que "compile"), y revisión humana obligatoria antes de fusionar a la rama principal — los mismos controles que ya exige este plan de estudio para cualquier cambio (Solution Checker, CI, code review).
- **Diferencia con desarrollo asistido "normal":** vibe coding no elimina la necesidad de estos controles — los vuelve más críticos, porque el humano invirtió menos tiempo revisando cada línea mientras se escribía.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Identifica una tarea de bajo riesgo (ej. un script para reformatear un CSV de prueba) y pide a un agente que la resuelva completa con una sola instrucción de alto nivel, sin revisar cada paso intermedio.
2. Identifica una tarea de alto riesgo (ej. una validación de seguridad en un plugin C# que se ejecuta en producción) y contrasta: ¿qué controles adicionales necesitarías antes de aceptar el resultado sin revisión detallada?
3. Escribe una regla de equipo de una sola frase que decida cuándo vibe coding está permitido en tu proyecto (ej. "solo en prototipos y scripts fuera de la rama principal").
4. Para el resultado del paso 1, agrega al menos un test que valide el comportamiento antes de considerarlo terminado.

### 💼 Casos Reales de Negocio
Un maker de SIT usó vibe coding para generar un flujo completo de aprobación de gastos en una sola sesión, sin revisar el detalle de cada acción, y lo publicó directamente a producción porque "funcionó en la prueba". Una condición de carrera entre dos aprobadores duplicó pagos durante una semana antes de detectarse. El equipo adoptó la regla: cualquier flujo generado sin revisión detallada pasa primero por un ambiente de pruebas con datos reales simulados y una revisión de un segundo maker antes de publicarse.

### ✅ Buenas Prácticas
- Reservar vibe coding para tareas de bajo riesgo y alcance acotado; nunca para cambios que toquen datos de producción o lógica financiera/legal sin revisión.
- Exigir al menos un test o validación funcional antes de dar por terminada cualquier tarea resuelta con vibe coding.
- Documentar como regla de equipo (no como decisión ad-hoc) cuándo está permitido y cuándo no.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Publicar a producción un resultado de vibe coding sin revisión | Confiar en que "funcionó en la prueba" es suficiente | Exigir ambiente de pruebas + revisión humana antes de publicar, igual que cualquier otro cambio |
| Usar vibe coding en lógica de negocio sensible (pagos, seguridad) | No distinguir el nivel de riesgo de la tarea | Reservar vibe coding para prototipos y tareas de bajo riesgo explícitamente definidas |
| No tener una regla de equipo explícita sobre cuándo se permite | Decisión informal caso por caso | Documentar la regla una vez y aplicarla consistentemente |

### 🧪 Criterios de Validación
- [ ] Distingo con un ejemplo propio una tarea apta para vibe coding de una que no lo es
- [ ] Escribo una regla de equipo de una frase sobre cuándo se permite vibe coding
- [ ] Agrego al menos un test de validación a un resultado generado con vibe coding
```

- [ ] **Step 9: Create module 47**

Write `app-elearning/content/modules/ia/47-prompts-tecnicos-reutilizables.md`:

```markdown
---
moduleId: 47
title: "Prompts Técnicos Reutilizables"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 7
slug: "prompts-tecnicos-reutilizables"
---
### 🎯 Objetivo
Construir plantillas de prompt reutilizables para tareas técnicas recurrentes en Power Platform y Dynamics 365, y establecer un lugar y formato consistente para versionarlas dentro del repositorio.

### 📖 Conceptos Clave
- **Plantilla de prompt:** una instrucción parametrizable que fija el contexto, el formato de salida y las restricciones esperadas, dejando solo los datos específicos de la tarea como variables (ej. nombre de la entidad, campos, validaciones).
- **Componentes de una buena plantilla:** rol/contexto (qué proyecto, qué convenciones), tarea concreta, restricciones (qué no hacer, qué patrón seguir), y formato de salida esperado (código, diff, lista de pasos).
- **Versionado de prompts:** igual que el código, una plantilla de prompt cambia con el tiempo (se ajusta cuando deja de dar buenos resultados); guardarla en el repo (ej. `docs/prompts/` o similar) permite historial de cambios con git, en lugar de perderla en un chat.
- **Reutilización vs. personalización:** una plantilla útil cubre el 80% del caso común y dejar el 20% restante para ajuste manual — plantillas demasiado rígidas fallan en casos particulares; demasiado abiertas no ahorran tiempo real.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Identifica una tarea que repites seguido (ej. "crear una nueva columna calculada en Dataverse" o "generar un flujo de aprobación estándar") y escribe la instrucción completa que usarías hoy, sin plantilla.
2. Reescríbela como plantilla parametrizable, marcando con `{{variable}}` las partes que cambian entre usos (nombre de tabla, campos, condición).
3. Prueba la plantilla dos veces con datos distintos y compara la consistencia del resultado contra la versión sin plantilla del paso 1.
4. Guarda la plantilla final en un archivo Markdown versionado del repositorio con un encabezado que indique para qué sirve y cuándo se actualizó por última vez.

### 💼 Casos Reales de Negocio
En SIT, cada desarrollador pedía "genera un flujo de aprobación" con una instrucción distinta cada vez, produciendo flujos con estructuras y nomenclatura inconsistentes entre proyectos, difíciles de mantener en equipo. Al introducir una plantilla común (con la convención de nombres `sit_`, el patrón de dos aprobadores y el manejo de rechazo ya especificados), el tiempo de creación de un flujo nuevo bajó y la consistencia entre flujos de distintos desarrolladores mejoró notablemente, facilitando el mantenimiento posterior.

### ✅ Buenas Prácticas
- Guardar las plantillas de prompt en el repositorio, versionadas con git, no solo en el historial de un chat.
- Incluir siempre restricciones explícitas (qué NO hacer, qué convención seguir) en la plantilla, no solo la tarea positiva.
- Revisar y actualizar las plantillas cuando dejen de producir buenos resultados, igual que se refactoriza código.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Repetir instrucciones distintas cada vez para la misma tarea recurrente | No haberlas convertido nunca en plantilla | Extraer una plantilla la primera vez que se detecta la repetición |
| Perder plantillas útiles en el historial de un chat | No versionarlas en el repositorio | Guardarlas como archivos Markdown en el repo, con control de versiones |
| Plantillas tan rígidas que fallan en casos particulares | Sobre-especificar cada detalle sin dejar espacio de ajuste | Cubrir el caso común como plantilla y dejar el resto para ajuste manual explícito |

### 🧪 Criterios de Validación
- [ ] Construyo una plantilla parametrizable a partir de una tarea que repito seguido
- [ ] Pruebo la plantilla con dos casos distintos y confirmo consistencia de resultado
- [ ] Guardo la plantilla como archivo versionado en el repositorio
```

- [ ] **Step 10: Create module 48**

Write `app-elearning/content/modules/ia/48-revision-de-diffs-y-prs.md`:

```markdown
---
moduleId: 48
title: "Revisión de Diffs y Pull Requests"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "revision-de-diffs-y-prs"
---
### 🎯 Objetivo
Revisar con criterio un diff generado por IA — propio o de un compañero — identificando alcance, efectos secundarios y riesgos de seguridad antes de aprobarlo, con o sin apoyo de un revisor automático.

### 📖 Conceptos Clave
- **Alcance del diff:** lo primero a verificar es si el diff toca solo lo que la tarea pedía — un cambio "para arreglar el formulario X" que también modifica un archivo de configuración no relacionado es una señal de alarma, generado por IA o no.
- **Efectos secundarios:** un cambio generado por IA puede resolver el síntoma pedido introduciendo un problema distinto (ej. quitar una validación para que "funcione" en lugar de corregir la causa) — revisar no solo si el cambio funciona, sino qué más pudo romper.
- **Seguridad en el diff:** prestar atención específica a: credenciales o secretos hardcodeados, nuevas dependencias no revisadas, y cambios en Security Roles o permisos de Dataverse.
- **Revisores automáticos/agentes de revisión:** herramientas que resumen un PR o señalan patrones sospechosos (ej. GitHub Copilot code review, agentes configurados para lint/seguridad) — son un apoyo, no un reemplazo del juicio humano; solo aceleran encontrar dónde mirar con más atención.
- **Checklist de revisión repetible:** tener una lista corta y consistente (alcance, efectos secundarios, seguridad, tests) evita que la revisión dependa del estado de ánimo o el tiempo disponible del revisor ese día.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Toma un diff generado por un agente de código en una tarea anterior de este nivel (Módulo 44 o 45) y revísalo con esta checklist: ¿toca solo lo pedido?, ¿tiene efectos secundarios?, ¿introduce algún secreto o permiso nuevo?, ¿tiene test que lo valide?
2. Genera intencionalmente un diff con un cambio fuera de alcance (pide a un agente "arregla el bug X" sin acotar el archivo) y practica identificar qué parte del diff no correspondía a la tarea.
3. Si tienes acceso a un revisor automático de PRs (ej. Copilot code review en GitHub), actívalo en un PR de prueba y compara sus observaciones contra tu propia revisión manual.
4. Escribe la checklist de revisión que usarás de forma consistente en tus propios PRs de aquí en adelante.

### 💼 Casos Reales de Negocio
Un PR generado con ayuda de un agente en SIT resolvía correctamente el bug reportado (un cálculo incorrecto en un flujo), pero también eliminaba una validación de rango que existía por una razón de negocio no documentada en el código. El revisor humano aprobó el PR porque el bug reportado sí se resolvió y no notó la validación eliminada al no comparar el diff completo contra la intención original de cada línea. La regla adoptada: todo diff se revisa línea por línea contra "¿por qué cambió esto?", no solo contra "¿se resolvió el síntoma reportado?".

### ✅ Buenas Prácticas
- Revisar el diff completo, no solo el resultado final — cada línea eliminada o modificada debe tener una razón clara ligada a la tarea.
- Usar una checklist corta y consistente (alcance, efectos secundarios, seguridad, tests) en cada revisión, generado por IA o no.
- Tratar los revisores automáticos como un apoyo que acelera dónde mirar, nunca como la aprobación final.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aprobar un PR porque "el bug reportado se resolvió" sin revisar el resto del diff | Enfocarse solo en el síntoma, no en el diff completo | Revisar cada línea cambiada contra su propia justificación, no solo el resultado final |
| Confiar en el resumen de un revisor automático sin leer el diff | Delegar por completo el juicio de revisión a la herramienta | Usar el revisor automático como guía de dónde mirar, no como aprobación |
| No tener una checklist consistente de revisión | Revisar "a ojo" según el tiempo disponible ese día | Definir y aplicar siempre la misma checklist corta |

### 🧪 Criterios de Validación
- [ ] Reviso un diff real usando la checklist de alcance/efectos secundarios/seguridad/tests
- [ ] Identifico un cambio fuera de alcance en un diff generado intencionalmente con ese defecto
- [ ] Documento mi propia checklist de revisión de PRs
```

- [ ] **Step 11: Commit modules 46-48**

```bash
git add app-elearning/content/modules/ia/46-vibe-coding-controlado.md app-elearning/content/modules/ia/47-prompts-tecnicos-reutilizables.md app-elearning/content/modules/ia/48-revision-de-diffs-y-prs.md
git commit -m "feat: agregar módulos 46-48 del nivel IA (vibe coding, prompts reutilizables, revisión de diffs/PRs)"
```

- [ ] **Step 12: Create module 49**

Write `app-elearning/content/modules/ia/49-seguridad-secretos-y-compliance.md`:

```markdown
---
moduleId: 49
title: "Seguridad, Secretos y Compliance en IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "seguridad-secretos-y-compliance"
---
### 🎯 Objetivo
Prevenir la fuga de secretos y datos sensibles hacia prompts o logs de herramientas de IA, y aplicar la política de datos del tenant (residencia, GDPR) al usar estas herramientas sobre datos de Dataverse.

### 📖 Conceptos Clave
- **Fuga de secretos a prompts:** pegar una cadena de conexión, una API key o un connection reference completo dentro de un prompt puede quedar almacenado en el historial de la herramienta o en logs del proveedor, según su política de retención — nunca se debe pegar un secreto real en un prompt, ni siquiera "para que el modelo entienda el contexto".
- **Datos sensibles en el contexto:** igual que con secretos, incluir registros reales de clientes (nombres, historiales médicos, datos financieros) como ejemplo en un prompt expone esos datos a un tercero (el proveedor del modelo) — se debe usar siempre datos ficticios o anonimizados equivalentes en estructura.
- **Residencia de datos y GDPR:** algunos modelos procesan el prompt en regiones específicas; si el tenant tiene requisitos de residencia (ej. datos que no pueden salir de la UE), hay que verificar dónde procesa el proveedor de IA antes de usarlo con datos reales, no asumirlo.
- **Políticas de tenant:** el Power Platform Admin Center permite restringir qué conectores y qué IA generativa están disponibles por entorno (DLP policies) — la misma lógica de gobernanza de datos aplicada a conectores aplica a las herramientas de IA.
- **Logs y auditoría:** algunas herramientas registran qué se les pidió y qué devolvieron; esto puede ser deseable para auditoría interna, pero significa que un secreto pegado en un prompt persiste en esos logs también.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Revisa un prompt real que hayas usado en un módulo anterior de este nivel y verifica si incluye algún dato que en un proyecto real sería sensible (nombre de tabla real con datos de clientes, credencial, URL interna).
2. Reescribe ese prompt reemplazando cualquier dato sensible por un equivalente ficticio que preserve la estructura (mismo tipo de campo, mismo formato) sin exponer información real.
3. Ubica en la documentación de la herramienta de IA que usas (Copilot, Claude, etc.) su política de retención de datos y de qué región procesa las solicitudes.
4. En el Power Platform Admin Center, revisa qué conectores/IA generativa están permitidos en un entorno de ejemplo vía DLP policy y documenta cómo restringirías uno adicional.

### 💼 Casos Reales de Negocio
Un desarrollador de SIT pegó una cadena de conexión completa a una base de datos de staging en un prompt para "que el modelo generara el código de conexión correcto", incluyendo usuario y contraseña reales. La credencial quedó en el historial de la herramienta usada. El incidente se resolvió rotando la credencial de inmediato y estableciendo la regla de equipo: ningún secreto real se pega en un prompt, siempre se usan placeholders (`{{CONNECTION_STRING}}`) y los valores reales viven únicamente en Environment Variables/Key Vault, nunca en texto plano en una conversación con IA.

### ✅ Buenas Prácticas
- Nunca pegar secretos reales (credenciales, connection strings, API keys) en un prompt — usar siempre placeholders.
- Anonimizar o ficcionalizar cualquier dato de ejemplo que se comparta con una herramienta de IA, preservando la estructura pero no el contenido real.
- Verificar la política de residencia y retención de datos del proveedor de IA antes de usarlo con datos reales de un tenant con requisitos de compliance.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Pegar una credencial o connection string real en un prompt | Buscar que el modelo "entienda mejor" el contexto | Usar siempre un placeholder; los valores reales nunca entran a un prompt |
| Compartir datos reales de clientes como ejemplo | No considerar el prompt como un canal de exposición de datos | Anonimizar/ficcionalizar cualquier dato de ejemplo antes de compartirlo |
| Asumir que todos los proveedores de IA cumplen automáticamente la política de residencia del tenant | No verificar la documentación del proveedor | Confirmar explícitamente dónde procesa datos el proveedor antes de usarlo con datos sensibles |

### 🧪 Criterios de Validación
- [ ] Identifico y corrijo un dato sensible en un prompt propio de un módulo anterior
- [ ] Documento la política de retención/residencia de datos de al menos una herramienta de IA que uso
- [ ] Reviso la configuración DLP de un entorno respecto a conectores/IA generativa
```

- [ ] **Step 13: Create module 50**

Write `app-elearning/content/modules/ia/50-tests-cicd-y-guardrails.md`:

```markdown
---
moduleId: 50
title: "Tests, CI/CD y Guardrails para Código Generado por IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "tests-cicd-y-guardrails"
---
### 🎯 Objetivo
Exigir tests automatizados y gates de CI/CD para cualquier código generado con asistencia de IA, usando linters, type-checkers y feature flags como red de seguridad antes de llegar a producción.

### 📖 Conceptos Clave
- **Tests como contrato, no como formalidad:** un test que valida el comportamiento esperado (no solo que el código "compile") es la única forma objetiva de confirmar que un cambio generado por IA hace lo que se pidió, incluso cuando el revisor humano no detectó un problema a simple vista.
- **Gates de CI:** pasos obligatorios (lint, typecheck, tests, build) que deben pasar antes de fusionar un cambio — el mismo pipeline que ya usa este proyecto (`ci.yml`: Lint & Type Check → Unit Tests → Playwright Smoke → Build → Deploy) es el guardrail que atrapa errores de código generado por IA igual que errores de código escrito a mano.
- **Linters y type-checkers como red de seguridad:** ESLint y `tsc --noEmit` detectan patrones inseguros (variables sin usar, tipos incorrectos) sin necesidad de que un humano los note manualmente — código generado por IA se beneficia igual de esta red.
- **Feature flags para cambios asistidos:** desplegar un cambio generado con IA detrás de un flag (o en un entorno de pruebas separado antes de producción) permite revertirlo sin un despliegue de emergencia si se detecta un problema después del release.
- **Cobertura de tests como métrica de confianza:** un cambio que reduce la cobertura de tests existente es una señal de alerta, generado por IA o no — el umbral de cobertura configurado en el proyecto (80% en `vitest.config.ts`) aplica igual a código asistido por IA.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Toma un cambio generado por un agente en un módulo anterior (44 o 45) y escribe al menos un test que valide su comportamiento esperado, si no lo tiene ya.
2. Ejecuta `npm run lint && npx tsc --noEmit && npm run test:coverage` sobre ese cambio y confirma que pasa los 3 gates antes de considerarlo terminado.
3. Identifica en `.github/workflows/ci.yml` de este proyecto cuáles son los gates obligatorios antes de un deploy y explica con tus palabras qué atraparía cada uno si un cambio generado por IA introdujera un error.
4. Diseña (en texto, sin implementarlo) cómo desplegarías detrás de un feature flag un cambio de alto riesgo generado con asistencia de IA en un flujo de aprobación real.

### 💼 Casos Reales de Negocio
Un equipo de SIT fusionó directamente a producción un cambio generado por un agente que "pasaba visualmente bien" en una prueba manual, sin agregar tests ni pasar por el pipeline de CI completo (lo hicieron manualmente fuera del flujo normal, saltándose el pipeline "para ir rápido"). El cambio introdujo una regresión en un cálculo de descuentos que no se detectó hasta que un cliente reportó una factura incorrecta. La política adoptada después: ningún cambio, generado por IA o no, se fusiona sin pasar por el pipeline de CI completo — sin excepciones por "urgencia".

### ✅ Buenas Prácticas
- Exigir al menos un test que valide el comportamiento esperado para todo cambio generado con IA antes de darlo por terminado.
- No saltarse nunca el pipeline de CI (lint, typecheck, tests, build) "para ir más rápido", ni siquiera en cambios generados por IA que parecen simples.
- Considerar feature flags o despliegue progresivo para cambios de alto riesgo asistidos por IA, permitiendo reversión rápida.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Fusionar un cambio generado por IA sin pasar por el pipeline de CI completo | Presión de tiempo o confianza excesiva en que "se ve bien" | Ningún cambio se fusiona sin pasar los gates de CI, sin excepciones |
| No agregar tests a un cambio generado por IA porque "ya funcionó en la prueba manual" | Confundir una prueba manual puntual con una validación repetible | Exigir al menos un test automatizado que reproduzca el comportamiento esperado |
| Desplegar directamente a producción un cambio de alto riesgo generado por IA | No usar feature flags ni despliegue progresivo | Usar flags o rollout gradual en cambios de alto riesgo, generados por IA o no |

### 🧪 Criterios de Validación
- [ ] Agrego un test de validación a un cambio generado por IA de un módulo anterior
- [ ] Confirmo que un cambio pasa los 3 gates locales (lint, typecheck, test:coverage) antes de darlo por terminado
- [ ] Explico qué gate del pipeline de CI de este proyecto atraparía un error específico introducido por IA
```

- [ ] **Step 14: Create module 51 (capstone)**

Write `app-elearning/content/modules/ia/51-flujo-recomendado-humano-ia-ci.md`:

```markdown
---
moduleId: 51
title: "Flujo Recomendado: Humano Diseña, IA Implementa, CI Valida, Humano Aprueba"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 10
slug: "flujo-recomendado-humano-ia-ci"
---
### 🎯 Objetivo
Aplicar de punta a punta el flujo recomendado de desarrollo asistido por IA — humano diseña, IA implementa, CI valida, humano aprueba — sobre un caso realista, integrando lo aprendido en los módulos 42-50.

### 📖 Conceptos Clave
- **Humano diseña:** la persona define el problema, el alcance y el criterio de éxito antes de involucrar a la IA — esta etapa no se delega (Módulo 45: tareas acotadas y verificables).
- **IA implementa:** el agente o asistente genera el cambio dentro del alcance definido, usando prompts reutilizables cuando aplica (Módulo 47) y evitando vibe coding sin control en tareas de riesgo (Módulo 46).
- **CI valida:** el pipeline (lint, typecheck, tests, build) confirma objetivamente que el cambio no rompe nada existente (Módulo 50) — esta etapa nunca se salta, sin importar cuán simple parezca el cambio.
- **Humano aprueba:** una persona revisa el diff completo contra el criterio de éxito original, verificando alcance, efectos secundarios y seguridad (Módulo 48), antes de fusionar — la aprobación es la última barrera, no un trámite.
- **El ciclo se repite, no se acorta:** ante un resultado insatisfactorio en cualquier etapa, se vuelve a la etapa anterior (ej. si CI falla, se ajusta la implementación; si la implementación no cumple el criterio, se re-especifica el diseño) — nunca se salta una etapa para "avanzar más rápido".

### 👨‍💻 Actividades Prácticas Paso a Paso
1. **Diseña:** elige una mejora pequeña y real en este mismo repositorio (ej. un mensaje de error más claro en un componente, o un test faltante) y escribe el criterio de éxito en una frase verificable.
2. **Implementa:** usando una plantilla de prompt (Módulo 47) o una instrucción acotada a un agente (Módulo 45), genera el cambio dentro del alcance definido.
3. **Valida:** ejecuta `npm run lint`, `npx tsc --noEmit` y `npx vitest run` (o el subconjunto relevante) sobre el cambio, y corrige cualquier falla antes de continuar.
4. **Aprueba:** revisa el diff completo con la checklist del Módulo 48 (alcance, efectos secundarios, seguridad, tests) como si fueras un segundo revisor, y documenta explícitamente por qué lo apruebas o qué le falta.
5. Escribe un resumen de una página del ciclo completo que seguiste, identificando en qué etapa (si alguna) tuviste que devolverte a un paso anterior.

### 💼 Casos Reales de Negocio
El equipo de plataforma de SIT adoptó este flujo de 4 etapas como estándar después de dos incidentes previos (Módulos 46 y 50) causados por saltarse la validación de CI o la aprobación humana "para ir más rápido". Al medir los primeros 3 meses con el flujo completo aplicado sin excepciones, el número de regresiones detectadas en producción bajó de forma medible, y el tiempo total por cambio (diseño + implementación + validación + aprobación) resultó comparable al proceso anterior sin IA — la ganancia no fue "saltarse pasos", sino reducir el tiempo de la etapa de implementación manteniendo intactas las etapas de validación y aprobación humana.

### ✅ Buenas Prácticas
- Nunca saltar una etapa del ciclo, sin importar cuán simple parezca el cambio o cuánta prisa haya.
- Medir el flujo completo (no solo la velocidad de generación de código) para saber si realmente está funcionando en el equipo.
- Tratar cada etapa como un gate independiente: un cambio no avanza a la siguiente etapa hasta que la anterior se cumple satisfactoriamente.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Saltarse la etapa de "humano aprueba" cuando el cambio "se ve simple" | Confundir simplicidad aparente con ausencia de riesgo | Aplicar la aprobación humana de forma consistente, sin excepciones por tamaño percibido |
| Medir solo la velocidad de generación de código como éxito del flujo | Ignorar el costo de regresiones no detectadas | Medir el flujo completo, incluyendo incidentes evitados, no solo velocidad de la etapa de implementación |
| Re-especificar el diseño a mitad de la implementación en lugar de volver a la etapa de diseño explícitamente | Ajustar el alcance sobre la marcha sin documentarlo | Si el criterio de éxito cambia, volver formalmente a la etapa de diseño antes de continuar |

### 🧪 Criterios de Validación
- [ ] Completo el ciclo de las 4 etapas sobre un cambio real en este repositorio
- [ ] Documento en qué etapa (si alguna) tuve que devolverme a un paso anterior y por qué
- [ ] El cambio final pasa lint, typecheck y tests antes de considerarse aprobado
- [ ] Escribo el resumen de una página del ciclo aplicado
```

- [ ] **Step 15: Run lint/typecheck again over the full set**

Run: `cd app-elearning && npm run lint && npx tsc --noEmit`
Expected: no output (both succeed).

- [ ] **Step 16: Commit modules 49-51**

```bash
git add app-elearning/content/modules/ia/49-seguridad-secretos-y-compliance.md app-elearning/content/modules/ia/50-tests-cicd-y-guardrails.md app-elearning/content/modules/ia/51-flujo-recomendado-humano-ia-ci.md
git commit -m "feat: agregar módulos 49-51 del nivel IA (seguridad/compliance, tests/CI/CD, flujo recomendado capstone)"
```

---

### Task 7: Add 80 questions (8 per module) to the question bank

**Files:**
- Modify: `docs/javascripts/evaluaciones-simulador.js`

**Interfaces:**
- Consumes: nothing new — same `MODULE_QUESTIONS` object, same `{ type, prompt, options, answer, explanation }` shape already used for keys 1-41.
- Produces: keys `42`-`51` in `MODULE_QUESTIONS`, each an array of 8 questions. `scripts/extract-questions.mjs` (already generic, no changes needed) regenerates `app-elearning/src/data/questions.ts` from this file at `prebuild` time — Task 9 verifies this end-to-end.

The file currently ends with the module `41` array closing and the top-level object closing:
```javascript
  41: [
    ...
  ]
};
```

- [ ] **Step 1: Add modules 42-44 (24 questions)**

In `docs/javascripts/evaluaciones-simulador.js`, find the closing of module `41`'s array (`  ]` immediately followed by the final `};`) and change it to continue the object with the new keys. Replace:

```javascript
  ]
};
```

with:

```javascript
  ],
  42: [
    {
      type: "single",
      prompt: "¿Cuál de las siguientes opciones describe mejor a un 'agente' de código frente a un simple chat de IA?",
      options: [
        "Un agente puede usar herramientas (leer archivos, ejecutar comandos, editar código) encadenando pasos; un chat solo responde texto",
        "Un agente y un chat son exactamente lo mismo, solo cambia el nombre comercial",
        "Un chat siempre es más preciso que un agente porque no ejecuta nada",
        "Un agente solo funciona sin conexión a internet"
      ],
      answer: [0],
      explanation: "Un agente de código puede usar herramientas para leer, buscar y editar archivos o ejecutar comandos de forma encadenada, mientras que un chat sin herramientas solo devuelve texto que el humano debe aplicar manualmente."
    },
    {
      type: "single",
      prompt: "Un modelo de IA genera código que llama a una función de una tabla de Dataverse que en realidad no existe en tu entorno. ¿Cómo se llama este fenómeno y qué se debe hacer?",
      options: [
        "Es una alucinación; siempre verificar contra el esquema real antes de aceptar el código",
        "Es un bug del editor de código, no del modelo",
        "Es normal y no requiere verificación porque el modelo siempre tiene el esquema actualizado",
        "Solo ocurre con modelos antiguos y ya no sucede con los más recientes"
      ],
      answer: [0],
      explanation: "Las alucinaciones son una consecuencia esperada de cómo funcionan los LLM, no un bug puntual; el código generado siempre debe verificarse contra el esquema o la documentación real antes de aceptarlo."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS elementos mejoran la precisión de una respuesta de IA al generar código para Power Fx?",
      options: [
        "Especificar explícitamente el lenguaje y la plataforma (Power Fx, Canvas Apps)",
        "Dar contexto adicional relevante (ej. el control específico donde se usará la fórmula)",
        "Omitir cualquier detalle para que el modelo 'adivine' mejor",
        "Pedir la respuesta en el idioma menos usado posible"
      ],
      answer: [0, 1],
      explanation: "Especificar lenguaje/plataforma y dar contexto relevante reducen la ambigüedad y mejoran la precisión de la respuesta; omitir detalles produce respuestas más genéricas y propensas a error."
    },
    {
      type: "single",
      prompt: "¿Por qué la misma pregunta a un modelo de IA puede producir respuestas distintas en ejecuciones diferentes?",
      options: [
        "Por la naturaleza no determinista relativa del modelo, lo cual exige siempre revisión humana antes de aceptar cambios en producción",
        "Porque el modelo cambia de versión cada vez que se le pregunta algo",
        "Porque hay un error de red que corrompe la respuesta",
        "Esto nunca ocurre; los modelos son 100% deterministas"
      ],
      answer: [0],
      explanation: "Los LLM tienen un componente no determinista relativo; la misma pregunta puede variar de respuesta entre ejecuciones, por lo que la revisión humana es indispensable antes de aceptar cualquier cambio en código de producción."
    },
    {
      type: "single",
      prompt: "¿Qué caracteriza al autocompletado (como GitHub Copilot inline) frente a un chat o un agente?",
      options: [
        "Sugiere la continuación del código mientras se escribe, basado en el archivo actual y archivos abiertos relacionados",
        "Ejecuta comandos de terminal de forma autónoma sin intervención humana",
        "Solo funciona para lenguajes de programación compilados",
        "Reemplaza completamente la necesidad de revisar el código generado"
      ],
      answer: [0],
      explanation: "El autocompletado sugiere la siguiente línea o bloque mientras se escribe, usando como contexto el archivo actual y archivos relacionados abiertos, a diferencia del chat (responde preguntas) o el agente (ejecuta herramientas)."
    },
    {
      type: "single",
      prompt: "Un desarrollador acepta un plugin C# generado por IA sin revisar que llama a la API de Dataverse en modo síncrono dentro de un bucle. ¿Qué principio de este módulo se violó?",
      options: [
        "Tratar todo código generado como un borrador que requiere verificación contra buenas prácticas conocidas, no como resultado final",
        "El principio de nunca usar IA para generar plugins C#",
        "El principio de que la IA siempre debe usarse en modo offline",
        "No se violó ningún principio; el Solution Checker ya garantiza que el código es correcto"
      ],
      answer: [0],
      explanation: "El Solution Checker valida ciertos aspectos, pero no sustituye la revisión humana de patrones de rendimiento conocidos; todo código generado por IA debe tratarse como un borrador a verificar."
    },
    {
      type: "single",
      prompt: "¿Qué es la 'ventana de contexto' de un modelo de lenguaje aplicado a código?",
      options: [
        "El límite de tokens (texto) que el modelo puede recibir y considerar al generar una respuesta",
        "La cantidad de archivos que un editor puede tener abiertos simultáneamente",
        "El tiempo máximo que puede tardar una respuesta antes de expirar",
        "El número de líneas de código que el modelo puede escribir por respuesta"
      ],
      answer: [0],
      explanation: "La ventana de contexto es el límite de tokens que el modelo puede procesar como entrada; en repositorios grandes hay que decidir qué contexto relevante mostrarle dentro de ese límite."
    },
    {
      type: "single",
      prompt: "¿Cuál es el riesgo principal de tratar la primera respuesta de un modelo de IA como definitiva?",
      options: [
        "Puede no ser la mejor opción disponible dado el componente no determinista del modelo; conviene iterar y comparar antes de decidir",
        "Ninguno; la primera respuesta siempre es la más precisa",
        "Que consume más tokens que las respuestas posteriores",
        "Que el modelo se bloquea si se le pide una segunda respuesta"
      ],
      answer: [0],
      explanation: "Dada la naturaleza no determinista relativa de los modelos, conviene iterar el prompt y comparar 2-3 respuestas antes de asumir que la primera es la mejor opción."
    }
  ],
  43: [
    {
      type: "single",
      prompt: "¿Qué hace 'Crear con Copilot' en Power Apps Studio?",
      options: [
        "Genera una app Canvas a partir de una descripción en lenguaje natural, como punto de partida a ajustar",
        "Publica automáticamente la app a producción sin revisión",
        "Solo funciona para Model-Driven Apps, no para Canvas",
        "Reemplaza por completo la necesidad de un maker en el proyecto"
      ],
      answer: [0],
      explanation: "Copilot en Power Apps genera un boceto funcional de app Canvas a partir de una descripción, que casi siempre requiere ajustes de UX, manejo de errores y performance antes de publicarse."
    },
    {
      type: "single",
      prompt: "Un Power Platform Admin quiere habilitar Copilot en Power Apps para todo el tenant. ¿Qué debería revisar primero según las buenas prácticas de este módulo?",
      options: [
        "La política DLP y la clasificación de datos de cada entorno, habilitando Copilot entorno por entorno",
        "Nada; Copilot siempre es seguro habilitarlo para todo el tenant de inmediato",
        "Solo el número de licencias disponibles",
        "El idioma predeterminado del tenant"
      ],
      answer: [0],
      explanation: "Habilitar Copilot sin revisar la política DLP y la clasificación de datos de cada entorno puede exponer información sensible en sugerencias generadas; la recomendación es revisar y habilitar entorno por entorno."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS afirmaciones distinguen correctamente a Copilot Studio de Copilot en Power Apps/Automate?",
      options: [
        "Copilot Studio construye agentes conversacionales que el usuario final interactúa directamente",
        "Copilot en Power Apps/Automate asiste al maker durante la construcción, no al usuario final",
        "Copilot Studio y Copilot en Power Apps son exactamente la misma herramienta con otro nombre",
        "Copilot en Power Automate solo puede explicar flujos, nunca generarlos"
      ],
      answer: [0, 1],
      explanation: "Copilot Studio construye agentes que interactúan con el usuario final, mientras que Copilot en Power Apps/Automate asiste al maker durante la construcción de la solución; son roles distintos dentro del ecosistema."
    },
    {
      type: "single",
      prompt: "¿Qué debe hacerse siempre antes de publicar en producción una app o flujo generado por Copilot?",
      options: [
        "Revisar manejo de errores, seguridad y rendimiento, tratándolo como un primer borrador",
        "Nada adicional; el resultado de Copilot ya está listo para producción",
        "Solo verificar que compile sin errores de sintaxis",
        "Esperar 24 horas antes de publicar, sin revisión adicional"
      ],
      answer: [0],
      explanation: "Cualquier app o flujo generado por Copilot debe tratarse como un primer borrador funcional, revisando manejo de errores, seguridad y rendimiento antes de publicarlo."
    },
    {
      type: "single",
      prompt: "¿Qué usa 'generative answers' en Copilot Studio para responder preguntas del usuario final?",
      options: [
        "Fuentes de conocimiento configuradas (SharePoint, sitios web, Dataverse) ya validadas y con control de acceso correcto",
        "Únicamente el conocimiento general del modelo sin ninguna fuente configurada",
        "Los flujos de Power Automate del entorno, sin relación con fuentes de conocimiento",
        "Un archivo de configuración que el usuario final edita directamente"
      ],
      answer: [0],
      explanation: "Generative answers en Copilot Studio responde usando fuentes de conocimiento configuradas por el equipo, que deben estar validadas y con el control de acceso correcto para evitar exponer información indebida."
    },
    {
      type: "single",
      prompt: "¿Dónde se configura la gobernanza de Copilot a nivel de entorno en Power Platform?",
      options: [
        "En el Power Platform Admin Center",
        "Únicamente dentro del editor de Power Apps Studio",
        "En el archivo de configuración local de cada desarrollador",
        "No existe forma de configurar esto; Copilot está siempre activo igual en todos los entornos"
      ],
      answer: [0],
      explanation: "El Power Platform Admin Center permite configurar la gobernanza de Copilot y las políticas DLP por entorno, controlando qué datos y conectores están disponibles para las funciones de IA generativa."
    },
    {
      type: "single",
      prompt: "Un maker pide a Copilot en Power Automate 'cuando se cree un registro en una tabla, enviar un correo al responsable'. ¿Qué se espera que haga Copilot?",
      options: [
        "Proponer un flujo con el trigger y las acciones correspondientes, como borrador a revisar",
        "Ejecutar el envío de correos inmediatamente sin crear ningún flujo",
        "Rechazar la solicitud porque requiere código personalizado",
        "Crear automáticamente un plugin C# en lugar de un flujo"
      ],
      answer: [0],
      explanation: "Copilot en Power Automate propone un flujo (trigger + acciones) a partir de la descripción en lenguaje natural, que el maker debe revisar y ajustar antes de publicarlo."
    },
    {
      type: "single",
      prompt: "¿Cuál es el riesgo principal de que una fórmula generada por Copilot en el editor de Power Apps incluya nombres reales de columnas de una tabla confidencial?",
      options: [
        "Esos nombres pueden quedar expuestos si la fórmula se comparte (ej. en una captura de pantalla) sin que el maker lo note",
        "Ningún riesgo; los nombres de columnas nunca son información sensible",
        "Solo afecta el rendimiento de la app, no la seguridad de los datos",
        "Este riesgo solo existe en Model-Driven Apps, no en Canvas"
      ],
      answer: [0],
      explanation: "Los nombres de columnas reales sugeridos por Copilot pueden exponer estructura de datos confidenciales si se comparten externamente sin revisión, por lo que la gobernanza de datos por entorno es clave antes de habilitar Copilot ampliamente."
    }
  ],
  44: [
    {
      type: "single",
      prompt: "¿Qué diferencia principal hay entre el autocompletado inline de GitHub Copilot y Copilot Edits (Agent Mode)?",
      options: [
        "Copilot Edits puede proponer y aplicar cambios a través de múltiples archivos, mostrando el diff antes de aceptarlo; el autocompletado solo sugiere la línea actual",
        "No hay ninguna diferencia real entre ambos",
        "El autocompletado solo funciona en archivos Python",
        "Copilot Edits nunca muestra un diff, aplica los cambios directamente sin revisión"
      ],
      answer: [0],
      explanation: "El autocompletado sugiere la continuación de una línea mientras se escribe; Copilot Edits/Agent Mode puede proponer cambios en múltiples archivos y muestra el diff para revisión antes de aplicarlo."
    },
    {
      type: "single",
      prompt: "¿Qué función cumple el archivo `.github/copilot-instructions.md` en un proyecto?",
      options: [
        "Fija convenciones del proyecto (ej. prefijos de Dataverse, patrón de logging) que Copilot lee automáticamente como contexto",
        "Configura las credenciales de GitHub del equipo",
        "Reemplaza el archivo `package.json` del proyecto",
        "Solo tiene efecto si se ejecuta manualmente como script"
      ],
      answer: [0],
      explanation: "`.github/copilot-instructions.md` centraliza convenciones propias del repositorio que Copilot usa como contexto automáticamente, evitando repetir esas instrucciones en cada prompt."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS factores mejoran la precisión de una sugerencia de Copilot sobre un componente PCF específico?",
      options: [
        "Tener abierto el archivo real del componente como contexto",
        "Documentar convenciones del proyecto en `.github/copilot-instructions.md`",
        "Cerrar todos los archivos del proyecto antes de pedir la sugerencia",
        "Pedir la sugerencia en un archivo completamente vacío sin relación al componente"
      ],
      answer: [0, 1],
      explanation: "Tener el archivo real abierto y documentar convenciones del proyecto le dan a Copilot el contexto necesario para generar sugerencias más precisas y consistentes con el patrón del repositorio."
    },
    {
      type: "single",
      prompt: "Un plugin C# generado con Copilot Chat usó `Console.WriteLine` para logging en lugar de `ITracingService`. ¿Cuál fue la causa raíz según el caso de este módulo?",
      options: [
        "No se le dio a Copilot el contexto del patrón de logging ya establecido en el proyecto",
        "`Console.WriteLine` es la forma correcta de hacer logging en plugins de Dataverse",
        "Copilot Chat no puede generar código C# válido",
        "El error fue causado por una falla del Solution Checker"
      ],
      answer: [0],
      explanation: "Sin el contexto del patrón de logging ya establecido (ej. un archivo de referencia o `.github/copilot-instructions.md`), Copilot generó una alternativa sintácticamente válida pero incorrecta para el contexto de un plugin de Dataverse."
    },
    {
      type: "single",
      prompt: "¿Qué se debe hacer siempre antes de aplicar un cambio propuesto por Copilot Edits que afecta varios archivos?",
      options: [
        "Revisar el diff de cada archivo modificado antes de aceptar",
        "Aceptar directamente si el resumen general suena razonable",
        "Aplicar solo el primer archivo del diff y descartar el resto",
        "No es necesario revisar nada si el proyecto tiene buena cobertura de tests"
      ],
      answer: [0],
      explanation: "Nunca se deben aceptar cambios multi-archivo a ciegas; revisar el diff completo de cada archivo modificado es indispensable antes de aplicar cambios de Copilot Edits."
    },
    {
      type: "single",
      prompt: "¿Qué usa Copilot como contexto de workspace al generar sugerencias en VS Code?",
      options: [
        "Los archivos abiertos, el árbol del proyecto y, según configuración, el repositorio completo",
        "Únicamente el nombre del proyecto, sin acceso a ningún archivo",
        "Solo el archivo activo, ignorando cualquier otro archivo abierto",
        "Una copia local descargada de todo GitHub"
      ],
      answer: [0],
      explanation: "El contexto de workspace incluye archivos abiertos, la estructura del proyecto y, según configuración, el repositorio — mientras más específico y relevante el contexto abierto, más preciso el resultado."
    },
    {
      type: "single",
      prompt: "¿Cuál es el propósito de Copilot Chat frente al autocompletado inline?",
      options: [
        "Permite hacer preguntas sobre el código abierto o pedir explicaciones/generación de bloques específicos sin tocar directamente el archivo",
        "Ejecuta pruebas unitarias automáticamente sin intervención",
        "Reemplaza la necesidad de tener el editor abierto",
        "Solo puede usarse para traducir comentarios de código"
      ],
      answer: [0],
      explanation: "Copilot Chat es un panel de conversación para preguntas y generación de bloques específicos, distinto del autocompletado que sugiere directamente dentro del flujo de escritura del código."
    },
    {
      type: "single",
      prompt: "Después de crear un `.github/copilot-instructions.md` con las convenciones del proyecto, ¿qué se espera al repetir una petición de generación de código similar?",
      options: [
        "Una mejora en la precisión y consistencia de la sugerencia respecto al patrón del proyecto",
        "Ningún cambio; el archivo de instrucciones no afecta las sugerencias de Copilot",
        "Que Copilot deje de funcionar hasta borrar el archivo",
        "Que las sugerencias empeoren porque el archivo consume la ventana de contexto por completo"
      ],
      answer: [0],
      explanation: "El archivo de instrucciones del repositorio se usa como contexto automático, mejorando la consistencia de las sugerencias con las convenciones ya establecidas del proyecto."
    }
  ],
  45: [
    {
      type: "single",
      prompt: "¿Qué distingue a un agente de código (Claude Code, Codex) de un simple chat con IA?",
      options: [
        "Puede usar herramientas (leer archivos, buscar en el repo, ejecutar comandos) encadenando pasos sin copiar/pegar manual",
        "Solo puede responder preguntas de una línea",
        "Nunca puede modificar archivos directamente",
        "Requiere que el humano ejecute cada comando manualmente después de cada respuesta"
      ],
      answer: [0],
      explanation: "Un agente de código usa herramientas para leer, buscar, ejecutar y editar de forma encadenada, a diferencia de un chat que solo devuelve texto que el humano debe aplicar manualmente."
    },
    {
      type: "single",
      prompt: "¿Qué tipo de tarea rinde mejor al delegarla a un agente de código, según este módulo?",
      options: [
        "Una tarea acotada y verificable, con un objetivo y criterio de éxito claros",
        "Una instrucción vaga como 'mejora el proyecto'",
        "Una tarea sin ningún criterio de éxito definido",
        "Cualquier tarea, sin importar el nivel de detalle de la instrucción"
      ],
      answer: [0],
      explanation: "Los agentes rinden mejor con tareas acotadas y verificables; instrucciones vagas producen resultados extensos, difíciles de revisar y potencialmente fuera de alcance."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS acciones ayudan a delegar una tarea de forma segura a un agente de código?",
      options: [
        "Definir el archivo/función objetivo y el criterio de éxito antes de delegar",
        "Pedir que el agente ejecute la verificación disponible (tests, lint) como parte de la tarea",
        "Evitar cualquier verificación para no 'perder tiempo'",
        "Dar la instrucción más general posible para que el agente decida todo"
      ],
      answer: [0, 1],
      explanation: "Definir el alcance/criterio de éxito y exigir verificación automática como parte de la tarea son las dos prácticas que reducen el riesgo de un resultado inmanejable o incorrecto."
    },
    {
      type: "single",
      prompt: "Un arquitecto le pidió a un agente 'optimiza el proyecto' sin más contexto, y recibió un PR de 40 archivos imposible de revisar. ¿Cuál fue la causa raíz?",
      options: [
        "Falta de alcance explícito y criterio de éxito verificable en la instrucción",
        "Un error del agente que no tiene solución posible",
        "El agente no tenía permisos suficientes",
        "El repositorio era demasiado pequeño para el agente"
      ],
      answer: [0],
      explanation: "Una instrucción vaga sin alcance ni criterio de éxito lleva a cambios extensos e inmanejables; delegar tareas acotadas y verificables evita este problema."
    },
    {
      type: "single",
      prompt: "¿Qué ventaja tiene pedirle a un agente que busque 'todos los archivos donde se recorre `LEVEL_ORDER`' frente a hacer esa búsqueda manualmente?",
      options: [
        "El agente puede explorar la estructura completa del repo y encadenar la búsqueda con análisis adicional sin copiar/pegar manual entre pasos",
        "No hay ninguna ventaja real, ambos métodos son idénticos",
        "Una búsqueda manual siempre es más precisa que la de un agente",
        "El agente no puede realizar búsquedas de texto en archivos"
      ],
      answer: [0],
      explanation: "Un agente puede explorar el repositorio y encadenar pasos (buscar, analizar, proponer cambios) de forma autónoma, algo que una búsqueda manual sin herramientas automatizadas no logra en un solo flujo."
    },
    {
      type: "single",
      prompt: "¿Qué se recomienda pedirle a un agente después de aplicar un cambio, antes de darlo por terminado?",
      options: [
        "Que ejecute la verificación disponible (por ejemplo `npm run lint`) y muestre el resultado, no solo el código",
        "Nada adicional; el código generado siempre es correcto",
        "Que elimine todos los tests existentes del proyecto",
        "Que genere documentación extensa sin relación con el cambio"
      ],
      answer: [0],
      explanation: "Pedir la ejecución explícita de la verificación disponible (tests, lint) como parte de la tarea da más confianza que un agente que solo entrega código sin ejecutar nada."
    },
    {
      type: "single",
      prompt: "¿Qué patrón general comparten Claude Code y Codex como agentes de código, según este módulo?",
      options: [
        "Un modelo de plan → ejecución → verificación, requiriendo que el humano defina el alcance y revise el resultado final",
        "Ambos operan exclusivamente sin ningún tipo de supervisión humana posible",
        "Ambos solo pueden trabajar con un archivo a la vez",
        "Ninguno de los dos puede ejecutar comandos de terminal"
      ],
      answer: [0],
      explanation: "Ambos agentes siguen un patrón de plan, ejecución y verificación, pero requieren que el humano defina el alcance de la tarea y revise el resultado final antes de aceptarlo."
    },
    {
      type: "single",
      prompt: "¿Por qué un repositorio grande (monorepo) se beneficia especialmente de un agente con herramientas frente a un chat sin ellas?",
      options: [
        "Porque el agente puede explorar la estructura y encontrar patrones repetidos en múltiples archivos antes de proponer un cambio coherente",
        "Porque un chat sin herramientas es siempre más rápido en repos grandes",
        "Porque los repos grandes no pueden usarse con IA de ningún tipo",
        "Porque el tamaño del repo no afecta en nada la calidad de las respuestas"
      ],
      answer: [0],
      explanation: "En un monorepo, un agente con herramientas puede explorar y correlacionar múltiples archivos (ej. cada `Record<LevelId, ...>`) antes de proponer un cambio, algo que un chat sin herramientas no puede hacer por sí mismo."
    }
  ],
  46: [
    {
      type: "single",
      prompt: "¿Qué es 'vibe coding' según este módulo?",
      options: [
        "Dejar que un modelo genere una implementación completa a partir de una descripción de alto nivel, iterando sobre el resultado",
        "Un método formal de certificación de código generado por IA",
        "Escribir código exclusivamente a mano sin ninguna ayuda de IA",
        "Un tipo de test automatizado específico de Power Platform"
      ],
      answer: [0],
      explanation: "Vibe coding es dejar que el modelo genere una implementación completa a partir de una descripción de alto nivel, ajustando el resultado de forma iterativa en lugar de especificar cada detalle por adelantado."
    },
    {
      type: "multi",
      prompt: "¿En cuáles DOS escenarios es aceptable usar vibe coding sin controles adicionales estrictos, según este módulo?",
      options: [
        "Un prototipo descartable para explorar una idea",
        "Un script de un solo uso sin impacto en producción",
        "Una validación de seguridad en un plugin que corre en producción",
        "Lógica de negocio con impacto financiero directo"
      ],
      answer: [0, 1],
      explanation: "Prototipos descartables y scripts de un solo uso son escenarios de bajo riesgo aptos para vibe coding; validaciones de seguridad y lógica financiera requieren controles estrictos (tests, revisión humana) antes de aceptarse."
    },
    {
      type: "single",
      prompt: "¿Cuáles son los controles mínimos que hacen seguro el vibe coding, según este módulo?",
      options: [
        "Alcance acotado, tests que validen el comportamiento esperado, y revisión humana antes de fusionar",
        "Ningún control es necesario si el resultado 'se ve bien'",
        "Solo que el código compile sin errores de sintaxis",
        "Que el prompt haya sido largo y detallado"
      ],
      answer: [0],
      explanation: "Alcance acotado, tests de comportamiento y revisión humana obligatoria son los mismos controles que ya exige este plan de estudio para cualquier cambio, y se vuelven más críticos en vibe coding."
    },
    {
      type: "single",
      prompt: "Un maker publicó a producción un flujo de aprobación de gastos generado con vibe coding sin revisión detallada, causando pagos duplicados por una condición de carrera. ¿Qué regla adoptó el equipo después?",
      options: [
        "Todo flujo generado sin revisión detallada pasa primero por un ambiente de pruebas y una revisión de un segundo maker",
        "Prohibir el uso de Power Automate en todo el tenant",
        "Ninguna regla nueva; el incidente fue un caso aislado sin solución",
        "Solo revisar visualmente el flujo, sin pruebas adicionales"
      ],
      answer: [0],
      explanation: "La regla adoptada fue exigir ambiente de pruebas con datos simulados y revisión de un segundo maker antes de publicar cualquier flujo generado sin revisión detallada."
    },
    {
      type: "single",
      prompt: "¿Vibe coding elimina la necesidad de tests y revisión humana?",
      options: [
        "No; los vuelve más críticos porque el humano invirtió menos tiempo revisando cada línea mientras se escribía",
        "Sí, siempre que el modelo usado sea reciente",
        "Sí, porque el objetivo de vibe coding es evitar cualquier revisión",
        "Depende únicamente del lenguaje de programación usado"
      ],
      answer: [0],
      explanation: "Vibe coding no elimina la necesidad de tests y revisión humana; al contrario, los vuelve más críticos porque hubo menos revisión línea por línea durante la generación."
    },
    {
      type: "single",
      prompt: "¿Qué distingue el vibe coding del 'desarrollo asistido por IA normal', según este módulo?",
      options: [
        "El nivel de especificación previa: vibe coding parte de una descripción de alto nivel en lugar de detallar cada paso",
        "Vibe coding nunca usa modelos de lenguaje",
        "El desarrollo asistido normal no permite ningún tipo de revisión",
        "No existe ninguna diferencia real entre ambos términos"
      ],
      answer: [0],
      explanation: "La diferencia está en el nivel de especificación previa: vibe coding parte de una descripción de alto nivel e itera sobre el resultado, en lugar de especificar cada detalle desde el inicio."
    },
    {
      type: "single",
      prompt: "¿Cuál de las siguientes tareas es la MENOS apta para vibe coding sin controles estrictos?",
      options: [
        "Una validación de seguridad en un plugin C# que corre en producción",
        "Un script de reformateo de un CSV de prueba",
        "Un prototipo descartable de una idea de UI",
        "Un componente de exploración sin lógica de negocio sensible"
      ],
      answer: [0],
      explanation: "Cualquier cambio que toque seguridad, datos de producción o lógica de negocio sensible requiere controles estrictos (tests, revisión humana) antes de aceptarse, a diferencia de prototipos o scripts descartables."
    },
    {
      type: "single",
      prompt: "¿Por qué se recomienda tener una regla de equipo explícita sobre cuándo se permite vibe coding, en lugar de decidirlo caso por caso?",
      options: [
        "Para evitar decisiones informales inconsistentes y asegurar que los controles mínimos se apliquen siempre en los casos de riesgo",
        "Porque las reglas escritas hacen que el código generado sea automáticamente más rápido",
        "Porque sin una regla escrita, la IA no puede usarse en absoluto",
        "No hay ninguna razón real para documentar esta regla"
      ],
      answer: [0],
      explanation: "Documentar la regla como estándar de equipo evita que la decisión dependa del criterio individual de cada persona en cada momento, asegurando consistencia en la aplicación de controles."
    }
  ],
  47: [
    {
      type: "single",
      prompt: "¿Qué es una plantilla de prompt reutilizable?",
      options: [
        "Una instrucción parametrizable que fija contexto, formato de salida y restricciones, dejando solo los datos específicos como variables",
        "Un archivo de configuración que reemplaza al código fuente",
        "Una función de Power Fx predefinida por Microsoft",
        "Un historial de chat guardado sin ninguna estructura"
      ],
      answer: [0],
      explanation: "Una plantilla de prompt fija contexto, restricciones y formato de salida, parametrizando solo lo que cambia entre usos, para producir resultados consistentes en tareas recurrentes."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS elementos debe incluir una buena plantilla de prompt según este módulo?",
      options: [
        "Restricciones explícitas (qué NO hacer, qué patrón seguir)",
        "El formato de salida esperado (código, diff, lista de pasos)",
        "La mayor cantidad de texto posible sin estructura",
        "Ninguna referencia al contexto o convenciones del proyecto"
      ],
      answer: [0, 1],
      explanation: "Restricciones explícitas y formato de salida esperado son componentes clave de una plantilla efectiva, junto con el rol/contexto y la tarea concreta."
    },
    {
      type: "single",
      prompt: "¿Por qué conviene versionar las plantillas de prompt en el repositorio con git, en lugar de dejarlas solo en el historial de un chat?",
      options: [
        "Porque permiten historial de cambios y evitan perder ajustes útiles cuando dejan de funcionar bien",
        "Porque git ejecuta automáticamente los prompts guardados",
        "Porque el historial de chat siempre se borra automáticamente cada semana",
        "No hay ninguna ventaja real en versionarlas"
      ],
      answer: [0],
      explanation: "Versionar las plantillas en el repositorio permite historial de cambios con git, igual que con el código, en lugar de depender de un historial de chat que se puede perder."
    },
    {
      type: "single",
      prompt: "En SIT, cada desarrollador pedía 'genera un flujo de aprobación' con una instrucción distinta, produciendo flujos inconsistentes. ¿Qué solucionó el problema?",
      options: [
        "Introducir una plantilla común con convención de nombres, patrón de dos aprobadores y manejo de rechazo ya especificados",
        "Prohibir el uso de Power Automate para flujos de aprobación",
        "Pedir a cada desarrollador que memorice el mismo prompt de memoria",
        "Ninguna solución fue posible sin cambiar de plataforma"
      ],
      answer: [0],
      explanation: "Una plantilla común con las convenciones ya especificadas mejoró la consistencia y redujo el tiempo de creación de flujos nuevos entre distintos desarrolladores."
    },
    {
      type: "single",
      prompt: "¿Qué riesgo tiene una plantilla de prompt demasiado rígida?",
      options: [
        "Puede fallar en casos particulares al sobre-especificar cada detalle sin dejar espacio de ajuste",
        "Ninguno; entre más rígida, mejor funciona siempre",
        "Que consuma menos tokens de los necesarios",
        "Que deje de ser compatible con cualquier modelo de IA"
      ],
      answer: [0],
      explanation: "Una plantilla demasiado rígida cubre mal los casos particulares; el balance recomendado es cubrir el caso común como plantilla y dejar el resto para ajuste manual explícito."
    },
    {
      type: "single",
      prompt: "¿Qué parte de una plantilla de prompt se marca típicamente como variable (ej. `{{tabla}}`)?",
      options: [
        "Los datos específicos de cada uso, como el nombre de la tabla o los campos involucrados",
        "Las restricciones generales que nunca cambian entre usos",
        "El formato de salida esperado",
        "El nombre del modelo de IA que se va a usar"
      ],
      answer: [0],
      explanation: "Las variables de una plantilla son los datos específicos de cada tarea (nombre de entidad, campos, condición), mientras que el contexto y las restricciones generales permanecen fijos."
    },
    {
      type: "single",
      prompt: "¿Cuál es el equilibrio recomendado al diseñar una plantilla de prompt?",
      options: [
        "Cubrir el 80% del caso común como plantilla, dejando el 20% restante para ajuste manual",
        "Especificar el 100% de los casos posibles sin dejar ningún ajuste manual",
        "No especificar nada y dejarlo completamente abierto siempre",
        "Cambiar la plantilla completa cada vez que se usa"
      ],
      answer: [0],
      explanation: "Una plantilla útil cubre el caso común (evitando reescribir todo cada vez) sin ser tan rígida que falle en variaciones razonables del caso, dejando ese margen para ajuste manual."
    },
    {
      type: "single",
      prompt: "¿Cuándo se debe actualizar una plantilla de prompt ya guardada en el repositorio?",
      options: [
        "Cuando deja de producir buenos resultados, de forma similar a cuando se refactoriza código",
        "Nunca; una plantilla de prompt es inmutable una vez creada",
        "Solo cuando cambia el proveedor de IA usado, sin importar la calidad del resultado",
        "Cada vez que se usa, sin importar si sigue funcionando bien"
      ],
      answer: [0],
      explanation: "Las plantillas se revisan y actualizan cuando dejan de dar buenos resultados, aplicando el mismo criterio de mantenimiento que se usa para refactorizar código."
    }
  ],
  48: [
    {
      type: "single",
      prompt: "Al revisar un diff generado por IA, ¿qué es lo primero que se debe verificar según este módulo?",
      options: [
        "Si el diff toca solo lo que la tarea pedía, o incluye cambios fuera de alcance",
        "Si el código usa la sintaxis más moderna disponible",
        "Si el número de líneas del diff es menor a 50",
        "Si el diff fue generado por un modelo de pago o gratuito"
      ],
      answer: [0],
      explanation: "Verificar el alcance del diff es el primer paso: un cambio que toca archivos no relacionados con la tarea pedida es una señal de alarma, generado por IA o no."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS aspectos de seguridad se deben revisar con atención especial en un diff generado por IA?",
      options: [
        "Credenciales o secretos hardcodeados",
        "Cambios en Security Roles o permisos de Dataverse",
        "El color de los botones de la interfaz",
        "El número de comentarios en el código"
      ],
      answer: [0, 1],
      explanation: "Secretos hardcodeados y cambios de permisos/Security Roles son riesgos de seguridad concretos que deben revisarse explícitamente en cualquier diff, generado por IA o no."
    },
    {
      type: "single",
      prompt: "¿Qué rol cumple un revisor automático de PRs (como Copilot code review) según este módulo?",
      options: [
        "Es un apoyo que acelera dónde mirar, pero no reemplaza el juicio humano final",
        "Reemplaza por completo la necesidad de revisión humana",
        "Solo sirve para revisar la ortografía de los comentarios",
        "Aprueba automáticamente cualquier PR sin intervención humana"
      ],
      answer: [0],
      explanation: "Los revisores automáticos aceleran encontrar dónde mirar con más atención, pero la aprobación final sigue dependiendo del juicio humano."
    },
    {
      type: "single",
      prompt: "En un caso de SIT, un PR resolvía el bug reportado pero también eliminaba una validación de rango no documentada. ¿Qué regla se adoptó tras ese incidente?",
      options: [
        "Revisar cada línea cambiada contra su propia justificación, no solo contra si el síntoma reportado se resolvió",
        "Dejar de usar IA para generar cualquier PR en el futuro",
        "Aprobar automáticamente cualquier PR que resuelva el bug reportado",
        "Eliminar la revisión de código para acelerar los releases"
      ],
      answer: [0],
      explanation: "La regla adoptada fue revisar el diff completo línea por línea contra su justificación, no solo verificar si el síntoma reportado quedó resuelto."
    },
    {
      type: "single",
      prompt: "¿Por qué se recomienda tener una checklist corta y consistente para revisar diffs, en lugar de revisar 'a ojo'?",
      options: [
        "Para que la calidad de la revisión no dependa del tiempo disponible o el estado de ánimo del revisor ese día",
        "Porque una checklist siempre reduce el número de líneas del diff",
        "Porque sin checklist, git no permite hacer merge del PR",
        "No hay ninguna razón real, es solo una preferencia estética"
      ],
      answer: [0],
      explanation: "Una checklist consistente (alcance, efectos secundarios, seguridad, tests) asegura que la revisión no varíe según el tiempo o disposición del revisor en un momento dado."
    },
    {
      type: "single",
      prompt: "¿Qué se entiende por 'efecto secundario' de un diff generado por IA?",
      options: [
        "Que el cambio resuelva el síntoma pedido pero introduzca un problema distinto (ej. quitar una validación en lugar de corregir la causa)",
        "Que el código tarde más de lo esperado en compilar",
        "Que el diff tenga más de una línea de código",
        "Que el desarrollador tarde más de una hora en escribir el prompt"
      ],
      answer: [0],
      explanation: "Un efecto secundario es un problema distinto introducido al resolver el síntoma pedido, como eliminar una validación existente en lugar de corregir la causa real del bug."
    },
    {
      type: "single",
      prompt: "¿Qué checklist mínima se recomienda aplicar a cualquier diff, generado por IA o no?",
      options: [
        "Alcance, efectos secundarios, seguridad y presencia de tests",
        "Solo el número de archivos modificados",
        "Únicamente el estilo de indentación del código",
        "Solo si el PR tiene más de 100 líneas"
      ],
      answer: [0],
      explanation: "La checklist recomendada cubre alcance, efectos secundarios, seguridad y tests — los cuatro aspectos que este módulo identifica como críticos en cualquier revisión de diff."
    },
    {
      type: "single",
      prompt: "¿Es aceptable aprobar un PR basándose únicamente en el resumen generado por un revisor automático de IA?",
      options: [
        "No; el revisor automático es un apoyo, la aprobación final requiere revisión humana del diff",
        "Sí, siempre que el resumen no mencione errores",
        "Sí, si el PR tiene menos de 10 líneas",
        "Depende únicamente de qué modelo generó el resumen"
      ],
      answer: [0],
      explanation: "El revisor automático acelera encontrar dónde mirar, pero no sustituye el juicio humano final antes de aprobar un PR."
    }
  ],
  49: [
    {
      type: "single",
      prompt: "¿Por qué nunca se debe pegar una credencial real (ej. connection string) en un prompt?",
      options: [
        "Porque puede quedar almacenada en el historial de la herramienta o en logs del proveedor según su política de retención",
        "Porque los prompts tienen un límite de caracteres que impide pegar credenciales",
        "Porque las credenciales siempre se cifran automáticamente al pegarse en un prompt",
        "No hay ningún riesgo real en hacerlo si el prompt se borra después"
      ],
      answer: [0],
      explanation: "Un secreto pegado en un prompt puede persistir en el historial de la herramienta o en logs del proveedor, exponiendo la credencial más allá de la sesión donde se usó."
    },
    {
      type: "single",
      prompt: "¿Qué se debe usar en lugar de datos reales de clientes al construir un ejemplo para compartir con una herramienta de IA?",
      options: [
        "Datos ficticios o anonimizados que preserven la estructura pero no el contenido real",
        "Los mismos datos reales, pero acortados",
        "Datos reales de un cliente distinto al del proyecto actual",
        "No es necesario cambiar nada si el chat es privado"
      ],
      answer: [0],
      explanation: "Usar datos ficticios o anonimizados que preserven la estructura evita exponer información real de clientes al compartir ejemplos con una herramienta de IA."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS aspectos se deben verificar respecto a la residencia y retención de datos antes de usar una herramienta de IA con datos reales de un tenant con requisitos de compliance?",
      options: [
        "En qué región procesa las solicitudes el proveedor del modelo",
        "La política de retención de logs/historial del proveedor",
        "El color del logo de la herramienta",
        "La cantidad de usuarios que tiene licencia en el tenant"
      ],
      answer: [0, 1],
      explanation: "La región de procesamiento y la política de retención de datos del proveedor son los dos aspectos clave a verificar antes de usar IA con datos reales bajo requisitos de residencia o GDPR."
    },
    {
      type: "single",
      prompt: "En el caso de SIT, un desarrollador pegó una cadena de conexión completa con credenciales reales en un prompt. ¿Qué regla adoptó el equipo después del incidente?",
      options: [
        "Ningún secreto real se pega en un prompt; siempre se usan placeholders y los valores reales viven en Environment Variables/Key Vault",
        "Prohibir el uso de cualquier herramienta de IA en el equipo de forma permanente",
        "Cambiar la contraseña cada semana sin ninguna otra medida",
        "Ninguna regla nueva, el incidente no tuvo consecuencias"
      ],
      answer: [0],
      explanation: "La regla adoptada fue usar siempre placeholders en los prompts y mantener los valores reales exclusivamente en Environment Variables o Key Vault, nunca en texto plano en una conversación con IA."
    },
    {
      type: "single",
      prompt: "¿Qué permite configurar el Power Platform Admin Center respecto a IA generativa y conectores por entorno?",
      options: [
        "Políticas DLP que restringen qué conectores e IA generativa están disponibles en cada entorno",
        "Solo el idioma de la interfaz de Power Apps",
        "El número máximo de usuarios que pueden iniciar sesión",
        "No existe ninguna configuración relacionada con IA en el Admin Center"
      ],
      answer: [0],
      explanation: "Las políticas DLP del Admin Center permiten restringir qué conectores e IA generativa están disponibles por entorno, aplicando la misma lógica de gobernanza de datos que a otros conectores."
    },
    {
      type: "single",
      prompt: "¿Por qué los logs de una herramienta de IA son relevantes para la seguridad de secretos?",
      options: [
        "Porque si se pegó un secreto en un prompt, ese secreto persiste también en los logs de auditoría de la herramienta",
        "Porque los logs siempre se eliminan automáticamente cada hora",
        "Porque los logs solo registran el nombre del usuario, nunca el contenido del prompt",
        "Los logs no tienen ninguna relación con la seguridad de secretos"
      ],
      answer: [0],
      explanation: "Si una herramienta registra qué se le pidió, cualquier secreto pegado en un prompt persiste también en esos logs, ampliando la superficie de exposición."
    },
    {
      type: "single",
      prompt: "¿Qué se debe hacer inmediatamente si se detecta que una credencial real fue pegada por error en un prompt?",
      options: [
        "Rotar la credencial de inmediato",
        "Ignorarlo si el chat es privado",
        "Esperar a la próxima auditoría programada para actuar",
        "Solo notificar sin tomar ninguna acción sobre la credencial"
      ],
      answer: [0],
      explanation: "Ante la exposición de una credencial real, la acción inmediata correcta es rotarla, sin importar si el canal donde se expuso parece privado."
    },
    {
      type: "single",
      prompt: "¿Qué principio de gobernanza de datos aplica igual a conectores tradicionales y a herramientas de IA generativa en Power Platform?",
      options: [
        "El control por política DLP y clasificación de datos de cada entorno",
        "Ninguno; la IA generativa está exenta de cualquier política de gobernanza",
        "Solo aplica a conectores premium, no a IA generativa",
        "Solo aplica en entornos de producción, nunca en desarrollo"
      ],
      answer: [0],
      explanation: "La misma lógica de gobernanza de datos (políticas DLP, clasificación de datos por entorno) aplicada a conectores tradicionales debe aplicarse también a las herramientas de IA generativa."
    }
  ],
  50: [
    {
      type: "single",
      prompt: "¿Por qué un test que valida comportamiento es más confiable que solo verificar que el código 'compile', para código generado por IA?",
      options: [
        "Porque confirma objetivamente que el cambio hace lo que se pidió, incluso si el revisor humano no detectó un problema a simple vista",
        "Porque compilar y pasar tests son exactamente la misma verificación",
        "Porque un test siempre es más rápido de escribir que revisar el código",
        "Los tests no aportan ninguna garantía adicional sobre el código generado por IA"
      ],
      answer: [0],
      explanation: "Un test de comportamiento verifica objetivamente el resultado esperado, cubriendo casos que una revisión visual humana podría pasar por alto, especialmente en código generado por IA."
    },
    {
      type: "single",
      prompt: "Según el pipeline de este proyecto (`ci.yml`), ¿cuáles son los gates obligatorios antes de un deploy?",
      options: [
        "Lint & Type Check → Unit Tests → Playwright Smoke → Build → Deploy",
        "Solo un build manual sin ninguna verificación automatizada",
        "Únicamente una revisión visual del sitio en producción",
        "Solo la ejecución de `npm install`"
      ],
      answer: [0],
      explanation: "El pipeline de CI de este proyecto encadena lint/typecheck, tests unitarios, smoke tests E2E, build y despliegue, actuando como red de seguridad para cualquier cambio, generado por IA o no."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS beneficios aportan un feature flag o un despliegue progresivo para un cambio de alto riesgo generado con IA?",
      options: [
        "Permite revertir el cambio sin un despliegue de emergencia si se detecta un problema",
        "Limita el impacto inicial del cambio antes de un rollout completo",
        "Elimina por completo la necesidad de tests para ese cambio",
        "Garantiza que el cambio nunca tendrá errores"
      ],
      answer: [0, 1],
      explanation: "Un feature flag o despliegue progresivo permite reversión rápida y limita el impacto inicial, pero no elimina la necesidad de tests ni de revisión — son complementarios, no sustitutos."
    },
    {
      type: "single",
      prompt: "Un equipo de SIT fusionó un cambio generado por IA saltándose el pipeline de CI 'para ir rápido', causando una regresión en un cálculo de descuentos. ¿Qué política se adoptó después?",
      options: [
        "Ningún cambio, generado por IA o no, se fusiona sin pasar por el pipeline de CI completo, sin excepciones por urgencia",
        "Prohibir el uso de IA para generar cualquier cambio en el futuro",
        "Permitir saltarse el pipeline solo en viernes por la tarde",
        "Ninguna política nueva; el incidente se consideró normal"
      ],
      answer: [0],
      explanation: "La política adoptada fue no fusionar nunca un cambio sin pasar por el pipeline de CI completo, sin excepciones por presión de tiempo."
    },
    {
      type: "single",
      prompt: "¿Qué señal de alerta representa que un cambio generado por IA reduzca la cobertura de tests existente del proyecto?",
      options: [
        "Es una señal de alerta que debe revisarse, generado por IA o no, respecto al umbral de cobertura configurado (80% en este proyecto)",
        "Ninguna; reducir la cobertura siempre es aceptable si el cambio es pequeño",
        "Solo es relevante si la reducción supera el 50%",
        "La cobertura de tests no tiene relación con cambios generados por IA"
      ],
      answer: [0],
      explanation: "Cualquier reducción de cobertura respecto al umbral configurado es una señal de alerta a revisar, sin excepción por el origen del cambio (IA o humano)."
    },
    {
      type: "single",
      prompt: "¿Qué detectan ESLint y `tsc --noEmit` en un cambio generado por IA, sin necesidad de revisión manual línea por línea?",
      options: [
        "Patrones inseguros o incorrectos como variables sin usar o tipos incorrectos",
        "Errores de lógica de negocio específicos del dominio",
        "Si el cambio resuelve correctamente el problema reportado",
        "El nivel de satisfacción del cliente con el cambio"
      ],
      answer: [0],
      explanation: "Los linters y type-checkers detectan patrones estructurales inseguros o incorrectos automáticamente, complementando pero no reemplazando la revisión de lógica de negocio."
    },
    {
      type: "single",
      prompt: "¿Qué se recomienda hacer con un cambio de alto riesgo generado con asistencia de IA en un flujo de aprobación real?",
      options: [
        "Diseñar su despliegue detrás de un feature flag o en un entorno de pruebas antes de producción",
        "Desplegarlo directamente a producción sin pruebas adicionales por ser 'solo un ajuste menor'",
        "Omitir los tests si el cambio fue generado por un agente confiable",
        "Aplicarlo simultáneamente a todos los entornos sin distinción de riesgo"
      ],
      answer: [0],
      explanation: "Para cambios de alto riesgo, se recomienda un despliegue detrás de un feature flag o en un entorno de pruebas primero, permitiendo reversión rápida si se detecta un problema."
    },
    {
      type: "single",
      prompt: "¿Qué gate del pipeline de CI de este proyecto atraparía un error de tipos introducido por un cambio generado con IA?",
      options: [
        "Lint & Type Check (incluye `tsc --noEmit`)",
        "Únicamente el paso de Deploy",
        "Solo Playwright Smoke",
        "Ningún gate del pipeline detecta errores de tipos"
      ],
      answer: [0],
      explanation: "El job 'Lint & Type Check' del pipeline ejecuta `tsc --noEmit`, que detecta errores de tipos antes de que el cambio llegue a los siguientes gates."
    }
  ],
  51: [
    {
      type: "single",
      prompt: "¿Cuál es la primera etapa del flujo recomendado 'humano diseña, IA implementa, CI valida, humano aprueba'?",
      options: [
        "Humano diseña: definir el problema, el alcance y el criterio de éxito antes de involucrar a la IA",
        "IA implementa, sin ninguna definición previa de alcance",
        "CI valida, antes de que exista ningún cambio",
        "Humano aprueba, como primer paso del ciclo"
      ],
      answer: [0],
      explanation: "La etapa de diseño humano —definir problema, alcance y criterio de éxito— siempre precede a la implementación asistida por IA, y no se delega."
    },
    {
      type: "single",
      prompt: "¿Qué ocurre si la etapa 'CI valida' falla dentro de este flujo?",
      options: [
        "Se ajusta la implementación y se vuelve a validar; nunca se salta esta etapa para avanzar más rápido",
        "Se fusiona igual el cambio y se corrige después en producción",
        "Se elimina el pipeline de CI para ese cambio específico",
        "Se repite exactamente la misma implementación sin cambios"
      ],
      answer: [0],
      explanation: "Ante un fallo de CI, se corrige la implementación y se revalida; el flujo nunca se acorta saltando esta etapa, sin importar la presión de tiempo."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS acciones corresponden a la etapa 'humano aprueba' del flujo recomendado?",
      options: [
        "Revisar el diff completo contra el criterio de éxito original",
        "Verificar alcance, efectos secundarios y seguridad antes de fusionar",
        "Delegar la aprobación final a un revisor automático sin lectura humana",
        "Omitir la aprobación si el cambio pasó CI exitosamente"
      ],
      answer: [0, 1],
      explanation: "La aprobación humana revisa el diff completo contra el criterio de éxito original, verificando alcance, efectos secundarios y seguridad — pasar CI no reemplaza esta revisión."
    },
    {
      type: "single",
      prompt: "El equipo de plataforma de SIT adoptó este flujo de 4 etapas después de dos incidentes previos. ¿Qué resultado midieron en los primeros 3 meses?",
      options: [
        "Una baja medible en regresiones detectadas en producción, con tiempo total por cambio comparable al proceso anterior",
        "Un aumento significativo en el tiempo total de cada cambio sin ninguna mejora en calidad",
        "Ninguna diferencia medible respecto al proceso anterior",
        "Una eliminación completa de la necesidad de revisión humana"
      ],
      answer: [0],
      explanation: "El equipo midió una baja medible en regresiones en producción, con un tiempo total por cambio comparable al proceso anterior — la ganancia estuvo en reducir el tiempo de implementación, no en saltarse etapas."
    },
    {
      type: "single",
      prompt: "¿Qué se debe hacer si el criterio de éxito de una tarea cambia a mitad de la implementación?",
      options: [
        "Volver formalmente a la etapa de diseño antes de continuar, en lugar de re-especificar sobre la marcha sin documentarlo",
        "Continuar la implementación ajustando el criterio informalmente sin volver a ninguna etapa",
        "Ignorar el cambio de criterio y entregar el resultado original de todas formas",
        "Saltar directamente a la etapa de aprobación humana sin pasar por CI"
      ],
      answer: [0],
      explanation: "Un cambio de criterio de éxito exige volver formalmente a la etapa de diseño, documentando el nuevo alcance, en lugar de ajustar el rumbo sobre la marcha sin dejarlo explícito."
    },
    {
      type: "single",
      prompt: "¿Por qué la etapa 'IA implementa' se beneficia de las plantillas de prompt del Módulo 47 y las tareas acotadas del Módulo 45?",
      options: [
        "Porque un alcance claro y un formato de instrucción reutilizable reducen la probabilidad de un resultado fuera de alcance o inconsistente",
        "Porque las plantillas de prompt eliminan la necesidad de la etapa de diseño",
        "Porque las tareas acotadas hacen innecesaria la validación de CI",
        "No existe relación real entre estas prácticas y la etapa de implementación"
      ],
      answer: [0],
      explanation: "Las plantillas de prompt y las tareas acotadas y verificables reducen el riesgo de resultados fuera de alcance o inconsistentes durante la etapa de implementación asistida por IA."
    },
    {
      type: "single",
      prompt: "¿Qué principio general resume el flujo 'humano diseña, IA implementa, CI valida, humano aprueba'?",
      options: [
        "Cada etapa es un gate independiente: un cambio no avanza a la siguiente hasta que la etapa anterior se cumple satisfactoriamente",
        "La IA reemplaza completamente al humano en todas las etapas excepto la primera",
        "El pipeline de CI es opcional si el humano ya aprobó el cambio visualmente",
        "Todas las etapas pueden ejecutarse en paralelo sin ningún orden específico"
      ],
      answer: [0],
      explanation: "El flujo trata cada etapa como un gate independiente y secuencial: diseño, implementación, validación y aprobación, sin saltar ni paralelizar etapas que dependen de la anterior."
    },
    {
      type: "single",
      prompt: "Al completar un cambio real en el repositorio siguiendo este flujo de 4 etapas, ¿qué se espera documentar al final, según la actividad práctica de este módulo?",
      options: [
        "En qué etapa (si alguna) fue necesario devolverse a un paso anterior y por qué",
        "Únicamente el tiempo total que tomó escribir el prompt inicial",
        "El nombre del modelo de IA usado, sin ningún otro detalle",
        "No es necesario documentar nada si el cambio pasó CI"
      ],
      answer: [0],
      explanation: "La actividad práctica pide documentar explícitamente en qué etapa (si alguna) se tuvo que retroceder y por qué, como parte del aprendizaje del ciclo completo."
    }
  ]
};
```

- [ ] **Step 2: Regenerate `questions.ts` and run the parser test suite**

```bash
cd app-elearning
node ../scripts/extract-questions.mjs
npx vitest run src/lib/__tests__/questions-parser.test.ts src/lib/__tests__/questions-parser-validation.test.ts
```
Expected: PASS. `"loads at least 200 questions"` now sees 394; `"moduleId values are between 1 and 51"` (fixed in Task 5) now meaningfully covers 42-51.

- [ ] **Step 3: Verify the raw JS still parses standalone (matches the project's own documented check)**

Run: `cd .. && node -e "const MODULE_QUESTIONS = require('./docs/javascripts/evaluaciones-simulador.js')" 2>&1 || node --input-type=module -e "import('./docs/javascripts/evaluaciones-simulador.js')"`

If this repo's `evaluaciones-simulador.js` uses `module.exports` (CommonJS) the first form works; if it uses browser globals only, skip straight to Step 2's Vitest run (which already parses it via `vm.runInContext` through `extract-questions.mjs`) — that is the authoritative check, this step is a quick sanity double-check per `AGENTS.md`'s documented verification habit.

- [ ] **Step 4: Commit**

```bash
cd .. && git add docs/javascripts/evaluaciones-simulador.js app-elearning/src/data/questions.ts
git commit -m "feat: agregar 80 preguntas (8 por módulo) para el nivel IA (42-51) al banco de evaluaciones"
```

---

### Task 8: Add the NIVEL 5 (IA) section to the checklist

**Files:**
- Modify: `docs/Recursos/CHECKLIST_PROGRESO.md`

**Interfaces:**
- Consumes: `checklist.ts`'s `LEVEL_HEADING` regex `/^##\s+.*?NIVEL\s+(\d+)[:\s]+(.+)$/i` and `MODULE_HEADING` regex `/^###\s+Módulo\s+(\d+)[:\s]+(.+)$/i` (both unchanged, already generic) and `LEVEL_BY_NUMBER[5] = "ia"` (Task 2).
- Produces: the checklist coverage that `scripts/validate-content.ts` and `checklist-client.tsx` require for the `ia` level — Task 9 verifies this end-to-end.

This file is read directly by both the Next.js app (`getResourceBySlug("checklist")`) and MkDocs — it is the single source for both surfaces (per `CLAUDE.md`), so this is the only checklist file to edit.

- [ ] **Step 1: Insert the NIVEL 5 section after Módulo 41's subtotal**

In `docs/Recursos/CHECKLIST_PROGRESO.md`, find the line right after Módulo 41's subtotal and the `---` separator, immediately before `### 🏆 Hitos de Nivel 4`:

```markdown
**Subtotal Módulo 41:** ___/10 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---
```

Insert the new level section right after that `---` and before `### 🏆 Hitos de Nivel 4`:

```markdown
## 🟣 NIVEL 5: DESARROLLO ASISTIDO POR IA

> Nivel transversal — no es prerequisito de los niveles PL-900 → PL-600 ni depende de ellos.

### Módulo 42: Fundamentos de IA para Desarrollo

- [ ] **Conocimiento**: Explico qué es un LLM aplicado a código y distingo autocompletado, chat y agente | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Identifico una alucinación de código provocada intencionalmente en un ejercicio propio | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Explico por qué el mismo prompt puede dar respuestas distintas entre ejecuciones | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Documento 2 riesgos de aceptar código generado sin verificación | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 42:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 43: Copilot en Power Platform

- [ ] **Práctica**: Genero una app Canvas con Copilot y documento los ajustes manuales que necesitó | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Genero un flujo con "Describe it to design it" en Power Automate y explico cada acción propuesta | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Distingo el rol de Copilot Studio (agentes para usuarios finales) del de Copilot en Power Apps/Automate (asistente de makers) | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Ubico y documento la configuración de gobernanza de Copilot en el Power Platform Admin Center | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 43:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 44: GitHub Copilot en VS Code

- [ ] **Práctica**: Genero código en un componente PCF real usando autocompletado y documento qué contexto ayudó a la precisión | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Uso Copilot Chat para explicar un archivo existente y verifico la explicación contra mi propio conocimiento | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Aplico un cambio con Copilot Edits revisando el diff completo antes de aceptarlo | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Creo un `.github/copilot-instructions.md` con al menos 2 convenciones del proyecto | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 44:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 45: Claude Code y Codex

- [ ] **Práctica**: Uso un agente para localizar todas las ocurrencias de un patrón en el repo y confirmo el resultado manualmente | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Delego una tarea acotada con criterio de éxito verificable y confirmo que el agente la cumplió | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Comparo el resultado de una tarea vaga vs. una acotada y documento la diferencia de calidad | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Lab 45 completado — implementación guiada con Copilot/Claude Code | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 45:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 46: Vibe Coding Controlado

- [ ] **Conocimiento**: Distingo con un ejemplo propio una tarea apta para vibe coding de una que no lo es | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Escribo una regla de equipo de una frase sobre cuándo se permite vibe coding | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Agrego al menos un test de validación a un resultado generado con vibe coding | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Explico por qué vibe coding exige más control, no menos, en tareas de riesgo | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 46:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 47: Prompts Técnicos Reutilizables

- [ ] **Práctica**: Construyo una plantilla parametrizable a partir de una tarea que repito seguido | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Pruebo la plantilla con dos casos distintos y confirmo consistencia de resultado | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Guardo la plantilla como archivo versionado en el repositorio | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Explico los 4 componentes de una buena plantilla de prompt | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 47:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 48: Revisión de Diffs y Pull Requests

- [ ] **Práctica**: Reviso un diff real usando la checklist de alcance/efectos secundarios/seguridad/tests | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Identifico un cambio fuera de alcance en un diff generado intencionalmente con ese defecto | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Documento mi propia checklist de revisión de PRs | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Explico la diferencia entre un revisor automático de PRs y la aprobación humana final | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 48:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 49: Seguridad, Secretos y Compliance en IA

- [ ] **Práctica**: Identifico y corrijo un dato sensible en un prompt propio de un módulo anterior | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Documento la política de retención/residencia de datos de al menos una herramienta de IA que uso | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Reviso la configuración DLP de un entorno respecto a conectores/IA generativa | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Explico por qué nunca se debe pegar un secreto real en un prompt | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 49:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 50: Tests, CI/CD y Guardrails para Código Generado por IA

- [ ] **Práctica**: Agrego un test de validación a un cambio generado por IA de un módulo anterior | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Confirmo que un cambio pasa lint, typecheck y test:coverage antes de darlo por terminado | Dominio: ___/5 | Fecha: ___
- [ ] **Conocimiento**: Explico qué gate del pipeline de CI atraparía un error específico introducido por IA | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Diseño (en texto) cómo desplegaría detrás de un feature flag un cambio de alto riesgo generado con IA | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 50:** ___/4 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### Módulo 51: Flujo Recomendado — Humano Diseña, IA Implementa, CI Valida, Humano Aprueba

- [ ] **Práctica**: Completo el ciclo de las 4 etapas sobre un cambio real en este repositorio | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Documento en qué etapa (si alguna) tuve que devolverme a un paso anterior y por qué | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: El cambio final pasa lint, typecheck y tests antes de considerarse aprobado | Dominio: ___/5 | Fecha: ___
- [ ] **Entrega**: Escribo el resumen de una página del ciclo completo aplicado | Dominio: ___/5 | Fecha: ___
- [ ] **Práctica**: Lab 51 completado — flujo completo humano→IA→CI→aprobación sobre un caso real | Dominio: ___/5 | Fecha: ___

**Subtotal Módulo 51:** ___/5 checkboxes completados | % completado: ___ | Promedio dominio: ___/5

---

### 🏆 Hitos de Nivel IA

- [ ] Todos los módulos 42-51 completados con 80%+ de checkboxes marcados | Fecha: ___
- [ ] Lab 45 y Lab 51 completados | Fecha: ___
- [ ] Autoevaluación promedio ≥ 4.0/5 en todos los módulos del nivel | Promedio: ___/5
- [ ] Certificado del Nivel IA generado | Fecha: ___

**Fecha de inicio Nivel IA:** ___ | **Fecha de completación:** ___

---
```

- [ ] **Step 2: Update the summary tables for consistency (optional polish, not required by `checklist.ts`'s parser)**

In the `## 📊 Resumen Total de Progreso` table, add a row before `**TOTAL**` and update the total row:

```markdown
| 🟣 Nivel IA - Desarrollo Asistido | 10 | 41 | ___ | ___% | ___/5 | ___ |
| **TOTAL** | **51** | **506** | ___ | ___% | ___/5 | ___ |
```

In `### Resumen por Módulo`, append after row 41:

```markdown
| 42 | Fundamentos de IA para Desarrollo | ___/4 | ___% | ___/5 |
| 43 | Copilot en Power Platform | ___/4 | ___% | ___/5 |
| 44 | GitHub Copilot en VS Code | ___/4 | ___% | ___/5 |
| 45 | Claude Code y Codex | ___/4 | ___% | ___/5 |
| 46 | Vibe Coding Controlado | ___/4 | ___% | ___/5 |
| 47 | Prompts Técnicos Reutilizables | ___/4 | ___% | ___/5 |
| 48 | Revisión de Diffs y PRs | ___/4 | ___% | ___/5 |
| 49 | Seguridad, Secretos y Compliance | ___/4 | ___% | ___/5 |
| 50 | Tests, CI/CD y Guardrails | ___/4 | ___% | ___/5 |
| 51 | Flujo Recomendado (Capstone) | ___/5 | ___% | ___/5 |
```

In `### Timeline Visual de Progreso`, add a row before `TOTAL`:

```
NIVEL IA [                    ] ___% completado
```

- [ ] **Step 3: Commit**

```bash
git add docs/Recursos/CHECKLIST_PROGRESO.md
git commit -m "feat: agregar sección NIVEL 5 (IA) al checklist de progreso (10 módulos, 41 criterios)"
```

---

### Task 9: Run full content validation and fix any gaps

**Files:**
- No new files expected — this task only fixes issues surfaced by validation, if any.

**Interfaces:**
- Consumes: everything produced by Tasks 1-8.
- Produces: a green `npm run validate:content` — the first point in this plan where that command is expected to fully pass, since it requires modules (Task 6), questions (Task 7), and checklist (Task 8) to all exist together.

- [ ] **Step 1: Run content validation**

```bash
cd app-elearning
npm run validate:content
```

Expected output:
```
✓ 51 módulos válidos (moduleId único, slug único, rango por nivel)
✓ 9 labs válidos (id único, slug único)
✓ 394 preguntas válidas cubriendo los 51 módulos
✓ Checklist válido (51 módulos, 506 criterios)
```

(The labs count stays at 9 here — Task 13 adds the 2 new labs afterward, which will bring it to 11.)

- [ ] **Step 2: If it fails, diagnose using the error message**

`validate-content.ts` throws specific, actionable messages:
- `"Faltan módulos para moduleId: ..."` → a module file in Task 6 has a typo in `moduleId` or is missing.
- `"Módulos sin preguntas: ..."` → a key 42-51 is missing or malformed in Task 7's edit to `evaluaciones-simulador.js`.
- `"No se encontró el recurso checklist"` / `"Faltan niveles del checklist"` / `"Faltan módulos del checklist"` → Task 8's Markdown headings don't match the `## NIVEL 5: ...` / `### Módulo NN: ...` pattern exactly, or a module section is missing.

Fix the specific file named in the error and re-run Step 1 until it passes.

- [ ] **Step 3: Run the full unit test suite with coverage**

```bash
npx vitest run --coverage
```

Expected: all test files pass (167+ tests from before this feature, plus the `level-progress-banner.test.tsx` regression test from the earlier progress-sync fix), coverage thresholds (80% lines/functions/branches/statements per `vitest.config.ts`) still met.

- [ ] **Step 4: Run lint and typecheck one more time**

```bash
npm run lint && npx tsc --noEmit
```
Expected: no output (both succeed).

- [ ] **Step 5: Commit only if Step 2 required fixes**

```bash
git add -A
git commit -m "fix: corregir gaps de validación de contenido detectados en el nivel IA"
```

(Skip this step if Step 1 passed on the first try with no changes needed.)

---

### Task 10: Wire the `ia` level into sidebar, home, labs page, and checklist UI

**Files:**
- Modify: `app-elearning/src/components/layout/sidebar.tsx`
- Modify: `app-elearning/src/app/page.tsx`
- Modify: `app-elearning/src/app/labs/page.tsx`
- Modify: `app-elearning/src/components/checklist/checklist-client.tsx`

**Interfaces:**
- Consumes: `LevelId`, `badgeVariants` (Task 2).
- Produces: visually correct rendering of the `ia` level everywhere a `Record<LevelId, ...>` config map is used for display (purple accent, consistent with `badge.tsx`'s `ia` variant from Task 2).

- [ ] **Step 1: Update `sidebar.tsx`**

Replace the `LEVEL_CONFIG` declaration:

```typescript
const LEVEL_CONFIG: Record<LevelId, {
  dot: string;
  label: string;
  badgeVariant: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia";
  progressColor: string;
}> = {
  basico:     { dot: "bg-[#107C10]", label: "text-[#107C10] dark:text-green-400",    badgeVariant: "basico",     progressColor: "[&>div]:bg-[#107C10]" },
  intermedio: { dot: "bg-[#0078D4]", label: "text-[#0078D4] dark:text-[#4DB8FF]",   badgeVariant: "intermedio", progressColor: "[&>div]:bg-[#0078D4]" },
  avanzado:   { dot: "bg-orange-500", label: "text-orange-600 dark:text-orange-400", badgeVariant: "avanzado",   progressColor: "[&>div]:bg-orange-500" },
  arquitecto: { dot: "bg-[#D13438]", label: "text-[#D13438] dark:text-red-400",      badgeVariant: "arquitecto", progressColor: "[&>div]:bg-[#D13438]"  },
  ia:         { dot: "bg-purple-600", label: "text-purple-600 dark:text-purple-400", badgeVariant: "ia",         progressColor: "[&>div]:bg-purple-600" },
};
```

- [ ] **Step 2: Update `page.tsx` (home)**

Replace the `LEVEL_CONFIG` declaration:

```typescript
const LEVEL_CONFIG: Record<LevelId, {
  ring: string;
  accent: string;
  accentDark: string;
  border: string;
  badge: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia";
}> = {
  basico:     { ring: "stroke-[#107C10]", accent: "#107C10", accentDark: "#2DB52D", border: "border-[#107C10]/20 dark:border-[#2DB52D]/20", badge: "basico"     },
  intermedio: { ring: "stroke-[#0078D4]", accent: "#0078D4", accentDark: "#4DB8FF", border: "border-[#0078D4]/20 dark:border-[#4DB8FF]/20",  badge: "intermedio" },
  avanzado:   { ring: "stroke-orange-500", accent: "#EA580C", accentDark: "#F97316", border: "border-orange-500/20",                           badge: "avanzado"   },
  arquitecto: { ring: "stroke-[#D13438]", accent: "#D13438", accentDark: "#E85555", border: "border-[#D13438]/20 dark:border-[#E85555]/20",   badge: "arquitecto" },
  ia:         { ring: "stroke-purple-600", accent: "#9333EA", accentDark: "#C084FC", border: "border-purple-600/20 dark:border-purple-400/20", badge: "ia"        },
};
```

Update the hero paragraph copy (small text-only change, no layout change):

```typescript
            <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
              De cero a Solution Architect. 51 módulos, 11 laboratorios y simuladores
              de certificación — PL-900 · PL-200 · PL-400 · PL-600, más una capa
              transversal de Desarrollo Asistido por IA.
            </p>
```

- [ ] **Step 3: Update `labs/page.tsx`**

Replace `LEVEL_CONFIG`, `CERT_VARIANT`, and `levelOrder`:

```typescript
const LEVEL_CONFIG: Record<string, { label: string; bar: string; accent: string }> = {
  N1: { label: "Nivel 1 — Básico",      bar: "bg-[#107C10]",  accent: "#107C10" },
  N2: { label: "Nivel 2 — Intermedio",  bar: "bg-[#0078D4]",  accent: "#0078D4" },
  N3: { label: "Nivel 3 — Avanzado",    bar: "bg-orange-500", accent: "#EA580C" },
  N4: { label: "Nivel 4 — Arquitecto",  bar: "bg-[#D13438]",  accent: "#D13438" },
  N5: { label: "Nivel IA — Desarrollo Asistido", bar: "bg-purple-600", accent: "#9333EA" },
};

const CERT_VARIANT: Record<string, "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia" | "default"> = {
  "PL-900": "basico", "PL-200": "intermedio", "PL-400": "avanzado", "PL-600": "arquitecto",
  "Buenas Prácticas": "ia",
};
```

```typescript
  const levelOrder = ["N1", "N2", "N3", "N4", "N5"];
```

- [ ] **Step 4: Update `checklist-client.tsx`**

Replace the `LEVEL_STYLE` declaration:

```typescript
const LEVEL_STYLE: Record<LevelId, {
  badge: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia";
  progress: string;
  accent: string;
}> = {
  basico: { badge: "basico", progress: "[&>div]:bg-[#107C10]", accent: "text-[#107C10] dark:text-green-400" },
  intermedio: { badge: "intermedio", progress: "[&>div]:bg-[#0078D4]", accent: "text-[#0078D4] dark:text-[#4DB8FF]" },
  avanzado: { badge: "avanzado", progress: "[&>div]:bg-orange-500", accent: "text-orange-600 dark:text-orange-400" },
  arquitecto: { badge: "arquitecto", progress: "[&>div]:bg-[#D13438]", accent: "text-[#D13438] dark:text-red-400" },
  ia: { badge: "ia", progress: "[&>div]:bg-purple-600", accent: "text-purple-600 dark:text-purple-400" },
};
```

- [ ] **Step 5: Run lint and typecheck**

```bash
cd app-elearning && npm run lint && npx tsc --noEmit
```
Expected: no output (both succeed).

- [ ] **Step 6: Commit**

```bash
git add app-elearning/src/components/layout/sidebar.tsx app-elearning/src/app/page.tsx app-elearning/src/app/labs/page.tsx app-elearning/src/components/checklist/checklist-client.tsx
git commit -m "feat: agregar el nivel IA a sidebar, home, labs y checklist UI (acento púrpura)"
```

---

### Task 11: `level-progress-banner.tsx` — colors + IA-aware completion messaging

**Files:**
- Modify: `app-elearning/src/components/modules/level-progress-banner.tsx`

**Interfaces:**
- Consumes: `LEVEL_ORDER` (Task 2, now `[..., "arquitecto", "ia"]`).
- Produces: completing Arquitecto still shows "¡Plan de Estudio Completado!" (no "Comenzar Nivel IA" suggestion); completing IA shows its own distinct message with no PL-xxx exam language and no "next level" button.

This is the behavior change flagged in the spec and the plan's Global Constraints.

- [ ] **Step 1: Update `LEVEL_COLORS` and `TROPHY_COLORS`**

```typescript
const LEVEL_COLORS: Record<LevelId, string> = {
  basico:     "from-green-50  to-emerald-50  border-green-200  dark:from-green-950  dark:to-emerald-950  dark:border-green-800",
  intermedio: "from-blue-50   to-sky-50      border-blue-200   dark:from-blue-950   dark:to-sky-950      dark:border-blue-800",
  avanzado:   "from-orange-50 to-amber-50    border-orange-200 dark:from-orange-950 dark:to-amber-950    dark:border-orange-800",
  arquitecto: "from-red-50    to-rose-50     border-red-200    dark:from-red-950    dark:to-rose-950     dark:border-red-800",
  ia:         "from-purple-50 to-fuchsia-50  border-purple-200 dark:from-purple-950 dark:to-fuchsia-950  dark:border-purple-800",
};

const TROPHY_COLORS: Record<LevelId, string> = {
  basico:     "text-emerald-600 dark:text-emerald-400",
  intermedio: "text-blue-600   dark:text-blue-400",
  avanzado:   "text-orange-600 dark:text-orange-400",
  arquitecto: "text-red-600    dark:text-red-400",
  ia:         "text-purple-600 dark:text-purple-400",
};
```

- [ ] **Step 2: Rewrite the "next level" / "final" logic in `LevelCompleteBanner`**

Replace:

```typescript
  const currentIdx = LEVEL_ORDER.indexOf(levelId);
  const nextLevelId = currentIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIdx + 1] : null;
  const isFinal = nextLevelId === null;
```

with:

```typescript
  const currentIdx = LEVEL_ORDER.indexOf(levelId);
  const rawNextLevelId = currentIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIdx + 1] : null;
  // El nivel "ia" es transversal: no se sugiere como "siguiente nivel" tras Arquitecto,
  // así que se excluye del cómputo de nextLevelId/isFinal.
  const nextLevelId = rawNextLevelId === "ia" ? null : rawNextLevelId;
  const isFinal = nextLevelId === null;
```

- [ ] **Step 3: Branch the heading and message text on `levelId === "ia"`**

Replace:

```typescript
          <h2 className="font-bold text-lg leading-tight">
            {isFinal ? "¡Plan de Estudio Completado!" : `¡${UI.levels.badge[levelId]} Completado!`}
          </h2>
```

with:

```typescript
          <h2 className="font-bold text-lg leading-tight">
            {levelId === "ia"
              ? "¡Nivel de Desarrollo Asistido por IA Completado!"
              : isFinal
              ? "¡Plan de Estudio Completado!"
              : `¡${UI.levels.badge[levelId]} Completado!`}
          </h2>
```

Replace:

```typescript
      <p className="text-sm leading-relaxed">
        {isFinal
          ? "Has completado los cuatro niveles del plan. Estás preparado para rendir el examen PL-600 y ejercer como Power Platform Solution Architect."
          : `Has dominado los contenidos de este nivel. El siguiente paso es el ${UI.levels.badge[nextLevelId!]}, donde profundizarás hacia la certificación ${UI.levels.cert[nextLevelId!]}: ${UI.levels.description[nextLevelId!]}.`
        }
      </p>
```

with:

```typescript
      <p className="text-sm leading-relaxed">
        {levelId === "ia"
          ? "Has completado los 10 módulos de desarrollo asistido por IA. Sigue aplicando el flujo humano diseña → IA implementa → CI valida → humano aprueba en tus proyectos reales de Power Platform y Dynamics 365."
          : isFinal
          ? "Has completado los cuatro niveles del plan. Estás preparado para rendir el examen PL-600 y ejercer como Power Platform Solution Architect."
          : `Has dominado los contenidos de este nivel. El siguiente paso es el ${UI.levels.badge[nextLevelId!]}, donde profundizarás hacia la certificación ${UI.levels.cert[nextLevelId!]}: ${UI.levels.description[nextLevelId!]}.`
        }
      </p>
```

- [ ] **Step 4: Adjust the "Listo para el examen" badge text for IA**

Replace:

```typescript
        <Badge variant={levelId} className="text-xs">
          {UI.levels.cert[levelId]} — Listo para el examen
        </Badge>
```

with:

```typescript
        <Badge variant={levelId} className="text-xs">
          {levelId === "ia" ? UI.levels.cert[levelId] : `${UI.levels.cert[levelId]} — Listo para el examen`}
        </Badge>
```

- [ ] **Step 5: Run lint and typecheck**

```bash
cd app-elearning && npm run lint && npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 6: Manually verify the two behavior changes with the dev server**

```bash
npm run dev
```

In the browser (or via localStorage manipulation in devtools), mark all 41 modules of `basico`+`intermedio`+`avanzado`+`arquitecto` complete and visit `/nivel/arquitecto`. Confirm the banner still says "¡Plan de Estudio Completado!" with **no** "Comenzar 🟣 IA" button. Then mark all 10 `ia` modules complete and visit `/nivel/ia`. Confirm it shows "¡Nivel de Desarrollo Asistido por IA Completado!" with no PL-xxx exam text and no "next level" button. Stop the dev server (`Ctrl+C`) when done.

- [ ] **Step 7: Commit**

```bash
git add app-elearning/src/components/modules/level-progress-banner.tsx
git commit -m "feat: mensajería propia del nivel IA en el banner de finalización (sin sugerir 'siguiente nivel' tras Arquitecto)"
```

---

### Task 12: `certificate-diploma.tsx` — colors + IA-aware certificate phrase

**Files:**
- Modify: `app-elearning/src/components/modules/certificate-diploma.tsx`

**Interfaces:**
- Consumes: `LevelId`, `UI.levels.cert`/`badge` (Task 2).
- Produces: the printable certificate for `ia` reads correctly ("aplicando las buenas prácticas...") instead of the generic "quedando preparado para rendir la certificación Buenas Prácticas" (which reads as nonsense for a non-exam level). Found during planning — not explicit in the spec, but required by the spec's stated goal ("copy que no reference un examen oficial PL-xxx").

- [ ] **Step 1: Update `BORDER_COLORS` and `ACCENT_TEXT_COLORS`**

```typescript
const BORDER_COLORS: Record<LevelId, string> = {
  basico:     "border-emerald-600 dark:border-emerald-400",
  intermedio: "border-blue-600    dark:border-blue-400",
  avanzado:   "border-orange-600  dark:border-orange-400",
  arquitecto: "border-red-600     dark:border-red-400",
  ia:         "border-purple-600  dark:border-purple-400",
};

const ACCENT_TEXT_COLORS: Record<LevelId, string> = {
  basico:     "text-emerald-700 dark:text-emerald-400",
  intermedio: "text-blue-700    dark:text-blue-400",
  avanzado:   "text-orange-700  dark:text-orange-400",
  arquitecto: "text-red-700     dark:text-red-400",
  ia:         "text-purple-700  dark:text-purple-400",
};
```

- [ ] **Step 2: Branch the certificate body text for `ia`**

Replace:

```typescript
      <p className="text-base leading-relaxed max-w-lg">
        por haber completado exitosamente el{" "}
        <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
          {UI.levels.badge[levelId]}
        </span>
        , quedando preparado para rendir la certificación{" "}
        <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
          {UI.levels.cert[levelId]}
        </span>
        .
      </p>
```

with:

```typescript
      <p className="text-base leading-relaxed max-w-lg">
        {levelId === "ia" ? (
          <>
            por haber completado exitosamente el{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.badge[levelId]}
            </span>
            , aplicando de forma consistente las buenas prácticas de desarrollo asistido
            por IA en proyectos de Power Platform y Dynamics 365.
          </>
        ) : (
          <>
            por haber completado exitosamente el{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.badge[levelId]}
            </span>
            , quedando preparado para rendir la certificación{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.cert[levelId]}
            </span>
            .
          </>
        )}
      </p>
```

- [ ] **Step 3: Run lint and typecheck**

```bash
cd app-elearning && npm run lint && npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 4: Add a regression test mirroring the existing certificate tests**

In `app-elearning/src/app/certificado/[nivel]/__tests__/certificate-client.test.tsx`, add a new test after the existing `"renders the certificate when the level is complete and userName is set"` test:

```typescript
  it("shows IA-specific phrasing (no PL-xxx exam language) when the level is 'ia'", () => {
    for (let i = 42; i <= 51; i++) {
      useProgressStore.getState().markModuleComplete(`ia-${i}`);
    }
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText, queryByText } = render(<CertificateClient levelId="ia" />);
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText(/buenas prácticas de desarrollo asistido por IA/i)).toBeInTheDocument();
    expect(queryByText(/rendir la certificación/i)).not.toBeInTheDocument();
  });
```

- [ ] **Step 5: Run the certificate test file**

```bash
npx vitest run "src/app/certificado/[nivel]/__tests__/certificate-client.test.tsx"
```
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add app-elearning/src/components/modules/certificate-diploma.tsx "app-elearning/src/app/certificado/[nivel]/__tests__/certificate-client.test.tsx"
git commit -m "feat: frase propia del certificado IA (sin lenguaje de examen PL-xxx) + test de regresión"
```

---

### Task 13: Write the 2 new labs

**Files:**
- Create: `app-elearning/content/labs/lab-45-copilot-implementacion-guiada.md`
- Create: `app-elearning/content/labs/lab-51-flujo-completo-humano-ia-ci.md`

**Interfaces:**
- Consumes: `validateLabFrontmatter`'s extended level whitelist (`"N5"`, Task 2).
- Produces: 2 `LabInfo` entries, bringing the total from 9 to 11 — consumed by Task 9-style validation (re-run in Step 3 below) and Task 14 (e2e).

- [ ] **Step 1: Write lab-45**

Write `app-elearning/content/labs/lab-45-copilot-implementacion-guiada.md`:

```markdown
---
id: lab-45
title: "Copilot/Claude Code — Implementación Guiada sobre el Escenario SIT"
level: "N5"
duration: 90
product: ["GitHub Copilot", "Claude Code", "Power Automate", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Maker"]
prerequisites:
  - "Lab 05 completado — flujo de aprobación de gastos en Dataverse"
  - "Editor con GitHub Copilot o Claude Code instalado"
  - "Módulo 44 y 45 estudiados: GitHub Copilot en VS Code, Claude Code y Codex"
files: []
---

# Lab 45 — Implementación Guiada con IA sobre el Escenario SIT

## Objetivo

Al finalizar este laboratorio habrás usado un asistente o agente de código para implementar una extensión real y acotada sobre el flujo de aprobación de gastos de Servicios Integrados Tecnológicos S.A. (SIT), aplicando el ciclo completo de tarea acotada → generación → revisión de diff → verificación.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 05

**Problema a resolver:** El flujo de aprobación de gastos (Lab 05) notifica al aprobador pero no registra cuánto tiempo tarda cada aprobación, dato que Finanzas necesita para su reporte mensual de SLA interno. Se necesita agregar un campo de "tiempo de aprobación en horas" calculado automáticamente cuando el estado cambia a Aprobado o Rechazado.

**Por qué es una buena tarea para practicar el flujo asistido por IA:** es un cambio pequeño, acotado a un flujo existente, con un criterio de éxito verificable (el campo se calcula correctamente), y de bajo riesgo si algo sale mal (no toca pagos ni aprobaciones, solo un campo de reporting).

## Lo que vas a construir

- Un campo nuevo `sit_horasaprobacion` en la tabla de solicitudes de gasto
- Una modificación al flujo de Power Automate del Lab 05 que calcule y guarde ese valor al cambiar el estado
- Un test manual documentado que confirme el cálculo correcto en 2 escenarios (aprobación rápida, aprobación después de varios días)

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Diseñar la tarea (humano): definir alcance y criterio de éxito | 15 min |
| Ejercicio 2 — Implementar con Copilot/Claude Code el campo y la lógica del flujo | 35 min |
| Ejercicio 3 — Revisar el diff/cambio generado con la checklist del Módulo 48 | 20 min |
| Ejercicio 4 — Verificar con los 2 escenarios de prueba | 20 min |
| **Total** | **90 min** |

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Tecnologías utilizadas

- GitHub Copilot o Claude Code (a elección)
- Power Automate (flujo del Lab 05)
- Microsoft Dataverse (tabla de solicitudes de gasto)

## Ejercicio 1 — Diseñar la tarea (humano diseña)

Antes de abrir cualquier herramienta de IA, escribe en un párrafo:
1. El campo exacto a agregar (`sit_horasaprobacion`, tipo Whole Number).
2. En qué punto del flujo se debe calcular (al cambiar `sit_estado` a "Aprobado" o "Rechazado").
3. El criterio de éxito: "el campo refleja las horas completas transcurridas entre la creación de la solicitud y el cambio de estado, redondeadas hacia abajo".

## Ejercicio 2 — Implementar con asistencia de IA

Usando la plantilla de prompt que hayas construido en el Módulo 47 (o una instrucción acotada siguiendo el Módulo 45), pide a Copilot o Claude Code:
1. Agregar el campo `sit_horasaprobacion` a la definición de la tabla (o los pasos para agregarlo desde el editor de Dataverse, si tu herramienta no edita el esquema directamente).
2. Modificar el flujo de Power Automate del Lab 05 agregando una acción que calcule la diferencia en horas entre `createdon` y la fecha actual, y la guarde en el nuevo campo, solo cuando `sit_estado` cambie a Aprobado o Rechazado.

Da a la herramienta el contexto del flujo existente (ábrelo o descríbelo) antes de pedir la modificación.

## Ejercicio 3 — Revisar el resultado (humano aprueba, parcial)

Aplica la checklist del Módulo 48 sobre el cambio propuesto:
- **Alcance:** ¿el cambio toca solo el campo y el flujo de aprobación, o modifica algo más?
- **Efectos secundarios:** ¿la nueva acción podría fallar o bloquear el flujo si `createdon` no está disponible?
- **Seguridad:** ¿el cambio introduce algún permiso o conector nuevo no necesario?
- **Tests:** ver Ejercicio 4.

## Ejercicio 4 — Verificar (CI valida, en este caso manual)

Prueba el flujo modificado con 2 registros de ejemplo:
1. Una solicitud aprobada la misma hora en que fue creada — el campo debe mostrar `0`.
2. Una solicitud aprobada 3 días después de creada — el campo debe mostrar el número de horas correspondiente (aproximadamente 72).

Documenta el resultado de ambas pruebas antes de marcar el laboratorio como completado.

## Criterios de Validación

- [ ] Definí el alcance y criterio de éxito antes de usar la herramienta de IA
- [ ] El campo `sit_horasaprobacion` se agregó y se calcula correctamente al cambiar el estado
- [ ] Revisé el cambio con la checklist de alcance/efectos secundarios/seguridad del Módulo 48
- [ ] Verifiqué el cálculo con los 2 escenarios de prueba y documenté el resultado
```

- [ ] **Step 2: Write lab-51**

Write `app-elearning/content/labs/lab-51-flujo-completo-humano-ia-ci.md`:

```markdown
---
id: lab-51
title: "Flujo Completo Humano → IA → CI → Aprobación sobre un Caso Real"
level: "N5"
duration: 100
product: ["GitHub Copilot", "Claude Code", "GitHub Actions", "Power Platform"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect"]
prerequisites:
  - "Lab 45 completado"
  - "Módulos 42-51 estudiados (nivel IA completo)"
  - "Acceso a un repositorio con pipeline de CI configurado (puede ser este mismo proyecto)"
files: []
---

# Lab 51 — Flujo Completo Humano → IA → CI → Aprobación (Capstone)

## Objetivo

Al finalizar este laboratorio habrás ejecutado, de punta a punta y sobre un caso real, el flujo recomendado del Módulo 51: humano diseña, IA implementa, CI valida, humano aprueba — documentando explícitamente cada etapa y cualquier retorno a un paso anterior.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — cierre del nivel IA

**Problema a resolver:** El equipo de plataforma de SIT quiere adoptar formalmente el flujo de 4 etapas como estándar, pero necesita primero una prueba documentada end-to-end antes de exigirlo a todo el equipo. Este laboratorio es esa prueba: un cambio real, pequeño pero completo, llevado por las 4 etapas sin atajos.

**Por qué es el capstone del nivel:** integra lo aprendido en los módulos 42-50 — fundamentos, herramientas concretas, vibe coding controlado, prompts reutilizables, revisión de diffs, seguridad, y tests/CI — en un solo ciclo aplicado.

## Lo que vas a construir

Un cambio real y acotado en un repositorio con pipeline de CI (puede ser este mismo proyecto PlanEstudio, sobre una rama de práctica), llevado por las 4 etapas: diseño documentado, implementación asistida por IA, validación en CI, y aprobación humana con checklist.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Humano diseña: elegir el cambio y escribir el criterio de éxito | 15 min |
| Ejercicio 2 — IA implementa: generar el cambio con una plantilla o tarea acotada | 30 min |
| Ejercicio 3 — CI valida: ejecutar lint/typecheck/tests localmente o en el pipeline | 20 min |
| Ejercicio 4 — Humano aprueba: revisar el diff completo con la checklist del Módulo 48 | 20 min |
| Ejercicio 5 — Documentar el ciclo completo | 15 min |
| **Total** | **100 min** |

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (capstone, no es una certificación oficial Microsoft)

## Tecnologías utilizadas

- GitHub Copilot, Claude Code o Codex (a elección)
- Pipeline de CI existente del repositorio (lint, typecheck, tests, build)
- Git (rama de práctica dedicada para este laboratorio)

## Ejercicio 1 — Humano diseña

Elige un cambio real, pequeño y de bajo riesgo (ej. un mensaje de error más claro, un test faltante, una mejora de accesibilidad menor). Escribe:
1. El problema exacto a resolver.
2. El alcance: qué archivo(s) se tocan y cuáles no.
3. El criterio de éxito verificable (ej. "el test X pasa" o "el mensaje Y aparece en este componente").

## Ejercicio 2 — IA implementa

Usando una plantilla de prompt propia (Módulo 47) o una instrucción acotada a un agente (Módulo 45), genera el cambio dentro del alcance definido en el Ejercicio 1. Si la herramienta ofrece un modo de aplicar cambios directamente (Copilot Edits, Agent Mode), revisa el diff propuesto antes de aceptarlo.

## Ejercicio 3 — CI valida

Ejecuta localmente (o mediante un PR de práctica que dispare el pipeline):

```bash
npm run lint
npx tsc --noEmit
npx vitest run
```

Si algo falla, vuelve al Ejercicio 2 y ajusta la implementación — no continúes al Ejercicio 4 con un gate en rojo.

## Ejercicio 4 — Humano aprueba

Revisa el diff completo como si fueras un segundo revisor, aplicando la checklist del Módulo 48:
- Alcance: ¿coincide con lo definido en el Ejercicio 1?
- Efectos secundarios: ¿algo cambió que no debía?
- Seguridad: ¿se introdujo algún secreto, permiso o dependencia nueva no justificada?
- Tests: ¿el criterio de éxito del Ejercicio 1 está cubierto por un test o verificación?

Documenta explícitamente tu decisión (apruebas o no) y por qué.

## Ejercicio 5 — Documentar el ciclo

Escribe un resumen de una página cubriendo:
1. El cambio realizado y su criterio de éxito.
2. Si tuviste que devolverte a una etapa anterior en algún punto, y por qué.
3. Qué harías distinto la próxima vez que uses este flujo.

## Criterios de Validación

- [ ] Documenté el alcance y criterio de éxito antes de involucrar a la IA
- [ ] El cambio se implementó dentro del alcance definido
- [ ] El cambio pasa lint, typecheck y tests antes de la aprobación
- [ ] Reviso y aprobó (o rechazó con razones) el diff completo usando la checklist del Módulo 48
- [ ] Escribí el resumen de una página del ciclo completo
```

- [ ] **Step 3: Re-run full content validation**

```bash
cd app-elearning
npm run validate:content
```
Expected:
```
✓ 51 módulos válidos (moduleId único, slug único, rango por nivel)
✓ 11 labs válidos (id único, slug único)
✓ 394 preguntas válidas cubriendo los 51 módulos
✓ Checklist válido (51 módulos, 506 criterios)
```

- [ ] **Step 4: Commit**

```bash
git add app-elearning/content/labs/lab-45-copilot-implementacion-guiada.md app-elearning/content/labs/lab-51-flujo-completo-humano-ia-ci.md
git commit -m "feat: agregar labs 45 y 51 del nivel IA (implementación guiada, flujo completo capstone)"
```

---

### Task 14: E2E smoke tests for the IA level

**Files:**
- Modify: `app-elearning/e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: the built app at `/nivel/ia`, `/nivel/ia/modulo/[slug]`, `/certificado/ia`, and the `plan-estudio-progress` key in `localStorage` (the Zustand persist key, from `progress.ts`'s `persist(..., { name: "plan-estudio-progress" })`).
- Produces: 3 new smoke tests, run as part of the existing `Playwright Smoke` CI job — no new Playwright config needed.

- [ ] **Step 1: Add the tests**

In `app-elearning/e2e/smoke.spec.ts`, add the following tests at the end of the `describe.` block, right before the final closing `});`:

```typescript
  test("nivel IA carga desde el sidebar y muestra sus 10 módulos", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/nivel/ia"]').first().click();
    await expect(page).toHaveURL(/\/nivel\/ia$/);
    await expect(page.locator("h1")).toContainText(/IA/i);
    await expect(page.locator('a[href*="/nivel/ia/modulo/"]').first()).toBeVisible();
  });

  test("detalle de módulo del nivel IA carga contenido", async ({ page }) => {
    await page.goto("/nivel/ia/modulo/fundamentos-ia-desarrollo");
    await expect(page).toHaveURL(/\/nivel\/ia\/modulo\//);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();
  });

  test("certificado del nivel IA se genera sin lenguaje de examen PL-xxx", async ({ page }) => {
    await page.goto("/");
    // Sembrar el store de progreso directamente en localStorage: los 10 módulos
    // de IA completados + nombre de usuario, para no depender de 10 clics manuales.
    await page.evaluate(() => {
      const completedModules = Array.from({ length: 10 }, (_, i) => `ia-${i + 42}`);
      const state = {
        state: {
          completedModules,
          quizScores: {},
          completedLabs: [],
          checklistItems: {},
          lastVisited: null,
          userName: "Ada Lovelace",
        },
        version: 0,
      };
      window.localStorage.setItem("plan-estudio-progress", JSON.stringify(state));
    });
    await page.goto("/nivel/ia");
    await page.reload();
    await expect(page.getByText(/Nivel de Desarrollo Asistido por IA Completado/i)).toBeVisible();
    await expect(page.locator('button:has-text("Generar certificado")')).toBeVisible();

    await page.goto("/certificado/ia");
    await expect(page).toHaveURL(/\/certificado\/ia$/);
    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    await expect(page.getByText(/buenas prácticas de desarrollo asistido por IA/i)).toBeVisible();
    await expect(page.getByText(/rendir la certificación/i)).toHaveCount(0);
  });
```

- [ ] **Step 2: Build the app and run the full Playwright suite**

```bash
cd app-elearning
GITHUB_PAGES=true npm run build:pages
npx playwright install --with-deps chromium
npm run e2e
```
Expected: PASS — 16 tests (the 13 existing + the 3 new ones).

- [ ] **Step 3: Commit**

```bash
git add app-elearning/e2e/smoke.spec.ts
git commit -m "test: agregar smoke tests E2E para el nivel IA (módulo, certificado sin lenguaje de examen)"
```

---

### Task 15: Update documentation counts and add the IA transversal note

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: nothing — text-only documentation edits, no code/behavior impact.
- Produces: accurate counts (51 modules, 11 labs, 394 questions, 506 checklist criteria) and an explicit note that `ia` is transversal/non-gating, matching the actual behavior implemented in Tasks 1-14.

- [ ] **Step 1: Update `CLAUDE.md`**

Replace the repository structure module listing:

```
    modules/
      basico/01-*.md … 08-*.md          # frontmatter: moduleId, title, level, certification, estimatedMinutes, slug
      intermedio/09-*.md … 17-*.md
      avanzado/18-*.md … 30-*.md
      arquitecto/31-*.md … 41-*.md
    labs/
      lab-02-*.md, lab-03-*.md, …       # one file per lab, same frontmatter pattern
```

with:

```
    modules/
      basico/01-*.md … 08-*.md          # frontmatter: moduleId, title, level, certification, estimatedMinutes, slug
      intermedio/09-*.md … 17-*.md
      avanzado/18-*.md … 30-*.md
      arquitecto/31-*.md … 41-*.md
      ia/42-*.md … 51-*.md              # transversal level — no prerequisites, doesn't gate/get gated by the 4 levels above
    labs/
      lab-02-*.md, lab-03-*.md, …       # one file per lab, same frontmatter pattern (11 total, including lab-45 and lab-51 for the ia level)
```

Replace the question bank count:

```
- 314 total questions across 41 modules (8 per module in Niveles 2-4, 15 in Módulo 1)
```

with:

```
- 394 total questions across 51 modules (8 per module in Niveles 2-4 and Nivel IA, 15 in Módulo 1)
```

Replace the Progression Dependencies section:

```
## Progression Dependencies

**Do not skip levels.** Each level builds on the previous:

```
NIVEL 1 (PL-900) → NIVEL 2 (PL-200) → NIVEL 3 (PL-400) → NIVEL 4 (PL-600)
```
```

with:

```
## Progression Dependencies

**Do not skip levels.** Each of the 4 certification levels builds on the previous:

```
NIVEL 1 (PL-900) → NIVEL 2 (PL-200) → NIVEL 3 (PL-400) → NIVEL 4 (PL-600)
```

**Nivel IA (Desarrollo Asistido por IA) is transversal, not part of this chain.** It has no
prerequisites, doesn't gate or get gated by any of the 4 levels above, and can be studied
at any point. Completing Nivel 4 (Arquitecto) does not auto-suggest starting Nivel IA —
see `LevelCompleteBanner` in `level-progress-banner.tsx`.
```

- [ ] **Step 2: Update `README.md`**

Replace:

```
│       └── evaluaciones-simulador.js  ← Banco de 314 preguntas (fuente actual)
```

with:

```
│       └── evaluaciones-simulador.js  ← Banco de 394 preguntas (fuente actual, incluye Nivel IA)
```

- [ ] **Step 3: Update `AGENTS.md`**

Replace:

```
    evaluaciones-simulador.js   # Banco de 314 preguntas A/B/C/D en MODULE_QUESTIONS (módulos 1-41)
```

with:

```
    evaluaciones-simulador.js   # Banco de 394 preguntas A/B/C/D en MODULE_QUESTIONS (módulos 1-51, incluye Nivel IA transversal)
```

Replace:

```
  content/               # Official app content: 41 modules + 9 labs with frontmatter
```

with:

```
  content/               # Official app content: 51 modules + 11 labs with frontmatter (incl. transversal Nivel IA: modules 42-51, lab-45, lab-51)
```

Replace:

```
- 314 total questions across 41 modules
```

with:

```
- 394 total questions across 51 modules
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md AGENTS.md
git commit -m "docs: actualizar cifras y agregar nota del nivel IA transversal (CLAUDE.md, README.md, AGENTS.md)"
```

---

### Task 16: Final full verification and merge to master

**Files:**
- None — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1-15.
- Produces: a merged `master` with the feature fully deployed.

- [ ] **Step 1: Run the complete local verification pipeline**

```bash
cd app-elearning
npm run verify
```

This runs, in order: `lint` → `typecheck` → `validate:content` → `test:coverage` → `build:pages` (per the existing `package.json` script). Expected: all green, no errors.

- [ ] **Step 2: Run MkDocs strict build (the stub file from Task 1 must not break it)**

```bash
cd ..
python -m mkdocs build --strict
```
Expected: `Documentation built in X seconds` with no warnings/errors. The `ia` level is intentionally **not** added to `mkdocs.yml`'s `nav` (out of scope per the spec), so this build doesn't reference the new content at all — it only needs to still succeed for the existing 4-level content.

- [ ] **Step 3: Run the Playwright E2E suite one more time against the final build**

```bash
cd app-elearning
npm run e2e
```
Expected: PASS (16 tests).

- [ ] **Step 4: Manual smoke check in the browser**

```bash
npm run dev
```
Visit `http://localhost:3000/`, confirm the 5th level card ("🟣 IA") appears on the dashboard with a working progress ring, click into `/nivel/ia`, open one module, mark it complete, confirm the sidebar's IA mini-progress-bar updates immediately (no reload needed — this exercises the fix from the earlier progress-sync bug fix, which this new level also depends on). Stop the dev server (`Ctrl+C`).

- [ ] **Step 5: Push the branch and open a PR**

```bash
git push -u origin feature/nivel-ia-desarrollo-asistido
gh pr create --title "feat: agregar nivel transversal Desarrollo Asistido por IA (10 módulos, 2 labs, 80 preguntas)" --body "$(cat <<'EOF'
## Summary
- Nuevo nivel transversal "ia" (10 módulos 42-51, 2 labs, 80 preguntas, sección de checklist propia) cubriendo Copilot, GitHub Copilot, Claude Code y Codex aplicados a Power Platform/D365.
- No gatea ni es gateado por los 4 niveles PL-900→PL-600 existentes; no se auto-sugiere como "siguiente nivel" tras completar Arquitecto.
- Certificado propio sin lenguaje de examen oficial.
- Fix de un bug pre-existente encontrado durante la planificación: certForModule/levelForModule no cubrían módulos 42+.

## Test plan
- [ ] `npm run verify` (lint, typecheck, validate:content, test:coverage, build:pages) en verde
- [ ] `mkdocs build --strict` en verde
- [ ] `npm run e2e` en verde (16 tests)
- [ ] Revisión manual en el navegador: dashboard, nivel IA, módulo, checklist, certificado

Ver spec: `docs/superpowers/specs/2026-07-03-nivel-ia-desarrollo-asistido-design.md`
Ver plan: `docs/superpowers/plans/2026-07-03-nivel-ia-desarrollo-asistido.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Wait for CI to pass on the PR, then merge**

```bash
gh pr checks --watch
gh pr merge --squash
```

If any CI job fails, fix it on the branch, push again, and re-check — do not merge with a red CI run.

- [ ] **Step 7: Confirm the deploy succeeded**

```bash
gh run list --branch master --limit 1
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://edwingalarcon.github.io/PlanEstudio/nivel/ia
```
Expected: the latest `master` run shows `success`, and the live URL returns `HTTP 200`.

---

## Plan Self-Review Notes

- **Spec coverage:** all 7 spec sections (structure/order, 10 modules, labs, question bank, checklist, UI surface, docs) map to Tasks 2, 6, 13, 7, 8, 10-12, 15 respectively. The spec's two explicit corrections (legacy stub file necessity, `checklist-client.tsx`/`quiz-engine.ts` gaps) are called out in Global Constraints and addressed in Tasks 1, 3, 10.
- **Placeholder scan:** no "TBD"/"add appropriate X" phrasing in any step; every content task includes the literal text to write.
- **Type consistency:** `LevelId` (Task 2) is referenced identically across Tasks 3, 4, 10, 11, 12 (`"basico" | "intermedio" | "avanzado" | "arquitecto" | "ia"`); `calculateLevelProgress`/`calculateOverallProgress` from the prior progress-sync fix are unaffected (not touched by this plan) and continue to work automatically once `LEVEL_MODULE_RANGE.ia` exists, since they already derive from that constant generically.
- **Scope check:** single cohesive feature (one new transversal level), no sub-projects to split out.

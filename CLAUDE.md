# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Handoff for Claude

Before starting new work, read `SPRINT_HANDOFF.md`. It is the active operational memory for the post-audit sprints.

Current stable state as of the latest local handoff (2026-08-22):
- Latest product sprint: **Spaced Repetition & Long-Term Retention Engine** complete locally. Adds
  `/repaso`, a SM-2-inspired scheduler (`review-scheduler.ts`), eligibility/queue/interleaving logic
  (`review-queue.ts`), independent store `planestudio.spaced-repetition.v1` (`review-store.ts`), and
  versioned backup (`retention-portability.ts`). A question only becomes eligible for review once the
  student actually answers it (in a module quiz or case diagnosis) — completing a module without
  answering its quiz creates zero cards, and a card for a future module can never appear. The
  simulator explicitly does not feed the scheduler (`registerForReview={false}` on its `QuizPanel`) —
  it measures timed-exam performance, a different signal. See `SPRINT_HANDOFF.md`, section "Sprint —
  Spaced Repetition & Long-Term Retention Engine", and `docs/Recursos/SISTEMA_REPASO_ESPACIADO.md`
  for full architecture detail before touching this again.
- Previous product sprint: **Interactive Practice Engine cierre/endurecimiento** complete locally.
  The pilot still has exactly **15 simulated interactive practices** across Multiple Decision,
  Flow Builder, Query Playground and Debug Scenario. The closure adds Flow Builder drag optional
  plus keyboard/buttons, filter-selection sync, empty filter state, session-only filter persistence,
  export/import JSON with merge/replace, isolated reset, local feedback capture, review queue helpers,
  broader unit/E2E coverage, and an expanded authoring guide. See `SPRINT_HANDOFF.md`, section
  "Sprint de cierre — Interactive Practice Engine Completion & Validation", before editing it.
  Static Vercel deploys require `app-elearning/public/vercel.json` (`cleanUrls: true`) so clean
  routes like `/practica` do not 404 when deploying the exported `out/` directory.
- Previous product/content sprint: **Diagnóstico de caso aplicado** complete for all 75 modules. The
  normal quiz pool remains **508 questions**; the case-diagnosis pool now has **375 questions** (5
  per module), for **883 questions total** in the generated bank. See `SPRINT_HANDOFF.md`, section
  "Sprint — Diagnóstico de caso aplicado", for exact commits, validations and CI/deploy status.
- Previous pushed/deployed sprint: **Developer Workstation, Environment Setup & Project Foundations —
  Fase 2, sub-fases A–F, all complete** — commit `ea03d77` (`fix: corregir extracción de versión .NET,
  añadir umbral outdated y auditoría de 6 perfiles`). CI/deploy run `30579292651` completed
  successfully; production verified at `https://edwingalarcon.github.io/PlanEstudio/preparar-entorno`
  (200, `X-Cache: MISS`).
- Sub-fase summary (full detail in `SPRINT_HANDOFF.md`, section "Sprint en curso — Developer
  Workstation..."): (A) `tools/check-workstation.ps1`/`.sh` + report parser +
  `/preparar-entorno` import UI — commit `2698172`. (B) advisory (non-blocking) workstation gate on
  lab pages via `LAB_PRODUCT_TOOL_HINTS` — commit `6a12e0a`. (C) `/recursos/guia-herramientas-workstation`
  — commit `aa2b636`. (D) `GL-SETUP-01..06` guided practices + `CH-SETUP-01` challenge (first real use
  of the `guided` practiceType) — commit `91b5b8d`. (E) `INC-SETUP-001..005` incident labs — commit
  `bc3137a`. (F) fixed a real `.NET SDK` version-parsing bug in the check-workstation scripts, added
  `outdated` version-threshold logic (`minMajorVersion` in `workstation.ts`), extended
  `LAB_PRODUCT_TOOL_HINTS`, and a manual audit of the 6 workstation profiles found and fixed a real gap
  (no warning that Power Automate Desktop requires Windows for the `rpa` profile on macOS/Linux) —
  commit `ea03d77`.
- **Explicitly still open, not started, needs the user to re-supply context**: the original sprint was
  requested via a 72-section prompt from an earlier session not available in later sessions' context.
  Two items from it remain unimplemented and were NOT fabricated a scope for: (1) the exact remaining
  ~23 E2E test cases referenced as "§63" in that original prompt, (2) "starter repository templates by
  project type". Do not invent a checklist for these — ask the user for the original prompt or a fresh
  scope definition before attempting them.
- Previous product sprint: **Beginner Guided Journey & Progressive Disclosure** — commit `a14e72d`,
  GitHub Actions run `30551134055` success.
- Previous course/design sprint: **Sprint 22 — `/impeccable audit` (17/20 → 20/20 after fixes) +
  `PRODUCT.md`/`DESIGN.md`/`.impeccable/design.json` (Sprint 21)**.
- Official production URL is `https://planestudio.vercel.app/`. Vercel project name is
  `app-elearning`; `https://app-elearning.vercel.app/` is also connected as the clean Production
  domain. The old `out-gilt-tau.vercel.app` domain was removed from Vercel Settings → Domains after
  an initial static deploy from `out/` left it as the default production domain. GitHub Pages was used
  historically and may still exist as a secondary mirror, but it is no longer the release blocker.
- Fixed learning content counts: **76 modules, 72 labs, 516 quiz questions, 375 case-diagnosis
  questions, 636 checklist criteria**. Module 56 ("Fundamentos de JavaScript para Power Platform",
  `ia` level) was added 2026-08-23 as a from-scratch JS prerequisite, closing a real pedagogical gap
  found in the 2026-08-22 audit: módulo 13 (JavaScript y PCF Básico) required programming knowledge
  it never taught. Módulo 13 links to it explicitly in its "Antes de comenzar" box instead of gating
  on it. **Why moduleId 56 and not appended at 76**: `LEVEL_MODULE_RANGE` (`i18n.ts`) ranges are
  disjoint, contiguous, and load-bearing well beyond content validation — `progress.ts`
  (`getOverallProgress`, `getTotalModulesForLevel`), `quiz-engine.ts` (`levelForModule`, which scans
  `LEVEL_ORDER` and returns the *first* range match) and `questions-parser.ts`
  (`getQuestionsForLevel`) all assume no overlap. Widening `ia`'s range past its neighbors silently
  double-counts and misclassifies d365/rpa modules and questions (caught by
  `progress.test.ts`/`questions-parser.test.ts` failing with inflated totals, e.g. 96 instead of 76).
  Since all 7 levels pack moduleId 1-75 with zero gaps, the only way to add a module to `ia` without
  breaking that invariant was to open real room for it: `ia` is now `[42, 56]`, and `d365`/`rpa` each
  shifted **+1** (`d365` → `[57, 66]`, `rpa` → `[67, 76]`). This renumbered 20 module content files,
  their question-bank keys, checklist headings, and ~106 internal cross-references ("Módulo 59
  estudiado", "ver Módulo 62", etc.) across labs and docs/Recursos — done via a scripted mapping
  (see `git log` around this change), not by hand. If you ever add another module to a level that
  isn't the last in `LEVEL_ORDER`, expect the same constraint. The case-diagnosis questions are tagged with
  `appliesTo: "caso"` and are intentionally excluded from `getQuestionsForModule()` and the simulator
  quiz pool.
- Professional practice pilot counts: **32 practices total — 18 incidents, 6 challenges, 2
  simulations, 6 guided**. Do not merge these into the existing lab count. `guided` is a new count as
  of sub-fase D — `getPracticeCounts()` now returns a `guided` field in addition to
  `incidents`/`challenges`/`simulations`.
- Interactive practice pilot counts: **15 practices total**, separate from labs and professional
  practices. Do not merge these into the lab count or professional-practice count.
- `/preparar-entorno` state uses its own localStorage key `planestudio.workstation.v1`
  (`workstation-store.ts`), independent from `plan-estudio-progress` (academic),
  `planestudio.practice-progress.v1` (professional practice), `planestudio.interactive-practice.v1`
  (interactive practice) and `planestudio.spaced-repetition.v1` (spaced repetition). **Never merge
  these five stores.**
- Current local test baseline: at least **406 Vitest tests** and **65 Playwright E2E tests** (54
  pre-existing + 11 new in `e2e/spaced-repetition.spec.ts`), pending an updated count after merging in
  the local Interactive Practice closure work (unit/E2E counts for that sprint were not finalized
  before this merge — re-run `npm test` and `npm run e2e` to get the real combined totals).
- Post-audit content roadmap (sprints 1-20) is fully closed — no known pending items. Sprints 21-22
  added a design-system layer (`DESIGN.md`, "The Fluent Learning Console") and closed real a11y/perf
  bugs found via `/impeccable audit`. See `SPRINT_HANDOFF.md` sprints 21-22 for full detail before
  touching UI/markdown heading levels again.
- Recent beginner-onboarding work is intentional and should not be removed: "Primeras 2 horas", Mini
  Lab 01, checklist mínimo para principiantes, Power Fx en español simple, entregable mínimo del Nivel
  Básico, and the Módulo 9 bridge into Intermedio.
- User preference for this repo: before starting work, **fetch/pull/sync the repo and verify whether a
  merge is needed**; after completing a change, **commit, push to `master`, and wait for
  deploy/production verification** unless the user explicitly says not to. After pushing, check CI
  with a single `gh run list` query, not `gh run watch` (wastes tokens blocking the turn) — see the
  `feedback_ci_watch` memory.
- Local validation should run `npm run build:pages` or `npm run build`, then `npm run e2e`
  **serially**, not in parallel, because both can touch `.next` locally and cause transient
  route/module false negatives.

## What This Repository Is

A structured, progressive learning plan for Microsoft Power Platform and Dynamics 365 — from beginner to Solution Architect. The repo has two parallel surfaces:

1. **MkDocs site** — Markdown documentation served via MkDocs Material (legacy/reference site, reads from `docs/`)
2. **Next.js app** (`app-elearning/`) — interactive e-learning app deployed officially to Vercel at `https://planestudio.vercel.app/` (reads modules and labs from `app-elearning/content/`, NOT from `docs/`)

**Important — module content is NOT shared between the two surfaces anymore.** Since commit `8b0433c8` (2026-06-25, "migración completa — 41 módulos a archivos individuales con frontmatter"), app modules and labs live as individual files with frontmatter in `app-elearning/content/modules/<levelId>/` and `app-elearning/content/labs/`. The current app surface contains **75 modules and 72 labs across 7 levels** (4 certification levels + transversal `ia`, `d365` and `rpa`). `docs/Niveles/*.md` still exists and still feeds MkDocs, but for the Next.js app it is now dead legacy fallback code (`extractModulesFromContent` in `content.ts`) that never fires because every module already has an individual file. **When editing module content for the app, edit `app-elearning/content/modules/`, not `docs/Niveles/`.** The question bank (`docs/javascripts/evaluaciones-simulador.js`) was NOT part of this migration and remains the single source for both surfaces (see Content: Question Bank below).

## Repository Structure

```
mkdocs.yml               # MkDocs configuration
requirements.txt         # Python deps: mkdocs-material
.github/
  workflows/
    ci.yml               # Legacy CI/CD: lint → test → build → deploy to GitHub Pages secondary mirror
docs/                    # MkDocs source content — legacy/reference site only (NOT read by the Next.js app for modules/labs)
  index.md               # Master index and overview
  Niveles/
    NIVEL_1_BASICO.md    # Level 1 (MkDocs only) — 8 modules + Suplementos 1A (AI Builder) y 1B (Power Pages)
    NIVEL_2_INTERMEDIO.md  # Level 2 (MkDocs only) — 9 modules (PL-200)
    NIVEL_3_AVANZADO.md    # Level 3 (MkDocs only) — 13 modules (PL-400)
    NIVEL_4_ARQUITECTO.md  # Level 4 (MkDocs only) — 11 modules (Arquitectura Power Platform; PL-600 retirado)
  Anexos/
    LENGUAJES_PROGRAMACION.md
    COPILOT_STUDIO_COMPLETO.md
    ALM_DEVOPS_ESTRATEGIAS.md
    ARQUITECTURA_EMPRESARIAL.md
    CASOS_REALES_NEGOCIO.md
  Recursos/
    CHECKLIST_PROGRESO.md
    GLOSARIO_TERMINOS.md
    CERTIFICACIONES.md
    PROMPTS_REUTILIZABLES_IA.md  # 16 reusable prompts for AI-assisted Power Platform/D365 work (Nivel IA, /recursos/prompts-ia)
  javascripts/
    evaluaciones-simulador.js   # Banco de 891 preguntas en MODULE_QUESTIONS (módulos 1-76): 516 quiz + 375 diagnóstico de caso aplicado
  stylesheets/
    extra.css            # Custom CSS for MkDocs site
app-elearning/           # Next.js 15 interactive app (THE primary surface)
  content/               # Authoritative module/lab content for the app (migrated 2026-06-25) — edit HERE, not docs/
    modules/
      basico/01-*.md … 08-*.md          # frontmatter: moduleId, title, level, certification, estimatedMinutes, slug
      intermedio/09-*.md … 17-*.md
      avanzado/18-*.md … 30-*.md
      arquitecto/31-*.md … 41-*.md
      ia/42-*.md … 56-*.md              # transversal level (15 modules) — no prerequisites, doesn't gate/get gated by the 4 levels above; module 56 ("Fundamentos de JavaScript para Power Platform") was appended 2026-08-23, which shifted d365 to 57-66 and rpa to 67-76 — see moduleId ordering note below
      d365/56-*.md … 65-*.md            # transversal level (10 modules) — Dynamics 365 CE/F&O vocabulary, architecture, Customer Insights, Field Service and integration; same non-gating pattern as ia
    labs/
      lab-02-*.md, lab-03-*.md, …       # one file per lab, same frontmatter pattern (72 total; includes labs 45/51/52/53/54/55/56/57 for ia, 61-67 for capstones/D365 depth, 71-80 for job-ready simulations, 91-92 for CRM Developer job-ready extensibility/troubleshooting, 93-100 for F&O hands-on practitioner labs requiring a trial/demo Finance & Operations tenant, 101 for the integrated CRM Functional Analyst job-ready case (JR-013), 102-103 for Sales/post-go-live simulations, and 104-112 for the RPA track — see ROADMAP_ESPECIALIZACION_AVANZADA.md #3 for which topics are covered and the pending live-tenant verification)
  next.config.ts         # output: 'export', basePath: '/PlanEstudio'
  src/
    app/                 # App Router pages
      layout.tsx         # Root layout — Server Component; passes searchDocuments to AppShell
      page.tsx           # Home / dashboard
      nivel/[level]/
        page.tsx         # Level page with module list + LevelProgressBannerClient
        modulo/[slug]/
          page.tsx       # Module page: markdown + quiz
      simulador/page.tsx # Timed simulator (40 questions, 50 min)
      recursos/[slug]/   # Static resource pages
    components/
      layout/
        app-shell.tsx    # Client shell: mobile nav state
        topbar.tsx       # Header with SearchBar
        sidebar.tsx      # Collapsible nav with mobile overlay
        search-bar.tsx   # FlexSearch dialog (Ctrl+K)
      modules/
        level-progress-banner.tsx  # Progress bar → completion banner (trophy) at 100%
        markdown-renderer.tsx
        module-completion-client.tsx
      quiz/
        quiz-panel.tsx        # Quiz UI: question → feedback → result with error breakdown
        simulator-client.tsx  # Timed simulator wrapper
      ui/                     # shadcn/ui components (button, badge, card, dialog, progress…)
    lib/
      content.ts          # Reads app-elearning/content/modules|labs/ (authoritative); falls back to docs/Niveles/*.md only for a moduleId with no individual file (currently none — dead path in practice)
      quiz-engine.ts      # Pure TS engine: createSession, recordAttempt, calculateResult
      questions-parser.ts # Parses MODULE_QUESTIONS from evaluaciones-simulador.js at build time
      progress.ts         # Zustand store (persist → localStorage): completedModules, quizScores
      i18n.ts             # UI strings, LevelId, LEVEL_ORDER, LEVEL_MODULE_RANGE
      utils.ts            # cn() helper
site/                    # MkDocs generated output (git-ignored)
```

## Running Locally

### Next.js app (primary)
```powershell
cd app-elearning
npm install
npm run dev          # http://localhost:3000
npm test             # Vitest unit tests (406 tests)
npm run test:coverage
npm run lint
npm run typecheck
npm run validate:content  # Content + assets + interactive-practices + spaced-repetition validation
npm run validate:interactive-practices
npm run validate:spaced-repetition
npm run build        # Static export for official Vercel/root hosting → app-elearning/out/
npm run build:pages  # Static export for legacy GitHub Pages → app-elearning/out/
npm run e2e          # Playwright smoke tests (65 tests)
```

### MkDocs (reference/legacy)
```powershell
pip install -r requirements.txt
mkdocs serve --dev-addr=127.0.0.1:8001
```

## CI/CD

Push to `master` → GitHub Actions (`ci.yml`):
1. **Lint & Type Check** — ESLint + `tsc --noEmit`
2. **Unit Tests** — Vitest with coverage (80% threshold)
3. **Playwright Smoke** — end-to-end checks for main routes, labs, search, progress, certificates and onboarding guardrails
4. **Build** — `next build` → static export in `app-elearning/out/`
5. **Deploy** — legacy GitHub Pages mirror; official production is Vercel

**If CI fails:** check ESLint errors first (most common cause). Run `npm run lint` locally before pushing.

## Content: Module Format

Each module follows this fixed 7-section structure:

1. **🎯 Objetivo** — what the learner can do upon completion
2. **📖 Conceptos Clave** — theoretical knowledge list
3. **👨‍💻 Actividades Prácticas Paso a Paso** — numbered, sequential exercises with code snippets
4. **💼 Casos Reales de Negocio** — business scenarios
5. **✅ Buenas Prácticas** — design, performance, security, governance notes
6. **⚠️ Errores Comunes** — common pitfalls with diagnosis and fix
7. **🧪 Criterios de Validación** — checkbox list for completion

Maintain this structure strictly when adding or editing modules. Edit the individual file in `app-elearning/content/modules/<levelId>/NN-slug.md` — this is what the app renders. `docs/Niveles/*.md` still needs the same content kept in sync manually if you want MkDocs (the legacy site) to show it too, but it has no effect on the Next.js app.

## Content: Module Frontmatter (Next.js app)

Each file in `app-elearning/content/modules/<levelId>/` starts with YAML frontmatter parsed by `gray-matter`:

```yaml
---
moduleId: 9
title: "Dataverse Avanzado"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 9
slug: "dataverse-avanzado"
---
```

The body below the frontmatter starts directly with `### 🎯 Objetivo` (H3, no "Módulo N: Title" heading — the title comes from frontmatter, not from parsing the heading text). `moduleId` must be unique and fall inside that level's range from `LEVEL_MODULE_RANGE` (`i18n.ts`); `slug` must match the filename's routing slug used in `/nivel/[level]/modulo/[slug]`.

## Content: Heading Formats (legacy MkDocs / docs/ only)

`docs/Niveles/*.md` (MkDocs-only now) still uses the old monolithic-file heading convention, extracted by a regex in `content.ts` (`extractModulesFromContent`) that is dead code for the Next.js app in practice (every module already has an individual file, so the fallback never fires) but is still what MkDocs relies on structurally:
```
/^#{2,3}\s+\*?\*?módulo\s+(\d+)[:\s]+(.+?)\*?\*?$/gim
```
- **Nivel 1** uses: `### **Módulo N: Title**` (H3, bold)
- **Niveles 2-4** use: `## MÓDULO N: Title` (H2, uppercase)

Don't change these if editing `docs/Niveles/*.md` for MkDocs.

## Content: Question Bank

`docs/javascripts/evaluaciones-simulador.js` contains `MODULE_QUESTIONS` — a JS object with keys 1-75, each an array of question objects:

```js
{
  type: "single" | "multi",
  prompt: "Question text",
  options: ["A", "B", "C", "D"],
  answer: [0],           // 0-based indices of correct options
  explanation: "Why the answer is correct...",
  appliesTo: "caso" // optional; reserve "caso" for Diagnóstico de caso aplicado
}
```

- 891 total questions across 76 modules: 516 normal quiz questions + 375 `appliesTo: "caso"` questions
- Module 1 has 15 questions (includes AI Builder and Power Pages topics for PL-900)
- After editing, validate with Node.js that the object parses correctly
- `scripts/extract-questions.mjs` parses `evaluaciones-simulador.js` via `vm.runInContext` at `prebuild` time and generates `app-elearning/src/data/questions.ts`, which `questions-parser.ts` imports statically (no runtime `eval`/`new Function`)

## Naming and Prefix Conventions

- Markdown files: `SCREAMING_SNAKE_CASE.md`
- Dataverse column prefixes: publisher convention (e.g., `cr123_`, `sit_`, `sse_`) — never `new_`
- Power Fx controls: `btnGuardar`, `galSolicitudes`, `txtBusqueda` (type prefix + PascalCase)

## Progression Dependencies

**Do not skip levels.** Each of the 4 certification levels builds on the previous:

```
NIVEL 1 (PL-900) → NIVEL 2 (PL-200) → NIVEL 3 (PL-400) → NIVEL 4 (Arquitectura Power Platform)
```

**Nivel IA (Desarrollo Asistido por IA) and Nivel D365 (Dynamics 365 Enterprise Apps) are transversal,
not part of this chain.** Neither has prerequisites, neither gates or is gated by the 4 levels
above or by each other, and both can be studied at any point. Completing Nivel 4 (Arquitecto)
does not auto-suggest starting Nivel IA or Nivel D365 — see `LevelCompleteBanner` in
`level-progress-banner.tsx`. Nivel D365 (Módulos 56-65) covers Dynamics 365 CE, Contact Center, Customer Insights, Field Service, CE+F&O integration and
architecture; its hands-on practice lives in the professional-route capstones it feeds (Lab 66
Sales, Lab 67 Customer Insights - Data, Lab 60 Microsoft Business Applications capstone, Lab 64
F&O Awareness), not in a dedicated level-closing project of its own.

## Language

All content is written in **Spanish**. Technical terms (Power Fx, DAX, Canvas, Model-Driven, Dataverse, etc.) stay in English as proper product names. Microsoft Entra ID is the current name for Azure Active Directory (renamed July 2023).

## Diagrams (Mermaid)

Both surfaces render ` ```mermaid ` fenced blocks as diagrams:
- **MkDocs**: via `pymdownx.superfences` custom fence config in `mkdocs.yml`.
- **Next.js app**: via the `mermaid` npm package, dynamically imported client-side in `src/components/modules/mermaid-diagram.tsx` and wired into `MarkdownRenderer`'s `pre` override (`markdown-renderer.tsx`) — a fenced block with `language-mermaid` renders `<MermaidDiagram>` instead of a code block. Adapts to light/dark via `next-themes`.

Use Mermaid diagrams for architecture/flow content in Nivel 3-4 modules where a visual adds real clarity (layered architecture, integration topology, sequence flows) — don't add them just to add them.

## Code Snippets Style

- Power Fx → ` ```js ` syntax highlighting
- DAX → ` ```dax `
- Power Query M → ` ```m `
- C# → ` ```csharp `
- Annotate non-obvious lines with `//` comments inline.

## Content Quality Standards

- Prioritize real-world business scenarios over toy examples.
- Prefer enterprise-grade practices.
- Avoid duplicate content across modules.
- Maintain consistency with adjacent levels.
- Align with current Microsoft documentation and product names.
- All code snippets must compile/run correctly — no pseudocode presented as real API.

## Before Making Changes

Always:

1. Read the relevant module file before editing.
2. Run `npm run lint` and `npx tsc --noEmit` locally before pushing.
3. Verify navigation consistency (module slugs, level IDs).
4. Preserve module 7-section structure.
5. Avoid introducing advanced topics prematurely (respect level progression).
6. Validate `evaluaciones-simulador.js` with Node.js after adding questions.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

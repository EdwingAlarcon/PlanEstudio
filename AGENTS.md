# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Current Handoff for Codex

Before starting new work, read `SPRINT_HANDOFF.md`. It is the active operational memory for the post-audit sprints.

Current stable state as of the latest pushed `master` commit:
- Latest pushed product/content sprint: **Diagnóstico de caso aplicado** completo para los 75 módulos — commits `bc205885` (IA), `5ba5131e` (D365) y `450137ce` (RPA). Validación local final: `validate:content`, `lint`, `typecheck`, `test:coverage` (323/323), `build:pages` y `npm run e2e` (47/47). GitHub Actions run manual `31127332409` quedó en cola para el commit `450137ce` por capacidad/cola remota, sin pasos ejecutados ni evidencia de fallo local.
- Previous pushed/deployed product sprint: **Beginner Guided Journey & Progressive Disclosure** — commit `a14e72d` (`feat: añadir recorrido guiado para principiantes`), GitHub Actions run `30551134055` success, GitHub Pages verified.
- Previous product sprint: **Practice Experience Integration** — commit `6e0604ac` (`feat: integrar seguimiento de experiencia practica`), GitHub Actions run `30419768845` success, GitHub Pages verified.
- Previous course/design sprint: **Sprint 22 — `/impeccable audit` (17/20 → 20/20 after fixes) + `PRODUCT.md`/`DESIGN.md`/`.impeccable/design.json` (Sprint 21)**.
- Beginner-onboarding work is intentional and should not be removed: "Primeras 2 horas", Mini Lab 01, checklist mínimo para principiantes, Power Fx en español simple, entregable mínimo del Nivel Básico, Módulo 9 bridge into Intermedio, and the beginner guided route surfaced through `/mi-ruta`, `/mapa`, and `/experiencia-practica`.
- Professional Practice Framework has daily UX integration: capa `Experiencia práctica` con 18 Incident Labs, 6 Challenge Labs, 2 Work Simulations y 6 guided practices, metadata tipada/validada, matriz de competencias práctica, navegación `/experiencia-practica`, progreso práctico independiente, pistas escalonadas, intentos, notas, evidencias, solución colapsada y autoevaluación por rúbrica.
- GitHub Pages production has been verified at `https://edwingalarcon.github.io/PlanEstudio/`.
- Fixed learning content counts: **75 modules, 72 labs, 508 quiz questions, 375 case-diagnosis questions, 633 checklist criteria**.
- Professional practice counts: **32 practices total — 18 incidents, 6 challenges, 2 simulations, 6 guided**. Do not merge these into the existing lab count.
- Practical progress uses separate localStorage key `planestudio.practice-progress.v1`; academic progress remains `plan-estudio-progress`. Do not merge these stores or show a single combined percentage.
- Current local test baseline: **323 Vitest tests** and **47 Playwright smoke tests**.
- User preference for this repo: before work, fetch/sync the repo and resolve merge needs; after completing a change, **commit, push to `master`, and wait for deploy/production verification** unless the user explicitly says not to.
- Local validation should run `npm run build:pages` or `npm run build`, then `npm run e2e` **serially**, because both can touch `.next` locally and cause transient route/module false negatives.

## What This Repository Is

A structured, progressive learning plan for Microsoft Power Platform and Dynamics 365 — from beginner to Solution Architect. The repo has two parallel surfaces:

1. **Next.js app** (`app-elearning/`) — primary interactive e-learning app deployed to GitHub Pages at `https://edwingalarcon.github.io/PlanEstudio/`
2. **MkDocs site** — Markdown documentation served via MkDocs Material (legacy/reference site)

`app-elearning/content/` is the authoritative source for modules and labs rendered by the Next.js app. `docs/` remains for MkDocs legacy/reference content and shared resources such as the question bank.

## Repository Structure

```
mkdocs.yml               # MkDocs configuration
requirements.txt         # Python deps: mkdocs-material
.github/
  workflows/
    ci.yml               # CI/CD: lint → test → build → deploy to GitHub Pages (on push to master)
docs/                    # MkDocs legacy/reference content + shared question bank
  index.md               # Master index and overview
  Niveles/
    NIVEL_1_BASICO.md    # Level 1: Fundamentals — 8 modules + Suplementos 1A (AI Builder) y 1B (Power Pages)
    NIVEL_2_INTERMEDIO.md  # Level 2: Intermediate — 9 modules (PL-200)
    NIVEL_3_AVANZADO.md    # Level 3: Advanced — 13 modules (PL-400)
    NIVEL_4_ARQUITECTO.md  # Level 4: Architect — 11 modules (Arquitectura Power Platform; PL-600 retirado)
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
    PROMPTS_REUTILIZABLES_IA.md
  javascripts/
    evaluaciones-simulador.js   # Banco de 883 preguntas en MODULE_QUESTIONS (módulos 1-75): 508 quiz + 375 diagnóstico de caso aplicado
  stylesheets/
    extra.css            # Custom CSS for MkDocs site
app-elearning/           # Next.js 15 interactive app (THE primary surface)
  content/               # Official app content: 75 modules + 72 labs with frontmatter across 7 levels (incl. Nivel IA 42-55, Nivel D365 56-65, Nivel RPA 66-75, job-ready simulations, F&O hands-on labs and route capstones)
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
      content.ts          # Build-time: reads app-elearning/content and validates frontmatter
      quiz-engine.ts      # Pure TS engine: createSession, recordAttempt, calculateResult
      questions-parser.ts # Reads generated src/data/questions.ts and validates module association
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
npm test             # Vitest unit tests
npm run test:coverage
npm run lint
npm run typecheck
npm run validate:content  # Frontmatter, unique moduleId/slug, level ranges, question coverage
npm run build:pages  # Static export for GitHub Pages → app-elearning/out/
npm run e2e          # Playwright smoke tests
npm run verify       # lint + typecheck + coverage + build:pages
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
3. **E2E Smoke** — Playwright checks home, levels, module detail, labs, simulator, search, dark mode, navigation, 404
4. **Build** — `npm run build:pages` → static export in `app-elearning/out/`
5. **MkDocs strict** — validates legacy/reference site
6. **Deploy** — `actions/deploy-pages` → `https://edwingalarcon.github.io/PlanEstudio/`

**If CI fails:** check ESLint errors first (most common cause). Run `npm run lint` locally before pushing.

## Content: Module Format

Each app module in `app-elearning/content/modules/<levelId>/NN-slug.md` uses YAML frontmatter:

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

The build validates required frontmatter, unique `moduleId`, unique `slug`, valid level ranges, lab metadata, and question/module association.

Each module follows this fixed 7-section structure:

1. **🎯 Objetivo** — what the learner can do upon completion
2. **📖 Conceptos Clave** — theoretical knowledge list
3. **👨‍💻 Actividades Prácticas Paso a Paso** — numbered, sequential exercises with code snippets
4. **💼 Casos Reales de Negocio** — business scenarios
5. **✅ Buenas Prácticas** — design, performance, security, governance notes
6. **⚠️ Errores Comunes** — common pitfalls with diagnosis and fix
7. **🧪 Criterios de Validación** — checkbox list for completion

Maintain this structure strictly when adding or editing modules.

## Content: Heading Formats (legacy MkDocs only)

The legacy `docs/Niveles/*.md` files still use monolithic headings. They are for MkDocs/reference; the Next.js app uses `app-elearning/content/modules/`. The fallback parser still uses this regex:
```
/^#{2,3}\s+\*?\*?módulo\s+(\d+)[:\s]+(.+?)\*?\*?$/gim
```

- **Nivel 1** uses: `### **Módulo N: Title**` (H3, bold)
- **Niveles 2-4** use: `## MÓDULO N: Title` (H2, uppercase)

Do NOT change these heading formats in `docs/Niveles/*.md` unless you intentionally update the MkDocs/reference structure.

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

- 883 total questions across 75 modules: 508 normal quiz questions + 375 `appliesTo: "caso"` questions
- Module 1 has 15 questions (includes AI Builder and Power Pages topics for PL-900)
- After editing, run `node ../scripts/extract-questions.mjs` from `app-elearning` or run `npm run build:pages`
- `scripts/extract-questions.mjs` generates `app-elearning/src/data/questions.ts`; `questions-parser.ts` validates associations at build/test time

## Naming and Prefix Conventions

- Markdown files: `SCREAMING_SNAKE_CASE.md`
- Dataverse column prefixes: publisher convention (e.g., `cr123_`, `sit_`, `sse_`) — never `new_`
- Power Fx controls: `btnGuardar`, `galSolicitudes`, `txtBusqueda` (type prefix + PascalCase)

## Progression Dependencies

**Do not skip levels.** Each level builds on the previous:

```
NIVEL 1 (PL-900) → NIVEL 2 (PL-200) → NIVEL 3 (PL-400) → NIVEL 4 (Arquitectura Power Platform)
```

**Nivel IA and Nivel D365 are transversal, not part of this chain.** Neither has prerequisites,
neither gates or is gated by the 4 levels above or by each other, and both can be studied at any
point.

## Language

All content is written in **Spanish**. Technical terms (Power Fx, DAX, Canvas, Model-Driven, Dataverse, etc.) stay in English as proper product names. Microsoft Entra ID is the current name for Azure Active Directory (renamed July 2023).

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

1. Read the relevant module/lab file in `app-elearning/content/` before editing app content.
2. Run `npm run lint`, `npm run typecheck`, `npm run test:coverage`, and `npm run build:pages` locally before pushing.
3. Verify navigation consistency (module slugs, level IDs).
4. Preserve module 7-section structure.
5. Avoid introducing advanced topics prematurely (respect level progression).
6. Validate `evaluaciones-simulador.js` with Node.js after adding questions.

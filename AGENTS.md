# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What This Repository Is

A structured, progressive learning plan for Microsoft Power Platform and Dynamics 365 — from beginner to Solution Architect. The repo has two parallel surfaces:

1. **MkDocs site** — Markdown documentation served via MkDocs Material (legacy/reference site)
2. **Next.js app** (`app-elearning/`) — interactive e-learning app deployed to GitHub Pages at `https://edwingalarcon.github.io/PlanEstudio/`

## Repository Structure

```
mkdocs.yml               # MkDocs configuration
requirements.txt         # Python deps: mkdocs-material
.github/
  workflows/
    ci.yml               # CI/CD: lint → test → build → deploy to GitHub Pages (on push to master)
docs/                    # Source content — shared by MkDocs AND parsed by the Next.js app
  index.md               # Master index and overview
  Niveles/
    NIVEL_1_BASICO.md    # Level 1: Fundamentals — 8 modules + Suplementos 1A (AI Builder) y 1B (Power Pages)
    NIVEL_2_INTERMEDIO.md  # Level 2: Intermediate — 9 modules (PL-200)
    NIVEL_3_AVANZADO.md    # Level 3: Advanced — 13 modules (PL-400)
    NIVEL_4_ARQUITECTO.md  # Level 4: Architect — 11 modules (PL-600)
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
  javascripts/
    evaluaciones-simulador.js   # Banco de 215 preguntas A/B/C/D en MODULE_QUESTIONS (módulos 1-41)
  stylesheets/
    extra.css            # Custom CSS for MkDocs site
app-elearning/           # Next.js 15 interactive app (THE primary surface)
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
      content.ts          # Build-time: reads docs/*.md, extracts ModuleInfo + SearchDocument
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
npm test             # Vitest unit tests (72 tests)
npm run test:coverage
npm run lint
npx tsc --noEmit
npm run build        # Static export → app-elearning/out/
```

### MkDocs (reference/legacy)
```powershell
pip install -r requirements.txt
& "C:\Users\bdp_u\AppData\Roaming\Python\Python314\Scripts\mkdocs.exe" serve --dev-addr=127.0.0.1:8001
```

## CI/CD

Push to `master` → GitHub Actions (`ci.yml`):
1. **Lint & Type Check** — ESLint + `tsc --noEmit`
2. **Unit Tests** — Vitest with coverage (80% threshold)
3. **Build** — `next build` → static export in `app-elearning/out/`
4. **Deploy** — `actions/deploy-pages` → `https://edwingalarcon.github.io/PlanEstudio/`

**If CI fails:** check ESLint errors first (most common cause). Run `npm run lint` locally before pushing.

## Content: Module Format

Each module in the Nivel files follows this fixed 7-section structure:

1. **🎯 Objetivo** — what the learner can do upon completion
2. **📖 Conceptos Clave** — theoretical knowledge list
3. **👨‍💻 Actividades Prácticas Paso a Paso** — numbered, sequential exercises with code snippets
4. **💼 Casos Reales de Negocio** — business scenarios
5. **✅ Buenas Prácticas** — design, performance, security, governance notes
6. **⚠️ Errores Comunes** — common pitfalls with diagnosis and fix
7. **🧪 Criterios de Validación** — checkbox list for completion

Maintain this structure strictly when adding or editing modules.

## Content: Heading Formats (critical for parser)

The Next.js app parses modules from the Markdown files using this regex:
```
/^#{2,3}\s+\*?\*?módulo\s+(\d+)[:\s]+(.+?)\*?\*?$/gim
```

- **Nivel 1** uses: `### **Módulo N: Title**` (H3, bold)
- **Niveles 2-4** use: `## MÓDULO N: Title` (H2, uppercase)

Do NOT change these heading formats — the parser depends on them to extract module content.

## Content: Question Bank

`docs/javascripts/evaluaciones-simulador.js` contains `MODULE_QUESTIONS` — a JS object with keys 1-41, each an array of question objects:

```js
{
  type: "single" | "multi",
  prompt: "Question text",
  options: ["A", "B", "C", "D"],
  answer: [0],           // 0-based indices of correct options
  explanation: "Why the answer is correct..."
}
```

- 215 total questions across 41 modules
- Module 1 has 15 questions (includes AI Builder and Power Pages topics for PL-900)
- After editing, validate with Node.js that the object parses correctly
- The parser in `questions-parser.ts` uses `new Function()` to evaluate it at build time

## Naming and Prefix Conventions

- Markdown files: `SCREAMING_SNAKE_CASE.md`
- Dataverse column prefixes: publisher convention (e.g., `cr123_`, `sit_`, `sse_`) — never `new_`
- Power Fx controls: `btnGuardar`, `galSolicitudes`, `txtBusqueda` (type prefix + PascalCase)

## Progression Dependencies

**Do not skip levels.** Each level builds on the previous:

```
NIVEL 1 (PL-900) → NIVEL 2 (PL-200) → NIVEL 3 (PL-400) → NIVEL 4 (PL-600)
```

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

1. Read the relevant module file before editing.
2. Run `npm run lint` and `npx tsc --noEmit` locally before pushing.
3. Verify navigation consistency (module slugs, level IDs).
4. Preserve module 7-section structure.
5. Avoid introducing advanced topics prematurely (respect level progression).
6. Validate `evaluaciones-simulador.js` with Node.js after adding questions.

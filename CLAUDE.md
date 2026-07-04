# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A structured, progressive learning plan for Microsoft Power Platform and Dynamics 365 — from beginner to Solution Architect. The repo has two parallel surfaces:

1. **MkDocs site** — Markdown documentation served via MkDocs Material (legacy/reference site, reads from `docs/`)
2. **Next.js app** (`app-elearning/`) — interactive e-learning app deployed to GitHub Pages at `https://edwingalarcon.github.io/PlanEstudio/` (reads modules and labs from `app-elearning/content/`, NOT from `docs/`)

**Important — module content is NOT shared between the two surfaces anymore.** Since commit `8b0433c8` (2026-06-25, "migración completa — 41 módulos a archivos individuales con frontmatter"), all 41 modules and all labs live as individual files with frontmatter in `app-elearning/content/modules/<levelId>/` and `app-elearning/content/labs/`. `docs/Niveles/*.md` still exists and still feeds MkDocs, but for the Next.js app it is now dead legacy fallback code (`extractModulesFromContent` in `content.ts`) that never fires because every module already has an individual file. **When editing module content for the app, edit `app-elearning/content/modules/`, not `docs/Niveles/`.** The question bank (`docs/javascripts/evaluaciones-simulador.js`) was NOT part of this migration and remains the single source for both surfaces (see Content: Question Bank below).

## Repository Structure

```
mkdocs.yml               # MkDocs configuration
requirements.txt         # Python deps: mkdocs-material
.github/
  workflows/
    ci.yml               # CI/CD: lint → test → build → deploy to GitHub Pages (on push to master)
docs/                    # MkDocs source content — legacy/reference site only (NOT read by the Next.js app for modules/labs)
  index.md               # Master index and overview
  Niveles/
    NIVEL_1_BASICO.md    # Level 1 (MkDocs only) — 8 modules + Suplementos 1A (AI Builder) y 1B (Power Pages)
    NIVEL_2_INTERMEDIO.md  # Level 2 (MkDocs only) — 9 modules (PL-200)
    NIVEL_3_AVANZADO.md    # Level 3 (MkDocs only) — 13 modules (PL-400)
    NIVEL_4_ARQUITECTO.md  # Level 4 (MkDocs only) — 11 modules (PL-600)
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
    evaluaciones-simulador.js   # Banco de preguntas A/B/C/D en MODULE_QUESTIONS (módulos 1-41) — shared by BOTH surfaces, not migrated
  stylesheets/
    extra.css            # Custom CSS for MkDocs site
app-elearning/           # Next.js 15 interactive app (THE primary surface)
  content/               # Authoritative module/lab content for the app (migrated 2026-06-25) — edit HERE, not docs/
    modules/
      basico/01-*.md … 08-*.md          # frontmatter: moduleId, title, level, certification, estimatedMinutes, slug
      intermedio/09-*.md … 17-*.md
      avanzado/18-*.md … 30-*.md
      arquitecto/31-*.md … 41-*.md
      ia/42-*.md … 51-*.md              # transversal level — no prerequisites, doesn't gate/get gated by the 4 levels above
    labs/
      lab-02-*.md, lab-03-*.md, …       # one file per lab, same frontmatter pattern (11 total, including lab-45 and lab-51 for the ia level)
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
npm test             # Vitest unit tests (127 tests)
npm run test:coverage
npm run lint
npx tsc --noEmit
npm run validate:content  # Frontmatter, unique moduleId/slug, level ranges, question coverage
npm run build        # Static export → app-elearning/out/
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
3. **Build** — `next build` → static export in `app-elearning/out/`
4. **Deploy** — `actions/deploy-pages` → `https://edwingalarcon.github.io/PlanEstudio/`

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

- 394 total questions across 51 modules (8 per module in Niveles 2-4 and Nivel IA, 15 in Módulo 1)
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
NIVEL 1 (PL-900) → NIVEL 2 (PL-200) → NIVEL 3 (PL-400) → NIVEL 4 (PL-600)
```

**Nivel IA (Desarrollo Asistido por IA) is transversal, not part of this chain.** It has no
prerequisites, doesn't gate or get gated by any of the 4 levels above, and can be studied
at any point. Completing Nivel 4 (Arquitecto) does not auto-suggest starting Nivel IA —
see `LevelCompleteBanner` in `level-progress-banner.tsx`.

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

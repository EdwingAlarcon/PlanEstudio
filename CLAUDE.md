# CLAUDE.md

## Piloto Learning by Doing — Módulos 11, 10 y 13 (2026-09-21 → 2026-10-06)

Antes de una eventual migración masiva del curso hacia una arquitectura "aprender haciendo", se
validó el enfoque en tres módulos piloto. **Fase 0 (correcciones estructurales, cerrada):** se
eliminaron 11 dependencias cruzadas objetivamente rotas del campo `prerequisites` de labs — 9 labs
de Arquitecto (N4) y 1 de N6 que gateaban sobre el Módulo 60/53 (transversales D365/IA, que por
diseño no deben gatear ni ser gateados por los 4 niveles de certificación), y 1 lab de Intermedio
(lab-62) que gateaba sobre un módulo de Avanzado (Módulo 20) sin que su propio cuerpo lo
mencionara. También se completó el Módulo 68 (RPA) con pasos reales de instalación de Power
Automate for desktop, cerrando un cruce de referencias roto con `GUIA_HERRAMIENTAS_WORKSTATION.md`.
**Piloto 1 (Módulo 11, Power Automate Avanzado):** reescrito en microlecciones con práctica
continua, evidencia de tenant estructurada, pistas escalonadas con gating real
(`getHintUnlockState` — pista N exige un intento nuevo tras revelar pista N-1; "Ver solución"
bloqueado hasta agotar las 3), troubleshooting síntoma-primero y un reto de transferencia. **Piloto
2 (Módulo 10, Canvas Apps — Componentes y Reutilización):** mismo patrón aplicado por primera vez a
una interfaz visual (Power Apps Studio) en vez de un editor de lógica — valida la hipótesis con una
observación menor: el reto "sin pasos" depende más de que el alumno ya sepa usar controles como
Timer, mitigado con pista cruzada a la micropráctica anterior. **Piloto 3 (Módulo 13, JavaScript y
PCF Básico):** mismo patrón aplicado a código de cliente (JS de formulario + control PCF en
TypeScript/React) en vez de una interfaz visual o un editor de lógica. Resolvió primero la
inconsistencia curricular que lo bloqueaba — el prerrequisito de JavaScript enlazaba directo al
Módulo 56 (Nivel IA, transversal, no alcanzable en la ruta de certificación pura) — creando el
recurso puente `/recursos/fundamentos-js-ts-react-para-pcf` (cubre TypeScript/React mínimo sin
duplicar contenido; remite a Módulo 56 solo como profundización opcional de JS puro), con el mismo
patrón que ya usan los puentes de C#/.NET y TypeScript/React para PCF Avanzado. El "Caso Real de
Negocio" del Módulo 13 se mantuvo textualmente idéntico porque las preguntas de diagnóstico de caso
(`appliesTo: "caso"`) referencian sus hechos exactos. Los tres pilotos reutilizan el motor de
prácticas interactivas existente (`interactive-practices.ts`) y `pilot-mastery.ts`, generalizado a
`calculatePilotMastery(records, config)` para no duplicar lógica entre módulos — sin tipos de
práctica (engine) ni stores nuevos; Módulo 13 sí agregó un **dominio** nuevo (`javascript`) al
catálogo porque ninguno de los 6 dominios existentes describe código de cliente JS/TS/PCF. Se
agregaron 9 prácticas nuevas en total (IP-PA-005/006, IP-APP-004/005/006, IP-JS-001/002/003/004),
subiendo el tope del piloto de 15 a 24 en `validate-interactive-practices.ts` y
`interactive-practices.test.ts`. No se tocó ningún otro módulo ni las Fases 1-6 del rediseño más
amplio, que siguen pendientes de aprobación explícita. Su definición **no se conservó** del plan
original; la propuesta vigente (2026-10-08) está en `PROPUESTA_FASES_APRENDER_HACIENDO.md`. **Fase 1 hecha**
(línea base: 3/76 módulos con reto de transferencia; `npm run audit:lbd`; tope de prácticas en
`MIN/MAX_INTERACTIVE_PRACTICES`, hoy 12-24, que solo sube al aprobar cada fase). Fases 2-5 y el recorte de la
Fase 6 (solo Módulos 43, 44, 46, 54, 55) siguen sin implementar.

## Mantenimiento vigente — 2026-10-01

Se cerraron los tres ítems que seguían abiertos, con el alcance que eligió el usuario: (1) **MkDocs**: se retiró del CI
el job `mkdocs` (validación `mkdocs build --strict`) y `deploy` ya no depende de él; MkDocs queda **congelado**:
`mkdocs.yml`, `requirements.txt` y `docs/` se conservan porque `docs/` sigue siendo fuente de recursos y del banco de
preguntas, pero ya nada lo valida ni lo despliega. (2) **E2E "§63"**: sin el prompt original, se auditaron rutas y
funciones contra los specs existentes y se cubrieron los huecos reales en `e2e/coverage-routes-labs.spec.ts`
(9 tests: `/rutas`, `/rutas/[slug]` y su 404, `/mapa`, panel "Antes de empezar", gate de prerrequisitos de LAB-111 en
modo guiado y libre, soluciones de referencia de capstones, insignia "Verificado", manifest PWA y `sw.js`).
El "§63" original queda **cerrado por sustitución**, no por cumplimiento literal de una lista que no se tiene.
(3) **Plantillas de repositorio**: recurso `docs/Recursos/PLANTILLAS_REPOSITORIO_POR_PROYECTO.md`
(`/recursos/plantillas-repositorio-por-proyecto`): estructura recomendada para PCF, plugin C#, solución ALM, Power
Pages, Code App y RPA; es documentación, **no** repositorios descargables. Recursos: 38 páginas.
Dato útil: el modo de navegación por defecto es **guiado**; para probar el modo libre hay que activarlo desde `/mi-ruta#roles`.

## Mantenimiento vigente — 2026-09-30

Mejoras de producto (sin ampliar contenido): (1) **backup completo** en `/progreso`
(`src/lib/progress-backup.ts` + `FullBackupPanel`): un JSON versionado con los 6 stores persistidos
(`plan-estudio-progress`, `plan-estudio-onboarding` y las 4 claves `planestudio.*`); los stores siguen
independientes, solo se leen/escriben sus payloads crudos y la página recarga para rehidratar. Merge
une solo el progreso académico; el resto solo se rellena si está vacío (sus paneles propios hacen merge fino).
(2) **`lastVerified: "AAAA-MM"`** opcional en frontmatter de módulos y labs (sembrado `2026-09` en los 149
archivos por la auditoría de vigencia); badge en el módulo y advertencia (no error) en `validate:content`
para elementos sin verificar o con más de 6 meses (`content-freshness.ts`). (3) **Notas por módulo**
(`moduleNotes` en el store académico) y tarjeta **Continuar** en el home (`lastVisited` ya existía pero
nunca se escribía). (4) **PWA**: `manifest.ts`, `public/sw.js` (páginas network-first, `/_next/static`
cache-first; solo se registra en producción) e iconos; subir `CACHE_VERSION` en `sw.js` invalida todo.
(5) CI: E2E en 3 shards. (6) Historial de sprints movido a `HISTORIAL_CLAUDE.md` (CLAUDE.md conserva solo invariantes). No se movió el banco de preguntas (MkDocs lo carga en su simulador) MkDocs quedó congelado el 2026-10-01.
Validación: `npm run verify` (464 tests) y E2E nuevo `e2e/progress-backup.spec.ts` (3/3); flujo probado en
Chromium sobre `out/` (offline, backup ida y vuelta). Sync entre dispositivos y analítica NO se implementaron
(requieren cuentas/consentimiento).

## Mantenimiento vigente — 2026-09-07

Corrección de navegación guiada: los prerrequisitos explícitos de labs admiten módulo individual,
listas, rangos y prefijos IA/D365/RPA; se conserva una advertencia no bloqueante por requisito
original si falta cualquier módulo. Referencias a labs y números ajenos no se interpretan como módulos.
El buscador clasifica IA/D365/RPA como especializaciones transversales antes de evaluar dificultad.

Conteos actuales verificados: **76 módulos, 73 labs, 516 preguntas quiz + 375 de diagnóstico
(891 en total), 636 criterios, 32 prácticas profesionales y 15 prácticas interactivas**.
Las cifras anteriores de las secciones históricas describen sus respectivos sprints.
Validación local ejecutada: `npm run verify` completo (lint, typecheck, contenido/recursos,
454 tests con cobertura y build:pages), seguido de `npm run e2e`: **89/89** en 5.8 minutos.
Cobertura global: 91.89% líneas, 80.99% ramas; build exportó 286 páginas.
Se añadieron 10 casos de prueba. Cambio publicado en `master`: **`e01be5b8`**.
Vercel confirmó Production success (deployment GitHub `6315926020`,
[Vercel](https://vercel.com/edwingalarcons-projects/planestudio/EqBDBQeJ9rKNhXrt3SrQmrpquhNB)).
Comprobación real en `https://planestudio.vercel.app/` con Chromium aislado: LAB-111 muestra
la advertencia sin progreso y la retira al completar ambos módulos; el buscador etiqueta
los módulos IA/D365/RPA como Otra especializacion; sin errores JavaScript de página.
CI de producto: [run 34160447773](https://github.com/EdwingAlarcon/PlanEstudio/actions/runs/34160447773);
lint/typecheck, unit tests y MkDocs aprobados al registrar esta evidencia; resto aún en curso.
Los cambios locales previos de graphify-out y .baton no se incluyeron en los commits.
Los siete sprints del roadmap anterior siguen cerrados; no se amplía el contenido.


This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Handoff for Claude

Antes de empezar trabajo nuevo lee `SPRINT_HANDOFF.md` (sección "Resumen de sesión (retomar desde aquí)").
El historial detallado de sprints (2026-06 → 2026-09) está archivado en `HISTORIAL_CLAUDE.md`; consúltalo
antes de tocar rutas, capstones, gating guiado, duración de módulos, práctica interactiva, repaso espaciado
o estación de trabajo. Estado: roadmap de auditoría tenant-real (7 sprints) y auditoría de vigencia de los
149 archivos **cerrados**; sin trabajo a medias.

**Invariantes que no debes romper:**
- Conteos vigentes: **76 módulos, 75 labs, 516 preguntas quiz + 375 de diagnóstico (891), 636 criterios,
  33 prácticas profesionales (18 incidentes, 6 challenges, 3 simulaciones, 6 guiadas), 24 prácticas interactivas
  y 40 páginas de recursos** (prácticas interactivas subió de 15 a 17 a 20 a 24 con los pilotos Learning by
  Doing de Módulos 11, 10 y 13 — ver sección de arriba; recursos subió de 38 a 39 con el puente nuevo de
  Módulo 13 y a 40 con "Casos reales por industria" (`Anexos/CASOS_REALES_NEGOCIO.md` portado a la app) para
  cerrar el gap de la ruta Consultor Funcional (status pasó de "Parcial" a "Disponible" el 2026-10-06,
  agregando los Módulos 20/61/62 a `professional-routes.ts` y un reto de Fit-Gap por industria en LAB-62);
  labs subió de 73 a 75 y simulaciones de 2 a 3 con la auditoría integral 2026-10-06 — Lab 114
  monitoreo con Application Insights, Lab 115 disaster recovery RTO/RPO, SIM-002 ceremonia ágil simulada,
  y extensión de incidente post-launch/presentación en LAB-63 — ver `AUDITORIA_INTEGRAL_PLANESTUDIO_2026.md`).
  No mezclar estos conteos entre sí.
- Los stores persistidos son independientes y **nunca se fusionan**: `plan-estudio-progress` (académico),
  `plan-estudio-onboarding`, `planestudio.practice-progress.v1`, `planestudio.interactive-practice.v1`,
  `planestudio.spaced-repetition.v1`, `planestudio.workstation.v1`. El backup completo solo lee/escribe sus payloads crudos.
- `LEVEL_MODULE_RANGE` (`i18n.ts`) es disjunto y contiguo (ia `[42,56]`, d365 `[57,66]`, rpa `[67,76]`); `progress.ts`,
  `quiz-engine.ts` y `questions-parser.ts` asumen que no hay solapes. Añadir un módulo a un nivel que no es el último
  obliga a renumerar (ver `HISTORIAL_CLAUDE.md`).
- Los labs no tienen rango contiguo; las preguntas `appliesTo: "caso"` se excluyen de `getQuestionsForModule()` y del simulador.
- Tenant real: la app no valida automáticamente contra el tenant del alumno y eso no es un defecto; los labs aportan
  criterios y evidencia manual.
- Sin ítems abiertos del roadmap de auditoría: MkDocs congelado, "§63" cerrado por sustitución y plantillas de
  repositorio documentadas (ver 2026-10-01). Piloto 3 (Módulo 13) cerrado — ver sección de pilotos arriba.
- Producción oficial: `https://planestudio.vercel.app/` (proyecto Vercel `app-elearning`); el espejo de GitHub Pages se retiró el 2026-10-08 (el CI ya no despliega).
  Los deploys estáticos de Vercel requieren `app-elearning/public/vercel.json` (`cleanUrls: true`).
- Preferencia del usuario: sincronizar (fetch/pull) antes de empezar; tras un cambio, commit y push a la rama indicada,
  comprobar CI con una sola consulta (no `gh run watch`). Validar con `npm run build:pages` o `npm run build` y luego
  `npm run e2e` **en serie**, no en paralelo (ambos usan `.next`).

## What This Repository Is

A structured, progressive learning plan for Microsoft Power Platform and Dynamics 365 — from beginner to Solution Architect. The repo has two parallel surfaces:

1. **MkDocs site** — Markdown documentation served via MkDocs Material (legacy/reference site, reads from `docs/`)
2. **Next.js app** (`app-elearning/`) — interactive e-learning app deployed officially to Vercel at `https://planestudio.vercel.app/` (reads modules and labs from `app-elearning/content/`, NOT from `docs/`)

**Important — module content is NOT shared between the two surfaces anymore.** Since commit `8b0433c8` (2026-06-25, "migración completa — 41 módulos a archivos individuales con frontmatter"), app modules and labs live as individual files with frontmatter in `app-elearning/content/modules/<levelId>/` and `app-elearning/content/labs/`. The current app surface contains **76 modules and 73 labs across 7 levels** (4 certification levels + transversal `ia`, `d365` and `rpa`). `docs/Niveles/*.md` still exists and still feeds MkDocs, but for the Next.js app it is now dead legacy fallback code (`extractModulesFromContent` in `content.ts`) that never fires because every module already has an individual file. **When editing module content for the app, edit `app-elearning/content/modules/`, not `docs/Niveles/`.** The question bank (`docs/javascripts/evaluaciones-simulador.js`) was NOT part of this migration and remains the single source for both surfaces (see Content: Question Bank below).

## Repository Structure

```
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
2. **Unit Tests** — Vitest with coverage (thresholds: 80% lines/functions/statements, 70% branches)
3. **Playwright Smoke** — end-to-end checks for main routes, labs, search, progress, certificates and onboarding guardrails
4. **Build** — `npm run build` (same build as Vercel) → static export in `app-elearning/out/`

CI no longer deploys: official production is deployed by Vercel from `master`. The GitHub Pages mirror was retired on 2026-10-08.

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

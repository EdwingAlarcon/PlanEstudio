# Historial de sprints (archivado desde CLAUDE.md)

> Texto movido tal cual desde la sección "Current Handoff for Claude" de CLAUDE.md el 2026-09-30 para mantener CLAUDE.md corto. La memoria operativa activa sigue en `SPRINT_HANDOFF.md`.

## Current Handoff (histórico)

Before starting new work, read `SPRINT_HANDOFF.md` — it is the active operational memory for the
post-audit sprints, and its top section "Resumen de sesión (retomar desde aquí)" has the exact
Objetivo/Estado actual/Pendiente/Decisiones/Archivos tocados/Siguiente paso needed to resume this
work from another tool (Claude Code, Codex, or otherwise). As of 2026-09-06: **all 7 sprints of the
tenant-real audit roadmap are closed** (`docs/Recursos/ROADMAP_AUDITORIA_TENANT_REAL.md`) — no
pending roadmap sprint remains — AND a full currency audit of all 149 content files (76 modules + 73
labs) against current Microsoft Learn docs is also closed, with every confirmed finding (high,
medium, and low confidence) corrected. Two long-standing memory items thought to be open turned out
to be stale/already-implemented (Code Apps module, case-diagnosis extension to IA/D365/RPA) — see the
"Corrección de memoria obsoleta" note in `SPRINT_HANDOFF.md` before ever reporting either as a gap
again. The only net-new content this session added beyond gap-closing is LAB-113 (Field Service
capstone), approved explicitly by the user since Sprint 7 is "expansion, not correction" by design.

**Currency-audit highlights (see `SPRINT_HANDOFF.md` "Auditoría de vigencia" section for the full
list before assuming any of this is still wrong):** PL-200's retirement (Aug 31, 2026) is now
annotated in the 9 Intermedio modules' frontmatter (labs already had it). Module 28 (Code Apps) was
migrated off the legacy `pac code` CLI to the current npm-based `pa` CLI (`pa app init/run/push/add
data-source`) across all 4 hands-on activities — this was a meaningful rewrite, not a naming tweak.
The CoE Starter Kit is Microsoft's own words "no longer actively maintained" — modules 31/32/41 and
lab-32 now say so without discarding the pedagogical content. Azure AD B2C stopped selling to new
customers (May 2025, successor: Microsoft Entra External ID) — noted in module 29. Three Field
Service files (lab-86, lab-87, lab-113) had a **licensing detail I myself wrote earlier this same
session** (a separate "resource license") corrected to the real model (two user-license SKUs) — the
anti-fabrication guardrail I gave those subagents ("don't invent SKU/role names") prevented invention
but did not catch a wrong description of a real mechanism. Lesson: "didn't invent it" and "verified
it" are not the same guarantee.

Current stable state as of the latest local handoff (2026-09-06):
- Latest continuation: **full roadmap closure in one session** — Sprints 3, 4, 5, 6 (incl. its lab
  extension) and 7 all closed and pushed, on top of Sprints 1-2 already closed earlier. Sprint 3/4
  added tenant/licensing troubleshooting sections to 17 labs (LAB-81..88, LAB-90, LAB-93..100).
  Sprint 5 added an optional `practiceMinutes` field to `ModuleInfo` (`content.ts`) so the UI can
  show a composite "X min de lectura + ~Y min de práctica guiada" duration for modules whose
  hands-on work is embedded in the module itself with no separate lab absorbing it (8 modules in
  `avanzado`, moduleId 20/21/24/26-30). Sprint 6 (see its own section in `SPRINT_HANDOFF.md`) adds
  `getModulePrerequisiteWarning()` and `getLabPrerequisiteWarning()` in `src/lib/guided-journey.ts`
  — non-blocking amber-banner gates (`ModulePrerequisiteGate`, `LabPrerequisiteGate`) shown only in
  `navigationMode === "guided"` (reused from `onboarding-store.ts`, no new store). Sprint 7 extended
  `docs/Recursos/SOLUCIONES_REFERENCIA_CAPSTONES.md` to 4 more existing capstone-grade labs (LAB-75,
  76, 90, 101) instead of building 10 redundant new capstones, and added exactly one genuinely new
  capstone lab, **LAB-113** (Field Service, wired into the `dynamics-365-field-service` professional
  route as its `capstoneLabSlug`) — **lab count is now 73, not 72** (a hardcoded `72` in
  `lab-metadata.test.ts` was updated to `73`; no other test hardcodes the total). Test suite is now
  444/444 (was 406 before this session). See `SPRINT_HANDOFF.md` for full per-sprint detail before
  touching tenant-real content, guided-mode gating, module duration, or capstones again.
- Previous continuation: **Sprint 2 — Troubleshooting de labs base y RPA, CERRADO**. Added a
  `## 🔧 Diagnóstico y reparación` section (4-6 lab-specific errors, each with Causa probable / Cómo
  comprobar / Cómo corregir / Reiniciar vs. reparar / Evidencia posterior) to LAB-02, LAB-04, LAB-05
  and LAB-104..112 (9 RPA labs) — 12 files total. LAB-02/04/05 already had an `## Errores frecuentes`
  table; it was kept as-is and the new section inserted right after it, before `## Checklist final`.
  LAB-104..112 had no errors section; both `## Errores frecuentes` and
  `## 🔧 Diagnóstico y reparación` were added between `## Ejercicios` and `## Evidencia esperada`.
  Content-only change (markdown), no frontmatter/component/route touched. See `SPRINT_HANDOFF.md`
  section "Sprint 2 — Troubleshooting de labs base y RPA" for full detail before touching lab
  troubleshooting again. Next roadmap step is Sprint 3 (tenant-real audit for D365 CE/Customer
  Insights/Field Service, LAB-081..088 and LAB-090).
- Previous continuation: **Sprint 1 — Readiness manual por lab, CERRADO**. Added `getLabReadiness()` in
  `app-elearning/src/lib/lab-metadata.ts` — derived (not frontmatter) per-lab readiness metadata for
  all 72 labs: execution status (`tenant-real` | `tenant-opcional` | `simulado` |
  `no-verificado-en-tenant`), environment, product/role/data (reusing existing validated frontmatter
  arrays), and evidence (reusing `summarizeEvidence`). Rendered via a new non-blocking "Antes de
  empezar" panel (`LabReadinessPanel`) on `/labs/[slug]`. LAB-093..100 (F&O) are marked
  `no-verificado-en-tenant` per the roadmap; RPA labs are `tenant-opcional`. See
  `SPRINT_HANDOFF.md` section "Sprint 1 — Readiness manual por lab" for full detail before touching
  lab readiness/metadata again.
- Previous planning note: **Roadmap de auditoría tenant-real**. The user corrected the audit premise:
  the student will have access to a real Microsoft tenant and will execute labs there. Do not treat
  the lack of automatic tenant validation by the app as a blocking pedagogical defect. Separate:
  (1) no tenant access, (2) lab not executable in tenant, (3) no automatic app validation, and
  (4) missing manual criteria/evidence. The continuation roadmap is versioned in
  `/recursos/roadmap-auditoria-tenant-real` (`docs/Recursos/ROADMAP_AUDITORIA_TENANT_REAL.md`).
- Latest continuation: **Capstones con solución de referencia separada**. Adds
  `/recursos/soluciones-referencia-capstones` (`docs/Recursos/SOLUCIONES_REFERENCIA_CAPSTONES.md`)
  and links it from LAB-077, LAB-079, LAB-084, LAB-085, LAB-102 and LAB-112 as post-attempt reference
  material. These six labs now declare explicit non-functional requirements (security,
  auditability, operation, maintainability, compliance/privacy/resilience/idempotency where relevant).
  `content.test.ts` resource count is now 36. Validation also found and fixed a real Flow Builder UI
  issue: draggable behavior now lives on the `Arrastrar` handle instead of the whole `<li>`, so
  `Subir/Bajar/Eliminar` remain reliable buttons. Local validation for this continuation:
  `validate:content`, `lint`, `typecheck`, `test:coverage` (420/420), `build`, and `e2e` (89/89).
  See `SPRINT_HANDOFF.md` before touching capstones or interactive practice again.
- Previous sprint: **Reorganización integral post-auditoría F&O/Contact Center** (2026-09-01,
  pushed to `master` through `05e9a479`; see `SPRINT_HANDOFF.md` section "Sprint — Reorganización
  integral" for the exact commit list and remaining roadmap boundaries). Adds 6 new
  professional routes (Fundamentos Power Platform, Dynamics 365 Sales, Dynamics 365 Customer Service,
  Customer Insights - Data, Customer Insights - Journeys, Empleabilidad — additive, the original 10
  routes are untouched to preserve persisted `selectedRouteSlug`), a per-route progress card (not a
  global percentage) on `/rutas/[slug]`, 7 new bridge resources under `docs/Recursos/`
  (`RUTA_CERO_ABSOLUTA.md`, `FUNDAMENTOS_CRM.md`, `TIPOS_DE_PRACTICA.md`, `FUNDAMENTOS_CSHARP_DOTNET.md`,
  `FUNDAMENTOS_TYPESCRIPT_REACT.md`, `ENTORNOS_Y_TRIALS.md`, `FUNDAMENTOS_AZURE.md` — resource page
  count went 28→35), and fixes to a real data-model sequencing bug in the SIT labs (Lab 04 referenced
  a table Lab 23 hadn't created yet) plus a real hydration race in interactive practice that silently
  discarded a student's in-progress interaction. See `SPRINT_HANDOFF.md` for full detail before
  touching routes, resources, or SIT lab content again.
- Previous product sprint: **Spaced Repetition & Long-Term Retention Engine** complete locally. Adds
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
- Fixed learning content counts: **76 modules, 73 labs, 516 quiz questions, 375 case-diagnosis
  questions, 636 checklist criteria**. Lab count went 72→73 on 2026-09-06 with the addition of
  LAB-113 (Field Service capstone, Sprint 7 of the tenant-real audit roadmap) — labs have no
  contiguous-range constraint like modules do, so this was a low-risk addition (see
  `SPRINT_HANDOFF.md`). Module 56 ("Fundamentos de JavaScript para Power Platform",
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


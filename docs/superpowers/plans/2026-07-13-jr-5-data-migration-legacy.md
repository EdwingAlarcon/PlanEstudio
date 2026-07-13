# JR-5 Data Migration Legacy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Job-Ready route for Data Migration + CRM Legacy awareness and expose it in the Next.js app, MkDocs nav, and labor skills matrix.

**Architecture:** This is a content-first change. A new Markdown resource becomes available through the existing resource loader, receives a unit test, and is linked from the app sidebar plus legacy MkDocs navigation.

**Tech Stack:** Markdown, Next.js App Router static resource pages, TypeScript content loader, Vitest, MkDocs Material nav.

## Global Constraints

- All user-facing content is Spanish.
- Do not create executable labs JR-005 or JR-008 in this cycle.
- The route slug must be `job-ready-data-migration-legacy`.
- The app route must be `/recursos/job-ready-data-migration-legacy`.
- The resource file must be `docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md`.
- Avoid promises of employment and avoid presenting labs as formal work experience.
- Run `npm run lint`, `npm run typecheck`, `npm run validate:content`, `npm run build:pages`, and `npm test`.
- Attempt `mkdocs build --strict`; if unavailable, report the environment limitation.

---

## File Structure

- Create `docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md`: the full route content.
- Modify `app-elearning/src/lib/content.ts`: register the new resource slug and Markdown file.
- Modify `app-elearning/src/lib/__tests__/content.test.ts`: add mock content, resource count, slug assertion, and resource load test.
- Modify `app-elearning/src/lib/i18n.ts`: add sidebar label.
- Modify `app-elearning/src/components/layout/sidebar.tsx`: add sidebar link.
- Modify `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`: add detailed resource link under the CRM Legacy & Cloud Migration route.
- Modify `mkdocs.yml`: add the resource to MkDocs navigation.

## Task 1: Create the JR-5 Resource

**Files:**
- Create: `docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md`

**Interfaces:**
- Produces: Markdown resource with H1 title `Ruta Job-Ready Data Migration + CRM Legacy`.
- Consumes: Existing matrix section `Ruta CRM Legacy & Cloud Migration`.

- [ ] **Step 1: Create the Markdown resource**

Use `apply_patch` to add `docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md` with these sections:

```markdown
# Ruta Job-Ready Data Migration + CRM Legacy

Esta ruta convierte el contenido actual de migracion, arquitectura e integraciones en una preparacion laboral especifica para vacantes de **CRM Migration Specialist**, **Dynamics 365 Migration Consultant**, **Legacy Modernization Consultant** o **Solution Architect junior-mid**.

No garantiza empleo. Tampoco convierte automaticamente los labs en experiencia laboral formal. Su valor esta en ayudarte a practicar decisiones, documentar artefactos de migracion y explicar riesgos con lenguaje de proyecto real.
```

The final resource must continue with these headings in this order:

- Vacantes objetivo.
- Resultado esperado.
- Enfoque moderno de migracion.
- Skills laborales y estado actual.
- Secuencia recomendada.
- Mapeo a contenido actual.
- Evidencia de portafolio.
- Preguntas de entrevista.
- Labs Job-Ready recomendados.
- Brechas criticas.
- Checklist antes de aplicar.
- Relacion con recursos existentes.

- [ ] **Step 2: Verify promise language**

Run:

```powershell
rg -n "garantiza empleo|experiencia laboral formal|equivale automaticamente|equivale automáticamente" docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md
```

Expected: only the top caution should mention `garantiza empleo` and `experiencia laboral formal`.

- [ ] **Step 3: Commit resource**

```powershell
git add docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md
git commit -m "docs: add data migration legacy job-ready resource"
```

## Task 2: Register Resource in App Content

**Files:**
- Modify: `app-elearning/src/lib/content.ts`
- Modify: `app-elearning/src/lib/__tests__/content.test.ts`

**Interfaces:**
- Consumes: `docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md`.
- Produces: `getResourceBySlug("job-ready-data-migration-legacy")`.

- [ ] **Step 1: Register the resource**

In `RESOURCE_FILES`, add near other Job-Ready resources:

```ts
"job-ready-data-migration-legacy": "Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md",
```

- [ ] **Step 2: Update content test mocks**

In the mocked `readFileSync` block, add:

```ts
if (filePath.includes("JOB_READY_DATA_MIGRATION_LEGACY")) return "# Ruta Job-Ready Data Migration + CRM Legacy\nData Migration.";
```

- [ ] **Step 3: Update resource count and slug assertions**

Change:

```ts
expect(pages).toHaveLength(15);
```

to:

```ts
expect(pages).toHaveLength(16);
```

Add:

```ts
expect(slugs).toContain("job-ready-data-migration-legacy");
```

- [ ] **Step 4: Add resource load test**

Add near other Job-Ready tests:

```ts
it("loads the Data Migration Legacy job-ready resource", () => {
  const resource = getResourceBySlug("job-ready-data-migration-legacy");

  expect(resource).toBeDefined();
  expect(resource?.title).toBe("Ruta Job-Ready Data Migration + CRM Legacy");
  expect(resource?.rawContent).toContain("Data Migration");
});
```

- [ ] **Step 5: Run focused test**

```powershell
npm test -- src/lib/__tests__/content.test.ts
```

Expected: all tests in `content.test.ts` pass.

- [ ] **Step 6: Commit registration**

```powershell
git add app-elearning/src/lib/content.ts app-elearning/src/lib/__tests__/content.test.ts
git commit -m "feat: register data migration legacy job-ready resource"
```

## Task 3: Add App Navigation

**Files:**
- Modify: `app-elearning/src/lib/i18n.ts`
- Modify: `app-elearning/src/components/layout/sidebar.tsx`

**Interfaces:**
- Consumes: slug `job-ready-data-migration-legacy`.
- Produces: visible sidebar link labeled `Data Migration Job-Ready`.

- [ ] **Step 1: Add UI label**

In `UI.nav`, add:

```ts
dataMigrationJobReady: "Data Migration Job-Ready",
```

- [ ] **Step 2: Add sidebar item**

In `RESOURCE_LINKS`, add near other Job-Ready resources:

```ts
{ href: "/recursos/job-ready-data-migration-legacy", label: UI.nav.dataMigrationJobReady, icon: FileText },
```

- [ ] **Step 3: Typecheck**

```powershell
npm run typecheck
```

Expected: `tsc --noEmit` exits 0.

- [ ] **Step 4: Commit navigation**

```powershell
git add app-elearning/src/lib/i18n.ts app-elearning/src/components/layout/sidebar.tsx
git commit -m "feat: link data migration legacy job-ready resource"
```

## Task 4: Link Matrix and MkDocs

**Files:**
- Modify: `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`
- Modify: `mkdocs.yml`

**Interfaces:**
- Consumes: resource file `JOB_READY_DATA_MIGRATION_LEGACY.md`.
- Produces: cross-links from matrix and MkDocs nav.

- [ ] **Step 1: Add matrix link**

Under `### Ruta CRM Legacy & Cloud Migration`, add:

```markdown
Recurso detallado: [Ruta Job-Ready Data Migration + CRM Legacy](JOB_READY_DATA_MIGRATION_LEGACY.md).
```

- [ ] **Step 2: Add MkDocs nav item**

Under `Recursos`, near other Job-Ready routes, add:

```yaml
      - "🗃️ Data Migration Job-Ready": Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md
```

- [ ] **Step 3: Attempt MkDocs validation**

```powershell
mkdocs build --strict
```

Expected if MkDocs is unavailable locally: command fails with `The term 'mkdocs' is not recognized`. Report this as an environment limitation.

- [ ] **Step 4: Commit links**

```powershell
git add docs/Recursos/MATRIZ_SKILLS_LABORALES.md mkdocs.yml
git commit -m "docs: link data migration legacy job-ready route"
```

## Task 5: Final Verification

**Files:**
- Read-only verification across repo.

**Interfaces:**
- Consumes: all prior commits.
- Produces: final status and validation summary.

- [ ] **Step 1: Run lint**

```powershell
npm run lint
```

Expected: exits 0.

- [ ] **Step 2: Run typecheck**

```powershell
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Run content validation**

```powershell
npm run validate:content
```

Expected: modules, labs, questions, and checklist validate.

- [ ] **Step 4: Run static build**

```powershell
npm run build:pages
```

Expected: Next.js static export completes and includes one more resource page than before.

- [ ] **Step 5: Run tests**

```powershell
npm test
```

Expected: all Vitest tests pass.

- [ ] **Step 6: Confirm clean worktree**

```powershell
git status --short
```

Expected: no output.

## Self-Review

- Spec coverage: all acceptance criteria are covered by Tasks 1-5.
- Placeholder scan: no TBD/TODO placeholders are intentionally left.
- Type consistency: slug, file path, UI label, test title, and route path are consistent across tasks.

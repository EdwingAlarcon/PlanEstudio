# JR-6 Interview Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Job-Ready route for interview readiness, technical CV, LinkedIn, demo scripts, STAR answers, technical English, and remote communication.

**Architecture:** This is a content-first resource addition. The new Markdown page is registered through the existing resource loader, tested with Vitest, and linked from the app sidebar plus MkDocs and the labor skills matrix.

**Tech Stack:** Markdown, Next.js App Router static resource pages, TypeScript content loader, Vitest, MkDocs Material nav.

## Global Constraints

- All user-facing content is Spanish.
- Route slug: `job-ready-interview-readiness`.
- App route: `/recursos/job-ready-interview-readiness`.
- Resource file: `docs/Recursos/JOB_READY_INTERVIEW_READINESS.md`.
- Do not create executable lab JR-009 in this cycle.
- Avoid promises of employment and avoid presenting labs as formal work experience.
- Run `npm run lint`, `npm run typecheck`, `npm run validate:content`, `npm run build:pages`, and `npm test`.
- Attempt `mkdocs build --strict`; if unavailable, report the environment limitation.

---

## Task 1: Create Resource

**Files:**
- Create: `docs/Recursos/JOB_READY_INTERVIEW_READINESS.md`

**Interfaces:**
- Produces H1 title: `Ruta Job-Ready Interview Readiness + Portafolio Laboral`.

- [ ] **Step 1: Add Markdown resource**

Create a resource with sections: vacantes objetivo, resultado esperado, evidencia sin exagerar, artefactos laborales, CV tecnico, LinkedIn tecnico, demo de 10 minutos, respuestas STAR, ingles tecnico, comunicacion remota, banco de preguntas por perfil, JR-009 recomendado, checklist y relacion con recursos existentes.

- [ ] **Step 2: Verify promise language**

Run:

```powershell
rg -n "garantiza empleo|experiencia laboral formal|equivale automaticamente|equivale automáticamente" docs/Recursos/JOB_READY_INTERVIEW_READINESS.md
```

Expected: only the top caution and examples about honest wording mention formal work experience.

- [ ] **Step 3: Commit**

```powershell
git add docs/Recursos/JOB_READY_INTERVIEW_READINESS.md
git commit -m "docs: add interview readiness job-ready resource"
```

## Task 2: Register Resource

**Files:**
- Modify: `app-elearning/src/lib/content.ts`
- Modify: `app-elearning/src/lib/__tests__/content.test.ts`

**Interfaces:**
- Produces: `getResourceBySlug("job-ready-interview-readiness")`.

- [ ] **Step 1: Register slug**

Add to `RESOURCE_FILES`:

```ts
"job-ready-interview-readiness": "Recursos/JOB_READY_INTERVIEW_READINESS.md",
```

- [ ] **Step 2: Update test mock**

Add:

```ts
if (filePath.includes("JOB_READY_INTERVIEW_READINESS")) return "# Ruta Job-Ready Interview Readiness + Portafolio Laboral\nInterview Readiness.";
```

- [ ] **Step 3: Update count and slug assertion**

Change resource count from `16` to `17`, then add:

```ts
expect(slugs).toContain("job-ready-interview-readiness");
```

- [ ] **Step 4: Add resource load test**

```ts
it("loads the Interview Readiness job-ready resource", () => {
  const resource = getResourceBySlug("job-ready-interview-readiness");

  expect(resource).toBeDefined();
  expect(resource?.title).toBe("Ruta Job-Ready Interview Readiness + Portafolio Laboral");
  expect(resource?.rawContent).toContain("Interview Readiness");
});
```

- [ ] **Step 5: Run focused test**

```powershell
npm test -- src/lib/__tests__/content.test.ts
```

- [ ] **Step 6: Commit**

```powershell
git add app-elearning/src/lib/content.ts app-elearning/src/lib/__tests__/content.test.ts
git commit -m "feat: register interview readiness job-ready resource"
```

## Task 3: Add Navigation

**Files:**
- Modify: `app-elearning/src/lib/i18n.ts`
- Modify: `app-elearning/src/components/layout/sidebar.tsx`

**Interfaces:**
- Produces sidebar label: `Interview Job-Ready`.

- [ ] **Step 1: Add label**

```ts
interviewJobReady: "Interview Job-Ready",
```

- [ ] **Step 2: Add sidebar item**

```ts
{ href: "/recursos/job-ready-interview-readiness", label: UI.nav.interviewJobReady, icon: FileText },
```

- [ ] **Step 3: Typecheck**

```powershell
npm run typecheck
```

- [ ] **Step 4: Commit**

```powershell
git add app-elearning/src/lib/i18n.ts app-elearning/src/components/layout/sidebar.tsx
git commit -m "feat: link interview readiness job-ready resource"
```

## Task 4: Link Matrix and MkDocs

**Files:**
- Modify: `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`
- Modify: `mkdocs.yml`

**Interfaces:**
- Consumes: `JOB_READY_INTERVIEW_READINESS.md`.

- [ ] **Step 1: Add matrix link**

Under `### Ruta Technical English & Interview Readiness`, add:

```markdown
Recurso detallado: [Ruta Job-Ready Interview Readiness + Portafolio Laboral](JOB_READY_INTERVIEW_READINESS.md).
```

- [ ] **Step 2: Add MkDocs nav**

```yaml
      - "🎙️ Interview Job-Ready": Recursos/JOB_READY_INTERVIEW_READINESS.md
```

- [ ] **Step 3: Attempt MkDocs build**

```powershell
mkdocs build --strict
```

- [ ] **Step 4: Commit**

```powershell
git add docs/Recursos/MATRIZ_SKILLS_LABORALES.md mkdocs.yml
git commit -m "docs: link interview readiness job-ready route"
```

## Task 5: Final Verification

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run validate:content`.
- [ ] Run `npm run build:pages`.
- [ ] Run `npm test`.
- [ ] Run `git status --short`.

## Self-Review

- Spec coverage: all JR-6 acceptance criteria are covered.
- Placeholder scan: no TBD/TODO placeholders are left.
- Type consistency: slug, file path, title, UI label and route path match across tasks.

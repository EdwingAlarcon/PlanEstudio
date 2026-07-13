# JR-3 CRM Developer Job-Ready Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Dynamics 365 CRM Developer job-ready resource that maps current PlanEstudio content to real CRM developer vacancy requirements.

**Architecture:** This is a documentation-first feature. A new Markdown resource becomes the source of truth, `content.ts` registers it for the Next.js resource route, `i18n.ts` and `sidebar.tsx` expose it in app navigation, `MATRIZ_SKILLS_LABORALES.md` links to it, and `mkdocs.yml` exposes it in the legacy/reference site.

**Tech Stack:** Markdown, Next.js App Router static resource route, TypeScript, MkDocs Material.

## Global Constraints

- Do not create labs `JR-002`, `JR-003`, `JR-004` or `JR-010` in this iteration.
- Do not add a new route to `professional-routes.ts` in this iteration.
- Do not massively modify modules 13, 23, 24, 26, 50, 53 or 54.
- Do not say completing this route automatically equals work experience.
- Do not promise employment.
- Keep all content in Spanish.
- Present JR-3 as a specialized labor-market layer over the existing Developer route, not as a new official route.

---

### Task 1: Add The CRM Developer Job-Ready Resource

**Files:**
- Create: `docs/Recursos/JOB_READY_CRM_DEVELOPER.md`

**Interfaces:**
- Consumes: Existing module/lab identifiers already present in PlanEstudio.
- Produces: Markdown page consumable by MkDocs and by the app resource renderer.

- [ ] **Step 1: Create `docs/Recursos/JOB_READY_CRM_DEVELOPER.md`**

Use this exact content:

```markdown
# Ruta Job-Ready Dynamics 365 CRM Developer

Esta ruta convierte el contenido técnico actual de PlanEstudio en una preparación laboral específica para vacantes de **Dynamics 365 CRM Developer**.

No garantiza empleo. Tampoco convierte automáticamente los labs en experiencia laboral formal. Su valor está en ayudarte a practicar, reunir evidencia técnica y explicar tu trabajo con el lenguaje que usan equipos de CRM, consultores técnicos y recruiters especializados.

## Vacantes objetivo

Esta ruta apunta a roles como:

- Dynamics 365 CRM Developer.
- Power Platform Developer con foco en Customer Engagement.
- Microsoft Business Applications Technical Consultant.
- Dataverse / CRM Integration Developer.
- CRM Developer junior-mid que necesita demostrar C#, JavaScript, plugins e integraciones.

## Resultado esperado

Al completar la secuencia recomendada, deberías poder explicar y demostrar:

- Cómo extender Dynamics 365 / Dataverse con JavaScript de formulario y Web Resources.
- Cómo construir plugins C# con stages, images, depth, tracing y pruebas unitarias.
- Cómo consumir Dataverse Web API y diseñar integraciones seguras.
- Cómo mover soluciones con ALM, pipelines, Power Platform CLI y revisión técnica.
- Cómo usar IA para acelerar desarrollo sin aceptar código inseguro ni no verificado.

## Skills laborales y estado actual

| Skill laboral | Estado actual | Contenido actual | Evidencia posible hoy | Brecha |
|---|---|---|---|---|
| C# para Dynamics 365 CRM | Cubierto | Módulo 23, LAB-023 | Plugin con código fuente y pruebas | Profundizar escenarios de entrevista |
| Plugins Dataverse | Cubierto | Módulo 23, LAB-023 | Step registrado, tracing y validaciones server-side | Simulación job-test JR-003 |
| Plugin pipeline | Cubierto | Módulo 23 | Explicación de PreOperation/PostOperation | Más casos de PreValidation y async |
| Pre/Post Images | Parcial | Módulo 23, LAB-023 | Registro de PreImage en PRT | Caso de comparación de cambios más fuerte |
| Depth y recursión | Cubierto | Módulo 23 | Guard clause `context.Depth > 1` | Preguntas de troubleshooting |
| ITracingService / Plugin Trace Log | Parcial | Módulo 23 | Trazas básicas en plugin | Simular incidente con log real |
| Unit testing de plugins | Parcial | Módulo 23, Módulo 50, LAB-023 | Tests con Moq | Ampliar casos error/feliz/seguridad |
| JavaScript CRM | Parcial | Módulo 13 | Web Resource básico | Falta prueba técnica JR-002 |
| `formContext` / `executionContext` | Parcial | Módulo 13 | Handler OnLoad/OnSave | Reforzar OnChange y errores comunes |
| `Xrm.WebApi` | Parcial | Módulo 13, Módulo 53 | Consulta desde formulario | Falta CRUD completo y manejo de errores |
| Dataverse Web API | Cubierto | Módulo 53, LAB-054 | App externa o conexión conceptual | Integración job-test JR-004 |
| Azure Functions | Parcial | Módulo 24 | Diseño de integración | Falta implementación laboral guiada |
| Azure Logic Apps | Awareness | Módulo 34 | Comparación con Power Automate | Falta challenge práctico |
| Service Bus | Awareness | Módulos 24, 34 | Patrón asíncrono conceptual | Falta simulación de resiliencia |
| ALM técnico | Cubierto | Módulos 19, 54; LAB-019, LAB-053 | Pipeline y solución desempaquetada | Conectar con repo CRM Developer |
| Clean code | Parcial | Módulos 48, 50 | Revisión de diff y guardrails | Checklist específico CRM |
| Debugging y troubleshooting | Parcial | Módulos 23, 26 | Logs y diagnóstico básico | Falta caso de incidente CRM |
| IA aplicada al desarrollo | Parcial | Módulos 42-55, LAB-045, LAB-051, LAB-053 | Prompt, diff y revisión humana | JR-010 como práctica job-ready |

## Secuencia recomendada de estudio

1. **Base de cliente CRM:** Módulo 13 para JavaScript, Web Resources, `formContext`, eventos y PCF básico.
2. **Extensión server-side:** Módulo 23 y LAB-023 para plugins, pipeline, images, depth, tracing y tests.
3. **ALM técnico:** Módulo 19, Módulo 54, LAB-019 y LAB-053 para solutions, pipelines y revisión de cambios.
4. **Integraciones:** Módulo 24, Módulo 53 y LAB-054 para Web API, autenticación y diseño de conexión externa.
5. **Calidad y troubleshooting:** Módulo 26 y Módulo 50 para performance, tests, guardrails y diagnóstico.
6. **Capstone:** LAB-063 para reunir evidencia técnica completa.

## Mapeo a contenido actual

| Contenido | Uso dentro de esta ruta | Qué debes extraer como evidencia |
|---|---|---|
| Módulo 13 - JavaScript y PCF Básico | Base client-side CRM | Web Resource, eventos registrados y explicación de `formContext` |
| Módulo 19 - ALM y CI/CD | Transporte de solución | Pipeline, solución managed/unmanaged y gates |
| Módulo 23 - C# Plugins para Dataverse | Core CRM Developer | Plugin, tests, registro en PRT, trace log |
| Módulo 24 - Integraciones con Azure Services | Integración técnica | Diagrama con patrón sync/async y manejo de fallos |
| Módulo 26 - Performance y Optimización | Troubleshooting | Diagnóstico de performance y mitigaciones |
| Módulo 50 - Tests, CI/CD y Guardrails | Calidad técnica | Resultado de tests y checklist de revisión |
| Módulo 53 - Dataverse Web API y Autenticación | API e identidad | Llamada autenticada y manejo de errores |
| Módulo 54 - ALM de Soluciones con IA | Revisión asistida | Prompt, diff y verificación humana |
| LAB-019 | CI/CD | Evidencia de pipeline ejecutado |
| LAB-023 | Plugin C# | Código, tests, registro y trazas |
| LAB-054 | Web API / integración | Diseño de conexión externa a Dataverse |
| LAB-063 | Capstone Developer | Proyecto técnico integrador para portafolio |

## Evidencia de portafolio

Un portafolio CRM Developer debería incluir al menos:

- Repositorio con plugin C# y estructura clara de solución.
- README técnico con problema, diseño, decisiones y limitaciones.
- Captura o export de solución Dataverse.
- Captura del Plugin Registration Tool o evidencia de step registrado.
- Plugin Trace Log explicado: qué pasó, qué se diagnosticó y cómo se corrigió.
- Pruebas unitarias con al menos un caso feliz y un caso de error.
- Web Resource JavaScript con OnLoad, OnChange u OnSave y manejo de errores.
- Ejemplo de uso de `Xrm.WebApi` o Dataverse Web API.
- Diagrama de integración con API externa, Azure Function, Logic Apps o Service Bus.
- Evidencia ALM: pipeline, solución desempaquetada o revisión de diff.

## Preguntas de entrevista

### JavaScript CRM

- ¿Por qué `Xrm.Page` ya no debe usarse en código nuevo?
- ¿Cómo obtienes `formContext` desde un evento OnLoad?
- ¿Qué diferencia hay entre OnLoad, OnChange y OnSave?
- ¿Cómo cancelarías un guardado desde JavaScript?
- ¿Cómo manejarías errores de `Xrm.WebApi.retrieveMultipleRecords`?

### Plugins C#

- ¿Qué diferencia hay entre PreValidation, PreOperation y PostOperation?
- ¿Cuándo usarías una PreImage?
- ¿Qué problema resuelve `context.Depth`?
- ¿Por qué `ITracingService` es crítico en producción?
- ¿Cómo evitarías que un plugin se dispare para cada update irrelevante?
- ¿Cuándo lanzarías `InvalidPluginExecutionException`?

### Dataverse Web API e integraciones

- ¿Cuándo prefieres Web API frente a un conector estándar?
- ¿Cómo manejarías paginación, throttling y reintentos?
- ¿Cuándo usarías Service Bus en lugar de una llamada HTTP directa?
- ¿Qué información no debe quedar hardcodeada en código o flujos?
- ¿Cómo diseñarías idempotencia en una integración CRM?

### Testing, ALM y troubleshooting

- ¿Cómo pruebas un plugin sin depender de producción?
- ¿Qué revisarías si un plugin funciona en DEV pero falla en TEST?
- ¿Cómo moverías una solución de DEV a PROD sin cambios manuales?
- ¿Qué incluirías en un rollback plan?
- ¿Cómo explicarías un incidente técnico a un usuario no técnico?

### IA aplicada al desarrollo

- ¿Cómo usarías IA para generar una primera versión de un plugin sin aceptar código inseguro?
- ¿Qué revisarías en un diff generado por IA antes de aprobarlo?
- ¿Qué datos nunca pegarías en un prompt?

## Labs Job-Ready recomendados

Estos labs aún no existen como contenido disponible. Son el roadmap recomendado para cerrar la ruta.

| Lab propuesto | Vacante que valida | Skills que valida | Evidencia esperada | Dificultad | Duración | Relación con portafolio |
|---|---|---|---|---|---|---|
| JR-002 - CRM JavaScript Customization | Dynamics 365 CRM Developer | OnLoad, OnChange, OnSave, `formContext`, `Xrm.WebApi` | Web Resource, casos de prueba, captura de eventos | Avanzada | 4 h | Demuestra client-side customization |
| JR-003 - Dataverse Plugin C# Job Test | CRM Developer | Plugin pipeline, tracing, depth, images, tests | Código, tests, PRT, Plugin Trace Log | Avanzada | 4-5 h | Demuestra server-side development |
| JR-004 - CRM Integration Challenge | Integration Developer | Web API, Azure Function/Logic Apps, errores, idempotencia | Diagrama, API/flujo, logs, decisiones | Avanzada | 4 h | Demuestra integración enterprise |
| JR-010 - AI-Assisted CRM Development | CRM Developer moderno | Prompting, revisión de código, seguridad, guardrails | Prompt, diff, checklist, pruebas | Intermedia | 3 h | Demuestra uso responsable de IA |

## Brechas críticas

1. Falta un lab dedicado de JavaScript CRM estilo prueba técnica.
2. Falta práctica específica de Custom APIs.
3. Falta práctica de custom workflow activities para contextos legacy.
4. Logic Apps y Service Bus están en awareness/concepto, no en challenge práctico.
5. Debugging/tracing necesita una simulación de incidente más fuerte.

## Checklist antes de aplicar

- [ ] Puedo explicar `formContext` sin usar `Xrm.Page`.
- [ ] Tengo un Web Resource con al menos un evento registrado y probado.
- [ ] Tengo un plugin C# con tests y tracing.
- [ ] Sé explicar stages, images, depth y filtering attributes.
- [ ] Puedo mostrar evidencia ALM: solución, pipeline o export/import controlado.
- [ ] Puedo explicar una integración con Dataverse Web API.
- [ ] Tengo un README técnico de mi capstone Developer.
- [ ] Puedo responder al menos 10 preguntas de entrevista de esta página.
- [ ] Puedo explicar qué brechas todavía tengo sin venderlas como experiencia.

## Relación con recursos existentes

- Usa la [Matriz de Skills Laborales](MATRIZ_SKILLS_LABORALES.md) para ver cómo esta ruta encaja con otras vacantes.
- Usa la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) para criterios de evidencia demostrable.
- Usa [Cómo Convertir tus Labs en Portafolio Profesional](PORTAFOLIO_PROFESIONAL.md) para empaquetar capturas, README y decisiones técnicas.
```

- [ ] **Step 2: Review the resource for forbidden promises**

Run:

```powershell
rg -n "garantiza empleo|equivale automáticamente|equivale automaticamente|experiencia laboral formal" docs/Recursos/JOB_READY_CRM_DEVELOPER.md
```

Expected: Only the explicit caution near the top should match.

- [ ] **Step 3: Commit Task 1**

Run:

```powershell
git add docs/Recursos/JOB_READY_CRM_DEVELOPER.md
git commit -m "docs: add crm developer job-ready resource"
```

Expected: Commit succeeds with one new file.

---

### Task 2: Register The Resource In The Next.js Content Loader

**Files:**
- Modify: `app-elearning/src/lib/content.ts`
- Modify: `app-elearning/src/lib/__tests__/content.test.ts`

**Interfaces:**
- Consumes: `docs/Recursos/JOB_READY_CRM_DEVELOPER.md` from Task 1.
- Produces: Resource slug `job-ready-crm-developer` available through `getAllResourcePages()` and `/recursos/job-ready-crm-developer`.

- [ ] **Step 1: Add the resource mapping**

In `app-elearning/src/lib/content.ts`, update `RESOURCE_FILES` near the other resources:

```ts
  "matriz-skills-laborales": "Recursos/MATRIZ_SKILLS_LABORALES.md",
  "job-ready-crm-developer": "Recursos/JOB_READY_CRM_DEVELOPER.md",
  "portafolio-profesional": "Recursos/PORTAFOLIO_PROFESIONAL.md",
```

- [ ] **Step 2: Update the mocked resource content**

In `app-elearning/src/lib/__tests__/content.test.ts`, add this branch in the `readFileSync` mock:

```ts
      if (filePath.includes("JOB_READY_CRM_DEVELOPER")) return "# Ruta Job-Ready Dynamics 365 CRM Developer\nDynamics 365 CRM Developer.";
```

- [ ] **Step 3: Update the resource count and slug assertions**

In `app-elearning/src/lib/__tests__/content.test.ts`, update the resource count from `12` to `13`, update the test descriptions to mention `job-ready-crm-developer`, and add:

```ts
    expect(slugs).toContain("job-ready-crm-developer");
```

- [ ] **Step 4: Add a focused resource assertion**

In the `getAllResourcePages` describe block, add:

```ts
  it("loads the CRM Developer job-ready resource", () => {
    const resource = getResourceBySlug("job-ready-crm-developer");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Ruta Job-Ready Dynamics 365 CRM Developer");
    expect(resource?.rawContent).toContain("Dynamics 365 CRM Developer");
  });
```

- [ ] **Step 5: Run the focused test**

Run:

```powershell
cd app-elearning
npm test -- src/lib/__tests__/content.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit Task 2**

Run:

```powershell
git add app-elearning/src/lib/content.ts app-elearning/src/lib/__tests__/content.test.ts
git commit -m "feat: register crm developer job-ready resource"
```

Expected: Commit succeeds.

---

### Task 3: Add App Navigation

**Files:**
- Modify: `app-elearning/src/lib/i18n.ts`
- Modify: `app-elearning/src/components/layout/sidebar.tsx`

**Interfaces:**
- Consumes: Resource slug `job-ready-crm-developer` from Task 2.
- Produces: Sidebar navigation link to `/recursos/job-ready-crm-developer`.

- [ ] **Step 1: Add the i18n label**

In `app-elearning/src/lib/i18n.ts`, add a nav label near the other resource labels:

```ts
    crmDeveloperJobReady: "CRM Developer Job-Ready",
```

- [ ] **Step 2: Add the sidebar link**

In `app-elearning/src/components/layout/sidebar.tsx`, add the link near `matriz-skills-laborales`:

```tsx
  { href: "/recursos/job-ready-crm-developer", label: UI.nav.crmDeveloperJobReady, icon: FileText },
```

- [ ] **Step 3: Run TypeScript check**

Run:

```powershell
cd app-elearning
npm run typecheck
```

Expected: PASS with no missing `UI.nav` property errors.

- [ ] **Step 4: Commit Task 3**

Run:

```powershell
git add app-elearning/src/lib/i18n.ts app-elearning/src/components/layout/sidebar.tsx
git commit -m "feat: link crm developer job-ready resource"
```

Expected: Commit succeeds.

---

### Task 4: Link From Labor Skills Matrix And MkDocs

**Files:**
- Modify: `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`
- Modify: `mkdocs.yml`

**Interfaces:**
- Consumes: `docs/Recursos/JOB_READY_CRM_DEVELOPER.md` from Task 1.
- Produces: Cross-link from the labor skills matrix and MkDocs navigation item.

- [ ] **Step 1: Link the route from the labor skills matrix**

In `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`, under `### Ruta Job-Ready Dynamics 365 CRM Developer`, add this line after the heading:

```markdown
Recurso detallado: [Ruta Job-Ready Dynamics 365 CRM Developer](JOB_READY_CRM_DEVELOPER.md).
```

- [ ] **Step 2: Add the MkDocs navigation item**

In `mkdocs.yml`, under `Recursos:`, add:

```yaml
      - "💻 CRM Developer Job-Ready": Recursos/JOB_READY_CRM_DEVELOPER.md
```

Place it near `"💼 Matriz de Skills Laborales"`.

- [ ] **Step 3: Attempt MkDocs strict build**

Run:

```powershell
mkdocs build --strict
```

Expected: PASS if MkDocs is available. If `mkdocs` is not recognized, record that limitation and continue.

- [ ] **Step 4: Commit Task 4**

Run:

```powershell
git add docs/Recursos/MATRIZ_SKILLS_LABORALES.md mkdocs.yml
git commit -m "docs: link crm developer job-ready route"
```

Expected: Commit succeeds.

---

### Task 5: Final Validation

**Files:**
- Read: `app-elearning/package.json`
- No required file edits unless validation exposes JR-3 defects.

**Interfaces:**
- Consumes: All tasks.
- Produces: Verified JR-3 implementation.

- [ ] **Step 1: Run lint**

Run:

```powershell
cd app-elearning
npm run lint
```

Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run:

```powershell
cd app-elearning
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Run content validation**

Run:

```powershell
cd app-elearning
npm run validate:content
```

Expected: PASS.

- [ ] **Step 4: Run static export build**

Run:

```powershell
cd app-elearning
npm run build:pages
```

Expected: PASS.

- [ ] **Step 5: Run full test suite**

Run:

```powershell
cd app-elearning
npm test
```

Expected: PASS.

- [ ] **Step 6: Review git status and recent commits**

Run:

```powershell
git status --short
git log --oneline -10
```

Expected: Working tree clean; JR-3 commits visible.

- [ ] **Step 7: Final response**

Report:

- Resource added: `/recursos/job-ready-crm-developer`.
- Files changed.
- Validation commands and results.
- MkDocs result or local limitation.


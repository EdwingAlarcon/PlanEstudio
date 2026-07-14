# JR-2 CRM Functional Job-Ready Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Dynamics 365 CRM Functional Specialist job-ready resource that maps current PlanEstudio content to real functional CRM vacancy requirements.

**Architecture:** This is a documentation-first feature. A new Markdown resource becomes the source of truth, `content.ts` registers it for the Next.js resource route, `i18n.ts` and `sidebar.tsx` expose it in app navigation, `MATRIZ_SKILLS_LABORALES.md` links to it, and `mkdocs.yml` exposes it in the legacy/reference site.

**Tech Stack:** Markdown, Next.js App Router static resource route, TypeScript, MkDocs Material.

## Global Constraints

- Do not create lab `JR-007` in this iteration.
- Do not add a new route to `professional-routes.ts` in this iteration.
- Do not massively modify modules 4, 9, 20, 38, 55, 56, 57 or 58.
- Do not promise employment.
- Do not say completing this route automatically equals work experience.
- Keep all content in Spanish.
- Present JR-2 as a specialized labor-market layer over existing Dynamics 365 Customer Engagement content, not as a new official route.

---

### Task 1: Add The CRM Functional Job-Ready Resource

**Files:**
- Create: `docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md`

**Interfaces:**
- Consumes: Existing module/lab identifiers already present in PlanEstudio.
- Produces: Markdown page consumable by MkDocs and by the app resource renderer.

- [ ] **Step 1: Create `docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md`**

Use this exact content:

```markdown
# Ruta Job-Ready Dynamics 365 CRM Functional Specialist

Esta ruta convierte el contenido funcional actual de Dynamics 365 Customer Engagement en una preparación laboral específica para vacantes de **CRM Specialist**, **Dynamics 365 CE Functional Consultant**, **Customer Service Specialist** o **Functional-Technical Consultant**.

No garantiza empleo. Tampoco convierte automáticamente los labs en experiencia laboral formal. Su valor está en ayudarte a practicar configuración funcional, reunir evidencia de consultoría y explicar decisiones con el lenguaje que usan usuarios clave, consultores funcionales y equipos de soporte.

## Vacantes objetivo

Esta ruta apunta a roles como:

- Dynamics 365 CRM Functional Specialist.
- Dynamics 365 Customer Engagement Functional Consultant.
- Dynamics 365 Customer Service Specialist.
- CRM Administrator / CRM Specialist.
- Functional-Technical Consultant con foco en configuración y soporte.
- Consultor funcional junior-mid para Sales, Customer Service y Dataverse.

## Resultado esperado

Al completar la secuencia recomendada, deberías poder explicar y demostrar:

- Cómo configurar tablas, formularios, vistas, business rules y Business Process Flows.
- Cómo modelar un proceso de Customer Service con casos, colas, SLAs, entitlements y knowledge base.
- Cómo explicar un proceso Sales lead-to-cash usando entidades estándar.
- Cómo diseñar UAT, soporte funcional, documentación y training a usuarios.
- Cómo convertir un caso funcional en evidencia de portafolio sin venderlo como experiencia laboral formal.

## Enfoque funcional moderno

Esta ruta debe evitar prácticas legacy como centro del aprendizaje. El enfoque recomendado es:

- **Customer Service Hub / Copilot Service admin center:** configuración moderna de casos, colas, knowledge, canales, unified routing y perfiles de agente.
- **Enhanced SLAs:** usar SLAs modernos para medir tiempos de respuesta/resolución, no depender de SLAs legacy del web client.
- **Queues:** entenderlas como contenedores de trabajo para organizar, priorizar y monitorear casos/actividades; no como sustituto de seguridad.
- **Entitlements:** definir términos de soporte por horas, casos, productos o nivel de cliente.
- **Sales lead-to-cash:** lead, opportunity, quote, order e invoice como proceso comercial estándar antes de personalizar.
- **Reporting operativo:** dashboards, KPIs, backlog, tiempos de resolución, cumplimiento SLA y UAT como evidencia funcional.

## Skills laborales y estado actual

| Skill laboral | Estado actual | Contenido actual | Evidencia posible hoy | Brecha |
|---|---|---|---|---|
| Administración CRM | Parcial | Módulos 20, 56 | Configuración funcional documentada | Falta simulación laboral JR-007 |
| Tablas, formularios y vistas | Cubierto | Módulos 4, 9, 20 | Formularios, vistas y pruebas por rol | Reforzar escenario CRM real |
| Business Process Flows | Cubierto | Módulos 4, 9, 20; LAB-066 | BPF con etapas y validaciones | Agregar troubleshooting funcional |
| Business rules | Parcial | Módulos 4, 9 | Reglas de negocio básicas | Falta evidencia específica |
| Customer Service cases | Cubierto | Módulo 20, LAB-068 | Case-to-resolution end-to-end | Convertir en job simulation JR-007 |
| Queues | Cubierto | Módulo 20, LAB-068 | Cola configurada y enrutamiento | Profundizar criterios de diseño |
| SLAs | Cubierto | Módulo 20, LAB-068 | SLA con pausa/reanudación y escalamiento | Agregar troubleshooting |
| Entitlements | Parcial | Módulo 20, LAB-068 parcial | Política de cobertura por cliente | Hacerlo obligatorio en JR-007 |
| Knowledge base | Parcial | Módulos 20, 22; LAB-068 parcial | Artículos y búsqueda | Hacerlo obligatorio en JR-007 |
| Dynamics 365 Sales | Cubierto | Módulos 20, 56; LAB-066 | Lead-to-cash y fit-gap | Profundizar forecasting/territories en roadmap |
| Customer Insights / Customer 360 | Cubierto | Módulos 57, 63; LAB-084, LAB-085, LAB-067 | Perfil unificado, consentimiento y real-time journey | Mantener como ruta específica Customer Insights |
| Field Service awareness | Cubierto | Módulo 58; LAB-086, LAB-087, LAB-059 | Work order, agreement preventivo, mobile offline y UAT | Mantener como ruta específica Field Service |
| Reporting y dashboards | Parcial | Módulos 6, 12, 20; LAB-068 | Dashboard operativo | Falta escenario funcional más fuerte |
| Fit-gap | Cubierto | Módulos 20, 38, 55; LAB-057, LAB-062 | Matriz fit-gap | Conectar con entrevista funcional |
| UAT | Cubierto | Módulos 38, 55; LAB-055, LAB-062 | Casos UAT y sign-off | Conectar con soporte post-go-live |
| Soporte funcional | Parcial | Módulos 38, 55 | Manual, training y resolución | Falta incidente funcional simulado |

## Secuencia recomendada de estudio

1. **Base model-driven y Dataverse:** Módulos 4 y 9 para tablas, formularios, vistas, BPF y seguridad funcional.
2. **Customer Engagement base:** Módulos 20 y 56 para Sales, Customer Service y entidades estándar.
3. **Customer Service hands-on:** LAB-068 para casos, colas, SLA, dashboard y ciclo case-to-resolution.
4. **Sales hands-on:** LAB-066 y LAB-057 para lead-to-cash, entidades estándar y fit-gap.
5. **Especializaciones CE:** LAB-084, LAB-085, LAB-086 y LAB-087 para Customer Insights y Field Service avanzado.
6. **Consultoría funcional:** Módulos 38 y 55, LAB-055 y LAB-062 para UAT, documentación, training, fit-gap y go-live.

## Mapeo a contenido actual

| Contenido | Uso dentro de esta ruta | Qué debes extraer como evidencia |
|---|---|---|
| Módulo 4 - Model-Driven Apps | Configuración base CRM | Formularios, vistas, BPF y seguridad por rol |
| Módulo 9 - Dataverse Avanzado | Datos y seguridad funcional | BPF, field security, reglas y relaciones |
| Módulo 20 - Dynamics 365 CE Sales y Customer Service | Core funcional CE | Sales, Customer Service, casos, colas, SLAs |
| Módulo 38 - Liderazgo Técnico y Gestión de Proyectos | Consultoría y stakeholders | Backlog, gestión de cambios, training |
| Módulo 55 - IA para Consultoría Funcional D365 | Fit-gap y análisis asistido | Documento de diseño y matriz de seguridad |
| Módulo 56 - Introducción Dynamics 365 Avanzado | Visión CE | Mapa funcional de apps CE |
| Módulo 57 - Customer Insights Data | Customer 360 | Perfil unificado, matching y medidas |
| Módulo 58 - Field Service | Servicio en campo | Work order, scheduling y UAT |
| LAB-057 | Diseño D365 Sales | Fit-gap Sales y entidades estándar |
| LAB-058 | Customer Insights Journeys | Segmento/journey como evidencia |
| LAB-059 | Field Service | Work order y validación funcional |
| LAB-066 | Sales lead-to-cash | Proceso comercial end-to-end |
| LAB-067 | Customer 360 | Unificación de perfil y métricas |
| LAB-068 | Customer Service | Caso, cola, SLA, dashboard y resolución |

## Evidencia de portafolio

Un portafolio CRM Functional debería incluir al menos:

- Documento funcional de 3-5 páginas: problema, AS-IS, TO-BE, alcance y exclusiones.
- Matriz fit-gap: estándar, configuración, personalización, fuera de alcance.
- Configuración case-to-resolution: caso, cola, SLA, escalamiento y dashboard.
- Matriz de colas: propósito, miembros, criterios de enrutamiento y prioridad.
- Diseño de SLA: KPIs, condiciones, pausa/reanudación, escalamiento y validación.
- Diseño de entitlements: cliente/producto, horas/casos, vigencia y reglas.
- Knowledge base: artículos mínimos, criterios de búsqueda y uso por agentes.
- Casos UAT con resultado pass/fail y defectos priorizados.
- Manual funcional o guía rápida para usuarios.
- Resumen ejecutivo de riesgos y decisiones.

## Preguntas de entrevista

### Configuración CRM

- ¿Cómo decides si un requerimiento se resuelve con configuración o personalización?
- ¿Qué diferencia hay entre tabla, formulario, vista y business rule?
- ¿Cuándo usarías un Business Process Flow?
- ¿Cómo validarías que un rol ve solo lo que corresponde?
- ¿Cómo documentas una configuración para soporte futuro?

### Customer Service

- ¿Cómo modelas un proceso case-to-resolution?
- ¿Cuándo crearías colas por equipo, producto, prioridad o región?
- ¿Qué diferencia hay entre una cola y un security role?
- ¿Cómo configuras un SLA y cómo pruebas que se dispara?
- ¿Para qué sirven los entitlements?
- ¿Cómo usarías knowledge articles para reducir tiempos de resolución?

### Dynamics 365 Sales

- ¿Cómo explicarías el ciclo lead-to-cash?
- ¿Qué entidades estándar usarías antes de personalizar Sales?
- ¿Qué pasa al calificar un lead?
- ¿Cuándo una oportunidad debería convertirse en quote/order?
- ¿Cómo manejarías un requerimiento que pide cambiar demasiado el proceso estándar?

### Reporting, UAT y soporte funcional

- ¿Qué KPIs usarías para un equipo de Customer Service?
- ¿Cómo escribirías un caso UAT verificable?
- ¿Cómo priorizas defectos encontrados en UAT?
- ¿Qué harías si usuarios reportan que una vista muestra datos incorrectos?
- ¿Cómo entrenarías usuarios resistentes al cambio?

### Consultoría funcional

- ¿Cómo levantas requerimientos con usuarios no técnicos?
- ¿Cómo manejas un stakeholder que pide personalizar todo?
- ¿Cómo explicas una limitación de producto sin sonar bloqueante?
- ¿Qué debe incluir un documento fit-gap?
- ¿Cómo presentas un capstone funcional en 10 minutos?

## Lab Job-Ready recomendado

Este lab aún no existe como contenido disponible. Es el roadmap recomendado para cerrar la ruta.

| Lab propuesto | Vacante que valida | Skills que valida | Evidencia esperada | Rúbrica sugerida | Dificultad | Duración | Relación con portafolio |
|---|---|---|---|---|---|---|---|
| JR-007 - Customer Service Specialist Job Simulation | CRM Functional / Customer Service Specialist | casos, colas, SLA, entitlements, KB, dashboard, UAT, soporte funcional | configuración funcional, matriz de colas/SLA, dashboard, casos UAT y manual | 35% proceso, 25% SLA/colas, 20% reporting, 20% soporte | Intermedia-Avanzada | 4 h | Demuestra configuración Customer Service y criterio funcional |

## Brechas críticas

1. Falta un lab dedicado JR-007 para Customer Service Specialist Job Simulation.
2. Entitlements y Knowledge Base están parcialmente cubiertos, pero necesitan práctica obligatoria.
3. Reporting operativo requiere un escenario funcional más fuerte.
4. Soporte funcional post-go-live y troubleshooting de configuración necesitan simulación.
5. Omnichannel/Contact Center avanzado sigue en roadmap y no debe presentarse como cubierto.

## Checklist antes de aplicar

- [ ] Puedo explicar el ciclo case-to-resolution.
- [ ] Tengo evidencia de configuración de caso, cola, SLA y dashboard.
- [ ] Puedo explicar entitlements y knowledge base con un ejemplo funcional.
- [ ] Puedo explicar el ciclo lead-to-cash usando entidades estándar.
- [ ] Tengo una matriz fit-gap clara.
- [ ] Tengo al menos 8 casos UAT con criterios verificables.
- [ ] Puedo preparar una demo funcional de 10 minutos.
- [ ] Puedo explicar qué brechas todavía tengo sin venderlas como experiencia.
- [ ] Puedo responder preguntas de usuarios no técnicos sin irme directo a código.

## Relación con recursos existentes

- Usa la [Matriz de Skills Laborales](MATRIZ_SKILLS_LABORALES.md) para ver cómo esta ruta encaja con otras vacantes.
- Usa la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) para criterios de evidencia demostrable.
- Usa [Cómo Convertir tus Labs en Portafolio Profesional](PORTAFOLIO_PROFESIONAL.md) para empaquetar documentos, capturas, UAT y decisiones funcionales.
```

- [ ] **Step 2: Review the resource for forbidden promises**

Run:

```powershell
rg -n "garantiza empleo|equivale automáticamente|equivale automaticamente|experiencia laboral formal" docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md
```

Expected: Only the explicit caution near the top should match.

- [ ] **Step 3: Commit Task 1**

Run:

```powershell
git add docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md
git commit -m "docs: add crm functional job-ready resource"
```

Expected: Commit succeeds with one new file.

---

### Task 2: Register The Resource In The Next.js Content Loader

**Files:**
- Modify: `app-elearning/src/lib/content.ts`
- Modify: `app-elearning/src/lib/__tests__/content.test.ts`

**Interfaces:**
- Consumes: `docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md` from Task 1.
- Produces: Resource slug `job-ready-crm-functional` available through `getAllResourcePages()` and `/recursos/job-ready-crm-functional`.

- [ ] **Step 1: Add the resource mapping**

In `app-elearning/src/lib/content.ts`, update `RESOURCE_FILES` near the other job-ready resources:

```ts
  "job-ready-crm-developer": "Recursos/JOB_READY_CRM_DEVELOPER.md",
  "job-ready-admin-governance": "Recursos/JOB_READY_ADMIN_GOVERNANCE.md",
  "job-ready-crm-functional": "Recursos/JOB_READY_CRM_FUNCTIONAL.md",
  "portafolio-profesional": "Recursos/PORTAFOLIO_PROFESIONAL.md",
```

- [ ] **Step 2: Update the mocked resource content**

In `app-elearning/src/lib/__tests__/content.test.ts`, add this branch in the `readFileSync` mock:

```ts
      if (filePath.includes("JOB_READY_CRM_FUNCTIONAL")) return "# Ruta Job-Ready Dynamics 365 CRM Functional Specialist\nDynamics 365 CRM Functional.";
```

- [ ] **Step 3: Update the resource count and slug assertions**

In `app-elearning/src/lib/__tests__/content.test.ts`, update the resource count from `14` to `15`, update the test descriptions to mention `job-ready-crm-functional`, and add:

```ts
    expect(slugs).toContain("job-ready-crm-functional");
```

- [ ] **Step 4: Add a focused resource assertion**

In the `getAllResourcePages` describe block, add:

```ts
  it("loads the CRM Functional job-ready resource", () => {
    const resource = getResourceBySlug("job-ready-crm-functional");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Ruta Job-Ready Dynamics 365 CRM Functional Specialist");
    expect(resource?.rawContent).toContain("Dynamics 365 CRM Functional");
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
git commit -m "feat: register crm functional job-ready resource"
```

Expected: Commit succeeds.

---

### Task 3: Add App Navigation

**Files:**
- Modify: `app-elearning/src/lib/i18n.ts`
- Modify: `app-elearning/src/components/layout/sidebar.tsx`

**Interfaces:**
- Consumes: Resource slug `job-ready-crm-functional` from Task 2.
- Produces: Sidebar navigation link to `/recursos/job-ready-crm-functional`.

- [ ] **Step 1: Add the i18n label**

In `app-elearning/src/lib/i18n.ts`, add a nav label near the other resource labels:

```ts
    crmFunctionalJobReady: "CRM Functional Job-Ready",
```

- [ ] **Step 2: Add the sidebar link**

In `app-elearning/src/components/layout/sidebar.tsx`, add the link near the other Job-Ready resources:

```tsx
  { href: "/recursos/job-ready-crm-functional", label: UI.nav.crmFunctionalJobReady, icon: FileText },
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
git commit -m "feat: link crm functional job-ready resource"
```

Expected: Commit succeeds.

---

### Task 4: Link From Labor Skills Matrix And MkDocs

**Files:**
- Modify: `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`
- Modify: `mkdocs.yml`

**Interfaces:**
- Consumes: `docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md` from Task 1.
- Produces: Cross-link from the labor skills matrix and MkDocs navigation item.

- [ ] **Step 1: Link the route from the labor skills matrix**

In `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`, under `### Ruta Job-Ready Dynamics 365 CRM Functional Specialist`, add this line after the heading:

```markdown
Recurso detallado: [Ruta Job-Ready Dynamics 365 CRM Functional Specialist](JOB_READY_CRM_FUNCTIONAL.md).
```

- [ ] **Step 2: Add the MkDocs navigation item**

In `mkdocs.yml`, under `Recursos:`, add:

```yaml
      - "🧩 CRM Functional Job-Ready": Recursos/JOB_READY_CRM_FUNCTIONAL.md
```

Place it near the other Job-Ready resources.

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
git commit -m "docs: link crm functional job-ready route"
```

Expected: Commit succeeds.

---

### Task 5: Final Validation

**Files:**
- Read: `app-elearning/package.json`
- No required file edits unless validation exposes JR-2 defects.

**Interfaces:**
- Consumes: All tasks.
- Produces: Verified JR-2 implementation.

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

Expected: Working tree clean; JR-2 commits visible.

- [ ] **Step 7: Final response**

Report:

- Resource added: `/recursos/job-ready-crm-functional`.
- Files changed.
- Validation commands and results.
- MkDocs result or local limitation.
- Microsoft docs consulted for current functional CRM guidance.

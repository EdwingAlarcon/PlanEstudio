# PlanEstudio — Estado de sprints post-auditoría (handoff)

> Documento de traspaso para continuar el trabajo con otra herramienta/agente (Codex, Claude u otro).
> No es contenido del curso — es una nota de proceso. Puede borrarse una vez que el roadmap
> de sprints termine, o moverse a `docs/Recursos/` si se prefiere mantenerlo como referencia.

## Contexto

Una auditoría externa evaluó PlanEstudio (65 módulos, 63 labs, 488 preguntas, 603 criterios) y encontró
el currículo sólido pero con brechas de profundidad práctica en varias áreas. Desde entonces se ejecuta
un roadmap de sprints correctivos, uno por brecha, en orden, sin expandir conteos ni crear módulos/labs
nuevos en ninguno de ellos.

**Regla de oro de cada sprint:** reforzar contenido existente dentro de la estructura de 7 secciones ya
establecida (Objetivo, Conceptos Clave, Actividades Prácticas, Casos Reales, Buenas Prácticas, Errores
Comunes, Criterios de Validación). Nunca cambiar `moduleId`/`slug`/`title` del frontmatter salvo que sea
estrictamente necesario. Nunca tocar conteos.

## Sprints completados (orden cronológico, todos en `master`)

| # | Commit | Sprint | Qué tocó |
|---|--------|--------|----------|
| 1 | `af763b5` | Salto Power Fx + labs JR-001/010 | Módulo 03 (mini-guía Power Fx puente), labs LAB-071 a LAB-080 reforzados a estándar job-ready, headings H4→H3 en Nivel Básico (8 módulos), Módulo 08 reordenado a 7 secciones, `search-bar.tsx`/`sidebar.tsx` con labels `ia`/`d365` |
| 2 | `de3634e` | Profundidad D365 60-65 | Módulos 60-65 nivelados con la profundidad de 56-59: matrices, diagramas Mermaid, payloads JSON, preguntas de entrevista, referencias a labs 66/81/68/82/83/58/84/70/88/90 |
| 3 | `a0966fe` | Profundidad IA con ejemplos reales | Módulos 42-55 reforzados con prompts reales copiables. Módulo 47 = biblioteca central de 8 plantillas de prompt |
| 4 | `257e734`, `faba63b` | Alcance de labs D365 + refuerzo admin/migration | Delimitación explícita del alcance de labs D365, primer refuerzo de rutas job-ready Admin/Governance y Migration/Legacy |
| 5 | `8e5f377`, `2c1f4ca` | Navegación transversal D365 unificada | Home, Labs, Checklist y páginas de nivel usan D365 consistente (`Dynamics 365 Especialización`, `CE avanzado + F&O Awareness`, 10 módulos). Deploy: Actions run `29886777674` |
| 6 | `df2bbc6` | Cierre de pendientes job-ready | `JOB_READY_ADMIN_GOVERNANCE.md` y `JOB_READY_INTERVIEW_READINESS.md` completados (Admin/Governance, Solution Architect, Inglés técnico, CV/LinkedIn); checklist, portafolio, rúbricas y matriz laboral actualizados |
| 7 | `6c4b1dc` | Trazabilidad Migration/Legacy | Lenguaje corregido a `Parcial / Awareness avanzado / Job-ready simulation` en checklist, portafolio, rúbricas y matriz laboral. Deploy: Actions run `29888427282` |
| 8 | *(sin commit — nada que cambiar)* | Verificación Migration/Legacy | Se re-diagnosticaron checklist/portafolio/rúbrica/matriz contra el pedido explícito de un sprint de cierre y se confirmó que el sprint 7 ya los había resuelto por completo. No se modificó nada; solo se descartó un artefacto autogenerado (`questions.ts`) sin diferencia real |
| 9 | *(este sprint — ver detalle abajo)* | Cierre UX/navegación + release readiness | Auditoría de navegación transversal, verificación del slug del Módulo 40, limpieza de pendientes stale en este documento, y primera versión de "Estado estable" para release |

Cada sprint terminó en verde con: `npm run validate:content`, `npm run lint`, `npx tsc --noEmit` (o `npm run typecheck`),
`npm run test:coverage` (225/225 tests históricamente), `npm run build` (o `build:pages`), y `npm run e2e` (Playwright
smoke) — antes de commit + push a `master`.

Conteos fijos confirmados en todos los sprints hasta ahora: **65 módulos, 63 labs, 488 preguntas, 603 criterios**.

## Diagnósticos cerrados (no re-abrir sin instrucción explícita)

- **Duplicados D365/F&O** — los pares `LAB-058/084`, `LAB-067/085`, `LAB-069/089`, `LAB-070/088` son
  complementarios (fundamentos vs. profundización/capstone), no duplicados. No fusionar, no deprecar,
  no crear labs nuevos.
- **Slug del Módulo 40** — **Resuelto (Opción 3 — renombrado seguro), confirmado en el sprint 9.** El
  archivo es `40-arquitectura-power-platform-casos-estudio.md` (renombrado desde
  `40-preparacion-pl-600.md` en un commit anterior a `0477cc5`). Se verificó en este sprint con un
  script que no queda ninguna referencia rota al slug/nombre viejo en `app-elearning/src`,
  `app-elearning/content` ni `docs/`; todas las menciones de "PL-600" restantes son etiquetas
  históricas correctas ("retirado", "referencia histórica"), no rutas ni slugs activos. **No requiere
  ninguna acción adicional.**
- **Admin/Governance y Solution Architect** — cerrados desde el sprint 6 (`df2bbc6`). Si un handoff
  antiguo los lista como "pendientes", es una redacción desactualizada: la aclaración de esta
  conversación (ver historial) confirmó que están completos, no que falten.

## Estado de cada frente (taxonomía estandarizada)

Usa siempre uno de estos 5 estados al describir un frente, para evitar la ambigüedad de "pendiente" que
causó confusión en un sprint anterior (mezclar "fuera de alcance de este sprint puntual" con "trabajo sin
terminar" son cosas distintas):

- **Cerrado** — contenido completo, sin brecha conocida.
- **Cerrado en modalidad job-ready/simulación** — completo dentro de lo que se puede hacer sin tenant
  real; la evidencia es simulada/documental y así se declara explícitamente en el propio contenido.
- **Roadmap enterprise real** — identificado y documentado, pero requiere infraestructura, tenant,
  licencia o personas reales; no es un sprint de contenido pendiente.
- **Pendiente menor UX** — inconsistencia de navegación/nomenclatura, no de contenido.
- **Pendiente no bloqueante** — existe pero no impide una versión estable pública.

| Frente | Estado | Nota |
|---|---|---|
| Power Fx + JR-001 a JR-010 | Cerrado | Sprint 1 |
| D365 módulos 60-65 | Cerrado | Sprint 2 |
| IA con ejemplos reales (42-55) | Cerrado | Sprint 3 |
| Deduplicación D365/F&O | Cerrado | Diagnóstico, ver arriba |
| Migration/Legacy Job-Ready | Cerrado en modalidad job-ready/simulación | Sprints 7 y 8; roadmap enterprise real documentado en el propio recurso |
| Admin/Governance | Cerrado en modalidad job-ready/simulación | Sprint 6; brechas de Managed Environments/logs reales quedan como roadmap enterprise real |
| Solution Architect | Cerrado en modalidad job-ready/simulación | Sprint 6, vía Módulo 40 + puente en `JOB_READY_ADMIN_GOVERNANCE.md` |
| CV/LinkedIn práctico | Cerrado en modalidad job-ready/simulación | Sprint 6, vía `JOB_READY_INTERVIEW_READINESS.md`; fluidez real con personas queda como roadmap |
| Inglés técnico | Cerrado en modalidad job-ready/simulación | Sprint 6, mismo recurso |
| Slug Módulo 40 | Cerrado | Ver diagnóstico arriba |
| UX navegación transversal | Cerrado, con 1 hallazgo menor corregido en sprint 9 | Ver detalle abajo (`/recursos/simulador` orphan) |
| Discrepancia checklist 602 vs 632 | Cerrado (no existe) | Verificado en sprint 9: no hay ninguna mención de 602/632 en `CHECKLIST_PROGRESO.md`; el validador reporta 603 de forma consistente |
| Migración enterprise real (dataset grande, ETL real, on-prem real, cutover productivo) | Roadmap enterprise real | Documentado en `JOB_READY_DATA_MIGRATION_LEGACY.md`, no bloquea release |
| Managed Environments / capacity / licensing con datos reales | Roadmap enterprise real | Documentado en `JOB_READY_ADMIN_GOVERNANCE.md` |
| Logs reales de Purview/Dataverse audit | Roadmap enterprise real | Mismo recurso |
| Fluidez de inglés/feedback real de CV-LinkedIn con personas | Roadmap enterprise real | Requiere práctica externa, no contenido |

## UX / navegación transversal — auditoría del sprint 9

Se revisó: sidebar, home, hubs de dominio (Power Platform, Dynamics 365, Integración), empleabilidad,
rutas profesionales (9 rutas, todas con slug válido), niveles, labs, portafolio, checklist. Además se
corrió un script que valida que **todos los enlaces internos** (`/nivel/.../modulo/...`, `/labs/...`,
`/recursos/...`) dentro de `content/modules`, `content/labs` y `docs/Recursos` apuntan a slugs que
existen — **0 enlaces rotos** — y que los 63 labs están referenciados desde al menos un hub, ruta o
recurso — **0 labs huérfanos**.

**Hallazgo único y corregido:** `/recursos/simulador` (mapeado a `docs/Recursos/SIMULADOR_EVALUACIONES.md`
en `RESOURCE_FILES` de `content.ts`) era una página huérfana en la app Next.js: no estaba enlazada desde
ningún sidebar/hub/CTA, no estaba indexada en el buscador (`getSearchDocuments` solo indexa módulos y
labs), y su contenido es un stub pensado para MkDocs (`<div id="quiz-app"></div>`, un hook de JS que solo
existe en el sitio MkDocs) — en la app Next.js esa página no mostraba nada útil. El simulador real e
interactivo de la app vive en `/simulador` (ruta ya enlazada desde el sidebar y el home). Se quitó la
entrada `simulador` de `RESOURCE_FILES` en `content.ts` para que esa ruta ya no se genere en la app;
`docs/Recursos/SIMULADOR_EVALUACIONES.md` no se tocó porque sigue siendo válido para MkDocs
(`mkdocs.yml` lo referencia en su nav). Efecto: el conteo de `getAllResourcePages()` baja de 18 a 17;
test actualizado en `content.test.ts`.

No se encontraron: nombres legacy en sidebar/footer, CTAs confusos, claims de "de cero a 100" sin
respaldo, ni certificaciones retiradas presentadas como vigentes (PL-600 aparece siempre etiquetado
como retirado; PL-200 muestra correctamente su fecha de retiro futura, 31 ago 2026, sin presentarse
como indefinidamente vigente).

## Pendientes reales actuales (todo lo demás está `Cerrado` o es `Roadmap enterprise real`)

No queda ningún pendiente de contenido ni de UX bloqueante. Lo único abierto es lo ya clasificado como
**Roadmap enterprise real** en la tabla de arriba — por definición, no forma parte de un sprint de
cierre porque depende de tenant, licencia o personas reales, no de trabajo de contenido.

## Estado estable — release readiness

**Cubre bien:**
- Progresión Power Platform PL-900 → PL-200 → PL-400 → Arquitectura (65 módulos, ruta de 4 niveles
  con dependencias claras y sin saltos de dificultad sin puente).
- Especialización transversal en IA aplicada al desarrollo (Copilot/Claude Code/Codex) con prompts
  reales copiables y evaluación humana explícita.
- Especialización transversal en Dynamics 365 CE (Sales, Customer Service, Customer Insights, Field
  Service) con labs hands-on donde el trial lo permite (Contact Center Chat, F&O LAB-093 a LAB-100).
- Capa de empleabilidad (rutas job-ready, matriz de skills, portafolio, CV/LinkedIn, inglés técnico)
  con evidencia concreta y lenguaje honesto sobre qué es simulado.

**Cubre parcialmente (Cerrado en modalidad job-ready/simulación):**
- Migration/Legacy, Admin/Governance, Solution Architect: preparan criterio y artefactos defendibles
  en entrevista, no sustituyen experiencia operativa con tenant/infraestructura real.
- Contact Center Voz/SMS y Sales Insights predictivo: quedan como diseño hasta contratar proveedor de
  telefonía o licencia Premium real.

**No debe prometerse:**
- Migración productiva enterprise, tooling ETL real, CRM on-premises real operado en vivo.
- Auditoría con logs reales de Purview/Dataverse, Managed Environments configurado con licencia real.
- Fluidez de inglés o feedback de CV/LinkedIn validado por reclutadores reales.
- PL-600, MB-210/220/230/240/260/300 como certificaciones vigentes (todas retiradas por Microsoft).

**Prepara mejor a:** Power Platform Maker/Functional Consultant/Developer/Solution Architect junior-mid,
Dynamics 365 CE Functional Consultant junior-mid, AI-assisted development practitioner.

**Prepara parcialmente a:** Power Platform Admin/Governance Specialist y CRM Migration Specialist
senior (falta práctica en tenant real), Dynamics 365 F&O especialista (awareness + hands-on de trial,
no producción), roles que exigen certificación PL-600 vigente (retirada, no se puede prometer).

**Limitación honesta más importante:** ningún artefacto de este plan sustituye experiencia laboral
verificable; el valor es preparar criterio, vocabulario y evidencia de portafolio defendible en
entrevista.

Este resumen sirve como control de calidad para futuros agentes: si un cambio futuro contradice algo de
esta sección (por ejemplo, presentar Migration/Legacy como "Cubierto" sin matices), es una señal de
regresión de honestidad, no una mejora.

## Cómo continuar

- El usuario normalmente pide sprints en el orden de la lista de pendientes de arriba, uno por turno,
  con un prompt largo tipo "actúa como [lista de roles]... Sprint — [tema]... No quiero expansión...".
- **Antes de tocar nada**, hacer `git pull --ff-only` y verificar con `git log --oneline -15` si el
  sprint pedido ya fue resuelto por una sesión anterior (con otra herramienta incluso) — ya ha pasado
  más de una vez que el trabajo ya estaba hecho y no reflejado en la copia local.
- El flujo esperado es: diagnóstico → refuerzo de contenido (si hace falta) → validaciones → informe
  al usuario **sin commitear todavía** → solo si el usuario responde algo como "commit, push y deploy"
  (mensaje corto y explícito), hacer commit + push + verificar el deploy en GitHub Actions.
- Mensaje de commit: descriptivo, en español, terminando con
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- **No mezclar** "fuera de alcance de este sprint puntual" con "pendiente sin resolver" al escribir el
  informe final — usar la taxonomía de 5 estados de este documento.

## Comandos de validación de referencia

```powershell
cd app-elearning
npm run validate:content
npm run lint
npx tsc --noEmit
npm run test:coverage
npm run build
npm run e2e   # Playwright smoke test (requiere `npx playwright install chromium` la primera vez)
```

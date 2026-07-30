# PlanEstudio — Estado de sprints post-auditoría (handoff)

> Documento de traspaso para continuar el trabajo con otra herramienta/agente (Codex, Claude u otro).
> No es contenido del curso — es una nota de proceso. Puede borrarse una vez que el roadmap
> de sprints termine, o moverse a `docs/Recursos/` si se prefiere mantenerlo como referencia.

## Última actualización (2026-07-29)

Último estado local antes del micro-sprint de revisión humana externa:

- Branch local: `master`, partiendo de `origin/master` limpio.
- Sprint en curso: **External Human Review Import**.
- Conteos finales locales: **75 módulos**, **72 labs**, **508 preguntas**, **633 criterios**, **20 prácticas profesionales**.
- Nuevo nivel transversal: `rpa` / **Power Automate Desktop & RPA**, módulos 66-75.
- Nuevos labs RPA: `LAB-104` a `LAB-112`.
- Nuevas prácticas RPA: **3 Challenge Labs**, **8 Incident Labs**, **1 Work Simulation**.
- Nuevos recursos RPA: artefactos profesionales, portafolio/empleabilidad honesta y validación tenant.
- Sprint RPA previo ya quedó publicado; el micro-sprint actual debe terminar con commit + push + GitHub Actions deploy.

Micro-sprint actual — **External Human Review Import**:

- No crea módulos, labs ni prácticas.
- Agrega formato importable `planestudio-external-review` schema v1, manteniendo compatibilidad con la plantilla legacy `planestudio-practice-review`.
- Permite múltiples revisiones externas por práctica e intento, historial, última revisión por intento, eliminación local y creación de reentrega cuando el revisor lo solicita.
- Valida tamaño, JSON, formato, versión, campos peligrosos, práctica, intento, revisor, fecha, resultado, rúbrica completa, pesos, puntaje recalculado, fallos críticos, consistencia de `approved`/reentrega y duplicados/conflictos por `reviewId`.
- La UI de cada práctica ahora importa JSON, muestra vista previa, detecta duplicado idéntico/conflicto, compara autoevaluación vs revisión externa, y expone métricas separadas de validación humana en `/progreso`.
- Recursos actualizados: `PRACTICAS_PORTABILIDAD_ESTUDIANTE.md` y `PRACTICAS_GUIA_REVISORES.md`.

Después del Sprint 22 se agregó una capa nueva **Experiencia práctica**:
`/experiencia-practica`, `app-elearning/content/practices/`, parser/validador `practices.ts`,
metadata client-safe `practice-meta.ts`, documentación `docs/Recursos/MARCO_PRACTICAS_PROFESIONALES.md`.
El sprint RPA amplió esa capa de piloto inicial a **13 Incident Labs, 5 Challenge Labs y 2 Work Simulations**.

El micro-sprint más reciente integró esa capa con la experiencia diaria:

- Progreso práctico independiente en `app-elearning/src/lib/practice-progress.ts`, persistido en
  `localStorage` con clave `planestudio.practice-progress.v1`.
- Estados internos: `not_started`, `in_progress`, `attempted`, `reviewed`, `completed`,
  `needs_reinforcement`; etiquetas visibles en español.
- No reutiliza ni modifica la clave académica `plan-estudio-progress`.
- Página de detalle de práctica ahora separa la solución del Markdown principal y la muestra mediante
  interacción explícita en `PracticeWorkspaceClient`.
- Pistas escalonadas en metadata YAML de las 8 prácticas (`hint-1` a `hint-4`) y validadas por parser.
- Notas personales locales, evidencias producidas, intentos confirmados, solución consultada,
  autoevaluación por rúbrica, fallos críticos, completitud explícita y reset solo práctico.
- Home, `/experiencia-practica`, `/progreso` y buscador global muestran progreso práctico separado.
- Buscador global indexa módulos, labs, recursos e incidentes/challenges/simulaciones, con estado práctico
  local para resultados de prácticas.
- Recomendación determinística: continuar `in_progress`, retomar `needs_reinforcement`, sugerir por
  prerrequisitos académicos completados y luego primera práctica disponible.

Baseline posterior al micro-sprint: **238 Vitest tests**, **25 Playwright smoke tests**, build estático
de **190 páginas**.

Sprint posterior — **Practice Validation & Portability**:

- `schemaVersion` práctico sube a **2** manteniendo la clave separada `planestudio.practice-progress.v1`.
- El progreso práctico conserva historial real de intentos (`attempts`, `activeAttemptId`), migra registros v1
  con `attemptCount` a un intento legacy, y distingue estado de ejecución vs. estado de validación.
- `/progreso` incorpora **Respaldo y portabilidad**: exportación JSON versionada, exclusión opcional de notas,
  importación validada con vista previa, estrategias `Combinar`/`Reemplazar`, confirmación destructiva y reset
  solo práctico. No toca `plan-estudio-progress`.
- Cada práctica muestra historial/comparación de intentos y puede exportar paquete de evidencia JSON + Markdown
  y plantilla JSON de revisión humana. La importación estructurada de revisiones queda documentada como evolución
  futura; no se simula revisión externa desde autoevaluación.
- Las 8 prácticas piloto declaran `evidence.artifactTypes` (`simulated`, `conceptual`, `sandbox-reproducible`,
  `requires-license`, etc.) y el parser lo valida.
- Nuevos recursos: guía de portabilidad para estudiantes, guía para revisores y protocolo/matriz de validación
  sandbox. Conteos académicos sin cambios; recursos Next.js suben a 21 y build estático a 193 páginas.
- Baseline posterior: **247 Vitest tests**, **26 Playwright smoke tests**, build estático de **193 páginas**.

Sprint posterior — **Power Automate Desktop & RPA Professional Track**:

- Agrega nivel transversal `rpa` con rango `66-75`, navegación en Home/sidebar/progreso/checklist/labs/búsqueda/certificado.
- Implementa 10 módulos RPA con enfoque profesional: viabilidad RPA vs API/conector/cloud, instalación/runtime, desktop flows mantenibles, archivos/Excel, web, Windows legacy, selectores, errores/idempotencia, cloud + desktop, ALM/operación/gobierno.
- Implementa 9 labs RPA (`LAB-104` a `LAB-112`) con capstone end-to-end.
- Implementa 12 prácticas RPA (`CH-RPA-01` a `03`, `INC-RPA-001` a `008`, `SIM-RPA-001`) integradas al buscador, progreso práctico y portafolio.
- Actualiza matriz laboral: Power Automate Desktop pasa de `Awareness / Sin lab dedicado` a `Cubierto`, manteniendo como riesgo la validación unattended/machine groups/licencia en tenant real.
- Actualiza `CHECKLIST_PROGRESO.md`, preguntas del simulador, rutas profesionales, perfiles laborales, empleabilidad y recursos RPA.
- Baseline posterior: **247 Vitest tests**, **27 Playwright smoke tests**, build estático de **230 páginas**.

Validaciones locales ejecutadas y en verde antes del commit `6e0604ac`:

```powershell
cd app-elearning
npm run validate:content
npm run lint
npm run typecheck
npm run test:coverage
npm run build:pages
npm run e2e
cd ..
mkdocs build --strict
```

Nota operativa: `npm run build:pages` y `npm run e2e` deben correr en serie en local. En este sprint se
confirmó de nuevo que correrlos en paralelo puede generar falsos negativos transitorios por carrera sobre
artefactos `.next`.

## Pausa de sesión (2026-07-27, retomar 2026-07-28)

Sesión cerrada en commit `cda417e5`, `master` al día con `origin/master`, CI/deploy en verde,
working tree limpio. Último trabajo: Sprint 21 (`/impeccable document` → `PRODUCT.md`/`DESIGN.md`/
`.impeccable/design.json`) y Sprint 22 (`/impeccable audit`, 17/20 → 20/20 tras fixes de heading
hierarchy, reading-progress bar y touch targets — ver tabla de sprints más abajo). No queda ningún
pendiente conocido, ni de contenido ni de UI/a11y/perf. Antes de empezar algo nuevo: `git pull --ff-only`
y preguntar al usuario el siguiente objetivo — no asumir que queda algo de lo anterior.

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
| 9 | `1ae65ba` | Cierre UX/navegación + release readiness | Auditoría de navegación transversal (0 enlaces rotos, 0 labs huérfanos), verificación del slug del Módulo 40, retiro de la página huérfana `/recursos/simulador`, primera versión de "Estado estable" |
| 10 | `30fdcea`/`43b1cf8` | Consolidación de handoffs | Fusión de dos documentos de handoff en un solo `SPRINT_HANDOFF.md` con la taxonomía de 5 estados de más abajo |
| 11 | `749a491` | README versión estable | Marcador "versión estable pública" en el README, con resumen honesto de cobertura y corrección de conteos desactualizados (61→63 labs, 223→225 tests) |
| 12 | `28bfa4f` | Micro-sprint de polish | Footer/sidebar y badges PL-600 verificados ya correctos (sin cambio); frase de `/portafolio` sobre Contact Center/Sales Ops/F&O corregida (ya no niega evidencia existente en LAB-081/083/093-100) |
| 13 | *(sin commit)* | Incidente de caché — resuelto sin tocar código | Usuario reportó el polish del sprint 12 "no reflejado en producción" en 4 navegadores tras hard refresh. `curl` con cache-busting confirmó `X-Cache: MISS` y contenido correcto en el servidor — era caché de red/DNS local del usuario, se resolvió solo. **Antes de investigar código por un reporte similar, verificar el servidor real primero** (ver sección "Verificación de producción" más abajo) |
| 14 | `b71d3f7` | Onboarding de principiante — Módulos 1-3 | Simulación de estudiante principiante (diagnóstico) seguida de un micro-sprint de reducción de fricción: Módulo 1 (setup separado de la primera práctica, mini-glosario, conceptos recortados, suplementos opcionales), Módulo 2 (explicaciones breves + enlace a Lab 02), Módulo 3 (Núcleo obligatorio vs. Profundización opcional + enlace a Lab 03), `estimatedMinutes` corregido (10→20, 5→15, 6→25) con línea lectura/práctica visible, criterio de avance a Intermedio agregado al checklist |
| 15 | `3cabbd3` | Onboarding de principiante — Módulos 4-8 | Módulos 4-8 auditados y reforzados sin cambiar conteos: tiempos visibles realistas, "Qué vas a lograr hoy", separación Núcleo obligatorio/Profundización opcional o iteraciones, evidencia para guardar, enlaces a Lab 04/Lab 05 cuando existen, ruta honesta para Power BI/Power Fx/proyecto integrado cuando no hay lab básico dedicado |
| 16 | `d4b5b2a` | Primeras 2 horas + quick wins principiante | Ruta concreta de primeras 2 horas en "Cómo usar"; Mini Lab 01 embebido en Módulo 1 sin crear lab nuevo; práctica 6.0 de Power BI con datos de ejemplo; tabla "Power Fx en español simple"; Módulo 8 dividido en entrega mínima/completa/excelente; checklist mínimo para principiantes sin alterar los 603 criterios |
| 17 | `bab3325` | Checklist mínimo visible en app | El checklist mínimo de principiante quedó visible en `/recursos/checklist` dentro del componente interactivo `ChecklistClient`, no solo en el Markdown legacy; no altera parser ni conteo de 603 criterios |
| 18 | `766bb76` | Smoke e2e del checklist mínimo + validación serial | Playwright ahora valida que `/recursos/checklist` muestre el bloque "Checklist mínimo para principiantes"; el handoff documenta que `npm run build` y `npm run e2e` deben correrse en serie localmente para evitar falsos negativos transitorios de `.next` |
| 19 | `c0a729a` | Protección e2e de onboarding + puente a Intermedio | Smoke test cubre "Primeras 2 horas", Mini Lab 01, Power Fx en español y entregable mínimo; Módulo 9 ajustado con tiempo realista, puente para quien viene de Básico, evidencia mínima y enlace a Lab 09 |
| 20 | `a51728d` | Memoria explícita para Claude | `CLAUDE.md` actualizado con estado estable, conteos, baseline de tests, regla del usuario commit/push/deploy y recordatorio de leer este handoff antes de continuar |
| 21 | `147d766`, `26f40b3` | Sistema de diseño Impeccable + cierre visual Núcleo/Profundización | `/impeccable document`: `PRODUCT.md` + `DESIGN.md` ("The Fluent Learning Console") + `.impeccable/design.json` capturando tokens reales de `tailwind.config.ts`/`globals.css`/componentes `ui/`. Luego se cerró el único pendiente no bloqueante del handoff: verificación visual en navegador de los headings Núcleo obligatorio/Profundización opcional en Módulos 3, 4 y 7 — sin hallazgos |
| 22 | `a1cd11a` | `/impeccable audit` (17/20) + fixes P1/P2/P3 | Auditoría técnica de `app-elearning` contra el `DESIGN.md` del sprint 21. Hallazgo P1 real: headings `## 🟢 Núcleo obligatorio`/`## 🔧 Profundización opcional` en Módulos 3-7 rompían la jerarquía semántica (H3→H2→H5, WCAG 1.3.1) aunque se veían bien visualmente — corregidos a H4/H3, compensados con acento de color primario en `prose-h4` para no perder jerarquía visual. Hallazgo P2: la barra de progreso de lectura (`reading-progress.tsx`) escuchaba `window.scroll`, pero el scroll real ocurre en `<main id="main-content">` (`AppShell` usa `h-screen overflow-hidden`) — **la barra nunca se había movido en producción**, bug preexistente descubierto al verificar el fix de performance; corregida para escuchar el contenedor real, con throttle vía `requestAnimationFrame` y `transform: scaleX()` en vez de `width`. P3: botones icon-only 36px→44px (AAA touch target). Los 7 hallazgos del detector automático (`ai-color-palette`, `side-tab`) se verificaron como falsos positivos — patrones intencionales ya documentados en `DESIGN.md`. Validado: lint, tsc, 225/225 tests, build, 20/20 e2e |

Cada sprint terminó en verde con: `npm run validate:content`, `npm run lint`, `npx tsc --noEmit` (o `npm run typecheck`),
`npm run test:coverage` (225/225 tests históricamente), `npm run build` (o `build:pages`), y `npm run e2e` (Playwright
smoke) — antes de commit + push a `master`. En local, ejecutar `npm run build` y `npm run e2e` en serie; ambos pueden tocar
`.next` durante el primer build/dev server y, en paralelo, generar falsos negativos transitorios como `Cannot find module for page: /_document`.

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
| Onboarding principiante Módulos 1-3 (Nivel Básico) | Cerrado | Sprint 14 |
| Onboarding principiante Módulos 4-8 (Nivel Básico) | Cerrado | Sprint 15 |

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

## Verificación de producción — antes de investigar código por un reporte de "no se refleja"

Si el usuario dice que un cambio ya desplegado (deploy confirmado en verde) no se ve en producción:

1. `curl -s -D - -o /dev/null "https://edwingalarcon.github.io/PlanEstudio/<ruta>?nocache=$(date +%s)"` y
   revisar `X-Cache` (MISS = fresco), `Age`, `Last-Modified`.
2. Si el body tiene el contenido correcto y `X-Cache: MISS`, el servidor está bien — el problema es del
   lado del cliente (caché de navegador, DNS local, proxy corporativo). No tocar código todavía.
3. Si persiste en varios navegadores del mismo dispositivo/red tras hard refresh, pedir probar desde otra
   red (datos móviles) para aislar la causa antes de asumir nada sobre el repo.

Esto ya pasó una vez (sprint 13): el servidor nunca sirvió contenido viejo, era caché local del usuario,
se resolvió solo.

## Beginner UX — auditoría de estudiante principiante (sprint 14)

Se simuló un estudiante principiante real (sin experiencia previa) recorriendo Home, Cómo usar, Nivel
Básico, Módulos 1-3 y Lab 02. Hallazgos que motivaron el sprint 14:

- Home y "Cómo usar" ya estaban bien orientados — sin cambios ahí más que una frase de expectativa de
  tiempo.
- Módulo 1 pedía crear cuenta M365 Developer + activar trial + 16 conceptos antes de cualquier logro
  visible — alto riesgo de abandono en el primer contacto.
- Módulo 3 mezclaba primera app + filtros + modo oscuro + segunda app (Collections/calculadora) +
  responsive design en un solo bloque — demasiado denso para el tercer módulo de un principiante.
- `estimatedMinutes` no reflejaba tiempo real de práctica (10/5/6 min vs. 45-90 min reales).
- No existía enlace módulo→lab en ningún módulo.
- Lab 02 (el primer lab) ya era el mejor material del recorrido — clic-por-clic, resultado esperado,
  evidencia explícita; no se tocó su contenido, solo se referenció desde los módulos.

El sprint 14 corrigió esto en Módulos 1-3 únicamente (ver tabla de sprints arriba). El sprint 15 repitió
el mismo diagnóstico para **Módulos 4-8** y cerró la línea de onboarding principiante del Nivel Básico:
estimados realistas, primer logro explícito, separación de núcleo/profundización, evidencia esperada y
puentes a labs o proyecto cuando correspondía.

El sprint 16 cerró un polish adicional de entrada para estudiantes absolutos: ruta "primeras 2 horas",
Mini Lab 01 dentro del Módulo 1, checklist mínimo y quick wins/glosarios en los puntos de mayor carga
cognitiva (Power BI, Power Fx y capstone). No creó módulos ni labs nuevos y no modificó conteos. El
sprint 17 hizo visible ese checklist mínimo en la UI interactiva de `/recursos/checklist`.

## Pendientes reales actuales (todo lo demás está `Cerrado` o es `Roadmap enterprise real`)

No queda ningún pendiente de contenido "post-auditoría" ni de UX bloqueante en el roadmap original.

- Todo lo demás sigue clasificado como **Roadmap enterprise real** en la tabla de arriba — depende de
  tenant, licencia o personas reales, no de trabajo de contenido.

**Cerrado (sprint 21):** verificación visual en navegador de cómo renderiza `MarkdownRenderer` los
headings `## 🟢 Núcleo obligatorio` / `## 🔧 Profundización opcional` insertados en los Módulos 3-7.
Se levantó `npm run dev` y se inspeccionaron con captura de pantalla los Módulos 03
(`power-apps-canvas-primeras-aplicaciones`), 04 (`power-apps-model-driven-apps-basadas-en-datos`) y 07
(`fundamentos-de-power-fx-y-expresiones`) en modo oscuro: los H2/H3 con emoji renderizan con el peso,
borde inferior y espaciado esperados, los blockquotes de "Profundización opcional" usan el estilo de
callout azul correcto, y los bloques de código Power Fx renderizan con scroll horizontal propio sin
romper el layout. Sin hallazgos — no se requirió ningún cambio de código.

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

## Sprint en curso — Developer Workstation, Environment Setup & Project Foundations (Fase 1)

**Estado: commit, push, CI/deploy y verificación de producción CONFIRMADOS.** Run de GitHub Actions
`30560120482` terminó `completed success`. Producción verificada con `curl` en
`https://edwingalarcon.github.io/PlanEstudio/preparar-entorno` (sin barra final — con barra final da
404, mismo comportamiento que el resto del sitio con el export estático de Next.js/GitHub Pages):
responde 200 y contiene "Preparar mi entorno", "Setup esencial", "Matriz de herramientas". Sin acción
pendiente de verificación para esta fase.

Contexto: el sprint pedido por el usuario es un prompt de 72 secciones ("Developer Workstation,
Environment Setup & Project Foundations") — equivalente a varios sprints reales (guías profundas de
herramientas, verificador de estación con script real, prácticas SETUP-01..06, challenge, 5 incident
labs, 30 casos E2E, gates técnicos por lab, auditoría manual de 6 perfiles). Se acordó con el usuario
dividirlo en fases; **esta sesión implementó solo la Fase 1: arquitectura + setup esencial.**

Lo que entrega la Fase 1 (ya en `master`, commit `f4ba827`):
- `app-elearning/src/lib/workstation.ts`: tipos y datos puros — perfiles (`maker`, `functional`,
  `developer`, `admin`, `architect`, `rpa`), matriz de 11 herramientas × perfil × SO con nivel de
  requisito (`required`/`recommended`/`optional`/`not_required`/`required_later`), 7 pasos de setup
  esencial (tenant/entorno/Dataverse/roles/no-producción) con alternativa sin tenant, funciones puras
  (`getToolsForProfile`, `getNextWorkstationRequirement`, `recommendWorkstationProfile`,
  `validateWorkstationReferences`).
- `app-elearning/src/lib/workstation-store.ts`: store Zustand persistido, independiente, clave
  `planestudio.workstation.v1` — **no toca** `plan-estudio-progress` ni `planestudio.practice-progress.v1`.
- Ruta `/preparar-entorno` (`app-elearning/src/app/preparar-entorno/`): selector de perfil/SO, checklist
  de setup esencial, "siguiente requisito" único destacado, matriz responsive (tabla en desktop, tarjetas
  en móvil), aviso pedagógico de no-producción.
- Integrado en el sidebar (`/preparar-entorno`) y en `/mi-ruta` (bloque compacto separado del progreso
  académico, sin sumar al %).
- Tests: `workstation.test.ts` (14), `workstation-store.test.ts` (7) — Vitest en verde junto con el resto
  de la suite (315 tests totales). E2E nuevo `e2e/preparar-entorno.spec.ts` (7 casos) — 38/38 Playwright
  en verde localmente. `npm run validate:content` y `npm run build:pages` en verde.
- Conteos de contenido académico **sin cambios** (75 módulos, 72 labs, 508 preguntas, 633 criterios,
  20 prácticas profesionales) — esta fase no toca contenido de módulos/labs.

**Fase 2, sub-fase A — Script verificador de estación + parser de reporte: COMPLETADA.**

- `tools/check-workstation.ps1` (Windows/PowerShell) y `tools/check-workstation.sh` (macOS/Linux)
  corren localmente en el equipo del usuario y emiten a stdout un JSON `planestudio-workstation-report`
  v1 con el estado (`installed`/`not_installed`) y la versión detectada de las 5 herramientas
  verificables por CLI: `git`, `pac-cli`, `node`, `dotnet-sdk`, `powershell`. `tools/README.md` documenta
  el uso. Ambos scripts se probaron manualmente y producen JSON válido.
- `app-elearning/src/lib/workstation-report.ts`: parser/validador puro (`parseWorkstationReportText`,
  `validateWorkstationReportPayload`) que reutiliza el patrón de seguridad de
  `practice-portability.ts` (`findDangerousKey` contra `__proto__`/`constructor`/`prototype`, cap de
  tamaño 200 KB, `format`/`schemaVersion` versionados, `schemaVersion` futuro ⇒ `incompatible`,
  herramientas desconocidas ignoradas con warning en vez de romper el reporte completo).
- `workstation-store.ts`: nueva acción `applyWorkstationReport(entries)` que aplica `status` +
  `detectedVersion` + `verifiedAt` solo a las herramientas reconocidas, sin tocar notas ni otras
  herramientas. Sin bump de `schemaVersion` del store (v1 ya soportaba `detectedVersion`).
- `/preparar-entorno` tiene una nueva sección "Importar reporte del verificador": muestra el comando
  exacto según el SO elegido, un textarea para pegar el JSON, botón "Analizar reporte" con vista previa
  (herramientas detectadas, advertencias, errores) y botón "Aplicar al estado". La matriz de
  herramientas ahora también muestra la versión detectada junto al estado cuando existe.
- Guardarraíl anti-drift: test que verifica que todo id que el parser acepta como verificable tiene
  `verification.command` declarado en `WORKSTATION_TOOLS` (evita que reporte y modelo se desincronicen).
- Tests nuevos: `workstation-report.test.ts` (9 casos: válido, JSON inválido, formato incorrecto,
  versión futura, clave peligrosa, SO inválido, herramienta desconocida ignorada, tamaño excedido,
  guardarraíl anti-drift) y 2 casos añadidos a `workstation-store.test.ts` (`applyWorkstationReport`
  setea solo ids conocidos; preserva notas de herramientas no tocadas por el reporte). Nuevo caso E2E
  en `preparar-entorno.spec.ts`: pegar un reporte válido, analizar, aplicar, y verificar que la matriz
  muestra "Instalada" + la versión detectada.
- Baseline posterior: **305 tests Vitest**, **39 casos Playwright** (8/8 en `preparar-entorno.spec.ts`,
  31/31 en el resto de smoke). `npm run validate:content`, `lint`, `tsc --noEmit`, `build:pages` y
  `e2e` en verde localmente, corridos en serie.
- Conteos de contenido académico **sin cambios** (75 módulos, 72 labs, 508 preguntas, 633 criterios,
  20 prácticas profesionales).

**Pendiente explícito para la próxima sesión / Codex — sub-fases B+ de la Fase 2 (no implementadas):**
1. Guías profundas de Git/VS Code/Visual Studio/Node/.NET/PowerShell/PAC CLI como contenido navegable;
   prácticas SETUP-01 a SETUP-06; challenge CH-SETUP-01; incident labs INC-SETUP-001 a 005; plantillas
   starter de repositorio por tipo de proyecto; gates técnicos (`workstationRequirements`/
   `environmentRequirements`) que se muestren antes de abrir un lab; lógica de `outdated` con umbrales
   de versión (el campo `status` del store ya lo admite, solo falta la comparación de versiones); el
   resto de los ~23 casos E2E del sprint original (§63, ahora con 1 caso ya cubierto por la sub-fase A);
   auditoría manual por los 6 perfiles (§64).
2. No fusionar el progreso de `preparar-entorno` con el progreso académico ni con
   `practice-progress` — son y deben seguir siendo tres stores independientes.

## Cómo continuar

- El usuario normalmente pide sprints en el orden de la lista de pendientes de arriba, uno por turno,
  con un prompt largo tipo "actúa como [lista de roles]... Sprint — [tema]... No quiero expansión...".
- **Antes de tocar nada**, hacer `git pull --ff-only` y verificar con `git log --oneline -15` si el
  sprint pedido ya fue resuelto por una sesión anterior (con otra herramienta incluso) — ya ha pasado
  más de una vez que el trabajo ya estaba hecho y no reflejado en la copia local.
- Preferencia actual del usuario: cuando un sprint de cambios quede validado, hacer **commit, push y deploy**
  por defecto, salvo que el usuario pida explícitamente dejarlo sin commit.
- El flujo esperado es: diagnóstico → refuerzo de contenido (si hace falta) → validaciones → commit + push →
  verificar el deploy en GitHub Actions y producción.
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

Nota: correr `npm run build` y `npm run e2e` en serie en validaciones locales. No paralelizarlos en la misma copia de trabajo.

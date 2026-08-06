# PlanEstudio — Estado de sprints post-auditoría (handoff)

> Documento de traspaso para continuar el trabajo con otra herramienta/agente (Codex, Claude u otro).
> No es contenido del curso — es una nota de proceso. Puede borrarse una vez que el roadmap
> de sprints termine, o moverse a `docs/Recursos/` si se prefiere mantenerlo como referencia.

## Sprint — Beginner Continuity & Honest Prerequisites (2026-08-06)

Cierra las brechas de continuidad detectadas en la auditoría diagnóstica previa (simulación de
estudiante sin experiencia). **Alcance real ejecutado, distinto del sprint originalmente pedido de
30 secciones** — se priorizaron los fixes de mayor impacto con evidencia real (tests/build/e2e en
verde) en vez de fingir cobertura completa de cada bloque. Ver el mensaje de auditoría anterior en
el historial de conversación para el detalle de los 9 hallazgos que originaron este sprint.

**Hecho y verificado (lint + typecheck + 323 tests unitarios + `validate:content` + build + 47 e2e,
todo en verde):**
- **Terminal desde cero**: nueva sección "Cómo abrir una terminal por primera vez" (Windows/macOS/
  Linux, copiar/pegar seguro, seguridad básica) en `docs/Recursos/GUIA_HERRAMIENTAS_WORKSTATION.md`,
  enlazada desde `GL-SETUP-01` paso 3 y desde `/preparar-entorno` (junto al comando del verificador).
- **Bug real descubierto y corregido**: el renderer de markdown de la app (`markdown-renderer.tsx`,
  solo `remark-gfm`) no soportaba anclas de heading ni admonitions estilo MkDocs (`!!! tip`). Se
  instaló `rehype-slug` (dependencia nueva, pequeña, mismo ecosistema que `rehype-highlight`/
  `rehype-raw` ya usados) para generar `id` reales en los headings — esto arregla no solo los anclas
  nuevos de este sprint sino anclas **preexistentes ya rotos en producción** en `GL-SETUP-02/03/04`
  (`#git`, `#nodejs-lts`, `#power-platform-cli-pac`, `#visual-studio-code`). Se reemplazó el bloque
  `!!! tip "Prerequisito de Lenguaje"` (invisible/roto en la app) por un blockquote real en los
  Módulos 13, 23, 27 y 34.
- **Lab 03 — variante sin tenant**: sección nueva con los 6 entregables prometidos desde "Mi ruta"
  (modelo de datos, wireframes, fórmulas Power Fx propuestas, flujo de navegación, casos de prueba,
  reflexión de limitaciones), diferenciando explícitamente qué valida y qué no.
- **Módulos 23 y 34 — prerrequisitos honestos**: banner "Antes de comenzar" con modo conceptual vs.
  práctico, sin bloquear el acceso ni reducir el contenido técnico existente. Módulo 34 añade aviso
  de costos de Azure y checklist de limpieza de recursos.
- **Módulo 09 — FetchXML/OData**: introducción mínima (qué son, ejemplos, cuándo se usan) antes de su
  primer uso en "Conceptos Clave".
- **Empleabilidad conectada al recorrido**: sección "Convierte esto en evidencia laboral" al final de
  los 5 capstones (61-65), y botón "Convierte este nivel en evidencia laboral" (no obligatorio) en el
  banner de nivel completado (`level-progress-banner.tsx`).
- **Terminología**: nota de convención ("entorno" / "solución administrada" como términos principales,
  "ambiente" / "Managed" como sinónimos válidos) agregada en `GLOSARIO_TERMINOS.md`. **No** se hizo
  una migración masiva de texto en todo el repo — se descartó por riesgo de reemplazos ciegos.
- **404 de favicon**: `src/app/icon.svg` nuevo (no existía ningún icon file); confirmado en el build
  que Next genera `<link rel="icon">` respetando `basePath`.
- **404 de prefetch RSC** (`PlanEstudio.txt?_rsc=...`): mitigación acotada (`prefetch={false}` en el
  link "Inicio" del sidebar) basada en diagnóstico de la causa más probable (prefetch de Next con
  `output: export` + `basePath`); validado localmente y pendiente solo de confirmación final en
  producción cuando GitHub Actions/Pages drene la cola remota.
- Guardarraíles nuevos en `scripts/validate-content.ts`: falla si los Módulos 13/23/27/34 pierden su
  banner de prerrequisitos, si Lab 03 pierde la variante sin tenant, o si reaparece sintaxis `!!!`
  rota en cualquier módulo. Test unitario nuevo para el enlace de empleabilidad en el banner de nivel
  completo. Suite e2e nueva `e2e/beginner-continuity.spec.ts` (5 tests) cubriendo terminal, ancla real,
  Lab 03, Módulos 23/34 y el flujo de empleabilidad.

**Explícitamente NO hecho en este sprint (deferred, documentado, no inventado):**
- **Programming Foundations for Power Platform** y **Azure Foundations for Power Platform
  Integrations**: los dos cursos puente reales siguen sin existir. Los Módulos 23/34 ahora lo
  declaran honestamente; el roadmap sigue pendiente de decisión de alcance con el usuario.
- **No** se construyó el componente `TerminalPrimer` interactivo con tabs por SO — se resolvió con
  contenido markdown (misma información, sin el componente React reutilizable pedido en la sección
  5.3 del sprint original). Si se quiere la versión componentizada, es trabajo de un sprint futuro.
- **No** se implementó el sistema de metadata `prerequisiteStatus`/`learningMode` con selector de
  "modo conceptual/práctico" persistido en el store — el banner de prerrequisitos es contenido
  estático, no un estado de progreso rastreado.
- **No** se integró empleabilidad en portafolio/buscador/progreso más allá de los dos puntos ya
  descritos (capstones + banner de nivel).
- **No** se hizo la migración terminológica completa por módulo/lab/UI — solo la nota de convención.
- **No** se corrió una auditoría manual de accesibilidad ni de los 6 perfiles A-F del sprint original
  más allá de lo que ya cubre la suite e2e existente (dark mode, móvil 375px, teclado/skip-link).
**Estado de git/CI/producción al retomar con Codex (2026-08-06, actualizado tras diagnóstico de caso):**
- Commit `ad80574` ("feat: cerrar brechas de continuidad para principiantes") sí estaba en
  `origin/master`, pero los runs `31120748032` y `31125305385` quedaron en un estado inconsistente
  durante el Major Outage de GitHub Actions/Pages: la lista los mostraba como `queued`, mientras la
  API de cancelación respondía que el re-run todavía no había entrado a cola.
- Codex agregó `workflow_dispatch` y concurrencia global por rama al workflow `CI / Deploy`, para poder
  disparar el pipeline sin commits vacíos y cancelar runs obsoletos en futuros pushes.
- Al disparar manualmente el run `31126679431`, GitHub ya asignó runner y reveló el fallo real de CI:
  `npm ci` fallaba porque `app-elearning/package.json` y `app-elearning/package-lock.json` estaban
  desincronizados tras añadir `rehype-slug` (faltaban entradas `@emnapi/*` y `@emnapi/wasi-threads`
  tenía versión incompatible).
- Fix completado por Codex: `package-lock.json` fue regenerado, `npm ci` volvió a pasar localmente y
  en GitHub Actions; también quedaron `workflow_dispatch`, concurrencia global por rama y deploy manual
  desde `master`. Validación local verde: `npm ci`, lint, typecheck, `validate:content`,
  `test:coverage` (323 tests), `build:pages` y 47/47 e2e. Run manual `31126735076` pasó hasta build;
  el deploy manual posterior (`31126813357`, commit `321e302`) quedó `queued` por el mismo outage de
  GitHub Actions/Pages antes de asignar runner. Después del cierre del Diagnóstico de caso aplicado,
  Codex empujó `450137ce` y disparó manualmente `31127332409`, que también quedó `queued` sin pasos
  ejecutados. Cuando GitHub drene la cola, verificar producción en
  `https://edwingalarcon.github.io/PlanEstudio/` con cache-busting, en particular:
  `/recursos/guia-herramientas-workstation` (sección "Cómo abrir una terminal"),
  `/labs/lab-03-canvas-primera-app` (sección "Variante sin tenant"), Módulos 23 y 34 (banner "Antes
  de comenzar"), y que el favicon ya no dé 404.
- **Producción oficial migrada a Vercel (2026-08-06)**: la URL oficial ya no es GitHub Pages sino
  `https://planestudio.vercel.app/`. Se creó una publicación estática en Vercel desde
  el `out/` local ya generado y se asignó alias estable a esa URL.
  El proyecto visible en Vercel debe llamarse **`app-elearning`**. También quedó agregado
  `https://app-elearning.vercel.app/` como dominio Production limpio del proyecto; el dominio heredado
  `out-gilt-tau.vercel.app` se retiró desde **Settings → Domains** porque Vercel lo había conservado
  como default production domain al crear el primer deploy desde la carpeta `out/`.
  Si la CLI todavía muestra `out-gilt-tau` en `project list`/`inspect`, tratarlo como metadata/cache
  interna: `vercel alias ls --scope edwingalarcons-projects` confirmó los aliases activos
  `planestudio.vercel.app` y `app-elearning.vercel.app`.
  No usar build remoto desde `app-elearning` sin ajustar root/contexto, porque `content.ts` y el
  `prebuild` dependen de archivos hermanos (`../docs`, `../scripts`) que no existen si Vercel sube
  solo la subcarpeta. Receta que funcionó: `cd app-elearning`, `npm run build`, `vercel deploy out -y
  --scope edwingalarcons-projects`.

## Sprint propuesto — Code Apps (Power Apps) — NO INICIADO (2026-08-03)

El usuario notó que el plan no cubre **Power Apps Code Apps** (apps React/Vite con conectores/Dataverse
vía PAC CLI) y pidió agregarlo por ser tema actual/tendencia de Power Platform. Se estaba usando la
skill `superpowers:brainstorming` para diseñar el alcance cuando el usuario pidió guardar el estado
antes de seguir (retomar mañana o con Codex).

**Pregunta de alcance hecha al usuario, sin responder todavía**:
1. Nivel transversal nuevo (como `ia`/`d365`/`rpa`: `LEVEL_ORDER`/`TRANSVERSAL_LEVEL_ORDER` en
   `app-elearning/src/lib/i18n.ts`) — rango de `moduleId` propio, labs y prácticas dedicadas,
   navegación/progreso/certificado independientes. Mismo patrón que el sprint RPA (ver sección
   "Power Automate Desktop & RPA Professional Track" más abajo).
2. Unos módulos (2-4) dentro de un nivel de certificación existente (`avanzado` o `arquitecto`), sin
   nueva infraestructura de nivel.

No decidir por cuenta propia — retomar la pregunta con el usuario antes de tocar código o contenido.
Ver memoria `project_code_apps_gap` para contexto adicional.

## Última actualización (2026-07-29)

Último estado local antes del micro-sprint de revisión humana externa:

- Branch local: `master`, partiendo de `origin/master` limpio.
- Sprint en curso: **External Human Review Import**.
- Conteos finales locales de ese momento: **75 módulos**, **72 labs**, **508 preguntas de quiz**,
  **633 criterios**, **20 prácticas profesionales**. Estado actual tras el sprint de Diagnóstico de
  caso aplicado: **508 quiz + 375 preguntas de caso** (883 total) y **32 prácticas profesionales**.
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

Conteos actuales confirmados tras los sprints posteriores: **75 módulos, 72 labs, 508 preguntas de
quiz, 375 preguntas de diagnóstico de caso aplicado, 633 criterios**.

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
- Progresión Power Platform PL-900 → PL-200 → PL-400 → Arquitectura (41 módulos en la cadena base,
  más niveles transversales IA, D365 y RPA hasta completar 75 módulos) con dependencias claras y sin
  saltos de dificultad sin puente.
- Especialización transversal en IA aplicada al desarrollo (Copilot/Claude Code/Codex) con prompts
  reales copiables y evaluación humana explícita.
- Especialización transversal en Dynamics 365 CE/F&O (Sales, Customer Service, Customer Insights,
  Field Service, Contact Center, Finance/Supply Chain/Commerce awareness) con labs hands-on donde el
  trial lo permite (Contact Center Chat, F&O LAB-093 a LAB-100).
- Especialización transversal en Power Automate Desktop & RPA (módulos 66-75, labs LAB-104 a
  LAB-112, sandbox reproducible y operación/ALM honesta).
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

**Fase 2, sub-fase B — Gate técnico advisory antes de abrir un lab: COMPLETADA.**

- `workstation.ts`: nuevo `LAB_PRODUCT_TOOL_HINTS` (tabla explícita y pequeña, mantenida a mano, NO
  heurística difusa) que mapea 3 strings literales de `product` ya presentes en frontmatter de labs
  (`"Power Platform CLI"`, `"C#"`, `"Power Automate Desktop"`) a los ids de herramientas verificables
  `pac-cli`/`dotnet-sdk`/`power-automate-desktop`, y `getRecommendedToolsForProducts(products)`.
  `validateWorkstationReferences()` ahora también valida que todo id referenciado en
  `LAB_PRODUCT_TOOL_HINTS` exista en `WORKSTATION_TOOLS` (guardarraíl anti-drift en sentido inverso al
  de la sub-fase A). **No se tocó frontmatter de ningún lab ni sus conteos.**
- `components/labs/lab-workstation-gate.tsx` (nuevo, cliente): banner **advisory, nunca bloqueante** —
  no oculta contenido ni deshabilita "Marcar completado". Lee `useWorkstationStore`, calcula
  herramientas recomendadas para `lab.products` que aún no estén `installed`/`verified`, y no renderiza
  nada si no hay ninguna pendiente (evita ruido en los ~69 labs sin señal de herramienta). Integrado en
  `app/labs/[slug]/page.tsx` entre el header y el contenido Markdown.
- i18n: nueva clave `labWorkstationGate` (`title`/`body`/`cta`) en `i18n.ts`.
- Tests nuevos: 4 casos añadidos a `workstation.test.ts` (mapeo conocido, deduplicación, sin match,
  guardarraíl anti-drift) y `lab-workstation-gate.test.tsx` (3 casos: sin match no renderiza, herramienta
  ya instalada no renderiza, herramienta pendiente muestra banner). Nuevo caso E2E en
  `preparar-entorno.spec.ts`: visita `/labs/lab-52-cli-conexion-tenant` (declara `"Power Platform CLI"`
  en `product`), confirma el banner, navega a `/preparar-entorno` vía el CTA del propio banner, marca
  `pac-cli` como instalada, vuelve al lab y confirma que el banner ya no aparece.
- Baseline posterior: **312 tests Vitest**, **40 casos Playwright** en la corrida completa (1 falla
  aislada y no relacionada — "barra de progreso sigue el scroll del contenedor principal" de
  `smoke.spec.ts`, ya existente desde el sprint 22, confirmada como flaky: pasa 1/1 al re-ejecutarla
  sola; no toca ningún archivo de esta sub-fase). `npm run validate:content`, `lint`, `tsc --noEmit` y
  `build:pages` en verde localmente, corridos en serie.
- Conteos de contenido académico **sin cambios** (75 módulos, 72 labs, 508 preguntas, 633 criterios,
  20 prácticas profesionales).

**Fase 2, sub-fase C — Guías profundas de herramientas: COMPLETADA.**

- `docs/Recursos/GUIA_HERRAMIENTAS_WORKSTATION.md` (nuevo): guía navegable con instalación por SO,
  comando de verificación, configuración mínima y errores comunes para las 7 herramientas de la
  matriz de `/preparar-entorno` (Navegador, Git, VS Code, Visual Studio Community, Node.js LTS, .NET
  SDK, PowerShell, PAC CLI), más una nota que remite a Power Automate Desktop al Módulo 67 (sin
  duplicar contenido) y una sección final de troubleshooting sobre falsos negativos del script
  verificador.
- Registrada como recurso Next.js en `RESOURCE_FILES` (`content.ts`) con slug
  `guia-herramientas-workstation`; enlazada desde el sidebar (`sidebar.tsx`, icono `Wrench`) y desde
  el header de `/preparar-entorno` (`preparar-entorno-client.tsx`).
- `content.test.ts` actualizado: conteo de recursos 25→26, nuevo slug en la lista de assertions.
- Baseline posterior: **312 tests Vitest**, **40/40 Playwright** (incluye el flaky de scroll de la
  sub-fase B, que pasó en esta corrida). `validate:content`, `lint`, `tsc --noEmit` y `build:pages`
  en verde localmente.
- Conteos de contenido académico **sin cambios** (75 módulos, 72 labs, 508 preguntas, 633 criterios,
  20 prácticas profesionales) — esta guía es un recurso, no un módulo ni un lab.

**Fase 2, sub-fase D — Prácticas SETUP-01..06 + challenge CH-SETUP-01: COMPLETADA.**

- El roadmap original hablaba de "SETUP-01..06", pero el esquema real de `practices.ts` exige que el
  `id` empiece con el prefijo de su `practiceType` (`GL-`/`SGL-`/`CH-`/`INC-`/`SIM-`), igual que ya
  existe `CH-RPA-01`/`INC-RPA-001`. Se adoptó el mismo patrón: **`GL-SETUP-01` a `GL-SETUP-06`**
  (tipo `guided`, el primer uso real de ese `practiceType` en el repo — antes solo estaba declarado
  en el esquema) y **`CH-SETUP-01`**, sin tocar el esquema ni añadir un tipo nuevo.
- Las 6 prácticas guiadas cubren, paso a paso: Git + identidad, Node.js LTS, Power Platform CLI +
  conexión segura, VS Code + extensión Power Platform Tools, confirmación de entorno no productivo y
  rol de seguridad, y correr el verificador de estación (`tools/check-workstation`) e importar su
  reporte en `/preparar-entorno`. Cada una enlaza a la guía de herramientas (sub-fase C) y a
  `/preparar-entorno`. `CH-SETUP-01` integra las 6 en un cierre completo por perfil, sin instrucciones
  paso a paso (cumple la regla de `validatePracticeRelations` para `challenge`).
- `getPracticeCounts()` (`practices.ts`) ahora también expone `guided`; `validate-content.ts` y el
  badge de `/experiencia-practica` lo muestran junto a incidentes/challenges/simulaciones.
- Conteos de prácticas: **13 incidentes, 6 challenges (+1), 2 simulaciones, 6 guiadas (nuevo) = 27
  prácticas totales** (antes 20). Conteos de contenido académico **sin cambios** (75 módulos, 72 labs,
  508 preguntas, 633 criterios) — las prácticas son una capa aparte, no módulos ni labs.
- Tests actualizados: `practices.test.ts` (total 20→27, challenges 5→6, `guided` 6, búsqueda 20→27) y
  `smoke.spec.ts` (badges de conteo, filtro "Guided Lab" añadido con `GL-SETUP-01` visible).
- Baseline posterior: **312 tests Vitest**, **40/40 Playwright**. `validate:content`, `lint`,
  `tsc --noEmit` y `build:pages` en verde localmente.

**Fase 2, sub-fase E — Incident labs INC-SETUP-001..005: COMPLETADA.**

- 5 incidentes nuevos de troubleshooting de estación, todos con causa raíz real y verificable
  localmente (ninguno requiere tenant): `INC-SETUP-001` (`pac: command not found` tras instalar PAC
  CLI — PATH no recargado), `INC-SETUP-002` (`node --version` inconsistente entre terminales — dos
  instalaciones de Node compitiendo), `INC-SETUP-003` (commits con identidad de Git incorrecta —
  configuración local sobrescribe la global), `INC-SETUP-004` (el verificador de estación reporta
  falso "no instalada" — terminal no recargada tras instalar), `INC-SETUP-005` (extensión Power
  Platform Tools no se activa en VS Code — requiere reinicio completo, no solo "Reload Window").
  Cada uno referencia la Guía de herramientas de estación (sub-fase C) en su prevención.
- Todos cumplen el guardarraíl de `validatePracticeRelations` para `incident`: incluyen
  `## Solución de referencia` y la frase "causa raíz", y tienen 4 pistas escalonadas.
- Conteos de prácticas: **18 incidentes (+5), 6 challenges, 2 simulaciones, 6 guiadas = 32 prácticas
  totales** (antes 27). Conteos de contenido académico **sin cambios**.
- Tests actualizados: `practices.test.ts` (total 27→32, incidentes 13→18, búsqueda 27→32) y
  `smoke.spec.ts` (badges de conteo, "18 de 32" en el filtro de incidentes).
- Baseline posterior: **312 tests Vitest**, **40/40 Playwright** confirmados (una corrida completa
  tuvo 5 timeouts transitorios por contención de recursos del entorno de validación — las mismas 5
  pasaron limpiamente al re-ejecutarlas en aislamiento inmediatamente después; no es una regresión de
  esta sub-fase). `validate:content`, `lint`, `tsc --noEmit` y `build:pages` en verde localmente.

**Fase 2, sub-fase F — Lógica de `outdated`, ampliación de hints y auditoría de 6 perfiles: COMPLETADA
(cierra la Fase 2 con el alcance verificable disponible en esta sesión).**

- **Bug real corregido en los scripts de la sub-fase A**: `tools/check-workstation.ps1`/`.sh` tomaban
  ciegamente la primera línea de la salida del comando de verificación como `rawVersion`. Para
  `dotnet --info`, la primera línea es un encabezado ("SDK DE .NET:"), no la versión — el reporte
  nunca mostró una versión útil para `.NET SDK`. Corregido: ambos scripts ahora buscan la primera
  línea que matchea un patrón de versión (`\d+\.\d+`) en toda la salida, con la primera línea como
  fallback si ninguna matchea. Verificado manualmente en PowerShell y en `sh`.
- **Lógica de `outdated` por versión mínima**: `WorkstationToolVerification` ahora admite
  `minMajorVersion` opcional (declarado para `git` ≥2, `node` ≥18, `dotnet-sdk` ≥6, `powershell` ≥7;
  `pac-cli` queda sin umbral por no tener una referencia confiable de versión mínima). Nueva función
  `extractMajorVersion()` en `workstation-report.ts`: si el parser recibe una entrada `"installed"`
  con versión por debajo del mínimo, la reclasifica como `"outdated"` con un warning explicativo. Los
  scripts locales siguen reportando solo `installed`/`not_installed` — la comparación de versión vive
  enteramente en el cliente.
- **`LAB_PRODUCT_TOOL_HINTS` ampliado** con 3 señales adicionales de alta confianza ya presentes en
  `product` de labs reales: `"Azure DevOps"` → `git`, `"GitHub Copilot"` y `"Claude Code"` → `vscode`
  (el Módulo 44 ya liga explícitamente Copilot con VS Code). El guardarraíl anti-drift ya existente
  cubre las nuevas entradas sin cambios.
- **Auditoría manual de los 6 perfiles** (`maker`, `functional`, `developer`, `admin`, `architect`,
  `rpa`) × 3 sistemas operativos, vía script de inspección directa sobre `getToolsForProfile`
  (equivalente a recorrer la UI a mano, pero reproducible): confirmó que cada perfil recibe el
  conjunto de herramientas obligatorias esperado y que el "Setup esencial" es idéntico e independiente
  del perfil. **Hallazgo real**: el perfil `rpa` en macOS/Linux no tiene ninguna herramienta
  obligatoria relacionada con RPA (Power Automate Desktop es solo Windows y se excluye del todo por
  plataforma), pero la app no explicaba por qué. Corregido con un aviso inline en `/preparar-entorno`
  cuando `profile === "rpa"` y el SO no es Windows, explicando que se necesita una máquina Windows
  (física o virtual) para los labs de RPA.
- **Fuera de alcance de esta sub-fase, honestamente sin resolver**: el "resto de los ~23 casos E2E
  del sprint original (§63)" y el detalle exacto de "plantillas starter de repositorio por tipo de
  proyecto" provienen de un prompt de 72 secciones de una sesión anterior que no está disponible en el
  contexto de esta sesión — no se puede enumerar ni verificar contra ese documento sin que el usuario
  lo vuelva a proporcionar. No se inventó una lista de casos para simular cobertura.
- Tests nuevos/actualizados: `workstation-report.test.ts` (+4 casos: outdated por versión mínima, no
  outdated en o sobre el mínimo, sin umbral nunca marca outdated, `extractMajorVersion` con distintos
  formatos), `workstation.test.ts` (+1 caso: nuevas señales de `LAB_PRODUCT_TOOL_HINTS`),
  `preparar-entorno.spec.ts` (+2 casos: aviso RPA no-Windows, gate reconoce Copilot/Claude Code →
  VS Code en `lab-45`).
- Baseline posterior: **316 tests Vitest**, **42/42 Playwright** confirmados en una corrida completa.
  `validate:content`, `lint`, `tsc --noEmit` y `build:pages` en verde localmente.

## Cierre de la Fase 2 (Developer Workstation, Environment Setup & Project Foundations)

Sub-fases A–F completas y desplegadas: script verificador + parser (A), gate técnico advisory en
labs (B), guía de herramientas (C), prácticas guiadas + challenge de setup (D), incident labs de
troubleshooting (E), y outdated/hints/auditoría de perfiles (F). Todo el trabajo quedó verificado en
producción tras cada sub-fase. Los dos ítems que quedan explícitamente abiertos (plantillas starter de
repositorio, y el resto exacto de casos E2E del prompt original de 72 secciones) requieren que el
usuario aporte de nuevo ese documento o defina el alcance de las plantillas — no son un olvido, son
una dependencia externa a esta sesión.

No fusionar el progreso de `preparar-entorno` con el progreso académico ni con `practice-progress` —
son y deben seguir siendo tres stores independientes.

## Sprint — Diagnóstico de caso aplicado (piloto APROBADO 2026-08-04; escalando por nivel)

**Estado: piloto de 5 módulos entregado y APROBADO por el usuario sin cambios ("Las preguntas
están bien, acordes. Me gusta. Apruebo") el 2026-08-04. Escalando a los 70 módulos restantes,
por nivel, un commit por nivel (decisión del usuario). Nivel Básico (módulos 2-8, 35 preguntas)
completado en el mismo día.** Contexto para quien retome esto (Codex u otra sesión):

- Entregado: campo `appliesTo: "quiz" | "caso"` en `Question`/`RawQuestion` (`quiz-engine.ts`,
  `extract-questions.mjs`, regenerado en `data/questions.ts`); `questions-parser.ts` separa el
  pool completo (`getAllParsedQuestions`, interno) del pool público `getAllQuestions()`
  (solo `appliesTo: "quiz"`, así el simulador/dashboard/quiz de módulo no cambian: siguen en
  508) y expone `getCaseDiagnosisForModule(moduleId)` para las preguntas de caso.
- 25 preguntas nuevas (5 por módulo × 5 módulos: **1, 9, 18, 31, 53**) en
  `docs/javascripts/evaluaciones-simulador.js`, ancladas al "Caso Real de Negocio" real de cada
  módulo (NovaBio, Constructora, Aseguradora, Banco, Application User con permisos excesivos).
  Total banco tras `extract-questions.mjs`: 533 preguntas (508 quiz + 25 caso).
- UI: nueva sección "Diagnóstico de caso aplicado" en `page.tsx` de módulo, entre el contenido
  markdown y la sección de "Práctica recomendada"/quiz normal, reutilizando `QuizPanel` con
  `moduleId={`caso-${mod.moduleId}`}` y `saveScore={false}` (decisión del usuario: piloto
  efímero, sin tocar `progress.ts`; solo se muestra si el módulo tiene preguntas de caso).
- **Bug preexistente encontrado y corregido en el mismo commit** (afectaba también el quiz
  normal de 508 preguntas en producción, no solo el piloto): en `quiz-panel.tsx`, la pantalla de
  "feedback" tras responder mostraba el prompt/opciones de la *siguiente* pregunta (porque
  `getCurrentQuestion(session)` ya avanza tras `recordAttempt`), mientras que el texto de
  correcto/incorrecto y la explicación sí correspondían a la pregunta recién respondida. Fix:
  nuevo `displayQuestion` (usa `lastAttempt.question` durante feedback) y el número de pregunta
  del header ahora usa `answeredCount` en feedback en vez de `answeredCount + 1`. Test de
  regresión en `quiz-panel.test.tsx` (nuevo archivo, primer test de componente para QuizPanel).
- **Piloto aprobado** (2026-08-04): el usuario confirmó tono/dificultad sin pedir cambios. Ver
  memoria `feedback_case_diagnosis_pilot` — no hace falta re-aprobar el estilo en cada nivel.
- **Nivel Básico completado** (2026-08-04, mismo día que la aprobación): 35 preguntas nuevas (5
  por módulo) para los módulos 2-8 (módulo 1 ya cubierto por el piloto), ancladas a sus Casos
  Reales (TransCargo, Hotel Terramar, CRM PyME, Onboarding, Dashboard Ejecutivo de Ventas,
  MediSupply, Constructora Andina). Total banco tras `extract-questions.mjs`: 568 preguntas (508
  quiz + 60 caso). Nivel Básico completo (módulos 1-8) ya tiene Diagnóstico de caso.
- **Nota de e2e**: durante la validación del Nivel Básico, `npm run e2e` mostró flakiness real de
  entorno (tests distintos fallando en cada corrida — sidebar D365, onboarding, RPA — ninguno
  relacionado con el contenido nuevo). Aislados uno por uno, todos pasaron; el más lento tardó
  37.7s en una navegación simple, consistente con máquina bajo carga tras una sesión larga de
  builds/tests repetidos, no con una regresión real. Si esto se repite en sesiones futuras, correr
  los tests fallidos en aislamiento (`npx playwright test -g "<nombre>"`) antes de asumir un bug.
- **Nivel Intermedio completado** (2026-08-04, mismo día): 40 preguntas nuevas (5 por módulo)
  para los módulos 10-17 (módulo 9 ya cubierto por el piloto), ancladas a sus Casos Reales
  (Banco regional/Component Library, Empresa importadora/flujos, Cadena de retail/RLS-DAX,
  Aseguradora/JS-PCF, Distribuidora/Custom Connector CUFE, Mesa de ayuda IT/Copilot Studio,
  Firma de consultoría/ALM, Proyecto Integrador Nivel 2). Total banco: 608 preguntas (508 quiz +
  100 caso). Nivel Intermedio completo (módulos 9-17) ya tiene Diagnóstico de caso.
- **Confirmación adicional de flakiness ambiental (Nivel Intermedio)**: el test
  "sidebar mantiene D365 consistente en rutas transversales" volvió a fallar por timeout de
  navegación (`page.goto` a `/dynamics-365`, página con mucho contenido) tanto con los cambios
  del Nivel Intermedio aplicados como con `git stash` (código exactamente igual al ya commiteado
  y desplegado con éxito en CI, commit `cab2e97`). Esto descarta de forma concluyente que sea un
  problema del contenido nuevo — es degradación de la máquina local tras muchas horas de
  builds/dev-servers/tests repetidos en la misma sesión. **CI en GitHub Actions (máquina limpia)
  no mostró este problema** en ningún run de este sprint; la validación de negocio para cada
  nivel se apoya en: unit tests (322/322), lint, tsc y build siempre verdes localmente, más el
  resultado real de CI tras cada push.
- **Nivel Avanzado completado** (2026-08-04, mismo día): 60 preguntas nuevas (5 por módulo) para
  los módulos 19-30 (módulo 18 ya cubierto por el piloto), ancladas a sus Casos Reales (Partner
  Microsoft/CI-CD Azure DevOps, Software company/Unified Routing + Customer Insights + Field
  Service, Empresa de servicios/Power Pages, Banco/Copilot Studio SSO+HRIS, Empresa
  financiera/C# Plugin Pre-Create, Logística/Service Bus middleware, Marketplace B2B/Saga
  Pattern, Retailer/performance Canvas App, Firma de abogados/PCF Dataset Control, Firma de
  consultoría/Code Apps, SaaS multi-país/Azure AD B2C, Proyecto Multicapa/orden de despliegue).
  Total banco: 668 preguntas (508 quiz + 160 caso). Niveles Básico, Intermedio y Avanzado
  completos (módulos 1-30).
- **Nota de validación de este nivel**: dado el flakiness ambiental ya confirmado y documentado
  arriba (mismo comportamiento con y sin cambios, vía `git stash`), la suite `npm run e2e` local
  se omitió para este nivel; la validación se apoyó en unit tests (322/322), lint, tsc y build
  (todos verdes) más el resultado real del run de CI en GitHub Actions tras el push.
- **Nivel Arquitecto completado** (2026-08-04, mismo día): 50 preguntas nuevas (5 por módulo) para
  los módulos 32-41 (módulo 31 ya cubierto por el piloto), ancladas a sus Casos Reales (Multinacional
  5,000 empleados/CoE Starter Kit, Grupo empresarial LATAM-España/GDPR y multi-tenant, Grupo
  industrial/Azure Integration Services, Retailer 50 tiendas/Fabric-Synapse-Medallion, Empresa de
  salud/HIPAA y seguridad enterprise, Firma de contabilidad/AI Builder Document Processing, dos
  casos de liderazgo técnico — propuesta al CFO y trazabilidad en UAT—, Aseguradora/transformación
  digital con Power Pages+AI Builder, preparación de candidato a Solution Architect, Cooperativa
  financiera/proyecto capstone). Total banco tras `extract-questions.mjs`: 718 preguntas (508 quiz +
  210 caso). Niveles Básico, Intermedio, Avanzado y Arquitecto completos (módulos 1-41).
- **Fixture de test actualizado**: `questions-parser.test.ts` verificaba que el módulo 32 (recién
  cubierto en este nivel) devolviera un array vacío — se actualizó la lista de módulos con caso
  (ahora incluye 32-41) y el módulo usado como "sin pilot" pasó de 32 a 60 (nivel D365, aún sin
  cubrir). Sin este ajuste el test fallaba porque la aserción quedó obsoleta al escalar el nivel.
- **e2e de este nivel**: se corrió `npm run e2e` completo; 1 test falló
  ("onboarding guiado persiste y muestra ruta de fundamentos") por timeout esperando el texto
  "Empiezo desde cero". Confirmado con `git stash` que el mismo test falla igual sin los cambios de
  este nivel aplicados — es el mismo flakiness ambiental ya documentado en Nivel Intermedio, no una
  regresión del contenido nuevo. Validación real: unit tests (322/322), lint, tsc y build verdes
  localmente, más el resultado de CI en GitHub Actions tras el push.
- **Nivel IA completado por Codex (2026-08-06)**: 65 preguntas nuevas (5 por módulo) para los módulos
  42-52 y 54-55; el módulo 53 ya estaba cubierto por el piloto. Todas están ancladas a los casos reales
  de SIT: plugin C# con llamadas síncronas, Copilot habilitado sin gobierno por entorno, logging con
  `Console.WriteLine`, agente con alcance demasiado amplio, flujo de gastos con condición de carrera,
  plantillas de prompt reutilizables, revisión de diffs, secretos en prompts, CI omitido, flujo humano-IA,
  `pac auth` contra cliente equivocado, ALM managed/unmanaged y evaluación estándar D365 antes de custom.
  Total banco tras `extract-questions.mjs`: **783 preguntas** (508 quiz + 275 caso). Niveles Básico,
  Intermedio, Avanzado, Arquitecto e IA completos (módulos 1-55).
- **Validación local del Nivel IA**: `validate:content`, `lint`, `typecheck` en serie, `test:coverage`
  (323/323), `build:pages` y `npm run e2e` (47/47) en verde. Nota operativa confirmada de nuevo:
  no correr `typecheck` en paralelo con `build:pages` porque ambos tocan `.next` y puede aparecer un
  falso TS6053 sobre `.next/types`.
- **Nivel D365 completado por Codex (2026-08-06)**: 50 preguntas nuevas (5 por módulo) para los
  módulos 56-65, ancladas a sus casos reales de negocio: Sales, Customer Service, Field Service,
  Project Operations, Finance, Supply Chain, Commerce, Marketing/Journeys, Contact Center y el
  capstone integrado D365. Total banco tras `extract-questions.mjs`: **833 preguntas** (508 quiz +
  325 caso). Niveles Básico, Intermedio, Avanzado, Arquitecto, IA y D365 completos (módulos 1-65).
- **Validación local del Nivel D365**: `validate:content`, `questions-parser.test.ts`, `lint`,
  `typecheck`, `test:coverage` (323/323) y `build:pages` en verde antes del commit.
- **Nivel RPA completado por Codex (2026-08-06)**: 50 preguntas nuevas (5 por módulo) para los
  módulos 66-75, preservando las 20 preguntas normales de quiz que ya existían en RPA. Los
  diagnósticos cubren viabilidad RPA/API, ejecución unattended, mantenibilidad por subflows,
  idempotencia de archivos y pagos, automatización web, legacy Win32, selectores resilientes,
  orquestación cloud+PAD+Dataverse y ALM/rollback por ambiente. Total banco tras
  `extract-questions.mjs`: **883 preguntas** (508 quiz + 375 caso). Todos los 75 módulos ya tienen
  "Diagnóstico de caso aplicado".
- **Validación local final del sprint de Diagnóstico de caso aplicado**: `validate:content`, `lint`,
  `typecheck`, `test:coverage` (323/323), `build:pages` y `npm run e2e` (47/47) en verde, corridos en
  serie. El guardarraíl `questions-parser.test.ts` ahora exige preguntas de caso para los módulos
  1-75 y mantiene que `getQuestionsForModule()` no incluya preguntas `appliesTo: "caso"`.
- **Próximo paso al retomar**: ya no quedan niveles pendientes para escalar el Diagnóstico de caso
  aplicado. Solo revisar el estado de CI/deploy remoto del último push; si GitHub Actions sigue en
  cola/capacidad, no asumir regresión local sin evidencia porque la validación local completa pasó.

### Contexto original del diseño (2026-08-03/04, antes de implementar)

- Origen: el usuario preguntó cómo funcionan las secciones "Casos Reales de Negocio" de cada módulo
  (75 módulos, 1 por módulo, sección 4 del formato fijo de 7). Se confirmó por código: son narrativa
  de lectura (empresa ficticia distinta por módulo, ej. "NovaBio" en Módulo 1), **sin validación, sin
  ejercicio** — 0 labs las replican (los 72 labs usan una empresa ficticia recurrente distinta, "SIT",
  y sí son hands-on paso a paso). El usuario esperaba que los Casos Reales también fueran guiados.
- Decisión acordada: no reescribir los 75 casos como labs completos (duplicaría el trabajo de los 72
  labs ya existentes, alto riesgo de calidad si se hace de golpe). En su lugar, agregar un
  **"Diagnóstico de caso aplicado"** al final de cada Caso Real de Negocio: 4-6 preguntas de
  *aplicación/decisión* (no de memoria — tipo "dado este problema, ¿qué componente usarías"),
  auto-calificadas al instante.
- Mecanismo técnico ya identificado y reutilizable, sin construir nada nuevo: `quiz-engine.ts` +
  `quiz-panel.tsx` (el motor de quiz existente, 43 tests, patrón visual "Quiz Option Button" de 3
  estados ya documentado en DESIGN.md) sirve tal cual — mismo schema `Question` (`moduleId`, `type`,
  `prompt`, `options`, `answer`, `explanation`). Se necesita un campo nuevo para distinguir estas
  preguntas de las del quiz normal del módulo (p. ej. `appliesTo: "quiz" | "caso"`) para que no se
  mezclen con el pool del simulador ni contaminen el score del quiz de módulo — el "Diagnóstico de
  caso" se trackea como señal aparte.
- Escala real: 4-6 preguntas × 75 módulos = **300-450 preguntas nuevas**, casi duplica el banco actual
  (508). Por eso el plan acordado es **piloto primero**, no todo de una vez:
  1. Escribir el Diagnóstico de caso aplicado para 5 módulos piloto: **Módulo 1, 9, 18, 31, 53** (uno
     por nivel: Básico, Intermedio, Avanzado, Arquitecto, IA/D365).
  2. Validar tono/dificultad/formato con el usuario antes de tocar los 70 módulos restantes.
  3. Solo tras aprobación del piloto, escalar al resto.
- **Próximo paso concreto al retomar**: extender el tipo `Question` (`quiz-engine.ts`) y el formato de
  `evaluaciones-simulador.js`/`questions-parser.ts` con el campo de distinción, escribir las preguntas
  piloto de los 5 módulos listados, montar el componente de diagnóstico bajo la sección "Caso Real de
  Negocio" en `markdown-renderer.tsx` o donde se renderice el contenido de módulo, correr
  `validate:content` + lint + tsc + tests + build antes de mostrar el piloto al usuario.

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

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
| 2 | `de3634e` | Profundidad D365 60-65 | Módulos 60 (Sales), 61 (Customer Service), 62 (Contact Center/Omnichannel), 63 (Customer Insights Journeys), 64 (Integración CE+F&O), 65 (Capstone) nivelados con la profundidad de 56-59: matrices con datos concretos, diagramas Mermaid, payloads JSON, preguntas de entrevista, referencias explícitas a labs 66/81/68/82/83/58/84/70/88/90 |
| 3 | `a0966fe` | Profundidad IA con ejemplos reales | Módulos 42-55 reforzados con prompts reales copiables. Módulo 47 reescrito como biblioteca central de 8 plantillas de prompt (Fit-Gap funcional, diseño Dataverse, revisión Power Fx, revisión JS model-driven, revisión plugin C#, documentación Power Automate, casos UAT, análisis de vacante). Resto de módulos IA con prompt completo + ejemplo de mejora iterativa (débil→mejorado) + criterio de evaluación humana + conexión a labs |
| 4 | `257e734`, `faba63b` | Alcance de labs D365 + refuerzo admin/migration | Delimitación explícita del alcance de labs D365, refuerzo de rutas job-ready Admin/Governance y Migration/Legacy |
| 5 | `8e5f377`, `2c1f4ca` | Navegación transversal D365 unificada | Home, Labs, Checklist y páginas de nivel usan D365 consistente. Nombre visible: `Dynamics 365 Especialización`. Descripción: `CE avanzado + F&O Awareness`. Conteo: `10 módulos`. Footer/sidebar incluye D365. Deploy confirmado en Actions run `29886777674` |
| 6 | `df2bbc6` | Cierre de pendientes job-ready | Checklist, portafolio, rúbricas y matriz laboral actualizados con trazabilidad completa |
| 7 | `6c4b1dc` | Trazabilidad Migration/Legacy | Se corrigió el lenguaje para no vender la ruta como experiencia productiva real: `Parcial / Awareness avanzado / Job-ready simulation`. Archivos: `docs/Recursos/CHECKLIST_PROGRESO.md`, `JOB_READY_DATA_MIGRATION_LEGACY.md`, `MATRIZ_SKILLS_LABORALES.md`, `PORTAFOLIO_PROFESIONAL.md`, `RUBRICAS_PLANTILLAS_EVALUACION.md`. No se crearon módulos ni labs. Deploy confirmado en Actions run `29888427282` |

Cada sprint terminó en verde con: `npm run validate:content`, `npm run lint`, `npx tsc --noEmit` (o `npm run typecheck`),
`npm run test:coverage` (225/225 tests), `npm run build` (o `build:pages`), y `npm run e2e` (Playwright smoke, 18-19/19) —
antes de commit + push a `master` + verificación del workflow `CI / Deploy` en GitHub Actions
(`gh run watch <run-id> --exit-status`) hasta ver el job `Deploy to GitHub Pages` en verde.

Conteos fijos confirmados en todos los sprints: **65 módulos, 63 labs, 488 preguntas, 603 criterios**.

## Diagnósticos cerrados (no re-abrir sin instrucción explícita)

- **Duplicados D365/F&O** — los pares `LAB-058/084`, `LAB-067/085`, `LAB-069/089`, `LAB-070/088` son
  complementarios (fundamentos vs. profundización/capstone), no duplicados. No fusionar, no deprecar,
  no crear labs nuevos.
- **Slug del Módulo 40** — se renombró el archivo de `40-preparacion-pl-600.md` a
  `40-arquitectura-power-platform-casos-estudio.md` (commit `0477cc5` y anteriores). Verificar si este
  pendiente histórico ya quedó resuelto antes de asumir que sigue abierto.

## Pendientes honestos (sin resolver, en orden probable de siguiente sprint)

1. **Admin/Governance y Solution Architect** — solo tocado con ejemplos mínimos dentro de IA
   (Módulo 55), sin sprint dedicado propio.
2. **Inglés técnico** — pendiente, ningún sprint lo ha tocado todavía.
3. **CV/LinkedIn práctico** — solo ejemplos de prompt en Módulo 47 (análisis de vacante contra
   portafolio); no existe un sprint completo de CV/LinkedIn.
4. **UX de navegación transversal** — cerrada para D365; solo revisar si aparece nueva inconsistencia.
5. **Discrepancia 602 vs. 632** en `docs/Recursos/CHECKLIST_PROGRESO.md` — solo investigar si la
   mención vuelve a aparecer; al cierre del último sprint el validador reporta 603 criterios de forma
   consistente.
6. **Migración enterprise real** (dataset grande realista, migración incremental, reconciliación
   avanzada, tooling ETL real, CRM on-premises real, SQL/IIS/ADFS/networking productivo, performance
   troubleshooting real, cutover productivo) — explícitamente fuera de alcance actual de Migration/Legacy,
   documentado como límite reconocido, no como "próximo sprint" normal.

## Cómo continuar

- El usuario normalmente pide sprints en el orden de la lista de pendientes de arriba, uno por turno,
  con un prompt largo tipo "actúa como [lista de roles]... Sprint — [tema]... No quiero expansión...".
- **Antes de tocar nada**, hacer `git pull --ff-only` y verificar con `git log --oneline -15` si el
  sprint pedido ya fue resuelto por una sesión anterior (con otra herramienta incluso) — ya ha pasado
  más de una vez que el trabajo ya estaba hecho y no reflejado en la copia local.
- El flujo esperado es: diagnóstico → refuerzo de contenido → validaciones → informe al usuario
  **sin commitear todavía** → solo si el usuario responde algo como "commit, push y deploy" (mensaje
  corto y explícito), hacer commit + push + verificar el deploy en GitHub Actions.
- Mensaje de commit: descriptivo, en español, terminando con
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.

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

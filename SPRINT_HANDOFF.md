# PlanEstudio — Estado de sprints post-auditoría (handoff)

> Documento de traspaso para continuar el trabajo con otra herramienta/agente (Codex u otro).
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

Cada sprint terminó en verde con: `npm run validate:content`, `npm run lint`, `npx tsc --noEmit`,
`npm run test:coverage` (225/225 tests), `npm run build`, y `npm run e2e` (Playwright smoke, 18/18) —
antes de commit + push a `master` + verificación del workflow `CI / Deploy` en GitHub Actions
(`gh run watch <run-id> --exit-status`) hasta ver el job `Deploy to GitHub Pages` en verde.

## Pendientes honestos (sin resolver, en orden probable de siguiente sprint)

1. **Duplicados D365/F&O** — contenido repetido entre labs 66-70 (fundamentos) y 81-90
   (profundización/capstones) sin deduplicar todavía.
2. **Migration/Legacy** — ruta de especialización (`JOB_READY_DATA_MIGRATION_LEGACY.md` en
   `docs/Recursos/`) aún no reforzada con el mismo criterio de los sprints anteriores.
3. **Admin/Governance y Solution Architect** — solo tocado con ejemplos mínimos dentro de IA
   (Módulo 55), sin sprint dedicado propio.
4. **Inglés técnico** — pendiente, ningún sprint lo ha tocado todavía.
5. **CV/LinkedIn práctico** — solo ejemplos de prompt en Módulo 47 (análisis de vacante contra
   portafolio); no existe un sprint completo de CV/LinkedIn.
6. **UX de navegación transversal** — pendiente desde el sprint 1 (separación visual niveles
   certificación vs. transversales, mejoras de sidebar más allá de labels).
7. **Slug desactualizado del Módulo 40** — nunca se ha tocado por no considerarse "estrictamente
   necesario" en ningún sprint hasta ahora. Requiere revisar referencias antes de cambiarlo (rutas,
   tests, `content.ts`).
8. **Discrepancia 602 vs. 632 en `docs/Recursos/CHECKLIST_PROGRESO.md`** — pendiente de investigar
   cuál número es el correcto y por qué difiere del conteo real de 603 criterios que reporta
   `validate:content`.

## Cómo continuar

- El usuario normalmente pide sprints en el orden de la lista de pendientes de arriba, uno por turno,
  con un prompt largo tipo "actúa como [lista de roles]... Sprint — [tema]... No quiero expansión...".
- **Antes de tocar nada**, verificar si el sprint pedido ya fue resuelto por una sesión anterior
  (`git log --oneline -10` y leer los archivos reales) — ya ha pasado más de una vez que el sprint
  solicitado ya estaba hecho.
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

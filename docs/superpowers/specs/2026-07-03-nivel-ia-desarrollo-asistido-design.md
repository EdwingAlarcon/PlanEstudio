# Diseño: Nivel transversal "Desarrollo Asistido por IA"

**Fecha:** 2026-07-03
**Estado:** Aprobado, pendiente de implementación

## Contexto y motivación

El plan de estudio actual (app Next.js en `app-elearning/`) tiene 4 niveles secuenciales
(Básico → Intermedio → Avanzado → Arquitecto, 41 módulos, moduleId 1-41) alineados a las
certificaciones PL-900/PL-200/PL-400/PL-600. Se quiere agregar una capa **transversal** de
desarrollo asistido por IA (Copilot, GitHub Copilot, Claude Code, Codex) que no es
prerequisito de ningún nivel ni está gateada por ellos, pero debe integrarse con el mismo
nivel de paridad funcional que los niveles existentes: contenido navegable, quiz por
módulo, checklist de progreso, laboratorios prácticos y certificado de finalización.

**Restricción explícita del usuario:** ningún rediseño grande ni refactor innecesario.
Esta es una extensión aditiva sobre patrones ya existentes en el código (arrays y
`Record<LevelId, {...}>` que ya se recorren dinámicamente), no una reestructuración.

Nota de alcance: durante el brainstorming se verificó que la "fase de actualización
Microsoft 2026 / rutas por rol" mencionada inicialmente por el usuario no existe en este
repositorio (ni en el historial de git ni en el árbol de archivos). Se confirmó con el
usuario que se trabaja sobre el estado real actual (4 niveles / 41 módulos / 9 labs / 314
preguntas), y que esa otra fase, si existe, se abordará por separado.

## Decisiones de diseño (confirmadas con el usuario)

1. **Estructura:** nuevo `LevelId` `"ia"` con su propio rango de `moduleId` (no
   sub-módulos dentro de un nivel existente, no página de recurso estático).
2. **Orden y progresión:** `LEVEL_ORDER` pasa a `[basico, intermedio, avanzado,
   arquitecto, ia]`. El nivel IA **no** exige haber completado nada antes y se accede
   libremente desde el sidebar/home en cualquier momento. Al completar Arquitecto, el
   banner de "siguiente nivel" **no** debe sugerir "Comenzar Nivel IA": la transición
   Arquitecto → IA se trata como caso especial (ver sección "Cambios de comportamiento").
3. **Paridad de contenido:** los 10 módulos tienen paridad completa con los existentes —
   contenido de 7 secciones, 8 preguntas cada uno en el banco de evaluaciones, y entrada
   en el checklist de progreso.
4. **Labs y certificado:** se agregan 2 laboratorios prácticos (no 0, no muchos) y sí se
   genera certificado de finalización para el nivel IA (mismo flujo que los otros 4
   niveles), con copy que no reference un examen oficial PL-xxx.

## Estructura de contenido nueva

### Módulos (moduleId 42-51, `app-elearning/content/modules/ia/`)

| moduleId | Slug | Título | Subtema origen |
|---|---|---|---|
| 42 | `fundamentos-ia-desarrollo` | Fundamentos de IA para Desarrollo | 1 |
| 43 | `copilot-en-power-platform` | Copilot en Power Platform | 2 |
| 44 | `github-copilot-en-vscode` | GitHub Copilot en VS Code | 3 |
| 45 | `claude-code-y-codex` | Claude Code y Codex para Análisis e Implementación | 4 |
| 46 | `vibe-coding-controlado` | Vibe Coding Controlado | 5 |
| 47 | `prompts-tecnicos-reutilizables` | Prompts Técnicos Reutilizables | 6 |
| 48 | `revision-de-diffs-y-prs` | Revisión de Diffs y Pull Requests | 7 |
| 49 | `seguridad-secretos-y-compliance` | Seguridad, Secretos y Compliance en IA | 8 |
| 50 | `tests-cicd-y-guardrails` | Tests, CI/CD y Guardrails para Código Generado por IA | 9 |
| 51 | `flujo-recomendado-humano-ia-ci` | Flujo Recomendado: Humano Diseña, IA Implementa, CI Valida, Humano Aprueba | 10 |

Cada archivo sigue el frontmatter estándar y la estructura de 7 secciones fija de
`CLAUDE.md` (Objetivo, Conceptos Clave, Actividades Prácticas Paso a Paso, Casos Reales de
Negocio, Buenas Prácticas, Errores Comunes, Criterios de Validación):

```yaml
---
moduleId: 42
title: "Fundamentos de IA para Desarrollo"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: <calculado según contenido>
slug: "fundamentos-ia-desarrollo"
---
```

El campo `certification` se mantiene por convención documental aunque
`validateModuleFrontmatter` en `content.ts` no lo lee actualmente hacia `ModuleInfo` (ya
es así para los 41 módulos existentes — comportamiento inalterado).

Contenido a cubrir por módulo (guía de alcance, no texto final):

- **42 — Fundamentos de IA para desarrollo:** qué es un LLM aplicado a código, modelos de
  Anthropic/OpenAI relevantes, diferencia entre autocompletado, chat y agentes; límites y
  alucinaciones.
- **43 — Copilot en Power Platform:** Copilot en Power Apps (generación de apps/fórmulas),
  Copilot en Power Automate (generación de flujos), Copilot Studio como IA generativa de
  agentes; gobernanza de datos al usarlo.
- **44 — GitHub Copilot en VS Code:** autocompletado, Copilot Chat, Copilot Edits, uso en
  proyectos PCF/Code Apps/plugins C# del propio plan de estudio.
- **45 — Claude Code y Codex:** agentes de código para análisis de repos grandes,
  refactors guiados, uso de herramientas (bash, edición, búsqueda), diferencias de
  enfoque entre ambos.
- **46 — Vibe coding controlado:** cuándo es aceptable generar código sin especificación
  exhaustiva, y qué controles mínimos (revisión, tests, scope acotado) lo hacen seguro en
  un contexto empresarial.
- **47 — Prompts técnicos reutilizables:** plantillas de prompt para tareas recurrentes
  (nueva entidad Dataverse, flujo de aprobación, componente PCF), versionado de prompts.
- **48 — Revisión de diffs y PRs:** cómo revisar un diff generado por IA, qué buscar
  (alcance, efectos secundarios, seguridad), uso de revisores automáticos/agentes de
  revisión.
- **49 — Seguridad, secretos y compliance:** fuga de secretos a prompts/logs, política de
  datos sensibles del tenant, cumplimiento (GDPR/residencia de datos) al usar IA con datos
  de Dataverse.
- **50 — Tests, CI/CD y guardrails:** exigir tests para código generado, gates de CI,
  linters/type-checkers como red de seguridad, feature flags para cambios asistidos.
- **51 — Flujo recomendado (capstone):** el ciclo completo humano diseña → IA implementa →
  CI valida → humano aprueba, aplicado de punta a punta sobre un caso realista.

### Labs (2 nuevos, `app-elearning/content/labs/`)

Siguiendo la convención existente (`lab-NN` donde NN coincide con el módulo asociado):

- **`lab-45-copilot-implementacion-guiada.md`** (level: `N5`): usar GitHub Copilot/Claude
  Code para implementar una funcionalidad real sobre el escenario SIT (Servicios
  Integrados Tecnológicos S.A.) ya usado por los demás labs — p. ej. extender un flujo de
  Power Automate o un componente PCF existente, con checklist de validación humana.
- **`lab-51-flujo-completo-humano-ia-ci.md`** (level: `N5`): laboratorio capstone —
  ejecutar el flujo completo (prompt → diff → PR → CI → aprobación humana) sobre un caso
  de negocio, análogo al Módulo 41 "Proyecto Capstone" del nivel Arquitecto.

`validateLabFrontmatter` en `content.ts` se extiende para aceptar `"N5"` como valor válido
de `level` (hoy solo acepta `N1`-`N4`).

### Banco de preguntas (`docs/javascripts/evaluaciones-simulador.js`)

8 preguntas nuevas por módulo (consistente con el patrón de Niveles 2-4), claves 42-51 en
`MODULE_QUESTIONS` → 80 preguntas nuevas (total 314 → 394). Mismo formato
`{ type, prompt, options, answer, explanation }` ya usado.

### Checklist (`docs/Recursos/CHECKLIST_PROGRESO.md`)

Nueva sección `## 🟣 NIVEL 5: IA` con una subsección `### Módulo NN: <título>` por cada
módulo 42-51, ~4 criterios cada uno (categorías `Conocimiento`/`Práctica`/`Entrega`,
mismo formato `- [ ] **Categoría**: texto | Dominio: ___/5 | Fecha: ___`). Total estimado:
~40 criterios nuevos (467 → ~507).

## Cambios de código

### `src/lib/i18n.ts`

- `LevelId` gana `"ia"`.
- `LEVEL_ORDER` pasa a `[..., "arquitecto", "ia"]`.
- `LEVEL_MODULE_RANGE.ia = [42, 51]`.
- `UI.levels.{basico,...}` gana entrada `ia`: `badge: "🟣 IA"`, `cert: "Buenas Prácticas"`,
  `description: "Copilot, GitHub Copilot, Claude Code y Codex aplicados de forma segura y
  auditable al desarrollo en Power Platform y D365"`, `modules: 10`.

### `src/components/ui/badge.tsx`

- Nueva variante `ia` en `badgeVariants` (color distintivo, p. ej. púrpura
  `bg-purple-600 text-white`, para diferenciar visualmente del track PL-xxx).

### `src/components/modules/level-progress-banner.tsx`

- `LEVEL_COLORS` y `TROPHY_COLORS` ganan entrada `ia`.
- **Cambio de comportamiento:** `LevelCompleteBanner` calcula hoy
  `isFinal = nextLevelId === null`. Se cambia la lógica para que, al completar
  `arquitecto`, se siga mostrando el mensaje final "¡Plan de Estudio Completado!" (no
  "Comenzar Nivel IA"), y al completar `ia` se muestre un mensaje propio y distinto (sin
  mención a examen PL-xxx, sin botón de "siguiente nivel"). Concretamente: el mensaje
  "final" pasa a depender de `levelId === "arquitecto" || levelId === "ia"` en lugar de
  solo `nextLevelId === null`, con textos diferenciados por `levelId`.

### `src/components/layout/sidebar.tsx`

- `LEVEL_CONFIG` gana entrada `ia` (dot color, label color, badgeVariant, progressColor).

### `src/app/page.tsx` (home)

- `LEVEL_CONFIG` gana entrada `ia`.
- Copy del hero se ajusta ligeramente para mencionar la capa transversal (sin cambiar
  layout): de "41 módulos, 9 laboratorios..." a "51 módulos, 11 laboratorios... más una
  capa transversal de Desarrollo Asistido por IA."

### `src/app/labs/page.tsx`

- `LEVEL_CONFIG` (de labs) gana entrada `N5`, `CERT_VARIANT` gana entrada para el nuevo
  badge, `levelOrder` incluye `"N5"` al final.

### `src/lib/content.ts`

- `validateLabFrontmatter`: el arreglo de niveles válidos pasa de
  `["N1", "N2", "N3", "N4"]` a `["N1", "N2", "N3", "N4", "N5"]`.
- Sin más cambios: `getAllLevels`, `getAllModules`, `getAllLabs`, `validateAllModules`, etc.
  ya son genéricos sobre `LEVEL_MODULE_RANGE`/`LEVEL_ORDER` y no requieren tocarse.

### `src/lib/checklist.ts`

- `LEVEL_BY_NUMBER` gana `5: "ia"`.

### `scripts/validate-content.ts`

- Sin cambios: ya deriva la cobertura esperada de `LEVEL_MODULE_RANGE`, por lo que
  validará automáticamente los módulos 42-51 y sus preguntas.

## Documentación a actualizar

- `CLAUDE.md`, `README.md`, `AGENTS.md`: cifras (51 módulos, 11 labs, 394 preguntas),
  estructura de directorios (`content/modules/ia/`), y una nota explícita de que "IA" es
  un nivel transversal/no bloqueante, no parte de la progresión PL-900→PL-600.

## Testing

- Suite existente: `npm run lint`, `npx tsc --noEmit`, `npm run validate:content`,
  `npm run test:coverage`, `npm run build:pages` deben seguir pasando sin modificarse.
- Nuevo smoke test E2E (`e2e/smoke.spec.ts` o archivo nuevo): nivel IA carga desde el
  sidebar, un módulo individual del nivel IA carga contenido, y el certificado de IA se
  genera tras completar los 10 módulos (mismo patrón que los tests existentes de
  progreso/certificado).
- Tests unitarios existentes (`checklist.test.ts`, `content-validation.test.ts`,
  `questions-parser-validation.test.ts`) no deberían requerir cambios ya que operan sobre
  fixtures propias, no sobre el contenido real — se verifica que sigan pasando.

## Fuera de alcance

- No se modifica la progresión ni el gating de los 4 niveles existentes.
- No se toca `docs/Niveles/*.md` (MkDocs legacy) más allá de si el usuario decide en el
  futuro espejar el contenido allí — no es necesario para que la app funcione.
- No se investiga ni implementa la "fase de actualización Microsoft 2026 / rutas por rol"
  mencionada al inicio de la conversación; queda fuera de este spec.

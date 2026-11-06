# Fases 4, 5 y 6 del rediseño "Aprender haciendo" (aprobadas por el usuario el 2026-11-01)

Lee primero, en esta misma carpeta, `BRIEF_COMUN.md` (reglas comunes) y `BRIEF_FASE3.md` (el patrón, los requisitos
de cada módulo migrado y cómo entregar las prácticas interactivas). Todo lo de esos dos archivos aplica aquí igual, con
estas diferencias y añadidos:

## Plantillas
- Fase 4 (Avanzado, código): la plantilla principal es el piloto `app-elearning/content/modules/intermedio/13-javascript-y-pcf-basico.md`
  (código de cliente) y, para la forma de las microlecciones, `11-power-automate-avanzado.md`. Revisa también un módulo de la
  Fase 3 ya migrado, por ejemplo `intermedio/14-*.md` o `intermedio/16-*.md`.
- Fase 5 (Arquitecto, decisión) y Fase 6 (IA): el "construir sin pasos" se convierte en **decidir y defender**: ante un caso con
  restricciones, el alumno elige una opción, justifica el trade-off y lo contrasta con criterios explícitos (una rúbrica
  "Criterio | Qué demuestra que lo cumples"). No hay una sola respuesta correcta: la evidencia es la decisión escrita con
  sus razones, no un sí/no. Las prácticas `multiple-decision` sirven bien (cada opción con su consecuencia). Usa Mermaid solo
  donde aclare de verdad.

## Código (Fase 4 sobre todo)
- Todo fragmento de código que **añadas o cambies** debe ser real y correcto: C# contra la API del SDK de Dataverse
  (`Microsoft.Xrm.Sdk`: `IPlugin`, `IPluginExecutionContext`, `IOrganizationService`, `ITracingService`...), TypeScript/PCF
  contra `ComponentFramework`, YAML de pipelines contra la documentación de Power Platform Build Tools / GitHub Actions, Liquid
  contra Power Pages. Verifica nombres de clases, métodos y parámetros en Microsoft Learn (la referencia de API también está en
  learn.microsoft.com). No hay SDK de .NET instalado en esta máquina: no intentes compilar C#; verifica contra Learn.
  TypeScript sencillo sí puedes comprobarlo con `npx tsc --noEmit` sobre un archivo en tu carpeta de scratch, si te sirve.
- Si un fragmento existente está mal (API inexistente, firma equivocada), corrígelo y repórtalo como error de contenido.
- Nada de pseudocódigo presentado como API real. Si un trozo es un esquema, márcalo como esquema.

## Prácticas interactivas
- **No edites** `app-elearning/src/lib/interactive-practices.ts`. Escribe tus prácticas en el archivo de scratch que te indica
  tu tarea como `export const NEW_PRACTICES = [ ... ];` (mismo formato exacto que las del banco; mira IP-CS-001/002 o
  IP-TRB-010 a 012 como ejemplos recientes).
- 2 o 3 por módulo: al menos una `debug-scenario` (diagnóstico síntoma primero) y una de transferencia o decisión. Usa solo los
  IDs que te asigna tu tarea, en orden; si no los usas todos, dilo.
- Dominios: los existentes son `dataverse`, `power-apps`, `power-automate`, `fetchxml`, `odata`, `troubleshooting`,
  `javascript`, `copilot-studio`. El coordinador añadirá estos dominios nuevos (úsalos tal cual, aunque el validador aún no
  los conozca): `alm` (prefijo ALM), `plugins` (PLG, C# y extensibilidad de servidor), `power-pages` (PP), `integracion`
  (INT, Azure y APIs), `arquitectura` (ARQ, decisiones de arquitectura y gobernanza), `dynamics-365` (D365), `ia` (IA,
  desarrollo asistido por IA y Copilot). El prefijo del ID debe corresponder al dominio.
- `relatedLabIds` con el formato `"LAB-023"` (usa los labs existentes que de verdad correspondan; mira `content/labs/`).
- `prerequisites` tipo `"Módulo 23"`. Las guías de cada microlección enlazan a `/practica/<slug>`.

## Progresión y alcance
- Respeta la progresión: en Avanzado puedes asumir Básico + Intermedio; en Arquitecto, todo lo anterior. Los módulos de IA
  (Fase 6) son transversales: no deben exigir módulos de los 4 niveles como prerrequisito duro.
- No toques labs salvo que tu tarea lo diga; si un lab contradice el contenido nuevo, repórtalo (texto viejo/nuevo).
- Caso Real de Negocio: **textualmente idéntico** (las preguntas de caso dependen de él).
- Revisa las preguntas normales de `MODULE_QUESTIONS[N]` (`docs/javascripts/evaluaciones-simulador.js`) de tus módulos y
  reporta las que estén mal o choquen con el contenido nuevo, con texto viejo/nuevo exacto. No edites ese archivo.
- Tiempo de lectura (`estimatedMinutes`) y `practiceMinutes` realistas; `lastVerified: "2026-11"`.

## Antes de entregar
Desde `app-elearning/`: `npx tsx scripts/validate-content.ts` y `npm run audit:lbd` (tus módulos deben salir como **piloto**).
Informe: el común + tabla de prácticas (ID, slug, tipo, módulo, rol) + criterios de validación antes/después por módulo.

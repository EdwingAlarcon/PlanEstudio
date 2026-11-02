# Reglas comunes para todos los agentes (sesión 2026-11-01)

Repo: `C:\Users\EdwingAlarcon\Documents\Repos\PlanEstudio`. App Next.js en `app-elearning/`.
Contenido de la app: `app-elearning/content/modules/<nivel>/NN-slug.md` y `app-elearning/content/labs/*.md`.
Lee `CLAUDE.md` del repo (invariantes) y, si tocas contenido del Nivel Básico o labs, `SPRINT_HANDOFF.md` (sección de arriba)
y `PROPUESTA_FASES_APRENDER_HACIENDO.md` §7-§8: ahí está qué se corrigió y cómo.

Varios agentes trabajan **en paralelo** en el mismo árbol. Solo edita los archivos que tu tarea te asigna. Si crees que
otro archivo necesita un cambio, NO lo edites: descríbelo en tu informe final (archivo, texto viejo exacto, texto nuevo).

## Estilo y contenido
- Todo en **español**; nombres de producto en inglés (Power Fx, Dataverse, Canvas, Model-Driven, DAX...).
- Desde el 2026-11-01 el ambiente del curso se crea en **English (United States)**: las **etiquetas de interfaz** (botones,
  menús, pestañas, opciones) se escriben **en inglés, en negrita**, tal como aparecen en la UI, con una traducción breve
  entre paréntesis la primera vez si ayuda. Ejemplo: **New column** (nueva columna).
- Prefijo de publisher del curso: `sit_` (nunca `new_` ni `cr123_` en contenido nuevo). Controles Power Fx: `btnGuardar`,
  `galSolicitudes`, `txtBusqueda`.
- Bloques de código: Power Fx → ```js, DAX → ```dax, M → ```m, C# → ```csharp. Nada de pseudocódigo presentado como API real.
- Escribe para un alumno que sigue los pasos de verdad: rutas exactas de menú, qué debería ver al terminar cada paso, y qué
  hacer si no lo ve. Tiempos realistas.
- Las preguntas de caso (`appliesTo: "caso"`) del banco `docs/javascripts/evaluaciones-simulador.js` dependen del texto
  del **Caso Real de Negocio** de cada módulo: salvo que tu tarea diga lo contrario, deja esa sección **textualmente idéntica**.
- Revisa también las preguntas normales del módulo en `MODULE_QUESTIONS[N]` de ese archivo: el contenido nuevo no debe
  contradecirlas. Solo el agente del Nivel Básico edita ese archivo; los demás reportan los cambios necesarios.

## Verificación contra Microsoft Learn (obligatoria)
- Toda etiqueta de interfaz, ruta de menú, límite, nombre de función o afirmación técnica que **añadas o cambies** debe
  estar verificada en Microsoft Learn (learn.microsoft.com, en inglés) con WebFetch. Guarda URL y fecha `ms.date` de cada
  página usada para el informe.
- Si algo no se puede verificar en Learn, redáctalo de forma neutral y que no dependa del nombre exacto (describe la zona
  y la función del botón) y lístalo en el informe como "no verificado".
- Si encuentras un **error de contenido** (algo que Learn contradice), corrígelo y repórtalo.

## Dato ya verificado (no lo vuelvas a investigar)
Nombre interno (schema/logical name) de la **columna principal** de una tabla: Learn (create-edit-entities-portal,
ms.date 2026-08-31) solo documenta que en la pestaña **Primary column** se pueden cambiar **Display name** y **Description**,
y que no se pueden cambiar después de guardar. **No documenta** cómo fijar ni cuál es el schema name por defecto de la
columna principal. Por eso el curso no debe dar por hecho `sit_titulo`, `sit_nombre` ni `sit_titulodesolicitud`: LAB-02 pide
al alumno anotar el nombre real. Donde un paso necesite ese nombre interno, remite al nombre anotado en LAB-02
(con un ejemplo marcado como ejemplo) y, mejor aún, usa el **nombre visible** donde la herramienta lo permita (Power Fx y los
diseñadores usan nombres visibles).

## Qué NO hacer
- No toques `docs/Niveles/` ni nada de MkDocs (congelado).
- No ejecutes `npm run build`, `build:pages`, `e2e` ni `verify` (los corre el coordinador en serie). Sí puedes correr
  `npx vitest run <archivo de test>`, `npm run lint`, `npx tsc --noEmit` y `npx tsx scripts/validate-content.ts` desde `app-elearning/`.
- No hagas commit ni push.

## Informe final (obligatorio, conciso)
1. Archivos modificados/creados.
2. Cambios principales (viñetas).
3. Errores de contenido encontrados y corregidos, con la URL de Learn que lo respalda.
4. Lo no verificado en Learn.
5. Cambios que otro archivo necesita y no hiciste (con texto viejo/nuevo exacto).

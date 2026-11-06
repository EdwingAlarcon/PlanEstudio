# Fase 3 del rediseño "Aprender haciendo" — Intermedio restante (Módulos 9, 12, 14, 15, 16, 17)

Lee primero `BRIEF_COMUN.md` (misma carpeta). El usuario aprobó la Fase 3 el 2026-11-01.

## Qué es el patrón
Lee como plantilla los pilotos del mismo nivel: `app-elearning/content/modules/intermedio/11-power-automate-avanzado.md`,
`10-canvas-apps-componentes-y-reutilizacion.md` y `13-javascript-y-pcf-basico.md`; y un módulo del Básico ya migrado y
corregido con más detalle clic a clic: `app-elearning/content/modules/basico/07-fundamentos-de-power-fx-y-expresiones.md`.
Patrón: concepto breve → micropráctica con feedback inmediato (práctica interactiva) → práctica real en el tenant con
**evidencia estructurada** (tabla "Campo | Tu valor" con el dato exacto observado, no un sí/no) → construir sin pasos →
**diagnosticar síntoma primero** (práctica `debug-scenario`) → **reto de transferencia** con un requisito distinto.

## Requisitos de cada módulo migrado
- Encabezados detectables por `npm run audit:lbd` (`src/lib/learning-by-doing-audit.ts`): al menos un `## 🧩 Microlección N — ...`
  y un `## 🔁 Reto de transferencia ...`. El módulo debe salir como **piloto** en la auditoría.
- Conserva: `### 🎯 Objetivo`, `### 💼 Caso Real de Negocio` (**textualmente idéntico**: las preguntas de caso dependen de
  su texto), `### ✅ Buenas Prácticas`, `### ⚠️ Errores Comunes`, `### 🧪 Criterios de Validación`. Los Conceptos Clave y las
  Actividades pueden reorganizarse en microlecciones (como en los pilotos) sin perder contenido útil. Revisa que
  `npx tsx scripts/validate-content.ts` siga pasando.
- Frontmatter: actualiza `estimatedMinutes` (lectura) si cambia, agrega `practiceMinutes` realista (como M1-M8) y
  `lastVerified: "2026-11"`. No cambies `moduleId`, `slug`, `level` ni `title`.
- Las prácticas del tenant: pasos clic a clic con etiquetas en inglés verificadas en Learn (ver BRIEF_COMUN). Respeta la
  progresión: nada de temas del Nivel Avanzado sin marcarlos como opcionales.
- Corrige errores de contenido que Learn contradiga (en Fase 2 aparecieron varios). Revisa las preguntas normales de
  `MODULE_QUESTIONS[N]` en `docs/javascripts/evaluaciones-simulador.js` y reporta (no edites) las que estén mal o choquen
  con el contenido nuevo, con texto viejo/nuevo exacto.

## Prácticas interactivas nuevas
- Motor: `app-elearning/src/lib/interactive-practices.ts` (tipos, evaluadores y el banco). **NO edites ese archivo**:
  otro agente lo está tocando. Escribe tus prácticas nuevas como objetos TypeScript válidos (mismo formato exacto que las
  del banco, p. ej. IP-DV-008…IP-DV-010 e IP-TRB-005) en el archivo de scratch que te indique tu tarea, como un array
  `export const NEW_PRACTICES = [ ... ];` listo para pegar. El coordinador los integra y sube el tope.
- Antes de usar `flow-builder` o `query-playground`, lee cómo los evalúa el motor (busca las funciones de evaluación en ese
  archivo): `flow-builder` está pensado para umbrales por monto y `query-playground` consulta los datos de práctica de
  `src/data/practice/`. Lo más seguro: `multiple-decision` y `debug-scenario`.
- Dominios existentes: dataverse, power-apps, power-automate, fetchxml, odata, troubleshooting, javascript. Las prácticas de
  Power BI del Módulo 6 usan `dataverse` (precedente). Si ninguno sirve, dilo y propón uno nuevo (el coordinador lo añade).
- Cada práctica: 3 pistas escalonadas (h1 orientación, h2 regla, h3 casi la respuesta), consecuencias con explicación,
  `relatedModuleIds`, `relatedLabIds` (formato `"LAB-009"`; vacío si no hay lab), `prerequisites` tipo `"Módulo 9"`, tags.
  Slug: `ip-xx-nnn-descripcion-corta` con el id en minúsculas. Por módulo: al menos una de diagnóstico (`debug-scenario`) y
  una de transferencia; las guías de cada microlección enlazan a `/practica/<slug>`.
- Usa **solo** los IDs que te asigna tu tarea; si no los usas todos, dilo. Las prácticas que ya existen para tu módulo
  (`grep relatedModuleIds` en el banco) pueden enlazarse desde las microlecciones; no las dupliques.

## Informe
Además del informe común: tabla de prácticas nuevas (ID, slug, tipo, módulo, rol: guiada/diagnóstico/transferencia) y
cuántos criterios de validación tiene cada módulo antes/después.

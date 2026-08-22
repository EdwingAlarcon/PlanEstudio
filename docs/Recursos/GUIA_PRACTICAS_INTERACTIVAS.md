# Guía de prácticas interactivas

Esta guía define cómo ampliar el piloto de `Práctica interactiva` sin mezclarlo con módulos, quizzes, laboratorios ni experiencia práctica profesional.

## Principios

- Cada práctica debe ser simulada, local y determinística.
- No se ejecuta código arbitrario, no se llama a red y no se evalúan expresiones del usuario.
- El progreso usa `planestudio.interactive-practice.v1`; no se combina con `plan-estudio-progress` ni con `planestudio.practice-progress.v1`.
- El estado de dominio permitido es: no iniciado, en progreso, completado, dominado o requiere refuerzo. No usar etiquetas como experto o senior.
- Una práctica siempre debe enlazar al menos un módulo y un laboratorio existente.

## Tipos de engine

| Engine | Uso recomendado | Entrada esperada |
|---|---|---|
| Multiple Decision | Decisiones de arquitectura, modelo o operación | Una o varias opciones |
| Flow Builder | Orden lógico de pasos de automatización | Lista ordenada de bloques |
| Query Playground | Consultas declarativas sobre fixtures locales | FetchXML u OData limitado |
| Debug Scenario | Diagnóstico de fallas comunes | Texto breve con la corrección |

## Checklist para agregar una práctica

1. Crear o reutilizar fixtures en `app-elearning/src/data/practice/`.
2. Agregar el objeto en `app-elearning/src/lib/interactive-practices.ts`.
3. Declarar `id`, `slug`, `type`, `domain`, `level`, `relatedModuleIds` y `relatedLabIds`.
4. Incluir objetivo, contexto, criterio de éxito, pistas escalonadas y solución de referencia.
5. Validar que `npm run validate:interactive-practices` pasa.
6. Añadir pruebas unitarias cuando el engine, parser o recomendación cambien.
7. Verificar teclado, foco visible, modo oscuro, móvil y recarga profunda de `/practica/[slug]`.

## Límites de seguridad

El Query Playground solo debe aceptar una gramática pequeña. Rechazar cualquier entrada con patrones como `fetch`, `script`, `eval`, `Function`, `while`, `for`, `http`, `https`, `import` o llamadas externas. Los datos visibles vienen de fixtures versionados, no de APIs reales.

## Criterio pedagógico

Una práctica debe medir razonamiento observable: elección con consecuencias, orden correcto, consulta declarativa o diagnóstico reproducible. Si el ejercicio solo pide recordar una definición, debe quedarse como quiz o contenido de módulo.

## Definition of Good Interactive Practice

Una práctica interactiva buena:

- dura de 3 a 15 minutos;
- exige una acción observable, no solo lectura;
- permite equivocarse, reintentar y recibir feedback;
- usa pistas que orientan sin revelar inmediatamente la respuesta;
- funciona con fixtures locales o simulación determinística;
- prepara el criterio para un lab real, pero no reemplaza el lab;
- no depende de tenant, credenciales ni datos personales;
- no introduce puntuación competitiva, XP, rachas obligatorias ni rankings.

No debe convertirse en práctica interactiva una lectura, flashcard, definición aislada, verdadero/falso trivial, checklist sin decisión o lab largo.

## Flow Builder

Flow Builder conserva botones `Subir` y `Bajar` como método principal accesible. El arrastre visual es opcional y debe tener equivalentes de teclado y botones para:

- mover arriba;
- mover abajo;
- insertar antes;
- insertar después;
- eliminar;
- restaurar bloques cuando falte alguno.

El orden interno debe ser el mismo sin importar si el estudiante usa drag, teclado o botones. En móvil, priorizar botones sobre gestos frágiles.

## Filtros y selección

El catálogo filtra por dominio, engine, dificultad, estado y búsqueda. Los filtros pueden persistir durante la sesión con `sessionStorage`, pero no deben escribirse en stores de progreso. Cuando el ejercicio seleccionado deja de pertenecer al resultado visible, el panel debe cambiar a la primera práctica filtrada. Si no hay resultados, no se debe mantener un detalle obsoleto.

## Export/import

El backup de `/progreso` exporta solo `planestudio.interactive-practice.v1` con JSON versionado:

```json
{
  "schemaVersion": 1,
  "exportedAt": "...",
  "source": "planestudio.interactive-practice",
  "practices": {}
}
```

La importación debe validar tamaño máximo, JSON, `source`, versión, registros conocidos y campos requeridos. La versión futura se rechaza. La versión `0` se trata como migrable si incluye `records` o `practices`.

Estrategias:

- **Fusionar**: conserva el mejor estado de ambos. `proficient` supera `learning`, `learning` supera `needs-review`, y `completed` supera `in-progress`. Preserva `solutionRevealed`, pistas usadas, mejor puntaje y eventos recientes.
- **Reemplazar solo prácticas interactivas**: reemplaza únicamente el store interactivo con IDs conocidos. Nunca debe tocar progreso académico, experiencia práctica profesional ni workstation.

## Matriz de cierre E2E

| ID | Escenario | Cubierto | Test |
|---|---|---|---|
| 1-11 | Catálogo, filtros, dificultad, estado vacío, limpieza y sincronización selección | Sí | `e2e/interactive-practices.spec.ts` |
| 12-20 | Multiple Decision: error, feedback, retry, correcto, mastery, reload y deep link | Sí | `e2e/interactive-practices.spec.ts` |
| 21-28 | Flow Builder: drag, teclado, botones, error, casos, corrección, persistencia y móvil | Sí | `e2e/interactive-practices.spec.ts` |
| 29-36 | Query Playground: FetchXML válido/inseguro, OData válido/inválido, resultados y edge cases | Sí | `e2e/interactive-practices.spec.ts` + unit tests de parsers |
| 37-42 | Debug Scenario: fallo, hint, solución, reveal, needs-review y repaso | Sí | `e2e/interactive-practices.spec.ts` + store tests |
| I1 | Integraciones módulo, lab, Home, Mi ruta, progreso, búsqueda y rutas profundas | Sí | `e2e/interactive-practices.spec.ts` |
| I2 | Export, import, merge, replace y reset aislado | Sí | `e2e/interactive-practices.spec.ts` + `interactive-practice-progress.test.ts` |
| I3 | localStorage corrupto no rompe la ruta interactiva | Sí | `e2e/interactive-practices.spec.ts` |

## Auditoría pedagógica interna

Esta evaluación es simulada, no feedback de usuarios reales.

| Perfil | Claridad | Dificultad | Feedback útil | Sensación práctica | Relación con lab | Riesgo |
|---|---:|---:|---:|---:|---:|---|
| Principiante absoluto | 4 | 3 | 4 | 4 | 4 | Confundir engine con quiz si no lee escenario |
| Maker | 5 | 3 | 4 | 5 | 5 | Querer tenant real antes del lab |
| Functional Consultant | 4 | 4 | 5 | 4 | 5 | Esperar más variaciones de negocio |
| Developer junior | 4 | 4 | 4 | 4 | 4 | Query Playground aún es limitado a fixtures |

## Seguridad y accesibilidad

- No usar `eval`, `new Function`, llamadas de red ni ejecución de scripts.
- Mantener límites de tamaño para consultas e import JSON.
- Usar labels, foco visible, `aria-live` para movimientos y feedback.
- El drag nunca debe ser el único camino.
- Verificar modo oscuro, 320 px, 375 px, tablet y desktop antes de cerrar cambios de UI.

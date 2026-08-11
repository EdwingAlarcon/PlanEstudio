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

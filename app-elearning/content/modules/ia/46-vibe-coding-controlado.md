---
moduleId: 46
title: "Vibe Coding Controlado"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 7
slug: "vibe-coding-controlado"
---
### 🎯 Objetivo
Distinguir cuándo generar código sin especificación exhaustiva ("vibe coding") es aceptable en un contexto empresarial, y qué controles mínimos lo convierten en una práctica segura en lugar de un riesgo.

### 📖 Conceptos Clave
- **Vibe coding:** dejar que un modelo genere una implementación completa a partir de una descripción de alto nivel, iterando sobre el resultado en lugar de especificar cada detalle por adelantado.
- **Cuándo es aceptable:** prototipos descartables, scripts de un solo uso, exploración de una idea antes de comprometerse a una arquitectura, componentes de UI sin lógica de negocio sensible.
- **Cuándo NO es aceptable sin controles:** código que toca datos de producción, seguridad, lógica de negocio con impacto financiero/legal, o cualquier cosa que se vaya a desplegar sin pasar por code review humano.
- **Controles mínimos que lo hacen seguro:** alcance acotado (un archivo o módulo, no todo el sistema), tests que validen el comportamiento esperado (no solo que "compile"), y revisión humana obligatoria antes de fusionar a la rama principal — los mismos controles que ya exige este plan de estudio para cualquier cambio (Solution Checker, CI, code review).
- **Diferencia con desarrollo asistido "normal":** vibe coding no elimina la necesidad de estos controles — los vuelve más críticos, porque el humano invirtió menos tiempo revisando cada línea mientras se escribía.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Identifica una tarea de bajo riesgo (ej. un script para reformatear un CSV de prueba) y pide a un agente que la resuelva completa con una sola instrucción de alto nivel, sin revisar cada paso intermedio.
2. Identifica una tarea de alto riesgo (ej. una validación de seguridad en un plugin C# que se ejecuta en producción) y contrasta: ¿qué controles adicionales necesitarías antes de aceptar el resultado sin revisión detallada?
3. Escribe una regla de equipo de una sola frase que decida cuándo vibe coding está permitido en tu proyecto (ej. "solo en prototipos y scripts fuera de la rama principal").
4. Para el resultado del paso 1, agrega al menos un test que valide el comportamiento antes de considerarlo terminado.

### 💼 Casos Reales de Negocio
Un maker de SIT usó vibe coding para generar un flujo completo de aprobación de gastos en una sola sesión, sin revisar el detalle de cada acción, y lo publicó directamente a producción porque "funcionó en la prueba". Una condición de carrera entre dos aprobadores duplicó pagos durante una semana antes de detectarse. El equipo adoptó la regla: cualquier flujo generado sin revisión detallada pasa primero por un ambiente de pruebas con datos reales simulados y una revisión de un segundo maker antes de publicarse.

### ✅ Buenas Prácticas
- Reservar vibe coding para tareas de bajo riesgo y alcance acotado; nunca para cambios que toquen datos de producción o lógica financiera/legal sin revisión.
- Exigir al menos un test o validación funcional antes de dar por terminada cualquier tarea resuelta con vibe coding.
- Documentar como regla de equipo (no como decisión ad-hoc) cuándo está permitido y cuándo no.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Publicar a producción un resultado de vibe coding sin revisión | Confiar en que "funcionó en la prueba" es suficiente | Exigir ambiente de pruebas + revisión humana antes de publicar, igual que cualquier otro cambio |
| Usar vibe coding en lógica de negocio sensible (pagos, seguridad) | No distinguir el nivel de riesgo de la tarea | Reservar vibe coding para prototipos y tareas de bajo riesgo explícitamente definidas |
| No tener una regla de equipo explícita sobre cuándo se permite | Decisión informal caso por caso | Documentar la regla una vez y aplicarla consistentemente |

### 🧪 Criterios de Validación
- [ ] Distingo con un ejemplo propio una tarea apta para vibe coding de una que no lo es
- [ ] Escribo una regla de equipo de una frase sobre cuándo se permite vibe coding
- [ ] Agrego al menos un test de validación a un resultado generado con vibe coding

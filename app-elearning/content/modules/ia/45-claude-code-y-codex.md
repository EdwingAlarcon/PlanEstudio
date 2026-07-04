---
moduleId: 45
title: "Claude Code y Codex para Análisis e Implementación"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 9
slug: "claude-code-y-codex"
---
### 🎯 Objetivo
Usar agentes de código (Claude Code, Codex) para analizar repositorios grandes y ejecutar cambios acotados con herramientas (lectura, edición, bash), entendiendo qué los diferencia de un simple chat y cuándo delegarles una tarea real.

### 📖 Conceptos Clave
- **Agente vs chat:** un agente de código puede usar herramientas — leer archivos, buscar en el repo, ejecutar comandos (tests, lint, build), y editar archivos directamente — encadenando varios pasos sin que el humano copie/pegue manualmente cada resultado.
- **Análisis de repos grandes:** en un monorepo como este (`app-elearning/` + `docs/`), un agente puede explorar la estructura, encontrar todos los lugares donde una convención se repite (ej. cada `Record<LevelId, ...>`) antes de proponer un cambio — algo que un chat sin herramientas no puede hacer por sí mismo.
- **Alcance de la tarea (scope):** un agente rinde mejor con una tarea acotada y verificable ("agregar un campo a este formulario y correr los tests") que con una tarea vaga ("mejora el proyecto").
- **Diferencias de enfoque:** Claude Code tiende a un modelo de herramientas explícito con confirmación de pasos; Codex (integrado en OpenAI/GitHub Copilot Agent Mode) sigue un patrón similar de plan→ejecución→verificación. Ambos requieren que el humano defina el alcance y revise el resultado final.
- **Verificación como parte del ciclo:** un agente que corre los tests o el linter después de un cambio y reporta el resultado da más confianza que uno que solo entrega código sin ejecutar nada.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Pide a un agente de código "busca todos los archivos donde se recorre `LEVEL_ORDER` o se define un `Record<LevelId, ...>` en este repo" y compara el resultado contra una búsqueda manual con el buscador del editor.
2. Dale una tarea acotada: "agrega un console.log temporal a la función `calculateLevelProgress` en `progress.ts` y quítalo después de confirmar que se ejecuta" — observa si el agente verifica su propio trabajo (revierte el cambio) al terminar.
3. Pide una tarea vaga ("mejora el rendimiento de la app") y compara la calidad de la respuesta contra una tarea acotada del mismo tamaño — documenta la diferencia.
4. Pide al agente que ejecute `npm run lint` después de un cambio suyo y que te muestre el resultado, no solo el código.

### 💼 Casos Reales de Negocio
Un arquitecto de SIT le pidió a un agente de código "optimiza el proyecto" sin más contexto. El agente hizo cambios extensos en archivos no relacionados con el problema real (un formulario lento), incluyendo un refactor de componentes que nadie pidió, generando un PR de 40 archivos imposible de revisar en una sola sesión. La lección adoptada por el equipo: toda tarea delegada a un agente debe tener un alcance explícito y un criterio de éxito verificable (ej. "reduce el tiempo de carga de este formulario específico; no toques otros archivos").

### ✅ Buenas Prácticas
- Delegar tareas acotadas y verificables, nunca instrucciones vagas tipo "mejora esto".
- Pedir siempre que el agente ejecute la verificación disponible (tests, lint, build) como parte de la tarea, no como un paso aparte olvidado.
- Revisar el plan que el agente propone antes de dejarlo ejecutar cambios extensos, sobre todo en un monorepo con múltiples superficies (app + docs).

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Delegar una tarea vaga y obtener un cambio enorme e inmanejable | Falta de alcance explícito en la instrucción | Definir siempre el archivo/función objetivo y el criterio de éxito antes de delegar |
| No pedir verificación automática (tests/lint) tras el cambio | Asumir que el código generado es correcto sin ejecutarlo | Incluir la ejecución de tests/lint como parte explícita de la tarea |
| Confundir "agente" con "chat que da buenas respuestas" | No distinguir la capacidad de usar herramientas del agente | Verificar si la herramienta puede ejecutar comandos/leer archivos antes de asumir ese nivel de autonomía |

### 🧪 Criterios de Validación
- [ ] Uso un agente para localizar todas las ocurrencias de un patrón en el repo y confirmo el resultado manualmente
- [ ] Delego una tarea acotada con criterio de éxito verificable y reviso que el agente la haya cumplido
- [ ] Comparo el resultado de una tarea vaga vs. una acotada y documento la diferencia de calidad

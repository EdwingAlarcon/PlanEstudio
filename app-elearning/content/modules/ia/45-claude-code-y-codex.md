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
1. Prompt de análisis de repositorio:
   ```
   Busca todos los archivos donde se recorre LEVEL_ORDER o se define un Record<LevelId, ...> en este
   repositorio. Lista archivo y número de línea, sin modificar nada.
   ```
   Compara el resultado contra una búsqueda manual con el buscador del editor.
2. **Prompt débil (tarea vaga):** `Mejora el rendimiento de la app.`
   *Problema:* sin alcance ni criterio de éxito, el agente puede tocar decenas de archivos no relacionados con el problema real.
3. **Prompt mejorado (tarea acotada y verificable):**
   ```
   En src/lib/progress.ts, agrega un console.log temporal dentro de calculateLevelProgress que muestre
   el resultado antes de retornarlo. Ejecuta npm run test para confirmar que el cambio no rompe nada,
   luego revierte el console.log. No toques ningún otro archivo.
   ```
   *Resultado esperado:* el agente reporta el resultado del console.log observado, confirma que los tests pasan, y revierte el cambio dejando el archivo igual que al inicio. **Evalúa:** ¿el agente verificó su propio trabajo (ejecutó el test) o solo entregó código sin correrlo? ¿revirtió el cambio temporal como se pidió?
4. Documenta la diferencia de calidad entre el resultado del paso 2 (si lo intentas) y el del paso 3 — el tamaño del cambio y la capacidad de revisarlo en una sola sesión.
5. Pide al agente que ejecute `npm run lint` después de cualquier cambio suyo y que te muestre el resultado real del comando, no solo una afirmación de que "debería pasar".

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
- [ ] Uso el prompt de búsqueda para localizar todas las ocurrencias de un patrón en el repo y confirmo el resultado manualmente
- [ ] Delego la tarea acotada del paso 3 con criterio de éxito verificable y confirmo que el agente ejecutó y revirtió el cambio
- [ ] Comparo un prompt vago vs. uno acotado para la misma intención y documento la diferencia de calidad y tamaño del cambio
- [ ] Confirmo que un agente ejecutó `npm run lint` (o el gate correspondiente) y me mostró el resultado real, no una suposición
- [ ] Relaciono este módulo con cualquier lab donde delegue a un agente una tarea de análisis o cambio acotado antes de entregarlo como evidencia

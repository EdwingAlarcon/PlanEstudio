---
moduleId: 47
title: "Prompts Técnicos Reutilizables"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 7
slug: "prompts-tecnicos-reutilizables"
---
### 🎯 Objetivo
Construir plantillas de prompt reutilizables para tareas técnicas recurrentes en Power Platform y Dynamics 365, y establecer un lugar y formato consistente para versionarlas dentro del repositorio.

### 📖 Conceptos Clave
- **Plantilla de prompt:** una instrucción parametrizable que fija el contexto, el formato de salida y las restricciones esperadas, dejando solo los datos específicos de la tarea como variables (ej. nombre de la entidad, campos, validaciones).
- **Componentes de una buena plantilla:** rol/contexto (qué proyecto, qué convenciones), tarea concreta, restricciones (qué no hacer, qué patrón seguir), y formato de salida esperado (código, diff, lista de pasos).
- **Versionado de prompts:** igual que el código, una plantilla de prompt cambia con el tiempo (se ajusta cuando deja de dar buenos resultados); guardarla en el repo (ej. `docs/prompts/` o similar) permite historial de cambios con git, en lugar de perderla en un chat.
- **Reutilización vs. personalización:** una plantilla útil cubre el 80% del caso común y dejar el 20% restante para ajuste manual — plantillas demasiado rígidas fallan en casos particulares; demasiado abiertas no ahorran tiempo real.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Identifica una tarea que repites seguido (ej. "crear una nueva columna calculada en Dataverse" o "generar un flujo de aprobación estándar") y escribe la instrucción completa que usarías hoy, sin plantilla.
2. Reescríbela como plantilla parametrizable, marcando con `{{variable}}` las partes que cambian entre usos (nombre de tabla, campos, condición).
3. Prueba la plantilla dos veces con datos distintos y compara la consistencia del resultado contra la versión sin plantilla del paso 1.
4. Guarda la plantilla final en un archivo Markdown versionado del repositorio con un encabezado que indique para qué sirve y cuándo se actualizó por última vez.

### 💼 Casos Reales de Negocio
En SIT, cada desarrollador pedía "genera un flujo de aprobación" con una instrucción distinta cada vez, produciendo flujos con estructuras y nomenclatura inconsistentes entre proyectos, difíciles de mantener en equipo. Al introducir una plantilla común (con la convención de nombres `sit_`, el patrón de dos aprobadores y el manejo de rechazo ya especificados), el tiempo de creación de un flujo nuevo bajó y la consistencia entre flujos de distintos desarrolladores mejoró notablemente, facilitando el mantenimiento posterior.

### ✅ Buenas Prácticas
- Guardar las plantillas de prompt en el repositorio, versionadas con git, no solo en el historial de un chat.
- Incluir siempre restricciones explícitas (qué NO hacer, qué convención seguir) en la plantilla, no solo la tarea positiva.
- Revisar y actualizar las plantillas cuando dejen de producir buenos resultados, igual que se refactoriza código.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Repetir instrucciones distintas cada vez para la misma tarea recurrente | No haberlas convertido nunca en plantilla | Extraer una plantilla la primera vez que se detecta la repetición |
| Perder plantillas útiles en el historial de un chat | No versionarlas en el repositorio | Guardarlas como archivos Markdown en el repo, con control de versiones |
| Plantillas tan rígidas que fallan en casos particulares | Sobre-especificar cada detalle sin dejar espacio de ajuste | Cubrir el caso común como plantilla y dejar el resto para ajuste manual explícito |

### 🧪 Criterios de Validación
- [ ] Construyo una plantilla parametrizable a partir de una tarea que repito seguido
- [ ] Pruebo la plantilla con dos casos distintos y confirmo consistencia de resultado
- [ ] Guardo la plantilla como archivo versionado en el repositorio

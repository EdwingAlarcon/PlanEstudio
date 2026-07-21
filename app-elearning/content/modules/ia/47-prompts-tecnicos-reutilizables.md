---
moduleId: 47
title: "Prompts Técnicos Reutilizables"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 7
slug: "prompts-tecnicos-reutilizables"
---
### 🎯 Objetivo
Disponer de una biblioteca de plantillas de prompt completas, copiables y versionadas para las tareas técnicas y funcionales más recurrentes en Power Platform, Dynamics 365 y empleabilidad — y saber adaptarlas a un caso propio en vez de partir de cero cada vez.

### 📖 Conceptos Clave
- **Plantilla de prompt:** una instrucción parametrizable que fija el contexto, el formato de salida y las restricciones esperadas, dejando solo los datos específicos de la tarea como variables (ej. nombre de la entidad, campos, validaciones).
- **Componentes de una buena plantilla:** rol/contexto (qué proyecto, qué convenciones), tarea concreta, restricciones (qué no hacer, qué patrón seguir), y formato de salida esperado (código, diff, lista de pasos, tabla, JSON).
- **Versionado de prompts:** igual que el código, una plantilla de prompt cambia con el tiempo (se ajusta cuando deja de dar buenos resultados); guardarla en el repo (ej. `docs/prompts/` o similar) permite historial de cambios con git, en lugar de perderla en un chat.
- **Reutilización vs. personalización:** una plantilla útil cubre el 80% del caso común y deja el 20% restante para ajuste manual — plantillas demasiado rígidas fallan en casos particulares; demasiado abiertas no ahorran tiempo real.
- **Nunca aceptar la salida sin criterio humano:** cada plantilla de esta biblioteca viene con su propio criterio de evaluación — la plantilla acelera la generación, no reemplaza la revisión.

### 👨‍💻 Actividades Prácticas Paso a Paso

A continuación, una biblioteca de 8 plantillas completas y copiables, una por categoría. Para cada una: úsala tal cual con datos propios, luego evalúa el resultado con el criterio indicado antes de aceptarlo.

**1. Análisis funcional — AS-IS/TO-BE y Fit-Gap**
```
Rol: eres consultor funcional Dynamics 365 con experiencia en Fit-Gap.
Contexto: {{nombre del cliente/proyecto}}. Proceso actual (AS-IS): {{descripción en 3-5 líneas}}.
Tarea: propone el proceso TO-BE usando capacidades estándar de {{Dynamics 365 Sales / Customer Service / Dataverse}}
antes de sugerir personalización. Para cada paso del TO-BE indica: si es estándar o requiere
configuración/personalización, y por qué.
Restricciones: no propongas una tabla personalizada si existe una entidad estándar equivalente.
Formato de salida: tabla con columnas Paso | AS-IS | TO-BE | Estándar/Gap | Justificación.
```
*Resultado esperado:* una tabla Fit-Gap de 5-10 filas. **Evalúa:** ¿evitó proponer personalización donde había alternativa estándar? ¿la justificación de cada gap es específica al proceso, no genérica?

**2. Power Platform — diseño de modelo de datos Dataverse**
```
Rol: eres arquitecto de datos Dataverse.
Contexto: necesito modelar {{proceso de negocio, ej. "solicitudes de mantenimiento de activos"}}.
Tarea: propone las tablas necesarias con sus columnas clave, tipos de dato, relaciones (1:N, N:N) y
choices. Usa el prefijo de publisher {{sit_}}, nunca "new_".
Restricciones: máximo {{4}} tablas nuevas; reutiliza Account/Contact si el proceso los necesita, no los
dupliques.
Formato de salida: tabla Markdown por tabla (columna | tipo | requerido | notas) + lista de relaciones.
```
*Resultado esperado:* una tabla por entidad más una lista de relaciones. **Evalúa:** ¿reutilizó Account/Contact en vez de duplicarlos? ¿respetó el prefijo de publisher? ¿el número de tablas es razonable para el alcance descrito?

**3. Revisión de Power Fx**
```
Rol: eres revisor senior de Power Apps Canvas, enfocado en delegación y performance.
Contexto: la siguiente fórmula corre sobre una tabla de Dataverse con más de 5,000 registros:
{{pega aquí la fórmula completa}}
Tarea: identifica si la fórmula es delegable, señala cada función no delegable y su alternativa, y
reescribe la fórmula optimizada.
Formato de salida: (1) veredicto delegable/no delegable, (2) lista de problemas encontrados, (3) fórmula
corregida con comentarios `//`.
```
*Resultado esperado:* veredicto + fórmula corregida comentada. **Evalúa:** ¿la fórmula corregida sigue produciendo el mismo resultado lógico? ¿usó operadores realmente delegables contra Dataverse (Módulo 7), no solo "más cortos"?

**4. Revisión de JavaScript en model-driven apps**
```
Rol: eres revisor senior de código cliente en Dynamics 365 (model-driven apps).
Contexto: el siguiente script corre en el evento {{OnLoad/OnChange/OnSave}} del formulario de
{{nombre de tabla}}:
{{pega aquí el código completo}}
Tarea: revisa uso correcto de executionContext/formContext, manejo de errores, y si el script bloquea
el guardado sin necesidad. Señala cualquier acceso a `Xrm.Page` (API obsoleta).
Formato de salida: lista de hallazgos con severidad (bloqueante/advertencia/sugerencia) + código corregido.
```
*Resultado esperado:* lista de hallazgos + diff del código corregido. **Evalúa:** ¿marcó correctamente el uso de `Xrm.Page` como obsoleto? ¿el código corregido usa `executionContext.getFormContext()`?

**5. Revisión de plugin C#**
```
Rol: eres revisor senior de plugins de Dataverse (C#, SDK de Dynamics 365).
Contexto: el siguiente plugin se registra en {{Create/Update}} de {{nombre de tabla}}, paso
{{Pre-operation/Post-operation}}:
{{pega aquí el código completo}}
Tarea: revisa manejo de excepciones (InvalidPluginExecutionException), uso de ITracingService,
llamadas síncronas dentro de loops, y si respeta el principio de responsabilidad única.
Formato de salida: lista de hallazgos con severidad + código corregido con comentarios.
```
*Resultado esperado:* lista de hallazgos + código corregido. **Evalúa:** ¿detectó llamadas a la Web API dentro de un bucle (riesgo de timeout, ver Módulo 42)? ¿el manejo de errores usa el tipo de excepción correcto del SDK?

**6. Documentación de un flujo de Power Automate**
```
Rol: eres consultor documentando flujos para transferencia de conocimiento.
Contexto: el flujo se llama {{nombre}}, dispara con {{trigger}} y tiene estas acciones en orden:
{{lista de acciones}}.
Tarea: documenta el flujo para alguien que nunca lo vio: propósito de negocio, trigger, cada acción
en una frase, condiciones de error y a quién notifican.
Formato de salida: Markdown con secciones Propósito / Trigger / Pasos / Manejo de errores / Owner.
```
*Resultado esperado:* documento Markdown listo para el repositorio. **Evalúa:** ¿describe el propósito de negocio, no solo la mecánica técnica? ¿identifica qué pasa si una acción falla?

**7. Generación de casos UAT**
```
Rol: eres QA funcional preparando UAT para un proceso Dynamics 365.
Contexto: proceso: {{ej. "aprobación de solicitud de gasto con 2 niveles"}}. Reglas de negocio:
{{lista de reglas}}.
Tarea: genera 6-8 casos de prueba cubriendo el camino feliz, al menos 2 casos negativos y 1 caso límite.
Formato de salida: tabla | ID | Escenario | Pasos | Datos de entrada | Resultado esperado |.
```
*Resultado esperado:* tabla de 6-8 casos UAT. **Evalúa:** ¿incluyó casos negativos reales (no solo variaciones del camino feliz)? ¿los datos de entrada son concretos, no genéricos ("dato válido")?

**8. Análisis de vacante para empleabilidad**
```
Rol: eres coach técnico de Power Platform/Dynamics 365 ayudándome a evaluar una vacante.
Contexto: esta es la descripción de la vacante: {{pega el texto completo de la vacante}}.
Mi portafolio incluye estos labs completados: {{lista de labs, ej. "Lab 66 Sales lead-to-cash, Lab 09
Dataverse avanzado"}}.
Tarea: mapea cada requisito de la vacante contra mi portafolio (cubierto/parcial/no cubierto), y para
cada "parcial" o "no cubierto" sugiere qué lab o módulo de este plan de estudio lo cerraría.
Formato de salida: tabla | Requisito | Cobertura | Evidencia/Lab | Acción sugerida |.
```
*Resultado esperado:* tabla de mapeo requisito↔evidencia. **Evalúa:** ¿la IA infló tu experiencia real, o fue honesta marcando "parcial"/"no cubierto" donde correspondía? Nunca aceptes que reescriba tu experiencia como si hubieras hecho algo que no hiciste.

Para cada plantilla que uses: guárdala en un archivo Markdown versionado del repositorio (ej. `docs/prompts/`) con un encabezado de para qué sirve y cuándo se actualizó, y documenta el resultado real que obtuviste la primera vez que la usaste con datos propios.

### 💼 Casos Reales de Negocio
En SIT, cada desarrollador pedía "genera un flujo de aprobación" con una instrucción distinta cada vez, produciendo flujos con estructuras y nomenclatura inconsistentes entre proyectos, difíciles de mantener en equipo. Al introducir una plantilla común (con la convención de nombres `sit_`, el patrón de dos aprobadores y el manejo de rechazo ya especificados), el tiempo de creación de un flujo nuevo bajó y la consistencia entre flujos de distintos desarrolladores mejoró notablemente, facilitando el mantenimiento posterior.

### ✅ Buenas Prácticas
- Guardar las plantillas de prompt en el repositorio, versionadas con git, no solo en el historial de un chat.
- Incluir siempre restricciones explícitas (qué NO hacer, qué convención seguir) en la plantilla, no solo la tarea positiva.
- Revisar y actualizar las plantillas cuando dejen de producir buenos resultados, igual que se refactoriza código.
- Nunca pegar datos reales de cliente, credenciales o código con secretos dentro de una plantilla al probarla (Módulo 49) — usar siempre datos ficticios equivalentes en estructura.
- Ejecutar el criterio de evaluación humana de cada plantilla (indicado junto a cada una) antes de usar el resultado en un entregable real.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Repetir instrucciones distintas cada vez para la misma tarea recurrente | No haberlas convertido nunca en plantilla | Extraer una plantilla la primera vez que se detecta la repetición |
| Perder plantillas útiles en el historial de un chat | No versionarlas en el repositorio | Guardarlas como archivos Markdown en el repo, con control de versiones |
| Plantillas tan rígidas que fallan en casos particulares | Sobre-especificar cada detalle sin dejar espacio de ajuste | Cubrir el caso común como plantilla y dejar el resto para ajuste manual explícito |
| Prompt ambiguo sin rol, contexto ni formato de salida | Copiar solo la "tarea" de la plantilla sin el resto de las secciones | Usar siempre las 4 partes completas: rol, contexto, tarea, restricciones y formato |
| Aceptar el resultado de la plantilla de vacante como currículo real | Confundir "mapeo de cobertura" con "reescritura de experiencia" | Usar la salida solo como diagnóstico de brechas, nunca como texto final sin verificar que sea cierto |

### 🧪 Criterios de Validación
- [ ] Usé al menos 3 de las 8 plantillas de la biblioteca con datos propios (no los del ejemplo)
- [ ] Apliqué el criterio de evaluación humana de cada plantilla usada antes de aceptar el resultado
- [ ] Identifiqué un caso donde la IA fue imprecisa u optimista y lo corregí manualmente
- [ ] Guardo al menos una plantilla adaptada como archivo versionado en el repositorio
- [ ] Relacioné la plantilla de UAT con el Lab 55 (UAT y auditoría de prompts) y la plantilla de vacantes con el Lab 79 (simulación de entrevista técnica)

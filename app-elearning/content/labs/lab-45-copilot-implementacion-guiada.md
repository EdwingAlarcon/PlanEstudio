---
id: lab-45
title: "Copilot/Claude Code — Implementación Guiada sobre el Escenario SIT"
level: "N5"
duration: 140
product: ["GitHub Copilot", "Claude Code", "Power Automate", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Maker"]
prerequisites:
  - "Lab 05 completado — flujo de aprobación de solicitudes de prioridad crítica en Dataverse"
  - "Editor con GitHub Copilot, Claude Code o Codex instalado (Claude Code requiere plan de pago; GitHub Copilot Free no)"
  - "Módulo 44 y 45 estudiados: GitHub Copilot en VS Code, Claude Code y Codex"
files: []
lastVerified: "2026-11"
---

# Lab 45 — Implementación Guiada con IA sobre el Escenario SIT

## Objetivo

Al finalizar este laboratorio habrás usado un asistente o agente de código para implementar una extensión real y acotada sobre el flujo de aprobación de solicitudes de Servicios Integrados Tecnológicos S.A. (SIT), aplicando el ciclo completo de tarea acotada → generación → revisión del cambio → verificación.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 05

**Problema a resolver:** El flujo de aprobación de solicitudes de prioridad crítica del Lab 05 (`SIT — Aprobación Prioridad Crítica`) notifica al aprobador pero no registra cuánto tiempo tarda cada aprobación, dato que la Gerencia de TI necesita para su reporte mensual de SLA interno. Se necesita agregar un campo de "tiempo de aprobación en horas" calculado automáticamente cuando el aprobador responde (Approve o Reject).

**Por qué es una buena tarea para practicar el flujo asistido por IA:** es un cambio pequeño, acotado a un flujo existente, con un criterio de éxito verificable (el campo se calcula correctamente), y de bajo riesgo si algo sale mal (no toca pagos ni aprobaciones, solo un campo de reporting).

## Lo que vas a construir

- Un campo nuevo `sit_horasaprobacion` en la tabla de solicitudes (**Solicitud TI**, `sit_solicitud`)
- Una modificación al flujo del Lab 05 que calcule y guarde ese valor cuando el aprobador responde
- Una prueba documentada en 2 escenarios: una aprobación real respondida en minutos y una comprobación de la fórmula con fechas fijas separadas por 3 días (no hace falta esperar 3 días)

## Antes de empezar

- **Qué hace la IA aquí.** Un flujo de Power Automate no es un archivo de tu repositorio: ni Copilot, ni Claude Code ni Codex pueden editarlo por ti. En este lab la IA trabaja como **chat**: le describes el flujo, te propone las acciones y la expresión, y **tú** las aplicas en el diseñador. Por eso basta el agente **Ask** de Copilot Free en VS Code o cualquier chat; Claude Code o Codex sirven igual, en un modo que no edita.
- **El "diff" de un flujo.** Como no hay `git diff`, el cambio se revisa con una lista **antes / después** de las acciones del flujo, que escribes tú.
- **Ambiente:** el mismo del Lab 05, con la solución donde está el flujo.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Diseñar la tarea (humano): definir alcance y criterio de éxito | 15 min |
| Ejercicio 2 — Pedir la propuesta a la IA y aplicarla: el campo y la lógica del flujo | 50 min |
| Ejercicio 3 — Revisar el cambio con la checklist del Módulo 48 | 25 min |
| Ejercicio 4 — Verificar con los 2 escenarios de prueba | 50 min |
| **Total** | **140 min** |

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Tecnologías utilizadas

- GitHub Copilot, Claude Code o Codex (a elección; Copilot Free alcanza)
- Power Automate (flujo del Lab 05)
- Microsoft Dataverse (tabla de solicitudes `sit_solicitud`)

## Ejercicio 1 — Diseñar la tarea (humano diseña)

Antes de abrir cualquier herramienta de IA, abre el flujo `SIT — Aprobación Prioridad Crítica` del Lab 05 y escribe en un párrafo:
1. El campo exacto a agregar (`sit_horasaprobacion`, tipo **Whole Number**).
2. En qué punto del flujo empieza y termina la medición: empieza cuando el flujo **envía** la aprobación (justo antes de **Start and wait for an approval**) y termina cuando el aprobador responde **Approve** o **Reject** (justo después de esa acción, en las dos ramas).
3. El criterio de éxito: "el campo refleja las horas completas transcurridas entre el envío de la aprobación y la respuesta del aprobador, redondeadas hacia abajo".
4. **Antes:** la lista de acciones del flujo tal como está hoy, en orden (trigger, condiciones, aprobación, cada **Update a row** y cada email). Es la mitad "antes" de tu revisión.

> **¿Por qué no desde la creación de la solicitud?** En el Lab 05 la aprobación empieza cuando alguien cambia la prioridad a **Crítica**, que puede ocurrir días después de crear la solicitud. Medir desde `createdon` mediría otra cosa. Guárdalo: lo vas a necesitar en el Ejercicio 3.

## Ejercicio 2 — Implementar con asistencia de IA

**2.1 Pide la propuesta.** Usa la plantilla de prompt que hayas construido en el Módulo 47 (o una instrucción acotada siguiendo el Módulo 45). Dale a la IA el contexto del flujo, la tarea y el formato de salida. Por ejemplo:

```
Rol: eres maker de Power Automate con Dataverse.
Contexto: tengo un cloud flow de solución con estas acciones en orden: [pega tu lista "antes"].
La tabla Solicitud TI (sit_solicitud) tendrá una columna nueva sit_horasaprobacion (Whole Number).
Tarea: propone las acciones que debo agregar para guardar en sit_horasaprobacion las horas completas
entre el envío de la aprobación y la respuesta, en las dos ramas (Approve y Reject).
Restricciones: solo expresiones de Power Automate; no agregues conectores nuevos; no cambies las
condiciones ni el Terminate existentes.
Formato de salida: lista numerada de acciones (dónde va cada una, qué campo, qué expresión exacta).
```

Guarda el prompt y la respuesta completa: son evidencia.

**2.2 Crea la columna.** En tu solución abre la tabla **Solicitud TI**, zona **Columns** → **New column** ([Learn: crear columnas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal)):

| Display name | Schema name (en **Advanced options**): escribe solo esto | Resultado | Data type | Required |
|---|---|---|---|---|
| Horas Aprobación | `horasaprobacion` | `sit_horasaprobacion` | Whole Number | Optional |

Guarda la columna.

**2.3 Aplica la propuesta en el flujo.** Abre el flujo en el diseñador y aplica lo que propuso la IA **solo si** respeta tu criterio del Ejercicio 1; si no, anota la diferencia y aplica la versión corregida. Recuerda: la columna nueva aparece en **Update a row** bajo **Advanced parameters** (o **Show all**), igual que **Estado** en el Lab 05; en el diseñador clásico es **Show advanced options**, que es el nombre que da Learn para esta acción ([Learn: Update a row](https://learn.microsoft.com/power-automate/dataverse/update)). Al terminar, **Publish**.

## Ejercicio 3 — Revisar el resultado (humano aprueba, parcial)

Escribe la lista **después** (las acciones del flujo tal como quedaron) y compárala con la lista **antes**. Aplica la checklist del Módulo 48:
- **Alcance:** ¿el cambio toca solo la columna nueva y el flujo de aprobación, o modifica algo más (condiciones, **Terminate**, textos de los emails)?
- **Qué mide de verdad:** ¿la propuesta midió desde `createdon` o desde `utcNow()` al **crear** la solicitud? Según tu Ejercicio 1, eso no es el tiempo de la aprobación.
- **Efectos secundarios:** ¿el valor se guarda en **las dos** ramas? ¿qué pasa si la acción que guarda la hora de envío no se ejecutó o está después de la aprobación?
- **Seguridad:** ¿el cambio introduce algún permiso, conexión o conector nuevo no necesario?
- **Tests:** ver Ejercicio 4.

**Referencia para comparar** (úsala después de revisar la propuesta de la IA, no antes). Es el mismo patrón de *ticks* que usaste en el Módulo 5 para los "días abierta", con horas en vez de días:

1. Justo **antes** de **Start and wait for an approval**, una acción **Compose** con la expresión (**fx**) `utcNow()`. Guarda el momento en que se envía la aprobación.
2. En el **Update a row** de cada rama (Approve y Reject), en **Horas Aprobación**, con **fx**:
   ```
   div(sub(ticks(utcNow()), ticks(outputs('Compose'))), 36000000000)
   ```
   Si tu acción **Compose** tiene otro nombre (por ejemplo, **Compose 1** porque ya había otra), en la expresión se escribe con los espacios cambiados por guiones bajos: `outputs('Compose_1')`.

*Por qué funciona:* `ticks()` devuelve intervalos de 100 nanosegundos, así que una hora son 36.000.000.000 ticks; y `div()` con dos enteros devuelve un entero, es decir, descarta la parte decimal: 71 horas y 59 minutos dan `71` ([Learn: funciones de expresión, ticks y div](https://learn.microsoft.com/azure/logic-apps/expression-functions-reference)).

## Ejercicio 4 — Verificar (CI valida, en este caso manual)

**Escenario 1 — aprobación real, respondida en minutos.** En la app del Lab 04 cambia una solicitud de Prioridad **Alta** a **Crítica**, guarda y aprueba desde el email antes de que pase una hora. Recarga la solicitud: **Horas Aprobación** debe mostrar `0`. Repite con otra solicitud y esta vez **Reject**: **Horas Aprobación** también debe mostrar `0` y la Prioridad volver a **Alta**, como en el Lab 05.

**Escenario 2 — la fórmula con fechas separadas por 3 días.** Esperar 3 días para responder una aprobación no es práctico, así que compruebas la misma fórmula con fechas fijas:
1. En la solución, **New** → **Automation** → **Cloud flow** → **Instant**, con el trigger **Manually trigger a flow**. Nómbralo `SIT — Prueba horas aprobación`.
2. Agrega tres acciones **Compose**, cada una con una de estas expresiones (**fx**):

   | Compose | Expresión | Resultado esperado |
   |---|---|---|
   | 1 | `div(sub(ticks('2026-11-13T09:00:00Z'), ticks('2026-11-10T09:00:00Z')), 36000000000)` | `72` (3 días exactos) |
   | 2 | `div(sub(ticks('2026-11-13T08:59:00Z'), ticks('2026-11-10T09:00:00Z')), 36000000000)` | `71` (redondea hacia abajo) |
   | 3 | `div(sub(ticks('2026-11-10T09:59:00Z'), ticks('2026-11-10T09:00:00Z')), 36000000000)` | `0` (menos de una hora) |

3. **Publish** → **Test** → **Manually** → **Test** → **Run flow** → **Done**. En la ejecución, abre cada **Compose** y anota su salida.

**Si no lo ves:** si **Horas Aprobación** queda vacío, revisa que la columna esté en el **Update a row** de esa rama y que publicaste el flujo antes de probar. Si la acción falla con un error que menciona `ticks`, el nombre dentro de `outputs('...')` no coincide con el de tu **Compose**.

Documenta el resultado de los dos escenarios antes de marcar el laboratorio como completado.

## Criterios de Validación

- [ ] Definí el alcance, el punto de inicio y fin de la medición y el criterio de éxito antes de usar la herramienta de IA
- [ ] El campo `sit_horasaprobacion` se agregó y se calcula cuando el aprobador responde, en las ramas Approve y Reject
- [ ] Revisé el cambio con la checklist de alcance/qué mide/efectos secundarios/seguridad del Módulo 48 y con mis listas antes/después
- [ ] Verifiqué el cálculo con los 2 escenarios de prueba y documenté el resultado

## Evidencia esperada

- Prompt usado y respuesta completa de la IA
- Listas de acciones del flujo **antes** y **después** del cambio, y las diferencias entre la propuesta de la IA y lo que aplicaste
- Resultado del escenario 1 (Approve y Reject, valor de **Horas Aprobación**) y salidas de las tres **Compose** del escenario 2
- Checklist de revisión (alcance/qué mide/efectos secundarios/seguridad) completada

## Criterios de aprobación

- El campo calcula correctamente el valor en ambos escenarios de prueba
- La revisión humana quedó documentada antes de aprobar el cambio generado por IA
- 100% de los ítems de Criterios de Validación marcados

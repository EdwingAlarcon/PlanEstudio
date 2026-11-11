---
id: lab-110
title: "RPA — Cloud flow + desktop flow end-to-end"
level: "RPA"
duration: 160
product: ["Power Automate Cloud", "Power Automate for desktop", "Machine Runtime", "RPA"]
certifications: ["Power Automate for desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "Power Platform Consultant"]
prerequisites:
  - "Módulo 75 completado"
  - "Power Automate cloud básico (Módulo 5 o equivalente)"
files: []
lastVerified: "2026-11"
---

# LAB-RPA-07 — Cloud flow + desktop flow

## Objetivo

Recibir una solicitud desde Power Automate cloud, ejecutar PAD y devolver resultado con parámetros, máquina, respuesta, error, almacenamiento y notificación.

> **Licencia y variante sin cloud flow:** disparar un desktop flow desde un cloud flow exige un plan premium con RPA atendido (o Process para desatendido); el Developer Plan no incluye derechos de RPA. Si no tienes licencia, haz este laboratorio como **simulación**: diseña el cloud flow en papel y simula el disparador con valores por defecto, como describe el Módulo 75, y escribe «simulación sin licencia» en tu entrega. Este laboratorio equivale a la Microlección 3 y al diagnóstico del Módulo 75: si ya los hiciste, entrégalos aquí.
>
> **Antes de decidir, comprueba (Learn, noviembre de 2026):** la conexión de desktop flows exige una cuenta de trabajo o escuela, y la licencia la necesita quien crea la conexión ([Learn: Trigger desktop flows from cloud flows](https://learn.microsoft.com/power-automate/desktop-flows/trigger-desktop-flows)). El plan Premium incluye un bot atendido, y la prueba de 90 días de Power Automate da las capacidades Premium, incluidas las ejecuciones desatendidas; con la licencia gratuita solo ejecutas en local y de forma atendida ([Learn: Power Automate license types](https://learn.microsoft.com/power-platform/admin/power-automate-licensing/types)). En Windows Home no puedes disparar desktop flows desde la nube ([Learn: Prerequisites and limitations](https://learn.microsoft.com/power-automate/desktop-flows/requirements)). Las páginas de **Monitor** solo están disponibles para usuarios Premium.

## Escenario de negocio

Un equipo registra solicitudes de trabajo en una lista. Cloud flow orquesta el lote; PAD ejecuta la parte de interfaz; Dataverse o SharePoint conserva estado.

## Competencias desarrolladas

- Contrato cloud-desktop
- Inputs y outputs
- Machine runtime
- Estado y notificación
- Errores cruzados

## Ejercicios

1. Crea una lista/tabla de solicitudes ficticias.
2. Define estados `Pendiente`, `EnEjecucion`, `Completado`, `ErrorNegocio` y `ErrorTecnico` (los mismos del Módulo 75).
3. Crea cloud flow programado o manual.
4. Envía parameters al desktop flow.
5. Devuelve resultado estructurado.
6. Actualiza estado y notifica.
7. Simula máquina no disponible o error desktop.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El cloud flow queda "en espera" y nunca recibe respuesta del desktop flow | La conexión de PAD a la cuenta/máquina no está activa o el desktop flow no está en el mismo ambiente que el cloud flow | Verifica en **Monitor > Machines** el estado de la máquina, que la conexión de desktop flows sea válida y que el desktop flow exista en el ambiente del cloud flow. Si hay máquinas elegibles sin conexión, la ejecución espera en la cola (en la pestaña **Run queue** de la máquina puedes usar **Cancel parent flow run**); si no hay ninguna elegible, falla. En modo atendido, la ejecución falla de inmediato si ninguna máquina conectada tiene abierta la sesión de tu usuario ([Learn: Monitor desktop flow queues](https://learn.microsoft.com/power-automate/desktop-flows/monitor-desktop-flow-queues)) |
| El desktop flow recibe parámetros vacíos o con tipo incorrecto | Los nombres de input del cloud flow no coinciden exactamente con los definidos en PAD, o falta el mapeo de tipo | Compara nombre y tipo de cada input/output entre el trigger del cloud flow y las variables de entrada de PAD; usa nombres idénticos y castea tipos explícitamente |
| El estado en la lista/tabla queda en `EnEjecucion` aunque PAD ya terminó | El desktop flow no devuelve el resultado al cloud flow (faltan variables de salida) o el cloud flow no actualiza el registro tras recibir la respuesta | Confirma que PAD define variables de salida (**+** > **Output**, con su **External name**) y que el cloud flow tiene un paso de actualización posterior a **Run a flow built with Power Automate for desktop** |
| El run history no distingue error de máquina de error de negocio | El manejo de errores solo captura una excepción genérica en PAD sin clasificar la causa | Usa bloques `On block error` separados por tipo (máquina no disponible, selector no encontrado, dato inválido) y propaga un código de error distinto en cada salida |
| Simular "máquina no disponible" no genera ningún registro de error | El escenario de prueba no fuerza realmente la desconexión, o el cloud flow no tiene manejo de fallos configurado | Para un fallo rápido, en modo atendido cierra la sesión de tu usuario de Windows en la máquina antes de disparar la corrida (si solo apagas la máquina, la ejecución puede quedarse esperando en la cola). Configura **Run after** (casilla **has failed**) en un paso posterior del cloud flow, o un **Scope** de captura, para atrapar el fallo de la acción de escritorio |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Cloud flow en espera sin respuesta de PAD

- **Causa probable:** conexión de máquina inactiva, máquina sin conexión o desktop flow que no está en el ambiente del cloud flow.
- **Cómo comprobar:** revisa en Power Automate el estado de la conexión (`Conectado`/`Error`) y en **Monitor > Desktop flow runs** el **Status** de la ejecución; confirma que el desktop flow aparece en el mismo ambiente que el cloud flow.
- **Cómo corregir:** reconecta la máquina, confirma que el desktop flow está en el ambiente correcto y vuelve a seleccionarlo en la acción **Run a flow built with Power Automate for desktop**.
- **Reiniciar vs. reparar:** si la corrida lleva más de unos minutos "en espera", cancela solo esa ejecución (**Cancel parent flow run** en la pestaña **Run queue** de la máquina) y reiníciala; no hace falta rehacer el diseño. Si no la cancelas, la espera puede durar horas antes de fallar.
- **Evidencia posterior a la corrección:** captura del estado `Conectado` y de la corrida completada en el run history.

### Parámetros de entrada/salida vacíos o con tipo incorrecto

- **Causa probable:** desalineación de nombres/tipos entre el trigger del cloud flow y las variables de entrada de PAD.
- **Cómo comprobar:** compara campo por campo el payload enviado (panel de inputs del run history) contra las variables `%InputVariable%` declaradas en PAD.
- **Cómo corregir:** renombra o remapea los campos para que coincidan exactamente, incluyendo el tipo de dato (texto, número, booleano).
- **Reiniciar vs. reparar:** basta con corregir el mapeo y volver a ejecutar esa solicitud puntual; no es necesario reiniciar el lote completo.
- **Evidencia posterior a la corrección:** captura de los inputs/outputs correctos en una nueva corrida exitosa.

### Estado atascado en `EnEjecucion`

- **Causa probable:** PAD no devuelve resultado al cloud flow o falta el paso de actualización de estado tras la respuesta.
- **Cómo comprobar:** revisa si la acción **Run a flow built with Power Automate for desktop** muestra outputs vacíos (revisa que las variables de salida tengan **External name**), y si existe un paso posterior que actualice la lista/tabla.
- **Cómo corregir:** agrega la acción de salida en PAD y el paso de actualización de estado en el cloud flow inmediatamente después de recibir la respuesta.
- **Reiniciar vs. reparar:** si el registro quedó en un estado inconsistente a mitad de proceso, corrige manualmente el estado a `Error` y vuelve a lanzar solo esa solicitud; no reinicies todo el lote.
- **Evidencia posterior a la corrección:** captura del registro pasando correctamente de `EnEjecucion` a `Completado` o `Error`.

### Run history sin distinción entre error de máquina y error de negocio

- **Causa probable:** manejo de excepciones genérico en PAD que no clasifica la causa raíz.
- **Cómo comprobar:** revisa si todos los errores registrados usan el mismo mensaje/código sin importar su origen.
- **Cómo corregir:** separa el manejo de errores en bloques específicos (máquina, selector, dato inválido) y propaga un código distinto por tipo hacia el cloud flow.
- **Reiniciar vs. reparar:** repara solo el bloque de manejo de errores afectado; no requiere reiniciar el desktop flow completo.
- **Evidencia posterior a la corrección:** captura del run history mostrando al menos dos tipos de error claramente diferenciados.

### Simulación de máquina no disponible sin registro de fallo

- **Causa probable:** el escenario de prueba no desconecta realmente el runtime, o el cloud flow no tiene configurado el manejo de fallos de la acción de escritorio.
- **Cómo comprobar:** verifica si el agente/runtime de PAD sigue activo durante la prueba y si hay un paso posterior con **Run after** habilitado para **has failed** (o un **Scope** de captura).
- **Cómo corregir:** en modo atendido, cierra la sesión de Windows de tu usuario en la máquina antes de disparar la corrida (Learn indica que entonces falla de inmediato; apagar la máquina la deja esperando en la cola) y configura la acción para continuar en caso de error, capturando el resultado.
- **Reiniciar vs. reparar:** al ser una prueba controlada, reinicia esa corrida específica tras habilitar el runtime nuevamente; no afecta a las demás solicitudes del lote.
- **Evidencia posterior a la corrección:** captura del registro de error generado y del estado `Error` reflejado en la lista/tabla.

## Evidencia esperada

- Diagrama end-to-end
- Captura de cloud flow
- Captura de desktop flow
- Run history con inputs/outputs
- Registro de estado y notificación

## Criterios de aprobación

- El contrato no depende de texto libre ambiguo.
- Los errores de máquina se distinguen de errores de negocio.
- El estado persiste fuera de la VM.
- No se registran secretos en logs.

## Assets reproducibles

- Manifest del paquete: [manifest.json](../practice-assets/rpa/sit-automation-case/manifest.json).
- Parámetros: [parametros_proceso.json](../practice-assets/rpa/sit-automation-case/input/parametros_proceso.json).
- Métricas esperadas: [metricas_esperadas.json](../practice-assets/rpa/sit-automation-case/expected/metricas_esperadas.json).
- Plantilla: [Runbook operativo](../practice-assets/rpa/sit-automation-case/templates/runbook.md).
- Reset: usa un `correlationId` nuevo por corrida y conserva los logs separados.
- Variante sin cloud flow: simula el disparador cloud con parámetros locales y documenta qué quedaría pendiente en tenant.

## Reto adicional

Agrega distribución por machine group si tu licencia/tenant lo permite; si no, documenta variante simulada.

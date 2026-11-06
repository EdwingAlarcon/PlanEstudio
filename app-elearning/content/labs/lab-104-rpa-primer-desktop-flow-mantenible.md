---
id: lab-104
title: "RPA — Primer desktop flow mantenible"
level: "RPA"
duration: 120
product: ["Power Automate for desktop", "Desktop Flow", "RPA"]
certifications: ["Power Automate for desktop & RPA"]
role: ["RPA Developer", "Automation Engineer"]
prerequisites:
  - "Módulo 67 completado"
  - "Power Automate for desktop instalado o variante simulada documentada"
files: []
lastVerified: "2026-11"
---

# LAB-RPA-01 — Primer desktop flow mantenible

## Objetivo

Construir un desktop flow pequeño pero operable: inputs, outputs, variables, condiciones, bucles, subflows, logging y manejo básico de errores.

## Escenario de negocio

SIT necesita procesar una lista de solicitudes internas desde un archivo de prueba y producir un log que soporte pueda leer sin abrir el diseñador.

## Competencias desarrolladas

- Diseño modular de desktop flows
- Variables, listas y data tables
- Logging con correlation ID
- Manejo básico de errores
- Evidencia defendible

## Ejercicios

1. Define inputs `in_InputPath`, `in_OutputFolder`, `in_DryRun` y `in_CorrelationId`.
2. Crea subflows `Inicializar`, `ValidarEntrada`, `ProcesarRegistros`, `RegistrarResultado` y `CerrarRecursos` (los mismos del Módulo 69, todos con alcance **Global**).
3. Procesa `solicitudes_sucursales.csv`: 4 registros, uno de ellos del cliente bloqueado `CLI-0003` (debe quedar como `ErrorValidacion`).
4. Escribe log CSV con estado por registro.
5. Devuelve outputs `out_Total`, `out_Procesados`, `out_Errores` y `out_LogPath`.
6. Fuerza un error y confirma que el subflow de cierre se ejecuta.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flow queda "monolítico" pese al ejercicio 2 | Las acciones se escribieron en `Main` y los subflows se crearon vacíos o solo con un comentario | Corta y pega las acciones de cada etapa dentro de su subflow real; `Main` debe quedar como una secuencia de llamadas a subflows |
| El log no marca como `ErrorValidacion` el registro del cliente bloqueado (paso 3) | La regla se evalúa después de escribir la fila como procesada, o compara contra un valor distinto del que trae la columna `customerId` | Dentro del **For each** de `ProcesarRegistros`, evalúa la regla con **If** **antes** de contar o escribir la fila, y deja el resultado en el log con su estado |
| El log CSV queda vacío o solo con una línea | Las acciones **Write text to file** quedaron con **If file exists** en **Overwrite existing content** (el valor por defecto), así que cada línea sobrescribe la anterior | Pon **If file exists** en **Append content** (y **Encoding** **UTF-8**) en todas las escrituras del log salvo la del encabezado |
| Al forzar el error del paso 6, el bot se detiene sin ejecutar `CerrarRecursos` | Por defecto un desktop flow se detiene ante un error y no hay un **On block error** alrededor del trabajo | Envuelve `ValidarEntrada` y `ProcesarRegistros` en **On block error** (con **New rule** > **Run subflow** `ManejarError`), deja `Run subflow CerrarRecursos` después del **End** del bloque y termina con **Stop flow** **With error message** |
| Los outputs (`out_Total`, `out_Procesados`, `out_Errores`) quedan en 0 aunque el flow corrió bien | Algún subflow se creó con alcance **Local**: sus variables solo existen dentro de ese subflow y no actualizan las de `Main` | Usa subflows **Global** (el alcance no se puede cambiar después de crearlo: recrea el subflow y mueve sus acciones); con subflows globales todos comparten las mismas variables y no hace falta devolverlas |
| El log expone la ruta completa de `in_InputPath` o datos del registro inválido | El logging concatena la fila completa o la ruta del input sin filtrar campos sensibles | Registra solo el identificador de fila y el tipo de error, nunca el contenido crudo del registro |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Flow monolítico sin subflows reales

- **Causa probable:** todas las acciones quedaron en `Main` y los subflows están vacíos.
- **Cómo comprobar:** abre cada subflow (`Inicializar`, `ValidarEntrada`, `ProcesarRegistros`, `RegistrarResultado`, `CerrarRecursos`) y confirma que tenga acciones propias, no solo el subflow `Main` con todo el trabajo.
- **Cómo corregir:** mueve cada bloque de acciones al subflow que le corresponde según su nombre; `Main` debe reducirse a llamadas ordenadas.
- **Reiniciar vs. reparar:** no requiere reiniciar el flow completo, es una reorganización estructural; ejecuta de nuevo solo al final para validar.
- **Evidencia posterior a la corrección:** vuelve a capturar el diagrama de subflows mostrando la separación real.

### El registro del cliente bloqueado no sale como `ErrorValidacion`

- **Causa probable:** la regla se evalúa después de contar o escribir la fila como procesada, o compara contra un valor distinto del que trae la columna `customerId`.
- **Cómo comprobar:** ejecuta el flow con `in_DryRun` en `True`, pon un punto de interrupción dentro del **For each** de `ProcesarRegistros` y mira el valor de `%CurrentItem['customerId']%` en la fila `SOL-2026-0003`.
- **Cómo corregir:** evalúa la regla con **If** al principio de cada vuelta del **For each**, antes de contar o escribir la fila, y escribe en el log la fila rechazada con su estado y motivo.
- **Reiniciar vs. reparar:** repara solo el subflow `ProcesarRegistros`; no hace falta rehacer el resto del flow.
- **Evidencia posterior a la corrección:** el log CSV debe mostrar `SOL-2026-0003` con estado `ErrorValidacion` y motivo.

### Log CSV vacío o solo con una línea

- **Causa probable:** las acciones **Write text to file** del log quedaron con **If file exists** en **Overwrite existing content** (el valor por defecto), así que cada línea sobrescribe la anterior.
- **Cómo comprobar:** abre el CSV generado tras una corrida completa y cuenta las líneas frente a las esperadas (encabezado, inicio, una por cada uno de los 4 registros y el resumen).
- **Cómo corregir:** en todas las acciones **Write text to file** del log salvo la del encabezado, pon **If file exists** en **Append content** y **Encoding** en **UTF-8**.
- **Reiniciar vs. reparar:** basta con corregir esas acciones; reinicia la ejecución completa solo para regenerar el log limpio.
- **Evidencia posterior a la corrección:** el log debe tener una línea por registro procesado, incluida la del cliente bloqueado.

### El bot se detiene sin ejecutar `CerrarRecursos` tras el error forzado

- **Causa probable:** por defecto un desktop flow se detiene ante un error y no hay un **On block error** alrededor del trabajo (o un **Stop flow** corta el flujo antes del cierre).
- **Cómo comprobar:** fuerza de nuevo el error del paso 6 y observa si el flow termina con error y deja `en_ejecucion.lock` (o el recurso que cierra `CerrarRecursos`) sin liberar.
- **Cómo corregir:** envuelve `Run subflow ValidarEntrada` y `Run subflow ProcesarRegistros` en **On block error**; en su configuración, con **New rule**, agrega **Run subflow** `ManejarError` y elige continuar al final del bloque. Deja `Run subflow CerrarRecursos` después del **End** del bloque y termina con **Stop flow** **With error message** si hubo error.
- **Reiniciar vs. reparar:** repara el bloque de manejo de errores; no es necesario reiniciar el diseño completo del flow.
- **Evidencia posterior a la corrección:** captura de una ejecución fallida donde el log confirma que `CerrarRecursos` se ejecutó.

### Outputs del flow quedan en 0 o vacíos

- **Causa probable:** algún subflow se creó con alcance **Local**: una variable que asignas ahí sin el prefijo `global.` es local, solo existe dentro de ese subflow y no actualiza las variables de `Main`, que son las que se exponen como outputs.
- **Cómo comprobar:** confirma en el panel de variables que `out_Total`, `out_Procesados`, `out_Errores` y `out_LogPath` estén creadas como **Output**, y revisa el alcance de cada subflow que las asigna.
- **Cómo corregir:** usa subflows **Global**, como en el Módulo 69: con ellos todos los subflows comparten las mismas variables y no hace falta devolverlas. El alcance no se puede cambiar después de crear el subflow; si uno quedó **Local**, recréalo como **Global** y mueve sus acciones.
- **Reiniciar vs. reparar:** repara la asignación de variables; ejecuta el flow completo una vez para confirmar los valores finales.
- **Evidencia posterior a la corrección:** outputs con valores coherentes con el número de registros procesados.

### El log expone datos sensibles del registro

- **Causa probable:** se registra la fila completa (incluida `in_InputPath` o datos crudos) en vez de un resumen.
- **Cómo comprobar:** revisa el CSV de log y busca rutas de archivo completas, nombres o datos de negocio sin filtrar.
- **Cómo corregir:** cambia el logging para incluir solo `CorrelationId`, número de fila y tipo de error.
- **Reiniciar vs. reparar:** repara el texto de las acciones **Write text to file** del log; no requiere reiniciar el flow.
- **Evidencia posterior a la corrección:** log revisado que no expone datos sensibles, listo para adjuntar como evidencia.

## Evidencia esperada

- Captura o export del flow
- Diagrama simple de subflows
- Convención de nombres
- Log de ejecución
- Reflexión sobre mantenibilidad

## Criterios de aprobación

- El flow no queda monolítico.
- Los errores se registran sin exponer datos sensibles.
- El cierre de recursos ocurre en ejecución exitosa y fallida.
- Los outputs permiten diagnóstico desde cloud flow en el futuro.

## Assets reproducibles

- Centro de recursos: [Recursos de práctica RPA](../recursos/rpa-recursos-practica).
- Dataset base: [SIT Automation Case](../practice-assets/rpa/sit-automation-case/README.md).
- Plantilla recomendada: [PDD ligero](../practice-assets/rpa/sit-automation-case/templates/pdd-ligero.md).
- Resultado esperado: [log esperado](../practice-assets/rpa/sit-automation-case/expected/log_esperado.csv).
- Reset: copia nuevamente los archivos de `input` y elimina outputs locales generados por tu flow.
- Variante sin tenant: documenta el diseño, ejecuta solo con archivos locales y marca la validación de tenant como no ejecutada.

## Reto adicional

Agrega un parámetro `in_MaxRetries` y úsalo solo para una acción recuperable, no para repetir todo el lote.

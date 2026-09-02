---
id: lab-104
title: "RPA — Primer desktop flow mantenible"
level: "RPA"
duration: 120
product: ["Power Automate Desktop", "Desktop Flow", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer"]
prerequisites:
  - "Módulo 67 completado"
  - "Power Automate Desktop instalado o variante simulada documentada"
files: []
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
2. Crea subflows `Inicializar`, `ValidarEntrada`, `ProcesarRegistros`, `RegistrarLog` y `CerrarRecursos`.
3. Procesa una tabla con cinco registros, incluyendo uno inválido.
4. Escribe log CSV con estado por registro.
5. Devuelve outputs `out_Total`, `out_Procesados`, `out_Errores` y `out_LogPath`.
6. Fuerza un error y confirma que el subflow de cierre se ejecuta.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flow queda "monolítico" pese al ejercicio 2 | Las acciones se escribieron en `Main` y los subflows se crearon vacíos o solo con un comentario | Corta y pega las acciones de cada etapa dentro de su subflow real; `Main` debe quedar como una secuencia de llamadas a subflows |
| `RegistrarLog` no encuentra el registro inválido del paso 3 | La validación del registro inválido ocurre después de intentar procesarlo, no antes | Ejecuta `ValidarEntrada` fila por fila antes de `ProcesarRegistros` y captura el resultado en una variable de estado por fila |
| El log CSV queda vacío o solo con encabezado | La escritura del CSV está dentro de `ProcesarRegistros` pero se sobrescribe en cada iteración en vez de anexarse | Usa "Escribir en archivo de texto" en modo anexar (o construye la data table completa y escribe una sola vez al final) |
| Al forzar el error del paso 6, el bot se detiene sin ejecutar `CerrarRecursos` | El bloque `Ejecutar acciones` no tiene un `Bloque de manejo de errores` que enrute al subflow de cierre | Envuelve `ProcesarRegistros` en "Ejecutar acciones y manejar errores", y en la rama de error llama explícitamente a `CerrarRecursos` antes de terminar el flow |
| Los outputs (`out_Total`, `out_Procesados`, `out_Errores`) quedan en 0 aunque el flow corrió bien | Las variables se declararon como inputs/outputs del flow pero nunca se asignan dentro de los subflows, solo dentro de `Main` | Asigna los valores dentro del subflow correspondiente y verifica que el subflow los devuelva como variables de salida, no solo variables locales |
| El log expone la ruta completa de `in_InputPath` o datos del registro inválido | El logging concatena la fila completa o la ruta del input sin filtrar campos sensibles | Registra solo el identificador de fila y el tipo de error, nunca el contenido crudo del registro |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Flow monolítico sin subflows reales

- **Causa probable:** todas las acciones quedaron en `Main` y los subflows están vacíos.
- **Cómo comprobar:** abre cada subflow (`Inicializar`, `ValidarEntrada`, `ProcesarRegistros`, `RegistrarLog`, `CerrarRecursos`) y confirma que tenga acciones propias, no solo el subflow `Main` con todo el trabajo.
- **Cómo corregir:** mueve cada bloque de acciones al subflow que le corresponde según su nombre; `Main` debe reducirse a llamadas ordenadas.
- **Reiniciar vs. reparar:** no requiere reiniciar el flow completo, es una reorganización estructural; ejecuta de nuevo solo al final para validar.
- **Evidencia posterior a la corrección:** vuelve a capturar el diagrama de subflows mostrando la separación real.

### `ValidarEntrada` no detecta el registro inválido

- **Causa probable:** la validación corre después del procesamiento o compara contra el tipo de dato incorrecto.
- **Cómo comprobar:** ejecuta el flow con `in_DryRun` en verdadero y revisa el valor de la variable de estado tras `ValidarEntrada` para la fila inválida.
- **Cómo corregir:** agrega la condición de validación (tipo, campo obligatorio, rango) antes de la llamada a `ProcesarRegistros` y marca la fila como inválida en una lista separada.
- **Reiniciar vs. reparar:** repara solo el subflow `ValidarEntrada`; no hace falta reiniciar todo el lote si el resto del flow ya funciona.
- **Evidencia posterior a la corrección:** el log CSV debe mostrar la fila inválida con estado "error" y motivo.

### Log CSV vacío o solo con encabezado

- **Causa probable:** la escritura sobrescribe el archivo en cada iteración del bucle en vez de anexar.
- **Cómo comprobar:** abre el CSV generado tras una corrida completa y cuenta las filas frente al total de registros esperado.
- **Cómo corregir:** cambia la acción de escritura a modo "anexar" o acumula los resultados en una data table y escribe una sola vez al cerrar el bucle.
- **Reiniciar vs. reparar:** basta con corregir la acción de escritura dentro de `RegistrarLog`; reinicia la ejecución completa solo para regenerar el log limpio.
- **Evidencia posterior a la corrección:** el log debe tener una fila por registro procesado, incluida la fila inválida.

### El bot se detiene sin ejecutar `CerrarRecursos` tras el error forzado

- **Causa probable:** falta un bloque de manejo de errores que enrute explícitamente al subflow de cierre.
- **Cómo comprobar:** fuerza de nuevo el error del paso 6 y observa si el flow termina en estado "fallido" sin pasar por `CerrarRecursos`.
- **Cómo corregir:** envuelve la llamada a `ProcesarRegistros` en "Ejecutar acciones y manejar errores" y en la rama de error invoca `CerrarRecursos` antes de finalizar.
- **Reiniciar vs. reparar:** repara el bloque de manejo de errores; no es necesario reiniciar el diseño completo del flow.
- **Evidencia posterior a la corrección:** captura de una ejecución fallida donde el log confirma que `CerrarRecursos` se ejecutó.

### Outputs del flow quedan en 0 o vacíos

- **Causa probable:** las variables se calculan como locales dentro de un subflow pero no se propagan como outputs declarados.
- **Cómo comprobar:** revisa la definición de variables de `Main` y confirma que `out_Total`, `out_Procesados`, `out_Errores` y `out_LogPath` estén marcadas como salida y asignadas tras cada subflow relevante.
- **Cómo corregir:** asigna explícitamente estas variables al final de `ProcesarRegistros` y `RegistrarLog`, y verifica que `Main` las reciba y las exponga como outputs del flow.
- **Reiniciar vs. reparar:** repara la asignación de variables; ejecuta el flow completo una vez para confirmar los valores finales.
- **Evidencia posterior a la corrección:** outputs con valores coherentes con el número de registros procesados.

### El log expone datos sensibles del registro

- **Causa probable:** se registra la fila completa (incluida `in_InputPath` o datos crudos) en vez de un resumen.
- **Cómo comprobar:** revisa el CSV de log y busca rutas de archivo completas, nombres o datos de negocio sin filtrar.
- **Cómo corregir:** cambia el logging para incluir solo `CorrelationId`, número de fila y tipo de error.
- **Reiniciar vs. reparar:** repara la plantilla de log dentro de `RegistrarLog`; no requiere reiniciar el flow.
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

---
id: lab-110
title: "RPA — Cloud flow + desktop flow end-to-end"
level: "RPA"
duration: 160
product: ["Power Automate Cloud", "Power Automate Desktop", "Machine Runtime", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "Power Platform Consultant"]
prerequisites:
  - "Módulo 75 completado"
  - "Power Automate cloud básico"
files: []
---

# LAB-RPA-07 — Cloud flow + desktop flow

## Objetivo

Recibir una solicitud desde Power Automate cloud, ejecutar PAD y devolver resultado con parámetros, máquina, respuesta, error, almacenamiento y notificación.

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
2. Define estados `Pendiente`, `EnEjecucion`, `Completado`, `Error`.
3. Crea cloud flow programado o manual.
4. Envía parameters al desktop flow.
5. Devuelve resultado estructurado.
6. Actualiza estado y notifica.
7. Simula máquina no disponible o error desktop.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El cloud flow queda "en espera" y nunca recibe respuesta del desktop flow | La conexión de PAD a la cuenta/máquina no está activa o el desktop flow no está publicado | Verifica el estado de la conexión de máquina en Power Automate y que el desktop flow tenga una versión publicada asociada al flow cloud |
| El desktop flow recibe parámetros vacíos o con tipo incorrecto | Los nombres de input del cloud flow no coinciden exactamente con los definidos en PAD, o falta el mapeo de tipo | Compara nombre y tipo de cada input/output entre el trigger del cloud flow y las variables de entrada de PAD; usa nombres idénticos y castea tipos explícitamente |
| El estado en la lista/tabla queda en `EnEjecucion` aunque PAD ya terminó | El desktop flow no devuelve el resultado al cloud flow (falta acción de salida) o el cloud flow no actualiza el registro tras recibir la respuesta | Confirma que PAD usa la acción de "Devolver valores" y que el cloud flow tiene un paso de actualización posterior al `Ejecutar un flujo de escritorio` |
| El run history no distingue error de máquina de error de negocio | El manejo de errores solo captura una excepción genérica en PAD sin clasificar la causa | Usa bloques `On block error` separados por tipo (máquina no disponible, selector no encontrado, dato inválido) y propaga un código de error distinto en cada salida |
| Simular "máquina no disponible" no genera ningún registro de error | El escenario de prueba no fuerza realmente la desconexión, o el cloud flow no tiene manejo de fallos configurado | Detén el runtime/agente de PAD antes de disparar la corrida, y agrega un `Configure run after` en el cloud flow para capturar el fallo de la acción de escritorio |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Cloud flow en espera sin respuesta de PAD

- **Causa probable:** conexión de máquina inactiva o desktop flow sin versión publicada.
- **Cómo comprobar:** revisa en Power Automate el estado de la conexión (`Conectado`/`Error`) y en PAD que el flow tenga al menos una versión publicada.
- **Cómo corregir:** reconecta la máquina, publica el desktop flow y vuelve a vincularlo en la acción `Ejecutar un flujo de escritorio`.
- **Reiniciar vs. reparar:** si la corrida lleva más de unos minutos "en espera", cancela y reinicia solo esa ejecución; no hace falta rehacer el diseño.
- **Evidencia posterior a la corrección:** captura del estado `Conectado` y de la corrida completada en el run history.

### Parámetros de entrada/salida vacíos o con tipo incorrecto

- **Causa probable:** desalineación de nombres/tipos entre el trigger del cloud flow y las variables de entrada de PAD.
- **Cómo comprobar:** compara campo por campo el payload enviado (panel de inputs del run history) contra las variables `%InputVariable%` declaradas en PAD.
- **Cómo corregir:** renombra o remapea los campos para que coincidan exactamente, incluyendo el tipo de dato (texto, número, booleano).
- **Reiniciar vs. reparar:** basta con corregir el mapeo y volver a ejecutar esa solicitud puntual; no es necesario reiniciar el lote completo.
- **Evidencia posterior a la corrección:** captura de los inputs/outputs correctos en una nueva corrida exitosa.

### Estado atascado en `EnEjecucion`

- **Causa probable:** PAD no devuelve resultado al cloud flow o falta el paso de actualización de estado tras la respuesta.
- **Cómo comprobar:** revisa si la acción `Ejecutar un flujo de escritorio` muestra outputs vacíos, y si existe un paso posterior que actualice la lista/tabla.
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
- **Cómo comprobar:** verifica si el agente/runtime de PAD sigue activo durante la prueba y si la acción del cloud flow tiene `Configure run after` habilitado para fallos.
- **Cómo corregir:** detén el runtime antes de disparar la corrida y configura la acción para continuar en caso de error, capturando el resultado.
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

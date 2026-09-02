---
id: lab-109
title: "RPA — Manejo de errores e idempotencia"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "Logging", "Idempotencia", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Support Analyst", "Automation Engineer"]
prerequisites:
  - "Módulo 74 completado"
  - "Conocimientos básicos de estados y claves únicas"
files: []
---

# LAB-RPA-06 — Manejo de errores e idempotencia

## Objetivo

Procesar registros sin duplicar operaciones después de un fallo parcial usando identificador único, checkpoint, retry, estados, recuperación y prueba de repetición.

## Escenario de negocio

El bot registra solicitudes en un portal. Si falla después de confirmar un registro, debe reanudar sin crear duplicados.

## Competencias desarrolladas

- Estados por registro
- Checkpoints
- Retry controlado
- Idempotencia
- Reanudación

## Ejercicios

1. Define clave única por registro.
2. Crea tabla o archivo de estado.
3. Marca `EnProceso` antes de acción con efecto.
4. Marca `Completado` solo después de validar confirmación.
5. Simula fallo parcial.
6. Reejecuta y demuestra que no duplica.
7. Documenta rollback o compensación.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Un registro queda duplicado tras reejecutar el bot | El estado se marca `Completado` antes de confirmar que la acción con efecto realmente se aplicó | Marca `Completado` solo después de validar la confirmación del sistema destino, nunca al enviar |
| El bot repite un registro que sí se procesó, pero falló al escribir el log | El checkpoint no se guarda de forma atómica junto con la confirmación | Escribe el estado y la confirmación en la misma operación, o valida contra el sistema destino antes de reintentar |
| El retry entra en bucle y no se detiene | No hay límite de reintentos ni distinción entre error transitorio y error definitivo | Define un máximo de reintentos y clasifica el error antes de decidir si reintenta |
| Tras un fallo parcial, la reejecución no sabe por dónde continuar | No existe una clave única por registro que permita identificar qué ya se procesó | Define una clave única (ID de negocio, hash) y consúltala antes de reprocesar |
| Un error esperado (dato inválido) se trata igual que un error técnico (timeout de conexión) | No hay clasificación de errores en la matriz de excepciones | Separa errores de negocio (van a cola de revisión) de errores técnicos (van a retry) |
| Al cerrar la app tras un fallo, quedan procesos colgados que bloquean la siguiente corrida | El cierre no es forzado ni verificado tras una excepción | Agrega cierre seguro (kill de proceso si no responde) y verifica que no queden instancias antes de reanudar |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Registro duplicado tras reejecución

- **Causa probable:** el estado `Completado` se escribe antes de tener confirmación real de la acción con efecto (por ejemplo, al enviar el formulario en vez de al validar la respuesta).
- **Cómo comprobar:** compara la marca de tiempo del estado `Completado` contra la marca de tiempo de la confirmación en el log del sistema destino.
- **Cómo corregir:** mueve la transición a `Completado` para que ocurra solo después de validar la confirmación explícita.
- **Reiniciar vs. reparar:** si ya hay duplicados creados, hay que reiniciar el caso con limpieza/reconciliación de los duplicados; si es un ajuste antes de que ocurra el daño, basta con corregir el subflujo de estados.
- **Evidencia posterior a la corrección:** prueba de no duplicidad reejecutando el caso `duplicates.csv` y mostrando un solo registro final.

### Reintento de un registro ya procesado por fallo de logging

- **Causa probable:** la acción con efecto se completó, pero el checkpoint no se persistió antes de que el bot se interrumpiera.
- **Cómo comprobar:** revisa `partial_processed.csv` y compara contra el estado real en el sistema destino para ese `runId`.
- **Cómo corregir:** valida contra el sistema destino (no solo contra el checkpoint local) antes de reintentar un registro marcado como pendiente.
- **Reiniciar vs. reparar:** repara la lógica de verificación previa al retry; reinicia el caso solo si el registro ya quedó duplicado.
- **Evidencia posterior a la corrección:** log antes/después mostrando que el registro no se reenvía tras la verificación.

### Retry en bucle sin detenerse

- **Causa probable:** no hay contador de reintentos ni clasificación entre error transitorio y error definitivo.
- **Cómo comprobar:** revisa el `run history sample` y cuenta cuántos reintentos consecutivos ocurrieron para el mismo registro.
- **Cómo corregir:** define un máximo de reintentos explícito y clasifica el error (transitorio vs. definitivo) antes de decidir si reintenta.
- **Reiniciar vs. reparar:** repara la lógica de retry; reinicia el caso solo si el bucle ya dejó datos en estado inconsistente.
- **Evidencia posterior a la corrección:** log mostrando el límite de reintentos respetado y el registro movido a error definitivo.

### Reejecución no sabe por dónde continuar tras fallo parcial

- **Causa probable:** falta una clave única por registro, por lo que el bot no puede distinguir qué ya se procesó de lo pendiente.
- **Cómo comprobar:** intenta reconciliar manualmente `partial_processed.csv` contra el archivo de entrada sin una clave clara.
- **Cómo corregir:** define una clave única (ID de negocio o hash del registro) y consulta la tabla/archivo de estado por esa clave antes de reprocesar.
- **Reiniciar vs. reparar:** este es un caso típico donde conviene reiniciar la corrida completa con el `runId` nuevo una vez definida la clave, para partir de un estado consistente.
- **Evidencia posterior a la corrección:** matriz de estados con clave única poblada para el 100% de los registros.

### Error de negocio tratado como error técnico

- **Causa probable:** la matriz de excepciones no distingue entre datos inválidos (esperado) y fallas de conexión/timeout (técnico).
- **Cómo comprobar:** revisa la plantilla de matriz de excepciones y verifica si cada error tiene una categoría asignada.
- **Cómo corregir:** separa el manejo: errores de negocio van a una cola de revisión manual, errores técnicos entran al flujo de retry con backoff.
- **Reiniciar vs. reparar:** ajusta la clasificación en el subflujo de manejo de errores; no requiere reiniciar el caso.
- **Evidencia posterior a la corrección:** RCA mostrando ambos tipos de error clasificados por separado.

### Procesos colgados tras cierre inseguro

- **Causa probable:** el cierre de la aplicación no verifica que el proceso realmente haya terminado tras una excepción.
- **Cómo comprobar:** revisa el administrador de tareas (o el log de cierre) después de forzar un fallo parcial simulado.
- **Cómo corregir:** agrega cierre seguro con verificación (kill forzado si el proceso no responde en un tiempo definido) antes de iniciar la siguiente corrida.
- **Reiniciar vs. reparar:** reinicia el equipo/sesión solo si hay procesos huérfanos bloqueando recursos; si no, basta con reparar el subflujo de cierre.
- **Evidencia posterior a la corrección:** runbook de recuperación con el paso de verificación de cierre documentado y probado.

## Evidencia esperada

- Matriz de estados
- Log antes/después de reejecución
- Prueba de no duplicidad
- RCA del fallo parcial
- Runbook de recuperación

## Criterios de aprobación

- No hay reintentos infinitos.
- La reejecución no repite operaciones completadas.
- Los errores esperados no se mezclan con errores técnicos.
- El cierre seguro de aplicaciones está probado.

## Assets reproducibles

- Casos de error: [duplicados](../practice-assets/rpa/sit-automation-case/corrupted/duplicates.csv) y [procesamiento parcial](../practice-assets/rpa/sit-automation-case/corrupted/partial_processed.csv).
- Plantillas: [matriz de excepciones](../practice-assets/rpa/sit-automation-case/templates/matriz-excepciones.md) y [RCA](../practice-assets/rpa/sit-automation-case/templates/rca.md).
- Logs de referencia: [run history sample](../practice-assets/rpa/sit-automation-case/logs/run_history_sample.csv).
- Reset: limpia tu checkpoint local o cambia el `runId` antes de probar una corrida nueva.
- Variante sin tenant: demuestra idempotencia con archivos locales y evidencia de reconciliación.

## Reto adicional

Agrega backoff progresivo solo para errores transitorios.

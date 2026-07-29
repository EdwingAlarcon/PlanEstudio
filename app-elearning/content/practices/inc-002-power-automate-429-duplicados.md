---
id: INC-002
title: "Power Automate: 429 intermitente y duplicados en reintentos"
practiceType: incident
domain: support-troubleshooting
roles: ["support-analyst", "maker", "administrator"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [11, 16, 26]
  labs: ["LAB-005", "LAB-092"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate", "Dataverse", "Run history"]
skills: ["throttling", "retry-policy", "idempotency", "concurrency", "alternate-keys", "correlation"]
evidence:
  required: ["incident-report", "execution-log", "root-cause-analysis", "test-results"]
  optional: ["diagram", "runbook"]
  format: "RCA con tabla de ejecuciones, hipótesis, cambio mínimo y prueba de no duplicidad."
  qualityCriteria: ["Usa clave idempotente", "No propone reintentos infinitos", "Incluye prevención y monitoreo"]
  sensitiveDataWarning: "No pegues run history con tokens, URLs internas o datos personales."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Separa síntomas de causas"
    content: "No asumas que 429 y duplicados tienen una única causa; analiza concurrencia, reintentos e idempotencia."
  - id: hint-2
    level: tool
    title: "Observa el historial del flujo"
    content: "Revisa run history, política de retry, concurrencia del trigger y acciones que escriben en Dataverse."
  - id: hint-3
    level: hypothesis
    title: "Busca escrituras repetidas"
    content: "Un flujo sin clave de idempotencia puede crear registros duplicados cuando un retry repite una operación parcialmente exitosa."
  - id: hint-4
    level: near-solution
    title: "Diseña control de repetición"
    content: "Propón clave natural, upsert o verificación previa, y ajusta concurrencia/retry con validación de regresión."
rubric:
  - criterion: "Reproducción y delimitación"
    weight: 10
  - criterion: "Diagnóstico estructurado"
    weight: 15
  - criterion: "Uso de evidencia"
    weight: 15
  - criterion: "Calidad de hipótesis"
    weight: 10
  - criterion: "Identificación de causa raíz"
    weight: 15
  - criterion: "Corrección técnica"
    weight: 15
  - criterion: "Validación y regresión"
    weight: 10
  - criterion: "Documentación y comunicación"
    weight: 10
---

## Contexto

Un flujo de producción crea registros `sit_NotificacionCliente` cuando una solicitud cambia a Aprobada. Durante picos de carga aparecen errores 429 y algunos clientes reciben dos notificaciones.

Los logs siguientes son simulados para entrenamiento.

## Síntoma reportado

"El flujo falla a veces por demasiadas solicitudes y luego aparecen registros duplicados cuando Power Automate reintenta."

## Impacto y severidad

- Severidad sugerida: S2 si hay comunicación externa duplicada.
- Entorno: producción.
- Frecuencia: 8-12 fallos diarios durante cierre de mes.

## Evidencia inicial simulada

```json
{
  "flow": "SIT - Notificar aprobación",
  "trigger": "Dataverse row modified",
  "correlationId": "sim-2026-07-INC002-441",
  "failedAction": "Create_row_NotificacionCliente",
  "httpStatus": 429,
  "retryCount": 3,
  "duplicateRecords": ["NOT-7731", "NOT-7732"],
  "sourceRequest": "SOL-2048"
}
```

## Historial de cambios

- Se activó concurrency control en el trigger con grado 25.
- Se agregó una rama paralela para notificación por email y Dataverse.
- No existe alternate key en `sit_NotificacionCliente`.
- El flujo usa `Create row` sin verificar si ya existe notificación para `Solicitud + Tipo`.

## Criterios de aceptación

- Identificas si el problema principal es throttling, concurrencia, falta de idempotencia o mezcla de ambos.
- Diseñas una clave idempotente.
- Ajustas retry/concurrency sin ocultar el error.
- Propones monitoreo de duplicados y 429.
- Validación demuestra que dos reintentos no crean dos registros.

## Evidencias requeridas

- Tabla de run history resumida.
- Diseño de clave alterna o patrón de upsert.
- Resultado de prueba con reintento simulado.
- RCA.

## Solución de referencia

Causa raíz: el flujo no es idempotente. El 429 explica fallos intermitentes, pero los duplicados aparecen porque cada reintento ejecuta `Create row` sin clave natural ni verificación previa.

Corrección mínima segura:

- Crear alternate key en `sit_NotificacionCliente` con `sit_solicitudid + sit_tiponotificacion`.
- Cambiar creación por upsert o búsqueda previa con control de concurrencia razonable.
- Reducir concurrency del trigger a un nivel que el conector soporte en el tenant.
- Mantener retry policy acotada con backoff.
- Registrar `correlationId` de la solicitud para auditoría.
- Agregar vista operativa de duplicados por solicitud y tipo.

Prevención: todo flujo con efectos externos debe declarar criterio de idempotencia antes de pasar a producción.

---
id: INC-RPA-008
title: "Procesamiento parcial deja datos inconsistentes"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-developer", "automation-engineer", "solution-architect"]
difficulty: expert
estimatedEffort: medium
prerequisites:
  modules: [73, 75]
  labs: ["LAB-109", "LAB-112"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Power Automate Cloud", "Dataverse or files"]
skills: ["logical-transaction", "compensation", "rollback", "reconciliation"]
evidence:
  required: ["incident-report", "root-cause-analysis", "reconciliation-report", "rollback-plan", "test-results"]
  optional: ["runbook", "diagram"]
  format: "RCA con transacción lógica, compensación y reconciliación."
  qualityCriteria: ["No oculta parcialidad", "Define compensación", "Incluye prevención"]
  sensitiveDataWarning: "Usa datos ficticios."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "No todo es rollback físico"
    content: "En sistemas UI puede que necesites compensación."
  - id: hint-2
    level: tool
    title: "Reconciliación"
    content: "Compara origen, destino y estado del bot."
  - id: hint-3
    level: hypothesis
    title: "Confirmación incompleta"
    content: "El bot actualizó origen pero no destino, o al revés."
  - id: hint-4
    level: near-solution
    title: "Transacción lógica"
    content: "Declara checkpoints, compensaciones y reporte de diferencias."
rubric:
  - criterion: "Reproducción"
    weight: 10
  - criterion: "Evidencia"
    weight: 15
  - criterion: "Hipótesis"
    weight: 10
  - criterion: "Causa raíz"
    weight: 20
  - criterion: "Corrección"
    weight: 15
  - criterion: "Validación"
    weight: 10
  - criterion: "Prevención"
    weight: 10
  - criterion: "Comunicación"
    weight: 10
---

## Severidad e impacto

S2 si deja datos inconsistentes entre portal, archivo y Dataverse.

## Síntoma

"Algunos registros figuran como procesados en origen, pero no aparecen en destino."

## Evidencia y cambios recientes

El flujo marca registros como completados antes de validar confirmación final.

## Hipótesis

Checkpoint prematuro, falta de transacción lógica, compensación inexistente o validación final ausente.

## Pistas

Define qué significa completado y cómo reconciliar origen/destino.

## Criterios de aceptación

- Identificas punto de inconsistencia.
- Propones compensación o rollback.
- Validación incluye reporte de reconciliación.
- Prevención cambia orden de checkpoints.

## Solución de referencia

Causa raíz: estado `Completado` se escribe antes de confirmar destino. Solución: usar estado `EnProceso`, confirmar destino, actualizar origen, reconciliar diferencias y compensar registros parciales. Prevención: diseño de transacción lógica y pruebas de fallo entre sistemas.

## Respuesta de cierre

Los registros parciales fueron reconciliados y el flujo ahora valida resultado antes de cerrar estado.

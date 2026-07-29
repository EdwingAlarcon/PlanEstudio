---
id: INC-RPA-004
title: "Registros duplicados por reintento"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-developer", "automation-engineer", "support-analyst"]
difficulty: expert
estimatedEffort: medium
prerequisites:
  modules: [73, 74]
  labs: ["LAB-109", "LAB-110"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Power Automate Cloud", "Dataverse or files"]
skills: ["idempotency", "checkpoints", "retry", "alternate-keys"]
evidence:
  required: ["incident-report", "root-cause-analysis", "reconciliation-report", "test-results"]
  optional: ["diagram", "runbook"]
  format: "RCA con prueba de reejecución sin duplicados."
  qualityCriteria: ["Define clave", "Controla retry", "Incluye reconciliación"]
  sensitiveDataWarning: "No uses registros reales."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "Mira el efecto externo"
    content: "El duplicado aparece donde hay escritura sin clave idempotente."
  - id: hint-2
    level: tool
    title: "Estados"
    content: "Revisa si existe checkpoint antes y después de registrar."
  - id: hint-3
    level: hypothesis
    title: "Retry repitió escritura"
    content: "El retry no sabe que la operación anterior sí tuvo efecto."
  - id: hint-4
    level: near-solution
    title: "Upsert o verificación previa"
    content: "Usa clave natural, estado persistente y retry acotado."
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

S2 si duplica operaciones financieras o comunicaciones externas.

## Síntoma

"Después de un fallo parcial aparecen dos registros para la misma solicitud."

## Evidencia y cambios recientes

Se activó retry automático. No existe clave única por solicitud y tipo de operación.

## Hipótesis

Ausencia de idempotencia, checkpoint tardío, retry global o estado no persistente.

## Pistas

Busca dónde se registra el efecto externo y qué pasa si el flujo cae justo después.

## Criterios de aceptación

- Reproduces duplicado.
- Diseñas clave idempotente.
- Corriges retry/control de estado.
- Validación demuestra no duplicidad.

## Solución de referencia

Causa raíz: retry repite una acción ya confirmada porque no hay clave idempotente ni checkpoint. Solución: clave natural, verificación previa/upsert, estado `Completado` después de confirmación y retry solo para transitorios. Prevención: toda acción con efecto externo exige criterio de idempotencia.

## Respuesta de cierre

Se aplicó control de duplicidad y se agregó reconciliación semanal.

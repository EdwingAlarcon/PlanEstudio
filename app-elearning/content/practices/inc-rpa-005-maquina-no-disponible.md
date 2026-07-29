---
id: INC-RPA-005
title: "Máquina no disponible"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-operations-specialist", "administrator", "support-analyst"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [67, 74, 75]
  labs: ["LAB-111"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Machine Runtime", "Power Automate", "PPAC"]
skills: ["machine-runtime", "capacity", "connectivity", "escalation"]
evidence:
  required: ["incident-report", "execution-log", "root-cause-analysis", "runbook"]
  optional: ["deployment-plan"]
  format: "RCA con checklist de máquina, grupo, runtime, sesión y conectividad."
  qualityCriteria: ["Distingue capacidad/conectividad/sesión", "Incluye escalamiento", "Actualiza runbook"]
  sensitiveDataWarning: "No publiques nombres reales de máquinas o cuentas."
  artifactTypes: ["simulated", "sandbox-reproducible", "requires-license"]
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "No es solo el flujo"
    content: "La máquina puede estar apagada, ocupada, desconectada o sin capacidad."
  - id: hint-2
    level: tool
    title: "Runtime"
    content: "Revisa estado de machine runtime y conectividad."
  - id: hint-3
    level: hypothesis
    title: "Capacidad ocupada"
    content: "Un bot unattended ocupado puede bloquear ejecuciones paralelas."
  - id: hint-4
    level: near-solution
    title: "Grupo y fallback"
    content: "Define machine group o plan de contingencia si aplica."
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

S2 si detiene un lote operativo con SLA.

## Síntoma

"El cloud flow no puede iniciar el desktop flow porque la máquina no está disponible."

## Evidencia y cambios recientes

La VM fue reiniciada por mantenimiento. No existe fallback documentado.

## Hipótesis

Máquina apagada, runtime detenido, conectividad, sesión bloqueada, capacidad ocupada, credencial expirada o grupo mal configurado.

## Pistas

Consulta estado de máquina, grupo y ejecución previa antes de editar el desktop flow.

## Criterios de aceptación

- Clasificas causa.
- Definiste escalamiento.
- Propones prevención.
- Validación no depende de producción.

## Solución de referencia

Causa raíz: machine runtime detenido tras reinicio y ausencia de health check. Solución: reiniciar runtime, validar conexión, reprogramar ejecución y actualizar runbook. Prevención: monitoreo de máquina, ventana de mantenimiento y fallback.

## Respuesta de cierre

La máquina volvió a estar disponible, se reejecutó el lote y se agregó monitoreo preventivo.

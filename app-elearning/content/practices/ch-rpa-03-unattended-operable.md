---
id: CH-RPA-03
title: "Automatización unattended operable"
practiceType: challenge
domain: rpa-desktop-automation
roles: ["rpa-developer", "rpa-operations-specialist", "solution-architect"]
difficulty: expert
estimatedEffort: long
prerequisites:
  modules: [67, 74, 75]
  labs: ["LAB-110", "LAB-111"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Power Automate Cloud", "Power Automate Desktop", "Machine Runtime", "Solutions"]
skills: ["unattended-rpa", "machine-groups", "monitoring", "rollback", "governance"]
evidence:
  required: ["deployment-plan", "rollback-plan", "runbook", "test-plan", "execution-log"]
  optional: ["diagram", "security-matrix", "presentation"]
  format: "Diseño operable con variante real o simulada de unattended."
  qualityCriteria: ["Distingue licencia real de simulación", "Protege credenciales", "Incluye monitoreo", "Tiene rollback"]
  sensitiveDataWarning: "No documentes contraseñas ni secretos de conexión."
  artifactTypes: ["simulated", "sandbox-reproducible", "requires-license"]
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Operación antes que demo"
    content: "Una ejecución programada sin monitoreo no es una solución operable."
  - id: hint-2
    level: tool
    title: "Máquina y conexión"
    content: "Revisa máquina, grupo, conexión, usuario, sesión y capacidad."
  - id: hint-3
    level: hypothesis
    title: "Licencia condiciona evidencia"
    content: "Si no tienes unattended, documenta simulación y no la marques como validada."
  - id: hint-4
    level: near-solution
    title: "Runbook completo"
    content: "Incluye bloqueo de sesión, recuperación, soporte, escalamiento y calendario de mantenimiento."
rubric:
  - criterion: "Cumplimiento funcional"
    weight: 20
  - criterion: "Diseño mantenible"
    weight: 15
  - criterion: "Selectores y sincronización"
    weight: 10
  - criterion: "Manejo de errores"
    weight: 15
  - criterion: "Idempotencia y datos"
    weight: 10
  - criterion: "Seguridad"
    weight: 10
  - criterion: "Testing"
    weight: 10
  - criterion: "Evidencia y documentación"
    weight: 10
---

## Contexto

Diseña una solución que se ejecute programadamente, utilice cloud y desktop, maneje cola o lote de trabajo, registre estados, proteja credenciales, tenga logging, reintentos controlados, runbook, rollback y monitoreo.

## Criterios de aceptación

- La solución separa attended, unattended y simulación.
- La máquina y la cuenta están documentadas.
- La ejecución tiene estado, alertas y soporte.
- El rollback no depende del desarrollador original.

## Solución de referencia

Cloud flow programado, tabla de trabajo, desktop flow parametrizado, machine group si aplica, logs por correlation ID, runbook y deployment controlado por solución.

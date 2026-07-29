---
id: INC-RPA-007
title: "Portal lento y timeout"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-developer", "support-analyst", "rpa-operations-specialist"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [70, 72, 73]
  labs: ["LAB-106", "LAB-108"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Browser Automation", "Run history"]
skills: ["waits", "polling", "timeouts", "async-ui", "evidence"]
evidence:
  required: ["incident-report", "execution-log", "root-cause-analysis", "test-results"]
  optional: ["screenshot", "runbook"]
  format: "RCA diferenciando lentitud, timeout y selector roto."
  qualityCriteria: ["Usa polling", "No aumenta timeout sin criterio", "Incluye límites"]
  sensitiveDataWarning: "No incluyas capturas de portales reales con datos sensibles."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "Mide primero"
    content: "Un timeout puede ser síntoma, no causa."
  - id: hint-2
    level: tool
    title: "Wait por estado"
    content: "Espera elemento o texto de carga finalizada."
  - id: hint-3
    level: hypothesis
    title: "Carga asincrónica"
    content: "La tabla existe pero los datos todavía no cargaron."
  - id: hint-4
    level: near-solution
    title: "Retry acotado"
    content: "Combina polling con timeout máximo y evidencia antes de fallar."
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

S3 si retrasa lote; S2 si incumple SLA.

## Síntoma

"El portal responde lento y PAD falla por timeout al leer la tabla."

## Evidencia y cambios recientes

El proveedor reportó mantenimiento. El flujo usa espera fija de 5 segundos.

## Hipótesis

Carga asincrónica, selector válido pero datos tardíos, pop-up, throttling del portal o caída parcial.

## Pistas

Agrega espera por condición de negocio y evidencia de pantalla final.

## Criterios de aceptación

- Diferencias lentitud vs selector roto.
- Implementas polling con límite.
- Documentas cuándo escalar al proveedor.
- Validación incluye caso lento.

## Solución de referencia

Causa raíz: espera fija insuficiente ante carga asincrónica. Solución: polling por estado/tabla cargada con timeout máximo, captura controlada al fallar y retry acotado. Prevención: métricas de tiempo de respuesta y umbral de escalamiento.

## Respuesta de cierre

Se reemplazó pausa fija por sincronización por estado y se actualizó runbook de portal lento.

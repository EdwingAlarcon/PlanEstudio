---
id: CH-RPA-01
title: "Consolidación financiera automatizada"
practiceType: challenge
domain: rpa-desktop-automation
roles: ["rpa-developer", "automation-engineer", "functional-consultant"]
difficulty: advanced
estimatedEffort: long
prerequisites:
  modules: [66, 69, 73]
  labs: ["LAB-105"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Excel", "Archivos"]
skills: ["excel-automation", "deduplication", "idempotency", "validation", "runbook"]
evidence:
  required: ["test-plan", "test-results", "execution-log", "reconciliation-report", "runbook"]
  optional: ["diagram", "demo-video", "retrospective"]
  format: "Paquete con matriz de entrada, reporte consolidado, log, pruebas y runbook."
  qualityCriteria: ["Valida columnas", "Evita reprocesamiento", "Separa errores de datos", "No usa Excel como base de datos productiva"]
  sensitiveDataWarning: "Usa archivos ficticios; no subas datos financieros reales."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "Empieza por la viabilidad"
    content: "Antes de automatizar, decide qué controles evitan duplicados y qué errores se rechazan."
  - id: hint-2
    level: tool
    title: "Usa estructura de carpetas"
    content: "Entrada, procesado, error y salida ayudan a probar reejecución."
  - id: hint-3
    level: hypothesis
    title: "La clave importa"
    content: "Una clave por sucursal, fecha y documento suele ser más útil que solo el nombre del archivo."
  - id: hint-4
    level: near-solution
    title: "Defiende no usar Excel como base"
    content: "Excel puede ser entrada y reporte; el registro maestro debería vivir en Dataverse, SQL u otro repositorio gobernado."
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

Una empresa recibe archivos Excel de varias sucursales con formatos inconsistentes. Debes analizar entradas, definir reglas, validar columnas, consolidar, detectar duplicados, registrar errores, producir reporte, evitar procesamiento repetido y diseñar operación.

## Criterios de aceptación

- La solución rechaza archivos con estructura inválida sin detener todo el lote.
- La reejecución no duplica registros.
- El reporte separa válidos, inválidos y duplicados.
- El runbook explica recuperación y soporte.

## Límites

No se entregan instrucciones detalladas. Puedes resolver con PAD real o simulación documentada.

## Solución de referencia

Usa staging por archivo, clave idempotente por registro, carpeta de procesados, reporte de reconciliación y cierre seguro de Excel.

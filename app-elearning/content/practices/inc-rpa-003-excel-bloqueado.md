---
id: INC-RPA-003
title: "Excel queda bloqueado"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-developer", "support-analyst", "rpa-operations-specialist"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [69, 73]
  labs: ["LAB-105", "LAB-109"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Excel", "Task Manager"]
skills: ["excel-cleanup", "file-locks", "exception-handling", "recovery"]
evidence:
  required: ["incident-report", "execution-log", "root-cause-analysis", "test-results"]
  optional: ["runbook"]
  format: "RCA con reproducción de archivo bloqueado y validación de cleanup."
  qualityCriteria: ["Cierra instancias", "No mata procesos indiscriminadamente", "Incluye recuperación"]
  sensitiveDataWarning: "Usa libros ficticios."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "Sigue el handle"
    content: "Averigua qué instancia mantiene el archivo abierto."
  - id: hint-2
    level: tool
    title: "Revisa cleanup"
    content: "El cierre debe ejecutarse aunque falle la validación."
  - id: hint-3
    level: hypothesis
    title: "Instancia huérfana"
    content: "Un error antes de cerrar Excel deja proceso vivo."
  - id: hint-4
    level: near-solution
    title: "Cierre controlado"
    content: "Guarda/cierra instancia específica y mueve archivo a error si no puede liberarse."
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

S3 si bloquea reproceso; S2 si detiene cierre financiero.

## Síntoma

"El archivo queda en uso y la siguiente ejecución falla."

## Evidencia y cambios recientes

Se agregó validación nueva antes del cierre del libro. Aparecen procesos Excel sin ventana visible.

## Hipótesis

Instancia no cerrada por rama de error, archivo abierto por usuario, antivirus escaneando, o referencia a libro equivocado.

## Pistas

Revisa si el bloque de cleanup se ejecuta en éxito, error y cancelación.

## Criterios de aceptación

- Reproduces bloqueo.
- Identificas si es usuario, instancia o flujo.
- Corriges cierre seguro.
- Validación prueba tres ejecuciones consecutivas.

## Solución de referencia

Causa raíz: el flujo sale por rama de error antes de cerrar la instancia de Excel. Solución: subflow de cleanup invocado por éxito y fallo, cierre de instancia específica, espera de liberación de archivo y movimiento a carpeta `error` si no se libera. Prevención: prueba de archivo bloqueado en UAT.

## Respuesta de cierre

Cleanup validado, archivos bloqueados reportan estado recuperable y no detienen todo el lote.

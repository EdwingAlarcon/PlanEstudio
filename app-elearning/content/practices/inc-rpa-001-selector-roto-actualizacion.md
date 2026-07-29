---
id: INC-RPA-001
title: "Selector roto después de actualización"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-developer", "rpa-operations-specialist", "support-analyst"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [72]
  labs: ["LAB-108"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Selector builder", "Run history"]
skills: ["selectors", "regression", "waits", "root-cause-analysis"]
evidence:
  required: ["incident-report", "execution-log", "root-cause-analysis", "test-results"]
  optional: ["runbook", "screenshot"]
  format: "RCA con selector antes/después, hipótesis y validación de regresión."
  qualityCriteria: ["No cambia todo sin aislar", "Usa selector alternativo", "Incluye prevención"]
  sensitiveDataWarning: "Anonimiza nombres internos de aplicación."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "No culpes al botón todavía"
    content: "Distingue si no existe, tarda en aparecer o cambió el atributo."
  - id: hint-2
    level: tool
    title: "Prueba selector"
    content: "Usa la prueba de selector antes de editar acciones."
  - id: hint-3
    level: hypothesis
    title: "Versión dinámica"
    content: "Un atributo con versión o timestamp suele romperse tras actualización."
  - id: hint-4
    level: near-solution
    title: "Alternativo ordenado"
    content: "Crea selector menos frágil y deja una prueba de regresión."
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

S2 si bloquea lote diario. Entorno TEST o PROD simulado. El flujo ya no encuentra un botón después de actualización.

## Síntoma

"La aplicación fue actualizada y el flujo ya no encuentra un botón."

## Evidencia y cambios recientes

Run history muestra fallo en acción Click UI element. La versión visual del botón cambió. No hay caída de red.

## Hipótesis

Selector demasiado específico, elemento tarda más, ventana padre cambió o hay duplicado de elemento.

## Pistas

Revisa atributos dinámicos, selector alternativo y espera por estado.

## Criterios de aceptación

- Reproduces el fallo.
- Identificas causa raíz.
- Corriges selector sin ampliar demasiado.
- Validación cubre pantalla anterior y nueva.

## Solución de referencia

Causa raíz: selector capturó atributo dinámico de versión. Solución: remover atributo volátil, delimitar por ventana padre, agregar selector alternativo y wait por visibilidad. Prevención: prueba de selectores después de releases de proveedor y registro de dependencias UI.

## Respuesta de cierre

Se actualizó selector, se validaron tres ejecuciones y se programó revisión mensual de UI elements.

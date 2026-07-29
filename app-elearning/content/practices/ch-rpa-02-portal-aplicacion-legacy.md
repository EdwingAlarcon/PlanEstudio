---
id: CH-RPA-02
title: "Automatización de portal y aplicación legacy"
practiceType: challenge
domain: rpa-desktop-automation
roles: ["rpa-developer", "automation-engineer", "rpa-operations-specialist"]
difficulty: expert
estimatedEffort: long
prerequisites:
  modules: [70, 71, 72, 73]
  labs: ["LAB-106", "LAB-107", "LAB-108"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Browser Automation", "UI Automation"]
skills: ["web-automation", "legacy-apps", "selectors", "exception-handling", "evidence"]
evidence:
  required: ["diagram", "execution-log", "test-results", "root-cause-analysis", "runbook"]
  optional: ["demo-video", "rollback-plan"]
  format: "Diseño y evidencia de una solución simulada o real controlada."
  qualityCriteria: ["Permite simulación", "No depende solo de coordenadas", "Maneja excepciones", "Evita duplicados"]
  sensitiveDataWarning: "No automatices portales reales sin permiso ni uses cuentas personales."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "Divide frontera web y legacy"
    content: "No mezcles extracción, validación y registro en una única cadena opaca."
  - id: hint-2
    level: tool
    title: "Selectores primero"
    content: "Prueba selectores web y Windows por separado antes de conectarlos."
  - id: hint-3
    level: hypothesis
    title: "La recuperación define calidad"
    content: "El diseño debe saber qué hacer si descarga bien pero el registro legacy falla."
  - id: hint-4
    level: near-solution
    title: "Estado persistente"
    content: "Un estado por solicitud evita duplicar cuando reanudas después de excepción."
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

Debes descargar solicitudes de un portal, validarlas, registrarlas en una aplicación de escritorio, actualizar estado, manejar excepciones, generar evidencia, evitar duplicados y diseñar recuperación.

## Criterios de aceptación

- Existe solución completamente simulada si no hay sistemas empresariales.
- La automatización valida antes y después de registrar.
- Las excepciones quedan clasificadas.
- La evidencia permite defender el diseño sin afirmar experiencia productiva.

## Solución de referencia

Orquestación con estado externo, selectores mantenibles, contrato de evidencia por solicitud y recuperación desde último checkpoint válido.

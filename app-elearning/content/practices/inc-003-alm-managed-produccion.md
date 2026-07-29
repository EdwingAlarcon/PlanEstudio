---
id: INC-003
title: "ALM: solución funciona en desarrollo pero falla como managed"
practiceType: incident
domain: alm-deployment-operations
roles: ["administrator", "power-platform-developer", "solution-architect"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [19, 24, 54]
  labs: ["LAB-019", "LAB-055"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Solutions", "Pipelines", "Environment Variables", "Connection References"]
skills: ["managed-solutions", "dependencies", "environment-variables", "connection-references", "rollback", "postdeploy-validation"]
evidence:
  required: ["incident-report", "deployment-plan", "rollback-plan", "test-results", "root-cause-analysis"]
  optional: ["solution-checker", "execution-log"]
  format: "Informe de despliegue con dependencia faltante, decisión de rollback/corrección y validación postdeploy."
  qualityCriteria: ["No edita producción directamente", "Incluye plan de rollback", "Distingue unmanaged vs managed layers"]
  sensitiveDataWarning: "No incluyas connection strings ni nombres reales de ambientes productivos."
solutionAvailability: after-attempt
coverageState: partial
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

La solución `SIT Case Automation` funciona en desarrollo. Al importarla como administrada en producción, una nube de flujo queda apagada y la app model-driven muestra error al abrir la página de configuración.

## Síntoma reportado

"En DEV todo está bien; en PROD la solución importó sin error crítico, pero el flujo no arranca y una pantalla no resuelve variables."

## Evidencia inicial simulada

| Elemento | Observación |
|---|---|
| Solution import | Warning por connection reference no configurada |
| Environment variable | `sit_ServiceDeskQueueId` sin current value en PROD |
| Managed layer | Existe parche administrado anterior con formulario antiguo |
| Flow | Estado Off después de importación |
| Validación postdeploy | No se ejecutó checklist |

## Historial de cambios

- Se agregó una environment variable en DEV.
- Se exportó la solución sin incluir connection reference nueva.
- Se importó sobre una versión administrada previa.

## Criterios de aceptación

- Identificas dependencia o current value faltante.
- Propones corrección vía solución/pipeline, no edición manual permanente en producción.
- Decides si conviene rollback o hotfix controlado.
- Documentas validación postdeploy.
- Incluyes prevención para futuros imports managed.

## Evidencias requeridas

- Plan de despliegue corregido.
- Plan de rollback.
- Matriz de validación postdeploy.
- RCA.

## Solución de referencia

Causa raíz: la solución no transportó o no configuró correctamente connection references/current values requeridos, y el equipo no ejecutó validación postdeploy. El managed layer previo puede explicar diferencias visuales, pero no debe asumirse antes de revisar dependencias.

Corrección mínima segura:

- Completar current value de environment variables mediante configuración de deployment settings.
- Incluir connection references en la solución o pipeline.
- Reimportar versión corregida o aplicar hotfix administrado si el impacto permite esperar.
- Ejecutar validación: flujo encendido, conexión autorizada, app abre configuración, prueba funcional end-to-end.
- Si hay impacto crítico, rollback a versión administrada anterior documentando pérdida funcional.

Prevención: todo release debe incluir deployment settings, solución checker, dependencias y checklist postdeploy firmado.

---
id: INC-RPA-006
title: "Flujo desplegado con configuración incorrecta"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-developer", "administrator", "solution-architect"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [75]
  labs: ["LAB-111", "LAB-112"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Solutions", "Environment Variables", "Connection References"]
skills: ["alm", "environment-variables", "connection-references", "postdeploy-validation"]
evidence:
  required: ["incident-report", "root-cause-analysis", "deployment-plan", "rollback-plan", "test-results"]
  optional: ["runbook"]
  format: "RCA de configuración por ambiente con validación postdeploy."
  qualityCriteria: ["No cambia PROD directo", "Identifica variable/referencia", "Incluye rollback"]
  sensitiveDataWarning: "No incluyas secretos ni URLs internas reales."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "Busca hardcode"
    content: "Rutas, URLs y credenciales suelen filtrarse desde DEV."
  - id: hint-2
    level: tool
    title: "Solución"
    content: "Revisa variables de entorno y connection references."
  - id: hint-3
    level: hypothesis
    title: "Ruta de DEV"
    content: "El flow importado puede seguir apuntando a carpeta local del desarrollador."
  - id: hint-4
    level: near-solution
    title: "Postdeploy"
    content: "Corrige configuración en TEST y agrega checklist antes de promover."
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

S2 si bloquea UAT o ejecución productiva.

## Síntoma

"El bot importado a TEST escribe en la carpeta de DEV y usa conexión equivocada."

## Evidencia y cambios recientes

Se importó solución sin completar variables de entorno ni validar connection references.

## Hipótesis

Variable faltante, referencia a conexión incorrecta, ruta hardcodeada, credencial de usuario maker o componente fuera de solución.

## Pistas

No edites producción directamente; valida configuración en ambiente destino.

## Criterios de aceptación

- Identificas dependencia rota.
- Corriges con configuración por ambiente.
- Actualizas deployment checklist.
- Defines rollback.

## Solución de referencia

Causa raíz: rutas y conexión quedaron hardcodeadas desde DEV. Solución: variables de entorno para rutas/URLs, connection references correctas, validación postdeploy y rollback documentado. Prevención: checklist obligatorio antes de UAT.

## Respuesta de cierre

Configuración corregida en TEST, UAT repetido y paquete bloqueado hasta completar checklist.

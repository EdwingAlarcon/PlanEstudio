---
id: CH-001
title: "Solución de solicitudes empresariales"
practiceType: challenge
domain: configuration-implementation
roles: ["maker", "functional-consultant", "administrator"]
difficulty: practitioner
estimatedEffort: long
prerequisites:
  modules: [2, 4, 5, 16, 19]
  labs: ["LAB-002", "LAB-004", "LAB-005", "LAB-019"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Dataverse", "Power Apps", "Power Automate", "Solutions"]
skills: ["requirements-analysis", "model-driven-app", "security", "automation", "testing", "deployment"]
evidence:
  required: ["data-model", "security-matrix", "test-plan", "test-results", "deployment-plan", "runbook"]
  optional: ["solution-export", "demo-video", "presentation"]
  format: "Paquete de entrega con diseño, implementación o maqueta defendible, pruebas y documentación operativa."
  qualityCriteria: ["Incluye criterios de aceptación", "Usa mínimo privilegio", "No depende de configuración en default solution"]
  sensitiveDataWarning: "Usa datos ficticios; no exportes usuarios o conexiones reales."
solutionAvailability: after-attempt
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Empieza por el proceso"
    content: "Modela estados, actores y decisiones antes de crear tablas o flujos."
  - id: hint-2
    level: tool
    title: "Usa Dataverse y soluciones"
    content: "Piensa en tablas, roles, app model-driven, variables de entorno y solución no administrada para desarrollo."
  - id: hint-3
    level: hypothesis
    title: "La seguridad define el diseño"
    content: "Los roles de solicitante, gestor y aprobador deben guiar visibilidad, permisos y automatizaciones."
  - id: hint-4
    level: near-solution
    title: "Cierra con evidencia operativa"
    content: "Incluye pruebas, despliegue, rollback y runbook; una demo sin evidencia no satisface el challenge."
rubric:
  - criterion: "Cumplimiento funcional"
    weight: 20
  - criterion: "Diseño y mantenibilidad"
    weight: 15
  - criterion: "Seguridad"
    weight: 10
  - criterion: "Calidad técnica"
    weight: 15
  - criterion: "ALM y configuración"
    weight: 10
  - criterion: "Testing"
    weight: 10
  - criterion: "Evidencia"
    weight: 10
  - criterion: "Justificación"
    weight: 10
---

## Contexto

Una compañía de servicios necesita reemplazar una bandeja compartida de correo por una solución de solicitudes internas. El sponsor pide rapidez; TI exige trazabilidad, seguridad y despliegue controlado.

## Problema

Diseña e implementa, o documenta con suficiente detalle si no tienes tenant, una solución que gestione solicitudes empresariales desde registro hasta cierre.

## Requerimientos

- Modelo Dataverse para solicitudes, categorías, aprobaciones y comentarios.
- App model-driven para operación.
- Proceso de estados con responsable claro.
- Seguridad por rol: solicitante, gestor, aprobador y administrador funcional.
- Automatización para notificación, asignación o escalamiento.
- Variables de entorno para valores que cambian por ambiente.
- Pruebas funcionales y evidencia de despliegue.
- Documentación para soporte.

## Restricciones

- No uses System Administrator como rol operativo.
- No construyas todo en default solution.
- No incluyas secretos ni conexiones personales en evidencia.
- Si simulas el tenant, declara qué es diseño y qué fue ejecutado.

## Criterios de aceptación

- La solución permite crear, asignar, aprobar/rechazar y cerrar solicitudes.
- Los usuarios solo ven o modifican lo que corresponde a su rol.
- Hay al menos una automatización con manejo de error razonable.
- Existe plan de pruebas y resultados.
- Existe plan de despliegue y rollback.
- Puedes defender tres decisiones técnicas.

## Entregables

- Diagrama o modelo de datos.
- Matriz de seguridad.
- Backlog mínimo.
- Casos de prueba.
- Evidencia de solución o diseño.
- Runbook de soporte.

## Límites de ayuda

Puedes revisar módulos y labs previos, pero la vista principal de este challenge no incluye procedimiento. Si necesitas apoyo, pide una pista específica y registra qué decisión tomaste.

## Solución de referencia

La solución esperada reutiliza patrones de LAB-002, LAB-004, LAB-005 y LAB-019. Un resultado fuerte separa configuración por solución, usa roles específicos, declara environment variables, prueba permisos con usuarios distintos y documenta rollback. No hay una única arquitectura correcta; se evalúa coherencia y defensa.

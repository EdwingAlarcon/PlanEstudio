---
id: SIM-001
title: "Primeros cinco días en un proyecto Power Platform"
practiceType: simulation
domain: consulting-functional-analysis
roles: ["functional-consultant", "maker", "solution-architect", "support-analyst"]
difficulty: expert
estimatedEffort: long
prerequisites:
  modules: [17, 19, 31, 38]
  labs: ["LAB-062", "LAB-079", "LAB-103"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Platform", "Backlog", "ADR", "UAT", "Runbook"]
skills: ["discovery", "backlog", "security-matrix", "uat", "deployment", "incident-communication", "retrospective"]
evidence:
  required: ["backlog", "data-model", "security-matrix", "adr", "test-results", "deployment-plan", "incident-report", "retrospective"]
  optional: ["presentation", "demo-video", "runbook"]
  format: "Carpeta de simulación con entregables por día y decisiones versionadas."
  qualityCriteria: ["Distingue hechos y supuestos", "Gestiona cambios de alcance", "Incluye UAT, soporte y retrospectiva"]
  sensitiveDataWarning: "Todos los nombres, datos y stakeholders deben ser ficticios."
  artifactTypes: ["conceptual", "simulated"]
solutionAvailability: inline-collapsed
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Gestiona el tiempo por día"
    content: "No intentes resolver todo en el Día 1; separa descubrimiento, diseño, entrega, UAT y soporte."
  - id: hint-2
    level: tool
    title: "Usa artefactos de consultoría"
    content: "Backlog, ADR, matriz de seguridad, plan UAT y runbook deben evolucionar juntos."
  - id: hint-3
    level: hypothesis
    title: "Los cambios de alcance son parte del caso"
    content: "Cuando aparezcan contradicciones, registra supuestos, impacto y decisión; no los escondas en la solución."
  - id: hint-4
    level: near-solution
    title: "Cierra con defensa"
    content: "Prepara qué entregarías, qué dejarías fuera, cómo validarías y qué riesgos comunicarías al sponsor."
rubric:
  - criterion: "Descubrimiento y análisis"
    weight: 15
  - criterion: "Priorización"
    weight: 10
  - criterion: "Diseño"
    weight: 15
  - criterion: "Ejecución"
    weight: 15
  - criterion: "Gestión de cambios"
    weight: 10
  - criterion: "Calidad y pruebas"
    weight: 10
  - criterion: "Comunicación"
    weight: 10
  - criterion: "Operabilidad y soporte"
    weight: 10
  - criterion: "Retrospectiva"
    weight: 5
---

## Contexto general

Te incorporas como consultor a un proyecto Power Platform para una empresa de servicios B2B. La empresa quiere digitalizar solicitudes de clientes internos, reducir correos y preparar una base para reportes operativos.

La simulación no equivale a experiencia laboral formal. Entrena criterio, comunicación, documentación y respuesta ante cambios.

## Día 1 - Descubrimiento

Stakeholders:

- Sponsor: Directora de Operaciones.
- Usuario clave: Coordinador de Mesa de Servicio.
- TI: Administrador Power Platform.
- Riesgo: auditoría interna exige trazabilidad.

Proceso actual:

- Solicitudes llegan por email.
- Un coordinador asigna manualmente.
- El cierre se reporta en Excel.

Contradicciones:

- Operaciones pide "simple y rápido".
- Auditoría pide historial, roles y evidencia.
- TI no quiere conectores premium adicionales.

Solicita:

- Preguntas de descubrimiento.
- Supuestos explícitos.
- Mapa inicial del proceso.
- Riesgos.
- Backlog inicial.

## Día 2 - Diseño

Nueva información: existen tres tipos de solicitud con datos obligatorios distintos. Solo líderes pueden aprobar solicitudes de alto costo.

Solicita:

- Modelo de datos.
- Matriz de seguridad.
- Arquitectura de solución.
- ADR inicial.
- Criterios de aceptación.

## Día 3 - Construcción y cambio

Cambio de alcance: el sponsor pide notificaciones a Teams y reporte semanal. TI advierte que Teams puede requerir revisión de DLP.

Solicita:

- Análisis de impacto.
- Ajuste de backlog.
- Diseño detallado de automatización.
- Estrategia de solución por ambientes.

## Día 4 - Defectos y UAT

Feedback UAT:

- Los aprobadores no ven solicitudes de su equipo.
- El coordinador puede cerrar casos sin resolución.
- El reporte cuenta solicitudes canceladas como cerradas.

Solicita:

- Triage.
- Severidad.
- Reproducción.
- Corrección o decisión.
- Plan de pruebas.
- Comunicación a usuarios.

## Día 5 - Despliegue y soporte

Problema postdeploy: el flujo de notificación falla para algunos registros por una variable de entorno vacía.

Solicita:

- Diagnóstico.
- Decisión de rollback o corrección.
- Validación.
- Informe de cierre.
- Retrospectiva.

## Criterios de aceptación

- Cada día tiene entregables revisables.
- Las decisiones están justificadas.
- El cambio de alcance no se acepta sin impacto.
- UAT separa defecto, mejora y capacitación.
- El postdeploy incluye diagnóstico, validación y prevención.

## Solución de referencia

Un resultado fuerte produce una línea narrativa consistente: descubrimiento con supuestos, diseño con seguridad, backlog priorizado, control de cambios, UAT con severidad, despliegue con rollback y retrospectiva honesta. No se evalúa por tener la app más grande, sino por operar como profesional confiable.

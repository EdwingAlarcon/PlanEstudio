---
id: INC-005
title: "Plugin Dataverse: timeout y procesamiento parcial con carga alta"
practiceType: incident
domain: development-extensibility
roles: ["power-platform-developer", "support-analyst", "solution-architect"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [23, 26, 53]
  labs: ["LAB-023", "LAB-092"]
environment:
  tenantRequired: optional
  codeRequired: true
  tools: ["Plugin Trace Log", "Dataverse SDK", "Power Platform CLI"]
skills: ["plugin-tracing", "sync-vs-async", "depth", "query-optimization", "transactions", "batching"]
evidence:
  required: ["incident-report", "execution-log", "source-code", "root-cause-analysis", "test-results"]
  optional: ["diagram", "runbook"]
  format: "Análisis técnico con traza simulada, hipótesis, cambio de diseño y prueba de carga conceptual."
  qualityCriteria: ["No aumenta timeouts como solución principal", "Reduce trabajo síncrono", "Incluye tracing útil y prevención"]
  sensitiveDataWarning: "No incluyas IDs reales de organización, endpoints privados ni datos de clientes."
  artifactTypes: ["simulated", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Delimita síncrono versus asíncrono"
    content: "Identifica si el impacto está en la transacción principal o en procesamiento posterior."
  - id: hint-2
    level: tool
    title: "Usa trazas y métricas"
    content: "Revisa Plugin Trace Log, profundidad, mensajes registrados y volumen de registros procesados."
  - id: hint-3
    level: hypothesis
    title: "Busca trabajo pesado en Pre/Post Operation"
    content: "Un plugin síncrono que consulta o actualiza demasiados registros puede agotar tiempo y bloquear carga."
  - id: hint-4
    level: near-solution
    title: "Reduce la transacción"
    content: "Propón filtros, columnas mínimas, procesamiento asíncrono o batching, con prueba de carga controlada."
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

Un plugin en `Update` de Opportunity recalcula comisiones y crea registros detalle. En pruebas simples funciona. En carga alta aparecen timeouts y algunos detalles quedan parcialmente procesados.

## Síntoma reportado

"Cuando actualizamos muchas oportunidades al cierre de mes, algunas quedan con comisión incompleta y el usuario recibe timeout."

## Evidencia inicial simulada

```text
Plugin: SIT.CalculateCommissionPlugin
Message: Update Opportunity
Stage: PostOperation Sync
Depth: 2
Elapsed: 118000 ms
Trace: Retrieved 420 related records without column set.
Trace: Created 420 commission detail records one by one.
Trace: External service call executed inside transaction.
```

## Pistas relevantes

- El plugin es síncrono y hace llamada externa.
- Consulta columnas completas.
- Crea registros uno por uno.
- No usa patrón asíncrono ni cola.
- Hay profundidad 2 por actualización secundaria.

## Criterios de aceptación

- Delimitas si el problema es consulta, transacción, recursión, llamada externa o batch.
- Identificas causa raíz.
- Propones rediseño seguro.
- Incluyes tracing mínimo útil.
- Validación cubre registro individual y carga representativa.

## Evidencias requeridas

- Extracto de traza anotado.
- RCA.
- Cambio propuesto de diseño/código.
- Resultado de prueba y regresión.

## Solución de referencia

Causa raíz: exceso de trabajo síncrono dentro de la transacción, más consultas amplias y llamada externa. El timeout no se resuelve aumentando límites; se resuelve moviendo trabajo no crítico a asincronía y reduciendo operaciones.

Corrección mínima segura:

- Mantener síncrono solo lo indispensable para validar datos.
- Mover cálculo pesado a plugin asíncrono, Power Automate idempotente o proceso de cola.
- Usar ColumnSet explícito.
- Evitar update recursivo o controlar profundidad con intención clara.
- Agrupar operaciones cuando sea compatible.
- Registrar trazas con correlation id, conteos y tiempos por bloque.

Prevención: revisión de performance antes de registrar plugins síncronos sobre entidades de alto volumen.

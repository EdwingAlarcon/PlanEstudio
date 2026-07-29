---
id: INC-004
title: "Dynamics 365 Customer Service: SLA no se activa por canal"
practiceType: incident
domain: support-troubleshooting
roles: ["dynamics-365-consultant", "functional-consultant", "support-analyst"]
difficulty: advanced
estimatedEffort: medium
prerequisites:
  modules: [20, 61, 62]
  labs: ["LAB-068", "LAB-082"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Dynamics 365 Customer Service", "SLA", "Routing rules"]
skills: ["sla", "entitlements", "routing", "calendar", "case-origin", "uat"]
evidence:
  required: ["incident-report", "test-plan", "test-results", "root-cause-analysis"]
  optional: ["screenshot", "runbook"]
  format: "Matriz por canal con condición de SLA, datos de caso, entitlement y resultado esperado/real."
  qualityCriteria: ["Distingue canal, calendario y entitlement", "Valida con casos nuevos", "No fuerza SLA manual sin causa"]
  sensitiveDataWarning: "No uses datos reales de clientes; anonimiza asunto, contacto y cuenta."
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Define el evento de SLA"
    content: "Aclara cuándo debe iniciar, pausar y fallar el SLA antes de cambiar reglas."
  - id: hint-2
    level: tool
    title: "Revisa calendario y KPIs"
    content: "Contrasta calendario de servicio, SLA Items, KPI Instances y condiciones de pausa."
  - id: hint-3
    level: hypothesis
    title: "La pausa puede no aplicar"
    content: "Si el estado del caso no coincide con la condición de pausa, el temporizador seguirá corriendo."
  - id: hint-4
    level: near-solution
    title: "Valida con caso controlado"
    content: "Ajusta condiciones de pausa/fallo y prueba un caso nuevo con calendario conocido y evidencia de KPI."
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

El equipo de Customer Service reporta que el SLA "Respuesta inicial 4h" se activa para casos creados por portal, pero no para algunos casos creados desde email. Los agentes ven resultados distintos según origen.

## Síntoma reportado

"Mismo cliente, misma prioridad, pero unos casos tienen contador de SLA y otros no."

## Evidencia inicial simulada

| Caso | Origen | Prioridad | Entitlement | SLA aplicado |
|---|---|---|---|---|
| CAS-8801 | Portal | Alta | Premium Soporte | Sí |
| CAS-8802 | Email | Alta | vacío | No |
| CAS-8803 | Omnichannel | Alta | Premium Soporte | Sí |
| CAS-8804 | Email | Media | Premium Soporte | No |

## Pistas relevantes

- El SLA usa condición `Priority = High AND Entitlement contains data`.
- La regla de creación por email no está poblando entitlement.
- El calendario de servicio excluye festivos regionales.
- Un routing rule set asigna cola, pero no completa entitlement.

## Criterios de aceptación

- Reproduces al menos dos casos por canal.
- Separas condición de SLA, applicable from, calendario, entitlement y routing.
- Identificas por qué algunos casos no cumplen condición.
- Propones corrección sin alterar prioridades para forzar SLA.
- Validación cubre portal, email y omnichannel.

## Evidencias requeridas

- Matriz de prueba por canal.
- RCA.
- Plan de prueba de regresión.
- Comunicación de cierre para agentes.

## Solución de referencia

Causa raíz: los casos por email no reciben entitlement y algunos tampoco cumplen prioridad Alta. El SLA no falla; sus condiciones no se cumplen para todos los canales. Routing y SLA son piezas distintas.

Corrección mínima segura:

- Ajustar regla/proceso de creación por email para resolver cuenta/contacto y entitlement.
- Revisar si la condición del SLA debe depender de entitlement o de un contrato derivado.
- Mantener calendario de servicio documentado.
- Crear casos nuevos de prueba; no confiar en reactivar casos históricos sin entender estado.
- Comunicar a agentes qué campos gobiernan el SLA.

Prevención: UAT por canal cada vez que se cambien reglas de case creation, entitlement o SLA.

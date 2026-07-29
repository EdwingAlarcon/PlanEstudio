---
id: CH-002
title: "Extensión profesional de Dataverse"
practiceType: challenge
domain: development-extensibility
roles: ["power-platform-developer", "solution-architect"]
difficulty: advanced
estimatedEffort: long
prerequisites:
  modules: [13, 23, 24, 53]
  labs: ["LAB-023", "LAB-091"]
environment:
  tenantRequired: optional
  codeRequired: true
  tools: ["Power Platform CLI", "Dataverse", "C#", "JavaScript"]
skills: ["plugin", "custom-api", "javascript", "integration", "tracing", "alm", "testing"]
evidence:
  required: ["source-code", "test-plan", "test-results", "deployment-plan", "adr"]
  optional: ["pull-request", "solution-export", "demo-video"]
  format: "Repositorio o diff con diseño, código, pruebas, trazas y ADR de la ruta técnica elegida."
  qualityCriteria: ["Justifica plugin vs Custom API vs JavaScript", "Incluye tracing", "Prueba errores y casos felices"]
  sensitiveDataWarning: "No guardes secretos, connection strings ni tokens en código o capturas."
solutionAvailability: after-attempt
coverageState: partial
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

El área comercial solicita una validación avanzada antes de cerrar una oportunidad. La regla cambia según monto, región y estado de documentación. Parte puede resolverse con configuración, pero hay una extensión razonable.

## Problema

Construye una extensión profesional de Dataverse o diseña una implementación defendible si no tienes tenant. Puedes elegir plugin, Custom API, JavaScript o combinación, siempre que justifiques por qué.

## Requerimientos

- Validar una regla de negocio no trivial.
- Registrar trazas suficientes para soporte.
- Evitar secretos en código.
- Incluir pruebas de caso feliz, error esperado y regresión.
- Empaquetar o documentar ALM.
- Permitir configuración por ambiente cuando aplique.

## Restricciones

- No uses código para lo que una Business Rule o configuración resolvería limpiamente.
- No hagas llamadas externas síncronas desde plugin sin justificar impacto.
- No ignores límites de transacción.
- No obligues a usar plugin si Custom API o JavaScript es más razonable.

## Criterios de aceptación

- La extensión cumple la regla y falla con mensaje útil.
- El diseño evita privilegios excesivos.
- La evidencia permite revisar código y comportamiento.
- Existe estrategia de despliegue.
- Puedes explicar trade-offs de la tecnología elegida.

## Entregables

- ADR de decisión técnica.
- Código o pseudodiseño ejecutable.
- Pruebas.
- Trazas esperadas.
- Plan de despliegue.

## Límites de ayuda

No hay procedimiento guiado. Puedes consultar módulos 23, 24 y 53, pero debes decidir la ruta técnica y defenderla.

## Solución de referencia

Una respuesta sólida usa configuración para reglas simples y extensión solo para lógica que requiere control transaccional o API explícita. Debe incluir tracing, pruebas, ALM y explicación de por qué no se resolvió con una personalización más simple.

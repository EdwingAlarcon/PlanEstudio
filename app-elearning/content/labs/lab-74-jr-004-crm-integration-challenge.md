---
id: lab-74
title: "JR-004 — CRM Integration Challenge"
level: "N4"
duration: 240
product: ["Dataverse", "Power Automate", "Azure Functions", "Azure Service Bus"]
certifications: ["PL-400", "PL-600"]
role: ["Integration Developer", "Solution Architect"]
prerequisites:
  - "Módulo 24 revisado: Azure Functions y Service Bus"
  - "Módulo 34 estudiado: integraciones empresariales"
  - "Módulo 53 revisado: Dataverse Web API"
---

# Lab 74 — JR-004: CRM Integration Challenge

## Objetivo

Diseñar una integracion CRM con API externa, manejo de errores, idempotencia, seguridad y
observabilidad, como prueba tecnica de integration developer.

## Escenario de negocio

**Empresa ficticia:** Fabrikam Seguros.

Cada nueva oportunidad aprobada en Dynamics 365 debe consultar un servicio externo de riesgo y
guardar el resultado en Dataverse. El servicio puede fallar, responder lento o devolver duplicados.

## Rol del estudiante

Actúas como Integration Developer responsable de proponer un patron confiable.

## Herramientas necesarias

- Dataverse.
- Power Automate o Logic Apps.
- API mock o documentacion de API.
- Azure Function / Service Bus conceptual si no tienes suscripcion.

## Entregables

- Diagrama de integracion.
- Decision record del patron sync/async.
- Contrato de API.
- Estrategia de errores y reintentos.
- Matriz de seguridad.
- Evidencia de prueba o simulacion.

## Pasos detallados

### Paso 1 — Elegir patron

Compara:

| Patron | Ventaja | Riesgo |
|---|---|---|
| Power Automate directo | Rapido de construir | Menos control para alto volumen |
| Azure Function | Control de codigo y seguridad | Mayor mantenimiento |
| Service Bus async | Resiliencia y desacoplamiento | Complejidad adicional |

Recomendacion base: usa async con cola cuando el servicio externo no sea critico para guardar la
oportunidad.

### Paso 2 — Idempotencia

Define un `externalCorrelationId` para no procesar dos veces la misma oportunidad.

### Paso 3 — Manejo de errores

Documenta:

- HTTP 400: error funcional, no reintentar automaticamente.
- HTTP 401/403: revisar secretos o permisos.
- HTTP 429: reintentar con backoff.
- HTTP 500/timeout: reintentar y enviar a cola de errores si supera limite.

### Paso 4 — Seguridad

Incluye:

- Secretos fuera del flujo.
- Conectores con service principal cuando aplique.
- APIM o Function Key segun arquitectura.
- Logs sin datos sensibles.

## Criterios de validación

- [ ] El diagrama muestra origen, integracion, API, Dataverse y monitoreo.
- [ ] Hay estrategia de idempotencia.
- [ ] Hay manejo de errores por categoria.
- [ ] Hay decision sync/async justificada.
- [ ] Hay evidencia o simulacion.

## Rúbrica

| Criterio | Peso |
|---|---|
| Patron de integracion | 30% |
| Seguridad | 20% |
| Resiliencia | 25% |
| Observabilidad | 15% |
| Documentacion | 10% |

## Errores comunes

- Hacer llamadas directas sin manejo de errores.
- Guardar secretos en texto plano.
- Reintentar errores funcionales indefinidamente.
- No definir correlacion/idempotencia.

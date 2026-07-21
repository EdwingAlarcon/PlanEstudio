---
id: lab-74
title: "JR-004 — CRM Integration Challenge"
level: "N4"
duration: 240
product: ["Dataverse", "Power Automate", "Azure Functions", "Azure Service Bus"]
certifications: ["PL-400", "Integration"]
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

## Perfil laboral y skill validado

**Vacante objetivo:** Integration Developer / Solution Architect responsable de decidir e
implementar cómo Dataverse se comunica con un servicio externo poco confiable.

**Skill concreto que valida:** capacidad de tomar y justificar una decisión de arquitectura
(sync vs. async), diseñar idempotencia real (no solo mencionarla) y clasificar errores HTTP con una
estrategia de reintento distinta para cada categoría — no solo "conectar una API".

## Escenario de negocio

**Empresa ficticia:** Fabrikam Seguros — ~400 oportunidades aprobadas por mes que requieren scoring
de riesgo externo antes de convertirse en póliza.

Cada nueva oportunidad aprobada en Dynamics 365 debe consultar un servicio externo de riesgo y
guardar el resultado en Dataverse. El servicio puede fallar, responder lento o devolver duplicados.

## Rol del estudiante

Actúas como Integration Developer responsable de proponer un patron confiable.

## Herramientas necesarias

- Dataverse.
- Power Automate o Logic Apps.
- API mock o documentacion de API.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con tenant real:** construye el flujo con una API mock pública (ej. un endpoint de prueba tipo
  httpbin o un Azure Function propia desplegada) y ejecuta los 4 escenarios de error del Paso 3.
- **Sin tenant/suscripción Azure:** entrega el diagrama, el contrato de API, la tabla de decisión de
  errores y una tabla de "qué respuesta simulada produce qué comportamiento del flujo" en vez de
  ejecuciones reales — dejándolo explícito en el entregable.

## Contrato de API (dato de prueba)

Usa este contrato simulado del servicio externo de riesgo para diseñar tu integración:

```json
// Request
POST /risk-score
{
  "opportunityId": "a1b2c3d4-...",
  "customerSegment": "SME",
  "estimatedValue": 85000,
  "externalCorrelationId": "fabrikam-opp-a1b2c3d4"
}

// Response 200 OK
{
  "riskScore": 62,
  "riskTier": "Medium",
  "evaluatedAt": "2026-07-20T14:32:00Z"
}
```

| Escenario simulado | Código HTTP | Comportamiento esperado del flujo |
|---|---|---|
| Servicio disponible | 200 | Guarda `riskScore` y `riskTier` en Dataverse |
| Payload inválido (falta `estimatedValue`) | 400 | No reintenta; marca la oportunidad para revisión manual |
| Token expirado | 401 | No reintenta automáticamente; alerta al equipo de integración |
| Servicio saturado | 429 | Reintenta con backoff exponencial (ver Paso 3) |
| Timeout de red | 500 / timeout | Reintenta hasta 3 veces, luego envía a cola de errores |

## Entregables

- Diagrama de integracion.
- Decision record del patron sync/async.
- Contrato de API (usa el de arriba o adapta uno propio, pero debe quedar igual de concreto).
- Estrategia de errores y reintentos aplicada a los 5 escenarios de la tabla.
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

Usa `externalCorrelationId` (ver contrato arriba, formato `fabrikam-opp-<id>`) para no procesar dos
veces la misma oportunidad. Documenta qué pasa si el mismo `externalCorrelationId` llega dos veces:
¿el flujo debe consultar antes de llamar, o el servicio externo debe deduplicar?

### Paso 3 — Manejo de errores

Aplica la tabla de escenarios de arriba y documenta el detalle de reintento:

- HTTP 400: error funcional, no reintentar automaticamente.
- HTTP 401/403: revisar secretos o permisos, no reintentar automáticamente.
- HTTP 429: reintentar con backoff (ej. 2s, 8s, 30s).
- HTTP 500/timeout: reintentar hasta 3 veces con backoff, luego enviar a cola de errores.

### Paso 4 — Seguridad

Incluye:

- Secretos fuera del flujo.
- Conectores con service principal cuando aplique.
- APIM o Function Key segun arquitectura.
- Logs sin datos sensibles (el `riskScore` no es sensible; el payload del cliente sí puede serlo).

## Decisiones que debes tomar

- **¿Qué pasa si el servicio externo responde después de que ya expiró el reintento (respuesta
  tardía duplicada)?** Decide cómo tu diseño de idempotencia lo maneja.
- **¿Guardas el `riskTier` aunque el score sea 0/desconocido, o dejas el campo vacío?** Justifica el
  impacto en reporting si dejas valores ambiguos.
- **¿La cola de errores requiere intervención humana o un reintento automático diferido (ej. cada
  hora)?** Explica el criterio para elegir uno u otro.

## Criterios de validación

- [ ] El diagrama muestra origen, integracion, API, Dataverse y monitoreo.
- [ ] Hay estrategia de idempotencia con el `externalCorrelationId` del contrato.
- [ ] Hay manejo de errores diferenciado para los 5 escenarios de la tabla.
- [ ] Hay decision sync/async justificada.
- [ ] Hay evidencia o simulacion clara sobre cuál de las dos es.

## Rúbrica

| Criterio | Peso |
|---|---|
| Patron de integracion | 30% |
| Seguridad | 20% |
| Resiliencia | 25% |
| Observabilidad | 15% |
| Documentacion | 10% |

## Preguntas de entrevista asociadas

- "¿Por qué elegiste async en vez de un flujo síncrono directo desde el formulario?" — respuesta
  esperada: el servicio externo no es crítico para el guardado de la oportunidad, y un flujo síncrono
  bloquearía al usuario si el servicio está lento.
- "¿Cómo evitas procesar dos veces la misma oportunidad si Power Automate reintenta un trigger?" —
  respuesta esperada: `externalCorrelationId` + verificación de existencia antes de escribir.
- "¿Qué diferencia hay entre reintentar un 429 y reintentar un 400?" — respuesta esperada: 429 es
  temporal (el servicio se recupera), 400 es un error funcional que reintentar no arregla.

## Qué no debe sobreprometerse

Este lab es un diseño de integración defendible en entrevista; no reemplaza pruebas de carga reales
ni garantiza que el patrón elegido escale sin ajustes en un volumen productivo mucho mayor al del
escenario (400 oportunidades/mes).

## Errores comunes

- Hacer llamadas directas sin manejo de errores.
- Guardar secretos en texto plano.
- Reintentar errores funcionales indefinidamente.
- No definir correlacion/idempotencia.

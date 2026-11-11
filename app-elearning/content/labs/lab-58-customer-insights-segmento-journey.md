---
id: lab-58
title: "Customer Insights — Segmento, Consentimiento y Journey de Renovación"
level: "N3"
duration: 95
product: ["Customer Insights", "Dynamics 365 Sales", "Dynamics 365 Customer Service", "Dataverse"]
certifications: ["PL-400", "Dynamics 365 Customer Engagement"]
role: ["Functional Consultant", "Solution Architect"]
prerequisites:
  - "Módulo 20 estudiado: Dynamics 365 CE — Sales y Customer Service"
  - "Conocimiento básico de cuentas, contactos, casos y consentimiento"
files: []
lastVerified: "2026-11"
---

# Lab 58 — Customer Insights: Segmento, Consentimiento y Journey de Renovación

## Objetivo

Al finalizar este laboratorio habrás diseñado un segmento y un journey de renovación en Customer Insights usando datos de Sales, Customer Service y billing, con controles explícitos de consentimiento y exclusión de clientes con casos críticos abiertos.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** SIT quiere contactar clientes con contrato próximo a vencer, pero ha recibido quejas porque algunos clientes con incidentes críticos abiertos reciben mensajes comerciales inoportunos. El equipo debe diseñar una segmentación gobernada antes de activar cualquier journey.

## Prerrequisitos

- Acceso conceptual o real a Dynamics 365 Customer Insights.
- Entender las tablas estándar `Account`, `Contact`, `Opportunity` y `Case`.
- Tener claro qué canal de comunicación requiere consentimiento.

## Aviso de licencia y modo de entrega

Este lab se completa **en papel** (hoja de cálculo o Markdown) y la entrega se marca como **Simulado**. Tu ambiente
Developer de Power Platform no puede instalar Customer Insights. Si quieres mirar las pantallas, la única vía sin pagar es
la [trial de 30 días de Customer Insights](https://learn.microsoft.com/dynamics365/customer-insights/journeys/trial-signup)
(Data y Journeys en el mismo ambiente, creado por la propia trial, ampliable una vez); sus requisitos de email y sus
límites están en el Módulo 64 ("Antes de empezar"). Aun con trial, no publiques un journey con contactos reales.

## Herramientas necesarias

- Customer Insights - Data o un documento de diseño equivalente.
- Customer Insights - Journeys o un documento de journey equivalente.
- Dynamics 365 Sales y Customer Service como fuentes conceptuales.
- Hoja de cálculo o Markdown para documentar fuentes, segmento y validaciones.

## Datos de prueba

| Contacto | Cuenta | Renovación | Caso crítico abierto | Consentimiento email | Valor anual |
|---|---|---:|---|---|---:|
| Ana Rivera | Contoso Andina | 30 días | No | Sí | 18000 |
| Carlos Méndez | Fabrikam Norte | 45 días | Sí | Sí | 24000 |
| Lucía Torres | Litware Sur | 90 días | No | Sí | 12000 |
| Mateo Rojas | Adventure Works | 20 días | No | No | 30000 |

## Pasos detallados

### Paso 1 — Definir fuentes y propósito

Completa esta matriz antes de crear el segmento:

| Fuente | Datos requeridos | Uso en el journey | Dueño |
|---|---|---|---|
| Dynamics 365 Sales | Account, Contact, Opportunity | Relación comercial y dueño de cuenta | Ventas |
| Customer Service | Case, prioridad, estado | Excluir clientes con incidentes críticos | Servicio |
| Billing o ERP/F&O | fecha de renovación, valor anual | Identificar oportunidad de renovación | Finanzas |
| Consent records | propósito, tema, canal | Validar permiso de contacto | Legal/Compliance |

### Paso 2 — Diseñar reglas del segmento

Define el segmento `Renovación B2B gobernada` con estas reglas:

- Contactos con renovación en los próximos 60 días.
- Consentimiento válido para email.
- Sin caso crítico abierto.
- Valor anual mayor o igual a 15000.
- Contacto asociado a una cuenta activa.

Con los datos de prueba, solo `Ana Rivera` debe entrar al segmento.

> **Cómo lo resuelve la herramienta (Módulo 64):** en Customer Insights - Journeys el consentimiento no es solo un filtro
> del segmento: cada email lleva un **propósito** y el modelo de cumplimiento de ese propósito (**Restrictive**: solo a
> quien tiene opt-in) decide en el momento del envío, leyendo los registros de *contact point consent* del email
> ([Learn: consentimiento](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-compliance-settings)).
> Mantén la regla de consentimiento en el segmento para contar quién queda fuera, pero escribe también qué propósito y qué
> modelo usará el email de renovación. La regla de renovación en 60 días es un evento de negocio masivo: el journey es
> **segment-based**, no un trigger por contacto.

### Paso 3 — Diseñar el journey

Documenta el journey:

| Etapa | Acción | Control |
|---|---|---|
| Entrada | Contacto entra al segmento | El email lleva un propósito con modelo Restrictive: sin opt-in no se envía |
| Día 0 | Email de renovación personalizado | Incluir fecha de renovación y owner comercial |
| Día 5 | Rama por interacción (*Wait for trigger*: *Email link clicked*, 5 días) | Si hace clic, crear tarea para vendedor |
| Día 8 | Segundo mensaje si no interactúa | Evitar más de 2 contactos en 10 días (límites de frecuencia del journey) |
| Evento crítico | Cliente abre caso crítico | **Exit** por trigger (por ejemplo, el business trigger *Incident created* o un trigger de Dataverse sobre Case; anota la condición "prioridad crítica" como requisito del trigger) y aviso a Customer Service con un custom trigger que dispara un flujo |

### Paso 4 — Definir métricas y evidencia

Registra estas métricas mínimas:

- Tamaño del segmento.
- Tasa de entrega.
- Tasa de apertura o interacción.
- Tareas comerciales creadas.
- Contactos excluidos por consentimiento.
- Contactos excluidos por caso crítico.

## Resultado esperado

Un diseño de Customer Insights listo para revisión funcional, con segmento, journey, consentimiento, exclusiones y métricas de negocio claramente documentadas.

## Validaciones

- [ ] El segmento excluye contactos sin consentimiento.
- [ ] El segmento excluye clientes con caso crítico abierto.
- [ ] El journey tiene salida por evento de servicio crítico.
- [ ] Las métricas permiten explicar impacto comercial y riesgo operativo.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Usar Customer Insights como CRM operativo | Confundir CDP con sistema transaccional | Mantener operación en Sales/Service y usar Customer Insights para perfiles, segmentos e insights |
| Activar journey sin consentimiento | Legal/Compliance no participó en el diseño | Definir propósito, tema y canal antes de publicar |
| Segmentar solo por fecha de renovación | Ignorar contexto de servicio | Excluir clientes con casos críticos abiertos |

## Reto adicional

Agrega una rama para clientes premium: si el valor anual es mayor a 25000, el journey no envía segundo email automático; crea una tarea de llamada directa para el account manager.

## Evidencia esperada

- Matriz de fuentes.
- Reglas del segmento.
- Diagrama o tabla del journey.
- Lista de contactos incluidos/excluidos con justificación.
- Métricas esperadas.

## Criterios de aprobación

- [ ] La solución evita comunicaciones comerciales inoportunas.
- [ ] Las reglas son verificables con datos de prueba.
- [ ] El diseño separa claramente Sales, Service, billing y consentimiento.
- [ ] La evidencia puede ser revisada por negocio, marketing y compliance.

## Módulos relacionados

- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Módulo 58 — Customer Insights - Data (de dónde sale el segmento)
- Módulo 64 — Customer Insights - Journeys (triggers, consentimiento por propósito, exit)
- Módulo 38 — Liderazgo Técnico y Gestión de Proyectos
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño funcional de Customer Insights.
- Segmentación con consentimiento.
- Orquestación de journeys basada en eventos.
- Trazabilidad entre datos, reglas y métricas.

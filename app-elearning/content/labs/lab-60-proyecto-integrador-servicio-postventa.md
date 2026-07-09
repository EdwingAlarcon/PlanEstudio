---
id: lab-60
title: "Proyecto Integrador — Servicio Postventa con Customer Insights y Field Service"
level: "N4"
duration: 180
product: ["Dynamics 365 Sales", "Dynamics 365 Customer Service", "Customer Insights", "Dynamics 365 Field Service", "Dataverse"]
certifications: ["Arquitectura Power Platform", "Dynamics 365 Customer Engagement"]
role: ["Functional Consultant", "Solution Architect"]
prerequisites:
  - "Lab 55 completado: UAT, matriz de trazabilidad y checklist de go-live"
  - "Lab 58 completado: Customer Insights — segmento y journey"
  - "Lab 59 completado: Field Service — Work Order y UAT"
  - "Recurso revisado: Rúbricas y Plantillas de Evaluación"
files: []
---

# Lab 60 — Proyecto Integrador: Servicio Postventa con Customer Insights y Field Service

## Objetivo

Al finalizar este proyecto integrador habrás diseñado una solución evaluable de servicio postventa para SIT, conectando Sales, Customer Service, Customer Insights y Field Service con trazabilidad, UAT, evidencia y criterios de aprobación basados en la rúbrica `/recursos/rubricas-plantillas`.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

SIT vende contratos de mantenimiento para equipos industriales. El proceso actual está fragmentado: Sales gestiona renovaciones, Customer Service recibe incidentes, Marketing envía comunicaciones genéricas y Operaciones agenda visitas en hojas de cálculo. La dirección quiere una solución integrada que reduzca comunicaciones inoportunas, mejore cumplimiento de SLA y deje evidencia auditable del servicio.

## Alcance del proyecto

Diseñar una solución mínima viable, no implementarla completa. El entregable debe ser suficientemente claro para que un equipo pueda estimar, construir y validar la solución en un sprint posterior.

Incluye:

- Renovación gobernada con Customer Insights.
- Atención de incidentes con Customer Service.
- Visita técnica con Field Service.
- Trazabilidad entre requerimientos, diseño, UAT y evidencia.
- Checklist de go-live conceptual.

Fuera de alcance:

- Desarrollo de plugins o PCF.
- Automatización real de pipelines.
- Migración masiva de datos.
- Integraciones técnicas detalladas con ERP.

## Restricciones del proyecto

Diseña considerando que SIT no tiene un ambiente ideal para implementar esto de inmediato — deja
explícito en tu diseño cómo cada restricción condiciona una decisión, no las trates como
obstáculos a ignorar:

- **Política DLP activa:** el conector de correo masivo usado para journeys no puede combinarse
  en el mismo flujo con conectores no aprobados por TI (por ejemplo, HTTP genérico hacia servicios
  externos no auditados).
- **Integración con sistema legado:** el billing/ERP que informa fechas de renovación es un
  sistema legado sin API moderna — solo exporta un archivo plano diario.
- **Múltiples áreas de negocio con prioridades distintas:** Marketing quiere maximizar
  renovaciones, Servicio quiere minimizar tiempo de resolución, y Legal exige trazabilidad de
  consentimiento — el diseño debe balancear los tres, no optimizar solo uno.
- **Ambientes Dev/Test/Prod:** el diseño debe indicar qué se prueba en Test antes de tocar
  Prod, especialmente las reglas de exclusión de casos críticos.

## Prerrequisitos

- Conocer entidades estándar de Dynamics 365 CE: `Account`, `Contact`, `Opportunity`, `Case`.
- Entender `Work Order`, `Booking`, `Customer Asset` e `Incident Type`.
- Haber revisado la escala 0-4 de la rúbrica de evaluación.

## Herramientas necesarias

- Markdown, Word, Excel o equivalente para documentar.
- Dynamics 365/Customer Insights/Field Service conceptual o tenant de práctica.
- Recurso `/recursos/rubricas-plantillas`.

## Datos de prueba

| Cliente | Contrato vence | Valor anual | Caso crítico | Consentimiento email | Activo | SLA |
|---|---:|---:|---|---|---|---|
| Contoso Andina | 30 días | 18000 | No | Sí | Compresor CX-200 | 24 h |
| Fabrikam Norte | 45 días | 24000 | Sí | Sí | Sensor IoT S-10 | 72 h |
| Litware Sur | 20 días | 30000 | No | No | Bomba B-500 | 8 h |
| Adventure Works | 55 días | 42000 | No | Sí | Planta P-900 | 8 h |

## Entregables

### 1. Mapa TO-BE

Documenta el proceso futuro en 8-10 pasos:

1. Cliente existe como `Account` con contactos asociados.
2. Billing/ERP informa fecha de renovación.
3. Customer Insights crea segmento con consentimiento y exclusiones.
4. Journey contacta solo clientes elegibles.
5. Si el cliente responde, Sales crea o actualiza oportunidad.
6. Si aparece caso crítico, el cliente sale del journey.
7. Customer Service gestiona el caso.
8. Si requiere visita, se crea Work Order.
9. Dispatcher agenda Booking con técnico adecuado.
10. Técnico captura evidencia móvil y se cierra el servicio.

### 2. Fit-Gap contra estándar

| Requerimiento | Entidad/capacidad estándar | Fit/Gap | Decisión |
|---|---|---|---|
| Gestionar cliente B2B | Account + Contact | Fit | Usar estándar |
| Renovación por fecha de contrato | Customer Insights segment | Fit parcial | Requiere fuente de billing |
| Excluir casos críticos | Case + reglas de segmento | Fit parcial | Validar sincronización |
| Visita técnica | Work Order + Booking | Fit | Usar Field Service |
| Evidencia móvil | Field Service Mobile inspection | Fit | Definir checklist |

### 3. Diseño Customer Insights

Entrega:

- Matriz de fuentes.
- Reglas del segmento.
- Journey con trigger, ramas y salida por caso crítico.
- Métricas: tamaño del segmento, exclusiones por consentimiento, exclusiones por casos críticos, tareas comerciales creadas.

### 4. Diseño Field Service

Entrega:

- Flujo `Case → Work Order → Booking → Mobile execution`.
- Datos mínimos de Work Order.
- Criterios de scheduling.
- Checklist de evidencia móvil.
- Regla de escalamiento para SLA crítico.

### 5. Matriz de trazabilidad

| Req ID | Historia | Diseño | Caso UAT | Evidencia | Estado |
|---|---|---|---|---|---|
| REQ-001 | Renovar cliente elegible con consentimiento | Diseño CI-01 | UAT-001 | Segmento + journey | Pendiente |
| REQ-002 | Excluir cliente con caso crítico | Diseño CI-02 | UAT-002 | Contacto excluido | Pendiente |
| REQ-003 | Crear Work Order desde Case | Diseño FS-01 | UAT-003 | Work Order creada | Pendiente |
| REQ-004 | Agendar técnico por skill y SLA | Diseño FS-02 | UAT-004 | Booking asignado | Pendiente |
| REQ-005 | Bloquear cierre sin evidencia | Diseño FS-03 | UAT-005 | Checklist incompleto rechazado | Pendiente |

### 6. Casos UAT mínimos

| Caso UAT | Tipo | Resultado esperado |
|---|---|---|
| UAT-001 | Happy path CI | Contoso entra al segmento y recibe journey |
| UAT-002 | Exclusión por caso crítico | Fabrikam queda fuera del journey |
| UAT-003 | Exclusión por consentimiento | Litware queda fuera del journey |
| UAT-004 | Cliente premium | Adventure Works crea tarea directa al account manager |
| UAT-005 | Case a Work Order | Caso crítico crea Work Order con activo |
| UAT-006 | Scheduling | Técnico cumple skill y ventana SLA |
| UAT-007 | Permisos | Técnico no modifica precio ni garantía |
| UAT-008 | Evidencia incompleta | Cierre queda bloqueado o marcado para revisión |

### 7. Checklist de go-live conceptual

- [ ] Requerimientos aprobados por negocio.
- [ ] Segmento validado con datos de prueba.
- [ ] Consentimiento revisado por Legal/Compliance.
- [ ] Casos UAT ejecutados y firmados.
- [ ] Matriz de seguridad revisada.
- [ ] Evidencias almacenadas y trazables.
- [ ] Plan de rollback conceptual documentado.
- [ ] Comunicación a usuarios preparada.

## Resultado esperado

Un paquete de proyecto integrador con diseño funcional, trazabilidad, UAT y evidencia suficiente para calificar el entregable usando la rúbrica profesional.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Diseño funcional TO-BE | 20% | Proceso completo con roles y excepciones |
| Customer Insights | 15% | Segmento y journey con consentimiento y exclusiones |
| Field Service | 15% | Work Order, Booking, scheduling y evidencia móvil |
| Trazabilidad | 20% | Requerimientos conectados a UAT y evidencia |
| UAT | 15% | 8 casos cubren happy path, errores, permisos e integración |
| Go-live | 10% | Checklist cubre datos, seguridad, rollback y comunicación |
| Claridad ejecutiva | 5% | Resumen entendible para negocio y arquitectura |

Aprobación: mínimo 75/100 y ningún criterio crítico de Customer Insights, Field Service o trazabilidad en nivel 0-1.

## Evidencia esperada

- Documento de diseño de 3-5 páginas.
- Matriz Fit-Gap.
- Matriz de trazabilidad.
- 8 casos UAT.
- Checklist de go-live.
- Resumen ejecutivo de máximo 1 página.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Crear tablas custom para todo | No evaluar capacidades estándar | Documentar Fit-Gap antes de personalizar |
| Journey ignora casos críticos | Marketing diseña sin Customer Service | Usar exclusiones y salida por evento crítico |
| Field Service queda como agenda manual | No modelar Work Order/Booking/evidencia | Diseñar ciclo completo de servicio |
| UAT sin trazabilidad | Casos de prueba desconectados de requerimientos | Usar Req ID en cada caso y evidencia |

## Reto adicional

Agrega una decisión arquitectónica breve: ¿qué datos deben quedarse en ERP/F&O como sistema maestro y cuáles deben sincronizarse a Dataverse o Customer Insights? Justifica con impacto en operación, datos y compliance.

## Módulos relacionados

- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Módulo 38 — Liderazgo Técnico y Gestión de Proyectos
- Lab 55 — UAT/Checklist de Go-Live y auditoría de prompts
- Lab 58 — Customer Insights: segmento y journey
- Lab 59 — Field Service: Work Order y UAT
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño integrador Dynamics 365 CE.
- Evaluación funcional con rúbrica.
- Trazabilidad de requerimientos a evidencia.
- Preparación de UAT y go-live.
- Comunicación de solución para negocio y arquitectura.

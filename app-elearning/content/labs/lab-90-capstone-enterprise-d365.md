---
id: lab-90
title: "Capstone Enterprise D365"
level: "N6"
duration: 240
product: ["Dynamics 365 Sales", "Dynamics 365 Customer Service", "Dynamics 365 Contact Center", "Dynamics 365 Customer Insights", "Dynamics 365 Field Service", "Dynamics 365 Finance"]
certifications: ["D365 Especialización Portfolio"]
role: ["Solution Architect", "Consultor Funcional D365 CE"]
prerequisites:
  - "Módulo 66 estudiado: Capstone Enterprise D365"
  - "Labs 81-89 revisados o completados"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 90 — Capstone Enterprise D365

## Objetivo

Crear una propuesta enterprise integrada de Dynamics 365 CE + F&O con arquitectura, roadmap,
matrices, UAT, licencias, riesgos y evidencias de portafolio.

Este capstone no debe copiar entregables de los Labs 81-89. Debe integrarlos en una propuesta
ejecutiva defendible: decisiones, trade-offs, dependencias, secuencia de implantación y evidencia
de portafolio. Las matrices detalladas viven en los labs previos; aquí se resumen y se conectan.

## Escenario de negocio

SIT quiere integrar venta consultiva, soporte premium, contact center, mantenimiento preventivo,
Customer 360 y facturación ERP.

## Gate de ambiente real

Antes de presentar este capstone como ejecución real, completa el recurso
`/recursos/d365-tenant-readiness` para cada producto incluido. Si una capacidad no cumple su gate,
déjala marcada como diseño/simulación dentro del resumen ejecutivo.

## Pasos detallados

### Paso 1 — Flujo end-to-end

Diseña 10 pasos desde campaña hasta renovación, indicando producto responsable.

### Paso 2 — Arquitectura

Dibuja arquitectura con Dataverse, Sales, Service, Contact Center, Customer Insights, Field Service
y F&O.

### Paso 3 — Fit-Gap

Crea 12 filas con estándar, gap, decisión, riesgo, owner y evidencia.

### Paso 4 — Matriz de datos

Incluye Account, Contact, Opportunity, Case, Conversation, Work Order, Product, Sales Order,
Invoice e Inventory.

### Paso 5 — Roadmap y licencias

Define fases, dependencias de tenant/licencia, criterio de salida y riesgos.

### Paso 6 — UAT y portafolio

Diseña 10 casos UAT y una lista de evidencias para entrevista laboral.

### Paso 7 — Registro de decisiones integradas

Construye un decision log con al menos 8 decisiones: producto responsable, razón, alternativa
descartada, riesgo aceptado, dependencia de licencia/tenant y evidencia que lo sustenta en los
Labs 81-89. Este decision log es el puente entre los labs especializados y la propuesta enterprise.

## Validaciones

- [ ] Arquitectura cubre CE, Field Service, Customer Insights y F&O.
- [ ] Fit-Gap tiene decisiones defendibles.
- [ ] Matriz de datos define ownership.
- [ ] Roadmap separa fases y dependencias reales.
- [ ] UAT cubre procesos end-to-end.
- [ ] Cada capacidad declara estado: Simulado, Sandbox real o Productivo controlado.
- [ ] El decision log conecta decisiones con evidencias de los Labs 81-89.

## Evidencia esperada

- Diagrama de arquitectura.
- Matriz Fit-Gap.
- Matriz de datos/ownership.
- Roadmap con licencias y dependencias.
- Casos UAT.
- Resumen ejecutivo de 1 página.
- Decision log integrado con referencias a evidencias previas.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Arquitectura integrada | 25% | Cubre CE, Field Service, Customer Insights y F&O con límites explícitos entre productos |
| Fit-Gap | 20% | Cada gap tiene decisión defendible (estándar/configuración/personalización/fuera de alcance) |
| Matriz de datos | 15% | Ownership claro por tabla/producto, sin ambigüedad de quién es la fuente de verdad |
| Roadmap | 15% | Fases con dependencias reales de licencia/tenant, no solo fechas |
| UAT | 15% | Casos end-to-end cruzando al menos 2 productos |
| Decision log | 10% | 8+ decisiones con evidencia de los Labs 81-89 referenciada |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥85/100 con
las 4 capacidades (CE, Field Service, Customer Insights, F&O) declarando su estado real
(Simulado/Sandbox real/Productivo controlado) sin ninguna marcada como "Productivo controlado" sin
evidencia que lo sustente.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Arquitectura que trata los 4 productos como un solo sistema | Se diseña sin marcar fronteras de dato/ownership entre CE, Field Service, CI y F&O | Definir explícitamente qué tabla es fuente de verdad en cada producto y dónde hay integración vs. duplicación |
| Roadmap sin dependencias reales | Se ordenan fases por preferencia, no por bloqueo real de licencia/tenant | Cada fase declara qué licencia/trial la desbloquea antes de fijar fecha |
| Decision log desconectado de los Labs 81-89 | Se documentan decisiones nuevas en vez de citar evidencia ya generada | Cada entrada del decision log referencia el Lab/artefacto donde se sustentó |
| Declarar "Productivo controlado" sin evidencia | Se asume el nivel más alto porque suena más profesional | Usa el estado real — "Simulado" es una respuesta honesta válida si no hay tenant |

## Reto adicional

Agrega un quinto producto (Contact Center o Power Automate/RPA) al decision log, marcando
explícitamente su estado (awareness/opcional) y por qué no se incluyó en el alcance principal de la
arquitectura — es la misma disciplina que exige la promesa pedagógica del propio plan.

## Competencias desarrolladas

- Arquitectura D365 Especialización.
- Consultoría funcional avanzada.
- Portafolio profesional defendible.

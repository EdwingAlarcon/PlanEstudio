---
id: lab-81
title: "Sales Forecasting & Pipeline Review"
level: "N6"
duration: 120
product: ["Dynamics 365 Sales", "Dataverse", "Power BI"]
certifications: ["Dynamics 365 Sales", "MB-280 (retira 31 jul 2026)"]
role: ["Consultor Funcional D365 CE", "Sales Operations Analyst"]
prerequisites:
  - "Módulo 60 estudiado: Dynamics 365 Sales Avanzado"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 81 — Sales Forecasting & Pipeline Review

## Objetivo

Diseñar una revisión avanzada de pipeline y forecast para un equipo B2B usando oportunidades,
forecast categories, cuotas, riesgos y acciones de seguimiento. La ejecución visual de forecasting
requiere tenant con Dynamics 365 Sales; sin tenant, el entregable se completa como diseño y matriz.

## Escenario de negocio

SIT vende servicios administrados a empresas medianas. Dirección necesita saber si el trimestre se
cumplirá y qué oportunidades requieren intervención.

## Herramientas necesarias

- Excel o Markdown para la matriz.
- Tenant Dynamics 365 Sales si deseas validar forecast real.

## Gate de ambiente real

Antes de presentar este lab como ejecución real, completa el gate **Sales avanzado** del recurso
`/recursos/d365-tenant-readiness`. Si no hay licencia Sales, jerarquía, cuotas y forecast
configurable, marca la entrega como **Simulado**.

## Pasos detallados

### Paso 1 — Modelo de etapas

Define 5 etapas comerciales con criterios de entrada/salida y campos obligatorios.

### Paso 2 — Datos de pipeline

Crea 8 oportunidades con vendedor, cuenta, valor, fecha estimada, etapa, probabilidad, forecast
category, next step y riesgo.

### Paso 3 — Matriz de forecast

Agrupa por vendedor y periodo: cuota, pipeline, best case, committed, won y gap.

### Paso 4 — Pipeline review

Prepara una agenda de 30 minutos con preguntas por oportunidad riesgosa y decisión esperada.

### Paso 5 — Requisitos de tenant/licencia

Lista qué se necesita para implementar: licencias Sales, jerarquía comercial, forecast configurado,
seguridad, productos/precios y datos históricos.

## Validaciones

- [ ] Hay 8 oportunidades con categoría de forecast y next step.
- [ ] La matriz muestra gap contra cuota.
- [ ] Se identifican al menos 3 riesgos comerciales con acción.
- [ ] Se documentan dependencias de tenant/licencia.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Matriz de pipeline.
- Matriz de forecast por vendedor.
- Agenda de pipeline review.
- Lista de dependencias reales.

## Competencias desarrolladas

- Forecasting comercial.
- Pipeline governance.
- Sales Operations.

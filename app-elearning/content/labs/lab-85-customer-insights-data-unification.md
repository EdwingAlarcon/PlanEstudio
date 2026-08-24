---
id: lab-85
title: "Customer Insights Data Unification"
level: "N6"
duration: 150
product: ["Dynamics 365 Customer Insights - Data", "Dataverse", "Power BI"]
certifications: ["Dynamics 365 Customer Insights"]
role: ["Data Specialist", "Consultor Funcional D365 CE"]
prerequisites:
  - "Módulo 58 estudiado: Customer Insights - Data"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 85 — Customer Insights Data Unification

## Objetivo

Diseñar un modelo de unificación de perfiles con fuentes, matching, medidas, segmentos y activación.
La unificación real requiere Customer Insights - Data, fuentes conectadas y permisos.

Este lab parte del diseño base del Lab 67 y lo convierte en un entregable avanzado de proyecto:
readiness de tenant, frecuencia de actualización, matching exacto/difuso, gobierno de datos,
activación controlada y evidencia para operar Customer 360 sin exponer datos internos.

## Escenario de negocio

SIT tiene contactos en Dataverse, facturación en un CSV legado y casos en Customer Service.

## Gate de ambiente real

Antes de presentar este lab como unificación ejecutada, completa el gate **Customer Insights -
Data** del recurso `/recursos/d365-tenant-readiness`. Sin Customer Insights - Data habilitado y
fuentes conectadas, la entrega es **Simulado**.

## Pasos detallados

### Paso 1 — Fuentes

Documenta 3 fuentes con campos clave, calidad de datos, frecuencia de actualización, owner,
volumen esperado y latencia tolerable. Si usas los mismos datos del Lab 67, amplíalos con al menos
5 registros adicionales y casos ambiguos de identidad.

### Paso 2 — Matching

Define reglas exactas y difusas para unir perfiles.

Incluye umbrales de confianza y una cola de revisión manual para matches ambiguos. Documenta dos
falsos positivos posibles y cómo evitarlos.

### Paso 3 — Medidas

Crea 3 medidas: LTV, casos últimos 90 días y riesgo de renovación.

### Paso 4 — Segmento

Diseña un segmento activable hacia Journeys o Sales.

### Paso 5 — Gobierno

Matriz de propósito, retención, consentimiento/base legal y destino.

### Paso 6 — Operación y activación controlada

Define monitoreo de calidad posterior a la unificación: tasa de duplicados, perfiles sin email,
matches manuales pendientes, fuentes atrasadas y segmentos activados. Indica qué métrica detiene
la activación hacia Journeys o Sales.

## Validaciones

- [ ] Hay reglas de matching documentadas.
- [ ] Las medidas indican fórmula y fuente.
- [ ] El segmento tiene destino de activación.
- [ ] Hay matriz de gobierno de datos.
- [ ] Hay métricas operativas de calidad y criterio para detener activación.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Matriz de fuentes.
- Reglas de matching.
- Catálogo de medidas.
- Segmento y destino.
- Tablero o matriz de calidad post-unificación.

## Competencias desarrolladas

- Customer 360.
- Identity resolution.
- Gobierno de datos de cliente.

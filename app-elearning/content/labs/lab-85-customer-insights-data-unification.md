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

## Requisitos no funcionales

- **Calidad de datos:** define umbrales que detienen la activación si la unificación no es confiable.
- **Privacidad:** cada fuente declara propósito, retención y base de consentimiento o interés legítimo.
- **Gobernanza:** los matches ambiguos tienen owner y cola de revisión manual.
- **Operación:** las fuentes atrasadas, duplicados y perfiles incompletos generan acción correctiva.

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

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Fuentes y calidad | 20% | Matriz de fuentes con formato, frecuencia y campos clave documentados |
| Reglas de matching | 25% | Al menos 2 reglas (exacta + probabilística/fuzzy) con orden de prioridad definido |
| Medidas | 15% | Cada medida declara fórmula y fuente, no solo el nombre |
| Segmento y activación | 15% | Segmento con criterio verificable y destino de activación real (Journeys o Sales) |
| Gobierno de datos | 15% | Matriz de propósito/retención/consentimiento completa |
| Operación y calidad | 10% | Métrica de calidad con umbral que detiene la activación |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Reglas de matching solo exactas | Parece suficiente en datos de prueba pequeños | Agregar al menos una regla probabilística/fuzzy y documentar su umbral de confianza |
| Medida sin fórmula documentada | Se nombra la medida pero no cómo se calcula | Escribir la fórmula exacta y la fuente de cada campo que usa |
| Segmento sin destino de activación | Se diseña el segmento como ejercicio aislado | Todo segmento debe declarar a dónde se activa (Journeys, Sales u otro) |
| Confundir Customer Insights - Data con Journeys | Se mezcla unificación de perfiles con ejecución de campañas | Data es CDP (unificación); Journeys es ejecución de marketing — ver [Ruta dedicada Journeys](/rutas/dynamics-365-customer-insights-journeys) |

## Reto adicional

Diseña una regla de supresión: un perfil que cumple el criterio del segmento pero que, por una señal
de gobierno de datos (ej. solicitud de baja reciente), debe excluirse igual de la activación.
Documenta cómo se resuelve el conflicto entre "califica por segmento" y "debe excluirse por gobierno".

## Solución de referencia

Después de completar tu intento, compara tu diseño con
[Soluciones de Referencia para Capstones](/recursos/soluciones-referencia-capstones#lab-085--customer-insights-data).
Enfócate en reglas de matching, umbrales de activación y gobierno de datos.

## Competencias desarrolladas

- Customer 360.
- Identity resolution.
- Gobierno de datos de cliente.

---
id: lab-81
title: "Sales Forecasting & Pipeline Review"
level: "N6"
duration: 120
product: ["Dynamics 365 Sales", "Dataverse", "Power BI"]
certifications: ["Dynamics 365 Sales", "MB-280 (retirado 31 jul 2026)"]
role: ["Consultor Funcional D365 CE", "Sales Operations Analyst"]
prerequisites:
  - "Módulo 61 estudiado: Dynamics 365 Sales Avanzado"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 81 — Sales Forecasting & Pipeline Review

## Objetivo

Diseñar una revisión avanzada de pipeline y forecast para un equipo B2B usando oportunidades,
forecast categories, cuotas, riesgos y acciones de seguimiento. La ejecución visual de forecasting
requiere tenant con Dynamics 365 Sales; sin tenant, el entregable se completa como diseño y matriz.

Este lab **no repite** el flujo Lead-to-Cash del Lab 66. Asume que Lead, Opportunity, productos,
Quote y Order ya existen o fueron definidos allí. Aquí evalúas si el pipeline es confiable para
dirección comercial: forecast, cuota, gap, riesgos y cadencia de revisión.

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

## 🔧 Requisitos de tenant y fallos frecuentes

**Licencia y rol mínimo**

El forecasting configurable, las jerarquías comerciales y los AI insights de pipeline requieren
**Dynamics 365 Sales Enterprise**; con **Sales Professional** el modelo de forecast no está
disponible o está muy limitado. Para configurar jerarquías y ver el forecast de todo un equipo se
necesita el rol de seguridad **Sales Manager** (no basta con **Salesperson**, que solo ve sus
propias oportunidades); crear o publicar el modelo de forecast en sí normalmente requiere además un
rol administrativo del entorno (System Administrator o un rol equivalente de Sales admin).

**Configuración previa**

- Unidad de negocio y jerarquía de gerentes/vendedores ya creada en Dataverse (campo "Manager" del
  usuario completo).
- Equipo comercial con roles de seguridad (Salesperson/Sales Manager) ya asignados.
- Moneda base y año fiscal definidos en el entorno antes de crear cuotas.
- Catálogo de productos/precios existente (aunque este lab no lo vuelva a documentar).

**Fallos frecuentes de licencia, rol y configuración de tenant**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece la opción de configurar "Forecasting" en el área de Sales. | Licencia Sales Professional en vez de Enterprise, o el forecast no fue habilitado por un administrador. | Revisar en el Centro de administración de Power Platform qué licencia tiene asignada el usuario y si existe un modelo de forecast creado. | Solicitar licencia Enterprise o pedir a un administrador que habilite/publique el forecast. |
| El vendedor solo ve sus propias oportunidades, no las de su equipo. | El rol de seguridad asignado (ej. Salesperson) tiene el privilegio de lectura sobre Opportunity limitado a nivel "Usuario". | Revisar el nivel de acceso (Usuario/Unidad de negocio/Padre-hijo/Organización) del privilegio Read en Opportunity para ese rol. | Asignar el rol Sales Manager o ampliar el nivel de acceso del rol correspondiente. |
| La jerarquía de gerentes no se refleja en el rollup del forecast. | El campo "Manager" del usuario no está completo, o la jerarquía de posiciones no coincide con la estructura de seguridad. | Revisar el campo Manager en el registro de usuario y la configuración de jerarquía de posición. | Completar el campo Manager y regenerar/republicar el modelo de forecast. |
| Las forecast categories no son configurables o el modelo de forecast no se ve actualizado. | El modelo de forecast quedó en borrador y nunca se publicó. | Verificar en el área de administración de Sales si el forecast aparece en estado "Publicado". | Publicar (o republicar tras un cambio) el modelo de forecast desde la configuración de Sales. |

## Pasos detallados

### Paso 1 — Modelo de etapas

Define 5 etapas comerciales con criterios de entrada/salida y campos obligatorios, pero enfocadas
en calidad de forecast: qué información debe existir para pasar de Pipeline a Best Case,
Committed y Closed/Won. No vuelvas a documentar conversión Lead -> Opportunity ni Quote -> Order,
salvo como referencia al Lab 66.

### Paso 2 — Datos de pipeline

Crea 8 oportunidades con vendedor, cuenta, valor, fecha estimada, etapa, probabilidad, forecast
category, next step y riesgo.

### Paso 3 — Matriz de forecast

Agrupa por vendedor y periodo: cuota, pipeline, best case, committed, won y gap.

### Paso 4 — Pipeline review

Prepara una agenda de 30 minutos con preguntas por oportunidad riesgosa y decisión esperada.

Incluye una sección de **pipeline hygiene** con reglas para oportunidades sin next step, cierre
estimado vencido, probabilidad manual incoherente con etapa, descuentos fuera de política y
oportunidades infladas para cubrir cuota.

### Paso 5 — Requisitos de tenant/licencia

Lista qué se necesita para implementar: licencias Sales, jerarquía comercial, forecast configurado,
seguridad, productos/precios y datos históricos.

### Paso 6 — Acciones ejecutivas post-review

Para las 3 oportunidades de mayor riesgo, define la acción posterior a la reunión: mantener,
degradar de forecast category, escalar a gerente, pedir apoyo técnico o sacar del commit. Cada
acción debe tener owner, fecha compromiso y evidencia esperada antes del siguiente review.

## Validaciones

- [ ] Hay 8 oportunidades con categoría de forecast y next step.
- [ ] La matriz muestra gap contra cuota.
- [ ] Se identifican al menos 3 riesgos comerciales con acción.
- [ ] Se documentan dependencias de tenant/licencia.
- [ ] Las acciones post-review tienen owner, fecha y decisión de forecast.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Matriz de pipeline.
- Matriz de forecast por vendedor.
- Agenda de pipeline review.
- Lista de dependencias reales.
- Registro de acciones post-review por oportunidad riesgosa.

## Competencias desarrolladas

- Forecasting comercial.
- Pipeline governance.
- Sales Operations.

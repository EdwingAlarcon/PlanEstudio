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
lastVerified: "2026-09"
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
- Tenant Dynamics 365 Sales si deseas validar forecast real. Un ambiente Developer no sirve, porque
  no admite apps de Dynamics 365. La opción habitual es la trial de 30 días de Sales: cómo pedirla,
  qué cuenta exige y cómo pasar de la app **Sales trial** a **Sales Hub** están en la ruta con trial
  del Módulo 61. Sin trial, entrega la matriz y marca el lab como **Simulado**.

## Gate de ambiente real

Antes de presentar este lab como ejecución real, completa el gate **Sales avanzado** del recurso
`/recursos/d365-tenant-readiness`. Si no hay licencia Sales, jerarquía, cuotas y forecast
configurable, marca la entrega como **Simulado**.

## 🔧 Requisitos de tenant y fallos frecuentes

**Licencia y rol mínimo**

Learn asigna los roles de forecasting a **Dynamics 365 Sales Enterprise** y **Sales Premium**. Con
**Sales Professional**, compruébalo en la tabla comparativa de licencias antes de prometerlo. El
forecasting predictivo (columna **Prediction**) exige una licencia específica
([Learn: premium forecasting](https://learn.microsoft.com/dynamics365/sales/configure-premium-forecasting)).
Los roles que Learn documenta son estos ([Learn: roles de seguridad de Sales](https://learn.microsoft.com/dynamics365/sales/security-roles-for-sales)):

- **Forecast Manager:** configura, clona, desactiva, ajusta o elimina forecasts.
- **Forecast User:** ve el forecast y su detalle.
- **Sales Manager:** incluye forecasting y gestión de productos y objetivos, además de los
  privilegios de **Salesperson**.
- **System Administrator:** puede hacer todo lo anterior.

Quién ve un forecast lo decide también el paso **Permissions** de su configuración. Si en tu trial no
aparece la opción de configurarlo, revisa la primera fila de la tabla.

**Configuración previa**

- Unidad de negocio y jerarquía de gerentes/vendedores ya creada en Dataverse (campo "Manager" del
  usuario completo).
- Equipo comercial con roles de seguridad (Salesperson/Sales Manager) ya asignados.
- Moneda base y año fiscal definidos en el entorno antes de crear cuotas.
- Catálogo de productos/precios existente (aunque este lab no lo vuelva a documentar).

**Fallos frecuentes de licencia, rol y configuración de tenant**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece **Forecast configuration** en **App Settings** > **Performance management** de Sales Hub. | El usuario no tiene lectura sobre la entidad de configuración de forecasts, la app es personalizada y no tiene la entrada en el mapa del sitio, o la licencia no incluye la función. | Revisar los roles del usuario y, en el Microsoft 365 admin center, la licencia que tiene asignada. En un trial, comprobar que estás en **Sales Hub** y no en la app **Sales trial**. | Asignar el rol **Forecast Manager** ([Learn: solución de problemas de forecasting](https://learn.microsoft.com/troubleshoot/dynamics-365/sales/troubleshoot-forecast-issues)) o añadir la entrada al mapa del sitio de la app personalizada. |
| El vendedor solo ve sus propias oportunidades, no las de su equipo. | El rol de seguridad asignado (ej. Salesperson) tiene el privilegio de lectura sobre Opportunity limitado a nivel "Usuario". | Revisar el nivel de acceso (Usuario/Unidad de negocio/Padre-hijo/Organización) del privilegio Read en Opportunity para ese rol. | Asignar el rol Sales Manager o ampliar el nivel de acceso del rol correspondiente. |
| La jerarquía de gerentes no se refleja en el rollup del forecast. | El campo **Manager** del usuario no está completo o no cuelga del **Top of hierarchy**. | Revisar el campo Manager del usuario y la sección **Preview** del paso **General** de la configuración. | Completar el campo Manager y recalcular el forecast con **Recalculate data** en la página **Forecasts**. |
| El forecast no se ve o no se actualiza. | El forecast no se activó, o su último periodo ya venció. | En **App Settings** > **Performance management** > **Forecast configuration**, comprobar que el estado es **Active** y que los periodos están en **Completed**. | Activarlo con **Activate forecast** en el paso **Activate & add quotas**. Tras subir cuotas o hacer ajustes, esperar hasta dos horas. Un forecast configurado se recalcula cada 24 horas; si cambiaste oportunidades fuera de la grilla, usar **Recalculate data** ([Learn: ver forecasts](https://learn.microsoft.com/dynamics365/sales/view-forecasts)). Solo puede haber seis forecasts activos a la vez. |

## Pasos detallados

### Paso 1 — Modelo de etapas

Define 5 etapas comerciales con criterios de entrada/salida y campos obligatorios, pero enfocadas
en calidad de forecast: qué información debe existir para pasar de Pipeline a Best Case,
Committed y Closed/Won. No vuelvas a documentar conversión Lead -> Opportunity ni Quote -> Order,
salvo como referencia al Lab 66.
Won y Lost no se eligen a mano como forecast category: se asignan al cerrar la oportunidad con **Close as Won** / **Close as Lost**.

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

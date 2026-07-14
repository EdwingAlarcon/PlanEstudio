---
id: lab-75
title: "JR-005 — Data Migration to Dynamics 365"
level: "N4"
duration: 300
product: ["Dataverse", "Dynamics 365", "Data Migration"]
certifications: ["PL-400", "Data Migration"]
role: ["Migration Specialist", "Solution Architect"]
prerequisites:
  - "Módulo 34 revisado: integraciones empresariales"
  - "Módulo 37 estudiado: estrategias de migración empresarial"
  - "Ruta Job-Ready Data Migration + CRM Legacy revisada"
---

# Lab 75 — JR-005: Data Migration to Dynamics 365

## Objetivo

Diseñar una migración de datos hacia Dynamics 365/Dataverse con assessment, mapping, cleansing,
staging, carga por lotes, reconciliación y cutover.

## Escenario de negocio

**Empresa ficticia:** Northwind Equipos Médicos.

Northwind migra desde un CRM legacy con cuentas, contactos, oportunidades y actividades. El
objetivo no es mover todos los datos a ciegas, sino construir un paquete de migración defendible
ante negocio y tecnología.

## Rol del estudiante

Actúas como Migration Specialist responsable de documentar y validar la estrategia.

## Herramientas necesarias

- Hoja de cálculo para mapping.
- Markdown/Word para plan y runbook.
- Dataverse/Dataflow/ADF si tienes ambiente.
- Si no tienes herramientas, entrega artefactos de diseño y validación.

## Entregables

- Assessment del sistema origen.
- Mapping origen-destino.
- Reglas de limpieza.
- Diseño de staging.
- Estrategia de carga.
- Reporte de reconciliación.
- Runbook de cutover.

## Pasos detallados

### Paso 1 — Assessment

Documenta:

| Area | Pregunta |
|---|---|
| Volumen | ¿Cuántos registros por tabla? |
| Calidad | ¿Hay duplicados, nulos o campos obsoletos? |
| Dependencias | ¿Qué relaciones deben preservarse? |
| Integraciones | ¿Qué sistemas crean o consumen datos? |
| Historico | ¿Qué años se migran y qué se archiva? |

### Paso 2 — Mapping

Crea un workbook:

| Origen | Campo origen | Dataverse destino | Campo destino | Transformación | Regla |
|---|---|---|---|---|---|
| account_legacy | customer_name | Account | name | Trim + proper case | Obligatorio |
| contact_legacy | email | Contact | emailaddress1 | Lowercase | Validar formato |
| opportunity_legacy | close_date | Opportunity | estimatedclosedate | Date parse | Rechazar inválidas |

### Paso 3 — Staging

Diseña tablas:

- `stg_account_main`
- `stg_account_success`
- `stg_account_error`

Incluye `source_id`, `batch_id`, `processing_status`, `error_message` y `dataverse_id`.

### Paso 4 — Reconciliacion

Define:

- Conteo origen vs staging.
- Conteo staging vs Dataverse.
- Muestra funcional por tabla.
- Registros rechazados por causa.
- Aprobación de usuario clave.

### Paso 5 — Cutover

Escribe un runbook con:

- Freeze de datos.
- Carga delta.
- Validación final.
- Go/no-go.
- Rollback.
- Comunicación a usuarios.

## Criterios de validación

- [ ] El mapping cubre tablas principales.
- [ ] Hay reglas de limpieza claras.
- [ ] Staging permite reintentos.
- [ ] Reconciliación separa validación técnica y funcional.
- [ ] Cutover incluye rollback.

## Rúbrica

| Criterio | Peso |
|---|---|
| Mapping | 30% |
| Limpieza y staging | 25% |
| Reconciliacion | 25% |
| Cutover | 20% |

## Errores comunes

- Migrar todo el histórico sin criterio.
- No preservar IDs externos.
- No documentar rechazados.
- Confundir conteo técnico con aceptación funcional.

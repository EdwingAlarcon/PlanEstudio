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

## Perfil laboral y skill validado

**Vacante objetivo:** Migration Specialist / Solution Architect responsable de decidir qué se migra,
qué se limpia y cómo se valida antes de un cutover.

**Skill concreto que valida:** capacidad de construir un mapping origen-destino con reglas de
transformación explícitas, diseñar staging que permita reintentos sin duplicar datos, y separar
validación técnica (conteos) de validación funcional (aprobación de negocio) — el error más común de
un migration junior es confundir ambas.

## Escenario de negocio

**Empresa ficticia:** Northwind Equipos Médicos — 40.000 cuentas, 65.000 contactos, 12.000
oportunidades en el CRM legacy a migrar.

Northwind migra desde un CRM legacy con cuentas, contactos, oportunidades y actividades. El
objetivo no es mover todos los datos a ciegas, sino construir un paquete de migración defendible
ante negocio y tecnología.

## Rol del estudiante

Actúas como Migration Specialist responsable de documentar y validar la estrategia.

## Herramientas necesarias

- Hoja de cálculo para mapping.
- Markdown/Word para plan y runbook.
- Dataverse/Dataflow/ADF si tienes ambiente.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con tenant real:** carga un subset representativo (100-200 registros por tabla) usando el
  mapping del Paso 2 y ejecuta la reconciliación del Paso 4 contra datos reales.
- **Sin tenant/herramientas de carga:** entrega el assessment, el mapping completo, el diseño de
  staging y el runbook de cutover como artefactos de diseño — declarando que la reconciliación es
  proyectada, no ejecutada.

## Datos de prueba (muestra del origen legacy)

Usa esta muestra de 5 registros de `account_legacy` para ejercitar tus reglas de limpieza del Paso 2:

| id_legacy | customer_name (crudo) | email (crudo) | Problema a resolver |
|---|---|---|---|
| L-1001 | "  ACME medical supply  " | ACME@CLIENTE.COM | espacios + mayúsculas |
| L-1002 | "Acme Medical Supply" | acme@cliente.com | duplicado funcional de L-1001 |
| L-1003 | "N/A" | (vacío) | registro basura, candidato a excluir |
| L-1004 | "Clínica San Rafael" | clinica.sanrafael@gmail.com | válido, requiere solo trim/case |
| L-1005 | "Distribuidora López & Cía." | lopez@cia-legacy.co | caracteres especiales en nombre |

## Entregables

- Assessment del sistema origen.
- Mapping origen-destino.
- Reglas de limpieza (aplicadas a los 5 registros de la muestra).
- Diseño de staging.
- Estrategia de carga.
- Reporte de reconciliación.
- Runbook de cutover.

## Pasos detallados

### Paso 1 — Assessment

Documenta:

| Area | Pregunta |
|---|---|
| Volumen | ¿Cuántos registros por tabla? (usa 40.000/65.000/12.000 como referencia) |
| Calidad | ¿Hay duplicados, nulos o campos obsoletos? (ver muestra: L-1002 duplica L-1001, L-1003 es basura) |
| Dependencias | ¿Qué relaciones deben preservarse? |
| Integraciones | ¿Qué sistemas crean o consumen datos? |
| Historico | ¿Qué años se migran y qué se archiva? |

### Paso 2 — Mapping

Crea un workbook aplicando las reglas a la muestra de arriba:

| Origen | Campo origen | Dataverse destino | Campo destino | Transformación | Regla |
|---|---|---|---|---|---|
| account_legacy | customer_name | Account | name | Trim + proper case | Obligatorio |
| account_legacy | email | Contact | emailaddress1 | Lowercase | Validar formato |
| opportunity_legacy | close_date | Opportunity | estimatedclosedate | Date parse | Rechazar inválidas |

Para L-1001/L-1002: documenta el criterio de deduplicación que usarías (ej. normalizar
`customer_name` a minúsculas sin espacios y comparar). Para L-1003: documenta el criterio de
exclusión (ej. `customer_name` en lista de valores basura como "N/A", "-", vacío).

### Paso 3 — Staging

Diseña tablas:

- `stg_account_main`
- `stg_account_success`
- `stg_account_error`

Incluye `source_id`, `batch_id`, `processing_status`, `error_message` y `dataverse_id`. Documenta en
qué tabla caería cada uno de los 5 registros de la muestra tras el Paso 2.

### Paso 4 — Reconciliacion

Define:

- Conteo origen vs staging.
- Conteo staging vs Dataverse.
- Muestra funcional por tabla (usa los 5 registros de la muestra como caso de referencia).
- Registros rechazados por causa (L-1003 debería aparecer aquí con causa "registro basura").
- Aprobación de usuario clave.

### Paso 5 — Cutover

Escribe un runbook con:

- Freeze de datos.
- Carga delta.
- Validación final.
- Go/no-go.
- Rollback.
- Comunicación a usuarios.

## Decisiones que debes tomar

- **¿L-1002 se descarta o se fusiona con L-1001?** Ambas opciones son defendibles — documenta el
  criterio (ej. conservar el registro con más actividad relacionada) y qué pasa con las referencias
  al registro descartado.
- **¿Qué umbral de error por lote detiene la carga completa vs. permite continuar?** (ej. ¿1% de
  filas en `stg_account_error` es aceptable o debe pausar el batch?)
- **¿El rollback revierte solo los datos migrados o también reactiva el sistema legacy?** Explica el
  impacto operativo de cada opción.

## Criterios de validación

- [ ] El mapping cubre tablas principales y resuelve los 5 casos de la muestra.
- [ ] Hay reglas de limpieza claras y aplicadas, no solo enunciadas.
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

## Preguntas de entrevista asociadas

- "¿Cómo decides si dos cuentas son duplicadas o solo parecidas?" — respuesta esperada: normalizar
  campos clave (nombre, email, tax id) y definir un umbral o regla determinística, no "a ojo".
- "¿Qué haces con un registro que falla en 3 de 3 intentos de carga?" — respuesta esperada: queda en
  `stg_account_error` con causa documentada, se excluye del batch, se revisa manualmente — no bloquea
  el resto de la migración.
- "¿Por qué la reconciliación técnica (conteos) no es suficiente para dar el go-live?" — respuesta
  esperada: los conteos pueden cuadrar y aun así los datos estar mal mapeados; se necesita
  aprobación funcional sobre una muestra real.

## Qué no debe sobreprometerse

Este lab entrena el diseño y la disciplina de una migración; no sustituye una migración piloto real
contra el volumen completo de producción, que revela problemas de performance y de calidad de datos
que una muestra de 5 registros no puede exponer.

## Errores comunes

- Migrar todo el histórico sin criterio.
- No preservar IDs externos.
- No documentar rechazados.
- Confundir conteo técnico con aceptación funcional.

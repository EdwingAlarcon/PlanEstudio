---
id: lab-76
title: "JR-006 — PPAC Governance Assessment"
level: "N4"
duration: 240
product: ["Power Platform Admin Center", "Dataverse", "Governance"]
certifications: ["Governance", "Arquitectura Power Platform"]
role: ["Power Platform Admin", "Governance Specialist", "Solution Architect"]
prerequisites:
  - "Módulo 31 estudiado: Enterprise Architecture y Gobernanza"
  - "Módulo 32 estudiado: CoE y gobierno"
  - "Ruta Job-Ready Admin/Governance revisada"
---

# Lab 76 — JR-006: PPAC Governance Assessment

## Objetivo

Realizar un assessment de gobierno Power Platform con ambientes, DLP, seguridad, capacidad,
licenciamiento, Managed Environments y soporte operativo.

## Escenario de negocio

**Empresa ficticia:** Global Retail Andino.

La organización tiene múltiples apps creadas sin control central. La dirección pide un informe
práctico: qué revisar primero, qué riesgos existen y qué controles aplicar.

## Rol del estudiante

Actúas como Power Platform Admin/Governance Specialist.

## Herramientas necesarias

- Power Platform Admin Center si tienes tenant.
- Microsoft Purview / M365 audit logs como referencia conceptual.
- Markdown/Word para informe.
- Si no tienes tenant, usa inventario simulado.

## Entregables

- Inventario de ambientes.
- Matriz de DLP.
- Revisión de security roles.
- Estimación de capacidad/licencias.
- Decisión sobre Managed Environments.
- Runbook de incidentes.
- Informe ejecutivo.

## Pasos detallados

### Paso 1 — Inventario

Documenta:

| Ambiente | Tipo | Dueño | Proposito | Criticidad | Riesgo |
|---|---|---|---|---|---|
| Default | Default | TI | Uso general | Media | Apps sin gobierno |
| DEV-CRM | Developer | Equipo CRM | Desarrollo | Baja | Datos de prueba |
| PROD-OPS | Production | Operaciones | Apps críticas | Alta | Sin DLP revisada |

### Paso 2 — DLP

Clasifica conectores:

- Business: Dataverse, SharePoint corporativo, Outlook.
- Non-business: Twitter/X, Dropbox personal, conectores no aprobados.
- Blocked: conectores de alto riesgo.

Explica qué flujo quedaría bloqueado y por qué.

### Paso 3 — Capacidad y licencias

Incluye:

- Dataverse database/file/log capacity.
- Apps premium.
- Usuarios con licencias inconsistentes.
- Riesgo de habilitar Managed Environments sin presupuesto.

### Paso 4 — Operación

Diseña un runbook:

- Flujo fallando en producción.
- App con permisos excesivos.
- Exportación sospechosa.
- Ambiente sin dueño.

## Criterios de validación

- [ ] El informe prioriza riesgos.
- [ ] DLP está explicado para negocio.
- [ ] Hay estrategia de ambientes.
- [ ] Hay decisión de Managed Environments.
- [ ] Hay runbook de incidentes.

## Rúbrica

| Criterio | Peso |
|---|---|
| Diagnóstico | 30% |
| Controles | 25% |
| Recomendaciones | 25% |
| Evidencia | 20% |

## Errores comunes

- Proponer CoE sin operación diaria.
- Activar controles sin evaluar impacto.
- Ignorar licenciamiento.
- No asignar dueños de ambientes.

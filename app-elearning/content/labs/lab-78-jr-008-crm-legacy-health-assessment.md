---
id: lab-78
title: "JR-008 — CRM Legacy Health Assessment"
level: "N4"
duration: 180
product: ["Dynamics CRM On-Premises", "SQL Server", "IIS", "Dataverse"]
certifications: ["CRM Legacy", "Arquitectura Power Platform"]
role: ["Legacy Consultant", "Migration Specialist", "Solution Architect"]
prerequisites:
  - "Módulo 39 estudiado: casos de transformación digital"
  - "Ruta Job-Ready Data Migration + CRM Legacy revisada"
---

# Lab 78 — JR-008: CRM Legacy Health Assessment

## Objetivo

Crear un health assessment conceptual para un Dynamics CRM on-premises antes de una migración a
Dynamics 365 cloud.

## Escenario de negocio

**Empresa ficticia:** Seguros Horizonte.

Opera Dynamics CRM 2016 on-premises con customizaciones, integraciones y problemas de rendimiento.
La dirección quiere saber si debe actualizar, migrar o rediseñar.

## Rol del estudiante

Actúas como Legacy/Migration Consultant. No necesitas administrar un servidor real; debes saber
qué revisar, qué preguntar y cómo comunicar riesgos.

## Herramientas necesarias

- Plantilla Markdown/Word para assessment.
- Diagrama de arquitectura.
- Inventario simulado de servidores, bases e integraciones.

## Entregables

- Health assessment.
- Matriz de riesgos.
- Inventario de customizaciones.
- Recomendación de migración.
- Roadmap de mitigación.

## Pasos detallados

### Paso 1 — Inventario técnico

Documenta:

| Componente | Preguntas |
|---|---|
| SQL Server | Version, tamaño DB, mantenimiento, indices, backups |
| IIS | App pools, autenticacion, certificados, logs |
| CRM Server | Version/build, roles, jobs, async service |
| Integraciones | APIs, SSIS, plugins full trust, servicios externos |
| Red | Latencia, firewall, DNS, certificados |

### Paso 2 — Customizaciones

Clasifica:

- Formularios y vistas.
- JavaScript legacy.
- Plugins.
- Workflows clásicos.
- Reportes SSRS.
- Integraciones directas a SQL.

### Paso 3 — Riesgos

| Riesgo | Impacto | Probabilidad | Mitigacion |
|---|---|---|---|
| JavaScript usa APIs obsoletas | Alto | Alta | Refactor a formContext |
| Integracion lee SQL directo | Alto | Media | Reemplazar por API/Dataverse |
| Workflows sin dueño | Medio | Alta | Inventario y racionalizacion |

### Paso 4 — Recomendación

Propón una de estas rutas:

- Upgrade previo y luego migración.
- Migración incremental por módulo.
- Rediseño funcional sobre Dataverse.
- Mantener legacy temporal con integración controlada.

## Criterios de validación

- [ ] El assessment separa hechos, riesgos y recomendaciones.
- [ ] Incluye SQL, IIS, CRM, red e integraciones.
- [ ] Identifica customizaciones problemáticas.
- [ ] Propone roadmap realista.
- [ ] Explica limitaciones por no tener acceso real al servidor.

## Rúbrica

| Criterio | Peso |
|---|---|
| Diagnóstico | 40% |
| Riesgos | 25% |
| Roadmap | 20% |
| Comunicación ejecutiva | 15% |

## Errores comunes

- Recomendar migración sin inventario.
- Ignorar integraciones directas a SQL.
- No revisar workflows/plugins legacy.
- No comunicar incertidumbre por falta de acceso real.

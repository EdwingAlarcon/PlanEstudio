---
id: lab-77
title: "JR-007 — Customer Service Specialist Job Simulation"
level: "N3"
duration: 240
product: ["Dynamics 365 Customer Service", "Dataverse", "Power Automate"]
certifications: ["PL-200", "Especialista Dynamics 365 CE"]
role: ["CRM Functional", "Customer Service Specialist"]
prerequisites:
  - "Módulo 20 estudiado: Dynamics 365 CE Sales y Customer Service"
  - "Lab 68 revisado: Customer Service Case-to-Resolution"
  - "Ruta Job-Ready CRM Functional revisada"
---

# Lab 77 — JR-007: Customer Service Specialist Job Simulation

## Objetivo

Simular una prueba laboral de Customer Service: casos, colas, SLA, entitlements, knowledge base,
dashboard, soporte funcional y UAT.

## Escenario de negocio

**Empresa ficticia:** HelpDesk Regional.

El equipo de soporte necesita demostrar que puede gestionar casos de clientes premium y estándar,
cumplir SLA y dar visibilidad al supervisor.

## Rol del estudiante

Actúas como consultor funcional de Dynamics 365 Customer Service.

## Herramientas necesarias

- Dynamics 365 Customer Service o diseño funcional equivalente.
- Markdown/Excel para UAT y dashboard.
- Power Automate opcional para notificaciones.

## Entregables

- Diseño de ciclo case-to-resolution.
- Configuración o diseño de colas.
- Política de SLA.
- Entitlements.
- Knowledge articles.
- Dashboard operativo.
- Casos UAT.

## Pasos detallados

### Paso 1 — Casos y colas

Define tres tipos de caso:

- Incidente técnico.
- Consulta de facturación.
- Solicitud de información.

Asigna colas y criterios de prioridad.

### Paso 2 — SLA y entitlements

Define:

| Cliente | Plan | Casos incluidos | SLA primera respuesta | SLA resolución |
|---|---|---|---|---|
| Premium | Premium | 50/año | 30 min | 8 h |
| Estándar | Estándar | 20/año | 4 h | 48 h |

### Paso 3 — Knowledge base

Escribe dos artículos:

- Restablecimiento de acceso.
- Consulta de estado de factura.

Define cuándo el agente debe sugerir cada artículo.

### Paso 4 — Dashboard

Incluye KPIs:

- Casos abiertos por cola.
- Casos vencidos.
- Cumplimiento SLA.
- Tiempo promedio de resolución.
- Artículos usados.

### Paso 5 — UAT

Documenta cinco casos UAT con resultado esperado y evidencia.

## Criterios de validacion

- [ ] El proceso cubre creación, asignación, resolución y cierre.
- [ ] SLA y entitlements están conectados.
- [ ] Hay knowledge base funcional o diseñada.
- [ ] El dashboard responde preguntas del supervisor.
- [ ] UAT tiene datos y resultados esperados.

## Rubrica

| Criterio | Peso |
|---|---|
| Proceso funcional | 35% |
| SLA/colas | 25% |
| Reporting | 20% |
| Soporte/UAT | 20% |

## Errores comunes

- Confundir cola con rol de seguridad.
- Definir SLA sin pausa/reanudación.
- No documentar entitlement agotado.
- Crear dashboard sin decisiones accionables.

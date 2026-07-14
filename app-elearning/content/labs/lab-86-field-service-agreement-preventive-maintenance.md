---
id: lab-86
title: "Field Service Agreement + Preventive Maintenance"
level: "N6"
duration: 150
product: ["Dynamics 365 Field Service", "Dataverse"]
certifications: ["Dynamics 365 Field Service", "MB-240 (retirado 30 jun 2026)"]
role: ["Consultor Funcional D365 CE", "Field Service Consultant"]
prerequisites:
  - "Módulo 58 estudiado: Field Service End-to-End"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 86 — Field Service Agreement + Preventive Maintenance

## Objetivo

Diseñar un acuerdo de mantenimiento preventivo que genere Work Orders recurrentes con activos,
Incident Types, tareas, repuestos y criterios de cierre. La configuración real requiere Dynamics
365 Field Service.

## Escenario de negocio

SIT mantiene equipos HVAC críticos instalados en clientes premium.

## Gate de ambiente real

Antes de presentar este lab como configuración real, completa el gate **Field Service** del recurso
`/recursos/d365-tenant-readiness`. Sin licencia Field Service, recursos, assets, Incident Types y
Work Orders de prueba, la entrega es **Simulado**.

## Pasos detallados

### Paso 1 — Customer Assets

Define 3 activos con cliente, ubicación, garantía y criticidad.

### Paso 2 — Incident Type

Define duración, skills, tareas obligatorias, inspection y repuestos esperados.

### Paso 3 — Agreement

Diseña frecuencia, ventana de servicio, cobertura y generación de Work Orders.

### Paso 4 — Riesgos

Identifica riesgos de incumplimiento, repuesto faltante y técnico no calificado.

## Validaciones

- [ ] Agreement genera Work Orders recurrentes.
- [ ] Incident Type incluye tareas e inspection.
- [ ] Activos tienen criticidad y garantía.
- [ ] Riesgos tienen mitigación.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Matriz de activos.
- Diseño de Agreement.
- Incident Type completo.
- Matriz de riesgos.

## Competencias desarrolladas

- Field Service agreements.
- Preventive maintenance.
- Diseño operativo de Work Orders.

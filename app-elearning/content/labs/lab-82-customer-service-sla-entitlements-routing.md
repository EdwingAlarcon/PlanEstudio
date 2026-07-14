---
id: lab-82
title: "Customer Service SLA + Entitlements + Routing"
level: "N6"
duration: 150
product: ["Dynamics 365 Customer Service", "Dataverse"]
certifications: ["Dynamics 365 Customer Service"]
role: ["Consultor Funcional D365 CE", "Customer Service Lead"]
prerequisites:
  - "Módulo 61 estudiado: Customer Service Avanzado"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 82 — Customer Service SLA + Entitlements + Routing

## Objetivo

Diseñar un modelo de soporte con entitlements, SLA, colas, routing y escalamiento. La configuración
real de temporizadores, SLA y routing requiere ambiente Dynamics 365 Customer Service.

## Escenario de negocio

SIT ofrece soporte estándar y premium. Los clientes premium tienen respuesta inicial de 1 hora y
resolución de 8 horas hábiles para incidentes críticos.

## Gate de ambiente real

Antes de presentar este lab como ejecución real, completa el gate **Customer Service avanzado** del
recurso `/recursos/d365-tenant-readiness`. Sin ambiente Customer Service, calendario, SLA y colas
configuradas, la entrega es **Simulado**.

## Pasos detallados

### Paso 1 — Catálogo de casos

Define 3 tipos de caso con prioridad, cola inicial, canal permitido y responsable.

### Paso 2 — Entitlements

Diseña 2 entitlements: Standard y Premium, con vigencia, cobertura y consumo.

### Paso 3 — SLA

Crea una matriz para first response y resolution time con calendario, pausa, warning y failure.

### Paso 4 — Routing

Diseña reglas por cliente premium, producto y severidad.

### Paso 5 — Pruebas UAT

Define 6 casos UAT: 3 positivos y 3 negativos, incluyendo pausa/reanudación y breach.

## Validaciones

- [ ] Hay entitlements con cobertura y consumo claros.
- [ ] SLA incluye calendario, pausa, warning y failure.
- [ ] Routing asigna casos a cola correcta.
- [ ] UAT prueba incumplimientos, no solo casos exitosos.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Matriz de entitlements.
- Matriz SLA.
- Reglas de routing.
- Casos UAT.

## Competencias desarrolladas

- Diseño de soporte enterprise.
- SLA operativo.
- Routing funcional.

---
id: lab-88
title: "CE + F&O Dual-write Ownership Matrix"
level: "N6"
duration: 150
product: ["Dynamics 365 Finance", "Dynamics 365 Supply Chain Management", "Dataverse"]
certifications: ["D365 Especialización Integration"]
role: ["Solution Architect", "Integration Consultant"]
prerequisites:
  - "Módulo 64 estudiado: Integración CE + Finance & Operations"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 88 — CE + F&O Dual-write Ownership Matrix

## Objetivo

Construir una matriz de ownership para integración CE + F&O y decidir patrón por entidad. La
configuración real de dual-write requiere entornos Dataverse/F&O conectados y permisos.

Este lab no repite el diseño técnico base del Lab 70. Parte de una arquitectura ya definida y se
centra en operar la integración: ownership por campo, excepciones, monitoreo, reconciliación,
rollback y soporte cuando dual-write no se comporta como se esperaba.

## Escenario de negocio

SIT usa Sales para oportunidades y F&O para clientes financieros, inventario, pedidos y facturas.

## Gate de ambiente real

Antes de presentar este lab como dual-write ejecutado, completa el gate **CE + F&O / dual-write**
del recurso `/recursos/d365-tenant-readiness`. Sin ambientes CE/F&O conectados, mapas soportados,
permisos y prueba de sincronización, la entrega es arquitectura **Simulada**.

## Pasos detallados

### Paso 1 — Entidades

Incluye Account/Customer, Product, Sales Order, Invoice e Inventory.

### Paso 2 — Ownership

Define dueño, consumidor, campos editables, campos solo lectura, regla de conflicto y owner de
aprobación para cambios de ownership. Incluye al menos un campo que sea visible en Sales pero
editable solo en F&O.

### Paso 3 — Patrón

Elige dual-write, DMF, virtual table o integración custom por entidad.

### Paso 4 — Operación

Diseña monitoreo, reconciliación, owner de errores y rollback.

Incluye un runbook de incidentes con severidad, tiempo objetivo de respuesta, responsable
funcional, responsable técnico y criterio para pausar temporalmente un mapa de dual-write.

### Paso 5 — Reconciliación mensual

Diseña una reconciliación mensual entre CE y F&O para Customers, Products, Sales Orders e
Invoices: conteo esperado, campos críticos a comparar, tolerancia aceptada y acción correctiva si
hay diferencia.

## Validaciones

- [ ] Cada entidad tiene dueño y consumidor.
- [ ] Patrón elegido está justificado.
- [ ] Hay regla de conflicto.
- [ ] Hay controles operativos.
- [ ] Existe runbook de incidente y reconciliación mensual por entidad crítica.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Matriz ownership.
- Matriz patrón de integración.
- Plan de monitoreo/reconciliación.
- Runbook de soporte para fallas de dual-write.

## Competencias desarrolladas

- Dual-write architecture.
- Data ownership.
- Integración CE + F&O.

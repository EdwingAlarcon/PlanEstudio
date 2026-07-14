---
id: lab-87
title: "Field Service Mobile Offline + Work Order Lifecycle"
level: "N6"
duration: 150
product: ["Dynamics 365 Field Service", "Field Service Mobile", "Dataverse"]
certifications: ["Dynamics 365 Field Service", "MB-240 (retirado 30 jun 2026)"]
role: ["Field Service Consultant", "Solution Architect"]
prerequisites:
  - "Módulo 58 estudiado: Field Service End-to-End"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 87 — Field Service Mobile Offline + Work Order Lifecycle

## Objetivo

Diseñar el ciclo completo de una Work Order con despacho, ejecución móvil offline, evidencias,
consumo de inventario y cierre. La prueba offline real requiere app móvil, perfil offline y datos
sincronizados.

## Escenario de negocio

Un técnico visita una planta sin señal estable para reparar un equipo crítico.

## Gate de ambiente real

Antes de presentar este lab como prueba móvil real, completa el gate **Field Service** del recurso
`/recursos/d365-tenant-readiness`. Sin app móvil, perfil offline, datos sincronizados y prueba de
sincronización, la entrega es **Simulado**.

## Pasos detallados

### Paso 1 — Ciclo de vida

Documenta estados desde creación hasta cierre y facturación/seguimiento.

### Paso 2 — Perfil offline

Lista datos que deben descargarse: Work Order, tareas, activo, cuenta, contactos, productos y
knowledge articles.

### Paso 3 — Evidencia en campo

Define fotos, firmas, inspection, notas y repuestos consumidos.

### Paso 4 — Sincronización

Diseña qué ocurre si hay conflicto o falla de sync al recuperar conexión.

## Validaciones

- [ ] Perfil offline incluye datos mínimos de operación.
- [ ] El cierre exige evidencia estructurada.
- [ ] Se documenta consumo de inventario.
- [ ] Existe plan de conflicto/sync.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Diagrama del lifecycle.
- Matriz offline.
- Checklist de cierre.
- Plan de sincronización.

## Competencias desarrolladas

- Field Service Mobile.
- Offline readiness.
- Work Order lifecycle.

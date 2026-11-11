---
id: lab-88
title: "CE + F&O Dual-write Ownership Matrix"
level: "N6"
duration: 150
product: ["Dynamics 365 Finance", "Dynamics 365 Supply Chain Management", "Dataverse"]
certifications: ["D365 Especialización Integration"]
role: ["Solution Architect", "Integration Consultant"]
prerequisites:
  - "Módulo 65 estudiado: Integración CE + Finance & Operations"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
lastVerified: "2026-11"
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

## 🔧 Requisitos de tenant y fallos frecuentes

**Licencia y rol mínimo**

Dual-write es una capacidad de integración entre Dataverse y Finance/SCM, no un producto con
licencia propia — pero exige un ambiente de F&O con su licencia y un ambiente de Dataverse
enlazados entre sí. Un ambiente Developer de Power Platform no sirve: Learn indica que ese tipo de
ambiente no admite ninguna carga de Dynamics 365
([Learn: Unified environment types and templates](https://learn.microsoft.com/power-platform/admin/unified-experience/unified-environment-types-and-templates)).
Para operar los mapas necesitas permisos de administración en los dos lados; anota los roles
exactos que te asigne el administrador del ambiente.

**Configuración previa**

- F&O y Dataverse enlazados por la **Power Platform integration**, obligatoria en todo ambiente de
  F&O desde el 1 de mayo de 2025
  ([Learn: Power Platform integration](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/power-platform/overview)),
  o un ambiente unificado creado con una plantilla de F&O en el Power Platform admin center, donde
  F&O y Dataverse viven en el mismo ambiente y las soluciones de dual-write vienen preinstaladas.
- Los table maps se gestionan **desde la app de F&O**, no desde las soluciones de Dataverse:
  **Workspaces** > **Data management** > mosaico **Dual Write**. Si no ves los mapas o la página
  sale en blanco, Learn indica que hay que aplicar (**Apply**) las soluciones de dual-write
  instaladas ([Learn: Enable table maps](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/enable-entity-map)).
- Cada mapa se activa con sus tablas dependientes (el diálogo **Show related table map(s)**) y
  necesita una clave alternativa en Dataverse que coincida con la clave de F&O.
- Los usuarios que crean o editan registros sincronizados necesitan permisos en los dos sistemas.

**Fallos frecuentes de licencia, región o configuración de entorno**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| Los registros no sincronizan y no hay error visible | El mapa está en **Paused** o **Not running** (una alerta con umbral puede pausarlo sola) | En F&O, página **Dual Write**: estado del mapa y su registro de actividad | Corregir la causa, volver a **Run** y revisar **Catch-up errors** antes de que pase un día (la cola purga los registros con error a las 24 horas) |
| La sincronización falla solo para ciertos registros con mensaje relacionado a compañía/legal entity | La compañía (legal entity) del registro no está entre las que se configuraron para dual-write, o la lista superó las 40 legal entities, el máximo para las escrituras iniciales | En la página **Dual Write**, **Environment details** > pestaña **Legal entities**, y la pestaña **Initial sync details** del mapa ([Learn: Edit a legal entity after dual-write setup](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/edit-legal-entity)) | **Add legal entity** con la compañía faltante > **Save**, y volver a ejecutar la sincronización inicial del mapa una vez corregido el error ([Learn: Enable table maps](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/enable-entity-map)) |
| Cambios en campos financieros no se reflejan en Sales | La columna no está en el mapeo del mapa, o su dirección es unidireccional de Dataverse a F&O | En F&O, página **Dual Write**: abrir el mapa y revisar el mapeo y el símbolo de dirección de la columna | Detener el mapa, agregar la columna o cambiar su dirección, guardar y volver a **Run**; si dual-write no la soporta, integración custom (ver Paso 3) |
| No aparecen los mapas o la página **Dual Write** sale en blanco | Las soluciones de dual-write están instaladas pero sin aplicar, o el ambiente no está enlazado a Dataverse | Revisar si existe la Power Platform integration del ambiente y si las soluciones de dual-write se aplicaron | **Apply** de las soluciones según Learn; si falta el enlace, lo resuelve el administrador del ambiente |
| La sincronización falla por permisos | El usuario que hace el cambio no tiene permisos en el otro sistema para esa tabla | Leer el error en el registro de actividad del mapa | Asignar el rol de seguridad que falta en F&O o en Dataverse, según el lado que rechazó la escritura |

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

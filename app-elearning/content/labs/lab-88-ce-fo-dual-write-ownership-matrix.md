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
licencia propia — pero exige que ambos entornos (Dataverse y F&O) tengan sus licencias de producto
activas y estén vinculados entre sí (linked environments). En Dataverse, activar o pausar mapas
requiere el rol "System Administrator" o un rol equivalente con acceso a la solución Dual-write; en
F&O, configurar y publicar los flujos de integración que dual-write usa por debajo requiere el rol
"System administrator" o "Data Management".

**Configuración previa**

- El entorno Dataverse y el entorno F&O deben estar vinculados desde el Centro de administración de
  Power Platform (Entornos > vincular entorno Finance and Operations).
- La solución Dual-write instalada en Dataverse, con los mapas base (Customer, Product, etc.)
  habilitados desde la vista Collaborate/Solutions.
- Un usuario/cuenta de integración con permisos suficientes en ambos entornos para que los mapas
  puedan escribir en ambas direcciones.

**Fallos frecuentes de licencia, región o configuración de entorno**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| Los registros no sincronizan y no hay error visible | El mapa de dual-write está sin publicar o quedó pausado tras un error masivo previo | En la solución Dual-write dentro de Dataverse, revisar el estado del mapa y el registro de errores | Republicar el mapa y revisar el registro de errores antes de reactivarlo |
| La sincronización falla solo para ciertos registros con mensaje relacionado a compañía/legal entity | La compañía (legal entity) de F&O del registro no está incluida en el alcance configurado del mapa | En la configuración del mapa de dual-write, revisar la lista de compañías en su scope | Agregar la compañía faltante al scope del mapa o crear un mapa adicional para ella |
| Cambios en campos financieros no se reflejan en Sales | El campo no está incluido en el mapeo de campos del mapa, o dual-write no lo soporta de forma nativa | Revisar el "field mapping" del mapa específico en Dataverse | Agregar el campo si es soportado, o diseñar una integración custom para ese campo (ver Paso 3) |
| Error de "entorno no vinculado" al intentar habilitar un mapa | El vínculo entre el entorno Dataverse y el entorno F&O expiró o nunca se completó | Centro de administración de Power Platform > Entornos > verificar el estado de vínculo con Finance and Operations | Revincular el entorno desde el Centro de administración |
| Falla la sincronización con mensaje de permiso/licencia insuficiente del usuario de integración | El usuario técnico de dual-write no tiene licencia completa de F&O o le falta el rol de seguridad para las entidades sincronizadas | Centro de administración de Power Platform > revisar la licencia asignada a la cuenta de servicio/integración | Asignar la licencia adecuada y el rol de seguridad correspondiente en F&O |

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

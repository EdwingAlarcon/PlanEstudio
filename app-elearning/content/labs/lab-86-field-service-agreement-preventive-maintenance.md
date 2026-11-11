---
id: lab-86
title: "Field Service Agreement + Preventive Maintenance"
level: "N6"
duration: 150
product: ["Dynamics 365 Field Service", "Dataverse"]
certifications: ["Dynamics 365 Field Service", "Field Operations"]
role: ["Consultor Funcional D365 CE", "Field Service Consultant"]
prerequisites:
  - "Módulo 59 estudiado: Field Service End-to-End"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
lastVerified: "2026-11"
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

## 🔧 Requisitos de tenant y fallos frecuentes

> **Sin licencia:** los cuatro pasos se entregan en papel (estado **Simulado**). Para comprobar pantallas puedes usar la trial de 30 días de Field Service (**Try for free** en la [página de producto](https://www.microsoft.com/dynamics-365/products/field-service)): crea su propio tenant, no se añade a tu ambiente del curso, caduca tras 14 días sin uso y, con un correo personal, no se puede extender ([Learn: Trial FAQ](https://learn.microsoft.com/dynamics365/field-service/trial-faq)). Quien crea la trial queda como administrador, así que puede crear Incident Types y Agreements.

### Licencia y rol mínimo

Field Service se licencia por usuario, no por recurso: cada técnico que va a aparecer como Bookable
Resource programable necesita una licencia de usuario Field Service — la SKU completa "Dynamics 365
Field Service" para técnicos internos, o "Dynamics 365 Field Service Contractor" (subconjunto) para
técnicos externos/terceros — no existe una licencia de "recurso" separada de la licencia de usuario.
Rol de seguridad mínimo en Dataverse para configurar Agreements e Incident Types: un rol equivalente
a "Field Service - Administrator"; un usuario con rol solo de "Dispatcher" o "Resource" puede operar
el calendario pero no crear plantillas de Incident Type ni Agreements.

### Configuración previa

- App Field Service instalada en el entorno de Dataverse.
- Al menos una Business Unit/territorio configurado.
- Bookable Resources (técnicos) creados, con horario de trabajo (Resource Hours) asignado.
- Catálogo de habilidades (Characteristics) si el Incident Type va a exigirlas.
- Catálogo de productos/repuestos existente en Dataverse.

### Fallos frecuentes de licencia, recurso y funcionalidad

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| La app Field Service no aparece disponible para instalar o usar en el entorno | Licencia de Dynamics 365 Field Service no comprada o no asignada al usuario | **Microsoft 365 admin center** > **Billing** > **Licenses**, buscando *Dynamics 365 Field Service* ([Learn: Buy and assign licenses](https://learn.microsoft.com/dynamics365/field-service/buy-fs)) | Solicitar la asignación de la licencia Field Service antes de continuar; sin ella el lab queda en estado Simulado |
| Un técnico no aparece disponible para asignarse a los Work Orders del Agreement | Al usuario del técnico no se le asignó la licencia de usuario Field Service (o Field Service Contractor), o el Bookable Resource no tiene Resource Hours configuradas | Revisar el registro del Bookable Resource (horario) y con el administrador del tenant si el usuario tiene la licencia Field Service asignada | Asignar la licencia de usuario Field Service correspondiente y configurar el calendario de disponibilidad del técnico |
| El Agreement no genera los Work Orders recurrentes automáticamente | El Agreement sigue en **System Status** = **Estimate** (no se pasó a **Active**); **Auto Generate Work Order** está en **No**; todavía no se llegó a los días de anticipación (**Generate Work Orders Day in Advance**, siete días si no hay valor); o el propietario del Agreement ya no está en la organización, porque sus procesos corren con los permisos del propietario | En el Booking Setup, sección **Booking Dates**: si las fechas siguen en *Active* y no en *Processed*, aún no se generó el Work Order; revisar el propietario | Activar el Agreement, ajustar la anticipación o usar **Generate Work Order** en la Booking Date; asignar como propietario un usuario de sistema o un equipo ([Learn: Set up agreements](https://learn.microsoft.com/dynamics365/field-service/set-up-agreements-work-orders)) |
| El Incident Type no permite seleccionar ciertos repuestos/productos esperados | El producto no existe, no está **Active** o no tiene **Field Service Product Type** (lo exige para usarse en un Work Order), o el usuario no tiene permisos sobre los productos | Field Service, área **Settings** > **General** > **Products**: verificar el producto, su estado y su tipo | Crear el producto, elegir su **Field Service Product Type** y publicarlo con **Publish** antes de diseñar el Incident Type ([Learn: products and services](https://learn.microsoft.com/dynamics365/field-service/create-product-or-service)) |
| No encuentras dónde agregar la inspection al Incident Type | Las inspections no se agregan directamente: son plantillas que se publican y se asocian a un **Service Task Type**, y esa task se agrega al Incident Type | Área **Settings** > **Work Orders** > **Inspection Templates**; luego **Settings** > **Service Task Types** (**Has Inspection** = **Yes**) | Publicar la plantilla con **Publish and generate a new service task type** y agregar esa task al Incident Type; necesitas el rol **Field Service-Administrator** ([Learn: inspections](https://learn.microsoft.com/dynamics365/field-service/inspections)) |

## Pasos detallados

### Paso 1 — Customer Assets

Define 3 activos con cliente, ubicación, garantía y criticidad.

### Paso 2 — Incident Type

Define duración, skills, tareas obligatorias, inspection y repuestos esperados.

### Paso 3 — Agreement

Diseña frecuencia, ventana de servicio, cobertura y generación de Work Orders. Usa los campos de la Microlección 3 del Módulo 59: **System Status** (**Estimate** mientras lo construyes, **Active** al final), propietario (usuario de sistema o equipo), **Agreement Booking Setup** con **Auto Generate Work Order**, **Generate Work Orders Day in Advance**, **Auto Generate Booking** y **Pre/Post Booking Flexibility**, **Booking Recurrence** y un **Agreement Booking Incident** por activo.

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

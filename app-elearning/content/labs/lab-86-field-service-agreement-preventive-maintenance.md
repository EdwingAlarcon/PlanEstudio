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
| La app Field Service no aparece disponible para instalar o usar en el entorno | Licencia de Dynamics 365 Field Service no asignada al tenant o al usuario administrador | Centro de administración de Power Platform > Recursos > Licencias del entorno | Solicitar la asignación de la licencia Field Service antes de continuar; sin ella el lab queda en estado Simulado |
| Un técnico no aparece disponible para asignarse a los Work Orders del Agreement | Al usuario del técnico no se le asignó la licencia de usuario Field Service (o Field Service Contractor), o el Bookable Resource no tiene Resource Hours configuradas | Revisar el registro del Bookable Resource (horario) y con el administrador del tenant si el usuario tiene la licencia Field Service asignada | Asignar la licencia de usuario Field Service correspondiente y configurar el calendario de disponibilidad del técnico |
| El Agreement no genera los Work Orders recurrentes automáticamente | El Agreement quedó en borrador (no activado), o el proceso en segundo plano de generación de Work Orders no está habilitado en el entorno | Revisar el estado del Agreement (Draft vs Active) y el historial de Work Orders generados | Activar formalmente el Agreement y confirmar con el administrador que el job de generación está habilitado |
| El Incident Type no permite seleccionar ciertos repuestos/productos esperados | El catálogo de productos no está cargado, o el usuario no tiene rol con permisos sobre la tabla de Products | Ventas > Productos: verificar existencia del producto y el rol de seguridad del usuario | Crear/importar los productos en el catálogo antes de diseñar el Incident Type, o solicitar el rol adecuado |
| No se puede activar la funcionalidad de Inspecciones dentro del Incident Type | Las Inspecciones pueden requerir habilitación explícita en la configuración de la app, no disponible por defecto en todos los tenants | Configuración de Field Service > Inspecciones: verificar si el módulo aparece habilitado | Habilitar la funcionalidad desde la configuración de la app, o documentar el paso como "diseñado, no ejecutable en este tenant" si no está disponible |

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

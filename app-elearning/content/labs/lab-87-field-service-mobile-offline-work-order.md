---
id: lab-87
title: "Field Service Mobile Offline + Work Order Lifecycle"
level: "N6"
duration: 150
product: ["Dynamics 365 Field Service", "Field Service Mobile", "Dataverse"]
certifications: ["Dynamics 365 Field Service", "Field Operations"]
role: ["Field Service Consultant", "Solution Architect"]
prerequisites:
  - "Módulo 59 estudiado: Field Service End-to-End"
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

## 🔧 Requisitos de tenant y fallos frecuentes

**Licencia y rol mínimo**

Dynamics 365 Field Service se licencia por usuario, no por recurso: cada técnico que aparece en el
calendario de programación necesita una licencia de usuario Field Service — la SKU completa
"Dynamics 365 Field Service" para técnicos internos, o "Dynamics 365 Field Service Contractor"
(subconjunto) para técnicos externos/terceros — no existe una licencia de "recurso" separada de la
licencia de usuario. Para operar el ciclo de Work Order en la app web, el rol mínimo es
"Field Service - Dispatcher" (creación/despacho) o "Field Service - Resource" (ejecución); el rol
"Field Service - Administrator" solo es necesario para configurar perfiles offline y reglas de
programación, no para el uso diario.

**Configuración previa**

- App Field Service Mobile instalada en el dispositivo y usuario autenticado en el mismo tenant.
- Perfil offline (Mobile Offline Profile) creado y asignado al usuario/rol antes de intentar
  sincronizar por primera vez.
- Al menos un recurso (Bookable Resource) activo con calendario de disponibilidad configurado.

**Fallos frecuentes de licencia, región, canal o app no instalada**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| La app móvil no descarga datos / la sincronización se queda en 0% | El perfil offline no está asignado al usuario, o la app Field Service Mobile no está instalada en el dispositivo | En make.powerapps.com > Field Service > Mobile Offline Profiles, revisar si el usuario aparece en "Mobile Offline Profile User Setting"; confirmar en la tienda de apps del dispositivo que "Field Service (Dynamics 365)" está instalada | Asignar el perfil offline al usuario y reinstalar/reautenticar la app |
| El técnico no aparece disponible para asignar en el calendario | No se le asignó al usuario la licencia de usuario Field Service (o Field Service Contractor) o su registro Bookable Resource no está activo | Centro de administración de Power Platform > usuarios > licencia asignada; en Field Service > Recursos, revisar el estado del Bookable Resource | Asignar la licencia de usuario Field Service correspondiente y activar el registro Bookable Resource |
| No se puede iniciar sesión en Field Service Mobile fuera de la red corporativa | Políticas de acceso condicional de Microsoft Entra ID restringen el inicio de sesión desde ubicaciones o dispositivos no administrados | Microsoft Entra admin center > Conditional Access, revisar políticas activas para el usuario/dispositivo | Solicitar al administrador del tenant una excepción o inscripción del dispositivo (MDM/Intune) |
| Las fotos o firmas capturadas en campo no se sincronizan al recuperar conexión | El tamaño del adjunto supera el límite configurado en el perfil offline, o la conexión se perdió antes de completar la subida | Revisar si el campo de adjuntos del Work Order quedó vacío pese a estar marcado como capturado; revisar el registro de sincronización en la app móvil | Reducir calidad/tamaño de imagen en la app o reintentar la sincronización con conexión estable |
| El módulo de Inventory/Consumo no aparece en la app móvil del técnico | El área "Inventory" no está habilitada en la configuración de app móvil (Mobile App Settings) para ese rol | Field Service > Configuración de app móvil, revisar qué áreas/formularios están habilitados por rol | Habilitar el área de Inventory/Products Used en la configuración de app móvil para ese rol |

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

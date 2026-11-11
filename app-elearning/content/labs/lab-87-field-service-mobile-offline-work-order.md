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
lastVerified: "2026-11"
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

**Sin licencia:** los cuatro pasos se entregan en papel (estado **Simulado**). La trial de 30 días de
Field Service (**Try for free** en la [página de producto](https://www.microsoft.com/dynamics-365/products/field-service))
permite descargar la app móvil y seguir su recorrido guiado; crea su propio tenant, caduca tras 14 días
sin uso y, con un correo personal, no se puede extender
([Learn: Trial FAQ](https://learn.microsoft.com/dynamics365/field-service/trial-faq)).

**Configuración previa**

- App **Dynamics 365 Field Service mobile** instalada en el dispositivo (enlaces de las tiendas en
  [Learn: Download the mobile app](https://learn.microsoft.com/dynamics365/field-service/mobile/download-mobile-app))
  y usuario autenticado en el mismo tenant. Es la app actual, una model-driven app de Power Platform;
  la antigua Field Service Mobile (Xamarin) se retiró en 2022.
- App **Field Service Mobile** compartida con los roles que la usan (**Field Service-Resource**, etc.) y
  técnicos con el rol y el perfil de seguridad de campos **Field Service-Resource**
  ([Learn: Set up the mobile app](https://learn.microsoft.com/dynamics365/field-service/mobile/set-up-field-service-mobile)).
- Offline activado en la app (**Can be used offline**) y el perfil **Field Service Mobile - Offline Profile**
  (o una copia) revisado antes de la primera sincronización
  ([Learn: Set up the mobile offline profile](https://learn.microsoft.com/dynamics365/field-service/mobile/set-up-offline-profile)).
- Al menos un recurso (Bookable Resource) activo con calendario de disponibilidad configurado.
- Ojo: la **nueva experiencia móvil** no admite offline; quien esté habilitado para offline ve la
  experiencia Unified Interface. Para este lab, la experiencia clásica es la correcta.

**Fallos frecuentes de licencia, región, canal o app no instalada**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| La app móvil no descarga datos / el técnico ve poco o nada offline | Offline no está activado en la app, el usuario no está en el perfil (si el acceso offline está restringido a usuarios seleccionados) o los filtros del perfil son demasiado restrictivos | En [Power Apps](https://make.powerapps.com/), **Apps** > **Field Service Mobile** > **Settings** > **General**: revisar **Can be used offline** y **Select offline mode and profile**; con **…** > **Edit selected profile**, comprobar que el usuario aparece en **Users with this profile**. En la app, el icono de sincronización abre **Device Status** con el último error | Activar offline, agregar al usuario al perfil correcto o ampliar los filtros; guardar y publicar la app ([Learn: Set up the mobile offline profile](https://learn.microsoft.com/dynamics365/field-service/mobile/set-up-offline-profile)) |
| El técnico no aparece disponible para asignar en el calendario | No se le asignó al usuario la licencia de usuario Field Service (o Field Service Contractor) o su registro Bookable Resource no está activo | Centro de administración de Power Platform > usuarios > licencia asignada; en Field Service > Recursos, revisar el estado del Bookable Resource | Asignar la licencia de usuario Field Service correspondiente y activar el registro Bookable Resource |
| No se puede iniciar sesión en Field Service Mobile fuera de la red corporativa | Políticas de acceso condicional de Microsoft Entra ID restringen el inicio de sesión desde ubicaciones o dispositivos no administrados | Microsoft Entra admin center > Conditional Access, revisar políticas activas para el usuario/dispositivo | Solicitar al administrador del tenant una excepción o inscripción del dispositivo (MDM/Intune) |
| Las fotos de una inspection no se suben o la inspection tarda en cargar | En las inspections, cada archivo adjunto está limitado a 3 MB salvo que un administrador cambie el límite, y muchas fotos ralentizan la carga ([Learn: inspections](https://learn.microsoft.com/dynamics365/field-service/inspections)); o la tabla, los archivos o las imágenes no están incluidos en el perfil offline | **Device Status** en la app y, como administrador, **Settings** > **Sync Errors**; revisar en el perfil qué archivos e imágenes de la tabla se descargan | Reducir el tamaño de las fotos o ajustar el límite, incluir archivos e imágenes en la tabla del perfil y volver a sincronizar con conexión estable |
| El técnico no puede registrar el repuesto usado estando offline | La tabla *Work Order Product* o un lookup que usa su filtro (por ejemplo, el producto o el almacén) no está en el perfil offline, o al rol le faltan privilegios sobre esa tabla | Editar el perfil offline y revisar la tabla y sus relaciones; revisar el rol **Field Service-Resource** del técnico | Incluir en el perfil todas las tablas referenciadas por los filtros de lookup y dar los privilegios necesarios. Recuerda que los cálculos de costo no se actualizan offline: se recalculan al sincronizar ([Learn: products and services](https://learn.microsoft.com/dynamics365/field-service/create-product-or-service)) |

## Pasos detallados

### Paso 1 — Ciclo de vida

Documenta estados desde creación hasta cierre y facturación/seguimiento.

### Paso 2 — Perfil offline

Lista datos que deben descargarse: Work Order, tareas, activo, cuenta, contactos, productos y
knowledge articles.

### Paso 3 — Evidencia en campo

Define fotos, firmas, inspection, notas y repuestos consumidos.

### Paso 4 — Sincronización

Diseña qué ocurre si hay conflicto o falla de sync al recuperar conexión. Parte de lo que documenta Learn
(Microlección 4 del Módulo 59): el conflicto se evalúa por registro completo y, con **Set conflict detection
for mobile offline synchronization** en **No** (por defecto), gana lo editado offline
([Learn: offline data sync](https://learn.microsoft.com/dynamics365/field-service/mobile/offline-data-sync)).

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

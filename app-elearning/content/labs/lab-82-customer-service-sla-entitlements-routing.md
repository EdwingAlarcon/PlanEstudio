---
id: lab-82
title: "Customer Service SLA + Entitlements + Routing"
level: "N6"
duration: 150
product: ["Dynamics 365 Customer Service", "Dataverse"]
certifications: ["Dynamics 365 Customer Service"]
role: ["Consultor Funcional D365 CE", "Customer Service Lead"]
prerequisites:
  - "Módulo 62 estudiado: Customer Service Avanzado"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
lastVerified: "2026-11"
---

# Lab 82 — Customer Service SLA + Entitlements + Routing

## Objetivo

Diseñar un modelo de soporte con entitlements, SLA, colas, routing y escalamiento. La configuración
real de temporizadores, SLA y routing requiere ambiente Dynamics 365 Customer Service.

Este lab **no repite** el caso end-to-end del Lab 68. El Lab 68 valida un ciclo concreto
case-to-resolution; este lab define la política operacional reusable para muchos casos, clientes,
planes y excepciones.

## Escenario de negocio

SIT ofrece soporte estándar y premium. Los clientes premium tienen respuesta inicial de 1 hora y
resolución de 8 horas hábiles para incidentes críticos.

## Gate de ambiente real

Antes de presentar este lab como ejecución real, completa el gate **Customer Service avanzado** del
recurso `/recursos/d365-tenant-readiness`. Sin ambiente Customer Service, calendario, SLA y colas
configuradas, la entrega es **Simulado**.

## 🔧 Requisitos de tenant y fallos frecuentes

**Licencia y rol mínimo**

Un ambiente Developer de Power Platform no sirve: Learn indica que los SLA solo se pueden crear en
ambientes con apps de customer engagement como Customer Service
([Learn: configurar SLA](https://learn.microsoft.com/dynamics365/customer-service/administer/define-service-level-agreements)).
Para practicar, usa la trial de Dynamics 365 Customer Service del Módulo 62 (30 días, extensible una
vez; caduca tras 14 días seguidos sin uso; su propio tenant; trae **Customer Service Enterprise** y
unified routing — [Learn: Trial FAQ](https://learn.microsoft.com/dynamics365/customer-service/implement/trial-faq)).
Qué incluye cada licencia de pago (Professional frente a Enterprise) no se verificó para este lab:
revísalo en la [guía de licencias de Dynamics 365](https://go.microsoft.com/fwlink/?LinkId=866544)
antes de prometerlo a un cliente. Para configurar calendarios, SLA y entitlements Learn pide
**Customer Service Manager**, **System Administrator** o **System Customizer** (o permisos
equivalentes); el rol **Customer Service Representative** es para trabajar casos, no para crear esta
configuración. En la trial eres administrador.

**Configuración previa** (todo en **Copilot Service admin center**)

- Calendario de trabajo y feriados antes de crear el SLA: **Operations** → **Calendar** →
  **Customer service calendar** y **Holiday calendar**
  ([Learn](https://learn.microsoft.com/dynamics365/customer-service/administer/create-customer-service-schedule-define-work-hours)).
- SLA KPIs, SLA y entitlements: **Operations** → **Service terms**. El campo **SLA** no está en el
  formulario del caso por defecto: el SLA llega por entitlement, por SLA por defecto o por un flujo
  ([Learn: aplicar SLA](https://learn.microsoft.com/dynamics365/customer-service/administer/apply-slas)).
- Colas creadas antes de diseñar las reglas de routing hacia ellas.
- Si los entitlements se van a vincular a productos o contactos, esos registros deben existir primero.

**Fallos frecuentes de licencia, rol y configuración de tenant**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No se puede crear un SLA con seguimiento en vivo (temporizador/KPI en el caso). | El SLA no está activado, el caso no cumple su **Applicable When**, o el KPI no está en el formulario del caso. | En Copilot Service admin center, revisar que el SLA está activo y sus condiciones; en el formulario del caso, que muestra el temporizador del SLA KPI. | Activar el SLA, corregir **Applicable When** o añadir el temporizador al formulario. |
| El temporizador del SLA no pausa en feriados ni fuera de horario laboral. | El SLA no tiene un calendario de horario laboral asignado, o el calendario no tiene feriados cargados. | Revisar el calendario de servicio vinculado al SLA y su lista de feriados. | Crear o asignar el calendario correcto, cargando los feriados que apliquen. |
| El entitlement no se consume al crear o resolver un caso. | El entitlement no está **Active** (si su **Start Date** es futura queda en **Waiting**), no es del cliente del caso, o **Decrease Remaining On** dice resolución y el caso aún no se resolvió. | Revisar estado, **Primary Customer** y **Decrease Remaining On** del entitlement. | Activar el entitlement, asociarlo al cliente correcto y decidir si descuenta al crear o al resolver ([Learn: entitlements](https://learn.microsoft.com/dynamics365/customer-service/administer/create-entitlement-define-support-terms-customer)). |
| Se crean casos aunque el entitlement ya no tiene saldo. | **Restrict based on entitlement terms** está en **No**: Learn deja crear el caso y pone **Remaining Terms** en negativo. | Revisar esa opción en el entitlement. | Ponerla en **Yes** si la política es bloquear, o dejar **No** y alertar a supervisión si la política es atender y facturar. |
| El routing automático no asigna el caso a la cola esperada. | La regla de routing (reglas de creación/actualización de registros, o unified routing) sigue en borrador, o la clasificación no lleva el caso a la cola esperada. | Revisar si la regla está activada (no en borrador) y probar la clasificación con un caso de ejemplo; comprobar en tu licencia o trial qué capacidades de routing incluye. | Activar la regla o corregir la condición de la regla de route-to-queue. |

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

### Paso 6 — Política operacional reusable

Documenta qué reglas se aplican por defecto y qué excepciones requieren aprobación: cambio manual
de prioridad, override de SLA, consumo de entitlement fuera de vigencia, reasignacion a cola VIP y
reapertura de caso resuelto. Para cada excepción indica owner de aprobación y evidencia.

## Validaciones

- [ ] Hay entitlements con cobertura y consumo claros.
- [ ] SLA incluye calendario, pausa, warning y failure.
- [ ] Routing asigna casos a cola correcta.
- [ ] UAT prueba incumplimientos, no solo casos exitosos.
- [ ] Las excepciones operativas tienen owner y evidencia de aprobación.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Matriz de entitlements.
- Matriz SLA.
- Reglas de routing.
- Casos UAT.
- Política de excepciones operativas.

## Competencias desarrolladas

- Diseño de soporte enterprise.
- SLA operativo.
- Routing funcional.

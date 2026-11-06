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
lastVerified: "2026-09"
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

Entitlements, SLA con seguimiento en vivo y colas avanzadas requieren **Dynamics 365 Customer
Service Enterprise**; con **Customer Service Professional** algunas de estas capacidades están
ausentes o limitadas. Para configurar SLA, entitlements y colas se necesita un rol con privilegios
de administración funcional, como **Customer Service Manager** — el rol **Customer Service
Representative** solo trabaja casos ya asignados y no puede crear ni modificar esta configuración.

**Configuración previa**

- Calendario de trabajo (horario laboral y feriados) creado en Dataverse antes de crear el SLA.
- Colas creadas antes de diseñar las reglas de routing hacia ellas.
- Si los entitlements se van a vincular a contratos de servicio o productos, esos registros deben
  existir primero.

**Fallos frecuentes de licencia, rol y configuración de tenant**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No se puede crear un SLA con seguimiento en vivo (temporizador/KPI en el caso). | El SLA no está activado, el caso no cumple su **Applicable When**, o el KPI no está en el formulario del caso. | En Copilot Service admin center, revisar que el SLA está activo y sus condiciones; en el formulario del caso, que muestra el temporizador del SLA KPI. | Activar el SLA, corregir **Applicable When** o añadir el temporizador al formulario. |
| El temporizador del SLA no pausa en feriados ni fuera de horario laboral. | El SLA no tiene un calendario de horario laboral asignado, o el calendario no tiene feriados cargados. | Revisar el calendario de servicio vinculado al SLA y su lista de feriados. | Crear o asignar el calendario correcto, cargando los feriados que apliquen. |
| El entitlement no se consume al crear o resolver un caso. | El entitlement no está asociado al cliente correcto, o no está en estado "Activo"/aprobado. | Revisar el estado del entitlement y su relación con el Account/Contact del caso. | Activar el entitlement y asegurarse de que esté asociado al cliente antes de crear el caso. |
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

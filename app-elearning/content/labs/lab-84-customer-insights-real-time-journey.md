---
id: lab-84
title: "Customer Insights Real-Time Journey"
level: "N6"
duration: 120
product: ["Dynamics 365 Customer Insights - Journeys", "Dataverse"]
certifications: ["Dynamics 365 Customer Insights"]
role: ["Consultor Funcional D365 CE", "Marketing Automation Specialist"]
prerequisites:
  - "Módulo 64 estudiado: Customer Insights - Journeys"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 84 — Customer Insights Real-Time Journey

## Objetivo

Diseñar un real-time journey con trigger, consentimiento, ramas, objetivo y pruebas negativas.
La ejecución real requiere Customer Insights - Journeys, canal configurado, dominio/cuenta y
contactos con consentimiento.

## Escenario de negocio

SIT quiere renovar contratos 45 días antes del vencimiento y notificar al vendedor si el cliente
interactúa con la comunicación.

## Gate de ambiente real

Antes de presentar este lab como ejecución real, completa el gate **Customer Insights - Journeys**
del recurso `/recursos/d365-tenant-readiness`. Sin canal/dominio, consentimiento y contactos de
prueba, la entrega es **Simulado**.

## Pasos detallados

### Paso 1 — Trigger

Define evento de entrada, datos mínimos y condición de elegibilidad.

### Paso 2 — Consentimiento

Documenta propósito, canal, fuente del consentimiento y regla de exclusión.

### Paso 3 — Journey

Diseña mensaje inicial, espera, condición de interacción, tarea para vendedor y objetivo.

### Paso 4 — Pruebas

Diseña pruebas para consentimiento válido, sin consentimiento, email inválido y cliente ya renovado.

## Validaciones

- [ ] El journey es real-time y tiene objetivo.
- [ ] Consentimiento se valida antes del envío.
- [ ] Hay pruebas negativas.
- [ ] Se separa Data de Journeys.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Diagrama del journey.
- Matriz de consentimiento.
- Casos de prueba.

## Competencias desarrolladas

- Real-time journeys.
- Consentimiento y compliance.
- Marketing automation D365.

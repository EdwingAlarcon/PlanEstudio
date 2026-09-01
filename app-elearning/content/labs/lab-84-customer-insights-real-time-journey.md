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

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Trigger | 15% | Trigger real-time con condición de entrada clara |
| Consentimiento | 30% | Se valida ANTES del envío, no después; incluye caso "sin consentimiento" probado |
| Diseño del journey | 25% | Mensaje, espera, condición de interacción, tarea y objetivo, todos justificados |
| Pruebas | 20% | Cubre consentimiento válido, sin consentimiento, email inválido y cliente ya renovado |
| Separación Data/Journeys | 10% | El journey no rehace unificación — consume perfiles/segmentos ya resueltos en Data |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. El caso "sin consentimiento" en 0 es
descalificante sin importar el resto del puntaje — es el criterio de cumplimiento no negociable.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Validar consentimiento después de enviar el primer mensaje | Se diseña el journey como flujo lineal sin gate previo | El chequeo de consentimiento debe ser el primer paso ejecutable, antes de cualquier envío |
| Journey que re-unifica datos en vez de consumir Data | Se mezcla lógica de CDP dentro del journey | El journey consume segmentos/perfiles ya resueltos por Customer Insights - Data, no recalcula matching |
| Sin caso de prueba negativo | Solo se prueba el camino feliz (cliente califica, todo bien) | Los 4 casos de prueba (válido, sin consentimiento, email inválido, ya renovado) son obligatorios, no opcionales |
| Objetivo del journey ambiguo | "Enviar comunicación" no es un objetivo medible | El objetivo debe ser observable (ej. "tasa de renovación del segmento sube X%"), no solo "enviar" |

## Reto adicional

Agregá un segundo canal (ej. SMS como fallback si el email no se abre en 48 horas) y documentá cómo
el journey decide entre canales sin violar el consentimiento específico de cada uno — el consentimiento
de email no habilita automáticamente SMS.

## Competencias desarrolladas

- Real-time journeys.
- Consentimiento y compliance.
- Marketing automation D365.

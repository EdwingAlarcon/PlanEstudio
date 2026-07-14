---
id: lab-83
title: "Contact Center Simulation"
level: "N6"
duration: 150
product: ["Dynamics 365 Contact Center", "Dynamics 365 Customer Service", "Copilot Studio"]
certifications: ["Dynamics 365 Contact Center", "Dynamics 365 Customer Service"]
role: ["Consultor Funcional D365 CE", "Contact Center Architect"]
prerequisites:
  - "Módulo 62 estudiado: Contact Center / Omnichannel"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
---

# Lab 83 — Contact Center Simulation

## Objetivo

Simular una operación de contact center con canal, workstream, bot, handoff, unified routing,
capacidad de agente y tablero supervisor. Para ejecución real se requiere tenant, licencias,
canal configurado y agentes.

## Escenario de negocio

SIT recibe consultas por chat para soporte premium. Un bot atiende preguntas frecuentes y transfiere
a agente cuando detecta incidente técnico.

## Gate de ambiente real

Antes de presentar este lab como configuración real, completa el gate **Contact Center /
Omnichannel** del recurso `/recursos/d365-tenant-readiness`. Si no hay licencias, canal, workstream,
agentes con presencia y conversation test, la entrega debe rotularse como **Simulado**.

## Pasos detallados

### Paso 1 — Diseño de canal

Define canal, horario, idioma, cola, mensaje inicial y criterios de cierre.

### Paso 2 — Workstream y capacidad

Diseña capacity profile, presencia y máximo de conversaciones simultáneas por agente.

### Paso 3 — Routing

Documenta reglas por skill, prioridad y tipo de cliente.

### Paso 4 — Handoff bot-agente

Define datos mínimos transferidos: cliente, intención, transcript, resumen y prioridad.

### Paso 5 — Dashboard supervisor

Diseña métricas: ASA, AHT, abandon rate, FCR, transfer rate y CSAT.

## Validaciones

- [ ] El workstream tiene capacidad y presencia.
- [ ] Routing usa skill/prioridad, no solo cola genérica.
- [ ] Handoff conserva contexto.
- [ ] Dashboard incluye métricas de experiencia y operación.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Diseño de workstream.
- Matriz de routing.
- Contrato de handoff.
- Mockup o tabla de dashboard supervisor.

## Competencias desarrolladas

- Omnichannel operations.
- Unified routing.
- Diseño de handoff bot-agente.

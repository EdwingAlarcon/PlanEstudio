---
id: SIM-RPA-001
title: "Primeras dos semanas como RPA Developer"
practiceType: simulation
domain: rpa-desktop-automation
roles: ["rpa-developer", "automation-engineer", "rpa-operations-specialist"]
difficulty: expert
estimatedEffort: long
prerequisites:
  modules: [66, 67, 68, 69, 70, 71, 72, 73, 74, 75]
  labs: ["LAB-104", "LAB-105", "LAB-106", "LAB-109", "LAB-110", "LAB-111"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Power Automate Desktop", "Power Automate Cloud", "Excel", "Solutions", "Run history"]
skills: ["discovery", "to-be-design", "prototype", "uat", "deployment", "incident-response", "operations"]
evidence:
  required: ["user-story", "acceptance-criteria", "diagram", "test-plan", "uat-signoff", "deployment-plan", "runbook", "root-cause-analysis", "presentation", "retrospective"]
  optional: ["demo-video", "rollback-plan", "reconciliation-report"]
  format: "Carpeta de proyecto con entregables por día, demo y retrospectiva."
  qualityCriteria: ["No afirma experiencia laboral real", "Distingue simulación y tenant", "Incluye incident response", "Defiende decisiones"]
  sensitiveDataWarning: "Todo dato debe ser ficticio o anonimizado."
  artifactTypes: ["conceptual", "simulated", "sandbox-reproducible"]
solutionAvailability: facilitator-only
coverageState: covered
hints:
  - id: hint-1
    level: light
    title: "Piensa como consultor"
    content: "El primer día no construyes; haces preguntas y reduces ambigüedad."
  - id: hint-2
    level: tool
    title: "Evidencia por fase"
    content: "Cada día debe dejar artefacto verificable, no solo notas."
  - id: hint-3
    level: hypothesis
    title: "El incidente es parte del trabajo"
    content: "Tu calidad se ve en diagnóstico y operación, no solo en el happy path."
  - id: hint-4
    level: near-solution
    title: "Demo honesta"
    content: "Presenta impacto estimado, límites, deuda y qué fue simulado."
rubric:
  - criterion: "Análisis del proceso"
    weight: 10
  - criterion: "Selección tecnológica"
    weight: 10
  - criterion: "Arquitectura"
    weight: 10
  - criterion: "Construcción"
    weight: 15
  - criterion: "Resiliencia"
    weight: 15
  - criterion: "Seguridad"
    weight: 10
  - criterion: "ALM"
    weight: 10
  - criterion: "Testing"
    weight: 10
  - criterion: "Operación"
    weight: 5
  - criterion: "Defensa y evidencia"
    weight: 5
---

## Contexto

Entras a un equipo como RPA Developer junior-intermedio. Recibes una descripción ambigua de un proceso administrativo, archivos de ejemplo, entrevistas incompletas, excepciones reales, tiempos de operación y restricciones de seguridad.

## Día 1 — Descubrimiento

Produce preguntas, AS-IS, inventario de aplicaciones, matriz de viabilidad, riesgos y decisión RPA/API/manual.

## Día 2 — Diseño TO-BE

Produce flujo, componentes, arquitectura, manejo de errores, modelo de estados, seguridad, logging y criterios de aceptación.

## Día 3 — Prototipo

Construye happy path. Se introduce una excepción no documentada.

## Día 4 — Excepciones

Incorpora datos inválidos, portal lento, archivo bloqueado, registro duplicado y ventana inesperada.

## Día 5 — Cloud integration

Conecta entrada, desktop flow, salida, notificación y almacenamiento.

## Día 6 — UAT

Recibe defectos y comentarios; prioriza, reproduce, corrige, prueba y documenta.

## Día 7 — Despliegue

Produce paquete, configuración, checklist, rollback y validación.

## Día 8 — Incidente postdeploy

Diagnostica un fallo attended/unattended o selector roto. Emite causa raíz, corrección, validación y comunicación.

## Día 9 — Operación

Crea runbook, monitoreo, soporte, escalamiento, recuperación y mantenimiento.

## Día 10 — Cierre

Presenta demo, evidencias, métricas, limitaciones, deuda, mejoras y retrospectiva.

## Criterios de aceptación

- Cada día tiene evidencia.
- La demo distingue simulación de tenant real.
- La solución evita secretos, duplicados y reintentos infinitos.
- El cierre incluye límites y mejoras.

## Solución de referencia

El facilitador debe revisar que el estudiante siguió el ciclo analizar, seleccionar, diseñar, construir, probar, desplegar, operar, diagnosticar y mejorar. No hay una única solución correcta; hay decisiones defendibles o indefendibles.

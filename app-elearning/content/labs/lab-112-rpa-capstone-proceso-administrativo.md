---
id: lab-112
title: "RPA Capstone — Automatización end-to-end de proceso administrativo"
level: "RPA"
duration: 240
product: ["Power Automate Desktop", "Power Automate Cloud", "Excel", "ALM", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "Automation Solution Architect"]
prerequisites:
  - "Módulos RPA 66-75 completados"
  - "Labs RPA principales completados o evidencias equivalentes"
files: []
---

# RPA Capstone — Automatización end-to-end de un proceso administrativo

## Objetivo

Integrar descubrimiento, análisis, selección tecnológica, desktop flow, cloud flow, Excel/archivos, portal o app legacy simulada, errores, idempotencia, seguridad, ALM, pruebas, despliegue, operación, incident response, documentación y demo.

## Escenario de negocio

SIT procesa solicitudes administrativas recibidas por archivo. Parte puede resolverse con cloud flow, pero un portal legacy sin API exige PAD. Debes defender qué automatizas, qué no automatizas y cómo operarás la solución.

## Competencias desarrolladas

- Discovery AS-IS/TO-BE
- Diseño PDD/SDD o equivalente
- Construcción cloud + desktop
- Seguridad y ALM
- Testing, UAT y operación
- RCA y defensa técnica

## Entregables

- PDD o documento equivalente de definición del proceso
- SDD o diseño de solución
- AS-IS y TO-BE
- Matriz de viabilidad
- Diagrama
- Desktop flow y cloud flow
- Plan de pruebas y UAT
- Evidencias
- RCA de incidente
- Deployment plan
- Rollback plan
- Runbook
- Demo y retrospectiva

## Criterios de aprobación

- La selección tecnológica no presenta RPA como solución universal.
- Hay idempotencia y manejo de errores.
- La seguridad evita secretos en texto plano y permisos excesivos.
- El ALM separa ambientes y configuración.
- La operación tiene owner, monitoreo, soporte y rollback.

## Rúbrica resumida

| Criterio | Peso |
|---|---:|
| Análisis del proceso | 10% |
| Selección tecnológica | 10% |
| Arquitectura | 10% |
| Construcción | 15% |
| Resiliencia | 15% |
| Seguridad | 10% |
| ALM | 10% |
| Testing | 10% |
| Operación | 5% |
| Defensa y evidencia | 5% |

## Fallos críticos

Credenciales en texto plano, permisos excesivos, cambios directos en producción, ausencia de manejo de errores, duplicaciones no controladas, datos sensibles expuestos, ausencia de rollback en procesos críticos, automatización basada únicamente en coordenadas sin justificación, reintentos infinitos, no cerrar aplicaciones o archivos, no validar resultados.

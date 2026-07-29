---
id: lab-111
title: "RPA — Despliegue entre ambientes y operación unattended"
level: "RPA"
duration: 180
product: ["Power Automate Desktop", "Solutions", "Machine Runtime", "Unattended RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Operations Specialist", "Automation Solution Architect"]
prerequisites:
  - "Módulos 67 y 75 completados"
  - "Ambiente DEV/TEST o simulación documentada"
files: []
---

# LAB-RPA-08 — Despliegue y operación unattended

## Objetivo

Preparar solución, configuración, dependencias, variables, referencias, validación, UAT, rollback, documentación postdeploy y operación unattended o variante simulada.

## Escenario de negocio

El bot debe pasar de DEV a TEST. Operaciones exige evidencia de readiness de máquina, cuenta, sesión, monitoreo, rollback y soporte.

## Competencias desarrolladas

- ALM de soluciones
- Variables de entorno
- Connection references
- Machine readiness
- Runbook unattended

## Ejercicios

1. Lista componentes: cloud flow, desktop flow, variables, conexiones, tabla/lista de estado.
2. Define valores DEV/TEST para rutas, URLs y modo.
3. Crea deployment checklist.
4. Ejecuta UAT o simulación con evidencias.
5. Documenta rollback.
6. Define runbook unattended: sesión, bloqueo, monitoreo, recuperación.
7. Si no tienes licencia unattended, marca el resultado como simulación.

## Evidencia esperada

- Deployment checklist
- Rollback checklist
- Machine readiness checklist
- UAT firmado o simulado
- Runbook
- Registro de automatización

## Criterios de aprobación

- No hay cambios directos en producción.
- Las credenciales no aparecen en texto plano.
- La variante unattended distingue licencia real vs simulación.
- La validación postdeploy cubre configuración y ejecución.

## Assets reproducibles

- Matriz operacional: [matriz_operacional.csv](../practice-assets/rpa/sit-automation-case/validation/matriz_operacional.csv).
- Protocolo de tenant: [protocolo_tenant.md](../practice-assets/rpa/sit-automation-case/validation/protocolo_tenant.md).
- Plantillas: [deployment plan](../practice-assets/rpa/sit-automation-case/templates/deployment-checklist.md), [rollback plan](../practice-assets/rpa/sit-automation-case/templates/rollback-plan.md) y [runbook](../practice-assets/rpa/sit-automation-case/templates/runbook.md).
- Reset: revierte parámetros de ambiente y deja evidencia de que no cambiaste producción real.
- Variante sin licencia unattended: declara el bloqueo, valida el diseño y completa solo simulación attended/local.

## Reto adicional

Agrega plan de continuidad si la máquina principal no está disponible.

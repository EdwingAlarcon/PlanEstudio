---
id: lab-110
title: "RPA — Cloud flow + desktop flow end-to-end"
level: "RPA"
duration: 160
product: ["Power Automate Cloud", "Power Automate Desktop", "Machine Runtime", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "Power Platform Consultant"]
prerequisites:
  - "Módulo 74 completado"
  - "Power Automate cloud básico"
files: []
---

# LAB-RPA-07 — Cloud flow + desktop flow

## Objetivo

Recibir una solicitud desde Power Automate cloud, ejecutar PAD y devolver resultado con parámetros, máquina, respuesta, error, almacenamiento y notificación.

## Escenario de negocio

Un equipo registra solicitudes de trabajo en una lista. Cloud flow orquesta el lote; PAD ejecuta la parte de interfaz; Dataverse o SharePoint conserva estado.

## Competencias desarrolladas

- Contrato cloud-desktop
- Inputs y outputs
- Machine runtime
- Estado y notificación
- Errores cruzados

## Ejercicios

1. Crea una lista/tabla de solicitudes ficticias.
2. Define estados `Pendiente`, `EnEjecucion`, `Completado`, `Error`.
3. Crea cloud flow programado o manual.
4. Envía parameters al desktop flow.
5. Devuelve resultado estructurado.
6. Actualiza estado y notifica.
7. Simula máquina no disponible o error desktop.

## Evidencia esperada

- Diagrama end-to-end
- Captura de cloud flow
- Captura de desktop flow
- Run history con inputs/outputs
- Registro de estado y notificación

## Criterios de aprobación

- El contrato no depende de texto libre ambiguo.
- Los errores de máquina se distinguen de errores de negocio.
- El estado persiste fuera de la VM.
- No se registran secretos en logs.

## Assets reproducibles

- Manifest del paquete: [manifest.json](../practice-assets/rpa/sit-automation-case/manifest.json).
- Parámetros: [parametros_proceso.json](../practice-assets/rpa/sit-automation-case/input/parametros_proceso.json).
- Métricas esperadas: [metricas_esperadas.json](../practice-assets/rpa/sit-automation-case/expected/metricas_esperadas.json).
- Plantilla: [Runbook operativo](../practice-assets/rpa/sit-automation-case/templates/runbook.md).
- Reset: usa un `correlationId` nuevo por corrida y conserva los logs separados.
- Variante sin cloud flow: simula el disparador cloud con parámetros locales y documenta qué quedaría pendiente en tenant.

## Reto adicional

Agrega distribución por machine group si tu licencia/tenant lo permite; si no, documenta variante simulada.

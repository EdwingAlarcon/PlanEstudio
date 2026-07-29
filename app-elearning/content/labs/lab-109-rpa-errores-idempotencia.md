---
id: lab-109
title: "RPA — Manejo de errores e idempotencia"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "Logging", "Idempotencia", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Support Analyst", "Automation Engineer"]
prerequisites:
  - "Módulo 73 completado"
  - "Conocimientos básicos de estados y claves únicas"
files: []
---

# LAB-RPA-06 — Manejo de errores e idempotencia

## Objetivo

Procesar registros sin duplicar operaciones después de un fallo parcial usando identificador único, checkpoint, retry, estados, recuperación y prueba de repetición.

## Escenario de negocio

El bot registra solicitudes en un portal. Si falla después de confirmar un registro, debe reanudar sin crear duplicados.

## Competencias desarrolladas

- Estados por registro
- Checkpoints
- Retry controlado
- Idempotencia
- Reanudación

## Ejercicios

1. Define clave única por registro.
2. Crea tabla o archivo de estado.
3. Marca `EnProceso` antes de acción con efecto.
4. Marca `Completado` solo después de validar confirmación.
5. Simula fallo parcial.
6. Reejecuta y demuestra que no duplica.
7. Documenta rollback o compensación.

## Evidencia esperada

- Matriz de estados
- Log antes/después de reejecución
- Prueba de no duplicidad
- RCA del fallo parcial
- Runbook de recuperación

## Criterios de aprobación

- No hay reintentos infinitos.
- La reejecución no repite operaciones completadas.
- Los errores esperados no se mezclan con errores técnicos.
- El cierre seguro de aplicaciones está probado.

## Reto adicional

Agrega backoff progresivo solo para errores transitorios.

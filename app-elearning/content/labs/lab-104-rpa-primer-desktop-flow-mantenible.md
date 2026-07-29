---
id: lab-104
title: "RPA — Primer desktop flow mantenible"
level: "RPA"
duration: 120
product: ["Power Automate Desktop", "Desktop Flow", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer"]
prerequisites:
  - "Módulo 66 completado"
  - "Power Automate Desktop instalado o variante simulada documentada"
files: []
---

# LAB-RPA-01 — Primer desktop flow mantenible

## Objetivo

Construir un desktop flow pequeño pero operable: inputs, outputs, variables, condiciones, bucles, subflows, logging y manejo básico de errores.

## Escenario de negocio

SIT necesita procesar una lista de solicitudes internas desde un archivo de prueba y producir un log que soporte pueda leer sin abrir el diseñador.

## Competencias desarrolladas

- Diseño modular de desktop flows
- Variables, listas y data tables
- Logging con correlation ID
- Manejo básico de errores
- Evidencia defendible

## Ejercicios

1. Define inputs `in_InputPath`, `in_OutputFolder`, `in_DryRun` y `in_CorrelationId`.
2. Crea subflows `Inicializar`, `ValidarEntrada`, `ProcesarRegistros`, `RegistrarLog` y `CerrarRecursos`.
3. Procesa una tabla con cinco registros, incluyendo uno inválido.
4. Escribe log CSV con estado por registro.
5. Devuelve outputs `out_Total`, `out_Procesados`, `out_Errores` y `out_LogPath`.
6. Fuerza un error y confirma que el subflow de cierre se ejecuta.

## Evidencia esperada

- Captura o export del flow
- Diagrama simple de subflows
- Convención de nombres
- Log de ejecución
- Reflexión sobre mantenibilidad

## Criterios de aprobación

- El flow no queda monolítico.
- Los errores se registran sin exponer datos sensibles.
- El cierre de recursos ocurre en ejecución exitosa y fallida.
- Los outputs permiten diagnóstico desde cloud flow en el futuro.

## Reto adicional

Agrega un parámetro `in_MaxRetries` y úsalo solo para una acción recuperable, no para repetir todo el lote.

---
id: lab-105
title: "RPA — Automatización de Excel y consolidación de ventas"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "Excel", "Archivos", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "RPA Support Analyst"]
prerequisites:
  - "Módulo 69 completado"
  - "Carpeta local de práctica con archivos ficticios"
files: []
---

# LAB-RPA-02 — Automatización de Excel

## Objetivo

Consolidar archivos mensuales de ventas con formatos inconsistentes, validando filas inválidas, duplicados, archivos bloqueados, cierre de Excel y reporte final.

## Escenario de negocio

Tres sucursales envían archivos Excel mensuales. El equipo financiero necesita un reporte consolidado y trazabilidad de errores sin usar Excel como base de datos transaccional.

## Competencias desarrolladas

- Lectura/escritura Excel
- Procesamiento por lotes
- Validación y deduplicación
- Cleanup de instancias
- Reporte operativo

## Ejercicios

1. Prepara carpetas `entrada`, `procesado`, `error` y `salida`.
2. Crea tres libros ficticios con hojas y columnas variables.
3. Valida columnas obligatorias: fecha, sucursal, producto, cantidad e importe.
4. Detecta duplicados por `sucursal + fecha + producto`.
5. Consolida filas válidas y separa errores.
6. Simula archivo bloqueado y registra recuperación.
7. Cierra Excel aunque falle una fila.

## Evidencia esperada

- Archivo consolidado
- Archivo de errores
- Log por archivo
- Captura del cierre de Excel o verificación de proceso
- Reflexión sobre cuándo migrar a Dataverse/SQL

## Criterios de aprobación

- No se duplican registros al reejecutar.
- Excel no queda abierto.
- Los errores de datos no detienen todo el lote.
- El reporte permite reconciliación.

## Reto adicional

Agrega un manifiesto de lote con hash o nombre de archivo procesado para evitar reprocesamiento.

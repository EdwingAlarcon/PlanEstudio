---
id: lab-105
title: "RPA — Automatización de Excel y consolidación de ventas"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "Excel", "Archivos", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "RPA Support Analyst"]
prerequisites:
  - "Módulo 70 completado"
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

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El consolidado duplica filas al reejecutar el flow | La deduplicación por `sucursal + fecha + producto` se aplica solo dentro del archivo actual, no contra el consolidado ya existente | Antes de anexar, lee el consolidado previo y compara la clave compuesta contra las filas nuevas, no solo dentro del lote en curso |
| Excel.exe queda en segundo plano tras el archivo bloqueado del paso 6 | La instancia se abrió con "Iniciar Excel" pero la rama de error no llama a "Cerrar Excel" | Envuelve la lectura de cada libro en manejo de errores y cierra la instancia en la rama de error, no solo en la de éxito |
| Filas con importe o cantidad como texto pasan la validación de columnas obligatorias | La validación del paso 3 solo verifica que la celda no esté vacía, no el tipo de dato | Agrega conversión/validación de tipo numérico (`Convertir a número`) y clasifica como error si falla la conversión |
| El archivo de errores queda mezclado con las filas válidas | El bucle de consolidación escribe en el mismo data table sin separar por resultado de validación | Usa dos data tables (válidas/errores) o filtra por una columna de estado antes de exportar cada archivo |
| La recuperación del archivo bloqueado (paso 6) nunca se ejecuta en la prueba | El bloqueo se simula pero el flow no reintenta ni espera, solo falla directo | Agrega una espera corta y un reintento acotado (2-3 intentos) antes de mover el archivo a la carpeta `error` |
| El reporte no permite reconciliación porque no indica de qué sucursal/archivo vino cada fila | La consolidación descarta la columna de origen al unir los tres libros | Agrega una columna `archivo_origen` o `sucursal` al escribir cada fila en el consolidado |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Duplicados al reejecutar el flow

- **Causa probable:** la deduplicación compara solo dentro del lote actual, no contra el consolidado ya escrito en corridas previas.
- **Cómo comprobar:** ejecuta el flow dos veces seguidas sobre los mismos tres libros y cuenta filas del consolidado antes y después de la segunda corrida.
- **Cómo corregir:** al iniciar, carga el consolidado existente en una data table y usa su clave `sucursal + fecha + producto` como filtro antes de anexar filas nuevas.
- **Reiniciar vs. reparar:** repara la lógica de deduplicación; no necesitas reiniciar el flow completo, pero sí debes limpiar el consolidado duplicado generado en las pruebas.
- **Evidencia posterior a la corrección:** dos corridas seguidas producen el mismo número de filas en el consolidado.

### Instancias de Excel que no cierran tras un archivo bloqueado

- **Causa probable:** falta manejo de errores alrededor de la apertura/lectura del libro, así que la rama de error nunca llega a "Cerrar Excel".
- **Cómo comprobar:** simula el archivo bloqueado del paso 6 y revisa el Administrador de tareas en busca de procesos `EXCEL.EXE` residuales tras terminar el flow.
- **Cómo corregir:** envuelve la apertura y lectura de cada libro en "Ejecutar acciones y manejar errores", y cierra la instancia de Excel en ambas ramas (éxito y error).
- **Reiniciar vs. reparar:** cierra manualmente los procesos `EXCEL.EXE` colgados antes de repetir la prueba; luego repara el subflow de lectura, no todo el diseño.
- **Evidencia posterior a la corrección:** captura del Administrador de tareas sin procesos Excel tras una corrida con error simulado.

### Filas con tipo de dato inválido pasan como válidas

- **Causa probable:** la validación solo verifica presencia de la celda, no que `cantidad`/`importe` sean numéricos.
- **Cómo comprobar:** agrega una fila con `importe` en texto (por ejemplo "N/A") a uno de los libros ficticios y verifica si termina en el consolidado.
- **Cómo corregir:** agrega una acción de conversión numérica antes de aceptar la fila; si falla, clasifícala como error con motivo "tipo de dato inválido".
- **Reiniciar vs. reparar:** repara solo la validación del paso 3; no requiere reiniciar el flow completo.
- **Evidencia posterior a la corrección:** el archivo de errores incluye la fila con motivo de tipo de dato.

### Archivo de errores mezclado con filas válidas

- **Causa probable:** ambos tipos de fila se escriben en la misma data table sin separación por estado.
- **Cómo comprobar:** abre el archivo de errores y busca filas que también aparecen en el consolidado válido.
- **Cómo corregir:** separa en dos data tables desde el momento de la validación, o agrega una columna de estado y filtra antes de exportar cada archivo.
- **Reiniciar vs. reparar:** repara la lógica de separación; ejecuta el flow completo una vez al final para confirmar ambos archivos limpios.
- **Evidencia posterior a la corrección:** archivo consolidado y archivo de errores sin filas cruzadas.

### La recuperación del archivo bloqueado nunca ocurre

- **Causa probable:** el flow falla directo al primer intento sin espera ni reintento.
- **Cómo comprobar:** simula el bloqueo (abre el libro manualmente antes de correr el flow) y observa si el bot reintenta o falla de inmediato.
- **Cómo corregir:** agrega un bucle de reintento acotado (2-3 intentos con espera entre cada uno) antes de mover el archivo a `error`.
- **Reiniciar vs. reparar:** repara el subflow de apertura de archivo; no es necesario reiniciar el flow completo.
- **Evidencia posterior a la corrección:** log que muestra los reintentos y el resultado final (recuperado o movido a `error`).

### El reporte no permite reconciliar el origen de cada fila

- **Causa probable:** la columna de origen (sucursal o nombre de archivo) se pierde al unir los tres libros.
- **Cómo comprobar:** revisa si el consolidado tiene una columna que identifique de qué sucursal/archivo vino cada fila.
- **Cómo corregir:** agrega la columna `archivo_origen` o `sucursal` explícitamente al escribir cada fila, tomando el valor antes de descartar el contexto del bucle.
- **Reiniciar vs. reparar:** repara la escritura del consolidado; no requiere reiniciar el flow completo.
- **Evidencia posterior a la corrección:** consolidado con columna de origen visible para cada fila.

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

## Assets reproducibles

- Centro de recursos: [Recursos de práctica RPA](../recursos/rpa-recursos-practica).
- Entradas: [Bogotá](../practice-assets/rpa/sit-automation-case/input/ventas_bogota_2026_07.xlsx), [Medellín](../practice-assets/rpa/sit-automation-case/input/ventas_medellin_2026_07.xlsx), [Caribe](../practice-assets/rpa/sit-automation-case/input/ventas_caribe_2026_07.xlsx) y [solicitudes CSV](../practice-assets/rpa/sit-automation-case/input/solicitudes_sucursales.csv).
- Salida esperada: [consolidado esperado](../practice-assets/rpa/sit-automation-case/expected/consolidado_esperado.csv).
- Incidentes de datos: [manifest de casos corruptos](../practice-assets/rpa/sit-automation-case/corrupted/manifest.json).
- Reset: vuelve a descargar las entradas limpias y borra cualquier consolidado local.
- Variante sin tenant: resuelve la consolidación completa con Excel/archivos locales y deja la integración cloud como diseño.

## Reto adicional

Agrega un manifiesto de lote con hash o nombre de archivo procesado para evitar reprocesamiento.

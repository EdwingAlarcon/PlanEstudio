---
id: lab-105
title: "RPA — Automatización de Excel y consolidación de ventas"
level: "RPA"
duration: 150
product: ["Power Automate for desktop", "Excel", "Archivos", "RPA"]
certifications: ["Power Automate for desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "RPA Support Analyst"]
prerequisites:
  - "Módulo 70 completado"
  - "Carpeta local de práctica con archivos ficticios"
files: []
lastVerified: "2026-11"
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
2. Copia a `entrada` los tres libros del caso (`ventas_bogota_2026_07.xlsx`, `ventas_medellin_2026_07.xlsx` y `ventas_caribe_2026_07.xlsx`, hoja `Solicitudes`) y `solicitudes_sucursales.csv`. Abre los tres libros con **Launch Excel** en solo lectura (**Open as ReadOnly**), como en el subflow `LeerExcel` del Módulo 70; el `.csv` no pasa por Excel: léelo con **Read from CSV file** (**First line contains column names** encendido), como en `LeerCsv`.
3. Valida las columnas obligatorias con los nombres reales del encabezado: `requestId`, `customerId`, `productId`, `quantity`, `unitPrice` y `currency` (los archivos traen además `requestedDate`, `region`, `status` y `sourceFile`).
4. Detecta duplicados por `requestId`, dentro del lote y contra lo que ya está en el consolidado.
5. Consolida filas válidas y separa errores.
6. Simula archivo bloqueado y registra recuperación: abre a mano uno de los libros en Excel y ejecuta el flujo sin cerrarlo. Con **Open as ReadOnly**, la lectura puede funcionar igual; el bloqueo suele aparecer al mover ese libro a `procesado` con **Move file(s)**, porque Excel mantiene el archivo en uso. Anota en qué acción falló tu flujo y con qué mensaje (`%LastError.Message%`) y aplica ahí el reintento acotado. Si tu flujo no falla en ningún punto, documenta eso como resultado, y fuerza el error de lectura como en el Módulo 70 (una hoja que no existe en **HojaExcel**).
7. Cierra Excel aunque falle una fila.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El consolidado duplica filas al reejecutar el flow | La deduplicación por `requestId` se aplica solo dentro del archivo actual, no contra el consolidado ya existente | Antes de anexar, carga los `requestId` del consolidado previo y compara cada fila nueva contra ellos, no solo dentro del lote en curso |
| Excel.exe queda en segundo plano tras el archivo bloqueado del paso 6 | La instancia se abrió con **Launch Excel** y el error cortó el flujo antes de llegar a **Close Excel** | Envuelve la lectura de cada libro en **On block error** y pon **Close Excel** una sola vez, después del **End** del bloque, para que corra tanto en éxito como en error |
| Filas con `quantity` o `unitPrice` no numéricos pasan la validación de columnas obligatorias | La validación del paso 3 solo verifica que la columna exista y la celda no esté vacía, no el tipo de dato | Convierte el valor con **Convert text to number** (falla si el texto no es un número) y clasifica la fila como error si la conversión falla |
| El archivo de errores queda mezclado con las filas válidas | El bucle de consolidación escribe en el mismo data table sin separar por resultado de validación | Usa dos data tables (válidas/errores) o filtra por una columna de estado antes de exportar cada archivo |
| La recuperación del archivo bloqueado (paso 6) nunca se ejecuta en la prueba | El bloqueo se simula pero el flow no reintenta ni espera, solo falla directo | Agrega una espera corta y un reintento acotado (2-3 intentos) antes de mover el archivo a la carpeta `error` |
| El reporte no permite reconciliación porque no indica de qué sucursal/archivo vino cada fila | La consolidación descarta o no escribe la columna `sourceFile` (o `region`) que ya traen los archivos al unir los tres libros | Escribe la fila completa en el consolidado, incluida `sourceFile`; no hace falta crear una columna de origen nueva |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Duplicados al reejecutar el flow

- **Causa probable:** la deduplicación compara solo dentro del lote actual, no contra el consolidado ya escrito en corridas previas.
- **Cómo comprobar:** ejecuta el flow dos veces seguidas sobre los mismos tres libros y cuenta filas del consolidado antes y después de la segunda corrida.
- **Cómo corregir:** al iniciar, carga los `requestId` del consolidado existente (por ejemplo, en el texto de claves `idx_Claves` del Módulo 70) y descarta como duplicada toda fila cuyo `requestId` ya esté, antes de anexarla.
- **Reiniciar vs. reparar:** repara la lógica de deduplicación; no necesitas reiniciar el flow completo, pero sí debes limpiar el consolidado duplicado generado en las pruebas.
- **Evidencia posterior a la corrección:** dos corridas seguidas producen el mismo número de filas en el consolidado.

### Instancias de Excel que no cierran tras un archivo bloqueado

- **Causa probable:** falta un **On block error** alrededor de la apertura/lectura del libro, así que el error detiene el flujo antes de llegar a **Close Excel**.
- **Cómo comprobar:** simula el archivo bloqueado del paso 6 y revisa el Administrador de tareas en busca de procesos `EXCEL.EXE` residuales tras terminar el flow.
- **Cómo corregir:** envuelve **Launch Excel** y **Read from Excel worksheet** de cada libro en **On block error** (que continúe al final del bloque) y pon **Close Excel** una sola vez, después del **End** del bloque, para que se ejecute tanto en éxito como en error. Configura el **On error** de **Close Excel** para continuar (**Continue flow run** > **Go to next action**) por si no llegó a abrirse ninguna instancia.
- **Reiniciar vs. reparar:** cierra manualmente los procesos `EXCEL.EXE` colgados antes de repetir la prueba; luego repara el subflow de lectura, no todo el diseño.
- **Evidencia posterior a la corrección:** captura del Administrador de tareas sin procesos Excel tras una corrida con error simulado.

### Filas con tipo de dato inválido pasan como válidas

- **Causa probable:** la validación solo verifica presencia de la celda, no que `quantity`/`unitPrice` sean numéricos.
- **Cómo comprobar:** procesa [non_numeric_amounts.csv](../practice-assets/rpa/sit-automation-case/corrupted/non_numeric_amounts.csv) (o una copia de un libro con `unitPrice` en texto, por ejemplo "N/A") y verifica si la fila termina en el consolidado.
- **Cómo corregir:** convierte el valor con **Convert text to number** antes de aceptar la fila; si la conversión falla (atrápalo con el **On error** de la acción), clasifícala como error con motivo "tipo de dato inválido".
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

- **Causa probable:** la columna `sourceFile` (o `region`) que ya traen los archivos se pierde al unir los tres libros, porque el flujo escribe solo algunas columnas.
- **Cómo comprobar:** revisa si el consolidado conserva `sourceFile` en cada fila, como en `consolidado_esperado.csv`.
- **Cómo corregir:** escribe la fila completa (`%Fila%`) con **Write to CSV file**, sin recortar columnas, para que `sourceFile` llegue al consolidado; no hace falta crear una columna de origen nueva.
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

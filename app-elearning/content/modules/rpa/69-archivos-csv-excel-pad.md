---
moduleId: 69
title: "Archivos, CSV y Excel con PAD"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 20
slug: "archivos-csv-excel-pad"
---

## 🎯 Objetivo

Automatizar archivos, carpetas, CSV y Excel con validación, cierre seguro, recuperación, procesamiento por lote y criterios claros para no usar Excel como base de datos.

## 📖 Conceptos Clave

Excel es excelente como entrada/salida humana, pero frágil como sistema transaccional. Un flujo profesional controla encoding, delimitadores, archivos temporales, instancias huérfanas, archivos bloqueados, duplicados, grandes volúmenes y reconciliación.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Crea tres archivos mensuales de ventas con columnas ligeramente distintas.
2. Define esquema esperado, reglas de columnas obligatorias y clave única.
3. Procesa carpeta de entrada y mueve archivos a `procesado` o `error`.
4. Normaliza CSV/Excel a una data table.
5. Detecta duplicados antes de consolidar.
6. Genera reporte final y log por archivo.
7. Fuerza un archivo bloqueado y documenta recuperación.

## 💼 Casos Reales de Negocio

Una operación carga cada mañana archivos de sucursales. El bot debe procesar lo nuevo sin volver a insertar lo ya cargado, cerrar Excel siempre y producir un reporte defendible para auditoría.

## ✅ Buenas Prácticas

- Usa carpetas `entrada`, `procesado`, `error`, `salida`.
- Valida estructura antes de escribir.
- Cierra instancias y libera archivos.
- Usa claves de lote y registro.
- Para datos maestros o volumen alto, considera Dataverse, SQL o API.

## ⚠️ Errores Comunes

- Dejar procesos Excel abiertos.
- Asumir encoding/delimitador.
- Sobrescribir reportes sin timestamp.
- Procesar dos veces el mismo archivo.
- Usar Excel como base de datos multiusuario.

## 🧪 Criterios de Validación

- [ ] Consolido múltiples archivos con validación.
- [ ] Manejo archivo bloqueado sin perder trazabilidad.
- [ ] Evito duplicados por archivo o registro.
- [ ] Cierro Excel aun cuando hay error.
- [ ] Produzco reporte y log.

## Evidencia

Archivos de muestra, reporte consolidado, log, caso de error y checklist de cleanup. Lab recomendado: LAB-105. Challenge relacionado: CH-RPA-01.

## Preguntas de verificación

1. ¿Cuándo Excel deja de ser una buena base de datos?
2. ¿Cómo evitas reprocesar un archivo?
3. ¿Qué evidencia prueba que cerraste Excel correctamente?

## Conexión con siguiente módulo

Luego aplicarás los mismos principios a automatización web, donde selectores y esperas son el riesgo principal.

## Limitaciones y seguridad

No uses archivos reales de nómina, clientes o finanzas. Enmascara cualquier dato sensible en capturas.

## Referencias oficiales

- [Excel actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/excel)
- [File actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)

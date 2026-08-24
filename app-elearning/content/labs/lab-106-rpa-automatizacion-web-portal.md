---
id: lab-106
title: "RPA — Automatización web de portal controlado"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "Browser Automation", "UI Elements", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer"]
prerequisites:
  - "Módulo 71 completado"
  - "Portal de práctica o HTML local controlado"
files: []
---

# LAB-RPA-03 — Automatización web

## Objetivo

Consultar registros en un portal, manejar paginación, descargar resultados y generar archivo consolidado con esperas y selectores mantenibles.

## Escenario de negocio

Un proveedor entrega solicitudes en un portal sin API. El bot debe consultar por fecha, descargar páginas y producir evidencia de cada ejecución.

## Competencias desarrolladas

- UI elements web
- Selectores web
- Paginación y descargas
- Esperas por estado
- Decisión API vs RPA

## Ejercicios

1. Documenta por qué el portal no se resuelve con API en este lab.
2. Captura selectores de campo búsqueda, botón, tabla y descarga.
3. Implementa espera por tabla cargada.
4. Recorre tres páginas de resultados.
5. Descarga o copia resultados a CSV.
6. Simula timeout y registra error con evidencia.
7. Anonimiza cualquier captura.

## Evidencia esperada

- Archivo consolidado
- Lista de selectores usados
- Log de paginación
- Caso de timeout
- ADR API vs RPA

## Criterios de aprobación

- Las esperas dependen de estado, no solo de pausas fijas.
- El flujo detecta portal lento.
- La evidencia no expone credenciales.
- Existe alternativa simulada si no hay portal real.

## Assets reproducibles

- Portal sandbox: [Portal SIT de solicitudes comerciales](../rpa-sandbox/portal).
- Datos del portal: [portal-data.json](../practice-assets/rpa/sit-automation-case/portal/portal-data.json).
- Salida esperada: [registros válidos](../practice-assets/rpa/sit-automation-case/expected/registros_validos.csv).
- Escenarios disponibles: normal, lento, selector modificado, modal inesperado, error, datos incompletos, paginación extendida y sesión expirada.
- Reset: usa el botón `Reset` del portal y recarga la página antes de repetir la prueba.
- Variante sin tenant: automatiza solo el portal estático; no requiere credenciales ni backend.

## Reto adicional

Agrega comparación con un endpoint HTTP simulado y explica qué cambiaría en producción.

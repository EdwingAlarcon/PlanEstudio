---
id: lab-107
title: "RPA — Aplicación Windows legacy controlada"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "UI Automation", "Windows Apps", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Support Analyst"]
prerequisites:
  - "Módulo 71 completado"
  - "Aplicación Windows de prueba o simulación documentada"
files: []
---

# LAB-RPA-04 — Aplicación legacy

## Objetivo

Registrar información desde un archivo de entrada en una aplicación Windows simulada o controlada, manejando ventanas, selector, validación, excepción, confirmación, recuperación y log.

## Escenario de negocio

Un sistema legacy de escritorio no tiene API. Operaciones necesita cargar solicitudes validadas sin depender de coordenadas frágiles.

## Competencias desarrolladas

- UI automation Windows
- Manejo de ventanas y diálogos
- Validación por registro
- Recuperación de excepción
- Logging operativo

## Ejercicios

1. Identifica ventana principal, campos y botón de confirmar.
2. Captura selectores y descarta coordenadas como patrón principal.
3. Procesa archivo con registros válidos e inválidos.
4. Detecta mensaje de confirmación.
5. Simula ventana modal inesperada.
6. Registra error y continúa con el siguiente registro.
7. Documenta fallback si usas teclado, imagen u OCR.

## Evidencia esperada

- Mapa de ventanas
- Selector principal y alternativo
- Log de registros
- Captura anonimizada de confirmación/error
- Justificación de fallback

## Criterios de aprobación

- La automatización no depende únicamente de coordenadas.
- Cada registro queda en estado claro.
- La ventana se recupera después de error.
- Se documentan límites de RDP/Citrix como awareness.

## Assets reproducibles

- Simulador legacy: [SIT Registro Legacy](../rpa-sandbox/legacy-app).
- Datos semilla: [legacy-records.json](../practice-assets/rpa/sit-automation-case/legacy-app/legacy-records.json).
- Resultado esperado: [log esperado](../practice-assets/rpa/sit-automation-case/expected/log_esperado.csv).
- Modos disponibles: normal, duplicado, bloqueo, layout cambiado, confirmación lenta y botón deshabilitado.
- Reset: usa el botón `Reset` del simulador y conserva solo evidencias anonimizadas.
- Variante sin Windows/PAD: ejecuta el flujo manualmente sobre el simulador y documenta selectores propuestos.

## Reto adicional

Agrega validación de resolución y escalado antes de iniciar.

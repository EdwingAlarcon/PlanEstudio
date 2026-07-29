---
id: lab-108
title: "RPA — Selectores, sincronización y resiliencia"
level: "RPA"
duration: 120
product: ["Power Automate Desktop", "UI Elements", "Selectors", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Support Analyst", "Automation Engineer"]
prerequisites:
  - "Módulo 72 completado"
  - "LAB-RPA-03 o LAB-RPA-04 recomendado"
files: []
---

# LAB-RPA-05 — Selectores y resiliencia

## Objetivo

Corregir selectores frágiles y reemplazar pausas fijas por sincronización basada en estado.

## Escenario de negocio

Una aplicación cambia etiquetas después de una actualización menor. El bot falla al encontrar un botón aunque la función sigue disponible.

## Competencias desarrolladas

- Anatomía de selectores
- Atributos dinámicos
- Selectores alternativos
- Waits, polling y timeouts
- Pruebas de regresión

## Ejercicios

1. Captura selector antes del cambio simulado.
2. Identifica atributos dinámicos o demasiado específicos.
3. Crea selector alternativo.
4. Prueba selector con herramienta de PAD.
5. Agrega wait por existencia/visibilidad.
6. Simula elemento duplicado y delimita por ventana padre.
7. Documenta prevención.

## Evidencia esperada

- Selector antes/después
- Resultado de prueba de selector
- Log de wait/timeout
- Mini RCA
- Checklist de troubleshooting

## Criterios de aprobación

- El selector alternativo no es excesivamente amplio.
- El timeout tiene acción de recuperación.
- La regresión cubre al menos dos pantallas.
- Se explica diferencia entre lentitud y selector roto.

## Assets reproducibles

- Portal con selector modificado: [Portal SIT](../rpa-sandbox/portal) en modo `Selector modificado`.
- Legacy con layout cambiante: [SIT Registro Legacy](../rpa-sandbox/legacy-app) en modo `Layout cambiado`.
- Plantilla: [Checklist de selectores](../practice-assets/rpa/sit-automation-case/templates/selector-troubleshooting-checklist.md).
- Referencia: [matriz operacional](../practice-assets/rpa/sit-automation-case/validation/matriz_operacional.csv).
- Reset: vuelve a modo normal en ambos simuladores antes de cada corrida comparativa.
- Variante sin tenant: captura evidencia de selector antes/después y propone remediación sin publicar cambios.

## Reto adicional

Diseña alerta de monitoreo cuando los fallos por selector superan un umbral semanal.

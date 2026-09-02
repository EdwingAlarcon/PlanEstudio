---
id: lab-112
title: "RPA Capstone — Automatización end-to-end de proceso administrativo"
level: "RPA"
duration: 240
product: ["Power Automate Desktop", "Power Automate Cloud", "Excel", "ALM", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer", "Automation Solution Architect"]
prerequisites:
  - "Módulos RPA 67-76 completados"
  - "Labs RPA principales completados o evidencias equivalentes"
files: []
---

# RPA Capstone — Automatización end-to-end de un proceso administrativo

## Objetivo

Integrar descubrimiento, análisis, selección tecnológica, desktop flow, cloud flow, Excel/archivos, portal o app legacy simulada, errores, idempotencia, seguridad, ALM, pruebas, despliegue, operación, incident response, documentación y demo.

## Escenario de negocio

SIT procesa solicitudes administrativas recibidas por archivo. Parte puede resolverse con cloud flow, pero un portal legacy sin API exige PAD. Debes defender qué automatizas, qué no automatizas y cómo operarás la solución.

## Competencias desarrolladas

- Discovery AS-IS/TO-BE
- Diseño PDD/SDD o equivalente
- Construcción cloud + desktop
- Seguridad y ALM
- Testing, UAT y operación
- RCA y defensa técnica

## Entregables

- PDD o documento equivalente de definición del proceso
- SDD o diseño de solución
- AS-IS y TO-BE
- Matriz de viabilidad
- Diagrama
- Desktop flow y cloud flow
- Plan de pruebas y UAT
- Evidencias
- RCA de incidente
- Deployment plan
- Rollback plan
- Runbook
- Demo y retrospectiva

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El PDD/SDD no coincide con lo que realmente construye el desktop/cloud flow | El diseño se documentó antes de descubrir un caso borde en el portal legacy y no se actualizó tras el ajuste técnico | Trata PDD/SDD como documento vivo: actualízalo cada vez que un ajuste de construcción cambie inputs, outputs o el flujo del proceso |
| Una reejecución tras un fallo parcial duplica registros o pagos | El proceso no valida si un archivo/solicitud ya fue procesado antes de volver a ejecutarse (falta control de idempotencia) | Agrega una verificación de estado (por `correlationId` o identificador único) antes de cada paso crítico, para saltar lo ya procesado |
| Los datos quedan inconsistentes entre el cloud flow, el desktop flow y el archivo/Excel de origen | Cada componente actualiza su propio registro de estado sin sincronizar con los demás tras un error a mitad de proceso | Centraliza el estado del proceso en un único lugar (tabla/lista) que todos los componentes lean y actualicen, evitando estados locales divergentes |
| El portal legacy simulado falla y el bot sigue intentando indefinidamente | Los reintentos no tienen límite ni backoff, o no distinguen error transitorio de error permanente | Define un número máximo de reintentos con espera creciente y clasifica el error (transitorio vs. permanente) antes de decidir si reintenta |
| La demo/retrospectiva no puede explicar por qué falló una corrida específica | El RCA y las evidencias no correlacionan el mismo `correlationId` entre cloud flow, desktop flow y logs de archivo | Usa un identificador único de corrida en todos los componentes (cloud, desktop, logs, RCA) para poder reconstruir la secuencia completa de un incidente |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### PDD/SDD desalineado con la construcción real

- **Causa probable:** el diseño se documentó antes de resolver un caso borde del portal legacy y nunca se actualizó.
- **Cómo comprobar:** compara el flujo descrito en el SDD contra los pasos reales del desktop/cloud flow construido.
- **Cómo corregir:** actualiza el PDD/SDD con el comportamiento real, incluyendo el caso borde y su tratamiento.
- **Reiniciar vs. reparar:** repara solo la documentación afectada; no requiere reconstruir el flow.
- **Evidencia posterior a la corrección:** captura del PDD/SDD actualizado junto al diagrama coherente con la construcción.

### Reejecución duplica registros o pagos

- **Causa probable:** falta control de idempotencia: el proceso no verifica si la solicitud ya fue procesada antes de reintentar.
- **Cómo comprobar:** reejecuta intencionalmente una solicitud ya completada y revisa si se genera un registro/pago duplicado.
- **Cómo corregir:** agrega una verificación de estado por identificador único antes de ejecutar cada paso crítico (creación de registro, pago, envío).
- **Reiniciar vs. reparar:** si ya se generó una duplicación, corrígela manualmente (revertir el registro duplicado) y repara la verificación de idempotencia antes de reintentar; no reinicies todo el proceso administrativo sin antes eliminar los duplicados.
- **Evidencia posterior a la corrección:** captura de una reejecución sobre una solicitud ya procesada que no genera duplicados.

### Datos inconsistentes entre cloud flow, desktop flow y archivo de origen

- **Causa probable:** cada componente mantiene su propio estado local sin sincronizar tras un error a mitad de proceso.
- **Cómo comprobar:** compara el estado registrado en la tabla/lista central contra el estado real del archivo/Excel y el resultado del portal legacy.
- **Cómo corregir:** centraliza el estado en un único repositorio (tabla/lista) que todos los componentes lean y actualicen como fuente de verdad.
- **Reiniciar vs. reparar:** si la inconsistencia ya afectó datos reales (aunque sea simulados), reinicia el caso completo desde el estado central corregido; si solo es un desfase de lectura, basta con resincronizar el componente afectado.
- **Evidencia posterior a la corrección:** captura del estado central coincidiendo con archivo, desktop flow y cloud flow tras una corrida completa.

### Reintentos indefinidos ante fallo del portal legacy

- **Causa probable:** no hay límite de reintentos ni distinción entre error transitorio (portal lento) y error permanente (selector roto, dato inválido).
- **Cómo comprobar:** revisa el log de la corrida fallida y cuenta cuántas veces reintentó sin límite ni backoff.
- **Cómo corregir:** define un máximo de reintentos con espera creciente, y clasifica el error antes de reintentar (solo reintenta transitorios).
- **Reiniciar vs. reparar:** repara la lógica de reintentos y reinicia únicamente la ejecución que quedó en bucle; el resto del proceso no se ve afectado.
- **Evidencia posterior a la corrección:** captura del log mostrando el límite de reintentos aplicado y la clasificación del error.

### RCA no puede reconstruir una corrida fallida

- **Causa probable:** cloud flow, desktop flow y logs de archivo no comparten el mismo identificador de corrida (`correlationId`).
- **Cómo comprobar:** intenta correlacionar los tres registros (cloud, desktop, archivo) de una corrida fallida usando su identificador.
- **Cómo corregir:** propaga el mismo `correlationId` desde el disparo del cloud flow hasta el log del desktop flow y el archivo de salida.
- **Reiniciar vs. reparar:** repara la propagación del identificador; no requiere rehacer las corridas ya ejecutadas, solo aplicarlo hacia adelante.
- **Evidencia posterior a la corrección:** captura del RCA reconstruyendo la secuencia completa de una corrida usando un único `correlationId`.

## Requisitos no funcionales

- **Seguridad:** credenciales fuera del código y permisos mínimos para cuentas de ejecución.
- **Resiliencia:** reintentos limitados, manejo de portal caído, archivos corruptos y ejecución parcial.
- **Idempotencia:** una reejecución no duplica registros, archivos ni pagos.
- **Operación:** monitoreo, owner, runbook, rollback y criterios claros de escalamiento.
- **Mantenibilidad:** selectores, rutas, umbrales y configuración por ambiente no quedan hardcodeados.

## Criterios de aprobación

- La selección tecnológica no presenta RPA como solución universal.
- Hay idempotencia y manejo de errores.
- La seguridad evita secretos en texto plano y permisos excesivos.
- El ALM separa ambientes y configuración.
- La operación tiene owner, monitoreo, soporte y rollback.

## Assets reproducibles

- Dataset completo: [SIT Automation Case](../practice-assets/rpa/sit-automation-case/README.md).
- Mapa lab-assets: [lab_asset_map.csv](../practice-assets/rpa/sit-automation-case/reference/lab_asset_map.csv).
- Plantillas base: [AS-IS](../practice-assets/rpa/sit-automation-case/templates/as-is.md), [TO-BE](../practice-assets/rpa/sit-automation-case/templates/to-be.md), [plan de pruebas](../practice-assets/rpa/sit-automation-case/templates/test-plan.md) y [casos UAT](../practice-assets/rpa/sit-automation-case/templates/casos-uat.md).
- Comparativa: [matriz de viabilidad RPA](../practice-assets/rpa/sit-automation-case/reference/matriz_viabilidad_rpa.csv) y [comparativa tecnológica](../practice-assets/rpa/sit-automation-case/reference/comparativa_tecnologica.csv).
- Reset: restaura el paquete desde `input`, reinicia simuladores y usa un nuevo identificador de corrida.
- Variante sin tenant: entrega la simulación completa y separa explícitamente qué validaciones quedan pendientes por licencia o ambiente.

## Rúbrica resumida

| Criterio | Peso |
|---|---:|
| Análisis del proceso | 10% |
| Selección tecnológica | 10% |
| Arquitectura | 10% |
| Construcción | 15% |
| Resiliencia | 15% |
| Seguridad | 10% |
| ALM | 10% |
| Testing | 10% |
| Operación | 5% |
| Defensa y evidencia | 5% |

## Solución de referencia

Después de completar tu intento, compara tu entrega con
[Soluciones de Referencia para Capstones](/recursos/soluciones-referencia-capstones#lab-112--rpa-capstone).
La referencia te ayuda a validar idempotencia, límites de RPA, seguridad, operación y evidencia.

## Fallos críticos

Credenciales en texto plano, permisos excesivos, cambios directos en producción, ausencia de manejo de errores, duplicaciones no controladas, datos sensibles expuestos, ausencia de rollback en procesos críticos, automatización basada únicamente en coordenadas sin justificación, reintentos infinitos, no cerrar aplicaciones o archivos, no validar resultados.

## Reto adicional

Agrega un segundo proceso administrativo distinto (con su propio dataset de `sit-automation-case`) que
comparta componentes reutilizables (selectores, manejo de errores, logging) con el primero. Documenta
qué porcentaje del código quedó reutilizado vs. escrito de cero — es el indicador real de si tu
arquitectura de automatización escala a más de un proceso.

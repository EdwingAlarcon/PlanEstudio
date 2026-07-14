---
id: lab-92
title: "JR-012 — Production Incident Simulation"
level: "N4"
duration: 180
product: ["Dataverse", "Plugin Trace Log", "Application Insights"]
certifications: ["PL-400"]
role: ["Dynamics 365 CRM Developer", "Power Platform Developer"]
prerequisites:
  - "Módulo 23 estudiado: C# Plugins para Dataverse"
  - "Lab 73 completado (recomendado): Dataverse Plugin C#"
---

# Lab 92 — JR-012: Production Incident Simulation

## Objetivo

Diagnosticar un incidente de producción simulado (un plugin que empezó a fallar de forma
intermitente tras un despliegue reciente) a partir de evidencia de Plugin Trace Log, proponer causa
raíz, fix y plan de regresión, y documentar el post-mortem — como prueba técnica de troubleshooting.

## Escenario de negocio

**Empresa ficticia:** Northwind Logistics.

Desde ayer a las 09:14, el plugin `ValidateShipmentPlugin` (registrado en `Create` de la tabla
`sit_shipment`, stage PostOperation, síncrono) falla aproximadamente en el 3% de las ejecuciones.
El equipo de soporte reporta que algunos envíos quedan sin validar y que el error no es
reproducible manualmente en TEST. Ayer se desplegó una solución que agregó un nuevo campo
obligatorio y una regla de negocio adicional al mismo formulario.

## Rol del estudiante

Actúas como CRM Developer de guardia (on-call) investigando un incidente en producción.

## Herramientas necesarias

- Extracto de Plugin Trace Log (provisto abajo).
- Editor de texto para documentar el análisis.
- Acceso conceptual a Application Insights si tu ambiente lo tiene configurado.

## Entregables

- Nota de triage (severidad, alcance, impacto).
- Análisis de causa raíz con al menos 3 hipótesis descartadas o confirmadas.
- Fix propuesto (código o plan de cambio).
- Plan de pruebas de regresión.
- Resumen de post-mortem.

## Pasos detallados

### Paso 1 — Triage

Con la evidencia disponible, documenta:

- Severidad (¿bloquea el negocio o es degradado parcial?).
- Alcance (¿todos los envíos o un subconjunto?).
- Impacto de negocio (¿qué pasa si un envío queda sin validar?).

### Paso 2 — Evidencia del Plugin Trace Log

Este es un extracto real de dos ejecuciones del mismo plugin — una exitosa y una fallida:

```text
[Ejecución A — exitosa]
Entered ValidateShipmentPlugin.Execute(), Depth: 1
Correlation Id: a1b2c3d4-...
Target Id: 7f3e-shipment-001
Weight: 42.5, DestinationCountry: "MX"
Validación de peso OK. Validación de destino OK.
Exiting ValidateShipmentPlugin.Execute(), Duration: 180ms

[Ejecución B — fallida]
Entered ValidateShipmentPlugin.Execute(), Depth: 1
Correlation Id: e5f6a7b8-...
Target Id: 7f3e-shipment-118
Weight: 0, DestinationCountry: NULL
Exception: System.NullReferenceException: Object reference not set to an instance of an object.
   at ValidateShipmentPlugin.Execute(IServiceProvider serviceProvider)
Exiting ValidateShipmentPlugin.Execute(), Duration: 45ms
```

Nota adicional del equipo de soporte: los envíos que fallan fueron creados desde una integración
externa (no desde el formulario), y el campo `DestinationCountry` es el campo nuevo que se agregó
ayer como parte del despliegue.

### Paso 3 — Hipótesis de causa raíz

Evalúa cada hipótesis con la evidencia disponible:

| Hipótesis | ¿Consistente con la evidencia? | Cómo confirmarla |
|---|---|---|
| Throttling / límite de Dataverse (error 429/`OperationThrottled`) | No — el error es `NullReferenceException`, no un error de throttling | Revisar si el mensaje de error coincide con los patrones conocidos de throttling |
| Recursión (`Depth > 1`) | No — el log muestra `Depth: 1` en ambas ejecuciones | Confirmar el valor de `Depth` en el trace |
| Campo nuevo sin manejo de nulos | Sí — `DestinationCountry: NULL` en la ejecución fallida, y el campo se agregó en el último despliegue; la integración externa no lo está enviando | Revisar el código en busca de acceso directo al atributo sin `GetAttributeValue` con manejo de nulo |
| Timeout del pipeline síncrono (límite de 2 minutos) | No — la duración fue de 45ms | Revisar duración en el trace |

Causa raíz más probable: el plugin accede a `DestinationCountry` sin verificar si el atributo
existe, y la integración externa que crea envíos todavía no fue actualizada para enviar ese campo
nuevo — el despliegue de ayer introdujo una dependencia que no todos los orígenes de datos cumplen.

### Paso 4 — Fix y plan de regresión

Propón el fix (manejo seguro del atributo ausente) y documenta:

- Cómo reproducirías el bug en TEST antes de desplegar el fix (crear un registro sin `DestinationCountry`).
- Casos de regresión: registro con el campo, registro sin el campo, registro creado desde la integración externa, registro creado desde el formulario.
- Si el fix requiere coordinar con el equipo de integración (para que empiecen a enviar el campo) o si el plugin debe tolerar su ausencia indefinidamente.

## Criterios de validación

- [ ] El triage identifica severidad, alcance e impacto con base en la evidencia, no en suposiciones.
- [ ] El análisis descarta explícitamente throttling, recursión y timeout usando el trace log.
- [ ] La causa raíz identificada es consistente con toda la evidencia (incluyendo el dato de la integración externa).
- [ ] El fix maneja el atributo ausente de forma segura.
- [ ] El plan de regresión cubre al menos los 4 casos listados en el Paso 4.

## Rúbrica

| Criterio | Peso |
|---|---|
| Triage | 15% |
| Análisis de hipótesis basado en evidencia | 30% |
| Causa raíz correcta | 20% |
| Fix propuesto | 20% |
| Plan de regresión y post-mortem | 15% |

## Errores comunes

- Proponer una causa raíz sin descartar las demás hipótesis con la evidencia disponible.
- Ignorar el dato de que el error solo ocurre en registros creados por la integración externa.
- Escribir un fix que solo evita la excepción sin decidir qué comportamiento correcto debe tener el envío sin destino.
- Omitir el plan de regresión y pasar directo al deploy del fix.

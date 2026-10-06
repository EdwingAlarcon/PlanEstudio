---
id: lab-114
title: "Monitoreo con Application Insights — Diagnóstico de una Solución en Producción"
level: "N4"
duration: 90
product: ["Application Insights", "Power Automate", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Administrator", "Solution Architect"]
prerequisites:
  - "Lab 63 completado (o acceso a cualquier solución propia con al menos un flujo de Power Automate activo)"
  - "Módulo 26 estudiado: Performance y Optimización"
files: []
lastVerified: "2026-10"
---

# Lab 114 — Monitoreo con Application Insights: Diagnóstico de una Solución en Producción

## Objetivo

Configurar Application Insights sobre una solución Power Platform que ya construiste (o una
solución de práctica equivalente), generar una alerta real a partir de un umbral de fallos, y
diagnosticar el problema usando el dashboard — no solo leer sobre monitoreo, sino operarlo.

## Nivel

**Nivel Avanzado/Arquitecto — Buenas Prácticas** (no es una certificación oficial Microsoft).

## Rol recomendado

Developer, Administrator, Solution Architect.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** El sistema de solicitudes de SIT (el mismo que construiste o extendiste
en labs anteriores) ya está en uso. El área de Operaciones reporta que "a veces" las solicitudes
no se procesan, pero nadie puede decir cuándo, cuánto ni por qué — no hay ningún mecanismo de
observabilidad configurado. Tu tarea es instrumentarlo antes de que el próximo incidente vuelva a
depender de que alguien "lo note a tiempo".

**Por qué es una buena tarea para practicar:** la mayoría de labs de este curso construyen o
diagnostican con evidencia ya disponible (Plugin Trace Log, run history). Este lab es distinto:
tú decides qué medir, configuras la instrumentación desde cero, y solo después tienes evidencia
para diagnosticar — el orden real de un proyecto de producción.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Conectar Application Insights a un recurso de la solución | 20 min |
| Ejercicio 2 — Definir qué medir y configurar una alerta real | 25 min |
| Ejercicio 3 — Provocar el escenario de falla y diagnosticar con el dashboard | 30 min |
| Ejercicio 4 — Documentar el hallazgo y la acción preventiva | 15 min |
| **Total** | **90 min** |

## Tecnologías utilizadas

- Application Insights (recurso de Azure, tier gratuito es suficiente para este lab).
- Power Automate (flujo propio o uno de práctica con al menos 3-4 pasos).
- Power Platform Admin Center (Analytics de Power Automate como fuente complementaria si no
  tienes un recurso de Azure disponible — ver nota de alcance abajo).

## Nota de alcance — si no tienes una suscripción de Azure con permisos para crear recursos

Si no puedes crear un recurso real de Application Insights (falta de suscripción o permisos),
ejecuta este lab usando **Power Automate Analytics** (Power Platform Admin Center → tu entorno →
Analytics → Power Automate) como fuente de telemetría equivalente: tiene ejecuciones, tasas de
error y latencia por flujo, aunque con menos profundidad de consulta que Application Insights.
Documenta explícitamente en tu evidencia cuál de las dos fuentes usaste — un empleador real
valora más que declares la diferencia que que finjas haber usado la herramienta "completa".

## Ejercicio 1 — Conectar la instrumentación

1. Crea (o reutiliza) un recurso de Application Insights en el portal de Azure.
2. Conéctalo a tu flujo de Power Automate: Power Automate no se integra de forma nativa y directa
   con Application Insights como lo hace una Azure Function — la vía recomendada es instrumentar
   el componente que SÍ controlas con código (un Azure Function o Custom Connector que el flujo
   invoque) y dejar que ese componente reporte a Application Insights, o usar Power Automate
   Analytics si tu escenario no incluye un componente con código propio.
3. Si usas el camino de Azure Function: agrega el SDK de Application Insights, instrumenta al
   menos una traza de inicio, una de éxito y una de error con el payload relevante (sin datos
   sensibles ni personales reales).

**Validación esperada:** el recurso de Application Insights (o el panel de Power Automate
Analytics) recibe al menos una ejecución real de tu flujo tras esta configuración.

## Ejercicio 2 — Definir qué medir y configurar una alerta real

No midas todo por defecto — decide, con criterio de negocio, qué señal importa para ESTE flujo:

- ¿Tasa de fallos? ¿Latencia por encima de un umbral? ¿Ausencia total de ejecuciones en una
  ventana esperada (el flujo "se quedó callado")?

Configura una regla de alerta real (en Application Insights: Alerts → New alert rule; en Power
Automate Analytics: no hay alerta nativa configurable desde la UI estándar — documenta esto como
limitación si usaste esa vía y describe cómo lo resolverías con un paso adicional de notificación
dentro del propio flujo).

**Validación esperada:** tienes una condición de alerta configurada (o diseñada y documentada si
la herramienta no lo permite nativamente) con un umbral justificado por escrito — no un número
arbitrario.

## Ejercicio 3 — Provocar la falla y diagnosticar

Provoca deliberadamente un escenario de fallo controlado y no destructivo (ejemplos: una acción
del flujo que apunte a un recurso inexistente a propósito, un valor de entrada inválido que el
flujo no valida). Ejecuta el flujo varias veces hasta que se dispare la condición que configuraste
en el Ejercicio 2.

Con el dashboard (Application Insights → Transaction search/Failures, o Power Automate Analytics
→ vista de errores), responde por escrito, con evidencia (captura o export), SIN que el lab te
diga los pasos exactos:

1. ¿En qué paso específico del flujo ocurrió el fallo?
2. ¿Es un fallo transitorio (reintentar resolvería) o determinístico (seguirá fallando igual)?
3. ¿Cuántas ejecuciones se vieron afectadas en la ventana que investigaste?

## Ejercicio 4 — Documentar hallazgo y prevención

Escribe un informe corto (formato libre, pero debe incluir): el síntoma observado en el
dashboard, la causa raíz, qué cambiarías en el flujo para que el próximo fallo similar se note
antes (no solo "lo arreglé", sino "así lo detectaré la próxima vez sin tener que provocarlo yo
mismo").

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Configurar una alerta sin umbral justificado ("por si acaso") | No se definió qué señal de negocio importa realmente | Decide primero qué pregunta de negocio responde la alerta, luego el umbral |
| Confundir Power Automate Analytics con Application Insights real | No se investigó la diferencia de profundidad entre ambas fuentes | Declarar explícitamente cuál se usó y por qué, igual que se documenta en este lab |
| Diagnosticar sin generar evidencia nueva (solo mirar logs viejos) | Asumir que el dashboard ya tenía la respuesta sin provocar el escenario | Provocar activamente el fallo controlado antes de concluir una causa raíz |
| Reportar "arreglado" sin mecanismo de detección futura | Confundir corrección puntual con observabilidad sostenida | El informe final debe explicar cómo se detectará la próxima vez, no solo qué se corrigió esta vez |

## Criterios de Validación

- [ ] Conecté una fuente real de telemetría (Application Insights o Power Automate Analytics, documentando cuál)
- [ ] Configuré (o diseñé y documenté) una alerta con umbral justificado por escrito
- [ ] Provoqué un fallo controlado y lo diagnostiqué con evidencia del dashboard, sin pasos prescritos
- [ ] Documenté causa raíz y mecanismo de detección futura, no solo la corrección puntual

## Evidencia esperada

- Captura o export del dashboard mostrando al menos una ejecución exitosa y una fallida.
- Configuración de la alerta (captura o descripción técnica si la herramienta no permite exportarla).
- Informe de diagnóstico: síntoma, paso donde ocurrió, transitorio vs. determinístico, causa raíz.
- Plan de detección futura (qué cambiaría para no depender de provocar el fallo manualmente).

## Criterios de aprobación

- La alerta tiene un umbral justificado por una pregunta de negocio concreta, no un número arbitrario.
- El diagnóstico identifica el paso exacto de fallo con evidencia del dashboard, no solo una suposición razonable.
- El informe distingue explícitamente "lo que arreglé" de "cómo lo detectaré la próxima vez".
- 100% de los ítems de Criterios de Validación marcados.

## Preguntas de Reflexión

1. ¿Por qué una alerta sin umbral justificado puede ser tan mala como no tener ninguna alerta?
2. ¿Qué información pierdes al usar Power Automate Analytics en vez de Application Insights real, y cuándo esa pérdida importaría en un proyecto real?
3. ¿Cómo cambiaría tu estrategia de monitoreo si el flujo procesara datos financieros en vez de solicitudes internas?

## Módulos Relacionados

- Módulo 24 — Integraciones con Azure Services
- Módulo 26 — Performance y Optimización
- Lab 63 — Capstone Developer (solución sobre la que se instrumenta este lab)

## Competencias Desarrolladas

- Instrumentación de observabilidad real sobre una solución existente.
- Diseño de umbrales de alerta justificados por una pregunta de negocio.
- Diagnóstico de fallos con evidencia de telemetría, no solo con logs ya disponibles.
- Comunicación de prevención, no solo de corrección puntual.

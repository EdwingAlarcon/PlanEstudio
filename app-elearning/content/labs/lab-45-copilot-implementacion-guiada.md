---
id: lab-45
title: "Copilot/Claude Code — Implementación Guiada sobre el Escenario SIT"
level: "N5"
duration: 90
product: ["GitHub Copilot", "Claude Code", "Power Automate", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Maker"]
prerequisites:
  - "Lab 05 completado — flujo de aprobación de gastos en Dataverse"
  - "Editor con GitHub Copilot o Claude Code instalado"
  - "Módulo 44 y 45 estudiados: GitHub Copilot en VS Code, Claude Code y Codex"
files: []
---

# Lab 45 — Implementación Guiada con IA sobre el Escenario SIT

## Objetivo

Al finalizar este laboratorio habrás usado un asistente o agente de código para implementar una extensión real y acotada sobre el flujo de aprobación de gastos de Servicios Integrados Tecnológicos S.A. (SIT), aplicando el ciclo completo de tarea acotada → generación → revisión de diff → verificación.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 05

**Problema a resolver:** El flujo de aprobación de gastos (Lab 05) notifica al aprobador pero no registra cuánto tiempo tarda cada aprobación, dato que Finanzas necesita para su reporte mensual de SLA interno. Se necesita agregar un campo de "tiempo de aprobación en horas" calculado automáticamente cuando el estado cambia a Aprobado o Rechazado.

**Por qué es una buena tarea para practicar el flujo asistido por IA:** es un cambio pequeño, acotado a un flujo existente, con un criterio de éxito verificable (el campo se calcula correctamente), y de bajo riesgo si algo sale mal (no toca pagos ni aprobaciones, solo un campo de reporting).

## Lo que vas a construir

- Un campo nuevo `sit_horasaprobacion` en la tabla de solicitudes de gasto
- Una modificación al flujo de Power Automate del Lab 05 que calcule y guarde ese valor al cambiar el estado
- Un test manual documentado que confirme el cálculo correcto en 2 escenarios (aprobación rápida, aprobación después de varios días)

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Diseñar la tarea (humano): definir alcance y criterio de éxito | 15 min |
| Ejercicio 2 — Implementar con Copilot/Claude Code el campo y la lógica del flujo | 35 min |
| Ejercicio 3 — Revisar el diff/cambio generado con la checklist del Módulo 48 | 20 min |
| Ejercicio 4 — Verificar con los 2 escenarios de prueba | 20 min |
| **Total** | **90 min** |

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Tecnologías utilizadas

- GitHub Copilot o Claude Code (a elección)
- Power Automate (flujo del Lab 05)
- Microsoft Dataverse (tabla de solicitudes de gasto)

## Ejercicio 1 — Diseñar la tarea (humano diseña)

Antes de abrir cualquier herramienta de IA, escribe en un párrafo:
1. El campo exacto a agregar (`sit_horasaprobacion`, tipo Whole Number).
2. En qué punto del flujo se debe calcular (al cambiar `sit_estado` a "Aprobado" o "Rechazado").
3. El criterio de éxito: "el campo refleja las horas completas transcurridas entre la creación de la solicitud y el cambio de estado, redondeadas hacia abajo".

## Ejercicio 2 — Implementar con asistencia de IA

Usando la plantilla de prompt que hayas construido en el Módulo 47 (o una instrucción acotada siguiendo el Módulo 45), pide a Copilot o Claude Code:
1. Agregar el campo `sit_horasaprobacion` a la definición de la tabla (o los pasos para agregarlo desde el editor de Dataverse, si tu herramienta no edita el esquema directamente).
2. Modificar el flujo de Power Automate del Lab 05 agregando una acción que calcule la diferencia en horas entre `createdon` y la fecha actual, y la guarde en el nuevo campo, solo cuando `sit_estado` cambie a Aprobado o Rechazado.

Da a la herramienta el contexto del flujo existente (ábrelo o descríbelo) antes de pedir la modificación.

## Ejercicio 3 — Revisar el resultado (humano aprueba, parcial)

Aplica la checklist del Módulo 48 sobre el cambio propuesto:
- **Alcance:** ¿el cambio toca solo el campo y el flujo de aprobación, o modifica algo más?
- **Efectos secundarios:** ¿la nueva acción podría fallar o bloquear el flujo si `createdon` no está disponible?
- **Seguridad:** ¿el cambio introduce algún permiso o conector nuevo no necesario?
- **Tests:** ver Ejercicio 4.

## Ejercicio 4 — Verificar (CI valida, en este caso manual)

Prueba el flujo modificado con 2 registros de ejemplo:
1. Una solicitud aprobada la misma hora en que fue creada — el campo debe mostrar `0`.
2. Una solicitud aprobada 3 días después de creada — el campo debe mostrar el número de horas correspondiente (aproximadamente 72).

Documenta el resultado de ambas pruebas antes de marcar el laboratorio como completado.

## Criterios de Validación

- [ ] Definí el alcance y criterio de éxito antes de usar la herramienta de IA
- [ ] El campo `sit_horasaprobacion` se agregó y se calcula correctamente al cambiar el estado
- [ ] Revisé el cambio con la checklist de alcance/efectos secundarios/seguridad del Módulo 48
- [ ] Verifiqué el cálculo con los 2 escenarios de prueba y documenté el resultado

## Evidencia esperada

- Prompt usado y diff generado por la IA para el campo `sit_horasaprobacion`
- Resultado de los 2 escenarios de prueba con el valor calculado documentado
- Checklist de revisión (alcance/efectos secundarios/seguridad) completada

## Criterios de aprobación

- El campo calcula correctamente el valor en ambos escenarios de prueba
- La revisión humana quedó documentada antes de aprobar el cambio generado por IA
- 100% de los ítems de Criterios de Validación marcados

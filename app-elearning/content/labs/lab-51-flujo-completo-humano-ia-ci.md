---
id: lab-51
title: "Proyecto Integrador Nivel IA — Flujo Completo Humano → IA → CI → Aprobación"
level: "N5"
duration: 360
product: ["GitHub Copilot", "Claude Code", "GitHub Actions", "Power Platform"]
certifications: ["Buenas Prácticas de Desarrollo Asistido por IA"]
role: ["Developer", "Solution Architect", "AI/Copilot Specialist"]
prerequisites:
  - "Lab 45 completado"
  - "Módulos 42-51 estudiados (nivel IA completo)"
  - "Acceso a un repositorio con pipeline de CI configurado (puede ser este mismo proyecto)"
  - "Recurso revisado: Rúbricas y Plantillas de Evaluación"
---

# Lab 51 — Proyecto Integrador Nivel IA: Flujo Completo Humano → IA → CI → Aprobación

## Objetivo

Este es el proyecto que cierra el Nivel IA — equivalente en exigencia a los proyectos integradores
de los niveles Básico, Intermedio, Avanzado y Arquitecto (Módulos 8, 17, 30 y 41), pero aplicado a
desarrollo asistido por IA: ejecutar de punta a punta, sobre un cambio real y con evidencia
verificable, el flujo humano diseña → IA implementa → CI valida → humano aprueba, con auditoría de
prompts y una matriz de riesgos de IA propia del cambio.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT).

El equipo de plataforma de SIT quiere adoptar formalmente el flujo de 4 etapas como estándar para
todo el equipo, pero necesita primero una prueba documentada, completa y auditable — no un
ejemplo de juguete — antes de exigirlo a todo el equipo. Este proyecto es esa prueba: un cambio
real, acotado pero con entregables completos, llevado por las 4 etapas sin atajos, con el mismo
nivel de rigor que un proyecto de cierre de cualquier otro nivel.

## Restricciones del proyecto

- **Datos sensibles:** el prompt no puede incluir datos reales de clientes ni credenciales —
  debes documentar cómo verificaste esto antes de enviarlo a la IA.
- **Política de agentes:** si usas un agente con capacidad de ejecutar comandos o modificar
  archivos automáticamente, debes declarar explícitamente qué alcance le diste y por qué.
- **Gate de CI obligatorio:** ningún cambio se considera aprobado si el pipeline (lint, typecheck,
  tests) está en rojo, sin importar qué tan simple parezca el cambio.

## Alcance del proyecto

Un cambio real y acotado en un repositorio con pipeline de CI (puede ser este mismo proyecto
PlanEstudio, sobre una rama de práctica), llevado por las 4 etapas: diseño documentado,
implementación asistida por IA con auditoría de prompts, validación en CI, y aprobación humana
con checklist y matriz de riesgos.

Fuera de alcance:

- Cambios que toquen más de 3-4 archivos o que requieran diseño arquitectónico extenso (usa el
  Módulo 41 o el Lab 63 para ese nivel de complejidad).
- Entrenar o ajustar un modelo de IA — este proyecto es sobre el proceso de uso, no sobre el
  modelo en sí.

## Prerrequisitos

- Haber completado el Lab 45 y estudiado los módulos 42-51.
- Tener acceso a un repositorio con pipeline de CI (lint, typecheck, tests).

## Herramientas necesarias

- GitHub Copilot, Claude Code o Codex (a elección).
- Pipeline de CI existente del repositorio.
- Git (rama de práctica dedicada para este proyecto).
- Recurso `/recursos/rubricas-plantillas` (rúbrica IA y Agentes Gobernados).

## Entregables

### 1. Especificación humana del cambio

Documenta antes de involucrar a la IA:

- El problema exacto a resolver.
- El alcance: qué archivo(s) se tocan y cuáles no.
- El criterio de éxito verificable (por ejemplo, "el test X pasa" o "el mensaje Y aparece en este
  componente").
- Qué restricciones de seguridad aplican (datos sensibles, alcance del agente).

### 2. Auditoría de prompts

- Guarda el o los prompts exactos usados (no un resumen posterior).
- Documenta explícitamente que verificaste la ausencia de datos sensibles o credenciales antes de
  enviarlos.
- Si usaste un agente con capacidad de ejecutar comandos, documenta qué alcance le diste.

### 3. Implementación y diff generado

- El diff completo generado por la IA dentro del alcance definido en el Entregable 1.
- Si la herramienta ofrece un modo de aplicar cambios directamente (Copilot Edits, Agent Mode),
  conserva el diff propuesto antes de aceptarlo, no solo el resultado final.

### 4. Evidencia de CI

- Resultado de ejecutar (localmente o vía un PR de práctica que dispare el pipeline):

```bash
npm run lint
npx tsc --noEmit
npx vitest run
```

- Si algo falla, el proyecto debe mostrar el ciclo de corrección (qué falló, qué ajustaste, qué
  volviste a ejecutar) — no solo el resultado final en verde.

### 5. Revisión humana del diff

Revisa el diff completo como si fueras un segundo revisor, aplicando la checklist del Módulo 48:

- Alcance: ¿coincide con lo definido en el Entregable 1?
- Efectos secundarios: ¿algo cambió que no debía?
- Seguridad: ¿se introdujo algún secreto, permiso o dependencia nueva no justificada?
- Tests: ¿el criterio de éxito está cubierto por un test o verificación?

Documenta explícitamente tu decisión (apruebas o no) y por qué.

### 6. Matriz de riesgos de IA del cambio

Al menos 3 riesgos específicos de este cambio concreto (no genéricos): por ejemplo, que la IA haya
generado una validación incompleta que parece correcta a simple vista, que el diff incluya una
dependencia nueva no auditada, o que el agente haya asumido un alcance más amplio del solicitado.
Cada riesgo con su mitigación.

### 7. Resumen ejecutivo del ciclo

Una página cubriendo:

1. El cambio realizado y su criterio de éxito.
2. Si tuviste que devolverte a una etapa anterior en algún punto, y por qué.
3. Qué harías distinto la próxima vez que uses este flujo.

## Resultado esperado

Un caso documentado, completo y auditable, que el equipo de plataforma de SIT podría usar como
plantilla de referencia para exigir el flujo de 4 etapas a todo el equipo.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Especificación humana | 15% | Problema, alcance y criterio de éxito definidos antes de la IA |
| Auditoría de prompts | 20% | Prompts exactos guardados, verificación explícita de ausencia de datos sensibles |
| Implementación (diff) | 15% | El cambio respeta el alcance definido, sin efectos secundarios no declarados |
| Validación CI | 15% | Pipeline en verde antes de la aprobación, ciclo de corrección documentado si hubo fallos |
| Revisión humana | 15% | Checklist del Módulo 48 aplicada con decisión explícita y justificada |
| Matriz de riesgos de IA | 15% | ≥3 riesgos específicos del cambio con mitigación concreta |
| Resumen ejecutivo | 5% | Reflexión concreta, no genérica ("funcionó bien") |

Aprobación: mínimo 70/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥88/100.

## Evidencia esperada

- Documento de especificación del cambio.
- Log de prompts usados.
- Diff completo generado por la IA.
- Resultado de la ejecución de CI (captura o log).
- Documento de revisión humana con decisión.
- Matriz de riesgos de IA del cambio.
- Resumen ejecutivo de una página.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Prompt guardado como resumen, no como texto exacto | Se documenta después de memoria | Copiar el prompt real desde el historial de la herramienta antes de cerrar la sesión |
| CI en rojo "temporalmente" aceptado | Presión por avanzar a la siguiente etapa | Ningún criterio puede aprobarse con el pipeline en rojo, sin excepción |
| Revisión humana superficial ("se ve bien") | El diff parece correcto a simple vista | Aplicar la checklist completa del Módulo 48, no una lectura rápida |
| Matriz de riesgos genérica copiada de otro proyecto | No se analizó el cambio específico | Cada riesgo debe nombrar la línea o archivo específico que lo origina |

## Reto adicional

Repite el ciclo con un segundo cambio, pero esta vez fuerza deliberadamente que el CI falle en el
primer intento (por ejemplo, pidiendo a la IA un cambio incompleto). Documenta cómo identificaste
la falla y qué ajustaste antes de volver a intentar la aprobación — esto demuestra que el flujo
funciona también cuando algo sale mal, no solo en el camino feliz.

## Módulos relacionados

- Módulos 42-50 — fundamentos, herramientas, vibe coding controlado, prompts, revisión de diffs y seguridad
- Módulo 48 — Checklist de revisión de diffs generados por IA
- Lab 45 — Copilot: implementación guiada
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Ejecución completa del flujo humano diseña → IA implementa → CI valida → humano aprueba.
- Auditoría de prompts y verificación de ausencia de datos sensibles.
- Revisión crítica de código generado por IA con checklist explícita.
- Análisis de riesgos de IA aplicado a un cambio concreto, no genérico.
- Documentación de un ciclo completo de desarrollo asistido por IA.

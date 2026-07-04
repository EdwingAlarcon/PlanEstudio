---
id: lab-51
title: "Flujo Completo Humano → IA → CI → Aprobación sobre un Caso Real"
level: "N5"
duration: 100
product: ["GitHub Copilot", "Claude Code", "GitHub Actions", "Power Platform"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect"]
prerequisites:
  - "Lab 45 completado"
  - "Módulos 42-51 estudiados (nivel IA completo)"
  - "Acceso a un repositorio con pipeline de CI configurado (puede ser este mismo proyecto)"
files: []
---

# Lab 51 — Flujo Completo Humano → IA → CI → Aprobación (Capstone)

## Objetivo

Al finalizar este laboratorio habrás ejecutado, de punta a punta y sobre un caso real, el flujo recomendado del Módulo 51: humano diseña, IA implementa, CI valida, humano aprueba — documentando explícitamente cada etapa y cualquier retorno a un paso anterior.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — cierre del nivel IA

**Problema a resolver:** El equipo de plataforma de SIT quiere adoptar formalmente el flujo de 4 etapas como estándar, pero necesita primero una prueba documentada end-to-end antes de exigirlo a todo el equipo. Este laboratorio es esa prueba: un cambio real, pequeño pero completo, llevado por las 4 etapas sin atajos.

**Por qué es el capstone del nivel:** integra lo aprendido en los módulos 42-50 — fundamentos, herramientas concretas, vibe coding controlado, prompts reutilizables, revisión de diffs, seguridad, y tests/CI — en un solo ciclo aplicado.

## Lo que vas a construir

Un cambio real y acotado en un repositorio con pipeline de CI (puede ser este mismo proyecto PlanEstudio, sobre una rama de práctica), llevado por las 4 etapas: diseño documentado, implementación asistida por IA, validación en CI, y aprobación humana con checklist.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Humano diseña: elegir el cambio y escribir el criterio de éxito | 15 min |
| Ejercicio 2 — IA implementa: generar el cambio con una plantilla o tarea acotada | 30 min |
| Ejercicio 3 — CI valida: ejecutar lint/typecheck/tests localmente o en el pipeline | 20 min |
| Ejercicio 4 — Humano aprueba: revisar el diff completo con la checklist del Módulo 48 | 20 min |
| Ejercicio 5 — Documentar el ciclo completo | 15 min |
| **Total** | **100 min** |

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (capstone, no es una certificación oficial Microsoft)

## Tecnologías utilizadas

- GitHub Copilot, Claude Code o Codex (a elección)
- Pipeline de CI existente del repositorio (lint, typecheck, tests, build)
- Git (rama de práctica dedicada para este laboratorio)

## Ejercicio 1 — Humano diseña

Elige un cambio real, pequeño y de bajo riesgo (ej. un mensaje de error más claro, un test faltante, una mejora de accesibilidad menor). Escribe:
1. El problema exacto a resolver.
2. El alcance: qué archivo(s) se tocan y cuáles no.
3. El criterio de éxito verificable (ej. "el test X pasa" o "el mensaje Y aparece en este componente").

## Ejercicio 2 — IA implementa

Usando una plantilla de prompt propia (Módulo 47) o una instrucción acotada a un agente (Módulo 45), genera el cambio dentro del alcance definido en el Ejercicio 1. Si la herramienta ofrece un modo de aplicar cambios directamente (Copilot Edits, Agent Mode), revisa el diff propuesto antes de aceptarlo.

## Ejercicio 3 — CI valida

Ejecuta localmente (o mediante un PR de práctica que dispare el pipeline):

```bash
npm run lint
npx tsc --noEmit
npx vitest run
```

Si algo falla, vuelve al Ejercicio 2 y ajusta la implementación — no continúes al Ejercicio 4 con un gate en rojo.

## Ejercicio 4 — Humano aprueba

Revisa el diff completo como si fueras un segundo revisor, aplicando la checklist del Módulo 48:
- Alcance: ¿coincide con lo definido en el Ejercicio 1?
- Efectos secundarios: ¿algo cambió que no debía?
- Seguridad: ¿se introdujo algún secreto, permiso o dependencia nueva no justificada?
- Tests: ¿el criterio de éxito del Ejercicio 1 está cubierto por un test o verificación?

Documenta explícitamente tu decisión (apruebas o no) y por qué.

## Ejercicio 5 — Documentar el ciclo

Escribe un resumen de una página cubriendo:
1. El cambio realizado y su criterio de éxito.
2. Si tuviste que devolverte a una etapa anterior en algún punto, y por qué.
3. Qué harías distinto la próxima vez que uses este flujo.

## Criterios de Validación

- [ ] Documenté el alcance y criterio de éxito antes de involucrar a la IA
- [ ] El cambio se implementó dentro del alcance definido
- [ ] El cambio pasa lint, typecheck y tests antes de la aprobación
- [ ] Reviso y aprobó (o rechazó con razones) el diff completo usando la checklist del Módulo 48
- [ ] Escribí el resumen de una página del ciclo completo

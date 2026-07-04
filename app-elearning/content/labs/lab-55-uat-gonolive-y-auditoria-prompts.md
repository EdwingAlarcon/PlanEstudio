---
id: lab-55
title: "Generar UAT/Checklist de Go-Live con IA y Auditar Prompts por Seguridad"
level: "N5"
duration: 85
product: ["GitHub Copilot", "Claude Code", "Dynamics 365"]
certifications: ["Buenas Prácticas"]
role: ["Functional Consultant", "Solution Architect", "Developer"]
prerequisites:
  - "Módulo 55 estudiado: IA para Análisis de Soluciones, Arquitectura y Consultoría Funcional D365"
  - "Módulo 49 estudiado: Seguridad, Secretos y Compliance en IA"
files: []
---

# Lab 55 — Generar UAT/Checklist de Go-Live con IA y Auditar Prompts por Seguridad

## Objetivo

Al finalizar este laboratorio habrás usado IA para acelerar dos entregables típicos de consultoría (casos de prueba UAT y checklist de go-live) sobre un escenario funcional real, y habrás practicado auditar tus propios prompts para detectar información sensible antes de compartirlos con un asistente de IA.

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Rol recomendado

Functional Consultant, Solution Architect, Developer.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** el proyecto de solicitudes de gastos de SIT está por entrar a la etapa de pruebas de usuario (UAT) antes del go-live. El equipo necesita generar casos de prueba y un checklist de salida a producción de forma rápida, pero sin exponer datos reales de la empresa en el proceso.

**Por qué es una buena tarea para practicar:** cierra el nivel IA conectando consultoría funcional (Módulo 55) con seguridad de prompts (Módulo 49) en un solo ejercicio aplicado.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Redactar el prompt inicial con datos ficticios equivalentes | 15 min |
| Ejercicio 2 — Generar casos de prueba UAT con IA | 25 min |
| Ejercicio 3 — Generar checklist de go-live con IA | 20 min |
| Ejercicio 4 — Auditar tus propios prompts de este laboratorio por seguridad | 25 min |
| **Total** | **85 min** |

## Tecnologías utilizadas

- GitHub Copilot o Claude Code
- Ninguna herramienta de Power Platform es obligatoria para este laboratorio (es de consultoría/documentación)

## Ejercicio 1 — Redactar el prompt inicial

Describe el flujo de aprobación de gastos de SIT (basado en el Lab 05) usando **solo datos ficticios equivalentes** (nombres de campos y estados sí, pero ningún dato real de una empresa existente): tabla de solicitudes, campos (monto, estado, aprobador), y las 2-3 reglas de negocio principales (ej. "montos mayores a $1000 requieren un segundo aprobador").

## Ejercicio 2 — Generar casos UAT con IA

Pide a un asistente de IA que, a partir de tu descripción del Ejercicio 1, genere al menos 6 casos de prueba UAT cubriendo: caso feliz (aprobación simple), caso de rechazo, caso de doble aprobación por monto alto, y 3 casos límite/error (ej. monto en cero, aprobador inexistente, solicitud duplicada).

## Ejercicio 3 — Generar checklist de go-live con IA

Pide a la IA que genere un checklist de go-live cubriendo al menos: migración/validación de datos, seguridad (roles asignados), plan de rollback, comunicación a usuarios finales, y monitoreo post-lanzamiento. Compara el resultado contra el pipeline de CI/CD del Módulo 50 — ¿falta algún gate técnico en la propuesta de la IA?

## Ejercicio 4 — Auditar tus propios prompts

Revisa los prompts que usaste en los Ejercicios 1-3 y responde con la checklist del Módulo 49:
1. ¿Incluiste algún nombre real de cliente, empleado o empresa?
2. ¿Incluiste algún dato que en un proyecto real sería confidencial (montos reales, políticas internas no públicas)?
3. Reescribe cualquier prompt que no pase esta auditoría, reemplazando los datos sensibles por equivalentes ficticios.

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Usar el nombre real de un cliente o proyecto en el prompt de UAT | No aplicar la sanitización del Módulo 49 desde el primer prompt | Usar siempre un escenario ficticio equivalente, como el de SIT |
| Aceptar el checklist de go-live de la IA sin comparar contra el pipeline de CI real | Confiar en que la propuesta genérica cubre todo lo necesario | Contrastar siempre contra los gates técnicos ya definidos en el proyecto (Módulo 50) |
| Generar solo casos "felices" de UAT, sin casos límite o de error | No pedir explícitamente cobertura de casos límite | Solicitar explícitamente casos de error/límite además del caso feliz |
| Omitir la auditoría de los propios prompts al final | Tratar la seguridad como un paso opcional, no obligatorio | Auditar siempre los prompts usados antes de dar por cerrado el ejercicio |

## Criterios de Validación

- [ ] Redacté un prompt inicial usando solo datos ficticios equivalentes
- [ ] Generé al menos 6 casos de prueba UAT cubriendo caso feliz, rechazo y casos límite
- [ ] Generé un checklist de go-live y lo comparé contra el pipeline de CI/CD real del proyecto
- [ ] Audité mis propios prompts de este laboratorio y corregí cualquier dato sensible encontrado

## Preguntas de Reflexión

1. ¿Qué diferencia encontraste entre el checklist de go-live generado por IA y el pipeline de CI/CD real del proyecto?
2. ¿Qué tipo de dato sensible es más fácil de "colar" sin querer en un prompt de consultoría funcional?
3. ¿Cómo integrarías la auditoría de prompts como un paso estándar de tu flujo de trabajo, no como una revisión ocasional?

## Módulos Relacionados

- Módulo 55 — IA para Análisis de Soluciones, Arquitectura y Consultoría Funcional D365
- Módulo 49 — Seguridad, Secretos y Compliance en IA
- Módulo 50 — Tests, CI/CD y Guardrails para Código Generado por IA

## Competencias Desarrolladas

- Generación acelerada de artefactos de consultoría funcional (UAT, checklist de go-live)
- Auditoría sistemática de prompts por contenido sensible antes de compartirlos
- Comparación crítica entre una propuesta genérica de IA y los estándares reales del proyecto

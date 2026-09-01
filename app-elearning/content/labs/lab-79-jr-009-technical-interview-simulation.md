---
id: lab-79
title: "JR-009 — Technical Interview Simulation"
level: "N6"
duration: 180
product: ["Power Platform", "Dynamics 365", "Technical Interview"]
certifications: ["PL-900", "PL-200 (retirado 31 ago 2026)", "PL-400", "Solution Architect"]
role: ["Todos"]
prerequisites:
  - "Ruta Job-Ready Interview Readiness revisada"
  - "Al menos un capstone o lab documentado en portafolio"
---

# Lab 79 — JR-009: Technical Interview Simulation

## Objetivo

Preparar y ejecutar una simulación de entrevista técnica con CV, LinkedIn, demo de 10 minutos,
respuestas STAR, ingles tecnico y preguntas por perfil.

## Perfil laboral y skill validado

**Vacante objetivo:** cualquier rol de Power Platform/Dynamics 365 en etapa de entrevista técnica.

**Skill concreto que valida:** capacidad de defender un proyecto real de tu portafolio con
precisión técnica, sin inflar experiencia, y de comunicarlo con la misma claridad en español e
inglés técnico — el criterio de evaluación más duro de este lab es la honestidad al distinguir
"lo hice en un lab" de "tengo experiencia laboral".

## Escenario de negocio

Aplicaste a una vacante junior/mid de Power Platform o Dynamics 365. El entrevistador quiere ver
si puedes explicar lo que hiciste, defender decisiones, reconocer limites y comunicarte con
claridad.

## Rol del estudiante

Actúas como candidato. Tu objetivo no es sonar perfecto, sino demostrar evidencia y criterio.

## Herramientas necesarias

- CV draft.
- README de proyecto.
- Capturas o ambiente de demo.
- Cronometro.
- Grabadora opcional.

## Qué puedes hacer en tenant real vs. qué debes simular

Este lab es en sí mismo una simulación — no requiere tenant. Lo que sí debe ser real es el proyecto
que demuestras: usa un lab o capstone que efectivamente completaste (ej. lab-23, lab-63, lab-101),
no un proyecto hipotético. Si no tienes ningún lab completado con evidencia, ese es el bloqueador a
resolver antes de este lab, no algo que se pueda simular aquí.

## Entregables

- Guion de demo de 10 minutos.
- CV tecnico de 1 pagina orientado a un rol.
- Perfil LinkedIn: headline, About, Featured y Projects.
- Pitch de 45 segundos en espanol.
- Pitch de 45 segundos en ingles.
- Mini-demo de 2 minutos en ingles.
- Tabla de vocabulario tecnico por perfil.
- 5 respuestas STAR.
- Banco de 20 preguntas respondidas, incluyendo al menos 8 en ingles.
- Retrospectiva de entrevista.

## Requisitos no funcionales

- **Consistencia:** CV, LinkedIn, demo y respuestas deben contar la misma historia profesional.
- **Trazabilidad:** cada claim técnico debe apuntar a un artefacto verificable del portafolio.
- **Honestidad profesional:** todo lab, simulación o sandbox debe declararse como tal.
- **Claridad:** las respuestas deben poder entenderse sin que el entrevistador conozca PlanEstudio.

## Pasos detallados

### Paso 1 — Rol objetivo

Elige un perfil:

- Maker.
- Functional Consultant.
- Developer.
- Admin/Governance.
- CRM Functional.
- CRM Developer.
- Migration Specialist.
- Solution Architect en formación.

Escribe por qué ese perfil coincide con tus evidencias actuales.

### Paso 2 — Pitch

Prepara:

```text
Soy [perfil objetivo] en formación, con práctica documentada en [tecnologías]. Mi proyecto más
relevante es [proyecto], donde resolví [problema] mediante [solución]. Tengo evidencia en
[README/capturas/rúbrica] y busco aportar en [tipo de rol].
```

### Paso 2.1 — CV tecnico de 1 pagina

Redacta un CV enfocado en el perfil elegido en el Paso 1. Debe incluir:

- Titulo profesional objetivo.
- Resumen de 3 lineas.
- Skills agrupadas por categoria.
- 2-4 proyectos o capstones con evidencia.
- Certificaciones/aprendizaje sin presentar PlanEstudio como certificacion oficial Microsoft.

Cada bullet de proyecto debe seguir esta formula:

```text
Diseñe/construi/documente + tecnologia + problema resuelto + evidencia verificable
```

Ejemplo:

```text
Documente una estrategia de migracion CRM legacy con mapping origen-destino, reglas de limpieza,
staging conceptual, reconciliacion y runbook de cutover; evidencia en README, matriz de riesgos y
plantillas de validacion.
```

### Paso 2.2 — LinkedIn tecnico

Prepara estas cuatro piezas:

| Seccion | Entregable |
|---|---|
| Headline | Rol objetivo + 3-4 skills clave |
| About | 3 parrafos: foco, evidencia, busqueda |
| Featured | Lista de 1-3 enlaces o archivos que mostrarias |
| Projects | 2 proyectos con descripcion, tecnologias, evidencia y nota de alcance |

Tu LinkedIn debe decir claramente si los proyectos son academicos, simulados, capstones o practica
de portafolio. No los presentes como empleo si no lo fueron.

### Paso 3 — Demo de 10 minutos

Usa esta estructura, basada en un proyecto real que completaste:

| Minuto | Contenido |
|---|---|
| 0-1 | Problema |
| 1-2 | Arquitectura/modelo |
| 2-5 | Flujo principal |
| 5-7 | Seguridad, errores o ALM |
| 7-8 | Evidencia |
| 8-10 | Lecciones y mejoras |

### Paso 4 — STAR

Prepara respuestas para, usando situaciones reales de tus labs (no inventadas):

- Problema tecnico dificil.
- Requerimiento ambiguo.
- Defecto encontrado en UAT.
- Cambio de alcance.
- Aprendizaje rapido de una tecnologia.

### Paso 5 — Ingles tecnico

Prepara respuestas cortas en ingles. Cada respuesta debe tener 2-4 oraciones, no un discurso largo.
Usa esta estructura:

```text
Context: what the project or problem was.
Decision: what you chose and why.
Evidence: what artifact proves it.
Limit: what was simulated or not production-ready.
```

Responde en ingles:

- Explain your Power Platform project.
- What is Dataverse?
- How do you troubleshoot a failed flow?
- What is ALM?
- What would you improve in your project?

Luego agrega 3 preguntas segun tu perfil:

| Perfil | Preguntas obligatorias en ingles |
|---|---|
| Functional / CRM Functional | How do you gather requirements? / How do you explain case-to-resolution? / How do you validate UAT? |
| Developer / CRM Developer | When do you use a plugin instead of Power Automate? / How do you avoid plugin recursion? / How do you review code generated by AI? |
| Admin / Governance | What would you review first in PPAC? / How would you explain DLP to business? / When would you recommend Managed Environments? |
| Migration / Legacy | Why do complex migrations need staging? / How do you prove migration success? / What do you check in a legacy CRM assessment? |
| Solution Architect | How do you document an architecture decision? / How do you handle delivery pressure with technical risk? / How do you explain trade-offs to business? |

### Paso 5.1 — Vocabulario tecnico minimo

Construye una tabla con 15 terminos en ingles relacionados con tu perfil. Para cada termino,
incluye una frase propia:

| Termino | Definicion corta | Frase de entrevista |
|---|---|---|
| security role | Permissions assigned to users or teams | "I used security roles to enforce least privilege." |
| reconciliation | Validation after migration | "Reconciliation proves that the migrated data is technically and functionally usable." |

### Paso 5.2 — Mini-demo de 2 minutos en ingles

Explica tu proyecto principal en ingles usando este guion:

```text
This project is about [business problem].
I built/designed [solution] using [technologies].
The most important decision was [decision] because [reason].
I validated it with [evidence].
This was [lab/capstone/simulated project], so I would not present it as production experience.
The next improvement would be [realistic next step].
```

### Paso 6 — Simulacion

Graba o ejecuta una entrevista de 30 minutos:

- 5 minutos pitch y preguntas generales.
- 10 minutos demo.
- 10 minutos preguntas tecnicas, alternando espanol e ingles.
- 5 minutos preguntas del candidato.

### Paso 7 — Retrospectiva bilingue

Despues de la simulacion, escribe:

- 3 respuestas que salieron claras.
- 3 respuestas que fueron demasiado largas o vagas.
- 5 terminos tecnicos que te costaron en ingles.
- 1 respuesta que vas a reescribir usando la estructura Context/Decision/Evidence/Limit.
- 1 limite que explicaste honestamente sin sonar defensivo.

### Paso 8 — Revision CV/LinkedIn

Haz una revision final con esta tabla:

| Item | Si/No | Ajuste necesario |
|---|---|---|
| El CV apunta a un solo rol objetivo |  |  |
| El resumen menciona evidencia concreta |  |  |
| Cada proyecto tiene tecnologia + problema + evidencia |  |  |
| LinkedIn y CV cuentan la misma historia |  |  |
| Ningun lab aparece como empleo formal |  |  |
| Hay al menos un enlace o README listo para mostrar |  |  |
| La demo de 10 minutos usa uno de los proyectos del CV |  |  |

## Decisiones que debes tomar

- **¿Qué proyecto de tu portafolio eliges para la demo?** Elige el que puedas defender con más
  detalle técnico, no necesariamente el más impresionante visualmente.
- **¿Cómo respondes si el entrevistador pregunta algo que tu proyecto no cubre?** Decide de
  antemano tu estrategia: reconocer el límite y explicar cómo lo investigarías, en vez de improvisar
  una respuesta insegura.
- **¿Incluyes en el CV labs que empezaste pero no terminaste?** Define tu propio criterio de qué
  cuenta como evidencia presentable.
- **¿Tu LinkedIn debe sonar junior o "arquitecto"?** Elige honestidad y foco. Puedes usar "Solution
  Architect in training" si tu evidencia es de arquitectura simulada, pero no "Solution Architect"
  como cargo si no has ejercido ese rol.
- **¿Respondes en ingles aunque cometas errores gramaticales?** Decide priorizar claridad,
  estructura y precision tecnica sobre acento o perfeccion. Una respuesta simple y honesta supera
  una respuesta memorizada que se rompe con la primera repregunta.

## Criterios de validación

- [ ] La demo cabe en 10 minutos.
- [ ] El CV cabe en 1 pagina o 2 maximo y apunta a un rol.
- [ ] LinkedIn tiene headline, About, Featured y Projects coherentes con el CV.
- [ ] La mini-demo en ingles cabe en 2 minutos.
- [ ] Las respuestas no exageran experiencia laboral.
- [ ] Hay evidencia verificable de un proyecto real completado.
- [ ] El ingles usa terminos tecnicos correctos y frases cortas.
- [ ] Al menos 8 preguntas tecnicas fueron respondidas en ingles.
- [ ] La retrospectiva identifica mejoras concretas.
- [ ] Ningun entregable presenta practica academica como empleo formal.

## Rúbrica

| Criterio | Peso |
|---|---|
| Claridad | 30% |
| Evidencia | 25% |
| Precision tecnica | 25% |
| Ingles/comunicacion | 20% |

## Preguntas de entrevista asociadas

Este lab es en sí un banco de preguntas (Paso 5 y Paso 6); adicionalmente prepárate para la
pregunta meta más común de este tipo de entrevista: "Cuéntame sobre un momento en que tu solución
no funcionó como esperabas" — respuesta esperada: un caso real (no genérico) con causa raíz,
diagnóstico y qué cambiarías, no solo "lo arreglé".

## Solución de referencia

Después de completar tu intento, usa
[Soluciones de Referencia para Capstones](/recursos/soluciones-referencia-capstones#lab-079--technical-interview-simulation)
como comparador de calidad. El objetivo no es memorizar respuestas, sino verificar que tu evidencia,
tu alcance y tu comunicación sean defendibles.

### Preguntas de ingles tecnico que debes poder responder

- Tell me about your main Power Platform project.
- What was the hardest technical decision in that project?
- What would you improve if this project moved to production?
- How do you distinguish a portfolio project from real production experience?
- How do you troubleshoot a failed flow or automation?
- How do you explain Dataverse security to a non-technical stakeholder?
- How do you handle a question when you do not know the answer?

## Qué no debe sobreprometerse

Esta simulación entrena comunicación y defensa de portafolio; no garantiza el resultado de una
entrevista real, que depende también de la vacante específica, del entrevistador y de factores
fuera de tu control.

## Errores comunes

- Memorizar sin entender.
- Mostrar pantallas sin explicar decisiones.
- Decir "experiencia" cuando fue lab.
- No tener preguntas para el entrevistador.
- Responder en ingles con frases demasiado largas.
- Traducir literalmente terminos que normalmente se usan en ingles, como `solution`, `environment`,
  `security role`, `business process flow`, `run history` o `cutover`.
- Crear un CV "para todo" que no coincide con ninguna vacante concreta.
- Llenar LinkedIn de skills sin evidencia visible.
- Poner proyectos en Experience como si fueran trabajos reales cuando son labs/capstones.

## Reto adicional

Repetí la simulación completa (Pasos 3-6) para un rol objetivo distinto al que elegiste en el Paso 1
(ej. si preparaste Consultor Funcional, repetí para Maker o Developer). Comparás qué preguntas
cambian y cuáles del "vocabulario técnico mínimo" son transferibles entre roles.

---
id: SIM-002
title: "Ceremonia ágil simulada: Sprint Review con Product Owner y revisión de Pull Request"
practiceType: simulation
domain: alm-deployment-operations
roles: ["power-platform-developer", "maker", "functional-consultant"]
difficulty: practitioner
estimatedEffort: medium
prerequisites:
  modules: [19]
  labs: ["LAB-019", "LAB-063"]
environment:
  tenantRequired: optional
  codeRequired: false
  tools: ["Backlog", "User Story", "Pull Request", "Azure Boards"]
skills: ["sprint-review", "acceptance-criteria", "scope-renegotiation", "code-review", "feedback-response"]
evidence:
  required: ["user-story", "acceptance-criteria", "pull-request", "retrospective"]
  optional: ["backlog", "presentation"]
  format: "Documento con la entrega original, el feedback recibido, la re-negociación de alcance y la resolución de cada comentario de revisión."
  qualityCriteria: ["Responde al feedback con argumento, no solo acepta o rechaza sin justificar", "Distingue un comentario de estilo de uno que bloquea el merge", "Cierra cada comentario con una acción concreta, no con 'listo'"]
  sensitiveDataWarning: "Todos los nombres de stakeholders y el código de ejemplo deben ser ficticios."
  artifactTypes: ["simulated"]
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "No todo feedback es una orden"
    content: "Un Product Owner puede pedir algo que no es técnicamente razonable en el tiempo que queda del sprint; tu trabajo es negociar, no solo ejecutar."
  - id: hint-2
    level: tool
    title: "Separa bloqueante de sugerencia"
    content: "En una revisión de Pull Request real, no todos los comentarios tienen el mismo peso — distingue cuáles impiden el merge y cuáles son mejoras opcionales."
  - id: hint-3
    level: hypothesis
    title: "Justifica, no solo cambies"
    content: "Si decides no aplicar un comentario de revisión, tu respuesta debe explicar por qué, con el mismo nivel de seriedad que si lo aplicaras."
  - id: hint-4
    level: near-solution
    title: "Cierra con impacto, no con silencio"
    content: "El Product Owner y el reviewer necesitan saber qué cambió y qué no antes de que tú consideres esto resuelto — no basta con hacer el cambio sin comunicarlo."
rubric:
  - criterion: "Comprensión del feedback del Product Owner"
    weight: 20
  - criterion: "Re-negociación de alcance justificada"
    weight: 20
  - criterion: "Triage de comentarios de Pull Request (bloqueante vs. sugerencia)"
    weight: 20
  - criterion: "Calidad de las respuestas a cada comentario"
    weight: 20
  - criterion: "Comunicación de cierre y retrospectiva"
    weight: 20
---

## Contexto

Trabajas como developer/maker en el sistema de solicitudes internas de SIT (Servicios Integrados
Tecnológicos S.A.), el mismo proyecto de los labs de capstone de este curso. Acabas de entregar
una User Story al final del sprint. Esta simulación reproduce dos momentos que ningún lab técnico
de este curso ejercita todavía: el Sprint Review con el Product Owner, y el cierre de un Pull
Request con comentarios de un reviewer humano.

La simulación no equivale a experiencia laboral formal en un equipo real. Entrena la habilidad de
recibir feedback de otro rol, re-negociar alcance con criterio, y cerrar una revisión de código
con comunicación profesional — no solo construir.

## User Story entregada

```text
Como coordinador de mesa de servicio,
quiero que las solicitudes de alta prioridad se marquen visualmente en la vista de lista,
para poder priorizarlas sin abrir cada registro.

Criterios de aceptación:
- La vista de lista muestra un indicador visual (color o ícono) para solicitudes con
  Prioridad = Alta.
- El indicador es visible sin necesidad de scroll horizontal.
- La solución funciona en la vista estándar de Power Apps model-driven, sin plugin adicional.
```

Implementaste esto con una regla de formato condicional en la columna de Prioridad de la vista.

## Momento 1 — Sprint Review con el Product Owner

El Product Owner (simulado) revisa la entrega y responde:

> "Esto no cumple el criterio de aceptación. El indicador de color se ve bien en la vista de
> escritorio, pero el coordinador pasa la mitad del día en la app móvil de Power Apps, y ahí la
> columna de Prioridad no se ve en la lista compacta — solo título y fecha. Necesito que esto
> funcione también en móvil, y se nos acaba el sprint en 2 días."

Responde por escrito, con el mismo rigor que usarías en una reunión real:

1. ¿El criterio de aceptación original cubría explícitamente el caso móvil? Si no lo cubría,
   ¿de quién es la responsabilidad de que se descubriera tan tarde?
2. Propón al menos 2 alternativas técnicas realistas para los 2 días restantes (no asumas que
   "rehacer todo" es la única opción).
3. Redacta la frase exacta que le dirías al Product Owner para re-negociar alcance sin sonar
   defensivo ni mentir sobre el esfuerzo real que tomaría cada alternativa.

## Momento 2 — Revisión de Pull Request

Implementaste una de tus alternativas y abriste un Pull Request. Un reviewer (simulado) deja estos
3 comentarios:

**Comentario 1 (en la lógica de la regla de formato condicional):**
> "Esta condición compara `Prioridad == 'Alta'` como string literal. Si alguien traduce el valor
> de la opción (choice) a otro idioma más adelante, esto se rompe silenciosamente. ¿Por qué no
> comparas contra el valor numérico de la opción?"

**Comentario 2 (en el nombre de una variable):**
> "La variable se llama `x`. Esto es revisable pero no bloqueante — solo pido que lo cambies antes
> del merge si no te cuesta mucho tiempo."

**Comentario 3 (en el alcance):**
> "No veo ningún caso de prueba para cuando el campo Prioridad está vacío (null). ¿Qué pasa en ese
> caso? Esto sí es bloqueante — un registro sin prioridad asignada no debería romper la vista."

Para cada uno de los 3 comentarios, responde por escrito:

- ¿Es bloqueante o sugerencia? Justifica con el criterio que usarías en un proyecto real (no solo
  "porque el comentario lo dice").
- ¿Qué cambio concreto harías (o por qué decides no hacerlo, si fuera razonable no hacerlo)?
- ¿Cómo le responderías al reviewer en el propio Pull Request, en una o dos frases?

## Criterios de aceptación

- La respuesta al Product Owner re-negocia alcance con una alternativa concreta, no solo acepta
  o rechaza la observación.
- Los 3 comentarios de Pull Request quedan clasificados como bloqueante o sugerencia con
  justificación explícita, no solo una etiqueta sin razón.
- Cada comentario se cierra con una acción concreta y una respuesta escrita al reviewer, no con
  "corregido" sin explicación.
- La reflexión final distingue qué se habría evitado con un criterio de aceptación más completo
  desde el inicio.

## Solución de referencia

**Sprint Review:** el criterio de aceptación original no mencionaba explícitamente "funciona en
la app móvil" — es una omisión real y frecuente en historias de usuario mal especificadas, no un
error del developer por no "adivinarlo". La respuesta profesional no es defenderse ni ceder sin
condiciones: es proponer alternativas acotadas a 2 días (por ejemplo, un indicador basado en un
campo calculado visible incluso en la lista compacta móvil, o aceptar explícitamente entregar la
versión de escritorio ahora y la de móvil en el siguiente sprint con el Product Owner informado
del trade-off) y dejar la decisión final, informada, en manos del Product Owner — no decidir
unilateralmente ni ejecutar sin confirmar.

**Pull Request:**
- Comentario 1 es **bloqueante**: comparar contra un string literal de una opción (choice) es un
  antipatrón real que rompe con localización o renombrado futuro de la opción; corresponde
  comparar contra el valor numérico subyacente.
- Comentario 2 es **sugerencia**: el propio reviewer lo marca como no bloqueante; aplicarlo mejora
  legibilidad sin costo real, pero no amerita bloquear el merge si el tiempo apremiara.
- Comentario 3 es **bloqueante**: un caso no cubierto (null) que puede romper la vista en
  producción es, por definición, un hueco de prueba real, no una mejora opcional.

Comunicación de cierre: un developer profesional no solo corrige — responde a cada comentario en
el propio Pull Request confirmando qué cambió, y si decide no aplicar algo, lo dice con el mismo
nivel de detalle que si lo hubiera aplicado.

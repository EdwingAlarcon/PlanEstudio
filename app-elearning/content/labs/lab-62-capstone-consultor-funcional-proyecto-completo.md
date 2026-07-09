---
id: lab-62
title: "Capstone Consultor Funcional — Proyecto Funcional Completo"
level: "N2"
duration: 720
product: ["Power Platform", "Dynamics 365"]
certifications: ["PL-200"]
role: ["Functional Consultant"]
prerequisites:
  - "Lab 04 completado: Model-Driven App"
  - "Lab 09 completado: Dataverse Avanzado"
  - "Recurso revisado: Rúbricas y Plantillas de Evaluación"
---

# Lab 62 — Capstone Consultor Funcional: Proyecto Funcional Completo

## Objetivo

Simular el ciclo funcional completo de un proyecto de consultoría: discovery con requerimientos
ambiguos, documentación funcional, Fit-Gap, UAT y capacitación — sin escribir una sola línea de
código. Este es el proyecto que cierra la ruta Consultor Funcional antes de especializarte en
Dynamics 365 CE, Finance & Operations o Solution Architect.

## Escenario de negocio

**Empresa ficticia:** Distribuidora Andina de Insumos Médicos (DAIM), 180 empleados, 4 sedes
regionales.

El área comercial de DAIM gestiona descuentos especiales para clientes hospitalarios de forma
manual, con aprobaciones por correo y sin registro centralizado. El gerente comercial pide "una
solución que ordene las aprobaciones de descuentos" — sin más detalle. Durante el discovery
descubres que hay al menos 3 tipos de descuento con reglas de aprobación distintas, y que el
área de Finanzas también necesita visibilidad del impacto de esos descuentos en el margen.

El caso es deliberadamente incompleto: parte de tu trabajo es identificar qué falta preguntar
antes de diseñar la solución.

## Restricciones del proyecto

Un proyecto de consultoría real casi nunca tiene condiciones ideales. Diseña tu solución
considerando estas restricciones — indica explícitamente en tus entregables cómo cada una afecta
tu diseño, no las ignores:

- **Presupuesto limitado:** DAIM aprobó licencias Power Apps por usuario, no premium para todos
  los vendedores. Tu diseño debe funcionar dentro de ese límite de licenciamiento.
- **Baja adopción tecnológica:** el equipo comercial de las sedes regionales usa hoy solo correo
  y Excel; varios vendedores tienen más de 15 años en la empresa y son reacios al cambio.
- **Múltiples áreas de negocio con intereses distintos:** Comercial quiere aprobar rápido,
  Finanzas quiere visibilidad y control, y Legal exige que los descuentos queden auditables.
- **Cambio de alcance a mitad de proyecto:** ver el ejercicio de manejo de objeciones más abajo.

## Alcance del proyecto

Producir los entregables funcionales de un proyecto real, sin necesidad de configurar el
ambiente completo (puedes referenciar configuraciones de labs anteriores como evidencia técnica
de respaldo si tienes acceso a un ambiente).

Incluye:

- Discovery documentado con preguntas y respuestas (puedes responder tú mismo simulando al
  cliente, pero las preguntas deben ser las que realmente harías).
- Procesos AS-IS y TO-BE.
- Backlog de historias de usuario con criterios de aceptación.
- Matriz Fit-Gap contra Dataverse/Dynamics 365 estándar.
- Matriz de trazabilidad requerimiento → prueba.
- Plan y casos UAT.
- Manual de usuario.
- Presentación funcional resumen.

Fuera de alcance:

- Desarrollo de plugins, PCF o integraciones técnicas.
- Configuración completa en un ambiente productivo (opcional, no obligatorio).

## Prerrequisitos

- Haber completado los labs 04 y 09.
- Conocer el vocabulario de Fit-Gap, historias de usuario y UAT (módulos 15-17).

## Herramientas necesarias

- Markdown, Word o Excel para documentar.
- Recurso `/recursos/rubricas-plantillas` (rúbrica Consultoría Funcional, plantillas de
  trazabilidad y caso UAT).

## Entregables

### 1. Acta de discovery

Documenta al menos 8 preguntas de discovery reales (no genéricas) y sus respuestas. Ejemplos de
lo que debe surgir: ¿cuántos tipos de descuento existen y qué límites de autorización tiene cada
uno?, ¿quién aprueba descuentos que exceden el límite del vendedor?, ¿Finanzas necesita ver el
impacto antes o después de la aprobación?, ¿hay clientes con condiciones contractuales previas
que no deben tocarse?

### 2. Proceso AS-IS y TO-BE

- AS-IS: diagrama o lista numerada del proceso actual, con los puntos de fricción marcados
  (dónde se pierde tiempo, dónde falta trazabilidad).
- TO-BE: proceso propuesto que elimina al menos 2 de esas fricciones.

### 3. Backlog de historias de usuario

- Mínimo 8 historias en formato "Como [rol], quiero [acción], para [beneficio]".
- Cada historia con criterios de aceptación verificables (Given/When/Then o equivalente), no
  frases como "funciona correctamente".

### 4. Matriz Fit-Gap

- 100% de los requerimientos clasificados: Fit (estándar), Fit parcial (configuración), Gap
  (requiere desarrollo o fuera de alcance).
- Cada Gap con una propuesta (configurar distinto, aceptar la brecha, o escalar a Developer).

### 5. Matriz de trazabilidad

- Usa la plantilla copiable de `/recursos/rubricas-plantillas`.
- Cada requerimiento crítico enlaza a al menos un caso UAT y una evidencia esperada.

### 6. Plan y casos UAT

- Mínimo 8 casos UAT: al menos 1 happy path por tipo de descuento, 1 caso de excepción (monto
  fuera de límite), 1 caso de permisos (vendedor intenta autoaprobar) y 1 caso de datos
  incompletos.

### 7. Manual de usuario

- 2-3 páginas, orientado al vendedor y al aprobador, sin jerga técnica.

### 8. Presentación funcional

- 6-8 láminas para presentar la solución al comité de negocio: problema, proceso propuesto,
  alcance, riesgos, próximos pasos.

## Resultado esperado

Un paquete de documentos que un equipo de implementación podría tomar y ejecutar sin tener que
volver a hacer el discovery, y que un comité de negocio no técnico entendería en una sola
presentación.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Discovery | 15% | Preguntas identifican ambigüedades reales, no solo confirman lo ya dicho |
| Historias de usuario | 15% | ≥8 historias con criterios de aceptación verificables |
| Fit-Gap | 15% | 100% de requerimientos clasificados, brechas con propuesta, considerando las restricciones del proyecto |
| Trazabilidad | 10% | Cada requerimiento crítico conectado a UAT y evidencia |
| UAT | 15% | Cubre happy path, excepción, permisos y datos incompletos |
| Documentación funcional | 10% | Comprensible para un no-técnico sin preguntas de seguimiento básicas |
| Presentación | 10% | Defendible ante preguntas del propio material (comité simulado) |
| Manejo de objeciones y cambio de alcance | 10% | Cada respuesta propone una alternativa concreta y reconoce el costo de la decisión |

Aprobación: mínimo 70/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥90/100.

## Evidencia esperada

- Acta de discovery.
- Diagramas o listas AS-IS/TO-BE.
- Backlog de historias de usuario.
- Matriz Fit-Gap.
- Matriz de trazabilidad.
- 8 casos UAT con resultado.
- Manual de usuario.
- Presentación de 6-8 láminas.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Historias sin criterio de aceptación verificable | Se documenta la funcionalidad, no el resultado esperado | Reescribir cada criterio como algo que se pueda marcar pass/fail sin ambigüedad |
| UAT ejecutado por quien diseñó la solución | Sesgo de confirmación — se prueba lo que ya se sabe que funciona | Definir los casos UAT antes de configurar, y hacer que otra persona (o tú "en modo usuario") los ejecute |
| Fit-Gap superficial ("todo es Gap" o "todo es Fit") | No se revisan las capacidades estándar de Dataverse/D365 antes de clasificar | Revisar el módulo de fit-gap y las entidades estándar antes de completar la matriz |
| Presentación con jerga técnica | El consultor está más cómodo hablando de configuración que de negocio | Practicar la presentación con alguien no técnico; si no entiende, reescribir |

## Ejercicio: manejo de objeciones y cambio de alcance

Un consultor funcional real pasa tanto tiempo negociando el alcance como documentándolo. Responde
por escrito a cada una de estas 3 situaciones — en 3-5 líneas cada una, como si fuera un correo o
mensaje real al stakeholder, no una nota técnica interna:

1. **Cambio de alcance:** después de cerrar el Fit-Gap, el gerente comercial pide agregar un
   cuarto tipo de descuento con reglas distintas. ¿Cómo respondes? Debe quedar claro el impacto en
   tiempo, si requiere un nuevo ciclo de UAT, y qué pasa con lo ya aprobado.
2. **Objeción de adopción:** un vendedor senior dice "esto es más lento que mandar un correo, no
   lo voy a usar". ¿Qué le respondes sin minimizar su objeción ni ceder el diseño solo por
   presión?
3. **Conflicto entre áreas:** Finanzas exige que ningún descuento se apruebe sin su revisión
   previa, pero Comercial dice que eso duplicaría el tiempo de respuesta al cliente. ¿Cómo
   planteas una alternativa que no sea simplemente "decida el gerente"?

**Criterio de aprobación del ejercicio:** cada respuesta debe proponer una alternativa concreta
(no solo "lo escalo" o "lo evaluamos"), y debe reconocer explícitamente el costo de la decisión
(tiempo, riesgo o alcance) en vez de prometer que "no hay problema".

## Reto adicional

Documenta cómo cambiaría tu recomendación si el presupuesto se redujera a la mitad después de
completar el Fit-Gap: ¿qué requerimientos degradarías primero y por qué?

## Módulos relacionados

- Módulo 15 — Copilot Studio: Introducción (contexto de automatización conversacional)
- Módulo 16 — Seguridad y Administración de Soluciones
- Módulo 17 — Proyecto Integrador Nivel 2
- Lab 04, Lab 09
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Discovery y detección de ambigüedades en requerimientos.
- Redacción de historias de usuario con criterios de aceptación verificables.
- Análisis Fit-Gap contra capacidades estándar.
- Trazabilidad de requerimientos a evidencia.
- Preparación y ejecución de UAT.
- Comunicación funcional para stakeholders no técnicos.

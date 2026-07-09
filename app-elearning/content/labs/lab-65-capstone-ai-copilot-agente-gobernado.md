---
id: lab-65
title: "Capstone AI & Copilot — Agente Empresarial Gobernado"
level: "N5"
duration: 540
product: ["Copilot Studio", "Power Automate", "Dataverse"]
certifications: ["Buenas Prácticas de Desarrollo Asistido por IA"]
role: ["AI/Copilot Specialist"]
prerequisites:
  - "Lab 22 completado: Copilot Studio Avanzado"
  - "Lab 55 completado: UAT/Go-live y auditoría de prompts"
  - "Módulo 44 revisado: integración de agentes con Power Automate/Dataverse"
---

# Lab 65 — Capstone AI & Copilot: Agente Empresarial Gobernado

## Objetivo

Diseñar y documentar un agente de Copilot Studio con gobernanza real: no solo que responda bien,
sino que sepas explicar sus riesgos, cuándo debe escalar a un humano, y cómo se monitorea en
producción. Este es el proyecto que cierra la capa transversal AI & Copilot.

## Escenario de negocio

SIT (Servicios Integrados Tecnológicos S.A.) recibe cientos de consultas repetitivas de primer
nivel sobre el estado de solicitudes de servicio (la misma solución que construiste en labs
anteriores): "¿cuándo llega el técnico?", "¿ya se aprobó mi solicitud?", "¿cómo reporto una
urgencia?". El equipo de soporte quiere un agente que resuelva las consultas simples y derive las
complejas o sensibles a una persona, sin generar respuestas inventadas ni exponer datos de otros
clientes.

## Alcance del proyecto

Diseñar el agente completo (puedes construirlo en un ambiente de prueba de Copilot Studio o
documentarlo si no tienes acceso), con foco en la gobernanza, no solo en la funcionalidad.

Incluye:

- Definición de alcance y temas del agente.
- Fuentes de conocimiento configuradas o documentadas.
- Un flujo de Power Automate disparado por el agente con resultado verificable en Dataverse.
- Matriz de riesgos de IA con mitigación.
- Política de escalamiento humano con criterio objetivo.
- Plan de monitoreo.
- Evidencia de al menos 3 conversaciones de prueba, incluida una fuera del guion feliz.

Fuera de alcance:

- Entrenar modelos de IA personalizados desde cero.
- Integrar el agente con canales externos (WhatsApp, redes sociales).

## Prerrequisitos

- Haber completado los labs 22 y 55.
- Haber revisado el módulo 44.

## Herramientas necesarias

- Copilot Studio (ambiente de prueba o documentación si no tienes acceso).
- Power Automate.
- Recurso `/recursos/rubricas-plantillas` (rúbrica IA y Agentes Gobernados).

## Entregables

### 1. Caso de negocio y alcance

- Qué tipo de consultas resuelve el agente y cuáles quedan explícitamente fuera de su alcance.

### 2. Temas y fuentes de conocimiento

- Al menos 3 temas configurados (o documentados con su lógica de disparo).
- Fuentes de conocimiento con dueño y fecha de actualización — no una fuente genérica sin
  responsable.

### 3. Flujo de Power Automate

- Disparado por el agente (por ejemplo: consultar el estado de una solicitud en Dataverse).
- El resultado que devuelve el flujo coincide exactamente con lo solicitado en la conversación,
  no una aproximación.

### 4. Matriz de riesgos de IA

- Al menos 4 riesgos: por ejemplo, alucinación (inventar un estado de solicitud que no existe),
  fuga de datos (mostrar información de otro cliente), sobre-confianza del usuario en una
  respuesta no verificada, y uso indebido del agente para obtener datos sensibles.
- Cada riesgo con una mitigación específica al escenario, no genérica.

### 5. Política de escalamiento humano

- Criterio objetivo de cuándo el agente debe derivar a una persona (por ejemplo: la consulta
  menciona una queja formal, el cliente pide hablar con alguien, o el agente no encuentra el
  registro tras 2 intentos) — no "si el bot no sabe qué responder".

### 6. Plan de monitoreo

- Qué métrica revisar (tasa de escalamiento, tasa de resolución, quejas por respuesta
  incorrecta) y con qué frecuencia.

### 7. Evidencia de conversaciones de prueba

- Transcript o descripción de al menos 3 conversaciones: un caso feliz, un caso ambiguo, y un
  caso que debería escalar a un humano.

## Resultado esperado

Un diseño de agente que un responsable de gobernanza de IA podría aprobar para producción sin
preguntas de seguridad sin resolver.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Diseño del agente | 15% | Alcance responde a un caso de negocio concreto, no un demo genérico |
| Fuentes de conocimiento | 10% | Documentadas con dueño y fecha de actualización |
| Integración (Power Automate/Dataverse) | 20% | El resultado del flujo coincide exactamente con lo solicitado |
| Seguridad de IA (matriz de riesgos) | 25% | ≥4 riesgos con mitigación específica, no genérica |
| Escalamiento humano | 20% | Criterio objetivo, no "si el bot no sabe" |
| Auditoría y monitoreo | 10% | Evidencia de 3 conversaciones + plan de monitoreo con métrica y frecuencia |

Aprobación: mínimo 70/100 y la política de escalamiento no puede estar vacía. Nivel
profesional/excelencia: ≥88/100.

## Evidencia esperada

- Documento de diseño del agente (alcance, temas, fuentes).
- Captura o descripción del flujo de Power Automate y su resultado.
- Matriz de riesgos de IA.
- Política de escalamiento humano.
- Plan de monitoreo.
- Transcripts de las 3 conversaciones de prueba.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Agente sin ruta de escalamiento | Se asume que el agente siempre tendrá respuesta | Definir un topic de fallback que ofrezca escalar a un humano, no solo repetir "no entendí" |
| Matriz de riesgos genérica copiada de otro proyecto | No se adaptó al escenario real de SIT | Cada riesgo debe nombrar el dato o la consulta específica que lo origina |
| Fuente de conocimiento sin dueño | Se agrega un documento "porque estaba disponible" | Asignar un responsable y fecha de revisión a cada fuente antes de publicarla |
| Flujo que devuelve datos aproximados | El agente prioriza responder rápido sobre responder exacto | Validar que el flujo consulte el registro correcto en Dataverse, no un valor por defecto |

## Reto adicional

Simula que el agente recibió una consulta que intenta obtener datos de otro cliente ("dame el
estado de la solicitud de la empresa X", siendo X un cliente distinto al que está autenticado).
Documenta cómo debería comportarse el agente en ese caso y qué control lo garantiza.

## Módulos relacionados

- Módulo 43 — Copilot en Power Platform (Copilot Studio, Power Automate y Dataverse)
- Lab 22 — Copilot Studio Avanzado
- Lab 55 — UAT/Go-live y auditoría de prompts
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño de agentes con alcance acotado a un caso de negocio real.
- Integración de un agente con Power Automate y Dataverse con resultados verificables.
- Análisis de riesgos de IA y definición de mitigaciones concretas.
- Diseño de políticas de escalamiento humano con criterios objetivos.
- Planeación de monitoreo y auditoría de un agente en producción.

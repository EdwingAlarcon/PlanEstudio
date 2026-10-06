---
id: lab-63
title: "Capstone Developer — Solución Técnica Avanzada"
level: "N3"
duration: 900
product: ["Dataverse", "Power Platform CLI", "Azure DevOps"]
certifications: ["PL-400"]
role: ["Developer"]
prerequisites:
  - "Lab 19 completado: ALM/CI-CD Azure DevOps"
  - "Lab 23 completado: Plugin C# + Unit Tests"
  - "Lab 52 completado: CLI y conexión al tenant"
  - "Lab 53 completado: Exportar y revisar solución con IA"
lastVerified: "2026-09"
---

# Lab 63 — Capstone Developer: Solución Técnica Avanzada

## Objetivo

Integrar en un solo entregable lo que hasta ahora practicaste por separado: extensibilidad de
código, un componente de interfaz, una integración externa y un pipeline de ALM. Este es el
proyecto que cierra la ruta Developer antes de avanzar a Solution Architect.

## Escenario de negocio

Retomas el sistema de solicitudes internas de SIT (Servicios Integrados Tecnológicos S.A.) que
ya existe como solución de Power Platform (construido en labs anteriores o en el Capstone Maker).
El área de TI pide extenderlo con lógica de negocio que Power Fx y Power Automate no resuelven
bien solos: numeración automática con reglas específicas, validación server-side que no se puede
saltar desde ninguna app, y visibilidad de un sistema externo de inventario de repuestos.

## Alcance del proyecto

Construir la extensión técnica de una solución existente (real o simulada), no la solución
completa desde cero.

Incluye:

- Modelo Dataverse extendido con al menos una relación jerárquica o un campo calculado/rollup.
- Un Plugin o Custom API en C# con unit tests.
- Un PCF Control o un web resource JavaScript con manejo de errores.
- Un Custom Connector documentado (hacia una API real o simulada con un mock).
- Solución exportada (managed o unmanaged según ambiente) con variables de entorno y connection
  references, no valores hardcodeados.
- Un pipeline de CI/CD con al menos 2 ambientes.
- Plan de despliegue y de rollback.
- Documento técnico.

Fuera de alcance:

- Rediseñar el modelo de datos completo desde cero.
- Integraciones con más de un sistema externo.

## Prerrequisitos

- Haber completado los labs 19, 23, 52 y 53.
- Tener acceso a Power Platform CLI y a un pipeline de Azure DevOps o GitHub Actions (puede ser
  personal/gratuito).

## Herramientas necesarias

- Visual Studio o VS Code, .NET SDK.
- Power Platform CLI (`pac`).
- Azure DevOps o GitHub Actions.
- Recurso `/recursos/rubricas-plantillas` (rúbrica Desarrollo Técnico).

## Entregables

### 1. Modelo Dataverse extendido

- Al menos una columna calculada o rollup, o una relación jerárquica, que resuelva un requisito
  real de negocio (por ejemplo: costo total acumulado de una solicitud con sub-tareas).

### 2. Plugin o Custom API en C#

- Registrado en el paso correcto del pipeline de eventos (Pre-operation para validar/enriquecer,
  Post-operation para efectos posteriores).
- Al menos 1 unit test de caso feliz y 1 de caso de error, en verde, usando un framework de
  mocking (Moq u otro).
- Sin recursión sin control (verifica `context.Depth`).

### 3. PCF Control o web resource

- Maneja al menos un estado de error de forma visible para el usuario (no falla en silencio).
- Sin variables globales colgando de `window` si es un web resource.

### 4. Custom Connector

- Documentado con su definición (OpenAPI/swagger) o una tabla clara de endpoints y parámetros.
- Autentica y responde con datos reales o simulados de prueba, no solo en teoría.

### 5. Solución exportada

- Con Connection References y Environment Variables — ningún valor de conexión hardcodeado.
- Exportada como managed para el ambiente de destino y unmanaged para desarrollo.

### 6. Pipeline CI/CD

- Al menos 2 ambientes (por ejemplo Dev → Test).
- Corre sin intervención manual una vez disparado.
- Incluye un paso de validación (Solution Checker o equivalente).

### 7. Plan de despliegue y rollback

- Orden de despliegue de componentes.
- Qué hacer si el despliegue falla a mitad de camino (cómo revertir sin dejar el ambiente
  inconsistente).

### 8. Documento técnico

- Explica las decisiones no obvias: por qué el plugin es síncrono o asíncrono, por qué esa
  integración y no otra, qué se dejó fuera de alcance y por qué.
- Agrega al final un **"Technical summary" de 3-5 líneas en inglés** (no una traducción del
  documento completo): qué construiste, la decisión técnica más importante y por qué, y qué
  quedó fuera de alcance. Es la pieza que copiarías directo a un README en inglés o a LinkedIn
  Projects — practica el mismo registro que exige LAB-79 (JR-009), pero distribuido aquí en vez
  de concentrado solo al final de la ruta.

## Resultado esperado

Un repositorio o paquete de solución que otro developer podría tomar, entender las decisiones
técnicas sin preguntarte, y desplegar siguiendo el plan documentado.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Calidad técnica del código | 20% | Sin lógica duplicada, sin recursión sin control en plugins |
| Pruebas | 15% | ≥1 unit test de caso feliz y 1 de caso de error, en verde |
| Seguridad | 15% | Sin secretos hardcodeados, usa Connection References y Environment Variables |
| Componente de interfaz (PCF/web resource) | 15% | Maneja al menos un estado de error de forma visible |
| Integración (Custom Connector) | 10% | Autentica y responde con datos reales de prueba |
| ALM / pipeline | 15% | Corre sin intervención manual, incluye validación previa al despliegue |
| Documentación técnica | 10% | Explica decisiones no obvias, no solo qué se hizo |

Aprobación: mínimo 70/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥90/100.

## Evidencia esperada

- Repositorio con el código del plugin/PCF/connector.
- Resultado de la ejecución de los unit tests.
- Solución exportada (.zip) o captura del pipeline ejecutado.
- Documento técnico.
- Plan de despliegue y rollback.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Secretos o API keys hardcodeados | Prisa por que "funcione ya" en desarrollo | Migrar a Connection References/Environment Variables antes de exportar la solución |
| Plugin síncrono cuando debería ser asíncrono | No se evaluó el impacto en la experiencia del usuario | Registrar en modo asíncrono cuando la operación no bloquea al usuario que la dispara |
| Pipeline que requiere pasos manuales | Automatización parcial "por ahora" | Documentar y automatizar el paso manual antes de considerar el pipeline terminado |
| Custom Connector sin manejo de error de autenticación | Solo se probó el caso feliz | Simular una credencial inválida y verificar el mensaje de error que recibe el usuario |

## Reto adicional

Agrega un gate de aprobación manual antes del paso a producción en el pipeline, y documenta quién
debería aprobarlo y qué debería revisar antes de aprobar.

## Extensión — Incidente post-launch y presentación en vivo

Las etapas anteriores terminan en el despliegue. En un proyecto real, el ciclo no termina ahí: la
solución entra en uso, algo falla, y alguien tiene que explicar el proyecto completo a quien no
estuvo involucrado en construirlo. Esta extensión cierra ese tramo.

### Incidente post-launch

Una semana después del despliegue (simulado), Operaciones reporta: "desde ayer, algunas
solicitudes de alto costo no están llegando a aprobación — el solicitante ve que se envió, pero
el aprobador nunca la ve en su bandeja." Diagnostica con el mismo criterio que usarías en
producción real:

1. Formula al menos 3 hipótesis distintas antes de revisar nada (ejemplos: falla en el Plugin que
   registra el flujo de aprobación, un cambio reciente en el rol de seguridad del aprobador, un
   filtro de la vista que excluye silenciosamente los registros de alto costo).
2. Para cada hipótesis, indica qué evidencia (Plugin Trace Log, run history, matriz de seguridad,
   definición de la vista) la confirmaría o la descartaría.
3. Determina la causa raíz más probable con el razonamiento escrito, no solo la conclusión.
4. Propón una corrección y, por separado, una medida de prevención para que este tipo de fallo se
   detecte antes de que Operaciones tenga que reportarlo.

### Presentación en vivo al cliente

Prepara y entrega (grabada, o en vivo ante alguien que no haya visto el proyecto) una presentación
de 5-8 minutos dirigida al sponsor de negocio de SIT, NO a otro developer:

- Qué problema resolvió el proyecto, en lenguaje de negocio (sin términos técnicos como "plugin"
  o "PCF" sin traducirlos a impacto).
- Qué se construyó y por qué se tomaron las decisiones principales (1-2 trade-offs reales).
- Qué pasó con el incidente post-launch: qué se rompió, cómo se diagnosticó, qué se corrigió y qué
  cambió para que no vuelva a pasar igual — sin ocultar que hubo un incidente.
- Qué queda fuera de alcance y qué recomendarías como siguiente paso.

**Validación esperada:** alguien que no conozca el proyecto técnico puede explicar, después de
tu presentación, qué problema se resolvió y qué pasó con el incidente — sin que tú tengas que
aclarar nada después.

## Módulos relacionados

- Módulo 19 — ALM y Estrategias de DevOps (contexto)
- Módulo 21 — JavaScript y Extensibilidad Cliente
- Módulo 23 — C#: Plugins para Dataverse
- Módulo 26/27 — PCF Avanzado / Observabilidad
- Lab 19, Lab 23, Lab 52, Lab 53
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Extensión de Dataverse con lógica de negocio compleja.
- Desarrollo de plugins/Custom APIs con pruebas automatizadas.
- Construcción de componentes de interfaz con manejo de errores.
- Integración con sistemas externos vía Custom Connectors.
- Diseño de un pipeline de ALM con validación y plan de rollback.

## Convierte esto en evidencia laboral

Este es tu proyecto técnico más defendible hasta ahora — prepáralo para una entrevista de desarrollo.

- Arma una presentación técnica: arquitectura, decisiones no obvias, tradeoffs y qué harías
  distinto — ver la [guía Job-Ready CRM Developer](/recursos/job-ready-crm-developer).
- Documenta el repositorio (README, decisiones, resultado de tests) con la
  [Guía de Portafolio](/recursos/portafolio-profesional).
- Practica cómo explicar troubleshooting y decisiones de arquitectura en entrevista con la
  [guía Job-Ready de entrevistas y portafolio](/recursos/job-ready-interview-readiness).

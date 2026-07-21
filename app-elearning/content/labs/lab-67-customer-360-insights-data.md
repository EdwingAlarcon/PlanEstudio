---
id: lab-67
title: "Customer Insights - Data: Unificación de Perfiles y Customer 360"
level: "N6"
duration: 150
product: ["Customer Insights", "Dataverse"]
certifications: ["Customer Insights"]
role: ["Functional Consultant", "Solution Architect", "Data Specialist"]
prerequisites:
  - "Módulo 57 estudiado: Customer Insights - Data"
  - "Lab 58 completado: Customer Insights — Segmento y Journey"
---

# Lab 67 — Customer Insights - Data: Unificación de Perfiles y Customer 360

## Objetivo

Diseñar (de forma conceptual/simulada, sin requerir un tenant real de Customer Insights) la
unificación de un perfil de cliente desde 3 fuentes distintas, con reglas de matching explícitas,
medidas calculadas y un plan de activación — cerrando la brecha entre "conozco el concepto" y
"puedo diseñarlo con datos reales" que dejaba el resto del contenido de Customer Insights, enfocado
solo en Journeys.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT).

SIT tiene tres sistemas con información del mismo cliente que nunca se han combinado: Dataverse
(Sales/Customer Service), un sistema de facturación legado que exporta un CSV mensual, y una hoja
de cálculo de soporte técnico de nivel 1 que el equipo de operaciones mantiene aparte porque
"todavía no lo migraron a Customer Service". La dirección quiere una vista Customer 360 antes de
decidir si invierte en migrar la hoja de soporte a Customer Service o no.

## Restricciones del proyecto

- **Calidad de datos real:** el CSV de facturación no siempre tiene el email del cliente
  completo; algunos registros solo tienen teléfono y nombre de empresa.
- **Gobierno:** la hoja de soporte técnico contiene comentarios internos de agentes que no deben
  activarse hacia ningún canal de comunicación con el cliente — solo sirven para calcular una
  medida interna de riesgo.
- **Sin tenant real:** este proyecto es conceptual/simulado — no requiere acceso a Customer
  Insights, se documenta con tablas y reglas verificables sobre los datos de prueba.

## Alcance del proyecto

Diseñar la unificación y activación, no configurarla en un producto real.
Este lab es el **diseño base de Customer 360**: fuentes, matching, medidas y un segmento activable
con datos pequeños. El Lab 85 retoma el mismo dominio, pero exige gobierno ampliado, frecuencia de
actualización, reglas exactas/difusas y criterios de ejecución en tenant. No dupliques el Lab 85
aquí; entrega una especificación mínima pero trazable que sirva como insumo.

Incluye:

- Matriz de fuentes con su esquema mínimo.
- Reglas de matching explícitas, aplicadas a mano sobre los datos de prueba.
- Al menos 2 medidas calculadas con fórmula documentada.
- Un segmento sobre el perfil unificado con su destino de activación.
- Matriz de riesgos de datos (calidad, duplicidad, gobierno).

Fuera de alcance:

- Configuración real en Customer Insights - Data.
- El journey en sí (eso es el Lab 58 — este lab entrega el segmento que Journeys consumiría).
- Catálogo ampliado de gobierno, retención, base legal y readiness de tenant. Eso se evalúa en el
  Lab 85.

## Prerrequisitos

- Haber estudiado el Módulo 57 y completado el Lab 58.

## Herramientas necesarias

- Markdown, Excel o una herramienta de diagramación.
- Recurso `/recursos/rubricas-plantillas`.

## Datos de prueba

**Fuente 1 — Dataverse (Contact):**

| Contact ID | Nombre | Email | Teléfono |
|---|---|---|---|
| C-001 | Ana Rivera | ana.rivera@contoso.com | 555-0142 |
| C-002 | Luis Mendoza | luis.mendoza@fabrikam.com | 555-0198 |
| C-003 | Carla Ibáñez | (vacío) | 555-0177 |

**Fuente 2 — CSV de facturación (sin ID compartido con Dataverse):**

| Nombre facturación | Empresa | Teléfono | Total facturado 24m |
|---|---|---|---:|
| A. Rivera | Contoso Andina | 555-0142 | $42,000 |
| L. Mendoza | Fabrikam Norte | 555-0198 | $18,500 |
| C. Ibañez | Litware Sur | 555-0177 | $9,000 |

**Fuente 3 — Hoja de soporte técnico N1 (interna, no se activa hacia el cliente):**

| Cliente | Tickets últimos 90 días | Comentario interno del agente |
|---|---:|---|
| Ana Rivera | 0 | "Cliente sin fricción" |
| Luis Mendoza | 4 | "Se queja de lentitud, revisar con éxito de cliente" |
| Carla Ibáñez | 1 | "Pendiente de respuesta" |

## Entregables

### 1. Matriz de fuentes

Tabla que documente, para cada una de las 3 fuentes: qué datos aporta, para qué se usa, y quién
es el dueño del dato (Ventas, Finanzas, Soporte).

### 2. Reglas de matching aplicadas a mano

- Regla: `(email exacto) O (teléfono exacto Y empresa/nombre normalizado coinciden)`.
- Aplica la regla a los 3 registros de cada fuente y documenta el resultado: ¿los 3 clientes
  quedan unificados correctamente? Presta atención a Carla Ibáñez, que no tiene email en
  Dataverse — la regla debe resolverla igual por teléfono + nombre.

### 3. Medidas calculadas

- **Medida 1 — Valor total del cliente:** `Total facturado 24m` (fuente 2). Documenta la fórmula
  y de qué fuente proviene.
- **Medida 2 — Riesgo de insatisfacción:** una fórmula propia que combine `Tickets últimos 90 días`
  (fuente 3) con algún dato de las otras fuentes (por ejemplo, ponderar más el riesgo si el cliente
  también tiene alto valor facturado).

### 4. Segmento y activación

- Diseña un segmento usando las medidas (ej. "Valor > $15,000 Y Riesgo de insatisfacción alto").
- Define el destino de activación (Customer Insights - Journeys, para escalamiento comercial
  proactivo antes de que el cliente se queje formalmente) y qué acción dispararía ahí.
- Con los datos de prueba, indica exactamente qué cliente(s) entrarían a ese segmento.

### 5. Matriz de riesgos de datos

- Al menos 4 riesgos: por ejemplo, duplicidad si la regla de matching falla, fuga del comentario
  interno del agente hacia un canal externo, dato de facturación incompleto, y desactualización si
  el CSV no se reingiere con la frecuencia adecuada.

## Resultado esperado

Un diseño de unificación de perfil que un especialista de Customer Insights - Data podría tomar y
configurar directamente en el producto real, sin tener que redefinir las reglas de matching o las
medidas desde cero.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Matriz de fuentes | 15% | Cada fuente documentada con dato, uso y dueño |
| Reglas de matching | 25% | Regla explícita que unifica correctamente los 3 clientes de los datos de prueba, incluyendo el caso sin email |
| Medidas calculadas | 20% | 2 medidas con fórmula documentada y fuentes identificadas |
| Segmento y activación | 20% | Segmento verificable con los datos de prueba + destino de activación concreto |
| Matriz de riesgos de datos | 20% | ≥4 riesgos específicos del escenario con mitigación, no genéricos |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥85/100.

## Evidencia esperada

- Matriz de fuentes.
- Aplicación manual de la regla de matching a los 3 registros de cada fuente.
- Las 2 medidas con su fórmula.
- El segmento con el/los cliente(s) que calificarían y el destino de activación.
- Matriz de riesgos de datos.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| No resolver el caso de Carla Ibáñez (sin email) | La regla de matching solo considera el email | Agregar la condición secundaria de teléfono + nombre/empresa normalizado |
| Activar el comentario interno del agente hacia el journey | No distinguir datos internos de datos activables al cliente | Usar el comentario solo para calcular la medida de riesgo, nunca como contenido de comunicación |
| Medida sin fuente identificada | Se calcula el número sin documentar de dónde sale cada componente | Cada medida debe listar explícitamente qué fuente aporta cada parte de la fórmula |
| Tratar la unificación como el entregable final | No definir a dónde se activa el segmento | Todo segmento debe declarar su destino de activación y la acción que dispara ahí |

## Reto adicional

El CSV de facturación llega una vez al mes, pero el sistema de soporte se actualiza a diario. Si
alguien pregunta "¿el segmento de riesgo está actualizado en tiempo real?", redacta en 3-4 líneas
la respuesta correcta sobre qué tan actualizada está cada medida según la frecuencia de ingesta de
su fuente.

## Módulos relacionados

- Módulo 57 — Customer Insights - Data: Unificación de Perfiles y Customer 360
- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Lab 58 — Customer Insights: Segmento y Journey de Renovación
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño de reglas de matching para unificación de perfiles multi-fuente.
- Definición de medidas calculadas con fórmula y trazabilidad de fuente.
- Diseño de segmentos sobre perfil unificado con destino de activación explícito.
- Identificación de riesgos de calidad de datos y gobierno en un proyecto de Customer 360.

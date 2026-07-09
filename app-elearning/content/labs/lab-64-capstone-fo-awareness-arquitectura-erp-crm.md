---
id: lab-64
title: "Capstone Finance & Operations Awareness — Arquitectura Conceptual ERP + CRM"
level: "N4"
duration: 300
product: ["Dynamics 365 Finance", "Dynamics 365 Supply Chain Management", "Dataverse"]
certifications: ["Arquitectura Power Platform"]
role: ["Solution Architect", "Functional Consultant"]
prerequisites:
  - "Módulo 18 revisado: fundamentos de arquitectura"
  - "Módulo 20 revisado: Dynamics 365 CE — Sales y Customer Service"
  - "Módulo 34 revisado: arquitectura de datos / integración"
---

# Lab 64 — Capstone Finance & Operations Awareness: Arquitectura Conceptual ERP + CRM

## Objetivo

Razonar sobre una arquitectura híbrida ERP + CRM sin necesidad de un tenant de Finance &
Operations real: cuándo aplica cada plataforma, cómo se sincronizan los datos, y qué riesgos trae
la integración. Este capstone es **conceptual**, no de implementación — refleja que la ruta
Finance & Operations Awareness está en cobertura en expansión, y su objetivo es que sepas tomar
decisiones informadas, no configurar F&O.

## Escenario de negocio

**Empresa ficticia:** Manufacturas del Pacífico S.A., fabricante mediano de empaques industriales
con 600 empleados. Usa Dynamics 365 Finance & Supply Chain Management para producción, inventario
y contabilidad, y quiere adoptar Dataverse/Dynamics 365 CE para gestionar la relación comercial
con sus distribuidores (oportunidades, cotizaciones, seguimiento postventa).

La dirección pregunta: "¿Necesitamos licenciar todo en F&O, o podemos usar Power Platform para la
parte comercial? ¿Cómo se mantienen sincronizados los clientes y los pedidos entre los dos
sistemas?"

## Alcance del proyecto

Producir un análisis y una recomendación arquitectónica, no una implementación. No requiere
acceso a un tenant de F&O.

Incluye:

- Identificación de qué procesos pertenecen a ERP (F&O) y cuáles a CRM (Dataverse/D365 CE).
- Mapa de integración con la dirección del dual-write (o de una integración custom si dual-write
  no aplica al escenario).
- Nota conceptual sobre Data Management Framework para una carga masiva de clientes existentes.
- Matriz de riesgos de la integración.
- Documento ejecutivo con recomendación.

Fuera de alcance:

- Configuración real en un tenant de F&O.
- Diseño detallado de flujos de aprobación financiera dentro de F&O.

## Prerrequisitos

- Haber revisado los módulos 18, 20 y 34.
- Entender la diferencia conceptual entre un ERP (procesos financieros, cadena de suministro) y un
  CRM (relación comercial, servicio al cliente).

## Herramientas necesarias

- Markdown, Word o una herramienta de diagramación (draw.io, Miro o similar) para el mapa de
  integración.
- Recurso `/recursos/rubricas-plantillas` (rúbrica Arquitectura Empresarial, adaptada a alcance
  conceptual).

## Entregables

### 1. Identificación de procesos ERP vs. CRM

Tabla que clasifique al menos 6 procesos del escenario (ejemplo: facturación, producción,
inventario, gestión de oportunidades, cotización comercial, seguimiento postventa) indicando si
pertenecen a F&O, a Dataverse/CE, o a ambos con sincronización.

### 2. Mapa de integración con dirección de dual-write

- Diagrama o tabla que muestre qué entidades se sincronizan (por ejemplo: cuentas/clientes,
  productos, pedidos de venta).
- Para cada entidad sincronizada, indica cuál sistema es la "fuente de verdad" y en qué
  dirección fluye el dato (F&O → Dataverse, Dataverse → F&O, o bidireccional).

### 3. Nota conceptual de Data Management Framework

- Describe cómo abordarías una carga masiva de clientes existentes hacia F&O: validación previa,
  manejo de errores, y estrategia de reintentos para registros que fallan.

### 4. Matriz de riesgos

- Al menos 4 riesgos de la integración (ejemplo: duplicidad de clientes, desincronización de
  precios, latencia en dual-write, dependencia de un solo integrador).
- Cada riesgo con probabilidad, impacto y mitigación concreta (no genérica).

### 5. Documento ejecutivo

- 1-2 páginas con la recomendación final: qué licenciar en F&O, qué resolver en Power Platform, y
  por qué — en lenguaje que un comité financiero no técnico pueda seguir.

## Resultado esperado

Un documento que un Solution Architect podría presentar a un comité de dirección para justificar
la arquitectura híbrida, sin necesidad de haber tocado un tenant de F&O real.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Clasificación ERP vs. CRM | 20% | Justifica la elección para al menos 3 procesos sin usar "depende" como respuesta |
| Mapa de integración | 25% | Identifica correctamente la fuente de verdad en cada dirección de sincronización |
| Data Management Framework conceptual | 15% | Propone estrategia de validación y reintentos, no solo "cargar el archivo" |
| Matriz de riesgos | 25% | ≥4 riesgos con probabilidad, impacto y mitigación específica |
| Documento ejecutivo | 15% | Un no-técnico entiende la recomendación sin preguntas básicas de seguimiento |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥85/100.

## Evidencia esperada

- Tabla de clasificación de procesos.
- Diagrama o tabla de integración con dirección del dual-write.
- Nota conceptual de Data Management Framework.
- Matriz de riesgos.
- Documento ejecutivo de 1-2 páginas.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Clasificar todo como "podría ir en cualquiera" | No se profundizó en las capacidades reales de cada plataforma | Revisar el módulo 18/20 y decidir con criterio de dueño del dato, no de conveniencia |
| Ignorar la dirección del dual-write | Se asume que la sincronización es automática y bidireccional sin conflictos | Definir explícitamente qué sistema gana en caso de conflicto para cada entidad |
| Matriz de riesgos genérica | Se copian riesgos de plantilla sin adaptarlos al escenario | Cada riesgo debe nombrar la entidad o proceso específico afectado |
| Documento ejecutivo con jerga técnica de F&O | El autor está más cómodo con detalle técnico que con síntesis ejecutiva | Practicar la explicación con alguien sin contexto de F&O |

## Reto adicional

El comité pregunta: "¿qué pasa si en 2 años queremos migrar de F&O a otro ERP?". Agrega un
párrafo que explique qué tan atado quedaría el diseño propuesto a F&O específicamente, y qué
harías distinto para reducir ese acoplamiento.

## Módulos relacionados

- Módulo 18 — Fundamentos de Arquitectura de Soluciones
- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Módulo 34 — Arquitectura de Datos e Integración
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)
- Recurso — Matriz de Competencias (`/recursos/matriz-competencias`)

## Competencias desarrolladas

- Diferenciación de procesos ERP vs. CRM en un escenario real.
- Razonamiento sobre dual-write y dirección de sincronización.
- Análisis de riesgos de integración entre sistemas empresariales.
- Comunicación ejecutiva de una decisión arquitectónica.

---
id: lab-66
title: "Dynamics 365 Sales — Proceso Comercial Lead-to-Cash"
level: "N3"
duration: 240
product: ["Dynamics 365 Sales", "Dataverse"]
certifications: ["Dynamics 365 Sales"]
role: ["Functional Consultant", "Sales"]
prerequisites:
  - "Módulo 20 estudiado: Dynamics 365 CE — Sales y Customer Service"
  - "Lab 09 completado: Dataverse Avanzado"
  - "Recurso revisado: Rúbricas y Plantillas de Evaluación"
---

# Lab 66 — Dynamics 365 Sales: Proceso Comercial Lead-to-Cash

## Objetivo

Configurar y documentar un proceso comercial completo en Dynamics 365 Sales, de principio a
fin: desde la captura de un Lead hasta la conversión de una Quote en Order, usando entidades
estándar (Lead, Opportunity, Account, Contact, Competitor, Product, Price List) y sin crear una
sola tabla personalizada para lo que la plataforma ya resuelve.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) vende licencias y servicios de
implementación de Power Platform a empresas medianas. Hoy el equipo comercial registra leads en
una hoja de Excel compartida, cotiza en Word, y no tiene visibilidad de en qué etapa está cada
oportunidad ni cuánto pipeline ponderado existe para el próximo trimestre.

## Restricciones del proyecto

- **Licenciamiento:** SIT solo tiene licencias Dynamics 365 Sales Enterprise (no Premium) — no
  configures Predictive Opportunity Scoring, que requiere licencia Premium; documenta que quedaría
  disponible si se actualiza el licenciamiento.
- **Adopción:** los vendedores usan Outlook todo el día y se resisten a "otra herramienta más" —
  cualquier decisión de diseño debe considerar la integración con Outlook, no solo la app web.
- **Datos incompletos:** varios leads históricos en el Excel no tienen teléfono ni empresa
  completos — decide cómo migrarlos sin bloquear el proceso por datos faltantes.

## Alcance del proyecto

Configurar el proceso lead-to-cash con datos de prueba reales, no solo diseñarlo en un documento.

Incluye:

- Modelo de Lead calificado → Opportunity → Quote → Order.
- Catálogo de productos y Price List con al menos 2 productos.
- Competidores registrados con la entidad estándar Competitor.
- BPF de ventas con al menos 3 etapas y probabilidades.
- Dashboard comercial básico (pipeline por etapa).
- Documento de Fit-Gap que justifique qué se resolvió con entidades estándar y qué (si algo)
  requeriría integración con ERP/F&O.

Fuera de alcance:

- Facturación real, cálculo de impuestos o descuento de inventario (eso vive en ERP/F&O, no en
  Dynamics 365 Sales — ver Módulo 34).
- Sales Accelerator y Pipeline Intelligence (mencionar como reto adicional, no obligatorio).

## Prerrequisitos

- Haber estudiado el Módulo 20 y completado el Lab 09.
- Acceso a un ambiente con Dynamics 365 Sales (trial o developer environment).

## Herramientas necesarias

- Dynamics 365 Sales (Sales Hub).
- Recurso `/recursos/rubricas-plantillas`.

## Datos de prueba

| Lead | Empresa | Origen | Calificado |
|---|---|---|---|
| Ana Rivera | Contoso Andina | Web | Sí |
| Luis Mendoza | Fabrikam Norte | Referido | Sí |
| Carla Ibáñez | Litware Sur | Campaña | No (falta presupuesto) |

| Producto | Unidad | Precio Price List Item |
|---|---|---|
| Licencia Power Platform Premium | Por usuario/mes | $38.00 |
| Implementación — Sprint de 2 semanas | Por sprint | $6,500.00 |

## Entregables

### 1. Calificación de Leads

- Los 3 leads de la tabla de datos de prueba cargados como registros `Lead`.
- Solo Ana Rivera y Luis Mendoza se califican y convierten a Opportunity (Carla Ibáñez queda sin
  calificar por falta de presupuesto — documenta el criterio de calificación usado).

### 2. Catálogo y Price List

- Los 2 productos de la tabla de datos de prueba, con su Price List Item correspondiente.
- Verifica que el precio se toma automáticamente de la Price List Item al agregar el producto a
  una Opportunity, no capturado a mano.

### 3. BPF de ventas

- Al menos 3 etapas con probabilidades crecientes (ej. 10% / 40% / 80%).
- Al menos un campo obligatorio por etapa que bloquee el avance si falta.

### 4. Competidores

- Al menos 1 competidor registrado con la entidad estándar `Competitor` (no una tabla custom),
  relacionado a una de las oportunidades.

### 5. Quote → Order

- Una Quote generada desde la Opportunity de Luis Mendoza (Fabrikam Norte), con las 2 líneas de
  producto y un descuento de línea del 10%.
- La Quote convertida a Order al marcar la Opportunity como ganada — verifica que el monto total
  se mantiene consistente entre Quote y Order.

### 6. Dashboard comercial

- Un dashboard o vista con el pipeline agrupado por etapa del BPF y el monto ponderado total.

### 7. Documento de Fit-Gap

- Tabla que liste cada paso del proceso (captura de lead, calificación, cotización, cierre) contra
  la entidad estándar usada, y una fila explícita señalando qué NO se resuelve en Dynamics 365
  Sales (facturación, impuestos, inventario) y por qué eso es correcto, no una brecha.

## Resultado esperado

Un entorno de Dynamics 365 Sales configurado con datos reales que demuestre el flujo completo
lead-to-cash, más un documento de Fit-Gap que un Solution Architect podría revisar para validar
que no hubo sobrepersonalización.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Uso de entidades estándar | 20% | Ninguna tabla personalizada para lo que Sales ya resuelve (Lead, Opportunity, Competitor) |
| Catálogo y pricing | 15% | Price List Item aplicado automáticamente, sin precios capturados a mano |
| BPF de ventas | 15% | 3+ etapas con probabilidades y al menos 1 campo obligatorio por etapa |
| Quote → Order | 20% | Monto y líneas de producto consistentes entre Quote y Order |
| Dashboard comercial | 10% | Pipeline por etapa con monto ponderado visible |
| Fit-Gap | 20% | Identifica correctamente qué vive en Sales y qué en ERP/F&O, sin tratarlo como brecha |

Aprobación: mínimo 70/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥90/100.

## Evidencia esperada

- Captura de los 3 Leads y las 2 Opportunities calificadas.
- Captura del Price List Item aplicado en una línea de producto.
- Captura del BPF con sus etapas y campos obligatorios.
- Captura de la Quote y la Order con montos coincidentes.
- Captura del dashboard de pipeline.
- Documento de Fit-Gap.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Crear una tabla `sit_Competidor` en vez de usar la entidad estándar Competitor | No revisar las entidades estándar antes de personalizar | Usar Competitor nativo y relacionarlo por N:N a Opportunity |
| Capturar el precio a mano en la línea de producto | No configurar correctamente la Price List Item | Verificar que el método de cálculo de la Price List Item sea "Monto fijo" y que se aplique automáticamente |
| BPF sin campos obligatorios por etapa | Se configuran las etapas pero no las reglas de avance | Agregar al menos 1 campo obligatorio por etapa antes de activar el BPF |
| Tratar la ausencia de facturación/impuestos como una brecha del proyecto | No distinguir el alcance de Sales del alcance de ERP/F&O | Documentar explícitamente en el Fit-Gap que esa responsabilidad es de otro sistema, no un gap |

## Reto adicional

Diseña (sin configurarlo, es opcional por licenciamiento) cómo usarías Sales Accelerator para
automatizar el seguimiento de la Opportunity de Ana Rivera si no responde en 3 días tras enviar la
Quote: define la secuencia de actividades y el intervalo de cada paso.

## Módulos relacionados

- Módulo 17 — Proyecto Integrador Nivel 2 (modelo de datos de oportunidades)
- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Módulo 34 — Azure Integration Services Avanzado (frontera Sales vs. F&O)
- Lab 09 — Dataverse Avanzado
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Configuración de un proceso lead-to-cash completo con entidades estándar de Dynamics 365 Sales.
- Uso correcto de catálogo de productos y listas de precios.
- Diseño de BPF de ventas con reglas de avance por etapa.
- Elaboración de Fit-Gap que distingue responsabilidades entre Sales y ERP/F&O.
- Lectura de forecast ponderado a partir del pipeline configurado.

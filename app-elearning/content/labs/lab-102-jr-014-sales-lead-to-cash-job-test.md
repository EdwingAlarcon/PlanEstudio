---
id: lab-102
title: "JR-014 — Dynamics 365 Sales: Lead-to-Cash Job Test"
level: "N3"
duration: 150
product: ["Dynamics 365 Sales", "Dataverse"]
certifications: ["PL-200", "Especialista Dynamics 365 CE"]
role: ["Dynamics 365 Sales Functional Consultant", "CRM Functional"]
prerequisites:
  - "Lab 66 completado: Sales Lead-to-Cash"
  - "Lab 57 revisado: Fit-Gap D365 Sales"
---

# Lab 102 — JR-014: Dynamics 365 Sales — Lead-to-Cash Job Test

## Objetivo

Resolver, en tiempo cronometrado y con entidades estándar de Dynamics 365 Sales, una prueba
técnica de consultoría funcional enfocada **solo** en el proceso lead-to-cash (lead, opportunity,
quote, order, invoice) — sin mezclarlo con Customer Service, retención o cobranza.

## Nota de alcance (léela antes de empezar)

Esta es una prueba técnica funcional cronometrada, no una implementación verificada contra un
tenant en vivo. Documenta cada entregable como diseño funcional explícito. Si tienes acceso a un
tenant trial, configúralo ahí y adjunta capturas; si no, entrega el diseño en Markdown/Excel con el
mismo nivel de detalle que exigiría un evaluador técnico.

## Formato de la prueba

- **Duración:** 150 minutos, cronometrados sin interrupciones.
- **Reglas:** solo entidades estándar de Sales (Lead, Opportunity, Quote, Order, Invoice, Product,
  Price List). No se permite crear tablas custom salvo que un requisito lo exija explícitamente
  (justifícalo si lo haces).
- **Entrega:** un único documento con las 5 secciones de los pasos detallados, en orden.

## Escenario de negocio

**Empresa ficticia:** Ferretería Industrial Continental (FIC), distribuidora B2B de herramientas y
materiales para construcción con 3 líneas de producto y venta a través de un equipo comercial de 8
personas.

FIC gestiona su pipeline en hojas de cálculo. La gerencia comercial pide implementar Dynamics 365
Sales para estandarizar el ciclo lead-to-cash y tener visibilidad de forecast.

## Rol del estudiante

Actúas como consultor funcional de Sales resolviendo una prueba técnica de contratación con tiempo
limitado.

## Herramientas necesarias

- Ambiente Dataverse de práctica con Dynamics 365 Sales (opcional; si no lo tienes, documenta el
  diseño funcional equivalente).
- Markdown/Excel para las matrices pedidas.
- Cronómetro — registra la hora de inicio y de entrega en tu documento final.

## Entregables

- Diagrama del ciclo lead-to-cash con las transiciones de estado de cada entidad.
- Matriz de calificación de leads (criterios y campos).
- Configuración de al menos 2 price lists con reglas de aplicación.
- Business Process Flow de Opportunity con etapas y campos requeridos por etapa.
- 5 casos de prueba que verifiquen el flujo completo lead → invoice.

## Pasos detallados

### Paso 1 — Calificación y conversión de leads

Define los criterios de calificación de un lead (BANT o equivalente) y los campos mínimos
requeridos antes de calificar. Documenta qué registros se crean al calificar un lead (Contact,
Account, Opportunity) y qué pasa con los leads que se descalifican.

### Paso 2 — Opportunity y Business Process Flow

Diseña un BPF de Opportunity con estas etapas: Calificación → Desarrollo → Propuesta → Cierre.
Define al menos 2 campos obligatorios por etapa y una condición de rama (por ejemplo, monto de
oportunidad superior a un umbral que requiera aprobación adicional).

### Paso 3 — Price lists y Quote

Configura (o documenta) 2 price lists — una para clientes mayoristas y otra para clientes al
detalle — con al menos 3 productos cada una y reglas de descuento por volumen. Diseña el flujo de
Quote: cómo se genera desde la Opportunity, qué pasa al activarla, y cómo se revisa antes de
enviarla al cliente.

### Paso 4 — Order e Invoice

Documenta la conversión de Quote ganada a Order, y de Order a Invoice. Define qué validaciones
deben pasar antes de convertir (por ejemplo, disponibilidad de producto, crédito del cliente) y qué
rol autoriza cada conversión.

### Paso 5 — Casos de prueba end-to-end

Escribe 5 casos de prueba que cubran el ciclo completo, incluyendo al menos:

- Un lead calificado exitosamente hasta invoice.
- Un lead descalificado (verifica que no contamine el pipeline de Opportunity).
- Una Opportunity que activa la condición de rama del Paso 2.
- Una Quote revisada con descuento de price list aplicado.
- Un intento de conversión a Order que debería fallar por una validación incumplida.

## Criterios de validación

- [ ] El diagrama cubre las 5 etapas (lead, opportunity, quote, order, invoice) con transiciones de
      estado correctas.
- [ ] La matriz de calificación de leads tiene criterios verificables, no solo intuitivos.
- [ ] Las 2 price lists tienen reglas de descuento explícitas y coherentes con el segmento de
      cliente.
- [ ] El BPF de Opportunity tiene 4 etapas, campos obligatorios por etapa y una condición de rama.
- [ ] Los 5 casos de prueba cubren el flujo completo y al menos un caso negativo.
- [ ] El documento indica hora de inicio y de entrega, dentro del límite de 150 minutos.

## Rúbrica

| Criterio | Peso |
|---|---|
| Calificación y conversión de leads | 15% |
| BPF de Opportunity con condición de rama | 25% |
| Price lists y diseño de Quote | 20% |
| Conversión Order/Invoice y validaciones | 20% |
| Casos de prueba end-to-end | 20% |

## Errores comunes

- Mezclar requerimientos de Customer Service o cobranza en una prueba que solo evalúa Sales.
- Definir price lists sin reglas de descuento explícitas por segmento.
- Omitir el caso de prueba negativo (conversión que debería fallar).
- Diseñar el BPF sin condición de rama, perdiendo la oportunidad de mostrar criterio funcional.
- No registrar el tiempo real usado, perdiendo la evidencia de que se resolvió bajo presión de
  tiempo como en una prueba técnica real.

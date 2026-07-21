---
id: lab-70
title: "CE + F&O Integration Architecture — Ownership de Datos y Dual-Write Técnico"
level: "N4"
duration: 180
product: ["Dynamics 365 Finance", "Dynamics 365 Supply Chain Management", "Dataverse", "Azure"]
certifications: ["Arquitectura Power Platform"]
role: ["Solution Architect"]
prerequisites:
  - "Módulo 59 estudiado: Finance & Operations — Procesos ERP, Virtual Tables y Vocabulario Estándar"
  - "Módulo 34 revisado: Arquitectura de Datos e Integración"
  - "Lab 69 completado: F&O Process Mapping — Procesos ERP End-to-End (recomendado)"
---

# Lab 70 — CE + F&O Integration Architecture: Ownership de Datos y Dual-Write Técnico

## Objetivo

Diseñar, a nivel técnico, la arquitectura de integración entre Dynamics 365 CE (Dataverse) y
Finance & Operations para un escenario con múltiples entidades sincronizadas: quién es dueño de
cada dato, en qué dirección fluye, qué patrón de integración usa (dual-write, DMF o virtual
tables) y qué pasa ante un conflicto de sincronización.

Este laboratorio es el **complemento técnico** del Lab 64 (capstone ejecutivo de arquitectura
híbrida ERP+CRM): mientras el Lab 64 produce una recomendación para un comité de dirección, este
laboratorio produce el diseño técnico de integración que un arquitecto entregaría al equipo de
implementación.

## Diferencia con el Lab 88

Este lab documenta la **arquitectura técnica base** de integración CE + F&O: diagrama, ownership,
dual-write, virtual tables, conflictos y ADR. El Lab 88 se enfoca en la **operación avanzada de la
integración**: matriz extendida de ownership, monitoreo, reconciliación, owner de errores,
rollback y controles de soporte. Si completas ambos, no dupliques el diagrama base; en el Lab 88
parte de esta arquitectura y demuestra cómo se gobierna en operación.

## Escenario de negocio

**Empresa ficticia:** Manufacturas del Pacífico S.A. (mismo escenario del Lab 64 y el Lab 69).
La empresa ya decidió adoptar Dynamics 365 Sales para su equipo comercial manteniendo Finance &
Supply Chain Management como ERP. Ahora necesita el diseño técnico de cómo se sincronizan cuentas,
productos y pedidos entre ambos sistemas.

## Rol del estudiante

Actúas como **Solution Architect** responsable de decidir, entidad por entidad, el patrón técnico
de integración y de anticipar los riesgos de sincronización antes de que el equipo de desarrollo
implemente dual-write.

## Prerrequisitos

- Haber estudiado el Módulo 59 (dual-write, DMF, virtual tables) y el Módulo 34 (integración).
- Haber completado o revisado el Lab 69 (mapas de proceso O2C/P2P/R2R/I2D/Project-to-Profit).

## Herramientas necesarias

- Markdown con bloques ` ```mermaid ` para el diagrama de integración.
- Recurso `/recursos/rubricas-plantillas`.

## Datos de prueba

| Entidad | Origen conceptual F&O | Destino conceptual Dataverse | Frecuencia de cambio |
|---|---|---|---|
| Cuentas/Clientes | `CustomersV3` | `account` | Alta (nuevo distribuidor cada semana) |
| Productos | `Released products` | `product` | Media (catálogo revisado mensualmente) |
| Pedidos de venta | `SalesOrderHeaderV2` / `SalesOrderLineV2` | `salesorder` / `salesorderdetail` | Alta (varios pedidos por día) |
| Saldo de inventario | `InventOnHand` | (no se sincroniza — se consulta) | Muy alta (cambia por minuto) |

## Pasos detallados

### Paso 1 — Diagrama de integración (Mermaid)

Construye un diagrama Mermaid (`flowchart` o `sequenceDiagram`) que muestre: Dynamics 365 Sales
↔ Dataverse ↔ (dual-write) ↔ Finance & Operations, y una consulta directa vía virtual table para
el saldo de inventario (sin pasar por dual-write). Incluye las 4 entidades de la tabla de datos de
prueba en el diagrama.

### Paso 2 — Matriz de ownership de datos

Para cada una de las 4 entidades, documenta:

- Sistema **fuente de verdad** (quién puede crear/editar el dato originalmente).
- **Dirección** de sincronización (F&O → Dataverse, Dataverse → F&O, o bidireccional).
- **Patrón técnico** elegido (dual-write, DMF o virtual table) con justificación usando el
  criterio de decisión del Módulo 59.

### Paso 3 — Diseño de dual-write para Cuentas/Clientes y Pedidos

- Explica qué pasa si un vendedor crea una cuenta nueva en Dataverse antes de que exista en
  `CustomersV3`: ¿dual-write la crea automáticamente en F&O, o requiere un mapeo previo?
- Para los pedidos de venta, explica en qué momento el pedido deja de ser editable desde Dataverse
  (por ejemplo, una vez que F&O ya generó la factura) y qué error debería mostrarse al vendedor si
  intenta modificarlo después de ese punto.

### Paso 4 — Virtual table para saldo de inventario

Justifica por qué el saldo de inventario (`InventOnHand`) usa virtual table y no dual-write ni
DMF, en términos de la frecuencia de cambio (columna de la tabla de datos de prueba) y del riesgo
de mostrar un saldo desactualizado si se sincronizara por lotes.

### Paso 5 — Resolución de conflictos

Para cada entidad sincronizada bidireccionalmente (si aplica), documenta la regla de resolución de
conflictos: ¿qué sistema gana si el mismo campo cambia en ambos lados antes de sincronizar?

### Paso 6 — Matriz de riesgos de la integración

Identifica al menos 5 riesgos técnicos (ej. latencia de dual-write bajo carga alta, mapeo de
campos personalizados no contemplado, fallo de sincronización silencioso, duplicidad de cuentas
por creación simultánea, dependencia de un solo integrador) con probabilidad, impacto y mitigación
concreta.

### Paso 7 — Decisiones arquitectónicas (mini-ADR)

Redacta 2 decisiones arquitectónicas breves (formato ADR: contexto, decisión, consecuencias) —
una sobre el patrón de integración elegido para pedidos de venta, y otra sobre por qué el saldo de
inventario no se duplica en Dataverse.

## Resultado esperado

Un diseño técnico de integración que un equipo de desarrollo podría usar directamente para
configurar dual-write y virtual tables, con ownership de datos, dirección de sincronización y
riesgos ya resueltos — sin necesidad de un tenant de F&O real para completarlo.

## Validaciones

- [ ] El diagrama Mermaid muestra las 4 entidades y distingue dual-write de la consulta directa
      vía virtual table.
- [ ] La matriz de ownership indica fuente de verdad, dirección y patrón técnico para cada entidad.
- [ ] El diseño de dual-write explica el comportamiento ante creación de cuentas nuevas y pedidos
      ya facturados.
- [ ] La elección de virtual table para inventario está justificada por frecuencia de cambio, no
      solo por regla general.
- [ ] Existen al menos 5 riesgos técnicos con mitigación específica.
- [ ] Las 2 decisiones arquitectónicas siguen el formato ADR (contexto, decisión, consecuencias).

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Sincronizar el saldo de inventario con dual-write | No considerar la frecuencia de cambio del dato | Usar virtual table para datos de alta volatilidad que solo se consultan |
| No definir quién gana en un conflicto bidireccional | Asumir que la sincronización nunca tiene conflictos | Documentar explícitamente la regla de resolución por entidad |
| Diagrama sin distinguir dual-write de virtual table | Tratar toda integración como el mismo mecanismo | Usar símbolos o rutas distintas en el diagrama para cada patrón |
| ADR sin consecuencias reales | Escribir la decisión sin pensar en el costo de cambiarla después | Incluir al menos una consecuencia negativa o limitación aceptada |

## Reto adicional

El equipo de desarrollo pregunta: "¿qué pasa si dual-write falla silenciosamente durante una hora
y nadie lo nota?". Agrega un mecanismo de monitoreo o alerta (conceptual) que detectaría esa falla
antes de que afecte la operación comercial.

## Evidencia esperada

- Diagrama Mermaid de la arquitectura de integración.
- Matriz de ownership de datos (fuente de verdad, dirección, patrón técnico) por entidad.
- Diseño de comportamiento de dual-write para cuentas y pedidos.
- Justificación técnica de la virtual table de inventario.
- Matriz de riesgos técnicos de la integración.
- 2 decisiones arquitectónicas en formato ADR.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Diagrama de integración | 20% | Distingue claramente dual-write de virtual table para las 4 entidades |
| Matriz de ownership | 20% | Fuente de verdad y dirección correctas para cada entidad, con patrón técnico justificado |
| Diseño de dual-write | 20% | Resuelve el caso de cuenta nueva y de pedido ya facturado |
| Resolución de conflictos | 15% | Regla de resolución explícita, no "se sincroniza automáticamente" |
| Matriz de riesgos técnicos | 15% | ≥5 riesgos con mitigación específica |
| ADRs | 10% | Formato correcto con consecuencias reales, no solo la decisión |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥85/100.

## Módulos relacionados

- Módulo 59 — Finance & Operations: Procesos ERP, Virtual Tables y Vocabulario Estándar
- Módulo 34 — Arquitectura de Datos e Integración
- Lab 69 — F&O Process Mapping: Procesos ERP End-to-End
- Lab 64 — Capstone Finance & Operations Awareness: Arquitectura Conceptual ERP + CRM
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño técnico de integración CE + F&O (dual-write, DMF, virtual tables).
- Modelado de ownership de datos y dirección de sincronización.
- Resolución de conflictos de sincronización entre sistemas.
- Redacción de decisiones arquitectónicas (ADR) para integración empresarial.

---
id: lab-96
title: "F&O Inventory & Products Setup"
level: "N4"
duration: 180
product: ["Dynamics 365 Supply Chain Management", "Product Information Management", "Inventory Management"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Lab 93 completado: F&O Finance Setup Walkthrough"
  - "Módulo 60 estudiado: F&O Awareness — Procesos ERP, Virtual Tables y Vocabulario Estándar"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Supply Chain Management"
---

# Lab 96 — F&O Inventory & Products Setup

## Objetivo

Configurar un producto liberado con variantes, grupos de dimensión y una política de reserva
básica, y explicar cómo estas decisiones afectan la disponibilidad de inventario que verían Ventas
y Compras.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Supply Chain Management, **sin verificación contra un tenant en vivo al momento de escribirse**. Si
un nombre de menú difiere de tu ambiente, documenta la diferencia y sigue el flujo equivalente.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-95).

Northwind vende una camiseta técnica en 3 colores y 3 tallas. El equipo de Producto necesita que el
sistema controle inventario por color y talla, y que las reservas sigan una jerarquía definida (sitio
antes que almacén) para evitar prometer inventario que no está físicamente disponible donde se necesita.

## Rol del estudiante

Actúas como F&O Practitioner configurando el maestro de producto y las reglas de inventario.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Supply Chain Management.
- Al menos un sitio y un almacén configurados (usa los del demo data Contoso si no quieres crear nuevos).

## Entregables

- Grupos de dimensión de producto/almacenamiento/seguimiento configurados o documentados.
- Producto liberado con variantes por color y talla (al menos 3x3 = 9 combinaciones).
- Jerarquía de reservas documentada.
- Explicación de cómo estas decisiones afectan lo que ve un vendedor al prometer una fecha de entrega.

## Pasos detallados

### Paso 1 — Grupos de dimensión

Ve a **Product information management > Setup > Dimension and variant groups**.

- Revisa o crea un **Storage dimension group** (sitio, almacén, ubicación).
- Revisa o crea un **Tracking dimension group** (lote, número de serie) — para este producto no
  necesitas seguimiento por serie, documenta por qué.
- Revisa o crea un **Product dimension group** que incluya color y talla como dimensiones de producto.

### Paso 2 — Producto liberado y variantes

Ve a **Product information management > Products > Released products > New**.

- Crea el producto base "Camiseta técnica Northwind" y asígnale el grupo de dimensión de producto del Paso 1.
- Genera las variantes (**Released product > Variants**) combinando 3 colores x 3 tallas (9 variantes).
- Documenta cómo el sistema distingue entre "el producto" y "una variante específica" al momento de vender o comprar.

### Paso 3 — Sitios, almacenes y jerarquía de reservas

Ve a **Inventory management > Setup > Inventory breakdown > Sites** y **Warehouses**.

- Documenta al menos 1 sitio con 2 almacenes distintos (p. ej. `Almacén Principal` y `Almacén Devoluciones`).
- Ve a **Inventory management > Setup > Reservation hierarchy** (o el equivalente documentado en tu
  versión) y define una jerarquía: sitio antes que almacén antes que ubicación.
- Explica, con un ejemplo, qué pasa si hay inventario suficiente en el sitio pero repartido entre
  dos almacenes distintos, y cómo la jerarquía de reservas decide si se puede prometer como una sola entrega.

### Paso 4 — Impacto en disponibilidad

Documenta, sin necesariamente ejecutarlo en una orden real:

- Qué vería un vendedor en la ficha de disponibilidad (available to promise) para una variante específica.
- Por qué dos variantes del mismo producto pueden tener disponibilidad distinta aunque el producto base sea el mismo.

## Criterios de validación

- [ ] Los grupos de dimensión están documentados con su propósito (storage, tracking, product).
- [ ] El producto liberado tiene al menos 9 variantes (3 colores x 3 tallas).
- [ ] Hay al menos 2 almacenes documentados dentro de un sitio.
- [ ] La jerarquía de reservas está definida y justificada con un ejemplo concreto.
- [ ] La explicación de disponibilidad conecta variantes, dimensiones y jerarquía de reservas.

## Rúbrica

| Criterio | Peso |
|---|---|
| Grupos de dimensión | 20% |
| Producto y variantes | 30% |
| Sitios, almacenes y jerarquía de reservas | 30% |
| Explicación de disponibilidad | 20% |

## Errores comunes

- Confundir dimensión de producto (color/talla, define la variante) con dimensión de almacenamiento (sitio/almacén, define dónde está físicamente).
- Crear variantes sin asignar el grupo de dimensión de producto correcto al producto base.
- No definir una jerarquía de reservas, dejando que el sistema reserve inventario en cualquier almacén sin criterio.
- Asumir que "hay inventario" es suficiente sin considerar en qué sitio/almacén específico está disponible.

---
id: lab-98
title: "F&O Commerce Overview Hands-On"
level: "N4"
duration: 180
product: ["Dynamics 365 Commerce", "Dynamics 365 Supply Chain Management", "Retail and Commerce"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Lab 96 completado: F&O Inventory & Products Setup"
  - "Acceso a un ambiente trial/demo con el módulo Retail and Commerce habilitado (no todos los trials de Finance/SCM lo incluyen por defecto — verifica en tu ambiente antes de empezar)"
---

# Lab 98 — F&O Commerce Overview Hands-On

## Objetivo

Configurar un canal de venta (tienda online o punto de venta) sobre un producto liberado existente,
documentando el flujo de sincronización entre el catálogo central y el canal, y las diferencias
entre venta unificada (F&O/Commerce) y venta gestionada solo dentro de Dynamics 365 CE.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Commerce, **sin verificación contra un tenant en vivo al momento de escribirse**. A diferencia de
Finance/SCM, el módulo Retail and Commerce no siempre viene habilitado en un trial base — si tu
ambiente no lo tiene, documenta ese límite explícitamente en vez de simular pasos que no puedes
ejecutar.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-97).

Northwind quiere vender la camiseta técnica configurada en el Lab 96 también a través de una tienda
online, sin duplicar el catálogo de producto ni el inventario.

## Rol del estudiante

Actúas como F&O Practitioner configurando un canal de Commerce sobre el maestro de producto existente.

## Herramientas necesarias

- Ambiente trial/demo con Retail and Commerce habilitado.
- El producto liberado con variantes del Lab 96 (o uno equivalente del demo data).

## Entregables

- Canal de venta (tienda online u online store) creado y asociado a la legal entity.
- Producto del catálogo central publicado hacia el canal.
- Documentación de la sincronización entre catálogo central y canal (tiempo real vs. programada).
- Tabla comparativa: venta unificada F&O/Commerce vs. venta gestionada solo en Dynamics 365 CE.

## Pasos detallados

### Paso 1 — Canal de venta

Ve a **Retail and Commerce > Channel setup > Online stores** (o **Retail stores**, si vas a
documentar un punto de venta físico en su lugar).

- Crea o documenta un canal con nombre, legal entity asociada y moneda.
- Documenta si el canal comparte el mismo catálogo de productos que la legal entity o si usa un catálogo específico.

### Paso 2 — Publicación de producto al canal

Ve a **Retail and Commerce > Products** y localiza el producto del Lab 96 (o uno equivalente).

- Asigna el producto (y sus variantes) al canal creado en el Paso 1, incluyendo precio de venta.
- Documenta qué pasa si cambias el precio en el catálogo central: ¿se refleja automáticamente en el canal, o requiere un paso de sincronización explícito?

### Paso 3 — Sincronización canal-catálogo

Ve a **Retail and Commerce > Retail and Commerce IT > Distribution schedule** (o el equivalente
documentado en tu versión, como Commerce Scheduler).

- Documenta cómo funciona el job de distribución/sincronización entre el catálogo central y la base
  de datos del canal (channel database), y con qué frecuencia se ejecuta por defecto.
- Explica qué pasaría si el trabajo de sincronización falla: ¿el canal seguiría vendiendo con datos desactualizados?

### Paso 4 — Comparación con venta en CE

Documenta, con el ejemplo de este mismo producto:

- Qué pasaría si el mismo producto también se vendiera desde Dynamics 365 Sales (CE) — ¿el inventario y el precio se comparten automáticamente, o requieren integración explícita (dual-write, Dataverse-F&O)?
- En qué escenario de negocio elegirías Commerce (venta unificada con inventario/POS) en vez de un proceso de venta gestionado solo en CE.

## Criterios de validación

- [ ] El canal de venta está documentado con legal entity y moneda asociadas.
- [ ] El producto está publicado al canal con precio, o el límite del ambiente está documentado si el módulo no está disponible.
- [ ] La sincronización catálogo-canal está explicada con su mecanismo y frecuencia.
- [ ] La comparación Commerce vs. venta en CE usa el ejemplo concreto del producto, no una explicación genérica.

## Rúbrica

| Criterio | Peso |
|---|---|
| Canal de venta | 20% |
| Publicación de producto | 25% |
| Sincronización catálogo-canal | 30% |
| Comparación Commerce vs. CE | 25% |

## Errores comunes

- Asumir que el módulo Commerce está disponible en cualquier trial de Finance/SCM sin verificarlo primero.
- No distinguir entre catálogo central (F&O) y catálogo del canal (Commerce) como conceptos separados.
- Ignorar la latencia de sincronización y asumir que un cambio de precio es instantáneo en todos los canales.
- Confundir integración Commerce-F&O (nativa, mismo producto) con integración CE-F&O (requiere dual-write u otro mecanismo).

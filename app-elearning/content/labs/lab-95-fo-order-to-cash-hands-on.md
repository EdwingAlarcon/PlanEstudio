---
id: lab-95
title: "F&O Order-to-Cash Hands-On"
level: "N4"
duration: 240
product: ["Dynamics 365 Supply Chain Management", "Dynamics 365 Finance", "Accounts Receivable"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Lab 93 completado: F&O Finance Setup Walkthrough"
  - "Módulo 60 estudiado: F&O Awareness — Procesos ERP, Virtual Tables y Vocabulario Estándar"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Finance & Supply Chain Management"
---

# Lab 95 — F&O Order-to-Cash Hands-On

## Objetivo

Ejecutar el ciclo Order-to-Cash completo en un ambiente real: cliente, pedido de venta, envío,
factura y cobro, documentando cada estado y el asiento contable generado.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Supply Chain Management/Finance, **sin verificación contra un tenant en vivo al momento de
escribirse**. Si un nombre de menú difiere de tu ambiente, documenta la diferencia y sigue el flujo
equivalente — es más probable un cambio de release wave que un error del lab.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-94).

Ventas cerró un pedido de 30 unidades de un producto terminado con un cliente existente. El ciclo
completo debe quedar documentado, incluyendo qué pasa si el almacén solo puede enviar parte del
pedido.

## Rol del estudiante

Actúas como F&O Practitioner ejecutando y documentando el ciclo O2C end-to-end.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Supply Chain Management/Finance.
- Un cliente de prueba (`CustomersV3`), usa uno del demo data Contoso si no quieres crear uno nuevo.
- Un producto liberado con inventario disponible en al menos un sitio/almacén.

## Entregables

- Cliente identificado y pedido de venta creado.
- Envío (packing slip) documentado, incluyendo un caso de envío parcial.
- Factura de venta contabilizada.
- Cobro registrado en un payment journal.
- Diagrama del ciclo con los 4 documentos y el estado que dispara cada transición.

## Pasos detallados

### Paso 1 — Cliente y pedido de venta

Ve a **Accounts receivable > Customers > All customers** para confirmar o crear el cliente
(`CustomersV3`), y luego a **Accounts receivable > Orders > All sales orders > New**.

- Crea el pedido con el producto, cantidad (30 unidades) y sitio/almacén de envío.
- Documenta el precio, la moneda y las condiciones de pago del pedido.

### Paso 2 — Envío parcial

Desde el pedido de venta, genera el **Packing slip** (**Sales order > Post > Packing slip**).

- Registra un envío de solo 20 unidades (deliberadamente menos que las 30 pedidas) para simular un
  envío parcial por falta de inventario.
- Documenta el estado de la línea del pedido (cantidad pendiente vs. enviada) y qué opciones tiene
  el equipo de ventas (envío posterior, backorder, notificar al cliente).

### Paso 3 — Factura

Desde el pedido de venta, genera la **Invoice** (**Sales order > Invoice > Invoice**).

- Factura únicamente las 20 unidades efectivamente enviadas.
- Documenta qué pasaría si intentas facturar las 30 unidades originales sin haberlas enviado —
  identifica el control que lo impide o lo señala.
- Contabiliza la factura y documenta el asiento contable generado (cuenta por cobrar vs. ingreso/costo de venta).

### Paso 4 — Cobro

Ve a **Accounts receivable > Payments > Payment journal**.

- Registra el cobro de la factura contabilizada.
- Documenta el asiento contable que genera el cobro (banco vs. cuenta por cobrar).
- Documenta el saldo pendiente del pedido para las 10 unidades que aún no se enviaron ni facturaron.

## Criterios de validación

- [ ] El pedido de venta está creado con cliente, producto, cantidad y sitio correctos.
- [ ] Hay un envío documentado con envío parcial y su explicación.
- [ ] La factura coincide con lo efectivamente enviado, no con lo pedido originalmente.
- [ ] El cobro está registrado y su asiento contable documentado.
- [ ] El diagrama del ciclo muestra los 4 documentos, sus transiciones de estado y el saldo pendiente.

## Rúbrica

| Criterio | Peso |
|---|---|
| Pedido de venta | 15% |
| Envío y manejo de parcialidad | 30% |
| Factura | 30% |
| Cobro | 15% |
| Diagrama del ciclo | 10% |

## Errores comunes

- Facturar la cantidad pedida en lugar de la cantidad enviada.
- No documentar qué pasa con el saldo pendiente de un envío parcial.
- Confundir el asiento contable del envío (costo de venta/inventario) con el de la factura (cuenta por cobrar).
- Registrar el cobro sin haber contabilizado antes la factura.

---
id: lab-94
title: "F&O Procure-to-Pay Hands-On"
level: "N4"
duration: 240
product: ["Dynamics 365 Supply Chain Management", "Dynamics 365 Finance", "Accounts Payable"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Lab 93 completado: F&O Finance Setup Walkthrough"
  - "Módulo 60 estudiado: F&O Awareness — Procesos ERP, Virtual Tables y Vocabulario Estándar"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Finance & Supply Chain Management"
---

# Lab 94 — F&O Procure-to-Pay Hands-On

## Objetivo

Ejecutar el ciclo Procure-to-Pay completo en un ambiente real: orden de compra, recepción de
producto, factura de proveedor y pago, documentando cada estado y el asiento contable generado.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Supply Chain Management/Finance, **sin verificación contra un tenant en vivo al momento de
escribirse**. Si un nombre de menú difiere de tu ambiente, documenta la diferencia y sigue el flujo
equivalente — es más probable un cambio de release wave que un error del lab.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario del Lab 93).

Compras necesita adquirir 50 unidades de un componente a un proveedor nuevo. El ciclo completo debe
quedar documentado: desde la orden de compra hasta el pago, incluyendo qué pasa si la cantidad
recibida no coincide con lo pedido.

## Rol del estudiante

Actúas como F&O Practitioner ejecutando y documentando el ciclo P2P end-to-end.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Supply Chain Management/Finance.
- Un proveedor de prueba (usa uno del demo data Contoso si no quieres crear uno nuevo).
- Un producto liberado en al menos una legal entity (usa uno del demo data si aplica).

## 🔧 Requisitos de ambiente y fallos frecuentes

**Rol de seguridad mínimo**

Este lab es transaccional, no de configuración: necesitas acceso de escritura al ciclo completo de
compras y cuentas por pagar, no un rol administrativo amplio. En términos funcionales, el mínimo
necesario cubre: crear y confirmar órdenes de compra (responsabilidad típica de un rol de comprador,
"Purchasing agent" o equivalente), registrar recepciones de producto, y capturar/contabilizar
facturas de proveedor y pagos (responsabilidad típica de un rol de cuentas por pagar, "Accounts
payable" o equivalente). Si tu ambiente demo te da acceso total como administrador, esta distinción
no bloquea el lab; si trabajas en un ambiente compartido, pide acceso de escritura a **Procurement
and sourcing** y **Accounts payable** en vez de pedir un rol genérico de administrador.

**Configuración previa que puede faltar en un trial**

- El proveedor de prueba puede no tener un grupo de método de pago o términos de pago asignados por
  defecto — sin eso, el payment journal puede rechazar la línea de pago.
- El producto usado debe estar liberado ("released") en la legal entity donde trabajas; un producto
  que existe solo a nivel de catálogo global pero no fue liberado a la legal entity no aparecerá al
  crear la línea de la orden de compra.
- La coincidencia de 3 vías (three-way match) puede estar desactivada o configurada con tolerancias
  distintas en **Accounts payable parameters**; si el ambiente permite facturar sin haber recibido,
  eso puede ser una tolerancia de match configurada así en el demo, no ausencia del control.

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece el proveedor de prueba al crear la orden de compra | Proveedor no liberado en la legal entity actual | Revisa **Accounts payable > Vendors > All vendors** filtrando por la legal entity activa | Cambia a la legal entity demo (`USMF`/`DEMF`) donde el proveedor Contoso sí existe, o crea el proveedor en tu legal entity |
| El producto no aparece al agregar la línea de la orden de compra | Producto no liberado a esa legal entity | Ve a **Product information management > Released products** y verifica si el producto aparece para tu legal entity | Libera el producto a la legal entity (**Release products**) o usa un producto Contoso ya liberado |
| El sistema permite facturar la cantidad pedida sin haber sido recibida | Tolerancia de coincidencia de 3 vías configurada de forma permisiva, o control desactivado | Revisa **Accounts payable > Setup > Accounts payable parameters > Invoice validation** | Documenta la tolerancia configurada como parte de la evidencia; no asumas que el control "no existe" solo porque el trial lo permitió |
| El payment journal no permite guardar la línea de pago | Falta término de pago o método de pago en el proveedor | Revisa la ficha del proveedor en **Vendors > All vendors > Payment** | Asigna un método y término de pago al proveedor antes de reintentar el pago |
| La factura no se deja contabilizar (post) | Período fiscal cerrado o permiso insuficiente en el diario de facturas | Revisa el estado del período en **Fiscal calendars** y tus roles asignados | Verifica que el período esté abierto; si el período está correcto, solicita el rol de cuentas por pagar con permiso de contabilización |

## Entregables

- Orden de compra creada y confirmada.
- Recepción de producto (product receipt) documentada, incluyendo un caso con discrepancia de cantidad.
- Factura de proveedor (vendor invoice) coincidida contra la orden de compra.
- Pago registrado en un payment journal.
- Diagrama del ciclo con los 4 estados y el documento que dispara cada transición.

## Pasos detallados

### Paso 1 — Orden de compra

Ve a **Procurement and sourcing > Purchase orders > All purchase orders > New**.

- Selecciona el proveedor, el sitio/almacén de recepción y agrega la línea con el producto y cantidad (50 unidades).
- Confirma la orden de compra (**Purchase order > Confirm**).
- Documenta el estado de la orden después de confirmarla.

### Paso 2 — Recepción de producto

Desde la orden de compra confirmada, ve a **Receive > Product receipt**.

- Registra la recepción de solo 45 unidades (deliberadamente menos que las 50 pedidas) para simular una discrepancia real.
- Documenta cómo queda el estado de la línea de la orden (cantidad pendiente vs. recibida).
- Explica qué opciones tiene el equipo de compras ante esa discrepancia (recepción parcial, seguimiento con el proveedor, cierre de la línea).

### Paso 3 — Factura de proveedor

Desde la orden de compra, ve a **Invoice > Vendor invoice**, o desde
**Accounts payable > Invoices > Pending vendor invoices**.

- Factura las 45 unidades efectivamente recibidas (coincidencia de 3 vías: orden, recepción, factura).
- Documenta qué pasaría si intentas facturar las 50 unidades originales sin haberlas recibido — identifica el control que lo impide o lo señala.
- Contabiliza (post) la factura y documenta el asiento contable generado (cuenta de gasto/inventario vs. cuenta por pagar).

### Paso 4 — Pago

Ve a **Accounts payable > Payments > Payment journal**.

- Crea una línea de pago para la factura contabilizada.
- Documenta el método de pago y el asiento contable que genera el pago (cuenta por pagar vs. banco).

## Criterios de validación

- [ ] La orden de compra está confirmada con proveedor, sitio y cantidad correctos.
- [ ] Hay una recepción documentada con discrepancia de cantidad y su explicación.
- [ ] La factura coincide con lo efectivamente recibido, no con lo pedido originalmente.
- [ ] El pago está registrado y su asiento contable documentado.
- [ ] El diagrama del ciclo muestra los 4 documentos y sus transiciones de estado.

## Rúbrica

| Criterio | Peso |
|---|---|
| Orden de compra | 15% |
| Recepción y manejo de discrepancia | 30% |
| Factura y coincidencia de 3 vías | 30% |
| Pago | 15% |
| Diagrama del ciclo | 10% |

## Errores comunes

- Facturar la cantidad pedida en lugar de la cantidad recibida.
- No documentar qué pasa cuando hay discrepancia entre orden y recepción.
- Confundir el asiento contable de la recepción (inventario) con el de la factura (cuenta por pagar).
- Saltar directo a la factura sin pasar por la recepción, perdiendo la coincidencia de 3 vías.

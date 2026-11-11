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
  - "Acceso a un ambiente trial/demo de Dynamics 365 Finance & Supply Chain Management"
lastVerified: "2026-11"
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

## ⚠️ Antes de empezar: cómo se consigue hoy un ambiente de F&O

Verificado en Microsoft Learn en noviembre de 2026. Sin un ambiente así este lab no es ejecutable;
la alternativa en papel está en el [Módulo 60](/nivel/d365/modulo/finance-operations-procesos-erp).

- **Tu ambiente del curso no sirve.** Learn indica que el tipo de ambiente
  *Developer* no admite ninguna carga de Dynamics 365; F&O se instala en ambientes *Sandbox*,
  *Production* o *Trial (subscription-based)* y exige una licencia de F&O asignada
  ([Learn: Unified environment types and templates](https://learn.microsoft.com/power-platform/admin/unified-experience/unified-environment-types-and-templates)).
  El trial no se añade a un ambiente que ya tengas: crea uno nuevo.
- **Trial de administrador (el camino actual):** el administrador de un tenant de trabajo o escuela
  (no sirve una cuenta personal de Microsoft) busca en el
  [Microsoft 365 admin center](https://admin.microsoft.com/) > **Marketplace** la oferta gratuita de
  prueba de *Finance*, *Supply Chain Management*, *Project Operations* o *Commerce*, la adquiere y
  se asigna la licencia. Después, en el
  [Power Platform admin center](https://admin.powerplatform.microsoft.com): **Manage** >
  **Environments** > **New**, tipo **Trial (subscription-based)**, **Next**, **Enable Dynamics 365
  apps** y la plantilla de esa licencia (por ejemplo **Finance (Preview)**). El despliegue puede
  tardar una hora ([Learn: Unified admin trials](https://learn.microsoft.com/power-platform/admin/unified-experience/admin-trials)).
  Esa página no dice cuánto dura el trial: anota la fecha de expiración que te muestre el admin center.
- **Página pública de pruebas:** a la fecha de esta revisión, en la
  [página de pruebas gratuitas de Dynamics 365](https://www.microsoft.com/dynamics-365/free-trial)
  Finance, Supply Chain Management y Commerce solo ofrecen **Request a demo**. Learn ("Before you
  buy") todavía menciona una prueba de 30 días con registro por correo; no cuentes con ella sin
  comprobarla.
- **Lifecycle Services (LCS):** desde el 16 de febrero de 2026 los clientes nuevos de Finance,
  Supply Chain Management y Project Operations no pueden crear proyectos en LCS y administran sus
  ambientes en el Power Platform admin center
  ([Learn: Lifecycle Services project creation freeze](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/lifecycle-services/lcs-project-creation-freeze)).
  Si tu empresa o un partner ya tiene un ambiente demo en LCS, sigue sirviendo para este lab.
- **Datos demo:** los pasos usan las compañías demo de Contoso, como `USMF` (Contoso Entertainment
  System USA). Al entrar, revisa la compañía activa en la barra superior; si `USMF` no aparece en
  la lista, tu ambiente se creó sin datos demo: documéntalo y trabaja con lo que haya.

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

## 🔧 Requisitos de ambiente y fallos frecuentes

**Rol de seguridad mínimo**

Al igual que el ciclo P2P, este lab es transaccional: necesitas acceso de escritura al ciclo de
ventas y cuentas por cobrar, no un rol administrativo amplio. El mínimo funcional cubre: crear
pedidos de venta y generar envíos (responsabilidad típica de un rol de ventas, "Sales order
processor" o equivalente), y facturar/contabilizar cobros (responsabilidad típica de un rol de
cuentas por cobrar, "Accounts receivable" o equivalente). Si tu ambiente demo te da acceso total
como administrador, no necesitas ajustar nada; en un ambiente compartido, pide acceso de escritura a
**Accounts receivable** (incluye pedidos de venta) en vez de un rol genérico de administrador.

**Configuración previa que puede faltar en un trial**

- El cliente de prueba puede no tener condiciones de pago, grupo de cliente o método de pago
  asignados — sin eso, el payment journal puede rechazar el cobro o el pedido no calcular
  correctamente el precio.
- El producto usado necesita inventario disponible ("on-hand") en el sitio/almacén de envío del
  pedido; si el trial no tiene inventario cargado para ese producto, el envío parcial que pide el
  lab no se puede simular de forma realista y hay que documentarlo como limitación del dato demo.
- Los parámetros de facturación de ventas (**Accounts receivable parameters**) pueden tener
  configurada una tolerancia distinta para facturar contra lo enviado vs. lo pedido, igual que en
  el ciclo P2P — si el sistema permite facturar de más, es una tolerancia configurada, no ausencia
  del control.

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece el cliente de prueba al crear el pedido de venta | Cliente no liberado/creado en la legal entity actual | Revisa **Accounts receivable > Customers > All customers** filtrando por la legal entity activa | Cambia a la legal entity demo (`USMF`/`DEMF`) donde el cliente Contoso sí existe, o crea el cliente en tu legal entity |
| El pedido de venta no permite reservar/enviar el producto | Sin inventario disponible ("on-hand") en el sitio/almacén | Ve a **Inventory management > Inquiries > On-hand inventory** para ese producto y sitio | Ajusta el inventario con un movimiento de ajuste, o documenta la limitación y usa un producto Contoso con inventario precargado |
| El sistema permite facturar la cantidad pedida sin haberla enviado | Tolerancia de facturación configurada de forma permisiva en el trial | Revisa **Accounts receivable > Setup > Accounts receivable parameters** (sección de facturación) | Documenta la tolerancia como parte de la evidencia en vez de asumir que el control no existe |
| El payment journal no permite registrar el cobro | Falta método de pago o cuenta bancaria configurada | Revisa **Cash and bank management > Bank accounts** y la ficha del cliente | Asigna el método de pago y verifica que exista una cuenta bancaria activa antes de reintentar |
| El precio o la moneda del pedido no coinciden con lo esperado | Grupo de cliente o lista de precios sin configurar | Revisa la ficha del cliente en **Customers > All customers > Sales demographics** | Asigna el grupo de cliente correcto o documenta el precio/moneda tal como aparece, explicando de dónde se hereda |

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

Desde el pedido de venta, en el Action Pane, abre la pestaña **Pick and pack** y selecciona
**Post packing slip** (Learn: *Ship sales orders without warehousing*). En la página de
contabilización, cambia la cantidad en la columna **Update** de la línea y selecciona **OK**.

- Registra un envío de solo 20 unidades (deliberadamente menos que las 30 pedidas) para simular un
  envío parcial por falta de inventario.
- Documenta el estado de la línea del pedido (cantidad pendiente vs. enviada) y qué opciones tiene
  el equipo de ventas (envío posterior, backorder, notificar al cliente).

### Paso 3 — Factura

Desde el pedido de venta, en el Action Pane, selecciona **Invoice** > **Generate** > **Invoice**
([Learn: Create and handle payments of customer invoices for sales orders](https://learn.microsoft.com/training/modules/accounts-receivable-daily-procedures-dyn365-finance/4-pay-cust-invoice)).
En el campo **Quantity** de los parámetros elige **Packing slip** para facturar solo lo enviado.

- Factura únicamente las 20 unidades efectivamente enviadas.
- Documenta qué pasaría si intentas facturar las 30 unidades originales sin haberlas enviado —
  identifica el control que lo impide o lo señala.
- Contabiliza la factura y documenta el asiento contable generado (cuenta por cobrar vs. ingreso/costo de venta).

### Paso 4 — Cobro

Ve a **Accounts receivable > Payments > Customer payment journal**
([Learn: Customer payment overview](https://learn.microsoft.com/dynamics365/finance/cash-bank-management/tasks/customer-payment-overview)). Como
alternativa, Learn describe la página **Enter customer payments** para registrar y liquidar cobros.

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

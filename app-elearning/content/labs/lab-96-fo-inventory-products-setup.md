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
  - "Acceso a un ambiente trial/demo de Dynamics 365 Supply Chain Management"
lastVerified: "2026-09"
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

## ⚠️ Antes de empezar: cómo se consigue hoy un ambiente de F&O

Verificado en Microsoft Learn en noviembre de 2026. Sin un ambiente así este lab no es ejecutable;
la alternativa en papel está en el [Módulo 60](/nivel/d365/modulo/finance-operations-procesos-erp).

- **Tu ambiente Developer de Power Platform no sirve.** Learn indica que el tipo de ambiente
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

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-95).

Northwind vende una camiseta técnica en 3 colores y 3 tallas. El equipo de Producto necesita que el
sistema controle inventario por color y talla, y que las reservas sigan una jerarquía definida (sitio
antes que almacén) para evitar prometer inventario que no está físicamente disponible donde se necesita.

## Rol del estudiante

Actúas como F&O Practitioner configurando el maestro de producto y las reglas de inventario.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Supply Chain Management.
- Al menos un sitio y un almacén configurados (usa los del demo data Contoso si no quieres crear nuevos).

## 🔧 Requisitos de ambiente y fallos frecuentes

### Rol de seguridad mínimo

No uses "System administrator" para este lab si tu ambiente permite asignar roles más acotados: la
tarea es funcionalmente de **gestión de información de producto e inventario** (Product information
management + Inventory management), no de administración financiera ni de proyecto. Si tu ambiente
tiene roles de seguridad predefinidos separados por área funcional, busca uno vinculado a esos dos
módulos (por ejemplo, un rol orientado a mantenimiento de maestro de producto y a configuración de
inventario/almacén) en vez de asumir un nombre exacto — los nombres de rol de seguridad varían entre
versiones y no todos los ambientes demo traen los mismos roles predefinidos. Si no encuentras un rol
acotado, documenta que usaste un rol amplio (administrador) porque el ambiente no ofrecía uno más
específico — eso también es evidencia válida de auditoría.

### Configuración previa que puede faltar en un trial

- Los **grupos de dimensión de producto/almacenamiento/seguimiento** por defecto del demo data
  Contoso pueden no incluir combinaciones de color+talla ya armadas; es normal tener que crear uno
  nuevo en el Paso 1 en vez de reutilizar uno existente.
- El módulo **Inventory management** requiere que exista al menos un sitio y un almacén antes de que
  la jerarquía de reservas tenga sentido — si tu ambiente no trae ninguno preconfigurado, créalos
  primero aunque el lab no lo liste como paso explícito.
- Algunos ambientes trial no traen la funcionalidad de jerarquía de reservas habilitada por defecto
  (depende de la configuración de "Warehouse management" avanzado vs. básico); si el menú no aparece
  donde se indica, documenta si tu ambiente usa el modelo de almacén básico en vez del avanzado.

### Fallos frecuentes

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece "Dimension and variant groups" en el menú de Product information management | Módulo no habilitado / licencia trial limitada | Revisa en **System administration > Setup > Licensing** o el equivalente si el módulo SCM está activo | Verifica que el trial incluya Supply Chain Management, no solo Finance; si no, documenta el límite |
| Al generar variantes no aparecen las 9 combinaciones esperadas | Grupo de dimensión de producto no incluye ambas dimensiones (color y talla) | Revisa el grupo asignado al producto base en la ficha del producto liberado | Reasigna un grupo de dimensión de producto que incluya color y talla antes de generar variantes |
| No se puede guardar el producto liberado (error de validación) | Permiso insuficiente para escribir en Product information management | Verifica el mensaje de error exacto; suele indicar el objeto de seguridad bloqueado | Solicita o asigna un rol con acceso de escritura a Released products, no solo lectura |
| El menú "Reservation hierarchy" no existe en la ruta indicada | Trial incompleto o versión distinta con navegación diferente | Busca por nombre en la barra de búsqueda global de F&O en vez de navegar por menú | Documenta la ruta real encontrada y sigue el flujo equivalente |
| Solo aparece un sitio/almacén de demo data y no se puede crear uno nuevo | Permiso insuficiente sobre Inventory management > Setup | Intenta abrir el formulario de creación y revisa si los botones están deshabilitados | Solicita acceso de escritura sobre Inventory breakdown, o documenta usando los sitios/almacenes existentes |
| El producto no permite asignar la variante a una orden aunque las 9 combinaciones existen | Dato Contoso faltante: falta activar el producto en la legal entity o el sitio específico | Revisa si el producto está "Released" (liberado) a la legal entity con la que trabajas | Libera el producto explícitamente a la legal entity desde Released products antes de continuar |

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

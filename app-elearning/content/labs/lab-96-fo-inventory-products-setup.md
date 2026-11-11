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
  - "Acceso a un ambiente trial/demo de Dynamics 365 Supply Chain Management con datos demo, o la variante en papel del final del lab"
lastVerified: "2026-11"
---

# Lab 96 — F&O Inventory & Products Setup

## Objetivo

Configurar un producto liberado con variantes, grupos de dimensión y una política de reserva
básica, y explicar cómo estas decisiones afectan la disponibilidad de inventario que verían Ventas
y Compras.

## Nota de verificación (léela antes de empezar)

Las rutas de menú y los botones se contrastaron con Microsoft Learn en noviembre de 2026 (cada paso
enlaza la página usada), pero **no se probaron en un tenant en vivo**. Si un nombre de menú difiere
de tu ambiente, documenta la diferencia y sigue el flujo equivalente.

## ⚠️ Antes de empezar: cómo se consigue hoy un ambiente de F&O

Verificado en Microsoft Learn en noviembre de 2026. Sin un ambiente así, haz la
**variante en papel** del final de este lab; el [Módulo 60](/nivel/d365/modulo/finance-operations-procesos-erp)
cubre además los procesos en general.

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

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-95).

Northwind vende una camiseta técnica en 3 colores y 3 tallas. El equipo de Producto necesita que el
sistema controle inventario por color y talla, y que las reservas sigan una jerarquía definida (sitio
antes que almacén) para evitar prometer inventario que no está físicamente disponible donde se necesita.

## Rol del estudiante

Actúas como F&O Practitioner configurando el maestro de producto y las reglas de inventario.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Supply Chain Management con la compañía `USMF` activa (una
  legal entity recién creada en el Lab 93 no trae sitios, almacenes ni grupos de producto).
- Al menos un sitio y un almacén configurados (usa los del demo data de `USMF`).
- Tiempo: unos 90 minutos de pasos; el resto, para la explicación de disponibilidad.

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

- `USMF` trae el grupo de dimensión de producto **SizeCol** (Size and Color), el que usa Learn para
  crear variantes por talla y color
  ([Learn: Create predefined product variants](https://learn.microsoft.com/dynamics365/supply-chain/pim/tasks/create-predefined-product-variants)).
  Si tu ambiente no lo tiene, crea uno con esas dos dimensiones en el Paso 1.
- El módulo **Inventory management** requiere que exista al menos un sitio y un almacén antes de que
  la jerarquía de reservas tenga sentido — si tu ambiente no trae ninguno preconfigurado, créalos
  primero aunque el lab no lo liste como paso explícito.
- La **jerarquía de reservas** pertenece al módulo **Warehouse management**: Learn indica que la
  funcionalidad de reservas por jerarquía solo se usa con artículos habilitados para procesos de
  warehouse management (WMS)
  ([Learn: Reservations in Warehouse management](https://learn.microsoft.com/dynamics365/supply-chain/warehousing/reservations-in-warehouse-management)).
  Para un producto sin WMS, la jerarquía no interviene; documenta qué modelo usa tu producto.

### Fallos frecuentes

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece "Dimension and variant groups" en el menú de Product information management | El ambiente se creó con una plantilla o licencia que no incluye Supply Chain Management | Busca la página por nombre en la barra de búsqueda de F&O y revisa con qué plantilla se creó el ambiente en el Power Platform admin center | Si el ambiente es solo de Finance, documenta el límite y haz la variante en papel |
| Al generar variantes no aparecen las 9 combinaciones esperadas | Grupo de dimensión de producto no incluye ambas dimensiones (color y talla) | Revisa el grupo asignado al producto base en la ficha del producto liberado | Reasigna un grupo de dimensión de producto que incluya color y talla antes de generar variantes |
| No se puede guardar el producto liberado (error de validación) | Permiso insuficiente para escribir en Product information management | Verifica el mensaje de error exacto; suele indicar el objeto de seguridad bloqueado | Solicita o asigna un rol con acceso de escritura a Released products, no solo lectura |
| El menú "Reservation hierarchy" no aparece en Inventory management | Está en **Warehouse management > Setup > Inventory > Reservation hierarchy**, no en Inventory management | Busca "Reservation hierarchy" en la barra de búsqueda global de F&O | Documenta la ruta real encontrada y sigue el flujo equivalente |
| Solo aparece un sitio/almacén de demo data y no se puede crear uno nuevo | Permiso insuficiente sobre Inventory management > Setup | Intenta abrir el formulario de creación y revisa si los botones están deshabilitados | Solicita acceso de escritura sobre Inventory breakdown, o documenta usando los sitios/almacenes existentes |
| El producto no permite asignar la variante a una orden aunque las 9 combinaciones existen | Dato Contoso faltante: falta activar el producto en la legal entity o el sitio específico | Revisa si el producto está "Released" (liberado) a la legal entity con la que trabajas | Libera el producto explícitamente a la legal entity desde Released products antes de continuar |

## Entregables

- Grupos de dimensión de producto/almacenamiento/seguimiento configurados o documentados.
- Producto liberado con variantes por color y talla (al menos 3x3 = 9 combinaciones).
- Jerarquía de reservas documentada (niveles y qué queda por encima o por debajo de Location).
- Explicación de cómo estas decisiones afectan lo que ve un vendedor al prometer una fecha de entrega.

## Pasos detallados

### Paso 1 — Grupos de dimensión

En **Product information management > Setup > Dimension and variant groups** están las páginas de
grupos de dimensión de producto, de almacenamiento y de seguimiento.

- Revisa un **Storage dimension group** de `USMF` (sitio, almacén, ubicación) y anota si el grupo
  usa procesos de warehouse management.
- Revisa un **Tracking dimension group** (lote, número de serie) — para este producto no necesitas
  seguimiento por serie; documenta por qué.
- Revisa el **Product dimension group** *SizeCol* (o crea uno con talla y color).

### Paso 2 — Producto maestro, variantes y liberación

Learn crea las variantes desde el **producto maestro** compartido y después lo libera a la legal
entity ([Learn: Create predefined product variants](https://learn.microsoft.com/dynamics365/supply-chain/pim/tasks/create-predefined-product-variants)):

1. Ve a **Product information management > Products > Product masters** y selecciona **New**.
   Escribe el número (si no hay secuencia numérica) y el nombre "Camiseta técnica Northwind", y en
   **Product dimension group** elige *SizeCol*. Selecciona **OK**.
2. En el Action Pane, **Product dimensions**: en la pestaña **Size** agrega 3 tallas con **New**, y
   en **Colors**, 3 colores. Guarda y cierra.
3. En el Action Pane, **Product variants** y luego **Variant suggestions**: elige los valores,
   selecciona **Suggest**, marca las 9 combinaciones (o **Select all**) y selecciona **Create**.
4. Libera el producto y sus variantes a `USMF` con **Release products** y completa los campos que te
  pida el producto liberado (grupos de modelo de artículo, de almacenamiento y de seguimiento; Learn
  tiene la guía *Complete basic setup of a released product master*,
  [enlace](https://learn.microsoft.com/dynamics365/supply-chain/pim/tasks/complete-basic-setup-released-product-master)).
5. Documenta cómo el sistema distingue entre "el producto" y "una variante específica" al momento de
   vender o comprar, y en qué página ves las variantes liberadas (**Released product variants**).

### Paso 3 — Sitios, almacenes y jerarquía de reservas

Ve a **Inventory management > Setup > Inventory breakdown > Sites** y a la página **Warehouses** del
mismo menú.

- Documenta al menos 1 sitio de `USMF` con 2 almacenes distintos, y si cada almacén usa procesos de
  warehouse management.
- Ve a **Warehouse management > Setup > Inventory > Reservation hierarchy**
  ([Learn: Flexible warehouse-level dimension reservation policy](https://learn.microsoft.com/dynamics365/supply-chain/warehousing/flexible-warehouse-level-dimension-reservation))
  y documenta una jerarquía existente. Learn describe la jerarquía *Default* con Site, Warehouse,
  Inventory status, Location y License plate, de menos específico (nivel 1) a más específico.
- La decisión real no es el orden sitio-almacén, que va siempre arriba, sino **qué dimensiones quedan
  por encima de Location**. Explica con la tabla de Learn qué cambia si el lote (Batch number) va por
  encima de Location (es un requisito estricto: el operario no puede escoger otro lote) o por debajo
  (lo decide el almacén al hacer el picking) ([Learn: Reservations in Warehouse management](https://learn.microsoft.com/dynamics365/supply-chain/warehousing/reservations-in-warehouse-management)).
- Usa el ejemplo de cálculo de disponibilidad de esa misma página de Learn (10 disponibles en el
  almacén y 12 en la ubicación) para explicar por qué el sistema promete el número menor.

### Paso 4 — Impacto en disponibilidad

Documenta, sin necesariamente ejecutarlo en una orden real:

- Qué vería un vendedor en la ficha de disponibilidad (available to promise) para una variante específica.
- Por qué dos variantes del mismo producto pueden tener disponibilidad distinta aunque el producto base sea el mismo.

## Variante en papel (sin ambiente de F&O)

Si no tienes ambiente, haz el diseño con las páginas de Learn enlazadas en los pasos y escribe
«variante en papel» en tu entrega. Tiempo estimado: 75 minutos.

1. **Grupos:** tabla con los tres grupos (producto, almacenamiento, seguimiento), qué dimensiones
   activa cada uno para la camiseta y por qué no hace falta número de serie.
2. **Variantes:** la matriz 3 tallas x 3 colores con el número de variante que le darías a cada
   combinación, y la secuencia de botones de Learn para crearlas (Product dimensions, Product
   variants, Variant suggestions, Suggest, Create, Release products).
3. **Almacenes y reservas:** un sitio con 2 almacenes; la jerarquía *Default* de Learn con su nivel;
   y tu decisión, justificada, de qué dimensión pondrías por encima o por debajo de Location si la
   camiseta pasara a controlarse por lote.
4. **Disponibilidad:** el ejemplo de cálculo de Learn (10 frente a 12) explicado con tus palabras y
   aplicado a una variante de la camiseta.

La variante en papel cumple los criterios de validación si cada decisión lleva su enlace de Learn;
sustituye a las capturas.

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

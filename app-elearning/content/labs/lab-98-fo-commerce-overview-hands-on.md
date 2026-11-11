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
  - "Acceso a un ambiente trial/demo con el módulo Retail and Commerce habilitado (no todos los trials de Finance/SCM lo incluyen por defecto — verifica en tu ambiente antes de empezar); sin él, haz la variante en papel del final del lab"
lastVerified: "2026-11"
---

# Lab 98 — F&O Commerce Overview Hands-On

## Objetivo

Configurar un canal de venta (tienda online o punto de venta) sobre un producto liberado existente,
documentando el flujo de sincronización entre el catálogo central y el canal, y las diferencias
entre venta unificada (F&O/Commerce) y venta gestionada solo dentro de Dynamics 365 CE.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Commerce, **sin verificación contra un tenant en vivo**. En noviembre de 2026 se revisaron contra
Microsoft Learn los surtidos (assortments), el programa de distribución y sus jobs (enlaces en cada
paso). A diferencia de Finance/SCM, el módulo Retail and Commerce no siempre viene habilitado en un
trial base — si tu ambiente no lo tiene, haz la **variante en papel** en vez de simular pasos que no
puedes ejecutar.

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
- **Commerce es la excepción:** la plantilla **Commerce (Preview)** solo está disponible
  para trials, y Learn indica que los proyectos de Commerce todavía se crean en Lifecycle Services.
  Si tu ambiente se creó con la plantilla de Finance o de Supply Chain Management, comprueba antes
  de empezar si el menú **Retail and Commerce** existe.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-97).

Northwind quiere vender la camiseta técnica configurada en el Lab 96 también a través de una tienda
online, sin duplicar el catálogo de producto ni el inventario.

## Rol del estudiante

Actúas como F&O Practitioner configurando un canal de Commerce sobre el maestro de producto existente.

## Herramientas necesarias

- Ambiente trial/demo con Retail and Commerce habilitado.
- El producto liberado con variantes del Lab 96 (o uno equivalente del demo data), liberado en la
  legal entity del canal: Learn exige que el producto esté liberado a la legal entity del canal
  para que el surtido lo publique.
- Tiempo estimado: 3 horas con ambiente; 75 minutos la variante en papel.

## 🔧 Requisitos de ambiente y fallos frecuentes

### Rol de seguridad mínimo

No uses "System administrator" si tu ambiente permite algo más acotado: la tarea es funcionalmente
de **gestión de canal de venta y catálogo de Commerce** (Retail and Commerce), no de administración
financiera ni de inventario general. Si tu ambiente tiene roles de seguridad separados por área
funcional, busca uno orientado a la configuración de canales/tiendas y al mantenimiento del catálogo
de Commerce, en vez de asumir un nombre exacto de rol — los nombres varían entre versiones y no todos
los ambientes demo traen roles predefinidos para Commerce. Si no encuentras un rol acotado, documenta
que usaste un rol amplio porque el ambiente no ofrecía uno más específico.

### Configuración previa que puede faltar en un trial

**Atención especial aquí**: a diferencia de Finance/SCM, Retail and Commerce casi nunca viene
completamente listo en un trial recién aprovisionado. Antes de asumir que un paso falló por error
tuyo, verifica primero si falta habilitar alguna de estas piezas:

- El **módulo Retail and Commerce en sí** puede no estar habilitado en el trial base de Finance/SCM
  — es una funcionalidad adicional, no siempre incluida. Si no aparece ningún nodo "Retail and
  Commerce" en el menú de navegación, este es tu primer punto de verificación, antes que cualquier
  otro.
- Aunque el módulo esté habilitado, un **canal de venta (online store o retail store) recién creado
  no tiene, por defecto, productos**: crear el canal no basta. Learn asigna productos a canales con
  **surtidos** (assortments), que hay que procesar con el trabajo por lotes **Process assortments**
  y después distribuir al canal
  ([Learn: Assortment management](https://learn.microsoft.com/dynamics365/commerce/assortments)).
- El **job de distribución/sincronización** (Distribution schedule o Commerce Scheduler) puede no
  estar corriendo automáticamente en un ambiente trial — en producción corre en un horario
  programado, pero en demo/trial suele requerir ejecución manual para ver resultados en la misma
  sesión de trabajo.
- La **base de datos del canal (channel database)**, en el modelo de Commerce, es una réplica que se
  actualiza mediante el job de distribución; si nunca corriste ese job, el canal puede aparecer
  vacío aunque el catálogo central sí tenga el producto.

### Fallos frecuentes

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No existe ningún menú "Retail and Commerce" en la navegación | Módulo no habilitado en este trial | Revisa el menú de navegación completo o busca "Retail" en la barra de búsqueda global | Documenta el límite explícitamente como pide la Nota de verificación; no simules pasos que no puedes ejecutar |
| El canal se crea pero no se puede asociar a la legal entity esperada | Trial incompleto: solo una legal entity tiene Commerce habilitado | Revisa en qué legal entity(es) aparece disponible la opción de crear canal | Usa la legal entity donde Commerce sí está disponible y documenta la limitación |
| El producto no aparece en el canal después de asignarlo | Surtido no procesado, producto no liberado a la legal entity del canal o job de distribución no ejecutado | Revisa el surtido, que el producto esté liberado en esa legal entity y el estado del job en **Distribution schedule** | Ejecuta **Process assortments** y después el job **1040** (Products) del programa de distribución |
| El precio cambiado en el catálogo central no se refleja en el canal | Sincronización pendiente (comportamiento esperado, no necesariamente un error) | Verifica la hora de la última ejecución del job de distribución | Ejecuta el job de distribución de nuevo, o documenta la latencia como parte de la respuesta esperada del Paso 2 |
| Error de permisos al intentar crear o editar el canal | Rol insuficiente para Retail and Commerce | Revisa el mensaje de error exacto y el objeto de seguridad bloqueado | Solicita o asigna un rol con acceso de escritura sobre Channel setup |
| No se puede completar ningún paso de este lab | Módulo Commerce no incluido en absoluto en el tipo de trial contratado | Revisa con qué plantilla se creó el ambiente en el Power Platform admin center (la de Commerce es distinta de la de Finance o SCM) o pregunta a quien administre el ambiente demo | Documenta este límite como resultado válido del lab: "ambiente sin Commerce disponible" es evidencia de auditoría, no una tarea sin completar |

## Entregables

- Canal de venta (tienda online u online store) creado y asociado a la legal entity.
- Producto del catálogo central publicado hacia el canal.
- Documentación de la sincronización entre catálogo central y canal (tiempo real vs. programada).
- Tabla comparativa: venta unificada F&O/Commerce vs. venta gestionada solo en Dynamics 365 CE.

## Pasos detallados

### Paso 1 — Canal de venta

Ve a **Retail and Commerce > Channels** y abre **Online stores** (o **Stores > All stores**, si
vas a documentar un punto de venta físico en su lugar; Learn usa la ruta **Retail and Commerce >
Channels > Stores > All stores** en
[Set up a retail channel](https://learn.microsoft.com/dynamics365/commerce/channel-setup-retail)).
Si la ruta de tiendas en línea no coincide, anótala tal como aparece en tu ambiente.

- Crea o documenta un canal con nombre, legal entity asociada y moneda.
- Documenta si el canal comparte el mismo catálogo de productos que la legal entity o si usa un catálogo específico.

### Paso 2 — Publicación de producto al canal

Learn publica productos en un canal con un **surtido** (assortment) que relaciona canales y
productos ([Learn: Assortment management](https://learn.microsoft.com/dynamics365/commerce/assortments)).
La ruta exacta de la página de surtidos no aparece en esa página: búscala por nombre
(**Assortments**) y anótala.

- Crea un surtido que incluya el canal del Paso 1 y el producto del Lab 96 (o uno equivalente) con
  sus variantes, y documenta el precio de venta que tendrá en el canal.
- Ejecuta **Process assortments** y documenta por qué el surtido no surte efecto hasta procesarlo.
- Documenta qué pasa si cambias el precio en el catálogo central: ¿se refleja automáticamente en el canal, o requiere un paso de sincronización explícito?

### Paso 3 — Sincronización canal-catálogo

Ve a **Retail and Commerce > Retail and Commerce IT > Distribution schedule**.

- Ejecuta el job **1070** (Channel configuration) si el canal es nuevo y el **1040** (Products)
  para llevar el producto al canal, y documenta qué datos mueve cada uno.
- Documenta cómo funciona la distribución entre la sede (HQ) y la base de datos del canal
  (channel database), y con qué frecuencia está programado cada job en tu ambiente (anota la que
  veas; esta revisión no confirmó una frecuencia por defecto en Learn).
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
- Crear el surtido y no ejecutar **Process assortments** ni el job 1040.

## Variante en papel (sin Commerce en tu ambiente)

Si no tienes ambiente o tu ambiente no trae Retail and Commerce, diseña la configuración con las
páginas de Learn enlazadas y escribe «variante en papel» en tu entrega. Tiempo estimado: 75 minutos.

1. **Canal:** ficha de la tienda en línea de Northwind (nombre, legal entity, moneda) y por qué el
   producto debe estar liberado en esa legal entity.
2. **Surtido:** qué canal y qué producto/variantes incluye, con fechas de vigencia, y la secuencia
   surtido > **Process assortments** > job **1040**.
3. **Distribución:** diagrama HQ → base de datos del canal con los jobs 1070 y 1040, y qué ve el
   cliente de la tienda si el job falla (razona con la base de datos del canal como réplica).
4. **Comparación con CE:** la tabla del Paso 4 con el mismo producto.

La variante en papel cumple los criterios de validación si cada decisión lleva su enlace de Learn;
sustituye a las capturas.

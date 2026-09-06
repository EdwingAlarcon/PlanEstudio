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
  no tiene, por defecto, un catálogo publicado**: crear el canal no basta, hay que asignarle
  productos y ejecutar al menos un job de publicación/distribución antes de que el canal "vea" el
  producto.
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
| El producto no aparece en el canal después de asignarlo | Catálogo no publicado / job de distribución no ejecutado | Revisa el estado del job en Distribution schedule / Commerce Scheduler | Ejecuta manualmente el job de distribución y vuelve a revisar el canal |
| El precio cambiado en el catálogo central no se refleja en el canal | Sincronización pendiente (comportamiento esperado, no necesariamente un error) | Verifica la hora de la última ejecución del job de distribución | Ejecuta el job de distribución de nuevo, o documenta la latencia como parte de la respuesta esperada del Paso 2 |
| Error de permisos al intentar crear o editar el canal | Rol insuficiente para Retail and Commerce | Revisa el mensaje de error exacto y el objeto de seguridad bloqueado | Solicita o asigna un rol con acceso de escritura sobre Channel setup |
| No se puede completar ningún paso de este lab | Módulo Commerce no incluido en absoluto en el tipo de trial contratado | Confirma con la documentación de tu proveedor de trial (LCS, Dynamics 365 free trial) qué módulos incluye | Documenta este límite como resultado válido del lab: "ambiente sin Commerce disponible" es evidencia de auditoría, no una tarea sin completar |

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

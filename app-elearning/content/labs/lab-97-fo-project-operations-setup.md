---
id: lab-97
title: "F&O Project Operations Setup"
level: "N4"
duration: 180
product: ["Dynamics 365 Project Operations", "Dynamics 365 Finance"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Lab 93 completado: F&O Finance Setup Walkthrough"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Project Operations; sin él, haz la variante en papel del final del lab"
lastVerified: "2026-11"
---

# Lab 97 — F&O Project Operations Setup

## Objetivo

Configurar un proyecto de tipo tiempo y materiales con una estructura de desglose de trabajo (WBS)
y una regla de facturación por hito, y documentar el flujo desde el registro de horas hasta la
factura al cliente.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Project Operations, **sin verificación contra un tenant en vivo**. En noviembre de 2026 se
revisaron contra Microsoft Learn el trial, los tipos de despliegue y los tipos de regla de
facturación (enlaces en cada paso); las rutas de menú que Learn no muestra se marcan como "búscalo
por nombre". Si un nombre difiere de tu ambiente, documenta la diferencia y sigue el flujo
equivalente.

**Lo primero: identifica tu tipo de despliegue.** Learn describe Project Operations *Core*,
*Integrated with ERP* (recursos/no almacenados, con finance and operations) y el escenario de
manufactura (almacenados)
([Learn: Sign up for Project Operations trials](https://learn.microsoft.com/dynamics365/project-operations/environment/admin-trials)).
Los pasos cambian de aplicación según el tipo:

| Tipo | Dónde creas el contrato y el proyecto | Dónde se contabiliza y factura |
|---|---|---|
| Integrated with ERP (recursos/no almacenados) | Aplicación de Project Operations en Dataverse (**Sales > Project contracts**) | Finance and operations |
| Manufactura/almacenados o Project management and accounting (PMA) | **Project management and accounting** en finance and operations | Finance and operations |
| Core | Solo Dataverse | No aplica a este lab (no hay finance and operations) |

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
- **Project Operations tiene su propio trial:** lo canjea el administrador del tenant
  ([Learn: Sign up for Project Operations trials](https://learn.microsoft.com/dynamics365/project-operations/environment/admin-trials)):
  dura 30 días con una extensión de 30, se canjea una vez por tenant y crea hasta 3 ambientes; un
  cuestionario elige el escenario (Core, materiales no almacenados o almacenados) y solo trae datos
  de configuración, no transacciones. Para este lab necesitas un escenario con finance and
  operations (no Project Operations Core). En el escenario de almacenados los datos de
  configuración están en la compañía `USSI`, no en `USMF`: cambia la compañía activa antes de
  buscar clientes o grupos de proyecto.

## Escenario de negocio

**Empresa ficticia:** Northwind Consulting Services (unidad de servicios de Northwind Manufacturing).

Northwind Consulting fue contratada para un proyecto de implementación de 3 meses, facturable por
tiempo y materiales con un hito de anticipo. El equipo de Project Operations necesita la estructura
lista antes de que los consultores empiecen a registrar horas.

## Rol del estudiante

Actúas como F&O Practitioner configurando la estructura de proyecto y facturación.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Project Operations con finance and operations.
- Un cliente de prueba existente en el ambiente. El trial no trae transacciones: el registro de
  horas y la propuesta de factura los generas tú.
- Tiempo estimado: 3 horas con ambiente; 90 minutos la variante en papel.

## 🔧 Requisitos de ambiente y fallos frecuentes

### Rol de seguridad mínimo

No uses "System administrator" si tu ambiente permite algo más acotado: la tarea es funcionalmente
de **gestión de proyectos y facturación de proyecto** (Project management and accounting), no de
administración financiera general. Si tu ambiente tiene roles de seguridad separados por área
funcional, busca uno orientado a la creación/gestión de proyectos y a la generación de propuestas de
factura, en vez de asumir un nombre exacto de rol — los nombres varían entre versiones y entre la
variante de Project Operations "for resource/non-stocked scenarios" y la variante completa con SCM.
Si no encuentras un rol acotado, documenta que usaste un rol amplio porque el ambiente no ofrecía uno
más específico.

### Configuración previa que puede faltar en un trial

- El módulo **Project management and accounting** requiere que exista al menos un **grupo de
  proyecto** (project group) configurado con las reglas de contabilización antes de poder crear un
  proyecto de tiempo y materiales — si el trial no trae uno, hay que crearlo o documentar que se usó
  uno existente del demo data.
- Las **reglas de facturación** (billing rules) a veces dependen de parámetros de Project management
  and accounting sin inicializar en un trial recién aprovisionado (p. ej. categorías de hora/gasto
  facturables); si el paso 3 no ofrece las opciones esperadas, revisa **Project management and
  accounting > Setup** antes de asumir que el paso está mal descrito.
- Project Operations tiene varios tipos de despliegue (tabla de la nota de verificación) que
  cambian en qué aplicación trabajas; documenta cuál trae tu ambiente.
- En PMA, el **tipo de proyecto** no se puede cambiar después de crear el proyecto
  ([Learn: Project contracts](https://learn.microsoft.com/dynamics365/project-operations/prod-pma/project-contracts)):
  elige el correcto antes de guardar.

### Fallos frecuentes

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece la opción "Time and material" al crear el proyecto | Módulo no habilitado o grupo de proyecto sin ese tipo configurado | Revisa **Project management and accounting > Setup > Project groups** | Crea o ajusta un grupo de proyecto que soporte tiempo y materiales antes de crear el proyecto |
| No se puede seleccionar el cliente de prueba en el contrato de proyecto | Dato Contoso faltante: cliente no configurado como cuenta facturable en la legal entity actual | Verifica que el cliente exista en **Accounts receivable > Customers** de esa legal entity | Crea o activa el cliente en la legal entity correcta antes de continuar |
| La WBS no permite marcar tareas como facturables/no facturables | Permiso insuficiente sobre Project management and accounting | Revisa si los campos aparecen deshabilitados (solo lectura) en el formulario | Solicita un rol con acceso de escritura sobre Projects, no solo de consulta |
| No aparece "Billing rules" ni "Invoice proposals" en el menú esperado | Tipo de despliegue distinto (en Integrated with ERP el contrato vive en Dataverse) | Busca por nombre en la barra de búsqueda global de F&O y revisa la tabla de tipos de despliegue | Documenta la ruta real encontrada; el concepto (regla de facturación por hito vs. por tiempo) es el mismo aunque el menú cambie |
| El hito de anticipo no aparece en la propuesta de factura | El hito no está marcado como completado | Abre la regla de facturación por hito y revisa el estado del hito | Learn exige marcar el hito como completado antes de facturarlo; márcalo y vuelve a generar la propuesta |
| El registro de horas no aparece en la propuesta de factura | Tarea marcada como no facturable, o el registro está pendiente de aprobación | Revisa el estado del registro de horas (timesheet) y si requiere aprobación previa | Aprueba el registro de horas o corrige la tarea a facturable antes de generar la propuesta |

## Entregables

- Contrato de proyecto y proyecto creados, con tipo de facturación documentado.
- WBS con al menos 3 tareas y sus estimaciones.
- Regla de facturación con al menos 1 hito de anticipo y facturación por tiempo del resto.
- Registro de horas de prueba y su relación con la propuesta de factura.

## Pasos detallados

### Paso 1 — Contrato de proyecto y proyecto

Según tu tipo de despliegue (tabla de la nota de verificación):

- **Integrated with ERP:** en la aplicación de Project Operations, **Sales > Project contracts**, crea
  el contrato con el cliente y después el proyecto asociado.
- **PMA (manufactura/almacenados):** en **Project management and accounting > Projects > All
  projects** crea el **Project contract** con su **Project** asociado.

- Selecciona el cliente y define el tipo de proyecto como "Tiempo y materiales" (Time and material);
  en PMA no podrás cambiarlo después.
- Documenta la diferencia entre contrato de proyecto (relación comercial con el cliente) y proyecto
  (unidad de ejecución y seguimiento de costos).

### Paso 2 — WBS (estructura de desglose de trabajo)

Desde el proyecto, ve a **Plan > Work breakdown structure**.

- Define al menos 3 tareas (p. ej. "Discovery", "Configuración", "Go-live y soporte").
- Asigna una estimación de horas a cada tarea.
- Documenta si las tareas son facturables o no, y por qué esa distinción importa para el cliente.

### Paso 3 — Regla de facturación

En PMA, las reglas de facturación se definen en el contrato de proyecto. Learn enumera los tipos
*Unit of delivery*, *Progress*, *Milestone*, *Fee* y *Time and material*
([Learn: Project contracts](https://learn.microsoft.com/dynamics365/project-operations/prod-pma/project-contracts)).
La ruta exacta del botón no aparece en esa página: búscalo por nombre (**Billing rules**) desde el
contrato y anota dónde lo encontraste. En Integrated with ERP, la facturación se define en las
líneas del contrato en Dataverse; esta revisión no abrió esa página de Learn, así que documenta los
campos que veas.

- Define un hito de anticipo (tipo *Milestone*, p. ej. 20% al inicio del proyecto).
- Define que el resto de las horas se facture por *Time and material* según el registro real.
- Documenta cómo el sistema distingue entre el monto del hito (fijo) y el monto por horas
  (variable, depende del registro), y que el hito solo se factura después de marcarlo como completado.

### Paso 4 — Registro de horas y propuesta de factura

Registra tiempo de prueba contra una de las tareas de la WBS (timesheet o registro de horas del
proyecto; la ruta depende del tipo de despliegue: búscala por nombre y anótala), marca como
completado el hito de anticipo y genera una **propuesta de factura** (invoice proposal); Learn
indica que la propuesta se genera a partir de las reglas de facturación.

- Documenta cómo aparece el hito de anticipo en la propuesta vs. cómo aparecen las horas registradas.
- Explica qué pasaría si un consultor registra horas contra una tarea marcada como no facturable.

## Criterios de validación

- [ ] El contrato de proyecto y el proyecto están creados con tipo de facturación documentado.
- [ ] La WBS tiene al menos 3 tareas con estimación de horas y estado facturable/no facturable.
- [ ] La regla de facturación combina al menos un hito fijo y facturación por tiempo.
- [ ] Hay un registro de horas de prueba y su relación con la propuesta de factura está documentada.
- [ ] La explicación distingue claramente monto fijo (hito) de monto variable (horas).

## Rúbrica

| Criterio | Peso |
|---|---|
| Contrato de proyecto y proyecto | 15% |
| WBS | 25% |
| Regla de facturación | 30% |
| Registro de horas y propuesta de factura | 20% |
| Documentación de decisiones | 10% |

## Errores comunes

- Confundir contrato de proyecto (relación comercial) con proyecto (ejecución).
- Marcar todas las tareas como facturables sin distinguir trabajo interno de trabajo para el cliente.
- No probar qué pasa cuando se registran horas contra una tarea no facturable.
- Definir el hito de anticipo como parte de la facturación por tiempo en vez de como un monto fijo independiente.
- Generar la propuesta sin marcar el hito como completado y concluir que la regla no funciona.

## Variante en papel (sin ambiente de Project Operations)

Si no tienes ambiente, diseña la configuración con las páginas de Learn enlazadas y escribe
«variante en papel» en tu entrega. Tiempo estimado: 90 minutos.

1. **Tipo de despliegue:** elige Integrated with ERP o PMA para Northwind Consulting y justifica la
   elección con la tabla de la nota de verificación.
2. **Contrato y proyecto:** ficha del contrato (cliente, moneda, tipo de proyecto) y del proyecto,
   con la diferencia entre ambos.
3. **WBS:** tabla con 3 tareas, horas estimadas y facturable/no facturable con su motivo.
4. **Facturación:** las dos reglas (*Milestone* 20% y *Time and material*), y un ejemplo numérico:
   tarifa por hora, 40 horas registradas y el monto del hito; muestra qué líneas tendría la propuesta
   de factura antes y después de marcar el hito como completado.
5. **Caso no facturable:** qué pasa con 5 horas registradas contra una tarea interna.

La variante en papel cumple los criterios de validación si cada decisión lleva su enlace de Learn;
sustituye a las capturas.

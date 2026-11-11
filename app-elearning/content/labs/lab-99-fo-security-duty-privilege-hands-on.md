---
id: lab-99
title: "F&O Security — Duty/Privilege Hands-On"
level: "N4"
duration: 180
product: ["Dynamics 365 Finance", "Dynamics 365 Supply Chain Management", "Security Configuration"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Lab 93 completado: F&O Finance Setup Walkthrough"
  - "Módulo 36 estudiado: Seguridad y Cumplimiento Enterprise (modelo de seguridad Dataverse, para comparar)"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Finance & Supply Chain Management con permisos de administrador de seguridad"
lastVerified: "2026-11"
---

# Lab 99 — F&O Security — Duty/Privilege Hands-On

## Objetivo

Diseñar y configurar un rol de seguridad F&O combinando duties y privileges existentes, asignarlo a
un usuario de prueba, y detectar un conflicto de segregación de funciones (SoD) — explicando la
jerarquía Role > Duty > Privilege > Permission y cómo difiere del modelo de seguridad de Dataverse.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Finance/SCM, **sin verificación contra un tenant en vivo al momento de escribirse**. El modelo de
seguridad F&O tiene su propia jerarquía, distinta de los security roles de Dataverse — no asumas que
los conceptos de Módulo 36 se transfieren 1:1.

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

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-98).

El equipo de auditoría interna pidió revisar los roles de seguridad de Cuentas por Pagar. Encontraron
que un mismo usuario puede crear una orden de compra Y aprobar su pago — un conflicto de segregación
de funciones clásico. Tu tarea es diseñar un modelo de roles que lo evite.

## Rol del estudiante

Actúas como F&O Practitioner responsable del modelo de seguridad de Cuentas por Pagar.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Finance/SCM con permisos de administrador de seguridad.

## 🔧 Requisitos de ambiente y fallos frecuentes

**Rol de seguridad mínimo**

Para diseñar y asignar roles necesitas acceso de escritura a **System administration > Security**
(crear/editar roles de seguridad y asignarlos a usuarios), no solo poder ver el formulario. En un
ambiente trial de un solo usuario tu cuenta suele traer ya ese acceso; en un ambiente compartido o un
tenant corporativo, pide específicamente permiso de administración de seguridad ("Security
administrator" o equivalente en tu demo) en vez de tu rol funcional habitual de Cuentas por Pagar —
el usuario que diseña roles no necesariamente es el mismo que los usa día a día.

**Configuración previa que puede faltar en un trial**

- Crear un "usuario de prueba" nuevo en un ambiente demo requiere una licencia/asiento disponible en
  el tenant — un trial de un solo usuario puede no tener cupo para un segundo usuario real; si es tu
  caso, documenta la asignación de rol sobre tu propio usuario (quitando y volviendo a poner el rol)
  en vez de crear un usuario adicional, y dilo explícitamente en tu evidencia.
- El motor de **Segregation of duties** puede no estar configurado con reglas de conflicto
  precargadas en un ambiente demo nuevo — es común que el menú exista pero no tenga ninguna regla de
  SoD activa, lo cual no es un error tuyo sino un estado por defecto del trial.
- Los cambios de asignación de rol de seguridad no siempre son inmediatos: puede requerir que el
  usuario afectado cierre sesión y vuelva a entrar, o que se ejecute un batch job de sincronización de
  seguridad, antes de que el nuevo rol tenga efecto visible.

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No puedo crear ni editar roles de seguridad en Security configuration | Permiso insuficiente: el usuario no tiene rol de administración de seguridad | Revisa tus propios roles asignados en **System administration > Users > Users** | Solicita al administrador del ambiente un rol con acceso de escritura a Security configuration |
| No hay opción para crear un usuario de prueba nuevo | Trial incompleto: sin licencia/asiento disponible en el tenant | Ve a **System administration > Users > Users > New** y revisa si el formulario permite guardar | Usa tu propio usuario para probar la asignación de rol (documentando este límite) en vez de crear uno nuevo |
| Segregation of duties no muestra ninguna regla de conflicto | Sin reglas creadas en el trial: las reglas las define el administrador | Ve a **System administration > Security > Segregation of duties > Segregation of duties rules** y verifica si hay reglas listadas | Documenta la ausencia de reglas como límite del ambiente y describe manualmente el conflicto (AP Clerk + AP Approver en el mismo usuario) como evidencia sustituta |
| El usuario de prueba no ve el cambio de rol recién asignado | Falta de refresh de caché de seguridad o sesión activa desde antes de la asignación | Pide al usuario de prueba (o tú mismo) cerrar sesión completamente y volver a entrar | Cierra sesión, espera unos minutos y vuelve a entrar antes de descartar el paso como fallido |
| No aparece la duty de aprobación de pago al armar el rol AP Approver | Duty renombrada o reorganizada entre release waves | Busca por palabra clave parcial (p. ej. "approv" o "payment") en el buscador de Security configuration en vez del nombre exacto documentado | Usa el nombre de duty equivalente que encuentres en tu versión y documenta la diferencia como parte de la evidencia |

## Entregables

- Documentación de la jerarquía Role > Duty > Privilege > Permission con un ejemplo real del ambiente.
- Un rol de seguridad nuevo (o documentado) para "AP Clerk" (crea órdenes de compra, no aprueba pagos).
- Un rol de seguridad nuevo (o documentado) para "AP Approver" (aprueba pagos, no crea órdenes de compra).
- Evidencia de una verificación de segregación de funciones (SoD) entre ambos roles.
- Tabla comparativa: modelo de seguridad F&O vs. modelo de seguridad Dataverse (Módulo 36).

## Pasos detallados

### Paso 1 — Jerarquía de seguridad

Ve a **System administration > Security > Security configuration**.

- Explora un rol de seguridad existente (p. ej. "Accounts payable clerk") y documenta su jerarquía:
  qué duties incluye, y dentro de una duty, qué privileges y permissions concretos otorga.
- Documenta con tus propias palabras la diferencia entre duty (agrupación funcional, p. ej. "Maintain
  vendor invoices") y privilege (acción concreta sobre un objeto, p. ej. "Post vendor invoice").

### Paso 2 — Diseño de los dos roles

Diseña (o crea, si tu ambiente lo permite sin afectar roles estándar) dos roles:

- **AP Clerk**: incluye duties para crear órdenes de compra y registrar facturas de proveedor, pero
  **no** incluye la duty de aprobación de pago.
- **AP Approver**: incluye la duty de aprobación de pago, pero **no** incluye duties de creación de
  orden de compra.

Documenta qué duties/privileges específicos asignaste a cada uno.

### Paso 3 — Asignación y prueba

Ve a **System administration > Security > Assign users to roles** (también puedes abrir el usuario
en **System administration > Users > Users** y usar **Assign roles**). En el árbol, selecciona el
rol y luego **Manually assign / exclude users** > **Assign to role**
([Learn: Assign users to security roles](https://learn.microsoft.com/dynamics365/fin-ops-core/fin-ops/sysadmin/assign-users-security-roles)).

- Asigna el rol "AP Clerk" a un usuario de prueba.
- Documenta qué menús/acciones ve ese usuario después de la asignación, comparado con antes.
- Explica qué pasaría si ese usuario intentara aprobar un pago sin tener el rol "AP Approver".

### Paso 4 — Segregación de funciones (SoD)

Ve a **System administration > Security > Segregation of duties > Segregation of duties rules**
y crea una regla que separe la duty de crear órdenes de compra de la de aprobar pagos. Después usa
**Validate duties and roles**; para las asignaciones que ya existen,
**System administration > Security > Segregation of duties > Verify compliance of user-role
assignments**, y revisa el resultado en **Segregation of duties unresolved conflicts**. Learn indica
que, con la regla activa, asignar a un usuario roles con duties en conflicto da un error que hay que
resolver con **Deny assignment** o **Allow assignment** (este último exige un motivo)
([Learn: Identify and resolve conflicts in segregation of duties](https://learn.microsoft.com/dynamics365/fin-ops-core/fin-ops/sysadmin/identify-resolve-conflicts-segregation-duties)).

- Documenta cómo el sistema detecta o previene que un mismo usuario tenga ambos roles asignados
  simultáneamente (o cómo lo detectarías manualmente si tu ambiente no tiene el motor de SoD habilitado).
- Explica qué proceso de negocio seguiría el equipo si, por necesidad operativa temporal, un usuario
  necesitara ambos roles (aprobación de excepción, monitoreo compensatorio).

### Paso 5 — Comparación con Dataverse

Documenta, con el ejemplo de Cuentas por Pagar:

- Cómo se vería el mismo problema de segregación de funciones modelado con security roles y business
  units de Dataverse (Módulo 36).
- Qué concepto de F&O (duty) no tiene un equivalente directo en el modelo de Dataverse.

## Criterios de validación

- [ ] La jerarquía Role > Duty > Privilege > Permission está documentada con un ejemplo real.
- [ ] Los roles AP Clerk y AP Approver están diseñados sin superposición de la duty de aprobación de pago.
- [ ] La asignación de rol y su efecto sobre el usuario de prueba están documentados.
- [ ] Hay evidencia de verificación de SoD (automática o manual) entre ambos roles.
- [ ] La comparación con Dataverse identifica al menos 1 concepto sin equivalente directo.

## Rúbrica

| Criterio | Peso |
|---|---|
| Jerarquía de seguridad documentada | 20% |
| Diseño de roles sin superposición de SoD | 30% |
| Asignación y prueba | 20% |
| Verificación de SoD | 20% |
| Comparación con Dataverse | 10% |

## Errores comunes

- Asignar la duty de aprobación de pago al mismo rol que crea órdenes de compra, recreando el conflicto original.
- Confundir "privilege" (acción concreta) con "duty" (agrupación funcional) al documentar la jerarquía.
- Asumir que el modelo de seguridad de Dataverse (roles, business units, field security) es intercambiable con el de F&O.
- No documentar qué pasaría operativamente si un usuario necesita legítimamente una excepción temporal a la segregación de funciones.

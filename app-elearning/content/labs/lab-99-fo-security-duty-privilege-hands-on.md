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

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-98).

El equipo de auditoría interna pidió revisar los roles de seguridad de Cuentas por Pagar. Encontraron
que un mismo usuario puede crear una orden de compra Y aprobar su pago — un conflicto de segregación
de funciones clásico. Tu tarea es diseñar un modelo de roles que lo evite.

## Rol del estudiante

Actúas como F&O Practitioner responsable del modelo de seguridad de Cuentas por Pagar.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Finance/SCM con permisos de administrador de seguridad.

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

Ve a **System administration > Users > Assign roles**.

- Asigna el rol "AP Clerk" a un usuario de prueba.
- Documenta qué menús/acciones ve ese usuario después de la asignación, comparado con antes.
- Explica qué pasaría si ese usuario intentara aprobar un pago sin tener el rol "AP Approver".

### Paso 4 — Segregación de funciones (SoD)

Ve a **System administration > Security > Segregation of duties** (o el equivalente en tu versión).

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

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
  - "Módulo 60 estudiado: F&O Awareness — Procesos ERP, Virtual Tables y Vocabulario Estándar"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Project Operations"
---

# Lab 97 — F&O Project Operations Setup

## Objetivo

Configurar un proyecto de tipo tiempo y materiales con una estructura de desglose de trabajo (WBS)
y una regla de facturación por hito, y documentar el flujo desde el registro de horas hasta la
factura al cliente.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Project Operations, **sin verificación contra un tenant en vivo al momento de escribirse**. Si un
nombre de menú difiere de tu ambiente (Project Operations tiene una variante "for resource/non-stocked
scenarios" con menús distintos a la variante completa con SCM), documenta la diferencia y sigue el
flujo equivalente.

## Escenario de negocio

**Empresa ficticia:** Northwind Consulting Services (unidad de servicios de Northwind Manufacturing).

Northwind Consulting fue contratada para un proyecto de implementación de 3 meses, facturable por
tiempo y materiales con un hito de anticipo. El equipo de Project Operations necesita la estructura
lista antes de que los consultores empiecen a registrar horas.

## Rol del estudiante

Actúas como F&O Practitioner configurando la estructura de proyecto y facturación.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Project Operations.
- Un cliente de prueba existente en el ambiente.

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
- Project Operations tiene dos variantes de despliegue (con y sin SCM) que cambian nombres de menú y
  disponibilidad de ciertas funciones (como WBS avanzada); documenta cuál variante trae tu ambiente
  si notas menús distintos a los descritos.

### Fallos frecuentes

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece la opción "Time and material" al crear el proyecto | Módulo no habilitado o grupo de proyecto sin ese tipo configurado | Revisa **Project management and accounting > Setup > Project groups** | Crea o ajusta un grupo de proyecto que soporte tiempo y materiales antes de crear el proyecto |
| No se puede seleccionar el cliente de prueba en el contrato de proyecto | Dato Contoso faltante: cliente no configurado como cuenta facturable en la legal entity actual | Verifica que el cliente exista en **Accounts receivable > Customers** de esa legal entity | Crea o activa el cliente en la legal entity correcta antes de continuar |
| La WBS no permite marcar tareas como facturables/no facturables | Permiso insuficiente sobre Project management and accounting | Revisa si los campos aparecen deshabilitados (solo lectura) en el formulario | Solicita un rol con acceso de escritura sobre Projects, no solo de consulta |
| No aparece "Billing rules" ni "Invoice proposals" en el menú esperado | Trial incompleto o variante de Project Operations distinta (con/sin SCM) | Busca por nombre en la barra de búsqueda global de F&O | Documenta la ruta real encontrada; el concepto (regla de facturación por hito vs. por tiempo) es el mismo aunque el menú cambie |
| El registro de horas no aparece en la propuesta de factura | Tarea marcada como no facturable, o el registro está pendiente de aprobación | Revisa el estado del registro de horas (timesheet) y si requiere aprobación previa | Aprueba el registro de horas o corrige la tarea a facturable antes de generar la propuesta |

## Entregables

- Contrato de proyecto y proyecto creados, con tipo de facturación documentado.
- WBS con al menos 3 tareas y sus estimaciones.
- Regla de facturación con al menos 1 hito de anticipo y facturación por tiempo del resto.
- Registro de horas de prueba y su relación con la propuesta de factura.

## Pasos detallados

### Paso 1 — Contrato de proyecto y proyecto

Ve a **Project management and accounting > Projects > All projects** (o el módulo de Project
Operations equivalente en tu ambiente) y crea un **Project contract** con su **Project** asociado.

- Selecciona el cliente y define el tipo de proyecto como "Tiempo y materiales" (Time and material).
- Documenta la diferencia entre contrato de proyecto (relación comercial con el cliente) y proyecto
  (unidad de ejecución y seguimiento de costos).

### Paso 2 — WBS (estructura de desglose de trabajo)

Desde el proyecto, ve a **Plan > Work breakdown structure**.

- Define al menos 3 tareas (p. ej. "Discovery", "Configuración", "Go-live y soporte").
- Asigna una estimación de horas a cada tarea.
- Documenta si las tareas son facturables o no, y por qué esa distinción importa para el cliente.

### Paso 3 — Regla de facturación

Ve a **Manage > Billing rules** (o **Invoice proposals**, según la variante de tu ambiente).

- Define un hito de anticipo (p. ej. 20% al inicio del proyecto, facturable de una sola vez).
- Define que el resto de las horas se facture por tiempo y materiales según el registro real.
- Documenta cómo el sistema distingue entre el monto del hito (fijo) y el monto por horas (variable, depende del registro).

### Paso 4 — Registro de horas y propuesta de factura

Registra tiempo de prueba contra una de las tareas de la WBS (timesheet o registro de horas del
proyecto), y genera una **propuesta de factura** (invoice proposal).

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

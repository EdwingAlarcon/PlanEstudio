---
id: lab-93
title: "F&O Finance Setup Walkthrough"
level: "N4"
duration: 240
product: ["Dynamics 365 Finance", "Legal Entities", "Chart of Accounts", "Financial Dimensions"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Módulo 60 estudiado: F&O Awareness — Procesos ERP, Virtual Tables y Vocabulario Estándar"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Finance & Supply Chain Management (LCS demo environment con datos Contoso, o Dynamics 365 free trial)"
  - "Sin ese ambiente, este lab no es ejecutable — es el primer requisito, no un detalle opcional"
---

# Lab 93 — F&O Finance Setup Walkthrough

## Objetivo

Configurar, en un ambiente real de Dynamics 365 Finance (trial/demo), los fundamentos financieros
de una legal entity nueva: entidad legal, calendario fiscal, catálogo de cuentas y dimensiones
financieras — como haría un F&O Practitioner en el arranque de una implementación.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y los pasos de este lab están escritos con base en la terminología documentada
de Dynamics 365 Finance. **No fueron verificados contra un tenant en vivo al momento de escribirse.**
Microsoft cambia nombres de menú y flujos entre release waves. Si un paso no coincide exactamente
con lo que ves en tu ambiente, es más probable que sea un cambio de versión que un error tuyo —
documenta la diferencia como parte de tu evidencia y sigue el flujo equivalente en tu entorno. Si
tienes mentor o comunidad, valida los pasos con ellos la primera vez que ejecutes este lab.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM.

Northwind está implementando Dynamics 365 Finance para su operación en México. Necesitas dejar
lista la base financiera antes de que cualquier otro equipo (Procurement, Sales, Project) pueda
trabajar: una legal entity, un calendario fiscal, un catálogo de cuentas y las dimensiones
financieras que usará toda la organización.

## Rol del estudiante

Actúas como F&O Practitioner responsable del setup financiero inicial de una implementación.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Finance & Supply Chain Management con datos Contoso.
- Acceso con rol de administrador del sistema o "System administrator" en ese ambiente.

## 🔧 Requisitos de ambiente y fallos frecuentes

**Rol de seguridad mínimo**

Este lab configura estructuras maestras (legal entity, calendario fiscal, catálogo de cuentas,
dimensiones), no transacciones diarias. Ese tipo de configuración suele reservarse a roles con
responsabilidad de administración financiera — no necesitas literalmente "System administrator" del
tenant si tu ambiente ya trae uno más acotado con acceso de escritura a General ledger y Organization
administration (por ejemplo, un rol de tipo "Financial controller" o equivalente en tu demo). En un
ambiente trial de un solo usuario esta distinción no se nota porque tu cuenta suele tener todos los
roles asignados; en un ambiente compartido con varios estudiantes o en un tenant corporativo, pide
específicamente acceso de escritura a **General ledger**, **Organization administration** y **Chart
of accounts** en vez de asumir que necesitas administrador global.

**Configuración previa que puede faltar en un trial**

- El módulo **General ledger** puede no estar completamente inicializado en un ambiente trial nuevo:
  algunos parámetros de módulo (**General ledger > Ledger setup > General ledger parameters**) tienen
  valores por defecto que conviene revisar antes de crear el calendario fiscal.
- Un demo LCS recién aprovisionado a veces tarda varios minutos (o requiere un refresh de caché de
  seguridad) en reflejar roles recién asignados — si un menú no aparece, no asumas que no existe:
  cierra sesión y vuelve a entrar antes de descartar el paso.
- Los ambientes trial de Dynamics 365 Finance tienen fecha de expiración corta (usualmente 30 días);
  si el catálogo de cuentas o la legal entity demo lucen incompletos, puede ser un trial cerca de
  expirar con funciones limitadas en vez de un error tuyo.

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece la opción "New" en Legal entities | Permiso insuficiente en Organization administration | Revisa qué roles de seguridad tiene tu usuario en **System administration > Security > Users** | Solicita al administrador del ambiente un rol con escritura en Organization administration, o documenta la legal entity demo existente en su lugar |
| El menú General ledger aparece vacío o sin parámetros | Módulo no habilitado o sin inicializar en el trial | Ve a **General ledger > Ledger setup > General ledger parameters** y verifica si carga valores | Espera a que el ambiente demo termine su aprovisionamiento (puede tardar horas tras crearlo) o solicita un ambiente demo distinto con datos Contoso completos |
| No se puede guardar el calendario fiscal | Trial incompleto: calendario base no generado | Revisa si existe algún calendario fiscal preexistente en **Fiscal calendars** antes de crear uno nuevo | Usa el calendario fiscal demo existente y documenta su estructura en vez de crear uno desde cero |
| Las cuentas principales no muestran agrupación por tipo | Dato Contoso faltante o catálogo de cuentas vacío | Ve a **Chart of accounts > Accounts > Main accounts** y filtra por tipo de cuenta | Cambia a la legal entity demo `USMF` o `DEMF`, que sí trae catálogo de cuentas Contoso precargado |
| Cambios en dimensiones financieras no se reflejan en los formularios | Falta ejecutar el proceso de actualización de dimensiones financieras | Revisa si hay un batch job pendiente relacionado con "Financial dimensions" | Ejecuta manualmente la actualización/publicación de dimensiones si tu versión del ambiente lo requiere, y documenta el tiempo de espera |

## Entregables

- Legal entity nueva configurada (o documentada si usas una legal entity demo existente).
- Calendario fiscal con al menos 4 períodos.
- Catálogo de cuentas con al menos 10 cuentas principales agrupadas por tipo.
- Al menos 2 dimensiones financieras definidas (p. ej. departamento y centro de costo).
- Capturas de pantalla de cada paso completado.

## Pasos detallados

### Paso 1 — Legal entity

Ve a **Organization administration > Organizations > Legal entities > New**.

Documenta:

- Nombre de la legal entity y código (p. ej. `NWLA` para Northwind LATAM).
- País/región y moneda de reporte.
- Dirección principal.

Si tu ambiente demo ya trae una legal entity (`USMF`, `DEMF`), documenta su configuración en vez de
crear una nueva — el objetivo es entender la estructura, no duplicar entidades demo.

### Paso 2 — Calendario fiscal

Ve a **General ledger > Ledger setup > Fiscal calendars**.

- Crea o revisa un calendario fiscal con años y períodos.
- Documenta cuántos períodos tiene un año fiscal y si coincide con el año calendario.
- Explica qué pasa si intentas contabilizar una transacción en un período cerrado.

### Paso 3 — Catálogo de cuentas y ledger

Ve a **General ledger > Chart of accounts > Charts of accounts** para el catálogo, y
**General ledger > Chart of accounts > Accounts > Main accounts** para las cuentas principales.

- Documenta al menos 10 cuentas agrupadas por tipo: Activo, Pasivo, Capital, Ingreso, Gasto.
- Ve a **General ledger > Ledger setup > Ledger** y documenta cómo se asocia el catálogo de cuentas,
  el calendario fiscal y la moneda de contabilización a la legal entity.

### Paso 4 — Dimensiones financieras

Ve a **General ledger > Chart of accounts > Dimensions > Financial dimensions**.

- Define al menos 2 dimensiones (p. ej. `Departamento`, `CentroCosto`).
- Documenta si son de tipo cuenta financiera fija o dimensión personalizada con valores propios.
- Explica, con un ejemplo concreto, por qué una organización usaría dimensiones en vez de crear una
  cuenta contable distinta para cada departamento.

## Criterios de validación

- [ ] La legal entity está documentada con nombre, código, país y moneda.
- [ ] El calendario fiscal tiene al menos 4 períodos documentados.
- [ ] El catálogo de cuentas tiene al menos 10 cuentas agrupadas por tipo.
- [ ] El ledger conecta catálogo de cuentas, calendario fiscal y legal entity.
- [ ] Hay al menos 2 dimensiones financieras con justificación de negocio.
- [ ] Cada paso tiene captura de pantalla como evidencia.

## Rúbrica

| Criterio | Peso |
|---|---|
| Legal entity | 15% |
| Calendario fiscal | 20% |
| Catálogo de cuentas y ledger | 35% |
| Dimensiones financieras | 20% |
| Evidencia y documentación | 10% |

## Errores comunes

- Confundir dimensión financiera con una cuenta contable adicional.
- No asociar correctamente el calendario fiscal al ledger antes de intentar contabilizar.
- Crear cuentas sin agruparlas por tipo, dificultando el reporte financiero.
- Saltarse este lab y asumir que el vocabulario de Módulo 60 es suficiente sin haber tocado la UI real.

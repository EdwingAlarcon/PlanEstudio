---
id: lab-93
title: "F&O Finance Setup Walkthrough"
level: "N4"
duration: 240
product: ["Dynamics 365 Finance", "Legal Entities", "Chart of Accounts", "Financial Dimensions"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Acceso a un ambiente de Dynamics 365 Finance con datos demo: trial de administrador creada en el Power Platform admin center, o un ambiente demo que ya tenga tu empresa o un partner (ver el aviso de ambiente)"
  - "Sin ese ambiente, haz la variante en papel del final del lab"
lastVerified: "2026-11"
---

# Lab 93 — F&O Finance Setup Walkthrough

## Objetivo

Configurar, en un ambiente real de Dynamics 365 Finance (trial/demo), los fundamentos financieros
de una legal entity nueva: entidad legal, calendario fiscal, catálogo de cuentas y dimensiones
financieras — como haría un F&O Practitioner en el arranque de una implementación.

## Nota de verificación (léela antes de empezar)

Las rutas de menú y los nombres de página de este lab se contrastaron con Microsoft Learn en
noviembre de 2026 (cada paso enlaza la página usada), pero **no se probaron en un tenant en vivo**.
Microsoft cambia nombres de menú y flujos entre release waves. Si un paso no coincide exactamente
con lo que ves en tu ambiente, es más probable que sea un cambio de versión que un error tuyo —
documenta la diferencia como parte de tu evidencia y sigue el flujo equivalente en tu entorno. Si
tienes mentor o comunidad, valida los pasos con ellos la primera vez que ejecutes este lab.

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

**Empresa ficticia:** Northwind Manufacturing LATAM.

Northwind está implementando Dynamics 365 Finance para su operación en México. Necesitas dejar
lista la base financiera antes de que cualquier otro equipo (Procurement, Sales, Project) pueda
trabajar: una legal entity, un calendario fiscal, un catálogo de cuentas y las dimensiones
financieras que usará toda la organización.

## Rol del estudiante

Actúas como F&O Practitioner responsable del setup financiero inicial de una implementación.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Finance con datos demo (compañía `USMF`), o la variante en
  papel del final del lab.
- Acceso con rol "System administrator" en ese ambiente (en una trial de un solo usuario lo tienes).
- **Tiempo:** las 4 horas son para los pasos. Crear la trial (adquirir la oferta, crear el ambiente y
  esperar el despliegue, que puede tardar una hora) va aparte; hazlo el día anterior.

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
- Un ambiente recién aprovisionado a veces tarda varios minutos en reflejar roles recién asignados
  — si un menú no aparece, no asumas que no existe: cierra sesión y vuelve a entrar antes de
  descartar el paso.
- Las trials expiran: anota la fecha de expiración que muestra el admin center al crear el ambiente
  y planifica los Labs 93 a 100 dentro de ese plazo.
- **Activar una dimensión financiera exige modo de mantenimiento.** Learn indica que el sistema debe
  estar en *maintenance mode* para activar dimensiones y que hace falta el privilegio de activación
  de dimensiones ([Learn: Define financial dimensions](https://learn.microsoft.com/dynamics365/finance/general-ledger/tasks/define-financial-dimensions),
  [Learn: Financial dimension activation](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/financial/activate-financial-dimensions)).
  En una trial puede que no puedas poner el ambiente en mantenimiento: en ese caso crea la dimensión
  y sus valores, no la actives, y documenta el bloqueo; el Paso 4 lo tiene en cuenta.

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparece la opción "New" en Legal entities | Permiso insuficiente en Organization administration | Revisa qué roles de seguridad tiene tu usuario en **System administration > Users > Users** | Solicita al administrador del ambiente un rol con escritura en Organization administration, o documenta la legal entity demo existente en su lugar |
| El menú General ledger aparece vacío o sin parámetros | Módulo no habilitado o sin inicializar en el trial | Ve a **General ledger > Ledger setup > General ledger parameters** y verifica si carga valores | Espera a que el ambiente demo termine su aprovisionamiento (puede tardar horas tras crearlo) o solicita un ambiente demo distinto con datos Contoso completos |
| No se puede guardar el calendario fiscal | Trial incompleto: calendario base no generado | Revisa si existe algún calendario fiscal preexistente en **Fiscal calendars** antes de crear uno nuevo | Usa el calendario fiscal demo existente y documenta su estructura en vez de crear uno desde cero |
| Las cuentas principales no muestran agrupación por tipo | Dato Contoso faltante o catálogo de cuentas vacío | Ve a **Chart of accounts > Accounts > Main accounts** y filtra por tipo de cuenta | Cambia a la legal entity demo `USMF` o `DEMF`, que sí trae catálogo de cuentas Contoso precargado |
| La dimensión nueva no se puede usar ni añadir a una estructura de cuentas | La dimensión no está activada (Learn: no se puede consumir hasta activarla, y activar exige modo de mantenimiento) | En **Financial dimensions**, revisa si la dimensión sigue pendiente de activar | Si puedes poner el ambiente en mantenimiento, selecciona **Activate**; si no, documenta el bloqueo y usa una dimensión ya activa de `USMF` (por ejemplo, Department) para el resto del paso |
| Error "The financial dimension name ... contains invalid characters" | El nombre lleva espacios u otros caracteres especiales | Revisa el nombre: Learn exige empezar por letra o guion bajo y usar solo letras, números o guion bajo | Renombra a algo como `CentroCosto` (sin espacio) |

## Entregables

- Legal entity nueva configurada (o documentada si usas una legal entity demo existente).
- Calendario fiscal con al menos 4 períodos.
- Catálogo de cuentas con al menos 10 cuentas principales agrupadas por tipo.
- Al menos 2 dimensiones financieras definidas (p. ej. departamento y centro de costo).
- Capturas de pantalla de cada paso completado.

## Pasos detallados

### Paso 1 — Legal entity

Ve a **Organization administration > Organizations > Legal entities** y selecciona **New**
([Learn: Create a legal entity](https://learn.microsoft.com/dynamics365/fin-ops-core/fin-ops/organization-administration/tasks/create-legal-entity)).
El diálogo pide **Name**, **Company** (el código, p. ej. `NWLA` para Northwind LATAM) y
**Country/region**.

Documenta:

- Nombre de la legal entity, código y país/región.
- Dirección principal.

La moneda de contabilización **no** se fija en la legal entity sino en la página **Ledger** (Paso 3).
Si no quieres crear una entidad nueva, documenta `USMF` (Contoso Entertainment System USA) en su
lugar: el objetivo es entender la estructura. Ten en cuenta que una legal entity recién creada llega
vacía (sin proveedores, clientes, productos liberados ni configuración contable); por eso los Labs 94
a 100 trabajan en `USMF`.

### Paso 2 — Calendario fiscal

Learn usa dos rutas para la misma página: **General ledger > Calendars > Fiscal calendars** y
**General ledger > Ledger setup > Fiscal calendars**. Usa la que veas en tu menú y anótala
([Learn: Fiscal calendars, fiscal years, and periods](https://learn.microsoft.com/dynamics365/finance/budgeting/fiscal-calendars-fiscal-years-periods)).

- Revisa el calendario que usa `USMF` (o crea uno nuevo con **New calendar**) y agrega un año con
  **New year**. Learn indica que solo puedes agregar años futuros, no pasados.
- Documenta cuántos períodos tiene el año fiscal, si coincide con el año calendario y si existe un
  período de cierre (*closing period*): Learn explica que suele ser el período 13 y que copia las
  fechas del último período.
- El estado de cada período (por ejemplo **Open**) no se cambia aquí, sino en el **Ledger calendar**
  de la legal entity (desde la página **Ledger**, botón **Ledger calendar**). Explica qué pasa si
  intentas contabilizar una transacción en un período que no está abierto.

### Paso 3 — Catálogo de cuentas y ledger

El catálogo se crea en la página **Chart of accounts**; las cuentas principales, en **General ledger
> Chart of accounts > Accounts > Main accounts** ([Learn: Create a main account](https://learn.microsoft.com/dynamics365/finance/general-ledger/tasks/create-main-account),
[Learn: Plan your chart of accounts](https://learn.microsoft.com/dynamics365/finance/general-ledger/plan-chart-of-accounts)).

- Documenta al menos 10 cuentas principales de `USMF` (o créalas en tu catálogo), con su **Main
  account type** y su **Main account category**. Usa los tipos **Assets**, **Liabilities**,
  **Equity**, **Revenue** y **Expense**: Learn advierte que los tipos genéricos **Balance sheet** o
  **Profit and loss** impiden que los informes de Financial analysis sepan dónde poner la cuenta
  ([Learn: Financial analysis](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/analytics/financial-insights)).
- Ve a **General ledger > Ledger setup > Ledger** y documenta qué **Chart of accounts**, qué
  **Account structures**, qué **Fiscal calendars** y qué **Accounting currency** tiene la legal
  entity ([Learn: Configure ledgers](https://learn.microsoft.com/dynamics365/finance/general-ledger/configure-ledger)).
- Anota dos reglas de Learn que importan en una implementación: el catálogo de cuentas **no se puede
  cambiar** una vez que hay transacciones contabilizadas en la legal entity, y sin calendario fiscal
  en el ledger cualquier contabilización da error.

### Paso 4 — Dimensiones financieras

Ve a **General ledger > Chart of accounts > Dimensions > Financial dimensions**
([Learn: Define financial dimensions](https://learn.microsoft.com/dynamics365/finance/general-ledger/tasks/define-financial-dimensions)).

- Revisa qué dimensiones ya tiene `USMF` y anota, para cada una, el valor de **Use values from**:
  **Custom dimension** (valores que mantienes a mano) o una entidad del sistema (por ejemplo, un tipo
  de unidad operativa como Department), cuyos valores vienen de esa entidad.
- Crea al menos 2 dimensiones con **New**, una de cada tipo si puedes, con nombres sin espacios ni
  caracteres especiales (p. ej. `CentroCosto`). Para la personalizada, crea 2 valores en
  **Dimension values** (máximo 30 caracteres cada uno).
- Intenta **Activate**. Si el ambiente no está en modo de mantenimiento y no puedes activarla, anota
  el mensaje: es evidencia válida. Mientras no esté activa, Learn indica que no puedes añadirla a una
  estructura de cuentas ni usarla en transacciones.
- Documenta en qué **Account structure** del ledger aparece cada dimensión: una dimensión que no
  está en la estructura no se puede usar al contabilizar con esa cuenta.
- Explica, con un ejemplo concreto, por qué una organización usaría dimensiones en vez de crear una
  cuenta contable distinta para cada departamento.

## Variante en papel (sin ambiente de F&O)

Si no tienes ambiente, haz el mismo diseño para Northwind LATAM apoyándote solo en las páginas de
Learn enlazadas en los pasos. Escribe «variante en papel» en tu entrega. Tiempo estimado: 90 minutos.

1. **Legal entity:** tabla con nombre, código (**Company**), país/región, dirección y la moneda de
   contabilización que pondrías en la página **Ledger** (no en la legal entity), con una línea que
   explique por qué.
2. **Calendario fiscal:** un año fiscal de 12 períodos más el período de cierre; indica fecha de
   inicio y fin de cada período y qué pasaría si el año fiscal de México no coincidiera con el año
   calendario.
3. **Catálogo:** 10 cuentas principales (número, nombre, **Main account type** entre Assets,
   Liabilities, Equity, Revenue y Expense, y categoría). Ninguna con tipo Balance sheet o Profit and
   loss: explica por qué con la cita de Learn.
4. **Dimensiones:** 2 dimensiones con nombre válido según las reglas de Learn, tipo (**Custom
   dimension** o basada en entidad), 2 valores de ejemplo y la **Account structure** que diseñarías
   (qué rango de cuentas usa cada dimensión).
5. **Tres preguntas de implementación** con su respuesta y la URL de Learn: ¿se puede cambiar el
   catálogo después de contabilizar?, ¿qué hace falta para activar una dimensión?, ¿qué pasa si el
   ledger no tiene calendario fiscal?

La variante en papel cumple los criterios de validación si cada tabla está completa y cada
afirmación lleva su enlace de Learn; sustituye a las capturas.

## Criterios de validación

- [ ] La legal entity está documentada con nombre, código, país y moneda.
- [ ] El calendario fiscal tiene al menos 4 períodos documentados.
- [ ] El catálogo de cuentas tiene al menos 10 cuentas agrupadas por tipo.
- [ ] El ledger conecta catálogo de cuentas, calendario fiscal y legal entity.
- [ ] Hay al menos 2 dimensiones financieras con justificación de negocio, y su estado de activación
      (activada, o el bloqueo documentado).
- [ ] Cada paso tiene captura de pantalla como evidencia (en la variante en papel, el enlace de Learn
      que respalda cada afirmación).

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
- Buscar la moneda de contabilización en la legal entity: se fija en la página **Ledger**.
- Crear una dimensión y esperar usarla sin activarla ni añadirla a la estructura de cuentas.
- Saltarse este lab y asumir que el vocabulario de Módulo 60 es suficiente sin haber tocado la UI real.

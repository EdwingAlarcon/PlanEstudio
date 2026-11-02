---
id: lab-32
title: "CoE Starter Kit — Gobernanza a Escala del Tenant de Power Platform"
level: "N4"
duration: 165
product: ["CoE Starter Kit", "Power BI", "Power Automate", "Power Apps", "Dataverse"]
certifications: ["Arquitectura Power Platform"]
role: ["Solution Architect", "Admin", "CoE Lead"]
prerequisites:
  - "Rol de Power Platform Administrator (o Global Administrator) asignado de forma directa y permanente; el rol Dynamics 365 Administrator no sirve para el kit"
  - "Licencias no trial: Power Apps Per User, Power Automate Per User (o Per Flow) y Microsoft 365 con buzón; Power BI Pro para publicar y compartir el dashboard"
  - "Al menos 5 aplicaciones Canvas o flujos ya creados en el tenant (para que el inventario tenga datos)"
  - "Módulo 32 estudiado: CoE Starter Kit"
files: []
lastVerified: "2026-11"
---

# Lab 32 — CoE Starter Kit: Gobernanza a Escala del Tenant de Power Platform

## Objetivo

Al finalizar este laboratorio habrás instalado los componentes Core del CoE Starter Kit, configurado la sincronización del inventario del tenant, explorado el Power BI Dashboard del CoE para identificar apps sin dueño y apps muy compartidas, configurado el proceso de cumplimiento (compliance) con umbrales propios y entendido cómo funciona el Environment Request Process para controlar la proliferación de ambientes. También compararás cada pieza con su alternativa nativa del Power Platform admin center.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — escenario de madurez organizacional

**Problema a resolver:** SIT lleva 2 años adoptando Power Platform. Hoy el tenant tiene 47 aplicaciones Canvas, 120 flujos y 12 ambientes. Nadie sabe cuáles apps son críticas para el negocio, quién las mantiene, si usan conectores de datos sensibles o cuántas están abandonadas por sus creadores. El arquitecto de soluciones necesita visibilidad y control sin bloquear la innovación.

**Por qué el CoE Starter Kit:** Es un conjunto de herramientas de gobernanza de Power Platform publicado por Microsoft. No reemplaza el trabajo del CoE — lo habilita con datos. La alternativa es hacer inventario manual en Excel cada mes.

> **Nota de vigencia:** Microsoft indica en Learn que el CoE Starter Kit **ya no tiene mantenimiento activo** (no se revisan ni corrigen issues) y que sus capacidades centrales ya forman parte del Power Platform admin center: **Manage** > **Inventory**, la página **Actions** (antes Advisor), Managed Environments y las data policies. Hoy se instala como complemento para huecos concretos (procesos de cumplimiento con correos a makers, solicitud de ambientes, componentes de Nurture) y no como punto de partida obligatorio de gobernanza (ver el Módulo 32, Microlección 2). La instalación y el uso de este lab se verificaron en Learn en 2026-11.

## Lo que vas a construir / configurar

- **Componente Core**: instalación con el **CoE Setup and Upgrade Wizard** y sincronización del inventario del tenant (apps, flujos, makers, conectores, ambientes)
- **Power BI CoE Dashboard**: identificar apps sin dueño, apps muy compartidas y uso de conectores
- **Proceso de cumplimiento**: pedir información a los makers de apps muy compartidas, con umbrales ajustados por variables de entorno
- **Environment Request Process** (parte de Core): solicitud desde **CoE Maker Command Center** y aprobación desde **CoE Admin Environment Request**
- **Visión del componente Governance** (walkthrough de cuarentena e inactividad sin instalación completa) y una **data policy** de prueba

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Preparar el ambiente CoE y descargar el kit | 30 min |
| Ejercicio 2 — Instalar el componente Core | 45 min (más la espera del primer inventario, que puede tardar horas) |
| Ejercicio 3 — Power BI Dashboard: análisis del inventario | 25 min |
| Ejercicio 4 — Proceso de cumplimiento | 30 min |
| Ejercicio 5 — Environment Request Process, Governance y data policy | 35 min |
| **Total** | **165 min** |

## Nivel

**N4 Arquitecto** — Competencia objetivo: **Arquitectura Power Platform**

## Tecnologías utilizadas

- CoE Starter Kit (Microsoft Power Platform Center of Excellence)
- Conectores de administración (**Power Platform for Admins**, **Power Platform for Admins V2**, **Power Apps for Admins**, **Power Automate for Admins**)
- Power BI Desktop + Power BI Service
- Power Automate (flujos del kit)
- Power Apps (apps del kit)
- Dataverse (tablas del inventario del tenant)
- Microsoft Teams y Office 365 Outlook (notificaciones y aprobaciones del kit)

## Prerrequisitos

### Permisos y licencias requeridos

Learn ([Set up the CoE Starter Kit](https://learn.microsoft.com/power-platform/guidance/coe/setup), ms.date 2026-04-20) pide para la identidad que instala y ejecuta el kit:

- [ ] Rol **Power Platform Administrator** o **Global Administrator**, asignado de forma **directa y permanente**. El rol **Dynamics 365 Administrator** no está soportado (no recoge todos los tipos de ambiente).
- [ ] **Power Apps Per User** (no trial) y licencia de Microsoft 365.
- [ ] **Power Automate Per User** o **Per Flow** (no trial).
- [ ] Acceso a un buzón de Office 365 que cumpla los requisitos del conector **Office 365 Outlook**.
- [ ] **Power BI Pro** para compartir el informe del kit.
- [ ] MFA configurada según las recomendaciones de acceso condicional para Power Automate.

### Crear el ambiente dedicado para el CoE antes de empezar

> El CoE Starter Kit **nunca debe instalarse en el ambiente Default**. Necesita su propio ambiente dedicado. Learn recomienda **dos ambientes de tipo Production** (uno de prueba y otro de producción); para este lab basta con uno.

1. Ve a [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → **New**.
2. Nombre: `CoE — Gobernanza SIT`
3. Type: **Production**
4. Region: la más cercana a tu ubicación
5. Agrega una base de datos de Dataverse, con **English** como idioma por defecto, **sin** apps ni datos de ejemplo y con **None** como grupo de seguridad (algunos procesos del kit usan aprobaciones y los makers deben poder interactuar con el ambiente).
6. Espera a que el ambiente esté listo.

> Si en tu tenant de práctica no tienes capacidad para un ambiente Production, documenta la desviación: Learn pide Production para el kit.

---

## Datos de apoyo

### Componentes del CoE Starter Kit

| Componente | Archivo en el paquete descargado | Qué hace | ¿Instalar en este lab? |
|---|---|---|---|
| **Core** | `CenterofExcellenceCoreComponents_x.xx_managed.zip` | Inventario del tenant (apps, flujos, conectores, makers, ambientes), Setup Wizard, Power Platform Admin View, Environment Request, Welcome Email, App Catalog | ✅ Sí (Ejercicio 2) |
| **Governance** | `CenterofExcellenceAuditComponents_x.xx_managed.zip` | Developer Compliance Center, cuarentena de apps no conformes, procesos de inactividad | 🔍 Walkthrough (Ejercicio 5) |
| **Nurture** | `CenterofExcellenceNurtureComponents_x.xx_managed.zip` | Adopción: Video hub, Training in a day, Maker Assessment, Pulse survey, catálogo de plantillas | ❌ Fuera de scope de este lab |
| **Innovation Backlog** | `CenterofExcellenceInnovationBacklog_x.xx_managed.zip` | Captura y prioriza ideas de digitalización del negocio | ❌ Fuera de scope de este lab |

Governance y Nurture dependen de que Core esté instalado primero. Los informes de Power BI vienen como `Production_CoEDashboard_MMMYYYY.pbit` (inventario por cloud flows) y `PowerPlatformGovernance_CoEDashboard_MMMYYYY.pbit` (gobierno y cumplimiento).

### Tablas clave de Dataverse creadas por el Core

Busca estas tablas por su **nombre para mostrar** en tu ambiente (los nombres lógicos llevan el prefijo del kit; anótalos tal como aparecen en tu versión):

| Tabla (nombre para mostrar) | Contenido |
|---|---|
| **PowerApps App** | Inventario de las apps del tenant |
| **Flow** | Inventario de los cloud flows |
| **PowerApps Connector** | Conectores utilizados |
| **Maker** | Perfil de cada usuario que ha creado recursos |
| **Environment** | Todos los ambientes del tenant |

---

## Ejercicio 1 — Preparar el ambiente y descargar el kit

> **Qué vas a hacer:** Descargar el CoE Starter Kit y preparar los prerrequisitos de instalación: identidad, data policy, Creator Kit y una conexión previa.
> **Duración:** 30 min

### Tarea 1.1 — Descargar el CoE Starter Kit

1. Descarga el paquete desde el enlace oficial que cita Learn: [aka.ms/CoEStarterKitDownload](https://aka.ms/CoEStarterKitDownload).

2. Extrae el ZIP. Entre otros, encontrarás estos archivos (Learn, [Download and install](https://learn.microsoft.com/power-platform/guidance/coe/setup#download-and-install)):

   ```
   CenterofExcellenceCoreComponents_x.xx_managed.zip       ← Core (lo instalas en el Ejercicio 2)
   CenterofExcellenceAuditComponents_x.xx_managed.zip      ← Governance
   CenterofExcellenceNurtureComponents_x.xx_managed.zip    ← Nurture
   CenterofExcellenceInnovationBacklog_x.xx_managed.zip    ← Innovation Backlog
   Production_CoEDashboard_MMMYYYY.pbit                    ← Dashboard (inventario por cloud flows)
   PowerPlatformGovernance_CoEDashboard_MMMYYYY.pbit       ← Dashboard de gobierno y cumplimiento
   BYODL_CoEDashboard_MMMYYYY.pbit                         ← Dashboard si el inventario viene de Data export (preview)
   ```

   `x.xx` es la versión y `MMMYYYY`, el mes de la publicación.

### Tarea 1.2 — Decidir la identidad del kit

El kit necesita una identidad que cumpla los requisitos de "Permisos y licencias requeridos". En producción se usa una cuenta de servicio dedicada: si usas tu cuenta personal, los flujos se detienen cuando cambia tu contraseña o dejas la organización.

1. En el Microsoft 365 admin center, crea el usuario (por ejemplo `coe-service@tudominio.com`) con las licencias no trial de los prerrequisitos.

2. Asigna el rol **Power Platform Administrator** de forma directa (no a través de un grupo) y permanente.

3. Agrega la cuenta al ambiente `CoE — Gobernanza SIT` con el rol de seguridad **System Administrator**.

   > Para este lab de práctica puedes usar tu propia cuenta si cumple los requisitos, pero documenta que en producción se requiere la cuenta de servicio dedicada.

### Tarea 1.3 — Validar la data policy del ambiente del CoE

La data policy (antes llamada DLP) que aplique al ambiente del CoE debe permitir **juntos en el grupo Business** estos conectores (lista de Learn, [Validate data policies](https://learn.microsoft.com/power-platform/guidance/coe/setup#validate-data-policies)):

**Approvals**, **Azure Resource Manager**, **HTTP**, **HTTP with Microsoft Entra ID (preauthorized)**, **Microsoft Dataverse**, **Microsoft Dataverse (legacy)**, **Microsoft Teams**, **Office 365 Groups**, **Office 365 Outlook**, **Office 365 Users**, **Power Apps for Admins**, **Power Apps for Makers**, **Power Automate for Admins**, **Power Automate Management**, **Power Platform for Admins**, **Power Platform for Admins V2**, **Power Query Dataflows** y **RSS**.

1. En el admin center → **Security** → **Data and privacy** → **Data policy**, revisa qué políticas aplican al ambiente del CoE.
2. Comprueba que **ninguna otra política** aplica a ese ambiente (las políticas se combinan y gana la más restrictiva).
3. Si una política del tenant bloquea alguno de esos conectores, excluye el ambiente del CoE de esa política (alcance **Exclude certain environments**) y dale una política propia.

> Learn advierte que no se puede configurar endpoint filtering para **HTTP** ni **HTTP with Microsoft Entra ID (preauthorized)** en este escenario, porque las data policies no evalúan endpoints dinámicos.

### Tarea 1.4 — Creator Kit y conexión previa

1. Instala el **Creator Kit** en el ambiente del CoE: es un requisito del CoE Starter Kit ([Learn: setup core components](https://learn.microsoft.com/power-platform/guidance/coe/setup-core-components)).
2. En [make.powerautomate.com](https://make.powerautomate.com), con el ambiente `CoE — Gobernanza SIT` seleccionado → **Data** → **Connections** → **+ New connection** → **HTTP with Microsoft Entra ID (preauthorized)**.
3. En **Base Resource URL** y **Microsoft Entra ID Resource URI (Application ID URI)** escribe `https://graph.microsoft.com` (tenants comerciales; en GCC, GCC High o DoD usa el endpoint raíz de Microsoft Graph de tu nube).
4. Inicia sesión con la identidad del kit.

### Validación del Ejercicio 1

- [ ] El ambiente `CoE — Gobernanza SIT` existe, es de tipo **Production** y tiene Dataverse en inglés
- [ ] El paquete del CoE Starter Kit está descargado y extraído, y localizaste el archivo de Core
- [ ] La identidad del kit tiene el rol y las licencias no trial requeridas
- [ ] La data policy que aplica al ambiente del CoE tiene los conectores de la lista en el grupo Business
- [ ] Creator Kit instalado y conexión **HTTP with Microsoft Entra ID (preauthorized)** creada

---

## Ejercicio 2 — Instalar el componente Core

> **Qué vas a hacer:** Importar la solución Core al ambiente CoE, configurarla con el asistente y lanzar la sincronización del inventario del tenant.
> **Duración:** 45 min (más la espera del primer inventario)

### Tarea 2.1 — Importar la solución Core

1. Ve a [make.powerapps.com](https://make.powerapps.com) → selecciona el ambiente `CoE — Gobernanza SIT`.

2. **Solutions** → **Import solution** → sube `CenterofExcellenceCoreComponents_x.xx_managed.zip`.

3. En la pantalla de conexiones, selecciona o crea una conexión para cada conector que pida la solución, siempre con la identidad del kit (incluida la conexión **HTTP with Microsoft Entra ID (preauthorized)** de la Tarea 1.4).

4. En la pantalla de variables de entorno, **déjalas vacías** si tu tenant está en la nube comercial: las configurarás con el asistente.

5. Haz clic en **Import**.

   > La importación puede tardar **hasta una hora**. Learn indica que un aviso del tipo *Flow client error returned with status code "BadRequest"* durante la importación se puede ignorar.

### Tarea 2.2 — Configurar el kit con el CoE Setup and Upgrade Wizard

1. Abre la solución **Center of Excellence - Core Components** → app **CoE Setup and Upgrade Wizard**.

2. Sigue los pasos del asistente. En la fuente de datos del inventario elige **Cloud flows** (la opción recomendada; **Data export** es una preview experimental que Learn pide probar solo en un ambiente de prueba y que requiere Power BI Premium).

3. Cuando el asistente pida las variables de entorno, usa estos valores (nube comercial):

   | Variable | Valor |
   |---|---|
   | **Admin eMail** | Tu email de administrador o el buzón del equipo CoE (recibe los informes y avisos del kit) |
   | **Power Automate environment variable** | `https://make.powerautomate.com/environments` |
   | **PowerApp Maker environment variable** | `https://make.powerapps.com/` |
   | **ProductionEnvironment** | **Yes** en el ambiente de producción del CoE; **No** en un ambiente de prueba (así no se envían correos a makers ni usuarios) |

4. Si el asistente muestra *Error Loading Control*, enciende a mano los flujos **SetupWizard > GetCurrentEnvironment**, **SetupWizard > GetTenantID** y **SetupWizard > GetUserDetails** y vuelve a abrirlo.

> Para tenants grandes, revisa también **FullInventory** (en **No**, cada ejecución solo inventaría lo nuevo o modificado) y **DelayObjectInventory** (en **Yes** si hay throttling). Learn advierte que el inventario por cloud flows puede dar problemas de rendimiento por encima de **10.000 objetos** (ambientes, apps y flujos sumados).

### Tarea 2.3 — Comprobar que la sincronización corre

El asistente se encarga de encender los flujos del inventario. El flujo principal es **Admin | Sync Template v4 (Driver)**, que dispara los flujos de sincronización por tipo de recurso (los **Admin | Sync Template v3 (...)**).

1. En la solución → **Cloud flows** → abre **Admin | Sync Template v4 (Driver)**.

2. Revisa **Runs**: anota la hora de inicio y el estado de la primera ejecución.

3. Abre también uno de los flujos hijo **Admin | Sync Template v3 (...)** y comprueba que tiene ejecuciones.

   > El primer inventario completo puede tardar **varias horas** según el tamaño del tenant. Si algún flujo de sincronización falla, el kit envía un resumen diario de errores a **Admin eMail** desde **Admin | Sync Template v3 (Sync Flow Errors)**.

### Tarea 2.4 — Verificar la sincronización

1. En [make.powerapps.com](https://make.powerapps.com) → **Tables** → busca la tabla **PowerApps App**.

2. Abre la tabla y revisa sus datos: verifica que hay registros de las apps del tenant.

3. Comprueba que las columnas de dueño (maker), fecha de modificación y número de usuarios con quienes se compartió tienen datos. Anota sus nombres tal como aparecen en tu versión del kit.

   > Si el tenant es nuevo y solo tiene las apps del CoE, los datos serán mínimos. Esto es normal.

4. Compara con lo nativo: en el admin center → **Manage** → **Inventory**, anota el total de apps que ves. Si los números difieren mucho, piensa por qué (momento del último sync, tipos de recurso que cuenta cada uno).

### Validación del Ejercicio 2

- [ ] La solución **Center of Excellence - Core Components** está importada sin errores
- [ ] El asistente está completado y las variables de entorno configuradas
- [ ] **Admin | Sync Template v4 (Driver)** tiene al menos una ejecución correcta
- [ ] La tabla **PowerApps App** tiene registros del inventario del tenant

---

## Ejercicio 3 — Power BI Dashboard: análisis del inventario

> **Qué vas a hacer:** Conectar el template de Power BI al ambiente CoE y usar el dashboard para identificar recursos problemáticos.
> **Duración:** 25 min

### Tarea 3.1 — Configurar el reporte de Power BI

Pasos según Learn, [Set up the Power BI dashboard](https://learn.microsoft.com/power-platform/guidance/coe/setup-powerbi) (ms.date 2026-04-20). El dashboard necesita que los flujos de sincronización hayan terminado.

1. Obtén la URL del ambiente: admin center → **Manage** → **Environments** → selecciona `CoE — Gobernanza SIT` → copia la **Environment URL** (si sale truncada, **See all**) y añádele el prefijo `https://` y la barra final `/`.
   - Ejemplo: `https://org12345.crm.dynamics.com/`

2. Abre `Production_CoEDashboard_MMMYYYY.pbit` con la versión más reciente de **Power BI Desktop**.

3. En el parámetro **OrgUrl** pega la URL del paso 1. En **Tenant Type** deja **Commercial** si tu tenant es comercial.

4. Si se te pide, inicia sesión con la cuenta de la organización que tiene acceso al ambiente del CoE.

5. Espera a que carguen los datos.

> Si aparece *Unable to connect (provider Named Pipes Provider, error: 40...)*, Learn indica quitar el `https://` y la barra final para dejar la URL en la forma `orgname.crm.dynamics.com`. Si no se te piden los parámetros, abre el .pbit, descarta los cambios y vuelve a abrirlo.

### Tarea 3.2 — Explorar las páginas del dashboard

El dashboard del CoE tiene varias páginas (los nombres exactos cambian entre versiones del .pbit). Busca las que respondan a estas preguntas:

**Resumen del tenant**

Anota los valores principales:

| KPI | Valor en tu tenant |
|---|---|
| Total de apps | _______ |
| Total de cloud flows | _______ |
| Total de makers | _______ |
| Apps en el ambiente Default | _______ |

**Apps sin dueño (orphaned)**

El kit marca como huérfano un recurso cuyo dueño ya no está en la organización (para dueños que son app users, consulta Microsoft Graph para no marcarlos por error).

1. Identifica cuántas apps sin dueño tiene tu tenant.
2. Por separado, identifica las apps sin modificar desde hace mucho tiempo: la inactividad es otro proceso (Ejercicio 5), no lo mismo que no tener dueño.

**Uso de conectores**

1. Busca la página o el visual que muestra qué conectores usan las apps y flujos.
2. Ordena las apps por número de usuarios con quienes se comparten y señala las que combinan mucha audiencia con conectores sensibles (por ejemplo **HTTP** o conectores a bases de datos): son las primeras a auditar.

### Tarea 3.3 — Publicar el reporte en Power BI Service

1. En Power BI Desktop → **Publish** → elige el workspace.

   > Learn recomienda publicar siempre con el mismo nombre (por ejemplo `SIT CoE Governance`) para conservar la URL tras cada actualización mensual del kit.

2. Ve a [app.powerbi.com](https://app.powerbi.com) y verifica que el informe es accesible.

3. Configura la actualización programada **diaria** del modelo semántico, con credenciales de la identidad del kit.

### Validación del Ejercicio 3

- [ ] El dashboard de Power BI carga datos del ambiente CoE
- [ ] Anotaste los KPIs del resumen del tenant
- [ ] Distinguiste apps sin dueño de apps inactivas
- [ ] El reporte está publicado en Power BI Service con actualización programada diaria

---

## Ejercicio 4 — Proceso de cumplimiento

> **Qué vas a hacer:** Entender y configurar el proceso de cumplimiento del kit (Developer Compliance Center), que detecta apps muy compartidas o muy usadas y pide información a sus makers.
> **Duración:** 30 min

### Tarea 4.1 — Entender el proceso de cumplimiento

Según Learn ([Set up Developer Compliance components](https://learn.microsoft.com/power-platform/guidance/coe/setup-governance-components), ms.date 2026-04-20), el kit detecta apps y agentes muy usados y pide a sus makers una **justificación de negocio, la clasificación de datos y un plan de soporte**. El flujo central es **Admin | Compliance detail request v3**:

```
[Flujos de cumplimiento del kit]
       ↓
Detecta apps que superan un umbral (variables de entorno, valores por defecto):
  - compartida con 20 o más usuarios, o con 1 o más grupos
  - 30 o más lanzamientos en los últimos 30 días
  - muy compartida y publicada por última vez hace 60 días o más → debe republicarse
       ↓
Correo al maker → responde en la app "Developer Compliance Center" (Governance)
       ↓
El admin revisa la información (evaluación de riesgo)
       ↓
Si el maker no entrega los detalles → cuarentena tras los días de
"Quarantine Apps after x days of noncompliance" (7 por defecto)
```

### Tarea 4.2 — Ajustar el umbral de "app muy compartida"

El umbral no se cambia editando el flujo: se cambia en una **variable de entorno**, sin tocar la solución administrada.

1. Abre el **CoE Setup and Upgrade Wizard** → **More features** → **Compliance process** (o actualiza la variable a mano siguiendo [Update environment variables](https://learn.microsoft.com/power-platform/guidance/coe/faq#update-environment-variables)).

2. Cambia **Compliance – Apps - Number Users Shared** de **20** a **5** para este lab (así verás resultados en un tenant de prueba).

3. Anota también los valores de **Compliance – Apps – Number Groups Shared** (1), **Compliance – Apps – Number Launches Last 30 Days** (30) y **Compliance – Apps – Number Days Since Published** (60).

4. **Reinicia (apaga y enciende) los flujos de cumplimiento** después del cambio: Learn indica que es necesario para que el nuevo valor surta efecto.

### Tarea 4.3 — Excluir el ambiente del CoE del proceso

Learn documenta la exención **a nivel de ambiente** (por ejemplo, ambientes dedicados bien gestionados o el propio ambiente del CoE):

1. En [make.powerapps.com](https://make.powerapps.com), en el ambiente del CoE, abre la app **Power Platform Admin View**.

2. **Environments** → selecciona `CoE — Gobernanza SIT`.

3. Pon **Excuse From Compliance Flow** en **Yes** → **Save**.

4. Desde la misma app, abre **Apps**, elige una app del inventario y revisa su ficha: localiza los campos de cumplimiento (justificación, clasificación de datos, estado de la evaluación de riesgo). Anota sus nombres tal como aparecen en tu versión.

### Tarea 4.4 — De los datos del maker a decisiones

Lo que el maker entrega en **Developer Compliance Center** (justificación de negocio, clasificación de datos y plan de soporte) queda en el inventario de Dataverse y alimenta el informe `PowerPlatformGovernance_CoEDashboard_MMMYYYY.pbit`. Con esos datos el arquitecto decide, por ejemplo, mover una app muy usada a un ambiente dedicado.

Escribe en dos líneas qué harías con una app compartida con 300 usuarios cuyo maker declara datos confidenciales y no tiene plan de soporte.

### Validación del Ejercicio 4

- [ ] Comprendes el ciclo completo del proceso (detección → solicitud al maker → evaluación → cuarentena)
- [ ] El umbral **Compliance – Apps - Number Users Shared** está en 5 y los flujos se reiniciaron
- [ ] El ambiente del CoE tiene **Excuse From Compliance Flow** = **Yes**
- [ ] Puedes abrir la ficha de una app en **Power Platform Admin View** y localizar sus campos de cumplimiento

---

## Ejercicio 5 — Environment Request Process, visión de Governance y data policy

> **Qué vas a hacer:** Explorar el Environment Request Process (cómo los equipos solicitan nuevos ambientes de forma controlada), hacer un walkthrough de cuarentena e inactividad del componente Governance y probar una data policy.
> **Duración:** 35 min

### Tarea 5.1 — Environment Request Process

El **Environment Request Process** resuelve la proliferación descontrolada de ambientes. En el kit es **parte de Core** ([Learn: core components](https://learn.microsoft.com/power-platform/guidance/coe/core-components)):

```
[Maker / equipo de negocio]
       ↓
Pide un ambiente (y la data policy que necesita) desde la app "CoE Maker Command Center"
       ↓
El admin aprueba o rechaza en la app "CoE Admin Environment Request"
       ↓
Si se aprueba: el flujo "Env Request | Create approved environment" aprovisiona el ambiente
       ↓
"Env Request | Clean up" elimina los ambientes cuya solicitud expiró
```

**Para explorar el proceso:**

1. En la solución Core → abre la app **CoE Maker Command Center** en modo previsualización y localiza la opción de solicitar un ambiente.

2. Observa qué datos pide la solicitud (propósito, duración, conectores, etc.) y anótalos tal como aparecen en tu versión.

3. Abre **CoE Admin Environment Request** y localiza dónde el admin aprueba o rechaza.

4. Compara con lo nativo: para ambientes de desarrollo personales, el admin center ofrece **default environment routing** hacia un grupo de ambientes (Módulo 31). Anota cuál usarías en SIT y por qué.

### Tarea 5.2 — Walkthrough del componente Governance

El componente **Governance** (`CenterofExcellenceAuditComponents_x.xx_managed.zip`) añade procesos que requieren configuración adicional. Para este lab, hacemos un walkthrough conceptual:

**App Quarantine (cuarentena)**

El flujo **Admin | Quarantine non-compliant apps** pone en cuarentena (la app ya no se puede abrir) las apps cuyo maker no entregó los detalles de cumplimiento pasados los días de **Quarantine Apps after x days of noncompliance** (7 por defecto). La app se libera desde **Power Platform Admin View**: **Quarantine App** = **No**, con la evaluación de riesgo completada (**Admin Requirement - Risk Assessment State** = **Complete**). El equivalente nativo más cercano es **Block** sobre una canvas app publicada en **Manage** > **Inventory** (reversible).

**Inactividad**

Es un proceso distinto de la cuarentena: el kit pide al dueño que apruebe la eliminación de apps y flujos sin modificar ni usar en **6 meses** (por ejemplo, con **Admin | Inactivity notifications v2 (Start Approval for Apps)**), y lo aprobado se elimina **más de 3 semanas** después de la aprobación.

**Welcome Email**

Cuando un usuario crea su primer recurso, el flujo **Admin | Welcome Email v3** (de **Core**, no de Nurture) le envía un correo de bienvenida que puedes personalizar con los recursos de formación de la organización y el contacto del CoE.

**Puntuación de seguridad (nativo)**

El kit no calcula una "nota de gobierno". Lo más parecido en el admin center es la puntuación de seguridad de **Security** > **Overview** (preview) junto con las recomendaciones de **Actions**. Anota qué te muestra en tu tenant.

### Tarea 5.3 — Definir y probar la data policy de SIT

Como arquitecto de soluciones, debes definir qué conectores pueden usarse juntos en los flujos del tenant. Las **data policies** (antes **DLP policies**, Data Loss Prevention) son la herramienta para esto.

Diseña la política para SIT:

**Política: `Datos Internos SIT`**

| Grupo | Conectores incluidos | Justificación |
|---|---|---|
| **Business** | Microsoft Dataverse, SharePoint, Microsoft Teams, Office 365 Outlook, Approvals | Conectores internos de Microsoft 365 — pueden coexistir |
| **Non-business** | RSS, MSN Weather | Conectores de información pública — no deben mezclarse con datos corporativos |
| **Blocked** | HTTP | Evita enviar datos a endpoints externos arbitrarios |

Esta política impide que un flujo combine Dataverse (datos sensibles) con HTTP (endpoint externo arbitrario) — un vector común de fuga de datos.

> ⚠️ **Choque con el CoE:** el ambiente del CoE necesita **HTTP** y **RSS** en el grupo **Business** (Tarea 1.3). Si aplicas `Datos Internos SIT` a todo el tenant, **excluye el ambiente del CoE** (alcance **Exclude certain environments**) y dale su propia política; si no, los flujos del kit dejan de funcionar.

**Prueba real (en un ambiente de prueba, nunca en el del CoE):**

1. Admin center → **Security** → **Data and privacy** → **Data policy** → crea `Datos Internos SIT` con los grupos de la tabla y alcance **Add multiple environments** limitado a un ambiente de prueba.
2. En ese ambiente, crea un cloud flow que use Microsoft Dataverse y HTTP en el mismo flujo e intenta guardarlo o activarlo.
3. Anota el mensaje que muestra Power Automate.

### Validación del Ejercicio 5

- [ ] Exploraste **CoE Maker Command Center** y **CoE Admin Environment Request** y comprendes el flujo de aprobación
- [ ] Puedes explicar la diferencia entre cuarentena e inactividad y cómo se libera una app en cuarentena
- [ ] Sabes que **Admin | Welcome Email v3** es de Core y qué ofrece el admin center en lugar de una "nota de gobierno"
- [ ] Diseñaste la data policy con 3 grupos, resolviste el choque con el ambiente del CoE y la probaste en un ambiente de prueba

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Error de importación por conexiones que faltan | Las conexiones no existen o se crearon con otra identidad | Crea las conexiones en **Data** > **Connections** con la identidad del kit (incluida **HTTP with Microsoft Entra ID (preauthorized)**) y vuelve a importar |
| Los flujos de sync no sincronizan nada o quedan suspendidos | Una data policy no permite juntos en Business los conectores que necesita el kit, o aplica más de una política | Revisa la lista de la Tarea 1.3 y excluye el ambiente del CoE de las políticas que lo bloquean |
| El asistente muestra *Error Loading Control* | Los flujos del asistente están apagados | Enciende **SetupWizard > GetCurrentEnvironment**, **SetupWizard > GetTenantID** y **SetupWizard > GetUserDetails** |
| Power BI: *Unable to connect ... error: 40* | Formato de la URL del ambiente | Quita el `https://` y la barra final (`orgname.crm.dynamics.com`) |
| Power BI no puede conectarse a Dataverse | Credenciales en caché de otro usuario o tenant | **File** > **Options and settings** > **Data source settings** → **Clear Permissions** y vuelve a abrir el .pbit |
| La tabla **PowerApps App** tiene muy pocos registros | El primer inventario aún no terminó | Revisa **Admin \| Sync Template v4 (Driver)** > **Runs** y espera; el primer inventario puede tardar horas |
| El proceso de cumplimiento no envía correos | **Admin eMail** vacía, **ProductionEnvironment** en **No** o flujos no reiniciados tras cambiar variables | Revisa las variables en el asistente y reinicia los flujos |
| Error de permisos al recoger el inventario | La identidad no tiene **Power Platform Administrator** directo y permanente (o usa Dynamics 365 Administrator) | Asigna el rol correcto de forma directa en Microsoft Entra ID |

---

## Checklist final

- [ ] Ambiente `CoE — Gobernanza SIT` creado como **Production** con Dataverse en inglés
- [ ] Data policy del ambiente del CoE validada y Creator Kit instalado
- [ ] Solución **Center of Excellence - Core Components** importada y configurada con el asistente
- [ ] **Admin | Sync Template v4 (Driver)** ejecutado al menos una vez con éxito
- [ ] Tabla **PowerApps App** con registros del inventario del tenant
- [ ] Power BI dashboard cargando datos del ambiente CoE
- [ ] Reporte publicado en Power BI Service con actualización programada
- [ ] Proceso de cumplimiento con umbral propio y ambiente del CoE excluido
- [ ] **CoE Maker Command Center** y **CoE Admin Environment Request** explorados
- [ ] Data policy diseñada con 3 grupos y probada en un ambiente de prueba

## Evidencia esperada

- Captura de **Admin | Sync Template v4 (Driver)** > **Runs** con una ejecución correcta y de la tabla **PowerApps App** poblada
- Captura del Power BI dashboard cargando datos reales del ambiente CoE
- Captura de la variable **Compliance – Apps - Number Users Shared** con el nuevo valor y de **Excuse From Compliance Flow** = **Yes**
- Documento de la data policy con los 3 grupos, la exclusión del ambiente del CoE y el mensaje que mostró Power Automate en la prueba

## Criterios de aprobación

- Al menos 1 data policy bloquea un conector no autorizado en una prueba real, sin afectar al ambiente del CoE
- El dashboard de Power BI refleja el inventario real del tenant, no datos de ejemplo
- 100% de los ítems del Checklist final marcados

---

## Reto adicional

**Reto básico:** Crea una **vista personal** en la tabla **PowerApps App** que muestre solo las apps compartidas con más de 50 usuarios y su dueño. Compárala con el mismo filtro en **Manage** > **Inventory** y anota qué columnas tiene cada uno.

**Reto intermedio:** Automatiza el **reporte semanal de gobernanza** para el CTO de SIT: crea un flujo programado que cada lunes a las 8 AM envíe un correo con el total de apps, flujos y makers del inventario y una tabla de las 10 apps más compartidas, indicando cuáles no tienen dueño o no entregaron sus detalles de cumplimiento.

**Reto avanzado:** Instala los componentes **Nurture** y prepara la comunidad de makers de SIT: carga el catálogo de plantillas de solución aprobadas, configura el **Video hub** con los vídeos de formación de la organización y planifica un evento **Training in a day**. Personaliza además el **Admin | Welcome Email v3** de Core para que enlace a esos recursos.

---

## Preguntas de repaso

1. ¿Por qué el CoE Starter Kit debe instalarse en un ambiente **dedicado** de tipo Production y no en el Default?
2. ¿Cuál es la diferencia entre el componente **Core**, **Governance** y **Nurture**?
3. ¿Qué es una **data policy** y por qué el ambiente del CoE necesita su propia política?
4. ¿Cuándo es apropiado mover una app a **cuarentena** versus aprobar su eliminación por inactividad?
5. Si el kit ya no tiene mantenimiento activo, ¿qué pieza de este lab cubrirías con el admin center y cuál justificaría instalar el kit?

---

## Limpieza del laboratorio

> El ambiente del CoE consume capacidad Dataverse del tenant. Para liberar espacio:

1. [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → selecciona `CoE — Gobernanza SIT`.
2. Haz clic en **Delete** → confirma.
3. Elimina la data policy de prueba `Datos Internos SIT` si no la vas a conservar.

> ⚠️ Eliminar el ambiente elimina todos los datos del inventario sincronizado. Si tienes datos valiosos de gobernanza, exporta el reporte de Power BI antes.

---

## Siguiente laboratorio recomendado

Con el Lab 32 completado has terminado el recorrido de los labs fundamentales del sprint 1 y sprint 2.

**Ruta de profundización sugerida:**

- ➡️ **Lab 11 — Power Automate Avanzado** (HTTP, Dataverse Triggers, Error Handling enterprise)
- ➡️ **Lab 31 — Arquitectura Empresarial** (diseñar la arquitectura multi-ambiente para SIT a escala)

**Por qué ir ahí:** El Lab 31 te da el marco conceptual para justificar las decisiones de arquitectura que el Lab 32 implementa — estrategia de ambientes, modelo de seguridad, segregación de datos por región.

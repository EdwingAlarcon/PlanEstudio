---
id: lab-32
title: "CoE Starter Kit — Gobernanza a Escala del Tenant de Power Platform"
level: "N4"
duration: "130 min"
product: ["CoE Starter Kit", "Power BI", "Power Automate", "Power Apps", "Dataverse"]
certifications: ["PL-600"]
role: ["Solution Architect", "Admin", "CoE Lead"]
prerequisites:
  - "Rol de Administrador Global o Power Platform Service Admin en el tenant"
  - "Power BI Pro (o Premium por capacidad) para ver los dashboards"
  - "Al menos 5 aplicaciones Canvas o flujos ya creados en el tenant (para que el inventario tenga datos)"
  - "Módulo 32 estudiado: CoE Starter Kit"
files: []
---

# Lab 32 — CoE Starter Kit: Gobernanza a Escala del Tenant de Power Platform

## Objetivo

Al finalizar este laboratorio habrás instalado los componentes Core del CoE Starter Kit, configurado la sincronización del inventario del tenant, explorado el Power BI Dashboard del CoE para identificar apps sin dueño y conectores de alto riesgo, configurado el Proceso de Compliance para aplicaciones críticas, y entendido cómo funciona el Environment Request Process para controlar la proliferación de ambientes.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — escenario de madurez organizacional

**Problema a resolver:** SIT lleva 2 años adoptando Power Platform. Hoy el tenant tiene 47 aplicaciones Canvas, 120 flujos y 12 ambientes. Nadie sabe cuáles apps son críticas para el negocio, quién las mantiene, si usan conectores de datos sensibles o cuántas están abandonadas por sus creadores. El arquitecto de soluciones necesita visibilidad y control sin bloquear la innovación.

**Por qué el CoE Starter Kit:** Es el conjunto de herramientas de gobernanza oficial de Microsoft para Power Platform. No reemplaza el trabajo del CoE — lo habilita con datos. La alternativa es hacer inventario manual en Excel cada mes.

## Lo que vas a construir / configurar

- **Componente Core**: instalación y sincronización del inventario del tenant (apps, flujos, makers, conectores)
- **Power BI CoE Dashboard**: identificar apps críticas, sin dueño, con conectores de alto riesgo
- **Proceso de Compliance**: automatizar la solicitud de metadatos a creadores de apps críticas
- **Environment Request Process**: formulario Canvas App para que los equipos soliciten nuevos ambientes
- **Visión del componente Governance** (walkthrough sin instalación completa)

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Preparar el ambiente CoE y descargar el kit | 20 min |
| Ejercicio 2 — Instalar el componente Core | 30 min |
| Ejercicio 3 — Power BI Dashboard: análisis del inventario | 25 min |
| Ejercicio 4 — Proceso de Compliance | 25 min |
| Ejercicio 5 — Environment Request Process y visión de Governance | 30 min |
| **Total** | **130 min** |

## Nivel

**N4 Arquitecto** — Certificación objetivo: **PL-600**

## Tecnologías utilizadas

- CoE Starter Kit (Microsoft Power Platform Center of Excellence)
- Power Platform Admin APIs (conector **Power Platform for Admins**)
- Power BI Desktop + Power BI Service
- Power Automate (flujos del kit)
- Power Apps Canvas App (apps del kit)
- Dataverse (tablas del inventario del tenant)
- Microsoft Teams (notificaciones y formularios del proceso de compliance)

## Prerrequisitos

### Permisos requeridos

- [ ] **Power Platform Administrator** o **Global Administrator** en el tenant
- [ ] **Power BI Pro** asignado al usuario que va a ver el dashboard
- [ ] Acceso a descargar el CoE Starter Kit desde GitHub

### Crear el ambiente dedicado para el CoE antes de empezar

> El CoE Starter Kit **nunca debe instalarse en el ambiente Default ni en un ambiente de producción**. Necesita su propio ambiente dedicado.

1. Ve a [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) → **Entornos** → **+ Nuevo**.
2. Nombre: `CoE — Gobernanza SIT`
3. Tipo: **Sandbox**
4. Región: la más cercana a tu ubicación
5. Activar Dataverse: **Sí**
6. Espera a que el ambiente esté listo (3-5 minutos).

---

## Datos de apoyo

### Componentes del CoE Starter Kit

| Componente | Qué hace | ¿Instalar en este lab? |
|---|---|---|
| **Core** | Sincroniza el inventario del tenant: apps, flujos, conectores, makers, ambientes | ✅ Sí (Ejercicio 2) |
| **Governance** | Detecta recursos sin owner, envía emails de compliance, app quarantine | 🔍 Walkthrough (Ejercicio 5) |
| **Nurture** | Acelera la adopción: welcome emails, training resources, maker community | ❌ Fuera de scope de este lab |
| **Innovation Backlog** | Captura y prioriza ideas de digitalización del negocio | ❌ Fuera de scope de este lab |

### Tablas clave de Dataverse creadas por el Core

| Tabla | Contenido |
|---|---|
| admin_App | Inventario de todas las Canvas Apps del tenant |
| admin_Flow | Inventario de todos los Cloud Flows |
| admin_Connector | Conectores utilizados y su clasificación |
| admin_Maker | Perfil de cada usuario que ha creado recursos |
| admin_Environment | Todos los ambientes del tenant |

---

## Ejercicio 1 — Preparar el ambiente y descargar el kit

> **Qué vas a hacer:** Descargar el CoE Starter Kit desde GitHub y preparar los prerrequisitos de instalación.
> **Duración:** 20 min

### Tarea 1.1 — Descargar el CoE Starter Kit

1. Ve a la página de releases del CoE Starter Kit en GitHub:

   Busca "CoE Starter Kit GitHub Microsoft" en tu buscador — la URL oficial es el repositorio `microsoft/coe-starter-kit`.

2. En la sección **Releases**, descarga el archivo `CenterofExcellenceStarterKit.zip` de la versión más reciente.

3. Extrae el ZIP. Encontrarás estas carpetas:

   ```
   CenterofExcellenceStarterKit/
   ├── CoEStarterKit.zip          ← Solución principal (Core + Governance)
   ├── CenterofExcellence_PowerBIReport/
   │   └── PowerPlatformGovernanceDashboard.pbit  ← Template de Power BI
   ├── CenterofExcellenceNurtureComponents.zip
   └── setup-instructions.md
   ```

### Tarea 1.2 — Configurar la cuenta de servicio

El CoE Starter Kit necesita una cuenta de servicio dedicada para conectarse a las APIs de Power Platform y enviar correos de compliance. **No uses tu cuenta personal** — los flujos se detendrían si cambias tu contraseña o dejas la organización.

1. En el portal de Microsoft 365 Admin → **Usuarios activos** → **+ Agregar usuario**.

2. Crea el usuario:
   - Nombre: `CoE Service Account`
   - Email: `coe-service@tudominio.com`
   - Licencia: **Power Automate per user** + **Power Apps per user**

3. Asigna el rol **Power Platform Administrator** a este usuario.

4. Ve a [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) → Entornos → `CoE — Gobernanza SIT` → **Configuración** → **Usuarios + permisos** → **Usuarios** → agrega la cuenta de servicio con rol **System Administrator**.

   > Para este lab de práctica puedes usar tu propia cuenta, pero documenta que en producción se requiere la cuenta de servicio dedicada.

### Tarea 1.3 — Instalar conectores requeridos

Antes de importar la solución, verifica que estos conectores están disponibles en tu tenant (son conectores premium):

- **Power Platform for Admins** — para leer el inventario del tenant
- **Office 365 Users** — para obtener datos de los makers
- **Office 365 Outlook** — para los emails de compliance

Si el tenant tiene DLP (Data Loss Prevention) policies activas, puede que necesites crear una excepción para el ambiente del CoE.

### Validación del Ejercicio 1

- [ ] El ambiente `CoE — Gobernanza SIT` existe en el tenant
- [ ] El ZIP del CoE Starter Kit está descargado y extraído
- [ ] La cuenta de servicio tiene los permisos correctos

---

## Ejercicio 2 — Instalar el componente Core

> **Qué vas a hacer:** Importar la solución Core al ambiente CoE y configurar los flujos de sincronización del inventario del tenant.
> **Duración:** 30 min

### Tarea 2.1 — Importar la solución Core

1. Ve a [make.powerapps.com](https://make.powerapps.com) → selecciona el ambiente `CoE — Gobernanza SIT`.

2. **Soluciones** → **Importar solución** → sube el archivo `CoEStarterKit.zip`.

3. El proceso de importación mostrará una pantalla de **conexiones**. Debes crear conexiones para cada conector requerido:

   | Conector | Credencial a usar |
   |---|---|
   | Power Platform for Admins | Tu cuenta de administrador (o la cuenta de servicio) |
   | Office 365 Users | Tu cuenta de Microsoft 365 |
   | Office 365 Outlook | Tu cuenta de Microsoft 365 |
   | Microsoft Dataverse | La cuenta con rol System Admin en el ambiente CoE |

4. Crea todas las conexiones y haz clic en **Importar**.

   > La importación puede tardar 5-10 minutos. Es normal.

### Tarea 2.2 — Configurar las variables de entorno

Después de importar, la solución requiere que configures sus **Environment Variables** (variables de entorno) antes de activar los flujos.

1. En la solución importada → busca las variables de entorno (tipo "Environment Variable").

2. Configura estas variables críticas:

   | Variable | Valor |
   |---|---|
   | `Admin eMail` | Tu email de administrador (recibirás los reportes) |
   | `CoE Admin Email` | Email del CoE Lead (puede ser el mismo) |
   | `Power Automate Environment URL` | URL de tu ambiente CoE (ej: `https://org12345.crm.dynamics.com`) |
   | `PowerApp Maker environment` | Nombre del ambiente (ej: `CoE — Gobernanza SIT`) |

3. Guarda los cambios.

### Tarea 2.3 — Activar los flujos de sincronización

Los flujos del Core están desactivados por defecto para que puedas configurarlos antes de la primera ejecución.

1. En la solución → filtra por "Flujos de nube" (Cloud Flows).

2. Activa los flujos en este orden (el orden importa por dependencias):

   | Flujo | Qué hace | Activar |
   |---|---|---|
   | SYNC Flows with Dataverse | Sincroniza flujos del tenant | ✅ Primero |
   | SYNC Apps with Dataverse | Sincroniza Canvas Apps | ✅ Segundo |
   | SYNC Connectors to Dataverse | Sincroniza conectores usados | ✅ Tercero |
   | SYNC Environments with Dataverse | Sincroniza ambientes | ✅ Cuarto |
   | SYNC Makers with Dataverse | Sincroniza perfiles de makers | ✅ Quinto |

3. Una vez activados, dispara manualmente el primer flujo (`SYNC Flows with Dataverse`):
   - Abre el flujo → **Ejecutar** (Run manually)

4. Espera 10-15 minutos y luego verifica que las tablas `admin_App`, `admin_Flow`, `admin_Maker` tienen registros.

### Tarea 2.4 — Verificar la sincronización

1. En [make.powerapps.com](https://make.powerapps.com) → Dataverse → **Tablas** → busca `admin_App`.

2. Abre la tabla → **Datos** → verifica que hay registros de las apps del tenant.

3. Verifica que los campos `admin_Maker`, `admin_LastModifiedTime`, `admin_SharedWithUsers` tienen datos.

   > Si el tenant es nuevo y solo tiene las apps del CoE, los datos serán mínimos. Esto es normal.

### Validación del Ejercicio 2

- [ ] La solución `CoEStarterKit` está importada sin errores
- [ ] Las variables de entorno están configuradas
- [ ] Los 5 flujos de sincronización están activos
- [ ] La tabla `admin_App` tiene registros del inventario del tenant

---

## Ejercicio 3 — Power BI Dashboard: análisis del inventario

> **Qué vas a hacer:** Conectar el template de Power BI al ambiente CoE y usar el dashboard para identificar recursos problemáticos.
> **Duración:** 25 min

### Tarea 3.1 — Configurar el reporte de Power BI

1. Abre el archivo `PowerPlatformGovernanceDashboard.pbit` con **Power BI Desktop**.

2. Se pedirá que ingreses el parámetro de conexión:
   - **OrgUrl**: la URL de tu ambiente CoE, sin barra al final
   - Ejemplo: `https://org12345.crm.dynamics.com`

3. Haz clic en **Cargar**.

4. Power BI te pedirá autenticación → selecciona **Cuenta de organización** → inicia sesión con tu cuenta de administrador.

5. Espera a que carguen los datos. Puede tardar 2-5 minutos dependiendo del tamaño del tenant.

### Tarea 3.2 — Explorar las páginas del dashboard

El dashboard del CoE tiene varias páginas. Explora estas:

**Página: Resumen del Tenant (Overview)**

Muestra los KPIs principales:
- Total de apps en el tenant
- Total de flujos
- Total de makers (creadores únicos)
- Distribución por ambiente (cuántos recursos hay en Default vs ambientes de producción)

Anota los valores que encuentras en el resumen:

| KPI | Valor en tu tenant |
|---|---|
| Total de Canvas Apps | _______ |
| Total de Cloud Flows | _______ |
| Total de Makers | _______ |
| Apps en ambiente Default | _______ |

**Página: Apps sin dueño (Orphaned Apps)**

Esta página muestra Canvas Apps cuyo creador ya no está en el tenant (cuenta deshabilitada o eliminada) o que no han sido modificadas en más de 90 días.

1. Filtra las apps con **Última modificación > 90 días**.
2. Identifica cuántas apps tienen este problema en tu tenant.

**Página: Conectores de alto riesgo**

Muestra flows y apps que usan conectores clasificados como **High Business Impact** (HBI) — conectores que acceden a datos sensibles: SQL Server, SharePoint, Dataverse, HTTP, etc.

1. Ordena por número de usuarios — las más compartidas con conectores de alto riesgo son las más críticas para auditar.

### Tarea 3.3 — Publicar el reporte en Power BI Service

1. En Power BI Desktop → **Archivo** → **Publicar** → **Publicar en Power BI**.

2. Selecciona un workspace (o "Mi área de trabajo" para el lab).

3. Una vez publicado, ve a [app.powerbi.com](https://app.powerbi.com) y verifica que el dashboard es accesible.

4. Configura la actualización programada:
   - En Power BI Service → dataset → **Programar actualización**
   - Frecuencia: **Diaria** a las 6:00 AM
   - Credenciales: la cuenta de servicio del CoE

### Validación del Ejercicio 3

- [ ] El dashboard de Power BI carga datos del ambiente CoE
- [ ] La página de Resumen muestra KPIs del tenant
- [ ] Se puede filtrar la página de "Apps sin dueño" por fecha de modificación
- [ ] El reporte está publicado en Power BI Service con actualización programada

---

## Ejercicio 4 — Proceso de Compliance

> **Qué vas a hacer:** Entender y configurar el flujo de Compliance del kit, que detecta apps críticas sin documentación y solicita metadatos a sus creadores.
> **Duración:** 25 min

### Tarea 4.1 — Entender el flujo de Compliance

El **Compliance Process** del CoE funciona así:

```
[Flujo programado semanal]
       ↓
Lee tabla admin_App → filtra apps con más de 20 usuarios Y sin metadatos
       ↓
Envía email/Teams al maker: "Tu app tiene impacto organizacional. Por favor classifícala."
       ↓
Maker responde en Canvas App "DLP Impact UI" (incluida en el kit):
  - ¿Es una app de negocio crítica? (Sí/No)
  - ¿Tiene dueño de negocio asignado? (nombre + email)
  - ¿Qué datos maneja? (clasificación de sensibilidad)
       ↓
Si el maker no responde en 2 semanas → segunda notificación
Si no responde en 4 semanas → la app se mueve a "Cuarentena" (no se puede ejecutar)
```

### Tarea 4.2 — Configurar el umbral de "impacto organizacional"

1. En la solución CoE → busca el flujo `Admin | App Archive and Clean Up — Set Archive Approval`.

2. Abre el flujo y localiza el nodo donde se filtra por número de usuarios compartidos.

3. Modifica el filtro: en lugar de 20 usuarios, usa **5 usuarios** para este lab (así verás resultados más rápido en un tenant de prueba).

4. Guarda el flujo.

### Tarea 4.3 — Probar el proceso de notificación (simulado)

1. En la solución → busca la Canvas App `Admin — Power Platform Admin View`.

2. Ábrela → navega a la sección de **Aplicaciones**.

3. Busca una app del inventario y ábrela para ver su ficha.

4. En la ficha, encuentra el campo `Admin_AppIsExcluded` y los campos de clasificación.

5. Marcando `Admin_AppIsExcluded = True` puedes excluir una app específica del proceso de compliance (útil para apps del propio CoE).

### Tarea 4.4 — Revisar las columnas de clasificación en admin_App

El resultado del Compliance Process llena estas columnas en la tabla `admin_App`:

| Columna | Significado |
|---|---|
| `admin_BusinessCritical` | El maker confirmó que es crítica para el negocio |
| `admin_BusinessOwner` | Nombre y email del responsable de negocio |
| `admin_DataClassification` | Clasificación de sensibilidad de datos que maneja |
| `admin_IsExcluded` | Excluida del proceso (apps del sistema) |
| `admin_LastComplianceCheckDate` | Última vez que se envió la solicitud de compliance |

Estos metadatos alimentan el Power BI dashboard y permiten al arquitecto tomar decisiones basadas en datos.

### Validación del Ejercicio 4

- [ ] Comprendes el ciclo completo del Compliance Process (detección → notificación → cuarentena)
- [ ] La Canvas App `Admin — Power Platform Admin View` está accesible
- [ ] Puedes ver y editar la ficha de una app en el inventario
- [ ] Comprendes las columnas de clasificación y su impacto en el dashboard

---

## Ejercicio 5 — Environment Request Process y visión del componente Governance

> **Qué vas a hacer:** Explorar el Environment Request Process (cómo los equipos solicitan nuevos ambientes de forma controlada) y hacer un walkthrough de las capacidades del componente Governance sin instalación completa.
> **Duración:** 30 min

### Tarea 5.1 — Environment Request Process

El **Environment Request Process** resuelve el problema de proliferación descontrolada de ambientes. Sin él, cualquier administrador puede crear ambientes sin justificación, y el tenant acaba con decenas de ambientes huérfanos.

Con el proceso activado:

```
[Equipo de negocio]
       ↓
Llena Canvas App "Environment Request" con:
  - Nombre del ambiente solicitado
  - Propósito del ambiente (Dev/Test/Prod/CoE)
  - Dueño técnico (email)
  - Justificación de negocio
       ↓
Power Automate envía la solicitud al CoE Lead para aprobación
       ↓
CoE Lead aprueba/rechaza con comentario
       ↓
Si aprobado: Power Automate crea el ambiente automáticamente usando la API de administración
Si rechazado: email de rechazo con razón al solicitante
```

**Para explorar el formulario de solicitud:**

1. En la solución CoE → busca la Canvas App `App — Environment Request`.

2. Ábrela en modo previsualización.

3. Observa los campos del formulario y las opciones de tipo de ambiente.

4. Identifica cómo el formulario valida que el solicitante tiene una justificación de negocio antes de enviar la solicitud.

### Tarea 5.2 — Walkthrough del componente Governance

El componente **Governance** del CoE incluye capacidades avanzadas que requieren configuración adicional. Para este lab, hacemos un walkthrough conceptual:

**App Quarantine (Cuarentena)**

Cuando una app entra en cuarentena, los usuarios que intentan abrirla ven un mensaje: "Esta app está temporalmente deshabilitada por el equipo de TI. Contacta al administrador." El creador recibe un email indicando que debe tomar acción para recuperarla.

El flujo de cuarentena usa la API REST de Power Platform:
```
PATCH https://api.powerapps.com/providers/Microsoft.PowerApps/apps/{appId}
Body: { "properties": { "quarantineEnabled": true } }
```

**Maker Nurture — Welcome Email**

Cuando un nuevo usuario crea su primera app o flujo, el componente Nurture le envía automáticamente un email de bienvenida con:
- Link a los recursos de entrenamiento de la organización
- Link al portal de solicitud de ambientes
- Contacto del CoE para preguntas

**Governance Score**

El dashboard muestra un **Governance Score** por ambiente (0-100) que mide:
- % de apps con dueño de negocio asignado
- % de makers que completaron el training
- % de ambientes con políticas DLP activas
- % de apps sin actividad en los últimos 90 días que fueron archivadas

### Tarea 5.3 — Definir la estrategia de DLP para SIT

Como arquitecto de soluciones, debes definir qué conectores pueden usarse juntos en los flujos del tenant. Las **DLP Policies (Data Loss Prevention)** son la herramienta para esto.

Diseña la política DLP para SIT en papel (o en un documento):

**Política: `DLP — Datos Internos SIT`**

| Grupo | Conectores incluidos | Justificación |
|---|---|---|
| **Business (Datos del negocio)** | Dataverse, SharePoint, Teams, Office 365 Outlook, Approvals | Conectores internos Microsoft 365 — pueden coexistir |
| **Non-Business (Solo no empresarial)** | Twitter, RSS, Weather | Conectores de entretenimiento — no deben mezclar con datos corporativos |
| **Blocked (Bloqueados)** | HTTP (con autenticación), Custom Connectors (sin aprobación) | Evitan exfiltración de datos a endpoints externos |

Esta política impide que un flujo combine Dataverse (datos sensibles) con HTTP (endpoint externo arbitrario) — un vector común de fuga de datos.

### Validación del Ejercicio 5

- [ ] Exploraste la Canvas App `App — Environment Request` y comprendes el flujo de aprobación
- [ ] Entiendes cómo funciona la cuarentena de apps y qué experiencia ve el usuario final
- [ ] Puedes explicar el concepto de Governance Score y qué métricas lo componen
- [ ] Diseñaste (en papel) una política DLP con 3 grupos para el tenant SIT

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Error de importación: "Missing required connections" | Las conexiones no están creadas antes de importar | Crea las conexiones manualmente en make.powerapps.com/connections antes de importar |
| Los flujos de sync no sincronizan nada | DLP policy bloquea el conector `Power Platform for Admins` | Crea una excepción DLP para el ambiente CoE o agrega el conector al grupo Business |
| Power BI no puede conectarse a Dataverse | La cuenta de Power BI Desktop no tiene acceso al ambiente CoE | Usa la misma cuenta que es System Admin en el ambiente CoE |
| La tabla admin_App tiene solo 5 registros | Los flujos de sync no terminaron o solo se ejecutaron parcialmente | Espera 30 min y ejecuta los flujos en secuencia manualmente |
| El Compliance Process no envía emails | La variable de entorno `Admin eMail` está vacía o incorrecta | Verifica y actualiza la variable de entorno en la solución CoE |
| Error 403 al activar flujos de Admin | La cuenta usada no tiene el rol Power Platform Administrator | Asigna el rol correcto en admin.powerplatform.microsoft.com |

---

## Checklist final

- [ ] Ambiente `CoE — Gobernanza SIT` creado como Sandbox con Dataverse
- [ ] Solución `CoEStarterKit` importada sin errores de conexión
- [ ] Variables de entorno configuradas (Admin email, URLs)
- [ ] 5 flujos de sincronización activos y ejecutados al menos una vez
- [ ] Tabla `admin_App` con registros del inventario del tenant
- [ ] Power BI dashboard cargando datos del ambiente CoE
- [ ] Reporte publicado en Power BI Service con actualización programada
- [ ] Proceso de Compliance comprendido: ciclo detección → notificación → cuarentena
- [ ] Canvas App `App — Environment Request` explorada
- [ ] Estrategia DLP diseñada con 3 grupos para el tenant SIT

---

## Reto adicional

**Reto básico:** Crea una **vista personal** en la tabla `admin_App` de Dataverse que muestre solo las apps con `admin_BusinessCritical = true` y más de 50 usuarios. Agrega esta vista al portal de administrador del CoE.

**Reto intermedio:** Automatiza el **reporte semanal de gobernanza** para el CTO de SIT: crea un flujo programado que cada lunes a las 8 AM genere un email con el Governance Score del tenant y adjunte una tabla de las 10 apps más riesgosas (por número de usuarios y tipo de conector).

**Reto avanzado:** Implementa el **Maker Portal completo** del componente Nurture: personaliza el Welcome Email con el logo de SIT, agrega un link al repositorio de templates de solución aprobados, y configura el proceso de solicitud de entrenamiento (un maker puede pedir acceso al curso PL-900 directamente desde el portal).

---

## Preguntas de repaso

1. ¿Por qué el CoE Starter Kit debe instalarse en un ambiente **separado** y no en el Default?
2. ¿Cuál es la diferencia entre el componente **Core**, **Governance** y **Nurture**?
3. ¿Qué es una política **DLP** y cómo protege los datos del tenant?
4. ¿Cuándo es apropiado mover una app a **Cuarentena** versus simplemente eliminarla?

---

## Limpieza del laboratorio

> El ambiente del CoE consume capacidad Dataverse del tenant. Para liberar espacio:

1. [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) → **Entornos** → selecciona `CoE — Gobernanza SIT`.
2. Haz clic en **Eliminar** → confirma.

> ⚠️ Eliminar el ambiente elimina todos los datos del inventario sincronizado. Si tienes datos valiosos de gobernanza, exporta el reporte de Power BI antes.

---

## Siguiente laboratorio recomendado

Con el Lab 32 completado has terminado el recorrido de los labs fundamentales del sprint 1 y sprint 2.

**Ruta de profundización sugerida:**

- ➡️ **Lab 11 — Power Automate Avanzado** (HTTP, Dataverse Triggers, Error Handling enterprise)
- ➡️ **Lab 31 — Arquitectura Empresarial** (diseñar la arquitectura multi-ambiente para SIT a escala)

**Por qué ir ahí:** El Lab 31 te da el marco conceptual para justificar las decisiones de arquitectura que el Lab 32 implementa — estrategia de ambientes, modelo de seguridad, segregación de datos por región.

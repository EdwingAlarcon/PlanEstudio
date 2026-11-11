---
id: lab-23
title: "Plugin C# — Validación Server-Side y Auditoría Personalizada"
level: "N3"
duration: 180
product: ["Dataverse SDK", "C#", "Plugin Registration Tool"]
certifications: ["PL-400"]
role: ["Developer"]
prerequisites:
  - "Lab 02 y Lab 09 completados — tabla Solicitud TI (sit_solicitud) con sit_prioridad, sit_estado y sit_costoestimado (Lab 09)"
  - "Columna Autonumber Número de Solicitud del Módulo 7 (si no la tienes, la Tarea 2.1 explica cómo crearla)"
  - "Visual Studio 2022 con la carga de trabajo de escritorio .NET y el paquete de desarrollo de .NET Framework 4.8, o el .NET SDK 8 o posterior para trabajar con pac plugin init, dotnet build y dotnet test"
  - "Power Platform CLI (pac) instalado, para abrir el Plugin Registration Tool con pac tool prt"
  - "Módulo 23 estudiado: C# Plugins para Dataverse"
lastVerified: "2026-11"
---

# Lab 23 — Plugin C#: Validación Server-Side y Auditoría Personalizada (SIT)

## Objetivo

Al finalizar este laboratorio podrás desarrollar, registrar y probar dos plugins C# en Dataverse: un plugin de Create registrado en dos steps (uno en PreValidation que cancela las solicitudes Críticas sin presupuesto y otro en PreOperation que calcula la fecha de vencimiento), y un plugin PostOperation de Update que registra una auditoría de negocio cuando cambia el estado de una solicitud.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación de Labs 02, 05 y 09

**Problema a resolver:**
1. **Las Business Rules del Lab 02** protegen en formularios de UI, pero no en la API, Power Automate ni integraciones. Un técnico que llama directamente a la API de Dataverse puede crear solicitudes Críticas sin presupuesto, saltándose la validación.
2. **El historial de auditoría nativo** de Dataverse registra todos los campos — demasiado ruido. Se necesita un log de negocio que registre solo los cambios de estado con contexto: quién, cuándo, de qué estado a cuál.
3. **Los números de solicitud** se asignaban a mano y había duplicados. Ya lo resolviste sin código en el Módulo 7 con una columna **Autonumber** (`SOL-001000`, `SOL-001001`…): Dataverse genera la parte secuencial en la base de datos y garantiza que no se repite. En este lab **no** la reemplazas con un plugin: compruebas que convive con tus plugins.

**Por qué Plugin C#:** Los plugins se ejecutan **en el pipeline de Dataverse en el servidor**, independientemente de la interfaz usada (UI, API, Power Automate, importación de datos). Es la forma de garantizar que la validación y la auditoría se aplican en todos los canales.

> **¿Por qué no numerar desde el plugin?** Un plugin que busca "el último número + 1" tiene una condición de carrera: dos creaciones simultáneas leen el mismo último número y ambas guardan el mismo. La columna Autonumber no tiene ese problema ([Learn: crear columnas Autonumber](https://learn.microsoft.com/power-apps/developer/data-platform/create-auto-number-attributes)).

## Lo que vas a construir

- **Proyecto C#** `SIT.Plugins` (.NET Framework 4.8, firmado) y proyecto de pruebas `SIT.Plugins.Tests`
- **`SolicitudPreCreatePlugin`**, registrado en **dos steps** de Create:
  - PreValidation (10): cancela las solicitudes Críticas sin Costo Estimado
  - PreOperation (20): calcula `sit_fechavencimiento` según la prioridad
- **`SolicitudPostUpdatePlugin`** (PostOperation, 40): registra cambios reales de estado en `sit_auditoriasolicitud`, escribiendo como SYSTEM
- **Registro en PRT**: steps con Filtering Attributes y una Pre Image
- **Tests unitarios** con MSTest y Moq para los dos plugins

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Configurar proyecto Visual Studio | 35 min |
| Ejercicio 2 — Plugin de Create: validar y calcular | 30 min |
| Ejercicio 3 — Plugin PostUpdate: auditoría | 30 min |
| Ejercicio 4 — Registrar en Plugin Registration Tool y probar (incluye retirar el ensamblado del Módulo 23, si lo tienes) | 50 min |
| Ejercicio 5 — Tests unitarios con Moq | 35 min |
| **Total** | **180 min** |

> Si es la primera vez que compilas y registras un plugin, cuenta con bastante más: instalar herramientas, firmar y resolver el primer error de registro lleva su tiempo.

## Nivel

**N3 Avanzado** — Certificación objetivo: **PL-400**

## Tecnologías utilizadas

- C# sobre .NET Framework 4.8 (Dataverse admite de 4.6.2 a 4.8 y recomienda 4.8)
- Dataverse SDK (`Microsoft.CrmSdk.CoreAssemblies`)
- Plugin Registration Tool (PRT)
- MSTest + Moq
- Visual Studio 2022
- Power Platform CLI (`pac`)

## Prerrequisitos

### Entorno

- [ ] Visual Studio 2022 (Community, Professional o Enterprise) con la carga de trabajo **.NET desktop development**
- [ ] Paquete de desarrollo (Developer Pack) de **.NET Framework 4.8** instalado
- [ ] *Alternativa sin Visual Studio:* el **.NET SDK** 8 o posterior. Creas el proyecto con `pac plugin init`, compilas con `dotnet build` y ejecutas las pruebas con `dotnet test`, como en el Módulo 23. En ese caso no necesitas los dos puntos anteriores.
- [ ] Plugin Registration Tool: en una terminal, `pac tool prt` lo descarga la primera vez y lo abre
- [ ] Tabla Solicitud TI (`sit_solicitud`) del Lab 02 con las columnas `sit_prioridad` y `sit_estado`, y `sit_costoestimado` del Lab 09
- [ ] **Si hiciste las Microlecciones 2 y 3 del Módulo 23 en este mismo ambiente:** ya tienes registrado un ensamblado `SIT.Plugins` con tres steps que hacen lo mismo que este lab. Antes de registrar el del lab lo vas a retirar (Tarea 4.3, paso 1). Si no lo retiras, cada cambio de estado crea **dos** filas de auditoría.

### Tabla adicional que debes crear antes de empezar

Crea en tu solución la tabla de auditoría que usará el plugin PostUpdate, igual que creaste las del Lab 02: **Display name** = `Auditoria Solicitud`, **Plural display name** = `Auditorias Solicitud`; en **Advanced options**, **Schema name** = `auditoriasolicitud` (resultado `sit_auditoriasolicitud`) y **Record ownership** = **Organization** > **Save**. Si ya la creaste en la Microlección 3 del Módulo 23, reutilízala.

Columnas:

| Display name | Schema name (escribe solo esto) | Resultado | Data type |
|---|---|---|---|
| Solicitud | `solicitud` | `sit_solicitud` | Lookup → Solicitud TI |
| Estado Anterior | `estadoanterior` | `sit_estadoanterior` | Single line of text |
| Estado Nuevo | `estadonuevo` | `sit_estadonuevo` | Single line of text |
| Usuario | `usuario` | `sit_usuario` | Lookup → User |
| Fecha | `fecha` | `sit_fecha` | Date and time |

> **📌 Cierra el ciclo con el Lab 04:** vuelve al rol de seguridad **SIT Técnico TI** que creaste en el Lab 04
> (Tarea 5.2) y agrega esta tabla con **Read** = Organization, sin Create ni Write. Es a propósito: la auditoría
> la escribe el plugin, no el técnico. Por eso, en el Ejercicio 3, el plugin crea la fila como SYSTEM.

---

## Datos de apoyo

### Valores de las columnas Choice para el código C#

Antes de escribir el plugin, anota el número (**Value**) de cada opción. En make.powerapps.com, en tu solución, abre la tabla **Solicitud TI** > **Columns** > abre **Prioridad** (y luego **Estado**): junto a cada opción se ve su valor numérico.

| Prioridad | Valor numérico |
|---|---|
| Baja | Anota: ___ |
| Media | Anota: ___ |
| Alta | Anota: ___ |
| Crítica | Anota: ___ |

| Estado | Valor numérico |
|---|---|
| Nueva | Anota: ___ |
| En Proceso | Anota: ___ |
| Resuelta | Anota: ___ |
| Cerrada | Anota: ___ |
| Aprobada | Anota: ___ |
| Rechazada | Anota: ___ |

> **¿Por qué anotar estos valores?** Los plugins leen las opciones por su valor entero (`OptionSetValue.Value`), no por su etiqueta. Dataverse genera esos números a partir del Choice value prefix de tu publisher (Lab 02), así que **los números `10000000x` del código de este lab son ilustrativos**: cámbialos por los tuyos. Si usas un valor equivocado, la validación no salta y no hay ningún error que te avise.

---

## Ejercicio 1 — Configurar proyecto Visual Studio

> **Qué vas a hacer:** Crear la solución C# con un proyecto de plugins firmado y un proyecto de pruebas, e instalar el SDK de Dataverse.
> **Duración:** 25 min

### Tarea 1.1 — Crear la solución y el proyecto

1. Abre Visual Studio 2022 y elige **Create a new project** (crear un proyecto nuevo).

2. Busca y selecciona la plantilla **Class Library (.NET Framework)** en C# (fíjate en que diga **.NET Framework**, no solo "Class Library") > **Next**. Configura:

   | Campo | Valor |
   |---|---|
   | Project name | `SIT.Plugins` |
   | Solution name | `SIT.Plugins` |
   | Location | Tu carpeta de proyectos |
   | Framework | .NET Framework 4.8 |

3. Haz clic en **Create**.

4. En **Solution Explorer**, elimina el archivo `Class1.cs` que genera la plantilla (clic derecho > **Delete**).

> *Alternativa sin Visual Studio para crear el proyecto:* `pac plugin init --outputDirectory SIT.Plugins` genera un proyecto ya firmado (Módulo 23, Microlección 2). Si lo usas, borra `Plugin1.cs`, sáltate las Tareas 1.2 y 1.3 (el proyecto ya trae `Microsoft.CrmSdk.CoreAssemblies` y la firma) y revisa en el `.csproj` que el `TargetFramework` sea un .NET Framework entre 4.6.2 y 4.8 (`pac` pone `net48`). Puedes partir de una carpeta nueva o reutilizar el proyecto del Módulo 23: en ese caso, borra sus clases (`SolicitudValidarCreatePlugin`, `SolicitudCalcularVencimientoPlugin`, `SolicitudAuditarEstadoPlugin`) y reemplaza su `SolicitudValores.cs` por el de la Tarea 2.2.

### Tarea 1.2 — Instalar el SDK de Dataverse

1. En **Solution Explorer**, clic derecho en el proyecto `SIT.Plugins` > **Manage NuGet Packages…**

2. En la pestaña **Browse**, busca `Microsoft.CrmSdk.CoreAssemblies` e instala la versión estable más reciente.

3. En el diálogo **License Acceptance**, elige **I Accept**.

   > ⚠️ **Usa .NET Framework (de 4.6.2 a 4.8; Microsoft recomienda 4.8).** Dataverse no registra ni ejecuta plugins compilados para .NET Core, .NET 5 o posterior, ni .NET Standard. Los ensamblados del SDK que instala este paquete ya están en el sandbox: no los subas con tu ensamblado.

### Tarea 1.3 — Firmar el ensamblado

El Plugin Registration Tool no registra un ensamblado sin firmar (strong name).

1. En **Solution Explorer**, clic derecho en `SIT.Plugins` > **Properties**.
2. Selecciona la pestaña **Signing** y marca **Sign the assembly**.
3. En **Choose a strong name key file**, elige **&lt;New…&gt;**.
4. En el diálogo **Create Strong Name Key**, escribe un nombre de archivo (por ejemplo `SIT.Plugins`) y desmarca **Protect my key file with a password** > **OK**.

**Qué deberías ver:** un archivo `.snk` nuevo en el proyecto, en **Solution Explorer**.

### Tarea 1.4 — Agregar el proyecto de pruebas

1. Clic derecho en la **Solución** (no en el proyecto) > **Add** > **New Project**.

2. Selecciona otra vez **Class Library (.NET Framework)**: **Project name** = `SIT.Plugins.Tests`, **Framework** = .NET Framework 4.8 > **Create**.

3. En `SIT.Plugins.Tests`, instala vía NuGet:
   - `MSTest.TestFramework` y `MSTest.TestAdapter` (el framework de pruebas y su adaptador para **Test Explorer**)
   - `Microsoft.NET.Test.Sdk`
   - `Moq`
   - `Microsoft.CrmSdk.CoreAssemblies` (misma versión que el proyecto principal)

4. Agrega la referencia al proyecto principal: clic derecho en `SIT.Plugins.Tests` > **Add** > **Project Reference**; en **Reference Manager**, en **Projects** > **Solution**, marca `SIT.Plugins` > **OK**.

5. Elimina el `Class1.cs` de este proyecto.

> El proyecto de pruebas no necesita firmarse: nunca se registra en Dataverse.

> *Alternativa sin Visual Studio:* crea la carpeta `SIT.Plugins.Tests` junto a `SIT.Plugins` con el archivo `SIT.Plugins.Tests.csproj` de la Microlección 4 del Módulo 23 (ya trae MSTest, Moq, el SDK de Dataverse y la referencia al proyecto). Si hiciste esa microlección, puedes reutilizar el proyecto de pruebas: borra su `SolicitudPluginsTests.cs`, porque el Ejercicio 5 lo reemplaza con uno del mismo nombre.

---

## Ejercicio 2 — Plugin de Create: validar y calcular

> **Qué vas a hacer:** Implementar un plugin que corre en dos momentos del Create: en **PreValidation**, antes de la transacción, cancela las solicitudes Críticas sin presupuesto; en **PreOperation**, dentro de la transacción, escribe la fecha de vencimiento en el Target.
> **Duración:** 30 min

**¿Por qué dos etapas?** Learn recomienda cancelar en **PreValidation** (antes de la transacción: cancelar ahí no obliga a deshacer nada) y cambiar valores del Target en **PreOperation**. Cancelar en PreOperation fuerza un rollback de la transacción, que cuesta rendimiento ([Learn: Register a plug-in](https://learn.microsoft.com/power-apps/developer/data-platform/register-plug-in#event-pipeline-stage-of-execution)). Una misma clase puede registrarse en varios steps; el código decide qué hacer según `context.Stage`.

### Tarea 2.1 — Preparar las columnas

1. **Fecha Vencimiento:** en make.powerapps.com, en tu solución, abre la tabla **Solicitud TI** > **Columns** > **New column**: **Display name** = `Fecha Vencimiento`, **Data type** = **Date and time**; en **Advanced options** > **Schema name** escribe solo `fechavencimiento` (resultado `sit_fechavencimiento`) > **Save**. Si ya la creaste en el Módulo 23, reutilízala.

2. **Número de Solicitud (Autonumber):** comprueba que la tabla tiene la columna **Número de Solicitud** del Módulo 7. Si no la tienes, créala: **New column** > **Display name** = `Número de Solicitud`, **Data type** = **Autonumber**; tipo de autonumeración **Custom** con el formato `SOL-{SEQNUM:6}` > **Done** > **Save Table**. El plugin no la toca: Dataverse la rellena sola al crear cada fila.

### Tarea 2.2 — Centralizar los valores de las opciones

En el proyecto `SIT.Plugins`, clic derecho > **Add** > **Class…** > nombre `SolicitudValores.cs`:

```csharp
namespace SIT.Plugins
{
    // Valores de tus columnas Choice. Los 10000000x son ILUSTRATIVOS: pon los que anotaste en "Datos de apoyo".
    public static class SolicitudValores
    {
        public const int PRIORIDAD_BAJA    = /* TU VALOR */ 100000000;
        public const int PRIORIDAD_MEDIA   = /* TU VALOR */ 100000001;
        public const int PRIORIDAD_ALTA    = /* TU VALOR */ 100000002;
        public const int PRIORIDAD_CRITICA = /* TU VALOR */ 100000003;

        public const int ESTADO_NUEVA      = /* TU VALOR */ 100000000;
        public const int ESTADO_EN_PROCESO = /* TU VALOR */ 100000001;
        public const int ESTADO_RESUELTA   = /* TU VALOR */ 100000002;
        public const int ESTADO_CERRADA    = /* TU VALOR */ 100000003;
        public const int ESTADO_APROBADA   = /* TU VALOR */ 100000004;
        public const int ESTADO_RECHAZADA  = /* TU VALOR */ 100000005;

        // Etiqueta legible para la auditoría; si llega un valor desconocido, deja el número
        public static string NombreEstado(int? valor)
        {
            if (!valor.HasValue) return "(vacío)";
            switch (valor.Value)
            {
                case ESTADO_NUEVA:      return "Nueva";
                case ESTADO_EN_PROCESO: return "En Proceso";
                case ESTADO_RESUELTA:   return "Resuelta";
                case ESTADO_CERRADA:    return "Cerrada";
                case ESTADO_APROBADA:   return "Aprobada";
                case ESTADO_RECHAZADA:  return "Rechazada";
                default:                return valor.Value.ToString();
            }
        }
    }
}
```

> Si dos constantes de la misma columna tienen el mismo número, el `switch` no compila (`case` duplicado): es una buena señal de que copiaste mal algún valor.

### Tarea 2.3 — Implementar el plugin

Agrega la clase `SolicitudPreCreatePlugin.cs`:

```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace SIT.Plugins
{
    /// <summary>
    /// Create de sit_solicitud, registrado en DOS steps síncronos:
    ///  - PreValidation (10): cancela si una Crítica no trae Costo Estimado.
    ///  - PreOperation (20): calcula sit_fechavencimiento en el Target.
    /// No guarda estado en campos: Dataverse reutiliza la instancia entre ejecuciones.
    /// </summary>
    public class SolicitudPreCreatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Depth solo se escribe en el trace como dato de diagnóstico: el código NO decide nada con él
            tracer.Trace("SolicitudPreCreatePlugin — Message: {0}, Stage: {1}, Depth: {2}",
                context.MessageName, context.Stage, context.Depth);

            // Guardas: mensaje, Target y tabla correctos
            if (context.MessageName != "Create") return;
            if (!context.InputParameters.Contains("Target")) return;
            var solicitud = context.InputParameters["Target"] as Entity;
            if (solicitud == null || solicitud.LogicalName != "sit_solicitud") return;

            switch (context.Stage)
            {
                case 10: // PreValidation
                    ValidarCostoEnCriticas(tracer, solicitud);
                    break;
                case 20: // PreOperation
                    CalcularFechaVencimiento(tracer, solicitud);
                    break;
                default:
                    tracer.Trace("Etapa {0} no esperada: revisa el registro del step en el PRT.", context.Stage);
                    break;
            }
        }

        private static void ValidarCostoEnCriticas(ITracingService tracer, Entity solicitud)
        {
            // GetAttributeValue devuelve null si la columna no vino en el Target
            var prioridad = solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad");
            var costo = solicitud.GetAttributeValue<Money>("sit_costoestimado");

            bool esCritica = prioridad != null && prioridad.Value == SolicitudValores.PRIORIDAD_CRITICA;
            tracer.Trace("Validar: prioridad={0}, crítica={1}, costo={2}", prioridad?.Value, esCritica, costo?.Value);

            if (esCritica && (costo == null || costo.Value <= 0))
            {
                // Síncrono: la operación se cancela y el usuario ve este texto
                throw new InvalidPluginExecutionException(
                    "Las solicitudes con prioridad Crítica deben tener un Costo Estimado mayor que cero. " +
                    "Ingresa el presupuesto estimado antes de guardar.");
            }
        }

        private static void CalcularFechaVencimiento(ITracingService tracer, Entity solicitud)
        {
            int? prioridad = solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad")?.Value;

            // Mismos plazos que la regla de SLA Horas del Lab 02
            int horas;
            switch (prioridad)
            {
                case SolicitudValores.PRIORIDAD_CRITICA: horas = 4;  break;
                case SolicitudValores.PRIORIDAD_ALTA:    horas = 8;  break;
                case SolicitudValores.PRIORIDAD_BAJA:    horas = 48; break;
                default:                                 horas = 24; break; // Media, o sin prioridad (Media es la opción por defecto)
            }

            // En PreOperation basta con escribir en el Target: se guarda con el mismo Create, sin un Update extra
            DateTime vencimiento = DateTime.UtcNow.AddHours(horas);
            solicitud["sit_fechavencimiento"] = vencimiento;
            tracer.Trace("Vencimiento calculado: +{0} h ({1:u})", horas, vencimiento);
        }
    }
}
```

> **¿Por qué `GetAttributeValue<T>()`?** Devuelve el valor si la columna vino en el Target, o `null`/`default(T)` si no vino. Leer por índice (`solicitud["campo"]`) lanza `KeyNotFoundException` cuando la columna no se envió.

> **¿Por qué `throw new InvalidPluginExecutionException`?** Es la excepción para errores de negocio: en un plugin síncrono cancela la operación y el usuario ve tu mensaje. Cualquier otra excepción sin controlar también cancela, pero el usuario ve un error genérico.

> **¿Y la recursión?** Este plugin no hace ningún `Update` ni `Create`: solo modifica el Target en memoria, así que no puede disparar otra vez su propio step. No pongas `if (context.Depth > 1) return;`: Microsoft pide no depender de Depth ([Learn: IExecutionContext.Depth](https://learn.microsoft.com/dotnet/api/microsoft.xrm.sdk.iexecutioncontext.depth)), y una solicitud creada por un flujo o por otro plugin llega con Depth > 1: ese `return` la dejaría **sin validar**, justo el hueco que este lab quiere cerrar.

Compila (**Build** > **Build Solution**, `Ctrl + Shift + B`). **Qué deberías ver:** `Build succeeded` en la ventana **Output**. Si falla con "the type or namespace name 'IPlugin' could not be found", falta el paquete NuGet de la Tarea 1.2.

---

## Ejercicio 3 — Plugin PostUpdate: auditoría

> **Qué vas a hacer:** Implementar el plugin que se ejecuta después de que Dataverse aplica un Update, compara el estado nuevo con el anterior (Pre Image) y, si cambió de verdad, crea la fila de auditoría como SYSTEM.
> **Duración:** 30 min

### Tarea 3.1 — Crear la clase del plugin

En `SIT.Plugins`, nueva clase: `SolicitudPostUpdatePlugin.cs`.

### Tarea 3.2 — Implementar el plugin

```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace SIT.Plugins
{
    /// <summary>
    /// Update de sit_solicitud · Filtering Attributes: sit_estado · PostOperation (40) · Synchronous.
    /// Requiere una Pre Image con Entity Alias "PreImage" y Parameters = sit_estado.
    /// </summary>
    public class SolicitudPostUpdatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            tracer.Trace("SolicitudPostUpdatePlugin — Message: {0}, Stage: {1}, Depth: {2}",
                context.MessageName, context.Stage, context.Depth);

            if (context.MessageName != "Update" || context.Stage != 40) return;
            if (!context.InputParameters.Contains("Target")) return;
            var target = context.InputParameters["Target"] as Entity;
            if (target == null || target.LogicalName != "sit_solicitud") return;

            // En un Update, el Target solo trae las columnas enviadas
            if (!target.Contains("sit_estado"))
            {
                tracer.Trace("sit_estado no viene en la petición: no se audita.");
                return;
            }

            if (!context.PreEntityImages.Contains("PreImage"))
            {
                tracer.Trace("Falta la Pre Image 'PreImage' en el step: revisa el registro en el PRT.");
                return;
            }

            int? anterior = context.PreEntityImages["PreImage"].GetAttributeValue<OptionSetValue>("sit_estado")?.Value;
            int? nuevo = target.GetAttributeValue<OptionSetValue>("sit_estado")?.Value;

            // Filtering Attributes dispara el step si sit_estado viene en la petición, aunque no cambie:
            // esta comparación con la Pre Image es la que evita auditorías (y bucles) sin cambio real
            if (anterior == nuevo)
            {
                tracer.Trace("Estado sin cambio real ({0}): no se audita.", nuevo);
                return;
            }

            // El rol SIT Técnico TI solo tiene Read sobre sit_auditoriasolicitud (Lab 04): la fila se crea como SYSTEM.
            // null = SYSTEM. Solo esta operación se eleva; el resto del plugin no escribe nada.
            IOrganizationService servicioSistema = serviceFactory.CreateOrganizationService(null);

            var auditoria = new Entity("sit_auditoriasolicitud");
            auditoria["sit_solicitud"] = new EntityReference("sit_solicitud", context.PrimaryEntityId);
            auditoria["sit_estadoanterior"] = SolicitudValores.NombreEstado(anterior);
            auditoria["sit_estadonuevo"] = SolicitudValores.NombreEstado(nuevo);
            // InitiatingUserId = quien hizo el cambio. La fila la crea SYSTEM, así que su Created By no sirve para esto
            auditoria["sit_usuario"] = new EntityReference("systemuser", context.InitiatingUserId);
            auditoria["sit_fecha"] = DateTime.UtcNow;

            Guid id = servicioSistema.Create(auditoria);
            tracer.Trace("Auditoría {0}: {1} -> {2}", id, anterior, nuevo);
        }
    }
}
```

> **¿Por qué `CreateOrganizationService(null)` y no `context.UserId`?** Con `context.UserId` la fila se crearía con los permisos del usuario, y el técnico no tiene Create sobre la tabla de auditoría: su cambio de estado fallaría con un error de privilegios. Con `null`, la llamada se hace como SYSTEM ([Learn: CreateOrganizationService](https://learn.microsoft.com/dotnet/api/microsoft.xrm.sdk.iorganizationservicefactory.createorganizationservice)). Eleva solo lo imprescindible y déjalo comentado.

> **¿Por qué `context.InitiatingUserId` y no `context.UserId`?** `UserId` es el usuario con el que corre el step (el de **Run in User's Context**, por defecto quien llama). `InitiatingUserId` es quien originó la acción, aunque el step corra con otro usuario: es el que interesa en la auditoría.

> **¿Por qué no hay riesgo de bucle?** El plugin no actualiza `sit_solicitud`: crea una fila en otra tabla. Y aunque alguien enviara un Update con el mismo estado, la comparación con la Pre Image corta antes de escribir. Eso, junto con Filtering Attributes, es la protección; no `context.Depth`.

> **¿Por qué síncrono en PostOperation?** Así la fila de auditoría forma parte de la misma transacción: si otro plugin cancela el Update, la auditoría también desaparece.

Compila de nuevo. **Qué deberías ver:** `Build succeeded`.

---

## Ejercicio 4 — Registrar en Plugin Registration Tool y probar

> **Qué vas a hacer:** Conectar al ambiente Dataverse, registrar el ensamblado y sus tres steps (dos de Create y uno de Update con Pre Image), llevarlos a tu solución y probarlos.
> **Duración:** 35 min

### Tarea 4.1 — Compilar el proyecto

1. Compila en **Release** (selector de configuración de la barra de herramientas) o en **Debug**: los dos sirven para registrar. Learn usa **Debug** mientras depuras y pide **Release** antes de incluir el ensamblado en una solución que vas a distribuir.
2. **Build** > **Build Solution** (`Ctrl + Shift + B`) y comprueba en **Output**: `Build succeeded`. En la terminal: `dotnet build -c Release` (o solo `dotnet build` para Debug) dentro de `SIT.Plugins`.
3. El `.dll` queda en `SIT.Plugins\bin\Release\SIT.Plugins.dll` (o `bin\Debug\`) con el proyecto **Class Library (.NET Framework)** de Visual Studio. Con el proyecto de `pac plugin init`, en `SIT.Plugins\bin\Release\net48\SIT.Plugins.dll` (o `bin\Debug\net48\`). El `SIT.Plugins.1.0.0.nupkg` que genera `pac` en `bin\Release` es un paquete de plug-in: en este lab no lo uses.

### Tarea 4.2 — Conectar el Plugin Registration Tool

1. En una terminal (PowerShell o CMD):
   ```bash
   pac tool prt
   ```
   La primera vez descarga la herramienta; después abre su ventana.

2. Elige **+ Create new connection**.
3. En el diálogo de inicio de sesión, deja marcado **Office 365** y marca **Display list of available organizations**. Si vas a entrar con una cuenta distinta de la que tienes iniciada, marca **Show Advanced** y escribe las credenciales (si tu cuenta usa MFA, deja **Show Advanced** sin marcar).
4. Pulsa **Login** e inicia sesión con tu cuenta del ambiente del curso.
5. Si te muestra varias organizaciones, elige tu ambiente del curso y pulsa **Login** otra vez.

**Qué deberías ver:** una pestaña con el nombre de tu organización y el árbol de ensamblados registrados.

### Tarea 4.3 — Registrar el ensamblado

1. **Solo si hiciste el Módulo 23 en este ambiente:** en el árbol del PRT busca el ensamblado `SIT.Plugins` del módulo (con `SolicitudValidarCreatePlugin`, `SolicitudCalcularVencimientoPlugin` y `SolicitudAuditarEstadoPlugin`). Selecciónalo > **Unregister** y confirma. Learn indica que borrar un ensamblado borra también sus plugins y steps ([Learn: actualizar un plug-in](https://learn.microsoft.com/power-apps/developer/data-platform/tutorial-update-plug-in#unregister-assembly-plug-in-and-step)).

   **Por qué:** sus steps hacen lo mismo que los de este lab. Si los dejas, cada cambio de estado crea **dos** filas de auditoría (la del módulo, con números, y la del lab, con etiquetas), y al guardar una Crítica sin costo puedes ver el mensaje del módulo en vez del de este lab. Tu código del módulo sigue en tu carpeta. Si quieres conservar la regla de Resuelta de su reto de construcción, copia esa clase a este proyecto y vuelve a registrar su step al final del lab.

   **Qué deberías ver:** el árbol ya no muestra ningún ensamblado `SIT.Plugins`. Si el PRT no te deja porque hay steps que dependen del ensamblado (Learn advierte de esa restricción al borrar desde una solución), despliega el ensamblado, haz **Unregister** en cada step y después en el ensamblado. Si no hiciste el módulo aquí, salta al paso 2.

2. En el menú **Register**, elige **Register New Assembly**.

3. En el diálogo **Register New Assembly**:
   - Pulsa el botón **…** y elige tu `SIT.Plugins.dll`.
   - Comprueba que aparecen marcadas las dos clases: `SIT.Plugins.SolicitudPreCreatePlugin` y `SIT.Plugins.SolicitudPostUpdatePlugin`.
   - Deja **Isolation Mode** = **Sandbox** y **Location** = **Database** (los valores por defecto; las otras opciones son para instalaciones locales).

4. Pulsa **Register Selected Plug-ins** y cierra la confirmación con **OK**.

**Si no lo ves:** si el PRT rechaza el ensamblado o no muestra las clases, revisa la tabla de "Errores frecuentes" (firma, `TargetFramework`, clase `public` que implemente `IPlugin`).

### Tarea 4.4 — Registrar los dos steps del Create

1. En el árbol, despliega el ensamblado `SIT.Plugins` > clic derecho en `SIT.Plugins.SolicitudPreCreatePlugin` > **Register New Step**.

2. Primer step (validación):

   | Campo | Valor |
   |---|---|
   | Message | Create |
   | Primary Entity | sit_solicitud |
   | Event Pipeline Stage of Execution | PreValidation |
   | Execution Mode | Synchronous |
   | Description | Cancela Críticas sin Costo Estimado |

   > Filtering Attributes solo aplica a Update: en Create no se usa.

3. Pulsa **Register New Step**.

4. Repite el clic derecho en la **misma clase** > **Register New Step** para el segundo step (cálculo):

   | Campo | Valor |
   |---|---|
   | Message | Create |
   | Primary Entity | sit_solicitud |
   | Event Pipeline Stage of Execution | PreOperation |
   | Execution Mode | Synchronous |
   | Description | Calcula Fecha Vencimiento según la prioridad |

5. Pulsa **Register New Step**.

**Qué deberías ver:** bajo `SolicitudPreCreatePlugin`, dos steps de `Create of sit_solicitud`.

### Tarea 4.5 — Registrar el step del Update y su Pre Image

1. Clic derecho en `SIT.Plugins.SolicitudPostUpdatePlugin` > **Register New Step**:

   | Campo | Valor |
   |---|---|
   | Message | Update |
   | Primary Entity | sit_solicitud |
   | Filtering Attributes | solo `sit_estado` (desmarca todas las demás) |
   | Event Pipeline Stage of Execution | PostOperation |
   | Execution Mode | Synchronous |

2. Pulsa **Register New Step**.

3. Clic derecho en el step nuevo > **Register New Image**:

   | Campo | Valor |
   |---|---|
   | Image Type | Pre Image |
   | Name | PreImage |
   | Entity Alias | PreImage (es la clave que lee el código) |
   | Parameters | solo `sit_estado` |

4. Pulsa **Register Image**.

   > **¿Por qué `Filtering Attributes = sit_estado`?** Sin esto, el step se dispararía en cualquier Update de la solicitud (cambiar la descripción, el asignado…). Ojo: el step se dispara si `sit_estado` **viene** en la petición, aunque traiga el mismo valor; por eso el código compara con la Pre Image ([Learn: Register a plug-in](https://learn.microsoft.com/power-apps/developer/data-platform/register-plug-in#general-configuration-information-fields)).

   > **¿Por qué solo `sit_estado` en la imagen?** Por defecto se marcan todas las columnas, y eso penaliza el rendimiento. Elige solo las que usa el código.

### Tarea 4.6 — Llevar lo registrado a tu solución y activar el trace

1. El PRT registra todo en la **Default Solution**. En make.powerapps.com, en tu solución: **Add existing** > **More** > **Developer** > **Plug-in assembly** > `SIT.Plugins`. Los steps **no** se agregan solos: agrega también los tres steps con **Add existing** (en **Developer**, la opción de los pasos de plug-in), como en la Microlección 2 del Módulo 23.
2. Activa el **Plug-in Trace Log** en **All** como en la Microlección 2 del Módulo 23. Cuando termines el lab, déjalo en **Exception**.

### Tarea 4.7 — Probar los plugins

**Prueba del Create (validación y cálculo):**

1. Crea una solicitud en tu app Model-Driven (o desde la Canvas App del Lab 03) con **Prioridad** = Crítica y sin **Costo Estimado** > **Save**.

   **Resultado esperado:** un diálogo de error con tu mensaje ("Las solicitudes con prioridad Crítica deben tener un Costo Estimado mayor que cero…") y la solicitud sin guardar.

2. Pon **Costo Estimado** = 500 y guarda de nuevo.

   **Resultado esperado:** la solicitud se guarda con **Fecha Vencimiento** = hora de creación + 4 h y con su **Número de Solicitud** Autonumber (`SOL-00xxxx`), que no puso tu plugin.

3. Crea otra solicitud con **Prioridad** = Media y sin Costo Estimado.

   **Resultado esperado:** se guarda (la validación solo afecta a las Críticas), con **Fecha Vencimiento** = creación + 24 h y el número siguiente.

**Prueba del Update (auditoría):**

4. Abre una solicitud existente, cambia su **Estado** de Nueva a En Proceso y guarda.
5. Cambia solo la **Descripción** de esa solicitud y guarda.
6. Abre la tabla **Auditoria Solicitud** (en tu solución, la tabla > datos, o agrégala a tu app).

   **Resultado esperado:** una sola fila nueva, con **Estado Anterior** = `Nueva`, **Estado Nuevo** = `En Proceso` y tu usuario en **Usuario**. Ninguna fila por el cambio de Descripción.

7. Si tienes un segundo usuario con el rol **SIT Técnico TI**, repite el cambio de estado con él.

   **Resultado esperado:** el cambio se guarda y la fila de auditoría muestra a ese técnico en **Usuario**, aunque su rol solo puede leer esa tabla.

**Si no lo ves:**
- **La Crítica sin costo se guarda:** el valor de `PRIORIDAD_CRITICA` no coincide con el de tu ambiente, o el step de PreValidation no está registrado. Mira la línea `Validar: prioridad=…` en el trace.
- **Fecha Vencimiento vacía:** falta el step de PreOperation, o la columna no se llama `sit_fechavencimiento`.
- **No aparece la fila de auditoría:** revisa en el trace si salió "Falta la Pre Image" o "sin cambio real".
- **Los números de Estado Anterior/Nuevo salen en vez de las etiquetas:** las constantes `ESTADO_*` no coinciden con tu ambiente.

### Validación del Ejercicio 4

- [ ] El ensamblado `SIT.Plugins` aparece en el árbol del PRT conectado a tu ambiente del curso
- [ ] `SolicitudPreCreatePlugin` tiene dos steps de Create: PreValidation y PreOperation, ambos síncronos
- [ ] El step del PostUpdate tiene Filtering Attribute `sit_estado` y la Pre Image `PreImage` con solo `sit_estado`
- [ ] El ensamblado y los tres steps están en tu solución
- [ ] Al crear una Crítica sin presupuesto, aparece el error del plugin y no se guarda
- [ ] Al crear una solicitud válida, **Fecha Vencimiento** sigue el SLA y el **Número de Solicitud** Autonumber se asigna solo
- [ ] Al cambiar el estado se crea la fila en `sit_auditoriasolicitud`; al cambiar solo la Descripción, no

---

## Ejercicio 5 — Tests unitarios con Moq

> **Qué vas a hacer:** Escribir tests que verifiquen la lógica de los dos plugins sin conexión a Dataverse, simulando con Moq el `IServiceProvider` y los servicios que piden.
> **Duración:** 30 min

### Tarea 5.1 — Crear la clase de tests

En el proyecto `SIT.Plugins.Tests`, agrega la clase `SolicitudPluginsTests.cs`:

```csharp
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Moq;
using SIT.Plugins;

namespace SIT.Plugins.Tests
{
    [TestClass]
    public class SolicitudPluginsTests
    {
        // Arma un IServiceProvider falso con lo que piden los plugins.
        // preImage y servicioSistema solo hacen falta para el plugin de Update.
        private static IServiceProvider CrearProveedor(string mensaje, int etapa, Entity target,
            Entity preImage = null, IOrganizationService servicioSistema = null)
        {
            var context = new Mock<IPluginExecutionContext>();
            context.Setup(c => c.MessageName).Returns(mensaje);
            context.Setup(c => c.Stage).Returns(etapa);
            context.Setup(c => c.PrimaryEntityId).Returns(Guid.NewGuid());
            context.Setup(c => c.InitiatingUserId).Returns(Guid.NewGuid());
            context.Setup(c => c.InputParameters).Returns(new ParameterCollection { { "Target", target } });

            var imagenes = new EntityImageCollection();
            if (preImage != null) imagenes.Add("PreImage", preImage);
            context.Setup(c => c.PreEntityImages).Returns(imagenes);

            var factory = new Mock<IOrganizationServiceFactory>();
            // Solo la llamada con null (SYSTEM) devuelve el servicio: si el plugin usara context.UserId, recibiría null
            factory.Setup(f => f.CreateOrganizationService(null)).Returns(servicioSistema);

            var proveedor = new Mock<IServiceProvider>();
            proveedor.Setup(p => p.GetService(typeof(IPluginExecutionContext))).Returns(context.Object);
            proveedor.Setup(p => p.GetService(typeof(ITracingService))).Returns(new Mock<ITracingService>().Object);
            proveedor.Setup(p => p.GetService(typeof(IOrganizationServiceFactory))).Returns(factory.Object);
            return proveedor.Object;
        }

        private static Entity SolicitudConPrioridad(int prioridad)
        {
            var solicitud = new Entity("sit_solicitud");
            solicitud["sit_prioridad"] = new OptionSetValue(prioridad);
            return solicitud;
        }

        private static Entity ConEstado(int estado)
        {
            var solicitud = new Entity("sit_solicitud");
            solicitud["sit_estado"] = new OptionSetValue(estado);
            return solicitud;
        }

        [TestMethod]
        public void PreValidation_CriticaSinCosto_CancelaConMensaje()
        {
            var target = SolicitudConPrioridad(SolicitudValores.PRIORIDAD_CRITICA); // sin sit_costoestimado

            try
            {
                new SolicitudPreCreatePlugin().Execute(CrearProveedor("Create", 10, target));
            }
            catch (InvalidPluginExecutionException ex)
            {
                StringAssert.Contains(ex.Message, "Costo Estimado");
                return;
            }

            Assert.Fail("El plugin debía cancelar la creación de una Crítica sin costo.");
        }

        [TestMethod]
        public void PreValidation_CriticaConCosto_NoCancela()
        {
            var target = SolicitudConPrioridad(SolicitudValores.PRIORIDAD_CRITICA);
            target["sit_costoestimado"] = new Money(500m);

            // Si lanza una excepción, el test falla solo
            new SolicitudPreCreatePlugin().Execute(CrearProveedor("Create", 10, target));

            Assert.IsFalse(target.Contains("sit_fechavencimiento"),
                "En PreValidation el plugin solo valida: la fecha se calcula en PreOperation");
        }

        [TestMethod]
        public void PreOperation_Baja_VenceEn48Horas()
        {
            var target = SolicitudConPrioridad(SolicitudValores.PRIORIDAD_BAJA);
            DateTime antes = DateTime.UtcNow;

            new SolicitudPreCreatePlugin().Execute(CrearProveedor("Create", 20, target));

            DateTime vence = target.GetAttributeValue<DateTime>("sit_fechavencimiento");
            Assert.IsTrue(vence >= antes.AddHours(48) && vence <= DateTime.UtcNow.AddHours(48),
                $"Debía vencer en 48 h. Vence: {vence:u}");
        }

        [TestMethod]
        public void PreOperation_CriticaSinCosto_NoValidaOtraVez()
        {
            // En PreOperation ya no se valida: esa decisión se tomó en PreValidation
            var target = SolicitudConPrioridad(SolicitudValores.PRIORIDAD_CRITICA);

            new SolicitudPreCreatePlugin().Execute(CrearProveedor("Create", 20, target));

            Assert.IsTrue(target.Contains("sit_fechavencimiento"));
        }

        [TestMethod]
        public void PostUpdate_CambioRealDeEstado_CreaAuditoriaComoSystem()
        {
            var servicio = new Mock<IOrganizationService>();
            var target = ConEstado(SolicitudValores.ESTADO_EN_PROCESO);
            var preImage = ConEstado(SolicitudValores.ESTADO_NUEVA);

            new SolicitudPostUpdatePlugin().Execute(
                CrearProveedor("Update", 40, target, preImage, servicio.Object));

            servicio.Verify(s => s.Create(It.Is<Entity>(e =>
                e.LogicalName == "sit_auditoriasolicitud" &&
                e.GetAttributeValue<string>("sit_estadoanterior") == "Nueva" &&
                e.GetAttributeValue<string>("sit_estadonuevo") == "En Proceso")), Times.Once());
        }

        [TestMethod]
        public void PostUpdate_MismoEstado_NoCreaAuditoria()
        {
            var servicio = new Mock<IOrganizationService>();
            var target = ConEstado(SolicitudValores.ESTADO_NUEVA);
            var preImage = ConEstado(SolicitudValores.ESTADO_NUEVA);

            new SolicitudPostUpdatePlugin().Execute(
                CrearProveedor("Update", 40, target, preImage, servicio.Object));

            servicio.Verify(s => s.Create(It.IsAny<Entity>()), Times.Never());
        }
    }
}
```

> **¿Por qué `try/catch` con `Assert.Fail` y no `Assert.ThrowsException`?** Es el patrón que muestra Learn para comprobar a la vez el tipo de excepción y su mensaje, y funciona igual en todas las versiones de MSTest ([Learn: crear y ejecutar pruebas unitarias](https://learn.microsoft.com/visualstudio/test/walkthrough-creating-and-running-unit-tests-for-managed-code)). El `return` dentro del `catch` evita llegar al `Assert.Fail`.

### Tarea 5.2 — Ejecutar los tests

1. Compila la solución (**Build** > **Build Solution**).
2. Abre **Test** > **Test Explorer** y elige **Run All** (`Ctrl + R, V`). En la terminal: `dotnet test` dentro de `SIT.Plugins.Tests`.
3. Los 6 tests deben quedar en verde.
4. Rompe algo a propósito: en `CalcularFechaVencimiento`, cambia el `48` por `24`, ejecuta de nuevo y comprueba que falla `PreOperation_Baja_VenceEn48Horas` con tu mensaje "Debía vencer en 48 h…". Haz lo mismo cambiando `CreateOrganizationService(null)` por `CreateOrganizationService(context.UserId)` en el plugin de Update: ¿qué test falla y por qué? Deshaz los dos cambios.

   **Qué deberías ver en el segundo cambio:** falla `PostUpdate_CambioRealDeEstado_CreaAuditoriaComoSystem` con una `NullReferenceException` ("Object reference not set to an instance of an object"), no con un mensaje de aserción. Es lo esperado: el mock de la factory solo devuelve el servicio cuando se pide con `null` (SYSTEM). Con `context.UserId` devuelve `null`, y el plugin falla al llamar a `Create`. El test te está avisando justo del cambio que en el tenant dejaría al técnico sin poder cambiar estados.

**Si no lo ves:** si **Test Explorer** o `dotnet test` no muestran ningún test, revisa que el proyecto tenga `MSTest.TestAdapter` y `Microsoft.NET.Test.Sdk`, y que la clase tenga `[TestClass]` y los métodos `[TestMethod]`. Si un test falla con "Object reference not set" **sin** que hayas roto nada a propósito, al mock le falta un `Setup` para algo que el plugin usa.

### Validación del Ejercicio 5

- [ ] Los 6 tests pasan sin modificar el código de los plugins
- [ ] El test de la Crítica sin costo verifica el mensaje de la excepción
- [ ] Los tests del PostUpdate comprueban que la auditoría se crea con el servicio de SYSTEM y solo si el estado cambió
- [ ] Vi fallar un test al romper la lógica, y lo dejé en verde otra vez

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Error de compilación: "the type or namespace name 'IPlugin' could not be found" | Falta el NuGet `Microsoft.CrmSdk.CoreAssemblies` | Instálalo en el proyecto (Tarea 1.2) |
| El PRT rechaza el ensamblado, o lo registra pero no muestra tus clases | Ensamblado sin firmar; `TargetFramework` fuera de .NET Framework 4.6.2-4.8 (por ejemplo, .NET 8 o .NET Standard); o la clase no es `public` o no implementa `IPlugin` | Firma el proyecto (Tarea 1.3), revisa el `TargetFramework` en el `.csproj` y que cada clase sea `public class … : IPlugin`; recompila y vuelve a registrar (o **Update**) |
| Plugin lanza excepción genérica en producción | Una excepción no controlada distinta a `InvalidPluginExecutionException` | Captura lo esperable, escribe el detalle con `tracer.Trace()` y lanza `InvalidPluginExecutionException` con un mensaje para el usuario |
| La Crítica sin costo se guarda igual | Valor de `PRIORIDAD_CRITICA` distinto del de tu ambiente, o falta el step de PreValidation | Compara con "Datos de apoyo" y con la línea `Validar:` del trace |
| El step no se dispara al cambiar el estado | `Filtering Attributes` sin `sit_estado` en el step del PostUpdate | Edita el step en el PRT y deja solo `sit_estado` |
| "Falta la Pre Image" en el trace | La imagen no se registró, o su **Entity Alias** no es `PreImage` | Registra la imagen con el mismo alias que lee el código y con `sit_estado` en **Parameters** |
| Solicitudes que crea un flujo o una integración se guardan sin validar | El plugin sale con `if (context.Depth > 1) return;`: esas creaciones llegan con Depth > 1 | Quita la dependencia de Depth; evita el bucle con Filtering Attributes y comparando con la Pre Image antes de escribir |
| El técnico no puede cambiar el estado: error de privilegio sobre `sit_auditoriasolicitud` | La auditoría se crea con `CreateOrganizationService(context.UserId)` y el rol Técnico solo tiene Read sobre esa tabla | Crea la fila con `CreateOrganizationService(null)` (SYSTEM), como en el Ejercicio 3 |
| Test falla con "Object reference not set" en Moq | Un servicio o propiedad que usa el plugin no tiene `Setup()` | Revisa que `CrearProveedor` configure todo lo que lee el plugin |
| Números `SOL-` repetidos | Alguien volvió a numerar desde un plugin con "último + 1" | Usa solo la columna Autonumber del Módulo 7 |

---

## Checklist final

- [ ] Proyecto `SIT.Plugins` en .NET Framework 4.8, firmado, compila sin errores
- [ ] `SolicitudPreCreatePlugin` cancela en PreValidation las Críticas sin presupuesto con `InvalidPluginExecutionException`
- [ ] `SolicitudPreCreatePlugin` calcula en PreOperation `sit_fechavencimiento` según la prioridad (4/8/24/48 h)
- [ ] El **Número de Solicitud** lo asigna la columna Autonumber, no el plugin
- [ ] `SolicitudPostUpdatePlugin` solo actúa cuando cambia `sit_estado` (Filtering Attributes + comparación con la Pre Image)
- [ ] `SolicitudPostUpdatePlugin` crea la fila en `sit_auditoriasolicitud` como SYSTEM, con estado anterior, estado nuevo e `InitiatingUserId`
- [ ] Ningún plugin depende de `context.Depth`
- [ ] Ensamblado y tres steps registrados en el PRT y agregados a tu solución
- [ ] Los 6 tests unitarios pasan en **Test Explorer**
- [ ] Al crear una solicitud Crítica sin presupuesto desde la UI: aparece el error del plugin
- [ ] Al cambiar el estado de una solicitud: se crea el registro de auditoría
- [ ] Plug-in Trace Log de vuelta en **Exception** al terminar

## Evidencia esperada

- Captura de **Test Explorer** con los 6 tests en verde
- Captura del árbol del PRT con los tres steps (etapas visibles), el Filtering Attribute y la Pre Image
- Captura del error del plugin al crear una solicitud Crítica sin presupuesto desde la UI
- Captura de una solicitud guardada con **Fecha Vencimiento** y **Número de Solicitud**
- Captura de la fila de auditoría creada tras un cambio de estado (**Usuario** y **Created By** visibles: explica por qué son distintos)
- Texto de una entrada del Plug-in Trace Log de cada plugin

## Criterios de aprobación

- Cobertura de al menos 1 caso que cancela o no escribe y 1 caso feliz por plugin en los unit tests
- El plugin bloquea la creación de una Crítica sin presupuesto desde cualquier punto de entrada (UI, API, flujos), no solo desde el formulario
- El registro de auditoría refleja correctamente el estado anterior y el nuevo, y se crea aunque el usuario solo tenga Read sobre la tabla
- 100% de los ítems del Checklist final marcados

---

## Reto adicional

**Reto básico:** Agrega un test que verifique que una solicitud **Alta** vence en 8 horas y otro que compruebe que, si el `Target` del Update no trae `sit_estado`, `SolicitudPostUpdatePlugin` no crea auditoría.

**Reto intermedio:** Crea un plugin `SolicitudValidarCierrePlugin` que impida pasar una solicitud a **Cerrada** si antes no estaba **Resuelta** (el estado anterior sale de la Pre Image). Elige tú la etapa más adecuada para cancelar, limita el step con Filtering Attributes y escribe dos tests (uno que cancela y uno que no). *(La regla de "no pasar a Resuelta sin Descripción de Solución" ya la construiste en el reto del Módulo 23.)*

**Reto avanzado:** Usa **Shared Variables** para pasar datos entre steps de la misma operación: en el step de PreOperation de `SolicitudPreCreatePlugin`, agrega `context.SharedVariables["horasSla"] = horas;`. Crea un plugin `SolicitudPostCreatePlugin` (Create, PostOperation, síncrono) que lea `context.SharedVariables["horasSla"]` y lo escriba en el trace. Registra el step y verifica en el Plug-in Trace Log que el valor llega. Después intenta pasar un valor desde el step de **PreValidation** y explica por qué ahí hay que leerlo en `context.ParentContext.SharedVariables` ([Learn: Shared variables](https://learn.microsoft.com/power-apps/developer/data-platform/understand-the-data-context#shared-variables)).

---

## Preguntas de repaso

1. ¿Por qué Microsoft desaconseja usar `context.Depth > 1` para cortar la recursión, y qué usas en su lugar en este lab?
2. ¿En qué se diferencia `context.UserId` de `context.InitiatingUserId`? ¿Cuándo difieren?
3. ¿Por qué la fila de auditoría se crea con `CreateOrganizationService(null)` y qué pasaría con `context.UserId`?
4. ¿Por qué la validación va en PreValidation y el cálculo de la fecha en PreOperation, si los dos ocurren antes de guardar?
5. ¿Qué ventaja tiene configurar `Filtering Attributes` en el step del PostUpdate, y por qué aun así el código compara con la Pre Image?
6. ¿Por qué no se genera el número `SOL-` desde el plugin?
7. ¿Por qué los tests con Moq no garantizan que el plugin funciona en el tenant? ¿Qué prueba agregarías para cubrir esa diferencia?

---

## Limpieza del laboratorio

> Conserva los plugins registrados: el Módulo 25 parte del proyecto `SIT.Plugins` de este lab, y el Lab 63 (capstone de Developer) lo da por hecho.

Para desregistrar los plugins si es necesario:
1. Abre el PRT y conéctate al ambiente.
2. Selecciona el ensamblado `SIT.Plugins` > **Unregister** y confirma.
3. Al desregistrar el ensamblado se eliminan también sus plugins, steps e imágenes.

---

## Siguiente paso recomendado

➡️ **[Módulo 24 — Integraciones con Azure Services](/nivel/avanzado/modulo/integraciones-con-azure-services)** y, cuando lo termines, **[Lab 74 — JR-004: CRM Integration Challenge](/labs/lab-74-jr-004-crm-integration-challenge)**

**Por qué ir ahí:** el Módulo 24 lleva la lógica de servidor de este lab hacia fuera de Dataverse, con servicios de Azure como Azure Functions y Service Bus. El Lab 74 lo pone a prueba como un reto de integración real: manejo de errores, idempotencia, seguridad y observabilidad.

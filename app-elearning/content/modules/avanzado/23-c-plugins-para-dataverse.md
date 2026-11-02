---
moduleId: 23
title: "C# Plugins para Dataverse"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 22
practiceMinutes: 180
slug: "c-plugins-para-dataverse"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 180 min en tu entorno Developer (la primera vez, cuenta entre el doble y el triple: instalar herramientas, compilar y registrar lleva su tiempo). Las Microlecciones 1 y 4 no necesitan tenant; la 2 y la 3 sí.*

### 🚧 Antes de comenzar: este módulo no es autosuficiente en programación

> **Requiere conocimientos previos que PlanEstudio todavía no enseña desde cero:** programación
> básica, C# (clases, interfaces, herencia, excepciones, async/await), NuGet, y familiaridad con
> Visual Studio y testing unitario (Moq). El [Anexo de Lenguajes de Programación](/recursos/lenguajes-programacion)
> es una **referencia de sintaxis para quien ya programa**, no un curso de fundamentos — no lo trates
> como preparación suficiente si nunca has escrito código antes.

**Elige cómo avanzar según tu situación real:**

- **Ya programas en C# o un lenguaje similar (Java, TypeScript con tipado fuerte):** puedes seguir
  el módulo completo, incluidas las prácticas, con normalidad.
- **Programas en otro lenguaje pero nunca en C#:** lee primero [Fundamentos de C#/.NET para Power Platform](/recursos/fundamentos-csharp-dotnet)
  (20-30 min, incluye práctica local sin tenant) — cierra la sintaxis básica de clases, tipos,
  excepciones y `try/catch` antes de la Microlección 2.
- **Nunca has programado:** el puente de arriba te da la sintaxis mínima, pero no reemplaza un curso
  completo de programación. Con el puente hecho, puedes intentar las prácticas con más esfuerzo del
  habitual; sin él, te recomendamos estudiar este módulo en **modo conceptual**: haz la Microlección 1
  y las prácticas interactivas, y lee el código para entender **qué hace** un plugin y **cuándo** se
  usa — sin intentar todavía compilar ni registrar el código tú mismo. Esto te prepara para una
  conversación técnica o una decisión de arquitectura, pero **no valida que puedas desarrollar un
  plugin de forma independiente**.

**Antes de las prácticas en el tenant, confirma que tienes:** una forma de compilar C# para .NET Framework
(cualquiera de las dos sirve), el Power Platform CLI (`pac`) instalado (ver [Guía de Herramientas de
Workstation](/recursos/guia-herramientas-workstation)), tu
entorno Developer con la tabla **Solicitud TI** (`sit_solicitud`) del Laboratorio 2 y las columnas
**Costo Estimado** (`sit_costoestimado`) y **Descripción de Solución** (`sit_descripcion_solucion`) del
Laboratorio 9, y la solución con el publisher `SIT` (prefijo `sit`).

- **Con VS Code o solo una terminal:** el **.NET SDK** 8 o posterior. Creas el proyecto con `pac plugin init`, compilas con `dotnet build` y ejecutas las pruebas con `dotnet test`. El proyecto que genera `pac` ya trae el paquete con los ensamblados de referencia de .NET Framework, así que no necesitas instalar aparte el paquete de desarrollo de .NET Framework 4.8.
- **Con Visual Studio:** la carga de trabajo **.NET desktop development** y el paquete de desarrollo (Developer Pack) de **.NET Framework 4.8**. Instalarlos lleva entre 30 y 60 minutos la primera vez. A cambio, tienes **Test Explorer** y las alternativas con ventanas que se indican en cada paso.

### 🎯 Objetivo
Desarrollar plugins C# robustos para ejecutar lógica de negocio compleja en el servidor de Dataverse: validaciones, cálculos, integraciones síncronas con APIs externas, y patrones de plugin avanzados como Early-Bound entities y Shared Variables.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y una práctica con evidencia del dato exacto que viste. Vas a **decidir** etapa, modo e imagen antes de escribir código, vas a **registrar** dos plugins de Create y uno de Update con el Plugin Registration Tool, vas a **construir sin pasos** una regla de cierre, vas a **diagnosticar** un error de privilegios antes de ver la causa y vas a cerrar con un **reto de transferencia** que llama a un servicio externo.

---

## 📖 Conceptos clave (referencia rápida)

- **IPlugin:** la interfaz que implementa todo plugin. Tiene un único método, `Execute(IServiceProvider serviceProvider)`. La clase debe ser `public`; si quieres recibir la configuración del step, añade un constructor con uno o dos parámetros `string` (configuración no segura y segura).
- **IPluginExecutionContext:** lo que está pasando ahora: `MessageName` (`Create`, `Update`…), `PrimaryEntityName`, `PrimaryEntityId`, `Stage`, `InputParameters` (en Create y Update, `Target` es la `Entity` con las columnas enviadas), `PreEntityImages` / `PostEntityImages`, `UserId` (el usuario con el que corre el step), `InitiatingUserId` (quien hizo la acción) y `SharedVariables`.
- **IOrganizationServiceFactory.CreateOrganizationService(Guid? userId):** devuelve el `IOrganizationService` para leer y escribir en Dataverse. Con `context.UserId` las operaciones respetan los permisos de ese usuario; con `null` corren como **SYSTEM**. Úsalo con criterio: solo para lo que el usuario no debe poder hacer por sí mismo.
- **ITracingService:** escribe en el **Plug-in Trace Log** (`tracer.Trace("...")`). En producción no hay debugger: el trace es tu evidencia.
- **Etapas del pipeline** (`context.Stage`): **PreValidation** = 10, antes de la transacción y antes de las comprobaciones de seguridad: el mejor lugar para **cancelar**. **PreOperation** = 20, dentro de la transacción: el lugar para **cambiar valores del Target** (evita cancelar aquí: el rollback cuesta). **PostOperation** = 40, después de la operación principal y todavía dentro de la transacción si es síncrono; es la única etapa que admite modo **Asynchronous**, que corre fuera de la transacción como un trabajo del sistema (System Job). La etapa 30 es la operación principal y no admite plugins.
- **Imágenes (Pre Image / Post Image):** copias del registro con las columnas que elijas. No hay **Pre Image** en Create (el registro no existe) ni **Post Image** en Delete; la **Post Image** solo existe en PostOperation. La clave con la que la lees en código es el **Entity Alias**. Elige solo las columnas que usas: por defecto se marcan todas y eso penaliza el rendimiento.
- **Filtering Attributes:** en Update, el step solo se dispara si la petición incluye alguna de esas columnas — aunque su valor no haya cambiado. Por eso el código compara con la Pre Image.
- **Run in User's Context:** con qué usuario corre el step; por defecto, **Calling User**.
- **Unsecure / Secure Configuration:** texto que el step pasa al constructor. La configuración segura **no** viaja al exportar la solución: ahí van claves de APIs.
- **Depth:** cuántas operaciones encadenadas llevan al plugin actual. Microsoft avisa de **no depender de Depth** para cortar la recursión: un registro creado por un flujo o por otra extensión llega con Depth > 1 y un `if (context.Depth > 1) return;` lo dejaría sin procesar. Dataverse corta la cadena por su cuenta si supera el límite (8 dentro de una hora). La forma correcta de no entrar en bucle: Filtering Attributes, comparar valores antes de escribir y no actualizar el mismo registro desde PostOperation (pon el valor en el Target en PreOperation).
- **SharedVariables:** un diccionario para pasar datos entre plugins de la misma operación. Ojo: lo que un plugin de PreValidation escribe lo lee uno de PreOperation o PostOperation en `context.ParentContext.SharedVariables`, porque PreValidation corre en un contexto distinto.
- **InvalidPluginExecutionException:** la excepción para errores de negocio. En un plugin síncrono cancela la operación y el usuario ve tu mensaje. Cualquier otra excepción sin controlar también cancela, pero el usuario ve un error genérico.
- **Límites del sandbox:** todos los plugins en la nube corren aislados (**SandBox**, almacenados en **Database**). Una llamada saliente solo puede ser HTTP o HTTPS a un nombre DNS (sin direcciones IP ni `localhost`). La operación completa tiene un tope de 2 minutos; apunta a que cada plugin termine en unos 2 segundos.
- **Ensamblado:** .NET Framework 4.6.2 a 4.8 (Microsoft recomienda 4.8) y **firmado con strong name**: el Plugin Registration Tool no registra un ensamblado sin firmar.
- **Early-Bound vs Late-Bound:** `entity["sit_titulo"]` (late-bound, cadenas) frente a clases generadas con `pac modelbuilder build` (early-bound, con IntelliSense y validación al compilar). Este módulo usa late-bound para que veas los nombres; en proyectos grandes conviene early-bound.

---

## 🧩 Microlección 1 — El pipeline: cuándo y cómo corre tu código

**¿Qué vas a aprender?** A elegir etapa, modo e imagen a partir del requisito, antes de escribir una línea.

**¿Por qué existe esto?** La misma lógica en la etapa equivocada se comporta distinto: una validación en PostOperation deja trabajo hecho que hay que deshacer; un cálculo en PostOperation obliga a un segundo Update (que vuelve a disparar plugins); una auditoría asíncrona puede quedar escrita aunque falle otra cosa. La etapa no es un detalle de registro: es diseño.

**Ejemplo pequeño:** "una solicitud Crítica sin Costo Estimado no se puede guardar" → cancelar → **PreValidation**, síncrono. "Calcular la fecha de vencimiento al crear" → cambiar el Target → **PreOperation**, síncrono. "Registrar quién cambió el estado y desde qué valor" → necesita el valor anterior → Update con **Pre Image**, y como la fila de auditoría debe existir solo si el cambio se guardó → **PostOperation** síncrono.

**Ahora haz algo — micropráctica (5 min):** → **[Elegir etapa, modo e imagen del plugin](/practica/ip-plg-001-elegir-etapa-modo-e-imagen)**.

**Práctica real (15 min, sin escribir código): instala y conecta el Plugin Registration Tool.**

1. En una terminal, ejecuta `pac tool prt`. La primera vez descarga la herramienta y luego la abre.
2. En la ventana del Plugin Registration Tool, elige **+ Create new connection**.
3. En el diálogo de inicio de sesión, elige **Office 365**, marca **Display list of available organizations** y pulsa **Login**. Inicia sesión con tu cuenta del entorno Developer.
4. Si te muestra varias organizaciones, elige tu entorno Developer y pulsa **Login**.

**Qué deberías ver:** una pestaña con el nombre de tu organización y un árbol de ensamblados registrados (puede estar casi vacío en un entorno nuevo).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de la organización que muestra la pestaña del PRT | ___ |
| Para cada uno de los tres requisitos del ejemplo: etapa, modo e imagen que elegirías | ___ |
| Una razón concreta por la que la validación no debe ir en PostOperation | ___ |

---

## 🧩 Microlección 2 — Tu primer plugin: validar y enriquecer al crear

**¿Qué vas a aprender?** A crear el proyecto, escribir dos plugins pequeños (uno que cancela y otro que completa datos), firmarlos, registrarlos y leer su trace.

**¿Por qué existe esto?** Una regla en el formulario se salta importando datos, con la Web API o con un flujo. Un plugin corre en el servidor para cualquier origen.

### Preparar la columna y el proyecto (20 min)

1. En <https://make.powerapps.com>, en tu solución, abre la tabla **Solicitud TI** > **Columns** > **New column**: **Display name** = `Fecha Vencimiento`, **Data type** = **Date and time**; en **Advanced options** > **Schema name** escribe solo `fechavencimiento` (resultado `sit_fechavencimiento`) > **Save**.
2. Anota el **Value** de cada opción de **Prioridad** (`sit_prioridad`) y de **Estado** (`sit_estado`): abre la columna y mira el valor numérico de cada opción. Dataverse los genera a partir del Choice value prefix de tu publisher, así que **los números de los ejemplos de abajo son ilustrativos**: pon los tuyos.
3. Crea el proyecto con el CLI, en una carpeta vacía: `pac plugin init --outputDirectory SIT.Plugins`. El proyecto que genera ya viene **firmado** con una clave de strong name (`SIT.Plugins.snk`, salvo que uses `--skip-signing`) y trae una clase base `PluginBase.cs` y una clase de ejemplo `Plugin1.cs`. En este módulo escribimos las clases implementando `IPlugin` directamente, para ver cada servicio; borra `Plugin1.cs`.
   - *Alternativa con Visual Studio:* proyecto **Class Library (.NET Framework)** con **.NET Framework 4.8**, paquete NuGet `Microsoft.CrmSdk.CoreAssemblies`, y en las propiedades del proyecto, pestaña **Signing**, marca **Sign the assembly** y crea una clave nueva.
4. Abre el proyecto (en Visual Studio, o la carpeta `SIT.Plugins` en VS Code) y comprueba en el `.csproj` el `TargetFramework`: debe ser un .NET Framework entre 4.6.2 y 4.8. El de `pac plugin init` dice `net48`.
5. *Si usas la terminal:* entra en la carpeta (`cd SIT.Plugins`) y ejecuta `dotnet build`. **Qué deberías ver:** `Build succeeded` con 0 errores. Así compruebas la instalación antes de escribir código.

### Escribir los dos plugins (25 min)

Primero, los valores de las opciones en un solo sitio:

```csharp
namespace SIT.Plugins
{
    // Valores de las opciones de tus columnas Choice. Reemplázalos por los de TU ambiente (paso 2).
    public static class SolicitudValores
    {
        public const int PRIORIDAD_BAJA = /* TU VALOR REAL AQUÍ */ 100000000;
        public const int PRIORIDAD_MEDIA = /* TU VALOR REAL AQUÍ */ 100000001;
        public const int PRIORIDAD_ALTA = /* TU VALOR REAL AQUÍ */ 100000002;
        public const int PRIORIDAD_CRITICA = /* TU VALOR REAL AQUÍ */ 100000003;
        public const int ESTADO_RESUELTA = /* TU VALOR REAL AQUÍ */ 100000002;
    }
}
```

El plugin que **cancela** (PreValidation):

```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace SIT.Plugins
{
    // Step: Create · sit_solicitud · PreValidation · Synchronous
    public class SolicitudValidarCreatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Guardas: este código solo tiene sentido en el step para el que se escribió
            if (context.MessageName != "Create" || context.Stage != 10) return;
            if (!context.InputParameters.Contains("Target")) return;
            var solicitud = context.InputParameters["Target"] as Entity;
            if (solicitud == null || solicitud.LogicalName != "sit_solicitud") return;

            // GetAttributeValue devuelve null si la columna no vino en el Target
            var prioridad = solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad");
            var costo = solicitud.GetAttributeValue<Money>("sit_costoestimado");
            tracer.Trace("Validar Create: prioridad={0}, costo={1}", prioridad?.Value, costo?.Value);

            if (prioridad != null && prioridad.Value == SolicitudValores.PRIORIDAD_CRITICA
                && (costo == null || costo.Value <= 0))
            {
                // El usuario ve este texto; la operación se cancela antes de la transacción
                throw new InvalidPluginExecutionException(
                    "Las solicitudes con prioridad Crítica deben tener un Costo Estimado mayor que cero.");
            }
        }
    }
}
```

El plugin que **completa datos** (PreOperation). Los plazos coinciden con la regla de SLA del Laboratorio 2 (Crítica 4 h, Alta 8 h, Media 24 h, Baja 48 h):

```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace SIT.Plugins
{
    // Step: Create · sit_solicitud · PreOperation · Synchronous
    public class SolicitudCalcularVencimientoPlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            if (context.MessageName != "Create" || context.Stage != 20) return;
            if (!context.InputParameters.Contains("Target")) return;
            var solicitud = context.InputParameters["Target"] as Entity;
            if (solicitud == null || solicitud.LogicalName != "sit_solicitud") return;

            int horas = HorasSla(solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad")?.Value);

            // En PreOperation basta con escribir en el Target: se guarda con el mismo Create, sin un Update extra
            solicitud["sit_fechavencimiento"] = DateTime.UtcNow.AddHours(horas);
            tracer.Trace("Vencimiento: +{0} h", horas);
        }

        public static int HorasSla(int? prioridad)
        {
            switch (prioridad)
            {
                case SolicitudValores.PRIORIDAD_CRITICA: return 4;
                case SolicitudValores.PRIORIDAD_ALTA: return 8;
                case SolicitudValores.PRIORIDAD_BAJA: return 48;
                default: return 24; // Media, o sin prioridad (Media es la opción por defecto)
            }
        }
    }
}
```

> **¿Y el número `SOL-XXXXX`?** No lo generes en un plugin buscando "el último número + 1": dos creaciones simultáneas leen el mismo último número y se duplica. Usa una columna **Autonumber**, como la **Número de Solicitud** del Módulo 7: Dataverse garantiza que no se repite.

### Registrar y probar (30 min)

1. Compila (en Visual Studio, **Build** > **Build Solution**; en la terminal, `dotnet build` dentro de la carpeta del proyecto) y localiza el `.dll`. Con el proyecto de `pac plugin init` queda en `bin\Debug\net48\SIT.Plugins.dll`. Con el proyecto **Class Library (.NET Framework)** de Visual Studio, en `bin\Debug\SIT.Plugins.dll`. Si en `bin\Debug` ves también un `SIT.Plugins.1.0.0.nupkg`, es un *paquete* de plug-in que genera la plantilla de `pac`. En este módulo no lo uses: registra el `.dll`.
2. En el Plugin Registration Tool: **Register** > **Register New Assembly**. En el paso 1, pulsa el botón **…** y elige tu `.dll`; comprueba que aparecen marcadas las dos clases. Deja **SandBox** y **Database** como están > **Register Selected Plugins**.
3. En el árbol, despliega tu ensamblado, haz clic derecho sobre `SIT.Plugins.SolicitudValidarCreatePlugin` > **Register New Step**: **Message** = `Create`, **Primary Entity** = `sit_solicitud`, **Event Pipeline Stage of Execution** = **PreValidation**, **Execution Mode** = **Synchronous** > **Register New Step**.
4. Repite con `SIT.Plugins.SolicitudCalcularVencimientoPlugin`, pero con **Event Pipeline Stage of Execution** = **PreOperation**.
5. Lleva lo registrado a tu solución: en make.powerapps.com, en tu solución, **Add existing** > **More** > **Developer** > **Plug-in assembly** y elige `SIT.Plugins`. Los steps **no** se agregan solos: agrégalos también con **Add existing** (en **Developer**, la opción de los pasos de plug-in).
6. Activa el trace log: en tu app Model-Driven, **Settings** (engranaje) > **Advanced settings** > **Settings** > **Administration** > **System Settings** > pestaña **Customization** > **Enable logging to plug-in trace log** = **All** > **OK**. *(Desde el PRT también puedes cambiarlo, en **Settings** > **Logging to Plug-in Trace Log**.)* Cuando termines de practicar, déjalo en **Exception**: **All** escribe un registro por cada ejecución.
7. Prueba: crea una solicitud con **Prioridad** = Crítica y sin **Costo Estimado** > **Save**. Luego pon un costo de 500 y guarda de nuevo. Crea otra con **Prioridad** = Baja.
8. Abre el trace: **Settings** > **Plug-in Trace Log** (en la misma área de configuración avanzada) y abre la entrada más reciente de cada clase.

**Qué deberías ver:** al primer guardado, un diálogo de error con tu mensaje exacto y la solicitud sin guardar; al segundo, la solicitud guardada con **Fecha Vencimiento** = ahora + 4 h; en la Baja, + 48 h. En el trace, las líneas que escribiste con `tracer.Trace`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| `Value` de Crítica, Alta, Media, Baja y Resuelta en tu ambiente | ___ |
| Texto exacto del diálogo de error al guardar la Crítica sin costo | ___ |
| **Fecha Vencimiento** de la Crítica y de la Baja (con la hora de creación) | ___ |
| Texto del bloque de mensajes (Message Block) de una entrada del trace | ___ |
| Duración de ejecución que muestra esa entrada del trace | ___ |

---

## 🧩 Microlección 3 — Update: imágenes, Filtering Attributes y con qué usuario corre

**¿Qué vas a aprender?** A reaccionar a un cambio real de estado (comparando con el valor anterior), a evitar ejecuciones inútiles y a decidir con qué identidad escribe tu plugin.

**¿Por qué existe esto?** En Update, el `Target` solo trae las columnas enviadas: no sabes el valor anterior sin una **Pre Image**. Y la tabla de auditoría la debe escribir el sistema, no el usuario: en el Laboratorio 4 el rol **SIT Técnico TI** tiene solo lectura sobre ella, a propósito.

### Crear la tabla de auditoría (15 min)

En tu solución, crea la tabla **Auditoria Solicitud** igual que creaste las del Laboratorio 2 (en **Advanced options**, **Schema name** = `auditoriasolicitud`, resultado `sit_auditoriasolicitud`; propiedad de registros: **Organization**), con estas columnas:

| Display name | Schema name (escribe solo esto) | Resultado | Data type |
|---|---|---|---|
| Solicitud | `solicitud` | `sit_solicitud` | Lookup → Solicitud TI |
| Estado Anterior | `estadoanterior` | `sit_estadoanterior` | Single line of text |
| Estado Nuevo | `estadonuevo` | `sit_estadonuevo` | Single line of text |
| Usuario | `usuario` | `sit_usuario` | Lookup → User |
| Fecha | `fecha` | `sit_fecha` | Date and time |

Después vuelve al rol **SIT Técnico TI** (Laboratorio 4) y dale **Read** = Organization sobre esta tabla, sin Create ni Write.

### El plugin (15 min)

```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace SIT.Plugins
{
    // Step: Update · sit_solicitud · Filtering Attributes: sit_estado · PostOperation · Synchronous
    // Pre Image: Entity Alias = "PreImage", Parameters = sit_estado
    public class SolicitudAuditarEstadoPlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            if (context.MessageName != "Update" || context.Stage != 40) return;
            if (!context.InputParameters.Contains("Target")) return;
            var target = context.InputParameters["Target"] as Entity;
            if (target == null || !target.Contains("sit_estado")) return;

            if (!context.PreEntityImages.Contains("PreImage"))
            {
                tracer.Trace("Falta la Pre Image 'PreImage' en el step: revisa el registro en el PRT.");
                return;
            }

            int? anterior = context.PreEntityImages["PreImage"].GetAttributeValue<OptionSetValue>("sit_estado")?.Value;
            int? nuevo = target.GetAttributeValue<OptionSetValue>("sit_estado")?.Value;

            // Filtering Attributes dispara el step si sit_estado viene en la petición, aunque no cambie
            if (anterior == nuevo)
            {
                tracer.Trace("Estado sin cambio real ({0}): no se audita.", nuevo);
                return;
            }

            // La auditoría no la escribe el usuario (el rol Técnico solo la lee): se crea como SYSTEM.
            // null = SYSTEM; el resto del plugin no necesita privilegios elevados.
            IOrganizationService servicioSistema = factory.CreateOrganizationService(null);

            var auditoria = new Entity("sit_auditoriasolicitud");
            auditoria["sit_solicitud"] = new EntityReference("sit_solicitud", context.PrimaryEntityId);
            auditoria["sit_estadoanterior"] = anterior.HasValue ? anterior.Value.ToString() : "N/A";
            auditoria["sit_estadonuevo"] = nuevo.HasValue ? nuevo.Value.ToString() : "N/A";
            // InitiatingUserId = quien hizo el cambio (el registro lo crea SYSTEM, así que createdby no sirve)
            auditoria["sit_usuario"] = new EntityReference("systemuser", context.InitiatingUserId);
            auditoria["sit_fecha"] = DateTime.UtcNow;

            Guid id = servicioSistema.Create(auditoria);
            tracer.Trace("Auditoría {0}: {1} -> {2}", id, anterior, nuevo);
        }
    }
}
```

¿Por qué **síncrono** en PostOperation y no asíncrono? Porque así la fila de auditoría forma parte de la misma transacción: si otro plugin cancela el Update, la auditoría también desaparece. Uno asíncrono escribiría después, fuera de la transacción.

### Registrar y probar (20 min)

1. Compila. En el PRT selecciona tu ensamblado > **Update** > elige el `.dll` con **…** > comprueba que aparecen las tres clases > **Update Selected Plugins**.
2. Clic derecho sobre `SIT.Plugins.SolicitudAuditarEstadoPlugin` > **Register New Step**: **Message** = `Update`, **Primary Entity** = `sit_solicitud`, **Filtering Attributes** = solo `sit_estado` (desmarca todas las demás), **Event Pipeline Stage of Execution** = **PostOperation**, **Execution Mode** = **Synchronous** > **Register New Step**.
3. Clic derecho sobre el step nuevo > **Register New Image**: **Image Type** = **Pre Image**, **Name** = `PreImage`, **Entity Alias** = `PreImage`, **Parameters** = solo `sit_estado` > **Register Image**.
4. Agrega el step nuevo a tu solución, como en la Microlección 2.
5. Prueba: cambia el **Estado** de una solicitud de Nueva a En Proceso y guarda. Después cambia solo la **Descripción** y guarda.
6. Si tienes un segundo usuario con el rol **SIT Técnico TI**, repite el cambio de estado con él.

**Qué deberías ver:** una fila nueva en **Auditoria Solicitud** con los valores numéricos anterior y nuevo, y tu usuario en **Usuario**; ninguna fila nueva al cambiar solo la Descripción.

**Ahora haz algo — diagnóstico (5 min):** un compañero escribió la misma auditoría con `CreateOrganizationService(context.UserId)` y los técnicos ya no pueden cambiar estados → **[Diagnosticar: el técnico no puede cambiar el estado](/practica/ip-plg-002-tecnico-no-puede-cambiar-estado)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| **Estado Anterior** y **Estado Nuevo** de la fila de auditoría | ___ |
| Valor de **Usuario** y de **Created By** de esa fila (¿por qué son distintos?) | ___ |
| ¿Se creó auditoría al cambiar solo la Descripción? ¿Qué lo impidió? | ___ |
| Línea del trace del caso "sin cambio real", si la provocaste | ___ |
| Resultado con el usuario Técnico (o "sin segundo usuario") | ___ |

---

## 🧩 Microlección 4 — Pruebas unitarias sin tenant

**¿Qué vas a aprender?** A probar la lógica de un plugin en tu máquina, simulando el `IServiceProvider` con Moq.

**¿Por qué existe esto?** Registrar, probar en el tenant y leer el trace lleva minutos por intento. Una prueba unitaria lleva segundos y se repite en cada cambio.

**Práctica (40 min):** crea un proyecto de pruebas `SIT.Plugins.Tests` para .NET Framework 4.8 con **MSTest**, el mismo framework que usa el Laboratorio 23 (que amplía estas mismas pruebas).

- **Con Visual Studio:** clic derecho en la solución > **Add** > **New Project** > **Class Library (.NET Framework)**, .NET Framework 4.8. Instala con NuGet `MSTest.TestFramework`, `MSTest.TestAdapter`, `Microsoft.NET.Test.Sdk`, `Moq` y `Microsoft.CrmSdk.CoreAssemblies`, y agrega una referencia (**Add** > **Project Reference**) al proyecto `SIT.Plugins`.
- **Con la terminal:** junto a la carpeta `SIT.Plugins`, crea la carpeta `SIT.Plugins.Tests` y dentro un archivo `SIT.Plugins.Tests.csproj` con este contenido (la plantilla `dotnet new classlib` no ofrece .NET Framework, por eso se escribe a mano):

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <IsPackable>false</IsPackable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.14.1" />
    <PackageReference Include="MSTest.TestAdapter" Version="3.11.1" />
    <PackageReference Include="MSTest.TestFramework" Version="3.11.1" />
    <PackageReference Include="Moq" Version="4.20.72" />
    <PackageReference Include="Microsoft.CrmSdk.CoreAssemblies" Version="9.0.2.60" />
    <!-- Ensamblados de referencia de .NET Framework: compila sin instalar el Developer Pack -->
    <PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies" Version="1.0.3" PrivateAssets="All" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\SIT.Plugins\SIT.Plugins.csproj" />
  </ItemGroup>
</Project>
```

Agrega al proyecto de pruebas el archivo `SolicitudPluginsTests.cs`:

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
        // Arma un IServiceProvider falso con el contexto y el tracing que piden los plugins
        private static IServiceProvider CrearProveedor(string mensaje, int etapa, Entity target)
        {
            var context = new Mock<IPluginExecutionContext>();
            context.Setup(c => c.MessageName).Returns(mensaje);
            context.Setup(c => c.Stage).Returns(etapa);
            context.Setup(c => c.InputParameters).Returns(new ParameterCollection { { "Target", target } });

            var proveedor = new Mock<IServiceProvider>();
            proveedor.Setup(p => p.GetService(typeof(IPluginExecutionContext))).Returns(context.Object);
            proveedor.Setup(p => p.GetService(typeof(ITracingService))).Returns(new Mock<ITracingService>().Object);
            return proveedor.Object;
        }

        [TestMethod]
        public void Critica_sin_costo_cancela_con_mensaje()
        {
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(SolicitudValores.PRIORIDAD_CRITICA);

            try
            {
                new SolicitudValidarCreatePlugin().Execute(CrearProveedor("Create", 10, target));
            }
            catch (InvalidPluginExecutionException ex)
            {
                StringAssert.Contains(ex.Message, "Costo Estimado");
                return; // la excepción esperada llegó: la prueba pasa
            }

            Assert.Fail("El plugin debía cancelar la creación de una Crítica sin costo.");
        }

        [TestMethod]
        public void Critica_con_costo_no_cancela()
        {
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(SolicitudValores.PRIORIDAD_CRITICA);
            target["sit_costoestimado"] = new Money(500m);

            // Si el plugin lanza una excepción, la prueba falla sola
            new SolicitudValidarCreatePlugin().Execute(CrearProveedor("Create", 10, target));
        }

        [TestMethod]
        public void Baja_vence_en_48_horas()
        {
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(SolicitudValores.PRIORIDAD_BAJA);
            DateTime antes = DateTime.UtcNow;

            new SolicitudCalcularVencimientoPlugin().Execute(CrearProveedor("Create", 20, target));

            DateTime vence = target.GetAttributeValue<DateTime>("sit_fechavencimiento");
            Assert.IsTrue(vence >= antes.AddHours(48) && vence <= DateTime.UtcNow.AddHours(48),
                $"Debía vencer en 48 h. Vence: {vence:u}");
        }

        [TestMethod]
        public void En_otra_etapa_no_toca_el_target()
        {
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(SolicitudValores.PRIORIDAD_ALTA);

            new SolicitudCalcularVencimientoPlugin().Execute(CrearProveedor("Create", 40, target));

            Assert.IsFalse(target.Contains("sit_fechavencimiento"));
        }
    }
}
```

Ejecútalas: en Visual Studio, **Test** > **Test Explorer** > **Run All Tests**; en la terminal, `dotnet test` dentro de la carpeta `SIT.Plugins.Tests`. **Qué deberías ver:** 4 pruebas superadas y ninguna con error. Después rompe algo a propósito (por ejemplo, cambia 48 por 24 en `HorasSla`) y comprueba que falla `Baja_vence_en_48_horas` con tu mensaje "Debía vencer en 48 h…". Deshaz el cambio.

**Si no lo ves:** si `dotnet test` o **Test Explorer** dicen que no hay pruebas, revisa que el proyecto tenga `MSTest.TestAdapter` y `Microsoft.NET.Test.Sdk`, y que la clase tenga `[TestClass]` y los métodos `[TestMethod]`. Si la carpeta del proyecto está muy anidada (rutas de más de 260 caracteres), Windows puede impedir que se encuentren las pruebas: mueve la solución a una ruta corta, como `C:\dev\SIT.Plugins`.

| Campo | Tu valor |
|---|---|
| Número de pruebas que pasan | ___ |
| Mensaje de la prueba que falló al romper `HorasSla` | ___ |
| Una prueba más que agregarías para `SolicitudAuditarEstadoPlugin`: qué simularías (basta con describirlo; el Ejercicio 5 del Laboratorio 23 la escribe completa) | ___ |

---

## 🏗️ Reto de construcción (sin pasos)

**Requerimiento:** una solicitud no puede pasar a **Resuelta** si no tiene **Descripción de Solución** (`sit_descripcion_solucion`). La descripción puede venir en la misma actualización o estar guardada de antes. El usuario debe ver un mensaje claro y la solicitud no debe guardarse.

**Criterios de aceptación:**

- Pasar a Resuelta sin descripción (ni guardada ni enviada) muestra tu mensaje y no guarda.
- Pasar a Resuelta escribiendo la descripción en el mismo guardado funciona.
- Pasar a Resuelta cuando la descripción ya estaba guardada funciona.
- Cambiar la Descripción de Solución de una solicitud ya resuelta **no** dispara la validación.
- Al menos dos pruebas unitarias cubren el caso que cancela y uno que no.

**Restricciones:** no hagas un `Retrieve` del registro (usa lo que el pipeline ya te da), elige la etapa en la que conviene cancelar y limita el step a las columnas necesarias.

> Pista si te atascas: el `Target` de un Update solo trae lo enviado. ¿Dónde está la descripción guardada de antes, y qué columnas necesita esa imagen?
>
> Pista para las pruebas: el `CrearProveedor` de la Microlección 4 no configura imágenes, y un mock de Moq sin `Setup` devuelve `null` para `PreEntityImages`: tu plugin fallaría con `NullReferenceException` en la prueba aunque en el tenant funcione. Amplía `CrearProveedor` con un parámetro opcional `Entity preImage = null` y agrega, antes de crear el proveedor, estas líneas (con el **Entity Alias** que registres en tu step):
>
> ```csharp
> var imagenes = new EntityImageCollection();
> if (preImage != null) imagenes.Add("PreImage", preImage); // la clave es el Entity Alias de tu imagen
> context.Setup(c => c.PreEntityImages).Returns(imagenes);
> ```

| Campo | Tu valor |
|---|---|
| Etapa, modo y Filtering Attributes de tu step | ___ |
| Entity Alias y Parameters de tu imagen | ___ |
| Texto exacto del mensaje que ve el usuario | ___ |
| Resultado de los tres casos de prueba en el tenant | ___ |

---

## 🔧 Diagnosticar — síntoma primero

Antes de ver ninguna causa, resuelve **[Diagnosticar: el técnico no puede cambiar el estado](/practica/ip-plg-002-tecnico-no-puede-cambiar-estado)** si no lo hiciste en la Microlección 3. Escribe tu hipótesis con el dato del mensaje de error que la sostiene, y solo después pide las pistas.

Para practicar la lectura del síntoma en tu tenant: desactiva por un momento tu step de auditoría (en el PRT, selecciónalo > **Disable**), cambia un estado y comprueba en el trace y en la tabla qué evidencia queda (y cuál no) cuando un step no corre. Vuelve a activarlo con **Enable**.

| Campo | Tu valor |
|---|---|
| Tu hipótesis para el error del técnico, antes de las pistas | ___ |
| Qué evidencia quedó con el step desactivado | ___ |

---

## 🔁 Reto de transferencia

Ya validaste y completaste datos con reglas internas. Ahora el requisito **cambia**: una aseguradora necesita que, al crear una **Póliza**, Dataverse compruebe el documento del tomador contra un **servicio externo** de listas restrictivas (una API HTTPS con clave). Si el tomador aparece en la lista, la póliza no se crea. La clave de la API no puede viajar en las soluciones exportadas, y el servicio a veces tarda o no responde.

**[Transferir: validar contra un servicio externo](/practica/ip-plg-003-validar-contra-servicio-externo)** — decide etapa, modo, dónde va la clave, cómo llamar al servicio y qué hacer si falla. Si solo memorizaste el registro de la Microlección 2, este reto te lo va a mostrar.

| Campo | Tu valor |
|---|---|
| Etapa y modo del step, con la razón | ___ |
| Dónde guardarías la clave de la API y cómo la recibe el plugin | ___ |
| Qué haría el plugin si el servicio no responde, y qué ve el usuario | ___ |
| Por qué no lo resolverías con un plugin asíncrono | ___ |

---

### 💼 Caso Real de Negocio
**Empresa:** Empresa financiera con requerimiento regulatorio  
**Problema:** Los usuarios podían crear préstamos sin validar que el cliente no tuviera deudas vencidas. La validación en el formulario era fácil de eludir.  
**Solución:** Plugin Pre-Create en la tabla Préstamo que consulta el historial crediticio vía API del buró de crédito. Si el cliente tiene deudas vencidas, lanza `InvalidPluginExecutionException` con mensaje claro. Imposible eludir — se ejecuta en el servidor independientemente de la UI.  
**Resultado:** Cumplimiento regulatorio 100%. Eliminación de préstamos aprobados con deuda vencida.

### ✅ Buenas Prácticas
- Evitar la recursión con diseño, no con `context.Depth > 1`: Filtering Attributes, comparar valores antes de escribir y no actualizar el mismo registro desde PostOperation. Dataverse corta por su cuenta las cadenas que superan su límite de profundidad
- Usar ITracingService para logging — indispensable para debugging en producción
- Filtrar por `Filtering Attributes` en el step — no ejecutar si no cambiaron los campos relevantes
- PreValidation para validaciones que pueden cancelar la operación; PreOperation para cambiar valores del Target
- Post-Operation (async) para tareas que no deben bloquear al usuario y que pueden ocurrir fuera de la transacción
- Unit tests con Moq son obligatorios para plugins — no se puede debuggear en producción fácilmente
- Imágenes con solo las columnas que usa el código, nunca "todas"
- Elevar a SYSTEM (`CreateOrganizationService(null)`) solo la operación que lo necesita, y dejarlo comentado en el código
- Claves de APIs en la configuración segura del step (o en Azure Key Vault), nunca en el código ni en la configuración no segura
- Llamadas HTTP con `Timeout` corto y conexión no persistente; el plugin entero debería durar segundos
- Números consecutivos con una columna Autonumber, no consultando "el último" desde un plugin

### ⚠️ Errores Comunes
| Síntoma | Causa | Solución |
|-------|-------|----------|
| El plugin se ejecuta en operaciones que no debía tocar | Faltan guardas de mensaje, etapa y tabla | Comprobar `MessageName`, `Stage` y `LogicalName` al inicio |
| "Object reference not set" o `KeyNotFoundException` | Se lee con `entity["campo"]` una columna que no vino en el Target | Usar `GetAttributeValue<T>()`, que devuelve null/default si no existe |
| El PRT no registra el ensamblado | Ensamblado sin firmar (strong name) o compilado para un .NET que no es Framework 4.6.2-4.8 | Firmar el proyecto y revisar el `TargetFramework` |
| "Falta la Pre Image" en el trace, o `KeyNotFoundException` al leerla | La imagen no se registró, o su **Entity Alias** no coincide con la clave del código | Registrar la imagen con el mismo alias que lee el código |
| La validación pasa aunque la descripción esté vacía | En Update el Target solo trae lo enviado y el código no mira lo guardado | Leer el valor anterior desde una Pre Image |
| Un usuario con permisos sobre la solicitud recibe un error de privilegio de otra tabla | El plugin escribe en una tabla sobre la que ese usuario no tiene permiso | Crear esa fila con un servicio como SYSTEM (`null`) o con **Run in User's Context** |
| Solicitudes que crea un flujo no se procesan | El plugin sale con `if (context.Depth > 1) return;` | Quitar la dependencia de Depth y evitar el bucle por diseño |
| Error por superar el límite de profundidad | Un plugin de Update actualiza el mismo registro desde PostOperation | Poner el valor en el Target en PreOperation |
| Error de tiempo de espera, o un guardado que tarda mucho | Consulta sin límite o API externa lenta | `TopCount`/`ColumnSet` acotados; `HttpClient` con `Timeout` de pocos segundos; lo que pueda esperar, asíncrono |
| Números `SOL-` repetidos | Numeración con "último + 1" desde el plugin | Columna Autonumber |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica de etapas y conecté el Plugin Registration Tool a mi entorno
- [ ] Registré el plugin de PreValidation y anoté el mensaje exacto que vio el usuario al guardar una Crítica sin costo
- [ ] Registré el plugin de PreOperation y comprobé la Fecha Vencimiento de dos prioridades distintas
- [ ] Agregué el ensamblado y sus steps a mi solución
- [ ] Activé el trace log, leí una entrada de cada plugin y lo dejé de nuevo en Exception
- [ ] Registré el step de Update con Filtering Attributes y una Pre Image con solo `sit_estado`, y comprobé que cambiar otra columna no audita
- [ ] Expliqué por qué la fila de auditoría se crea como SYSTEM y por qué el plugin es síncrono
- [ ] Diagnostiqué el error de privilegios del técnico formulando una hipótesis antes de ver la causa
- [ ] Al menos 4 pruebas unitarias pasan con Moq, y vi fallar una al romper la lógica
- [ ] Construí sin pasos la regla de cierre de Resuelta con su imagen y sus pruebas
- [ ] Resolví el reto de transferencia del servicio externo y justifiqué etapa, modo y manejo de errores

---

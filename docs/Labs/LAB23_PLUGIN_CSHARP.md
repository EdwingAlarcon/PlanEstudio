---
id: lab-23
title: "Plugin C# — Validación Server-Side y Auditoría Personalizada"
level: "N3"
duration: "120 min"
product: ["Dataverse SDK", "C#", "Plugin Registration Tool"]
certifications: ["PL-400"]
role: ["Developer"]
prerequisites:
  - "Lab 02 completado — tabla sit_Solicitud con columnas sit_prioridad, sit_estado, sit_costoestimado"
  - "Visual Studio 2022 instalado (Community o superior)"
  - "NuGet package manager disponible"
  - "Plugin Registration Tool descargado (pac tool install --tool prt)"
  - "Módulo 23 estudiado: C# Plugins para Dataverse"
files:
  - "SIT.Plugins.csproj"
  - "SolicitudPreCreatePlugin.cs"
  - "SolicitudPostUpdatePlugin.cs"
---

# Lab 23 — Plugin C#: Validación Server-Side y Auditoría Personalizada (SIT)

## Objetivo

Al finalizar este laboratorio podrás desarrollar, registrar y probar dos plugins C# en Dataverse: un plugin Pre-Operation que valida reglas de negocio y asigna numeración automática al crear solicitudes, y un plugin Post-Operation que registra auditoría personalizada cuando cambia el estado de una solicitud.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación de Labs 02, 05 y 09

**Problema a resolver:**
1. **Las Business Rules del Lab 02** protegen en formularios de UI, pero no en la API, Power Automate ni integraciones. Un técnico que llama directamente a la API de Dataverse puede crear solicitudes urgentes sin presupuesto, bypaseando la validación.
2. **El historial de auditoría nativo** de Dataverse registra todos los campos — demasiado ruido. Se necesita un log de negocio que registre solo los cambios de estado con contexto: quién, cuándo, de qué estado a cuál.
3. **Los números de solicitud** se asignan manualmente y hay duplicados. Se necesita autonumeración `SOL-XXXXX` garantizada en el servidor.

**Por qué Plugin C#:** Los plugins se ejecutan **en el pipeline de Dataverse en el servidor**, independientemente de la interfaz usada (UI, API, Power Automate, importación de datos). Es la única forma de garantizar que las reglas de negocio se aplican en todos los canales sin excepción.

## Lo que vas a construir

- **Proyecto C#** `SIT.Plugins` con estructura de solución correcta
- **`SolicitudPreCreatePlugin`** (Pre-Operation, Stage 20): valida presupuesto en solicitudes urgentes, asigna número SOL-XXXXX
- **`SolicitudPostUpdatePlugin`** (Post-Operation, Stage 40): registra cambios de estado en tabla de auditoría `sit_auditoriasolicitud`
- **Registro en PRT**: Steps con Filtering Attributes e Images configurados
- **Tests unitarios** con Moq para los dos plugins

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Configurar proyecto Visual Studio | 20 min |
| Ejercicio 2 — Plugin PreCreate: validación y numeración | 35 min |
| Ejercicio 3 — Plugin PostUpdate: auditoría | 25 min |
| Ejercicio 4 — Registrar en Plugin Registration Tool | 20 min |
| Ejercicio 5 — Tests unitarios con Moq | 20 min |
| **Total** | **120 min** |

## Nivel

**N3 Avanzado** — Certificación objetivo: **PL-400**

## Tecnologías utilizadas

- C# .NET Framework 4.6.2
- Dataverse SDK (`Microsoft.CrmSdk.CoreAssemblies`)
- Plugin Registration Tool (PRT)
- MSTest / xUnit + Moq
- Visual Studio 2022
- Power Platform CLI (`pac`)

## Prerrequisitos

### Entorno

- [ ] Visual Studio 2022 (Community, Professional o Enterprise)
- [ ] .NET Framework 4.6.2 Developer Pack instalado
- [ ] Plugin Registration Tool: ejecutar `pac tool install --tool prt` en una terminal
- [ ] Tabla `sit_Solicitud` del Lab 02 con las columnas `sit_prioridad`, `sit_estado`, `sit_costoestimado`

### Tabla adicional que debes crear antes de empezar

Crea manualmente en Dataverse la tabla de auditoría que usará el plugin PostUpdate:

| Campo | Valor |
|---|---|
| Nombre de la tabla | Auditoria Solicitud |
| Nombre plural | Auditorias Solicitud |
| Nombre lógico | sit_auditoriasolicitud |
| Ownership | Organization |

Columnas:

| Nombre visual | Nombre lógico | Tipo |
|---|---|---|
| Solicitud | `sit_solicitud` | Lookup → sit_Solicitud |
| Estado Anterior | `sit_estadoanterior` | Texto |
| Estado Nuevo | `sit_estadonuevo` | Texto |
| Usuario | `sit_usuario` | Lookup → SystemUser |
| Fecha | `sit_fecha` | Fecha y hora |

---

## Datos de apoyo

### Valores de OptionSet para el código C#

Antes de escribir el plugin, anota los valores numéricos de las opciones. Los encuentras en make.powerapps.com → tabla `sit_Solicitud` → columna `sit_prioridad` → editar opciones:

| Prioridad | Valor numérico |
|---|---|
| Baja | Anota: ___ |
| Media | Anota: ___ |
| Alta | Anota: ___ |
| Crítica/Urgente | Anota: ___ |

| Estado | Valor numérico |
|---|---|
| Nueva | Anota: ___ |
| En Proceso | Anota: ___ |
| Resuelta | Anota: ___ |
| Cerrada | Anota: ___ |

> **¿Por qué anotar estos valores?** Los plugins acceden a las opciones de elección mediante su valor entero (`OptionSetValue.Value`), no por su etiqueta. Si usas el valor equivocado, la validación fallará silenciosamente.

---

## Ejercicio 1 — Configurar proyecto Visual Studio

> **Qué vas a hacer:** Crear la solución C# con la estructura correcta, instalar los paquetes NuGet del SDK de Dataverse y generar las clases Early-Bound.
> **Duración:** 20 min

### Tarea 1.1 — Crear la solución y proyecto

1. Abre Visual Studio 2022.

2. **Crear nueva solución:**
   - **Archivo** → **Nuevo** → **Proyecto**
   - Filtra por tipo: **C#**, framework: **.NET Framework**
   - Selecciona **Biblioteca de clases (.NET Framework)**
   - Configura:

   | Campo | Valor |
   |---|---|
   | Nombre del proyecto | SIT.Plugins |
   | Nombre de la solución | SIT.Plugins |
   | Ubicación | Tu carpeta de proyectos |
   | Framework | .NET Framework 4.6.2 |

3. Haz clic en **Crear**.

4. Elimina el archivo `Class1.cs` generado por defecto (clic derecho → Eliminar).

### Tarea 1.2 — Instalar paquetes NuGet

1. Clic derecho en el proyecto `SIT.Plugins` → **Administrar paquetes NuGet**.

2. En la pestaña **Examinar**, busca e instala:

   | Paquete | Versión |
   |---|---|
   | `Microsoft.CrmSdk.CoreAssemblies` | 9.0.2.* (la más reciente 9.0.2.x) |
   | `Microsoft.CrmSdk.Workflow` | 9.0.2.* |

3. Acepta los términos de licencia.

   > ⚠️ **Usa exactamente .NET Framework 4.6.2**. Si usas .NET 5+, .NET 6+, o .NET Standard, el plugin no funcionará en el sandbox de Dataverse. El sandbox de la nube solo soporta plugins compilados para .NET Framework 4.6.2.

### Tarea 1.3 — Agregar proyecto de tests

1. Clic derecho en la **Solución** (no en el proyecto) → **Agregar** → **Nuevo proyecto**.

2. Selecciona **Proyecto de prueba de MSTest (.NET Framework)**:
   - Nombre: `SIT.Plugins.Tests`
   - Framework: .NET Framework 4.6.2

3. En `SIT.Plugins.Tests`, instala vía NuGet:
   - `Moq` (versión 4.20.*)
   - `Microsoft.CrmSdk.CoreAssemblies` (misma versión que el proyecto principal)

4. Agrega referencia al proyecto principal:
   - Clic derecho en `SIT.Plugins.Tests` → **Agregar** → **Referencia de proyecto** → selecciona `SIT.Plugins`

---

## Ejercicio 2 — Plugin PreCreate: validación y numeración

> **Qué vas a hacer:** Implementar el plugin que se ejecuta antes de que Dataverse guarde una nueva solicitud, valida que las urgentes tengan presupuesto, y asigna el número SOL-XXXXX.
> **Duración:** 35 min

### Tarea 2.1 — Crear la clase del plugin

1. En el proyecto `SIT.Plugins`, clic derecho → **Agregar** → **Clase nueva**.
2. Nombre: `SolicitudPreCreatePlugin.cs`.

### Tarea 2.2 — Implementar la lógica

```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace SIT.Plugins
{
    /// <summary>
    /// Se ejecuta en Pre-Operation (Stage 20) al crear una Solicitud.
    /// Valida presupuesto en urgentes y asigna número SOL-XXXXX.
    /// </summary>
    public class SolicitudPreCreatePlugin : IPlugin
    {
        // Reemplaza estos valores con los que anotaste en "Datos de apoyo"
        private const int PRIORIDAD_URGENTE = 100000002;
        private const int PRIORIDAD_ALTA    = 100000001;
        private const int PRIORIDAD_NORMAL  = 100000000;

        public void Execute(IServiceProvider serviceProvider)
        {
            var tracer = (ITracingService)serviceProvider
                .GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider
                .GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider
                .GetService(typeof(IOrganizationServiceFactory));
            var service = serviceFactory.CreateOrganizationService(context.UserId);

            tracer.Trace("SolicitudPreCreatePlugin — Depth: {0}, Stage: {1}, Message: {2}",
                context.Depth, context.Stage, context.MessageName);

            // Guard: evitar recursión y verificar evento correcto
            if (context.Depth > 1) return;
            if (context.MessageName != "Create" || context.Stage != 20) return;
            if (!context.InputParameters.Contains("Target") ||
                !(context.InputParameters["Target"] is Entity)) return;

            var solicitud = (Entity)context.InputParameters["Target"];

            ValidarPresupuestoEnUrgentes(tracer, solicitud);
            AsignarNumeroAutomatico(tracer, service, solicitud);
            CalcularFechaVencimiento(tracer, solicitud);
        }

        private void ValidarPresupuestoEnUrgentes(ITracingService tracer, Entity solicitud)
        {
            var prioridad = solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad");
            var presupuesto = solicitud.GetAttributeValue<Money>("sit_costoestimado");

            bool esUrgente = prioridad?.Value == PRIORIDAD_URGENTE;

            tracer.Trace("Validando presupuesto — Prioridad: {0}, Urgente: {1}",
                prioridad?.Value, esUrgente);

            if (esUrgente && (presupuesto == null || presupuesto.Value <= 0))
            {
                throw new InvalidPluginExecutionException(
                    "Las solicitudes urgentes requieren un costo estimado mayor a cero. " +
                    "Ingresa el presupuesto estimado antes de continuar.");
            }
        }

        private void AsignarNumeroAutomatico(ITracingService tracer,
            IOrganizationService service, Entity solicitud)
        {
            // Buscar el último número asignado (por fecha de creación descendente)
            var query = new QueryExpression("sit_solicitud")
            {
                ColumnSet = new ColumnSet("sit_numerosolicitud"),
                TopCount = 1
            };
            query.AddOrder("createdon", OrderType.Descending);

            var resultados = service.RetrieveMultiple(query);
            int siguienteNumero = 1;

            if (resultados.Entities.Count > 0)
            {
                var ultimo = resultados.Entities[0]
                    .GetAttributeValue<string>("sit_numerosolicitud");

                if (!string.IsNullOrEmpty(ultimo) && ultimo.StartsWith("SOL-"))
                {
                    if (int.TryParse(ultimo.Substring(4), out int num))
                        siguienteNumero = num + 1;
                }
            }

            var numero = $"SOL-{siguienteNumero:D5}";
            solicitud["sit_numerosolicitud"] = numero;
            tracer.Trace("Número asignado: {0}", numero);
        }

        private void CalcularFechaVencimiento(ITracingService tracer, Entity solicitud)
        {
            var prioridad = solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad");

            DateTime vencimiento;
            switch (prioridad?.Value)
            {
                case PRIORIDAD_URGENTE: vencimiento = DateTime.UtcNow.AddHours(4);  break;
                case PRIORIDAD_ALTA:    vencimiento = DateTime.UtcNow.AddHours(24); break;
                default:                vencimiento = DateTime.UtcNow.AddDays(5);   break;
            }

            solicitud["sit_fechavencimiento"] = vencimiento;
            tracer.Trace("Fecha vencimiento calculada: {0}", vencimiento);
        }
    }
}
```

> **¿Por qué `GetAttributeValue<T>()`?** Esta extensión del SDK retorna el valor del atributo si existe, o `null`/`default(T)` si no existe. Es más seguro que acceder por índice (`solicitud["campo"]`) porque no lanza `KeyNotFoundException` si el campo no se incluyó en el Target.

> **¿Por qué `throw new InvalidPluginExecutionException`?** Es la única excepción que Dataverse muestra al usuario como un mensaje de negocio comprensible. Cualquier otra excepción no controlada mostrará un error genérico técnico.

### Tarea 2.3 — Agregar columna `sit_numerosolicitud`

Si no tienes ya esta columna en Dataverse:

1. En make.powerapps.com → tabla `sit_Solicitud` → **+ Nueva columna**:
   - Nombre: `Numero Solicitud`
   - Tipo: Texto (longitud 20)
   - Requerido: No (lo rellena el plugin automáticamente)

2. Agrega también `sit_fechavencimiento`:
   - Nombre: `Fecha Vencimiento`
   - Tipo: Fecha y hora

---

## Ejercicio 3 — Plugin PostUpdate: auditoría

> **Qué vas a hacer:** Implementar el plugin que se ejecuta después de que Dataverse guarda cambios en una solicitud, captura el cambio de estado y crea un registro de auditoría personalizado.
> **Duración:** 25 min

### Tarea 3.1 — Crear la clase del plugin

1. En `SIT.Plugins`, nueva clase: `SolicitudPostUpdatePlugin.cs`.

### Tarea 3.2 — Implementar el plugin PostUpdate

```csharp
using Microsoft.Xrm.Sdk;
using System;

namespace SIT.Plugins
{
    /// <summary>
    /// Se ejecuta en Post-Operation (Stage 40) al modificar una Solicitud.
    /// Registra cambios de estado en sit_auditoriasolicitud.
    /// Requiere Pre-Image "PreImage" con atributo sit_estado.
    /// </summary>
    public class SolicitudPostUpdatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var tracer = (ITracingService)serviceProvider
                .GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider
                .GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider
                .GetService(typeof(IOrganizationServiceFactory));
            var service = serviceFactory.CreateOrganizationService(context.UserId);

            tracer.Trace("SolicitudPostUpdatePlugin — Depth: {0}", context.Depth);

            if (context.Depth > 1) return;
            if (context.MessageName != "Update" || context.Stage != 40) return;
            if (!context.InputParameters.Contains("Target")) return;

            var target = (Entity)context.InputParameters["Target"];

            // Solo procesar si sit_estado fue modificado en esta operación
            if (!target.Attributes.Contains("sit_estado"))
            {
                tracer.Trace("sit_estado no fue modificado — saliendo.");
                return;
            }

            // Obtener estado anterior desde la Pre-Image
            Entity preImage = null;
            if (context.PreEntityImages.Contains("PreImage"))
                preImage = context.PreEntityImages["PreImage"];

            var estadoAnterior = preImage?
                .GetAttributeValue<OptionSetValue>("sit_estado");
            var estadoNuevo = target
                .GetAttributeValue<OptionSetValue>("sit_estado");

            // Solo registrar si hubo un cambio real
            if (estadoAnterior?.Value == estadoNuevo?.Value)
            {
                tracer.Trace("Estado no cambió ({0} → {1}) — saliendo.",
                    estadoAnterior?.Value, estadoNuevo?.Value);
                return;
            }

            tracer.Trace("Cambio de estado: {0} → {1}",
                estadoAnterior?.Value ?? -1, estadoNuevo?.Value ?? -1);

            RegistrarAuditoria(service, context, preImage, target,
                estadoAnterior, estadoNuevo, tracer);
        }

        private void RegistrarAuditoria(IOrganizationService service,
            IPluginExecutionContext context, Entity preImage, Entity target,
            OptionSetValue estadoAnterior, OptionSetValue estadoNuevo,
            ITracingService tracer)
        {
            var auditoria = new Entity("sit_auditoriasolicitud");

            auditoria["sit_solicitud"] = new EntityReference(
                "sit_solicitud", context.PrimaryEntityId);

            // Intentar obtener la etiqueta del estado anterior desde la PreImage
            // Si no está disponible, usar el valor numérico como fallback
            auditoria["sit_estadoanterior"] = estadoAnterior != null
                ? estadoAnterior.Value.ToString()
                : "Desconocido";

            auditoria["sit_estadonuevo"] = estadoNuevo != null
                ? estadoNuevo.Value.ToString()
                : "Desconocido";

            auditoria["sit_usuario"] = new EntityReference(
                "systemuser", context.InitiatingUserId);

            auditoria["sit_fecha"] = DateTime.UtcNow;

            service.Create(auditoria);
            tracer.Trace("Registro de auditoría creado exitosamente.");
        }
    }
}
```

> **¿Por qué `context.InitiatingUserId` y no `context.UserId`?** `UserId` es el usuario "impersonado" si el plugin fue llamado vía impersonación. `InitiatingUserId` siempre es el usuario humano que originó la acción — el que queremos registrar en la auditoría.

> **¿Por qué verificar `target.Attributes.Contains("sit_estado")`?** En un Update, el Target solo contiene los atributos que **realmente se modificaron** en esa operación. Si el usuario solo cambió la descripción, `sit_estado` no estará en el Target. Verificarlo evita falsos positivos.

---

## Ejercicio 4 — Registrar en Plugin Registration Tool

> **Qué vas a hacer:** Compilar el DLL, conectar al ambiente Dataverse y registrar los dos plugins con sus Steps, Filtering Attributes y Pre-Images.
> **Duración:** 20 min

### Tarea 4.1 — Compilar el proyecto

1. En Visual Studio, cambia la configuración a **Release** (menú desplegable en la barra de herramientas, junto al selector de plataforma).

2. **Compilar** → **Compilar solución** (`Ctrl + Shift + B`).

3. Verifica en la ventana de Output que la compilación fue exitosa: `Build succeeded. 0 Error(s)`.

4. El DLL compilado está en: `SIT.Plugins\bin\Release\SIT.Plugins.dll`

### Tarea 4.2 — Abrir Plugin Registration Tool

1. En una terminal (PowerShell o CMD):
   ```bash
   pac tool prt
   ```
   Esto abre la GUI del Plugin Registration Tool.

2. Haz clic en **CREATE NEW CONNECTION**:
   - **Discovery URL:** `https://[tu-org].crm.dynamics.com`
   - **Credentials:** User/password de tu cuenta del tenant
   - Haz clic en **Login**

### Tarea 4.3 — Registrar el Assembly

1. Haz clic en **Register** → **Register New Assembly**.

2. En el diálogo:
   - Haz clic en `...` y navega a `SIT.Plugins\bin\Release\SIT.Plugins.dll`
   - **Isolation Mode:** Sandbox
   - **Location:** Database
   - Verifica que aparezcan las dos clases: `SIT.Plugins.SolicitudPreCreatePlugin` y `SIT.Plugins.SolicitudPostUpdatePlugin`

3. Haz clic en **Register Selected Plugins**.

### Tarea 4.4 — Registrar el Step para PreCreate

1. En el árbol de la izquierda, expande el assembly `SIT.Plugins` → clic derecho en `SolicitudPreCreatePlugin` → **Register New Step**.

2. Configura:

   | Campo | Valor |
   |---|---|
   | Message | Create |
   | Primary Entity | sit_solicitud |
   | Filtering Attributes | (dejar vacío — aplica a Create completo) |
   | Event Pipeline Stage | Pre-operation (20) |
   | Execution Mode | Synchronous |
   | Deployment | Server Only |
   | Description | Valida presupuesto en urgentes y asigna SOL-XXXXX |

3. Haz clic en **Register New Step**.

### Tarea 4.5 — Registrar el Step para PostUpdate

1. Clic derecho en `SolicitudPostUpdatePlugin` → **Register New Step**.

2. Configura:

   | Campo | Valor |
   |---|---|
   | Message | Update |
   | Primary Entity | sit_solicitud |
   | Filtering Attributes | `sit_estado` (MUY IMPORTANTE — solo dispara si cambió este campo) |
   | Event Pipeline Stage | Post-operation (40) |
   | Execution Mode | Synchronous |
   | Deployment | Server Only |

3. Haz clic en **Register New Step**.

4. Ahora registra la **Pre-Image** en el Step:
   - En el árbol, expande el Step del PostUpdate → clic derecho → **Register New Image**
   - **Image Type:** Pre Image
   - **Name:** PreImage
   - **Entity Alias:** PreImage
   - **Parameters:** `sit_estado` (solo necesitamos este campo)

5. Haz clic en **Register Image**.

   > **¿Por qué `Filtering Attributes = sit_estado`?** Sin esto, el plugin PostUpdate se dispararía cada vez que se modifica cualquier campo de la solicitud (cambiar la descripción, actualizar el asignado, etc.), creando registros de auditoría innecesarios.

### Tarea 4.6 — Probar los plugins

**Prueba del PreCreate:**

1. Crea una nueva solicitud desde la Canvas App del Lab 03 o directamente en Dataverse con Prioridad = Urgente/Crítica y sin Costo Estimado.

   **Resultado esperado:** aparece el mensaje de error del plugin antes de guardar.

2. Crea una solicitud con Prioridad = Media sin Costo Estimado.

   **Resultado esperado:** la solicitud se guarda con número `SOL-00001` asignado automáticamente.

**Prueba del PostUpdate:**

3. Abre una solicitud existente y cambia su Estado → guarda.

4. Ve a la tabla `sit_auditoriasolicitud` en Dataverse → verifica que se creó un nuevo registro de auditoría con el cambio de estado.

### Validación del Ejercicio 4

- [ ] El DLL compiló sin errores en modo Release
- [ ] El assembly `SIT.Plugins` aparece en el árbol del PRT conectado al ambiente
- [ ] El Step del PreCreate está registrado con Stage 20 (Pre-operation)
- [ ] El Step del PostUpdate tiene Filtering Attribute `sit_estado` y Pre-Image "PreImage"
- [ ] Al crear una solicitud urgente sin presupuesto, el error del plugin aparece
- [ ] Al crear una solicitud normal, se asigna el número SOL-XXXXX
- [ ] Al cambiar el estado, se crea el registro en `sit_auditoriasolicitud`

---

## Ejercicio 5 — Tests unitarios con Moq

> **Qué vas a hacer:** Escribir tests que verifiquen la lógica del plugin sin necesitar una conexión real a Dataverse, usando Moq para simular los servicios.
> **Duración:** 20 min

### Tarea 5.1 — Crear la clase de tests del PreCreate

En el proyecto `SIT.Plugins.Tests`, abre `UnitTest1.cs` y reemplázalo (o crea `SolicitudPreCreatePluginTests.cs`):

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Moq;
using SIT.Plugins;
using System;

namespace SIT.Plugins.Tests
{
    [TestClass]
    public class SolicitudPreCreatePluginTests
    {
        // Helpers para construir el mock del IServiceProvider
        private static IServiceProvider BuildServiceProvider(
            Entity target,
            IOrganizationService orgService = null)
        {
            var tracerMock = new Mock<ITracingService>();

            var contextMock = new Mock<IPluginExecutionContext>();
            contextMock.Setup(c => c.MessageName).Returns("Create");
            contextMock.Setup(c => c.Stage).Returns(20);
            contextMock.Setup(c => c.Depth).Returns(1);
            contextMock.Setup(c => c.InputParameters).Returns(
                new ParameterCollection { { "Target", target } });

            if (orgService == null)
            {
                var defaultOrgService = new Mock<IOrganizationService>();
                defaultOrgService
                    .Setup(s => s.RetrieveMultiple(It.IsAny<QueryBase>()))
                    .Returns(new EntityCollection());
                orgService = defaultOrgService.Object;
            }

            var factoryMock = new Mock<IOrganizationServiceFactory>();
            factoryMock
                .Setup(f => f.CreateOrganizationService(It.IsAny<Guid?>()))
                .Returns(orgService);

            var providerMock = new Mock<IServiceProvider>();
            providerMock
                .Setup(p => p.GetService(typeof(ITracingService)))
                .Returns(tracerMock.Object);
            providerMock
                .Setup(p => p.GetService(typeof(IPluginExecutionContext)))
                .Returns(contextMock.Object);
            providerMock
                .Setup(p => p.GetService(typeof(IOrganizationServiceFactory)))
                .Returns(factoryMock.Object);

            return providerMock.Object;
        }

        [TestMethod]
        public void Execute_SolicitudUrgenteSinPresupuesto_DebeThrowInvalidPluginException()
        {
            // Arrange
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(100000002); // Urgente
            // NO se establece sit_costoestimado

            var provider = BuildServiceProvider(target);
            var plugin = new SolicitudPreCreatePlugin();

            // Act & Assert
            var ex = Assert.ThrowsException<InvalidPluginExecutionException>(() =>
                plugin.Execute(provider));

            Assert.IsTrue(ex.Message.Contains("costo estimado"),
                "El mensaje debe mencionar 'costo estimado'");
        }

        [TestMethod]
        public void Execute_SolicitudUrgenteConPresupuesto_NoDebeLanzarExcepcion()
        {
            // Arrange
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(100000002); // Urgente
            target["sit_costoestimado"] = new Money(5000m);

            var provider = BuildServiceProvider(target);
            var plugin = new SolicitudPreCreatePlugin();

            // Act — no debe lanzar excepción
            plugin.Execute(provider);

            // Assert implícito: si llegamos aquí, no hubo excepción
            Assert.IsTrue(target.Contains("sit_numerosolicitud"),
                "Debe asignar número de solicitud");
        }

        [TestMethod]
        public void Execute_SolicitudNormal_AsignaFechaVencimiento5Dias()
        {
            // Arrange
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(100000000); // Normal/Baja

            var provider = BuildServiceProvider(target);
            var plugin = new SolicitudPreCreatePlugin();

            // Act
            plugin.Execute(provider);

            // Assert
            Assert.IsTrue(target.Contains("sit_fechavencimiento"),
                "Debe contener sit_fechavencimiento");

            var fechaVencimiento = target.GetAttributeValue<DateTime>("sit_fechavencimiento");
            var diasDiferencia = (fechaVencimiento - DateTime.UtcNow).TotalDays;

            Assert.IsTrue(diasDiferencia >= 4.9 && diasDiferencia <= 5.1,
                $"La diferencia debe ser ~5 días. Fue: {diasDiferencia}");
        }

        [TestMethod]
        public void Execute_PrimeraSolicitudEnSistema_AsignaSOL00001()
        {
            // Arrange
            var target = new Entity("sit_solicitud");
            target["sit_prioridad"] = new OptionSetValue(100000000);

            // Simular que no hay solicitudes previas
            var orgServiceMock = new Mock<IOrganizationService>();
            orgServiceMock
                .Setup(s => s.RetrieveMultiple(It.IsAny<QueryBase>()))
                .Returns(new EntityCollection()); // Lista vacía

            var provider = BuildServiceProvider(target, orgServiceMock.Object);
            var plugin = new SolicitudPreCreatePlugin();

            // Act
            plugin.Execute(provider);

            // Assert
            var numero = target.GetAttributeValue<string>("sit_numerosolicitud");
            Assert.AreEqual("SOL-00001", numero,
                "La primera solicitud debe ser SOL-00001");
        }
    }
}
```

### Tarea 5.2 — Ejecutar los tests

1. **Prueba** → **Ejecutar todas las pruebas** (`Ctrl + R, A`).

2. En el Explorador de pruebas, todos los tests deben aparecer en verde (✅).

3. Si algún test falla, revisa el mensaje de error — indica exactamente qué condición no se cumplió.

### Validación del Ejercicio 5

- [ ] Los 4 tests pasan (✅) sin modificar el código del plugin
- [ ] El test de solicitud urgente sin presupuesto verifica el mensaje de la excepción
- [ ] El test de numeración verifica que la primera solicitud sea SOL-00001

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Error de compilación: "El tipo IPlugin no existe" | Falta el NuGet `Microsoft.CrmSdk.CoreAssemblies` | Instala el paquete vía NuGet Manager en el proyecto |
| Plugin lanza excepción genérica en producción | Una excepción no controlada distinta a `InvalidPluginExecutionException` | Envuelve la lógica en try/catch y loguea con `tracer.Trace()` antes de relanzar |
| El Step no se dispara al modificar un registro | `Filtering Attributes` mal configurado o vacío en el PostUpdate | Edita el Step en PRT y agrega `sit_estado` en Filtering Attributes |
| La Pre-Image no contiene el campo `sit_estado` | La Pre-Image no registró ese atributo | Edita la Image en PRT y agrega `sit_estado` en la lista de atributos |
| `context.Depth > 1` termina el plugin prematuramente | El plugin fue invocado desde otro plugin o flujo de sistema | Verifica el Depth en el trace log — si es > 1 esperado, ajusta la condición |
| Test falla con "Object reference not set" en Moq | Un método del mock no está configurado | Verifica que todos los métodos llamados en la ejecución tienen `Setup()` |
| El DLL se registra pero el plugin no aparece en PRT | El DLL fue compilado en modo Debug, no Release | Recompila en modo Release y vuelve a registrar |

---

## Checklist final

- [ ] Proyecto `SIT.Plugins` compila en modo Release sin errores
- [ ] `SolicitudPreCreatePlugin` valida presupuesto en urgentes y lanza `InvalidPluginExecutionException`
- [ ] `SolicitudPreCreatePlugin` asigna `sit_numerosolicitud = SOL-XXXXX`
- [ ] `SolicitudPreCreatePlugin` calcula `sit_fechavencimiento` según la prioridad
- [ ] `SolicitudPostUpdatePlugin` solo actúa cuando cambia `sit_estado` (verificar con Filtering Attributes)
- [ ] `SolicitudPostUpdatePlugin` crea registro en `sit_auditoriasolicitud` con estado anterior y nuevo
- [ ] Steps registrados en PRT con Stage, Filtering Attributes y Pre-Image correctos
- [ ] Los 4 tests unitarios pasan (✅) en el Explorador de pruebas
- [ ] Al crear solicitud urgente sin presupuesto desde la UI: aparece el error del plugin
- [ ] Al cambiar estado de cualquier solicitud: se crea el registro de auditoría

---

## Reto adicional

**Reto básico:** Agrega un tercer test en `SolicitudPreCreatePluginTests` que verifique que la segunda solicitud del sistema recibe el número `SOL-00002`. Simula con Moq que `RetrieveMultiple` devuelve una entidad existente con `sit_numerosolicitud = "SOL-00001"`.

**Reto intermedio:** Crea un tercer plugin `SolicitudPreUpdatePlugin` que impida cambiar el Estado a "Resuelta" si el campo `sit_descripcion_solucion` está vacío. Registra el Step con `Filtering Attributes = sit_estado` en Pre-operation (Stage 20).

**Reto avanzado:** Implementa **Shared Variables** entre los dos plugins: en el `SolicitudPreCreatePlugin`, agrega `context.SharedVariables["numeracionGenerada"] = numero` al asignar el número. En un tercer plugin `SolicitudPostCreatePlugin` (Post-operation, Stage 40, Create), lee la Shared Variable y loguea en el trace que la numeración fue confirmada por el pre-operation. Registra ambos Steps y verifica en el trace log que los valores se pasan correctamente.

---

## Preguntas de repaso

1. ¿Por qué es importante verificar `context.Depth > 1` al inicio de un plugin?
2. ¿En qué se diferencia `context.UserId` de `context.InitiatingUserId`? ¿Cuándo difieren?
3. ¿Por qué la excepción `InvalidPluginExecutionException` es especial en el contexto de un plugin?
4. ¿Qué ventaja tiene configurar `Filtering Attributes` en el Step del PostUpdate vs validar el campo en el código del plugin?
5. ¿Por qué los tests con Moq no garantizan que el plugin funciona en producción? ¿Qué se debería agregar para mayor cobertura?

---

## Limpieza del laboratorio

> Conserva los plugins registrados — el Lab 24 (Azure Integrations) agrega una Azure Function que es llamada desde un plugin similar.

Para desregistrar los plugins si es necesario:
1. Abre PRT → conecta al ambiente
2. Clic derecho en el assembly `SIT.Plugins` → **Unregister** → **Unregister assembly**
3. Esto elimina el assembly y todos sus Steps asociados

---

## Siguiente laboratorio recomendado

➡️ **Lab 24 — Azure Integrations: Service Bus y Azure Function desde Dataverse**

**Por qué ir ahí:** Extiende el patrón del plugin C# para integrar Dataverse con Azure Service Bus y Azure Functions: cuando se aprueba una solicitud, el sistema notifica automáticamente a un sistema ERP externo a través de un Service Endpoint registrado en Dataverse.

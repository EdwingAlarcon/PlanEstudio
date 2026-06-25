---
moduleId: 23
title: "C# Plugins para Dataverse"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 11
slug: "c-plugins-para-dataverse"
---
!!! tip "Prerequisito de Lenguaje"
    Este módulo requiere conocimientos básicos de **C# y .NET**: clases, interfaces, herencia, NuGet y async/await. Si es tu primer contacto con C#, dedica al menos 2 semanas al Anexo de Lenguajes de Programación — sección C# — antes de continuar.

### 🎯 Objetivo
Desarrollar plugins C# robustos para ejecutar lógica de negocio compleja en el servidor de Dataverse: validaciones, cálculos, integraciones síncronas con APIs externas, y patrones de plugin avanzados como Early-Bound entities y Shared Variables.

### 📖 Conceptos Clave
- **IPlugin:** interfaz de C# que implementa todo plugin de Dataverse. Define un único método `Execute(IServiceProvider serviceProvider)` que es el punto de entrada del plugin. Toda la lógica de negocio se implementa dentro de este método. La clase que implementa `IPlugin` debe ser `public`, no puede ser `abstract`, y debe tener un constructor sin parámetros (o con un parámetro `string` para la configuración insecura).
- **IPluginExecutionContext (contexto de ejecución):** objeto inyectado automáticamente que contiene toda la información de la operación en curso: `MessageName` (Create/Update/Delete/Retrieve), `PrimaryEntityName` (nombre de la tabla), `Stage` (20=PreValidation, 40=PreOperation sincrónico, 50=PostOperation, 60=PostOperation asíncrono), `InputParameters` (el registro Target con los nuevos valores), `PreEntityImages` (estado del registro antes del cambio), `PostEntityImages` (estado después), `InitiatingUserId`, y `OrganizationId`. Ejemplo: en un plugin de validación sobre Update de Cuenta, `context.InputParameters["Target"]` contiene los campos modificados y `context.PreEntityImages["preImage"]` los valores anteriores.
- **IOrganizationService:** interfaz que expone todas las operaciones CRUD de Dataverse accesibles desde el plugin: `Create(Entity)`, `Retrieve(entityName, id, columnSet)`, `RetrieveMultiple(query)`, `Update(Entity)`, `Delete(entityName, id)`, `Execute(OrganizationRequest)`. Se obtiene del `IOrganizationServiceFactory` usando el ID del usuario del contexto: `serviceFactory.CreateOrganizationService(context.UserId)` — así las operaciones se ejecutan como el usuario que disparó la acción, respetando sus permisos.
- **ITracingService:** servicio de logging del plugin que escribe mensajes en el Plugin Trace Log de Dataverse. Se accede con `serviceProvider.GetService(typeof(ITracingService))`. Los mensajes son visibles en la UI de D365 → Configuración → Plugin Trace Log cuando el registro de traces está habilitado. Esencial para diagnosticar errores en producción ya que no se puede usar un debugger. Ejemplo: `tracer.Trace("Procesando solicitud {0}, estado={1}", solicitudId, estado)`.
- **Pre/Post Operation (etapas del pipeline):** el pipeline de ejecución de eventos de Dataverse tiene cuatro etapas. PreValidation (Stage 10): antes de la transacción de base de datos, para validaciones que no requieren los datos guardados. PreOperation (Stage 20): dentro de la transacción, puede modificar el Target antes de guardarse o lanzar excepción para cancelar. PostOperation (Stage 40): después del commit, para lógica que depende de que el dato ya fue guardado. PostOperation Async (Stage 50/60): fuera de la transacción, para operaciones que no deben bloquear al usuario.
- **Pre/Post Entity Images:** snapshots del registro registrados en el step del plugin. PreEntityImage captura los valores del registro antes del evento (útil en Update para saber qué campos cambiaron). PostEntityImage captura los valores después del evento (útil en Create para obtener el ID asignado). Se registran en el Plugin Registration Tool especificando el nombre del image y los atributos a capturar. Se acceden en el plugin con `context.PreEntityImages["nombreImage"]`.
- **Early-Bound vs Late-Bound:** dos estilos de acceso a datos en plugins. Late-Bound usa la clase genérica `Entity` con acceso por nombre de atributo como string: `entity["sit_nombre"]` — flexible pero sin IntelliSense ni validación en tiempo de compilación. Early-Bound usa clases C# generadas por `pac modelbuilder build` que representan exactamente la estructura de cada tabla: `solicitud.sit_nombre`, con autocompletado, tipado fuerte y validación en compilación. Recomendado Early-Bound para proyectos de producción.
- **Plugin Registration Tool (PRT):** herramienta de escritorio incluida en el NuGet `Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool` para registrar assemblies, steps e images de plugins en Dataverse. Permite conectarse a cualquier entorno, subir el DLL compilado del plugin (Assembly Registration), crear Steps que definen en qué evento/tabla/etapa se ejecuta cada plugin, y registrar Pre/Post Images con los atributos requeridos. También se puede usar `pac plugin push` como alternativa CLI.
- **Sandbox (Isolation Mode):** entorno de ejecución restringido donde corren todos los plugins de Dataverse. El sandbox impide el acceso a: sistema de archivos, registro de Windows, llamadas de red directas a IPs privadas, y WMI. Permite llamadas HTTP/HTTPS salientes a internet y acceso a `IOrganizationService`. Los plugins con Isolation Mode "None" (Full Trust) solo se pueden usar en entornos on-premises — en la nube todos son Sandbox obligatoriamente.
- **Shared Variables:** mecanismo para pasar datos entre plugins que corren en el mismo pipeline de ejecución (mismo evento, misma transacción). Se usan `context.SharedVariables` como diccionario: `context.SharedVariables["validacionAprobada"] = true` en el primer plugin, `context.SharedVariables.Contains("validacionAprobada")` en el segundo. Útil para que un plugin de PreValidation le comunique información a un plugin de PreOperation del mismo step.
- **Depth:** número entero que indica el nivel de anidamiento de las llamadas al pipeline de Dataverse. Cuando un plugin hace una operación CRUD que dispara otro plugin, el Depth aumenta en 1. `context.Depth == 1` significa que la operación fue disparada directamente por el usuario o el sistema. Siempre verificar `if (context.Depth > 1) return;` al inicio del plugin para evitar bucles infinitos cuando el plugin modifica el mismo tipo de registro que lo disparó.
- **InvalidPluginExecutionException:** la única excepción de C# que Dataverse maneja de forma especial en plugins. Al lanzarla, cancela toda la transacción (rollback), muestra el mensaje de la excepción al usuario en la UI como un error de negocio comprensible, y escribe el stack trace en el Plugin Trace Log. Cualquier otra excepción no controlada también cancela la transacción pero muestra un mensaje técnico genérico al usuario. Ejemplo: `throw new InvalidPluginExecutionException("El presupuesto es requerido para solicitudes urgentes.");`

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 23.1: Setup del proyecto de plugin
1. Visual Studio → Nuevo proyecto → Class Library (.NET Framework 4.6.2)
   ```
   Nombre: SIT.Plugins
   Framework: .NET Framework 4.6.2 (requerido para sandbox de Dataverse)
   ```

2. NuGet packages:
   ```xml
   <PackageReference Include="Microsoft.CrmSdk.CoreAssemblies" Version="9.0.2.*" />
   <PackageReference Include="Microsoft.CrmSdk.Workflow" Version="9.0.2.*" />
   ```

3. Generar Early-Bound entities con CrmSvcUtil o Power Platform CLI:
   ```bash
   pac modelbuilder build --settingsTemplateFile modelbuilder-settings.json
   ```

#### Actividad 23.2: Plugin Pre-Operation — Validación y enriquecimiento
```csharp
using Microsoft.Xrm.Sdk;
using System;

namespace SIT.Plugins
{
    public class SolicitudPreCreatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtener servicios del contexto
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            var service = serviceFactory.CreateOrganizationService(context.UserId);

            tracer.Trace("SolicitudPreCreatePlugin iniciado. Depth: {0}", context.Depth);

            // Evitar recursión: si ya estamos en profundidad > 1, salir
            if (context.Depth > 1) return;

            // Verificar que estamos en el evento correcto
            if (context.MessageName != "Create" || context.Stage != 20) return;
            if (!context.InputParameters.Contains("Target") ||
                !(context.InputParameters["Target"] is Entity)) return;

            var solicitud = (Entity)context.InputParameters["Target"];

            // Obtener valor del campo presupuesto
            var presupuesto = solicitud.GetAttributeValue<Money>("sit_presupuesto");

            // Validar que si es urgente, tenga presupuesto
            var prioridad = solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad");
            bool esUrgente = prioridad?.Value == 100000002; // 100000002 = Urgente

            if (esUrgente && (presupuesto == null || presupuesto.Value <= 0))
            {
                throw new InvalidPluginExecutionException(
                    "Las solicitudes urgentes deben tener un presupuesto asignado.");
            }

            // Auto-calcular fecha de vencimiento según prioridad
            DateTime fechaVencimiento;
            switch (prioridad?.Value)
            {
                case 100000002: // Urgente
                    fechaVencimiento = DateTime.UtcNow.AddHours(4);
                    break;
                case 100000001: // Alta
                    fechaVencimiento = DateTime.UtcNow.AddHours(24);
                    break;
                default: // Normal/Baja
                    fechaVencimiento = DateTime.UtcNow.AddDays(5);
                    break;
            }

            solicitud["sit_fechavencimiento"] = fechaVencimiento;
            tracer.Trace("Fecha vencimiento calculada: {0}", fechaVencimiento);

            // Asignar número automático (búsqueda del último número)
            var query = new Microsoft.Xrm.Sdk.Query.QueryExpression("sit_solicitud");
            query.ColumnSet = new Microsoft.Xrm.Sdk.Query.ColumnSet("sit_numero");
            query.AddOrder("createdon", Microsoft.Xrm.Sdk.Query.OrderType.Descending);
            query.TopCount = 1;

            var resultados = service.RetrieveMultiple(query);
            int siguienteNumero = 1;

            if (resultados.Entities.Count > 0)
            {
                var ultimoNumero = resultados.Entities[0].GetAttributeValue<string>("sit_numero");
                if (!string.IsNullOrEmpty(ultimoNumero) && ultimoNumero.StartsWith("SOL-"))
                {
                    if (int.TryParse(ultimoNumero.Substring(4), out int num))
                        siguienteNumero = num + 1;
                }
            }

            solicitud["sit_numero"] = $"SOL-{siguienteNumero:D5}";
            tracer.Trace("Número asignado: SOL-{0:D5}", siguienteNumero);
        }
    }
}
```

#### Actividad 23.3: Plugin Post-Operation — Notificación y auditoría
```csharp
public class SolicitudPostUpdatePlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        var service = serviceFactory.CreateOrganizationService(context.UserId);

        if (context.Depth > 1 || context.MessageName != "Update" || context.Stage != 40) return;

        var target = (Entity)context.InputParameters["Target"];
        
        // Solo procesar si cambió el estado
        if (!target.Attributes.Contains("sit_estado")) return;

        // Obtener imagen pre-operación (estado anterior)
        Entity preImage = null;
        if (context.PreEntityImages.Contains("PreImage"))
            preImage = context.PreEntityImages["PreImage"];

        var estadoAnterior = preImage?.GetAttributeValue<OptionSetValue>("sit_estado")?.Value;
        var estadoNuevo = target.GetAttributeValue<OptionSetValue>("sit_estado")?.Value;

        // Solo actuar en transiciones específicas
        if (estadoAnterior == estadoNuevo) return;

        tracer.Trace("Cambio de estado: {0} → {1}", estadoAnterior, estadoNuevo);

        // Crear registro de auditoría personalizada
        var auditoria = new Entity("sit_auditoriasolicitud");
        auditoria["sit_solicitud"] = new EntityReference("sit_solicitud", context.PrimaryEntityId);
        auditoria["sit_estadoanterior"] = estadoAnterior.HasValue ? estadoAnterior.ToString() : "N/A";
        auditoria["sit_estadonuevo"] = estadoNuevo.ToString();
        auditoria["sit_usuario"] = new EntityReference("systemuser", context.UserId);
        auditoria["sit_fecha"] = DateTime.UtcNow;
        service.Create(auditoria);

        // Si el nuevo estado es "Aprobado" (100000001), disparar lógica de negocio
        if (estadoNuevo == 100000001)
        {
            // Actualizar campos de aprobación
            var update = new Entity("sit_solicitud", context.PrimaryEntityId);
            update["sit_fechaaprobacion"] = DateTime.UtcNow;
            update["sit_aprobadopor"] = new EntityReference("systemuser", context.UserId);
            service.Update(update);

            tracer.Trace("Registro aprobación actualizado exitosamente.");
        }
    }
}
```

#### Actividad 23.4: Registrar el plugin con Plugin Registration Tool
1. Descargar PRT: NuGet → Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool
2. Conectar al entorno DEV
3. Registrar assembly:
    - Register → Register New Assembly
    - Subir el DLL compilado (modo Release)
    - Isolation Mode: Sandbox

4. Registrar Step para SolicitudPreCreatePlugin:
   ```
   Message: Create
   Primary Entity: sit_solicitud
   Stage: Pre-operation (20)
   Execution Mode: Synchronous
   ```

5. Registrar Step para SolicitudPostUpdatePlugin:
   ```
   Message: Update
   Primary Entity: sit_solicitud
   Filtering Attributes: sit_estado (solo dispara si este campo cambió)
   Stage: Post-operation (40)
   Execution Mode: Synchronous
   Pre-Image: Nombre="PreImage", Attributes="sit_estado"
   ```

#### Actividad 23.5: Unit Testing del plugin
```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Moq;

[TestClass]
public class SolicitudPreCreatePluginTests
{
    [TestMethod]
    public void Execute_SolicitudUrgenteSinPresupuesto_DebeThrowException()
    {
        // Arrange
        var target = new Entity("sit_solicitud");
        target["sit_prioridad"] = new OptionSetValue(100000002); // Urgente
        // No se establece sit_presupuesto

        var context = new Mock<IPluginExecutionContext>();
        context.Setup(c => c.MessageName).Returns("Create");
        context.Setup(c => c.Stage).Returns(20);
        context.Setup(c => c.Depth).Returns(1);
        context.Setup(c => c.InputParameters).Returns(
            new ParameterCollection { { "Target", target } });

        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider.Setup(s => s.GetService(typeof(IPluginExecutionContext)))
            .Returns(context.Object);
        serviceProvider.Setup(s => s.GetService(typeof(ITracingService)))
            .Returns(new Mock<ITracingService>().Object);
        
        var orgService = new Mock<IOrganizationService>();
        orgService.Setup(s => s.RetrieveMultiple(It.IsAny<Microsoft.Xrm.Sdk.Query.QueryBase>()))
            .Returns(new EntityCollection());
        
        var serviceFactory = new Mock<IOrganizationServiceFactory>();
        serviceFactory.Setup(f => f.CreateOrganizationService(It.IsAny<Guid?>()))
            .Returns(orgService.Object);
        serviceProvider.Setup(s => s.GetService(typeof(IOrganizationServiceFactory)))
            .Returns(serviceFactory.Object);

        var plugin = new SolicitudPreCreatePlugin();

        // Act & Assert
        Assert.ThrowsException<InvalidPluginExecutionException>(() =>
            plugin.Execute(serviceProvider.Object));
    }

    [TestMethod]
    public void Execute_SolicitudNormal_AsignaFechaVencimiento5Dias()
    {
        // Arrange
        var target = new Entity("sit_solicitud");
        target["sit_prioridad"] = new OptionSetValue(100000000); // Normal
        
        // ... setup similar al anterior ...
        
        // Act
        // plugin.Execute(serviceProvider.Object);
        
        // Assert
        var fechaVencimiento = target.GetAttributeValue<DateTime>("sit_fechavencimiento");
        var diferenciaEsperada = DateTime.UtcNow.AddDays(5);
        Assert.IsTrue(Math.Abs((fechaVencimiento - diferenciaEsperada).TotalMinutes) < 1);
    }
}
```

### 💼 Caso Real de Negocio
**Empresa:** Empresa financiera con requerimiento regulatorio  
**Problema:** Los usuarios podían crear préstamos sin validar que el cliente no tuviera deudas vencidas. La validación en el formulario era fácil de eludir.  
**Solución:** Plugin Pre-Create en la tabla Préstamo que consulta el historial crediticio vía API del buró de crédito. Si el cliente tiene deudas vencidas, lanza `InvalidPluginExecutionException` con mensaje claro. Imposible eludir — se ejecuta en el servidor independientemente de la UI.  
**Resultado:** Cumplimiento regulatorio 100%. Eliminación de préstamos aprobados con deuda vencida.

### ✅ Buenas Prácticas
- Siempre verificar `context.Depth > 1` para evitar recursión infinita
- Usar ITracingService para logging — indispensable para debugging en producción
- Filtrar por `Filtering Attributes` en el step — no ejecutar si no cambiaron los campos relevantes
- Pre-Operation para validaciones que pueden cancelar la operación
- Post-Operation (async) para tareas que no deben bloquear al usuario
- Unit tests con Moq son obligatorios para plugins — no se puede debuggear en producción fácilmente

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Plugin lanza error para todos los usuarios | Lógica sin verificar el evento/stage correcto | Agregar guards: `if (context.MessageName != "Create") return;` |
| "Object reference not set" | Campo no existe en el target — no siempre se envían todos | Usar `GetAttributeValue<T>()` — retorna null/default si no existe |
| Plugin llama a sí mismo infinitamente | Hace Update dentro de un plugin de Update sin check de Depth | Verificar `context.Depth > 1` al inicio |
| Timeout del plugin | Operación lenta (consulta sin límite, API externa lenta) | Agregar TopCount en queries y timeout de 15s en llamadas HTTP |

### 🧪 Criterios de Validación
- [ ] Plugin PreCreate valida y lanza excepción con mensaje al usuario cuando corresponde
- [ ] Plugin asigna número automático SOL-XXXXX sin duplicados
- [ ] Plugin PostUpdate registra auditoría cuando cambia el estado
- [ ] Step registrado con Pre-Image y Filtering Attributes correctos en PRT
- [ ] Al menos 2 unit tests pasan con xUnit/MSTest usando Moq para servicios

---

---
moduleId: 25
title: "Patrones de Diseño Avanzados"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 7
slug: "patrones-de-diseno-avanzados"
---
### 🎯 Objetivo
Aplicar patrones de diseño reconocidos en implementaciones de Power Platform: Repository Pattern, Command Pattern, Observer Pattern con plugins, Saga Pattern para transacciones distribuidas, y CQRS para separar lecturas de escrituras.

### 📖 Conceptos Clave
- **Repository Pattern:** patrón de diseño que introduce una capa de abstracción entre la lógica de negocio y el acceso a datos. En plugins C#, en lugar de llamar directamente a `IOrganizationService` desde la lógica del negocio, se define una interfaz `ISolicitudRepository` con métodos de dominio (`GetById`, `GetPendientes`, `Save`) y una implementación concreta que usa `IOrganizationService`. La ventaja principal es la testeabilidad: en unit tests se inyecta un mock de `ISolicitudRepository` sin necesitar un entorno de Dataverse real.
- **Command Pattern:** patrón que encapsula una operación de negocio completa (con sus datos, validaciones y efectos secundarios) en un objeto independiente llamado Command. Ejemplo: en lugar de tener lógica dispersa, se crea la clase `AprobarSolicitudCommand` con los datos necesarios y una clase `AprobarSolicitudCommandHandler` que ejecuta toda la lógica. Facilita el logging uniforme de todas las operaciones, la validación previa, y el registro de auditoría sin repetir código.
- **Observer Pattern:** patrón donde los objetos observadores son notificados automáticamente cuando el objeto observado cambia de estado. En Dataverse, el sistema de plugins es una implementación nativa del Observer Pattern: el plugin actúa como observer que reacciona a eventos (Create/Update/Delete) en la tabla observada. El reto es el diseño cuidadoso de qué plugins observan qué eventos y en qué orden se ejecutan cuando hay múltiples plugins en el mismo Step.
- **Saga Pattern:** patrón para gestionar transacciones distribuidas que involucran múltiples sistemas sin soporte de transacciones ACID entre ellos. Una Saga es una secuencia de pasos donde cada paso tiene una operación de compensación (rollback manual). Si el paso N falla, se ejecutan las compensaciones de los pasos N-1, N-2, ..., 1 para deshacer los cambios. En Power Platform se implementa con Power Automate usando Scopes con manejo de errores, o con Azure Durable Functions para mayor robustez.
- **CQRS (Command Query Responsibility Segregation):** patrón arquitectónico que separa el modelo de lectura del modelo de escritura. Las operaciones de escritura (Commands) pasan por plugins C# con toda la lógica de validación y enriquecimiento. Las operaciones de lectura (Queries) usan FetchXML o vistas optimizadas directamente, sin pasar por la lógica de escritura. En Power Platform: los Canvas Apps y reportes leen directamente con FetchXML optimizado, mientras que las escrituras siempre van por el plugin que centraliza las reglas de negocio.
- **Outbox Pattern:** patrón de garantía de entrega at-least-once en integraciones. El plugin, en lugar de llamar directamente al sistema externo (arriesgando perder el mensaje si el sistema está caído), crea un registro en una tabla "Outbox" de Dataverse con el payload del mensaje y estado "Pendiente". Un proceso separado (Power Automate en polling cada 5 minutos, o Azure Function programada) lee los registros Pendientes, los envía al sistema externo, y los marca como "Enviado" o "Fallido" con el detalle del error.
- **Circuit Breaker:** patrón que protege un sistema cuando llama a un servicio externo que falla repetidamente. El Circuit Breaker tiene tres estados: Closed (operación normal), Open (después de N fallos en T segundos, deja de intentar — falla rápido con un mensaje claro al usuario), Half-Open (después de M minutos de recuperación, intenta una llamada de prueba — si tiene éxito, vuelve a Closed). Evita que el plugin agote su timeout de 2 minutos esperando una API caída, lo que bloquearía la interfaz de D365.
- **Retry Pattern:** patrón de reintento con backoff exponencial y jitter (variación aleatoria en el tiempo de espera). En lugar de reintentar inmediatamente al fallar (que causaría una avalancha de requests al sistema externo), se espera un tiempo creciente: intento 1 después de 1s, intento 2 después de 2s, intento 3 después de 4s, con jitter ±20% para evitar que múltiples instancias del plugin reintenten exactamente al mismo tiempo. En Azure Functions se configura con `retryPolicy` en `host.json` o con `[FixedDelayRetry]`/`[ExponentialBackoffRetry]` en el atributo del trigger.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 25.1: Repository Pattern en Plugins C#
```csharp
// Interfaz de repositorio
public interface ISolicitudRepository
{
    Entity GetById(Guid id, string[] columns);
    EntityCollection GetByCriteria(QueryExpression query);
    Guid Create(Entity solicitud);
    void Update(Entity solicitud);
    void Delete(Guid id);
}

// Implementación con IOrganizationService
public class DataverseSolicitudRepository : ISolicitudRepository
{
    private readonly IOrganizationService _service;
    private readonly ITracingService _tracer;

    public DataverseSolicitudRepository(IOrganizationService service, ITracingService tracer)
    {
        _service = service;
        _tracer = tracer;
    }

    public Entity GetById(Guid id, string[] columns)
    {
        _tracer.Trace("GetById: {0}", id);
        return _service.Retrieve("sit_solicitud", id, new ColumnSet(columns));
    }

    public EntityCollection GetByCriteria(QueryExpression query)
    {
        return _service.RetrieveMultiple(query);
    }

    public Guid Create(Entity solicitud)
    {
        _tracer.Trace("Creating solicitud: {0}", solicitud.GetAttributeValue<string>("sit_nombre"));
        return _service.Create(solicitud);
    }

    public void Update(Entity solicitud) => _service.Update(solicitud);
    public void Delete(Guid id) => _service.Delete("sit_solicitud", id);
}

// Plugin usando el repositorio (testeable con mock)
public class MiPlugin : IPlugin
{
    private readonly Func<IOrganizationService, ITracingService, ISolicitudRepository> _repoFactory;

    public MiPlugin() 
        : this((svc, tracer) => new DataverseSolicitudRepository(svc, tracer)) { }

    // Constructor para testing con mock
    public MiPlugin(Func<IOrganizationService, ITracingService, ISolicitudRepository> repoFactory)
    {
        _repoFactory = repoFactory;
    }

    public void Execute(IServiceProvider serviceProvider)
    {
        var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        var service = serviceFactory.CreateOrganizationService(context.UserId);

        var repo = _repoFactory(service, tracer);
        // Usar repo.GetById(), repo.Create(), etc.
    }
}
```

#### Actividad 25.2: Circuit Breaker en llamadas HTTP desde Plugin
```csharp
public class ExternalApiService
{
    // Thread-safe: los plugins de Dataverse ejecutan en instancias concurrentes del sandbox.
    // Usar Interlocked para el contador y lock para la fecha evita race conditions.
    private static int _failureCount = 0;
    private static DateTime _lastFailureTime = DateTime.MinValue;
    private static readonly object _lock = new object();
    private const int FailureThreshold = 3;
    private static readonly TimeSpan RecoveryTime = TimeSpan.FromMinutes(5);

    public string CallExternalApi(string url, ITracingService tracer)
    {
        // Circuit Breaker: si hay muchos fallos recientes, no intentar
        lock (_lock)
        {
            if (_failureCount >= FailureThreshold &&
                DateTime.UtcNow - _lastFailureTime < RecoveryTime)
            {
                tracer.Trace("Circuit breaker OPEN. Skipping external call.");
                throw new InvalidPluginExecutionException(
                    "El servicio externo está temporalmente no disponible. Intente nuevamente en 5 minutos.");
            }
        }

        try
        {
            using var client = new System.Net.Http.HttpClient();
            client.Timeout = TimeSpan.FromSeconds(10);
            var result = client.GetStringAsync(url).Result;

            // Éxito — resetear contador de forma thread-safe
            lock (_lock)
            {
                _failureCount = 0;
            }
            return result;
        }
        catch (Exception ex)
        {
            lock (_lock)
            {
                _failureCount++;
                _lastFailureTime = DateTime.UtcNow;
            }
            tracer.Trace("External API failure #{0}: {1}", _failureCount, ex.Message);
            throw;
        }
    }
}
```

#### Actividad 25.3: Saga Pattern para proceso multi-paso
Escenario: Crear Orden requiere: 1) Verificar inventario (WMS), 2) Reservar crédito (ERP), 3) Crear en Dataverse
```
Saga: CrearOrden
  Paso 1: VerificarInventario(WMS)
    Compensación: LiberarInventario(WMS)
  
  Paso 2: ReservarCredito(ERP)
    Compensación: LiberarCredito(ERP)
  
  Paso 3: CrearOrdenDataverse
    Compensación: CancelarOrdenDataverse

Si Paso 2 falla:
  → Ejecutar compensación Paso 1 (LiberarInventario)
  → Lanzar error al usuario

Si Paso 3 falla:
  → Ejecutar compensación Paso 2 (LiberarCredito)
  → Ejecutar compensación Paso 1 (LiberarInventario)
  → Lanzar error al usuario
```

Implementar en Power Automate como Child Flows encadenados con manejo de compensaciones en Scope/Catch.

### 💼 Caso Real de Negocio
**Empresa:** Marketplace B2B con órdenes de compra multi-proveedor  
**Problema:** Una orden que involucraba 3 sistemas podía quedar en estado inconsistente si uno de los sistemas fallaba a mitad del proceso. Inventario reservado pero orden no creada.  
**Solución:** Saga Pattern implementado en Azure Durable Functions con compensaciones. Si cualquier paso falla, los pasos anteriores se deshacen automáticamente. Estado de la saga persistido en Azure Storage.  
**Resultado:** Cero órdenes en estado inconsistente. Auditoría completa de cada intento y compensación.

### ✅ Buenas Prácticas
- Repository Pattern hace los plugins 10x más fáciles de testear
- Circuit Breaker previene que un sistema externo caído cause avalanchas de errores
- Saga requiere que todas las operaciones sean compensables — diseñar con esto en mente desde el inicio

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Circuit breaker nunca se recupera | Estado compartido en static no se resetea | Implementar half-open state con timer de recuperación |
| Saga queda incompleta sin compensar | Power Automate no ejecuta el Catch si el Scope no tiene Run After configurado | Siempre verificar "has failed" en el Run After del Scope Catch |

### 🧪 Criterios de Validación
- [ ] Plugin usa Repository Pattern y puede ser testeado con mock de ISolicitudRepository
- [ ] Circuit Breaker deja de llamar a la API externa después de 3 fallos consecutivos
- [ ] Saga compensa correctamente cuando el segundo paso falla

---

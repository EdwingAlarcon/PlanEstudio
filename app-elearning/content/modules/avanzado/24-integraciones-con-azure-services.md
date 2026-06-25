---
moduleId: 24
title: "Integraciones con Azure Services"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 8
slug: "integraciones-con-azure-services"
---
### 🎯 Objetivo
Integrar Power Platform con Azure Service Bus, Azure Functions, Azure API Management y Event Grid para construir arquitecturas de integración robustas, escalables y desacopladas entre Dataverse y sistemas externos.

### 📖 Conceptos Clave
- **Service Endpoint (Dataverse):** componente que se registra en Dataverse vía el Plugin Registration Tool para enviar automáticamente el `RemoteExecutionContext` (toda la información del evento: tabla, ID, campos, usuario) a Azure Service Bus Queue, Service Bus Topic, o Azure Event Hub. Se asocia a un Step igual que un plugin. No requiere código C# — Dataverse serializa y envía el contexto automáticamente. Es el mecanismo oficial para integración event-driven entre Dataverse y Azure.
- **Azure Service Bus:** servicio de mensajería asíncrona de Azure con dos patrones. Queue: mensajes de un emisor consumidos por un receptor (one-to-one), garantiza orden FIFO y entrega al menos una vez. Topic + Subscriptions: mensajes de un emisor consumidos por múltiples receptores independientes (one-to-many). Ambos soportan mensajes de hasta 256KB, Dead Letter Queue, lock de mensajes durante procesamiento, y retry automático configurable. En integración con Dataverse se usa Queue para enviar eventos a un sistema específico.
- **Azure Functions:** plataforma serverless de Azure para ejecutar código sin gestionar infraestructura. En integraciones con Power Platform se usan como: receptores de mensajes de Service Bus (trigger `ServiceBusTrigger`), webhooks HTTP que Power Automate puede llamar (`HttpTrigger`), procesadores de eventos de Event Grid, y proxies para APIs externas con lógica de transformación. El plan Consumption solo cobra por ejecución — ideal para cargas variables de integración.
- **Azure API Management (APIM):** gateway de APIs que centraliza la exposición de APIs con autenticación (API Keys, OAuth 2.0, certificados), rate limiting, transformación de requests/responses via políticas XML, caché de respuestas, y documentación con Swagger/OpenAPI. En Power Platform se usa para: exponer Dataverse OData a sistemas externos con un contrato simplificado, o consolidar múltiples APIs internas detrás de un endpoint único para conectores personalizados.
- **Azure Event Grid:** servicio de routing de eventos con un modelo publisher-subscriber. Los publishers envían eventos (Azure Storage, Dataverse via Service Bus Topic, aplicaciones custom) y Event Grid los enruta a los subscribers registrados: Azure Functions, Logic Apps, Event Hubs, o Webhooks. Soporta filtrado por tipo de evento y propiedades. Ideal cuando un evento de Dataverse debe desencadenar múltiples acciones en sistemas distintos.
- **Managed Identity:** identidad de Azure asignada a un servicio (Azure Function, Azure DevOps agent, APIM) que permite autenticarse en otros servicios de Azure (Key Vault, Service Bus, Dataverse) sin almacenar secretos en código o variables de entorno. Existen dos tipos: System-assigned (vida ligada al recurso) y User-assigned (puede compartirse entre recursos). En Azure Functions: `new DefaultAzureCredential()` usa automáticamente la Managed Identity en producción y las credenciales del desarrollador en local.
- **Azure Key Vault:** servicio de Azure para almacenar secretos, claves de cifrado y certificados de forma segura con auditoría de acceso. Los plugins C#, Azure Functions y Power Automate deben obtener los secretos desde Key Vault en tiempo de ejecución en lugar de tenerlos hardcodeados. En Power Platform, las Environment Variables soportan Key Vault como fuente de valores — el valor del secreto nunca se almacena en Dataverse.
- **Dead Letter Queue (DLQ):** cola secundaria en Azure Service Bus donde se mueven automáticamente los mensajes que no pudieron procesarse después del número máximo de reintentos (configurable, default 10). Los mensajes en DLQ no se pierden y quedan disponibles para diagnóstico manual o reprocesamiento. En producción, se debe configurar una alerta de Azure Monitor cuando la DLQ tiene mensajes sin procesar, y tener un proceso periódico de revisión.
- **Retry Policy:** configuración en Azure Service Bus y Azure Functions que define cuántas veces reintentar el procesamiento de un mensaje antes de moverlo a la DLQ, y con qué intervalo entre reintentos. Azure Functions con Service Bus trigger soporta `maxDeliveryCount` en Service Bus y `retryPolicy` en host.json con backoff exponencial. Una estrategia común: 3 reintentos con intervalos de 30s, 2min, 10min antes de enviar a DLQ.
- **Outbox Pattern:** patrón de garantía de entrega en integraciones. En lugar de llamar directamente a la API externa desde el plugin, el plugin crea un registro de "mensaje pendiente" en Dataverse (la "outbox"). Un proceso separado (Power Automate o Azure Function programada) lee y procesa estos mensajes pendientes, marcándolos como enviados o reintentando los fallidos. Garantiza que si el sistema externo está caído, los mensajes no se pierden — están en Dataverse esperando ser enviados.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 24.1: Service Endpoint — Dataverse a Azure Service Bus
1. Plugin Registration Tool → Register → Register New Service Endpoint
2. Configurar:
    - Designación: Queue
    - Solución: SIT_Integraciones
    - Namespace URL: `sb://sit-integration.servicebus.windows.net/`
    - Queue Name: `solicitudes-nuevas`
    - SAS Key Name: `RootManageSharedAccessKey`
    - SAS Key: (de Azure Portal → Service Bus → Shared access policies)

3. Registrar Step que envía a Service Bus:
    - Message: Create
    - Entity: sit_solicitud
    - Stage: Post-operation async
    - Execution Mode: Asynchronous

4. Probar: crear solicitud → verificar mensaje en Service Bus Explorer

#### Actividad 24.2: Azure Function que procesa el Service Bus
```csharp
// Function receptor de Service Bus
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;

public class SolicitudProcessor
{
    private readonly ILogger<SolicitudProcessor> _logger;
    private readonly HttpClient _httpClient;

    public SolicitudProcessor(ILogger<SolicitudProcessor> logger, HttpClient httpClient)
    {
        _logger = logger;
        _httpClient = httpClient;
    }

    [Function("ProcessSolicitudCreated")]
    public async Task Run(
        [ServiceBusTrigger("solicitudes-nuevas", Connection = "ServiceBusConnection")] 
        ServiceBusReceivedMessage message)
    {
        _logger.LogInformation("Procesando mensaje: {MessageId}", message.MessageId);

        try
        {
            // El mensaje de Dataverse Service Bus contiene el RemoteExecutionContext
            var body = message.Body.ToString();
            // El SDK de Dataverse usa RemoteExecutionContext para mensajes de Service Bus
            var executionContext = JsonSerializer.Deserialize<RemoteExecutionContext>(body);

            var solicitudId = executionContext?.PrimaryEntityId;
            var solicitudName = executionContext?.InputParameters
                .Contains("Target") == true
                ? ((Entity)executionContext.InputParameters["Target"])
                    .GetAttributeValue<string>("sit_nombre")
                : null;

            _logger.LogInformation("Solicitud recibida: {Id} - {Name}", solicitudId, solicitudName);

            // Llamar al sistema ERP externo
            var erpPayload = new
            {
                externalId = solicitudId,
                name = solicitudName,
                timestamp = DateTime.UtcNow,
                source = "PowerPlatform"
            };

            var response = await _httpClient.PostAsJsonAsync(
                "https://erp.empresa.com/api/solicitudes",
                erpPayload);

            response.EnsureSuccessStatusCode();
            _logger.LogInformation("ERP notificado exitosamente para solicitud {Id}", solicitudId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error procesando mensaje {MessageId}", message.MessageId);
            throw; // Re-throw para que Service Bus reintente (hasta el max retry count)
        }
    }
}
```

#### Actividad 24.3: Exponer Dataverse vía Azure API Management
1. Azure Portal → API Management → APIs → Agregar API
2. Tipo: HTTP
3. Display Name: `Dataverse Proxy API`
4. Base URL: `/dataverse`
5. Agregar operación POST `/solicitudes`:
    - Backend: Forward a `https://tuorg.crm.dynamics.com/api/data/v9.2/sit_solicituds`

6. Política de inbound (transformación y autenticación):
   ```xml
   <policies>
     <inbound>
       <!-- Validar API Key del cliente externo -->
       <check-header name="X-API-Key" failed-check-httpcode="401" 
                     failed-check-error-message="API Key inválida" ignore-case="false">
         <value>{{api-key-valor-secreto}}</value>
       </check-header>
       
       <!-- Obtener token de Dataverse con Managed Identity -->
       <authentication-managed-identity resource="https://tuorg.crm.dynamics.com" />
       
       <!-- Transformar request del cliente externo al formato OData de Dataverse -->
       <set-body>
         @{
           var body = context.Request.Body.As<JObject>();
           return new JObject(
             new JProperty("sit_nombre", body["name"]),
             new JProperty("sit_descripcion", body["description"]),
             new JProperty("sit_origen", "API_Externa")
           ).ToString();
         }
       </set-body>
       
       <!-- Rate limiting: máx 100 llamadas por minuto por cliente -->
       <rate-limit-by-key calls="100" renewal-period="60" 
                          counter-key="@(context.Request.Headers.GetValueOrDefault("X-Client-ID"))" />
     </inbound>
     
     <outbound>
       <!-- Simplificar la respuesta de Dataverse (quitar metadata OData) -->
       <set-body>
         @{
           var body = context.Response.Body.As<JObject>();
           return new JObject(
             new JProperty("id", body["sit_solicitudid"]),
             new JProperty("numero", body["sit_numero"]),
             new JProperty("status", "created")
           ).ToString();
         }
       </set-body>
     </outbound>
   </policies>
   ```

#### Actividad 24.4: Azure Function como webhook para Power Automate
```csharp
[Function("DataverseWebhook")]
public IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
    ILogger log)
{
    // Validar que viene de Power Automate (verificar la clave de función en la URL)
    log.LogInformation("Webhook recibido de Power Automate");
    
    var body = new StreamReader(req.Body).ReadToEnd();
    var data = JsonSerializer.Deserialize<WebhookPayload>(body);
    
    // Procesar datos
    // ...
    
    return new OkObjectResult(new { received = true, timestamp = DateTime.UtcNow });
}
```

### 💼 Caso Real de Negocio
**Empresa:** Empresa de logística con 3 sistemas: Dataverse (CRM), SAP (ERP), WMS (almacén)  
**Problema:** Los sistemas se llamaban directamente entre sí. Si SAP estaba caído, las órdenes de Dataverse se perdían. 0 reintentos, 0 audit trail.  
**Solución:** Service Bus como middleware. Dataverse envía evento al Service Bus. Azure Function lo lee y llama a SAP con retry automático. Si SAP falla 3 veces, el mensaje va a Dead Letter Queue para atención manual. APIM expone WMS a Power Automate con rate limiting.  
**Resultado:** Cero pérdida de órdenes. SLA de integración: 99.9%. Dead Letter Queue procesa mensajes fallidos en horario de mantenimiento.

### ✅ Buenas Prácticas
- Async siempre para integraciones externas — nunca bloquear el pipeline de Dataverse
- Idempotencia en las Azure Functions — el mismo mensaje puede llegar 2 veces; debe procesarse 1 vez
- Dead Letter Queue monitoreada con alertas — mensajes fallidos no deben quedarse sin atención
- Managed Identity en lugar de connection strings almacenados en código

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Service Bus no recibe mensajes | Step de Service Endpoint en mode Synchronous | Cambiar a Asynchronous — los endpoints de Azure son async |
| Azure Function no procesa DLQ | Function no tiene trigger a la DLQ | Crear segunda Function con trigger `queue-name/$DeadLetterQueue` |
| APIM retorna 502 | Backend (Dataverse) tardó más del timeout de APIM | Aumentar backend timeout en APIM o implementar async pattern |

### 🧪 Criterios de Validación
- [ ] Crear solicitud en Dataverse → mensaje aparece en Service Bus Queue
- [ ] Azure Function procesa el mensaje y llama al endpoint externo
- [ ] Si el endpoint externo falla, el mensaje va a Dead Letter Queue después de 3 reintentos
- [ ] APIM valida API Key y transforma el request al formato OData
- [ ] Rate limiting de APIM bloquea al cliente que excede 100 llamadas/minuto

---

---
moduleId: 14
title: "Conectores Personalizados"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 8
slug: "conectores-personalizados"
---
### 🎯 Objetivo
Crear y certificar conectores personalizados para APIs REST, integrar autenticación OAuth2 y API Key, y hacer que los conectores estén disponibles para Power Apps y Power Automate en toda la organización.

### 📖 Conceptos Clave
- **Custom Connector:** componente de Power Platform que actúa como wrapper sobre una API REST externa, exponiendo sus operaciones como acciones y triggers consumibles en Power Automate, Power Apps y Copilot Studio sin escribir código de integración. Se basa en una definición OpenAPI, agrega configuración de autenticación, y transforma la API en una interfaz visual con campos descriptivos. Una vez creado, se puede compartir con toda la organización o certificar para el marketplace de Microsoft. Ejemplo: conector `Facturación Electrónica` que expone las operaciones `EmitirFactura` y `ConsultarEstado`.

- **OpenAPI (Swagger) spec:** estándar JSON/YAML para describir APIs REST de forma legible por máquinas. Especifica endpoints, métodos HTTP, parámetros, bodies de request/response, y esquemas de datos. Power Platform importa specs OpenAPI 2.0 (Swagger) y 3.0 para crear la base del conector. Herramienta recomendada para validar: `editor.swagger.io`. Consideraciones al crear specs para Power Platform: los `operationId` deben ser únicos y descriptivos (son los nombres de las acciones), los schemas deben estar completamente definidos (evitar `additionalProperties: true`).

- **Authentication types:** los conectores soportan cinco tipos de autenticación. `No auth`: API pública sin credenciales. `API Key`: clave estática en header o query parameter (ej. `X-API-Key`). `Basic`: usuario + contraseña en Base64. `OAuth 2.0`: flujo de autorización delegada con Azure AD u otro proveedor de identidad (más seguro, recomendado para APIs corporativas). `Windows Auth`: para APIs en redes internas con autenticación integrada de Windows. La autenticación se configura una vez en el conector y cada usuario crea su propia conexión.

- **Triggers vs Actions:** los conectores pueden exponer ambos tipos de operaciones. Las `Actions` son operaciones imperativas iniciadas por el flujo (GET, POST, PUT, DELETE). Los `Triggers` son operaciones que inician el flujo cuando ocurre algo en la API externa. Existen dos tipos de triggers: `Polling` (el conector llama periódicamente a la API para detectar cambios nuevos) y `Webhook` (la API llama al conector cuando ocurre un evento, más eficiente). Los triggers de webhook requieren que la API externa soporte registro y desregistro de webhooks.

- **Policy Templates:** transformaciones configurables que se aplican al request antes de enviarlo a la API o al response antes de entregarlo al flujo, sin escribir código. Templates disponibles: `Set Header` (agregar headers de autenticación o configuración), `Set Query Parameter` (agregar parámetros fijos), `Route Request` (redirigir a URL diferente según condición), `Convert Array to Object`, `Set Property`. Se configuran por acción en el editor del conector. Ejemplo: agregar automáticamente el header `X-Tenant-ID` con el valor del parámetro de conexión `tenant_id` a cada llamada.

- **Connector Certification:** proceso oficial de Microsoft para publicar un conector personalizado en el marketplace público de Power Platform, haciéndolo disponible para todos los usuarios de Power Platform globalmente. Requiere: spec OpenAPI válida, autenticación robusta, documentación completa, código de contribuidor registrado, y revisión de Microsoft. Existen dos niveles: `Independent Publisher` (cualquier desarrollador puede publicar) y `Certified Connector` (requiere asociación con el ISV o vendor de la API). Proceso completo tarda 4-8 semanas.

- **Connection Reference:** abstracción de conexión usada en soluciones ALM para desacoplar un flujo o app de credenciales específicas de un ambiente. Ver definición completa en el Módulo 16 (Seguridad y ALM), donde este concepto se explica en profundidad junto al resto de los mecanismos de ALM.

- **Throttling:** límites de llamadas por minuto/hora/día que una API impone para protegerse de sobrecarga. Los conectores de Power Platform tienen throttling definido en sus propias políticas y heredan los límites de la API destino. Al exceder el límite, la API retorna HTTP 429 (Too Many Requests). Estrategias para manejar throttling: agregar `Delay` entre llamadas en loops, activar el retry automático del conector (configurable en Settings), diseñar flujos con batch operations en lugar de N llamadas individuales, y escalonar ejecuciones en tiempo.

- **Dynamic Schema / Dynamic Values:** capacidades avanzadas de conectores que permiten que las opciones o esquemas de una acción se carguen dinámicamente desde la API en tiempo de diseño. `Dynamic Values` (x-ms-dynamic-values): el campo muestra un dropdown con opciones obtenidas de la API (ej. lista de proyectos). `Dynamic Schema` (x-ms-dynamic-schema): el schema de los campos de respuesta se determina llamando a la API (útil cuando la API retorna estructuras variables según parámetros). Se configuran con extensiones OpenAPI específicas de Microsoft.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 14.1: Connector desde definición OpenAPI
1. Escenario: conectar con API de facturación electrónica (ej: DIAN Colombia / SAT México)
2. Preparar el spec OpenAPI YAML:
   ```yaml
   openapi: "3.0.0"
   info:
     title: "API Facturación Electrónica"
     description: "Conector para envío y consulta de facturas electrónicas"
     version: "1.0.0"
   servers:
     - url: "https://api.facturacion.ejemplo.com/v1"
   paths:
     /facturas:
       post:
         operationId: EmitirFactura
         summary: "Emitir una nueva factura electrónica"
         requestBody:
           required: true
           content:
             application/json:
               schema:
                 $ref: '#/components/schemas/FacturaRequest'
         responses:
           '200':
             description: "Factura emitida exitosamente"
             content:
               application/json:
                 schema:
                   $ref: '#/components/schemas/FacturaResponse'
     /facturas/{id}:
       get:
         operationId: ConsultarFactura
         summary: "Consultar estado de una factura"
         parameters:
           - name: id
             in: path
             required: true
             schema:
               type: string
   components:
     schemas:
       FacturaRequest:
         type: object
         required: [numero, nit_emisor, total]
         properties:
           numero: {type: string}
           nit_emisor: {type: string}
           total: {type: number, format: float}
           items:
             type: array
             items:
               $ref: '#/components/schemas/ItemFactura'
       FacturaResponse:
         type: object
         properties:
           id: {type: string}
           cufe: {type: string}
           estado: {type: string}
           pdf_url: {type: string}
       ItemFactura:
         type: object
         properties:
           descripcion: {type: string}
           cantidad: {type: number}
           precio_unitario: {type: number}
   ```

3. Importar en Power Platform:
    - make.powerapps.com → Conectores personalizados → Nuevo → Importar desde archivo OpenAPI
    - Subir el YAML

#### Actividad 14.2: Configurar autenticación OAuth 2.0
1. En la sección "Seguridad" del conector:
    - Tipo de autenticación: OAuth 2.0
    - Proveedor de identidad: Microsoft Entra ID (anteriormente Azure Active Directory)
    - ID de cliente: (App Registration ID en Azure AD)
    - Secreto de cliente: (secreto de la App Registration)
    - URL de autorización: `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize`
    - URL de token: `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token`
    - Actualizar URL: (igual que URL de token)
    - Ámbito: `https://api.facturacion.ejemplo.com/.default`

2. Para API Key simple:
    - Tipo: Clave de API
    - Nombre del parámetro: `X-API-Key`
    - Ubicación: Header

#### Actividad 14.3: Policy Templates
1. En la acción `EmitirFactura` → "..." → Editar
2. Agregar política: "Set Header"
    - Header: `X-Tenant-ID`
    - Valor: `@connectionParameters('tenant_id')`

3. Agregar política: "Set Query Parameter"
    - Nombre: `version`
    - Valor: `v1`

4. Política "Route Request": redirigir llamadas de TEST a sandbox:
   ```
   Backend service URL: 
   @if(equals(connectionParameters('environment'), 'test'), 
       'https://sandbox.api.facturacion.com',
       'https://api.facturacion.com')
   ```

#### Actividad 14.4: Usar el conector en Power Automate
1. Nuevo flujo → Trigger: When a row is added (tabla Pedido en Dataverse)
2. Agregar acción → buscar "Facturación Electrónica" → EmitirFactura
3. Mapear campos:
   ```
   numero: @{triggerOutputs()?['body/sit_numeropedido']}
   nit_emisor: @{parameters('nit_empresa')}
   total: @{triggerOutputs()?['body/sit_total']}
   ```

4. Parsear respuesta y actualizar registro Dataverse con el CUFE generado

### 💼 Caso Real de Negocio
**Empresa:** Distribuidora con 500 facturas diarias  
**Problema:** El proceso de facturación electrónica requería exportar a Excel, subir al portal del gobierno, y copiar manualmente el código CUFE de vuelta al ERP.  
**Solución:** Custom Connector + Power Automate automatiza el envío en tiempo real. Trigger en Dataverse cuando pedido pasa a "Facturado". Respuesta CUFE guardada automáticamente. Proceso de 8 pasos manuales eliminado.  
**Resultado:** Cero errores de CUFE copiado incorrectamente. 4 horas de trabajo manual diario eliminadas.

### ✅ Buenas Prácticas
- Validar el spec OpenAPI en editor.swagger.io antes de importar
- Guardar el conector en una solución para portabilidad entre ambientes
- Usar Connection References (no conexiones directas) en flujos de soluciones
- Documentar cada acción y parámetro — el campo "Descripción" aparece en la UI de PA/Canvas
- Implementar retry logic en el flujo, no en el conector (separación de responsabilidades)
- Nunca hardcodear URLs de API en el conector — usar parámetros de conexión

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| 401 Unauthorized en producción | Secreto de cliente expirado | Rotar secreto en Azure AD y actualizar en el conector |
| Conector no aparece en solución importada | No se agregó como componente de la solución | Editar solución → Agregar existente → Conector personalizado |
| "Invalid connection" después de importar solución | Connection Reference no configurada en destino | Configurar Connection Reference en el ambiente destino |

### 🧪 Criterios de Validación
- [ ] Spec OpenAPI importado sin errores de validación
- [ ] Autenticación OAuth2 o API Key configurada y probada
- [ ] Acción principal ejecuta correctamente desde el probador del conector
- [ ] Conector disponible en Power Automate y Power Apps del entorno
- [ ] Flujo de automatización usa el conector y procesa la respuesta correctamente

---

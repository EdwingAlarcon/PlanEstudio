---
moduleId: 14
title: "Conectores Personalizados"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 18
practiceMinutes: 110
slug: "conectores-personalizados"
lastVerified: "2026-11"
---
*Lectura: 15-20 min · Con práctica: unos 110 min en tu entorno Developer; la primera vez, cuenta entre el doble y el triple. La autenticación OAuth 2.0 y el conector contra Microsoft Graph son opcionales y pueden quedar para otra sesión.*

### 🎯 Objetivo
Crear y certificar conectores personalizados para APIs REST, integrar autenticación OAuth2 y API Key, y hacer que los conectores estén disponibles para Power Apps y Power Automate en toda la organización — construyendo un conector real en tu entorno, dentro de una solución, y practicando cada concepto con evidencia del dato exacto que viste antes de pasar al siguiente.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y una práctica en tu entorno. Vas a **construir** el uso del conector en una app sin pasos dados, vas a **diagnosticar** una importación fallida antes de ver la causa, y vas a cerrar con un **reto de transferencia** con una API distinta (con clave y con una URL diferente por ambiente).
>
> Necesitas: tu entorno Developer del Módulo 1 (los conectores personalizados son **Premium**; el entorno Developer permite usarlos para aprender) y el publisher `SIT` (prefijo `sit`) que creaste en el Módulo 2 o en el Laboratorio 2. Es útil haber hecho la Microlección 3 del [Módulo 11](/nivel/intermedio/modulo/power-automate-avanzado): aquí se usa la misma API pública de tasas de cambio, que no pide credenciales.

---

## 📖 Conceptos clave (referencia rápida)

- **Custom connector (conector personalizado):** un "envoltorio" sobre una API REST que expone sus operaciones como acciones y triggers en Power Automate, Power Apps y Copilot Studio, con nombres y descripciones legibles. Un mismo conector se reutiliza en apps y flujos; cada usuario crea su propia **conexión** con sus credenciales.
- **Definición OpenAPI:** el conector se describe con una definición **OpenAPI 2.0** (antes llamada Swagger), en JSON, de menos de 1 MB. **OpenAPI 3.0 no se admite** para crear el conector. También se puede partir de una colección de Postman (v2) o desde cero. Cada `operationId` es el nombre de la acción: debe ser único y descriptivo.
- **Las cinco secciones del asistente:** **General** (icono, descripción, esquema HTTPS/HTTP, **Host** y **Base URL**), **Security** (tipo de autenticación), **Definition** (acciones, triggers, parámetros, respuestas y políticas), **Code** (opcional: código C# que transforma la petición o la respuesta, con límite de 5 segundos de ejecución) y **Test** (crear una conexión y probar cada operación).
- **Tipos de autenticación:** **No authentication**, **Basic authentication**, **API Key** (clave en un header o en el query string) y **OAuth 2.0** (con un proveedor de identidad como Microsoft Entra ID o uno genérico). La autenticación de Windows solo está disponible cuando el conector usa un **on-premises data gateway**. El flujo OAuth de *client credentials* no se admite: OAuth en conectores es delegado (cada usuario inicia sesión).
- **Triggers:** un conector puede exponer triggers de **polling** (el servicio consulta periódicamente) o de **webhook** (la API avisa cuando ocurre algo; requiere que la API permita registrar y eliminar webhooks).
- **Políticas (policies):** transforman la petición o la respuesta sin código. Ejemplos: **Set HTTP header**, **Set query string parameter** y **Set host URL** (cambia el host de destino, por ejemplo según un parámetro de conexión). Se agregan en **Definition** > **New policy**.
- **Extensiones OpenAPI de Microsoft:** `x-ms-summary` (etiqueta visible), `x-ms-visibility` (importancia del campo), `x-ms-dynamic-values` / `x-ms-dynamic-list` (desplegables que se llenan llamando a la API), `x-ms-dynamic-schema` / `x-ms-dynamic-properties` (esquemas que dependen de otro valor) y `x-ms-trigger` (marca una operación como trigger).
- **Soluciones y ALM:** el conector se crea **dentro de una solución** (en el portal ya no hay una entrada de "Custom connectors" en el panel izquierdo). Los flujos de una solución no usan la conexión directamente sino una **connection reference** (referencia de conexión), que se ve en profundidad en el Módulo 16. Limitación importante: el conector debe importarse en el ambiente destino **antes** que los flujos y las referencias de conexión que lo usan, en una solución aparte.
- **Variables de entorno en el conector:** en conectores dentro de soluciones se puede usar `@environmentVariables("nombre")` en **Host**, **Base URL** y en los datos de OAuth (Client ID, Client secret, URLs). El valor se toma al guardar el conector: si cambias el valor de la variable, vuelve a guardar el conector.
- **Límites:** 10.000 peticiones por minuto por conexión en Power Automate y Power Apps; a eso se suman los límites propios de la API (HTTP 429 cuando se exceden).
- **Compartir y certificar:** un conector se comparte con usuarios concretos (**Can view** / **Can edit**). Si se quiere que esté disponible para **todos** los usuarios de Power Platform, se envía a **certificación** de Microsoft: como **verified publisher** si eres dueño del servicio, o como **independent publisher** si no lo eres. Los conectores certificados son Premium. Microsoft indica de 3 a 5 días hábiles de revisión por cada envío y de 7 a 10 días hábiles para el despliegue, además del tiempo que tardes en corregir lo que pidan.

---

## 🧩 Microlección 1 — Anatomía del asistente: tu primer conector dentro de una solución

**¿Qué vas a aprender?** Qué se configura en cada sección del asistente y a crear un conector que funcione de punta a punta.

**¿Por qué existe esto?** La acción **HTTP** del Módulo 11 sirve para una llamada puntual, pero cada maker tiene que conocer la URL, el formato de la respuesta y las credenciales. Un conector lo empaqueta una vez: el maker ve una acción "Obtener tasas de cambio" con campos con nombre y la autenticación ya resuelta.

**Ejemplo pequeño:** la API `https://api.exchangerate-api.com/v4/latest/USD` responde (recortado):

```json
{
  "base": "USD",
  "date": "2026-11-01",
  "rates": { "USD": 1, "COP": 3164.3, "EUR": 0.86, "MXN": 18.4 }
}
```

En el asistente eso se reparte así: `api.exchangerate-api.com` es el **Host** (General); "sin credenciales" es **No authentication** (Security); `GET /v4/latest/USD` y la forma de la respuesta son una acción (Definition).

**Ahora haz algo — micropráctica (3 min):** antes de abrir el asistente, ubica cada pieza en su sección → **[¿En qué sección del asistente va cada cosa?](/practica/ip-pa-008-secciones-del-asistente-de-conectores)**.

**Práctica real en tu entorno (30 min):**

1. En <https://make.powerapps.com>, con tu entorno Developer seleccionado arriba a la derecha, ve a **Solutions** > **New solution**. **Display name** = `SIT Conectores`, **Publisher** = `SIT` > **Create**. Esta solución va a contener **solo** el conector (en la Microlección 4 verás por qué).
2. Dentro de la solución: **New** > **Automation** > **Custom connector**. Se abre el asistente. Si te ofrece elegir cómo empezar, elige crear desde cero (**Create from blank**).
3. Escribe el nombre `SIT Tasas de Cambio` y pulsa **Continue**.
4. Sección **General**: **Scheme** = **HTTPS**, **Host** = `api.exchangerate-api.com`, **Base URL** = `/`. Escribe una **Description** (por ejemplo, "Tasas de cambio de referencia, sin autenticación").
5. Pasa a **Security** (botón de la parte inferior o pestaña superior): elige **No authentication**. Pulsa **Create connector** (arriba). Espera a que termine de guardar.
6. Sección **Definition** > **New action**. En **General** de la acción: **Summary** = `Obtener tasas de cambio`, **Description** = "Devuelve las tasas de cambio con base USD", **Operation ID** = `ObtenerTasas`.
7. En **Request** > **Import from sample**: **Verb** = **GET**, **URL** = `https://api.exchangerate-api.com/v4/latest/USD` > **Import**.
8. En **Response** > **Add default response**: pega el JSON del ejemplo de arriba en **Body** > **Import**.
9. Revisa **Validation**: debe indicar que no hay problemas (marca verde). Si muestra un aviso, léelo: suele ser una descripción vacía. Pulsa **Update connector**.
10. Sección **Test** > **New connection** > **Create connection**. Si la conexión no aparece, usa el icono de actualizar junto al selector. Elige la operación `ObtenerTasas` > **Test operation**.

**Qué deberías ver:** en **Response**, un **Status** `200` y el cuerpo con `base`, `date` y `rates`. Si ves un error de host, revisa que en **Host** no hayas escrito `https://` ni una barra al final.

**Evidencia a reportar (el dato exacto, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre de la solución y nombre del conector | ___ |
| **Operation ID** de tu acción | ___ |
| Status de la respuesta en **Test** | ___ |
| Valor de `date` y de `rates.COP` en la respuesta | ___ |
| Mensaje que mostró **Validation** antes de guardar (cópialo, o "sin avisos") | ___ |

---

## 🧩 Microlección 2 — OpenAPI 2.0: el contrato del conector

**¿Qué vas a aprender?** A leer y escribir la definición OpenAPI 2.0 que hay detrás del asistente, y a crear un conector importándola.

**¿Por qué existe esto?** Cuando un proveedor te entrega la definición de su API, importarla ahorra configurar acción por acción y evita errores de transcripción. Pero el asistente solo acepta **OpenAPI 2.0**: si el proveedor te entrega un archivo `openapi: "3.0.0"`, hay que convertirlo antes.

**Ejemplo pequeño:** la API de facturación electrónica del caso de negocio, descrita en OpenAPI 2.0 (JSON). Fíjate en `swagger: "2.0"`, en `host` + `basePath` (en 3.0 era `servers`) y en que el cuerpo de la petición es un parámetro `in: body` (en 3.0 era `requestBody`):

```json
{
  "swagger": "2.0",
  "info": {
    "title": "API Facturación Electrónica",
    "description": "Envío y consulta de facturas electrónicas",
    "version": "1.0.0"
  },
  "host": "api.facturacion.ejemplo.com",
  "basePath": "/v1",
  "schemes": ["https"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "paths": {
    "/facturas": {
      "post": {
        "operationId": "EmitirFactura",
        "summary": "Emitir una nueva factura electrónica",
        "description": "Envía la factura y devuelve el CUFE asignado",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": { "$ref": "#/definitions/FacturaRequest" }
          }
        ],
        "responses": {
          "200": {
            "description": "Factura emitida",
            "schema": { "$ref": "#/definitions/FacturaResponse" }
          }
        }
      }
    },
    "/facturas/{id}": {
      "get": {
        "operationId": "ConsultarFactura",
        "summary": "Consultar el estado de una factura",
        "description": "Devuelve el estado y el CUFE de una factura emitida",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "x-ms-summary": "ID de la factura"
          }
        ],
        "responses": {
          "200": {
            "description": "Estado de la factura",
            "schema": { "$ref": "#/definitions/FacturaResponse" }
          }
        }
      }
    }
  },
  "definitions": {
    "FacturaRequest": {
      "type": "object",
      "required": ["numero", "nit_emisor", "total"],
      "properties": {
        "numero": { "type": "string", "x-ms-summary": "Número de factura" },
        "nit_emisor": { "type": "string", "x-ms-summary": "NIT del emisor" },
        "total": { "type": "number", "format": "float", "x-ms-summary": "Total" }
      }
    },
    "FacturaResponse": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "cufe": { "type": "string" },
        "estado": { "type": "string" },
        "pdf_url": { "type": "string" }
      }
    }
  }
}
```

> Esta API es **ficticia**: sirve para ver cómo se importa, no se puede probar en **Test**.

**Práctica real en tu entorno (20 min):**

1. Descarga la definición del conector que creaste en la Microlección 1: en la lista de conectores personalizados (dentro de la solución, o en **More** > **Discover all** > **Data** > **Custom connectors**) usa la opción de descargar la definición OpenAPI del conector. Ábrela en un editor de texto y localiza `swagger`, `host`, `basePath`, tu `operationId` y la respuesta que generó **Add default response**.
2. Guarda el JSON de facturación de arriba como `facturacion.json`.
3. En la solución `SIT Conectores`: **New** > **Automation** > **Custom connector** y elige importar un archivo OpenAPI (**Import an OpenAPI file**). Nombre `SIT Facturacion (demo)`, selecciona `facturacion.json` > **Continue**.
4. Recorre **General** (el Host y la Base URL ya vienen del archivo) y **Definition** (deberían aparecer dos acciones). Pulsa **Create connector**.
5. *(Para comprobar la regla del 3.0)* cambia en una copia del archivo `"swagger": "2.0"` por `"openapi": "3.0.0"` e intenta importarla en un conector nuevo. Anota qué pasa y descarta ese conector.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valores de `host` y `basePath` en la definición que descargaste | ___ |
| Cómo aparece tu respuesta de ejemplo en la definición (nombre de la sección que la contiene) | ___ |
| Acciones que aparecieron en **Definition** al importar `facturacion.json` | ___ |
| Cómo se muestra el campo `nit_emisor` en el asistente (¿se usa la etiqueta de `x-ms-summary`?) | ___ |
| Qué pasó al intentar importar la versión `openapi: "3.0.0"` | ___ |

---

## 🧩 Microlección 3 — Autenticación y políticas

**¿Qué vas a aprender?** A elegir el tipo de autenticación según lo que exige la API y a agregar una política que modifica la petición sin tocar la API.

**¿Por qué existe esto?** La autenticación define qué le pide el conector a cada usuario al crear su conexión: nada, una clave, o iniciar sesión. Las políticas resuelven ajustes que el backend necesita en cada llamada (un header fijo, un parámetro de versión, otro host) sin obligar a cada maker a recordarlos.

| La API exige... | Tipo en **Security** | Qué ve el usuario al crear la conexión |
|---|---|---|
| Nada | **No authentication** | Solo crea la conexión |
| Una clave fija en un header o en el query string | **API Key** (**Parameter label**, **Parameter name**, **Parameter location**) | Un campo con la etiqueta que definiste, donde pega su clave |
| Usuario y contraseña | **Basic authentication** | Usuario y contraseña |
| Inicio de sesión delegado (Microsoft Entra ID, GitHub, otro proveedor) | **OAuth 2.0** | Una ventana de inicio de sesión |

**Práctica real en tu entorno (20 min):**

1. Abre `SIT Tasas de Cambio` para editar > **Definition**, con la acción `ObtenerTasas` seleccionada. En **Policies** elige **New policy**.
2. **Name** = `AgregarOrigen`, **Template** = **Set HTTP header**. **Header name** = `X-Origen`, **Header value** = `PlanEstudio`, **Action if header exists** = **override**, **Run policy on** = **Request**, y en **Operations** marca `ObtenerTasas`. Pulsa **Update connector**.
3. Vuelve a **Test** y ejecuta `ObtenerTasas`. La API ignora headers que no conoce, así que debe seguir respondiendo `200`: la política no rompe nada, solo agrega el header.
4. *(Opcional, 10 min)* Para ver cómo cambia la conexión con **API Key**: en **Security** cambia a **API Key** con **Parameter label** = `Clave de API`, **Parameter name** = `X-Api-Key` y **Parameter location** = **Header** > **Update connector**. En **Test** crea una conexión nueva: te pedirá la `Clave de API` (escribe cualquier texto; esta API no la valida). Anota lo que viste y **vuelve a No authentication** antes de seguir, porque las Microlecciones 4 y 5 usan el conector sin clave.

> **Profundización opcional — OAuth 2.0 contra Microsoft Graph.** Solo se justifica cuando la operación de Graph que necesitas no la cubren los conectores estándar (Office 365 Outlook, Office 365 Users). Pasos resumidos: registra una aplicación en Microsoft Entra ID con el permiso delegado `User.Read` de Microsoft Graph (solo el que vas a usar: mínimo privilegio; `Mail.Send` solo si agregas una acción que envía correo); crea un conector con **Host** `graph.microsoft.com`; en **Security** elige **OAuth 2.0** y el proveedor de Microsoft Entra ID (o **Generic Oauth 2** con **Client id**, **Client secret**, **Authorization Url** `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize`, **Token Url** y **Refresh Url** `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token`, y **Scope** `https://graph.microsoft.com/User.Read`); al guardar, Power Platform genera la **Redirect URL** del conector, que tienes que copiar en el registro de la aplicación (cada conector tiene la suya). Una acción `ObtenerPerfil` con `GET /v1.0/me` debe devolver `displayName` y `mail` del usuario que inició sesión.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Configuración de tu política (template, header, valor, operaciones) | ___ |
| Status de **Test** después de agregar la política | ___ |
| *(Opcional)* Qué campo te pidió la conexión con **API Key** (texto exacto de la etiqueta) | ___ |
| *(Opcional)* `displayName` devuelto por `ObtenerPerfil` contra Graph | ___ |

---

## 🧩 Microlección 4 — Usar el conector en un flujo de solución y llevarlo a otro ambiente

**¿Qué vas a aprender?** Qué crea Power Platform cuando usas el conector dentro de una solución y en qué orden se importa todo en otro ambiente.

**¿Por qué existe esto?** En el caso de negocio, el conector y el flujo de facturación pasan de DEV a TEST y a PROD. Si el flujo apuntara a "mi conexión", en el ambiente destino no existiría. Con una **connection reference**, el flujo apunta a la referencia y en cada ambiente se le asigna una conexión.

**Práctica real en tu entorno (20 min):**

1. Crea una **segunda** solución: **Solutions** > **New solution**, **Display name** = `SIT Integraciones`, **Publisher** = `SIT`.
2. Dentro de ella: **New** > **Automation** > **Cloud flow** > **Instant**. Nombre `Probar tasas`, trigger **Manually trigger a flow** > **Create**.
3. Agrega una acción, busca `SIT Tasas de Cambio` y elige `Obtener tasas de cambio`. Si te pide conexión, elige la que creaste en **Test**.
4. Agrega una acción **Compose** y en **Inputs** elige del contenido dinámico el valor `COP` de la respuesta. Guarda y prueba el flujo (**Test** > **Manually**).
5. Vuelve a la solución `SIT Integraciones` y mira la lista de objetos: además del flujo debe haber aparecido una **connection reference** para tu conector, creada automáticamente al agregar la acción.

**🔧 Diagnosticar antes de construir — troubleshooting challenge (5 min):** un compañero exportó una sola solución con el conector, la connection reference y el flujo, y al importarla en TEST falla. Antes de ver la causa, resuélvelo → **[Diagnosticar: la importación falla en TEST](/practica/ip-trb-010-importar-conector-y-flujo-en-otro-ambiente)**.

**🏗️ Reto de construcción (sin pasos, en tu entorno):**

> **Requerimiento:** una Canvas App, dentro de la solución `SIT Integraciones`, con una etiqueta que muestre la tasa COP actual obtenida de tu conector.
> **Criterios de aceptación:** (1) el valor se obtiene llamando a `ObtenerTasas`, no escrito a mano; (2) el valor se actualiza al abrir la app; (3) la etiqueta muestra la fecha de la tasa además del valor.
> **Restricciones:** usa una sola llamada al conector al abrir la app (no una por control).

Si te atascas, pistas en orden: (1) en Power Apps Studio, el conector se agrega desde el panel **Data** > **Add data**, buscando su nombre; (2) en Power Fx la operación se llama `NombreDelConector.OperationId(...)`: escribe el inicio del nombre y deja que el autocompletado te muestre el nombre exacto; (3) guarda la respuesta una vez en una variable desde `OnStart` de la app (con `Set`) y lee `rates.COP` y `date` desde ahí.

> **Ojo al llevar la app a otro ambiente:** las Canvas Apps **no reconocen** las connection references de conectores personalizados. Después de importar, hay que quitar y volver a agregar el conector en la app. Los flujos sí usan la connection reference.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valor de `COP` que devolvió el **Compose** en la ejecución del flujo | ___ |
| Nombre de la connection reference que apareció en `SIT Integraciones` | ___ |
| Fórmula que usaste en la app para llamar al conector (cópiala) | ___ |
| Texto que muestra la etiqueta de tu app | ___ |
| Orden en que importarías `SIT Conectores` y `SIT Integraciones` en TEST, y qué harías justo después de importar | ___ |

---

## 🔁 Reto de transferencia

Ya construiste un conector sin autenticación, con un host fijo, usado desde un flujo de solución. Ahora el requisito **cambia**: el área de logística te pide un conector para la API de su transportadora. Esa API exige una **clave en el header** `X-Api-Key`, y su host es **distinto** en DEV (sandbox) y en PROD. El conector tiene que pasar por DEV → TEST → PROD sin editarlo a mano en cada ambiente y sin que la clave quede escrita en ningún archivo exportado.

**[Transferir: API con clave y host distinto por ambiente](/practica/ip-pa-009-transferir-api-con-clave-y-host-por-ambiente)** — tienes que decidir dónde va cada cosa: la clave, el host y la conexión. Si solo memorizaste los clics de la Microlección 1, este reto te lo va a mostrar.

Si tienes tiempo, prueba la mitad del diseño en tu entorno con `SIT Tasas de Cambio`: crea en `SIT Conectores` una variable de entorno de texto (**New** > **More** > **Environment variable**) con valor `api.exchangerate-api.com`, escribe en **Host** `@environmentVariables("<nombre de tu variable>")` usando el **nombre** (Name) que muestra la variable, guarda el conector y vuelve a probar `ObtenerTasas`.

| Campo | Tu valor |
|---|---|
| Nombre (Name) de tu variable de entorno | ___ |
| Texto exacto que quedó en **Host** | ___ |
| Status de **Test** después del cambio | ___ |
| Qué tendrías que hacer en PROD si el host cambia después de importar | ___ |

---

## Referencia del caso — el flujo de facturación

Así se ve, a alto nivel, el flujo del caso de negocio con el conector `SIT Facturacion` (API ficticia de la Microlección 2):

1. Trigger de Dataverse **When a row is added, modified or deleted** sobre la tabla de pedidos, con cambio **Modified** y filtro por la columna de estado, para dispararse cuando el pedido pasa a "Facturado".
2. Acción `EmitirFactura` del conector: `numero` y `total` desde el contenido dinámico del pedido; `nit_emisor` desde una **variable de entorno** de la solución (se elige en el contenido dinámico), no escrito en el flujo.
3. Si la respuesta trae `cufe`, acción **Update a row** del pedido con el CUFE. Si falla, el patrón Scope Try/Catch del Módulo 11 registra el error y avisa.

---

### 💼 Caso Real de Negocio
**Empresa:** Distribuidora con 500 facturas diarias  
**Problema:** El proceso de facturación electrónica requería exportar a Excel, subir al portal del gobierno, y copiar manualmente el código CUFE de vuelta al ERP.  
**Solución:** Custom Connector + Power Automate automatiza el envío en tiempo real. Trigger en Dataverse cuando pedido pasa a "Facturado". Respuesta CUFE guardada automáticamente. Proceso de 8 pasos manuales eliminado.  
**Resultado:** Cero errores de CUFE copiado incorrectamente. 4 horas de trabajo manual diario eliminadas.

### ✅ Buenas Prácticas
- Validar el spec OpenAPI (2.0) en editor.swagger.io antes de importar
- Guardar el conector en una solución para portabilidad entre ambientes, en una solución propia que se importa antes que los flujos
- Usar Connection References (no conexiones directas) en flujos de soluciones
- Documentar cada acción y parámetro — el campo "Descripción" aparece en la UI de PA/Canvas
- Implementar retry logic en el flujo, no en el conector (separación de responsabilidades)
- Nunca hardcodear URLs de API en el conector — usar parámetros de conexión o variables de entorno en Host y Base URL
- No guardar claves ni secretos en políticas ni en la definición: que cada conexión aporte su clave, o usar variables de entorno de tipo secreto respaldadas por Azure Key Vault
- Pedir en OAuth solo los permisos que usan las acciones del conector (mínimo privilegio)

### ⚠️ Errores Comunes
| Síntoma | Causa | Solución |
|-------|-------|----------|
| Al importar la definición, el asistente la rechaza | El archivo es OpenAPI 3.0, pesa más de 1 MB o tiene errores de sintaxis | Convertir a OpenAPI 2.0 y validarlo antes de importar (Microlección 2) |
| 401 Unauthorized en producción | Secreto de cliente expirado o credenciales de la conexión vencidas | Rotar secreto en Microsoft Entra ID, actualizar en el conector y volver a autenticar la conexión |
| Error de redirect URI al crear una conexión OAuth | La **Redirect URL** del conector no está registrada en la aplicación de Entra ID | Copiar la Redirect URL que genera el conector al registro de la aplicación |
| Conector no aparece en solución importada | No se agregó como componente de la solución | Editar solución → Agregar existente → Conector personalizado |
| La importación de la solución con flujos falla porque falta el conector | Conector, connection references y flujos en la misma solución, o importados en el orden equivocado | Importar primero una solución que solo contenga el conector, crear la conexión, y después la solución con flujos (Microlección 4) |
| "Invalid connection" después de importar solución | Connection Reference no configurada en destino | Configurar Connection Reference en el ambiente destino |
| La Canvas App importada no encuentra el conector | Las Canvas Apps no reconocen connection references de conectores personalizados | Quitar y volver a agregar el conector en la app después de importar |
| Cambié el valor de la variable de entorno y el conector sigue llamando al host anterior | El valor se toma al guardar el conector | Volver a guardar el conector en ese ambiente |
| HTTP 429 Too Many Requests | Se excedió el límite de la API o de la conexión | Delay entre iteraciones, reintentos en el flujo y menos llamadas por lote |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica de las secciones del asistente y creé `SIT Tasas de Cambio` dentro de la solución `SIT Conectores`
- [ ] Probé `ObtenerTasas` en **Test** y anoté el status y la tasa COP exactos
- [ ] Descargué la definición OpenAPI de mi conector, importé la definición 2.0 de facturación y comprobé qué pasa con un archivo 3.0
- [ ] Agregué una política **Set HTTP header** y expliqué cuándo elegiría **API Key**, **Basic authentication** u **OAuth 2.0**
- [ ] Usé el conector en un flujo de una segunda solución e identifiqué la connection reference que se creó
- [ ] Diagnostiqué la importación fallida en TEST formulando una hipótesis antes de ver la causa
- [ ] Construí sin pasos la Canvas App que muestra la tasa COP con una sola llamada al conector
- [ ] Completé el reto de transferencia (clave en header y host por ambiente) explicando dónde va la clave, dónde el host y en qué orden se importa
- [ ] *(Opcional)* Conector contra Microsoft Graph API autentica con OAuth2/Entra ID y `ObtenerPerfil` retorna el usuario autenticado

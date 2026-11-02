---
id: lab-22
title: "Copilot Studio Avanzado — Agente con SSO, Knowledge Sources y Adaptive Cards"
level: "N3"
duration: 190
product: ["Copilot Studio", "Microsoft Teams", "Dataverse", "Microsoft Entra ID"]
certifications: ["PL-400"]
role: ["Developer", "Functional Consultant"]
prerequisites:
  - "Módulo 15 completado — tabla Solicitud TI con la columna Autonumber Número de Solicitud"
  - "Módulo 22 estudiado: Copilot Studio Avanzado"
  - "Licencia de Copilot Studio que permita publicar (el trial no publica)"
  - "Permiso para crear App Registrations y conceder consentimiento de administrador en Microsoft Entra ID"
  - "Microsoft Teams disponible en el tenant, con las apps de Power Platform permitidas"
files: []
lastVerified: "2026-11"
---

# Lab 22 — Copilot Studio: Agente de Soporte TI con SSO, Generative Answers y Adaptive Cards

## Objetivo

Al finalizar este laboratorio podrás crear un agente de Copilot Studio publicado en Teams que reconoce al usuario autenticado (SSO con tu propia App Registration de Microsoft Entra ID), consulta sus solicitudes en Dataverse mediante un agent flow, muestra los resultados en una Adaptive Card con botones accionables, responde preguntas de política interna desde una fuente de conocimiento de SharePoint y ofrece pasar a un humano cuando el usuario lo pide.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación

**Problema a resolver:** Los empleados de SIT consultan el estado de sus solicitudes abriendo la Canvas App o llamando al soporte. El 70% de las consultas son preguntas simples: "¿en qué estado está mi solicitud?" o "¿cuánto tiempo tarda en resolverse un problema de red?". Un agente conversacional en Teams resuelve estas consultas sin intervención humana.

**Por qué Copilot Studio + SSO:** Sin SSO el agente pide credenciales antes de responder. Con SSO, el empleado abre el chat, escribe "¿qué solicitudes tengo?" y recibe la lista: el agente ya sabe quién es.

## Qué harness usa este lab (léelo antes de empezar)

Copilot Studio ofrece varios *harnesses* (motores de autoría y orquestación) y la elección se hace al crear el agente. Este lab usa el **harness estándar**: en la página **Home** de Copilot Studio se crea desde **Other ways to build** ([Learn: acceder al harness estándar](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/switch-experiences)). Es el mismo harness del Módulo 15. El Módulo 22, en cambio, enseña el **GitHub Copilot harness**.

**Qué cambia:** el harness estándar sigue los topics, trigger phrases y nodos que tú diseñas, y admite **Authenticate manually** con tu propia App Registration; el GitHub Copilot harness razona a partir de instrucciones y descripciones, sin topics, y solo admite **No authentication** o **Authenticate with Microsoft** ([Learn: harnesses](https://learn.microsoft.com/microsoft-copilot-studio/harnesses-overview)). Este lab necesita autenticación manual (Client ID, Client secret, Token exchange URL), y por eso no se puede hacer en el GitHub Copilot harness.

## Lo que vas a construir

- **Agente** "SIT Soporte TI" (harness estándar) publicado en Teams
- **Autenticación manual con Microsoft Entra ID** y **SSO en Teams**: en el chat de Teams el agente conoce tu nombre y tu correo sin pedirte que inicies sesión
- **Topic: Consultar mis solicitudes**: un agent flow consulta Dataverse y el agente muestra el resultado en una Adaptive Card
- **Generative answers** con una fuente de conocimiento de SharePoint (políticas de TI)
- **Topic: Crear nueva solicitud**: crea un registro en Dataverse desde el chat, con confirmación en una Adaptive Card
- **Topic de sistema Escalate**: da el contacto de la mesa de ayuda y deja preparado el nodo **Transfer conversation**

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — App Registration, agente y autenticación manual | 40 min |
| Ejercicio 2 — Topic: Consultar mis solicitudes con Adaptive Card | 45 min |
| Ejercicio 3 — Generative answers con SharePoint | 25 min |
| Ejercicio 4 — Topic: Crear nueva solicitud y escalamiento | 40 min |
| Ejercicio 5 — SSO en Teams, publicar y probar | 40 min |
| **Total** | **190 min** (mejor en dos sesiones: Ejercicios 1-3 y 4-5) |

## Nivel

**N3 Avanzado** — Certificación objetivo: **PL-400**

## Tecnologías utilizadas

- Microsoft Copilot Studio ([copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)), harness estándar
- Microsoft Entra ID (App Registration para la autenticación y el SSO)
- Microsoft Teams (canal de publicación)
- Power Automate (agent flows que llama el agente)
- Dataverse (tabla **Solicitud TI**)
- SharePoint Online (fuente de conocimiento)

## Prerrequisitos

### Entorno

- [ ] Acceso a [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com) con el **entorno del curso** (el del Módulo 15, con Dataverse) seleccionado en el selector de entorno.
- [ ] **Licencia que permita publicar.** Learn indica que la autenticación configurada solo se aplica **después de publicar**, y que con el trial puedes probar en el panel de prueba pero **no publicar** ([Learn: autenticación](https://learn.microsoft.com/microsoft-copilot-studio/configuration-end-user-authentication), [Learn: licencias del harness estándar](https://learn.microsoft.com/microsoft-copilot-studio/billing-licensing)). Con solo el trial no puedes completar los Ejercicios 1 y 5: ver "Si solo tienes trial" al final de este apartado.
- [ ] **Copilot Credits:** las generative answers y las acciones del agente consumen Copilot Credits, la moneda común de Copilot Studio ([Learn: licencias del harness estándar](https://learn.microsoft.com/microsoft-copilot-studio/billing-licensing)). Si el agente deja de responder con un aviso de capacidad, habla con quien administra el tenant.
- [ ] Tabla **Solicitud TI** con la columna Autonumber **Número de Solicitud** (formato `SOL-{SEQNUM:6}`, del Módulo 7) y al menos 3 solicitudes **creadas por ti** después de agregar esa columna. Es la misma tabla que usó el Módulo 15. **Si hiciste el Lab 02 en el mismo entorno**, tendrás dos tablas parecidas (`Solicitud TI` del Lab 02 y `Solicitud TI (M2)`): usa la que tiene la columna **Número de Solicitud**, o agrégasela a la otra siguiendo el Módulo 7.
- [ ] Un rol que te permita crear App Registrations y **conceder consentimiento de administrador** (Learn menciona al menos **Application Administrator** o **Cloud Application Administrator**). Si no lo tienes, pídele a quien administre el tenant que haga contigo la Tarea 1.1.
- [ ] Teams debe permitir agregar apps de Power Platform. Si está desactivado, Learn indica que lo habilita un administrador en el Teams admin center ([Learn: Teams y Copilot Studio](https://learn.microsoft.com/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)).
- [ ] Un sitio de SharePoint donde tengas al menos permiso de **Read** y puedas subir un documento.

> **Si solo tienes trial:** haz los Ejercicios 2, 3 y 4 en el panel de prueba con la autenticación que trae el agente por defecto (**Authenticate with Microsoft**), y documenta los Ejercicios 1 y 5 como diseño: qué pondrías en cada campo y por qué. Como evidencia, guarda una instantánea del panel de prueba (Ejercicio 5, "Si no puedes publicar").

### Crear el documento de conocimiento antes de empezar

Crea en Word un documento llamado `Politicas_Soporte_TI.docx` con este contenido mínimo:

```
POLÍTICAS DE SOPORTE TI — SIT
================================

Tiempos de respuesta por prioridad:
- Crítica: máximo 4 horas
- Alta: máximo 24 horas
- Media: máximo 5 días hábiles
- Baja: máximo 10 días hábiles

Cómo solicitar soporte:
Para solicitar soporte técnico, usa la app SIT Solicitudes Internas en Teams
o envía un email a soporte@sit.com con asunto "SOLICITUD: [descripción breve]".

Qué incluir en tu solicitud:
- Descripción del problema
- Desde cuándo ocurre
- Si el problema afecta a otras personas
- Capturas de pantalla si aplica
```

Súbelo a la biblioteca de documentos de tu sitio de SharePoint y anota la URL del sitio (por ejemplo `https://tuempresa.sharepoint.com/sites/DocumentacionTI`). No lo protejas con una etiqueta de confidencialidad que cifre el archivo: Learn advierte que el agente no puede leer archivos cifrados.

---

## Datos de apoyo

### App Registration para la autenticación manual

Crea una App Registration **nueva** para este agente: Learn pide no modificar App Registrations existentes, así que no reutilices la del Lab 19 ([Learn: autenticación con Microsoft Entra ID](https://learn.microsoft.com/microsoft-copilot-studio/configuration-authentication-azure-ad)).

| Campo | Valor |
|---|---|
| Nombre | `SIT-CopilotBot` |
| Supported account types | **Accounts in this organizational directory only** |
| Redirect URI (plataforma **Web**) | `https://token.botframework.com/.auth/web/redirect` (en Europa: `https://europe.token.botframework.com/.auth/web/redirect`) |
| API permissions (Microsoft Graph, **Delegated**) | `openid`, `profile`, `Sites.Read.All`, `Files.Read.All` |
| Client secret | Uno nuevo, con el plazo más corto que cubra el curso |

`Sites.Read.All` y `Files.Read.All` hacen falta porque, con autenticación manual, Learn exige esos alcances para que las generative answers lean SharePoint ([Learn: SharePoint como conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-sharepoint)). No le dan al usuario más permisos de los que ya tiene en el sitio.

### Variables de usuario disponibles en Copilot Studio

Con **Authenticate manually** y un proveedor de Microsoft Entra ID, Learn documenta estas variables de sistema. En una fórmula Power Fx se escriben con `System.` delante (por ejemplo `System.User.DisplayName`); en un mensaje las insertas con el botón **{x}**, pestaña **System** ([Learn: variables](https://learn.microsoft.com/microsoft-copilot-studio/authoring-variables-about)).

| Variable | Contenido |
|---|---|
| `User.DisplayName` | Nombre visible del usuario |
| `User.Email` | Correo del usuario |
| `User.PrincipalName` | Nombre principal (UPN) del usuario |
| `User.Id` | Identificador único del usuario en el proveedor de identidad |
| `User.IsLoggedIn` | Si el usuario ya inició sesión (Yes/No) |
| `User.AccessToken` | Token del usuario. Solo existe con **Authenticate manually**. Learn advierte: pásalo solo a flujos de confianza y nunca lo muestres en un mensaje |

Learn también advierte que `User.DisplayName` y `User.Id` pueden venir vacíos según cómo esté configurado el usuario: prueba siempre con un usuario real.

---

## Ejercicio 1 — App Registration, agente y autenticación manual

> **Qué vas a hacer:** Registrar la aplicación en Microsoft Entra ID, crear el agente en el harness estándar y configurar la autenticación manual. El SSO en Teams se termina en el Ejercicio 5, porque necesita el ID del canal de Teams.
> **Duración:** 40 min

### Tarea 1.1 — Crear la App Registration

Todos los pasos siguen [Learn: configurar la autenticación con Microsoft Entra ID](https://learn.microsoft.com/microsoft-copilot-studio/configuration-authentication-azure-ad).

1. Entra a [portal.azure.com](https://portal.azure.com) con una cuenta de administrador del mismo tenant que el agente y ve a **App registrations** > **New registration**.
2. Nombre: `SIT-CopilotBot`. En **Supported account types** elige **Accounts in this organizational directory only**. Deja **Redirect URI** vacío por ahora y selecciona **Register**.
3. En **Overview**, copia el **Application (client) ID** en un archivo temporal.
4. En **Manage** > **Authentication** > **Platform configurations**, selecciona **Add a platform** > **Web**. En **Redirect URIs** escribe `https://token.botframework.com/.auth/web/redirect` (o la de Europa si tu tenant está allí). Marca **Access tokens (used for implicit flows)** e **ID tokens (used for implicit and hybrid flows)** y selecciona **Configure**.
5. En **Manage** > **Certificates & secrets** > **Client secrets**, selecciona **New client secret**, elige el plazo más corto que te sirva y selecciona **Add**. **Copia el Value ya:** si sales de la página, queda oculto y tendrás que crear otro.
6. En **API permissions**, selecciona **Add a permission** > **Microsoft Graph** > **Delegated permissions**. Expande **OpenId permissions** y marca **openid** y **profile**. Busca también y marca **Sites.Read.All** y **Files.Read.All**. Selecciona **Add permissions**.
7. Selecciona **Grant admin consent for <tu tenant>** y luego **Yes**. Si el botón no está disponible, necesitas a un administrador.

**Qué deberías ver:** en **API permissions**, los cuatro permisos (más `User.Read`, que la App Registration trae por defecto) con el estado de consentimiento concedido.

> **Client secret o federated credentials:** Learn recomienda **Microsoft Entra ID V2 with federated credentials** (sin secretos guardados) y deja el client secret para cuando no puedas usar credenciales federadas. El lab usa el secreto porque así lo pide también la guía de SSO en Teams que seguirás en el Ejercicio 5. En producción, prefiere las credenciales federadas.

### Tarea 1.2 — Crear el agente en el harness estándar

1. En [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com), con el entorno del curso seleccionado, ve a **Home** y selecciona **Other ways to build**. Si en tu pantalla no aparece, abre el menú **…** al pie de la barra lateral y elige **Open classic experience** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/switch-experiences)).
2. En la página **Agents**, selecciona **Create blank agent** y escribe el nombre `SIT Soporte TI` (máximo 42 caracteres).
3. Antes de crear, abre **Advanced settings**: idioma principal (*primary language*) **Spanish** (cualquier variante de español sirve) y, como solución, tu solución del curso (publisher `sit`). **El idioma principal no se puede cambiar después** ([Learn: crear un agente](https://learn.microsoft.com/microsoft-copilot-studio/authoring-first-bot)). Selecciona **Create**. Se abre la página **Overview** del agente.
4. En la sección de instrucciones de **Overview**, selecciona **Edit**, escribe y guarda:
   ```
   Eres el asistente de soporte TI de SIT (Servicios Integrados Tecnológicos). Ayudas a los empleados a consultar el estado de sus solicitudes, crear nuevas solicitudes y obtener información sobre políticas de soporte. Responde siempre en español. Sé conciso y profesional.
   ```
5. Cambia a orquestación clásica, como en el Módulo 15: **Settings** > **Generative AI** > **Orchestration**; a la pregunta "Use generative AI orchestration for your agent's responses?" elige **No** y guarda ([Learn: orquestación](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)). Así cada topic se activa por sus trigger phrases y lo ves con **Track between topics**. (El reto intermedio te pide la orquestación generativa.)

### Tarea 1.3 — Configurar la autenticación manual

1. En el agente, ve a **Settings** > **Security** > **Authentication**. Verás tres opciones: **No authentication**, **Authenticate with Microsoft** (la que trae el agente por defecto) y **Authenticate manually** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/configuration-end-user-authentication)).
2. Selecciona **Authenticate manually** y deja activado **Require users to sign in**.
3. Completa:

   | Campo | Valor |
   |---|---|
   | **Service provider** | **Microsoft Entra ID V2 with client secrets** |
   | **Client ID** | El **Application (client) ID** de la Tarea 1.1 |
   | **Client secret** | El **Value** del secreto de la Tarea 1.1 |
   | **Scopes** | `profile openid Sites.Read.All Files.Read.All` |

   El campo **Token exchange URL (required for SSO)** lo llenas en el Ejercicio 5. Si tu pantalla pide algún campo más (por ejemplo **Tenant ID**), usa el valor que muestra **Overview** de la App Registration.
4. Selecciona **Save**.

**Por qué no basta con "Authenticate with Microsoft":** esa opción configura Microsoft Entra ID sola, sin App Registration ni Client ID/secret, y en un chat 1:1 de Teams ya inicia sesión al usuario sin preguntar. Pero no da `User.AccessToken` y solo cubre Teams, SharePoint, Power Apps y Microsoft Copilot. **Authenticate manually** es la que necesitas cuando quieres tu propia App Registration, el token del usuario (reto avanzado) u otros canales ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/configuration-end-user-authentication)). Lo que **Require users to sign in** activa es el topic de sistema **Require users to sign in**, que pide iniciar sesión al empezar la conversación; esa opción no existe con **Authenticate with Microsoft**.

### Tarea 1.4 — Probar el inicio de sesión

Learn indica que los cambios de autenticación solo se aplican **después de publicar** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/configuration-end-user-authentication)).

1. Selecciona **Publish** (arriba a la derecha) y confirma. Espera el aviso de que terminó. **Todavía no agregues el canal de Teams:** eso va en el Ejercicio 5, después de configurar el SSO.
2. Abre el panel **Test your agent** (botón **Test**) y escribe `hola`. El agente pide iniciar sesión: selecciona **Login**, inicia sesión en la pestaña que se abre, copia el código de validación que aparece y pégalo en el chat ([Learn: probar la autenticación](https://learn.microsoft.com/microsoft-copilot-studio/configuration-authentication-azure-ad)). En el panel de prueba esto es lo esperado: el SSO sin preguntas lo verás en Teams.
3. Abre **Variables** (barra secundaria) > pestaña **Test** y busca en las variables de sistema `User.DisplayName` y `User.Email` ([Learn: valores de variables en la prueba](https://learn.microsoft.com/microsoft-copilot-studio/authoring-test-bot)).

**Si no lo ves:** si el inicio de sesión falla con un error de redirección, revisa que el **Redirect URI** de la App Registration sea exactamente el de la Tarea 1.1. Si las variables de usuario no tienen valor, revisa que publicaste después de guardar la autenticación y que **Scopes** incluye `profile` (Learn: `User.DisplayName` sale del claim `name`, que requiere ese alcance).

### Validación del Ejercicio 1

- [ ] La App Registration `SIT-CopilotBot` tiene el Redirect URI, los 4 permisos delegados y el consentimiento concedido
- [ ] El agente `SIT Soporte TI` está en el entorno del curso, en tu solución, con idioma principal español y orquestación clásica
- [ ] **Authentication** = **Authenticate manually**, proveedor **Microsoft Entra ID V2 with client secrets**, **Require users to sign in** activado
- [ ] En **Test your agent** iniciaste sesión con el código de validación y `User.DisplayName` tiene tu nombre

---

## Ejercicio 2 — Topic: Consultar mis solicitudes con Adaptive Card

> **Qué vas a hacer:** Crear un agent flow que cuente las solicitudes del usuario en Dataverse y un topic que muestre el resultado en una Adaptive Card con botones.
> **Duración:** 45 min

### Tarea 2.1 — Crear el agent flow

Un agent flow empieza con el trigger **When an agent calls the flow** y devuelve los datos con **Respond to the agent**. Learn exige que tenga **Asynchronous response** en **Off** y que llegue a **Respond to the agent** en menos de **100 segundos**; si tarda más, el agente muestra el error **FlowActionTimedOut** ([Learn: crear un agent flow](https://learn.microsoft.com/microsoft-copilot-studio/advanced-flow-create), [Learn: códigos de error](https://learn.microsoft.com/troubleshoot/power-platform/copilot-studio/authoring/error-codes)).

1. En el agente, ve a **Tools** > **Add tool** y, en **Create new**, elige **Agent flow**. Se abre el diseñador con **When an agent calls the flow** y **Respond to the agent** ya colocados.
2. Selecciona el trigger, elige **Add an input** > **Text** y cambia el nombre `Input` por `emailUsuario`.
3. Entre el trigger y la respuesta, agrega la acción **List rows** del conector Dataverse:
   - **Table name:** Solicitudes TI (la tabla con **Número de Solicitud**).
   - En **Advanced parameters** elige **Filter rows** y escribe `createdby/internalemailaddress eq '`, luego inserta la entrada `emailUsuario` desde el contenido dinámico (el rayo azul) y cierra con `'`. Queda así, con el correo como pastilla de contenido dinámico: `createdby/internalemailaddress eq 'ana@tuempresa.com'`.
   - **No le cambies el nombre a la acción:** la expresión del paso 4 la busca como `List_rows`.

   > **Qué hace ese filtro:** `createdby` es el usuario que creó la fila e `internalemailaddress` es su columna **Primary Email** en la tabla de usuarios. Dataverse permite filtrar por una columna de la tabla relacionada con el patrón `<lookup>/<columna>` ([Learn: filtrar por valores de columnas relacionadas](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/filter-rows), [Learn: systemuser](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/reference/systemuser)). Aquí "mis solicitudes" son las que **creaste tú**. En un caso real filtrarías por el solicitante, pero en el Lab 02 **Solicitante** apunta a la tabla Contact, que no es tu usuario de Entra ID.

4. En **Respond to the agent**, selecciona **Add an output** > **Number**, ponle de nombre `CantidadSolicitudes` y, en el valor, inserta con **fx** (expresión): `length(outputs('List_rows')?['body/value'])`.
5. Abre **Respond to the agent** > **Settings** > sección **Networking** y confirma que **Asynchronous response** está en **Off**.
6. Ponle nombre al flujo (`SIT - Bot Consultar Solicitudes`), selecciona **Publish** y espera la confirmación.
7. Comprueba en [make.powerapps.com](https://make.powerapps.com) > **Solutions** > tu solución que el flujo está dentro. Si no está, agrégalo con **Add existing** > **Automation** > **Cloud flow** (el flujo debe estar en una solución del mismo entorno que el agente).

### Tarea 2.2 — Crear el topic "Consultar mis solicitudes"

1. **Topics** > **Add a topic** > **From blank**. Nombre: `Consultar mis solicitudes`.
2. En el nodo **Trigger**, abre **…** > **Properties** y agrega con **Add phrases** estas frases (Learn pide de 5 a 10 por topic, [Learn: topics](https://learn.microsoft.com/microsoft-copilot-studio/authoring-create-edit-topics)):
   ```
   mis solicitudes
   qué solicitudes tengo
   estado de mis tickets
   ver mis peticiones abiertas
   cuántas solicitudes tengo
   revisar mis casos
   ```
3. Con **+** (*Add node*) agrega **Send a message**: escribe `Buscando tus solicitudes, ` e inserta con **{x}** la variable de sistema `User.DisplayName` ([Learn: mensajes](https://learn.microsoft.com/microsoft-copilot-studio/authoring-send-message)).
4. Con **+** elige **Add a tool** y selecciona `SIT - Bot Consultar Solicitudes`. En la entrada `emailUsuario` elige la variable de sistema `User.Email`. La salida queda guardada en una variable del topic: anota su nombre exacto (este lab supone `Topic.CantidadSolicitudes`).
5. **Add a condition**: **Select a variable** > `CantidadSolicitudes`, operador **is equal to**, valor `0`. En esa rama, un **Send a message**: `No tienes solicitudes registradas. Escribe "quiero crear una solicitud" si necesitas una.` La otra rama es **All other conditions**.
6. En **All other conditions**, agrega **Ask with Adaptive Card**. Abre **…** > **Properties** > **Edit adaptive card** y, en el **Card payload editor**, reemplaza el contenido por este JSON. Selecciona **Save** y cierra el diseñador ([Learn: preguntar con Adaptive Cards](https://learn.microsoft.com/microsoft-copilot-studio/authoring-ask-with-adaptive-card)):

```json
{
  "$schema": "http://adaptivecards.microsoft.com/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "📋 Tus solicitudes",
      "weight": "Bolder",
      "size": "Medium",
      "color": "Accent"
    },
    {
      "type": "TextBlock",
      "text": "Total: 0 solicitudes",
      "spacing": "None",
      "color": "Good"
    },
    {
      "type": "TextBlock",
      "text": "Para ver el detalle completo, abre la app SIT Solicitudes.",
      "wrap": true,
      "size": "Small"
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "📝 Crear nueva solicitud",
      "data": { "actionSubmitId": "nueva_solicitud" }
    },
    {
      "type": "Action.Submit",
      "title": "Listo, gracias",
      "data": { "actionSubmitId": "listo" }
    },
    {
      "type": "Action.OpenUrl",
      "title": "🔗 Ver en la app",
      "url": "https://make.powerapps.com"
    }
  ]
}
```

   - **Versión 1.5 a propósito:** Learn indica que Copilot Studio admite hasta la 1.6, pero Teams solo hasta la **1.5** ([Learn: Adaptive Cards](https://learn.microsoft.com/microsoft-copilot-studio/adaptive-cards-overview)).
   - **Por qué este nodo y no un mensaje:** un **Send a message** con tarjeta solo muestra información. Para que los botones **Action.Submit** le devuelvan algo al agente necesitas el nodo **Ask with Adaptive Card**, que guarda lo que envía el usuario en variables de salida.
   - Cambia la URL de **Ver en la app** por el enlace web de tu Canvas App (lo encuentras en los detalles de la app en make.powerapps.com). Si no lo tienes, borra esa acción.

7. **Muestra el número real (Power Fx).** El JSON no lee variables: `${Topic.Variable}` o `{Topic.Variable}` escritos dentro del JSON se muestran como texto literal. En **Adaptive Card node properties**, cambia de **JSON** a **Formula**: la tarjeta se convierte en una fórmula Power Fx. Busca la línea `text: "Total: 0 solicitudes",` y reemplázala por:
   ```js
   text: "Total: " & Text(Topic.CantidadSolicitudes) & " solicitudes", // Text() convierte el número en texto
   ```
   Learn advierte que, una vez editada como fórmula, ya no puedes volver al JSON: guarda una copia del JSON en tus notas.
8. Revisa las variables de salida del nodo: debe existir `actionSubmitId` (texto). Si no aparece, agrégala con **Edit Schema** en el panel de propiedades. Por ahora deja el nodo así; en la Tarea 4.3 conectarás el botón **Crear nueva solicitud**.
9. **Save**.

### Tarea 2.3 — Probar

1. En **Test your agent**, abre **…** y activa **Track between topics**. Reinicia la conversación con el icono **Reset**.
2. Escribe `mis solicitudes`. Si te pide iniciar sesión, hazlo como en la Tarea 1.4.
3. Comprueba que la tarjeta muestra el mismo total que ves en tu tabla filtrando por **Created By** = tú.

**Si no lo ves:**
- "La tarjeta dice **Total: 0**, pero tengo solicitudes" → abre el historial de ejecuciones del flujo y mira el **Filter rows** que se envió: si el correo llegó vacío, el usuario no inició sesión o `User.Email` no tiene valor para tu cuenta (prueba con `User.PrincipalName` y, en el filtro, la columna `domainname`, que es el **User Name** del usuario). Si llegó bien, revisa que tus solicitudes las creaste tú y no otra persona.
- "La tarjeta muestra literalmente `Text(Topic.CantidadSolicitudes)` o `${...}`" → la tarjeta sigue en **JSON**: haz el paso 7.
- El agente dice que el flujo agotó el tiempo (**FlowActionTimedOut**) → la ejecución tardó más de 100 s en llegar a **Respond to the agent**: mira en el historial qué acción tardó.
- Error **BindingKeyNotFoundError** → cambiaste las entradas del flujo después de ponerlo en el topic: borra el nodo de la herramienta y agrégalo de nuevo.

### Validación del Ejercicio 2

- [ ] El flujo `SIT - Bot Consultar Solicitudes` está publicado, en tu solución, con **When an agent calls the flow** y **Respond to the agent** (**Asynchronous response** en **Off**)
- [ ] El topic tiene al menos 6 trigger phrases
- [ ] "mis solicitudes" devuelve la Adaptive Card con el total real
- [ ] Si no hay solicitudes, aparece el mensaje alternativo

---

## Ejercicio 3 — Generative answers con SharePoint

> **Qué vas a hacer:** Conectar el agente a tu sitio de SharePoint para que responda preguntas de política de TI sin un topic por cada pregunta, y comprobar que no inventa respuestas.
> **Duración:** 25 min

### Tarea 3.1 — Agregar la fuente de conocimiento

1. En **Overview** (sección **Knowledge**) o en la página **Knowledge**, selecciona **Add knowledge** y, en la sección **Featured**, elige **SharePoint** ([Learn: SharePoint como conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-sharepoint)).
2. Escribe la URL de tu sitio (por ejemplo `https://tuempresa.sharepoint.com/sites/DocumentacionTI`). El agente busca en esa URL y en sus subrutas, nunca en sitios hermanos ni superiores.
3. Escribe un nombre y una descripción ("Políticas de soporte TI de SIT: tiempos de respuesta y cómo pedir soporte") y selecciona **Add to agent**.

   > SharePoint se consulta en el momento de la pregunta, **con los permisos de quien pregunta**: si el usuario no tiene acceso al documento, el agente no responde con él. Con autenticación manual, esto solo funciona si **Scopes** incluye `Sites.Read.All Files.Read.All` (Tarea 1.3).

### Tarea 3.2 — Evitar respuestas inventadas

1. En **Overview** > sección de instrucciones > **Edit**, agrega al final de las instrucciones de la Tarea 1.2 y guarda:
   ```
   Para preguntas de políticas de soporte, responde únicamente con la información de las fuentes de conocimiento de SIT.
   No inventes procedimientos, tiempos de respuesta ni datos de contacto.
   Sé conciso: máximo 3 párrafos por respuesta.
   ```
   No pidas que quite o cambie las citas: Learn advierte que modificar el formato de las citas puede hacer que el agente descarte respuestas válidas ([Learn: instrucciones](https://learn.microsoft.com/microsoft-copilot-studio/authoring-instructions)).
2. En **Settings** > **Generative AI**, si aparece **Use general knowledge**, desactívalo y guarda. Learn indica que, con ese ajuste apagado, el agente no responde cuando no encuentra el dato en la fuente ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-sharepoint)).
3. Con la orquestación clásica, una pregunta que no está ni en tus topics ni en tus fuentes termina en el topic de sistema **Fallback**. Abre **Topics** > pestaña **System** > **Fallback** y cambia su mensaje por: `No tengo información sobre ese tema en mi base de conocimiento. Te recomiendo contactar al equipo de soporte en soporte@sit.com`. **Save**.

### Tarea 3.3 — Probar las generative answers

En **Test your agent** (reinicia antes con **Reset**), prueba:

| Pregunta | Resultado esperado |
|---|---|
| "¿Cuánto tiempo tardan en resolver un problema crítico?" | Respuesta con "máximo 4 horas" y una cita al documento |
| "¿Cómo solicito soporte?" | El procedimiento del documento (app en Teams o correo con asunto "SOLICITUD:") |
| "¿Cuál es la capital de Francia?" | No la responde: aparece tu mensaje de **Fallback** |
| "¿Cuánto gana el CEO?" | No la responde: aparece tu mensaje de **Fallback** |

> Las dos últimas comprueban el **grounding**: el agente solo responde con lo que encuentra en sus fuentes.

**Si no lo ves:** si las preguntas del documento también terminan en **Fallback**, revisa que tu usuario tenga permiso de lectura en el sitio, que **Scopes** incluya `Sites.Read.All Files.Read.All` y que publicaste después de cambiarlo. Un documento recién subido puede tardar en aparecer en la búsqueda de SharePoint: vuelve a probar más tarde. Si tu tenant no tiene SharePoint disponible para el curso, sube `Politicas_Soporte_TI.docx` como archivo (**Add knowledge** > subir archivo, como en el Módulo 15) y anota en tu evidencia que usaste esa variante. Si "¿Cuál es la capital de Francia?" sí se responde, revisa el paso 2 de la Tarea 3.2.

### Validación del Ejercicio 3

- [ ] La fuente de SharePoint aparece en **Knowledge** con nombre y descripción
- [ ] Las preguntas de tiempos de respuesta se contestan con el documento y con cita
- [ ] Las preguntas fuera de alcance terminan en tu mensaje de **Fallback**

---

## Ejercicio 4 — Topic: Crear nueva solicitud y escalamiento

> **Qué vas a hacer:** Crear la solicitud desde el chat, con una tarjeta de confirmación, y preparar el escalamiento a un humano.
> **Duración:** 40 min

### Tarea 4.1 — El agent flow que crea la solicitud

1. **Tools** > **Add tool** > **Agent flow**.
2. En **When an agent calls the flow** agrega tres entradas **Text**: `categoria`, `descripcion` y `emailUsuario`.
3. Entre los dos nodos agrega **Add a new row** del conector Dataverse:
   - **Table name:** Solicitudes TI.
   - **Título de Solicitud:** la entrada `categoria`, seguida del texto ` - solicitud desde el agente`.
   - **Descripción:** la entrada `descripcion`, seguida de ` (reportado por ` + la entrada `emailUsuario` + `)`.
   - Deja **Prioridad**, **Estado** y la categoría de la tabla con sus valores por defecto. (La categoría elegida en el chat va en el título porque, según hayas hecho el Módulo 2 o el Lab 02, tu tabla la guarda como Choice o como Lookup.)
4. En **Respond to the agent**, **Add an output** > **Text** con el nombre `NumeroSolicitud` y, como valor, la columna **Número de Solicitud** (la Autonumber del Módulo 7) desde el contenido dinámico de **Add a new row**. Confirma en **Settings** > **Networking** que **Asynchronous response** está en **Off**.
5. Nombre: `SIT - Bot Crear Solicitud`. **Publish** y comprueba que quedó en tu solución.

### Tarea 4.2 — Topic "Crear nueva solicitud"

1. **Topics** > **Add a topic** > **From blank**. Nombre: `Crear nueva solicitud`.
2. Trigger phrases:
   ```
   quiero crear una solicitud
   reportar un problema
   abrir un ticket
   necesito ayuda técnica
   tengo un problema con mi computadora
   ```
3. **Ask a question**: `¿Cuál es el tipo de problema? 🔧`. En **Identify** elige **Multiple choice options** y, en **Options for user**, escribe `Hardware`, `Software`, `Red y Conectividad`, `Accesos y Seguridad` y `Otro`. En **Save user response as**, renombra la variable a `Categoria` (alcance **Topic**). (Learn: para obligar a elegir una opción de una lista se usa una pregunta de opción múltiple, no las *quick replies* de un mensaje, [Learn: mensajes](https://learn.microsoft.com/microsoft-copilot-studio/authoring-send-message).)
4. **Ask a question**: `Describe brevemente el problema:`. En **Identify** elige **User's entire response** y renombra la variable a `Descripcion`.
5. **Ask with Adaptive Card** de confirmación. En **Edit adaptive card** pega este JSON y guarda:
   ```json
   {
     "$schema": "http://adaptivecards.microsoft.com/schemas/adaptive-card.json",
     "type": "AdaptiveCard",
     "version": "1.5",
     "body": [
       { "type": "TextBlock", "text": "✅ Resumen de tu solicitud", "weight": "Bolder" },
       { "type": "FactSet", "facts": [
         { "title": "Tipo:", "value": "categoria" },
         { "title": "Descripción:", "value": "descripcion" }
       ]}
     ],
     "actions": [
       { "type": "Action.Submit", "title": "📤 Confirmar y enviar", "data": { "actionSubmitId": "confirmar" } },
       { "type": "Action.Submit", "title": "✏️ Modificar", "data": { "actionSubmitId": "modificar" } }
     ]
   }
   ```
   Cambia la tarjeta a **Formula** y reemplaza los dos valores de ejemplo:
   ```js
   { title: "Tipo:", value: Text(Topic.Categoria) },       // la opción elegida, convertida a texto
   { title: "Descripción:", value: Topic.Descripcion }
   ```
   Comprueba que el nodo tiene la salida `actionSubmitId` (si no, **Edit Schema**).
6. **Add a condition**: `actionSubmitId` **is equal to** `confirmar`. En esa rama:
   - **Add a tool** > `SIT - Bot Crear Solicitud`. Entradas: `categoria` → abre la flecha **>** de la entrada, pestaña **Formula**, escribe `Text(Topic.Categoria)` e **Insert** (la variable de una pregunta de opción múltiple no es de tipo texto); `descripcion` → `Topic.Descripcion`; `emailUsuario` → la variable de sistema `User.Email`. La salida queda en una variable del topic (este lab supone `Topic.NumeroSolicitud`).
   - **Send a message**: `¡Tu solicitud ` + **{x}** `Topic.NumeroSolicitud` + ` fue creada! El equipo de soporte la revisará pronto.`
7. En **All other conditions** (el usuario eligió **Modificar**): **Send a message** `De acuerdo, no la creé. Escribe "quiero crear una solicitud" para empezar de nuevo.`
8. **Save** y prueba en **Test your agent** con "abrir un ticket". Después busca el número en tu tabla **Solicitud TI**.

### Tarea 4.3 — Conectar el botón de la tarjeta de consulta

1. Vuelve a `Consultar mis solicitudes`. Debajo del **Ask with Adaptive Card**, agrega **Add a condition**: `actionSubmitId` **is equal to** `nueva_solicitud`.
2. En esa rama: **Topic management** > **Go to another topic** > `Crear nueva solicitud`. En **All other conditions**, un mensaje de despedida (`¡Listo! Si necesitas algo más, escríbeme.`).
3. **Save** y prueba: "mis solicitudes" → **Crear nueva solicitud** debe llevarte a la pregunta del tipo de problema.

### Tarea 4.4 — Escalamiento con el topic de sistema Escalate

**Escalate** es el topic de sistema que se activa cuando el usuario pide un humano ("quiero hablar con una persona"). La transferencia real, con historial, la hace el nodo **Transfer conversation**, pero **solo** si conectas un *engagement hub*, por ejemplo Dynamics 365 Customer Service con su Chat Add-in (el antiguo Omnichannel for Customer Service). Sin hub, nadie recibe la conversación: por eso el mensaje debe dar el contacto de la mesa de ayuda ([Learn: hand-off](https://learn.microsoft.com/microsoft-copilot-studio/advanced-hand-off), [Learn: hand-off a Dynamics 365 Customer Service](https://learn.microsoft.com/microsoft-copilot-studio/configuration-hand-off-omnichannel)).

1. **Topics** > pestaña **System** > **Escalate**. Reemplaza su mensaje por: `Te conecto con el equipo de soporte. Si nadie te responde en unos minutos, escribe a soporte@sit.com o llama a la extensión 1234.`
2. Al final del topic, con **+** elige **Topic management** > **Transfer conversation**.
3. En **Private message to agent** escribe el contexto para el humano, insertando las variables con **{x}**:
   ```
   Usuario: {User.DisplayName} ({User.Email}). Escalado desde el agente SIT Soporte TI.
   ```
   No intentes usar aquí `Topic.Descripcion` o `Topic.NumeroSolicitud`: son variables de **otro** topic (alcance **Topic**). Si quieres pasarlas, conviértelas en globales, como en el reto del Módulo 15. Learn indica que, al transferir, el hub recibe además el historial y las variables del topic.
4. **Save** y prueba en **Test your agent** con "quiero hablar con una persona".

### Validación del Ejercicio 4

- [ ] `Crear nueva solicitud` pregunta tipo y descripción, muestra la tarjeta de confirmación con tus datos y crea la fila
- [ ] La fila existe en **Solicitud TI** y el agente devolvió su **Número de Solicitud**
- [ ] El botón **Crear nueva solicitud** de la tarjeta de consulta lleva al topic de creación
- [ ] **Escalate** da el contacto de soporte y termina con un nodo **Transfer conversation** con mensaje privado

---

## Ejercicio 5 — SSO en Teams, publicar y probar

> **Qué vas a hacer:** Agregar el canal de Teams, completar el SSO para que Teams inicie sesión al usuario sin preguntar, publicar e instalar el agente en Teams.
> **Duración:** 40 min

> ⚠️ **No instales el agente en Teams (See agent in Teams) hasta terminar la Tarea 5.3.** Learn documenta un problema conocido: si el agente se publicó en Teams con autenticación manual sin el SSO de Teams, Teams pide iniciar sesión una y otra vez ([Learn: SSO en Teams](https://learn.microsoft.com/microsoft-copilot-studio/configure-sso-teams)).

Todos los pasos de las Tareas 5.1 a 5.3 siguen [Learn: configurar SSO con Microsoft Entra ID para agentes en Teams](https://learn.microsoft.com/microsoft-copilot-studio/configure-sso-teams) y [Learn: conectar el agente a Teams](https://learn.microsoft.com/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams).

### Tarea 5.1 — Agregar el canal y copiar su App ID

1. Selecciona **Publish** y confirma (los cambios de los Ejercicios 2 a 4 deben estar publicados; el canal exige haber publicado al menos una vez).
2. Ve a **Channels** > **Microsoft 365 and Microsoft Teams**. Si solo quieres Teams, desmarca **Make agent available in Microsoft Copilot**. Selecciona **Add channel**.
3. Selecciona **Edit details**: pon una descripción corta (`Tu asistente de soporte técnico`), expande **More** y selecciona **Copy** junto a **App ID**. Guárdalo en tu archivo temporal.

### Tarea 5.2 — Preparar la App Registration para Teams

En [portal.azure.com](https://portal.azure.com) > **App registrations** > `SIT-CopilotBot`:

1. **Expose an API** > **Application ID URI** > **Set**. Escribe `api://botid-{teamsbotid}`, reemplazando `{teamsbotid}` por el **App ID** de la Tarea 5.1. **Save**.
2. En **Expose an API**, **Add a scope**:

   | Propiedad | Valor |
   |---|---|
   | Scope name | `SIT.Read` (Learn usa `Test.Read` como ejemplo; cualquier nombre claro sirve) |
   | Who can consent? | **Admins and users** |
   | Admin consent display name | `SIT.Read` |
   | Admin consent description | `Allows the app to sign the user in.` |
   | State | **Enabled** |

   Selecciona **Add scope**.
3. En **Expose an API**, **Add a client application** dos veces, marcando en cada una el alcance `SIT.Read`. Son los IDs de Teams, iguales en todos los tenants:
   - `1fec8e78-bce4-4aaf-ab1b-5451cc387264` (Teams de escritorio y móvil)
   - `5e3ce6c0-2b1f-4285-8d4b-75ee78787346` (Teams en la web)
4. En **Scopes**, copia el alcance completo con el icono **Copy to clipboard** (empieza por `api://botid-`).

### Tarea 5.3 — Completar el SSO en Copilot Studio

1. **Settings** > **Security** > **Authentication**: en **Token exchange URL (required for SSO)** pega el alcance copiado. **Save**.
2. **Channels** > **Microsoft 365 and Microsoft Teams** > **Edit details** > **More**:
   - **AAD application's client ID**: el **Application (client) ID** de la App Registration.
   - **Resource URI**: el **Application ID URI** (`api://botid-...`) de **Expose an API**.

   **Save** y **Close**.
3. Selecciona **Publish** otra vez.

### Tarea 5.4 — Instalar y probar en Teams

1. **Channels** > **Microsoft 365 and Microsoft Teams** > **See agent in Teams** > **Add** en Teams. El agente aparece en la lista de la izquierda.
2. Prueba en el chat 1:1 con el agente:

   | Mensaje | Resultado esperado |
   |---|---|
   | `hola` | Responde sin pedirte iniciar sesión (SSO funcionando) |
   | `mis solicitudes` | Adaptive Card con tu total de solicitudes |
   | `cuánto tardan en resolver problemas críticos` | Respuesta del documento de SharePoint |
   | `quiero crear una solicitud` | Pregunta el tipo de problema con opciones |
   | `quiero hablar con una persona` | Mensaje de **Escalate** con el contacto de soporte |

3. Si después publicas otro cambio y Teams sigue con la versión anterior, escribe `start over` en el chat para empezar una conversación nueva con la última versión.

**Si no lo ves:**
- "Teams me pide iniciar sesión" → revisa el **Application ID URI** (`api://botid-` + el App ID del canal, no el Client ID), los dos IDs de cliente de Teams, el **Token exchange URL** y que volviste a publicar. Si instalaste el agente en Teams antes de la Tarea 5.3, es el problema conocido de Learn. Learn recomienda **Authenticate with Microsoft** para el SSO en chats 1:1 de Teams sin autenticación manual: si tu caso no necesita la App Registration, esa es la opción más simple.
- "No encuentro el agente o no puedo instalarlo" → tu organización debe permitir apps de Power Platform en Teams, y el agente debe estar compartido contigo o con tu grupo.
- "SharePoint responde en Test pero no en Teams" → Learn indica que, en chats de grupo y canales de Teams, el agente no usa conocimiento que requiere autenticación del usuario: prueba en el chat 1:1.

> **Si no puedes publicar (trial):** haz la tabla del paso 2 en **Test your agent**. Al terminar, en la parte superior del panel selecciona **…** > **Save snapshot** y luego **Save**: se descarga `botContent.zip`, con la conversación y su diagnóstico. Esa es tu evidencia. Learn advierte que el archivo incluye todo el contenido del agente y puede tener información sensible: no lo compartas fuera del curso ([Learn: probar el agente](https://learn.microsoft.com/microsoft-copilot-studio/authoring-test-bot)).

### Validación del Ejercicio 5

- [ ] El canal **Microsoft 365 and Microsoft Teams** está agregado y su **Edit details** tiene **AAD application's client ID** y **Resource URI**
- [ ] El agente está instalado en Teams y responde `hola` sin pedir inicio de sesión
- [ ] La Adaptive Card se ve en Teams y la pregunta de política responde con el documento

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El inicio de sesión en **Test your agent** falla con un error de redirección | El Redirect URI no es exactamente `https://token.botframework.com/.auth/web/redirect` (o el de Europa) | En la App Registration > **Authentication**, corrige la URI de la plataforma **Web** |
| `User.DisplayName` o `User.Email` vacíos | La autenticación no se publicó, la cuenta no tiene ese dato en Entra ID o faltan alcances | Publicar tras guardar la autenticación; revisar que **Scopes** incluya `profile openid`; probar con otro usuario real |
| Teams pide iniciar sesión cada vez | Falta parte del SSO de Teams, o el agente se instaló en Teams antes de configurarlo (problema conocido) | Revisar la Tarea 5.2 y 5.3 y volver a publicar; para Teams 1:1 sin App Registration propia, Learn recomienda **Authenticate with Microsoft** |
| La pregunta de política termina en **Fallback** | El usuario no tiene permiso en el sitio, faltan `Sites.Read.All Files.Read.All` en **Scopes** o el archivo está cifrado | Dar permiso de lectura, completar los alcances y publicar, o quitar la etiqueta que cifra el archivo |
| La Adaptive Card muestra `${Topic.Variable}` como texto | Las variables se escribieron dentro del JSON | Cambiar la tarjeta a **Formula** y usar la variable en Power Fx (`"Total: " & Text(Topic.CantidadSolicitudes)`) |
| Los botones de la tarjeta no hacen nada | La tarjeta está en un **Send a message**, que no recoge respuestas | Usar **Ask with Adaptive Card** y una condición sobre `actionSubmitId` |
| El agente dice que el flujo agotó el tiempo (**FlowActionTimedOut**) | El flujo tarda más de 100 s en llegar a **Respond to the agent** | Reducir lo que hace antes de responder (filtrar en **List rows**, devolver pocos datos) |
| El flujo no aparece en **Add a tool** | Sin publicar, en otro entorno, sin el trigger o la respuesta del agente, o con **Asynchronous response** en **On** | Publicarlo en el entorno del agente y dejar **Asynchronous response** en **Off** |
| Error **BindingKeyNotFoundError** | Se cambiaron las entradas del flujo después de agregarlo al topic | Quitar el nodo de la herramienta y agregar el flujo de nuevo |
| **List rows** devuelve 0 filas con un correo correcto | Las solicitudes las creó otra persona, o el correo del usuario no coincide con su **Primary Email** en Dataverse | Revisar **Created By** de tus filas; probar `User.PrincipalName` con la columna `domainname` |

---

## Checklist final

- [ ] App Registration `SIT-CopilotBot` nueva, con Redirect URI, permisos delegados, consentimiento, **Application ID URI** `api://botid-...`, alcance propio y los dos clientes de Teams
- [ ] Agente `SIT Soporte TI` creado en el harness estándar (**Other ways to build**), con idioma español, en tu solución e instrucciones editadas en **Overview**
- [ ] **Authenticate manually** con **Microsoft Entra ID V2 with client secrets**, **Require users to sign in** y **Token exchange URL** configurados
- [ ] Topic `Consultar mis solicitudes` con agent flow (**When an agent calls the flow** → **Respond to the agent**) y Adaptive Card en **Formula**
- [ ] Fuente de SharePoint agregada; las preguntas fuera de alcance terminan en **Fallback**
- [ ] Topic `Crear nueva solicitud` crea una fila en **Solicitud TI** y devuelve su **Número de Solicitud**
- [ ] **Escalate** con contacto de soporte y nodo **Transfer conversation**
- [ ] Agente publicado e instalado en Teams; el SSO funciona sin pedir inicio de sesión (o, con trial, instantánea `botContent.zip` guardada)

## Evidencia esperada

| Campo | Tu valor |
|---|---|
| Harness usado y entorno (nombre exacto) | ___ |
| **Service provider** y **Scopes** configurados en **Authentication** | ___ |
| **Application ID URI** de la App Registration (`api://botid-...`) | ___ |
| Texto exacto de **Filter rows** en el historial de una ejecución de `SIT - Bot Consultar Solicitudes` | ___ |
| Total que mostró la tarjeta y total real de tu tabla (filtrada por **Created By**) | ___ |
| Respuesta a "¿Cuánto tiempo tardan en resolver un problema crítico?" (con su cita) | ___ |
| Respuesta a "¿Cuál es la capital de Francia?" | ___ |
| **Número de Solicitud** creado desde el chat y si existe en la tabla | ___ |
| Dónde probaste el SSO (Teams o, con trial, panel de prueba) y si pidió iniciar sesión | ___ |

## Criterios de aprobación

- El agente responde correctamente en los tres casos (consultar, crear, escalar) con datos reales de Dataverse
- En Teams, el agente responde sin pedir inicio de sesión (con trial: diseño del SSO documentado e instantánea guardada)
- Las generative answers no inventan respuestas fuera de la fuente configurada
- 100% de los ítems del Checklist final marcados

---

## Reto adicional

**Reto básico:** agrega al flujo de consulta una segunda salida con el número de solicitudes con Prioridad = **Crítica** del usuario y muéstrala en la tarjeta con un emoji 🔴. Pista: un segundo **List rows** con el mismo filtro más la condición sobre `sit_prioridad` (el **valor numérico** de la opción, que lees en los *raw outputs* como en el Módulo 5).

**Reto intermedio:** activa la **orquestación generativa** (**Settings** > **Generative AI** > **Orchestration** > **Yes**). Con ella, el agente elige topics y herramientas por su **descripción**, no por sus trigger phrases ([Learn: orquestación](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)). Escribe una descripción clara para cada topic y prueba que "tengo un problema grave con la VPN" active `Crear nueva solicitud` y no **Escalate**. Anota qué tuviste que cambiar en las descripciones.

**Reto avanzado:** haz que la solicitud quede creada **como el usuario real** y no como el dueño de la conexión del flujo. Learn indica que, en un agente autenticado, un flujo puede configurarse para usar las credenciales del usuario (conexión **Provided by run-only user**) y que el usuario gestiona su conexión desde el chat ([Learn: crear un agent flow](https://learn.microsoft.com/microsoft-copilot-studio/advanced-flow-create)). Cambia la conexión de Dataverse de `SIT - Bot Crear Solicitud`, prueba con otro usuario del tenant y comprueba en **Created By** que la fila es suya. Explica por qué no conviene, en cambio, pasar `User.AccessToken` a cualquier flujo.

---

## Preguntas de repaso

1. ¿Qué diferencia hay entre **Authenticate with Microsoft** y **Authenticate manually**, y por qué este lab necesita la segunda?
2. ¿Qué es el **grounding** en las generative answers y qué dos ajustes del lab lo refuerzan?
3. ¿Qué hace el nodo **Transfer conversation** cuando no hay un *engagement hub* conectado, y por qué el mensaje de **Escalate** debe dar un contacto?
4. ¿Por qué, para mostrar una variable en una Adaptive Card, cambias la tarjeta a **Formula** en lugar de escribir la variable dentro del JSON?

---

## Limpieza del laboratorio

> Para eliminar el agente: Copilot Studio → página **Agents** → selecciona el agente → **…** junto a **Settings** → **Delete** → escribe el nombre del agente → **Delete agent** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/authoring-first-bot)).

> Para quitarlo de Teams: antes de borrar el agente, en **Channels** > **Microsoft 365 and Microsoft Teams** selecciona **Remove channel** > **Disconnect**; luego desinstala la app desde la lista de apps de Teams.

> Borra también la App Registration `SIT-CopilotBot` (y su secreto) si no la vas a reutilizar.

---

## Siguiente laboratorio recomendado

➡️ **Lab 32 — CoE Starter Kit: Gobernanza a Escala del Tenant**

**Por qué ir ahí:** Con el agente del Lab 22 en producción y la solución SIT desplegada en múltiples ambientes, el Lab 32 te enseña a monitorear y gobernar todo el ecosistema de apps, flujos y agentes del tenant usando el Center of Excellence Starter Kit.

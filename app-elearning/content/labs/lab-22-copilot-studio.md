---
id: lab-22
title: "Copilot Studio Avanzado — Agente con SSO, Knowledge Sources y Adaptive Cards"
level: "N3"
duration: 110
product: ["Copilot Studio", "Microsoft Teams", "Dataverse", "Microsoft Entra ID"]
certifications: ["PL-400"]
role: ["Developer", "Functional Consultant"]
prerequisites:
  - "Lab 02 completado — tabla sit_Solicitud con datos"
  - "Microsoft Teams disponible en el tenant"
  - "App Registration creada (puede reutilizar la del Lab 19) o nueva"
  - "Módulo 22 estudiado: Copilot Studio Avanzado"
files: []
---

# Lab 22 — Copilot Studio: Agente de Soporte TI con SSO, Generative Answers y Adaptive Cards

## Objetivo

Al finalizar este laboratorio podrás crear un agente conversacional de Copilot Studio publicado en Teams que reconoce al usuario autenticado (SSO), consulta sus solicitudes en Dataverse mediante Power Automate, muestra los resultados en una Adaptive Card con botones accionables, responde preguntas de política interna desde una Knowledge Source de SharePoint y escala a agente humano cuando el usuario lo solicita.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación

**Problema a resolver:** Los empleados de SIT consultan el estado de sus solicitudes abriendo la Canvas App o llamando al soporte. El 70% de las consultas son preguntas simples: "¿en qué estado está mi solicitud?" o "¿cuánto tiempo tarda en resolverse un problema de red?". Un agente conversacional en Teams resuelve estas consultas sin intervención humana.

**Por qué Copilot Studio + SSO:** Sin SSO el bot pregunta credenciales antes de responder. Con SSO, el empleado abre el chat, escribe "¿qué solicitudes tengo abiertas?" y recibe la lista instantáneamente — el bot ya sabe quién es.

## Lo que vas a construir

- **Agente base** "SIT Soporte TI" publicado en Teams
- **SSO con Entra ID**: autenticación silenciosa, el bot conoce el email del usuario desde el primer mensaje
- **Topic: Mis solicitudes**: consulta Dataverse y retorna las solicitudes del usuario en una Adaptive Card
- **Topic: Nueva solicitud rápida**: crea un registro en Dataverse desde el chat
- **Generative Answers** con Knowledge Source de SharePoint (documentación de TI)
- **Topic: Escalar a agente**: transfiere la conversación con contexto

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Crear el agente y configurar SSO | 25 min |
| Ejercicio 2 — Topic: Mis solicitudes con Adaptive Card | 30 min |
| Ejercicio 3 — Generative Answers con Knowledge Source | 20 min |
| Ejercicio 4 — Topic: Nueva solicitud y escalamiento | 20 min |
| Ejercicio 5 — Publicar en Teams y probar | 15 min |
| **Total** | **110 min** |

## Nivel

**N3 Avanzado** — Certificación objetivo: **PL-400**

## Tecnologías utilizadas

- Microsoft Copilot Studio ([copilotstudio.microsoft.com](https://copilotstudio.microsoft.com))
- Microsoft Entra ID (App Registration para SSO)
- Microsoft Teams (canal de publicación)
- Power Automate (flujos llamados por el agente)
- Dataverse (tabla sit_Solicitud)
- SharePoint Online (Knowledge Source)

## Prerrequisitos

### Entorno

- [ ] Acceso a [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
- [ ] Tabla `sit_Solicitud` con datos (Lab 02)
- [ ] Microsoft Teams instalado y configurado en el tenant
- [ ] Un sitio de SharePoint con al menos un documento de política TI (puede ser un Word/PDF creado para este lab)

### Crear el documento de Knowledge Source antes de empezar

Crea un documento en SharePoint (o usa OneDrive) llamado `Politicas_Soporte_TI.docx` con este contenido mínimo:

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

Sube el documento a SharePoint → **Documentos** → anota la URL del sitio.

---

## Datos de apoyo

### App Registration para SSO

Si ya creaste el App Registration en el Lab 19 (`SIT-PowerPlatform-Pipeline`), puedes crear uno nuevo para el bot o reutizarlo agregando los alcances necesarios.

| Campo | Valor |
|---|---|
| Nombre del App Registration | SIT-CopilotBot |
| Redirect URI | `https://token.botframework.com/.auth/web/redirect` |
| API permissions | `User.Read`, `openid`, `profile`, `offline_access` |
| Client Secret | (crear uno nuevo de 12 meses) |

### Variables del sistema disponibles en Copilot Studio

| Variable | Contenido |
|---|---|
| `System.User.DisplayName` | Nombre completo del usuario autenticado |
| `System.User.PrincipalName` | Email del usuario (UPN) |
| `System.User.Id` | GUID del usuario en Azure AD |

---

## Ejercicio 1 — Crear el agente y configurar SSO

> **Qué vas a hacer:** Crear el agente en Copilot Studio, configurar la autenticación con Entra ID para que el bot reconozca al usuario sin pedirle que se loguee.
> **Duración:** 25 min

### Tarea 1.1 — Crear el App Registration para el bot

1. Ve a [portal.azure.com](https://portal.azure.com) → **Microsoft Entra ID** → **Registros de aplicaciones** → **+ Nuevo registro**.

2. Completa:

   | Campo | Valor |
   |---|---|
   | Nombre | SIT-CopilotBot |
   | Tipos de cuenta | Solo esta organización |
   | URI de redireccionamiento | Web: `https://token.botframework.com/.auth/web/redirect` |

3. Registra la app. Anota **Client ID** y **Tenant ID**.

4. Ve a **Permisos de API** → **+ Agregar un permiso** → **Microsoft Graph** → **Permisos delegados**:
   - `User.Read`
   - `openid`
   - `profile`
   - `offline_access`

5. Haz clic en **Conceder consentimiento de administrador**.

6. Ve a **Certificados y secretos** → crea un secreto nuevo de 12 meses. Anota el valor.

### Tarea 1.2 — Crear el agente en Copilot Studio

1. Ve a [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com) y selecciona tu ambiente.

2. Haz clic en **+ Crear** → **Nuevo agente**.

3. En el asistente de creación:
   - **Nombre:** `SIT Soporte TI`
   - **Descripción:** `Asistente de soporte interno para empleados de SIT`
   - **Instrucciones:** `Eres el asistente de soporte TI de SIT (Servicios Integrados Tecnológicos). Ayudas a los empleados a consultar el estado de sus solicitudes, crear nuevas solicitudes y obtener información sobre políticas de soporte. Responde siempre en español. Sé conciso y profesional.`
   - **Idioma:** Español

4. Haz clic en **Crear**.

### Tarea 1.3 — Configurar SSO con Microsoft Entra ID

1. En el agente, ve a **Configuración** (engranaje) → **Seguridad** → **Autenticación**.

2. Selecciona **Autenticar con Microsoft** (o "Microsoft Entra ID").

3. Completa:

   | Campo | Valor |
   |---|---|
   | Client ID | El Application ID del App Registration |
   | Client Secret | El secreto creado en la Tarea 1.1 |
   | Tenant ID | Tu Tenant ID |
   | Alcances (Scopes) | `profile openid` |

4. Haz clic en **Guardar**.

5. Activa la opción **Requerir autenticación** si está disponible.

6. Prueba en el panel de Test: el bot debería reconocerte y decir tu nombre. Si pide login, significa que SSO no está configurado correctamente.

   > **Nota:** En el canal de **Teams**, el SSO funciona de manera silenciosa porque el usuario ya está autenticado en Teams. En el panel de Test del portal de Copilot Studio, puede pedir login una vez — esto es normal en el entorno de pruebas.

### Validación del Ejercicio 1

- [ ] El agente existe y tiene el nombre correcto
- [ ] La autenticación está configurada con los datos del App Registration
- [ ] En el panel de Test, el bot puede acceder a la variable `System.User.DisplayName`

---

## Ejercicio 2 — Topic: Mis solicitudes con Adaptive Card

> **Qué vas a hacer:** Crear el topic más importante: cuando el usuario pregunta por sus solicitudes, el bot consulta Dataverse vía Power Automate y muestra los resultados en una tarjeta interactiva.
> **Duración:** 30 min

### Tarea 2.1 — Crear el flujo de Power Automate para consultar solicitudes

1. En Copilot Studio → abre el topic o desde Power Automate directamente → crea un nuevo flujo en la solución `SIT_SolicitudesInternas`.

2. Disparador: **"Run a flow from Copilot"** (anteriormente "When a Power Virtual Agents flow is run").

3. Agrega una entrada:
   - Nombre: `emailUsuario`
   - Tipo: Text

4. Agrega acción **"List rows"** (Dataverse):
   - Tabla: `Solicitudes (sit_Solicitud)`
   - Filter rows: `sit_solicitante/internalemailaddress eq '@{triggerBody()?['text']}'`

   > Si la columna Solicitante es un Lookup a Contact, el email del Contact se accede con `/internalemailaddress`. Ajusta el nombre del campo según tu configuración.

   Una alternativa más robusta si la columna Asignado A es Lookup a SystemUser:
   - Filter rows: `_ownerid_value/internalemailaddress eq '@{triggerBody()?['text']}'`

5. Agrega acción **"Respond to Copilot"** con las siguientes salidas:
   - `cantidadSolicitudes`: expresión `length(outputs('List_rows')?['body/value'])` (tipo Number)
   - `solicitudesJSON`: expresión `string(outputs('List_rows')?['body/value'])` (tipo Text)

6. Guarda el flujo como `SIT — Bot Consultar Solicitudes`.

### Tarea 2.2 — Crear el topic "Consultar mis solicitudes"

1. En Copilot Studio → **Topics** → **+ Agregar** → **Topic en blanco**.

2. Nombre: `Consultar mis solicitudes`.

3. **Frases de activación** (trigger phrases):
   - "mis solicitudes"
   - "qué solicitudes tengo"
   - "estado de mis tickets"
   - "ver mis peticiones abiertas"
   - "cuántas solicitudes tengo"

4. Agrega un **nodo de mensaje** inicial:
   - Texto: `Buscando tus solicitudes, ${System.User.DisplayName}... 🔍`

5. Agrega un **nodo de acción** → **Llamar a una acción** → selecciona el flujo `SIT — Bot Consultar Solicitudes`.

6. Mapea la entrada del flujo:
   - `emailUsuario` ← `System.User.PrincipalName`

7. Guarda las salidas del flujo en variables:
   - `Topic.CantidadSolicitudes` (Number) ← salida `cantidadSolicitudes`
   - `Topic.SolicitudesJSON` (Text) ← salida `solicitudesJSON`

8. Agrega un **nodo de condición**:
   - **Si** `Topic.CantidadSolicitudes` es igual a `0`
   - **Entonces:** mensaje: `No tienes solicitudes abiertas actualmente. ¿Quieres crear una nueva? 😊`
   - **Si no:** continúa al siguiente paso

9. En la rama "Si no" (hay solicitudes), agrega un **nodo de mensaje** con **Adaptive Card**:
   - Haz clic en el nodo de mensaje → **+ Agregar** → **Adaptive Card**
   - Pega el JSON de la tarjeta:

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "📋 Tus solicitudes activas",
      "weight": "Bolder",
      "size": "Medium",
      "color": "Accent"
    },
    {
      "type": "TextBlock",
      "text": "Total: ${Topic.CantidadSolicitudes} solicitudes",
      "spacing": "None",
      "color": "Good"
    },
    {
      "type": "TextBlock",
      "text": "Para ver el detalle completo, abre la app SIT Solicitudes.",
      "wrap": true,
      "size": "Small",
      "color": "Default"
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "📝 Crear nueva solicitud",
      "data": {
        "action": "nueva_solicitud"
      }
    },
    {
      "type": "Action.OpenUrl",
      "title": "🔗 Ver en la app",
      "url": "https://make.powerapps.com/environments/[tu-env-id]/apps"
    }
  ]
}
```

   > Reemplaza la URL con el enlace real a tu Canvas App. Puedes obtenerlo desde make.powerapps.com → tu app → Compartir → copiar enlace.

10. Guarda el topic.

### Validación del Ejercicio 2

- [ ] El flujo `SIT — Bot Consultar Solicitudes` existe y tiene el trigger correcto
- [ ] El topic tiene al menos 4 frases de activación
- [ ] En el panel de Test: escribir "mis solicitudes" retorna la Adaptive Card con el conteo
- [ ] Si no hay solicitudes, el mensaje alternativo aparece correctamente

---

## Ejercicio 3 — Generative Answers con Knowledge Source

> **Qué vas a hacer:** Conectar el agente a tu documento de SharePoint para que responda preguntas sobre políticas de TI sin necesitar un topic específico por cada pregunta.
> **Duración:** 20 min

### Tarea 3.1 — Agregar la Knowledge Source

1. En el agente → **Conocimiento** (o **Knowledge**) → **+ Agregar** → **SharePoint**.

2. Ingresa la URL del sitio de SharePoint donde subiste `Politicas_Soporte_TI.docx`.

   Ejemplo: `https://tuempresa.sharepoint.com/sites/DocumentacionTI`

3. Haz clic en **Agregar**.

   > Copilot Studio indexa los documentos del sitio automáticamente. El proceso puede tardar unos minutos.

### Tarea 3.2 — Configurar instrucciones de sistema

1. En el agente → **Configuración** → **IA Generativa** (o **Generative AI**).

2. En **Instrucciones de sistema** agrega:

   ```
   Responde ÚNICAMENTE basándote en los documentos de la knowledge base de SIT.
   Si no encuentras la información, di exactamente:
   "No tengo información sobre ese tema en mi base de conocimiento. Te recomiendo contactar al equipo de soporte en soporte@sit.com"
   No inventes procedimientos, tiempos de respuesta ni datos de contacto.
   Responde siempre en español.
   Sé conciso — máximo 3 párrafos por respuesta.
   ```

3. Guarda.

### Tarea 3.3 — Probar las Generative Answers

En el panel de Test, prueba estas preguntas:

| Pregunta | Resultado esperado |
|---|---|
| "¿Cuánto tiempo tardan en resolver un problema crítico?" | Respuesta basada en el documento: "máximo 4 horas" |
| "¿Cómo solicito soporte?" | Respuesta del documento con el procedimiento |
| "¿Cuál es la capital de Francia?" | Mensaje: "No tengo información sobre ese tema..." |
| "¿Cuánto gana el CEO?" | Mensaje: "No tengo información sobre ese tema..." |

> Las dos últimas preguntas verifican que el **grounding** funciona — el bot no inventa respuestas.

### Validación del Ejercicio 3

- [ ] La Knowledge Source de SharePoint aparece en la lista de fuentes del agente
- [ ] Preguntas sobre tiempos de SLA retornan respuestas del documento
- [ ] Preguntas fuera de scope retornan el mensaje de "No tengo información"

---

## Ejercicio 4 — Topic: Nueva solicitud y escalamiento

> **Qué vas a hacer:** Crear el topic de creación rápida de solicitudes desde el chat y el mecanismo de escalamiento a agente humano.
> **Duración:** 20 min

### Tarea 4.1 — Topic "Crear nueva solicitud"

1. Nuevo topic: `Crear nueva solicitud`.

2. Frases de activación:
   - "quiero crear una solicitud"
   - "reportar un problema"
   - "abrir un ticket"
   - "necesito ayuda técnica"
   - "tengo un problema con mi computadora"

3. Diseña el flujo de conversación:

   **Paso 1 — Preguntar el tipo de problema:**
   - Nodo de mensaje con pregunta: `¿Cuál es el tipo de problema? 🔧`
   - Agrega **opciones rápidas** (Quick Replies):
     - Hardware
     - Software
     - Red y Conectividad
     - Accesos y Seguridad
     - Otro
   - Guarda la respuesta en `Topic.Categoria`

   **Paso 2 — Descripción:**
   - Nodo de pregunta: `Describe brevemente el problema:`
   - Tipo de respuesta: Texto largo
   - Guarda en `Topic.Descripcion`

   **Paso 3 — Confirmar y crear:**
   - Mensaje de confirmación con Adaptive Card:
     ```json
     {
       "type": "AdaptiveCard",
       "version": "1.4",
       "body": [
         {"type": "TextBlock", "text": "✅ Resumen de tu solicitud", "weight": "Bolder"},
         {"type": "FactSet", "facts": [
           {"title": "Tipo:", "value": "${Topic.Categoria}"},
           {"title": "Descripción:", "value": "${Topic.Descripcion}"}
         ]}
       ],
       "actions": [
         {"type": "Action.Submit", "title": "📤 Confirmar y enviar", "data": {"confirm": "si"}},
         {"type": "Action.Submit", "title": "✏️ Modificar", "data": {"confirm": "no"}}
       ]
     }
     ```

4. Después de la confirmación, agrega un **nodo de acción** que llame a un flujo de Power Automate para crear la solicitud en Dataverse:
   - Crea el flujo `SIT — Bot Crear Solicitud` con inputs: `categoria`, `descripcion`, `emailUsuario`
   - El flujo hace Create en `sit_Solicitud` con los datos recibidos
   - Retorna el `sit_numerosolicitud` asignado

5. Mensaje final: `¡Tu solicitud ${Topic.NumeroSolicitud} fue creada exitosamente! El equipo de soporte la revisará pronto.`

### Tarea 4.2 — Topic "Escalar a agente humano"

1. Nuevo topic: `Escalar a agente humano`.

2. Frases de activación:
   - "quiero hablar con una persona"
   - "agente humano"
   - "necesito ayuda de alguien"
   - "no puedo resolver esto"
   - "hablar con soporte"

3. Diseño del topic:
   - Mensaje: `Entiendo, te conectaré con un agente del equipo de soporte. Un momento...`
   - Agrega el nodo nativo **"Escalar a agente"** (Transfer to agent) disponible en el menú de nodos
   - En el campo de **contexto de escalamiento**, agrega la variable con el resumen:
     ```
     Usuario: ${System.User.DisplayName} (${System.User.PrincipalName})
     Solicitud: ${Topic.NumeroSolicitud}
     Problema reportado: ${Topic.Descripcion}
     ```

   > El nodo de escalamiento termina la sesión del bot y, si hay Omnichannel configurado, transfiere la conversación con historial al agente humano.

### Validación del Ejercicio 4

- [ ] El topic de nueva solicitud hace las preguntas y muestra la Adaptive Card de confirmación
- [ ] El flujo de creación crea el registro en Dataverse y retorna el número
- [ ] El topic de escalamiento tiene el nodo "Transfer to agent" configurado

---

## Ejercicio 5 — Publicar en Teams y probar

> **Qué vas a hacer:** Publicar el agente en el canal de Teams y verificar que el SSO funciona correctamente en el chat de Teams.
> **Duración:** 15 min

### Tarea 5.1 — Publicar el agente

1. En Copilot Studio → botón **Publicar** (esquina superior derecha o en el menú **Configuración** → **Publicar**).

2. Haz clic en **Publicar**.

   > Cada vez que hagas cambios en topics o configuración, debes publicar para que los cambios lleguen al canal de Teams.

### Tarea 5.2 — Agregar el canal de Teams

1. En Copilot Studio → **Configuración** → **Canales** → **Microsoft Teams**.

2. Haz clic en **Agregar a Teams**.

3. Configura:
   - **Nombre de la aplicación en Teams:** `SIT Soporte TI`
   - **Descripción corta:** `Tu asistente de soporte técnico`
   - Descarga el paquete de la app de Teams (`.zip`)

4. Instala la app en Teams:
   - Abre Microsoft Teams → **Aplicaciones** → **Administrar las aplicaciones** → **Subir una aplicación personalizada**
   - Sube el `.zip` descargado
   - Haz clic en **Agregar**

### Tarea 5.3 — Probar en Teams

1. Abre el chat con `SIT Soporte TI` en Teams.

2. Prueba estos mensajes:

   | Mensaje | Resultado esperado |
   |---|---|
   | `hola` | Saludo con tu nombre (SSO funcionando) |
   | `mis solicitudes` | Adaptive Card con tus solicitudes de Dataverse |
   | `cuánto tardan en resolver problemas críticos` | Respuesta del documento de SharePoint |
   | `quiero crear una solicitud` | Inicia el flujo de creación con opciones |
   | `hablar con alguien` | Mensaje de escalamiento |

### Validación del Ejercicio 5

- [ ] El agente está publicado y disponible en Teams
- [ ] El bot saluda al usuario por nombre (SSO confirmado)
- [ ] La Adaptive Card de solicitudes renderiza correctamente en Teams
- [ ] Generative Answers responde preguntas del documento

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| SSO pide credenciales cada vez | El Redirect URI no coincide con `https://token.botframework.com/.auth/web/redirect` | Verifica en el App Registration → Authentication que la URI está exactamente igual |
| `System.User.PrincipalName` está vacío | La autenticación SSO no está configurada o el usuario no está autenticado | Verifica en Configuración → Seguridad → Autenticación que está activa |
| Generative Answers alucina | El documento de SharePoint tiene información ambigua o el índice no se completó | Espera 10-15 min después de agregar la Knowledge Source; los documentos se indexan asíncronamente |
| Adaptive Card no muestra la variable | La sintaxis `${Topic.Variable}` es sensible a mayúsculas | Verifica que el nombre de la variable en el JSON coincide exactamente con el nombre en el topic |
| La app de Teams muestra error "No autorizado" | El App Registration no tiene los permisos correctos o falta el consentimiento | En Entra ID → App Registration → Permisos de API → Conceder consentimiento de administrador |
| El flujo de PA falla al consultar Dataverse | El filtro OData tiene la columna incorrecta | Verifica el nombre exacto de la columna del Lookup con el email — puede variar según cómo creaste la relación |

---

## Checklist final

- [ ] Agente "SIT Soporte TI" creado con instrucciones de sistema en español
- [ ] App Registration configurado con Redirect URI correcto y permisos concedidos
- [ ] SSO activo: el bot muestra el nombre del usuario en el panel de Test
- [ ] Topic "Consultar mis solicitudes" retorna datos de Dataverse vía Power Automate
- [ ] Adaptive Card renderiza con botones accionables
- [ ] Knowledge Source de SharePoint indexada con el documento de políticas
- [ ] Generative Answers rechaza preguntas fuera de scope
- [ ] Topic "Crear nueva solicitud" crea un registro en `sit_Solicitud`
- [ ] Topic "Escalar a agente" tiene el nodo Transfer to agent
- [ ] Agente publicado y accesible en Microsoft Teams
- [ ] SSO funciona en Teams sin pedir credenciales adicionales

---

## Reto adicional

**Reto básico:** Agrega un topic "Mis solicitudes críticas" que consulta específicamente las solicitudes con Prioridad = Crítica del usuario actual y las lista en la Adaptive Card con un emoji de alerta rojo 🔴 por cada una.

**Reto intermedio:** Implementa la **Generative Orchestration** en el agente: actívala en Configuración → Generative Orchestration. Agrega descripciones claras a cada topic. Prueba que el bot selecciona el topic correcto para frases ambiguas como "tengo un problema grave" (debe activar "Crear nueva solicitud", no "Escalamiento").

**Reto avanzado:** Implementa el flujo **On-Behalf-Of (OBO)**: el bot recibe el token del usuario autenticado y lo usa para llamar directamente a la API de Dataverse (`sit_solicitud`) como ese usuario (no como una service account). Requiere configuración adicional del App Registration con `Expose an API` y un flujo que use el token para llamadas autenticadas. El resultado: las solicitudes se crean en Dataverse como creadas por el usuario real, no por el bot.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre **SSO** y pedirle al usuario que haga login en el bot?
2. ¿Qué es el **grounding** en el contexto de Generative Answers y por qué es importante?
3. ¿Qué pasa con la conversación cuando se ejecuta el nodo **"Escalar a agente"**?
4. ¿Por qué las variables del bot usan la sintaxis `${Topic.Variable}` en el JSON de la Adaptive Card?

---

## Limpieza del laboratorio

> Para eliminar el agente: Copilot Studio → selecciona el agente → **Configuración** → **Detalles del agente** → scroll abajo → **Eliminar agente**.

> Para desinstalar de Teams: Teams → Aplicaciones → SIT Soporte TI → Desinstalar.

---

## Siguiente laboratorio recomendado

➡️ **Lab 32 — CoE Starter Kit: Gobernanza a Escala del Tenant**

**Por qué ir ahí:** Con el agente del Lab 22 en producción y la solución SIT desplegada en múltiples ambientes, el Lab 32 te enseña a monitorear y gobernar todo el ecosistema de apps, flujos y agentes del tenant usando el Center of Excellence Starter Kit.

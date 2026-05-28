# COPILOT STUDIO — Guía Completa de 0 a Experto
**De principiante a agente de producción** | Referencia técnica detallada

---

## 1. Conceptos Fundamentales

### ¿Qué es Copilot Studio?
Copilot Studio (antes Power Virtual Agents) es la plataforma de Microsoft para crear agentes conversacionales (chatbots) sin código o con poco código. Integra LLMs (Modelos de Lenguaje Grande) con lógica de negocio estructurada.

### Arquitectura de un agente
```
[Usuario] 
    ↕ mensaje de texto / voz
[Canal] — Teams, Web, WhatsApp, SMS, Email, Omnichannel
    ↕
[Copilot Studio — Motor de conversación]
    ├── NLU (Natural Language Understanding) → interpreta la intención
    ├── Topic Matching → identifica el topic a ejecutar
    ├── LLM Orchestration → si Generative AI habilitado
    ├── Topic Execution → ejecuta el flujo del topic
    │     ├── Variables (Topic, Global, System)
    │     ├── Condiciones (if/else)
    │     ├── Acciones (Power Automate, HTTP, Knowledge)
    │     └── Preguntas (slot filling)
    └── Respuesta al usuario
```

### Tipos de respuestas
- **Topic estructurado:** responde exactamente lo programado en el topic
- **Generative Answers (KB):** usa LLM para responder desde documentos de Knowledge Base
- **Generative Orchestration:** el LLM decide qué topic activar y cómo combinar respuestas

---

## 2. Crear el Primer Agente

### Paso a paso
1. Ir a copilotstudio.microsoft.com
2. Crear → Nuevo agente
3. Configuración inicial:
   ```
   Nombre: Asistente [Empresa] - Soporte IT
   Descripción: Asistente para empleados con preguntas de soporte técnico
   Instrucciones de sistema:
     Eres el asistente virtual de soporte IT de [Empresa].
     Respondes en español.
     Eres amigable y conciso — máximo 3 párrafos por respuesta.
     Si no tienes la información, ofreces escalar a un agente humano.
     No inventes datos ni procedimientos que no estén en la Knowledge Base.
   ```
4. Idioma: Español
5. Crear

### Configuración esencial post-creación
- **Canales:** determina dónde estará disponible el bot
- **Autenticación:** Sin auth (público), Solo Microsoft (empleados con SSO), Manual (OAuth configurable)
- **Seguridad:** configurar si el bot puede ser encontrado en el directorio de Teams
- **Generative AI:** activar y configurar Knowledge Sources

---

## 3. Topics — Unidad de Conversación

### Anatomía de un topic
```
Topic: "Consultar Estado de Solicitud"
│
├── Trigger Phrases (8-15 frases de activación)
│     "¿cómo va mi solicitud?"
│     "estado de mi ticket"
│     "quiero saber mi caso"
│     ...
│
├── Nodo: Mensaje de bienvenida
│     "Claro, voy a revisar tu solicitud."
│
├── Nodo: Pregunta → Variable: Topic.NumeroSolicitud
│     "¿Cuál es el número? (ej: SOL-00123)"
│
├── Nodo: Acción → Power Automate
│     Input: Topic.NumeroSolicitud
│     Output: Topic.Estado, Topic.FechaActualizacion
│
├── Nodo: Condición
│     Si Topic.Estado está vacío → "No encontré esa solicitud"
│     De lo contrario → mostrar resultado
│
└── Nodo: Fin de conversación
```

### Tipos de nodos en un topic
| Nodo | Descripción |
|------|-------------|
| **Mensaje** | Texto, imagen, video, Adaptive Card, opciones rápidas |
| **Pregunta** | Solicita información al usuario y guarda en variable |
| **Condición** | Bifurcación if/else basada en variables |
| **Acción** | Llama a Power Automate, conector, o Knowledge Source |
| **Redirección** | Salta a otro topic |
| **Fin de conversación** | Cierra el topic actual |
| **Escalar a agente** | Transfiere a agente humano con contexto |
| **Generative Answers** | Responde desde KB sin topic explícito |
| **Variable** | Gestionar variables (establecer valor) |
| **Send HTTP request** | Llamar directamente una API REST (sin Power Automate) |

### Trigger Phrases — mejores prácticas
```
✅ BUENAS trigger phrases (variadas y naturales):
  - "¿cómo va mi solicitud?"
  - "estado de mi ticket"
  - "quiero saber mi caso"
  - "revisar solicitud número"
  - "¿ya resolvieron mi problema?"
  - "buscar mi ticket"
  - "solicitud pendiente"
  - "¿cuándo resuelven mi caso?"
  - "mi solicitud no ha sido atendida"
  - "consultar estado"

❌ MALAS trigger phrases (muy similares entre sí):
  - "ver estado de solicitud"
  - "consultar estado de solicitud"  ← demasiado similar a la anterior
  - "estado de mi solicitud"         ← ya cubierto
```

---

## 4. Variables y Entidades

### Tipos de variables
```
Topic.Variable    → Scope: solo dentro del topic actual. Se resetea al salir.
Global.Variable   → Scope: toda la sesión. Persiste entre topics.
System.Variable   → Proporcionadas por el sistema. Solo lectura en la mayoría.

Variables de sistema útiles:
  System.User.PrincipalName     → email del usuario (cuando SSO está activo)
  System.User.DisplayName       → nombre del usuario
  System.Conversation.Id        → ID único de la conversación
  System.LastMessage.Text       → texto del último mensaje del usuario
  System.Bot.Name               → nombre del bot
```

### Establecer variables
```
// Desde un nodo de Pregunta → automático al responder
// Desde un nodo de Acción (Power Automate output)
// Desde un nodo "Variable" → Set variable:
  Global.NombreCliente = Topic.RespuestaCliente

// Usar variable en un mensaje:
  "Tu solicitud ${Topic.NumeroSolicitud} está en estado: ${Topic.Estado}"
```

### Entidades — tipos de datos que el bot entiende

**Entidades de sistema (pre-construidas):**
- `Número` — detecta números en el texto ("ciento cincuenta" → 150)
- `Fecha y hora` — "mañana", "el lunes", "15 de marzo"
- `Email` — formato de email
- `Número de teléfono`
- `Geografía` — ciudades, países
- `Moneda` — "$500", "quinientos dólares"
- `Porcentaje`
- `Boolean` — sí/no, verdadero/falso

**Entidades personalizadas — Lista cerrada:**
```
Nombre: CategoríaIT
Valores:
  Hardware       → sinónimos: computadora, equipo, impresora, teclado, mouse
  Software       → sinónimos: aplicación, programa, app, sistema, instalación
  Red            → sinónimos: internet, wifi, conexión, vpn, red
  Accesos        → sinónimos: contraseña, password, usuario, cuenta, login, pin
  Telefonía      → sinónimos: teléfono, celular, extensión, móvil
```

**Slot Filling — preguntar automáticamente:**
```
Cuando el topic necesita la variable Topic.Categoria (entidad CategoríaIT)
y el usuario no la proporcionó en el mensaje inicial:
→ El bot pregunta automáticamente: "¿Cuál es la categoría del problema?"
→ Si el usuario responde "mi impresora no enciende" 
→ El bot detecta "Hardware" y continúa sin preguntar nuevamente
```

---

## 5. Integración con Power Automate

### Crear flujo para el bot
```
Trigger: "When an agent calls a flow" (Copilot Studio trigger)

Inputs definibles en el trigger:
  - numeroSolicitud (Text)
  - emailUsuario (Text)
  - prioridad (Text)

Lógica del flujo:
  List rows (Dataverse) — filtrar por número de solicitud
  Condición: si encontró resultados
    TRUE: preparar variables de respuesta
    FALSE: respuesta vacía

Outputs (respuesta al bot):
  - estadoSolicitud (Text)
  - fechaActualizacion (Text)
  - nombreAsignado (Text)
  - existeRegistro (Boolean)
```

### Usar el flujo en el topic
```
Nodo: Acción → Power Automate → seleccionar flujo
Inputs al flujo:
  numeroSolicitud → Topic.NumeroSolicitud
  emailUsuario → System.User.PrincipalName

Outputs del flujo (guardar en variables):
  estadoSolicitud → Topic.Estado
  fechaActualizacion → Topic.FechaActualizacion
  existeRegistro → Topic.Encontrado

Nodo: Condición
  Si Topic.Encontrado es false:
    → Mensaje: "No encontré una solicitud con ese número."
    → Redireccionar al nodo de pregunta para intentar de nuevo
  De lo contrario:
    → Mensaje con los datos
```

### Llamadas HTTP directas (sin Power Automate)
```
Nodo: Send HTTP request (preview feature)
Method: GET
URL: https://api.empresa.com/solicitudes/${Topic.NumeroSolicitud}
Headers:
  Authorization: Bearer ${Global.APIToken}
  Accept: application/json

Response → guardar en: Topic.RespuestaAPI (tipo: Record)

Acceder a campos de la respuesta:
  Topic.RespuestaAPI.estado
  Topic.RespuestaAPI.fecha
```

---

## 6. Generative AI y Knowledge Sources

### Configurar Knowledge Sources
```
Tipos soportados:
  ✅ SharePoint Sites     → páginas y documentos del sitio
  ✅ Sitios web públicos  → URL del sitio, el bot indexa las páginas
  ✅ Azure Blob Storage   → archivos PDF, Word, texto
  ✅ Dataverse KB         → artículos de Knowledge Base de D365 Customer Service
  ✅ Subir archivos       → hasta 3 archivos directamente

Configurar:
1. Copilot Studio → tu agente → Knowledge
2. Agregar → tipo de fuente → URL o seleccionar
3. El bot indexa automáticamente (puede tardar horas para sitios grandes)
4. Probar con preguntas desde la KB
```

### System Prompt — controlar el comportamiento del LLM
```
El system prompt define cómo se comporta el LLM para respuestas generativas.
Ir a: Settings → Generative AI → "Instructions"

Ejemplo de system prompt efectivo:
  Eres el asistente virtual de soporte técnico de [Empresa].
  
  REGLAS ESTRICTAS QUE DEBES SEGUIR SIEMPRE:
  1. Solo responde temas de Power Platform, Office 365 y sistemas internos de [Empresa]
  2. Basa TODAS tus respuestas en la Knowledge Base proporcionada
  3. Si no encuentras la información, di: "No tengo información verificada sobre ese tema. 
     ¿Te puedo conectar con el equipo de soporte?"
  4. NUNCA inventes procedimientos, URLs, datos de contacto o pasos técnicos
  5. Cita la fuente cuando sea posible: "Según el artículo [Nombre del documento]..."
  6. Respuestas de máximo 3 párrafos o 5 puntos de lista
  7. Tono: profesional pero amigable. Usa tú, no usted
  8. Si el usuario pregunta algo sobre el negocio (ventas, clientes, finanzas), 
     redirige: "Esa consulta no es de mi dominio. Para información de [área], 
     contacta a [email]"
```

### Generative Orchestration
Con Generative Orchestration habilitado, el LLM decide qué topic ejecutar:
```
Sin Generative Orchestration:
  Usuario: "¿cómo reseteo mi contraseña?"
  → Match con trigger phrases del topic "Reset Password" → ejecutar topic

Con Generative Orchestration:
  Usuario: "Ayer actualicé Windows y ahora no puedo entrar al sistema"
  → El LLM analiza la intención combinada (Windows update + acceso)
  → Puede decidir ejecutar "Reset Password" + añadir info de "Windows Update Issues"
  → O generar una respuesta combinada desde la KB
```

---

## 7. Autenticación y SSO

### Modos de autenticación

**Sin autenticación (público):**
- Cualquier persona puede usar el bot
- No conoce la identidad del usuario
- Apropiado para bots en sitios web públicos

**Solo Microsoft (empleados):**
- Integrado con Azure AD del tenant
- SSO automático en Teams — el bot conoce la identidad sin pedir login
- Variables de sistema disponibles: System.User.PrincipalName, System.User.DisplayName

**Autenticación manual (OAuth 2.0):**
- Configurar con cualquier identity provider
- El bot puede usar el token para llamar APIs en nombre del usuario

### Configurar SSO con Azure AD
```
1. Azure AD → App Registrations → Nueva
   Nombre: Copilot Studio - [NombreBot]
   Redirect URI: https://token.botframework.com/.auth/web/redirect
   API Permissions: User.Read, openid, profile, offline_access
   Crear Client Secret

2. Copilot Studio → Settings → Security → Authentication
   Mode: Azure Active Directory v2 (Manual)
   Client ID: [ID de la App Registration]
   Client Secret: [secreto creado]
   Tenant ID: [ID del tenant Azure AD]
   Scopes: profile openid

3. Verificar: en un topic, usar System.User.PrincipalName
   → Debe mostrar el email del usuario sin pedir login en Teams
```

### Usar el token del usuario para llamadas API
```
Cuando SSO está configurado, el usuario tiene un token disponible.
Para usar ese token en Power Automate:
  - El flujo recibe el token como input desde el bot
  - Usar el token en el header Authorization: Bearer ${token}
  - Permite llamar APIs en nombre del usuario (OBO flow)
```

---

## 8. Canales de Publicación

### Microsoft Teams
```
1. Publish → Microsoft Teams → Add to Teams
2. Configurar:
   - Nombre del bot en Teams
   - Descripción corta (visible en el directorio)
   - Icono (PNG 192x192 o SVG)
3. Opciones de disponibilidad:
   - Solo yo (prueba)
   - Tu organización (deployment para toda la empresa)
   - Aprobación requerida del admin de Teams
4. Una vez aprobado, aparece como app en Teams
```

### Web Chat (iFrame para sitios web)
```html
<!-- Copilot Studio genera este snippet para incrustar en cualquier web -->
<iframe
  src="https://web.powerva.microsoft.com/environments/ENV_ID/bots/BOT_ID/webchat"
  style="width: 400px; height: 600px; border: none;"
  allow="microphone;">
</iframe>

<!-- O usando el SDK de DirectLine para mayor control: -->
<script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
<div id="webchat" role="main"></div>
<script>
  fetch('https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=BOT_ID')
    .then(r => r.json())
    .then(({ token }) => {
      window.WebChat.renderWebChat(
        {
          directLine: window.WebChat.createDirectLine({ token }),
          locale: 'es-ES',
          styleOptions: {
            botAvatarImage: 'https://empresa.com/bot-avatar.png',
            accent: '#0078d4'
          }
        },
        document.getElementById('webchat')
      );
    });
</script>
```

### Power Pages (portal)
```
1. En Power Pages Studio → agregar componente → Chatbot
2. Seleccionar el agente de Copilot Studio
3. El bot aparece como widget flotante en todas las páginas del portal
4. Los usuarios autenticados en el portal se identifican automáticamente
   (si el bot tiene autenticación configurada)
```

### Omnichannel for Customer Service
```
Configurar el bot como primer punto de contacto:
1. D365 Customer Service → Omnichannel → Bot → Nuevo
2. Seleccionar el agente de Copilot Studio
3. Configurar workstream para que el bot responda primero
4. Si el bot no puede resolver → escalar a agente humano
5. El agente humano recibe el contexto completo de la conversación

Topic de escalamiento:
  Nodo: Escalar a agente humano
  Mensaje pre-escala: "Te conectaré con un agente. Un momento."
  Context variables para el agente:
    - Resumen de la conversación
    - Nombre y email del usuario
    - Tipo de problema identificado
```

---

## 9. Adaptive Cards

### Estructura de una Adaptive Card en Copilot Studio
```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "📋 Estado de tu Solicitud",
      "weight": "Bolder",
      "size": "Medium"
    },
    {
      "type": "FactSet",
      "facts": [
        {"title": "Número:", "value": "${Topic.NumeroSolicitud}"},
        {"title": "Estado:", "value": "${Topic.Estado}"},
        {"title": "Asignado a:", "value": "${Topic.NombreAsignado}"},
        {"title": "Última actualización:", "value": "${Topic.FechaActualizacion}"}
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "✅ Marcar como revisado",
      "data": {"accion": "marcar_revisado", "id": "${Topic.SolicitudId}"}
    },
    {
      "type": "Action.OpenUrl",
      "title": "🔗 Ver en el sistema",
      "url": "https://tuorg.crm.dynamics.com/main.aspx?id=${Topic.SolicitudId}"
    },
    {
      "type": "Action.Submit",
      "title": "📞 Escalar a agente",
      "data": {"accion": "escalar"}
    }
  ]
}
```

### Usar en el topic
```
Nodo: Mensaje → Seleccionar tipo: Adaptive Card
→ Pegar el JSON de la Adaptive Card
→ Las variables ${Topic.X} se resuelven automáticamente en tiempo de ejecución
```

### Manejar respuesta de Adaptive Card
```
Cuando el usuario hace clic en un botón de tipo Action.Submit:
  - El valor de "data" se envía como mensaje al bot
  - Copilot Studio puede tener un topic que responde a esa acción

Topic: "Respuesta de Card"
Trigger: [automático cuando el sistema detecta respuesta de card]
  Condición: System.Activity.Value.accion == "marcar_revisado"
    → Acción: Power Automate → MarcarSolicitudRevisada(Topic.SolicitudId)
    → Mensaje: "✅ Solicitud marcada como revisada."
  Condición: System.Activity.Value.accion == "escalar"
    → Redireccionar a topic "Escalar a agente humano"
```

---

## 10. Analytics y Mejora Continua

### Métricas clave (Copilot Studio → Analytics)

**Tasa de resolución (objetivo ≥ 70%):**
```
Definición: % de sesiones donde el usuario no escaló a agente humano
           y el bot cerró la conversación con un topic terminal

Si < 70%: analizar qué topics tienen más escalamientos
Acción: mejorar trigger phrases de esos topics o agregar más Knowledge Sources
```

**Tasa de abandono (objetivo ≤ 15%):**
```
Definición: % de sesiones donde el usuario se fue sin resolución ni escalamiento

Causas comunes:
  - El bot no activó ningún topic (trigger phrases insuficientes)
  - El bot activó el topic equivocado
  - La respuesta no fue útil (el usuario decidió no continuar)

Acción: revisar el reporte de "Sesiones sin resolución" y ver los mensajes
```

**Topics más activos:**
```
Identifica qué preguntas hacen más los usuarios.
Si el top 1 es "Hablar con un humano" → el bot no está resolviendo suficiente
Si hay topics con 0 activaciones → revisar trigger phrases o eliminar el topic
```

### Plan de mejora mensual
```markdown
## Revisión mensual del agente (1 hora)

1. Revisar Analytics → Sesiones → filtrar por "Escalado a agente humano"
   → Leer los 10 últimos transcripts de escalamiento
   → Identificar: ¿por qué el bot no pudo resolver? ¿Falta un topic?

2. Revisar "Preguntas sin respuesta" en Analytics
   → Estas son frases que el bot no entendió
   → Crear o mejorar triggers para las 5 más frecuentes

3. Revisar Knowledge Sources
   → ¿Hay documentos desactualizados?
   → ¿Se agregaron nuevos procedimientos que el bot debería conocer?
   → Actualizar SharePoint/documentos → el bot re-indexa automáticamente

4. Probar los 5 topics principales con variaciones nuevas
   → Asegurar que el bot activa el topic correcto

5. Actualizar las métricas en el dashboard de seguimiento:
   | Mes | Resolución% | Abandono% | Sesiones totales |
   |-----|------------|-----------|-----------------|
   | Enero | 65% | 18% | 1,240 |
   | Febrero | 71% | 14% | 1,580 |
```

---

## 11. Integración con D365 Customer Service (Omnichannel)

### Arquitectura completa bot + agentes humanos
```
[Usuario en Teams o Portal]
    ↓ primera interacción
[Bot Copilot Studio]
    ├── 70% de casos: bot resuelve → cierre automático
    └── 30% de casos: escalamiento a agente humano
            ↓
    [Cola de trabajo en D365 Customer Service]
            ↓
    [Agente humano recibe en Customer Service Hub]
        - Transcript completo de la conversación con el bot
        - Variables capturadas: nombre, email, tipo de problema
        - Historial del cliente de Dataverse (sus casos anteriores)
            ↓
    [Agente resuelve y cierra el caso]
            ↓
    [CSAT automático enviado al usuario]
```

### Configurar la cola de escalamiento
```
1. D365 Customer Service Admin → Workstreams → Nuevo
2. Tipo: Mensajería (chat, Teams, WhatsApp, etc.)
3. Bot: seleccionar el agente de Copilot Studio como "primer respondedor"
4. Si el bot escala → Regla de enrutamiento hacia Cola_Soporte_General
5. En Copilot Studio, configurar el tema de escalamiento:
   - Nodo: Escalar a agente humano
   - Transferir con contexto:
     Topic.ResumenConversacion → campo "Transcript" del agente
     System.User.DisplayName → nombre del usuario
     Topic.TipoProblema → categoría detectada
```

---

## 12. Casos de Uso por Industria

### Soporte IT (más común)
```
Topics principales:
  - Reset de contraseña → integración con Azure AD (resetear vía Graph API)
  - Estado de solicitud → consulta a Dataverse
  - Crear ticket nuevo → crear caso en D365 Customer Service
  - Buscar en la KB → Generative Answers desde SharePoint IT
  - Solicitud de hardware → formulario Power Pages desde el bot
```

### RRHH
```
Topics principales:
  - Días de vacaciones disponibles → consulta al HRIS vía API
  - Proceso de solicitud de vacaciones → guía + link al formulario
  - Políticas de la empresa → Generative Answers desde el manual de empleados
  - Nómina y pagos → integración con sistema de nómina
  - Onboarding → guía de pasos para empleados nuevos
```

### Customer Service (externo)
```
Topics principales:
  - Estado de mi pedido → integración con WMS/ERP
  - Cómo realizar una devolución → guía + iniciar proceso
  - Factura duplicada → crear caso de soporte
  - Cambio de datos personales → formulario Power Pages
  - Preguntas frecuentes → Generative Answers desde la KB pública
```

### Ventas (interno)
```
Topics principales:
  - Mi pipeline actual → consulta a D365 Sales (con SSO)
  - Crear nueva oportunidad → flujo guiado que crea el registro
  - Buscar producto y precio → catálogo en tiempo real
  - Generar propuesta → disparar generación de documento
  - KPIs del mes → consulta con datos de Power BI
```

---
moduleId: 22
title: "Copilot Studio Avanzado"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 9
slug: "copilot-studio-avanzado"
---
### 🎯 Objetivo
Implementar agentes conversacionales de producción con SSO integrado a Azure AD, orquestación multi-agente, respuestas generativas con grounding en documentos corporativos, integración con Knowledge Base de D365, y métricas de calidad.

### 📖 Conceptos Clave
- **Generative Orchestration:** modo avanzado de Copilot Studio donde el LLM decide dinámicamente qué topic activar basado en el contexto completo de la conversación, en lugar de depender exclusivamente de trigger phrases exactas. Permite conversaciones más naturales donde el usuario puede expresarse de múltiples maneras y el agente entiende la intención. Se activa en Configuración → Generative Orchestration y requiere que los topics tengan descripciones claras para que el LLM pueda seleccionarlos correctamente.
- **Knowledge Sources:** fuentes de conocimiento que el agente consulta para generar respuestas con Generative Answers. Tipos soportados: sitios SharePoint (con sus documentos y páginas), URLs de sitios web públicos (el bot las indexa automáticamente), archivos subidos directamente, y la Knowledge Base de D365 Customer Service. Cada fuente puede tener instrucciones de uso específicas y un nivel de confianza mínimo para mostrar la respuesta.
- **Grounding:** proceso de anclar las respuestas generativas del LLM a fuentes de información específicas y verificables en lugar de responder desde el conocimiento general del modelo. Un agente "anclado" cita la fuente de su respuesta y rechaza responder sobre temas no cubiertos en sus Knowledge Sources. Evita alucinaciones — el riesgo de que el modelo invente procedimientos, nombres o datos de contacto inexistentes.
- **SSO (Single Sign-On):** integración de Copilot Studio con Azure AD para que el bot reconozca al usuario autenticado en el canal (Teams, portal) sin pedirle credenciales adicionales. El bot recibe el token del usuario y puede usarlo para llamar APIs en su nombre (On-Behalf-Of). Resultado: el bot saluda al usuario por nombre y consulta sus datos específicos desde el primer mensaje.
- **Microsoft Entra ID Authentication en Copilot Studio:** configuración de OAuth 2.0 con Microsoft Entra ID (antes Azure Active Directory) para que el agente pueda hacer llamadas autenticadas a APIs que requieren identidad del usuario. El flujo OBO (On-Behalf-Of) permite que el bot, con el token del usuario, llame a APIs de Dataverse o Microsoft Graph como si fuera el usuario mismo. Se configura en Copilot Studio → Configuración → Seguridad → Autenticación → Microsoft Entra ID.
- **Adaptive Cards:** formato de tarjetas interactivas de Microsoft Teams y otros canales que permite mostrar información estructurada con imágenes, tablas, FactSets y botones accionables. En Copilot Studio se insertan en los nodos de mensaje con el editor visual o importando JSON. Las variables del topic se referencian con la sintaxis `${Topic.NombreVariable}`. Los botones pueden ejecutar acciones (Submit, OpenUrl) que el topic puede manejar.
- **Multi-turn conversations:** capacidad del agente de mantener contexto a lo largo de múltiples intercambios en la misma sesión. Las variables declaradas en un topic persisten durante toda la conversación mientras el topic esté activo. Permite implementar wizards de múltiples preguntas donde cada respuesta del usuario enriquece el contexto para la siguiente acción — por ejemplo, recopilar tipo de solicitud, prioridad y descripción antes de crearla en Dataverse.
- **Escalamiento a Omnichannel:** acción nativa de Copilot Studio que transfiere la conversación activa a un agente humano en D365 Customer Service Omnichannel, incluyendo el historial completo de la conversación como contexto. El agente humano recibe la transcripción y puede continuar desde donde el bot dejó. Se configura en Omnichannel Admin Center → Canales → Bot → seleccionar el agente de Copilot Studio.
- **Analytics de Copilot Studio:** panel de métricas en tiempo real con indicadores clave: tasa de resolución (% de sesiones que el bot resolvió sin escalar — objetivo ≥ 70%), tasa de abandono (% que terminó la conversación sin completar su objetivo — objetivo ≤ 15%), temas más activados (identifica los topics más usados), y sesiones con escalamiento (patrones que revelan gaps en la cobertura del bot). Datos disponibles en Analytics → Summary con ventanas de 7, 30 y 90 días.
- **Custom Prompt Instructions:** texto de instrucciones de sistema enviado al LLM que controla el comportamiento del agente: tono (formal/informal), idioma de respuesta, limitaciones de scope (responder solo sobre temas X), formato de respuesta (máximo N párrafos, usar bullet points), y qué hacer cuando no tiene información. Ejemplo: `"Eres el asistente de RR.HH. de la empresa. Responde solo en español. Si no tienes la información, di exactamente: 'No tengo información sobre ese tema.'"` Se configura en Copilot Studio → Generative AI → Custom Instructions.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 22.1: Configurar SSO con Azure AD
1. En Azure AD → App Registrations → Nueva (para el bot)
2. Configurar:
    - Redirect URI: `https://token.botframework.com/.auth/web/redirect`
    - API permissions: `User.Read`, `Mail.Send`, `offline_access`, `openid`
    - Crear client secret

3. En Copilot Studio → Configuración → Seguridad → Autenticación
4. Seleccionar: Microsoft Entra ID (opción "Azure Active Directory v2" en versiones anteriores de la UI)
5. Ingresar: Client ID, Client Secret, Tenant ID
6. Alcances: `profile openid`
7. Guardar y probar: el bot debe salud al usuario por nombre sin pedirle que se loguee

#### Actividad 22.2: Usar identidad del usuario en flujos
1. En un Topic, agregar nodo: "Call an action" → Power Automate
2. El flujo puede recibir: `System.User.PrincipalName` (email del usuario SSO)
3. En el flujo:
   ```
   // Usar el email del usuario para consultar sus registros específicos
   List rows (Dataverse)
   Filter: sit_responsable/internalemailaddress eq '@{triggerBody()?['text']}'
   ```

4. Retornar datos personalizados al bot

#### Actividad 22.3: Adaptive Cards en Teams
1. En un Topic → Nodo de mensaje → Adaptive Card
2. Usar el editor de Adaptive Cards o importar JSON:
   ```json
   {
     "type": "AdaptiveCard",
     "version": "1.4",
     "body": [
       {
         "type": "TextBlock",
         "text": "📋 Resumen de tu solicitud",
         "weight": "Bolder",
         "size": "Medium"
       },
       {
         "type": "FactSet",
         "facts": [
           {"title": "Número:", "value": "${Topic.NumeroSolicitud}"},
           {"title": "Estado:", "value": "${Topic.EstadoSolicitud}"},
           {"title": "Prioridad:", "value": "${Topic.Prioridad}"},
           {"title": "Asignado a:", "value": "${Topic.Asignado}"}
         ]
       }
     ],
     "actions": [
       {
         "type": "Action.Submit",
         "title": "✅ Marcar como revisado",
         "data": {"action": "marcar_revisado", "id": "${Topic.SolicitudId}"}
       },
       {
         "type": "Action.OpenUrl",
         "title": "Ver en el sistema",
         "url": "https://tuorg.crm.dynamics.com/main.aspx?id=${Topic.SolicitudId}"
       }
     ]
   }
   ```

3. El bot renderiza la tarjeta en Teams con los datos y botones accionables

#### Actividad 22.4: Generative Answers con Knowledge Sources
1. Agregar Knowledge Source → SharePoint
2. URL: `https://tuempresa.sharepoint.com/sites/documentacion-it`
3. Instrucciones del sistema:
   ```
   Eres el asistente de soporte IT de SIT Consulting. 
   Responde ÚNICAMENTE basándote en los documentos de la knowledge base.
   Si no encuentras la información, di exactamente: "No tengo información sobre ese tema. Te recomiendo contactar al equipo de soporte en soporte@empresa.com"
   No inventes procedimientos ni datos de contacto.
   Responde siempre en español.
   Sé conciso — máximo 3 párrafos.
   ```

4. Probar con preguntas de los documentos y verificar que cita la fuente
5. Probar con preguntas fuera del scope y verificar que responde apropiadamente

#### Actividad 22.5: Escalamiento a agente humano
1. Crear topic: `Escalar a Agente Humano`
2. Trigger phrases: "hablar con persona", "agente humano", "quiero hablar con alguien"
3. Nodo de mensaje: "Entiendo que deseas hablar con uno de nuestros agentes. Te conectaré en un momento."
4. Nodo: Escalar a agente humano (nodo nativo de Copilot Studio)
    - Contexto de escalamiento: resumen de la conversación

5. Configurar integración con Omnichannel for Customer Service:
    - Admin Center → Canales → Bot → Configurar escalamiento
    - Queue de escalamiento: `Cola_Chat_General`

#### Actividad 22.6: Analytics y mejora continua
1. Copilot Studio → Analytics → Resumen
2. Revisar métricas clave:
    - **Tasa de resolución:** % de conversaciones que el bot resolvió sin escalar (objetivo ≥ 70%)
    - **Tasa de abandono:** % que se fue sin obtener respuesta (objetivo ≤ 15%)
    - **Topics más activos:** identificar cuáles topics necesitan más trigger phrases
    - **Sesiones con escalamiento:** identificar patterns para crear nuevos topics

3. Con base en Analytics → mejorar trigger phrases de los 3 topics con menor tasa de activación

### 💼 Caso Real de Negocio
**Empresa:** Banco con 15,000 empleados  
**Problema:** El chatbot anterior respondía preguntas genéricas sin saber quién era el usuario. Un empleado preguntaba "¿cuántos días de vacaciones tengo?" y el bot respondía el procedimiento genérico, no los días específicos del empleado.  
**Solución:** SSO Azure AD + integración con HRIS vía Power Automate. El bot sabe quién es el usuario y consulta sus datos específicos. Knowledge Sources con política interna de RRHH para preguntas de procedimientos. Adaptive Cards con botones para acciones directas.  
**Resultado:** Resolución en el primer mensaje: 78%. Llamadas a RRHH reducidas 40%.

### ✅ Buenas Prácticas
- SSO es prácticamente obligatorio en bots corporativos — evita fricciones de autenticación
- Probar el bot con usuarios reales (no solo el desarrollador) antes de publicar
- Revisar Analytics semanalmente las primeras 4 semanas post-lanzamiento
- Tener siempre el topic "Escalar a agente" disponible como escape hatch
- Monitorear sesiones con rate de escalamiento alto — indican gaps en la KB

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SSO pide credenciales en Teams | OAuth scope mal configurado | Agregar `openid profile` y verificar redirect URI |
| Generative Answers alucina | Knowledge Source con documentos ambiguos o desactualizados | Depurar documentos fuente y agregar instrucciones de sistema restrictivas |
| Adaptive Card no muestra datos de variable | Sintaxis de binding incorrecta | Usar `${Topic.Variable}` exactamente — sensible a mayúsculas |

### 🧪 Criterios de Validación
- [ ] SSO configurado: bot saluda al usuario por nombre en Teams sin pedir login
- [ ] Flujo PA usa `System.User.PrincipalName` para personalizar respuesta
- [ ] Adaptive Card renderiza con datos dinámicos y botón accionable
- [ ] Generative Answers responde desde KB y rechaza preguntas fuera de scope
- [ ] Topic de escalamiento transfiere la conversación con contexto al agente humano
- [ ] Analytics muestra tasa de resolución y se identificaron 2 topics para mejorar

---

---
moduleId: 15
title: "Copilot Studio — Introducción"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 10
slug: "copilot-studio-introduccion"
---
### 🎯 Objetivo
Crear un agente conversacional funcional en Copilot Studio que resuelve consultas de usuarios, escala a Power Automate para acciones sobre datos, y se integra en Teams y páginas web como canal de soporte automatizado.

### 📖 Conceptos Clave
- **Topic:** unidad básica de conversación en Copilot Studio que define cuándo se activa (trigger phrases), qué preguntas hace, qué lógica ejecuta, y qué responde el agente. Es similar a una función en programación: tiene un punto de entrada (triggers), lógica interna (nodos), y puede llamar a otras funciones (redirigir a otros topics). Los topics del sistema (Fallback, Welcome, End of Conversation) son predefinidos y personalizables. Una buena práctica es tener topics pequeños y enfocados en una sola intención del usuario.

- **Trigger Phrases:** frases de ejemplo que el motor de NLU (Natural Language Understanding) del agente usa para aprender a reconocer la intención del usuario y activar el topic correcto. No son coincidencias exactas — el modelo NLU detecta variaciones semánticas. Mínimo 5-8 frases por topic, con variaciones en vocabulario, longitud y estilo (formal/informal, con/sin acentos, con errores tipográficos comunes). Cuantas más y más variadas sean las frases, mejor es la precisión. Ejemplo: para el topic "Consultar Estado": "¿cómo va mi solicitud?", "quiero ver mi ticket", "estado de mi caso", "revisar SOL-00123".

- **Entities:** tipos de datos estructurados que el agente identifica y extrae automáticamente del texto del usuario. Entidades del sistema: Fecha, Hora, Número, Email, URL, Porcentaje, Moneda, Nombre de Persona, Ciudad. Entidades personalizadas: listas cerradas (ej. categorías de IT con sinónimos) o expresiones regulares (ej. patrón `SOL-\d{5}` para números de solicitud). El agente usa las entidades detectadas para poblar variables sin necesidad de preguntar explícitamente al usuario.

- **Slot Filling:** comportamiento automático del agente por el cual, si una variable requerida (asociada a una entidad) no fue proporcionada en el mensaje del usuario, el agente pregunta por ella de forma inteligente. Si el usuario proporciona el valor antes de que se le pregunte (en el mismo mensaje del trigger), el slot filling lo detecta y no hace la pregunta. Ejemplo: si el topic necesita el número de solicitud y el usuario dice "quiero ver el estado de SOL-00123", el agente extrae el número automáticamente; si dice solo "quiero ver el estado de mi solicitud", el agente pregunta por el número.

- **Variables:** mecanismo de almacenamiento de datos durante una conversación. Tres alcances: `Topic.X` (local al topic, se pierde al salir), `Global.X` (persiste durante toda la conversación entre todos los topics), `System.X` (variables del sistema como `System.User.PrincipalName`, `System.Activity.Text`). Las variables de topic se crean automáticamente cuando se configura una pregunta. Las variables globales se crean en la sección de Variables del editor. Ejemplo: `Topic.NumeroSolicitud` guarda el número ingresado por el usuario en el topic de consulta.

- **Condición (Condition):** nodo de bifurcación en el flujo del topic que evalúa una expresión sobre el valor de una variable y redirige a diferentes ramas según el resultado. Soporta operadores: es igual a, no es igual a, contiene, está en blanco, es mayor/menor que. Las condiciones se encadenan con AND/OR. Se usa para personalizar respuestas según el estado obtenido, manejar casos de "no encontrado", o implementar lógica de escalamiento diferenciada.

- **Acción (Action):** nodo en un topic que ejecuta una operación externa: llamar a un flujo de Power Automate (el método más común para acceder a datos), llamar a un conector, ejecutar código (para escenarios avanzados), o usar un Knowledge Source para respuesta generativa. Al llamar un flujo de Power Automate, se mapean las variables del topic como inputs y los outputs del flujo se almacenan en variables del topic. Los flujos para Copilot Studio deben usar el trigger "When called from a Copilot Studio agent".

- **Respuestas Generativas (Generative Answers):** capacidad que permite al agente responder preguntas abiertas consultando automáticamente Knowledge Sources (documentos SharePoint, sitios web, archivos PDF) usando IA generativa, sin necesidad de crear topics específicos para cada pregunta posible. Cuando ningún topic coincide con la consulta del usuario, el Fallback topic puede invocar Generative Answers. La calidad depende de la calidad del contenido de los Knowledge Sources. Incluir instrucciones claras en el System Prompt para evitar alucinaciones ("no inventes información, responde solo con lo que encuentres en los documentos").

- **Escalamiento a Agente Humano:** nodo especial en Copilot Studio que transfiere la conversación y su historial a un agente humano live a través de Dynamics 365 Omnichannel for Customer Service u otras plataformas de contact center compatibles. Se activa cuando el bot no puede resolver la consulta o cuando el usuario lo solicita explícitamente. El agente humano recibe el transcript de la conversación para contexto. Configurar siempre un fallback de escalamiento — nunca dejar al usuario atascado en un loop sin salida.

- **Canal:** plataforma donde se despliega y accede el agente conversacional. Canales nativos disponibles: Microsoft Teams (el más común en entornos corporativos), sitio web personalizado (Web Chat con iframe embeddable), Power Pages, SharePoint. Canales externos via Azure Bot Service: WhatsApp, Facebook Messenger, Telegram, Slack, Twilio. Cada canal tiene sus propias capacidades de formato de mensaje (Teams soporta Adaptive Cards y formato rico; Web básico soporta markdown; WhatsApp solo texto e imágenes).

- **Knowledge Sources:** fuentes de contenido que el agente puede consultar para generar respuestas generativas. Tipos soportados: sitios de SharePoint (OneDrive incluido), URLs de sitios web públicos (el motor indexa las páginas), archivos subidos directamente (PDF, Word, PowerPoint), y Dataverse (en versiones avanzadas). El contenido se indexa y vectoriza para búsqueda semántica. Actualizar los Knowledge Sources cuando el contenido cambia — el agente no detecta cambios automáticamente.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 15.1: Crear el agente base
1. copilotstudio.microsoft.com → Crear → Nuevo agente
2. Configuración inicial:
    - Nombre: `Asistente IT SIT`
    - Descripción: "Ayudo con solicitudes de soporte técnico, consultas de estado y escalamiento"
    - Instrucciones: "Eres un asistente amigable de soporte IT. Respondes en español. Si no puedes resolver la consulta, ofreces escalar a un humano. No inventes información."

3. Conectar Knowledge Source:
    - Agregar → SharePoint → URL del sitio de documentación técnica
    - Esto habilita Respuestas Generativas automáticas

#### Actividad 15.2: Topic — Consultar estado de solicitud
1. Topics → Nuevo topic → En blanco
2. Nombre: `Consultar Estado Solicitud`
3. Trigger phrases (mínimo 8):
   ```
    - ¿Cuál es el estado de mi solicitud?
    - quiero saber mi solicitud
    - cómo va mi ticket
    - estado de mi caso
    - revisar mi solicitud número
    - buscar mi ticket
    - mi solicitud está lista
    - ¿ya resolvieron mi caso?
   ```

4. Nodo: **Mensaje**
   ```
   "Claro, voy a consultar el estado de tu solicitud. ¿Podrías proporcionarme el número de tu solicitud?"
   ```

5. Nodo: **Pregunta** — Variable: `varNumeroSolicitud`
    - Tipo de entidad: Número (o crear entidad personalizada con patrón regex `SOL-\d{5}`)
    - Texto: "¿Cuál es el número de tu solicitud? (Ejemplo: SOL-00123)"
    - Variable se guardará como: `Topic.NumeroSolicitud`

6. Nodo: **Acción** → Power Automate → seleccionar flujo `ObtenerEstadoSolicitud`
    - Input al flujo: `numeroSolicitud` = `Topic.NumeroSolicitud`
    - Output del flujo: `Topic.EstadoSolicitud`, `Topic.FechaUltimaActualizacion`

7. Nodo: **Condición**
    - Si `Topic.EstadoSolicitud` está vacío:
     - **Mensaje:** "No encontré una solicitud con ese número. ¿Podrías verificar el número?"
     - → Redireccionar a este mismo topic (nodo de pregunta)
    - De lo contrario:
     - **Mensaje con variables:**
       ```
       Tu solicitud **{Topic.NumeroSolicitud}** está en estado: **{Topic.EstadoSolicitud}**
       Última actualización: {Topic.FechaUltimaActualizacion}
       
       ¿Necesitas hacer algo más con esta solicitud?
       ```

8. Nodo: **Opciones rápidas:**
    - "Escalar al equipo" → redirigir a topic `Escalar Solicitud`
    - "Cancelar solicitud" → redirigir a topic `Cancelar Solicitud`
    - "No, gracias" → nodo fin de conversación

#### Actividad 15.3: Entidad personalizada — Categorías IT
1. Entidades → Nueva entidad → Lista cerrada
2. Nombre: `CategoríaIT`
3. Valores:
   ```
   Hardware       (sinónimos: computadora, equipo, impresora, mouse, teclado)
   Software       (sinónimos: aplicación, programa, instalación, licencia)
   Red            (sinónimos: internet, wifi, conectividad, vpn)
   Accesos        (sinónimos: contraseña, password, usuario, cuenta, login)
   Telefonía      (sinónimos: celular, teléfono, extensión)
   ```

4. Usar la entidad en topic `Crear Nueva Solicitud`:
   ```
   Pregunta: "¿Cuál es la categoría del problema?"
   Tipo: CategoríaIT (Slot Filling habilitado)
   ```

#### Actividad 15.4: Flujo de Power Automate para el agente
1. Nuevo flujo → Trigger: "When called from Copilot Studio"
2. Input: `numeroSolicitud` (Text)
3. Acción: List rows (Dataverse)
   ```
   Table: Solicitudes
   Filter: sit_numero eq '@{triggerBody()?['text']}'
   Select: sit_estado,sit_nombre,modifiedon
   Top: 1
   ```

4. Condition: `length(outputs('List_rows')?['body/value'])` mayor que 0
    - True: Set variable con datos del primer resultado
    - False: Set variable estado = "" (vacío)

5. Return values: 
   ```
   estado: if(empty(variables('varRegistro')), '', variables('varRegistro')?['sit_estado@OData.Community.Display.V1.FormattedValue'])
   fechaActualizacion: if(empty(variables('varRegistro')), '', formatDateTime(variables('varRegistro')?['modifiedon'], 'dd/MM/yyyy HH:mm'))
   ```

#### Actividad 15.5: Publicar en Teams
1. En Copilot Studio → Canales → Microsoft Teams → Publicar
2. Seguir wizard: nombre en Teams, icono, descripción
3. Desplegar para: solo yo (prueba) → luego toda la organización
4. En Teams: buscar el bot por nombre y probarlo
5. Probar con frases del trigger y verificar que el bot:
    - Responde a variaciones de las trigger phrases
    - Pide el número de solicitud si no se proporcionó
    - Consulta Dataverse vía Power Automate
    - Muestra el estado correctamente

### 💼 Caso Real de Negocio
**Empresa:** Empresa de 800 empleados con mesa de ayuda IT sobrecargada  
**Problema:** 70% de tickets eran consultas de estado que podía responder un bot. Los analistas perdían 4 horas diarias en responder "¿cómo va mi solicitud?".  
**Solución:** Copilot Studio con integración a Dataverse vía Power Automate. Knowledge Source con manual de usuario para preguntas frecuentes. Canal Teams para acceso desde donde trabajan los empleados.  
**Resultado:** 65% de consultas resueltas por el bot. Tiempo de respuesta: de 2 horas a instantáneo. Satisfacción usuarios: 4.2/5.

### ✅ Buenas Prácticas
- Mínimo 8 trigger phrases por topic, con variaciones naturales y con errores tipográficos comunes
- Variables Topic.X son locales al topic; usar Global.X para compartir entre topics
- Siempre agregar nodo de "no entendí" en el Fallback topic personalizado
- Probar con "Try it out" después de cada cambio antes de publicar
- Los flujos de Power Automate para Copilot Studio deben estar en soluciones
- Habilitar Generative Answers solo con Knowledge Sources confiables — verificar que no alucine

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Bot no activa el topic correcto | Trigger phrases muy similares a otro topic | Revisar frases solapadas en Topics → Analytics |
| Variable del flujo llega vacía | Output del flujo no mapeado correctamente | Verificar nombres de output en el flujo y en el nodo de acción |
| Slot filling pregunta dos veces | Entidad detectada pero variable no asignada | Verificar que la variable del slot filling apunta a la variable del nodo pregunta |
| Generative Answers inventa datos | Knowledge Source desactualizado o ambiguo | Actualizar KB y agregar instrucción "no inventes datos" en el prompt del sistema |

### 🧪 Criterios de Validación
- [ ] Agente creado con instrucciones de sistema en español
- [ ] Topic `Consultar Estado` activado con 8+ trigger phrases
- [ ] Slot filling solicita el número si no fue proporcionado en el mensaje inicial
- [ ] Flujo Power Automate consulta Dataverse y retorna estado correctamente
- [ ] Condición maneja el caso de solicitud no encontrada con mensaje de error amigable
- [ ] Agente publicado en Teams y probado con 5 escenarios distintos

---

---
moduleId: 63
title: "Dynamics 365 Contact Center / Omnichannel — Canales, Routing y Operación"
level: "d365"
certification: "Dynamics 365 Contact Center / Customer Service"
estimatedMinutes: 13
slug: "dynamics-365-contact-center-omnichannel"
---
### 🎯 Objetivo
Diseñar una operación de contact center sobre Dynamics 365 Customer Service/Contact Center con canales digitales, conversación, presencia, unified routing, bots, handoff y métricas, produciendo un workstream, una regla de routing y un dashboard de supervisor completos — dejando explícito qué requiere licenciamiento, canal real y configuración del tenant, y qué puede simularse como diseño.

### 📖 Conceptos Clave
- **Contact Center vs. Customer Service:** Customer Service administra casos y conocimiento (el "qué" del problema); Contact Center/Omnichannel agrega canales, conversaciones, presencia, distribución de trabajo en tiempo real y experiencia de agente (el "cómo" se atiende en vivo). Un proyecto puede tener Customer Service sin Contact Center (soporte por email/portal), pero no al revés — Contact Center necesita casos y conocimiento detrás de cada conversación.
- **Canales — con limitaciones reales:** chat, voz, SMS, WhatsApp u otros canales de mensajería dependen de disponibilidad regional, licencias específicas, números/proveedores de telefonía (voz requiere un proveedor de Voice habilitado) y configuración del tenant. Un módulo puede enseñar a diseñar un workstream de WhatsApp; verificar que un mensaje real llegue requiere un proveedor de WhatsApp Business aprobado y activo — awareness de diseño, no garantía de canal productivo.
- **Workstreams:** agrupan reglas de entrada, enrutamiento, capacidad y sesión para un canal o tipo de trabajo específico. Un workstream de chat premium y uno de chat general pueden coexistir con reglas de capacidad y escalamiento distintas sobre el mismo canal técnico.
- **Unified routing — mecánica de decisión:** distribuye conversaciones o casos hacia colas o agentes evaluando, en orden, reglas de clasificación (¿qué tipo de trabajo es?), skills requeridas, capacidad disponible del agente y su presencia (¿está disponible, ocupado, ausente?). Aplica tanto a Customer Service (casos) como a Contact Center (conversaciones en vivo) porque es el mismo motor.
- **Presence y capacity — con ejemplo de cálculo:** cada agente tiene un capacity profile (ej. máximo 3 chats simultáneos = 100% de capacidad, cada chat consume ~33%). Si un agente ya tiene 2 chats activos (66% de capacidad) y llega una conversación de alta prioridad que consume 50%, el sistema debe decidir si sobrepasar la capacidad (mala práctica) o enrutar a otro agente disponible. Sin capacity profiles, el routing reparte trabajo por volumen, no por carga real — y "el canal está disponible" no significa "el agente puede atenderlo bien".
- **Bot y handoff:** un bot puede resolver preguntas frecuentes (consultando knowledge articles) y transferir a un agente humano cuando no puede resolver o el cliente lo solicita. El handoff debe conservar transcript completo, intención detectada, cliente identificado y motivo de escalamiento — un handoff que solo transfiere la conversación sin ese contexto obliga al agente a repetir preguntas que el cliente ya respondió al bot, frustrando la experiencia que el bot debía mejorar.
- **Supervisor experience:** monitoreo en tiempo real de colas, conversaciones activas, tiempos de espera, sentiment (cuando está habilitado) y productividad por agente — permite intervenir (reasignar, unirse a la conversación) antes de que una conversación se pierda o escale mal.
- **Métricas:** ASA (average speed of answer), AHT (average handle time), abandon rate, first contact resolution, transfer rate, CSAT, backlog y occupancy (% de tiempo que el agente está ocupado vs. disponible).
- **Requisitos reales de práctica:** diseñar workstreams, reglas de routing y dashboards de supervisor puede hacerse sin tenant. Probar canales reales (voz, WhatsApp, chat en vivo), presencia, capacity profiles y conversaciones end-to-end requiere Dynamics 365 Contact Center/Customer Service con Digital messaging/Omnichannel habilitado, licencias por canal y, para voz/WhatsApp, un proveedor externo configurado.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Diseña un workstream de chat para soporte premium con horario, cola, skills requeridas, capacidad por agente y criterio de escalamiento.
2. Escribe una regla de unified routing en formato tabla de decisión:

   | Condición | Cola destino | Skill requerida | Prioridad |
   |---|---|---|---|
   | Cliente premium Y producto = Field Service | Soporte Field Premium | Field Service nivel 2 | Alta |
   | Cliente premium Y producto ≠ Field Service | Soporte Premium General | Producto correspondiente | Media |
   | Cliente estándar | Cola general | Ninguna específica | Normal |

3. Diseña el handoff de bot a agente con 5 datos obligatorios: cliente identificado, intención detectada, resumen de la conversación, artículo de knowledge sugerido y prioridad. Redacta un ejemplo de payload de contexto que el bot pasaría al agente:

   ```json
   {
     "cliente": "Ana Rivera — Cuenta Premium",
     "intencion": "Falla de sincronización en app móvil de Field Service",
     "resumen": "El cliente reporta que las órdenes de trabajo no sincronizan desde ayer 14:00",
     "articulo_sugerido": "KB-0231 — Troubleshooting de sincronización offline Field Service Mobile",
     "prioridad": "Alta"
   }
   ```
4. Define un dashboard supervisor con 6 métricas (incluye al menos ASA, abandon rate y occupancy) y un umbral de alerta para cada una.
5. Responde esta pregunta de entrevista/consultoría: "Activamos el canal de chat y la tasa de abandono subió durante la campaña, aunque el canal nunca se cayó — ¿qué revisarías primero?" (respuesta esperada: capacity profiles y presencia, no la disponibilidad técnica del canal).
6. Marca qué requiere ambiente real: canal configurado con proveedor (voz/WhatsApp), licencias Contact Center/Customer Service, usuarios/agentes, colas, presencia, workstream y pruebas de conversación end-to-end.

### 💼 Casos Reales de Negocio
Una empresa activó el canal de chat sin definir capacidad de agentes. Durante campañas de marketing, cada agente recibía demasiadas conversaciones simultáneas y la tasa de abandono subió aunque "el canal nunca se cayó" técnicamente. El equipo inicialmente sospechó de un problema de infraestructura y escaló al proveedor de la plataforma, perdiendo días en diagnóstico técnico. La causa real era de configuración: sin capacity profiles ni presencia, unified routing seguía asignando conversaciones a agentes ya saturados. La solución fue configurar capacity profiles, presencia, skills y reglas de routing por prioridad. La experiencia mejoró no por abrir más canales ni por escalar infraestructura, sino por gobernar la distribución del trabajo.

### ✅ Buenas Prácticas
- Diseñar primero colas, skills y capacidad; conectar canales después de tener ese modelo operativo definido.
- Probar handoff con transcript y contexto completo, no solo transferencia visual de la conversación.
- Mantener una matriz de canales con disponibilidad regional, licencias, proveedor externo (si aplica) y owner operativo.
- Monitorear abandon rate y transfer rate desde el piloto, no solo después de un incidente.
- Separar automatización de bot de reglas de SLA: una conversación resuelta por bot también debe tener criterio de éxito medible, no asumirse como "resuelta" por defecto.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Activar canal sin modelo de capacidad | Se prioriza disponibilidad técnica sobre operación del agente | Definir capacity profile y presencia por rol antes de abrir el canal |
| Bot transfiere sin contexto | Handoff mal diseñado, sin payload estructurado | Pasar intención, transcript y resumen al agente en el handoff |
| Skills no mantenidas | Cambian equipos/productos y nadie actualiza la matriz | Asignar owner mensual de la matriz de skills |
| Métricas solo de volumen | No se mide experiencia del cliente ni del agente | Agregar abandono, FCR, transfer rate y CSAT al dashboard |

### 🧪 Criterios de Validación
- [ ] Diseñé un workstream con canal, cola, capacidad y routing
- [ ] Documenté reglas de unified routing como tabla de decisión por skill/prioridad
- [ ] Definí handoff bot-agente con contexto mínimo y un payload de ejemplo
- [ ] Respondí la pregunta de entrevista sobre abandono con canal disponible
- [ ] Identifiqué licencias/canales/tenant necesarios para probar Contact Center real
- [ ] Relacioné este módulo con el Lab 83 (Contact Center Chat Channel Hands-On)


---
moduleId: 62
title: "Dynamics 365 Contact Center / Omnichannel — Canales, Routing y Operación"
level: "d365"
certification: "Dynamics 365 Contact Center / Customer Service"
estimatedMinutes: 13
slug: "dynamics-365-contact-center-omnichannel"
---
### 🎯 Objetivo
Diseñar una operación de contact center sobre Dynamics 365 Customer Service/Contact Center con canales digitales, conversación, presencia, unified routing, bots, handoff y métricas, dejando explícito qué requiere licenciamiento, canal real y configuración del tenant.

### 📖 Conceptos Clave
- **Contact Center vs. Customer Service:** Customer Service administra casos y conocimiento; Contact Center/Omnichannel agrega canales, conversaciones, presencia, distribución de trabajo y experiencia de agente en tiempo real.
- **Canales:** chat, voz, SMS, redes o canales de mensajería dependen de disponibilidad regional, licencias, números/proveedores y configuración del tenant.
- **Workstreams:** agrupan reglas de entrada, enrutamiento, capacidad y sesión para un canal o tipo de trabajo.
- **Unified routing:** distribuye conversaciones o casos por reglas, skills, capacidad y presencia. Aplica tanto a Customer Service como a Contact Center moderno.
- **Presence y capacity:** evitan asignar más conversaciones de las que un agente puede atender. Sin capacidad, el routing solo reparte trabajo, no protege calidad.
- **Bot y handoff:** un bot puede resolver preguntas frecuentes y transferir a agente con contexto. El handoff debe conservar transcript, intención, cliente identificado y motivo.
- **Supervisor experience:** monitoreo de colas, conversaciones activas, tiempos de espera, sentiment y productividad.
- **Métricas:** ASA, AHT, abandon rate, first contact resolution, transfer rate, CSAT, backlog y occupancy.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Diseña un workstream de chat para soporte premium con horario, cola, skills requeridas, capacidad por agente y criterio de escalamiento.
2. Escribe una regla de unified routing: si cliente es premium y producto es Field Service, enviar a cola "Soporte Field Premium"; si no, cola general.
3. Diseña el handoff de bot a agente con 5 datos obligatorios: cliente, intención, resumen, artículo sugerido y prioridad.
4. Define un dashboard supervisor con 6 métricas y umbrales de alerta.
5. Marca qué requiere ambiente real: canal configurado, licencias Contact Center/Customer Service, usuarios/agentes, colas, presencia, workstream y pruebas de conversación.

### 💼 Casos Reales de Negocio
Una empresa activó chat sin definir capacidad de agentes. Durante campañas, cada agente recibía demasiadas conversaciones y la tasa de abandono subió aunque "el canal estaba disponible". La solución fue configurar capacity profiles, presencia, skills y reglas de routing por prioridad. La experiencia mejoró no por abrir más canales, sino por gobernar la distribución del trabajo.

### ✅ Buenas Prácticas
- Diseñar primero colas, skills y capacidad; luego conectar canales.
- Probar handoff con transcript y contexto, no solo transferencia visual.
- Mantener una matriz de canales con disponibilidad regional, licencias y owner operativo.
- Monitorear abandon rate y transfer rate desde el piloto.
- Separar automatización de bot de reglas de SLA: una conversación resuelta por bot también debe tener criterio de éxito.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Activar canal sin modelo de capacidad | Se prioriza disponibilidad sobre operación | Definir capacity profile y presencia por rol |
| Bot transfiere sin contexto | Handoff mal diseñado | Pasar intención, transcript y resumen al agente |
| Skills no mantenidas | Cambian equipos/productos y nadie actualiza | Owner mensual de matriz de skills |
| Métricas solo de volumen | No se mide experiencia | Agregar abandono, FCR, transfer rate y CSAT |

### 🧪 Criterios de Validación
- [ ] Diseñé un workstream con canal, cola, capacidad y routing
- [ ] Documenté reglas de unified routing por skill/prioridad
- [ ] Definí handoff bot-agente con contexto mínimo
- [ ] Identifiqué licencias/canales/tenant necesarios para probar Contact Center real


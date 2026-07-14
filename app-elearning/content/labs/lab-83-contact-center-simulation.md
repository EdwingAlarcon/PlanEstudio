---
id: lab-83
title: "Contact Center Chat Channel Hands-On"
level: "N6"
duration: 210
product: ["Dynamics 365 Customer Service", "Dynamics 365 Contact Center", "Omnichannel Chat"]
certifications: ["Dynamics 365 Contact Center", "Dynamics 365 Customer Service"]
role: ["Consultor Funcional D365 CE", "Contact Center Architect"]
prerequisites:
  - "Módulo 62 estudiado: Contact Center / Omnichannel"
  - "Lab 68 completado (recomendado): Customer Service case-to-resolution"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Customer Service con Digital messaging/Omnichannel habilitado"
  - "Sin ese ambiente, la parte ejecutable de este lab no aplica — ver Alcance de este lab"
---

# Lab 83 — Contact Center Chat Channel Hands-On

## Objetivo

Configurar y probar de punta a punta un canal de **chat** real (widget web) en Dynamics 365
Customer Service/Contact Center: workstream, unified routing, presencia de agente, conversación de
prueba con handoff y dashboard de supervisor — en un trial que el propio estudiante consigue.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Customer Service admin center / Contact Center, **sin verificación contra un tenant en vivo al
momento de escribirse**. Microsoft mueve capacidades entre "Customer Service admin center" y
"Contact Center admin center" según la licencia y el release wave. Si un nombre de menú no coincide
con tu ambiente, es más probable un cambio de versión/licencia que un error tuyo — documenta la
diferencia como parte de tu evidencia.

## Alcance de este lab: qué es ejecutable con solo un trial y qué no

No todos los canales de Contact Center requieren lo mismo:

| Canal | Qué necesitas | ¿Ejecutable con solo un trial Microsoft? |
|---|---|---|
| **Chat (widget web)** | Trial de Dynamics 365 Customer Service + Digital messaging, y una página web de prueba donde pegar el script del widget | **Sí** — es el canal que cubre este lab |
| **Voz** | Trial + número de teléfono y proveedor de voz (Azure Communication Services u otro), con costo real | No — requiere una cuenta de proveedor de telefonía, más allá del trial |
| **SMS** | Trial + proveedor de mensajería SMS configurado | No — requiere una cuenta de proveedor externo, más allá del trial |

Este lab cubre **solo Chat**, porque es el único canal que un estudiante puede probar end-to-end sin
contratar un proveedor de telefonía/SMS externo. Voz y SMS quedan documentados como diseño (matriz
de canal, routing, capacidad) pero no como configuración ejecutada — no presentes esa parte como si
la hubieras probado.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT).

SIT quiere ofrecer soporte premium por chat en su sitio web. Un cliente que escribe debe quedar en
una cola con prioridad si su cuenta es premium, y el agente debe ver el contexto completo de la
conversación (no solo el último mensaje) al recibirla.

## Rol del estudiante

Actúas como Contact Center Architect configurando y probando el canal de chat end-to-end.

## Herramientas necesarias

- Ambiente trial de Dynamics 365 Customer Service con Digital messaging/Omnichannel habilitado.
- Una página HTML simple (puede ser un archivo local o una página de Power Pages) donde pegar el script del widget de chat.
- Dos sesiones de navegador (o una ventana normal y una de incógnito): una para simular al cliente en la página con el widget, otra para el agente en Customer Service workspace.

## Entregables

- Canal de chat configurado con widget generado.
- Workstream de chat con regla de routing por prioridad (cliente premium vs. general).
- Perfil de capacidad y presencia de agente configurados.
- Conversación de prueba ejecutada de punta a punta, con capturas de cada etapa.
- Matriz de diseño (no ejecutada) para Voz y SMS.

## Pasos detallados

### Paso 1 — Habilitar el canal de chat

En **Customer Service admin center > Channels** (o **Customer support channels**), agrega un canal
**Chat**.

- Configura el nombre del widget, colores, mensaje de bienvenida y horario de disponibilidad.
- Genera el script de embebido y pégalo en tu página de prueba.
- Documenta qué pasa si el horario configurado marca "fuera de línea": ¿qué ve el cliente en el widget?

### Paso 2 — Workstream y regla de routing

Ve a **Customer Service admin center > Workstreams > New** y crea un workstream de tipo Chat
asociado al canal del Paso 1.

- Configura una regla de routing: si el cliente está marcado como premium (usa un campo o atributo
  de prueba en el contacto), enrutar a la cola `Soporte Premium`; si no, a la cola `Soporte General`.
- Documenta la diferencia entre una regla de routing por atributo del cliente y una regla por
  contenido del mensaje (si tu ambiente lo soporta).

### Paso 3 — Capacidad y presencia de agente

Ve a **Customer Service admin center > Workstreams > Capacity profiles** (o el equivalente en tu
ambiente) y asigna un perfil de capacidad al usuario agente (tu propia cuenta o una cuenta de
prueba adicional).

- Define el máximo de conversaciones simultáneas para ese perfil.
- Inicia sesión como agente en **Customer Service workspace** y marca tu presencia como disponible.
- Documenta qué pasa si intentas recibir una conversación con presencia "Ausente".

### Paso 4 — Conversación de prueba y handoff

Desde tu página de prueba (sesión "cliente"), abre el widget de chat y envía un mensaje inicial.

- Desde Customer Service workspace (sesión "agente"), acepta la conversación entrante.
- Documenta qué contexto ve el agente al aceptar: ¿historial del contacto, transcript, o solo el último mensaje?
- Si tu ambiente incluye un bot de primer contacto, documenta cómo se transfiere la conversación del
  bot al agente y qué datos se conservan (intención, resumen, transcript).

### Paso 5 — Dashboard de supervisor y diseño de Voz/SMS

Revisa las métricas disponibles para tu conversación de prueba (en Customer Service admin center,
Contact Center admin center, u Omnichannel Insights, según lo que tu licencia habilite).

- Documenta qué métricas están realmente disponibles en tu trial (ASA, AHT, abandon rate, etc.) y
  cuáles no — sin licencia Insights/Analytics, es esperable que varias no estén disponibles.
- Diseña (sin ejecutar) la matriz de canal para Voz y SMS: qué proveedor usarías, qué licencia
  adicional se requiere, y qué cambiaría en el workstream y el routing.

## Criterios de validación

- [ ] El canal de chat tiene widget generado y horario configurado.
- [ ] El workstream enruta correctamente según el atributo de prioridad del cliente (probado con al menos 2 casos: premium y general).
- [ ] El perfil de capacidad y la presencia del agente están configurados y probados.
- [ ] La conversación de prueba se completó de punta a punta con capturas de cada etapa.
- [ ] La matriz de Voz/SMS está documentada como diseño, no presentada como ejecutada.

## Rúbrica

| Criterio | Peso |
|---|---|
| Canal de chat y widget | 15% |
| Workstream y routing por prioridad | 25% |
| Capacidad y presencia de agente | 20% |
| Conversación de prueba y handoff | 25% |
| Dashboard de supervisor y diseño Voz/SMS | 15% |

## Errores comunes

- Presentar el diseño de Voz/SMS como si hubiera sido probado, cuando solo el canal de chat se ejecutó realmente.
- No probar el caso negativo (presencia "Ausente" o fuera de horario) y asumir que el canal siempre funciona.
- Configurar routing por cola genérica en vez de por atributo/prioridad del cliente.
- Confundir el widget generado (configuración del canal) con el workstream (reglas de enrutamiento) — son pasos distintos y ambos son necesarios.

## Gate de ambiente real (Voz, SMS y operación a escala)

Antes de presentar Voz, SMS o una operación de contact center a escala como configuración real,
completa el gate **Contact Center / Omnichannel** del recurso `/recursos/d365-tenant-readiness`. Ese
gate exige licencias específicas, canal disponible en tu región, agentes con presencia real y
conversación de prueba — más allá de lo que este lab cubre con el canal de chat.

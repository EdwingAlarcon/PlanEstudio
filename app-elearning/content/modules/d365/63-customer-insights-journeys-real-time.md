---
moduleId: 63
title: "Customer Insights - Journeys — Real-Time Journeys y Consentimiento"
level: "d365"
certification: "Dynamics 365 Customer Insights"
estimatedMinutes: 12
slug: "customer-insights-journeys-real-time"
---
### 🎯 Objetivo
Diseñar journeys en tiempo real con triggers, segmentos, consentimiento, canales y medición, produciendo un diagrama de flujo completo y un modelo de consentimiento auditable — separando claramente Customer Insights - Journeys de Customer Insights - Data (Módulo 57) y evitando depender de outbound marketing heredado.

### 📖 Conceptos Clave
- **Journeys vs. Data:** Customer Insights - Data (Módulo 57) unifica perfiles, calcula medidas y define segmentos; Journeys orquesta comunicaciones y experiencias en tiempo real a partir de esos segmentos o de eventos directos en Dataverse. Un journey nunca "inventa" un segmento — lo consume de Data o lo define localmente sobre datos de Dataverse.
- **Real-time journey — anatomía:** recorrido activado por evento o segmento, con nodos de decisión (condición sí/no), esperas (delay), mensajes (email, SMS, push) y objetivos medibles (goal). El motor evalúa cada contacto de forma individual y asíncrona — dos contactos que entran el mismo día pueden estar en pasos distintos del journey según cómo interactúen.
- **Triggers — con ejemplos concretos de origen:** eventos que inician o ramifican un journey, como formulario enviado (Dataverse/Forms Pro), caso cerrado (`Case` con `statuscode = Resuelto`), oportunidad ganada (`Opportunity` con `statecode = Won`) o un evento personalizado enviado vía API. El trigger debe ser un evento discreto y con timestamp claro — "cliente insatisfecho" no es un trigger válido; "CSAT registrado menor a 3" sí lo es.
- **Consentimiento:** requisito operativo y legal por canal, propósito y contacto — un contacto puede tener consentimiento para email de servicio pero no para email de marketing; son dos consentimientos distintos, no uno genérico. Sin consentimiento válido y vigente para ese propósito y canal específico, el journey no debería enviar la comunicación, sin importar cuán relevante sea el trigger.
- **Outbound marketing heredado:** Microsoft ha movido el foco de la plataforma a real-time journeys; para 2026 el diseño de cualquier journey nuevo debe evitar depender de capacidades outbound retiradas o en camino de retiro — migrar journeys heredados es trabajo de modernización, no de mantenimiento.
- **Canales:** email, SMS, push u otros dependen de configuración, proveedor, dominio verificado (para email, SPF/DKIM), consentimiento vigente y licencia — un journey bien diseñado puede fallar en producción si el dominio de envío no está verificado, un problema de configuración, no de lógica del journey.
- **Personalización:** usa datos del perfil/contacto, medidas de Customer Insights - Data (Módulo 57, ej. LTV) o eventos recientes, pero debe respetar minimización de datos — personalizar con el dato mínimo necesario, no con todo el perfil disponible solo porque existe.
- **Marketing-to-sales handoff:** cuando un journey detecta que un contacto alcanzó un umbral de calificación (ej. completó 3 journeys de nutrición y visitó la página de precios), el paso siguiente no es "seguir enviando más contenido" — es crear o actualizar un `Lead` en Sales con el contexto de journeys recorridos, para que el vendedor no empiece la conversación desde cero.
- **Métricas:** delivery, open/click (cuando el canal lo permite), conversion (goal attainment), unsubscribe y error rate. Un journey con alto delivery pero bajo conversion puede tener el trigger correcto pero el mensaje o la oferta equivocada — son diagnósticos distintos.
- **Requisitos reales de práctica:** diseñar el flujo del journey, el modelo de consentimiento y las pruebas negativas puede hacerse sin tenant. Validar entrega real, triggers en vivo, dominio de envío y consentimiento operando requiere Customer Insights - Journeys habilitado, dominio/canal configurado y contactos reales.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Diseña un real-time journey de renovación con este diagrama como base y complétalo con al menos una rama adicional (ej. qué pasa si el contacto abre el email pero no hace clic):

   ```mermaid
   flowchart TD
       A["Trigger: contrato vence en 45 días"] --> B["Email inicial de renovación"]
       B --> C["Esperar 7 días"]
       C --> D{"¿Hizo clic en la oferta?"}
       D -->|Sí| E["Crear tarea para vendedor con contexto"]
       D -->|No| F["Email de recordatorio"]
       E --> G["Cierre por conversión"]
       F --> C
   ```

2. Define el modelo de consentimiento en tabla: propósito, canal, campo/fuente de consentimiento y regla de exclusión, para al menos 2 propósitos distintos (ej. "renovación" y "marketing general").
3. Especifica qué datos vienen de Customer Insights - Data (perfil unificado, medidas, segmentos — Módulo 57) y qué datos viven en Dataverse/Journeys (contrato, fecha de vencimiento, interacciones del journey).
4. Redacta 3 pruebas: contacto con consentimiento válido para "renovación", contacto sin consentimiento para ese propósito, y contacto con email inválido/rebotado — describe el resultado esperado de cada una.
5. Diseña el criterio de marketing-to-sales handoff para este journey: ¿qué umbral de interacción convierte al contacto en una oportunidad para el vendedor, y qué contexto de journeys recibe el vendedor al recibirlo?
6. Indica qué requiere tenant real: entorno Customer Insights - Journeys, dominio/canal configurado y verificado, consentimiento vigente, contactos reales y permisos.

### 💼 Casos Reales de Negocio
Un equipo de marketing migró campañas históricas de su plataforma outbound sin revisar consentimiento ni triggers. El resultado fue un real-time journey que enviaba emails a contactos sin opt-in vigente para ese propósito específico — el consentimiento existía para "servicio" pero se reutilizó para "marketing", una confusión que un revisor legal detectó antes del despliegue masivo. La corrección no fue solo técnica: se redefinieron propósitos, fuentes de consentimiento, exclusiones y pruebas negativas antes de volver a activar comunicaciones. En Customer Insights - Journeys, compliance es parte del diseño del journey desde el primer nodo, no una validación posterior al lanzamiento.

### ✅ Buenas Prácticas
- Diseñar journeys real-time como estándar 2026; evitar nuevas dependencias de outbound heredado.
- Documentar consentimiento por propósito y canal antes de redactar el primer mensaje del journey.
- Probar exclusiones negativas (sin consentimiento, email inválido, contacto duplicado), no solo el caso feliz.
- Definir el objetivo de negocio y el evento de conversión del journey antes de agregar ramas adicionales.
- Mantener clara la frontera Data vs. Journeys para no duplicar la definición de un perfil o segmento en ambos lugares.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Confundir segmento unificado con journey | Se mezclan responsabilidades de Data y de Journeys | Documentar la fuente del segmento (Data) y la acción de activación (Journeys) por separado |
| Enviar sin consentimiento verificable para ese propósito | Pruebas realizadas solo con contactos internos con consentimiento general | Agregar caso negativo de consentimiento específico por propósito |
| Journey sin objetivo medible | Se diseña como secuencia de emails sin definir conversión | Definir goal y conversion event desde el primer diagrama |
| Depender de outbound heredado | Reutilización de campañas antiguas sin revisar el roadmap de la plataforma | Rediseñar en real-time journeys antes de reactivar comunicaciones |

### 🧪 Criterios de Validación
- [ ] Diseñé un real-time journey con trigger, condición, espera, objetivo y al menos una rama adicional
- [ ] Documenté consentimiento por propósito y canal para 2 propósitos distintos
- [ ] Separé datos provenientes de Customer Insights - Data y de Journeys/Dataverse
- [ ] Diseñé el criterio de marketing-to-sales handoff para el journey de renovación
- [ ] Identifiqué pruebas negativas y requisitos de tenant/licencia
- [ ] Relacioné este módulo con el Lab 58 (segmento y journey de renovación) y el Lab 84 (real-time journey)


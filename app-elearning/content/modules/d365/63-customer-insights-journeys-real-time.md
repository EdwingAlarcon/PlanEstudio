---
moduleId: 63
title: "Customer Insights - Journeys — Real-Time Journeys y Consentimiento"
level: "d365"
certification: "Dynamics 365 Customer Insights"
estimatedMinutes: 12
slug: "customer-insights-journeys-real-time"
---
### 🎯 Objetivo
Diseñar journeys en tiempo real con triggers, segmentos, consentimiento, canales y medición, separando claramente Customer Insights - Journeys de Customer Insights - Data y evitando depender de outbound marketing heredado.

### 📖 Conceptos Clave
- **Journeys vs. Data:** Customer Insights - Data unifica perfiles; Journeys orquesta comunicaciones y experiencias. Pueden integrarse, pero resuelven problemas distintos.
- **Real-time journey:** recorrido activado por evento o segmento, con decisiones, esperas, mensajes y objetivos medibles.
- **Triggers:** eventos que inician o ramifican un journey, como formulario enviado, caso cerrado, oportunidad ganada o abandono de carrito.
- **Consentimiento:** requisito operativo y legal por canal, propósito y contacto. Sin consentimiento válido, el journey no debería enviar comunicaciones.
- **Outbound marketing heredado:** Microsoft ha movido el foco a real-time journeys; para 2026 el diseño debe evitar depender de capacidades outbound retiradas o en salida.
- **Canales:** email, SMS, push u otros dependen de configuración, proveedor, dominio, consentimiento y licencia.
- **Personalización:** usa datos del perfil/contacto, medidas o eventos, pero debe respetar minimización de datos.
- **Métricas:** delivery, open/click cuando aplique, conversion, unsubscribe, error rate y goal attainment.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Diseña un real-time journey de renovación: trigger "contrato vence en 45 días", email inicial, espera 7 días, condición de interacción, tarea para vendedor y cierre por conversión.
2. Define el modelo de consentimiento: propósito, canal, campo/fuente de consentimiento y regla de exclusión.
3. Especifica qué datos vienen de Customer Insights - Data y qué datos viven en Dataverse/Journeys.
4. Redacta 3 pruebas: contacto con consentimiento válido, contacto sin consentimiento y contacto con email inválido.
5. Indica qué requiere tenant real: entorno Customer Insights - Journeys, dominio/canal configurado, consentimiento, contactos y permisos.

### 💼 Casos Reales de Negocio
Un equipo de marketing migró campañas históricas sin revisar consentimiento ni triggers. El resultado fue un journey que enviaba emails a contactos sin opt-in vigente. La corrección no fue solo técnica: se redefinieron propósitos, fuentes de consentimiento, exclusiones y pruebas negativas antes de volver a activar comunicaciones. En Customer Insights - Journeys, compliance es parte del diseño del journey, no una validación posterior.

### ✅ Buenas Prácticas
- Diseñar journeys real-time como estándar 2026; evitar nuevas dependencias de outbound heredado.
- Documentar consentimiento por propósito y canal antes de redactar mensajes.
- Probar exclusiones negativas, no solo el caso feliz.
- Definir objetivo de negocio del journey antes de agregar ramas.
- Mantener clara la frontera Data vs. Journeys para no duplicar perfiles.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Confundir segmento unificado con journey | Se mezclan Data y Journeys | Documentar fuente del segmento y acción de activación |
| Enviar sin consentimiento verificable | Pruebas solo con contactos internos | Agregar caso negativo de consentimiento |
| Journey sin objetivo medible | Se diseña como secuencia de emails | Definir goal y conversion event |
| Depender de outbound heredado | Reutilización sin revisar roadmap | Rediseñar en real-time journeys |

### 🧪 Criterios de Validación
- [ ] Diseñé un real-time journey con trigger, condición, espera y objetivo
- [ ] Documenté consentimiento por propósito y canal
- [ ] Separé datos provenientes de Customer Insights - Data y de Journeys/Dataverse
- [ ] Identifiqué pruebas negativas y requisitos de tenant/licencia


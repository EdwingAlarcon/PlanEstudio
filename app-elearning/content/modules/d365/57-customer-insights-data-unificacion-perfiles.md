---
moduleId: 57
title: "Customer Insights - Data: Unificación de Perfiles y Customer 360"
level: "d365"
certification: "Especialista Dynamics 365 CE"
estimatedMinutes: 11
slug: "customer-insights-data-unificacion-perfiles"
---
### 🎯 Objetivo
Entender qué resuelve Customer Insights - Data que Dynamics 365 Sales/Customer Service no resuelven por sí solos: unificación de perfiles desde múltiples fuentes, reglas de matching, medidas calculadas y activación de datos hacia Journeys — la capa que en este curso hasta ahora solo se nombraba, nunca se desarrollaba.

### 📖 Conceptos Clave
- **Por qué Customer Insights - Data no es "otro CRM":** Sales y Customer Service ya tienen Account/Contact con buena calidad de dato transaccional, pero ninguno de los dos, por sí solo, combina eso con fuentes externas (facturación, uso de producto, tickets de un sistema legado). Customer Insights - Data existe para construir un perfil unificado del cliente cruzando esas fuentes, no para reemplazar Sales/Service.
- **Fuentes de datos:** Dataverse (Account/Contact/Case/Opportunity), tablas de Dynamics 365, archivos planos (CSV de un sistema de billing legado), data lakes, o APIs de sistemas externos. Cada fuente se conecta como un "Data Source" con su propio esquema — antes de combinarlas, cada una debe mapearse a un tipo de entidad semántica (`Customer`, `Transaction`, `Interaction`).
- **Ingesta:** el proceso de traer los datos de cada fuente hacia el entorno de Customer Insights, con una frecuencia de actualización definida (tiempo real, diaria, semanal según la fuente). Una fuente de facturación que cambia una vez al día no necesita ingesta en tiempo real; los eventos de interacción sí pueden requerirla.
- **Unificación de perfiles (identity resolution):** el proceso de decidir que dos o más registros de fuentes distintas representan al mismo cliente. No es un simple `JOIN` por ID, porque las fuentes rara vez comparten una clave — se combinan reglas de coincidencia exacta (mismo email) y reglas difusas (nombre + empresa + teléfono parecidos) con un umbral de confianza.
- **Reglas de matching — ejemplo concreto:** para unificar un Contact de Dataverse con un registro de facturación legado, una regla razonable es: `(email exacto) O (nombre normalizado + dominio de empresa coinciden Y teléfono coincide en los últimos 7 dígitos)`. Sin una regla explícita como esta, el sistema puede crear perfiles duplicados (el mismo cliente aparece dos veces) o fusionar por error a dos clientes distintos con nombres parecidos — ambos son errores costosos, pero de naturaleza opuesta.
- **Enriquecimiento:** una vez unificado el perfil, se le agregan atributos derivados que ninguna fuente tenía por sí sola — por ejemplo, "categoría de cliente" calculada a partir del valor combinado de Sales + facturación, no solo del campo nativo de una tabla.
- **Medidas (measures) — ejemplo concreto:** una medida es un valor calculado sobre el perfil unificado, no un campo capturado. Ejemplo: `Valor de vida del cliente (LTV) = suma de Opportunities ganadas (Sales) + suma de facturas pagadas (billing) de los últimos 24 meses`. Otra medida común: `Casos abiertos en los últimos 90 días` (Customer Service) como indicador de riesgo de insatisfacción. Estas medidas alimentan segmentos y journeys que ningún campo nativo de Sales/Service podría calcular solo.
- **Segmentación en la capa Data vs. en Journeys:** un segmento en Customer Insights - Data se define sobre el perfil unificado y sus medidas (ej. "LTV > 20000 Y casos abiertos = 0"); ese segmento puede luego activarse hacia Journeys para orquestar comunicación, o hacia otros destinos (una audiencia de Ads, un reporte de Power BI). La segmentación del Lab 58 (Journeys) ya asume que este perfil unificado existe — este módulo cubre cómo se construye antes de llegar a esa etapa.
- **Activación de datos:** el paso de llevar un segmento o medida de Customer Insights - Data hacia un sistema de destino (Journeys para journeys en tiempo real, Dataverse para que Sales vea la medida en el formulario de Account, o una plataforma de publicidad). Sin activación, el perfil unificado es solo un reporte — el valor real aparece cuando un segmento dispara una acción en otro sistema.
- **Customer 360:** el resultado visible de todo lo anterior — una vista consolidada de un cliente que muestra, en un solo lugar, su relación comercial (Sales), su historial de servicio (Customer Service), su valor financiero (billing/measures) y su estado en journeys activos, sin que el usuario tenga que abrir 3 sistemas distintos.
- **Privacidad y gobierno de datos:** unificar fuentes externas (sobre todo archivos o sistemas legados) exige revisar con Legal/Compliance qué datos se pueden ingerir, cuánto tiempo se retienen, y qué propósito declarado tiene cada uso — igual que el consentimiento del Lab 58, pero aplicado también a las fuentes de origen, no solo al canal de comunicación final.
- **Límites — cuándo NO se necesita Customer Insights - Data:** si toda la información relevante del cliente ya vive en Dataverse (Sales + Service) y no hay fuentes externas que unificar, una vista o un reporte de Power BI sobre Dataverse puede ser suficiente — introducir Customer Insights - Data sin una necesidad real de unificación multi-fuente es sobre-ingeniería.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Toma dos fuentes hipotéticas de un cliente (por ejemplo, un Contact de Dataverse con email `ana.rivera@contoso.com` y un registro de un CSV de facturación con el nombre "A. Rivera" y teléfono con los mismos últimos 7 dígitos) y escribe la regla de matching exacta que decidiría si son la misma persona.
2. Define una medida propia (no uses el ejemplo de LTV de arriba) que combine datos de al menos 2 fuentes distintas, y escribe su fórmula en una línea.
3. Diseña un segmento sobre el perfil unificado (usando tu medida del paso 2) y describe a qué destino lo activarías y qué acción dispararía ahí.
4. Identifica un dato de una fuente externa hipotética (por ejemplo, historial de compras de un sistema de e-commerce legado) que NO deberías ingerir sin antes consultar con Legal/Compliance, y explica por qué.

### 💼 Casos Reales de Negocio
Una cadena de retail unificó su Dataverse (Sales/Service) con su sistema de punto de venta (POS) legado sin definir una regla de matching explícita — el equipo asumió que el email bastaba. El resultado: el 12% de los clientes con compras en tienda física (sin email registrado en el POS) quedaron sin unificar, apareciendo como "nuevos" en cada visita y perdiendo su historial de fidelización. La corrección requirió agregar una regla de matching secundaria por teléfono + nombre normalizado, y reprocesar la ingesta completa. La lección: la regla de matching no es un detalle técnico menor, es una decisión de negocio que determina si el Customer 360 realmente representa al cliente.

### ✅ Buenas Prácticas
- Definir la regla de matching ANTES de conectar fuentes, no ajustarla reactivamente después de ver duplicados en producción.
- Documentar cada medida con su fórmula exacta y las fuentes que combina — una medida sin fórmula documentada es imposible de auditar cuando un número "no cuadra".
- Tratar la activación como el objetivo real del proyecto, no la unificación en sí misma — un Customer 360 que no activa nada hacia Journeys, Dataverse o reporting no genera valor de negocio.
- Involucrar a Legal/Compliance en la decisión de qué fuentes externas se ingieren, con el mismo rigor que el consentimiento de canal del Lab 58.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Asumir que el email siempre existe en todas las fuentes | No auditar la calidad de datos de la fuente antes de definir el matching | Definir una regla de matching secundaria (teléfono, nombre + empresa) para registros sin email |
| Medida sin fórmula documentada | Se calcula "a ojo" en una consulta ad-hoc no repetible | Documentar la fórmula exacta y las fuentes de cada medida antes de usarla en un segmento |
| Unificar fuentes externas sin revisión de Legal/Compliance | Se trata como un problema puramente técnico | Aplicar el mismo proceso de aprobación de propósito y retención que al consentimiento de canal |
| Construir Customer 360 sin definir ningún destino de activación | Foco en la unificación como fin en sí mismo | Definir desde el diseño inicial hacia dónde se activará cada segmento o medida |

### 🧪 Criterios de Validación
- [ ] Escribí una regla de matching explícita que combina al menos 2 condiciones
- [ ] Definí una medida propia con su fórmula y las fuentes que combina
- [ ] Diseñé un segmento sobre el perfil unificado y definí su destino de activación
- [ ] Identifiqué un dato externo que requeriría revisión de Legal/Compliance antes de ingerirse

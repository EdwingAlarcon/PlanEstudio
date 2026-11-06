---
moduleId: 66
title: "Capstone Enterprise D365 — Arquitectura CE, Contact Center, Field Service e Integración F&O"
level: "d365"
certification: "D365 Especialización Portfolio"
estimatedMinutes: 22
practiceMinutes: 210
slug: "capstone-enterprise-d365"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 210 min, mejor en tres sesiones (flujo y Fit-Gap; diagnóstico y roadmap; reto de transferencia y portafolio). La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Integrar Sales, Customer Service, Contact Center, Customer Insights, Field Service y Finance & Operations en una propuesta enterprise defendible, con alcance, arquitectura, matriz de datos, roadmap, riesgos, licencias y evidencias de portafolio que puedas presentar tanto en una entrevista de Solution Architect como en una revisión ejecutiva real.

> **Cómo está organizado este módulo:** es el cierre del nivel D365 y un módulo de **decidir y defender**. Primero trazas el flujo end-to-end con el producto responsable de cada tramo (Microlección 1); después haces el **fit-to-standard** y el **Fit-Gap** con la matriz de datos (Microlección 2); diagnosticas un UAT que "pasó" y un ensayo end-to-end que falló; en la Microlección 3 decides y defiendes la estrategia de salida (big bang, por fases o en paralelo) con una rúbrica y un resumen ejecutivo; y cierras con un reto de transferencia en otro negocio. No hay una única respuesta correcta: la evidencia son tus decisiones escritas con sus razones.
>
> **Antes de empezar, necesitas:**
> - Ningún nivel de certificación: el módulo es transversal. Te conviene haber hecho los Módulos 57 a 65 de este nivel, porque aquí se combinan, no se vuelven a explicar; si te falta alguno, cada referencia lleva su número para que vuelvas a él.
> - **No necesitas tenant.** El Fit-Gap, las matrices, el roadmap y los diagramas son el entregable central y se hacen en papel. Ejecutar el flujo completo en vivo exige ambientes de CE y F&O conectados y licencias de cada producto; un ambiente Developer de Power Platform no instala las apps de Dynamics 365 y las trials duran 30 días. Si tienes una trial de alguna app, úsala solo para comprobar un tramo, sin depender de ella.
> - Una hoja de cálculo o un documento para las matrices, y una herramienta de diagramas (Mermaid sirve).
> - Los casos de este módulo son **ilustrativos**: sus cifras sirven para razonar, no son datos de empresas reales.

### 📖 Conceptos Clave
- **Capstone enterprise:** evidencia final que demuestra criterio de consultoría (decisiones, trade-offs, secuenciación) — no solo la capacidad de navegar pantallas de cada producto.
- **Proceso end-to-end — con producto responsable por tramo:** campaña/segmento (Customer Insights - Journeys, Módulo 64) → lead (Sales) → oportunidad (Sales, Módulo 61) → venta/orden (Sales → F&O, Módulos 60 y 65) → caso (Customer Service, Módulo 62) → conversación (Contact Center, Módulo 63) → work order (Field Service, Módulo 59) → factura/ERP (F&O) → fidelización (Customer Insights - Data, Módulo 58, que retroalimenta el ciclo). Ningún tramo de este flujo pertenece a un solo producto — es la integración completa la que se defiende en el capstone.
- **Fit-to-standard antes del Fit-Gap:** la guía de implementación de Dynamics 365 recomienda empezar **todo** proyecto con un análisis *fit-to-standard* (comparar los procesos del cliente con los procesos estándar del catálogo de procesos de negocio y configurarlos), con la cultura de "adoptar siempre que se pueda, adaptar solo cuando se justifique"; el *fit-gap* viene **después** y decide cómo cubrir cada brecha: personalización o extensión, una solución de un partner, o no cubrirla. Antes de personalizar, Learn pide pesar el costo de construir y mantener, el impacto en usabilidad y rendimiento, el riesgo de que una versión futura lo traiga de serie y el efecto en los procesos conectados ([Learn: fit-to-standard y fit-gap](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/process-focused-solution-fit-to-standard-fit-gap-analysis)).
- **Fit-Gap:** documento que decide, proceso por proceso, qué se configura estándar (sin personalizar), qué se personaliza dentro de la plataforma, qué se resuelve con integración a otro sistema, y qué explícitamente queda fuera de alcance en esta fase.
- **Arquitectura de datos:** Account/Contact como base compartida de CE (Módulo 57), perfiles unificados y medidas en Customer Insights - Data, journeys para activación de esos perfiles, y F&O como dueño de los procesos ERP (order-to-cash, procure-to-pay) con ownership definido vía la matriz del Módulo 65.
- **Licenciamiento:** Sales, Customer Service, Contact Center, Customer Insights, Field Service y F&O tienen licencias/capacidades distintas, con pools de licenciamiento separados entre CE y F&O (Módulo 60). Un capstone serio marca explícitamente qué licencias asume por rol/usuario, no las omite "para simplificar".
- **Ambientes y ALM:** DEV/TEST/PROD, soluciones versionadas, variables de entorno, pipelines de despliegue, ownership de componentes y estrategia de datos de prueba — la disciplina de ALM de Power Platform (si ya hiciste el Módulo 19, es la misma), aplicada a un alcance multi-producto.
- **Estrategia de salida (release strategy):** Learn describe tres modelos ([Learn: deployment and release](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/implementation-strategy-define-strategy-deployment-release)). **Big bang:** todo el alcance para todos los usuarios el mismo día; sirve en implementaciones pequeñas y simples o con alto apetito de riesgo, pero un fallo afecta a todos, no hay aprendizaje de salidas anteriores y Learn lo considera poco ideal en la nube, que se actualiza cada pocas semanas o meses. **Por fases:** por módulos, prioridad de negocio, unidad de negocio o geografía; reduce el riesgo y mejora la adopción, a cambio de más salidas, migración de datos escalonada, posible fatiga de cambio e **interfaces temporales** con el sistema anterior. **En paralelo:** los dos sistemas vivos a la vez, con doble digitación; Learn lo presenta más como técnica de validación y advierte que puede esconder pruebas y formación pobres.
- **Pruebas por proceso:** Learn pide conectar cada caso de prueba con el proceso de negocio que valida, probar los procesos **end-to-end**, fijar criterios de entrada y salida (entry/exit criteria) por ciclo y cerrar con un ciclo final que incluya un ensayo de cutover (mock cutover) y la aprobación de negocio ([Learn: testing strategy](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/testing-strategy)).
- **Operación:** SLA (Módulo 62), unified routing (Módulo 63), Schedule Board (Módulo 59), mobile offline (Módulo 59), monitoreo de integración CE+F&O (Módulo 65), soporte post-go-live y plan de adopción por rol de usuario.
- **Evidencia de portafolio:** diagramas de arquitectura y de proceso, matrices (Fit-Gap, ownership de datos), backlog priorizado, plan de UAT por proceso (no por producto aislado), dashboards ejecutivos y una demo narrada que conecte los 6 productos en una sola historia de negocio.
- **Requisitos reales de práctica:** el Fit-Gap, las matrices, el roadmap y los diagramas de arquitectura pueden construirse sin tenant, como el entregable central de este capstone. Ejecutar el flujo end-to-end en vivo (crear la Opportunity, generar el caso, ver el Work Order, confirmar la factura en F&O) requiere ambientes reales conectados de CE y F&O, licencias de cada producto y datos maestros consistentes entre sistemas.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — El hilo del capstone: un flujo, diez pasos, un producto responsable por tramo

**¿Qué vas a aprender?** A elegir el caso del capstone y trazar el flujo end-to-end en 10 pasos, con el producto responsable y el sistema dueño del dato en cada paso.

**¿Por qué existe esto?** Un capstone que se presenta producto por producto ("esto es Sales, esto es Field Service") es una demo de pantallas. El flujo con dueño por tramo es lo que deja ver las costuras: el paso en que el dato cambia de sistema es justo donde fallan los proyectos.

**Elige un caso:** empresa de servicios técnicos B2B con venta consultiva, soporte premium y mantenimiento preventivo. Puedes reutilizar Andina Servicios Industriales del [Lab 71](/labs/lab-71-jr-001-model-driven-app-job-test) o SIT de los [Labs 66](/labs/lab-66-sales-lead-to-cash) y [81](/labs/lab-81-d365-sales-forecasting-pipeline-review).

**Ejemplo resuelto — los tres primeros pasos:**

| Paso | Qué pasa | Producto responsable | Sistema dueño del dato | Costura con el paso siguiente |
|---|---|---|---|---|
| 1 | Se segmenta a los clientes con contratos que vencen en 90 días | Customer Insights - Data (Módulo 58) | Customer Insights - Data (perfil unificado) | El segmento alimenta un journey |
| 2 | Un journey ofrece la renovación por correo | Customer Insights - Journeys (Módulo 64) | Customer Insights - Journeys (consentimiento) | La respuesta crea un lead |
| 3 | El lead se califica y se convierte en oportunidad | Sales (Módulo 61) | Dataverse | La oportunidad ganada genera una orden que va a F&O |

**Ahora haz algo — micropráctica (6 min):** → **[Asignar producto y dueño a cada tramo del flujo](/practica/ip-d365-031-flujo-end-to-end-con-dueno)**. Selecciona las asignaciones que defenderías y mira la consecuencia de cada una.

**Práctica en papel (30 min) — el flujo completo.**

1. Completa la tabla del ejemplo hasta el paso 10, desde la campaña hasta la renovación, usando como plantilla la cadena de los Conceptos Clave.
2. En la columna "Costura", escribe para cada cambio de sistema qué patrón lo resuelve (Módulo 65: dual-write, virtual table, business event, lotes).
3. Dibuja el flujo en Mermaid con un color o una forma distinta para los pasos que viven en F&O.
4. Marca los dos pasos que, si fallan, frenan a más personas: serán candidatos a probar primero.

**Trial si la tienes (opcional):** si tienes una trial de Sales, Customer Service o Field Service, recorre solo **uno** de tus pasos y anota qué registro se crea y en qué tabla de Dataverse. No construyas el capstone sobre una trial que vence en 30 días.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Caso elegido | ___ |
| Los 10 pasos con producto responsable (enlace a tu tabla o diagrama) | ___ |
| Costuras entre sistemas y patrón de cada una | ___ |
| Los dos pasos críticos y por qué | ___ |
| (Trial) Paso recorrido y tabla donde quedó el registro, o "variante en papel" | ___ |

---

## 🧩 Microlección 2 — Fit-to-standard primero, Fit-Gap después, y la matriz de datos

**¿Qué vas a aprender?** A no empezar por las brechas: primero ver qué cubre el estándar, después decidir cada brecha con sus factores, y cerrar con la matriz de datos de los 10 objetos del capstone.

**¿Por qué existe esto?** Learn advierte que recrear los procesos del sistema anterior lleva a personalizaciones caras que hay que diseñar, programar, probar, formar y documentar. Un Fit-Gap que arranca por "lo que el cliente pide" en vez de por "lo que el producto ya hace" infla el alcance antes de la primera fase.

**Ejemplo resuelto — dos filas del Fit-Gap:**

| Proceso | Estándar (fit-to-standard) | Gap | Decisión | Riesgo | Owner | Evidencia |
|---|---|---|---|---|---|---|
| Mantenimiento preventivo por contrato | Field Service: agreements que generan work orders (Módulo 59) | Ninguno relevante | Configurar estándar | Calendarios de agreement mal definidos | Consultor Field Service | Agreement de prueba que genera la work order |
| Aprobación de descuentos > 15 % | Sales no la trae tal cual | Regla de aprobación por monto | Personalizar con un flujo de aprobación en la plataforma | Flujo dependiente de una cuenta personal | Arquitecto CE | Diseño del flujo y su dueño (cuenta de servicio) |

**Práctica en papel (40 min) — Fit-Gap y matriz de datos.**

1. Crea una matriz Fit-Gap con **12 filas**: proceso, estándar, gap, decisión, riesgo, owner y evidencia. Incluye al menos un gap por cada uno de los 6 productos (Sales, Customer Service, Contact Center, Customer Insights, Field Service, F&O).
2. Para cada fila con decisión "personalizar", escribe en una frase cuál de los factores de Learn pesó más (costo de mantener, rendimiento, posible redundancia con una versión futura, procesos conectados).
3. Al menos una fila debe terminar en "fuera de alcance en esta fase", con la razón.
4. Crea la matriz de datos con Account, Contact, Opportunity, Case, Conversation, Work Order, Product, Sales Order, Invoice e Inventory, indicando sistema dueño, consumidores y patrón (reutiliza el criterio del Módulo 65). Si tu caso tiene varias compañías en F&O, añade la columna "compañía / entidad legal".

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Número de filas que se resolvieron con estándar | ___ |
| El gap más caro y el factor de Learn que lo decidió | ___ |
| Fila fuera de alcance y su razón | ___ |
| Objeto de la matriz de datos con dueño F&O que más consumidores tiene | ___ |
| Objeto cuyo dueño no pudiste decidir y a quién se lo preguntarías | ___ |

---

## 🔧 Diagnosticar — el UAT que pasó y el ensayo que falló

Antes de la Microlección 3, resuelve este caso empezando por el síntoma:

**[Diagnosticar: todos los UAT aprobados y el ensayo end-to-end falla](/practica/ip-d365-032-uat-por-producto-ensayo-falla)**

Síntoma: los equipos de Sales, Customer Service, Field Service y F&O aprobaron su UAT al 100 %, cada uno por separado. En el ensayo de cutover, el primer recorrido completo (oportunidad → orden → caso → work order → factura) se detiene al facturar el servicio en F&O porque el cliente no existe allí. Formula tu hipótesis antes de ver la causa: ¿qué faltó en la estrategia de pruebas y en la matriz de datos, y qué cambiarías en los criterios de salida?

---

## 🧩 Microlección 3 — La salida a producción: decidir y defender (sin pasos)

**¿Qué vas a aprender?** A elegir la estrategia de salida con los pros y contras que documenta Learn, a definir criterios de salida medibles por fase y a resumir la decisión para un comité ejecutivo.

**¿Por qué existe esto?** La pregunta de entrevista de Solution Architect de este nivel es: *"El cliente quiere lanzar Sales, Service, Field Service e integración F&O en una sola salida a producción, ¿qué le responderías?"* La respuesta esperada no es "nunca big bang": es una recomendación con valor incremental que cita el riesgo concreto (ownership de datos sin probar, adopción sin plan), como en el Caso Real de este módulo, y que reconoce lo que cuesta.

**🏗️ Reto (sin pasos): elige big bang, por fases o en paralelo y defiéndelo.** Para el caso que elegiste en la Microlección 1:

> **Restricciones:** el sistema anterior de servicio técnico tiene contrato de soporte hasta dentro de 9 meses; el comité ejecutivo quiere ver valor en el primer trimestre; 40 técnicos de campo nunca han usado una app móvil de trabajo; Finanzas no acepta dos sistemas facturando a la vez más de un mes; el equipo de implementación son 6 personas.
> **Escribe:** la estrategia elegida, el orden de las fases (por ejemplo: piloto CE con Sales + Customer Service, Contact Center, Field Service, Customer Insights, integración F&O, hardening ALM) o la razón para no usar fases, **al menos un criterio de salida medible por fase**, las interfaces temporales que necesitarás con el sistema anterior, los supuestos de licencia por producto y qué riesgo aceptas.
> **Cierra con un resumen ejecutivo de cinco líneas:** qué se decide, qué valor llega primero, qué riesgo queda, qué se mide y qué se le pide al comité.

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Decides por restricción, no por costumbre | Cada estrategia descartada tiene al lado la restricción que la descarta |
| La afirmación está respaldada | Los pros y contras que usas son los de Learn y los enlazas |
| Cada fase tiene salida medible | Hay un número o un hecho verificable por fase ("90 % de casos con SLA aplicado en 2 semanas"), no "cuando esté estable" |
| Las costuras están en el plan | Dices en qué fase entra la integración F&O y qué interfaz temporal cubre el hueco mientras tanto |
| Licencias y tenant declarados | Hay una línea de supuestos de licencia por producto y de ambientes necesarios |
| El ejecutivo entiende la decisión | El resumen cabe en cinco líneas, sin siglas sin explicar, e incluye un riesgo |

**Para cerrar (5 min):** lista qué requiere tenant real en tu propuesta: licencias por producto, ambientes conectados, canales configurados, usuarios, datos maestros, integraciones activas y permisos administrativos.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Estrategia elegida y la restricción que descarta cada alternativa | ___ |
| Fases en orden con su criterio de salida | ___ |
| Interfaces temporales con el sistema anterior | ___ |
| Supuestos de licencia por producto | ___ |
| Riesgo aceptado | ___ |
| Tu resumen ejecutivo de cinco líneas | ___ |

---

## 🔁 Reto de transferencia — un distribuidor de maquinaria agrícola en tres países

El mismo método en un negocio distinto. Un **distribuidor de maquinaria agrícola** vende tractores y cosechadoras a través de concesionarios en tres países, ofrece contratos de mantenimiento con visitas al campo, atiende reclamos por teléfono y WhatsApp en temporada de cosecha (cuando el volumen se triplica) y factura con normas fiscales distintas en cada país. Un país (el más pequeño) ya tiene su ERP en F&O; los otros dos usan sistemas locales que se retiran en 18 meses.

**[Transferir: el distribuidor de maquinaria agrícola](/practica/ip-d365-033-distribuidor-maquinaria-agricola)** — decide la estrategia de salida, el criterio de cada fase y qué no meter en la primera. Si solo memorizaste "por fases y listo", este reto te va a pedir **por qué fases** (producto, geografía o prioridad de negocio).

Cierra el reto con un **roadmap de una página** (fases, criterio de salida de cada una, interfaces temporales) y un **ADR de media página** (Contexto, Opciones, Decisión, Consecuencias) contrastado con la rúbrica de la Microlección 3.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Eje de tus fases (producto, geografía o prioridad) y por qué | ___ |
| Qué país y qué productos van primero | ___ |
| Cómo evitas lanzar en temporada de cosecha | ___ |
| Interfaces temporales con los sistemas locales | ___ |
| Criterio de salida de la primera fase | ___ |
| Consecuencia que aceptas en tu ADR | ___ |

---

### 💼 Casos Reales de Negocio
Una organización quiso implementar Sales, Service, Field Service e integración ERP en una sola salida a producción. El alcance parecía "integrado", pero no había ownership de datos definido, ni pruebas por canal, ni plan de adopción para los técnicos que usarían la app móvil de Field Service en campo. El primer intento de UAT reveló decenas de vacíos simultáneos en 4 productos distintos, y el proyecto estuvo a punto de cancelarse por falta de confianza del comité ejecutivo. Se rescató dividiéndolo en fases con valor incremental: pipeline comercial primero, luego SLA y casos, después Field Service operativo, Customer Insights después, y finalmente integración ERP gobernada con su propia matriz de ownership. El capstone replica esa disciplina: arquitectura completa diseñada de una vez, implementación entregada por fases con valor demostrable en cada una.

### ✅ Buenas Prácticas
- Defender una arquitectura end-to-end completa, pero proponer siempre un despliegue por fases con valor incremental, salvo que puedas justificar con restricciones concretas otra estrategia.
- Hacer fit-to-standard antes del Fit-Gap: adoptar el estándar siempre que se pueda y adaptar solo cuando se justifique.
- Incluir licencias y dependencias reales en el diseño; no esconderlas detrás de "se configura después".
- Usar matrices de ownership y Fit-Gap como entregables centrales del capstone, no como anexos opcionales.
- Diseñar UAT por proceso de negocio completo, no por producto aislado — un proceso end-to-end que cruza 3 productos necesita una prueba que cruce los 3, con datos maestros compartidos.
- Escribir un criterio de salida medible por fase y un ensayo de cutover antes de la salida.
- Preparar evidencias que sirvan tanto para una entrevista laboral de Solution Architect como para una revisión ejecutiva real.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Capstone como demo de pantallas | Falta arquitectura, matrices y evidencia de decisión | Entregar diagramas, matrices, UAT y justificación de cada decisión |
| Alcance de big bang | Se confunde visión integral de arquitectura con despliegue simultáneo | Proponer roadmap por fases con criterios de salida medibles |
| Fit-Gap que empieza por las brechas | Se copian los procesos del sistema anterior | Fit-to-standard primero con el catálogo de procesos; el Fit-Gap solo para lo que el estándar no cubre |
| Todos los UAT aprobados y el proceso completo falla | Cada equipo probó su producto con sus propios datos | Casos de prueba conectados al proceso end-to-end, datos maestros compartidos y un ensayo de cutover como criterio de salida |
| Licencias omitidas del diseño | Se evita la conversación comercial de licenciamiento | Declarar supuestos de licencia por producto desde el primer diagrama |
| Integración ERP diseñada tardíamente | Se diseña CE completo sin definir ownership de datos con F&O | Incluir la matriz CE + F&O desde la fase 0 del roadmap |
| Fases sin interfaces temporales | Se asume que el sistema anterior desaparece en la primera salida | Listar qué interfaz temporal cubre cada hueco hasta la última fase |

### 🧪 Criterios de Validación
- [ ] Diseñé un flujo end-to-end de 10 pasos con producto responsable y sistema dueño por cada paso
- [ ] Construí matrices Fit-Gap (con fit-to-standard previo) y de ownership de datos con al menos un gap por producto
- [ ] Diagnostiqué el UAT por producto que pasó y el ensayo end-to-end que falló, formulando la hipótesis antes de ver la causa
- [ ] Decidí y defendí la estrategia de salida con roadmap por fases, criterios de salida, interfaces temporales y dependencias de licencia/tenant, y respondí la pregunta de entrevista sobre big bang vs. por fases
- [ ] Completé el reto de transferencia del distribuidor de maquinaria agrícola con su roadmap y su ADR
- [ ] Preparé evidencias de portafolio defendibles en entrevista y en revisión ejecutiva
- [ ] Relacioné este módulo con el [Lab 90](/labs/lab-90-capstone-enterprise-d365) (Capstone Enterprise D365) y los labs 81-89 que lo preceden

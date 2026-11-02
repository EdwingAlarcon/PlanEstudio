---
moduleId: 20
title: "Dynamics 365 CE — Sales y Customer Service"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 25
practiceMinutes: 300
slug: "dynamics-365-ce-sales-y-customer-service"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Configurar y personalizar Dynamics 365 Customer Engagement entendiendo primero las capacidades estándar: Sales, Customer Service, Customer Insights y Field Service. El foco es mapear procesos reales contra entidades estándar, evitar duplicidad innecesaria y diseñar integraciones coherentes entre ventas, servicio, marketing, atención en campo y plataformas ERP/F&O.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica en un ambiente de Dynamics 365 con **evidencia** (el dato exacto que viste, no un "sí, funcionó"). En la Microlección 4 vas a **diagnosticar** un SLA que falla sin motivo antes de ver la causa, y el módulo cierra con un reto de construcción sin pasos y un **reto de transferencia** con otro cliente.
>
> **Antes de empezar — este módulo necesita aplicaciones de Dynamics 365 (lee esto, ahorra una tarde):**
> - **Tu ambiente Developer del curso NO sirve aquí.** En un ambiente Developer no se pueden instalar apps de Dynamics 365, y un ambiente solo con Dataverse no trae Lead, Opportunity, Quote, Case, Entitlement ni SLA. Ya lo viste en el Módulo 16: Opportunity y Competitor solo existen con las apps de Dynamics 365.
> - **Necesitas dos trials:** uno de **Dynamics 365 Sales** (Microlecciones 1 a 3) y otro de **Dynamics 365 Customer Service** (Microlecciones 4 y 5). Para Sales, Microsoft ofrece un [trial gratuito](https://dynamics.microsoft.com/en-us/sales/sales/free-trial/); para Customer Service, entra en la [página de Dynamics 365 Customer Service](https://www.microsoft.com/dynamics-365/products/customer-service) y pulsa **Try for free** ([Learn: activar el trial de Customer Service](https://learn.microsoft.com/dynamics365/customer-service/implement/try-customer-service)), o pídelo al administrador del tenant ([Learn: ambientes de prueba](https://learn.microsoft.com/power-platform/admin/trial-environments)). Cuenta 30-45 min por trial entre el alta y el aprovisionamiento. La duración y las condiciones las define Microsoft y cambian: verifícalas al activarlo. Cada trial crea **su propio** ambiente y **no comparten datos**: no esperes ver en Customer Service las cuentas que creaste en Sales. Detalle en [Entornos y trials](/recursos/entornos-y-trials) y [D365 Tenant Readiness](/recursos/d365-tenant-readiness).
> - **Cuenta:** la misma cuenta de trabajo o estudio del Módulo 1 (no una cuenta personal de Outlook/Hotmail). Al crear el trial, elige **English (United States)** como idioma, igual que el ambiente del curso: las etiquetas de este módulo están en inglés.
> - **Nombres nuevos de las apps de servicio:** Microsoft renombró el centro de administración y el espacio de trabajo de servicio. En Learn y en tu trial verás **Copilot Service admin center** (configuración: SLA, entitlements, routing, reglas de correo) y **Copilot Service workspace** (la app multisesión de los representantes). La antigua **Customer Service Hub** ya no está disponible para organizaciones nuevas con licencias Enterprise ([Learn: retiro de Customer Service Hub](https://learn.microsoft.com/dynamics365/customer-service/administer/faq-csh-removal)).
> - **Variante sin trial:** si no puedes activar los trials, cada microlección tiene un recuadro **Sin trial** con la evidencia de diseño que sí puedes entregar. Esa ruta no valida temporizadores, colas ni forecast ejecutándose: anótalo así en tu evidencia, y los criterios de validación marcan qué exige trial.

### 📖 Conceptos Clave
- **Modelo estándar antes de personalizar:** Dynamics 365 Sales y Customer Service ya incluyen tablas, formularios, vistas, procesos y experiencias de usuario probadas. Antes de crear una tabla custom, el consultor debe mapear el proceso contra entidades estándar: `Lead`, `Opportunity`, `Account`, `Contact`, `Quote`, `Order`, `Invoice`, `Case`, `Queue`, `Knowledge Article` y `SLA KPI Instance`. Personalizar sin revisar lo estándar aumenta costo, deuda técnica y fricción en actualizaciones.
- **Lead-to-cash en Sales:** proceso comercial completo desde captura de lead hasta orden/facturación. Flujo típico: `Lead` calificado → `Opportunity` con stakeholder, necesidad y monto estimado → productos y price list → `Quote` activada → `Order` cuando el cliente acepta. En proyectos reales, el diseño debe decidir qué vive en Sales y qué se delega a ERP/F&O para pricing avanzado, inventario, crédito, impuestos y facturación.
- **Cuentas y contactos:** `Account` representa organizaciones o clientes empresa; `Contact` representa personas. Un error frecuente es usar una tabla custom de "cliente" y perder integración nativa con actividades, oportunidades, casos, marketing y Customer Insights. Si el cliente pide atributos adicionales, se agregan columnas a las entidades estándar salvo que exista una razón de dominio muy fuerte para separar.
- **Catálogo de productos, price lists y unidades:** Sales usa unit groups, productos, listas de precios y price list items para cotizar con consistencia, y se configuran en un orden fijo (unidades → productos → price lists → price list items). Un price list item une producto, unidad y precio; su **Pricing Method** puede ser un monto fijo (**Currency Amount**) o un porcentaje del precio de lista o del costo. Los descuentos por volumen no van en el price list item: van en una **Discount List** asociada. Si el pricing depende de reglas complejas de ERP, descuentos por contrato, impuestos o disponibilidad de inventario, Dynamics 365 Sales debe integrarse con F&O o el sistema ERP en vez de duplicar lógica financiera en Dataverse ([Learn: definir precios](https://learn.microsoft.com/dynamics365/sales/create-price-lists-price-list-items-define-pricing-products)).
- **Sales Accelerator:** herramienta de D365 Sales que crea y ejecuta **sequences** (secuencias) de actividades para los vendedores — emails, llamadas, tareas, tiempos de espera y condiciones. Ejemplo: una secuencia "Seguimiento Propuesta" que 1 día después del envío de propuesta crea una tarea de llamada, y si no hay respuesta en 3 días crea un email de seguimiento. Se configura en Sales Hub → **Change area** → **Sales Insights settings** → **Sales accelerator** → **Sequences** ([Learn: crear una secuencia](https://learn.microsoft.com/dynamics365/sales/create-and-activate-a-sequence)).
- **Predictive Lead/Opportunity Scoring:** modelo de machine learning de D365 Sales que, a partir del historial de oportunidades ganadas y perdidas, asigna un puntaje a cada oportunidad abierta (por ejemplo 80 frente a 50) y muestra los factores que más influyen. Requisito de datos: al menos **40 oportunidades ganadas y 40 perdidas**, creadas y cerradas dentro de la ventana de entrenamiento elegida (de 3 meses a 2 años). Con licencia Sales Enterprise se activa desde la configuración rápida de scoring con un cupo de 1.500 registros puntuados al mes; el resto de la funcionalidad avanzada depende de la licencia ([Learn: predictive opportunity scoring](https://learn.microsoft.com/dynamics365/sales/configure-predictive-opportunity-scoring)).
- **Forecasting y gestión de pipeline:** Sales permite forecast por periodos, jerarquías y equipos. Las columnas del forecast son, sobre todo, **rollups** que suman el **Est. Revenue** de las oportunidades agrupadas por su **Forecast category** (Pipeline, Best case, Committed, Won, Lost…), filtradas por **Est. Close Date**; se agregan columnas **Calculated** (fórmulas entre columnas) y **Simple** (por ejemplo la cuota, que se carga desde Excel). Con forecasting premium aparece además una columna **Prediction**. El forecast **no** pondera por probabilidad: si el negocio quiere "pipeline ponderado", es una métrica aparte que hay que diseñar ([Learn: columnas del forecast](https://learn.microsoft.com/dynamics365/sales/choose-layout-and-columns-forecast)).
- **Dynamics 365 App for Outlook y Teams:** Outlook permite trackear emails, citas y contactos contra registros de Dynamics 365; Teams facilita colaboración contextual sobre cuentas, oportunidades y casos. No deben usarse como "extras bonitos": son parte de la adopción, porque reducen doble captura y llevan CRM al flujo de trabajo diario.
- **Copilot aplicado a ventas:** Copilot ayuda a resumir registros, preparar comunicaciones, priorizar oportunidades y acelerar seguimiento. Debe implementarse con gobierno de datos: permisos correctos, calidad de actividades, privacidad y entrenamiento de usuarios para no delegar decisiones comerciales críticas sin revisión humana.
- **Case Management:** núcleo de D365 Customer Service para gestionar incidencias de clientes desde apertura hasta resolución. Cada caso tiene número, cliente, descripción, prioridad, estado, SLA aplicado, actividades (emails, llamadas, tareas), y puede relacionarse con un producto o un entitlement. El ciclo de vida del caso suele guiarse con un BPF.
- **Copilot Service workspace:** la app multisesión de los representantes (antes Customer Service workspace): varias sesiones y pestañas en una sola ventana, bandeja de entrada estilo Outlook, conocimiento y Copilot (resumir casos y conversaciones, redactar respuestas). Es además la app donde unified routing asigna el trabajo. En implementaciones nuevas debe evaluarse antes de diseñar una app custom para representantes.
- **SLA (Service Level Agreement):** se configura en **Copilot Service admin center** en dos piezas: los **SLA KPIs** (qué se mide: por ejemplo primera respuesta con el campo `FirstResponseByKPI`, y desde cuándo: **Applicable From**) y el **SLA** con sus **SLA items** (cuándo aplica: **Applicable When**; cuándo se cumple: **Success Conditions**; tiempos de advertencia y fallo: **Warn and Fail Duration**; horario: **Business Hours**). Las acciones de advertencia, éxito y fallo se configuran en un flujo de Power Automate predefinido. Solo **un** SLA se aplica a un registro a la vez ([Learn: configurar SLA](https://learn.microsoft.com/dynamics365/customer-service/administer/define-service-level-agreements)).
- **Cómo llega un SLA a un caso:** por un flujo, workflow o plug-in que lo asigna; por el **entitlement** del caso; manualmente; o porque es el **SLA por defecto** (**Set As Default**). La aplicación busca primero el SLA asignado automáticamente, luego el del entitlement y por último el predeterminado ([Learn: aplicar SLA](https://learn.microsoft.com/dynamics365/customer-service/administer/apply-slas)).
- **Entitlement:** registro que define los derechos de soporte de un cliente: **Allocation Type** (número de casos o de horas), **Total Term**, canales permitidos (**Entitlement Channel**), productos y contactos cubiertos, vigencia y el **SLA** asociado. El campo **Decrease Remaining On** decide si el saldo baja al **crear** el caso o al **resolverlo**; **Restrict based on entitlement terms** impide crear casos cuando el saldo se agota. Ejemplo: un cliente Premium con 50 casos al año por cualquier canal; uno estándar solo por email ([Learn: entitlements](https://learn.microsoft.com/dynamics365/customer-service/administer/create-entitlement-define-support-terms-customer)).
- **Queues:** colas de trabajo donde se acumulan casos, emails y tareas pendientes. Los representantes trabajan desde sus colas. Pueden ser públicas o privadas. Para convertir emails en casos, la regla de creación automática **monitorea una cola** con buzón.
- **Routing Rules (basic routing):** reglas de asignación por condiciones del caso (si el asunto contiene "factura", a la cola de Facturación). Es el mecanismo previo a unified routing; al activar unified routing, la regla básica activa deja de enrutar hasta que configuras **intake rules**.
- **Unified Routing:** motor de enrutamiento en dos etapas: **clasificación** (reglas y modelos de ML que agregan información al elemento de trabajo, como las habilidades requeridas; el **intelligent skill finder** usa un modelo de AI Builder para predecir habilidades) y **asignación** (prioriza y asigna según skills, capacidad y disponibilidad). Se configura con **workstreams** (modo **Push** o **Pick**), **intake rules**, reglas de clasificación, reglas **route-to-queue** y capacidad por unidades o por perfil. Los usuarios deben estar configurados como *bookable resource* y trabajar en Copilot Service workspace ([Learn: unified routing](https://learn.microsoft.com/dynamics365/customer-service/administer/overview-unified-routing)).
- **Knowledge Base:** repositorio de artículos de soporte con ciclo de vida (borrador, revisión, publicación). Se vinculan a casos para trackear qué artículos resolvieron qué problemas, y el representante puede buscarlos y enviarlos desde el caso. Copilot Studio puede usar la KB como fuente de conocimiento.
- **Pause/Resume de SLA:** un SLA item con **Allow Pause and Resume** activado pausa el temporizador mientras el caso está en un estado que configuraste como "en espera" (por ejemplo, esperando respuesta del cliente), para que ese tiempo no cuente contra el representante. Los estados en espera se definen en **Service Configuration Settings**, y la pausa también puede definirse por condiciones en el KPI o en el SLA item. Ojo: **Allow Pause and Resume** no se puede cambiar después de guardar el SLA item por primera vez. Sin esta configuración, un caso que espera 3 días una respuesta del cliente aparece como incumplimiento de SLA que en realidad no es responsabilidad del representante.
- **Métricas operativas de servicio:** un dashboard de Customer Service maduro reporta como mínimo: *First Response Time* (tiempo hasta la primera respuesta), *Resolution Time* (tiempo hasta el cierre), *SLA Success Rate* (% de casos resueltos dentro del SLA), *Backlog* (casos abiertos sin resolver, especialmente los vencidos), y *CSAT* conceptual (satisfacción del cliente, típicamente vía encuesta post-cierre). Sin estas métricas, un supervisor no puede distinguir entre un equipo con carga alta pero eficiente y uno con problemas reales de desempeño.
- **Canales digitales y voz:** Customer Service puede integrarse con conversación, voz y mensajería digital según licenciamiento; esa capa vive hoy en Dynamics 365 Contact Center. El nombre histórico "Omnichannel for Customer Service" sigue apareciendo en clientes existentes, pero su app de representantes está retirada en favor de Copilot Service workspace; valida siempre la oferta vigente para el tenant.
- **Autoservicio con Power Pages:** un portal de Power Pages puede exponer a los clientes la creación y consulta de sus propios casos, y la búsqueda de Knowledge Articles publicados, sin consumir una licencia de representante. Reduce volumen de casos simples (reseteo de contraseña, preguntas frecuentes ya documentadas en la KB) antes de que lleguen a una cola — el mismo patrón que verás con Power Pages en el Módulo 21, aplicado específicamente a autoservicio de soporte.
- **Copilot para representantes de servicio:** Copilot puede resumir casos y conversaciones, sugerir respuestas, recuperar conocimiento y acelerar resolución. La calidad depende de datos, artículos KB, permisos y proceso; no reemplaza un modelo claro de escalamiento ni una base de conocimiento gobernada.
- **Customer Insights - Data:** plataforma CDP para construir perfiles unificados desde fuentes como Dataverse, Dynamics 365, data lakes, archivos o sistemas externos. Su valor no es "otro CRM", sino una vista 360 del cliente basada en identificación, unificación, enriquecimiento, medidas y segmentos. Debe usarse cuando Sales/Service no tienen por sí solos una visión completa del cliente.
- **Customer Insights - Journeys:** aplicación para orquestar journeys en tiempo real usando segmentos, triggers, emails, SMS/push según disponibilidad, personalización y consentimiento. Se diferencia del marketing clásico por reaccionar a eventos del cliente y usar datos unificados, no solo listas estáticas o campañas masivas.
- **Consentimiento y compliance:** Customer Insights - Journeys requiere perfiles de cumplimiento, propósitos, temas, centros de preferencias y registros de consentimiento. En proyectos reales, el consentimiento se diseña con Legal/Compliance desde el inicio; no se agrega al final como campo booleano improvisado.
- **Field Service:** aplicación D365 para coordinar servicio en campo: work orders, recursos, scheduling, bookings, customer assets, incident types, inspections, inventory, acuerdos y experiencia móvil para técnicos. Encaja cuando el trabajo ocurre fuera de oficina y requiere planificación, desplazamiento, evidencias, materiales o historial de activos.
- **Work order lifecycle:** ciclo operativo de Field Service donde una orden pasa por estados como unscheduled, scheduled, in progress, completed, posted o canceled. El arquitecto debe distinguir `Work Order` (trabajo a ejecutar) de `Booking` (asignación concreta de recurso/tiempo) y de `Case` (solicitud de soporte que puede originar el trabajo).
- **Schedule board y recursos:** el dispatcher asigna work orders considerando ubicación, disponibilidad, skills, prioridad y ventanas de servicio. Puede hacerlo manualmente, con Scheduling Assistant o con optimización avanzada cuando el volumen y restricciones lo justifican.
- **Field Service mobile e inspections:** los técnicos usan la app móvil para ver bookings, navegar al cliente, registrar tiempo, productos/servicios, fotos, firmas, inspecciones y notas. Si el servicio requiere captura estructurada, una inspection template evita evidencias incompletas y mejora trazabilidad.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Mapear contra lo estándar antes de personalizar

**¿Qué vas a aprender?** A decidir, para cada paso del proceso del cliente, si lo resuelve una entidad estándar de Dynamics 365, si es un gap que se cubre con configuración o integración, o si de verdad justifica una tabla custom.

**¿Por qué existe esto?** El error más caro en un proyecto de Dynamics 365 no es técnico: es construir en Dataverse lo que la app ya trae (o lo que debería vivir en el ERP). Una tabla `sit_cliente` paralela a **Account** pierde actividades, oportunidades, casos, marketing y Customer Insights; un cálculo de impuestos en Sales duplica lógica que el ERP ya gobierna. Regla del módulo: **una tabla custom solo se aprueba si no existe entidad estándar razonable o si mezclar conceptos compromete seguridad, reporting o propiedad de datos.**

**Ejemplo pequeño:**

| Paso de negocio | Entidad estándar candidata | ¿Fit, gap o custom? | Decisión |
|---|---|---|---|
| Prospecto solicita información | Lead | Fit | Usar Lead estándar |
| Cliente acepta propuesta | Quote / Order | Fit parcial | Quote en Sales, Order validada contra ERP |
| Solicitud de soporte premium | Case + Entitlement + SLA | Fit | Usar Customer Service |
| Descuento requiere aprobación financiera | Opportunity + Power Automate / ERP | Gap | Flujo de aprobación + validación ERP |

**Ahora haz algo — micropráctica (6 min):** antes de abrir el trial, decide qué es estándar, qué es gap y qué es custom en un caso nuevo → **[Fit-gap: ¿estándar, gap o custom?](/practica/ip-d365-001-fit-gap-estandar-o-custom)**.

**Práctica real en tu trial de Sales (20 min):**

1. Abre tu trial de Dynamics 365 Sales y entra a la app **Sales Hub**. En el mapa del sitio (izquierda) confirma que ves **Leads**, **Opportunities**, **Accounts** y **Contacts**.
2. En [make.powerapps.com](https://make.powerapps.com), con el ambiente del trial seleccionado (selector de ambiente arriba a la derecha), ve a **Tables** y busca `Quote`, `Order`, `Invoice` y `Competitor`. Anota si existen. Repite la búsqueda en el ambiente Developer del curso: ahí **no** deberían aparecer Quote ni Competitor (es exactamente lo que viste en el Módulo 16).
3. Toma el proceso de ventas y servicio de una empresa real o simulada (o el de SIT: venta de licencias + soporte) y completa la matriz de arriba con **al menos 6 pasos** propios. Para cada "custom" escribe en una frase por qué no sirve la entidad estándar.

**Si no lo ves:** si **Sales Hub** no aparece en la lista de apps, entraste al ambiente equivocado: el trial crea un ambiente nuevo con un nombre propio; búscalo en el selector de ambiente.

> **Sin trial:** haz solo el paso 3 y, en el paso 2, comprueba en tu ambiente Developer que `Quote` y `Competitor` no existen. Esa ausencia es tu evidencia de por qué se necesita el trial.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre exacto del ambiente del trial de Sales | ___ |
| ¿Existen `Quote` y `Competitor` en el trial? ¿Y en tu ambiente Developer? | ___ |
| Número de pasos de tu matriz y cuántos quedaron como fit / gap / custom | ___ |
| El paso que marcaste como "custom" y la razón en una frase (o "ninguno" y por qué) | ___ |

---

## 🧩 Microlección 2 — Lead-to-quote-to-order: catálogo, BPF y cotización

**¿Qué vas a aprender?** A preparar el catálogo en el orden que exige Sales, a guiar la oportunidad con un business process flow (BPF) y a llevar una cotización hasta pedido sin capturar precios a mano.

**¿Por qué existe esto?**
- **El catálogo tiene un orden obligatorio:** unit group → producto → price list → price list item. Si falta el price list item, la línea de la cotización no encuentra precio ([Learn: catálogo paso a paso](https://learn.microsoft.com/dynamics365/sales/set-up-product-catalog-walkthrough)).
- **El BPF guía; no calcula:** un BPF muestra etapas y pasos (obligatorios o no) en la barra superior del formulario. Las etapas pueden llevar una **categoría** (Qualify, Develop…) y disparar workflows, pero **no** asignan por sí solas una probabilidad a la oportunidad. Si el negocio quiere "Negociación = 60%", es una decisión de diseño que se implementa aparte (y que el forecast, como verás en la Microlección 3, no usa) ([Learn: crear un BPF](https://learn.microsoft.com/power-automate/create-business-process-flow)).
- **Estados de la cotización:** una Quote nace en borrador (*draft*), se **activa** cuando está lista para el cliente y, si el cliente acepta, se convierte en Order; si no, se cierra como revisada, cancelada o perdida. No existe un estado "Presented". Mientras está en borrador, los precios se recalculan contra la price list; una vez activa, el monto queda bloqueado ([Learn: cotizaciones](https://learn.microsoft.com/dynamics365/sales/create-edit-quote-sales)).
- **La frontera con el ERP:** Dynamics 365 Sales **no calcula automáticamente el impuesto de cada producto** (lo capturas por línea y Sales solo suma), no descuenta inventario y no emite la factura fiscal. Eso vive en el ERP/F&O (Módulo 34) ([Learn: pedidos](https://learn.microsoft.com/dynamics365/sales/create-edit-order-sales)).

**Práctica real en tu trial de Sales (45 min):**

*Parte A — el catálogo (15 min)*

1. En **Sales Hub** selecciona **Change area** (abajo a la izquierda) → **App Settings**. En el área **Product Catalog** verás las opciones del catálogo.
2. **Product Catalog** → **Unit Groups** → **New**. **Name:** `Licencias`; **Primary Unit:** `Por usuario/mes` (la unidad mínima en la que vendes; no se puede borrar después). **OK**. No necesitas más unidades para esta práctica ([Learn: unit groups](https://learn.microsoft.com/dynamics365/sales/create-unit-group-add-units-that-group)).
3. **Product Catalog** → **Families and products** → **Add Product**. **Name:** `Licencia Power Platform Premium`; **Product ID:** `SIT-PPP-01`; **Unit Group** y **Default Unit:** los del paso 2; **Decimals Supported:** `0`. **Save**. (El **Default Price List** queda de solo lectura hasta que guardes: lo llenarás al final.)
4. **Product Catalog** → **Price Lists** → **New**. **Name:** `Lista Estándar 2026`, **Currency:** la de tu trial (por ejemplo US Dollar). **Save**.
5. En esa price list, pestaña **Price List Items** → **New Price List Item**: **Product** = tu licencia, **Unit** = Por usuario/mes; en la pestaña **Pricing information**, **Pricing Method** = **Currency Amount** y **Amount** = `38`. **Save & Close**.
6. Vuelve al producto, asígnale `Lista Estándar 2026` como **Default Price List** y en la barra de comandos selecciona **Publish**: el producto pasa de borrador a **Active**. Solo los productos publicados se pueden elegir en oportunidades y cotizaciones ([Learn: publicar un producto](https://learn.microsoft.com/dynamics365/sales/publish-product-bundle-make-available-selling)).

*Parte B — el BPF de venta consultiva (15 min)*

7. En [make.powerapps.com](https://make.powerapps.com) (ambiente del trial) → **Solutions** → crea una solución `SIT Ventas` con un publisher de prefijo `sit` → dentro de ella **New** → **Automation** → **Process** → **Business process flow**. **Display name:** `Proceso Venta Consultiva`; tabla **Opportunity**; **Create**.
8. Arrastra desde **Components** cuatro **Stage**: `Descubrimiento`, `Propuesta`, `Negociación`, `Cierre`. En cada etapa (**Details**) agrega **Data Step** con una columna de Opportunity; marca **Required** en al menos uno de **Descubrimiento** (por ejemplo **Budget Amount**) y uno de **Propuesta**. Usa la columna estándar que tenga más sentido; si un paso del diseño no tiene columna estándar (por ejemplo "Contrato en revisión legal"), anótalo como gap en lugar de crear una columna ahora.
9. **Validate** → **Save** → **Activate**. Con **Edit Security Roles** confirma qué roles pueden usarlo (por defecto solo System Administrator y System Customizer). Si ya hay otro BPF para Opportunity, revisa **Order Process Flow**: el primero al que el usuario tenga acceso es el que se asigna a los registros nuevos.

*Parte C — oportunidad → quote → order (15 min)*

10. En **Sales Hub** crea una cuenta `Contoso SIT` y una **Opportunity** para ella con **Price List** = `Lista Estándar 2026`. Comprueba que el formulario muestra la barra de `Proceso Venta Consultiva` (si ves otro proceso, usa **Switch Process**). Agrega el producto con cantidad `10`.
11. En la pestaña **Quotes** de la oportunidad, **New Quote**. Verás que la cotización trae los productos de la oportunidad. Abre la línea y comprueba que el precio unitario vino de la price list (38) sin que lo escribieras. En la línea, escribe en el campo **Manual Discount** el importe `38` (es un importe, no un porcentaje: el 10% de 380) y guarda; el importe de la línea queda en 342.
12. **Activate Quote**. Luego **Create Order**; en el diálogo, **Date Won** queda en la fecha de hoy; **OK**.
13. Abre el pedido creado: comprueba que tiene las mismas líneas y el mismo total que la cotización, y anota el valor de **Prices Locked**.

**Si no lo ves:** "la línea no trae precio" → el producto no tiene price list item en la price list de la cotización, o la moneda de la cotización y la de la price list no coinciden (deben ser la misma). "No aparece **Create Order**" → la cotización sigue en borrador: primero **Activate Quote**. "No veo el BPF en la oportunidad" → no está activado o tu rol no tiene privilegio sobre él.

> **Sin trial:** dibuja el BPF (etapas, pasos, cuáles son obligatorios) y calcula a mano la cotización: 10 × 38 = 380, menos 10% = 342. Anota qué campo del ERP recibiría la orden (impuesto, inventario, factura) y por qué no lo calculas en Sales.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Pricing Method y Amount de tu price list item | ___ |
| Etapas del BPF y qué pasos marcaste como Required | ___ |
| Precio unitario que trajo la línea de la Quote antes del descuento (¿lo escribiste tú?) | ___ |
| Total de la Quote activada y total del Order creado | ___ |
| Valor de **Prices Locked** en el Order | ___ |

---

## 🧩 Microlección 3 — Forecast por categoría, no por probabilidad

**¿Qué vas a aprender?** Cómo calcula Sales el forecast y por qué no coincide con el "pipeline ponderado" que muchos gerentes calculan en Excel.

**¿Por qué existe esto?** El forecast de Sales suma el **Est. Revenue** de las oportunidades según su **Forecast category** (Pipeline, Best case, Committed, Won, Lost…) y su **Est. Close Date** dentro del período. Un gerente que espera ver `monto × probabilidad` en la grilla va a pensar que "el forecast está mal". Las dos métricas son válidas, pero son distintas, y el consultor tiene que explicarlo antes de que el cliente lo descubra. Sin configurar nada, cada usuario ya tiene en **Performance** → **Forecasts** un forecast predeterminado del mes en curso, basado en la jerarquía de usuarios (campo **Manager**) y con columnas Quota, Committed, Best Case, Pipeline, Omitted, Won y Lost ([Learn: ver forecasts](https://learn.microsoft.com/dynamics365/sales/view-forecasts)). Un forecast configurado por el administrador ([Learn: configurar forecasts](https://learn.microsoft.com/dynamics365/sales/configure-forecast)) se recalcula cada 24 horas o con **Recalculate data**; el predeterminado se actualiza casi en tiempo real.

**Ejemplo pequeño — pipeline ponderado (cálculo manual, de diseño):**

| Oportunidad | Monto | Probabilidad que asigna el negocio | Monto ponderado |
|---|---:|---|---:|
| Renovación Contoso | $12,000 | Negociación (60%) | $7,200 |
| Nueva cuenta Fabrikam | $8,000 | Propuesta (30%) | $2,400 |
| Ampliación Litware | $20,000 | Cierre (90%) | $18,000 |
| **Total ponderado** | | | **$27,600** |

**Práctica real en tu trial de Sales (30 min):**

1. Crea (o edita) estas tres oportunidades con **Est. Close Date** dentro del mes en curso, un **Est. Revenue** igual al monto de la tabla, y esta **Forecast category**: Contoso = **Committed**, Fabrikam = **Pipeline**, Litware = **Best case**. Asegúrate de que tú eres el owner.
2. En el mapa del sitio de **Sales Hub** ve a **Performance** → **Forecasts**. Verás el forecast predeterminado del mes en curso (su nombre es del tipo "My FY2026 November forecast").
3. Anota los valores de las columnas **Committed**, **Best Case** y **Pipeline** para tu usuario.
4. Compara con el total ponderado de la tabla (27.600). Escribe en dos frases por qué no coinciden y cuál de las dos métricas le mostrarías a un director comercial para el cierre del trimestre.

**Si no lo ves:** si una oportunidad no aparece en el forecast, revisa su **Est. Close Date** (fuera del período no se suma) y su owner (el forecast se arma por la jerarquía de usuarios). Si cambiaste una oportunidad y el forecast no lo refleja, recarga la página. (Opcional: un administrador puede activar en **Change area** → **App Settings** → **Performance management** → **Forecast configuration** un **Sample Forecast** con varios períodos; ese sí necesita **Recalculate data** tras cambiar las oportunidades.)

> **Para saber más (opcional, no evaluable en este módulo):** las sequences de Sales Accelerator y el predictive opportunity scoring se configuran en **Sales Insights settings**. El scoring no funcionará en un trial recién creado: exige 40 oportunidades ganadas y 40 perdidas en la ventana de entrenamiento. El forecast avanzado (cuotas, ajustes, jerarquía) se ejercita en el [Lab 81](/labs/lab-81-d365-sales-forecasting-pipeline-review).

> **Sin trial:** completa la tabla de abajo poniendo en la columna "Committed / Best case / Pipeline" lo que **esperas** que muestre el forecast según las categorías del paso 1, y explica la diferencia con el ponderado.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre exacto del forecast que abriste | ___ |
| Valores de Committed, Best case y Pipeline en la grilla (o los esperados, sin trial) | ___ |
| Total ponderado manual | ___ |
| Por qué no coinciden (dos frases) | ___ |

---

## 🧩 Microlección 4 — Casos, entitlement y SLA con horario y pausa

**¿Qué vas a aprender?** A armar un SLA de primera respuesta que se calcula en horas hábiles, que llega al caso a través del entitlement del cliente y que se pausa mientras el caso espera al cliente.

**¿Por qué existe esto?** Un SLA mal armado es peor que no tener SLA: marca incumplimientos que no lo son (horas de noche, espera del cliente) o no se aplica nunca (nadie lo asignó al caso). Los tres errores típicos son: no asociar el horario (sin **Business Hours** cuenta 24×7), no configurar pausa (la espera del cliente cuenta contra el representante) y creer que el SLA se aplica solo (hace falta un entitlement con SLA, un SLA por defecto o un flujo que lo asigne).

**Práctica real en tu trial de Customer Service (50 min):** todo se hace en **Copilot Service admin center**, salvo el paso 8.

1. **Horario:** mapa del sitio → **Operations** → **Calendar** → sección **Customer service calendar** → **Manage** → **New**. **Name:** `Horario Bogotá L-V`; en **Weekly Schedule** elige **Are the same each day**, marca lunes a viernes en **Work Days**, **Set Work Hours** de 8:00 a 18:00, y en **Time Zone** la de Bogotá. **Save** ([Learn: horario de servicio](https://learn.microsoft.com/dynamics365/customer-service/administer/create-customer-service-schedule-define-work-hours)).
2. **Estados en espera:** en **Operations** → **Service terms**, busca **Other SLA Settings** → **Manage** → **Service Configuration Settings** y confirma qué estados de Case cuentan como "on hold" (por ejemplo, el de espera de detalles del cliente). Anota cuáles son.
3. **SLA KPI:** **Operations** → **Service terms** → sección **SLA KPIs** → **Manage** → **New**. **Name:** `Primera respuesta`; **Entity Name:** Case; **KPI Field:** `FirstResponseByKPI`; **Applicable From:** **Created On**. **Save** → **Activate**.
4. **SLA:** **Service terms** → **Service Level Agreements (SLAs)** → **Manage** → **New**. **Name:** `SLA Soporte Estándar`; **Primary Entity:** Case. **Save**.
5. **SLA item:** en el SLA, **New SLA Item**. **Name:** `Primera respuesta 4h`; **KPI:** `Primera respuesta`; activa **Allow Pause and Resume** (no se puede cambiar después del primer guardado); **Business Hours:** `Horario Bogotá L-V`. En **Applicable When**, una condición simple que se cumpla en todos tus casos de prueba (por ejemplo, Priority no vacía); en **Success Conditions**, la condición que marque la primera respuesta: la columna **First Response Sent** = Yes (existe en la tabla Case aunque no esté en tu formulario; el editor de condiciones lista las columnas de la tabla). Si no la encuentras o no puedes marcarla en tus casos de prueba, usa **Status** = Resolved: para la prueba basta con que el KPI tenga una condición de éxito que puedas provocar. **Warn and Fail Duration:** advertencia 2 horas, fallo 4 horas. **Save**. (Opcional: **Configure Actions** abre el flujo predefinido con las ramas **Is Nearing Non-Compliance**, **Is Succeeded** e **Is Non-compliant**; no edites las ramas, solo agrega acciones dentro.) **Activate** el SLA.
6. **Entitlement:** **Service terms** → sección **Entitlements** → **Manage** → **New** → **Blank Entitlement**. **Name:** `Contoso Premium 2026`; **Primary Customer:** una cuenta de prueba; fechas de hoy a fin de año; **SLA:** `SLA Soporte Estándar`; **Allocation Type:** número de casos; **Decrease Remaining On:** creación del caso; **Total Term:** `50`; **Restrict based on entitlement terms:** Yes. **Save** → **Activate** ([Learn: entitlements](https://learn.microsoft.com/dynamics365/customer-service/administer/create-entitlement-define-support-terms-customer)).
7. **(Opcional) email-to-case:** si tu trial tiene una cola con buzón sincronizando, en **Customer support** → **Case Settings** → **Automatic record creation and update rules** → **Manage** → **New** puedes crear una regla con **Queue to monitor** = esa cola y **Activity type to monitor** = **Email**, agregar al menos una condición, revisar el flujo con **Save and open in Power Automate** y activarla. Si no tienes buzón, sáltalo: la regla no se puede activar sin cola ([Learn: reglas de creación automática](https://learn.microsoft.com/dynamics365/customer-service/administer/automatically-create-update-records)).
8. **Probar:** en **Copilot Service workspace**, crea un caso para la cuenta del entitlement y selecciona el entitlement en el campo **Entitlement**. Guarda y busca en el caso la sección de detalles del SLA mejorado (temporizador y SLA KPI instance con su estado y su hora de fallo). Anota la hora de fallo y comprueba que respeta el horario (un caso creado a las 17:00 de un viernes no debería fallar a las 21:00). Luego pon el caso en uno de los estados en espera del paso 2 y mira el estado de la SLA KPI instance; vuelve a activarlo y mira cómo cambió la hora de fallo. Abre el entitlement: **Remaining Term** debería haber bajado a 49.

**Si no lo ves:** "el caso no tiene temporizador ni SLA KPI instance" → el SLA no está activo, el caso no tiene entitlement con SLA (y no hay SLA por defecto), o el caso no cumple **Applicable When**. "La hora de fallo está 4 horas exactas después aunque es de noche" → el SLA item no tiene **Business Hours**. "Al poner el caso en espera el temporizador sigue corriendo" → resuélvelo en el diagnóstico de abajo.

**🔧 Diagnosticar antes de construir (5 min):** a un compañero le pasa justo eso: sus casos en espera del cliente siguen consumiendo SLA. Encuentra la causa antes de ver la solución → **[Diagnosticar: el SLA sigue corriendo con el caso en espera](/practica/ip-d365-002-sla-no-se-pausa)**.

> **Sin trial:** escribe la configuración completa (horario, KPI, SLA item con sus cuatro secciones, entitlement) en una tabla y calcula a mano la hora de fallo de un caso creado el viernes a las 17:00 con advertencia 2 h y fallo 4 h hábiles. Indica que no validaste temporizador ni pausa ejecutándose.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Estados de Case configurados como "on hold" en tu trial | ___ |
| Hora de creación del caso de prueba y **hora de fallo** de su SLA KPI instance | ___ |
| Estado de la SLA KPI instance con el caso en espera, y hora de fallo después de reactivarlo | ___ |
| **Remaining Term** del entitlement antes y después de crear el caso | ___ |
| ¿Configuraste email-to-case? Si sí, nombre de la cola y número de caso que se creó desde un email | ___ |

---

## 🧩 Microlección 5 — Enrutamiento unificado, conocimiento y Copilot

**¿Qué vas a aprender?** Cómo se decide a qué cola y a qué representante llega un caso con unified routing, y cómo se gobiernan la KB y Copilot para que ayuden en vez de inventar.

**¿Por qué existe esto?** El caso real de este módulo (una mesa de ayuda que mandaba casos de SAP a especialistas de Power BI) se resuelve con dos decisiones de diseño: **clasificar** el caso (qué habilidad necesita) y **asignarlo** (quién la tiene y tiene capacidad). Unified routing separa esas dos etapas: intake rules eligen el workstream, las reglas de clasificación agregan información (por ejemplo, la skill `SAP`), las reglas route-to-queue eligen la cola y el método de asignación elige al representante ([Learn: configurar record routing](https://learn.microsoft.com/dynamics365/customer-service/administer/set-up-record-routing)).

**Práctica (35 min; los pasos 3 a 5 requieren trial y son opcionales si tu trial aún no tiene unified routing aprovisionado):**

1. **Diseña** las reglas en una tabla antes de tocar nada:
   ```
   Si Asunto contiene "factura" OR "cobro" OR "pago"
     → cola Soporte Facturación
   Si Asunto contiene "error" OR "falla" OR "no funciona"
     → cola Soporte Técnico
     → requiere skill SQL_Server (nivel ≥ 3) si Descripción contiene "base de datos"
   En otro caso → cola Soporte Técnico
   ```
   Para cada regla anota si es de **intake**, **clasificación** o **route-to-queue**.
2. **Diseña** la gobernanza de conocimiento y Copilot: 5 artículos KB con owner y fecha de revisión; qué puede resumir Copilot (historial del caso, última conversación, artículos relacionados, próximos pasos) y qué controles aplicas (el representante revisa antes de enviar, datos sensibles fuera de prompts externos).
3. En **Copilot Service admin center** → **Customer support** → **Routing**: si **Record routing** está disponible, **Manage** → **Add** → **Record type** = Case. Si Learn te pide aprovisionar unified routing primero, hazlo solo en el trial (Learn advierte que es una importación de solución que afecta la carga del ambiente).
4. **Customer support** → **Workstreams** → **New workstream**: **Name** `WS Casos Soporte`, **Work distribution mode** **Push**, **Type** **Record**, **Record type** Case → **Create**. En **Intake rules** → **Create rule** con una condición sobre el caso. Configura la regla route-to-queue de "factura" hacia una cola `Soporte Facturación` con al menos un miembro.
5. Crea dos casos de prueba ("Error en la factura de octubre" y "La app no funciona") y anota a qué cola llegó cada uno. Recuerda: los usuarios deben estar configurados como bookable resource y recibir el trabajo en **Copilot Service workspace**.

**Si no lo ves:** "el caso no se asigna" → la cola no tiene miembros, el representante no está como bookable resource, su presencia no está entre las permitidas del workstream o no tiene capacidad. "Ningún caso entra al workstream" → falta la intake rule (al activar unified routing, la regla básica activa deja de enrutar hasta que la configuras).

**Diseño mínimo de Customer Insights y Field Service (10 min, sin trial):**
- *Customer Insights:* el área comercial quiere contactar clientes con contrato próximo a vencer, solo si tienen consentimiento válido y no tienen un caso crítico abierto. Identifica qué 3-4 fuentes alimentarían el perfil unificado (Sales, Customer Service, billing/ERP, consentimiento) y escribe en una frase la regla del segmento y el evento que dispara el journey. El diseño completo se ejercita en el **[Lab 58](/labs/lab-58-customer-insights-segmento-journey)**.
- *Field Service:* un cliente reporta falla de un equipo en garantía. Escribe la secuencia mínima Case → validación de Entitlement → Work Order → Booking → ejecución móvil → cierre, y qué dato de garantía o SLA decide si el Work Order se crea. El diseño completo se ejercita en el **[Lab 59](/labs/lab-59-field-service-work-order-uat)**.
- *Adopción comercial (Outlook/Teams):* define 3 reglas de adopción (oportunidad sin actividad en 7 días → alerta; quote sin respuesta en 5 días hábiles → tarea; descuento mayor a 15% → aprobación antes de enviar).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus reglas de enrutamiento, cada una con su tipo (intake / clasificación / route-to-queue) | ___ |
| Cola a la que llegó cada caso de prueba (o "sin trial: diseño") | ___ |
| Owner y fecha de revisión de tus 5 artículos KB, y los controles de Copilot | ___ |
| Regla del segmento de Customer Insights y dato que decide crear el Work Order | ___ |

---

### 🏗️ Reto de construcción (sin pasos, trial de Customer Service)

> **Requerimiento:** SIT agrega un segundo nivel de soporte: un SLA `SLA Soporte Premium` con primera respuesta en 1 hora hábil y resolución en 8 horas hábiles, aplicado a través de un entitlement de **horas** (no de casos) de 40 horas para la cuenta `Fabrikam SIT`, que solo cubre los canales teléfono y email.
> **Criterios de aceptación:** (1) un caso nuevo de Fabrikam muestra dos SLA KPI instances (primera respuesta y resolución) con horas de fallo en horario hábil; (2) al resolver el caso, el **Remaining Term** baja según las horas, de acuerdo con el **Decrease Remaining On** que elijas; (3) un caso de una cuenta sin entitlement no recibe este SLA.
> **Restricciones:** no marques `SLA Soporte Premium` como SLA por defecto; reutiliza el horario de la Microlección 4. Antes de empezar, anota qué valor de **Decrease Remaining On** eliges y por qué.

---

## 🔁 Reto de transferencia — Un distribuidor de equipos médicos

**Requisito nuevo:** un distribuidor de equipos médicos vende contratos de mantenimiento y atiende fallas. Pide: (1) cotizar contratos con precio por equipo y descuento por volumen a partir de 20 equipos; (2) que el soporte de equipos críticos (respiradores) tenga SLA de 2 horas hábiles y que la espera de repuestos del fabricante no cuente; (3) que los casos de respiradores lleguen solo a técnicos certificados; (4) que las visitas al hospital se programen con el técnico más cercano. Sin guía paso a paso, escribe para cada requisito la entidad o capacidad estándar que usarías, qué configurarías y qué evidencia demostraría que funciona.

**Micropráctica de transferencia (6 min):** decide las piezas del distribuidor con feedback inmediato → **[Transferir: distribuidor de equipos médicos](/practica/ip-d365-003-distribuidor-equipos-medicos)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Requisito 1: dónde va el descuento por volumen (y por qué no en el price list item) | ___ |
| Requisito 2: pieza que hace que la espera de repuestos no cuente | ___ |
| Requisito 3: mecanismo de asignación a técnicos certificados | ___ |
| Requisito 4: app o capacidad para programar visitas y por qué no es un Case | ___ |

---

### 💼 Caso Real de Negocio
**Empresa:** Empresa de software con 5,000 clientes y mesa de ayuda de 30 agentes  
**Problema:** Los casos se asignaban por turno rotativo sin considerar el expertise del agente. Un caso de SAP llegaba a un agente de Power BI.  
**Solución:** Unified Routing con skills-based routing. Agentes califican sus skills. Los casos de SAP van automáticamente a agentes con skill SAP nivel ≥ 3. SLA diferenciado para clientes Premium (4h resolución) vs Estándar (24h).  
**Resultado:** First-contact resolution: de 45% a 72%. Satisfacción del cliente (CSAT): de 3.2 a 4.4/5.

**Escenario Customer Insights:** una aseguradora enviaba campañas genéricas a clientes con reclamos abiertos. El equipo integró Customer Insights - Data con Sales, Service y billing, creó segmentos que excluyen casos críticos y orquestó journeys de renovación con consentimiento válido. Resultado esperado: menos quejas por comunicaciones inoportunas y mayor conversión en renovaciones.

**Escenario Field Service:** una empresa de mantenimiento industrial gestionaba visitas en Excel y WhatsApp. Al adoptar Field Service, los casos de soporte generan work orders, el dispatcher asigna técnicos por skill y ubicación, y el técnico captura inspecciones desde móvil. Resultado esperado: menor tiempo de asignación, evidencias auditables y mejor cumplimiento de SLA.

### ✅ Buenas Prácticas
- Siempre asociar **Business Hours** (un customer service calendar con su holiday schedule) a los SLA items — los tiempos deben ser en horas hábiles, no absolutas
- Activar **Allow Pause and Resume** al crear el SLA item cuando el proceso tiene esperas del cliente: no se puede activar después
- Mapear primero contra entidades estándar; personalizar solo cuando el gap esté documentado
- Separar responsabilidades Sales vs ERP: Sales gestiona relación, pipeline y cotización comercial; ERP/F&O gobierna contabilidad, impuestos, inventario, crédito y facturación cuando aplica
- Configurar el catálogo en orden (unidades → productos → price lists → price list items) y nunca capturar precios a mano en la cotización
- Explicar al cliente que el forecast suma por **Forecast category**; si quiere pipeline ponderado, diseñarlo como métrica aparte
- Tener Knowledge Base robusta antes de implementar Copilot Studio para reducir hallucinations
- Unified Routing > Reglas de enrutamiento legacy — migrar si estás en el sistema viejo, y configurar las intake rules antes de activarlo en producción
- Usar entitlements para clientes con niveles de soporte diferenciados, y decidir conscientemente si el saldo baja al crear o al resolver
- En Customer Insights, diseñar consentimiento, exclusiones y preferencias antes de activar journeys
- En Field Service, no confundir Case con Work Order: el caso explica la solicitud; la orden de trabajo coordina ejecución en campo
- Usar assets e incident types para estandarizar diagnóstico, materiales y duración esperada

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| El caso no recibe SLA (sin temporizador ni SLA KPI instance) | Ningún mecanismo lo aplica: el caso no tiene entitlement con SLA, no hay SLA por defecto ni flujo que lo asigne, o el caso no cumple **Applicable When** | Asociar el SLA a un entitlement del cliente o marcar un SLA como **Set As Default**, y revisar las condiciones de **Applicable When** |
| El SLA sigue corriendo con el caso en espera del cliente | El SLA item no tiene **Allow Pause and Resume**, o ese estado no está configurado como "on hold" | Configurar los estados en **Service Configuration Settings** y crear un SLA item nuevo con pausa (no se puede activar en el existente) |
| La hora de fallo cae de noche o en fin de semana | El SLA item no tiene **Business Hours** | Asociar el customer service calendar al SLA item |
| Email-to-Case duplica casos | Las respuestas al email crean casos nuevos o varias reglas procesan el mismo correo | Revisar en la regla la opción de esperar tras resolver el caso relacionado y usar una sola regla por cola (Learn recomienda enrutar varios buzones a una cola única) |
| Routing no asigna a representantes | Cola sin miembros, representante sin bookable resource, presencia no permitida o capacidad agotada | Verificar membresía de cola, bookable resource, presencias permitidas del workstream y capacidad |
| La línea de la Quote no trae precio | Falta el price list item del producto en esa price list, o la moneda no coincide | Crear el price list item en la price list de la cotización, con la misma moneda |
| "El forecast está mal": no coincide con el pipeline ponderado | El forecast suma por Forecast category, no multiplica por probabilidad | Explicar la diferencia y, si el negocio lo pide, diseñar el ponderado como métrica aparte |
| Se crea una tabla custom de Clientes | No se revisó Account/Contact estándar | Extender Account/Contact salvo que exista una justificación fuerte y documentada |
| Pricing duplicado en Dataverse y ERP | Se intentó resolver todo en Sales | Definir sistema maestro: Sales cotiza, ERP valida precio final, impuestos, inventario y crédito |
| Journey enviado sin consentimiento válido | Marketing diseñó la campaña antes de Compliance | Crear compliance profile, propósitos y temas antes de publicar journeys |
| Customer Insights usado como CRM operativo | Se confundió CDP con sistema transaccional | Usar Customer Insights para perfiles, segmentos e insights; mantener operación en Sales/Service/F&O |
| Field Service implementado como calendario simple | Se ignoraron work orders, bookings, skills y assets | Modelar ciclo completo: Case → Work Order → Booking → Mobile execution → cierre |

### 🧪 Criterios de Validación
- [ ] Matriz fit-gap de al menos 6 pasos contra entidades estándar, con la razón de cada "custom", creada antes de personalizar
- [ ] (Trial de Sales) Catálogo en orden: producto con unit group, price list y price list item con **Currency Amount**
- [ ] (Trial de Sales) BPF `Proceso Venta Consultiva` con 4 etapas y pasos obligatorios, activo en el formulario de Opportunity
- [ ] (Trial de Sales) Quote activada y convertida en Order con el precio de la price list y el descuento de línea, sin capturar precios a mano
- [ ] (Trial de Sales) Forecast del mes con las tres oportunidades en Committed / Best Case / Pipeline, y explicación escrita de por qué no coincide con el pipeline ponderado manual
- [ ] (Trial de Customer Service) Caso de prueba con SLA aplicado por entitlement, con hora de fallo en horario hábil
- [ ] (Trial de Customer Service) Caso en espera con el SLA en pausa, y **Remaining Term** del entitlement actualizado
- [ ] Reglas de enrutamiento diseñadas y clasificadas como intake / clasificación / route-to-queue (con trial: casos de prueba en la cola correcta)
- [ ] 5 artículos KB con owner y fecha de revisión, y controles humanos definidos para Copilot
- [ ] Fuentes y regla mínima del segmento de Customer Insights identificadas (detalle completo en Lab 58)
- [ ] Secuencia mínima Case→Entitlement→Work Order→Booking identificada (detalle completo en Lab 59)
- [ ] Resolví el diagnóstico del SLA que no se pausa, el reto de construcción `SLA Soporte Premium` (o su versión de diseño sin trial) y el reto de transferencia del distribuidor de equipos médicos

---

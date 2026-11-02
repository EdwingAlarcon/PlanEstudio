---
moduleId: 40
title: "Arquitectura Power Platform — Casos de Estudio"
level: "arquitecto"
certification: "Arquitectura Power Platform"
estimatedMinutes: 24
practiceMinutes: 170
slug: "arquitectura-power-platform-casos-estudio"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 170 min, mejor en dos sesiones (la primera hasta el diagnóstico; la segunda, la Microlección 3 y el reto de transferencia). La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Desarrollar la mentalidad de Solution Architect en Power Platform mediante casos de estudio de arquitectura, análisis de requerimientos, trade-offs, gobernanza, seguridad, integración y comunicación ejecutiva. La certificación Power Platform Solution Architect Expert y su examen PL-600 se retiraron el 30 de junio de 2026 ([Learn](https://learn.microsoft.com/credentials/certifications/power-platform-solution-architect-expert/)); este módulo conserva las competencias profesionales que siguen siendo válidas aunque la credencial ya no esté disponible. La credencial de arquitecto vigente más cercana es **Microsoft Certified: Agentic AI Business Solutions Architect Expert** (examen **AB-100**), que exige además una certificación Associate como PL-200 o PL-400 y se centra en soluciones de negocio con IA y agentes; mide tres áreas: planificar (35-40 %), diseñar (30-35 %) e implementar (20-25 %) soluciones de negocio con IA ([Learn: AB-100](https://learn.microsoft.com/credentials/certifications/exams/ab-100/)). La versión en inglés del examen se actualiza el **16 de noviembre de 2026**: antes de prepararlo, revisa en su study guide qué cambió. No cubre todo lo que cubría PL-600, así que no la tomes como un reemplazo uno a uno.

> **Cómo está organizado este módulo:** es un módulo de casos. Cada microlección es un caso con restricciones en el que **decides y defiendes**: eliges una opción, escribes el trade-off que aceptas y lo contrastas con una rúbrica explícita ("Criterio | Qué demuestra que lo cumples"). No hay una única respuesta correcta; la evidencia es tu decisión escrita con sus razones. La lente común es **Power Platform Well-Architected**. Después diagnosticarás una arquitectura que falló en producción, empezando por el síntoma, y cerrarás con un reto de transferencia en otro sector.
>
> **Antes de empezar, necesitas:**
> - Haber terminado los Niveles 1 a 3 y los Módulos 31 a 39: aquí se combinan gobernanza, ambientes, integración, seguridad y casos de transformación, no se vuelven a explicar.
> - Tu ambiente **DEV** con la solución `SIT Solicitudes Internas` de los labs 02 a 05.
> - Para la Microlección 1, acceso de solo lectura al [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) con rol de administrador (en tu tenant de prueba ya lo eres). Si no lo tienes, esa práctica tiene una variante en papel.
> - Los casos de este módulo (farmacéutica, distribuidora, energía) son **ilustrativos**: sus cifras sirven para razonar, no son datos de empresas reales.

### 📖 Conceptos Clave de Arquitectura Power Platform

Las competencias se agrupan en las tres áreas con las que Microsoft describía el examen PL-600: **análisis de requisitos y visión de la solución**, **diseño (arquitectura) de la solución** e **implementación** ([Learn](https://learn.microsoft.com/credentials/certifications/power-platform-solution-architect-expert/)).

**Área 1: Analizar requisitos y soluciones existentes**

- **Análisis de requerimientos y soluciones existentes:** el arquitecto revisa soluciones implementadas e identifica debilidades arquitectónicas. La respuesta profesional siempre considera escalabilidad, mantenibilidad y alineación con Power Platform Well-Architected. Nunca se refactoriza solo por preferencia técnica; siempre debe haber una razón de negocio documentada.
- **Evaluación de plataforma vs customización:** el principio rector es "configurar primero, customizar si es necesario, integrar si no hay otra opción, construir desde cero como último recurso". Los escenarios profesionales premian usar capacidades nativas (BPF, Calculated Columns, Business Rules) antes de crear un plugin C# innecesario.
- **Análisis de riesgo y viabilidad:** el arquitecto identifica riesgos de una propuesta y cuantifica su impacto. Preguntas típicas: ¿qué pasa si el sistema externo no tiene API? ¿qué pasa si el cliente no puede proveer usuarios para UAT? ¿qué pasa si el volumen de datos es 10x el estimado?
- **Estrategia de migración de datos:** área donde muchos equipos fallan porque la subestiman. Se debe decidir cuándo usar Data Import Wizard, Azure Data Factory, Power Query u otras herramientas; cómo manejar relaciones; cómo validar integridad; y cuántas iteraciones de migración se necesitan.

**Área 2: Diseñar la solución**

- **Arquitectura de aplicaciones:** decidir cuándo usar Canvas, Model-Driven, Power Pages o Copilot Studio, y cómo organizarlas en soluciones. Learn recomienda **una sola solución** en implementaciones pequeñas y medianas, y capas en ambientes de desarrollo separados (una base Foundation y una solución por dominio) cuando hay varios equipos o ritmos de entrega ([Learn: organizar soluciones](https://learn.microsoft.com/power-platform/alm/organize-solutions)); lo que no conviene es una mega-solución que mezcla equipos y dominios en el mismo DEV.
- **Estrategia de datos y seguridad:** incluye modelo de datos, Business Units, Security Roles, Field Security, Row-Level Security en Power BI y cifrado para datos sensibles. El estudiante debe justificar por qué Dataverse es superior a SharePoint Lists para datos relacionales y transaccionales. Dos piezas que se confunden a menudo: (1) **residencia de datos**: Power Platform guarda los datos en la geografía asignada al tenant salvo que se desplieguen ambientes en otras geografías (*multi-geo*) ([Learn: almacenamiento y gobierno de datos](https://learn.microsoft.com/power-platform/admin/security/data-storage)); (2) **customer-managed key (CMK)**: todo dato de Power Platform ya se cifra en reposo con claves de Microsoft; CMK permite que el cliente gestione la clave desde su Azure Key Vault, pero solo se aplica a **Managed Environments**, exige a los usuarios licencias como Microsoft 365 E5/A5/G5 o los complementos de cumplimiento, y si la clave se revoca el ambiente queda bloqueado ([Learn: customer-managed key](https://learn.microsoft.com/power-platform/admin/customer-managed-key)). CMK es un control más, no "el cumplimiento" de una norma.
- **Integración con otros sistemas:** decidir cuándo usar Power Automate, Azure Logic Apps, Azure Functions y Azure Service Bus, considerando latencia, SLA, costo, throttling y complejidad operativa. Learn resume la elección así: Power Automate para automatización sin código de usuarios de negocio y makers; Logic Apps para orquestar procesos empresariales entre sistemas con diseñador, con **integration account** para B2B/EDI (AS2, X12, EDIFACT, RosettaNet); Azure Functions para orquestación escrita en código ([Learn: Logic Apps](https://learn.microsoft.com/azure/logic-apps/logic-apps-overview)).
- **Estrategia de ALM:** usar managed solutions en TEST y PROD, Connection References y Environment Variables, y Solution Checker con 0 errores críticos antes de aprobar despliegues. Los flujos críticos no deben depender de la cuenta de una persona: Power Automate permite que un **service principal** (application user) sea dueño de un flujo, lo que lo independiza del ciclo de vida del empleado; si el flujo usa conectores premium necesita una licencia **Power Automate Process** o per-flow ([Learn: flujos de service principal](https://learn.microsoft.com/power-automate/service-principal-support)).
- **Estrategia de inteligencia artificial:** cuándo usar AI Builder nativo (sin código, integrado en Power Platform, modelos pre-construidos disponibles), **Foundry Tools** (el nuevo nombre de Azure AI services) directamente (necesidades más específicas o control granular), o modelos de Azure OpenAI (respuestas generativas, clasificación de texto). El arquitecto debe también considerar el costo y la privacidad de datos en cada opción: desde el **1 de noviembre de 2026** las licencias premium nuevas ya no incluyen AI Builder credits y las funciones de AI Builder consumen **Copilot Credits** ([Learn: fin de los AI Builder credits](https://learn.microsoft.com/ai-builder/endofaibcredits)).

**Área 3: Implementar la solución**

- **Guiar al equipo de desarrollo:** el arquitecto no es el que hace todo el código — es el que toma decisiones técnicas, resuelve bloqueos y asegura que el equipo implementa la solución como fue diseñada. La competencia profesional incluye explicar ADRs, facilitar code reviews y balancear velocidad con calidad técnica.
- **Validar que la implementación sigue la arquitectura:** incluye: revisión de código (Solution Checker + revisión manual de plugins y flujos), revisión de seguridad (¿los Security Roles tienen mínimo privilegio?), y revisión de performance (¿las consultas usan filtros delegables? ¿los plugins son async cuando es posible?). El arquitecto firma que la implementación es conforme a la arquitectura antes de aprobar el despliegue a PROD.
- **Gestión de calidad:** métricas de calidad que un equipo puede fijarse para Power Platform (son umbrales de equipo, orientativos, no cifras de Microsoft): Solution Checker sin errores críticos, cobertura de unit tests para plugins C# (por ejemplo, 80 %), tiempo de carga de las Canvas Apps en el camino principal (por ejemplo, menos de 3 segundos) y tasa de flujos fallidos (por ejemplo, menos de 0,5 % en 7 días). Lo importante es definirlos antes del go-live y saber con qué herramienta se mide cada uno.

**La lente común: Power Platform Well-Architected.** Cinco pilares ([Learn: pilares](https://learn.microsoft.com/power-platform/well-architected/pillars)): **Reliability** (resiliencia, disponibilidad, recuperación), **Security** (protección de datos, detección y mitigación de amenazas), **Operational Excellence** (observabilidad, prácticas DevOps, despliegues seguros), **Performance Efficiency** (escalar y atender la demanda) y **Experience Optimization** (usabilidad y experiencias claras). Cada pilar tiene principios de diseño, una **checklist** de recomendaciones y una página de **tradeoffs**: mejorar un pilar casi siempre cuesta algo en otro. Por ejemplo, Learn explica que la fiabilidad suele lograrse con replicación y componentes extra, lo que aumenta la superficie a proteger (Security) y la complejidad operativa (Operational Excellence) ([Learn: tradeoffs de Reliability](https://learn.microsoft.com/power-platform/well-architected/reliability/tradeoffs)). Por eso la evidencia de este módulo siempre incluye **lo que aceptas perder**.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Leer el caso: requisitos, restricciones y lo que el caso no dice

**¿Qué vas a aprender?** A separar en un caso los requisitos explícitos, las restricciones (plazo, normativa, licencias) y los supuestos que nadie escribió, y a descartar opciones porque violan uno de ellos, no porque "suenan peor".

**¿Por qué existe esto?** La mayoría de las malas arquitecturas no fallan por la tecnología elegida, sino por una restricción que nadie leyó: una norma de residencia, una licencia que el cliente no tiene, un plazo que no admite tres integraciones. Este es el caso de partida (ilustrativo):

```
Escenario:
Una empresa farmacéutica con 5,000 empleados en 12 países necesita implementar
un sistema de gestión de ensayos clínicos. Los datos de pacientes son extremadamente
sensibles (HIPAA, GDPR). El sistema debe integrarse con 3 laboratorios externos que
usan sistemas distintos. Los reguladores necesitan acceso de solo lectura a ciertos datos.
El CTO quiere que todo esté funcionando en 8 meses.

Pregunta: ¿Qué componentes de Power Platform usarías y cuáles son los 3 riesgos principales?
```

Un borrador de respuesta, ya corregido contra Learn:

```
Componentes:
- Dataverse como sistema de registro (modelo de datos central)
- Model-Driven App para gestión interna
- Power Pages para el portal de reguladores, con Microsoft Entra External ID
  (Azure AD B2C ya no se vende a clientes nuevos desde el 1 de mayo de 2025)
  y table permissions de solo lectura
- Azure API Management para exponer a los 3 laboratorios una API controlada
- Azure Logic Apps para las integraciones complejas con los laboratorios
- Power BI con RLS para que cada país vea solo sus datos
- Customer-managed key SOLO si la política del cliente exige gestionar la clave:
  requiere Managed Environments y licencias E5/Compliance para los usuarios

Riesgos principales:
1. Residencia: la política del cliente o del regulador puede exigir que ciertos datos
   no salgan de una geografía → ambientes en geografías distintas (multi-geo) y un
   modelo de datos que no mezcle pacientes de regiones distintas en un mismo ambiente
2. Integración con sistemas de salud (HL7/FHIR): no está entre los protocolos B2B que
   lista Logic Apps (AS2, X12, EDIFACT, RosettaNet) → evaluar el servicio o el motor de
   integración específico antes de estimar; impacto directo en el plan
3. 8 meses es agresivo para un sistema con datos de salud y 3 integraciones → negociar
   un MVP con 2 laboratorios primero

Lo que NO haría un arquitecto:
- "Pondría todo en una sola solución con todos los equipos en el mismo DEV"
- "Usaría SharePoint Lists para los datos de pacientes" (no da el modelo relacional
  ni la seguridad por fila que exige el caso)
- "Activo CMK y con eso cumplimos HIPAA y GDPR" (CMK es un control de cifrado,
  no el cumplimiento de una norma)
- "El equipo de desarrollo resolverá la integración, yo solo diseño"
```

**Ahora haz algo — micropráctica (8 min):** → **[Leer el caso de ensayos clínicos y descartar lo que viola una restricción](/practica/ip-arq-031-ensayos-clinicos-restricciones)**. Selecciona las decisiones que defenderías y mira la consecuencia de cada una.

**Práctica real en tu entorno (15 min, solo lectura) — ¿podría tu ambiente cumplir la restricción de cifrado?** No vas a activar nada: solo leer lo que el caso necesitaría.

1. Entra al [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) → en el panel de navegación, **Manage** → en el panel **Manage**, **Environments** → selecciona tu ambiente **DEV**.
2. En la página del ambiente, anota su región y su tipo (aparecen en la sección de detalles del ambiente). Fíjate también si la barra de comandos ofrece **Enable Managed Environments**: si aparece, tu ambiente **no** es un Managed Environment. **No lo actives**: en un tenant real tiene implicaciones de licencias.
3. En el panel de navegación, **Security** → en **Settings**, **Data and Privacy** → **Customer-managed encryption key**. Anota qué muestra la página de **Enterprise policies** (lo normal en un tenant de prueba es que no haya ninguna). **Si no ves la opción o te dice que no tienes permiso**, salta a la variante en papel.
4. **Decisión (papel, 5 min):** con lo que leíste en Learn, escribe qué tendría que pasar para que el ambiente de ensayos clínicos de PROD use CMK: tipo de ambiente, Managed Environments, licencias de los usuarios, quién administra el Key Vault y qué pasa si alguien revoca la clave.

**Variante en papel (sin permisos de administrador):** haz solo el paso 4 y añade por qué un ambiente de prueba (Trial) o de Teams no serviría: Learn indica que no se pueden añadir a la enterprise policy.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Región y tipo de tu DEV (o "variante en papel") | ___ |
| ¿Tu DEV es Managed Environment? (qué viste en la barra de comandos) | ___ |
| Qué muestra **Customer-managed encryption key** en tu tenant | ___ |
| Requisitos para usar CMK en el PROD del caso (ambiente, Managed Environments, licencias) | ___ |
| Qué pasa si se revoca la clave y quién no debería poder hacerlo | ___ |
| Una restricción del caso que el borrador original no cubría | ___ |

---

## 🧩 Microlección 2 — Well-Architected como rúbrica: revisar el SIT que construiste

**¿Qué vas a aprender?** A usar las checklists de Power Platform Well-Architected para evaluar una carga de trabajo real (la tuya), con evidencia observada y no con "creo que sí".

**¿Por qué existe esto?** Revisar una solución existente e identificar sus debilidades es la primera competencia del arquitecto. Hacerlo con una checklist publicada evita que la revisión dependa del gusto del revisor y deja claro qué se mejoró y qué se aceptó.

**Ahora haz algo — antes de abrir nada (3 min):** de 0 a 3, ¿qué nota le pondrías a tu SIT en **Reliability** y en **Security**? Escríbela; la compararás al final.

**Práctica real en tu entorno (30 min):**

1. Abre las checklists de [Reliability](https://learn.microsoft.com/power-platform/well-architected/reliability/checklist) y de [Security](https://learn.microsoft.com/power-platform/well-architected/security/checklist).
2. Evalúa tu solución `SIT Solicitudes Internas` contra estas seis recomendaciones. Para cada una, busca la evidencia en tu DEV (make.powerapps.com → **Solutions** → `SIT Solicitudes Internas`) y anota **cumple / parcial / no cumple** con el dato que lo demuestra:
   - **RE:02** — identificar y clasificar por criticidad los flujos de usuario y de sistema. ¿Cuál es el flujo más crítico del SIT y qué pasa si falla?
   - **RE:05** — manejo de errores y fallos transitorios. ¿El flujo de aprobación del Lab 05 tiene alguna rama que se ejecute cuando una acción falla?
   - **RE:07** — plan de continuidad y recuperación probado. ¿Sabes cómo restaurarías DEV si alguien borra la tabla `Solicitud TI`? (el Lab 115 lo practica)
   - **SE:03** — clasificar los datos por sensibilidad. ¿Qué columna del SIT es la más sensible?
   - **SE:05** — identidad y acceso con mínimo privilegio. ¿Qué security role usa un solicitante y qué puede borrar?
   - **SE:07** — proteger secretos. ¿Hay alguna URL, clave o cuenta escrita a mano dentro de un flujo en vez de en una Environment Variable o una connection reference?
3. Opcional: responde el cuestionario oficial, el [Power Platform Well-Architected Review](https://aka.ms/powa/assessment), y anota el resultado que te muestra por pilar.
4. **Decisión (papel, 5 min):** elige **una** mejora para el SIT y escribe el tradeoff que trae, con la página de tradeoffs del pilar afectado. Ejemplo de la forma: "añadir una rama de reintento y alerta al flujo (Reliability) aumenta la complejidad operativa que hay que documentar (Operational Excellence)".

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu nota previa de Reliability y Security frente a lo que encontraste | ___ |
| RE:02, RE:05, RE:07: cumple/parcial/no y el dato que lo demuestra | ___ |
| SE:03, SE:05, SE:07: cumple/parcial/no y el dato que lo demuestra | ___ |
| Resultado por pilar del Well-Architected Review (si lo hiciste) | ___ |
| La mejora elegida y su tradeoff (pilar que gana y pilar que paga) | ___ |

---

## 🔧 Diagnosticar — la integración nocturna que dejó de llegar

Antes de la Microlección 3, resuelve este caso empezando por el síntoma:

**[Diagnosticar: los pedidos del ERP llevan tres noches sin llegar](/practica/ip-arq-032-integracion-nocturna-sin-dueno)**

Síntoma: una distribuidora integra cada noche los pedidos de su ERP en Dataverse con un cloud flow. Desde hace tres noches los pedidos no llegan, el panel de ventas muestra datos de hace tres días y nadie se enteró hasta que un gerente se quejó. El arquitecto que construyó el flujo dejó la empresa la semana pasada. Formula tu hipótesis antes de ver la causa: ¿qué falló, qué pilares de Well-Architected no se cubrieron y qué cambiarías para que no se repita?

---

## 🧩 Microlección 3 — Vendedores sin cobertura: decidir y defender (sin pasos)

**¿Qué vas a aprender?** A decidir entre opciones que **todas** pueden funcionar, con criterios explícitos, y a resumir la decisión para un ejecutivo en cinco líneas.

**¿Por qué existe esto?** Los casos fáciles tienen una opción absurda y una correcta. Los reales tienen dos o tres razonables. Este caso aparecía en versiones anteriores del curso como pregunta de opción única, con una justificación que Learn ya no respalda: hoy **Canvas y Model-Driven tienen offline-first** sobre Dataverse en la app móvil de Power Apps.

```
Pregunta original: Una empresa quiere que sus 500 vendedores móviles puedan ver y actualizar
datos de clientes desde zonas sin internet. ¿Qué tecnología usarías?

A) SharePoint + Power Automate
B) Canvas App con modo offline habilitado
C) Power Pages
D) Model-Driven App con mobile offline
```

Lo que dice Learn sobre cada opción razonable:

- **Canvas con offline integrado (B):** con Dataverse, al activar el offline en la app y en sus tablas, la app funciona offline-first: los datos se copian al dispositivo, la sincronización es automática con detección de conflictos y sincronización delta. Learn lo recomienda frente a `LoadData`/`SaveData` (resolución de conflictos manual, sin sincronización automática); a cambio, solo admite una parte de las funciones de Power Fx, y por encima de 15 tablas conviene un offline profile propio ([Learn: offline para canvas apps](https://learn.microsoft.com/power-apps/mobile/canvas-mobile-offline-overview)).
- **Model-Driven con mobile offline (D):** el maker define las tablas disponibles offline en el diseñador de apps y la app móvil de Power Apps trabaja offline-first, sincronizando sola cuando vuelve la conexión ([Learn: mobile offline para model-driven](https://learn.microsoft.com/power-apps/mobile/mobile-offline-overview)). No es "más limitado" que Canvas: es otra experiencia (formularios y vistas estándar en lugar de pantallas diseñadas a medida).
- **A** no da experiencia offline para el vendedor y **C** es para usuarios externos: se descartan por una restricción, no por gusto.

**🏗️ Reto (sin pasos): elige B o D y defiéndelo.** Restricciones nuevas que el enunciado original no tenía:

> **Restricciones:** los vendedores registran visitas con foto y firma del cliente; el modelo de datos tiene 22 tablas, pero el vendedor solo usa 6; cada vendedor ve solo su cartera (unos 400 clientes); dos vendedores pueden editar el mismo cliente el mismo día; el equipo tiene dos makers con experiencia en Canvas y ninguno en offline profiles; el piloto con 30 vendedores sale en 10 semanas.
> **Escribe:** la opción elegida, cómo resuelves los conflictos de edición, qué datos bajan al dispositivo (filtro de la cartera) y qué pilar de Well-Architected sale perdiendo con tu elección.
> **Cierra con un resumen ejecutivo de cinco líneas** para el director comercial: qué se decide, qué gana el vendedor, qué riesgo queda y qué se mide en el piloto.

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Descartas por restricción, no por preferencia | Las opciones descartadas tienen la restricción que violan escrita al lado |
| La afirmación técnica está respaldada | Cada capacidad que usas para decidir (offline-first, conflictos, offline profile) tiene su enlace de Learn |
| Los datos del dispositivo están acotados | Dices cómo baja solo la cartera del vendedor y no las 22 tablas |
| Los conflictos tienen dueño | Explicas qué pasa cuando dos vendedores editan el mismo cliente |
| El plazo y el equipo cuentan | Tu decisión es realista para dos makers en 10 semanas, o dices qué formación o ayuda añades |
| El ejecutivo entiende la decisión | El resumen cabe en cinco líneas, sin siglas sin explicar, e incluye un riesgo |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Opción elegida y la restricción que descarta la otra | ___ |
| Cómo bajan solo los ~400 clientes del vendedor | ___ |
| Qué pasa con una edición en conflicto | ___ |
| Pilar de Well-Architected que paga tu decisión | ___ |
| Tu resumen ejecutivo de cinco líneas | ___ |

---

## 🔁 Reto de transferencia — otro sector: mantenimiento de una red eléctrica

El mismo método en un caso que no se parece a los anteriores. Una **empresa de distribución eléctrica** mantiene 300 subestaciones. Los técnicos trabajan muchas veces sin cobertura; los contratistas externos suben informes de inspección con fotos; los sensores de cada subestación envían lecturas cada pocos segundos; el regulador exige un informe mensual de incidencias; el equipo de Power Platform son tres personas y hay un equipo de Azure en la empresa.

**[Transferir: arquitectura para mantenimiento de subestaciones](/practica/ip-arq-033-transferir-mantenimiento-subestaciones)** — decide la app de cada grupo, dónde vive la telemetría y cómo llegan las alertas. Si solo memorizaste "todo va a Dataverse", este reto te lo va a mostrar: las lecturas de alta frecuencia consumen capacidad de Database y peticiones de Dataverse, y no aportan nada que una alerta no aporte.

Cierra el reto con un **ADR de media página** (Contexto, Opciones, Decisión, Consecuencias) contrastado con la rúbrica de la Microlección 3 y con al menos dos pilares de Well-Architected nombrados en las consecuencias.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| App para técnicos, para contratistas y para el back-office | ___ |
| Dónde viven las lecturas de los sensores y qué llega a Dataverse | ___ |
| Identidad de los contratistas externos | ___ |
| Los dos pilares de Well-Architected de tus consecuencias y qué paga cada uno | ___ |
| Qué cambiaría si el regulador exigiera que los datos no salgan del país | ___ |

---

### 🗺️ Después del módulo: plan de práctica de arquitectura (8 semanas, opcional)

```markdown
Semana 1-2: Revisar fundamentos de arquitectura
  - Leer Power Platform Well-Architected (pilares, checklists y tradeoffs) y las guías de ALM, seguridad e integración
  - Self-assessment: puntúa de 0 a 3 cada área (análisis de requisitos, diseño, implementación) con las competencias de los Conceptos Clave de este módulo, y marca la de menor puntaje

Semana 3-4: Escenarios guiados
  - Resolver casos internos del banco de preguntas y del Módulo 41
  - Hacer el [simulador](/simulador) filtrado por **Nivel 4 — Arquitecto** (40 preguntas, 50 min)
  - Si el score < 70%: repasar el área con menor puntaje

Semana 5-6: Casos de estudio
  - Leer 3 casos de clientes publicados por Microsoft (Customer Stories)
  - Para cada uno: diseñar la arquitectura antes de ver la solución y anotar las diferencias

Semana 7: Repaso intensivo
  - Revisar todos los ADRs y decisiones arquitectónicas del Nivel 3 y 4
  - Repasar: cuándo usar cada componente de Power Platform

Semana 8: Simulacro profesional
  - Día 1-5: simulacro de arquitectura completo con 3 casos de negocio
  - Día 6-7: revisión de decisiones, riesgos y ADRs

## Recursos gratuitos
- Microsoft Learn: Power Platform Well-Architected (aka.ms/powa/assessment para la evaluación)
- Microsoft Learn: guías de ALM, seguridad e integración de Power Platform
- Microsoft Learn: ruta del examen AB-100 si buscas una credencial de arquitecto vigente
- YouTube: John Savill's Technical Training (arquitectura de referencia de Azure)
```

**Si haces el plan, así sabes que terminaste (opcional; no cuenta para completar el módulo):**

- [ ] Self-assessment de análisis, diseño e implementación con puntaje de 0 a 3 por área y el área más débil marcada (semanas 1-2)
- [ ] 3 casos de estudio (Customer Stories) resueltos: tu arquitectura escrita antes de leer la solución y una tabla con las diferencias (semanas 5-6)
- [ ] Simulacro: 70 % o más en el [simulador](/simulador) filtrado por **Nivel 4 — Arquitecto** antes de presentar el portafolio (semanas 3-4 y 8)
- [ ] Portafolio de casos revisado por un mentor o un par senior; si estudias solo, autoevalúalo con la rúbrica de la Microlección 3 al menos 48 horas después de escribirlo y anota qué cambiarías

### 💼 Caso Real de Negocio
**Candidato:** Desarrollador senior de Power Platform con 4 años de experiencia, excelentes habilidades técnicas pero sin experiencia en decisiones arquitectónicas de alto nivel.  
**Problema al crecer hacia Solution Architect:** Aprobó certificaciones técnicas con altas notas memorizando preguntas de práctica, pero al enfrentar escenarios enterprise le costaba razonar sobre negocio, restricciones, riesgos y trade-offs.  
**Approach de preparación correcto:** En el tercer intento, cambió de estrategia: en lugar de practicar preguntas de opción múltiple, analizó 5 casos de estudio reales de Microsoft (Customer Stories), diseñó la arquitectura él mismo antes de ver la solución, y documentó las diferencias entre su propuesta y la solución real. Adicionalmente completó el proyecto capstone (análogo al Módulo 41) que lo forzó a tomar y justificar 10+ decisiones arquitectónicas con ADRs.  
**Resultado:** Mejoró su capacidad para defender decisiones frente a stakeholders técnicos y ejecutivos. La diferencia fue aprender a pensar como arquitecto, no como alguien que recuerda respuestas.

### ✅ Buenas Prácticas
- La arquitectura profesional evalúa pensamiento sistémico, no memorización — practicar con casos reales
- En cada escenario: preguntar "¿qué haría un arquitecto senior en esta situación?" no "¿cuál opción es técnicamente correcta?"
- Leer primero las restricciones (plazo, normativa, licencias, equipo) y descartar las opciones que violan alguna antes de comparar las demás
- Respaldar cada afirmación técnica de una decisión con la documentación vigente: los productos cambian de nombre y de capacidades (Azure AD B2C, AI Builder credits, offline de Model-Driven)
- Escribir en cada ADR qué pilar de Well-Architected paga la decisión
- Que ningún flujo crítico dependa de la cuenta de una persona: service principal como dueño y alertas de fallo desde el primer día
- Completar el proyecto capstone (Módulo 41) antes de declararse listo para un rol de arquitectura — la experiencia práctica es irremplazable

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Estudiar memorizando respuestas de dumps de examen | Intentar atajo que no desarrolla el pensamiento arquitectónico | Los escenarios reales son únicos y detallados; la preparación efectiva es resolver casos reales y justificar decisiones arquitectónicas |
| Saltarse el análisis de requisitos y de la solución existente por considerarlo "blando" | El análisis parece menos técnico que el diseño | Es donde se detectan las restricciones que invalidan un diseño; practicar explícitamente la lectura crítica de soluciones existentes y la identificación de anti-patrones (en AB-100, planificar es el área de mayor peso) |
| Elegir la opción más técnicamente sofisticada | El developer instinto es resolver con código lo que Power Platform puede resolver con configuración | Aplicar siempre el principio "configurar primero": si hay una capacidad nativa, esa es la respuesta correcta aunque no sea la más impresionante técnicamente |
| No saber cuándo usar Logic Apps vs Power Automate | Es una de las decisiones más frecuentes de integración y muchos arquitectos no tienen claridad | Regla práctica: Power Automate para makers y automatización de negocio con latencia tolerada; Logic Apps para integraciones empresariales operadas por IT, con SLA estricto, B2B/EDI (integration account) o red privada |
| Presentar CMK como "la solución de cumplimiento" | Confundir un control de cifrado con el cumplimiento de una norma | Explicar qué protege CMK, sus requisitos (Managed Environments, licencias) y su riesgo (bloqueo si se revoca la clave); el cumplimiento exige más controles |
| La integración deja de funcionar cuando su autor deja la empresa | El flujo y sus conexiones dependían de la cuenta personal del autor | Flujo dentro de una solución con connection references, service principal como dueño (con licencia Process si usa premium) y alertas de fallo |
| Defender una decisión con una capacidad que ya cambió | Se repite lo que se aprendió hace años (B2C para portales nuevos, "Model-Driven offline es limitado") | Verificar en Learn el estado vigente antes de escribir el ADR y enlazar la fuente |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica de ensayos clínicos y leí en el admin center (o en papel) qué requeriría CMK en el PROD del caso
- [ ] Evalué el SIT contra seis recomendaciones de Well-Architected (RE:02, RE:05, RE:07, SE:03, SE:05, SE:07) con el dato que demuestra cada una
- [ ] Diagnostiqué la integración nocturna sin dueño formulando una hipótesis antes de ver la causa
- [ ] Elegí y defendí una opción offline para los vendedores con la rúbrica y un resumen ejecutivo de cinco líneas
- [ ] Completé el reto de transferencia de las subestaciones con su ADR y dos pilares de Well-Architected en las consecuencias

---

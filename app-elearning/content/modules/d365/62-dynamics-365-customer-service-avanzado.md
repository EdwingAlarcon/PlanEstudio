---
moduleId: 62
title: "Dynamics 365 Customer Service Avanzado — SLA, Entitlements y Routing"
level: "d365"
certification: "Dynamics 365 Customer Service"
estimatedMinutes: 22
practiceMinutes: 165
slug: "dynamics-365-customer-service-avanzado"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 165 min con trial (unos 100 min en la ruta en papel), mejor en dos sesiones: la primera hasta el diagnóstico; la segunda, las Microlecciones 3 y 4 y el reto de transferencia. La primera vez, cuenta entre una vez y media y el doble.*

> **🧭 ¿Caso, cola y SLA todavía no son claros?** Este módulo asume ese vocabulario. Repasa primero
> [Fundamentos funcionales CRM](/recursos/fundamentos-crm) — 15 minutos, sin tenant.

> **🔗 Relación con el Módulo 20 (opcional):** si ya hiciste el Módulo 20 del Nivel Avanzado, ahí configuraste clic a
> clic un SLA de primera respuesta, un entitlement y un workstream de unified routing; reutiliza lo que creaste. No es
> requisito: lo que este módulo necesita de esa configuración está resumido abajo. Aquí se profundiza en lo que el
> Módulo 20 no cubre: la mecánica real de cálculo del calendario de atención (horario, feriados, 24x7, pausa y
> reanudación), una matriz de SLA completa con condiciones de advertencia/incumplimiento, `reopen rate` como métrica
> de calidad (no solo de cumplimiento), el ciclo de vida del conocimiento, y la defensa de esas decisiones ante
> preguntas de entrevista/consultoría.

### 🎯 Objetivo
Configurar conceptualmente un proceso avanzado de Customer Service con casos, colas, contratos de servicio, entitlements, SLA, knowledge management y routing, produciendo una matriz de SLA operable y un árbol de decisión de agente defendibles en una entrevista de Consultor Funcional — distinguiendo configuración practicable con datos simulados de validación que requiere ambiente real.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que viste o calculaste, no un "sí, funcionó"). Después de la Microlección 2 vas a **diagnosticar** un incidente crítico que lleva 6 horas sin respuesta y no marca incumplimiento; la Microlección 4 es de **decidir y defender** (sin pasos, con rúbrica) y el módulo cierra con un **reto de transferencia** en otro sector.
>
> **Antes de empezar — elige tu ruta (lee esto, ahorra una tarde):**
> - **Ruta con trial (recomendada si puedes):** un ambiente Developer **no** puede instalar apps de Dynamics 365. Learn indica cómo pedir el trial: en la página [Start a Dynamics 365 free trial](https://www.microsoft.com/dynamics-365/products/customer-service), **Try for free** en el recuadro **Dynamics 365 Customer Service** ([Learn: trial de Customer Service](https://learn.microsoft.com/dynamics365/customer-service/implement/try-customer-service)). Según el [Trial FAQ](https://learn.microsoft.com/dynamics365/customer-service/implement/trial-faq) de Learn: dura 30 días y se puede extender una vez; **caduca si pasas 14 días seguidos sin usarlo** y entonces el ambiente se borra; solo puedes tener un trial activo por app; trae datos de ejemplo, Copilot Service workspace y unified routing; y con un correo personal no podrás entrar al Power Platform admin center ni extenderlo. Usa una cuenta de trabajo o estudio y elige **English (United States)**: las etiquetas de este módulo están en inglés. Si ya tienes un trial de Sales (Módulo 61), es otro tenant: **no comparten datos**.
> - **Dónde se configura:** **Copilot Service admin center** (SLA, calendarios, entitlements, routing) y **Copilot Service workspace** (la app de los representantes, donde se crean y resuelven casos).
> - **Ruta en papel:** cada práctica tiene un recuadro **Sin trial** con la evidencia de diseño que sí puedes entregar. No valida temporizadores, colas ni routing ejecutándose: anótalo así en tu evidencia.
> - **Escenario:** SIT ofrece soporte premium 24/7 y soporte estándar en horario laboral de Bogotá. Las cifras son ilustrativas.

### 📖 Conceptos Clave
- **Case lifecycle:** creación, clasificación, asignación, investigación, resolución, cierre y reapertura. Cada estado debe tener dueño y criterio de salida — un caso "En Investigación" sin dueño asignado es un caso perdido en la práctica, aunque exista en el sistema. Un caso se resuelve con **Resolve Case** (con **Resolution Type** y **Resolution**) y, si el cliente vuelve con el mismo problema, se reabre con **Reactivate Case** desde una vista de casos resueltos; la línea de tiempo conserva todo el historial ([Learn: crear y resolver un caso](https://learn.microsoft.com/training/modules/manage-cases-customer-service-workspace/create-resolve)).
- **Queues:** bandejas operativas para distribuir trabajo por canal, producto, prioridad o región. Una cola no es solo almacenamiento; es un mecanismo de operación con owner, SLA de recogida y métrica de aging propia — una cola sin owner se convierte en un cementerio de casos.
- **Entitlements:** derechos de servicio que definen qué soporte recibe un cliente: número de casos incluidos, horas de soporte, cobertura (business hours vs. 24/7), canal permitido y vigencia (fecha inicio/fin del contrato). Un caso creado fuera de la vigencia del entitlement debería bloquearse o escalar a validación comercial, no procesarse igual que uno cubierto.
- **SLA — mecánica de cálculo real:** compromisos medibles como first response time y resolution time. Se arman con **SLA KPIs** (qué se mide y desde cuándo, **Applicable From**) y un **SLA** con **SLA items** (cuándo aplica, **Applicable When**; cuándo se cumple, **Success Conditions**; **Warn and Fail Duration**; **Business Hours**) ([Learn: configurar SLA](https://learn.microsoft.com/dynamics365/customer-service/administer/define-service-level-agreements)). Reglas que Learn deja escritas y que deciden el resultado:
  - Las horas de advertencia y fallo se calculan con las **Business Hours** del SLA item; **si no asignas un customer service schedule, se considera que se trabaja todo el día, todos los días**. Un SLA sin calendario cuenta horas nocturnas y fines de semana como tiempo de respuesta — infla artificialmente los breaches o los oculta, según el escenario.
  - Un customer service calendar puede ser **Are the same each day**, **Vary by day** o **24 x 7 support**, y **observa** un **Holiday Schedule** para no contar los feriados ([Learn: horario de servicio](https://learn.microsoft.com/dynamics365/customer-service/administer/create-customer-service-schedule-define-work-hours), [Learn: feriados](https://learn.microsoft.com/dynamics365/customer-service/administer/set-up-holiday-schedule)).
  - La pausa (ej. "esperando información del cliente") exige **Allow Pause and Resume** en el SLA item (no se puede cambiar tras el primer guardado) y estados "on hold" en **Service Configuration Settings**, o condiciones de pausa propias en el KPI o en el SLA item con **Override Criteria**. Al pausar y reanudar, la SLA KPI instance se **cancela y se crea una nueva**.
  - Si un caso deja de cumplir **Applicable When** después de que el SLA arrancó, la SLA KPI instance se **cancela**: Learn recomienda no usar en esa condición campos que cambian a menudo.
  - La advertencia es opcional: si dejas vacío **Warning Duration**, el SLA nunca pasa por **Nearing noncompliance**. Las acciones de advertencia, éxito y fallo (ej. notificar al 75 %, escalar al incumplir) se configuran en el flujo predefinido de Power Automate del SLA item.
- **Routing:** asignación de casos hacia cola o agente según reglas (producto, severidad, skill, carga actual). En escenarios modernos se apoya en unified routing (el mismo motor del Módulo 63/Contact Center), que requiere configuración real en Dynamics 365 Customer Service/Contact Center — diseñar la regla es practicable sin tenant, verificar que el motor la aplique correctamente no lo es.
- **Knowledge articles:** base de conocimiento para acelerar resolución y estandarizar respuestas. Su ciclo de vida en Dynamics 365 es **Draft** → **Approved** → **Scheduled** o **Published** → **Expired**, con **Archived** y **Discarded** como salidas ([Learn: estados del artículo](https://learn.microsoft.com/dynamics365/customer-service/administer/work-knowledge-articles)); al publicar se fija un **Expiration Date** y el **Expiration Status** que tomará, y un artículo vencido deja de salir en las búsquedas ([Learn: publicar artículos](https://learn.microsoft.com/dynamics365/customer-service/use/publish-ka)). Además necesita owner y fecha de revisión — un artículo desactualizado que un agente sigue al pie de la letra es un riesgo de calidad de servicio, no un ahorro de tiempo.
- **Copilot para servicio:** puede resumir el historial de un caso y sugerir respuestas basadas en knowledge articles, pero requiere licencias/capacidades habilitadas y gobierno de datos — la sugerencia sigue necesitando validación del agente antes de enviarse al cliente, especialmente en casos con implicación legal o de garantía.
- **Métricas operativas:** backlog (casos abiertos sin resolver), aging (tiempo promedio abierto), first response breach, resolution breach, reopen rate (señal de resolución de baja calidad) y CSAT. Un equipo que solo mide breaches sin medir reopen rate puede estar "cumpliendo SLA" cerrando casos mal resueltos que vuelven a abrirse. Este curso no da por hecho que tu ambiente traiga un informe de reopen rate listo: diseña tú cómo se cuenta (por ejemplo, casos reactivados sobre casos resueltos del periodo).
- **Requisitos reales de práctica:** diseñar tipos de caso, matrices de SLA y árboles de decisión puede hacerse sin tenant. Configurar SLA con calendario real, entitlements vigentes, colas operando y routing ejecutándose requiere Dynamics 365 Customer Service, licencias y datos de prueba reales.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — El calendario decide la hora de fallo

**¿Qué vas a aprender?** A calcular a mano la hora de fallo de un SLA según su calendario (horario, feriados, 24x7) y a dejar el calendario configurado antes que el SLA.

**¿Por qué existe esto?** El Caso Real de este módulo (casos "incumplidos" que en realidad esperaban al cliente, tiempos inconsistentes) empieza por el reloj: el mismo "4 horas" significa cosas distintas en un calendario 24x7, en uno de lunes a viernes de 8:00 a 18:00 y en ese mismo calendario un día feriado.

**Ejemplo pequeño — un caso creado el viernes a las 17:00, fallo a 4 horas:**

| Calendario del SLA item | Hora de fallo |
|---|---|
| Sin **Business Hours** (todo el día, todos los días) | Viernes 21:00 |
| L-V 8:00-18:00, sin feriados | Lunes 11:00 (1 h el viernes + 3 h el lunes) |
| L-V 8:00-18:00, y el lunes es feriado observado | Martes 11:00 |

**Ahora haz algo — micropráctica (6 min):** decide qué pieza resuelve cada fila de la matriz de SLA de SIT → **[Armar la matriz de SLA: calendario, pausa, advertencia y fallo](/practica/ip-d365-019-matriz-sla-calendario)**.

**Práctica real en tu trial de Customer Service (25 min):** todo en **Copilot Service admin center**.

1. **Feriados:** mapa del sitio → **Operations** → **Calendar** → sección **Holiday calendar** → **Manage** → **New**. Nombre `Feriados Colombia 2026` → **Create**. En la cuadrícula **Holidays**, **New**; en **Add Holiday** indica **Name**, **Start Date**, **End Date** y **Duration** de un feriado próximo (o de un lunes cualquiera, para la prueba) → **OK**.
2. **Calendario laboral:** **Calendar** → sección **Customer service calendar** → **Manage** → **New**. Nombre `Horario Bogotá L-V` (si ya existe del Módulo 20, ábrelo con **Edit**) → **Create**. En **Weekly Schedule**: **Are the same each day**, **Work Days** de lunes a viernes, **Set Work Hours** de 8:00 a 18:00; en **Holiday Schedule** elige **Observe** y selecciona `Feriados Colombia 2026`; **Time Zone** la de Bogotá. **Save**.
3. **Calendario 24x7:** otro **New** con nombre `Soporte 24x7` y la opción **24 x 7 support**. **Save**.
4. **Calcula a mano (papel, 10 min)** la hora de fallo de estos tres casos con fallo a 4 horas, para cada calendario: (a) martes 10:00; (b) viernes 16:30; (c) el día anterior a tu feriado a las 15:00.

**Si no lo ves:** "no aparece la sección **Holiday calendar**" → revisa que estás en **Copilot Service admin center** y no en la app de representantes; Learn recomienda crear los feriados en esta experiencia nueva. "No puedo crear calendarios" → necesitas un rol como Customer Service Manager, System Administrator o System Customizer (en tu trial eres administrador).

> **Sin trial:** escribe en una tabla la configuración de los dos calendarios (opción de **Weekly Schedule**, días, horas, zona horaria y feriados) y haz el paso 4.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre y fecha del feriado que cargaste (o el que usarías) | ___ |
| Opción de **Weekly Schedule** de cada calendario y si observa feriados | ___ |
| Hora de fallo de (a), (b) y (c) en `Horario Bogotá L-V` | ___ |
| Hora de fallo de (a), (b) y (c) en `Soporte 24x7` | ___ |

---

## 🧩 Microlección 2 — La matriz de SLA hecha configuración

**¿Qué vas a aprender?** A convertir una matriz de SLA de contrato en SLA items concretos: uno por métrica y tipo de caso, cada uno con su calendario, su pausa, su advertencia y su fallo.

**¿Por qué existe esto?** Un contrato dice "incidente crítico: respuesta en 30 minutos, 24/7"; el sistema necesita saber a qué casos aplica (**Applicable When**), qué cuenta como respuesta (**Success Conditions**), con qué reloj (**Business Hours**), cuándo se pausa y qué pasa al 75 % y al 100 %. Si una de esas piezas falta, el reporte miente. Recuerda también que **un** SLA se aplica a un registro a la vez y que llega al caso por un entitlement, un flujo, a mano o por ser el SLA por defecto ([Learn: aplicar SLA](https://learn.microsoft.com/dynamics365/customer-service/administer/apply-slas)).

**Práctica (40 min):**

1. **Tipos de caso (papel):** diseña 3 tipos de caso: Incidente crítico, Consulta funcional y Solicitud administrativa. Para cada uno define prioridad, cola inicial, entitlement aplicable y SLA.
2. **Matriz (papel):** completa esta matriz de SLA para un contrato de soporte premium 24/7 con tu propio ejemplo para el tipo "Consulta funcional", y añade la columna **Calendario** con el nombre exacto de la Microlección 1:

   | Métrica | Calendario | Tiempo objetivo | Condición de pausa | Acción de advertencia | Acción de incumplimiento |
   |---|---|---|---|---|---|
   | First response — Incidente crítico | 24/7 | 30 minutos | No aplica | Notificación a supervisor al 75% | Escalación automática a Nivel 2 + email a gerente de cuenta |
   | Resolution — Incidente crítico | 24/7 | 4 horas | Esperando información del cliente | Notificación al agente al 80% | Reasignación a especialista + registro de causa raíz obligatorio |
   | Consulta funcional (completa tú esta fila) | | | | | |

3. **En tu trial**, en **Operations** → **Service terms**: si no tienes un SLA KPI de primera respuesta, créalo en **SLA KPIs** → **Manage** → **New** (**Entity Name** Case, **KPI Field** `FirstResponseByKPI`, **Applicable From** **Created On**) → **Save** → **Activate**. Luego **Service Level Agreements (SLAs)** → **Manage** → **New**: `SLA Premium SIT`, **Primary Entity** Case → **Save**.
4. Crea dos SLA items con **New SLA Item**: `Crítico — primera respuesta 30 min` (**Business Hours** = `Soporte 24x7`, **Applicable When** = **Priority** igual a High; **Warn and Fail Duration** 22 minutos (≈75 %) y 30 minutos; en este ejercicio la prioridad la fija quien crea el caso y no se cambia después) y `Consulta — primera respuesta` con los valores de tu fila y **Business Hours** = `Horario Bogotá L-V`, con **Allow Pause and Resume** activado (decídelo ahora: no se puede cambiar después). **Save** cada uno y **Activate** el SLA.
5. En **Copilot Service workspace**, crea dos casos para una cuenta de ejemplo (uno con **Priority** High y otro normal), aplícales el SLA (con un entitlement que lo tenga o asignándolo en el caso) y anota la hora de fallo de cada SLA KPI instance. Compárala con tu cálculo de la Microlección 1.

**Si no lo ves:** "el caso no muestra SLA KPI instance" → el SLA no está activo, no llegó al caso (sin entitlement, sin SLA por defecto ni asignación) o el caso no cumple **Applicable When**. "La instancia aparece como cancelada" → alguien cambió la prioridad después de crear el caso y dejó de cumplir **Applicable When**: por eso Learn desaconseja usar en esa condición campos que cambian a menudo.

> **Sin trial:** haz los pasos 1 y 2 y escribe los dos SLA items del paso 4 como tabla (las cinco secciones de cada uno), con la hora de fallo esperada de un caso crítico creado el sábado a las 02:00.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu fila de "Consulta funcional" completa | ___ |
| **Applicable When** de cada SLA item y por qué ese campo no cambia a menudo | ___ |
| Hora de creación y hora de fallo de cada caso de prueba (o esperadas, sin trial) | ___ |
| ¿Coincidió con tu cálculo a mano? Si no, qué pieza lo explica | ___ |

---

## 🔧 Diagnosticar — 6 horas sin respuesta y ningún incumplimiento

Antes de la Microlección 3, resuelve este caso empezando por el síntoma (es la pregunta de entrevista que este módulo siempre ha planteado):

**[Diagnosticar: el incidente crítico que no marca breach](/practica/ip-d365-020-critico-sin-breach)**

Síntoma: un cliente premium reporta que su incidente crítico, abierto un sábado de madrugada, llevaba 6 horas sin respuesta; el sistema muestra la SLA KPI instance **In Progress** y nadie recibió la advertencia. Formula tu hipótesis antes de ver la causa: ¿qué revisarías primero, el SLA en sí o el reloj con el que se calcula?

---

## 🧩 Microlección 3 — Resolver bien: entitlement, árbol del agente, conocimiento y reopen rate

**¿Qué vas a aprender?** A diseñar el camino del agente desde que recibe el caso hasta que lo resuelve, y a medir si lo resolvió bien con la tasa de reapertura, no solo con el SLA.

**¿Por qué existe esto?** Cumplir el SLA cerrando rápido un caso mal resuelto mejora el reporte de breaches y empeora al cliente. La reapertura deja rastro: el caso vuelve a **Active** con **Reactivate Case** y su línea de tiempo conserva la primera resolución. Y si el agente siguió un artículo vencido, el problema está en el ciclo de vida del conocimiento, no en el agente.

**Práctica (35 min):**

1. **Árbol de decisión (papel):** validar cliente → confirmar entitlement vigente → consultar knowledge article → ¿resuelto? → si no, escalar con resumen y evidencia adjunta. Añade dos ramas: qué hace el agente si el entitlement está vencido o sin saldo, y qué hace si el artículo que encontró está **Expired**.
2. **Reopen rate (papel):** define la fórmula (por ejemplo, casos reactivados en 14 días / casos resueltos del periodo), el umbral que dispara revisión y qué harías con un agente que cumple el SLA pero tiene la tasa más alta del equipo.
3. **En tu trial**, en **Copilot Service workspace** → **Cases**: abre un caso de ejemplo, **Resolve Case** con **Resolution Type** y **Resolution**. Cambia la vista a **My Resolved Cases** (o cualquier vista con casos resueltos), ábrelo, **Reactivate Case** y confirma. Anota qué queda en la línea de tiempo.
4. **En tu trial**, **Knowledge Articles**: anota los estados de tres artículos de ejemplo y si alguno tiene **Expiration Date**. (Opcional: publica uno que esté **Approved** y fija un **Expiration Date**; la publicación exige el privilegio Publish.)

**Si no lo ves:** "no encuentro **Reactivate Case**" → solo aparece en casos resueltos o cancelados; abre el caso desde una vista de resueltos. "No hay artículos de ejemplo" → anota "sin datos de ejemplo" y haz el paso 4 en papel con tus 5 artículos: owner, estado y fecha de revisión.

> **Sin trial:** haz los pasos 1 y 2 y, en lugar de los pasos 3 y 4, escribe qué evidencia buscarías en un ambiente real para contar una reapertura y para saber si un artículo estaba vencido cuando el agente lo usó.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Qué hace tu árbol con un entitlement vencido y con un artículo **Expired** | ___ |
| Tu fórmula de reopen rate, el umbral y la acción | ___ |
| Qué conservó la línea de tiempo tras **Reactivate Case** (o "sin trial") | ___ |
| Estados y **Expiration Date** de los tres artículos que revisaste | ___ |

---

## 🧩 Microlección 4 — Routing por producto y severidad: decidir y defender (sin pasos)

**¿Qué vas a aprender?** A elegir cuánta complejidad de routing poner el primer día, con criterios explícitos, y a defenderlo en una entrevista.

**¿Por qué existe esto?** "Routing demasiado complejo desde el día uno" es uno de los errores comunes de este módulo: sin datos de volumen no sabes qué skills ni qué capacidad necesitas. Unified routing separa **clasificar** el caso (qué necesita) de **asignarlo** (quién lo atiende) ([Learn: unified routing](https://learn.microsoft.com/dynamics365/customer-service/administer/overview-unified-routing)); decidir qué reglas pones en cada etapa es diseño, no configuración.

**🏗️ Reto (sin pasos): diseña la primera versión del routing de SIT y defiéndela.**

> **Restricciones:** 3 productos (licencias, Power BI, integración con ERP); 12 agentes, de los que solo 3 saben de integración con ERP; los incidentes críticos de clientes premium deben llegar a alguien en menos de 30 minutos, 24/7; no hay datos históricos de volumen por producto; el piloto sale en 6 semanas.
> **Escribe:** la regla de routing por producto y severidad (con trial, configúrala y pruébala con 3 casos; sin trial, documéntala), cuántas colas creas y quién es el owner de cada una, qué dejas para la segunda versión y por qué, y tus respuestas a dos preguntas de entrevista: (a) "Un cliente reporta que su incidente crítico llevaba 6 horas sin respuesta, pero el sistema no marca breach — ¿qué revisarías primero?"; (b) "¿Por qué reopen rate es una métrica de calidad y no solo de volumen?".

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Empiezas simple con un motivo | Lo que dejas para la v2 tiene escrita la razón (sin datos de volumen, plazo) |
| Cada cola tiene dueño | Cada cola nombra owner y métrica de aging |
| La regla se puede probar | Hay 3 casos de prueba con la cola esperada, incluido uno que no debería ir a integración |
| La escasez está gestionada | Dices qué pasa cuando los 3 especialistas en ERP están ocupados |
| La entrevista va al reloj | Tu respuesta (a) empieza por calendario y pausa, no por "el SLA está mal" |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu regla de routing y las colas con su owner | ___ |
| Resultado de los 3 casos de prueba (o la cola esperada, sin trial) | ___ |
| Lo que dejas para la v2 y por qué | ___ |
| Tus respuestas (a) y (b) | ___ |
| Qué evidencia requiere ambiente real (pantallas de SLA ejecutándose, temporizador, cola, routing, auditoría de escalamiento) | ___ |

---

## 🔁 Reto de transferencia — La mesa de reclamos de una aseguradora de salud

El mismo razonamiento en otro sector. Una **aseguradora de salud** atiende reclamos de afiliados. El regulador exige respuesta de fondo en **5 días hábiles**, sin contar sábados, domingos ni feriados nacionales; el reloj se detiene mientras la aseguradora espera documentos del afiliado; los reclamos de medicamentos urgentes tienen 24 horas corridas; y la auditoría revisa cuántos reclamos "resueltos" vuelven a abrirse.

**[Transferir: SLA regulatorio de una aseguradora de salud](/practica/ip-d365-021-sla-aseguradora-salud)** — decide calendarios, pausa, cómo separar los urgentes y cómo demostrar al auditor la tasa de reapertura.

Sin guía paso a paso, cierra el reto con una matriz de SLA de dos filas (reclamo general y medicamento urgente) con las seis columnas de la Microlección 2.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Calendario de cada fila y cómo entran los feriados nacionales | ___ |
| Pieza que detiene el reloj mientras se esperan documentos | ___ |
| Cómo distingues el urgente sin que su SLA se cancele a mitad de camino | ___ |
| Cómo demuestras la tasa de reapertura al auditor | ___ |

---

### 💼 Casos Reales de Negocio
Un área de soporte tenía SLA escritos en contrato, pero no configurados en Dynamics 365. Los agentes resolvían casos urgentes "por memoria" y los reportes mostraban tiempos inconsistentes porque nadie pausaba el SLA cuando esperaba respuesta del cliente — un caso que esperó 3 días una respuesta del cliente aparecía como "incumplido" en el reporte, penalizando al agente por algo fuera de su control. La remediación fue modelar entitlements, calendario de soporte, reglas de pausa, warning y escalation explícitas. El contrato dejó de ser un PDF archivado y pasó a ser lógica operativa auditable que el equipo podía defender ante el cliente con datos, no con excusas.

### ✅ Buenas Prácticas
- Definir calendarios de atención (horario, feriados, región) antes de activar cualquier SLA — sin calendario, el "tiempo objetivo" no significa nada verificable.
- Usar un calendario **24 x 7 support** explícito para los SLA que de verdad son 24/7, en vez de dejar **Business Hours** vacío "porque da lo mismo": el nombre documenta la decisión.
- Separar entitlements comerciales de SLA operativos: ambos se relacionan, pero uno define derecho de cobertura y el otro mide desempeño de respuesta.
- Documentar condiciones de pausa y reanudación con ejemplos reales, no solo el nombre de la condición, y decidir **Allow Pause and Resume** al crear el SLA item.
- No usar en **Applicable When** campos que cambian a menudo: si el caso deja de cumplir la condición, la SLA KPI instance se cancela.
- Usar colas con propósito claro y owner asignado; demasiadas colas sin dueño generan trabajo invisible que nadie revisa.
- Medir backlog, aging y reopen rate semanalmente, no solo breaches — un equipo sin breaches pero con reopen rate alto está resolviendo mal, no rápido.
- Publicar artículos de conocimiento con **Expiration Date** y owner de revisión.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SLA sin calendario | Se configura tiempo objetivo genérico sobre reloj continuo | Crear calendario por horario/feriados/región antes de activar el SLA |
| Incidente crítico 24/7 sin breach tras horas sin respuesta | El SLA item del crítico tiene el calendario laboral, así que de noche y en fin de semana el reloj no corre | Asignar al SLA item del crítico un calendario **24 x 7 support** y probar con un caso fuera de horario |
| El SLA no respeta un feriado | El customer service calendar no observa el **Holiday Schedule**, o el feriado no está cargado | Cargar el feriado y marcar **Observe** en el calendario |
| La SLA KPI instance se cancela a mitad del caso | **Applicable When** usa un campo que el agente cambia (por ejemplo, la prioridad) | Basar la condición en un campo estable, como el tipo de caso o el entitlement |
| Entitlement creado pero no aplicado al caso | Falta regla de validación operativa en el intake | Agregar paso obligatorio de verificación de entitlement al crear el caso |
| Cola usada como archivo muerto | No hay owner ni métrica de aging sobre la cola | Asignar responsable, aging y alerta de backlog por cola |
| Routing demasiado complejo desde el día uno | Se intenta automatizar sin datos históricos de volumen | Empezar con reglas simples y refinar con métricas reales de los primeros meses |

### 🧪 Criterios de Validación
- [ ] Calculé a mano la hora de fallo de 3 casos en un calendario laboral con feriado y en uno 24x7 (con trial: ambos calendarios y el feriado configurados)
- [ ] Diseñé tipos de caso con cola, entitlement y SLA
- [ ] Construí una matriz de SLA con calendario, pausa, advertencia y escalamiento, y completé la fila de "Consulta funcional"
- [ ] (Trial) Creé dos SLA items con calendarios distintos y comparé su hora de fallo con mi cálculo; o, sin trial, los documenté con sus cinco secciones
- [ ] Resolví el diagnóstico del incidente crítico sin breach
- [ ] Diseñé el árbol de decisión del agente con ramas para entitlement vencido y artículo vencido, y una fórmula de reopen rate con umbral
- [ ] (Trial) Resolví y reactivé un caso y revisé el estado y la expiración de artículos de conocimiento
- [ ] Decidí y defendí la primera versión del routing con casos de prueba, y respondí 2 preguntas de entrevista/consultoría sobre SLA mal configurado y reopen rate
- [ ] Identifiqué qué evidencias requieren ambiente real Dynamics 365 Customer Service
- [ ] Resolví el reto de transferencia de la aseguradora de salud
- [ ] Relacioné este módulo con el Lab 68 (case-to-resolution) y el Lab 82 (SLA, entitlements y routing)

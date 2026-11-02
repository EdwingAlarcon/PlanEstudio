---
moduleId: 59
title: "Field Service End-to-End — Work Orders, Agreements, Mobile Offline y RSO"
level: "d365"
certification: "Dynamics 365 Field Service skill path"
estimatedMinutes: 20
practiceMinutes: 200
slug: "field-service-scheduling-avanzado"
lastVerified: "2026-11"
---
*Lectura: 18-20 min · Práctica: unas 3 horas y media la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, Microlecciones 3 y 4, la decisión defendida y el reto de transferencia). Con una trial de Field Service, suma una hora para comprobar las pantallas.*

### 🎯 Objetivo
Profundizar en Field Service end-to-end: acuerdos de mantenimiento, generación de Work Orders, Incident Types, Schedule Board, Resource Scheduling Optimization, Field Service Mobile offline, consumo de inventario y cierre operativo con evidencia.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que decidiste, calculaste u observaste). Cierras **decidiendo y defendiendo** cómo controlar un paso crítico de seguridad y con un **reto de transferencia** en otro negocio.
>
> **Antes de empezar, necesitas:**
> - **No necesitas un tenant con Dynamics 365.** Un ambiente Developer de Power Platform no puede instalar las apps de Dynamics 365, y las trials son temporales. Por eso cada práctica tiene un **núcleo en papel** (diseñar, decidir y justificar) y, cuando aplica, una **variante con trial** para comprobar la pantalla si tienes una trial de Dynamics 365 Field Service.
> - Los datos de prueba del [Lab 59](/labs/lab-59-field-service-work-order-uat) (Contoso Andina, Fabrikam Norte y Litware Sur). Están copiados en la Microlección 1, no hace falta abrir el lab todavía.
> - Una hoja de cálculo o un documento para tus tablas de evidencia.
> - Este módulo es transversal: no exige ningún nivel de certificación. Si ya hiciste el Módulo 20 (Dynamics 365 CE), reconocerás el ciclo Work Order → Booking → ejecución móvil, que allí solo se nombró. Si Dynamics 365 es nuevo para ti, una lectura previa opcional es el [Módulo 57](/nivel/d365/modulo/introduccion-dynamics-365-avanzado).

### 📖 Conceptos Clave
- **Universal Resource Scheduling (URS):** el motor que hay detrás del Schedule Board. No es exclusivo de Field Service: Learn indica que también lo usan Dynamics 365 Customer Service (reservar casos a representantes) y Project Operations (asignar consultores a proyectos) ([Learn: Overview of Universal Resource Scheduling](https://learn.microsoft.com/dynamics365/common-scheduler/schedule-anything-with-universal-resource-scheduling)). Entenderlo como motor compartido evita ver el Schedule Board como una pantalla aislada.
- **Resource requirement (requisito de recurso):** cada Work Order genera un requisito que dice qué se necesita para ejecutarlo: duración, `Characteristics` (skills, con un **Rating Value** mínimo opcional), territorio y ventana de fechas. Sin Characteristics, el sistema no tiene con qué distinguir al técnico capacitado del que no lo está.
- **Tres formas de asignar, de menos a más automática:**
  - **Reserva manual** desde el Schedule Board (**Book**, o arrastrar el requisito a un técnico). Learn es explícito: la reserva manual **no valida** disponibilidad, Characteristics ni ubicación. Sirve para urgencias y excepciones.
  - **Schedule assistant:** se lanza con **Find availability** desde el panel de requisitos del Schedule Board (o con **Book** desde el Work Order). Recomienda recursos que cumplen disponibilidad, skills y ubicación, estima el tiempo de viaje y el dispatcher decide.
  - **Resource Scheduling Optimization (RSO):** un **add-in de pago** que programa muchos trabajos a la vez para maximizar el uso de recursos y reducir viajes. Se ejecuta con una programación predefinida (por ejemplo, cada noche para el día siguiente, o cada 30 minutos durante el día) o disparado por un workflow ([Learn: RSO overview](https://learn.microsoft.com/dynamics365/field-service/rso-overview)). Learn también documenta, en **preview**, el **Scheduling Operations Agent**, que optimiza agendas de uno o varios técnicos ([Learn](https://learn.microsoft.com/dynamics365/field-service/soa-overview)); al ser preview, no es para producción.
- **Cuándo se justifica RSO:** con volumen alto (decenas o cientos de órdenes diarias por región), cuando programar a mano consume el día del dispatcher. Con 5-10 órdenes diarias, el schedule assistant es suficiente, más barato y más fácil de auditar.
- **Incident Type — una plantilla de Work Order:** Learn lo describe como plantilla: al aplicarlo, el Work Order recibe en segundo plano los productos, servicios, service tasks y Characteristics del Incident Type, y la duración y las Characteristics pasan al requisito de recurso ([Learn: Create work order templates with incident types](https://learn.microsoft.com/dynamics365/field-service/configure-incident-types)). Ejemplo: "Mantenimiento preventivo HVAC nivel 2" con la Characteristic HVAC (Rating Value 2) y tres service tasks: "Verificar presión de refrigerante", "Limpiar filtro" y "Medir temperatura de salida". **Ojo con la duración:** si las service tasks tienen duración, la duración del Incident Type es la **suma** de esas duraciones; solo puedes escribir una **Estimated Duration** propia si no hay tasks o si no tienen duración.
- **Service tasks e inspections — qué controla cada uno:** las service tasks son un checklist que el técnico marca al completarlo. Learn **no documenta** que una task sin completar impida completar el Work Order. Lo que sí documenta: una **inspection** asociada a una service task puede tener preguntas con el interruptor **Required**, y si una pregunta obligatoria no tiene respuesta, el técnico **no puede marcar la task como completa** ([Learn: Use inspections in work orders](https://learn.microsoft.com/dynamics365/field-service/inspections)). Que todas las tasks críticas estén completas antes de cerrar es un control que tienes que diseñar (revisión del supervisor antes de **Posted**, o una validación propia), no algo que pase solo.
- **Work Order Type:** clasifica el propósito general (instalación, mantenimiento preventivo, reparación, garantía) y puede traer su lista de precios. Se combina con el Incident Type, no lo reemplaza: el Incident Type es más específico ("qué falla exactamente").
- **Agreements y mantenimiento preventivo:** un Agreement genera Work Orders (y, si quieres, facturas) con detalles, frecuencia y rango de fechas predefinidos. Se construye en **System Status** = **Estimate**, se le agrega una **Agreement Booking Setup** con su **Booking Recurrence** y un **Agreement Booking Incident** (puede apuntar a un Customer Asset), y al pasar a **Active** crea las **Booking Dates**, que generan los Work Orders con la anticipación configurada ([Learn: Set up agreements to generate work orders](https://learn.microsoft.com/dynamics365/field-service/set-up-agreements-work-orders)). Detalle que rompe proyectos: los procesos del Agreement corren con los permisos de su **propietario**; si el propietario es una persona y deja la empresa, el Agreement falla. Learn recomienda un usuario de sistema o un equipo como propietario.
- **Customer Assets:** equipos instalados del cliente. Conectan historial de mantenimiento, garantías, incidentes y repuestos.
- **Field Service mobile app y offline:** la app funciona **offline-first**: tras la primera sincronización, la base de datos local del dispositivo es la fuente principal. El perfil por defecto se llama **Field Service Mobile - Offline Profile**, con intervalos de sincronización por tabla (de 5 minutos a un día). Datos que ya no cumplen los filtros del perfil se borran del dispositivo (el técnico ve **Record Not Found**). Los conflictos se resuelven por **registro completo**, no por campo, según el ajuste **Set conflict detection for mobile offline synchronization**: en **No** (el valor por defecto) ganan los cambios hechos offline por el técnico; en **Yes**, ganan los del servidor ([Learn: Configure offline data synchronization](https://learn.microsoft.com/dynamics365/field-service/mobile/offline-data-sync)).
- **Inventario y consumo:** cada producto del Work Order nace con **Line Status** = *Estimated*; cuando el técnico lo usa, lo cambia a *Used* e indica el **Warehouse** (por defecto, el del recurso que crea el registro, por ejemplo su camioneta). En **Field Service Settings**, **Use Of Products out of Stock** decide si se bloquea (**Restrict**) o solo se advierte (**Confirm**) el uso de un producto sin existencias. Al pasar el Work Order a **Posted** se genera la factura con lo usado ([Learn: Create products or services for work orders](https://learn.microsoft.com/dynamics365/field-service/create-product-or-service)).
- **Ciclo de estados:** el Work Order pasa por *Unscheduled*, *Scheduled*, *In Progress*, *Completed*, *Posted* (o *Canceled*). El técnico mueve el **Booking Status** (*Scheduled*, *Traveling*, *In Progress*, *On Break*, *Completed*) y eso actualiza el estado del Work Order. Un supervisor revisa y pasa a *Posted* ([Learn: Work order lifecycle and system statuses](https://learn.microsoft.com/dynamics365/field-service/work-order-status-booking-status)). Esa revisión es el lugar natural para el control de cierre.
- **Territorios de servicio (Service Territories):** agrupan técnicos por zona. Son uno de los filtros del schedule assistant y uno de los parámetros que RSO considera, junto con Characteristics y ventanas de tiempo.
- **Requisitos reales de práctica:** diseñar el flujo, el Incident Type, el Agreement y la matriz se puede hacer sin tenant. Probar Schedule Board, app móvil offline, RSO, agreements e inventario requiere Dynamics 365 Field Service, usuarios técnicos con su recurso reservable, datos de recursos, seguridad y configuración móvil.

### 👨‍💻 Actividades Prácticas

Estos son los datos de prueba del Lab 59 que se usan en todo el módulo:

| Cliente | Activo | Falla | Garantía | Prioridad | Skill requerida | Ventana |
|---|---|---|---|---|---|---|
| Contoso Andina | Compresor CX-200 | Sobrecalentamiento | Sí | Alta | HVAC nivel 2 | 24 h |
| Fabrikam Norte | Sensor IoT S-10 | Sin señal | No | Media | IoT nivel 1 | 72 h |
| Litware Sur | Bomba B-500 | Fuga | Sí | Crítica | Mecánica nivel 3 | 8 h |

## 🧩 Microlección 1 — El Incident Type como plantilla (y lo que no controla)

**¿Qué vas a aprender?** A diseñar un Incident Type que llene el Work Order con lo correcto, y a distinguir qué controla de verdad y qué hay que controlar aparte.

**¿Por qué existe esto?** El Caso Real de este módulo ocurrió porque un paso crítico no estaba en ningún checklist. Pero tener el checklist tampoco basta si nadie comprueba que se marcó: el control completo tiene dos piezas.

**Ahora haz algo — micropráctica (6 min):** elige qué piezas componen el Incident Type de Litware Sur → **[Diseñar el Incident Type de una falla crítica](/practica/ip-d365-010-disenar-incident-type-falla-critica)**.

**Práctica (35 min, en papel):** elige uno de los tres casos y diseña su Incident Type.

1. **Nombre y Work Order Type** por defecto (por ejemplo, *Reparación en garantía*).
2. **Characteristics** con su **Rating Value** mínimo (por ejemplo, Mecánica, nivel 3). Pregúntate qué pasa si dejas el Rating Value vacío: Learn dice que entonces cualquier nivel sirve.
3. **Tres service tasks** con su duración estimada, en el orden en que el técnico debe hacerlas. **Calcula la duración del Incident Type como la suma** de las tres.
4. **Productos** que el técnico probablemente consumirá (por ejemplo, un sello de bomba), con cantidad.
5. **Una inspection** para el paso crítico: qué pregunta es **Required** y qué tipo de respuesta pide (número, foto, sí/no).
6. Escribe en una línea **qué pasa si el técnico no marca una de las tres tasks**: según lo que viste en Conceptos Clave, ¿lo impide el sistema o hay que controlarlo en la revisión?

**Variante con trial (20 min):** en Field Service, cambia al área **Settings** y, en **Work Orders**, selecciona **Incident Types** > **New**. En la pestaña **General** escribe el nombre; en **Details** elige el **Default Work Order Type**; guarda con **Save**. En la pestaña **Service Tasks**, selecciona **New Incident Type Service Task** y crea las tres tasks con su **Task Type**, **Estimated Duration** y **Line Order**; en **Characteristics**, **New Incident Type Characteristic** con el **Rating Value**. Después crea un Work Order, elige el Incident Type en el campo **Incident Type** y guarda: deberías ver aparecer las tasks y, en **Related** > **Characteristics**, la skill requerida. Si las tasks no aparecen, revisa que tu usuario tenga privilegio de crear Work Order Service Task (Learn lo pide para el autollenado).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Caso elegido e Incident Type (nombre) | ___ |
| Characteristic y Rating Value | ___ |
| Las tres service tasks con su duración y la suma | ___ |
| Pregunta Required de la inspection y su tipo de respuesta | ___ |
| ¿El sistema impide cerrar con una task sin marcar? Tu respuesta y dónde lo controlarías | ___ |
| (Solo con trial) Duración que mostró el Work Order tras aplicar el Incident Type | ___ |

---

## 🧩 Microlección 2 — Asignar: reserva manual, schedule assistant o RSO

**¿Qué vas a aprender?** A elegir cómo se asigna el trabajo según el volumen y el riesgo, y a no confiar en la reserva manual para respetar skills.

**¿Por qué existe esto?** El error típico no es elegir mal el motor: es creer que arrastrar un trabajo en el Schedule Board "respeta" las skills. Learn dice lo contrario.

**Práctica (30 min, en papel):**

1. Para cada uno de los tres casos, escribe qué método usarías para asignarlo (manual, schedule assistant o RSO) y por qué. El caso crítico de 8 horas puede justificar una reserva manual de urgencia, pero entonces **quién comprueba la skill**.
2. Con los tres casos juntos, decide si el volumen justifica RSO. Ahora supón que el cliente real tiene **140 Work Orders diarios** en dos regiones y 35 técnicos: ¿cambia tu decisión? RSO se licencia según el número de recursos cuyas agendas se optimizan; anota que eso entra en la conversación de costo.
3. Para el caso de Contoso, lista los filtros que esperas ver aplicados al lanzar el schedule assistant (Characteristic, territorio, ventana de fechas) y de dónde sale cada uno (Incident Type, Work Order, Agreement).

**Variante con trial (15 min):** en **Resource Scheduling** > **Schedule Board**, busca el Work Order en el panel de requisitos (**Requirement pane**), selecciónalo y usa **Find availability**. En el panel **Schedule Assistant Filter**, anota qué filtros llegaron ya puestos. Compara con lo que pasa al crear la reserva con **Book** a mano: el sistema no te avisa si el técnico no tiene la skill.

**Evidencia a reportar:**

| Caso | Método de asignación | Por qué | Quién comprueba la skill |
|---|---|---|---|
| Contoso Andina | ___ | ___ | ___ |
| Fabrikam Norte | ___ | ___ | ___ |
| Litware Sur | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| ¿RSO para 3 casos? ¿Y para 140 diarios con 35 técnicos? | ___ |
| Filtros esperados en el schedule assistant y su origen | ___ |
| (Solo con trial) Filtros que llegaron ya puestos | ___ |

---

## 🧩 Microlección 3 — Mantenimiento preventivo con Agreements

**¿Qué vas a aprender?** A diseñar un Agreement que genere los Work Orders preventivos solos, conectados a un activo y con evidencia.

**¿Por qué existe esto?** Crear a mano cada mes el Work Order preventivo funciona hasta que alguien se va de vacaciones. Un Agreement deja la recurrencia, el activo y las tareas en el sistema.

**Práctica (35 min, en papel):** diseña el mantenimiento preventivo **mensual** del Compresor CX-200 de Contoso Andina durante un año.

1. **Agreement:** Service Account, Billing Account, fechas de inicio y fin, lista de precios, territorio y **propietario** (¿una persona, un usuario de sistema o un equipo? Justifica con lo que dice Learn).
2. **Agreement Booking Setup:** nombre ("Mantenimiento mensual"), **Auto Generate Work Order** (sí/no), **Generate Work Orders Day in Advance** (cuántos días y por qué: muy pocos no dan tiempo a preparar repuestos; demasiados inflan el backlog), **Auto Generate Booking** (sí/no: si es sí, Learn advierte que reserva según la recurrencia sin mirar si el técnico está activo ni su horario) y la flexibilidad antes y después de la fecha.
3. **Booking Recurrence:** patrón (por ejemplo, el segundo martes de cada mes) y cómo termina.
4. **Agreement Booking Incident:** el Incident Type preventivo y el **Customer Asset** (el CX-200), para que el historial quede en el activo.
5. **Criterio de cierre:** qué evidencia exiges (inspection, lecturas, repuestos usados) antes de pasar a **Posted**.

**Variante con trial (20 min):** en el área **Service**, **Agreements** > **New**. Deja **System Status** en **Estimate**, guarda, y en la sección **Booking Setups** usa **New Agreement Booking Setup** (puede estar bajo el menú **⋮**). Configura la recurrencia con **Booking Recurrence**, agrega el incidente con **New Agreement Booking Incident** y, al final, pasa el **System Status** a **Active** y guarda. Abre el Booking Setup y revisa la sección **Booking Dates**: cada fecha empieza en *Active* y pasa a *Processed* cuando se genera su Work Order. Si no aparecen fechas, revisa que el Agreement esté en *Active* y que la recurrencia caiga dentro de sus fechas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Propietario del Agreement y por qué | ___ |
| Días de anticipación elegidos y razón | ___ |
| Auto Generate Booking (sí/no) y razón | ___ |
| Patrón de recurrencia y fin | ___ |
| Evidencia exigida antes de Posted | ___ |
| (Solo con trial) Número de Booking Dates que se crearon al activar | ___ |

---

## 🧩 Microlección 4 — En campo: offline, inventario y conflictos

**¿Qué vas a aprender?** A prever qué tiene el técnico en el teléfono sin señal, qué pasa al volver la conexión y cómo se registra lo que consume.

**¿Por qué existe esto?** Los problemas de sincronización se descubren cuando un técnico real pierde señal en un sótano. Y la regla de conflictos por defecto sorprende a casi todos los dispatchers.

**Práctica (30 min, en papel):**

1. **Qué baja al teléfono:** el técnico de Litware Sur entra a una planta sin señal. Lista lo que necesita tener ya descargado (booking, Work Order, service tasks, inspection, activo, productos, dirección) y qué **no** funcionará sin red (Learn menciona mapas y búsquedas en Dataverse).
2. **Qué pasa al volver la señal:** mientras el técnico estaba offline, el dispatcher cambió la hora de fin del booking; el técnico cambió la hora de inicio. Con el ajuste por defecto, ¿qué cambio se conserva? ¿Y si se activa la detección de conflictos? Recuerda: el conflicto es por registro, no por campo.
3. **Inventario:** el técnico usa un sello de bomba que no está en la camioneta. Escribe qué debería pasar con **Use Of Products out of Stock** en **Restrict** y en **Confirm**, y cuál elegirías si el inventario de las camionetas se lleva en otro sistema.
4. **Diagnosticar — micropráctica (7 min):** en un piloto, los cambios del dispatcher desaparecen después de que los técnicos sincronizan → **[Diagnosticar: el cambio del dispatcher desaparece al sincronizar](/practica/ip-d365-011-diagnosticar-cambio-perdido-al-sincronizar)**. Formula tu hipótesis antes de abrir las pistas.

**Variante con trial (opcional):** en [Power Apps](https://make.powerapps.com/), selecciona tu ambiente, **Apps**, abre **Field Service Mobile**, **Settings** > **General** y, en **Select offline mode and profile**, mira qué perfil está asignado. Con **…** > **Edit selected profile** puedes ver el intervalo de sincronización de cada tabla. Anota el de *Bookable Resource Booking*.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Lo que debe estar descargado antes de entrar sin señal | ___ |
| Lo que no funcionará offline | ___ |
| Cambio que se conserva con el ajuste por defecto / con detección de conflictos | ___ |
| Restrict o Confirm para tu caso, y por qué | ___ |
| Tu hipótesis en el diagnóstico antes de ver las pistas | ___ |
| (Solo con trial) Intervalo de sincronización de Bookable Resource Booking | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — el control del paso crítico

> **Situación:** una empresa de mantenimiento de equipos de bombeo para edificios quiere garantizar que **ningún** mantenimiento preventivo se cierre sin verificar la válvula de alivio de presión. Tiene 60 técnicos, unos 90 Work Orders preventivos al día generados por Agreements, y zonas sin señal en sótanos.
> **Entrega:** una decisión de una página: qué piezas de Field Service usas para que el paso exista, para que no se pueda saltar y para que alguien lo compruebe antes de facturar; qué dejas fuera y por qué; y si el volumen justifica RSO.

No hay una sola respuesta correcta: la evidencia es la decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| El paso existe en el sistema | Está como service task del Incident Type que usa el Agreement, no como una nota en el Work Order |
| El paso no se puede saltar sin dejar rastro | Hay una inspection con una pregunta **Required** (por ejemplo, la presión medida o una foto) y sabes que sin respuesta no se marca la task |
| Alguien comprueba antes de facturar | Defines quién revisa y qué mira antes de **Posted**, porque Learn no documenta que una task sin completar bloquee el cierre |
| Funciona sin señal | Las tablas de la inspection y las tasks están en el perfil offline, y dijiste qué regla de conflictos usarías |
| La decisión de asignación tiene números | Justificas schedule assistant o RSO con los 90 diarios y 60 técnicos, y nombras su costo |
| Reconoces lo que no sabes | Marcas como "por verificar" lo que dependa de licencia o de una trial que no tienes |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu decisión en tres líneas | ___ |
| Pieza que descartaste y por qué | ___ |
| Qué revisa el supervisor antes de Posted | ___ |

---

## 🔁 Reto de transferencia — Control de plagas en restaurantes

Cambia el negocio: ya no son equipos industriales, son visitas de fumigación. Una empresa de control de plagas atiende 400 restaurantes con visitas **semanales** por contrato. Solo técnicos con **certificación vigente de aplicación de químicos** pueden hacer la visita; cada visita consume químicos que se descuentan del inventario de la camioneta; el inspector sanitario exige una **foto de cada trampa** revisada; y muchas cocinas están en sótanos sin señal.

1. **Micropráctica (8 min):** **[Transferir: control de plagas con visitas semanales](/practica/ip-d365-012-transferir-control-de-plagas)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** escribe el diseño en cinco líneas (Agreement, Incident Type, asignación, evidencia, inventario) y una pregunta que le harías al cliente antes de cerrarlo (por ejemplo, qué pasa si la certificación del técnico vence a mitad de mes).

**Evidencia a reportar:**

| Pieza | Tu decisión | Qué la justifica |
|---|---|---|
| Recurrencia semanal | ___ | ___ |
| Certificación del técnico | ___ | ___ |
| Foto de cada trampa | ___ | ___ |
| Químicos de la camioneta | ___ | ___ |
| Sótanos sin señal | ___ | ___ |

### 💼 Casos Reales de Negocio
Una empresa de mantenimiento de ascensores configuró Field Service sin Incident Type Tasks — cada técnico decidía qué revisar según su propio criterio. Una auditoría de seguridad detectó que el 30% de los cierres de "mantenimiento preventivo" no habían verificado el freno de emergencia, un paso crítico que no estaba en ningún checklist obligatorio porque nunca se configuró como tarea del Incident Type. La corrección — agregar las tareas obligatorias al Incident Type — costó una tarde de configuración; la auditoría de seguridad y el riesgo legal acumulado durante meses de cierres incompletos costó mucho más.

### ✅ Buenas Prácticas
- Configurar las Characteristics (skills) y su Rating Value ANTES de usar el schedule assistant: sin ellas, la recomendación de técnicos no distingue al capacitado del que no lo está.
- Definir las tareas críticas de cada Incident Type con el equipo de operaciones/seguridad, no solo con criterio técnico: son controles de cumplimiento, no solo checklist de calidad.
- Para un paso crítico, no confiar solo en la service task: asociarle una inspection con preguntas **Required** y revisar antes de **Posted** que las tasks críticas estén completas.
- Usar la reserva manual solo para urgencias y excepciones, sabiendo que no valida skills, disponibilidad ni ubicación; para el resto, schedule assistant o RSO.
- No activar Resource Scheduling Optimization "porque suena más avanzado": es un add-in de pago y solo se justifica con volumen alto; mal configurado puede asignar técnicos sin que un humano note un error de territorio hasta que ya está en camino.
- Decidir a propósito la regla de conflictos offline y probar la sincronización con pérdida de señal real antes del despliegue.
- Modelar Customer Assets y Agreements antes de crear cientos de Work Orders manuales, y dar al Agreement un propietario que no dependa de una persona.
- Capturar evidencia con Inspections cuando hay cumplimiento, seguridad o garantía involucrada.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Work Order sin Characteristics requeridas | Se asume que "cualquier técnico puede hacerlo" | Definir explícitamente skill y Rating Value mínimo en cada Incident Type |
| Incident Type sin tareas obligatorias | Se prioriza velocidad de configuración inicial | Agregar las tareas críticas de cumplimiento/seguridad antes de ir a producción |
| Work Orders cerrados con la task crítica sin marcar | Se supuso que la service task bloquea el cierre; Learn no lo documenta | Inspection con preguntas Required en la task crítica y revisión de tasks antes de Posted |
| Técnico sin la skill asignado desde el Schedule Board | Reserva manual con **Book** o arrastrando; no valida Characteristics | Usar **Find availability** (schedule assistant) salvo en urgencias justificadas |
| Activar RSO con bajo volumen de órdenes | Se confunde "automatizar" con "mejorar" sin evaluar el caso de uso | Reservar RSO para volumen alto; con pocas órdenes diarias, el schedule assistant es más auditable |
| No probar la sincronización offline | Se asume que el técnico siempre tiene señal | Simular pérdida de conexión en pruebas antes del despliegue |
| El cambio del dispatcher desaparece tras sincronizar | Detección de conflictos en **No** (por defecto): gana el registro editado offline | Decidir la regla de conflictos; si el dispatcher debe ganar, activar la detección y avisar al técnico |
| El técnico ve **Record Not Found** en el teléfono | El registro ya no cumple los filtros del perfil offline y se borró del dispositivo | Revisar los filtros del perfil; que no sean demasiado restrictivos para el trabajo del día |
| Crear Work Orders preventivas manualmente | No se configuraron Agreements | Usar Agreements para recurrencia y trazabilidad |
| El Agreement deja de generar Work Orders | Su propietario dejó la organización y los procesos corren con sus permisos | Usar un usuario de sistema o un equipo como propietario |
| Cierre con notas libres | No existen inspections/tareas | Definir checklist estructurado por Incident Type |

### 🧪 Criterios de Validación
- [ ] Definí un Incident Type con Characteristic y Rating Value, tres service tasks y calculé su duración como la suma de las tasks
- [ ] Expliqué qué controla una service task, qué controla una pregunta Required de una inspection y qué queda para la revisión antes de Posted
- [ ] Elegí, para tres casos, entre reserva manual, schedule assistant y RSO, sabiendo que la reserva manual no valida skills
- [ ] Decidí, con criterio de volumen y costo, si el caso justifica Resource Scheduling Optimization
- [ ] Diseñé un Agreement preventivo conectado a activo, tareas, recurrencia, anticipación y propietario
- [ ] Diseñé qué datos están disponibles offline en la app móvil y qué no funciona sin señal
- [ ] Expliqué qué cambio se conserva en un conflicto offline con el ajuste por defecto y con la detección activada
- [ ] Decidí entre Restrict y Confirm para el uso de productos sin existencias
- [ ] Diagnostiqué el cambio perdido al sincronizar formulando una hipótesis antes de ver la causa
- [ ] Defendí contra la rúbrica cómo controlar un paso crítico de seguridad
- [ ] En el reto de transferencia diseñé las cinco piezas del caso de control de plagas
- [ ] Identifiqué qué requiere licencia/ambiente Field Service real

### 📸 Evidencia para guardar
- Las tablas de evidencia de las cuatro microlecciones, de la decisión defendida y del reto de transferencia.
- Si usaste una trial: una captura del Work Order con las service tasks generadas y otra de las Booking Dates del Agreement.

> **Siguiente paso:** el [Lab 59](/labs/lab-59-field-service-work-order-uat) lleva el Incident Type y la asignación a UAT; el [Lab 86](/labs/lab-86-field-service-agreement-preventive-maintenance) profundiza en el Agreement preventivo; el [Lab 87](/labs/lab-87-field-service-mobile-offline-work-order) en el trabajo offline; y el [Lab 113](/labs/lab-113-field-service-capstone-operacion-de-campo) integra todo en una operación de campo.

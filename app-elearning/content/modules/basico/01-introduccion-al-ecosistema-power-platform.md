---
moduleId: 1
title: "Introducción al Ecosistema Power Platform"
level: "basico"
certification: "PL-900"
estimatedMinutes: 20
practiceMinutes: 90
slug: "introduccion-al-ecosistema-power-platform"
lastVerified: "2026-11"
---
*Duración: 1-2 semanas · Lectura: 10-12 min · Con práctica y setup de ambiente: los bloques suman 70 a 110 min con la cuenta lista; la primera vez, cuenta entre el doble y el triple (el tiempo de setup varía y no depende de ti)*

> **🌱 ¿Nunca tocaste Power Platform?** Lee primero [Ruta cero absoluta](/recursos/ruta-cero-absoluta) —
> aclara qué es un tenant, un ambiente y la diferencia entre Developer/Sandbox/Production/trial antes
> de que este módulo te pida crear el tuyo.

> **📌 ¿Primera vez usando una herramienta profesional en la nube?** Si nunca has creado una cuenta de trabajo, entrado a un panel de administración o usado algo parecido a Excel/Access, lee primero la tabla de abajo. Si ya usas software de oficina o herramientas web con soltura, sáltala y ve directo al Objetivo.

### 🌱 Fundamentos digitales antes de empezar (opcional si ya los conoces)

| Término | En una frase |
|---|---|
| **Nube (Cloud)** | Programas y datos que viven en computadoras de Microsoft, no en tu PC — por eso accedes desde cualquier navegador con internet. |
| **Navegador** | El programa donde abres páginas web (Edge, Chrome) — aquí es donde vas a trabajar todo el curso, no instalas nada pesado. |
| **URL** | La dirección de una página, como `make.powerapps.com` — la escribes o pegas en la barra de arriba del navegador. |
| **Cuenta / Login** | Tu usuario y contraseña para identificarte; la cuenta que crearás en este módulo es de trabajo/estudio, distinta a tu correo personal. |
| **Panel de administración (Admin Center)** | Una página donde se configuran cosas a nivel de toda la organización, no de una sola app — normalmente no la tocas hasta niveles más avanzados. |
| **Tabla (como en Excel)** | Filas y columnas de datos. Dataverse (lo verás abajo) es básicamente muchas tablas conectadas entre sí, como varias hojas de Excel que se hablan entre ellas. |
| **Registro (Record)** | Una fila dentro de una tabla — por ejemplo, un cliente específico es un registro en la tabla de clientes. |

> No necesitas memorizar esto. Vuelve aquí si te pierdes en una palabra durante el módulo.

### 🎯 Objetivo
Comprender la arquitectura, componentes y casos de uso de Power Platform.

### ✅ Qué vas a lograr hoy
- Tener tu propio ambiente del curso (Trial con Dataverse, o el que te dé tu organización) funcionando, y saber cuándo vence.
- Explorar Power Apps, Dataverse y sus conectores por primera vez, sin construir nada complejo todavía.
- Crear 5 registros de prueba en una tabla ya existente — tu primera interacción real con Dataverse.

### 🙅 Qué NO necesitas dominar todavía
- No necesitas entender licenciamiento a fondo, ni CoE, ni ALM en detalle — solo saber que existen y para qué sirven a grandes rasgos.
- No necesitas terminar los Suplementos 1A (AI Builder) y 1B (Power Pages) hoy — son opcionales y puedes volver a ellos después de tu primera práctica.
- No necesitas escribir ninguna fórmula de Power Fx en este módulo.

> **📌 Si aún no tienes tu ambiente listo:** conseguir la cuenta de trabajo y crear el ambiente puede tardar minutos o hasta un día completo si requiere verificación. Esto puede tomar más tiempo que una clase normal — **no significa que hiciste algo mal**. Puedes seguir leyendo el resto del módulo mientras esperas, o volver mañana cuando el ambiente esté activo.

### 📚 Mini-glosario antes de empezar

| Término | En una frase |
|---|---|
| **Dataverse** | La base de datos común de Power Platform — donde viven las tablas que usan tus apps y flujos. |
| **Ambiente (Environment)** | Un espacio separado y aislado para trabajar, como una carpeta propia; nunca mezcles pruebas con producción. |
| **Tenant** | La organización completa en Microsoft 365/Power Platform a la que perteneces — puede tener varios ambientes adentro. |
| **Solución (Solution)** | El contenedor donde empaquetas tablas, apps y flujos para poder moverlos entre ambientes de forma ordenada. |
| **Publisher** | El "sello" con tu prefijo (ej. `sit_`) que identifica que una tabla o columna es tuya, no del sistema. |
| **Power Apps** | La herramienta para crear apps de negocio. |
| **Power Automate** | La herramienta para crear flujos: tareas que se hacen solas (por ejemplo, enviar un correo cuando llega una solicitud). |
| **Power BI** | La herramienta para hacer reportes y tableros con gráficos. Se abre en https://app.powerbi.com. |
| **Copilot Studio** | La herramienta para crear agentes: asistentes de chat que responden preguntas o hacen tareas. |
| **Power Fx** | El lenguaje de fórmulas de Power Apps. Se parece a las fórmulas de Excel. |
| **Canvas App** | Una app que diseñas pantalla por pantalla, como un lienzo en blanco. |
| **Model-Driven App** | Una app que Power Apps arma sola a partir de tus tablas de Dataverse (listas y formularios). |
| **Trial (prueba)** | Una versión gratis por tiempo limitado. Al terminar, se deshabilita o pide pago. |
| **Licencia por usuario** | El permiso de uso que se paga por cada persona que usa el producto. |
| **Region** | El país o zona donde Microsoft guarda los datos de tu ambiente. |
| **Security group** | Una lista de personas de tu organización. Si se asigna a un ambiente, solo esas personas pueden entrar. |
| **Ambiente gestionado / no gestionado** | *Gestionado* (managed, también "administrado") = tu organización le aplica sus reglas de control (Managed Environments). *No gestionado* (unmanaged) = sin esas reglas. Desde el 15 de noviembre de 2026 los ambientes Developer solo se crean gestionados y los asigna un administrador. Ojo: en el Módulo 2 verás *managed/unmanaged* para las **soluciones**, y ahí significa otra cosa (si la solución se puede editar o no). |
| **API** | La "puerta" por la que un programa lee o escribe datos en otro, sin usar la pantalla. |
| **ALM** | *Application Lifecycle Management*: la forma ordenada de llevar lo que construyes de desarrollo a pruebas y luego a producción. |
| **CoE** | *Center of Excellence*: el equipo y las herramientas con que una empresa controla y apoya el uso de Power Platform. |

### 📖 Conceptos Clave (esenciales para hoy)
- **Arquitectura de Power Platform**: Componentes principales y su interrelación
- **Microsoft Dataverse**: la base de datos de Power Platform, donde viven las tablas que usan tus apps y flujos (antes se llamaba *Common Data Service*).
- **Ambientes (Environments)**: espacios separados para trabajar. Tipos: *Production* (producción, lo que usa la gente de verdad), *Sandbox* (pruebas), *Developer* (espacio personal de desarrollo; desde noviembre de 2026 solo gestionado y asignado por un administrador) y *Trial* (prueba que caduca: el que usa este curso como camino principal).
- **Conectores**: piezas que conectan Power Platform con otros servicios. *Standard* (estándar, incluidos en la licencia básica), *Premium* (requieren licencia de pago) y *Custom* (personalizados, los creas tú para tu propio sistema).
- **Power Platform Admin Center**: el panel de administración donde se crean y gestionan los ambientes y sus recursos.

> **Verás esto más adelante, no hace falta dominarlo hoy:** Soluciones y ALM (se practica a fondo desde el Módulo 2), Licenciamiento per-user/per-app/pay-as-you-go (retomado en niveles posteriores), Center of Excellence — introducción conceptual únicamente por ahora.

### 👨‍💻 Actividades Prácticas

> **Cómo está organizado este módulo:** en vez de leer todo y practicar al final, alternas. Cada bloque tiene una idea corta, una práctica de pocos minutos y un dato real de tu propio ambiente para guardar. Cierras con un reto en el que ya no te digo los pasos. Si tu ambiente aún no está listo, haz las microprácticas y el reto de transferencia (no necesitan tenant) y vuelve a las partes con ambiente cuando esté activo.

## 🧩 Microlección 1 — Tu tenant y tu ambiente: dónde vas a trabajar

**¿Qué vas a aprender?** Qué es un ambiente, por qué trabajas en uno propio y no en el que ya existe, y cómo ver cuál tienes activo.

**¿Por qué existe esto?** Todo lo que construyas vive dentro de un ambiente. Si trabajas en el ambiente *default* (el que comparte toda la organización), tus pruebas se mezclan con las de todos y no puedes controlarlas. Un ambiente propio para el curso es tu espacio aislado: lo que rompes ahí no afecta a nadie.

**Ejemplo pequeño:** la misma organización tiene el ambiente `Contoso (default)` y el tuyo, `DEV-TuNombre`. Una tabla creada en uno no aparece en el otro.

> **Lo mínimo para este módulo:** una cuenta de trabajo o estudio y tu **ambiente del curso** con Dataverse: un ambiente **Trial** que creas tú, o un Developer gestionado o Sandbox que te dé tu organización. El trial de Dynamics 365 es opcional: puedes saltarte ese paso y volver cuando llegues a los módulos de Dynamics 365. El Power Platform Admin Center está en https://admin.powerplatform.microsoft.com.

**Práctica real en tu entorno (20-60 min; el tiempo depende de Microsoft, no de ti):**

> **⚠️ Tu ambiente del curso es temporal, y debes saberlo desde hoy.** Desde el **15 de noviembre de 2026**, registrarse en el Power Apps Developer Plan ya no crea un ambiente Developer gratuito ([Developer Plan](https://learn.microsoft.com/power-platform/developer/plan), [Important changes coming](https://learn.microsoft.com/power-platform/important-changes-coming)). Por eso el camino principal del curso es un ambiente **Trial (standard) con Dataverse**: dura **30 días** y admite **una sola extensión de 30 días** que solo puedes pedir en su última semana; después se deshabilita y se elimina ([Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)). Lo hace viable un hábito: **todo lo que construyas va dentro de tu solución y la exportas al terminar cada módulo o sesión**; cuando el Trial venza, creas otro ambiente e importas la solución. El detalle, con fechas, límites y el paso a paso de exportar e importar, está en [Entornos y trials](/recursos/entornos-y-trials).

**Paso 1 — Consigue una cuenta de trabajo o estudio (no sirve tu correo personal).**

Microsoft no permite registrarse con una cuenta personal como Gmail, Outlook.com o Hotmail. Elige el caso que se parezca al tuyo:

- **Tienes correo de empresa o universidad:** úsalo. Pasa al "Paso 1B" para saber si tienes permisos de administración.
- **No tienes correo profesional ni educativo:** Learn indica que puedes crear una **cuenta gratuita de Microsoft Entra** para registrarte ([Sign up for Power Apps](https://learn.microsoft.com/power-apps/maker/signup-for-powerapps)). Inténtalo por esa vía; no está verificado qué recibe exactamente esa cuenta. Otra vía, que ya usaba este curso, es crear tu propio tenant de prueba:
  1. Abre https://www.microsoft.com/microsoft-365/try.
  2. Elige un plan de empresa con prueba gratuita de un mes.
  3. Sigue el asistente. Al terminar tendrás una cuenta del tipo `tunombre@tuorganizacion.onmicrosoft.com` y tendrás permisos de **administración** de ese tenant.
  4. Anota el usuario, la contraseña (en un lugar seguro, no en la evidencia) y la **fecha en que termina la prueba**.
  5. **Cuidado con el cobro:** el registro puede pedirte una tarjeta. Al terminar el mes, la mayoría de las pruebas pasan solas a una suscripción de pago. Si no quieres pagar, antes de que termine entra al Microsoft 365 admin center (https://admin.microsoft.com), ve a **Billing** > **Your products** y desactiva **recurring billing** (la renovación automática).
- **Tienes una suscripción de Visual Studio Professional o Enterprise:** puedes pedir el sandbox del [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program). Hoy solo califican esos suscriptores, algunos partners y clientes de soporte Premier o Unified. La mayoría de los principiantes no califica, así que no lo uses como primera opción.

**Paso 1B — ¿Tienes permisos de administración en tu tenant?**

Los tienes si tu cuenta tiene uno de estos roles: **Global Administrator**, **Power Platform Administrator** o **Dynamics 365 Administrator**.

- Si creaste tu propio tenant de prueba en el Paso 1, sí los tienes.
- Si usas el correo de tu empresa o universidad, casi seguro **no** los tienes. Si no lo sabes, pregúntale a tu equipo de TI: "¿Tengo alguno de estos roles?". No hace falta ser administrador para crear un ambiente Trial: cualquier usuario con una licencia adecuada puede, salvo que tu organización lo haya restringido a los administradores ([Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)). Si te lo bloquean, sigue la **Opción B**.

**Paso 2 — Consigue tu ambiente del curso.**

*Opción A (camino principal): crea tu propio ambiente Trial con Dataverse.*

**Paso 2A — Activa la licencia Power Apps trial.** Sin una licencia adecuada no puedes crear un ambiente Trial: la licencia gratuita del Developer Plan y las de Microsoft 365 **no** sirven para eso. La licencia Power Apps trial sí, e incluye "Create and manage environments and Dataverse databases" ([Sign up for Power Apps](https://learn.microsoft.com/power-apps/maker/signup-for-powerapps)).

1. Abre https://apps.powerapps.com/trial e inicia sesión con tu cuenta de trabajo o estudio.
2. Sigue el asistente hasta que te confirme la prueba.
3. Anota la fecha: la licencia dura **30 días** y se puede extender dos veces, hasta **90 días** en total. Si tu organización bloqueó las licencias de prueba, sigue la **Opción B**.

**Paso 2B — Crea el ambiente** (según [Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)):

1. Abre https://admin.powerplatform.microsoft.com e inicia sesión con tu cuenta de trabajo.
2. En el panel de navegación selecciona **Manage** y, en el panel **Manage**, **Environments**.
3. En la página **Environments** selecciona **New** en la barra de comandos.
4. Completa la primera pantalla:
   - **Name:** `DEV-TuNombre`.
   - **Type:** **Trial**. (Si ves también **Trial (subscription-based)**, no es ese: ese tipo solo lo crean administradores con una suscripción de prueba de Dynamics 365.)
   - **Region:** la más cercana a ti.
   - **Purpose:** una descripción corta, por ejemplo `Ambiente del curso Power Platform`.
   - **La opción de añadir Dataverse:** según la pantalla se llama **Create a database for this environment?** o **Add a Dataverse data store**. Elige **Yes**: sin Dataverse no hay tablas.
   - Haz clic en **Next**.
5. Completa la segunda pantalla:
   - **Language:** **English (United States)**. ¿Por qué? El curso usa los nombres de los botones en inglés, y así evitas tener dos columnas llamadas "Estado" en el Módulo 2. El idioma base del ambiente ya no se puede cambiar después.
   - **URL** (si aparece): una corta y única, por ejemplo `dev-tunombre`.
   - **Currency:** la de tu país.
   - **Enable Dynamics 365 apps:** **No**. Las apps de Dynamics 365 se practican más adelante, cada una con su propio trial y su propio ambiente.
   - **Security group:** elige **None** (acceso abierto, lo normal en un ambiente personal) si está disponible; si tu organización te obliga a elegir uno, elige el que te indique TI.
   - Haz clic en **Save**.
6. Espera a que tu ambiente aparezca en la lista como **Ready**. Suele tardar unos minutos y a veces más.
7. **Anota la fecha de vencimiento y pon dos recordatorios.** En **Environments**, selecciona tu ambiente y, en el panel **Details**, **See all** para ver **Day(s) remain**. Pon un recordatorio **siete días antes** del vencimiento (para pedir la extensión con **Extend trial**, solo una vez) y otro dos días antes del final de la extensión (para exportar por última vez y crear el ambiente siguiente). Los pasos están en [Entornos y trials](/recursos/entornos-y-trials).

> **Lo que un Trial no puede hacer:** solo se puede crear y eliminar; **no se puede restablecer (reset), respaldar, restaurar ni copiar**. Un Trial sin actividad en su base de datos durante 30 días también se elimina. Tu copia de seguridad es tu solución exportada.

*Opción B: tu organización te da el ambiente (la mejor opción, si es posible).*

Si tu empresa o universidad te puede dar un **ambiente Developer gestionado** o un **Sandbox** con licencia premium, es lo mejor: no caduca a los 30 días y sirve para todo el curso. Tú no lo creas: lo crea un administrador. Envía a tu equipo de TI un mensaje como este:

> "Hola. Estoy haciendo un curso de Power Platform y necesito un ambiente para practicar. ¿Me pueden dar un **ambiente Developer gestionado** (managed developer environment) **con Dataverse**, solo para mí? Se puede crear desde el Power Platform admin center o con *environment routing*. Si no es posible, ¿me pueden dar un ambiente **Sandbox** con Dataverse, o permitirme crear un ambiente **Trial**? En ese ambiente necesito el rol **System Customizer** o **System Administrator**. Para ejecutar apps y flujos en un Developer gestionado necesito además una licencia premium de Power Apps (o una de prueba), porque el Developer Plan no incluye los derechos de Managed Environments."

Mientras esperas, sigue leyendo y haz las microprácticas: no necesitan ambiente.

*Si ya tienes un ambiente Developer creado antes del 15 de noviembre de 2026:* puedes seguir usándolo como ambiente del curso **hasta el 15 de diciembre de 2026**, fecha desde la que se suspende (se elimina desde el 15 de enero de 2027). **Exporta tus soluciones antes del 15 de diciembre** e impórtalas en tu ambiente Trial o en el que te dé tu organización. Si tienes licencia premium y un administrador, Learn da otra salida: activar Managed Environments en ese ambiente antes de esa fecha ([Developer Plan](https://learn.microsoft.com/power-platform/developer/plan)).

**Paso 3 — Confirma que estás dentro de tu ambiente.**

1. Abre https://make.powerapps.com.
2. Arriba a la derecha está el selector de ambiente. Haz clic en él y elige el ambiente que creaste.
3. En el menú de la izquierda abre **Tables** (si no lo ves, está en **More**). Si ves una lista de tablas (Account, Contact…), tu ambiente tiene Dataverse y ya puedes hacer el Mini Lab 01. Si en su lugar ves un botón **Create a database**, el ambiente no tiene Dataverse: en tu ambiente propio puedes crearla con ese botón; si no, pídeselo a TI.

> **Si los botones aparecen en español:** la página usa el idioma de tu navegador. Este curso usa los nombres en inglés. Para cambiarlos, abre el engranaje (**Settings**, arriba a la derecha) > **Power Apps settings** y cambia el idioma, o cambia el idioma de tu navegador. Si prefieres dejarlo en español, busca el botón equivalente en la misma zona de la pantalla.

**Cómo guardar una copia de tu trabajo (exportar una solución).** Desde el Módulo 2, cuando tengas tu propia solución, lo harás **al terminar cada módulo o sesión**, no solo antes de que tu ambiente caduque:

1. En make.powerapps.com abre **Solutions** (si no lo ves, está en **More**).
2. Selecciona tu solución y, en la barra de comandos, **Export**. (La *Default Solution* no se puede exportar: por eso en el Módulo 2 creas una propia.)
3. En el panel **Before you export**, selecciona **Publish all changes** y luego **Next**.
4. En **Export as** elige **Unmanaged** (así podrás seguir editándola en el ambiente nuevo) y selecciona **Export**.
5. Espera unos minutos. El archivo `.zip` se descarga en tu carpeta de descargas. Renómbralo con la fecha y el módulo y guárdalo fuera del ambiente (tu computadora o tu nube personal).

Cuando el Trial venza, creas otro ambiente igual e importas el `.zip` (**Solutions** > **Import solution**). Ojo: los **datos** (filas), las **conexiones** y el **historial de ejecuciones** no viajan en la solución; tendrás que volver a crear conexiones y datos de prueba. Paso a paso en [Entornos y trials](/recursos/entornos-y-trials).

**Paso 4 (opcional, solo cuando llegues a los módulos de Dynamics 365) — Trial de Dynamics 365.**

El trial de Dynamics 365 Customer Service **no se añade a tu ambiente del curso**: crea un ambiente aparte con las apps de Dynamics 365 instaladas. Sáltalo por ahora.

**Si algo sale distinto:**

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Al crear el ambiente, el Admin Center no te deja elegir **Trial** o te pide una licencia | Tu usuario no tiene una licencia que permita crear un Trial (las de Microsoft 365 y la del Developer Plan no sirven) | Activa la licencia Power Apps trial (Paso 2A) y vuelve a intentarlo |
| Te dice que ya tienes un ambiente Trial | El límite es un ambiente Trial por usuario | Usa ese ambiente como ambiente del curso, o elimínalo si ya no lo necesitas (exporta antes lo que quieras conservar) |
| No puedes entrar al Admin Center, no ves **New** o te sale un error de permisos | Tu organización restringió la creación de ambientes (o de trials) a los administradores | Envía a TI el mensaje de la **Opción B**. Mientras tanto, haz las microprácticas |
| No puedes activar la licencia Power Apps trial | Tu organización bloqueó las licencias de prueba | Envía a TI el mensaje de la **Opción B**, o usa una cuenta propia (Paso 1) |
| El portal del Microsoft 365 Developer Program te dice que no calificas | No tienes una suscripción que califique | Usa una de las otras vías del Paso 1 |
| En **Type** solo ves **Developer** o te ofrecen registrarte en el Developer Plan | Desde el 15 de noviembre de 2026 el Developer Plan ya no crea un ambiente, y el Developer solo existe como ambiente gestionado que asigna un administrador | Elige **Trial**; si quieres un Developer gestionado, pídelo con la **Opción B** |
| Faltan siete días o menos para que venza tu Trial | Es la única ventana para la extensión | En **Manage** > **Environments**, selecciona tu ambiente y **Extend trial** (una sola vez, suma 30 días). Exporta tu solución ese mismo día |
| Tu ambiente desaparece o queda deshabilitado | Venció el Trial (30 días, o 60 con la extensión), o pasó 30 días sin actividad en su base de datos | Crea un ambiente nuevo con los mismos ajustes e importa tu última solución exportada; vuelve a crear conexiones y datos de prueba |

**Ahora haz algo — micropráctica (5 min):** **[Diagnosticar: lo que creaste no aparece para tu compañera](/practica/ip-trb-003-ambiente-equivocado)**. Parte de un síntoma real —lo que construiste "desaparece"— y te pide decir qué pasó antes de ver la solución. Es el error de ambiente más común del primer día.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre exacto de tu ambiente | ___ |
| Tipo del ambiente (Developer, Sandbox, Production o Trial) | ___ |
| Fecha de vencimiento (**Day(s) remain**) y fecha de tu recordatorio para **Extend trial**, si es un Trial | ___ |
| Ambiente activo que ves arriba a la derecha en make.powerapps.com | ___ |

---

## 🟢 Mini Lab 01 — Primera victoria en 5 minutos

> **Hazlo cuando termines el Paso 3 de la Microlección 1** (necesitas tu ambiente con Dataverse). No necesitas crear una app todavía.

**Qué vas a construir:** no vas a construir una solución completa; vas a crear tu primera evidencia real dentro del ambiente.

1. Entra a [make.powerapps.com](https://make.powerapps.com) con tu ambiente elegido arriba a la derecha.
2. En el menú lateral, abre **Tables** (si no lo ves, está en **More**).
3. Elige la pestaña **All** (todas las tablas), busca la tabla estándar **Account** y ábrela. Se abre la página de la tabla, que llamamos su *hub*.
4. En la barra de comandos selecciona **Edit**. Se abre el diseñador de la tabla, con las filas abajo. (Si ves **View data**, también sirve: abre el editor de filas.)
5. Agrega una fila nueva: en la barra de comandos que está justo encima de la cuadrícula de filas, usa el comando que crea una fila (el editor de filas permite crear, editar y borrar filas, según [Learn](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal)), y escribe:
   - **Account Name:** `Cliente Demo 01`
   - **Main Phone:** `3000000000`
   - **Address 1: City:** `Bogotá`
   - Si no ves **Main Phone** o **Address 1: City** en la cuadrícula, usa la opción para mostrar más columnas (por ejemplo, **+17 more**) y márcalas.
6. Guarda si te lo pide y confirma que la fila aparece en la lista.

**Resultado esperado:** ves una fila nueva en la tabla Account. Esa fila es tu primera interacción real con Dataverse.

**Evidencia para guardar:** captura de la tabla Account mostrando `Cliente Demo 01` y el nombre del ambiente en la parte superior.

**Si no puedes entrar todavía:** guarda una nota con el mensaje de bloqueo del tenant/trial. Eso también sirve como evidencia de avance; el setup depende de Microsoft, no solo de ti.

---

## 🧩 Microlección 2 — Qué pieza resuelve qué

**¿Qué vas a aprender?** Reconocer las piezas del ecosistema (Power Apps, Power Automate, Power BI, Copilot Studio y Dataverse) y qué dolor resuelve cada una.

**¿Por qué existe esto?** El error más caro del principiante es construir con la pieza equivocada: hacer una app cuando lo que hacía falta era un flujo que actúe solo. Saber qué hace cada pieza te ahorra rehacer.

**Ejemplo pequeño:** aprobar una solicitud por correo es trabajo de Power Automate; ver cuántas se aprobaron por mes es de Power BI; capturarla desde el celular es de Power Apps; y los datos de las tres viven en Dataverse.

**Ahora haz algo — micropráctica (6 min):** **[Elegir las piezas de Power Platform para un caso](/practica/ip-dv-005-elegir-piezas-para-un-caso)**. Te da el caso de una clínica veterinaria y te pide decidir qué pieza cubre cada necesidad, incluyendo cuáles NO hacen falta.

**Práctica real en tu entorno (10 min):**

1. Entra a https://make.powerapps.com.
2. Recorre el menú lateral. Normalmente verás:
    - **Home** (inicio), **Create** (crear apps), **Learn** (ayuda y cursos), **Plans** (planes), **Apps** (tus apps) y **AI hub** (modelos de IA).
    - Tus páginas más usadas, por ejemplo **Tables**, **Connections** o **Flows**. Power Apps fija solas las tres que más usas.
    - **More**: aquí está todo lo demás. Desde **More** puedes fijar (pin) una página en el menú. Si no encuentras algo, búscalo aquí.
    - **Power Platform**: te lleva a los otros productos, como Power BI, Power Automate y el Power Platform admin center.
3. Mira los conectores: abre **Connections** (si no está en el menú, búscalo en **More**) y selecciona **New connection**. Verás la lista de conectores disponibles. No crees ninguna conexión todavía.
4. Para saber si un conector es Standard o Premium, búscalo en la [lista oficial de conectores](https://learn.microsoft.com/connectors/connector-reference/): los Premium llevan el ícono **Premium**. También hay una lista solo de [Standard](https://learn.microsoft.com/connectors/connector-reference/connector-reference-standard-connectors) y otra solo de [Premium](https://learn.microsoft.com/connectors/connector-reference/connector-reference-premium-connectors).
5. Abre **Create** y mira las formas que te ofrece para empezar una app.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tres secciones del menú lateral que reconociste y, con tus palabras, para qué sirve cada una | ___ |
| Un conector Standard y uno Premium que encontraste (nombre exacto de cada uno) | ___ |
| Una forma de empezar una app que viste en **Create** y para qué caso de tu vida real serviría | ___ |

---

## 🧩 Microlección 3 — Dataverse y tu primera tabla

**¿Qué vas a aprender?** Qué es una tabla, una columna, una relación y un registro en Dataverse, mirando una tabla real en vez de leer la definición.

**¿Por qué existe esto?** Las apps, los flujos y los reportes leen y escriben en las mismas tablas. Si entiendes una tabla desde el primer día, no construyes sobre datos desordenados que luego cuesta arreglar.

**Ejemplo pequeño:** la tabla `Account` tiene columnas (Account Name, Main Phone, Address 1: City), cada fila es un registro (un cliente concreto) y se relaciona con otras tablas, como `Contact`.

**Práctica real en tu entorno (15 min):**

1. Abre **Tables** en el menú y elige la pestaña **All**.
2. Busca y mira las tablas estándar Account, Contact, Email y Task.
3. Abre la tabla **Account**. En su hub revisa estas zonas:
    - **Columns** (columnas o campos)
    - **Relationships** (relaciones con otras tablas)
    - **Business rules** (reglas de negocio)
    - **Views** (vistas: listas guardadas de registros)
4. Crea registros de prueba a mano, igual que en el Mini Lab 01 (**Edit** o **View data**, y una fila nueva por registro), hasta tener 5 registros de Account.
5. Para contar tus registros, mira las filas en el editor de filas. Son pocas, así que caben en una sola pantalla.

> Si ya completaste el Mini Lab 01, aquí solo agrega 4 registros más. Tu objetivo total del módulo son 5 registros de prueba, no 5 registros adicionales.
>
> En **Relationships** verás muchas relaciones del sistema. Para la evidencia, elige una cualquiera y anota con qué tabla conecta.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de tres columnas de la tabla Account que viste | ___ |
| Cantidad de registros que tiene tu tabla Account ahora | ___ |
| Una relación que viste en la pestaña Relationships (con qué tabla se relaciona) | ___ |

---

## 🔁 Reto de transferencia — Tu mapa personal, sin pasos

Esta vez no te digo qué hacer paso a paso: aplica lo que viste a un caso que conozcas.

> **Requerimiento:** elige un proceso real que conozcas (tu trabajo, tu estudio, un negocio familiar) donde hoy se usen Excel, papel o mensajes sueltos. Arma tu mapa: qué datos guardarías y dónde, quién los capturaría y desde qué, qué debería pasar solo y qué reporte necesitaría quien decide.
> **Criterios de aceptación:** (1) nombras al menos 4 piezas del ecosistema y cada una resuelve un dolor concreto de tu proceso, no las listas por listar; (2) dices de dónde sale cada dato, con una sola tabla como fuente; (3) indicas si alguien de fuera de la organización necesitaría usarlo y, si es así, qué pieza cambiaría.
> **Restricciones:** no necesitas tenant ni construir nada; es un mapa en papel o en una nota. Power Pages es la pieza para usuarios externos (personas de fuera de tu organización). Con sus **permisos de tabla** (table permissions) decides qué datos ve cada usuario externo: por ejemplo, que cada cliente vea solo sus propios pedidos. El detalle está en el Suplemento 1B, opcional.
> **Ejemplo resuelto (otro negocio, solo para que veas la forma):** una panadería que anota los pedidos en un cuaderno. Datos: una tabla Pedidos, que es la única fuente. Captura: una app en el mostrador para tomar pedidos. Automatización: un flujo que avisa a la cocina cuando entra un pedido. Reporte: pedidos por día. Usuario externo: no; si los clientes pidieran desde su casa, la pieza sería Power Pages. Tu mapa debe tener esa forma, con tu propio proceso.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: ahora los dueños reservan por su cuenta](/practica/ip-dv-006-transferir-reserva-externa)**. Retoma el caso de la clínica de la micropráctica anterior pero cambia un requisito, y te pide decidir qué cambia y qué se conserva.

**Evidencia a reportar (tu mapa personal de productos y un caso de negocio simple):**

| Campo | Tu valor |
|---|---|
| Proceso que elegiste y qué usa hoy | ___ |
| Las piezas que elegiste y el dolor concreto que resuelve cada una | ___ |
| ¿Algún usuario externo lo usaría? ¿Qué pieza cambiaría por eso? | ___ |

### 💼 Caso Real de Negocio

**Empresa:** Laboratorio Farmacéutico NovaBio — 280 empleados, 2 plantas de producción  
**Problema:** El área de Calidad gestionaba no-conformidades (productos fuera de especificación) por email y hojas Excel. Los formularios llegaban incompletos, las aprobaciones tardaban semanas y era imposible auditar el proceso para la certificación ISO 9001.  
**Consecuencia:** Auditoría externa detectó que el 34% de los registros de no-conformidades estaban incompletos o sin respuesta en los tiempos requeridos.

**Solución con Power Platform:**
- **Dataverse:** tabla central de no-conformidades con estados, responsables, fechas límite y adjuntos de evidencia
- **Power Apps Canvas:** formulario digital que valida campos obligatorios antes de permitir el envío — eliminó registros incompletos desde el primer día
- **Power Automate:** flujo automático notifica al responsable al crear la no-conformidad; escala al supervisor si no hay respuesta en 48h
- **Power BI:** dashboard para el Jefe de Calidad con indicadores de tiempo de cierre por tipo, área y responsable

**Resultados a 6 meses:**
- 100% de registros completos (vs 66% previo)
- Tiempo de cierre promedio reducido de 18 días a 6 días
- Superó la siguiente auditoría ISO 9001 sin observaciones en el proceso de no-conformidades

**Por qué Power Platform:** Ningún componente requirió código. El equipo de Calidad configuró el sistema en 3 semanas sin soporte externo.

### ✅ Buenas Prácticas
- Usar tu ambiente del curso (Trial, Developer o Sandbox) para pruebas, nunca directamente en Production
- Exportar tu solución al terminar cada módulo o sesión y guardarla fuera del ambiente: tu ambiente del curso caduca
- Nombrar ambientes con convenciones claras: `DEV-TuNombre`, `TEST-Proyecto`
- Documentar propósito de cada ambiente desde su creación
- No compartir credenciales de trial; crear usuarios de prueba en el tenant

### ⚠️ Errores Comunes
- **Lo que ves:** lo que creaste no aparece para otra persona, o ves cosas de otros mezcladas con las tuyas.
  - **Causa probable:** estás trabajando en el ambiente *default* (compartido) o en uno distinto al suyo.
  - **Qué hacer:** mira el ambiente activo arriba a la derecha, cambia a tu ambiente del curso y trabaja siempre ahí.

- **Lo que ves:** intentas guardar datos estructurados (clientes, solicitudes) en SharePoint y no puedes relacionarlos ni validarlos como esperabas.
  - **Causa probable:** confundir Dataverse con SharePoint.
  - **Qué hacer:** Dataverse es una base de datos relacional; SharePoint es almacenamiento documental. Usa cada uno para lo que fue pensado.

- **Lo que ves:** algo deja de funcionar o te pide licencia sin que hayas cambiado nada.
  - **Causa probable:** no conocías los límites de la licencia trial (usuarios, llamadas a API, almacenamiento).
  - **Qué hacer:** revisa la documentación de límites del trial antes de planear más práctica sobre él.

### 🧪 Criterios de Validación
- [ ] Ambiente de desarrollo creado y funcional
- [ ] Acceso a Power Apps, Power Automate, Power BI confirmado (Power BI se abre en https://app.powerbi.com)
- [ ] 5+ registros de prueba en tabla Account de Dataverse
- [ ] Comprensión de diferencia entre conectores Standard y Premium
- [ ] Explicar con palabras propias qué es Dataverse y su propósito
- [ ] Identificar los 4 modelos preconstruidos más usados de AI Builder
- [ ] Describir para qué sirve Power Pages y en qué se diferencia de una Canvas App

> Para avanzar al Módulo 2 como principiante, los primeros 5 criterios son suficientes. AI Builder y Power Pages son suplementos opcionales: no los uses como excusa para frenar tu primera práctica.

### 📸 Evidencia para guardar
- Captura de tu ambiente del curso activo, con su tipo y su fecha de vencimiento (**Day(s) remain**).
- Captura de la tabla Account con 5 registros de prueba.
- Nota breve en tus palabras: "Dataverse sirve para..." en 2-3 líneas.

---

### 📌 Suplemento 1A: AI Builder — Inteligencia Artificial sin código

> **📌 Opcional — puedes volver a esta sección después de completar tu primera práctica.** No es necesario para avanzar al Módulo 2.
>
> **Relevancia PL-900:** la guía de estudio vigente (desde el 24 de julio de 2026) pide describir el valor de la IA generativa en Power Platform y las soluciones con IA en Power Apps. AI Builder no tiene un porcentaje propio en el examen. Lo que aprendes aquí: agregar IA a apps y flujos desde la interfaz, sin entrenar modelos desde cero.

#### 🎯 Objetivo
Comprender qué es AI Builder, sus modelos preconstruidos y cómo integrar IA en apps y flujos sin código de machine learning.

#### 📖 Conceptos Clave
- **Modelos preconstruidos (Prebuilt models):** listos para usar sin datos de entrenamiento propios:
  - *Business Card Reader:* extrae nombre, empresa, correo, teléfono de tarjetas de presentación
  - *Document Processing (Form Processing):* extrae campos estructurados de documentos PDF/imágenes (facturas, contratos)
  - *Category classification:* clasifica texto libre en categorías definidas (soporte técnico, ventas, RR.HH.)
  - *Sentiment Analysis:* analiza el sentimiento de texto como positivo, negativo o neutral
  - *Language Detection:* identifica el idioma de un texto
- **Modelos personalizados (Custom models):** se entrenan con datos propios del negocio; requieren conjunto de datos etiquetados. Incluyen *Object Detection* (detecta objetos en imágenes, ej. inventario, inspección de calidad), que requiere entrenamiento propio y no viene listo para usar sin datos.
- **Créditos para AI Builder:** cada uso de un modelo de IA consume créditos. Microsoft está retirando los *AI Builder credits*: desde el 1 de noviembre de 2026 las licencias premium nuevas ya no los traen (los que ya tienes se respetan hasta que termine tu contrato). Las funciones de AI Builder siguen funcionando: cuando no hay AI Builder credits, consumen **Copilot Credits**. Si no hay ninguno de los dos, la función se bloquea.
- **Componente AI en Canvas Apps:** controles que agregan IA a una app sin código, por ejemplo el **Business card reader** (lector de tarjetas de presentación). Al insertarlo recibe un nombre como `BusinessCardReader1`, y lees lo que extrajo con fórmulas como `BusinessCardReader1.FullName`.
- **Acción AI en Power Automate:** paso "AI Builder" que llama un modelo dentro de un flujo automatizado

#### 👨‍💻 Actividad Práctica: Procesar una tarjeta de presentación con AI Builder

**Paso 1 — Explorar el catálogo de modelos:**
1. Ir a [make.powerapps.com](https://make.powerapps.com) → menú lateral → **AI hub**
2. Explorar la galería de modelos preconstruidos; seleccionar **Business Card Reader**
3. Clic en **Try it out** y cargar una imagen de tarjeta de presentación
4. Observar los campos extraídos (nombre, empresa, email, teléfono)

**Paso 2 — Usar AI Builder en Power Automate:**
1. Crear un nuevo Flow: **Instant cloud flow** → disparador manual
2. Agregar paso: buscar **AI Builder** → seleccionar **Extract information from business cards**
3. Conectar con una imagen de ejemplo (archivo adjunto o URL)
4. Agregar paso: **Create a row** en Dataverse para guardar el resultado en una tabla de contactos

**Paso 3 — Explorar el modelo de Document Processing:**
1. En AI hub → **Document processing** → **Explore prebuilt model**
2. Cargar una factura o recibo de ejemplo en PDF
3. Revisar los campos extraídos: número de factura, fecha, total, proveedor

#### 💼 Caso Real de Negocio
Una empresa de logística recibe cientos de albaranes en papel diariamente. Con AI Builder + Power Automate: el proceso manual de transcripción se reemplaza por un flujo que digitaliza el documento al adjuntarlo en Teams, extrae número de guía, proveedor, cantidad y estado, y crea automáticamente el registro en Dataverse — reduciendo el tiempo de registro de 5 minutos a 15 segundos por documento.

#### ✅ Buenas Prácticas
- Prueba primero un modelo preconstruido (prebuilt). Entrena un modelo personalizado (custom) solo si el preconstruido no te sirve.
- Para Document Processing custom: sube al menos 5 documentos de muestra por colección (una colección = documentos con el mismo diseño). Si son escaneos de mala calidad, usa más.
- Revisa el consumo de créditos en el Power Platform admin center.

#### ⚠️ Errores Comunes
- **Error**: Usar AI Builder sin revisar qué créditos tiene el ambiente → cuando no quedan AI Builder credits ni Copilot Credits, la función deja de funcionar.
  - **Solución**: Revisa los créditos disponibles en el Admin Center antes de llevar algo a producción.
- **Error**: Esperar que Document Processing funcione en documentos no estructurados (cartas libres)
  - **Solución**: Document Processing es para formularios estructurados repetibles; para texto libre usar Category classification o Azure AI Services

#### 🧪 Criterios de Validación
- [ ] Explorar el catálogo AI hub y probar Business Card Reader con una imagen real
- [ ] Crear un flujo que use al menos un modelo AI Builder prebuilt
- [ ] Explicar qué son los AI Builder Credits y cómo se consumen

---

### 📌 Suplemento 1B: Power Pages — Sitios web externos con Dataverse

> **📌 Opcional — puedes volver a esta sección después de completar tu primera práctica.** No es necesario para avanzar al Módulo 2.
>
> **Relevancia PL-900:** la guía de estudio vigente (desde el 24 de julio de 2026) solo pide describir el valor de Power Pages para crear sitios web, dentro del dominio "valor de negocio" (5–10% del examen, compartido con las demás piezas). Lo que aprendes aquí: la diferencia entre Power Pages y otras herramientas, y los casos de uso de sitios para usuarios externos.

#### 🎯 Objetivo
Comprender qué es Power Pages, sus capacidades principales y cuándo usarlo en lugar de Canvas Apps o Model-Driven Apps.

#### 📖 Conceptos Clave
- **Power Pages** (antes *Power Apps portals*): plataforma para crear sitios web públicos o con autenticación externa que interactúan con datos de Dataverse
- **Usuarios externos:** personas fuera de la organización (clientes, socios, ciudadanos) que acceden al sitio sin licencia de Microsoft 365
- **Web roles (roles web) y table permissions:** un rol web es un conjunto de permisos del sitio. Los *table permissions* deciden qué tablas de Dataverse puede leer o escribir cada rol web. Hay un rol para los usuarios que iniciaron sesión (**Authenticated Users**) y otro para los visitantes sin sesión (**Anonymous Users**). Cada usuario externo que se registra queda guardado como un registro de **Contact**. Ojo: **Basic User** no es un rol web; es un rol de seguridad de Dataverse.
- **Páginas, formularios y listas:** las piezas del sitio son las páginas, los **basic forms** (formularios básicos: crean o editan un registro), los **multistep forms** (formularios de varios pasos) y las **lists** (listas: muestran registros a partir de una vista de Dataverse).
- **Design studio:** el editor visual de bajo código donde diseñas el sitio, parecido al editor de Canvas Apps pero para una web externa.
- **Proveedores de identidad (cómo inician sesión los usuarios):** Microsoft Entra ID (el nuevo nombre de Azure AD), Microsoft Entra External ID, Azure AD B2C, cuenta Microsoft, LinkedIn, Facebook, Google, Twitter y la cuenta local (no recomendada). Azure AD B2C dejó de venderse a clientes nuevos el 1 de mayo de 2025: si empiezas hoy, Microsoft recomienda Microsoft Entra External ID.
- **Liquid templates:** lenguaje de plantillas basado en Liquid (Open Source) para lógica condicional dentro de páginas del portal
- **Capacidades:** un ambiente puede tener varios sitios (hasta 50 con las plantillas más comunes), cada uno con su propia URL o un dominio personalizado.

#### 💼 Caso Real de Negocio
Un municipio necesita que los ciudadanos puedan registrar solicitudes de permisos de construcción en línea, consultar el estado de su trámite y adjuntar documentos, sin tener que ir en persona. Con Power Pages se crea un portal público donde:
- El ciudadano se registra con su correo (Microsoft Entra External ID)
- Completa un formulario de varios pasos (multistep form) que crea un registro de "Solicitud" en Dataverse
- Visualiza el historial de sus solicitudes en una lista (list) que, con un table permission de tipo **Contact access**, solo le muestra las suyas
- El equipo municipal gestiona las solicitudes desde una Model-Driven App interna

> Fuentes: [Learn: Microsoft Entra External ID con Power Pages](https://learn.microsoft.com/power-pages/security/authentication/entra-external-id), [Learn: multistep forms](https://learn.microsoft.com/power-pages/configure/multistep-form-properties), [Learn: mostrar datos de forma segura (Contact access)](https://learn.microsoft.com/power-pages/getting-started/tutorial-display-data-securely).

#### ✅ Buenas Prácticas
- Configurar Table Permissions **antes** de abrir el portal a usuarios externos — por defecto todo está bloqueado
- Usar HTTPS y dominio personalizado en producción (`portal.municipio.gob`)
- Mantener Liquid templates simples; la lógica compleja debe ir en flujos de Power Automate

#### ⚠️ Errores Comunes
- **Error**: Creer que Power Pages reemplaza a Canvas Apps para usuarios internos
  - **Solución**: Power Pages es para usuarios **externos**; Canvas Apps y Model-Driven Apps son para usuarios **internos** con licencia
- **Error**: No configurar Table Permissions después de crear el portal
  - **Solución**: Sin Table Permissions, todos los datos son inaccesibles desde el portal (error 403)

#### 🧪 Criterios de Validación
- [ ] Explicar la diferencia entre Power Pages, Canvas Apps y Model-Driven Apps
- [ ] Describir un escenario donde Power Pages es la herramienta correcta vs Canvas App
- [ ] Identificar qué son Table Permissions y por qué son necesarias

---

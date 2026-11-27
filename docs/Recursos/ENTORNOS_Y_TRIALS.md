# Entornos y trials: dónde vas a practicar

Esta página es la **referencia única** del curso sobre el ambiente en el que practicas: qué ambiente usar desde el
15 de noviembre de 2026, cuánto dura, qué límites tiene, cómo no perder tu trabajo cuando caduca y qué ambiente
necesita cada ruta. Complementa a [Ruta cero absoluta](/recursos/ruta-cero-absoluta) (conceptos de tenant y ambiente)
y a [Tipos de práctica](/recursos/tipos-de-practica) (categorías 🟢🔵🟡🟠🔴). Para el detalle operativo de los gates de
Dynamics 365 (checklist, evidencia mínima por producto), ver [D365 Tenant Readiness Checklist](/recursos/d365-tenant-readiness).

**No inventamos duraciones ni capacidades.** Todo lo que sigue está tomado de Microsoft Learn (consultado el 11 de
noviembre de 2026; las URL están en cada apartado). Lo que Learn no aclara está marcado como **no verificado**.

## Qué cambió: el Power Apps Developer Plan ya no te da un ambiente

Fuentes: [Power Apps Developer Plan](https://learn.microsoft.com/power-platform/developer/plan) y
[Important changes coming](https://learn.microsoft.com/power-platform/important-changes-coming).

- Los ambientes Developer **no gestionados** están en desuso. Desde el **15 de noviembre de 2026**, registrarse en el
  Developer Plan **ya no crea un ambiente Developer** y no se pueden crear ambientes Developer no gestionados nuevos.
- Los ambientes Developer no gestionados que ya existen se **suspenden desde el 15 de diciembre de 2026** y se
  **eliminan desde el 15 de enero de 2027**, haya o no actividad. Si en uno de ellos vive un sitio de Power Pages, el
  sitio se elimina con el ambiente.
- El tipo **Developer** sigue existiendo, pero solo como ambiente **gestionado** (Managed Environment): uno por usuario,
  hay que pedirlo al administrador (por ejemplo, mediante *environment routing*) y los usuarios necesitan **licencia
  premium** para ejecutar apps y flujos en él, porque los derechos de Managed Environments no vienen incluidos en el
  Developer Plan ([Managed Environments licensing](https://learn.microsoft.com/power-platform/admin/managed-environment-licensing):
  los cubren, entre otras, Power Apps Premium, Power Automate Premium y Dynamics 365 Enterprise; una licencia trial los
  cubre 30 días).
- "Standard trial environments remain available": los ambientes **Trial (standard)** siguen disponibles.
- El Developer Plan exige una cuenta profesional o educativa; no admite cuentas personales.

## Qué ambiente usar en este curso

| Tu situación | Ambiente del curso | Duración | Qué tienes que hacer |
|---|---|---|---|
| **Caso general (camino principal desde el 15 nov 2026)** | **Trial (standard) con Dataverse**, idioma English (United States), creado por ti con una licencia **Power Apps trial** | 30 días + **una** extensión de 30 días | Exportar tu solución al terminar cada módulo o sesión y, cuando caduque, crear otro ambiente e importarla (ver "El hábito que lo hace viable") |
| **Tu organización te da un ambiente Developer gestionado o un Sandbox**, con licencia premium | Ese ambiente: es **la mejor opción** y sirve para todo el curso | La que fije tu organización | Pedirlo al administrador (mensaje de ejemplo en el [Módulo 1](/nivel/basico/modulo/introduccion-al-ecosistema-power-platform)); conservar igualmente el hábito de exportar |
| **Ya tienes un ambiente Developer creado antes del 15 nov 2026** (no gestionado) | Puedes seguir usándolo **hasta el 15 dic 2026** | Se suspende el 15 dic 2026 y se elimina desde el 15 ene 2027 | **Exportar tus soluciones antes del 15 dic 2026** e importarlas en tu ambiente nuevo. Alternativa que da Learn: con licencia premium y un administrador, activar Managed Environments en ese ambiente antes de esa fecha |
| **No tienes correo profesional ni educativo** | El mismo Trial (standard), pero primero necesitas una cuenta que Microsoft acepte | — | Learn indica que quien no tenga ese correo puede crear una **cuenta gratuita de Microsoft Entra** ([Sign up for Power Apps](https://learn.microsoft.com/power-apps/maker/signup-for-powerapps)). Inténtalo por esa vía; **no está verificado** qué recibe exactamente esa cuenta ni que permita todo el recorrido |

> **Si un lab te pide un segundo ambiente** (por ejemplo, Dev → Test para mover una solución): cada usuario puede
> crear un solo Trial (standard). Usa un Sandbox o un Developer gestionado si tu organización te lo da, o haz la
> variante en papel del lab. No intentes crear un segundo Trial con la misma cuenta.

## El ambiente Trial (standard): lo que tienes que saber desde el primer día

Fuentes: [Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments),
[Create and manage environments](https://learn.microsoft.com/power-platform/admin/create-environment) y
[Sign up for Power Apps](https://learn.microsoft.com/power-apps/maker/signup-for-powerapps).

- **Quién lo puede crear:** cualquier usuario de la organización con una licencia adecuada, salvo que el administrador
  del tenant haya restringido la creación de trials a los administradores.
- **Qué licencia sirve para crearlo:**

  | Licencia del usuario | ¿Puede crear un ambiente Trial (standard)? |
  |---|---|
  | Power Apps trial | Sí, uno |
  | Power Automate trial | Sí, uno |
  | Power Apps plan | Sí, uno |
  | Power Automate plan | Sí, uno |
  | Dynamics 365 trial | Sí, uno |
  | Microsoft 365 Plans | **No** |
  | Power Apps Developer Plan | **No** |

  El límite es **un ambiente Trial por usuario**.
- **La licencia Power Apps trial:** dura 30 días y se puede extender dos veces (máximo 90 días). Requiere correo
  profesional o educativo (no outlook.com, hotmail.com ni gmail.com). Incluye "Create and manage environments and
  Dataverse databases". El administrador de tu organización puede bloquear las licencias de prueba.
- **Cuánto dura el ambiente:** **30 días**; después se deshabilita y se elimina. Admite **una sola extensión de
  autoservicio de 30 días**, que solo se puede pedir **en los últimos siete días** antes del vencimiento. Para
  conservarlo más tiempo hay que convertirlo a producción, lo que consume capacidad de pago.
- **Inactividad:** un Trial sin actividad en su base de datos durante 30 días se elimina.
- **Lo que un Trial NO puede hacer:** solo se puede **crear y eliminar**. **No se puede restablecer (reset), respaldar
  (backup), restaurar ni copiar.** Cuando un módulo o lab hable de esas operaciones, en un Trial se hacen en papel o en un
  Sandbox de tu organización; tu copia de seguridad es la solución exportada.
- **Dataverse:** al crearlo se elige la opción de añadir Dataverse. Learn muestra dos textos para esa opción según la
  pantalla: **Create a database for this environment?** y **Add a Dataverse data store**. Elige **Yes**: sin Dataverse
  no hay tablas.
- **Dynamics 365:** en tu ambiente del curso deja **Enable Dynamics 365 apps** en **No**. Los trials de Sales, Customer
  Service y demás productos de Dynamics 365 crean su propio ambiente (ver las filas de Dynamics 365 abajo).

### ¿Puedo crear otro Trial cuando venza el mío? (revisado el 11 nov 2026)

Lo que dice Learn y lo que **no** dice:

- **El límite es de un Trial por usuario, no de uno para siempre.** La tabla de
  [Create and manage environments](https://learn.microsoft.com/power-platform/admin/create-environment) da "Yes (one)"
  como derecho de la licencia, y la FAQ responde "The new trial limits are one per user". Learn no dice que sea un único
  Trial en la vida de la cuenta, pero **tampoco dice expresamente** que puedas crear otro con la misma cuenta. Lo más
  cercano es la FAQ de los trials de Dynamics 365 ([Field Service trial FAQ](https://learn.microsoft.com/dynamics365/field-service/trial-faq),
  ms.date 2026-10-29): "You can have only one active trial per app at a time. You can sign up again after your current
  trial for the app ends". Es otro tipo de trial (de producto), así que tómalo como indicio, no como regla.
- **Un ambiente borrado sigue "existiendo" siete días.** Tras eliminarse pasa a **Recently deleted environments** y se
  puede recuperar durante el periodo estándar de siete días
  ([Recover a recently deleted environment](https://learn.microsoft.com/power-platform/admin/recover-environment)). Learn no
  aclara si en ese periodo cuenta para tu límite de uno; si el portal no te deja crear el Trial nuevo, espera a que pasen
  esos siete días.
- **Para crear un Trial necesitas una licencia vigente** que lo permita (tabla de arriba). La licencia Power Apps trial
  dura como máximo 90 días (30 + dos extensiones). Learn **no dice** que se pueda volver a obtener después ni qué ocurre
  si lo intentas: no cuentes con ello.

**Plan práctico:** con una sola licencia Power Apps trial tienes como máximo unos 90 días. Ambiente 1: 30 días + extensión
(60 días). Antes de que venza, exporta tu solución; cuando se elimine (o lo elimines tú desde **Environments** >
**Delete**), crea el Trial 2 mientras tu licencia siga vigente e importa la solución. Si el portal no te deja, es que
el límite te aplica: pasa a una de las alternativas de abajo. Si tu organización bloquea las licencias de prueba, este
camino no existe y necesitas la ayuda del administrador.

**Sigue sin verificar** (no lo des por hecho): que se pueda crear un segundo Trial con la misma cuenta; si un ambiente en
**Recently deleted environments** cuenta para el límite; si tras los 90 días de licencia se puede obtener otra; qué recibe
exactamente una cuenta gratuita de Microsoft Entra creada para esto. Nota: la página
[Sign up for Power Apps](https://learn.microsoft.com/power-apps/maker/signup-for-powerapps) (ms.date 2026-01-13) aún dice
"To keep building apps after the trial period, opt in to the free Power Apps Developer Plan"; es anterior al cambio del
15 nov 2026 y ya no aplica (la página del [Developer Plan](https://learn.microsoft.com/power-platform/developer/plan), del
2026-10-26, prevalece).

### Alternativas si no puedes crear otro Trial

| Alternativa | Qué exige (según Learn, nov 2026) | ¿Sirve para el curso? |
|---|---|---|
| **Developer gestionado o Sandbox de tu organización** | Un administrador y licencia premium para ejecutar apps y flujos ([Developer Plan](https://learn.microsoft.com/power-platform/developer/plan)) | Sí, es la mejor opción |
| **Pay-as-you-go con una suscripción de Azure** | Vincular el ambiente a una suscripción de Azure con una *billing policy*; el uso de apps y de Dataverse por encima de lo incluido se cobra con medidores de Azure ([Pay-as-you-go overview](https://learn.microsoft.com/power-platform/admin/pay-as-you-go-overview)) | Sí, pero **tiene coste** y necesitas ser administrador del tenant y tener una suscripción de Azure; no está verificado el coste para un único alumno |
| **Microsoft 365 Developer Program (sandbox E5)** | Solo califican suscriptores de Visual Studio Professional/Enterprise, partners elegibles (ISV Success, MAICPP) y clientes Premier/Unified; dura hasta 90 días; exige vincular una cuenta de facturación MCA con suscripción de Azure activa ([FAQ del programa](https://learn.microsoft.com/office/developer-program/microsoft-365-developer-program-faq), ms.date 2026-09-04) | Solo si ya calificas. El E5 trae "PowerApps for Office 365 Plan 3" (sin conectores premium ni Dataverse completo fuera de Teams); dentro de ese tenant tendrías que activar igualmente una licencia Power Apps trial, cosa que no está verificada |
| **Dataverse for Teams** | Una licencia de Microsoft 365 con Teams | Solo para partes de los Módulos 1-8; no tiene la Dataverse completa, ni soluciones gestionadas normales, ni la mayoría de lo que usan los niveles 2 a 4. No es sustituto |
| **Variante en papel** de cada lab | Nada | Cubre el razonamiento, no la evidencia de tenant |

### Crear el ambiente Trial con Dataverse (clic a clic)

El recorrido corto está en el
[Módulo 1](/nivel/basico/modulo/introduccion-al-ecosistema-power-platform), Microlección 1; las otras vías y los
problemas frecuentes, más abajo. Resumen según
[Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments):

1. Activa tu licencia Power Apps trial ([apps.powerapps.com/trial](https://apps.powerapps.com/trial)).
2. Entra en el [Power Platform admin center](https://admin.powerplatform.microsoft.com).
3. En el panel de navegación selecciona **Manage** y, en el panel **Manage**, **Environments**.
4. En la página **Environments** selecciona **New** en la barra de comandos.
5. **Name:** `DEV-TuNombre`; **Type:** **Trial**; **Region:** la más cercana; **Purpose:** una descripción; la opción
   de añadir Dataverse (**Create a database for this environment?** o **Add a Dataverse data store**): **Yes**. Selecciona **Next**.
6. **Language:** **English (United States)**; **Currency:** la de tu país; **Enable Dynamics 365 apps:** **No**;
   **Security group:** el que te pida la pantalla (en tu tenant propio, **None** si está disponible). Selecciona **Save**.
7. Anota la fecha de vencimiento: en **Environments**, selecciona tu ambiente y, en el panel **Details**, **See all**
   para ver **Day(s) remain**.

### Si no tienes una cuenta de trabajo o estudio

Microsoft no permite registrarse con una cuenta personal como Gmail, Outlook.com o Hotmail. Elige el caso que se parezca al tuyo:

- **Tienes correo de empresa o universidad:** úsalo. Mira "¿Tienes permisos de administración?" para saber si tienes permisos de administración.
- **No tienes correo profesional ni educativo:** Learn indica que puedes crear una **cuenta gratuita de Microsoft Entra** para registrarte ([Sign up for Power Apps](https://learn.microsoft.com/power-apps/maker/signup-for-powerapps)). Inténtalo por esa vía; no está verificado qué recibe exactamente esa cuenta. Otra vía, que ya usaba este curso, es crear tu propio tenant de prueba:
  1. Abre https://www.microsoft.com/microsoft-365/try.
  2. Elige un plan de empresa con prueba gratuita de un mes.
  3. Sigue el asistente. Al terminar tendrás una cuenta del tipo `tunombre@tuorganizacion.onmicrosoft.com` y tendrás permisos de **administración** de ese tenant.
  4. Anota el usuario, la contraseña (en un lugar seguro, no en la evidencia) y la **fecha en que termina la prueba**.
  5. **Cuidado con el cobro:** el registro puede pedirte una tarjeta. Al terminar el mes, la mayoría de las pruebas pasan solas a una suscripción de pago. Si no quieres pagar, antes de que termine entra al Microsoft 365 admin center (https://admin.microsoft.com), ve a **Billing** > **Your products** y desactiva **recurring billing** (la renovación automática).
- **Tienes una suscripción de Visual Studio Professional o Enterprise:** puedes pedir el sandbox del [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program). Hoy solo califican esos suscriptores, algunos partners y clientes de soporte Premier o Unified. La mayoría de los principiantes no califica, así que no lo uses como primera opción.

### ¿Tienes permisos de administración?

Los tienes si tu cuenta tiene uno de estos roles: **Global Administrator**, **Power Platform Administrator** o **Dynamics 365 Administrator**.

- Si creaste tu propio tenant de prueba en el Paso 1, sí los tienes.
- Si usas el correo de tu empresa o universidad, casi seguro **no** los tienes. Si no lo sabes, pregúntale a tu equipo de TI: "¿Tengo alguno de estos roles?". No hace falta ser administrador para crear un ambiente Trial: cualquier usuario con una licencia adecuada puede, salvo que tu organización lo haya restringido a los administradores ([Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)). Si te lo bloquean, sigue la **Opción B**.

### Si tu organización te da el ambiente

Si tu empresa o universidad te puede dar un **ambiente Developer gestionado** o un **Sandbox** con licencia premium, es lo mejor: no caduca a los 30 días y sirve para todo el curso. Tú no lo creas: lo crea un administrador. Envía a tu equipo de TI un mensaje como este:

> "Hola. Estoy haciendo un curso de Power Platform y necesito un ambiente para practicar. ¿Me pueden dar un **ambiente Developer gestionado** (managed developer environment) **con Dataverse**, solo para mí? Se puede crear desde el Power Platform admin center o con *environment routing*. Si no es posible, ¿me pueden dar un ambiente **Sandbox** con Dataverse, o permitirme crear un ambiente **Trial**? En ese ambiente necesito el rol **System Customizer** o **System Administrator**. Para ejecutar apps y flujos en un Developer gestionado necesito además una licencia premium de Power Apps (o una de prueba), porque el Developer Plan no incluye los derechos de Managed Environments."

Mientras esperas, sigue leyendo y haz las microprácticas: no necesitan ambiente.

*Si ya tienes un ambiente Developer creado antes del 15 de noviembre de 2026:* puedes seguir usándolo como ambiente del curso **hasta el 15 de diciembre de 2026**, fecha desde la que se suspende (se elimina desde el 15 de enero de 2027). **Exporta tus soluciones antes del 15 de diciembre** e impórtalas en tu ambiente Trial o en el que te dé tu organización. Si tienes licencia premium y un administrador, Learn da otra salida: activar Managed Environments en ese ambiente antes de esa fecha ([Developer Plan](https://learn.microsoft.com/power-platform/developer/plan)).

### Si algo sale distinto al crear el ambiente

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| Al crear el ambiente, el Admin Center no te deja elegir **Trial** o te pide una licencia | Tu usuario no tiene una licencia que permita crear un Trial (las de Microsoft 365 y la del Developer Plan no sirven) | Activa la licencia Power Apps trial (licencia Power Apps trial) y vuelve a intentarlo |
| Te dice que ya tienes un ambiente Trial | El límite es un ambiente Trial por usuario | Usa ese ambiente como ambiente del curso, o elimínalo si ya no lo necesitas (exporta antes lo que quieras conservar) |
| No puedes entrar al Admin Center, no ves **New** o te sale un error de permisos | Tu organización restringió la creación de ambientes (o de trials) a los administradores | Envía a TI el mensaje de la **Opción B**. Mientras tanto, haz las microprácticas |
| No puedes activar la licencia Power Apps trial | Tu organización bloqueó las licencias de prueba | Envía a TI el mensaje de la **Opción B**, o usa una cuenta propia (cuenta propia) |
| El portal del Microsoft 365 Developer Program te dice que no calificas | No tienes una suscripción que califique | Usa una de las otras vías de arriba |
| En **Type** solo ves **Developer** o te ofrecen registrarte en el Developer Plan | Desde el 15 de noviembre de 2026 el Developer Plan ya no crea un ambiente, y el Developer solo existe como ambiente gestionado que asigna un administrador | Elige **Trial**; si quieres un Developer gestionado, pídelo con la **Opción B** |
| Faltan siete días o menos para que venza tu Trial | Es la única ventana para la extensión | En **Manage** > **Environments**, selecciona tu ambiente y **Extend trial** (una sola vez, suma 30 días). Exporta tu solución ese mismo día |
| Tu ambiente desaparece o queda deshabilitado | Venció el Trial (30 días, o 60 con la extensión), o pasó 30 días sin actividad en su base de datos | Crea un ambiente nuevo con los mismos ajustes e importa tu última solución exportada; vuelve a crear conexiones y datos de prueba |

> **Si los botones aparecen en español:** la página usa el idioma de tu navegador. Este curso usa los nombres en inglés. Para cambiarlos, abre el engranaje (**Settings**, arriba a la derecha) > **Power Apps settings** y cambia el idioma, o cambia el idioma de tu navegador. Si prefieres dejarlo en español, busca el botón equivalente en la misma zona de la pantalla.

### Pedir la extensión en la última semana

Pon un recordatorio en tu calendario para **siete días antes** del vencimiento. Ese día:

1. En el Power Platform admin center: **Manage** > **Environments**.
2. Selecciona tu ambiente Trial: la opción **Extend trial** aparece cuando faltan siete días o menos.
3. Lee la notificación y selecciona **Extend trial**. Suma 30 días a la fecha de vencimiento original. Solo se puede
   hacer **una vez**.

## El hábito que lo hace viable: exporta tu solución al terminar cada módulo o sesión

Con un ambiente que caduca, estudiar practicando solo funciona si tu trabajo vive **fuera** del ambiente. El curso ya te
enseña a construirlo todo dentro de **tu solución** (la creas en el [Módulo 2](/nivel/basico/modulo/dataverse-fundamentos-y-modelado-basico));
ahora, además, la exportas al terminar cada módulo o sesión y guardas el `.zip` en tu computadora o en tu nube personal.

**Exportar (al terminar cada módulo o sesión, 3-5 min):**

1. En [make.powerapps.com](https://make.powerapps.com), con tu ambiente del curso elegido arriba a la derecha, abre
   **Solutions** (si no lo ves, está en **More**).
2. Selecciona tu solución y, en la barra de comandos, **Export**. (La *Default Solution* no se puede exportar.)
3. En el panel **Before you export**, selecciona **Publish all changes** y luego **Next**.
4. En **Export as** elige **Unmanaged** (así podrás seguir editándola en el ambiente nuevo) y selecciona **Export**.
5. Cuando se descargue el `.zip`, renómbralo con la fecha y el módulo (por ejemplo `SolicitudesTI_2026-11-20_M04.zip`)
   y guárdalo fuera de la carpeta de descargas. Conserva al menos las dos últimas versiones.

**Cuando el Trial venza (o cambies de ambiente):**

1. Crea un ambiente nuevo con los mismos ajustes (Trial con Dataverse, English (United States)) o usa el que te dé tu
   organización.
2. En make.powerapps.com, con el ambiente nuevo elegido, abre **Solutions** y selecciona **Import solution** en la barra
   de comandos.
3. Selecciona **Browse**, elige tu último `.zip` y selecciona **Next**.
4. Si te pide conexiones o variables de entorno, créalas o complétalas en ese paso, y selecciona **Import**.
5. Espera a que termine y abre la solución: tus tablas, apps y flujos vuelven a estar ahí.

**Lo que NO viaja en la solución (sé realista con el coste):**

- **Los datos** (las filas de tus tablas). Vuelve a crear tus datos de prueba o, como indica
  [Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments), expórtalos a Excel antes
  del vencimiento e impórtalos en el ambiente nuevo.
- **Las conexiones** (tu inicio de sesión en Outlook, SharePoint, etc.): hay que volver a crearlas en el ambiente nuevo
  y asociarlas a los flujos.
- **El historial de ejecuciones** de tus flujos y la evidencia que estaba dentro del ambiente: guarda tus capturas y
  notas de evidencia fuera del ambiente a medida que avanzas.
- Lo que hayas creado **fuera** de tu solución (por ejemplo, en la *Default Solution*): por eso todo va dentro de la tuya.

## Otros ambientes que aparecen en el curso

- **Sandbox:** lo crea un administrador de tu organización. Admite copia, restablecimiento y respaldo; si tu
  organización te da uno, úsalo para los labs que piden esas operaciones.
- **Developer gestionado:** ver arriba. Si tu organización te lo da, sirve para todo el curso.
- **Trials de Dynamics 365:** crean su propio ambiente con las apps instaladas; se piden desde los módulos de Dynamics 365
  (57 en adelante). Ver la tabla de abajo.
- **Microsoft 365 Developer Program:** su sandbox hoy solo califica para suscriptores de Visual Studio Professional o
  Enterprise, algunos partners y clientes de soporte Premier o Unified; dura hasta 90 días y exige una cuenta de
  facturación MCA con suscripción de Azure (reverificado el 11 nov 2026, ver "Alternativas" arriba); no es la primera opción.

## Ambiente por ruta

| Ruta | Tipo de entorno | Producto/licencia | Rol requerido | Duración o expiración | Alternativa sin acceso | Evidencia |
|---|---|---|---|---|---|---|
| Fundamentos Power Platform / Maker | 🟡 Ambiente del curso | Trial (standard) con Dataverse y licencia Power Apps trial, o el Developer gestionado / Sandbox que te dé tu organización — ver "Qué ambiente usar en este curso" arriba | Ninguno — pero con cuenta de trabajo o estudio, no personal | Trial: 30 días + una extensión de 30. Developer no gestionado existente: suspendido desde el 15 dic 2026 | No hay alternativa sin ambiente — es el paso 1 de [Ruta cero absoluta](/recursos/ruta-cero-absoluta) | Capturas de tablas/apps/flujos construidos, solución exportada |
| Consultor Funcional | 🟡 Ambiente del curso + 🟢 conceptual (fit-gap, backlog) | Igual que arriba | Ninguno | Igual que arriba | El backlog funcional (Azure DevOps o equivalente documentado) es 🟢, no requiere ambiente | Documento de requerimientos, matriz fit-gap, backlog, capturas de configuración |
| Developer | 🟡 Ambiente del curso | Igual que arriba | Ninguno | Igual que arriba | Módulos 23/27/28 tienen puente conceptual — ver [Fundamentos C#/.NET](/recursos/fundamentos-csharp-dotnet) y [Fundamentos TypeScript/React](/recursos/fundamentos-typescript-react) | Solución exportada, código en repositorio propio, capturas de plugin/PCF registrado |
| Dynamics 365 Sales | 🟠 Trial Dynamics 365 Sales | Trial de Dynamics 365 Sales (producto específico — un ambiente Dataverse-only NO lo trae instalado) | Ninguno para el trial; roles de vendedor/manager se configuran dentro | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: diseño documentado de proceso lead-to-opportunity, matriz de forecast sin validación visual del rollup jerárquico | Capturas de leads/oportunidades/forecast reales, matriz de pipeline hygiene |
| Dynamics 365 Customer Service | 🟠 Trial Dynamics 365 Customer Service | Trial de Dynamics 365 Customer Service (producto específico, trial separado del de Sales) | Ninguno para el trial; agentes/supervisores se configuran dentro | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: matriz de SLA y árbol de decisión de agente documentados, sin validar calendario/pausas/routing ejecutándose | Capturas de casos/colas/SLA reales, matriz de SLA completada |
| Customer Insights - Data | 🟠 Trial Customer Insights | Trial de Dynamics 365 Customer Insights (habilita Data; Journeys puede requerir activación separada) | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: diseño de fuentes/unificación/segmentos documentado, sin datos reales unificados | Capturas de perfiles unificados, medidas y segmentos reales |
| Customer Insights - Journeys | 🟠 Trial Customer Insights (Journeys) | Trial de Dynamics 365 Customer Insights - Journeys | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: journey diseñado en diagrama, sin envío/consentimiento real ejecutado | Capturas de journey publicado, métricas de envío/apertura reales |
| Field Service | 🟠 Trial Dynamics 365 Field Service | Trial de Dynamics 365 Field Service; RSO/mobile offline requieren licenciamiento/configuración adicional | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: matriz de diseño y simulación del ciclo de work order documentada | Capturas de work orders, agreements y scheduling reales |
| Contact Center (especialización opcional) | 🟠 Trial (chat) / 🔴 Voz-SMS requiere proveedor de telefonía real | Trial de Dynamics 365 Contact Center — canal de chat practicable en trial; voz/SMS requieren proveedor de telefonía contratado, fuera del alcance de autoestudio | Ninguno para el trial de chat | Según oferta vigente de Microsoft — verificar en el momento de activar | Canal de chat hands-on en trial (Lab 83); voz/SMS quedan como diseño documentado | Captura de conversación de prueba en canal de chat |
| Finance & Operations (archivado/futura especialización) | 🟢 Conceptual + 🟠 Hands-on en trial donde existe (LAB-093 a LAB-100) | Trial de Dynamics 365 Finance/SCM — no viene con el ambiente del curso | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Vocabulario y mapas de proceso sin ejecución; los labs 93-100 no están verificados contra tenant en vivo | No cuenta como ruta laboral disponible — contenido preservado para consulta, no como evidencia de competencia lista |
| RPA / Power Automate Desktop | 🟡 Ambiente del curso + 🟠 según capacidad (unattended, machine groups, hosted machines) | El ambiente del curso cubre desktop flows básicos; unattended/hosted requieren licencia adicional a validar | Ninguno para lo básico | Según oferta vigente de Microsoft — verificar en el momento de activar | Variante simulada claramente marcada cuando no hay licencia de capacidades avanzadas | Grabación de flujo desktop, logs de ejecución, capturas de sandbox reproducible |
| Arquitectura / Solution Architect | 🟡 Ambiente del curso + 🔴 experiencia previa real | Ambiente del curso con Dataverse; el rol exige experiencia de implementación previa, no solo módulos completados | Experiencia previa verificable como Maker/Consultor/Developer | — | No existe alternativa a la experiencia previa — este plan prepara criterio, no la sustituye | Documento de decisiones arquitectónicas, matriz de trade-offs, casos de estudio propios |

## Cómo leer "Duración o expiración: según oferta vigente de Microsoft"

Esta etiqueta solo aparece en las filas de los trials de **Dynamics 365**. La duración del ambiente del curso
(Trial standard: 30 días + una extensión de 30) sí está documentada arriba. Las de los trials de producto las
define Microsoft y cambian con el tiempo: en vez de citar un número que puede quedar desactualizado, activa el
trial desde el propio [Centro de administración de Power Platform](https://admin.powerplatform.microsoft.com)
o el enlace oficial del producto, y anota tú mismo la fecha de expiración real que te muestre — esa es la
única fuente confiable en el momento en que la necesitas.

## Regla general de integración entre productos

Un trial de Sales, uno de Customer Service y uno de Customer Insights activados por separado **no
quedan integrados automáticamente** — son ambientes distintos salvo que los actives sobre el mismo
tenant/ambiente compatible a propósito. El proyecto integrador completo (prospecto → oportunidad →
cliente → caso de servicio → perfil unificado → segmento → journey) requiere que actives los productos
necesarios **sobre el mismo ambiente**. Si eso no es posible en tu caso, cada ruta tiene su propio
proyecto por producto — no se pierde evidencia, pero no se puede presentar como "integración técnica
real" sin verificarlo.

## Errores comunes

- **Error:** asumir que el ambiente del curso que creaste en el Módulo 1 ya tiene Dynamics 365 Sales/Customer
  Service instalado. **Por qué pasa:** "ambiente con Dataverse" suena a "todo incluido". **Cómo
  evitarlo:** un ambiente Dataverse-only no trae aplicaciones Dynamics 365 — necesitas activar el
  trial del producto específico, un paso aparte.
- **Error:** trabajar semanas en el Trial sin exportar la solución y perderlo todo al vencer. **Cómo evitarlo:**
  exporta tu solución al terminar cada módulo o sesión y pide la extensión en la última semana (ver arriba).
- **Error:** buscar **Reset**, **Copy** o **Backup** en tu ambiente Trial. **Por qué pasa:** los labs de ALM y
  recuperación hablan de esas operaciones. **Cómo evitarlo:** un Trial de 30 días solo se puede crear y eliminar;
  haz esa parte en un Sandbox de tu organización o en papel.
- **Error:** activar un trial de Sales y otro de Customer Service esperando que compartan datos.
  **Cómo evitarlo:** verifica que ambos apunten al mismo ambiente antes de asumir integración.
- **Error:** citar una duración de trial fija (ej. "30 días siempre") en tu portafolio o evidencia.
  **Cómo evitarlo:** cita la fecha de expiración real que te mostró Microsoft al activarlo, no un
  número genérico.

## Criterio de aprobación

Antes de activar cualquier trial (también el del ambiente del curso), deberías poder responder: ¿qué ruta lo necesita, qué evidencia vas a
producir con él, y qué vas a hacer si no llegas a usarlo completo antes de que expire (documentar lo
logrado, no fingir que lo terminaste)?

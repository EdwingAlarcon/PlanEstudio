---
moduleId: 68
title: "Entorno, instalación y arquitectura PAD"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 25
practiceMinutes: 170
slug: "entorno-instalacion-arquitectura-pad"
lastVerified: "2026-11"
---
*Lectura: 22-25 min · Práctica: unas 3 horas la primera vez (la instalación puede tardar más si el instalador descarga componentes), mejor en dos sesiones (la primera, Microlecciones 1 y 2 con la instalación y el primer flow; la segunda, las Microlecciones 3 y 4 y el reto de transferencia).*

## 🎯 Objetivo

Preparar un entorno de Power Automate for desktop entendiendo consola, diseñador, máquina registrada, conexión de máquina, machine group, usuario, cuenta de servicio, sesión y diferencias attended/unattended.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que observaste). Instalas Power Automate for desktop, construyes un primer desktop flow de comprobación contra el sandbox del curso, entiendes qué cambia cuando el robot corre sin nadie delante y cierras con un **reto de transferencia** sobre una máquina de TEST.
>
> **Antes de empezar, necesitas:**
> - Un equipo con **Windows 10 u 11** (Home, Pro o Enterprise) o Windows Server 2016-2025, sin procesador ARM, y conexión a internet.
> - Una cuenta para iniciar sesión en Power Automate for desktop: una **cuenta Microsoft** personal o una **cuenta de trabajo o escuela** (la del tenant del curso sirve). Crear y ejecutar desktop flows en tu propio equipo, en modo attended, **no requiere pagar licencia** (detalle abajo).
> - **No necesitas licencia Premium.** La Microlección 3 tiene una parte "si tienes Premium o la prueba de 90 días"; si no la tienes, haces la variante en papel y la marcas como simulación.
> - Este nivel es transversal: no exige ningún nivel de certificación. Si no hiciste el [Módulo 67](/nivel/rpa/modulo/fundamentos-rpa-seleccion-procesos), ahí está la decisión de cuándo usar RPA.

## 📖 Conceptos Clave

Power Automate for desktop diseña desktop flows; el Machine Runtime permite ejecutar flujos desde Power Automate cloud. Una máquina registrada representa el equipo; una conexión de máquina define cómo Power Automate inicia sesión; un machine group distribuye ejecuciones; el usuario o cuenta de servicio determina permisos y perfil Windows.

- **Requisitos de sistema:** Windows 10 (Home, Pro o Enterprise), Windows 11 (Home, Pro o Enterprise) o Windows Server 2016/2019/2022/2025. No hay soporte para procesadores ARM. En Windows Home puedes crear y ejecutar flujos en modo attended (local), pero no puedes activarlos desde la nube ni ejecutarlos unattended — eso requiere Pro, Enterprise o Server ([Learn: requisitos y limitaciones](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)).
- **Dos formas de instalar, con implicaciones distintas** ([Learn: instalar Power Automate](https://learn.microsoft.com/en-us/power-automate/desktop-flows/install)):
  - **Instalador MSI** (`Setup.Microsoft.PowerAutomate.exe`, descarga oficial desde el [portal de Power Automate](https://learn.microsoft.com/power-automate/desktop-flows/install)): requiere permisos de administrador local, incluye la opción de instalar el **Machine-runtime app** (necesaria para conectar la máquina al portal de Power Automate y habilitar ejecución desde la nube/unattended), y admite instalación silenciosa (`-Silent -Install -ACCEPTEULA`) para despliegues en varias máquinas ([Learn: instalación silenciosa](https://learn.microsoft.com/en-us/power-automate/desktop-flows/install-silently)).
  - **Microsoft Store**: no requiere permisos de administrador y se actualiza automáticamente, pero no incluye el Machine-runtime app (debe instalarse aparte desde el MSI si se necesita) y no admite instalación silenciosa. Pensada para equipos individuales sin rol de administrador.
  - No se pueden tener ambas instalaciones (MSI y Store) al mismo tiempo en la misma máquina. Sí se puede usar la versión de la Store junto con el Machine-runtime app instalado desde el MSI, si eres administrador del equipo.
- **Qué cuenta usas y qué te da** ([Learn: comparación de cuentas](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements#sign-in-account-comparison)):
  - **Cuenta Microsoft** (personal): los flows se guardan en tu OneDrive personal. Diseñador, grabadora y acciones, sí; conexión con cloud flows, compartir y gestión centralizada, no.
  - **Cuenta de trabajo o escuela** sin licencia premium: sin costo adicional; los flows se guardan en el Dataverse del ambiente **predeterminado**, que debe tener base de datos de Dataverse. Tampoco conecta con cloud flows ([Learn: empezar con una cuenta de trabajo o escuela](https://learn.microsoft.com/en-us/power-automate/desktop-flows/getting-started-freeorg)).
  - **Cuenta premium de la organización** (Power Automate Premium o la prueba): flows en Dataverse de cualquier ambiente, compartir, conexión con cloud flows y gestión centralizada.
- **Licenciamiento mínimo para RPA real** ([Learn: tipos de licencias](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)):
  - **Free** (cuentas de trabajo o escuela): crear y ejecutar desktop flows **localmente en modo attended**, sin costo.
  - **Premium** (por usuario) o la **prueba de 90 días**: registrar la máquina, crear desktop flows fuera del ambiente predeterminado, compartirlos y lanzarlos en modo attended desde un cloud flow. Premium incluye un *attended bot*; **no** incluye unattended.
  - **Process** (por capacidad, asignada a una máquina o a un cloud flow): cada licencia asignada a una máquina es un *unattended bot* que ejecuta un desktop flow a la vez. La máquina tiene que haberla registrado un usuario Premium, y el usuario cuya conexión ejecuta el desktop flow también necesita Premium. La prueba de 90 días también permite unattended.
  - Verifica esto antes de diseñar cualquier actividad que asuma ejecución desatendida.
- **Máquina y registro:** al iniciar sesión en el Machine-runtime app, la máquina se registra en el ambiente seleccionado; se necesita el rol **Environment Maker** o **Desktop Flows Machine Owner**. Una máquina ejecuta desktop flows de la nube en un solo ambiente a la vez, y cambiar ese ambiente borra todas sus conexiones. No se pueden registrar máquinas en ambientes de Teams, y la conectividad directa no está disponible en Windows Home ([Learn: administrar máquinas](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)).
- **Sesión unattended:** Power Automate crea una sesión de escritorio remoto (RDP) con el usuario de la conexión, ejecuta y cierra sesión. En Windows 10 y 11 no corre si hay **cualquier** sesión de usuario activa, incluso bloqueada; el usuario de la conexión debe poder abrir escritorio remoto (normalmente, grupo **Remote Desktop Users**); la resolución puede ser distinta de la que usaste al diseñar; y no corre con privilegios elevados ([Learn: ejecutar desktop flows unattended](https://learn.microsoft.com/en-us/power-automate/desktop-flows/run-unattended-desktop-flows)).

## 👨‍💻 Actividades Prácticas Paso a Paso

## 🧩 Microlección 1 — Instalar Power Automate for desktop y comprobarlo

**¿Qué vas a aprender?** A elegir el método de instalación que corresponde a tu equipo y a dejar constancia de qué quedó instalado.

**¿Por qué existe esto?** El Caso Real de este módulo empezó con una instalación que solo existía en un perfil de usuario. Saber qué instalaste, con qué método y con qué cuenta es la primera línea de cualquier checklist de máquina.

**Ahora haz algo — micropráctica (6 min):** decide cómo instalar y qué podrás hacer en tu propia estación → **[Elegir instalación y cuenta para tu estación](/practica/ip-rpa-004-elegir-instalacion-y-cuenta)**.

**Práctica (40 min):**

1. Antes de instalar nada, corre el [script verificador de estación](/preparar-entorno) con el perfil **RPA** para confirmar qué falta en tu máquina (Windows, navegador, permisos).
2. Instala Power Automate for desktop siguiendo estos pasos concretos:
   - Descarga el instalador desde la página oficial de instalación (enlace en Referencias oficiales) — evita instaladores de terceros.
   - Ejecuta `Setup.Microsoft.PowerAutomate.exe`. Si no tienes permisos de administrador en tu equipo, usa la opción de Microsoft Store en su lugar.
   - En el asistente, marca explícitamente **Machine-runtime app** si vas a necesitar ejecución desde la nube o unattended más adelante (más fácil marcarlo ahora que reinstalar después).
   - Acepta los términos de uso y completa la instalación.
   - Verifica la instalación abriendo Power Automate for desktop desde el menú Inicio y confirmando que aparece el diseñador.
   - Vuelve a correr el [script verificador](/preparar-entorno) y confirma que ahora detecta la herramienta instalada. Si sigue marcando "no instalada" pero sí la ves instalada, cierra y abre una terminal nueva antes de reportarlo como error de contenido — es la causa más común.
3. Al terminar, el instalador ofrece instalar la extensión de Power Automate para tu navegador. Instala la de **Microsoft Edge**. Si te la saltaste, la encuentras después en el diseñador, en **Tools** > **Browser extensions** ([Learn: instalar las extensiones de navegador](https://learn.microsoft.com/en-us/power-automate/desktop-flows/install-browser-extensions)). En Edge, abre **Settings** > **System** y desactiva **Continue running background apps when Microsoft Edge is closed**, como recomienda esa misma página.
4. Inicia sesión en Power Automate for desktop con tu cuenta. Con una cuenta de trabajo o escuela, si la consola te pide crear una base de datos, es porque el ambiente predeterminado aún no tiene Dataverse (ver Conceptos Clave).
5. Anota qué instalaste. La versión está en **Help** > **About**. El método lo confirmas en Windows, en **Settings** > **Apps**: si aparece **Power Automate for desktop**, es el MSI; si aparece **Power Automate** (sin "for desktop"), es la versión de la Store.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Edición de Windows (Home, Pro, Enterprise o Server) | ___ |
| Método de instalación (MSI o Store) y cómo lo confirmaste en **Settings** > **Apps** | ___ |
| Versión de Power Automate for desktop (**Help** > **About**) | ___ |
| ¿Instalaste el Machine-runtime app? (sí/no y por qué) | ___ |
| Tipo de cuenta con la que iniciaste sesión | ___ |
| Resultado del script verificador después de instalar | ___ |

> **Si la instalación falla:** sin mensaje de error, ejecuta el instalador con clic derecho > **Run as administrator** y quita cualquier versión anterior desde **Settings** > **Apps**; con el código **1603**, revisa permisos de administrador y cierra las instancias de Power Automate. Para el resto, la [guía de solución de problemas de instalación](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/desktop-flows/power-automate-desktop-installation-issues) de Microsoft. No instales MSI y Store a la vez: desinstala uno antes de probar el otro.

---

## 🧩 Microlección 2 — Tu primer desktop flow: una prueba de humo contra el sandbox

**¿Qué vas a aprender?** A recorrer la consola y el diseñador, construir un flow de cuatro acciones y leer su resultado. No es todavía un robot útil: es la prueba de que la estación funciona de punta a punta (instalación, extensión del navegador y ejecución attended).

**¿Por qué existe esto?** Una prueba de humo pequeña separa los problemas de entorno de los problemas de lógica. Si este flow falla, el problema está en la estación, no en tu automatización.

**Práctica (35 min):**

1. En la consola, pulsa **New flow**, escribe el nombre `M68_Humo_Portal` y pulsa **Create**. Se abre el diseñador en otra ventana ([Learn: crear desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/create-flow)).
2. Ubica las tres zonas del diseñador: el panel de acciones, con su buscador; el espacio de trabajo, donde se apilan las acciones en orden; y el panel **Variables**, donde verás las variables que producen las acciones y su valor durante la ejecución ([Learn: diseñador de flujos](https://learn.microsoft.com/en-us/power-automate/desktop-flows/flow-designer)).
3. Busca en el panel de acciones **Launch new Microsoft Edge** y arrástrala al espacio de trabajo. Configura **Launch mode**: **Launch new Instance**; **Initial URL**: `https://planestudio.vercel.app/rpa-sandbox/portal`; **Window state**: **Normal**. Guarda la acción. **Deberías ver** que la acción produce la variable `Browser` ([Learn: acciones de automatización de navegador](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/webautomation)).
4. Añade **Get details of web page**. En **Web browser instance** elige `Browser` y en **Get**, **Web page title**. Produce la variable `WebPageProperty`.
5. Añade **Display message**. En **Message box title** escribe `Prueba de humo` y en **Message to display** inserta la variable `WebPageProperty` con el selector de variables del campo; PAD la muestra entre signos de porcentaje, `%WebPageProperty%` ([Learn: acciones de cuadros de mensaje](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/display) y [notación %](https://learn.microsoft.com/en-us/power-automate/desktop-flows/variable-manipulation)).
6. Añade **Close web browser** con **Web browser instance** = `Browser`.
7. Pulsa **Run** en la parte superior del diseñador. **Deberías ver** que se abre Edge con el *Portal SIT de solicitudes comerciales*, aparece un cuadro titulado *Prueba de humo* con el título de la pestaña y, al pulsar **OK**, el navegador se cierra. Repite con **Run next action** para ver la ejecución acción por acción y mira cómo cambian los valores en el panel **Variables**.
8. Pulsa **Save**, cierra el diseñador y confirma que el flow aparece en la pestaña **My flows** de la consola. Ejecútalo también desde ahí, con **Run**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Texto exacto que mostró el cuadro *Prueba de humo* | ___ |
| Valor de `WebPageProperty` que viste en el panel **Variables** | ___ |
| ¿Corrió también desde **My flows**? (sí/no) | ___ |
| Si falló la primera vez: mensaje de error exacto y qué lo resolvió | ___ |

> **Si no ves lo que dice el paso 7:** si la acción **Launch new Microsoft Edge** falla o Edge se abre pero el flow no lo controla, casi siempre falta la extensión o está desactivada: revisa **Tools** > **Browser extensions** y la lista de extensiones de Edge. Si el error es de URL, copia la dirección del paso 3 sin espacios. Si el cuadro aparece detrás de otras ventanas, búscalo en la barra de tareas: el flow está esperando a que pulses **OK**.

---

## 🧩 Microlección 3 — Máquina, conexión, grupo y sesión: lo que cambia sin nadie delante

**¿Qué vas a aprender?** A distinguir las piezas que intervienen cuando un desktop flow corre desde la nube y a diagnosticar un fallo que solo aparece en modo unattended.

**¿Por qué existe esto?** Un flow que funciona attended en tu equipo puede fallar unattended sin haber cambiado una sola acción: cambia quién inicia sesión, en qué sesión, con qué resolución y si hay alguien para pulsar un botón.

| Pieza | Qué es | Dónde se ve |
|---|---|---|
| Máquina | El equipo físico o virtual registrado en un ambiente | Portal de Power Automate: **Monitor** > **Machines** |
| Machine group | Varias máquinas tratadas como una sola, para repartir ejecuciones (el límite de máquinas por grupo cambia según la página de Learn; consúltalo en [Manage machine groups](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machine-groups) antes de dimensionar) | **Monitor** > **Machines** |
| Conexión de desktop flow | Cómo Power Automate se conecta a la máquina e inicia sesión en Windows (con **Directly to machine**, el nombre de la máquina y las credenciales de Windows) | En el cloud flow, al usar **Run a flow built with Power Automate for desktop** |
| Usuario / cuenta de servicio | La cuenta de Windows con la que corre el robot: su perfil, sus permisos y sus aplicaciones instaladas | En la conexión y en la propia máquina |
| Sesión | La sesión de Windows donde se ejecuta: la tuya (attended) o una sesión RDP que crea Power Automate (unattended) | En la máquina |

**Práctica (40 min):**

1. **Si tienes Power Automate Premium o la prueba de 90 días** (con Windows Pro, Enterprise o Server): abre **Power Automate machine runtime** desde el menú Inicio e inicia sesión. La máquina se registra en el ambiente seleccionado; si te avisa de que no está registrada, elige el ambiente de práctica. En **Machine settings** anota **Machine name** y **Machine environment**. Después, en el portal de Power Automate, abre **Monitor** > **Machines** y confirma que aparece, con su estado ([Learn: administrar máquinas](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)). No registres la máquina en un ambiente de producción.
2. **Variante en papel (sin Premium o con Windows Home):** completa la [plantilla de machine readiness](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/templates/machine-readiness-checklist.md) para tu propio equipo, indicando qué te falta para registrarlo (licencia, edición de Windows, rol en el ambiente) y márcala como **simulación**.
3. Vuelve a tu flow `M68_Humo_Portal` y responde por escrito: si este flow corriera unattended desde un cloud flow, ¿qué acción dejaría de tener sentido y por qué? Pista: en unattended nadie ve la pantalla para pulsar **OK**, y Learn documenta para **Display message** la excepción *Can't display message box in noninteractive mode* ([Learn: acciones de cuadros de mensaje](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/display)).
4. **Diagnosticar — micropráctica (7 min):** un compañero llevó un flow parecido a una VM de operaciones → **[Diagnosticar: funciona attended y falla unattended](/practica/ip-rpa-005-attended-ok-unattended-falla)**. Formula tu hipótesis antes de abrir las pistas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| ¿Registro real o variante en papel? | ___ |
| **Machine name** y **Machine environment** (o qué te falta para registrar) | ___ |
| Estado de la máquina en **Monitor** > **Machines** (si aplica) | ___ |
| Acción de `M68_Humo_Portal` que no tendría sentido unattended y qué harías en su lugar | ___ |
| Tu hipótesis del caso unattended, antes de ver las pistas | ___ |

---

## 🧩 Microlección 4 — Ambientes y responsables: DEV, TEST y PROD

**¿Qué vas a aprender?** A separar máquinas, cuentas, secretos y responsables por ambiente antes de que el robot llegue a producción.

**¿Por qué existe esto?** Si DEV y PROD comparten máquina o cuenta, un cambio de prueba llega a producción sin pasar por nadie. Y como una máquina solo ejecuta en un ambiente a la vez, "reutilizar" la de DEV para TEST significa perder sus conexiones.

**Práctica (25 min):**

1. Completa la matriz de abajo para el robot del proceso de SIT (portal + aplicación legacy). Si no tienes tres ambientes, escribe cómo serían; puedes simularlos.
2. Para cada ambiente, anota quién administra la máquina y quién administra el flow: no tienen por qué ser la misma persona.
3. Indica dónde viviría la credencial de Windows de cada ambiente sin quedar en notas, Excel ni variables visibles.

| Ambiente | Máquina o grupo | Cuenta de Windows del robot | Dónde vive la credencial | Modo (attended / unattended / simulación) | Dueño de la máquina | Dueño del flow |
|---|---|---|---|---|---|---|
| DEV | ___ | ___ | ___ | ___ | ___ | ___ |
| TEST | ___ | ___ | ___ | ___ | ___ | ___ |
| PROD | ___ | ___ | ___ | ___ | ___ | ___ |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Qué puedes ejecutar hoy de verdad: attended, unattended o solo simulación | ___ |
| Limitación de licencia o de tenant que documentaste | ___ |
| Qué cambio llegaría a PROD sin pasar por TEST si compartieras máquina (o "ninguno", con la razón) | ___ |

---

## 🔁 Reto de transferencia — Preparar una VM de Windows Server para TEST unattended

Cambia el escenario: ya no es tu equipo, es una máquina virtual de Windows Server que operaciones va a usar para TEST, con ejecución unattended del robot de SIT. La aplicación legacy se instaló con el usuario del desarrollador, la VM se va a clonar a partir de una imagen con Power Automate ya instalado y alguien propone usar la cuenta personal del desarrollador "para no crear otra".

1. **Micropráctica (9 min):** **[Transferir: readiness de una VM para TEST unattended](/practica/ip-rpa-006-readiness-vm-test-unattended)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** escribe la checklist de readiness de esa VM (mínimo 8 puntos), cada uno con la evidencia que demostraría que se cumple en la VM y no en el equipo del desarrollador.

**Evidencia a reportar:**

| Punto de readiness | Evidencia en la VM de TEST |
|---|---|
| ___ | ___ |
| ___ | ___ |
| ___ | ___ |
| ___ | ___ |

## 💼 Casos Reales de Negocio

Un bot funciona en el equipo del desarrollador pero no en la VM de operaciones porque la aplicación legacy solo está instalada en un perfil de usuario. La solución no es editar acciones al azar: es corregir arquitectura de máquina, sesión, usuario, instalación y readiness.

## ✅ Buenas Prácticas

- Usa DEV, TEST y PROD separados.
- Declara quién administra la máquina y quién administra el flow.
- No guardes contraseñas en notas, Excel ni variables visibles.
- Valida sesión, resolución, bloqueo de pantalla y permisos.
- Documenta limitaciones de licencia sin fijar precios.
- Haz una prueba de humo pequeña en cada máquina nueva antes de probar el robot completo.
- No preinstales Power Automate for desktop en una imagen base de VM ni clones la VM después de instalar el machine runtime: instálalo en cada máquina después de crear la imagen ([Learn: requisitos y limitaciones](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)).
- Mantén la misma versión de Power Automate for desktop en DEV, TEST y PROD: un flow editado con una versión más nueva puede no abrir en una más vieja.
- Evita **Display message** y otros cuadros que esperan a una persona en flows que vayan a correr unattended; registra el resultado en un log.

## ⚠️ Errores Comunes

- Confundir cuenta que crea la conexión con cuenta que ejecuta Windows.
- Probar attended y asumir que unattended funcionará igual.
- Ejecutar pruebas contra producción.
- Ignorar políticas DLP, acceso a archivos y antivirus.

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El flow unattended no arranca y queda en cola | Hay una sesión de Windows abierta en la máquina (en Windows 10/11, aunque esté bloqueada) | Cierra todas las sesiones de usuario en la máquina antes de la ejecución unattended |
| El flow unattended falla al iniciar sesión en la máquina | La cuenta de la conexión no puede abrir escritorio remoto | Agrega la cuenta del robot al grupo **Remote Desktop Users** de la máquina |
| El flow espera un clic que nadie da, o falla con `Can't display message box in noninteractive mode` | El flow usa **Display message** (u otro cuadro de diálogo) y en unattended no hay nadie para responder | Quita el cuadro o cámbialo por un registro en archivo o log |
| La acción encuentra el elemento en DEV pero no en la VM | La sesión RDP de unattended tiene otra resolución | Fija la resolución de unattended y vuelve a probar en la VM |
| El robot no encuentra la aplicación legacy en la VM | La aplicación está instalada solo en el perfil del desarrollador | Instálala para la cuenta del robot (o para todos los usuarios) y pruébala iniciando sesión con esa cuenta |
| La máquina perdió todas sus conexiones | Se cambió su ambiente de ejecución en **Machine settings** | Usa una máquina por ambiente; si cambias el ambiente, vuelve a crear las conexiones |
| "This flow has been generated by a newer Power Automate version..." | El flow se editó con una versión más nueva que la instalada en la máquina | Actualiza Power Automate for desktop en esa máquina a la versión de DEV o superior |

## 🧪 Criterios de Validación

- [ ] Instalé Power Automate for desktop (MSI o Microsoft Store) y el script verificador de `/preparar-entorno` lo confirma.
- [ ] Anoté edición de Windows, método de instalación, versión y tipo de cuenta, y sé qué me permite cada uno.
- [ ] Construí y ejecuté la prueba de humo `M68_Humo_Portal` contra el sandbox, desde el diseñador y desde **My flows**.
- [ ] Diferencio máquina, conexión, grupo de máquinas, usuario y sesión.
- [ ] Sé explicar attended vs unattended con impacto operativo.
- [ ] Diagnostiqué el flow que funciona attended y falla unattended formulando una hipótesis antes de ver la causa.
- [ ] Tengo un checklist de readiness de máquina.
- [ ] Documenté limitaciones de licencia/tenant.
- [ ] Separé DEV/TEST/PROD sin cambios directos en producción.
- [ ] En el reto de transferencia escribí la checklist de readiness de una VM de TEST con la evidencia de cada punto.

## Evidencia

Machine readiness checklist, matriz de ambientes, captura del runtime o simulación marcada, y las tablas de evidencia de las cuatro microlecciones y del reto. Lab recomendado: LAB-111. Incidente relacionado: INC-RPA-002.

## Preguntas de verificación

1. ¿Qué revisarías si un flujo funciona attended y falla unattended?
2. ¿Por qué la sesión Windows importa para PAD?
3. ¿Qué debe contener un registro de máquina RPA?

## Conexión con siguiente módulo

Con el entorno claro, el siguiente paso es construir desktop flows mantenibles y no monolíticos.

## Limitaciones y seguridad

La ejecución unattended requiere licencia/capacidad y configuración compatible. Si no existe, entrega variante simulada y no la declares como validación real.

## Referencias oficiales

- [Install Power Automate](https://learn.microsoft.com/power-automate/desktop-flows/install)
- [Prerequisites and limitations](https://learn.microsoft.com/power-automate/desktop-flows/requirements)
- [Install Power Automate browser extensions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/install-browser-extensions)
- [Create desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/create-flow)
- [Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)
- [Run unattended desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/run-unattended-desktop-flows)
- [Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)
- [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)

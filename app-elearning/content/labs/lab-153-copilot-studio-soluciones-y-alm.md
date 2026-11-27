---
id: lab-153
title: "Soluciones y ALM de un agente: variable de entorno, referencias de conexión, exportar e importar, y VS Code con Git (Ruta Pro Copilot Studio)"
level: "N3"
duration: 315
product: ["Copilot Studio", "Dataverse", "Power Automate"]
certifications: []
role: ["Agent builder", "Desarrollador", "Arquitecto de soluciones"]
prerequisites:
  - "Lab 152 terminado: el agente Asistente de compras SIT con sus conjuntos de prueba Hechos v2 y Límites"
  - "Ambiente del curso con una prueba de Copilot Studio activa y el rol System Customizer o System Administrator"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 153 — Soluciones y ALM de un agente: variable de entorno, referencias de conexión, exportar e importar, y VS Code con Git

## Objetivo

Dejar el `Asistente de compras SIT` listo para salir de tu ambiente: todo lo que necesita dentro de una **solución**, sin valores escritos a fuego, y con un camino probado para llevarlo a otro entorno. Vas a revisar qué lleva la solución y qué falta, a sacar el correo de Compras a una **variable de entorno**, a revisar las **referencias de conexión**, a **exportar** el paquete y abrirlo, y a hacer el ciclo completo (exportar, borrar, importar, desinstalar) sobre un agente desechable. Si puedes instalar VS Code, clonas el agente con la extensión de Copilot Studio y llevas un cambio con **Git**. Cierras con un plan de despliegue y seis decisiones de ALM en papel.

## Escenario de negocio

El piloto del asistente gustó y TI quiere llevarlo a pruebas y después a producción. Su condición: nada de "funciona en mi ambiente". El correo de Compras de pruebas no es el de producción, las conexiones no pueden ser las tuyas, y cada cambio tiene que poder revisarse antes de llegar a producción.

## Lo que vas a construir

- Un inventario de la solución contra una lista de diez componentes
- La variable de entorno `Correo de Compras`, usada en un topic en lugar del correo escrito
- Una tabla de referencias de conexión y de qué flujo usa cada una
- El paquete de la solución exportado y una tabla de lo que contiene
- El ciclo exportar, borrar, importar y desinstalar sobre el agente desechable `ACS ALM Prueba`
- (Si instalas VS Code) el agente clonado en Git con un cambio llevado de vuelta a Copilot Studio
- Un plan de despliegue y seis decisiones de ALM

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Qué lleva tu solución | 40 min |
| Ejercicio 2 — Una variable de entorno en un topic | 50 min |
| Ejercicio 3 — Referencias de conexión | 30 min |
| Ejercicio 4 — Exportar y abrir el paquete | 45 min |
| Ejercicio 5 — El ciclo completo sobre un agente desechable | 60 min |
| Ejercicio 6 — VS Code y Git (40 min; 70 si tienes que instalar VS Code, Git y la extensión) | 40-70 min |
| Ejercicio 7 — Plan de despliegue y decisiones | 30 min |
| **Total** | **unas 5 h a 5 h 30 min** |

## Nivel

**N3 Avanzado** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620, dominio "probar y gestionar")

## Tecnologías utilizadas

- Copilot Studio: explorador de soluciones, **View solution**, **Add existing** > **Agent**, **Add required objects**, variables de entorno en topics (prefijo `Environment.`), **Export solution** e **Import solution**
- Dataverse: soluciones administradas y no administradas, variables de entorno, referencias de conexión
- Extensión de Copilot Studio para Visual Studio Code y Git (opcional)
- Pipelines de Power Platform (en papel)

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` del [Lab 152](/labs/lab-152-copilot-studio-evaluacion), creado en la solución `SIT Asistente Compras` (Lab 144, Ejercicio 2). Si lo creaste en la solución por defecto, lo arreglas en el Ejercicio 1.
- [ ] El rol **System Customizer** (o administrador) en el ambiente: Learn lo pide para exportar e importar agentes ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/authoring-solutions-import-export)). En tu prueba eres administrador.
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) descargado de nuevo (versión con la carpeta `lab153/`). Usas `checklist-alm.json`, `plan-despliegue.json` y `decisiones-alm.json`.
- [ ] Para el Ejercicio 6 (opcional): Visual Studio Code, Git y la extensión **Copilot Studio** del marketplace de VS Code ([Learn: instalar la extensión](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-install-configure)).

> **Lo que no vas a poder hacer: llevarlo a otro entorno y publicarlo.** Con una prueba tienes un solo ambiente y no puedes publicar ([Learn: FAQ](https://learn.microsoft.com/microsoft-copilot-studio/faq-billing-licensing)). Por eso el ciclo de importación se hace en el mismo ambiente con un agente desechable (como el Lab 136 con flujos), y el despliegue a pruebas y producción va en papel.

> **Etiquetas:** este lab da los nombres en inglés, como Learn. Si tu interfaz está en español, busca el equivalente; las etiquetas en español de estas pantallas no se han comprobado.

### Conocimiento previo

- [Lab 136](/labs/lab-136-power-automate-soluciones-y-alm) (soluciones, referencias de conexión, variables de entorno y ciclo de vida con flujos), si hiciste la Ruta Pro Power Automate. No es obligatorio, pero este lab no repite los conceptos.

---

## Ejercicio 1 — Qué lleva tu solución

**Objetivo:** saber si la solución lleva todo lo que el agente necesita para funcionar en otro entorno.

1. En el agente, **…** (junto a **Settings**, debajo del nombre del entorno) > **View solution** ([Learn: soluciones en Copilot Studio](https://learn.microsoft.com/microsoft-copilot-studio/authoring-solutions-overview)). Anota en qué solución está. Learn indica que todo agente se crea dentro de una solución, por defecto la predeterminada, y que para exportar hace falta una solución propia.
2. Si no está en `SIT Asistente Compras`, abre esa solución y **Add existing** > **Agent** > **Agent**, elige el agente y **Add** ([Learn: exportar e importar](https://learn.microsoft.com/microsoft-copilot-studio/authoring-solutions-import-export)).
3. **Antes del siguiente clic, decide dónde vive la tabla `Solicitud de compra` (C09).** Búscala en **Tables** o en las soluciones: si la creaste en el Lab 128, está en `SIT Compras`; si la creaste en el Lab 144 sin la Ruta Pro Power Automate, ya está en `SIT Asistente Compras`. Si está en otra solución, decide ahora si la quieres también en esta (lee el paso 6). **Add required objects** puede añadirla sola; si no la quieres aquí, después la quitas con **Remove from this solution**, **nunca** con **Delete from this environment**, que la borraría con sus filas.
4. En **Objects** > **Agents**, en tu agente, **⋮** > **Advanced** > **Add required objects**. Learn indica que, si añadiste topics o flujos al agente, también tienes que añadirlos a la solución antes de exportar. Haz lo mismo sobre cada agent flow en **Workflows** (si aparecen) para arrastrar sus dependencias.
5. Abre `lab153/checklist-alm.json` y llena la tabla mirando los objetos de la solución:

| Id | Componente | ¿Está en la solución? | Dónde lo viste |
|---|---|---|---|
| C01 | Agente | | |
| C02 | Topics propios y topics de sistema que personalizaste (**Escalate**, **On Error**, **Fallback**) | | |
| C03 | Agente hijo `Atención a proveedores` (y `Comprobar tolerancia de factura`, si lo conservaste en el Lab 151) | | |
| C04 | Conocimiento (manual v2, sitio web, Dataverse) | | |
| C05 | Agent flows `ACS - Registrar…` y `ACS - Consultar…` | | |
| C06 | Referencias de conexión | | |
| C07 | Herramienta REST `Catálogo SIT` (¿creó un conector personalizado?) | | |
| C08 | Variable de entorno | | (la creas en el Ejercicio 2) |
| C09 | Tabla `Solicitud de compra` | | |
| C10 | Autenticación, canales e icono | | |

   Learn advierte que no todos los componentes viajan: las instrucciones sí, pero algunos topics y fuentes de conocimiento pueden quedar fuera si se guardan como recursos aparte, y propiedades como el identificador del entorno no se transfieren; el agente importado puede llegar sin icono y sin canales. Si un componente no aparece, anota **no** y sigue: es un hallazgo.
6. **C09, la decisión por escrito.** Si la tabla vive en `SIT Compras` (Lab 128), ¿la dejas también en `SIT Asistente Compras`, o declaras `SIT Compras` como solución que hay que importar antes? Si ya vivía en `SIT Asistente Compras` (Lab 144), escribe si la separarías en una solución propia de datos y por qué. (Pista del Lab 136: desinstalar una solución administrada borra las tablas que trajo, con sus datos.)

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Solución en la que estaba el agente | ___ |
| Componentes de la lista que **no** están en la solución | ___ |
| Tu decisión sobre la tabla (C09) | ___ |

---

## Ejercicio 2 — Una variable de entorno en un topic

**Objetivo:** que el correo de Compras de pruebas y el de producción no obliguen a editar el agente.

1. En la solución `SIT Asistente Compras`, **New** > **More** > **Environment variable** (la opción de Power Apps; Learn documenta en Copilot Studio **Add existing** > **More** > **Environment variable** para una variable que ya existe; si el explorador de soluciones de Copilot Studio no te ofrece **New**, créala desde la misma solución en [make.powerapps.com](https://make.powerapps.com)). **Display name** `Correo de Compras`, **Data type** **Text**, **Default value** `compras@sit.example.com`. **Save**. Anota el **nombre de esquema** que genera (algo como `sit_CorreodeCompras`; el tuyo puede variar). Learn indica que el tipo y el nombre no se cambian después.
2. Abre el topic de sistema **Escalate**, que personalizaste en el Lab 149 con el correo y el horario de Compras. En el mensaje, sustituye `compras@sit.example.com` por la variable. La vía segura: antes del mensaje, un nodo **Set a variable value** con una variable nueva `CorreoCompras` y, en la pestaña **Formula**, `Environment.sit_CorreodeCompras` (con **tu** nombre de esquema); después, en el mensaje, inserta `CorreoCompras` con el botón de variables (**{x}**). También puedes buscar la variable de entorno directamente en ese botón, pero no se ha comprobado cómo se llama su pestaña o grupo. Haz lo mismo en **On Error**, que en el Lab 149 también lleva el correo escrito. Learn indica que el prefijo de las variables de entorno en Power Fx es `Environment.` ([Learn: Power Fx](https://learn.microsoft.com/microsoft-copilot-studio/advanced-power-fx)) y que en Copilot Studio son de **solo lectura** ([Learn: variables](https://learn.microsoft.com/microsoft-copilot-studio/authoring-variables-about#environment-variables)).
3. **Save** y prueba `quiero hablar con una persona` (escenario C7 del Lab 149). Debe salir `compras@sit.example.com`.
4. Ahora cambia el valor: en la solución, abre la variable (puede abrirse la experiencia de Power Apps: Learn indica que las variables de entorno no se modifican desde Copilot Studio) y, en **Current value**, **+ New value** con `compras-pruebas@sit.example.com`. **Save**.
5. En una sesión de prueba nueva (botón de reiniciar el panel), repite C7. Anota qué correo sale.
6. Lee lo que dice Learn: la versión **publicada** del agente lleva el valor que tenían las variables **al publicar**, y tras cambiar una variable hay que volver a publicar para que el cambio llegue a los usuarios; la excepción son las variables de tipo **secreto** (Azure Key Vault), que se leen en tiempo de ejecución. Learn no dice qué valor usa el **panel de prueba**: lo que anotaste en el paso 5 es ese dato. Escribe qué implica para alguien que cambia el correo en producción y no vuelve a publicar.
7. Quita el **Current value** (en la variable, **…** junto al valor actual > **Delete from this environment**; **Remove from this solution** solo lo saca del paquete y el valor sigue en el entorno; las etiquetas exactas no se han comprobado) para que vuelva a mandar el **Default value**, y comprueba C7 otra vez. **No te saltes este paso:** si exportas con un valor actual, el Ejercicio 4 no te enseñará lo que debe.

> **Valor predeterminado frente a valor actual** (como en el Lab 136): el predeterminado viaja dentro de la solución; el actual es del entorno. En pruebas y en producción darás el valor actual al importar.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Nombre de esquema de la variable | ___ |
| Cómo insertaste la variable (selector o fórmula `Environment.`) | ___ |
| Correo que salió en el panel tras cambiar **Current value**, sin publicar | ___ |
| Qué pasa en producción si cambias la variable y no vuelves a publicar | ___ |

---

## Ejercicio 3 — Referencias de conexión

**Objetivo:** saber con qué conexiones correrán las herramientas del agente en otro entorno.

1. En la solución, filtra o busca los objetos de tipo **Connection reference**. Para cada una, ábrela y anota el conector y la conexión que usa.
2. Abre cada agent flow (`ACS - Registrar solicitud de compra`, `ACS - Consultar mis solicitudes`) y comprueba en sus acciones de Dataverse si usan una referencia de conexión de la solución o una conexión directa. No se ha comprobado en el tenant si un agent flow creado desde Copilot Studio usa referencias de conexión al añadirlo a una solución: lo que veas es el dato.
3. La herramienta **Avisar a Compras** (Office 365 Outlook, Lab 148) y la herramienta REST `Catálogo SIT`: ¿aparecen como referencia de conexión, como conector personalizado o no aparecen? Learn indica que, si el agente usa conectores personalizados, se importan **primero**, y después la referencia de conexión con la solución del agente.

| Referencia o conector | Conector | La usa | ¿En la solución? |
|---|---|---|---|
| | Microsoft Dataverse | | |
| | Office 365 Outlook | | |
| | `Catálogo SIT` (REST) | | |

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Tu tabla de referencias | ___ |
| ¿Usan los agent flows referencias de conexión? | ___ |
| ¿La herramienta REST creó un conector personalizado? | ___ |

---

## Ejercicio 4 — Exportar y abrir el paquete

**Objetivo:** ver con tus ojos qué viaja.

1. Abre el explorador de soluciones de Copilot Studio (**…** en la barra lateral > **Solutions**). En las soluciones no administradas, elige `SIT Asistente Compras` > **Export solution**. Se abre **Before you export**: si te ofrece **Publish**, es publicar las personalizaciones de Dataverse de la solución, no publicar el agente (eso no puedes con la prueba); hazlo y revisa los problemas si te lo ofrece. Learn remite al asistente de exportación de Power Apps para el resto.
2. Exporta como **Unmanaged** y, otra vez, como **Managed** (con la versión que propone, o súbela un número). Guarda los dos `.zip`.
3. Descomprime el **administrado** en una carpeta y llena la tabla (lo esperable, por cómo se empaquetan las soluciones; no comprobado para agentes en el tenant del curso):

| Qué buscar | Lo esperable | Lo que encontraste |
|---|---|---|
| Archivos de la raíz | `solution.xml`, `customizations.xml`, `[Content_Types].xml` | |
| El agente | Una carpeta de bots con el nombre de esquema del agente | |
| Topics y agentes hijos | Una carpeta de componentes del bot, uno por topic o pieza | |
| Agent flows | `Workflows/*.json` | |
| Variable de entorno | `environmentvariabledefinitions/` con el valor predeterminado (y sin el valor actual) | |
| Referencias de conexión | Dentro de `customizations.xml` | |
| El manual subido como conocimiento | ¿Viaja el archivo o solo la referencia? | |

4. Busca en el paquete `compras@sit.example.com`. Si aparece fuera de la variable de entorno, todavía hay un valor escrito a fuego (por ejemplo, en las instrucciones, en el manual o en un topic que se te pasó en el Ejercicio 2). Anota dónde y decide si debe salir de la variable: el del manual, no (es contenido del documento).

> **No edites el paquete a mano.** Learn advierte que quitar o cambiar componentes del agente directamente en la solución hace fallar la exportación y la importación: los topics se cambian en Copilot Studio.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Tu tabla del paquete | ___ |
| ¿Dónde más aparece el correo escrito? | ___ |
| ¿Viajó el archivo del manual? | ___ |

---

## Ejercicio 5 — El ciclo completo sobre un agente desechable

**Objetivo:** importar una solución administrada con un agente y desinstalarla, sin arriesgar el asistente.

> **Alcance:** haz **todo** este ejercicio sobre una solución nueva `SIT ALM Agente Prueba` y un agente nuevo. **Nunca** con `SIT Asistente Compras`: no la borres ni la desinstales.

### Tarea 5.1 — El agente desechable

1. En el explorador de soluciones, **New solution**: `SIT ALM Agente Prueba`, tu publicador, versión `1.0.0.0`.
2. Crea un agente del harness estándar como en el Lab 144 (comprobado con la interfaz en español: **Agentes** > flecha **Más opciones de creación** > **Agente** marcado **Estándar**) y, en **Configuración del agente (opcional)**, **Solución** = `SIT ALM Agente Prueba`. Nombre `ACS ALM Prueba`. Sin conocimiento ni herramientas.
3. Un topic `Hola ALM` (descripción `Responde cuando el usuario escribe hola ALM`) con el mensaje `Versión 1 del agente de prueba.` **Save** y pruébalo con `hola ALM`.

### Tarea 5.2 — Exportar y borrar

4. Exporta `SIT ALM Agente Prueba` como **Managed**.
5. Borra el agente `ACS ALM Prueba`. **Lee dos veces el nombre antes de confirmar**: el asistente está en la misma lista. Learn no documenta el botón; prueba en la lista de agentes **…** > **Delete** o, desde la solución `SIT ALM Agente Prueba` > **Agents** > el agente > **⋮** > **Delete from this environment** (**Remove from this solution** no borra nada). Después borra la solución `SIT ALM Agente Prueba`. Comprueba que el agente ya no está en la lista.

### Tarea 5.3 — Importar la administrada

6. En el explorador de soluciones, **Import solution** > el `.zip` administrado. Si falla, **Download log file**: Learn indica que la causa más común es un componente que falta.
7. Abre la solución importada > **Objects** > **Agents** > el agente. Anota:

| Comprobación | Lo que viste |
|---|---|
| ¿Aparece la solución como administrada? | |
| ¿Te deja editar el topic `Hola ALM`? Mira **sin guardar**: guardar crearía una capa no administrada encima. ¿Aparece algún aviso de solo lectura? | |
| ¿Responde `hola ALM` en el panel de prueba? | |
| ¿Qué autenticación tiene? Learn pide volver a configurarla tras importar | |
| ¿Tiene icono? | |

   Learn indica que un agente importado hay que **publicarlo** antes de compartirlo (no puedes, con la prueba) y que no se puede borrar un agente de una solución administrada: se quita desinstalando o actualizando la solución. El aviso **Read-only** que describe Learn es para agentes del Microsoft Copilot harness; para el harness estándar no se ha comprobado.

### Tarea 5.4 — Desinstalar

8. En el explorador de soluciones, busca `SIT ALM Agente Prueba` (aparece como administrada), comprueba el nombre exacto y **Delete**: en una administrada, eso la desinstala y pide confirmación. **No** lo hagas sobre `SIT Asistente Compras` ni sobre `SIT Compras`. Comprueba que el agente `ACS ALM Prueba` desapareció de la lista y que el `Asistente de compras SIT` sigue igual.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Tu tabla de la Tarea 5.3 | ___ |
| ¿Desapareció el agente al desinstalar? | ___ |
| ¿Sigue intacto el asistente? | ___ |

---

## Ejercicio 6 — VS Code y Git (si puedes instalar VS Code)

**Objetivo:** tener el agente en archivos versionados y llevar un cambio revisado de vuelta a Copilot Studio. Si no puedes instalar VS Code, lee los pasos y responde las preguntas de la validación con lo que dice Learn.

1. En VS Code, abre la extensión **Copilot Studio** (icono en la barra de actividad), inicia sesión con tu cuenta del curso y, en el panel **Agents**, elige tu entorno. Clic derecho sobre `Asistente de compras SIT` > **Clone agent** y elige una carpeta vacía ([Learn: clonar](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-clone-agent)).
2. Mira la estructura que crea. Learn la muestra así: `agent.mcs.yaml` (definición principal), `settings.mcs.yml`, `connectioreferences.mcs.yml` (así, como lo escribe Learn), y carpetas `topics/`, `actions/` (conectores), `knowledge/`, `workflows/` y `trigger/`. Anota qué carpetas tiene tu clon y en cuál quedaron los agentes hijos.
3. En **Source Control**, **Initialize Repository** y haz un primer commit (`Agente tal como está tras el Lab 152`).
4. Abre el archivo del topic `Comprobar factura` dentro de `topics/` y cambia **solo el texto** del mensaje final (por ejemplo, añade `Si está FUERA, Compras te contactará.`). No cambies la estructura ni los identificadores.
5. Mira el cambio en **Source Control** (diff) y haz commit (`Comprobar factura: aviso si está fuera de tolerancia`).
6. **Antes de subir, ten un camino de vuelta**: el cambio va al asistente real, y un YAML roto lo deja sin funcionar. Si algo sale mal, `git revert` del commit y otro **Push changes**; y, como último recurso, el paquete no administrado del Ejercicio 4 (importarlo lo devuelve a ese estado). Lleva el cambio a Copilot Studio con el icono **Push changes** de la extensión (Learn muestra **Fetch changes**, **Pull changes** y **Push changes** en el Explorador y en Source Control). Abre el topic en Copilot Studio y comprueba que el texto cambió. Repite F2 del Lab 151 en el panel.
7. Corre otra vez `Hechos v2` (Lab 152). El cambio no debería afectarlo: compruébalo con **Compare with**.

> **Git no sustituye a las soluciones.** Learn recomienda soluciones y pipelines para mover el agente entre entornos; la extensión sirve para editar, revisar y versionar. En equipo, cada persona clona desde el repositorio compartido y usa **Copilot Studio: Reattach Agent** para conectar su carpeta al agente.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Carpetas de tu clon y dónde quedaron los agentes hijos | ___ |
| Diff del cambio (captura) | ___ |
| ¿Llegó el cambio a Copilot Studio? ¿Cambió el resultado de `Hechos v2`? | ___ |

---

## Ejercicio 7 — Plan de despliegue y decisiones

**Objetivo:** dejar escrito cómo llegaría el asistente a producción, con lo que dice Learn.

1. Escribe el plan de despliegue para **Desarrollo → Pruebas → Producción**: tipo de cada entorno, tipo de solución, valor de `Correo de Compras` en cada uno y los pasos después de importar. Compáralo con `plan-despliegue.json`.
2. **Pipelines, en papel.** Learn indica que los pipelines de Power Platform despliegan soluciones administradas junto con las conexiones, las referencias de conexión y las variables de entorno, que se piden y se validan **antes** de desplegar; que guardan cada versión exportada; que admiten aprobaciones (despliegues delegados); y que todos los entornos del pipeline, salvo el host y los de desarrollo, deben ser **entornos gestionados**, con licencias premium ([Learn: pipelines](https://learn.microsoft.com/power-platform/alm/pipelines)). En Copilot Studio se abren desde el explorador de soluciones > **Pipelines**. Responde: ¿qué paso de tu plan del punto 1 hace solo el pipeline y cuál sigue siendo manual?
3. Abre `decisiones-alm.json` y decide cada situación **antes** de mirar la respuesta:

| Id | Situación (resumen) | Tu decisión | Tu razón |
|---|---|---|---|
| A1 | Cambiar el correo de Compras en producción sin tocar el agente | | |
| A2 | Una clave de API distinta en cada entorno | | |
| A3 | Llevar el agente a producción sin que nadie lo edite allí | | |
| A4 | Revisar en Git cada cambio de un topic | | |
| A5 | Paso a producción con aprobación y auditoría | | |
| A6 | Tras importar, responde pero no registra solicitudes | | |

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Tu plan de despliegue | ___ |
| Qué hace el pipeline y qué sigue siendo manual | ___ |
| Decisiones que coinciden con el archivo (de 6) | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| El agente no aparece en **Add existing** | Buscas en otro tipo de objeto | **Add existing** > **Agent** > **Agent** |
| La exportación falla | Un topic tiene un punto (`.`) en el nombre, o se quitaron componentes desde la solución | Learn: renombra el topic sin puntos; no edites componentes desde la solución |
| La importación falla | Falta un componente (por ejemplo, la tabla o un conector personalizado) | **Download log file**; importa antes la solución de la tabla o del conector |
| Tras importar, el agente no registra | Referencias de conexión sin conexión, o agent flows apagados | Revisa referencias y conexiones; enciende los flujos |
| La variable de entorno no aparece en el selector | No está en la solución o la buscas con otro nombre | Fórmula `Environment.<nombre de esquema>` |
| El cambio de VS Code no llega | No hiciste **Push changes**, o la carpeta no está asociada al agente | **Push changes**; **Copilot Studio: Reattach Agent** |

## Checklist final

- [ ] Inventario de la solución con los componentes que faltan anotados
- [ ] Variable de entorno `Correo de Compras` usada en **Escalate**, con el comportamiento del panel anotado
- [ ] Tabla de referencias de conexión
- [ ] Paquetes exportados (no administrado y administrado) y tabla de su contenido
- [ ] Ciclo exportar, borrar, importar y desinstalar sobre `SIT ALM Agente Prueba`, con el asistente intacto
- [ ] (Opcional) Agente clonado en Git con un cambio llevado a Copilot Studio
- [ ] Plan de despliegue y seis decisiones

## Evidencia esperada

- Captura de los objetos de la solución `SIT Asistente Compras`
- Captura de la variable de entorno y del mensaje de **Escalate** con el correo que sale de ella
- Tu tabla del paquete exportado
- Captura de la solución administrada importada y de la lista de agentes tras desinstalarla
- (Opcional) Captura del diff en Git y del topic cambiado en Copilot Studio
- Tu plan de despliegue y tu tabla A1 a A6

## Criterios de aprobación

- La solución contiene el agente, sus topics, sus agent flows y la variable de entorno, o están anotados los que faltan con su causa
- El correo de Compras ya no está escrito en los topics **Escalate** ni **On Error**
- El ciclo de la solución desechable termina con el asistente intacto
- El plan de despliegue dice qué valor tiene la variable en cada entorno y que hay que volver a publicar tras cambiarla

## Competencias desarrolladas

- Empaquetar un agente con sus dependencias en una solución
- Sacar a variables de entorno los valores que cambian entre entornos
- Saber qué viaja en una solución de agente y qué hay que volver a configurar
- Importar y desinstalar soluciones administradas sin arriesgar datos
- Versionar un agente con Git y planificar un despliegue con pipelines

## Reto adicional

**Reto básico:** saca también a una variable de entorno el horario de atención de Compras. ¿Qué tipo de variable eliges?

**Reto intermedio:** en `SIT ALM Agente Prueba` (vuelve a crearla), sube la versión a `1.1.0.0` con otro texto en `Hola ALM`, exporta la administrada e impórtala encima de la 1.0. ¿Qué cambia en el agente importado?

**Reto avanzado:** diseña en papel un flujo de CI/CD con GitHub o Azure DevOps: el cambio entra por Git (Ejercicio 6), se empaqueta como solución, se despliega a pruebas con un pipeline, se corre `Hechos v2` (Lab 152) y solo si pasa el criterio de salida se pide la aprobación para producción.

## Preguntas de repaso

1. ¿Por qué no basta con la solución por defecto para mover un agente?
2. ¿Qué hace **Add required objects** y cuándo lo usas?
3. ¿Qué valor de una variable de entorno lleva la versión publicada de un agente?
4. Nombra tres cosas que Learn dice que hay que revisar o rehacer después de importar un agente.
5. ¿Por qué no se desinstala nunca una solución administrada sin saber qué tablas trae?

## Limpieza del laboratorio

Comprueba que `SIT ALM Agente Prueba` ya no existe y que el asistente responde como antes. Conserva los dos paquetes exportados de `SIT Asistente Compras`: son tu respaldo y el punto de partida de los labs 154 y 155.

## Siguiente laboratorio recomendado

**Lab 154 — Publicación, operación y coste** (próximamente): publicar y canales (en papel con la prueba), Analytics, transcripciones y estimación de créditos.

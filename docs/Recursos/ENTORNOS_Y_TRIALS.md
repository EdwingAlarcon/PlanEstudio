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

**No verificado en Learn** (no lo des por hecho): si al vencer el Trial puedes crear otro de inmediato con la misma
cuenta; qué recibe exactamente una cuenta gratuita de Microsoft Entra creada para esto; si después de los 90 días de
licencia Power Apps trial se puede obtener otra.

### Crear el ambiente Trial con Dataverse (clic a clic)

El recorrido completo, con lo que hacer si algo sale distinto, está en el
[Módulo 1](/nivel/basico/modulo/introduccion-al-ecosistema-power-platform), Microlección 1. Resumen según
[Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments):

1. Activa tu licencia Power Apps trial (Módulo 1, Paso 2A).
2. Entra en el [Power Platform admin center](https://admin.powerplatform.microsoft.com).
3. En el panel de navegación selecciona **Manage** y, en el panel **Manage**, **Environments**.
4. En la página **Environments** selecciona **New** en la barra de comandos.
5. **Name:** `DEV-TuNombre`; **Type:** **Trial**; **Region:** la más cercana; **Purpose:** una descripción; la opción
   de añadir Dataverse (**Create a database for this environment?** o **Add a Dataverse data store**): **Yes**. Selecciona **Next**.
6. **Language:** **English (United States)**; **Currency:** la de tu país; **Enable Dynamics 365 apps:** **No**;
   **Security group:** el que te pida la pantalla (en tu tenant propio, **None** si está disponible). Selecciona **Save**.
7. Anota la fecha de vencimiento: en **Environments**, selecciona tu ambiente y, en el panel **Details**, **See all**
   para ver **Day(s) remain**.

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
  Enterprise, algunos partners y clientes de soporte Premier o Unified (verificado el 1 nov 2026); no es la primera opción.

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

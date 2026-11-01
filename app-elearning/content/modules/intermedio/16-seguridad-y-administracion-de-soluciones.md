---
moduleId: 16
title: "Seguridad y Administración de Soluciones"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 25
practiceMinutes: 150
slug: "seguridad-y-administracion-de-soluciones"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 150 min, repartidos mejor en dos sesiones (la primera hasta la Microlección 2; la segunda, de la 3 al final). La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Implementar una estrategia de ambientes múltiples (DEV → TEST → UAT → PROD), empaquetar soluciones correctamente con Connection References y Environment Variables, y establecer controles de seguridad de acceso basados en roles a nivel de la plataforma. En tu tenant practicarás el tramo DEV → TEST de punta a punta; UAT y PROD los diseñarás, porque crearlos exige capacidad que un tenant de práctica normalmente no tiene.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica en tu ambiente con **evidencia** (el dato exacto que viste). Antes de importar la solución vas a diagnosticar un fallo típico de ALM a partir del síntoma, y al final harás un reto de construcción sin pasos y un reto de transferencia con otro cliente.
>
> **Antes de empezar, necesitas:**
> - Tu ambiente Developer (o Trial) del Módulo 1 con la solución `SIT Solicitudes Internas` (`SIT_SolicitudesInternas`) de los labs 02 a 05. En este módulo ese ambiente es **DEV**.
> - El flujo del [Lab 05](/labs/lab-05-automate-aprobacion) que notifica las solicitudes nuevas (`SIT — Notificar Nueva Solicitud`, o el nombre que le diste), **dentro** de esa solución.
> - Rol System Administrator en DEV. Para la Microlección 3 (data policies) necesitas además poder administrar políticas: en tu tenant de prueba personal ya eres administrador; en un tenant de empresa, pídelo o haz esa parte en papel.
> - Unos 30 minutos más si todavía no tienes la licencia de prueba de Power Apps: para crear un ambiente **Trial** la necesitas (Módulo 1, "Si algo sale distinto").

### 📖 Conceptos Clave
Un mapa rápido; cada pieza se practica en su microlección.

- **Solución administrada (Managed):** el paquete que se importa en TEST, UAT y PROD. Sus componentes no se editan como en DEV: los cambios se hacen en el ambiente de origen, se exporta una versión nueva y se vuelve a importar. Si alguien personaliza en el destino un componente managed que lo permite, ese cambio queda en una **capa unmanaged encima**, que tiene prioridad. Siempre exportar como Managed para TEST/UAT/PROD.
- **Solución no administrada (Unmanaged):** el formato de trabajo en DEV, editable. Peligro: importada en PROD, deja modificar los componentes ahí mismo y los ambientes divergen. Nunca importar soluciones Unmanaged en ambientes de producción.
- **Solution Layers (capas de solución):** varias soluciones pueden modificar el mismo componente. La capa unmanaged siempre está arriba; entre las managed, en general la última instalada queda encima ("gana la última") o se combinan, según el componente. Se ven desde la solución → componente → **Advanced** → **See solution layers** ([Learn: capas de solución](https://learn.microsoft.com/power-apps/maker/data-platform/solution-layers)). Así se personaliza una solución de terceros (como Dynamics 365) sin tocar la base.
- **Connection Reference (referencia de conexión):** componente de solución que apunta a una conexión. Los flujos dentro de una solución las usan automáticamente; al importar, eliges qué conexión real del destino usa cada una. Una misma referencia puede usarse en muchos flujos ([Learn: referencias de conexión](https://learn.microsoft.com/power-apps/maker/data-platform/create-connection-reference)).
- **Environment Variables (variables de entorno):** pares clave-valor que viajan como componente de la solución. Tipos: **Decimal number**, **Text**, **JSON**, **Two options**, **Data source** y **Secret** (Azure Key Vault). El **Current Value** tiene prioridad sobre el **Default Value**. Learn recomienda incluir la **definición** en la solución y dar el **valor** en cada destino al importar ([Learn: variables de entorno](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables)).
- **Managed Properties:** opciones de un componente managed que deciden qué puede personalizar quien lo importa (por ejemplo, si un formulario se puede personalizar). Útiles para ISVs que protegen su trabajo; en soluciones internas suele dejarse más flexibilidad.
- **Dependencias:** Dataverse registra qué componentes dependen de cuáles. Desde la solución, **Show dependencies** muestra dónde se usa un componente; al importar, el asistente lista las dependencias que faltan en el destino. El **solution checker** es otra cosa: revisa problemas de rendimiento y estabilidad, y se puede ejecutar al exportar ([Learn: exportar soluciones](https://learn.microsoft.com/power-apps/maker/data-platform/export-solutions)).
- **Patch:** una corrección pequeña de componentes de una solución, con el mismo número mayor y menor de versión y un número de build o revisión más alto. Con un patch no se pueden quitar componentes, y Learn advierte que no se usen patches unmanaged en producción ([Learn: patches](https://learn.microsoft.com/power-apps/maker/data-platform/create-patches-simplify-solution-updates)).
- **Seguridad del ambiente (Power Platform Admin Center):** quién puede crear y ejecutar recursos, qué conectores se permiten (data policies), capacidad, auditoría y, si el ambiente tiene activado **Managed Environments**, capacidades adicionales de gobierno e información de uso.
- **Data policy (DLP, Data Loss Prevention):** clasifica los conectores en **Business**, **Non-business** y **Blocked**. Un flujo o una app no puede combinar conectores de grupos distintos (Business con Non-business), y los bloqueados no se pueden usar. Algunos conectores no se pueden bloquear (Dataverse, SharePoint, Office 365 Outlook, Teams, entre otros). Se aplica a todo el tenant o a ambientes concretos. Ejemplo: política que pone HTTP genérico en Blocked en PROD para prevenir exfiltración de datos ([Learn: data policies](https://learn.microsoft.com/power-platform/admin/wp-data-loss-prevention)).
- **Security Roles:** permisos por tabla (Create, Read, Write, Delete, Append, Append To, Assign, Share) con un nivel de acceso (User, Business Unit, Parent: Child Business Unit, Organization). Los privilegios de varios roles **se acumulan**: el usuario tiene la suma ([Learn: roles y privilegios](https://learn.microsoft.com/power-platform/admin/security-roles-privileges)). Ya creaste `SIT Solicitante` y `SIT Técnico TI` en el Lab 04.
- **Business Units y Teams:** las unidades de negocio agrupan usuarios y limitan el nivel **Business Unit**. Los equipos (Teams) permiten asignar roles a un grupo: Owner teams (pueden poseer registros), Access teams (acceso puntual compartido) y Microsoft Entra ID group teams (sincronizados con un grupo de Microsoft Entra ID; lo recomendable en organizaciones grandes, porque los miembros se gestionan en Entra).
- **Principio de mínimo privilegio:** cada persona o proceso con solo los permisos que necesita. En Dataverse: no dar System Administrator a usuarios finales, roles por función, seguridad de columna para datos sensibles (Módulo 9) y revisiones periódicas.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Ambientes y soluciones: DEV, TEST y lo que cabe en tu tenant

**¿Qué vas a aprender?** A montar el par DEV → TEST con lo que tu tenant permite y a saber en qué ambiente estás antes de tocar nada.

**¿Por qué existe esto?** La estrategia típica es DEV → TEST → UAT → PROD. En tu tenant de práctica, sin embargo, no puedes crear cuatro ambientes: **Sandbox** y **Production** necesitan al menos 1 GB de capacidad de base de datos disponible, el Trial estándar es uno por usuario y, desde el 15 de noviembre de 2026, también el Developer (administrado) es uno por usuario ([Learn: crear un ambiente](https://learn.microsoft.com/power-platform/admin/create-environment)). Por eso: tu Developer del Módulo 1 es **DEV** y un **Trial** nuevo es **TEST**. UAT y PROD siguen el mismo patrón que TEST; los dejas diseñados.

```
DEV  (Developer, Módulo 1)  ── solución Unmanaged, aquí se edita
 │  export Managed (.zip)
 ▼
TEST (Trial, 30 días)       ── se importa la Managed, aquí NO se edita
 ┆  (mismo patrón, en papel)
UAT  ┄┄►  PROD
```

**Ahora haz algo — micropráctica (5 min):** el error más común antes de cualquier importación es trabajar en el ambiente equivocado → **[Diagnosticar: ¿dónde quedó mi tabla?](/practica/ip-trb-002-entorno-incorrecto)**.

**Práctica real en tu entorno (25 min) — crear SIT-TEST:**

1. [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → **New** ([Learn: ambientes Trial](https://learn.microsoft.com/power-platform/admin/trial-environments)).
2. **Name:** `SIT-TEST`. **Type:** **Trial**. **Region:** la misma de tu DEV. Activa Dataverse (**Add a Dataverse data store** o la pregunta equivalente) como en el Módulo 1. **Next**.
3. **Language:** **English (United States)**, como el ambiente del curso. **Currency:** la de tu DEV. **Security group:** en un Trial es obligatorio; elige el que te ofrezca o **None** si aparece. **Save**.
4. **Qué deberías ver:** `SIT-TEST` en la lista, primero en estado de preparación y, en unos minutos, listo. **Si el Admin Center no te deja elegir Trial** o te pide una licencia, activa la prueba de Power Apps (Módulo 1) o pide un Sandbox a tu administrador. **Si ya tienes un Trial** que usas para otra cosa, úsalo como TEST en vez de crear otro.
5. Abre `SIT-TEST` en el Admin Center y anota su URL y los días que le quedan. **Importante:** el Trial dura 30 días y se puede ampliar una vez otros 30 en su última semana. Guarda el .zip que exportarás en la Microlección 4: si el Trial caduca antes del Lab 19, crearás otro y volverás a importarlo.
6. En [make.powerapps.com](https://make.powerapps.com), abre el selector de ambientes (arriba a la derecha) y comprueba que ves **los dos**. A partir de aquí, **antes de cada paso mira el nombre del ambiente activo**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre y **Type** de tu DEV | ___ |
| Nombre y **Type** de tu TEST | ___ |
| URL del ambiente TEST | ___ |
| Días que le quedan al Trial / fecha de fin | ___ |
| Qué harías distinto en una empresa con capacidad (tipo de cada ambiente: DEV, TEST, UAT, PROD) | ___ |

---

## 🧩 Microlección 2 — Variables de entorno y referencias de conexión

**¿Qué vas a aprender?** A sacar de tu flujo todo lo que cambia entre ambientes, para que la misma solución funcione en DEV y en TEST sin editarla.

**¿Por qué existe esto?** Tu flujo del Lab 05 envía el correo a una dirección escrita a mano y usa las conexiones de tu usuario. En TEST, esa dirección no es la correcta y tus conexiones no existen. Las **referencias de conexión** resuelven lo segundo (al importar eliges la conexión del destino); las **variables de entorno**, lo primero.

**Ahora haz algo — micropráctica (7 min):** decide qué parametrizar y qué no → **[Qué parametrizar antes de mover la solución](/practica/ip-dv-015-parametrizar-antes-de-mover)**.

**Práctica real en DEV (30 min):**

1. **Comprueba el ambiente activo: DEV.** Abre la solución `SIT Solicitudes Internas`. En la lista de objetos, filtra o busca **Connection references**. **Qué deberías ver:** una por cada conector que usan tus flujos del Lab 05 (al menos Microsoft Dataverse y Office 365 Outlook; si hiciste las otras partes del lab, también Microsoft Teams o Approvals), creadas solas al hacer los flujos dentro de la solución. Anota su **Display name** y su conector. **Si no ves ninguna**, tu flujo se creó fuera de la solución: agrégalo con **Add existing** y revisa de nuevo; si sigue sin referencias, Learn explica cómo crearlas con **New** → **More** → **Connection Reference** ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/create-connection-reference)).
2. **Crea la variable de entorno:** en la solución, **New** → **More** → **Environment variable** ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables)).
   - **Display name:** `Correo Equipo TI`. El **Name** se genera solo con tu prefijo; anótalo.
   - **Data Type:** **Text**.
   - **Default Value:** déjalo **vacío**.
   - **Current Value:** tu correo (el mismo al que hoy llega la notificación).
   - **Save**.
3. **Úsala en el flujo:** abre el flujo desde la solución → **Edit**. En la acción de enviar el correo, borra la dirección escrita en **To** y, desde **Dynamic content**, elige `Correo Equipo TI` (las variables de entorno aparecen ahí en los flujos de una solución, sin acción especial ([Learn: variables en Power Automate](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables-power-automate))). **Save**.
4. **Prueba:** crea una solicitud nueva en DEV y comprueba que llega el correo. En el historial de ejecuciones, abre la ejecución y mira el valor que recibió **To**.
5. **Prepara la exportación:** abre la variable en la solución y, en **Current Value**, elige **...** → **Remove from this solution**. Learn: el valor **sigue en DEV**, pero no se exporta, y así la importación te pedirá uno nuevo. Comprueba que el flujo sigue funcionando en DEV con otra solicitud de prueba.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Connection references de la solución (Display name → conector) | ___ |
| **Name** generado de la variable `Correo Equipo TI` | ___ |
| Valor que recibió **To** en la ejecución de prueba | ___ |
| Después de "Remove from this solution", ¿el flujo de DEV siguió enviando el correo? | ___ |

> **Si el correo de la ejecución no cambia de inmediato** al modificar el valor de una variable: Learn indica que un flujo puede seguir usando el valor anterior hasta que lo guardas o lo apagas y enciendes, y que propagar un valor nuevo puede tardar hasta una hora.

---

## 🧩 Microlección 3 — Seguridad de la plataforma: mínimo privilegio y data policies

**¿Qué vas a aprender?** A revisar un rol con el criterio de mínimo privilegio y a impedir que un ambiente use un conector peligroso.

**¿Por qué existe esto?** En el Lab 04 creaste roles para que cada persona hiciera su trabajo. Ahora miras la plataforma desde el administrador: los privilegios de varios roles **se suman** (dar un rol "de lectura" a quien ya tiene uno de escritura no le quita nada), y un flujo puede sacar datos corporativos por un conector externo si nada lo impide. Lo segundo lo controla una **data policy**.

**Repaso de roles en 3 minutos (sin tenant):** en el Lab 04 el rol `SIT Solicitante` tiene Read = **Business Unit** y Write = **User** sobre Solicitud TI. Responde por escrito: (a) si una persona tiene `SIT Solicitante` y además `SIT Técnico TI`, ¿qué solicitudes puede editar?; (b) si tu ambiente tuviera dos unidades de negocio (Bogotá y Lima), ¿qué vería un solicitante de Lima?

**Práctica real (20 min) — una data policy solo para SIT-TEST:**

> **Ojo con el alcance:** aplica la política **solo** a `SIT-TEST`. Si la aplicas a todo el tenant puedes romper flujos de tu DEV que se usan en otros módulos. Learn advierte, además, que los child flows dependen de cómo se clasifica el conector HTTP ([Learn: clasificación de conectores](https://learn.microsoft.com/power-platform/admin/dlp-connector-classification)).

1. Power Platform Admin Center → **Security** → **Data and privacy** → **Data policy** → **+ New Policy** ([Learn: crear una data policy](https://learn.microsoft.com/power-platform/admin/prevent-data-loss)).
2. **Name:** `Política TEST SIT` → **Next**.
3. **Prebuilt connectors:** selecciona **todos los conectores que usan tus flujos** (los de la evidencia de la Microlección 2: Microsoft Dataverse, Office 365 Outlook y, si los usas, Microsoft Teams y Approvals) y **Move to Business**. Así tus flujos no combinan grupos distintos cuando los importes en TEST. Busca **HTTP**, selecciónalo y bloquéalo (**Block**). **Qué deberías ver:** tus conectores en **Business** y HTTP en **Blocked**. Si pruebas a bloquear Dataverse u Office 365 Outlook y no te deja, es lo esperado: son conectores que no se pueden bloquear. → **Next**.
4. **Custom connectors:** deja lo que viene → **Next**.
5. **Scope:** elige la opción que aplica la política solo a los ambientes que agregues (no a todo el tenant). En **Environments**, selecciona `SIT-TEST` → **Add to policy** → **Next**.
6. Revisa el resumen y **Create policy**. Anota la hora.
7. **Prueba:** cambia el ambiente activo a **SIT-TEST**. En Power Automate, crea un flujo de prueba instantáneo (**Instant cloud flow**, con **Manually trigger a flow**) fuera de cualquier solución, agrega una acción **HTTP** con cualquier URL de ejemplo e intenta guardarlo. **Qué deberías ver:** un error que menciona la data policy y no deja guardar. **Si te deja guardar**, la política aún no se ha aplicado: Learn indica que suele tardar menos de una hora y puede llegar a 24 horas. Vuelve a intentarlo más tarde. Al terminar, borra el flujo de prueba.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus respuestas (a) y (b) del repaso de roles | ___ |
| Conectores en Business y en Blocked de `Política TEST SIT` | ___ |
| Texto exacto del error al guardar el flujo con HTTP en SIT-TEST | ___ |
| Cuánto tardó la política en aplicarse (hora de creación → hora del bloqueo) | ___ |

---

## 🧩 Microlección 4 — Exportar como Managed e importar en TEST

**¿Qué vas a aprender?** A llevar tu solución de DEV a TEST con el asistente de importación y a comprobar qué quedó en el destino.

**¿Por qué existe esto?** Es el momento en que aparecen todos los fallos de ALM: dependencias que faltan, conexiones sin configurar, valores de DEV que viajaron sin querer. Antes de hacerlo, diagnostica uno de esos fallos a partir del síntoma.

**Diagnosticar antes de construir — micropráctica (6 min):** **[En TEST el flujo sigue enviando correos al buzón de DEV](/practica/ip-trb-008-variable-con-valor-de-dev)**. Lee el síntoma y di la causa antes de abrir las pistas.

**Práctica real (35 min):**

1. **Exportar desde DEV** (comprueba el ambiente activo): **Solutions** → selecciona `SIT Solicitudes Internas` → **Export** ([Learn: exportar](https://learn.microsoft.com/power-apps/maker/data-platform/export-solutions)).
   - En **Before you export**, publica los cambios (**Publish**) → **Next**.
   - **Version number:** `1.0.1.0`. **Export as:** **Managed**. Si quieres, marca **Run solution checker on export**.
   - **Export**. Cuando termine, descarga el .zip desde el aviso de la parte superior y guárdalo en una carpeta tuya (lo necesitarás si el Trial caduca).
2. **Importar en SIT-TEST:** cambia el ambiente activo a **SIT-TEST** → **Solutions** → **Import solution** → **Browse** → elige el .zip → **Next** ([Learn: importar](https://learn.microsoft.com/power-apps/maker/data-platform/import-update-export-solutions)).
3. **Connection references:** el asistente muestra cada referencia; para cada una, elige una conexión de SIT-TEST o crea una nueva con tu cuenta. **Next**.
4. **Environment variables:** como quitaste el valor en la Microlección 2, el asistente te pide uno para `Correo Equipo TI`. Escribe el correo que usará TEST (puede ser el tuyo con un alias o una segunda dirección; anota cuál). **Import**.
5. **Qué deberías ver:** un aviso de importación en curso y, al terminar, `SIT Solicitudes Internas` en la lista de SIT-TEST marcada como **Managed**. **Si falla**, descarga el log (**Download Log File**) y busca el primer error: lo habitual es una dependencia que falta (un componente de otra solución que tu solución usa). Anótalo y revisa la tabla de Errores Comunes.
6. **Comprueba en TEST:**
   - Abre el flujo desde la solución: ¿está encendido? Si quedó apagado, enciéndelo (**Turn on**).
   - **Las soluciones llevan la estructura, no los datos:** en SIT-TEST las tablas están vacías. Crea primero una **Categoría** (el Lookup es obligatorio) y después una solicitud, desde el editor de filas de cada tabla. Mira a qué dirección llega el correo.
   - Abre la tabla **Solicitud TI** en la solución → **Advanced** → **See solution layers**. Anota las capas que ves.
   - Para ver el valor de la variable en TEST tienes que mirar en la **Default solution**: en una solución managed el valor es una personalización unmanaged y no se muestra.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Versión y tipo con que aparece la solución en SIT-TEST | ___ |
| Conexión que elegiste para cada referencia | ___ |
| Valor que diste a `Correo Equipo TI` en TEST | ___ |
| Dirección a la que llegó el correo de la solicitud de TEST | ___ |
| Capas de **See solution layers** para Solicitud TI (nombres, en orden) | ___ |
| Primer error del log, si la importación falló | ___ |

> **No edites nada en TEST.** Si algo está mal, corrígelo en DEV y exporta una versión nueva: es exactamente el reto de construcción que sigue.

---

### 🏗️ Reto de construcción (sin pasos, tenant real) — tu primera actualización

> **Requerimiento:** el equipo de soporte pide una columna nueva `Canal` (Choice: Correo, Teléfono, Portal) en **Solicitud TI**. Llévala a TEST como versión `1.0.2.0`.
> **Criterios de aceptación:** (1) la columna se crea en DEV, dentro de la solución; (2) TEST recibe la versión 1.0.2.0 como **Managed**; (3) después de importar, la columna existe en TEST y el valor de `Correo Equipo TI` en TEST **no** volvió al de DEV.
> **Restricciones:** prohibido crear o editar nada directamente en TEST. Antes de importar, decide qué opción del asistente usar (Learn distingue *upgrade* de *update*) y anota por qué.

Si te atoras, vuelve a los pasos de la Microlección 4: el patrón es el mismo, solo cambia la versión.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Versión que muestra SIT-TEST después de importar | ___ |
| Opción de importación que usaste y por qué | ___ |
| Valor de `Correo Equipo TI` en TEST antes y después de importar | ___ |
| ¿El asistente te pidió de nuevo el valor de la variable? ¿Por qué crees que sí o no? | ___ |

---

## 🔁 Reto de transferencia — Entregar la solución a una red de clínicas

Cambia el cliente y comprueba si entendiste el patrón. Una red de clínicas con 3 sedes compra tu solución de citas: cada gerente de sede ve solo las citas de su sede y la dirección ve todas; cada cliente usa un endpoint distinto de su sistema de facturación; seguridad prohíbe combinar datos de pacientes con cuentas personales de Gmail; y habrá correcciones urgentes en producción.

1. **Micropráctica (9 min):** **[Transferir: entregar la solución a una red de clínicas](/practica/ip-dv-016-transferir-cliente-clinica)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel** (sin construirlo): escribe el plan de ambientes (tipo de cada uno), los roles con sus niveles de acceso, las variables de entorno y la data policy. Para la corrección urgente, describe el camino completo desde que llega el ticket hasta que PROD tiene el arreglo.

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobarías que funciona |
|---|---|---|
| Gerente ve solo su sede; dirección ve todo | ___ | ___ |
| Endpoint distinto por cliente | ___ | ___ |
| Datos de pacientes nunca con Gmail | ___ | ___ |
| Corrección urgente en producción | ___ | ___ |

### 💼 Caso Real de Negocio
**Empresa:** Firma de consultoría que vende soluciones Power Platform a clientes  
**Problema:** Cuando exportaban soluciones, los flujos fallaban en el cliente porque tenían la URL y credenciales del entorno de desarrollo hardcodeadas.  
**Solución:** Todas las URLs y emails movidos a Environment Variables. Todas las conexiones convertidas a Connection References. El wizard de importación guía al cliente para configurar sus propias credenciales. DLP policy estándar entregada como parte de la implementación.  
**Resultado:** Tiempo de implementación en nuevo cliente de 3 días a 4 horas. Cero tickets de "el flujo falla" por credenciales incorrectas.

### ✅ Buenas Prácticas
- Exportar siempre en modo Managed para TEST/UAT/PROD; nunca exportar Unmanaged a producción
- Versionar semánticamente: breaking changes = mayor, features = menor, fixes = patch
- Nunca editar componentes directamente en PROD — siempre DEV → solución → importar
- Connection References: una por tipo de servicio, no una por flujo
- DLP Policy: siempre bloquear HTTP genérico en producción si no es necesario
- Documentar los valores de Environment Variables de cada ambiente en un archivo seguro (no en el repo)
- Incluir en la solución la **definición** de cada variable de entorno, no su **Current Value**: quítalo con **Remove from this solution** antes de exportar
- Antes de cada importación, mirar el nombre del ambiente activo; antes de cada data policy, revisar su alcance
- Probar los permisos con una cuenta de prueba, nunca quitándote a ti el rol System Administrator

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| La importación falla por dependencias que faltan | Un componente que usa tu solución no está en ella ni en el destino | Revisa la lista del asistente o el log (**Download Log File**); usa **Show dependencies** en DEV y agrega el componente a la solución o importa antes la solución que lo contiene |
| El flujo falla en TEST/PROD con "Invalid connection" | La referencia de conexión apunta a una conexión que no existe o no es válida en el destino | En la solución del destino, abre la referencia de conexión y elige o crea una conexión válida |
| La variable de entorno no tiene valor en el destino | No había valor ni predeterminado y no se completó al importar | Pon el valor actual en el destino (desde la **Default solution** si la solución es managed) |
| En TEST el flujo usa el valor de DEV | El **Current Value** de DEV viajó dentro de la solución | Corrige el valor en TEST y, en DEV, quítalo de la solución antes de la próxima exportación |
| No se puede guardar un flujo: viola una data policy | Combina conectores de grupos distintos o usa uno bloqueado | Revisa la política del ambiente; cambia el conector o pide al administrador que reclasifique |
| Solución managed no deja editar | Es el comportamiento correcto | Modificar en DEV y volver a importar como nueva versión |

### 🧪 Criterios de Validación
- [ ] Tengo DEV y TEST (con su tipo anotado) y sé por qué UAT y PROD quedan en papel en mi tenant de práctica.
- [ ] Mi flujo usa la variable de entorno `Correo Equipo TI` desde **Dynamic content** y anoté sus referencias de conexión.
- [ ] Quité el **Current Value** de la solución antes de exportar y sé explicar por qué.
- [ ] Respondí el repaso de roles (privilegios acumulados y unidades de negocio).
- [ ] Mi data policy aplica solo a SIT-TEST y anoté el error exacto al intentar guardar un flujo con HTTP.
- [ ] La solución está importada en SIT-TEST como **Managed**, con conexiones del destino y un valor propio de la variable.
- [ ] Anoté las capas de **See solution layers** de Solicitud TI en TEST.
- [ ] Llevé la versión 1.0.2.0 a TEST sin editar nada en TEST y comprobé que el valor de la variable en TEST se mantuvo.
- [ ] En el reto de transferencia propuse ambientes, roles, variables y data policy, y el camino de una corrección urgente.

### 📸 Evidencia para guardar
- Las tablas de evidencia de las cuatro microlecciones, del reto de construcción y del reto de transferencia.
- Capturas: la lista de ambientes con DEV y TEST, la variable de entorno en la solución, el error de la data policy y la solución managed en SIT-TEST.
- El .zip de la versión 1.0.2.0, guardado fuera del Trial.

> **Siguiente paso:** el [Lab 19](/labs/lab-19-cicd-azure-devops) (Nivel Avanzado) automatiza este mismo recorrido DEV → TEST con un pipeline y aprobaciones.

---

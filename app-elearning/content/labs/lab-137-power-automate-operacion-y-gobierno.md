---
id: lab-137
title: "Operación y gobierno: historial, alertas, propietarios, límites y directivas de datos (Ruta Pro Power Automate)"
level: "N2"
duration: 210
product: ["Power Automate", "Dataverse", "Power Platform admin center"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional", "Administrador Power Platform"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado"
  - "Lab 133 (errores, reintentos e idempotencia): usas su flujo de laboratorio de errores"
  - "Lab 135 recomendado: los ejercicios 4 a 7 usan SC - Conciliar factura y SC - Conciliar lote (si no los tienes, usa tus flujos)"
  - "Lab 136 recomendado (solución y referencias de conexión)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 137 — Operación y gobierno

## Objetivo

Operar los flujos **después** de publicarlos: leer el **historial de ejecuciones** y reenviar lo que falló, **medir** el éxito de un flujo, construir tu propio **aviso de fallos** (porque el de la plataforma no basta), decidir **quién es el propietario** de un flujo para que sobreviva a las personas, conocer los **límites** que lo pueden apagar y entender cómo una **directiva de datos** puede suspenderlo.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). Los flujos de Compras ya están en producción. Un lunes, Finanzas pregunta: "¿Se enviaron las solicitudes de la semana pasada?" Nadie lo sabe: los flujos los creó una persona que cambió de área, nadie revisa el historial y los correos de fallo de la plataforma llegan a una bandeja que no se lee. Tu trabajo es que esa pregunta se conteste en dos minutos.

## Lo que vas a construir

- Un recorrido por el **historial** y **Analytics** de un flujo con fallos (el laboratorio del Lab 133)
- Un flujo `SC - Monitor de fallos` programado que lee la tabla de ejecuciones y te envía un resumen diario
- Una **decisión de propietarios** para los flujos de SIT (personas, copropietarios y cuenta de servicio)
- Una hoja de **límites** de la plataforma aplicada a tus flujos
- Un análisis en papel de una **directiva de datos** que bloquea un conector, y una prueba de **Copilot** en el diseñador

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| Try / Catch dentro de un flujo (Lab 133) | Vigilar **todos** los flujos desde fuera | Lab 139 (reto) |
| Referencias de conexión (Lab 136) | De quién son las conexiones y qué pasa si esa persona se va | — |
| Concurrencia y paginación (Labs 130 a 134) | Límites que no puedes cambiar | Lab 138 (rendimiento) |

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Historial y reenvío | 30 min |
| Ejercicio 2 — Analytics y la tabla de ejecuciones | 35 min |
| Ejercicio 3 — Tu propio monitor de fallos | 55 min |
| Ejercicio 4 — Propietarios | 25 min |
| Ejercicio 5 — Límites de la plataforma | 25 min |
| Ejercicio 6 — Directivas de datos, en papel | 20 min |
| Ejercicio 7 — Copilot en el diseñador | 20 min |
| **Total** | **unas 3 h 30 min** |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: historial de ejecuciones, **Analytics**, **Flow checker**, **Share**, **Run only users**, **Copilot**
- Dataverse: tabla de ejecuciones de flujos (`flowrun`), **List rows**, **Filter rows**
- Expresiones: `utcNow`, `addDays`, `formatDateTime`, `length`, `div`, `mul`
- Power Platform admin center (solo lectura si tu cuenta tiene acceso)

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con `SC - Laboratorio de errores` (Lab 133) **y varias ejecuciones fallidas** en el último día. Si ya lo apagaste, enciéndelo, lánzalo con tres valores de `Fallo` y vuelve a apagarlo
- [ ] Ejecuciones con éxito de otros flujos del curso (los Labs 128 y 129 bastan)
- [ ] Para el Ejercicio 7: el diseñador **nuevo** de flujos y Copilot disponible en tu ambiente (si no lo ves, haz el ejercicio como lectura)

### Verificación rápida antes de empezar

- [ ] Abre el flujo del laboratorio de errores y baja a **28-day run history** (**Historial de ejecuciones de 28 días**): debe haber ejecuciones **Failed**
- [ ] Anota cuántas ves en total y cuántas fallidas: las vas a comparar con **Analytics** y con la tabla de ejecuciones

---

## Ejercicio 1 — Historial y reenvío

**Objetivo:** encontrar qué falló, cuándo y por qué, y repetirlo con seguridad.

1. Abre el flujo y, en **28-day run history**, entra en **All runs**. Con **Edit columns** (**Editar columnas**) añade una columna con una salida del desencadenador (por ejemplo, `Fallo`). Por defecto verás **Start**, **Duration** y **Status** ([Learn: corregir fallos de flujos](https://learn.microsoft.com/power-automate/fix-flow-failures)).
2. Abre una ejecución fallida: localiza la acción roja y lee el error.
3. **Resubmit** (**Volver a enviar**) una ejecución fallida y mira el resultado. Learn permite reenviar o cancelar **hasta 20 ejecuciones a la vez** desde la lista y cancelar en bloque las que están **Running** o **Waiting** ([Learn: reenvío en lote](https://learn.microsoft.com/power-automate/how-tos-bulk-resubmit)).

> **Comprobado en Learn (2026-11-21):** un usuario siempre puede reenviar **sus propias** ejecuciones de un desencadenador instantáneo; para reenviar las de **otros usuarios** hay que activar un ajuste del administrador (**Power Automate flow run resubmission**). Cancelar ejecuciones puede tardar **hasta 24 horas** en completarse.

> **El número de días no es el mismo en todas las páginas de Learn:** la interfaz dice **28 días** y la tabla de límites dice **30** de retención de ejecuciones. Para el lab, trabaja con los **28 de la interfaz** y anótalo en tu hoja. **Comprobado en un tenant real (2026-11-21):** cada fila de la tabla de ejecuciones guarda `ttlinseconds` = **2.419.200**, que son exactamente 28 días.

> **Reenviar no es gratis:** repite los efectos de la ejecución (Lab 133, Ejercicio 6). Antes de reenviar, pregúntate si el flujo es idempotente.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Ejecuciones totales / fallidas en el historial | ___ / ___ |
| Acción y error de la última ejecución fallida | ___ |
| ¿Es seguro reenviarla? Por qué | ___ |

---

## Ejercicio 2 — Analytics y la tabla de ejecuciones

**Objetivo:** medir el éxito de un flujo con datos, no con intuición.

1. En la página de detalles del flujo, abre **Analytics**. Learn dice que muestra el número de ejecuciones, las tasas de éxito y de fallo, el tiempo medio y los errores, y que **se actualiza cada ~24 horas** ([Learn: monitoreo y alertas](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/monitoring-and-alerting)). Si tus ejecuciones son de hoy, es posible que **todavía no salgan**: es la razón del paso 2.
2. Copia el **identificador del flujo** del laboratorio de errores: está en la dirección de su página de detalles (`.../flows/<GUID>/details`).
3. En un flujo nuevo instantáneo `SC - Tabla de ejecuciones`, añade **Dataverse** > **List rows** sobre la tabla de ejecuciones de flujos (`flowrun`; en el selector puede llamarse **Flow Runs** o **Ejecuciones de flujo**; si no aparece, elige **Enter custom value** y escribe `flowruns`). **Select columns** `name,status,starttime,endtime,errorcode,errormessage,duration`. **Filter rows** `status eq 'Failed' and _workflow_value eq <GUID>` (sin comillas alrededor del GUID; la tabla trae las ejecuciones de **todos** los flujos de solución del ambiente, por eso se filtra por el flujo).
4. Añade una **Compose** `Fallidas` con `length(outputs('List_rows')?['body/value'])`. Ejecuta.

### Resultado esperado del Ejercicio 2

**Comprobado en un tenant real (2026-11-21):** la tabla se puede consultar por la API de Dataverse; cada fila tiene `status` (`Succeeded`, `Failed`…), `starttime`, `endtime`, `duration` (en **milisegundos**), `errorcode` (por ejemplo `Terminated` para un **Terminate** con error) y `errormessage` con el texto del error. `Fallidas` debe coincidir con las fallidas **de ese flujo** que contaste en la verificación inicial (si el flujo está **en una solución**: la tabla es la de Dataverse). Las ejecuciones **recientes** pueden tardar unos minutos en aparecer en la tabla: espera antes de contar. La tabla solo existe si tu ambiente guarda el historial en Dataverse; si no ves la tabla, anótalo y sigue con el historial.

> **Qué no sale en la tabla:** los flujos de **Mis flujos** que no están en una solución. Learn dice además que los informes de analytics del **administrador** no incluyen los flujos de solución. Cada herramienta ve una parte: por eso se compara.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Tasa de éxito de tu flujo de laboratorio (éxitos ÷ total) | ___ % |
| `Fallidas` según la tabla | ___ |
| ¿Coincide con el historial? Si no, por qué | ___ |

---

## Ejercicio 3 — Tu propio monitor de fallos

**Objetivo:** enterarte del fallo **sin** abrir el historial.

**Primero, lo que ya hace la plataforma, y sus límites.** Learn describe dos correos: una **alerta por ejecución** (solo cuando la causa es conocida y tiene arreglo: conexión rota, límite de solicitudes…, con un **enfriamiento de 28 días** por flujo) y un **resumen semanal** de fallos. Van al propietario y a los copropietarios, **no** a los administradores ([Learn: avisos de fallo](https://learn.microsoft.com/power-automate/understand-flow-failure-notifications)). La alerta por ejecución no se activa por defecto en todos los flujos. Un error de **tu** lógica (un `Terminate`, una división por cero) **no es** de causa conocida: no genera alerta.

**Ahora el tuyo:**

1. Flujo programado `SC - Monitor de fallos`: **Recurrence** cada **1 día** (en **Advanced options**, **At these hours** `8` y **At these minutes** `0`; recuerda la zona horaria del Lab 129).
2. **List rows** sobre la tabla de ejecuciones: **Select columns** `name,status,starttime,errorcode,errormessage,_workflow_value`; **Filter rows** (con **fx**):

```text
concat('status eq ''Failed'' and starttime ge ', formatDateTime(addDays(utcNow(), -1), 'yyyy-MM-ddTHH:mm:ssZ'))
```

3. **Condition**: `length(outputs('List_rows')?['body/value'])` mayor que `0`. En **True**:
   - **Select** con `Ejecución` = `item()?['name']`, `Cuándo` = `item()?['starttime']`, `Código` = `item()?['errorcode']`, `Mensaje` = `item()?['errormessage']`, `Flujo` = `item()?['_workflow_value']`. (Comprobado: con un **Terminate** del Lab 133, `errorcode` es `Terminated` y el código que tú elegiste, como `FALLO_CAPTURADO`, viaja dentro de `errormessage`.)
   - **Create HTML table** (**From** = la salida del **Select**) y **Send an email (V2)** a ti, con asunto `Fallos de flujos: ` y la cantidad.
4. Ejecuta con **Test** y comprueba el correo.
5. **Para que no dependa de ti:** el destinatario debe ser un **grupo o buzón compartido** (o una variable de entorno, Lab 136), y el flujo debe tener un **segundo propietario** (Ejercicio 4).

### Resultado esperado del Ejercicio 3

**Comprobado en un tenant real:** el filtro de fecha funciona con ese formato y el filtro por `status` devuelve solo las fallidas del último día (en la prueba, 5 de 5 fallidas del día). **Ojo con el alcance:** este monitor lista las fallidas de **todos** los flujos de solución del ambiente en el último día, no solo las del flujo del laboratorio. Para contrastarlo, filtra el historial de **cada** flujo, o añade temporalmente `and _workflow_value eq <GUID>` al filtro y compara con el historial de ese flujo.

> **Lo que no funciona:** `$expand=workflow($select=name)` falla en esta tabla ("no se encuentra la propiedad `workflow`"). El nombre del flujo no viene en la fila: solo su identificador (`_workflow_value`). Para ver el nombre, haz un segundo **List rows** sobre la tabla de flujos (Reto intermedio).

> **Este monitor tampoco es perfecto:** si el propio `SC - Monitor de fallos` falla, nadie se entera. Quién vigila al vigilante es una pregunta de diseño (Pregunta de repaso 4).

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Fallos listados en tu correo | ___ |
| Por qué un error de tu lógica no genera la alerta nativa | ___ |
| Por qué no usas `$expand` para el nombre del flujo | ___ |

---

## Ejercicio 4 — Propietarios

**Objetivo:** que ningún flujo dependa de una sola persona.

**Comprobado en Learn (2026-11-21):**

| Concepto | Qué dice Learn |
|---|---|
| **Copropietarios** | Se agregan con **Share**: un usuario, un **grupo** o una lista de SharePoint. Pueden ver el historial, editar y quitar propietarios (no al creador). No pueden cambiar las credenciales de una conexión creada por otro ([Learn: compartir flujos](https://learn.microsoft.com/power-automate/create-team-flows)) |
| **Run only users** | Solo en flujos **instantáneos**: el usuario solo puede dispararlo; el propietario decide qué conexiones usa |
| **Cambiar de propietario** | Solo en flujos **de solución**: **Details** > **Edit** > **Primary owner**. El anterior y el nuevo quedan como copropietarios ([Learn: cambiar de propietario](https://learn.microsoft.com/power-automate/change-cloud-flow-owner)) |
| **Cuenta de servicio** | Aquí hay **dos cosas distintas**: una **cuenta de usuario** sin persona detrás normalmente sí tiene licencia; un **service principal** (usuario de aplicación) **no** tiene licencia. Lo que dice Learn (puede ser **propietaria** de un flujo de solución, **no copropietaria**, hay que compartirle las conexiones y usa el grupo de solicitudes sin licencia) es del **service principal** |
| **El creador se va** | Con otro propietario activo, el flujo **sigue**, pero las acciones con **sus** conexiones pueden fallar. Sin propietario activo, un administrador debe añadir uno. **Learn no da un plazo** ni dice que el flujo se apague al deshabilitar la cuenta |

Responde por escrito para los flujos de SIT:

1. ¿Quién es hoy el propietario de cada flujo de `SIT Compras` y cuántos copropietarios tiene?
2. Propón un **modelo**: qué flujos deben ser de una cuenta de servicio y cuáles de un equipo (con un **grupo** como copropietario).
3. `SC - Conciliar factura` (camino A del Lab 135) usa **tu** conexión de Outlook en el desencadenador. Si te vas mañana, ¿qué falla y cuándo te enteras? (Pista: si se rompe la conexión del desencadenador no se crea **ninguna ejecución**, así que tu monitor de fallos no la ve: ¿qué otra señal usarías?)

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Flujos con un solo propietario | ___ |
| Modelo propuesto (una frase por tipo de flujo) | ___ |
| Qué falla si te vas, y cómo lo detectaría tu monitor | ___ |

---

## Ejercicio 5 — Límites de la plataforma

**Objetivo:** saber qué se puede romper por volumen, antes de que ocurra.

**Comprobado en Learn (2026-11-21; la página de límites se actualizó el 2026-11-10):** ([Learn: límites y configuración](https://learn.microsoft.com/power-automate/limits-and-config))

| Límite | Valor |
|---|---|
| Duración de una ejecución | **30 días** (después, los pasos pendientes, como una aprobación, vencen) |
| Acciones por flujo | 500 |
| Anidamiento | 8 niveles |
| Variables por flujo | 250 |
| **Apply to each**, elementos | 5.000 (perfil **Low**) / 100.000 (resto); concurrencia por defecto 1, de 1 a 50 |
| **Until**, iteraciones | 60 por defecto, máximo 5.000 |
| Mensajes | 100 MB (1 GB con chunking) |
| **Todas las licencias de prueba** | Perfil **Low** |
| Apagado por **inactividad** | Un flujo sin activaciones en **90 días** puede apagarse; se avisa 30 días antes; quedan fuera los dueños con licencia premium o de capacidad |
| Apagado por **errores continuos** o por límites constantes | A los **14 días** |

Solicitudes por 24 horas (según [Learn: límites de solicitudes](https://learn.microsoft.com/power-platform/admin/api-request-limits-allocations), con la **transición** vigente: el límite se aplica **por flujo**). Cuál de estas cifras te toca depende de la **licencia del propietario** del flujo (una prueba cae en el perfil **Low** y su límite de solicitudes depende de la licencia que tenga): míralo en tu cuenta y no lo des por hecho: Premium 40.000 por usuario / 200.000 por flujo; Free y Office 365 6.000 / 10.000; **100.000 solicitudes cada 5 minutos**, sea cual sea la licencia. Una **cuenta de servicio** sin licencia usa el grupo de 25.000 por 24 h del tenant.

**Aplícalo.** Para cada flujo de SIT, anota:

1. ¿Cuántas acciones tiene y cuánto le falta para las 500?
2. ¿Qué **Apply to each** podría superar los 5.000 elementos con perfil **Low**? (Pista: el catálogo del Lab 134 tiene 41; ¿y una tabla de facturas de un año?)
3. ¿Cuántas solicitudes (acciones) consume **la primera** ejecución de `SC - Conciliar lote` con 14 facturas? Fórmula: acciones fuera del bucle + (acciones que se ejecutan en una vuelta × 14). Abre **una** vuelta del **Apply to each** en el historial, cuenta sus acciones ejecutadas y calcula; tu número depende de tu diseño (cuántas **Compose** pusiste). Learn indica que cada acción cuenta como una solicitud; la segunda corrida gasta menos porque los duplicados no escriben.
4. Un flujo de práctica que no se dispara nunca: ¿se apagaría por inactividad si tu licencia no es premium?

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Acciones ejecutadas por `SC - Conciliar lote` con 14 facturas | ___ |
| Flujo de SIT más cerca de un límite | ___ |
| Flujos que se apagarían por inactividad | ___ |

---

## Ejercicio 6 — Directivas de datos, en papel

**Objetivo:** prever qué pasa cuando el administrador bloquea un conector.

**Sin ejecutar en el tenant:** crear o cambiar una directiva exige permisos de administrador y afecta a la organización. Este ejercicio se resuelve por escrito con la documentación.

**Comprobado en Learn (2026-11-21):** ([Learn: clasificación de conectores](https://learn.microsoft.com/power-platform/admin/dlp-connector-classification))

- Una directiva tiene tres grupos: **Business**, **Non-Business** y **Blocked**. Los conectores de grupos distintos **no se pueden combinar** en el mismo flujo.
- En una directiva nueva, todos los conectores empiezan en **Non-Business**.
- **HTTP**, **HTTP Webhook** y **When an HTTP request is received** se clasifican como cualquier otro conector, y los **flujos secundarios** dependen del conector HTTP por dentro.
- Hay una lista concreta de conectores que **no se pueden bloquear** (el núcleo de la plataforma, como Dataverse y Approvals, y algunos conectores estándar de Microsoft, como SharePoint, Office 365 Outlook o Teams); solo se pueden clasificar. No generalices a todos los estándar.
- Al **guardar** un flujo que viola la directiva, se rechaza en el diseñador. Los flujos **ya activos** que la violan los **suspende** un proceso de fondo (suele tardar menos de 1 hora y hasta 24 h), y aparecen como `Suspended` con motivo `CompanyDlpViolation` ([Learn: prevenir la pérdida de datos](https://learn.microsoft.com/power-automate/prevent-data-loss)).

**Caso:** el administrador de SIT pone **HTTP** en **Blocked** para todos los ambientes.

1. ¿Qué flujos del curso se suspenden? (Pista: los que usan la acción **HTTP**: `SC - Sincronizar catálogo` del Lab 134, el flujo de errores del Lab 133 con la llamada HTTP y, si los hiciste, los flujos secundarios del Lab 136. El webhook de **When an HTTP request is received** se clasifica aparte: justifícalo según Learn.)
2. ¿Cómo te enteras? ¿Lo detectaría tu `SC - Monitor de fallos`? (Pista: una ejecución suspendida no genera una ejecución fallida.)
3. Propón una alternativa: ¿un **conector personalizado** del Módulo 14 evita el bloqueo? Explica qué haría falta pedir al administrador.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Flujos que se suspenden | ___ |
| Cómo te enteras | ___ |
| Alternativa propuesta | ___ |

---

## Ejercicio 7 — Copilot en el diseñador

**Objetivo:** usar Copilot para crear y entender flujos, y saber hasta dónde fiarte.

**Comprobado en Learn (2026-11-21):** desde **Home**, **Create with Copilot** permite describir el flujo en lenguaje natural ("¿Qué hará tu flujo?"); dentro del diseñador **nuevo**, Copilot edita el flujo y responde "¿Qué hace mi flujo?". Learn lo describe como **optimizado para inglés, con soporte limitado en otros idiomas** ([Learn: crear con Copilot](https://learn.microsoft.com/power-automate/create-cloud-flow-using-copilot)). Para errores, el diseñador nuevo ofrece **Troubleshoot in Copilot** ([Learn: corregir fallos](https://learn.microsoft.com/power-automate/fix-flow-failures)). Learn no detalla aquí la disponibilidad por región ni la licencia: comprueba tu ambiente.

1. Pídele (en inglés): `When a new row is added to Purchase Request in Dataverse, send an email to me with the amount.` Mira qué construyó y **corrige lo que esté mal**.
2. Abre `SC - Conciliar factura` y pregúntale qué hace. Compara su resumen con tu diseño: ¿omite alguna regla?
3. Abre una ejecución fallida y usa **Troubleshoot in Copilot** (si aparece). ¿Su diagnóstico coincide con el que tú encontraste en el Ejercicio 1?

### Resultado esperado del Ejercicio 7

Un flujo de arranque **utilizable pero no terminado**: conectores y desencadenador correctos, tabla y columnas que debes revisar. Lo que Copilot no sabe: tu política de aprobación, tu convención de nombres y tus claves alternativas. **Nunca publiques sin leerlo.**

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Qué construyó bien y qué corregiste | ___ |
| ¿Su resumen de `SC - Conciliar factura` omitió reglas? Cuáles | ___ |
| ¿Estuvo Copilot disponible en tu ambiente? | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| **Analytics** sale vacío tras ejecutar | Se actualiza cada ~24 h | Usa el historial o la tabla de ejecuciones |
| La tabla de ejecuciones no muestra mis flujos | Están fuera de una solución | Moverlos a una solución (Lab 136) |
| `$expand=workflow` da error | La tabla no tiene esa propiedad de navegación | Usar `_workflow_value` y una segunda consulta |
| El correo de fallo de la plataforma nunca llega | Solo cubre causas conocidas, con enfriamiento de 28 días y solo a propietarios | Tu propio monitor y el patrón **Try / Catch** |
| El flujo "dejó de correr" sin errores | Apagado por inactividad o suspendido por una directiva | Mirar el estado del flujo, no solo el historial |
| Nadie puede cambiar una conexión | La creó una persona que ya no está | Cuenta de servicio y referencias de conexión (Lab 136) |

## 🔧 Diagnóstico y reparación

### "El lunes nadie sabe si se enviaron las solicitudes de la semana"

1. **Estado** del flujo: ¿encendido, apagado o suspendido?
2. **Historial**: ¿hay ejecuciones de la semana? Si **no** hay ninguna, el desencadenador no se disparó (Lab 129).
3. **Fallidas**: ábrelas, lee la acción y el error, y decide si **Resubmit** es seguro (Lab 133).
4. **Dueños y conexiones**: ¿la conexión es de alguien que se fue?
5. **Decide** qué cambiarías: un monitor, un segundo propietario y una variable de entorno para el correo de avisos.

## Checklist final

- [ ] Historial recorrido, una ejecución fallida analizada y una reenviada con criterio
- [ ] Tasa de éxito calculada y comparada con **Analytics** y con la tabla de ejecuciones
- [ ] `SC - Monitor de fallos` envía un correo con las fallidas del día
- [ ] Modelo de propietarios escrito
- [ ] Hoja de límites aplicada a los flujos de SIT
- [ ] Caso de directiva de datos resuelto y prueba de Copilot anotada

## Evidencia esperada

- Captura del historial con el filtro de columnas y una ejecución fallida abierta
- Captura del correo del monitor
- Tu modelo de propietarios y tu hoja de límites
- Tus respuestas de validación

## Criterios de aprobación

- Las cifras de fallos del historial, de la tabla y del correo **coinciden** **para el mismo flujo y el mismo periodo**, o explicas la diferencia (alcance, retraso o tipo de flujo)
- Tu monitor no depende de una sola persona ni de la alerta nativa
- Distingues un flujo **fallido**, uno **apagado** y uno **suspendido** y dices cómo detectar cada uno
- Explicas qué se rompería si la persona propietaria se fuera

## Competencias desarrolladas

- Leer y operar el historial de ejecuciones, con reenvío seguro
- Medir un flujo con datos de Dataverse y compararlo con las herramientas nativas
- Diseñar un aviso de fallos propio
- Decidir propietarios y cuentas de servicio
- Aplicar los límites de la plataforma y prever el efecto de una directiva de datos

## Reto adicional

**Reto básico:** añade al correo el tiempo de la ejecución en segundos (`duration` ya está en **Select columns**; `div(item()?['duration'], 1000.0)` con `1000.0` para no truncar a un entero; recuerda que `duration` está en milisegundos y puede venir vacío en ejecuciones en curso).

**Reto intermedio:** resuelve el nombre del flujo con un segundo **List rows** sobre la tabla de flujos (`workflows`; en el selector aparece como **Processes** o **Procesos**), filtrando por el identificador, y muéstralo en la tabla del correo.

**Reto avanzado:** haz que el monitor registre cada fallo en una tabla `Registro de errores` (Lab 133, Reto intermedio) y avise **solo** de los fallos nuevos, para no repetir los de ayer.

## Preguntas de repaso

1. ¿Por qué un error de tu lógica no genera la alerta nativa de la plataforma?
2. ¿Qué dos fuentes de datos de ejecuciones puede leer un flujo y qué parte de la realidad ve cada una?
3. ¿Qué diferencia hay entre un flujo **apagado**, **fallido** y **suspendido** y cómo detectas cada uno?
4. ¿Cómo te enteras de que el propio monitor dejó de funcionar?
5. ¿Qué ocurre con un flujo cuyo único propietario cambia de área?

## Limpieza del laboratorio

Conserva `SC - Monitor de fallos` pero **apágalo** si no quieres correos diarios. Borra `SC - Tabla de ejecuciones` y apaga los flujos de pruebas del Lab 133.

## Siguiente laboratorio recomendado

**Lab 138 — Rendimiento**: **Apply to each** frente a **Select**, concurrencia, lotes y umbrales, midiendo antes y después.

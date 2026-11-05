---
moduleId: 76
title: "ALM, operación, gobierno y soporte RPA"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 24
practiceMinutes: 240
slug: "alm-operacion-gobierno-soporte-rpa"
lastVerified: "2026-11"
---
*Lectura: 22-24 min · Práctica: unas 4 horas la primera vez, mejor en tres sesiones (la primera, Microlecciones 1 y 2; la segunda, Microlecciones 3 y 4; la tercera, el diagnóstico, el paquete de operación sin pasos y el reto de transferencia).*

## 🎯 Objetivo

Preparar desktop flows para despliegue, UAT, rollback, monitoreo, soporte, ownership, seguridad, DLP, licencias, continuidad, mantenimiento y deprecación.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (documentos que entregas y valores que obtuviste, no un sí/no). Es el módulo que **cierra la ruta RPA**: aquí no aprendes una acción nueva de PAD, sino a llevar a producción el bot del [Módulo 75](/nivel/rpa/modulo/integracion-cloud-desktop-flow) de forma que otra persona pueda desplegarlo, operarlo, gobernarlo y revertirlo. Después **diagnosticas síntoma primero** un bot que falla el primer día de UAT, **armas sin pasos** el paquete de operación y cierras con un **reto de transferencia** sobre un bot suspendido por una política DLP.
>
> **Antes de empezar, necesitas:**
> - Haber hecho el [Módulo 75](/nivel/rpa/modulo/integracion-cloud-desktop-flow): usas su bot (cloud flow + desktop flow `M75 Registrar solicitud`) como el caso a desplegar.
> - Un ambiente **Developer** de Power Platform (para crear una solución con variables de entorno y una connection reference). Las partes que dependen de licencia (máquinas, ejecución desatendida, DLP de administrador) tienen **variante en papel**; la que uses declárala como **simulación** en tu entrega.
> - Las plantillas del curso, sin datos reales ni credenciales: [deployment checklist](/practice-assets/rpa/sit-automation-case/templates/deployment-checklist.md), [rollback plan](/practice-assets/rpa/sit-automation-case/templates/rollback-plan.md), [runbook](/practice-assets/rpa/sit-automation-case/templates/runbook.md), [test plan](/practice-assets/rpa/sit-automation-case/templates/test-plan.md), [casos UAT](/practice-assets/rpa/sit-automation-case/templates/casos-uat.md), [security checklist](/practice-assets/rpa/sit-automation-case/templates/security-checklist.md), [machine readiness](/practice-assets/rpa/sit-automation-case/templates/machine-readiness-checklist.md), [maintenance checklist](/practice-assets/rpa/sit-automation-case/templates/maintenance-checklist.md) y [registro de automatizaciones](/practice-assets/rpa/sit-automation-case/templates/registro-automatizaciones.md).
> - **Importante sobre los límites de lo verificado:** Learn documenta cómo mover un desktop flow dentro de una solución y cómo se aplican las políticas DLP, pero **no documenta** que un desktop flow lea variables de entorno directamente. Por eso, aquí el valor por ambiente llega **como input desde el cloud flow** (que sí puede leer variables de entorno), una combinación de dos hechos documentados, no una función nueva.

## 📖 Conceptos Clave

Un desktop flow no termina cuando funciona en DEV. Debe vivir en una solución con dependencias, variables de entorno, connection references, documentación, pruebas, deployment plan, rollback plan, runbook, owner y calendario de mantenimiento.

- **Desktop flow dentro de una solución:** para mover un desktop flow de un ambiente a otro, se aloja en una solución ([Share/export a desktop flow](https://learn.microsoft.com/en-us/power-automate/desktop-flows/how-to/share-export-desktop-flows)). Dentro de una solución *unmanaged*, **New** > **Automation** > **Desktop flow** abre PAD para crearlo, y la connection reference se añade con **Add existing** > **More** > **Connection Reference** ([ALM con soluciones](https://learn.microsoft.com/en-us/power-automate/desktop-flows/alm/alm-solution)).
- **Esquema v2, objetos requeridos y exportación:** con el esquema v2, junto al nombre del flow se abren los puntos suspensivos > **Advanced** > **Add required objects** > **OK**; aparecen elementos **Desktop Flow Binary** en la solución. Luego se exporta como **managed** y se importa en un ambiente que tenga el esquema v2 habilitado ([ALM con esquema v2](https://learn.microsoft.com/en-us/power-automate/desktop-flows/alm-schema)).
- **Managed vs. unmanaged:** una solución unmanaged solo debe usarse para compartir con otros makers y no para importar en producción; para un ALM correcto se recomienda managed. No se actualiza un desktop flow managed directamente: se importa una versión nueva de la solución, y en v2 esa edición está bloqueada. Una managed no se puede importar en el mismo ambiente de donde salió la unmanaged ([ALM con esquema v2](https://learn.microsoft.com/en-us/power-automate/desktop-flows/alm-schema)).
- **Connection reference:** componente de solución que contiene una referencia a una conexión de un conector. Al importar, se proporciona una conexión para cada referencia; la conexión que usaste en DEV no es la de producción y se mapea durante la importación ([Connection reference](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-connection-reference)).
- **Variables de entorno:** la definición viaja en la solución y el valor se da para el ambiente de destino durante el despliegue ([Environment variables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables)). Tipos: **Decimal number**, **Text**, **JSON**, **Two options**, **Data source** y **Secret**. Una variable de tipo **Secret** solo admite Azure Key Vault y **no** está disponible en el selector de contenido dinámico de los cloud flows, así que no se puede pasar a un desktop flow por esa vía. Las variables de entorno sí están disponibles en el contenido dinámico de un cloud flow de solución ([Environment variables en cloud flows](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-power-automate), [Secret en Key Vault](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets)).
- **Credenciales:** Learn recomienda la acción **Get credential** en el desktop flow, con credenciales creadas y compartidas desde Azure Key Vault o CyberArk, y variables marcadas como sensibles, que no se guardan en los logs de ejecución ([Secure your data](https://learn.microsoft.com/en-us/power-automate/guidance/desktop-flow-coding-guidelines/secure-your-data)).
- **DLP para desktop flows:** los grupos de acciones se clasifican como **Business**, **Non-business** o **Blocked**; un flow que viola la política queda *suspended* y no se puede ejecutar, y un cloud flow que lo use también queda suspendido. Se corrige en el diseñador eliminando o deshabilitando las acciones que causan el error. Limitación documentada: los flows llamados con **Run desktop flow** no se evalúan para DLP ([Data loss prevention](https://learn.microsoft.com/en-us/power-automate/desktop-flows/data-loss-prevention)).
- **Máquinas y roles:** los roles de seguridad **Desktop Flows Machine Owner**, **Desktop Flows Machine User** y **Desktop Flows Machine User Can Share** controlan quién registra, comparte o ejecuta en una máquina; una máquina solo ejecuta desktop flows desde la nube en un ambiente a la vez, y cambiar su ambiente borra sus conexiones. Compartir una máquina ofrece **Co-owner** o **User** ([Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)).
- **Operación y auditoría:** **Monitor > Desktop flow runs** y **Monitor > Machines** muestran ejecuciones y estado de máquinas. Los logs de acciones se pueden retener y auditar con Dataverse; Learn recomienda activar Dataverse auditing en el ambiente y en las tablas relacionadas con las automatizaciones ([Monitor runs](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-desktop-flow-runs), [Desktop flow logs](https://learn.microsoft.com/en-us/power-automate/desktop-flows/configure-desktop-flow-logs), [Secure your data](https://learn.microsoft.com/en-us/power-automate/guidance/desktop-flow-coding-guidelines/secure-your-data)).

## 👨‍💻 Actividades Prácticas Paso a Paso

## 🧩 Microlección 1 — Qué viaja en la solución y qué se configura al importar

**¿Qué vas a aprender?** A empaquetar el bot del Módulo 75 en una solución y a separar tres cosas: lo que va dentro, lo que se resuelve al importar y lo que no debe viajar pegado desde DEV.

**¿Por qué existe esto?** Un bot importado «a mano» o desde una solución incompleta falla el primer día. Con la lista de componentes por escrito, el despliegue deja de depender de la memoria de quien lo construyó.

**Ahora haz algo — micropráctica (8 min):** decide qué va en la solución y qué se mapea al importar → **[Qué viaja en la solución y qué se configura al importar](/practica/ip-rpa-028-que-viaja-en-la-solucion-y-que-se-configura)**.

**Práctica (45 min):**

1. En tu ambiente Developer abre [make.powerautomate.com](https://make.powerautomate.com), ve a **Solutions** y elige **New solution**. Ponle el nombre `M76 Bot SIT`, elige tu publisher del curso (prefijo `sit`) y crea la solución.
2. **Variables de entorno.** Dentro de la solución, usa **New** y busca **Environment variable**. Crea dos de tipo **Text**: `sit_RutaEntrada` (valor por defecto de DEV: `C:\RPA-Curso\Entrada`) y `sit_Modo` (valor por defecto de DEV: `registrar`). **No** crees ninguna de tipo **Secret** en este ejercicio.
3. **Connection reference.** Si tu ambiente lo permite, añade con **Add existing** > **More** > **Connection Reference** una referencia a la conexión de un conector estándar (por ejemplo, Microsoft Dataverse); si no, anota en papel qué conectores usa tu bot.
4. **Desktop flow (variante A, si tu ambiente permite guardar desktop flows en la nube).** Dentro de la solución, **New** > **Automation** > **Desktop flow** abre PAD; guarda ahí el flujo `M75 Registrar solicitud` con el mismo contrato del Módulo 75 y cierra PAD. Verás el desktop flow dentro de la solución. Después, junto a su nombre, abre los puntos suspensivos > **Advanced** > **Add required objects** > **OK** y comprueba que aparecen elementos **Desktop Flow Binary**.
5. **Variante B (sin acceso al desktop flow en la nube):** haz la lista en papel de los componentes que irían en la solución y marca con «simulación» el paso 4.
6. **Inventario.** Completa esta tabla, siempre con tu bot concreto:

   | Componente | ¿Va en la solución? | ¿Qué se configura al importar? |
   |---|---|---|
   | Cloud flow del Módulo 75 | ___ | ___ |
   | Desktop flow `M75 Registrar solicitud` y sus objetos requeridos | ___ | ___ |
   | Connection reference | ___ | ___ |
   | Variables de entorno (`sit_RutaEntrada`, `sit_Modo`) | ___ | ___ |
   | Tabla o lista de estado | ___ | ___ |
   | Máquina o machine group | ___ | ___ |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu tabla de inventario completa | ___ |
| Captura (o lista) de lo que contiene tu solución `M76 Bot SIT` | ___ |
| Si hiciste el paso 4: ¿qué elementos nuevos aparecieron tras **Add required objects**? Si no, escribe «simulación» | ___ |
| ¿Por qué exportarías managed y no unmanaged a TEST? (con la frase de Learn) | ___ |

---

## 🧩 Microlección 2 — Una configuración por ambiente: valores, conexión y credencial

**¿Qué vas a aprender?** A decidir cómo recibe cada ambiente su propia ruta, URL, modo y credencial sin tocar el desktop flow.

**¿Por qué existe esto?** El Caso Real de este módulo (una ruta de DEV y una credencial del desarrollador en TEST) no es un error del bot: es un error del proceso de promoción.

**Práctica (40 min):**

1. Completa esta matriz para tu bot. Puedes inventar los valores de TEST y PROD (usa ejemplos ficticios, nunca datos reales):

   | Configuración | DEV | TEST | PROD | ¿Cómo llega al bot? |
   |---|---|---|---|---|
   | Ruta de entrada | `C:\RPA-Curso\Entrada` | ___ | ___ | ___ |
   | URL del portal | ___ | ___ | ___ | ___ |
   | Modo (`registrar` o `consultar`) | `registrar` | ___ | ___ | ___ |
   | Cuenta para entrar a la aplicación | tu cuenta personal | ___ | ___ | ___ |
   | Cuenta que ejecuta el desktop flow | ___ | ___ | ___ | ___ |

2. En la columna **¿Cómo llega al bot?** usa solo estas tres respuestas y justifica cada una: «input desde el cloud flow, que lee la variable de entorno», «acción **Get credential** dentro del desktop flow» o «connection reference mapeada al importar».
3. Contesta por escrito: ¿por qué una variable de entorno de tipo **Secret** **no** sirve para pasar una contraseña al desktop flow como input? (Pista: lo dice Learn en su limitación de contenido dinámico).
4. Revisa tu desktop flow `M75 Registrar solicitud` con el [security checklist](/practice-assets/rpa/sit-automation-case/templates/security-checklist.md): ¿tiene alguna ruta, URL o usuario escrito dentro de una acción? Anota cuántos encontraste.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu matriz de configuración completa | ___ |
| Cuántos valores escritos dentro de acciones encontraste en tu desktop flow y cuáles | ___ |
| Por qué un **Secret** no sirve para pasar la contraseña como input | ___ |
| Qué cuenta usarías en PROD y quién la gobierna | ___ |

---

## 🧩 Microlección 3 — UAT, despliegue, rollback y prueba de humo

**¿Qué vas a aprender?** A escribir el plan de pruebas, el checklist de despliegue y el de rollback de forma que alguien más pueda ejecutarlos, y a definir la prueba de humo que detecta el fallo del primer día **antes** del UAT.

**¿Por qué existe esto?** Un UAT que descubre rutas inexistentes o credenciales equivocadas le cuesta confianza al proyecto. La prueba de humo posterior al despliegue cuesta cinco minutos.

**Práctica (60 min):**

1. Con la plantilla de [casos UAT](/practice-assets/rpa/sit-automation-case/templates/casos-uat.md) escribe **al menos ocho** casos para tu bot: dos positivos, dos negativos (dato inválido, solicitud bloqueada), un timeout, un duplicado, una máquina no disponible y una credencial vencida. Para cada uno: pasos, resultado esperado y cómo se comprueba.
2. Con el [deployment checklist](/practice-assets/rpa/sit-automation-case/templates/deployment-checklist.md) escribe los pasos para llevar tu solución `M76 Bot SIT` a TEST, **en orden**: exportar como managed, importar, mapear la connection reference, dar los valores de las variables de entorno, comprobar la máquina, ejecutar la prueba de humo.
3. Con el [rollback plan](/practice-assets/rpa/sit-automation-case/templates/rollback-plan.md) escribe cómo vuelves al estado anterior si la prueba de humo falla: qué se revierte primero, cuál es el criterio de «volvimos» y quién decide. Recuerda que un desktop flow managed no se edita en el ambiente destino: la reversión es importar la versión anterior de la solución.
4. Define la **prueba de humo** en cinco líneas: qué valida (ruta existe, credencial válida, máquina conectada, una ejecución mínima con una solicitud de prueba), cuánto debe durar y qué resultado significa «no entregues el UAT».
5. Completa el [machine readiness checklist](/practice-assets/rpa/sit-automation-case/templates/machine-readiness-checklist.md) para la máquina de TEST (en papel si no tienes una). Separa **estado de la máquina** (encendida, agente conectado, sin sesiones abiertas: una sesión de Windows bloqueada impide una ejecución desatendida) de **validez de la credencial** (un inicio de sesión de prueba).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus casos UAT (los ocho, con resultado esperado) | ___ |
| El orden de tu deployment checklist (los pasos numerados) | ___ |
| El criterio de tu rollback y qué importas para revertir | ___ |
| Tu prueba de humo: qué valida y cuánto dura | ___ |
| Los dos ítems separados del checklist de máquina | ___ |

---

## 🧩 Microlección 4 — Operación, gobierno y continuidad: runbook, DLP, roles y registro

**¿Qué vas a aprender?** A dejar el bot operable: qué mira soporte, quién puede qué, qué pasa si una política cambia y cómo se mantiene o se retira.

**¿Por qué existe esto?** Un bot sin dueño, sin runbook y sin fecha de revisión se convierte en una caja negra el día que su autor cambia de equipo.

**Práctica (60 min):**

1. Con la plantilla de [runbook](/practice-assets/rpa/sit-automation-case/templates/runbook.md) escribe el runbook de **media a una página**: severidades con SLA, qué revisar primero (**Monitor > Desktop flow runs** y **Monitor > Machines**), cómo decidir entre reejecutar, reconciliar o compensar (Módulo 74) y a quién escalar.
2. Con el [registro de automatizaciones](/practice-assets/rpa/sit-automation-case/templates/registro-automatizaciones.md) crea la fila de tu bot: owner de negocio, owner técnico, criticidad, máquina o grupo, cuenta de servicio, políticas DLP que le aplican, fecha de la próxima revisión y fecha prevista de deprecación.
3. **Roles.** Escribe cuál de estos roles daría a cada persona y por qué: quien registra la máquina, quien solo ejecuta desktop flows en ella y quien además puede compartirla (**Desktop Flows Machine Owner**, **Desktop Flows Machine User** y **Desktop Flows Machine User Can Share**). Aplica el principio de mínimo privilegio.
4. **DLP.** Escribe, en tres líneas, qué le pasaría a tu bot si un administrador clasifica en **Blocked** un grupo de acciones que usa tu desktop flow, y qué harías (consulta el concepto de DLP de este módulo).
5. Con el [maintenance checklist](/practice-assets/rpa/sit-automation-case/templates/maintenance-checklist.md) define la **revisión mensual**: selectores, cambios de versión de la aplicación, vencimiento de credenciales, capacidad y estado de la política DLP.
6. **Continuidad.** Escribe qué haría el negocio si la máquina principal no estuviera disponible un día entero (ejecución manual documentada, segunda máquina, aplazar el lote) y quién autoriza cada opción.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu runbook (una página como máximo) | ___ |
| Tu fila del registro de automatizaciones | ___ |
| Rol que asignas a cada persona y por qué | ___ |
| Qué pasa si se bloquea un grupo de acciones y qué harías | ___ |
| Tu plan de continuidad en tres líneas | ___ |

---

### 🔎 Diagnosticar síntoma primero — el bot que falló el primer día de UAT

Es el Caso Real de este módulo, visto desde adentro: el bot se importó a TEST con una ruta local de DEV y la credencial del desarrollador. En el primer día de UAT, el run falla porque la carpeta no existe, y al corregirla a mano, el portal rechaza la cuenta.

1. **Micropráctica (8 min):** **[Diagnosticar: el bot que falló el primer día de UAT](/practica/ip-rpa-029-diagnosticar-el-bot-que-fallo-el-primer-dia-en-test)**. Escribe tu hipótesis antes de abrir las pistas.
2. **Después de resolverla:** busca en tu propio bot del Módulo 75 si habría caído en lo mismo.

| Campo | Tu valor |
|---|---|
| Qué dos valores estaban escritos donde no debían y cómo deberían llegar | ___ |
| Qué faltó en la promoción (no en el bot) | ___ |
| Qué habría detectado el fallo antes del UAT | ___ |

---

### 🏗️ Construir sin pasos — el paquete de operación

> **Requisito:** entrega el **paquete de operación** completo del bot de los Módulos 74-75, listo para que un equipo de soporte que no lo construyó pueda recibirlo, **sin que nadie te dicte la estructura**.
> - El bot pasa de DEV a TEST y, si UAT lo aprueba, a PROD.
> - El equipo de soporte atiende de 7:00 a 19:00; el lote corre de noche.
> - La política DLP del ambiente cambia cada trimestre.
> - Declara qué partes son tenant real y cuáles simulación.

Entregables: deployment plan, rollback plan, runbook, registro de automatizaciones, test plan con casos UAT, matriz de seguridad (usa el [security checklist](/practice-assets/rpa/sit-automation-case/templates/security-checklist.md)) y la prueba de humo.

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Configuración por ambiente | Ninguna ruta, URL, modo o cuenta está escrita dentro del desktop flow; cada valor tiene su mecanismo |
| Promoción gobernada | Managed hacia TEST y PROD, conexión mapeada al importar y ninguna edición directa en el destino |
| Rollback ejecutable | Alguien que no hizo el despliegue puede revertirlo con tu plan y sabe cuándo darlo por completo |
| Runbook operable | Con severidad, SLA, primeros pasos de diagnóstico y escalamiento, sin abrir la VM |
| Seguridad y gobierno | Cuenta de servicio, mínimo privilegio, credenciales por **Get credential**, DLP y owner con fecha de revisión |
| Honestidad de alcance | Cada artefacto dice si es tenant real o simulación |

---

## 🔁 Reto de transferencia — El bot suspendido por una política DLP

Cambia el problema: el bot no falla por su configuración, sino porque **alguien cambió una regla de gobierno**. Un administrador modificó la política DLP y el desktop flow aparece como suspendido; el cloud flow que lo usa también.

1. **Micropráctica (9 min):** **[Transferir: el bot suspendido por una política DLP](/practica/ip-rpa-030-transferir-gobierno-dlp-y-bot-suspendido)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **Por escrito (20 min):** escribe el **informe del incidente** (con la plantilla [reporte de incidente](/practice-assets/rpa/sit-automation-case/templates/reporte-incidente.md)): causa, decisión (cambiar el diseño o pedir una reclasificación), quién la aprueba, evidencia de que quedó resuelto y qué cambias en tu revisión mensual para que no te sorprenda de nuevo.

| Campo | Tu valor |
|---|---|
| Qué regla de la política DLP se estaba violando (o cómo lo averiguarías) | ___ |
| Tu decisión y por qué no usas el atajo de **Run desktop flow** | ___ |
| Quién aprueba y qué evidencia aportas | ___ |
| Qué agregas al maintenance checklist | ___ |

## 💼 Casos Reales de Negocio

Un bot se importó a TEST con ruta local de DEV y credencial del desarrollador. Falló el primer día de UAT. Un proceso ALM correcto habría usado configuración por ambiente, connection references, validación postdeploy y rollback.

## ✅ Buenas Prácticas

- DEV unmanaged; TEST/PROD con promoción controlada.
- Variables por ambiente, no rutas hardcodeadas.
- Connection references y cuentas de servicio gobernadas.
- Runbook con severidad, SLA y escalamiento.
- Inventario con owner, criticidad y próxima revisión.
- Exporta como **managed** hacia TEST y PROD; si hace falta un cambio, importa una versión nueva de la solución, no edites el desktop flow en el destino.
- Con esquema v2, ejecuta **Add required objects** antes de exportar y confirma que el ambiente destino tiene el esquema v2 habilitado.
- Usa **Get credential** y variables sensibles; una variable de entorno de tipo **Secret** no llega al desktop flow por contenido dinámico.
- Ejecuta una prueba de humo en el destino antes de entregar el UAT.
- Revisa la política DLP cada vez que cambie: un grupo bloqueado suspende el desktop flow y el cloud flow que lo usa.

## ⚠️ Errores Comunes

- Cambios directos en producción.
- Permisos excesivos.
- Ausencia de rollback.
- No documentar máquina o cuenta.
- Olvidar DLP, auditoría y protección de datos.
- Importar una solución *unmanaged* a producción: Learn indica que solo sirve para compartir entre makers.
- Mover acciones bloqueadas a un desktop flow llamado con **Run desktop flow** «porque no se evalúa»: es una limitación documentada, no un permiso, y puede cerrarse sin aviso.
- Suponer que un desktop flow lee variables de entorno directamente: Learn no lo documenta; el valor llega como input desde el cloud flow.
- Compartir tu conexión personal como solución de producción: es una cuenta no gobernable.

## 🧪 Criterios de Validación

- [ ] Diseño ALM con solución y configuración por ambiente.
- [ ] Creo deployment y rollback checklist.
- [ ] Creo runbook y registro de automatización.
- [ ] Defino monitoreo y soporte.
- [ ] Puedo defender seguridad, gobierno y continuidad.
- [ ] Empaqueté (o inventarié) la solución con cloud flow, desktop flow, objetos requeridos, connection reference y variables de entorno.
- [ ] Escribí la matriz de configuración por ambiente y expliqué por qué un **Secret** no sirve como input.
- [ ] Escribí al menos ocho casos UAT, la prueba de humo y el orden del despliegue.
- [ ] Diagnostiqué el fallo del primer día de UAT antes de ver la solución.
- [ ] Armé sin pasos el paquete de operación y lo contrasté con la rúbrica.
- [ ] En el reto de transferencia decidí cómo resolver un bot suspendido por DLP sin esquivar el gobierno.

## Evidencia

Deployment plan, rollback plan, runbook, governance register, test plan, UAT y matriz de seguridad. Labs recomendados: LAB-111 y LAB-112. Incidente relacionado: INC-RPA-006.

Guarda también las tablas de evidencia de las cuatro microlecciones, del diagnóstico y del reto de transferencia, y marca en cada artefacto si es tenant real o simulación.

## Preguntas de verificación

1. ¿Qué revisarías después de importar una solución con desktop flow?
2. ¿Por qué una variable de entorno reduce riesgo?
3. ¿Qué debe contener un runbook RPA?

## Conexión con siguiente módulo

Este módulo cierra la ruta y prepara el capstone de automatización end-to-end.

## Limitaciones y seguridad

No publiques bots críticos sin validación en tenant, pruebas UAT, owner operativo y rollback aprobado.

Las políticas DLP las administra un administrador del tenant: tu papel es analizar y aportar evidencia, no desactivarlas. No pongas contraseñas, tokens ni datos personales en la solución, las variables de entorno, el log, los runbooks ni las capturas; usa credenciales gobernadas (**Get credential**, Azure Key Vault o CyberArk) y datos ficticios.

## Referencias oficiales

- [Export a solution](https://learn.microsoft.com/en-us/power-automate/export-flow-solution)
- [Use environment variables in Power Platform solutions](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables)
- [Use a connection reference in a solution](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-connection-reference)
- [Introduction to use ALM for desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/alm/alm-intro)
- [Add cloud flow, desktop flow and connection reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/alm/alm-solution)
- [Application lifecycle management for Power Automate v2 schema](https://learn.microsoft.com/en-us/power-automate/desktop-flows/alm-schema)
- [Share/export a desktop flow](https://learn.microsoft.com/en-us/power-automate/desktop-flows/how-to/share-export-desktop-flows)
- [Data loss prevention (DLP) policies for desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/data-loss-prevention)
- [Secure your data (desktop flow coding guidelines)](https://learn.microsoft.com/en-us/power-automate/guidance/desktop-flow-coding-guidelines/secure-your-data)
- [Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)
- [Monitor desktop flow runs](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-desktop-flow-runs)
- [Configure desktop flow logs](https://learn.microsoft.com/en-us/power-automate/desktop-flows/configure-desktop-flow-logs)
- [Environment variables in cloud flows](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-power-automate)
- [Environment variable secrets in Azure Key Vault](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets)

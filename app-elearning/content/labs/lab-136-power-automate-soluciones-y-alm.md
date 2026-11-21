---
id: lab-136
title: "Soluciones y ALM: referencias de conexión, variables de entorno, exportar e importar (Ruta Pro Power Automate)"
level: "N2"
duration: 240
product: ["Power Automate", "Dataverse", "Soluciones"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado"
  - "Lab 133 recomendado (flujos que no se rompen al moverse)"
  - "Lab 135 recomendado (la tolerancia del 2 % se convierte en variable de entorno)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 136 — Soluciones y ALM

## Objetivo

Sacar tus flujos del ambiente donde los construiste **sin romperlos**: que las conexiones y los valores que cambian entre ambientes (una tolerancia, una dirección de correo) **no estén escritos dentro del flujo**, que sepas qué contiene una solución exportada y que hayas hecho un ciclo completo de **exportar, importar y desinstalar** sin tocar tus datos. ALM (gestión del ciclo de vida de la aplicación) es lo que separa un flujo de práctica de uno que puede pasar a producción.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). Hasta ahora todo vive en un solo ambiente. TI quiere un ambiente de pruebas y otro de producción, con una condición: **el mismo paquete** debe funcionar en los dos, con la tolerancia de conciliación del 2 % en pruebas y otra distinta en producción, y con los flujos corriendo bajo las conexiones de **ese** ambiente, no las tuyas.

## Lo que vas a construir

- Los flujos del curso dentro de la solución `SIT Compras`, con **referencias de conexión** en lugar de conexiones sueltas
- Una **variable de entorno** `Tolerancia de conciliación` que el flujo del Lab 135 lee en lugar de tener el `0.02` escrito
- Una exportación **administrada** y otra **no administrada** que abres para ver qué contienen
- Un ciclo de vida completo (crear, exportar, borrar, importar, desinstalar) sobre una solución **desechable** de prueba
- Una decisión escrita de versiones y de qué guardar antes de que venza tu Trial

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| Solución `SIT Compras` como carpeta (Lab 128) | La solución como **unidad de transporte** | Módulos de ALM del curso |
| Valores escritos en el flujo (Labs 128 a 135) | **Variables de entorno** | Lab 137 (operación) |
| Una conexión con tu usuario | **Referencias de conexión** | Lab 137 (propietarios y cuentas de servicio) |

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Flujos dentro de la solución | 30 min |
| Ejercicio 2 — Referencias de conexión | 30 min |
| Ejercicio 3 — Variable de entorno | 40 min |
| Ejercicio 4 — Exportar y abrir el paquete | 35 min |
| Ejercicio 5 — Ciclo de vida sobre una solución desechable | 55 min |
| Ejercicio 6 — Flujos secundarios | 30 min |
| Ejercicio 7 — Pipelines y decisión de versiones | 20 min |
| **Total** | **unas 4 h** |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate y Power Apps (maker): **Solutions**, **Connection references**, **Environment variables**, **Export**, **Import**, **Run a Child Flow**
- Expresiones: `parameters('<nombre de esquema>')`, `mul`, `div`

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con la solución `SIT Compras` y al menos dos flujos. El Ejercicio 3 necesita `SC - Conciliar factura` y la tabla `Factura` del **Lab 135**, y el Ejercicio 5 la tabla `Proveedor` del **Lab 132**: sin ellos, usa cualquier flujo tuyo que lea una tabla y adapta los nombres
- [ ] Un solo ambiente basta: el ciclo del Ejercicio 5 se hace en el **mismo** ambiente, con una solución desechable. Si tienes un segundo ambiente de pruebas, el Ejercicio 5 puede hacerse allí
- [ ] **No** hagas el ciclo de borrar e importar sobre `SIT Compras`: contiene las tablas y los datos de todo el curso

### Verificación rápida antes de empezar

- [ ] Abre `make.powerapps.com` (o `make.powerautomate.com`), **Solutions** y entra en `SIT Compras`: anota cuántos flujos de nube ves
- [ ] En **My flows** (Mis flujos), mira si tienes flujos **fuera** de la solución. Si los tienes, apúntalos: los moverás en el Ejercicio 1

---

## Ejercicio 1 — Flujos dentro de la solución

**Objetivo:** que cada flujo del curso viva en `SIT Compras` y no suelto en **My flows**.

1. En la solución: **New** > **Automation** > **Cloud flow** crea flujos nuevos **dentro** de la solución, o **Add existing** > **Automation** > **Cloud flow** para traer uno que ya tenías. Los de la solución salen en la pestaña **From Dataverse** (en español, **Desde Dataverse**) y los demás en **Outside Dataverse** (**Fuera de Dataverse**) ([Learn: crear un flujo en una solución](https://learn.microsoft.com/power-automate/create-flow-solution)).
2. Agrega los flujos sueltos que anotaste.
3. Abre uno ya agregado y mira sus conexiones: **siguen siendo conexiones directas** hasta que las conviertes (Ejercicio 2).

> **Comprobado en Learn (2026-11-21):** Learn avisa de que no todos los flujos que están fuera de una solución se pueden agregar; no detalla cuáles. Si uno no aparece en la lista, anota su nombre y su desencadenador. Los flujos de solución **también** aparecen en **My flows**.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Flujos en `SIT Compras` ahora | ___ |
| ¿Alguno no se pudo agregar? Cuál y por qué crees | ___ |

---

## Ejercicio 2 — Referencias de conexión

**Objetivo:** que el flujo no apunte a **tu** conexión sino a un **nombre** que cada ambiente resuelve con la suya.

**Qué es:** una referencia de conexión es un componente de la solución que apunta a un conector, no a una conexión concreta; los flujos de solución se enlazan a la referencia ([Learn: referencias de conexión](https://learn.microsoft.com/power-apps/maker/data-platform/create-connection-reference)).

1. En la solución, **New** > **More** > **Connection Reference** (en español, **Nuevo** > **Más** > **Referencia de conexión**). Nombre para mostrar `Conexión Dataverse (SIT)`, conector **Microsoft Dataverse** y una conexión existente (o crea una).
2. Abre uno de tus flujos que usa Dataverse. Si el comprobador te avisa de **Use connection references** (**Usar referencias de conexión**), elige quitar las conexiones y asigna la referencia del paso 1 a cada acción de Dataverse.
3. **Save**. Comprueba que el flujo sigue funcionando con una ejecución de prueba.

> **Quién ejecuta el flujo:** quien lo **activa** debe ser dueño de todas las conexiones de las referencias o tener permiso para usarlas (si no, el error es `ConnectionAuthorizationFailed`). Las conexiones se comparten desde **Connections** > **Share** > **Can use** ([Learn: importar una solución](https://learn.microsoft.com/power-automate/import-flow-solution)).

### Resultado esperado del Ejercicio 2

Todas las acciones de Dataverse de tus flujos usan **la misma** referencia (si dejaste una por flujo, ya sabes qué simplificar). En la solución, la referencia aparece como componente.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Referencias de conexión en la solución | ___ |
| ¿Qué pasaría en producción si el flujo siguiera con **tu** conexión directa? | ___ |

---

## Ejercicio 3 — Variable de entorno

**Objetivo:** que la tolerancia del 2 % deje de estar escrita en el flujo.

1. En la solución: **New** > **More** > **Environment variable** (**Nuevo** > **Más** > **Variable de entorno**). **Display name** `Tolerancia de conciliación (%)`, **Data type** **Decimal number** (**Número decimal**), **Default value** `2`. Los tipos disponibles son Decimal number, Text, JSON, Two options, Data source y Secret ([Learn: variables de entorno](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables)).
2. Anota el **nombre de esquema** que se genera (el prefijo de tu publicador más el nombre sin espacios ni símbolos, algo como `sit_Toleranciadeconciliacion`; no será necesariamente el de este texto): el tipo y el nombre **no se pueden cambiar** después. En las expresiones de abajo, sustituye `sit_ToleranciaConciliacion` por **el tuyo**.
3. Abre `SC - Conciliar factura`. En la **Compose** `Tolerancia en USD` (Lab 135, Tarea 3.2) sustituye el `0.02` por una expresión que use la variable: `mul(<importe de la solicitud>, mul(parameters('sit_ToleranciaConciliacion'), 0.01))` (con `mul` y `0.01`, no con `div(..., 100)`: **`div` con dos enteros devuelve un entero**, así que `div(2, 100)` daría 0 y la tolerancia sería cero). Learn documenta la forma `parameters('<nombre de esquema>')` y dice que la variable también aparece en **Dynamic content**; si tu diseñador la inserta con otro formato, usa el que inserte él.
4. **Si el lote del Lab 135 ya guardó `FAC-2026-0009`, borra primero su fila de `Factura`** (si no, saldría `Duplicada`). Guarda y prueba con `FAC-2026-0009` (la que queda **fuera** de tolerancia con el 2 %) en `SC - Conciliar factura` (el flujo con la variable): lánzalo con esa factura en la entrada de texto o envía el correo del Lab 135 con ese adjunto. Al ejecutarse, **la factura queda guardada** en `Factura`. (`SC - Conciliar lote` es una copia con su propia tolerancia: si quieres probarlo ahí, cámbiale la tolerancia por la variable también.)
5. **Borra la fila `FAC-2026-0009` de `Factura`** (si no, la primera regla la marcaría `Duplicada`). Después **agrega** un **Current value** (**Valor actual**) `10` a la variable (al principio solo existe el valor predeterminado) y prueba de nuevo.
6. **Deja la variable como estaba**: quita el valor actual `10` antes del Ejercicio 4, para que el paquete que exportes (y que te sirve de modelo para el Lab 139) no lleve un valor de prueba.

### Resultado esperado del Ejercicio 3

Con `2`, `FAC-2026-0009` (diferencia de 38 sobre una solicitud de 760) sale **Fuera de tolerancia**; con `10` la tolerancia es de 76 y sale **Conciliada con diferencia** (el umbral real está en el 5 %: 38 ÷ 760). Sin tocar el flujo. *Sin verificar en el tenant:* cómo serializa el diseñador un Decimal number como `2`; si el resultado no cuadra, mira lo que devuelve `parameters(...)` en una **Compose**.

> **Comprobado en Learn (2026-11-21):** si cambias el valor directamente en el ambiente, el flujo puede tardar en tomarlo (Learn menciona que se actualiza al guardar o al apagar y encender el flujo, y hasta una hora). Si el segundo resultado no cambia, **apaga y enciende** el flujo antes de sospechar de la expresión. *Sin verificar en el tenant:* este tiempo en tu ambiente.

### Valor predeterminado y valor actual

| | Default value | Current value |
|---|---|---|
| Dónde vive | En la **definición** de la variable | En una fila aparte (tabla de valores) |
| Cuál gana | Solo si no hay valor actual | El valor actual, siempre |
| Al exportar | Viaja con la solución | Viaja **solo si lo dejas** en la solución |

Learn recomienda **no** llevar el valor actual en el paquete (en la variable: **Current value** > **...** > **Remove from this solution**), para que el ambiente de destino pida el suyo ([Learn: exportar una solución](https://learn.microsoft.com/power-automate/export-flow-solution)).

> **Una variable `Secret`** guarda un secreto en Azure Key Vault y **no** aparece en **Dynamic content**: se lee con la acción de Dataverse **Perform an unbound action** y `RetrieveEnvironmentVariableSecretValue` ([Learn: secretos](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets)). Aquí no la necesitas.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Nombre de esquema de tu variable | ___ |
| Resultado de `FAC-2026-0009` con 2 y con 10 | ___ / ___ (esperado: Fuera de tolerancia / Conciliada con diferencia) |
| Por qué no conviene exportar el valor actual | ___ |

---

## Ejercicio 4 — Exportar y abrir el paquete

**Objetivo:** ver con tus ojos qué viaja en una solución.

1. En `SIT Compras`: **Publish all changes** (**Publicar todos los cambios**). Learn pide publicar antes de exportar porque solo se exportan los componentes **publicados** (sobre todo personalizaciones de tablas y formularios).
2. **Export solution** (**Exportar**) > **Next** > **Export as**: **Unmanaged** (**No administrado**). Descarga el `.zip`. Repite con **Managed** (**Administrado**). Una solución **administrada no se puede volver a exportar**: exporta siempre desde la no administrada ([Learn: exportar](https://learn.microsoft.com/power-automate/export-flow-solution)).
3. Copia cada `.zip` en una carpeta nueva **vacía** y ábrelo con un descompresor (no ejecutes nada de su interior).
4. Abre `solution.xml` y busca `<Managed>`. Abre `customizations.xml` y busca las secciones de tablas, flujos y referencias de conexión.

### Resultado esperado del Ejercicio 4

**Comprobado en un tenant real (2026-11-21, con una solución mínima de un flujo, una variable y una referencia de conexión):**

| Archivo del `.zip` | Qué contiene |
|---|---|
| `solution.xml` | Nombre, versión y `<Managed>1</Managed>` (administrada) o `<Managed>0</Managed>` |
| `customizations.xml` | Tablas, **referencias de conexión** y la lista de flujos con su ruta |
| `Workflows/<nombre>-<id>.json` | **La definición de cada flujo**, como texto |
| `environmentvariabledefinitions/<esquema>/environmentvariabledefinition.xml` | La variable: tipo (`100000001` es Decimal number) y valor predeterminado |
| `[Content_Types].xml` | Tipos de archivo del paquete |

Tu `SIT Compras` tendrá además carpetas de tablas y más flujos. Lo importante: **el flujo viaja como un `.json` legible**, con los nombres de tus acciones, y las conexiones viajan como **referencias**, no como credenciales.

> **Una exportación es una copia de seguridad de la lógica, no de los datos.** Las filas de `Solicitud de compra` **no** van en el paquete.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| `<Managed>` en cada paquete | ___ / ___ (esperado: 0 y 1) |
| Ruta del archivo de tu flujo | ___ |
| ¿Hay alguna contraseña o token en el paquete? | ___ (esperado: no) |

---

## Ejercicio 5 — Ciclo de vida sobre una solución desechable

**Objetivo:** hacer exportar, borrar, importar y desinstalar con seguridad, en un ambiente.

> **Alcance:** haz **todo** este ejercicio sobre una solución nueva llamada `SIT ALM Prueba`, no sobre `SIT Compras`. Crea cada componente con **New**, **nunca** con **Add existing**: si metes en la desechable la variable, la referencia o una tabla reales, desinstalarla los borraría. Usa **nombres distintos** a los de `SIT Compras` (así los distingues al borrar).

### Tarea 5.1 — Crear la solución desechable

1. **New solution**: nombre `SIT ALM Prueba`, tu publicador, versión `1.0.0.0`.
2. Dentro, con **New**: una **variable de entorno** `Tolerancia ALM prueba` (Decimal number, valor `2`), una **referencia de conexión** `Conexión Dataverse (ALM prueba)` y un flujo instantáneo `SC - Prueba ALM` que lea una fila de `Proveedor` con esa referencia y devuelva la variable. **No agregues la tabla `Proveedor`**: el flujo solo la **lee**. Guarda.
3. Cuenta las filas de `Proveedor` y **anótalo** (lo comparas en la Tarea 5.4).
4. **Export solution** > **Managed**. Guarda el `.zip` (cada exportación puede subir la versión: no esperes que sea `1.0.0.0`).

### Tarea 5.2 — Borrar el contenedor y ver qué queda

5. Borra la solución `SIT ALM Prueba` (en el panel de soluciones, **Delete**).
6. Abre **Default Solution** (o busca por nombre): ¿siguen el flujo, la variable y la referencia?

**Resultado esperado (comprobado en un tenant real):** **siguen ahí**. Borrar una solución **no administrada** elimina solo el contenedor; los componentes quedan en el ambiente ([Learn: conceptos de ALM](https://learn.microsoft.com/power-platform/alm/solution-concepts-alm)).

### Tarea 5.3 — Importar la administrada

7. Learn dice que **no puedes importar una solución administrada en el mismo ambiente donde sigue su solución no administrada de origen**. Aquí ya borraste el contenedor, pero los componentes siguen como capa **no administrada**: si los dejas, la administrada quedaría por debajo y desinstalarla no los quitaría. **Bórralos tú**, en este orden: primero el **flujo** `SC - Prueba ALM` y después la **variable** y la **referencia de conexión** (los dependientes bloquean el borrado). Comprueba que son los **de la desechable** (`ALM prueba`) y no los de `SIT Compras`.
8. **Import solution** (**Soluciones** > **Importar**) > **Browse** (**Examinar**) y elige el `.zip` administrado. Si el asistente te deja seguir **sin** elegir conexión para la referencia, no la elijas (así compruebas el resultado de la tabla). Si la exige, asigna la tuya: el flujo quedará **encendido** y lo anotas. Si pide un valor para la variable, deja el predeterminado.

**Resultado esperado (comprobado en un tenant real):**

| Elemento | Tras importar |
|---|---|
| Solución `SIT ALM Prueba` | Aparece como **administrada** |
| Flujo `SC - Prueba ALM` | Existe y queda **apagado** si la referencia **no tiene conexión** (si le asignas una, Learn dice que se enciende solo) |
| Variable | Existe, con el valor predeterminado `2` |
| Referencia de conexión | Existe, **sin conexión** hasta que le asignes una |

Learn dice que el flujo se enciende solo cuando la importación recibe una conexión para **todas** sus referencias; sin ella, hay que asignarla y encenderlo a mano.

### Tarea 5.4 — Desinstalar

9. Antes de borrar, abre la solución administrada y comprueba que **no contiene ninguna tabla**. Después bórrala.

**Resultado esperado (comprobado en un tenant real):** desaparecen el flujo, la variable y la referencia, **y** `Proveedor` conserva **las mismas filas** que anotaste en el paso 3. Desinstalar una administrada quita **todo** lo que trajo, **incluidos los datos de las tablas que ella creó** ([Learn: conceptos de ALM](https://learn.microsoft.com/power-platform/alm/solution-concepts-alm)): por eso `SIT ALM Prueba` **no** crea tablas.

> **La trampa:** si `SIT ALM Prueba` hubiera traído la tabla `Proveedor`, desinstalarla habría borrado sus proveedores. **Nunca** desinstales una solución administrada sin saber qué tablas contiene.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| ¿Quedaron los componentes tras borrar la **no** administrada? | ___ (esperado: sí) |
| Estado del flujo tras importar | ___ (esperado: apagado si no asignaste conexión; encendido si la asignaste) |
| Valor de la variable tras importar | ___ (esperado: 2) |
| Filas de `Proveedor` antes / después de desinstalar | ___ / ___ (esperado: iguales) |

---

## Ejercicio 6 — Flujos secundarios

**Objetivo:** reutilizar un bloque de lógica entre flujos, dentro de una solución.

**Sin ejecutar en el tenant:** este ejercicio sigue la documentación de Learn; las condiciones salen de [Learn: flujos secundarios](https://learn.microsoft.com/power-automate/create-child-flows).

1. En la solución, crea un flujo **instantáneo** `SC - Hijo: nivel de aprobación` con el desencadenador **Manually trigger a flow** (**Desencadenar un flujo manualmente**) y una entrada numérica `Importe`. Devuelve el nivel (1, 2 o 3) con **Respond to a Power App or flow** (**Responder una Power App o flujo**).
2. En otro flujo de la **misma** solución, añade **Run a Child Flow** (**Ejecutar un flujo secundario**, conector **Flows**, pestaña **Built-in**) y elígelo.
3. Si el hijo usa conectores distintos de los integrados o Dataverse, abre su página, la tarjeta **Run only users** > **Edit** y, en cada conexión, elige **Use this connection** (**Usar esta conexión**) en lugar de **Provided by run-only user**.

### Resultado esperado del Ejercicio 6

El padre llama al hijo y recibe el nivel. Learn indica que **las conexiones no pasan del padre al hijo** (el hijo usa conexiones incrustadas) y que, al exportar e importar la solución, padre e hijo se vuelven a enlazar solos. Importar un flujo hijo suelto, fuera de su solución, da resultados inesperados.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| ¿Por qué el hijo debe estar en la misma solución? | ___ |
| ¿Qué opción de **Run only users** elegiste y por qué? | ___ |

---

## Ejercicio 7 — Pipelines y decisión de versiones

**Objetivo:** saber qué viene después del exportar e importar a mano.

**Comprobado en Learn (2026-11-21):** las **pipelines** de Power Platform despliegan **soluciones administradas** entre ambientes con sus conexiones, referencias y variables, **sin datos** de Dataverse; necesitan un ambiente **anfitrión** (host) y los ambientes de destino deben ser **Managed Environments** con licencias premium; no despliegan a otro tenant ([Learn: pipelines](https://learn.microsoft.com/power-platform/alm/pipelines)). **No confirmado en Learn:** si un ambiente **Trial** puede ser anfitrión o destino: no lo des por hecho.

Responde por escrito:

1. SIT tiene `pruebas` y `producción`. Escribe el **orden de despliegue** y qué valores de variable de entorno tendría cada uno.
2. Define una **regla de versiones** (por ejemplo, `mayor.menor.compilación.revisión`) y cuándo sube cada número.
3. Tu **Trial** vence en 30 días y no se puede copiar ni respaldar. ¿Qué exportas **antes** de que venza y dónde lo guardas? (Pista: la solución no administrada, y por separado un archivo con tus datos de prueba.)

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Regla de versiones | ___ |
| Qué exportas antes de que venza el Trial | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `ConnectionAuthorizationFailed` al encender el flujo | Quien lo enciende no es dueño de la conexión ni tiene permiso | Compartir la conexión (**Can use**) |
| No puedes importar la administrada en el mismo ambiente | Aún existe la solución no administrada de origen | Probar en otro ambiente o, solo con una solución desechable, borrar sus componentes primero (Ejercicio 5) |
| El flujo importado queda apagado | La referencia de conexión no tiene conexión | Asignar una conexión y encenderlo |
| La variable sigue con el valor anterior | Se cambió el valor en el ambiente sin reiniciar el flujo | Guardar o apagar y encender el flujo |
| `$authentication` o `$connection` como nombre de variable | Nombres reservados del flujo | Otro nombre |
| Desinstalaste una solución y desaparecieron los datos | La solución contenía tablas | Revisar su contenido antes; exportar los datos aparte |

## 🔧 Diagnóstico y reparación

### "Importamos la solución en producción y el flujo no corre"

1. **Mira el estado** del flujo: ¿apagado, suspendido o encendido con fallos?
2. **Revisa las referencias de conexión**: ¿alguna sin conexión o con la de una persona que ya no está?
3. **Revisa las variables de entorno**: ¿alguna con el valor de pruebas (un correo, una URL)?
4. **Decide** qué haría que no se repita: un valor actual **vacío** en el paquete y una lista de comprobación de importación.

## Checklist final

- [ ] Los flujos del curso viven en `SIT Compras`
- [ ] Una referencia de conexión de Dataverse usada por todas las acciones de Dataverse
- [ ] Variable de entorno `Tolerancia de conciliación (%)` leída por el flujo, probada con 2 y con 10
- [ ] Paquetes no administrado y administrado exportados y abiertos
- [ ] Ciclo exportar, borrar, importar y desinstalar hecho en `SIT ALM Prueba`, con las filas de `Proveedor` intactas
- [ ] Decisión de versiones y de respaldo del Trial escrita

## Evidencia esperada

- Captura de la solución `SIT Compras` con las referencias de conexión y la variable
- Captura de la lista de archivos del `.zip` y del `<Managed>` de cada uno
- Captura del flujo importado apagado y sin conexión, y del recuento de proveedores tras desinstalar
- Tus respuestas de validación

## Criterios de aprobación

- Ningún flujo de la solución usa una conexión directa a tu usuario
- El resultado de `FAC-2026-0009` cambia solo con el valor de la variable
- Explicas qué viaja en una solución y qué no (datos, credenciales)
- Haces el ciclo de desinstalación **sin** perder datos y explicas por qué no se perdieron

## Competencias desarrolladas

- Organizar flujos en soluciones con referencias de conexión
- Parametrizar con variables de entorno y distinguir valor predeterminado de actual
- Exportar, inspeccionar, importar y desinstalar soluciones administradas y no administradas
- Reconocer el riesgo de desinstalar y de importar sin las conexiones
- Describir un despliegue por pipelines y sus requisitos

## Reto adicional

**Reto básico:** crea una segunda variable `Correo de avisos` (tipo Text) y úsala como destinatario del correo del Lab 135.

**Reto intermedio:** en `SIT ALM Prueba`, sube la versión a `1.1.0.0`, exporta una administrada nueva e impórtala encima de la anterior. Anota qué cambia y por qué ahora sí puedes importar **sobre** la ya instalada.

**Reto avanzado:** prepara la lista de comprobación de una importación a producción (conexiones, variables, orden, quién enciende cada flujo) para dársela a otra persona.

## Preguntas de repaso

1. ¿Por qué un flujo con una conexión directa es un problema al cambiar de ambiente?
2. ¿Qué gana: el valor predeterminado o el actual, y por qué conviene no exportar el actual?
3. ¿Qué pasa con los componentes al borrar una solución **no** administrada? ¿Y al desinstalar una administrada?
4. ¿Por qué no puedes exportar una solución administrada?
5. ¿Qué valor te daría una pipeline que no te da exportar e importar a mano?

## Limpieza del laboratorio

Comprueba que `SIT ALM Prueba` ya no existe (Tarea 5.4). Conserva `SIT Compras` y sus paquetes exportados en una carpeta de tu equipo: te sirven de respaldo y de modelo para el Lab 139.

## Siguiente laboratorio recomendado

**Lab 137 — Operación y gobierno**: historial de ejecuciones, alertas de fallo, propietarios y cuentas de servicio, límites de la plataforma y directivas de datos.

---
id: lab-139
title: "Power Automate — Reto Pro sin pasos: el alta de proveedores de SIT (Ruta Pro Power Automate)"
level: "N3"
duration: 420
product: ["Power Automate", "Dataverse", "Soluciones"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Labs 128 a 138 completados (o dominio equivalente de flujos de nube, Dataverse y soluciones)"
  - "El paquete sit-compras.zip, el ambiente del curso con la tabla Proveedor del Lab 132 cargada (18 filas) y una cuenta con conectores premium"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 139 — Power Automate: reto Pro sin pasos

## Objetivo

Demostrar que puedes diseñar, construir, proteger y dejar operable un proceso de negocio **sin instrucciones paso a paso**: el **alta de proveedores** de SIT, con validación de datos, documentos adjuntos, reglas con orden, duplicados, aprobación humana cuando hace falta y despliegue en una solución. Es el proyecto final de la Ruta Pro Power Automate. Se evalúa con una **rúbrica de criterios comprobables** repartida en cinco dominios: disparadores y datos, reglas y aprobaciones, robustez, despliegue y operación y rendimiento.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT).

**Tu cliente:** el **jefe de Proveedores**, una persona nueva en el proceso de Compras que hoy da de alta proveedores por correo y planilla. Te dijo en la reunión de arranque:

> "Cada semana llegan altas de proveedores y las reviso una por una. Quiero que lleguen por un solo lugar, que lo obvio se resuelva solo y que yo vea únicamente lo dudoso. Un proveedor con el NIT mal escrito, que ya existe o sin sus dos certificados no puede entrar. Si todo está bien y los documentos están vigentes, que se cree solo. Si hay algo dudoso, lo reviso yo. No quiero duplicados aunque me manden la misma alta dos veces, ni enterarme de que algo falló porque un proveedor me escribe. Y que otra persona pueda mantener esto cuando yo cambie de área."

## Reglas del reto

- **No hay pasos.** Tienes los labs 128 a 138 como referencia; vuelve a ellos cuando lo necesites.
- **Todo en una solución nueva** `SIT Altas de proveedores` (no en `SIT Compras`), con sus referencias de conexión y variables de entorno. Reutiliza la tabla `Proveedor` del Lab 132 **leyéndola y escribiéndola**. No la añadas a la solución nueva por defecto (el Lab 136 explica el riesgo); si decides cambiarla (por ejemplo, añadirle una columna `NIT` con clave alternativa), **documenta el cambio** y qué viaja y qué no en el paquete (criterio S4).
- **Qué es una "alta" aquí:** los documentos son **metadatos** dentro del JSON (tipo, nombre y vigencia): no hay archivos que descargar ni abrir. Un campo **vacío** (`""`) cuenta como **ausente**.
- **Entrada:** `solicitudes-alta.json` trae las 14 altas en un arreglo. Puedes procesarlas como un lote o una por una; tú decides y lo justificas.
- **Cada decisión importante va en tu documento de entrega** con una línea de justificación (la rúbrica la pide).
- **Datos:** [sit-compras.zip](/practice-assets/powerautomate/sit-compras/sit-compras.zip), carpeta `altas/`: `solicitudes-alta.json` (14 solicitudes) y `reglas-alta.json`. Las solicitudes llegan como un **archivo JSON** (por correo, por una entrada de texto o por una solicitud HTTP: tú eliges la puerta de entrada y justificas).
- **Tiempo de referencia:** de 6 a 8 horas, en tres sesiones (diseñar y construir; probar y endurecer; desplegar, operar y documentar).

## Requisitos

### R1 — Disparadores y datos

- Un único punto de entrada para las altas, elegido y justificado (correo, HTTP o instantáneo con entrada) y la forma de entrada documentada.
- Lectura de la solicitud con un esquema que **no se cae** por un campo opcional ausente o un tipo inesperado (Lab 134).
- Una **tabla de solicitudes de alta** en Dataverse con el resultado y el motivo de cada una.
- Que **la misma alta no se procese dos veces**: se identifica por `altaId` (una alta ya procesada se **omite**, no se reevalúa; sus aprobaciones no se reenvían).

### R2 — Reglas y aprobaciones

- Las reglas de `reglas-alta.json` aplicadas **en el orden indicado**, con tres resultados: **Aprobada automática**, **Requiere revisión** y **Rechazada**, y el **motivo** de la primera regla que no se cumple (el motivo coincide en esencia con el de las cifras de control, no hace falta el texto literal). Un `condicionPagoDias` que llega como texto (`"30"`) se **convierte** a número con `int()`; lo que no se pueda convertir se rechaza como "Condición de pago no válida".
- Las reglas que viven en datos (la fecha de referencia, los dominios no permitidos, las categorías) **no están escritas en el cuerpo del flujo** sin una justificación: variable de entorno, tabla o archivo.
- Una **aprobación** al jefe de Proveedores para los casos `Requiere revisión`, con respuesta, comentario y plazo (Lab 131), y qué ocurre si **no responde**.
- Al **aprobar automáticamente** o por revisión, el proveedor se crea en `Proveedor` con su **ID de proveedor** nuevo (continúa la numeración: `PRV-019`, `PRV-020`…). **Trampa:** dos ejecuciones simultáneas no pueden tomar el mismo número. Resuélvelo con una columna **Autonumber** (Lab 128) o justifica otro método seguro.

### R3 — Robustez

- Si dos solicitudes llegan **a la vez** o la misma llega **dos veces**, no se crea un proveedor duplicado (idempotencia y clave: Labs 132 y 133). Define **dos claves**: una por `altaId` (que la misma alta no se procese dos veces) y otra por **NIT** (que dos altas distintas con el mismo NIT no creen dos proveedores). Las claves alternativas de `Proveedor` del Lab 132 son `ID de proveedor` e `ID de origen`, **no** el NIT: tendrás que añadir una clave sobre el NIT donde corresponda y explicarlo.
- **Try / Catch / Finally** con un aviso que dice **qué** falló y en **qué** solicitud, y un final **Failed** cuando corresponde (Lab 133).
- Una decisión **escrita** sobre los reintentos de cada acción que llama a algo externo.
- Una prueba de **fallo**: una copia del archivo con una llave de menos (JSON **inválido**). El flujo debe fallar **limpiamente** en la lectura, **sin** crear filas a medias y avisando. Distingue este fallo (el archivo entero es ilegible) de una alta con **datos** malos (se rechaza y el resto del lote sigue).
- La **decisión escrita de reintentos** se puntúa en B3.

### R4 — Despliegue

- La solución contiene los flujos, la tabla de solicitudes de alta, las referencias de conexión y las variables de entorno; **sin** conexiones directas a tu usuario.
- Una **exportación administrada** y otra **no administrada**, con el valor actual de las variables **fuera** del paquete.
- Una **lista de comprobación de importación** para otra persona (conexiones, variables, orden, quién enciende cada flujo).
- Un plan de qué **no** viaja en el paquete (datos, credenciales) y cómo se recrea en otro ambiente.

### R5 — Operación y rendimiento

- Un **monitor** de fallos del proceso (diario) que avisa a un grupo o buzón, no a ti (Lab 137), y un **segundo propietario**.
- Un **modelo de propietarios** y qué pasa si te vas.
- **Una medida** de rendimiento: tiempo de una ejecución con las 14 solicitudes y qué cambiarías si fueran 2.000 (Lab 138).
- Un análisis breve de los **límites** que podrían apagar el flujo (inactividad, errores continuos, volumen).

## Cifras de control

Calculadas sobre los archivos del curso, aplicando las reglas en su orden. Te sirven para comprobar que vas bien. **No son las respuestas del reto**: cumplirlas es necesario, no suficiente.

| Control | Valor |
|---|---|
| Solicitudes del archivo | **14** |
| **Aprobada automática** | **4** (ALTA-01, 02, 03 y 06) |
| **Requiere revisión** | **3** (ALTA-04 y 14 por documento vencido; ALTA-05 por Tecnología a 60 días) |
| **Rechazada** | **7** (ALTA-07 a 13) |
| Motivos de rechazo | Falta un campo (07), NIT con formato inválido (08), NIT ya existe (09), correo de dominio no permitido (10), categoría no válida (11), condición de pago no válida (12), falta un documento requerido (13) |
| Tras cargar las 14 | `Proveedor` pasa de 18 a **25** filas (4 + 3 aprobadas por la revisión, si el jefe aprueba las tres) |
| Segunda ejecución con el mismo archivo | **0** proveedores nuevos, **0** filas nuevas en tu tabla de altas y **ninguna** aprobación reenviada (las altas ya procesadas se omiten por `altaId`) |

> **ALTA-09** repite el NIT de `PRV-018` (`CO-901234567`), el proveedor que el Lab 132 añadió con la segunda carga. Si no cargaste esa actualización, tu tabla tendrá 17 filas y esa solicitud **no** será un duplicado para tu flujo: carga la actualización o anota la diferencia.
>
> **Fecha de referencia:** para la entrega usa la fecha del archivo de reglas, `2026-11-01`, guardada como **variable de entorno** (no escrita en el flujo), y escribe qué usarías en producción (`utcNow()`). Con la fecha real, `ALTA-14` (vence el 2026-10-15) y `ALTA-04` (vence el 2026-09-30) siguen vencidas, y las cifras de control no cambian hasta que venzan los demás documentos (2027-06-30).

## Entregables

1. La solución `SIT Altas de proveedores` exportada (administrada y no administrada).
2. Capturas del historial de una ejecución con las 14 solicitudes, de la tabla de solicitudes con los resultados y de la segunda ejecución sin duplicados.
3. Un documento de **una o dos páginas** con:
   - las decisiones de R1 a R5 y su justificación, una línea cada una;
   - la tabla de cifras de control con tus valores;
   - la lista de comprobación de importación;
   - el modelo de propietarios y el plan de monitoreo;
   - qué mejorarías con más tiempo.
4. Tu puntuación con la rúbrica, criterio por criterio, con la evidencia de cada uno.

## Rúbrica (100 puntos)

Cada dominio vale 20 puntos: cuatro criterios de 5 puntos. Cada criterio se cumple (5), se cumple a medias (2) o no se cumple (0) ("a medias" vale menos de la mitad a propósito: un criterio con evidencia incompleta no es un aprobado), y cada uno dice qué evidencia lo demuestra. Los criterios que piden una explicación se puntúan 5 si la explicación es **concreta y comprobable** (nombra el elemento del flujo y el caso que lo prueba) y 2 si es genérica. Puntúa con honestidad o pide a otra persona que lo haga: **S3** solo se comprueba de verdad si otra persona sigue tu lista.

**Disparadores y datos (20)**

| Criterio | Evidencia |
|---|---|
| D1. Un único punto de entrada, justificado, con la forma de la entrada documentada | Párrafo del documento y captura del desencadenador |
| D2. El esquema tolera un campo opcional ausente y un tipo inesperado sin caerse | Prueba con una solicitud sin `documentos` o con `condicionPagoDias` de texto |
| D3. La tabla de solicitudes guarda resultado y motivo de las 14 | Captura de la tabla |
| D4. La misma alta enviada dos veces se procesa **una** vez (la segunda se omite por `altaId`) | Historial con las dos ejecuciones y la tabla de altas sin filas nuevas |

**Reglas y aprobaciones (20)**

| Criterio | Evidencia |
|---|---|
| R1. Las 14 solicitudes dan 4 / 3 / 7 y el motivo de cada una coincide | Tabla de resultados |
| R2. El orden de las reglas está implementado y lo explicas con un caso (por ejemplo, `ALTA-07` no debe fallar por el formato del NIT) | Párrafo del documento |
| R3. Las reglas que cambian con el tiempo no están escritas en el flujo | Captura de la variable de entorno o tabla de reglas |
| R4. La aprobación tiene respuesta, comentario, plazo y camino sin respuesta | Captura de la aprobación y del escalado |

**Robustez (20)**

| Criterio | Evidencia |
|---|---|
| B1. Repetir el archivo no crea proveedores (0 nuevos) y dos ejecuciones simultáneas tampoco | Captura de `Proveedor` y de las dos ejecuciones |
| B2. Hay clave alternativa y búsqueda previa, y explicas cuál defiende qué | Párrafo del documento |
| B3. El `Catch` avisa de qué solicitud falló, la ejecución termina **Failed** y hay una decisión escrita de reintentos por acción externa | Correo, estado de la ejecución y párrafo del documento |
| B4. Una solicitud corrupta no deja la tabla a medias y el resto del lote sigue | Prueba con el JSON roto |

**Despliegue (20)**

| Criterio | Evidencia |
|---|---|
| S1. Todo está en la solución, con referencias de conexión y sin conexiones directas | Captura del flujo y de la lista de componentes |
| S2. Variables de entorno sin valor actual en el paquete | Captura de la variable y del `.zip` abierto |
| S3. Las dos exportaciones existen y la lista de importación se puede seguir sin ti | Archivos y lista |
| S4. Dices qué **no** viaja y cómo se recrea (tablas con datos, secretos) | Párrafo del documento |

**Operación y rendimiento (20)**

| Criterio | Evidencia |
|---|---|
| O1. El monitor avisa a un grupo o buzón y hay un segundo propietario | Captura del monitor y del **Share** |
| O2. El modelo de propietarios responde "si me voy" | Párrafo del documento |
| O3. Mediste una ejecución **sin contar la espera de las aprobaciones** (por ejemplo, con la aprobación en otro flujo) y explicas qué cambiarías con 2.000 solicitudes (Lab 138) | Tiempo medido y plan |
| O4. Identificas al menos tres límites que podrían apagar o frenar el flujo | Lista del documento |

**Interpretación:** 90 a 100, listo para entregar a un cliente; 70 a 89, falta endurecer lo que puntuó 2 o 0; menos de 70, vuelve a los labs de los dominios más bajos.

## Pistas

No hay pasos, pero sí **a dónde mirar** si te atascas:

| Si te atascas en… | Mira |
|---|---|
| Cómo leer el JSON que llega | Labs 134 y 135 |
| Un `null` rompe una expresión | Lab 130 (`coalesce`, `?[]`) y Lab 135 (orden de reglas) |
| Duplicados | Labs 132 y 133 |
| Aprobación sin respuesta | Lab 131 |
| Referencias de conexión y variables | Lab 136 |
| Quién se entera del fallo | Lab 137 |
| Que sea lento | Lab 138 |

## Preguntas de reflexión

1. ¿Qué parte de las reglas dejarías **fuera** del flujo y por qué?
2. ¿Qué sería lo primero que se rompería si el proceso pasara de 14 a 2.000 altas por semana?
3. ¿Qué le pedirías al jefe de Proveedores antes de dar el proceso por terminado?

## Limpieza del laboratorio

Conserva la solución y los paquetes exportados. **Apaga** los flujos de prueba y borra las altas de prueba de `Proveedor` (`PRV-019` en adelante) si no las quieres. Si tu Trial está por vencer, exporta ahora (Lab 136).

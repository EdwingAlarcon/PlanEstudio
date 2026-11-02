---
moduleId: 56
title: "Fundamentos de JavaScript para Power Platform"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 18
practiceMinutes: 150
slug: "fundamentos-javascript-para-power-platform"
lastVerified: "2026-11"
---
*Lectura: 15-18 min · Práctica: unas 2 horas y media la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3 y el reto de transferencia). Si nunca programaste, es normal tardar más: cada error que veas es parte de la práctica.*

### 🎯 Objetivo
Aprender, desde cero, lo mínimo de JavaScript (variables, funciones, objetos, arrays, callbacks, promesas) necesario para entender el código de los módulos de JavaScript en formularios Model-Driven y de PCF con TypeScript — sin asumir experiencia previa de programación. Al terminar, habrás ejecutado cada ejemplo, leído una respuesta real de la Web API de Dataverse y corregido, con evidencia, un fragmento de código que propuso una IA.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (lo que imprimió tu consola, copiado tal cual). La regla de oro es **predecir antes de ejecutar**: escribe qué crees que va a salir y después compruébalo. La Microlección 3 es una actividad de **fallo y corrección**: una IA propone código para un formulario que parece correcto y no funciona; lo ejecutas, lees el error y lo corriges contra Microsoft Learn. Cierras con un **reto de transferencia**: un requisito nuevo que resuelves sin pasos.
>
> **Antes de empezar, necesitas:**
> - Un navegador (Microsoft Edge o Chrome) en una computadora. No instalas nada: vas a escribir el código en la **Console** de las herramientas de desarrollador.
> - **Opcional:** Node.js LTS, si ya lo tienes (por ejemplo, del Módulo 52). Todos los ejemplos funcionan igual guardándolos en un archivo `.js` y ejecutando `node archivo.js` en una terminal.
> - No necesitas ningún ambiente de Power Platform: los datos son de ejemplo con la forma que muestra Microsoft Learn. Este módulo es transversal; es la base que el [Módulo 13](/nivel/intermedio/modulo/javascript-y-pcf-basico) y el recurso [Fundamentos de JavaScript, TypeScript y React para PCF](/recursos/fundamentos-js-ts-react-para-pcf) dan por sabida.

### 📖 Conceptos Clave
- **Variable (`var`/`let`/`const`):** un nombre que guarda un valor. `const` no puede reasignarse (úsalo por defecto), `let` sí puede (úsalo si el valor cambia), `var` es la forma antigua y se evita en código nuevo. Ejemplo: `const nombre = "Ana";`. Ojo: si un `const` guarda un objeto, no puedes reemplazar el objeto, pero sí cambiar sus propiedades.

- **Tipos de dato:** un valor puede ser texto (`"Ana"`, entre comillas), número (`12000`, sin comillas), booleano (`true`/`false`), `null`, `undefined`, un objeto o un array. `typeof` te dice cuál es: `typeof "12,000"` es `"string"` aunque parezca un número.

- **Función:** un bloque de código reutilizable que recibe datos (parámetros) y puede devolver un resultado (`return`). `function saludar(nombre) { return "Hola " + nombre; }`. Una **función flecha** (`arrow function`) es una forma más corta de escribir lo mismo: `const saludar = (nombre) => "Hola " + nombre;`. Ambas formas aparecen en el código de Power Platform.

- **Objeto:** una colección de pares clave-valor, como una ficha de datos. `const cliente = { nombre: "Ana", activo: true };` se lee así: la clave `nombre` vale `"Ana"`. Se accede con `cliente.nombre` o `cliente["nombre"]`; la segunda forma es obligatoria cuando la clave tiene caracteres como `@` o `.`, algo habitual en las respuestas de Dataverse. Leer una clave que no existe devuelve `undefined`, no un error. En Dataverse, casi todo (un registro, un resultado de la Web API) llega como objeto.

- **Array:** una lista ordenada de valores. `const colores = ["rojo", "verde", "azul"];`. Se accede por posición empezando en 0: `colores[0]` es `"rojo"`, y `colores.length` es 3. El método `.forEach()` recorre cada elemento; `.map()` transforma cada elemento en uno nuevo y devuelve una lista del mismo tamaño; `.filter()` devuelve una lista nueva solo con los elementos que cumplen una condición. Los resultados de consultas a Dataverse (`retrieveMultipleRecords`) devuelven arrays de registros.

- **Callback:** una función que se pasa como argumento a otra función para que se ejecute más tarde, normalmente cuando algo termina (un clic, una respuesta del servidor). `boton.addEventListener("click", function() { alert("Clic!"); })` — la función anónima es el callback. En Power Platform, los handlers de eventos de formulario (`OnLoad`, `OnSave`) son callbacks que la plataforma llama por ti.

- **Promesa (`Promise`) y `.then()`:** una promesa representa un valor que **todavía no existe** pero existirá cuando termine una operación asíncrona (como pedir datos a un servidor). `.then(exito, error)` define qué hacer cuando la promesa se cumple o falla. Mientras esperas, el resto del código sigue corriendo. Todas las llamadas a la Dataverse Web API desde un formulario (`Xrm.WebApi.retrieveMultipleRecords(...)`) devuelven una promesa — por eso siempre van seguidas de `.then(...)` ([Learn: retrieveMultipleRecords](https://learn.microsoft.com/power-apps/developer/model-driven-apps/clientapi/reference/xrm-webapi/retrievemultiplerecords)).

- **`null` vs `undefined` vs falsy:** `null` significa "a propósito no hay valor"; `undefined` significa "todavía no se asignó nada". Ambos, junto con `0`, `""`, `false` y `NaN`, se evalúan como falso en un `if`. Esto explica por qué el código de Dataverse hace comprobaciones como `if (!clienteRef || clienteRef.length === 0)` antes de usar un valor — para evitar errores si el campo está vacío. En un formulario, el valor de una búsqueda (lookup) es un array de objetos con `id`, `name` y `entityType`, y cualquier columna vacía devuelve `null` ([Learn: getValue](https://learn.microsoft.com/power-apps/developer/model-driven-apps/clientapi/reference/attributes/getvalue)).

- **`=` frente a `===`:** `=` guarda un valor; `===` compara valor **y tipo**. `"12000" === 12000` es `false`; con `==` daría `true`, porque `==` convierte el texto antes de comparar. Por eso se prefiere `===`.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Variables, tipos y objetos en la consola

**¿Qué vas a aprender?** A abrir la consola del navegador, escribir tus primeras líneas y leer lo que responde, incluidos los errores.

**¿Por qué existe esto?** La consola es el lugar más rápido y seguro para experimentar: lo que escribes se ejecuta al instante y no toca ningún sistema. Es también donde un formulario de Dataverse muestra sus errores de JavaScript, así que aprender a leerla ahora te sirve en el Módulo 13.

**Práctica (25 min):**

1. Abre una pestaña nueva con cualquier página pública (por ejemplo, esta misma página del curso) y pulsa **Ctrl+Shift+J** (en macOS, **Command+Option+J**): se abre la herramienta **Console** ([Learn: Console de Microsoft Edge](https://learn.microsoft.com/microsoft-edge/devtools/console/)). No uses para practicar una pestaña donde tengas abierto tu ambiente de Dataverse, y nunca pegues en la consola código de alguien que no conoces. **Si el navegador te pide confirmar antes de dejarte pegar código**, sigue la instrucción que muestra; solo pega código de este módulo.
2. **Predice primero.** Antes de ejecutar el bloque, escribe en tu tabla qué crees que imprimirá cada `console.log`. Después pégalo en la consola y pulsa **Enter**. Para escribir varias líneas a mano sin ejecutarlas una por una, usa **Shift+Enter** al final de cada línea.
   ```javascript
   const nombre = "Ana";
   let solicitudesAbiertas = 2;
   solicitudesAbiertas = solicitudesAbiertas + 1;
   console.log(nombre, solicitudesAbiertas);   // Ana 3

   const cliente = { nombre: "Ana", activo: true, ciudad: "Bogotá" };
   console.log(cliente.nombre);       // Ana
   console.log(cliente["ciudad"]);    // Bogotá
   console.log(cliente.telefono);     // undefined: esa clave no existe

   cliente.activo = false;            // se puede cambiar una propiedad aunque el objeto sea const
   console.log(cliente.activo);       // false

   console.log(typeof 12000);         // number
   console.log(typeof "12,000");      // string
   ```
   **Qué deberías ver:** las mismas salidas de los comentarios (además, la consola puede mostrar `undefined` al final: es lo que devuelve la última línea, no un error). **Si ves `Uncaught SyntaxError: Identifier 'nombre' has already been declared`**, ya habías ejecutado el bloque en esa pestaña: Learn indica abrir una pestaña nueva y volver a pegarlo.
3. **Provoca un error a propósito** y léelo. Escribe `nombre = "Luis";` y pulsa Enter. **Qué deberías ver:** `TypeError: Assignment to constant variable.` (en el navegador suele ir precedido de `Uncaught`). La consola te dice qué tipo de error es y por qué: `nombre` es `const`.
4. Compara tipos:
   ```javascript
   console.log(12000 === 12000);      // true
   console.log("12000" === 12000);    // false: mismo número, distinto tipo
   console.log("12000" == 12000);     // true: == convierte el texto antes de comparar
   console.log(Boolean(null), Boolean(undefined), Boolean(0), Boolean(""), Boolean(NaN), Boolean("0"), Boolean([]));
   // false false false false false true true
   ```
   Fíjate en las dos últimas: el texto `"0"` y un array vacío **no** son falsy. Por eso el código de Dataverse revisa `clienteRef.length === 0` además de `!clienteRef`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Navegador y forma en que abriste la consola | ___ |
| Tus predicciones del paso 2 que fallaron (o "ninguna") y qué salió en realidad | ___ |
| Mensaje exacto del error del paso 3 | ___ |
| Qué imprimió `Boolean("0"), Boolean([])` y por qué te sorprendió (o no) | ___ |

---

## 🧩 Microlección 2 — Arrays, funciones y una respuesta real de la Web API

**¿Qué vas a aprender?** A recorrer y transformar listas con `forEach`, `map` y `filter`, a escribir funciones y callbacks, y a leer una respuesta de la Web API de Dataverse tal como la publica Microsoft Learn.

**¿Por qué existe esto?** Casi todo lo que vuelve de Dataverse es "una lista de objetos". Si sabes recorrerla y sacar una propiedad, puedes leer el 80 % del código de formularios y PCF que vas a encontrar.

**Práctica (35 min):**

1. Predice y ejecuta (en una pestaña nueva, o con `node archivo.js`):
   ```javascript
   const solicitudes = [
       { nombre: "Compra de laptops", estado: "Aprobado", monto: 12000 },
       { nombre: "Renovación de licencias", estado: "Pendiente", monto: 3500 },
       { nombre: "Viaje de trabajo", estado: "Aprobado", monto: null }
   ];

   console.log(solicitudes.length);        // 3
   console.log(solicitudes[0].nombre);     // Compra de laptops
   console.log(solicitudes[3]);            // undefined: no hay posición 3

   // forEach: recorre y hace algo con cada elemento (no devuelve nada)
   solicitudes.forEach(function (s) {
       console.log(s.nombre + " -> " + s.estado);
   });

   // map: construye una lista nueva, del mismo tamaño, transformando cada elemento
   const nombres = solicitudes.map(function (s) {
       return s.nombre;
   });
   console.log(nombres);

   // filter: construye una lista nueva solo con los elementos que cumplen la condición
   const aprobadas = solicitudes.filter((s) => s.estado === "Aprobado");
   console.log(aprobadas.length);          // 2
   ```
   **Qué deberías ver:** `3`, `Compra de laptops`, `undefined`, tres líneas con `nombre -> estado`, la lista de los tres nombres (el navegador puede mostrarla con `(3)` delante) y `2`.
2. **Un error frecuente, a propósito:** en un `map` con llaves `{ }`, si olvidas `return`, la lista sale llena de `undefined`. Compruébalo en una pestaña nueva:
   ```javascript
   const solicitudes = [{ nombre: "A" }, { nombre: "B" }];
   const nombres = solicitudes.map(function (s) {
       s.nombre;          // falta return
   });
   console.log(nombres);  // [ undefined, undefined ]
   ```
3. Funciones y callbacks:
   ```javascript
   function saludar(persona) {
       return "Hola, " + persona.nombre;
   }
   const saludarCorto = (persona) => "Hola, " + persona.nombre;

   console.log(saludar({ nombre: "Ana" }));        // Hola, Ana
   console.log(saludarCorto({ nombre: "Luis" }));  // Hola, Luis

   // Un callback: una función que le pasas a otra para que la llame después
   function avisarCuandoTermine(tarea, callback) {
       console.log("Haciendo: " + tarea);
       callback(tarea);
   }
   avisarCuandoTermine("guardar solicitud", function (t) {
       console.log("Listo: " + t);
   });
   ```
4. **Una respuesta real.** Este objeto está copiado del ejemplo con valores formateados de [Learn: Select columns](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/select-columns). Las filas vienen en el array `value`, y las claves con `@` solo se pueden leer con corchetes:
   ```javascript
   const respuesta = {
       "@odata.context": "[Organization URI]/api/data/v9.2/$metadata#accounts(name,revenue)",
       "value": [
           {
               "@odata.etag": "W/\"81359849\"",
               "name": "Litware, Inc. (sample)",
               "revenue@OData.Community.Display.V1.FormattedValue": "$20,000.00",
               "revenue": 20000.0000,
               "_primarycontactid_value@OData.Community.Display.V1.FormattedValue": "Susanna Stubberod (sample)",
               "_primarycontactid_value": "70bf4d48-34cb-ed11-b596-0022481d68cd",
               "customertypecode@OData.Community.Display.V1.FormattedValue": "Competitor",
               "customertypecode": 1,
               "accountid": "78914942-34cb-ed11-b596-0022481d68cd"
           }
       ]
   };

   const cuenta = respuesta.value[0];                  // las filas vienen en el array "value"
   console.log(cuenta.name);                           // Litware, Inc. (sample)
   console.log(cuenta.revenue);                        // 20000 (número)
   console.log(cuenta["revenue@OData.Community.Display.V1.FormattedValue"]); // $20,000.00 (texto)
   console.log(cuenta.customertypecode);               // 1: un Choice llega como número
   console.log(cuenta["customertypecode@OData.Community.Display.V1.FormattedValue"]); // Competitor
   console.log(respuesta.value.length);                // 1
   ```
   Fíjate en dos cosas: `20000.0000` se imprime como `20000` (es un número; los ceros no cambian su valor), y la misma columna viene dos veces, como número para calcular y como texto formateado para mostrar.
5. **Ahora haz algo — micropráctica (5 min):** **[Predecir qué imprime: objetos, arrays, map y filter](/practica/ip-js-011-predecir-arrays-y-objetos)**. Después comprueba tus predicciones en la consola.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Qué imprimió `console.log(nombres)` en el paso 1 | ___ |
| Qué imprimió el `map` sin `return` del paso 2 | ___ |
| Valor de `cuenta.customertypecode` y de su valor formateado | ___ |
| Por qué hay que escribir `cuenta["revenue@OData.Community.Display.V1.FormattedValue"]` y no `cuenta.revenue@OData...` | ___ |

---

## 🧩 Microlección 3 — Promesas y fallo y corrección: el código de formulario que propuso la IA

**¿Qué vas a aprender?** A seguir el orden en que se ejecuta el código con promesas, a manejar el caso de error y a corregir, con evidencia, un fragmento que una IA escribió para un formulario.

**¿Por qué existe esto?** Una IA mezcla con facilidad dos APIs que se parecen: la Web API "cruda" de Dataverse, que devuelve las filas en `value`, y `Xrm.WebApi` de los formularios, que las devuelve en `entities`. El código resultante se lee bien y falla al ejecutarse.

**Práctica (45 min):**

1. Predice el **orden** en que salen las líneas numeradas y ejecútalo:
   ```javascript
   function pedirDatosSimulado(exito) {
       // Una promesa representa algo que tardará (aquí, 1 segundo)
       return new Promise(function (resolve, reject) {
           setTimeout(function () {
               if (exito) {
                   resolve({ nombre: "Ana", solicitudesAbiertas: 3 });
               } else {
                   reject(new Error("No se pudo conectar"));
               }
           }, 1000);
       });
   }

   console.log("1. Pido los datos");
   pedirDatosSimulado(true).then(
       function (resultado) {
           console.log("3. Datos recibidos:", resultado);
       },
       function (error) {
           console.error("3. Error:", error.message);
       }
   );
   console.log("2. Esta línea se ejecuta ANTES de que lleguen los datos");

   pedirDatosSimulado(false).then(
       function (resultado) {
           console.log("Datos recibidos:", resultado);
       },
       function (error) {
           console.error("4. Error:", error.message);
       }
   );
   ```
   **Qué deberías ver:** `1`, `2` y, un segundo después, `3. Datos recibidos: ...` y `4. Error: No se pudo conectar` (en rojo). El `2` sale antes que el `3`: el código no espera a la promesa.
2. **El simulador.** Fuera de Dataverse no existe `Xrm`, así que este bloque lo imita. **Es una simulación**: reproduce la forma de la respuesta que documenta Learn para `Xrm.WebApi.retrieveMultipleRecords` (un objeto con un array `entities`) y su mensaje de error es inventado. En un formulario Model-Driven real, `Xrm` lo pone la plataforma. Pégalo primero, en una pestaña nueva:
   ```javascript
   // SIMULACIÓN para practicar fuera de Dataverse: imita la FORMA de la respuesta que documenta
   // Microsoft Learn para Xrm.WebApi.retrieveMultipleRecords (un objeto con un array "entities").
   // No es el Xrm real: en un formulario Model-Driven, Xrm lo pone la plataforma.
   const Xrm = {
       WebApi: {
           retrieveMultipleRecords: function (tabla, opciones) {
               return new Promise(function (resolve, reject) {
                   setTimeout(function () {
                       if (tabla !== "account") {
                           reject({ errorCode: 0, message: "Simulación: no conozco la tabla '" + tabla + "'" });
                           return;
                       }
                       resolve({
                           entities: [
                               { "@odata.etag": "W/\"1035541\"", name: "A. Datum", accountid: "475b158c-541c-e511-80d3-3863bb347ba8" },
                               { "@odata.etag": "W/\"947306\"", name: "Adventure Works", accountid: "a8a19cdd-88df-e311-b8e5-6c3be5a8b200" },
                               { "@odata.etag": "W/\"1033754\"", name: "Alpine Ski House", accountid: "aaa19cdd-88df-e311-b8e5-6c3be5a8b200" }
                           ]
                       });
                   }, 500);
               });
           }
       }
   };
   ```
3. **La salida de la IA.** Alguien pidió "una función para un formulario que muestre en la consola el nombre de 3 cuentas". Pégala debajo del simulador, en la misma pestaña:
   ```javascript
   // Lo que propuso el asistente de IA para "mostrar en consola el nombre de 3 cuentas"
   function mostrarCuentas() {
       Xrm.WebApi.retrieveMultipleRecords("account", "?$select=name&$top=3").then(function (result) {
           result.value.forEach(function (cuenta) {
               console.log(cuenta.name);
           });
       });
   }
   mostrarCuentas();
   ```
   **Qué deberías ver:** ningún nombre y un error `TypeError: Cannot read properties of undefined (reading 'forEach')` (en el navegador suele ir precedido de `Uncaught (in promise)`). Anota la línea que señala.
4. **Diagnosticar antes de corregir — micropráctica (8 min):** **[Diagnosticar: la lista de cuentas nunca se imprime](/practica/ip-js-012-diagnosticar-value-vs-entities)**. Formula tu hipótesis antes de abrir las pistas. Ahí verás también el "arreglo" que propuso la IA (cambiar `"account"` por `"accounts"`): si quieres, pruébalo en una pestaña nueva con el simulador y anota qué error aparece entonces.
5. **Escribe tu versión corregida** sin mirar la de referencia, con dos criterios: (1) la función imprime los tres nombres con el simulador; (2) si la promesa falla, se muestra un mensaje claro en vez de un error sin manejar. Para comprobar el criterio 2, cambia temporalmente `"account"` por otra palabra y ejecuta. Verifica cada nombre que uses en [Learn: retrieveMultipleRecords](https://learn.microsoft.com/power-apps/developer/model-driven-apps/clientapi/reference/xrm-webapi/retrievemultiplerecords): qué espera el primer parámetro y qué propiedades trae el resultado.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Orden en que salieron las líneas del paso 1 (y si lo predijiste bien) | ___ |
| Error exacto del código de la IA y la línea que señaló | ___ |
| Qué cambiaste y la frase de Learn que lo respalda | ___ |
| Salida de tu versión con el simulador | ___ |
| Salida de tu versión con un nombre de tabla incorrecto (criterio 2) | ___ |

**Contrasta tu versión (solo después de llenar la tabla).** Una corrección posible, ejecutada con el simulador:

```javascript
function mostrarCuentas() {
    return Xrm.WebApi.retrieveMultipleRecords("account", "?$select=name&$top=3").then(
        function (result) {
            result.entities.forEach(function (cuenta) {   // Xrm.WebApi devuelve las filas en "entities"
                console.log(cuenta.name);
            });
        },
        function (error) {                                // segundo callback: qué hacer si falla
            console.error("No se pudieron leer las cuentas: " + error.message);
        }
    );
}
mostrarCuentas();
```

Con el simulador imprime `A. Datum`, `Adventure Works` y `Alpine Ski House`. Con `"accounts"` imprime `No se pudieron leer las cuentas: Simulación: no conozco la tabla 'accounts'` (el mensaje real de Dataverse será otro). Learn documenta que el error que recibe ese segundo callback trae `errorCode` y `message`.

| Dónde estás | Nombre de la tabla | Dónde vienen las filas |
|---|---|---|
| `Xrm.WebApi.retrieveMultipleRecords` (formulario, Módulo 13) | Nombre lógico: `account` | `result.entities` |
| Web API por HTTP (navegador o script, Módulo 53) | EntitySet en la URL: `accounts` | `respuesta.value` |

---

## 🔁 Reto de transferencia — Sumar el revenue de una respuesta de la Web API

Cambia el contexto y el requisito: ya no estás en un formulario listando nombres; tienes la respuesta cruda de la Web API (la de la tabla anterior, con `value`) y te piden un **total**. Este objeto tiene la misma forma que las respuestas de Learn, con valores de ejemplo (pégalo en una pestaña nueva):

```javascript
// Misma forma que una respuesta de la Web API en Learn (array "value", @odata.nextLink); valores de ejemplo
const respuesta = {
    "@odata.context": "[Organization URI]/api/data/v9.2/$metadata#accounts(name,revenue)",
    "value": [
        { "@odata.etag": "W/\"81052965\"", "name": "Litware, Inc. (sample)", "revenue": 20000.0000, "accountid": "4624eff7-53d3-ed11-a7c7-000d3a993550" },
        { "@odata.etag": "W/\"81550512\"", "name": "Adventure Works (sample)", "revenue": null, "accountid": "1adef0b8-54d3-ed11-a7c7-000d3a993550" },
        { "@odata.etag": "W/\"81359849\"", "name": "A. Datum Corporation (sample)", "revenue": 10000.0000, "accountid": "4b757ff7-9c85-ee11-8179-000d3a9933c9" }
    ],
    "@odata.nextLink": "[Organization URI]/api/data/v9.2/accounts?$select=name,revenue&$skiptoken=..."
};
```

1. **Micropráctica (7 min):** **[Transferir: sumar el revenue de una respuesta de la Web API](/practica/ip-js-013-transferir-sumar-respuesta-web-api)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **Sin pasos:** escribe tú el código, debajo del objeto, para que imprima exactamente estas tres líneas:
   ```text
   Total: 30000
   Cuentas sin revenue: 1
   Ojo: hay más páginas; este total es solo de la primera.
   ```
   Solo necesitas lo que ya usaste: `let`, `forEach`, `if`, `===` y corchetes para la clave con `@`.
3. **Prueba que no te engaña:** cambia el `revenue` de la segunda cuenta por `"5000"` (texto, con comillas) y ejecuta otra vez. ¿Qué imprime tu total? Anótalo y decide qué harías con un monto que llega como texto.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu código (pégalo completo) | ___ |
| Salida exacta de tu código con los datos originales | ___ |
| Salida con el `"5000"` como texto y qué harías al respecto | ___ |
| Qué propiedad recorriste y por qué no es `entities` | ___ |

### 💼 Caso Real de Negocio
**Empresa:** Consultora de Power Platform con nuevos analistas funcionales aprendiendo a leer código.
**Problema:** Los analistas podían configurar Power Platform sin código, pero se bloqueaban al revisar o ajustar Web Resources JavaScript existentes porque nunca habían programado.
**Solución:** Antes de tocar código de producción, cada analista practica estos mismos cuatro conceptos (variables, objetos, arrays, promesas) en la consola del navegador con datos de ejemplo parecidos a los de Dataverse.
**Resultado:** Los analistas dejaron de depender de un desarrollador para cambios triviales de JavaScript (ej. cambiar un mensaje de validación) y ganaron confianza para avanzar al módulo de PCF.

### ✅ Buenas Prácticas
- Prefiere `const` por defecto; usa `let` solo si el valor realmente va a cambiar; evita `var`.
- Nombra variables y funciones en español o inglés de forma consistente con el resto del proyecto — nunca mezcles ambos en el mismo archivo.
- Practica en la consola del navegador (F12) antes de escribir código dentro de Dataverse — es el entorno más rápido para experimentar sin riesgo. Usa una pestaña aparte, no la de tu ambiente, y no pegues código que no entiendes.
- Predice qué va a imprimir un fragmento antes de ejecutarlo: así una sorpresa se convierte en aprendizaje en vez de pasar inadvertida.
- Siempre maneja el caso de error de una promesa (`.then(exito, error)`); una promesa sin manejar oculta fallos silenciosos.
- Comprueba `null`/`undefined` antes de leer una propiedad o sumar un valor que viene de Dataverse.
- Cuando una IA te dé código para Dataverse, verifica en Learn los nombres que usa (tabla, propiedades del resultado) y ejecútalo antes de darlo por bueno.
- No memorices sintaxis — entiende qué problema resuelve cada concepto (un objeto agrupa datos, una promesa espera algo, un callback reacciona a algo).

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot read properties of undefined` | Se accede a una propiedad de un objeto que todavía no existe (ej. una respuesta que no llegó, o `result.value` en un resultado de `Xrm.WebApi`) | Comprobar que el valor exista antes de usarlo: `if (cliente) { ... }`; y leer `entities` en `Xrm.WebApi`, `value` en la Web API |
| El código de la promesa nunca se ejecuta | Se olvidó `.then(...)` después de llamar una función que devuelve una promesa | Toda función que devuelve `Promise` necesita `.then()` (o `await`) para usar su resultado |
| `Uncaught (in promise)` o un rechazo sin manejar | Falta el segundo callback de `.then` (o un `.catch`) | Agregar el callback de error y mostrar `error.message` |
| Confundir `=` con `==`/`===` | `=` asigna un valor, `==`/`===` comparan | Usar `===` para comparar (compara tipo y valor); `=` solo para asignar |
| El array parece vacío pero tiene datos | Se intenta acceder con una clave de objeto (`array["nombre"]`) en vez de un índice numérico (`array[0]`) | Los arrays se recorren por posición numérica, los objetos por clave de texto |
| Un `map` devuelve `[undefined, undefined]` | Falta `return` dentro de una función con llaves `{ }` | Agregar `return`, o usar una flecha sin llaves: `(s) => s.nombre` |
| `TypeError: Assignment to constant variable.` | Se reasignó una variable declarada con `const` (por ejemplo, un total) | Declarar con `let` lo que va a cambiar |
| `Identifier '...' has already been declared` en la consola | Se pegó dos veces el mismo bloque en la misma pestaña | Abrir una pestaña nueva y pegarlo otra vez |
| Un total sale `NaN` o como `"20000null10000"` | Se sumó `undefined` (da `NaN`) o el total empezó como texto `""` (pega en vez de sumar) | Empezar en `0` y revisar `null`/`undefined` antes de sumar |

### 🧪 Criterios de Validación
- [ ] Puedo explicar la diferencia entre `const` y `let` con un ejemplo propio
- [ ] Puedo leer un objeto (`cliente.nombre`) y un array (`colores[0]`) sin ayuda
- [ ] Puedo explicar qué hace `.forEach()` frente a `.map()`
- [ ] Puedo explicar qué devuelve `.filter()` y por qué `.length` da un número
- [ ] Leí el mensaje de un error (`TypeError`) en la consola y dije qué línea lo causó y por qué
- [ ] Leí con corchetes un valor formateado de una respuesta de la Web API copiada de Learn
- [ ] Puedo explicar, en mis palabras, por qué una llamada a la Web API de Dataverse necesita `.then()`
- [ ] Corregí el código que propuso la IA (`entities` en vez de `value` y callback de error), verificándolo en Learn y con el simulador
- [ ] En el reto de transferencia escribí sin pasos un código que imprime el total, las cuentas sin revenue y el aviso de más páginas
- [ ] Ejecuté las actividades en la consola del navegador (o con `node`) y anoté los resultados en las tablas de evidencia

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones y del reto de transferencia.
- Tu versión corregida de `mostrarCuentas` y tu código del reto, cada uno con su salida.

> **Siguiente paso:** el [Módulo 13](/nivel/intermedio/modulo/javascript-y-pcf-basico) usa estos conceptos en un formulario Model-Driven real (`formContext`, `getValue`, `Xrm.WebApi`). Si quieres ver la Web API "cruda" por dentro, el [Módulo 53](/nivel/ia/modulo/dataverse-web-api-y-autenticacion) la recorre desde el navegador y desde un script de Node.js.

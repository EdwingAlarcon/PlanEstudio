---
moduleId: 56
title: "Fundamentos de JavaScript para Power Platform"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 12
slug: "fundamentos-javascript-para-power-platform"
---
### 🎯 Objetivo
Aprender, desde cero, lo mínimo de JavaScript (variables, funciones, objetos, arrays, callbacks, promesas) necesario para entender el código de los módulos de JavaScript en formularios Model-Driven y de PCF con TypeScript — sin asumir experiencia previa de programación.

### 📖 Conceptos Clave
- **Variable (`var`/`let`/`const`):** un nombre que guarda un valor. `const` no puede reasignarse (úsalo por defecto), `let` sí puede (úsalo si el valor cambia), `var` es la forma antigua y se evita en código nuevo. Ejemplo: `const nombre = "Ana";`.

- **Función:** un bloque de código reutilizable que recibe datos (parámetros) y puede devolver un resultado (`return`). `function saludar(nombre) { return "Hola " + nombre; }`. Una **función flecha** (`arrow function`) es una forma más corta de escribir lo mismo: `const saludar = (nombre) => "Hola " + nombre;`. Ambas formas aparecen en el código de Power Platform.

- **Objeto:** una colección de pares clave-valor, como una ficha de datos. `const cliente = { nombre: "Ana", activo: true };` se lee así: la clave `nombre` vale `"Ana"`. Se accede con `cliente.nombre` o `cliente["nombre"]`. En Dataverse, casi todo (un registro, un resultado de la Web API) llega como objeto.

- **Array:** una lista ordenada de valores. `const colores = ["rojo", "verde", "azul"];`. Se accede por posición empezando en 0: `colores[0]` es `"rojo"`. El método `.forEach()` recorre cada elemento; `.map()` transforma cada elemento en uno nuevo. Los resultados de consultas a Dataverse (`retrieveMultipleRecords`) devuelven arrays de registros.

- **Callback:** una función que se pasa como argumento a otra función para que se ejecute más tarde, normalmente cuando algo termina (un clic, una respuesta del servidor). `boton.addEventListener("click", function() { alert("Clic!"); })` — la función anónima es el callback. En Power Platform, los handlers de eventos de formulario (`OnLoad`, `OnSave`) son callbacks que la plataforma llama por ti.

- **Promesa (`Promise`) y `.then()`:** una promesa representa un valor que **todavía no existe** pero existirá cuando termine una operación asíncrona (como pedir datos a un servidor). `.then(exito, error)` define qué hacer cuando la promesa se cumple o falla. Todas las llamadas a la Dataverse Web API (`Xrm.WebApi.retrieveMultipleRecords(...)`) devuelven una promesa — por eso siempre van seguidas de `.then(...)`.

- **`null` vs `undefined` vs falsy:** `null` significa "a propósito no hay valor"; `undefined` significa "todavía no se asignó nada". Ambos, junto con `0`, `""` y `false`, se evalúan como falso en un `if`. Esto explica por qué el código de Dataverse hace comprobaciones como `if (!clienteRef || clienteRef.length === 0)` antes de usar un valor — para evitar errores si el campo está vacío.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 56.1: Variables, funciones y objetos en la consola del navegador
1. Abre cualquier página web, presiona F12 (herramientas de desarrollador) y abre la pestaña "Console".
2. Escribe línea por línea y observa el resultado:
```javascript
const nombre = "Ana";
const cliente = { nombre: "Ana", activo: true };
console.log(cliente.nombre);       // "Ana"
console.log(cliente.activo);       // true

function saludar(persona) {
    return "Hola, " + persona.nombre;
}
console.log(saludar(cliente));     // "Hola, Ana"
```
3. Cambia `cliente.activo` a `false` y vuelve a ejecutar `console.log(cliente.activo)` — confirma que el objeto cambió.

#### Actividad 56.2: Arrays y recorridos, como una lista de registros de Dataverse
```javascript
const solicitudes = [
    { nombre: "Compra de laptops", estado: "Aprobado" },
    { nombre: "Renovación de licencias", estado: "Pendiente" },
    { nombre: "Viaje de trabajo", estado: "Aprobado" }
];

// Recorrer todos los elementos
solicitudes.forEach(function(s) {
    console.log(s.nombre + " -> " + s.estado);
});

// Transformar en una lista de solo nombres
const nombres = solicitudes.map(function(s) {
    return s.nombre;
});
console.log(nombres); // ["Compra de laptops", "Renovación de licencias", "Viaje de trabajo"]
```
Esta es exactamente la forma en que el módulo de JavaScript y PCF recorre los resultados de `retrieveMultipleRecords`.

#### Actividad 56.3: Simular una promesa, como una llamada a la Web API
```javascript
function pedirDatosSimulado() {
    // Promise representa algo que tardará en resolverse (aquí, 1 segundo)
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            const exito = true;
            if (exito) {
                resolve({ nombre: "Ana", solicitudesAbiertas: 3 });
            } else {
                reject(new Error("No se pudo conectar"));
            }
        }, 1000);
    });
}

pedirDatosSimulado().then(
    function(resultado) {
        console.log("Datos recibidos:", resultado);
    },
    function(error) {
        console.error("Error:", error.message);
    }
);
```
Compara esta estructura con `Xrm.WebApi.retrieveMultipleRecords(...).then(...)` del módulo de JavaScript y PCF — es el mismo patrón: pides algo, no llega inmediato, reaccionas cuando llega (o falla).

### 💼 Caso Real de Negocio
**Empresa:** Consultora de Power Platform con nuevos analistas funcionales aprendiendo a leer código.
**Problema:** Los analistas podían configurar Power Platform sin código, pero se bloqueaban al revisar o ajustar Web Resources JavaScript existentes porque nunca habían programado.
**Solución:** Antes de tocar código de producción, cada analista practica estos mismos cuatro conceptos (variables, objetos, arrays, promesas) en la consola del navegador con datos de ejemplo parecidos a los de Dataverse.
**Resultado:** Los analistas dejaron de depender de un desarrollador para cambios triviales de JavaScript (ej. cambiar un mensaje de validación) y ganaron confianza para avanzar al módulo de PCF.

### ✅ Buenas Prácticas
- Prefiere `const` por defecto; usa `let` solo si el valor realmente va a cambiar; evita `var`.
- Nombra variables y funciones en español o inglés de forma consistente con el resto del proyecto — nunca mezcles ambos en el mismo archivo.
- Practica en la consola del navegador (F12) antes de escribir código dentro de Dataverse — es el entorno más rápido para experimentar sin riesgo.
- Siempre maneja el caso de error de una promesa (`.then(exito, error)`); una promesa sin manejar oculta fallos silenciosos.
- No memorices sintaxis — entiende qué problema resuelve cada concepto (un objeto agrupa datos, una promesa espera algo, un callback reacciona a algo).

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot read properties of undefined` | Se accede a una propiedad de un objeto que todavía no existe (ej. una respuesta que no llegó) | Comprobar que el valor exista antes de usarlo: `if (cliente) { ... }` |
| El código de la promesa nunca se ejecuta | Se olvidó `.then(...)` después de llamar una función que devuelve una promesa | Toda función que devuelve `Promise` necesita `.then()` (o `await`) para usar su resultado |
| Confundir `=` con `==`/`===` | `=` asigna un valor, `==`/`===` comparan | Usar `===` para comparar (compara tipo y valor); `=` solo para asignar |
| El array parece vacío pero tiene datos | Se intenta acceder con una clave de objeto (`array["nombre"]`) en vez de un índice numérico (`array[0]`) | Los arrays se recorren por posición numérica, los objetos por clave de texto |

### 🧪 Criterios de Validación
- [ ] Puedo explicar la diferencia entre `const` y `let` con un ejemplo propio
- [ ] Puedo leer un objeto (`cliente.nombre`) y un array (`colores[0]`) sin ayuda
- [ ] Puedo explicar qué hace `.forEach()` frente a `.map()`
- [ ] Puedo explicar, en mis palabras, por qué una llamada a la Web API de Dataverse necesita `.then()`
- [ ] Ejecuté las tres actividades en la consola del navegador y obtuve los resultados esperados

---

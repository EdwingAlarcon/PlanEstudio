---
moduleId: 46
title: "Vibe Coding Controlado"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 15
practiceMinutes: 150
slug: "vibe-coding-controlado"
lastVerified: "2026-11"
---
*Lectura: 12-15 min · Práctica: unas 2 horas y media la primera vez, mejor en dos sesiones (la primera hasta la Microlección 2; la segunda, la Microlección 3 y los dos retos).*

### 🎯 Objetivo
Distinguir cuándo generar código sin especificación exhaustiva ("vibe coding") es aceptable en un contexto empresarial, y qué controles mínimos lo convierten en una práctica segura en lugar de un riesgo. Al terminar habrás encontrado y corregido, con pruebas, los fallos de una regla de aprobación generada por IA que parecía correcta.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que observaste, no un sí/no). La Microlección 3 es una actividad de **fallo y corrección**: recibes código generado por IA con errores plausibles, los detectas, los corriges y dejas constancia de qué verificaste y contra qué. Cierras **decidiendo y defendiendo** una regla de equipo y con un **reto de transferencia** sobre otro artefacto.
>
> **Antes de empezar, necesitas:**
> - **Node.js 20 o posterior.** Para comprobarlo, abre una terminal (en VS Code, **Terminal** > **New Terminal**; se abre abajo, en la carpeta que tengas abierta) y escribe `node --version`. Si responde que el comando no existe, instala la versión **LTS** desde [nodejs.org](https://nodejs.org), cierra y vuelve a abrir VS Code, y repite la comprobación (cuenta unos 10 minutos). Desde la versión 20 el ejecutor de pruebas integrado `node:test` es estable ([documentación de Node.js](https://nodejs.org/api/test.html)), así que no instalas nada más.
> - Un editor y, si lo tienes, un asistente de IA (los de los Módulos 44 y 45 sirven). **Si no tienes ninguno**, no pasa nada: la Microlección 3 te da la salida de la IA ya escrita, y en las Microlecciones 1 y 2 puedes escribir tú el script.
> - Este módulo es transversal: no necesitas haber hecho ningún nivel de certificación ni tener un tenant de Power Platform.

### 📖 Conceptos Clave
- **Vibe coding:** dejar que un modelo genere una implementación completa a partir de una descripción de alto nivel, iterando sobre el resultado en lugar de especificar cada detalle por adelantado.
- **Cuándo es aceptable:** prototipos descartables, scripts de un solo uso, exploración de una idea antes de comprometerse a una arquitectura, componentes de UI sin lógica de negocio sensible.
- **Cuándo NO es aceptable sin controles:** código que toca datos de producción, seguridad, lógica de negocio con impacto financiero/legal, o cualquier cosa que se vaya a desplegar sin pasar por code review humano.
- **Controles mínimos que lo hacen seguro:** alcance acotado (un archivo o módulo, no todo el sistema), tests que validen el comportamiento esperado (no solo que "compile"), y revisión humana obligatoria antes de fusionar a la rama principal — los mismos controles que ya exige este plan de estudio para cualquier cambio (Solution Checker, CI, code review).
- **Diferencia con desarrollo asistido "normal":** vibe coding no elimina la necesidad de estos controles — los vuelve más críticos, porque el humano invirtió menos tiempo revisando cada línea mientras se escribía.
- **Error plausible:** el código generado casi nunca falla de forma escandalosa; falla en lo que la descripción no dijo (un dato que llega como texto, el propio solicitante aprobándose, un rol leído de donde no se debía). Pasa las pruebas del "caso feliz" y se rompe en los bordes.
- **Fallar cerrado:** una validación de permisos que no entiende un dato debe **rechazar**, no aprobar. Un `return true` "por defecto" al final de una regla de permisos es una puerta abierta.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Riesgo primero: cuándo vale el vibe coding

**¿Qué vas a aprender?** A decidir, antes de escribir el prompt, si una tarea admite vibe coding y qué controles exige.

**¿Por qué existe esto?** La misma instrucción de alto nivel ("hazme X completo") es razonable para un script que se tira y temeraria para una regla que decide pagos. La diferencia no está en la herramienta, sino en qué pasa si el resultado trae un error que no ves.

**Ahora haz algo — micropráctica (5 min):** clasifica cinco encargos según su riesgo → **[Decidir cuándo vale el vibe coding](/practica/ip-ia-010-cuando-vale-el-vibe-coding)**.

**Práctica real (25 min):**

1. Prompt de bajo riesgo (apto para vibe coding):
   ```
   Escribe un script Node.js que lea un CSV de solicitudes de prueba (columnas: titulo, estado, fecha) y
   genere un resumen por estado en consola. Es un script de un solo uso, fuera de la rama principal.
   ```
   Pide al agente que lo resuelva completo con una sola instrucción de alto nivel, sin revisar cada paso intermedio — es aceptable porque el alcance es acotado y descartable. Guárdalo como `resumen.mjs` en una carpeta de práctica (no en un repositorio de trabajo) y crea un `solicitudes.csv` con 5 o 6 filas inventadas. Ejecútalo con `node resumen.mjs`. **Qué deberías ver:** una línea por estado con su conteo. **Si no tienes asistente de IA**, escribe tú el script: el objetivo de las microlecciones siguientes es probarlo, no generarlo.
2. Prompt de alto riesgo (NO apto para vibe coding sin controles):
   ```
   Genera la validación de seguridad que decide si un usuario puede aprobar un pago mayor a $10,000 en
   el plugin de Aprobaciones.
   ```
   *Contraste:* aquí no basta con "una instrucción de alto nivel" — necesitas especificar la regla de negocio exacta, revisar cada línea, y agregar tests antes de aceptar el resultado. Explica qué controles adicionales (tests, revisión línea por línea, ambiente de prueba) necesitarías aquí que no necesitaste en el paso 1. **No uses este resultado todavía:** en la Microlección 3 trabajarás sobre una salida concreta de este tipo.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Salida exacta de `node resumen.mjs` con tu CSV (las líneas que imprimió) | ___ |
| Herramienta de IA que usaste (o "escrito a mano") | ___ |
| Tres controles que exigirías al prompt de alto riesgo y que no exigiste al de bajo riesgo | ___ |

---

## 🧩 Microlección 2 — Un script "descartable" también necesita una prueba

**¿Qué vas a aprender?** A escribir una prueba mínima con el ejecutor integrado de Node.js y a buscar los casos de borde que la descripción no cubrió.

**¿Por qué existe esto?** Un script descartable deja de serlo el día en que alguien lo reutiliza. Una prueba de dos minutos documenta qué hace y qué no, y es la forma más barata de encontrar lo que el modelo supuso por su cuenta.

**Práctica real (30 min):**

1. Separa el cálculo de la lectura del archivo, en **dos archivos** (pídeselo a la IA o hazlo tú):
   - `resumen.mjs` contiene **solo** la función exportada, por ejemplo `export function resumirPorEstado(filas)`, que recibe las filas ya leídas y devuelve un objeto `{ estado: conteo }`. Nada más: ni `readFileSync` ni `console.log`.
   - `main.mjs` lee `solicitudes.csv`, importa la función con `import { resumirPorEstado } from "./resumen.mjs";` e imprime el resultado. Desde ahora ejecutas el script con `node main.mjs`, que debe imprimir lo mismo que antes.

   **Por qué dos archivos:** al importar un módulo, Node ejecuta todo su código de primer nivel. Si la lectura del CSV queda en `resumen.mjs`, la prueba la ejecuta también: verás el resumen mezclado con la salida de la prueba y, si lanzas `node --test` desde otra carpeta, la prueba entera falla con `ENOENT` porque no encuentra `solicitudes.csv`.
2. Crea `resumen.test.mjs` junto al script. Esqueleto con el ejecutor integrado (`node:test`) y las aserciones estrictas (`node:assert/strict`):
   ```js
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { resumirPorEstado } from "./resumen.mjs";

   test("cuenta cada estado una vez por fila", () => {
     const filas = [
       { titulo: "A", estado: "Nueva", fecha: "2026-10-01" },
       { titulo: "B", estado: "Nueva", fecha: "2026-10-02" },
       { titulo: "C", estado: "Cerrada", fecha: "2026-10-03" },
     ];
     assert.deepEqual(resumirPorEstado(filas), { Nueva: 2, Cerrada: 1 });
   });
   ```
   Ejecuta `node --test` en esa carpeta (busca solo los archivos que terminan en `.test.mjs`, entre otros patrones). **Qué deberías ver:** un resumen con `pass 1` y `fail 0`. **Si ves un error de importación**, revisa que la función esté exportada con ese nombre exacto y que ambos archivos usen la extensión `.mjs`. **Si ves `ENOENT ... solicitudes.csv`**, la lectura del archivo sigue dentro de `resumen.mjs`: muévela a `main.mjs` (paso 1).
3. **Caso de borde que pasa pruebas superficiales pero falla:** agrega una prueba con una fila con el campo `estado` vacío y otra con espacios en blanco en vez de texto (`"   "`). Es común que vibe coding sin especificación exhaustiva agrupe estos casos incorrectamente (ej. los cuenta como un estado válido llamado "" o los ignora silenciosamente sin avisar). Decide primero qué **debería** pasar (por ejemplo, agruparlos bajo `"Sin estado"`), escríbelo en la prueba y ejecútala.
4. Si la prueba falla, corrige la función (o pídele a la IA que la corrija **dándole la prueba que falla**) y vuelve a ejecutar `node --test` hasta ver `fail 0`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Resultado de `node --test` con la primera prueba (`pass`/`fail`) | ___ |
| Qué devolvía la función para la fila vacía y la de espacios **antes** de corregirla | ___ |
| Qué decidiste que debía pasar y por qué | ___ |
| Instrucción que le habrías dado al modelo desde el principio para evitar este caso de borde | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: la regla de aprobación que generó la IA

**¿Qué vas a aprender?** A revisar una salida generada por IA que **parece** correcta, encontrar sus fallos de seguridad y de lógica con pruebas, corregirla y dejar constancia de qué verificaste y contra qué.

**¿Por qué existe esto?** Es el trabajo real del vibe coding controlado: la IA escribe en segundos; la responsabilidad de que la regla sea correcta sigue siendo tuya. Aquí todos parten de la misma salida, para que la evidencia sea comparable.

**La regla de negocio (esto es la especificación, no la salida de la IA):**
- Los pagos de **hasta 10,000** (incluido 10,000) los aprueba un usuario con rol **Aprobador** o **Gerente Financiero**.
- Los pagos **mayores a 10,000** solo los aprueba un **Gerente Financiero**.
- **Nadie aprueba su propio pago.**
- Los roles son los del **usuario autenticado**; la solicitud no puede decidir quién la aprueba.

**La salida de la IA.** Alguien le pidió a un asistente "una función que decida si un usuario puede aprobar un pago; los pagos mayores a 10,000 requieren rol Gerente Financiero" y obtuvo esto. Guárdalo como `aprobaciones.mjs` en una carpeta nueva:

```js
// aprobaciones.mjs: salida tal como la entregó el asistente de IA (contiene errores a propósito)
export const UMBRAL = 10000;

export function puedeAprobarPago(usuario, solicitud) {
  // Los pagos grandes requieren el rol de gerente financiero
  if (solicitud.monto > UMBRAL) {
    return usuario.roles.includes("Gerente Financiero") ||
      solicitud.rolAprobador === "Gerente Financiero"; // por si el rol viene en la solicitud
  }
  return true; // los pagos pequeños no necesitan validación especial
}
```

**Diagnosticar antes de corregir — micropráctica (7 min):** en el ambiente de pruebas, una persona con rol Aprobador aprobó un pago de 12,000 → **[Diagnosticar: la regla de la IA aprueba un pago que no debía](/practica/ip-ia-011-diagnosticar-pago-aprobado-por-error)**. Formula tu hipótesis antes de abrir las pistas.

**Práctica real (40 min):**

1. **Prueba lo que la IA sí probó.** Crea `aprobaciones.test.mjs` con estas tres pruebas (las del "caso feliz") y ejecuta `node --test`:
   ```js
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { puedeAprobarPago } from "./aprobaciones.mjs";

   const ana = { id: "u-ana", roles: ["Aprobador"] };            // aprueba montos chicos
   const luis = { id: "u-luis", roles: ["Gerente Financiero"] }; // aprueba cualquier monto

   test("un Aprobador aprueba 10000 exactos", () => {
     assert.equal(puedeAprobarPago(ana, { monto: 10000, solicitanteId: "u-x" }), true);
   });
   test("un Aprobador NO aprueba 10001", () => {
     assert.equal(puedeAprobarPago(ana, { monto: 10001, solicitanteId: "u-x" }), false);
   });
   test("el Gerente Financiero aprueba 25000", () => {
     assert.equal(puedeAprobarPago(luis, { monto: 25000, solicitanteId: "u-x" }), true);
   });
   ```
   **Qué deberías ver:** `pass 3`, `fail 0`. Así es como la regla llegó "probada" a revisión.
2. **Busca los fallos tú.** Recorre cada punto de la regla de negocio y escribe **una prueba por punto** que la función debería cumplir. Pistas de dónde mirar, sin darte la prueba: un usuario sin ningún rol; una solicitud que trae su propio `rolAprobador`; un monto que llegó como texto desde una hoja de cálculo (`"12,000"`); el solicitante aprobándose a sí mismo. Ejecuta `node --test` y anota cuáles fallan.
3. **Corrige la función** sin tocar las pruebas. Criterios de aceptación: (1) todas tus pruebas pasan; (2) ante un monto que no es un número finito y positivo, la función devuelve `false` (falla cerrada); (3) los roles se leen solo de `usuario.roles`; (4) no queda ningún `return true` que no compruebe un rol. Si usas la IA para corregir, dale la regla de negocio y las pruebas que fallan, no solo "arréglalo".
4. **Rompe a propósito para confirmar.** En tu función corregida, **reemplaza** la última comprobación de rol (el último `return ...`, el que decide los pagos de hasta 10,000, por ejemplo `return roles.includes("Aprobador") || ...`) por `return true;` y ejecuta `node --test`: al menos una prueba tiene que fallar. Si ninguna falla, te falta una prueba. Deshaz el cambio. **Ojo:** no *añadas* `return true;` después del último `return`: esa línea nunca se ejecuta (código muerto) y ninguna prueba fallaría aunque tus pruebas estén bien.

> **Ojo con dónde vive la regla:** en Power Platform una validación de permisos de este tipo no se confía solo al cliente (una app o un script que el usuario controla): se apoya en los roles de seguridad de Dataverse y en lógica del lado del servidor. La función de este ejercicio sirve para practicar la revisión; la ubicación correcta de la regla se decide en el diseño.

**Evidencia a reportar (una fila por fallo que encontraste):**

| Fallo encontrado | Prueba que lo demuestra (nombre) | Resultado antes / después de corregir | Corrección aplicada | Contra qué lo verificaste (punto de la regla, documentación o prueba) |
|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Resultado de `node --test` con la salida original de la IA (`pass` / `fail`) | ___ |
| Resultado con tu versión corregida | ___ |
| ¿Qué prueba falló cuando reemplazaste el último `return` por `return true`? | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — la regla de equipo

> **Situación:** tu equipo de SIT empieza a usar asistentes de IA a diario. El líder técnico te pide **una regla de una sola frase** que decida cuándo se permite vibe coding, y que se pueda aplicar sin discutir caso por caso (ej. "solo en prototipos y scripts fuera de la rama principal, nunca en lógica de aprobación o pagos").
> **Entrega:** la frase, más tres a cinco líneas que la defiendan usando lo que encontraste en las Microlecciones 2 y 3.

No hay una única frase correcta: la evidencia es tu decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Distingue por riesgo, no por herramienta | La frase nombra qué tipo de cambio queda fuera (dinero, permisos, datos de producción), no "Copilot sí, otro no" |
| Es verificable | Otra persona puede decidir si un PR la cumple sin preguntarte |
| Exige pruebas de comportamiento | Menciona pruebas que fallen si la regla de negocio se rompe, no solo "que compile" |
| Mantiene la revisión humana | Ningún resultado de vibe coding llega a la rama principal sin revisión de otra persona |
| Se apoya en tu evidencia | Tu defensa cita al menos un fallo real que encontraste en este módulo |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu regla de una frase | ___ |
| Criterio de la rúbrica que más te costó cumplir y cómo lo resolviste | ___ |

---

## 🔁 Reto de transferencia — Un script de borrado generado por IA

Cambia el artefacto y comprueba si entendiste el patrón. Marketing pide limpiar contactos duplicados en Dataverse. Un compañero le pidió a una IA "un script que borre los contactos duplicados" y obtuvo un script de Node.js que llama a la Web API: agrupa por nombre completo y borra todos los registros del grupo menos el más reciente. Funcionó con 3 contactos de prueba y lo quiere ejecutar esta noche en producción, donde hay 40,000.

1. **Micropráctica (7 min):** **[Transferir: un script de borrado generado por IA](/practica/ip-ia-012-transferir-script-de-borrado-generado)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel** (no lo ejecutes contra ningún ambiente): escribe la regla de duplicado que exigirías, los casos de borde que probarías (por lo menos cuatro: piensa en mayúsculas, espacios, contactos sin correo y dos personas reales con el mismo nombre) y el orden de controles antes de tocar producción.

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobarías que funciona |
|---|---|---|
| Qué es un duplicado | ___ | ___ |
| Qué se ve antes de borrar | ___ | ___ |
| Dónde se ejecuta primero | ___ | ___ |
| Quién más lo revisa | ___ | ___ |

### 💼 Casos Reales de Negocio
Un maker de SIT usó vibe coding para generar un flujo completo de aprobación de gastos en una sola sesión, sin revisar el detalle de cada acción, y lo publicó directamente a producción porque "funcionó en la prueba". Una condición de carrera entre dos aprobadores duplicó pagos durante una semana antes de detectarse. El equipo adoptó la regla: cualquier flujo generado sin revisión detallada pasa primero por un ambiente de pruebas con datos reales simulados y una revisión de un segundo maker antes de publicarse.

### ✅ Buenas Prácticas
- Reservar vibe coding para tareas de bajo riesgo y alcance acotado; nunca para cambios que toquen datos de producción o lógica financiera/legal sin revisión.
- Exigir al menos un test o validación funcional antes de dar por terminada cualquier tarea resuelta con vibe coding.
- Documentar como regla de equipo (no como decisión ad-hoc) cuándo está permitido y cuándo no.
- Escribir la regla de negocio **antes** de pedir el código, y escribir una prueba por cada punto de esa regla: las pruebas del caso feliz no encuentran los fallos plausibles.
- En reglas de permisos, fallar cerrado: ante un dato inválido o ausente, rechazar.
- Cuando pidas a la IA que corrija, dale la especificación y la prueba que falla; "arréglalo" invita a otro error plausible.
- Confirmar que tus pruebas sirven rompiendo el código a propósito: si nada falla, falta una prueba.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Publicar a producción un resultado de vibe coding sin revisión | Confiar en que "funcionó en la prueba" es suficiente | Exigir ambiente de pruebas + revisión humana antes de publicar, igual que cualquier otro cambio |
| Usar vibe coding en lógica de negocio sensible (pagos, seguridad) | No distinguir el nivel de riesgo de la tarea | Reservar vibe coding para prototipos y tareas de bajo riesgo explícitamente definidas |
| No tener una regla de equipo explícita sobre cuándo se permite | Decisión informal caso por caso | Documentar la regla una vez y aplicarla consistentemente |
| La regla generada aprueba con datos inválidos | Un `return true` por defecto: ante un monto en texto (`"12,000" > 10000` es `false` porque el texto se convierte en `NaN`) la función cae en la rama que aprueba | Validar el tipo y el rango del dato al inicio y devolver `false` si no es válido; probarlo con un monto en texto |
| La solicitud decide quién la aprueba | La IA leyó el rol de un campo de la solicitud "por si acaso" | Leer los roles solo del usuario autenticado; prueba con una solicitud que traiga su propio rol |
| Las pruebas pasan pero la regla está mal | Solo se probó el caso feliz que la IA ya contemplaba | Una prueba por cada punto de la regla de negocio, incluidos los bordes (límite exacto, sin rol, propio solicitante) |

### 🧪 Criterios de Validación
- [ ] Clasifiqué encargos por riesgo en la micropráctica y documenté qué controles exigiría al prompt de alto riesgo que no exigí al de bajo riesgo
- [ ] Usé el prompt de bajo riesgo (o escribí el script) y anoté la salida exacta que obtuve
- [ ] Agregué al menos una prueba con `node:test` al script del prompt de bajo riesgo y la ejecuté con `node --test`
- [ ] Encontré (o descarté con evidencia) el caso de borde del estado vacío y de espacios, y documenté qué instrucción adicional habría evitado el fallo desde el prompt inicial
- [ ] Diagnostiqué el pago de 12,000 aprobado por error formulando una hipótesis antes de ver la causa
- [ ] Escribí una prueba por cada punto de la regla de negocio, encontré los fallos de la función generada por IA, la corregí y todas mis pruebas pasan
- [ ] Rompí mi corrección a propósito y comprobé que al menos una prueba falla
- [ ] Escribo una regla de equipo de una frase sobre cuándo se permite vibe coding y la defendí contra la rúbrica
- [ ] En el reto de transferencia definí la regla de duplicado, los casos de borde y el orden de controles antes de tocar producción
- [ ] Relaciono este módulo con cualquier lab de prototipado rápido donde el alcance sea acotado y descartable, nunca con labs de lógica de negocio crítica

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- Los archivos `resumen.mjs`, `main.mjs`, `resumen.test.mjs`, `aprobaciones.mjs` (tu versión corregida) y `aprobaciones.test.mjs`, más la salida de `node --test` antes y después de corregir.

> **Para profundizar (opcional, mismo nivel IA):** el Módulo 48 convierte la revisión de la Microlección 3 en una checklist de PR, el Módulo 49 cubre secretos y datos sensibles en prompts, y el Módulo 50 lleva estas pruebas a CI.

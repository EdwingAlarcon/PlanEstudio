---
moduleId: 10
title: "Canvas Apps — Componentes y Reutilización"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 12
practiceMinutes: 40
slug: "canvas-apps-componentes-y-reutilizacion"
lastVerified: "2026-09"
---
### 🎯 Objetivo
Construir una biblioteca de componentes reutilizables en Canvas Apps que elimine la duplicación de código, garantice consistencia visual y reduzca el tiempo de desarrollo en nuevas aplicaciones — practicando cada decisión de diseño de inmediato, con evidencia real de tu propio entorno.

> **Cómo está organizado este módulo (piloto — mismo patrón del Módulo 11, aplicado a una interfaz visual en vez de un flujo):** este módulo prueba si "aprender haciendo" también funciona cuando la actividad principal ocurre en Power Apps Studio, no en un editor de lógica. Vas a **decidir** el contrato de un componente antes de construirlo, vas a **construir** uno real en tu tenant, vas a **diagnosticar** un síntoma de publicación antes de ver la causa, y vas a cerrar con un **reto de transferencia** que cambia el tipo de dato que recibe el componente.
>
> Necesitas: una cuenta Microsoft 365 con licencia de Power Apps (el nivel gratuito/de prueba alcanza — Component Library no requiere premium) y acceso a make.powerapps.com. No necesitas Dataverse para este módulo; las colecciones en memoria son suficientes.

---

## 🧩 Microlección 1 — Component Library y Custom Component

**¿Qué vas a aprender?** Qué es una biblioteca de componentes y por qué encapsular UI reutilizable en una "caja negra" con propiedades definidas, en vez de copiar y pegar controles entre apps.

**¿Por qué existe esto?** Si 15 apps tienen su propio header con su propio color y estilo, un cambio de marca significa editar 15 apps. Una **Component Library** centraliza el diseño: se publica una vez, y cada app que la usa puede aceptar la actualización con un clic — sin copiar nada de nuevo.

**Ejemplo pequeño:** una librería `SIT Component Library` con un componente `cmpHeader` que expone `TituloApp` (Texto) y `ColorFondo` (Color) como Input Properties — la app padre configura esos valores, el componente decide cómo dibujarlos.

**Ahora haz algo — micropráctica (6 min):** antes de construir nada, resuelve esta decisión de diseño con feedback inmediato → **[Elegir el tipo de Input/Output Property](/practica/ip-app-004-tipo-de-property-correcto)**. Te da dos componentes reales de este módulo (`cmpStatCard`, `cmpSearchBox`) y te pide decidir qué tipo de propiedad — y en qué dirección, Input u Output — usar para cada dato.

**Práctica real en tu entorno (10 min):** crea la Component Library y el componente `cmpHeader` descrito arriba.
1. make.powerapps.com → Aplicaciones → Bibliotecas de componentes → Nueva biblioteca → nómbrala `SIT Component Library`.
2. Nuevo componente → `cmpHeader`, con Input Properties `TituloApp` (Texto, default "Mi Aplicación"), `ColorFondo` (Color) y `MostrarBtnVolver` (Boolean, default false).
3. Agrega un Label cuyo `Text` sea `cmpHeader.TituloApp` y un ícono `chevronLeft` cuyo `Visible` sea `cmpHeader.MostrarBtnVolver`.
4. Guarda y **publica** la librería (Guardar → Publicar) — sin este paso, ninguna app puede consumirla todavía.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre de la Component Library | ___ |
| Nombre del componente y sus 3 Input Properties (nombre + tipo de cada una) | ___ |
| ¿La librería quedó en estado "Publicada" o "Borrador"? (revisa el indicador en el listado de bibliotecas) | ___ |

---

## 🧩 Microlección 2 — Output Properties y el contrato del componente

**¿Qué vas a aprender?** Cómo un componente expone hacia afuera un valor que él mismo calcula o captura, para que la app padre pueda leerlo.

**¿Por qué existe esto?** Un Input Property es de solo lectura dentro del componente — no sirve para exponer algo que el componente calcula internamente (como el texto que un usuario está escribiendo en un buscador con debounce). Para eso existen las **Output Properties** (Custom Properties de tipo salida): el componente las establece, el padre las lee.

**Ejemplo pequeño:** `cmpSearchBox` tiene un Input Property `Placeholder` (lo configura el padre) y un Output Property `TextoBusqueda` (lo calcula el propio componente mientras el usuario escribe, con un Timer de debounce de 500ms).

**🏗️ Reto de construcción (sin pasos, tenant real):** construye `cmpSearchBox` completo. No te damos la secuencia exacta de propiedades del Timer esta vez — solo el requerimiento.

> **Requerimiento:** un componente `cmpSearchBox` con un `TextInput` y un `Timer`, que exponga un Output Property `TextoBusqueda` con el texto escrito, actualizado **500ms después** de que el usuario deja de escribir (no en cada tecla).
> **Criterios de aceptación:** (1) `TextoBusqueda` debe ser una Output Property, no una variable global; (2) escribir rápido no debe disparar actualizaciones en cada letra — debe esperar la pausa de 500ms; (3) debes poder leer `TextoBusqueda` desde una pantalla que use el componente.
> **Restricciones:** no uses `App.OnStart` ni una variable de contexto en la app padre para almacenar el texto — el estado debe vivir dentro del componente.

Si te atoras, revisa las pistas de la micropráctica anterior (mismo principio de Input/Output aplica) antes de buscar la solución completa en la documentación de Power Apps.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre del componente y de su Output Property | ___ |
| Duración configurada en el Timer (en ms) | ___ |
| Valor de `TextoBusqueda` que leíste desde la pantalla, 1 segundo después de dejar de escribir "prueba" | ___ |

---

## 🧩 Microlección 3 — Consumir la librería y delegación

**¿Qué vas a aprender?** Cómo importar y usar componentes publicados desde una app distinta a la que los creó, y por qué algunas fórmulas sobre datos grandes pueden perder registros en silencio.

**¿Por qué existe esto?** Un componente no sirve de nada si no se consume. Y en cuanto una app crece, las fórmulas que filtran datos (`Filter`, `Search`) pueden dejar de ejecutarse en el servidor (Dataverse/SharePoint) y empezar a traer todo al cliente — eso es un problema de **delegación**, no de componentes, pero aparece exactamente en las mismas apps que reutilizan estos componentes para mostrar listas.

**Ahora haz algo — micropráctica (7 min):** **[Delegation awareness](/practica/ip-app-003-delegation-awareness)** — ya la resolviste si vienes de Avanzado; si no, este es el momento. Te da una fórmula con riesgo real de delegación y te pide elegir las decisiones que lo evitan.

**Práctica real en tu entorno (8 min):** abre una app Canvas existente (o crea una nueva), inserta `SIT Component Library` desde **Insertar → Obtener más componentes**, y usa `cmpHeader` y `cmpSearchBox` en al menos una pantalla real.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de la app consumidora y de la pantalla donde insertaste los componentes | ___ |
| Valor de `cmpHeader.TituloApp` que configuraste desde la app padre | ___ |
| ¿Apareció el triángulo de advertencia de delegación en alguna fórmula que escribiste? ¿En cuál? | ___ |

---

## 🔧 Diagnosticar — troubleshooting challenge

Antes de construir nada más, resuelve este caso con evidencia real, no con la tabla de errores:

**[Diagnosticar: la app sigue mostrando el componente anterior](/practica/ip-app-005-diagnosticar-componente-desactualizado)**

Síntoma: publicaste una nueva versión de `cmpHeader` con un cambio de color, confirmaste que la librería se publicó sin errores — pero la app consumidora sigue mostrando la versión anterior. Formula tu hipótesis antes de ver la causa: ¿el problema está en la librería, en la app, o en el navegador?

---

## 🔁 Reto de transferencia

`cmpListaTareas` tiene hoy una Input Property `TareaActual` de tipo **Texto** — muestra una sola tarea. El requerimiento cambia: ahora debe recibir **una tabla completa** de tareas pendientes (`Filter(colTareas, Estado = "Pendiente")`), no un texto único.

Esto no es un cambio de valor — es un cambio de **tipo de contrato**. Tabla ya es uno de los 6 tipos de Input Property que viste en la Microlección 1 (Texto, Número, Color, Boolean, Registro, Tabla) y ya usaste colecciones como `colSolicitudes` en las actividades anteriores — no es un concepto nuevo, es aplicar en un componente algo que ya usás en pantallas normales.

**[Transferir: el componente ahora recibe una tabla, no un texto](/practica/ip-app-006-transferir-input-tabla)** — decide qué cambia en el componente y qué cambia en la app consumidora. Si solo memorizaste "Input Property = un valor que configura el padre" sin entender que el *tipo* de ese valor puede ser una colección completa, este reto te lo va a mostrar.

Si tienes tiempo, constrúyelo también en tu tenant real: cambia `TareaActual` a tipo Tabla, agrega una Gallery dentro del componente, y reporta cuántas tareas mostró con datos reales de prueba.

---

### 💼 Caso Real de Negocio
**Empresa:** Banco regional con 15 aplicaciones Canvas diferentes
**Problema:** Cada app tiene su propio header, colores y estilos. Un cambio de branding requería actualizar 15 apps manualmente.
**Solución:** Component Library con tema corporativo centralizado. Al actualizar el componente y publicar, todas las apps pueden aceptar la actualización en 1 clic. Reducción de tiempo de implementación de cambios visuales de 2 semanas a 2 horas.
**Resultado:** Consistencia de marca 100%, ahorro de ~40 horas/mes en mantenimiento.

### ✅ Buenas Prácticas
- Una biblioteca por dominio/área de negocio, no una mega-librería global
- Las propiedades de salida deben ser simples (texto, número, booleano) salvo que el consumo lo justifique — una Output Property de tipo Tabla es válida, pero súmale la carga de mantenimiento a la decisión
- Documentar cada propiedad de input con el campo "Descripción" del editor de componentes
- Versionar las bibliotecas con comentarios de cambio antes de publicar
- Nunca modificar el componente directamente en la app — hacerlo en la librería y actualizarlo
- Named Formulas (declaradas en `App.Formulas`, no en `App.OnStart`) son preferibles a variables globales para cálculos derivados: se evalúan de forma lazy y reactiva

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Componente no muestra cambios en la app | Librería publicada pero app no actualizada | En la app: Insertar → Componentes → ícono de actualización |
| Output property siempre vacío | No se asignó una variable interna o falta la referencia correcta | Usar variable local dentro del componente y exponerla como property |
| App lenta al usar componentes con listas grandes | Fórmula con delegación incompleta trae miles de registros | Asegurar que las fórmulas usen operaciones delegables |
| Error "circular dependency" en Named Formulas | Una Named Formula referencia otra que depende de ella | Romper la dependencia usando variable intermedia |
| Cambiar el tipo de una Input Property rompe la app consumidora | El binding de la app padre asumía el tipo anterior | Actualizar el binding en cada app consumidora al mismo tiempo que el tipo del componente |

### 🧪 Criterios de Validación
- [ ] Creé y publiqué la Component Library con `cmpHeader` y documenté el estado de publicación
- [ ] Construí `cmpSearchBox` sin ver los pasos completos de antemano, con su Output Property funcionando con debounce de 500ms
- [ ] Consumí la librería desde una app distinta y configuré al menos un Input Property desde la app padre
- [ ] Identifiqué si apareció advertencia de delegación en alguna fórmula propia
- [ ] Diagnostiqué el componente desactualizado formulando una hipótesis antes de ver la causa
- [ ] Completé el reto de transferencia (Input Text → Input Table) explicando qué cambia en el componente Y en la app consumidora, no solo en uno de los dos

---

## Notas de esta iteración piloto

Segundo piloto de la arquitectura Learning-by-Doing, después de Módulo 11 (Power Automate). Reutiliza el mismo motor de prácticas interactivas, el mismo sistema de pistas escalonadas y una generalización pequeña de la función de mastery (`calculatePilotMastery`, parametrizada por módulo) — sin infraestructura nueva. Valida si el patrón funciona igual de bien cuando la actividad principal ocurre en una interfaz visual (Power Apps Studio) en vez de un editor de lógica (Power Automate).

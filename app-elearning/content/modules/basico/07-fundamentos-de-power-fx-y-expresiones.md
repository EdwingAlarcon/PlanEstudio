---
moduleId: 7
title: "Fundamentos de Power Fx y Expresiones"
level: "basico"
certification: "PL-900"
estimatedMinutes: 30
slug: "fundamentos-de-power-fx-y-expresiones"
lastVerified: "2026-09"
---
*Duración: 1-2 semanas · Lectura: 12-15 min · Con práctica: 60-90 min (núcleo obligatorio); delegación avanzada y operaciones batch pueden quedar para una segunda sesión*

### 🎯 Objetivo
Dominar el lenguaje de fórmulas Power Fx para lógica avanzada en Canvas Apps.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Leer fórmulas de Power Fx sin sentir que son “código misterioso”.
- Escribir validaciones simples con `If`, `IsBlank`, `Len`, `Notify` y operadores lógicos.
- Usar `Filter`, `LookUp`, formato de texto/fechas y un ejemplo básico de delegación.

### 🔧 Qué queda para después (Profundización opcional)
- `AddColumns`, `ForAll`, batch updates, Collections complejas y optimización fina de delegación. Puedes volver a estos patrones después de practicar más Canvas Apps.

### 🧭 Cómo recorrer este módulo si eres principiante
1. Primero lee las fórmulas y explica en voz alta qué hace cada línea.
2. Practica en una app pequeña con 2 controles y 1 Gallery; no intentes copiar todas las fórmulas en una sola pantalla.
3. Si aparece una advertencia azul de delegación, no la ignores: anótala como hallazgo aunque todavía no sepas resolverla completamente.

### 📚 Power Fx en español simple

| Fórmula | Qué significa en lenguaje normal | Dónde suele ir |
|---|---|---|
| `If(condición, valorSiSí, valorSiNo)` | Si pasa esto, muestra/haz una cosa; si no, otra. | `Text`, `Visible`, `DisplayMode`, `OnSelect` |
| `IsBlank(valor)` | Revisa si un campo está vacío. | Validaciones de formularios |
| `Filter(tabla, condición)` | Muestra solo las filas que cumplen una regla. | `Items` de una Gallery |
| `LookUp(tabla, condición, columna)` | Busca una fila y devuelve un dato específico. | Labels, emails, datos relacionados |
| `Notify("mensaje", tipo)` | Muestra un aviso al usuario. | `OnSelect` de botones |
| `ThisItem.Campo` | El campo del registro actual dentro de una Gallery. | Controles dentro de una Gallery |

> Si una fórmula te abruma, léela de adentro hacia afuera y reemplaza cada nombre técnico por una frase: `Filter(Solicitudes, Estado = "Nueva")` = "muéstrame solo solicitudes nuevas".

### 📖 Conceptos Clave
- **Sintaxis**: Funciones, operadores, referencias
- **Tipos de datos**: Text, Number, Boolean, Date, Table, Record
- **Funciones de tablas**: Filter, Sort, Search, Lookup, AddColumns
- **Funciones de agregación**: Sum, Average, Count, Max, Min
- **Funciones de contexto**: With, ForAll, Collect
- **Funciones de texto**: Concatenate, Text, Value, Split
- **Funciones de fecha**: Today, Now, DateAdd, DateDiff
- **Funciones de control**: If, Switch, IsBlank, IsEmpty
- **Funciones de navegación**: Navigate, Back, Launch
- **Delegación**: Limitaciones y operadores delegables
- **Comportamiento (Behavior)**: OnSelect, OnChange, OnVisible
- **Patrones**: Context variables, global variables, collections

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

Completa primero los ejercicios 7.1.1, 7.1.2, 7.2.1, 7.3.1 y 7.5.1. Con eso tendrás búsqueda/filtro, búsqueda de un registro, validación de formulario, formato de texto y una primera lectura de delegación.

> **Cómo está organizado el Núcleo:** aprendes Power Fx en cuatro bloques cortos (leer y filtrar, validar, dar formato, delegación). En cada uno alternas una idea, una práctica de pocos minutos y un dato real de tu propia app. Cierras con un reto en el que ya no te doy las fórmulas. Las microprácticas no necesitan tenant; escribir las fórmulas sí necesita tu app Canvas del Módulo 3. Los ejercicios marcados como profundización quedan para después.

## 🧩 Microlección 1 — Leer una fórmula: Filter y LookUp

**¿Qué vas a aprender?** A traducir una fórmula de Power Fx a una frase normal, y cómo `Filter` (varias filas) y `LookUp` (una fila) traen los datos que una pantalla necesita.

**¿Por qué existe esto?** Power Fx no es código misterioso: cada fórmula se puede decir con palabras. Saber leerla bien es la mitad de saber escribirla, y te permite detectar errores sin ejecutar nada.

**Ejemplo pequeño:** `Filter('Solicitudes TI', Estado.Value = "Nueva")` quiere decir "muéstrame solo las solicitudes nuevas".

**Ahora haz algo — micropráctica (6 min):** **[Leer una fórmula y decir qué hace](/practica/ip-app-011-leer-una-formula)**. Te da una fórmula con dos condiciones y te pide elegir las lecturas correctas, incluyendo lo que la fórmula NO hace.

**Práctica real en tu app (25 min):** haz los Ejercicios 1 y 2 de la Práctica 7.1 de abajo.

##### Práctica 7.1: Funciones de Tablas y Filtrado

**Ejercicio 1: Multi-Filter Gallery**
```javascript
// Gallery Items con filtros múltiples
Filter(
    'Solicitudes TI',
    (IsBlank(DropdownCategoria.Selected) || Categoría = DropdownCategoria.Selected.Value) &&
    (IsBlank(DropdownEstado.Selected) || Estado = DropdownEstado.Selected.Value) &&
    (IsBlank(DatePickerDesde.SelectedDate) || 'Fecha Solicitud' >= DatePickerDesde.SelectedDate) &&
    (SearchBox.Text = "" || SearchBox.Text in Título || SearchBox.Text in Descripción)
)
```

**Ejercicio 2: Lookup con Fallback**
```javascript
// Obtener email del solicitante con valor por defecto
LookUp(
    Contacts,
    ID = GallerySolicitudes.Selected.Solicitante.ID,
    Email
) ?? "correo@desconocido.com"
```

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| La fórmula exacta de `Items` de tu Gallery con filtros, copiada de la barra de fórmulas | ___ |
| Con qué combinación de filtros aparece cada solicitud y con cuál desaparece | ___ |
| El valor que devolvió tu `LookUp` y qué mostró cuando no encontró el registro | ___ |

**Ejercicio 3: AddColumns para Enriquecer Datos**

> Profundización opcional: este patrón ya combina tabla, columna calculada y búsqueda relacionada. Si todavía estás entendiendo `Filter` y `LookUp`, vuelve a este ejercicio después.

```javascript
// Agregar columna calculada "Días Transcurridos" en Collection
ClearCollect(
    ColSolicitudesEnriquecidas,
    AddColumns(
        'Solicitudes TI',
        "Días Transcurridos", DateDiff('Fecha Solicitud', Today(), Days),
        "Vencido SLA", DateDiff('Fecha Solicitud', Today(), Hours) > 'SLA Horas',
        "Nombre Solicitante", LookUp(Contacts, ID = Solicitante.ID, 'Full Name')
    )
)
```

---

## 🧩 Microlección 2 — Validar con If, IsBlank y Len

**¿Qué vas a aprender?** Cómo un botón decide si se habilita según lo que hay en los campos del formulario.

**¿Por qué existe esto?** Una validación evita guardar datos incompletos antes de que lleguen a la base de datos. El error típico es combinar las condiciones con el operador equivocado, y entonces el botón se habilita cuando no debería.

**Ejemplo pequeño:** `!IsBlank(TextInputTitulo.Text) && Len(TextInputDescripcion.Text) >= 20` se cumple solo si hay título Y la descripción tiene al menos 20 caracteres.

**Práctica real en tu app (20 min):** haz el Ejercicio 1 de la Práctica 7.2 de abajo; los Ejercicios 2 y 3 son para ampliar.

##### Práctica 7.2: Lógica Condicional y Validaciones

**Ejercicio 1: Validación de Form Completo**
```javascript
// Button Guardar - Enabled property
!IsBlank(TextInputTitulo.Text) &&
!IsBlank(TextInputDescripcion.Text) &&
!IsBlank(DropdownCategoria.Selected) &&
Len(TextInputDescripcion.Text) >= 20 &&
Len(TextInputTitulo.Text) <= 100
```

**Ejercicio 2: Switch para Iconos Dinámicos**
```javascript
// Image Icon en Gallery según Estado
Switch(
    ThisItem.Estado.Value,
    "Nueva", Icon.AddDocument,
    "En Proceso", Icon.Clock,
    "Resuelta", Icon.CompletedSolid,
    "Cerrada", Icon.Cancel,
    Icon.Warning  // Default
)
```

**Ejercicio 3: If Anidado para Colores**
```javascript
// Color de Label Prioridad
If(
    ThisItem.Prioridad.Value = "Crítica", 
    RGBA(178, 0, 0, 1),  // Rojo oscuro
    If(
        ThisItem.Prioridad.Value = "Alta",
        RGBA(255, 140, 0, 1),  // Naranja
        If(
            ThisItem.Prioridad.Value = "Media",
            RGBA(255, 215, 0, 1),  // Amarillo
            RGBA(0, 128, 0, 1)  // Verde (Baja)
        )
    )
)
```

**Ahora diagnostica — micropráctica (5 min):** **[Diagnosticar: el botón Guardar se habilita con el título vacío](/practica/ip-app-012-boton-habilitado-de-mas)**. Parte de un síntoma exacto y te pide la causa y la corrección, antes de ver la solución.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula exacta de `Enabled` de tu botón Guardar | ___ |
| Qué hace el botón con el título vacío y la descripción de 25 caracteres | ___ |
| Qué hace el botón con el título lleno y la descripción de 5 caracteres | ___ |

---

## 🧩 Microlección 3 — Dar formato a texto y fechas

**¿Qué vas a aprender?** A presentar un número o una fecha como lo espera quien usa la app, con `Text()` y un formato.

**¿Por qué existe esto?** Un dato crudo (una fecha en formato de máquina) confunde. Darle formato es la diferencia entre un dato correcto y un dato que la persona entiende de un vistazo.

**Ejemplo pequeño:** `Text(ThisItem.'Fecha Solicitud', "dd/MM/yyyy")` muestra una fecha como 12/03/2026.

**Práctica real en tu app (15 min):** haz el Ejercicio 1 de la Práctica 7.3 de abajo.

##### Práctica 7.3: Manipulación de Texto y Fechas

**Ejercicio 1: Formateo de Texto**
```javascript
// Construir mensaje de notificación
Concatenate(
    "Solicitud #", Text(GallerySolicitudes.Selected.ID, "000000"),
    " - ", Upper(Left(GallerySolicitudes.Selected.Categoría.Value, 1)),
    Lower(Mid(GallerySolicitudes.Selected.Categoría.Value, 2)),
    " (", Text(GallerySolicitudes.Selected.'Fecha Solicitud', "dd/MM/yyyy"), ")"
)
```

**Ejercicio 2: Cálculos de Fechas**
```javascript
// Calcular fecha estimada de resolución
DateAdd(
    GallerySolicitudes.Selected.'Fecha Solicitud',
    GallerySolicitudes.Selected.'SLA Horas',
    Hours
)

// Días hábiles hasta vencimiento (excluye fines de semana)
With(
    {DiasSLA: GallerySolicitudes.Selected.'SLA Horas' / 24},
    DiasSLA + Round(DiasSLA / 5 * 2, 0)  // Aproximación días hábiles
)
```

**Ejercicio 3: Split y Parse**
```javascript
// Extraer dominio de email
Last(Split(LookUp(Contacts, ID = Solicitante.ID, Email), "@")).Result

// Convertir string separado por comas a tabla
Split("Hardware,Software,Red,Accesos", ",")
```

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula exacta que usaste para dar formato y el texto que produjo | ___ |
| Qué muestra el mismo dato sin el formato | ___ |
| Un formato de fecha distinto que probaste y su resultado | ___ |

##### Práctica 7.4: Collections y Contexto

> Profundización opcional: Collections, `ForAll` y patrones batch son útiles para apps reales, pero no son requisito para entender Power Fx básico. Trabaja esta práctica cuando ya puedas crear y explicar fórmulas simples sin copiar/pegar a ciegas.

**Ejercicio 1: Carrito de Compras (Pattern)**
```javascript
// Button Agregar al Carrito - OnSelect
Collect(
    ColCarrito,
    {
        Item: GalleryProductos.Selected.Nombre,
        Precio: GalleryProductos.Selected.Precio,
        Cantidad: Value(TextInputCantidad.Text),
        Subtotal: GalleryProductos.Selected.Precio * Value(TextInputCantidad.Text)
    }
);
Notify("Item agregado", NotificationType.Success)

// Button Remover del Carrito
Remove(ColCarrito, GalleryCarrito.Selected);
Notify("Item removido", NotificationType.Information)

// Label Total
"Total: $" & Text(Sum(ColCarrito, Subtotal), "$#,##0.00")
```

**Ejercicio 2: ForAll para Operaciones Batch**
```javascript
// Aprobar múltiples solicitudes seleccionadas
ForAll(
    GallerySolicitudes.AllItems,
    If(
        CheckboxSelect.Value,  // Si está seleccionado
        Patch(
            'Solicitudes TI',
            LookUp('Solicitudes TI', ID = ThisRecord.ID),
            {Estado: {Value: "Aprobada"}, 'Fecha Aprobación': Now()}
        )
    )
);
Notify(CountIf(GallerySolicitudes.AllItems, CheckboxSelect.Value) & " solicitudes aprobadas", NotificationType.Success)
```

**Ejercicio 3: With para Contexto Local**
```javascript
// Evitar repetir cálculos - With pattern
With(
    {
        RegistroActual: GallerySolicitudes.Selected,
        TiempoTranscurrido: DateDiff(GallerySolicitudes.Selected.'Fecha Solicitud', Now(), Days)
    },
    Concatenate(
        "Solicitud: ", RegistroActual.Título,
        " | Días abierta: ", Text(TiempoTranscurrido),
        " | Estado: ", If(TiempoTranscurrido > 7, "VENCIDA", "En plazo")
    )
)
```

---

## 🧩 Microlección 4 — Delegación: que tu app no pierda registros

**¿Qué vas a aprender?** Qué es delegar (que el servidor haga el filtro), qué significa la línea azul de advertencia y cómo reescribir una condición para que sí se delegue.

**¿Por qué existe esto?** Si una fórmula no se puede delegar, la app solo revisa los primeros 500 registros (hasta 2.000 si cambias el límite) y puede mostrar resultados incompletos sin avisarte. Con pocos datos no lo notas; con muchos, falta información.

**Ejemplo pequeño:** poner `DateDiff(...)` sobre la columna dentro de `Filter` no se delega. Comparar la columna con una fecha calculada fuera de la fila, como `'Fecha Solicitud' < DateAdd(Today(), -7, Days)`, sí se delega.

**Práctica real en tu app (20 min):** haz el Ejercicio 1 de la Práctica 7.5 de abajo; los Ejercicios 2 y 3 son para ampliar.

##### Práctica 7.5: Delegación y Performance

**Ejercicio 1: Identificar Fórmulas No Delegables**

❌ **No delegable** (warning línea azul):
```javascript
Filter('Solicitudes TI', DateDiff('Fecha Solicitud', Today(), Days) > 7)
// DateDiff no es delegable
```

✅ **Solución delegable**:
```javascript
Filter('Solicitudes TI', 'Fecha Solicitud' < DateAdd(Today(), -7, Days))
// Operador < es delegable
```

**Ejercicio 2: Optimizar Queries con Delegación**

❌ **Mal rendimiento** (carga 500, luego filtra en cliente):
```javascript
SortByColumns(
    Filter('Solicitudes TI', Len(Título) > 20),
    "Fecha Solicitud",
    Descending
)
// Len() aplicada a la columna no se puede delegar a Dataverse
```

✅ **Optimizado** (filtra en servidor):
```javascript
SortByColumns(
    Filter(
        'Solicitudes TI',
        StartsWith(Título, TextInputBuscar.Text) &&
        'Fecha Solicitud' >= DateAdd(Today(), -90, Days)  // StartsWith y la comparación de fecha son delegables
    ),
    "Fecha Solicitud",
    Descending
)
// Search también es delegable con columnas de texto de Dataverse
```

**Ejercicio 3: Uso de Collections para No Delegable**
```javascript
// Cargar data una vez (máx 500 o 2000 con config)
OnVisible de Screen:
ClearCollect(
    ColSolicitudesRecientes,
    Filter('Solicitudes TI', 'Fecha Solicitud' >= DateAdd(Today(), -30, Days))
);

// Luego operar localmente sin límite de delegación
Gallery Items:
Filter(
    ColSolicitudesRecientes,
    DateDiff('Fecha Solicitud', Today(), Days) > 7  // Ahora funciona porque es Collection local
)
```

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula no delegable que escribiste y el texto de la advertencia azul | ___ |
| La versión corregida y si la advertencia desapareció | ___ |
| Cuántas filas devuelve cada versión con tus datos de prueba | ___ |

---

## 🔁 Reto de transferencia — Tu app, más robusta, sin pasos

Esta vez no te doy las fórmulas: aplica lo que viste a un cambio de requisito.

> **Requerimiento:** vuelve a tu app del Módulo 3 y mejora tres cosas. (1) El botón Guardar solo se habilita si hay título y la descripción tiene al menos 20 caracteres. (2) La Gallery de la lista muestra únicamente las solicitudes con más de 14 días abiertas. (3) Un Label muestra la solicitud como "Abierta desde 12/03/2026 - Hardware", con la fecha formateada y la categoría.
> **Criterios de aceptación:** (1) el botón cambia de estado según el contenido de los campos; (2) el filtro de fecha no muestra la advertencia azul de delegación; (3) cada fórmula tiene un comentario `//` que explica su intención.
> **Restricciones:** no uses `DateDiff` dentro del `Filter`, y no cambies el modelo de datos.
> **Pistas si te atoras:** la validación combina `IsBlank` y `Len` (Práctica 7.2); el formato de la fecha está en la Práctica 7.3; la forma delegable de comparar fechas está en la Práctica 7.5, Ejercicio 1.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: la condición de fecha con 8.000 registros](/practica/ip-app-013-transferir-condicion-de-fecha)**. Retoma el patrón de delegación del módulo con un caso nuevo y te pide decidir qué cambiar y qué evitar.

**Si aún no tienes tenant:** escribe las tres fórmulas que usarías, cada una con su comentario `//`, y explica con tus palabras por qué no usas `DateDiff` en el filtro.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula de `Enabled` del botón Guardar, con su comentario | ___ |
| La fórmula de `Items` de la Gallery filtrada por fecha y si hay advertencia azul | ___ |
| La fórmula del Label con el texto que produjo | ___ |

### 💼 Caso Real de Negocio

**Empresa:** Distribuidora Farmacéutica MediSupply — 8,000 SKUs, 3 bodegas  
**Problema:** Los analistas de inventario calculaban manualmente en Excel cuándo pedir cada producto: promedio de consumo, días de stock restante, cantidad mínima de pedido. El proceso tomaba 4 horas diarias para 8,000 SKUs. Errores frecuentes generaban quiebres de stock en productos críticos y sobrestock en productos de baja rotación.

**Solución con Power Fx:**
- Canvas App conectada a Dataverse con tabla de productos, movimientos y parámetros
- Fórmulas Power Fx calculan en tiempo real: consumo promedio diario (últimos 30 días), días de stock restante, cantidad sugerida de pedido
- Gallery filtrada automáticamente muestra solo productos que requieren acción hoy (stock < 15 días o stock crítico < 20% del ideal)
- Botón "Generar Orden" crea automáticamente la solicitud de compra en Dataverse y notifica al proveedor via Power Automate
- Colores semáforo (verde/amarillo/rojo) según nivel de urgencia calculado por Power Fx

**Resultados:**
- 4 horas de análisis manual reemplazadas por revisión de 20 minutos sobre la app
- Quiebres de stock en productos críticos: reducción del 71% en el primer trimestre
- Sobrestock: reducción del 38% (mejor planificación de cantidades de pedido)
- Impacto económico: ahorro estimado de $180,000 USD anuales en costos de urgencia y pérdidas por vencimiento

### ✅ Buenas Prácticas

**Sintaxis y Legibilidad**:

- Indentar fórmulas complejas con Alt+Shift+F
- Usar With para evitar repetir subcálculos
- Comentarios con `//` en fórmulas de >3 líneas
- Nombres descriptivos de variables: `colCarrito` no `col1`

**Performance**:

- Entender y respetar delegación (límite 500/2000)
- Cargar datos una vez, operar local con Collections
- Evitar Addcolumns dentro de loops (ForAll)
- Usar Concurrent para operaciones independientes paralelas

**Mantenibilidad**:

- Centralizar cálculos complejos en una Collection
- Usar Component + Output properties para reutilizar lógica
- Documentar fórmulas no obvias
- Named Formulas (declaradas en `App.Formulas`, **no** en `App.OnStart`): son reactivas, lazy y se recalculan automáticamente — a diferencia de variables globales con `Set()` en `OnStart` que son imperativas y se calculan una sola vez al iniciar

**Debugging**:

- Usar Label temporal para ver valores: `Text(Variable, JSON)`
- Monitor para ver network calls y performance
- App formulas > Variables para inspeccionar contexto

### ⚠️ Errores Comunes

1. **Lo que ves:** una fórmula devuelve vacío (Blank) cuando no lo esperabas.
    - **Causa**: Lookup no encuentra registro o división por 0
    - **Solución**: Usar `??` (null coalescing) o If(IsBlank(...))

2. **Lo que ves:** el error "Incompatible type" al usar Patch.
    - **Causa**: Tipo de dato no coincide (text vs number, Choice vs string)
    - **Solución**: Convertir con Value(), Text(), o usar {Value: "..."} para Choices

3. **Lo que ves:** la Gallery no cambia aunque modificaste la colección.
    - **Causa**: Usar Set en lugar de Collect/Patch/Remove
    - **Solución**: Collections son observables, variables no. Usar ClearCollect o UpdateIf

4. **Lo que ves:** ForAll parece no guardar los cambios.
    - **Causa**: ForAll es funcional, no ejecuta side-effects en orden
    - **Solución**: Validar con Patch individual o usar Concurrent para operaciones independientes

5. **Lo que ves:** Filter devuelve registros que no esperabas, o deja fuera algunos.
    - **Causa**: Se confundió And con Or (o && con ||), o faltan paréntesis al combinar condiciones
    - **Solución**: And (&&) exige que se cumplan todas las condiciones y Or (||) basta con una; ambas formas son válidas en Power Fx. Agrupa con paréntesis cuando mezcles las dos

6. **Lo que ves:** una línea azul de delegación que decidiste ignorar, y resultados incompletos con muchos registros.
    - **Causa**: Asumir que funciona con >500 registros
    - **Solución**: NUNCA ignorar warnings de delegación; refactorizar o usar Collections

### 🧪 Criterios de Validación
- [ ] 10+ fórmulas complejas implementadas en Canvas App
- [ ] Uso correcto de Filter, LookUp, AddColumns, ForAll
- [ ] Collection con operaciones CRUD funcional
- [ ] Validaciones de form con If/IsBlank
- [ ] Formateo de texto y fechas aplicado
- [ ] With pattern para optimizar cálculos repetidos
- [ ] Identificar y resolver 3+ warnings de delegación
- [ ] Explicar diferencia entre variables globales y contextuales
- [ ] Debugging de fórmula compleja con Labels temporales

> Para avanzar como principiante, valida al menos 5 fórmulas: una de filtro, una de búsqueda, una de validación, una de formato y una corrección de delegación. Los 10+ ejemplos y operaciones batch son profundización.

### 📸 Evidencia para guardar
- Captura de una Gallery filtrada por texto o estado.
- Captura de un botón o formulario con validación funcionando.
- Captura de una fórmula con comentario `//` explicando su intención.
- Captura de una advertencia de delegación identificada y su versión corregida.

### ➡️ Siguiente práctica recomendada

Vuelve a tu Canvas App del **Módulo 03 / Lab 03** y reemplaza una fórmula simple por una versión más robusta de este módulo.

**Por qué:** Power Fx se aprende mejor mejorando una app existente que copiando muchas fórmulas aisladas. Tu objetivo no es memorizar funciones, sino reconocer patrones: filtrar, validar, formatear, navegar y evitar delegación peligrosa.

---

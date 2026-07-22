---
moduleId: 7
title: "Fundamentos de Power Fx y Expresiones"
level: "basico"
certification: "PL-900"
estimatedMinutes: 30
slug: "fundamentos-de-power-fx-y-expresiones"
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

## 🟢 Núcleo obligatorio

Completa primero los ejercicios 7.1.1, 7.1.2, 7.2.1, 7.3.1 y 7.5.1. Con eso tendrás búsqueda/filtro, búsqueda de un registro, validación de formulario, formato de texto y una primera lectura de delegación.

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
    Filter('Solicitudes TI', StartsWith(Título, TextInputBuscar.Text)),
    "Fecha Solicitud",
    Descending
)
```

✅ **Optimizado** (filtra en servidor):
```javascript
SortByColumns(
    Filter(
        'Solicitudes TI',
        'Fecha Solicitud' >= DateAdd(Today(), -90, Days)  // Delegable
    ),
    "Fecha Solicitud",
    Descending
)
// Luego aplicar filtro de texto con Search (también delegable con Dataverse)
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

1. **Error**: Fórmula devuelve Blank inesperadamente
    - **Causa**: Lookup no encuentra registro o división por 0
    - **Solución**: Usar `??` (null coalescing) o If(IsBlank(...))

2. **Error**: "Incompatible type" en Patch
    - **Causa**: Tipo de dato no coincide (text vs number, Choice vs string)
    - **Solución**: Convertir con Value(), Text(), o usar {Value: "..."} para Choices

3. **Error**: Collection no actualiza Gallery
    - **Causa**: Usar Set en lugar de Collect/Patch/Remove
    - **Solución**: Collections son observables, variables no. Usar ClearCollect o UpdateIf

4. **Error**: ForAll no guarda cambios
    - **Causa**: ForAll es funcional, no ejecuta side-effects en orden
    - **Solución**: Validar con Patch individual o usar Concurrent para operaciones independientes

5. **Error**: Filter devuelve registros incorrectos
    - **Causa**: Operador lógico mal usado (And vs &&, Or vs ||)
    - **Solución**: Power Fx usa And/Or, no &&/|| (aunque también soportados)

6. **Error**: "Delegation warning" ignorado
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

## ➡️ Siguiente práctica recomendada

Vuelve a tu Canvas App del **Módulo 03 / Lab 03** y reemplaza una fórmula simple por una versión más robusta de este módulo.

**Por qué:** Power Fx se aprende mejor mejorando una app existente que copiando muchas fórmulas aisladas. Tu objetivo no es memorizar funciones, sino reconocer patrones: filtrar, validar, formatear, navegar y evitar delegación peligrosa.

---

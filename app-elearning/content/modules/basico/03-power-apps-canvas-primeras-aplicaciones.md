---
moduleId: 3
title: "Power Apps Canvas - Primeras Aplicaciones"
level: "basico"
certification: "PL-900"
estimatedMinutes: 25
slug: "power-apps-canvas-primeras-aplicaciones"
---
*Duración: 2-3 semanas · Lectura: 8-12 min · Con práctica: 60-90 min (solo el Núcleo obligatorio; la Profundización opcional suma tiempo aparte)*

### 🎯 Objetivo
Crear aplicaciones Canvas desde cero con controles, navegación y conexión a datos.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Una Canvas App funcional de 3 pantallas conectada a Dataverse, con lista, búsqueda, creación y edición de registros.

### 🔧 Qué queda para después (Profundización opcional)
- Modo oscuro, Collections en memoria, una segunda app (calculadora de presupuestos) y diseño responsive. No son necesarios para tener tu primera app funcionando — puedes volver a esto en otra sesión, incluso después del Módulo 07 de Power Fx.

### 📖 Conceptos Clave
- **Canvas vs Model-Driven**: Diferencias conceptuales y casos de uso
- **Controles**: Input, Label, Button, Gallery, Forms, Media
- **Propiedades**: Sintaxis de fórmulas, referencias a controles
- **Datasources**: Dataverse, SharePoint, Excel, SQL, Conectores
- **Contexto**: Variables globales vs locales, Collections
- **Navegación**: Screens, Navigate(), Back()
- **Delegación**: Límite de 500 registros, funciones delegables
- **Responsive Design**: Scaling, orientación
- **Temas (Themes)**: Branding corporativo

> **🧭 Antes de continuar: mini-guía Power Fx para este módulo**
>
> Este módulo usa fórmulas de Power Fx (el lenguaje de expresiones de Power Apps) antes de que el
> **Módulo 07 lo explique formalmente**. Con estas cinco ideas puedes seguir las prácticas de hoy;
> el Módulo 07 profundiza en sintaxis, tipos de datos y todas las funciones disponibles.
>
> - **Fórmula**: una expresión que calcula un valor o ejecuta una acción, similar a Excel. Se
>   escribe en la barra de fórmulas de una propiedad del control (ej. `Text`, `Items`, `OnSelect`).
> - **Función**: una palabra reservada que hace algo con datos, como `Filter()` (filtra una tabla) o
>   `Search()` (busca texto dentro de una tabla). Siempre va seguida de paréntesis con sus argumentos.
> - **Propiedad**: un atributo configurable de un control (ej. `Items` define qué datos muestra una
>   Gallery, `OnSelect` define qué pasa al hacer clic). Cada control tiene su propio set de propiedades.
> - **Buscar vs. filtrar**: `Search(tabla, texto, columnas...)` busca coincidencias de texto en una o
>   más columnas; `Filter(tabla, condición)` devuelve solo las filas que cumplen una condición lógica
>   exacta (ej. `Estado = "Activa"`). `Distinct(tabla, columna)` devuelve los valores únicos de una
>   columna, útil para poblar un Dropdown de opciones sin repetir.
> - **Delegación**: cuando la tabla vive en Dataverse (no en memoria), Power Apps intenta traducir tu
>   fórmula en una consulta que el servidor ejecuta completa. Si la función no es delegable, Power Apps
>   solo trae los primeros 500-2000 registros y filtra sobre eso — por eso verás una advertencia (línea
>   azul) en algunas fórmulas de este módulo. El Módulo 07 explica cómo identificar y resolver esto.
>
> Cada bloque de código de este módulo trae comentarios `//` explicando línea por línea qué hace.

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

*Completa esto primero. Es tu primera app funcional de principio a fin.*

##### Práctica 3.1: Primera Canvas App - Lista de Tareas

*Objetivo: App de To-Do List con Dataverse*

**Paso 1: Configuración inicial**

1. Power Apps > Create > Canvas app from blank
2. Nombre: `Mi Lista Tareas`
3. Formato: Tablet (landscape)
4. Conectar a Dataverse (agregar tabla "Solicitud TI" del Módulo 2)

**Paso 2: Pantalla de Listado**

1. Insertar Gallery (Vertical)
    - Datasource: Solicitudes TI
    - Template: Title, Subtitle, Body
    - Title: `ThisItem.Título`
    - Subtitle: `ThisItem.Categoría`
    - Body: `Text(ThisItem.'Fecha Solicitud', "dd/MM/yyyy")`

2. Agregar Search Box arriba de Gallery
    - Fórmula Items del Gallery:
   ```javascript
   // Search(tabla, texto a buscar, columnas donde buscar...)
   // Busca SearchBox.Text dentro de las columnas título/descripción; si el cuadro está vacío, devuelve todo
   Search(
       'Solicitudes TI',
       SearchBox.Text,
       "cr123_título", "cr123_descripción"
   )
   ```

3. Agregar Button "Nueva Solicitud"
    - OnSelect: `Navigate(ScreenNueva, ScreenTransition.Cover)`

**Paso 3: Pantalla de Creación**

1. New Screen > Form
2. Insertar Edit Form control
    - DataSource: Solicitudes TI
    - Item: `Defaults('Solicitudes TI')`
    - Fields: Seleccionar Título, Descripción, Categoría, Prioridad

3. Configurar botones:
    - **Guardar Button**:
   ```javascript
   // SubmitForm() envía los valores del Form a Dataverse (guarda el registro)
   SubmitForm(Form1);
   // Vuelve a la pantalla de inicio con transición inversa a como se navegó aquí
   Navigate(ScreenInicio, ScreenTransition.UnCover)
   ```
    - **Cancelar Button**:
   ```javascript
   // ResetForm() descarta los cambios no guardados y vuelve el Form a su estado inicial
   ResetForm(Form1);
   Navigate(ScreenInicio, ScreenTransition.UnCover)
   ```

**Paso 4: Pantalla de Detalles**

1. Duplicate Screen de creación
2. Modificar Form:
    - Mode: `FormMode.View`
    - Item: `GallerySolicitudes.Selected`

3. Agregar Button "Editar"
    - OnSelect: `EditForm(Form2)`

4. Agregar navegación desde Gallery:
    - OnSelect de Gallery: `Navigate(ScreenDetalle, ScreenTransition.Cover)`

#### 🔧 Profundización opcional

> Si estás empezando desde cero, completa primero el Núcleo obligatorio de arriba y guarda tu evidencia. Esta sección — filtros avanzados, modo oscuro, Collections, una segunda app y diseño responsive — puedes hacerla después, incluso después del Módulo 07 de Power Fx. No es requisito para avanzar al Módulo 4.

##### Práctica 3.2: Interactividad y Variables

*Agregar filtros dinámicos*

1. **Insertar Dropdown para filtrar por Estado**
   ```javascript
   // Items del Dropdown
   Distinct('Solicitudes TI', Estado)
   
   // Actualizar Items del Gallery
   Filter(
       'Solicitudes TI',
       Estado.Value = DropdownEstado.Selected.Value || IsBlank(DropdownEstado.Selected)
   )
   ```

2. **Contador de solicitudes**
    - Insertar Label
    - Text: `"Total: " & CountRows(GallerySolicitudes.AllItems)`

3. **Variable para modo oscuro**
   ```javascript
   // Button Toggle Dark Mode
   OnSelect: UpdateContext({IsDarkMode: !IsDarkMode})
   
   // Fill de Screen
   If(IsDarkMode, Color.Black, Color.White)
   
   // Color de Labels
   If(IsDarkMode, Color.White, Color.Black)
   ```

##### Práctica 3.3: Collections y Datos Locales

*Crear app de calculadora de presupuestos*

1. **Inicializar Collection en App.OnStart**
   ```javascript
   // ClearCollect(nombreColeccion, registro1, registro2, ...) vacía y llena una tabla en memoria (Collection)
   // Cada { } es un registro con sus columnas; a diferencia de Dataverse, vive solo en el dispositivo
   ClearCollect(
       ColPresupuestoItems,
       {Item: "Laptops", Cantidad: 0, PrecioUnit: 1200, Total: 0},
       {Item: "Monitores", Cantidad: 0, PrecioUnit: 300, Total: 0},
       {Item: "Mouses", Cantidad: 0, PrecioUnit: 25, Total: 0}
   )
   ```

2. **Gallery editable con input boxes**
    - Text Input para Cantidad
    - OnChange de Input:
   ```javascript
   // UpdateIf(coleccion, condición, cambios) actualiza solo las filas que cumplen la condición
   // Value() convierte el texto del input a número para poder multiplicar
   UpdateIf(
       ColPresupuestoItems,
       Item = ThisItem.Item,
       {
           Cantidad: Value(TextInputCantidad.Text),
           Total: Value(TextInputCantidad.Text) * ThisItem.PrecioUnit
       }
   )
   ```

3. **Label Total General**
   ```javascript
   // Sum(coleccion, columna) suma una columna numérica de todas las filas; Text() la formatea como moneda
   "Total: $" & Text(Sum(ColPresupuestoItems, Total), "$#,##0.00")
   ```

##### Práctica 3.4: Responsive Design

1. Usar contenedores (Insert > Container)
2. Configurar propiedades de layout:
    - LayoutDirection: Vertical / Horizontal
    - LayoutAlignItems: Start, Center, End
    - LayoutGap: 10

3. Usar formulas con Screen.Width:
   ```javascript
   // Gallery Width responsive
   If(Screen.Width < 768, Screen.Width - 20, Screen.Width * 0.6)
   ```

### 💼 Caso Real de Negocio

**Empresa:** Hotel Boutique Terramar — 5 sedes en Colombia, 90 empleados operativos  
**Problema:** El control de visitas a oficinas administrativas era un cuaderno manual. Sin trazabilidad de quién ingresó, a qué hora salió, ni a quién visitó. En una auditoría de seguridad, detectaron que personas no autorizadas habían accedido a zonas restringidas sin registro.  
**Consecuencia:** Brecha de seguridad física, riesgo para datos confidenciales de huéspedes, no cumplían política de seguridad corporativa.

**Solución con Canvas App:**
- App en tablet en recepción: el visitante ingresa nombre, empresa, persona a visitar y foto (cámara integrada)
- Al registrar entrada: notificación automática al empleado visitado (Teams/email) para confirmar autorización
- Registro en Dataverse con timestamp de entrada y salida
- Galería de visitas activas visible para el recepcionista
- Botón de "marcar salida" que calcula duración de visita
- Restricción: si el empleado no confirma en 5 minutos, el flujo escala al jefe de seguridad

**Resultados:**
- Control de acceso en tiempo real desde el primer día de implementación
- Registro digital de 100% de las visitas con foto y hora exacta
- Tiempo de implementación: 2 semanas (1 desarrollador junior Power Platform)
- Costo: $0 adicional — incluido en licencias Microsoft 365 ya existentes

### ✅ Buenas Prácticas

**Desarrollo**:

- Nombrar controles descriptivamente: `btnGuardar`, `galSolicitudes`, `txtBusqueda`
- Usar variables contextuales (UpdateContext) para estados locales de screen
- Usar variables globales (Set) para configuraciones transversales
- Documentar fórmulas complejas con comentarios `//`

**Performance**:

- Entender delegación: usar Filter(), Sort(), Search() delegables
- Evitar Addcolumns(), ForAll() en datasources grandes (> 500 registros)
- Usar Collections para datos pequeños o temporales
- Cargar datos una vez, reutilizar (no llamar Dataverse en cada control)

**UX**:

- Mostrar indicadores de carga (Spinner) en operaciones largas
- Validar inputs antes de SubmitForm
- Mensajes de error claros con Notify()
- Confirmar acciones destructivas (Pop-up modal)

**Seguridad**:

- No exponer datos sensibles en variables globales
- Filtrar datos según User() actual
- Usar roles de Dataverse, no lógica en app

### ⚠️ Errores Comunes

1. **Error**: Gallery no muestra datos o solo 500 registros
    - **Causa**: Función no delegable o limit implícito
    - **Solución**: Usar Filter() con operadores delegables (=, <>, >, <, And, Or)
    - **Check**: Línea azul de delegación warning en formula bar

2. **Error**: "Name conflict" al referenciar columnas
    - **Causa**: Columna tiene nombre reservado (ej: Name, Value)
    - **Solución**: Usar comillas simples: `ThisItem.'Name'`

3. **Error**: Form no guarda cambios
    - **Causa**: SubmitForm() sin capturar resultado
    - **Solución**: 
   ```javascript
   SubmitForm(Form1);
   If(Form1.Error = Blank(), Navigate(Screen2), Notify("Error: " & Form1.Error))
   ```

4. **Error**: Pérdida de datos en variables al cambiar screen
    - **Causa**: Usar UpdateContext (local) en lugar de Set (global)
    - **Solución**: Evaluar scope necesario, usar Set para datos persistentes

5. **Error**: App lenta en carga inicial
    - **Causa**: Queries pesadas en OnStart o OnVisible sin caché
    - **Solución**: Cargar datos críticos en OnStart, lazy load el resto

### 🧪 Criterios de Validación
- [ ] App con mínimo 3 screens conectadas con navegación funcional
- [ ] Gallery mostrando datos de Dataverse con búsqueda/filtros
- [ ] Form para crear y editar registros operativo
- [ ] Uso de mínimo 2 variables (global y contextual)
- [ ] Collection implementada con operaciones CRUD
- [ ] App publicada y compartida con otro usuario de prueba
- [ ] Explicar diferencia entre Canvas y Model-Driven
- [ ] Identificar 3 funciones no delegables y alternativas

> Los primeros 3 criterios (screens, Gallery, Form) corresponden al Núcleo obligatorio. Los demás pertenecen a la Profundización opcional — márcalos cuando vuelvas a esa sección.

### 📸 Evidencia para guardar
- Captura de las 3 pantallas de la app con navegación funcionando.
- Captura del Form guardando un registro nuevo en Dataverse.
- (Opcional, cuando completes la Profundización) captura de la app de calculadora con Collections.

### ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 03 · Primera Canvas App](/labs/lab-03-canvas-primera-app)**

**Por qué:** el Lab 03 construye la interfaz de usuario sobre las tablas `sit_Solicitud` y `sit_Categoria` que ya creaste en el Lab 02 — es la continuación directa de lo que acabas de leer, con pasos exactos en lugar de solo fórmulas de ejemplo.

**Qué evidencia guardar del lab:** capturas de la app publicada, de la navegación entre pantallas, y del formulario guardando un registro real.

---

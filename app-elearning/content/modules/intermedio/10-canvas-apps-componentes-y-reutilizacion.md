---
moduleId: 10
title: "Canvas Apps — Componentes y Reutilización"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 8
slug: "canvas-apps-componentes-y-reutilizacion"
---
### 🎯 Objetivo
Construir una biblioteca de componentes reutilizables en Canvas Apps que elimine la duplicación de código, garantice consistencia visual y reduzca el tiempo de desarrollo en nuevas aplicaciones del 40% o más.

### 📖 Conceptos Clave
- **Component Library:** contenedor especial en Power Apps que almacena componentes Canvas reutilizables de forma independiente de cualquier aplicación. Se publica por separado y puede ser importada por múltiples apps. Cuando se actualiza la librería y se publica, todas las apps que la usan pueden aceptar la actualización con un solo clic (sin necesidad de editar cada app). Una librería puede contener N componentes. Permite estandarizar UI a nivel organizacional. Ejemplo: librería `SIT Component Library` con componentes `cmpHeader`, `cmpStatCard`, `cmpSearchBox` usados en 15 aplicaciones del banco.

- **Custom Component:** control Canvas que encapsula un conjunto de controles, lógica y propiedades en una unidad reutilizable con una interfaz definida (inputs/outputs). Se comporta como una caja negra: el desarrollador de la app solo interactúa con sus propiedades, sin ver la implementación interna. Soportan propiedades de Behavior (funciones que el padre puede llamar). Ejemplo: `cmpHeader` que expone `TituloApp`, `ColorFondo`, `MostrarBtnVolver` como propiedades de entrada.

- **Input Properties:** propiedades de entrada del componente que actúan como parámetros de configuración que recibe desde la app padre. Se definen con un tipo (Texto, Número, Color, Boolean, Registro, Tabla) y un valor por defecto. El componente las lee pero no las puede modificar directamente (son de solo lectura dentro del componente). Ejemplo: `cmpStatCard.Titulo = "Total Solicitudes"` configura el texto visible de la tarjeta desde la app padre.

- **Output Properties / Custom Properties:** propiedades que el componente expone hacia afuera para que la app padre pueda leer valores calculados o resultados del componente. Son de tipo solo salida (el componente las establece, el padre las lee). Cruciales para componentes de entrada de usuario como buscadores o formularios embebidos. Ejemplo: `cmpSearchBox.TextoBusqueda` expone el texto actual del buscador para que la gallery en la app padre filtre sus items.

- **OnReset behavior:** propiedad de comportamiento especial de los componentes que define qué ocurre cuando el padre ejecuta `Reset(nombreComponente)`. Permite que el componente reinicie su estado interno (variables locales, TextInputs) sin necesidad de que el padre conozca los detalles internos. Útil para formularios reutilizables que deben limpiarse después de guardar.

- **Component Lifecycle:** ciclo que va desde la creación del componente en la librería, la publicación de la librería, la importación en las apps consumidoras, y la gestión de actualizaciones. Al publicar una nueva versión de la librería, las apps no se actualizan automáticamente — el desarrollador de cada app debe aceptar la actualización manualmente. Esto previene cambios disruptivos no deseados en apps en producción. Importante: siempre documentar breaking changes antes de publicar.

- **Named Formulas:** expresiones Power Fx declaradas en la propiedad `App.Formulas` (no en `App.OnStart`) que se evalúan de forma lazy (solo cuando se usan) y se recalculan automáticamente cuando sus dependencias cambian. A diferencia de variables en `OnStart` que se calculan una vez al inicio, las Named Formulas son reactivas. Permiten definir cálculos globales sin código imperativo. Ejemplo: `TotalSolicitudes = CountRows(colSolicitudes)` se recalcula automáticamente cada vez que `colSolicitudes` cambia.

- **With():** función Power Fx que crea un scope local con variables nombradas para evitar repetir expresiones complejas y mejorar la legibilidad. Funciona como un "let" local: `With({precioConIVA: precio * 1.19, descuento: precio * 0.05}, precioConIVA - descuento)`. Diferencia vs variables de contexto: With es una expresión (retorna un valor), no una instrucción imperativa. Ideal para cálculos intermedios dentro de una fórmula.

- **Delegation (Delegación):** mecanismo por el cual Power Apps transfiere el procesamiento de una consulta al origen de datos (Dataverse, SharePoint) en lugar de traer todos los registros al cliente. Una operación es "delegable" cuando el conector soporta ejecutarla en el servidor. Si no es delegable, Power Apps trae hasta 500 (o 2000) registros y aplica el filtro localmente, perdiendo datos. Ejemplo delegable: `Filter(Proyectos, sit_estado = "En Curso")` en Dataverse. No delegable en Sharepoint: `Filter(lista, StartsWith(Nombre, txtBusqueda.Text))`. Siempre revisar las advertencias de delegación (triángulo amarillo) en el editor de fórmulas.

- **Lazy Loading:** técnica de arquitectura en Canvas Apps para reducir el tiempo de carga inicial cargando datos solo cuando la pantalla que los necesita es navegada. Se implementa cargando colecciones en el evento `OnVisible` de cada pantalla en lugar de todas en `App.OnStart`. Combinar con Named Formulas para cálculos derivados. Impacto típico: reducción del tiempo de carga inicial de 8-15 segundos a 2-3 segundos en apps con múltiples fuentes de datos.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 10.1: Crear Component Library
1. make.powerapps.com → Aplicaciones → Bibliotecas de componentes → Nueva biblioteca
2. Nombre: `SIT Component Library`
3. Se abre el editor de Canvas con panel de componentes a la izquierda

#### Actividad 10.2: Componente Header Universal
1. En la biblioteca → Nuevo componente → Nombre: `cmpHeader`
2. Dimensiones: Width=App.Width, Height=60
3. Agregar propiedades de entrada:
    - `TituloApp` (Texto, default: "Mi Aplicación")
    - `ColorFondo` (Color, default: RGBA(0,120,212,1))
    - `ColorTexto` (Color, default: RGBA(255,255,255,1))
    - `MostrarBtnVolver` (Boolean, default: false)

4. Insertar Rectangle:
   ```
   Rectangle1.Fill: cmpHeader.ColorFondo
   Rectangle1.Width: Parent.Width
   Rectangle1.Height: Parent.Height
   ```

5. Insertar Label para el título:
   ```
   lblTitulo.Text: cmpHeader.TituloApp
   lblTitulo.Color: cmpHeader.ColorTexto
   lblTitulo.Size: 18
   lblTitulo.FontWeight: FontWeight.Bold
   lblTitulo.X: If(cmpHeader.MostrarBtnVolver, 60, 20)
   ```

6. Insertar Icon chevronLeft (visible condicionalmente):
   ```
   icoVolver.Visible: cmpHeader.MostrarBtnVolver
   icoVolver.Color: cmpHeader.ColorTexto
   icoVolver.OnSelect: Back()
   ```

#### Actividad 10.3: Componente Card de Estadística
1. Nuevo componente → `cmpStatCard`
2. Dimensiones: Width=200, Height=100
3. Propiedades de entrada:
    - `Titulo` (Texto, default: "Métrica")
    - `Valor` (Número, default: 0)
    - `Icono` (Texto, default: "calendar") — nombre del ícono de Fluent
    - `ColorAcento` (Color, default: RGBA(0,120,212,1))

4. Diseño del componente:
   ```
   // Rectangle de fondo con sombra simulada
   rectFondo.Fill: White
   rectFondo.BorderColor: RGBA(200,200,200,1)
   rectFondo.BorderThickness: 1
   
   // Barra de color superior
   rectAccento.Fill: cmpStatCard.ColorAcento
   rectAccento.Height: 4
   rectAccento.Width: Parent.Width
   
   // Número grande
   lblValor.Text: Text(cmpStatCard.Valor, "#,##0")
   lblValor.Size: 28
   lblValor.FontWeight: FontWeight.Bold
   lblValor.Color: RGBA(32,32,32,1)
   
   // Etiqueta debajo
   lblTitulo.Text: cmpStatCard.Titulo
   lblTitulo.Size: 12
   lblTitulo.Color: RGBA(96,96,96,1)
   ```

#### Actividad 10.4: Componente de Búsqueda con Debounce
1. Nuevo componente → `cmpSearchBox`
2. Propiedades de entrada:
    - `Placeholder` (Texto, default: "Buscar...")

3. Propiedades de salida (custom):
    - `TextoBusqueda` (Texto)

4. Agregar Timer para debounce:
   ```
   // Timer que dispara 500ms después de que el usuario deja de escribir
   tmrDebounce.Duration: 500
   tmrDebounce.AutoStart: false
   tmrDebounce.OnTimerEnd: UpdateContext({_textoBusqueda: txtBusqueda.Text})
   
   // TextInput
   txtBusqueda.OnChange: Reset(tmrDebounce); tmrDebounce.Start()
   txtBusqueda.HintText: cmpSearchBox.Placeholder
   
   // Custom Output property
   TextoBusqueda: _textoBusqueda
   ```

#### Actividad 10.5: Publicar y usar la librería
1. En la biblioteca → Guardar → Publicar
2. Abrir una app Canvas existente (del Módulo 5)
3. Insertar → Obtener más componentes → Librería: `SIT Component Library`
4. Importar `cmpHeader`, `cmpStatCard`, `cmpSearchBox`
5. Usar `cmpHeader` en cada pantalla:
   ```
   // En Screen1
   cmpHeader_1.TituloApp: "Panel de Solicitudes"
   cmpHeader_1.MostrarBtnVolver: false
   
   // En Screen2
   cmpHeader_2.TituloApp: "Detalle de Solicitud"
   cmpHeader_2.MostrarBtnVolver: true
   ```

6. Usar `cmpStatCard` para KPIs:
   ```
   // 4 tarjetas en horizontal con Gallery horizontal
   cmpStatCard_Total.Titulo: "Total Solicitudes"
   cmpStatCard_Total.Valor: CountRows(colSolicitudes)
   cmpStatCard_Total.ColorAcento: RGBA(0,120,212,1)
   ```

#### Actividad 10.6: Named Formulas para rendimiento
1. En App.Formulas (Property: Formulas, no OnStart):
   ```js
   // Named formulas — se evalúan lazy, no en OnStart
   TotalSolicitudes = CountRows(colSolicitudes);
   SolicitudesPendientes = CountRows(Filter(colSolicitudes, Estado = "Pendiente"));
   SolicitudesHoy = CountRows(
       Filter(colSolicitudes, DateValue(Text('Fecha Solicitud')) = Today())
   );
   UsuarioActual = User().FullName;
   ```

2. Usar en las tarjetas de estadística:
   ```
   cmpStatCard_Pendientes.Valor: SolicitudesPendientes
   ```

### 💼 Caso Real de Negocio
**Empresa:** Banco regional con 15 aplicaciones Canvas diferentes  
**Problema:** Cada app tiene su propio header, colores y estilos. Un cambio de branding requería actualizar 15 apps manualmente.  
**Solución:** Component Library con tema corporativo centralizado. Al actualizar el componente y publicar, todas las apps pueden aceptar la actualización en 1 clic. Reducción de tiempo de implementación de cambios visuales de 2 semanas a 2 horas.  
**Resultado:** Consistencia de marca 100%, ahorro de ~40 horas/mes en mantenimiento.

### ✅ Buenas Prácticas
- Una biblioteca por dominio/área de negocio, no una mega-librería global
- Las propiedades de salida deben ser simples (texto, número, booleano); evitar colecciones como output
- Documentar cada propiedad de input con el campo "Descripción" del editor de componentes
- Versionar las bibliotecas con comentarios de cambio antes de publicar
- Nunca modificar el componente directamente en la app — hacerlo en la librería y actualizarlo
- Named Formulas (declaradas en `App.Formulas`, no en `App.OnStart`) son preferibles a variables globales para mejor rendimiento: se evalúan de forma lazy y reactiva en lugar de calcularse de forma imperativa al iniciar la app

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Componente no muestra cambios | Librería publicada pero app no actualizada | En la app: Insertar → Componentes → ícono de actualización |
| Output property siempre vacío | No se asignó `UpdateContext` o falta referencia correcta | Usar variable local dentro del componente y exponerla como property |
| App lenta con Named Formulas | Fórmula con delegación incompleta trae miles de registros | Asegurar que las fórmulas usen operaciones delegables |
| Error "circular dependency" | Named Formula referencia otra Named Formula circular | Romper la dependencia usando variable intermedia |

### 🧪 Criterios de Validación
- [ ] Component Library creada y publicada en el entorno de desarrollo
- [ ] Componente `cmpHeader` funciona con propiedades configurables de título y color
- [ ] Componente `cmpStatCard` muestra valor numérico formateado con acento de color
- [ ] `cmpSearchBox` implementa debounce de 500ms y expone `TextoBusqueda` como output
- [ ] App de prueba importa y usa los 3 componentes correctamente
- [ ] Named Formulas declaradas en `App.Formulas` eliminan variables globales de `App.OnStart` para cálculos derivados

---

---
moduleId: 26
title: "Performance y Optimización"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 9
slug: "performance-y-optimizacion"
---
### 🎯 Objetivo
Diagnosticar y resolver problemas de rendimiento en Canvas Apps, Power Automate, Dataverse y reportes Power BI usando herramientas nativas y mejores prácticas de optimización.

### 📖 Conceptos Clave
- **Delegación en Canvas Apps:** la capacidad de una función o fórmula de ejecutarse en el servidor (Dataverse/SharePoint) en lugar del cliente (el navegador del usuario). Las operaciones delegables — `Filter`, `Sort`, `Search` con operadores soportados — se ejecutan en el servidor y solo devuelven los datos necesarios. Las no-delegables — como `Left()`, `Len()`, funciones de texto complejo — se ejecutan en el cliente sobre los registros ya descargados, con el riesgo de trabajar sobre un subconjunto incompleto.
- **Límite de delegación:** número máximo de registros que Power Apps descarga del servidor cuando una fórmula no es delegable. El default es 500, configurable hasta 2000 en Archivo → Configuración → Límite de registros de datos. Si la tabla tiene 50,000 registros y la fórmula no es delegable, el usuario solo verá los primeros 500/2000 — sin ningún aviso en runtime, a menos que el desarrollador haya activado la advertencia en el IDE.
- **Concurrency en Apply to Each:** configuración en Power Automate que procesa los ítems de un bucle en paralelo en lugar de secuencialmente. Se activa en el engranaje del Apply to Each → Concurrency Control → On, con un Degree of Parallelism de 1 a 50. Con 10 ítems que tardan 2s cada uno: secuencial = 20s, concurrente con 10 = 2s. Precaución: puede causar rate-limiting si el sistema destino tiene límites de llamadas por segundo.
- **Batch API de Dataverse:** funcionalidad de la OData API que agrupa múltiples operaciones CRUD en una sola solicitud HTTP usando `$batch`. En lugar de 100 llamadas separadas para crear 100 registros (100 round-trips de red), se envía 1 solicitud con 100 operaciones y se recibe 1 respuesta. Reduce significativamente la latencia en operaciones masivas. En Power Automate se implementa con la acción "Perform a changeset request" en el conector de Dataverse.
- **FetchXML optimizado:** lenguaje de consulta XML de Dataverse que permite hacer joins entre tablas, filtros complejos, agrupaciones y ordenamientos en una sola llamada al servidor. Ejemplo: en lugar de obtener 100 solicitudes y luego 100 llamadas para obtener el nombre del cliente de cada una (N+1 queries), un FetchXML con `<link-entity>` hace el join en el servidor y devuelve solicitud + datos del cliente en 1 llamada. Se genera visualmente con la herramienta FetchXML Builder de XrmToolBox.
- **Indexed columns (columnas con índice):** columnas de tablas de Dataverse marcadas con "Habilitar para búsqueda" en el editor de columnas. Dataverse crea un índice de base de datos para estas columnas, acelerando dramáticamente los filtros y búsquedas sobre ellas. Ejemplo: si la galería de una Canvas App filtra por `sit_numeropedido`, agregar índice a esa columna puede reducir el tiempo de consulta de 8 segundos a 0.3 segundos en tablas con millones de registros.
- **Power BI Import vs DirectQuery:** Import Mode carga los datos en caché comprimida en memoria del modelo de Power BI — las consultas son extremadamente rápidas (milisegundos) pero los datos tienen un lag de hasta la última actualización (mín. 30 min en Power BI Service, o bajo demanda). DirectQuery ejecuta cada interacción del usuario como una consulta en tiempo real al origen de datos — siempre muestra datos actuales pero cada clic puede tardar segundos si la consulta es compleja o el origen es lento.
- **Aggregations en Power BI:** tablas pre-calculadas que contienen sumas, conteos y promedios de las tablas de detalle. Cuando un usuario ve un reporte de totales mensuales, Power BI usa la tabla de Aggregations en lugar de escanear millones de filas de la tabla de detalle — reduciendo el tiempo de respuesta de minutos a fracciones de segundo. Se configuran en el modelo de datos vinculando la tabla de aggregations a la tabla de detalle con la opción "Manage aggregations".
- **Monitor de Canvas App:** herramienta de diagnóstico integrada en Power Apps Studio (Alt+Shift+M o Herramientas → Monitor) que registra en tiempo real todas las llamadas a conectores con sus tiempos de respuesta, códigos HTTP, payloads enviados y recibidos. Permite identificar qué llamada específica causa lentitud: una llamada a Dataverse que tarda 4 segundos en lugar de 0.2 segundos es candidata a optimizar con FetchXML, índice, o delegación.
- **Plugin Trace Log:** registro de todos los mensajes escritos con `ITracingService.Trace()` en los plugins, accesible en D365 → Configuración → Plugin Trace Log. Se puede configurar para registrar solo cuando hay excepción ("Exception Only") o siempre ("All") — en producción se usa "Exception Only" para no impactar rendimiento. Cada entrada muestra la duración del plugin, el stack trace de errores, y todos los mensajes `Trace()` escritos durante la ejecución.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 26.1: Diagnóstico de delegación en Canvas App
1. Habilitar límite de delegación visible: Archivo → Configuración → Próximas características → Mostrar advertencia de delegación
2. Identificar fórmulas con punto amarillo de delegación:
   ```js
   // ❌ No delegable — filtra en cliente (max 2000 registros)
   Filter(Solicitudes, Left(Nombre, 3) = "SOL")
   
   // ✅ Delegable a Dataverse — filtra en servidor
   Filter(Solicitudes, StartsWith(Nombre, "SOL"))
   
   // ❌ No delegable
   Filter(Solicitudes, Len(Nombre) > 10)
   
   // ✅ Delegable
   Filter(Solicitudes, FechaCreacion >= DateAdd(Today(), -30, Days))
   ```

3. Para búsquedas de texto completo sin delegación, usar Search() solo en el campo visible y cargar datos paginados

#### Actividad 26.2: Optimizar App.OnStart con carga paralela
```js
// ❌ Carga secuencial — suman los tiempos
App.OnStart:
    ClearCollect(colClientes, Clients);
    ClearCollect(colProductos, Products);
    ClearCollect(colSolicitudes, Solicitudes);

// ✅ Carga paralela con Concurrent()
App.OnStart:
    Concurrent(
        ClearCollect(colClientes, Filter(Clients, Estado = "Activo")),
        ClearCollect(colProductos, Filter(Products, Disponible = true)),
        Set(varConfig, First(Configuracion))
    )
// Reduce tiempo de carga hasta 70% en apps con múltiples fuentes
```

#### Actividad 26.3: FetchXML optimizado en Power Automate
```xml
<!-- ❌ Múltiples llamadas separadas -->
<!-- Llamada 1: Get solicitud -->
<!-- Llamada 2: Get cliente relacionado -->  
<!-- Llamada 3: Get productos de la solicitud -->

<!-- ✅ Un solo FetchXML con joins -->
<fetch top="50">
  <entity name="sit_solicitud">
    <attribute name="sit_nombre"/>
    <attribute name="sit_estado"/>
    <attribute name="sit_total"/>
    <link-entity name="account" from="accountid" to="sit_clienteid" alias="cliente">
      <attribute name="name"/>
      <attribute name="emailaddress1"/>
    </link-entity>
    <link-entity name="sit_solicitudproducto" from="sit_solicitudid" 
                 to="sit_solicitudid" link-type="outer" alias="prod">
      <attribute name="sit_cantidad"/>
      <attribute name="sit_precio"/>
    </link-entity>
    <filter>
      <condition attribute="sit_estado" operator="eq" value="1"/>
      <condition attribute="createdon" operator="last-x-days" value="30"/>
    </filter>
  </entity>
</fetch>
```

#### Actividad 26.4: Apply to Each con concurrencia
```
// En Power Automate → Apply to Each → Settings (engranaje) → Concurrency Control
// Activar: On
// Degree of Parallelism: 10 (ajustar según API limits del sistema destino)

// Reducción típica: 100 items × 2s cada uno = 200s secuencial → 20s con concurrencia 10
```

#### Actividad 26.5: Power BI — Import vs DirectQuery
```
Criterios de selección:
  Dataset < 1GB y se actualiza máx cada 30 min → Import Mode (más rápido)
  Dataset en tiempo real o > 10GB → DirectQuery
  Dataset grande pero reportes sobre totales → Aggregations sobre Import
  
Optimizaciones Import:
  - Eliminar columnas no usadas antes de cargar
  - Aplicar filtros en Power Query (reduce filas cargadas)
  - Usar tipos de datos correctos (Text vs Int — Int ocupa menos)
  
Power Query M para filtrar en origen (server-side):
```
```m
let
    Origen = Sql.Database("servidor", "BaseDatos"),
    Tabla = Origen{[Schema="dbo",Item="Ventas"]}[Data],
    // Este filtro se ejecuta en SQL Server, no en Power BI
    FiltroFecha = Table.SelectRows(Tabla, each [FechaVenta] >= #date(2024,1,1)),
    QuitarColumnas = Table.RemoveColumns(FiltroFecha, {"ColInterna1", "ColInterna2"})
in
    QuitarColumnas
```

### 💼 Caso Real de Negocio
**Empresa:** Retailer con Canvas App de 15 pantallas para 500 vendedores  
**Problema:** La app tardaba 45 segundos en cargar. Los vendedores la abandonaban antes de que cargara.  
**Solución:** App.OnStart con Concurrent() reducido de 8 tablas a 3 esenciales. Named Formulas lazy-load. Paginación en lugar de ClearCollect de todos los registros. Imágenes de productos optimizadas a WebP.  
**Resultado:** Tiempo de carga: de 45s a 6s. Adopción de la app: de 60% a 92%.

### ✅ Buenas Prácticas
- Usar Monitor (Alt+Shift+M en Canvas App) para medir tiempos de cada llamada
- Paginación > ClearCollect de toda la tabla para datos > 1000 registros
- Nunca hacer ClearCollect dentro de Gallery.Items — se ejecuta en cada render
- En Dataverse: agregar índice de búsqueda a columnas usadas frecuentemente en filtros
- En Power BI: aplicar filtros en Power Query (source-side) antes de cargar al modelo — las filas eliminadas en el origen nunca ocupan memoria
- Usar Named Formulas en Canvas Apps para cálculos derivados — se evalúan una sola vez y se memorizan

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Canvas App muestra solo 500 registros en el gallery | Función `Filter` con operador no delegable (e.g., `Left()`) | Reemplazar con operadores delegables: `StartsWith()`, comparaciones de fecha, campos de lookup |
| `Concurrent()` causa errores de escritura simultánea en colecciones | Dos ramas de `Concurrent()` modifican la misma variable `colDatos` | No compartir colecciones entre ramas de `Concurrent()` — cada rama debe escribir en su propia colección |
| Power Automate tarda horas en procesar 1,000 registros | Apply to Each sin concurrencia — procesa 1 a la vez | Activar Concurrency Control en el Apply to Each con Degree of Parallelism 10–20 |
| Plugin tarda 30+ segundos y causa timeout | `RetrieveMultiple` sin `TopCount` ni índice en la columna de filtro | Agregar `query.TopCount = 1` y habilitar índice en la columna filtrada en Dataverse |
| Power BI DirectQuery lento en reportes de totales | Cada interacción ejecuta una consulta full-scan en la tabla de origen | Cambiar a Import Mode con actualización programada, o crear tabla de Aggregations |
| App.OnStart carga lento aunque usa Concurrent() | `Concurrent()` tiene una rama que espera a otra (dependencia de datos) | Verificar que las ramas son verdaderamente independientes — ninguna usa datos de la otra rama |

### 🧪 Criterios de Validación
- [ ] Al menos 2 fórmulas no-delegables identificadas y corregidas en la app del proyecto
- [ ] App.OnStart usa Concurrent() para cargas independientes
- [ ] FetchXML con join reemplaza 3 llamadas separadas con el mismo resultado
- [ ] Power BI report con > 1M filas usa Import Mode con filtro en Power Query

---

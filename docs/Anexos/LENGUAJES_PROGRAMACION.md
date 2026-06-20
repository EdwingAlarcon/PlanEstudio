# LENGUAJES DE PROGRAMACIÓN EN POWER PLATFORM & DYNAMICS 365
**Referencia técnica completa** | Consultar cuando necesites sintaxis o ejemplos de cada lenguaje

---

## Índice

1. [Power Fx](#power-fx) — Canvas Apps y Model-Driven
2. [JavaScript / TypeScript](#javascript-typescript) — Web Resources y PCF
3. [C#](#c) — Plugins, Custom Workflow Activities
4. [DAX](#dax) — Power BI
5. [Power Query M](#power-query-m) — ETL en Power BI y Dataflows
6. [T-SQL / FetchXML](#t-sql-fetchxml) — Consultas a Dataverse
7. [Liquid](#liquid) — Power Pages
8. [YAML](#yaml) — Pipelines CI/CD
9. [JSON](#json) — Configuraciones y APIs

---

## Power Fx

**Usado en:** Canvas Apps, Model-Driven (formularios con Express Design), Power Pages  
**Paradigma:** Declarativo, reactivo — similar a Excel con columnas

### Tipos de datos
```js
// Texto
"Hola mundo"
"Resultado: " & varNombre          // concatenar con &

// Número
42
3.14
1_000_000                          // separador de miles (legibilidad)

// Boolean
true / false
IsBlank(campo)                     // true si vacío o null
IsEmpty(colección)                 // true si colección sin registros

// Fecha y hora
Today()                            // fecha actual (sin hora)
Now()                              // fecha y hora actual
DateAdd(Today(), -7, Days)        // hace 7 días
DateDiff(fecha1, fecha2, Days)    // diferencia en días

// Color
RGBA(0, 120, 212, 1)              // azul Microsoft con opacidad 1
ColorFade(Color.Blue, 0.8)        // azul aclarado 80%

// Registro (objeto)
{Nombre: "Juan", Edad: 30}

// Tabla (colección de registros)
[{Nombre: "Ana"}, {Nombre: "Luis"}]
```

### Fórmulas esenciales
```js
// Condicional
If(condición, valorSi, valorNo)
Switch(
    variable,
    "Caso1", resultado1,
    "Caso2", resultado2,
    resultadoDefault
)

// Filtrado y búsqueda
Filter(Tabla, condición1 && condición2)
Search(Tabla, textoBusqueda, "columna1", "columna2")  // búsqueda en texto
LookUp(Tabla, ID = varID, ColumnaDeseada)              // primer match

// Agregación
Sum(Tabla, columnaNumérica)
CountRows(Filter(Tabla, condición))
Average(Tabla, columna)
Max(Tabla, columna)
Min(Tabla, columna)

// Colecciones (tablas en memoria)
ClearCollect(miColección, DataSource)          // sobreescribe
Collect(miColección, {campo: valor})           // agrega registros
Remove(miColección, registro)
RemoveIf(miColección, condición)
UpdateIf(miColección, condición, {campo: nuevoValor})
Clear(miColección)

// Patch (crear/actualizar en fuente de datos)
Patch(
    'Solicitudes',
    Defaults('Solicitudes'),           // nuevo registro
    {
        sit_nombre: txtNombre.Text,
        sit_estado: 1,
        sit_fecha: Today()
    }
)

// Actualizar registro existente
Patch(
    'Solicitudes',
    galSolicitudes.Selected,           // registro a actualizar
    {sit_estado: 2}
)

// Navegación
Navigate(Screen2)
Navigate(Screen2, ScreenTransition.Fade)
Navigate(Screen2, ScreenTransition.None, {contexto: "valor"})
Back()

// Variables
Set(varNombre, "Juan")                 // variable global
UpdateContext({varLocal: 42})          // variable de pantalla

// Formularios
SubmitForm(Form1)
ResetForm(Form1)
NewForm(Form1)
EditForm(Form1)

// Reset de controles
Reset(TextInput1)
Reset(Gallery1)
```

### Patrones avanzados de Power Fx
```js
// Multi-filtro con condiciones opcionales (patrón de búsqueda real)
Filter(
    'Solicitudes TI',
    (IsBlank(ddCategoria.Selected.Value) || Categoría = ddCategoria.Selected.Value) &&
    (IsBlank(dpDesde.SelectedDate) || 'Fecha Solicitud' >= dpDesde.SelectedDate) &&
    (txtBusqueda.Text = "" || txtBusqueda.Text in Título)
)

// Concurrent — carga paralela de colecciones
Concurrent(
    ClearCollect(colClientes, Filter(Accounts, Status = "Active")),
    ClearCollect(colProductos, Products),
    Set(varConfig, First(Configuracion))
)

// With — agrupar expresiones sin variable
With(
    {precio: Slider1.Value, cantidad: Slider2.Value},
    "Total: " & Text(precio * cantidad, "$#,##0.00")
)

// ForAll — iterar y transformar colección
ForAll(
    colSolicitudes,
    Patch('HistorialSolicitudes', Defaults('HistorialSolicitudes'), {
        solicitudId: ThisRecord.ID,
        estado: ThisRecord.Estado,
        fechaProceso: Now()
    })
)

// Named Formulas (App.Formulas — lazy evaluation)
TotalPendientes = CountRows(Filter(colSolicitudes, Estado = "Pendiente"));
UsuarioActual = User().FullName;

// Paginación manual con variables
// OnSelect del botón "Siguiente página":
UpdateContext({varPagina: varPagina + 1});
ClearCollect(
    colPaginaActual,
    FirstN(
        LastN(
            Sort(Solicitudes, 'Fecha Creación', SortOrder.Descending),
            CountRows(Solicitudes) - (varPagina - 1) * varTamañoPagina
        ),
        varTamañoPagina
    )
)
```

### Funciones de texto
```js
Left("Solicitud-001", 9)           // "Solicitud"
Right("usuario@empresa.com", 11)   // "empresa.com"
Mid("Power Platform", 7, 8)        // "Platform"
Len("Hola")                        // 4
Upper("hola")                      // "HOLA"
Lower("HOLA")                      // "hola"
Trim("  hola  ")                   // "hola"
Substitute("hola mundo", "mundo", "planeta")  // "hola planeta"
Text(1234567.89, "$#,##0.00")      // "$1,234,567.89"
Value("42.5")                       // 42.5 (texto a número)
```

---

## JavaScript / TypeScript

**Usado en:** Web Resources (formularios Model-Driven), PCF controls  
**Paradigma:** Imperativo/orientado a objetos con funcional

### Web Resources — API de formularios (formContext)
```javascript
// SIEMPRE usar formContext, nunca Xrm.Page (deprecated)
var MiFormHandler = MiFormHandler || {};

MiFormHandler.onLoad = function(executionContext) {
    var formContext = executionContext.getFormContext();
    
    // Leer valor de un campo
    var estado = formContext.getAttribute("sit_estado").getValue();
    var nombre = formContext.getAttribute("sit_nombre").getValue();
    var lookup = formContext.getAttribute("sit_cliente").getValue(); // array o null
    var lookupId = lookup && lookup[0] ? lookup[0].id.replace(/[{}]/g, "") : null;
    
    // Establecer valor
    formContext.getAttribute("sit_estado").setValue(100000001);
    formContext.getAttribute("sit_nombre").setValue("Nuevo Nombre");
    
    // Leer/establecer lookup
    formContext.getAttribute("sit_responsable").setValue([{
        id: "{00000000-0000-0000-0000-000000000001}",
        name: "Juan Pérez",
        entityType: "systemuser"
    }]);
    
    // Mostrar/ocultar campo
    formContext.getControl("sit_campo").setVisible(true);
    
    // Habilitar/deshabilitar campo
    formContext.getControl("sit_campo").setDisabled(false);
    
    // Requerido
    formContext.getAttribute("sit_campo").setRequiredLevel("required"); // none, recommended, required
    
    // Notificación en el formulario
    formContext.ui.setFormNotification("Mensaje de aviso", "WARNING", "id_unico");
    formContext.ui.clearFormNotification("id_unico");
    
    // Notificación en un campo específico
    formContext.getControl("sit_campo").setNotification("Error en este campo", "errorId");
    formContext.getControl("sit_campo").clearNotification("errorId");
    
    // Registrar evento onChange en un campo
    formContext.getAttribute("sit_estado").addOnChange(
        MiFormHandler.onEstadoChange
    );
};

MiFormHandler.onEstadoChange = function(executionContext) {
    var formContext = executionContext.getFormContext();
    var nuevoEstado = formContext.getAttribute("sit_estado").getValue();
    // lógica...
};

MiFormHandler.onSave = function(executionContext) {
    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();
    
    // Cancelar guardado
    if (condicionError) {
        eventArgs.preventDefault();
        formContext.ui.setFormNotification("Error: ...", "ERROR", "saveError");
    }
};

// Llamar Web API desde formulario
MiFormHandler.consultarDatos = function(formContext) {
    var solicitudId = formContext.data.entity.getId().replace(/[{}]/g, "");
    
    Xrm.WebApi.retrieveRecord(
        "sit_solicitud",
        solicitudId,
        "?$select=sit_nombre,sit_estado&$expand=sit_cliente($select=name)"
    ).then(function(result) {
        console.log("Nombre:", result["sit_nombre"]);
        console.log("Cliente:", result["sit_cliente"]?.["name"]);
    }, function(error) {
        console.error("Error:", error.message);
    });
    
    // Retrieve Multiple
    Xrm.WebApi.retrieveMultipleRecords(
        "sit_tarea",
        "?$filter=_sit_solicitud_value eq " + solicitudId + 
        "&$select=sit_titulo,sit_estado&$orderby=createdon desc&$top=5"
    ).then(function(result) {
        result.entities.forEach(function(tarea) {
            console.log(tarea["sit_titulo"], tarea["sit_estado@OData.Community.Display.V1.FormattedValue"]);
        });
    });
    
    // Create record
    Xrm.WebApi.createRecord("sit_tarea", {
        "sit_titulo": "Nueva tarea automática",
        "_sit_solicitud_value": solicitudId
    }).then(function(result) {
        console.log("Creado:", result.id);
    });
};
```

### TypeScript para PCF
```typescript
// index.ts — PCF Field Control básico
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";

interface MyComponentProps {
    value: string;
    onChange: (newValue: string) => void;
    disabled: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({ value, onChange, disabled }) => {
    const [localValue, setLocalValue] = React.useState(value);
    
    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return React.createElement("input", {
        value: localValue,
        disabled: disabled,
        style: { width: "100%", padding: "4px", border: "1px solid #ccc" },
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalValue(e.target.value);
            onChange(e.target.value);
        }
    });
};

export class MiPCFControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private currentValue: string = "";

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(
        context: ComponentFramework.Context<IInputs>
    ): React.ReactElement {
        const value = context.parameters.sampleProperty.raw ?? "";
        const isDisabled = context.mode.isControlDisabled;
        
        return React.createElement(MyComponent, {
            value: value,
            disabled: isDisabled,
            onChange: (newVal: string) => {
                this.currentValue = newVal;
                this.notifyOutputChanged();
            }
        });
    }

    public getOutputs(): IOutputs {
        return {
            sampleProperty: this.currentValue
        };
    }

    public destroy(): void { }
}

// Uso de WebApi desde PCF
async function consultarDataverse(
    webAPI: ComponentFramework.WebApi,
    entityName: string,
    filter: string
): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
    return await webAPI.retrieveMultipleRecords(
        entityName,
        `?$filter=${filter}&$top=50`
    );
}

// Uso de navigation desde PCF
function abrirRegistro(
    navigation: ComponentFramework.Navigation,
    entityName: string,
    id: string
): void {
    navigation.openForm({
        entityName: entityName,
        entityId: id
    });
}
```

### Comandos pac CLI para PCF
```bash
# Inicializar proyecto PCF
pac pcf init --namespace MiNamespace --name MiControl --template field --framework react

# Instalar dependencias
npm install

# Compilar para desarrollo (con watch)
npm start watch

# Compilar para producción
npm run build -- --buildMode production

# Hacer push al entorno
pac auth create --url https://tuorg.crm.dynamics.com
pac pcf push --publisher-prefix sit

# Actualizar versión antes de publicar nueva versión
pac pcf version --patchversion
```

---

## C#

**Usado en:** Plugins de Dataverse, Custom Workflow Activities, Azure Functions, integration services  
**Framework:** .NET Framework 4.6.2 para plugins (sandbox); .NET 8 para Azure Functions

### Plugin completo con Early-Bound
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace SIT.Plugins
{
    /// <summary>
    /// Plugin Pre-Create para sit_solicitud:
    /// - Valida requerimientos de negocio
    /// - Genera número automático
    /// - Establece fecha de vencimiento según prioridad
    /// </summary>
    public class SolicitudPreCreatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtener servicios — siempre en este orden
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            var service = serviceFactory.CreateOrganizationService(context.UserId);

            // Guards obligatorios para evitar ejecución inesperada
            if (context.Depth > 1) return;
            if (context.MessageName != "Create") return;
            if (context.Stage != 20) return; // Pre-operation
            if (!context.InputParameters.Contains("Target")) return;
            if (!(context.InputParameters["Target"] is Entity target)) return;

            tracer.Trace("SolicitudPreCreate iniciado para {0}", target.LogicalName);

            try
            {
                ValidarYEnriquecer(target, service, tracer);
            }
            catch (InvalidPluginExecutionException)
            {
                throw; // Re-throw para que llegue al usuario
            }
            catch (Exception ex)
            {
                tracer.Trace("Error inesperado: {0}\n{1}", ex.Message, ex.StackTrace);
                throw new InvalidPluginExecutionException(
                    $"Error interno. Contacte al administrador. Ref: {context.CorrelationId}", ex);
            }
        }

        private void ValidarYEnriquecer(Entity target, IOrganizationService service, ITracingService tracer)
        {
            // Leer campos con extensiones para mayor seguridad
            var prioridad = target.GetAttributeValue<OptionSetValue>("sit_prioridad");
            var presupuesto = target.GetAttributeValue<Money>("sit_presupuesto");
            var esUrgente = prioridad?.Value == 100000002;

            // Validación de negocio
            if (esUrgente && (presupuesto == null || presupuesto.Value <= 0))
            {
                throw new InvalidPluginExecutionException(
                    "Las solicitudes urgentes requieren un presupuesto asignado mayor a $0.");
            }

            // Calcular fecha de vencimiento
            var fechaVencimiento = prioridad?.Value switch
            {
                100000002 => DateTime.UtcNow.AddHours(4),    // Urgente
                100000001 => DateTime.UtcNow.AddHours(24),   // Alta
                _         => DateTime.UtcNow.AddDays(5)      // Normal/Baja
            };
            target["sit_fechavencimiento"] = fechaVencimiento;

            // Generar número automático
            target["sit_numero"] = GenerarNumeroAutomatico(service, tracer);
            tracer.Trace("Número asignado: {0}", target["sit_numero"]);
        }

        private string GenerarNumeroAutomatico(IOrganizationService service, ITracingService tracer)
        {
            var query = new QueryExpression("sit_solicitud")
            {
                ColumnSet = new ColumnSet("sit_numero"),
                TopCount = 1
            };
            query.AddOrder("createdon", OrderType.Descending);

            var resultado = service.RetrieveMultiple(query);
            int siguiente = 1;

            if (resultado.Entities.Count > 0)
            {
                var ultimo = resultado.Entities[0].GetAttributeValue<string>("sit_numero");
                if (ultimo?.StartsWith("SOL-") == true &&
                    int.TryParse(ultimo.Substring(4), out int num))
                {
                    siguiente = num + 1;
                }
            }

            return $"SOL-{siguiente:D5}";
        }
    }
}
```

### Entity Reference y relaciones
```csharp
// Crear registro con lookup
var nuevaTarea = new Entity("sit_tarea");
nuevaTarea["sit_titulo"] = "Revisar propuesta";
nuevaTarea["sit_solicitud"] = new EntityReference("sit_solicitud", solicitudId);
nuevaTarea["sit_asignado"] = new EntityReference("systemuser", userId);
nuevaTarea["sit_prioridad"] = new OptionSetValue(100000001); // Alta
nuevaTarea["sit_fechavencimiento"] = DateTime.UtcNow.AddDays(2);
var nuevaId = service.Create(nuevaTarea);

// Actualizar registro
var update = new Entity("sit_tarea", nuevaId);
update["sit_estado"] = new OptionSetValue(100000003); // Completada
service.Update(update);

// Eliminar
service.Delete("sit_tarea", nuevaId);

// Retrieve con ColumnSet
var registro = service.Retrieve("sit_solicitud", solicitudId,
    new ColumnSet("sit_nombre", "sit_estado", "sit_presupuesto", "_sit_cliente_value"));

// Retrieve Multiple con QueryExpression
var query = new QueryExpression("sit_solicitud")
{
    ColumnSet = new ColumnSet("sit_nombre", "sit_estado", "sit_total"),
    Criteria = new FilterExpression(LogicalOperator.And)
};
query.Criteria.AddCondition("sit_estado", ConditionOperator.Equal, 100000001);
query.Criteria.AddCondition("sit_presupuesto", ConditionOperator.GreaterThan, 5000m);
query.AddOrder("createdon", OrderType.Descending);
query.TopCount = 50;

// Join con LinkEntity
var linkCliente = query.AddLink("account", "_sit_cliente_value", "accountid");
linkCliente.Columns = new ColumnSet("name", "emailaddress1");
linkCliente.EntityAlias = "cliente";

var resultados = service.RetrieveMultiple(query);
foreach (var entidad in resultados.Entities)
{
    var nombre = entidad.GetAttributeValue<string>("sit_nombre");
    var nombreCliente = entidad.GetAttributeValue<AliasedValue>("cliente.name")?.Value as string;
}
```

### LINQ con OrganizationServiceContext (Early-Bound)
```csharp
// Requiere Early-Bound entities generadas con pac modelbuilder
using var context = new SITContext(service);

var solicitudes = (from s in context.sit_solicitudSet
                   where s.sit_estado == sit_solicitud_sit_estado.Aprobado
                   && s.sit_presupuesto > new Money(5000)
                   orderby s.CreatedOn descending
                   select new { s.sit_nombre, s.sit_numero, s.sit_presupuesto })
                  .Take(10)
                  .ToList();

foreach (var s in solicitudes)
{
    Console.WriteLine($"{s.sit_numero}: {s.sit_nombre} - ${s.sit_presupuesto?.Value}");
}
```

---

## DAX

**Usado en:** Power BI Desktop y Service, Analysis Services  
**Paradigma:** Funcional, basado en contextos de filtro y fila

### Medidas fundamentales
```dax
// Medida simple
Total Ventas = SUM(Ventas[Monto])

// Con formato
Total Ventas $ = FORMAT(SUM(Ventas[Monto]), "$#,##0.00")

// Conteo condicional
Órdenes Urgentes = COUNTROWS(FILTER(Órdenes, Órdenes[Prioridad] = "Urgente"))

// Promedio condicional
Ticket Promedio = AVERAGEX(Ventas, Ventas[Monto])

// División segura (nunca dividir por 0)
Margen % = DIVIDE([Ganancia Bruta], [Total Ventas], 0)
```

### CALCULATE — el corazón de DAX
```dax
// Modificar contexto de filtro
Ventas 2025 = CALCULATE([Total Ventas], 'Calendar'[Año] = 2025)

// Múltiples modificadores de filtro
Ventas Premium CO =
CALCULATE(
    [Total Ventas],
    Clientes[Segmento] = "Premium",
    Clientes[País] = "Colombia"
)

// Eliminar filtros con ALL
% del Total =
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], ALL(Productos)),
    0
)

// Preservar algunos filtros con ALLEXCEPT
% en Categoría =
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], ALLEXCEPT(Productos, Productos[Categoría])),
    0
)

// ALLSELECTED — respeta filtros del usuario pero ignora el visual actual
% del Seleccionado =
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], ALLSELECTED(Productos[SubCategoría])),
    0
)
```

### Inteligencia de tiempo
```dax
// Tabla de fechas — OBLIGATORIA para inteligencia de tiempo
Calendario =
ADDCOLUMNS(
    CALENDAR(DATE(2020,1,1), DATE(2030,12,31)),
    "Año",        YEAR([Date]),
    "Mes Num",    MONTH([Date]),
    "Mes Nombre", FORMAT([Date], "MMMM"),
    "Trimestre",  "Q" & QUARTER([Date]),
    "Semana",     WEEKNUM([Date]),
    "Día Semana", WEEKDAY([Date], 2),
    "Año-Mes",    FORMAT([Date], "YYYY-MM"),
    "Es Fin de Semana", IF(WEEKDAY([Date],2) >= 6, TRUE, FALSE)
)

// Año hasta la fecha
Ventas YTD = TOTALYTD([Total Ventas], 'Calendario'[Date])

// Mismo período año anterior
Ventas Año Anterior =
CALCULATE([Total Ventas], SAMEPERIODLASTYEAR('Calendario'[Date]))

// Crecimiento año vs año
YoY % =
VAR Actual = [Total Ventas]
VAR Anterior = [Ventas Año Anterior]
RETURN IF(ISBLANK(Anterior), BLANK(), DIVIDE(Actual - Anterior, Anterior, 0))

// Media móvil 3 meses
Media Móvil 3M =
CALCULATE(
    AVERAGEX(VALUES('Calendario'[Año-Mes]), [Total Ventas]),
    DATESINPERIOD('Calendario'[Date], LASTDATE('Calendario'[Date]), -3, MONTH)
)

// Acumulado del mes (MTD)
Ventas MTD = TOTALMTD([Total Ventas], 'Calendario'[Date])

// Ventas rolling 12 meses
Ventas R12M =
CALCULATE(
    [Total Ventas],
    DATESINPERIOD('Calendario'[Date], LASTDATE('Calendario'[Date]), -12, MONTH)
)

// Últimos N días (con parámetro dinámico)
Ventas Últimos N Días =
VAR N = SELECTEDVALUE(Parámetro[N], 30)
RETURN CALCULATE(
    [Total Ventas],
    DATESINPERIOD('Calendario'[Date], TODAY(), -N, DAY)
)
```

### Variables y contexto
```dax
// Variables mejoran legibilidad y performance
Análisis Rentabilidad =
VAR CostoTotal = SUM(Ventas[Costo])
VAR IngresoTotal = SUM(Ventas[Ingreso])
VAR GananciaB = IngresoTotal - CostoTotal
VAR MargenB = DIVIDE(GananciaB, IngresoTotal, 0)
RETURN
IF(
    MargenB >= 0.3,
    "✅ Rentable (" & FORMAT(MargenB, "0%") & ")",
    "⚠️ Bajo margen (" & FORMAT(MargenB, "0%") & ")"
)

// RANKX — ranking dinámico
Ranking Vendedor =
RANKX(ALL(Vendedores[Nombre]), [Total Ventas], , DESC, DENSE)

// TOPN — top N dinámico
Ventas Top 5 Clientes =
VAR Top5 = TOPN(5, ALL(Clientes[Nombre]), [Total Ventas], DESC)
RETURN CALCULATE([Total Ventas], Top5)
```

### Row Level Security (RLS)
```dax
// Tabla: Vendedores — columna: Email
// Cada vendedor ve solo sus propias ventas
[Email] = USERPRINCIPALNAME()

// Gerente ve su región
[RegionManagerEmail] = USERPRINCIPALNAME()

// Para roles con acceso total (ej: Director)
// No agregar filtro RLS → ven todo
```

---

## Power Query M

**Usado en:** Power BI Desktop (transformación de datos), Dataflows (Power Platform)  
**Paradigma:** Funcional, lazy evaluation, inmutable

### Estructura básica
```m
let
    // Cada paso transforma el resultado del anterior
    Origen = Sql.Database("servidor.database.windows.net", "MiBase"),
    Tabla = Origen{[Schema="dbo", Item="Ventas"]}[Data],
    
    // Filtros — se empujan al servidor (query folding)
    FiltroFecha = Table.SelectRows(Tabla, each [FechaVenta] >= #date(2024, 1, 1)),
    
    // Selección de columnas
    ColumnasElegidas = Table.SelectColumns(FiltroFecha, {"ID", "Monto", "FechaVenta", "ClienteID"}),
    
    // Agregar columna calculada
    ConMes = Table.AddColumn(ColumnasElegidas, "Mes", each Date.Month([FechaVenta]), Int64.Type),
    
    // Renombrar columnas
    Renombrado = Table.RenameColumns(ConMes, {
        {"ClienteID", "ID_Cliente"},
        {"FechaVenta", "Fecha"}
    }),
    
    // Cambiar tipos de datos (SIEMPRE al final)
    TiposCorrectos = Table.TransformColumnTypes(Renombrado, {
        {"ID", Int64.Type},
        {"Monto", Currency.Type},
        {"Fecha", Date.Type}
    })
in
    TiposCorrectos
```

### Transformaciones frecuentes
```m
// Unpivot (columnas → filas) para datos en formato tabla cruzada
let
    Datos = Excel.Workbook(File.Contents("ventas.xlsx")){[Name="Hoja1"]}[Data],
    Encabezados = Table.PromoteHeaders(Datos),
    Unpivoted = Table.UnpivotOtherColumns(Encabezados, {"Producto"}, "Mes", "Ventas")
in
    Unpivoted

// Merge (JOIN) de dos tablas
let
    Ventas = ...,
    Clientes = ...,
    Joined = Table.NestedJoin(
        Ventas, "ClienteID",
        Clientes, "ID",
        "ClienteData",
        JoinKind.LeftOuter
    ),
    Expanded = Table.ExpandTableColumn(Joined, "ClienteData", {"Nombre", "País"})
in
    Expanded

// Group By (agregar)
let
    Ventas = ...,
    Agrupado = Table.Group(Ventas, {"ClienteID", "Mes"}, {
        {"TotalVentas", each List.Sum([Monto]), Currency.Type},
        {"NumOrdenes", each Table.RowCount(_), Int64.Type}
    })
in
    Agrupado

// Parámetro de fecha dinámica (carga solo últimos N días)
let
    FechaInicio = Date.AddDays(Date.From(DateTime.LocalNow()), -30),
    Origen = Sql.Database("servidor", "base"),
    Filtrado = Table.SelectRows(
        Origen{[Schema="dbo",Item="Ventas"]}[Data],
        each [Fecha] >= FechaInicio
    )
in
    Filtrado
```

---

## T-SQL / FetchXML

### FetchXML — consultas a Dataverse
```xml
<!-- FetchXML básico con join y filtro -->
<fetch top="100" distinct="false">
  <entity name="sit_solicitud">
    <attribute name="sit_solicitudid"/>
    <attribute name="sit_nombre"/>
    <attribute name="sit_estado"/>
    <attribute name="sit_presupuesto"/>
    <attribute name="createdon"/>
    
    <!-- Join con tabla de cliente (account) -->
    <link-entity name="account" from="accountid" to="_sit_cliente_value"
                 link-type="outer" alias="cliente">
      <attribute name="name"/>
      <attribute name="emailaddress1"/>
      <attribute name="address1_country"/>
    </link-entity>
    
    <!-- Filtros -->
    <filter type="and">
      <condition attribute="sit_estado" operator="eq" value="100000001"/>
      <condition attribute="createdon" operator="last-x-days" value="30"/>
      <condition attribute="sit_presupuesto" operator="gt" value="5000"/>
    </filter>
    
    <!-- Orden -->
    <order attribute="createdon" descending="true"/>
  </entity>
</fetch>

<!-- FetchXML con agregación -->
<fetch aggregate="true">
  <entity name="sit_solicitud">
    <attribute name="sit_estado" groupby="true" alias="estado"/>
    <attribute name="sit_solicitudid" aggregate="count" alias="total"/>
    <attribute name="sit_presupuesto" aggregate="sum" alias="presupuesto_total"/>
    <attribute name="sit_presupuesto" aggregate="avg" alias="presupuesto_promedio"/>
    <filter>
      <condition attribute="createdon" operator="this-year"/>
    </filter>
  </entity>
</fetch>
```

### Usar FetchXML en Power Automate
```
Acción: List rows (Dataverse)
Fetch XML Query:
<fetch top="50">
  <entity name="sit_solicitud">
    <attribute name="sit_nombre"/>
    <filter>
      <condition attribute="sit_estado" operator="eq" value="1"/>
    </filter>
  </entity>
</fetch>
```

### T-SQL para Dataverse (via TDS endpoint)
```sql
-- Dataverse expone un endpoint TDS compatible con SQL Server
-- Conectar: servidor = tuorg.crm.dynamics.com,5558

SELECT TOP 50
    s.sit_nombre,
    s.sit_estadoname AS estado,
    s.sit_presupuesto,
    s.createdon,
    a.name AS nombre_cliente,
    a.address1_country AS pais
FROM sit_solicitud s
LEFT JOIN account a ON s._sit_cliente_value = a.accountid
WHERE s.statecode = 0  -- Solo activos
    AND s.createdon >= DATEADD(day, -30, GETDATE())
ORDER BY s.createdon DESC

-- Nota: No todos los operadores SQL funcionan en Dataverse TDS
-- Recomendado solo para reportes de Power BI, no para aplicaciones
```

---

## Liquid

**Usado en:** Power Pages (portales web externos)  
**Paradigma:** Template engine server-side

```liquid
{% comment %} Comentario en Liquid {% endcomment %}

{% comment %} Variables y asignación {% endcomment %}
{% assign nombre = user.fullname %}
{% assign total = 0 %}

{% comment %} Condicional {% endcomment %}
{% if user %}
  <p>Bienvenido, {{ user.fullname }}</p>
{% elsif condicion %}
  <p>Otro caso</p>
{% else %}
  <p>No estás autenticado. <a href="/SignIn">Iniciar sesión</a></p>
{% endif %}

{% comment %} Bucle {% endcomment %}
{% for caso in mis_casos %}
  <div class="caso-item">
    <strong>{{ caso.ticketnumber }}</strong>
    <span>{{ caso.title }}</span>
    <span class="badge {{ caso.statuscode | downcase }}">
      {{ caso.statuscode.label }}
    </span>
  </div>
{% else %}
  <p>No tienes casos registrados.</p>
{% endfor %}

{% comment %} Consultar datos de Dataverse desde Liquid {% endcomment %}
{% assign contacto = entities.contact[user.contact.id] %}
{% assign mis_solicitudes = entities.sit_solicitud | 
    where: '_sit_cliente_value', contacto.accountid |
    order_by: 'createdon', 'desc' |
    limit: 10 %}

{% for solicitud in mis_solicitudes %}
  <tr>
    <td>{{ solicitud.sit_numero }}</td>
    <td>{{ solicitud.sit_nombre }}</td>
    <td>{{ solicitud.sit_estado | option_set_label }}</td>
    <td>{{ solicitud.createdon | date: "%d/%m/%Y" }}</td>
  </tr>
{% endfor %}

{% comment %} Filtros de Liquid útiles {% endcomment %}
{{ "hola mundo" | upcase }}           <!-- HOLA MUNDO -->
{{ "HOLA" | downcase }}               <!-- hola -->
{{ nombre | truncate: 20 }}           <!-- Trunca a 20 chars -->
{{ fecha | date: "%d/%m/%Y %H:%M" }} <!-- Formato de fecha -->
{{ monto | currency }}               <!-- Formato moneda del portal -->
{{ texto | strip_html }}             <!-- Elimina tags HTML -->
{{ "Mi Título" | slugify }}          <!-- mi-titulo -->

{% comment %} Include de partial templates {% endcomment %}
{% include 'Header Portal' %}
{% include 'Footer' %}

{% comment %} Web API desde JavaScript (no Liquid) {% endcomment %}
{% comment %}
En páginas de Power Pages, el Web API se llama desde JS:
fetch('/api/data/v9.1/sit_solicituds', {
  headers: {
    '__RequestVerificationToken': document.querySelector('[name=__RequestVerificationToken]').value
  }
})
{% endcomment %}
```

---

## YAML

**Usado en:** Pipelines CI/CD en Azure DevOps y GitHub Actions

### Azure DevOps Pipeline completo
```yaml
# azure-pipelines/build-deploy.yml
trigger:
  branches:
    include: [develop, main]
  paths:
    exclude: ['*.md', 'docs/**']

variables:
  solution_name: 'SIT_GestionProyectos'
  service_connection_dev: 'SC-PowerPlatform-DEV'
  service_connection_test: 'SC-PowerPlatform-TEST'
  service_connection_prod: 'SC-PowerPlatform-PROD'

stages:
  - stage: Build
    displayName: '🔨 Build & Verify'
    jobs:
      - job: BuildSolution
        pool:
          vmImage: 'windows-latest'
        steps:
          - checkout: self
            fetchDepth: 0

          - task: PowerPlatformToolInstaller@2
            displayName: 'Install PAC CLI'
            inputs:
              DefaultVersion: true

          - task: PowerPlatformExportSolution@2
            displayName: 'Export from DEV (Unmanaged)'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: '$(service_connection_dev)'
              SolutionName: '$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              Managed: false
              AsyncOperation: true
              MaxAsyncWaitTime: 120

          - task: PowerPlatformChecker@2
            displayName: '✅ Solution Checker'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: '$(service_connection_dev)'
              FilesToAnalyze: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              RuleSet: '0ad12346-e108-40b8-a956-9a373e9d6492'
              FailOnPowerAppsCheckerAnalysisError: true

          - task: PowerPlatformPackSolution@2
            displayName: 'Pack as Managed'
            inputs:
              SolutionSourceFolder: '$(Build.SourcesDirectory)/solutions/$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name)_managed.zip'
              SolutionType: Managed

          - task: PublishBuildArtifacts@1
            displayName: '📦 Publish Artifact'
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: 'drop'

  - stage: DeployTest
    displayName: '🧪 Deploy TEST'
    dependsOn: Build
    condition: succeeded()
    jobs:
      - deployment: Test
        environment: 'PowerPlatform-TEST'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs: { DefaultVersion: true }
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: '$(service_connection_test)'
                    SolutionInputFile: '$(Pipeline.Workspace)/drop/$(solution_name)_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: 180

  - stage: DeployProd
    displayName: '🚀 Deploy PROD'
    dependsOn: DeployTest
    condition: succeeded()
    jobs:
      - deployment: Prod
        environment: 'PowerPlatform-PROD' # Requiere aprobación manual
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs: { DefaultVersion: true }
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: '$(service_connection_prod)'
                    SolutionInputFile: '$(Pipeline.Workspace)/drop/$(solution_name)_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: 240
```

### GitHub Actions para Power Platform
```yaml
# .github/workflows/power-platform.yml
name: Power Platform CI/CD

on:
  push:
    branches: [develop]
  workflow_dispatch: # Permite disparar manualmente

env:
  SOLUTION_NAME: SIT_GestionProyectos

jobs:
  build:
    name: Build & Check
    runs-on: windows-latest
    outputs:
      artifact-path: ${{ steps.set-output.outputs.path }}

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Export Solution
        uses: microsoft/powerplatform-actions/export-solution@v1
        with:
          environment-url: ${{ secrets.DEV_URL }}
          app-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-name: ${{ env.SOLUTION_NAME }}
          solution-output-file: ./solutions/${{ env.SOLUTION_NAME }}.zip

      - name: Solution Checker
        uses: microsoft/powerplatform-actions/check-solution@v1
        with:
          environment-url: ${{ secrets.DEV_URL }}
          app-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          path: ./solutions/${{ env.SOLUTION_NAME }}.zip
          checker-logs-artifact-name: checker-logs

      - name: Pack Managed
        uses: microsoft/powerplatform-actions/pack-solution@v1
        with:
          solution-folder: ./solutions/${{ env.SOLUTION_NAME }}
          solution-file: ./solutions/${{ env.SOLUTION_NAME }}_managed.zip
          solution-type: Managed

      - uses: actions/upload-artifact@v4
        with:
          name: solution-drop
          path: ./solutions/${{ env.SOLUTION_NAME }}_managed.zip

  deploy-test:
    name: Deploy TEST
    needs: build
    runs-on: windows-latest
    environment: TEST # Configura approvals en GitHub Environments

    steps:
      - uses: actions/download-artifact@v4
        with: { name: solution-drop, path: ./artifacts }

      - name: Import to TEST
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ secrets.TEST_URL }}
          app-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-file: ./artifacts/${{ env.SOLUTION_NAME }}_managed.zip
          run-asynchronously: true

  deploy-prod:
    name: Deploy PROD
    needs: deploy-test
    runs-on: windows-latest
    environment: PROD # Requiere aprobación manual configurada en GitHub

    steps:
      - uses: actions/download-artifact@v4
        with: { name: solution-drop, path: ./artifacts }

      - name: Import to PROD
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ secrets.PROD_URL }}
          app-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-file: ./artifacts/${{ env.SOLUTION_NAME }}_managed.zip
          run-asynchronously: true
```

---

## JSON

**Usado en:** Specs OpenAPI, configuraciones de conectores, payloads de APIs, Adaptive Cards

### OpenAPI Spec para Custom Connector
```json
{
  "swagger": "2.0",
  "info": {
    "title": "API Solicitudes SIT",
    "description": "API para gestión de solicitudes desde sistemas externos",
    "version": "1.0"
  },
  "host": "api.sitconsulting.com",
  "basePath": "/v1",
  "schemes": ["https"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "securityDefinitions": {
    "apiKeyHeader": {
      "type": "apiKey",
      "name": "X-API-Key",
      "in": "header"
    }
  },
  "security": [{ "apiKeyHeader": [] }],
  "paths": {
    "/solicitudes": {
      "post": {
        "operationId": "CrearSolicitud",
        "summary": "Crear nueva solicitud",
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "required": true,
            "schema": { "$ref": "#/definitions/SolicitudRequest" }
          }
        ],
        "responses": {
          "200": {
            "description": "Solicitud creada",
            "schema": { "$ref": "#/definitions/SolicitudResponse" }
          },
          "400": { "description": "Datos inválidos" },
          "401": { "description": "No autorizado" }
        }
      },
      "get": {
        "operationId": "ListarSolicitudes",
        "summary": "Listar solicitudes",
        "parameters": [
          {
            "name": "estado",
            "in": "query",
            "type": "string",
            "enum": ["Pendiente", "Aprobado", "Rechazado"],
            "description": "Filtrar por estado"
          },
          {
            "name": "top",
            "in": "query",
            "type": "integer",
            "default": 50
          }
        ],
        "responses": {
          "200": {
            "schema": {
              "type": "array",
              "items": { "$ref": "#/definitions/SolicitudResponse" }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "SolicitudRequest": {
      "type": "object",
      "required": ["nombre", "descripcion"],
      "properties": {
        "nombre": { "type": "string", "maxLength": 100 },
        "descripcion": { "type": "string" },
        "prioridad": {
          "type": "string",
          "enum": ["Normal", "Alta", "Urgente"],
          "default": "Normal"
        },
        "presupuesto": { "type": "number", "format": "float" }
      }
    },
    "SolicitudResponse": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "numero": { "type": "string", "example": "SOL-00123" },
        "estado": { "type": "string" },
        "fechaCreacion": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

### Adaptive Card para Copilot Studio / Teams
```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "Container",
      "style": "emphasis",
      "items": [
        {
          "type": "TextBlock",
          "text": "📋 Solicitud ${numero}",
          "weight": "Bolder",
          "size": "Medium",
          "color": "Accent"
        }
      ]
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "Nombre:", "value": "${nombre}" },
        { "title": "Estado:", "value": "${estado}" },
        { "title": "Prioridad:", "value": "${prioridad}" },
        { "title": "Creada:", "value": "${fecha}" },
        { "title": "Asignada a:", "value": "${asignado}" }
      ]
    },
    {
      "type": "TextBlock",
      "text": "**Descripción:** ${descripcion}",
      "wrap": true,
      "separator": true
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "✅ Aprobar",
      "style": "positive",
      "data": { "accion": "aprobar", "id": "${id}" }
    },
    {
      "type": "Action.Submit",
      "title": "❌ Rechazar",
      "style": "destructive",
      "data": { "accion": "rechazar", "id": "${id}" }
    },
    {
      "type": "Action.OpenUrl",
      "title": "🔗 Ver en sistema",
      "url": "https://tuorg.crm.dynamics.com/main.aspx?id=${id}"
    }
  ]
}
```

---

## Resumen — Cuándo usar cada lenguaje

| Lenguaje | Cuándo usarlo | NO usarlo para |
|----------|--------------|----------------|
| **Power Fx** | Lógica en Canvas Apps, Named Formulas, expresiones de Model-Driven | Lógica de servidor compleja |
| **JavaScript** | Formularios Model-Driven (eventos, validaciones UI) | Lógica crítica de negocio (usar plugin C#) |
| **TypeScript/PCF** | Controles personalizados reutilizables | Lógica de flujo simple (usar Power Automate) |
| **C#** | Plugins de Dataverse, lógica de servidor obligatoria, unit tests | UI, llamadas a datos simples desde formulario |
| **DAX** | Medidas y cálculos en Power BI | ETL y transformación de datos (usar M) |
| **Power Query M** | Transformar datos al cargar en Power BI o Dataflows | Cálculos de medidas en tiempo de ejecución |
| **FetchXML** | Consultas complejas en Power Automate, reportes, exportación | Consultas simples (usar OData $filter) |
| **Liquid** | Templates de páginas en Power Pages | Lógica de negocio compleja (usar plugin) |
| **YAML** | Pipelines CI/CD en Azure DevOps y GitHub Actions | Configuraciones de Power Platform |
| **JSON** | Specs OpenAPI, Adaptive Cards, payloads de APIs | Documentación de arquitectura |

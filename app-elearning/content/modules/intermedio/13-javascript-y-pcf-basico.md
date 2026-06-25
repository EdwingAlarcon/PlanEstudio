---
moduleId: 13
title: "JavaScript y PCF Básico"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 10
slug: "javascript-y-pcf-basico"
---
!!! tip "Prerequisito de Lenguaje"
    Este módulo requiere conocimientos básicos de **JavaScript**: funciones, callbacks, promesas, módulos ES6 y manipulación del DOM. Si es tu primer contacto con JavaScript, consulta el [Anexo de Lenguajes de Programación](../Anexos/LENGUAJES_PROGRAMACION.md) — sección JavaScript — antes de continuar.

### 🎯 Objetivo
Implementar lógica de cliente con JavaScript en formularios Model-Driven y crear tu primer Power Apps Component Framework (PCF) control con TypeScript que extiende las capacidades nativas de Dataverse.

### 📖 Conceptos Clave
- **Web Resources JavaScript:** archivos JavaScript (.js) subidos a Dataverse como recursos web y registrados en eventos de formularios Model-Driven (OnLoad, OnSave, OnChange de campo). Se ejecutan en el navegador del cliente cuando el usuario interactúa con el formulario. Son el mecanismo principal para agregar comportamiento dinámico en formularios: mostrar/ocultar secciones, validaciones complejas, notificaciones, y llamadas a la Web API de Dataverse. Se nombran con ruta jerárquica: `sit_/js/NombreHandler.js`.

- **Xrm.Page (legacy) vs formContext:** `Xrm.Page` es la API antigua (deprecated desde 2019) para acceder al formulario desde JavaScript. `formContext` es la API moderna y obligatoria que se obtiene desde el parámetro `executionContext.getFormContext()`. Diferencias clave: formContext es el contexto del formulario específico (soporta múltiples formularios abiertos), Xrm.Page era global y causaba problemas en el unificado (UCI). Nunca usar `Xrm.Page` en código nuevo — Microsoft puede eliminarlo sin aviso.

- **Execution Context:** objeto que se pasa automáticamente a los event handlers de formulario cuando se marca "Pasar contexto de ejecución como primer parámetro" al registrar el handler. Provee acceso a `formContext` (el formulario), `getEventSource()` (el control que disparó el evento) y `getEventArgs()` (para eventos cancelables como OnSave). Sin este objeto no se puede acceder al formulario de forma moderna. La ausencia de este parámetro es la causa más común de `formContext is null`.

- **PCF (Power Apps Component Framework):** framework oficial de Microsoft para crear controles personalizados en formularios Model-Driven Apps y Canvas Apps usando TypeScript (y opcionalmente React). Un control PCF reemplaza o extiende la visualización de un campo (Field PCF) o una subgrid (Dataset PCF). Los controles se empaquetan como soluciones y se despliegan en Dataverse. La herramienta `pac` (Power Platform CLI) es el punto de entrada para inicializar, probar localmente (harness), y desplegar los controles.

- **IInputs / IOutputs:** interfaces TypeScript generadas automáticamente por el toolchain de PCF a partir del `ControlManifest.Input.xml`. `IInputs` define las propiedades que el formulario entrega al control (valores de campos, metadata). `IOutputs` define los valores que el control puede escribir de vuelta al formulario (para controles de campo editable). El método `updateView(context: Context<IInputs>)` recibe el contexto con los valores actuales. El método `getOutputs(): IOutputs` retorna los valores que el control quiere escribir.

- **ComponentFramework.WebApi:** API disponible dentro de un PCF para interactuar con Dataverse (leer, crear, actualizar, eliminar registros) sin depender de Xrm. Se accede via `context.webAPI` en el método `updateView` o `init`. Soporta `retrieveRecord`, `retrieveMultipleRecords`, `createRecord`, `updateRecord`, `deleteRecord`. Ejecuta llamadas asíncronas con promesas. El control no necesita gestionar autenticación — la hereda del contexto de la plataforma.

- **pac pcf init / pac pcf push:** comandos del Power Platform CLI para trabajar con PCF. `pac pcf init --namespace X --name Y --template field --framework react` crea la estructura del proyecto. `npm start` levanta el test harness local para probar el control en el navegador sin desplegarlo. `npm run build` compila TypeScript a JavaScript optimizado. `pac pcf push --publisher-prefix sit` empaqueta el control en una solución temporal y la importa directamente al entorno de desarrollo. Para producción, usar `pac solution build` + importar manualmente.

- **Virtual vs Standard PCF:** dos modos de renderizado para controles PCF. `Standard` renderiza su propio árbol DOM de forma independiente (control total sobre el HTML/CSS). `Virtual` (recomendado cuando se usa React) comparte el runtime de React que ya tiene la plataforma, reduciendo el tamaño del bundle. Con `--framework react` y `control-type="virtual"` en el manifest, el control retorna un `React.ReactElement` desde `updateView()` en lugar de manipular el DOM directamente. Elegir Virtual siempre que sea posible para mejor rendimiento.

- **Field vs Dataset PCF:** dos tipos de controles según lo que reemplazan. `Field` (template: field) reemplaza la visualización de una sola columna/campo en el formulario o vista. Recibe el valor del campo como input y puede modificarlo como output. `Dataset` (template: dataset) reemplaza una subgrid o galería, recibiendo colecciones de registros con sus columnas. Dataset PCF es más complejo pero permite crear visualizaciones completamente personalizadas de listas (ej. calendar view, kanban view, timeline).

- **Manifest.xml (`ControlManifest.Input.xml`):** archivo XML que es el "contrato" del control PCF — describe su identidad (namespace, name, versión), las propiedades de entrada/salida (`<property>`), los recursos incluidos (`<resources>`), y si usa servicios externos. La herramienta de build genera las interfaces TypeScript `IInputs`/`IOutputs` automáticamente a partir de este archivo. Cada `<property>` tiene un `of-type` (SingleLine.Text, OptionSet, Whole.Number, etc.) y un `usage` (bound para lectura/escritura, input para solo lectura).

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 13.1: JavaScript en formulario Model-Driven

1. Crear archivo `SolicitudFormHandler.js`:
```javascript
// Namespace pattern para evitar conflictos globales
var SolicitudFormHandler = SolicitudFormHandler || {};

// Handler: se llama al cargar el formulario
SolicitudFormHandler.onLoad = function(executionContext) {
    var formContext = executionContext.getFormContext();
    
    // Configurar visibilidad inicial
    SolicitudFormHandler._configurarVisibilidad(formContext);
    
    // Registrar handler en cambio de estado
    formContext.getAttribute("sit_estado").addOnChange(function(ctx) {
        SolicitudFormHandler._configurarVisibilidad(ctx.getFormContext());
    });
};

// Handler: validación antes de guardar
SolicitudFormHandler.onSave = function(executionContext) {
    var formContext = executionContext.getFormContext();
    var estado = formContext.getAttribute("sit_estado").getValue();
    var presupuesto = formContext.getAttribute("sit_presupuesto").getValue();
    
    if (estado === 100000001 && (presupuesto === null || presupuesto <= 0)) {
        // Cancelar el guardado y mostrar error
        executionContext.getEventArgs().preventDefault();
        formContext.ui.setFormNotification(
            "Se requiere presupuesto mayor a 0 para aprobar la solicitud",
            "ERROR",
            "validacion_presupuesto"
        );
        return;
    }
    
    // Limpiar notificaciones si todo es válido
    formContext.ui.clearFormNotification("validacion_presupuesto");
};

// Función privada de visibilidad (convención: _ prefijo)
SolicitudFormHandler._configurarVisibilidad = function(formContext) {
    var estado = formContext.getAttribute("sit_estado").getValue();
    var esAprobado = estado === 100000001; // valor del option: Aprobado
    
    // Mostrar sección de implementación solo si está aprobado
    formContext.ui.tabs.get("tab_implementacion").setVisible(esAprobado);
    
    // Campo responsable requerido si está aprobado
    formContext.getAttribute("sit_responsable").setRequiredLevel(
        esAprobado ? "required" : "none"
    );
};
```

2. Subir Web Resource:
    - make.powerapps.com → Solución → Nuevo → Web Resource
    - Tipo: Script (JScript)
    - Nombre: `sit_/js/SolicitudFormHandler.js`
    - Subir el archivo JS
   
3. Registrar en formulario:
    - Formulario de Solicitud → Propiedades → Eventos
    - OnLoad → Agregar librería → seleccionar el Web Resource
    - Función: `SolicitudFormHandler.onLoad`
    - Pasar contexto de ejecución: ✅
    - OnSave → Misma librería → Función: `SolicitudFormHandler.onSave`

#### Actividad 13.2: Leer datos relacionados con WebApi desde JS
```javascript
SolicitudFormHandler.cargarHistorialCliente = function(executionContext) {
    var formContext = executionContext.getFormContext();
    var clienteRef = formContext.getAttribute("sit_cliente").getValue();
    
    if (!clienteRef || clienteRef.length === 0) return;
    
    var clienteId = clienteRef[0].id.replace(/[{}]/g, "");
    
    // Llamar Dataverse Web API desde JavaScript del formulario
    Xrm.WebApi.retrieveMultipleRecords(
        "sit_solicitud",
        "?$filter=_sit_cliente_value eq " + clienteId + 
        "&$select=sit_nombre,sit_estado,createdon" +
        "&$orderby=createdon desc&$top=5"
    ).then(function(result) {
        var historial = result.entities;
        var mensaje = "Últimas solicitudes del cliente: ";
        
        historial.forEach(function(s) {
            mensaje += "\n- " + s.sit_nombre + " (" + s["sit_estado@OData.Community.Display.V1.FormattedValue"] + ")";
        });
        
        formContext.ui.setFormNotification(mensaje, "INFO", "historial_cliente");
        
    }, function(error) {
        console.error("Error cargando historial:", error.message);
    });
};
```

#### Actividad 13.3: Crear primer PCF con TypeScript

1. Instalar herramientas:
   ```bash
   npm install -g @microsoft/powerplatform-cli
   # Verificar
   pac --version
   ```

2. Crear proyecto PCF:
   ```bash
   mkdir StatusBadgePCF && cd StatusBadgePCF
   pac pcf init --namespace SITControls --name StatusBadge --template field --framework react
   npm install
   ```

3. Editar `StatusBadge/index.tsx` (componente React que renderiza el control):
   ```typescript
   import * as React from 'react';
   import { IInputs, IOutputs } from "./generated/ManifestTypes";

   interface StatusBadgeProps {
       statusValue: number;
       statusLabel: string;
   }

   const StatusBadgeComponent: React.FC<StatusBadgeProps> = ({ statusValue, statusLabel }) => {
       const getColor = (value: number): string => {
           switch(value) {
               case 1: return "#107C10"; // Verde - Activo
               case 2: return "#D83B01"; // Rojo - Inactivo
               case 3: return "#FFB900"; // Amarillo - Pendiente
               default: return "#605E5C"; // Gris - Desconocido
           }
       };

       const styles: React.CSSProperties = {
           backgroundColor: getColor(statusValue),
           color: "white",
           padding: "4px 12px",
           borderRadius: "12px",
           fontSize: "12px",
           fontWeight: 600,
           display: "inline-block",
           fontFamily: "Segoe UI, sans-serif"
       };

       return <span style={styles}>{statusLabel || "Sin estado"}</span>;
   };

   export class StatusBadge implements ComponentFramework.ReactControl<IInputs, IOutputs> {
       private notifyOutputChanged: () => void;

       public init(
           context: ComponentFramework.Context<IInputs>,
           notifyOutputChanged: () => void
       ): void {
           this.notifyOutputChanged = notifyOutputChanged;
       }

       public updateView(
           context: ComponentFramework.Context<IInputs>
       ): React.ReactElement {
           const statusValue = context.parameters.statusValue.raw ?? 0;
           const statusLabel = context.parameters.statusValue.formatted ?? "";

           return React.createElement(StatusBadgeComponent, {
               statusValue: statusValue,
               statusLabel: statusLabel
           });
       }

       public getOutputs(): IOutputs {
           return {};
       }

       public destroy(): void { }
   }
   ```

4. Editar `ControlManifest.Input.xml`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <manifest>
     <control namespace="SITControls" constructor="StatusBadge" 
              version="1.0.0" display-name-key="StatusBadge"
              description-key="Status Badge Control" control-type="virtual">
       <external-service-usage enabled="false" />
       <property name="statusValue" display-name-key="Status"
                 description-key="Status option set value"
                 of-type="OptionSet" usage="bound" required="true" />
       <resources>
         <code path="index.ts" order="1" />
       </resources>
     </control>
   </manifest>
   ```

5. Compilar y hacer push al entorno:
   ```bash
   npm run build
   pac auth create --url https://tuorg.crm.dynamics.com
   pac pcf push --publisher-prefix sit
   ```

6. Agregar el control al formulario:
    - Formulario → campo `sit_estado` → Componentes → Agregar componente → `StatusBadge`
    - Configurar propiedad: statusValue → Campo: sit_estado

### 💼 Caso Real de Negocio
**Empresa:** Aseguradora con formularios complejos de siniestros  
**Problema:** Los ajustadores validaban datos manualmente y cometían errores al aprobar siniestros sin documentación completa.  
**Solución:** JS OnSave verifica que todos los documentos requeridos estén adjuntos antes de permitir cambio de estado. PCF StatusBadge muestra visualmente el estado del siniestro con colores semáforo. Reducción de errores de proceso en 60%.  
**Resultado:** Tiempo de auditoría de calidad reducido de 2 días a 4 horas por semana.

### ✅ Buenas Prácticas
- Siempre usar `executionContext.getFormContext()`, nunca `Xrm.Page` (deprecated)
- Namespace pattern en JS para evitar colisiones con otros scripts del formulario
- PCF Virtual (React) es preferible a Standard — comparte el runtime de React del sistema
- Compilar PCF en modo `Release` para producción: `npm run build -- --buildMode production`
- Manejar errores en `Xrm.WebApi` con `.then(success, error)` — nunca dejar promises sin manejar
- PCF con muchas dependencias npm impacta el tiempo de carga — evaluar el bundle size

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| `formContext is null` | Handler registrado sin pasar execution context | Marcar "Pasar contexto de ejecución como primer parámetro" en el formulario |
| PCF no aparece en lista de componentes | Publisher prefix no coincide con el del entorno | Usar `pac pcf push --publisher-prefix` con el prefix correcto del publisher |
| `pac pcf push` falla con 401 | No hay perfil de autenticación activo | Ejecutar `pac auth create --url https://tuorg.crm.dynamics.com` |
| JS funciona en DEV pero no en PROD | Script cacheado | Forzar versión en URL del Web Resource o usar `?v=2` |

### 🧪 Criterios de Validación
- [ ] JavaScript muestra/oculta la pestaña de implementación según estado
- [ ] OnSave previene guardar y muestra notificación si falta presupuesto en estado Aprobado
- [ ] WebApi carga las últimas 5 solicitudes del cliente seleccionado
- [ ] PCF StatusBadge compila sin errores con `npm run build`
- [ ] PCF desplegado en el entorno y visible en el formulario Model-Driven
- [ ] Badge muestra colores correctos para cada estado de la opción

---

---
moduleId: 27
title: "PCF Avanzado con TypeScript y React"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 8
slug: "pcf-avanzado-con-typescript-y-react"
---
!!! tip "Prerequisito de Lenguaje"
    Este módulo requiere conocimientos sólidos de **TypeScript**: tipos, interfaces, genéricos, clases, módulos ES6, async/await y JSX/TSX básico. Consulta el [Anexo de Lenguajes de Programación](../Anexos/LENGUAJES_PROGRAMACION.md) — sección TypeScript — antes de continuar.

### 🎯 Objetivo
Desarrollar controles PCF avanzados: Dataset controls que reemplazan subgrids, controles con Web API para operaciones CRUD, uso de Fluent UI para consistencia visual, y publicación de PCF en soluciones managed.

### 📖 Conceptos Clave
- **Dataset PCF:** tipo de control PCF que recibe como propiedad de entrada una colección de registros de Dataverse (un Dataset), en lugar de un único valor. Se usa para reemplazar subgrids nativas con tablas totalmente personalizadas: preview inline, columnas calculadas, botones de acción por fila, colores condicionales, y drag-and-drop. Se declara en el manifest con `<data-set name="nombreDataset">` y en tiempo de ejecución el host gestiona automáticamente la carga de páginas y columnas configuradas.
- **`context.webAPI`:** objeto disponible en el contexto del PCF que expone la WebAPI de Dataverse para operaciones CRUD directamente desde el componente. Métodos: `context.webAPI.createRecord(entityName, data)`, `retrieveRecord(entityName, id, options)`, `updateRecord(entityName, id, data)`, `deleteRecord(entityName, id)`. A diferencia de una Canvas App, estas llamadas se autentican automáticamente con la sesión del usuario — no se requiere gestión de tokens.
- **`context.navigation`:** objeto del contexto que permite navegar desde el PCF a registros de Dataverse o URLs externas. `context.navigation.openForm({ entityName, entityId })` abre el formulario del registro en el panel lateral o en una nueva ventana. `context.navigation.openUrl(url)` abre una URL externa. Esencial para que los enlaces en una tabla PCF funcionen igual que los links nativos de D365.
- **`context.utils`:** objeto con utilidades de la plataforma disponibles en el PCF: `context.utils.openConfirmDialog(title, options)` muestra un diálogo de confirmación nativo, `context.utils.openErrorDialog(options)` muestra errores con el estilo de D365, `context.utils.openLookupDialog(options)` abre el selector de registros nativo para campos lookup. Usar estas utilidades en lugar de alerts y dialogs HTML propios mantiene la coherencia visual.
- **Fluent UI React:** librería de componentes de interfaz de Microsoft (`@fluentui/react` o la nueva `@fluentui/react-components`) que implementa el sistema de diseño de Microsoft 365 y Dynamics 365. Componentes clave para PCF: `DetailsList` (tabla con sorting y selección), `CommandBar` (barra de acciones), `Dialog` (diálogos modales), `Spinner` (indicador de carga), `TooltipHost` (tooltips), `Stack` (layout flex). Usar Fluent UI garantiza que el PCF se vea idéntico al resto de D365.
- **Virtual PCF (React):** tipo de PCF que usa el React ya cargado en el host (Model-Driven App, Canvas App) en lugar de empaquetar su propio React dentro del bundle. Se declara con `control-type="virtual"` en el manifest y la clase exporta `ComponentFramework.ReactControl` en lugar de `ComponentFramework.StandardControl`. El bundle resultante es 70-80% más pequeño porque no incluye React (≈40KB comprimido). Recomendado siempre que el control sea para D365/Canvas Apps modernas.
- **Custom hook `useDataverse`:** patrón de React para encapsular las llamadas a `context.webAPI` en un hook reutilizable que maneja el estado de carga, los errores, y la invalidación del caché. Ejemplo: `const { records, loading, error, refresh } = useDataverseQuery(context.webAPI, 'sit_tarea', filter)`. Separa la lógica de datos del componente de UI y facilita el testing unitario de la lógica de acceso a datos.
- **Control Manifest (ControlManifest.Input.xml):** archivo XML que define el contrato del PCF: namespace, nombre, versión, descripción, propiedades de entrada (`<property>`), propiedades de dataset (`<data-set>`), recursos JS/CSS, y los feature-usage requeridos (webAPI, navigation, etc.). Las propiedades declaradas en el manifest se mapean a los parámetros en Power Apps Studio — el desarrollador de la app ve exactamente qué propiedades configurar en el formulario.
- **`pac pcf version`:** comando del pac CLI que actualiza la versión en el ControlManifest.Input.xml. Es necesario incrementar la versión antes de publicar cambios para que Dataverse detecte que el control fue actualizado y lo distribuya a los usuarios — de lo contrario, los navegadores sirven la versión en caché. Convención semántica: incrementar patch para bugfixes (`1.0.1`), minor para features nuevas (`1.1.0`), major para cambios breaking (`2.0.0`).

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 27.1: Dataset PCF — Tabla de tareas personalizada
```bash
pac pcf init --namespace SITControls --name TareasDatasetControl --template dataset --framework react
npm install @fluentui/react @fluentui/react-icons
```

```typescript
// index.tsx — Dataset control con Fluent UI
import * as React from 'react';
import { DetailsList, IColumn, SelectionMode, CommandBar } from '@fluentui/react';
import { IInputs, IOutputs } from './generated/ManifestTypes';

interface TareasControlProps {
    dataset: ComponentFramework.PropertyTypes.DataSet;
    navigate: (entityRef: ComponentFramework.EntityReference) => void;
    webAPI: ComponentFramework.WebApi;
}

const TareasControl: React.FC<TareasControlProps> = ({ dataset, navigate, webAPI }) => {
    const [items, setItems] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!dataset.loading) {
            const rows = dataset.sortedRecordIds.map(id => {
                const record = dataset.records[id];
                return {
                    id: record.getRecordId(),
                    titulo: record.getValue('sit_titulo') as string,
                    estado: record.getFormattedValue('sit_estado'),
                    asignado: record.getFormattedValue('_sit_asignado_value'),
                    fechaVencimiento: record.getFormattedValue('sit_fechavencimiento'),
                    entityRef: record.getNamedReference()
                };
            });
            setItems(rows);
            setIsLoading(false);
        }
    }, [dataset]);

    const columns: IColumn[] = [
        {
            key: 'titulo', name: 'Tarea', fieldName: 'titulo', minWidth: 200,
            onRender: (item) => (
                <span
                    style={{ cursor: 'pointer', color: '#0078d4', textDecoration: 'underline' }}
                    onClick={() => navigate(item.entityRef)}
                >
                    {item.titulo}
                </span>
            )
        },
        { key: 'estado', name: 'Estado', fieldName: 'estado', minWidth: 100 },
        { key: 'asignado', name: 'Asignado a', fieldName: 'asignado', minWidth: 150 },
        { key: 'fechaVencimiento', name: 'Vencimiento', fieldName: 'fechaVencimiento', minWidth: 100 },
        {
            key: 'acciones', name: '', minWidth: 80,
            onRender: (item) => (
                <button
                    style={{ backgroundColor: '#107C10', color: 'white', border: 'none', 
                             padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => completarTarea(item.id)}
                >
                    ✓ Completar
                </button>
            )
        }
    ];

    const completarTarea = async (id: string) => {
        try {
            await webAPI.updateRecord('sit_tarea', id, {
                sit_estado: { Value: 100000003 } // Completada
            });
            dataset.refresh();
        } catch (error) {
            console.error('Error completando tarea:', error);
        }
    };

    return (
        <DetailsList
            items={items}
            columns={columns}
            selectionMode={SelectionMode.none}
            isLoading={isLoading}
        />
    );
};

export class TareasDatasetControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(TareasControl, {
            dataset: context.parameters.tareas,
            navigate: context.navigation.openForm,
            webAPI: context.webAPI
        });
    }

    public getOutputs(): IOutputs { return {}; }
    public destroy(): void { }
}
```

#### Actividad 27.2: Actualizar manifest para Dataset PCF
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
  <control namespace="SITControls" constructor="TareasDatasetControl"
           version="1.0.0" display-name-key="Tareas Dataset Control"
           control-type="virtual">
    
    <data-set name="tareas" display-name-key="Tareas">
      <!-- Las columnas que el PCF usará desde el dataset -->
      <property-set name="titulo" display-name-key="Título" 
                    of-type="SingleLine.Text" usage="bound" required="true" />
      <property-set name="estado" display-name-key="Estado" 
                    of-type="OptionSet" usage="bound" required="true" />
    </data-set>
    
    <resources>
      <code path="index.ts" order="1" />
    </resources>
  </control>
</manifest>
```

#### Actividad 27.3: Publicar en solución y agregar a formulario
```bash
npm run build -- --buildMode production
pac pcf push --publisher-prefix sit
```
1. En la solución → Agregar existente → Componente de control personalizado
2. En formulario de Proyecto → Subgrid de Tareas → Agregar componente → `TareasDatasetControl`
3. Configurar propiedad: tareas → columnas: sit_titulo, sit_estado, _sit_asignado_value

### 💼 Caso Real de Negocio
**Empresa:** Firma de abogados con gestión de expedientes en Dataverse  
**Problema:** La subgrid nativa de documentos del expediente no permitía preview, tags ni acciones masivas. Cada acción requería abrir el registro individualmente.  
**Solución:** PCF Dataset Control con preview inline de PDFs, tags coloridos por categoría, y botón de "Firmar documento" que llama a Azure Functions. Fluent UI para que se vea nativo de D365.  
**Resultado:** Tiempo de revisión de expediente: de 8 minutos a 2 minutos. Satisfacción de abogados: 4.7/5.

### ✅ Buenas Prácticas
- Siempre usar Virtual PCF (React) — menor bundle, mejor rendimiento
- `dataset.refresh()` después de cualquier operación de escritura — mantiene la lista sincronizada
- Limitar llamadas a `webAPI` — no hacer CRUD en cada render, solo en acciones del usuario
- Versionar el PCF semánticamente y actualizar la versión antes de cada push a producción
- Probar el PCF en el test harness local (`npm start`) antes de hacer `pac pcf push` — el ciclo de feedback local es segundos vs minutos en Dataverse
- Mantener el PCF enfocado en una responsabilidad: un control que muestra datos, no uno que también gestiona configuraciones — el Single Responsibility Principle aplica a controles PCF

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| PCF muestra contenido vacío después de `pac pcf push` | La versión en el manifest no fue incrementada — el navegador sirve la versión anterior en caché | Incrementar `version` en ControlManifest.Input.xml, hacer push, y forzar recarga con Ctrl+Shift+R |
| `dataset.records[id]` lanza "Cannot read property of undefined" | Se accede a `dataset.records` antes de que termine la carga asíncrona del dataset | Verificar `!dataset.loading` antes de iterar `dataset.sortedRecordIds` |
| `context.webAPI.updateRecord` no actualiza la UI | Se llama `updateRecord` pero no se llama `dataset.refresh()` después | Siempre llamar `context.parameters.nombreDataset.refresh()` después de cualquier operación de escritura exitosa |
| Fluent UI DetailsList no renderiza en Canvas App | Canvas Apps no incluyen el mismo Fluent UI v8 — conflicto de versiones | Para Canvas Apps usar controles más simples o verificar compatibilidad de versión; en Model-Driven Apps no hay este problema |
| PCF no aparece en la lista de componentes del formulario | El assembly del PCF fue registrado en DEV pero no está en la solución exportada | Agregar el PCF a la solución antes del export: Solución → Agregar existente → Componente de control personalizado |

### 🧪 Criterios de Validación
- [ ] PCF Dataset Control renderiza la lista de tareas con datos reales de Dataverse
- [ ] Clic en el nombre navega al registro de la tarea
- [ ] Botón "Completar" actualiza el estado en Dataverse y refresca la lista
- [ ] Control usa Fluent UI y se ve coherente con el resto de D365
- [ ] PCF publicado en solución managed e importado en TEST sin errores

---

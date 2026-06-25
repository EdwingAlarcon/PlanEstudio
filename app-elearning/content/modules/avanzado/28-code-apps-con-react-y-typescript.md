---
moduleId: 28
title: "Code Apps con React y TypeScript"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 9
slug: "code-apps-con-react-y-typescript"
---
### 🎯 Objetivo
Construir aplicaciones web completas (React + TypeScript + Vite) que corren dentro de Power Platform, con acceso nativo y tipado a conectores y Dataverse, control total del UI, y despliegue como soluciones administradas mediante el pipeline de ALM.

### 📖 Conceptos Clave
- **Code Apps vs Canvas Apps vs PCF:** tres paradigmas de desarrollo en Power Platform con distintos trade-offs. Code Apps son aplicaciones web standalone completas construidas con React + TypeScript — control total del UI, acceso al ecosistema npm, pero requieren habilidades de desarrollo web. Canvas Apps son aplicaciones low-code con Power Fx — accesibles para desarrolladores ciudadanos, soporte mobile nativo, pero limitadas en patrones de UI complejos. PCF son componentes individuales embebidos en formularios de D365 o Canvas Apps — no son apps completas, sino controles que aumentan las capacidades de una pantalla existente.
- **`@microsoft/power-apps` SDK (Power Apps CLI SDK):** librería cliente generada por el CLI que provee la infraestructura de la Code App: autenticación automática con Entra ID usando el contexto del usuario que abrió la app, gestión del ciclo de vida de la aplicación dentro de la plataforma, y la integración con los servicios generados en `/generated/`. No se instala manualmente — se incluye en el scaffold y se actualiza con `pac code add-data-source`.
- **Vite + React 18 + TypeScript 5:** stack tecnológico base de una Code App — exactamente el mismo que cualquier aplicación web moderna. Vite es el build tool con Hot Module Replacement ultrarrápido en desarrollo. React 18 provee el renderizado con Concurrent Mode y Suspense. TypeScript 5 garantiza tipado estricto de extremo a extremo desde los modelos generados de Dataverse hasta los componentes de la UI. Todo el ecosistema npm es accesible: D3.js, recharts, react-table, tanstack-query, zod, etc.
- **Data sources tipados (pac code add-data-source):** comando del pac CLI que conecta la Code App a una tabla de Dataverse o a un conector de Power Platform y genera automáticamente en `/generated/`: una interfaz TypeScript con todos los campos de la tabla (`SitSolicitudtiModel.ts`), y un servicio de acceso a datos con los métodos CRUD tipados (`SitSolicitudtiService.ts`). Los métodos del servicio — `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)` — gestionan internamente la autenticación, el formato OData, y el manejo de errores.
- **Carpeta `/generated/`:** directorio dentro de `src/` que contiene todos los modelos TypeScript e interfaces de servicio generados automáticamente por el CLI. Contiene `services/` (una clase de servicio por tabla/conector) y `models/` (una interfaz TypeScript por tabla). Esta carpeta se sobreescribe completamente con cada `pac code add-data-source` — cualquier modificación manual se perderá. Si se necesita lógica adicional, crear clases wrapper que importen desde `/generated/` sin modificarlos.
- **Connection References:** componente de solución de Power Platform que representa una referencia a una conexión (Dataverse, Office 365, SQL Server, etc.) desacoplada del entorno específico. Cuando la Code App se empaqueta en una solución y se importa en un entorno diferente (TEST, PROD), el asistente de importación solicita mapear cada Connection Reference a una conexión existente en ese entorno. Esto permite que la solución sea portable entre entornos sin hardcodear URLs o credenciales.
- **Managed Platform benefits (beneficios de la plataforma gestionada):** al desplegar una Code App dentro de Power Platform, hereda automáticamente toda la gobernanza de la plataforma sin código adicional: DLP Policies (las políticas de prevención de pérdida de datos del admin bloquean conectores no autorizados), Conditional Access de Entra ID (MFA, acceso desde IPs corporativas), auditoría de acceso (quién abrió la app y cuándo), y Sharing Controls (el admin puede limitar con quién se puede compartir la app). Esto es una ventaja significativa sobre una SPA desplegada externamente.
- **Limitaciones actuales de Code Apps (Preview):** a la fecha de este módulo, las Code Apps no soportan: Power Apps Mobile (para usuarios móviles se debe usar Canvas App con los mismos datos Dataverse), SharePoint Forms integration (no pueden reemplazar formularios de listas de SharePoint), Power Platform Git Integration (el versionado se gestiona con el repositorio de la app, no con el ALM nativo de Power Platform), ni embedded Power BI reports. Estas limitaciones son propias del estado Preview de la funcionalidad y pueden cambiar en futuras versiones.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 28.1: Scaffolding y primera Code App

1. Verificar prerequisitos instalados:

    ```bash
    node -v          # LTS v20+
    pac --version    # PAC CLI actualizado
    ```

2. Habilitar Code Apps en el entorno:
    - Power Platform Admin Center → Manage → Environments → seleccionar entorno
    - Settings → Product → Features → activar toggle **"Enable code apps"** → Save

3. Crear scaffolding con template oficial:

    ```bash
    npx degit github:microsoft/PowerAppsCodeApps/templates/vite mi-primera-code-app
    cd mi-primera-code-app
    npm install
    ```

4. Revisar estructura del proyecto generado:

    ```
    mi-primera-code-app/
    ├── src/
    │   ├── App.tsx          # Componente raíz
    │   ├── main.tsx         # Entry point
    │   └── generated/       # Servicios auto-generados — NO editar
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
    ```

5. Ejecutar en modo desarrollo local:

    ```bash
    npm run dev
    # Abre http://localhost:5173
    ```

#### Actividad 28.2: Conectar a Dataverse

1. Autenticar PAC CLI con el entorno de desarrollo:

    ```bash
    pac auth create --environment https://tuorg.crm.dynamics.com
    ```

2. Agregar tabla Dataverse como data source:

    ```bash
    pac code add-data-source -a dataverse -t sit_solicitudti
    ```

    El CLI genera automáticamente:

    ```
    src/generated/
    ├── services/
    │   └── SitSolicitudtiService.ts   # CRUD tipado completo
    └── models/
        └── SitSolicitudtiModel.ts     # Interfaz TypeScript de la tabla
    ```

3. Consumir el servicio en un componente React:

    ```tsx
    import { SitSolicitudtiService } from './generated/services/SitSolicitudtiService';
    import { SitSolicitudti } from './generated/models/SitSolicitudtiModel';

    const App: React.FC = () => {
      const [solicitudes, setSolicitudes] = React.useState<SitSolicitudti[]>([]);

      React.useEffect(() => {
        SitSolicitudtiService.getAll().then(setSolicitudes);
      }, []);

      return (
        <ul>
          {solicitudes.map(s => (
            <li key={s.sit_solicitudtiid}>{s.sit_titulo}</li>
          ))}
        </ul>
      );
    };
    ```

#### Actividad 28.3: CRUD completo con Fluent UI

1. Instalar Fluent UI React Components:

    ```bash
    npm install @fluentui/react-components
    ```

2. Construir un DataGrid con acciones de edición y eliminación:

    ```tsx
    import {
      DataGrid, DataGridBody, DataGridRow, DataGridCell,
      DataGridHeader, DataGridHeaderCell, Button, createTableColumn
    } from '@fluentui/react-components';

    const columns = [
      createTableColumn<SitSolicitudti>({
        columnId: 'titulo',
        renderHeaderCell: () => 'Título',
        renderCell: (item) => item.sit_titulo,
      }),
      createTableColumn<SitSolicitudti>({
        columnId: 'estado',
        renderHeaderCell: () => 'Estado',
        renderCell: (item) => item.sit_estado_label ?? '—',
      }),
      createTableColumn<SitSolicitudti>({
        columnId: 'acciones',
        renderHeaderCell: () => '',
        renderCell: (item) => (
          <Button appearance="subtle"
            onClick={() => SitSolicitudtiService.delete(item.sit_solicitudtiid!)}>
            Eliminar
          </Button>
        ),
      }),
    ];
    ```

3. Implementar formulario de creación con validación:

    ```tsx
    const handleCreate = async (data: Partial<SitSolicitudti>) => {
      await SitSolicitudtiService.create({
        sit_titulo: data.sit_titulo!,
        sit_descripcion: data.sit_descripcion,
        sit_categoria: data.sit_categoria ?? 1,
        sit_prioridad: data.sit_prioridad ?? 2,
      });
      SitSolicitudtiService.getAll().then(setSolicitudes);
    };
    ```

#### Actividad 28.4: Despliegue y ALM

1. Publicar la Code App al entorno DEV:

    ```bash
    pac code push
    ```

    La app aparece en make.powerapps.com → Apps.

2. Agregar a una solución para ALM:

    ```bash
    pac solution add-reference --path .
    pac solution pack --folder SolutionSrc --zipfile SolicitudesTI_v1.0.zip --packagetype Managed
    ```

3. Importar en entorno TEST y validar Connection References:
    - Al importar, el asistente pedirá mapear la conexión de Dataverse al entorno TEST
    - Confirmar que los datos cargados corresponden al entorno correcto

4. Verificar comportamiento de permisos (DLP):
    - En Admin Center, crear una DLP policy que bloquee el conector de Dataverse en el entorno TEST
    - Comprobar que la app lanza el mensaje de DLP sin necesitar código adicional

### 💼 Caso Real de Negocio

**Empresa**: Firma de consultoría con 200 consultores distribuidos

**Problema**: El portal de gestión de proyectos en Canvas App no soporta los patrones de UI requeridos — tablero Kanban con drag-and-drop, gráficos de utilización interactivos y tabla de timesheet con edición masiva inline. Construir cada uno como PCF Component separado tomaría 3 meses; una Code App resuelve todo en 3 semanas.

**Solución implementada**:

- Code App React conectada a Dataverse (tablas: `sit_proyecto`, `sit_consultor`, `sit_timesheet`)
- Kanban de proyectos con `react-beautiful-dnd` — drag-and-drop actualiza el estado en Dataverse
- Gráficos de utilización con `recharts` conectados a datos reales en tiempo real
- Tabla de timesheet con edición inline masiva usando Fluent UI DataGrid
- Autenticación Entra ID gestionada por la plataforma — cero código de auth
- Desplegada como solución Managed en producción con pipeline CI/CD Azure DevOps

**Resultado**:

- 40% menos tiempo de desarrollo vs PCF Components individuales
- Control total de layout y CSS — imposible con Canvas Apps
- Acceso al ecosistema npm completo (D3, recharts, react-table, etc.)
- Misma gobernanza que Canvas Apps: DLP, Conditional Access, auditoría

### ✅ Buenas Prácticas
- Nunca editar archivos en `/generated/` — son regenerados con cada `pac code add-data-source` y los cambios se perderían
- Usar Fluent UI React Components (`@fluentui/react-components`) para mantener coherencia visual con el ecosistema Microsoft 365
- Separar la lógica de negocio en servicios propios que importan desde `/generated/` — no poner lógica directamente en componentes React
- Agregar data sources siempre con `pac code add-data-source` en lugar de llamadas directas a la WebAPI — los servicios generados ya gestionan auth y tipado
- Incluir la Code App en una Solución desde el primer día — facilita el ALM y evita migraciones manuales posteriores
- Probar localmente con `npm run dev` antes de cada `pac code push` para reducir el ciclo de feedback

### ⚠️ Errores Comunes
- **Error**: Editar manualmente `src/generated/` — archivos sobreescritos en el siguiente `pac code add-data-source`
  - **Solución**: Crear wrappers propios que importen desde `/generated/` sin modificarlos
- **Error**: Esperar que la Code App funcione en Power Apps Mobile
  - **Solución**: Code Apps no soportan mobile; para usuarios móviles usar Canvas App con los mismos datos Dataverse
- **Error**: Usar `fetch`/`axios` para llamar a Dataverse WebAPI directamente
  - **Solución**: Usar los servicios generados por el CLI — ya gestionan autenticación, tipado y rate limits
- **Error**: Olvidar habilitar Code Apps en el entorno antes de `pac code push`
  - **Solución**: Verificar Admin Center → Settings → Features → Enable code apps
- **Error**: Importar la app suelta entre ambientes sin empaquetar en solución
  - **Solución**: Siempre usar `pac solution pack` con `--packagetype Managed` para ALM correcto

### 🧪 Criterios de Validación
- [ ] Code App creada con template oficial, ejecuta en local con `npm run dev` sin errores
- [ ] Al menos una tabla Dataverse conectada via `pac code add-data-source` con servicios generados tipados
- [ ] CRUD completo (listar, crear, editar, eliminar) implementado usando los servicios de `/generated/`
- [ ] UI construida con Fluent UI React — al menos DataGrid y formulario de creación funcionales
- [ ] App publicada en entorno DEV con `pac code push` y visible en make.powerapps.com
- [ ] App empaquetada en Solución Managed e importada en entorno TEST con Connection References correctas
- [ ] Puedes explicar con ejemplos concretos cuándo elegir Code App vs Canvas App vs PCF Component

---

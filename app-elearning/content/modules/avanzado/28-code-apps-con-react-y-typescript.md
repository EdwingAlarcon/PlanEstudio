---
moduleId: 28
title: "Code Apps con React y TypeScript"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 9
practiceMinutes: 150
slug: "code-apps-con-react-y-typescript"
---

### 🚧 Antes de comenzar: es el módulo con más exigencia de código de la ruta Developer

> **Requiere conocimientos previos que PlanEstudio todavía no enseña desde cero:** TypeScript,
> React (componentes, props, estado, hooks) y el flujo de un proyecto Vite. Lee primero
> [Fundamentos de TypeScript y React para PCF](/recursos/fundamentos-typescript-react) (30-40 min,
> incluye práctica local con Vite, sin tenant) — este módulo asume ese nivel de entrada y no lo
> reintroduce. Si el puente todavía te resulta difícil, estudia este módulo en modo conceptual
> (arquitectura de Code Apps, SDK, ALM) antes de intentar construir la app vos mismo.

### 🎯 Objetivo
Construir aplicaciones web completas (React + TypeScript + Vite) que corren dentro de Power Platform, con acceso nativo y tipado a conectores y Dataverse, control total del UI, y despliegue como soluciones administradas mediante el pipeline de ALM.

### 📖 Conceptos Clave
- **Code Apps vs Canvas Apps vs PCF:** tres paradigmas de desarrollo en Power Platform con distintos trade-offs. Code Apps son aplicaciones web standalone completas construidas con React + TypeScript — control total del UI, acceso al ecosistema npm, pero requieren habilidades de desarrollo web. Canvas Apps son aplicaciones low-code con Power Fx — accesibles para desarrolladores ciudadanos, soporte mobile nativo, pero limitadas en patrones de UI complejos. PCF son componentes individuales embebidos en formularios de D365 o Canvas Apps — no son apps completas, sino controles que aumentan las capacidades de una pantalla existente.
- **`@microsoft/power-apps` (Power Apps client library) + `@microsoft/power-apps-cli` (Power Apps CLI, `pa`):** desde la versión 1.0.4 del SDK, Microsoft reemplazó el flujo basado en `pac code` por un CLI npm dedicado (`pa`) más liviano en prerequisitos. `@microsoft/power-apps` es la librería cliente que provee la infraestructura de la Code App en tiempo de ejecución: autenticación con Entra ID usando el contexto del usuario que abrió la app, acceso al contexto de app/usuario/host, y la integración con los servicios generados en `/generated/`. `@microsoft/power-apps-cli` instala el comando `pa`, usado para inicializar (`pa app init`), ejecutar en local (`pa app run`), conectar datos (`pa app add data-source`) y publicar (`pa app push`) la Code App. `pac code` sigue existiendo pero Microsoft ya anunció su deprecación futura a favor de este CLI.
- **Vite + React 18 + TypeScript 5:** stack tecnológico base de una Code App — exactamente el mismo que cualquier aplicación web moderna. Vite es el build tool con Hot Module Replacement ultrarrápido en desarrollo. React 18 provee el renderizado con Concurrent Mode y Suspense. TypeScript 5 garantiza tipado estricto de extremo a extremo desde los modelos generados de Dataverse hasta los componentes de la UI. Todo el ecosistema npm es accesible: D3.js, recharts, react-table, tanstack-query, zod, etc.
- **Data sources tipados (`pa app add data-source`):** comando del CLI `pa` que conecta la Code App a una tabla de Dataverse (`--connector dataverse --table <nombre-lógico>`) o a un conector de Power Platform y genera automáticamente en `/generated/`: una interfaz TypeScript con todos los campos de la tabla (`SitSolicitudtiModel.ts`), y un servicio de acceso a datos con los métodos CRUD tipados (`SitSolicitudtiService.ts`). Los métodos del servicio — `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)` — gestionan internamente la autenticación, el formato OData, y el manejo de errores.
- **Carpeta `/generated/`:** directorio dentro de `src/` que contiene todos los modelos TypeScript e interfaces de servicio generados automáticamente por el CLI. Contiene `services/` (una clase de servicio por tabla/conector) y `models/` (una interfaz TypeScript por tabla). Esta carpeta se sobreescribe completamente con cada `pa app add data-source` (o `pa app refresh data-source`) — cualquier modificación manual se perderá. Si se necesita lógica adicional, crear clases wrapper que importen desde `/generated/` sin modificarlos.
- **Connection References:** componente de solución de Power Platform que representa una referencia a una conexión (Dataverse, Office 365, SQL Server, etc.) desacoplada del entorno específico. Cuando la Code App se empaqueta en una solución y se importa en un entorno diferente (TEST, PROD), el asistente de importación solicita mapear cada Connection Reference a una conexión existente en ese entorno. Esto permite que la solución sea portable entre entornos sin hardcodear URLs o credenciales.
- **Managed Platform benefits (beneficios de la plataforma gestionada):** al desplegar una Code App dentro de Power Platform, hereda automáticamente toda la gobernanza de la plataforma sin código adicional: DLP Policies (las políticas de prevención de pérdida de datos del admin bloquean conectores no autorizados), Conditional Access de Entra ID (MFA, acceso desde IPs corporativas), auditoría de acceso (quién abrió la app y cuándo), y Sharing Controls (el admin puede limitar con quién se puede compartir la app). Esto es una ventaja significativa sobre una SPA desplegada externamente.
- **Limitaciones actuales de Code Apps (Preview):** Code Apps sigue en Preview (Microsoft indica que se acerca a General Availability, pero aún no llegó). A la fecha de este módulo, las Code Apps no soportan: **Power Apps for Windows** (el cliente de escritorio; sí funcionan en cualquier navegador moderno, y para usuarios móviles se debe usar Canvas App con los mismos datos Dataverse), SharePoint Forms integration (no pueden reemplazar formularios de listas de SharePoint), Power Platform Git Integration (el versionado se gestiona con el repositorio de la app, no con el ALM nativo de Power Platform), ni la función `PowerBIIntegration` para consumir datos de Power BI desde la app. **Importante — no es la limitación inversa**: una Code App **sí puede embeberse** dentro de un reporte de Power BI usando el control **Power Apps Visual**; lo que no soportan es que la Code App llame datos de Power BI hacia adentro. Estas limitaciones son propias del estado Preview de la funcionalidad y pueden cambiar en futuras versiones.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 28.1: Scaffolding y primera Code App

1. Verificar prerequisitos instalados:

    ```bash
    node -v          # LTS v22+ (requerido; versiones anteriores tienen problemas de confianza TLS con el CLI)
    git --version    # Git
    ```

2. Habilitar Code Apps en el entorno:
    - Power Platform Admin Center → Manage → Environments → seleccionar entorno
    - Settings → Product → Features → activar toggle **"Enable code apps"** → Save

3. Crear scaffolding con template oficial e instalar el CLI npm de Code Apps:

    ```bash
    npx degit github:microsoft/PowerAppsCodeApps/templates/vite mi-primera-code-app
    cd mi-primera-code-app

    npm install --global @microsoft/power-apps-cli
    npm install --global @microsoft/power-apps
    npm install
    ```

    > **Nota de vigencia**: hasta 2025 el flujo oficial usaba el CLI `pac code` (parte de Power Platform CLI). A partir del SDK `@microsoft/power-apps` v1.0.4, Microsoft introdujo este nuevo CLI basado en npm (`pa`), que reduce prerequisitos y reemplazará a `pac code`, cuya deprecación ya fue anunciada. Este módulo usa el CLI `pa` vigente.

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

5. Inicializar el code app (registra la app en el entorno de Power Platform):

    ```bash
    pa app init --display-name "Mi primera Code App" --environment-id <environment-id>
    # o, en modo interactivo:
    pa app init
    ```

    El CLI solicita iniciar sesión con la cuenta de Power Platform si aún no hay una sesión activa.

6. Ejecutar en modo desarrollo local:

    ```bash
    pa app run
    ```

    Abre la URL etiquetada **Local Play** en el mismo perfil de navegador que usás para el tenant de Power Platform.

#### Actividad 28.2: Conectar a Dataverse

1. (Opcional) Confirmar o cambiar la sesión activa del CLI `pa`:

    ```bash
    pa auth login          # inicia sesión desde el navegador del sistema
    pa auth status         # muestra las cuentas conectadas y cuál está activa
    ```

    Nota: `pa app init` (Actividad 28.1, paso 5) ya solicita el login si hace falta — este paso es solo para cambiar de cuenta o verificarla.

2. Agregar tabla Dataverse como data source:

    ```bash
    pa app add data-source --connector dataverse --table sit_solicitudti
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

1. Compilar y publicar la Code App al entorno DEV:

    ```bash
    npm run build
    pa app push
    ```

    La app aparece en make.powerapps.com → Apps.

2. Agregar la app a una solución para ALM. El CLI `pa` ya no expone un comando equivalente a `pac solution add-reference --path .` — con el nuevo flujo, `pa app push` puede colocar la app en una solución automáticamente:
    - **Primer publish, sin `--solution-id`**: el CLI usa la solución preferida del entorno (o la solución Default si no hay una preferida configurada). Para ALM predecible, [configurar una solución preferida](https://learn.microsoft.com/power-apps/maker/data-platform/preferred-solution) en el entorno de antemano.
    - **Publish a una solución específica**: pasar `--solution-id <solution-id>` (el GUID visible en la URL de la solución en make.powerapps.com). Este valor también puede fijarse en CI/CD con la variable de entorno `PA_CLI_SOLUTION_ID`.

    ```bash
    pa app push --solution-id <solution-id>
    ```

    - **App ya publicada sin solución**: se puede agregar después desde Power Apps → Solutions → seleccionar la solución → **Add existing → App → Code app**.

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
- Nunca editar archivos en `/generated/` — son regenerados con cada `pa app add data-source` y los cambios se perderían
- Usar Fluent UI React Components (`@fluentui/react-components`) para mantener coherencia visual con el ecosistema Microsoft 365
- Separar la lógica de negocio en servicios propios que importan desde `/generated/` — no poner lógica directamente en componentes React
- Agregar data sources siempre con `pa app add data-source` en lugar de llamadas directas a la WebAPI — los servicios generados ya gestionan auth y tipado
- Configurar una solución preferida en el entorno (o pasar `--solution-id` explícito en `pa app push`) desde el primer día — facilita el ALM y evita migraciones manuales posteriores
- Probar localmente con `pa app run` antes de cada `npm run build && pa app push` para reducir el ciclo de feedback

### ⚠️ Errores Comunes
- **Error**: Editar manualmente `src/generated/` — archivos sobreescritos en el siguiente `pa app add data-source`
  - **Solución**: Crear wrappers propios que importen desde `/generated/` sin modificarlos
- **Error**: Esperar que la Code App funcione en Power Apps for Windows (el cliente de escritorio)
  - **Solución**: Code Apps no son compatibles con Power Apps for Windows; funcionan en cualquier navegador moderno, y para usuarios móviles usar Canvas App con los mismos datos Dataverse
- **Error**: Usar `fetch`/`axios` para llamar a Dataverse WebAPI directamente
  - **Solución**: Usar los servicios generados por el CLI — ya gestionan autenticación, tipado y rate limits
- **Error**: Olvidar habilitar Code Apps en el entorno antes de `pa app push`
  - **Solución**: Verificar Admin Center → Settings → Features → Enable code apps
- **Error**: Confiar en que la app queda en una solución "por defecto" sin verificarlo
  - **Solución**: Fijar una solución preferida en el entorno o pasar siempre `--solution-id` en `pa app push` para ALM predecible entre DEV/TEST/PROD

### 🧪 Criterios de Validación
- [ ] Code App creada con template oficial, se inicializa con `pa app init` y ejecuta en local con `pa app run` sin errores
- [ ] Al menos una tabla Dataverse conectada via `pa app add data-source` con servicios generados tipados
- [ ] CRUD completo (listar, crear, editar, eliminar) implementado usando los servicios de `/generated/`
- [ ] UI construida con Fluent UI React — al menos DataGrid y formulario de creación funcionales
- [ ] App publicada en entorno DEV con `pa app push` y visible en make.powerapps.com
- [ ] App agregada a una Solución (automática o vía `--solution-id`), exportada como Managed e importada en entorno TEST con Connection References correctas
- [ ] Puedes explicar con ejemplos concretos cuándo elegir Code App vs Canvas App vs PCF Component

---

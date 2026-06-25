---
id: lab-04
title: "Model-Driven App — Sistema de Gestión de Solicitudes Completo"
level: "N1"
duration: "90 min"
product: ["Power Apps Model-Driven", "Dataverse"]
certifications: ["PL-900"]
role: ["Maker", "Developer"]
prerequisites:
  - "Lab 02 completado — tablas sit_Solicitud y sit_Categoria con datos"
  - "Lab 09 completado (recomendado) — BPF creado"
files: []
---

# Lab 04 — Model-Driven App: Sistema Completo de Gestión de Solicitudes SIT

## Objetivo

Al finalizar este laboratorio podrás construir una Model-Driven App completa con site map de dos áreas, formularios Main y Quick Create personalizados, vistas con filtros por rol, un dashboard con gráficos y lista, y dos Security Roles (Solicitante y Técnico TI) que definen qué puede hacer cada perfil.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 02

**Problema a resolver:** La Canvas App del Lab 03 es ideal para crear solicitudes desde el móvil, pero el equipo de soporte TI necesita una interfaz de escritorio con vistas de trabajo, dashboard de métricas y acceso directo al BPF. La Model-Driven App es la herramienta correcta para los técnicos — no para los solicitantes.

**Por qué Model-Driven App:** Generada automáticamente desde los metadatos de Dataverse, incluye timeline de actividades, navegación por áreas y grupos, y se actualiza sin rediseño cuando agregas columnas al modelo de datos. Es la interfaz estándar de Dynamics 365.

## Lo que vas a construir

- **Site map** de dos áreas: Operación (solicitudes) y Administración (catálogos + usuarios)
- **Formulario Main** con 3 pestañas: General, Resolución, Timeline
- **Formulario Quick Create** para registro rápido desde cualquier vista
- **5 vistas** orientadas a roles: cola del técnico, mis asignaciones, críticas, por categoría, cierre pendiente
- **Dashboard** con gráfico de estado y lista de pendientes urgentes
- **2 Security Roles**: Solicitante (lectura propia) y Técnico TI (escritura organización)

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Crear la MDA y site map | 15 min |
| Ejercicio 2 — Personalizar formularios | 25 min |
| Ejercicio 3 — Vistas y gráficos | 20 min |
| Ejercicio 4 — Dashboard | 10 min |
| Ejercicio 5 — Security Roles y prueba | 20 min |
| **Total** | **90 min** |

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Power Apps Model-Driven App (Modern App Designer)
- Dataverse (tablas, formularios, vistas, gráficos, dashboards)
- Security Roles (RBAC en Dataverse)

## Prerrequisitos

### Entorno

- [ ] Tabla `sit_Solicitud` del Lab 02 con 10+ registros
- [ ] Tabla `sit_Categoria` con 5 registros
- [ ] BPF "Ciclo de Vida de Solicitud SIT" del Lab 09 (si no lo tienes, el lab funciona sin él)
- [ ] Rol **System Administrator** en el ambiente

---

## Datos de apoyo

### Estructura del site map

```
Área: Operación
  Grupo: Mi Trabajo
    Subárea: Mis Solicitudes    (tabla sit_Solicitud, vista "Mis Solicitudes Activas")
    Subárea: Cola del Equipo    (tabla sit_Solicitud, vista "Solicitudes Abiertas del Equipo")
  Grupo: Alertas
    Subárea: Críticas           (tabla sit_Solicitud, vista "Críticas Sin Asignar")

Área: Administración
  Grupo: Catálogos
    Subárea: Categorías         (tabla sit_Categoria)
  Grupo: Reportes
    Subárea: Dashboard SIT      (dashboard creado en Ejercicio 4)
```

### Pestañas del formulario Main

| Pestaña | Secciones y campos |
|---|---|
| General | Básico: Titulo, Categoria, Prioridad, Estado / Personas: Solicitante, Asignado A |
| Resolución | Fechas: Fecha Solicitud, Fecha Resolucion / Solución: Descripción Solución, Costo Estimado |
| Timeline | Control Timeline (actividades, notas, emails relacionados) |

---

## Ejercicio 1 — Crear la MDA y configurar el site map

> **Qué vas a hacer:** Crear la app en la solución existente y definir la estructura de navegación.
> **Duración:** 15 min

### Tarea 1.1 — Crear la Model-Driven App

1. Abre la solución `SIT_SolicitudesInternas` en [make.powerapps.com](https://make.powerapps.com).

2. Haz clic en **+ Nuevo** → **App** → **Aplicación basada en modelo**.

3. Completa:

   | Campo | Valor |
   |---|---|
   | Nombre | SIT Gestión Solicitudes |
   | Descripción | App de escritorio para el equipo de soporte TI |

4. Haz clic en **Crear**. Se abre el Modern App Designer.

### Tarea 1.2 — Configurar el site map

El Modern App Designer muestra un panel de **Navegación** en el lado izquierdo.

1. Haz clic en **+ Agregar página** → **Vista de tabla Dataverse**.

2. En el diálogo:
   - Selecciona la tabla `sit_Solicitud`
   - Haz clic en la casilla junto a las vistas que quieres incluir:
     - "Mis Solicitudes Activas"
     - "Solicitudes Abiertas del Equipo"
     - "Críticas Sin Asignar"
   - Haz clic en **Agregar**.

3. Repite para la tabla `sit_Categoria` → incluye la vista predeterminada.

4. En el panel de navegación, arrastra y reorganiza las páginas para que coincidan con la estructura del site map definida en los datos de apoyo.

   > El Modern App Designer agrupa automáticamente las páginas. Si necesitas crear grupos personalizados, usa los controles de edición del panel de navegación.

5. Haz clic en **Guardar**.

### Validación del Ejercicio 1

- [ ] La app aparece en la solución `SIT_SolicitudesInternas`
- [ ] El panel de navegación muestra las dos tablas con sus vistas
- [ ] La app se puede previsualizar (botón **Reproducir** en el diseñador)

---

## Ejercicio 2 — Personalizar formularios

> **Qué vas a hacer:** Diseñar el formulario Main con 3 pestañas y crear el Quick Create Form para registro rápido.
> **Duración:** 25 min

### Tarea 2.1 — Abrir el editor de formularios

1. En el Modern App Designer, en el panel de páginas haz clic en la página de `sit_Solicitud`.

2. En el panel de propiedades a la derecha, busca la sección **Formularios** → haz clic en **Formulario principal (Main)** → **Editar**.

   > Si el enlace lleva al editor moderno de formularios, úsalo. Si el diseñador ofrece **Switch to classic**, no es necesario cambiarlo — ambos editores producen el mismo resultado.

### Tarea 2.2 — Estructurar el formulario en pestañas

El formulario por defecto tiene una sola sección. Vas a reorganizarlo en 3 pestañas.

1. En el editor de formularios, elimina las secciones predeterminadas si existen.

2. Agrega **Pestaña 1 — General**:
   - Haz clic en **+ Agregar componente** → **1 columna** (para secciones).
   - Renombra la pestaña a `General`.
   - Dentro de la pestaña, agrega **2 secciones**:
     - Sección `Información Básica`: campos `sit_titulo`, `sit_categoria`, `sit_prioridad`, `sit_estado`
     - Sección `Personas`: campos `sit_solicitante`, `sit_asignado`

3. Agrega **Pestaña 2 — Resolución**:
   - Nueva pestaña: `Resolución`
   - Sección `Fechas`: `sit_fechasolicitud`, `sit_fecharesolucion`
   - Sección `Detalle de Solución`: `sit_descripcion_solucion`, `sit_costoestimado`

   > Si la pestaña Resolución es innecesaria cuando el estado es "Nueva" o "En Proceso", puedes agregar una Business Rule desde el formulario: ocultar la pestaña si Estado = Nueva o En Proceso.

4. Agrega **Pestaña 3 — Timeline**:
   - Nueva pestaña: `Timeline`
   - Agrega el componente **Timeline** (Insert → Timeline)
   - El Timeline muestra emails, llamadas, notas y tareas relacionadas al registro automáticamente

5. Guarda el formulario (botón **Guardar**) y luego **Publicar**.

### Tarea 2.3 — Crear el Quick Create Form

El Quick Create permite crear un registro rápido desde cualquier parte de la app sin abrir el formulario completo.

1. Vuelve a la tabla `sit_Solicitud` → pestaña **Formularios** → **+ Nuevo formulario** → **Quick Create Form**.

2. Agrega solo los campos esenciales:
   - `sit_titulo`
   - `sit_categoria`
   - `sit_prioridad`
   - `sit_descripcion`

3. Guarda y publica.

4. En la configuración de la tabla, habilita "Permitir creación rápida" si no está activa:
   - Tabla `sit_Solicitud` → **Propiedades** → activa **Permitir creación rápida** → Guarda.

### Tarea 2.4 — Configurar Quick View Form para Categoría

El Quick View Form muestra datos de un registro relacionado dentro del formulario principal, sin salir de la solicitud.

1. Ve a la tabla `sit_Categoria` → **Formularios** → **+ Nuevo formulario** → **Quick View Form**.

2. Nombre: `Resumen Categoría`.

3. Agrega los campos: `sit_nombre`, `sit_descripcion`, `sit_slahoras`.

4. Guarda y publica.

5. Vuelve al Main Form de `sit_Solicitud` → en la pestaña General, sección Información Básica:
   - Agrega un control **Quick View** vinculado al Lookup `sit_categoria`
   - Selecciona el Quick View Form "Resumen Categoría"

   > El Quick View muestra el SLA de la categoría seleccionada directamente en el formulario de la solicitud — sin que el técnico tenga que abrir la categoría en otra pantalla.

### Validación del Ejercicio 2

- [ ] El formulario Main tiene 3 pestañas: General, Resolución, Timeline
- [ ] El Quick Create Form tiene los 4 campos esenciales
- [ ] El Quick View de Categoría muestra el SLA al seleccionar una categoría en el formulario

---

## Ejercicio 3 — Vistas y gráficos

> **Qué vas a hacer:** Refinar las vistas existentes y crear un gráfico de barras de solicitudes por categoría.
> **Duración:** 20 min

### Tarea 3.1 — Vista "Cola del Técnico" (por prioridad y antigüedad)

1. En la tabla `sit_Solicitud` → **Vistas** → busca "Solicitudes Abiertas del Equipo" (creada en Lab 02) → **Editar**.

2. Agrega la columna `sit_diasabierta` (si existe del Lab 09) o `sit_fechasolicitud`.

3. Configura el orden:
   - Primera: `sit_prioridad` Descendente (Crítica primero)
   - Segunda: `sit_fechasolicitud` Ascendente (más antigua primero)

4. Guarda y publica.

### Tarea 3.2 — Vista "Cierre Pendiente"

1. Nueva vista: `Solicitudes Pendientes de Cierre`.

2. Columnas: `sit_titulo` | `sit_asignado` | `sit_estado` | `sit_fecharesolucion` | `sit_costoestimado`

3. Filtro: Estado = Resuelta (ya resueltas pero aún no cerradas).

4. Ordenar: `sit_fecharesolucion` Ascendente.

5. Guarda y publica.

### Tarea 3.3 — Gráfico de solicitudes por categoría

1. Ve a la tabla `sit_Solicitud` → pestaña **Gráficos** → **+ Nuevo gráfico**.

2. Configura:

   | Campo | Valor |
   |---|---|
   | Nombre | Solicitudes por Categoría |
   | Tipo de gráfico | Barras verticales (Column Chart) |
   | Eje Y (datos) | Recuento de registros |
   | Eje X (agrupar por) | `sit_categoria` |
   | Filtro aplicado | Vista "Solicitudes Abiertas del Equipo" |

3. Guarda el gráfico.

4. Crea un segundo gráfico:
   - Nombre: `Distribución por Estado`
   - Tipo: Gráfico de anillo (Donut)
   - Dato: Recuento de registros, agrupado por `sit_estado`

### Validación del Ejercicio 3

- [ ] La vista "Cola del Técnico" ordena por prioridad descendente y fecha ascendente
- [ ] La vista "Cierre Pendiente" solo muestra solicitudes en estado Resuelta
- [ ] Los 2 gráficos son visibles en la tabla sit_Solicitud

---

## Ejercicio 4 — Dashboard

> **Qué vas a hacer:** Crear un dashboard de 3 paneles para el gerente de soporte TI.
> **Duración:** 10 min

### Tarea 4.1 — Crear el dashboard

1. En [make.powerapps.com](https://make.powerapps.com) → menú lateral → **Dashboards** → **+ Nuevo dashboard** → **Dashboard clásico 2 columnas**.

   > Si el Modern App Designer no muestra la opción de Dashboards directamente, ve a la tabla `sit_Solicitud` desde la solución → **Dashboards** en el menú de la tabla.

2. Nombre: `Dashboard SIT Soporte TI`.

3. Configura los 3 paneles:

   | Panel | Tipo | Contenido |
   |---|---|---|
   | Superior izquierda | Gráfico | "Distribución por Estado" de sit_Solicitud |
   | Superior derecha | Gráfico | "Solicitudes por Categoría" de sit_Solicitud |
   | Inferior (ancho completo) | Lista | Vista "Críticas Sin Asignar" de sit_Solicitud |

4. Guarda y publica.

5. Agrega el dashboard al site map de la app:
   - En el Modern App Designer → **+ Agregar página** → **Dashboard** → selecciona "Dashboard SIT Soporte TI"

### Validación del Ejercicio 4

- [ ] El dashboard tiene 3 paneles configurados
- [ ] Los gráficos muestran datos de las solicitudes de prueba
- [ ] El dashboard aparece en la navegación de la app

---

## Ejercicio 5 — Security Roles y prueba de permisos

> **Qué vas a hacer:** Crear dos roles con permisos distintos y verificar que cada perfil solo puede hacer lo que le corresponde.
> **Duración:** 20 min

### Tarea 5.1 — Crear el rol "SIT Solicitante"

1. Ve a [make.powerapps.com](https://make.powerapps.com) → **Configuración** → **Configuración avanzada** → portal clásico → **Seguridad** → **Roles de seguridad**.

2. Haz clic en **Nuevo**:
   - Nombre: `SIT Solicitante`

3. Configura los permisos por tabla (pestaña **Personalización** para tablas de la solución):

   | Tabla | Crear | Leer | Escribir | Eliminar |
   |---|---|---|---|---|
   | sit_Solicitud | Propio | Unidad de negocio | Propio | No |
   | sit_Categoria | No | Organización | No | No |

   > **Leer "Unidad de negocio"** significa que el solicitante puede ver las solicitudes de otros de su misma unidad de negocio, pero no de toda la organización. Ajusta según el caso.

4. Guarda el rol.

### Tarea 5.2 — Crear el rol "SIT Técnico TI"

1. Nuevo rol: `SIT Técnico TI`.

2. Permisos:

   | Tabla | Crear | Leer | Escribir | Eliminar |
   |---|---|---|---|---|
   | sit_Solicitud | Organización | Organización | Organización | Unidad de negocio |
   | sit_Categoria | Organización | Organización | Organización | Organización |
   | sit_auditoriasolicitud | No | Organización | No | No |

3. Guarda el rol.

### Tarea 5.3 — Compartir la app y asignar roles

1. En [make.powerapps.com](https://make.powerapps.com) → **Aplicaciones** → selecciona "SIT Gestión Solicitudes" → **Compartir**.

2. Agrega los usuarios y asígnales el rol correspondiente (SIT Solicitante o SIT Técnico TI).

   > Para probar localmente, asígnate a ti mismo ambos roles en momentos diferentes y observa la diferencia.

### Tarea 5.4 — Probar los permisos

Con el rol **SIT Técnico TI** activo:

1. Abre la app → la vista "Cola del Equipo" muestra todas las solicitudes de la organización.
2. Abre una solicitud → puedes editar todos los campos.
3. El Dashboard muestra gráficos con datos.

Con el rol **SIT Solicitante** activo (en ventana privada o con otro usuario):

1. La vista "Cola del Equipo" solo muestra solicitudes creadas por ese usuario.
2. Al abrir una solicitud ajena, la app puede mostrar error de permisos o la solicitud en modo solo lectura.
3. El botón **Nuevo** crea una solicitud pero no puede asignarla a un técnico.

### Validación del Ejercicio 5

- [ ] Rol "SIT Solicitante" creado con permisos de lectura en unidad de negocio
- [ ] Rol "SIT Técnico TI" creado con permisos de escritura a nivel organización
- [ ] Con rol Técnico: todas las solicitudes son visibles y editables
- [ ] Con rol Solicitante: solo las solicitudes propias son editables

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El BPF no aparece en el formulario | El BPF no está activo o no tiene el rol asignado | Process → actívalo y en la pestaña Security Roles del BPF agrega el rol del usuario |
| Las vistas personalizadas no aparecen en la app | Las vistas no se publicaron | Desde la tabla → Vistas → Publicar todo |
| El Quick Create Form no aparece al hacer clic en "+" | La tabla no tiene habilitado "Permitir creación rápida" | Tabla → Propiedades → habilita la opción y guarda |
| El gráfico aparece vacío | Los registros no coinciden con el filtro de la vista asociada | Verifica que el filtro de la vista no excluya todos los registros de prueba |
| Security Role: el usuario no puede acceder a la app | El rol no fue asignado correctamente | Admin Center → Ambiente → Usuarios → editar usuario → Roles |
| El timeline no muestra nada | No se han creado actividades (notas/llamadas) para los registros | Crea una nota desde el formulario → debe aparecer en la pestaña Timeline |

---

## Checklist final

- [ ] MDA "SIT Gestión Solicitudes" publicada y accesible desde make.powerapps.com → Aplicaciones
- [ ] Site map con área de Operación (Solicitudes, Cola, Críticas) y Administración (Categorías, Dashboard)
- [ ] Formulario Main tiene 3 pestañas: General, Resolución, Timeline
- [ ] Quick Create Form con 4 campos funciona desde la vista
- [ ] Quick View de Categoría muestra el SLA en el formulario de solicitud
- [ ] Vista "Cierre Pendiente" filtra solo solicitudes en estado Resuelta
- [ ] Dashboard con 2 gráficos y lista de críticas publicado
- [ ] Rol "SIT Solicitante" y "SIT Técnico TI" creados con permisos correctos
- [ ] Prueba con ambos roles verifica comportamiento diferenciado

---

## Reto adicional

**Reto básico:** Agrega un cuarto panel al dashboard que muestre el **tiempo promedio de resolución** de las solicitudes cerradas del último mes. Requiere una vista filtrada y una medida DAX en un reporte Power BI embebido, o un chart de tipo Average.

**Reto intermedio:** Crea un **formulario de Quick View** para el Lookup `sit_asignado` que muestre el nombre, email y el conteo de solicitudes activas del técnico directamente en el formulario de la solicitud (para que el gerente vea si un técnico ya tiene muchas asignaciones).

**Reto avanzado:** Implementa **Column-level security** en el formulario: haz que la pestaña "Resolución" y sus campos solo sean visibles cuando el usuario tiene el rol "SIT Técnico TI" (usando una Business Rule que detecte si el campo `sit_costoestimado` es editable, lo que indica que el usuario tiene el Field Security Profile del Lab 09).

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre un formulario **Main**, **Quick Create** y **Quick View**?
2. ¿En qué escenario usarías una **Model-Driven App** en lugar de una **Canvas App**?
3. ¿Qué significa el nivel de acceso **"Unidad de negocio"** en un Security Role?
4. ¿Por qué se recomienda crear la MDA dentro de una **Solución** en lugar de desde el portal directo?

---

## Limpieza del laboratorio

> Conserva la app — el Lab 19 (CI/CD) empaqueta la solución `SIT_SolicitudesInternas` completa incluyendo esta MDA.

---

## Siguiente laboratorio recomendado

➡️ **Lab 09 — Dataverse Avanzado: BPF y Field Security** (si aún no lo has hecho)

O si ya completaste el Lab 09:

➡️ **Lab 19 — ALM y CI/CD: Pipeline de Azure DevOps para Power Platform**

**Por qué ir ahí:** La solución `SIT_SolicitudesInternas` que has construido en Labs 02, 03, 04 y 05 está lista para automatizar su ciclo de despliegue con Azure DevOps — de DEV a TEST a PROD, con Solution Checker y aprobaciones.

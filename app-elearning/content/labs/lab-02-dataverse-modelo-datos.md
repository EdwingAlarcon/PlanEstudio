---
id: lab-02
title: "Dataverse — Modelado de Datos para un Sistema de Solicitudes"
level: "N1"
duration: "90 min"
product: ["Dataverse", "Power Apps"]
certifications: ["PL-900"]
role: ["Maker", "Developer"]
prerequisites:
  - "Ambiente Developer activo en make.powerapps.com"
  - "Módulo 1 completado — entorno configurado"
files: []
---

# Lab 02 — Dataverse: Modelo de Datos para un Sistema de Solicitudes Internas

## Objetivo

Al finalizar este laboratorio podrás diseñar e implementar un modelo de datos relacional en Dataverse con tablas personalizadas, columnas tipadas, relaciones 1:N y N:N, Business Rules y vistas, dentro de una solución correctamente empaquetada.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — consultoría de TI, 85 empleados, México

**Problema a resolver:** El área de soporte interno registra las solicitudes de sus empleados en un Excel compartido. No hay control de asignación, las prioridades se cambian sin criterio y es imposible generar métricas de tiempo de resolución por categoría.

**Por qué Dataverse:** Las tablas relacionales con ownership por usuario, Business Rules ejecutadas en el servidor y la integración nativa con Power Apps y Power Automate eliminan la hoja de cálculo sin necesitar código.

## Lo que vas a construir

- **Tabla `sit_solicitud`:** registro principal de cada solicitud con estado, prioridad, fechas y vínculos a solicitante y responsable
- **Tabla `sit_categoria`:** catálogo de categorías con SLA en horas
- **Relación 1:N** entre `sit_categoria` → `sit_solicitud`
- **Business Rules** que validan estado y auto-calculan SLA
- **3 vistas** personalizadas para los distintos roles del equipo de soporte

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Crear Solution y Publisher | 10 min |
| Ejercicio 2 — Tablas y columnas | 30 min |
| Ejercicio 3 — Business Rules | 15 min |
| Ejercicio 4 — Vistas personalizadas | 15 min |
| Ejercicio 5 — Datos de prueba | 20 min |
| **Total** | **90 min** |

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Microsoft Dataverse (tablas, columnas, relaciones, Business Rules, vistas)
- Power Platform Admin Center
- make.powerapps.com

## Prerrequisitos

### Entorno

- [ ] Licencia Microsoft 365 Developer o Power Apps Developer Plan activa
- [ ] Acceso confirmado a [make.powerapps.com](https://make.powerapps.com)
- [ ] Ambiente de tipo **Developer** creado (nunca usar el ambiente Default de producción)
- [ ] Rol **System Customizer** o **System Administrator** en el ambiente

### Conocimiento previo

- Módulo 1 completado: conceptos de Power Platform y primer contacto con Dataverse
- Comprensión básica de bases de datos relacionales (tablas, filas, columnas)

### Verificación rápida antes de empezar

En [make.powerapps.com](https://make.powerapps.com), el selector de ambiente en la esquina superior derecha debe mostrar tu ambiente Developer, **no** el ambiente Default.

---

## Datos de apoyo

Usa exactamente estos valores durante el laboratorio para garantizar coherencia con Labs posteriores (03, 05, 09).

### Empresa del escenario

| Campo | Valor |
|---|---|
| Nombre empresa | Servicios Integrados Tecnológicos S.A. |
| Abreviación | SIT |
| Prefijo de publisher | `sit_` |
| Nombre del publisher | `SIT Publisher` |
| Nombre de la solución | `SIT_SolicitudesInternas` |

### Datos de prueba — Categorías

| Nombre | Descripción | SLA (horas) |
|---|---|---|
| Hardware | Equipos de cómputo, periféricos, impresoras | 48 |
| Software | Instalación, licencias, errores de aplicaciones | 24 |
| Red y Conectividad | VPN, Wi-Fi, accesos remotos | 8 |
| Accesos y Seguridad | Cuentas, contraseñas, permisos | 4 |
| Otro | Solicitudes que no encajan en categorías anteriores | 72 |

### Datos de prueba — Solicitudes (crear al final del lab)

| Título | Categoría | Prioridad | Estado |
|---|---|---|---|
| Pantalla sin señal en oficina 3 | Hardware | Media | Nueva |
| Sin acceso a sistema contable | Software | Alta | Nueva |
| VPN caída para equipo remoto | Red y Conectividad | Crítica | Nueva |
| Nuevo ingreso requiere credenciales | Accesos y Seguridad | Alta | Nueva |
| Solicitar silla ergonómica | Otro | Baja | Nueva |
| Error al abrir Excel con macros | Software | Media | En Proceso |
| Impresora offline piso 2 | Hardware | Media | Nueva |
| Acceso a carpeta de proyectos | Accesos y Seguridad | Alta | Nueva |
| Internet lento desde ayer | Red y Conectividad | Alta | En Proceso |
| Licencia de Adobe vencida | Software | Crítica | Nueva |

## Arquitectura del laboratorio

```
Solution: SIT_SolicitudesInternas
│
├── Table: sit_Categoria (catálogo)
│   ├── sit_nombre (Primary Name Column)
│   ├── sit_descripcion
│   └── sit_sla_horas
│
└── Table: sit_Solicitud
    ├── sit_titulo (Primary Name Column)
    ├── sit_descripcion
    ├── sit_categoria    → Lookup a sit_Categoria (1:N)
    ├── sit_prioridad    (Choice: Baja/Media/Alta/Crítica)
    ├── sit_estado       (Choice: Nueva/En Proceso/Resuelta/Cerrada)
    ├── sit_fecha_solicitud
    ├── sit_fecha_resolucion
    ├── sit_sla_horas    (Número — calculado por Business Rule)
    ├── sit_solicitante  → Lookup a Contact
    └── sit_asignado     → Lookup a SystemUser (User)
```

---

## Ejercicio 1 — Crear Solution y Publisher

> **Qué vas a hacer:** Crear el contenedor de la solución con tu propio Publisher antes de tocar cualquier tabla. Esto garantiza que todos tus artefactos usen el prefijo `sit_` en lugar del genérico `new_`.
> **Duración:** 10 min

### Tarea 1.1 — Crear el Publisher

1. En [make.powerapps.com](https://make.powerapps.com), selecciona tu ambiente **Developer** en el selector superior derecho.

2. En el menú lateral, haz clic en **Soluciones**.

3. Haz clic en **+ Nueva solución** (esquina superior izquierda).

4. En el panel que aparece, haz clic en **+ Nuevo publisher** (dentro del campo Publisher).

5. Completa los datos del publisher:

   | Campo | Valor |
   |---|---|
   | Nombre de visualización | SIT Publisher |
   | Nombre | SITPublisher |
   | Prefijo | sit |
   | Prefijo de valor de elección | 10000 |

6. Haz clic en **Guardar**.

   > ⚠️ **El prefijo `sit_` es permanente.** Una vez que lo uses para crear tablas o columnas, no se puede cambiar sin eliminar y recrear los objetos. Verifica que sea exactamente `sit` (3 letras, minúsculas).

### Tarea 1.2 — Crear la Solution

1. De vuelta en el diálogo de nueva solución, completa:

   | Campo | Valor |
   |---|---|
   | Nombre de visualización | SIT Solicitudes Internas |
   | Nombre | SIT\_SolicitudesInternas |
   | Publisher | SIT Publisher (el que acabas de crear) |
   | Versión | 1.0.0.0 |

2. Haz clic en **Crear**.

3. La solución aparece en la lista. Haz clic en ella para abrirla — estará vacía.

### Resultado esperado del Ejercicio 1

La solución `SIT_SolicitudesInternas` está abierta y lista. El breadcrumb superior muestra `Soluciones > SIT Solicitudes Internas`.

### Validación del Ejercicio 1

- [ ] La solución existe en la lista de Soluciones del ambiente
- [ ] El publisher muestra prefijo `sit` (verificable al editar la solución)
- [ ] La solución está vacía (0 componentes) — aún no has agregado tablas

---

## Ejercicio 2 — Crear las tablas y columnas

> **Qué vas a hacer:** Diseñar las dos tablas del modelo (catálogo de categorías y solicitud principal) con todas sus columnas y la relación entre ellas.
> **Duración:** 30 min

### Tarea 2.1 — Crear la tabla `sit_Categoria`

1. Dentro de la solución `SIT_SolicitudesInternas`, haz clic en **+ Nuevo** → **Tabla** → **Tabla**.

2. En la pestaña **Propiedades**, completa:

   | Campo | Valor |
   |---|---|
   | Nombre de visualización | Categoria |
   | Nombre plural | Categorias |
   | Tipo de propiedad principal | Texto |
   | Nombre de columna principal (visualización) | Nombre |

3. Expande **Opciones avanzadas** y verifica:
   - Ownership: **Organization** (un catálogo es de la organización, no de usuarios individuales)
   - Habilitar para actividades: **No**

4. Haz clic en **Guardar**.

5. Con la tabla abierta, haz clic en la pestaña **Columnas** → **+ Nueva columna** para agregar:

   | Nombre visual | Tipo | Requerido | Notas |
   |---|---|---|---|
   | Descripcion | Texto (multilinea) | Opcional | — |
   | SLA Horas | Número entero | Requerido | Mínimo: 1, Máximo: 240 |

6. Guarda cada columna con el botón **Guardar**.

   > **¿Por qué Organization ownership para el catálogo?** Las tablas con Organization ownership no tienen registros "de un usuario" — cualquier usuario con el rol correcto puede ver todos los registros. Ideal para catálogos. Las tablas con User/Team ownership permiten filtrar "mis registros".

### Tarea 2.2 — Crear la tabla `sit_Solicitud`

1. Dentro de la solución, haz clic en **+ Nuevo** → **Tabla** → **Tabla**.

2. Completa:

   | Campo | Valor |
   |---|---|
   | Nombre de visualización | Solicitud |
   | Nombre plural | Solicitudes |
   | Nombre de columna principal | Titulo |
   | Ownership | User or team |

3. Haz clic en **Guardar**, luego ve a la pestaña **Columnas** y agrega:

   | Nombre visual | Nombre lógico (autogenerado) | Tipo | Requerido |
   |---|---|---|---|
   | Descripcion | `sit_descripcion` | Texto (multilinea) | Sí |
   | Prioridad | `sit_prioridad` | Elección | Sí |
   | Estado | `sit_estado` | Elección | Sí |
   | Fecha Solicitud | `sit_fechasolicitud` | Fecha y hora | Sí |
   | Fecha Resolucion | `sit_fecharesolucion` | Solo fecha | No |
   | SLA Horas | `sit_slahoras` | Número entero | No |

4. Para la columna **Prioridad**, configura las opciones de elección:

   | Etiqueta | Valor (auto) |
   |---|---|
   | Baja | (automático) |
   | Media | (automático) — **valor por defecto** |
   | Alta | (automático) |
   | Crítica | (automático) |

5. Para la columna **Estado**, configura:

   | Etiqueta | Valor (auto) |
   |---|---|
   | Nueva | (automático) — **valor por defecto** |
   | En Proceso | (automático) |
   | Resuelta | (automático) |
   | Cerrada | (automático) |

### Tarea 2.3 — Crear relaciones (Lookups)

Las columnas de tipo **Lookup** crean automáticamente una relación 1:N entre dos tablas.

1. En la tabla `sit_Solicitud` → pestaña **Columnas** → **+ Nueva columna**:

   | Columna | Tipo | Tabla relacionada | Requerido |
   |---|---|---|---|
   | Categoria | Lookup | Categoria | Sí |
   | Solicitante | Lookup | Contact | No |

   > Para el tipo Lookup, selecciona **Búsqueda** en el tipo de datos, luego elige la tabla relacionada.

2. Para el Lookup a **SystemUser** (el usuario asignado):
   - Agrega columna: nombre visual `Asignado A`, tipo **Lookup**, tabla relacionada: **Usuario (systemuser)**.

   > ⚠️ La tabla SystemUser es especial: búscala como "Usuario" en el selector. No crees una tabla propia de usuarios — Dataverse ya la tiene.

3. Guarda cada columna.

### Resultado esperado del Ejercicio 2

La tabla `sit_Solicitud` tiene 9 columnas personalizadas más la columna `sit_titulo` principal. En la pestaña **Relaciones** se ven 3 relaciones: Contact, Categoria, y SystemUser.

### Validación del Ejercicio 2

- [ ] Tabla `sit_Categoria` existe con columnas `sit_nombre`, `sit_descripcion`, `sit_slahoras`
- [ ] Tabla `sit_Solicitud` existe con 9 columnas personalizadas
- [ ] Las columnas `sit_prioridad` y `sit_estado` muestran las opciones de elección configuradas
- [ ] El Lookup `sit_categoria` aparece en la pestaña Relaciones de `sit_Solicitud`

---

## Ejercicio 3 — Business Rules

> **Qué vas a hacer:** Agregar dos Business Rules que se ejecutan en el servidor: una que requiere la fecha de resolución al cerrar, y otra que valida que Crítica solo la asigne el supervisor.
> **Duración:** 15 min

### Tarea 3.1 — Regla: Fecha de resolución obligatoria al resolver

1. En la tabla `sit_Solicitud`, haz clic en la pestaña **Reglas de negocio** → **+ Nueva regla de negocio**.

2. El diseñador visual se abre. Haz clic en **Condición** (el primer nodo azul):
   - Haz clic en el símbolo `+` del canvas para agregar una condición
   - **Columna:** Estado
   - **Operador:** Es igual a
   - **Tipo:** Valor
   - **Valor:** Resuelta

3. En la rama **Verdadero**, agrega una acción **Requerir campo**:
   - **Columna:** Fecha Resolucion
   - El campo se vuelve obligatorio solo cuando el estado es Resuelta

4. En la misma rama, agrega una acción **Mostrar mensaje de error**:
   - **Columna:** Fecha Resolucion
   - **Mensaje:** `Debe ingresar la fecha de resolución antes de cerrar la solicitud.`

5. En la esquina superior derecha del diseñador, cambia el **Ámbito** de "Solo entidad" a **Entidad** (se ejecuta tanto en formularios como en API).

6. Haz clic en **Guardar**, luego en **Activar**.

### Tarea 3.2 — Regla: Bloquear edición de solicitudes cerradas

1. Nueva regla de negocio en `sit_Solicitud`.

2. Condición: **Estado es igual a Cerrada**.

3. En la rama Verdadero, agrega acción **Bloquear campo** para cada columna que no deba editarse:
   - Bloquear: `sit_titulo`
   - Bloquear: `sit_prioridad`
   - Bloquear: `sit_categoria`

4. Ámbito: **Entidad**. Guardar y Activar.

   > **¿Por qué no bloquear estado también?** Necesitas poder cambiar de "Cerrada" a otro estado si fue un error. Bloquear el estado atraparía el registro permanentemente.

### Resultado esperado del Ejercicio 3

En la pestaña **Reglas de negocio** de `sit_Solicitud` aparecen 2 reglas con estado **Activo**.

### Validación del Ejercicio 3

- [ ] Regla "Fecha resolución obligatoria" está activa
- [ ] Regla "Bloquear campos en Cerrada" está activa
- [ ] Al probar en un formulario: cambiar estado a "Resuelta" sin fecha genera el mensaje de error
- [ ] Al probar en un formulario: cambiar estado a "Cerrada" bloquea Título, Prioridad y Categoría

---

## Ejercicio 4 — Vistas personalizadas

> **Qué vas a hacer:** Crear 3 vistas con filtros y columnas distintas para los tres roles que usarán el sistema.
> **Duración:** 15 min

### Tarea 4.1 — Vista "Solicitudes abiertas de mi equipo"

Esta vista es para el supervisor de soporte.

1. En la tabla `sit_Solicitud` → pestaña **Vistas** → **+ Nueva vista**.

2. Nombre: `Solicitudes Abiertas del Equipo`.

3. Configura las columnas visibles (en este orden):
   `Titulo` | `Categoria` | `Prioridad` | `Estado` | `Asignado A` | `Fecha Solicitud`

4. Agrega filtro:
   - Estado **No es igual a** Cerrada
   - **Y** Estado **No es igual a** Resuelta

5. Ordenar por: **Prioridad Descendente**, luego **Fecha Solicitud Ascendente**.

6. Haz clic en **Guardar y publicar**.

### Tarea 4.2 — Vista "Mis solicitudes activas"

Esta vista es para el empleado solicitante.

1. Nueva vista: `Mis Solicitudes Activas`.

2. Columnas: `Titulo` | `Categoria` | `Prioridad` | `Estado` | `Fecha Solicitud` | `SLA Horas`

3. Filtro:
   - Estado **No es igual a** Cerrada
   - **Y** Solicitante **Es igual a** `[Current User]` (usa la opción de valor dinámico)

4. Ordenar: **Fecha Solicitud Descendente**.

5. Guardar y publicar.

### Tarea 4.3 — Vista "Críticas sin asignar"

Esta vista es para el jefe de soporte para acción inmediata.

1. Nueva vista: `Críticas Sin Asignar`.

2. Columnas: `Titulo` | `Descripcion` | `Solicitante` | `Fecha Solicitud`

3. Filtro:
   - Prioridad **Es igual a** Crítica
   - **Y** Estado **Es igual a** Nueva
   - **Y** Asignado A **No contiene datos**

4. Ordenar: **Fecha Solicitud Ascendente** (más antigua primero).

5. Guardar y publicar.

### Validación del Ejercicio 4

- [ ] Las 3 vistas aparecen publicadas en la pestaña **Vistas** de `sit_Solicitud`
- [ ] Cada vista muestra las columnas configuradas al previsualizarla

---

## Ejercicio 5 — Datos de prueba

> **Qué vas a hacer:** Poblar el modelo con los registros de la sección "Datos de apoyo" para validar que Business Rules y vistas funcionan correctamente.
> **Duración:** 20 min

### Tarea 5.1 — Crear registros de Categoria

1. En la solución, haz clic en la tabla `sit_Categoria`.

2. Ve a la pestaña **Datos** (o desde el menú principal: **Tablas** → `sit_Categoria` → **Editar**).

3. Agrega los 5 registros de la tabla "Datos de prueba — Categorías" de la sección de apoyo.

   > Si no ves el botón "+ Nuevo registro", verifica que estás en la pestaña **Datos** y no en Columnas.

### Tarea 5.2 — Crear registros de Solicitud

1. Repite el proceso para la tabla `sit_Solicitud`.

2. Agrega los 10 registros de la tabla "Datos de prueba — Solicitudes".

3. Para cada registro, selecciona la Categoría correspondiente del Lookup (usará los registros creados en 5.1).

4. Deja los campos Solicitante y Asignado A vacíos por ahora (se asignan en Labs posteriores).

### Tarea 5.3 — Probar las Business Rules

1. Abre cualquier solicitud con Estado = "En Proceso".

2. Cambia el Estado a **Resuelta** y haz clic en **Guardar** sin llenar la Fecha Resolución.

   **Resultado esperado:** aparece el mensaje `Debe ingresar la fecha de resolución...`

3. Llena la Fecha Resolución con la fecha de hoy y guarda.

   **Resultado esperado:** el registro se guarda correctamente.

4. Cambia ahora el Estado a **Cerrada** y guarda.

   **Resultado esperado:** los campos Titulo, Prioridad y Categoría quedan bloqueados (solo lectura).

### Validación del Ejercicio 5

- [ ] 5 registros de Categoría visibles en la tabla
- [ ] 10 registros de Solicitud creados con datos variados
- [ ] La Business Rule de Fecha Resolución dispara el error correctamente
- [ ] La Business Rule de bloqueo en Cerrada funciona correctamente

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El prefijo de mis columnas es `new_` en lugar de `sit_` | Creaste las tablas fuera de la solución o con el publisher por defecto | Elimina las tablas y recréalas dentro de la solución con SIT Publisher |
| No veo la tabla `sit_Solicitud` en el selector de Lookup | La tabla aún no fue agregada a la solución o tiene error de guardado | En la solución, verifica que ambas tablas aparecen como componentes |
| El botón "Activar" en Business Rules está deshabilitado | La regla tiene un error de configuración (p. ej., falta la condición) | Revisa que la condición y al menos una acción estén configuradas |
| No puedo cambiar Ownership después de crear la tabla | Ownership es inmutable una vez que existen registros | Si no hay registros, elimina y recrea la tabla con el Ownership correcto |
| Las vistas no muestran el filtro de "Current User" | La opción de valor dinámico no se seleccionó — se ingresó como texto estático | Edita la vista, en el filtro usa el ícono de usuario dinámico, no escribas el email |
| Error "No tiene privilegios suficientes" al crear tablas | El rol del usuario no incluye Create para tablas personalizadas | El System Administrator debe asignarte el rol System Customizer o System Administrator |

---

## Checklist final

- [ ] Publisher `SIT Publisher` con prefijo `sit` creado
- [ ] Solución `SIT_SolicitudesInternas` creada y todas las tablas dentro de ella
- [ ] Tabla `sit_Categoria` con columnas `sit_descripcion` y `sit_slahoras`
- [ ] Tabla `sit_Solicitud` con 9 columnas personalizadas (incluyendo 3 Lookups)
- [ ] Columnas de Elección `sit_prioridad` y `sit_estado` con todas sus opciones
- [ ] 2 Business Rules activas en `sit_Solicitud`
- [ ] 3 Vistas publicadas con filtros y columnas correctas
- [ ] 5 registros de Categoría creados
- [ ] 10 registros de Solicitud creados con datos variados
- [ ] Business Rules probadas manualmente con resultado correcto

---

## Reto adicional

Si completaste el laboratorio antes del tiempo estimado, intenta:

**Reto básico:** Agrega una columna **Rollup** en `sit_Categoria` que cuente cuántas solicitudes activas (Estado ≠ Cerrada, ≠ Resuelta) tiene cada categoría. Llámala `sit_solicitudes_activas`.

**Reto intermedio:** Crea una columna **Calculada** en `sit_Solicitud` llamada `sit_dias_abierta` de tipo número entero que calcule `HOY() - sit_fechasolicitud` en días. Úsala en una cuarta vista "Solicitudes Antiguas" que filtre las solicitudes abiertas con más de 7 días.

**Reto avanzado:** Crea una tercera tabla `sit_Comentario` con columnas `sit_texto`, `sit_fecha` y un Lookup a `sit_Solicitud`. Configura una relación 1:N (una solicitud puede tener muchos comentarios). Esta tabla se usará en el Lab 03 para agregar comentarios desde la Canvas App.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre **Organization ownership** y **User/Team ownership** en una tabla de Dataverse?
2. ¿Por qué se recomienda crear siempre los objetos personalizados dentro de una **Solución** con Publisher propio?
3. ¿En qué etapa del pipeline se ejecuta una **Business Rule** con ámbito "Entidad"?
4. ¿Cuál es la diferencia entre una columna **Calculada** y una columna **Rollup** en Dataverse?

---

## Limpieza del laboratorio

> Realiza estos pasos solo si estás usando un ambiente compartido. Si es tu ambiente Developer personal, conserva los datos — el Lab 03 los usará.

1. Ve a cada tabla (`sit_Solicitud` y `sit_Categoria`) → pestaña **Datos** → selecciona todos los registros → **Eliminar registros**.
2. **No elimines las tablas ni la solución** — se necesitan en los Labs 03 y 05.

---

## Siguiente laboratorio recomendado

➡️ **Lab 03 — Primera Canvas App: Gestión de Solicitudes**

**Por qué ir ahí:** El modelo de datos que acabas de crear es exactamente el datasource que usarás en la Canvas App del Lab 03. Construirás la interfaz de usuario sobre las tablas `sit_Solicitud` y `sit_Categoria`.

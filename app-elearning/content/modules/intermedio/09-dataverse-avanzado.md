---
moduleId: 9
title: "Dataverse Avanzado"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 9
slug: "dataverse-avanzado"
---
### 🎯 Objetivo
Diseñar modelos de datos empresariales complejos en Dataverse: relaciones polimórficas, columnas calculadas y rollup, reglas de negocio avanzadas, seguridad a nivel de campo, y auditoría completa de datos.

### 📖 Conceptos Clave
- **Tipos de relaciones:** Dataverse soporta cuatro patrones: 1:N (padre-hijo, ej. Proyecto → Tareas), N:N nativa (tabla de intersección gestionada automáticamente por la plataforma), N:N manual (tabla de intersección propia con columnas adicionales, ej. `sit_oportunidad_etiqueta` con campo `sit_relevancia`), y Polimórfica (un Lookup que puede apuntar a múltiples tablas, como el campo `sit_referencia` que acepta Cuenta o Contacto). Las relaciones definen el comportamiento en cascada (Cascade) para operaciones de Asignar, Compartir, Eliminar y Desactivar.

- **Columnas calculadas:** campo de solo lectura en Dataverse cuyo valor se calcula en el servidor y se **almacena en la base de datos** cuando el registro se guarda o sus dependencias cambian. Utiliza sintaxis clásica de expresiones (no Power Fx). Son filtrables y buscables en FetchXML precisamente porque persisten su valor. Ejemplo: `sit_costo` en tabla Tarea calculado como `sit_horas_reales * sit_tarifa_hora`. Diferencia clave vs Formula columns (Power Fx): las Formula columns se calculan on-the-fly sin persistencia y no son filtrables directamente en OData. Diferencia clave vs Rollup: las Calculadas solo referencian campos del mismo registro o padre mediante RELATED.

- **Columnas Rollup:** campo de solo lectura en Dataverse que agrega automáticamente valores desde registros hijos relacionados (Sum, Count, Min, Max, Avg). Se recalculan mediante dos system jobs: el job incremental recurrente corre **cada 1 hora** para mantener los valores al día; el job de recálculo masivo (Mass Calculate) corre una sola vez ~12 horas después de crear o modificar la definición de la columna. También se puede forzar el recálculo de forma inmediata al abrir el registro padre. Diferencia clave vs Columnas Calculadas: Rollup atraviesa relaciones 1:N, mientras que Calculadas solo usan campos del mismo registro. Soportan filtros sobre los registros hijos (ej. solo sumar tareas con estado=Completada). Ejemplo: `sit_costoreal` en tabla Proyecto suma el `sit_costo` de todas las Tareas relacionadas con estado=Completada.

- **Reglas de negocio:** lógica declarativa sin código que se configura visualmente en el diseñador de tablas y se ejecuta automáticamente en el formulario (cliente) y/o al guardar (servidor). Soportan acciones como: mostrar/ocultar campos, requerir/no requerir campos, bloquear campos, establecer valores, y mostrar mensajes de error. Tienen dos alcances: "Solo formulario" (solo en la UI) y "Entidad" (también en API y flujos). Ejemplo: regla que bloquea edición de `sit_presupuesto` cuando `sit_estado` = "Cancelado".

- **Business Process Flow (BPF):** flujo visual de etapas que guía al usuario a través de un proceso de negocio multi-paso en un formulario Model-Driven. Cada etapa tiene pasos (campos obligatorios o recomendados) y puede incluir acciones (cambiar estado, llamar flujo). Se almacena como un registro en una tabla específica del BPF. Puede abarcar múltiples tablas (ej. Prospecto → Oportunidad → Pedido). Soporta hasta 30 etapas y puede tener ramas condicionales.

- **Seguridad a nivel de campo (Field Security Profile):** mecanismo que restringe la visibilidad y edición de columnas específicas independientemente del Security Role de la tabla. Se configura en tres niveles: lectura, creación y actualización. Los perfiles son aditivos: si un usuario tiene dos perfiles y uno permite lectura, puede leer. Se asignan a usuarios individuales o a equipos (Teams). Ejemplo: perfil `Perfil Financiero Proyecto` que permite lectura pero prohíbe escritura en `sit_presupuesto` para el rol Jefe de Proyecto.

- **Auditoría de Dataverse:** sistema de registro automático que captura quién cambió qué campo, cuándo y desde qué valor a qué valor. Se activa por ambiente y luego por tabla y columna. Los registros de auditoría se almacenan en la tabla `Audit` del sistema y son accesibles desde el formulario (historial de auditoría) y desde el Admin Center. Indispensable para trazabilidad en tablas financieras, RR.HH. y cumplimiento regulatorio. Considerar el impacto en almacenamiento: los logs de auditoría consumen capacidad.

- **Búsqueda de Dataverse (Relevance Search):** motor de búsqueda full-text basado en Azure Cognitive Search que indexa el contenido de múltiples tablas y permite búsquedas cross-tabla desde la barra de búsqueda global. Diferencia vs búsqueda rápida: Relevance Search busca en todos los campos indexados de múltiples tablas simultáneamente, es más rápida y soporta búsqueda difusa y por relevancia. Requiere configuración de qué columnas indexar por tabla. Puede tardar hasta 15 minutos en indexar nuevos datos.

- **Calculated vs Formula columns:** ambas producen valores derivados de solo lectura, pero difieren en la sintaxis y capacidades. Las Columnas Calculadas usan la sintaxis clásica de Dataverse (campo de fórmula en el diseñador) y son filtrables en FetchXML avanzado. Las Columnas de Fórmula (Formula columns) usan Power Fx (la misma sintaxis de Canvas Apps) y son más expresivas (soportan lógica condicional compleja, funciones de texto avanzadas), pero no son filtrables en consultas OData directas. Elegir Formula columns para lógica compleja; Calculated para columnas que necesitan ser criterio de filtro en vistas y flujos.

- **Duplicate Detection Rules:** reglas configurables que comparan campos de un registro nuevo o editado contra registros existentes para detectar posibles duplicados antes de guardar. Se definen mediante criterios de coincidencia (exacta, primeros N caracteres, mismos valores) sobre campos seleccionados. Se pueden activar en creación, actualización o importación masiva. El usuario recibe una advertencia y puede ignorarla o cancelar la operación. Ejemplo: regla que detecta duplicados de Cuenta cuando `sit_nit` es igual o cuando `sit_nombre` coincide en los primeros 10 caracteres.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 9.1: Modelo de datos para sistema de proyectos
1. Crear tabla `Proyecto` con columnas:
    - `sit_nombre` (Texto, requerido)
    - `sit_estado` (Elección: Planificación/En Curso/Completado/Cancelado)
    - `sit_fechainicio` (Fecha y hora)
    - `sit_fechafin` (Fecha y hora)
    - `sit_presupuesto` (Moneda)
    - `sit_costoreal` (Rollup — Sum de `sit_costo` de tabla Tarea)
    - `sit_porcentajeavance` (Decimal, calculada)
    - `sit_responsable` (Lookup a SystemUser)

2. Crear tabla `Tarea`:
    - `sit_titulo` (Texto, requerido)
    - `sit_proyecto` (Lookup a Proyecto — relación 1:N)
    - `sit_asignado` (Lookup a SystemUser)
    - `sit_estado` (Elección: Pendiente/En Progreso/Bloqueada/Completada)
    - `sit_horas_estimadas` (Número entero)
    - `sit_horas_reales` (Número entero)
    - `sit_costo` (Moneda, calculada: `sit_horas_reales * sit_tarifa_hora`)

3. Configurar columna Rollup `sit_costoreal` en Proyecto:
    - Función de agregación: Sum
    - Tabla relacionada: Tarea (vía sit_proyecto)
    - Campo a agregar: sit_costo
    - Filtro: Estado = Completada

4. Crear tabla `Etiqueta` y relación N:N con `Proyecto` (nativa):
    - En diseñador de tablas → Relaciones → Agregar relación → Muchos a muchos
    - Tabla relacionada: Etiqueta
    - Esto crea tabla de intersección automáticamente

#### Actividad 9.2: Reglas de negocio avanzadas
1. Abrir tabla `Proyecto` → Reglas de negocio → Nueva regla

2. **Regla 1: Validar fecha fin > fecha inicio**
   ```
   Condición: sit_fechafin <= sit_fechainicio
   Acción: Mostrar mensaje de error en sit_fechafin
   Mensaje: "La fecha de fin debe ser posterior a la fecha de inicio"
   Alcance: Entidad (se ejecuta en servidor también)
   ```

3. **Regla 2: Bloquear edición si está Cancelado**
   ```
   Condición: sit_estado == "Cancelado"
   Acción: Bloquear campo sit_presupuesto
   Acción: Bloquear campo sit_nombre
   Alcance: Entidad
   ```

4. **Regla 3: Requerir responsable si En Curso**
   ```
   Condición: sit_estado == "En Curso"
   Acción: Establecer campo sit_responsable como obligatorio
   ```

#### Actividad 9.3: Field Security Profile
1. Ir a make.powerapps.com → Configuración → Seguridad → Perfiles de seguridad de campo
2. Crear perfil `Perfil Financiero Proyecto`
3. Agregar la columna `sit_presupuesto` con permiso: Lectura=Permitido, Actualizar=No permitido
4. Agregar la columna `sit_costoreal` con permiso: Lectura=Permitido, Actualizar=No permitido
5. Asignar perfil a rol `Jefe de Proyecto`
6. Probar con usuario del rol: la columna aparece como solo lectura

#### Actividad 9.4: Business Process Flow — Ciclo de vida de Proyecto
1. Power Automate → Business Process Flow → Nuevo
2. Nombre: `Ciclo de Vida del Proyecto`
3. Tabla: Proyecto
4. Etapas:
    - **Etapa 1: Definición**
     - Paso: Nombre del proyecto (obligatorio)
     - Paso: Presupuesto (obligatorio)
     - Paso: Responsable
    - **Etapa 2: Planificación**
     - Paso: Fecha inicio
     - Paso: Fecha fin
    - **Etapa 3: Ejecución**
     - Paso: Estado = En Curso (acción)
    - **Etapa 4: Cierre**
     - Paso: Costo real validado

5. Activar y probar en formulario Model-Driven

#### Actividad 9.5: Auditoría de Dataverse
1. Admin Center → Entorno → Configuración → Auditoría
2. Activar: Habilitar auditoría, Auditar acceso de usuario
3. En la tabla Proyecto → Administrar columnas de auditoría → Seleccionar: sit_estado, sit_presupuesto, sit_responsable
4. Hacer cambios en un registro
5. Ver auditoría: en el formulario → botón "Auditar historial" (panel derecho)
6. También en Admin Center → Registros de auditoría

### 💼 Caso Real de Negocio
**Empresa:** Constructora con 50 proyectos activos simultáneos  
**Problema:** Los Project Managers cambian presupuestos sin aprobación, causando pérdidas.  
**Solución:** Modelo Dataverse con Field Security Profile que bloquea edición de presupuesto salvo a Director de Operaciones. Business Rule valida fechas. Rollup de costos actualizado cada hora para dashboard en tiempo real. Auditoría completa genera reporte mensual para Contraloría.  
**Resultado:** Reducción de incidentes de presupuesto en 80% en primer trimestre.

### ✅ Buenas Prácticas
- Prefijo de publisher consistente en todas las columnas (`sit_`, `sse_`, nunca `new_`)
- Rollup columns se actualizan cada 12h por defecto; forzar actualización con botón en formulario o con workflow recurrente
- Limitar reglas de negocio a menos de 10 por tabla para rendimiento óptimo
- Field Security Profiles son aditivos: el perfil más permisivo gana cuando hay múltiples
- Siempre activar auditoría en tablas financieras y de RR.HH. desde el inicio
- Formula columns (Power Fx) son más expresivas pero solo lectura y no filtrables en FetchXML avanzado

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Rollup no actualiza | Columna tiene dependencia circular | Revisar que la fórmula no referencie la misma tabla padre |
| Regla de negocio no dispara en servidor | Alcance = Solo formulario | Cambiar alcance a "Entidad" para que aplique en API/Flujos |
| N:N nativa no aparece en Power Automate | Limitación del conector | Usar tabla de intersección manual para mayor control |
| Error "Duplicate detected" inesperado | Regla de duplicados muy amplia | Revisar criterios de la regla en Configuración → Detección de duplicados |

### 🧪 Criterios de Validación
- [ ] Modelo de datos Proyecto-Tarea creado con relación 1:N
- [ ] Rollup `sit_costoreal` calcula correctamente la suma de tareas completadas
- [ ] Regla de negocio de validación de fechas bloquea el guardado con mensaje claro
- [ ] Field Security Profile aplicado: usuario sin perfil no puede editar presupuesto
- [ ] Business Process Flow de 4 etapas funciona en el formulario Model-Driven
- [ ] Auditoría registra cambios en sit_estado y sit_presupuesto

---

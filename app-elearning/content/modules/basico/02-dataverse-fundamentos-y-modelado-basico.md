---
moduleId: 2
title: "Dataverse - Fundamentos y Modelado Básico"
level: "basico"
certification: "PL-900"
estimatedMinutes: 5
slug: "dataverse-fundamentos-y-modelado-basico"
---
*Duración: 2-3 semanas*

#### 🎯 Objetivo
Dominar el modelado de datos en Dataverse para soportar aplicaciones de negocio.

#### 📖 Conceptos Clave
- **Tablas (Tables)**: Estándar vs Personalizadas, Virtual Tables
- **Columnas (Columns)**: Tipos de datos (Text, Number, Choice, Lookup, DateTime)
- **Relaciones (Relationships)**: One-to-Many, Many-to-One, Many-to-Many
- **Primary Name Column**: Campo principal de identificación
- **Ownership**: User/Team owned vs Organization owned
- **Publisher**: Prefijos de personalización
- **Soluciones**: Administradas vs No Administradas (introducción básica)
- **Auditoria**: Tracking de cambios en datos
- **Business Rules**: Lógica sin código

#### 👨‍💻 Actividades Prácticas

##### Práctica 2.1: Crear Tablas Personalizadas

*Caso: Sistema de Gestión de Solicitudes de TI*

1. **Crear tabla "Solicitud TI"**
    - Navegar a Tables > New table
    - Display name: `Solicitud TI`
    - Plural name: `Solicitudes TI`
    - Primary column: `Título de Solicitud` (Text)
    - Enable attachments: Sí
    - Ownership: User or team

2. **Agregar columnas personalizadas**:
   ```
    - Descripción (Multiline text)
    - Categoría (Choice): Hardware, Software, Red, Accesos, Otro
    - Prioridad (Choice): Baja, Media, Alta, Crítica
    - Estado (Choice): Nueva, En Proceso, Resuelta, Cerrada
    - Fecha Solicitud (Date and Time)
    - Fecha Resolución (Date Only)
    - Solicitante (Lookup → Contact)
    - Asignado a (Lookup → User)
   ```

3. **Configurar columnas**:
    - Marcar "Categoría" y "Estado" como Required (requeridas)
    - Configurar valor por defecto Estado = "Nueva"
    - Configurar valor por defecto Prioridad = "Media"

##### Práctica 2.2: Establecer Relaciones

1. **Relación One-to-Many**: Contact → Solicitudes TI
    - Una persona puede tener múltiples solicitudes
    - Ya creada al definir columna Lookup "Solicitante"
    - Revisar en tabla Contact > Relationships

2. **Crear tabla "Categoría Detallada"**
    - Columnas: Nombre, Descripción, SLA (Choice: 24h, 48h, 72h)
    - Relación: Categoría Detallada → Solicitudes TI (One-to-Many)

##### Práctica 2.3: Implementar Business Rules

*Regla 1: Auto-asignación de SLA según prioridad*

1. Abrir tabla "Solicitud TI" > Business rules > New
2. Condición: Si Prioridad = "Crítica"
3. Acción: Set Field Value → Campo personalizado "SLA Horas" = 4
4. Agregar condiciones para otras prioridades (Alta=8, Media=24, Baja=48)
5. Scope: All Forms

*Regla 2: Validación de fechas*

1. Nueva Business Rule
2. Condición: Si Estado = "Resuelta" y Fecha Resolución está vacía
3. Acción: Show Error Message → "Debe ingresar fecha de resolución"
4. Scope: All Forms

##### Práctica 2.4: Crear Vistas Personalizadas

1. **Vista: "Mis Solicitudes Abiertas"**
    - Filtro: Estado ≠ Cerrada AND Solicitante = Current User
    - Columnas: Título, Categoría, Prioridad, Estado, Fecha Solicitud
    - Orden: Prioridad DESC, Fecha Solicitud DESC

2. **Vista: "Solicitudes Pendientes Atención"**
    - Filtro: Estado = Nueva OR Estado = En Proceso
    - Columnas: Título, Solicitante, Categoría, Prioridad, Asignado a
    - Orden: Prioridad DESC

##### Práctica 2.5: Insertar Datos de Prueba

Crear manualmente 10 registros de Solicitudes con variedad de:

- Categorías diferentes
- Prioridades mixtas
- Estados variados
- Fechas distribuidas en últimos 30 días

#### 💼 Caso Real de Negocio

**Empresa:** Empresa de Logística TransCargo — 120 vehículos, flota propia  
**Problema:** Los activos de la empresa (vehículos, equipos de bodega, herramientas especializadas) se registraban en Excel. Asignaciones duplicadas, equipos prestados sin registro de devolución, sin historial de mantenimiento por activo. Al momento de una auditoría interna no podían demostrar quién tenía qué equipo ni en qué estado.  
**Consecuencia:** 3 camiones con seguros vencidos operando activos, costos de mantenimiento no atribuibles por unidad de negocio.

**Solución con Dataverse:**
- Tabla `sit_activo` con tipo, serial, estado (Disponible/Asignado/En Mantenimiento/Dado de Baja), fecha vencimiento seguro, valor
- Tabla `sit_asignacion` con Lookup a Activo y a Empleado, fechas de inicio y devolución, estado
- Tabla `sit_mantenimiento` con historial de intervenciones por activo
- Business Rule: bloquea asignación si el activo está en estado "En Mantenimiento" o "Dado de Baja"
- Vista "Seguros próximos a vencer" filtra activos con vencimiento en los próximos 30 días

**Resultados:**
- Control total de 120 vehículos y 340 equipos adicionales — trazabilidad completa en tiempo real
- Costo de mantenimiento atribuible por unidad: ahorro del 22% al identificar equipos con mantenimiento excesivo
- Cero activos en operación con documentación vencida desde la implementación

#### ✅ Buenas Prácticas

**Nomenclatura**:

- Nombres en español/inglés consistentes (elegir uno)
- Evitar espacios; usar guiones bajos: `Solicitud_TI`
- Publisher prefix: usar personalizado, no default `new_`

**Modelado**:

- Mantener tablas normalizadas (evitar redundancia)
- Usar Choices en lugar de strings para valores fijos
- Definir Required solo en campos críticos (mejor UX)
- Siempre establecer ownership correcta (impacta seguridad)

**Performance**:

- Limitar columnas en vistas (máx 8-10 visibles)
- Usar índices en columnas de filtrado frecuente
- Evitar Multiline text en primary column

**Documentación**:

- Agregar Description a cada tabla y columna personalizada
- Documentar propósito de Business Rules en Comments

#### ⚠️ Errores Comunes

1. **Error**: Crear columnas redundantes (ej: Full Name cuando existe First + Last Name)
    - **Solución**: Usar Calculated Columns o concatenar en Power Apps

2. **Error**: No definir Publisher antes de crear tablas
    - **Solución**: Crear Solution con Publisher personalizado primero

3. **Error**: Usar Text simple para listas desplegables
    - **Solución**: Siempre usar Choice (mejora integridad datos)

4. **Error**: Eliminar tablas estándar o modificar columnas del sistema
    - **Solución**: Extender con nuevas columnas, nunca modificar standard

5. **Error**: Relaciones circulares o mal diseñadas
    - **Solución**: Diagramar modelo antes de implementar, validar cardinalidad

#### 🧪 Criterios de Validación
- [ ] Tabla "Solicitud TI" con mínimo 7 columnas personalizadas creada
- [ ] 3+ relaciones establecidas y funcionales
- [ ] 2+ Business Rules implementadas y probadas
- [ ] 2+ vistas personalizadas configuradas
- [ ] 10+ registros de prueba con datos variados
- [ ] Explicar diferencia entre tabla Standard y Custom
- [ ] Describir cuándo usar One-to-Many vs Many-to-Many

---

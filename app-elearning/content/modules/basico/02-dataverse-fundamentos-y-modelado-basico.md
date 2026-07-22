---
moduleId: 2
title: "Dataverse - Fundamentos y Modelado Básico"
level: "basico"
certification: "PL-900"
estimatedMinutes: 15
slug: "dataverse-fundamentos-y-modelado-basico"
---
*Duración: 2-3 semanas · Lectura: 6-8 min · Con práctica: 40-60 min*

### 🎯 Objetivo
Dominar el modelado de datos en Dataverse para soportar aplicaciones de negocio.

### 📖 Conceptos Clave
- **Tablas (Tables)**: Estándar vs Personalizadas, Virtual Tables
- **Columnas (Columns)**: Tipos de datos (Text, Number, Choice, Lookup, DateTime)
- **Relaciones (Relationships)**: One-to-Many, Many-to-One, Many-to-Many — ejemplo simple: una `Categoría` (ej. "Software") puede tener muchas `Solicitudes` asociadas, pero cada `Solicitud` apunta a una sola `Categoría`:
  ```
  Categoria (1) ──── tiene muchas ────▶ (N) Solicitud
     "Software"                          "Sin acceso al sistema contable"
     "Hardware"                          "Impresora offline piso 2"
  ```
- **Primary Name Column**: Campo principal de identificación
- **Ownership**: quién es "dueño" de cada registro. *User/Team owned* = cada registro pertenece a una persona/equipo (útil para "mis solicitudes"). *Organization owned* = el registro es de todos, sin dueño individual (útil para catálogos como Categoría).
- **Publisher**: el "sello" con tu prefijo (ej. `sit_`) que marca que una tabla/columna es tuya y no del sistema — se crea una sola vez, antes de la primera tabla, y ya no se puede cambiar.
- **Soluciones**: Administradas vs No Administradas (introducción básica)
- **Auditoria**: Tracking de cambios en datos
- **Business Rules**: lógica sin código que corre en el servidor. El **scope** ("All Forms" vs "Solo entidad") define si la regla se aplica solo cuando alguien llena un formulario, o también cuando los datos llegan por otra vía (ej. una API).

### 👨‍💻 Actividades Prácticas

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

### 💼 Caso Real de Negocio

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

### ✅ Buenas Prácticas

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

### ⚠️ Errores Comunes

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

### 🧪 Criterios de Validación
- [ ] Tabla "Solicitud TI" con mínimo 7 columnas personalizadas creada
- [ ] 3+ relaciones establecidas y funcionales
- [ ] 2+ Business Rules implementadas y probadas
- [ ] 2+ vistas personalizadas configuradas
- [ ] 10+ registros de prueba con datos variados
- [ ] Explicar diferencia entre tabla Standard y Custom
- [ ] Describir cuándo usar One-to-Many vs Many-to-Many

### 📸 Evidencia para guardar
- Captura de las tablas creadas con sus columnas.
- Captura de al menos una Business Rule configurada.
- Captura de una vista personalizada con su filtro.
- Conteo de registros de prueba cargados.

## ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 02 · Dataverse — Modelado de Datos para un Sistema de Solicitudes](/labs/lab-02-dataverse-modelo-datos)**

**Por qué:** el Lab 02 te guía paso a paso a construir exactamente el modelo de datos de este módulo (tablas, columnas, relaciones, Business Rules y vistas), con instrucciones de clic-por-clic y valores exactos a usar — es la forma más directa de convertir lo que acabas de leer en algo real y verificable.

**Qué evidencia guardar del lab:** capturas de las tablas dentro de tu solución, de las 2 Business Rules activas, de las 3 vistas publicadas, y el conteo de registros de prueba (5 Categoría + 10 Solicitud).

---

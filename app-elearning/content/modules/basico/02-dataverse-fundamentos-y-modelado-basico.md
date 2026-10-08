---
moduleId: 2
title: "Dataverse - Fundamentos y Modelado Básico"
level: "basico"
certification: "PL-900"
estimatedMinutes: 15
slug: "dataverse-fundamentos-y-modelado-basico"
lastVerified: "2026-09"
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

> **Cómo está organizado este módulo:** alternas una idea corta, una práctica de pocos minutos y un dato real de tu propio ambiente. Los pasos de siempre (Práctica 2.1 a 2.5) siguen ahí, ahora dentro de tres bloques. Cierras con un reto en el que ya no te digo las tablas ni las columnas. Las microprácticas no necesitan tenant; las prácticas reales sí (tu ambiente Developer del Módulo 1).

## 🧩 Microlección 1 — Tablas y columnas: elegir el tipo correcto

**¿Qué vas a aprender?** Qué es una tabla, una columna y un registro, y cómo elegir el tipo de columna (texto, número, Choice, Lookup, fecha) según lo que el negocio necesita guardar.

**¿Por qué existe esto?** El tipo de una columna decide qué puedes hacer después con el dato: filtrarlo, ordenarlo, validarlo o ponerlo en un reporte. Una columna de texto donde iba un número o una lista fija parece funcionar el primer día y causa problemas al mes.

**Ejemplo pequeño:** "Prioridad" solo puede ser Baja, Media, Alta o Crítica, así que va como **Choice** (lista fija), no como texto libre donde cada persona escribiría algo distinto.

**Ahora haz algo — micropráctica (6 min):** **[Elegir tipo de columna](/practica/ip-dv-002-elegir-tipo-columna)**. Te da necesidades de negocio reales y te pide asignar el tipo de columna de Dataverse correcto a cada una.

**Práctica real en tu entorno (25 min):**

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

**Ahora diagnostica — micropráctica (6 min):** **[Corregir modelo incorrecto](/practica/ip-dv-003-corregir-modelo-incorrecto)**. Parte de un síntoma (una columna creada con el tipo equivocado) y te pide decidir la corrección segura antes de ver la solución.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre exacto de la tabla que creaste y su Primary column | ___ |
| Las 8 columnas con su tipo (por ejemplo, Prioridad = Choice) | ___ |
| Las dos columnas que marcaste como Required y los dos valores por defecto que configuraste | ___ |

---

## 🧩 Microlección 2 — Relaciones: cómo se conectan las tablas

**¿Qué vas a aprender?** Cuándo una relación es de uno a muchos y cuándo de muchos a muchos, y de qué lado vive el Lookup.

**¿Por qué existe esto?** En vez de repetir los datos de una categoría en cada solicitud, guardas la categoría una vez y la apuntas desde cada solicitud. Así, si la categoría cambia de nombre, cambia en un solo lugar.

**Ejemplo pequeño:** una `Categoría` tiene muchas `Solicitudes`, pero cada `Solicitud` apunta a una sola `Categoría`. El Lookup vive en el lado "muchos" (la Solicitud).

**Ahora haz algo — micropráctica (6 min):** **[Decidir cómo relacionar clientes y pedidos](/practica/ip-dv-001-relacion-cliente-pedidos)**. Te pide modelar la relación entre un cliente y sus pedidos y decidir de qué lado va el Lookup.

**Práctica real en tu entorno (20 min):**

##### Práctica 2.2: Establecer Relaciones

1. **Relación One-to-Many**: Contact → Solicitudes TI
    - Una persona puede tener múltiples solicitudes
    - Ya creada al definir columna Lookup "Solicitante"
    - Revisar en tabla Contact > Relationships

2. **Crear tabla "Categoría Detallada"**
    - Columnas: Nombre, Descripción, SLA (Choice: 24h, 48h, 72h)
    - Relación: Categoría Detallada → Solicitudes TI (One-to-Many)

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La relación que creaste: tabla "uno", tabla "muchos" y en qué tabla vive el Lookup | ___ |
| Cardinalidad que Dataverse muestra para esa relación (One-to-Many, Many-to-One o Many-to-Many) | ___ |
| Cuántas relaciones aparecen en la pestaña Relationships de la tabla Solicitud TI | ___ |

---

## 🧩 Microlección 3 — Reglas de negocio y vistas

**¿Qué vas a aprender?** Cómo una Business Rule hace cumplir una regla en el servidor sin código, y cómo una vista filtra y ordena los datos para quien los consulta.

**¿Por qué existe esto?** Las reglas evitan datos inválidos desde el origen (no dependen de que cada persona se acuerde), y las vistas muestran a cada rol solo lo que necesita ver, sin duplicar datos.

**Ejemplo pequeño:** "Si Estado = Resuelta y la fecha de resolución está vacía, muestra un error" es una regla; "solicitudes en Nueva o En Proceso" es una vista.

**Práctica real en tu entorno (30 min):** esta microlección no tiene micropráctica propia; la verificación es probar tu regla con un registro real y anotar lo que pasa.

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

**Evidencia a reportar (lo que viste al probar, no solo que la configuraste):**

| Campo | Tu valor |
|---|---|
| Regla 1: valor que quedó en "SLA Horas" al crear una solicitud con Prioridad = Crítica | ___ |
| Regla 2: texto exacto del mensaje de error al marcar Resuelta sin Fecha Resolución | ___ |
| Cuántos registros ves en la vista "Solicitudes Pendientes Atención" frente al total de registros | ___ |

---

## 🔁 Reto de transferencia — El modelo de una biblioteca, sin pasos

Esta vez no te digo qué tablas ni columnas crear: aplica lo que viste a un negocio distinto.

> **Requerimiento:** una biblioteca de barrio presta libros y tabletas a sus socios. Hoy lo lleva en una hoja de cálculo y a veces presta el mismo libro a dos personas. Diseña el modelo de datos mínimo para que eso no pase.
> **Criterios de aceptación:** (1) defines al menos 3 tablas y, de cada una, sus columnas con el tipo correcto (usa Choice donde la lista sea fija); (2) indicas qué relaciones hay, de qué lado vive cada Lookup y si son de uno a muchos o de muchos a muchos; (3) incluyes una regla de negocio que impida prestar un ítem que ya está prestado.
> **Restricciones:** no puedes copiar el modelo de Solicitudes de TI; el negocio es otro y los nombres también. No necesitas tenant: puedes hacerlo en papel o en una nota, y construirlo después si quieres.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: una solicitud con varias categorías](/practica/ip-dv-007-transferir-categorias-multiples)**. Retoma el modelo de este módulo pero cambia un requisito, y te pide decidir qué cambia en la relación.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus tablas y, de cada una, sus columnas con el tipo elegido | ___ |
| Tus relaciones: tablas, de qué lado va el Lookup y cardinalidad | ___ |
| La regla de negocio que impide el préstamo doble y la condición exacta que usa | ___ |

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

1. **Lo que ves:** tienes el mismo dato guardado en dos columnas (por ejemplo Full Name y además First + Last Name) y a veces no coinciden.
    - **Causa probable:** columnas redundantes.
    - **Qué hacer:** usa Calculated Columns o concatena en Power Apps, en vez de guardar el dato dos veces.

2. **Lo que ves:** tus tablas y columnas aparecen con el prefijo `new_` o no puedes agruparlas con tu solución.
    - **Causa probable:** no definiste el Publisher antes de crear tablas.
    - **Qué hacer:** crea primero la Solution con un Publisher personalizado (por ejemplo `sit_`) y trabaja siempre dentro de ella.

3. **Lo que ves:** una lista que debería ser fija tiene variantes escritas a mano ("Alta", "alta", "ALTA") y los filtros no la agrupan.
    - **Causa probable:** usaste Text simple para una lista desplegable.
    - **Qué hacer:** usa Choice, que mejora la integridad de los datos.

4. **Lo que ves:** algo del sistema deja de comportarse como siempre después de que cambiaste una tabla o columna estándar.
    - **Causa probable:** eliminaste o modificaste tablas estándar o columnas del sistema.
    - **Qué hacer:** extiende con columnas nuevas; nunca modifiques lo estándar.

5. **Lo que ves:** no sabes de qué lado va el Lookup, o el modelo se enreda con relaciones que se apuntan entre sí.
    - **Causa probable:** relaciones circulares o mal diseñadas.
    - **Qué hacer:** diagrama el modelo antes de implementarlo y valida la cardinalidad de cada relación.

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

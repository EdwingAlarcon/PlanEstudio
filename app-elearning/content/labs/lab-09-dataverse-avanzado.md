---
id: lab-09
title: "Dataverse Avanzado — BPF, Rollup y Field Security"
level: "N2"
duration: "100 min"
product: ["Dataverse", "Power Apps Model-Driven"]
certifications: ["PL-200"]
role: ["Developer", "Maker"]
prerequisites:
  - "Lab 02 completado — tablas sit_Solicitud y sit_Categoria con datos"
  - "Módulo 9 estudiado: Dataverse Avanzado"
files: []
---

# Lab 09 — Dataverse Avanzado: Business Process Flow, Rollup y Field Security (SIT)

## Objetivo

Al finalizar este laboratorio podrás extender un modelo de datos existente con columnas Rollup y Calculadas, implementar Field Security Profiles para proteger datos sensibles, y diseñar un Business Process Flow (BPF) que guíe el ciclo de vida de una solicitud a través de etapas formales.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 02 y Lab 05

**Problema a resolver:** El modelo de datos básico del Lab 02 cubre el registro de solicitudes, pero el equipo de TI necesita:
1. **Métricas automáticas:** cuántas solicitudes activas tiene cada categoría (sin consultas manuales)
2. **Datos financieros protegidos:** el campo "costo estimado" de cada solicitud solo lo deben ver y editar Gerentes de TI — no los solicitantes ni los técnicos
3. **Proceso guiado:** los técnicos deben seguir etapas formales (Diagnóstico → Resolución → Cierre) con pasos obligatorios en cada etapa

**Por qué estas herramientas:**
- **Rollup columns:** agregan datos de tablas relacionadas en tiempo real sin necesitar DAX ni consultas adicionales
- **Field Security Profiles:** control de visibilidad y edición a nivel de campo, independiente del Security Role
- **Business Process Flow:** guía paso a paso visible en el formulario, con etapas que fuerzan completar campos antes de avanzar

## Lo que vas a construir

- **Columna Rollup** en `sit_Categoria`: contador de solicitudes activas por categoría
- **Columna Calculada** en `sit_Solicitud`: días transcurridos desde la fecha de solicitud
- **Field Security Profile** "Financiero TI" que protege la columna `sit_costo_estimado`
- **Business Process Flow** "Ciclo de Vida de Solicitud" con 4 etapas y pasos obligatorios

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Columnas Rollup y Calculadas | 25 min |
| Ejercicio 2 — Field Security Profile | 20 min |
| Ejercicio 3 — Business Process Flow | 35 min |
| Ejercicio 4 — Probar en formulario Model-Driven | 20 min |
| **Total** | **100 min** |

## Nivel

**N2 Intermedio** — Certificación objetivo: **PL-200**

## Tecnologías utilizadas

- Microsoft Dataverse (columnas Rollup, Calculadas, Field Security, BPF)
- Power Apps Model-Driven App (para probar el BPF)
- Power Platform Admin Center (seguridad)
- make.powerapps.com

## Prerrequisitos

### Entorno

- [ ] Tabla `sit_Solicitud` del Lab 02 con 10+ registros variados
- [ ] Tabla `sit_Categoria` con 5 registros de catálogo
- [ ] Rol **System Administrator** en el ambiente (el Field Security Profile requiere este rol)

### Conocimiento previo

- Lab 02 completado (el modelo de datos base)
- Diferencia entre columnas **Calculated** y **Rollup**
- Concepto de **Field Security Profile** vs **Security Role**

---

## Datos de apoyo

### Columnas nuevas a agregar en este lab

| Tabla | Nombre visual | Nombre lógico | Tipo | Notas |
|---|---|---|---|---|
| sit_Solicitud | Costo Estimado | `sit_costoestimado` | Moneda | Campo protegido con Field Security |
| sit_Solicitud | Dias Abierta | `sit_diasabierta` | Número entero (Calculada) | Calculada: días desde sit_fechasolicitud |
| sit_Categoria | Solicitudes Activas | `sit_solicitudesactivas` | Número entero (Rollup) | Rollup: Count de solicitudes activas |

### Etapas del Business Process Flow

| Etapa | Nombre | Pasos obligatorios |
|---|---|---|
| 1 | Registro | Categoría, Prioridad |
| 2 | Diagnóstico | Descripción detallada del diagnóstico (campo nuevo) |
| 3 | Resolución | Fecha resolución, Descripción de solución (campo nuevo) |
| 4 | Cierre | Estado = Resuelta o Cerrada, Costo estimado |

---

## Ejercicio 1 — Columnas Rollup y Calculadas

> **Qué vas a hacer:** Agregar dos tipos de columnas especiales: una Rollup que agrega datos de registros relacionados y una Calculada que computa un valor en tiempo real.
> **Duración:** 25 min

### Tarea 1.1 — Agregar la columna `sit_costoestimado`

Antes de crear el Rollup y la Calculada, agrega esta columna que usarás en los ejercicios siguientes:

1. En `sit_Solicitud` → **Columnas** → **+ Nueva columna**:
   - Nombre visual: `Costo Estimado`
   - Tipo: **Moneda**
   - Requerido: No (se hará requerido en el BPF)

2. Guarda.

### Tarea 1.2 — Columna Calculada: `sit_diasabierta`

1. En `sit_Solicitud` → **Columnas** → **+ Nueva columna**:
   - Nombre visual: `Dias Abierta`
   - Tipo: **Número entero**
   - Haz clic en **+ Calculada**

2. Se abre el editor de fórmulas de columna calculada. Haz clic en **Agregar condición** y luego **Agregar acción**:

3. En la sección **ACCIÓN** (la que define el valor):
   - Selecciona el campo `sit_diasabierta`
   - Operador: `=`
   - En el valor, usa la expresión:
     ```
     DIFFINDAYS(sit_fechasolicitud, NOW())
     ```

   > **DIFFINDAYS** es una función nativa de Dataverse en el editor de columnas calculadas. Calcula la diferencia en días entre dos fechas. `NOW()` retorna la fecha y hora actuales del servidor.

4. Guarda la columna. La fórmula se evalúa en tiempo real cada vez que se accede al registro.

   > ⚠️ Las columnas calculadas se recalculan al abrir el formulario o al consultarlas vía API, **no** en un cron job. Para cálculos que deben actualizarse aunque nadie abra el registro, usa columnas Rollup o Power Automate.

### Tarea 1.3 — Columna Rollup: `sit_solicitudesactivas` en Categoria

Esta columna en `sit_Categoria` contará automáticamente cuántas solicitudes con estado "Nueva" o "En Proceso" pertenecen a cada categoría.

1. En la tabla `sit_Categoria` → **Columnas** → **+ Nueva columna**:
   - Nombre visual: `Solicitudes Activas`
   - Tipo: **Número entero**
   - Haz clic en **+ Rollup**

2. Se abre el editor de Rollup. Configura:

   **Entidad relacionada:**
   - Entidad relacionada: `Solicitud (sit_Solicitud)`
   - Relación: la relación `sit_categoria_solicitud` (la que creaste en el Lab 02 via Lookup)

   **Función de agregación:**
   - Función: **COUNT** (contar registros)
   - Sin campo específico (solo cuenta filas)

   **Filtro (condición sobre los registros relacionados):**
   - Agrega condición: `sit_estado` **No es igual a** [valor numérico de Resuelta]
   - **Y** `sit_estado` **No es igual a** [valor numérico de Cerrada]

3. Guarda la columna.

4. El Rollup se recalcula automáticamente **cada hora** (o puedes forzarlo manualmente en el registro).

   > **¿Cómo forzar el recálculo?** Abre un registro de Categoría → en la columna Rollup aparece un ícono de recarga ↺ → haz clic para recalcular en el momento.

### Resultado esperado del Ejercicio 1

La tabla `sit_Solicitud` tiene la columna `sit_costoestimado` y `sit_diasabierta` (calculada). La tabla `sit_Categoria` tiene `sit_solicitudesactivas` (Rollup). Al abrir un registro de Categoría y hacer clic en ↺, se muestra el conteo de solicitudes activas.

### Validación del Ejercicio 1

- [ ] `sit_diasabierta` en `sit_Solicitud` muestra el número correcto de días al abrir un registro
- [ ] `sit_solicitudesactivas` en `sit_Categoria` muestra un número > 0 tras recalcular (verifica con la categoría que más solicitudes tenga)
- [ ] `sit_costoestimado` aparece en el formulario como campo de moneda editable

---

## Ejercicio 2 — Field Security Profile

> **Qué vas a hacer:** Crear un perfil de seguridad de campo que restringe quién puede ver y editar el campo `sit_costoestimado`, independientemente del Security Role del usuario.
> **Duración:** 20 min

### Tarea 2.1 — Crear el Field Security Profile

1. Ve a [make.powerapps.com](https://make.powerapps.com) → **Configuración** (ícono de engranaje ⚙️, esquina superior derecha) → **Configuración avanzada** → se abre el portal clásico.

2. En el portal clásico: **Configuración** (barra superior) → **Sistema** → **Seguridad** → **Perfiles de seguridad de campo**.

3. Haz clic en **Nuevo**:
   - **Nombre:** `FSP — Financiero TI`
   - **Descripción:** `Controla acceso al campo Costo Estimado en Solicitudes`

4. Guarda el perfil.

5. En el perfil guardado, ve a la sección **Permisos de campo** → clic en **+**:
   - **Nombre de campo:** busca `sit_costoestimado` (Costo Estimado)
   - **Permitir leer:** Sí
   - **Permitir actualizar:** Sí
   - **Permitir crear:** Sí

6. Guarda.

   > Este perfil **permite** el acceso al campo. Ahora necesitas habilitarlo en la columna y asignarlo a los usuarios correctos. Los usuarios **sin** este perfil no podrán ver ni editar el campo.

### Tarea 2.2 — Habilitar Field Security en la columna

1. Vuelve a [make.powerapps.com](https://make.powerapps.com) → tabla `sit_Solicitud` → columna `sit_costoestimado`.

2. En las propiedades de la columna, busca la sección **Seguridad del campo** y activa el toggle **Habilitar seguridad de campo**.

3. Guarda.

   > **Efecto inmediato:** al activar Field Security en la columna, todos los usuarios que no estén en el perfil dejan de ver y editar ese campo, incluso si son System Administrator. Asegúrate de asignarte a ti mismo al perfil en la siguiente tarea.

### Tarea 2.3 — Asignar usuarios al Field Security Profile

1. Vuelve al portal clásico → **Perfiles de seguridad de campo** → abre `FSP — Financiero TI`.

2. Ve a la pestaña **Usuarios** → clic en **+** → busca y agrega tu usuario.

3. Guarda.

### Tarea 2.4 — Verificar el comportamiento

1. En una ventana de navegación privada (o con otro usuario del tenant), intenta abrir un registro de `sit_Solicitud`.

   - **Con perfil asignado:** el campo Costo Estimado es visible y editable.
   - **Sin perfil asignado:** el campo no aparece en el formulario (completamente oculto).

   > Si no tienes un segundo usuario para probar, puedes verificar en los permisos de la columna: en make.powerapps.com → tabla `sit_Solicitud` → columna `sit_costoestimado` → verás que Field Security está habilitado.

### Validación del Ejercicio 2

- [ ] El Field Security Profile `FSP — Financiero TI` existe con permiso de leer/actualizar/crear para `sit_costoestimado`
- [ ] La columna `sit_costoestimado` tiene Field Security habilitado
- [ ] Tu usuario está en el perfil y puede ver el campo en el formulario

---

## Ejercicio 3 — Business Process Flow

> **Qué vas a hacer:** Crear un BPF de 4 etapas que guíe al técnico de soporte a través del ciclo de vida de una solicitud, con pasos obligatorios en cada etapa.
> **Duración:** 35 min

### Tarea 3.1 — Agregar columnas para el BPF

El BPF necesita dos columnas adicionales para los pasos de diagnóstico y solución:

1. En `sit_Solicitud`, agrega:
   - `sit_diagnostico`: Texto multilinea, Nombre visual: `Diagnóstico`
   - `sit_descripcion_solucion`: Texto multilinea, Nombre visual: `Descripción de Solución`

### Tarea 3.2 — Crear el Business Process Flow

1. En [make.powerapps.com](https://make.powerapps.com), desde el menú lateral ve a **Flujos** (o en la solución: **+ Nuevo** → **Automatización** → **Flujo de proceso de negocio**).

2. Completa:
   - **Nombre:** `Ciclo de Vida de Solicitud SIT`
   - **Tabla:** `Solicitud (sit_Solicitud)`

3. Haz clic en **Crear**. Se abre el diseñador visual de BPF.

### Tarea 3.3 — Diseñar las etapas

El diseñador muestra una línea horizontal con una etapa inicial. Configurarás 4 etapas en total.

**Etapa 1 — Registro:**

1. Haz clic en la primera etapa → **Propiedades**:
   - Nombre de etapa: `Registro`
   - Categoría: `Calificar`

2. Dentro de la etapa, agrega los pasos (campos obligatorios para avanzar):
   - Haz clic en **+ Agregar paso** dentro de la etapa
   - Paso 1: campo `sit_categoria` (Categoría), obligatorio: **Sí**
   - Paso 2: campo `sit_prioridad` (Prioridad), obligatorio: **Sí**

**Etapa 2 — Diagnóstico:**

1. Haz clic en **+** después de la Etapa 1 para agregar una nueva etapa:
   - Nombre: `Diagnóstico`
   - Categoría: `Desarrollar`

2. Pasos:
   - Paso 1: campo `sit_asignado` (Asignado A), obligatorio: **Sí**
   - Paso 2: campo `sit_diagnostico` (Diagnóstico), obligatorio: **Sí**

**Etapa 3 — Resolución:**

1. Agrega Etapa 3:
   - Nombre: `Resolución`
   - Categoría: `Proponer`

2. Pasos:
   - Paso 1: campo `sit_descripcion_solucion` (Descripción de Solución), obligatorio: **Sí**
   - Paso 2: campo `sit_fecharesolucion` (Fecha Resolución), obligatorio: **Sí**
   - Paso 3: campo `sit_costoestimado` (Costo Estimado), obligatorio: **No** (visible pero opcional)

**Etapa 4 — Cierre:**

1. Agrega Etapa 4 (última):
   - Nombre: `Cierre`
   - Categoría: `Cerrar`

2. Pasos:
   - Paso 1: campo `sit_estado` (Estado), obligatorio: **Sí**

### Tarea 3.4 — Activar el BPF

1. Haz clic en **Validar** (barra superior) — corrige cualquier error indicado.

2. Haz clic en **Activar**.

3. El BPF ahora aparece en la lista de flujos del ambiente.

   > Una vez activado, el BPF se mostrará automáticamente en la parte superior de cualquier formulario de `sit_Solicitud` en la Model-Driven App. Los registros existentes no inician el BPF automáticamente — solo los registros nuevos o los que lo activen manualmente.

### Validación del Ejercicio 3

- [ ] El BPF tiene exactamente 4 etapas con los pasos configurados
- [ ] El BPF está en estado Activo
- [ ] La columna `sit_diagnostico` y `sit_descripcion_solucion` existen en la tabla

---

## Ejercicio 4 — Probar en formulario Model-Driven

> **Qué vas a hacer:** Crear una Model-Driven App mínima para ver el BPF en acción y verificar el Field Security Profile.
> **Duración:** 20 min

### Tarea 4.1 — Crear la Model-Driven App

1. En la solución `SIT_SolicitudesInternas`, **+ Nuevo** → **App** → **Aplicación basada en modelo**.

2. Nombre: `SIT Gestión Solicitudes MDA`.

3. En el diseñador de la app, agrega una **Vista de tabla** para `sit_Solicitud`:
   - En el panel izquierdo → **+ Agregar página** → **Vista de tabla Dataverse**
   - Selecciona la tabla `sit_Solicitud`
   - Agrega también `sit_Categoria`

4. Haz clic en **Guardar y publicar**.

### Tarea 4.2 — Verificar el BPF

1. Abre la MDA publicada (botón **Reproducir** en el diseñador o desde make.powerapps.com → Aplicaciones).

2. Ve a **Solicitudes** → haz clic en **+ Nuevo** para crear un registro.

3. Observa la barra superior del formulario — debe mostrar las 4 etapas del BPF:
   `Registro → Diagnóstico → Resolución → Cierre`

4. Intenta avanzar a la Etapa 2 sin llenar Categoría o Prioridad:
   - Debes ver un mensaje que impide el avance hasta completar los pasos obligatorios.

5. Completa los campos de cada etapa y avanza por el flujo completo hasta Cierre.

### Tarea 4.3 — Verificar el Field Security Profile

1. En el formulario, observa si el campo **Costo Estimado** es visible (deberías verlo si tu usuario está en el `FSP — Financiero TI`).

2. Si tienes acceso a otro usuario del tenant sin el perfil asignado, inicia sesión con él y verifica que el campo no aparece.

### Resultado esperado del Ejercicio 4

El formulario de `sit_Solicitud` en la MDA muestra:
- El BPF en la barra superior con las 4 etapas
- El campo `sit_diasabierta` calculado automáticamente
- El campo `sit_costoestimado` visible solo para usuarios con el Field Security Profile

### Validación del Ejercicio 4

- [ ] El BPF aparece en el formulario de Solicitud en la MDA
- [ ] No es posible avanzar de Etapa 1 a Etapa 2 sin Categoría y Prioridad
- [ ] El campo `sit_diasabierta` muestra el número correcto de días en registros existentes
- [ ] El campo `sit_costoestimado` solo es visible al usuario con el FSP asignado

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El BPF no aparece en el formulario | La MDA usa un formulario que no tiene el BPF habilitado | En el diseñador de la MDA → formulario principal → verifica que el BPF esté habilitado para esa tabla |
| La columna Rollup siempre muestra 0 | La relación configurada en el Rollup es incorrecta | Verifica que usas la misma relación del Lookup `sit_categoria` — debe referenciar la tabla correcta |
| `DIFFINDAYS` da error en el editor | Se escribió en minúsculas o con argumento incorrecto | La función es `DIFFINDAYS(fechaInicial, fechaFinal)` — ambas deben ser columnas de tipo Fecha |
| El Field Security Profile no oculta el campo | La tabla no tiene Field Security habilitado en la columna | Ve a la columna → habilita "Seguridad del campo" — sin esto el perfil no tiene efecto |
| No veo la opción "Rollup" al crear la columna | La interfaz moderna no siempre muestra la opción | Usa el portal clásico: Configuración → Personalizaciones → Personalizar el sistema → tabla → columnas |

---

## Checklist final

- [ ] Columna `sit_costoestimado` (moneda) creada en `sit_Solicitud`
- [ ] Columna calculada `sit_diasabierta` muestra días correctos en registros existentes
- [ ] Columna Rollup `sit_solicitudesactivas` en `sit_Categoria` muestra conteo tras recalcular
- [ ] Field Security Profile `FSP — Financiero TI` creado y asignado a tu usuario
- [ ] La columna `sit_costoestimado` tiene Field Security habilitado
- [ ] BPF "Ciclo de Vida de Solicitud SIT" activo con 4 etapas
- [ ] El BPF aparece en el formulario de la MDA y bloquea avance sin campos obligatorios
- [ ] Las columnas de diagnóstico y solución visibles en los pasos del BPF

---

## Reto adicional

**Reto básico:** Agrega una quinta etapa al BPF llamada "Evaluación" después del Cierre, con un campo de tipo Elección `sit_calificacion_servicio` (valores: Malo / Regular / Bueno / Excelente) para que el solicitante evalúe el servicio.

**Reto intermedio:** Crea una segunda columna Rollup en `sit_Solicitud` llamada `sit_comentarios_total` que cuente los comentarios relacionados (si completaste el Reto Avanzado del Lab 02 creando la tabla `sit_Comentario`).

**Reto avanzado:** Crea un segundo Field Security Profile "FSP — Administración" que permita leer `sit_costoestimado` pero NO actualizar (solo lectura). Asígnaselo a un usuario de prueba y verifica que puede ver el campo pero no editarlo.

---

## Preguntas de repaso

1. ¿Cuándo se recalcula una columna **Calculada** vs una columna **Rollup**?
2. ¿En qué se diferencia un **Field Security Profile** de un **Security Role** en cuanto a qué controla cada uno?
3. ¿En qué etapa del pipeline de Dataverse ejecuta un BPF su lógica de validación de pasos?
4. ¿Puede un usuario con rol **System Administrator** ser bloqueado por un Field Security Profile? Razona tu respuesta.

---

## Limpieza del laboratorio

> Conserva todos los artefactos — el Lab 23 (Plugins C#) construye sobre el mismo modelo de datos.

---

## Siguiente laboratorio recomendado

➡️ **Lab 23 — Plugin C#: Validación Server-Side y Auditoría Personalizada**

**Por qué ir ahí:** Las Business Rules del Lab 02 y el BPF del Lab 09 son validaciones low-code. El Lab 23 agrega lógica que **no puede ser eludida desde ninguna interfaz**: un Plugin C# en el servidor que valida presupuesto, asigna numeración automática y registra auditoría en cada cambio de estado.

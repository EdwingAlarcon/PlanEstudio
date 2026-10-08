---
moduleId: 4
title: "Power Apps Model-Driven - Apps Basadas en Datos"
level: "basico"
certification: "PL-900"
estimatedMinutes: 20
slug: "power-apps-model-driven-apps-basadas-en-datos"
lastVerified: "2026-09"
---
*Duración: 1-2 semanas · Lectura: 8-10 min · Con práctica: unos 95 min con el ambiente listo; la primera vez, cuenta entre el doble y el triple (núcleo obligatorio); seguridad y BPF pueden completarse en una segunda sesión*

### 🎯 Objetivo
Construir aplicaciones Model-Driven aprovechando metadatos de Dataverse.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Publicar una Model-Driven App conectada a las tablas que ya creaste en Dataverse.
- Configurar navegación básica, formulario principal, vista de trabajo y dashboard simple.
- Entender por qué esta app sirve mejor para gestores/técnicos que para usuarios móviles.

### 🔧 Qué queda para después (Profundización opcional)
- Business Process Flow completo y Security Roles probados con usuarios diferentes. Son importantes, pero no bloquean tu primer logro visible del módulo.

### 📖 Conceptos Clave
- **Arquitectura Model-Driven**: Metadata-driven, auto-generada
- **Componentes**: Forms, Views, Charts, Dashboards, Business Process Flows
- **Site Map**: Navegación y estructura de áreas
- **Security Roles**: Permisos granulares por tabla/operación
- **Forms**: Main, Quick Create, Quick View
- **Quick View Forms**: mostrar datos de registros relacionados directamente en el formulario principal sin cambiar de pantalla
- **Subgrids**: mostrar y gestionar registros relacionados (1:N o N:N) embebidos dentro de un formulario Model-Driven
- **UCI (Unified Client Interface)**: Experiencia moderna
- **Modern App Designer** (2023+): nuevo diseñador visual unificado que reemplaza al editor clásico. Permite configurar páginas, tablas, formularios, vistas y navegación desde una sola interfaz. Es el editor predeterminado en todos los ambientes actuales — si las instrucciones mencionan el "diseñador clásico", selecciona **Switch to classic** en la barra superior si necesitas reproducir pasos del tutorial

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

> **Cómo está organizado el Núcleo:** construyes la app en tres bloques (la app y su navegación, formularios y vistas, dashboard y publicación). En cada uno alternas una idea corta, una práctica de pocos minutos y un dato real de tu propia app. Cierras con un reto en el que ya no te digo los pasos. Las microprácticas no necesitan tenant; construir la app sí (tu ambiente Developer y las tablas de los Módulos 1 y 2).

## 🧩 Microlección 1 — Qué es una Model-Driven y cuándo elegirla

**¿Qué vas a aprender?** Qué es una Model-Driven App (se genera a partir de tu modelo de datos), qué piezas tiene (navegación, formularios, vistas, dashboards) y cuándo conviene frente a una Canvas App.

**¿Por qué existe esto?** En una Canvas App dibujas cada pantalla. En una Model-Driven defines el modelo de datos y la app se arma casi sola: lista, formulario, relaciones y navegación. Para personas que trabajan todo el día sobre muchos registros relacionados, eso es más rápido de construir y más consistente.

**Ejemplo pequeño:** con la tabla Solicitud TI y sus columnas ya creadas, la app genera la lista, el formulario y el menú sin que dibujes una sola pantalla.

**Ahora haz algo — micropráctica (6 min):** **[Elegir Model-Driven o Canvas según el caso](/practica/ip-app-009-model-driven-o-canvas)**. Te da dos necesidades distintas de una empresa y te pide decidir qué tipo de app encaja con cada una.

**Práctica real en tu entorno (25 min):** haz los Pasos 1 y 2 de abajo.

##### Práctica 4.1: Crear Primera Model-Driven App

> **Nota de versión:** Las capturas y pasos a continuación describen el flujo general; la apariencia exacta puede variar según si tu ambiente usa el **Modern App Designer** (predeterminado desde 2023) o el diseñador clásico. La funcionalidad es equivalente en ambos.

**Paso 1: Crear app desde solución**

1. Power Apps > Solutions > New solution
    - Name: `Sistema Solicitudes TI`
    - Publisher: Crear nuevo con prefix `sit`

2. Dentro de solución > New > App > Model-driven app
3. Name: `Gestión Solicitudes TI`

**Paso 2: Configurar Site Map**

1. Click en "Edit site map" (diseñador clásico) o "Navigation" (Modern App Designer)
2. Estructura:
   ```
   Área: Solicitudes
      Group: Operación
         Subarea: Solicitudes TI (tabla)
         Subarea: Categorías
      Group: Configuración
         Subarea: Contactos
   
   Área: Reportes
      Group: Análisis
         Subarea: Dashboard Solicitudes
   ```

3. Guardar y publicar

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre de la solución y prefijo del Publisher que usaste | ___ |
| Las áreas, grupos y subáreas de tu site map tal como quedaron | ___ |
| ¿La app aparece como "Publicada" o "Borrador" en la lista de apps de la solución? | ___ |

---

## 🧩 Microlección 2 — Formularios y vistas: lo que ve quien captura y quien revisa

**¿Qué vas a aprender?** Para qué sirve un formulario Main y uno Quick Create, y cómo una vista combina filtro, columnas y orden.

**¿Por qué existe esto?** El formulario organiza lo que ve quien captura el dato; la vista es lo que ve quien revisa muchos registros. Si están mal pensados (demasiadas pestañas, vistas sin filtro) la gente no los usa aunque funcionen.

**Ejemplo pequeño:** la vista "Mis Asignaciones" filtra por Asignado a = usuario actual y Estado distinto de Cerrada, muestra pocas columnas y ordena por fecha.

**Práctica real en tu entorno (35 min):** esta microlección no tiene micropráctica propia; la verificación es abrir tu vista y comprobar que muestra los registros que esperas.

**Paso 3: Personalizar Forms**

1. **Main Form de Solicitud TI**
    - Abrir tabla > Forms > Information (Main)
    - Estructura en tabs:
     ```
     Tab: General
        Section: Información Básica
           - Título
           - Categoría
           - Prioridad
           - Estado
        Section: Detalles
           - Descripción
           - Solicitante
           - Asignado a
     
     Tab: Resolución
        Section: Solución
           - Fecha Resolución
           - Notas de Resolución (multiline)
     
     Tab: Timeline
        - Timeline control (automático)
     ```

2. **Configurar Business Rules en el form**
    - Mostrar Tab "Resolución" solo si Estado = Resuelta o Cerrada
    - Hacer Required "Fecha Resolución" cuando Estado = Resuelta

3. **Quick Create Form**
    - Crear nuevo form tipo Quick Create
    - Solo campos esenciales: Título, Categoría, Prioridad, Descripción
    - Esto permite crear registros rápidos desde cualquier vista

**Paso 4: Personalizar Views**

1. **Vista "Solicitudes Activas"** (personal)
    - Filtro: Estado ≠ Cerrada
    - Columnas: Título, Solicitante, Prioridad, Estado, Fecha Solicitud
    - Orden: Prioridad (mayor a menor), Fecha Solicitud (más reciente)

2. **Vista "Mis Asignaciones"**
    - Filtro: Asignado a = Current User AND Estado ≠ Cerrada
    - Columnas: Título, Categoría, Prioridad, Fecha Solicitud
    - Orden: Fecha Solicitud (más antiguo primero)

3. **Vista Chart**: Solicitudes por Categoría
    - Insertar chart en vista
    - Tipo: Bar chart
    - Eje Y: Count of records
    - Eje X: Categoría

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de las pestañas (tabs) de tu formulario Main | ___ |
| El filtro exacto de tu vista "Mis Asignaciones" | ___ |
| Cuántas vistas personalizadas creaste y cuántas columnas muestra la que más tiene | ___ |

---

## 🧩 Microlección 3 — Dashboard y publicación: que otros lo vean

**¿Qué vas a aprender?** Cómo un dashboard junta gráficos y listas en una sola pantalla, y qué hace falta para que otra persona vea tu app.

**¿Por qué existe esto?** Un dashboard le ahorra al gestor abrir vista por vista. Pero nada de lo que construyes se ve hasta que lo publicas, y una persona solo puede usar la app si tiene un rol de seguridad y la app está compartida con ella.

**Ejemplo pequeño:** cambias un formulario, no publicas las personalizaciones, y la app sigue mostrando la versión anterior. O publicas bien, pero tu compañero no tiene rol y no ve la app.

**Lo mínimo sobre roles y publicación:** un rol de seguridad es el conjunto de permisos que dice qué tablas puede ver y modificar una persona; se asigna en Settings > Security > Users > Manage Roles (el detalle está en la Práctica 4.3, que es Profundización). Para que tus cambios se vean, abre la solución, elige Publish all customizations y después abre la app con Play.

**Práctica real en tu entorno (15 min):** haz el Paso 5 de abajo.

**Paso 5: Crear Dashboard**

1. New > Dashboard > 2-Column Regular Dashboard
2. Nombre: `Dashboard Solicitudes TI`
3. Componentes:
    - **Panel superior izquierda**: Chart "Solicitudes por Estado" (Donut)
    - **Panel superior derecha**: Chart "Solicitudes por Prioridad" (Column)
    - **Panel inferior**: List de "Solicitudes Pendientes" (View)

**Ahora diagnostica — micropráctica (5 min):** **[Diagnosticar: la app está publicada pero mi compañero no la ve](/practica/ip-trb-004-app-no-visible-para-companero)**. Parte de un síntoma exacto —a ti te funciona y a otra persona no— y te pide qué falta y dónde se configura, antes de ver la solución.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de tu dashboard y cuántos componentes tiene | ___ |
| Qué hiciste para confirmar que los cambios se veían en la app publicada | ___ |
| Qué necesita otra persona para usar tu app (di las dos cosas y dónde se configuran) | ___ |

---

## 🔁 Reto de transferencia — Una vista y un gráfico para el jefe de TI, sin pasos

Esta vez no te digo los pasos: aplica lo que viste a un pedido nuevo.

> **Requerimiento:** el jefe de TI quiere ver cada mañana las solicitudes de prioridad Crítica que todavía no tienen técnico asignado, y un gráfico que diga cuántas son.
> **Criterios de aceptación:** (1) una vista nueva con el filtro correcto y un nombre que diga para qué sirve; (2) un gráfico en tu dashboard que cuente esas solicitudes; (3) comprobar en la app publicada que la vista y el gráfico aparecen.
> **Restricciones:** no modifiques las vistas que ya existen y no pases de 6 componentes en el dashboard.
> **Pistas si te atoras:** en el editor de la vista, la condición "sin técnico asignado" se escribe con la columna Asignado a y el operador "Does not contain data" (sin datos); un gráfico que cuenta usa "Count of records".

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: una vista de críticas sin asignar](/practica/ip-app-010-transferir-vista-criticas)**. Retoma la app de este módulo pero con un pedido nuevo, y te pide decidir qué hacer y qué evitar.

**Si aún no tienes tenant:** escribe el filtro exacto que usarías, el nombre de la vista y qué pasos seguirías para publicarla.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El filtro exacto de tu vista nueva y su nombre | ___ |
| El tipo de gráfico que elegiste y el número que mostró | ___ |
| Cómo comprobaste que aparecía en la app publicada | ___ |

#### 🔧 Profundización opcional

> Si estás empezando desde cero, completa primero la app, el formulario, una vista y un dashboard. Vuelve a esta sección cuando ya puedas abrir la Model-Driven App publicada y navegar por registros reales.

##### Práctica 4.2: Business Process Flow

*Crear flujo para ciclo de vida de solicitud*

1. Solutions > New > Other > Business Process Flow
2. Nombre: `Proceso Solicitud TI`
3. Table: Solicitud TI

4. **Stages (Etapas)**:
   ```
   Stage 1: Registro
      - Título (existing)
      - Categoría (existing)
      - Descripción (existing)
      Action: Validar información completa
   
   Stage 2: Asignación
      - Asignado a (existing)
      - Prioridad (existing)
      Action: Notificar asignado
   
   Stage 3: Resolución
      - Notas Resolución (existing)
      - Fecha Resolución (existing)
      Action: Cerrar solicitud
   
   Stage 4: Cierre
      - Feedback (new field: Choice - Satisfecho, Neutral, Insatisfecho)
      Action: Archivar
   ```

5. Configurar transiciones automáticas:
    - Al cambiar Estado a "En Proceso" → avanzar a Stage 2
    - Al cambiar Estado a "Resuelta" → avanzar a Stage 3

6. Guardar, activar y asignar a Security Role

##### Práctica 4.3: Configurar Seguridad

1. **Crear Security Roles**:

   **Role: Solicitante**
    - Solicitud TI: Create (Own), Read (Business Unit), Write (Own)
    - Contact: Read (Organization)
    - Categorías: Read (Organization)

   **Role: Técnico TI**
    - Solicitud TI: Create, Read, Write, Delete (Organization)
    - Contact: Read (Organization)
    - Todas las tablas del sistema: Read

   **Role: Administrador TI**
    - Solicitud TI: Todos los permisos (Organization)
    - Todas las tablas: Admin completo

2. **Asignar roles a usuarios de prueba**:
    - Settings > Security > Users
    - Seleccionar usuario > Manage Roles
    - Asignar role creado

3. **Probar con cada role**:
    - Login como cada usuario
    - Validar que solo ven datos según permisos
    - Verificar botones habilitados/deshabilitados

### 💼 Caso Real de Negocio

**Escenario**: Sistema CRM de Gestión de Clientes para PyME

**Modelo de datos**:

- Account (Clientes)
- Contact (Personas de contacto)
- Opportunity (Oportunidades de venta)
- Quote (Cotizaciones)
- Lead (Prospectos)

**Business Process Flow**: Lead → Opportunity → Quote → Won/Lost

**Dashboards**:

- Embudo de ventas por etapa
- Top 10 clientes por revenue
- Actividades pendientes por vendedor

**Security**:

- Vendedores: Solo su cartera (Business Unit)
- Gerentes: Toda la región (Organization, read-only others)
- Dirección: Full access

**Automatización** (Power Automate):

- Lead asignado → Email bienvenida
- Opportunity en "Proposal" > 30 días → Alerta gerente
- Quote aceptada → Crear Deal en sistema ERP externo

### ✅ Buenas Prácticas

**Diseño de Forms**:

- Máximo 3 tabs por form (evitar sobrecarga)
- Agrupar campos relacionados en sections
- Ocultar tabs/sections innecesarias según contexto con Business Rules
- Usar Quick View Forms para mostrar datos relacionados inline

**Performance**:

- Limitar columnas en vistas (8-10 máximo)
- No cargar todos los campos en forms (lazy load tabs)
- Usar vistas personales para filtros frecuentes
- Deshabilitar auto-save si no es necesario

**Usabilidad**:

- Nombres de vistas descriptivos y orientados a acción: "Revisar Hoy", no "Vista 1"
- Site map organizado por flujo de trabajo, no por entidades
- Dashboards con máximo 6 componentes (evitar saturación)
- Business Process Flow solo para procesos realmente estructurados

**Gobernanza**:

- Trabajar siempre dentro de Solutions (nunca en default)
- Publisher con prefix único por organización
- Documentar cada componente (description field)
- Versionar solutions antes de cambios mayores

### ⚠️ Errores Comunes

1. **Lo que ves:** otras personas no ven la app o no ven los datos.
    - **Causa**: Falta Security Role asignado
    - **Solución**: Settings > Security > Users > Manage Roles + compartir app

2. **Lo que ves:** el Business Process Flow no aparece en el formulario.
    - **Causa**: No está activado o no asignado a Security Role
    - **Solución**: Process > Activate + Security Roles tab en BPF

3. **Lo que ves:** cambiaste el formulario y la app sigue mostrando la versión anterior.
    - **Causa**: No se publicó customizations
    - **Solución**: Siempre Publish All Customizations después de cambios

4. **Lo que ves:** el dashboard no muestra datos actualizados.
    - **Causa**: Cache del navegador o permisos en vistas subyacentes
    - **Solución**: Refresh browser, verificar security role en charts/views

5. **Lo que ves:** el site map no se guarda o no aparece en la app.
    - **Causa**: Estructura inválida (subarea sin group, etc.)
    - **Solución**: Validar jerarquía: Area > Group > Subarea

### 🧪 Criterios de Validación
- [ ] Model-Driven App publicada con site map de 2+ áreas
- [ ] 2+ forms personalizados (Main + Quick Create)
- [ ] 3+ vistas con filtros y columnas optimizadas
- [ ] 1 Dashboard con mínimo 3 componentes
- [ ] 1 Business Process Flow con 3+ stages funcional
- [ ] 2+ Security Roles configurados y asignados
- [ ] Probar app con distintos roles y verificar permisos
- [ ] Explicar cuándo usar Model-Driven vs Canvas

> Los primeros 4 criterios son el Núcleo obligatorio. BPF y Security Roles pertenecen a la Profundización opcional si no tienes todavía usuarios de prueba o tiempo para validar permisos.

### 📸 Evidencia para guardar
- Captura de la app publicada con el site map visible.
- Captura del formulario Main con secciones organizadas.
- Captura de una vista filtrada y del dashboard con datos de prueba.
- Si haces la profundización: captura del BPF activo y de la prueba con roles.

### ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 04 · Model-Driven App — Sistema de Gestión de Solicitudes Completo](/labs/lab-04-model-driven-app)**

**Por qué:** el Lab 04 convierte este módulo en un recorrido clic-por-clic sobre la solución SIT creada en los labs anteriores. Es la mejor forma de practicar formularios, vistas, dashboard y roles sin inventar estructura nueva.

**Qué evidencia guardar del lab:** site map publicado, formulario Main, Quick Create, dashboard y prueba de permisos con los roles `SIT Solicitante` y `SIT Técnico TI`.

---

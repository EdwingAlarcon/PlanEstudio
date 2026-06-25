---
moduleId: 4
title: "Power Apps Model-Driven - Apps Basadas en Datos"
level: "basico"
certification: "PL-900"
estimatedMinutes: 7
slug: "power-apps-model-driven-apps-basadas-en-datos"
---
*Duración: 1-2 semanas*

#### 🎯 Objetivo
Construir aplicaciones Model-Driven aprovechando metadatos de Dataverse.

#### 📖 Conceptos Clave
- **Arquitectura Model-Driven**: Metadata-driven, auto-generada
- **Componentes**: Forms, Views, Charts, Dashboards, Business Process Flows
- **Site Map**: Navegación y estructura de áreas
- **Security Roles**: Permisos granulares por tabla/operación
- **Forms**: Main, Quick Create, Quick View
- **Quick View Forms**: mostrar datos de registros relacionados directamente en el formulario principal sin cambiar de pantalla
- **Subgrids**: mostrar y gestionar registros relacionados (1:N o N:N) embebidos dentro de un formulario Model-Driven
- **UCI (Unified Client Interface)**: Experiencia moderna
- **Modern App Designer** (2023+): nuevo diseñador visual unificado que reemplaza al editor clásico. Permite configurar páginas, tablas, formularios, vistas y navegación desde una sola interfaz. Es el editor predeterminado en todos los ambientes actuales — si las instrucciones mencionan el "diseñador clásico", selecciona **Switch to classic** en la barra superior si necesitas reproducir pasos del tutorial

#### 👨‍💻 Actividades Prácticas

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

**Paso 5: Crear Dashboard**

1. New > Dashboard > 2-Column Regular Dashboard
2. Nombre: `Dashboard Solicitudes TI`
3. Componentes:
    - **Panel superior izquierda**: Chart "Solicitudes por Estado" (Donut)
    - **Panel superior derecha**: Chart "Solicitudes por Prioridad" (Column)
    - **Panel inferior**: List de "Solicitudes Pendientes" (View)

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

#### 💼 Caso Real de Negocio

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

#### ✅ Buenas Prácticas

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

#### ⚠️ Errores Comunes

1. **Error**: Usuarios no ven la app o datos
    - **Causa**: Falta Security Role asignado
    - **Solución**: Settings > Security > Users > Manage Roles + compartir app

2. **Error**: Business Process Flow no aparece en form
    - **Causa**: No está activado o no asignado a Security Role
    - **Solución**: Process > Activate + Security Roles tab en BPF

3. **Error**: Cambios en form no se reflejan
    - **Causa**: No se publicó customizations
    - **Solución**: Siempre Publish All Customizations después de cambios

4. **Error**: Dashboard no muestra datos actualizados
    - **Causa**: Cache del navegador o permisos en vistas subyacentes
    - **Solución**: Refresh browser, verificar security role en charts/views

5. **Error**: Site map no guarda o no aparece en app
    - **Causa**: Estructura inválida (subarea sin group, etc.)
    - **Solución**: Validar jerarquía: Area > Group > Subarea

#### 🧪 Criterios de Validación
- [ ] Model-Driven App publicada con site map de 2+ áreas
- [ ] 2+ forms personalizados (Main + Quick Create)
- [ ] 3+ vistas con filtros y columnas optimizadas
- [ ] 1 Dashboard con mínimo 3 componentes
- [ ] 1 Business Process Flow con 3+ stages funcional
- [ ] 2+ Security Roles configurados y asignados
- [ ] Probar app con distintos roles y verificar permisos
- [ ] Explicar cuándo usar Model-Driven vs Canvas

---

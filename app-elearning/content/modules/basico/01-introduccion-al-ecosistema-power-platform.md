---
moduleId: 1
title: "Introducción al Ecosistema Power Platform"
level: "basico"
certification: "PL-900"
estimatedMinutes: 10
slug: "introduccion-al-ecosistema-power-platform"
---
*Duración: 1-2 semanas*

#### 🎯 Objetivo
Comprender la arquitectura, componentes y casos de uso de Power Platform.

#### 📖 Conceptos Clave
- **Arquitectura de Power Platform**: Componentes principales y su interrelación
- **Microsoft Dataverse**: Base de datos común (Common Data Service)
- **Ambientes (Environments)**: Tipos (producción, sandbox, developer)
- **Conectores**: Estándar vs Premium vs Personalizados
- **Soluciones**: Contenedores de componentes para ALM
- **Licenciamiento**: Per-user, per-app, pay-as-you-go
- **Power Platform Admin Center**: Gestión de ambientes y recursos
- **Center of Excellence (CoE)**: Introducción conceptual
- **AI Builder**: servicio de IA integrado en Power Platform que permite agregar inteligencia artificial a apps y flujos sin escribir código de ML. Modelos preconstruidos (clasificación de texto, extracción de datos de documentos, detección de objetos, predicción binaria) accesibles directamente desde Power Apps y Power Automate
- **Power Pages**: plataforma de bajo código para crear sitios web externos con acceso a datos de Dataverse. Antes llamado "Power Apps portals". Permite a usuarios anónimos o con cuenta externa (B2C) ver, crear y editar registros de Dataverse a través de formularios y vistas configurables

#### 👨‍💻 Actividades Prácticas

##### Práctica 1.1: Configurar Entorno de Desarrollo

1. Crear cuenta Microsoft 365 Developer (gratuita)
    - Acceder a https://developer.microsoft.com/microsoft-365/dev-program
    - Suscripción gratuita por 90 días renovables

2. Activar trial de Dynamics 365
    - Desde Power Platform Admin Center
    - Seleccionar Dynamics 365 Customer Service trial

3. Explorar Power Platform Admin Center
    - Crear ambiente tipo "Developer"
    - Configurar región (según ubicación)
    - Habilitar Dynamics 365 apps

##### Práctica 1.2: Exploración de Componentes

1. Acceder a https://make.powerapps.com
2. Navegar cada sección del menú lateral:
    - Home, Create, Learn, Apps, Tables, Flows, Copilots (Copilot Studio), AI Hub

3. Identificar conectores disponibles (Connectors > Premium vs Standard)
4. Revisar plantillas predefinidas (Templates)

##### Práctica 1.3: Primera Exploración de Dataverse

1. Ir a "Tables" en el menú
2. Explorar tablas estándar: Account, Contact, Email, Task
3. Abrir tabla "Account" y revisar:
    - Columns (columnas/campos)
    - Relationships (relaciones)
    - Business rules
    - Views (vistas)

4. Crear datos de prueba manualmente (5 registros de Account)

#### 💼 Caso Real de Negocio

**Empresa:** Laboratorio Farmacéutico NovaBio — 280 empleados, 2 plantas de producción  
**Problema:** El área de Calidad gestionaba no-conformidades (productos fuera de especificación) por email y hojas Excel. Los formularios llegaban incompletos, las aprobaciones tardaban semanas y era imposible auditar el proceso para la certificación ISO 9001.  
**Consecuencia:** Auditoría externa detectó que el 34% de los registros de no-conformidades estaban incompletos o sin respuesta en los tiempos requeridos.

**Solución con Power Platform:**
- **Dataverse:** tabla central de no-conformidades con estados, responsables, fechas límite y adjuntos de evidencia
- **Power Apps Canvas:** formulario digital que valida campos obligatorios antes de permitir el envío — eliminó registros incompletos desde el primer día
- **Power Automate:** flujo automático notifica al responsable al crear la no-conformidad; escala al supervisor si no hay respuesta en 48h
- **Power BI:** dashboard para el Jefe de Calidad con indicadores de tiempo de cierre por tipo, área y responsable

**Resultados a 6 meses:**
- 100% de registros completos (vs 66% previo)
- Tiempo de cierre promedio reducido de 18 días a 6 días
- Superó la siguiente auditoría ISO 9001 sin observaciones en el proceso de no-conformidades

**Por qué Power Platform:** Ningún componente requirió código. El equipo de Calidad configuró el sistema en 3 semanas sin soporte externo.

#### ✅ Buenas Prácticas
- Usar ambientes Developer/Sandbox para pruebas, nunca directamente en Production
- Nombrar ambientes con convenciones claras: `DEV-TuNombre`, `TEST-Proyecto`
- Documentar propósito de cada ambiente desde su creación
- No compartir credenciales de trial; crear usuarios de prueba en el tenant

#### ⚠️ Errores Comunes
- **Error**: Trabajar sin ambiente dedicado, modificar ambiente default
  - **Solución**: Siempre crear ambiente específico para aprendizaje

- **Error**: Confundir Dataverse con SharePoint
  - **Solución**: Dataverse es base de datos relacional, SharePoint es almacenamiento documental

- **Error**: No comprender límites de licencias trial
  - **Solución**: Revisar documentación de límites (usuarios, API calls, almacenamiento)

#### 🧪 Criterios de Validación
- [ ] Ambiente de desarrollo creado y funcional
- [ ] Acceso a Power Apps, Power Automate, Power BI confirmado
- [ ] 5+ registros de prueba en tabla Account de Dataverse
- [ ] Comprensión de diferencia entre conectores Standard y Premium
- [ ] Explicar con palabras propias qué es Dataverse y su propósito
- [ ] Identificar los 4 modelos preconstruidos más usados de AI Builder
- [ ] Describir para qué sirve Power Pages y en qué se diferencia de una Canvas App

---

### 📌 Suplemento 1A: AI Builder — Inteligencia Artificial sin código

> **Relevancia PL-900:** ~15% del examen. Capacidad de agregar IA a apps y flujos desde la interfaz, sin entrenar modelos desde cero.

#### 🎯 Objetivo
Comprender qué es AI Builder, sus modelos preconstruidos y cómo integrar IA en apps y flujos sin código de machine learning.

#### 📖 Conceptos Clave
- **Modelos preconstruidos (Prebuilt models):** listos para usar sin datos de entrenamiento propios:
  - *Business Card Reader:* extrae nombre, empresa, correo, teléfono de tarjetas de presentación
  - *Document Processing (Form Processing):* extrae campos estructurados de documentos PDF/imágenes (facturas, contratos)
  - *Text Classification:* clasifica texto libre en categorías definidas (soporte técnico, ventas, RR.HH.)
  - *Object Detection:* detecta objetos en imágenes (inventario, inspección de calidad)
  - *Sentiment Analysis:* analiza el sentimiento de texto como positivo, negativo o neutral
  - *Language Detection:* identifica el idioma de un texto
- **Modelos personalizados (Custom models):** se entrenan con datos propios del negocio; requieren conjunto de datos etiquetados
- **AI Builder Credits:** moneda de consumo para inferencias de IA. Los créditos se incluyen en licencias Premium de Power Platform o se adquieren por separado
- **Componente AI en Canvas Apps:** control nativo que añade funcionalidad de IA (ej. `AI.BusinessCard.Scanner`) directamente en formularios
- **Acción AI en Power Automate:** paso "AI Builder" que llama un modelo dentro de un flujo automatizado

#### 👨‍💻 Actividad Práctica: Procesar una tarjeta de presentación con AI Builder

**Paso 1 — Explorar el catálogo de modelos:**
1. Ir a [make.powerapps.com](https://make.powerapps.com) → menú lateral → **AI hub**
2. Explorar la galería de modelos preconstruidos; seleccionar **Business Card Reader**
3. Clic en **Try it out** y cargar una imagen de tarjeta de presentación
4. Observar los campos extraídos (nombre, empresa, email, teléfono)

**Paso 2 — Usar AI Builder en Power Automate:**
1. Crear un nuevo Flow: **Instant cloud flow** → disparador manual
2. Agregar paso: buscar **AI Builder** → seleccionar **Extract information from business cards**
3. Conectar con una imagen de ejemplo (archivo adjunto o URL)
4. Agregar paso: **Create a row** en Dataverse para guardar el resultado en una tabla de contactos

**Paso 3 — Explorar el modelo de Document Processing:**
1. En AI hub → **Document processing** → **Explore prebuilt model**
2. Cargar una factura o recibo de ejemplo en PDF
3. Revisar los campos extraídos: número de factura, fecha, total, proveedor

#### 💼 Caso Real de Negocio
Una empresa de logística recibe cientos de albaranes en papel diariamente. Con AI Builder + Power Automate: el proceso manual de transcripción se reemplaza por un flujo que digitaliza el documento al adjuntarlo en Teams, extrae número de guía, proveedor, cantidad y estado, y crea automáticamente el registro en Dataverse — reduciendo el tiempo de registro de 5 minutos a 15 segundos por documento.

#### ✅ Buenas Prácticas
- Usar modelos prebuilt antes de entrenar modelos custom — 70% de casos de negocio se resuelven sin entrenamiento propio
- Para Document Processing custom: recolectar mínimo 5 documentos de muestra por variante de formulario
- Monitorear el consumo de AI Builder Credits desde Power Platform Admin Center

#### ⚠️ Errores Comunes
- **Error**: Usar AI Builder en ambientes sin licencias Premium asignadas → los créditos de prueba se agotan sin aviso
  - **Solución**: Verificar créditos disponibles en Admin Center antes de producción
- **Error**: Esperar que Document Processing funcione en documentos no estructurados (cartas libres)
  - **Solución**: Document Processing es para formularios estructurados repetibles; para texto libre usar Text Classification o Azure AI Services

#### 🧪 Criterios de Validación
- [ ] Explorar el catálogo AI hub y probar Business Card Reader con una imagen real
- [ ] Crear un flujo que use al menos un modelo AI Builder prebuilt
- [ ] Explicar qué son los AI Builder Credits y cómo se consumen

---

### 📌 Suplemento 1B: Power Pages — Sitios web externos con Dataverse

> **Relevancia PL-900:** ~10% del examen. Diferencia entre Power Pages y otras herramientas; casos de uso de portales externos.

#### 🎯 Objetivo
Comprender qué es Power Pages, sus capacidades principales y cuándo usarlo en lugar de Canvas Apps o Model-Driven Apps.

#### 📖 Conceptos Clave
- **Power Pages** (antes *Power Apps portals*): plataforma para crear sitios web públicos o con autenticación externa que interactúan con datos de Dataverse
- **Usuarios externos:** personas fuera de la organización (clientes, socios, ciudadanos) que acceden al sitio sin licencia de Microsoft 365
- **Table permissions:** controlan qué tablas de Dataverse puede leer/escribir cada rol de portal (Contact, Basic User, Anonymous User)
- **Webpages, Webforms, Webviews:** componentes de diseño del portal — páginas, formularios y vistas de tabla accesibles desde el sitio
- **Portal Studio / Pages Studio:** editor visual de bajo código para diseñar el sitio, similar al editor de Canvas Apps pero orientado a web externa
- **Authentication providers:** Power Pages soporta Azure AD, Azure AD B2C, LinkedIn, Google, Facebook y proveedor local
- **Liquid templates:** lenguaje de plantillas basado en Liquid (Open Source) para lógica condicional dentro de páginas del portal
- **Capacidades:** 1 sitio por ambiente, con su propia URL (`*.powerappsportals.com` o dominio custom)

#### 💼 Caso Real de Negocio
Un municipio necesita que los ciudadanos puedan registrar solicitudes de permisos de construcción en línea, consultar el estado de su trámite y adjuntar documentos, sin tener que ir en persona. Con Power Pages se crea un portal público donde:
- El ciudadano se registra con su correo (Azure AD B2C)
- Completa un formulario Webform que crea un registro de "Solicitud" en Dataverse
- Visualiza el historial de sus solicitudes mediante una Webview filtrada por su identidad
- El equipo municipal gestiona las solicitudes desde una Model-Driven App interna

#### ✅ Buenas Prácticas
- Configurar Table Permissions **antes** de abrir el portal a usuarios externos — por defecto todo está bloqueado
- Usar HTTPS y dominio personalizado en producción (`portal.municipio.gob`)
- Mantener Liquid templates simples; la lógica compleja debe ir en flujos de Power Automate

#### ⚠️ Errores Comunes
- **Error**: Creer que Power Pages reemplaza a Canvas Apps para usuarios internos
  - **Solución**: Power Pages es para usuarios **externos**; Canvas Apps y Model-Driven Apps son para usuarios **internos** con licencia
- **Error**: No configurar Table Permissions después de crear el portal
  - **Solución**: Sin Table Permissions, todos los datos son inaccesibles desde el portal (error 403)

#### 🧪 Criterios de Validación
- [ ] Explicar la diferencia entre Power Pages, Canvas Apps y Model-Driven Apps
- [ ] Describir un escenario donde Power Pages es la herramienta correcta vs Canvas App
- [ ] Identificar qué son Table Permissions y por qué son necesarias

---

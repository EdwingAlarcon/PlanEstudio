(function () {
  function certForModule(moduleId) {
    if (moduleId <= 8) return "PL-900";
    if (moduleId <= 17) return "PL-200 (retira 31 ago 2026)";
    if (moduleId <= 30) return "PL-400";
    if (moduleId <= 41) return "Arquitectura Power Platform";
    if (moduleId <= 55) return "Buenas Prácticas IA";
    if (moduleId <= 65) return "D365 Especialización";
    return "Power Automate Desktop & RPA";
  }

  function levelForModule(moduleId) {
    if (moduleId <= 8) return "Básico";
    if (moduleId <= 17) return "Intermedio";
    if (moduleId <= 30) return "Avanzado";
    if (moduleId <= 41) return "Arquitecto";
    if (moduleId <= 55) return "Desarrollo Asistido por IA";
    if (moduleId <= 65) return "Dynamics 365 Especialización";
    return "Power Automate Desktop & RPA";
  }

  const moduleTitles = [
    "Introducción al Ecosistema Power Platform",
    "Dataverse - Fundamentos y Modelado Básico",
    "Power Apps Canvas - Primeras Aplicaciones",
    "Power Apps Model-Driven - Apps Basadas en Datos",
    "Power Automate - Automatización Básica",
    "Power BI - Reportes y Dashboards Básicos",
    "Fundamentos de Power Fx y Expresiones",
    "Primer Proyecto Integrado",
    "Dataverse Avanzado",
    "Canvas Apps — Componentes y Reutilización",
    "Power Automate Avanzado",
    "Power BI — DAX Avanzado",
    "JavaScript y PCF Básico",
    "Conectores Personalizados",
    "Copilot Studio — Introducción",
    "Seguridad y Administración de Soluciones",
    "Proyecto Integrador Nivel 2",
    "Arquitectura de Soluciones Power Platform",
    "ALM y CI/CD con Azure DevOps",
    "Dynamics 365 CE — Sales y Customer Service",
    "Power Pages — Portales Externos",
    "Copilot Studio Avanzado",
    "C# Plugins para Dataverse",
    "Integraciones con Azure Services",
    "Patrones de Diseño Avanzados",
    "Performance y Optimización",
    "PCF Avanzado con TypeScript y React",
    "Code Apps con React y TypeScript",
    "Power Pages Avanzado y Azure AD B2C",
    "Proyecto Multicapa Nivel 3",
    "Enterprise Architecture y Gobernanza",
    "CoE Starter Kit y Administración a Escala",
    "Multi-tenant, Multi-geo y Estrategia de Ambientes",
    "Azure Integration Services Avanzado",
    "Arquitectura de Datos — Fabric, Synapse y Medallion",
    "Seguridad y Cumplimiento Enterprise",
    "AI Builder y Azure AI integrado",
    "Liderazgo Técnico y Gestión de Proyectos",
    "Casos de Transformación Digital",
    "Arquitectura Power Platform — Casos de Estudio",
    "Proyecto Capstone — Arquitectura Enterprise",
    "Fundamentos de IA para Desarrollo",
    "Copilot en Power Platform",
    "GitHub Copilot en VS Code",
    "Claude Code y Codex",
    "Vibe Coding Controlado",
    "Prompts Técnicos Reutilizables",
    "Revisión de Diffs y PRs",
    "Seguridad, Secretos y Compliance",
    "Tests, CI/CD y Guardrails",
    "Flujo Recomendado (Capstone)",
    "Power Platform CLI y Conexión al Tenant",
    "Dataverse Web API, D365 y Autenticación",
    "ALM de Soluciones con Apoyo de IA",
    "Análisis, Arquitectura y Consultoría Funcional D365",
    "Dynamics 365 CE Avanzado",
    "Customer Insights - Data",
    "Field Service End-to-End",
    "F&O Awareness",
    "Dynamics 365 Sales Avanzado",
    "Dynamics 365 Customer Service Avanzado",
    "Dynamics 365 Contact Center / Omnichannel",
    "Customer Insights - Journeys",
    "Integración CE + F&O",
    "Capstone Enterprise D365",
    "Fundamentos de RPA y Selección de Procesos",
    "Entorno, Instalación y Arquitectura PAD",
    "Construcción Mantenible de Desktop Flows",
    "Archivos, CSV y Excel con PAD",
    "Automatización Web con PAD",
    "Aplicaciones Windows y Legacy",
    "Selectores, Sincronización y Resiliencia",
    "Errores, Logging e Idempotencia",
    "Integración Cloud Flow + Desktop Flow",
    "ALM, Operación, Gobierno y Soporte RPA"
  ];

  const MODULE_QUESTIONS = {
  1: [
    {
      type: "single",
      prompt: "Una empresa de servicios quiere una app para gestionar inspecciones con relaciones entre clientes, activos y órdenes, auditoría nativa y seguridad por fila. Actualmente usan listas de SharePoint separadas. ¿Qué recomendación es la más adecuada?",
      options: [
      "Mantener SharePoint porque siempre es suficiente para datos tabulares y evita diseñar relaciones",
      "Mover el modelo a Dataverse porque requiere relaciones, seguridad y capacidades de gobierno más robustas",
      "Usar Excel en OneDrive porque simplifica el licenciamiento y soporta auditoría nativa",
      "Crear una base SQL sin conectores para evitar depender de Power Platform"
      ],
      answer: [1],
      explanation: "Dataverse es la mejor opción cuando el escenario exige modelo relacional, seguridad granular y capacidades empresariales como auditoría y ALM. SharePoint y Excel pueden servir para casos simples, pero no resuelven igual de bien relaciones complejas ni gobierno; SQL además no elimina la necesidad de integración en Power Platform."
    },
    {
      type: "single",
      prompt: "Tu equipo quiere construir una solución y desplegar cambios con control entre desarrollo, pruebas y producción. ¿Qué estructura de ambientes es la más alineada con buenas prácticas?",
      options: [
      "Un único ambiente de producción donde analistas y usuarios finales prueban y publican",
      "Ambientes separados de Dev, Test/Sandbox y Prod con promoción controlada mediante soluciones",
      "Un ambiente personal por desarrollador como sustituto permanente de producción",
      "Solo un Sandbox compartido, porque producción puede actualizarse manualmente"
      ],
      answer: [1],
      explanation: "Separar Dev, Test/Sandbox y Prod reduce riesgo y permite validar antes de publicar, especialmente cuando se usan soluciones como contenedores ALM. Trabajar directamente en producción o depender solo de ambientes personales no ofrece trazabilidad ni control de promoción."
    },
    {
      type: "multi",
      prompt: "Una organización detecta proliferación de apps sin dueño claro, conectores premium no aprobados y flujos duplicados. ¿Qué DOS acciones ayudan más a gobernar la plataforma a escala?",
      options: [
      "Revisar inventario, telemetría y ownership desde Power Platform Admin Center y el CoE Starter Kit",
      "Permitir que cada creador configure sus propias políticas para acelerar la adopción",
      "Usar soluciones, inventario y métricas del CoE Starter Kit para identificar riesgo y estandarizar ALM",
      "Mover todos los recursos a ambientes personales para evitar controles centrales"
      ],
      answer: [0, 2],
      explanation: "Power Platform Admin Center y CoE Starter Kit ofrecen visibilidad operativa, ownership, uso de conectores y patrones de adopción para tomar decisiones de gobierno. Delegar políticas a cada maker o esconder activos en ambientes personales aumenta el riesgo y dificulta el control."
    },
    {
      type: "single",
      prompt: "Un área de negocio necesita reutilizar una app en varias regiones, cambiando solo URLs, IDs y conexiones por ambiente. ¿Qué enfoque facilita ese objetivo?",
      options: [
      "Copiar la app manualmente y editar valores fijos en cada publicación",
      "Guardar configuraciones en variables de entorno y usar connection references dentro de una solución",
      "Pedir a cada usuario que modifique los endpoints al iniciar sesión",
      "Crear una solución nueva por región sin versionado común"
      ],
      answer: [1],
      explanation: "Las Environment Variables y Connection References desacoplan configuración del artefacto para promover la solución entre ambientes o regiones sin editar manualmente cada componente. Copiar apps con valores hardcodeados genera deriva y errores operativos."
    },
    {
      type: "single",
      prompt: "El sponsor pregunta cuándo conviene licenciar una app con plan per-app en lugar de per-user. ¿Cuál respuesta es la más acertada?",
      options: [
      "Cuando pocos usuarios necesitan acceder a una solución específica con capacidades premium",
      "Cuando todos los empleados usarán múltiples apps premium en distintos procesos",
      "Cuando se quiere evitar el uso de conectores premium sin rediseñar la solución",
      "Cuando la organización no usa ambientes administrados"
      ],
      answer: [0],
      explanation: "Per-app suele ser conveniente cuando un grupo acotado consume una o pocas aplicaciones premium concretas; per-user encaja mejor si la misma persona utilizará varias apps o flujos premium. El tipo de ambiente no determina por sí solo el modelo de licenciamiento, y la licencia no reemplaza un buen diseño."
    },
    {
      type: "single",
      prompt: "Una empresa logística recibe cientos de albaranes en papel al día. El equipo quiere automatizar la extracción de datos sin entrenar un modelo propio. ¿Qué capacidad de AI Builder resuelve este caso directamente?",
      options: [
      "Modelo personalizado de clasificación de texto entrenado con datos propios",
      "Modelo prebuilt de Document Processing (extracción de formularios estructurados)",
      "Modelo de detección de objetos entrenado con imágenes de albaranes",
      "Business Card Reader aplicado a documentos PDF"
      ],
      answer: [1],
      explanation: "Document Processing (Form Processing) es el modelo prebuilt diseñado para extraer campos de formularios estructurados y repetibles como facturas, albaranes y contratos. No requiere entrenamiento propio cuando el layout es consistente. Business Card Reader extrae datos de tarjetas de presentación, no de documentos de negocio; y el modelo de detección de objetos trabaja con imágenes visuales, no con campos de texto en documentos."
    },
    {
      type: "single",
      prompt: "Un analista quiere agregar IA a un flujo de Power Automate para clasificar automáticamente los correos entrantes de soporte en categorías como 'Facturación', 'Técnico' y 'Ventas'. ¿Qué modelo de AI Builder es el más indicado?",
      options: [
      "Object Detection, porque analiza el contenido visual del correo",
      "Sentiment Analysis, porque determina si el cliente está satisfecho",
      "Text Classification, porque asigna el texto libre a categorías definidas por el negocio",
      "Language Detection, porque identifica el idioma del correo antes de clasificarlo"
      ],
      answer: [2],
      explanation: "Text Classification es el modelo de AI Builder diseñado para categorizar texto libre en etiquetas predefinidas del negocio, exactamente el caso de clasificar correos por tema. Sentiment Analysis devuelve positivo/negativo/neutral, no categorías de negocio. Object Detection trabaja con imágenes. Language Detection identifica el idioma pero no clasifica el contenido temáticamente."
    },
    {
      type: "multi",
      prompt: "Un equipo quiere usar AI Builder en producción para procesar documentos. ¿Qué DOS afirmaciones sobre los modelos prebuilt de AI Builder son correctas?",
      options: [
      "Los modelos prebuilt están listos para usar sin datos de entrenamiento propios",
      "Los modelos prebuilt consumen AI Builder Credits cada vez que procesan una inferencia",
      "Los modelos prebuilt son gratuitos e ilimitados en todos los planes de Microsoft 365",
      "Para Document Processing prebuilt se necesita siempre un conjunto de datos etiquetados por el usuario"
      ],
      answer: [0, 1],
      explanation: "Los modelos prebuilt de AI Builder no requieren entrenamiento propio — están listos desde el catálogo — y sí consumen AI Builder Credits con cada inferencia. Los créditos no son gratuitos ni ilimitados: se incluyen en ciertas licencias Premium o se adquieren por separado. Los modelos custom (no prebuilt) son los que sí requieren datos etiquetados del usuario para entrenamiento."
    },
    {
      type: "single",
      prompt: "El equipo de RR.HH. quiere que su Canvas App pueda leer tarjetas de presentación físicas que los candidatos entregan. ¿Qué componente de AI Builder deben agregar a la app?",
      options: [
      "Acción 'AI Builder — Analyze sentiment' en un flujo de Power Automate",
      "Control 'Business card reader' nativo de AI Builder en el lienzo de Canvas Apps",
      "Conector premium de Azure Cognitive Services configurado manualmente",
      "Modelo custom de extracción de entidades entrenado con 200 imágenes de tarjetas"
      ],
      answer: [1],
      explanation: "AI Builder ofrece un control nativo 'Business card reader' que se inserta directamente en una Canvas App sin código y sin configuración manual de Azure. Usar Azure Cognitive Services directamente requiere configuración extra y no es la ruta de bajo código. Un modelo custom es innecesario cuando existe el modelo prebuilt específico para tarjetas de presentación."
    },
    {
      type: "single",
      prompt: "Un responsable de IT pregunta dónde monitorear cuántos AI Builder Credits quedan disponibles en el tenant. ¿Cuál es el lugar correcto?",
      options: [
      "Power Apps Studio, en la sección de configuración de la app activa",
      "Power Platform Admin Center, en la sección de capacidad o licencias del tenant",
      "Azure Portal, en la sección de facturación de Cognitive Services",
      "Power Automate, en el historial de ejecuciones del flujo"
      ],
      answer: [1],
      explanation: "El consumo y saldo de AI Builder Credits se administra desde Power Platform Admin Center en la sección de capacidad del tenant. No se gestiona desde Azure Portal (los créditos de AI Builder son independientes de Azure Cognitive Services facturado directamente) ni desde la interfaz de una app o flujo individual."
    },
    {
      type: "single",
      prompt: "Un cliente quiere crear un portal web donde ciudadanos externos puedan registrar solicitudes de permisos municipales, consultar el estado de su trámite y adjuntar documentos, sin tener que ir en persona. ¿Qué herramienta de Power Platform es la más adecuada?",
      options: [
      "Canvas App compartida públicamente con acceso anónimo",
      "Model-Driven App accesible desde internet sin autenticación",
      "Power Pages, diseñado para experiencias web de usuarios externos sobre Dataverse",
      "Power BI Embedded en un sitio web público"
      ],
      answer: [2],
      explanation: "Power Pages es la herramienta de Power Platform diseñada específicamente para crear sitios web externos con usuarios fuera de la organización. Permite registro y login de ciudadanos (Azure AD B2C, redes sociales o cuenta local), formularios sobre Dataverse y vistas de estado del trámite. Canvas Apps no está diseñada para portales web públicos, Model-Driven requiere licencias internas, y Power BI no es una plataforma transaccional."
    },
    {
      type: "single",
      prompt: "Un administrador crea un portal de Power Pages y lo publica, pero los usuarios externos reportan que no pueden ver ni enviar ningún formulario — reciben error 403. ¿Cuál es la causa más probable?",
      options: [
      "El sitio está en modo de mantenimiento porque no se ha asignado un dominio personalizado",
      "No se han configurado Table Permissions para las tablas de Dataverse que usa el portal",
      "El portal necesita una licencia Azure AD B2C adicional para mostrar formularios",
      "El archivo CSS del tema tiene errores que bloquean el renderizado"
      ],
      answer: [1],
      explanation: "En Power Pages, por defecto todo el acceso a tablas de Dataverse está bloqueado. Es obligatorio configurar Table Permissions y asignarlas a los Web Roles correspondientes (como Anonymous User o Authenticated User). Sin Table Permissions, los formularios y vistas devuelven 403. El dominio personalizado no afecta los permisos de datos, y el CSS tampoco genera errores 403."
    },
    {
      type: "multi",
      prompt: "Un arquitecto define los criterios de diseño para un nuevo portal de Power Pages. ¿Qué DOS afirmaciones sobre Power Pages son correctas?",
      options: [
      "Power Pages permite autenticación con proveedores externos como Azure AD B2C, Google y Facebook",
      "Power Pages reemplaza a Canvas Apps para usuarios internos de la organización",
      "Los datos del portal provienen de tablas de Dataverse, configuradas mediante Table Permissions y Web Roles",
      "Cada ambiente de Power Platform puede tener un número ilimitado de portales de producción sin costo adicional"
      ],
      answer: [0, 2],
      explanation: "Power Pages soporta proveedores de identidad externos (Azure AD B2C, Google, Facebook, LinkedIn y cuenta local) y sus datos provienen de Dataverse controlados mediante Table Permissions y Web Roles. Power Pages no reemplaza a Canvas Apps para usuarios internos — son herramientas complementarias con audiencias distintas. Además, los portales de producción tienen costos y límites de capacidad por ambiente."
    },
    {
      type: "single",
      prompt: "Un desarrollador necesita implementar lógica condicional dentro de una página de Power Pages para mostrar un bloque de HTML solo si el usuario tiene el rol 'Proveedor Aprobado'. ¿Qué tecnología nativa de Power Pages usa para esto?",
      options: [
      "Power Fx directamente en la plantilla de la página web",
      "Liquid templates, que permiten condicionales y bucles dentro de páginas del portal",
      "JavaScript inline ejecutado en el servidor de Power Pages",
      "Un plug-in de Dataverse que modifica el HTML antes de enviarlo al navegador"
      ],
      answer: [1],
      explanation: "Liquid es el lenguaje de plantillas nativo de Power Pages para lógica de presentación en el servidor: condicionales ({% if %}), bucles ({% for %}) y acceso a datos del usuario o del portal. Power Fx no está disponible en páginas del portal, el JavaScript en Power Pages se ejecuta en el cliente (no en el servidor), y los plug-ins de Dataverse no manipulan HTML del portal."
    },
    {
      type: "single",
      prompt: "¿Cuál es la diferencia principal entre Power Pages y una Canvas App al evaluar qué usar para clientes externos?",
      options: [
      "Power Pages requiere licencia de Microsoft 365 para cada usuario externo; Canvas App no",
      "Power Pages está diseñado para usuarios externos sin licencia de Microsoft; Canvas Apps está diseñado para usuarios internos con licencia",
      "Canvas Apps soporta más tablas de Dataverse simultáneamente que Power Pages",
      "Power Pages solo funciona en dispositivos móviles; Canvas Apps funciona en web y móvil"
      ],
      answer: [1],
      explanation: "La diferencia fundamental de audiencia: Power Pages atiende a usuarios externos (ciudadanos, clientes, socios) que no tienen ni necesitan licencia de Microsoft 365, autenticándose con cuentas externas. Canvas Apps está pensada para usuarios internos que tienen licencia de Power Platform. Esta distinción determina cuál herramienta elegir según quién consume la experiencia."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (NovaBio): los formularios de no-conformidades llegaban incompletos porque nadie validaba los campos obligatorios antes de enviarlos. ¿Qué componente elimina ese problema desde su origen?",
      options: [
      "Power BI, con un dashboard que muestre cuántos registros están incompletos",
      "Power Apps Canvas, con validación de campos obligatorios antes de permitir el envío",
      "Dataverse, simplemente creando la tabla de no-conformidades",
      "Power Automate, notificando al responsable después de que el registro ya se guardó incompleto"
      ],
      answer: [1],
      explanation: "Validar en el formulario (Power Apps Canvas) impide que el registro incompleto llegue a existir. Dataverse solo almacena, Power BI solo reporta después del hecho, y Power Automate actúa sobre un registro que ya se guardó — ninguno de los tres previene el problema en el punto de origen.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (NovaBio): se necesita que, si el responsable no atiende una no-conformidad en 48 horas, el caso se escale automáticamente al supervisor sin intervención manual. ¿Qué componente implementa esa regla?",
      options: [
      "Power BI",
      "Una columna calculada en Dataverse",
      "Power Automate, con un flujo que evalúe el tiempo transcurrido y escale si no hay respuesta",
      "Power Apps Canvas, agregando un botón de 'escalar' manual"
      ],
      answer: [2],
      explanation: "La escalación condicionada al tiempo transcurrido es lógica de proceso automatizado — el dominio de Power Automate. Un botón manual (Canvas) depende de que alguien lo presione, lo que no garantiza la escalación; Power BI y una columna calculada no ejecutan acciones.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (NovaBio): el Jefe de Calidad necesita ver, de forma visual, el tiempo de cierre promedio agrupado por tipo de no-conformidad, área y responsable. ¿Qué componente cubre ese requisito?",
      options: [
      "Power Automate",
      "Power BI, con un dashboard de indicadores",
      "Field Security Profile en Dataverse",
      "Una Business Rule en el formulario de Power Apps"
      ],
      answer: [1],
      explanation: "Agregación, agrupación y visualización de indicadores es exactamente el rol de Power BI dentro de la solución. Los otros componentes (flujos, seguridad de campo, reglas de negocio) no están diseñados para reportes analíticos.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (NovaBio): ¿cuáles DOS resultados reales demostró la solución en los primeros 6 meses?",
      options: [
      "Se eliminaron los registros incompletos desde el primer día gracias a la validación en el formulario",
      "El tiempo de cierre promedio se redujo de 18 días a 6 días",
      "Fue necesario contratar desarrolladores externos especializados en código para mantener la solución",
      "El dashboard de Power BI reemplazó las decisiones del Jefe de Calidad"
      ],
      answer: [0, 1],
      explanation: "El caso reporta 100% de registros completos (vs 66% previo) desde el arranque y una reducción del tiempo de cierre de 18 a 6 días. Ningún componente requirió código ni desarrolladores externos, y el dashboard es una herramienta de apoyo a la decisión, no un reemplazo del rol del Jefe de Calidad.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (NovaBio): el equipo de Calidad configuró toda la solución en 3 semanas sin soporte externo. ¿Cuál es la razón principal, según el caso?",
      options: [
      "Contrataron a un desarrollador senior de forma temporal",
      "Usaron una plantilla predefinida de Microsoft específica para laboratorios farmacéuticos",
      "Ningún componente de la solución (Dataverse, Power Apps Canvas, Power Automate, Power BI) requirió código personalizado",
      "Redujeron el alcance del proceso de no-conformidades para simplificarlo"
      ],
      answer: [2],
      explanation: "El caso es explícito: 'Ningún componente requirió código'. Esa es la razón por la que un equipo de negocio, sin perfil técnico, pudo implementar la solución completa por su cuenta.",
      appliesTo: "caso"
    }
  ],
  2: [
    {
      type: "single",
      prompt: "Diseñas la tabla de Solicitudes y cada registro debe guardar el cliente relacionado para heredar navegación, formularios y seguridad del registro padre. ¿Qué tipo de columna debes usar?",
      options: [
      "Texto de una línea",
      "Elección",
      "Lookup",
      "Moneda"
      ],
      answer: [2],
      explanation: "Una columna Lookup crea una relación real con otra tabla y permite trabajar con navegación relacional, formularios y reglas asociadas. Un texto solo guarda el nombre visible, una elección no referencia registros y una moneda no representa relaciones."
    },
    {
      type: "single",
      prompt: "Tu equipo modela Cuentas y Pedidos. Una cuenta puede tener muchos pedidos, pero cada pedido pertenece a una sola cuenta. ¿Qué relación corresponde?",
      options: [
      "1:N desde Cuenta hacia Pedido",
      "N:N entre Cuenta y Pedido",
      "1:1 entre Cuenta y Pedido",
      "Una elección global compartida"
      ],
      answer: [0],
      explanation: "El patrón descrito es una relación uno a muchos: una cuenta puede asociarse a múltiples pedidos, mientras cada pedido apunta a un solo padre. N:N se usaría si un pedido pudiera pertenecer legítimamente a varias cuentas, lo cual no aplica aquí."
    },
    {
      type: "multi",
      prompt: "Vas a crear tablas personalizadas para una solución corporativa que después pasará por ALM. ¿Qué DOS decisiones son correctas desde el inicio?",
      options: [
      "Usar el prefijo del publisher de la solución en tablas y columnas personalizadas",
      "Aceptar el prefijo new_ porque luego puede cambiarse sin impacto",
      "Diferenciar tablas estándar y personalizadas para reutilizar lo existente antes de crear nuevas entidades",
      "Crear columnas duplicadas de tablas estándar para no depender de Dataverse"
      ],
      answer: [0, 2],
      explanation: "Usar el prefijo del publisher y evaluar primero tablas estándar evita deuda técnica y mejora mantenibilidad en ALM. El prefijo new_ suele ser una mala práctica en soluciones empresariales, y duplicar tablas estándar complica integración y reporting."
    },
    {
      type: "single",
      prompt: "En un formulario, el área de negocio quiere que el campo Fecha de cierre sea obligatorio solo cuando el estado sea Cerrado, sin desarrollo adicional. ¿Qué opción es la más adecuada?",
      options: [
      "Crear una Business Rule básica sobre el formulario o la tabla",
      "Cambiar el tipo de columna a Booleano",
      "Crear una vista personalizada",
      "Importar los datos nuevamente con otra plantilla"
      ],
      answer: [0],
      explanation: "Una Business Rule permite imponer lógica declarativa básica como obligatoriedad condicional sin escribir código. Cambiar el tipo de columna o una vista no implementa la validación requerida, e importar datos no resuelve comportamiento del formulario."
    },
    {
      type: "single",
      prompt: "Necesitas importar datos de Contactos y sus Empresas relacionadas a Dataverse minimizando errores de referencia. ¿Cuál es el mejor enfoque?",
      options: [
      "Importar primero Contactos y después Empresas para que Dataverse infiera la relación",
      "Importar primero Empresas y luego Contactos mapeando correctamente la columna de relación",
      "Guardar el nombre de la empresa en una columna de texto para evitar relaciones",
      "Cargar ambos archivos sin mapear claves porque Dataverse completará las coincidencias"
      ],
      answer: [1],
      explanation: "Primero debe existir la tabla padre para que los contactos puedan mapear correctamente el Lookup hacia la empresa. Guardar nombres en texto o confiar en coincidencias no controladas rompe integridad referencial y dificulta mantenimiento."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (TransCargo): en la auditoría no podían demostrar quién tenía qué equipo asignado ni en qué estado. ¿Qué elemento del modelo de datos resuelve directamente ese problema?",
      options: [
      "La tabla sit_activo, con el estado del equipo",
      "La tabla sit_asignacion, con Lookup a Activo y a Empleado, y fechas de inicio/devolución",
      "La tabla sit_mantenimiento, con historial de intervenciones",
      "La vista 'Seguros próximos a vencer'"
      ],
      answer: [1],
      explanation: "sit_asignacion es la tabla que relaciona activo y empleado con fechas de inicio y devolución — exactamente el dato que faltaba para saber quién tenía qué equipo y desde cuándo. sit_activo solo describe el activo, sit_mantenimiento es historial de reparaciones, y la vista de seguros es un filtro, no una relación.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (TransCargo): se necesita impedir que un activo marcado como 'En Mantenimiento' o 'Dado de Baja' pueda asignarse a un empleado. ¿Qué mecanismo de Dataverse implementa esa validación?",
      options: [
      "Una Business Rule sobre la tabla de asignación",
      "Una columna Rollup en sit_activo",
      "Un Field Security Profile sobre el campo estado",
      "Una vista filtrada por estado"
      ],
      answer: [0],
      explanation: "El caso es explícito: 'Business Rule: bloquea asignación si el activo está en estado En Mantenimiento o Dado de Baja'. Un Rollup agrega valores relacionados, un Field Security Profile controla permisos de campo, y una vista solo filtra qué se muestra, no bloquea la acción.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (TransCargo): se necesita anticipar los vencimientos de seguro 30 días antes de que ocurran, sin revisar manualmente los 120 vehículos. ¿Qué elemento de la solución cubre ese requisito?",
      options: [
      "La Business Rule de bloqueo de asignación",
      "La vista 'Seguros próximos a vencer', filtrada por fecha de vencimiento",
      "La tabla sit_mantenimiento",
      "El campo serial del activo"
      ],
      answer: [1],
      explanation: "Una vista filtrada por rango de fechas es el mecanismo declarativo para mostrar proactivamente los registros que vencen en una ventana de tiempo determinada, sin lógica adicional.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (TransCargo): ¿cuáles DOS elementos del modelo trabajan juntos para impedir que un equipo en mal estado sea asignado?",
      options: [
      "El campo estado en sit_activo (Disponible/Asignado/En Mantenimiento/Dado de Baja)",
      "La Business Rule que lee ese estado y bloquea la asignación si no es 'Disponible'",
      "El historial de sit_mantenimiento por sí solo",
      "La vista de seguros próximos a vencer por sí sola"
      ],
      answer: [0, 1],
      explanation: "El campo estado es el dato que se evalúa, y la Business Rule es la que actúa sobre ese dato para bloquear la asignación. El historial de mantenimiento y la vista de seguros son útiles pero no participan en esa validación específica.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (TransCargo): ¿por qué la trazabilidad se modeló con dos tablas relacionadas (sit_activo y sit_asignacion) en vez de agregar una sola columna 'asignado a' en sit_activo?",
      options: [
      "Porque Dataverse no permite columnas de tipo Lookup en la misma tabla del activo",
      "Porque se necesita el historial completo de asignaciones a lo largo del tiempo, no solo quién lo tiene ahora",
      "Porque una sola tabla no puede tener más de 10 columnas",
      "Porque las Business Rules solo funcionan con dos tablas relacionadas"
      ],
      answer: [1],
      explanation: "Una columna 'asignado a' solo guardaría el estado actual y perdería el historial. Una tabla de asignación con fechas de inicio/devolución permite múltiples registros por activo a lo largo del tiempo, exactamente lo que la auditoría necesitaba.",
      appliesTo: "caso"
    }
  ],
  3: [
    {
      type: "single",
      prompt: "Una Canvas App carga catálogos compartidos y variables globales una sola vez al abrirse. Además, cada pantalla debe refrescar un filtro local cuando el usuario navega a ella. ¿Cómo distribuyes la lógica?",
      options: [
      "Todo en OnVisible de cada pantalla",
      "Catálogos globales en App.OnStart y lógica específica de pantalla en OnVisible",
      "Todo en App.OnStart, incluso la lógica visual de cada pantalla",
      "Toda la lógica en el botón de navegación"
      ],
      answer: [1],
      explanation: "App.OnStart es apropiado para inicialización global y OnVisible para comportamiento que debe ejecutarse al entrar a una pantalla específica. Poner todo en un solo lugar vuelve la app menos predecible y dificulta mantenimiento."
    },
    {
      type: "single",
      prompt: "En una pantalla de detalle quieres almacenar temporalmente si el panel lateral está abierto, sin afectar otras pantallas. ¿Qué técnica conviene más?",
      options: [
      "Set(varPanelAbierto, true)",
      "UpdateContext({ ctxPanelAbierto: true })",
      "Collect(colPanel, { abierto: true })",
      "Patch(Configuracion, ... )"
      ],
      answer: [1],
      explanation: "UpdateContext crea variables de contexto limitadas a la pantalla, ideales para estado visual local. Set crea variables globales y colecciones o Patch serían innecesarios para una preferencia temporal de interfaz."
    },
    {
      type: "single",
      prompt: "El usuario edita una solicitud existente en un formulario flexible con varios controles sueltos y debes guardar solo algunos campos sin usar EditForm. ¿Qué función encaja mejor?",
      options: [
      "Collect()",
      "Patch()",
      "Navigate()",
      "LookUp()"
      ],
      answer: [1],
      explanation: "Patch permite crear o actualizar registros especificando exactamente qué campos enviar, incluso sin usar controles de formulario. Collect agrega elementos a una colección o origen, mientras Navigate y LookUp no persisten cambios."
    },
    {
      type: "multi",
      prompt: "Una app de inventario debe seguir funcionando temporalmente sin conexión para capturar conteos en campo. ¿Qué DOS enfoques son adecuados en Canvas Apps?",
      options: [
      "Cargar datos a colecciones locales y usar SaveData/LoadData para conservarlos en el dispositivo",
      "Depender de LookUp en tiempo real al origen para cada interacción sin caché local",
      "Registrar cambios en una colección local y sincronizarlos con Patch cuando vuelva la conectividad",
      "Guardar el estado offline en una variable de contexto sin persistencia y reiniciar la app"
      ],
      answer: [0, 2],
      explanation: "Las colecciones locales junto con SaveData/LoadData permiten trabajar offline y luego sincronizar con el origen cuando haya red. Consultar cada vez al origen o depender solo de variables en memoria pierde resiliencia y datos al cerrar la app."
    },
    {
      type: "single",
      prompt: "Tienes una galería de pedidos filtrados y al seleccionar una fila debes obtener un único registro detallado para otra pantalla. ¿Qué función suele ser la más adecuada?",
      options: [
      "Filter(Pedidos, Id = galPedidos.Selected.Id)",
      "LookUp(Pedidos, Pedido = galPedidos.Selected.Pedido)",
      "Collect(Pedidos, galPedidos.Selected)",
      "UpdateContext({ Pedido: Pedidos })"
      ],
      answer: [1],
      explanation: "LookUp está pensado para devolver un solo registro que cumpla una condición, por lo que encaja en escenarios de detalle. Filter devuelve una tabla, mientras Collect y UpdateContext no realizan la consulta deseada al origen."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Hotel Terramar): se necesita que el ingreso de un visitante no se considere autorizado hasta que el empleado visitado lo confirme, y que si no responde a tiempo, escale a otra persona. ¿Qué mecanismo del caso implementa esa regla?",
      options: [
      "La galería de visitas activas",
      "El botón de 'marcar salida'",
      "Un flujo que notifica al empleado y escala al jefe de seguridad si no confirma en 5 minutos",
      "La foto tomada con la cámara integrada"
      ],
      answer: [2],
      explanation: "El caso describe exactamente esta regla de tiempo y escalación, que es lógica de proceso automatizado (Power Automate), no algo que la galería, el botón de salida o la foto puedan implementar por sí solos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Hotel Terramar): ¿por qué se eligió una Canvas App en tablet para recepción, en vez de una Model-Driven App?",
      options: [
      "Porque Model-Driven Apps no pueden conectarse a Dataverse",
      "Porque se necesita una experiencia simple orientada a un dispositivo específico, con acceso a la cámara del tablet",
      "Porque Canvas Apps no requieren licencia de Power Apps",
      "Porque Model-Driven Apps no permiten crear registros"
      ],
      answer: [1],
      explanation: "Canvas Apps dan control total del diseño y acceso a capacidades del dispositivo como la cámara, ideal para una experiencia táctil simple en un tablet de recepción. Una Model-Driven App está pensada para gestión de datos tabular, no para esta experiencia de captura rápida.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Hotel Terramar): ¿qué dato adicional, más allá de nombre, empresa y persona a visitar, refuerza específicamente la seguridad del registro de visitas?",
      options: [
      "El color del uniforme del recepcionista",
      "La foto del visitante tomada con la cámara integrada",
      "El número de habitaciones del hotel",
      "El nombre del proveedor de la app"
      ],
      answer: [1],
      explanation: "La foto capturada en el momento del registro es la evidencia visual que permite verificar identidad ante cualquier incidente — el resto de las opciones no son parte de la solución.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Hotel Terramar): la auditoría de seguridad detectó personas no autorizadas en zonas restringidas sin registro. ¿Cuál era la causa raíz según el caso?",
      options: [
      "El sistema Dataverse tenía un error de sincronización",
      "El control de visitas era un cuaderno manual, sin trazabilidad de horarios ni de a quién visitaban",
      "Los empleados no confirmaban las visitas por falta de capacitación",
      "El hotel no tenía cámaras de seguridad"
      ],
      answer: [1],
      explanation: "El caso señala explícitamente que el control era un cuaderno manual sin trazabilidad — la causa raíz es la ausencia de un sistema digital de registro y confirmación, no un problema técnico o de capacitación.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Hotel Terramar): ¿cuáles DOS resultados reales demuestra el caso tras la implementación?",
      options: [
      "Control de acceso en tiempo real desde el primer día de implementación",
      "Registro digital del 100% de las visitas con foto y hora exacta",
      "Eliminación total de la necesidad de personal de recepción",
      "Un tiempo de implementación de 6 meses con un equipo de 5 desarrolladores"
      ],
      answer: [0, 1],
      explanation: "El caso reporta control en tiempo real desde el día uno y trazabilidad del 100% de las visitas. La app no reemplaza al recepcionista, y el tiempo real de implementación fue de 2 semanas con 1 desarrollador junior.",
      appliesTo: "caso"
    }
  ],
  4: [
    {
      type: "single",
      prompt: "Una organización quiere una aplicación centrada en procesos de ventas con tablas relacionadas, formularios estándar, seguridad por roles y poco esfuerzo de diseño de interfaz. ¿Qué opción deberías recomendar?",
      options: [
      "Canvas App porque siempre reemplaza a Model-Driven",
      "Model-Driven App porque aprovecha directamente el modelo de datos y la seguridad de Dataverse",
      "Power BI porque permite navegar entre registros",
      "Un flujo instantáneo de Power Automate con aprobaciones"
      ],
      answer: [1],
      explanation: "Model-Driven es ideal cuando la experiencia gira alrededor de datos, relaciones, formularios y seguridad nativa de Dataverse. Canvas da más libertad visual, pero exigiría más trabajo para reproducir capacidades estándar del escenario descrito."
    },
    {
      type: "single",
      prompt: "Los usuarios necesitan crear contactos rápidos desde una subcuadrícula sin abrir el formulario principal completo. ¿Qué tipo de formulario ayuda más?",
      options: [
      "Main form",
      "Card form",
      "Quick Create form",
      "Quick View form"
      ],
      answer: [2],
      explanation: "Quick Create está diseñado para capturar registros con un conjunto mínimo de campos desde contextos rápidos. Quick View solo muestra información relacionada, mientras Main y Card no optimizan la creación ligera pedida."
    },
    {
      type: "multi",
      prompt: "Un director quiere guiar al equipo comercial por etapas de oportunidad y además aplicar validaciones simples sin código en el formulario. ¿Qué DOS elementos de Model-Driven cubren mejor la necesidad?",
      options: [
      "Business Process Flow para guiar etapas y ramificaciones del proceso",
      "Business Rules para aplicar lógica declarativa como mostrar u obligar campos",
      "Dashboard personal para impedir cambios fuera de proceso",
      "Quick View forms para reemplazar la seguridad de tabla"
      ],
      answer: [0, 1],
      explanation: "Business Process Flow estructura el proceso de negocio por etapas, y Business Rules cubren validaciones declarativas en formularios o tabla. Dashboards y Quick View son útiles para visualización, pero no reemplazan control de proceso ni reglas de entrada."
    },
    {
      type: "single",
      prompt: "El gerente de operaciones quiere una vista disponible para todos los usuarios del área con el mismo filtro y columnas, administrada centralmente. ¿Qué tipo de vista corresponde?",
      options: [
      "Personal view creada por cada usuario",
      "System/Public view administrada en la solución",
      "Quick Find view solamente",
      "Dashboard interactivo"
      ],
      answer: [1],
      explanation: "Las System/Public views permiten definir un listado común y gobernado para toda la organización o una audiencia amplia. Las vistas personales sirven para necesidades individuales y no garantizan consistencia central."
    },
    {
      type: "single",
      prompt: "Necesitas agregar una nueva sección en la navegación de la app para que soporte incidencias, activos y contratos. ¿Qué elemento debes modificar principalmente?",
      options: [
      "Sitemap",
      "Business Rule",
      "Security Role",
      "Quick View form"
      ],
      answer: [0],
      explanation: "El Sitemap define la navegación y agrupación de áreas, tablas y páginas dentro de una Model-Driven App. Security Roles controlan acceso, pero no reorganizan menús; formularios y reglas tampoco estructuran navegación global."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (CRM PyME): según el Business Process Flow del caso, ¿cuál es el orden correcto de las etapas?",
      options: [
      "Opportunity → Lead → Quote → Won/Lost",
      "Lead → Opportunity → Quote → Won/Lost",
      "Quote → Lead → Opportunity → Won/Lost",
      "Lead → Quote → Opportunity → Won/Lost"
      ],
      answer: [1],
      explanation: "El caso define explícitamente el flujo Lead → Opportunity → Quote → Won/Lost: primero se califica el prospecto, luego se convierte en oportunidad, después se cotiza y finalmente se gana o pierde.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (CRM PyME): un prospecto que todavía no ha sido calificado como oportunidad de venta se representa en este modelo con la tabla:",
      options: [
      "Account",
      "Opportunity",
      "Lead",
      "Quote"
      ],
      answer: [2],
      explanation: "Lead representa al prospecto antes de calificarse; solo al calificarlo avanza a Opportunity según el Business Process Flow del caso.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (CRM PyME): cuando un Lead se califica y se convierte en una negociación de venta activa, ¿a qué tabla pasa según el modelo del caso?",
      options: [
      "Contact",
      "Opportunity",
      "Account",
      "Sigue siendo Lead, solo cambia de estado"
      ],
      answer: [1],
      explanation: "El Business Process Flow del caso mueve al prospecto calificado de Lead a Opportunity — son tablas distintas, no un cambio de estado dentro de la misma.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (CRM PyME): el dashboard 'Top 10 clientes por revenue' necesita agregar el revenue generado por cada cliente. ¿Sobre qué tabla del modelo se construye principalmente ese dashboard?",
      options: [
      "Lead, porque ahí están los prospectos",
      "Account, agregando el revenue de sus Opportunities/Quotes relacionadas",
      "Contact, porque tiene el nombre del cliente",
      "Quote, de forma aislada sin relacionarla con el cliente"
      ],
      answer: [1],
      explanation: "Account representa al cliente (empresa); el revenue se agrega desde sus oportunidades/cotizaciones relacionadas hacia esa cuenta, no desde Lead (ya calificado y convertido) ni desde Contact (persona, no la entidad que factura) de forma aislada.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (CRM PyME): ¿cuáles DOS tablas del modelo representan personas u organizaciones, y no una etapa del proceso de venta?",
      options: [
      "Account",
      "Contact",
      "Opportunity",
      "Quote"
      ],
      answer: [0, 1],
      explanation: "Account (empresa) y Contact (persona) son las entidades del modelo; Opportunity y Quote representan etapas/artefactos del proceso comercial, no personas u organizaciones.",
      appliesTo: "caso"
    }
  ],
  5: [
    {
      type: "single",
      prompt: "Cada lunes a las 8:00 AM debe enviarse un resumen de tickets vencidos al supervisor, aunque no ocurra ningún evento nuevo. ¿Qué tipo de flujo es el más apropiado?",
      options: [
      "Instant cloud flow",
      "Automated cloud flow con trigger manual",
      "Scheduled cloud flow",
      "Desktop flow desencadenado por UI"
      ],
      answer: [2],
      explanation: "Un Scheduled cloud flow se ejecuta por recurrencia y no depende de intervención humana ni de un evento externo. Los flujos instantáneos son manuales y los desktop flows se reservan para automatización de interfaz o escenarios RPA."
    },
    {
      type: "single",
      prompt: "Después de obtener una lista de aprobadores desde Dataverse, Power Automate inserta automáticamente un Apply to each al agregar la acción de correo. ¿Cuál es la razón más probable?",
      options: [
      "Porque el diseñador detectó una salida tipo colección y necesita iterar cada elemento",
      "Porque cualquier acción de correo siempre requiere un bucle",
      "Porque Dataverse no permite enviar correos directos",
      "Porque la variable de entorno obliga a usar Do Until"
      ],
      answer: [0],
      explanation: "Apply to each aparece cuando la salida es una matriz y cada elemento debe procesarse individualmente. No todas las acciones de correo necesitan bucle; el comportamiento depende del tipo de datos devuelto por pasos previos."
    },
    {
      type: "multi",
      prompt: "Un flujo de aprobación debe notificar al solicitante si la aprobación falla o expira, sin ocultar el error operativo al soporte. ¿Qué DOS acciones son buenas prácticas básicas?",
      options: [
      "Usar Configure run after para ejecutar una rama de notificación cuando falle la aprobación",
      "Eliminar todos los errores para que el historial muestre siempre éxito",
      "Registrar en una variable o mensaje el resultado del flujo para facilitar diagnóstico",
      "Poner todas las acciones en paralelo sin dependencias ni condiciones"
      ],
      answer: [0, 2],
      explanation: "Configurar ramas posteriores al fallo y dejar evidencia del resultado facilita soporte y evita errores silenciosos. Ocultar fallos o paralelizar sin control reduce trazabilidad y puede enviar mensajes inconsistentes al negocio."
    },
    {
      type: "single",
      prompt: "Necesitas reintentar consultar una carpeta de SharePoint hasta que aparezca un archivo generado por otro sistema, con un máximo de 10 intentos. ¿Qué construcción del flujo encaja mejor?",
      options: [
      "Do Until",
      "Switch",
      "Approval",
      "Child flow"
      ],
      answer: [0],
      explanation: "Do Until permite repetir acciones hasta cumplir una condición o alcanzar un límite de iteraciones, exactamente lo que requiere la espera controlada del archivo. Switch y Approval responden a otros patrones, y Child flow es para reutilización, no para polling."
    },
    {
      type: "single",
      prompt: "Un jefe quiere aprobar solicitudes desde Outlook o Teams con trazabilidad de quién aprobó y cuándo. ¿Qué capacidad de Power Automate aporta más valor?",
      options: [
      "Aprobaciones integradas con historial y respuestas estandarizadas",
      "Variables enteras para llevar el conteo de correos",
      "Un flujo de escritorio que mueva el mouse del aprobador",
      "Una condición sin trigger"
      ],
      answer: [0],
      explanation: "Las Approval actions entregan trazabilidad, asignación y experiencia consistente para aprobar o rechazar desde canales comunes. Variables o flujos de escritorio no sustituyen el modelo de aprobación ni su registro auditable."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Onboarding): el flujo 'Nuevo Empleado Registrado' se dispara automáticamente. ¿Qué evento lo activa, según el caso?",
      options: [
      "Que alguien lo ejecute manualmente desde un botón",
      "Que se cree un registro en la tabla 'Empleado' en Dataverse",
      "Que llegue un correo de Recursos Humanos",
      "Que pasen 24 horas sin actividad"
      ],
      answer: [1],
      explanation: "El caso especifica un trigger automático: 'Crear registro en tabla Empleado (Dataverse)'. No depende de una ejecución manual, un correo, ni de un temporizador.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Onboarding): el flujo 'Proceso de Aprobación de Equipamiento' usa un trigger de tipo Instant, llamado desde una Model-Driven App. ¿Qué implica esto?",
      options: [
      "Se ejecuta automáticamente cada vez que cambia cualquier registro",
      "Se invoca bajo demanda, cuando alguien lo dispara manualmente desde la app",
      "Se ejecuta según un horario programado",
      "Se ejecuta solo si falla el flujo de onboarding"
      ],
      answer: [1],
      explanation: "Un trigger Instant se dispara manualmente (por ejemplo, un botón en una Model-Driven App), a diferencia de un trigger automático por cambio de datos o uno programado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Onboarding): ¿cuál de estas acciones del flujo de onboarding depende de un sistema externo a Power Platform, integrado vía HTTP?",
      options: [
      "Crear cuenta Azure AD (HTTP a Graph API)",
      "Crear registro en la tabla Empleado en Dataverse",
      "Evaluar la condición del flujo",
      "Asignar el flujo a un ambiente Developer"
      ],
      answer: [0],
      explanation: "El caso especifica que la creación de la cuenta Azure AD se hace mediante una llamada HTTP a Microsoft Graph API — una integración explícita con un sistema/API externo al flujo mismo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Onboarding): el ticket para que el equipo de IT prepare laptop y accesos se crea en:",
      options: [
      "Una tabla nativa de Dataverse llamada 'Ticket'",
      "ServiceNow, un sistema externo integrado desde el flujo",
      "Un archivo Excel adjunto al correo de bienvenida",
      "El mismo registro de la tabla Empleado"
      ],
      answer: [1],
      explanation: "El caso indica explícitamente 'Crear ticket en ServiceNow para equipo IT' — un sistema de gestión de tickets externo, no una tabla de Dataverse ni parte del registro de Empleado.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Onboarding): ¿cuáles DOS acciones del flujo de onboarding ocurren en sistemas externos a Power Platform, integrados vía conector o HTTP?",
      options: [
      "Crear cuenta Azure AD (HTTP a Graph API)",
      "Crear ticket en ServiceNow para equipo IT",
      "Crear registro en la tabla Empleado en Dataverse",
      "Enviar email de bienvenida con credenciales temporales"
      ],
      answer: [0, 1],
      explanation: "La cuenta Azure AD (vía Graph API) y el ticket en ServiceNow son integraciones con sistemas externos. Crear el registro en Dataverse es el trigger interno del propio flujo, y el correo de bienvenida usa el conector nativo de Office 365.",
      appliesTo: "caso"
    }
  ],
  6: [
    {
      type: "single",
      prompt: "Debes construir un reporte de ventas con buen rendimiento y filtros claros entre hechos y dimensiones. ¿Qué modelo conviene priorizar?",
      options: [
      "Modelo estrella con tabla de hechos y dimensiones separadas",
      "Una sola tabla plana con todas las columnas repetidas",
      "Modelo copo de nieve con la mayor cantidad posible de joins innecesarios",
      "Múltiples archivos Excel sin relaciones"
      ],
      answer: [0],
      explanation: "El modelo estrella simplifica navegación, mejora comprensión del negocio y suele favorecer desempeño y DAX más claro. Aplanar todo o multiplicar relaciones sin necesidad complica mantenimiento y puede degradar rendimiento."
    },
    {
      type: "single",
      prompt: "El origen trae fechas mal formateadas, columnas combinadas y valores nulos. ¿Dónde deberías resolver primero esas transformaciones?",
      options: [
      "En Power Query durante el proceso ETL",
      "En una tarjeta del dashboard",
      "En RLS",
      "En la publicación del workspace"
      ],
      answer: [0],
      explanation: "Power Query está diseñado para limpieza y transformación del dato antes del modelado y las visualizaciones. Una tarjeta, RLS o la publicación no reemplazan la preparación estructurada del dataset."
    },
    {
      type: "single",
      prompt: "Un gerente necesita distribuir un conjunto curado de reportes a un grupo amplio sin dar acceso de edición al workspace. ¿Qué alternativa suele ser mejor?",
      options: [
      "Compartir el PBIX por correo como archivo local",
      "Publicar el contenido como una App de Power BI",
      "Dar permisos de Member del workspace a todos los consumidores",
      "Crear una medida DAX adicional"
      ],
      answer: [1],
      explanation: "Las Apps de Power BI permiten distribuir contenido empaquetado y controlado a consumidores finales sin exponer privilegios de edición del workspace. Compartir el PBIX o elevar permisos de workspace aumenta riesgo de cambios no deseados."
    },
    {
      type: "multi",
      prompt: "Diseñas un reporte de margen por región que debe respetar acceso por territorio y refrescarse diariamente desde el servicio. ¿Qué DOS configuraciones son claves?",
      options: [
      "Definir Row-Level Security para limitar los datos visibles por usuario o rol",
      "Publicar sin programar refresh porque Power BI Service siempre actualiza en tiempo real",
      "Configurar actualización programada del dataset en Power BI Service",
      "Reemplazar RLS por filtros personales guardados en el navegador"
      ],
      answer: [0, 2],
      explanation: "RLS protege qué filas puede ver cada audiencia, y el refresh programado garantiza que el dataset del servicio se mantenga actualizado según el SLA esperado. Filtros personales no son seguridad, y el servicio no refresca mágicamente sin configuración."
    },
    {
      type: "single",
      prompt: "Quieres mostrar tendencia mensual de ingresos, valor actual acumulado y el detalle por producto y región en una sola página. ¿Qué visual encaja mejor para el detalle tabular cruzado?",
      options: [
      "Tarjeta",
      "Gráfico de líneas",
      "Matriz",
      "Segmentador"
      ],
      answer: [2],
      explanation: "La matriz es adecuada para analizar intersecciones entre dimensiones como producto y región, con totales y subtotales. La tarjeta y el gráfico de líneas sirven para KPI y tendencia, pero no para el detalle cruzado solicitado."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Dashboard Ejecutivo de Ventas): el caso combina D365 Sales, SQL Server histórico y Excel de targets en un solo modelo. ¿Qué capacidad de Power BI hace posible unificar estas 3 fuentes heterogéneas?",
      options: [
      "Power Query y el modelo de datos, que permiten conectar y relacionar múltiples orígenes",
      "Un solo gráfico de tarjeta por cada fuente, sin relacionarlas",
      "Exportar todo a un archivo Excel único antes de conectar Power BI",
      "Power BI solo puede conectarse a una fuente por reporte"
      ],
      answer: [0],
      explanation: "Power Query (para extraer y transformar) junto con el modelo de datos (para relacionar tablas de distintos orígenes) es lo que permite a Power BI combinar D365 Sales, SQL Server y Excel en un único modelo analítico.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Dashboard Ejecutivo de Ventas): el KPI 'Revenue actual vs target' necesita datos de D365 Sales Y de Excel (targets mensuales) al mismo tiempo. ¿Qué implica esto sobre el modelo?",
      options: [
      "Que el KPI puede calcularse con una sola fuente y se ignora la otra",
      "Que se necesita relacionar tablas de distintos orígenes en el mismo modelo",
      "Que Excel debe eliminarse del reporte para simplificarlo",
      "Que D365 Sales ya trae los targets mensuales de fábrica"
      ],
      answer: [1],
      explanation: "Como el revenue real vive en D365 Sales y el target vive en Excel, el modelo debe relacionar ambas fuentes (por ejemplo, por vendedor y periodo) para poder comparar una contra la otra.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Dashboard Ejecutivo de Ventas): 'Customer Acquisition Cost (CAC)' es una métrica calculada que no existe como campo directo en ninguna fuente. ¿Qué mecanismo de Power BI la produce?",
      options: [
      "Una medida DAX",
      "Un segmentador (slicer)",
      "Un gráfico de líneas",
      "Una columna de texto importada de Excel"
      ],
      answer: [0],
      explanation: "Las métricas derivadas que combinan varios valores (por ejemplo, costo de adquisición dividido entre clientes nuevos) se calculan con medidas DAX, no con visuales ni columnas importadas directamente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Dashboard Ejecutivo de Ventas): la Gerencia necesita ver de inmediato si el revenue actual está por debajo, en línea o por encima del target, sin leer números exactos. ¿Qué recurso visual del caso resuelve eso?",
      options: [
      "Una tabla con miles de filas de detalle",
      "Un semáforo (indicador visual) sobre el KPI de revenue vs target",
      "Una matriz de producto x región",
      "Un campo de texto libre"
      ],
      answer: [1],
      explanation: "El caso menciona explícitamente 'Revenue actual vs target (con semáforo)' — un indicador visual de color es lo que permite una lectura instantánea del estado, a diferencia de una tabla detallada.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Dashboard Ejecutivo de Ventas): ¿cuáles DOS fuentes del caso NO provienen nativamente de Dynamics 365 y requieren integración adicional en Power BI?",
      options: [
      "SQL Server (histórico transaccional)",
      "Excel (targets mensuales)",
      "D365 Sales — Opportunities",
      "D365 Sales — Accounts"
      ],
      answer: [0, 1],
      explanation: "SQL Server y Excel son fuentes externas a Dynamics 365 que deben conectarse e integrarse explícitamente en el modelo; Opportunities y Accounts ya son datos nativos de D365 Sales.",
      appliesTo: "caso"
    }
  ],
  7: [
    {
      type: "single",
      prompt: "Tienes una colección de clientes y necesitas recuperar exactamente un registro por correo electrónico para mostrarlo en un formulario. ¿Qué función es la más adecuada?",
      options: [
      "Filter",
      "LookUp",
      "Concatenate",
      "IsEmpty"
      ],
      answer: [1],
      explanation: "LookUp devuelve un único registro que cumpla la condición, por lo que es ideal para búsquedas puntuales. Filter retorna una tabla de resultados y las otras funciones no están orientadas a recuperación de registros."
    },
    {
      type: "single",
      prompt: "Tu app usa un EditForm conectado a Dataverse y quieres respetar validaciones del formulario, Required y modo New/Edit sin escribir mapeo campo por campo. ¿Qué opción conviene más?",
      options: [
      "Patch",
      "SubmitForm",
      "Collect",
      "Switch"
      ],
      answer: [1],
      explanation: "SubmitForm aprovecha el comportamiento nativo de un formulario: validación, modos y envío del registro sin mapear manualmente cada control. Patch es más flexible para actualizaciones personalizadas, pero exige definir explícitamente los campos."
    },
    {
      type: "single",
      prompt: "Un control debe mostrar un texto distinto según el estado: Nuevo, En progreso, Cerrado u otro valor no contemplado. ¿Qué fórmula suele quedar más clara?",
      options: [
      "If con diez condiciones anidadas aunque solo haya un campo a evaluar",
      "Switch sobre el estado con un valor por defecto",
      "DateDiff entre los estados",
      "Patch para cambiar el texto"
      ],
      answer: [1],
      explanation: "Switch es más legible cuando una sola expresión puede tomar varios valores discretos y se desea un fallback. Un If anidado funcionaría, pero es menos mantenible para este patrón concreto; las otras opciones no resuelven el problema."
    },
    {
      type: "multi",
      prompt: "Tu fuente es grande y está en Dataverse. ¿Qué DOS fórmulas son más seguras desde la perspectiva de delegación para búsquedas frecuentes?",
      options: [
      "Filter(Casos, Estado = \"Abierto\")",
      "Filter(Casos, StartsWith(Titulo, txtBuscar.Text))",
      "Filter(Casos, Left(Titulo, 3) = \"ABC\")",
      "Filter(Casos, CountRows(Notas) > 0)"
      ],
      answer: [0, 1],
      explanation: "Las comparaciones simples y patrones como StartsWith suelen ser opciones más delegables para trabajar con grandes volúmenes en Dataverse. Funciones como Left o agregados sobre datos relacionados pueden forzar procesamiento local y devolver resultados incompletos."
    },
    {
      type: "single",
      prompt: "Dentro de una galería, un botón debe guardar el ID del registro de la fila actual, mientras otro comportamiento debe cambiar el color del propio botón que el usuario pulsó. ¿Qué referencias corresponden?",
      options: [
      "ThisItem para el control y Self para el registro",
      "Self para el registro y ThisItem para el control",
      "ThisItem para el registro actual y Self para el control actual",
      "Ambos deben resolverse siempre con variables globales"
      ],
      answer: [2],
      explanation: "ThisItem referencia el registro del contexto de la galería y Self hace referencia al control que evalúa la fórmula. Invertirlos provoca fórmulas incorrectas y usar variables globales para todo complica innecesariamente el diseño."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (MediSupply): los analistas tardaban 4 horas diarias calculando manualmente cuándo pedir cada uno de los 8,000 SKUs. ¿Qué elemento de la solución elimina ese cálculo manual?",
      options: [
      "Una tabla adicional en Dataverse para guardar los resultados",
      "Fórmulas Power Fx que calculan en tiempo real consumo promedio, días de stock y cantidad sugerida",
      "Un reporte de Power BI que se actualiza una vez al día",
      "Un flujo de Power Automate que envía un correo diario con los cálculos"
      ],
      answer: [1],
      explanation: "El caso especifica que las fórmulas Power Fx calculan estos valores en tiempo real dentro de la Canvas App — es el cálculo mismo, no solo el almacenamiento o la notificación, lo que reemplaza el proceso manual.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (MediSupply): con 8,000 SKUs, el analista no puede revisar todos manualmente cada día. ¿Qué técnica del caso muestra solo los productos que requieren acción hoy?",
      options: [
      "Ordenar la tabla completa por nombre de producto",
      "Una Gallery filtrada automáticamente por la condición de stock crítico (< 15 días o < 20% del ideal)",
      "Exportar los 8,000 SKUs a Excel cada mañana",
      "Un formulario que el analista debe llenar manualmente por producto"
      ],
      answer: [1],
      explanation: "El caso describe una Gallery filtrada automáticamente por la condición de urgencia, de modo que solo aparecen los productos que realmente requieren revisión — no los 8,000 SKUs completos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (MediSupply): los colores semáforo (verde/amarillo/rojo) de cada producto se determinan por:",
      options: [
      "Una columna fija asignada manualmente por el analista en Dataverse",
      "El nivel de urgencia calculado en tiempo real por una fórmula Power Fx",
      "El orden alfabético del nombre del producto",
      "Un valor aleatorio para llamar la atención del analista"
      ],
      answer: [1],
      explanation: "El caso indica que los colores semáforo dependen del nivel de urgencia calculado por Power Fx — es dinámico, no un valor fijo asignado manualmente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (MediSupply): al presionar el botón 'Generar Orden', se debe crear la solicitud de compra Y notificar al proveedor. ¿Qué combinación de componentes ejecuta esa acción completa?",
      options: [
      "Solo Power Fx, sin ningún otro componente",
      "Dataverse (crea el registro de la solicitud) + Power Automate (notifica al proveedor)",
      "Solo Power BI, generando un reporte",
      "Solo una Business Rule sobre la tabla de productos"
      ],
      answer: [1],
      explanation: "El caso describe que el botón crea la solicitud en Dataverse y notifica al proveedor vía Power Automate — dos componentes distintos trabajando juntos, no uno solo.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (MediSupply): ¿cuáles DOS resultados cuantificables demuestra el caso tras implementar la solución?",
      options: [
      "Reducción del 71% en quiebres de stock de productos críticos en el primer trimestre",
      "Ahorro estimado de $180,000 USD anuales en costos de urgencia y pérdidas por vencimiento",
      "Eliminación total de la necesidad de mantener inventario de seguridad",
      "Reducción del número de SKUs administrados de 8,000 a 2,000"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente una reducción del 71% en quiebres de stock crítico y un ahorro estimado de $180,000 USD anuales. No elimina el inventario de seguridad ni reduce el número de SKUs administrados.",
      appliesTo: "caso"
    }
  ],
  8: [
    {
      type: "single",
      prompt: "Tu equipo inicia un proyecto integrado con requerimientos para operación móvil, analítica ejecutiva y mantenimiento por área comercial. ¿Qué principio arquitectónico conviene adoptar primero?",
      options: [
      "Diseñar primero las pantallas y decidir el modelo de datos al final",
      "Diseño data-first para definir tablas, relaciones y seguridad antes de repartir experiencias",
      "Crear un dashboard de Power BI y usarlo como origen maestro del proceso",
      "Empezar por producción para validar con usuarios reales"
      ],
      answer: [1],
      explanation: "Un enfoque data-first asegura consistencia del modelo, seguridad y reutilización antes de elegir si cada audiencia consume Canvas, Model-Driven o Power BI. Diseñar la UI primero suele generar retrabajo y soluciones desacopladas del dato."
    },
    {
      type: "single",
      prompt: "Necesitas que la misma solución funcione en Dev, Test y Prod sin cambiar manualmente IDs de conexión ni endpoints. ¿Qué combinación es la más adecuada?",
      options: [
      "Notas en Excel para recordar qué cambiar en cada importación",
      "Connection References y Environment Variables dentro de la solución",
      "Copias separadas de la app por ambiente sin solución",
      "Prefijos de columnas distintos por ambiente"
      ],
      answer: [1],
      explanation: "Connection References y Environment Variables permiten promover artefactos entre ambientes manteniendo configuración desacoplada del código. Copias manuales o convenciones de nombre por ambiente incrementan errores y rompen ALM."
    },
    {
      type: "multi",
      prompt: "Debes preparar una entrega a producción y otra a un partner para continuar desarrollo en paralelo. ¿Qué DOS decisiones son correctas respecto a soluciones?",
      options: [
      "Exportar Managed para producción cuando quieres proteger componentes y controlar cambios directos",
      "Usar Unmanaged en producción para que soporte haga cambios rápidos sin gobernanza",
      "Mantener una solución Unmanaged en desarrollo para continuar iterando y versionando",
      "Evitar versionado porque el historial de cambios ya lo lleva Dataverse"
      ],
      answer: [0, 2],
      explanation: "Managed en producción ayuda a controlar personalizaciones directas, mientras Unmanaged en desarrollo facilita evolución y empaquetado iterativo. Saltarse versionado o abrir producción a cambios rápidos degrada trazabilidad y calidad."
    },
    {
      type: "single",
      prompt: "Durante el primer sprint un desarrollador propone dejar Security Roles para el final porque 'primero hay que mostrar valor'. ¿Cuál es la mejor respuesta?",
      options: [
      "Aceptar, porque la seguridad siempre puede añadirse al final sin impacto",
      "Definir roles y acceso mínimo desde el inicio para evitar rediseño y exposición indebida",
      "Ocultar solo los botones de la app y posponer la seguridad de datos",
      "Usar una sola cuenta compartida para simplificar pruebas"
      ],
      answer: [1],
      explanation: "La seguridad debe incorporarse desde el diseño para evitar fugas de datos y retrabajo cuando el modelo ya esté extendido. Ocultar botones o usar cuentas compartidas no sustituye controles reales sobre Dataverse."
    },
    {
      type: "single",
      prompt: "El proyecto usa tablas y columnas con prefijos distintos como new_, dev_ y corp_ dentro de la misma solución. ¿Qué riesgo es más relevante?",
      options: [
      "Ninguno, los prefijos solo afectan la interfaz visual del maker",
      "Incrementa deuda técnica, dificulta ALM y complica reconocer qué componentes pertenecen al publisher correcto",
      "Hace que Power BI no pueda conectarse al ambiente",
      "Impide usar Connection References"
      ],
      answer: [1],
      explanation: "La inconsistencia de prefijos afecta mantenibilidad, identificación de componentes y gobernanza de la solución en todo el ciclo de vida. No bloquea técnicamente Power BI o Connection References, pero sí deteriora la calidad del modelo."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora Andina): el problema real no era la falta de solicitudes, sino la ausencia de trazabilidad y control de costos al gestionarlas por WhatsApp y correos. ¿Qué componente centraliza los datos para hacerlos auditables?",
      options: [
      "Power BI, mostrando gráficos sin almacenar los datos",
      "Dataverse, con un modelo centralizado (quién solicitó, quién aprobó, tiempos, costos)",
      "WhatsApp Business API",
      "Un archivo Excel compartido en la nube"
      ],
      answer: [1],
      explanation: "El caso indica que Dataverse aporta el modelo centralizado con trazabilidad completa. Power BI visualiza esos datos pero no los origina, y WhatsApp/Excel son justamente lo que causaba el problema original.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora Andina): un empleado necesita crear una solicitud desde su celular en menos de 2 minutos, con una interfaz simple. ¿Qué componente cubre ese requisito?",
      options: [
      "Canvas App",
      "Model-Driven App",
      "Power BI",
      "Un flujo de Power Automate sin interfaz"
      ],
      answer: [0],
      explanation: "El caso asigna explícitamente esa función a la Canvas App, diseñada para una captura rápida y simple desde el celular. Las Model-Driven Apps están orientadas a gestión tabular más compleja.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora Andina): un gestor necesita aprobar, asignar y cerrar solicitudes con visibilidad completa del proceso, como una herramienta de administración. ¿Qué componente es el más adecuado según el caso?",
      options: [
      "Canvas App",
      "Model-Driven App",
      "Power BI",
      "Power Automate"
      ],
      answer: [1],
      explanation: "El caso asigna esta función a la Model-Driven App, orientada a la gestión de datos con vistas, formularios y procesos de negocio — justo lo que un gestor necesita para administrar solicitudes.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora Andina): se necesita que, si una solicitud no tiene respuesta en 24 horas, escale automáticamente sin que nadie lo haga manualmente. ¿Qué componente implementa esa regla?",
      options: [
      "Power BI",
      "Power Automate",
      "Canvas App",
      "Una Business Rule en el formulario de Canvas App"
      ],
      answer: [1],
      explanation: "El caso asigna la notificación automática y la escalación por tiempo a Power Automate — es lógica de proceso automatizado, no algo que Power BI o una Business Rule de formulario ejecuten.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Constructora Andina): ¿cuáles DOS resultados demuestra el caso a los 3 meses de implementación?",
      options: [
      "Tiempo de aprobación reducido de 5 días a 4 horas promedio",
      "100% de solicitudes trazables (0 perdidas, frente al 8% previo)",
      "Eliminación total del equipo de gestores de solicitudes",
      "Aumento del costo de mantenimiento por la nueva plataforma"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente la reducción del tiempo de aprobación y la trazabilidad completa. No elimina el rol de los gestores (siguen aprobando desde la Model-Driven App) y el costo de mantenimiento se redujo un 18%, no aumentó.",
      appliesTo: "caso"
    }
  ],
  9: [
    {
      type: "single",
      prompt: "Una tabla de Casos debe mostrar el total de actividades cerradas relacionadas y actualizarse automáticamente, aunque el dato no cambie cada vez que el usuario abra el formulario. ¿Qué tipo de columna encaja mejor?",
      options: [
      "Calculated column",
      "Rollup column",
      "Texto multilínea",
      "Lookup polimórfico"
      ],
      answer: [1],
      explanation: "Una Rollup column está diseñada para agregar información desde registros relacionados, como conteos o sumas. Calculated columns operan sobre datos del mismo registro principalmente, y las otras opciones no resuelven agregación."
    },
    {
      type: "single",
      prompt: "El área de RR.HH. quiere que el salario base sea visible solo para un grupo reducido, aunque otros usuarios puedan editar el resto del registro del empleado. ¿Qué característica de Dataverse debe usarse?",
      options: [
      "Field Security Profile",
      "Quick View form",
      "Personal view",
      "Business Process Flow"
      ],
      answer: [0],
      explanation: "Field Security Profile protege columnas específicas sin bloquear todo el registro para usuarios que sí necesitan operar otros campos. Quick View o vistas no controlan seguridad real a nivel de dato, y BPF se enfoca en proceso."
    },
    {
      type: "multi",
      prompt: "Una operación de soporte quiere mejorar calidad de datos y trazabilidad en Dataverse. ¿Qué DOS capacidades ayudan directamente?",
      options: [
      "Duplicate Detection Rules para alertar o prevenir registros potencialmente repetidos",
      "Auditing para registrar cambios en tablas y columnas configuradas",
      "Quick Create forms para eliminar duplicados automáticamente en todas las tablas",
      "Business Rules para almacenar histórico inmutable de cada cambio"
      ],
      answer: [0, 1],
      explanation: "Duplicate Detection Rules ayudan a controlar duplicados y Auditing aporta trazabilidad sobre cambios relevantes. Quick Create mejora captura, pero no deduplica por sí solo, y Business Rules no sustituyen un histórico auditable."
    },
    {
      type: "single",
      prompt: "Debes modelar un proceso donde una solicitud puede asociarse a un Cliente potencial o a una Cuenta existente usando el mismo campo de relación. ¿Qué patrón representa mejor ese requisito?",
      options: [
      "Dos columnas de texto con el nombre visible",
      "Una relación N:N",
      "Un lookup polimórfico hacia múltiples tablas admitidas",
      "Una columna Moneda con formato extendido"
      ],
      answer: [2],
      explanation: "Un lookup polimórfico permite que un mismo campo apunte a más de una tabla válida según el contexto. Guardar nombres en texto rompe integridad referencial y una N:N no expresa exactamente el patrón de referencia única variable."
    },
    {
      type: "single",
      prompt: "Los usuarios piden una búsqueda global similar a un motor de búsqueda, con relevancia y resultados entre varias tablas empresariales. ¿Qué capacidad debes evaluar primero?",
      options: [
      "Relevance Search sobre Dataverse",
      "Solo vistas personales ordenadas alfabéticamente",
      "Exportar todo a Excel y usar filtros manuales",
      "Una columna calculada con concatenación"
      ],
      answer: [0],
      explanation: "Relevance Search está pensada para búsquedas cruzadas entre tablas con ranking y experiencia más cercana a un motor de búsqueda empresarial. Vistas, Excel o concatenaciones pueden ayudar a localizar datos, pero no ofrecen la misma experiencia ni escala."
    },
    {
      type: "single",
      prompt: "Una constructora necesita que el registro de Proyecto pase por las etapas Definición, Planificación, Ejecución y Cierre, guiando al usuario con campos obligatorios en cada etapa dentro del formulario Model-Driven. ¿Qué capacidad de Dataverse debe implementarse?",
      options: [
      "Business Process Flow (BPF)",
      "Columna Rollup",
      "Duplicate Detection Rule",
      "Relevance Search"
      ],
      answer: [0],
      explanation: "Un Business Process Flow define etapas visuales con pasos obligatorios o recomendados que guían al usuario a través de un proceso multi-etapa en el formulario. Rollup agrega valores numéricos, Duplicate Detection evita duplicados y Relevance Search es un motor de búsqueda, ninguno guía un proceso por etapas."
    },
    {
      type: "single",
      prompt: "Una regla de negocio que bloquea la edición de 'sit_presupuesto' cuando el proyecto está Cancelado funciona correctamente en el formulario, pero un flujo de Power Automate sigue pudiendo modificar ese campo. ¿Cuál es la causa más probable?",
      options: [
      "La regla tiene alcance 'Solo formulario' en lugar de 'Entidad'",
      "El campo sit_presupuesto no tiene Field Security Profile",
      "La tabla Proyecto no tiene auditoría activada",
      "El flujo usa una relación N:N nativa"
      ],
      answer: [0],
      explanation: "Las reglas de negocio con alcance 'Solo formulario' solo se ejecutan en la UI, mientras que el alcance 'Entidad' también aplica en el servidor, incluyendo llamadas de API y flujos. Field Security Profile y auditoría son mecanismos distintos que no bloquean escritura por sí mismos."
    },
    {
      type: "multi",
      prompt: "El equipo de datos quiere permitir que un Proyecto tenga múltiples Etiquetas y que cada asociación registre además un campo adicional 'sit_relevancia' propio de la relación. ¿Qué DOS afirmaciones son correctas sobre las opciones de relación N:N en Dataverse?",
      options: [
      "Una relación N:N nativa crea automáticamente una tabla de intersección sin columnas adicionales visibles al maker",
      "Una relación N:N manual usa una tabla de intersección propia que sí puede tener columnas adicionales como sit_relevancia",
      "Las relaciones N:N nativas siempre permiten agregar columnas personalizadas a la tabla de intersección generada",
      "Una relación 1:N es la única forma de vincular Proyecto con Etiqueta en Dataverse"
      ],
      answer: [0, 1],
      explanation: "La N:N nativa gestiona su tabla de intersección de forma transparente y no expone columnas adicionales al maker, mientras que la N:N manual usa una tabla de intersección propia donde sí se pueden agregar columnas como sit_relevancia. Por eso, cuando se necesita un campo extra en la relación, se debe optar por la N:N manual."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora): se necesita que solo el Director de Operaciones pueda editar el campo de presupuesto de un proyecto, y que ningún Project Manager pueda hacerlo aunque tenga acceso al registro. ¿Qué mecanismo de Dataverse aplica exactamente esa restricción a nivel de campo?",
      options: [
      "Field Security Profile sobre la columna de presupuesto",
      "Una Business Rule que oculte el campo en el formulario",
      "Una relación N:N manual con la tabla de aprobaciones",
      "Auditoría activada sobre la tabla Proyecto"
      ],
      answer: [0],
      explanation: "Field Security Profile es el único mecanismo que restringe lectura/edición de una columna específica por perfil de seguridad, incluso si el usuario tiene acceso al registro completo. Ocultar el campo en el formulario (Business Rule) no impide editarlo por API o vista; auditoría solo registra cambios, no los bloquea.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora): se necesita validar automáticamente, sin escribir código, que la fecha de fin de un proyecto nunca sea anterior a su fecha de inicio. ¿Qué componente usarías?",
      options: [
      "Field Security Profile",
      "Una Business Rule sobre la tabla Proyecto",
      "Una columna de tipo Rollup",
      "Un registro de auditoría"
      ],
      answer: [1],
      explanation: "Validar la relación entre dos campos al guardar es lógica de negocio declarativa — el caso de uso típico de una Business Rule. Field Security Profile controla permisos, Rollup agrega valores relacionados, y auditoría solo registra cambios ya ocurridos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora): el dashboard en tiempo real necesita mostrar el costo total acumulado de cada proyecto, recalculado automáticamente a partir de los gastos relacionados, sin que nadie lo actualice manualmente. ¿Qué tipo de columna es la solución correcta?",
      options: [
      "Una columna de texto que el PM actualiza cada semana",
      "Una columna de tipo Rollup que agrega los registros relacionados",
      "Un Field Security Profile sobre la columna de costo",
      "Una Business Rule que muestra un mensaje de alerta"
      ],
      answer: [1],
      explanation: "Una columna Rollup se recalcula automáticamente a partir de registros relacionados (en este caso, los gastos), exactamente el requisito de un dashboard en tiempo real sin actualización manual. Las otras opciones no realizan agregación automática.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Constructora): ¿cuáles DOS elementos de la solución permiten que Contraloría reciba un reporte mensual confiable sin depender de actualizaciones manuales?",
      options: [
      "La auditoría completa activada sobre la tabla, que registra cada cambio",
      "El Rollup de costos, que se mantiene actualizado cada hora sin intervención manual",
      "Un archivo Excel que el PM envía por correo cada mes",
      "Eliminar el historial de cambios para que el reporte sea más simple"
      ],
      answer: [0, 1],
      explanation: "La auditoría deja trazabilidad de cada cambio y el Rollup mantiene el costo actualizado automáticamente — ambos alimentan un reporte confiable sin depender de un envío manual. Un Excel por correo reintroduce el problema original, y eliminar el historial es contrario al objetivo de control.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Constructora): el Director de Operaciones sí necesita poder editar el presupuesto cuando corresponde. ¿Cómo se configura correctamente el Field Security Profile para lograr esto sin abrir el campo a los PM?",
      options: [
      "Se marca la columna de presupuesto como campo seguro (secured field) y se otorga permiso de edición solo al perfil de seguridad del Director de Operaciones",
      "Se desactiva la seguridad de campo por completo para evitar bloqueos accidentales",
      "Se crea una tabla duplicada de presupuestos solo visible para el Director",
      "Se oculta el campo con una Business Rule únicamente en el formulario de los PM"
      ],
      answer: [0],
      explanation: "Un campo seguro con Field Security Profile deniega acceso por defecto y solo lo concede a los perfiles explícitamente asignados — en este caso, el del Director de Operaciones. Desactivar la seguridad o solo ocultar el campo en el formulario deja el dato editable por otras vías (API, vistas, importación).",
      appliesTo: "caso"
    }
  ],
  10: [
    {
      type: "single",
      prompt: "Tu organización tiene 12 Canvas Apps y quiere un mismo encabezado corporativo con botones, colores y comportamiento uniforme que pueda mantenerse en un solo lugar. ¿Qué opción es mejor?",
      options: [
      "Copiar y pegar los controles en cada app manualmente",
      "Crear un componente en una Component Library reutilizable entre apps",
      "Usar una pantalla compartida duplicada en cada versión",
      "Guardar el diseño en una colección"
      ],
      answer: [1],
      explanation: "Una Component Library centraliza mantenimiento y reutilización de controles comunes entre múltiples apps. Copiar pantallas o controles multiplica esfuerzo y facilita inconsistencias visuales y funcionales."
    },
    {
      type: "single",
      prompt: "Diseñas un componente de selector de estado que debe recibir el color corporativo y devolver el valor elegido al formulario contenedor. ¿Qué capacidad necesitas?",
      options: [
      "Propiedades custom de entrada y salida",
      "Solo variables globales con Set",
      "Un flujo de Power Automate por cada clic",
      "Una vista personal en Dataverse"
      ],
      answer: [0],
      explanation: "Las propiedades custom permiten parametrizar componentes y exponer resultados al contenedor de forma reutilizable y limpia. Variables globales acoplan innecesariamente la app, y las otras opciones no resuelven encapsulación UI."
    },
    {
      type: "multi",
      prompt: "Quieres reducir tiempos de carga y centralizar cálculos reutilizados en una app compleja. ¿Qué DOS técnicas son apropiadas?",
      options: [
      "Usar Concurrent() para ejecutar cargas independientes en paralelo cuando aplique",
      "Definir Named Formulas o App.Formulas para expresiones reutilizables y declarativas",
      "Mover todo a variables globales aunque nunca cambien",
      "Duplicar la misma fórmula extensa en cada control para evitar dependencias"
      ],
      answer: [0, 1],
      explanation: "Concurrent mejora el tiempo percibido cuando varias operaciones independientes pueden ejecutarse juntas, y Named Formulas/App.Formulas reducen duplicación y mejoran legibilidad. Variables globales innecesarias y fórmulas repetidas complican mantenimiento."
    },
    {
      type: "single",
      prompt: "Necesitas personalizar la experiencia según el usuario conectado, mostrando su nombre, correo y una navegación diferente si pertenece al área comercial. ¿Qué función te da el contexto base del usuario?",
      options: [
      "User()",
      "Parent()",
      "Self()",
      "CountRows()"
      ],
      answer: [0],
      explanation: "User() devuelve información del usuario actual como nombre completo, correo e imagen, útil para personalización inicial. Self y Parent se refieren a controles, no a identidad del usuario."
    },
    {
      type: "single",
      prompt: "Un analista propone crear una pantalla entera duplicada en varias apps solo para reutilizar un selector de fecha personalizado. ¿Cuál es la mejor recomendación?",
      options: [
      "Reutilizar pantallas completas siempre es mejor que componentes",
      "Crear un componente cuando la funcionalidad reutilizable es un bloque UI específico, no una experiencia completa",
      "Guardar el selector en una colección compartida entre apps",
      "Usar solo variables de contexto para replicar la pantalla"
      ],
      answer: [1],
      explanation: "Cuando se reutiliza un elemento UI acotado, un componente es más mantenible que duplicar pantallas completas. Las pantallas compartidas tienen sentido en otros casos, pero aquí generarían sobrecarga y acoplamiento innecesario."
    },
    {
      type: "single",
      prompt: "Una Canvas App conectada a SharePoint usa `Filter(lista, StartsWith(Nombre, txtBusqueda.Text))` y el desarrollador nota un triángulo amarillo de advertencia en el editor de fórmulas al superar los 500 registros. ¿Qué concepto explica este comportamiento?",
      options: [
      "Delegación: la operación no es delegable en SharePoint y se procesa localmente sobre un subconjunto de registros",
      "Lazy Loading mal configurado en OnVisible",
      "Un error de sintaxis en la función StartsWith",
      "Falta de una Named Formula para el filtro"
      ],
      answer: [0],
      explanation: "El triángulo de advertencia indica que la operación no es delegable en ese origen de datos, por lo que Power Apps trae solo hasta el límite de registros (por defecto 500) y filtra localmente, perdiendo datos fuera de ese límite. No se trata de un error de sintaxis ni de lazy loading."
    },
    {
      type: "single",
      prompt: "Un componente de formulario reutilizable debe limpiar sus TextInputs y variables internas cada vez que la app padre ejecuta `Reset(cmpFormulario)`, sin que el desarrollador de la app conozca la implementación interna del componente. ¿Qué propiedad del componente permite este comportamiento?",
      options: [
      "OnReset",
      "OnVisible de la pantalla contenedora",
      "Custom Output Property de tipo texto",
      "App.Formulas"
      ],
      answer: [0],
      explanation: "OnReset es la propiedad de comportamiento especial que se ejecuta cuando el padre llama Reset() sobre el componente, permitiendo reiniciar el estado interno sin exponer los detalles de implementación. Las otras opciones no están diseñadas para reaccionar al Reset del componente."
    },
    {
      type: "single",
      prompt: "Una app Canvas con múltiples pantallas y varias fuentes de datos carga todas sus colecciones en App.OnStart, tardando entre 8 y 15 segundos en abrir. ¿Qué cambio de arquitectura reduce mejor ese tiempo de carga inicial?",
      options: [
      "Aplicar Lazy Loading: cargar cada colección en el OnVisible de la pantalla que la necesita",
      "Convertir todas las colecciones en Named Formulas dentro de App.Formulas",
      "Eliminar la Component Library de la app",
      "Aumentar el timeout de conexión de los conectores"
      ],
      answer: [0],
      explanation: "Lazy Loading distribuye la carga de datos moviéndola de App.OnStart al evento OnVisible de cada pantalla, cargando solo lo necesario cuando el usuario navega a ella, lo cual reduce drásticamente el tiempo de apertura inicial. Named Formulas ayudan con cálculos derivados, pero no resuelven por sí solas la carga inicial de datos remotos."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco regional): 15 apps Canvas tenían su propio header, colores y estilos; un cambio de branding requería actualizar las 15 manualmente. ¿Qué mecanismo resuelve la raíz de ese problema?",
      options: [
      "Duplicar el código de la app 15 veces con los nuevos colores",
      "Una Component Library con el tema corporativo centralizado",
      "Aumentar el número de desarrolladores asignados al mantenimiento",
      "Migrar las 15 apps a Model-Driven Apps"
      ],
      answer: [1],
      explanation: "Una Component Library centraliza el diseño en un solo lugar; al actualizarla y publicarla, todas las apps que la consumen pueden aceptar el cambio en un clic, en vez de editarse una por una.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco regional): tras publicar un cambio en la Component Library, ¿qué debe hacer cada app consumidora para reflejar el cambio?",
      options: [
      "Reconstruirse completamente desde cero",
      "Aceptar la actualización del componente desde Insertar → Componentes → ícono de actualización",
      "Nada — el cambio se aplica automáticamente sin acción del maker",
      "Reinstalar Power Apps Studio"
      ],
      answer: [1],
      explanation: "El caso y la tabla de errores comunes lo indican explícitamente: la app debe aceptar la actualización manualmente desde el panel de componentes; no ocurre de forma automática ni requiere reconstruir la app.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco regional): ¿por qué las propiedades de salida de un componente reutilizable deben ser simples (texto, número, booleano) en vez de colecciones?",
      options: [
      "Porque Power Apps no permite colecciones en ningún componente",
      "Porque mantiene el componente predecible, reutilizable entre apps y con mejor rendimiento",
      "Porque las colecciones ocupan más espacio en disco",
      "Porque solo los componentes con salidas simples pueden versionarse"
      ],
      answer: [1],
      explanation: "Es una buena práctica explícita del caso: las salidas simples hacen que el componente sea más predecible y fácil de reutilizar en distintos contextos, sin acoplar la librería a estructuras de datos específicas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco regional): ¿qué mecanismo se recomienda sobre las variables globales en App.OnStart para valores que no dependen de eventos de usuario?",
      options: [
      "Named Formulas declaradas en App.Formulas, evaluadas de forma lazy y reactiva",
      "Más variables globales, pero declaradas al final del OnStart",
      "Guardar los valores en una tabla de Dataverse en vez de la app",
      "Colecciones creadas con ClearCollect en cada pantalla"
      ],
      answer: [0],
      explanation: "El caso recomienda Named Formulas en App.Formulas por su evaluación lazy y reactiva, con mejor rendimiento que variables calculadas imperativamente en App.OnStart.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Banco regional): ¿cuáles DOS resultados reales demuestra el caso tras adoptar la Component Library?",
      options: [
      "Reducción del tiempo de implementación de cambios visuales de 2 semanas a 2 horas",
      "Ahorro de aproximadamente 40 horas al mes en mantenimiento",
      "Eliminó por completo la necesidad de publicar actualizaciones en las apps",
      "Cada app pasó a tener su propia copia independiente del componente"
      ],
      answer: [0, 1],
      explanation: "El caso reporta ambos resultados cuantificables. Las apps siguen necesitando aceptar la actualización publicada, y el punto de la Component Library es justamente evitar copias independientes por app.",
      appliesTo: "caso"
    }
  ],
  11: [
    {
      type: "single",
      prompt: "Tres flujos distintos validan el mismo cálculo de SLA y devuelven el mismo resultado. Quieres evitar duplicación y mantener la lógica en un solo lugar. ¿Qué patrón es más adecuado?",
      options: [
      "Copiar el bloque en cada flujo y controlar cambios manualmente",
      "Extraer la lógica a un Child Flow reutilizable",
      "Mover todo a variables de entorno",
      "Crear un correo automático con la fórmula en el cuerpo"
      ],
      answer: [1],
      explanation: "Un Child Flow permite encapsular lógica común y reutilizarla desde varios flujos, reduciendo duplicación y errores de mantenimiento. Variables de entorno son para configuración, no para ejecutar una secuencia lógica completa."
    },
    {
      type: "single",
      prompt: "Quieres estructurar un flujo robusto con un bloque principal, otro para manejar excepciones y uno final que siempre ejecute limpieza o logging. ¿Qué enfoque describe mejor ese diseño?",
      options: [
      "Un solo Scope con todo y sin condiciones",
      "Scopes separados tipo Try/Catch/Finally usando Configure run after",
      "Solo una rama paralela para cada error posible",
      "Reemplazar el flujo por una vista en SharePoint"
      ],
      answer: [1],
      explanation: "El patrón Try/Catch/Finally con Scopes y Configure run after mejora control del flujo y trazabilidad de errores. Poner todo en un solo Scope o en ramas paralelas sin estrategia hace más difícil el soporte."
    },
    {
      type: "single",
      prompt: "Un conector HTTP falla de forma intermitente por límites temporales del servicio externo. ¿Qué característica ayuda primero a aumentar resiliencia sin rediseñar todo el flujo?",
      options: [
      "Retry policy de la acción",
      "Renombrar el flujo",
      "Cambiar el disparador a instantáneo",
      "Convertir todas las salidas en texto"
      ],
      answer: [0],
      explanation: "La retry policy permite reintentos automáticos ante fallos transitorios, reduciendo errores operativos en integraciones inestables. Cambiar nombres o tipos de salida no ataca el problema de disponibilidad momentánea."
    },
    {
      type: "multi",
      prompt: "Estás optimizando un flujo complejo. ¿Qué DOS prácticas suelen mejorar claridad y rendimiento sin introducir efectos secundarios innecesarios?",
      options: [
      "Usar acciones de Compose para transformar valores cuando no necesitas estado mutable",
      "Abrir ramas paralelas para actividades independientes como notificar y registrar",
      "Crear variables para cada valor intermedio aunque nunca cambie",
      "Anidar Apply to each dentro de otro Apply to each aunque exista una alternativa directa"
      ],
      answer: [0, 1],
      explanation: "Compose reduce sobrecarga cuando solo necesitas expresar un valor, y las ramas paralelas acortan tiempo total si las tareas son independientes. Variables innecesarias y bucles anidados empeoran legibilidad y pueden afectar rendimiento."
    },
    {
      type: "single",
      prompt: "El negocio quiere iniciar una aprobación en Teams con contenido enriquecido y luego disparar una tarea RPA si el sistema legado no expone API. ¿Qué combinación encaja mejor?",
      options: [
      "Adaptive Cards en Teams y, si procede, un Desktop flow desde Power Automate",
      "Solo un correo plano porque Teams no soporta aprobaciones",
      "Un SharePoint list formatting como sustituto de RPA",
      "Mover toda la lógica a Power BI"
      ],
      answer: [0],
      explanation: "Teams con Adaptive Cards mejora la interacción del aprobador y un Desktop flow puede cubrir automatización UI cuando el legado no tiene API. Las otras opciones no resuelven adecuadamente ni la experiencia de aprobación ni la integración RPA."
    },
    {
      type: "single",
      prompt: "Al configurar el Scope 'Catch' de un flujo, el desarrollador necesita que se ejecute únicamente si el Scope 'Try' terminó en error o en tiempo de espera agotado, pero nunca si terminó exitosamente. ¿Qué configuración de 'Configure run after' logra esto?",
      options: [
      "Marcar 'failed' y 'timed out', y desmarcar 'succeeded'",
      "Marcar únicamente 'skipped'",
      "Dejar la configuración por defecto (succeeded)",
      "Marcar las cuatro opciones (succeeded, failed, skipped, timedOut)"
      ],
      answer: [0],
      explanation: "Para que un Scope actúe como bloque Catch, se debe desmarcar 'succeeded' y marcar 'failed' junto con 'timed out', de modo que solo se ejecute cuando el bloque Try haya fallado. Marcar las cuatro opciones haría que el Catch se ejecute siempre, incluso cuando no hay error."
    },
    {
      type: "single",
      prompt: "Un flujo debe crear o actualizar 800 registros en Dataverse y el desarrollador quiere evitar 800 llamadas HTTP individuales dentro de un Apply to Each por razones de rendimiento y consumo de API calls. ¿Qué técnica es la más apropiada?",
      options: [
      "Usar Batch Processing llamando al endpoint $batch de la OData API, que agrupa hasta 1000 operaciones en una sola solicitud",
      "Aumentar la concurrencia del Apply to Each a 100 elementos en paralelo",
      "Convertir el flujo en un Child Flow sin cambiar la lógica de iteración",
      "Duplicar el flujo en dos instancias ejecutándose simultáneamente"
      ],
      answer: [0],
      explanation: "El endpoint $batch de la API de Dataverse permite agrupar hasta 1000 operaciones en una sola solicitud HTTP, reduciendo drásticamente el consumo de llamadas de API y mejorando el rendimiento frente a iterar registro por registro. Aumentar la concurrencia ayuda, pero sigue generando una llamada por registro."
    },
    {
      type: "single",
      prompt: "Un flujo debe consultar una API externa que retorna resultados en páginas mediante el token '@odata.nextLink', y el desarrollador necesita procesar todos los registros sin perder datos. ¿Qué patrón de iteración es el más adecuado para este escenario?",
      options: [
      "Un Do Until que se repite mientras exista '@odata.nextLink' en la respuesta, siguiendo el enlace en cada iteración",
      "Un único Apply to Each sobre la primera página de resultados",
      "Una regla de negocio que valide el total de registros",
      "Una Named Formula que traiga todos los registros de una vez"
      ],
      answer: [0],
      explanation: "Cuando una API externa pagina resultados con '@odata.nextLink', el patrón correcto es un Do Until que siga ese enlace mientras exista, acumulando los registros de cada página hasta agotar la paginación. Procesar solo la primera página perdería datos silenciosamente."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa importadora): el flujo fallaba silenciosamente cuando la API de proveedores no respondía, sin que nadie se enterara del error. ¿Qué patrón del caso resuelve directamente ese problema?",
      options: [
      "Un Apply to Each adicional sobre el mismo paso",
      "Scope + Run After, con registro de errores en SharePoint y notificación al admin",
      "Aumentar el número de reintentos automáticos a 100",
      "Eliminar el paso que llama a la API de proveedores"
      ],
      answer: [1],
      explanation: "El patrón Scope + Run After (Try-Catch) es lo que permite capturar el error, registrarlo (en SharePoint) y notificar al admin, en vez de que el flujo falle sin dejar rastro.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa importadora): el cálculo del nivel de aprobación es idéntico para órdenes de compra y para contratos. ¿Qué técnica evita duplicar esa lógica en dos flujos distintos?",
      options: [
      "Copiar y pegar el mismo bloque de acciones en ambos flujos",
      "Un Child Flow reutilizable que ambos flujos padre invocan",
      "Una Business Rule de Dataverse",
      "Una variable de entorno compartida"
      ],
      answer: [1],
      explanation: "El caso usa un Child Flow reutilizable para el cálculo de aprobación, evitando duplicar la misma lógica en los flujos de órdenes de compra y de contratos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa importadora): se necesita notificar a varias personas al mismo tiempo en vez de una tras otra, para reducir el tiempo total del flujo. ¿Qué técnica usa el caso?",
      options: [
      "Ramas paralelas (parallel branches) en vez de pasos secuenciales",
      "Un Do Until que repite la notificación",
      "Un trigger adicional por cada persona a notificar",
      "Aumentar la frecuencia de ejecución del flujo"
      ],
      answer: [0],
      explanation: "El caso reemplaza 3 pasos secuenciales por 1 paso paralelo (ramas paralelas), reduciendo el tiempo total de notificación al ejecutarlas simultáneamente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa importadora): ¿dónde debe estar guardado un Child Flow para que el flujo padre pueda usarlo de forma portable entre ambientes?",
      options: [
      "En cualquier ambiente, no importa cuál",
      "En la misma solución que el flujo padre",
      "En una carpeta local del desarrollador",
      "Solo en el ambiente de Producción"
      ],
      answer: [1],
      explanation: "El caso y la tabla de errores comunes lo indican: el Child Flow debe estar en la misma solución que el flujo padre para que la referencia se resuelva correctamente al moverse entre ambientes.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Empresa importadora): ¿cuáles DOS resultados demuestra el caso tras aplicar Try-Catch, Child Flow y ramas paralelas?",
      options: [
      "Tiempo de flujo reducido de 4 minutos a 45 segundos",
      "Tasa de errores silenciosos del 0%",
      "El flujo dejó de necesitar conexión a la API de proveedores",
      "El nivel de aprobación pasó a calcularse manualmente por un analista"
      ],
      answer: [0, 1],
      explanation: "El caso reporta explícitamente ambos resultados cuantificables. El flujo sigue dependiendo de la API de proveedores (ahora con manejo de errores) y el cálculo de aprobación sigue siendo automático vía el Child Flow.",
      appliesTo: "caso"
    }
  ],
  12: [
    {
      type: "single",
      prompt: "Un analista crea una columna calculada para 'Precio * Cantidad' y luego una medida que suma ventas según filtros de región y fecha. ¿Qué diferencia conceptual está aplicando?",
      options: [
      "La columna usa contexto de fila y la medida responde al contexto de filtro",
      "Ambas siempre usan exactamente el mismo contexto",
      "La medida solo sirve para texto y la columna para números",
      "La columna calculada ignora totalmente la tabla donde se crea"
      ],
      answer: [0],
      explanation: "Las columnas calculadas se evalúan fila por fila, mientras las medidas se recalculan según el contexto de filtro de la visualización. Por eso una medida es más adecuada para agregaciones dinámicas por fecha, región o segmento."
    },
    {
      type: "single",
      prompt: "Necesitas comparar ventas del año actual contra el mismo periodo del año anterior y calcular acumulado YTD. ¿Qué requisito de modelado no debes omitir?",
      options: [
      "Una tabla de fechas personalizada y correctamente marcada",
      "Un slicer oculto en cada página",
      "Una tarjeta con el total general",
      "Publicar en My Workspace"
      ],
      answer: [0],
      explanation: "Las funciones de time intelligence como SAMEPERIODLASTYEAR o TOTALYTD requieren una tabla de fechas bien definida y continua. Sin ese fundamento, los cálculos temporales pueden fallar o producir resultados inconsistentes."
    },
    {
      type: "single",
      prompt: "La dirección quiere ver el ranking de los 10 clientes con mayor margen dentro del contexto filtrado actual. ¿Qué combinación es más natural en DAX?",
      options: [
      "RANKX y/o TOPN sobre una medida de margen",
      "USERELATIONSHIP y RELATEDTABLE obligatoriamente",
      "Solo COUNTROWS sobre la tabla de clientes",
      "Q&A natural language sin modelo"
      ],
      answer: [0],
      explanation: "RANKX y TOPN son funciones apropiadas para construir rankings y subconjuntos top según una medida dentro del contexto actual. COUNTROWS no clasifica por valor, y USERELATIONSHIP responde a otro tipo de necesidad."
    },
    {
      type: "multi",
      prompt: "Tienes un modelo con fecha de pedido activa y fecha de entrega inactiva. Además, una medida debe ignorar filtros de producto pero respetar el resto del contexto. ¿Qué DOS funciones ayudan?",
      options: [
      "USERELATIONSHIP para activar la relación inactiva dentro de una medida",
      "ALL o ALLEXCEPT para controlar qué filtros se eliminan o mantienen",
      "AVERAGE para habilitar relaciones",
      "DATEADD para eliminar filtros de producto"
      ],
      answer: [0, 1],
      explanation: "USERELATIONSHIP permite usar una relación inactiva en una medida específica y ALL/ALLEXCEPT controlan el contexto de filtro. AVERAGE y DATEADD tienen usos válidos, pero no cubren directamente esas dos necesidades de modelado."
    },
    {
      type: "single",
      prompt: "Un desarrollador quiere calcular 'Ventas Totales' como columna calculada para mostrarla en muchas visuales y luego se queja del rendimiento. ¿Qué recomendación suele ser mejor?",
      options: [
      "Mover el cálculo a una medida cuando el valor debe responder al contexto de filtro",
      "Crear más columnas calculadas duplicadas por cada visual",
      "Eliminar la tabla de fechas",
      "Reemplazar todo por Q&A"
      ],
      answer: [0],
      explanation: "Las medidas suelen ser más adecuadas para agregaciones que deben recalcularse dinámicamente y pueden evitar inflar el modelo con columnas redundantes. Duplicar columnas aumenta tamaño y no mejora el problema de diseño original."
    },
    {
      type: "single",
      prompt: "Una medida DAX calcula un porcentaje dividiendo ventas entre un total que puede ser cero en ciertos filtros, causando errores de división. ¿Qué función es la práctica recomendada para evitar el error sin usar el operador '/'?",
      options: [
      "DIVIDE(), que permite especificar un valor alternativo cuando el denominador es cero o blanco",
      "ALLEXCEPT(), que elimina filtros de columnas específicas",
      "RANKX(), que calcula un ranking dinámico",
      "RELATEDTABLE(), que retorna filas de una tabla relacionada"
      ],
      answer: [0],
      explanation: "DIVIDE() es la función recomendada en DAX para divisiones porque permite definir un valor de retorno (por ejemplo 0 o BLANK) cuando el denominador es cero, evitando errores. RANKX, ALLEXCEPT y RELATEDTABLE resuelven otros problemas de modelado."
    },
    {
      type: "single",
      prompt: "Una empresa de retail necesita que cada vendedor, al abrir el reporte en Power BI Service, vea solo los datos de sus propios clientes, identificándolo por su cuenta de usuario. ¿Qué función DAX es la base de esa implementación de Row Level Security?",
      options: [
      "USERPRINCIPALNAME(), usada en la expresión de filtro del rol para comparar con el email del vendedor",
      "TOTALYTD(), para acumular ventas del año",
      "RANKX(), para rankear vendedores",
      "FILTER(), para iterar toda la tabla de vendedores"
      ],
      answer: [0],
      explanation: "USERPRINCIPALNAME() devuelve la identidad del usuario conectado en Power BI Service y se usa dentro de la expresión DAX del rol de RLS para filtrar la tabla según ese valor, por ejemplo comparándolo contra la columna Email del vendedor. Las otras funciones no identifican al usuario actual."
    },
    {
      type: "single",
      prompt: "En una columna calculada de la tabla Ventas necesitas traer la Categoría del producto desde la tabla Productos relacionada (lado uno hacia el lado muchos). ¿Qué función DAX es la correcta para este caso?",
      options: [
      "RELATED(Productos[Categoria])",
      "RELATEDTABLE(Productos)",
      "ALLSELECTED(Productos)",
      "SAMEPERIODLASTYEAR(Productos[Fecha])"
      ],
      answer: [0],
      explanation: "RELATED() se usa en el contexto de fila del lado 'muchos' de una relación para traer un valor único desde la tabla del lado 'uno', como la Categoría del producto de una venta. RELATEDTABLE hace lo inverso (retorna múltiples filas relacionadas), y las otras funciones no navegan relaciones de esta forma."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cadena de retail): los gerentes veían ventas de todas las regiones y los vendedores necesitaban ver solo sus propios clientes. ¿Qué mecanismo de Power BI resuelve esto?",
      options: [
      "RLS (Row-Level Security) con roles distintos por perfil",
      "Ocultar visualmente las columnas del reporte",
      "Crear un archivo .pbix distinto para cada vendedor",
      "Una medida DAX que oculte los totales"
      ],
      answer: [0],
      explanation: "El caso implementa RLS con 3 roles (Director, Gerente Regional, Vendedor), cada uno filtrando realmente los datos a nivel de fila según el perfil — no solo ocultando visualmente columnas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cadena de retail): ¿dónde debe aplicarse (publicarse y asignarse) el RLS del caso para que los usuarios finales realmente lo experimenten?",
      options: [
      "Únicamente en Power BI Desktop, sin publicar",
      "En el Dataset publicado en Power BI Service",
      "En un archivo Excel adjunto al reporte",
      "En la tabla de fechas del modelo"
      ],
      answer: [1],
      explanation: "Es una buena práctica explícita del caso: RLS se aplica al Dataset en el Service (donde se asignan los roles a usuarios/grupos), no solo en Desktop.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cadena de retail): se necesita comparar las ventas del periodo actual contra el mismo periodo del año anterior (YoY). ¿Qué técnica DAX usa el caso?",
      options: [
      "Time intelligence",
      "RLS",
      "Un Custom Connector",
      "Una relación N:N nativa"
      ],
      answer: [0],
      explanation: "El caso usa funciones de time intelligence de DAX para los comparativos año contra año (YoY), una capacidad distinta de RLS (seguridad) o de las relaciones del modelo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cadena de retail): ¿qué técnica del caso suaviza la estacionalidad en el dashboard ejecutivo para mostrar una tendencia más estable?",
      options: [
      "Una media móvil de 3 meses",
      "Filtrar solo el último día del mes",
      "Redondear todos los valores a miles",
      "Eliminar los meses con ventas bajas del reporte"
      ],
      answer: [0],
      explanation: "El caso usa una media móvil de 3 meses para suavizar picos y valles estacionales en el dashboard ejecutivo, sin distorsionar ni eliminar datos reales.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Cadena de retail): ¿cuáles DOS prácticas del caso hacen que el modelo DAX sea confiable y mantenible?",
      options: [
      "Usar DIVIDE() en vez de '/' para evitar errores por división entre cero",
      "Crear la tabla de fechas manualmente en vez de usar AutoDate/Time de Power BI",
      "Concatenar todas las medidas en una única fórmula gigante para ahorrar tiempo",
      "Aplicar el RLS solo en Power BI Desktop sin publicarlo al Service"
      ],
      answer: [0, 1],
      explanation: "Ambas son buenas prácticas explícitas del caso. Concatenar medidas en una fórmula gigante dificulta el mantenimiento, y no publicar el RLS al Service significa que nunca se aplica realmente para los usuarios finales.",
      appliesTo: "caso"
    }
  ],
  13: [
    {
      type: "single",
      prompt: "Debes escribir JavaScript para un formulario Model-Driven moderno y acceder al contexto del formulario desde un evento OnChange. ¿Qué enfoque es el recomendado actualmente?",
      options: [
      "Usar Xrm.Page directamente porque nunca quedará obsoleto",
      "Recibir executionContext y usar getFormContext()",
      "Leer el DOM del navegador para encontrar los campos",
      "Modificar el sitemap con JavaScript"
      ],
      answer: [1],
      explanation: "El patrón actual es obtener formContext desde executionContext para trabajar de forma compatible y mantenible con la Client API moderna. Xrm.Page es legado, y manipular el DOM no es una práctica soportada para formularios de Dataverse."
    },
    {
      type: "single",
      prompt: "En el evento OnChange de un campo 'Tipo de cliente' debes volver obligatorio 'Límite de crédito' cuando el valor sea Corporativo y disparar lógica dependiente. ¿Qué combinación describe mejor la solución?",
      options: [
      "getValue(), setRequiredLevel() y fireOnChange() cuando sea necesario",
      "Solo setVisible(false) para todos los casos",
      "destroy() e init() del PCF",
      "Modificar manifest.xml"
      ],
      answer: [0],
      explanation: "La Client API del formulario permite leer el valor, ajustar obligatoriedad y disparar otros eventos relacionados cuando el escenario lo exige. Los métodos de ciclo de vida de PCF y el manifest pertenecen a otro tipo de componente."
    },
    {
      type: "multi",
      prompt: "Empiezas un control PCF básico que mostrará un semáforo visual en un formulario. ¿Qué DOS elementos forman parte directa del desarrollo inicial?",
      options: [
      "Definir propiedades y recursos en manifest.xml",
      "Implementar lógica principal en TypeScript, por ejemplo en index.ts",
      "Crear un archivo RibbonDiffXml como requisito del control",
      "Editar Xrm.Page.js para registrar el componente"
      ],
      answer: [0, 1],
      explanation: "Un PCF se define con su manifest y su implementación TypeScript, donde se controlan entrada, salida y renderizado. RibbonDiffXml aplica a comandos de la barra, y Xrm.Page.js no es el mecanismo de registro de PCF."
    },
    {
      type: "single",
      prompt: "Tu control necesita renderizar una experiencia rica basada en React y mantener una estructura más alineada con ese ecosistema. ¿Qué tipo de control deberías evaluar?",
      options: [
      "ReactControl",
      "Quick View form",
      "Business Rule",
      "System view"
      ],
      answer: [0],
      explanation: "ReactControl está pensado para construir componentes PCF apoyados en React cuando esa arquitectura aporta valor. Quick Views, reglas y vistas no sustituyen un control personalizado en el formulario."
    },
    {
      type: "single",
      prompt: "Tras generar el PCF, quieres incorporarlo a una solución y probarlo en el entorno de desarrollo. ¿Qué secuencia es más razonable?",
      options: [
      "pac pcf init, desarrollar el control, pac solution add-component y luego pac pcf push para probar",
      "Crear solo un archivo JS en la carpeta docs y esperar que aparezca en Dataverse",
      "Editar manualmente la base de datos del ambiente",
      "Publicar un dashboard en Power BI"
      ],
      answer: [0],
      explanation: "La CLI de Power Platform soporta el flujo estándar de creación, asociación a solución y publicación de un PCF en desarrollo. Las otras opciones no corresponden al ciclo de vida soportado para componentes PCF."
    },
    {
      type: "single",
      prompt: "Un desarrollador crea un control PCF con `--framework react` y `control-type=\"virtual\"` en el manifest. ¿Qué ventaja principal ofrece este modo frente a un control PCF Standard?",
      options: [
      "El control comparte el runtime de React que ya usa la plataforma, reduciendo el tamaño del bundle",
      "El control puede manipular directamente el DOM sin restricciones",
      "El control deja de necesitar ControlManifest.Input.xml",
      "El control se registra automáticamente en el sitemap del formulario"
      ],
      answer: [0],
      explanation: "Los controles Virtual (recomendados cuando se usa React) comparten el runtime de React ya presente en la plataforma, reduciendo el bundle en comparación con Standard, que renderiza su propio árbol DOM de forma independiente. El manifest sigue siendo obligatorio en ambos modos."
    },
    {
      type: "single",
      prompt: "Un equipo necesita reemplazar una subgrid de Model-Driven App con una visualización tipo calendario que agrupe y presente colecciones completas de registros con sus columnas, no un solo campo. ¿Qué tipo de control PCF corresponde a este requisito?",
      options: [
      "Field PCF",
      "Dataset PCF",
      "ReactControl sin manifest",
      "Web Resource JavaScript"
      ],
      answer: [1],
      explanation: "El template Dataset PCF está diseñado para reemplazar subgrids o galerías, recibiendo colecciones de registros con sus columnas y permitiendo vistas personalizadas como calendario o kanban. Field PCF reemplaza un solo campo, no una colección completa."
    },
    {
      type: "single",
      prompt: "Dentro del método `updateView` de un control PCF necesitas leer registros relacionados directamente desde Dataverse sin depender del objeto global Xrm. ¿Qué API debe usarse?",
      options: [
      "context.webAPI (ComponentFramework.WebApi), disponible dentro del contexto del PCF",
      "Xrm.Page.data.entity, la API legacy de formularios",
      "fetch() apuntando directamente a la base de datos SQL de Dataverse",
      "formContext.getAttribute().getValue()"
      ],
      answer: [0],
      explanation: "ComponentFramework.WebApi, accesible vía context.webAPI dentro del PCF, permite leer, crear, actualizar y eliminar registros de Dataverse sin depender de Xrm, heredando la autenticación del contexto de la plataforma. Xrm.Page es legacy y formContext pertenece a los formularios, no a los controles PCF."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): los ajustadores aprobaban siniestros sin verificar que todos los documentos requeridos estuvieran adjuntos, generando errores. ¿Qué mecanismo del caso bloquea ese error antes de guardar?",
      options: [
      "Un reporte de Power BI que se revisa una vez por semana",
      "JavaScript en el evento OnSave que verifica los documentos requeridos antes de permitir el cambio de estado",
      "Un correo automático enviado después de guardar el siniestro",
      "Una columna de texto donde el ajustador escribe si adjuntó todo"
      ],
      answer: [1],
      explanation: "El caso describe validación JS en OnSave que impide el cambio de estado si faltan documentos — se previene el error antes de que ocurra, no se detecta después.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): se necesita mostrar visualmente el estado del siniestro con colores semáforo directamente en el formulario. ¿Qué componente del caso implementa esto?",
      options: [
      "Un control PCF (StatusBadge)",
      "Una Business Rule con mensaje de texto",
      "Un campo de solo lectura sin formato visual",
      "Un dashboard de Power BI embebido"
      ],
      answer: [0],
      explanation: "El caso usa un control PCF llamado StatusBadge para representar visualmente el estado del siniestro con colores semáforo directamente en el formulario.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): ¿por qué el script de validación debe usar executionContext.getFormContext() en vez de Xrm.Page?",
      options: [
      "Porque Xrm.Page es más rápido pero menos seguro",
      "Porque Xrm.Page está deprecated y getFormContext() es el patrón vigente y recomendado",
      "Porque Xrm.Page solo funciona en Internet Explorer",
      "No hay diferencia real entre ambos"
      ],
      answer: [1],
      explanation: "Es una buena práctica explícita del caso: Xrm.Page está deprecated; usar executionContext.getFormContext() es el enfoque correcto y soportado a futuro.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): ¿qué variante de PCF se prefiere en el caso, y por qué?",
      options: [
      "PCF Standard, porque es más simple de configurar",
      "PCF Virtual (React), porque comparte el runtime de React del sistema",
      "No importa la variante, el rendimiento es idéntico",
      "PCF Virtual, porque no requiere compilación"
      ],
      answer: [1],
      explanation: "El caso recomienda PCF Virtual (React) porque comparte el runtime de React ya cargado por la plataforma, evitando duplicar esa dependencia y mejorando el rendimiento frente a PCF Standard.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Aseguradora): ¿cuáles DOS resultados demuestra el caso tras implementar la validación JS y el control PCF?",
      options: [
      "Reducción de errores de proceso del 60%",
      "Tiempo de auditoría de calidad reducido de 2 días a 4 horas por semana",
      "Eliminación total del rol de ajustador de siniestros",
      "El formulario dejó de requerir conexión a Dataverse"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. El ajustador sigue siendo parte del proceso (ahora con menos errores) y el formulario sigue dependiendo de Dataverse para guardar los datos.",
      appliesTo: "caso"
    }
  ],
  14: [
    {
      type: "single",
      prompt: "Debes conectar una API externa que exige un header fijo x-api-key por consumidor y no implementa OAuth. ¿Qué esquema de autenticación del Custom Connector es el más natural?",
      options: [
      "API Key",
      "OAuth 2.0",
      "Windows Authentication",
      "Ninguna autenticación porque el header puede omitirse"
      ],
      answer: [0],
      explanation: "Cuando la API autentica mediante un header o parámetro de clave, API Key es la opción más directa y mantenible. OAuth 2.0 sería innecesario si el servicio no lo soporta, y omitir autenticación no funcionaría."
    },
    {
      type: "single",
      prompt: "El proveedor ya te entregó una especificación OpenAPI bien documentada. ¿Cuál suele ser la forma más eficiente de iniciar el Custom Connector?",
      options: [
      "Crear el conector desde OpenAPI/Swagger importando la definición",
      "Escribir todo desde cero en un Canvas App sin conector",
      "Crear un dashboard de Power BI y esperar que genere el contrato",
      "Usar un Business Process Flow"
      ],
      answer: [0],
      explanation: "Si existe una especificación OpenAPI de calidad, importarla acelera el diseño de operaciones, parámetros y respuestas del conector. Hacerlo desde cero desperdicia trabajo y aumenta probabilidad de inconsistencias."
    },
    {
      type: "multi",
      prompt: "Necesitas adaptar solicitudes y respuestas sin tocar la API backend. ¿Qué DOS políticas de Custom Connector son ejemplos útiles de transformación?",
      options: [
      "Set Header para agregar o modificar headers enviados al backend",
      "Set Query para inyectar o transformar parámetros de consulta",
      "Cambiar el plan de licenciamiento del tenant desde el conector",
      "Crear una Business Unit nueva como parte de la llamada"
      ],
      answer: [0, 1],
      explanation: "Set Header y Set Query son políticas pensadas justamente para alterar el mensaje sin reescribir el servicio backend. El licenciamiento y las Business Units pertenecen a otras áreas de administración de la plataforma."
    },
    {
      type: "single",
      prompt: "Después de crear el Custom Connector, un maker quiere usarlo tanto en una Canvas App como en un flujo de Power Automate para consultar inventario. ¿Qué afirmación es correcta?",
      options: [
      "Debe crear dos conectores distintos, uno por producto",
      "Puede reutilizar el mismo Custom Connector en ambos, según permisos y conexión disponibles",
      "Solo Power Automate admite Custom Connectors",
      "Solo Canvas Apps admite Custom Connectors"
      ],
      answer: [1],
      explanation: "Un mismo Custom Connector puede consumirse desde distintos productos de Power Platform, como Canvas Apps y Power Automate. La reutilización depende de la conexión, el entorno y el acceso, no de crear definiciones duplicadas."
    },
    {
      type: "single",
      prompt: "Tu empresa desea publicar el conector para terceros en AppSource. ¿Qué aspecto adicional debes considerar más allá de que funcione internamente?",
      options: [
      "Requisitos de certificación, documentación y cumplimiento para AppSource",
      "Eliminar autenticación para simplificar la revisión",
      "Limitar el conector a un solo ambiente personal",
      "Convertirlo obligatoriamente en PCF"
      ],
      answer: [0],
      explanation: "La certificación para AppSource exige criterios adicionales de calidad, documentación, seguridad y soporte. Que el conector funcione dentro del tenant no basta por sí solo para distribución pública."
    },
    {
      type: "single",
      prompt: "Una empresa quiere integrar un Custom Connector con una API corporativa protegida por Microsoft Entra ID, donde cada usuario debe autenticarse y autorizar el acceso mediante un flujo de autorización delegada. ¿Qué tipo de autenticación del conector es el más apropiado?",
      options: [
      "OAuth 2.0 con Microsoft Entra ID como proveedor de identidad",
      "API Key en un header fijo",
      "Windows Authentication",
      "No auth, ya que Entra ID gestiona todo automáticamente sin configuración"
      ],
      answer: [0],
      explanation: "OAuth 2.0 con Microsoft Entra ID (u otro proveedor de identidad) es el esquema recomendado para APIs corporativas que requieren autorización delegada por usuario, siendo más seguro que una clave estática. No auth y API Key no cubren un flujo de autorización delegada real."
    },
    {
      type: "single",
      prompt: "El proveedor de una API confirma que puede notificar a Power Platform en tiempo real cuando ocurre un evento, en lugar de que el conector deba consultar periódicamente. ¿Qué tipo de trigger del Custom Connector aprovecha mejor esa capacidad?",
      options: [
      "Trigger tipo Webhook, más eficiente que consultar periódicamente",
      "Trigger tipo Polling, ejecutado cada minuto",
      "Una Action con método GET",
      "Un Policy Template de tipo Set Header"
      ],
      answer: [0],
      explanation: "Un trigger tipo Webhook permite que la API externa notifique al conector cuando ocurre un evento, siendo más eficiente que Polling, donde el conector debe consultar periódicamente para detectar cambios. Las Actions y los Policy Templates no son mecanismos de disparo de flujo."
    },
    {
      type: "single",
      prompt: "En el diseñador de un Custom Connector, el campo de un parámetro debe mostrar automáticamente un menú desplegable con la lista de proyectos disponibles, obtenida en tiempo de diseño llamando a la API. ¿Qué capacidad del conector permite esto?",
      options: [
      "Dynamic Values (x-ms-dynamic-values)",
      "Set Query Parameter",
      "Route Request",
      "Connector Certification"
      ],
      answer: [0],
      explanation: "Dynamic Values permite que el campo de un parámetro muestre opciones cargadas dinámicamente desde la API en tiempo de diseño, como una lista de proyectos. Set Query Parameter y Route Request son políticas de transformación de la llamada, no de generación de listas dinámicas."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Distribuidora): el proceso de facturación electrónica requería exportar a Excel, subir al portal del gobierno y copiar manualmente el código CUFE de vuelta al ERP. ¿Qué elimina ese proceso manual de raíz?",
      options: [
      "Un Custom Connector + Power Automate que automatiza el envío y captura la respuesta CUFE en tiempo real",
      "Un recordatorio diario en el calendario del analista",
      "Una plantilla de Excel más ordenada",
      "Aumentar el número de analistas en el equipo de facturación"
      ],
      answer: [0],
      explanation: "El caso automatiza el flujo completo (envío y captura de respuesta) con un Custom Connector integrado en Power Automate, eliminando los 8 pasos manuales previos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Distribuidora): ¿qué evento de Dataverse dispara el flujo de facturación electrónica en el caso?",
      options: [
      "Que un usuario abra manualmente el registro del pedido",
      "Que el pedido pase al estado 'Facturado'",
      "Que pasen 24 horas desde la creación del pedido",
      "Que el analista presione un botón en Excel"
      ],
      answer: [1],
      explanation: "El caso especifica un trigger en Dataverse cuando el pedido pasa a 'Facturado' — un cambio de estado automático, no una acción manual periódica.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Distribuidora): ¿qué práctica evita que el conector deje de funcionar si la URL de la API del gobierno cambia?",
      options: [
      "Hardcodear la URL directamente en el conector",
      "Usar parámetros de conexión en vez de URLs fijas",
      "Duplicar el conector por cada URL posible",
      "No es necesario prevenir esto, las URLs de gobierno nunca cambian"
      ],
      answer: [1],
      explanation: "Es una buena práctica explícita del caso: nunca hardcodear URLs de API en el conector, usar parámetros de conexión que puedan actualizarse sin modificar el conector mismo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Distribuidora): ¿qué mecanismo permite portar el conector entre ambientes (DEV/TEST/PROD) sin reconfigurar conexiones directas en cada flujo?",
      options: [
      "Guardar el conector en una solución y usar Connection References en los flujos",
      "Copiar y pegar el conector manualmente en cada ambiente",
      "Usar conexiones directas, una por flujo",
      "No es posible portar Custom Connectors entre ambientes"
      ],
      answer: [0],
      explanation: "El caso recomienda guardar el conector en una solución y usar Connection References (no conexiones directas) para que los flujos sean portables entre ambientes.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Distribuidora): ¿cuáles DOS resultados demuestra el caso tras implementar el Custom Connector?",
      options: [
      "Cero errores de CUFE copiado incorrectamente",
      "4 horas de trabajo manual diario eliminadas",
      "Se eliminó la necesidad de facturar electrónicamente ante el gobierno",
      "El ERP dejó de necesitar el código CUFE"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados cuantificables. La facturación electrónica y el CUFE siguen siendo requisitos del proceso — ahora automatizados, no eliminados.",
      appliesTo: "caso"
    }
  ],
  15: [
    {
      type: "single",
      prompt: "Quieres que el bot responda preguntas frecuentes como saludo o cierre usando capacidades base, pero además necesitas un flujo conversacional propio para registrar incidentes. ¿Cómo se reparten esas piezas?",
      options: [
      "Todo debe ir en System topics exclusivamente",
      "Los System topics cubren comportamientos base y los Custom topics resuelven procesos específicos del negocio",
      "Los Custom topics reemplazan automáticamente la publicación del bot",
      "Las entidades sustituyen por completo a los topics"
      ],
      answer: [1],
      explanation: "System topics resuelven comportamientos comunes del asistente, mientras los Custom topics modelan conversaciones particulares del negocio. Las entidades ayudan a capturar datos, pero no reemplazan la lógica conversacional completa."
    },
    {
      type: "single",
      prompt: "Un tema del bot debe capturar la prioridad del incidente con valores válidos Alta, Media o Baja y validar opciones cerradas. ¿Qué tipo de entidad se ajusta mejor?",
      options: [
      "Pattern entity",
      "Closed list entity (Lista cerrada)",
      "Custom table en Dataverse obligatoria",
      "Variable $number"
      ],
      answer: [1],
      explanation: "Una Closed list entity (Lista cerrada) es la opción correcta cuando el usuario debe elegir entre un conjunto finito de valores definidos (Alta, Media, Baja). Es el término oficial en Copilot Studio. Pattern entity se usa para formatos como fechas o códigos, y las otras opciones no ofrecen validación conversacional integrada."
    },
    {
      type: "single",
      prompt: "El bot debe responder preguntas abiertas sobre políticas internas basándose en documentos publicados, sin diseñar un topic por cada pregunta posible. ¿Qué característica evalúas primero?",
      options: [
      "Generative Answers con knowledge sources confiables",
      "Quick View forms",
      "Solution Checker",
      "RANKX"
      ],
      answer: [0],
      explanation: "Generative Answers está orientado a responder a partir de fuentes de conocimiento, reduciendo la necesidad de topics exhaustivos para FAQ extensas. Las otras opciones pertenecen a productos distintos y no cubren el patrón conversacional pedido."
    },
    {
      type: "multi",
      prompt: "El área de soporte quiere medir adopción y además transferir conversaciones complejas a un agente humano cuando el bot no resuelva. ¿Qué DOS capacidades son relevantes?",
      options: [
      "Transfer to Agent para escalación humana en el momento adecuado",
      "Analítica de engagement para revisar abandono, resolución y uso de temas",
      "Cambiar todas las variables del bot a $number",
      "Reemplazar el bot por un dashboard de Power BI"
      ],
      answer: [0, 1],
      explanation: "Transfer to Agent cubre la continuidad operativa cuando el bot llega a un límite, y la analítica permite mejorar el diseño conversacional con evidencia. Cambiar tipos de variable o reemplazar el canal no resuelve ni escalación ni medición."
    },
    {
      type: "single",
      prompt: "Un topic debe crear una solicitud en un sistema externo y devolver el número generado antes de continuar la conversación. ¿Qué integración es más apropiada desde Copilot Studio?",
      options: [
      "Llamar una Action como Cloud Flow o HTTP según el caso",
      "Crear una vista personal de Dataverse",
      "Usar únicamente un mensaje estático",
      "Modificar el sitemap del entorno"
      ],
      answer: [0],
      explanation: "Las Actions permiten conectar el bot con procesos externos, ya sea mediante Cloud Flows o llamadas HTTP, y devolver resultados al flujo conversacional. Un mensaje estático no ejecuta integración, y las otras opciones no pertenecen al ámbito del bot."
    },
    {
      type: "single",
      prompt: "Un usuario escribe 'quiero ver el estado de SOL-00123' al activar el topic de consulta, y el agente no le pregunta el número de solicitud porque ya lo detectó en el mismo mensaje. ¿Qué comportamiento de Copilot Studio explica esto?",
      options: [
      "Slot Filling, que detecta el valor requerido en el mensaje inicial y omite la pregunta",
      "Generative Answers, que responde con contenido de Knowledge Sources",
      "Transfer to Agent, que escala la conversación",
      "Un Policy Template de tipo Set Header"
      ],
      answer: [0],
      explanation: "Slot Filling detecta automáticamente si el valor de una variable requerida ya vino en el mensaje del usuario y, en ese caso, no formula la pregunta correspondiente. Generative Answers y Transfer to Agent no están relacionados con la captura automática de variables."
    },
    {
      type: "single",
      prompt: "Un valor capturado en el topic 'Consultar Estado' debe estar disponible también en el topic 'Escalar Solicitud' al que se redirige la conversación, sin perderse al salir del primer topic. ¿Qué alcance de variable se debe usar?",
      options: [
      "Global.X, que persiste durante toda la conversación entre todos los topics",
      "Topic.X, que es local y se pierde al salir del topic",
      "System.X, reservado para variables del sistema como el usuario",
      "Una entidad tipo Pattern"
      ],
      answer: [0],
      explanation: "Las variables Global.X persisten durante toda la conversación y están disponibles entre distintos topics, a diferencia de Topic.X que es local al topic donde se define. System.X está reservado para variables propias de la plataforma, no para datos capturados por el maker."
    },
    {
      type: "single",
      prompt: "Un agente configurado con Generative Answers responde preguntas frecuentes usando el manual de usuario en SharePoint, pero el manual fue actualizado hace dos semanas y las respuestas siguen mostrando información antigua. ¿Cuál es la causa más probable?",
      options: [
      "El agente no detecta cambios automáticamente y los Knowledge Sources deben actualizarse/reindexarse manualmente",
      "Las trigger phrases del topic de Fallback están mal configuradas",
      "El bot no tiene canal de Teams publicado",
      "La entidad Closed list del topic no incluye sinónimos"
      ],
      answer: [0],
      explanation: "Los Knowledge Sources no se sincronizan automáticamente ante cambios en el contenido origen; es necesario actualizarlos o forzar el reindexado cuando el material cambia. Las trigger phrases y el canal no afectan la vigencia del contenido consultado por Generative Answers."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Mesa de ayuda IT): el 70% de los tickets eran consultas de estado repetitivas que consumían 4 horas diarias de los analistas. ¿Qué solución del caso resuelve directamente ese volumen?",
      options: [
      "Contratar más analistas para el equipo de mesa de ayuda",
      "Un bot de Copilot Studio integrado a Dataverse vía Power Automate",
      "Un formulario de Power Apps para que los empleados llenen su propio ticket",
      "Un dashboard de Power BI con el estado de los tickets"
      ],
      answer: [1],
      explanation: "El caso implementa un bot de Copilot Studio que consulta Dataverse vía Power Automate para responder automáticamente las consultas de estado, liberando el tiempo de los analistas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Mesa de ayuda IT): ¿por qué el caso recomienda mínimo 8 trigger phrases por topic, con variaciones naturales y errores tipográficos comunes?",
      options: [
      "Para cumplir un requisito técnico obligatorio de Copilot Studio",
      "Para que el bot reconozca la intención del usuario aunque la formule de distintas formas",
      "Porque cada trigger phrase consume una licencia distinta",
      "Para que el bot responda más rápido"
      ],
      answer: [1],
      explanation: "Los usuarios formulan la misma pregunta de muchas maneras; variar las trigger phrases (incluyendo errores comunes) mejora la tasa de reconocimiento del topic correcto.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Mesa de ayuda IT): se necesita compartir un valor entre varios topics del bot, no solo dentro de uno. ¿Qué tipo de variable debe usarse?",
      options: [
      "Topic.X, porque es la variable estándar",
      "Global.X, ya que Topic.X es local a un solo topic",
      "Una variable de entorno de Power Platform",
      "No es posible compartir variables entre topics"
      ],
      answer: [1],
      explanation: "El caso indica que las variables Topic.X son locales al topic donde se declaran; para compartir un valor entre varios topics se debe usar Global.X.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Mesa de ayuda IT): ¿qué salvaguarda debe tener siempre el bot para no dejar al usuario sin respuesta cuando no entiende la pregunta?",
      options: [
      "Un Fallback topic personalizado con nodo de 'no entendí'",
      "Cerrar la conversación automáticamente",
      "Redirigir siempre a un analista humano sin excepción",
      "Repetir la última respuesta dada"
      ],
      answer: [0],
      explanation: "El caso indica como buena práctica agregar siempre un nodo de 'no entendí' en el Fallback topic personalizado, en vez de dejar la conversación sin una respuesta útil.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Mesa de ayuda IT): ¿cuáles DOS resultados demuestra el caso tras implementar el bot?",
      options: [
      "65% de las consultas resueltas por el bot",
      "Tiempo de respuesta reducido de 2 horas a instantáneo",
      "Eliminación total del equipo de analistas de mesa de ayuda",
      "El bot dejó de necesitar el canal de Teams para funcionar"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados cuantificables. Los analistas siguen atendiendo el 35% restante de consultas, y el canal Teams es parte central de la solución, no algo prescindible.",
      appliesTo: "caso"
    }
  ],
  16: [
    {
      type: "single",
      prompt: "La organización quiere impedir que datos de clientes salgan por conectores de redes sociales en un ambiente de producción, aunque sí permite esos conectores en un sandbox de innovación. ¿Qué control debes usar?",
      options: [
      "DLP Policy por ambiente o grupo de ambientes",
      "Quick Create form",
      "Power BI App",
      "Named Formula"
      ],
      answer: [0],
      explanation: "Las DLP Policies clasifican y restringen conectores para reducir riesgo de exfiltración de datos entre servicios permitidos y bloqueados. Formularios, Apps de Power BI o fórmulas de Canvas no gobiernan ese tipo de riesgo transversal."
    },
    {
      type: "single",
      prompt: "Tu tenant busca más gobernanza operativa, insights de adopción y controles adicionales sobre ambientes críticos. ¿Qué característica debes evaluar?",
      options: [
      "Managed Environments",
      "Solo dashboards personales",
      "Quick View forms",
      "Un prefijo new_ consistente"
      ],
      answer: [0],
      explanation: "Managed Environments agregan capacidades de gobierno y administración útiles para ambientes empresariales. Los otros elementos pueden ser útiles en su contexto, pero no ofrecen ese paquete de control operativo a nivel de entorno."
    },
    {
      type: "multi",
      prompt: "Preparas una solución para pasar de Dev a Test y Prod minimizando cambios manuales y dependencia del autor original. ¿Qué DOS prácticas son correctas?",
      options: [
      "Usar Connection References para desacoplar conexiones de los componentes de la solución",
      "Usar Environment Variables para parametrizar valores por ambiente",
      "Editar directamente los IDs internos dentro del archivo exportado de la solución en cada despliegue",
      "Mantener la solución Unmanaged en producción para modificarla rápido en caliente"
      ],
      answer: [0, 1],
      explanation: "Connection References y Environment Variables son piezas clave de ALM porque separan configuración del artefacto desplegable. Editar paquetes manualmente o dejar producción en Unmanaged incrementa errores y reduce control."
    },
    {
      type: "single",
      prompt: "Necesitas corregir un pequeño defecto en una solución administrada ya desplegada sin introducir una versión mayor completa. ¿Qué mecanismo está pensado para ese tipo de ajuste?",
      options: [
      "Patch solution",
      "Eliminar la solución y recrearla desde cero",
      "Cambiar el publisher prefix",
      "Modificar la base de datos del ambiente manualmente"
      ],
      answer: [0],
      explanation: "Los patch solutions están diseñados para correcciones incrementales controladas sobre una solución existente. Borrar y recrear o tocar directamente datos internos del ambiente es mucho más riesgoso y rompe gobernanza."
    },
    {
      type: "single",
      prompt: "Una empresa con varias regiones quiere que los gerentes vean registros de sus equipos, pero no todo el tenant, y que la estructura organizativa influya en el acceso. ¿Qué diseño debes revisar?",
      options: [
      "Business Units, Teams y, si aplica, Hierarchy Security",
      "Solo temas de Copilot Studio",
      "Un gráfico de barras en Power BI",
      "Component Library"
      ],
      answer: [0],
      explanation: "Business Units, Teams y Hierarchy Security permiten modelar acceso organizacional alineado a estructuras reales y niveles de supervisión. Los otros elementos no gestionan privilegios ni herencia de acceso en Dataverse."
    },
    {
      type: "single",
      prompt: "Un consultor está por importar una solución en el ambiente de producción de un cliente. ¿Qué modo de solución debe usarse para evitar que los usuarios modifiquen directamente los componentes en ese ambiente?",
      options: [
      "Solución Administrada (Managed)",
      "Solución No Administrada (Unmanaged)",
      "Solución sin publisher definido",
      "Solución exportada sin Environment Variables"
      ],
      answer: [0],
      explanation: "Las soluciones Managed se importan en modo de solo lectura, protegiendo la integridad del trabajo del implementador; cualquier cambio debe hacerse en DEV y reimportarse. Importar Unmanaged en producción permite que los usuarios modifiquen componentes directamente, generando divergencia entre ambientes."
    },
    {
      type: "single",
      prompt: "Un equipo personaliza un formulario de una solución de terceros (por ejemplo, Dynamics 365 base) agregando un nuevo campo, sin modificar directamente la solución original del proveedor. ¿Qué mecanismo de Dataverse hace esto posible?",
      options: [
      "Solution Layers, que permite que una solución propia superponga cambios sobre el componente de la solución base",
      "DLP Policy, que clasifica conectores en Business/Non-Business/Blocked",
      "Managed Properties, que define si un componente puede eliminarse",
      "Hierarchy Security, que propaga acceso por jerarquía de puestos"
      ],
      answer: [0],
      explanation: "Solution Layers permite que múltiples soluciones modifiquen el mismo componente en capas superpuestas, de modo que la solución importada más recientemente prevalece, lo cual es la forma correcta de personalizar soluciones de terceros sin editar la solución base directamente. Las otras opciones controlan distintos aspectos de gobierno."
    },
    {
      type: "single",
      prompt: "Se define el Security Role 'Consultor' con permiso de Lectura en la tabla Proyecto a nivel Organización, y sin permisos de escritura. ¿Qué implica el nivel 'Organización' respecto al alcance de acceso?",
      options: [
      "El usuario puede leer todos los registros de la tabla en toda la organización, sin importar quién sea el propietario",
      "El usuario solo puede leer los registros que él mismo creó",
      "El usuario puede leer únicamente registros de su misma Business Unit",
      "El nivel Organización solo aplica a operaciones de escritura, no de lectura"
      ],
      answer: [0],
      explanation: "El nivel de acceso 'Organización' en un Security Role otorga el privilegio sobre todos los registros de la tabla en el tenant, independientemente del propietario o la Business Unit, a diferencia de los niveles Usuario o Unidad de Negocio que restringen el alcance. Es el nivel más amplio dentro del modelo de seguridad de Dataverse."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): al exportar soluciones a clientes, los flujos fallaban porque tenían la URL y credenciales del entorno de desarrollo hardcodeadas. ¿Qué mecanismo resuelve esto?",
      options: [
      "Environment Variables y Connection References",
      "Aumentar el timeout de los flujos",
      "Exportar siempre en modo Unmanaged",
      "Pedir al cliente que use las mismas credenciales del desarrollador"
      ],
      answer: [0],
      explanation: "El caso mueve URLs y credenciales a Environment Variables y convierte las conexiones a Connection References, permitiendo que cada cliente configure sus propios valores al importar.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): ¿qué modo de exportación debe usarse siempre para mover soluciones a TEST/UAT/PROD, según las buenas prácticas del caso?",
      options: [
      "Managed, nunca Unmanaged a producción",
      "Unmanaged, porque permite editar directamente en el cliente",
      "Cualquiera de los dos, no hay diferencia real",
      "Managed solo en DEV, Unmanaged en el resto"
      ],
      answer: [0],
      explanation: "El caso es explícito: exportar siempre en modo Managed para TEST/UAT/PROD, nunca Unmanaged a producción, para proteger la integridad de los componentes en el ambiente del cliente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): ¿por qué nunca se debe editar un componente directamente en PROD, según el caso?",
      options: [
      "Porque PROD no permite ediciones técnicamente",
      "Porque los cambios deben originarse en DEV, empaquetarse en una solución e importarse — editar en PROD rompe el ALM",
      "Porque solo el administrador global puede editar en PROD",
      "Porque editar en PROD consume más licencias"
      ],
      answer: [1],
      explanation: "El flujo correcto de ALM es DEV → solución → importar; editar directamente en PROD rompe la trazabilidad de cambios y desincroniza el ambiente productivo del control de versiones.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): la firma entrega una DLP policy estándar como parte de la implementación. ¿Qué recomendación de DLP para producción menciona el caso?",
      options: [
      "Permitir todos los conectores sin restricción para no limitar al cliente",
      "Bloquear HTTP genérico en producción si no es necesario",
      "Desactivar DLP en producción para mayor flexibilidad",
      "Aplicar DLP solo en el ambiente de desarrollo"
      ],
      answer: [1],
      explanation: "El caso recomienda bloquear el conector HTTP genérico en producción cuando no es necesario, reduciendo el riesgo de integraciones no controladas.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Firma de consultoría): ¿cuáles DOS resultados demuestra el caso tras estandarizar Environment Variables y Connection References?",
      options: [
      "Tiempo de implementación en un nuevo cliente reducido de 3 días a 4 horas",
      "Cero tickets de 'el flujo falla' por credenciales incorrectas",
      "Ya no fue necesario que el cliente configurara ninguna credencial propia",
      "Se eliminó la necesidad de exportar en modo Managed"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. El wizard de importación sigue guiando al cliente para configurar SUS propias credenciales (no las elimina), y el modo Managed sigue siendo obligatorio para TEST/UAT/PROD.",
      appliesTo: "caso"
    }
  ],
  17: [
    {
      type: "single",
      prompt: "En el proyecto integrador, el proceso operativo lo usarán agentes internos, supervisores analíticos y un comité ejecutivo. ¿Qué reparto de capas suele ser más coherente?",
      options: [
      "Una sola Canvas App para todo, incluyendo analítica ejecutiva y administración maestra",
      "Model-Driven para operación basada en datos, Canvas para experiencia específica y Power BI para analítica",
      "Solo Power BI porque puede capturar transacciones",
      "Copilot Studio como reemplazo total de las aplicaciones"
      ],
      answer: [1],
      explanation: "Una arquitectura multicapa asigna cada producto a su fortaleza: operación transaccional, experiencia especializada y analítica. Forzar todo en una sola herramienta suele empeorar mantenibilidad y experiencia de usuario."
    },
    {
      type: "single",
      prompt: "Se acerca el despliegue a producción y el arquitecto pide validar que la solución soporte promoción futura a más países sin rediseño mayor. ¿Cuál evidencia pesa más?",
      options: [
      "La solución usa versionado, Managed para producción, Environment Variables y Connection References",
      "La app principal funciona en el equipo del desarrollador aunque tenga URLs fijas",
      "Los usuarios conocen la contraseña de una cuenta compartida",
      "Se pueden cambiar campos manualmente en producción si algo falla"
      ],
      answer: [0],
      explanation: "Esos elementos demuestran madurez de ALM y preparación para despliegues repetibles en múltiples ambientes o regiones. Un éxito local con valores hardcodeados no garantiza escalabilidad ni operación segura."
    },
    {
      type: "multi",
      prompt: "El comité de calidad define criterios mínimos para aceptar la solución empresarial. ¿Qué DOS criterios son especialmente sólidos?",
      options: [
      "Prefijos de publisher consistentes y ausencia de cambios directos no controlados en producción",
      "Row-Level Security o seguridad de datos correctamente diseñada según la audiencia",
      "Uso de errores silenciosos para no preocupar al usuario final",
      "Dependencia de un ambiente personal del desarrollador para operar"
      ],
      answer: [0, 1],
      explanation: "La consistencia de componentes y la seguridad efectiva son señales claras de una solución empresarial madura. Los errores silenciosos y la dependencia de activos personales son anti-patrones que degradan soporte y continuidad operativa."
    },
    {
      type: "single",
      prompt: "Durante una prueba integrada, un supervisor ve registros fuera de su territorio porque la app filtra visualmente, pero el dataset de Power BI y Dataverse no tienen restricción real. ¿Cuál es el problema principal?",
      options: [
      "Falta seguridad real en el modelo de datos y posiblemente en RLS, no solo en la interfaz",
      "El problema se resuelve cambiando el color del tema de la app",
      "Basta con ocultar la galería en Canvas Apps",
      "El sitemap de Model-Driven está incompleto"
      ],
      answer: [0],
      explanation: "La seguridad no debe depender de filtros visuales; debe implementarse en Dataverse y, para analítica, en RLS u otras capas reales del modelo. Ocultar controles no impide acceso por otras rutas ni protege datos exportables."
    },
    {
      type: "single",
      prompt: "El equipo debate si corregir incidentes directamente en producción para ahorrar tiempo o seguir el pipeline de ambientes. ¿Qué decisión es más profesional en una solución PL-200 madura?",
      options: [
      "Cambiar producción manualmente siempre que el usuario esté esperando",
      "Promover cambios por ambientes con trazabilidad, pruebas y artefactos controlados",
      "Trabajar solo en ambientes personales y luego copiar pantallas",
      "Desactivar auditoría para acelerar despliegues"
      ],
      answer: [1],
      explanation: "Promover cambios de forma controlada protege la estabilidad, deja evidencia y reduce riesgo de regresiones en escenarios empresariales. Los arreglos directos sin ALM pueden parecer rápidos, pero introducen deriva y dificultan soporte futuro."
    },
    {
      type: "single",
      prompt: "En el sistema CRM-lite, la columna `sit_monto_ponderado` de Oportunidad se define como `sit_monto_estimado * sit_probabilidad / 100` y debe quedar almacenada para poder filtrarse en vistas y flujos. ¿Qué tipo de columna corresponde a ese requisito?",
      options: [
      "Columna Calculada, ya que persiste su valor y referencia campos del mismo registro",
      "Columna Rollup, ya que agrega valores de registros hijos",
      "Formula column, ya que siempre es filtrable en OData",
      "Columna de texto multilínea con fórmula manual"
      ],
      answer: [0],
      explanation: "Una Columna Calculada se evalúa en el servidor, se almacena y es filtrable en FetchXML/vistas, además de operar sobre campos del mismo registro como sit_monto_estimado y sit_probabilidad. Rollup agrega desde registros hijos relacionados, y las Formula columns (Power Fx) no son filtrables directamente en consultas OData."
    },
    {
      type: "single",
      prompt: "En el proyecto integrador, el Child Flow 'Determinar Aprobador' recibe monto y tipoCliente, y se reutiliza tanto para aprobar propuestas comerciales como para otros procesos futuros de aprobación. ¿Qué principio de diseño de Power Automate se está aplicando?",
      options: [
      "Encapsular lógica de negocio reutilizable en un Child Flow para evitar duplicarla en cada flujo padre",
      "Ejecutar la lógica de aprobación directamente en JavaScript del formulario",
      "Guardar el nivel de aprobación como Environment Variable por ambiente",
      "Usar una Business Rule en lugar de un flujo para decidir el aprobador"
      ],
      answer: [0],
      explanation: "Un Child Flow reutilizable centraliza una lógica común (determinar aprobador según monto y tipo de cliente) para que múltiples flujos padre la invoquen sin duplicar la implementación, facilitando el mantenimiento. Las Environment Variables sirven para configuración, no para encapsular lógica de decisión."
    },
    {
      type: "multi",
      prompt: "El dashboard de pipeline comercial en Power BI debe mostrar a cada vendedor solo sus propias oportunidades, y el bot de Copilot Studio debe poder consultar el estado de una oportunidad en Dataverse en tiempo real. ¿Qué DOS combinaciones de capacidades del Nivel 2 resuelven correctamente estos dos requisitos del proyecto integrador?",
      options: [
      "Row Level Security con USERPRINCIPALNAME() en el modelo de Power BI para el dashboard por vendedor",
      "Un topic de Copilot Studio con nodo de Acción que llama a un Power Automate flow (trigger 'When called from a Copilot Studio agent') para consultar Dataverse",
      "Ocultar visualmente las columnas del reporte según el nombre del vendedor conectado",
      "Reemplazar el modelo de Power BI por una Canvas App para evitar configurar seguridad"
      ],
      answer: [0, 1],
      explanation: "RLS con USERPRINCIPALNAME() filtra realmente los datos del vendedor en el modelo de Power BI, y un topic con Acción que invoca un flujo con el trigger correcto permite que el bot consulte Dataverse y devuelva datos actualizados. Ocultar columnas visualmente no es seguridad real, y reemplazar el modelo de Power BI no resuelve el requisito de reporting analítico."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Integrador): pipeline en Excel, sin visibilidad para gerentes, propuestas aprobadas por WhatsApp. ¿Qué componente da a los vendedores en campo una app simple y mobile-friendly para capturar datos?",
      options: [
      "Model-Driven App",
      "Canvas App",
      "Power BI",
      "Copilot Studio"
      ],
      answer: [1],
      explanation: "El caso asigna explícitamente la Canvas App mobile-friendly para los vendedores en campo — una experiencia simple orientada a captura rápida desde el celular.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Integrador): los gerentes necesitan una vista de administración completa del pipeline, con capacidad de gestión de datos tabular. ¿Qué componente cubre ese rol?",
      options: [
      "Canvas App",
      "Model-Driven App",
      "Power Automate",
      "Un bot de Teams"
      ],
      answer: [1],
      explanation: "El caso asigna la Model-Driven App a los gerentes, orientada a gestión de datos con vistas y formularios administrativos — distinto del rol de captura simple de la Canvas App.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Integrador): se necesita que las aprobaciones de propuestas queden formalizadas con historial auditable (audit trail), reemplazando las aprobaciones por WhatsApp. ¿Qué componente lo implementa?",
      options: [
      "Power BI",
      "Power Automate",
      "Canvas App, con un botón de aprobar",
      "Un canal de Teams sin flujo asociado"
      ],
      answer: [1],
      explanation: "El caso asigna a Power Automate la formalización de las aprobaciones con audit trail, algo que un simple botón o un canal de chat no garantizan por sí solos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Integrador): según las buenas prácticas del caso, ¿qué se debe diseñar PRIMERO en un proyecto integrado, antes de construir cualquier app?",
      options: [
      "El modelo de datos",
      "El bot de Teams",
      "El dashboard de Power BI",
      "El esquema de colores de la Canvas App"
      ],
      answer: [0],
      explanation: "El caso indica explícitamente: 'diseñar el modelo de datos PRIMERO antes de construir cualquier app' — todos los demás componentes (Canvas, Model-Driven, flujos, BI, bot) dependen de ese modelo.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Proyecto Integrador): ¿cuáles DOS resultados demuestra el caso tras implementar la solución integrada?",
      options: [
      "Tiempo de aprobación de propuestas reducido de 3 días a 4 horas",
      "Adopción del sistema del 90% en el primer mes",
      "Eliminación total de la necesidad de un modelo de datos centralizado",
      "El bot de Teams reemplazó completamente a la Canvas App"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. El modelo de datos centralizado es la base de toda la solución, y el bot de Teams cumple un rol de consulta rápida, no reemplaza a la Canvas App de captura.",
      appliesTo: "caso"
    }
  ],
  18: [
    {
      type: "single",
      prompt: "Una empresa quiere reemplazar hojas de cálculo de ventas por una aplicación interna con formularios sobre tablas relacionadas, seguridad por roles y procesos guiados. ¿Qué experiencia de Power Platform debes priorizar?",
      options: [
      "Canvas App",
      "Model-Driven App",
      "Power Pages",
      "Power BI"
      ],
      answer: [1],
      explanation: "Model-Driven App es la mejor opción cuando el proceso depende de Dataverse, relaciones, vistas, formularios y seguridad nativa. Canvas da más libertad visual pero exige más diseño manual, Power Pages es para usuarios externos y Power BI no es una plataforma transaccional."
    },
    {
      type: "single",
      prompt: "Un equipo necesita almacenar solicitudes con reglas de negocio, auditoría, ownership, seguridad a nivel fila y futura automatización con plugins. ¿Qué repositorio de datos es el más adecuado?",
      options: [
      "SharePoint Lists",
      "Dataverse",
      "Azure Blob Storage",
      "Excel en OneDrive"
      ],
      answer: [1],
      explanation: "Dataverse aporta seguridad, relaciones, auditoría y extensibilidad nativa para procesos de negocio. SharePoint sirve mejor para documentos y listas ligeras; Blob Storage y Excel no cubren bien reglas transaccionales ni gobierno empresarial."
    },
    {
      type: "multi",
      prompt: "Estás aplicando el patrón Strangler Fig para modernizar un sistema legacy de cotizaciones. ¿Qué DOS acciones siguen correctamente ese patrón?",
      options: [
      "Encaminar nuevas capacidades por una capa de integración y retirar partes del legacy de forma incremental",
      "Reescribir todo el sistema en un solo corte de producción",
      "Registrar cada decisión relevante en un ADR para justificar límites, riesgos y rollback",
      "Mantener duplicada indefinidamente la lógica en ambos sistemas para evitar decisiones"
      ],
      answer: [0, 2],
      explanation: "Strangler Fig moderniza por incrementos controlados y reduce riesgo en comparación con un big bang. Los ADR ayudan a documentar por qué se corta, integra o retira cada pieza; duplicar lógica de forma permanente aumenta deuda técnica."
    },
    {
      type: "single",
      prompt: "Un pedido creado en Dataverse debe notificar de forma asíncrona a facturación, logística y analítica sin bloquear al usuario. ¿Qué patrón de integración es el más apropiado?",
      options: [
      "Llamadas HTTP síncronas punto a punto a cada sistema",
      "Exportación manual diaria a CSV",
      "Azure Service Bus con tópico y suscripciones",
      "Actualizar todos los sistemas desde JavaScript del formulario"
      ],
      answer: [2],
      explanation: "Un tópico de Service Bus permite fan-out asíncrono y desacopla a los consumidores del productor. Las llamadas síncronas y el JavaScript del formulario agregan latencia y fragilidad, mientras que el CSV diario no cubre near real-time."
    },
    {
      type: "single",
      prompt: "Tu programa enterprise separa capacidades comunes, CRM y gestión de proyectos en soluciones distintas. ¿Cuál es el beneficio principal de una arquitectura multi-solution como Foundation/CRM/Proyectos?",
      options: [
      "Eliminar por completo las dependencias entre componentes",
      "Permitir versionado y despliegue independientes con límites funcionales claros",
      "Obligar a que todos los cambios pasen siempre por la misma solución",
      "Evitar el uso de Environment Variables y Connection References"
      ],
      answer: [1],
      explanation: "Separar por dominios reduce acoplamiento y facilita gobernar releases por capacidad. No elimina todas las dependencias, pero sí las hace explícitas; además sigue siendo recomendable usar referencias y variables para ALM."
    },
    {
      type: "single",
      prompt: "Un arquitecto debe evaluar la solución de Power Platform contra fiabilidad, seguridad, eficiencia de rendimiento, costos y excelencia operacional antes del go-live. ¿Qué marco de referencia está aplicando?",
      options: [
      "Well-Architected Framework para Power Platform",
      "ITIL v4",
      "Capacity planning aislado",
      "Un ADR único"
      ],
      answer: [0],
      explanation: "El Well-Architected Framework agrupa la evaluación en cinco pilares (fiabilidad, seguridad, rendimiento, costos, excelencia operacional). ITIL es un marco de gestión de servicios más amplio, y capacity planning o un ADR cubren solo aspectos parciales de la arquitectura."
    },
    {
      type: "single",
      prompt: "Estás dimensionando el almacenamiento de Dataverse para un cliente con 40 licencias asignadas. ¿Qué regla de capacity planning debes aplicar como base de cálculo?",
      options: [
      "1GB incluido más 0.5GB adicional por cada seat licenciado",
      "10GB fijos sin importar el número de licencias",
      "El almacenamiento es ilimitado en cualquier plan",
      "Solo se factura el almacenamiento de archivos adjuntos, nunca el de tablas"
      ],
      answer: [0],
      explanation: "El capacity planning de Dataverse parte de 1GB incluido más 0.5GB por seat licenciado, además de proyectar el crecimiento y los límites de API calls diarios. Las otras opciones no reflejan el modelo real de licenciamiento."
    },
    {
      type: "single",
      prompt: "Tu organización integra Dataverse con 6 sistemas externos y quiere evitar N×(N-1) conexiones directas difíciles de mantener. ¿Qué patrón de integración deberías adoptar?",
      options: [
      "Point-to-Point entre cada par de sistemas",
      "Hub-and-Spoke con un middleware central como Service Bus o APIM",
      "Exportar todo a Excel semanalmente",
      "Duplicar la lógica de integración en cada sistema"
      ],
      answer: [1],
      explanation: "Hub-and-Spoke centraliza el enrutamiento en un middleware y evita el crecimiento exponencial de conexiones directas del patrón Point-to-Point. Exportar a Excel o duplicar lógica no resuelve el problema de mantenibilidad ni escalabilidad."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): con 12 aplicaciones separadas y datos de pólizas duplicados, nadie sabía cuál sistema era la 'fuente de verdad'. ¿Qué decisión arquitectónica resolvió directamente ese problema?",
      options: [
      "Migrar las 12 aplicaciones a la nube sin cambiar su arquitectura",
      "Establecer Dataverse como Master Data hub, fuente única de verdad para el dato de póliza",
      "Duplicar los datos en un data warehouse adicional para tener una copia de respaldo",
      "Eliminar 6 de las 12 aplicaciones sin migrar sus datos"
      ],
      answer: [1],
      explanation: "El problema era la ausencia de una fuente única de verdad. Establecer Dataverse como Master Data hub centraliza el dato de póliza en un solo lugar del que dependen los demás dominios, eliminando la duplicidad y la ambigüedad sobre cuál sistema manda.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): se necesita que Pólizas, Siniestros y Agentes evolucionen de forma independiente sin convertirse en una mega-solución difícil de mantener. ¿Qué patrón de organización de soluciones aplica?",
      options: [
      "Una única solución que contenga todos los componentes de los 3 dominios",
      "Una solución por dominio funcional, cada una dependiendo del Foundation layer compartido",
      "Una solución por cada tabla de Dataverse individual",
      "Una solución por cada ambiente (Dev, Test, Prod)"
      ],
      answer: [1],
      explanation: "Separar por dominio funcional en soluciones propias, con dependencia hacia un Foundation layer de catálogos compartidos, permite que cada dominio evolucione de forma independiente sin acoplar todo en una mega-solución.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): el Foundation layer contiene los catálogos compartidos que usan Pólizas, Siniestros y Agentes. ¿En qué dirección debe fluir la dependencia entre estas capas?",
      options: [
      "El Foundation layer puede depender de cualquier solución de dominio si lo necesita",
      "La dependencia es unidireccional: los dominios dependen de Foundation, nunca al revés",
      "No debe existir ninguna dependencia entre Foundation y los dominios",
      "La dirección de la dependencia no importa mientras todo esté en el mismo ambiente"
      ],
      answer: [1],
      explanation: "Una de las buenas prácticas explícitas del caso es que el Foundation layer nunca depende de capas superiores — la dependencia es unidireccional, de los dominios hacia Foundation. Esto evita ciclos de dependencia y mantiene la capa base estable.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): los agentes externos necesitan consultar información de pólizas sin tener licencia de Power Apps. ¿Qué componente de Power Platform se usó para ese portal?",
      options: [
      "Una Canvas App adicional para agentes",
      "Power Pages",
      "Power BI embebido en un sitio externo",
      "Power Automate con notificaciones por correo"
      ],
      answer: [1],
      explanation: "Power Pages está diseñado específicamente para usuarios externos que no requieren licencia de Microsoft 365 ni de Power Apps — el caso lo usa exactamente para el portal de agentes.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Aseguradora): ¿cuáles DOS prácticas explican que el onboarding de nuevos desarrolladores bajara de 3 semanas a 3 días?",
      options: [
      "Documentar las decisiones arquitectónicas mayores con ADR, incluso las que parecen obvias",
      "Separar por dominio funcional con dependencias claras hacia el Foundation layer",
      "Concentrar toda la lógica de negocio en una única solución monolítica",
      "Evitar cualquier documentación para que el equipo avance más rápido"
      ],
      answer: [0, 1],
      explanation: "Los ADR dan contexto inmediato de por qué se tomó cada decisión, y la separación clara por dominio con dependencias explícitas hace que un desarrollador nuevo entienda rápido dónde está cada cosa. Una mega-solución o la ausencia de documentación tienen el efecto contrario: más tiempo de onboarding.",
      appliesTo: "caso"
    }
  ],
  19: [
    {
      type: "single",
      prompt: "Un equipo pequeño despliega varias veces al día y quiere minimizar ramas largas y conflictos de merge. ¿Qué estrategia de ramas es la más adecuada?",
      options: [
      "Gitflow con ramas de larga duración para cada release",
      "Trunk-based development con ramas cortas y merges frecuentes",
      "Una rama por ambiente que nunca se fusiona",
      "Desarrollar directamente en main sin validaciones automáticas"
      ],
      answer: [1],
      explanation: "Trunk-based development reduce divergencia y favorece integración continua, especialmente con despliegues frecuentes. Gitflow aporta más sobrecarga para equipos que necesitan ciclos rápidos, y desarrollar sin validaciones eleva el riesgo."
    },
    {
      type: "single",
      prompt: "¿Qué comando debe usar el pipeline de importación para promover una solución a producción siguiendo buenas prácticas de ALM?",
      options: [
      "pac solution import --managed",
      "pac solution export --managed",
      "pac pcf push --managed",
      "pac auth create --managed"
      ],
      answer: [0],
      explanation: "En producción debe importarse la solución administrada para proteger componentes y asegurar una promoción controlada. Export se usa para generar el artefacto y los otros comandos no realizan la importación de soluciones."
    },
    {
      type: "multi",
      prompt: "Vas a parametrizar el despliegue entre DEV, TEST y PROD con deployment-settings.json. ¿Qué DOS elementos deben resolverse ahí para evitar hardcodeo por ambiente?",
      options: [
      "Connection References",
      "Environment Variables",
      "Los GUID internos del pipeline de Azure DevOps",
      "Los nombres de las ramas Git del repositorio"
      ],
      answer: [0, 1],
      explanation: "Connection References y Environment Variables permiten que el mismo paquete se promueva sin editar componentes manualmente. Los GUID del pipeline y nombres de ramas pertenecen al proceso de entrega, no a la configuración funcional del ambiente."
    },
    {
      type: "single",
      prompt: "El equipo quiere usar Solution Checker como quality gate en Azure DevOps. ¿Qué diseño es el más alineado a CI/CD enterprise?",
      options: [
      "Ejecutarlo solo si el despliegue a producción falla",
      "Configurar un umbral de severidad para fallar el pipeline antes de importar",
      "Correrlo manualmente una vez por trimestre",
      "Ignorar hallazgos de alta severidad si la demo funciona"
      ],
      answer: [1],
      explanation: "Solution Checker debe actuar como puerta preventiva y no como diagnóstico tardío. Ejecutarlo antes de importar reduce deuda técnica y evita promocionar soluciones con problemas conocidos."
    },
    {
      type: "single",
      prompt: "Se detecta un error crítico en producción y debes liberar una corrección sin esperar la siguiente ventana mensual. ¿Qué enfoque es el más apropiado?",
      options: [
      "Borrar el histórico de artifacts para liberar espacio y volver a exportar desde PROD",
      "Aplicar el fix directo en producción sin pasar por control de versiones",
      "Usar un hotfix pipeline desde una rama controlada y conservar artifacts del release asociado",
      "Esperar al próximo release mayor para no romper la cadencia"
      ],
      answer: [2],
      explanation: "Un hotfix pipeline mantiene trazabilidad, rollback y consistencia entre código fuente y ambiente. Corregir directo en producción o perder artifacts debilita auditoría y complica reproducir el release."
    },
    {
      type: "single",
      prompt: "El equipo de plataforma quiere eliminar la rotación manual de client secrets en los pipelines que despliegan a Power Platform. ¿Qué mecanismo de autenticación deben priorizar?",
      options: [
      "Managed Identity en lugar de Service Principal con client secret",
      "Guardar el secreto en una variable de pipeline sin cifrar",
      "Compartir las credenciales del administrador entre todos los pipelines",
      "Usar el mismo Service Connection para DEV y PROD"
      ],
      answer: [0],
      explanation: "Managed Identity elimina la necesidad de almacenar y rotar secretos manualmente. Guardar secretos sin cifrar, compartir credenciales de admin, o reutilizar el mismo Service Connection entre ambientes son antipatrones de seguridad y gobernanza."
    },
    {
      type: "single",
      prompt: "Tu pipeline exporta la solución solo una vez en el stage de Build y ese mismo .zip se despliega a TEST, UAT y PROD. ¿Qué beneficio principal aporta este diseño frente a exportar de nuevo en cada ambiente?",
      options: [
      "Garantiza que todos los ambientes reciben exactamente el mismo binario validado por Solution Checker",
      "Reduce el tamaño del archivo .zip generado",
      "Permite que cada ambiente tenga una versión distinta del mismo componente",
      "Elimina la necesidad de Environment Variables"
      ],
      answer: [0],
      explanation: "Publicar el artifact una sola vez y promoverlo entre ambientes asegura consistencia: lo que pasó Solution Checker en Build es exactamente lo que se importa en TEST, UAT y PROD. Volver a exportar en cada ambiente rompe esa garantía y no elimina la necesidad de parametrizar variables de entorno."
    },
    {
      type: "multi",
      prompt: "Tu organización migra sus pipelines de Azure DevOps a GitHub Actions para Power Platform. ¿Qué DOS afirmaciones son correctas sobre `microsoft/powerplatform-actions`?",
      options: [
      "Provee acciones equivalentes a los Power Platform Build Tools como export-solution, import-solution y check-solution",
      "Permite construir pipelines CI/CD completos en GitHub sin instalar manualmente el pac CLI",
      "Solo funciona si el pipeline corre en Azure DevOps",
      "Reemplaza la necesidad de Service Connections o secretos de autenticación en cualquier escenario"
      ],
      answer: [0, 1],
      explanation: "microsoft/powerplatform-actions replica en GitHub Actions las capacidades de los Build Tools de Azure DevOps y automatiza la instalación del pac CLI. No está limitado a Azure DevOps —es específico de GitHub— y sigue requiriendo credenciales (app-id, client-secret, tenant-id) para autenticarse."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Partner Microsoft): los despliegues manuales tardaban 3 horas y 1 de cada 4 tenía errores, sin audit trail de qué se desplegó. ¿Qué solución del caso ataca la raíz de ese problema?",
      options: [
      "Contratar más personas para hacer el despliegue manual en paralelo",
      "Un pipeline completo de CI/CD en Azure DevOps con build automático en cada PR",
      "Aumentar el tamaño del equipo de QA",
      "Desplegar directamente a producción sin pasar por TEST/UAT"
      ],
      answer: [1],
      explanation: "El caso implementa un pipeline CI/CD completo que automatiza build, validación y despliegue, eliminando el proceso manual propenso a error y dejando trazabilidad completa en Azure DevOps.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Partner Microsoft): se necesita que el pipeline falle inmediatamente si la solución tiene errores críticos, sin gastar tiempo en pasos posteriores. ¿Qué práctica del caso lo logra?",
      options: [
      "Ejecutar el Solution Checker en el primer stage del pipeline",
      "Ejecutar el Solution Checker solo después de desplegar a PROD",
      "Omitir el Solution Checker si el equipo tiene prisa",
      "Ejecutar el Solution Checker una vez al mes"
      ],
      answer: [0],
      explanation: "El caso indica 'el pipeline debe fallar rápido — Solution Checker en el primer stage', deteniendo el proceso antes de invertir tiempo en stages posteriores si hay errores críticos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Partner Microsoft): PROD requiere una validación humana extra que TEST no requiere (deploy automático). ¿Qué configuración de Azure DevOps implementa esa diferencia?",
      options: [
      "'Required approvers' configurado en el Environment de PROD (2 aprobadores)",
      "Una Business Rule en Dataverse",
      "Un Connection Reference adicional",
      "Aumentar el timeout del pipeline"
      ],
      answer: [0],
      explanation: "El caso configura 'Required approvers' en los Environments de UAT (aprobación del cliente) y PROD (2 aprobadores) de Azure DevOps, mientras que TEST se despliega automáticamente sin aprobación.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Partner Microsoft): ¿por qué el caso recomienda usar Managed Identity en producción en vez de secretos de usuario?",
      options: [
      "Porque Managed Identity es más rápida de configurar, sin importar la seguridad",
      "Porque evita almacenar y rotar credenciales de un usuario específico, reduciendo el riesgo de exposición",
      "Porque los secretos de usuario no funcionan en Azure DevOps",
      "Porque Managed Identity no requiere ningún tipo de permiso"
      ],
      answer: [1],
      explanation: "Managed Identity elimina la necesidad de gestionar y rotar credenciales de un usuario/aplicación, reduciendo la superficie de exposición de secretos en el pipeline de producción.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Partner Microsoft): ¿cuáles DOS resultados demuestra el caso tras implementar el pipeline CI/CD?",
      options: [
      "Tiempo de despliegue reducido de 3 horas a 25 minutos",
      "Cero errores en PROD durante 6 meses",
      "Se eliminó la necesidad de ambientes TEST y UAT",
      "El Solution Checker dejó de ser necesario"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. Los ambientes TEST/UAT y el Solution Checker siguen siendo parte central del pipeline, no se eliminaron.",
      appliesTo: "caso"
    }
  ],
  20: [
    {
      type: "single",
      prompt: "Un vendedor confirma que un lead ya tiene presupuesto, autoridad y fecha de compra. ¿Qué acción en Dynamics 365 Sales refleja mejor el proceso estándar?",
      options: [
      "Convertirlo en caso de Customer Service",
      "Calificar el lead para crear cuenta/contacto/oportunidad según corresponda",
      "Cerrar el lead como perdido para evitar duplicados",
      "Crear directamente la factura sin oportunidad"
      ],
      answer: [1],
      explanation: "Lead Qualification convierte el interés en registros comerciales utilizables dentro del proceso de ventas. Crear una factura o un caso omite etapas clave como oportunidad, cotización y pedido."
    },
    {
      type: "single",
      prompt: "La dirección comercial quiere comparar pipeline esperado por trimestre contra objetivos de cada gerente. ¿Qué capacidades debes usar principalmente?",
      options: [
      "Forecast y Goal Management",
      "Knowledge Base y SLA",
      "Unified Routing y Queues",
      "Customer Voice y OmniChannel"
      ],
      answer: [0],
      explanation: "Forecast permite proyectar ventas y Goal Management ayuda a medir cumplimiento contra metas. Las demás opciones pertenecen al ámbito de servicio al cliente y no al seguimiento comercial."
    },
    {
      type: "multi",
      prompt: "Un centro de soporte quiere asignar casos por habilidades del agente y controlar vencimientos de atención. ¿Qué DOS componentes son más relevantes?",
      options: [
      "Unified Routing",
      "SLA",
      "Price Lists",
      "Product Catalog"
      ],
      answer: [0, 1],
      explanation: "Unified Routing distribuye trabajo según reglas y capacidades, mientras SLA mide y automatiza compromisos de servicio. Price Lists y Product Catalog son piezas de ventas, no de operación de casos."
    },
    {
      type: "single",
      prompt: "Tu organización recibe preguntas repetitivas sobre devoluciones y garantías. ¿Qué enfoque reduce tiempos de resolución y mejora consistencia?",
      options: [
      "Pedir a cada agente que responda desde memoria para ganar velocidad",
      "Crear artículos en Knowledge Base reutilizables desde Customer Service",
      "Mover todos los casos a Sales Hub",
      "Desactivar el enrutamiento para que todos vean todos los casos"
      ],
      answer: [1],
      explanation: "Knowledge Base centraliza respuestas aprobadas y acelera la atención con contenido reutilizable. Las demás opciones aumentan inconsistencia, errores y esfuerzo operativo."
    },
    {
      type: "single",
      prompt: "Una empresa vende el mismo producto con precios distintos por segmento y región. ¿Qué configuración soporta mejor ese escenario en Dynamics 365 Sales?",
      options: [
      "Una sola lista de precios global sin variaciones",
      "Product Catalog combinado con Price Lists por segmento o región",
      "Casos y colas por territorio",
      "SLA por línea de producto"
      ],
      answer: [1],
      explanation: "Product Catalog define productos y Price Lists permite aplicar variaciones comerciales según contexto. Casos, colas y SLA pertenecen al dominio de servicio y no resuelven la estrategia de pricing."
    },
    {
      type: "single",
      prompt: "Un gerente comercial quiere que los vendedores reciban automáticamente una tarea de llamada un día después de enviar una propuesta y un email de seguimiento si no hay respuesta en 3 días. ¿Qué funcionalidad de Dynamics 365 Sales implementa esto?",
      options: [
      "Sales Accelerator con una Sequence configurada",
      "Unified Routing",
      "Entitlements",
      "Knowledge Base"
      ],
      answer: [0],
      explanation: "Sales Accelerator ejecuta secuencias de actividades predefinidas con intervalos y condiciones, exactamente el escenario descrito. Unified Routing y Entitlements pertenecen al dominio de servicio al cliente, y Knowledge Base es un repositorio de artículos, no un motor de secuencias comerciales."
    },
    {
      type: "single",
      prompt: "El equipo quiere activar Predictive Opportunity Scoring en Dynamics 365 Sales. ¿Qué requisito es indispensable antes de que el modelo entregue resultados confiables?",
      options: [
      "Contar con licencia D365 Sales Premium y un mínimo de 40 oportunidades históricas para entrenar el modelo",
      "Tener activado únicamente Unified Routing",
      "Migrar previamente a Customer Service Hub",
      "Configurar un SLA de resolución para cada oportunidad"
      ],
      answer: [0],
      explanation: "Predictive Opportunity Scoring requiere licencia Premium y un histórico mínimo de oportunidades ganadas/perdidas para entrenar el modelo de ML. Unified Routing, Customer Service Hub y SLA son componentes de servicio al cliente, no de scoring predictivo de ventas."
    },
    {
      type: "multi",
      prompt: "Un cliente Premium tiene derecho a 50 casos por año por cualquier canal, mientras uno Estándar solo puede usar email. ¿Qué DOS afirmaciones describen correctamente cómo Dynamics 365 Customer Service gestiona esto?",
      options: [
      "Se configura un Entitlement que define casos permitidos, canales disponibles y período de vigencia",
      "El sistema descuenta automáticamente del entitlement al crearse cada caso del cliente",
      "Los entitlements se configuran únicamente dentro del SLA sin registro propio",
      "Los canales disponibles por cliente se controlan solo mediante Web Roles del portal"
      ],
      answer: [0, 1],
      explanation: "El Entitlement es un registro propio que define casos permitidos, canales y vigencia, y Dataverse descuenta automáticamente el consumo al crear cada caso. No es una sub-configuración del SLA, y los Web Roles pertenecen a Power Pages, no al control de canales de soporte en D365."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Mesa de ayuda de software): los casos se asignaban por turno rotativo sin considerar expertise; un caso de SAP llegaba a un agente de Power BI. ¿Qué mecanismo resuelve la raíz de ese problema?",
      options: [
      "Unified Routing con skills-based routing",
      "Aumentar el número de agentes en el turno",
      "Un dashboard de Power BI que muestre los casos mal asignados",
      "Eliminar el turno rotativo sin reemplazarlo por otro criterio"
      ],
      answer: [0],
      explanation: "Unified Routing con skills-based routing asigna automáticamente los casos según el skill del agente (ej. SAP nivel ≥ 3), resolviendo la causa raíz de asignaciones sin considerar expertise.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Mesa de ayuda de software): se necesita que los clientes Premium reciban resolución en 4 horas y los Estándar en 24 horas. ¿Qué mecanismo de D365 CE implementa ese SLA diferenciado?",
      options: [
      "Entitlements con SLA distinto por nivel de cliente",
      "Una Business Rule en el formulario de caso",
      "Skills-based routing, sin relación con el SLA",
      "Un campo de texto libre indicando la prioridad"
      ],
      answer: [0],
      explanation: "El caso implementa SLA diferenciado (4h Premium vs 24h Estándar) mediante Entitlements, que definen el nivel de servicio según el cliente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Escenario Customer Insights — aseguradora): se enviaban campañas genéricas a clientes con reclamos abiertos, generando quejas. ¿Qué corrigió eso?",
      options: [
      "Enviar las campañas con mayor frecuencia para compensar las quejas",
      "Crear segmentos que excluyen casos críticos, integrando Customer Insights - Data con Sales, Service y billing",
      "Eliminar por completo las campañas de renovación",
      "Enviar las campañas solo por correo postal"
      ],
      answer: [1],
      explanation: "El caso integra Customer Insights - Data con Sales/Service/billing para crear segmentos que excluyen clientes con reclamos abiertos, evitando comunicaciones inoportunas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Escenario Field Service — mantenimiento industrial): las visitas se gestionaban en Excel y WhatsApp. ¿Qué objeto de Field Service se genera a partir de un caso de soporte, según el caso?",
      options: [
      "Un Work Order, asignado por el dispatcher según skill y ubicación del técnico",
      "Un correo automático sin seguimiento estructurado",
      "Una hoja de cálculo compartida en OneDrive",
      "Un ticket en un sistema externo no integrado"
      ],
      answer: [0],
      explanation: "El caso describe que los casos de soporte generan Work Orders, asignados por el dispatcher según skill y ubicación, con captura de inspecciones desde móvil por el técnico.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Mesa de ayuda de software): ¿cuáles DOS resultados demuestra el caso principal tras implementar Unified Routing?",
      options: [
      "First-contact resolution mejoró del 45% al 72%",
      "CSAT (satisfacción del cliente) mejoró de 3.2 a 4.4/5",
      "Se eliminó por completo la necesidad de agentes humanos",
      "Los SLA dejaron de aplicarse a clientes Premium"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados cuantificables. Los agentes siguen atendiendo los casos (ahora mejor asignados) y los SLA diferenciados siguen aplicando.",
      appliesTo: "caso"
    }
  ],
  21: [
    {
      type: "single",
      prompt: "Una compañía quiere exponer un portal B2C para clientes externos con registro, inicio de sesión y escalabilidad de identidad. ¿Qué proveedor de autenticación debes priorizar?",
      options: [
      "Autenticación local con usuarios administrados manualmente",
      "Azure AD B2C",
      "Solo Anonymous Access",
      "Windows Integrated Authentication"
      ],
      answer: [1],
      explanation: "Azure AD B2C está diseñado para identidades externas y flujos de autoservicio a escala. La autenticación local sirve para escenarios simples, pero ofrece menos flexibilidad y gobierno que B2C."
    },
    {
      type: "single",
      prompt: "Un usuario del portal debe ver únicamente las solicitudes asociadas a su propio contacto en Dataverse. ¿Qué alcance de Table Permission es el más adecuado?",
      options: [
      "Global",
      "Contact",
      "Parent",
      "Anonymous"
      ],
      answer: [1],
      explanation: "El alcance Contact restringe el acceso a registros vinculados al contacto autenticado. Global expondría datos de todos, Parent responde a jerarquías relacionadas y Anonymous ni siquiera aplica a usuarios no autenticados."
    },
    {
      type: "multi",
      prompt: "Estás diseñando una página de Power Pages con contenido inicial indexable y luego acciones interactivas del usuario. ¿Qué DOS enfoques conviene combinar?",
      options: [
      "Renderizar estructura y contenido base con Liquid del lado servidor",
      "Usar Fetch o AJAX para operaciones dinámicas posteriores",
      "Consultar Dataverse directamente desde el navegador sin permisos",
      "Mover toda la experiencia a un archivo estático sin backend"
      ],
      answer: [0, 1],
      explanation: "Liquid es ideal para el render inicial seguro y coherente con el portal, mientras AJAX o Portals Web API cubren interacciones posteriores. Consultar sin permisos o eliminar el backend rompe seguridad y funcionalidad."
    },
    {
      type: "single",
      prompt: "Quieres permitir acceso a una sección solo a socios autenticados, mientras el resto del sitio sigue siendo público. ¿Qué combinación es la más correcta?",
      options: [
      "Asignar solo el web role Anonymous a todas las páginas",
      "Crear un Web Role custom para socios y asociarlo a la página protegida",
      "Ocultar el enlace en el menú sin cambiar permisos",
      "Confiar únicamente en JavaScript para bloquear la URL"
      ],
      answer: [1],
      explanation: "Los Web Roles controlan autorización real dentro del portal y deben respaldar la navegación protegida. Ocultar enlaces o usar solo JavaScript no evita acceso directo a la página o a los datos."
    },
    {
      type: "single",
      prompt: "El portal muestra lentitud en páginas públicas muy visitadas. ¿Qué práctica mejora rendimiento sin comprometer arquitectura?",
      options: [
      "Desactivar caché para que todo se renderice desde cero en cada request",
      "Usar caché adecuadamente y minimizar llamadas dinámicas innecesarias",
      "Mover toda la lógica de seguridad al cliente",
      "Cargar todos los Web Files en la primera pantalla aunque no se usen"
      ],
      answer: [1],
      explanation: "Power Pages se beneficia de caché y de reducir round-trips al backend, especialmente en contenido repetitivo. Desactivar caché o cargar recursos innecesarios empeora la experiencia y no resuelve la causa."
    },
    {
      type: "multi",
      prompt: "Estás diseñando Table Permissions para un portal donde un proveedor debe ver solo los registros vinculados a su propia Account, y un contacto especial debe ver únicamente su propio registro de Contact. ¿Qué DOS tipos de acceso corresponden a cada caso respectivamente?",
      options: [
      "Account para el primer caso",
      "Self para el segundo caso",
      "Global para ambos casos",
      "Anonymous para ambos casos"
      ],
      answer: [0, 1],
      explanation: "El tipo Account filtra por la cuenta relacionada del contacto, y el tipo Self limita el acceso al propio registro del contacto. Global expondría todos los registros de la tabla y Anonymous ni siquiera aplica a usuarios autenticados."
    },
    {
      type: "single",
      prompt: "Una llamada POST desde JavaScript del portal a `/api/data/v9.1/incidents` devuelve HTTP 403. ¿Cuál es la causa más probable según el diseño de seguridad de la Web API de Power Pages?",
      options: [
      "Falta incluir el header `__RequestVerificationToken` en la petición de escritura",
      "El portal no tiene habilitado el CDN",
      "La tabla Caso no tiene columnas indexadas",
      "El usuario no instaló la Progressive Web App"
      ],
      answer: [0],
      explanation: "Todas las operaciones de escritura (POST, PATCH, DELETE) contra la Web API del portal requieren el token de verificación como protección CSRF; sin él, la respuesta es 403. El CDN, los índices de columnas y la PWA no están relacionados con esta validación de seguridad."
    },
    {
      type: "single",
      prompt: "Los usuarios del portal en distintos países reportan tiempos de carga altos para imágenes y CSS estáticos. ¿Qué capacidad de Power Pages ayuda a reducir esa latencia sin cambiar la arquitectura del portal?",
      options: [
      "Habilitar el Content Delivery Network (CDN) del portal",
      "Deshabilitar todos los Web Files",
      "Forzar Anonymous Access en todas las páginas",
      "Aumentar el límite de delegación de Canvas Apps"
      ],
      answer: [0],
      explanation: "El CDN distribuye los archivos estáticos en nodos geográficamente cercanos a los usuarios, reduciendo la latencia de carga. Deshabilitar Web Files rompe la funcionalidad, Anonymous Access es un tema de seguridad no de rendimiento, y el límite de delegación no aplica a Power Pages."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de servicios): el 60% de las llamadas eran consultas de estado de contratos/casos, no problemas reales. ¿Qué solución del caso reduce ese volumen?",
      options: [
      "Contratar más agentes telefónicos",
      "Un portal Power Pages donde el cliente ve el estado en tiempo real de sus contratos y casos",
      "Un buzón de correo dedicado a consultas de estado",
      "Un menú de IVR telefónico más largo"
      ],
      answer: [1],
      explanation: "El caso implementa un portal Power Pages integrado con Dataverse donde el cliente autogestiona la consulta de estado, eliminando la necesidad de llamar para eso.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de servicios): se necesita que un cliente autenticado en el portal solo vea sus propios contratos, nunca los de otro cliente. ¿Qué mecanismo lo garantiza?",
      options: [
      "Table Permissions configuradas en 'Contact', no en 'Global'",
      "Ocultar visualmente los contratos de otros clientes con CSS",
      "Confiar en que el cliente no navegue a otras URLs",
      "Un Field Security Profile sobre la tabla de contratos"
      ],
      answer: [0],
      explanation: "El caso es explícito: 'Table Permissions en Contact > Global — nunca exponer todos los registros a usuarios del portal'. El alcance 'Contact' limita el acceso a los registros del propio contacto autenticado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de servicios): el portal debe cargar en menos de 3 segundos para usuarios externos. ¿Qué práctica del caso ayuda directamente a lograrlo?",
      options: [
      "CDN y compresión de imágenes",
      "Agregar más campos a cada formulario",
      "Deshabilitar la autenticación del portal",
      "Aumentar el número de Table Permissions"
      ],
      answer: [0],
      explanation: "El caso indica explícitamente usar CDN y compresión de imágenes como requisito de rendimiento para portales externos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de servicios): ¿qué componente de seguridad debe habilitarse en producción para proteger el portal externo de ataques comunes?",
      options: [
      "WAF (Web Application Firewall)",
      "Un Field Security Profile adicional",
      "Una Business Rule de validación",
      "Un Connection Reference"
      ],
      answer: [0],
      explanation: "El caso indica habilitar WAF en producción como buena práctica de seguridad para el portal expuesto a internet.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Empresa de servicios): ¿cuáles DOS resultados demuestra el caso tras implementar el portal Power Pages?",
      options: [
      "Llamadas de soporte reducidas en 55%",
      "NPS (Net Promoter Score) subió de 42 a 68",
      "Se eliminó por completo el equipo de soporte telefónico",
      "El CRM dejó de necesitar Dataverse como base de datos"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. El equipo de soporte sigue existiendo (ahora con menos volumen de consultas triviales) y el portal está integrado con Dataverse, no lo reemplaza.",
      appliesTo: "caso"
    }
  ],
  22: [
    {
      type: "single",
      prompt: "Un bot interno debe responder preguntas usando políticas almacenadas en SharePoint, artículos en Dataverse y un sitio corporativo. ¿Qué capacidad de Copilot Studio cubre mejor ese escenario?",
      options: [
      "Generative Answers con múltiples orígenes",
      "Solo Topics con respuestas escritas manualmente",
      "Power BI Q&A",
      "Customer Voice"
      ],
      answer: [0],
      explanation: "Generative Answers permite consultar varias fuentes autorizadas y sintetizar respuestas. Es más escalable que mantener únicamente respuestas manuales y las otras herramientas no son el motor conversacional adecuado."
    },
    {
      type: "single",
      prompt: "La organización quiere que empleados accedan al bot desde Teams sin volver a autenticarse y que las acciones consulten datos internos según su identidad. ¿Qué diseño debes preferir?",
      options: [
      "SSO con Azure AD para el bot y sus acciones",
      "Usuarios compartidos embebidos en el bot",
      "Publicar el bot como anónimo para simplificar",
      "Desactivar autorización en Dataverse"
      ],
      answer: [0],
      explanation: "SSO con Azure AD evita doble autenticación y permite aplicar autorización por identidad real del usuario. Usar cuentas compartidas o acceso anónimo compromete auditoría, seguridad y personalización."
    },
    {
      type: "multi",
      prompt: "Quieres una arquitectura multi-bot donde un bot principal delega tareas especializadas. ¿Qué DOS elementos son característicos de ese enfoque?",
      options: [
      "Un bot maestro que enruta la intención al bot de habilidad adecuado",
      "Bots especializados por dominio como RR.HH. o TI",
      "Un único topic gigante con toda la lógica de todos los dominios",
      "Eliminar analítica por bot para centralizar todo"
      ],
      answer: [0, 1],
      explanation: "La separación Master + Skill bots mejora mantenibilidad y permite especialización por dominio. Un topic monolítico o eliminar métricas por bot dificulta operación, ownership y mejora continua."
    },
    {
      type: "single",
      prompt: "Necesitas pedir al usuario una aprobación rápida en Teams con botones y contexto visual de una solicitud. ¿Qué experiencia es la más apropiada?",
      options: [
      "Adaptive Cards enviadas desde el bot",
      "Solo un mensaje de texto con un vínculo externo",
      "Un archivo CSV adjunto",
      "Un dashboard de Power BI sin interacción"
      ],
      answer: [0],
      explanation: "Adaptive Cards permiten capturar acciones estructuradas dentro de Teams con mejor usabilidad. Un vínculo o un archivo desvían al usuario y no entregan la misma experiencia conversacional integrada."
    },
    {
      type: "single",
      prompt: "El sponsor pregunta cómo detectar si los usuarios abandonan el bot antes de completar una tarea clave. ¿Qué métrica es la más directa?",
      options: [
      "Abandonment rate",
      "Número de makers en el tenant",
      "Cantidad de ambientes sandbox",
      "Capacidad de almacenamiento de Dataverse"
      ],
      answer: [0],
      explanation: "Abandonment rate mide conversaciones que no llegan a una resolución útil y ayuda a priorizar mejoras. Las demás opciones no describen comportamiento conversacional ni efectividad del bot."
    },
    {
      type: "single",
      prompt: "Los usuarios expresan la misma intención de formas muy variadas y el equipo quiere que el agente elija el topic correcto sin depender de frases de activación exactas. ¿Qué capacidad de Copilot Studio deben habilitar?",
      options: [
      "Generative Orchestration",
      "Solo Topics con trigger phrases fijas",
      "Customer Voice",
      "Power BI Q&A"
      ],
      answer: [0],
      explanation: "Generative Orchestration permite que el LLM decida dinámicamente qué topic activar según el contexto completo de la conversación, en lugar de exigir frases exactas. Las otras opciones no resuelven la variabilidad del lenguaje natural del usuario."
    },
    {
      type: "single",
      prompt: "El sponsor está preocupado porque el bot podría inventar procedimientos o datos de contacto inexistentes al responder preguntas de RR.HH. ¿Qué concepto de Copilot Studio mitiga directamente ese riesgo?",
      options: [
      "Grounding con Knowledge Sources específicas y confiables",
      "Aumentar el número de topics del bot",
      "Desactivar el logging de Analytics",
      "Reducir el número de canales publicados"
      ],
      answer: [0],
      explanation: "El grounding ancla las respuestas generativas a fuentes verificables, reduciendo alucinaciones del modelo. Agregar topics, desactivar Analytics o reducir canales no atacan la causa raíz del problema de precisión de las respuestas."
    },
    {
      type: "multi",
      prompt: "Un topic transfiere la conversación a un agente humano de Customer Service Omnichannel. ¿Qué DOS comportamientos son correctos según el diseño nativo de escalamiento de Copilot Studio?",
      options: [
      "El historial completo de la conversación se incluye como contexto para el agente humano",
      "El agente humano recibe la transcripción y puede continuar desde donde el bot dejó",
      "El bot elimina automáticamente la sesión sin dejar registro alguno",
      "El escalamiento solo funciona si el usuario reinicia la conversación desde cero"
      ],
      answer: [0, 1],
      explanation: "El nodo nativo de escalamiento envía el contexto completo de la conversación al agente humano, quien puede continuar la atención sin pedir de nuevo la información. No se elimina la sesión ni se requiere reiniciar la conversación."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): el chatbot anterior respondía genérico sin saber quién preguntaba (ej. días de vacaciones). ¿Qué solución del caso personaliza la respuesta según el usuario?",
      options: [
      "SSO Azure AD + integración con HRIS vía Power Automate",
      "Aumentar el número de Knowledge Sources genéricos",
      "Pedir al empleado que escriba su número de identificación en cada pregunta",
      "Un menú de opciones predefinidas sin conexión a datos reales"
      ],
      answer: [0],
      explanation: "El caso implementa SSO con Azure AD (para saber quién es el usuario) e integración con el HRIS vía Power Automate (para consultar sus datos específicos), personalizando la respuesta.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): ¿por qué el caso considera el SSO 'prácticamente obligatorio' en bots corporativos?",
      options: [
      "Porque evita fricciones de autenticación repetidas para el usuario",
      "Porque es un requisito técnico de Copilot Studio sin el cual no funciona",
      "Porque reduce el costo de licenciamiento del bot",
      "Porque permite que cualquier persona externa use el bot sin restricciones"
      ],
      answer: [0],
      explanation: "El SSO evita que el usuario tenga que autenticarse manualmente cada vez, eliminando fricción — es una buena práctica de experiencia y seguridad, no un requisito técnico obligatorio de la plataforma.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): se necesita que el bot ofrezca acciones directas (botones) en vez de solo texto plano. ¿Qué componente usa el caso para esto?",
      options: [
      "Adaptive Cards",
      "Un Knowledge Source adicional",
      "Una entidad Closed List",
      "Un topic de Fallback"
      ],
      answer: [0],
      explanation: "El caso indica explícitamente el uso de Adaptive Cards con botones para acciones directas, en vez de depender solo de respuestas de texto.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): ¿qué salvaguarda debe tener siempre el bot para no dejar atrapado a un empleado cuya consulta no puede resolver?",
      options: [
      "El topic 'Escalar a agente' como escape hatch siempre disponible",
      "Cerrar la conversación automáticamente sin alternativa",
      "Redirigir siempre a la política genérica de RRHH",
      "Repetir la misma respuesta hasta que el usuario se rinda"
      ],
      answer: [0],
      explanation: "El caso indica tener siempre disponible el topic 'Escalar a agente' como vía de salida cuando el bot no puede resolver la consulta.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Banco): ¿cuáles DOS resultados demuestra el caso tras implementar SSO + integración HRIS?",
      options: [
      "Resolución en el primer mensaje del 78%",
      "Llamadas a RRHH reducidas en 40%",
      "Se eliminó por completo el equipo de RRHH",
      "El bot dejó de necesitar Knowledge Sources"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. RRHH sigue existiendo (con menos carga de consultas repetitivas) y el bot sigue usando Knowledge Sources para preguntas de procedimientos.",
      appliesTo: "caso"
    }
  ],
  23: [
    {
      type: "single",
      prompt: "Debes impedir que se guarde una orden si falta un dato obligatorio calculado externamente, evitando incluso que inicie la transacción principal. ¿En qué etapa registrarías el plugin?",
      options: [
      "Pre-Validation",
      "Pre-Operation",
      "Post-Operation",
      "Asynchronous Post-Operation"
      ],
      answer: [0],
      explanation: "Pre-Validation se ejecuta antes de la transacción principal y es adecuada para rechazar operaciones tempranamente. Pre-Operation ya participa en la transacción y Post-Operation ocurre demasiado tarde para esa validación inicial."
    },
    {
      type: "single",
      prompt: "Un plugin necesita comparar el valor previo y el nuevo de un campo para decidir si recalcula un descuento. ¿Qué debes configurar?",
      options: [
      "Solo el Target sin imágenes",
      "PreEntityImage además del Target",
      "Un archivo Web Resource",
      "Una Canvas App embebida"
      ],
      answer: [1],
      explanation: "El Target trae los cambios entrantes, pero la imagen previa permite comparar el estado anterior del registro. Sin PreEntityImage el plugin no tiene contexto confiable para detectar la transición de valores."
    },
    {
      type: "multi",
      prompt: "Quieres evitar recursión y diagnosticar mejor un plugin que actualiza el mismo registro. ¿Qué DOS prácticas son correctas?",
      options: [
      "Verificar IPluginExecutionContext.Depth y salir cuando supere el umbral esperado",
      "Usar ITracingService para dejar trazas útiles en ejecución",
      "Capturar todas las excepciones y devolver éxito silencioso",
      "Forzar siempre una llamada adicional al mismo mensaje para confirmar el cambio"
      ],
      answer: [0, 1],
      explanation: "Controlar Depth reduce bucles involuntarios y el tracing facilita soporte en sandbox. Silenciar errores o forzar llamadas repetidas agrava el problema y oculta la causa real."
    },
    {
      type: "single",
      prompt: "En un plugin server-side necesitas una consulta legible, soportada por SDK y fácil de construir dinámicamente. ¿Qué opción suele ser la más apropiada?",
      options: [
      "Manipular directamente tablas SQL de Dataverse",
      "QueryExpression",
      "Liquid templates",
      "Power Fx"
      ],
      answer: [1],
      explanation: "QueryExpression es nativo del SDK y funciona bien para consultas programáticas en plugins. Acceder a SQL no está soportado online y Liquid o Power Fx pertenecen a otras capas de la plataforma."
    },
    {
      type: "single",
      prompt: "Quieres probar unitariamente un plugin sin depender de un ambiente real de Dataverse. ¿Qué herramienta encaja mejor?",
      options: [
      "FakeXrmEasy",
      "Power BI Desktop",
      "Plugin Registration Tool",
      "Azure Front Door"
      ],
      answer: [0],
      explanation: "FakeXrmEasy permite simular contexto, entidades y operaciones del SDK para pruebas unitarias de plugins. Plugin Registration Tool sirve para registrar ensamblados, pero no sustituye un framework de testing."
    },
    {
      type: "multi",
      prompt: "Un desarrollador quiere que su plugin lea archivos del sistema de archivos del servidor y acceda al registro de Windows para una integración legacy. ¿Qué DOS restricciones del Sandbox de Dataverse impiden ese diseño?",
      options: [
      "El sandbox bloquea el acceso al sistema de archivos",
      "El sandbox bloquea el acceso al registro de Windows (Windows Registry)",
      "El sandbox impide cualquier llamada HTTPS saliente a internet",
      "El sandbox impide el uso de IOrganizationService dentro del plugin"
      ],
      answer: [0, 1],
      explanation: "El modo Sandbox obligatorio en la nube bloquea acceso a sistema de archivos, registro de Windows, IPs privadas y WMI. Sí permite llamadas HTTPS salientes a internet y el uso normal de IOrganizationService, que es precisamente el mecanismo de acceso a datos del plugin."
    },
    {
      type: "single",
      prompt: "Un plugin lanza `InvalidPluginExecutionException` con un mensaje de negocio claro. ¿Qué ocurre exactamente en Dataverse?",
      options: [
      "Se cancela toda la transacción (rollback) y el mensaje se muestra al usuario como un error de negocio comprensible",
      "La transacción se completa igual y solo se registra un warning",
      "El plugin se reintenta automáticamente hasta 3 veces antes de fallar",
      "El mensaje se oculta y el usuario ve solo un código de error genérico"
      ],
      answer: [0],
      explanation: "InvalidPluginExecutionException es la única excepción que Dataverse maneja de forma especial: cancela la transacción y muestra el mensaje tal cual al usuario. No hay reintento automático ni el mensaje se oculta -al contrario, es la forma de comunicar errores de negocio comprensibles."
    },
    {
      type: "single",
      prompt: "Un plugin de PreValidation determina que una solicitud fue pre-aprobada y necesita comunicárselo a un plugin de PreOperation que corre en el mismo step y transacción. ¿Qué mecanismo del SDK deben usar?",
      options: [
      "context.SharedVariables como diccionario compartido en el mismo pipeline",
      "Guardar el dato en una variable estática global sin relación con el contexto",
      "Crear un registro temporal en Dataverse y leerlo inmediatamente después",
      "Usar ITracingService para pasar el valor entre plugins"
      ],
      answer: [0],
      explanation: "SharedVariables está diseñado exactamente para pasar datos entre plugins que corren en el mismo pipeline de ejecución. ITracingService es solo para logging, y usar variables estáticas o registros temporales en Dataverse son soluciones frágiles e innecesarias para este propósito."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa financiera): los usuarios podían crear préstamos sin validar deudas vencidas porque la validación del formulario era fácil de eludir. ¿Qué solución del caso hace imposible eludir esa validación?",
      options: [
      "Una Business Rule adicional en el formulario",
      "Un plugin Pre-Create en el servidor, que se ejecuta independientemente de la UI",
      "Un mensaje de advertencia más visible en el formulario",
      "Capacitar a los usuarios para que no eludan la validación"
      ],
      answer: [1],
      explanation: "El plugin Pre-Create se ejecuta en el servidor, sin importar desde dónde llegue la solicitud de creación (UI, API, importación), lo que hace imposible eludirlo como sí ocurría con la validación del formulario.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa financiera): ¿qué excepción lanza el plugin del caso cuando detecta que el cliente tiene deudas vencidas, para bloquear la operación con un mensaje claro?",
      options: [
      "InvalidPluginExecutionException",
      "NullReferenceException",
      "System.Exception genérica sin mensaje",
      "TimeoutException"
      ],
      answer: [0],
      explanation: "El caso especifica que el plugin lanza InvalidPluginExecutionException con un mensaje claro, que Dataverse propaga al usuario como error de negocio comprensible.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa financiera): ¿por qué el plugin debe verificar 'context.Depth > 1' como buena práctica?",
      options: [
      "Para evitar recursión infinita si el plugin dispara otra operación que vuelve a activarlo",
      "Para mejorar el rendimiento de las consultas a la API del buró de crédito",
      "Para cumplir un requisito de licenciamiento de Dataverse",
      "Para permitir que el plugin se ejecute en modo asíncrono"
      ],
      answer: [0],
      explanation: "Verificar la profundidad de ejecución (Depth) evita que el plugin se dispare a sí mismo en un ciclo infinito cuando su propia lógica provoca otra operación sobre el mismo registro.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa financiera): se necesita registrar información de diagnóstico dentro del plugin para depurar problemas en producción, donde no se puede usar un debugger interactivo. ¿Qué mecanismo usa el caso?",
      options: [
      "ITracingService",
      "Console.WriteLine",
      "Un archivo de log local en el servidor",
      "System.Diagnostics.Debug.Print"
      ],
      answer: [0],
      explanation: "El caso indica ITracingService como 'indispensable para debugging en producción', ya que su salida queda registrada y accesible en los logs de ejecución de Dataverse, a diferencia de mecanismos de consola o archivos locales que no aplican en ese entorno.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Empresa financiera): ¿cuáles DOS resultados demuestra el caso tras implementar el plugin Pre-Create?",
      options: [
      "Cumplimiento regulatorio del 100%",
      "Eliminación de préstamos aprobados con deuda vencida",
      "Los usuarios dejaron de necesitar el formulario de préstamos",
      "El buró de crédito dejó de ser necesario para la validación"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. El formulario y la consulta al buró de crédito siguen siendo parte del proceso — ahora validados de forma infranqueable por el plugin.",
      appliesTo: "caso"
    }
  ],
  24: [
    {
      type: "single",
      prompt: "Una actualización en Dataverse debe disparar notificaciones a varios sistemas consumidores independientes. ¿Qué recurso de Azure Service Bus es más conveniente?",
      options: [
      "Queue",
      "Topic",
      "Blob Container",
      "Key Vault"
      ],
      answer: [1],
      explanation: "Topic permite patrón publish-subscribe con varias suscripciones consumidoras. Queue se orienta más a un único consumidor lógico y no cubre tan bien el fan-out empresarial."
    },
    {
      type: "single",
      prompt: "Tu Azure Function necesita leer secretos y llamar a un backend sin almacenar credenciales en código ni en archivos de configuración. ¿Qué combinación es la mejor?",
      options: [
      "Connection string fija en appsettings.json",
      "Managed Identity + Azure Key Vault",
      "Usuario compartido guardado en JavaScript",
      "Secretos en una lista de SharePoint"
      ],
      answer: [1],
      explanation: "Managed Identity elimina credenciales embebidas y Key Vault centraliza secretos con rotación y control de acceso. Guardarlos en archivos o listas aumenta superficie de exposición y esfuerzo operativo."
    },
    {
      type: "multi",
      prompt: "Debes elegir entre Azure Logic Apps y Power Automate para dos escenarios distintos. ¿Qué DOS afirmaciones son correctas?",
      options: [
      "Logic Apps suele ser preferible para integraciones enterprise y B2B en Azure",
      "Power Automate suele encajar mejor en automatización de productividad y casos de negocio liderados por makers",
      "Logic Apps debe reemplazar siempre cualquier flujo de negocio en Power Platform",
      "Power Automate es la opción ideal para exponer políticas centralizadas de API"
      ],
      answer: [0, 1],
      explanation: "Logic Apps brilla en integraciones Azure-first con escalado y conectividad enterprise, mientras Power Automate se adapta bien a automatizaciones de negocio. Ninguna reemplaza universalmente a la otra y la gestión centralizada de APIs corresponde a APIM."
    },
    {
      type: "single",
      prompt: "Varias apps y flujos consumen APIs externas con límites y políticas inconsistentes. ¿Qué servicio usarías para centralizar seguridad, throttling y versionado?",
      options: [
      "Azure API Management",
      "Azure DevOps Boards",
      "Power BI Service",
      "Customer Voice"
      ],
      answer: [0],
      explanation: "Azure API Management publica, protege y gobierna APIs mediante políticas como throttling y transformación. Las demás herramientas no están diseñadas para gobernar el consumo de servicios HTTP a escala."
    },
    {
      type: "single",
      prompt: "Un evento de creación de archivo en Azure Storage debe iniciar automáticamente un proceso en Power Automate sin polling. ¿Qué servicio habilita mejor ese patrón?",
      options: [
      "Event Grid",
      "Windows Task Scheduler",
      "Excel Online",
      "Power Pages cache"
      ],
      answer: [0],
      explanation: "Event Grid distribuye eventos de Azure de forma push y near real-time hacia suscriptores. El polling agrega latencia y costo, y las demás opciones no son un bus de eventos para recursos Azure."
    },
    {
      type: "single",
      prompt: "Necesitas que cada Create de la tabla Solicitud en Dataverse envíe automáticamente el contexto completo del evento a una Service Bus Queue, sin escribir código C#. ¿Qué componente debes registrar?",
      options: [
      "Un Service Endpoint en el Plugin Registration Tool asociado a un Step",
      "Un Azure Function con HttpTrigger",
      "Una Power Automate con trigger manual",
      "Un PCF Dataset control"
      ],
      answer: [0],
      explanation: "El Service Endpoint es el mecanismo oficial y sin código para que Dataverse serialice y envíe el RemoteExecutionContext a Service Bus o Event Hub al registrarse como un Step. Las otras opciones requieren código adicional o no cumplen ese propósito específico."
    },
    {
      type: "single",
      prompt: "Un mensaje en Azure Service Bus falla su procesamiento después de agotar el número máximo de reintentos configurado. ¿Qué ocurre con ese mensaje según el diseño estándar de Service Bus?",
      options: [
      "Se mueve automáticamente a la Dead Letter Queue, sin perderse, para diagnóstico o reprocesamiento posterior",
      "El mensaje se elimina permanentemente sin dejar rastro",
      "El mensaje se reenvía indefinidamente sin límite de reintentos",
      "El mensaje se convierte automáticamente en un evento de Event Grid"
      ],
      answer: [0],
      explanation: "La Dead Letter Queue es la cola secundaria donde Service Bus mueve los mensajes que agotaron sus reintentos, preservándolos para diagnóstico manual. No se eliminan ni se reintentan indefinidamente, y no hay conversión automática a Event Grid."
    },
    {
      type: "single",
      prompt: "Un plugin necesita garantizar que un mensaje llegue a un sistema externo incluso si ese sistema está temporalmente caído en el momento de la transacción. ¿Qué patrón resuelve mejor ese requisito sin bloquear al usuario?",
      options: [
      "Outbox Pattern: registrar un mensaje pendiente en Dataverse y procesarlo con un componente separado",
      "Llamar directamente al sistema externo desde el plugin en Pre-Operation síncrono",
      "Ignorar el error y continuar sin registrar nada",
      "Aumentar el timeout del plugin a 10 minutos"
      ],
      answer: [0],
      explanation: "El Outbox Pattern desacopla la creación del mensaje de su entrega: el plugin solo registra el mensaje pendiente en Dataverse y un proceso separado lo envía y reintenta si falla. Llamar directamente en el plugin síncrono arriesga perder el mensaje si el sistema externo está caído, e ignorar errores o alargar el timeout no son soluciones robustas."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de logística): los sistemas se llamaban directamente; si SAP estaba caído, las órdenes de Dataverse se perdían sin reintentos ni audit trail. ¿Qué solución del caso resuelve la raíz de ese problema?",
      options: [
      "Service Bus como middleware entre Dataverse y SAP",
      "Aumentar la frecuencia de sincronización manual",
      "Duplicar manualmente cada orden en un Excel de respaldo",
      "Eliminar la integración con SAP"
      ],
      answer: [0],
      explanation: "El Service Bus desacopla Dataverse de SAP: Dataverse envía el evento al bus, y una Azure Function lo procesa con reintentos, eliminando la dependencia de disponibilidad directa entre ambos sistemas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de logística): si SAP falla 3 veces al procesar un mensaje, ¿qué ocurre según el caso?",
      options: [
      "El mensaje se descarta silenciosamente",
      "El mensaje va a una Dead Letter Queue para atención manual",
      "El sistema reintenta indefinidamente sin límite",
      "Se detiene todo el Service Bus hasta que un administrador lo reinicie"
      ],
      answer: [1],
      explanation: "El caso especifica que tras 3 fallos, el mensaje va a la Dead Letter Queue, que se procesa en horario de mantenimiento — ni se descarta ni se reintenta indefinidamente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de logística): ¿por qué las integraciones externas del caso deben ser siempre asíncronas?",
      options: [
      "Para no bloquear el pipeline de Dataverse mientras se espera respuesta de un sistema externo",
      "Porque las llamadas síncronas no están permitidas en Azure",
      "Porque el modo asíncrono es más barato en licenciamiento",
      "Porque solo el modo asíncrono soporta Managed Identity"
      ],
      answer: [0],
      explanation: "El caso indica 'Async siempre para integraciones externas — nunca bloquear el pipeline de Dataverse', evitando que la latencia de un sistema externo detenga operaciones internas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de logística): el mismo mensaje puede llegar dos veces a la Azure Function. ¿Qué principio de diseño evita que se procese dos veces con efectos duplicados?",
      options: [
      "Idempotencia",
      "Recursión",
      "Herencia múltiple",
      "Inyección de dependencias"
      ],
      answer: [0],
      explanation: "El caso indica 'Idempotencia en las Azure Functions — el mismo mensaje puede llegar 2 veces; debe procesarse 1 vez', evitando efectos duplicados por reintentos o entregas repetidas del bus.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Empresa de logística): ¿cuáles DOS resultados demuestra el caso tras implementar el middleware con Service Bus?",
      options: [
      "Cero pérdida de órdenes",
      "SLA de integración del 99.9%",
      "Se eliminó la necesidad de contar con SAP",
      "Las órdenes dejaron de requerir procesamiento asíncrono"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. SAP sigue siendo el sistema ERP de destino, y el procesamiento asíncrono es justamente el mecanismo que sostiene esos resultados.",
      appliesTo: "caso"
    }
  ],
  25: [
    {
      type: "single",
      prompt: "Tu equipo quiere desacoplar la lógica de acceso a Dataverse dentro de plugins para facilitar pruebas y mantenimiento. ¿Qué patrón conviene aplicar?",
      options: [
      "Repository pattern",
      "Singleton UI pattern",
      "Decorator para CSS",
      "MVC para Power BI"
      ],
      answer: [0],
      explanation: "Repository abstrae IOrganizationService y centraliza consultas y persistencia, lo que mejora testabilidad. Las otras opciones no resuelven el problema de acceso a datos en plugins de Dataverse."
    },
    {
      type: "single",
      prompt: "Un proceso de aprobación debe poder ejecutarse y también revertirse si falla una etapa posterior. ¿Qué patrón modela mejor esa necesidad?",
      options: [
      "Command pattern",
      "Singleton pattern",
      "Factory pattern únicamente",
      "Pub/Sub sin compensación"
      ],
      answer: [0],
      explanation: "Command encapsula la operación y facilita implementar acciones inversas o compensatorias. Publicar eventos sin una estrategia de reversión no garantiza consistencia cuando hay pasos posteriores fallidos."
    },
    {
      type: "multi",
      prompt: "Una orden se confirma en Dataverse, se reserva inventario en ERP y se genera envío en un tercero. Si el último paso falla, ¿qué DOS principios ayudan a mantener consistencia?",
      options: [
      "Saga pattern con acciones de compensación",
      "Idempotencia para que los reintentos no dupliquen operaciones",
      "Bloquear toda la plataforma hasta completar cada sistema",
      "Editar manualmente la base de datos SQL de Dataverse"
      ],
      answer: [0, 1],
      explanation: "Saga maneja transacciones distribuidas sin exigir un commit global y define cómo deshacer pasos previos. La idempotencia evita duplicados durante reintentos; bloquear toda la plataforma o tocar SQL no es viable ni soportado."
    },
    {
      type: "single",
      prompt: "Un flujo llama a una API externa inestable y no quieres saturarla cuando empieza a fallar. ¿Qué patrón deberías aplicar?",
      options: [
      "Circuit Breaker",
      "Star schema",
      "Waterfall",
      "Bubble sort"
      ],
      answer: [0],
      explanation: "Circuit Breaker corta temporalmente llamadas repetidas a un servicio degradado y permite recuperación controlada. Eso protege experiencia, cuotas y estabilidad; las otras opciones no gestionan fallos transitorios."
    },
    {
      type: "single",
      prompt: "Quieres separar operaciones de escritura complejas de consultas optimizadas para reporting en una integración con Dataverse. ¿Qué enfoque arquitectónico es el más alineado?",
      options: [
      "CQRS",
      "Solo CRUD genérico en una misma capa",
      "Poner toda la lógica en JavaScript del formulario",
      "Guardar reportes en columnas de texto libre"
      ],
      answer: [0],
      explanation: "CQRS separa commands y queries para optimizar cada una según su carga y modelo de consumo. Un CRUD genérico único tiende a mezclar necesidades transaccionales y analíticas con menor claridad y escalabilidad."
    },
    {
      type: "single",
      prompt: "Un colega afirma que el sistema de plugins de Dataverse ya implementa un patrón de diseño clásico de forma nativa cuando reacciona a eventos Create/Update/Delete. ¿A qué patrón se refiere?",
      options: [
      "Observer Pattern",
      "Singleton Pattern",
      "Factory Pattern",
      "Decorator Pattern"
      ],
      answer: [0],
      explanation: "El plugin actúa como observer que reacciona automáticamente a cambios de estado (eventos) en la tabla observada, la esencia del Observer Pattern. Singleton, Factory y Decorator resuelven problemas distintos de creación o extensión de objetos, no de notificación de eventos."
    },
    {
      type: "single",
      prompt: "Una Azure Function reintenta llamadas fallidas a una API externa con 1s, 2s y 4s de espera, agregando una variación aleatoria de ±20% en cada intento. ¿Qué patrón está implementando y por qué se agrega esa variación?",
      options: [
      "Retry Pattern con backoff exponencial y jitter, para evitar que múltiples instancias reintenten exactamente al mismo tiempo",
      "Circuit Breaker, para dejar de intentar tras el primer fallo",
      "Saga Pattern, para compensar transacciones distribuidas",
      "CQRS, para separar lecturas de escrituras"
      ],
      answer: [0],
      explanation: "El backoff exponencial con jitter evita una avalancha sincronizada de reintentos entre múltiples instancias del mismo proceso. Circuit Breaker corta llamadas tras fallos repetidos, Saga gestiona compensaciones y CQRS separa comandos de consultas — ninguno describe el mecanismo de espera creciente con variación aleatoria."
    },
    {
      type: "multi",
      prompt: "Estás implementando un Circuit Breaker para proteger un plugin de una API externa inestable. ¿Qué DOS afirmaciones describen correctamente sus estados?",
      options: [
      "En estado Open, el circuito deja de intentar llamadas y falla rápido con un mensaje claro al usuario",
      "En estado Half-Open, se intenta una llamada de prueba tras el tiempo de recuperación para decidir si vuelve a Closed",
      "El estado Closed indica que el circuito está permanentemente bloqueado",
      "El estado Half-Open ejecuta todas las llamadas pendientes en paralelo sin restricción"
      ],
      answer: [0, 1],
      explanation: "Open corta las llamadas y falla rápido, mientras Half-Open prueba con una llamada limitada para decidir si el servicio se recuperó. Closed es el estado de operación normal (no bloqueado), y Half-Open no ejecuta llamadas masivas en paralelo, sino una prueba controlada."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Marketplace B2B): una orden que involucraba 3 sistemas podía quedar en estado inconsistente si uno fallaba a mitad del proceso (inventario reservado, orden no creada). ¿Qué patrón resuelve directamente este problema?",
      options: [
      "Saga Pattern con compensaciones en Azure Durable Functions",
      "Aumentar el timeout de cada sistema",
      "Ejecutar los 3 sistemas de forma completamente independiente sin coordinación",
      "Revisar manualmente cada orden al final del día"
      ],
      answer: [0],
      explanation: "El Saga Pattern coordina los pasos entre sistemas y, si alguno falla, deshace automáticamente (compensa) los pasos anteriores ya ejecutados, evitando el estado inconsistente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Marketplace B2B): ¿qué requisito de diseño es indispensable para que un paso de la Saga pueda deshacerse si algo falla después?",
      options: [
      "Que la operación sea compensable (tenga una acción inversa definida)",
      "Que la operación se ejecute en menos de 1 segundo",
      "Que la operación use únicamente Dataverse, sin sistemas externos",
      "Que la operación no tenga ningún efecto secundario"
      ],
      answer: [0],
      explanation: "El caso indica que 'Saga requiere que todas las operaciones sean compensables — diseñar con esto en mente desde el inicio'. Sin una acción de compensación definida, el paso no puede deshacerse ante un fallo posterior.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Marketplace B2B): ¿qué patrón previene que un sistema externo caído genere una avalancha de errores en cascada sobre el resto de la integración?",
      options: [
      "Circuit Breaker",
      "Saga Pattern",
      "Repository Pattern",
      "Singleton Pattern"
      ],
      answer: [0],
      explanation: "El Circuit Breaker corta las llamadas a un sistema que detecta como caído, evitando que los reintentos constantes generen una avalancha de errores adicionales.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Marketplace B2B): ¿qué patrón hace que los plugins sean mucho más fáciles de testear, según el caso?",
      options: [
      "Repository Pattern",
      "Circuit Breaker",
      "Dead Letter Queue",
      "Outbox Pattern"
      ],
      answer: [0],
      explanation: "El caso indica explícitamente: 'Repository Pattern hace los plugins 10x más fáciles de testear', al desacoplar el acceso a datos de la lógica de negocio del plugin.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Marketplace B2B): ¿cuáles DOS resultados demuestra el caso tras implementar el Saga Pattern?",
      options: [
      "Cero órdenes en estado inconsistente",
      "Auditoría completa de cada intento y compensación",
      "Se eliminó la necesidad de coordinar múltiples sistemas",
      "Las órdenes ahora se procesan de forma completamente síncrona"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. La Saga sigue coordinando múltiples sistemas (ahora de forma robusta) y el patrón es intrínsecamente asíncrono/orquestado, no síncrono.",
      appliesTo: "caso"
    }
  ],
  26: [
    {
      type: "single",
      prompt: "En una Canvas App conectada a Dataverse, el usuario quiere filtrar 200 mil registros por una expresión que usa una función no delegable. ¿Cuál es el riesgo principal?",
      options: [
      "La app traerá solo un subconjunto y el resultado puede ser incompleto",
      "Dataverse creará automáticamente un índice para resolverlo",
      "La consulta se convertirá en FetchXML optimizado sin intervención",
      "Power Apps moverá la operación al navegador sin límite"
      ],
      answer: [0],
      explanation: "Cuando una operación no delega, Power Apps evalúa localmente sobre un conjunto limitado y puede omitir registros válidos. No existe conversión mágica ni creación automática de índices que elimine ese problema."
    },
    {
      type: "single",
      prompt: "Necesitas optimizar una consulta FetchXML usada por un dashboard operativo. ¿Qué cambio suele aportar más mejora inmediata?",
      options: [
      "Seleccionar solo las columnas necesarias y evitar joins innecesarios",
      "Solicitar todas las columnas por si después se necesitan",
      "Duplicar la misma link-entity varias veces para asegurar consistencia",
      "Convertir toda consulta a texto plano almacenado en una nota"
      ],
      answer: [0],
      explanation: "Reducir columnas y joins baja costo de red, procesamiento y serialización. Pedir más datos de los necesarios o duplicar joins aumenta latencia y complejidad sin valor real."
    },
    {
      type: "multi",
      prompt: "El equipo sospecha que la lentitud proviene de plugins y de fórmulas en la app. ¿Qué DOS herramientas ayudan a aislar esos problemas?",
      options: [
      "Plugin Profiler en Plugin Registration Tool",
      "Monitor en Power Apps",
      "Customer Voice dashboard",
      "Content Snippets"
      ],
      answer: [0, 1],
      explanation: "Plugin Profiler ayuda a capturar y reproducir ejecución server-side, mientras Monitor muestra red, fórmulas y eventos del cliente. Customer Voice y Content Snippets no son herramientas de diagnóstico de rendimiento."
    },
    {
      type: "single",
      prompt: "Un arquitecto debe prever consumo de plataforma para una solución transaccional de alto uso. ¿Qué dato es crítico incorporar al capacity planning?",
      options: [
      "El límite de API calls por licencia y el patrón real de consumo",
      "Solo el color del tema de la app",
      "La cantidad de presentaciones de PowerPoint del proyecto",
      "El número de reuniones semanales del equipo"
      ],
      answer: [0],
      explanation: "Los límites de llamadas API y el uso esperado impactan licencias, escalabilidad y riesgo operativo. Los demás elementos no determinan capacidad ni costo de la plataforma."
    },
    {
      type: "single",
      prompt: "Estás construyendo un PCF que renderiza un gran volumen de elementos. ¿Qué enfoque mejora el rendimiento visual?",
      options: [
      "Cargar y renderizar todos los elementos al iniciar siempre",
      "Aplicar lazy loading o virtualización cuando sea posible",
      "Deshabilitar cualquier paginación del dataset",
      "Mover toda la lógica a un iframe externo"
      ],
      answer: [1],
      explanation: "La virtualización y el lazy loading reducen trabajo inicial de DOM y mejoran respuesta percibida. Renderizar todo de golpe o eliminar paginación incrementa consumo y tiempos de pintura."
    },
    {
      type: "single",
      prompt: "Un desarrollador de Canvas Apps aumenta el límite de registros de datos de una app que usa una fórmula no delegable sobre una tabla de 50,000 registros. ¿Qué es correcto sobre este límite?",
      options: [
      "El default es 500 registros, configurable hasta un máximo de 2000",
      "El límite de delegación no existe para Dataverse, solo para SharePoint",
      "Aumentar el límite garantiza que se procesen los 50,000 registros completos",
      "El límite solo aplica a operaciones de escritura, nunca de lectura"
      ],
      answer: [0],
      explanation: "El límite de registros de datos por defecto es 500 y puede subirse hasta 2000, pero eso no elimina el riesgo de trabajar sobre un subconjunto incompleto en fórmulas no delegables sobre tablas de 50,000 registros. El límite aplica a lecturas y sí existe también para Dataverse."
    },
    {
      type: "single",
      prompt: "Un flujo de Power Automate procesa 100 elementos secuencialmente y tarda 200 segundos en total. ¿Qué configuración reduce ese tiempo sin cambiar la lógica del flujo?",
      options: [
      "Activar Concurrency Control en el Apply to Each con un Degree of Parallelism adecuado",
      "Aumentar el límite de delegación de la Canvas App relacionada",
      "Registrar un índice de búsqueda en la tabla de Dataverse",
      "Cambiar el modo del dataset de Power BI a DirectQuery"
      ],
      answer: [0],
      explanation: "Activar la concurrencia en el Apply to Each permite procesar varios elementos en paralelo en lugar de uno a uno, reduciendo el tiempo total significativamente. Las otras opciones pertenecen a Canvas Apps, Dataverse o Power BI y no aceleran un bucle de Power Automate."
    },
    {
      type: "single",
      prompt: "Necesitas crear 100 registros en Dataverse desde un proceso de integración minimizando el número de round-trips de red. ¿Qué funcionalidad de la OData API deberías usar?",
      options: [
      "Batch API con `$batch` para agrupar múltiples operaciones en una sola solicitud HTTP",
      "Ejecutar 100 llamadas Create individuales en paralelo sin agrupar",
      "Usar FetchXML para insertar registros",
      "Aumentar el timeout del cliente HTTP a 5 minutos"
      ],
      answer: [0],
      explanation: "La Batch API agrupa múltiples operaciones CRUD en una sola solicitud HTTP, reduciendo drásticamente la latencia de red frente a llamadas individuales. FetchXML es un lenguaje de consulta, no de inserción masiva, y aumentar el timeout no reduce el número de round-trips."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): la Canvas App de 15 pantallas tardaba 45 segundos en cargar y los vendedores la abandonaban antes de que terminara. ¿Qué cambio del caso contribuyó más a reducir ese tiempo?",
      options: [
      "Reducir Concurrent() de 8 tablas a 3 esenciales en App.OnStart, con Named Formulas lazy-load",
      "Agregar más pantallas para distribuir la carga",
      "Aumentar la resolución de las imágenes de productos",
      "Cargar todas las tablas con ClearCollect al inicio para tenerlas listas"
      ],
      answer: [0],
      explanation: "El caso reduce drásticamente lo que se carga de forma concurrente al inicio (de 8 tablas a 3 esenciales) y usa Named Formulas de carga diferida, en vez de cargar todo por adelantado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): para tablas con más de 1000 registros, ¿qué técnica recomienda el caso en vez de un ClearCollect de toda la tabla?",
      options: [
      "Paginación",
      "Duplicar la tabla en dos tablas más pequeñas",
      "Eliminar registros antiguos permanentemente",
      "Convertir la tabla en una colección local fija"
      ],
      answer: [0],
      explanation: "El caso indica 'Paginación > ClearCollect de toda la tabla para datos > 1000 registros', trayendo solo lo necesario en cada página en vez de toda la tabla de una vez.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): ¿por qué nunca se debe hacer ClearCollect dentro de Gallery.Items?",
      options: [
      "Porque se ejecuta en cada render de la galería, multiplicando innecesariamente las llamadas",
      "Porque Gallery.Items no admite fórmulas",
      "Porque ClearCollect solo funciona en App.OnStart",
      "Porque rompe la delegación de todas las consultas"
      ],
      answer: [0],
      explanation: "El caso advierte explícitamente que ClearCollect dentro de Gallery.Items se ejecuta en cada render, generando llamadas repetidas e innecesarias que degradan el rendimiento.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): ¿qué herramienta usa el caso para medir el tiempo de cada llamada dentro de la Canvas App y diagnosticar el problema de carga?",
      options: [
      "Monitor (Alt+Shift+M en Canvas App)",
      "El Solution Checker",
      "Power BI Desktop",
      "El editor de Power Fx sin herramientas adicionales"
      ],
      answer: [0],
      explanation: "El caso indica usar Monitor (Alt+Shift+M) para medir tiempos de cada llamada y así identificar cuáles eran los cuellos de botella de rendimiento.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Retailer): ¿cuáles DOS resultados demuestra el caso tras las optimizaciones de rendimiento?",
      options: [
      "Tiempo de carga reducido de 45 segundos a 6 segundos",
      "Adopción de la app aumentó del 60% al 92%",
      "Se eliminaron las 15 pantallas de la app",
      "Las imágenes dejaron de ser necesarias en la app"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. Las 15 pantallas y las imágenes de producto siguen presentes — las imágenes se optimizaron a WebP, no se eliminaron.",
      appliesTo: "caso"
    }
  ],
  27: [
    {
      type: "single",
      prompt: "Necesitas crear un control que muestre y manipule múltiples registros con ordenamiento y filtrado en una cuadrícula personalizada. ¿Qué tipo de PCF debes elegir?",
      options: [
      "Field control",
      "Dataset control",
      "Web resource HTML clásica",
      "Business rule"
      ],
      answer: [1],
      explanation: "Dataset control está diseñado para trabajar con colecciones de registros y exponer capacidades de filtrado y sorting. Field control se orienta a un valor individual, no a listas completas."
    },
    {
      type: "single",
      prompt: "Tu equipo adopta TypeScript strict mode en un PCF con React. ¿Qué beneficio principal obtiene?",
      options: [
      "Menos validación en tiempo de compilación",
      "Detección temprana de tipos nulos y contratos incorrectos",
      "Eliminación automática de la necesidad de pruebas",
      "Compatibilidad nativa con cualquier API sin typings"
      ],
      answer: [1],
      explanation: "Strict mode endurece la verificación de tipos y reduce errores sutiles antes de ejecutar el control. No reemplaza pruebas ni vuelve innecesarios los contratos tipados de APIs externas."
    },
    {
      type: "multi",
      prompt: "Quieres un PCF React robusto y accesible para uso enterprise. ¿Qué DOS prácticas son correctas?",
      options: [
      "Usar componentes de Fluent UI con soporte de accesibilidad",
      "Agregar atributos ARIA donde el patrón de interacción lo requiera",
      "Confiar solo en el color para transmitir estado",
      "Ignorar navegación por teclado porque el control es visual"
      ],
      answer: [0, 1],
      explanation: "Fluent UI y ARIA ayudan a cumplir expectativas de accesibilidad y experiencia consistente. Depender solo del color o ignorar teclado excluye usuarios y rompe estándares enterprise."
    },
    {
      type: "single",
      prompt: "El usuario cambia un valor en tu PCF y esperas que el formulario host reciba el nuevo estado. ¿Qué llamada es indispensable?",
      options: [
      "notifyOutputChanged()",
      "getDataSet()",
      "destroy()",
      "updateView()"
      ],
      answer: [0],
      explanation: "notifyOutputChanged informa al host que debe leer los outputs actualizados del control. Las otras funciones tienen otros fines y por sí mismas no propagan cambios al formulario."
    },
    {
      type: "single",
      prompt: "Durante desarrollo quieres probar rápidamente un PCF en un ambiente y luego incluirlo formalmente en una solución. ¿Qué secuencia es la más correcta?",
      options: [
      "pac pcf push para iterar y luego pac solution add-component para empaquetarlo",
      "Editar directamente la base de datos de Dataverse y publicar",
      "Copiar los archivos TypeScript al navegador del usuario",
      "Usar solo Chrome DevTools sin desplegar el control"
      ],
      answer: [0],
      explanation: "pac pcf push acelera la iteración en desarrollo y solution add-component incorpora el control al ciclo ALM. Tocar la base de datos o copiar archivos al cliente no son prácticas soportadas."
    },
    {
      type: "single",
      prompt: "Dentro de un PCF necesitas actualizar un registro de Dataverse tras una acción del usuario, sin gestionar tokens de autenticación manualmente. ¿Qué objeto del contexto debes usar?",
      options: [
      "context.webAPI",
      "context.navigation",
      "context.utils",
      "context.mode"
      ],
      answer: [0],
      explanation: "context.webAPI expone operaciones CRUD (createRecord, updateRecord, retrieveRecord, deleteRecord) autenticadas automáticamente con la sesión del usuario. context.navigation sirve para abrir formularios o URLs, y context.utils provee diálogos nativos — ninguno realiza operaciones CRUD."
    },
    {
      type: "single",
      prompt: "Tu equipo está decidiendo entre un PCF de tipo Standard y uno de tipo Virtual (React) para un control destinado a Model-Driven Apps modernas. ¿Qué ventaja principal ofrece el Virtual PCF?",
      options: [
      "Usa el React ya cargado en el host, reduciendo el bundle en 70-80% al no empaquetar React propio",
      "Permite ejecutar código fuera del Sandbox de Dataverse",
      "Elimina la necesidad de declarar propiedades en el manifest",
      "Solo funciona en Canvas Apps, nunca en Model-Driven Apps"
      ],
      answer: [0],
      explanation: "El Virtual PCF reutiliza el React del host en lugar de incluir su propia copia, reduciendo significativamente el tamaño del bundle. No cambia las reglas del Sandbox, sigue requiriendo declarar propiedades en el manifest, y es igualmente válido para Model-Driven Apps."
    },
    {
      type: "single",
      prompt: "Publicaste una corrección menor de un bug en un PCF ya usado en producción. Según la convención semántica del comando `pac pcf version`, ¿qué segmento de la versión debes incrementar?",
      options: [
      "El patch (por ejemplo de 1.0.0 a 1.0.1)",
      "El major (por ejemplo de 1.0.0 a 2.0.0)",
      "No es necesario cambiar la versión para bugfixes",
      "El minor únicamente cuando se agregan nuevas propiedades breaking"
      ],
      answer: [0],
      explanation: "La convención semántica indica incrementar el patch para bugfixes, minor para features nuevas no disruptivas y major para cambios breaking. Omitir el incremento de versión provoca que el navegador siga sirviendo la versión en caché."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de abogados): la subgrid nativa de documentos del expediente no permitía preview, tags ni acciones masivas, obligando a abrir cada registro individualmente. ¿Qué solución del caso resuelve esto?",
      options: [
      "Un PCF Dataset Control con preview inline, tags por categoría y botón de firmar",
      "Aumentar el número de columnas visibles en la subgrid nativa",
      "Reemplazar la subgrid por un reporte de Power BI",
      "Pedir a los abogados que abran los registros más rápido"
      ],
      answer: [0],
      explanation: "El caso implementa un PCF Dataset Control personalizado con preview inline de PDFs, tags coloridos y una acción de firma directa, cubriendo lo que la subgrid nativa no soporta.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de abogados): ¿qué variante de PCF recomienda el caso por su menor bundle y mejor rendimiento?",
      options: [
      "PCF Virtual (React)",
      "PCF Standard",
      "No hay diferencia de rendimiento entre variantes",
      "PCF Standard, porque no requiere compilación"
      ],
      answer: [0],
      explanation: "El caso indica 'Siempre usar Virtual PCF (React) — menor bundle, mejor rendimiento', al compartir el runtime de React de la plataforma en vez de empaquetar uno propio.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de abogados): tras una operación de escritura desde el PCF (por ejemplo, firmar un documento), ¿qué se debe llamar para mantener la lista sincronizada con los datos actuales?",
      options: [
      "dataset.refresh()",
      "window.location.reload()",
      "No es necesario, la lista se actualiza sola siempre",
      "Xrm.Page.data.refresh()"
      ],
      answer: [0],
      explanation: "El caso indica 'dataset.refresh() después de cualquier operación de escritura — mantiene la lista sincronizada', el método correcto dentro del ciclo de vida del PCF.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de abogados): ¿por qué el caso recomienda probar el PCF en el test harness local (`npm start`) antes de hacer `pac pcf push`?",
      options: [
      "Porque el ciclo de feedback local es de segundos, frente a minutos al desplegar a Dataverse",
      "Porque `pac pcf push` no permite hacer pruebas nunca",
      "Porque el test harness local es obligatorio por licenciamiento",
      "Porque `npm start` reemplaza la necesidad de compilar en modo Release"
      ],
      answer: [0],
      explanation: "El caso destaca la diferencia de velocidad de iteración: probar localmente con `npm start` da retroalimentación en segundos, mientras que desplegar a Dataverse con `pac pcf push` toma minutos por ciclo.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Firma de abogados): ¿cuáles DOS resultados demuestra el caso tras implementar el PCF Dataset Control?",
      options: [
      "Tiempo de revisión de expediente reducido de 8 a 2 minutos",
      "Satisfacción de los abogados de 4.7/5",
      "Se eliminó la necesidad de la tabla de expedientes en Dataverse",
      "Los documentos dejaron de requerir firma"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. La tabla de expedientes en Dataverse y el proceso de firma siguen siendo el núcleo de la solución — ahora con mejor experiencia de uso.",
      appliesTo: "caso"
    }
  ],
  28: [
    {
      type: "single",
      prompt: "Vas a construir una experiencia SPA embebida en Power Pages con React y TypeScript. ¿Qué combinación describe mejor la base técnica del proyecto?",
      options: [
      "index.html, main.tsx y empaquetado tipo Vite",
      "Solo Liquid templates sin frontend",
      "Power BI paginado como host",
      "Una solución de plugins C# sin recursos web"
      ],
      answer: [0],
      explanation: "Los Code Sites de Power Pages siguen un enfoque moderno SPA con punto de entrada HTML y bootstrap en main.tsx. Liquid y plugins pueden complementar, pero no sustituyen esa estructura de frontend."
    },
    {
      type: "single",
      prompt: "La app necesita autenticar al usuario frente a Microsoft Entra ID y obtener tokens para llamadas protegidas desde el frontend. ¿Qué librería encaja mejor?",
      options: [
      "MSAL.js",
      "jQuery UI",
      "FakeXrmEasy",
      "Fluent Assertions"
      ],
      answer: [0],
      explanation: "MSAL.js está pensada para autenticación y adquisición de tokens en aplicaciones web modernas. Las otras librerías no gestionan identidad ni flujos OAuth para el navegador."
    },
    {
      type: "multi",
      prompt: "Tu SPA consumirá Power Pages Web API para leer y actualizar datos. ¿Qué DOS condiciones debes cumplir para que el diseño sea correcto y seguro?",
      options: [
      "Configurar Table Permissions acordes al usuario y la tabla",
      "Permitir desde el sitio los headers o configuraciones necesarias para el escenario de frontend",
      "Exponer todas las tablas de Dataverse por conveniencia",
      "Confiar solo en ocultar botones cuando el usuario no deba editar"
      ],
      answer: [0, 1],
      explanation: "La seguridad real depende de Table Permissions y de la configuración HTTP adecuada del sitio para el frontend. Exponer de más o esconder botones sin permisos server-side deja brechas de autorización."
    },
    {
      type: "single",
      prompt: "Publicaste una nueva versión del Code Site y ahora necesitas subirla al ambiente destino. ¿Qué comando se alinea con el despliegue de Power Pages Code Apps?",
      options: [
      "pac pages upload",
      "pac solution export --managed",
      "pac pcf init",
      "pac data export"
      ],
      answer: [0],
      explanation: "pac pages upload es el comando orientado a publicar el sitio de Power Pages. Exportar soluciones o inicializar PCF son tareas distintas del despliegue del frontend embebido."
    },
    {
      type: "single",
      prompt: "En local todo funciona, pero publicado el navegador bloquea una llamada por políticas de origen. ¿Qué área debes revisar primero?",
      options: [
      "CORS y headers configurados para Power Pages",
      "El color del tema Material",
      "La licencia de Power BI Pro",
      "Los Quick Finds de Dataverse"
      ],
      answer: [0],
      explanation: "Los problemas entre dominios normalmente se resuelven revisando CORS, headers y políticas del sitio publicado. El resto de opciones no explica un bloqueo de navegador por origen."
    },
    {
      type: "single",
      prompt: "Un desarrollador modifica manualmente un archivo dentro de `src/generated/services/` de una Code App para agregar lógica personalizada. ¿Qué problema tendrá ese cambio?",
      options: [
      "Se perderá la próxima vez que se ejecute `pac code add-data-source`, ya que la carpeta se regenera completamente",
      "El cambio se aplicará automáticamente a todos los ambientes sin necesidad de push",
      "No hay ningún riesgo porque `/generated/` no se sobreescribe nunca",
      "El cambio romperá la autenticación MSAL de la app"
      ],
      answer: [0],
      explanation: "La carpeta `/generated/` se sobreescribe completamente con cada `pac code add-data-source`, por lo que cualquier edición manual se pierde. La práctica correcta es crear wrappers propios que importen desde `/generated/` sin modificarlo directamente."
    },
    {
      type: "single",
      prompt: "Un cliente pide que la Code App recién construida funcione también en Power Apps Mobile para el equipo de campo. ¿Qué debes responder según las limitaciones actuales (Preview) de Code Apps?",
      options: [
      "Code Apps no soportan Power Apps Mobile; para usuarios móviles se debe usar una Canvas App con los mismos datos de Dataverse",
      "Code Apps funcionan de forma nativa en Power Apps Mobile sin configuración adicional",
      "Solo es necesario instalar el SDK de MSAL.js para habilitar mobile",
      "El soporte mobile se habilita con `pac code add-data-source --mobile`"
      ],
      answer: [0],
      explanation: "Las Code Apps en Preview no soportan Power Apps Mobile; el camino recomendado para usuarios móviles es una Canvas App conectada a los mismos datos Dataverse. No existe un flag ni SDK que habilite soporte mobile nativo actualmente."
    },
    {
      type: "multi",
      prompt: "Una Code App se despliega dentro de Power Platform en lugar de como una SPA externa. ¿Qué DOS beneficios de gobernanza hereda automáticamente sin código adicional?",
      options: [
      "Las DLP Policies del administrador bloquean conectores no autorizados",
      "Auditoría de acceso sobre quién abrió la app y cuándo",
      "Optimización automática del código TypeScript sin necesidad de build",
      "Generación automática de tests unitarios para los componentes React"
      ],
      answer: [0, 1],
      explanation: "Al vivir dentro de Power Platform, la Code App hereda DLP Policies y auditoría de acceso de la plataforma gestionada sin escribir código adicional. La optimización del build y la generación de tests no son beneficios de gobernanza de la plataforma, sino tareas del desarrollo normal."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): el portal de proyectos necesitaba Kanban con drag-and-drop, gráficos interactivos y timesheet con edición masiva — patrones que Canvas App no soporta bien. ¿Qué decisión arquitectónica tomó el caso?",
      options: [
      "Construir una Code App en React conectada a Dataverse",
      "Renunciar al Kanban y los gráficos interactivos",
      "Construir 3 Canvas Apps separadas, una por patrón de UI",
      "Migrar todo a una hoja de Excel compartida"
      ],
      answer: [0],
      explanation: "El caso elige una Code App en React precisamente porque soporta patrones de UI (drag-and-drop, gráficos, grids editables) que Canvas App no cubre nativamente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): ¿qué ventaja de tiempo de desarrollo reporta el caso al elegir Code App en vez de construir cada patrón como un PCF Component separado?",
      options: [
      "40% menos tiempo de desarrollo (3 semanas vs 3 meses estimados con PCF)",
      "El mismo tiempo, pero con menos líneas de código",
      "Un 90% más de tiempo, pero con mejor calidad",
      "No hay diferencia de tiempo entre ambos enfoques"
      ],
      answer: [0],
      explanation: "El caso indica que construir cada patrón como PCF Component separado tomaría 3 meses, mientras la Code App resolvió todo en 3 semanas — un 40% menos de tiempo de desarrollo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): ¿qué gestiona la plataforma automáticamente en la Code App, evitando que el equipo escriba código de autenticación?",
      options: [
      "Autenticación Entra ID gestionada por la plataforma",
      "El diseño visual del Kanban",
      "La lógica de negocio del timesheet",
      "Los gráficos de utilización con recharts"
      ],
      answer: [0],
      explanation: "El caso indica 'Autenticación Entra ID gestionada por la plataforma — cero código de auth', un beneficio directo de construir la Code App dentro de Power Platform.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de consultoría): ¿cómo se desplegó la Code App a producción según el caso?",
      options: [
      "Como solución Managed, con pipeline CI/CD de Azure DevOps",
      "Copiando manualmente los archivos al servidor de producción",
      "Como solución Unmanaged directamente en PROD",
      "Sin ningún proceso de despliegue formal"
      ],
      answer: [0],
      explanation: "El caso especifica que la Code App se desplegó 'como solución Managed en producción con pipeline CI/CD Azure DevOps', siguiendo el mismo rigor de ALM que otros componentes de Power Platform.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Firma de consultoría): ¿cuáles DOS librerías de React usa el caso para implementar el Kanban y los gráficos de utilización?",
      options: [
      "react-beautiful-dnd, para el drag-and-drop del Kanban",
      "recharts, para los gráficos de utilización en tiempo real",
      "jQuery UI, para el drag-and-drop",
      "Bootstrap, para los gráficos"
      ],
      answer: [0, 1],
      explanation: "El caso especifica explícitamente 'react-beautiful-dnd' para el Kanban con drag-and-drop y 'recharts' para los gráficos de utilización conectados a datos reales.",
      appliesTo: "caso"
    }
  ],
  29: [
    {
      type: "single",
      prompt: "Una aseguradora quiere que solo clientes invitados puedan registrarse en su portal B2C. ¿Qué mecanismo es el más adecuado en Power Pages?",
      options: [
      "Anonymous Access global",
      "Invitation codes",
      "Desactivar autenticación y filtrar después",
      "Solo cookies del navegador"
      ],
      answer: [1],
      explanation: "Invitation codes permiten controlar quién puede completar el registro y asociar correctamente la identidad. El acceso anónimo o sin control previo rompe el requisito de admisión restringida."
    },
    {
      type: "single",
      prompt: "Debes mapear en Power Pages datos de Azure AD B2C como email, nombre visible y atributos útiles para autorización. ¿Qué configuración es clave?",
      options: [
      "Claims mapping",
      "Quick Find View",
      "Business Process Flow",
      "Rollup field"
      ],
      answer: [0],
      explanation: "Claims mapping transforma atributos emitidos por el proveedor en información utilizable dentro del portal. Las otras opciones pertenecen a búsqueda, procesos o modelado de datos, no a identidad federada."
    },
    {
      type: "multi",
      prompt: "El portal público sufrirá alto tráfico y debe endurecerse en el borde. ¿Qué DOS beneficios aporta Azure Front Door en este escenario?",
      options: [
      "Web Application Firewall",
      "CDN y aceleración global",
      "Reemplazo automático de Table Permissions",
      "Ejecución de plugins C# en el navegador"
      ],
      answer: [0, 1],
      explanation: "Front Door aporta WAF y distribución global con capacidades de aceleración y edge caching. No sustituye seguridad de datos del portal ni ejecuta lógica server-side del modelo Dataverse."
    },
    {
      type: "single",
      prompt: "Quieres que un proveedor vea únicamente órdenes asociadas a su empresa en el portal. ¿Qué diseño implementa mejor row-level security?",
      options: [
      "Una página con lista global y filtro JavaScript en cliente",
      "Table Permissions apoyadas en un Contact Lookup o relación equivalente",
      "Exportar todo a Excel y compartir por correo",
      "Agregar la palabra 'privado' al título del registro"
      ],
      answer: [1],
      explanation: "La seguridad por fila debe apoyarse en relaciones de Dataverse y Table Permissions, no en filtros del navegador. Exportar datos o etiquetarlos visualmente no restringe realmente el acceso."
    },
    {
      type: "single",
      prompt: "Un requisito de identidad exige journeys complejos no cubiertos por user flows estándar, como validaciones avanzadas y orquestación personalizada. ¿Qué opción de Azure AD B2C debes evaluar?",
      options: [
      "Custom policies con Identity Experience Framework",
      "Solo Local Authentication del portal",
      "Price Lists por usuario",
      "Knowledge Articles"
      ],
      answer: [0],
      explanation: "Las custom policies permiten modelar journeys avanzados cuando los user flows no alcanzan. Las demás opciones no pertenecen al dominio de federación e identidad para Power Pages."
    },
    {
      type: "single",
      prompt: "El equipo de identidad debate si usar User Flows o Custom Policies (IEF) para el registro de clientes externos en Power Pages. El escenario es estándar: registro con email y login. ¿Qué recomendación es la más alineada a buenas prácticas?",
      options: [
      "Usar User Flows, reservando Custom Policies solo para escenarios que los User Flows no puedan cubrir",
      "Usar siempre Custom Policies porque son más flexibles en todos los casos",
      "Evitar ambos y usar solo Local Authentication del portal",
      "Los User Flows no admiten atributos personalizados como país o teléfono"
      ],
      answer: [0],
      explanation: "Los User Flows cubren el 90% de los escenarios estándar por GUI y sin XML, mientras las Custom Policies tienen una curva de mantenimiento mucho mayor y deben reservarse para necesidades avanzadas como federación SAML o lógica condicional compleja. Los User Flows sí admiten atributos personalizados a recopilar."
    },
    {
      type: "single",
      prompt: "Una página del portal consulta un catálogo de países que cambia muy poco, y esa consulta se repite en cada carga de página con un costo notable. ¿Qué mecanismo de Power Pages reduce ese costo sin cambiar la arquitectura del portal?",
      options: [
      "Liquid Cache con `{% cache %}...{% endcache %}` y un timeout adecuado",
      "Desactivar las Table Permissions de la tabla de catálogos",
      "Convertir la página en un Web File estático",
      "Aumentar el límite de delegación de la Canvas App relacionada"
      ],
      answer: [0],
      explanation: "Liquid Cache almacena el resultado de una consulta Liquid durante el tiempo configurado, evitando consultar Dataverse en cada request para datos que cambian poco. Desactivar Table Permissions comprometería la seguridad, y las otras opciones no aplican a este escenario de Power Pages."
    },
    {
      type: "single",
      prompt: "El equipo de marketing pide mejorar el SEO del portal público antes del lanzamiento. ¿Qué práctica de Power Pages con Liquid contribuye directamente a ese objetivo?",
      options: [
      "Generar meta-tags dinámicos como título y descripción con Liquid en el `<head>` de cada página",
      "Deshabilitar el sitemap.xml automático del portal",
      "Ocultar todas las páginas del menú de navegación",
      "Forzar que todas las páginas requieran autenticación B2C"
      ],
      answer: [0],
      explanation: "Los meta-tags dinámicos generados con Liquid (título, descripción, Open Graph) son una práctica directa de SEO en Power Pages. Deshabilitar el sitemap, ocultar páginas del menú o forzar autenticación en todo el sitio perjudican la indexación y el acceso público."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SaaS multi-país): necesitaban un portal de autoservicio para clientes externos de 50 países, sin darles cuentas en el Azure AD corporativo. ¿Qué solución usa el caso para el registro/login?",
      options: [
      "Azure AD B2C",
      "Azure AD corporativo compartido con los clientes",
      "Una cuenta genérica compartida para todos los clientes",
      "Autenticación básica con usuario y contraseña en texto plano"
      ],
      answer: [0],
      explanation: "El caso usa Azure AD B2C, diseñado específicamente para identidades de clientes externos, separado del Azure AD corporativo interno.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SaaS multi-país): ¿por qué el caso recomienda nunca mezclar Azure AD B2C y Azure AD interno en el mismo portal sin MFA diferenciado?",
      options: [
      "Porque son audiencias distintas (externos vs internos) con requisitos de seguridad diferentes",
      "Porque técnicamente es imposible configurar ambos en el mismo tenant",
      "Porque B2C no soporta ningún tipo de autenticación multifactor",
      "Porque mezclar ambos duplica el costo de licenciamiento del portal"
      ],
      answer: [0],
      explanation: "El caso es explícito: 'B2C para usuarios externos, Azure AD para usuarios internos — nunca mezclar en el mismo portal sin MFA diferenciado', reconociendo que ambas audiencias tienen perfiles de riesgo distintos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SaaS multi-país): ¿qué recomienda el caso para el 90% de los escenarios de autenticación B2C, reservando la otra opción solo para requisitos especiales?",
      options: [
      "User Flows, reservando Custom Policies solo cuando el User Flow no alcance",
      "Custom Policies para todos los escenarios, sin excepción",
      "No usar ningún flujo predefinido, todo debe ser código personalizado",
      "User Flows únicamente para clientes de un solo país"
      ],
      answer: [0],
      explanation: "El caso indica usar User Flows de B2C para el 90% de los casos estándar, y reservar Custom Policies (de mantenimiento mucho más costoso) solo para requisitos que el User Flow no puede satisfacer.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SaaS multi-país): un usuario se autentica con B2C pero no ve ningún registro porque el email del token no coincide con ningún Contact existente. ¿Qué configuración del caso soluciona esto?",
      options: [
      "Configurar el claim 'email' en el User Flow y activar la creación automática de Contact en el portal",
      "Pedir al usuario que se registre con un email distinto cada vez",
      "Eliminar la validación de email por completo",
      "Crear manualmente cada Contact antes de que el usuario se registre"
      ],
      answer: [0],
      explanation: "El caso indica configurar el claim 'email' en el User Flow y activar el Site Setting 'Authentication/Registration/Enabled' para que el portal cree automáticamente el Contact al primer login.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (SaaS multi-país): ¿cuáles DOS resultados demuestra el caso tras implementar el portal con Azure AD B2C?",
      options: [
      "3,500 usuarios registrados en el primer mes",
      "Cero llamadas de soporte para 'cómo inicio sesión'",
      "Se eliminó la necesidad de Table Permissions en el portal",
      "El portal dejó de necesitar un language switcher"
      ],
      answer: [0, 1],
      explanation: "El caso reporta específicamente estos dos resultados. Table Permissions y el language switcher (ES/EN/PT) siguen siendo parte de la solución descrita.",
      appliesTo: "caso"
    }
  ],
  30: [
    {
      type: "single",
      prompt: "En el proyecto multicapa del nivel 3 debes justificar por qué ciertas capacidades van en plugin, otras en Power Pages y otras en Azure Functions. ¿Qué artefacto documenta mejor esas decisiones?",
      options: [
      "ADR",
      "Una captura de pantalla del backlog",
      "El tema visual del portal",
      "Un correo informal sin versionado"
      ],
      answer: [0],
      explanation: "Un Architecture Decision Record captura contexto, opciones evaluadas, decisión y consecuencias. Eso permite trazabilidad técnica y ejecutiva mucho mejor que evidencia dispersa o no versionada."
    },
    {
      type: "single",
      prompt: "El patrocinador pide una definición clara de calidad antes del go-live. ¿Cuál de estas combinaciones representa mejor un quality gate del proyecto?",
      options: [
      "Ignorar warnings de Solution Checker si la demo convence",
      "Validar Plugin Depth, Solution Checker, accesibilidad/UX del PCF y rendimiento del portal",
      "Aprobar solo por número de pantallas entregadas",
      "Dejar pruebas para después del despliegue a producción"
      ],
      answer: [1],
      explanation: "Un proyecto multicapa debe medir calidad técnica en cada componente relevante, no solo apariencia funcional. Ignorar chequeos o posponer validación aumenta riesgo operativo y deuda técnica."
    },
    {
      type: "multi",
      prompt: "Quieres cerrar el proyecto con una evidencia end-to-end sólida. ¿Qué DOS resultados demuestran mejor la integración del nivel 3?",
      options: [
      "Despliegue automatizado por CI/CD entre ambientes",
      "Trazabilidad de decisiones arquitectónicas y evidencias de validación",
      "Cambios manuales no documentados en producción",
      "Una demo local sin correspondencia con el ambiente publicado"
      ],
      answer: [0, 1],
      explanation: "El valor del proyecto está en integrar arquitectura, calidad y despliegue reproducible, no solo en mostrar una demo aislada. Los cambios manuales rompen ALM y dificultan soporte futuro."
    },
    {
      type: "single",
      prompt: "Durante pruebas aparece un plugin que se dispara repetidamente al actualizar el mismo registro desde Post-Operation. ¿Qué corrección es la más inmediata?",
      options: [
      "Agregar control de Depth y revisar si la actualización puede moverse o minimizarse",
      "Aumentar el timeout del navegador del usuario",
      "Eliminar todas las Table Permissions del portal",
      "Desactivar los Solution Checkers del pipeline"
      ],
      answer: [0],
      explanation: "El problema apunta a recursión o diseño del plugin, por lo que Depth y la ubicación de la lógica son claves. Timeout, permisos del portal o checker del pipeline no atacan la causa."
    },
    {
      type: "single",
      prompt: "¿Qué práctica de despliegue cierra mejor el objetivo del proyecto multicapa?",
      options: [
      "Importar componentes diferentes manualmente en cada ambiente",
      "Ejecutar una cadena CI/CD que promueva solución, portal y configuraciones parametrizadas",
      "Hacer solo un backup antes de publicar y confiar en eso",
      "Pedir a cada maker que recree localmente los componentes"
      ],
      answer: [1],
      explanation: "El objetivo es demostrar una solución enterprise reproducible y gobernada de punta a punta. La recreación manual o los cambios aislados no garantizan consistencia entre ambientes."
    },
    {
      type: "single",
      prompt: "El pipeline CD debe desplegar `SIT_Foundation` antes que `SIT_CustomerService`, que depende de ella. ¿Qué debe garantizar el diseño del pipeline si la importación de Foundation falla?",
      options: [
      "Bloquear el despliegue de todas las soluciones dependientes hasta resolver el error en Foundation",
      "Continuar igualmente con el despliegue de SIT_CustomerService ignorando el error",
      "Reintentar automáticamente en producción sin revisar la causa del fallo",
      "Eliminar la dependencia declarada para evitar el bloqueo"
      ],
      answer: [0],
      explanation: "Un error en una solución base como Foundation debe bloquear todos los despliegues dependientes, ya que continuar dejaría el ambiente en un estado inconsistente. Ignorar el error, reintentar ciegamente en PROD, o eliminar la dependencia comprometen la integridad del despliegue multi-solución."
    },
    {
      type: "single",
      prompt: "Tras un despliegue fallido en PROD, el equipo necesita revertir rápidamente. ¿Qué elemento es indispensable en un rollback plan bien diseñado para Power Platform?",
      options: [
      "Mantener el artifact de la versión anterior en el pipeline y documentar los pasos manuales adicionales (datos, configuraciones)",
      "Confiar en que el próximo despliegue automáticamente corrija el problema anterior",
      "No es necesario documentar nada si el equipo recuerda los pasos",
      "Usar siempre el mismo artifact de la versión fallida para el rollback"
      ],
      answer: [0],
      explanation: "Un rollback plan sólido conserva el artifact de la versión anterior y documenta los pasos manuales complementarios (restaurar datos, revertir configuraciones), permitiendo ejecutar la reversión en menos de 30 minutos. Confiar en la memoria del equipo o en el despliegue siguiente no es una estrategia confiable."
    },
    {
      type: "multi",
      prompt: "El equipo de operaciones quiere detectar problemas en producción antes de que los usuarios los reporten. ¿Qué DOS prácticas de monitoreo y observabilidad son adecuadas según el diseño del proyecto multicapa?",
      options: [
      "Configurar alertas de Azure Monitor sobre mensajes acumulados en la Dead Letter Queue de Service Bus",
      "Habilitar Plugin Trace Log en modo 'Exception Only' con revisión periódica",
      "Desactivar todas las alertas para reducir el ruido de notificaciones",
      "Revisar Analytics de Copilot Studio solo una vez al año"
      ],
      answer: [0, 1],
      explanation: "Las alertas sobre la Dead Letter Queue y el Plugin Trace Log en modo Exception Only con revisión periódica permiten detectar problemas proactivamente. Desactivar alertas o revisar Analytics solo anualmente van en contra del objetivo de observabilidad continua."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Multicapa): al importar las soluciones, SIT_CustomerService falla porque no encuentra componentes de SIT_Foundation. ¿Cuál es la causa y la corrección según el caso?",
      options: [
      "Se importó CustomerService antes que Foundation; hay que ordenar explícitamente los stages: Foundation → CustomerService → Portal → Bot",
      "SIT_Foundation nunca debió crearse como solución separada",
      "El pipeline debe importar todas las soluciones en paralelo para ser más rápido",
      "Es un error aleatorio sin relación con el orden de importación"
      ],
      answer: [0],
      explanation: "El caso identifica la causa exacta: orden de importación incorrecto. La corrección es ordenar explícitamente los stages del YAML según las dependencias entre soluciones.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Multicapa): un plugin funciona en DEV pero falla en TEST con 'Object reference'. ¿Cuál es la causa más probable según el caso?",
      options: [
      "Una Environment Variable usada en el plugin tiene valor vacío en TEST",
      "El plugin nunca se probó en ningún ambiente",
      "TEST no soporta plugins de C#",
      "El código del plugin tiene un error de sintaxis que no se detectó en DEV"
      ],
      answer: [0],
      explanation: "El caso señala que la causa es una Environment Variable sin configurar en TEST; la corrección es configurar todas las Environment Variables en TEST antes de ejecutar el pipeline CD.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Multicapa): el bot de Copilot Studio no responde con datos del usuario en TEST, aunque funciona en DEV. ¿Cuál es la causa según el caso?",
      options: [
      "El Service Connection del bot apunta al entorno DEV, no a TEST",
      "Copilot Studio no está disponible en ambientes de TEST",
      "El bot perdió su configuración de Knowledge Sources",
      "El usuario de prueba en TEST no existe"
      ],
      answer: [0],
      explanation: "El caso indica que la integración del bot debe reconfigurarse para apuntar al entorno TEST al importar la solución — de lo contrario, sigue consultando datos de DEV.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Multicapa): Power Pages no crea casos desde el portal en PROD, aunque funcionaba en DEV. ¿Cuál es la causa según el caso?",
      options: [
      "El Table Permission se configuró en DEV pero no se exportó como parte de la solución SIT_Portal",
      "El portal nunca tuvo permisos configurados en ningún ambiente",
      "PROD bloquea por defecto la creación de casos desde portales externos",
      "Es necesario reconstruir el portal completo en PROD"
      ],
      answer: [0],
      explanation: "El caso señala que los Table Permissions son componentes exportables que deben agregarse explícitamente a la solución antes del export — si no, PROD nunca los recibe aunque existan en DEV.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Proyecto Multicapa): ¿por qué el caso recomienda documentar el orden de despliegue en el README del repositorio en vez de confiar en que el equipo lo recuerde?",
      options: [
      "Para que, ante una urgencia o un desarrollador nuevo, el orden correcto esté escrito y no dependa de la memoria de alguien",
      "Porque Azure DevOps borra automáticamente el historial de despliegues después de 30 días",
      "Porque el README es el único lugar donde se pueden versionar archivos YAML",
      "Es solo una formalidad sin impacto real en el proyecto"
      ],
      answer: [0],
      explanation: "El caso es explícito: el orden correcto 'no debería ser recordado, debe estar escrito', precisamente para evitar errores como los de importación descritos en los errores comunes de este mismo módulo.",
      appliesTo: "caso"
    }
  ],
  31: [
    {
      type: "single",
      prompt: "El CIO pregunta quién puede crear ambientes, qué conectores están permitidos y cómo se retiran apps obsoletas. ¿Qué necesitas definir formalmente?",
      options: [
      "Un Governance Framework de Power Platform",
      "Solo un tema visual corporativo",
      "Una lista personal de tareas del arquitecto",
      "Únicamente el naming de campos en Dataverse"
      ],
      answer: [0],
      explanation: "El Governance Framework establece roles, guardrails y ciclo de vida de la plataforma a escala. El resto son piezas aisladas que no cubren control organizacional integral."
    },
    {
      type: "single",
      prompt: "En TOGAF ADM estás redactando la visión, objetivos de negocio y stakeholders clave de la iniciativa Power Platform. ¿En qué fase estás trabajando principalmente?",
      options: [
      "Architecture Vision",
      "Technology Architecture",
      "Migration Planning",
      "Requirements Management únicamente"
      ],
      answer: [0],
      explanation: "Architecture Vision define el alcance estratégico y la razón de la transformación. Technology Architecture ocurre después y detalla componentes técnicos concretos para soportarla."
    },
    {
      type: "multi",
      prompt: "Estás construyendo gobierno enterprise sostenible para Power Platform. ¿Qué DOS artefactos aportan más claridad estratégica al inicio?",
      options: [
      "Capability Map",
      "Risk Register",
      "Una lista de emojis para cada ambiente",
      "Capturas sueltas de makers destacados"
      ],
      answer: [0, 1],
      explanation: "Capability Map ayuda a vincular plataforma con capacidades de negocio y Risk Register hace explícitos los riesgos a gestionar. Los otros elementos no sirven como instrumentos de gobierno formal."
    },
    {
      type: "single",
      prompt: "Tu organización quiere estandarizar la creación de ambientes, soluciones base y configuración repetible mediante scripts. ¿Qué enfoque describe mejor esa meta?",
      options: [
      "Landing Zone como código apoyada en pac CLI y automatización",
      "Crear ambientes manualmente según memoria del administrador",
      "Pedir a cada maker que cree su propia gobernanza",
      "Evitar cualquier automatización para reducir complejidad"
      ],
      answer: [0],
      explanation: "Una Landing Zone como código hace repetible, auditable y gobernable la base de la plataforma. El aprovisionamiento manual escala mal y genera deriva entre ambientes."
    },
    {
      type: "single",
      prompt: "La dirección financiera quiere entender el costo real de la plataforma por licencias, almacenamiento y llamadas API. ¿Qué disciplina debes introducir?",
      options: [
      "FinOps para Power Platform",
      "Solo change management",
      "Kanban visual sin métricas",
      "A/B testing de colores"
      ],
      answer: [0],
      explanation: "FinOps aporta visibilidad y decisiones de optimización sobre consumo y costo. Las otras prácticas pueden ser útiles en otros contextos, pero no responden a la gobernanza financiera de la plataforma."
    },
    {
      type: "single",
      prompt: "Como arquitecto, completas el cuestionario oficial de Microsoft en aka.ms/ppswa y obtienes un scorecard con recomendaciones priorizadas para el tenant. ¿A qué marco corresponde esta evaluación?",
      options: [
      "Well-Architected Framework de Power Platform",
      "TOGAF ADM completo",
      "El Innovation Backlog del CoE",
      "El Environment Request Process"
      ],
      answer: [0],
      explanation: "El Well-Architected Framework de Power Platform se evalúa mediante el cuestionario oficial de aka.ms/ppswa y genera un scorecard con recomendaciones priorizadas sobre los 5 pilares. TOGAF es un marco de referencia contextual más genérico, y las otras opciones son procesos operativos del CoE, no marcos de evaluación arquitectónica."
    },
    {
      type: "single",
      prompt: "En un proyecto, los citizen developers aportan conocimiento del proceso de negocio, los pro developers construyen plugins e integraciones avanzadas, e IT provee gobernanza y operaciones, todos colaborando sobre el mismo proyecto. ¿Qué modelo de trabajo describe esta situación?",
      options: [
      "Fusion Teams",
      "Risk Register compartido",
      "Sovereign cloud",
      "Change Request Process"
      ],
      answer: [0],
      explanation: "Fusion Teams es el modelo documentado por Microsoft donde makers, desarrolladores pro e IT colaboran en el mismo proyecto combinando sus fortalezas para escalar sin bloquear a IT ni generar shadow IT. Las demás opciones no describen un modelo de colaboración entre roles."
    },
    {
      type: "multi",
      prompt: "El equipo de Platform Engineering quiere que los nuevos proyectos adopten patrones ya validados sin reinventar la rueda cada vez. ¿Qué DOS prácticas del Módulo 31 apoyan directamente ese objetivo?",
      options: [
      "Publicar Reference Architectures con decisiones de diseño justificadas y código reutilizable",
      "Tratar la plataforma como un producto interno con golden paths y SLAs propios (Platform Engineering)",
      "Permitir que cada proyecto invente su propio modelo de seguridad desde cero",
      "Eliminar cualquier documentación para acelerar el desarrollo"
      ],
      answer: [0, 1],
      explanation: "Las Reference Architectures documentan patrones validados y reutilizables, y Platform Engineering publica golden paths para adopción rápida y consistente. Permitir reinvención por proyecto o eliminar documentación va en contra del objetivo de consistencia y velocidad."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): el incidente de seguridad que expuso datos de 5,000 clientes ocurrió porque un maker usó un connector externo no aprobado. ¿Qué mecanismo de gobernanza previene directamente ese escenario?",
      options: [
      "Un dashboard de Power BI que reporte el incidente después de ocurrido",
      "DLP (Data Loss Prevention) policies aplicadas en todos los ambientes",
      "El CoE Starter Kit, usado solo para generar reportes de inventario",
      "Aumentar la capacidad de licenciamiento del tenant"
      ],
      answer: [1],
      explanation: "Las políticas DLP son el mecanismo que bloquea o restringe qué connectors pueden combinarse en una misma app o flujo, evitando precisamente que datos sensibles salgan por un connector no aprobado. Un dashboard solo informa después del hecho; no lo previene.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): antes de la intervención, el 60% de las 800 apps del tenant no tenía owner identificado. ¿Qué herramienta le dio al banco visibilidad centralizada de esas apps y sus responsables?",
      options: [
      "CoE Starter Kit",
      "Field Security Profile",
      "Power Pages",
      "Una Business Rule por cada app"
      ],
      answer: [0],
      explanation: "El CoE (Center of Excellence) Starter Kit es la herramienta de Microsoft diseñada para inventariar apps, flujos y makers del tenant, exactamente el problema de visibilidad que enfrentaba el banco.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): se necesita que cada nuevo proyecto arranque ya con las políticas de seguridad y gobernanza correctas aplicadas, sin que el equipo las configure manualmente cada vez. ¿Qué implementó el banco para lograrlo?",
      options: [
      "Landing Zones automatizadas",
      "Un manual en PDF con las políticas recomendadas",
      "Una reunión mensual de revisión de nuevos proyectos",
      "Eliminar la capacidad de crear nuevos ambientes"
      ],
      answer: [0],
      explanation: "Las Landing Zones automatizadas aprovisionan ambientes con la configuración de gobernanza ya aplicada desde el inicio (como código), evitando depender de que cada equipo la configure manualmente o de que alguien recuerde revisarla.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Banco): el caso señala que el Governance Framework solo se cumplió de forma efectiva cuando tuvo una condición específica. ¿Cuál?",
      options: [
      "Que estuviera escrito en el idioma local del país",
      "Que tuviera aprobación y sponsor ejecutivo (C-suite)",
      "Que se publicara en la intranet interna",
      "Que lo revisara el equipo de IT una vez al año"
      ],
      answer: [1],
      explanation: "El caso es explícito: 'sin sponsor ejecutivo, no se cumple'. Un framework de gobernanza sin respaldo del C-suite carece de la autoridad organizacional necesaria para hacerse cumplir.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Banco): ¿cuáles DOS acciones reflejan una gobernanza madura que habilita con control, en vez de solo bloquear?",
      options: [
      "Definir un proceso de excepción formal para casos legítimos que no cumplen la política por defecto",
      "Revisar el Well-Architected Framework periódicamente porque la plataforma evoluciona",
      "Prohibir de forma permanente la creación de nuevas apps en el tenant",
      "Ignorar las apps ya existentes que no tienen owner identificado"
      ],
      answer: [0, 1],
      explanation: "Un proceso de excepción formal permite avanzar en casos legítimos sin romper la política general, y revisar el framework periódicamente reconoce que la plataforma cambia. Prohibir permanentemente o ignorar apps sin owner son respuestas de bloqueo total, no de gobernanza madura.",
      appliesTo: "caso"
    }
  ],
  32: [
    {
      type: "single",
      prompt: "Una empresa quiere visibilidad de adopción, incumplimientos y backlog de ideas ciudadanas en Power Platform. ¿Qué iniciativa cubre mejor ese objetivo?",
      options: [
      "CoE Starter Kit",
      "Solo Power BI Desktop local",
      "Azure Front Door",
      "Plugin Registration Tool"
      ],
      answer: [0],
      explanation: "CoE Starter Kit incorpora dashboards, governance, compliance e innovation backlog para administrar la plataforma a escala. Las demás opciones son herramientas puntuales que no proveen ese marco operativo."
    },
    {
      type: "single",
      prompt: "Quieres aplicar límites de compartición y recomendaciones automáticas sobre el estado de los recursos. ¿Qué capacidad nativa de administración debes evaluar?",
      options: [
      "Managed Environments",
      "Quick Find Views",
      "Business Process Flows",
      "Portals Web API"
      ],
      answer: [0],
      explanation: "Managed Environments ofrece Advisor, límites de compartición y capacidades orientadas a gobierno operacional. Las otras opciones no administran ambientes ni políticas a escala."
    },
    {
      type: "multi",
      prompt: "Debes administrar tenant settings y políticas entre muchos ambientes desde automatización. ¿Qué DOS herramientas encajan mejor?",
      options: [
      "Power Platform Admin APIs",
      "Cmdlets de PowerShell para Power Platform",
      "Solo editar formularios manualmente",
      "Customer Voice templates"
      ],
      answer: [0, 1],
      explanation: "Admin APIs y cmdlets permiten automatizar gobierno, inventario y configuración multi-ambiente. Editar manualmente formularios o usar templates de encuestas no resuelve administración de tenant."
    },
    {
      type: "single",
      prompt: "El equipo quiere acelerar pipelines y buenas prácticas de ALM reutilizando un marco preparado para Power Platform. ¿Qué componente del ecosistema CoE es más relevante?",
      options: [
      "CoE ALM Accelerator",
      "Power BI Goals",
      "Azure Bastion",
      "Dataverse Search"
      ],
      answer: [0],
      explanation: "ALM Accelerator ayuda a estructurar promoción de soluciones y flujos de trabajo DevOps sobre Power Platform. Las demás opciones no están diseñadas específicamente para ese propósito."
    },
    {
      type: "single",
      prompt: "La organización desea crear ambientes de forma repetible desde infraestructura declarativa. ¿Qué enfoque es el más alineado?",
      options: [
      "Terraform o Bicep apoyados en APIs de Power Platform",
      "Crear ambientes solo desde el portal manualmente",
      "Clonar la carpeta site del proyecto",
      "Usar Excel para llevar control de ambientes"
      ],
      answer: [0],
      explanation: "La infraestructura declarativa reduce deriva y soporta escalado de administración. El aprovisionamiento manual o el control en hojas de cálculo no ofrece la misma confiabilidad ni auditabilidad."
    },
    {
      type: "single",
      prompt: "Al instalar el CoE Starter Kit en un tenant de 2,000 usuarios, el flujo 'Admin | Sync Template v4' tarda varias horas en su primera ejecución. ¿Qué paquete del CoE contiene este flujo y por qué es obligatorio instalarlo primero?",
      options: [
      "Core Components, porque genera el inventario del que dependen los demás paquetes",
      "Nurture Components, porque gestiona el training path de los makers",
      "Innovation Backlog, porque prioriza ideas de automatización",
      "Governance Components, porque ejecuta el Compliance Process"
      ],
      answer: [0],
      explanation: "Core Components crea el inventario de apps, flujos, conectores y makers mediante el flujo de sincronización, y es dependencia obligatoria de Governance, Nurture e Innovation Backlog. Los otros paquetes se instalan después y dependen de que el inventario ya exista."
    },
    {
      type: "single",
      prompt: "Una app sin owner ha fallado el Compliance Process después de múltiples notificaciones sin respuesta. El administrador decide desactivarla temporalmente hasta que alguien reclame su propiedad. ¿Qué proceso del CoE Starter Kit está aplicando?",
      options: [
      "App Quarantine",
      "Maker Assessment",
      "Environment Request Process",
      "Power BI CoE Dashboard"
      ],
      answer: [0],
      explanation: "App Quarantine desactiva apps que no superan el proceso de compliance tras múltiples notificaciones sin respuesta del owner, evitando la acumulación indefinida de apps abandonadas. Las otras opciones son procesos distintos: evaluación de conocimiento del maker, solicitud de nuevos ambientes y visualización de datos respectivamente."
    },
    {
      type: "multi",
      prompt: "El CIO quiere reducir el shadow IT fomentando una comunidad activa de makers y dando visibilidad temprana de ideas de automatización antes de que cada área construya su propia solución. ¿Qué DOS componentes del CoE Starter Kit apoyan directamente ese objetivo?",
      options: [
      "Nurture Components, con el App Catalog para que los makers descubran soluciones existentes",
      "Innovation Backlog, con scoring de impacto vs esfuerzo para priorizar ideas propuestas",
      "Core Components, porque solo sincroniza el inventario técnico",
      "Governance Components, porque solo ejecuta el Compliance Process de apps sin uso"
      ],
      answer: [0, 1],
      explanation: "El App Catalog de Nurture Components permite a los makers descubrir apps existentes antes de construir algo nuevo, y el Innovation Backlog formaliza y prioriza las ideas propuestas. Core y Governance Components cumplen roles de inventario y cumplimiento, no de comunidad o priorización de ideas."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Multinacional): el primer sync del CoE reveló 1,200 apps cuando el IT esperaba 200. ¿Qué paquete del CoE Starter Kit produjo ese inventario inicial?",
      options: [
      "Core Components",
      "Nurture Components",
      "Innovation Backlog",
      "Power BI CoE Dashboard únicamente, sin instalar ningún paquete"
      ],
      answer: [0],
      explanation: "Core Components es el paquete que sincroniza y registra apps, flujos, conectores y makers del tenant; es lo que produjo el inventario real de 1,200 apps frente a las 200 esperadas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Multinacional): 340 apps sin uso fueron archivadas sin que un administrador tuviera que revisarlas una por una. ¿Qué proceso del CoE logró esto?",
      options: [
      "Compliance Process, contactando automáticamente a los owners",
      "Maker Assessment, evaluando el nivel técnico de cada maker",
      "Environment Request Process, aprobando nuevos ambientes",
      "El Power BI CoE Dashboard, que solo visualiza datos"
      ],
      answer: [0],
      explanation: "El Compliance Process contacta automáticamente a los owners de apps sin uso y, tras notificaciones sin respuesta, las marca para archivado, convirtiendo una revisión manual de cientos de apps en un flujo automatizado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Multinacional): antes de la solución, aparecían apps en producción con datos de clientes en SharePoint externo sin que nadie las aprobara. ¿Qué gap describe mejor este problema?",
      options: [
      "Falta de visibilidad y gobernanza sobre el inventario real del tenant",
      "Un error de licenciamiento de Power BI",
      "Una configuración incorrecta de Business Process Flow",
      "Falta de plantillas de Power Pages"
      ],
      answer: [0],
      explanation: "El problema central era la ausencia de visibilidad: sin inventario ni gobernanza, apps con datos sensibles se publicaban sin control ni aprobación. Las otras opciones son componentes puntuales que no explican el gap organizacional.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Multinacional): los requests de nuevos ambientes pasaron de tardar semanas a procesarse en menos de 2 días. ¿Qué componente del CoE formalizó y aceleró ese proceso?",
      options: [
      "Environment Request Process con aprobación y provisioning automatizado",
      "El Compliance Process de apps sin uso",
      "El Maker Assessment de nivel de conocimiento",
      "El App Catalog de Nurture Components"
      ],
      answer: [0],
      explanation: "El Environment Request Process reemplaza el ticket informal a IT por un formulario con aprobación del arquitecto y ejecución automática del script de Landing Zone, reduciendo drásticamente el tiempo de espera.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Multinacional): ¿cuáles DOS resultados reflejan directamente el impacto de instalar el CoE Starter Kit en este tenant?",
      options: [
      "Reducción de apps sin owner de 600 a 12",
      "El CIO ahora revisa el CoE Dashboard como primer reporte en su reunión mensual de IT",
      "Eliminación total de la necesidad de crear nuevos ambientes",
      "Migración completa del tenant a un proveedor de nube distinto"
      ],
      answer: [0, 1],
      explanation: "El caso reporta explícitamente la caída de apps sin owner y que el CoE Dashboard se volvió el reporte de referencia del CIO. No se elimina la creación de ambientes ni se menciona ninguna migración de proveedor.",
      appliesTo: "caso"
    }
  ],
  33: [
    {
      type: "single",
      prompt: "Quieres una estrategia de ambientes donde desarrollo individual no contamine el ambiente compartido de integración. ¿Qué combinación es la más sana?",
      options: [
      "Usar solo el Default environment para todo",
      "Developer environments para trabajo individual y Sandbox para integración",
      "Trial environments como base permanente de producción",
      "Production para pruebas de makers"
      ],
      answer: [1],
      explanation: "Developer environments aíslan experimentación individual, mientras Sandbox soporta integración controlada. El Default no debe absorber todo y Trial o Production no son el espacio correcto para ese ciclo."
    },
    {
      type: "single",
      prompt: "Una empresa europea procesa datos personales sensibles y debe respetar residencia de datos y GDPR. ¿Qué criterio debe pesar más al ubicar ambientes?",
      options: [
      "La región con el logo más atractivo",
      "La geografía de datos y requisitos regulatorios aplicables",
      "La preferencia del consultor externo",
      "El huso horario del equipo de marketing solamente"
      ],
      answer: [1],
      explanation: "La residencia de datos y cumplimiento regulatorio condicionan dónde deben vivir los ambientes y sus backups. La estética o preferencias individuales no pueden prevalecer sobre obligaciones legales."
    },
    {
      type: "multi",
      prompt: "Una solución debe operar entre dos tenants corporativos. ¿Qué DOS enfoques pueden ser válidos según el caso?",
      options: [
      "Guest users cuando el acceso debe conservar identidad individual",
      "Service accounts controladas para integraciones no interactivas",
      "Compartir credenciales personales por correo",
      "Desactivar auditoría para simplificar el acceso"
      ],
      answer: [0, 1],
      explanation: "Guest users permiten colaboración con identidad trazable y service accounts sirven para procesos automatizados bien gobernados. Compartir credenciales o desactivar auditoría introduce riesgos de seguridad y cumplimiento."
    },
    {
      type: "single",
      prompt: "Un organismo público exige controles regulatorios especiales que superan la oferta comercial estándar. ¿Qué tipo de nube deberías evaluar?",
      options: [
      "Sovereign clouds como GCC, GCC High o DoD según el requisito",
      "Solo el ambiente Default comercial",
      "Cualquier trial environment",
      "SharePoint Online sin Power Platform"
      ],
      answer: [0],
      explanation: "Las sovereign clouds existen precisamente para cubrir exigencias regulatorias y operativas particulares del sector público. Un tenant comercial estándar puede no cumplir esos requerimientos."
    },
    {
      type: "single",
      prompt: "¿Qué práctica completa mejor una estrategia multi-geo de ambientes?",
      options: [
      "No definir restore porque ya existe alta disponibilidad",
      "Diseñar backup y restore por región con responsabilidades claras",
      "Depender solo de exportaciones manuales ocasionales",
      "Mover producción entre geografías cada semana"
      ],
      answer: [1],
      explanation: "En escenarios multi-geo también debes planear continuidad y recuperación por región. Confiar solo en procesos manuales o en HA sin plan de restore deja huecos de resiliencia."
    },
    {
      type: "single",
      prompt: "Un tenant corporativo centraliza las soluciones base, el CoE, los pipelines y las DLP Policies corporativas, mientras los tenants de las subsidiarias heredan esas políticas pero mantienen autonomía sobre sus apps locales. ¿Qué patrón de arquitectura describe este escenario?",
      options: [
      "Hub-and-Spoke environment model",
      "Sovereign cloud dedicado",
      "Satellite Makers sin gobernanza",
      "Cross-tenant connectors nativos de Dataverse"
      ],
      answer: [0],
      explanation: "El modelo Hub-and-Spoke centraliza componentes compartidos en el tenant hub mientras los spokes (subsidiarias) heredan políticas pero conservan autonomía local. Los conectores de Dataverse no cruzan tenants de forma nativa, y las otras opciones no describen esta relación centro-periferia."
    },
    {
      type: "multi",
      prompt: "Vas a habilitar Managed Environments en el ambiente de PRODUCCIÓN de un sistema crítico con datos sensibles. ¿Qué DOS capacidades deberías configurar para reforzar la gobernanza de ese ambiente?",
      options: [
      "Sharing limits para restringir a cuántas personas se puede compartir una app",
      "IP Firewall para restringir el acceso por red corporativa",
      "Desactivar el Solution Checker para acelerar las importaciones",
      "Eliminar el Weekly Digest porque genera ruido en el correo del admin"
      ],
      answer: [0, 1],
      explanation: "Sharing limits e IP Firewall son capacidades de Managed Environments que refuerzan la gobernanza en producción. Desactivar el Solution Checker o eliminar el Weekly Digest reduce el control justo en el ambiente donde más se necesita."
    },
    {
      type: "single",
      prompt: "Un flujo del tenant corporativo necesita acceder a datos de Dataverse que residen en el tenant de una subsidiaria. El equipo intenta usar un conector nativo de Dataverse directamente entre ambos tenants y falla. ¿Cuál es la causa y la solución correcta?",
      options: [
      "Los conectores de Dataverse no cruzan límites de tenant de forma nativa; se debe usar APIM como intermediario con credenciales propias en cada tenant",
      "El problema es que no se configuró un Landing Zone en el tenant subsidiaria",
      "El problema es que faltó activar Customer-Managed Keys en el tenant hub",
      "El problema es que el conector de Dataverse requiere Managed Environments activado en ambos tenants"
      ],
      answer: [0],
      explanation: "Los conectores nativos de Dataverse no cruzan límites de tenant; la integración cross-tenant requiere un intermediario como Azure API Management, donde el flujo en el tenant A llama a una API que a su vez accede al tenant B con sus propias credenciales. Landing Zone, CMK y Managed Environments no resuelven esta limitación de plataforma."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo empresarial LATAM/España): los datos de clientes españoles residían en datacenters de US porque el tenant único era de esa región. ¿Qué principio de arquitectura multi-geo se violó?",
      options: [
      "Residencia de datos y cumplimiento regulatorio según la geografía del cliente",
      "El uso de Hub-and-Spoke entre tenants",
      "La configuración de Sharing limits en Managed Environments",
      "El uso de guest users para colaboración cross-tenant"
      ],
      answer: [0],
      explanation: "El caso es un problema clásico de residencia de datos: los datos de ciudadanos europeos deben cumplir GDPR y, en general, residir en geografías compatibles con esa regulación, no en el datacenter que resultó ser el del tenant único preexistente.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo empresarial LATAM/España): la solución fue separar en 2 tenants (LATAM en Brazil South y EU en West Europe). ¿Qué obtuvo la empresa con Microsoft como parte de esa separación?",
      options: [
      "Un DPA (Data Processing Agreement) firmado para ambos tenants",
      "Una Landing Zone compartida entre ambos tenants",
      "Un solo CoE Starter Kit centralizado para los dos tenants",
      "La eliminación completa de la necesidad de cumplimiento regulatorio"
      ],
      answer: [0],
      explanation: "El caso indica explícitamente que Microsoft firmó un DPA para ambos tenants, formalizando el tratamiento de datos personales conforme a la regulación aplicable en cada región. No se comparte CoE ni Landing Zone entre tenants separados, y el cumplimiento regulatorio no desaparece, se gestiona.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo empresarial LATAM/España): tras separar los tenants, cada uno mantiene su propio CoE pero con sincronización de políticas corporativas. ¿Qué patrón de gobernanza describe mejor esta relación entre tenants?",
      options: [
      "Cada tenant es autónomo en su CoE local, alineado a un conjunto de políticas corporativas comunes",
      "Un tenant controla completamente al otro sin autonomía local",
      "Los tenants comparten un único ambiente de producción",
      "No existe ninguna coordinación entre los CoE de cada tenant"
      ],
      answer: [0],
      explanation: "El caso describe CoE independientes por tenant pero con sincronización de políticas corporativas, es decir, autonomía operativa local dentro de un marco de gobernanza común, no control unilateral ni ausencia total de coordinación.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo empresarial LATAM/España): la multa de la AEPD fue de €50,000 por incumplimiento de GDPR. ¿Qué rol es responsable de anticipar este tipo de riesgo regulatorio en la arquitectura de ambientes?",
      options: [
      "El DPO (Data Protection Officer), en conjunto con el arquitecto de la plataforma",
      "Únicamente el equipo de marketing",
      "Únicamente el proveedor de licenciamiento",
      "Ningún rol específico; es responsabilidad exclusiva de Microsoft"
      ],
      answer: [0],
      explanation: "El caso menciona explícitamente al DPO recibiendo la multa; el diseño de dónde residen los datos y cómo se cumple la regulación es una responsabilidad conjunta entre el DPO y el arquitecto que decide la topología de tenants y ambientes.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Grupo empresarial LATAM/España): ¿cuáles DOS acciones reflejan directamente la solución implementada tras la multa?",
      options: [
      "Separación en tenants LATAM (Brazil South) y EU (West Europe) según residencia de datos",
      "Integración entre los tenants vía Azure Service Bus",
      "Migración completa de todo el grupo a un solo tenant global sin distinción geográfica",
      "Eliminación de todo el histórico de datos de clientes españoles"
      ],
      answer: [0, 1],
      explanation: "El caso reporta la separación en dos tenants por región y la integración entre ellos vía Azure Service Bus. No se consolidó todo en un tenant único (eso repetiría el problema original) ni se eliminó el histórico de datos.",
      appliesTo: "caso"
    }
  ],
  34: [
    {
      type: "single",
      prompt: "Una solución debe ingerir millones de eventos de telemetría por minuto desde dispositivos IoT y analizarlos después. ¿Qué servicio del stack Azure Integration Services encaja mejor?",
      options: [
      "Event Hub",
      "Key Vault",
      "Power Pages",
      "Azure Boards"
      ],
      answer: [0],
      explanation: "Event Hub está diseñado para ingestión de alta velocidad y gran volumen de eventos. Key Vault guarda secretos y Power Pages o Boards no son plataformas de streaming de telemetría."
    },
    {
      type: "single",
      prompt: "Dos ERPs emiten mensajes con estructuras distintas y quieres transformarlos a un formato empresarial común antes de integrarlos con Power Platform. ¿Qué patrón aplica mejor?",
      options: [
      "Canonical Data Model apoyado por Message Translator",
      "Hardcodear un formato diferente en cada flujo",
      "Guardar cada mensaje como imagen",
      "Mover la transformación al navegador del usuario"
      ],
      answer: [0],
      explanation: "Un modelo canónico reduce acoplamiento entre productores y consumidores, y Message Translator adapta cada formato fuente. Hardcodear variantes por flujo multiplica mantenimiento y fragilidad."
    },
    {
      type: "multi",
      prompt: "Estás definiendo la arquitectura enterprise de integración alrededor de Power Platform. ¿Qué DOS afirmaciones son correctas?",
      options: [
      "Azure API Management ayuda a centralizar consumo y gobierno de APIs externas",
      "Azure Data Factory suele ser más apropiado que Power Automate para ETL pesado y orquestación de datos analíticos",
      "Power Automate debe sustituir cualquier microservicio existente",
      "Event Grid es la mejor opción para almacenar secretos"
      ],
      answer: [0, 1],
      explanation: "APIM y Data Factory cumplen roles específicos en gobierno de APIs y movimiento de datos a escala. Power Automate no reemplaza todo el ecosistema y Event Grid no es un almacén de secretos."
    },
    {
      type: "single",
      prompt: "Quieres usar Power Platform como frontend de negocio y delegar servicios especializados a componentes escalables en Azure. ¿Qué combinación es coherente con ese objetivo?",
      options: [
      "Microservicios en Azure Container Apps expuestos por APIs bien gobernadas",
      "Toda lógica distribuida en macros de Excel locales",
      "Un único plugin gigante para todos los dominios externos",
      "Deshabilitar cualquier capa intermedia"
      ],
      answer: [0],
      explanation: "Container Apps permite empaquetar microservicios modernos, mientras Power Platform sigue enfocada en experiencia y procesos de negocio. Centralizar todo en un plugin monolítico o en macros locales va contra el desacoplamiento buscado."
    },
    {
      type: "single",
      prompt: "Un mensaje entrante debe distribuirse a distintos destinatarios según contenido y luego combinar respuestas parciales en una sola respuesta de negocio. ¿Qué combinación de patrones describe mejor el caso?",
      options: [
      "Message Router y Aggregator",
      "Singleton y Factory",
      "Observer y Decorator visual",
      "Waterfall y Scrum"
      ],
      answer: [0],
      explanation: "Message Router decide el destino correcto y Aggregator recompone una vista unificada desde varias respuestas. Los otros patrones o marcos no modelan ese flujo de integración enterprise."
    },
    {
      type: "single",
      prompt: "Un proceso de negocio requiere que los eventos de un mismo pedido (creado, actualizado, cancelado) se procesen en orden estricto por el mismo consumidor, evitando que lleguen desordenados por procesamiento concurrente. ¿Qué funcionalidad de Azure Service Bus resuelve este requisito?",
      options: [
      "Message Session con una clave de sesión (SessionId) por pedido",
      "Dead Letter Queue configurada con mayor capacidad",
      "Topics con múltiples Subscriptions",
      "Event Grid con filtrado por tipo de evento"
      ],
      answer: [0],
      explanation: "Message Session garantiza el procesamiento ordenado (FIFO) de mensajes relacionados agrupados por una clave de sesión; sin sessions, Service Bus distribuye mensajes a consumidores concurrentes sin garantía de orden. La DLQ gestiona mensajes fallidos, los Topics distribuyen a múltiples suscriptores, y Event Grid es un servicio de enrutamiento de eventos distinto."
    },
    {
      type: "single",
      prompt: "Un proceso batch debe esperar hasta 5 días una aprobación humana antes de continuar con el siguiente paso, manteniendo el estado de la orquestación sin perder contexto durante ese tiempo. ¿Qué patrón de Azure Durable Functions aplica?",
      options: [
      "Human Interaction",
      "Fan-out/Fan-in",
      "Function Chaining",
      "Monitor"
      ],
      answer: [0],
      explanation: "El patrón Human Interaction permite que la orquestación espere una aprobación humana durante días manteniendo el estado persistido en Azure Storage. Fan-out/Fan-in paraleliza trabajo y consolida resultados, Function Chaining encadena pasos secuenciales, y Monitor hace polling hasta que se cumpla una condición; ninguno modela espera de aprobación humana."
    },
    {
      type: "multi",
      prompt: "Tu organización necesita intercambiar documentos EDI (X12) con un socio de retail y transformar mensajes XML entre sistemas usando Logic Apps. ¿Qué DOS componentes de Azure Integration Services son necesarios para este escenario?",
      options: [
      "Integration Account, como repositorio de schemas XML, mapas XSLT y acuerdos EDI",
      "Azure Logic Apps, que soporta protocolos B2B como EDI y AS2 nativamente",
      "Azure Data Factory, como único mecanismo posible para leer archivos EDI",
      "Azure Event Grid, como almacén de certificados y partners de negocio"
      ],
      answer: [0, 1],
      explanation: "El Integration Account almacena los artefactos B2B (schemas, mapas XSLT, partners, acuerdos EDI) y se vincula a Logic Apps, que es el servicio diseñado para orquestar estos escenarios con protocolos B2B. Data Factory se orienta a ETL/ELT de datos y Event Grid enruta eventos; ninguno gestiona artefactos B2B."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo industrial): tenían 9 integraciones punto a punto (SAP→Dataverse, Salesforce→Dataverse, WMS→SAP) y una falla en SAP derribaba 3 integraciones simultáneamente. ¿Qué patrón de arquitectura resuelve directamente ese acoplamiento excesivo?",
      options: [
      "Un Integration Hub con Service Bus desacoplando los sistemas",
      "Duplicar cada integración punto a punto para redundancia",
      "Eliminar SAP del panorama de integración",
      "Aumentar el timeout de cada integración individual"
      ],
      answer: [0],
      explanation: "El Integration Hub con Service Bus como capa de desacoplamiento rompe la dependencia directa entre sistemas: una falla en SAP ya no derriba automáticamente las integraciones que dependen de él, porque los mensajes quedan en cola hasta que el sistema se recupera.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo industrial): APIM actúa como puerta de entrada del Integration Hub. ¿Cuál es su rol principal en esta arquitectura?",
      options: [
      "Punto de entrada único que expone y gobierna las APIs hacia los sistemas backend",
      "Almacenar los mensajes en cola de forma duradera",
      "Ejecutar la lógica de transformación EDI/B2B",
      "Reemplazar completamente la necesidad de Service Bus"
      ],
      answer: [0],
      explanation: "Azure API Management actúa como gateway: expone, securiza y gobierna el acceso a las APIs del hub. El almacenamiento de mensajes en cola es responsabilidad de Service Bus, y la transformación B2B/EDI es de Logic Apps con Integration Account.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo industrial): el MTTR (Mean Time to Recover) de las integraciones bajó de 4 horas a 20 minutos tras la migración al hub centralizado. ¿Qué capacidad del nuevo diseño explica principalmente esta mejora?",
      options: [
      "Visibilidad completa de mensajes en tránsito desde Azure Monitor",
      "La eliminación total de la necesidad de monitoreo",
      "Que las 9 integraciones originales se mantuvieron sin cambios",
      "Que se dejó de usar Service Bus para simplificar la arquitectura"
      ],
      answer: [0],
      explanation: "El caso indica explícitamente que la visibilidad completa de mensajes en tránsito vía Azure Monitor permite identificar y resolver fallas mucho más rápido que con 9 integraciones aisladas sin monitoreo centralizado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Grupo industrial): Event Grid se usa para distribuir eventos a múltiples suscriptores dentro del hub. ¿Qué tipo de escenario justifica su uso frente a una integración punto a punto directa?",
      options: [
      "Cuando un mismo evento de negocio debe notificar a varios sistemas independientes sin acoplarlos entre sí",
      "Cuando solo existe un único consumidor posible para el evento",
      "Cuando se necesita procesamiento ordenado estricto tipo FIFO",
      "Cuando el requisito es transformar documentos EDI X12"
      ],
      answer: [0],
      explanation: "Event Grid está diseñado para el patrón publish-subscribe: un evento se distribuye a múltiples suscriptores sin que el emisor conozca ni dependa de ellos, exactamente el problema de las 9 integraciones rígidas del caso. El orden estricto es dominio de Message Sessions en Service Bus, y el EDI es de Logic Apps con Integration Account.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Grupo industrial): ¿cuáles DOS componentes conforman el Integration Hub que reemplazó las 9 integraciones punto a punto?",
      options: [
      "Azure API Management como puerta de entrada",
      "Azure Service Bus para desacoplar sistemas",
      "Un Excel compartido para trackear el estado de cada integración",
      "Eliminar por completo cualquier sistema de mensajería"
      ],
      answer: [0, 1],
      explanation: "El caso describe el hub como APIM (puerta de entrada) más Service Bus (desacoplamiento) más Logic Apps y Event Grid para casos específicos. Un Excel compartido o la ausencia de mensajería no son parte de la solución de integración enterprise.",
      appliesTo: "caso"
    }
  ],
  35: [
    {
      type: "single",
      prompt: "Necesitas llevar datos de Dataverse a un entorno analítico continuo sin construir ETL batch manual. ¿Qué capacidad debes priorizar?",
      options: [
      "Synapse Link for Dataverse",
      "Exportar CSV diarios desde una vista",
      "Copiar registros manualmente a Excel",
      "Plugins síncronos que escriban cada cambio en PDF"
      ],
      answer: [0],
      explanation: "Synapse Link replica datos de Dataverse hacia escenarios analíticos de forma continua y gobernada. Los métodos manuales o documentos no escalan ni soportan analítica moderna."
    },
    {
      type: "single",
      prompt: "Un equipo de BI quiere consultar grandes volúmenes en Fabric con experiencia casi en tiempo real y sin refrescos import tradicionales. ¿Qué modo de Power BI debe evaluar primero?",
      options: [
      "DirectLake",
      "Import siempre",
      "Solo DirectQuery a sistemas transaccionales",
      "Embedded workbook mode"
      ],
      answer: [0],
      explanation: "DirectLake aprovecha OneLake para rendimiento analítico con menor fricción que el modelo Import tradicional. DirectQuery puede depender más del origen y no siempre ofrece el mismo equilibrio para Fabric."
    },
    {
      type: "multi",
      prompt: "Estás definiendo una arquitectura Medallion en Fabric. ¿Qué DOS afirmaciones son correctas?",
      options: [
      "Bronze conserva datos crudos con mínima transformación",
      "Gold expone modelos refinados para consumo de negocio",
      "Silver debe contener solo imágenes y archivos binarios sin limpiar",
      "Gold es el mejor lugar para guardar eventos corruptos sin revisar"
      ],
      answer: [0, 1],
      explanation: "Bronze captura la materia prima y Gold entrega datos curados y listos para consumo. Silver sirve para estandarizar y enriquecer; usar Gold para datos sucios contradice el patrón."
    },
    {
      type: "single",
      prompt: "Tu arquitecto de datos pregunta cuándo elegir Lakehouse frente a Warehouse en Fabric. ¿Cuál respuesta es la más adecuada?",
      options: [
      "Lakehouse para datos variados y ciencia de datos; Warehouse para modelado relacional analítico y SQL governado",
      "Warehouse solo para guardar imágenes",
      "Lakehouse únicamente para formularios de Power Apps",
      "Ambos son idénticos y la elección no importa"
      ],
      answer: [0],
      explanation: "Lakehouse ofrece flexibilidad para datos semiestructurados y pipelines amplios, mientras Warehouse se orienta a consumo SQL estructurado. No son equivalentes ni se eligen al azar."
    },
    {
      type: "single",
      prompt: "Un responsable de arquitectura insiste en usar Dataverse tanto para transacciones como para toda la analítica histórica empresarial. ¿Cuál es la recomendación más sólida?",
      options: [
      "Mantener datos transaccionales en Dataverse y derivar analítica a Fabric/Synapse según el caso",
      "Mover toda la analítica a formularios de Model-Driven App",
      "Guardar los KPIs como columnas de texto en Dataverse",
      "Eliminar cualquier separación entre cargas OLTP y analíticas"
      ],
      answer: [0],
      explanation: "Separar cargas transaccionales y analíticas mejora rendimiento, costo y gobernanza. Sobrecargar Dataverse con toda la historia analítica degrada el sistema operacional y no aprovecha Fabric."
    },
    {
      type: "single",
      prompt: "Un Notebook en PySpark y un Warehouse en T-SQL necesitan consultar simultáneamente la misma tabla Delta sin duplicar los datos entre ellos. ¿Qué capa de almacenamiento de Microsoft Fabric permite esto?",
      options: [
      "OneLake",
      "Azure Synapse Link",
      "Semantic Model certificado",
      "Data Activator"
      ],
      answer: [0],
      explanation: "OneLake es la capa de almacenamiento unificada de Fabric donde todos los items (Lakehouses, Warehouses, semantic models) guardan sus datos, permitiendo que distintos motores lean la misma tabla Delta sin copiarla. Synapse Link exporta datos de Dataverse, el Semantic Model define medidas DAX, y Data Activator dispara alertas; ninguno es la capa de almacenamiento compartida."
    },
    {
      type: "single",
      prompt: "Un analista necesita auditar el estado exacto de una tabla del Gold layer tal como estaba antes de un cambio reciente, sin restaurar un backup completo. ¿Qué capacidad del formato Delta Lake permite esta consulta histórica?",
      options: [
      "Time travel, mediante el transaction log en `_delta_log/`",
      "DirectLake, mediante conexión directa de Power BI",
      "El área 'Files' del Lakehouse",
      "El Data Activator con reglas de alerta"
      ],
      answer: [0],
      explanation: "El transaction log de Delta Lake registra cada operación y permite consultar el estado histórico de una tabla con sintaxis como 'TIMESTAMP AS OF', sin necesidad de restaurar backups. DirectLake es un modo de conexión de Power BI, el área Files es zona de landing sin estructura Delta, y Data Activator gestiona alertas, no versionado de datos."
    },
    {
      type: "multi",
      prompt: "El gerente de operaciones quiere ser notificado automáticamente por Teams cuando el tiempo de resolución promedio de tickets supere las 4 horas, sin que el equipo de datos escriba código adicional. ¿Qué DOS afirmaciones sobre la solución con Microsoft Fabric son correctas?",
      options: [
      "Data Activator puede conectarse a streams de Event Hubs o tablas del Lakehouse y disparar la notificación sin código",
      "Es necesario definir la regla de alerta especificando la condición de negocio y la acción a ejecutar",
      "Solo Azure Functions puede implementar este tipo de alerta en Fabric",
      "El Gold layer debe eliminarse para que Data Activator funcione"
      ],
      answer: [0, 1],
      explanation: "Data Activator permite definir reglas de alerta sobre datos en tiempo real y disparar acciones (como notificaciones a Teams) sin escribir código, conectándose a streams o tablas del Lakehouse. Azure Functions no es requisito para esta capacidad, y el Gold layer no necesita eliminarse."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): el equipo de BI tardaba 3 días en producir el reporte mensual porque extraía manualmente de D365, SAP y WMS y consolidaba en Excel. ¿Qué componente de Fabric elimina la necesidad de esa extracción manual desde Dataverse?",
      options: [
      "Dataverse Link, exportando el CRM en tiempo real hacia Fabric",
      "El Semantic Model certificado únicamente",
      "El Data Activator con reglas de alerta",
      "Time travel sobre el Gold layer"
      ],
      answer: [0],
      explanation: "Dataverse Link (basado en Azure Synapse Link) exporta los datos de Dataverse hacia Fabric en tiempo casi real sin scripts de extracción manual, resolviendo exactamente el cuello de botella de tener que sacar datos de D365 a mano cada mes.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): SAP y el WMS se sincronizan al Bronze layer mediante ADF (Azure Data Factory). ¿Qué rol cumple específicamente la capa Bronze en la arquitectura Medallion de este caso?",
      options: [
      "Almacenar los datos crudos tal como llegan de las fuentes, sin transformar",
      "Contener únicamente los KPIs finales listos para Power BI",
      "Reemplazar la necesidad de un Warehouse en T-SQL",
      "Servir como capa de alertas para el gerente de operaciones"
      ],
      answer: [0],
      explanation: "Bronze es la capa de ingesta cruda en el patrón Medallion: los datos de SAP y WMS llegan sin transformar, y son los Notebooks Silver/Gold los que aplican limpieza y modelado hasta llegar a los KPIs finales.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): tras la solución, el reporte mensual pasó de tardar 3 días a estar disponible el día 1 del mes. ¿Qué capacidad de Fabric permite que Power BI lea datos actualizados sin un proceso de importación tradicional?",
      options: [
      "DirectLake",
      "El área 'Files' del Lakehouse",
      "Un refresh programado cada 24 horas en Power BI Desktop",
      "Time travel sobre el transaction log"
      ],
      answer: [0],
      explanation: "DirectLake permite que Power BI consulte directamente las tablas Delta de OneLake sin necesidad de importar ni duplicar los datos, lo que explica que el reporte esté listo casi de inmediato en vez de esperar un ciclo de importación.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Retailer): las decisiones de reabastecimiento pasaron de basarse en datos de hace 1 semana a datos del día anterior. ¿Qué principio arquitectónico del caso explica esta mejora en frescura de datos?",
      options: [
      "Fabric Lakehouse como single source of truth con sincronización cercana al tiempo real desde las 3 fuentes",
      "Mover todo el reporting de vuelta a Excel para mayor control manual",
      "Eliminar el WMS del panorama de datos",
      "Duplicar manualmente los datos cada semana en un nuevo Excel"
      ],
      answer: [0],
      explanation: "Al centralizar D365, SAP y WMS en un Lakehouse como fuente única de verdad con sincronización frecuente (Dataverse Link en tiempo real, ADF para SAP/WMS), los datos disponibles para decisiones dejan de estar desactualizados por semanas.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Retailer): ¿cuáles DOS componentes de Fabric explican directamente que el reporte mensual ya no dependa de consolidación manual en Excel?",
      options: [
      "Dataverse Link para la ingesta de D365 en tiempo real",
      "ADF sincronizando SAP y WMS hacia el Bronze layer",
      "Un Excel compartido entre las 50 tiendas para centralizar datos",
      "Eliminar completamente el uso de Power BI"
      ],
      answer: [0, 1],
      explanation: "El caso describe Dataverse Link para D365 y ADF para SAP/WMS como los mecanismos de ingesta automatizada que reemplazan la extracción y consolidación manual en Excel. Power BI se mantiene como herramienta de consumo vía DirectLake, no se elimina.",
      appliesTo: "caso"
    }
  ],
  36: [
    {
      type: "single",
      prompt: "Quieres exigir MFA y bloquear acceso a makers desde dispositivos no conformes. ¿Qué control debes usar primero?",
      options: [
      "Conditional Access Policies en Microsoft Entra ID",
      "Quick Find indexing",
      "Business Rules en Dataverse",
      "Tema oscuro obligatorio"
      ],
      answer: [0],
      explanation: "Conditional Access aplica requisitos contextuales como MFA, ubicación y conformidad del dispositivo. Los otros elementos no controlan acceso corporativo a la plataforma."
    },
    {
      type: "single",
      prompt: "La organización quiere que la clave de cifrado del entorno de Dataverse esté bajo su propio control para cumplir regulación estricta. ¿Qué capacidad debes evaluar?",
      options: [
      "Customer Managed Keys",
      "Knowledge Base",
      "Power Fx variables",
      "Canvas responsive layout"
      ],
      answer: [0],
      explanation: "Customer Managed Keys permite a la organización controlar el ciclo de la clave criptográfica usada por la plataforma. Las otras opciones no inciden en gobierno criptográfico."
    },
    {
      type: "multi",
      prompt: "Debes fortalecer cumplimiento GDPR sobre datos en Power Platform. ¿Qué DOS prácticas son esenciales?",
      options: [
      "Definir procesos para right to erasure cuando aplique",
      "Gestionar auditoría y retención de datos conforme a política",
      "Compartir exportaciones personales por correo para revisión",
      "Desactivar cualquier logging para reducir trabajo legal"
      ],
      answer: [0, 1],
      explanation: "GDPR exige atender derechos del titular y controlar retención y auditoría de forma trazable. Compartir datos por correo o eliminar logging sin criterio aumenta riesgo y pérdida de evidencia."
    },
    {
      type: "single",
      prompt: "El SOC quiere correlacionar actividad de Power Platform con otros eventos corporativos en su SIEM. ¿Qué integración aporta más valor?",
      options: [
      "Microsoft Sentinel",
      "Content Snippets",
      "Price Lists",
      "Power BI bookmarks"
      ],
      answer: [0],
      explanation: "Microsoft Sentinel centraliza análisis, alertas y correlación de seguridad a nivel enterprise. Las otras opciones no son plataformas SIEM ni de monitoreo de amenazas."
    },
    {
      type: "single",
      prompt: "Los administradores globales de Power Platform no deben mantener privilegios permanentes sin justificación. ¿Qué práctica complementa mejor Zero Trust?",
      options: [
      "Privileged Identity Management para acceso just-in-time",
      "Una cuenta compartida para todos los administradores",
      "Guardar roles admin en una hoja Excel",
      "Desactivar revisiones de acceso"
      ],
      answer: [0],
      explanation: "PIM reduce privilegio permanente y habilita elevación controlada y auditada. Las cuentas compartidas o controles manuales débiles van en contra de Zero Trust y de buenas prácticas de seguridad."
    },
    {
      type: "single",
      prompt: "Un CIO afirma que ningún usuario, ni siquiera un administrador, debería tener acceso permanente e implícito a producción solo por estar dentro de la red corporativa. ¿Qué modelo de seguridad describe este principio?",
      options: [
      "Zero Trust",
      "CASB tradicional",
      "Data Residency",
      "Fit-Gap Analysis"
      ],
      answer: [0],
      explanation: "Zero Trust se basa en 'nunca confiar, siempre verificar', exigiendo verificación explícita de identidad, dispositivo y mínimo privilegio independientemente de la ubicación de red. CASB es un control específico dentro de esa estrategia, Data Residency es un concepto de ubicación de datos, y Fit-Gap Analysis es una técnica de análisis de requerimientos, no un modelo de seguridad."
    },
    {
      type: "single",
      prompt: "Un reporte de Power BI clasificado como 'Confidencial' se configura para impedir su exportación a Excel desde redes externas, y esa restricción se conserva incluso si el archivo se copia fuera del reporte original. ¿Qué mecanismo de Microsoft Purview aplica en este caso?",
      options: [
      "Sensitivity Labels",
      "Compliance Manager",
      "eDiscovery",
      "Data Catalog"
      ],
      answer: [0],
      explanation: "Las Sensitivity Labels aplican clasificaciones de confidencialidad que 'siguen' al dato donde vaya, controlando quién puede exportarlo y a dónde. Compliance Manager evalúa cumplimiento normativo, eDiscovery busca contenido para procesos legales, y Data Catalog inventaria y clasifica fuentes de datos, sin aplicar restricciones de exportación persistentes."
    },
    {
      type: "multi",
      prompt: "El CISO pide una estrategia de defensa en profundidad contra la exfiltración de datos sensibles almacenados en Dataverse. ¿Qué DOS controles del Módulo 36 deben combinarse, dado que ningún control aislado es suficiente?",
      options: [
      "DLP Policies que bloqueen conectores capaces de enviar datos a servicios externos no aprobados",
      "Conditional Access que bloquee la descarga de datos desde dispositivos no gestionados",
      "Desactivar por completo la auditoría para reducir el volumen de logs",
      "Permitir sharing sin límites en Managed Environments para simplificar la colaboración"
      ],
      answer: [0, 1],
      explanation: "La prevención de exfiltración de datos requiere combinar múltiples capas: DLP Policies que restrinjan conectores no aprobados y Conditional Access que bloquee descargas desde dispositivos no gestionados, entre otros controles. Desactivar la auditoría o permitir sharing sin límites debilita la defensa en profundidad en lugar de reforzarla."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de salud): un ex-empleado descargó datos de 50,000 pacientes en su último día de trabajo y nadie lo detectó hasta 3 meses después. ¿Qué herramienta hubiera alertado en tiempo real ese patrón de descarga masiva?",
      options: [
      "Microsoft Sentinel con una regla de detección de descarga masiva",
      "Un Sensitivity Label aplicado solo después del incidente",
      "El CoE Starter Kit, para inventariar apps del tenant",
      "Un Business Process Flow en Dataverse"
      ],
      answer: [0],
      explanation: "Microsoft Sentinel, el SIEM de Microsoft, permite definir reglas de detección de anomalías como una descarga masiva e inusual de registros, generando una alerta en tiempo real en vez de descubrirse meses después. El CoE Starter Kit y un Business Process Flow no son herramientas de detección de seguridad.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de salud): la solución incluyó CMK (Customer-Managed Keys) para que los datos de pacientes fueran inaccesibles sin la clave corporativa. ¿Qué protege específicamente este control?",
      options: [
      "Que incluso Microsoft, sin la clave del cliente, no pueda acceder a los datos cifrados en reposo",
      "Que los usuarios no puedan compartir apps entre ambientes",
      "Que los flujos de Power Automate se ejecuten más rápido",
      "Que el Solution Checker bloquee importaciones inseguras"
      ],
      answer: [0],
      explanation: "Customer-Managed Keys da al cliente control exclusivo sobre la clave de cifrado de sus datos en reposo, de forma que ni siquiera el proveedor de la nube puede acceder a ellos sin esa clave — una capa adicional relevante para datos de salud altamente regulados.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de salud): PIM se implementó para el acceso a datos de producción, exigiendo aprobación previa. ¿Qué problema de seguridad previene directamente este control frente al escenario del ex-empleado?",
      options: [
      "El acceso permanente e implícito a datos sensibles sin necesidad de solicitarlo ni justificarlo cada vez",
      "La necesidad de clasificar los reportes de Power BI",
      "La velocidad de sincronización del CoE Starter Kit",
      "El costo de licenciamiento de Dataverse"
      ],
      answer: [0],
      explanation: "PIM (Privileged Identity Management) obliga a solicitar y justificar la elevación de privilegios de forma temporal y auditada, en vez de mantener acceso permanente a producción — exactamente el tipo de acceso sin control que permitió la descarga no detectada.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Empresa de salud): Purview clasifica automáticamente los datos de pacientes. ¿Qué beneficio aporta esta clasificación automática frente a depender de que cada maker etiquete manualmente sus datos?",
      options: [
      "Reduce el riesgo de que datos sensibles queden sin clasificar por error u omisión humana",
      "Elimina por completo la necesidad de Conditional Access",
      "Acelera la ejecución de los flujos de Power Automate",
      "Sustituye la necesidad de CMK"
      ],
      answer: [0],
      explanation: "La clasificación automática de Purview identifica y etiqueta datos sensibles (como información de pacientes) sin depender de que cada maker lo haga manualmente, cerrando un gap habitual donde datos críticos quedan sin proteger por descuido humano.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Empresa de salud): ¿cuáles DOS controles combinados permitieron que, en el simulacro post-implementación, una brecha similar se detectara en 4 minutos?",
      options: [
      "Sentinel con reglas de detección de descarga masiva en tiempo real",
      "PIM exigiendo aprobación para acceso a datos de producción",
      "Eliminar toda auditoría para simplificar el sistema",
      "Permitir acceso permanente a producción a todo el equipo de IT"
      ],
      answer: [0, 1],
      explanation: "El caso combina detección en tiempo real (Sentinel) con control de acceso privilegiado (PIM) como las capas que permitieron detectar y contener una brecha similar en minutos. Eliminar auditoría o dar acceso permanente son justo las prácticas que causaron el incidente original.",
      appliesTo: "caso"
    }
  ],
  37: [
    {
      type: "single",
      prompt: "Debes extraer campos de facturas escaneadas y convertirlos en datos estructurados para un flujo de aprobación. ¿Qué modelo de AI Builder es el más adecuado?",
      options: [
      "Document processing",
      "Object detection",
      "Prediction",
      "Relevance search"
      ],
      answer: [0],
      explanation: "Document processing está diseñado para leer formularios y documentos y devolver campos estructurados. Object detection analiza imágenes, Prediction estima resultados y Relevance search es una capacidad distinta de búsqueda."
    },
    {
      type: "single",
      prompt: "Un equipo quiere enriquecer un flujo con generación y resumen de texto usando modelos GPT de Azure OpenAI desde Power Platform. ¿Qué enfoque es el más realista?",
      options: [
      "Consumir Azure OpenAI mediante conector o integración gobernada",
      "Entrenar un plugin C# para reemplazar al modelo",
      "Usar Price Lists para generar texto",
      "Configurar un SLA en Customer Service"
      ],
      answer: [0],
      explanation: "Azure OpenAI se integra típicamente a través de conectores o servicios intermedios gobernados. Price Lists y SLA no generan lenguaje natural, y un plugin no sustituye al modelo fundacional."
    },
    {
      type: "multi",
      prompt: "La junta de ética revisa un caso de IA en Power Platform. ¿Qué DOS principios de Responsible AI deben reflejarse en la solución?",
      options: [
      "Transparencia sobre el uso y límites del modelo",
      "Supervisión humana y monitoreo del impacto",
      "Ocultar al usuario que una respuesta fue generada por IA",
      "Desactivar cualquier revisión porque la IA ya optimiza sola"
      ],
      answer: [0, 1],
      explanation: "Responsible AI exige claridad, supervisión y capacidad de corregir comportamientos no deseados. Ocultar el uso de IA o eliminar revisión humana debilita confianza y control del riesgo."
    },
    {
      type: "single",
      prompt: "Después de publicar un modelo de AI Builder, ¿qué práctica evita que la solución se deteriore silenciosamente con el tiempo?",
      options: [
      "Monitorear desempeño y revisar el ciclo de vida del modelo",
      "Asumir que el modelo nunca cambia una vez publicado",
      "Mover todas las decisiones críticas a un color de interfaz",
      "Eliminar el dataset de entrenamiento inmediatamente"
      ],
      answer: [0],
      explanation: "Los modelos necesitan seguimiento para detectar drift, baja precisión o cambios en datos de negocio. Publicar sin monitorizar deja a la organización ciega ante degradaciones de calidad."
    },
    {
      type: "single",
      prompt: "Tu caso requiere un modelo predictivo muy especializado entrenado fuera de AI Builder, pero quieres invocarlo desde procesos de negocio. ¿Qué integración es la más adecuada?",
      options: [
      "Azure Machine Learning invocado desde Power Automate u otra capa de integración",
      "Solo una regla de negocio en Dataverse",
      "Un Content Snippet en Power Pages",
      "Un forecast de Dynamics 365 Sales"
      ],
      answer: [0],
      explanation: "Azure Machine Learning permite hospedar modelos más complejos y luego exponerlos a flujos y apps. Las demás opciones no ejecutan inferencia avanzada ni reemplazan un servicio de ML especializado."
    },
    {
      type: "single",
      prompt: "Una planta de manufactura quiere que una Canvas App, usando la cámara del teléfono, detecte productos defectuosos en la línea de producción y devuelva las coordenadas exactas donde se encuentra el defecto. ¿Qué tipo de modelo de AI Builder es el adecuado?",
      options: [
      "Object Detection",
      "Text Classification",
      "Prediction Model",
      "Document Processing"
      ],
      answer: [0],
      explanation: "Object Detection localiza objetos específicos dentro de imágenes devolviendo las coordenadas del bounding box y la confianza de detección, ideal para control de calidad visual. Text Classification opera sobre texto libre, Prediction Model estima resultados binarios o numéricos desde datos de Dataverse, y Document Processing extrae campos estructurados de documentos, no detecta objetos en imágenes."
    },
    {
      type: "single",
      prompt: "Un bot de Copilot Studio debe responder preguntas citando únicamente documentos corporativos verificados y evitar inventar información que no esté en esos documentos. ¿Qué técnica se debe aplicar?",
      options: [
      "Grounding mediante Knowledge Sources con recuperación de fragmentos relevantes (RAG)",
      "Aumentar la temperatura del modelo a 1.0 para mayor creatividad",
      "Eliminar el system prompt para dar más libertad al modelo",
      "Usar únicamente Object Detection sobre las imágenes de los documentos"
      ],
      answer: [0],
      explanation: "El Grounding, implementado típicamente con RAG, ancla las respuestas del LLM a documentos corporativos específicos configurados como Knowledge Sources, citando las fuentes y evitando alucinaciones. Aumentar la temperatura fomenta respuestas menos deterministas, eliminar el system prompt reduce el control sobre el comportamiento, y Object Detection no aplica a texto."
    },
    {
      type: "multi",
      prompt: "Un equipo debe decidir entre dos modelos de AI Builder: uno para clasificar el tipo de solicitud de soporte (Técnica/Administrativa/Comercial) y otro para estimar si una oportunidad de venta se ganará o perderá usando el historial de Dataverse. ¿Qué DOS afirmaciones son correctas sobre estos modelos?",
      options: [
      "Text Classification es el adecuado para categorizar el texto libre de la solicitud en categorías definidas por el usuario",
      "Prediction Model usa datos históricos de una tabla de Dataverse para predecir un resultado binario o numérico como 'ganada/perdida'",
      "Ambos modelos requieren obligatoriamente Azure OpenAI configurado como prerequisito",
      "Prediction Model solo puede ejecutarse en Canvas Apps y nunca en Power Automate"
      ],
      answer: [0, 1],
      explanation: "Text Classification categoriza texto libre en categorías de negocio definidas, y Prediction Model se entrena con historial de Dataverse para predecir resultados como ganar/perder una oportunidad. Ninguno requiere Azure OpenAI como prerequisito, y Prediction Model puede ejecutarse tanto en tiempo real desde Canvas App como en batch vía Power Automate."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de contabilidad): 5 personas tipeaban manualmente datos de 2,000 facturas mensuales con un error rate del 3%. ¿Qué tipo de modelo de AI Builder resuelve directamente la extracción de esos datos?",
      options: [
      "Document Processing (Document Processing Model / Invoice Processing)",
      "Object Detection",
      "Text Classification",
      "Prediction Model"
      ],
      answer: [0],
      explanation: "Document Processing (incluyendo el modelo prebuilt de Invoice Processing) está diseñado para extraer campos estructurados de documentos como facturas: proveedor, fecha, monto, líneas de detalle. Object Detection localiza objetos en imágenes, Text Classification categoriza texto libre, y Prediction Model estima resultados desde datos históricos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de contabilidad): las facturas con confianza menor al 85% se envían a revisión humana, mientras el resto se procesa automáticamente. ¿Qué principio de diseño de soluciones con IA refleja esta regla?",
      options: [
      "Human-in-the-loop basado en el score de confianza del modelo",
      "Automatizar el 100% de los casos sin excepción",
      "Ignorar el score de confianza y confiar siempre en el modelo",
      "Enviar todas las facturas a revisión manual sin excepción"
      ],
      answer: [0],
      explanation: "El patrón human-in-the-loop usa el score de confianza del modelo para decidir qué casos requieren revisión humana y cuáles pueden procesarse automáticamente, balanceando velocidad con control de calidad — ni automatización ciega ni revisión manual de todo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de contabilidad): tras el AI Builder, el flujo de Power Automate crea el registro directamente en D365 para las facturas que pasan el umbral de confianza. ¿Qué rol cumple Power Automate en esta arquitectura?",
      options: [
      "Orquestar el flujo end-to-end: invocar el modelo, evaluar el score y crear el registro en D365",
      "Entrenar el modelo de Document Processing",
      "Reemplazar la necesidad de AI Builder por completo",
      "Servir como la interfaz donde el usuario sube la factura físicamente"
      ],
      answer: [0],
      explanation: "Power Automate orquesta el proceso completo: recibe el documento, invoca el modelo de AI Builder, evalúa el resultado de confianza y, si supera el umbral, crea el registro en D365 automáticamente. El entrenamiento del modelo ocurre en AI Builder, no en el flujo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Firma de contabilidad): el error rate bajó de 3% a 0.3% y el ROI se logró en 18 meses. ¿Qué combinación de factores explica mejor esta mejora, según el caso?",
      options: [
      "Alta exactitud del modelo (95%) combinada con revisión humana solo en el 8% de casos de baja confianza",
      "Haber despedido a las 5 personas sin reubicarlas",
      "Haber eliminado por completo la revisión humana desde el primer día",
      "Un aumento en el precio del servicio de contabilidad"
      ],
      answer: [0],
      explanation: "El caso indica que el modelo alcanza 95% de exactitud y que solo el 8% de las facturas (las de baja confianza) requieren revisión humana, lo que explica la caída del error rate sin necesidad de eliminar por completo el control humano. Las 5 personas fueron reubicadas, no despedidas.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Firma de contabilidad): ¿cuáles DOS resultados de negocio reporta directamente el caso tras implementar AI Builder?",
      options: [
      "Las 5 personas que tipeaban facturas fueron reubicadas a trabajo de mayor valor",
      "El error rate bajó de 3% a 0.3%",
      "Se eliminó por completo la necesidad de D365",
      "El volumen de facturas mensuales se redujo a la mitad"
      ],
      answer: [0, 1],
      explanation: "El caso reporta explícitamente la reubicación del personal y la caída del error rate. D365 sigue siendo el destino de los registros creados automáticamente, y el volumen de facturas mensuales no cambia, solo cómo se procesan.",
      appliesTo: "caso"
    }
  ],
  38: [
    {
      type: "single",
      prompt: "En un programa enterprise, el cliente pregunta cuál es la diferencia principal entre Solution Architect y Project Manager. ¿Cuál respuesta es la más precisa?",
      options: [
      "El arquitecto define la solución técnica y sus trade-offs; el PM gestiona alcance, tiempo y coordinación del proyecto",
      "Ambos roles son idénticos y pueden usarse indistintamente",
      "El PM decide siempre el modelo de datos y el arquitecto solo agenda reuniones",
      "El arquitecto no interactúa con negocio"
      ],
      answer: [0],
      explanation: "El Solution Architect lidera decisiones de diseño y el PM gobierna ejecución del proyecto y sus restricciones. Son roles complementarios, no intercambiables ni aislados del negocio."
    },
    {
      type: "single",
      prompt: "Debes explicar al C-suite por qué elegiste Power Pages + Dataverse + Azure Integration Services en vez de un portal custom desde cero. ¿Qué artefacto ayuda más a estructurar esa conversación?",
      options: [
      "ADR con contexto, alternativas, decisión y consecuencias",
      "Solo una captura del backlog técnico",
      "Un listado de commits sin explicación",
      "Un tema de colores corporativos"
      ],
      answer: [0],
      explanation: "El ADR resume la decisión y sus trade-offs en un formato entendible y trazable para stakeholders ejecutivos. Las otras evidencias no conectan claramente la decisión con impacto y riesgo."
    },
    {
      type: "multi",
      prompt: "Estás organizando la gobernanza de responsabilidades de un proyecto Power Platform. ¿Qué DOS prácticas son correctas?",
      options: [
      "Definir un RACI para decisiones y entregables clave",
      "Adaptar el mensaje técnico según el stakeholder sea negocio o TI",
      "Asumir que todos entienden las mismas siglas y riesgos",
      "Evitar registrar cambios de alcance para ganar velocidad"
      ],
      answer: [0, 1],
      explanation: "RACI aclara ownership y la comunicación efectiva exige ajustar el nivel de detalle al público. Dar por hecho entendimiento común o ignorar cambios de alcance genera conflicto y retrabajo."
    },
    {
      type: "single",
      prompt: "El cliente quiere una estimación inicial de una implementación Power Platform cuando aún no hay historias detalladas. ¿Qué técnica suele ser útil en esta fase temprana?",
      options: [
      "T-shirt sizing o story points de alto nivel",
      "Solo contar líneas de código futuras",
      "Medir duración por intuición de una sola persona",
      "Esperar a producción para estimar"
      ],
      answer: [0],
      explanation: "En etapas tempranas convienen técnicas de estimación relativa y rangos, no falsas precisiones. Contar líneas de código o estimar sin contraste suele sesgar el plan."
    },
    {
      type: "single",
      prompt: "Tras el go-live de una solución crítica, ¿qué enfoque describe mejor la fase de hyper-care?",
      options: [
      "Desaparecer del proyecto para promover autonomía",
      "Monitoreo intensivo, soporte cercano y transición planificada a operaciones",
      "Congelar toda mejora y cerrar canales de comunicación",
      "Delegar incidentes al usuario final"
      ],
      answer: [1],
      explanation: "Hyper-care estabiliza la solución en producción y prepara un handoff responsable a operaciones. Abandonar temprano o cerrar feedback aumenta el riesgo de incidentes y baja adopción."
    },
    {
      type: "single",
      prompt: "Antes de proponer cualquier tecnología, el arquitecto conduce una sesión de 1 a 3 días con stakeholders de negocio y técnicos para entender el contexto, los procesos actuales y los puntos de dolor. ¿Qué actividad describe este comportamiento?",
      options: [
      "Discovery Workshop",
      "Change Request Process",
      "Velocity calibration",
      "Hyper-care"
      ],
      answer: [0],
      explanation: "El Discovery Workshop se ejecuta antes de proponer tecnología y produce el mapa AS-IS, requerimientos priorizados y el Risk Register inicial; un arquitecto que propone tecnología antes del Discovery está vendiendo, no diseñando. Las otras opciones ocurren en fases distintas del proyecto: gestión de cambios de scope, calibración de velocidad ágil y estabilización post go-live."
    },
    {
      type: "single",
      prompt: "El cliente reclama que un requerimiento no documentado 'debería estar incluido' en el proyecto, pero el equipo lo consideró fuera de alcance desde el inicio. ¿Qué sección del Statement of Work (SoW) previene este tipo de disputa?",
      options: [
      "La sección de exclusiones explícitas del scope",
      "El WBS a nivel de tarea",
      "La matriz RACI del proyecto",
      "El Risk Register"
      ],
      answer: [0],
      explanation: "La sección de exclusiones del SoW es tan importante como la de inclusiones, porque lo que no está explícitamente excluido el cliente asumirá que está incluido; documentarlo previene el 80% de las disputas de proyecto. El WBS estructura tareas, el RACI asigna responsabilidades, y el Risk Register gestiona riesgos, no el alcance contractual."
    },
    {
      type: "multi",
      prompt: "Durante el proyecto, el equipo detecta que se hardcodearon valores que deberían ser Environment Variables, y el cliente empieza a pedir funcionalidades nuevas sin pasar por ningún proceso formal. ¿Qué DOS prácticas del Módulo 38 deben aplicarse para gestionar ambas situaciones?",
      options: [
      "Registrar y cuantificar el Technical Debt para pagarlo en sprints dedicados antes de que se vuelva impagable",
      "Aplicar el Change Request Process, estimando el impacto y obteniendo aprobación escrita antes de iniciar el cambio",
      "Ignorar ambas situaciones porque 'son pequeños cambios' que no afectan el cronograma",
      "Asumir que el Technical Debt desaparece automáticamente al llegar a producción"
      ],
      answer: [0, 1],
      explanation: "El Technical Debt debe hacerse visible y cuantificado para pagarlo de forma planificada, y el Change Request Process formaliza cualquier solicitud de cambio de scope con estimación y aprobación previa. Ignorar los cambios como 'pequeños' es la frase más peligrosa en gestión de proyectos, y el Technical Debt no se resuelve solo."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Consultoría): un arquitecto presentó 40 slides de diagramas técnicos a un CFO, que interrumpió en el slide 5 preguntando cuánto costaba y cuándo lo vería funcionando. ¿Qué principio de comunicación ejecutiva se violó?",
      options: [
      "Abrir con negocio y ROI antes de entrar en detalle técnico",
      "Usar demasiados colores en los diagramas de arquitectura",
      "No incluir un Risk Register en la propuesta",
      "No haber hecho un Discovery Workshop previo"
      ],
      answer: [0],
      explanation: "El caso señala explícitamente que las primeras slides deben cubrir el problema de negocio y el ROI esperado, dejando el detalle técnico para un apéndice. El arquitecto invirtió el orden y perdió al CFO antes de llegar al valor de negocio.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Consultoría): tras reordenar sus propuestas (negocio/ROI primero, solución en lenguaje de negocio después, detalle técnico en apéndice), la tasa de cierre del arquitecto subió de 30% a 65%. ¿Qué lección de negocio ilustra este resultado?",
      options: [
      "La forma de comunicar una solución técnica a un ejecutivo afecta directamente el éxito comercial de la propuesta",
      "El contenido técnico de una propuesta no importa si el arquitecto es carismático",
      "Los CFOs nunca aprueban proyectos técnicos sin importar cómo se presenten",
      "Agregar más slides técnicas siempre mejora la tasa de cierre"
      ],
      answer: [0],
      explanation: "El caso es una demostración directa de que la estructura de la comunicación (negocio primero, técnica como apéndice) puede duplicar la tasa de cierre de propuestas, sin cambiar la solución técnica en sí.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Consultoría): en un proyecto D365, negocio exigió en UAT una aprobación adicional para descuentos que 'siempre se había pedido', pero no existía historia con criterio de aceptación, ni caso de prueba, ni mención en el diseño funcional. ¿Qué falta de práctica de gestión de proyectos explica este conflicto?",
      options: [
      "Falta de trazabilidad viva entre requerimiento, decisión, configuración, prueba y aprobación",
      "Falta de un Power BI Dashboard de gobernanza",
      "Falta de un Field Security Profile en Dataverse",
      "Falta de instalar el CoE Starter Kit"
      ],
      answer: [0],
      explanation: "El caso concluye que la consultoría funcional profesional consiste en mantener trazabilidad viva entre requerimiento, decisión, configuración, prueba y aprobación — no en escribir documentos largos. Sin esa trazabilidad, un reclamo de último momento no puede resolverse con evidencia.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Consultoría): el reclamo del cliente sobre la aprobación de descuentos surgió porque el requerimiento nunca quedó documentado formalmente con un criterio de aceptación claro. ¿Qué artefacto del Módulo 38 previene directamente este tipo de disputa de alcance?",
      options: [
      "Una historia de usuario con criterio de aceptación explícito, referenciada en el diseño funcional y su caso de prueba",
      "El Weekly Digest del CoE Starter Kit",
      "El Maker Assessment de Nurture Components",
      "El Data Activator de Microsoft Fabric"
      ],
      answer: [0],
      explanation: "Una historia de usuario bien escrita, con criterio de aceptación y trazabilidad hacia el diseño funcional y el caso de prueba, es exactamente el artefacto que hubiera evitado el reclamo, porque documenta explícitamente qué se acordó y qué no.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Consultoría): ¿cuáles DOS lecciones combinan ambos casos (la propuesta al CFO y el conflicto de UAT) sobre el rol de un arquitecto/consultor senior?",
      options: [
      "Comunicar en el lenguaje del interlocutor (negocio vs técnico) según a quién se dirige",
      "Mantener trazabilidad documental viva a lo largo de todo el ciclo de vida del requerimiento",
      "Priorizar siempre el detalle técnico exhaustivo sobre cualquier otra consideración",
      "Evitar documentar acuerdos para mantener flexibilidad con el cliente"
      ],
      answer: [0, 1],
      explanation: "Ambos casos ilustran habilidades blandas críticas de un arquitecto senior: adaptar la comunicación a la audiencia y mantener trazabilidad documental que sustente decisiones. Priorizar solo el detalle técnico o evitar documentar son justamente los errores que causaron ambos conflictos.",
      appliesTo: "caso"
    }
  ],
  39: [
    {
      type: "single",
      prompt: "Al analizar un caso de transformación digital con Power Platform, ¿qué secuencia metodológica ayuda más a obtener lecciones reutilizables?",
      options: [
      "Problema → solución → arquitectura → ROI → lecciones aprendidas",
      "Tecnología favorita → demo → presupuesto → problema",
      "Interfaz visual → colores → problema → soporte",
      "Comprar licencias → buscar un caso de uso después"
      ],
      answer: [0],
      explanation: "Empezar por el problema y terminar en resultados y lecciones mantiene la discusión orientada a valor. Invertir la secuencia hacia la tecnología conduce a decisiones menos justificadas."
    },
    {
      type: "single",
      prompt: "Detectas un programa donde cada departamento creó apps aisladas, sin modelo de datos común ni gobierno, y luego nadie sabe cuál es la fuente maestra. ¿Qué estás observando?",
      options: [
      "Un anti-patrón de implementación",
      "Una referencia ideal de arquitectura",
      "Un ejemplo de FinOps maduro",
      "Una práctica recomendada de ALM"
      ],
      answer: [0],
      explanation: "La proliferación sin gobierno ni modelo común es un anti-patrón clásico que genera silos y deuda operativa. Una arquitectura sana define ownership, integración y estándares desde el inicio."
    },
    {
      type: "multi",
      prompt: "En un programa de transformación, ¿qué DOS factores influyen directamente en el éxito sostenido además de la tecnología?",
      options: [
      "Gestión del cambio organizacional",
      "Métricas claras de adopción y valor",
      "Ocultar el impacto del proyecto a los usuarios",
      "Evitar un Center of Excellence para no formalizar nada"
      ],
      answer: [0, 1],
      explanation: "La adopción depende tanto de personas y procesos como de la solución técnica, por eso el change management y las métricas son esenciales. Ocultar cambios o eliminar gobierno frena la transformación."
    },
    {
      type: "single",
      prompt: "Un fabricante quiere modernizar gradualmente un sistema legacy de órdenes sin detener operaciones. ¿Qué estrategia suele ser más prudente?",
      options: [
      "Migración incremental por capacidades con integración controlada",
      "Apagar el legacy y reescribir todo en un fin de semana",
      "Esperar cinco años y no tocar nada",
      "Exportar los datos a PowerPoint cada mes"
      ],
      answer: [0],
      explanation: "La migración incremental reduce riesgo y permite aprender en cada etapa, especialmente en procesos críticos. Un corte big bang en sistemas complejos suele aumentar probabilidad de falla."
    },
    {
      type: "single",
      prompt: "¿Qué papel puede jugar un Center of Excellence en casos de transformación digital con Power Platform?",
      options: [
      "Actuar como motor de adopción, estándares y escalado controlado",
      "Eliminar toda innovación ciudadana",
      "Reemplazar a los usuarios de negocio en sus decisiones",
      "Evitar cualquier medición de valor"
      ],
      answer: [0],
      explanation: "Un CoE bien diseñado acelera adopción con guardrails, soporte y buenas prácticas compartidas. No busca bloquear la innovación, sino hacerla sostenible y medible."
    },
    {
      type: "single",
      prompt: "Un arquitecto quiere descubrir cómo se ejecuta realmente el proceso de aprobación de solicitudes de un cliente, en lugar de basarse en documentación que describe cómo 'debería' funcionar. ¿Qué herramienta nativa de Power Automate le permite reconstruir el proceso real a partir de los event logs?",
      options: [
      "Process Advisor",
      "AI Builder Prediction",
      "Copilot Studio Generative Answers",
      "CoE ALM Accelerator"
      ],
      answer: [0],
      explanation: "Process Advisor implementa Process Mining de forma nativa en Power Automate, generando un Process Map con variantes, cuellos de botella cuantificados y oportunidades de automatización a partir de event logs reales. Las otras opciones son capacidades de IA, generación conversacional y ALM, no de reconstrucción de procesos reales."
    },
    {
      type: "single",
      prompt: "Al modernizar un sistema legacy de Excel con macros VBA, el SoW establece un mínimo de 4 semanas donde el sistema antiguo y la nueva solución en Dataverse corren simultáneamente antes del cutover definitivo. ¿Qué principio de modernización de legacy está aplicando el arquitecto?",
      options: [
      "Ejecución en paralelo para validar consistencia de datos antes de apagar el sistema legacy",
      "Big bang cutover para minimizar el tiempo de transición",
      "Eliminar inmediatamente el sistema legacy para reducir costos de licencia",
      "Delegar la validación de datos exclusivamente al usuario final sin plan formal"
      ],
      answer: [0],
      explanation: "La estrategia más exitosa de Legacy Modernization es incremental, manteniendo el sistema legacy en paralelo durante semanas mientras se valida el nuevo sistema, reduciendo el riesgo de pérdida o inconsistencia de datos antes del cutover. Un corte abrupto (big bang) o apagar el legacy sin validación aumenta drásticamente el riesgo del proyecto."
    },
    {
      type: "multi",
      prompt: "Un banco procesa solicitudes de crédito con un analista que consulta manualmente un buró de crédito en un sistema legado sin API, y luego revisa documentos de ingresos adjuntos. ¿Qué DOS tecnologías de Hyperautomation permiten automatizar estas dos tareas específicas respectivamente?",
      options: [
      "Power Automate Desktop (RPA) para interactuar con el portal del buró sin API disponible",
      "AI Builder para extraer y validar los ingresos declarados desde los documentos adjuntos",
      "Power BI Embedded como único mecanismo de automatización de todo el proceso",
      "Azure Synapse Link como sustituto de la extracción de documentos"
      ],
      answer: [0, 1],
      explanation: "Power Automate Desktop (RPA) resuelve la interacción con sistemas legados sin API mediante scraping controlado, y AI Builder extrae y valida datos de documentos no estructurados como comprobantes de ingresos. Power BI Embedded es una herramienta de visualización y Synapse Link exporta datos de Dataverse a analítica, ninguno automatiza estas tareas operativas."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): 3 empleados se dedicaban solo a enviar recordatorios de renovación y procesar formularios en papel. ¿Qué canal digital reemplazó el formulario en papel en la solución implementada?",
      options: [
      "Power Pages, para que el asegurado renueve en línea",
      "Un flujo de Power Automate sin ninguna interfaz de usuario",
      "AI Builder, actuando como canal de autoservicio",
      "D365, usado directamente por el asegurado sin portal"
      ],
      answer: [0],
      explanation: "Power Pages provee el portal externo donde el asegurado puede renovar su póliza en línea, reemplazando el formulario físico. AI Builder solo interviene después, extrayendo datos si el formulario llega en PDF; D365 es el sistema interno que se actualiza, no el canal del asegurado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): Power Automate envía recordatorios 60/30/15 días antes del vencimiento. ¿Qué principio de automatización explica la mejora en la tasa de renovación (de 68% a 79%)?",
      options: [
      "Recordatorios personalizados y oportunos en momentos clave del ciclo de renovación",
      "Enviar un único recordatorio genérico el día del vencimiento",
      "Eliminar por completo los recordatorios para no molestar al cliente",
      "Delegar todos los recordatorios al equipo de ventas manualmente"
      ],
      answer: [0],
      explanation: "El caso indica que la mejora vino de recordatorios personalizados y oportunos (60/30/15 días antes), no de un único aviso genérico ni de depender de que el equipo humano recuerde contactar a cada cliente a tiempo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): si un asegurado envía su formulario de renovación como PDF escaneado en vez de usar el portal, ¿qué componente de la solución extrae los datos automáticamente?",
      options: [
      "AI Builder, mediante Document Processing",
      "Power Pages, procesando el PDF directamente sin AI Builder",
      "D365, leyendo el PDF de forma nativa",
      "El equipo de los 3 empleados, que sigue tipeando manualmente todos los PDF"
      ],
      answer: [0],
      explanation: "AI Builder extrae los datos estructurados del PDF mediante Document Processing, permitiendo que el flujo continúe automatizado incluso cuando el asegurado no usa el portal Power Pages, sin que un empleado tenga que tipear el contenido.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Aseguradora): el proceso quedó 85% automatizado y los 3 empleados fueron reubicados a ventas. ¿Qué principio de transformación digital ilustra esta decisión de reubicación en vez de despido?",
      options: [
      "La automatización libera capacidad humana para trabajo de mayor valor, no solo reduce costos",
      "La automatización siempre implica reducción de personal",
      "Los empleados reubicados dejaron de ser necesarios en la empresa",
      "El 15% restante del proceso no requiere ninguna intervención humana"
      ],
      answer: [0],
      explanation: "El caso destaca explícitamente que los empleados fueron reubicados a ventas (mayor valor), reflejando que la automatización bien implementada libera capacidad para tareas de mayor impacto en vez de simplemente eliminar puestos. El 15% restante son justamente los casos con excepciones que sí requieren intervención humana.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Aseguradora): ¿cuáles DOS componentes de la solución trabajan juntos para que 'solo los casos con excepciones lleguen a los empleados'?",
      options: [
      "AI Builder extrayendo datos y detectando confianza baja en formularios PDF",
      "D365 actualizando la póliza automáticamente cuando el proceso se completa sin excepciones",
      "Un Excel compartido donde los 3 empleados registran manualmente cada renovación",
      "Eliminar completamente D365 del proceso de renovación"
      ],
      answer: [0, 1],
      explanation: "AI Builder filtra los casos que requieren revisión humana por baja confianza, mientras D365 se actualiza automáticamente en los casos sin excepciones, dejando a los empleados solo los casos que realmente necesitan su intervención. El Excel manual es justamente lo que la solución elimina.",
      appliesTo: "caso"
    }
  ],
  40: [
    {
      type: "single",
      prompt: "Estás planificando tu preparación como Solution Architect y debes priorizar el dominio de mayor impacto profesional. ¿Cuál merece mayor foco inicial?",
      options: [
      "Solution Design",
      "Analytics",
      "User Interface Themes",
      "Dataverse Search tuning solamente"
      ],
      answer: [0],
      explanation: "Solution Design concentra buena parte del trabajo real del arquitecto y atraviesa muchos casos de estudio. Analytics también importa, pero no reemplaza el criterio de diseño integral."
    },
    {
      type: "single",
      prompt: "Durante un caso de estudio de arquitectura, ¿cuál es la mejor táctica inicial antes de proponer una solución?",
      options: [
      "Leer requisitos, restricciones y problemas actuales para identificar trade-offs",
      "Ir directo a las preguntas sin revisar el escenario",
      "Marcar siempre la opción más larga",
      "Responder según la experiencia personal sin mirar los datos del caso"
      ],
      answer: [0],
      explanation: "Los case studies premian la lectura cuidadosa del contexto, incluyendo requisitos explícitos y restricciones ocultas. Saltarse esa fase aumenta errores por asumir hechos que el caso no respalda."
    },
    {
      type: "multi",
      prompt: "¿Qué DOS prácticas ayudan a eliminar malas alternativas en decisiones de arquitectura?",
      options: [
      "Descartar opciones que violan un requisito explícito del escenario",
      "Comparar alternativas según seguridad, ALM, escalabilidad y gobernanza",
      "Elegir siempre la opción con más servicios Azure",
      "Asumir que la respuesta correcta evita cualquier compromiso arquitectónico"
      ],
      answer: [0, 1],
      explanation: "Las malas alternativas suelen fallar porque ignoran restricciones o sacrifican pilares clave del diseño. Más servicios no implica mejor respuesta, y en arquitectura casi siempre existen trade-offs reales."
    },
    {
      type: "single",
      prompt: "En un taller de arquitectura con varios casos y tiempo limitado, ¿qué estrategia de trabajo es más razonable?",
      options: [
      "Consumir la mitad de la sesión en la primera decisión difícil",
      "Mantener un ritmo controlado, marcar dudas y reservar tiempo para revisar",
      "Resolver al azar los primeros temas para ganar velocidad",
      "Leer solo las soluciones propuestas, no el escenario"
      ],
      answer: [1],
      explanation: "Gestionar el tiempo implica avanzar, marcar decisiones complejas y volver con margen al final. Quedarse atascado o decidir sin leer destruye precisión y reduce cobertura del análisis."
    },
    {
      type: "single",
      prompt: "Un developer con experiencia PL-400 pregunta qué cambia realmente al crecer hacia Solution Architect. ¿Cuál respuesta es la más precisa?",
      options: [
      "Arquitectura profundiza más en diseño integral, trade-offs y gobierno que en implementación puntual",
      "Arquitectura es solo una versión con más preguntas de sintaxis de plugins",
      "Arquitectura elimina por completo seguridad y ALM",
      "Arquitectura se domina memorizando comandos sin escenarios"
      ],
      answer: [0],
      explanation: "PL-400 se centra más en implementación técnica detallada, mientras el rol de Solution Architect exige visión integral. La diferencia está en el nivel de decisión, gobierno y análisis de escenario."
    },
    {
      type: "single",
      prompt: "Un caso de arquitectura presenta un proyecto con datos históricos de 10 años que deben migrarse desde 3 sistemas fuente distintos, respetando relaciones padre-hijo y validando integridad después de la carga. ¿Qué capacidad profesional evalúa este escenario?",
      options: [
      "Estrategia de migración de datos",
      "Evaluación de plataforma vs customización",
      "Arquitectura de aplicaciones",
      "Gestión de calidad"
      ],
      answer: [0],
      explanation: "La estrategia de migración de datos es un área donde muchos equipos fallan por subestimarla; evalúa cuándo usar cada herramienta de migración, el orden de migración de relaciones padre-hijo, y la validación de integridad tras la carga."
    },
    {
      type: "single",
      prompt: "Tras el go-live, el arquitecto debe firmar que la implementación es conforme al diseño antes de aprobar el despliegue a producción, revisando Solution Checker, seguridad y performance. ¿Qué responsabilidad profesional describe mejor esta actividad?",
      options: [
      "Validar la implementación contra la arquitectura aprobada",
      "Realizar únicamente análisis inicial de solución",
      "Diseñar una solución sin participar en la entrega",
      "Ninguno, es responsabilidad exclusiva del Project Manager"
      ],
      answer: [0],
      explanation: "El arquitecto debe validar que la implementación sigue la arquitectura diseñada, incluyendo revisión de Solution Checker, seguridad y performance antes de aprobar el paso a producción. Esta responsabilidad de validación técnica no recae solo en el PM."
    },
    {
      type: "multi",
      prompt: "Un arquitecto evalúa la integración con otros sistemas. ¿Qué DOS reglas mnemónicas reflejan correctamente buenas decisiones entre servicios de integración?",
      options: [
      "Power Automate para makers, latencia tolerada y costos bajos; Logic Apps para IT, SLA estricto y escenarios EDI/B2B",
      "Azure Functions para código personalizado que requiere alta performance y no puede resolverse con configuración",
      "Siempre usar Logic Apps sin importar el SLA porque tiene mejor branding que Power Automate",
      "El costo de Azure Functions siempre es menor que Power Automate en cualquier escenario"
      ],
      answer: [0, 1],
      explanation: "El arquitecto debe distinguir Power Automate (makers, SLA tolerante) de Logic Apps (IT, SLA estricto, EDI/B2B) y saber cuándo Azure Functions es necesario para código de alta performance. Elegir un servicio por 'branding' o asumir costos sin analizar el escenario no refleja pensamiento arquitectónico."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Candidato a Solution Architect): en sus primeros dos intentos de certificación, el candidato memorizaba preguntas de práctica y aprobaba con notas altas, pero fallaba al razonar sobre escenarios enterprise reales. ¿Qué gap describe mejor este patrón?",
      options: [
      "Conocimiento técnico certificado sin experiencia real en decisiones arquitectónicas de alto nivel",
      "Falta de conocimiento técnico básico de Power Platform",
      "Falta de tiempo disponible para estudiar",
      "Falta de acceso a un ambiente de práctica"
      ],
      answer: [0],
      explanation: "El caso es explícito: el candidato tenía excelentes habilidades técnicas y aprobaba certificaciones memorizando, pero le costaba razonar sobre negocio, restricciones, riesgos y trade-offs — el gap no era conocimiento técnico sino juicio arquitectónico.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Candidato a Solution Architect): en el tercer intento, el candidato analizó 5 casos de estudio reales de Microsoft, diseñó su propia arquitectura antes de ver la solución oficial, y comparó las diferencias. ¿Qué habilidad estaba entrenando específicamente con este método?",
      options: [
      "La capacidad de razonar y justificar decisiones arquitectónicas ante un escenario ambiguo",
      "La memorización de opciones de respuesta de exámenes anteriores",
      "La velocidad de lectura de documentación técnica",
      "El manejo de la interfaz de Power Apps Studio"
      ],
      answer: [0],
      explanation: "Diseñar su propia solución antes de ver la respuesta oficial y comparar diferencias entrena directamente el razonamiento arquitectónico ante ambigüedad, que es justo la habilidad que las preguntas de opción múltiple memorizadas no desarrollan.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Solution Architect): el candidato completó también el proyecto capstone (análogo al Módulo 41), lo que lo forzó a tomar y justificar más de 10 decisiones arquitectónicas con ADRs. ¿Qué valor agrega un ADR (Architecture Decision Record) en este contexto?",
      options: [
      "Documenta la decisión tomada, las alternativas consideradas y el porqué, dejando trazabilidad del razonamiento",
      "Reemplaza la necesidad de un Discovery Workshop",
      "Sirve únicamente como plantilla de diseño visual sin contenido técnico",
      "Es un requisito exclusivo de proyectos con Azure DevOps, no de Power Platform"
      ],
      answer: [0],
      explanation: "Un ADR documenta qué se decidió, qué alternativas se evaluaron y por qué se eligió una sobre otra, dejando trazabilidad del razonamiento arquitectónico — exactamente la habilidad de justificar decisiones que el candidato necesitaba desarrollar.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Solution Architect): el resultado final fue mejorar su capacidad de defender decisiones frente a stakeholders técnicos y ejecutivos. ¿Qué conclusión general sobre la preparación para el rol de arquitecto ilustra este caso?",
      options: [
      "Aprender a pensar como arquitecto (razonar sobre trade-offs) es distinto de memorizar respuestas correctas",
      "Aprobar la certificación técnica es suficiente para desempeñarse como Solution Architect",
      "La experiencia práctica no aporta nada que la teoría no cubra",
      "Los casos de estudio de Microsoft no son útiles para prepararse"
      ],
      answer: [0],
      explanation: "El caso concluye explícitamente que la diferencia fue 'aprender a pensar como arquitecto, no como alguien que recuerda respuestas' — la certificación técnica es necesaria pero no suficiente para el juicio arquitectónico que exige el rol.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Solution Architect): ¿cuáles DOS acciones concretas tomó el candidato en su tercer intento que marcaron la diferencia frente a los dos anteriores?",
      options: [
      "Analizar casos de estudio reales de Microsoft diseñando su propia solución antes de ver la oficial",
      "Completar un proyecto capstone justificando decisiones arquitectónicas con ADRs",
      "Repetir exactamente la misma estrategia de memorización de los intentos anteriores",
      "Evitar cualquier escenario enterprise complejo durante su preparación"
      ],
      answer: [0, 1],
      explanation: "El caso detalla estas dos acciones concretas como el cambio de estrategia del tercer intento. Repetir la memorización o evitar escenarios complejos es justamente lo que había fallado en los dos intentos previos.",
      appliesTo: "caso"
    }
  ],
  41: [
    {
      type: "single",
      prompt: "En el capstone enterprise debes combinar experiencia interna, portal externo, lógica server-side, integración y analítica. ¿Qué propuesta refleja mejor esa arquitectura objetivo?",
      options: [
      "Model-Driven para operación interna, Power Pages para externos, plugins/PCF para extensión, Azure Integration para desacoplar y Fabric para analítica",
      "Solo una Canvas App con datos en Excel para todos los casos",
      "Un portal estático sin backend y reportes manuales",
      "Power BI como única capa transaccional"
      ],
      answer: [0],
      explanation: "La opción correcta distribuye cada necesidad en la tecnología adecuada dentro de una arquitectura enterprise coherente. Las demás concentran cargas incompatibles o eliminan capacidades críticas de seguridad, integración o datos."
    },
    {
      type: "single",
      prompt: "El comité de arquitectura pide entregables que permitan mantener la solución después del proyecto. ¿Cuál conjunto es el más completo?",
      options: [
      "Solo el código fuente sin contexto",
      "ADRs, Reference Architecture, Capability Map y Risk Register",
      "Únicamente capturas de pantalla del producto final",
      "Una lista informal de recuerdos del equipo"
      ],
      answer: [1],
      explanation: "Ese conjunto documenta decisiones, visión objetivo, capacidades cubiertas y riesgos residuales, lo que facilita operación y evolución. El código sin contexto o capturas no bastan para gobernanza enterprise."
    },
    {
      type: "multi",
      prompt: "Debes presentar la solución al comité ejecutivo. ¿Qué DOS mensajes no pueden faltar en una presentación sólida del capstone?",
      options: [
      "ROI y TCO esperados de la iniciativa",
      "Riesgos clave, mitigaciones y timeline de implantación",
      "Detalles irrelevantes de color de cada pantalla como principal argumento",
      "Una afirmación de que no existe ningún riesgo en el programa"
      ],
      answer: [0, 1],
      explanation: "La dirección necesita entender valor económico, riesgo y plan de ejecución, no solo detalles técnicos o visuales. Afirmar que no existen riesgos resta credibilidad y madurez a la propuesta."
    },
    {
      type: "single",
      prompt: "Tu pipeline del capstone promueve soluciones entre DEV, TEST y PROD. ¿Qué práctica es indispensable para mantener gobierno y seguridad?",
      options: [
      "Usar Environment Variables, Connection References y validaciones automáticas antes de producción",
      "Editar componentes críticos manualmente en PROD para ahorrar tiempo",
      "Omitir revisiones de Solution Checker cuando el release es urgente",
      "Compartir una sola cuenta admin entre todos los equipos"
      ],
      answer: [0],
      explanation: "La promoción controlada exige parametrización, trazabilidad y quality gates previos a producción. Los cambios manuales, la omisión de validaciones y las cuentas compartidas debilitan la arquitectura operativa."
    },
    {
      type: "single",
      prompt: "El sponsor pide que la plataforma también entregue inteligencia de negocio sin degradar el procesamiento transaccional. ¿Qué enfoque completa mejor el capstone?",
      options: [
      "Separar operación en Dataverse y analítica en Fabric con gobierno de seguridad y consumo",
      "Guardar reportes históricos como notas adjuntas en cada registro",
      "Ejecutar todas las consultas analíticas pesadas directamente desde los formularios productivos",
      "Eliminar cualquier capa analítica para simplificar"
      ],
      answer: [0],
      explanation: "La separación entre cargas transaccionales y analíticas permite escalar ambos mundos con mejor rendimiento y gobierno. Cargar el sistema operacional con reporting pesado o eliminar analítica reduce el valor de la solución."
    },
    {
      type: "single",
      prompt: "Antes del go-live del proyecto capstone, el arquitecto verifica Solution Checker con 0 errores críticos, pipeline CI/CD verde, UAT firmado por el cliente, CMK y PIM configurados, y plan de rollback probado. ¿Qué artefacto está utilizando para asegurar que ningún requisito quede pendiente?",
      options: [
      "Go-Live Checklist",
      "Stakeholder Communication Plan",
      "Fit-Gap Analysis",
      "WBS a nivel de tarea"
      ],
      answer: [0],
      explanation: "El Go-Live Checklist confirma que el sistema está listo para producción verificando todos estos ítems, ninguno de los cuales es opcional; si alguno falla, el go-live se pospone. El Stakeholder Communication Plan define cómo comunicar a cada stakeholder, el Fit-Gap Analysis clasifica requerimientos, y el WBS descompone el proyecto en tareas, ninguno reemplaza la verificación de disposición para producción."
    },
    {
      type: "single",
      prompt: "El sponsor del capstone insiste en incluir reportes avanzados y notificaciones personalizadas desde el primer entregable, retrasando el flujo principal de negocio. ¿Qué principio del proyecto capstone debe recordarle el arquitecto?",
      options: [
      "El MVP debe priorizar el flujo principal end-to-end e integraciones críticas, dejando fuera funcionalidades 'nice to have' como reportes avanzados",
      "Todo debe entregarse completo desde el primer sprint sin priorización",
      "El Runbook de Operaciones debe escribirse antes que el modelo de datos",
      "Los ADRs deben eliminarse una vez tomada la decisión para simplificar la documentación"
      ],
      answer: [0],
      explanation: "El MVP incluye el flujo principal de negocio funcionando y las integraciones sin las cuales el sistema no tiene valor; los reportes avanzados y notificaciones personalizadas son funcionalidades que quedan fuera del MVP. Los ADRs no se eliminan, se marcan como 'superseded' cuando cambian, y el Runbook se produce en fases posteriores del proyecto."
    },
    {
      type: "multi",
      prompt: "El equipo de operaciones necesita saber cómo responder a incidentes en producción, y el CFO necesita el estado financiero mensual en un formato ejecutivo distinto al que recibe el equipo de desarrollo. ¿Qué DOS artefactos del capstone atienden respectivamente estas necesidades?",
      options: [
      "Runbook de Operaciones, con procedimientos de respuesta a alertas y contactos de escalamiento",
      "Stakeholder Communication Plan, que define qué información necesita cada stakeholder, con qué frecuencia y en qué formato",
      "El mismo ADR sirve para ambas audiencias sin ajustes",
      "El Risk Register reemplaza tanto al Runbook como al Communication Plan"
      ],
      answer: [0, 1],
      explanation: "El Runbook de Operaciones documenta cómo monitorear y responder a incidentes, mientras el Stakeholder Communication Plan define el contenido, formato y frecuencia de comunicación para cada stakeholder, incluyendo al CFO. Un ADR documenta decisiones arquitectónicas, no reemplaza estos dos artefactos, y el Risk Register gestiona riesgos, no operación ni comunicación."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cooperativa financiera): la aprobación de créditos tardaba 5 días hábiles mientras la competencia fintech lo hacía en 10 minutos, y cada oficina regional usaba su propio Excel inconsistente. ¿Qué gap arquitectónico describe mejor este problema antes del capstone?",
      options: [
      "Ausencia de una plataforma centralizada de datos y proceso, con visibilidad ejecutiva en tiempo real",
      "Falta de licencias de Power BI Premium",
      "Falta de un Field Service Mobile configurado",
      "Falta de Copilot Studio en el proceso de aprobación"
      ],
      answer: [0],
      explanation: "El problema central era la fragmentación: cada oficina con su propio Excel, sin sistema centralizado ni visibilidad en tiempo real para la sede central, lo que explica tanto la lentitud como la inconsistencia de datos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cooperativa financiera): el cumplimiento de la Ley 1581 en Colombia y las regulaciones de la Superintendencia de Bancos en Ecuador y Perú no estaba documentado. ¿Qué actividad del ciclo de vida del proyecto debía capturar estos requisitos regulatorios desde el inicio?",
      options: [
      "El Discovery Workshop y el Risk Register, identificando restricciones regulatorias por país",
      "El Go-Live Checklist, al final del proyecto",
      "El Runbook de Operaciones, después de producción",
      "El Weekly Digest del CoE Starter Kit"
      ],
      answer: [0],
      explanation: "Los requisitos regulatorios por país (Ley 1581, Superintendencia de Bancos) debían identificarse desde el Discovery Workshop y quedar reflejados en el Risk Register, no descubrirse tarde en el proyecto o al momento del go-live.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cooperativa financiera): el 70% de las solicitudes de crédito ahora se resuelve en 4 horas, y el 30% restante sigue en revisión humana pero con la información ya preparada automáticamente. ¿Qué patrón de diseño de solución refleja este resultado?",
      options: [
      "Automatización con human-in-the-loop para los casos que requieren juicio humano",
      "Automatización del 100% de los casos sin ninguna excepción",
      "Eliminar por completo la revisión humana del proceso de crédito",
      "Mantener el proceso 100% manual como antes, sin ningún cambio"
      ],
      answer: [0],
      explanation: "El resultado describe un patrón de human-in-the-loop: la mayoría de los casos se resuelve automáticamente, mientras los casos que requieren juicio humano llegan ya con la información preparada, acelerando incluso la parte manual del proceso.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Cooperativa financiera): el costo del sistema resultó 60% menor que la solución legacy que cotizaban antes de conocer Power Platform. ¿Qué argumento de negocio ilustra mejor este resultado para justificar la elección de la plataforma?",
      options: [
      "Power Platform puede ofrecer una alternativa de menor costo total frente a soluciones legacy a medida, sin sacrificar el resultado funcional",
      "El costo de las soluciones legacy siempre es menor que Power Platform",
      "El 60% de ahorro se debió únicamente a reducir personal",
      "El costo de licenciamiento de Power Platform es irrelevante para la decisión arquitectónica"
      ],
      answer: [0],
      explanation: "El caso usa la comparación de costos como argumento de negocio: la solución en Power Platform logró el mismo (o mejor) resultado funcional a un costo total significativamente menor que la alternativa legacy cotizada previamente.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Cooperativa financiera): ¿cuáles DOS resultados del capstone reflejan directamente el cierre exitoso de los gaps identificados al inicio del caso?",
      options: [
      "Tiempo de aprobación reducido de 5 días a 4 horas para el 70% de solicitudes",
      "Cumplimiento regulatorio documentado y auditado en los 3 países",
      "Eliminación total de la necesidad de revisión humana en cualquier caso",
      "Migración de la cooperativa a un tenant distinto en cada país"
      ],
      answer: [0, 1],
      explanation: "El caso reporta explícitamente estos dos resultados como cierre de los gaps de velocidad y cumplimiento regulatorio identificados al inicio. El 30% de casos sigue requiriendo revisión humana, y no se describe ninguna migración de tenants por país.",
      appliesTo: "caso"
    }
  ],
  42: [
    {
      type: "single",
      prompt: "¿Cuál de las siguientes opciones describe mejor a un 'agente' de código frente a un simple chat de IA?",
      options: [
        "Un agente puede usar herramientas (leer archivos, ejecutar comandos, editar código) encadenando pasos; un chat solo responde texto",
        "Un agente y un chat son exactamente lo mismo, solo cambia el nombre comercial",
        "Un chat siempre es más preciso que un agente porque no ejecuta nada",
        "Un agente solo funciona sin conexión a internet"
      ],
      answer: [0],
      explanation: "Un agente de código puede usar herramientas para leer, buscar y editar archivos o ejecutar comandos de forma encadenada, mientras que un chat sin herramientas solo devuelve texto que el humano debe aplicar manualmente."
    },
    {
      type: "single",
      prompt: "Un modelo de IA genera código que llama a una función de una tabla de Dataverse que en realidad no existe en tu entorno. ¿Cómo se llama este fenómeno y qué se debe hacer?",
      options: [
        "Es una alucinación; siempre verificar contra el esquema real antes de aceptar el código",
        "Es un bug del editor de código, no del modelo",
        "Es normal y no requiere verificación porque el modelo siempre tiene el esquema actualizado",
        "Solo ocurre con modelos antiguos y ya no sucede con los más recientes"
      ],
      answer: [0],
      explanation: "Las alucinaciones son una consecuencia esperada de cómo funcionan los LLM, no un bug puntual; el código generado siempre debe verificarse contra el esquema o la documentación real antes de aceptarlo."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS elementos mejoran la precisión de una respuesta de IA al generar código para Power Fx?",
      options: [
        "Especificar explícitamente el lenguaje y la plataforma (Power Fx, Canvas Apps)",
        "Dar contexto adicional relevante (ej. el control específico donde se usará la fórmula)",
        "Omitir cualquier detalle para que el modelo 'adivine' mejor",
        "Pedir la respuesta en el idioma menos usado posible"
      ],
      answer: [0, 1],
      explanation: "Especificar lenguaje/plataforma y dar contexto relevante reducen la ambigüedad y mejoran la precisión de la respuesta; omitir detalles produce respuestas más genéricas y propensas a error."
    },
    {
      type: "single",
      prompt: "¿Por qué la misma pregunta a un modelo de IA puede producir respuestas distintas en ejecuciones diferentes?",
      options: [
        "Por la naturaleza no determinista relativa del modelo, lo cual exige siempre revisión humana antes de aceptar cambios en producción",
        "Porque el modelo cambia de versión cada vez que se le pregunta algo",
        "Porque hay un error de red que corrompe la respuesta",
        "Esto nunca ocurre; los modelos son 100% deterministas"
      ],
      answer: [0],
      explanation: "Los LLM tienen un componente no determinista relativo; la misma pregunta puede variar de respuesta entre ejecuciones, por lo que la revisión humana es indispensable antes de aceptar cualquier cambio en código de producción."
    },
    {
      type: "single",
      prompt: "¿Qué caracteriza al autocompletado (como GitHub Copilot inline) frente a un chat o un agente?",
      options: [
        "Sugiere la continuación del código mientras se escribe, basado en el archivo actual y archivos abiertos relacionados",
        "Ejecuta comandos de terminal de forma autónoma sin intervención humana",
        "Solo funciona para lenguajes de programación compilados",
        "Reemplaza completamente la necesidad de revisar el código generado"
      ],
      answer: [0],
      explanation: "El autocompletado sugiere la siguiente línea o bloque mientras se escribe, usando como contexto el archivo actual y archivos relacionados abiertos, a diferencia del chat (responde preguntas) o el agente (ejecuta herramientas)."
    },
    {
      type: "single",
      prompt: "Un desarrollador acepta un plugin C# generado por IA sin revisar que llama a la API de Dataverse en modo síncrono dentro de un bucle. ¿Qué principio de este módulo se violó?",
      options: [
        "Tratar todo código generado como un borrador que requiere verificación contra buenas prácticas conocidas, no como resultado final",
        "El principio de nunca usar IA para generar plugins C#",
        "El principio de que la IA siempre debe usarse en modo offline",
        "No se violó ningún principio; el Solution Checker ya garantiza que el código es correcto"
      ],
      answer: [0],
      explanation: "El Solution Checker valida ciertos aspectos, pero no sustituye la revisión humana de patrones de rendimiento conocidos; todo código generado por IA debe tratarse como un borrador a verificar."
    },
    {
      type: "single",
      prompt: "¿Qué es la 'ventana de contexto' de un modelo de lenguaje aplicado a código?",
      options: [
        "El límite de tokens (texto) que el modelo puede recibir y considerar al generar una respuesta",
        "La cantidad de archivos que un editor puede tener abiertos simultáneamente",
        "El tiempo máximo que puede tardar una respuesta antes de expirar",
        "El número de líneas de código que el modelo puede escribir por respuesta"
      ],
      answer: [0],
      explanation: "La ventana de contexto es el límite de tokens que el modelo puede procesar como entrada; en repositorios grandes hay que decidir qué contexto relevante mostrarle dentro de ese límite."
    },
    {
      type: "single",
      prompt: "¿Cuál es el riesgo principal de tratar la primera respuesta de un modelo de IA como definitiva?",
      options: [
        "Puede no ser la mejor opción disponible dado el componente no determinista del modelo; conviene iterar y comparar antes de decidir",
        "Ninguno; la primera respuesta siempre es la más precisa",
        "Que consume más tokens que las respuestas posteriores",
        "Que el modelo se bloquea si se le pide una segunda respuesta"
      ],
      answer: [0],
      explanation: "Dada la naturaleza no determinista relativa de los modelos, conviene iterar el prompt y comparar 2-3 respuestas antes de asumir que la primera es la mejor opción."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SIT plugin C#): el código generado por Copilot compiló y pasó Solution Checker, pero hacía llamadas síncronas a Dataverse dentro de un bucle. ¿Cuál era la decisión correcta antes de aceptar el plugin?",
      options: [
        "Revisar el patrón generado contra buenas prácticas de rendimiento de Dataverse antes de promoverlo",
        "Aceptar el código porque compilar y pasar Solution Checker es suficiente",
        "Publicarlo y esperar a que producción revele si hay problemas de volumen",
        "Desactivar Solution Checker porque no detectó el problema"
      ],
      answer: [0],
      explanation: "El caso muestra que compilar y pasar Solution Checker no sustituyen la revisión humana de rendimiento. El problema fue aceptar una llamada síncrona en bucle sin contrastarla con buenas prácticas conocidas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SIT plugin C#): ¿por qué la causa raíz no fue simplemente 'Copilot se equivocó'?",
      options: [
        "Porque el modelo entregó un borrador que requería validación humana contra conocimiento de dominio antes de usarse",
        "Porque Copilot nunca puede generar código con problemas de rendimiento",
        "Porque Dataverse no permite llamadas síncronas desde plugins",
        "Porque Solution Checker garantiza que un plugin escala con datos reales"
      ],
      answer: [0],
      explanation: "La IA puede acelerar la generación, pero el equipo sigue siendo responsable de validar diseño, rendimiento y contexto real. El modelo no reemplaza el criterio técnico del desarrollador.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (SIT plugin C#): ¿cuáles DOS señales debieron activar una revisión más profunda antes de publicar?",
      options: [
        "Uso de una API de Dataverse en modo síncrono dentro de un bucle",
        "Ausencia de prueba con volúmenes representativos antes de producción",
        "Que el código hubiera sido escrito en C#",
        "Que el plugin usara una solución de Power Platform"
      ],
      answer: [0, 1],
      explanation: "El patrón síncrono dentro de un bucle y la falta de validación con volumen real son señales directas de riesgo. C# y Power Platform no son problemas por sí mismos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SIT plugin C#): si el desarrollador quería usar IA de forma responsable, ¿qué prompt posterior habría sido más útil?",
      options: [
        "Revisa este plugin C# para Dataverse buscando riesgos de llamadas síncronas, bucles, throttling y timeouts con alto volumen",
        "Haz que este plugin parezca más profesional sin cambiar su lógica",
        "Reduce la cantidad de comentarios aunque no revises rendimiento",
        "Convierte todo el código a JavaScript para evitar revisar Dataverse"
      ],
      answer: [0],
      explanation: "Un buen uso de IA para revisión debe pedir riesgos concretos alineados con el dominio: Dataverse, bucles, llamadas síncronas, throttling y timeouts.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SIT plugin C#): ¿qué evidencia mínima habría reducido el riesgo antes de desplegar a producción?",
      options: [
        "Un diff revisado por un humano y una prueba con volumen representativo enfocada en tiempos de ejecución",
        "Una captura de pantalla de Copilot mostrando que respondió sin errores",
        "El nombre del modelo usado para generar el código",
        "Un comentario diciendo que el código fue generado con IA"
      ],
      answer: [0],
      explanation: "El riesgo era de comportamiento y rendimiento, no de apariencia. Una revisión humana y una prueba con volumen representativo atacan directamente la causa del incidente.",
      appliesTo: "caso"
    }
  ],
  43: [
    {
      type: "single",
      prompt: "¿Qué hace 'Crear con Copilot' en Power Apps Studio?",
      options: [
        "Genera una app Canvas a partir de una descripción en lenguaje natural, como punto de partida a ajustar",
        "Publica automáticamente la app a producción sin revisión",
        "Solo funciona para Model-Driven Apps, no para Canvas",
        "Reemplaza por completo la necesidad de un maker en el proyecto"
      ],
      answer: [0],
      explanation: "Copilot en Power Apps genera un boceto funcional de app Canvas a partir de una descripción, que casi siempre requiere ajustes de UX, manejo de errores y performance antes de publicarse."
    },
    {
      type: "single",
      prompt: "Un Power Platform Admin quiere habilitar Copilot en Power Apps para todo el tenant. ¿Qué debería revisar primero según las buenas prácticas de este módulo?",
      options: [
        "La política DLP y la clasificación de datos de cada entorno, habilitando Copilot entorno por entorno",
        "Nada; Copilot siempre es seguro habilitarlo para todo el tenant de inmediato",
        "Solo el número de licencias disponibles",
        "El idioma predeterminado del tenant"
      ],
      answer: [0],
      explanation: "Habilitar Copilot sin revisar la política DLP y la clasificación de datos de cada entorno puede exponer información sensible en sugerencias generadas; la recomendación es revisar y habilitar entorno por entorno."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS afirmaciones distinguen correctamente a Copilot Studio de Copilot en Power Apps/Automate?",
      options: [
        "Copilot Studio construye agentes conversacionales que el usuario final interactúa directamente",
        "Copilot en Power Apps/Automate asiste al maker durante la construcción, no al usuario final",
        "Copilot Studio y Copilot en Power Apps son exactamente la misma herramienta con otro nombre",
        "Copilot en Power Automate solo puede explicar flujos, nunca generarlos"
      ],
      answer: [0, 1],
      explanation: "Copilot Studio construye agentes que interactúan con el usuario final, mientras que Copilot en Power Apps/Automate asiste al maker durante la construcción de la solución; son roles distintos dentro del ecosistema."
    },
    {
      type: "single",
      prompt: "¿Qué debe hacerse siempre antes de publicar en producción una app o flujo generado por Copilot?",
      options: [
        "Revisar manejo de errores, seguridad y rendimiento, tratándolo como un primer borrador",
        "Nada adicional; el resultado de Copilot ya está listo para producción",
        "Solo verificar que compile sin errores de sintaxis",
        "Esperar 24 horas antes de publicar, sin revisión adicional"
      ],
      answer: [0],
      explanation: "Cualquier app o flujo generado por Copilot debe tratarse como un primer borrador funcional, revisando manejo de errores, seguridad y rendimiento antes de publicarlo."
    },
    {
      type: "single",
      prompt: "¿Qué usa 'generative answers' en Copilot Studio para responder preguntas del usuario final?",
      options: [
        "Fuentes de conocimiento configuradas (SharePoint, sitios web, Dataverse) ya validadas y con control de acceso correcto",
        "Únicamente el conocimiento general del modelo sin ninguna fuente configurada",
        "Los flujos de Power Automate del entorno, sin relación con fuentes de conocimiento",
        "Un archivo de configuración que el usuario final edita directamente"
      ],
      answer: [0],
      explanation: "Generative answers en Copilot Studio responde usando fuentes de conocimiento configuradas por el equipo, que deben estar validadas y con el control de acceso correcto para evitar exponer información indebida."
    },
    {
      type: "single",
      prompt: "¿Dónde se configura la gobernanza de Copilot a nivel de entorno en Power Platform?",
      options: [
        "En el Power Platform Admin Center",
        "Únicamente dentro del editor de Power Apps Studio",
        "En el archivo de configuración local de cada desarrollador",
        "No existe forma de configurar esto; Copilot está siempre activo igual en todos los entornos"
      ],
      answer: [0],
      explanation: "El Power Platform Admin Center permite configurar la gobernanza de Copilot y las políticas DLP por entorno, controlando qué datos y conectores están disponibles para las funciones de IA generativa."
    },
    {
      type: "single",
      prompt: "Un maker pide a Copilot en Power Automate 'cuando se cree un registro en una tabla, enviar un correo al responsable'. ¿Qué se espera que haga Copilot?",
      options: [
        "Proponer un flujo con el trigger y las acciones correspondientes, como borrador a revisar",
        "Ejecutar el envío de correos inmediatamente sin crear ningún flujo",
        "Rechazar la solicitud porque requiere código personalizado",
        "Crear automáticamente un plugin C# en lugar de un flujo"
      ],
      answer: [0],
      explanation: "Copilot en Power Automate propone un flujo (trigger + acciones) a partir de la descripción en lenguaje natural, que el maker debe revisar y ajustar antes de publicarlo."
    },
    {
      type: "single",
      prompt: "¿Cuál es el riesgo principal de que una fórmula generada por Copilot en el editor de Power Apps incluya nombres reales de columnas de una tabla confidencial?",
      options: [
        "Esos nombres pueden quedar expuestos si la fórmula se comparte (ej. en una captura de pantalla) sin que el maker lo note",
        "Ningún riesgo; los nombres de columnas nunca son información sensible",
        "Solo afecta el rendimiento de la app, no la seguridad de los datos",
        "Este riesgo solo existe en Model-Driven Apps, no en Canvas"
      ],
      answer: [0],
      explanation: "Los nombres de columnas reales sugeridos por Copilot pueden exponer estructura de datos confidenciales si se comparten externamente sin revisión, por lo que la gobernanza de datos por entorno es clave antes de habilitar Copilot ampliamente."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Copilot en tenant SIT): ¿qué error de gobierno cometió el administrador al activar Copilot para todo el tenant?",
      options: [
        "No revisó primero la clasificación de datos y las políticas DLP por entorno",
        "No instaló GitHub Copilot en VS Code",
        "No convirtió todas las tablas confidenciales en tablas virtuales",
        "No creó un plugin C# para filtrar las capturas de pantalla"
      ],
      answer: [0],
      explanation: "El caso dice que Copilot se habilitó ampliamente sin revisar qué entornos contenían datos bajo NDA ni su DLP. La corrección fue habilitar entorno por entorno con gobierno previo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Copilot en tenant SIT): una fórmula generada incluyó nombres reales de columnas confidenciales y luego se compartió en una captura. ¿Cuál fue el riesgo concreto?",
      options: [
        "Exposición externa de estructura de datos confidencial por falta de control del entorno",
        "Pérdida automática de todos los registros de Dataverse",
        "Aumento de consumo de capacidad de Power Pages",
        "Bloqueo permanente del editor de Power Apps"
      ],
      answer: [0],
      explanation: "El incidente fue de confidencialidad: nombres reales de columnas de una tabla bajo NDA quedaron visibles fuera del contexto autorizado.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (Copilot en tenant SIT): ¿cuáles DOS controles debieron aplicarse antes de habilitar Copilot ampliamente?",
      options: [
        "Revisar DLP por entorno",
        "Clasificar qué entornos contienen datos de clientes bajo NDA",
        "Dar System Administrator a todos los makers",
        "Eliminar todas las columnas con nombres descriptivos"
      ],
      answer: [0, 1],
      explanation: "La corrección descrita combina gobierno por entorno, DLP y clasificación de datos. Dar más privilegios o borrar nombres útiles no resuelve el problema de gobierno.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Copilot en tenant SIT): ¿cuál es la política de habilitación más segura para un tenant con entornos de distinta sensibilidad?",
      options: [
        "Habilitar Copilot entorno por entorno después de revisar datos, DLP y audiencia",
        "Habilitar Copilot globalmente y corregir incidentes después",
        "Prohibir permanentemente Copilot incluso en entornos sin datos sensibles",
        "Habilitarlo solo si todos los usuarios prometen no tomar capturas"
      ],
      answer: [0],
      explanation: "La habilitación gradual por entorno permite balancear productividad y control de datos. El caso muestra el riesgo de una activación global sin revisión.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (Copilot en tenant SIT): si un maker debe documentar una fórmula generada sobre una tabla confidencial, ¿qué práctica reduce el riesgo de exposición?",
      options: [
        "Anonimizar nombres sensibles o usar ejemplos ficticios antes de compartir material fuera del equipo autorizado",
        "Compartir la captura completa porque solo muestra metadatos",
        "Pegar también registros reales para que el contexto sea más claro",
        "Desactivar DLP porque dificulta la colaboración"
      ],
      answer: [0],
      explanation: "Cuando hay datos bajo NDA, incluso la estructura puede ser sensible. Anonimizar o usar ejemplos ficticios reduce exposición fuera del contexto autorizado.",
      appliesTo: "caso"
    }
  ],
  44: [
    {
      type: "single",
      prompt: "¿Qué diferencia principal hay entre el autocompletado inline de GitHub Copilot y Copilot Edits (Agent Mode)?",
      options: [
        "Copilot Edits puede proponer y aplicar cambios a través de múltiples archivos, mostrando el diff antes de aceptarlo; el autocompletado solo sugiere la línea actual",
        "No hay ninguna diferencia real entre ambos",
        "El autocompletado solo funciona en archivos Python",
        "Copilot Edits nunca muestra un diff, aplica los cambios directamente sin revisión"
      ],
      answer: [0],
      explanation: "El autocompletado sugiere la continuación de una línea mientras se escribe; Copilot Edits/Agent Mode puede proponer cambios en múltiples archivos y muestra el diff para revisión antes de aplicarlo."
    },
    {
      type: "single",
      prompt: "¿Qué función cumple el archivo `.github/copilot-instructions.md` en un proyecto?",
      options: [
        "Fija convenciones del proyecto (ej. prefijos de Dataverse, patrón de logging) que Copilot lee automáticamente como contexto",
        "Configura las credenciales de GitHub del equipo",
        "Reemplaza el archivo `package.json` del proyecto",
        "Solo tiene efecto si se ejecuta manualmente como script"
      ],
      answer: [0],
      explanation: "`.github/copilot-instructions.md` centraliza convenciones propias del repositorio que Copilot usa como contexto automáticamente, evitando repetir esas instrucciones en cada prompt."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS factores mejoran la precisión de una sugerencia de Copilot sobre un componente PCF específico?",
      options: [
        "Tener abierto el archivo real del componente como contexto",
        "Documentar convenciones del proyecto en `.github/copilot-instructions.md`",
        "Cerrar todos los archivos del proyecto antes de pedir la sugerencia",
        "Pedir la sugerencia en un archivo completamente vacío sin relación al componente"
      ],
      answer: [0, 1],
      explanation: "Tener el archivo real abierto y documentar convenciones del proyecto le dan a Copilot el contexto necesario para generar sugerencias más precisas y consistentes con el patrón del repositorio."
    },
    {
      type: "single",
      prompt: "Un plugin C# generado con Copilot Chat usó `Console.WriteLine` para logging en lugar de `ITracingService`. ¿Cuál fue la causa raíz según el caso de este módulo?",
      options: [
        "No se le dio a Copilot el contexto del patrón de logging ya establecido en el proyecto",
        "`Console.WriteLine` es la forma correcta de hacer logging en plugins de Dataverse",
        "Copilot Chat no puede generar código C# válido",
        "El error fue causado por una falla del Solution Checker"
      ],
      answer: [0],
      explanation: "Sin el contexto del patrón de logging ya establecido (ej. un archivo de referencia o `.github/copilot-instructions.md`), Copilot generó una alternativa sintácticamente válida pero incorrecta para el contexto de un plugin de Dataverse."
    },
    {
      type: "single",
      prompt: "¿Qué se debe hacer siempre antes de aplicar un cambio propuesto por Copilot Edits que afecta varios archivos?",
      options: [
        "Revisar el diff de cada archivo modificado antes de aceptar",
        "Aceptar directamente si el resumen general suena razonable",
        "Aplicar solo el primer archivo del diff y descartar el resto",
        "No es necesario revisar nada si el proyecto tiene buena cobertura de tests"
      ],
      answer: [0],
      explanation: "Nunca se deben aceptar cambios multi-archivo a ciegas; revisar el diff completo de cada archivo modificado es indispensable antes de aplicar cambios de Copilot Edits."
    },
    {
      type: "single",
      prompt: "¿Qué usa Copilot como contexto de workspace al generar sugerencias en VS Code?",
      options: [
        "Los archivos abiertos, el árbol del proyecto y, según configuración, el repositorio completo",
        "Únicamente el nombre del proyecto, sin acceso a ningún archivo",
        "Solo el archivo activo, ignorando cualquier otro archivo abierto",
        "Una copia local descargada de todo GitHub"
      ],
      answer: [0],
      explanation: "El contexto de workspace incluye archivos abiertos, la estructura del proyecto y, según configuración, el repositorio — mientras más específico y relevante el contexto abierto, más preciso el resultado."
    },
    {
      type: "single",
      prompt: "¿Cuál es el propósito de Copilot Chat frente al autocompletado inline?",
      options: [
        "Permite hacer preguntas sobre el código abierto o pedir explicaciones/generación de bloques específicos sin tocar directamente el archivo",
        "Ejecuta pruebas unitarias automáticamente sin intervención",
        "Reemplaza la necesidad de tener el editor abierto",
        "Solo puede usarse para traducir comentarios de código"
      ],
      answer: [0],
      explanation: "Copilot Chat es un panel de conversación para preguntas y generación de bloques específicos, distinto del autocompletado que sugiere directamente dentro del flujo de escritura del código."
    },
    {
      type: "single",
      prompt: "Después de crear un `.github/copilot-instructions.md` con las convenciones del proyecto, ¿qué se espera al repetir una petición de generación de código similar?",
      options: [
        "Una mejora en la precisión y consistencia de la sugerencia respecto al patrón del proyecto",
        "Ningún cambio; el archivo de instrucciones no afecta las sugerencias de Copilot",
        "Que Copilot deje de funcionar hasta borrar el archivo",
        "Que las sugerencias empeoren porque el archivo consume la ventana de contexto por completo"
      ],
      answer: [0],
      explanation: "El archivo de instrucciones del repositorio se usa como contexto automático, mejorando la consistencia de las sugerencias con las convenciones ya establecidas del proyecto."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plugin con Console.WriteLine): ¿por qué Copilot generó un logging incorrecto para Dataverse?",
      options: [
        "Porque no recibió el contexto del plugin base ni del patrón de ITracingService usado por el proyecto",
        "Porque C# no permite logging en plugins de Dataverse",
        "Porque ITracingService solo funciona en Canvas Apps",
        "Porque Console.WriteLine es obligatorio en todos los plugins"
      ],
      answer: [0],
      explanation: "El caso es explícito: el desarrollador no tenía abierto el archivo base ni el patrón establecido. Sin ese contexto, Copilot usó una salida genérica no válida para plugins.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plugin con Console.WriteLine): ¿qué archivo o contexto habría reducido la probabilidad del error?",
      options: [
        "El plugin base del proyecto o instrucciones de repositorio indicando que se usa ITracingService",
        "Un archivo vacío sin referencias al proyecto",
        "Una captura del formulario de producción",
        "Un README sin convenciones técnicas"
      ],
      answer: [0],
      explanation: "Copilot necesita contexto relevante. El archivo base o instrucciones explícitas del repositorio le muestran el patrón real que debe seguir.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (plugin con Console.WriteLine): ¿cuáles DOS revisiones debieron hacerse antes de aceptar el código generado?",
      options: [
        "Confirmar que usa ITracingService para logging de plugin",
        "Comparar el estilo generado con el patrón existente del proyecto",
        "Verificar que use Console.WriteLine al menos una vez",
        "Aceptar cualquier logging si el código compila"
      ],
      answer: [0, 1],
      explanation: "El problema fue no seguir el patrón del proyecto y usar un mecanismo de logging que no da trazas útiles en Dataverse. Compilar no basta.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plugin con Console.WriteLine): ¿qué pregunta de revisión humana habría detectado el problema más rápido?",
      options: [
        "¿El código generado sigue los patrones de logging y diagnóstico ya usados en este repositorio?",
        "¿La respuesta de Copilot fue suficientemente larga?",
        "¿El archivo tiene más comentarios que antes?",
        "¿La IA usó el mismo idioma que el desarrollador?"
      ],
      answer: [0],
      explanation: "La falla era de adaptación al contexto del proyecto. Preguntar por patrones locales de logging habría llevado directamente a ITracingService.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plugin con Console.WriteLine): ¿qué impacto operativo tuvo aceptar el patrón equivocado?",
      options: [
        "El equipo perdió tiempo depurando porque no había logs visibles útiles en Dataverse",
        "El plugin dejó de compilar inmediatamente",
        "Copilot desactivó el entorno de producción",
        "Se eliminaron automáticamente las trazas históricas"
      ],
      answer: [0],
      explanation: "El caso indica que el equipo perdió tiempo depurando en producción porque Console.WriteLine no generaba el logging esperado dentro del contexto de plugins de Dataverse.",
      appliesTo: "caso"
    }
  ],
  45: [
    {
      type: "single",
      prompt: "¿Qué distingue a un agente de código (Claude Code, Codex) de un simple chat con IA?",
      options: [
        "Puede usar herramientas (leer archivos, buscar en el repo, ejecutar comandos) encadenando pasos sin copiar/pegar manual",
        "Solo puede responder preguntas de una línea",
        "Nunca puede modificar archivos directamente",
        "Requiere que el humano ejecute cada comando manualmente después de cada respuesta"
      ],
      answer: [0],
      explanation: "Un agente de código usa herramientas para leer, buscar, ejecutar y editar de forma encadenada, a diferencia de un chat que solo devuelve texto que el humano debe aplicar manualmente."
    },
    {
      type: "single",
      prompt: "¿Qué tipo de tarea rinde mejor al delegarla a un agente de código, según este módulo?",
      options: [
        "Una tarea acotada y verificable, con un objetivo y criterio de éxito claros",
        "Una instrucción vaga como 'mejora el proyecto'",
        "Una tarea sin ningún criterio de éxito definido",
        "Cualquier tarea, sin importar el nivel de detalle de la instrucción"
      ],
      answer: [0],
      explanation: "Los agentes rinden mejor con tareas acotadas y verificables; instrucciones vagas producen resultados extensos, difíciles de revisar y potencialmente fuera de alcance."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS acciones ayudan a delegar una tarea de forma segura a un agente de código?",
      options: [
        "Definir el archivo/función objetivo y el criterio de éxito antes de delegar",
        "Pedir que el agente ejecute la verificación disponible (tests, lint) como parte de la tarea",
        "Evitar cualquier verificación para no 'perder tiempo'",
        "Dar la instrucción más general posible para que el agente decida todo"
      ],
      answer: [0, 1],
      explanation: "Definir el alcance/criterio de éxito y exigir verificación automática como parte de la tarea son las dos prácticas que reducen el riesgo de un resultado inmanejable o incorrecto."
    },
    {
      type: "single",
      prompt: "Un arquitecto le pidió a un agente 'optimiza el proyecto' sin más contexto, y recibió un PR de 40 archivos imposible de revisar. ¿Cuál fue la causa raíz?",
      options: [
        "Falta de alcance explícito y criterio de éxito verificable en la instrucción",
        "Un error del agente que no tiene solución posible",
        "El agente no tenía permisos suficientes",
        "El repositorio era demasiado pequeño para el agente"
      ],
      answer: [0],
      explanation: "Una instrucción vaga sin alcance ni criterio de éxito lleva a cambios extensos e inmanejables; delegar tareas acotadas y verificables evita este problema."
    },
    {
      type: "single",
      prompt: "¿Qué ventaja tiene pedirle a un agente que busque 'todos los archivos donde se recorre `LEVEL_ORDER`' frente a hacer esa búsqueda manualmente?",
      options: [
        "El agente puede explorar la estructura completa del repo y encadenar la búsqueda con análisis adicional sin copiar/pegar manual entre pasos",
        "No hay ninguna ventaja real, ambos métodos son idénticos",
        "Una búsqueda manual siempre es más precisa que la de un agente",
        "El agente no puede realizar búsquedas de texto en archivos"
      ],
      answer: [0],
      explanation: "Un agente puede explorar el repositorio y encadenar pasos (buscar, analizar, proponer cambios) de forma autónoma, algo que una búsqueda manual sin herramientas automatizadas no logra en un solo flujo."
    },
    {
      type: "single",
      prompt: "¿Qué se recomienda pedirle a un agente después de aplicar un cambio, antes de darlo por terminado?",
      options: [
        "Que ejecute la verificación disponible (por ejemplo `npm run lint`) y muestre el resultado, no solo el código",
        "Nada adicional; el código generado siempre es correcto",
        "Que elimine todos los tests existentes del proyecto",
        "Que genere documentación extensa sin relación con el cambio"
      ],
      answer: [0],
      explanation: "Pedir la ejecución explícita de la verificación disponible (tests, lint) como parte de la tarea da más confianza que un agente que solo entrega código sin ejecutar nada."
    },
    {
      type: "single",
      prompt: "¿Qué patrón general comparten Claude Code y Codex como agentes de código, según este módulo?",
      options: [
        "Un modelo de plan → ejecución → verificación, requiriendo que el humano defina el alcance y revise el resultado final",
        "Ambos operan exclusivamente sin ningún tipo de supervisión humana posible",
        "Ambos solo pueden trabajar con un archivo a la vez",
        "Ninguno de los dos puede ejecutar comandos de terminal"
      ],
      answer: [0],
      explanation: "Ambos agentes siguen un patrón de plan, ejecución y verificación, pero requieren que el humano defina el alcance de la tarea y revise el resultado final antes de aceptarlo."
    },
    {
      type: "single",
      prompt: "¿Por qué un repositorio grande (monorepo) se beneficia especialmente de un agente con herramientas frente a un chat sin ellas?",
      options: [
        "Porque el agente puede explorar la estructura y encontrar patrones repetidos en múltiples archivos antes de proponer un cambio coherente",
        "Porque un chat sin herramientas es siempre más rápido en repos grandes",
        "Porque los repos grandes no pueden usarse con IA de ningún tipo",
        "Porque el tamaño del repo no afecta en nada la calidad de las respuestas"
      ],
      answer: [0],
      explanation: "En un monorepo, un agente con herramientas puede explorar y correlacionar múltiples archivos (ej. cada `Record<LevelId, ...>`) antes de proponer un cambio, algo que un chat sin herramientas no puede hacer por sí mismo."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (agente 'optimiza el proyecto'): ¿cuál fue el problema principal del prompt dado al agente?",
      options: [
        "Era demasiado amplio y no definía alcance ni criterio de éxito verificable",
        "Era demasiado específico sobre un formulario lento",
        "Incluía demasiadas pruebas automatizadas",
        "Prohibía modificar archivos no relacionados"
      ],
      answer: [0],
      explanation: "El prompt 'optimiza el proyecto' abrió la puerta a cambios extensos no solicitados. El equipo adoptó tareas con alcance explícito y criterio de éxito verificable.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (PR de 40 archivos): ¿qué instrucción habría reducido el riesgo de cambios no relacionados?",
      options: [
        "Reduce el tiempo de carga de este formulario específico; no toques otros archivos",
        "Optimiza todo lo que encuentres en el repositorio",
        "Refactoriza cualquier componente que parezca mejorable",
        "Haz el PR más grande para aprovechar la sesión"
      ],
      answer: [0],
      explanation: "La instrucción correcta combina objetivo concreto, superficie acotada y una prohibición explícita de tocar archivos fuera del problema real.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (PR de 40 archivos): ¿cuáles DOS propiedades debe tener una tarea delegada a un agente de código?",
      options: [
        "Alcance explícito",
        "Criterio de éxito verificable",
        "Permiso para refactorizar todo el proyecto",
        "Ausencia total de pruebas para ahorrar tiempo"
      ],
      answer: [0, 1],
      explanation: "El caso concluye exactamente con esas dos reglas: alcance explícito y criterio verificable. Sin ellas, el agente puede producir cambios difíciles de revisar.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (PR de 40 archivos): ¿por qué un PR masivo generado por agente es riesgoso aunque parte del cambio sea útil?",
      options: [
        "Porque mezcla el objetivo real con refactors no solicitados, haciendo difícil revisar intención y regresiones",
        "Porque Git no permite revisar PRs de más de 10 archivos",
        "Porque todo cambio hecho por IA es inválido por definición",
        "Porque los PRs grandes siempre despliegan automáticamente a producción"
      ],
      answer: [0],
      explanation: "El riesgo no es que la IA haya participado, sino que el diff mezcla cambios de distinta intención y aumenta la carga de revisión humana.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (formulario lento): ¿qué evidencia debería acompañar el criterio de éxito?",
      options: [
        "Una medición antes/después del tiempo de carga del formulario afectado",
        "La cantidad total de archivos editados",
        "Una explicación de por qué el agente eligió tantos componentes",
        "Una promesa de que el refactor se revisará después"
      ],
      answer: [0],
      explanation: "Si el problema era un formulario lento, la validación debe medir ese formulario. El tamaño del PR no prueba que el objetivo se cumplió.",
      appliesTo: "caso"
    }
  ],
  46: [
    {
      type: "single",
      prompt: "¿Qué es 'vibe coding' según este módulo?",
      options: [
        "Dejar que un modelo genere una implementación completa a partir de una descripción de alto nivel, iterando sobre el resultado",
        "Un método formal de certificación de código generado por IA",
        "Escribir código exclusivamente a mano sin ninguna ayuda de IA",
        "Un tipo de test automatizado específico de Power Platform"
      ],
      answer: [0],
      explanation: "Vibe coding es dejar que el modelo genere una implementación completa a partir de una descripción de alto nivel, ajustando el resultado de forma iterativa en lugar de especificar cada detalle por adelantado."
    },
    {
      type: "multi",
      prompt: "¿En cuáles DOS escenarios es aceptable usar vibe coding sin controles adicionales estrictos, según este módulo?",
      options: [
        "Un prototipo descartable para explorar una idea",
        "Un script de un solo uso sin impacto en producción",
        "Una validación de seguridad en un plugin que corre en producción",
        "Lógica de negocio con impacto financiero directo"
      ],
      answer: [0, 1],
      explanation: "Prototipos descartables y scripts de un solo uso son escenarios de bajo riesgo aptos para vibe coding; validaciones de seguridad y lógica financiera requieren controles estrictos (tests, revisión humana) antes de aceptarse."
    },
    {
      type: "single",
      prompt: "¿Cuáles son los controles mínimos que hacen seguro el vibe coding, según este módulo?",
      options: [
        "Alcance acotado, tests que validen el comportamiento esperado, y revisión humana antes de fusionar",
        "Ningún control es necesario si el resultado 'se ve bien'",
        "Solo que el código compile sin errores de sintaxis",
        "Que el prompt haya sido largo y detallado"
      ],
      answer: [0],
      explanation: "Alcance acotado, tests de comportamiento y revisión humana obligatoria son los mismos controles que ya exige este plan de estudio para cualquier cambio, y se vuelven más críticos en vibe coding."
    },
    {
      type: "single",
      prompt: "Un maker publicó a producción un flujo de aprobación de gastos generado con vibe coding sin revisión detallada, causando pagos duplicados por una condición de carrera. ¿Qué regla adoptó el equipo después?",
      options: [
        "Todo flujo generado sin revisión detallada pasa primero por un ambiente de pruebas y una revisión de un segundo maker",
        "Prohibir el uso de Power Automate en todo el tenant",
        "Ninguna regla nueva; el incidente fue un caso aislado sin solución",
        "Solo revisar visualmente el flujo, sin pruebas adicionales"
      ],
      answer: [0],
      explanation: "La regla adoptada fue exigir ambiente de pruebas con datos simulados y revisión de un segundo maker antes de publicar cualquier flujo generado sin revisión detallada."
    },
    {
      type: "single",
      prompt: "¿Vibe coding elimina la necesidad de tests y revisión humana?",
      options: [
        "No; los vuelve más críticos porque el humano invirtió menos tiempo revisando cada línea mientras se escribía",
        "Sí, siempre que el modelo usado sea reciente",
        "Sí, porque el objetivo de vibe coding es evitar cualquier revisión",
        "Depende únicamente del lenguaje de programación usado"
      ],
      answer: [0],
      explanation: "Vibe coding no elimina la necesidad de tests y revisión humana; al contrario, los vuelve más críticos porque hubo menos revisión línea por línea durante la generación."
    },
    {
      type: "single",
      prompt: "¿Qué distingue el vibe coding del 'desarrollo asistido por IA normal', según este módulo?",
      options: [
        "El nivel de especificación previa: vibe coding parte de una descripción de alto nivel en lugar de detallar cada paso",
        "Vibe coding nunca usa modelos de lenguaje",
        "El desarrollo asistido normal no permite ningún tipo de revisión",
        "No existe ninguna diferencia real entre ambos términos"
      ],
      answer: [0],
      explanation: "La diferencia está en el nivel de especificación previa: vibe coding parte de una descripción de alto nivel e itera sobre el resultado, en lugar de especificar cada detalle desde el inicio."
    },
    {
      type: "single",
      prompt: "¿Cuál de las siguientes tareas es la MENOS apta para vibe coding sin controles estrictos?",
      options: [
        "Una validación de seguridad en un plugin C# que corre en producción",
        "Un script de reformateo de un CSV de prueba",
        "Un prototipo descartable de una idea de UI",
        "Un componente de exploración sin lógica de negocio sensible"
      ],
      answer: [0],
      explanation: "Cualquier cambio que toque seguridad, datos de producción o lógica de negocio sensible requiere controles estrictos (tests, revisión humana) antes de aceptarse, a diferencia de prototipos o scripts descartables."
    },
    {
      type: "single",
      prompt: "¿Por qué se recomienda tener una regla de equipo explícita sobre cuándo se permite vibe coding, en lugar de decidirlo caso por caso?",
      options: [
        "Para evitar decisiones informales inconsistentes y asegurar que los controles mínimos se apliquen siempre en los casos de riesgo",
        "Porque las reglas escritas hacen que el código generado sea automáticamente más rápido",
        "Porque sin una regla escrita, la IA no puede usarse en absoluto",
        "No hay ninguna razón real para documentar esta regla"
      ],
      answer: [0],
      explanation: "Documentar la regla como estándar de equipo evita que la decisión dependa del criterio individual de cada persona en cada momento, asegurando consistencia en la aplicación de controles."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de gastos): ¿qué práctica causó el incidente de pagos duplicados?",
      options: [
        "Publicar a producción un flujo generado por vibe coding sin revisar cada acción ni probar con datos reales simulados",
        "Usar un flujo de aprobación para gastos",
        "Tener dos aprobadores en el proceso",
        "Probar el flujo antes de publicarlo"
      ],
      answer: [0],
      explanation: "El caso no condena los flujos de aprobación ni los dos aprobadores; el problema fue publicar una generación completa sin revisión detallada ni pruebas suficientes.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de gastos): ¿qué tipo de defecto apareció cuando dos aprobadores actuaron casi al mismo tiempo?",
      options: [
        "Una condición de carrera que duplicó pagos",
        "Una pérdida de contraseña de Dataverse",
        "Un error de certificado de Entra ID",
        "Una falla de formato visual en Canvas Apps"
      ],
      answer: [0],
      explanation: "El caso identifica una condición de carrera entre dos aprobadores como causa inmediata de pagos duplicados.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (flujo de gastos): ¿cuáles DOS controles adoptó el equipo antes de publicar flujos generados sin revisión detallada?",
      options: [
        "Pasar primero por ambiente de pruebas con datos reales simulados",
        "Revisión de un segundo maker",
        "Publicar directo si la primera prueba manual funciona",
        "Eliminar aprobadores para evitar concurrencia"
      ],
      answer: [0, 1],
      explanation: "La regla adoptada fue pruebas con datos realistas en un ambiente seguro y revisión por otro maker. Publicar directo fue el problema original.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de gastos): ¿qué escenario de prueba habría detectado mejor el riesgo antes de producción?",
      options: [
        "Simular dos aprobadores actuando sobre la misma solicitud casi al mismo tiempo",
        "Cambiar el color del correo de aprobación",
        "Ejecutar el flujo una sola vez con un aprobador",
        "Revisar solo que el flujo guarde correctamente"
      ],
      answer: [0],
      explanation: "El defecto surgió por concurrencia entre aprobadores. Una prueba con dos acciones casi simultáneas habría atacado el riesgo central.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de gastos): ¿cuál es la lección principal sobre vibe coding controlado?",
      options: [
        "Puede acelerar prototipos, pero requiere revisión paso a paso, ambiente de prueba y aprobación humana antes de producción",
        "Debe usarse solo para producción porque ahorra más tiempo",
        "Elimina la necesidad de makers expertos",
        "Solo sirve si se omiten pruebas para mantener velocidad"
      ],
      answer: [0],
      explanation: "El módulo promueve control: usar IA para acelerar, manteniendo revisión, pruebas y separación de entornos antes de publicar.",
      appliesTo: "caso"
    }
  ],
  47: [
    {
      type: "single",
      prompt: "¿Qué es una plantilla de prompt reutilizable?",
      options: [
        "Una instrucción parametrizable que fija contexto, formato de salida y restricciones, dejando solo los datos específicos como variables",
        "Un archivo de configuración que reemplaza al código fuente",
        "Una función de Power Fx predefinida por Microsoft",
        "Un historial de chat guardado sin ninguna estructura"
      ],
      answer: [0],
      explanation: "Una plantilla de prompt fija contexto, restricciones y formato de salida, parametrizando solo lo que cambia entre usos, para producir resultados consistentes en tareas recurrentes."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS elementos debe incluir una buena plantilla de prompt según este módulo?",
      options: [
        "Restricciones explícitas (qué NO hacer, qué patrón seguir)",
        "El formato de salida esperado (código, diff, lista de pasos)",
        "La mayor cantidad de texto posible sin estructura",
        "Ninguna referencia al contexto o convenciones del proyecto"
      ],
      answer: [0, 1],
      explanation: "Restricciones explícitas y formato de salida esperado son componentes clave de una plantilla efectiva, junto con el rol/contexto y la tarea concreta."
    },
    {
      type: "single",
      prompt: "¿Por qué conviene versionar las plantillas de prompt en el repositorio con git, en lugar de dejarlas solo en el historial de un chat?",
      options: [
        "Porque permiten historial de cambios y evitan perder ajustes útiles cuando dejan de funcionar bien",
        "Porque git ejecuta automáticamente los prompts guardados",
        "Porque el historial de chat siempre se borra automáticamente cada semana",
        "No hay ninguna ventaja real en versionarlas"
      ],
      answer: [0],
      explanation: "Versionar las plantillas en el repositorio permite historial de cambios con git, igual que con el código, en lugar de depender de un historial de chat que se puede perder."
    },
    {
      type: "single",
      prompt: "En SIT, cada desarrollador pedía 'genera un flujo de aprobación' con una instrucción distinta, produciendo flujos inconsistentes. ¿Qué solucionó el problema?",
      options: [
        "Introducir una plantilla común con convención de nombres, patrón de dos aprobadores y manejo de rechazo ya especificados",
        "Prohibir el uso de Power Automate para flujos de aprobación",
        "Pedir a cada desarrollador que memorice el mismo prompt de memoria",
        "Ninguna solución fue posible sin cambiar de plataforma"
      ],
      answer: [0],
      explanation: "Una plantilla común con las convenciones ya especificadas mejoró la consistencia y redujo el tiempo de creación de flujos nuevos entre distintos desarrolladores."
    },
    {
      type: "single",
      prompt: "¿Qué riesgo tiene una plantilla de prompt demasiado rígida?",
      options: [
        "Puede fallar en casos particulares al sobre-especificar cada detalle sin dejar espacio de ajuste",
        "Ninguno; entre más rígida, mejor funciona siempre",
        "Que consuma menos tokens de los necesarios",
        "Que deje de ser compatible con cualquier modelo de IA"
      ],
      answer: [0],
      explanation: "Una plantilla demasiado rígida cubre mal los casos particulares; el balance recomendado es cubrir el caso común como plantilla y dejar el resto para ajuste manual explícito."
    },
    {
      type: "single",
      prompt: "¿Qué parte de una plantilla de prompt se marca típicamente como variable (ej. `{{tabla}}`)?",
      options: [
        "Los datos específicos de cada uso, como el nombre de la tabla o los campos involucrados",
        "Las restricciones generales que nunca cambian entre usos",
        "El formato de salida esperado",
        "El nombre del modelo de IA que se va a usar"
      ],
      answer: [0],
      explanation: "Las variables de una plantilla son los datos específicos de cada tarea (nombre de entidad, campos, condición), mientras que el contexto y las restricciones generales permanecen fijos."
    },
    {
      type: "single",
      prompt: "¿Cuál es el equilibrio recomendado al diseñar una plantilla de prompt?",
      options: [
        "Cubrir el 80% del caso común como plantilla, dejando el 20% restante para ajuste manual",
        "Especificar el 100% de los casos posibles sin dejar ningún ajuste manual",
        "No especificar nada y dejarlo completamente abierto siempre",
        "Cambiar la plantilla completa cada vez que se usa"
      ],
      answer: [0],
      explanation: "Una plantilla útil cubre el caso común (evitando reescribir todo cada vez) sin ser tan rígida que falle en variaciones razonables del caso, dejando ese margen para ajuste manual."
    },
    {
      type: "single",
      prompt: "¿Cuándo se debe actualizar una plantilla de prompt ya guardada en el repositorio?",
      options: [
        "Cuando deja de producir buenos resultados, de forma similar a cuando se refactoriza código",
        "Nunca; una plantilla de prompt es inmutable una vez creada",
        "Solo cuando cambia el proveedor de IA usado, sin importar la calidad del resultado",
        "Cada vez que se usa, sin importar si sigue funcionando bien"
      ],
      answer: [0],
      explanation: "Las plantillas se revisan y actualizan cuando dejan de dar buenos resultados, aplicando el mismo criterio de mantenimiento que se usa para refactorizar código."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plantillas SIT): ¿qué problema provocaba que cada desarrollador pidiera 'genera un flujo de aprobación' con instrucciones distintas?",
      options: [
        "Flujos con estructura y nomenclatura inconsistentes, difíciles de mantener en equipo",
        "Imposibilidad técnica de crear flujos de aprobación",
        "Bloqueo automático de Power Automate",
        "Eliminación de la convención de publisher en Dataverse"
      ],
      answer: [0],
      explanation: "El caso describe inconsistencia entre proyectos como problema principal: estructuras y nombres distintos dificultaban mantenimiento.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plantillas SIT): ¿qué elemento de la plantilla común ayudó a estandarizar los flujos?",
      options: [
        "Convención de nombres `sit_`, patrón de dos aprobadores y manejo de rechazo especificados",
        "Instrucciones vagas para que cada desarrollador decidiera el patrón",
        "Uso obligatorio de System Administrator en todos los conectores",
        "Eliminación de cualquier prefijo para ahorrar caracteres"
      ],
      answer: [0],
      explanation: "La plantilla común incluyó convenciones concretas: prefijo, patrón de aprobación y manejo de rechazo. Eso permitió consistencia repetible.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (plantillas SIT): ¿cuáles DOS beneficios produjo introducir prompts técnicos reutilizables?",
      options: [
        "Redujo el tiempo de creación de nuevos flujos",
        "Mejoró la consistencia entre flujos de distintos desarrolladores",
        "Eliminó la necesidad de revisar los flujos generados",
        "Permitió usar nombres distintos en cada proyecto sin impacto"
      ],
      answer: [0, 1],
      explanation: "El caso menciona explícitamente menor tiempo de creación y mejor consistencia. La revisión humana sigue siendo necesaria.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plantillas SIT): si un equipo quiere mantener flujos a largo plazo, ¿por qué una plantilla de prompt es mejor que prompts improvisados?",
      options: [
        "Porque captura decisiones repetibles de arquitectura, nombres y manejo de errores para que todos partan del mismo estándar",
        "Porque garantiza que ningún flujo tendrá errores",
        "Porque impide que un maker revise el resultado",
        "Porque reemplaza la documentación del proceso de negocio"
      ],
      answer: [0],
      explanation: "Una plantilla reutilizable no garantiza perfección, pero sí vuelve repetibles las decisiones importantes y reduce variación accidental.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (plantillas SIT): ¿qué señal indicaría que el equipo volvió al problema original?",
      options: [
        "Cada nuevo flujo usa nombres, estructura y manejo de rechazo diferentes sin justificación",
        "Todos los flujos usan el prefijo `sit_`",
        "Los flujos comparten el patrón de dos aprobadores cuando aplica",
        "Los desarrolladores reutilizan una plantilla revisada"
      ],
      answer: [0],
      explanation: "La variación injustificada en nombres, estructura y manejo de rechazo era justamente el síntoma que la plantilla buscaba corregir.",
      appliesTo: "caso"
    }
  ],
  48: [
    {
      type: "single",
      prompt: "Al revisar un diff generado por IA, ¿qué es lo primero que se debe verificar según este módulo?",
      options: [
        "Si el diff toca solo lo que la tarea pedía, o incluye cambios fuera de alcance",
        "Si el código usa la sintaxis más moderna disponible",
        "Si el número de líneas del diff es menor a 50",
        "Si el diff fue generado por un modelo de pago o gratuito"
      ],
      answer: [0],
      explanation: "Verificar el alcance del diff es el primer paso: un cambio que toca archivos no relacionados con la tarea pedida es una señal de alarma, generado por IA o no."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS aspectos de seguridad se deben revisar con atención especial en un diff generado por IA?",
      options: [
        "Credenciales o secretos hardcodeados",
        "Cambios en Security Roles o permisos de Dataverse",
        "El color de los botones de la interfaz",
        "El número de comentarios en el código"
      ],
      answer: [0, 1],
      explanation: "Secretos hardcodeados y cambios de permisos/Security Roles son riesgos de seguridad concretos que deben revisarse explícitamente en cualquier diff, generado por IA o no."
    },
    {
      type: "single",
      prompt: "¿Qué rol cumple un revisor automático de PRs (como Copilot code review) según este módulo?",
      options: [
        "Es un apoyo que acelera dónde mirar, pero no reemplaza el juicio humano final",
        "Reemplaza por completo la necesidad de revisión humana",
        "Solo sirve para revisar la ortografía de los comentarios",
        "Aprueba automáticamente cualquier PR sin intervención humana"
      ],
      answer: [0],
      explanation: "Los revisores automáticos aceleran encontrar dónde mirar con más atención, pero la aprobación final sigue dependiendo del juicio humano."
    },
    {
      type: "single",
      prompt: "En un caso de SIT, un PR resolvía el bug reportado pero también eliminaba una validación de rango no documentada. ¿Qué regla se adoptó tras ese incidente?",
      options: [
        "Revisar cada línea cambiada contra su propia justificación, no solo contra si el síntoma reportado se resolvió",
        "Dejar de usar IA para generar cualquier PR en el futuro",
        "Aprobar automáticamente cualquier PR que resuelva el bug reportado",
        "Eliminar la revisión de código para acelerar los releases"
      ],
      answer: [0],
      explanation: "La regla adoptada fue revisar el diff completo línea por línea contra su justificación, no solo verificar si el síntoma reportado quedó resuelto."
    },
    {
      type: "single",
      prompt: "¿Por qué se recomienda tener una checklist corta y consistente para revisar diffs, en lugar de revisar 'a ojo'?",
      options: [
        "Para que la calidad de la revisión no dependa del tiempo disponible o el estado de ánimo del revisor ese día",
        "Porque una checklist siempre reduce el número de líneas del diff",
        "Porque sin checklist, git no permite hacer merge del PR",
        "No hay ninguna razón real, es solo una preferencia estética"
      ],
      answer: [0],
      explanation: "Una checklist consistente (alcance, efectos secundarios, seguridad, tests) asegura que la revisión no varíe según el tiempo o disposición del revisor en un momento dado."
    },
    {
      type: "single",
      prompt: "¿Qué se entiende por 'efecto secundario' de un diff generado por IA?",
      options: [
        "Que el cambio resuelva el síntoma pedido pero introduzca un problema distinto (ej. quitar una validación en lugar de corregir la causa)",
        "Que el código tarde más de lo esperado en compilar",
        "Que el diff tenga más de una línea de código",
        "Que el desarrollador tarde más de una hora en escribir el prompt"
      ],
      answer: [0],
      explanation: "Un efecto secundario es un problema distinto introducido al resolver el síntoma pedido, como eliminar una validación existente en lugar de corregir la causa real del bug."
    },
    {
      type: "single",
      prompt: "¿Qué checklist mínima se recomienda aplicar a cualquier diff, generado por IA o no?",
      options: [
        "Alcance, efectos secundarios, seguridad y presencia de tests",
        "Solo el número de archivos modificados",
        "Únicamente el estilo de indentación del código",
        "Solo si el PR tiene más de 100 líneas"
      ],
      answer: [0],
      explanation: "La checklist recomendada cubre alcance, efectos secundarios, seguridad y tests — los cuatro aspectos que este módulo identifica como críticos en cualquier revisión de diff."
    },
    {
      type: "single",
      prompt: "¿Es aceptable aprobar un PR basándose únicamente en el resumen generado por un revisor automático de IA?",
      options: [
        "No; el revisor automático es un apoyo, la aprobación final requiere revisión humana del diff",
        "Sí, siempre que el resumen no mencione errores",
        "Sí, si el PR tiene menos de 10 líneas",
        "Depende únicamente de qué modelo generó el resumen"
      ],
      answer: [0],
      explanation: "El revisor automático acelera encontrar dónde mirar, pero no sustituye el juicio humano final antes de aprobar un PR."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (PR con validación eliminada): ¿por qué el PR era peligroso aunque resolvía el bug reportado?",
      options: [
        "Porque también eliminaba una validación de rango con razón de negocio no documentada",
        "Porque todo PR generado con IA debe rechazarse automáticamente",
        "Porque los cálculos en flujos nunca deben modificarse",
        "Porque el revisor no ejecutó `pac org who`"
      ],
      answer: [0],
      explanation: "El peligro fue un cambio colateral: el bug se resolvía, pero se eliminaba una validación existente importante para el negocio.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (PR con validación eliminada): ¿qué pregunta de revisión adoptó el equipo después del incidente?",
      options: [
        "¿Por qué cambió esto?",
        "¿La IA respondió rápido?",
        "¿El PR tiene menos de 5 archivos?",
        "¿El commit menciona una herramienta de IA?"
      ],
      answer: [0],
      explanation: "La regla adoptada fue revisar cada línea contra la intención: no solo confirmar que el síntoma reportado desapareció.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (PR con validación eliminada): ¿cuáles DOS hábitos habrían reducido el riesgo de aprobar el cambio?",
      options: [
        "Revisar el diff completo línea por línea",
        "Comparar cada cambio contra la intención original o regla de negocio",
        "Aprobar si el bug reportado ya no se reproduce",
        "Omitir archivos no relacionados porque el agente los tocó"
      ],
      answer: [0, 1],
      explanation: "El problema fue enfocarse solo en el síntoma resuelto. La revisión debe cubrir todo el diff y preguntar por la razón de cada cambio.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (PR con validación eliminada): ¿qué documentación habría ayudado al revisor humano?",
      options: [
        "Una nota explicando la razón de negocio de la validación de rango",
        "Un comentario diciendo que el bug fue corregido visualmente",
        "Una captura del editor de flujo",
        "El nombre del agente que hizo el cambio"
      ],
      answer: [0],
      explanation: "La validación tenía una razón de negocio no documentada. Documentarla habría hecho más visible que eliminarla era riesgoso.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (PR con validación eliminada): ¿cuál es el rol correcto de la IA en una revisión de diff?",
      options: [
        "Ayudar a detectar cambios sospechosos y explicar impacto, sin reemplazar la aprobación humana línea por línea",
        "Aprobar automáticamente todo cambio que compile",
        "Ocultar cambios colaterales para que el PR sea más fácil de leer",
        "Eliminar validaciones antiguas si no entiende su propósito"
      ],
      answer: [0],
      explanation: "La IA puede ayudar, pero la responsabilidad final sigue siendo del revisor humano que entiende intención, reglas de negocio e impacto.",
      appliesTo: "caso"
    }
  ],
  49: [
    {
      type: "single",
      prompt: "¿Por qué nunca se debe pegar una credencial real (ej. connection string) en un prompt?",
      options: [
        "Porque puede quedar almacenada en el historial de la herramienta o en logs del proveedor según su política de retención",
        "Porque los prompts tienen un límite de caracteres que impide pegar credenciales",
        "Porque las credenciales siempre se cifran automáticamente al pegarse en un prompt",
        "No hay ningún riesgo real en hacerlo si el prompt se borra después"
      ],
      answer: [0],
      explanation: "Un secreto pegado en un prompt puede persistir en el historial de la herramienta o en logs del proveedor, exponiendo la credencial más allá de la sesión donde se usó."
    },
    {
      type: "single",
      prompt: "¿Qué se debe usar en lugar de datos reales de clientes al construir un ejemplo para compartir con una herramienta de IA?",
      options: [
        "Datos ficticios o anonimizados que preserven la estructura pero no el contenido real",
        "Los mismos datos reales, pero acortados",
        "Datos reales de un cliente distinto al del proyecto actual",
        "No es necesario cambiar nada si el chat es privado"
      ],
      answer: [0],
      explanation: "Usar datos ficticios o anonimizados que preserven la estructura evita exponer información real de clientes al compartir ejemplos con una herramienta de IA."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS aspectos se deben verificar respecto a la residencia y retención de datos antes de usar una herramienta de IA con datos reales de un tenant con requisitos de compliance?",
      options: [
        "En qué región procesa las solicitudes el proveedor del modelo",
        "La política de retención de logs/historial del proveedor",
        "El color del logo de la herramienta",
        "La cantidad de usuarios que tiene licencia en el tenant"
      ],
      answer: [0, 1],
      explanation: "La región de procesamiento y la política de retención de datos del proveedor son los dos aspectos clave a verificar antes de usar IA con datos reales bajo requisitos de residencia o GDPR."
    },
    {
      type: "single",
      prompt: "En el caso de SIT, un desarrollador pegó una cadena de conexión completa con credenciales reales en un prompt. ¿Qué regla adoptó el equipo después del incidente?",
      options: [
        "Ningún secreto real se pega en un prompt; siempre se usan placeholders y los valores reales viven en Environment Variables/Key Vault",
        "Prohibir el uso de cualquier herramienta de IA en el equipo de forma permanente",
        "Cambiar la contraseña cada semana sin ninguna otra medida",
        "Ninguna regla nueva, el incidente no tuvo consecuencias"
      ],
      answer: [0],
      explanation: "La regla adoptada fue usar siempre placeholders en los prompts y mantener los valores reales exclusivamente en Environment Variables o Key Vault, nunca en texto plano en una conversación con IA."
    },
    {
      type: "single",
      prompt: "¿Qué permite configurar el Power Platform Admin Center respecto a IA generativa y conectores por entorno?",
      options: [
        "Políticas DLP que restringen qué conectores e IA generativa están disponibles en cada entorno",
        "Solo el idioma de la interfaz de Power Apps",
        "El número máximo de usuarios que pueden iniciar sesión",
        "No existe ninguna configuración relacionada con IA en el Admin Center"
      ],
      answer: [0],
      explanation: "Las políticas DLP del Admin Center permiten restringir qué conectores e IA generativa están disponibles por entorno, aplicando la misma lógica de gobernanza de datos que a otros conectores."
    },
    {
      type: "single",
      prompt: "¿Por qué los logs de una herramienta de IA son relevantes para la seguridad de secretos?",
      options: [
        "Porque si se pegó un secreto en un prompt, ese secreto persiste también en los logs de auditoría de la herramienta",
        "Porque los logs siempre se eliminan automáticamente cada hora",
        "Porque los logs solo registran el nombre del usuario, nunca el contenido del prompt",
        "Los logs no tienen ninguna relación con la seguridad de secretos"
      ],
      answer: [0],
      explanation: "Si una herramienta registra qué se le pidió, cualquier secreto pegado en un prompt persiste también en esos logs, ampliando la superficie de exposición."
    },
    {
      type: "single",
      prompt: "¿Qué se debe hacer inmediatamente si se detecta que una credencial real fue pegada por error en un prompt?",
      options: [
        "Rotar la credencial de inmediato",
        "Ignorarlo si el chat es privado",
        "Esperar a la próxima auditoría programada para actuar",
        "Solo notificar sin tomar ninguna acción sobre la credencial"
      ],
      answer: [0],
      explanation: "Ante la exposición de una credencial real, la acción inmediata correcta es rotarla, sin importar si el canal donde se expuso parece privado."
    },
    {
      type: "single",
      prompt: "¿Qué principio de gobernanza de datos aplica igual a conectores tradicionales y a herramientas de IA generativa en Power Platform?",
      options: [
        "El control por política DLP y clasificación de datos de cada entorno",
        "Ninguno; la IA generativa está exenta de cualquier política de gobernanza",
        "Solo aplica a conectores premium, no a IA generativa",
        "Solo aplica en entornos de producción, nunca en desarrollo"
      ],
      answer: [0],
      explanation: "La misma lógica de gobernanza de datos (políticas DLP, clasificación de datos por entorno) aplicada a conectores tradicionales debe aplicarse también a las herramientas de IA generativa."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (secreto en prompt): ¿cuál fue el incidente de seguridad principal?",
      options: [
        "Se pegó una cadena de conexión real con usuario y contraseña en el historial de una herramienta de IA",
        "Se usó un placeholder en lugar de una credencial real",
        "Se guardó la credencial en Key Vault",
        "Se documentó la variable de entorno sin valor"
      ],
      answer: [0],
      explanation: "El caso describe exposición de una credencial real en el historial de la herramienta. Placeholders y Key Vault son controles correctos, no incidentes.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (secreto en prompt): ¿cuál fue la primera acción correctiva adecuada?",
      options: [
        "Rotar la credencial expuesta de inmediato",
        "Borrar solo el mensaje local y seguir usando la misma contraseña",
        "Publicar la cadena de conexión en el repositorio para auditarla",
        "Cambiar el nombre de la variable sin cambiar el valor"
      ],
      answer: [0],
      explanation: "Una credencial expuesta debe considerarse comprometida. Rotarla inmediatamente reduce la ventana de abuso.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (secreto en prompt): ¿cuáles DOS reglas adoptó el equipo para evitar repetir el incidente?",
      options: [
        "Usar placeholders como `{{CONNECTION_STRING}}` en prompts",
        "Guardar valores reales en Environment Variables o Key Vault, no en conversaciones",
        "Pegar secretos reales solo si el modelo promete no guardarlos",
        "Compartir contraseñas en texto plano para acelerar revisiones"
      ],
      answer: [0, 1],
      explanation: "El caso establece placeholders para prompts y almacenamiento seguro para valores reales. Nunca se deben pegar secretos reales en conversaciones con IA.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (secreto en prompt): si necesitas que la IA genere código de conexión, ¿qué dato deberías proporcionar?",
      options: [
        "Un placeholder con nombre claro, por ejemplo `{{CONNECTION_STRING}}`",
        "La cadena de conexión completa de staging",
        "Un token de producción recién generado",
        "Usuario y contraseña reales para que pruebe el ejemplo"
      ],
      answer: [0],
      explanation: "La IA necesita la forma del dato, no el secreto real. Los placeholders permiten explicar estructura sin exponer credenciales.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (secreto en prompt): ¿por qué staging no debe tratarse como 'seguro para compartir'?",
      options: [
        "Porque una credencial de staging puede dar acceso real a sistemas y datos, y también abrir camino a otros entornos",
        "Porque staging siempre es público por definición",
        "Porque solo producción requiere rotación de secretos",
        "Porque los modelos de IA rechazan automáticamente cualquier secreto de staging"
      ],
      answer: [0],
      explanation: "Staging sigue siendo un entorno real. Sus credenciales deben protegerse y rotarse si se exponen igual que cualquier secreto operativo.",
      appliesTo: "caso"
    }
  ],
  50: [
    {
      type: "single",
      prompt: "¿Por qué un test que valida comportamiento es más confiable que solo verificar que el código 'compile', para código generado por IA?",
      options: [
        "Porque confirma objetivamente que el cambio hace lo que se pidió, incluso si el revisor humano no detectó un problema a simple vista",
        "Porque compilar y pasar tests son exactamente la misma verificación",
        "Porque un test siempre es más rápido de escribir que revisar el código",
        "Los tests no aportan ninguna garantía adicional sobre el código generado por IA"
      ],
      answer: [0],
      explanation: "Un test de comportamiento verifica objetivamente el resultado esperado, cubriendo casos que una revisión visual humana podría pasar por alto, especialmente en código generado por IA."
    },
    {
      type: "single",
      prompt: "Según el pipeline de este proyecto (`ci.yml`), ¿cuáles son los gates obligatorios antes de un deploy?",
      options: [
        "Lint & Type Check → Unit Tests → Playwright Smoke → Build → Deploy",
        "Solo un build manual sin ninguna verificación automatizada",
        "Únicamente una revisión visual del sitio en producción",
        "Solo la ejecución de `npm install`"
      ],
      answer: [0],
      explanation: "El pipeline de CI de este proyecto encadena lint/typecheck, tests unitarios, smoke tests E2E, build y despliegue, actuando como red de seguridad para cualquier cambio, generado por IA o no."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS beneficios aportan un feature flag o un despliegue progresivo para un cambio de alto riesgo generado con IA?",
      options: [
        "Permite revertir el cambio sin un despliegue de emergencia si se detecta un problema",
        "Limita el impacto inicial del cambio antes de un rollout completo",
        "Elimina por completo la necesidad de tests para ese cambio",
        "Garantiza que el cambio nunca tendrá errores"
      ],
      answer: [0, 1],
      explanation: "Un feature flag o despliegue progresivo permite reversión rápida y limita el impacto inicial, pero no elimina la necesidad de tests ni de revisión — son complementarios, no sustitutos."
    },
    {
      type: "single",
      prompt: "Un equipo de SIT fusionó un cambio generado por IA saltándose el pipeline de CI 'para ir rápido', causando una regresión en un cálculo de descuentos. ¿Qué política se adoptó después?",
      options: [
        "Ningún cambio, generado por IA o no, se fusiona sin pasar por el pipeline de CI completo, sin excepciones por urgencia",
        "Prohibir el uso de IA para generar cualquier cambio en el futuro",
        "Permitir saltarse el pipeline solo en viernes por la tarde",
        "Ninguna política nueva; el incidente se consideró normal"
      ],
      answer: [0],
      explanation: "La política adoptada fue no fusionar nunca un cambio sin pasar por el pipeline de CI completo, sin excepciones por presión de tiempo."
    },
    {
      type: "single",
      prompt: "¿Qué señal de alerta representa que un cambio generado por IA reduzca la cobertura de tests existente del proyecto?",
      options: [
        "Es una señal de alerta que debe revisarse, generado por IA o no, respecto al umbral de cobertura configurado (80% en este proyecto)",
        "Ninguna; reducir la cobertura siempre es aceptable si el cambio es pequeño",
        "Solo es relevante si la reducción supera el 50%",
        "La cobertura de tests no tiene relación con cambios generados por IA"
      ],
      answer: [0],
      explanation: "Cualquier reducción de cobertura respecto al umbral configurado es una señal de alerta a revisar, sin excepción por el origen del cambio (IA o humano)."
    },
    {
      type: "single",
      prompt: "¿Qué detectan ESLint y `tsc --noEmit` en un cambio generado por IA, sin necesidad de revisión manual línea por línea?",
      options: [
        "Patrones inseguros o incorrectos como variables sin usar o tipos incorrectos",
        "Errores de lógica de negocio específicos del dominio",
        "Si el cambio resuelve correctamente el problema reportado",
        "El nivel de satisfacción del cliente con el cambio"
      ],
      answer: [0],
      explanation: "Los linters y type-checkers detectan patrones estructurales inseguros o incorrectos automáticamente, complementando pero no reemplazando la revisión de lógica de negocio."
    },
    {
      type: "single",
      prompt: "¿Qué se recomienda hacer con un cambio de alto riesgo generado con asistencia de IA en un flujo de aprobación real?",
      options: [
        "Diseñar su despliegue detrás de un feature flag o en un entorno de pruebas antes de producción",
        "Desplegarlo directamente a producción sin pruebas adicionales por ser 'solo un ajuste menor'",
        "Omitir los tests si el cambio fue generado por un agente confiable",
        "Aplicarlo simultáneamente a todos los entornos sin distinción de riesgo"
      ],
      answer: [0],
      explanation: "Para cambios de alto riesgo, se recomienda un despliegue detrás de un feature flag o en un entorno de pruebas primero, permitiendo reversión rápida si se detecta un problema."
    },
    {
      type: "single",
      prompt: "¿Qué gate del pipeline de CI de este proyecto atraparía un error de tipos introducido por un cambio generado con IA?",
      options: [
        "Lint & Type Check (incluye `tsc --noEmit`)",
        "Únicamente el paso de Deploy",
        "Solo Playwright Smoke",
        "Ningún gate del pipeline detecta errores de tipos"
      ],
      answer: [0],
      explanation: "El job 'Lint & Type Check' del pipeline ejecuta `tsc --noEmit`, que detecta errores de tipos antes de que el cambio llegue a los siguientes gates."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (cambio sin CI): ¿qué decisión permitió que una regresión de descuentos llegara a producción?",
      options: [
        "Fusionar un cambio generado por agente sin tests ni pipeline de CI completo",
        "Usar un pipeline de CI con pruebas automatizadas",
        "Exigir revisión antes de merge",
        "Detectar el problema durante una prueba automatizada"
      ],
      answer: [0],
      explanation: "El equipo se saltó tests y CI 'para ir rápido'. La regresión no se detectó hasta que un cliente reportó una factura incorrecta.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (cambio sin CI): ¿por qué la prueba visual manual fue insuficiente?",
      options: [
        "Porque no cubría el cálculo de descuentos que terminó regresando",
        "Porque las pruebas manuales siempre están prohibidas",
        "Porque Playwright solo funciona en producción",
        "Porque los descuentos no pueden probarse automáticamente"
      ],
      answer: [0],
      explanation: "La prueba visual validó apariencia o flujo básico, pero no el cálculo de negocio afectado. Se necesitaban pruebas y CI.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (cambio sin CI): ¿cuáles DOS controles son obligatorios antes de fusionar cambios generados por IA?",
      options: [
        "Tests relevantes para la lógica modificada",
        "Pipeline de CI completo en verde",
        "Aprobación automática por la herramienta de IA",
        "Omitir validaciones por urgencia"
      ],
      answer: [0, 1],
      explanation: "La política adoptada fue sin excepciones: ningún cambio se fusiona sin pasar por CI completo, y las pruebas deben cubrir la lógica que cambió.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (cambio sin CI): ¿qué frase refleja mejor la política adoptada después del incidente?",
      options: [
        "Ningún cambio, generado por IA o no, se fusiona sin pasar por CI completo",
        "Los cambios generados por IA pueden saltarse CI si parecen correctos",
        "CI solo aplica a cambios escritos manualmente",
        "La urgencia permite omitir pruebas si el cliente espera"
      ],
      answer: [0],
      explanation: "El caso declara la política explícita: sin excepciones por urgencia y sin distinción entre cambios generados por IA o humanos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (cambio sin CI): ¿qué test habría atacado directamente la regresión reportada por el cliente?",
      options: [
        "Una prueba automatizada del cálculo de descuentos con escenarios límite",
        "Una prueba visual del color del botón de factura",
        "Un test que solo confirma que la página carga",
        "Una validación de que el agente respondió en menos de un minuto"
      ],
      answer: [0],
      explanation: "La regresión fue de cálculo de descuentos. La cobertura debe probar esa regla de negocio, incluyendo casos límite.",
      appliesTo: "caso"
    }
  ],
  51: [
    {
      type: "single",
      prompt: "¿Cuál es la primera etapa del flujo recomendado 'humano diseña, IA implementa, CI valida, humano aprueba'?",
      options: [
        "Humano diseña: definir el problema, el alcance y el criterio de éxito antes de involucrar a la IA",
        "IA implementa, sin ninguna definición previa de alcance",
        "CI valida, antes de que exista ningún cambio",
        "Humano aprueba, como primer paso del ciclo"
      ],
      answer: [0],
      explanation: "La etapa de diseño humano —definir problema, alcance y criterio de éxito— siempre precede a la implementación asistida por IA, y no se delega."
    },
    {
      type: "single",
      prompt: "¿Qué ocurre si la etapa 'CI valida' falla dentro de este flujo?",
      options: [
        "Se ajusta la implementación y se vuelve a validar; nunca se salta esta etapa para avanzar más rápido",
        "Se fusiona igual el cambio y se corrige después en producción",
        "Se elimina el pipeline de CI para ese cambio específico",
        "Se repite exactamente la misma implementación sin cambios"
      ],
      answer: [0],
      explanation: "Ante un fallo de CI, se corrige la implementación y se revalida; el flujo nunca se acorta saltando esta etapa, sin importar la presión de tiempo."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS acciones corresponden a la etapa 'humano aprueba' del flujo recomendado?",
      options: [
        "Revisar el diff completo contra el criterio de éxito original",
        "Verificar alcance, efectos secundarios y seguridad antes de fusionar",
        "Delegar la aprobación final a un revisor automático sin lectura humana",
        "Omitir la aprobación si el cambio pasó CI exitosamente"
      ],
      answer: [0, 1],
      explanation: "La aprobación humana revisa el diff completo contra el criterio de éxito original, verificando alcance, efectos secundarios y seguridad — pasar CI no reemplaza esta revisión."
    },
    {
      type: "single",
      prompt: "El equipo de plataforma de SIT adoptó este flujo de 4 etapas después de dos incidentes previos. ¿Qué resultado midieron en los primeros 3 meses?",
      options: [
        "Una baja medible en regresiones detectadas en producción, con tiempo total por cambio comparable al proceso anterior",
        "Un aumento significativo en el tiempo total de cada cambio sin ninguna mejora en calidad",
        "Ninguna diferencia medible respecto al proceso anterior",
        "Una eliminación completa de la necesidad de revisión humana"
      ],
      answer: [0],
      explanation: "El equipo midió una baja medible en regresiones en producción, con un tiempo total por cambio comparable al proceso anterior — la ganancia estuvo en reducir el tiempo de implementación, no en saltarse etapas."
    },
    {
      type: "single",
      prompt: "¿Qué se debe hacer si el criterio de éxito de una tarea cambia a mitad de la implementación?",
      options: [
        "Volver formalmente a la etapa de diseño antes de continuar, en lugar de re-especificar sobre la marcha sin documentarlo",
        "Continuar la implementación ajustando el criterio informalmente sin volver a ninguna etapa",
        "Ignorar el cambio de criterio y entregar el resultado original de todas formas",
        "Saltar directamente a la etapa de aprobación humana sin pasar por CI"
      ],
      answer: [0],
      explanation: "Un cambio de criterio de éxito exige volver formalmente a la etapa de diseño, documentando el nuevo alcance, en lugar de ajustar el rumbo sobre la marcha sin dejarlo explícito."
    },
    {
      type: "single",
      prompt: "¿Por qué la etapa 'IA implementa' se beneficia de las plantillas de prompt del Módulo 47 y las tareas acotadas del Módulo 45?",
      options: [
        "Porque un alcance claro y un formato de instrucción reutilizable reducen la probabilidad de un resultado fuera de alcance o inconsistente",
        "Porque las plantillas de prompt eliminan la necesidad de la etapa de diseño",
        "Porque las tareas acotadas hacen innecesaria la validación de CI",
        "No existe relación real entre estas prácticas y la etapa de implementación"
      ],
      answer: [0],
      explanation: "Las plantillas de prompt y las tareas acotadas y verificables reducen el riesgo de resultados fuera de alcance o inconsistentes durante la etapa de implementación asistida por IA."
    },
    {
      type: "single",
      prompt: "¿Qué principio general resume el flujo 'humano diseña, IA implementa, CI valida, humano aprueba'?",
      options: [
        "Cada etapa es un gate independiente: un cambio no avanza a la siguiente hasta que la etapa anterior se cumple satisfactoriamente",
        "La IA reemplaza completamente al humano en todas las etapas excepto la primera",
        "El pipeline de CI es opcional si el humano ya aprobó el cambio visualmente",
        "Todas las etapas pueden ejecutarse en paralelo sin ningún orden específico"
      ],
      answer: [0],
      explanation: "El flujo trata cada etapa como un gate independiente y secuencial: diseño, implementación, validación y aprobación, sin saltar ni paralelizar etapas que dependen de la anterior."
    },
    {
      type: "single",
      prompt: "Al completar un cambio real en el repositorio siguiendo este flujo de 4 etapas, ¿qué se espera documentar al final, según la actividad práctica de este módulo?",
      options: [
        "En qué etapa (si alguna) fue necesario devolverse a un paso anterior y por qué",
        "Únicamente el tiempo total que tomó escribir el prompt inicial",
        "El nombre del modelo de IA usado, sin ningún otro detalle",
        "No es necesario documentar nada si el cambio pasó CI"
      ],
      answer: [0],
      explanation: "La actividad práctica pide documentar explícitamente en qué etapa (si alguna) se tuvo que retroceder y por qué, como parte del aprendizaje del ciclo completo."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de 4 etapas): ¿qué problema buscaba corregir el equipo al adoptar Humano diseña, IA implementa, CI valida, Humano aprueba?",
      options: [
        "Incidentes causados por saltarse CI o aprobación humana para ir más rápido",
        "Falta de modelos de IA disponibles para escribir código",
        "Exceso de documentación de requisitos",
        "Imposibilidad de usar GitHub Actions"
      ],
      answer: [0],
      explanation: "El caso conecta el flujo con incidentes previos por saltarse validación y aprobación. La solución mantiene esas etapas intactas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de 4 etapas): ¿dónde se obtuvo la ganancia de productividad?",
      options: [
        "En reducir tiempo de implementación, no en eliminar validación ni aprobación",
        "En quitar CI del proceso",
        "En eliminar la revisión humana final",
        "En publicar directo desde el entorno de desarrollo"
      ],
      answer: [0],
      explanation: "El caso dice que la ganancia no fue saltarse pasos, sino acelerar implementación manteniendo validación y aprobación humana.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (flujo de 4 etapas): ¿cuáles DOS etapas NO deben eliminarse aunque la IA implemente más rápido?",
      options: [
        "CI valida",
        "Humano aprueba",
        "IA implementa",
        "Redacción inicial del prompt"
      ],
      answer: [0, 1],
      explanation: "Los incidentes previos venían de saltar CI o aprobación humana. Esas etapas son guardarraíles, no burocracia opcional.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de 4 etapas): ¿qué métrica validó que el flujo completo funcionaba mejor?",
      options: [
        "Reducción medible de regresiones detectadas en producción durante los primeros 3 meses",
        "Aumento del número de commits por día sin revisar calidad",
        "Eliminación total de revisiones de PR",
        "Mayor cantidad de cambios directos en producción"
      ],
      answer: [0],
      explanation: "El caso reporta menor cantidad de regresiones en producción como evidencia de mejora, sin aumentar riesgo por saltarse pasos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (flujo de 4 etapas): ¿qué decisión conservaría el equilibrio correcto entre velocidad y control?",
      options: [
        "Permitir que IA acelere la implementación, pero exigir CI verde y aprobación humana antes de merge",
        "Fusionar automáticamente todo lo generado por IA",
        "Eliminar diseño humano porque la IA puede inferir requisitos",
        "Permitir excepciones de CI si el cambio parece pequeño"
      ],
      answer: [0],
      explanation: "El flujo recomendado conserva diseño, validación y aprobación. La IA acelera una etapa, no sustituye el sistema de control.",
      appliesTo: "caso"
    }
  ],
  52: [
    {
      type: "single",
      prompt: "¿Qué es un 'tenant' en el contexto de Power Platform?",
      options: [
        "El directorio de Microsoft Entra ID que agrupa todos los entornos, usuarios y licencias de una organización",
        "Un tipo específico de tabla de Dataverse",
        "El nombre técnico de una Canvas App publicada",
        "Un sinónimo exacto de 'solución' en Power Platform"
      ],
      answer: [0],
      explanation: "El tenant es el directorio de Microsoft Entra ID que agrupa todos los entornos, usuarios y licencias de una organización; un tenant puede contener muchos entornos distintos."
    },
    {
      type: "single",
      prompt: "¿Cuál es la diferencia principal entre un entorno Developer y un entorno Production?",
      options: [
        "El Developer es gratuito, ligado a un solo usuario y pensado para practicar sin riesgo; Production contiene datos y usuarios reales",
        "No hay ninguna diferencia funcional entre ambos",
        "El entorno Developer no permite instalar Dataverse",
        "Production siempre es más rápido que Developer en rendimiento"
      ],
      answer: [0],
      explanation: "Un entorno Developer es gratuito y aislado para un solo usuario, ideal para practicar; Production contiene los datos y usuarios reales del negocio y nunca debe usarse para pruebas."
    },
    {
      type: "single",
      prompt: "¿Qué comando de Power Platform CLI se usa para crear un nuevo perfil de autenticación contra un entorno?",
      options: [
        "pac auth create --environment \"<URL_DEL_ENTORNO>\"",
        "pac org connect",
        "pac solution export",
        "pac auth login --force"
      ],
      answer: [0],
      explanation: "`pac auth create --environment` crea un nuevo perfil de autenticación guardado localmente contra el entorno indicado, abriendo un login interactivo."
    },
    {
      type: "single",
      prompt: "¿Qué comando debe ejecutarse SIEMPRE antes de cualquier operación que exporte, importe o modifique algo, según las buenas prácticas de este módulo?",
      options: [
        "pac org who",
        "pac help",
        "pac --version",
        "pac auth clear"
      ],
      answer: [0],
      explanation: "`pac org who` muestra la organización y usuario activos; verificarlo antes de cualquier operación destructiva evita operar contra el entorno equivocado."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS acciones ayudan a evitar operar por error contra el entorno equivocado cuando se manejan múltiples clientes/tenants?",
      options: [
        "Nombrar los perfiles de autenticación de forma explícita por cliente/entorno",
        "Ejecutar `pac org who` antes de operaciones destructivas",
        "Usar siempre el mismo nombre de perfil para todos los entornos",
        "Evitar revisar la organización activa para ahorrar tiempo"
      ],
      answer: [0, 1],
      explanation: "Nombrar los perfiles claramente y verificar la organización activa con `pac org who` son las dos prácticas concretas que previenen operar contra el entorno equivocado."
    },
    {
      type: "single",
      prompt: "¿Qué comando lista todos los perfiles de autenticación guardados localmente?",
      options: [
        "pac auth list",
        "pac org list",
        "pac solution list",
        "pac profile show"
      ],
      answer: [0],
      explanation: "`pac auth list` muestra todos los perfiles de autenticación guardados localmente, permitiendo identificar cuál está activo y seleccionar otro si es necesario."
    },
    {
      type: "single",
      prompt: "Un entorno 'Default' compartido por todo el tenant, ¿es recomendable para desarrollo serio de una solución?",
      options: [
        "No; se recomienda un entorno Developer o Sandbox dedicado para evitar interferir con otros equipos",
        "Sí, siempre es la mejor opción por ser el más rápido de acceder",
        "Sí, porque no requiere ningún tipo de coordinación con otros equipos",
        "Es irrelevante qué entorno se use para desarrollo"
      ],
      answer: [0],
      explanation: "El entorno Default es compartido por todo el tenant y no aislado; para desarrollo serio se recomienda un entorno Developer o Sandbox dedicado."
    },
    {
      type: "single",
      prompt: "¿Qué representa la 'organización' (Dataverse organization) de un entorno?",
      options: [
        "La instancia de Dataverse con su propia URL única, creada cuando el entorno tiene Dataverse habilitado",
        "El nombre comercial de la empresa dueña del tenant",
        "Un sinónimo de 'tenant', intercambiable en cualquier contexto",
        "Una carpeta de archivos dentro del repositorio del proyecto"
      ],
      answer: [0],
      explanation: "Cuando un entorno tiene Dataverse habilitado, se crea una organización con una URL única (ej. `https://<org>.crm.dynamics.com`), que es el punto de conexión real para Web API y otras herramientas."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (`pac auth`): ¿qué omisión causó que el consultor exportara desde el cliente equivocado?",
      options: [
        "No ejecutó `pac org who` antes de un comando que exportaba o modificaba solución",
        "No tenía Power Platform CLI instalado",
        "No usó una cuenta de administrador global",
        "No generó una app registration nueva"
      ],
      answer: [0],
      explanation: "El perfil activo había quedado de una sesión anterior. `pac org who` habría mostrado el entorno real antes del export.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (`pac auth`): ¿qué convención de nombres reduce confusiones entre clientes y entornos?",
      options: [
        "Perfiles explícitos como `sit-cliente-a-dev` y `sit-cliente-a-prod`",
        "Perfiles llamados `default`, `test` y `nuevo`",
        "Usar el mismo nombre de perfil para todos los clientes",
        "No guardar perfiles y confiar en memoria"
      ],
      answer: [0],
      explanation: "Nombres explícitos por cliente y entorno reducen ambigüedad cuando se atienden varios clientes en la misma semana.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (`pac auth`): ¿cuáles DOS acciones adoptó el equipo para evitar repetir el incidente?",
      options: [
        "Ejecutar `pac org who` antes de comandos que exportan, importan o modifican",
        "Nombrar perfiles de forma explícita por cliente y entorno",
        "Usar siempre el último perfil activo sin verificar",
        "Trabajar todos los clientes desde un solo entorno"
      ],
      answer: [0, 1],
      explanation: "El caso termina con dos reglas: verificar la organización activa antes de comandos sensibles y usar nombres explícitos para perfiles.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (`pac auth`): ¿por qué el incidente generó retrabajo aunque no hubo pérdida de datos de producción?",
      options: [
        "Porque se sobrescribió una solución del Cliente B creyendo estar en el entorno de pruebas del Cliente A",
        "Porque se borró el tenant del Cliente A",
        "Porque `pac org who` dañó una solución managed",
        "Porque todos los perfiles de `pac auth` se eliminaron automáticamente"
      ],
      answer: [0],
      explanation: "El caso señala que no era producción, pero sí se exportó/sobrescribió solución del cliente equivocado, generando confusión y retrabajo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (`pac auth`): antes de `pac solution import` hacia producción, ¿cuál es la verificación mínima obligatoria?",
      options: [
        "Ejecutar `pac org who` y confirmar cliente, entorno y URL antes de continuar",
        "Confiar en que la terminal recuerda el entorno correcto",
        "Revisar solo que el archivo ZIP exista",
        "Cambiar el nombre local del ZIP para que diga prod"
      ],
      answer: [0],
      explanation: "Comandos de importación/exportación modifican artefactos reales. Confirmar organización activa evita actuar sobre el tenant o entorno equivocado.",
      appliesTo: "caso"
    }
  ],
  53: [
    {
      type: "single",
      prompt: "¿Qué protocolo de autenticación usa la Dataverse Web API para validar cada petición?",
      options: [
        "OAuth 2.0, mediante un token emitido por Microsoft Entra ID",
        "Autenticación básica con usuario y contraseña en texto plano",
        "Un certificado SSL exclusivo sin relación con Entra ID",
        "No requiere ningún tipo de autenticación para peticiones de lectura"
      ],
      answer: [0],
      explanation: "La Web API exige un token OAuth 2.0 emitido por Microsoft Entra ID en el header Authorization de cada petición; sin un token válido del tenant correcto, la petición es rechazada."
    },
    {
      type: "single",
      prompt: "¿Qué es una 'app registration' en Microsoft Entra ID?",
      options: [
        "El registro que da una identidad propia a una aplicación para solicitar tokens, independiente de cualquier usuario humano",
        "Un tipo de tabla de Dataverse para registrar aplicaciones externas",
        "Un archivo de configuración local que no se relaciona con Entra ID",
        "El proceso de publicar una Canvas App en el catálogo de la organización"
      ],
      answer: [0],
      explanation: "La app registration crea una identidad propia (Application ID) en Entra ID para que una aplicación pueda autenticarse y solicitar tokens sin depender de un usuario humano."
    },
    {
      type: "single",
      prompt: "¿Por qué una app registration por sí sola no es suficiente para que una integración pueda leer/escribir datos en Dataverse?",
      options: [
        "Porque necesita un Application User vinculado en Dataverse con un Security Role que le otorgue permisos concretos",
        "Porque las app registrations nunca pueden usarse para integraciones automatizadas",
        "Porque Dataverse ignora completamente los tokens emitidos por Entra ID",
        "Porque toda integración requiere obligatoriamente un usuario humano real"
      ],
      answer: [0],
      explanation: "La app registration puede autenticarse contra Entra ID, pero Dataverse rechaza la petición si no existe un Application User vinculado con un Security Role que otorgue los permisos necesarios."
    },
    {
      type: "single",
      prompt: "¿Qué diferencia principal hay entre usar un client secret y un certificado como credencial de un service principal?",
      options: [
        "El client secret es una contraseña con expiración que requiere rotación; el certificado es más seguro y no requiere rotación frecuente de un valor en texto plano",
        "No hay ninguna diferencia de seguridad entre ambos métodos",
        "El certificado solo puede usarse en entornos Developer",
        "El client secret nunca expira una vez generado"
      ],
      answer: [0],
      explanation: "Un client secret expira y debe rotarse; un certificado ofrece mayor seguridad criptográfica y no depende de un valor en texto plano con rotación frecuente, por lo que es preferible en integraciones de largo plazo."
    },
    {
      type: "single",
      prompt: "Un desarrollador recibe un error `401 Unauthorized` al llamar a la Dataverse Web API. ¿Cuál es la causa más probable?",
      options: [
        "El token no se generó, expiró, o se solicitó contra el tenant/audience incorrecto",
        "El Application User no tiene Security Role asignado",
        "La tabla consultada no existe en el entorno",
        "El servidor de Dataverse está temporalmente caído"
      ],
      answer: [0],
      explanation: "Un error 401 indica un problema de autenticación: el token es inválido, expiró, o se generó contra el tenant/audience equivocado — no un problema de permisos sobre la tabla."
    },
    {
      type: "single",
      prompt: "Un desarrollador recibe un error `403 Forbidden`, y confirma que el token se generó correctamente. ¿Cuál es la causa más probable?",
      options: [
        "El Application User no tiene el Security Role o los privilegios necesarios sobre la tabla/operación solicitada",
        "El tenant ID usado para generar el token es incorrecto",
        "El error 403 siempre indica que el servicio está fuera de línea",
        "El error 403 nunca está relacionado con permisos"
      ],
      answer: [0],
      explanation: "Un error 403 con un token válido indica un problema de autorización: el Application User no tiene el Security Role o privilegio correspondiente sobre la tabla u operación."
    },
    {
      type: "single",
      prompt: "¿Qué Security Role se recomienda asignar a un Application User usado por una integración automatizada?",
      options: [
        "El más restrictivo posible que cumpla el caso de uso, nunca System Administrator por defecto",
        "Siempre System Administrator, para evitar depurar permisos",
        "No es necesario asignar ningún Security Role a un Application User",
        "El mismo rol que tiene el usuario que creó la app registration"
      ],
      answer: [0],
      explanation: "El principio de permisos mínimos exige asignar el Security Role más restrictivo que cumpla el caso de uso; usar System Administrator por comodidad expone el entorno a riesgos innecesarios."
    },
    {
      type: "single",
      prompt: "¿Qué se debe hacer SIEMPRE al pedirle a un asistente de IA ayuda sobre un flujo de autenticación OAuth?",
      options: [
        "Usar placeholders (ej. {{CLIENT_ID}}, {{TENANT_ID}}) en vez de valores reales",
        "Pegar el client secret real para que la IA entienda mejor el contexto",
        "Compartir el token de acceso completo generado en producción",
        "Omitir cualquier mención a la autenticación para simplificar el prompt"
      ],
      answer: [0],
      explanation: "Nunca se deben pegar credenciales ni tokens reales en un prompt; usar placeholders permite obtener ayuda sobre la estructura sin exponer información sensible."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso: un bug en un sistema externo generó una actualización masiva accidental sobre tablas de Contactos y Oportunidades que la integración de facturación no debía tocar. ¿Cuál fue la causa raíz?",
      options: [
        "El Application User tenía asignado el Security Role de System Administrator, con acceso a todo el entorno",
        "La Web API de Dataverse tiene un límite de throttling demasiado alto",
        "El desarrollador olvidó usar HTTPS en la llamada a la API",
        "El sistema externo no tenía configurado un token de OAuth"
      ],
      answer: [0],
      explanation: "El caso es explícito: el Application User recibió el rol System Administrator 'para no tener que depurar permisos', lo que le dio acceso a todo el entorno, incluyendo tablas fuera del alcance real de la integración.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso: ¿qué principio de seguridad se debió aplicar desde el diseño inicial de la integración de facturación, y que habría evitado el incidente?",
      options: [
        "Principio de permisos mínimos (least privilege)",
        "Principio de alta disponibilidad",
        "Principio de separación de ambientes (Dev/Test/Prod)",
        "Principio de versionado semántico"
      ],
      answer: [0],
      explanation: "El caso concluye que se debió aplicar 'el principio de permisos mínimos... desde el diseño inicial': otorgar al Application User solo el acceso estrictamente necesario para su función, no acceso total al entorno.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso: ¿qué corrección se aplicó para que la integración solo pudiera afectar las tablas que realmente necesita?",
      options: [
        "Se creó un Security Role específico con acceso de lectura/escritura únicamente a las 2 tablas necesarias, asignado al Application User",
        "Se desactivó por completo el Application User y se usó un usuario interactivo real",
        "Se migró la integración de Web API a un flujo de Power Automate sin autenticación",
        "Se aumentó el nivel de logging para detectar el próximo incidente más rápido"
      ],
      answer: [0],
      explanation: "La corrección descrita en el caso fue reemplazar el rol System Administrator por un Security Role acotado a las 2 tablas que la integración realmente usa — acceso mínimo necesario, no eliminación de la integración ni solo más monitoreo.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso: si un Application User solo necesita crear y leer registros en la tabla Factura, ¿qué acceso NO debería tener bajo el principio de permisos mínimos aplicado en este caso?",
      options: [
        "Acceso de administrador a todas las tablas del entorno, incluyendo Contactos y Oportunidades",
        "Permiso de lectura sobre la tabla Factura",
        "Permiso de creación sobre la tabla Factura",
        "Un Security Role dedicado solo a esa integración"
      ],
      answer: [0],
      explanation: "El acceso amplio a tablas no relacionadas con la función de la integración (como Contactos y Oportunidades) es exactamente lo que el principio de permisos mínimos prohíbe, y fue la causa del incidente del caso.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso: ¿cuáles DOS consecuencias reales tuvo asignar System Administrator al Application User 'para no depurar permisos'?",
      options: [
        "Un bug del sistema externo pudo modificar tablas fuera del alcance previsto de la integración",
        "El acceso amplio ocultó cuáles permisos realmente necesitaba la integración para funcionar",
        "Mejoró el rendimiento de las llamadas a la Web API",
        "Redujo la necesidad de mantener un Security Role específico a largo plazo"
      ],
      answer: [0, 1],
      explanation: "El acceso total permitió que un bug externo afectara tablas no relacionadas con la integración, y además ocultó qué permisos eran realmente necesarios (algo que solo se hizo evidente al diseñar el Security Role acotado después del incidente). No hay relación entre el rol asignado y el rendimiento de la API, y evitar el Security Role específico fue la causa del problema, no un beneficio.",
        appliesTo: "caso"
    }
  ],
  54: [
    {
      type: "single",
      prompt: "¿Cuál es la diferencia principal entre una solución unmanaged y una managed?",
      options: [
        "La unmanaged es editable (se usa en Dev); la managed es de solo lectura una vez importada (se usa en Test/Prod)",
        "No hay ninguna diferencia funcional entre ambas",
        "La managed siempre contiene menos componentes que la unmanaged",
        "La unmanaged solo puede usarse en Dynamics 365, no en Power Apps"
      ],
      answer: [0],
      explanation: "Una solución unmanaged es editable y se usa en el entorno de desarrollo; una managed es de solo lectura una vez importada, y se usa en Test/Production para evitar personalizaciones huérfanas."
    },
    {
      type: "single",
      prompt: "¿Qué hace el comando `pac solution unpack`?",
      options: [
        "Descompone el .zip de la solución en archivos XML/JSON individuales, aptos para control de versiones y diffs legibles",
        "Publica la solución directamente en el entorno de producción",
        "Elimina componentes no usados de la solución automáticamente",
        "Convierte una solución managed en unmanaged sin necesidad de reimportarla"
      ],
      answer: [0],
      explanation: "`pac solution unpack` descompone el `.zip` en archivos individuales por componente, lo que permite versionar la solución en Git con diffs legibles por componente."
    },
    {
      type: "single",
      prompt: "¿Qué problema resuelven las 'variables de entorno' (environment variables) en una solución Power Platform?",
      options: [
        "Permiten que valores como URLs o IDs cambien entre Dev/Test/Prod sin modificar el componente que los usa",
        "Sirven exclusivamente para almacenar contraseñas de usuarios finales",
        "Reemplazan por completo la necesidad de Security Roles",
        "Solo pueden usarse en soluciones managed, nunca en unmanaged"
      ],
      answer: [0],
      explanation: "Las variables de entorno externalizan valores que cambian entre entornos (URLs, IDs, flags), evitando hardcodear un valor específico de un entorno dentro de un componente."
    },
    {
      type: "single",
      prompt: "¿Qué representa una 'connection reference' en una solución?",
      options: [
        "Un componente que representa una conexión a un conector, sin fijar qué cuenta o credencial usa, resuelto por entorno al importar",
        "Un archivo de log de todas las conexiones realizadas a Dataverse",
        "Una tabla especial que almacena credenciales de usuarios",
        "Un tipo de plugin que solo funciona en modo síncrono"
      ],
      answer: [0],
      explanation: "Una connection reference representa una conexión a un conector sin fijar la cuenta/credencial específica, evitando que un flujo quede atado a la cuenta personal de quien lo desarrolló."
    },
    {
      type: "single",
      prompt: "¿Para qué sirve un archivo de 'deployment settings' al importar una solución?",
      options: [
        "Mapea los valores de variables de entorno y connection references específicos del entorno destino, automatizando ese mapeo",
        "Reemplaza la necesidad de tener un archivo Solution.xml",
        "Define los permisos de Security Roles de todos los usuarios del entorno",
        "Solo se usa quando la solución no tiene ninguna connection reference"
      ],
      answer: [0],
      explanation: "El archivo de deployment settings mapea los valores correctos de variables de entorno y connection references para el entorno destino, evitando configuración manual repetitiva en cada importación."
    },
    {
      type: "single",
      prompt: "Según las buenas prácticas de ALM de este módulo, ¿en qué entorno debe vivir siempre una solución como unmanaged?",
      options: [
        "En el entorno de desarrollo (Dev)",
        "En el entorno de producción (Prod)",
        "En el entorno de Test únicamente",
        "En todos los entornos por igual, sin distinción"
      ],
      answer: [0],
      explanation: "Dev debe mantenerse siempre unmanaged y editable; Test y Prod deben recibir la solución como managed (solo lectura) para evitar personalizaciones huérfanas fuera de control de versiones."
    },
    {
      type: "multi",
      prompt: "¿Cuáles DOS pasos mínimos ejecuta típicamente un pipeline de GitHub Actions para Power Platform en el flujo Dev → Test?",
      options: [
        "pac solution unpack tras exportar desde Dev",
        "pac solution pack + pac solution import hacia el entorno destino",
        "Eliminar todas las variables de entorno antes de importar",
        "Convertir automáticamente el entorno de Test en Production"
      ],
      answer: [0, 1],
      explanation: "El flujo típico incluye desempaquetar (unpack) tras exportar desde Dev para versionar, y empaquetar + importar (pack + import) hacia el entorno destino durante el despliegue."
    },
    {
      type: "single",
      prompt: "¿Qué rol cumple la IA en el proceso de ALM descrito en este módulo?",
      options: [
        "Apoya revisando diffs, riesgos y documentación, pero la aprobación final del pipeline sigue siendo humana",
        "Reemplaza por completo la necesidad de revisión humana antes de importar a producción",
        "Ejecuta automáticamente pac solution import sin supervisión",
        "Solo puede usarse para tareas no relacionadas con soluciones de Power Platform"
      ],
      answer: [0],
      explanation: "La IA puede acelerar la revisión de diffs y riesgos de una solución, pero la decisión de aprobar el pipeline hacia Test/Prod sigue siendo responsabilidad humana, igual que en el resto del nivel IA."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ALM SIT): ¿cuál fue la causa raíz de perder una personalización hecha en producción?",
      options: [
        "No existía una separación real Dev unmanaged / Test y Prod managed con pipeline como único camino de despliegue",
        "GitHub Actions no puede desplegar soluciones Power Platform",
        "Las soluciones managed siempre eliminan formularios",
        "El maker no tenía licencia para abrir Test"
      ],
      answer: [0],
      explanation: "El caso explica que la causa raíz no fue solo el error del maker, sino la ausencia de separación managed/unmanaged y control de despliegue.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ALM SIT): ¿qué estándar adoptó el equipo para Dev, Test y Prod?",
      options: [
        "Dev siempre unmanaged y editable; Test y Prod siempre managed y de solo lectura",
        "Todos los entornos unmanaged para editar más rápido",
        "Producción editable y Dev managed",
        "Importar manualmente desde cualquier entorno disponible"
      ],
      answer: [0],
      explanation: "El estándar descrito es explícito: Dev editable/unmanaged; Test y Prod managed/de solo lectura, con pipeline como camino de despliegue.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (ALM SIT): ¿cuáles DOS prácticas habrían evitado que una personalización directa en Prod quedara fuera de control de versiones?",
      options: [
        "Impedir edición directa en Prod usando soluciones managed",
        "Usar GitHub Actions como único camino de despliegue",
        "Hacer cambios rápidos manuales en Prod si parecen pequeños",
        "Mantener Test y Prod visualmente idénticos sin controles adicionales"
      ],
      answer: [0, 1],
      explanation: "Managed en Prod evita edición directa, y el pipeline asegura trazabilidad. Los cambios manuales fueron el problema.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ALM SIT): ¿por qué importar desde desarrollo directamente a producción era riesgoso?",
      options: [
        "Porque evitaba un pipeline controlado y mezclaba cambios editables con despliegues productivos sin trazabilidad suficiente",
        "Porque las soluciones unmanaged no pueden contener formularios",
        "Porque producción no admite soluciones de Power Platform",
        "Porque Git no puede versionar soluciones desempaquetadas"
      ],
      answer: [0],
      explanation: "El riesgo era de proceso y trazabilidad: saltarse pipeline y separación de entornos dejó personalizaciones fuera del ciclo controlado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ALM SIT): si un maker necesita corregir un formulario, ¿cuál es el flujo correcto bajo el estándar adoptado?",
      options: [
        "Editar en Dev unmanaged, versionar, validar en Test managed y desplegar a Prod mediante pipeline",
        "Editar directamente en Prod para ahorrar tiempo",
        "Cambiar Test y asumir que Prod queda sincronizado",
        "Pedirle a la IA que modifique producción sin revisión"
      ],
      answer: [0],
      explanation: "El estándar conserva trazabilidad: cambios en Dev, validación en Test y despliegue controlado a Prod.",
      appliesTo: "caso"
    }
  ],
  55: [
    {
      type: "single",
      prompt: "¿Qué es la 'sobrepersonalización' (over-customization) en un proyecto Power Platform/D365?",
      options: [
        "Resolver con desarrollo a medida algo que la plataforma ya ofrece de forma estándar, aumentando el costo de mantenimiento",
        "Usar demasiadas Canvas Apps en un mismo proyecto",
        "Tener más de 10 tablas personalizadas en una solución",
        "Un sinónimo de 'solución managed' sin relación con el diseño"
      ],
      answer: [0],
      explanation: "La sobrepersonalización ocurre cuando se construye una solución a medida para algo que la plataforma ya resuelve de forma estándar, incrementando el costo de mantenimiento y complicando actualizaciones futuras."
    },
    {
      type: "single",
      prompt: "¿Por qué un asistente de IA tiende a proponer una solución personalizada en vez de una alternativa estándar de D365, si no se le indica lo contrario?",
      options: [
        "Porque el patrón de proponer desarrollo a medida es común en sus datos de entrenamiento si no se le pide explícitamente evaluar alternativas estándar",
        "Porque la IA no puede generar ningún tipo de configuración estándar",
        "Porque las alternativas estándar de D365 no existen realmente",
        "Porque toda propuesta de IA es automáticamente la mejor opción técnica"
      ],
      answer: [0],
      explanation: "Si no se le pide explícitamente evaluar alternativas estándar primero, la IA tiende a proponer directamente desarrollo a medida, por lo que hay que solicitarlo de forma explícita en el prompt."
    },
    {
      type: "single",
      prompt: "¿Qué es un ADR (Architecture Decision Record)?",
      options: [
        "Un documento que registra el contexto, la decisión, alternativas consideradas y consecuencias de una decisión de arquitectura",
        "Un tipo de tabla de Dataverse para almacenar decisiones de negocio",
        "Un reporte automático generado únicamente por Power BI",
        "Un sinónimo de 'Security Role' usado en consultoría funcional"
      ],
      answer: [0],
      explanation: "Un ADR documenta el contexto, la decisión tomada, las alternativas consideradas y las consecuencias, dejando un registro trazable de decisiones de arquitectura importantes."
    },
    {
      type: "single",
      prompt: "¿Por qué es importante dar contexto explícito de las políticas DLP y Managed Environments del tenant real antes de pedir una propuesta de arquitectura a la IA?",
      options: [
        "Porque la IA no conoce automáticamente las restricciones de gobierno configuradas en un tenant específico",
        "Porque las políticas DLP no afectan ninguna decisión de arquitectura",
        "Porque Managed Environments es un concepto exclusivo de Dynamics 365, no de Power Platform",
        "Porque sin ese contexto la IA se niega a responder cualquier pregunta de arquitectura"
      ],
      answer: [0],
      explanation: "La IA no tiene visibilidad automática de las políticas DLP ni la configuración de Managed Environments de un tenant específico; hay que proporcionarlas explícitamente como contexto para que la propuesta sea realista."
    },
    {
      type: "single",
      prompt: "Un requerimiento pide 'registrar visitas de vendedores a clientes'. ¿Qué debería evaluarse ANTES de proponer una tabla personalizada?",
      options: [
        "Si la entidad estándar de actividades/citas de Dynamics 365 Sales ya cubre el caso de uso",
        "Directamente crear la tabla personalizada, ya que siempre es más flexible",
        "Consultar únicamente el precio de licenciamiento antes de decidir",
        "Ignorar las tablas estándar porque nunca son suficientes para casos reales"
      ],
      answer: [0],
      explanation: "Antes de proponer desarrollo a medida, se debe evaluar si una capacidad estándar de la plataforma (como actividades/citas) ya cubre el requerimiento, para evitar sobrepersonalización innecesaria."
    },
    {
      type: "single",
      prompt: "¿Qué elementos debería incluir como mínimo una matriz de seguridad generada para 2 roles sobre una tabla?",
      options: [
        "Tabla, rol y los permisos de crear/leer/escribir/eliminar para cada rol",
        "Solo el nombre de los usuarios que tienen acceso a la tabla",
        "Únicamente la fecha de creación de la tabla",
        "El precio de la licencia de cada usuario"
      ],
      answer: [0],
      explanation: "Una matriz de seguridad básica cruza tabla × rol × permisos (crear/leer/escribir/eliminar), permitiendo verificar visualmente si se respeta el principio de mínimo privilegio."
    },
    {
      type: "single",
      prompt: "Al usar IA para generar el esqueleto de un Custom API de Dataverse, ¿qué se debe hacer antes de aceptar el resultado?",
      options: [
        "Revisarlo con la checklist de alcance/efectos secundarios/seguridad/tests del Módulo 48",
        "Aceptarlo directamente si compila sin errores de sintaxis",
        "Ejecutarlo inmediatamente en el entorno de producción",
        "Ninguna revisión adicional es necesaria si lo generó un asistente de IA"
      ],
      answer: [0],
      explanation: "Todo código generado por IA, incluyendo un Custom API, debe revisarse con la misma checklist de revisión de diffs (alcance, efectos secundarios, seguridad, tests) antes de aceptarlo."
    },
    {
      type: "single",
      prompt: "¿Qué rol cumple el humano frente a una propuesta de arquitectura generada con apoyo de IA, según este módulo?",
      options: [
        "Sigue siendo el responsable final de la decisión, sin importar cuán completa parezca la propuesta de la IA",
        "Ya no es necesario, la IA puede aprobar sus propias propuestas de arquitectura",
        "Solo debe revisar la ortografía del documento generado",
        "Su única función es ejecutar los comandos que la IA le indique"
      ],
      answer: [0],
      explanation: "Sin importar cuán completa parezca una propuesta de arquitectura generada con apoyo de IA, la decisión final y la responsabilidad ante el cliente siguen siendo del arquitecto humano."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (visitas de vendedores): ¿qué omisión hizo que la IA propusiera una tabla personalizada innecesaria?",
      options: [
        "No se le pidió evaluar primero capacidades estándar de Dynamics 365 Sales, como citas/actividades",
        "No se le pidió crear suficientes relaciones personalizadas",
        "No se incluyó una cadena de conexión real en el prompt",
        "No se usó Power Platform CLI antes de preguntar"
      ],
      answer: [0],
      explanation: "El caso muestra que la IA propuso custom porque no recibió la restricción de evaluar estándar primero. Dynamics 365 ya cubría gran parte con actividades.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (visitas de vendedores): ¿qué alternativa estándar cubría cerca del 90% del requerimiento?",
      options: [
        "Actividades/citas estándar de Dynamics 365 Sales",
        "Una tabla custom completa sin componentes estándar",
        "Un pipeline de GitHub Actions",
        "Un Application User con System Administrator"
      ],
      answer: [0],
      explanation: "Al revisar la propuesta, el equipo identificó que las actividades estándar cubrían el 90% del caso y solo hacía falta un campo adicional.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (visitas de vendedores): ¿cuáles DOS costos generaba crear una tabla custom completa sin revisar lo estándar?",
      options: [
        "Duplicar capacidades existentes de Dynamics 365 Sales",
        "Aumentar mantenimiento futuro al no heredar mejoras de la tabla estándar",
        "Mejorar automáticamente la compatibilidad con actualizaciones estándar",
        "Eliminar la necesidad de gobernanza funcional"
      ],
      answer: [0, 1],
      explanation: "Duplicar estándar aumenta costo y reduce aprovechamiento de capacidades existentes. La solución custom no hereda automáticamente mejoras del estándar.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (visitas de vendedores): ¿qué pregunta explícita cambió la dirección de la solución?",
      options: [
        "¿Existe una alternativa estándar de D365 antes de crear algo custom?",
        "¿Cuántas tablas custom podemos crear en una sola solución?",
        "¿Puede la IA inventar una entidad más moderna?",
        "¿Cómo hacemos que el formulario custom sea visualmente distinto?"
      ],
      answer: [0],
      explanation: "La pregunta sobre alternativa estándar llevó al equipo a descubrir que actividades/citas cubrían la mayor parte del requerimiento.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (visitas de vendedores): ¿cuál habría sido una solución proporcional al requerimiento?",
      options: [
        "Usar actividades estándar y agregar solo el campo personalizado necesario",
        "Crear una solución paralela completa para reemplazar Sales",
        "Evitar cualquier componente estándar para tener control total",
        "Pedir a cada vendedor que registre visitas fuera de D365"
      ],
      answer: [0],
      explanation: "El caso concluye que el estándar cubría el 90%; por tanto, una extensión mínima era más proporcional que desarrollo a medida completo.",
      appliesTo: "caso"
    }
  ],
  56: [
    {
      type: "single",
      prompt: "¿Por qué un Contact con un caso abierto en Customer Service aparece con el mismo historial en Sales, sin ningún proceso de sincronización?",
      options: [
        "Porque Sales y Customer Service son aplicaciones distintas construidas sobre el mismo Dataverse, no bases de datos separadas",
        "Porque existe un flujo de Power Automate que copia el registro cada noche entre ambas aplicaciones",
        "Porque Customer Service exporta el registro a un archivo que Sales importa periódicamente",
        "Porque Dataverse duplica automáticamente cada registro en dos bases separadas para redundancia"
      ],
      answer: [0],
      explanation: "Account y Contact son las mismas tablas de Dataverse vistas desde cualquier aplicación (Sales, Customer Service, Field Service); no hay sincronización porque no hay duplicación de datos."
    },
    {
      type: "single",
      prompt: "Un equipo quiere personalizar 'clientes de Servicio' con una tabla separada de los Account/Contact que ya usa Sales. ¿Cuál es el riesgo principal?",
      options: [
        "Duplicidad de datos y pérdida de la vista unificada del cliente entre Sales y Customer Service",
        "Ningún riesgo real, ya que cada aplicación debería tener sus propias tablas",
        "Que el Solution Checker rechace automáticamente cualquier tabla nueva",
        "Que Copilot deje de funcionar en Customer Service"
      ],
      answer: [0],
      explanation: "Crear tablas paralelas a Account/Contact es la causa más común de duplicidad de datos y rompe la vista unificada del cliente entre aplicaciones D365 CE."
    },
    {
      type: "single",
      prompt: "¿Qué evento típico dispara el paso de 'Servicio' a 'Campo' en el ciclo de negocio de Customer Engagement?",
      options: [
        "Un caso de Customer Service que requiere una visita física genera un Work Order en Field Service",
        "La creación de una nueva Opportunity en Sales",
        "El cierre de un journey en Customer Insights",
        "La publicación de un nuevo Knowledge Article"
      ],
      answer: [0],
      explanation: "Cuando un caso de servicio requiere presencia física, Customer Service crea un Work Order que Field Service programa, ejecuta y cierra con evidencia — ese es el puente entre Servicio y Campo."
    },
    {
      type: "single",
      prompt: "¿Por qué el ALM (pipelines, Solution Checker, Connection References) de una solución Dynamics 365 CE es el mismo que el de cualquier solución de Power Platform?",
      options: [
        "Porque Sales, Customer Service y Field Service son aplicaciones sobre Dataverse, que usa el mismo mecanismo de soluciones que el resto de Power Platform",
        "Porque Microsoft ofrece un pipeline de CI/CD exclusivo y distinto para D365 CE",
        "Porque D365 CE no soporta ALM y debe desplegarse siempre manualmente",
        "Porque las soluciones de D365 CE no pueden exportarse como managed"
      ],
      answer: [0],
      explanation: "No existe un ALM 'distinto' para D365 CE: al ser aplicaciones sobre Dataverse, comparten el mismo mecanismo de soluciones, Solution Checker y Connection References que cualquier solución de Power Platform."
    },
    {
      type: "single",
      prompt: "Una organización configuró modelos de seguridad incompatibles para Sales (Business Units por región) y Customer Service (equipos por producto) en proyectos separados. ¿Cuál fue el origen del problema?",
      options: [
        "Tratar Sales y Customer Service como proyectos independientes en vez de diseñar un modelo de seguridad único desde el inicio",
        "Que Customer Service no admite Business Units",
        "Que Sales no puede compartir roles de seguridad con otras aplicaciones",
        "Un error de licenciamiento que impidió unificar los modelos"
      ],
      answer: [0],
      explanation: "Sales y Customer Service comparten Dataverse desde el día uno; diseñarlos como proyectos independientes, sin un modelo de seguridad conjunto, produce modelos incompatibles que luego cuestan caro de unificar."
    },
    {
      type: "multi",
      prompt: "¿Cuáles de las siguientes son capacidades de Copilot que aplican de forma transversal a varias aplicaciones D365 CE (no exclusivas de una sola)? (Selecciona 2)",
      options: [
        "Resumen de casos o registros",
        "Redacción asistida de emails o respuestas",
        "Creación de tablas personalizadas sin revisión humana",
        "Eliminación automática de roles de seguridad"
      ],
      answer: [0, 1],
      explanation: "Resumir registros y redactar comunicaciones son capacidades de Copilot disponibles de forma transversal en Sales, Customer Service y Field Service, porque leen el mismo Dataverse con el mismo modelo de gobierno."
    },
    {
      type: "single",
      prompt: "En el ciclo de negocio de marketing a fidelización, ¿qué alimenta típicamente de vuelta a Customer Insights - Data para detectar riesgo de abandono o proponer una renovación?",
      options: [
        "El historial de casos de servicio y visitas de campo del cliente",
        "Únicamente el monto de la última factura",
        "El número de licencias de Power Apps asignadas al cliente",
        "La cantidad de Canvas Apps publicadas en el entorno"
      ],
      answer: [0],
      explanation: "El historial de casos y visitas de campo retroalimenta el perfil unificado del cliente en Customer Insights - Data (Customer 360), que puede activar un journey de renovación o detectar riesgo de abandono."
    },
    {
      type: "single",
      prompt: "¿Qué rol suele encargarse específicamente de diseñar la arquitectura común que conecta Sales, Customer Service, Customer Insights y Field Service en un mismo proyecto?",
      options: [
        "Solution Architect",
        "Únicamente el Consultor Funcional de Sales",
        "Cualquier usuario final con acceso de lectura",
        "Solo el proveedor de licenciamiento"
      ],
      answer: [0],
      explanation: "El Solution Architect es quien diseña la arquitectura común (seguridad, ALM, integración) que conecta las distintas aplicaciones D365 CE dentro de un mismo proyecto Customer Engagement."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (aseguradora Sales + Service): ¿cuál fue el error de gobierno principal al implementar Sales y Customer Service en proyectos separados?",
      options: [
        "Tratar aplicaciones que comparten Dataverse como proyectos independientes sin modelo común de datos y seguridad",
        "Usar Business Units en Sales",
        "Usar equipos en Customer Service",
        "Contratar consultoras distintas, aunque hubieran compartido arquitectura"
      ],
      answer: [0],
      explanation: "El problema no fue una técnica aislada, sino no gobernar Sales y Service como un ecosistema común sobre Dataverse desde el día uno.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (aseguradora Sales + Service): ¿qué consecuencia directa tuvo no reutilizar las tablas ya pobladas por Sales?",
      options: [
        "Contactos duplicados y retrabajo de unificación posterior",
        "Mayor velocidad de implementación sin impacto futuro",
        "Eliminación automática del modelo de seguridad",
        "Separación completa y segura entre ventas y servicio"
      ],
      answer: [0],
      explanation: "El proyecto de Service creó duplicidad de contactos al no partir del modelo existente de Sales; luego hubo que unificar duplicados.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (aseguradora Sales + Service): ¿cuáles DOS frentes tuvo que corregir la organización meses después?",
      options: [
        "Unificar duplicados de Contact",
        "Migrar dos modelos de seguridad a uno coherente",
        "Eliminar Dataverse para separar productos",
        "Reemplazar Sales por Customer Insights"
      ],
      answer: [0, 1],
      explanation: "La corrección dolorosa fue de datos y seguridad: deduplicar contactos y converger modelos incompatibles.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (aseguradora Sales + Service): ¿qué decisión temprana habría evitado el retrabajo?",
      options: [
        "Definir arquitectura común de Dataverse, seguridad y ownership antes de iniciar implementaciones separadas",
        "Impedir que Customer Service use tablas estándar",
        "Crear una base de datos externa para cada app",
        "Ocultar contactos de Sales al equipo de Service"
      ],
      answer: [0],
      explanation: "Aunque los productos se implementen en fases, deben compartir una arquitectura común desde el inicio.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (aseguradora Sales + Service): ¿qué lección resume mejor el caso?",
      options: [
        "Sales y Customer Service comparten Dataverse desde el día uno, se implementen juntos o no",
        "Cada app de D365 debe tener su propio Contact independiente",
        "Los modelos de seguridad incompatibles se resuelven solos con el tiempo",
        "Dataverse solo importa cuando el proyecto ya está en producción"
      ],
      answer: [0],
      explanation: "El caso cierra explícitamente con esta lección de gobierno de proyecto.",
      appliesTo: "caso"
    }
  ],
  57: [
    {
      type: "single",
      prompt: "¿Por qué Customer Insights - Data no es 'otro CRM' además de Sales y Customer Service?",
      options: [
        "Porque su valor es unificar el perfil del cliente combinando fuentes que Sales/Service no combinan por sí solos, no reemplazar su operación transaccional",
        "Porque reemplaza completamente a Sales y Customer Service en cualquier proyecto",
        "Porque solo puede usarse si la empresa no tiene Dataverse",
        "Porque es exclusivamente una herramienta de envío de correos"
      ],
      answer: [0],
      explanation: "Customer Insights - Data existe para unificar el perfil del cliente combinando fuentes que Sales/Service no combinan por sí solos (facturación, sistemas externos), no para reemplazar la operación transaccional de esas aplicaciones."
    },
    {
      type: "single",
      prompt: "Un Contact de Dataverse no tiene email registrado, pero sí teléfono y empresa. ¿Qué regla de matching resuelve mejor su unificación con un registro de facturación externo?",
      options: [
        "Una regla secundaria que combine teléfono exacto con nombre/empresa normalizado, además de la regla de email exacto",
        "Ignorar ese registro porque sin email no se puede unificar nunca",
        "Unificarlo automáticamente con cualquier registro que tenga el mismo nombre, sin verificar más datos",
        "Esperar a que el cliente actualice su email antes de intentar unificarlo"
      ],
      answer: [0],
      explanation: "Cuando falta la clave principal (email), una regla secundaria por teléfono + nombre/empresa normalizado permite resolver la unificación sin depender de un único campo."
    },
    {
      type: "single",
      prompt: "¿Qué distingue a una 'medida' (measure) de un campo capturado directamente en una tabla?",
      options: [
        "La medida es un valor calculado a partir de datos de una o varias fuentes, con una fórmula documentada",
        "La medida siempre proviene de una sola tabla de Dataverse sin combinar fuentes",
        "La medida es idéntica a un campo de texto libre capturado por un usuario",
        "Las medidas no pueden usarse para definir segmentos"
      ],
      answer: [0],
      explanation: "Una medida es un valor calculado (por ejemplo, la suma de facturación de los últimos 24 meses) a partir de una fórmula documentada sobre datos de una o varias fuentes, no un campo capturado directamente."
    },
    {
      type: "single",
      prompt: "¿Qué significa 'activar' un segmento o medida de Customer Insights - Data?",
      options: [
        "Llevar ese segmento o medida hacia un sistema de destino (por ejemplo Journeys o Dataverse) para que dispare una acción concreta",
        "Simplemente calcular el número una vez y archivarlo en un reporte estático",
        "Eliminar el segmento después de usarlo una sola vez",
        "Un sinónimo de 'ingestar' una fuente de datos por primera vez"
      ],
      answer: [0],
      explanation: "La activación es el paso de llevar un segmento o medida hacia un sistema de destino (Journeys, Dataverse, una plataforma de publicidad) para que dispare una acción real — sin activación, el perfil unificado es solo un reporte."
    },
    {
      type: "single",
      prompt: "Una hoja de soporte técnico interna contiene comentarios de agentes sobre clientes. ¿Cómo deberían tratarse esos comentarios en un proyecto de Customer Insights - Data?",
      options: [
        "Usarlos solo para calcular medidas internas de riesgo, sin activarlos nunca hacia un canal de comunicación con el cliente",
        "Activarlos directamente como contenido de un email al cliente para mayor personalización",
        "Ignorarlos por completo, ya que los comentarios internos nunca aportan valor",
        "Publicarlos en el perfil público del cliente en el Customer 360"
      ],
      answer: [0],
      explanation: "Los datos internos (como comentarios de agentes) pueden alimentar medidas de riesgo u operativas, pero no deben activarse hacia canales de comunicación con el cliente — mezclar dato interno con contenido externo es un riesgo de gobierno."
    },
    {
      type: "single",
      prompt: "¿Cuándo NO se justifica introducir Customer Insights - Data en un proyecto?",
      options: [
        "Cuando toda la información relevante del cliente ya vive en Dataverse y no hay fuentes externas que unificar",
        "Cuando existen 3 o más fuentes externas con datos del mismo cliente",
        "Cuando se necesita calcular medidas que combinan Sales y facturación externa",
        "Cuando se requiere activar segmentos hacia Journeys en tiempo real"
      ],
      answer: [0],
      explanation: "Si toda la información relevante ya está en Dataverse y no hay fuentes externas que unificar, un reporte sobre Dataverse puede ser suficiente — introducir Customer Insights - Data sin esa necesidad real es sobre-ingeniería."
    },
    {
      type: "single",
      prompt: "Una cadena de retail unificó su Dataverse con su sistema de punto de venta asumiendo que el email siempre bastaba como clave de matching. ¿Cuál fue la consecuencia principal?",
      options: [
        "Clientes sin email registrado en el POS quedaron sin unificar y perdieron su historial de fidelización",
        "El sistema rechazó automáticamente la ingesta completa sin generar ningún dato",
        "No hubo ninguna consecuencia porque el email es siempre suficiente en cualquier escenario",
        "La empresa tuvo que cancelar el proyecto de Customer Insights por completo"
      ],
      answer: [0],
      explanation: "Al no definir una regla de matching secundaria, los clientes sin email registrado en el POS quedaron sin unificar, apareciendo como 'nuevos' en cada visita y perdiendo su historial de fidelización."
    },
    {
      type: "single",
      prompt: "¿Por qué la frecuencia de ingesta de cada fuente importa al interpretar una medida calculada?",
      options: [
        "Porque una medida que combina fuentes con distinta frecuencia de actualización no está igual de 'al día' en todas sus partes",
        "Porque todas las fuentes siempre se actualizan en tiempo real sin excepción",
        "Porque la frecuencia de ingesta no afecta en nada el resultado de una medida",
        "Porque solo importa la frecuencia de la fuente de Dataverse, nunca la de fuentes externas"
      ],
      answer: [0],
      explanation: "Si una fuente se actualiza mensualmente y otra a diario, una medida que combina ambas refleja información desactualizada de la fuente más lenta — hay que comunicar ese matiz al interpretar el resultado."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (retail Customer 360): ¿por qué el 12% de clientes con compras físicas quedó sin unificar?",
      options: [
        "Porque se asumió que el email bastaba como regla de matching, pero el POS no siempre tenía email",
        "Porque Customer Insights - Data no puede ingerir datos de POS",
        "Porque Dataverse no admite clientes sin email",
        "Porque se usó teléfono + nombre normalizado como regla primaria"
      ],
      answer: [0],
      explanation: "El caso indica que muchos clientes de tienda física no tenían email en POS, por lo que el matching solo por email falló.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (retail Customer 360): ¿qué corrección permitió mejorar la unificación de perfiles?",
      options: [
        "Agregar una regla secundaria por teléfono + nombre normalizado y reprocesar la ingesta",
        "Eliminar las compras de tienda física del modelo",
        "Crear un cliente nuevo en cada visita",
        "Usar solo el ID interno del CRM, ignorando POS"
      ],
      answer: [0],
      explanation: "La corrección descrita fue añadir una regla secundaria y reprocesar la ingesta completa.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (retail Customer 360): ¿cuáles DOS impactos tuvo una regla de matching insuficiente?",
      options: [
        "Clientes aparecían como nuevos en cada visita",
        "Se perdía historial de fidelización",
        "Se duplicaban automáticamente todos los productos",
        "Se bloqueaba la ingesta de Dataverse por completo"
      ],
      answer: [0, 1],
      explanation: "El caso menciona que los clientes no unificados aparecían como nuevos y perdían historial de fidelización.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (retail Customer 360): ¿por qué la regla de matching es una decisión de negocio y no solo técnica?",
      options: [
        "Porque define si el perfil 360 representa realmente al cliente y su relación histórica con la empresa",
        "Porque solo el área legal puede escribir expresiones de matching",
        "Porque el equipo técnico no participa en Customer Insights",
        "Porque no afecta métricas ni segmentación"
      ],
      answer: [0],
      explanation: "La forma de unir identidades determina fidelización, segmentación y lectura del cliente; por eso requiere decisión de negocio.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (retail Customer 360): antes de activar el modelo en producción, ¿qué prueba habría revelado el problema?",
      options: [
        "Validar muestras de clientes con compras POS sin email y comprobar si se unifican correctamente",
        "Revisar solo clientes con email completo",
        "Probar únicamente registros creados desde Sales",
        "Confirmar que la ingesta termina sin errores técnicos"
      ],
      answer: [0],
      explanation: "El caso falló en el segmento sin email. Una prueba con esa muestra habría evidenciado la brecha del matching.",
      appliesTo: "caso"
    }
  ],
  58: [
    {
      type: "single",
      prompt: "¿Qué motor subyacente hace posible el Schedule Board de Field Service?",
      options: [
        "Universal Resource Scheduling (URS), que también usan Customer Service y Project Operations",
        "Un motor exclusivo de Field Service sin relación con otras aplicaciones D365",
        "Power BI, que genera el panel de asignación de técnicos",
        "Copilot Studio, que reemplaza por completo al dispatcher humano"
      ],
      answer: [0],
      explanation: "Universal Resource Scheduling (URS) es el motor compartido detrás del Schedule Board; también lo usan Customer Service (reservar salas/agentes) y Project Operations, no es exclusivo de Field Service."
    },
    {
      type: "single",
      prompt: "Un Work Order no tiene Characteristics (skills) requeridas configuradas. ¿Qué consecuencia tiene esto en el Schedule Board?",
      options: [
        "El resaltado de técnicos compatibles pierde sentido, porque cualquier técnico parece disponible aunque no tenga la skill",
        "El Work Order no puede crearse en absoluto",
        "El sistema asigna automáticamente al técnico más cercano sin importar la skill",
        "El Schedule Board oculta ese Work Order de la vista del dispatcher"
      ],
      answer: [0],
      explanation: "Sin Characteristics requeridas, el Schedule Board no puede filtrar técnicos por skill — cualquier técnico 'parece' disponible aunque no tenga la competencia necesaria para el trabajo."
    },
    {
      type: "single",
      prompt: "¿Cuándo se justifica activar Resource Scheduling Optimization (RSO) en vez de usar el Scheduling Assistant manual?",
      options: [
        "Cuando el volumen de Work Orders similares por día es alto (decenas o cientos por región)",
        "Siempre, porque RSO es superior al Scheduling Assistant en cualquier escenario",
        "Solo cuando hay menos de 5 Work Orders diarios en total",
        "Únicamente si la empresa no tiene dispatchers humanos disponibles"
      ],
      answer: [0],
      explanation: "RSO se justifica con volumen alto de Work Orders (decenas o cientos diarios por región); con bajo volumen, el Scheduling Assistant manual es suficiente y más fácil de auditar."
    },
    {
      type: "single",
      prompt: "Una empresa de mantenimiento de ascensores no configuró Incident Type Tasks, y una auditoría detectó que el 30% de los cierres de mantenimiento preventivo no verificaron el freno de emergencia. ¿Cuál fue la causa raíz?",
      options: [
        "El paso crítico no estaba configurado como tarea obligatoria del Incident Type, quedando a criterio de cada técnico",
        "Los técnicos no tenían la app móvil instalada",
        "El Schedule Board asignó técnicos sin la skill requerida",
        "El cliente rechazó la inspección del freno de emergencia"
      ],
      answer: [0],
      explanation: "Sin tareas obligatorias configuradas en el Incident Type, cada técnico decidía qué revisar según su propio criterio — el paso crítico de seguridad no estaba garantizado por el sistema."
    },
    {
      type: "single",
      prompt: "¿Qué diferencia a un Incident Type de un Work Order Type?",
      options: [
        "El Incident Type especifica el problema exacto (con duración, skills y tareas); el Work Order Type clasifica el propósito general (instalación, mantenimiento, reparación)",
        "Son sinónimos exactos y se pueden usar indistintamente",
        "El Work Order Type siempre reemplaza al Incident Type en Field Service",
        "El Incident Type solo aplica a clientes con garantía activa"
      ],
      answer: [0],
      explanation: "El Incident Type es más específico (qué falla exactamente, con duración/skills/tareas); el Work Order Type clasifica el propósito general y se combina con el Incident Type, no lo reemplaza."
    },
    {
      type: "single",
      prompt: "¿Por qué es importante probar explícitamente la sincronización offline de la app móvil de Field Service antes de un despliegue?",
      options: [
        "Porque el técnico puede perder señal en campo, y muchos proyectos descubren problemas de sincronización solo cuando eso ocurre en producción",
        "Porque la app móvil nunca funciona sin conexión a internet",
        "Porque la sincronización offline no afecta el registro de materiales consumidos",
        "Porque solo los administradores usan la app móvil, nunca los técnicos"
      ],
      answer: [0],
      explanation: "El técnico puede perder señal en campo; la app descarga el Work Order y sus tareas antes de salir y sincroniza al recuperar conexión — probar este flujo antes del despliegue evita descubrir fallas en producción."
    },
    {
      type: "single",
      prompt: "¿Qué rol cumplen los Territorios de Servicio (Service Territories) en el Schedule Board y el RSO?",
      options: [
        "Agrupan técnicos por zona geográfica y actúan como primer filtro antes de evaluar skill o disponibilidad",
        "Determinan exclusivamente el precio del servicio, sin relación con la asignación de técnicos",
        "Solo se usan para reportes financieros, no para scheduling",
        "Reemplazan la necesidad de definir Characteristics en el Work Order"
      ],
      answer: [0],
      explanation: "Los Territorios de Servicio agrupan técnicos por zona geográfica; el Schedule Board y el RSO los usan como primer filtro para evitar sugerir un técnico lejano cuando hay uno disponible en la misma zona."
    },
    {
      type: "single",
      prompt: "El Scheduling Assistant sugiere candidatos para un Work Order. ¿Qué diferencia tiene frente al arrastre manual en el Schedule Board y frente a Resource Scheduling Optimization?",
      options: [
        "Sugiere los mejores candidatos (skill + cercanía + disponibilidad), pero la decisión final sigue siendo humana — es un punto intermedio entre lo manual y lo totalmente automatizado",
        "Es idéntico al arrastre manual, sin ninguna sugerencia adicional",
        "Asigna automáticamente sin ninguna intervención humana, igual que RSO",
        "Solo puede usarse si ya se activó Resource Scheduling Optimization"
      ],
      answer: [0],
      explanation: "El Scheduling Assistant sugiere los mejores candidatos según skill, cercanía y disponibilidad, pero la decisión final la toma el dispatcher — es el punto intermedio entre arrastrar manualmente y automatizar por completo con RSO."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (mantenimiento de ascensores): ¿qué configuración faltante permitió cierres incompletos de mantenimiento preventivo?",
      options: [
        "Incident Type Tasks obligatorias para pasos críticos como revisar el freno de emergencia",
        "Un dashboard de ventas",
        "Una tabla custom de impuestos",
        "Una regla de matching por email"
      ],
      answer: [0],
      explanation: "Sin tareas obligatorias en el Incident Type, cada técnico decidía su checklist y omitía pasos críticos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (mantenimiento de ascensores): ¿qué hallazgo reveló la auditoría de seguridad?",
      options: [
        "El 30% de cierres no había verificado el freno de emergencia",
        "Todos los técnicos usaban la app móvil offline correctamente",
        "La empresa tenía demasiados Incident Type Tasks",
        "RSO asignaba rutas demasiado cortas"
      ],
      answer: [0],
      explanation: "La auditoría detectó omisión de un paso crítico en 30% de mantenimientos preventivos.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (mantenimiento de ascensores): ¿cuáles DOS riesgos acumuló la empresa por no modelar tareas obligatorias?",
      options: [
        "Riesgo legal por cierres incompletos",
        "Riesgo de seguridad por omitir verificaciones críticas",
        "Pérdida automática de licencias Field Service",
        "Imposibilidad de crear Work Orders"
      ],
      answer: [0, 1],
      explanation: "El caso contrasta una corrección simple con meses de riesgo legal y de seguridad acumulado.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (mantenimiento de ascensores): ¿qué corrección de bajo esfuerzo resolvía la causa raíz?",
      options: [
        "Agregar las tareas obligatorias al Incident Type",
        "Crear una app Canvas separada para cada técnico",
        "Eliminar auditorías de seguridad",
        "Pedir a los técnicos recordar pasos de memoria"
      ],
      answer: [0],
      explanation: "La corrección fue una configuración directa: convertir pasos críticos en tareas obligatorias del Incident Type.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (mantenimiento de ascensores): ¿qué principio de Field Service demuestra este caso?",
      options: [
        "Los procedimientos críticos deben modelarse como checklist operativo obligatorio, no quedar al criterio individual",
        "Los técnicos siempre deben decidir libremente qué revisar",
        "Los Incident Types solo sirven para reportes comerciales",
        "La app móvil reemplaza cualquier configuración de proceso"
      ],
      answer: [0],
      explanation: "Field Service debe codificar el procedimiento operativo para garantizar consistencia, auditoría y seguridad.",
      appliesTo: "caso"
    }
  ],
  59: [
    {
      type: "single",
      prompt: "¿Qué describe el proceso 'order-to-cash' (O2C) en Finance & Operations?",
      options: [
        "Desde que un cliente hace un pedido hasta que la empresa lo cobra: cumplimiento, factura y cobro",
        "Desde que se genera una necesidad de compra hasta que se paga a un proveedor",
        "El ciclo contable de registrar transacciones y cerrar el periodo financiero",
        "La gestión de inventario desde la recepción hasta la entrega"
      ],
      answer: [0],
      explanation: "Order-to-cash (O2C) va desde que el cliente hace un pedido hasta que la empresa lo cobra: pedido de venta, cumplimiento/envío, factura y cobro."
    },
    {
      type: "single",
      prompt: "En el proceso de SIT (Módulo 20/Lab 66), Dynamics 365 Sales cierra la venta con Quote→Order. ¿En qué proceso ERP estándar continúa esa venta dentro de Finance & Operations?",
      options: [
        "Order-to-cash, donde se gestiona el cumplimiento, la factura real, el impuesto y el cobro",
        "Procure-to-pay, porque toda venta implica automáticamente una compra",
        "Record-to-report, porque solo se registra contablemente sin más pasos",
        "Ningún proceso adicional es necesario una vez que Sales genera el Order"
      ],
      answer: [0],
      explanation: "Sales cierra la venta con Quote→Order, pero el cumplimiento, la factura real, el impuesto y el cobro viven en el ciclo order-to-cash de F&O, no en Dynamics 365 Sales."
    },
    {
      type: "single",
      prompt: "¿Qué proceso ERP estándar cubre desde la requisición de compra hasta el pago al proveedor?",
      options: [
        "Procure-to-pay (P2P)",
        "Order-to-cash (O2C)",
        "Record-to-report (R2R)",
        "Inventory-to-deliver (I2D)"
      ],
      answer: [0],
      explanation: "Procure-to-pay (P2P) cubre requisición → orden de compra → recepción de mercancía → factura de proveedor → pago."
    },
    {
      type: "single",
      prompt: "Un stakeholder pide mostrar el saldo de inventario de un producto dentro de una Opportunity de Sales, sin duplicar el dato en Dataverse. ¿Qué mecanismo aplica mejor?",
      options: [
        "Virtual tables, porque solo se necesita lectura en tiempo real sin duplicar ni escribir el dato",
        "Dual-write, porque siempre es la opción por defecto para cualquier integración con F&O",
        "Data Management Framework, porque es una carga masiva puntual",
        "Ninguno de los tres — Power Platform no puede mostrar datos de F&O bajo ninguna circunstancia"
      ],
      answer: [0],
      explanation: "Cuando solo se necesita leer datos de F&O sin escribir ni duplicarlos, las virtual tables son la opción correcta — dual-write implicaría una réplica sincronizada innecesaria y DMF es para cargas por lotes, no lectura en tiempo real."
    },
    {
      type: "single",
      prompt: "¿Cuándo se justifica usar dual-write en vez de Data Management Framework (DMF)?",
      options: [
        "Cuando el usuario necesita escribir en ambos sistemas con continuidad operativa, no solo una carga puntual",
        "Siempre que se requiera mover cualquier volumen de datos entre F&O y Dataverse",
        "Únicamente para escenarios de analítica masiva",
        "Nunca — DMF siempre reemplaza a dual-write en cualquier escenario"
      ],
      answer: [0],
      explanation: "Dual-write se justifica cuando se necesita escritura continua en ambos sistemas con continuidad operativa (ej. un cliente creado en Sales debe existir en F&O); DMF es para cargas masivas o migraciones puntuales, no sincronización continua."
    },
    {
      type: "single",
      prompt: "Una empresa construyó en Dataverse una tabla personalizada que calculaba impuestos y validaba crédito, duplicando lógica que ya existía en su ERP. ¿Cuál fue la consecuencia cuando cambió una tasa de impuesto regional?",
      options: [
        "El ERP se actualizó pero nadie recordó actualizar la tabla de Dataverse, generando aprobaciones con impuestos incorrectos durante semanas",
        "Ambos sistemas se sincronizaron automáticamente sin ningún problema",
        "No hubo ninguna consecuencia porque los impuestos nunca cambian",
        "El sistema rechazó automáticamente todas las cotizaciones hasta corregir el error"
      ],
      answer: [0],
      explanation: "Al duplicar lógica fiscal en Dataverse, el cambio de tasa se actualizó en el ERP pero no en la réplica de Dataverse, generando aprobaciones con impuestos incorrectos durante semanas hasta que Finanzas lo detectó."
    },
    {
      type: "single",
      prompt: "¿Por qué el licenciamiento de Finance & Operations suele ser una conversación comercial separada de Dynamics 365 CE?",
      options: [
        "Porque F&O se licencia por un pool distinto al de Sales/Service/Field Service, y un proyecto que combina ambos casi siempre involucra dos conversaciones de licenciamiento",
        "Porque F&O y CE siempre comparten exactamente el mismo tipo de licencia",
        "Porque Dynamics 365 CE no requiere ningún licenciamiento",
        "Porque el licenciamiento de F&O nunca se discute en un proyecto de arquitectura"
      ],
      answer: [0],
      explanation: "Finance & Operations se licencia por separado de Dynamics 365 CE; un proyecto que combina ambos casi siempre involucra dos conversaciones de licenciamiento distintas con el cliente."
    },
    {
      type: "single",
      prompt: "Al diseñar dual-write entre F&O y Dataverse, ¿qué error de seguridad es común si no se mapean explícitamente los modelos?",
      options: [
        "Asumir que los roles de seguridad de F&O (duties/privileges) son equivalentes a los Security Roles de Dataverse sin verificarlo",
        "Que Dataverse no tenga ningún modelo de seguridad propio",
        "Que F&O no permita configurar ningún tipo de rol",
        "Que dual-write elimine automáticamente la necesidad de seguridad en ambos sistemas"
      ],
      answer: [0],
      explanation: "F&O tiene su propio modelo de seguridad basado en duties/privileges, distinto del modelo de Security Roles de Dataverse — asumir que son equivalentes sin mapearlos explícitamente es un error común al diseñar dual-write."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ERP vs Dataverse): ¿qué error cometió el distribuidor al crear una tabla custom de impuestos y crédito en Dataverse?",
      options: [
        "Duplicó lógica fiscal y de crédito que pertenecía al ERP regulatoriamente actualizado",
        "Usó Dataverse para almacenar oportunidades",
        "Permitió que Finanzas conciliara información",
        "Integró Sales con un sistema legado"
      ],
      answer: [0],
      explanation: "El problema fue replicar lógica regulatoria del ERP en Dataverse por conveniencia de UI.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ERP vs Dataverse): ¿qué ocurrió cuando cambió la tasa de IVA regional?",
      options: [
        "El ERP se actualizó, pero la réplica en Dataverse quedó obsoleta y aprobó cotizaciones con impuestos incorrectos",
        "Dataverse actualizó automáticamente la tabla custom",
        "Sales bloqueó todas las oportunidades",
        "El sistema heredado dejó de existir"
      ],
      answer: [0],
      explanation: "La duplicación hizo que una regla fiscal se actualizara en un sistema pero no en la copia custom de Dataverse.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (ERP vs Dataverse): ¿cuáles DOS tipos de lógica debían permanecer en el sistema ERP o equivalente?",
      options: [
        "Cálculo fiscal",
        "Validación de crédito del cliente",
        "Color de la vista de oportunidades",
        "Texto de ayuda del formulario comercial"
      ],
      answer: [0, 1],
      explanation: "El caso menciona impuestos y crédito como lógica que pertenece al sistema que la mantiene regulatoriamente actualizada.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ERP vs Dataverse): ¿cuál habría sido un diseño más sano para Sales?",
      options: [
        "Consultar o integrarse con el sistema dueño de impuestos/crédito en vez de replicar esa lógica en una tabla custom",
        "Copiar manualmente reglas fiscales cada mes sin ownership",
        "Permitir que cada vendedor decida impuestos",
        "Bloquear toda integración entre CE y ERP"
      ],
      answer: [0],
      explanation: "La solución correcta respeta el ownership: Sales puede consumir el resultado, pero no duplicar la lógica regulatoria.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (ERP vs Dataverse): ¿qué señal temprana debía haber frenado la solución custom?",
      options: [
        "La necesidad de mantener reglas fiscales y de crédito sincronizadas manualmente con otro sistema",
        "Que los vendedores quisieran una UI ágil",
        "Que existiera una Opportunity en Sales",
        "Que el ERP fuera legado y no D365 F&O"
      ],
      answer: [0],
      explanation: "Si una regla requiere actualización regulatoria en otro sistema, duplicarla manualmente crea riesgo operativo.",
      appliesTo: "caso"
    }
  ],
  60: [
    {
      type: "single",
      prompt: "En Dynamics 365 Sales, ¿por qué forecast category no debe confundirse con la etapa de la Opportunity?",
      options: [
        "Porque la etapa describe avance operativo y forecast category expresa compromiso comercial esperado",
        "Porque forecast category reemplaza por completo al proceso de ventas",
        "Porque la etapa solo existe para reportes de Customer Service",
        "Porque forecast category calcula impuestos de F&O"
      ],
      answer: [0],
      explanation: "La etapa indica avance del proceso; forecast category clasifica compromiso comercial como Pipeline, Best Case o Committed."
    },
    {
      type: "single",
      prompt: "¿Qué elemento es indispensable antes de activar un forecast real en Dynamics 365 Sales?",
      options: [
        "Jerarquía comercial, periodos/cuotas y usuarios con licencia/configuración de Sales",
        "Un flujo de escritorio de Power Automate",
        "Un Agreement de Field Service",
        "Una virtual table de inventario"
      ],
      answer: [0],
      explanation: "Forecasting real requiere jerarquía, periodos, cuotas y configuración en un ambiente/licencia de Dynamics 365 Sales."
    },
    {
      type: "single",
      prompt: "¿Cuál es una regla sana de pipeline hygiene?",
      options: [
        "Toda oportunidad activa debe tener fecha de cierre vigente, next step y categoría de forecast revisada",
        "Toda oportunidad debe estar siempre en Committed",
        "Las oportunidades vencidas deben ocultarse del forecast",
        "No se deben usar campos obligatorios en ventas"
      ],
      answer: [0],
      explanation: "Pipeline hygiene exige datos accionables y actualizados: fecha, siguiente paso, etapa coherente y forecast category revisada."
    },
    {
      type: "single",
      prompt: "Si F&O será responsable de facturación fiscal e inventario, ¿qué debe evitarse en Dynamics 365 Sales?",
      options: [
        "Duplicar lógica fiscal, disponibilidad real o cumplimiento que pertenece a F&O",
        "Usar oportunidades y cuentas",
        "Definir territorios comerciales",
        "Revisar el pipeline semanalmente"
      ],
      answer: [0],
      explanation: "Sales gestiona el proceso comercial; F&O debe mantener lógica regulatoria, inventario y facturación cuando es el ERP dueño."
    },
    {
      type: "multi",
      prompt: "¿Qué evidencias pertenecen a un lab de Sales Forecasting & Pipeline Review?",
      options: [
        "Matriz de forecast por vendedor",
        "Oportunidades con next step y riesgo",
        "Perfil offline de Field Service Mobile",
        "Agenda de revisión de pipeline"
      ],
      answer: [0, 1, 3],
      explanation: "El lab de Sales se centra en forecast, oportunidades, riesgos y cadencia de revisión; el perfil offline pertenece a Field Service."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (forecast en Excel): ¿por qué Dirección veía un pipeline inflado?",
      options: [
        "Porque los vendedores dejaban oportunidades en Pipeline y actualizaban compromisos reales solo en Excel",
        "Porque Dynamics 365 Sales no tiene forecast categories",
        "Porque Finanzas no podía acceder a hojas de cálculo",
        "Porque todas las oportunidades estaban cerradas como ganadas"
      ],
      answer: [0],
      explanation: "El CRM existía, pero el comportamiento comercial no estaba gobernado: compromiso real vivía fuera de Sales.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (forecast en Excel): ¿qué cambio fue más importante que agregar más campos?",
      options: [
        "Gobernar el comportamiento comercial con forecast categories, reviews y reglas de cierre",
        "Crear otra hoja Excel con más columnas",
        "Eliminar todas las oportunidades antiguas",
        "Mover Forecasting a Customer Service"
      ],
      answer: [0],
      explanation: "El caso recalca que la solución fue de operación comercial: categorías obligatorias, cadencia y dashboard único.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (forecast en Excel): ¿cuáles DOS medidas formaron parte de la corrección?",
      options: [
        "Forecast categories obligatorias por etapa mínima",
        "Cadencia semanal de pipeline review",
        "Eliminar Dynamics 365 Sales del proceso",
        "Permitir que cada vendedor mantenga su Excel privado"
      ],
      answer: [0, 1],
      explanation: "El caso menciona forecast categories obligatorias y pipeline review semanal como parte de la corrección.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (forecast en Excel): ¿por qué Finanzas no podía anticipar ingresos de forma confiable?",
      options: [
        "Porque el compromiso real no estaba en Sales y el pipeline aparecía sin distinción entre Pipeline y Committed",
        "Porque Sales no permite reportes financieros",
        "Porque las oportunidades no tenían nombres",
        "Porque Customer Insights no estaba implementado"
      ],
      answer: [0],
      explanation: "Sin forecast categories confiables en el sistema, Finanzas veía datos inflados y no accionables.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (forecast en Excel): ¿qué evidencia indicaría que la corrección funcionó?",
      options: [
        "Dashboard único en Sales usado en reviews y abandono de hojas Excel paralelas",
        "Más hojas Excel por región",
        "Oportunidades sin fecha de cierre",
        "Menos uso de forecast categories"
      ],
      answer: [0],
      explanation: "El caso dice que nadie volvió a mirar Excel porque el dashboard y las reglas de Sales pasaron a gobernar la operación.",
      appliesTo: "caso"
    }
  ],
  61: [
    {
      type: "single",
      prompt: "¿Qué diferencia un entitlement de un SLA en Customer Service?",
      options: [
        "El entitlement define derechos/cobertura de servicio; el SLA mide compromisos operativos como respuesta o resolución",
        "El entitlement reemplaza a las colas",
        "El SLA define productos del catálogo de Sales",
        "No existe diferencia funcional"
      ],
      answer: [0],
      explanation: "Entitlement y SLA se relacionan, pero uno define cobertura/derechos y el otro compromisos medibles."
    },
    {
      type: "single",
      prompt: "¿Qué debe incluir un SLA enterprise para evitar métricas engañosas?",
      options: [
        "Calendario, pausa/reanudación, warning, failure y acciones de escalamiento",
        "Solo una fecha de vencimiento manual",
        "Únicamente el nombre del cliente",
        "Un dashboard de ventas"
      ],
      answer: [0],
      explanation: "Sin calendario y reglas de pausa/reanudación, el temporizador no refleja el compromiso operativo real."
    },
    {
      type: "single",
      prompt: "¿Cuál es una señal de que una cola de Customer Service está mal gobernada?",
      options: [
        "No tiene owner, aging ni métrica de backlog",
        "Tiene casos asignables",
        "Tiene agentes asociados",
        "Se usa para separar trabajo por prioridad"
      ],
      answer: [0],
      explanation: "Una cola sin responsable ni métrica se convierte en trabajo invisible."
    },
    {
      type: "single",
      prompt: "¿Qué prueba negativa es importante en un diseño SLA + routing?",
      options: [
        "Un caso que incumple SLA y dispara warning/failure",
        "Solo un caso que cierra exitosamente",
        "Un forecast de ventas ganado",
        "Una orden de compra de F&O"
      ],
      answer: [0],
      explanation: "El UAT debe demostrar incumplimientos, pausas y escalamiento, no solo el caso feliz."
    },
    {
      type: "multi",
      prompt: "¿Qué componentes son típicos de Customer Service avanzado?",
      options: [
        "Queues",
        "Entitlements",
        "SLA",
        "Chart of accounts de F&O"
      ],
      answer: [0, 1, 2],
      explanation: "Queues, entitlements y SLA son componentes de servicio; chart of accounts pertenece a Finance."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SLA contractual): ¿por qué los reportes penalizaban injustamente a agentes?",
      options: [
        "Porque el SLA no pausaba cuando el caso esperaba respuesta del cliente",
        "Porque los agentes no podían resolver casos urgentes",
        "Porque Customer Service no admite calendarios de soporte",
        "Porque los contratos estaban en PDF"
      ],
      answer: [0],
      explanation: "Un caso en espera del cliente aparecía incumplido porque la lógica de pausa del SLA no estaba configurada.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SLA contractual): ¿qué convirtió el contrato de PDF archivado en lógica operativa auditable?",
      options: [
        "Modelar entitlements, calendario, reglas de pausa, warning y escalation",
        "Pedir a los agentes memorizar los contratos",
        "Crear una hoja Excel de tiempos",
        "Eliminar los reportes de SLA"
      ],
      answer: [0],
      explanation: "La remediación fue modelar explícitamente las reglas contractuales en Dynamics 365 Customer Service.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (SLA contractual): ¿cuáles DOS elementos faltantes explican los tiempos inconsistentes?",
      options: [
        "Reglas de pausa del SLA",
        "Calendario/horario de soporte configurado",
        "Customer Insights - Journeys",
        "Dual-write con F&O"
      ],
      answer: [0, 1],
      explanation: "Pausas y calendario determinan cómo se mide el tiempo real del SLA. Sin ellos, el reporte no refleja obligación contractual.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SLA contractual): ¿qué cambio mejora la defensa ante el cliente?",
      options: [
        "Datos auditables de cumplimiento, pausas y escalaciones configuradas en el sistema",
        "Explicaciones manuales caso por caso sin evidencia",
        "Ocultar casos incumplidos del reporte",
        "Medir todos los casos con un reloj continuo sin pausas"
      ],
      answer: [0],
      explanation: "El caso destaca que el equipo pudo defenderse con datos, no con excusas, al modelar correctamente SLA y entitlements.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (SLA contractual): ¿cuál es la lección principal para Customer Service avanzado?",
      options: [
        "Los SLA de contrato deben configurarse como lógica operacional, no quedarse solo en documentos legales",
        "Los SLA deben depender de memoria del agente",
        "Los contratos no deben reflejarse en el sistema",
        "La pausa de SLA siempre debe estar deshabilitada"
      ],
      answer: [0],
      explanation: "La madurez está en traducir compromisos contractuales a configuración auditable y operable.",
      appliesTo: "caso"
    }
  ],
  62: [
    {
      type: "single",
      prompt: "¿Qué agrega Contact Center/Omnichannel sobre un diseño clásico de Customer Service?",
      options: [
        "Canales, conversaciones, presencia, capacidad, unified routing y operación en tiempo real",
        "Solo una tabla adicional de casos",
        "Cálculo fiscal de facturas",
        "Forecasting de oportunidades"
      ],
      answer: [0],
      explanation: "Contact Center agrega la operación de canales y distribución de conversaciones en tiempo real."
    },
    {
      type: "single",
      prompt: "¿Por qué capacity profile y presence son críticos en un workstream?",
      options: [
        "Evitan asignar más conversaciones de las que un agente puede atender",
        "Definen el plan de cuentas financiero",
        "Reemplazan la necesidad de consentimiento",
        "Cambian automáticamente la licencia del usuario"
      ],
      answer: [0],
      explanation: "Capacidad y presencia protegen la calidad operativa limitando asignaciones simultáneas."
    },
    {
      type: "single",
      prompt: "¿Qué debe conservar un handoff correcto de bot a agente?",
      options: [
        "Intención, transcript, resumen, cliente identificado y prioridad",
        "Solo el saludo inicial del bot",
        "El inventario disponible de F&O",
        "La cuota trimestral del vendedor"
      ],
      answer: [0],
      explanation: "Sin contexto, el agente debe repetir preguntas y la experiencia se degrada."
    },
    {
      type: "single",
      prompt: "¿Qué métrica ayuda a detectar mala experiencia en un canal de chat?",
      options: [
        "Abandon rate",
        "Three-way match",
        "Forecast gap",
        "Project-to-profit"
      ],
      answer: [0],
      explanation: "Abandon rate muestra usuarios que abandonan antes de ser atendidos o resolver su necesidad."
    },
    {
      type: "multi",
      prompt: "¿Qué elementos requieren normalmente tenant/licencia/canal real para probar Contact Center?",
      options: [
        "Canal configurado",
        "Agentes con presencia/capacidad",
        "Workstream y unified routing",
        "Una matriz en papel solamente"
      ],
      answer: [0, 1, 2],
      explanation: "El diseño puede documentarse sin tenant, pero la prueba real necesita canal, agentes y configuración."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (chat omnicanal): ¿cuál era la causa real de la tasa alta de abandono?",
      options: [
        "Falta de capacity profiles, presencia, skills y reglas de routing que evitaran saturar agentes",
        "Caída técnica del canal de chat",
        "Falta de una tabla custom de conversaciones",
        "Problema fiscal en F&O"
      ],
      answer: [0],
      explanation: "El canal no se caía; unified routing asignaba demasiado trabajo porque no había capacidad/presencia gobernadas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (chat omnicanal): ¿por qué escalar a infraestructura no resolvía el problema?",
      options: [
        "Porque el problema no era de disponibilidad técnica, sino de configuración operativa del routing",
        "Porque Contact Center no usa infraestructura",
        "Porque los agentes no tenían licencias de Sales",
        "Porque la campaña de marketing no generaba volumen"
      ],
      answer: [0],
      explanation: "El diagnóstico inicial fue equivocado: no faltaba infraestructura, faltaba gobernar distribución de trabajo.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (chat omnicanal): ¿cuáles DOS configuraciones fueron parte de la solución?",
      options: [
        "Capacity profiles",
        "Presencia y reglas de unified routing",
        "Tabla custom de IVA",
        "Deshabilitar todos los canales digitales"
      ],
      answer: [0, 1],
      explanation: "La solución incluyó capacity profiles, presencia, skills y reglas de routing por prioridad.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (chat omnicanal): ¿qué métrica de experiencia estaba empeorando aunque el canal funcionaba técnicamente?",
      options: [
        "Tasa de abandono",
        "Número de Work Orders",
        "Porcentaje de matching de perfiles",
        "Cantidad de soluciones managed"
      ],
      answer: [0],
      explanation: "El canal estaba disponible, pero los clientes abandonaban por saturación de agentes.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (chat omnicanal): ¿qué aprendizaje operativo deja el caso?",
      options: [
        "Abrir canales sin gobernar capacidad y routing puede empeorar la experiencia aunque la plataforma esté disponible",
        "Más canales siempre mejoran la atención sin configuración adicional",
        "La presencia de agentes es irrelevante para routing",
        "Unified routing solo sirve para llamadas telefónicas"
      ],
      answer: [0],
      explanation: "La calidad omnicanal depende de distribuir trabajo según capacidad, presencia, skills y prioridad.",
      appliesTo: "caso"
    }
  ],
  63: [
    {
      type: "single",
      prompt: "¿Cuál es la frontera correcta entre Customer Insights - Data y Customer Insights - Journeys?",
      options: [
        "Data unifica perfiles/segmentos; Journeys orquesta comunicaciones y experiencias",
        "Journeys reemplaza la unificación de perfiles",
        "Data solo envía emails masivos",
        "No hay diferencia entre ambos productos"
      ],
      answer: [0],
      explanation: "Data construye Customer 360 y segmentos; Journeys activa experiencias y comunicaciones."
    },
    {
      type: "single",
      prompt: "En un real-time journey, ¿qué rol cumple un trigger?",
      options: [
        "Inicia o ramifica el journey a partir de un evento o condición",
        "Define el plan de cuentas de F&O",
        "Calcula la cuota de ventas",
        "Asigna técnicos en Field Service"
      ],
      answer: [0],
      explanation: "El trigger es el evento que inicia o modifica el recorrido en tiempo real."
    },
    {
      type: "single",
      prompt: "¿Qué debe validarse antes de enviar comunicaciones desde Journeys?",
      options: [
        "Consentimiento por propósito y canal",
        "Solo que el contacto tenga nombre",
        "Que exista una Work Order abierta",
        "Que haya inventario disponible"
      ],
      answer: [0],
      explanation: "El consentimiento debe validarse por propósito/canal antes del envío."
    },
    {
      type: "single",
      prompt: "¿Por qué en 2026 conviene diseñar sobre real-time journeys y no depender de outbound heredado?",
      options: [
        "Porque Microsoft ha movido el foco a journeys en tiempo real y outbound heredado está retirándose/removido",
        "Porque real-time journeys no requiere consentimiento",
        "Porque outbound heredado es el único modelo soportado",
        "Porque Journeys solo funciona con F&O"
      ],
      answer: [0],
      explanation: "El diseño actualizado debe evitar depender de capacidades outbound heredadas y privilegiar real-time journeys."
    },
    {
      type: "multi",
      prompt: "¿Qué pruebas deben existir para un journey de renovación?",
      options: [
        "Contacto con consentimiento válido",
        "Contacto sin consentimiento",
        "Contacto con email inválido",
        "Pedido de compra aprobado en F&O"
      ],
      answer: [0, 1, 2],
      explanation: "Las pruebas deben cubrir caso feliz y exclusiones negativas del canal/consentimiento."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (real-time journey): ¿cuál fue el problema de consentimiento detectado por Legal?",
      options: [
        "Se reutilizó consentimiento de servicio para comunicaciones de marketing sin opt-in vigente para ese propósito",
        "No existía ningún contacto en Dataverse",
        "El journey no tenía correos configurados",
        "El trigger era demasiado lento técnicamente"
      ],
      answer: [0],
      explanation: "El consentimiento existía para servicio, no para marketing; propósito y opt-in no son intercambiables.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (real-time journey): ¿qué debía revisarse antes de migrar campañas outbound históricas?",
      options: [
        "Propósitos, fuentes de consentimiento, exclusiones y triggers",
        "Solo el diseño visual del email",
        "Únicamente la cantidad de contactos",
        "El nombre interno del journey"
      ],
      answer: [0],
      explanation: "La corrección fue redefinir propósitos, fuentes, exclusiones y pruebas negativas antes de activar comunicaciones.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (real-time journey): ¿cuáles DOS controles reducen riesgo de enviar marketing sin permiso?",
      options: [
        "Pruebas negativas de contactos sin opt-in válido",
        "Propósitos de consentimiento separados para servicio y marketing",
        "Reutilizar cualquier consentimiento disponible",
        "Activar el journey primero y revisar después"
      ],
      answer: [0, 1],
      explanation: "Separar propósitos y probar exclusiones evita que contactos sin consentimiento aplicable entren al journey.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (real-time journey): ¿por qué compliance debe diseñarse desde el primer nodo del journey?",
      options: [
        "Porque triggers, audiencias y consentimiento determinan quién puede recibir cada comunicación",
        "Porque Legal solo revisa después del envío masivo",
        "Porque Customer Insights - Journeys no permite pruebas",
        "Porque compliance solo afecta el texto del asunto"
      ],
      answer: [0],
      explanation: "El cumplimiento no es una capa final; define segmentación, exclusiones y condiciones desde el diseño.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (real-time journey): ¿qué resultado indica que el revisor legal intervino a tiempo?",
      options: [
        "Detectó el problema antes del despliegue masivo",
        "El journey ya había enviado correos a toda la base",
        "Se eliminó todo Customer Insights",
        "Se aprobó reutilizar consentimiento de servicio para marketing"
      ],
      answer: [0],
      explanation: "El caso dice que Legal detectó el problema antes del despliegue masivo, evitando mayor impacto.",
      appliesTo: "caso"
    }
  ],
  64: [
    {
      type: "single",
      prompt: "¿Cuál es el propósito de una matriz de ownership CE + F&O?",
      options: [
        "Definir sistema dueño, consumidores, dirección, patrón y regla de conflicto por entidad",
        "Reemplazar todas las integraciones con Excel",
        "Eliminar seguridad en Dataverse",
        "Crear campañas de marketing"
      ],
      answer: [0],
      explanation: "La matriz evita ownership ambiguo y guía el patrón de integración correcto."
    },
    {
      type: "single",
      prompt: "¿Cuándo tiene sentido dual-write?",
      options: [
        "Cuando se requiere sincronización continua y escritura operativa entre Dataverse y F&O para entidades soportadas",
        "Cuando solo se necesita leer inventario en tiempo real",
        "Cuando se hace una migración puntual",
        "Cuando se quiere evitar definir ownership"
      ],
      answer: [0],
      explanation: "Dual-write sirve para continuidad operativa sincronizada, no para lectura simple ni cargas puntuales."
    },
    {
      type: "single",
      prompt: "Si solo se necesita consultar saldo de inventario de F&O en Sales sin copiarlo, ¿qué patrón encaja mejor?",
      options: [
        "Virtual tables",
        "Dual-write para todo",
        "Entitlements",
        "Real-time journey"
      ],
      answer: [0],
      explanation: "Virtual tables permiten lectura sin duplicar el dato."
    },
    {
      type: "single",
      prompt: "¿Qué control operativo debe existir en una integración CE + F&O?",
      options: [
        "Monitoreo, reconciliación, owner de errores y rollback",
        "Solo un diagrama inicial",
        "Un forecast de ventas",
        "Un bot sin handoff"
      ],
      answer: [0],
      explanation: "La integración necesita operación continua, no solo diseño inicial."
    },
    {
      type: "multi",
      prompt: "¿Qué elementos deben aparecer en una matriz CE + F&O por entidad?",
      options: [
        "Sistema dueño",
        "Patrón de integración",
        "Regla de conflicto",
        "Color del tema de la app"
      ],
      answer: [0, 1, 2],
      explanation: "Ownership, patrón y conflicto son decisiones críticas; el color visual no resuelve integración."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (dual-write ownership): ¿qué faltó antes de activar la sincronización de clientes?",
      options: [
        "Decidir ownership de datos entre Sales y F&O",
        "Crear más campos duplicados en ambos sistemas",
        "Desactivar reconciliación",
        "Usar solo nombres comerciales en facturas fiscales"
      ],
      answer: [0],
      explanation: "Sin ownership explícito, ambos sistemas escribían cambios en direcciones opuestas.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (dual-write ownership): ¿qué reveló el reporte fiscal incorrecto?",
      options: [
        "Una guerra silenciosa de sobrescrituras entre datos comerciales y fiscales",
        "Que dual-write nunca sincronizó ningún cliente",
        "Que Sales debía ser dueño de datos fiscales",
        "Que F&O no tiene relación con facturación"
      ],
      answer: [0],
      explanation: "El nombre incorrecto en factura oficial evidenció sobrescrituras no gobernadas entre sistemas.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (dual-write ownership): según la solución, ¿cuáles DOS ownerships quedaron claros?",
      options: [
        "Sales dueño de datos comerciales",
        "F&O dueño de datos fiscales y de crédito",
        "Marketing dueño de datos fiscales",
        "El bot de IA dueño de todos los campos"
      ],
      answer: [0, 1],
      explanation: "La matriz asignó Sales a datos comerciales y F&O a datos fiscales/crédito.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (dual-write ownership): ¿qué práctica ayuda a detectar discrepancias antes de que lleguen a documentos fiscales?",
      options: [
        "Reconciliación semanal entre sistemas",
        "Esperar a la próxima auditoría anual",
        "Permitir edición libre de todos los campos en ambos sistemas",
        "Desactivar reportes fiscales"
      ],
      answer: [0],
      explanation: "La solución incluyó reconciliación semanal para detectar discrepancias temprano.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (dual-write ownership): ¿cuál es la lección sobre integración CE + F&O?",
      options: [
        "Integrar sistemas exige gobierno de datos y reglas explícitas, no solo conexión técnica",
        "Dual-write elimina la necesidad de ownership",
        "Si dos sistemas editan el mismo campo, siempre gana el más reciente sin impacto",
        "La integración debe evitar roles y reglas de edición"
      ],
      answer: [0],
      explanation: "El caso cierra con esa idea: la integración pasó de conectar sistemas a gobernar datos con reglas explícitas.",
      appliesTo: "caso"
    }
  ],
  65: [
    {
      type: "single",
      prompt: "¿Qué distingue al capstone Enterprise D365 de una simple demo de pantallas?",
      options: [
        "Incluye arquitectura, Fit-Gap, ownership, roadmap, UAT, licencias y evidencias de portafolio",
        "Solo muestra navegación por menús",
        "Evita mencionar riesgos",
        "No requiere explicar datos ni integración"
      ],
      answer: [0],
      explanation: "El capstone demuestra criterio de arquitectura y consultoría, no solo uso de UI."
    },
    {
      type: "single",
      prompt: "¿Por qué un roadmap por fases es preferible a un big bang D365 enterprise?",
      options: [
        "Permite entregar valor incremental, reducir riesgo y validar dependencias por producto",
        "Porque impide integrar sistemas",
        "Porque elimina toda necesidad de licencias",
        "Porque evita hacer UAT"
      ],
      answer: [0],
      explanation: "Una arquitectura completa puede desplegarse por fases para controlar adopción, licencias, datos e integración."
    },
    {
      type: "single",
      prompt: "¿Qué debe cubrir la matriz de datos del capstone?",
      options: [
        "Account, Contact, Opportunity, Case, Conversation, Work Order, Product, Sales Order, Invoice e Inventory con ownership",
        "Solo nombres de usuarios",
        "Únicamente colores del dashboard",
        "Solo preguntas de entrevista"
      ],
      answer: [0],
      explanation: "La matriz de datos define ownership y frontera entre CE, Customer Insights, Field Service y F&O."
    },
    {
      type: "single",
      prompt: "¿Qué dependencia debe declararse explícitamente en un capstone serio?",
      options: [
        "Licencias/tenant por producto, canales, usuarios, datos e integraciones",
        "Solo la preferencia de color del cliente",
        "Que todo funciona sin ambiente real",
        "Que F&O no requiere especialistas"
      ],
      answer: [0],
      explanation: "Un diseño enterprise debe transparentar dependencias reales de licenciamiento y ambiente."
    },
    {
      type: "multi",
      prompt: "¿Qué evidencias son válidas para portafolio en el Capstone Enterprise D365?",
      options: [
        "Diagrama de arquitectura",
        "Matriz Fit-Gap",
        "Casos UAT end-to-end",
        "Solo una captura aislada del menú principal"
      ],
      answer: [0, 1, 2],
      explanation: "Portafolio defendible requiere artefactos de diseño y validación, no capturas aisladas."
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (capstone D365): ¿por qué el primer UAT reveló decenas de vacíos simultáneos?",
      options: [
        "Porque se intentó implementar Sales, Service, Field Service e integración ERP en una sola salida sin ownership, pruebas por canal ni adopción",
        "Porque el comité ejecutivo no quería usar Dynamics 365",
        "Porque Field Service no tiene app móvil",
        "Porque Customer Insights impide fases incrementales"
      ],
      answer: [0],
      explanation: "El alcance integrado no tenía gobierno ni pruebas suficientes por producto/canal, por eso UAT concentró demasiados vacíos.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (capstone D365): ¿qué estrategia rescató el proyecto?",
      options: [
        "Dividirlo en fases con valor incremental y ownership claro",
        "Aumentar alcance para incluir todos los productos a la vez",
        "Eliminar UAT para no encontrar más vacíos",
        "Desplegar todo directo a producción"
      ],
      answer: [0],
      explanation: "El proyecto se rescató por fases: pipeline, SLA/casos, Field Service, Customer Insights e integración ERP gobernada.",
      appliesTo: "caso"
    },
    {
      type: "multi",
      prompt: "Diagnóstico de caso (capstone D365): ¿cuáles DOS vacíos de gobierno estaban presentes antes del rescate?",
      options: [
        "Sin ownership de datos definido",
        "Sin plan de adopción para técnicos de Field Service móvil",
        "Demasiadas pruebas negativas bien documentadas",
        "Pipeline ERP ya gobernado con matriz completa"
      ],
      answer: [0, 1],
      explanation: "El caso menciona falta de ownership y falta de adopción para técnicos como brechas claves.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (capstone D365): ¿cuál fue la primera fase de valor incremental sugerida?",
      options: [
        "Pipeline comercial primero",
        "Integración ERP completa primero",
        "Customer Insights antes de tener datos gobernados",
        "Todos los canales de Contact Center primero"
      ],
      answer: [0],
      explanation: "El caso lista pipeline comercial como primera fase, antes de SLA/casos, Field Service, Customer Insights e integración ERP.",
      appliesTo: "caso"
    },
    {
      type: "single",
      prompt: "Diagnóstico de caso (capstone D365): ¿qué disciplina replica el capstone?",
      options: [
        "Arquitectura completa diseñada de una vez, pero implementación entregada por fases con valor demostrable",
        "Implementación sin arquitectura para avanzar rápido",
        "UAT solo al final de todos los productos juntos",
        "Cambios directos en producción para cada producto"
      ],
      answer: [0],
      explanation: "El capstone busca practicar esa disciplina: visión integrada, entrega incremental y evidencia de valor por fase.",
      appliesTo: "caso"
    }
  ],
  66: [
      {
          "type": "single",
          "prompt": "Un sistema legacy no expone API, pero su pantalla cambia cada semana y el volumen es bajo. ¿Cuál es la decisión más profesional?",
          "options": [
              "Automatizar con RPA sin más análisis",
              "Rechazar o posponer RPA y proponer mejora manual/proceso estable hasta reducir variabilidad",
              "Usar coordenadas para acelerar",
              "Prometer unattended"
          ],
          "answer": [
              1
          ],
          "explanation": "RPA requiere interfaz suficientemente estable y beneficio que justifique la deuda operativa."
      },
      {
          "type": "multi",
          "prompt": "¿Qué evidencias debe incluir una evaluación de viabilidad RPA?",
          "options": [
              "Matriz RPA/API/conector/cloud/manual",
              "Riesgos y excepciones",
              "Deuda operativa",
              "Contraseñas de prueba en texto plano"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La viabilidad combina opción técnica, riesgo, excepciones y operación; nunca secretos."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 66): En el proceso de correos, adjuntos y portal bancario, ¿qué parte justifica usar RPA?",
          "options": [
              "Solo la carga final en el portal bancario sin API disponible",
              "La lectura de correos aunque exista cloud flow",
              "La validación de datos aunque pueda hacerse en Excel o Dataverse",
              "Todo el proceso de punta a punta para evitar arquitectura"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso reduce la superficie frágil: correo, adjuntos y validación quedan en servicios más estables; RPA se reserva para la UI del portal sin API.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 66): ¿Qué decisiones reducen la deuda operativa del bot?",
          "options": [
              "Mover la descarga de correos y adjuntos a cloud flow",
              "Validar datos antes de abrir el portal bancario",
              "Usar RPA solo donde no existe API o conector viable",
              "Automatizar cada clic del proceso aunque haya alternativas"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La arquitectura profesional usa RPA como último tramo necesario, no como sustituto de integración, validación y orquestación disponibles.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 66): ¿Cuál sería una mala señal en la evaluación de viabilidad?",
          "options": [
              "Aceptar RPA para todo el proceso sin comparar API, conector, cloud flow o validación previa",
              "Documentar que el portal no tiene API",
              "Separar excepciones antes de cargar al banco",
              "Medir volumen y frecuencia del proceso"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso pide decidir con criterio. Si se automatiza todo por UI sin evaluar alternativas, aumenta fragilidad y costo de soporte.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 66): ¿Qué evidencias sustentan la decisión de automatizar solo el tramo bancario?",
          "options": [
              "El portal bancario no expone API útil para la carga",
              "El volumen del proceso justifica la operación del bot",
              "La validación previa reduce errores antes de tocar el portal",
              "El bot puede ejecutar con credenciales personales del desarrollador"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Viabilidad RPA combina ausencia de integración soportada, beneficio operativo y controles previos. Credenciales personales no son evidencia aceptable.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 66): ¿Qué resultado demuestra una arquitectura más mantenible?",
          "options": [
              "El bot recibe datos ya validados y solo registra en el portal sin API",
              "El bot abre Outlook, descarga adjuntos, valida, transforma y carga todo por pantalla",
              "El bot usa sleeps fijos para compensar cualquier demora",
              "El bot ignora registros dudosos sin trazabilidad"
          ],
          "answer": [
              0
          ],
          "explanation": "Un desktop flow pequeño, con entradas validadas y responsabilidad clara, es más fácil de soportar que una automatización UI gigante.",
          "appliesTo": "caso"
      }
  ],
  67: [
      {
          "type": "single",
          "prompt": "El flujo funciona attended pero falla unattended. ¿Qué revisar antes de modificar selectores?",
          "options": [
              "Usuario, sesión, permisos, runtime, máquina y resolución",
              "Solo colores de la app",
              "Únicamente el nombre del flujo",
              "Cambiar todos los botones a coordenadas"
          ],
          "answer": [
              0
          ],
          "explanation": "La diferencia attended/unattended suele estar en sesión, cuenta, máquina, permisos o runtime."
      },
      {
          "type": "single",
          "prompt": "¿Qué representa una conexión de máquina en RPA?",
          "options": [
              "Cómo Power Automate se conecta e inicia sesión para ejecutar en una máquina",
              "Un archivo Excel",
              "Un selector web",
              "Un tipo de variable"
          ],
          "answer": [
              0
          ],
          "explanation": "La conexión define la relación de ejecución con la máquina y sus credenciales asociadas."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 67): El bot funciona en el PC del desarrollador pero falla en la VM de operaciones. ¿Cuál es el diagnóstico más probable del caso?",
          "options": [
              "La aplicación legacy está instalada o configurada solo en el perfil del desarrollador",
              "El selector debe convertirse inmediatamente a coordenadas",
              "Power Automate Desktop no sirve para aplicaciones legacy",
              "La solución se corrige cambiando el nombre del flujo"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso describe una brecha de máquina, sesión, usuario e instalación. Antes de tocar acciones, hay que validar el entorno de ejecución.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 67): ¿Qué controles pertenecen al readiness de ejecución unattended?",
          "options": [
              "Aplicación instalada para el usuario que ejecuta el bot",
              "Permisos, sesión y resolución validados en la VM",
              "Credenciales y conexión de máquina configuradas por ambiente",
              "Dependencia de que el desarrollador deje su sesión abierta"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Unattended exige entorno reproducible. Depender de la sesión del desarrollador contradice el diseño operativo.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 67): ¿Qué corrección evita repetir el mismo fallo en UAT?",
          "options": [
              "Crear una checklist de máquina, usuario, instalación, permisos y prueba de arranque",
              "Agregar más esperas fijas en todos los pasos",
              "Cambiar todos los selectores por imágenes",
              "Ejecutar siempre desde el equipo del desarrollador"
          ],
          "answer": [
              0
          ],
          "explanation": "La solución es de arquitectura operativa: validar que la máquina objetivo puede iniciar y operar la app con la cuenta correcta.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 67): ¿Qué evidencias deben existir antes de declarar listo el bot?",
          "options": [
              "Ejecución exitosa en la VM de operaciones o TEST",
              "Registro de usuario usado, permisos y versión instalada",
              "Prueba de inicio de sesión y apertura de la aplicación legacy",
              "Captura del diseñador ejecutando en DEV únicamente"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La evidencia válida pertenece al entorno objetivo, no solo al diseñador o a la máquina del autor.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 67): ¿Por qué modificar selectores sin revisar la VM sería riesgoso?",
          "options": [
              "Porque podría ocultar que el problema real es instalación, usuario o sesión",
              "Porque los selectores nunca fallan en unattended",
              "Porque la VM no influye en PAD",
              "Porque los bots no requieren permisos"
          ],
          "answer": [
              0
          ],
          "explanation": "El síntoma aparece al cambiar de entorno. El primer análisis debe confirmar contexto de ejecución antes de cambiar la lógica.",
          "appliesTo": "caso"
      }
  ],
  68: [
      {
          "type": "single",
          "prompt": "¿Qué estructura favorece mantenibilidad en un desktop flow?",
          "options": [
              "Un flujo lineal de 200 acciones",
              "Subflows para inicializar, validar, ejecutar, errores, cierre y logging",
              "Variables sin nombre",
              "Pausas fijas entre todo"
          ],
          "answer": [
              1
          ],
          "explanation": "Separar responsabilidades permite soporte, pruebas y cambios más seguros."
      },
      {
          "type": "multi",
          "prompt": "¿Qué outputs son útiles para operación?",
          "options": [
              "Total procesado",
              "Errores",
              "Ruta del log",
              "Contraseña usada"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Outputs operativos resumen resultado sin exponer secretos."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 68): Un flujo con 180 acciones lineales es difícil de soportar. ¿Qué refactor responde mejor al caso?",
          "options": [
              "Dividirlo en subflows por validación, navegación, procesamiento, errores y cierre",
              "Agregar comentarios al inicio y dejar las 180 acciones juntas",
              "Duplicar el flujo para cada excepción",
              "Reemplazar toda validación por sleeps"
          ],
          "answer": [
              0
          ],
          "explanation": "Los subflows separan responsabilidades y permiten aislar puntos de reinicio, validación y soporte.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 68): ¿Qué beneficios espera soporte después del refactor?",
          "options": [
              "Encontrar más rápido dónde falló la ejecución",
              "Reducir cambios accidentales en pasos no relacionados",
              "Reiniciar desde checkpoints claros cuando sea seguro",
              "Eliminar la necesidad de registrar errores"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "El objetivo del caso es mantenibilidad operativa: diagnóstico más rápido, cambios acotados y reanudación controlada.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 68): ¿Qué señal indica que el flujo todavía no está listo para operación?",
          "options": [
              "Nadie puede explicar los puntos de validación y reinicio",
              "Tiene subflows con nombres de negocio",
              "Devuelve métricas al final",
              "Cierra aplicaciones en el cleanup"
          ],
          "answer": [
              0
          ],
          "explanation": "Si soporte no entiende dónde validar o reiniciar, el bot sigue siendo una caja negra frágil.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 68): ¿Qué subflows son coherentes con el caso?",
          "options": [
              "Inicializar y validar entradas",
              "Procesar registros",
              "Manejar excepciones y registrar evidencia",
              "Guardar contraseñas en variables visibles"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La estructura debe reflejar fases operativas. Secretos visibles no forman parte de un diseño mantenible.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 68): ¿Qué métrica demostraría mejora real después del refactor?",
          "options": [
              "Menor tiempo medio de diagnóstico y corrección de fallos",
              "Mayor cantidad de acciones en el mismo flujo",
              "Más dependencias de la pantalla del desarrollador",
              "Menos logs para leer"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso se centra en soporte. La mejora debe verse en tiempo de diagnóstico, cambios más seguros y menor esfuerzo operativo.",
          "appliesTo": "caso"
      }
  ],
  69: [
      {
          "type": "single",
          "prompt": "Un bot deja procesos Excel abiertos tras fallar. ¿Qué patrón corrige el riesgo?",
          "options": [
              "Subflow de cleanup ejecutado en éxito y error",
              "Aumentar memoria de la PC solamente",
              "Ignorar archivos bloqueados",
              "Usar Excel como base productiva"
          ],
          "answer": [
              0
          ],
          "explanation": "El cleanup controlado libera recursos aunque la ejecución falle."
      },
      {
          "type": "multi",
          "prompt": "¿Qué controles evitan duplicados al procesar archivos?",
          "options": [
              "Clave por registro o lote",
              "Carpeta de procesados",
              "Manifest de archivos",
              "Reprocesar todo sin validar"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La idempotencia requiere saber qué ya fue procesado."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 69): La operación carga archivos de sucursales cada mañana. ¿Qué control evita insertar registros duplicados?",
          "options": [
              "Una clave o manifest que marque archivos y registros ya procesados",
              "Reprocesar todos los archivos todos los días",
              "Cerrar Excel solo cuando no haya errores",
              "Cambiar la carpeta de entrada manualmente"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso requiere procesar solo novedades. La idempotencia necesita una marca persistente de lo ya cargado.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 69): ¿Qué controles operativos pertenecen al flujo?",
          "options": [
              "Cerrar Excel en éxito y error",
              "Generar reporte de auditoría por ejecución",
              "Mover o marcar archivos procesados",
              "Ignorar archivos fallidos para que el lote termine en verde"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "El bot debe liberar recursos, dejar evidencia y separar procesados. Ocultar fallos rompe la auditoría.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 69): ¿Qué decisión mejora la recuperación cuando un archivo falla a mitad del lote?",
          "options": [
              "Registrar estado por archivo o registro y continuar/reintentar de forma controlada",
              "Borrar todo el lote y comenzar desde cero sin validación",
              "Asumir que Excel cerrará automáticamente",
              "Guardar el resultado solo en la pantalla"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso exige continuidad diaria. Persistir estado permite reanudar sin duplicar ni perder trazabilidad.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 69): ¿Qué debe incluir el reporte de auditoría?",
          "options": [
              "Archivos recibidos, procesados, omitidos y fallidos",
              "Conteo de registros insertados y rechazados",
              "Detalle de errores o evidencia asociada",
              "Contraseña del usuario que ejecutó el bot"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Auditoría significa trazabilidad de resultado y error, no exposición de credenciales.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 69): ¿Qué práctica reduce bloqueos de archivos en ejecuciones futuras?",
          "options": [
              "Usar un subflow de cleanup que cierre libros y procesos Excel aun cuando ocurra error",
              "Dejar Excel abierto para revisar manualmente",
              "Reiniciar la máquina como primer paso normal",
              "Procesar con archivos abiertos por varios usuarios"
          ],
          "answer": [
              0
          ],
          "explanation": "Cerrar recursos en una ruta de limpieza evita archivos bloqueados y ejecuciones inestables al día siguiente.",
          "appliesTo": "caso"
      }
  ],
  70: [
      {
          "type": "single",
          "prompt": "Si un portal tiene API soportada para descargar datos, ¿qué alternativa suele ser preferible?",
          "options": [
              "API o conector antes que automatización UI",
              "Click por coordenadas",
              "OCR de toda la página",
              "Copiar manualmente siempre"
          ],
          "answer": [
              0
          ],
          "explanation": "Una API soportada suele ser más estable, observable y mantenible que UI automation."
      },
      {
          "type": "single",
          "prompt": "¿Qué espera es más robusta en una automatización web?",
          "options": [
              "Esperar a que exista/sea visible el elemento o estado esperado",
              "Sleep fijo muy largo",
              "Ninguna espera",
              "Mover el mouse al azar"
          ],
          "answer": [
              0
          ],
          "explanation": "La sincronización por estado reduce fallos por carga asincrónica."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 70): El proveedor no ofrece API y el volumen justifica automatización. ¿Por qué RPA es aceptable aquí?",
          "options": [
              "Porque automatiza una UI inevitable con beneficio operativo documentado",
              "Porque RPA debe usarse aunque exista una API estable",
              "Porque elimina la necesidad de monitorear cambios del portal",
              "Porque permite ignorar excepciones de negocio"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso cumple el criterio: portal sin API viable, volumen suficiente y proceso repetitivo. Aun así requiere monitoreo y runbook.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 70): ¿Qué debe declarar el runbook cuando el proveedor cambia el portal?",
          "options": [
              "Revisar selectores y DOM antes de reactivar producción",
              "Ejecutar una prueba de regresión del bot",
              "Registrar evidencia del cambio y ajuste realizado",
              "Seguir ejecutando con errores hasta que el usuario reclame"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "El caso menciona cambios de DOM como riesgo explícito. La operación debe tener pasos de revisión, prueba y evidencia.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 70): ¿Qué diseño es más robusto para consultar solicitudes y descargar reportes?",
          "options": [
              "Esperar estados o elementos específicos y validar cada descarga",
              "Usar sleeps largos sin verificar resultado",
              "Confiar en coordenadas para todos los botones",
              "Omitir logs para acelerar la ejecución"
          ],
          "answer": [
              0
          ],
          "explanation": "La automatización web debe sincronizar por estado visible/esperado y confirmar artefactos descargados.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 70): ¿Qué riesgos deben quedar explícitos en la evaluación?",
          "options": [
              "Cambios de DOM o texto en el portal",
              "Autenticación y disponibilidad del sitio del proveedor",
              "Formato de reportes descargados",
              "Que el volumen sea demasiado alto para justificar el bot"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "El caso depende de una UI externa y reportes descargados. Esos puntos son riesgos reales de mantenimiento.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 70): Si mañana el proveedor publica una API soportada, ¿qué decisión sería más profesional?",
          "options": [
              "Reevaluar la arquitectura y migrar gradualmente a integración API si reduce riesgo",
              "Mantener siempre la automatización UI aunque sea más frágil",
              "Duplicar el bot para comparar pantallas",
              "Eliminar auditoría porque la API existe"
          ],
          "answer": [
              0
          ],
          "explanation": "RPA no es dogma. Si aparece una integración soportada, conviene comparar costo, estabilidad y trazabilidad.",
          "appliesTo": "caso"
      }
  ],
  71: [
      {
          "type": "single",
          "prompt": "¿Por qué coordenadas e imágenes deben ser último recurso en apps legacy?",
          "options": [
              "Son frágiles ante resolución, escalado y cambios de UI",
              "Siempre son más seguras",
              "No requieren pruebas",
              "Eliminan necesidad de selector"
          ],
          "answer": [
              0
          ],
          "explanation": "Coordenadas e imágenes se rompen con facilidad; deben justificarse como fallback."
      },
      {
          "type": "multi",
          "prompt": "¿Qué factores afectan una automatización Windows?",
          "options": [
              "Foco",
              "Ventanas modales",
              "Resolución y escalado",
              "Permisos del usuario"
          ],
          "answer": [
              0,
              1,
              2,
              3
          ],
          "explanation": "La UI de escritorio depende de contexto visual, sesión y permisos."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 71): En el ERP Win32 sin API, ¿qué debe ocurrir antes de registrar cada solicitud del CSV?",
          "options": [
              "Validar el registro y descartar o marcar errores antes de tocar la UI",
              "Enviar cada fila sin revisar para ganar tiempo",
              "Capturar solo la primera pantalla",
              "Cerrar el ERP después de cada campo"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso exige validar cada registro. La UI legacy debe recibir solo datos aptos o excepciones controladas.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 71): ¿Qué controles evitan estados ambiguos en la aplicación legacy?",
          "options": [
              "Esperar confirmación explícita después de guardar",
              "Detectar ventanas modales o mensajes de error",
              "Guardar evidencia cuando un registro falla",
              "Asumir que cada tecla enviada fue aceptada"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La automatización de escritorio necesita confirmar estado real y capturar evidencia de excepciones.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 71): ¿Cuándo sería aceptable usar imagen o coordenadas?",
          "options": [
              "Solo como fallback justificado cuando no hay selector estable y con pruebas de resolución",
              "Como primera opción para todo el ERP",
              "Para evitar validar mensajes de error",
              "Para no documentar dependencias de pantalla"
          ],
          "answer": [
              0
          ],
          "explanation": "En Win32 legacy puede haber limitaciones, pero coordenadas e imágenes son frágiles y deben estar justificadas y probadas.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 71): ¿Qué evidencia debe conservarse por registro fallido?",
          "options": [
              "Identificador del registro o fila",
              "Mensaje o pantalla de error capturada",
              "Motivo de rechazo y estado final",
              "Credenciales usadas por el bot"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La evidencia debe permitir diagnóstico y reproceso seguro sin exponer secretos.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 71): ¿Qué contrato de salida ayuda a operar el bot?",
          "options": [
              "Procesados, rechazados, fallidos, evidencia y estado final por lote",
              "Solo un mensaje genérico de terminado",
              "Una captura del diseñador",
              "El número de clicks realizados"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso necesita trazabilidad por registro y lote para saber qué se puede reprocesar y qué requiere intervención.",
          "appliesTo": "caso"
      }
  ],
  72: [
      {
          "type": "single",
          "prompt": "Un selector incluye el número de versión del botón. ¿Qué riesgo introduce?",
          "options": [
              "Se romperá con actualizaciones menores",
              "Será más portable",
              "Evita regresión",
              "Protege credenciales"
          ],
          "answer": [
              0
          ],
          "explanation": "Atributos dinámicos como versión no son buenos identificadores estables."
      },
      {
          "type": "multi",
          "prompt": "¿Qué prácticas fortalecen selectores?",
          "options": [
              "Ventana padre",
              "Atributos estables",
              "Selector alternativo",
              "Wildcard sin límite"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La resiliencia viene de atributos estables y contexto; comodines excesivos pueden seleccionar mal."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 72): El botón cambió de `Enviar v3.14` a `Enviar v3.15`. ¿Cuál fue el defecto del selector?",
          "options": [
              "Dependía de texto dinámico que incluye la versión",
              "Usaba demasiados atributos estables",
              "Validaba demasiado bien la ventana padre",
              "Tenía pruebas de regresión excesivas"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso muestra un selector acoplado a texto variable. Una actualización menor rompe el bot sin que cambie la intención del botón.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 72): ¿Qué acciones corrigen el problema de forma profesional?",
          "options": [
              "Usar atributos más estables o texto parcial controlado",
              "Agregar contexto de ventana o contenedor padre",
              "Crear prueba de regresión para la pantalla actualizada",
              "Cambiar a coordenadas fijas como solución principal"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La corrección debe fortalecer selector y prueba. Coordenadas fijas serían una solución frágil.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 72): ¿Qué prueba habría detectado el riesgo antes de producción?",
          "options": [
              "Una regresión que abra la versión nueva y confirme que el selector encuentra el botón correcto",
              "Una prueba que solo cuente acciones del flujo",
              "Una ejecución manual sin logs",
              "Un cambio de nombre del bot"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso requiere probar contra la UI actualizada y verificar selección funcional, no solo existencia del flujo.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 72): ¿Qué atributos suelen ser mejores candidatos para estabilidad?",
          "options": [
              "AutomationId o identificador equivalente cuando existe",
              "Rol/tipo del control y contenedor padre",
              "Nombre funcional sin sufijos de versión",
              "Texto completo con número de versión exacto"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Los mejores selectores combinan identidad estable y contexto. El número de versión fue precisamente el punto frágil.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 72): ¿Qué cambio en el runbook reduce impacto futuro?",
          "options": [
              "Toda actualización de proveedor dispara revisión de selectores y smoke test",
              "Solo se revisa el bot cuando ya haya doble registro",
              "Se prohíben pruebas porque atrasan el despliegue",
              "Se elimina el log de errores de UI"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso enseña que cambios pequeños de versión afectan la UI. El runbook debe convertir eso en una validación operativa explícita.",
          "appliesTo": "caso"
      }
  ],
  73: [
      {
          "type": "single",
          "prompt": "¿Por qué reintentar todo un lote puede ser peligroso?",
          "options": [
              "Puede repetir efectos ya confirmados y crear duplicados",
              "Siempre reduce riesgos",
              "Elimina la necesidad de logs",
              "Hace innecesario validar resultados"
          ],
          "answer": [
              0
          ],
          "explanation": "Sin idempotencia, retry global puede duplicar registros o pagos."
      },
      {
          "type": "multi",
          "prompt": "¿Qué elementos apoyan idempotencia?",
          "options": [
              "Clave única",
              "Checkpoint",
              "Estado persistente",
              "Retry infinito"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Idempotencia requiere saber qué operación ya ocurrió y limitar reintentos."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 73): El bot registró un pago y falló al enviar confirmación; el operador reintentó y duplicó el pago. ¿Qué faltó?",
          "options": [
              "Checkpoint e idempotencia antes de repetir efectos de negocio",
              "Más velocidad en los clicks",
              "Un nombre más corto para el flujo",
              "Desactivar validaciones de pago"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso muestra un efecto confirmado seguido de fallo secundario. Sin checkpoint, el retry repite una operación que ya ocurrió.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 73): ¿Qué información permite reanudar sin duplicar?",
          "options": [
              "Clave idempotente del pago o solicitud",
              "Estado persistente por etapa",
              "Confirmación o comprobante de registro",
              "Retry infinito desde el primer paso"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Reanudar con seguridad exige saber qué operación ya fue confirmada y desde qué punto continuar.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 73): ¿Cuál retry es seguro después del fallo de confirmación?",
          "options": [
              "Reintentar solo el envío de confirmación si el pago ya está marcado como registrado",
              "Reejecutar todo el lote desde cero",
              "Registrar otro pago para compensar",
              "Borrar logs para evitar confusión"
          ],
          "answer": [
              0
          ],
          "explanation": "El checkpoint separa el efecto de pago de la notificación. El retry debe continuar desde la etapa fallida, no repetir el efecto confirmado.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 73): ¿Qué controles deberían existir antes de ejecutar un pago?",
          "options": [
              "Consultar si la clave idempotente ya fue procesada",
              "Validar estado previo de la solicitud",
              "Registrar transición de estado antes y después del efecto",
              "Permitir reintentos manuales sin revisar estado"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "El caso exige prevención de duplicados y trazabilidad de estado antes de operaciones con impacto financiero.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 73): ¿Qué alerta debería recibir soporte?",
          "options": [
              "Pago registrado, confirmación pendiente, retry seguro solo desde notificación",
              "Fallo genérico, ejecutar todo de nuevo",
              "Proceso exitoso aunque falte confirmación",
              "No registrar nada para evitar ruido"
          ],
          "answer": [
              0
          ],
          "explanation": "Una alerta útil distingue el estado real del negocio y la siguiente acción segura.",
          "appliesTo": "caso"
      }
  ],
  74: [
      {
          "type": "single",
          "prompt": "¿Qué debe devolver un desktop flow invocado por cloud flow?",
          "options": [
              "Estado, mensaje, métricas y referencia a evidencia",
              "Solo una captura sin contexto",
              "La contraseña usada",
              "Nada"
          ],
          "answer": [
              0
          ],
          "explanation": "Un contrato de outputs permite monitoreo y soporte desde cloud."
      },
      {
          "type": "single",
          "prompt": "¿Por qué persistir estado fuera de la VM?",
          "options": [
              "Para reanudar, monitorear y auditar aunque la máquina falle",
              "Para ocultar errores",
              "Para evitar UAT",
              "Para no usar logs"
          ],
          "answer": [
              0
          ],
          "explanation": "El estado externo permite operación y recuperación."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 74): En el batch nocturno, ¿qué rol debe cumplir el cloud flow?",
          "options": [
              "Orquestar, distribuir trabajo por máquina y persistir estado",
              "Hacer todos los clicks del portal legacy",
              "Guardar el estado solo en archivos locales de la VM",
              "Reemplazar Dataverse por capturas de pantalla"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso separa orquestación cloud de ejecución desktop. Cloud flow coordina y Dataverse deja trazabilidad visible.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 74): ¿Qué datos debe guardar Dataverse para soporte?",
          "options": [
              "Estado por solicitud o lote",
              "Máquina asignada y resultado de ejecución",
              "Error, evidencia y fecha de último intento",
              "Contraseña local de la VM"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "La operación necesita ver estado y evidencia sin abrir la VM; los secretos no deben almacenarse allí.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 74): ¿Por qué no conviene que el estado viva solo en la VM?",
          "options": [
              "Porque soporte perdería visibilidad y recuperación si la máquina falla",
              "Porque Dataverse no puede guardar estados",
              "Porque cloud flow no puede invocar desktop flows",
              "Porque los logs locales siempre son suficientes"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso busca observabilidad centralizada. Estado externo permite monitorear, reintentar y auditar aunque falle una máquina.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 74): ¿Qué contrato debe devolver PAD al cloud flow?",
          "options": [
              "Estado final y mensaje de error si aplica",
              "Conteos procesados, fallidos y omitidos",
              "Referencia a evidencia o log",
              "Solo un booleano sin contexto"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Un contrato rico permite que la capa cloud actualice Dataverse y habilite soporte sin inspección manual de escritorio.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 74): ¿Qué diseño facilita escalar a varias máquinas?",
          "options": [
              "Cola o asignación central de trabajo con estados transaccionales",
              "Copiar manualmente el mismo archivo a cada VM",
              "Dejar que cada VM elija registros sin coordinación",
              "Reintentar todos los lotes en todas las máquinas"
          ],
          "answer": [
              0
          ],
          "explanation": "El batch distribuido necesita coordinación central para evitar duplicados, huecos y diagnósticos opacos.",
          "appliesTo": "caso"
      }
  ],
  75: [
      {
          "type": "single",
          "prompt": "¿Qué evidencia muestra que un desktop flow está listo para operación?",
          "options": [
              "Deployment plan, rollback, runbook, pruebas y owner",
              "Solo una ejecución feliz en DEV",
              "Captura del diseñador",
              "Nombre bonito"
          ],
          "answer": [
              0
          ],
          "explanation": "Operación requiere ALM, soporte, rollback, pruebas y ownership."
      },
      {
          "type": "multi",
          "prompt": "¿Qué fallos son críticos en RPA?",
          "options": [
              "Credenciales en texto plano",
              "Reintentos infinitos",
              "Cambios directos en producción",
              "No cerrar aplicaciones o archivos"
          ],
          "answer": [
              0,
              1,
              2,
              3
          ],
          "explanation": "Todos comprometen seguridad, datos, operación o continuidad."
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 75): UAT falla porque TEST usa una ruta local de DEV y credencial del desarrollador. ¿Cuál es la causa raíz?",
          "options": [
              "Falta de configuración por ambiente y connection references gobernadas",
              "El usuario de UAT hizo demasiadas pruebas",
              "Power Automate Desktop no permite ALM",
              "El bot necesita más acciones duplicadas"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso es de ALM: variables, rutas, credenciales y conexiones deben resolverse por ambiente, no venir pegadas desde DEV.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 75): ¿Qué debe incluir el despliegue correcto hacia TEST?",
          "options": [
              "Variables o configuración por ambiente para rutas",
              "Connection references y credenciales no personales",
              "Validación postdeploy y plan de rollback",
              "Dependencia de carpetas locales del desarrollador"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Un despliegue operable separa configuración, conexiones y validación. La carpeta del desarrollador no debe viajar a TEST.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 75): ¿Qué prueba habría detectado el fallo el primer día de UAT?",
          "options": [
              "Smoke postdeploy que valida rutas, credenciales, máquina y ejecución mínima en TEST",
              "Una captura del flujo en DEV",
              "Un conteo de acciones del diseñador",
              "Una revisión visual del nombre del flujo"
          ],
          "answer": [
              0
          ],
          "explanation": "La validación postdeploy debe ejecutarse en el ambiente destino y confirmar dependencias reales antes de entregar UAT.",
          "appliesTo": "caso"
      },
      {
          "type": "multi",
          "prompt": "Diagnóstico de caso (RPA 75): ¿Qué artefactos operativos debe recibir el equipo?",
          "options": [
              "Deployment plan y rollback",
              "Runbook con owners y pasos de soporte",
              "Evidencia de pruebas en TEST",
              "Contraseña personal del desarrollador"
          ],
          "answer": [
              0,
              1,
              2
          ],
          "explanation": "Operación necesita plan, soporte y evidencia. Las credenciales personales son una práctica insegura.",
          "appliesTo": "caso"
      },
      {
          "type": "single",
          "prompt": "Diagnóstico de caso (RPA 75): ¿Qué decisión evita que DEV contamine otros ambientes?",
          "options": [
              "Parametrizar rutas, usuarios y endpoints mediante configuración de ambiente",
              "Copiar archivos locales junto con el bot",
              "Usar siempre la cuenta del creador",
              "Ejecutar UAT en la máquina de DEV"
          ],
          "answer": [
              0
          ],
          "explanation": "El caso exige separar solución de configuración. Cada ambiente debe resolver sus propias rutas, credenciales y dependencias.",
          "appliesTo": "caso"
      }
  ]
};

  function buildQuestions(moduleId) {
    return MODULE_QUESTIONS[moduleId] || [];
  }

  function buildModuleData() {
    return moduleTitles.map(function (title, index) {
      const moduleId = index + 1;
      return {
        id: moduleId,
        title: title,
        cert: certForModule(moduleId),
        level: levelForModule(moduleId),
        questions: buildQuestions(moduleId)
      };
    });
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function createOption(question, optionText, optionIndex, selectedSet) {
    const checked = selectedSet.has(optionIndex) ? "checked" : "";
    const inputType = question.type === "multi" ? "checkbox" : "radio";
    const optionLabel = String.fromCharCode(65 + optionIndex);
    return `
      <label class="quiz-option">
        <span class="quiz-option-letter">${optionLabel}</span>
        <input type="${inputType}" name="q" value="${optionIndex}" ${checked} />
        <span class="quiz-option-text">${escapeHtml(optionText)}</span>
      </label>
    `;
  }

  function initSimulator() {
    const root = document.getElementById("quiz-app");
    if (!root) return;

    const modules = buildModuleData();
    let moduleIndex = 0;
    let currentQuestionIndex = 0;
    let answers = [];
    let flagged = [];
    let submitted = false;

    function resetAttempt() {
      const total = modules[moduleIndex].questions.length;
      answers = Array.from({ length: total }, function () {
        return new Set();
      });
      flagged = Array.from({ length: total }, function () {
        return false;
      });
      currentQuestionIndex = 0;
      submitted = false;
    }

    function questionTypeLabel(type) {
      if (type === "multi") return "Selección múltiple";
      return "Selección única";
    }

    function grade() {
      const questions = modules[moduleIndex].questions;
      let score = 0;
      questions.forEach(function (q, i) {
        const selected = Array.from(answers[i]).sort();
        const correct = q.answer.slice().sort();
        const ok =
          selected.length === correct.length &&
          selected.every(function (v, idx) {
            return v === correct[idx];
          });
        if (ok) score += 1;
      });
      return { score: score, total: questions.length };
    }

    function render() {
      const selectedModule = modules[moduleIndex];
      const questions = selectedModule.questions;
      const q = questions[currentQuestionIndex];
      const selected = answers[currentQuestionIndex];

      const progress = `${currentQuestionIndex + 1} / ${questions.length}`;
      const progressPct = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
      const answeredCount = answers.filter(function (set) { return set.size > 0; }).length;
      const canSubmit = answers.every(function (set) {
        return set.size > 0;
      });

      let resultHtml = "";
      if (submitted) {
        const result = grade();
        const pct = Math.round((result.score / result.total) * 100);
        const status = pct >= 70 ? "Aprobado" : "Reforzar módulo";
        resultHtml = `
          <div class="quiz-result ${pct >= 70 ? "quiz-result-pass" : "quiz-result-fail"}">
            <strong>Resultado final:</strong> ${result.score}/${result.total} (${pct}%) — <strong>${status}</strong>
          </div>
        `;
      }

      root.innerHTML = `
        <div class="quiz-shell">
          <div class="quiz-header-card">
            <div class="quiz-toolbar">
              <label for="moduleSelect"><strong>Módulo:</strong></label>
              <select id="moduleSelect">
                ${modules
                  .map(function (m, i) {
                    const sel = i === moduleIndex ? "selected" : "";
                    return `<option value="${i}" ${sel}>Módulo ${m.id}: ${escapeHtml(m.title)} (${m.cert})</option>`;
                  })
                  .join("")}
              </select>
              <span class="quiz-progress">Pregunta ${progress}</span>
            </div>
            <div class="quiz-kpis">
              <span class="quiz-chip">Nivel ${escapeHtml(selectedModule.level)}</span>
              <span class="quiz-chip">Objetivo ${escapeHtml(selectedModule.cert)}</span>
              <span class="quiz-chip">Respondidas ${answeredCount}/${questions.length}</span>
            </div>
            <div class="quiz-progress-track" aria-hidden="true">
              <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
            </div>
          </div>

          <div class="quiz-layout">
            <aside class="quiz-sidebar">
              <div class="quiz-sidebar-title">Navegación</div>
              <div class="quiz-question-grid">
                ${questions.map(function (_, i) {
                  const isCurrent = i === currentQuestionIndex ? "is-current" : "";
                  const isAnswered = answers[i].size > 0 ? "is-answered" : "";
                  const isFlagged = flagged[i] ? "is-flagged" : "";
                  return `<button class="quiz-question-index ${isCurrent} ${isAnswered} ${isFlagged}" data-go="${i}">${i + 1}</button>`;
                }).join("")}
              </div>
              <div class="quiz-legend">
                <span><i class="dot current"></i> Actual</span>
                <span><i class="dot answered"></i> Respondida</span>
                <span><i class="dot flagged"></i> Marcada</span>
              </div>
            </aside>

            <div class="quiz-card">
              <div class="quiz-meta">
                <span class="quiz-badge">${questionTypeLabel(q.type)}</span>
                <span class="quiz-meta-number">Pregunta ${progress}</span>
              </div>
              <h3>${escapeHtml(q.prompt)}</h3>
              <div class="quiz-options">
                ${q.options.map(function (opt, i) { return createOption(q, opt, i, selected); }).join("")}
              </div>

              <div class="quiz-actions">
                <button id="prevBtn" ${currentQuestionIndex === 0 ? "disabled" : ""}>Anterior</button>
                <button id="nextBtn" ${currentQuestionIndex === questions.length - 1 ? "disabled" : ""}>Siguiente</button>
                <button id="flagBtn" class="${flagged[currentQuestionIndex] ? "is-flag-active" : ""}">${flagged[currentQuestionIndex] ? "Desmarcar revisión" : "Marcar para revisión"}</button>
                <button id="submitBtn" class="quiz-btn-primary" ${canSubmit ? "" : "disabled"}>Finalizar evaluación</button>
                <button id="retryBtn">Reintentar</button>
              </div>

              <details class="quiz-feedback" ${submitted ? "open" : ""}>
                <summary>Ver explicación de esta pregunta</summary>
                <p>${escapeHtml(q.explanation)}</p>
              </details>
            </div>
          </div>
          ${resultHtml}
        </div>
      `;

      const moduleSelect = document.getElementById("moduleSelect");
      moduleSelect.addEventListener("change", function (ev) {
        moduleIndex = Number(ev.target.value);
        resetAttempt();
        render();
      });

      root.querySelectorAll('input[name="q"]').forEach(function (input) {
        input.addEventListener("change", function () {
          const value = Number(input.value);
          if (q.type === "single") {
            answers[currentQuestionIndex] = new Set([value]);
          } else {
            if (input.checked) {
              answers[currentQuestionIndex].add(value);
            } else {
              answers[currentQuestionIndex].delete(value);
            }
          }
          submitted = false;
          render();
        });
      });

      root.querySelectorAll("[data-go]").forEach(function (button) {
        button.addEventListener("click", function () {
          currentQuestionIndex = Number(button.getAttribute("data-go"));
          render();
        });
      });

      document.getElementById("prevBtn").addEventListener("click", function () {
        currentQuestionIndex -= 1;
        render();
      });

      document.getElementById("nextBtn").addEventListener("click", function () {
        currentQuestionIndex += 1;
        render();
      });

      document.getElementById("flagBtn").addEventListener("click", function () {
        flagged[currentQuestionIndex] = !flagged[currentQuestionIndex];
        render();
      });

      document.getElementById("submitBtn").addEventListener("click", function () {
        submitted = true;
        render();
      });

      document.getElementById("retryBtn").addEventListener("click", function () {
        resetAttempt();
        render();
      });
    }

    resetAttempt();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSimulator);
  } else {
    initSimulator();
  }
})();

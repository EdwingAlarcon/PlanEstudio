(function () {
  function certForModule(moduleId) {
    if (moduleId <= 8) return "PL-900";
    if (moduleId <= 17) return "PL-200";
    if (moduleId <= 30) return "PL-400";
    return "PL-600";
  }

  function levelForModule(moduleId) {
    if (moduleId <= 8) return "Básico";
    if (moduleId <= 17) return "Intermedio";
    if (moduleId <= 30) return "Avanzado";
    return "Arquitecto";
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
    "Preparación PL-600",
    "Proyecto Capstone — Arquitectura Enterprise"
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
    }
  ],
18: [
  {
    type: "single",
    prompt: "Una empresa quiere reemplazar hojas de cálculo de ventas por una aplicación interna con formularios sobre tablas relacionadas, seguridad por roles y procesos guiados. ¿Qué experiencia de Power Platform debes priorizar?",
    options: ["Canvas App", "Model-Driven App", "Power Pages", "Power BI"],
    answer: [1],
    explanation: "Model-Driven App es la mejor opción cuando el proceso depende de Dataverse, relaciones, vistas, formularios y seguridad nativa. Canvas da más libertad visual pero exige más diseño manual, Power Pages es para usuarios externos y Power BI no es una plataforma transaccional."
  },
  {
    type: "single",
    prompt: "Un equipo necesita almacenar solicitudes con reglas de negocio, auditoría, ownership, seguridad a nivel fila y futura automatización con plugins. ¿Qué repositorio de datos es el más adecuado?",
    options: ["SharePoint Lists", "Dataverse", "Azure Blob Storage", "Excel en OneDrive"],
    answer: [1],
    explanation: "Dataverse aporta seguridad, relaciones, auditoría y extensibilidad nativa para procesos de negocio. SharePoint sirve mejor para documentos y listas ligeras; Blob Storage y Excel no cubren bien reglas transaccionales ni gobierno empresarial."
  },
  {
    type: "multi",
    prompt: "Estás aplicando el patrón Strangler Fig para modernizar un sistema legacy de cotizaciones. ¿Qué DOS acciones siguen correctamente ese patrón?",
    options: ["Encaminar nuevas capacidades por una capa de integración y retirar partes del legacy de forma incremental", "Reescribir todo el sistema en un solo corte de producción", "Registrar cada decisión relevante en un ADR para justificar límites, riesgos y rollback", "Mantener duplicada indefinidamente la lógica en ambos sistemas para evitar decisiones"],
    answer: [0, 2],
    explanation: "Strangler Fig moderniza por incrementos controlados y reduce riesgo en comparación con un big bang. Los ADR ayudan a documentar por qué se corta, integra o retira cada pieza; duplicar lógica de forma permanente aumenta deuda técnica."
  },
  {
    type: "single",
    prompt: "Un pedido creado en Dataverse debe notificar de forma asíncrona a facturación, logística y analítica sin bloquear al usuario. ¿Qué patrón de integración es el más apropiado?",
    options: ["Llamadas HTTP síncronas punto a punto a cada sistema", "Exportación manual diaria a CSV", "Azure Service Bus con tópico y suscripciones", "Actualizar todos los sistemas desde JavaScript del formulario"],
    answer: [2],
    explanation: "Un tópico de Service Bus permite fan-out asíncrono y desacopla a los consumidores del productor. Las llamadas síncronas y el JavaScript del formulario agregan latencia y fragilidad, mientras que el CSV diario no cubre near real-time."
  },
  {
    type: "single",
    prompt: "Tu programa enterprise separa capacidades comunes, CRM y gestión de proyectos en soluciones distintas. ¿Cuál es el beneficio principal de una arquitectura multi-solution como Foundation/CRM/Proyectos?",
    options: ["Eliminar por completo las dependencias entre componentes", "Permitir versionado y despliegue independientes con límites funcionales claros", "Obligar a que todos los cambios pasen siempre por la misma solución", "Evitar el uso de Environment Variables y Connection References"],
    answer: [1],
    explanation: "Separar por dominios reduce acoplamiento y facilita gobernar releases por capacidad. No elimina todas las dependencias, pero sí las hace explícitas; además sigue siendo recomendable usar referencias y variables para ALM."
  }
],
19: [
  {
    type: "single",
    prompt: "Un equipo pequeño despliega varias veces al día y quiere minimizar ramas largas y conflictos de merge. ¿Qué estrategia de ramas es la más adecuada?",
    options: ["Gitflow con ramas de larga duración para cada release", "Trunk-based development con ramas cortas y merges frecuentes", "Una rama por ambiente que nunca se fusiona", "Desarrollar directamente en main sin validaciones automáticas"],
    answer: [1],
    explanation: "Trunk-based development reduce divergencia y favorece integración continua, especialmente con despliegues frecuentes. Gitflow aporta más sobrecarga para equipos que necesitan ciclos rápidos, y desarrollar sin validaciones eleva el riesgo."
  },
  {
    type: "single",
    prompt: "¿Qué comando debe usar el pipeline de importación para promover una solución a producción siguiendo buenas prácticas de ALM?",
    options: ["pac solution import --managed", "pac solution export --managed", "pac pcf push --managed", "pac auth create --managed"],
    answer: [0],
    explanation: "En producción debe importarse la solución administrada para proteger componentes y asegurar una promoción controlada. Export se usa para generar el artefacto y los otros comandos no realizan la importación de soluciones."
  },
  {
    type: "multi",
    prompt: "Vas a parametrizar el despliegue entre DEV, TEST y PROD con deployment-settings.json. ¿Qué DOS elementos deben resolverse ahí para evitar hardcodeo por ambiente?",
    options: ["Connection References", "Environment Variables", "Los GUID internos del pipeline de Azure DevOps", "Los nombres de las ramas Git del repositorio"],
    answer: [0, 1],
    explanation: "Connection References y Environment Variables permiten que el mismo paquete se promueva sin editar componentes manualmente. Los GUID del pipeline y nombres de ramas pertenecen al proceso de entrega, no a la configuración funcional del ambiente."
  },
  {
    type: "single",
    prompt: "El equipo quiere usar Solution Checker como quality gate en Azure DevOps. ¿Qué diseño es el más alineado a CI/CD enterprise?",
    options: ["Ejecutarlo solo si el despliegue a producción falla", "Configurar un umbral de severidad para fallar el pipeline antes de importar", "Correrlo manualmente una vez por trimestre", "Ignorar hallazgos de alta severidad si la demo funciona"],
    answer: [1],
    explanation: "Solution Checker debe actuar como puerta preventiva y no como diagnóstico tardío. Ejecutarlo antes de importar reduce deuda técnica y evita promocionar soluciones con problemas conocidos."
  },
  {
    type: "single",
    prompt: "Se detecta un error crítico en producción y debes liberar una corrección sin esperar la siguiente ventana mensual. ¿Qué enfoque es el más apropiado?",
    options: ["Borrar el histórico de artifacts para liberar espacio y volver a exportar desde PROD", "Aplicar el fix directo en producción sin pasar por control de versiones", "Usar un hotfix pipeline desde una rama controlada y conservar artifacts del release asociado", "Esperar al próximo release mayor para no romper la cadencia"],
    answer: [2],
    explanation: "Un hotfix pipeline mantiene trazabilidad, rollback y consistencia entre código fuente y ambiente. Corregir directo en producción o perder artifacts debilita auditoría y complica reproducir el release."
  }
],
20: [
  {
    type: "single",
    prompt: "Un vendedor confirma que un lead ya tiene presupuesto, autoridad y fecha de compra. ¿Qué acción en Dynamics 365 Sales refleja mejor el proceso estándar?",
    options: ["Convertirlo en caso de Customer Service", "Calificar el lead para crear cuenta/contacto/oportunidad según corresponda", "Cerrar el lead como perdido para evitar duplicados", "Crear directamente la factura sin oportunidad"],
    answer: [1],
    explanation: "Lead Qualification convierte el interés en registros comerciales utilizables dentro del proceso de ventas. Crear una factura o un caso omite etapas clave como oportunidad, cotización y pedido."
  },
  {
    type: "single",
    prompt: "La dirección comercial quiere comparar pipeline esperado por trimestre contra objetivos de cada gerente. ¿Qué capacidades debes usar principalmente?",
    options: ["Forecast y Goal Management", "Knowledge Base y SLA", "Unified Routing y Queues", "Customer Voice y OmniChannel"],
    answer: [0],
    explanation: "Forecast permite proyectar ventas y Goal Management ayuda a medir cumplimiento contra metas. Las demás opciones pertenecen al ámbito de servicio al cliente y no al seguimiento comercial."
  },
  {
    type: "multi",
    prompt: "Un centro de soporte quiere asignar casos por habilidades del agente y controlar vencimientos de atención. ¿Qué DOS componentes son más relevantes?",
    options: ["Unified Routing", "SLA", "Price Lists", "Product Catalog"],
    answer: [0, 1],
    explanation: "Unified Routing distribuye trabajo según reglas y capacidades, mientras SLA mide y automatiza compromisos de servicio. Price Lists y Product Catalog son piezas de ventas, no de operación de casos."
  },
  {
    type: "single",
    prompt: "Tu organización recibe preguntas repetitivas sobre devoluciones y garantías. ¿Qué enfoque reduce tiempos de resolución y mejora consistencia?",
    options: ["Pedir a cada agente que responda desde memoria para ganar velocidad", "Crear artículos en Knowledge Base reutilizables desde Customer Service", "Mover todos los casos a Sales Hub", "Desactivar el enrutamiento para que todos vean todos los casos"],
    answer: [1],
    explanation: "Knowledge Base centraliza respuestas aprobadas y acelera la atención con contenido reutilizable. Las demás opciones aumentan inconsistencia, errores y esfuerzo operativo."
  },
  {
    type: "single",
    prompt: "Una empresa vende el mismo producto con precios distintos por segmento y región. ¿Qué configuración soporta mejor ese escenario en Dynamics 365 Sales?",
    options: ["Una sola lista de precios global sin variaciones", "Product Catalog combinado con Price Lists por segmento o región", "Casos y colas por territorio", "SLA por línea de producto"],
    answer: [1],
    explanation: "Product Catalog define productos y Price Lists permite aplicar variaciones comerciales según contexto. Casos, colas y SLA pertenecen al dominio de servicio y no resuelven la estrategia de pricing."
  }
],
21: [
  {
    type: "single",
    prompt: "Una compañía quiere exponer un portal B2C para clientes externos con registro, inicio de sesión y escalabilidad de identidad. ¿Qué proveedor de autenticación debes priorizar?",
    options: ["Autenticación local con usuarios administrados manualmente", "Azure AD B2C", "Solo Anonymous Access", "Windows Integrated Authentication"],
    answer: [1],
    explanation: "Azure AD B2C está diseñado para identidades externas y flujos de autoservicio a escala. La autenticación local sirve para escenarios simples, pero ofrece menos flexibilidad y gobierno que B2C."
  },
  {
    type: "single",
    prompt: "Un usuario del portal debe ver únicamente las solicitudes asociadas a su propio contacto en Dataverse. ¿Qué alcance de Table Permission es el más adecuado?",
    options: ["Global", "Contact", "Parent", "Anonymous"],
    answer: [1],
    explanation: "El alcance Contact restringe el acceso a registros vinculados al contacto autenticado. Global expondría datos de todos, Parent responde a jerarquías relacionadas y Anonymous ni siquiera aplica a usuarios no autenticados."
  },
  {
    type: "multi",
    prompt: "Estás diseñando una página de Power Pages con contenido inicial indexable y luego acciones interactivas del usuario. ¿Qué DOS enfoques conviene combinar?",
    options: ["Renderizar estructura y contenido base con Liquid del lado servidor", "Usar Fetch o AJAX para operaciones dinámicas posteriores", "Consultar Dataverse directamente desde el navegador sin permisos", "Mover toda la experiencia a un archivo estático sin backend"],
    answer: [0, 1],
    explanation: "Liquid es ideal para el render inicial seguro y coherente con el portal, mientras AJAX o Portals Web API cubren interacciones posteriores. Consultar sin permisos o eliminar el backend rompe seguridad y funcionalidad."
  },
  {
    type: "single",
    prompt: "Quieres permitir acceso a una sección solo a socios autenticados, mientras el resto del sitio sigue siendo público. ¿Qué combinación es la más correcta?",
    options: ["Asignar solo el web role Anonymous a todas las páginas", "Crear un Web Role custom para socios y asociarlo a la página protegida", "Ocultar el enlace en el menú sin cambiar permisos", "Confiar únicamente en JavaScript para bloquear la URL"],
    answer: [1],
    explanation: "Los Web Roles controlan autorización real dentro del portal y deben respaldar la navegación protegida. Ocultar enlaces o usar solo JavaScript no evita acceso directo a la página o a los datos."
  },
  {
    type: "single",
    prompt: "El portal muestra lentitud en páginas públicas muy visitadas. ¿Qué práctica mejora rendimiento sin comprometer arquitectura?",
    options: ["Desactivar caché para que todo se renderice desde cero en cada request", "Usar caché adecuadamente y minimizar llamadas dinámicas innecesarias", "Mover toda la lógica de seguridad al cliente", "Cargar todos los Web Files en la primera pantalla aunque no se usen"],
    answer: [1],
    explanation: "Power Pages se beneficia de caché y de reducir round-trips al backend, especialmente en contenido repetitivo. Desactivar caché o cargar recursos innecesarios empeora la experiencia y no resuelve la causa."
  }
],
22: [
  {
    type: "single",
    prompt: "Un bot interno debe responder preguntas usando políticas almacenadas en SharePoint, artículos en Dataverse y un sitio corporativo. ¿Qué capacidad de Copilot Studio cubre mejor ese escenario?",
    options: ["Generative Answers con múltiples orígenes", "Solo Topics con respuestas escritas manualmente", "Power BI Q&A", "Customer Voice"],
    answer: [0],
    explanation: "Generative Answers permite consultar varias fuentes autorizadas y sintetizar respuestas. Es más escalable que mantener únicamente respuestas manuales y las otras herramientas no son el motor conversacional adecuado."
  },
  {
    type: "single",
    prompt: "La organización quiere que empleados accedan al bot desde Teams sin volver a autenticarse y que las acciones consulten datos internos según su identidad. ¿Qué diseño debes preferir?",
    options: ["SSO con Azure AD para el bot y sus acciones", "Usuarios compartidos embebidos en el bot", "Publicar el bot como anónimo para simplificar", "Desactivar autorización en Dataverse"],
    answer: [0],
    explanation: "SSO con Azure AD evita doble autenticación y permite aplicar autorización por identidad real del usuario. Usar cuentas compartidas o acceso anónimo compromete auditoría, seguridad y personalización."
  },
  {
    type: "multi",
    prompt: "Quieres una arquitectura multi-bot donde un bot principal delega tareas especializadas. ¿Qué DOS elementos son característicos de ese enfoque?",
    options: ["Un bot maestro que enruta la intención al bot de habilidad adecuado", "Bots especializados por dominio como RR.HH. o TI", "Un único topic gigante con toda la lógica de todos los dominios", "Eliminar analítica por bot para centralizar todo"],
    answer: [0, 1],
    explanation: "La separación Master + Skill bots mejora mantenibilidad y permite especialización por dominio. Un topic monolítico o eliminar métricas por bot dificulta operación, ownership y mejora continua."
  },
  {
    type: "single",
    prompt: "Necesitas pedir al usuario una aprobación rápida en Teams con botones y contexto visual de una solicitud. ¿Qué experiencia es la más apropiada?",
    options: ["Adaptive Cards enviadas desde el bot", "Solo un mensaje de texto con un vínculo externo", "Un archivo CSV adjunto", "Un dashboard de Power BI sin interacción"],
    answer: [0],
    explanation: "Adaptive Cards permiten capturar acciones estructuradas dentro de Teams con mejor usabilidad. Un vínculo o un archivo desvían al usuario y no entregan la misma experiencia conversacional integrada."
  },
  {
    type: "single",
    prompt: "El sponsor pregunta cómo detectar si los usuarios abandonan el bot antes de completar una tarea clave. ¿Qué métrica es la más directa?",
    options: ["Abandonment rate", "Número de makers en el tenant", "Cantidad de ambientes sandbox", "Capacidad de almacenamiento de Dataverse"],
    answer: [0],
    explanation: "Abandonment rate mide conversaciones que no llegan a una resolución útil y ayuda a priorizar mejoras. Las demás opciones no describen comportamiento conversacional ni efectividad del bot."
  }
],
23: [
  {
    type: "single",
    prompt: "Debes impedir que se guarde una orden si falta un dato obligatorio calculado externamente, evitando incluso que inicie la transacción principal. ¿En qué etapa registrarías el plugin?",
    options: ["Pre-Validation", "Pre-Operation", "Post-Operation", "Asynchronous Post-Operation"],
    answer: [0],
    explanation: "Pre-Validation se ejecuta antes de la transacción principal y es adecuada para rechazar operaciones tempranamente. Pre-Operation ya participa en la transacción y Post-Operation ocurre demasiado tarde para esa validación inicial."
  },
  {
    type: "single",
    prompt: "Un plugin necesita comparar el valor previo y el nuevo de un campo para decidir si recalcula un descuento. ¿Qué debes configurar?",
    options: ["Solo el Target sin imágenes", "PreEntityImage además del Target", "Un archivo Web Resource", "Una Canvas App embebida"],
    answer: [1],
    explanation: "El Target trae los cambios entrantes, pero la imagen previa permite comparar el estado anterior del registro. Sin PreEntityImage el plugin no tiene contexto confiable para detectar la transición de valores."
  },
  {
    type: "multi",
    prompt: "Quieres evitar recursión y diagnosticar mejor un plugin que actualiza el mismo registro. ¿Qué DOS prácticas son correctas?",
    options: ["Verificar IPluginExecutionContext.Depth y salir cuando supere el umbral esperado", "Usar ITracingService para dejar trazas útiles en ejecución", "Capturar todas las excepciones y devolver éxito silencioso", "Forzar siempre una llamada adicional al mismo mensaje para confirmar el cambio"],
    answer: [0, 1],
    explanation: "Controlar Depth reduce bucles involuntarios y el tracing facilita soporte en sandbox. Silenciar errores o forzar llamadas repetidas agrava el problema y oculta la causa real."
  },
  {
    type: "single",
    prompt: "En un plugin server-side necesitas una consulta legible, soportada por SDK y fácil de construir dinámicamente. ¿Qué opción suele ser la más apropiada?",
    options: ["Manipular directamente tablas SQL de Dataverse", "QueryExpression", "Liquid templates", "Power Fx"],
    answer: [1],
    explanation: "QueryExpression es nativo del SDK y funciona bien para consultas programáticas en plugins. Acceder a SQL no está soportado online y Liquid o Power Fx pertenecen a otras capas de la plataforma."
  },
  {
    type: "single",
    prompt: "Quieres probar unitariamente un plugin sin depender de un ambiente real de Dataverse. ¿Qué herramienta encaja mejor?",
    options: ["FakeXrmEasy", "Power BI Desktop", "Plugin Registration Tool", "Azure Front Door"],
    answer: [0],
    explanation: "FakeXrmEasy permite simular contexto, entidades y operaciones del SDK para pruebas unitarias de plugins. Plugin Registration Tool sirve para registrar ensamblados, pero no sustituye un framework de testing."
  }
],
24: [
  {
    type: "single",
    prompt: "Una actualización en Dataverse debe disparar notificaciones a varios sistemas consumidores independientes. ¿Qué recurso de Azure Service Bus es más conveniente?",
    options: ["Queue", "Topic", "Blob Container", "Key Vault"],
    answer: [1],
    explanation: "Topic permite patrón publish-subscribe con varias suscripciones consumidoras. Queue se orienta más a un único consumidor lógico y no cubre tan bien el fan-out empresarial."
  },
  {
    type: "single",
    prompt: "Tu Azure Function necesita leer secretos y llamar a un backend sin almacenar credenciales en código ni en archivos de configuración. ¿Qué combinación es la mejor?",
    options: ["Connection string fija en appsettings.json", "Managed Identity + Azure Key Vault", "Usuario compartido guardado en JavaScript", "Secretos en una lista de SharePoint"],
    answer: [1],
    explanation: "Managed Identity elimina credenciales embebidas y Key Vault centraliza secretos con rotación y control de acceso. Guardarlos en archivos o listas aumenta superficie de exposición y esfuerzo operativo."
  },
  {
    type: "multi",
    prompt: "Debes elegir entre Azure Logic Apps y Power Automate para dos escenarios distintos. ¿Qué DOS afirmaciones son correctas?",
    options: ["Logic Apps suele ser preferible para integraciones enterprise y B2B en Azure", "Power Automate suele encajar mejor en automatización de productividad y casos de negocio liderados por makers", "Logic Apps debe reemplazar siempre cualquier flujo de negocio en Power Platform", "Power Automate es la opción ideal para exponer políticas centralizadas de API"],
    answer: [0, 1],
    explanation: "Logic Apps brilla en integraciones Azure-first con escalado y conectividad enterprise, mientras Power Automate se adapta bien a automatizaciones de negocio. Ninguna reemplaza universalmente a la otra y la gestión centralizada de APIs corresponde a APIM."
  },
  {
    type: "single",
    prompt: "Varias apps y flujos consumen APIs externas con límites y políticas inconsistentes. ¿Qué servicio usarías para centralizar seguridad, throttling y versionado?",
    options: ["Azure API Management", "Azure DevOps Boards", "Power BI Service", "Customer Voice"],
    answer: [0],
    explanation: "Azure API Management publica, protege y gobierna APIs mediante políticas como throttling y transformación. Las demás herramientas no están diseñadas para gobernar el consumo de servicios HTTP a escala."
  },
  {
    type: "single",
    prompt: "Un evento de creación de archivo en Azure Storage debe iniciar automáticamente un proceso en Power Automate sin polling. ¿Qué servicio habilita mejor ese patrón?",
    options: ["Event Grid", "Windows Task Scheduler", "Excel Online", "Power Pages cache"],
    answer: [0],
    explanation: "Event Grid distribuye eventos de Azure de forma push y near real-time hacia suscriptores. El polling agrega latencia y costo, y las demás opciones no son un bus de eventos para recursos Azure."
  }
],
25: [
  {
    type: "single",
    prompt: "Tu equipo quiere desacoplar la lógica de acceso a Dataverse dentro de plugins para facilitar pruebas y mantenimiento. ¿Qué patrón conviene aplicar?",
    options: ["Repository pattern", "Singleton UI pattern", "Decorator para CSS", "MVC para Power BI"],
    answer: [0],
    explanation: "Repository abstrae IOrganizationService y centraliza consultas y persistencia, lo que mejora testabilidad. Las otras opciones no resuelven el problema de acceso a datos en plugins de Dataverse."
  },
  {
    type: "single",
    prompt: "Un proceso de aprobación debe poder ejecutarse y también revertirse si falla una etapa posterior. ¿Qué patrón modela mejor esa necesidad?",
    options: ["Command pattern", "Singleton pattern", "Factory pattern únicamente", "Pub/Sub sin compensación"],
    answer: [0],
    explanation: "Command encapsula la operación y facilita implementar acciones inversas o compensatorias. Publicar eventos sin una estrategia de reversión no garantiza consistencia cuando hay pasos posteriores fallidos."
  },
  {
    type: "multi",
    prompt: "Una orden se confirma en Dataverse, se reserva inventario en ERP y se genera envío en un tercero. Si el último paso falla, ¿qué DOS principios ayudan a mantener consistencia?",
    options: ["Saga pattern con acciones de compensación", "Idempotencia para que los reintentos no dupliquen operaciones", "Bloquear toda la plataforma hasta completar cada sistema", "Editar manualmente la base de datos SQL de Dataverse"],
    answer: [0, 1],
    explanation: "Saga maneja transacciones distribuidas sin exigir un commit global y define cómo deshacer pasos previos. La idempotencia evita duplicados durante reintentos; bloquear toda la plataforma o tocar SQL no es viable ni soportado."
  },
  {
    type: "single",
    prompt: "Un flujo llama a una API externa inestable y no quieres saturarla cuando empieza a fallar. ¿Qué patrón deberías aplicar?",
    options: ["Circuit Breaker", "Star schema", "Waterfall", "Bubble sort"],
    answer: [0],
    explanation: "Circuit Breaker corta temporalmente llamadas repetidas a un servicio degradado y permite recuperación controlada. Eso protege experiencia, cuotas y estabilidad; las otras opciones no gestionan fallos transitorios."
  },
  {
    type: "single",
    prompt: "Quieres separar operaciones de escritura complejas de consultas optimizadas para reporting en una integración con Dataverse. ¿Qué enfoque arquitectónico es el más alineado?",
    options: ["CQRS", "Solo CRUD genérico en una misma capa", "Poner toda la lógica en JavaScript del formulario", "Guardar reportes en columnas de texto libre"],
    answer: [0],
    explanation: "CQRS separa commands y queries para optimizar cada una según su carga y modelo de consumo. Un CRUD genérico único tiende a mezclar necesidades transaccionales y analíticas con menor claridad y escalabilidad."
  }
],
26: [
  {
    type: "single",
    prompt: "En una Canvas App conectada a Dataverse, el usuario quiere filtrar 200 mil registros por una expresión que usa una función no delegable. ¿Cuál es el riesgo principal?",
    options: ["La app traerá solo un subconjunto y el resultado puede ser incompleto", "Dataverse creará automáticamente un índice para resolverlo", "La consulta se convertirá en FetchXML optimizado sin intervención", "Power Apps moverá la operación al navegador sin límite"],
    answer: [0],
    explanation: "Cuando una operación no delega, Power Apps evalúa localmente sobre un conjunto limitado y puede omitir registros válidos. No existe conversión mágica ni creación automática de índices que elimine ese problema."
  },
  {
    type: "single",
    prompt: "Necesitas optimizar una consulta FetchXML usada por un dashboard operativo. ¿Qué cambio suele aportar más mejora inmediata?",
    options: ["Seleccionar solo las columnas necesarias y evitar joins innecesarios", "Solicitar todas las columnas por si después se necesitan", "Duplicar la misma link-entity varias veces para asegurar consistencia", "Convertir toda consulta a texto plano almacenado en una nota"],
    answer: [0],
    explanation: "Reducir columnas y joins baja costo de red, procesamiento y serialización. Pedir más datos de los necesarios o duplicar joins aumenta latencia y complejidad sin valor real."
  },
  {
    type: "multi",
    prompt: "El equipo sospecha que la lentitud proviene de plugins y de fórmulas en la app. ¿Qué DOS herramientas ayudan a aislar esos problemas?",
    options: ["Plugin Profiler en Plugin Registration Tool", "Monitor en Power Apps", "Customer Voice dashboard", "Content Snippets"],
    answer: [0, 1],
    explanation: "Plugin Profiler ayuda a capturar y reproducir ejecución server-side, mientras Monitor muestra red, fórmulas y eventos del cliente. Customer Voice y Content Snippets no son herramientas de diagnóstico de rendimiento."
  },
  {
    type: "single",
    prompt: "Un arquitecto debe prever consumo de plataforma para una solución transaccional de alto uso. ¿Qué dato es crítico incorporar al capacity planning?",
    options: ["El límite de API calls por licencia y el patrón real de consumo", "Solo el color del tema de la app", "La cantidad de presentaciones de PowerPoint del proyecto", "El número de reuniones semanales del equipo"],
    answer: [0],
    explanation: "Los límites de llamadas API y el uso esperado impactan licencias, escalabilidad y riesgo operativo. Los demás elementos no determinan capacidad ni costo de la plataforma."
  },
  {
    type: "single",
    prompt: "Estás construyendo un PCF que renderiza un gran volumen de elementos. ¿Qué enfoque mejora el rendimiento visual?",
    options: ["Cargar y renderizar todos los elementos al iniciar siempre", "Aplicar lazy loading o virtualización cuando sea posible", "Deshabilitar cualquier paginación del dataset", "Mover toda la lógica a un iframe externo"],
    answer: [1],
    explanation: "La virtualización y el lazy loading reducen trabajo inicial de DOM y mejoran respuesta percibida. Renderizar todo de golpe o eliminar paginación incrementa consumo y tiempos de pintura."
  }
],
27: [
  {
    type: "single",
    prompt: "Necesitas crear un control que muestre y manipule múltiples registros con ordenamiento y filtrado en una cuadrícula personalizada. ¿Qué tipo de PCF debes elegir?",
    options: ["Field control", "Dataset control", "Web resource HTML clásica", "Business rule"],
    answer: [1],
    explanation: "Dataset control está diseñado para trabajar con colecciones de registros y exponer capacidades de filtrado y sorting. Field control se orienta a un valor individual, no a listas completas."
  },
  {
    type: "single",
    prompt: "Tu equipo adopta TypeScript strict mode en un PCF con React. ¿Qué beneficio principal obtiene?",
    options: ["Menos validación en tiempo de compilación", "Detección temprana de tipos nulos y contratos incorrectos", "Eliminación automática de la necesidad de pruebas", "Compatibilidad nativa con cualquier API sin typings"],
    answer: [1],
    explanation: "Strict mode endurece la verificación de tipos y reduce errores sutiles antes de ejecutar el control. No reemplaza pruebas ni vuelve innecesarios los contratos tipados de APIs externas."
  },
  {
    type: "multi",
    prompt: "Quieres un PCF React robusto y accesible para uso enterprise. ¿Qué DOS prácticas son correctas?",
    options: ["Usar componentes de Fluent UI con soporte de accesibilidad", "Agregar atributos ARIA donde el patrón de interacción lo requiera", "Confiar solo en el color para transmitir estado", "Ignorar navegación por teclado porque el control es visual"],
    answer: [0, 1],
    explanation: "Fluent UI y ARIA ayudan a cumplir expectativas de accesibilidad y experiencia consistente. Depender solo del color o ignorar teclado excluye usuarios y rompe estándares enterprise."
  },
  {
    type: "single",
    prompt: "El usuario cambia un valor en tu PCF y esperas que el formulario host reciba el nuevo estado. ¿Qué llamada es indispensable?",
    options: ["notifyOutputChanged()", "getDataSet()", "destroy()", "updateView()"],
    answer: [0],
    explanation: "notifyOutputChanged informa al host que debe leer los outputs actualizados del control. Las otras funciones tienen otros fines y por sí mismas no propagan cambios al formulario."
  },
  {
    type: "single",
    prompt: "Durante desarrollo quieres probar rápidamente un PCF en un ambiente y luego incluirlo formalmente en una solución. ¿Qué secuencia es la más correcta?",
    options: ["pac pcf push para iterar y luego pac solution add-component para empaquetarlo", "Editar directamente la base de datos de Dataverse y publicar", "Copiar los archivos TypeScript al navegador del usuario", "Usar solo Chrome DevTools sin desplegar el control"],
    answer: [0],
    explanation: "pac pcf push acelera la iteración en desarrollo y solution add-component incorpora el control al ciclo ALM. Tocar la base de datos o copiar archivos al cliente no son prácticas soportadas."
  }
],
28: [
  {
    type: "single",
    prompt: "Vas a construir una experiencia SPA embebida en Power Pages con React y TypeScript. ¿Qué combinación describe mejor la base técnica del proyecto?",
    options: ["index.html, main.tsx y empaquetado tipo Vite", "Solo Liquid templates sin frontend", "Power BI paginado como host", "Una solución de plugins C# sin recursos web"],
    answer: [0],
    explanation: "Los Code Sites de Power Pages siguen un enfoque moderno SPA con punto de entrada HTML y bootstrap en main.tsx. Liquid y plugins pueden complementar, pero no sustituyen esa estructura de frontend."
  },
  {
    type: "single",
    prompt: "La app necesita autenticar al usuario frente a Microsoft Entra ID y obtener tokens para llamadas protegidas desde el frontend. ¿Qué librería encaja mejor?",
    options: ["MSAL.js", "jQuery UI", "FakeXrmEasy", "Fluent Assertions"],
    answer: [0],
    explanation: "MSAL.js está pensada para autenticación y adquisición de tokens en aplicaciones web modernas. Las otras librerías no gestionan identidad ni flujos OAuth para el navegador."
  },
  {
    type: "multi",
    prompt: "Tu SPA consumirá Power Pages Web API para leer y actualizar datos. ¿Qué DOS condiciones debes cumplir para que el diseño sea correcto y seguro?",
    options: ["Configurar Table Permissions acordes al usuario y la tabla", "Permitir desde el sitio los headers o configuraciones necesarias para el escenario de frontend", "Exponer todas las tablas de Dataverse por conveniencia", "Confiar solo en ocultar botones cuando el usuario no deba editar"],
    answer: [0, 1],
    explanation: "La seguridad real depende de Table Permissions y de la configuración HTTP adecuada del sitio para el frontend. Exponer de más o esconder botones sin permisos server-side deja brechas de autorización."
  },
  {
    type: "single",
    prompt: "Publicaste una nueva versión del Code Site y ahora necesitas subirla al ambiente destino. ¿Qué comando se alinea con el despliegue de Power Pages Code Apps?",
    options: ["pac pages upload", "pac solution export --managed", "pac pcf init", "pac data export"],
    answer: [0],
    explanation: "pac pages upload es el comando orientado a publicar el sitio de Power Pages. Exportar soluciones o inicializar PCF son tareas distintas del despliegue del frontend embebido."
  },
  {
    type: "single",
    prompt: "En local todo funciona, pero publicado el navegador bloquea una llamada por políticas de origen. ¿Qué área debes revisar primero?",
    options: ["CORS y headers configurados para Power Pages", "El color del tema Material", "La licencia de Power BI Pro", "Los Quick Finds de Dataverse"],
    answer: [0],
    explanation: "Los problemas entre dominios normalmente se resuelven revisando CORS, headers y políticas del sitio publicado. El resto de opciones no explica un bloqueo de navegador por origen."
  }
],
29: [
  {
    type: "single",
    prompt: "Una aseguradora quiere que solo clientes invitados puedan registrarse en su portal B2C. ¿Qué mecanismo es el más adecuado en Power Pages?",
    options: ["Anonymous Access global", "Invitation codes", "Desactivar autenticación y filtrar después", "Solo cookies del navegador"],
    answer: [1],
    explanation: "Invitation codes permiten controlar quién puede completar el registro y asociar correctamente la identidad. El acceso anónimo o sin control previo rompe el requisito de admisión restringida."
  },
  {
    type: "single",
    prompt: "Debes mapear en Power Pages datos de Azure AD B2C como email, nombre visible y atributos útiles para autorización. ¿Qué configuración es clave?",
    options: ["Claims mapping", "Quick Find View", "Business Process Flow", "Rollup field"],
    answer: [0],
    explanation: "Claims mapping transforma atributos emitidos por el proveedor en información utilizable dentro del portal. Las otras opciones pertenecen a búsqueda, procesos o modelado de datos, no a identidad federada."
  },
  {
    type: "multi",
    prompt: "El portal público sufrirá alto tráfico y debe endurecerse en el borde. ¿Qué DOS beneficios aporta Azure Front Door en este escenario?",
    options: ["Web Application Firewall", "CDN y aceleración global", "Reemplazo automático de Table Permissions", "Ejecución de plugins C# en el navegador"],
    answer: [0, 1],
    explanation: "Front Door aporta WAF y distribución global con capacidades de aceleración y edge caching. No sustituye seguridad de datos del portal ni ejecuta lógica server-side del modelo Dataverse."
  },
  {
    type: "single",
    prompt: "Quieres que un proveedor vea únicamente órdenes asociadas a su empresa en el portal. ¿Qué diseño implementa mejor row-level security?",
    options: ["Una página con lista global y filtro JavaScript en cliente", "Table Permissions apoyadas en un Contact Lookup o relación equivalente", "Exportar todo a Excel y compartir por correo", "Agregar la palabra 'privado' al título del registro"],
    answer: [1],
    explanation: "La seguridad por fila debe apoyarse en relaciones de Dataverse y Table Permissions, no en filtros del navegador. Exportar datos o etiquetarlos visualmente no restringe realmente el acceso."
  },
  {
    type: "single",
    prompt: "Un requisito de identidad exige journeys complejos no cubiertos por user flows estándar, como validaciones avanzadas y orquestación personalizada. ¿Qué opción de Azure AD B2C debes evaluar?",
    options: ["Custom policies con Identity Experience Framework", "Solo Local Authentication del portal", "Price Lists por usuario", "Knowledge Articles"],
    answer: [0],
    explanation: "Las custom policies permiten modelar journeys avanzados cuando los user flows no alcanzan. Las demás opciones no pertenecen al dominio de federación e identidad para Power Pages."
  }
],
30: [
  {
    type: "single",
    prompt: "En el proyecto multicapa del nivel 3 debes justificar por qué ciertas capacidades van en plugin, otras en Power Pages y otras en Azure Functions. ¿Qué artefacto documenta mejor esas decisiones?",
    options: ["ADR", "Una captura de pantalla del backlog", "El tema visual del portal", "Un correo informal sin versionado"],
    answer: [0],
    explanation: "Un Architecture Decision Record captura contexto, opciones evaluadas, decisión y consecuencias. Eso permite trazabilidad técnica y ejecutiva mucho mejor que evidencia dispersa o no versionada."
  },
  {
    type: "single",
    prompt: "El patrocinador pide una definición clara de calidad antes del go-live. ¿Cuál de estas combinaciones representa mejor un quality gate del proyecto?",
    options: ["Ignorar warnings de Solution Checker si la demo convence", "Validar Plugin Depth, Solution Checker, accesibilidad/UX del PCF y rendimiento del portal", "Aprobar solo por número de pantallas entregadas", "Dejar pruebas para después del despliegue a producción"],
    answer: [1],
    explanation: "Un proyecto multicapa debe medir calidad técnica en cada componente relevante, no solo apariencia funcional. Ignorar chequeos o posponer validación aumenta riesgo operativo y deuda técnica."
  },
  {
    type: "multi",
    prompt: "Quieres cerrar el proyecto con una evidencia end-to-end sólida. ¿Qué DOS resultados demuestran mejor la integración del nivel 3?",
    options: ["Despliegue automatizado por CI/CD entre ambientes", "Trazabilidad de decisiones arquitectónicas y evidencias de validación", "Cambios manuales no documentados en producción", "Una demo local sin correspondencia con el ambiente publicado"],
    answer: [0, 1],
    explanation: "El valor del proyecto está en integrar arquitectura, calidad y despliegue reproducible, no solo en mostrar una demo aislada. Los cambios manuales rompen ALM y dificultan soporte futuro."
  },
  {
    type: "single",
    prompt: "Durante pruebas aparece un plugin que se dispara repetidamente al actualizar el mismo registro desde Post-Operation. ¿Qué corrección es la más inmediata?",
    options: ["Agregar control de Depth y revisar si la actualización puede moverse o minimizarse", "Aumentar el timeout del navegador del usuario", "Eliminar todas las Table Permissions del portal", "Desactivar los Solution Checkers del pipeline"],
    answer: [0],
    explanation: "El problema apunta a recursión o diseño del plugin, por lo que Depth y la ubicación de la lógica son claves. Timeout, permisos del portal o checker del pipeline no atacan la causa."
  },
  {
    type: "single",
    prompt: "¿Qué práctica de despliegue cierra mejor el objetivo del proyecto multicapa?",
    options: ["Importar componentes diferentes manualmente en cada ambiente", "Ejecutar una cadena CI/CD que promueva solución, portal y configuraciones parametrizadas", "Hacer solo un backup antes de publicar y confiar en eso", "Pedir a cada maker que recree localmente los componentes"],
    answer: [1],
    explanation: "El objetivo es demostrar una solución enterprise reproducible y gobernada de punta a punta. La recreación manual o los cambios aislados no garantizan consistencia entre ambientes."
  }
],
31: [
  {
    type: "single",
    prompt: "El CIO pregunta quién puede crear ambientes, qué conectores están permitidos y cómo se retiran apps obsoletas. ¿Qué necesitas definir formalmente?",
    options: ["Un Governance Framework de Power Platform", "Solo un tema visual corporativo", "Una lista personal de tareas del arquitecto", "Únicamente el naming de campos en Dataverse"],
    answer: [0],
    explanation: "El Governance Framework establece roles, guardrails y ciclo de vida de la plataforma a escala. El resto son piezas aisladas que no cubren control organizacional integral."
  },
  {
    type: "single",
    prompt: "En TOGAF ADM estás redactando la visión, objetivos de negocio y stakeholders clave de la iniciativa Power Platform. ¿En qué fase estás trabajando principalmente?",
    options: ["Architecture Vision", "Technology Architecture", "Migration Planning", "Requirements Management únicamente"],
    answer: [0],
    explanation: "Architecture Vision define el alcance estratégico y la razón de la transformación. Technology Architecture ocurre después y detalla componentes técnicos concretos para soportarla."
  },
  {
    type: "multi",
    prompt: "Estás construyendo gobierno enterprise sostenible para Power Platform. ¿Qué DOS artefactos aportan más claridad estratégica al inicio?",
    options: ["Capability Map", "Risk Register", "Una lista de emojis para cada ambiente", "Capturas sueltas de makers destacados"],
    answer: [0, 1],
    explanation: "Capability Map ayuda a vincular plataforma con capacidades de negocio y Risk Register hace explícitos los riesgos a gestionar. Los otros elementos no sirven como instrumentos de gobierno formal."
  },
  {
    type: "single",
    prompt: "Tu organización quiere estandarizar la creación de ambientes, soluciones base y configuración repetible mediante scripts. ¿Qué enfoque describe mejor esa meta?",
    options: ["Landing Zone como código apoyada en pac CLI y automatización", "Crear ambientes manualmente según memoria del administrador", "Pedir a cada maker que cree su propia gobernanza", "Evitar cualquier automatización para reducir complejidad"],
    answer: [0],
    explanation: "Una Landing Zone como código hace repetible, auditable y gobernable la base de la plataforma. El aprovisionamiento manual escala mal y genera deriva entre ambientes."
  },
  {
    type: "single",
    prompt: "La dirección financiera quiere entender el costo real de la plataforma por licencias, almacenamiento y llamadas API. ¿Qué disciplina debes introducir?",
    options: ["FinOps para Power Platform", "Solo change management", "Kanban visual sin métricas", "A/B testing de colores"],
    answer: [0],
    explanation: "FinOps aporta visibilidad y decisiones de optimización sobre consumo y costo. Las otras prácticas pueden ser útiles en otros contextos, pero no responden a la gobernanza financiera de la plataforma."
  }
],
32: [
  {
    type: "single",
    prompt: "Una empresa quiere visibilidad de adopción, incumplimientos y backlog de ideas ciudadanas en Power Platform. ¿Qué iniciativa cubre mejor ese objetivo?",
    options: ["CoE Starter Kit", "Solo Power BI Desktop local", "Azure Front Door", "Plugin Registration Tool"],
    answer: [0],
    explanation: "CoE Starter Kit incorpora dashboards, governance, compliance e innovation backlog para administrar la plataforma a escala. Las demás opciones son herramientas puntuales que no proveen ese marco operativo."
  },
  {
    type: "single",
    prompt: "Quieres aplicar límites de compartición y recomendaciones automáticas sobre el estado de los recursos. ¿Qué capacidad nativa de administración debes evaluar?",
    options: ["Managed Environments", "Quick Find Views", "Business Process Flows", "Portals Web API"],
    answer: [0],
    explanation: "Managed Environments ofrece Advisor, límites de compartición y capacidades orientadas a gobierno operacional. Las otras opciones no administran ambientes ni políticas a escala."
  },
  {
    type: "multi",
    prompt: "Debes administrar tenant settings y políticas entre muchos ambientes desde automatización. ¿Qué DOS herramientas encajan mejor?",
    options: ["Power Platform Admin APIs", "Cmdlets de PowerShell para Power Platform", "Solo editar formularios manualmente", "Customer Voice templates"],
    answer: [0, 1],
    explanation: "Admin APIs y cmdlets permiten automatizar gobierno, inventario y configuración multi-ambiente. Editar manualmente formularios o usar templates de encuestas no resuelve administración de tenant."
  },
  {
    type: "single",
    prompt: "El equipo quiere acelerar pipelines y buenas prácticas de ALM reutilizando un marco preparado para Power Platform. ¿Qué componente del ecosistema CoE es más relevante?",
    options: ["CoE ALM Accelerator", "Power BI Goals", "Azure Bastion", "Dataverse Search"],
    answer: [0],
    explanation: "ALM Accelerator ayuda a estructurar promoción de soluciones y flujos de trabajo DevOps sobre Power Platform. Las demás opciones no están diseñadas específicamente para ese propósito."
  },
  {
    type: "single",
    prompt: "La organización desea crear ambientes de forma repetible desde infraestructura declarativa. ¿Qué enfoque es el más alineado?",
    options: ["Terraform o Bicep apoyados en APIs de Power Platform", "Crear ambientes solo desde el portal manualmente", "Clonar la carpeta site del proyecto", "Usar Excel para llevar control de ambientes"],
    answer: [0],
    explanation: "La infraestructura declarativa reduce deriva y soporta escalado de administración. El aprovisionamiento manual o el control en hojas de cálculo no ofrece la misma confiabilidad ni auditabilidad."
  }
],
33: [
  {
    type: "single",
    prompt: "Quieres una estrategia de ambientes donde desarrollo individual no contamine el ambiente compartido de integración. ¿Qué combinación es la más sana?",
    options: ["Usar solo el Default environment para todo", "Developer environments para trabajo individual y Sandbox para integración", "Trial environments como base permanente de producción", "Production para pruebas de makers"],
    answer: [1],
    explanation: "Developer environments aíslan experimentación individual, mientras Sandbox soporta integración controlada. El Default no debe absorber todo y Trial o Production no son el espacio correcto para ese ciclo."
  },
  {
    type: "single",
    prompt: "Una empresa europea procesa datos personales sensibles y debe respetar residencia de datos y GDPR. ¿Qué criterio debe pesar más al ubicar ambientes?",
    options: ["La región con el logo más atractivo", "La geografía de datos y requisitos regulatorios aplicables", "La preferencia del consultor externo", "El huso horario del equipo de marketing solamente"],
    answer: [1],
    explanation: "La residencia de datos y cumplimiento regulatorio condicionan dónde deben vivir los ambientes y sus backups. La estética o preferencias individuales no pueden prevalecer sobre obligaciones legales."
  },
  {
    type: "multi",
    prompt: "Una solución debe operar entre dos tenants corporativos. ¿Qué DOS enfoques pueden ser válidos según el caso?",
    options: ["Guest users cuando el acceso debe conservar identidad individual", "Service accounts controladas para integraciones no interactivas", "Compartir credenciales personales por correo", "Desactivar auditoría para simplificar el acceso"],
    answer: [0, 1],
    explanation: "Guest users permiten colaboración con identidad trazable y service accounts sirven para procesos automatizados bien gobernados. Compartir credenciales o desactivar auditoría introduce riesgos de seguridad y cumplimiento."
  },
  {
    type: "single",
    prompt: "Un organismo público exige controles regulatorios especiales que superan la oferta comercial estándar. ¿Qué tipo de nube deberías evaluar?",
    options: ["Sovereign clouds como GCC, GCC High o DoD según el requisito", "Solo el ambiente Default comercial", "Cualquier trial environment", "SharePoint Online sin Power Platform"],
    answer: [0],
    explanation: "Las sovereign clouds existen precisamente para cubrir exigencias regulatorias y operativas particulares del sector público. Un tenant comercial estándar puede no cumplir esos requerimientos."
  },
  {
    type: "single",
    prompt: "¿Qué práctica completa mejor una estrategia multi-geo de ambientes?",
    options: ["No definir restore porque ya existe alta disponibilidad", "Diseñar backup y restore por región con responsabilidades claras", "Depender solo de exportaciones manuales ocasionales", "Mover producción entre geografías cada semana"],
    answer: [1],
    explanation: "En escenarios multi-geo también debes planear continuidad y recuperación por región. Confiar solo en procesos manuales o en HA sin plan de restore deja huecos de resiliencia."
  }
],
34: [
  {
    type: "single",
    prompt: "Una solución debe ingerir millones de eventos de telemetría por minuto desde dispositivos IoT y analizarlos después. ¿Qué servicio del stack Azure Integration Services encaja mejor?",
    options: ["Event Hub", "Key Vault", "Power Pages", "Azure Boards"],
    answer: [0],
    explanation: "Event Hub está diseñado para ingestión de alta velocidad y gran volumen de eventos. Key Vault guarda secretos y Power Pages o Boards no son plataformas de streaming de telemetría."
  },
  {
    type: "single",
    prompt: "Dos ERPs emiten mensajes con estructuras distintas y quieres transformarlos a un formato empresarial común antes de integrarlos con Power Platform. ¿Qué patrón aplica mejor?",
    options: ["Canonical Data Model apoyado por Message Translator", "Hardcodear un formato diferente en cada flujo", "Guardar cada mensaje como imagen", "Mover la transformación al navegador del usuario"],
    answer: [0],
    explanation: "Un modelo canónico reduce acoplamiento entre productores y consumidores, y Message Translator adapta cada formato fuente. Hardcodear variantes por flujo multiplica mantenimiento y fragilidad."
  },
  {
    type: "multi",
    prompt: "Estás definiendo la arquitectura enterprise de integración alrededor de Power Platform. ¿Qué DOS afirmaciones son correctas?",
    options: ["Azure API Management ayuda a centralizar consumo y gobierno de APIs externas", "Azure Data Factory suele ser más apropiado que Power Automate para ETL pesado y orquestación de datos analíticos", "Power Automate debe sustituir cualquier microservicio existente", "Event Grid es la mejor opción para almacenar secretos"],
    answer: [0, 1],
    explanation: "APIM y Data Factory cumplen roles específicos en gobierno de APIs y movimiento de datos a escala. Power Automate no reemplaza todo el ecosistema y Event Grid no es un almacén de secretos."
  },
  {
    type: "single",
    prompt: "Quieres usar Power Platform como frontend de negocio y delegar servicios especializados a componentes escalables en Azure. ¿Qué combinación es coherente con ese objetivo?",
    options: ["Microservicios en Azure Container Apps expuestos por APIs bien gobernadas", "Toda lógica distribuida en macros de Excel locales", "Un único plugin gigante para todos los dominios externos", "Deshabilitar cualquier capa intermedia"],
    answer: [0],
    explanation: "Container Apps permite empaquetar microservicios modernos, mientras Power Platform sigue enfocada en experiencia y procesos de negocio. Centralizar todo en un plugin monolítico o en macros locales va contra el desacoplamiento buscado."
  },
  {
    type: "single",
    prompt: "Un mensaje entrante debe distribuirse a distintos destinatarios según contenido y luego combinar respuestas parciales en una sola respuesta de negocio. ¿Qué combinación de patrones describe mejor el caso?",
    options: ["Message Router y Aggregator", "Singleton y Factory", "Observer y Decorator visual", "Waterfall y Scrum"],
    answer: [0],
    explanation: "Message Router decide el destino correcto y Aggregator recompone una vista unificada desde varias respuestas. Los otros patrones o marcos no modelan ese flujo de integración enterprise."
  }
],
35: [
  {
    type: "single",
    prompt: "Necesitas llevar datos de Dataverse a un entorno analítico continuo sin construir ETL batch manual. ¿Qué capacidad debes priorizar?",
    options: ["Synapse Link for Dataverse", "Exportar CSV diarios desde una vista", "Copiar registros manualmente a Excel", "Plugins síncronos que escriban cada cambio en PDF"],
    answer: [0],
    explanation: "Synapse Link replica datos de Dataverse hacia escenarios analíticos de forma continua y gobernada. Los métodos manuales o documentos no escalan ni soportan analítica moderna."
  },
  {
    type: "single",
    prompt: "Un equipo de BI quiere consultar grandes volúmenes en Fabric con experiencia casi en tiempo real y sin refrescos import tradicionales. ¿Qué modo de Power BI debe evaluar primero?",
    options: ["DirectLake", "Import siempre", "Solo DirectQuery a sistemas transaccionales", "Embedded workbook mode"],
    answer: [0],
    explanation: "DirectLake aprovecha OneLake para rendimiento analítico con menor fricción que el modelo Import tradicional. DirectQuery puede depender más del origen y no siempre ofrece el mismo equilibrio para Fabric."
  },
  {
    type: "multi",
    prompt: "Estás definiendo una arquitectura Medallion en Fabric. ¿Qué DOS afirmaciones son correctas?",
    options: ["Bronze conserva datos crudos con mínima transformación", "Gold expone modelos refinados para consumo de negocio", "Silver debe contener solo imágenes y archivos binarios sin limpiar", "Gold es el mejor lugar para guardar eventos corruptos sin revisar"],
    answer: [0, 1],
    explanation: "Bronze captura la materia prima y Gold entrega datos curados y listos para consumo. Silver sirve para estandarizar y enriquecer; usar Gold para datos sucios contradice el patrón."
  },
  {
    type: "single",
    prompt: "Tu arquitecto de datos pregunta cuándo elegir Lakehouse frente a Warehouse en Fabric. ¿Cuál respuesta es la más adecuada?",
    options: ["Lakehouse para datos variados y ciencia de datos; Warehouse para modelado relacional analítico y SQL governado", "Warehouse solo para guardar imágenes", "Lakehouse únicamente para formularios de Power Apps", "Ambos son idénticos y la elección no importa"],
    answer: [0],
    explanation: "Lakehouse ofrece flexibilidad para datos semiestructurados y pipelines amplios, mientras Warehouse se orienta a consumo SQL estructurado. No son equivalentes ni se eligen al azar."
  },
  {
    type: "single",
    prompt: "Un responsable de arquitectura insiste en usar Dataverse tanto para transacciones como para toda la analítica histórica empresarial. ¿Cuál es la recomendación más sólida?",
    options: ["Mantener datos transaccionales en Dataverse y derivar analítica a Fabric/Synapse según el caso", "Mover toda la analítica a formularios de Model-Driven App", "Guardar los KPIs como columnas de texto en Dataverse", "Eliminar cualquier separación entre cargas OLTP y analíticas"],
    answer: [0],
    explanation: "Separar cargas transaccionales y analíticas mejora rendimiento, costo y gobernanza. Sobrecargar Dataverse con toda la historia analítica degrada el sistema operacional y no aprovecha Fabric."
  }
],
36: [
  {
    type: "single",
    prompt: "Quieres exigir MFA y bloquear acceso a makers desde dispositivos no conformes. ¿Qué control debes usar primero?",
    options: ["Conditional Access Policies en Microsoft Entra ID", "Quick Find indexing", "Business Rules en Dataverse", "Tema oscuro obligatorio"],
    answer: [0],
    explanation: "Conditional Access aplica requisitos contextuales como MFA, ubicación y conformidad del dispositivo. Los otros elementos no controlan acceso corporativo a la plataforma."
  },
  {
    type: "single",
    prompt: "La organización quiere que la clave de cifrado del entorno de Dataverse esté bajo su propio control para cumplir regulación estricta. ¿Qué capacidad debes evaluar?",
    options: ["Customer Managed Keys", "Knowledge Base", "Power Fx variables", "Canvas responsive layout"],
    answer: [0],
    explanation: "Customer Managed Keys permite a la organización controlar el ciclo de la clave criptográfica usada por la plataforma. Las otras opciones no inciden en gobierno criptográfico."
  },
  {
    type: "multi",
    prompt: "Debes fortalecer cumplimiento GDPR sobre datos en Power Platform. ¿Qué DOS prácticas son esenciales?",
    options: ["Definir procesos para right to erasure cuando aplique", "Gestionar auditoría y retención de datos conforme a política", "Compartir exportaciones personales por correo para revisión", "Desactivar cualquier logging para reducir trabajo legal"],
    answer: [0, 1],
    explanation: "GDPR exige atender derechos del titular y controlar retención y auditoría de forma trazable. Compartir datos por correo o eliminar logging sin criterio aumenta riesgo y pérdida de evidencia."
  },
  {
    type: "single",
    prompt: "El SOC quiere correlacionar actividad de Power Platform con otros eventos corporativos en su SIEM. ¿Qué integración aporta más valor?",
    options: ["Microsoft Sentinel", "Content Snippets", "Price Lists", "Power BI bookmarks"],
    answer: [0],
    explanation: "Microsoft Sentinel centraliza análisis, alertas y correlación de seguridad a nivel enterprise. Las otras opciones no son plataformas SIEM ni de monitoreo de amenazas."
  },
  {
    type: "single",
    prompt: "Los administradores globales de Power Platform no deben mantener privilegios permanentes sin justificación. ¿Qué práctica complementa mejor Zero Trust?",
    options: ["Privileged Identity Management para acceso just-in-time", "Una cuenta compartida para todos los administradores", "Guardar roles admin en una hoja Excel", "Desactivar revisiones de acceso"],
    answer: [0],
    explanation: "PIM reduce privilegio permanente y habilita elevación controlada y auditada. Las cuentas compartidas o controles manuales débiles van en contra de Zero Trust y de buenas prácticas de seguridad."
  }
],
37: [
  {
    type: "single",
    prompt: "Debes extraer campos de facturas escaneadas y convertirlos en datos estructurados para un flujo de aprobación. ¿Qué modelo de AI Builder es el más adecuado?",
    options: ["Document processing", "Object detection", "Prediction", "Relevance search"],
    answer: [0],
    explanation: "Document processing está diseñado para leer formularios y documentos y devolver campos estructurados. Object detection analiza imágenes, Prediction estima resultados y Relevance search es una capacidad distinta de búsqueda."
  },
  {
    type: "single",
    prompt: "Un equipo quiere enriquecer un flujo con generación y resumen de texto usando modelos GPT de Azure OpenAI desde Power Platform. ¿Qué enfoque es el más realista?",
    options: ["Consumir Azure OpenAI mediante conector o integración gobernada", "Entrenar un plugin C# para reemplazar al modelo", "Usar Price Lists para generar texto", "Configurar un SLA en Customer Service"],
    answer: [0],
    explanation: "Azure OpenAI se integra típicamente a través de conectores o servicios intermedios gobernados. Price Lists y SLA no generan lenguaje natural, y un plugin no sustituye al modelo fundacional."
  },
  {
    type: "multi",
    prompt: "La junta de ética revisa un caso de IA en Power Platform. ¿Qué DOS principios de Responsible AI deben reflejarse en la solución?",
    options: ["Transparencia sobre el uso y límites del modelo", "Supervisión humana y monitoreo del impacto", "Ocultar al usuario que una respuesta fue generada por IA", "Desactivar cualquier revisión porque la IA ya optimiza sola"],
    answer: [0, 1],
    explanation: "Responsible AI exige claridad, supervisión y capacidad de corregir comportamientos no deseados. Ocultar el uso de IA o eliminar revisión humana debilita confianza y control del riesgo."
  },
  {
    type: "single",
    prompt: "Después de publicar un modelo de AI Builder, ¿qué práctica evita que la solución se deteriore silenciosamente con el tiempo?",
    options: ["Monitorear desempeño y revisar el ciclo de vida del modelo", "Asumir que el modelo nunca cambia una vez publicado", "Mover todas las decisiones críticas a un color de interfaz", "Eliminar el dataset de entrenamiento inmediatamente"],
    answer: [0],
    explanation: "Los modelos necesitan seguimiento para detectar drift, baja precisión o cambios en datos de negocio. Publicar sin monitorizar deja a la organización ciega ante degradaciones de calidad."
  },
  {
    type: "single",
    prompt: "Tu caso requiere un modelo predictivo muy especializado entrenado fuera de AI Builder, pero quieres invocarlo desde procesos de negocio. ¿Qué integración es la más adecuada?",
    options: ["Azure Machine Learning invocado desde Power Automate u otra capa de integración", "Solo una regla de negocio en Dataverse", "Un Content Snippet en Power Pages", "Un forecast de Dynamics 365 Sales"],
    answer: [0],
    explanation: "Azure Machine Learning permite hospedar modelos más complejos y luego exponerlos a flujos y apps. Las demás opciones no ejecutan inferencia avanzada ni reemplazan un servicio de ML especializado."
  }
],
38: [
  {
    type: "single",
    prompt: "En un programa enterprise, el cliente pregunta cuál es la diferencia principal entre Solution Architect y Project Manager. ¿Cuál respuesta es la más precisa?",
    options: ["El arquitecto define la solución técnica y sus trade-offs; el PM gestiona alcance, tiempo y coordinación del proyecto", "Ambos roles son idénticos y pueden usarse indistintamente", "El PM decide siempre el modelo de datos y el arquitecto solo agenda reuniones", "El arquitecto no interactúa con negocio"],
    answer: [0],
    explanation: "El Solution Architect lidera decisiones de diseño y el PM gobierna ejecución del proyecto y sus restricciones. Son roles complementarios, no intercambiables ni aislados del negocio."
  },
  {
    type: "single",
    prompt: "Debes explicar al C-suite por qué elegiste Power Pages + Dataverse + Azure Integration Services en vez de un portal custom desde cero. ¿Qué artefacto ayuda más a estructurar esa conversación?",
    options: ["ADR con contexto, alternativas, decisión y consecuencias", "Solo una captura del backlog técnico", "Un listado de commits sin explicación", "Un tema de colores corporativos"],
    answer: [0],
    explanation: "El ADR resume la decisión y sus trade-offs en un formato entendible y trazable para stakeholders ejecutivos. Las otras evidencias no conectan claramente la decisión con impacto y riesgo."
  },
  {
    type: "multi",
    prompt: "Estás organizando la gobernanza de responsabilidades de un proyecto Power Platform. ¿Qué DOS prácticas son correctas?",
    options: ["Definir un RACI para decisiones y entregables clave", "Adaptar el mensaje técnico según el stakeholder sea negocio o TI", "Asumir que todos entienden las mismas siglas y riesgos", "Evitar registrar cambios de alcance para ganar velocidad"],
    answer: [0, 1],
    explanation: "RACI aclara ownership y la comunicación efectiva exige ajustar el nivel de detalle al público. Dar por hecho entendimiento común o ignorar cambios de alcance genera conflicto y retrabajo."
  },
  {
    type: "single",
    prompt: "El cliente quiere una estimación inicial de una implementación Power Platform cuando aún no hay historias detalladas. ¿Qué técnica suele ser útil en esta fase temprana?",
    options: ["T-shirt sizing o story points de alto nivel", "Solo contar líneas de código futuras", "Medir duración por intuición de una sola persona", "Esperar a producción para estimar"],
    answer: [0],
    explanation: "En etapas tempranas convienen técnicas de estimación relativa y rangos, no falsas precisiones. Contar líneas de código o estimar sin contraste suele sesgar el plan."
  },
  {
    type: "single",
    prompt: "Tras el go-live de una solución crítica, ¿qué enfoque describe mejor la fase de hyper-care?",
    options: ["Desaparecer del proyecto para promover autonomía", "Monitoreo intensivo, soporte cercano y transición planificada a operaciones", "Congelar toda mejora y cerrar canales de comunicación", "Delegar incidentes al usuario final"],
    answer: [1],
    explanation: "Hyper-care estabiliza la solución en producción y prepara un handoff responsable a operaciones. Abandonar temprano o cerrar feedback aumenta el riesgo de incidentes y baja adopción."
  }
],
39: [
  {
    type: "single",
    prompt: "Al analizar un caso de transformación digital con Power Platform, ¿qué secuencia metodológica ayuda más a obtener lecciones reutilizables?",
    options: ["Problema → solución → arquitectura → ROI → lecciones aprendidas", "Tecnología favorita → demo → presupuesto → problema", "Interfaz visual → colores → problema → soporte", "Comprar licencias → buscar un caso de uso después"],
    answer: [0],
    explanation: "Empezar por el problema y terminar en resultados y lecciones mantiene la discusión orientada a valor. Invertir la secuencia hacia la tecnología conduce a decisiones menos justificadas."
  },
  {
    type: "single",
    prompt: "Detectas un programa donde cada departamento creó apps aisladas, sin modelo de datos común ni gobierno, y luego nadie sabe cuál es la fuente maestra. ¿Qué estás observando?",
    options: ["Un anti-patrón de implementación", "Una referencia ideal de arquitectura", "Un ejemplo de FinOps maduro", "Una práctica recomendada de ALM"],
    answer: [0],
    explanation: "La proliferación sin gobierno ni modelo común es un anti-patrón clásico que genera silos y deuda operativa. Una arquitectura sana define ownership, integración y estándares desde el inicio."
  },
  {
    type: "multi",
    prompt: "En un programa de transformación, ¿qué DOS factores influyen directamente en el éxito sostenido además de la tecnología?",
    options: ["Gestión del cambio organizacional", "Métricas claras de adopción y valor", "Ocultar el impacto del proyecto a los usuarios", "Evitar un Center of Excellence para no formalizar nada"],
    answer: [0, 1],
    explanation: "La adopción depende tanto de personas y procesos como de la solución técnica, por eso el change management y las métricas son esenciales. Ocultar cambios o eliminar gobierno frena la transformación."
  },
  {
    type: "single",
    prompt: "Un fabricante quiere modernizar gradualmente un sistema legacy de órdenes sin detener operaciones. ¿Qué estrategia suele ser más prudente?",
    options: ["Migración incremental por capacidades con integración controlada", "Apagar el legacy y reescribir todo en un fin de semana", "Esperar cinco años y no tocar nada", "Exportar los datos a PowerPoint cada mes"],
    answer: [0],
    explanation: "La migración incremental reduce riesgo y permite aprender en cada etapa, especialmente en procesos críticos. Un corte big bang en sistemas complejos suele aumentar probabilidad de falla."
  },
  {
    type: "single",
    prompt: "¿Qué papel puede jugar un Center of Excellence en casos de transformación digital con Power Platform?",
    options: ["Actuar como motor de adopción, estándares y escalado controlado", "Eliminar toda innovación ciudadana", "Reemplazar a los usuarios de negocio en sus decisiones", "Evitar cualquier medición de valor"],
    answer: [0],
    explanation: "Un CoE bien diseñado acelera adopción con guardrails, soporte y buenas prácticas compartidas. No busca bloquear la innovación, sino hacerla sostenible y medible."
  }
],
40: [
  {
    type: "single",
    prompt: "Estás planificando tu estudio de PL-600 y debes priorizar el dominio con mayor peso relativo. ¿Cuál merece mayor foco inicial?",
    options: ["Solution Design", "Analytics", "User Interface Themes", "Dataverse Search tuning solamente"],
    answer: [0],
    explanation: "Solution Design concentra el mayor porcentaje del examen y atraviesa muchos casos de estudio. Analytics también importa, pero con menor peso relativo en el blueprint."
  },
  {
    type: "single",
    prompt: "Durante un case study de PL-600, ¿cuál es la mejor táctica inicial antes de responder preguntas?",
    options: ["Leer requisitos, restricciones y problemas actuales para identificar trade-offs", "Ir directo a las preguntas sin revisar el escenario", "Marcar siempre la opción más larga", "Responder según la experiencia personal sin mirar los datos del caso"],
    answer: [0],
    explanation: "Los case studies premian la lectura cuidadosa del contexto, incluyendo requisitos explícitos y restricciones ocultas. Saltarse esa fase aumenta errores por asumir hechos que el caso no respalda."
  },
  {
    type: "multi",
    prompt: "¿Qué DOS prácticas ayudan a eliminar distractores en preguntas de PL-600?",
    options: ["Descartar opciones que violan un requisito explícito del escenario", "Comparar alternativas según seguridad, ALM, escalabilidad y gobernanza", "Elegir siempre la opción con más servicios Azure", "Asumir que la respuesta correcta evita cualquier compromiso arquitectónico"],
    answer: [0, 1],
    explanation: "Los distractores suelen fallar porque ignoran restricciones o sacrifican pilares clave del diseño. Más servicios no implica mejor respuesta, y en PL-600 casi siempre existen trade-offs reales."
  },
  {
    type: "single",
    prompt: "Con 45 preguntas y case studies en 120 minutos, ¿qué estrategia de tiempo es más razonable?",
    options: ["Consumir la mitad del examen en la primera pregunta difícil", "Mantener un ritmo controlado, marcar dudas y reservar tiempo para revisar", "Responder al azar las primeras 20 para ganar velocidad", "Leer solo las opciones, no el enunciado"],
    answer: [1],
    explanation: "Gestionar el tiempo implica avanzar, marcar preguntas complejas y volver con margen al final. Quedarse atascado o responder sin leer destruye precisión y reduce cobertura del examen."
  },
  {
    type: "single",
    prompt: "Un candidato con experiencia PL-400 pregunta qué cambia realmente al preparar PL-600. ¿Cuál respuesta es la más precisa?",
    options: ["PL-600 profundiza más en diseño integral, trade-offs y gobierno que en implementación puntual", "PL-600 es solo una versión con más preguntas de sintaxis de plugins", "PL-600 elimina por completo seguridad y ALM", "PL-600 se responde memorizando comandos sin escenarios"],
    answer: [0],
    explanation: "PL-400 se centra más en implementación técnica detallada, mientras PL-600 exige visión de Solution Architect. La diferencia está en el nivel de decisión, gobierno y análisis de escenario."
  }
],
41: [
  {
    type: "single",
    prompt: "En el capstone enterprise debes combinar experiencia interna, portal externo, lógica server-side, integración y analítica. ¿Qué propuesta refleja mejor esa arquitectura objetivo?",
    options: ["Model-Driven para operación interna, Power Pages para externos, plugins/PCF para extensión, Azure Integration para desacoplar y Fabric para analítica", "Solo una Canvas App con datos en Excel para todos los casos", "Un portal estático sin backend y reportes manuales", "Power BI como única capa transaccional"],
    answer: [0],
    explanation: "La opción correcta distribuye cada necesidad en la tecnología adecuada dentro de una arquitectura enterprise coherente. Las demás concentran cargas incompatibles o eliminan capacidades críticas de seguridad, integración o datos."
  },
  {
    type: "single",
    prompt: "El comité de arquitectura pide entregables que permitan mantener la solución después del proyecto. ¿Cuál conjunto es el más completo?",
    options: ["Solo el código fuente sin contexto", "ADRs, Reference Architecture, Capability Map y Risk Register", "Únicamente capturas de pantalla del producto final", "Una lista informal de recuerdos del equipo"],
    answer: [1],
    explanation: "Ese conjunto documenta decisiones, visión objetivo, capacidades cubiertas y riesgos residuales, lo que facilita operación y evolución. El código sin contexto o capturas no bastan para gobernanza enterprise."
  },
  {
    type: "multi",
    prompt: "Debes presentar la solución al comité ejecutivo. ¿Qué DOS mensajes no pueden faltar en una presentación sólida del capstone?",
    options: ["ROI y TCO esperados de la iniciativa", "Riesgos clave, mitigaciones y timeline de implantación", "Detalles irrelevantes de color de cada pantalla como principal argumento", "Una afirmación de que no existe ningún riesgo en el programa"],
    answer: [0, 1],
    explanation: "La dirección necesita entender valor económico, riesgo y plan de ejecución, no solo detalles técnicos o visuales. Afirmar que no existen riesgos resta credibilidad y madurez a la propuesta."
  },
  {
    type: "single",
    prompt: "Tu pipeline del capstone promueve soluciones entre DEV, TEST y PROD. ¿Qué práctica es indispensable para mantener gobierno y seguridad?",
    options: ["Usar Environment Variables, Connection References y validaciones automáticas antes de producción", "Editar componentes críticos manualmente en PROD para ahorrar tiempo", "Omitir revisiones de Solution Checker cuando el release es urgente", "Compartir una sola cuenta admin entre todos los equipos"],
    answer: [0],
    explanation: "La promoción controlada exige parametrización, trazabilidad y quality gates previos a producción. Los cambios manuales, la omisión de validaciones y las cuentas compartidas debilitan la arquitectura operativa."
  },
  {
    type: "single",
    prompt: "El sponsor pide que la plataforma también entregue inteligencia de negocio sin degradar el procesamiento transaccional. ¿Qué enfoque completa mejor el capstone?",
    options: ["Separar operación en Dataverse y analítica en Fabric con gobierno de seguridad y consumo", "Guardar reportes históricos como notas adjuntas en cada registro", "Ejecutar todas las consultas analíticas pesadas directamente desde los formularios productivos", "Eliminar cualquier capa analítica para simplificar"],
    answer: [0],
    explanation: "La separación entre cargas transaccionales y analíticas permite escalar ambos mundos con mejor rendimiento y gobierno. Cargar el sistema operacional con reporting pesado o eliminar analítica reduce el valor de la solución."
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

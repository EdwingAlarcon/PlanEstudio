# GLOSARIO DE TÉRMINOS — Power Platform & Dynamics 365
**Referencia rápida** | Ordenado alfabéticamente por categoría

---

## A

**AI Builder** — Servicio de inteligencia artificial integrado en Power Platform. Permite crear modelos de clasificación, extracción de documentos, predicción y detección de objetos sin necesidad de conocimientos de machine learning.

**ALM (Application Lifecycle Management)** — Disciplina que gestiona el ciclo de vida completo de una solución: diseño, desarrollo, pruebas, despliegue y mantenimiento. En Power Platform se implementa con ambientes múltiples y soluciones.

**APIM (Azure API Management)** — Gateway de APIs de Azure. Centraliza la exposición de APIs REST con autenticación, rate limiting, transformación de request/response y portal de desarrolladores.

**App Registration** — Registro de una aplicación en Microsoft Entra ID (antes Azure Active Directory) que le otorga una identidad (Client ID + Secret) para autenticarse con servicios de Microsoft. Usado para Service Principals en pipelines CI/CD.

**Azure AD (Active Directory)** — Nombre anterior de Microsoft Entra ID. Servicio de identidad y acceso en la nube de Microsoft. Gestiona usuarios, grupos, permisos y autenticación para todos los servicios de Microsoft 365 y Azure. Renombrado a Microsoft Entra ID en julio de 2023.

**Microsoft Entra ID** — Nombre actual (desde julio 2023) del servicio de identidad de Microsoft, antes conocido como Azure Active Directory (Azure AD). Ver **Azure AD**.

**Azure AD B2C** — Variante de Azure AD orientada a consumidores externos. Permite registro y login de usuarios que no tienen cuentas en el directorio corporativo.

**Azure Functions** — Servicio de cómputo serverless de Azure. Ejecuta código (C#, Python, JavaScript, etc.) en respuesta a eventos, sin necesidad de gestionar servidores.

**Azure Service Bus** — Servicio de mensajería empresarial de Azure. Implementa colas y topics para comunicación asíncrona desacoplada entre sistemas.

---

## B

**BPF (Business Process Flow)** — Flujo de proceso de negocio visual en Dynamics 365 y Power Apps. Guía al usuario a través de etapas secuenciales en un formulario Model-Driven.

**Business Rule** — Regla de negocio sin código configurable en Dataverse. Se ejecuta en el cliente (formulario) y/o en el servidor, permitiendo validaciones y cambios de valor automáticos.

**Bundle (JavaScript)** — Archivo único que empaqueta todo el código JavaScript de un PCF o web resource. Los bundles grandes impactan el tiempo de carga.

---

## C

**Canvas App** — Tipo de aplicación Power Apps con diseño libre (lienzo). El desarrollador controla completamente la posición y aspecto de cada elemento. Ideal para experiencias muy personalizadas o móviles.

**Copilot Studio** — Plataforma de Microsoft para crear agentes conversacionales e IA generativa empresarial, sin necesidad de código. Antes conocido como Power Virtual Agents (PVA). Permite diseñar topics, integrar Knowledge Sources y conectar con sistemas externos vía Power Automate o llamadas HTTP. El desarrollador controla completamente la posición y aspecto de cada elemento. Ideal para experiencias muy personalizadas o móviles.

**CASB (Cloud Access Security Broker)** — Microsoft Defender for Cloud Apps. Proporciona visibilidad sobre el uso de aplicaciones en la nube, detecta shadow IT y aplica políticas de seguridad.

**Child Flow** — Flujo de Power Automate diseñado para ser llamado desde otro flujo (padre). Permite reutilización de lógica. Debe estar en la misma solución que el flujo padre.

**CMK (Customer-Managed Keys)** — Cifrado de datos de Dataverse con claves almacenadas en Azure Key Vault propiedad del cliente (no de Microsoft). Proporciona control total sobre el acceso a los datos.

**CoE (Center of Excellence)** — Centro de excelencia. Equipo o función responsable de establecer mejores prácticas, gobernanza y soporte para el uso de Power Platform en una organización. El CoE Starter Kit es la implementación de referencia de Microsoft.

**Component Library** — Biblioteca de componentes reutilizables para Canvas Apps. Los componentes se actualizan centralmente y las apps los consumen, garantizando consistencia.

**Concurrency (Apply to Each)** — Configuración en Power Automate que permite ejecutar iteraciones de un loop en paralelo (máx 50), reduciendo drásticamente el tiempo total de ejecución.

**Connection Reference** — Abstracción de una conexión en Power Platform Solutions. Permite que los flujos y apps usen conexiones que se configuran por ambiente, facilitando el ALM.

**Conditional Access** — Política de Azure AD que condiciona el acceso a aplicaciones según el estado del dispositivo, la ubicación, el riesgo del usuario y otros factores. Forma parte del modelo Zero Trust.

**Context Transition (DAX)** — Mecanismo por el cual CALCULATE convierte el contexto de fila (row context) en contexto de filtro (filter context). Comprenderlo es esencial para DAX avanzado.

---

## D

**Data Loss Prevention (DLP)** — Política en Power Platform que clasifica conectores en "Negocio", "No negocio" y "Bloqueado", impidiendo que flujos mezclen datos de fuentes incompatibles (ej: datos corporativos con Twitter).

**Dataverse** — Base de datos relacional en la nube, parte de Power Platform. Almacena datos de negocios con seguridad, auditoría, lógica de negocio y capacidades de búsqueda integradas. Antes llamado Common Data Service (CDS).

**Dataverse Link to Fabric** — Funcionalidad que exporta automáticamente tablas de Dataverse a Microsoft Fabric en formato Delta, sin necesidad de pipelines adicionales.

**DAX (Data Analysis Expressions)** — Lenguaje de fórmulas para Power BI, Analysis Services y Excel Power Pivot. Se usa para definir medidas y columnas calculadas en modelos de datos.

**Dead Letter Queue (DLQ)** — Cola de mensajes fallidos en Azure Service Bus. Los mensajes que no pueden procesarse después de N reintentos se mueven a la DLQ para revisión manual.

**Delegation** — En Canvas Apps, operación que se ejecuta en el servidor de datos (no en el cliente). Las operaciones delegables pueden procesar todos los registros; las no delegables están limitadas a 500–2000 registros.

**DirectLake (Power BI)** — Modo de conexión en Microsoft Fabric que permite a Power BI leer datos directamente del Lakehouse sin importar ni usar DirectQuery. Combina la velocidad del modo Import con datos actualizados.

**DirectQuery (Power BI)** — Modo de conexión donde Power BI consulta la fuente de datos en tiempo real en lugar de importar los datos. Más lento que Import pero datos siempre actualizados.

**Durable Functions** — Extensión de Azure Functions para orquestar flujos de trabajo stateful y de larga duración. Implementa patrones como Fan-out/Fan-in, Human interaction y Saga.

**Dynamics 365** — Suite de aplicaciones CRM y ERP de Microsoft construidas sobre Dataverse. Incluye módulos de Sales, Customer Service, Field Service, Finance, Supply Chain, y más.

---

## E

**Early-Bound** — Estilo de programación en plugins C# que usa clases fuertemente tipadas generadas desde el esquema de Dataverse. Proporciona IntelliSense y verificación en tiempo de compilación.

**Entity (Dataverse)** — Término legacy para "tabla" en Dataverse. Actualmente Microsoft usa "tabla" en la UI, pero la API sigue usando "entity" en muchos lugares.

**EntityReference** — Referencia a un registro de Dataverse compuesta por el nombre lógico de la tabla y el GUID del registro. Se usa en C# para campos de tipo Lookup.

**Environment** — Ambiente en Power Platform. Espacio aislado con su propia instancia de Dataverse, apps, flujos y configuraciones. Los ambientes separan DEV, TEST, UAT y PROD.

**Environment Variable** — Par clave-valor en Power Platform Solutions. El valor puede ser diferente por ambiente, permitiendo que el mismo flujo o app funcione en DEV y PROD con configuraciones distintas.

**Event Grid (Azure)** — Servicio de enrutamiento de eventos cloud-native. Distribuye eventos de Azure (y eventos personalizados) a múltiples suscriptores en tiempo real.

---

## F

**Fabric (Microsoft Fabric)** — Plataforma analítica unificada de Microsoft. Integra Lakehouse, Warehouse, Pipelines, Notebooks, Real-Time Analytics, Data Activator y Power BI en una sola plataforma con almacenamiento compartido (OneLake).

**FetchXML** — Lenguaje de consulta propietario de Dataverse basado en XML. Permite consultas complejas con joins, filtros y agregaciones directamente en Power Automate y otras herramientas.

**Field Security Profile** — Perfil que controla el acceso de lectura y escritura a columnas específicas de Dataverse por usuario o equipo. Independiente del Security Role.

**Filter Context (DAX)** — Conjunto de filtros activos que afectan el resultado de una medida en un momento dado. Es determinado por los slicers, visuales y relaciones activas en el reporte.

**Fluent UI** — Sistema de diseño de Microsoft para aplicaciones web y móviles. Se usa en PCF controls para que los controles personalizados tengan apariencia consistente con Power Platform y Dynamics 365.

**ForkOn / Run After** — Configuración en Power Automate que define cuándo se ejecuta una acción según el estado de la acción anterior: Succeeded, Failed, Skipped, TimedOut.

---

## G

**GDPR (General Data Protection Regulation)** — Reglamento europeo de protección de datos (2018). Regula cómo se recopilan, almacenan y procesan datos personales de ciudadanos de la UE.

**Generative AI** — Inteligencia artificial que genera contenido nuevo (texto, imágenes, código). En Power Platform, se manifiesta como Generative Answers en Copilot Studio y Copilot en Power Apps.

**Governance Framework** — Marco de trabajo que define las políticas, procesos y controles para el uso responsable y seguro de Power Platform en una organización.

---

## H

**Hub-and-Spoke** — Patrón de arquitectura donde un tenant o ambiente centralizado (hub) comparte recursos, políticas y datos con tenants o ambientes secundarios (spokes).

**Hyperautomation** — Combinación de RPA (Robotic Process Automation), AI y automatización de procesos para automatizar todo lo que es automatizable en una organización.

---

## I

**IPlugin** — Interfaz de C# que deben implementar todos los plugins de Dataverse. Define el método `Execute(IServiceProvider serviceProvider)`.

**IPluginExecutionContext** — Interfaz de C# que proporciona información sobre el evento que disparó el plugin: tabla, operación, stage, usuario, y los datos del registro (InputParameters, PreEntityImages, PostEntityImages).

**ITracingService** — Interfaz de C# para escribir logs en el Plugin Trace Log de Dataverse. Indispensable para depurar plugins en producción.

**Integration Account** — Recurso de Azure que almacena schemas XML, mapas XSLT, socios EDI y certificados para Logic Apps con integraciones enterprise/B2B.

**IOrganizationService** — Interfaz de C# que proporciona métodos para operaciones CRUD en Dataverse: Create, Retrieve, RetrieveMultiple, Update, Delete, Execute.

---

## L

**Landing Zone** — Ambiente pre-configurado con todas las políticas de seguridad, DLP, grupos de usuarios y configuraciones base listas para que un nuevo proyecto comience a desarrollar.

**Late-Bound** — Estilo de programación en plugins C# que usa la clase genérica `Entity` de Dataverse sin tipado fuerte. Más flexible pero sin IntelliSense ni verificación en compilación.

**Liquid** — Lenguaje de templates server-side usado en Power Pages. Permite generar HTML dinámico accediendo a datos de Dataverse y al usuario autenticado.

**Logic App (Azure)** — Servicio de orquestación de flujos de trabajo enterprise en Azure. Similar a Power Automate pero orientado a IT con mayor control, conectores EDI/B2B e integration accounts.

---

## M

**Managed Environment** — Ambiente con gobernanza avanzada habilitada en Power Platform (feature premium). Permite sharing limits, Solution Checker enforcement, IP firewall y Customer-Managed Keys.

**Managed Solution** — Solución en modo de solo lectura en el ambiente de destino. Los componentes de una solución managed no pueden ser editados directamente en el ambiente donde fue importada.

**Medallion Architecture** — Patrón de arquitectura de datos con tres capas: Bronze (datos crudos), Silver (datos limpios y estandarizados) y Gold (métricas de negocio listas para análisis).

**Microsoft Sentinel** — SIEM/SOAR cloud-native de Microsoft. Detecta, analiza y responde a amenazas de seguridad usando logs de múltiples fuentes incluyendo Power Platform.

**Model-Driven App** — Tipo de aplicación Power Apps basada en el modelo de datos de Dataverse. La UI se genera automáticamente a partir de formularios, vistas y relaciones configuradas.

**Multi-tenant** — Arquitectura donde múltiples tenants de Azure AD coexisten, cada uno con su propio conjunto de datos y usuarios, conectados mediante integración.

---

## N

**Named Formula (Power Fx)** — Fórmula con nombre declarada en App.Formulas que se evalúa de forma lazy (solo cuando se necesita). Mejora el rendimiento vs variables globales en App.OnStart.

---

## O

**OData (Open Data Protocol)** — Protocolo REST para consultar y manipular datos. La API web de Dataverse es OData v4. Se usa para filtros como `?$filter=campo eq 'valor'&$top=50`.

**OneLake** — Almacenamiento unificado subyacente de Microsoft Fabric. Todos los items de Fabric (Lakehouse, Warehouse, etc.) comparten el mismo lago de datos.

**Orchestration** — En Copilot Studio, modo donde el LLM decide qué topic activar basándose en la intención del usuario (vs trigger phrases fijas). También se refiere a coordinar múltiples servicios o agentes.

---

## P

**pac CLI (Power Platform CLI)** — Herramienta de línea de comandos de Microsoft para automatizar tareas de Power Platform: exportar soluciones, crear ambientes, hacer push de PCF, etc.

**PCF (Power Apps Component Framework)** — Framework para crear controles personalizados con TypeScript/React que se integran en Canvas Apps y formularios de Model-Driven Apps.

**PIM (Privileged Identity Management)** — Servicio de Azure AD que gestiona el acceso just-in-time (JIT) a roles privilegiados. Los administradores activan su acceso solo cuando lo necesitan, por un tiempo limitado.

**Plugin** — Código C# que se registra en el pipeline de eventos de Dataverse. Se ejecuta en el servidor en respuesta a operaciones CRUD (Create, Update, Delete, etc.).

**Plugin Registration Tool (PRT)** — Herramienta desktop para registrar assemblies y steps de plugins en Dataverse. Disponible como paquete NuGet.

**Power Automate** — Servicio de automatización de flujos de trabajo de Microsoft. Permite crear flujos sin código o con poco código que automatizan procesos entre aplicaciones y servicios.

**Power Fx** — Lenguaje de fórmulas declarativo de Power Platform, basado en Excel. Se usa en Canvas Apps, y gradualmente se adopta en Model-Driven Apps y Dataverse.

**Power Pages** — Plataforma de Microsoft para crear portales web externos. Sucesor de Power Apps Portals. Permite a usuarios externos (clientes, proveedores) interactuar con datos de Dataverse de forma segura.

**Publisher** — Entidad que publica una solución en Dataverse. Define el prefijo de personalización (ej: `sit_`) que se usa en todos los componentes de la solución.

**Purview (Microsoft Purview)** — Plataforma de gobernanza de datos de Microsoft. Incluye clasificación de datos, etiquetas de confidencialidad, catálogo de datos y DLP avanzado.

---

## R

**RACI Matrix** — Matriz que define quién es Responsible (hace el trabajo), Accountable (dueño del resultado), Consulted (da input) e Informed (recibe información) para cada actividad del proyecto.

**Retry Policy** — Configuración en Power Automate o Logic Apps que define cuántas veces y con qué intervalo se reintenta una acción fallida antes de declarar el error.

**RLS (Row Level Security)** — Seguridad a nivel de fila en Power BI. Filtra los datos que cada usuario puede ver basándose en su identidad (USERPRINCIPALNAME()).

**Rollup Column** — Columna de Dataverse que agrega valores de registros relacionados (Sum, Count, Min, Max, Avg). Se actualiza automáticamente cada 12 horas o manualmente.

**Row Context (DAX)** — Contexto de la fila actual durante una iteración (en funciones como SUMX, AVERAGEX, FILTER). Distinto del filter context.

---

## S

**Saga Pattern** — Patrón para gestionar transacciones distribuidas mediante una secuencia de operaciones locales y compensaciones. Si un paso falla, los pasos anteriores se deshacen.

**Sandbox Environment** — Tipo de ambiente en Power Platform para desarrollo y pruebas. Puede ser copiado o reseteado. No tiene SLA de producción.

**Scope (Power Automate)** — Contenedor de acciones que permite implementar el patrón try-catch. Si alguna acción dentro del scope falla, se puede capturar el error con otro scope configurado en "Run After → Failed".

**Security Role** — Conjunto de permisos CRUD sobre tablas y privilegios de negocio en Dataverse. Determina qué operaciones puede realizar un usuario sobre los datos.

**Semantic Kernel** — SDK de Microsoft para orquestar modelos de lenguaje (LLMs) con plugins, memoria y conectores. Permite construir agentes AI complejos.

**Service Bus (Azure)** — Servicio de mensajería empresarial de Azure con colas y topics. Garantiza entrega, orden (sessions) y reintentos automáticos.

**Service Connection** — Configuración en Azure DevOps que almacena las credenciales para conectarse a un ambiente de Power Platform. Equivale a un service principal con permisos de administración.

**Service Endpoint** — Configuración en Dataverse que permite enviar mensajes a servicios externos (Azure Service Bus, Event Hub, WebHook) cuando ocurren eventos en Dataverse.

**Solution** — Contenedor que agrupa componentes de Power Platform (apps, flujos, tablas, plugins, etc.) para su distribución y despliegue entre ambientes.

**Solution Checker** — Herramienta de análisis estático que evalúa la calidad y compatibilidad de una solución de Power Platform. Disponible en make.powerapps.com y en pipelines CI/CD.

**SSO (Single Sign-On)** — Autenticación única donde el usuario se loguea una vez y accede a múltiples aplicaciones sin volver a ingresar credenciales.

---

## T

**Table Permission** — Control de acceso a tablas de Dataverse desde Power Pages. Define qué operaciones CRUD puede realizar un usuario del portal sobre los registros, y según qué relación (Global, Contact, Account, Self).

**Teams** — En Dataverse, un equipo es un grupo de usuarios que comparten Security Roles. Hay equipos de propietario y equipos de acceso.

**Throttling** — Limitación de la tasa de llamadas a una API. Dataverse, Power Automate y los servicios de Azure tienen límites de throttling que deben considerarse en diseños de integración de alto volumen.

**TOGAF** — The Open Group Architecture Framework. Marco metodológico para arquitectura enterprise que define fases de desarrollo (ADM) y dominios de arquitectura (Negocio, Datos, Aplicaciones, Tecnología).

**Topic (Copilot Studio)** — Unidad de conversación en Copilot Studio. Define cuándo se activa (trigger phrases) y qué responde el agente, incluyendo preguntas, acciones, condiciones y mensajes.

---

## U

**Unified Routing** — Sistema de enrutamiento inteligente en Dynamics 365 Customer Service. Asigna casos a agentes basándose en skills, disponibilidad, carga de trabajo y reglas de negocio.

**Unmanaged Solution** — Solución editable en el ambiente donde fue importada. Se usa en desarrollo (DEV). Nunca debe importarse a producción.

**UPN (User Principal Name)** — Identificador único de un usuario en Azure AD, generalmente en formato email (usuario@empresa.com). USERPRINCIPALNAME() en DAX retorna el UPN del usuario del reporte.

---

## V

**Variable de entorno** — Ver Environment Variable.

**Virtual PCF** — Tipo de PCF que usa el runtime de React del host (Power Apps) en lugar de empaquetar su propio React. Genera bundles más pequeños y mejor rendimiento. Opción recomendada para nuevos controles.

---

## W

**WAF (Web Application Firewall)** — Firewall de aplicación web. Protege portales Power Pages de ataques comunes (SQL injection, XSS, OWASP Top 10).

**Web Resource** — Archivo (JavaScript, CSS, HTML, imagen) almacenado en Dataverse y referenciado en formularios de Model-Driven Apps. Los Web Resources JS se usan para lógica de cliente en formularios.

**Web Role** — Rol de seguridad específico de Power Pages (distinto de los Security Roles de Dataverse). Define qué páginas y tablas puede ver un usuario autenticado del portal.

**Well-Architected Framework** — Marco de evaluación de arquitecturas de Microsoft con 5 pilares: Fiabilidad, Seguridad, Excelencia operacional, Eficiencia de rendimiento y Optimización de costos.

**WBS (Work Breakdown Structure)** — Descomposición jerárquica del alcance del proyecto en componentes más pequeños y manejables para facilitar la estimación y el seguimiento.

---

## Z

**Zero Trust** — Modelo de seguridad que no confía en ningún acceso por defecto, incluso dentro de la red corporativa. Principio: "Nunca confiar, siempre verificar". Incluye MFA, acceso mínimo, verificación continua.

---

## Siglas de referencia rápida

| Sigla | Significado |
|-------|-------------|
| ADR | Architecture Decision Record |
| ALM | Application Lifecycle Management |
| APIM | Azure API Management |
| BPF | Business Process Flow |
| CASB | Cloud Access Security Broker |
| CI/CD | Continuous Integration / Continuous Deployment |
| CMK | Customer-Managed Keys |
| CoE | Center of Excellence |
| CRUD | Create, Read, Update, Delete |
| DAX | Data Analysis Expressions |
| DLP | Data Loss Prevention |
| DLQ | Dead Letter Queue |
| GDPR | General Data Protection Regulation |
| IEF | Identity Experience Framework (Azure AD B2C) |
| JIT | Just-In-Time (acceso) |
| KPI | Key Performance Indicator |
| LGPD | Lei Geral de Proteção de Dados (Brasil) |
| MFA | Multi-Factor Authentication |
| MTTR | Mean Time to Recover |
| OData | Open Data Protocol |
| PCF | Power Apps Component Framework |
| PIM | Privileged Identity Management |
| PRT | Plugin Registration Tool |
| RACI | Responsible, Accountable, Consulted, Informed |
| RLS | Row Level Security |
| RPA | Robotic Process Automation |
| SLA | Service Level Agreement |
| SoW | Statement of Work |
| SPN | Service Principal Name |
| SSO | Single Sign-On |
| TDS | Tabular Data Stream (endpoint SQL de Dataverse) |
| TOGAF | The Open Group Architecture Framework |
| UPN | User Principal Name |
| WAF | Web Application Firewall |
| WBS | Work Breakdown Structure |

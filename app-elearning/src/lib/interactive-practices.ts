import { PRACTICE_ACCOUNTS } from "@/data/practice/accounts";
import { PRACTICE_PRODUCTS } from "@/data/practice/products";
import { PRACTICE_REQUESTS } from "@/data/practice/requests";

export const INTERACTIVE_PRACTICE_TYPES = ["multiple-decision", "flow-builder", "query-playground", "debug-scenario"] as const;
export const INTERACTIVE_PRACTICE_DOMAINS = ["dataverse", "power-apps", "power-automate", "fetchxml", "odata", "troubleshooting"] as const;
export const INTERACTIVE_PRACTICE_LEVELS = ["starter", "junior", "advanced"] as const;

export type InteractivePracticeType = typeof INTERACTIVE_PRACTICE_TYPES[number];
export type InteractivePracticeDomain = typeof INTERACTIVE_PRACTICE_DOMAINS[number];
export type InteractivePracticeLevel = typeof INTERACTIVE_PRACTICE_LEVELS[number];
export type InteractivePracticeMastery = "not-started" | "learning" | "needs-review" | "proficient";
export type InteractivePracticeMode = "practice" | "interview";
export type QueryDialect = "fetchxml" | "odata";

export interface InteractivePracticeHint {
  id: string;
  content: string;
}

interface BaseInteractivePractice {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: InteractivePracticeType;
  domain: InteractivePracticeDomain;
  level: InteractivePracticeLevel;
  estimatedMinutes: number;
  prerequisites: string[];
  learningObjectives: string[];
  scenario: {
    context: string;
    objective: string;
  };
  hints: InteractivePracticeHint[];
  relatedModuleIds: number[];
  relatedLabIds: string[];
  tags: string[];
}

export interface DecisionOption {
  id: string;
  label: string;
  consequence: string;
  score: number;
}

export interface MultipleDecisionPractice extends BaseInteractivePractice {
  type: "multiple-decision";
  multiple: boolean;
  options: DecisionOption[];
  correctOptionIds: string[];
}

export interface FlowBlock {
  id: string;
  label: string;
  kind: "trigger" | "condition" | "action" | "notification" | "terminate";
}

export interface FlowTestCase {
  id: string;
  label: string;
  amount: number;
  expected: "auto-approved" | "approval-required";
}

export interface FlowBranchPreview {
  conditionLabel: string;
  yes: { label: string; blockIds: string[] };
  no: { label: string; blockIds: string[] };
}

export interface FlowBuilderPractice extends BaseInteractivePractice {
  type: "flow-builder";
  blocks: FlowBlock[];
  expectedBlockIds: string[];
  threshold: number;
  testCases: FlowTestCase[];
  /** Vista de solo lectura de cómo se ramifica el flujo en Power Automate real (Sí/No), aparte del orden lineal que el estudiante arma. */
  branchPreview?: FlowBranchPreview;
}

export interface QueryPlaygroundPractice extends BaseInteractivePractice {
  type: "query-playground";
  dialect: QueryDialect;
  starter: string;
  expectedColumns: string[];
  expectedNames: string[];
  /** Sintaxis mínima del dialecto, mostrada junto al editor antes de escribir la consulta. */
  syntaxRef: string;
  /** Consulta completa y correcta, mostrada en "Ver solución". */
  solutionQuery: string;
}

export interface DebugScenarioPractice extends BaseInteractivePractice {
  type: "debug-scenario";
  implementation: string;
  symptom: string;
  fixPrompt: string;
  acceptableFixes: string[];
  testCases: Array<{ id: string; input: string; expected: string }>;
}

export type InteractivePractice =
  | MultipleDecisionPractice
  | FlowBuilderPractice
  | QueryPlaygroundPractice
  | DebugScenarioPractice;

export interface InteractiveEvaluationResult {
  status: "correct" | "partial" | "incorrect";
  score: number;
  feedback: string;
  consequences: string[];
  rows?: Record<string, string | number | boolean | null>[];
  testResults?: Array<{ label: string; pass: boolean; expected: string; actual: string }>;
  normalizedAnswer?: string;
}

export const INTERACTIVE_DOMAIN_LABELS: Record<InteractivePracticeDomain, string> = {
  dataverse: "Dataverse",
  "power-apps": "Power Apps",
  "power-automate": "Power Automate",
  fetchxml: "FetchXML",
  odata: "OData",
  troubleshooting: "Troubleshooting",
};

export const INTERACTIVE_TYPE_LABELS: Record<InteractivePracticeType, string> = {
  "multiple-decision": "Multiple Decision",
  "flow-builder": "Flow Builder",
  "query-playground": "Query Playground",
  "debug-scenario": "Debug Scenario",
};

export const INTERACTIVE_LEVEL_LABELS: Record<InteractivePracticeLevel, string> = {
  starter: "Starter",
  junior: "Junior",
  advanced: "Advanced",
};

export const INTERACTIVE_MASTERY_LABELS: Record<InteractivePracticeMastery, string> = {
  "not-started": "No iniciado",
  learning: "Aprendiendo",
  "needs-review": "Para repasar",
  proficient: "Proficient",
};

export const INTERACTIVE_PRACTICES: InteractivePractice[] = [
  {
    id: "IP-DV-001",
    slug: "ip-dv-001-relacion-cliente-pedidos",
    title: "Relación Cliente/Pedidos",
    description: "Decide cómo modelar una relación donde un cliente puede tener muchos pedidos.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "starter",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 2"],
    learningObjectives: ["Distinguir lado 1 y lado N", "Evitar relaciones N:N innecesarias"],
    scenario: {
      context: "Un cliente puede tener muchos pedidos. Cada pedido pertenece a un único cliente.",
      objective: "Selecciona la relación Dataverse que representa mejor el modelo.",
    },
    multiple: false,
    options: [
      { id: "nn", label: "Cliente N:N Pedido", consequence: "Crea complejidad innecesaria porque un pedido no pertenece a muchos clientes.", score: 0 },
      { id: "one-many", label: "Cliente 1:N Pedido", consequence: "Cliente es el lado uno; Pedido guarda la referencia al cliente.", score: 1 },
      { id: "many-one", label: "Cliente N:1 Pedido", consequence: "Describe la relación desde Pedido hacia Cliente, pero el modelo solicitado parte desde Cliente.", score: 0.6 },
      { id: "none", label: "No crear relación", consequence: "Pierdes integridad referencial y navegación entre registros.", score: 0 },
    ],
    correctOptionIds: ["one-many"],
    hints: [
      { id: "h1", content: "Identifica qué registro puede repetirse varias veces para un mismo principal." },
      { id: "h2", content: "Pedido es el registro que necesita guardar la referencia al cliente." },
      { id: "h3", content: "La relación correcta se lee desde Cliente como uno-a-muchos." },
    ],
    relatedModuleIds: [2],
    relatedLabIds: ["LAB-002"],
    tags: ["relaciones", "lookup", "modelado"],
  },
  {
    id: "IP-DV-002",
    slug: "ip-dv-002-elegir-tipo-columna",
    title: "Elegir tipo de columna",
    description: "Clasifica necesidades de negocio en tipos de columna Dataverse.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "starter",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 2"],
    learningObjectives: ["Elegir tipos nativos", "Evitar texto para datos estructurados"],
    scenario: {
      context: "Debes modelar fecha de entrega, presupuesto, estado, cliente relacionado, activo/inactivo y observaciones.",
      objective: "Selecciona las decisiones de modelado correctas.",
    },
    multiple: true,
    options: [
      { id: "money", label: "Presupuesto como moneda", consequence: "Permite formato, validación y operaciones numéricas.", score: 1 },
      { id: "date", label: "Fecha de entrega como Date only", consequence: "Evita texto libre y mejora filtros por fecha.", score: 1 },
      { id: "lookup", label: "Cliente relacionado como Lookup", consequence: "Mantiene relación con la tabla Cliente.", score: 1 },
      { id: "age-text", label: "Edad como texto para ordenar más fácil", consequence: "Texto rompe validación y orden numérico.", score: 0 },
      { id: "active-bool", label: "Activo como sí/no", consequence: "Buena opción cuando el estado es binario.", score: 1 },
    ],
    correctOptionIds: ["money", "date", "lookup", "active-bool"],
    hints: [
      { id: "h1", content: "Prefiere tipos semánticos sobre texto cuando el dato se calcula, filtra o valida." },
      { id: "h2", content: "Lookup representa relación; moneda y fecha representan operaciones propias." },
      { id: "h3", content: "Texto debe quedar para observaciones o datos realmente libres." },
    ],
    relatedModuleIds: [2],
    relatedLabIds: ["LAB-002"],
    tags: ["columnas", "tipo de dato", "validacion"],
  },
  {
    id: "IP-DV-003",
    slug: "ip-dv-003-corregir-modelo-incorrecto",
    title: "Corregir modelo incorrecto",
    description: "Diagnostica una columna Edad creada como texto y elige corrección segura.",
    type: "debug-scenario",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 2", "Módulo 9"],
    learningObjectives: ["Detectar deuda de modelado", "Planear migración sin pérdida"],
    scenario: {
      context: "Una columna Edad se creó como texto. Los usuarios reportan orden incorrecto y validaciones inconsistentes.",
      objective: "Propón la corrección técnica sin borrar datos existentes.",
    },
    implementation: "Column: Edad\nType: Text\nExisting values: '9', '12', 'N/A', '35'",
    symptom: "Ordena 12 antes que 9 y permite valores no numéricos.",
    fixPrompt: "Escribe la corrección propuesta.",
    acceptableFixes: ["numero", "whole number", "entero", "migrar", "validar", "limpiar datos", "nueva columna"],
    testCases: [
      { id: "t1", input: "Valor 9", expected: "Orden numérico correcto" },
      { id: "t2", input: "Valor N/A", expected: "Se detecta como dato a limpiar antes de migrar" },
    ],
    hints: [
      { id: "h1", content: "El problema no es solo visual; el tipo de dato no expresa el dominio." },
      { id: "h2", content: "No cambies producción sin revisar valores existentes." },
      { id: "h3", content: "Crea columna numérica, limpia/migra y valida antes de retirar la anterior." },
    ],
    relatedModuleIds: [2, 9],
    relatedLabIds: ["LAB-002", "LAB-009"],
    tags: ["troubleshooting", "datos", "migracion"],
  },
  {
    id: "IP-PA-001",
    slug: "ip-pa-001-elegir-trigger-correcto",
    title: "Elegir trigger correcto",
    description: "Elige el disparador adecuado para automatizar una solicitud nueva.",
    type: "multiple-decision",
    domain: "power-automate",
    level: "starter",
    estimatedMinutes: 4,
    prerequisites: ["Módulo 5"],
    learningObjectives: ["Diferenciar triggers manuales y Dataverse", "Evitar polling innecesario"],
    scenario: {
      context: "Cada vez que se crea una fila Solicitud en Dataverse, debe iniciar una validación.",
      objective: "Selecciona el trigger más adecuado.",
    },
    multiple: false,
    options: [
      { id: "manual", label: "Manually trigger a flow", consequence: "Depende de una acción humana y no responde a creación de filas.", score: 0 },
      { id: "dataverse-added", label: "When a row is added", consequence: "Responde al evento exacto en Dataverse.", score: 1 },
      { id: "recurrence", label: "Recurrence cada hora", consequence: "Puede funcionar con retraso, pero agrega complejidad y polling.", score: 0.4 },
      { id: "email", label: "When a new email arrives", consequence: "No corresponde si la fuente oficial es Dataverse.", score: 0 },
    ],
    correctOptionIds: ["dataverse-added"],
    hints: [
      { id: "h1", content: "El evento nace en Dataverse, no en correo ni en un usuario." },
      { id: "h2", content: "Busca el trigger que reacciona a una fila creada." },
      { id: "h3", content: "Usa When a row is added." },
    ],
    relatedModuleIds: [5],
    relatedLabIds: ["LAB-005"],
    tags: ["trigger", "dataverse", "cloud flow"],
  },
  {
    id: "IP-PA-002",
    slug: "ip-pa-002-aprobacion-por-monto",
    title: "Construir aprobación por monto",
    description: "Ordena bloques de un flujo y ejecuta casos de prueba con montos.",
    type: "flow-builder",
    domain: "power-automate",
    level: "junior",
    estimatedMinutes: 10,
    prerequisites: ["Módulo 5", "Lab 05"],
    learningObjectives: ["Ordenar trigger, condición y acciones", "Validar casos límite"],
    scenario: {
      context: "Cuando una solicitud sea creada, si el monto supera 10.000.000 debe solicitar aprobación. En caso contrario, aprobar automáticamente.",
      objective: "Construye el flujo lógico mínimo y ejecútalo contra casos de prueba.",
    },
    blocks: [
      { id: "trigger-row-added", label: "When row added", kind: "trigger" },
      { id: "condition-amount-gt", label: "Condition: Amount > 10000000", kind: "condition" },
      { id: "start-approval", label: "Start approval", kind: "action" },
      { id: "update-approved", label: "Update row: approved", kind: "action" },
      { id: "send-notification", label: "Send notification", kind: "notification" },
    ],
    expectedBlockIds: ["trigger-row-added", "condition-amount-gt", "start-approval", "update-approved", "send-notification"],
    threshold: 10000000,
    branchPreview: {
      conditionLabel: "Condition: Amount > 10000000",
      yes: { label: "Sí (supera el umbral)", blockIds: ["start-approval", "update-approved"] },
      no: { label: "No (no supera el umbral)", blockIds: ["update-approved"] },
    },
    testCases: [
      { id: "low", label: "Monto: 5.000.000", amount: 5000000, expected: "auto-approved" },
      { id: "high", label: "Monto: 15.000.000", amount: 15000000, expected: "approval-required" },
      { id: "edge", label: "Monto: 10.000.000", amount: 10000000, expected: "auto-approved" },
    ],
    hints: [
      { id: "h1", content: "El trigger debe abrir el flujo; la condición debe ejecutarse antes de las acciones." },
      { id: "h2", content: "Solo montos superiores al umbral van a aprobación." },
      { id: "h3", content: "El caso límite de 10.000.000 no supera el umbral." },
    ],
    relatedModuleIds: [5, 11],
    relatedLabIds: ["LAB-005"],
    tags: ["approval", "condition", "test cases"],
  },
  {
    id: "IP-PA-003",
    slug: "ip-pa-003-corregir-condicion-invertida",
    title: "Corregir condición invertida",
    description: "Arregla una condición que envía compras menores a aprobación.",
    type: "debug-scenario",
    domain: "power-automate",
    level: "starter",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 5"],
    learningObjectives: ["Leer operadores", "Validar con caso límite"],
    scenario: {
      context: "Las solicitudes menores de 10 millones están enviándose a aprobación.",
      objective: "Corrige la condición para que solo montos superiores a 10 millones requieran aprobación.",
    },
    implementation: "Condition:\nAmount < 10000000",
    symptom: "5M requiere aprobación; 15M se aprueba automáticamente.",
    fixPrompt: "Escribe la condición corregida.",
    acceptableFixes: ["amount > 10000000", "> 10000000", "mayor que 10000000", "superior a 10000000"],
    testCases: [
      { id: "low", input: "5M", expected: "aprobación automática" },
      { id: "high", input: "15M", expected: "solicitar aprobación" },
      { id: "edge", input: "10M", expected: "aprobación automática según la regla documentada" },
    ],
    hints: [
      { id: "h1", content: "El síntoma indica que el operador apunta al lado contrario." },
      { id: "h2", content: "La regla dice superiores, no menores ni iguales." },
      { id: "h3", content: "La condición esperada es Amount > 10000000." },
    ],
    relatedModuleIds: [5],
    relatedLabIds: ["LAB-005"],
    tags: ["debug", "condition", "edge case"],
  },
  {
    id: "IP-APP-001",
    slug: "ip-app-001-formula-filtro-productos",
    title: "Elegir fórmula correcta",
    description: "Selecciona una fórmula Power Fx conceptual para filtrar productos por categoría.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "starter",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 3", "Módulo 7"],
    learningObjectives: ["Reconocer Filter", "Evitar fórmulas sin condición"],
    scenario: {
      context: "Una galería debe mostrar solo productos de categoría Tecnología.",
      objective: "Elige la fórmula más adecuada.",
    },
    multiple: false,
    options: [
      { id: "filter", label: "Filter(Products, Category = \"Tecnologia\")", consequence: "Filtra por la condición esperada.", score: 1 },
      { id: "lookup", label: "LookUp(Products, Category = \"Tecnologia\")", consequence: "Devuelve un registro, no una tabla para galería.", score: 0.4 },
      { id: "sort", label: "Sort(Products, Category)", consequence: "Ordena, pero no filtra.", score: 0 },
      { id: "all", label: "Products", consequence: "Muestra todos los productos.", score: 0 },
    ],
    correctOptionIds: ["filter"],
    hints: [
      { id: "h1", content: "Una galería espera una tabla." },
      { id: "h2", content: "Necesitas conservar varios registros que cumplen una condición." },
      { id: "h3", content: "Filter devuelve una tabla filtrada." },
    ],
    relatedModuleIds: [3, 7],
    relatedLabIds: ["LAB-003"],
    tags: ["Power Fx", "Filter", "galeria"],
  },
  {
    id: "IP-APP-002",
    slug: "ip-app-002-navegacion-formulario",
    title: "Navegación y formulario",
    description: "Decide cómo abrir una pantalla de edición con el registro seleccionado.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 3"],
    learningObjectives: ["Conectar selección y formulario", "Distinguir navegación de edición"],
    scenario: {
      context: "Desde una galería de solicitudes, al seleccionar un registro debes abrir la pantalla de edición con ese registro.",
      objective: "Selecciona las decisiones correctas.",
    },
    multiple: true,
    options: [
      { id: "item-selected", label: "Form.Item = galSolicitudes.Selected", consequence: "El formulario recibe el registro seleccionado.", score: 1 },
      { id: "navigate-edit", label: "Navigate(scrEditar)", consequence: "La navegación muestra la pantalla de edición.", score: 1 },
      { id: "new-form", label: "NewForm(frmSolicitud)", consequence: "Crea registro nuevo; no edita el seleccionado.", score: 0 },
      { id: "edit-form", label: "EditForm(frmSolicitud)", consequence: "Pone el formulario en modo edición.", score: 1 },
    ],
    correctOptionIds: ["item-selected", "navigate-edit", "edit-form"],
    hints: [
      { id: "h1", content: "Navegar no basta; el formulario necesita saber qué registro editar." },
      { id: "h2", content: "NewForm y EditForm tienen intenciones opuestas." },
      { id: "h3", content: "Usa Selected como Item y EditForm antes o durante la navegación." },
    ],
    relatedModuleIds: [3],
    relatedLabIds: ["LAB-003"],
    tags: ["Navigate", "EditForm", "Item"],
  },
  {
    id: "IP-QRY-001",
    slug: "ip-qry-001-fetchxml-basico",
    title: "FetchXML básico",
    description: "Consulta cuentas ubicadas en Bogotá sobre un dataset local.",
    type: "query-playground",
    domain: "fetchxml",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 9"],
    learningObjectives: ["Usar entity, attribute y condition", "Leer resultados de FetchXML"],
    scenario: {
      context: "Necesitas obtener el nombre de las cuentas ubicadas en Bogotá.",
      objective: "Completa la consulta FetchXML y ejecútala sobre datos ficticios locales.",
    },
    dialect: "fetchxml",
    starter: "<fetch>\n  <entity name=\"account\">\n  </entity>\n</fetch>",
    expectedColumns: ["name"],
    expectedNames: ["Contoso Norte", "Litware Capital"],
    syntaxRef:
      "FetchXML es XML: cada columna que quieres leer se pide con <attribute name=\"...\" />, y cada filtro con <condition attribute=\"...\" operator=\"...\" value=\"...\" />. Ambos van dentro de <entity>. Ejemplo con otra entidad: <entity name=\"contact\"><attribute name=\"fullname\" /><condition attribute=\"statecode\" operator=\"eq\" value=\"0\" /></entity> devuelve el nombre de los contactos activos.",
    solutionQuery:
      "<fetch>\n  <entity name=\"account\">\n    <attribute name=\"name\" />\n    <condition attribute=\"city\" operator=\"eq\" value=\"Bogota\" />\n  </entity>\n</fetch>",
    hints: [
      { id: "h1", content: "La entidad debe ser account." },
      { id: "h2", content: "Agrega attribute name y una condición sobre city." },
      { id: "h3", content: "El operador esperado es eq con valor Bogota." },
    ],
    relatedModuleIds: [9],
    relatedLabIds: ["LAB-009"],
    tags: ["FetchXML", "query", "account"],
  },
  {
    id: "IP-QRY-002",
    slug: "ip-qry-002-odata-select-top",
    title: "OData select/filter/top",
    description: "Obtén nombre y revenue de las dos cuentas con mayor revenue.",
    type: "query-playground",
    domain: "odata",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 9", "Módulo 53"],
    learningObjectives: ["Combinar $select, $orderby y $top", "Validar resultado esperado"],
    scenario: {
      context: "Un reporte necesita mostrar las dos cuentas con mayor revenue, solo con nombre y revenue.",
      objective: "Escribe una consulta OData segura sobre el dataset local.",
    },
    dialect: "odata",
    starter: "/accounts?$select=name,revenue&$orderby=revenue desc&$top=2",
    expectedColumns: ["name", "revenue"],
    expectedNames: ["Litware Capital", "Fabrikam Andina"],
    syntaxRef:
      "OData añade parámetros después de ? en la URL del recurso: $select=col1,col2 elige columnas, $orderby=columna desc|asc ordena, $top=N limita cuántos registros vuelven. Se combinan con &. Ejemplo con otro recurso: /contacts?$select=fullname&$orderby=fullname asc&$top=5 trae los 5 primeros contactos por nombre.",
    solutionQuery: "/accounts?$select=name,revenue&$orderby=revenue desc&$top=2",
    hints: [
      { id: "h1", content: "Usa $select para limitar columnas." },
      { id: "h2", content: "Ordena revenue de mayor a menor antes de aplicar top." },
      { id: "h3", content: "La consulta debe incluir $orderby=revenue desc y $top=2." },
    ],
    relatedModuleIds: [9, 53],
    relatedLabIds: ["LAB-009", "LAB-054"],
    tags: ["OData", "$select", "$top", "$orderby"],
  },
  {
    id: "IP-TRB-001",
    slug: "ip-trb-001-flow-falla-null",
    title: "Flow falla por null",
    description: "Identifica cómo proteger un flujo cuando llega un monto nulo.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 7,
    prerequisites: ["Módulo 11"],
    learningObjectives: ["Detectar null", "Proteger condición antes de comparar"],
    scenario: {
      context: "Un flujo compara Amount > 10000000, pero algunas solicitudes llegan sin Amount.",
      objective: "Propón una protección antes de evaluar la condición.",
    },
    implementation: "Condition:\nAmount > 10000000",
    symptom: "El flujo falla cuando Amount viene null.",
    fixPrompt: "Escribe la corrección.",
    acceptableFixes: ["null", "empty", "coalesce", "validar", "condition previa", "si esta vacio", "isblank"],
    testCases: [
      { id: "null", input: "Amount = null", expected: "No falla; ruta de datos incompletos" },
      { id: "high", input: "Amount = 15000000", expected: "Solicita aprobación" },
    ],
    hints: [
      { id: "h1", content: "El operador numérico espera un valor comparable." },
      { id: "h2", content: "Valida nulos antes de comparar." },
      { id: "h3", content: "Usa condición previa, coalesce o rama de datos incompletos." },
    ],
    relatedModuleIds: [11],
    relatedLabIds: ["LAB-005"],
    tags: ["null", "debug", "Power Automate"],
  },
  {
    id: "IP-TRB-002",
    slug: "ip-trb-002-entorno-incorrecto",
    title: "Environment incorrecto",
    description: "Elige pasos seguros cuando el entorno activo no parece ser el esperado.",
    type: "multiple-decision",
    domain: "troubleshooting",
    level: "starter",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 16", "Módulo 19"],
    learningObjectives: ["Detener cambios en entorno dudoso", "Verificar URL, conexión y solución"],
    scenario: {
      context: "Ves una solución con el mismo nombre, pero la URL del entorno no coincide con el sandbox del proyecto.",
      objective: "Selecciona acciones seguras antes de modificar componentes.",
    },
    multiple: true,
    options: [
      { id: "stop", label: "Detener cambios hasta confirmar entorno", consequence: "Reduce riesgo de modificar producción o cliente equivocado.", score: 1 },
      { id: "check-url", label: "Verificar URL y environment id", consequence: "Confirma el contexto técnico real.", score: 1 },
      { id: "check-connection", label: "Revisar conexión activa en PAC/Power Apps", consequence: "Evita operar con credenciales apuntando a otro tenant.", score: 1 },
      { id: "change-anyway", label: "Modificar porque el nombre de solución coincide", consequence: "El nombre no garantiza que sea el entorno correcto.", score: 0 },
    ],
    correctOptionIds: ["stop", "check-url", "check-connection"],
    hints: [
      { id: "h1", content: "El nombre de solución no identifica de forma única el ambiente." },
      { id: "h2", content: "La URL y el environment id son señales más confiables." },
      { id: "h3", content: "Primero detener, confirmar y solo luego cambiar." },
    ],
    relatedModuleIds: [16, 19],
    relatedLabIds: ["LAB-019", "LAB-056"],
    tags: ["environment", "ALM", "seguridad"],
  },
  {
    id: "IP-DV-004",
    slug: "ip-dv-004-tabla-intermedia",
    title: "N:N vs tabla intermedia",
    description: "Decide cuándo una tabla intermedia aporta valor sobre una relación N:N simple.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 9"],
    learningObjectives: ["Reconocer atributos de relación", "Elegir tabla intermedia cuando hay datos propios"],
    scenario: {
      context: "Un curso puede tener muchos estudiantes y un estudiante muchos cursos. Debes guardar fecha de inscripción y nota final.",
      objective: "Elige el diseño adecuado.",
    },
    multiple: false,
    options: [
      { id: "nn-simple", label: "Relación N:N simple", consequence: "Relaciona registros, pero no guarda fecha ni nota de la inscripción.", score: 0.4 },
      { id: "intermediate", label: "Tabla intermedia Inscripción con lookups a Curso y Estudiante", consequence: "Permite atributos propios de la relación.", score: 1 },
      { id: "text", label: "Campo texto con estudiantes separados por coma", consequence: "Rompe integridad, seguridad y reporting.", score: 0 },
      { id: "duplicate", label: "Duplicar curso por estudiante", consequence: "Duplica datos maestros y dificulta mantenimiento.", score: 0 },
    ],
    correctOptionIds: ["intermediate"],
    hints: [
      { id: "h1", content: "Pregunta si la relación tiene datos propios." },
      { id: "h2", content: "Fecha y nota pertenecen a la inscripción, no al curso ni al estudiante aislado." },
      { id: "h3", content: "La tabla intermedia modela esos atributos." },
    ],
    relatedModuleIds: [9],
    relatedLabIds: ["LAB-009"],
    tags: ["N:N", "tabla intermedia", "modelo"],
  },
  {
    id: "IP-PA-004",
    slug: "ip-pa-004-retry-scope-try-catch",
    title: "Retry vs Scope/Try-Catch",
    description: "Escoge una estrategia conceptual de resiliencia para errores transitorios y funcionales.",
    type: "multiple-decision",
    domain: "power-automate",
    level: "advanced",
    estimatedMinutes: 7,
    prerequisites: ["Módulo 11"],
    learningObjectives: ["Distinguir retry técnico y compensación funcional", "Evitar duplicados por reintentos"],
    scenario: {
      context: "Un flujo falla a veces por 429, pero también puede fallar por datos inválidos.",
      objective: "Selecciona prácticas correctas de manejo de error.",
    },
    multiple: true,
    options: [
      { id: "retry-transient", label: "Usar retry controlado para 429/transitorios", consequence: "Adecuado para fallos temporales.", score: 1 },
      { id: "scope-catch", label: "Usar scopes Try/Catch para registrar y compensar", consequence: "Separa error técnico, logging y acción correctiva.", score: 1 },
      { id: "retry-invalid", label: "Reintentar datos inválidos indefinidamente", consequence: "No corrige la causa y consume capacidad.", score: 0 },
      { id: "idempotency", label: "Diseñar idempotencia antes de reintentar escrituras", consequence: "Evita duplicados cuando se repite una operación.", score: 1 },
    ],
    correctOptionIds: ["retry-transient", "scope-catch", "idempotency"],
    hints: [
      { id: "h1", content: "No todos los errores se arreglan intentando de nuevo." },
      { id: "h2", content: "Los reintentos necesitan idempotencia cuando escriben datos." },
      { id: "h3", content: "Combina retry para transitorios con Try/Catch y logging." },
    ],
    relatedModuleIds: [11],
    relatedLabIds: ["LAB-005"],
    tags: ["retry", "scope", "idempotencia"],
  },
  {
    id: "IP-APP-003",
    slug: "ip-app-003-delegation-awareness",
    title: "Delegation awareness",
    description: "Reconoce una fórmula con riesgo de delegación y elige alternativa más segura.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "advanced",
    estimatedMinutes: 7,
    prerequisites: ["Módulo 10", "Módulo 26"],
    learningObjectives: ["Detectar riesgo de delegación", "Preferir filtros delegables"],
    scenario: {
      context: "Una app debe buscar solicitudes por estado y fecha en una tabla grande de Dataverse.",
      objective: "Selecciona decisiones que reducen riesgo de resultados incompletos.",
    },
    multiple: true,
    options: [
      { id: "delegable-filter", label: "Filtrar por columnas delegables de Dataverse", consequence: "Permite que el servidor evalúe el filtro.", score: 1 },
      { id: "client-collect", label: "Traer todo a Collection y filtrar local", consequence: "No escala y puede truncar datos.", score: 0 },
      { id: "indexed", label: "Diseñar vistas/columnas adecuadas para la consulta", consequence: "Mejora mantenibilidad y rendimiento.", score: 1 },
      { id: "ignore-warning", label: "Ignorar advertencia de delegación si funciona con pocos datos", consequence: "Puede fallar en producción al crecer.", score: 0 },
    ],
    correctOptionIds: ["delegable-filter", "indexed"],
    hints: [
      { id: "h1", content: "Lo que funciona con 20 filas puede fallar con miles." },
      { id: "h2", content: "Busca que Dataverse ejecute el filtro, no el cliente." },
      { id: "h3", content: "Evita Collect masivo y atiende advertencias de delegación." },
    ],
    relatedModuleIds: [10, 26],
    relatedLabIds: ["LAB-003"],
    tags: ["delegation", "Power Fx", "performance"],
  },
];

export function getAllInteractivePractices(): InteractivePractice[] {
  return INTERACTIVE_PRACTICES;
}

export function getInteractivePracticeBySlug(slug: string): InteractivePractice | undefined {
  return INTERACTIVE_PRACTICES.find((practice) => practice.slug === slug);
}

export function getInteractivePracticesForModule(moduleId: number): InteractivePractice[] {
  return INTERACTIVE_PRACTICES.filter((practice) => practice.relatedModuleIds.includes(moduleId));
}

export function getInteractivePracticesForLab(displayId: string): InteractivePractice[] {
  return INTERACTIVE_PRACTICES.filter((practice) => practice.relatedLabIds.includes(displayId));
}

export function getInteractivePracticeSearchDocuments() {
  return INTERACTIVE_PRACTICES.map((practice) => ({
    id: `interactive-${practice.id}`,
    title: `${practice.id} · ${practice.title}`,
    levelId: "",
    moduleId: practice.relatedModuleIds[0] ?? 0,
    slug: practice.slug,
    type: "interactive-practice" as const,
    href: `/practica/${practice.slug}`,
    content: [
      practice.id,
      practice.title,
      practice.description,
      practice.domain,
      INTERACTIVE_DOMAIN_LABELS[practice.domain],
      practice.type,
      INTERACTIVE_TYPE_LABELS[practice.type],
      practice.learningObjectives.join(" "),
      practice.scenario.context,
      practice.scenario.objective,
      practice.tags.join(" "),
      practice.relatedLabIds.join(" "),
      practice.relatedModuleIds.map((id) => `modulo ${id}`).join(" "),
    ].join("\n").slice(0, 3000),
  }));
}

export function evaluateInteractivePractice(
  practice: InteractivePractice,
  answer: unknown,
  attemptNumber: number
): InteractiveEvaluationResult {
  if (practice.type === "multiple-decision") return evaluateDecision(practice, answer, attemptNumber);
  if (practice.type === "flow-builder") return evaluateFlow(practice, answer);
  if (practice.type === "query-playground") return evaluateQuery(practice, answer);
  return evaluateDebug(practice, answer, attemptNumber);
}

export function evaluateDecision(
  practice: MultipleDecisionPractice,
  answer: unknown,
  attemptNumber = 1
): InteractiveEvaluationResult {
  const selected = new Set(Array.isArray(answer) ? answer.filter((item): item is string => typeof item === "string") : []);
  const correct = new Set(practice.correctOptionIds);
  const selectedOptions = practice.options.filter((option) => selected.has(option.id));
  const correctHits = [...selected].filter((id) => correct.has(id)).length;
  const wrongHits = [...selected].filter((id) => !correct.has(id)).length;
  const allCorrect = correctHits === correct.size && wrongHits === 0 && selected.size === correct.size;
  const score = selectedOptions.length === 0
    ? 0
    : Math.max(0, Math.round((correctHits / correct.size - wrongHits * 0.35) * 100));
  const status = allCorrect ? "correct" : score >= 50 ? "partial" : "incorrect";
  return {
    status,
    score,
    feedback: progressiveFeedback(status, attemptNumber, practice),
    consequences: selectedOptions.map((option) => option.consequence),
  };
}

export function evaluateFlow(practice: FlowBuilderPractice, answer: unknown): InteractiveEvaluationResult {
  const order = Array.isArray(answer) ? answer.filter((item): item is string => typeof item === "string") : [];
  const hasTriggerFirst = order[0] === "trigger-row-added";
  const hasConditionBeforeApproval = order.indexOf("condition-amount-gt") > -1 && order.indexOf("condition-amount-gt") < order.indexOf("start-approval");
  const hasAutoApprove = order.includes("update-approved");
  const missing = practice.expectedBlockIds.filter((id) => !order.includes(id));
  const actualForAmount = (amount: number) => order.includes("condition-amount-gt") && amount > practice.threshold ? "approval-required" : "auto-approved";
  const testResults = practice.testCases.map((test) => {
    const actual = actualForAmount(test.amount);
    return { label: test.label, pass: actual === test.expected, expected: test.expected, actual };
  });
  const passCount = testResults.filter((test) => test.pass).length;
  const structureScore = [hasTriggerFirst, hasConditionBeforeApproval, hasAutoApprove, missing.length === 0].filter(Boolean).length;
  const score = Math.round(((structureScore / 4) * 50) + ((passCount / testResults.length) * 50));
  const status = score >= 90 ? "correct" : score >= 55 ? "partial" : "incorrect";
  return {
    status,
    score,
    feedback: status === "correct"
      ? "El flujo tiene trigger, condición y acciones en un orden defendible; los casos de prueba pasan."
      : status === "partial"
        ? "La idea va encaminada, pero revisa orden, condición o cobertura de casos."
        : "El flujo aún no demuestra la regla de negocio. Empieza por trigger, luego condición y después ramas.",
    consequences: missing.length > 0 ? [`Faltan bloques: ${missing.join(", ")}`] : ["Todos los bloques requeridos están presentes."],
    testResults,
  };
}

export function evaluateDebug(
  practice: DebugScenarioPractice,
  answer: unknown,
  attemptNumber = 1
): InteractiveEvaluationResult {
  const text = normalizeText(typeof answer === "string" ? answer : "");
  const hits = practice.acceptableFixes.filter((term) => text.includes(normalizeText(term))).length;
  const score = Math.min(100, Math.round((hits / Math.min(3, practice.acceptableFixes.length)) * 100));
  const status = score >= 70 ? "correct" : score >= 35 ? "partial" : "incorrect";
  return {
    status,
    score,
    feedback: progressiveFeedback(status, attemptNumber, practice),
    consequences: practice.testCases.map((test) => `${test.input}: ${test.expected}`),
    normalizedAnswer: text,
  };
}

export function evaluateQuery(practice: QueryPlaygroundPractice, answer: unknown): InteractiveEvaluationResult {
  const query = typeof answer === "string" ? answer.trim() : "";
  if (query.length > 1200) {
    return { status: "incorrect", score: 0, feedback: "La consulta excede el tamaño permitido para el playground.", consequences: [] };
  }
  return practice.dialect === "fetchxml" ? evaluateFetchXml(practice, query) : evaluateOData(practice, query);
}

export function evaluateFetchXml(practice: QueryPlaygroundPractice, query: string): InteractiveEvaluationResult {
  const lower = query.toLowerCase();
  if (/<script|<!doctype|<!entity|http:|https:/i.test(query)) {
    return { status: "incorrect", score: 0, feedback: "La consulta contiene tokens no permitidos. Este playground no ejecuta XML externo.", consequences: [] };
  }
  const entityMatch = /<entity\s+name=["']([^"']+)["']/i.exec(query);
  if (!entityMatch) return { status: "incorrect", score: 0, feedback: "Falta entity name.", consequences: [] };
  if (entityMatch[1] !== "account") return { status: "incorrect", score: 10, feedback: "La entidad permitida en este ejercicio es account.", consequences: [] };
  const selectedAttributes = [...query.matchAll(/<attribute\s+name=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((value): value is string => Boolean(value));
  const hasName = selectedAttributes.includes("name");
  const cityCondition = /<condition\s+attribute=["']city["']\s+operator=["']eq["']\s+value=["']bogot[aá]["']\s*\/?>/i.test(lower);
  const rows = PRACTICE_ACCOUNTS
    .filter((account) => cityCondition && normalizeCity(account.city) === "bogota")
    .map((account) => projectRow(account, hasName ? selectedAttributes : ["name"]));
  const score = (hasName ? 35 : 0) + (cityCondition ? 55 : 0) + (rows.length === practice.expectedNames.length ? 10 : 0);
  const status = score >= 90 ? "correct" : score >= 45 ? "partial" : "incorrect";
  return {
    status,
    score,
    feedback: status === "correct" ? "FetchXML válido: consulta account, selecciona name y filtra ciudad Bogotá." : "Revisa entity, attribute name y condition city eq Bogota.",
    consequences: [`Registros devueltos: ${rows.length}`],
    rows,
  };
}

export function evaluateOData(practice: QueryPlaygroundPractice, query: string): InteractiveEvaluationResult {
  if (!query.startsWith("/accounts")) {
    return { status: "incorrect", score: 0, feedback: "Solo se permite consultar /accounts en este piloto.", consequences: [] };
  }
  if (/[{}[\];]|https?:|script/i.test(query)) {
    return { status: "incorrect", score: 0, feedback: "La consulta contiene caracteres o tokens no permitidos.", consequences: [] };
  }
  const params = new URLSearchParams(query.split("?")[1] ?? "");
  const select = (params.get("$select") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const orderby = params.get("$orderby") ?? "";
  const top = Number(params.get("$top") ?? "0");
  const hasSelect = practice.expectedColumns.every((column) => select.includes(column));
  const hasOrder = /^revenue\s+desc$/i.test(orderby);
  const hasTop = top === 2;
  let rows = [...PRACTICE_ACCOUNTS];
  if (hasOrder) rows.sort((a, b) => b.revenue - a.revenue);
  if (hasTop) rows = rows.slice(0, top);
  const projected = rows.map((account) => projectRow(account, hasSelect ? select : ["name", "revenue"]));
  const expectedOrder = projected.map((row) => String(row.name));
  const score = (hasSelect ? 35 : 0) + (hasOrder ? 35 : 0) + (hasTop ? 20 : 0) + (arraysEqual(expectedOrder, practice.expectedNames) ? 10 : 0);
  const status = score >= 90 ? "correct" : score >= 45 ? "partial" : "incorrect";
  return {
    status,
    score,
    feedback: status === "correct" ? "OData válido: limita columnas, ordena revenue desc y toma dos registros." : "Revisa $select, $orderby=revenue desc y $top=2.",
    consequences: [`Registros devueltos: ${projected.length}`],
    rows: projected,
  };
}

export function calculateInteractiveMastery(args: {
  correct: boolean;
  attempts: number;
  hintsUsed: number;
  solutionRevealed?: boolean;
}): InteractivePracticeMastery {
  if (!args.correct) return args.attempts > 0 || args.hintsUsed > 0 ? "needs-review" : "not-started";
  if (args.solutionRevealed || args.attempts >= 4) return "needs-review";
  if (args.attempts <= 2 && args.hintsUsed === 0) return "proficient";
  return "learning";
}

export function getRecommendedInteractivePractice(
  records: Record<string, { mastery: InteractivePracticeMastery; lastActivityAt?: string }>,
  completedModules: string[] = []
): InteractivePractice | null {
  const needsReview = INTERACTIVE_PRACTICES.find((practice) => records[practice.id]?.mastery === "needs-review");
  if (needsReview) return needsReview;
  const inProgress = INTERACTIVE_PRACTICES.find((practice) => records[practice.id]?.mastery === "learning");
  if (inProgress) return inProgress;
  const completedNumbers = new Set(completedModules.map((id) => Number(id.split("-").pop())).filter(Number.isFinite));
  const byModule = INTERACTIVE_PRACTICES.find((practice) =>
    !records[practice.id] && practice.relatedModuleIds.some((moduleId) => completedNumbers.has(moduleId))
  );
  return byModule ?? INTERACTIVE_PRACTICES.find((practice) => !records[practice.id]) ?? INTERACTIVE_PRACTICES[0] ?? null;
}

export function validateInteractivePractices(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const practice of INTERACTIVE_PRACTICES) {
    if (!/^IP-(DV|PA|APP|QRY|TRB)-\d{3}$/.test(practice.id)) errors.push(`${practice.id}: id inválido`);
    if (ids.has(practice.id)) errors.push(`${practice.id}: id duplicado`);
    if (slugs.has(practice.slug)) errors.push(`${practice.id}: slug duplicado`);
    ids.add(practice.id);
    slugs.add(practice.slug);
    if (!INTERACTIVE_PRACTICE_TYPES.includes(practice.type)) errors.push(`${practice.id}: tipo inválido`);
    if (!INTERACTIVE_PRACTICE_DOMAINS.includes(practice.domain)) errors.push(`${practice.id}: dominio inválido`);
    if (!INTERACTIVE_PRACTICE_LEVELS.includes(practice.level)) errors.push(`${practice.id}: dificultad inválida`);
    if (practice.estimatedMinutes < 3 || practice.estimatedMinutes > 15) errors.push(`${practice.id}: duración fuera de rango`);
    if (practice.learningObjectives.length === 0) errors.push(`${practice.id}: sin objetivos`);
    if (practice.hints.length > 3) errors.push(`${practice.id}: más de 3 hints`);
    if (practice.relatedModuleIds.length === 0) errors.push(`${practice.id}: sin módulo relacionado`);
    if (practice.relatedLabIds.length === 0) errors.push(`${practice.id}: sin lab relacionado`);
    if (practice.type === "query-playground" && practice.dialect === "fetchxml" && !practice.starter.includes("<fetch")) errors.push(`${practice.id}: starter FetchXML inválido`);
    if (practice.type === "flow-builder" && practice.testCases.length < 2) errors.push(`${practice.id}: flow sin suficientes casos`);
  }
  if (INTERACTIVE_PRACTICES.length < 12 || INTERACTIVE_PRACTICES.length > 15) {
    errors.push(`El piloto debe tener 12 a 15 prácticas; tiene ${INTERACTIVE_PRACTICES.length}`);
  }
  return errors;
}

function progressiveFeedback(status: InteractiveEvaluationResult["status"], attemptNumber: number, practice: InteractivePractice): string {
  if (status === "correct") return "Correcto. La decisión es defendible y prepara el concepto para el lab relacionado.";
  if (status === "partial") return attemptNumber <= 1
    ? "Parcial. Hay parte del razonamiento correcto, pero falta cerrar una consecuencia importante."
    : `Parcial. ${practice.hints[1]?.content ?? "Revisa el criterio principal del escenario."}`;
  if (attemptNumber <= 1) return "Revisa el criterio central antes de buscar la respuesta.";
  if (attemptNumber === 2) return practice.hints[0]?.content ?? "Vuelve al objetivo y prueba otra vez.";
  return practice.hints[2]?.content ?? "La solución requiere aplicar la regla explícita del escenario.";
}

function normalizeText(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").trim();
}

function normalizeCity(value: string): string {
  return normalizeText(value).replace(/\s/g, "");
}

function projectRow(row: object, columns: string[]): Record<string, string | number | boolean | null> {
  const source = row as Record<string, string | number | boolean | null | undefined>;
  return Object.fromEntries(columns.filter((column) => column in source).map((column) => [column, source[column] ?? null]));
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function getFixtureSummary() {
  return {
    accounts: PRACTICE_ACCOUNTS.length,
    requests: PRACTICE_REQUESTS.length,
    products: PRACTICE_PRODUCTS.length,
  };
}

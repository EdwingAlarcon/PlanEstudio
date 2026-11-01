import { PRACTICE_ACCOUNTS } from "@/data/practice/accounts";
import { PRACTICE_PRODUCTS } from "@/data/practice/products";
import { PRACTICE_REQUESTS } from "@/data/practice/requests";

// Tope del banco de prácticas. Regla (PROPUESTA_FASES_APRENDER_HACIENDO.md): solo sube al aprobar una fase
// del rediseño, y por el número de prácticas que esa fase planea añadir — no por comodidad.
export const MIN_INTERACTIVE_PRACTICES = 12;
// 24 (pilotos 10/11/13) + 3 del Módulo 1 + 1 del Módulo 2 + 2 del Módulo 3 + 3 del Módulo 4 + 1 del Módulo 5 + 4 del Módulo 6 + 3 del Módulo 7 + 3 del Módulo 8 (Fase 2)
// + 3 por cada módulo de la Fase 3: Módulos 9, 12, 14, 15, 16 y 17 (18 en total).
export const MAX_INTERACTIVE_PRACTICES = 62;

export const INTERACTIVE_PRACTICE_TYPES = ["multiple-decision", "flow-builder", "query-playground", "debug-scenario"] as const;
export const INTERACTIVE_PRACTICE_DOMAINS = ["dataverse", "power-apps", "power-automate", "fetchxml", "odata", "troubleshooting", "javascript", "copilot-studio"] as const;
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
  javascript: "JavaScript / PCF",
  "copilot-studio": "Copilot Studio",
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
      { id: "one-many", label: "Cliente 1:N Pedido", consequence: "Cliente es el lado uno; Pedido guarda la referencia al cliente (una columna Lookup). Vista desde Pedido, es la misma relación leída como muchos-a-uno (N:1): no son dos relaciones distintas.", score: 1 },
      { id: "inverted", label: "Pedido 1:N Cliente", consequence: "Invierte los lados: diría que un pedido tiene muchos clientes y que el cliente guarda la referencia al pedido, pero cada pedido pertenece a un único cliente.", score: 0 },
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
    prerequisites: ["Módulo 2"],
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
    description: "Selecciona la fórmula Power Fx que filtra las solicitudes por una opción de una columna Choice.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "starter",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 3"],
    learningObjectives: ["Reconocer Filter", "Comparar una columna Choice con su enumeración", "Evitar fórmulas sin condición"],
    scenario: {
      context: "La galería galSolicitudes (propiedad Items) debe mostrar solo las solicitudes de la tabla 'Solicitudes TI' cuyo Estado es Nueva. Estado es una columna Choice local de esa tabla.",
      objective: "Elige la fórmula más adecuada.",
    },
    multiple: false,
    options: [
      { id: "filter", label: "Filter('Solicitudes TI', Estado = 'Estado (Solicitudes TI)'.Nueva)", consequence: "Devuelve una tabla con todas las solicitudes que cumplen la condición, y compara la columna Choice con su enumeración, como pide el Módulo 3.", score: 1 },
      { id: "text", label: "Filter('Solicitudes TI', Estado = \"Nueva\")", consequence: "Usa la función correcta, pero compara la columna Choice con el texto de la etiqueta: Power Apps marca error de tipos, porque la opción no es un texto.", score: 0 },
      { id: "lookup", label: "LookUp('Solicitudes TI', Estado = 'Estado (Solicitudes TI)'.Nueva)", consequence: "La condición es correcta, pero LookUp devuelve un solo registro (el primero que cumple), no una tabla para la galería.", score: 0.4 },
      { id: "sort", label: "Sort('Solicitudes TI', Estado)", consequence: "Ordena por Estado, pero no filtra: siguen apareciendo todas las solicitudes.", score: 0 },
    ],
    correctOptionIds: ["filter"],
    hints: [
      { id: "h1", content: "Una galería espera una tabla con varias filas." },
      { id: "h2", content: "Una columna Choice no se compara con el texto de su etiqueta, sino con su enumeración ('Estado (Solicitudes TI)'.Nueva)." },
      { id: "h3", content: "Filter devuelve una tabla filtrada; LookUp devuelve un solo registro." },
    ],
    relatedModuleIds: [3, 7],
    relatedLabIds: ["LAB-003"],
    tags: ["Power Fx", "Filter", "galeria"],
  },
  {
    id: "IP-APP-002",
    slug: "ip-app-002-navegacion-formulario",
    title: "Navegación y formulario",
    description: "Decide cómo abrir la pantalla de detalle con el registro seleccionado y cómo pasar a edición.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 3"],
    learningObjectives: ["Conectar selección y formulario", "Distinguir navegación de edición"],
    scenario: {
      context: "Como en el Módulo 3: al tocar una fila de galSolicitudes (en scrInicio) se abre la pantalla scrDetalle, cuyo formulario frmDetalle muestra esa solicitud en modo lectura; un botón Editar la pasa a modo edición.",
      objective: "Selecciona todas las decisiones correctas.",
    },
    multiple: true,
    options: [
      { id: "item-selected", label: "frmDetalle.Item = galSolicitudes.Selected", consequence: "El formulario recibe el registro que se tocó en la galería.", score: 1 },
      { id: "navigate-edit", label: "OnSelect de galSolicitudes: Navigate(scrDetalle, ScreenTransition.Cover)", consequence: "Al tocar una fila, la app muestra la pantalla de detalle; la galería recuerda la fila en Selected.", score: 1 },
      { id: "new-form", label: "OnSelect de galSolicitudes: NewForm(frmDetalle)", consequence: "NewForm prepara un registro nuevo y vacío; no muestra el seleccionado.", score: 0 },
      { id: "edit-form", label: "DefaultMode de frmDetalle = FormMode.View, y OnSelect del botón Editar: EditForm(frmDetalle)", consequence: "El detalle abre en solo lectura y pasa a edición solo cuando el usuario lo pide, como en el Módulo 3.", score: 1 },
    ],
    correctOptionIds: ["item-selected", "navigate-edit", "edit-form"],
    hints: [
      { id: "h1", content: "Navegar no basta; el formulario necesita saber qué registro mostrar." },
      { id: "h2", content: "NewForm y EditForm tienen intenciones opuestas: uno crea un registro nuevo, el otro edita el que ya está en el formulario." },
      { id: "h3", content: "Usa Selected como Item, abre el detalle en FormMode.View y deja EditForm para el botón Editar." },
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
  {
    id: "IP-APP-004",
    slug: "ip-app-004-tipo-de-property-correcto",
    title: "Elegir el tipo de Input/Output Property",
    description: "Decide qué tipo de dato usar para cada propiedad de un componente Canvas.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 10"],
    learningObjectives: ["Elegir el tipo correcto de Input Property según el dato", "Distinguir cuándo una propiedad debe ser de salida (Output/Custom) en vez de entrada"],
    scenario: {
      context: "Estás diseñando el contrato de `cmpStatCard` (una tarjeta de estadística) y de `cmpSearchBox` (un buscador con debounce) para una Component Library.",
      objective: "Selecciona las decisiones de diseño correctas para las propiedades de ambos componentes.",
    },
    multiple: true,
    options: [
      { id: "valor-numero", label: "`cmpStatCard.Valor` como Input Property de tipo Número", consequence: "El padre necesita pasar un número calculado (ej. CountRows) — es exactamente lo que una Input Property de tipo Número resuelve.", score: 1 },
      { id: "valor-texto", label: "`cmpStatCard.Valor` como Input Property de tipo Texto, formateando el número afuera", consequence: "Funciona, pero rompe el propósito del componente: obliga a cada app consumidora a duplicar el formateo en vez de centralizarlo.", score: 0 },
      { id: "busqueda-output", label: "`cmpSearchBox.TextoBusqueda` como Output/Custom Property", consequence: "El componente calcula el texto internamente (con su propio debounce) y lo expone hacia afuera — ese es exactamente el caso de uso de una Output Property.", score: 1 },
      { id: "busqueda-input", label: "`cmpSearchBox.TextoBusqueda` como Input Property que la app padre actualiza", consequence: "Invierte el flujo de datos: el dato nace dentro del componente (lo que el usuario escribe), no afuera — una Input Property no puede ser modificada por el propio componente.", score: 0 },
    ],
    correctOptionIds: ["valor-numero", "busqueda-output"],
    hints: [
      { id: "h1", content: "Pregúntate de dónde nace el dato: si nace afuera (lo decide la app padre), es Input; si nace adentro (lo calcula o captura el propio componente), es Output." },
      { id: "h2", content: "Una Input Property es de solo lectura dentro del componente — no puede ser la fuente de un valor que el propio componente calcula." },
      { id: "h3", content: "`cmpStatCard.Valor` lo decide quien usa el componente (Input, tipo Número); `cmpSearchBox.TextoBusqueda` lo decide el propio componente mientras el usuario escribe (Output)." },
    ],
    relatedModuleIds: [10],
    relatedLabIds: ["LAB-003"],
    tags: ["component", "input-property", "output-property"],
  },
  {
    id: "IP-APP-005",
    slug: "ip-app-005-diagnosticar-componente-desactualizado",
    title: "Diagnosticar: la app sigue mostrando el componente anterior",
    description: "A partir de un síntoma y evidencia de publicación, identifica la causa antes de ver la solución.",
    type: "debug-scenario",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 10"],
    learningObjectives: ["Distinguir publicar una librería de actualizarla en cada app consumidora", "Reconocer el Component Lifecycle como causa, no como detalle técnico menor"],
    scenario: {
      context: "Publicaste una nueva versión de `SIT Component Library` con un cambio de color en `cmpHeader`. Confirmaste en el editor de la librería que el cambio se guardó y se publicó sin errores. Sin embargo, la aplicación consumidora sigue mostrando la versión anterior del componente después de publicar la actualización.",
      objective: "Antes de mirar la solución, formula qué revisarías primero y por qué — no asumas que la publicación falló.",
    },
    implementation: "Component Library \"SIT Component Library\" v1.1 → Guardar → Publicar (sin errores)\nApp consumidora: sigue usando cmpHeader visualmente idéntico a v1.0",
    symptom: "La librería se publicó sin errores, pero la app que la consume sigue mostrando la versión anterior del componente.",
    fixPrompt: "¿Qué acción falta para que la app consumidora refleje el cambio?",
    acceptableFixes: ["aceptar la actualizacion en la app", "actualizar el componente desde insertar", "insertar componentes icono de actualizacion", "aceptar update manualmente en cada app"],
    testCases: [
      { id: "solo-publicar", input: "Librería publicada, app no actualizada manualmente", expected: "la app sigue viendo la versión anterior" },
      { id: "publicar-y-aceptar", input: "Librería publicada + Insertar > Componentes > aceptar actualización en la app", expected: "la app refleja el cambio" },
    ],
    hints: [
      { id: "h1", content: "La librería sí se publicó correctamente — el síntoma no está en la librería, está en el lado de la app que la consume." },
      { id: "h2", content: "Publicar una librería no empuja el cambio automáticamente a cada app que la usa — es una acción deliberada, no un efecto secundario del publish." },
      { id: "h3", content: "En la app, ve a Insertar → Componentes y busca el ícono de actualización para aceptar la nueva versión." },
    ],
    relatedModuleIds: [10],
    relatedLabIds: ["LAB-003"],
    tags: ["component-library", "troubleshooting", "lifecycle"],
  },
  {
    id: "IP-APP-006",
    slug: "ip-app-006-transferir-input-tabla",
    title: "Transferir: el componente ahora recibe una tabla, no un texto",
    description: "El contrato del componente cambia de un valor simple a una colección — decide qué implica ese cambio.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "advanced",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 10"],
    learningObjectives: ["Reconocer que cambiar el tipo de una Input Property cambia el contrato del componente, no solo su valor", "Anticipar qué se rompe en la app consumidora al cambiar Texto por Tabla"],
    scenario: {
      context: "`cmpListaTareas` hoy tiene una Input Property `TareaActual` (Texto) que muestra una sola tarea. El requerimiento cambió: ahora debe mostrar todas las tareas pendientes de un usuario, recibidas como una tabla de registros (`Filter(colTareas, Estado = \"Pendiente\")`), no un texto único.",
      objective: "Selecciona qué cambios son necesarios en el componente y en la app consumidora para este nuevo contrato.",
    },
    multiple: true,
    options: [
      { id: "cambiar-tipo-tabla", label: "Cambiar `TareaActual` de tipo Texto a tipo Tabla en el editor de propiedades del componente", consequence: "Es el cambio central: el tipo de la Input Property determina qué puede recibir la app padre.", score: 1 },
      { id: "reescribir-binding-parent", label: "Actualizar el binding en la app consumidora de un texto fijo a `Filter(colTareas, Estado = \"Pendiente\")`", consequence: "La app padre ahora debe entregar una tabla, no una cadena de texto — el binding anterior ya no es válido.", score: 1 },
      { id: "gallery-dentro", label: "Dentro del componente, usar una Gallery cuyo Items sea la propiedad de entrada para recorrer la tabla", consequence: "Una Input Property de tipo Tabla se consume igual que cualquier otra fuente de datos: con Gallery/ForAll.", score: 1 },
      { id: "mantener-texto", label: "Dejar `TareaActual` como Texto y concatenar las tareas con `Concat()` antes de pasarlas", consequence: "Evita tocar el tipo de la propiedad, pero pierde la posibilidad de que el componente itere, filtre u ordene tarea por tarea — solo sirve para mostrar texto plano.", score: 0 },
    ],
    correctOptionIds: ["cambiar-tipo-tabla", "reescribir-binding-parent", "gallery-dentro"],
    hints: [
      { id: "h1", content: "El tipo de una Input Property no es un detalle interno — es parte del contrato que ve la app consumidora." },
      { id: "h2", content: "Si el padre antes pasaba un texto y ahora debe pasar el resultado de un Filter(), su fórmula de binding tiene que cambiar también, no solo el componente." },
      { id: "h3", content: "Dentro del componente, una propiedad de tipo Tabla se recorre con Gallery/ForAll — igual que cualquier colección que ya usaste en este módulo (`colSolicitudes`)." },
    ],
    relatedModuleIds: [10],
    relatedLabIds: ["LAB-003"],
    tags: ["transferencia", "input-property", "table"],
  },
  {
    id: "IP-DV-005",
    slug: "ip-dv-005-elegir-piezas-para-un-caso",
    title: "Elegir las piezas de Power Platform para un caso",
    description: "Decide qué herramienta resuelve cada necesidad de un negocio antes de construir nada.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "starter",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 1"],
    learningObjectives: ["Asignar a cada necesidad de un negocio la pieza de Power Platform que la resuelve", "Descartar piezas que no resuelven ninguna necesidad del enunciado"],
    scenario: {
      context: "Una clínica veterinaria lleva sus citas en una hoja de Excel compartida. La recepcionista duplica citas sin querer, los recordatorios a los dueños se mandan a mano y la directora quiere ver cuántas citas hay por semana. Nadie en la clínica programa.",
      objective: "Selecciona las piezas que cubren las necesidades del caso, sin añadir ninguna que no haga falta.",
    },
    multiple: true,
    options: [
      { id: "tabla-citas", label: "Dataverse: una tabla Citas como única fuente de los datos", consequence: "Resuelve los duplicados de raíz: hay un solo lugar donde vive cada cita y todas las demás piezas leen de él.", score: 1 },
      { id: "app-recepcion", label: "Power Apps Canvas: una app para que la recepcionista registre y consulte citas", consequence: "Le da una pantalla simple sobre la tabla Citas, con validaciones, en vez de editar una hoja compartida.", score: 1 },
      { id: "flujo-recordatorio", label: "Power Automate: un flujo que envía el recordatorio al dueño cuando se acerca la cita", consequence: "Reemplaza el envío manual de recordatorios con una regla que se ejecuta sola.", score: 1 },
      { id: "reporte-semanal", label: "Power BI: un reporte de citas por semana para la directora", consequence: "Es la pieza pensada para ver totales y tendencias sin tocar los datos.", score: 1 },
      { id: "portal-publico", label: "Power Pages: un sitio web público para la clínica", consequence: "Nadie fuera de la clínica necesita entrar al sistema en este caso: sumaría complejidad sin resolver ninguna necesidad del enunciado.", score: 0 },
      { id: "excel-en-sharepoint", label: "Dejar el Excel y moverlo a una biblioteca de SharePoint", consequence: "No evita duplicados ni automatiza recordatorios: el problema original sigue igual, solo cambia de lugar.", score: 0 },
    ],
    correctOptionIds: ["tabla-citas", "app-recepcion", "flujo-recordatorio", "reporte-semanal"],
    hints: [
      { id: "h1", content: "Lee el caso como una lista de dolores: duplicados, recordatorios manuales y ver totales. Cada dolor debería tener una pieza responsable." },
      { id: "h2", content: "Datos en un solo lugar (Dataverse), una pantalla para capturarlos (Power Apps), una regla que actúa sola (Power Automate) y una vista para decidir (Power BI)." },
      { id: "h3", content: "Si una opción no responde a ninguna frase del enunciado (nadie externo entra, el Excel no se arregla moviéndolo), no es parte de la solución." },
    ],
    relatedModuleIds: [1],
    relatedLabIds: ["LAB-002"],
    tags: ["ecosistema", "dataverse", "power-apps", "power-automate", "power-bi"],
  },
  {
    id: "IP-TRB-003",
    slug: "ip-trb-003-ambiente-equivocado",
    title: "Diagnosticar: lo que creaste no aparece para tu compañera",
    description: "A partir de un síntoma, identifica en qué ambiente estabas trabajando antes de ver la solución.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "starter",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 1"],
    learningObjectives: ["Reconocer que cada ambiente es un espacio aislado con sus propios recursos", "Saber dónde se ve y se cambia el ambiente activo en make.powerapps.com"],
    scenario: {
      context: "Creaste una tabla `Citas` y una app de prueba en make.powerapps.com. Tu compañera abre el mismo sitio, entra con su cuenta de la misma organización y no ve ni la tabla ni la app. Arriba a la derecha tú ves el ambiente \"Contoso (default)\"; ella ve \"DEV-Ana\".",
      objective: "Antes de mirar la solución, di qué pasó y dónde deberías haber trabajado — no asumas que algo se borró.",
    },
    implementation: "Selector de ambiente (esquina superior derecha de make.powerapps.com)\nTú: Contoso (default) → tabla Citas y app de prueba\nCompañera: DEV-Ana → no ve nada de lo tuyo",
    symptom: "Lo que construiste existe, pero tu compañera no lo ve aunque ambas están en la misma organización.",
    fixPrompt: "¿Qué hay que cambiar para trabajar bien? Menciona en qué ambiente y dónde se cambia.",
    acceptableFixes: ["ambiente developer", "ambiente propio", "propio", "default", "selector", "cambiar de ambiente"],
    testCases: [
      { id: "sigue-en-default", input: "Se sigue trabajando en el ambiente default", expected: "los recursos quedan mezclados con los de toda la organización y nadie más los ve en su ambiente" },
      { id: "ambiente-propio", input: "Se cambia el selector a un ambiente Developer propio y se crea ahí la tabla", expected: "los recursos viven en un espacio aislado y controlado por quien los creó" },
    ],
    hints: [
      { id: "h1", content: "Nada se borró: cada ambiente es un espacio aislado y lo que creas en uno no aparece en otro." },
      { id: "h2", content: "Fíjate en el nombre del ambiente que cada una tiene activo arriba a la derecha: no es el mismo." },
      { id: "h3", content: "Se trabaja en un ambiente Developer propio, no en el default: cambia el ambiente con el selector de arriba a la derecha y vuelve a crear la tabla ahí." },
    ],
    relatedModuleIds: [1],
    relatedLabIds: ["LAB-002"],
    tags: ["ambiente", "troubleshooting", "tenant"],
  },
  {
    id: "IP-DV-006",
    slug: "ip-dv-006-transferir-reserva-externa",
    title: "Transferir: ahora los dueños reservan por su cuenta",
    description: "El requisito cambia de quién entra al sistema — decide qué cambia y qué se conserva.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 1"],
    learningObjectives: ["Distinguir un cambio de acceso (quién entra) de un cambio de datos", "Reconocer cuándo hace falta una pieza para usuarios externos"],
    scenario: {
      context: "La clínica veterinaria del caso anterior tiene ya su tabla Citas y la app de la recepcionista. Ahora la directora quiere que los dueños de las mascotas reserven su cita desde un sitio web, sin llamar. Los dueños no son empleados y no tienen cuenta de la organización. La recepcionista seguirá usando su app. Dos piezas que te sirven aquí, por si aún no las viste: Power Pages es el producto de Power Platform para crear sitios web que usan personas de fuera de la organización, con datos de Dataverse. En un sitio de Power Pages el acceso a los registros de Dataverse está cerrado por defecto, y los permisos de tabla (table permissions) son las reglas que dicen qué registros puede ver o cambiar cada visitante, por ejemplo, solo los relacionados con él.",
      objective: "Selecciona qué se agrega o se define y qué se conserva para este nuevo requisito.",
    },
    multiple: true,
    options: [
      { id: "conservar-tabla", label: "Conservar la tabla Citas en Dataverse como única fuente de datos", consequence: "El cambio es de acceso, no de datos: la recepcionista y los dueños deben ver la misma verdad.", score: 1 },
      { id: "agregar-pages", label: "Agregar Power Pages para que los dueños (usuarios externos) reserven desde un sitio web", consequence: "Power Pages es la pieza pensada para personas ajenas a la organización que usan datos de Dataverse.", score: 1 },
      { id: "permisos-tabla", label: "Definir permisos de tabla para que cada dueño vea solo sus propias citas", consequence: "Sin permisos de tabla, el sitio no deja ver ningún registro; con un permiso demasiado amplio (acceso global) dejaría ver todas las citas. Hay que decidir quién ve qué.", score: 1 },
      { id: "canvas-a-externos", label: "Compartir la app Canvas de la recepcionista con los dueños", consequence: "Esa app es para usuarios internos con licencia: compartirla con externos no es el camino previsto y expondría pantallas internas.", score: 0 },
      { id: "rehacer-todo", label: "Reconstruir todo desde cero con otra base de datos", consequence: "Innecesario: lo que cambió es quién entra, no cómo se guardan las citas.", score: 0 },
    ],
    correctOptionIds: ["conservar-tabla", "agregar-pages", "permisos-tabla"],
    hints: [
      { id: "h1", content: "Pregúntate qué cambió realmente: ¿la forma de guardar las citas o quién necesita entrar a verlas?" },
      { id: "h2", content: "Las personas fuera de la organización no usan las apps internas; para ellas existe una pieza distinta, descrita al final del contexto de este caso (si hiciste el Suplemento 1B del Módulo 1, ahí se amplía)." },
      { id: "h3", content: "Se conserva la tabla, se agrega Power Pages para los externos y se definen permisos de tabla para que cada dueño vea solo lo suyo." },
    ],
    relatedModuleIds: [1],
    relatedLabIds: ["LAB-002"],
    tags: ["transferencia", "power-pages", "usuarios-externos"],
  },
  {
    id: "IP-DV-007",
    slug: "ip-dv-007-transferir-categorias-multiples",
    title: "Transferir: una solicitud con varias categorías",
    description: "El requisito cambia de una categoría por solicitud a varias — decide qué cambia en la relación.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 2"],
    learningObjectives: ["Reconocer cuándo una relación de uno a muchos ya no alcanza y hace falta una de muchos a muchos", "Anticipar qué hay que conservar al cambiar un modelo que ya tiene datos"],
    scenario: {
      context: "En el modelo de Solicitudes TI, cada solicitud apunta a una sola Categoría Detallada (relación de uno a muchos). Soporte detecta que un mismo problema a veces toca varias categorías a la vez: una falla de red que además necesita un acceso nuevo. Ahora una solicitud puede tener varias categorías, y cada categoría sigue teniendo muchas solicitudes. Ya hay 200 solicitudes con su categoría asignada.",
      objective: "Selecciona los cambios correctos para soportar el nuevo requisito sin perder lo que ya existe.",
    },
    multiple: true,
    options: [
      { id: "cambiar-a-muchos-a-muchos", label: "Reemplazar la relación de uno a muchos por una relación de muchos a muchos entre Solicitud TI y Categoría Detallada", consequence: "Es el cambio central: ahora ambos lados tienen \"muchos\", y eso es exactamente lo que modela una relación de muchos a muchos.", score: 1 },
      { id: "migrar-categorias", label: "Copiar las 200 categorías ya asignadas a la nueva relación antes de retirar el Lookup anterior", consequence: "Evita perder el historial: si se retira primero el Lookup, las solicitudes existentes quedan sin categoría.", score: 1 },
      { id: "mostrar-subgrid", label: "Mostrar las categorías de cada solicitud en el formulario con una subcuadrícula de la relación", consequence: "Con una relación de muchos a muchos ya no hay un solo valor que mostrar; se ve la lista de categorías relacionadas.", score: 1 },
      { id: "segundo-lookup", label: "Agregar un segundo Lookup \"Categoría 2\" en la solicitud", consequence: "Parece rápido, pero no escala: ¿y cuando haya una tercera categoría? Cada nuevo caso obligaría a cambiar la tabla.", score: 0 },
      { id: "duplicar-solicitud", label: "Duplicar la solicitud una vez por cada categoría", consequence: "Rompe los conteos y la trazabilidad: un solo problema aparecería como varias solicitudes.", score: 0 },
    ],
    correctOptionIds: ["cambiar-a-muchos-a-muchos", "migrar-categorias", "mostrar-subgrid"],
    hints: [
      { id: "h1", content: "Pregúntate cuántas categorías puede tener una solicitud y cuántas solicitudes puede tener una categoría: si ambas respuestas son \"muchas\", ¿qué tipo de relación es?" },
      { id: "h2", content: "Cambiar el modelo no debe borrar lo que ya existe: piensa qué pasa con las 200 solicitudes que ya tienen categoría." },
      { id: "h3", content: "Se pasa a una relación de muchos a muchos, se copian las categorías existentes a la nueva relación y el formulario muestra la lista con una subcuadrícula." },
    ],
    relatedModuleIds: [2],
    relatedLabIds: ["LAB-002"],
    tags: ["transferencia", "relaciones", "muchos-a-muchos"],
  },
  {
    id: "IP-APP-007",
    slug: "ip-app-007-formulario-no-guarda",
    title: "Diagnosticar: el formulario \"guardó\" pero el registro no aparece",
    description: "A partir de un síntoma exacto, identifica por qué la app cambió de pantalla sin guardar nada.",
    type: "debug-scenario",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 3"],
    learningObjectives: ["Entender que SubmitForm no espera a saber si el guardado funcionó", "Usar las propiedades del Form para navegar solo cuando el guardado tuvo éxito"],
    scenario: {
      context: "Armaste el formulario de creación del módulo. El botón Guardar tiene este OnSelect: `SubmitForm(frmNueva); Navigate(scrInicio, ScreenTransition.UnCover)`. Un usuario deja vacía la columna Categoría (requerida en Dataverse) y pulsa Guardar. La app vuelve a la lista sin mostrar ningún error, y el registro no aparece en la Gallery.",
      objective: "Antes de mirar la solución, di por qué la app cambió de pantalla aunque no se guardó nada y cómo corregirlo.",
    },
    implementation: "Botón Guardar → OnSelect:\nSubmitForm(frmNueva);\nNavigate(scrInicio, ScreenTransition.UnCover)\nColumna Categoría: requerida en Dataverse; el usuario la deja vacía",
    symptom: "La app vuelve a la lista como si hubiera guardado, pero el registro no existe y no se mostró ningún error.",
    fixPrompt: "¿Qué hay que cambiar para navegar solo si el guardado funcionó y avisar si falló?",
    acceptableFixes: ["onsuccess", "onfailure", "frmnueva.error", "notify", "solo si guardo", "requerido"],
    testCases: [
      { id: "navega-sin-esperar", input: "Navigate se ejecuta justo después de SubmitForm", expected: "la app cambia de pantalla aunque el guardado haya fallado" },
      { id: "navega-en-onsuccess", input: "Navigate se mueve a OnSuccess del Form y se avisa con Notify si falla", expected: "solo se cambia de pantalla cuando el registro se guardó" },
    ],
    hints: [
      { id: "h1", content: "SubmitForm envía el guardado, pero no espera a saber si funcionó: la línea siguiente se ejecuta de inmediato." },
      { id: "h2", content: "El Form tiene dos propiedades pensadas para esto: una que se ejecuta cuando el guardado tiene éxito y otra cuando falla." },
      { id: "h3", content: "Mueve el Navigate a la propiedad OnSuccess del Form y avisa con OnFailure o con Notify usando frmNueva.Error; así solo cambias de pantalla si se guardó." },
    ],
    relatedModuleIds: [3],
    relatedLabIds: ["LAB-003"],
    tags: ["troubleshooting", "submitform", "onsuccess"],
  },
  {
    id: "IP-APP-008",
    slug: "ip-app-008-transferir-solo-lo-asignado",
    title: "Transferir: cada técnico ve solo lo suyo",
    description: "El requisito cambia de mostrar todo a mostrar solo lo asignado — decide qué cambia en la app y en los datos.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 3"],
    learningObjectives: ["Distinguir filtrar datos de ocultar filas", "Reconocer que el filtro de la app no sustituye la seguridad de Dataverse"],
    scenario: {
      context: "Tu app de solicitudes muestra todas las solicitudes en una Gallery con un buscador. Ahora los técnicos de soporte la usarán y cada uno debe ver solo las solicitudes asignadas a él, con un contador \"Mis pendientes: N\" arriba. La tabla Solicitud TI tiene un Lookup \"Asignado a\" hacia Usuario.",
      objective: "Selecciona los cambios correctos para este nuevo requisito.",
    },
    multiple: true,
    options: [
      { id: "filtrar-items", label: "Cambiar `Items` de la Gallery para que filtre las solicitudes asignadas al usuario actual (con `User()`)", consequence: "Es el cambio central: el filtro decide qué registros se traen y se muestran, y el buscador puede seguir trabajando sobre esa lista.", score: 1 },
      { id: "contador-sobre-galeria", label: "Hacer que el contador cuente las filas de la Gallery ya filtrada (por ejemplo `CountRows(galSolicitudes.AllItems)`)", consequence: "Así el contador y la lista siempre coinciden; contar la tabla completa daría un número que no corresponde a lo que ve el técnico.", score: 1 },
      { id: "rol-seguridad", label: "Pedir que un rol de seguridad de Dataverse limite qué solicitudes puede leer cada técnico", consequence: "El filtro de la app mejora la experiencia, pero no es seguridad: la protección real de los datos vive en Dataverse.", score: 1 },
      { id: "ocultar-filas", label: "Dejar la Gallery como está y poner `Visible = false` en las filas que no son del técnico", consequence: "Ocultar no filtra: los datos de los demás siguen cargados en la app y el contador seguiría contándolos.", score: 0 },
      { id: "app-por-tecnico", label: "Crear una app distinta por cada técnico", consequence: "No escala: cada técnico nuevo obligaría a duplicar y mantener otra app.", score: 0 },
    ],
    correctOptionIds: ["filtrar-items", "contador-sobre-galeria", "rol-seguridad"],
    hints: [
      { id: "h1", content: "Pregúntate si el requisito pide mostrar menos filas o traer menos datos: no es lo mismo ocultar que filtrar." },
      { id: "h2", content: "El contador debe contar lo que el técnico ve, y la seguridad real de los datos no puede depender solo de lo que la app decida mostrar." },
      { id: "h3", content: "Se filtra `Items` por el usuario actual, el contador cuenta la Gallery filtrada y un rol de Dataverse protege los datos de verdad." },
    ],
    relatedModuleIds: [3],
    relatedLabIds: ["LAB-003"],
    tags: ["transferencia", "filter", "user", "seguridad"],
  },
  {
    id: "IP-APP-009",
    slug: "ip-app-009-model-driven-o-canvas",
    title: "Elegir Model-Driven o Canvas según el caso",
    description: "Decide qué tipo de app encaja con cada necesidad de una empresa.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "starter",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 4"],
    learningObjectives: ["Reconocer cuándo una Model-Driven aprovecha el modelo de datos mejor que una Canvas", "Reconocer cuándo una Canvas da el control de pantalla que la necesidad exige"],
    scenario: {
      context: "Una empresa necesita dos herramientas. La primera es para que 15 gestores trabajen todo el día sobre clientes, oportunidades y cotizaciones relacionadas, con muchas vistas, filtros y un dashboard. La segunda es para que técnicos de campo registren una visita desde el celular, con foto y firma, en una pantalla pensada para el dedo.",
      objective: "Selecciona el tipo de app que encaja con cada herramienta.",
    },
    multiple: true,
    options: [
      { id: "md-gestores", label: "Model-Driven para la herramienta de los gestores (datos relacionados, vistas y dashboard)", consequence: "La app se genera a partir del modelo de datos: lista, formulario, relaciones y dashboard salen casi sin dibujar pantallas.", score: 1 },
      { id: "canvas-campo", label: "Canvas para la app de los técnicos de campo (foto y firma desde el celular)", consequence: "Canvas permite diseñar cada pantalla a medida para el celular, con control total de la captura.", score: 1 },
      { id: "canvas-gestores", label: "Canvas para la herramienta de los gestores, dibujando cada pantalla", consequence: "Funciona, pero repites a mano lo que Model-Driven ya te da armado, y cada vista nueva cuesta trabajo extra.", score: 0 },
      { id: "md-campo", label: "Model-Driven para la app de campo, porque también es una app", consequence: "Su diseño es genérico y tienes poco control de la pantalla de captura que los técnicos necesitan en el celular.", score: 0 },
    ],
    correctOptionIds: ["md-gestores", "canvas-campo"],
    hints: [
      { id: "h1", content: "Pregúntate cuánto control necesitas sobre cada pantalla: ¿lo que importa es el modelo de datos o el diseño de la captura?" },
      { id: "h2", content: "Quien trabaja todo el día sobre muchos registros relacionados necesita lista, filtros y dashboard; quien captura en el celular necesita una pantalla pensada para eso." },
      { id: "h3", content: "Gestores con datos relacionados: Model-Driven. Técnicos en el celular con foto y firma: Canvas." },
    ],
    relatedModuleIds: [4],
    relatedLabIds: ["LAB-004"],
    tags: ["model-driven", "canvas", "eleccion"],
  },
  {
    id: "IP-TRB-004",
    slug: "ip-trb-004-app-no-visible-para-companero",
    title: "Diagnosticar: la app está publicada pero mi compañero no la ve",
    description: "A partir de un síntoma exacto, identifica qué le falta a la otra persona para usar la app.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "starter",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 4"],
    learningObjectives: ["Entender que publicar una app no basta para que otra persona la use", "Saber dónde se asigna un rol de seguridad y cómo se comparte una app"],
    scenario: {
      context: "Publicaste tu Model-Driven App \"Gestión Solicitudes TI\" y a ti te funciona. Tu compañero Luis, de la misma organización, abre make.powerapps.com y no ve la app; con el enlace directo recibe un mensaje de que no tiene acceso. Tú eres la única persona con un rol de seguridad en el ambiente.",
      objective: "Antes de mirar la solución, di qué falta y dónde se configura — no asumas que la publicación falló.",
    },
    implementation: "App: Gestión Solicitudes TI (publicada)\nTú: rol System Administrator\nLuis: sin rol de seguridad asignado, y la app no está compartida con él",
    symptom: "La app funciona para quien la creó, pero otra persona de la misma organización no la ve o recibe un mensaje de falta de acceso.",
    fixPrompt: "¿Qué dos cosas hay que hacer para que Luis pueda usarla y dónde se hacen?",
    acceptableFixes: ["rol de seguridad", "security role", "rol", "asignar", "manage roles", "compartir"],
    testCases: [
      { id: "solo-publicada", input: "La app está publicada pero Luis no tiene rol ni acceso compartido", expected: "Luis no ve la app o recibe un mensaje de falta de acceso" },
      { id: "rol-y-compartida", input: "Se asigna un rol de seguridad a Luis y se comparte la app con él", expected: "Luis puede abrir la app y ver los datos permitidos por su rol" },
    ],
    hints: [
      { id: "h1", content: "La app funciona para ti, así que el problema no está en la app sino en lo que tiene —o no tiene— la otra persona." },
      { id: "h2", content: "Para usar una Model-Driven, una persona necesita permisos sobre las tablas (un rol) y que la app esté compartida con ella." },
      { id: "h3", content: "Asigna un rol de seguridad a Luis (Settings > Security > Users > Manage Roles) y comparte la app con él." },
    ],
    relatedModuleIds: [4],
    relatedLabIds: ["LAB-004"],
    tags: ["troubleshooting", "security-role", "compartir"],
  },
  {
    id: "IP-APP-010",
    slug: "ip-app-010-transferir-vista-criticas",
    title: "Transferir: una vista de críticas sin asignar",
    description: "El jefe de TI pide un filtro nuevo — decide qué hacer y qué evitar en la app.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 4"],
    learningObjectives: ["Crear una vista nueva en vez de alterar las existentes", "Aplicar las buenas prácticas de nombre, columnas y publicación de una vista"],
    scenario: {
      context: "Tu Model-Driven App de solicitudes ya tiene las vistas \"Solicitudes Activas\" y \"Mis Asignaciones\". El jefe de TI pide ver rápidamente las solicitudes de prioridad Crítica que todavía no tienen técnico asignado, para repartirlas cada mañana.",
      objective: "Selecciona lo que conviene hacer y evita lo que no.",
    },
    multiple: true,
    options: [
      { id: "vista-nueva", label: "Crear una vista nueva con el filtro Prioridad = Crítica y Asignado a vacío", consequence: "Es el cambio central: una vista guardada hace el filtro por ti cada mañana, sin tocar lo que otros ya usan.", score: 1 },
      { id: "nombre-accion", label: "Ponerle un nombre orientado a la acción, como \"Críticas sin asignar\"", consequence: "Un nombre que dice para qué sirve se encuentra y se entiende; \"Vista 1\" no.", score: 1 },
      { id: "pocas-columnas", label: "Mostrar solo las columnas que el jefe necesita para decidir (máximo 8-10)", consequence: "Menos columnas cargan más rápido y se leen mejor; el objetivo es repartir, no ver todos los campos.", score: 1 },
      { id: "publicar", label: "Publicar las personalizaciones y comprobar que la vista aparece en la app", consequence: "Sin publicar, la vista existe pero la app no la muestra.", score: 1 },
      { id: "modificar-sistema", label: "Modificar la vista \"Solicitudes Activas\" para que solo muestre críticas sin asignar", consequence: "Cambia lo que ven todos los demás y pierdes la vista general que ya usaban.", score: 0 },
      { id: "filtrar-a-mano", label: "Pedirle que aplique el filtro a mano cada mañana", consequence: "Funciona, pero repite trabajo manual que una vista guardada evita.", score: 0 },
    ],
    correctOptionIds: ["vista-nueva", "nombre-accion", "pocas-columnas", "publicar"],
    hints: [
      { id: "h1", content: "Pregúntate si el pedido cambia lo que otros ya usan o solo agrega algo nuevo: lo segundo no debería alterar nada existente." },
      { id: "h2", content: "Una vista bien hecha tiene un filtro correcto, un nombre que dice para qué sirve y pocas columnas." },
      { id: "h3", content: "Crea una vista nueva con ese filtro, nómbrala con la acción, limita las columnas y publícala." },
    ],
    relatedModuleIds: [4],
    relatedLabIds: ["LAB-004"],
    tags: ["transferencia", "views", "publicar"],
  },
  {
    id: "IP-PA-007",
    slug: "ip-pa-007-transferir-aviso-sin-asignar",
    title: "Transferir: avisar solo cuando haga falta",
    description: "El reporte diario se vuelve un aviso condicionado al paso del tiempo — decide qué cambia en el flujo.",
    type: "multiple-decision",
    domain: "power-automate",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 5"],
    learningObjectives: ["Distinguir una necesidad basada en el tiempo de una basada en un evento", "Filtrar en el origen y evitar acciones cuando no hay nada que reportar"],
    scenario: {
      context: "El flujo Reporte Diario Solicitudes envía un correo cada mañana a las 8:00 con las solicitudes pendientes, incluso los días sin ninguna, y el gerente ya empezó a ignorarlo. Ahora pide: avisarle solo cuando haya solicitudes sin técnico asignado desde hace más de 3 días, y no recibir nada si no hay.",
      objective: "Selecciona los cambios correctos para este nuevo requisito.",
    },
    multiple: true,
    options: [
      { id: "mantener-recurrencia", label: "Mantener el trigger de recurrencia diaria", consequence: "Lo que buscas depende del paso del tiempo (\"más de 3 días\"), y ningún evento lo dispara: necesitas que un reloj lo revise cada día.", score: 1 },
      { id: "filtrar-origen", label: "Filtrar en \"List rows\" para traer solo las solicitudes sin asignar y con más de 3 días", consequence: "Filtrar en el origen trae solo lo necesario, en vez de traer todo y descartar después.", score: 1 },
      { id: "terminar-si-vacio", label: "Agregar una condición antes del correo que termine el flujo sin enviar si no hay filas", consequence: "Evita el correo vacío que el gerente ya ignoraba: si no hay nada que reportar, no se avisa.", score: 1 },
      { id: "trigger-evento", label: "Cambiar el trigger a \"When a row is added\"", consequence: "Se dispara cuando se crea una solicitud, no cuando pasan 3 días sin asignarla: nunca detectaría lo que se pide.", score: 0 },
      { id: "loop-condicion", label: "Traer todas las solicitudes y revisar cada una con un \"Apply to each\" y una condición dentro", consequence: "Funciona, pero es más lento y gasta más ejecuciones que filtrar al leer la tabla.", score: 0 },
    ],
    correctOptionIds: ["mantener-recurrencia", "filtrar-origen", "terminar-si-vacio"],
    hints: [
      { id: "h1", content: "Pregúntate qué hace que el aviso sea necesario: ¿ocurre un evento, o pasa el tiempo?" },
      { id: "h2", content: "Si traes solo lo que cumple la condición y no avisas cuando no hay nada, el correo vuelve a ser útil." },
      { id: "h3", content: "Se mantiene la recurrencia, el filtro va en List rows y una condición evita enviar cuando la lista está vacía." },
    ],
    relatedModuleIds: [5],
    relatedLabIds: ["LAB-005"],
    tags: ["transferencia", "recurrence", "list-rows"],
  },
  {
    id: "IP-DV-008",
    slug: "ip-dv-008-elegir-visual-correcto",
    title: "Elegir el visual correcto para cada pregunta",
    description: "Empareja cada pregunta de negocio con el visual de Power BI que la responde bien.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "starter",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 6"],
    learningObjectives: ["Elegir el visual según la pregunta que debe responder", "Reconocer cuándo un visual esconde la respuesta en vez de mostrarla"],
    scenario: {
      context: "El gerente de TI te hace preguntas sobre las solicitudes y quiere una respuesta visual a cada una. Tu reporte de Power BI tiene las columnas Estado, Fecha Solicitud y Solicitante.",
      objective: "Selecciona las parejas pregunta-visual que responden bien a la pregunta.",
    },
    multiple: true,
    options: [
      { id: "total-tarjeta", label: "¿Cuántas solicitudes hay en total? → una tarjeta (card) con el conteo", consequence: "Una cifra única se lee mejor como tarjeta: el gerente ve el número sin interpretar nada.", score: 1 },
      { id: "estado-barras", label: "¿Cómo se reparten por estado? → un gráfico de barras o de anillo por Estado", consequence: "Con pocas categorías, barras o anillo comparan las partes con claridad.", score: 1 },
      { id: "mes-lineas", label: "¿Cómo evolucionan por mes? → un gráfico de líneas con la fecha en el eje", consequence: "Una línea muestra cambios en el tiempo, que es justo lo que pregunta.", score: 1 },
      { id: "solicitante-pastel", label: "¿Cuántas hay por solicitante, entre 300 personas? → un gráfico de pastel con las 300", consequence: "Con tantas categorías el pastel es ilegible; una tabla con Top N o barras ordenadas se lee mejor.", score: 0 },
      { id: "total-lineas", label: "¿Cuántas solicitudes hay en total? → un gráfico de líneas", consequence: "Una línea sirve para ver cambios en el tiempo; para una cifra única no aporta nada y confunde.", score: 0 },
    ],
    correctOptionIds: ["total-tarjeta", "estado-barras", "mes-lineas"],
    hints: [
      { id: "h1", content: "Antes de elegir el visual, di qué hace la pregunta: ¿una cifra, un reparto o una evolución?" },
      { id: "h2", content: "Una cifra única es una tarjeta, un reparto entre pocas partes son barras o anillo, y una evolución es una línea." },
      { id: "h3", content: "Descarta el pastel con 300 partes y la línea para una sola cifra: esconden la respuesta." },
    ],
    relatedModuleIds: [6],
    relatedLabIds: ["LAB-006"],
    tags: ["power-bi", "visuales", "eleccion"],
  },
  {
    id: "IP-DV-009",
    slug: "ip-dv-009-cardinalidad-y-sentido-del-filtro",
    title: "Elegir la cardinalidad y el sentido del filtro",
    description: "Decide cómo relacionar dos tablas en Power BI y hacia dónde debe viajar el filtro.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 6", "Módulo 2"],
    learningObjectives: ["Elegir la cardinalidad según cuántas filas de cada tabla se relacionan", "Saber que con dirección Single el filtro viaja desde el lado \"uno\" hacia el lado \"muchos\""],
    scenario: {
      context: "Cargaste Solicitudes TI (una fila por solicitud) y Contacts (una fila por persona). Cada solicitud tiene un Solicitante, que es un contacto, y un contacto puede tener muchas solicitudes. Quieres que, al elegir un contacto en un slicer, el reporte muestre solo sus solicitudes.",
      objective: "Selecciona las decisiones de modelado correctas.",
    },
    multiple: true,
    options: [
      { id: "muchos-a-uno", label: "Relación de muchos a uno: Solicitudes (muchos) hacia Contacts (uno)", consequence: "Refleja la realidad: muchas solicitudes pertenecen a un mismo contacto.", score: 1 },
      { id: "single-desde-uno", label: "Dirección del filtro Single: el filtro viaja desde Contacts (lado uno) hacia Solicitudes (lado muchos)", consequence: "Con Single, los filtros viajan siempre desde el lado \"uno\": elegir un contacto filtra sus solicitudes.", score: 1 },
      { id: "columna-id", label: "Relacionar las tablas por la columna que identifica al contacto en ambas", consequence: "La relación necesita una columna común; el identificador del contacto es la clave natural.", score: 1 },
      { id: "uno-a-uno", label: "Relación de uno a uno entre Solicitudes y Contacts", consequence: "Un contacto puede tener muchas solicitudes; uno a uno forzaría una sola y rompería el modelo.", score: 0 },
      { id: "both-siempre", label: "Dirección Both en todas las relaciones, por si acaso", consequence: "Los filtros bidireccionales pueden dar resultados ambiguos y afectan al rendimiento; se usan solo cuando hacen falta.", score: 0 },
    ],
    correctOptionIds: ["muchos-a-uno", "single-desde-uno", "columna-id"],
    hints: [
      { id: "h1", content: "Cuenta cuántas filas de cada tabla se relacionan con una fila de la otra: ¿un contacto con cuántas solicitudes?" },
      { id: "h2", content: "En una relación con un lado \"uno\" y otro \"muchos\", el filtro con dirección Single siempre sale del lado \"uno\"." },
      { id: "h3", content: "Muchos a uno de Solicitudes a Contacts, por la columna del contacto, con Single: el filtro viaja de Contacts a Solicitudes." },
    ],
    relatedModuleIds: [6],
    relatedLabIds: ["LAB-006"],
    tags: ["power-bi", "relaciones", "cardinalidad"],
  },
  {
    id: "IP-TRB-005",
    slug: "ip-trb-005-fechas-como-texto",
    title: "Diagnosticar: el gráfico por mes no agrupa las fechas",
    description: "A partir de un síntoma exacto, identifica por qué el eje no ofrece jerarquía de fecha.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 6"],
    learningObjectives: ["Reconocer que la jerarquía de fecha solo existe para columnas de tipo fecha", "Saber dónde se cambia el tipo de dato de una columna"],
    scenario: {
      context: "En tu reporte, el gráfico de líneas \"Solicitudes por mes\" muestra una lista larga de fechas sueltas en el eje, sin jerarquía Año-Mes y sin poder hacer drill-down. La columna Fecha Solicitud llegó desde el origen de datos.",
      objective: "Antes de mirar la solución, di qué pasa con esa columna y dónde se corrige.",
    },
    implementation: "Power Query → columna Fecha Solicitud\nTipo de dato que muestra: Texto (ABC)\nEje del gráfico: fechas sueltas, sin jerarquía",
    symptom: "El eje del gráfico muestra las fechas como etiquetas sueltas y no ofrece jerarquía por mes ni drill-down.",
    fixPrompt: "¿Qué hay que cambiar y dónde?",
    acceptableFixes: ["tipo de dato", "power query", "texto", "fecha", "data type"],
    testCases: [
      { id: "columna-texto", input: "La columna Fecha Solicitud tiene tipo de dato Texto", expected: "el eje muestra etiquetas sueltas sin jerarquía de fecha" },
      { id: "columna-fecha", input: "En Power Query se cambia el tipo de dato de la columna a Fecha", expected: "el eje ofrece jerarquía Año-Mes y drill-down" },
    ],
    hints: [
      { id: "h1", content: "Mira el ícono junto al nombre de la columna: dice si Power BI la trata como texto, número o fecha." },
      { id: "h2", content: "La jerarquía de fecha solo existe para columnas de tipo fecha; una columna de texto se trata como etiquetas sueltas." },
      { id: "h3", content: "En Power Query cambia el tipo de dato de la columna de Texto a Fecha (Transform > Data type) y aplica los cambios." },
    ],
    relatedModuleIds: [6],
    relatedLabIds: ["LAB-006"],
    tags: ["power-bi", "troubleshooting", "tipo-de-dato"],
  },
  {
    id: "IP-DV-010",
    slug: "ip-dv-010-transferir-modelo-de-ventas",
    title: "Transferir: del reporte de solicitudes al de ventas",
    description: "El mismo patrón de reporte con otro negocio — decide qué estructura usar y qué evitar.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 6"],
    learningObjectives: ["Aplicar el modelo de hechos y dimensiones a un negocio distinto", "Distinguir una medida de una columna calculada y elegir un visual legible para muchas categorías"],
    scenario: {
      context: "La dirección quiere el mismo tipo de reporte, pero para ventas: ventas por producto, por cliente y por mes. Tienes una lista de 50.000 ventas, 40 productos y 300 clientes.",
      objective: "Selecciona las decisiones de modelado y de visualización correctas.",
    },
    multiple: true,
    options: [
      { id: "modelo-estrella", label: "Una tabla Ventas (hechos) relacionada con Producto, Cliente y Calendario (dimensiones) en relaciones de muchos a uno", consequence: "Separa lo que se mide (ventas) de lo que se usa para filtrar (producto, cliente, fecha): es el modelo en estrella.", score: 1 },
      { id: "medida-total", label: "Una medida (measure) con el total vendido, en vez de una columna calculada por fila", consequence: "Las medidas se recalculan con los filtros activos; las columnas calculadas no, y ocupan espacio en cada fila.", score: 1 },
      { id: "tabla-calendario", label: "Una tabla de calendario para analizar por mes y año", consequence: "Una tabla de fechas dedicada hace posible agrupar por mes, trimestre o año sin depender de la columna de la tabla de hechos.", score: 1 },
      { id: "barras-topn", label: "Barras ordenadas o un Top N para comparar los productos", consequence: "Con 40 productos, barras ordenadas permiten comparar de un vistazo.", score: 1 },
      { id: "tabla-plana", label: "Una sola tabla plana con cliente, producto y fecha repetidos en cada fila de venta", consequence: "Duplica datos y dificulta mantener y filtrar; el modelo en estrella evita esa repetición.", score: 0 },
      { id: "pastel-40", label: "Un gráfico de pastel con los 40 productos", consequence: "Con tantas partes el pastel es ilegible; no deja comparar productos.", score: 0 },
    ],
    correctOptionIds: ["modelo-estrella", "medida-total", "tabla-calendario", "barras-topn"],
    hints: [
      { id: "h1", content: "Pregúntate qué se mide (las ventas) y qué se usa para filtrar (producto, cliente, fecha): ¿van en la misma tabla?" },
      { id: "h2", content: "Los totales van en medidas, las fechas en una tabla propia y los visuales se eligen según cuántas categorías haya." },
      { id: "h3", content: "Hechos más dimensiones en estrella, una medida para el total, un calendario para el tiempo y barras ordenadas para los 40 productos." },
    ],
    relatedModuleIds: [6],
    relatedLabIds: ["LAB-006"],
    tags: ["transferencia", "power-bi", "modelo-estrella"],
  },
  {
    id: "IP-APP-011",
    slug: "ip-app-011-leer-una-formula",
    title: "Leer una fórmula y decir qué hace",
    description: "Traduce una fórmula de Power Fx a una frase y distingue lo que hace de lo que no hace.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "starter",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 7"],
    learningObjectives: ["Leer una fórmula Filter con dos condiciones y decir qué filas devuelve", "Saber que Filter no modifica la tabla, solo decide qué se muestra"],
    scenario: {
      context: "En la propiedad Items de la Gallery de tu app aparece esta fórmula: `Filter('Solicitudes TI', Estado = 'Estado (Solicitudes TI)'.Nueva && Prioridad = 'Prioridad (Solicitudes TI)'.Alta)`. (Las columnas Choice se comparan con su enumeración, no con el texto de la etiqueta.) Un compañero te pide que le expliques qué muestra, sin ejecutarla.",
      objective: "Selecciona las lecturas correctas de la fórmula.",
    },
    multiple: true,
    options: [
      { id: "ambas-condiciones", label: "Muestra solo las solicitudes cuyo Estado es Nueva y cuya Prioridad es Alta", consequence: "El operador && exige que se cumplan las dos condiciones a la vez.", score: 1 },
      { id: "descarta-resto", label: "Si una solicitud no cumple las dos condiciones, no aparece en la Gallery", consequence: "Filter descarta toda fila que no cumpla la regla completa.", score: 1 },
      { id: "no-modifica", label: "No cambia la tabla de Dataverse: solo decide qué filas se muestran", consequence: "Filter devuelve una vista de la tabla; no modifica ni borra datos.", score: 1 },
      { id: "una-u-otra", label: "Muestra las solicitudes Nuevas o las de prioridad Alta, aunque no cumplan las dos", consequence: "Eso sería con || (Or). Aquí && exige las dos a la vez.", score: 0 },
      { id: "borra-datos", label: "Borra de la tabla las solicitudes que no cumplen la regla", consequence: "Filter no borra nada: solo filtra lo que se muestra.", score: 0 },
    ],
    correctOptionIds: ["ambas-condiciones", "descarta-resto", "no-modifica"],
    hints: [
      { id: "h1", content: "Lee la fórmula por partes: primero la tabla, luego cada condición, y al final cómo se unen." },
      { id: "h2", content: "El operador que une las condiciones decide si deben cumplirse todas o basta con una." },
      { id: "h3", content: "Con && deben cumplirse las dos, las filas que no cumplen no se muestran, y la tabla de Dataverse no cambia." },
    ],
    relatedModuleIds: [7],
    relatedLabIds: ["LAB-003"],
    tags: ["power-fx", "filter", "lectura"],
  },
  {
    id: "IP-APP-012",
    slug: "ip-app-012-boton-habilitado-de-mas",
    title: "Diagnosticar: el botón Guardar se habilita con el título vacío",
    description: "A partir de un síntoma exacto, identifica qué operador lógico está mal usado.",
    type: "debug-scenario",
    domain: "power-apps",
    level: "starter",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 7"],
    learningObjectives: ["Distinguir && (todas las condiciones) de || (basta una)", "Leer una validación y predecir cuándo habilita el botón"],
    scenario: {
      context: "El botón Guardar de tu formulario tiene esta fórmula en la propiedad DisplayMode: `If(!IsBlank(txtTitulo.Text) || Len(txtDescripcion.Text) >= 20, DisplayMode.Edit, DisplayMode.Disabled)`. El título está vacío, la descripción tiene 25 caracteres y el botón aparece habilitado.",
      objective: "Antes de mirar la solución, di por qué se habilita y cómo corregirlo.",
    },
    implementation: "Botón Guardar → DisplayMode:\nIf(!IsBlank(txtTitulo.Text) || Len(txtDescripcion.Text) >= 20, DisplayMode.Edit, DisplayMode.Disabled)\nTítulo: vacío · Descripción: 25 caracteres → el botón se habilita",
    symptom: "El botón Guardar se habilita con el título vacío siempre que la descripción tenga 20 caracteres o más.",
    fixPrompt: "¿Qué operador hay que cambiar y por cuál, y por qué?",
    acceptableFixes: ["&&", "||", "and", "todas las condiciones", "operador"],
    testCases: [
      { id: "con-or", input: "Las dos condiciones se unen con ||", expected: "el botón se habilita aunque una de las dos no se cumpla" },
      { id: "con-and", input: "Las dos condiciones se unen con &&", expected: "el botón se habilita solo si hay título y la descripción es suficiente" },
    ],
    hints: [
      { id: "h1", content: "Prueba la fórmula con el título vacío: ¿qué valor tiene cada lado y qué hace el operador que los une?" },
      { id: "h2", content: "Con || basta que una condición sea verdadera; para exigir las dos hace falta el otro operador." },
      { id: "h3", content: "Cambia || por && (And) para que se cumplan todas las condiciones a la vez." },
    ],
    relatedModuleIds: [7],
    relatedLabIds: ["LAB-003"],
    tags: ["power-fx", "troubleshooting", "operadores"],
  },
  {
    id: "IP-APP-013",
    slug: "ip-app-013-transferir-condicion-de-fecha",
    title: "Transferir: la condición de fecha con 25.000 registros",
    description: "Una condición de fecha funciona en pruebas pero pierde registros con datos reales — decide qué cambiar y qué evitar.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 7"],
    learningObjectives: ["Reescribir una condición para que se pueda delegar", "Reconocer que subir el límite o usar una colección no resuelve un filtro no delegable"],
    scenario: {
      context: "La tabla Solicitudes TI ya tiene 25.000 registros. El jefe pide ver las solicitudes abiertas hace más de 30 días y escribiste `Filter('Solicitudes TI', DateDiff('Fecha Solicitud', Today(), Days) > 30)`. En pruebas funcionaba, pero en producción faltan solicitudes y la fórmula muestra la advertencia azul de delegación.",
      objective: "Selecciona los cambios y las decisiones correctas.",
    },
    multiple: true,
    options: [
      { id: "comparar-con-fecha", label: "Reescribir la condición comparando la columna con una fecha calculada: `'Fecha Solicitud' < DateAdd(Today(), -30, Days)`", consequence: "Comparar la columna con un valor calculado fuera de la fila se puede delegar: Today() se envía al servidor como constante.", score: 1 },
      { id: "no-envolver-columna", label: "Evitar funciones que envuelvan la columna (como DateDiff) dentro del Filter", consequence: "Una función aplicada a la columna impide delegar el filtro: el servidor no puede evaluarla.", score: 1 },
      { id: "tratar-advertencia", label: "Tratar la advertencia azul como un hallazgo y comprobar el resultado con más de 500 registros", consequence: "La advertencia avisa de que, con muchos registros, la app puede devolver resultados incompletos sin avisar.", score: 1 },
      { id: "subir-limite", label: "Subir el límite de filas a 10.000 (el máximo) en la configuración y dar el problema por resuelto", consequence: "Con 25.000 registros siguen faltando; subir el límite solo mueve el corte.", score: 0 },
      { id: "coleccion", label: "Cargar todas las solicitudes en una colección y filtrar ahí", consequence: "La colección se llena con el mismo límite de filas (500 por defecto, 10.000 como máximo), así que el problema sigue.", score: 0 },
    ],
    correctOptionIds: ["comparar-con-fecha", "no-envolver-columna", "tratar-advertencia"],
    hints: [
      { id: "h1", content: "Fíjate en qué le pides al servidor: ¿una comparación sencilla de la columna o una función aplicada a cada fila?" },
      { id: "h2", content: "Lo que no depende de la fila (como Today()) viaja al servidor como constante; lo que envuelve la columna, no." },
      { id: "h3", content: "Compara la columna con una fecha calculada, evita DateDiff dentro del Filter y trata la advertencia como un aviso real." },
    ],
    relatedModuleIds: [7],
    relatedLabIds: ["LAB-003"],
    tags: ["transferencia", "delegacion", "fechas"],
  },
  {
    id: "IP-DV-011",
    slug: "ip-dv-011-alcance-entrega-minima",
    title: "Decidir qué entra en la entrega mínima",
    description: "Elige el alcance que cabe en poco tiempo y deja el resto para una iteración posterior.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "starter",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 8"],
    learningObjectives: ["Elegir un alcance que llegue a algo funcional de punta a punta", "Reconocer qué conviene dejar para una iteración posterior"],
    scenario: {
      context: "Vas a construir tu proyecto integrado con una hora al día durante unas dos semanas. Tienes ideas para el sistema de solicitudes: tablas, una Canvas App, una Model-Driven App, cuatro flujos, un dashboard con seguridad por filas y documentación formal.",
      objective: "Selecciona lo que conviene incluir en tu primera entrega y deja fuera lo que no.",
    },
    multiple: true,
    options: [
      { id: "dos-tablas", label: "Dos tablas relacionadas con 10 registros de prueba", consequence: "Es la base: sin datos y relaciones claras, las demás capas no tienen sobre qué apoyarse.", score: 1 },
      { id: "una-app", label: "Una sola app, la Canvas o la Model-Driven, para crear y ver solicitudes", consequence: "Una app funcional demuestra la capa de uso; hacer las dos desde el principio duplica el trabajo.", score: 1 },
      { id: "un-flujo", label: "Un flujo de notificación al crear una solicitud", consequence: "Un flujo completo demuestra la automatización y se puede comprobar con el historial de ejecución.", score: 1 },
      { id: "reporte-simple", label: "Un reporte o dashboard simple con unos pocos indicadores", consequence: "Cierra la historia de punta a punta: dato, app, automatización y reporte.", score: 1 },
      { id: "dos-apps", label: "Construir las dos apps desde el día 1", consequence: "Reparte el tiempo en dos mitades; es más probable llegar a la semana con las dos a medias.", score: 0 },
      { id: "rls-primero", label: "Empezar por la seguridad por filas y la documentación formal, antes de tener datos", consequence: "Sin datos ni app, no hay nada que proteger ni documentar todavía; son iteraciones posteriores.", score: 0 },
    ],
    correctOptionIds: ["dos-tablas", "una-app", "un-flujo", "reporte-simple"],
    hints: [
      { id: "h1", content: "Pregúntate qué es lo mínimo que cuenta una historia completa: de dónde salen los datos, quién los usa, qué pasa solo y qué se mide." },
      { id: "h2", content: "Una pieza de cada capa, pequeña y terminada, vale más que varias a medias." },
      { id: "h3", content: "Dos tablas con datos, una app, un flujo y un reporte simple: lo demás se agrega en iteraciones." },
    ],
    relatedModuleIds: [8],
    relatedLabIds: ["LAB-061"],
    tags: ["capstone", "alcance", "entrega-minima"],
  },
  {
    id: "IP-TRB-006",
    slug: "ip-trb-006-pantalla-de-inicio-vacia",
    title: "Diagnosticar: mi pantalla de inicio sale vacía",
    description: "A partir de un síntoma exacto, identifica por qué la lista aparece vacía aunque hay datos.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 8"],
    learningObjectives: ["Comparar datos del mismo tipo en una condición de Filter", "Entender que un Filter sin coincidencias devuelve una lista vacía sin error"],
    scenario: {
      context: "En tu Canvas App, la pantalla de inicio carga las solicitudes del usuario con `ClearCollect(ColMisSolicitudes, Filter(Solicitudes, Solicitante.'Full Name' = User().Email && Estado <> 'Estado (Solicitudes)'.Completada))`. Hay 12 solicitudes a nombre de Ana en Dataverse, pero cuando ella abre la app la lista aparece vacía y no hay ningún error.",
      objective: "Antes de mirar la solución, di por qué sale vacía y cómo corregir la condición.",
    },
    implementation: "Pantalla de inicio → OnVisible:\nClearCollect(ColMisSolicitudes, Filter(Solicitudes, Solicitante.'Full Name' = User().Email && Estado <> 'Estado (Solicitudes)'.Completada))\nDataverse: 12 solicitudes de Ana · App: lista vacía, sin error",
    symptom: "La lista aparece vacía aunque hay solicitudes de la usuaria en Dataverse, y no se muestra ningún error.",
    fixPrompt: "¿Qué hay que cambiar en la condición y por qué?",
    acceptableFixes: ["solicitante.email", "user().email", "correo", "full name", "nombre"],
    testCases: [
      { id: "compara-nombre", input: "Se compara Solicitante.'Full Name' con User().Email", expected: "nunca coinciden: un nombre no es un correo, y la lista queda vacía sin error" },
      { id: "compara-correo", input: "Se compara el correo del contacto con User().Email", expected: "la lista trae las solicitudes de la usuaria" },
    ],
    hints: [
      { id: "h1", content: "Mira qué dato hay a cada lado del signo igual: ¿un nombre o un correo?" },
      { id: "h2", content: "Los dos lados son texto, así que la fórmula es válida y no da error; pero 'Ana Pérez' nunca es igual a 'ana@empresa.com', y Filter devuelve cero filas." },
      { id: "h3", content: "Compara la columna de correo del contacto (en Dataverse se llama Email), `Solicitante.Email`, con `User().Email` en lugar de `Solicitante.'Full Name'`." },
    ],
    relatedModuleIds: [8],
    relatedLabIds: ["LAB-061"],
    tags: ["troubleshooting", "filter", "user"],
  },
  {
    id: "IP-DV-012",
    slug: "ip-dv-012-transferir-proyecto-reservas",
    title: "Transferir: el mismo proyecto para reservas de salas",
    description: "El método del proyecto integrado aplicado a otro negocio — decide qué se conserva y qué cambia.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 8"],
    learningObjectives: ["Separar el método (que se reutiliza) del contenido (que cambia)", "Evitar copiar un modelo de otro negocio sin adaptarlo"],
    scenario: {
      context: "Una universidad quiere gestionar las reservas de sus salas de estudio. Quien reserva es un estudiante; el responsable de espacios las aprueba y quiere ver cuántas horas se ocupa cada sala. Acabas de terminar el proyecto de solicitudes internas y piensas reutilizarlo.",
      objective: "Selecciona lo que se conserva del método y lo que cambia para este nuevo negocio.",
    },
    multiple: true,
    options: [
      { id: "modelo-primero", label: "Empezar por el modelo de datos (por ejemplo Sala y Reserva) antes de crear pantallas", consequence: "El método se conserva: las apps y los flujos heredan los problemas del modelo, así que se valida primero.", score: 1 },
      { id: "una-solucion-un-prefijo", label: "Crear una solución nueva con su propio publisher y un prefijo consistente", consequence: "Cada proyecto es su propia unidad que se mueve entre ambientes; mezclar prefijos genera conflictos al importar.", score: 1 },
      { id: "regla-solapes", label: "Definir cómo se evita reservar la misma sala en horarios que se cruzan (guardar hora de inicio y fin y comprobar antes de confirmar)", consequence: "Es el requisito propio de este negocio: en solicitudes no existía, y sin comprobarlo habría reservas dobles.", score: 1 },
      { id: "una-app-primero", label: "Elegir primero una sola app (la de quien reserva) y el flujo de confirmación, y dejar la segunda para después", consequence: "La entrega mínima se mantiene: una app, un flujo y un reporte antes de ampliar.", score: 1 },
      { id: "copiar-y-renombrar", label: "Copiar la solución de solicitudes y renombrar los campos", consequence: "Arrastra tablas, flujos y reglas que no aplican y mezcla prefijos; el negocio es otro y el modelo debe diseñarse para él.", score: 0 },
      { id: "reusar-tablas", label: "Reutilizar tal cual las cinco tablas de solicitudes", consequence: "Las tablas de aprobación y costos no representan reservas de salas; se diseñan las que este negocio necesita.", score: 0 },
    ],
    correctOptionIds: ["modelo-primero", "una-solucion-un-prefijo", "regla-solapes", "una-app-primero"],
    hints: [
      { id: "h1", content: "Separa lo que es método (el orden de trabajo, la entrega mínima) de lo que es contenido (las tablas, las reglas del negocio)." },
      { id: "h2", content: "El método se reutiliza; las tablas y reglas se diseñan para el negocio nuevo, incluyendo el requisito que antes no existía." },
      { id: "h3", content: "Modelo primero, una solución con su prefijo, una regla para las reservas que se cruzan y una sola app antes de ampliar." },
    ],
    relatedModuleIds: [8],
    relatedLabIds: ["LAB-061"],
    tags: ["transferencia", "capstone", "reservas"],
  },
  {
    id: "IP-PA-005",
    slug: "ip-pa-005-diagnosticar-corte-en-256-registros",
    title: "Diagnosticar: el flujo se detiene en 256 registros",
    description: "A partir de un síntoma y evidencia de ejecución, identifica la causa antes de ver la solución.",
    type: "debug-scenario",
    domain: "power-automate",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 11"],
    learningObjectives: ["Reconocer el límite por defecto de las acciones de lista", "Diferenciar paginación de un fallo de conexión"],
    scenario: {
      context: "Un flujo que debía actualizar todas las solicitudes pendientes de un cliente con miles de registros terminó su ejecución 'Succeeded' en el historial, pero solo 256 filas quedaron actualizadas en Dataverse. No hubo ningún error visible en el run history.",
      objective: "Antes de mirar la solución, formula qué revisarías primero y por qué.",
    },
    implementation: "List rows (Dataverse)\n  Table: sit_solicituds\n  Filter: statuscode eq 1\n  (Pagination: Off, sin configurar)\nApply to each\n  Update row: statuscode = 2",
    symptom: "El run history muestra 'Succeeded' sin errores, pero solo 256 de ~3.400 registros esperados quedaron actualizados.",
    fixPrompt: "¿Qué cambiarías en la acción 'List rows' para que procese todos los registros esperados?",
    acceptableFixes: ["activar paginación", "pagination on", "configurar threshold", "aumentar el límite de paginación", "activar paginacion en list rows"],
    testCases: [
      { id: "sin-paginacion", input: "Pagination: Off", expected: "solo primeros 256 registros" },
      { id: "con-paginacion", input: "Pagination: On, Threshold 5000", expected: "procesa los ~3.400 registros" },
    ],
    hints: [
      { id: "h1", content: "El run terminó en 'Succeeded', así que no es un error de conexión ni de permisos — el flujo hizo exactamente lo que se le pidió." },
      { id: "h2", content: "Las acciones de lista de Dataverse/SharePoint tienen un límite por defecto de 256 registros por ejecución." },
      { id: "h3", content: "La opción para traer más allá del límite por defecto vive en Settings de la propia acción 'List rows', no en el Apply to each." },
    ],
    relatedModuleIds: [11],
    relatedLabIds: ["LAB-005"],
    tags: ["paginación", "troubleshooting", "dataverse"],
  },
  {
    id: "IP-PA-006",
    slug: "ip-pa-006-transferir-umbral-en-moneda-convertida",
    title: "Transferir: aprobar según el monto convertido a USD",
    description: "La regla de aprobación ya no usa el monto directo: primero hay que convertir la moneda y luego comparar.",
    type: "flow-builder",
    domain: "power-automate",
    level: "advanced",
    estimatedMinutes: 10,
    prerequisites: ["Módulo 11"],
    learningObjectives: ["Reconocer cuándo un paso de transformación debe ir antes de una condición", "Reutilizar el patrón de aprobación por umbral con un dato derivado, no un dato de entrada directo"],
    scenario: {
      context: "La regla cambió: ya no se aprueba según el monto en la moneda original de la solicitud, sino según su equivalente en USD. Si el monto convertido supera 2.000 USD, requiere aprobación; si no, se aprueba automáticamente. La tasa de cambio se obtiene con la misma llamada HTTP que ya construiste en la Actividad 11.3.",
      objective: "Ordena el flujo para que la conversión ocurra antes de evaluar el umbral, y ejecútalo contra los casos de prueba.",
    },
    blocks: [
      { id: "condition-amount-gt", label: "Condition: montoUSD > 2000", kind: "condition" },
      { id: "update-approved", label: "Update row: approved", kind: "action" },
      { id: "http-get-rate", label: "HTTP GET: tasa de cambio", kind: "action" },
      { id: "start-approval", label: "Start approval", kind: "action" },
      { id: "trigger-row-added", label: "When row added", kind: "trigger" },
      { id: "compose-converted", label: "Compose: monto convertido a USD", kind: "action" },
      { id: "parse-json-rate", label: "Parse JSON: tasa de cambio", kind: "action" },
    ],
    expectedBlockIds: ["trigger-row-added", "http-get-rate", "parse-json-rate", "compose-converted", "condition-amount-gt", "start-approval", "update-approved"],
    threshold: 2000,
    branchPreview: {
      conditionLabel: "Condition: montoUSD > 2000",
      yes: { label: "Sí (supera el umbral en USD)", blockIds: ["start-approval", "update-approved"] },
      no: { label: "No (no supera el umbral en USD)", blockIds: ["update-approved"] },
    },
    testCases: [
      { id: "low", label: "Monto convertido: 800 USD", amount: 800, expected: "auto-approved" },
      { id: "high", label: "Monto convertido: 3.500 USD", amount: 3500, expected: "approval-required" },
      { id: "edge", label: "Monto convertido: 2.000 USD", amount: 2000, expected: "auto-approved" },
    ],
    hints: [
      { id: "h1", content: "El umbral ahora compara un valor que no existe todavía cuando el flujo arranca — hay que calcularlo primero." },
      { id: "h2", content: "La condición necesita el resultado de Parse JSON, así que la llamada HTTP y su Compose deben ir antes de la condición, no después." },
      { id: "h3", content: "El orden correcto es: trigger, HTTP, Parse JSON, Compose del monto convertido, y solo entonces la condición." },
    ],
    relatedModuleIds: [11],
    relatedLabIds: ["LAB-005"],
    tags: ["transferencia", "http", "condition", "test cases"],
  },
  {
    id: "IP-JS-001",
    slug: "ip-js-001-evento-y-api-correctos",
    title: "Elegir el evento y la API correctos",
    description: "Decide qué evento del formulario y qué patrón de acceso usar para cada escenario de JavaScript.",
    type: "multiple-decision",
    domain: "javascript",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 13"],
    learningObjectives: ["Elegir el evento correcto (OnLoad/OnChange/OnSave) según el momento que exige el requerimiento", "Usar formContext vía executionContext en vez de Xrm.Page"],
    scenario: {
      context: "Estás diseñando el JavaScript del formulario de Solicitud: necesitas mostrar/ocultar una pestaña cuando cambia el estado, y necesitas bloquear el guardado si falta presupuesto en estado Aprobado.",
      objective: "Selecciona el evento y el patrón de acceso correctos para cada uno de los dos requerimientos.",
    },
    multiple: true,
    options: [
      { id: "visibilidad-onchange", label: "Mostrar/ocultar la pestaña: registrar la lógica en el evento OnChange del campo 'Estado' (además de OnLoad para el valor inicial)", consequence: "OnChange reacciona en vivo a lo que el usuario modifica — es el único evento que se dispara cada vez que el valor cambia después de cargar el formulario.", score: 1 },
      { id: "visibilidad-onsave", label: "Mostrar/ocultar la pestaña: registrar la lógica en el evento OnSave", consequence: "OnSave se dispara solo al guardar, no mientras el usuario edita — la pestaña no reaccionaría al cambio de estado hasta recargar el formulario.", score: 0 },
      { id: "bloqueo-onsave", label: "Bloquear el guardado sin presupuesto: usar el evento OnSave con executionContext.getEventArgs().preventDefault()", consequence: "OnSave es el único evento cancelable para impedir que el registro se guarde — exactamente lo que este requerimiento necesita.", score: 1 },
      { id: "bloqueo-onchange", label: "Bloquear el guardado sin presupuesto: usar el evento OnChange del campo presupuesto", consequence: "OnChange no puede cancelar un guardado que todavía no ocurrió — el usuario podría seguir editando otros campos y guardar sin que se vuelva a evaluar.", score: 0 },
    ],
    correctOptionIds: ["visibilidad-onchange", "bloqueo-onsave"],
    hints: [
      { id: "h1", content: "Pregúntate en qué momento exacto necesitas que la lógica se ejecute: ¿una sola vez al abrir, cada vez que cambia un valor, o justo antes de guardar?" },
      { id: "h2", content: "Solo el evento OnSave te da un executionContext con getEventArgs().preventDefault() para cancelar el guardado." },
      { id: "h3", content: "La visibilidad necesita reaccionar a cada cambio (OnChange); el bloqueo necesita el único punto cancelable antes de persistir (OnSave)." },
    ],
    relatedModuleIds: [13],
    relatedLabIds: ["LAB-004", "LAB-005"],
    tags: ["formContext", "eventos", "onsave", "onchange"],
  },
  {
    id: "IP-JS-002",
    slug: "ip-js-002-contrato-del-control-pcf",
    title: "Decidir el contrato del control PCF",
    description: "Elige el tipo de propiedad y el tipo de control PCF correctos antes de crear el proyecto.",
    type: "multiple-decision",
    domain: "javascript",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 13"],
    learningObjectives: ["Elegir el of-type correcto para una propiedad de PCF según el dato que representa", "Distinguir cuándo corresponde un Field PCF y cuándo un Dataset PCF"],
    scenario: {
      context: "Vas a construir dos controles PCF: `StatusBadge`, que muestra un semáforo de color según el estado de una Solicitud, y una vista tipo calendario que debe mostrar todas las solicitudes pendientes de un usuario con sus columnas.",
      objective: "Selecciona el tipo de propiedad y el tipo de control correctos para cada uno.",
    },
    multiple: true,
    options: [
      { id: "badge-optionset", label: "`StatusBadge`: propiedad `statusValue` con `of-type=\"OptionSet\"` en un Field PCF", consequence: "El estado de la Solicitud es una opción de un conjunto fijo, y el control reemplaza la visualización de un solo campo — exactamente lo que describe Field PCF con OptionSet.", score: 1 },
      { id: "badge-dataset", label: "`StatusBadge`: implementarlo como Dataset PCF", consequence: "Dataset PCF está pensado para colecciones de registros con columnas, no para reemplazar la visualización de un solo campo — es más complejo de lo que este requerimiento necesita.", score: 0 },
      { id: "calendario-dataset", label: "Vista calendario: implementarla como Dataset PCF", consequence: "Reemplazar una subgrid con una visualización personalizada de una colección completa de registros con sus columnas es exactamente el caso de uso de Dataset PCF.", score: 1 },
      { id: "calendario-field", label: "Vista calendario: implementarla como Field PCF", consequence: "Field PCF recibe el valor de un solo campo, no una colección de registros — no puede representar varias solicitudes a la vez.", score: 0 },
    ],
    correctOptionIds: ["badge-optionset", "calendario-dataset"],
    hints: [
      { id: "h1", content: "Pregúntate qué recibe el control: ¿el valor de un solo campo, o una colección completa de registros con columnas?" },
      { id: "h2", content: "Field PCF reemplaza la visualización de una columna; Dataset PCF reemplaza una subgrid o galería completa." },
      { id: "h3", content: "El estado de una Solicitud es un valor único por registro (Field + OptionSet); 'todas las solicitudes pendientes' es una colección (Dataset)." },
    ],
    relatedModuleIds: [13],
    relatedLabIds: ["LAB-004", "LAB-005"],
    tags: ["pcf", "manifest", "field-vs-dataset"],
  },
  {
    id: "IP-JS-003",
    slug: "ip-js-003-diagnosticar-badge-sin-estado",
    title: "Diagnosticar: el badge siempre muestra 'Sin estado'",
    description: "A partir de un síntoma y evidencia de despliegue, identifica la causa antes de ver la solución.",
    type: "debug-scenario",
    domain: "javascript",
    level: "junior",
    estimatedMinutes: 7,
    prerequisites: ["Módulo 13"],
    learningObjectives: ["Distinguir un control que compila y despliega correctamente de uno correctamente enlazado en el formulario", "Reconocer el binding de propiedades en el form designer como un paso separado del despliegue"],
    scenario: {
      context: "El control `StatusBadge` compiló sin errores con `npm run build`, `pac pcf push` terminó en éxito, y el badge aparece visualmente en el formulario de Solicitud. Sin embargo, siempre muestra 'Sin estado' en color gris, sin importar qué valor tenga el campo `sit_estado` en ese registro.",
      objective: "Antes de mirar la solución, formula qué revisarías primero y por qué — el control claramente se desplegó, así que el problema no está ahí.",
    },
    implementation: "pac pcf push --publisher-prefix sit → Succeeded\nFormulario → campo sit_estado → Componentes → StatusBadge agregado (visible en el formulario)\nBadge renderizado: gris, texto \"Sin estado\"",
    symptom: "El control se despliega y se ve en el formulario, pero `statusLabel` siempre llega vacío/sin valor al componente.",
    fixPrompt: "¿Qué falta configurar para que el control reciba el valor real de sit_estado?",
    acceptableFixes: ["enlazar la propiedad statusvalue al campo", "configurar statusvalue al campo sit_estado", "falta el binding de la propiedad en el formulario", "asignar el campo a la propiedad statusvalue"],
    testCases: [
      { id: "sin-binding", input: "Componente agregado, propiedad statusValue sin campo asignado", expected: "statusLabel llega vacío, badge gris" },
      { id: "con-binding", input: "Componente agregado, propiedad statusValue → Campo: sit_estado", expected: "badge muestra el color y texto reales del estado" },
    ],
    hints: [
      { id: "h1", content: "El control se compiló y se desplegó correctamente — el problema no está en el código TypeScript ni en el manifest." },
      { id: "h2", content: "Agregar el componente al formulario y enlazar su propiedad a un campo son dos pasos distintos — agregar el componente no asigna automáticamente ningún campo." },
      { id: "h3", content: "En el form designer, la propiedad `statusValue` del componente debe configurarse explícitamente apuntando al campo `sit_estado`." },
    ],
    relatedModuleIds: [13],
    relatedLabIds: ["LAB-004", "LAB-005"],
    tags: ["pcf", "troubleshooting", "binding"],
  },
  {
    id: "IP-JS-004",
    slug: "ip-js-004-transferir-propiedad-numerica",
    title: "Transferir: el control ahora recibe un número, no un OptionSet",
    description: "El contrato del PCF cambia de un valor de opción a un número con rangos — decide qué implica ese cambio.",
    type: "multiple-decision",
    domain: "javascript",
    level: "advanced",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 13"],
    learningObjectives: ["Reconocer que cambiar el of-type de una propiedad PCF cambia también la lógica que la consume", "Transformar una decisión por valor exacto (switch) en una decisión por rango"],
    scenario: {
      context: "`StatusBadge` hoy tiene una propiedad `statusValue` de tipo OptionSet que colorea según un valor exacto (1, 2, 3). El requerimiento cambia: ahora debe mostrar el porcentaje de avance de la Solicitud (`sit_porcentajeavance`, un número de 0 a 100), coloreado por rangos (rojo < 30, amarillo 30-70, verde > 70).",
      objective: "Selecciona qué cambios son necesarios en el manifest, en la lectura del valor y en la lógica de color para este nuevo contrato.",
    },
    multiple: true,
    options: [
      { id: "cambiar-oftype", label: "Cambiar `of-type` de `OptionSet` a `Whole.Number` en `ControlManifest.Input.xml`", consequence: "El tipo declarado en el manifest determina qué puede recibir la propiedad — es el cambio central del contrato.", score: 1 },
      { id: "cambiar-getcolor-rangos", label: "Reescribir `getColor` de un `switch` por valor exacto a comparaciones por rango (`< 30`, `>= 30 && <= 70`, `> 70`)", consequence: "Un switch por valor exacto no tiene sentido para un número continuo de 0 a 100 — la decisión de color ahora depende de en qué rango cae el valor, no de cuál opción es.", score: 1 },
      { id: "mantener-formatted", label: "Seguir leyendo `statusLabel` desde `context.parameters.statusValue.formatted` igual que con el OptionSet", consequence: "Un Whole.Number no tiene una versión 'formatted' con la etiqueta de una opción — hay que mostrar el número mismo (`.raw`), no un texto de opción que ya no existe.", score: 0 },
      { id: "usar-raw-numero", label: "Leer el valor con `context.parameters.statusValue.raw` y mostrarlo como el porcentaje mismo (ej. \"45%\")", consequence: "Para un Whole.Number, `.raw` es el número real — es la fuente correcta para decidir el color por rango y para mostrarlo.", score: 1 },
    ],
    correctOptionIds: ["cambiar-oftype", "cambiar-getcolor-rangos", "usar-raw-numero"],
    hints: [
      { id: "h1", content: "El tipo de la propiedad en el manifest no es un detalle interno — determina qué forma de dato le llega al componente." },
      { id: "h2", content: "Un switch compara igualdad exacta; un número de 0 a 100 con 3 colores necesita comparación por rango, no por valor exacto." },
      { id: "h3", content: "Un OptionSet tiene `.formatted` (la etiqueta de la opción); un Whole.Number no — para un número, `.raw` es la fuente de verdad." },
    ],
    relatedModuleIds: [13],
    relatedLabIds: ["LAB-004", "LAB-005"],
    tags: ["transferencia", "pcf", "manifest", "of-type"],
  },
  {
    id: "IP-DV-017",
    slug: "ip-dv-017-porcentaje-del-total-que-filtro-quitar",
    title: "¿Qué filtro quitar para el % del total?",
    description: "Elige el denominador correcto de un porcentaje del total que debe respetar el slicer de segmento.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 12", "Módulo 6"],
    learningObjectives: ["Predecir qué filtros quita cada modificador dentro de CALCULATE", "Construir un porcentaje del total que respete los filtros externos al visual"],
    scenario: {
      context: "Tienes una matriz con financials[Product] en filas y la medida [Total Ventas] = SUM(financials[Sales]). Junto a la matriz hay un slicer de financials[Segment] con Small Business seleccionado. Quieres una medida '% del Total Productos' que muestre qué parte de las ventas de Small Business aporta cada producto, de modo que la fila Total sume 100%.",
      objective: "Selecciona todas las versiones de la medida que cumplen el requisito.",
    },
    multiple: true,
    options: [
      { id: "removefilters-columna", label: "DIVIDE([Total Ventas], CALCULATE([Total Ventas], REMOVEFILTERS(financials[Product])))", consequence: "Correcto: quita solo el filtro de la columna de las filas; el filtro de segmento del slicer sigue aplicando en el denominador.", score: 1 },
      { id: "all-columna", label: "DIVIDE([Total Ventas], CALCULATE([Total Ventas], ALL(financials[Product])))", consequence: "Correcto: como modificador de CALCULATE, ALL sobre una columna quita los filtros de esa columna igual que REMOVEFILTERS.", score: 1 },
      { id: "all-tabla", label: "DIVIDE([Total Ventas], CALCULATE([Total Ventas], ALL(financials)))", consequence: "Quita todos los filtros de la tabla, también el del segmento: el denominador es el total de la empresa y la columna ya no suma 100% dentro de Small Business.", score: 0 },
      { id: "sin-calculate", label: "DIVIDE([Total Ventas], [Total Ventas])", consequence: "El denominador tiene el mismo contexto que el numerador: cada fila da 100%.", score: 0 },
      { id: "filtro-segmento", label: "DIVIDE([Total Ventas], CALCULATE([Total Ventas], financials[Segment] = \"Small Business\"))", consequence: "No quita el filtro de producto, así que cada fila sigue dividiendo por sí misma (100%); además deja de funcionar si el usuario elige otro segmento.", score: 0 },
    ],
    correctOptionIds: ["removefilters-columna", "all-columna"],
    hints: [
      { id: "h1", content: "Piensa qué filtros tiene cada celda: el del producto (por la fila) y el del segmento (por el slicer). ¿Cuál de los dos tiene que desaparecer en el denominador?" },
      { id: "h2", content: "Dentro de CALCULATE, REMOVEFILTERS o ALL sobre una columna quitan solo esa columna; sobre la tabla completa quitan todos los filtros de la tabla." },
      { id: "h3", content: "El denominador debe quitar solo el filtro de financials[Product]. Hay dos formas equivalentes de hacerlo." },
    ],
    relatedModuleIds: [12],
    relatedLabIds: ["LAB-061"],
    tags: ["power-bi", "dax", "calculate", "contexto-de-filtro"],
  },
  {
    id: "IP-TRB-009",
    slug: "ip-trb-009-ytd-no-acumula",
    title: "Diagnosticar: el YTD no acumula",
    description: "A partir de un síntoma exacto, identifica por qué una medida de acumulado anual no crece mes a mes.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 12"],
    learningObjectives: ["Reconocer que la inteligencia de tiempo filtra la tabla de calendario, no la tabla de hechos", "Saber qué columnas usar en filas, ejes y slicers cuando hay medidas de tiempo"],
    scenario: {
      context: "Un compañero creó la tabla Calendar, la marcó como tabla de fechas y la relacionó (uno a muchos, Single) con financials[Date]. Su medida Ventas YTD = TOTALYTD([Total Ventas], 'Calendar'[Date]) está bien escrita, pero la matriz no muestra un acumulado.",
      objective: "Antes de mirar la solución, di por qué no acumula y qué hay que cambiar.",
    },
    implementation: "Matriz → Rows: financials[Month Name]\nValues: Total Ventas, Ventas YTD\nCalendar[Date] 1 ──► * financials[Date] (Single)\nVentas YTD = TOTALYTD([Total Ventas], 'Calendar'[Date])",
    symptom: "Los meses salen en orden alfabético (April, August, December...) y en cada fila Ventas YTD es como mucho la venta de ese mes: no crece de un mes al siguiente.",
    fixPrompt: "¿Por qué no acumula y qué cambiarías en la matriz?",
    acceptableFixes: ["calendar", "financials", "filas", "tabla de fechas", "año-mes", "columna"],
    testCases: [
      { id: "filas-hechos", input: "Las filas usan financials[Month Name]", expected: "el filtro no llega a Calendar: TOTALYTD toma todo el año y lo cruza con el mes de la fila, sin acumular" },
      { id: "filas-calendar", input: "Las filas usan 'Calendar'[Año-Mes]", expected: "cada fila filtra Calendar y TOTALYTD acumula desde el 1 de enero hasta el fin de ese mes" },
    ],
    hints: [
      { id: "h1", content: "Mira de qué tabla sale la columna de las filas. ¿Hacia dónde viaja ese filtro con una relación Single?" },
      { id: "h2", content: "TOTALYTD modifica el filtro de la tabla Calendar. Si las filas filtran financials, Calendar no recibe el mes de la fila y el filtro del mes sobre financials sigue ahí." },
      { id: "h3", content: "Cambia las filas a una columna de la tabla Calendar (por ejemplo 'Calendar'[Año-Mes]) en vez de financials[Month Name]." },
    ],
    relatedModuleIds: [12],
    relatedLabIds: ["LAB-061"],
    tags: ["power-bi", "dax", "time-intelligence", "troubleshooting"],
  },
  {
    id: "IP-DV-018",
    slug: "ip-dv-018-transferir-ano-fiscal",
    title: "Transferir: acumulado en año fiscal",
    description: "La empresa cierra el año el 30 de junio — decide qué cambia en el modelo y en las medidas y qué no.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 12"],
    learningObjectives: ["Adaptar un acumulado anual a un año fiscal que no coincide con el calendario", "Distinguir qué funciones de tiempo dependen del fin de año y cuáles no"],
    scenario: {
      context: "Tu modelo ya tiene la tabla Calendar (1 de enero de 2013 a 31 de diciembre de 2014, marcada como tabla de fechas) y las medidas Ventas YTD = TOTALYTD([Total Ventas], 'Calendar'[Date]) y Ventas Año Anterior = CALCULATE([Total Ventas], SAMEPERIODLASTYEAR('Calendar'[Date])). Finanzas cierra el año fiscal el 30 de junio: el año fiscal 2014 va del 1 de julio de 2013 al 30 de junio de 2014.",
      objective: "Selecciona todas las decisiones correctas para entregar el acumulado fiscal y el comparativo contra el año anterior.",
    },
    multiple: true,
    options: [
      { id: "totalytd-fin-anio", label: "Crear Ventas YTD Fiscal = TOTALYTD([Total Ventas], 'Calendar'[Date], \"6/30\")", consequence: "Correcto: el último argumento de TOTALYTD indica la fecha de fin de año; el acumulado se reinicia cada 1 de julio.", score: 1 },
      { id: "columna-anio-fiscal", label: "Agregar a Calendar una columna Año Fiscal = IF('Calendar'[Mes Número] >= 7, 'Calendar'[Año] + 1, 'Calendar'[Año]) y usarla en filas y slicers", consequence: "Correcto: los usuarios necesitan agrupar y filtrar por año fiscal, y ese dato no existe en la tabla.", score: 1 },
      { id: "sameperiod-sirve", label: "Mantener Ventas Año Anterior con SAMEPERIODLASTYEAR tal como está", consequence: "Correcto: desplaza las fechas filtradas un año atrás; no depende de cuándo termina el año, así que sigue comparando el mismo periodo.", score: 1 },
      { id: "cambiar-calendar", label: "Rehacer Calendar con CALENDAR(DATE(2013, 7, 1), DATE(2015, 6, 30))", consequence: "Desplazar el rango no cambia dónde se reinicia el acumulado y además deja fuera los datos de enero a junio de 2013 si los hubiera.", score: 0 },
      { id: "dateadd-seis-meses", label: "Calcular el acumulado fiscal como TOTALYTD sobre DATEADD('Calendar'[Date], -6, MONTH)", consequence: "Mueve las fechas en vez de cambiar el fin de año: los valores quedan asignados a meses equivocados.", score: 0 },
      { id: "ytd-sin-cambio", label: "Usar la misma Ventas YTD; basta con cambiar el nombre del visual a 'Fiscal'", consequence: "TOTALYTD sin fin de año usa el 31 de diciembre: en julio de 2014 seguiría acumulando desde enero.", score: 0 },
    ],
    correctOptionIds: ["totalytd-fin-anio", "columna-anio-fiscal", "sameperiod-sirve"],
    hints: [
      { id: "h1", content: "Separa dos preguntas: ¿dónde se reinicia el acumulado? y ¿con qué columna agrupa el usuario?" },
      { id: "h2", content: "TOTALYTD tiene un argumento opcional para la fecha de fin de año. SAMEPERIODLASTYEAR solo desplaza fechas un año y no depende del fin de año." },
      { id: "h3", content: "Hay tres decisiones correctas: el fin de año \"6/30\" en TOTALYTD, una columna de año fiscal en Calendar, y no tocar el comparativo del año anterior." },
    ],
    relatedModuleIds: [12],
    relatedLabIds: ["LAB-061"],
    tags: ["power-bi", "dax", "time-intelligence", "transferencia"],
  },
  {
    id: "IP-PA-008",
    slug: "ip-pa-008-secciones-del-asistente-de-conectores",
    title: "¿En qué sección del asistente va cada cosa?",
    description: "Ubica cada dato de una API en la sección correcta del asistente de conectores personalizados.",
    type: "multiple-decision",
    domain: "power-automate",
    level: "junior",
    estimatedMinutes: 4,
    prerequisites: ["Módulo 14", "Módulo 11"],
    learningObjectives: ["Reconocer qué se configura en General, Security, Definition, Code y Test", "Separar el contrato de la API de sus credenciales"],
    scenario: {
      context: "Vas a crear un conector para la API pública https://api.exchangerate-api.com/v4/latest/USD, que no pide credenciales y responde un JSON con base, date y rates. El asistente tiene las secciones General, Security, Definition, Code y Test.",
      objective: "Selecciona todas las afirmaciones correctas.",
    },
    multiple: true,
    options: [
      { id: "host-general", label: "api.exchangerate-api.com va en Host, dentro de General", consequence: "Correcto: General contiene el esquema (HTTPS), el Host y la Base URL.", score: 1 },
      { id: "auth-security", label: "Que la API no pida credenciales se configura en Security con No authentication", consequence: "Correcto: Security define qué le pide la conexión a cada usuario.", score: 1 },
      { id: "accion-definition", label: "GET /v4/latest/USD y el ejemplo de respuesta se configuran en Definition, como una acción con su Request y su Response", consequence: "Correcto: Definition contiene las acciones, sus parámetros, respuestas y políticas.", score: 1 },
      { id: "probar-test", label: "Para comprobar que la acción responde hay que crear una conexión en Test y ejecutar Test operation", consequence: "Correcto: Test necesita una conexión y muestra el status y el cuerpo de la respuesta.", score: 1 },
      { id: "code-obligatorio", label: "Hay que escribir código C# en Code para que el conector pueda leer el JSON", consequence: "Code es opcional; sirve para transformar peticiones o respuestas. El JSON se describe en Definition.", score: 0 },
      { id: "clave-definition", label: "Si la API pidiera una clave, la clave se escribiría como valor fijo dentro de la definición", consequence: "La clave la aporta cada conexión (Security con API Key); escribirla en la definición la expone a cualquiera que descargue o exporte el conector.", score: 0 },
    ],
    correctOptionIds: ["host-general", "auth-security", "accion-definition", "probar-test"],
    hints: [
      { id: "h1", content: "Cada sección responde una pregunta: ¿dónde está la API?, ¿cómo se autentica?, ¿qué operaciones tiene?, ¿hace falta transformar algo con código?, ¿funciona?" },
      { id: "h2", content: "General = dónde; Security = credenciales; Definition = operaciones; Code = opcional; Test = conexión y prueba." },
      { id: "h3", content: "Hay cuatro afirmaciones correctas. Las dos falsas hablan de código obligatorio y de una clave escrita en la definición." },
    ],
    relatedModuleIds: [14],
    relatedLabIds: ["LAB-063"],
    tags: ["custom-connector", "openapi", "asistente"],
  },
  {
    id: "IP-TRB-010",
    slug: "ip-trb-010-importar-conector-y-flujo-en-otro-ambiente",
    title: "Diagnosticar: la importación falla en TEST",
    description: "A partir de un síntoma exacto, identifica por qué una solución con conector y flujos no se puede usar en otro ambiente.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 14"],
    learningObjectives: ["Conocer el orden de importación de conectores personalizados y de los flujos que los usan", "Saber qué hay que hacer en el ambiente destino después de importar"],
    scenario: {
      context: "En DEV, un compañero tiene una sola solución con el conector personalizado SIT Facturacion, la connection reference de ese conector y el flujo que emite facturas. La exportó y la importó en TEST.",
      objective: "Antes de mirar la solución, di por qué falla y cómo lo harías.",
    },
    implementation: "Solución exportada: SIT Facturacion Todo\n  - Custom connector: SIT Facturacion\n  - Connection reference: SIT Facturacion\n  - Cloud flow: Emitir factura al facturar pedido\nImportación en TEST: una sola solución, un solo paso",
    symptom: "La importación en TEST no termina bien: el flujo queda sin poder activarse porque su connection reference no encuentra el conector ni una conexión válida.",
    fixPrompt: "¿Qué cambiarías en cómo se empaqueta e importa, y qué harías después de importar?",
    acceptableFixes: ["conector", "primero", "solucion", "separada", "conexion", "orden"],
    testCases: [
      { id: "todo-junto", input: "Conector, connection reference y flujo en la misma solución, importados juntos", expected: "el flujo no encuentra el conector ni una conexión en TEST" },
      { id: "conector-primero", input: "Una solución solo con el conector se importa primero; se crea la conexión; luego se importa la solución con la connection reference y el flujo", expected: "la connection reference se asocia a la conexión y el flujo se puede activar" },
    ],
    hints: [
      { id: "h1", content: "Piensa en qué necesita existir en TEST para que la connection reference tenga a qué apuntar." },
      { id: "h2", content: "Los conectores personalizados se importan antes que las connection references y los flujos que los usan, en una solución aparte; después hay que volver a dar credenciales y crear las conexiones." },
      { id: "h3", content: "Separa el conector en su propia solución, impórtala primero, crea la conexión en TEST y después importa la solución con la connection reference y el flujo." },
    ],
    relatedModuleIds: [14],
    relatedLabIds: ["LAB-063"],
    tags: ["custom-connector", "alm", "soluciones", "troubleshooting"],
  },
  {
    id: "IP-PA-009",
    slug: "ip-pa-009-transferir-api-con-clave-y-host-por-ambiente",
    title: "Transferir: API con clave y host distinto por ambiente",
    description: "Una API nueva exige clave en un header y cambia de host entre DEV y PROD — decide dónde va cada cosa.",
    type: "multiple-decision",
    domain: "power-automate",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 14"],
    learningObjectives: ["Elegir el tipo de autenticación según lo que exige la API", "Separar lo que cambia por ambiente (host) de lo que aporta cada conexión (clave)"],
    scenario: {
      context: "Logística necesita un conector para la API de su transportadora. La API exige la clave en el header X-Api-Key. En DEV se usa sandbox.transportadora.ejemplo.com y en PROD api.transportadora.ejemplo.com. El conector debe pasar por DEV, TEST y PROD sin editarlo a mano en cada ambiente y sin que la clave quede en ningún archivo exportado.",
      objective: "Selecciona todas las decisiones correctas.",
    },
    multiple: true,
    options: [
      { id: "api-key-header", label: "Security: API Key con Parameter name X-Api-Key y Parameter location Header", consequence: "Correcto: cada conexión aporta su clave y el conector la envía en el header en cada llamada.", score: 1 },
      { id: "env-var-host", label: "Host: una variable de entorno de la solución con @environmentVariables(\"...\"), con un valor distinto en cada ambiente", consequence: "Correcto: el host cambia por ambiente sin editar el conector. Si el valor cambia después, hay que volver a guardar el conector.", score: 1 },
      { id: "orden-importacion", label: "Conector en una solución propia que se importa antes que la solución con los flujos y sus connection references", consequence: "Correcto: los flujos necesitan que el conector exista en el ambiente destino antes de importarse.", score: 1 },
      { id: "clave-en-politica", label: "Agregar una política Set HTTP header con la clave escrita como valor fijo", consequence: "La clave quedaría dentro de la definición del conector y viajaría en cada exportación: justo lo que el requisito prohíbe.", score: 0 },
      { id: "openapi-3", label: "Pedir al proveedor la definición en OpenAPI 3.0 para importarla directamente", consequence: "El asistente de conectores personalizados solo admite OpenAPI 2.0.", score: 0 },
      { id: "oauth-client-credentials", label: "Usar OAuth 2.0 con client credentials para no depender de usuarios", consequence: "La API no usa OAuth, y además el flujo de client credentials no se admite en conectores personalizados.", score: 0 },
    ],
    correctOptionIds: ["api-key-header", "env-var-host", "orden-importacion"],
    hints: [
      { id: "h1", content: "Separa tres cosas: lo que pide la API (la clave), lo que cambia por ambiente (el host) y cómo llega todo al ambiente destino." },
      { id: "h2", content: "Lo que aporta cada usuario va en Security y se guarda en la conexión; lo que cambia por ambiente se resuelve con variables de entorno; el conector se importa antes que los flujos." },
      { id: "h3", content: "Hay tres decisiones correctas: API Key en header, variable de entorno en Host y conector importado primero en su propia solución." },
    ],
    relatedModuleIds: [14],
    relatedLabIds: ["LAB-063"],
    tags: ["custom-connector", "api-key", "variables-de-entorno", "transferencia"],
  },
  {
    id: "IP-CS-001",
    slug: "ip-cs-001-elegir-pieza-del-agente",
    title: "Elegir la pieza correcta del agente",
    description: "Decide si cada necesidad de la mesa de ayuda se resuelve con knowledge, con un topic o con un agent flow.",
    type: "multiple-decision",
    domain: "copilot-studio",
    level: "junior",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 15", "Módulo 11"],
    learningObjectives: [
      "Distinguir knowledge (contenido estable) de tools/agent flows (datos vivos de Dataverse)",
      "Elegir una entidad regex cuando el dato tiene un formato propio como SOL-001000",
    ],
    scenario: {
      context: "La mesa de ayuda quiere un agente en Copilot Studio. Tiene un manual de soporte en Word que cambia pocas veces al año, la tabla Solicitud TI en Dataverse cuyo Estado cambia varias veces al día, y números de solicitud con el formato SOL- seguido de 6 dígitos (por ejemplo SOL-001000).",
      objective: "Selecciona las decisiones de diseño correctas.",
    },
    multiple: true,
    options: [
      { id: "manual-knowledge", label: "Preguntas frecuentes (\"¿cómo me conecto a la VPN?\") → subir el manual como knowledge", consequence: "Es contenido estable y redactado: las respuestas generativas lo resumen y lo citan sin que diseñes un topic por pregunta.", score: 1 },
      { id: "estado-flow", label: "\"¿En qué estado está mi solicitud?\" → un topic que llama a un agent flow que lee Dataverse", consequence: "El estado cambia a cada rato: solo una consulta en el momento a Dataverse da el valor actual.", score: 1 },
      { id: "numero-regex", label: "Reconocer el número de solicitud → entidad Regular expression con el patrón SOL-\\d{6}", consequence: "El patrón reconoce el formato completo, con prefijo y ceros, y permite slot filling desde el primer mensaje.", score: 1 },
      { id: "numero-number", label: "Reconocer el número de solicitud → entidad predefinida Number", consequence: "Number se queda con un número: pierde el prefijo SOL- y los ceros, y el filtro en Dataverse no encuentra la fila.", score: 0 },
      { id: "estado-knowledge", label: "Estado de las solicitudes → exportar la tabla a Excel cada lunes y subirla como knowledge", consequence: "Un archivo subido es una copia estática: el martes ya responde con estados viejos, y cualquiera con acceso al agente puede leer todas las filas.", score: 0 },
      { id: "topic-por-faq", label: "Crear un topic con trigger phrases por cada pregunta del manual", consequence: "Duplica el manual en decenas de topics que hay que mantener a mano; para contenido redactado el knowledge lo resuelve mejor.", score: 0 },
    ],
    correctOptionIds: ["manual-knowledge", "estado-flow", "numero-regex"],
    hints: [
      { id: "h1", content: "Para cada necesidad pregúntate: ¿el dato cambia a cada rato o casi nunca? ¿tiene un formato propio?" },
      { id: "h2", content: "Lo estable y redactado va como knowledge; lo que cambia se consulta en el momento con una herramienta; un formato propio se reconoce con una entidad personalizada." },
      { id: "h3", content: "Manual → knowledge; estado → topic + agent flow; número SOL-001000 → regex, no Number." },
    ],
    relatedModuleIds: [15],
    relatedLabIds: ["LAB-022"],
    tags: ["copilot-studio", "knowledge", "agent-flow", "entidades"],
  },
  {
    id: "IP-TRB-011",
    slug: "ip-trb-011-agente-no-encuentra-la-solicitud",
    title: "Diagnosticar: el agente no encuentra la solicitud",
    description: "A partir de un síntoma exacto, identifica por qué el agent flow no encuentra solicitudes que sí existen.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 15"],
    learningObjectives: [
      "Leer el panel Variables y el historial del flujo para seguir el dato de punta a punta",
      "Reconocer que la entidad Number pierde el prefijo y los ceros de un código como SOL-001000",
    ],
    scenario: {
      context: "Un compañero construyó el topic Consultar Estado Solicitud y un agent flow con List rows filtrando por la columna Número de Solicitud. Con SOL-001000, que existe en Dataverse, el agente siempre responde \"No encontré una solicitud con ese número\".",
      objective: "Antes de mirar la solución, di dónde se pierde el dato y qué hay que cambiar.",
    },
    implementation: "Nodo Ask a question → Identify: Number\nVariable Topic.NumeroSolicitud (panel Variables): 1000\nNodo Action → entrada NumeroSolicitud = Topic.NumeroSolicitud\nHistorial del flujo → Filter rows: sit_numerodesolicitud eq '1000'\nList rows → 0 filas",
    symptom: "El usuario escribe SOL-001000, pero al flujo llega 1000 y el filtro no encuentra ninguna fila.",
    fixPrompt: "¿Qué hay que cambiar y dónde?",
    acceptableFixes: ["regex", "expresion regular", "regular expression", "entidad", "number", "prefijo", "sol-", "texto"],
    testCases: [
      { id: "con-number", input: "La pregunta identifica la entidad Number", expected: "la variable guarda 1000 y List rows devuelve 0 filas" },
      { id: "con-regex", input: "La pregunta identifica una entidad Regular expression con el patrón SOL-\\d{6}", expected: "la variable guarda SOL-001000 y List rows devuelve la solicitud" },
    ],
    hints: [
      { id: "h1", content: "Sigue el dato: compara lo que escribió el usuario, lo que muestra el panel Variables y lo que llegó al Filter rows." },
      { id: "h2", content: "La entidad Number guarda un número: se queda sin el texto SOL- y sin los ceros de la izquierda." },
      { id: "h3", content: "En el nodo de la pregunta cambia Identify de Number a una entidad Regular expression (regex) con el patrón SOL-\\d{6}, para que la variable guarde el texto completo con su prefijo." },
    ],
    relatedModuleIds: [15],
    relatedLabIds: ["LAB-022"],
    tags: ["copilot-studio", "troubleshooting", "entidades", "agent-flow"],
  },
  {
    id: "IP-CS-002",
    slug: "ip-cs-002-agente-de-recursos-humanos",
    title: "Transferir: un agente para Recursos Humanos",
    description: "El mismo patrón del agente de soporte TI en otro negocio — decide qué pieza usar para cada necesidad.",
    type: "multiple-decision",
    domain: "copilot-studio",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 15"],
    learningObjectives: [
      "Transferir la elección entre knowledge, agent flow y entidades a un caso nuevo",
      "Tener en cuenta quién puede ver cada dato al elegir la fuente",
    ],
    scenario: {
      context: "Recursos Humanos quiere un agente en Teams. Los empleados preguntan su saldo de vacaciones (está en Dataverse y es distinto para cada persona), preguntan por la política de vacaciones (un documento en SharePoint que RR.HH. actualiza cada trimestre) y, a veces, consultan con su código de empleado (EMP- seguido de 5 dígitos) en un topic y luego en otro.",
      objective: "Selecciona las decisiones de diseño correctas.",
    },
    multiple: true,
    options: [
      { id: "saldo-flow-usuario", label: "Saldo de vacaciones → agent flow que filtra Dataverse por el correo del usuario autenticado (System.User.Email)", consequence: "Cada empleado ve solo su saldo, al día, sin tener que escribir quién es.", score: 1 },
      { id: "politica-sharepoint", label: "Política de vacaciones → knowledge con la fuente SharePoint", consequence: "SharePoint se consulta en el momento de la pregunta y respeta los permisos: cuando RR.HH. actualiza el documento, el agente responde con la versión nueva.", score: 1 },
      { id: "codigo-regex-global", label: "Código de empleado → entidad regex EMP-\\d{5} y pasar la variable al otro topic (global o recibir valores de otros topics)", consequence: "El formato se reconoce completo y el empleado no tiene que repetirlo al cambiar de topic.", score: 1 },
      { id: "saldo-knowledge-excel", label: "Saldo de vacaciones → subir un Excel con los saldos de todos como knowledge", consequence: "Un archivo subido es una copia estática y cualquiera con acceso al agente puede consultarla: expone los saldos de todos y envejece.", score: 0 },
      { id: "politica-subida-una-vez", label: "Política de vacaciones → descargar el documento y subirlo como archivo una sola vez", consequence: "El archivo subido no se actualiza solo: después del primer trimestre el agente responde con la política vieja.", score: 0 },
      { id: "codigo-topic-variable", label: "Código de empleado → volver a preguntarlo en cada topic con una variable de topic", consequence: "Funciona, pero obliga al empleado a repetir el código cada vez: la variable de topic se pierde al salir del topic.", score: 0 },
    ],
    correctOptionIds: ["saldo-flow-usuario", "politica-sharepoint", "codigo-regex-global"],
    hints: [
      { id: "h1", content: "Repite las tres preguntas del agente de soporte: ¿el dato cambia? ¿es distinto para cada persona? ¿tiene un formato propio?" },
      { id: "h2", content: "Lo personal y vivo se consulta con una herramienta filtrando por el usuario; un documento que cambia se conecta en vivo; una variable que debe sobrevivir al topic se pasa entre topics." },
      { id: "h3", content: "Saldo → agent flow con System.User.Email; política → SharePoint; código EMP-\\d{5} → regex y variable compartida entre topics." },
    ],
    relatedModuleIds: [15],
    relatedLabIds: ["LAB-022"],
    tags: ["copilot-studio", "transferencia", "knowledge", "seguridad"],
  },
  {
    id: "IP-APP-014",
    slug: "ip-app-014-modelo-crm-lite",
    title: "Diseñar el modelo del CRM-lite",
    description: "Decide qué tablas reutilizar, cuáles crear y cómo modelar etapa y montos antes de construir las apps.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 9", "Módulo 16"],
    learningObjectives: [
      "Reutilizar tablas estándar de Dataverse y saber cuáles solo existen con las apps de Dynamics 365",
      "Elegir Choice, columna calculada y rollup según el dato",
    ],
    scenario: {
      context: "Vas a construir el CRM-lite del Proyecto Integrador en un entorno Developer con Dataverse, sin aplicaciones de Dynamics 365. Necesitas clientes (empresas), contactos, oportunidades con etapa y monto ponderado, propuestas por oportunidad y los competidores de cada oportunidad.",
      objective: "Selecciona las decisiones de modelado correctas.",
    },
    multiple: true,
    options: [
      { id: "cuenta-contacto-nativas", label: "Clientes y contactos → reutilizar las tablas estándar Account y Contact", consequence: "Ya existen en todo entorno con Dataverse, relacionadas entre sí, y otras apps y conectores las entienden.", score: 1 },
      { id: "oportunidad-propia", label: "Oportunidades y competidores → tablas propias con el prefijo sit_, con una relación many-to-many entre ellas", consequence: "Opportunity y Competitor las agregan las apps de Dynamics 365: en este entorno no existen, así que se crean propias.", score: 1 },
      { id: "etapa-choice", label: "Etapa → columna Choice con las etapas (Prospección … Ganada, Perdida)", consequence: "Los valores quedan fijos y consistentes en apps, flujos y Power BI; no hay \"Negociacion\" y \"Negociación\" mezclados.", score: 1 },
      { id: "monto-calculado-rollup", label: "Monto ponderado → columna calculada; número de propuestas → rollup", consequence: "Dataverse los mantiene: nadie los escribe a mano ni se desincronizan.", score: 1 },
      { id: "competitor-nativa", label: "Competidores → usar la tabla estándar Competitor, que está en cualquier entorno", consequence: "Competitor es de las apps de Dynamics 365 (Sales): en un entorno sin ellas no aparece.", score: 0 },
      { id: "etapa-texto", label: "Etapa → columna de texto libre para que cada vendedor escriba la suya", consequence: "Cada uno la escribe distinto y los filtros, el Kanban y las medidas DAX dejan de coincidir.", score: 0 },
      { id: "cuenta-propia", label: "Clientes → crear una tabla propia sit_cliente aunque Account ya existe", consequence: "Duplica una tabla estándar sin necesidad y pierde su relación con Contact.", score: 0 },
    ],
    correctOptionIds: ["cuenta-contacto-nativas", "oportunidad-propia", "etapa-choice", "monto-calculado-rollup"],
    hints: [
      { id: "h1", content: "Para cada tabla pregúntate: ¿existe ya en un entorno con Dataverse sin Dynamics 365?" },
      { id: "h2", content: "Account y Contact son de Dataverse; Opportunity y Competitor las agregan las apps de Dynamics 365. Un dato con valores fijos es Choice; un dato derivado lo calcula Dataverse." },
      { id: "h3", content: "Reutiliza Account y Contact, crea Oportunidad y Competidor propias con N:N, Etapa como Choice, monto ponderado calculado y número de propuestas como rollup." },
    ],
    relatedModuleIds: [17, 9],
    relatedLabIds: ["LAB-009"],
    tags: ["dataverse", "modelo-de-datos", "proyecto-integrador"],
  },
  {
    id: "IP-TRB-012",
    slug: "ip-trb-012-dashboard-test-con-datos-de-dev",
    title: "Diagnosticar: el dashboard de TEST muestra datos de DEV",
    description: "A partir de un síntoma exacto, identifica por qué el informe desplegado sigue leyendo el entorno de desarrollo.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 5,
    prerequisites: ["Módulo 12", "Módulo 16"],
    learningObjectives: [
      "Saber que un informe de Power BI no viaja dentro de la solución: su origen de datos se cambia aparte",
      "Distinguir un problema de origen de datos de uno de gateway (Dataverse está en la nube)",
    ],
    scenario: {
      context: "Tras importar SIT CRM Lite como Managed en TEST, un compañero publicó el mismo .pbix en un workspace de TEST. El gerente crea una oportunidad de prueba en la Canvas App de TEST, actualiza el modelo semántico y no la ve; en cambio, ve oportunidades que solo existen en DEV.",
      objective: "Antes de mirar la solución, di por qué pasa y qué hay que cambiar.",
    },
    implementation: "Power Query → Origen: Dataverse, Environment domain: sit-dev.crm.dynamics.com\nWorkspace: CRM Lite TEST\nCanvas App y solución: entorno TEST\nActualización del modelo semántico: correcta, sin errores",
    symptom: "El dashboard de TEST muestra las oportunidades de DEV y no las creadas en TEST, aunque la actualización termina sin errores.",
    fixPrompt: "¿Qué hay que cambiar y dónde?",
    acceptableFixes: ["environment domain", "entorno", "power query", "origen", "url", "credenciales", "test", "dominio"],
    testCases: [
      { id: "origen-dev", input: "La consulta de Power Query apunta al Environment domain de DEV", expected: "el informe de TEST muestra las filas de DEV" },
      { id: "origen-test", input: "Se cambia el Environment domain al de TEST, se actualizan las credenciales del origen y se vuelve a publicar", expected: "el informe muestra la oportunidad creada en TEST" },
    ],
    hints: [
      { id: "h1", content: "La actualización no falla: el problema no es de acceso, sino de a qué entorno se conecta el informe." },
      { id: "h2", content: "El informe de Power BI no está dentro de la solución: su consulta de Power Query sigue con el origen con el que se creó." },
      { id: "h3", content: "En Power Query cambia el Environment domain del origen Dataverse de DEV al de TEST, actualiza las credenciales del origen en el servicio y vuelve a publicar. No hace falta gateway: Dataverse está en la nube." },
    ],
    relatedModuleIds: [17, 12, 16],
    relatedLabIds: ["LAB-062"],
    tags: ["power-bi", "troubleshooting", "alm", "entornos"],
  },
  {
    id: "IP-APP-015",
    slug: "ip-app-015-crm-lite-clinica-veterinaria",
    title: "Transferir: CRM-lite para una clínica veterinaria",
    description: "El mismo sistema con otro negocio — decide qué piezas se reutilizan y cuáles cambian.",
    type: "multiple-decision",
    domain: "power-apps",
    level: "junior",
    estimatedMinutes: 8,
    prerequisites: ["Módulo 17"],
    learningObjectives: [
      "Transferir las decisiones del CRM-lite (tablas, Child Flow, canal del agente) a un negocio nuevo",
      "Elegir canal y autenticación del agente según quién lo usa",
    ],
    scenario: {
      context: "Una red de clínicas veterinarias quiere el CRM-lite. Los clientes son dueños de mascotas (personas, no empresas) y cada uno puede tener varias mascotas; se venden presupuestos de tratamiento que debe aprobar el veterinario jefe si superan un monto; y los dueños, que no tienen cuenta de la organización, quieren consultar su presupuesto desde la web de la clínica.",
      objective: "Selecciona las decisiones de diseño correctas.",
    },
    multiple: true,
    options: [
      { id: "duenos-contact", label: "Dueños → tabla estándar Contact, con una tabla propia Mascota relacionada con Contact (1:N)", consequence: "Los dueños son personas: Contact es la tabla estándar para eso, y cada dueño puede tener varias mascotas.", score: 1 },
      { id: "presupuesto-childflow", label: "Aprobación → reutilizar el patrón del Child Flow por monto, con el veterinario jefe como aprobador en una Environment Variable", consequence: "La lógica de umbrales es la misma; solo cambian el aprobador y los montos, que se configuran por entorno.", score: 1 },
      { id: "bot-web-auth", label: "Agente → canal de sitio web y verificar la identidad del dueño antes de mostrar un presupuesto", consequence: "Los dueños no tienen cuenta de la organización, así que no sirve la autenticación de Microsoft de Teams; hay que identificarlos de otra forma antes de dar datos personales.", score: 1 },
      { id: "bot-teams-duenos", label: "Agente → publicarlo solo en Teams y filtrar por System.User.Email", consequence: "Los dueños no están en Teams ni tienen cuenta de la organización: nunca llegarían al agente.", score: 0 },
      { id: "sin-autenticacion", label: "Agente → sitio web sin autenticación, y mostrar el presupuesto a quien escriba un número", consequence: "Cualquiera que adivine un número vería el tratamiento y el monto de otra familia.", score: 0 },
      { id: "duenos-account", label: "Dueños → tabla Account, como en el CRM-lite original", consequence: "Account representa empresas; un dueño de mascota es una persona y encaja en Contact.", score: 0 },
    ],
    correctOptionIds: ["duenos-contact", "presupuesto-childflow", "bot-web-auth"],
    hints: [
      { id: "h1", content: "Pregúntate quién es el cliente (¿empresa o persona?) y quién usa el agente (¿empleados o público?)." },
      { id: "h2", content: "Personas van en Contact; la lógica de aprobación por monto es reutilizable; un público sin cuenta de la organización no puede usar el canal de Teams ni la autenticación de Microsoft." },
      { id: "h3", content: "Contact + Mascota, el mismo Child Flow con otro aprobador, y un agente web que verifica al dueño antes de mostrar datos." },
    ],
    relatedModuleIds: [17, 15],
    relatedLabIds: ["LAB-062"],
    tags: ["proyecto-integrador", "transferencia", "copilot-studio", "modelo-de-datos"],
  },
  {
    id: "IP-DV-013",
    slug: "ip-dv-013-elegir-columna-derivada",
    title: "Elegir el tipo de columna derivada correcto",
    description: "Decide entre columna de fórmula, calculada y rollup para cuatro necesidades del modelo de solicitudes.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 7,
    prerequisites: ["Módulo 9"],
    learningObjectives: [
      "Distinguir una columna de fórmula o calculada (lee el mismo registro o su padre) de una rollup (agrega los hijos de una relación 1:N)",
      "Reconocer los límites documentados: rollup solo sobre 1:N, columnas derivadas que no disparan workflows ni plug-ins y columnas simples que no se convierten en calculadas",
    ],
    scenario: {
      context: "El equipo de soporte pide cuatro cosas sobre el modelo Solicitud TI / Categoría del Lab 02: ver en cada solicitud la fecha en que vence su SLA (Fecha Solicitud + SLA Horas), ver en cada Categoría cuántas solicitudes abiertas tiene, mostrar en la solicitud el SLA definido en su Categoría y, por último, contar solicitudes por Etiqueta (Etiqueta y Solicitud TI están unidas por una relación muchos a muchos).",
      objective: "Selecciona todas las decisiones correctas y descarta las que la plataforma no permite.",
    },
    multiple: true,
    options: [
      { id: "formula-vence", label: "Vence SLA: columna de fórmula (Power Fx) en Solicitud TI con DateAdd sobre Fecha Solicitud y SLA Horas", consequence: "Correcto: una columna de fórmula calcula el valor a partir de columnas del mismo registro cuando se lee la fila; DateAdd está admitida para fechas.", score: 1 },
      { id: "rollup-categoria", label: "Solicitudes abiertas: columna rollup en Categoría con COUNT sobre la relación 1:N y un filtro por Estado", consequence: "Correcto: rollup agrega los registros hijos de una relación 1:N y admite filtros sobre columnas simples como Estado. Se actualiza con un trabajo asíncrono (por defecto cada hora) o con Recalculate.", score: 1 },
      { id: "padre-sla", label: "SLA de la Categoría en la solicitud: columna calculada o de fórmula que lee la columna del registro padre a través del Lookup Categoría", consequence: "Correcto: las columnas calculadas pueden usar columnas de la tabla padre (relación N:1) y las de fórmula, columnas de una tabla relacionada.", score: 1 },
      { id: "rollup-nn", label: "Solicitudes por Etiqueta: columna rollup que agrega sobre la relación muchos a muchos", consequence: "No se puede: las rollup solo agregan sobre relaciones 1:N, no sobre N:N. Necesitarías una tabla intermedia propia con relaciones 1:N.", score: 0 },
      { id: "disparar-plugin", label: "Usar el cambio de valor de la columna derivada para disparar un workflow o un plug-in", consequence: "Learn indica que las columnas calculadas y las de fórmula no pueden disparar workflows ni plug-ins: el disparador debe ir sobre las columnas de origen.", score: 0 },
      { id: "convertir-simple", label: "Convertir la columna simple SLA Horas que ya existe en calculada, sin crear otra", consequence: "No se puede convertir una columna simple en calculada: hay que crear una columna nueva con Behavior Calculated.", score: 0 },
    ],
    correctOptionIds: ["formula-vence", "rollup-categoria", "padre-sla"],
    hints: [
      { id: "h1", content: "Para cada necesidad pregúntate: ¿el dato sale de esta misma fila (o de su padre) o de sumar o contar muchas filas hijas?" },
      { id: "h2", content: "Fórmula y calculada leen el mismo registro o su padre; rollup agrega hijos, pero solo por una relación 1:N. Ninguna columna derivada dispara workflows ni plug-ins." },
      { id: "h3", content: "Vence SLA va en fórmula, el conteo por Categoría en rollup y el SLA del padre en una calculada o de fórmula. La rollup sobre N:N, el disparador sobre la columna derivada y la conversión de una columna simple no son posibles." },
    ],
    relatedModuleIds: [9],
    relatedLabIds: ["LAB-009"],
    tags: ["dataverse", "rollup", "formula-column", "calculated-column"],
  },
  {
    id: "IP-TRB-007",
    slug: "ip-trb-007-regla-bloqueo-no-protege",
    title: "Diagnosticar: la regla bloquea el campo, pero un flujo lo sigue cambiando",
    description: "A partir de un síntoma exacto, identifica qué acciones de una Business Rule se aplican en el servidor y cuáles solo en formularios.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 9"],
    learningObjectives: [
      "Saber que bloquear, mostrar u ocultar y exigir columnas son acciones que solo funcionan en formularios, aunque el Scope sea Entity",
      "Elegir un mecanismo que sí proteja el dato en el servidor: Show Error Message con Scope Entity o seguridad de columna",
    ],
    scenario: {
      context: "En Solicitud TI hay una Business Rule activa, \"Bloquear presupuesto si Cancelada\", con Scope Entity. En el formulario de la app la columna Presupuesto aparece bloqueada cuando Estado es Cancelada. Pero un flujo de Power Automate que actualiza filas sigue cambiando el Presupuesto de solicitudes canceladas, sin ningún error.",
      objective: "Antes de mirar la solución, explica por qué el flujo no se detiene y qué cambiarías para que el dato quede protegido también fuera del formulario.",
    },
    implementation: "Business Rule: Bloquear presupuesto si Cancelada\nScope: Entity\nCondición: Estado = Cancelada\nAcción: Lock/Unlock → Presupuesto: Lock\nResultado en el formulario: Presupuesto bloqueado\nResultado desde el flujo (Update a row): Presupuesto modificado sin error",
    symptom: "La columna se ve bloqueada en el formulario, pero el flujo la modifica sin que la regla lo impida.",
    fixPrompt: "¿Por qué ocurre y qué cambiarías para proteger el dato también en el servidor?",
    acceptableFixes: ["formulario", "servidor", "show error message", "mensaje de error", "seguridad de columna", "column security", "bloquear", "lock"],
    testCases: [
      { id: "solo-lock", input: "La regla solo tiene la acción Lock con Scope Entity", expected: "el formulario bloquea la columna, pero el flujo la sigue cambiando" },
      { id: "show-error", input: "Se agrega Show Error Message (Scope Entity) cuando Estado = Cancelada y cambia el Presupuesto", expected: "el guardado desde el flujo falla con el mensaje de la regla" },
      { id: "column-security", input: "La columna Presupuesto tiene seguridad de columna y solo el equipo de Finanzas tiene Update", expected: "los demás usuarios no pueden actualizarla desde ningún canal (los administradores del sistema no se ven afectados)" },
    ],
    hints: [
      { id: "h1", content: "El Scope Entity no significa que todas las acciones de la regla se apliquen en el servidor: depende de la acción." },
      { id: "h2", content: "Learn: con Scope Entity, en el servidor se aplican establecer o borrar valores, valores predeterminados y Show Error Message. Bloquear, mostrar u ocultar y exigir solo funcionan en formularios." },
      { id: "h3", content: "La acción Lock solo actúa en el formulario. Para proteger el dato agrega Show Error Message con Scope Entity cuando Estado = Cancelada, o usa seguridad de columna para que solo Finanzas tenga Update." },
    ],
    relatedModuleIds: [9],
    relatedLabIds: ["LAB-009", "LAB-002"],
    tags: ["troubleshooting", "business-rules", "scope", "dataverse"],
  },
  {
    id: "IP-DV-014",
    slug: "ip-dv-014-transferir-modelo-rrhh",
    title: "Transferir: del modelo de solicitudes al de Recursos Humanos",
    description: "Las mismas piezas de Dataverse Avanzado en otro negocio: decide cuáles protegen de verdad un dato sensible.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 9,
    prerequisites: ["Módulo 9"],
    learningObjectives: [
      "Aplicar seguridad de columna, auditoría, rollup y tabla intermedia a un requisito distinto del visto en el módulo",
      "Reconocer las soluciones que solo esconden el dato en el formulario o que se prueban mal",
    ],
    scenario: {
      context: "Recursos Humanos tiene las tablas Empleado (con un Lookup a Departamento) y Proyecto. Pide cuatro cosas: (1) que el Salario solo lo vea y edite el equipo de Nómina; (2) saber quién cambió un Salario, cuándo y de qué valor a qué valor; (3) ver en cada Departamento cuántos empleados tiene; (4) asignar empleados a proyectos guardando el rol de cada persona en cada proyecto.",
      objective: "Selecciona todas las decisiones correctas.",
    },
    multiple: true,
    options: [
      { id: "seguridad-columna", label: "Habilitar seguridad de columna en Salario y dar Read y Update en un perfil asignado al equipo de Nómina; probarlo con un usuario que no sea administrador del sistema", consequence: "Correcto: la seguridad de columna se aplica en todos los canales. Se asigna a usuarios o equipos y no restringe a quien tiene el rol System Administrator, por eso la prueba se hace con otro usuario.", score: 1 },
      { id: "auditoria", label: "Activar la auditoría del ambiente, de la tabla Empleado y de la columna Salario", consequence: "Correcto: la auditoría guarda el valor anterior y el nuevo, quién y cuándo, y se consulta en Audit History del registro. Consume capacidad de almacenamiento de logs.", score: 1 },
      { id: "rollup-departamento", label: "Columna rollup COUNT en Departamento sobre la relación 1:N con Empleado", consequence: "Correcto: es una agregación de hijos sobre una relación 1:N. Recuerda que no es instantánea: se actualiza de forma asíncrona o con Recalculate.", score: 1 },
      { id: "tabla-intermedia", label: "Tabla intermedia Asignación (Lookup a Empleado, Lookup a Proyecto y columna Rol en el proyecto)", consequence: "Correcto: la relación N:N nativa no guarda columnas propias; si necesitas el rol de cada asignación, la tabla intermedia es la opción.", score: 1 },
      { id: "ocultar-regla", label: "Ocultar el Salario con una Business Rule para que nadie fuera de Nómina lo lea", consequence: "No protege el dato: mostrar u ocultar solo funciona en formularios; el valor sigue disponible en vistas, exportaciones, flujos y API.", score: 0 },
      { id: "probar-admin", label: "Probar la seguridad de columna con tu propio usuario System Administrator", consequence: "La prueba no demuestra nada: la seguridad de columna no se aplica a los administradores del sistema, que siempre ven el dato.", score: 0 },
      { id: "nn-nativa-rol", label: "Relación N:N nativa entre Empleado y Proyecto, y guardar el rol en la tabla Empleado", consequence: "Una persona tendría un solo rol para todos sus proyectos: el rol pertenece a la asignación, no al empleado.", score: 0 },
    ],
    correctOptionIds: ["seguridad-columna", "auditoria", "rollup-departamento", "tabla-intermedia"],
    hints: [
      { id: "h1", content: "Separa lo que protege el dato en el servidor de lo que solo cambia cómo se ve en un formulario." },
      { id: "h2", content: "Dato sensible: seguridad de columna, probada con un usuario que no sea administrador. Trazabilidad: auditoría. Conteo de hijos: rollup sobre 1:N. Dato de la relación: tabla intermedia." },
      { id: "h3", content: "Son correctas la seguridad de columna para Nómina, la auditoría de Salario, la rollup en Departamento y la tabla intermedia Asignación. Ocultar con Business Rule, probar como administrador y guardar el rol en Empleado fallan." },
    ],
    relatedModuleIds: [9],
    relatedLabIds: ["LAB-009"],
    tags: ["transferencia", "dataverse", "seguridad-de-columna", "auditoria"],
  },
  {
    id: "IP-DV-015",
    slug: "ip-dv-015-parametrizar-antes-de-mover",
    title: "Qué parametrizar antes de mover la solución a TEST",
    description: "Decide qué va en variables de entorno, qué en referencias de conexión y qué no hace falta parametrizar.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 7,
    prerequisites: ["Módulo 16"],
    learningObjectives: [
      "Distinguir una variable de entorno (un valor que cambia por ambiente) de una referencia de conexión (la credencial con la que se conecta el flujo)",
      "Saber que el valor actual de una variable no debe viajar dentro de la solución",
    ],
    scenario: {
      context: "Tu flujo SIT — Notificar Nueva Solicitud está en la solución SIT_SolicitudesInternas en DEV. El correo del destinatario está escrito a mano dentro de la acción, el cuerpo del correo lleva el enlace a un portal externo de pruebas y las conexiones de Dataverse y Office 365 Outlook son las de tu usuario. Vas a exportarla como managed e importarla en SIT-TEST.",
      objective: "Selecciona todas las decisiones correctas antes de exportar.",
    },
    multiple: true,
    options: [
      { id: "var-correo", label: "Variable de entorno de tipo Text para el correo del destinatario, usada en el flujo desde Dynamic content", consequence: "Correcto: el valor cambia por ambiente y el flujo de la solución la ofrece en Dynamic content sin ninguna acción especial.", score: 1 },
      { id: "conn-refs", label: "Referencias de conexión para Dataverse y Office 365 Outlook, que se mapean a conexiones de TEST en el asistente de importación", consequence: "Correcto: los flujos dentro de una solución usan referencias de conexión; al importar eliges qué conexión real usa cada una en el ambiente destino.", score: 1 },
      { id: "var-url", label: "Variable de entorno de tipo Text para la URL del portal externo", consequence: "Correcto: es un valor que difiere entre ambientes; parametrizarlo evita editar el flujo en cada uno.", score: 1 },
      { id: "var-tabla", label: "Variable de entorno con el nombre de la tabla Solicitud TI para que el flujo la encuentre en TEST", consequence: "Innecesario: Learn explica que para las tablas de Dataverse del ambiente actual no hace falta variable de entorno; se buscan por el mismo nombre en el ambiente al que portes la solución.", score: 0 },
      { id: "valor-en-solucion", label: "Dejar el Current Value de DEV dentro de la solución para que TEST ya quede configurado", consequence: "Es el error clásico: el valor de DEV viaja y TEST lo usa. Learn recomienda incluir la definición, no el valor, y dar el valor del destino al importar.", score: 0 },
      { id: "ref-por-flujo", label: "Crear una referencia de conexión distinta para cada flujo", consequence: "No hace falta: una referencia de conexión puede usarse en muchos flujos. Multiplicarlas obliga a mapear más conexiones en cada importación.", score: 0 },
    ],
    correctOptionIds: ["var-correo", "conn-refs", "var-url"],
    hints: [
      { id: "h1", content: "Pregúntate en cada caso: ¿es un valor que cambia entre DEV y TEST, o es la credencial con la que el flujo se conecta?" },
      { id: "h2", content: "Valores que cambian por ambiente → variables de entorno (definición en la solución, valor en el destino). Credenciales → referencias de conexión. Las tablas de Dataverse no necesitan variable." },
      { id: "h3", content: "Correo y URL en variables de entorno de tipo Text y las dos conexiones como referencias. No dejes el valor de DEV en la solución ni crees una referencia por flujo." },
    ],
    relatedModuleIds: [16],
    relatedLabIds: ["LAB-005", "LAB-019"],
    tags: ["alm", "environment-variables", "connection-references"],
  },
  {
    id: "IP-TRB-008",
    slug: "ip-trb-008-variable-con-valor-de-dev",
    title: "Diagnosticar: en TEST el flujo sigue enviando correos al buzón de DEV",
    description: "A partir de un síntoma exacto, identifica por qué una variable de entorno conserva el valor de desarrollo después de importar.",
    type: "debug-scenario",
    domain: "troubleshooting",
    level: "junior",
    estimatedMinutes: 6,
    prerequisites: ["Módulo 16"],
    learningObjectives: [
      "Saber que el Current Value de una variable de entorno viaja en la solución si no se quita antes de exportar, y que tiene prioridad sobre el Default Value",
      "Corregir el valor en el ambiente destino y evitar que se repita en la próxima exportación",
    ],
    scenario: {
      context: "Importaste la solución managed en SIT-TEST. El asistente no te pidió ningún valor para la variable Correo Equipo TI y la importación terminó sin errores. Al crear una solicitud en TEST, el correo llega al buzón que usabas en DEV.",
      objective: "Antes de mirar la solución, explica por qué TEST usa el valor de DEV y qué harías en TEST y en DEV.",
    },
    implementation: "Variable de entorno: Correo Equipo TI (Text)\nDefault Value: (vacío)\nCurrent Value: tu-correo-de-dev@... (incluido en la solución)\nExportación: managed, sin quitar el valor\nImportación en SIT-TEST: el asistente no pidió valor\nResultado: el flujo de TEST envía al buzón de DEV",
    symptom: "Después de importar en TEST, el flujo envía los correos al destinatario configurado en DEV y el asistente no pidió un valor nuevo.",
    fixPrompt: "¿Qué viajó en la solución, qué corriges en TEST y qué cambias en DEV antes de la próxima exportación?",
    acceptableFixes: ["valor actual", "current value", "remove from this solution", "quitar el valor", "default solution", "variable de entorno", "environment variable", "antes de exportar"],
    testCases: [
      { id: "valor-viaja", input: "El Current Value de DEV está incluido en la solución exportada", expected: "la importación no pide valor y TEST usa el correo de DEV" },
      { id: "valor-quitado", input: "En DEV se quita el valor de la solución (... > Remove from this solution) antes de exportar y no hay Default Value", expected: "el valor sigue en DEV y la importación en TEST pide un valor nuevo" },
      { id: "corregir-test", input: "En TEST se cambia el valor actual de la variable desde la Default solution", expected: "el flujo usa el correo de TEST (el cambio puede tardar hasta una hora; reiniciar el flujo lo aplica antes)" },
    ],
    hints: [
      { id: "h1", content: "El asistente de importación solo pide un valor cuando la variable llega sin Default Value y sin Current Value." },
      { id: "h2", content: "El Current Value tiene prioridad sobre el Default Value y, si no lo quitas de la solución, se exporta con ella. Learn recomienda incluir la definición, no el valor." },
      { id: "h3", content: "En TEST, abre la variable en la Default solution y pon el correo de TEST. En DEV, en la solución, en Current Value elige ... > Remove from this solution antes de exportar: el valor sigue en DEV y la próxima importación lo pedirá." },
    ],
    relatedModuleIds: [16],
    relatedLabIds: ["LAB-005", "LAB-019"],
    tags: ["troubleshooting", "alm", "environment-variables"],
  },
  {
    id: "IP-DV-016",
    slug: "ip-dv-016-transferir-cliente-clinica",
    title: "Transferir: entregar la solución a una red de clínicas",
    description: "El mismo patrón de ambientes, soluciones y seguridad con un cliente distinto: decide qué es defendible.",
    type: "multiple-decision",
    domain: "dataverse",
    level: "junior",
    estimatedMinutes: 9,
    prerequisites: ["Módulo 16"],
    learningObjectives: [
      "Aplicar mínimo privilegio con unidades de negocio y niveles de acceso a un caso nuevo",
      "Combinar soluciones managed, variables de entorno y data policies en una entrega a cliente",
    ],
    scenario: {
      context: "Una red de clínicas con 3 sedes compra tu solución de citas. Requisitos: cada gerente de sede ve solo las citas de su sede y la dirección ve todas; cada cliente usa un endpoint distinto de su sistema de facturación; el área de seguridad prohíbe que los datos de pacientes se combinen con cuentas personales de Gmail en un flujo; y a veces habrá correcciones urgentes en producción.",
      objective: "Selecciona todas las decisiones correctas.",
    },
    multiple: true,
    options: [
      { id: "bu-niveles", label: "Una unidad de negocio por sede; rol de gerente con nivel Business Unit sobre Cita y rol de dirección con nivel Organization", consequence: "Correcto: el nivel de acceso del privilegio decide qué filas alcanza el rol. Business Unit limita a la sede; Organization da todas.", score: 1 },
      { id: "managed", label: "Importar en TEST y en PROD como managed; las correcciones urgentes se hacen en DEV y se exporta una versión nueva", consequence: "Correcto: managed protege el destino y la corrección queda en la fuente, con su número de versión.", score: 1 },
      { id: "var-endpoint", label: "Variable de entorno de tipo Text para el endpoint de facturación, con el valor de cada cliente al importar", consequence: "Correcto: la misma solución sirve a todos los clientes y cada uno pone su valor sin editar flujos.", score: 1 },
      { id: "dlp-gmail", label: "Una data policy que deje Gmail en un grupo distinto al de Dataverse (o bloqueado) en los ambientes del cliente", consequence: "Correcto: un flujo no puede combinar conectores de grupos distintos (Business y Non-business); los conectores bloqueados no se pueden usar.", score: 1 },
      { id: "editar-prod", label: "Hacer la corrección urgente directamente en PROD para ganar tiempo", consequence: "El cambio queda en una capa unmanaged encima de la solución managed y tiene prioridad sobre ella: la próxima versión que importes no se verá como esperas y DEV queda desactualizado.", score: 0 },
      { id: "unmanaged-prod", label: "Importar en PROD como unmanaged para que el cliente pueda hacer ajustes", consequence: "Unmanaged en producción permite editar los componentes ahí mismo y los ambientes divergen: lo que se cambia en PROD ya no coincide con DEV.", score: 0 },
      { id: "admin-gerentes", label: "Dar System Administrator a los gerentes de sede para evitar tickets de permisos", consequence: "Viola el mínimo privilegio: los privilegios de los roles son acumulativos y ese rol les daría acceso total, incluida la configuración del ambiente.", score: 0 },
    ],
    correctOptionIds: ["bu-niveles", "managed", "var-endpoint", "dlp-gmail"],
    hints: [
      { id: "h1", content: "Revisa cada requisito por separado: qué filas ve cada rol, cómo viajan los cambios, qué cambia por cliente y qué conectores se pueden combinar." },
      { id: "h2", content: "Filas visibles → nivel de acceso del rol y unidades de negocio. Cambios → DEV y managed. Valores por cliente → variables de entorno. Conectores → data policy." },
      { id: "h3", content: "Son correctas las unidades de negocio con niveles Business Unit y Organization, managed con correcciones en DEV, la variable para el endpoint y la data policy para Gmail. Editar en PROD, unmanaged en PROD y System Administrator para gerentes fallan." },
    ],
    relatedModuleIds: [16],
    relatedLabIds: ["LAB-019", "LAB-004"],
    tags: ["transferencia", "alm", "seguridad", "dlp"],
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
    if (!/^IP-(DV|PA|APP|QRY|TRB|JS|CS)-\d{3}$/.test(practice.id)) errors.push(`${practice.id}: id inválido`);
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
  if (INTERACTIVE_PRACTICES.length < MIN_INTERACTIVE_PRACTICES || INTERACTIVE_PRACTICES.length > MAX_INTERACTIVE_PRACTICES) {
    errors.push(`El banco debe tener ${MIN_INTERACTIVE_PRACTICES} a ${MAX_INTERACTIVE_PRACTICES} prácticas; tiene ${INTERACTIVE_PRACTICES.length}`);
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

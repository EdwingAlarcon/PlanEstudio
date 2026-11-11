// Catálogo de recursos agrupado por la pregunta que responde al alumno.
// Sustituye a las dos listas largas (Recursos y Empleabilidad) que vivían en la barra lateral:
// la barra solo enlaza a /recursos y aquí cada recurso aparece una vez, en su grupo.
// Un test exige que cada slug de RESOURCE_FILES (content.ts) esté en exactamente un grupo.

export interface ResourceGroup {
  id: string;
  title: string;
  description: string;
  slugs: string[];
}

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: "empezar",
    title: "Antes de empezar",
    description: "Prepara tu ambiente, entiende cómo se estudia aquí y qué hacer si tu interfaz está en español.",
    slugs: [
      "ruta-cero-absoluta",
      "entornos-y-trials",
      "interfaz-espanol-ingles",
      "guia-herramientas-workstation",
      "tipos-de-practica",
      "fundamentos-crm",
    ],
  },
  {
    id: "estudiar",
    title: "Estudiar y comprobar lo aprendido",
    description: "Apoyos para repasar, consultar términos y medir si dominas un tema.",
    slugs: [
      "checklist",
      "glosario",
      "certificaciones",
      "banco-preguntas",
      "guia-practicas-interactivas",
      "guia-repaso-inteligente",
      "rubricas-plantillas",
      "matriz-competencias",
      "prompts-ia",
    ],
  },
  {
    id: "puentes",
    title: "Puentes técnicos",
    description: "Lo mínimo de programación que piden los módulos avanzados, sin salir del curso.",
    slugs: [
      "lenguajes-programacion",
      "fundamentos-js-ts-react-para-pcf",
      "fundamentos-typescript-react",
      "fundamentos-csharp-dotnet",
      "fundamentos-azure",
    ],
  },
  {
    id: "especializaciones",
    title: "Especializaciones (D365, RPA y avanzado)",
    description: "Material de apoyo para los niveles transversales y los proyectos finales.",
    slugs: [
      "d365-tenant-readiness",
      "rpa-recursos-practica",
      "rpa-validacion-tenant",
      "rpa-artefactos-profesionales",
      "roadmap-especializacion-avanzada",
      "soluciones-referencia-capstones",
      "plantillas-repositorio-por-proyecto",
    ],
  },
  {
    id: "empleo",
    title: "Empleabilidad y portafolio",
    description: "Convierte lo practicado en evidencia para un puesto: perfiles, casos y entrevistas.",
    slugs: [
      "matriz-skills-laborales",
      "job-ready-crm-functional",
      "job-ready-crm-developer",
      "job-ready-admin-governance",
      "job-ready-data-migration-legacy",
      "job-ready-interview-readiness",
      "portafolio-profesional",
      "rpa-portafolio-empleabilidad",
      "casos-reales-por-industria",
      "marco-practicas-profesionales",
      "practicas-portabilidad-estudiante",
      "practicas-guia-revisores",
      "practicas-validacion-sandbox",
    ],
  },
  {
    id: "mantenimiento",
    title: "Sobre el curso",
    description: "Cómo se audita el contenido contra tenants reales. No es necesario para estudiar.",
    slugs: ["roadmap-auditoria-tenant-real"],
  },
];

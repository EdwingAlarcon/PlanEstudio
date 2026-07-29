export interface EmployabilityLink {
  title: string;
  description: string;
  href: string;
}

export interface EmployabilitySection {
  title: string;
  description: string;
  links: EmployabilityLink[];
}

export interface EmployabilityStep {
  label: string;
  description: string;
}

export interface EmployabilityHub {
  title: string;
  promise: string;
  primarySteps: EmployabilityStep[];
  sections: EmployabilitySection[];
  roadmap: EmployabilityLink;
}

export function getEmployabilityHub(): EmployabilityHub {
  return {
    title: "Empleabilidad",
    promise: "Conecta lo que estudias con vacantes reales, perfiles laborales, entrevistas, pruebas técnicas y evidencia de portafolio sin convertir cada vacante en otro módulo.",
    primarySteps: [
      {
        label: "Entender perfiles",
        description: "Ubica qué hace un CRM Functional, CRM Developer, Admin/Governance o especialista de migración antes de elegir tareas.",
      },
      {
        label: "Cruzar skills",
        description: "Mapea requisitos de vacantes contra módulos, labs y evidencias existentes.",
      },
      {
        label: "Practicar evidencias",
        description: "Convierte labs y capstones en artefactos demostrables para entrevista o cliente.",
      },
      {
        label: "Preparar entrevista",
        description: "Ensaya preguntas, decisiones técnicas y pruebas tipo empresa con brechas explícitas.",
      },
    ],
    sections: [
      {
        title: "Skills y brechas laborales",
        description: "La capa que traduce vacantes a competencias verificables del plan.",
        links: [
          {
            title: "Matriz de skills laborales",
            description: "Skill laboral, perfil asociado, evidencia, pregunta típica y prioridad.",
            href: "/recursos/matriz-skills-laborales",
          },
          {
            title: "Matriz de competencias",
            description: "Competencias técnicas y funcionales conectadas a labs y criterios de aprobación.",
            href: "/recursos/matriz-competencias",
          },
        ],
      },
      {
        title: "Perfiles Job-Ready",
        description: "Guías por perfil laboral que reutilizan módulos y labs existentes.",
        links: [
          {
            title: "CRM Functional Specialist",
            description: "Discovery, fit-gap, backlog en Azure DevOps, configuración funcional, UAT, soporte y evidencia consultiva.",
            href: "/recursos/job-ready-crm-functional",
          },
          {
            title: "CRM Developer",
            description: "JavaScript, C#, plugins, integraciones, migración y troubleshooting técnico.",
            href: "/recursos/job-ready-crm-developer",
          },
          {
            title: "Admin / Governance",
            description: "PPAC, ambientes, DLP, seguridad, auditoría y operación administrada.",
            href: "/recursos/job-ready-admin-governance",
          },
          {
            title: "Data Migration + CRM Legacy",
            description: "Migración, limpieza, mapeo, CRM on-premises y modernización controlada.",
            href: "/recursos/job-ready-data-migration-legacy",
          },
          {
            title: "RPA Developer / Automation Engineer",
            description: "Power Automate Desktop, attended/unattended, selectores, operación, RCA y portafolio honesto.",
            href: "/recursos/rpa-portafolio-empleabilidad",
          },
        ],
      },
      {
        title: "Entrevista y evidencia",
        description: "Preparación para demostrar criterio, no solo listar herramientas.",
        links: [
          {
            title: "Interview readiness",
            description: "Preguntas, narrativa profesional y preparación de respuestas técnicas.",
            href: "/recursos/job-ready-interview-readiness",
          },
          {
            title: "Portafolio profesional",
            description: "Cómo convertir capstones y labs en evidencia revisable por una empresa.",
            href: "/portafolio",
          },
        ],
      },
    ],
    roadmap: {
      title: "Roadmap de especialización avanzada",
      description: "Temas no cubiertas todavía o que requieren tenant, licencia, canal o ambiente real.",
      href: "/recursos/roadmap-especializacion-avanzada",
    },
  };
}

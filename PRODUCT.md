# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudiantes de Microsoft Power Platform y Dynamics 365 que necesitan una ruta seria desde fundamentos hacia competencias demostrables por rol. Perfil ancla: ingeniero de sistemas con experiencia inicial o nula en Power Platform/D365, foco en automatizacion de procesos y analisis tecnico, que usa IA como herramienta de apoyo moderno. Producto publico real: deployado oficialmente en Vercel para que cualquier estudiante lo use como recurso serio, no solo para uso personal del autor.

## Product Purpose

Plan de aprendizaje estructurado y progresivo para Power Platform, Dataverse, Power Apps, Power Automate, Power Fx, extensibilidad, Dynamics 365 CE, IA aplicada, RPA y arquitectura. Exito significa que el estudiante completa una ruta concreta, aprueba evaluaciones, reúne evidencia y distingue contenido conceptual, simulado y ejecutado en tenant real. El producto no promete preparación laboral global por completar todo el catálogo.

## Positioning

Progresion de 4 niveles base (Basico -> Intermedio -> Avanzado -> Arquitecto) con evaluaciones (quiz por modulo + simulador de examen cronometrado de 40 preguntas/50 min) y labs practicos, mas niveles transversales (IA, D365, RPA) que no rompen la cadena de prerequisitos. Rutas profesionales separan núcleo, opcionales y archivo/futura especialización. No es una coleccion de articulos sueltos: cada modulo sigue una estructura fija de 7 secciones y el progreso se rastrea localmente (localStorage) por módulo, quiz, práctica, repaso y estación de trabajo.

## Operating Context

App Next.js 15 (App Router, static export) deployada oficialmente en Vercel en `https://planestudio.vercel.app/`. GitHub Pages queda como espejo legacy bajo basePath `/PlanEstudio`, no como URL principal. Contenido en Markdown con frontmatter (`app-elearning/content/modules/`, `app-elearning/content/labs/`). Banco de preguntas compartido en `docs/javascripts/evaluaciones-simulador.js`. El estudiante navega por nivel, abre un modulo, lee la teoria, hace labs practicos y responde el quiz; tambien puede tomar el simulador cronometrado independiente. Existe una version legacy/paralela en MkDocs (`docs/`) que sirve como sitio de referencia estatico, no interactivo.

## Capabilities and Constraints

- 76 modulos, 72 labs, 516 preguntas de quiz, 375 preguntas de diagnostico de caso aplicado y 636 criterios de checklist repartidos en 7 niveles (4 base + IA + D365 + RPA transversales).
- Progreso y resultados de quiz persisten solo en localStorage del navegador (sin cuenta ni backend).
- Simulador: 40 preguntas, 50 minutos, con desglose de errores al final.
- Todo el contenido esta en espanol; terminos tecnicos de producto (Power Fx, Dataverse, DAX, Canvas, Model-Driven) se mantienen en ingles como nombres propios.
- Export estatico puro (`output: 'export'`), sin API routes ni server-side dinamico en produccion.
- Busqueda client-side via FlexSearch (Ctrl+K).
- Diagramas Mermaid soportados en ambas superficies para contenido de arquitectura/flujos.

## Brand Commitments

Nombre del proyecto: "PlanEstudio" / "Plan Maestro: De Basico a Arquitecto en Microsoft Power Platform y Dynamics 365". Sin identidad de marca formal (logo, paleta, tipografia) confirmada aun mas alla de lo que ya existe implementado en la app y en el sitio MkDocs.

## Evidence on Hand

Contenido real y completo ya existente: 76 modulos con casos reales de negocio, 72 labs paso a paso, 516 preguntas de evaluacion con explicaciones, 375 preguntas de diagnostico de caso aplicado y checklist de progreso. No hay testimonios, casos de estudio externos, prensa ni metricas de uso reales; no fabricar ninguno de estos.

## Product Principles

- Progresion sin atajos: no saltar niveles ni introducir temas avanzados prematuramente; respetar la cadena Basico -> Intermedio -> Avanzado -> Arquitecto.
- Contenido de nivel empresarial: priorizar escenarios de negocio reales sobre ejemplos de juguete en cada modulo.
- Practica antes que teoria pasiva: cada modulo combina conceptos con actividades paso a paso, labs y validacion, no solo lectura.
- Preparacion para certificacion/competencia real: alinear contenido y preguntas con Microsoft Learn vigente. PL-200 y MB-280 se tratan como retiradas desde sus fechas oficiales; no se venden como objetivos agendables.
- Autonomo y sin friccion de cuenta: el estudiante progresa sin registro ni backend; el progreso vive en su propio navegador.

## Accessibility & Inclusion

Sin requisito de accesibilidad especifico mas alla de buenas practicas web estandar (confirmado: ninguna restriccion especial adicional).

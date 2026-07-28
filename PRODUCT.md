# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudiantes de Microsoft Power Platform y Dynamics 365 que buscan progresar desde cero hasta rol de Arquitecto de Soluciones Empresariales. Perfil ancla: ingeniero de sistemas con experiencia inicial en Power Platform/D365, foco en automatizacion de procesos y analisis tecnico, que usa IA como herramienta de apoyo moderno. Producto publico real: deployado en GitHub Pages para que cualquier estudiante lo use como recurso serio, no solo para uso personal del autor.

## Product Purpose

Plan de aprendizaje estructurado y progresivo que lleva de Basico a Arquitecto Senior en Power Platform y Dynamics 365, con modulos practicos, labs guiados, quizzes y un simulador tipo examen. Exito significa que el estudiante completa niveles, aprueba evaluaciones y llega preparado para certificaciones Microsoft reales (PL-900, PL-200, PL-400) y para arquitectura empresarial.

## Positioning

Progresion rigida de 4 niveles (Basico -> Intermedio -> Avanzado -> Arquitecto) con evaluaciones (quiz por modulo + simulador de examen cronometrado de 40 preguntas/50 min) y labs practicos integrados en cada modulo, mas dos niveles transversales (IA, D365) que no rompen la cadena de prerequisitos. No es una coleccion de articulos sueltos: cada modulo sigue una estructura fija de 7 secciones (objetivo, conceptos, actividades, casos de negocio, buenas practicas, errores comunes, criterios de validacion) y el progreso se rastrea localmente (localStorage) por modulo y por intento de quiz.

## Operating Context

App Next.js 15 (App Router, static export) deployada en GitHub Pages bajo basePath `/PlanEstudio`. Contenido en Markdown con frontmatter (`app-elearning/content/modules/`, `app-elearning/content/labs/`). Banco de preguntas compartido en `docs/javascripts/evaluaciones-simulador.js`. El estudiante navega por nivel, abre un modulo, lee la teoria, hace labs practicos y responde el quiz; tambien puede tomar el simulador cronometrado independiente. Existe una version legacy/paralela en MkDocs (`docs/`) que sirve como sitio de referencia estatico, no interactivo.

## Capabilities and Constraints

- 65 modulos, 63 labs, 488 preguntas, 603 criterios de checklist repartidos en 6 niveles (4 certificacion + IA + D365 transversales).
- Progreso y resultados de quiz persisten solo en localStorage del navegador (sin cuenta ni backend).
- Simulador: 40 preguntas, 50 minutos, con desglose de errores al final.
- Todo el contenido esta en espanol; terminos tecnicos de producto (Power Fx, Dataverse, DAX, Canvas, Model-Driven) se mantienen en ingles como nombres propios.
- Export estatico puro (`output: 'export'`), sin API routes ni server-side dinamico en produccion.
- Busqueda client-side via FlexSearch (Ctrl+K).
- Diagramas Mermaid soportados en ambas superficies para contenido de arquitectura/flujos.

## Brand Commitments

Nombre del proyecto: "PlanEstudio" / "Plan Maestro: De Basico a Arquitecto en Microsoft Power Platform y Dynamics 365". Sin identidad de marca formal (logo, paleta, tipografia) confirmada aun mas alla de lo que ya existe implementado en la app y en el sitio MkDocs.

## Evidence on Hand

Contenido real y completo ya existente: 65 modulos con casos reales de negocio, 63 labs paso a paso, 488 preguntas de evaluacion con explicaciones, checklist de progreso. No hay testimonios, casos de estudio externos, prensa ni metricas de uso reales — no fabricar ninguno de estos.

## Product Principles

- Progresion sin atajos: no saltar niveles ni introducir temas avanzados prematuramente; respetar la cadena Basico -> Intermedio -> Avanzado -> Arquitecto.
- Contenido de nivel empresarial: priorizar escenarios de negocio reales sobre ejemplos de juguete en cada modulo.
- Practica antes que teoria pasiva: cada modulo combina conceptos con actividades paso a paso, labs y validacion, no solo lectura.
- Preparacion para certificacion real: alinear contenido y preguntas con los examenes oficiales de Microsoft (PL-900, PL-200, PL-400) y con documentacion vigente de producto.
- Autonomo y sin friccion de cuenta: el estudiante progresa sin registro ni backend; el progreso vive en su propio navegador.

## Accessibility & Inclusion

Sin requisito de accesibilidad especifico mas alla de buenas practicas web estandar (confirmado: ninguna restriccion especial adicional).

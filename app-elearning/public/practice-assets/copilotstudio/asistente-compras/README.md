# Asistente de compras SIT — datos de práctica de la Ruta Pro Copilot Studio

Datos **ficticios** de Servicios Integrados Tecnológicos S.A. (SIT), generados para el curso PlanEstudio
(`npm run generate:copilotstudio-assets`, versión 1.0.0). Las cifras de la política son las mismas de los datos
de SIT Compras de la Ruta Pro Power Automate. Los correos usan el dominio reservado `example.com`: no existen.

| Archivo | Contenido | Lo usa |
|---|---|---|
| `manual-compras.docx` / `.md` | Manual de compras: niveles de aprobación, tecnología, plazos, prohibiciones, viajes, contacto | Lab 144 en adelante (conocimiento) |
| `faq-proveedores.docx` / `.md` | Preguntas frecuentes de proveedores: facturas, pagos, tolerancia del 2 %, alta | Labs de conocimiento y multiagente |
| `preguntas-prueba.json` | 14 preguntas de prueba: en alcance, límites, fuera de alcance, ambiguas, datos de otra persona e instrucciones maliciosas | Lab 144 en adelante |
| `lab145/entidades.json`, `lab145/mensajes-prueba.json` | Entidad de lista cerrada `CategoriaCompra` con sinónimos, entidad regex `CodigoProveedor` y 6 mensajes con lo que el agente debería reconocer | Lab 145 |
| `lab146/manual-compras-v2.docx` / `.md`, `lab146/preguntas-conocimiento.json` | Versión 2 del manual (caja menor, plazo y compras urgentes cambian) y 6 preguntas con la respuesta de cada versión | Lab 146 |
| `lab147/descripciones.json`, `lab147/mensajes-orquestacion.json`, `lab147/escenarios-harness.json` | Descripciones malas y buenas, 6 mensajes para el mapa de actividad y 6 escenarios para elegir harness | Lab 147 |
| `lab148/casos-validacion.json`, `lab148/mensajes-herramientas.json`, `lab148/catalogo-sit-openapi.json` (y la variante `-tres-operaciones`) | 8 casos para la validación del agent flow, 7 mensajes para ver qué herramienta elige el agente y la especificación OpenAPI 2.0 del catálogo de SIT | Lab 148 |
| `lab149/tarjeta-solicitud.json`, `lab149/escenarios-conversacion.json` | Adaptive Card 1.5 para pedir una compra y 8 escenarios de conversación | Lab 149 |
| `lab150/filas-otra-persona.json`, `lab150/pruebas-identidad.json`, `lab150/decisiones-identidad.json` | Dos solicitudes de otra persona, 6 mensajes de identidad y 5 situaciones de autenticación y políticas de datos | Lab 150 |
| `lab151/agentes-hijos.json`, `lab151/casos-tolerancia.json`, `lab151/mensajes-enrutamiento.json`, `lab151/decisiones-multiagente.json` | Dos agentes hijos, 6 casos de tolerancia de factura, 8 mensajes de enrutamiento y 6 decisiones de multiagente | Lab 151 |
| `lab152/conjunto-hechos.csv`, `lab152/conjunto-limites.csv`, `lab152/casos-evaluacion.json`, `lab152/clasificacion-limites.json`, `lab152/cambios-regresion.json` | Dos conjuntos de prueba importables (columnas Question y Expected response), sus métodos, la clasificación de límites y el cambio para la regresión | Lab 152 |
| `lab153/checklist-alm.json`, `lab153/plan-despliegue.json`, `lab153/decisiones-alm.json` | Lo que debe llevar la solución del agente, un plan de despliegue de referencia y 6 decisiones de ALM | Lab 153 |
| `expected/respuestas-esperadas.json` | Cifras y respuestas para comprobar tu trabajo | — |

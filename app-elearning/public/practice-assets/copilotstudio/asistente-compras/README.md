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
| `expected/respuestas-esperadas.json` | Cifras y respuestas para comprobar tu trabajo | — |

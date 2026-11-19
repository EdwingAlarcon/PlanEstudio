# SIT Ventas — datos de práctica de la Ruta Pro Power BI

Versión 1.0.0. Datos **ficticios** generados para el curso PlanEstudio: empresas, personas, correos
(`@sit-demo.example.com`, dominio reservado que no existe), precios y tipos de cambio son inventados.

Empresa del caso: Servicios Integrados Tecnológicos S.A. (SIT), que vende licencias, servicios y capacitación en
Colombia, México, Perú y Chile. Moneda de los importes: USD.

| Archivo | Qué contiene | Lo que trae "sucio" a propósito |
|---|---|---|
| `ventas-2024.csv` | Líneas de pedido de 2024 | Fechas en formato día/mes/año |
| `ventas-2025.csv` | Líneas de pedido de 2025 | — |
| `ventas-2026/` | Un CSV por mes (enero a octubre de 2026) | El de marzo trae una fila "TOTAL MARZO" al final |
| `clientes.csv` | Clientes | Espacios, mayúsculas mezcladas, industria escrita de varias formas o vacía, ciudad vacía y 3 filas duplicadas |
| `productos.xlsx` | Catálogo con categoría, subcategoría y precio de lista | Un producto descontinuado |
| `regiones.csv` | País, región, ciudad y moneda | — |
| `vendedores.csv` | Vendedores, cargo y correo | — |
| `vendedor-region.csv` | Qué regiones cubre cada vendedor (los gerentes cubren varias) | — |
| `objetivos.xlsx` | Objetivo mensual por ejecutivo, un mes por columna | Formato ancho (hay que hacer Unpivot) |
| `tipos-cambio.json` | Tipo de cambio mensual USD → COP, MXN, PEN, CLP | JSON anidado |
| `expected/metricas-esperadas.json` | Cifras para comprobar tu trabajo | — |

**Importe de una línea** = Cantidad × PrecioUnitario × (1 − DescuentoPct / 100). El descuento viene como porcentaje
entero (0, 5, 10 o 15) para que no dependa del separador decimal de tu Windows.

Regenera con `npm run generate:powerbi-assets` desde `app-elearning`.

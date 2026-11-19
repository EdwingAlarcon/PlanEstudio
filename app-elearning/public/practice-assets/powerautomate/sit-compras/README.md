# SIT Compras — datos de práctica de la Ruta Pro Power Automate

Datos **ficticios** de Servicios Integrados Tecnológicos S.A. (SIT), generados para el curso PlanEstudio
(`npm run generate:powerautomate-assets`, versión 1.0.0). Los correos usan el dominio reservado `example.com`: no existen.

| Archivo | Contenido | Lo usa |
|---|---|---|
| `politica-aprobacion.json` | Niveles de aprobación por importe (USD) y regla para Tecnología | Lab 128 en adelante |
| `proveedores.xlsx` / `proveedores.csv` | 17 proveedores (tabla de Excel `Proveedores`), dos inactivos | Lab 128 (importar a Dataverse) |
| `solicitudes-compra.xlsx` | 150 solicitudes de 2026 en la tabla de Excel `Solicitudes`, con fechas, precios y cantidades sucios a propósito | Labs 130 y siguientes |
| `catalogo/pagina-N.json` | Catálogo de 41 artículos en 3 páginas, con `@odata.nextLink` | Labs de HTTP y paginación |
| `expected/cifras-esperadas.json` | Cifras para comprobar tu trabajo | — |

El catálogo también está publicado por la app del curso en `https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras/catalogo/pagina-1.json`.

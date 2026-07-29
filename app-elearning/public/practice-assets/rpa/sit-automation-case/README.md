# SIT Automation Case — Assets RPA

Versión: 1.0.0

Empresa ficticia: Servicios Integrados Tecnológicos S.A.

Escenario: consolidación, validación y registro de solicitudes comerciales recibidas desde sucursales.

Este paquete es educativo. No contiene datos reales, credenciales, macros ni ejecutables. Los archivos Excel son libros `.xlsx` mínimos sin macros generados de forma determinista.

## Carpetas

- input: archivos válidos de entrada.
- expected: resultados esperados.
- corrupted: archivos defectuosos para incidentes.
- reference: matrices y contratos de decisión.
- logs: logs de ejemplo.
- portal: datos del portal sandbox.
- legacy-app: datos del simulador legacy.
- templates: plantillas profesionales.
- validation: protocolo y matriz operacional.

Regenera con `npm run generate:rpa-assets` desde `app-elearning`.
Valida con `npm run validate:assets`.

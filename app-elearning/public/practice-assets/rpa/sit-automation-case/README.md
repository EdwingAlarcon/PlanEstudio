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
- legacy-app: `lote-entrada.json`, lote mixto de entrada para el simulador legacy (LAB-107). No es la tabla inicial del
  simulador, que arranca (y vuelve con Reset) con 3 registros: SOL-2026-0001, SOL-2026-0002 y SOL-2026-0004. De las 5
  solicitudes del lote, esas 3 ya existen (el simulador responde "Registro duplicado") y SOL-2026-0005 y SOL-2026-0006
  son nuevas. Su campo `status` (`pending`) es del archivo, no del simulador.
- templates: plantillas profesionales.
- validation: protocolo y matriz operacional.

Regenera con `npm run generate:rpa-assets` desde `app-elearning`.
Valida con `npm run validate:assets`.

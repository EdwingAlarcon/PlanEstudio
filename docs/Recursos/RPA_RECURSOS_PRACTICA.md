# Recursos de práctica RPA

Centro de descarga y simulación para la especialización **Power Automate Desktop & RPA**. Todo este material es ficticio, reproducible y educativo. No contiene datos reales, credenciales, macros ni ejecutables.

## Accesos rápidos

| Recurso | Uso |
| --- | --- |
| [Dataset SIT Automation Case](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/README.md) | Datos válidos, defectuosos, resultados esperados y logs. |
| [Manifest del paquete](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/manifest.json) | Versión, rutas y contrato del asset. |
| [Portal sandbox](https://edwingalarcon.github.io/PlanEstudio/rpa-sandbox/portal) | Práctica web: filtros, paginación, descargas, timeout, modal y selector modificado. |
| [Legacy simulator](https://edwingalarcon.github.io/PlanEstudio/rpa-sandbox/legacy-app) | Práctica UI automation: formulario, tabla, confirmación, duplicados, bloqueo y layout cambiante. |
| [Mapa lab-assets](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/reference/lab_asset_map.csv) | Relación entre labs RPA y archivos. |

## Dataset

Empresa ficticia: **Servicios Integrados Tecnológicos S.A.**

Proceso: consolidación, validación y registro de solicitudes comerciales recibidas desde sucursales.

Incluye:

- Excel `.xlsx` sin macros para ventas por sucursal.
- CSV de solicitudes.
- Catálogos de clientes, productos y regiones.
- Parámetros de proceso y configuración de rutas.
- Consolidado esperado, registros válidos, rechazados, log esperado y métricas.
- Archivos corruptos para duplicados, columnas faltantes, fechas inválidas, encoding, delimitador, cliente bloqueado, producto inexistente y reprocesamiento parcial.

## Descargas principales

- [Ventas Bogotá XLSX](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/input/ventas_bogota_2026_07.xlsx)
- [Ventas Medellín XLSX](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/input/ventas_medellin_2026_07.xlsx)
- [Ventas Caribe XLSX](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/input/ventas_caribe_2026_07.xlsx)
- [Solicitudes sucursales CSV](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/input/solicitudes_sucursales.csv)
- [Consolidado esperado CSV](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/expected/consolidado_esperado.csv)
- [Métricas esperadas JSON](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/expected/metricas_esperadas.json)
- [Manifest de archivos corruptos](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/corrupted/manifest.json)

## Plantillas profesionales

Todas las plantillas incluyen propósito, instrucciones, campos, ejemplo mínimo, control de versión, responsable, fecha, estado, evidencias y advertencia de datos sensibles.

1. [Matriz de viabilidad RPA](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/matriz-viabilidad-rpa.md)
2. [Checklist de descubrimiento](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/checklist-descubrimiento.md)
3. [Documento AS-IS](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/as-is.md)
4. [Documento TO-BE](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/to-be.md)
5. [Inventario de aplicaciones](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/inventario-aplicaciones.md)
6. [Matriz de excepciones](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/matriz-excepciones.md)
7. [PDD ligero](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/pdd-ligero.md)
8. [Diseño de solución](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/diseno-solucion.md)
9. [Test Plan](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/test-plan.md)
10. [Casos UAT](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/casos-uat.md)
11. [Deployment Checklist](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/deployment-checklist.md)
12. [Rollback Plan](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/rollback-plan.md)
13. [Runbook](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/runbook.md)
14. [Reporte de incidente](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/reporte-incidente.md)
15. [RCA](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/rca.md)
16. [Machine Readiness Checklist](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/machine-readiness-checklist.md)
17. [Selector Troubleshooting Checklist](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/selector-troubleshooting-checklist.md)
18. [Security Checklist](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/security-checklist.md)
19. [Registro de automatizaciones](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/registro-automatizaciones.md)
20. [Maintenance Checklist](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/templates/maintenance-checklist.md)

## Descubrimiento y selección de procesos

Antes de construir un desktop flow:

1. Mapea AS-IS y TO-BE.
2. Calcula volumen, frecuencia, variantes, excepciones, tiempo manual, costo, riesgo, estabilidad, datos y cumplimiento.
3. Evalúa si existe conector, API, integración administrada o rediseño manual mejorado.
4. Usa RPA como puente de interfaz cuando la UI sea el punto accesible y la decisión sea defendible.

Descarga:

- [Matriz ponderada de viabilidad](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/reference/matriz_viabilidad_rpa.csv)
- [Comparativa tecnológica](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/reference/comparativa_tecnologica.csv)

## Validación tenant

El paquete incluye:

- [Matriz operacional](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/validation/matriz_operacional.csv)
- [Protocolo tenant](https://edwingalarcon.github.io/PlanEstudio/practice-assets/rpa/sit-automation-case/validation/protocolo_tenant.md)

Estados permitidos: no ejecutado, preparado, bloqueado, ejecutado, ejecutado con diferencias, fallido, corregido y validado.

No marques unattended como validado sin licencia, máquina, cuenta, permisos, run history y evidencia real.

## Reset y troubleshooting

- Portal: usa **Reset** y vuelve a modo Normal.
- Legacy simulator: usa **Reset** y registra de nuevo.
- Dataset local: borra outputs generados por tu práctica y copia otra vez los archivos de `input`.
- Casos corruptos: revisa `corrupted/manifest.json` para saber qué incidente reproduce cada archivo.

## Seguridad

No subas datos reales, credenciales, tenant IDs sensibles, URLs internas, correos, capturas con usuarios reales ni secretos. Los CSV generados escapan valores que podrían iniciar fórmulas.

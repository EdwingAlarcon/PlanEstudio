# Protocolo de validación en tenant para RPA

No marques la ruta RPA como validada en tenant si solo ejecutaste simulaciones locales.

## Matriz de validación

| Prueba | Entorno | Licencia | Resultado | Evidencia | Estado |
|---|---|---|---|---|---|
| Lab Excel |  |  |  |  | No ejecutada |
| Lab web |  |  |  |  | No ejecutada |
| Cloud + desktop |  |  |  |  | No ejecutada |
| Configuración de máquina |  |  |  |  | No ejecutada |
| Incidente selector/timeout |  |  |  |  | No ejecutada |
| Despliegue solución |  |  |  |  | No ejecutada |
| Ejecución attended |  |  |  |  | No ejecutada |
| Variante unattended |  |  |  |  | Bloqueada por licencia |

## Estados permitidos

- No ejecutada.
- Preparada.
- Bloqueada por licencia.
- Bloqueada por permisos.
- Ejecutada con éxito.
- Ejecutada con diferencias.
- Requiere corrección.
- No reproducible.

## Registro técnico

| Campo | Valor |
|---|---|
| Tenant |  |
| Ambiente | DEV / TEST / Sandbox |
| Windows |  |
| Power Automate Desktop versión |  |
| Runtime |  |
| Máquina / grupo |  |
| Usuario de ejecución | Referencia segura |
| Permisos |  |
| Fecha |  |
| Bloqueos |  |
| Diferencias frente al lab |  |

## Reglas

- No uses producción para pruebas de aprendizaje.
- No pegues secretos ni datos personales.
- Si unattended no está licenciado, entrega variante simulada.
- Toda diferencia frente al lab debe documentarse.

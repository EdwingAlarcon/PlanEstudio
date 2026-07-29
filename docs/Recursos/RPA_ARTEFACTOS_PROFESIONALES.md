# Power Automate Desktop & RPA — Artefactos profesionales

Usa estas plantillas con datos ficticios o anonimizados. Un laboratorio o simulación no debe describirse como implementación productiva.

## Matriz de viabilidad RPA

| Campo | Valor |
|---|---|
| Proceso |  |
| Owner |  |
| Volumen mensual |  |
| Variabilidad | Baja / Media / Alta |
| Sistemas |  |
| API/conector disponible | Sí / No / No verificado |
| Estabilidad UI | Baja / Media / Alta |
| Excepciones conocidas |  |
| Riesgo de datos | Bajo / Medio / Alto |
| Opción recomendada | RPA / API / Conector / Cloud flow / Desarrollo / Manual mejorado |
| Razón |  |
| Deuda operativa |  |

## AS-IS

| Paso | Actor | Aplicación | Entrada | Salida | Tiempo | Excepción | Evidencia |
|---|---|---|---|---|---:|---|---|
| 1 |  |  |  |  |  |  |  |

## TO-BE

| Paso | Responsable | Tecnología | Estado esperado | Error esperado | Recuperación |
|---|---|---|---|---|---|
| 1 | Cloud flow / Desktop flow / Humano |  |  |  |  |

## Checklist de descubrimiento

- [ ] Volumen, frecuencia y ventana operativa definidos.
- [ ] Aplicaciones, dueños y permisos identificados.
- [ ] Alternativas API/conector revisadas.
- [ ] Excepciones de negocio documentadas.
- [ ] Datos sensibles identificados.
- [ ] Criterios de éxito y no automatizar definidos.

## Inventario de aplicaciones

| Aplicación | Tipo | Owner | Ambiente | Acceso | API | UI estable | Riesgos |
|---|---|---|---|---|---|---|---|

## Matriz de excepciones

| Excepción | Tipo | Detección | Acción | Retry | Escalamiento | Evidencia |
|---|---|---|---|---|---|---|

## Test plan y UAT

| Caso | Tipo | Datos | Resultado esperado | Evidencia | Estado |
|---|---|---|---|---|---|
| TC-001 | Happy path |  |  |  |  |
| TC-002 | Dato inválido |  |  |  |  |
| TC-003 | Reejecución |  | No duplica |  |  |

## Incident report y RCA

| Campo | Valor |
|---|---|
| ID incidente |  |
| Severidad |  |
| Impacto |  |
| Entorno |  |
| Síntoma |  |
| Cambios recientes |  |
| Hipótesis |  |
| Causa raíz |  |
| Corrección |  |
| Validación |  |
| Prevención |  |
| Comunicación de cierre |  |

## Runbook

| Sección | Contenido |
|---|---|
| Owner |  |
| Horario |  |
| Máquina / grupo |  |
| Cuenta de ejecución | Referencia segura, no contraseña |
| Monitoreo |  |
| Reinicio seguro |  |
| Escalamiento |  |
| Criterio de rollback |  |

## Deployment checklist

- [ ] Solución contiene cloud flow, desktop flow y dependencias.
- [ ] Variables de entorno configuradas para destino.
- [ ] Connection references revisadas.
- [ ] Machine readiness completado.
- [ ] UAT aprobado.
- [ ] Rollback documentado.

## Rollback checklist

- [ ] Versión anterior identificada.
- [ ] Datos afectados delimitados.
- [ ] Ventana y aprobador definidos.
- [ ] Comunicación preparada.
- [ ] Validación postrollback definida.

## Machine readiness checklist

- [ ] Runtime instalado y conectado.
- [ ] Cuenta de ejecución validada.
- [ ] Aplicaciones instaladas para el usuario correcto.
- [ ] Resolución/escalado definidos.
- [ ] Bloqueo de sesión considerado.
- [ ] Antivirus/proxy revisado.
- [ ] Variante unattended marcada como real o simulada.

## Selector troubleshooting checklist

- [ ] Selector probado.
- [ ] Atributos dinámicos identificados.
- [ ] Ventana padre validada.
- [ ] Selector alternativo ordenado.
- [ ] Wait por estado definido.
- [ ] Regresión ejecutada.

## Security checklist

- [ ] Cero secretos en archivos, notas o logs.
- [ ] Mínimo privilegio.
- [ ] Capturas anonimizadas.
- [ ] Logs sin PII.
- [ ] Rotación y ownership definidos.
- [ ] Acceso a máquina gobernado.

## Governance register

| Nombre | Owner | Proceso | Criticidad | Apps | Credenciales | Máquina | Ejecución | Dependencias | Soporte | SLA | Rollback | Última prueba | Próxima revisión |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Maintenance checklist

- [ ] Revisión de selectores.
- [ ] Prueba de credenciales/conexiones.
- [ ] Prueba de recuperación.
- [ ] Revisión de logs y duplicados.
- [ ] Revisión de cambios en aplicaciones.
- [ ] Confirmación de owner y SLA.

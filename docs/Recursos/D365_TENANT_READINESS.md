# Dynamics 365 Tenant Readiness Checklist

Este recurso convierte las dependencias de tenant/licencia/ambiente real en un gate verificable.
Úsalo antes de afirmar que un lab D365 fue ejecutado en ambiente real. Si no se cumple el gate,
el lab sigue siendo válido como **diseño o simulación avanzada**, pero no como configuración
productiva.

## Estados permitidos

| Estado | Cuándo usarlo | Evidencia mínima |
|---|---|---|
| Simulado | No hay tenant/licencia/canal real | Matriz, diagrama, UAT conceptual y supuestos explícitos |
| Sandbox real | Hay ambiente de práctica con licencias y datos de prueba | Capturas, configuración, usuarios de prueba y resultado de UAT |
| Productivo controlado | Hay tenant cliente, gobierno, aprobación y datos controlados | Cambio aprobado, rollback, monitoreo y evidencia de operación |

## Gate común para cualquier lab D365 real

- [ ] Tenant Microsoft 365/Dynamics 365 identificado.
- [ ] Ambiente Dataverse correcto: DEV/Sandbox, no producción directa.
- [ ] Usuario con permisos suficientes y MFA habilitado.
- [ ] Licencias asignadas para el producto que se va a probar.
- [ ] Datos de prueba aprobados, sin información personal sensible innecesaria.
- [ ] DLP y conectores revisados por administrador.
- [ ] Plan de rollback o limpieza de configuración.
- [ ] Evidencia definida antes de ejecutar: captura, export, log, UAT o dashboard.

## Instalación de apps de prueba

Si los ambientes y el tenant ya existen, usa el script del repositorio para listar e instalar
aplicaciones D365 disponibles en el ambiente:

```powershell
pac auth create --name PlanEstudioD365 --environment "https://TU_ORG.crm.dynamics.com" --deviceCode
.\scripts\install-d365-test-apps.ps1 -EnvironmentUrl "https://TU_ORG.crm.dynamics.com" -Products All
.\scripts\install-d365-test-apps.ps1 -EnvironmentUrl "https://TU_ORG.crm.dynamics.com" -Products Sales,CustomerService,FieldService,ContactCenter,CustomerInsights -Install
```

El primer comando autentica. El segundo solo lista candidatos y genera evidencia en
`.d365-app-install/`. El tercero solicita instalación/actualización.

Para instalar un producto específico, usa:

```powershell
.\scripts\install-d365-test-apps.ps1 -EnvironmentUrl "https://TU_ORG.crm.dynamics.com" -Products Sales -Install
```

Finance & Operations no se instala como app Dataverse con este script. Para F&O, valida el ambiente
F&O existente, sus módulos funcionales y la configuración de dual-write desde el proceso de
administración correspondiente.

## Sales avanzado

Requiere ambiente real cuando se va a validar forecasting, jerarquía comercial, cuotas o Sales
Accelerator.

- [ ] Licencia Dynamics 365 Sales adecuada para las capacidades usadas.
- [ ] Usuarios de vendedor y manager creados o asignados.
- [ ] Jerarquía comercial definida.
- [ ] Periodo de forecast y cuotas configurables.
- [ ] Oportunidades de prueba con fechas, valores, forecast category y owner.
- [ ] Evidencia: forecast visible, matriz de gap contra cuota y pipeline review.

## Customer Service avanzado

Requiere ambiente real para validar SLA timers, entitlements, routing y escalamiento.

- [ ] Licencia Dynamics 365 Customer Service asignada.
- [ ] Calendario de servicio configurado.
- [ ] Colas y usuarios/agentes de prueba.
- [ ] Entitlements y SLA configurados con pausa/reanudación.
- [ ] Casos de prueba positivos y negativos.
- [ ] Evidencia: caso con temporizador SLA, cola correcta, warning/failure y escalamiento.

## Contact Center / Omnichannel

Requiere ambiente real para probar canal, workstream, presencia, capacidad, unified routing y
handoff con conversación real.

- [ ] Licencias Dynamics 365 Contact Center o Customer Service aplicables.
- [ ] Canal configurado y disponible en la región del tenant.
- [ ] Agentes con presencia y capacity profile.
- [ ] Workstream y cola configurados.
- [ ] Bot o punto de entrada de conversación configurado, si aplica.
- [ ] Evidencia: conversación entrante, routing, handoff con contexto y dashboard supervisor.

## Customer Insights - Journeys

Requiere ambiente real para enviar o validar journeys sobre canales configurados.

- [ ] Customer Insights - Journeys habilitado.
- [ ] Dominio/canal configurado según el tipo de mensaje.
- [ ] Consentimiento por propósito y canal.
- [ ] Contactos de prueba con consentimiento válido, inválido y ausente.
- [ ] Trigger/evento de prueba.
- [ ] Evidencia: journey ejecutado, exclusión por consentimiento y objetivo medido.

## Customer Insights - Data

Requiere ambiente real para ingesta, unificación, medidas y activación.

- [ ] Customer Insights - Data habilitado.
- [ ] Fuentes conectadas o datasets de prueba aprobados.
- [ ] Reglas de matching revisadas por negocio.
- [ ] Medidas documentadas con fórmula.
- [ ] Gobierno de datos: propósito, retención y base legal/consentimiento.
- [ ] Evidencia: perfil unificado, medida calculada, segmento y destino de activación.

## Field Service

Requiere ambiente real para Schedule Board, RSO, Mobile Offline, Agreements, inventario y ejecución
de Work Orders.

- [ ] Licencia Dynamics 365 Field Service asignada.
- [ ] Recursos/técnicos, territorios, skills y horarios.
- [ ] Customer Assets, Incident Types y Work Orders de prueba.
- [ ] Perfil offline móvil configurado si se prueba movilidad.
- [ ] RSO habilitado solo si el escenario lo justifica por volumen.
- [ ] Evidencia: booking, ejecución móvil/offline, inspection, consumo de inventario y cierre.

## CE + F&O / dual-write

Requiere ambientes reales CE y F&O conectados para probar dual-write. Si no existen, el lab debe
presentarse como arquitectura y matriz de ownership, no como configuración ejecutada.

- [ ] Ambiente Dataverse y ambiente F&O disponibles.
- [ ] Dual-write instalado/configurado por administrador autorizado.
- [ ] Entidades/mapas soportados identificados.
- [ ] Ownership por entidad aprobado por negocio.
- [ ] Usuarios/roles equivalentes mapeados entre Dataverse y F&O.
- [ ] Monitoreo, reconciliación y rollback definidos.
- [ ] Evidencia: mapa habilitado, prueba de sincronización, error controlado y reconciliación.

## Regla de presentación en portafolio

En cada README o resumen ejecutivo, declara el estado:

```text
Estado de ejecución: Simulado | Sandbox real | Productivo controlado
Dependencias reales: tenant, licencias, canales, usuarios, datos, permisos
Evidencia adjunta: capturas/logs/matrices/UAT
Limitaciones: lo no ejecutado en ambiente real
```

No presentes un diseño como configuración real. Esa honestidad aumenta el valor del portafolio
porque muestra criterio profesional y reduce riesgo de entrevista.

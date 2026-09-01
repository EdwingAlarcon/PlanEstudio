# Matriz de entornos y trials por ruta

Tabla única y reutilizable: qué ambiente necesita cada ruta, qué licencia/producto, cuánto dura, y qué
alternativa existe si no tenés acceso. Complementa a [Ruta cero absoluta](/recursos/ruta-cero-absoluta)
(conceptos de tenant/ambiente) y a [Tipos de práctica](/recursos/tipos-de-practica) (categorías 🟢🔵🟡🟠🔴).
Para el detalle operativo de gates D365 (checklist, evidencia mínima por producto), ver
[D365 Tenant Readiness Checklist](/recursos/d365-tenant-readiness).

**No inventamos duración de trial ni capacidad no documentada.** Donde el repo no tiene una fuente
verificada de Microsoft Learn para una duración exacta, la columna dice "según oferta vigente de
Microsoft — verificar en el momento de activar" en vez de un número inventado.

| Ruta | Tipo de entorno | Producto/licencia | Rol requerido | Duración o expiración | Alternativa sin acceso | Evidencia |
|---|---|---|---|---|---|---|
| Fundamentos Power Platform / Maker | 🟡 Developer environment | Microsoft 365 Developer Program (gratuito) | Ninguno — cuenta personal | Se renueva mientras la uses activamente (Microsoft puede desactivarla por inactividad prolongada) | No hay alternativa sin ambiente — es el paso 1 de [Ruta cero absoluta](/recursos/ruta-cero-absoluta) | Capturas de tablas/apps/flujos construidos, export de solución |
| Consultor Funcional | 🟡 Developer environment + 🟢 conceptual (fit-gap, backlog) | Microsoft 365 Developer Program | Ninguno | Igual que arriba | El backlog funcional (Azure DevOps o equivalente documentado) es 🟢, no requiere ambiente | Documento de requerimientos, matriz fit-gap, backlog, capturas de configuración |
| Developer | 🟡 Developer environment | Microsoft 365 Developer Program | Ninguno | Igual que arriba | Módulos 23/27/28 tienen puente conceptual — ver [Fundamentos C#/.NET](/recursos/fundamentos-csharp-dotnet) y [Fundamentos TypeScript/React](/recursos/fundamentos-typescript-react) | Solución exportada, código en repositorio propio, capturas de plugin/PCF registrado |
| Dynamics 365 Sales | 🟠 Trial Dynamics 365 Sales | Trial de Dynamics 365 Sales (producto específico — un ambiente Dataverse-only NO lo trae instalado) | Ninguno para el trial; roles de vendedor/manager se configuran dentro | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: diseño documentado de proceso lead-to-opportunity, matriz de forecast sin validación visual del rollup jerárquico | Capturas de leads/oportunidades/forecast reales, matriz de pipeline hygiene |
| Dynamics 365 Customer Service | 🟠 Trial Dynamics 365 Customer Service | Trial de Dynamics 365 Customer Service (producto específico, trial separado del de Sales) | Ninguno para el trial; agentes/supervisores se configuran dentro | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: matriz de SLA y árbol de decisión de agente documentados, sin validar calendario/pausas/routing ejecutándose | Capturas de casos/colas/SLA reales, matriz de SLA completada |
| Customer Insights - Data | 🟠 Trial Customer Insights | Trial de Dynamics 365 Customer Insights (habilita Data; Journeys puede requerir activación separada) | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: diseño de fuentes/unificación/segmentos documentado, sin datos reales unificados | Capturas de perfiles unificados, medidas y segmentos reales |
| Customer Insights - Journeys | 🟠 Trial Customer Insights (Journeys) | Trial de Dynamics 365 Customer Insights - Journeys | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: journey diseñado en diagrama, sin envío/consentimiento real ejecutado | Capturas de journey publicado, métricas de envío/apertura reales |
| Field Service | 🟠 Trial Dynamics 365 Field Service | Trial de Dynamics 365 Field Service; RSO/mobile offline requieren licenciamiento/configuración adicional | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Sin trial: matriz de diseño y simulación del ciclo de work order documentada | Capturas de work orders, agreements y scheduling reales |
| Contact Center (especialización opcional) | 🟠 Trial (chat) / 🔴 Voz-SMS requiere proveedor de telefonía real | Trial de Dynamics 365 Contact Center — canal de chat practicable en trial; voz/SMS requieren proveedor de telefonía contratado, fuera del alcance de autoestudio | Ninguno para el trial de chat | Según oferta vigente de Microsoft — verificar en el momento de activar | Canal de chat hands-on en trial (Lab 83); voz/SMS quedan como diseño documentado | Captura de conversación de prueba en canal de chat |
| Finance & Operations (archivado/futura especialización) | 🟢 Conceptual + 🟠 Hands-on en trial donde existe (LAB-093 a LAB-100) | Trial de Dynamics 365 Finance/SCM — no viene con el ambiente Developer estándar | Ninguno para el trial | Según oferta vigente de Microsoft — verificar en el momento de activar | Vocabulario y mapas de proceso sin ejecución; los labs 93-100 no están verificados contra tenant en vivo | No cuenta como ruta laboral disponible — contenido preservado para consulta, no como evidencia de competencia lista |
| RPA / Power Automate Desktop | 🟡 Developer environment + 🟠 según capacidad (unattended, machine groups, hosted machines) | Microsoft 365 Developer Program cubre desktop flows básicos; unattended/hosted requieren licencia adicional a validar | Ninguno para lo básico | Según oferta vigente de Microsoft — verificar en el momento de activar | Variante simulada claramente marcada cuando no hay licencia de capacidades avanzadas | Grabación de flujo desktop, logs de ejecución, capturas de sandbox reproducible |
| Arquitectura / Solution Architect | 🟡 Developer environment + 🔴 experiencia previa real | Microsoft 365 Developer Program; el rol exige experiencia de implementación previa, no solo módulos completados | Experiencia previa verificable como Maker/Consultor/Developer | — | No existe alternativa a la experiencia previa — este plan prepara criterio, no la sustituye | Documento de decisiones arquitectónicas, matriz de trade-offs, casos de estudio propios |

## Cómo leer "Duración o expiración: según oferta vigente de Microsoft"

Las duraciones de trial (típicamente 30 días, renovables o no según el producto) las define Microsoft
y cambian con el tiempo. En vez de citar un número que puede quedar desactualizado, activá el trial
desde el propio [Centro de administración de Power Platform](https://admin.powerplatform.microsoft.com)
o el enlace oficial del producto, y anotá vos mismo la fecha de expiración real que te muestre — esa
es la única fuente confiable en el momento en que la necesitás.

## Regla general de integración entre productos

Un trial de Sales, uno de Customer Service y uno de Customer Insights activados por separado **no
quedan integrados automáticamente** — son ambientes distintos salvo que los actives sobre el mismo
tenant/ambiente compatible a propósito. El proyecto integrador completo (prospecto → oportunidad →
cliente → caso de servicio → perfil unificado → segmento → journey) requiere que actives los productos
necesarios **sobre el mismo ambiente**. Si eso no es posible en tu caso, cada ruta tiene su propio
proyecto por producto — no se pierde evidencia, pero no se puede presentar como "integración técnica
real" sin verificarlo.

## Errores comunes

- **Error:** asumir que el ambiente Developer del Módulo 1 ya tiene Dynamics 365 Sales/Customer
  Service instalado. **Por qué pasa:** "Developer environment" suena a "todo incluido". **Cómo
  evitarlo:** un ambiente Dataverse-only no trae aplicaciones Dynamics 365 — necesitás activar el
  trial del producto específico, un paso aparte.
- **Error:** activar un trial de Sales y otro de Customer Service esperando que compartan datos.
  **Cómo evitarlo:** verificá que ambos apunten al mismo ambiente antes de asumir integración.
- **Error:** citar una duración de trial fija (ej. "30 días siempre") en tu portafolio o evidencia.
  **Cómo evitarlo:** citá la fecha de expiración real que te mostró Microsoft al activarlo, no un
  número genérico.

## Criterio de aprobación

Antes de activar cualquier trial, deberías poder responder: ¿qué ruta lo necesita, qué evidencia vas a
producir con él, y qué vas a hacer si no llegás a usarlo completo antes de que expire (documentar lo
logrado, no fingir que lo terminaste)?

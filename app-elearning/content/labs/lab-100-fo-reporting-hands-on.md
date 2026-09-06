---
id: lab-100
title: "F&O Reporting Hands-On — Financial Reporting y Power BI Embebido"
level: "N4"
duration: 150
product: ["Dynamics 365 Finance", "Financial Reporting", "Power BI"]
certifications: ["Arquitectura Power Platform"]
role: ["F&O Practitioner", "Solution Architect"]
prerequisites:
  - "Lab 93 completado: F&O Finance Setup Walkthrough"
  - "Lab 94 y Lab 95 completados (recomendado): para tener transacciones de prueba que aparezcan en los reportes"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Finance con Financial Reporting habilitado"
---

# Lab 100 — F&O Reporting Hands-On — Financial Reporting y Power BI Embebido

## Objetivo

Generar un reporte financiero básico (balance de comprobación) y explorar un workspace con Power BI
embebido, documentando qué datos muestra cada uno, su cadencia de actualización y cuándo usar uno u
otro.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Finance, **sin verificación contra un tenant en vivo al momento de escribirse**. Financial Reporting
es una aplicación separada (a veces requiere acceso adicional o un enlace distinto al del cliente
principal de Finance) — si tu ambiente no lo tiene habilitado, documenta ese límite y continúa con
el reporte de balance de comprobación desde el cliente principal.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-99).

El controller financiero pidió un balance de comprobación del período actual y quiere saber qué
tan rápido puede ver el impacto de una transacción recién contabilizada en un dashboard ejecutivo.

## Rol del estudiante

Actúas como F&O Practitioner generando evidencia de reporting para el equipo financiero.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Finance, idealmente con las transacciones de los Labs 93-95 ya contabilizadas.

## 🔧 Requisitos de ambiente y fallos frecuentes

**Rol de seguridad mínimo**

Para este lab basta con acceso de **lectura** a General ledger inquiries/reports y a los workspaces
financieros — no necesitas un rol de administración. Si además vas a explorar Financial Reporting
como aplicación separada, esa app suele requerir su propio inicio de sesión o enlace (a veces con un
rol específico de "Financial reporting" distinto del acceso al cliente principal de Finance); no
asumas que tener acceso al cliente de Finance te da automáticamente acceso a Financial Reporting.

**Configuración previa que puede faltar en un trial**

- Financial Reporting es una aplicación separada del cliente principal de Finance y **no siempre
  viene habilitada ni enlazada por defecto** en un ambiente trial/demo recién aprovisionado —
  confírmalo antes de asumir que el paso 1 falló por tu culpa.
- Power BI embebido dentro de un workspace de F&O depende de una licencia de Power BI (Pro como
  mínimo; algunos reportes/dashboards más avanzados requieren capacidad Premium/Fabric) asociada al
  tenant — un trial de F&O por sí solo no garantiza que exista esa licencia ni que el dataset esté
  conectado.
- Si no ejecutaste (o el ambiente no tiene) transacciones contabilizadas del Lab 93/94/95, el balance
  de comprobación y los tiles de Power BI pueden cargar **vacíos o en cero** — eso no siempre significa
  que el reporte esté mal configurado, sino que no hay datos que mostrar todavía.

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| El balance de comprobación carga vacío o en cero | Dato Contoso/transaccional faltante: no hay movimientos contabilizados en el período | Verifica en **General ledger > Inquiries and reports > Voucher transactions** si existen transacciones contabilizadas en ese período | Contabiliza al menos una transacción de prueba (o cambia al período/legal entity demo que sí tenga datos Contoso) antes de regenerar el reporte |
| No aparece la aplicación o el enlace de Financial Reporting | Financial Reporting no habilitado/enlazado en el ambiente trial | Busca "Financial reporting" en el buscador global del cliente de Finance y revisa si redirige a una app o da error | Documenta el límite explícitamente y continúa el lab con **Inquiries and reports > Trial balance** desde el cliente principal |
| El workspace financiero no muestra ningún tile de Power BI | Licencia de Power BI (Pro/Premium) no asignada en el tenant, o dataset no conectado | Revisa si otros workspaces del mismo ambiente muestran tiles de Power BI; si ninguno lo hace, es un límite del tenant, no del workspace | Documenta el límite de licenciamiento como evidencia y describe, con base en la documentación, qué visualización debería mostrar ese tile |
| Los tiles de Power BI muestran datos desactualizados frente a una transacción recién contabilizada | Dataset con refresh programado, no en tiempo real | Compara la hora de tu transacción con la hora de "last refreshed" del dataset, si el workspace la muestra | Documenta la cadencia de refresh observada (o declarada en la documentación) como parte de la comparación del Paso 3, sin esperar actualización inmediata |
| El reporte de balance de comprobación no permite seleccionar el período configurado en el Lab 93 | Legal entity o período fiscal distintos al contexto activo de la sesión | Revisa la legal entity activa en la barra superior del cliente de Finance antes de generar el reporte | Cambia de legal entity/contexto (ícono de compañía en la barra superior) a la que configuraste en el Lab 93 antes de reintentar |

## Entregables

- Balance de comprobación (trial balance) generado para la legal entity y período configurados en el Lab 93.
- Documentación de un workspace con Power BI embebido (o el límite, si tu ambiente no lo tiene).
- Tabla comparativa: Financial Reporting vs. Power BI embebido vs. consulta directa (inquiries).
- Explicación de la cadencia de actualización de cada uno.

## Pasos detallados

### Paso 1 — Balance de comprobación

Ve a **General ledger > Inquiries and reports > Trial balance** (o **Financial reporting >
Reports**, si tu ambiente tiene la app de Financial Reporting habilitada).

- Genera el balance de comprobación para la legal entity y el período fiscal configurados en el Lab 93.
- Documenta si las transacciones de los Labs 94-95 (si las ejecutaste) aparecen reflejadas.
- Explica qué pasaría si intentas generar el reporte para un período que aún no tiene transacciones contabilizadas.

### Paso 2 — Workspace con Power BI embebido

Ve a un workspace financiero (p. ej. **General ledger > General ledger workspaces**, o el
equivalente que tu ambiente tenga disponible) y busca un tile o sección con Power BI embebido.

- Documenta qué visualización muestra (KPI, gráfico de tendencia, etc.) y de qué entidad de datos parece alimentarse.
- Si tu ambiente no tiene Power BI embebido disponible (requiere configuración/licencia adicional), documenta ese límite explícitamente.

### Paso 3 — Cadencia de actualización

Documenta, para cada mecanismo de reporte que hayas usado:

- Trial balance / inquiries: ¿es una consulta en tiempo real contra la base de datos transaccional?
- Financial Reporting: ¿requiere generar/publicar el reporte, o se actualiza automáticamente?
- Power BI embebido: ¿depende de un dataset con actualización programada (refresh), o es en tiempo real?

### Paso 4 — Comparación y recomendación

Con el ejemplo del controller financiero del escenario, documenta:

- Qué mecanismo usarías si necesita el dato "ahora mismo" para una decisión urgente.
- Qué mecanismo usarías si necesita un reporte formal, versionado, para enviar a un auditor externo.
- Qué mecanismo usarías si necesita un dashboard ejecutivo que varios gerentes consultan a diario.

## Criterios de validación

- [ ] El balance de comprobación está generado (o el límite del ambiente está documentado) para la legal entity y período correctos.
- [ ] El workspace con Power BI embebido está documentado con su visualización y fuente de datos aparente, o el límite está explícito.
- [ ] La cadencia de actualización de cada mecanismo está explicada, no solo nombrada.
- [ ] La recomendación conecta cada mecanismo con un caso de uso concreto del escenario, no genérico.

## Rúbrica

| Criterio | Peso |
|---|---|
| Balance de comprobación | 30% |
| Workspace con Power BI embebido | 25% |
| Cadencia de actualización | 25% |
| Recomendación por caso de uso | 20% |

## Errores comunes

- Asumir que todos los reportes se actualizan en tiempo real sin verificar la cadencia real de cada mecanismo.
- No documentar el límite del ambiente cuando Financial Reporting o Power BI embebido no están disponibles, y en su lugar omitir esa parte del lab sin explicación.
- Confundir un "inquiry" (consulta transaccional directa) con un "report" (documento formal, a veces versionado).
- Recomendar el mismo mecanismo para los 3 casos de uso del Paso 4 sin justificar la diferencia.

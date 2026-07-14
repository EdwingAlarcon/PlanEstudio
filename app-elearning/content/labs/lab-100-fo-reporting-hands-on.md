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

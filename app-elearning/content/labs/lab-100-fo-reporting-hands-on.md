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
  - "Acceso a un ambiente trial/demo de Dynamics 365 Finance con Financial Reporting habilitado; sin él, haz la variante en papel del final del lab"
lastVerified: "2026-11"
---

# Lab 100 — F&O Reporting Hands-On — Financial Reporting y Power BI Embebido

## Objetivo

Generar un reporte financiero básico (balance de comprobación) y explorar un workspace con Power BI
embebido, documentando qué datos muestra cada uno, su cadencia de actualización y cuándo usar uno u
otro.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos están escritos con base en la terminología documentada de Dynamics 365
Finance, **sin verificación contra un tenant en vivo**. En noviembre de 2026 se revisaron contra
Microsoft Learn el complemento de Financial reporting, el balance de comprobación y el workspace
**Financial analysis** (enlaces en cada paso). Si tu ambiente no tiene Financial reporting,
documenta ese límite y continúa con el balance de comprobación desde el cliente principal.

**Compañía:** los Labs 94 y 95 contabilizan en `USMF`; la legal entity que creaste en el Lab 93 no
tiene transacciones. Genera los reportes en `USMF` si quieres ver tus movimientos.

## ⚠️ Antes de empezar: cómo se consigue hoy un ambiente de F&O

Verificado en Microsoft Learn en noviembre de 2026. Sin un ambiente así, haz la
**variante en papel** del final de este lab; el [Módulo 60](/nivel/d365/modulo/finance-operations-procesos-erp)
cubre además los procesos en general.

- **Tu ambiente del curso no sirve.** Learn indica que el tipo de ambiente
  *Developer* no admite ninguna carga de Dynamics 365; F&O se instala en ambientes *Sandbox*,
  *Production* o *Trial (subscription-based)* y exige una licencia de F&O asignada
  ([Learn: Unified environment types and templates](https://learn.microsoft.com/power-platform/admin/unified-experience/unified-environment-types-and-templates)).
  El trial no se añade a un ambiente que ya tengas: crea uno nuevo.
- **Trial de administrador (el camino actual):** el administrador de un tenant de trabajo o escuela
  (no sirve una cuenta personal de Microsoft) busca en el
  [Microsoft 365 admin center](https://admin.microsoft.com/) > **Marketplace** la oferta gratuita de
  prueba de *Finance*, *Supply Chain Management*, *Project Operations* o *Commerce*, la adquiere y
  se asigna la licencia. Después, en el
  [Power Platform admin center](https://admin.powerplatform.microsoft.com): **Manage** >
  **Environments** > **New**, tipo **Trial (subscription-based)**, **Next**, **Enable Dynamics 365
  apps** y la plantilla de esa licencia (por ejemplo **Finance (Preview)**). El despliegue puede
  tardar una hora ([Learn: Unified admin trials](https://learn.microsoft.com/power-platform/admin/unified-experience/admin-trials)).
  Esa página no dice cuánto dura el trial: anota la fecha de expiración que te muestre el admin center.
- **Página pública de pruebas:** a la fecha de esta revisión, en la
  [página de pruebas gratuitas de Dynamics 365](https://www.microsoft.com/dynamics-365/free-trial)
  Finance, Supply Chain Management y Commerce solo ofrecen **Request a demo**. Learn ("Before you
  buy") todavía menciona una prueba de 30 días con registro por correo; no cuentes con ella sin
  comprobarla.
- **Lifecycle Services (LCS):** desde el 16 de febrero de 2026 los clientes nuevos de Finance,
  Supply Chain Management y Project Operations no pueden crear proyectos en LCS y administran sus
  ambientes en el Power Platform admin center
  ([Learn: Lifecycle Services project creation freeze](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/lifecycle-services/lcs-project-creation-freeze)).
  Si tu empresa o un partner ya tiene un ambiente demo en LCS, sigue sirviendo para este lab.
- **Datos demo:** los pasos usan las compañías demo de Contoso, como `USMF` (Contoso Entertainment
  System USA). Al entrar, revisa la compañía activa en la barra superior; si `USMF` no aparece en
  la lista, tu ambiente se creó sin datos demo: documéntalo y trabaja con lo que haya.
- **Financial reporting:** Learn indica que ahora se entrega como un complemento (add-in),
  así que no siempre está disponible por defecto
  ([Learn: Get started with Financial reporting](https://learn.microsoft.com/dynamics365/finance/general-ledger/financial-reporting-getting-started)).
  Lo instala un administrador en el Power Platform admin center: **Environments** > el ambiente >
  **Resources** > **Dynamics 365 apps** > **Install app** > *Microsoft Dynamics 365 Financial
  Reporting*. Además exige calendario fiscal, ledger, plan de cuentas, moneda, al menos una
  transacción contabilizada y la dimensión **MainAccount** seleccionada en **General ledger >
  Ledger setup > Financial reporting setup**. Si no aparece **Financial reports** en **General
  ledger** > **Inquiries and reports**, usa la ruta alternativa del Paso 1 y documenta el límite.

## Escenario de negocio

**Empresa ficticia:** Northwind Manufacturing LATAM (continúa el escenario de los Labs 93-99).

El controller financiero pidió un balance de comprobación del período actual y quiere saber qué
tan rápido puede ver el impacto de una transacción recién contabilizada en un dashboard ejecutivo.

## Rol del estudiante

Actúas como F&O Practitioner generando evidencia de reporting para el equipo financiero.

## Herramientas necesarias

- Ambiente trial/demo de Dynamics 365 Finance, idealmente con las transacciones de los Labs 94-95
  ya contabilizadas en `USMF`.
- Tiempo estimado: 2,5 horas con ambiente; 60 minutos la variante en papel.

## 🔧 Requisitos de ambiente y fallos frecuentes

**Rol de seguridad mínimo**

Para este lab basta con acceso de **lectura** a General ledger inquiries/reports y a los workspaces
financieros — no necesitas un rol de administración. Financial reporting tiene sus propios
privilegios y deberes: Learn indica, por ejemplo, que generar reportes corresponde a roles como CEO,
CFO o Accountant, y el workspace Financial analysis exige el deber *View financial analysis current
company* (incluido en roles como Accountant o Financial controller). No asumas que tener acceso al
cliente de Finance te da automáticamente esos permisos.

**Configuración previa que puede faltar en un trial**

- Financial Reporting es una aplicación separada del cliente principal de Finance y **no siempre
  viene habilitada ni enlazada por defecto** en un ambiente trial/demo recién aprovisionado —
  confírmalo antes de asumir que el paso 1 falló por tu culpa.
- El workspace **Financial analysis** (Power BI embebido) lee del *entity store*, no de la base
  transaccional: hay que actualizar sus entidades en **System administration > Setup > Entity
  store**, y las cuentas principales deben usar los tipos Revenue, Expense, Assets, Liabilities o
  Equity, no Balance sheet ni Profit and loss
  ([Learn: Financial analysis](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/analytics/financial-insights)).
  Esa página no exige licencia de Power BI al usuario; si tu ambiente sí la pide, documéntalo.
- Si no ejecutaste (o el ambiente no tiene) transacciones contabilizadas del Lab 93/94/95, el balance
  de comprobación y los tiles de Power BI pueden cargar **vacíos o en cero** — eso no siempre significa
  que el reporte esté mal configurado, sino que no hay datos que mostrar todavía.

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| El balance de comprobación carga vacío o en cero | Dato Contoso/transaccional faltante: no hay movimientos contabilizados en el período | Verifica en **General ledger > Inquiries and reports > Voucher transactions** si existen transacciones contabilizadas en ese período | Contabiliza al menos una transacción de prueba (o cambia al período/legal entity demo que sí tenga datos Contoso) antes de regenerar el reporte |
| No aparece la aplicación o el enlace de Financial Reporting | Financial Reporting no habilitado/enlazado en el ambiente trial | Busca "Financial reporting" en el buscador global del cliente de Finance y revisa si redirige a una app o da error | Documenta el límite explícitamente y continúa el lab con **Inquiries and reports > Trial balance** desde el cliente principal |
| El workspace Financial analysis aparece vacío | Entidades del entity store sin actualizar, o cuentas principales con tipo Balance sheet / Profit and loss | Revisa la última actualización en **System administration > Setup > Entity store** y el tipo de las cuentas principales | Actualiza las entidades del entity store; si el problema es el tipo de cuenta, documéntalo (no cambies el plan de cuentas demo) |
| El workspace no aparece en el menú | Falta el deber *View financial analysis current company* | Revisa los roles de tu usuario en **System administration > Users > Users** | Pide un rol que lo incluya (p. ej. Accountant) o documenta el límite |
| Los datos del workspace no reflejan una transacción recién contabilizada | El entity store se actualiza por lotes, no en tiempo real | Compara la hora de tu transacción con la última actualización de la entidad en **Entity store** | Actualiza la entidad o documenta la cadencia observada como parte del Paso 3 |
| El reporte de balance de comprobación no permite seleccionar el período configurado en el Lab 93 | Legal entity o período fiscal distintos al contexto activo de la sesión | Revisa la legal entity activa en la barra superior del cliente de Finance antes de generar el reporte | Cambia de legal entity/contexto (ícono de compañía en la barra superior) antes de reintentar; recuerda que las transacciones de los Labs 94-95 están en `USMF` |
| El balance de comprobación no muestra una transacción recién contabilizada | El balance usa saldos resumidos por conjunto de dimensiones que pueden estar desactualizados | Revisa si la página ofrece **Update balances** para el conjunto de dimensiones | Actualiza los saldos y vuelve a consultar ([Learn: Financial dimension sets](https://learn.microsoft.com/dynamics365/finance/general-ledger/financial-dimension-sets)) |

## Entregables

- Balance de comprobación (trial balance) generado para la legal entity y período configurados en el Lab 93.
- Documentación de un workspace con Power BI embebido (o el límite, si tu ambiente no lo tiene).
- Tabla comparativa: Financial Reporting vs. Power BI embebido vs. consulta directa (inquiries).
- Explicación de la cadencia de actualización de cada uno.

## Pasos detallados

### Paso 1 — Balance de comprobación

Ve a **General ledger > Inquiries and reports > Trial balance** (o **General ledger > Inquiries
and reports > Financial reports**, si tu ambiente tiene el add-in de Financial reporting).

- Genera el balance de comprobación en `USMF` para el período actual, y aparte para la legal entity
  del Lab 93 (saldrá vacía: explica por qué).
- Documenta si las transacciones de los Labs 94-95 (si las ejecutaste) aparecen reflejadas; si no,
  revisa **Update balances** antes de concluir que faltan.
- Si tienes Financial reporting, Learn indica que la primera vez que lo abres genera reportes por
  defecto para el mes anterior; documenta cuál abriste.
- Explica qué pasaría si intentas generar el reporte para un período que aún no tiene transacciones contabilizadas.

### Paso 2 — Workspace con Power BI embebido

Abre el workspace **Financial analysis** (búscalo por nombre en la barra de búsqueda; esta revisión
no confirmó su ruta de menú) ([Learn: Financial analysis](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/analytics/financial-insights)).

- Antes, revisa en **System administration > Setup > Entity store** cuándo se actualizaron sus
  entidades y actualízalas si hace falta.
- Documenta qué visualización muestra (KPI, gráfico de tendencia, etc.) y que se alimenta del
  entity store.
- Si tu ambiente no lo muestra (falta el deber o el entity store está vacío), documenta ese límite explícitamente.

### Paso 3 — Cadencia de actualización

Documenta, para cada mecanismo de reporte que hayas usado:

- Trial balance / inquiries: ¿qué papel tienen los saldos resumidos y **Update balances**?
- Financial Reporting: ¿requiere generar/publicar el reporte, o se actualiza automáticamente?
- Financial analysis: ¿cómo influye que lea del entity store y no de la base transaccional?

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
- Generar el reporte en la legal entity nueva del Lab 93 y concluir que los Labs 94-95 no contabilizaron.

## Variante en papel (sin ambiente de Finance)

Si no tienes ambiente, haz el análisis con las páginas de Learn enlazadas y escribe
«variante en papel» en tu entrega. Tiempo estimado: 60 minutos.

1. **Balance de comprobación:** un balance de ejemplo de 6 cuentas construido a partir de los
   asientos que documentaste en los Labs 94 y 95 (o en su variante en papel), con débitos y créditos
   que cuadren.
2. **Requisitos:** lista de lo que Learn exige para Financial reporting (instalación del
   complemento, MainAccount, transacción contabilizada) y para Financial analysis (entity store,
   tipos de cuenta, deber de seguridad).
3. **Cadencia:** tabla con los tres mecanismos (trial balance, Financial reporting, Financial
   analysis), de dónde lee cada uno y qué hay que hacer para que muestre una transacción recién
   contabilizada.
4. **Recomendación:** el Paso 4 completo.

La variante en papel cumple los criterios de validación si cada afirmación lleva su enlace de Learn;
sustituye a las capturas.

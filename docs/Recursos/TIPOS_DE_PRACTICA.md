# Tipos de práctica en PlanEstudio

No todo lo que dice "práctica" en este plan requiere lo mismo. Este recurso es la leyenda única para
saber, antes de empezar cualquier módulo, lab o práctica interactiva, qué necesitas realmente para
completarla — y qué evidencia produce cada tipo.

**Tipo de práctica de este recurso: conceptual.** Es la leyenda misma; no se "ejecuta".

## Las 5 categorías

| Categoría | Qué significa | Qué necesitas | Evidencia típica |
|---|---|---|---|
| 🟢 **Conceptual** | Lectura, ejercicio en papel/Markdown o diseño documentado — no toca ningún sistema. | Nada — ni cuenta ni ambiente. | Un documento, tabla o diagrama completado por ti. |
| 🔵 **Simulada** | Una práctica interactiva dentro de la propia app de PlanEstudio (`/practica`) — decisiones, flujos o queries en un entorno controlado, sin backend real ni ejecución de código arbitrario. | Nada — corre en el navegador, dentro de PlanEstudio. | Resultado guardado automáticamente en tu progreso de práctica interactiva. |
| 🟡 **Developer environment** | Requiere tu ambiente personal Microsoft 365 Developer (el que creas en el Módulo 1) — Power Apps, Power Automate, Dataverse, Copilot Studio. | Cuenta Microsoft 365 Developer activa. Ver [Ruta cero absoluta](/recursos/ruta-cero-absoluta) si todavía no la tienes. | Capturas de pantalla de lo construido, export de la solución, o el propio artefacto (app, flujo). |
| 🟠 **Trial Dynamics 365** | Requiere activar el trial temporal (normalmente 30 días) del producto Dynamics 365 correspondiente (Sales, Customer Service, Customer Insights, Field Service, Contact Center, Finance & Operations). | Trial activo del producto específico — no alcanza con el ambiente Developer del Módulo 1. | Capturas del registro real (lead, caso, segmento…), export o resultado de UAT. |
| 🔴 **Requiere tenant/ambiente compatible (fuera de alcance de PlanEstudio)** | Escenarios que solo existen con licencia de producción, integraciones reales con terceros (pasarela de pagos, sistema académico externo) o gobierno empresarial real. | Un tenant real de empresa, fuera del alcance de este plan de autoestudio. | No aplica como evidencia de este plan — el lab lo marca explícitamente como diseño documentado, no como ejecución verificada. |

Para ver qué entorno/licencia exige cada ruta completa (no solo un lab individual), con duración y
alternativa sin acceso, ver la [Matriz de entornos y trials](/recursos/entornos-y-trials).

## Cómo identificar la categoría de un módulo o lab

- Si el módulo/lab no menciona ningún ambiente ni licencia, es 🟢 **Conceptual** o vive dentro de una
  categoría implícita del nivel (ej. todo el contenido de lectura y ejercicios en papel).
- Si está en `/practica`, es 🔵 **Simulada** por definición — el catálogo entero de práctica interactiva
  corre sin backend, ver [Guía de prácticas interactivas](/recursos/guia-practicas-interactivas).
- Si pide "crear una tabla", "publicar una app", "construir un flujo" sin mencionar Dynamics 365 como
  producto, es 🟡 **Developer environment**.
- Si menciona explícitamente Dynamics 365 Sales/Customer Service/Customer Insights/Field
  Service/Contact Center/Finance & Operations como producto a configurar (no solo como tabla de
  Dataverse), es 🟠 **Trial Dynamics 365**. La [D365 Tenant Readiness Checklist](/recursos/d365-tenant-readiness)
  tiene el detalle completo de gates y evidencia mínima por ruta D365.
- Si el propio lab dice "esto requiere tenant productivo/integración real/licencia empresarial", es
  🔴 **fuera de alcance** — el lab lo señala así explícitamente en su sección de alcance, nunca lo
  presenta como si estuviera verificado.

## Relación con Finance & Operations y Contact Center

Ninguna de las 5 categorías cambia por producto — pero conviene decirlo explícito una vez: **F&O y
Contact Center nunca son ruta principal** en este plan. F&O vive como 🟠 *awareness* (labs 93-100,
requieren trial de Finance/SCM) o 🟢 conceptual (vocabulario y mapas de proceso); Contact Center
combina 🟠 (canal de chat, hands-on en trial) con 🔴 (voz/SMS, que requieren un proveedor de telefonía
real fuera del alcance de autoestudio). Ninguno de los dos gatea tu progreso en los niveles core
(Básico → Intermedio → Avanzado → Arquitectura).

## Errores comunes

- **Error:** asumir que "práctica" siempre significa "necesito un ambiente". **Por qué pasa:** la
  palabra suena a "hacer algo real". **Cómo evitarlo:** revisa la categoría antes de bloquearte
  esperando acceso que no necesitas — buena parte del plan es 🟢 o 🔵 y no requiere nada.
- **Error:** intentar un lab 🟠 sin haber activado el trial correspondiente y frustrarte cuando no
  avanza. **Por qué pasa:** el nombre del lab no siempre deja obvio qué trial específico hace falta.
  **Cómo evitarlo:** revisa el `prerequisites` del frontmatter del lab y la
  [D365 Tenant Readiness Checklist](/recursos/d365-tenant-readiness) antes de empezar.
- **Error:** presentar un lab 🔴 como si lo hubieras "completado" en tu portafolio. **Por qué pasa:**
  se ve tan detallado como uno ejecutable. **Cómo evitarlo:** estos labs son diseño funcional
  defendible en entrevista, no evidencia de ejecución — dilo así en tu portafolio, no lo disfraces.

## Criterio de aprobación

Puedes usar esta leyenda correctamente cuando, al abrir cualquier módulo o lab nuevo, puedas responder
en menos de 10 segundos: ¿qué necesito para esto, y qué evidencia se supone que voy a producir?

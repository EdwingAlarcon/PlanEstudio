---
moduleId: 11
title: "Power Automate Avanzado"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 14
practiceMinutes: 45
slug: "power-automate-avanzado"
lastVerified: "2026-09"
---
### 🎯 Objetivo
Construir flujos empresariales robustos con manejo de errores, ramas paralelas, flujos hijos reutilizables, llamadas HTTP a APIs externas, y procesamiento de alto volumen con batches y paginación — practicando cada concepto de inmediato, con evidencia real de tu propio entorno, antes de pasar al siguiente.

> **Cómo está organizado este módulo (piloto):** en vez de leer todo el marco teórico y recién al final "hacer" algo, cada micro-concepto viene con una micropráctica de feedback inmediato justo después. Vas a **construir** parte de la lógica tú mismo (no vas a copiar una solución ya resuelta), vas a **diagnosticar** un síntoma real antes de ver la causa, y vas a cerrar con un **reto de transferencia** que cambia la regla de negocio para comprobar si entendiste el concepto o memorizaste los pasos.
>
> Necesitas: una cuenta Microsoft 365 y un [entorno Power Platform Developer](https://learn.microsoft.com/power-platform/developer/plan) (gratuito, con Dataverse y conectores premium habilitados para pruebas — no uses el entorno productivo del tenant). El Developer Plan da 750 ejecuciones de flujo al mes, más que suficiente para este módulo.

---

## 🧩 Microlección 1 — Scope, Run After y el patrón Try/Catch

**¿Qué vas a aprender?** Cómo hacer que un flujo detecte sus propios errores y reaccione, en vez de fallar en silencio.

**¿Por qué existe esto?** Power Automate no tiene manejo de excepciones como un lenguaje de programación (`try/catch` nativo). El patrón se construye combinando dos piezas: **Scope** (un contenedor de acciones) y **Run After** (una configuración por acción que decide en qué estado de la acción anterior — `succeeded`, `failed`, `skipped`, `timedOut` — debe ejecutarse la siguiente). Un Scope configurado con Run After = failed/timedOut se convierte, en la práctica, en un bloque `catch`.

**Ejemplo pequeño:**
```
Scope "Try"
  └─ Crear registro en Dataverse (puede fallar)
Scope "Catch"  ← Run After del Scope Try: failed + timed out (succeeded desmarcado)
  └─ Compose con el mensaje de error + Send email al admin
```

**Ahora haz algo — micropráctica (2 min):** antes de construir nada, resuelve esta decisión conceptual con feedback inmediato → **[Retry vs Scope/Try-Catch](/practica/ip-pa-004-retry-scope-try-catch)**. Te va a pedir distinguir cuándo un error se soluciona reintentando (fallos transitorios como HTTP 429) y cuándo necesita Scope + Catch + compensación (fallos funcionales, como datos inválidos que nunca van a tener éxito por más que reintentes).

**Práctica real en tu entorno (10 min):** construye el patrón Try/Catch del ejemplo de arriba en un flujo nuevo de tu entorno Developer, usando **Create a record** de Dataverse dentro del Scope Try (usa una tabla de prueba, ej. `Account`) y **Send an email (V2)** de Outlook dentro del Scope Catch. Fuerza el error a propósito (por ejemplo, referenciando una tabla o columna que no existe) para confirmar que el Catch sí se dispara.

**Evidencia a reportar (no un "sí/no" — el dato exacto que viste):**

| Campo | Tu valor |
|---|---|
| Nombre del flujo | ___ |
| Qué acción forzaste a fallar y cómo (nombre exacto de la acción + qué cambiaste) | ___ |
| Estado del Scope "Try" en el run history (ej. Failed, Succeeded with retries) | ___ |
| Estado del Scope "Catch" en el run history (ej. Succeeded, Skipped) | ___ |
| Mensaje de error capturado por `actions('Scope_Try')['error']['message']` (valor exacto, no resumido) | ___ |

---

## 🧩 Microlección 2 — Child Flow reutilizable

**¿Qué vas a aprender?** Cómo extraer una lógica de decisión reutilizable (un "flujo función") para no duplicarla en varios flujos padre.

**¿Por qué existe esto?** Si tres procesos distintos (compras, contratos, viáticos) necesitan la misma regla de "¿quién aprueba según el monto?", escribir esa lógica tres veces significa mantenerla tres veces. Un **Child Flow** (trigger `When a Power Automate flow is run`) la centraliza: recibe parámetros, decide, y responde con `Respond to a Power Automate flow`.

**Ejemplo pequeño:** un Child Flow que recibe `presupuesto` (Float) y solo necesita UNA condición para decidir entre dos niveles — eso ya lo puedes practicar ahora mismo, sin que te dé la solución completa:

**Ahora haz algo — micropráctica (5 min):** en vez de leer la lógica ya resuelta, ordénala tú mismo con feedback inmediato en → **[Construir aprobación por monto](/practica/ip-pa-002-aprobacion-por-monto)**. Te da las piezas (trigger, condición, acciones) desordenadas y casos de prueba con montos límite — arma la secuencia y valida contra los 3 casos antes de seguir.

**🏗️ Reto de construcción (sin pasos, tenant real):** ahora construye el Child Flow completo de 3 niveles descrito abajo. No te damos la secuencia de acciones esta vez — solo el requerimiento.

> **Requerimiento:** un Child Flow llamado `DeterminarNivelAprobacion` que reciba `presupuesto` (Float) como input y responda `nivel` (String) con tres posibles valores: `"Supervisor"` (presupuesto < 5.000), `"Gerente"` (presupuesto < 50.000) o `"Director"` (cualquier otro caso).
> **Criterios de aceptación:** (1) el flujo debe estar guardado en una solución (requisito técnico de los Child Flows); (2) debe responder exactamente uno de los tres valores para cualquier presupuesto; (3) debes poder invocarlo desde un segundo flujo padre y mostrar el `nivel` recibido.
> **Restricciones:** no uses un Switch/Condition anidado más de 2 niveles de profundidad — resuélvelo con la estructura condicional que consideres más legible.

Si te atoras, no hay problema — abre las pistas progresivas dentro de la micropráctica de arriba (el mismo patrón de decisión aplica) antes de buscar la solución completa en la documentación.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre del Child Flow y de la solución donde vive | ___ |
| Los 3 valores de prueba que usaste y el `nivel` que devolvió cada uno | ___ |
| Nombre exacto del Child Flow tal como aparece en el selector "Run a Child Flow" del flujo padre | ___ |

---

## 🧩 Microlección 3 — HTTP a APIs externas, Parse JSON y Paginación

**¿Qué vas a aprender?** Cómo tu flujo consume una API externa y por qué una lista "completa" a veces no lo está.

**¿Por qué existe esto?** La acción **HTTP** (conector Premium) te permite llamar cualquier API REST. Su respuesta llega como texto y se estructura con **Parse JSON**. Aparte, cualquier acción que liste registros (Dataverse, SharePoint, o tu propia paginación manual con `@odata.nextLink`) tiene un límite por defecto de 256 filas — si no lo sabes, tu flujo "funciona" pero pierde datos en silencio.

**Ejemplo pequeño:** una llamada HTTP a una API pública de tasas de cambio, sin necesidad de licencia adicional para probarla en tu entorno Developer:
```
GET https://api.exchangerate-api.com/v4/latest/USD
Headers: Accept: application/json
```

**🔧 Diagnosticar antes de construir — troubleshooting challenge (5 min):** antes de que te expliquemos la causa, resuelve este caso con evidencia real → **[Diagnosticar: el flujo se detiene en 256 registros](/practica/ip-pa-005-diagnosticar-corte-en-256-registros)**. Te damos el síntoma y la evidencia de ejecución (run history en "Succeeded", pero solo una fracción de los registros esperados quedó actualizada) — formula tu hipótesis, pide pistas si las necesitas, y solo al final revisa la causa real.

**Práctica real en tu entorno (10 min):** construye el flujo del ejemplo (llamada HTTP + Parse JSON) y guarda 3 monedas de interés en una tabla de Dataverse. Verifica el schema de Parse JSON generándolo desde una respuesta de ejemplo real, no escribiéndolo a mano.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Código de estado HTTP de la respuesta | ___ |
| Una de las 3 tasas de cambio obtenidas (valor exacto) | ___ |
| Nombre lógico de la tabla/columnas donde las guardaste | ___ |

---

## 🧩 Microlección 4 — Ramas paralelas, Batch y compensación

**¿Qué vas a aprender?** Cómo ejecutar acciones independientes al mismo tiempo en vez de una tras otra, y qué hacer cuando un paso posterior falla después de que otro ya se completó.

**¿Por qué existe esto?** Si tres notificaciones (Teams, email, actualización de Dataverse) no dependen entre sí, ejecutarlas en **Parallel Branch** puede bajar el tiempo total de 30s a ~10s. Y como Power Automate no tiene transacciones nativas, si un paso falla después de que otro ya escribió datos, necesitas una **compensación** explícita (deshacer lo ya hecho) dentro de un Scope Catch — no asumas que "se puede revertir solo".

**Práctica real en tu entorno (8 min) — sin pasos dados:** agrega 3 ramas paralelas a un flujo disparado por aprobación (puedes reutilizar el Child Flow de la Microlección 2): notificación Teams, email con resumen, y actualización de un campo de fecha en Dataverse. Cronometra la ejecución total en el run history.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Duración total del run con las 3 ramas en paralelo | ___ |
| Duración individual de cada una de las 3 ramas, tal como la muestra el run history (Teams / email / Dataverse) | ___ |
| Nombre de la acción que se ejecutó inmediatamente después de que las 3 ramas terminaran | ___ |

---

## 🔁 Reto de transferencia

Ya practicaste: condición con umbral (Microlección 2), llamada HTTP + Parse JSON (Microlección 3), y diagnóstico de paginación. Ahora la regla de negocio **cambia**: la aprobación ya no depende del monto en la moneda original, sino de su equivalente en USD, calculado en tiempo real.

**[Transferir: aprobar según el monto convertido a USD](/practica/ip-pa-006-transferir-umbral-en-moneda-convertida)** — no es solo cambiar un número: tienes que reconocer que la conversión (HTTP + Parse JSON) debe ejecutarse **antes** de la condición, porque la condición ahora depende de un dato que no existe cuando el flujo arranca. Si solo memorizaste el orden de bloques de la Microlección 2 sin entender por qué van en ese orden, este reto te lo va a mostrar.

Si tienes tiempo, constrúyelo también en tu tenant real usando la llamada HTTP de la Microlección 3 y reporta el mismo tipo de evidencia (monto original, tasa usada, monto convertido, resultado de la aprobación).

---

### 💼 Caso Real de Negocio
**Empresa:** Empresa importadora con flujos de aprobación de órdenes de compra
**Problema:** El flujo de aprobación tardaba 4 minutos por orden, con frecuentes errores silenciosos cuando la API de proveedores fallaba.
**Solución:** Patrón Try-Catch con registro de errores en SharePoint + notificación al admin. Flujo hijo reutilizable calcula nivel de aprobación (el mismo para órdenes de compra y contratos). Ramas paralelas reducen notificaciones de 3 steps secuenciales a 1 paso paralelo.
**Resultado:** Tiempo de flujo reducido de 4 min a 45 seg. Tasa de errores silenciosos: 0%.

### ✅ Buenas Prácticas
- Siempre usar Scope + Run After para manejar errores en flujos de producción
- Child Flows deben estar en la misma solución que los flujos padre
- Limitar Apply to Each a máx 5000 iteraciones; usar Dataverse Batch API para volúmenes mayores
- Activar paginación en todas las acciones de lista que puedan retornar >256 registros
- Variables de entorno para URLs y configuraciones que cambian entre ambientes
- Usar nombres descriptivos en todas las acciones (evitar "HTTP 2", "Condition 3")

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Child Flow no aparece en la lista | No está en solución o no tiene el trigger correcto | Agregar a solución y verificar disparador "Child Flow" |
| HTTP 429 Too Many Requests | El flujo llama API sin throttling | Agregar Delay entre iteraciones en Apply to Each |
| Apply to Each toma horas | Procesamiento secuencial de miles de registros | Activar Concurrency en Apply to Each (máx 50 parallel) |
| Variables no persisten entre bucles | Se reinician en cada iteración | Usar Compose + Set Variable, no Initialize |
| Un flujo "Succeeded" perdió datos silenciosamente | Límite de 256 registros sin paginación activada | Activar Pagination en la acción de lista (ver Microlección 3) |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica de Scope/Try-Catch y construí el patrón real en mi entorno, forzando el error a propósito
- [ ] Construí el Child Flow de 3 niveles sin ver los pasos completos de antemano, y documenté con qué pistas (si alguna) lo logré
- [ ] Diagnostiqué el corte en 256 registros formulando una hipótesis antes de ver la causa, y lo reproduje/corregí en mi propio entorno
- [ ] Consumí una API externa real con HTTP + Parse JSON y guardé el resultado en Dataverse
- [ ] Ejecuté 3 ramas paralelas y medí la reducción real de tiempo en el run history
- [ ] Completé el reto de transferencia (umbral en USD) explicando por qué el orden de las acciones cambió, no solo el número del umbral

---

## Notas de esta iteración piloto

Este módulo es el piloto de una arquitectura pedagógica más amplia, todavía no aplicada al resto del curso. Si esta iteración se valida, el mismo patrón (concepto breve → micropráctica → feedback → construir sin pasos → diagnosticar con síntoma primero → transferir con un requisito distinto) es el candidato a generalizarse — ver la auditoría final del piloto para la decisión.

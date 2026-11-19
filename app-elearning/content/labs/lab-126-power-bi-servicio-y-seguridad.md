---
id: lab-126
title: "Power BI — Servicio y seguridad: publicar, dashboard, alertas, actualización y RLS (Ruta Pro Power BI)"
level: "N2"
duration: 210
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 125 completado — ruta-pro-sit-ventas.pbix con las páginas Resumen comercial, Mensual, Detalle vendedor y Análisis"
  - "Una cuenta de trabajo o estudio con acceso al servicio de Power BI (app.powerbi.com); basta una licencia gratuita para My workspace"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 126 — Power BI: servicio y seguridad

## Objetivo

Llevar el reporte al servicio de Power BI y dejarlo listo para el comité: publicarlo en **My workspace**, armar un **dashboard** con una **alerta**, configurar la **actualización programada** (y entender por qué los archivos locales necesitan una puerta de enlace) y proteger los datos con **seguridad a nivel de fila** (RLS): un rol estático y un rol dinámico que lee el correo de quien abre el reporte. Cubre "Manage and secure Power BI" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 125.

**Problema a resolver:** el director comercial quiere que cada gerente vea su país y cada ejecutivo su región, desde el mismo reporte y sin mantener una copia por persona. Además quiere un aviso cuando el cumplimiento del año en curso supere el objetivo, y que el reporte se actualice solo cada mañana.

## Lo que vas a construir

- El reporte publicado en **My workspace**, con su modelo semántico
- El dashboard `Comité comercial` con tarjetas, una página anclada y una alerta
- La actualización programada configurada, con la decisión sobre la puerta de enlace
- El rol estático `Solo Colombia` y el rol dinámico `Comercial`, con la tabla puente `VendedorRegion`
- La comprobación de lo que ve cada persona con **View as** y, en el servicio, con **Test as role**

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Labs 119-125: modelo, medidas y páginas | Publicación, dashboard, alertas, actualización, RLS | Lab 127 (reto Pro) exige publicar y proteger su propio reporte |

> **Fuente del esqueleto:** los labs de servicio y seguridad del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y las páginas de Learn citadas. El caso, los datos y el texto son propios del curso.

## Qué puedes hacer con cada licencia

Según Learn ([funciones por tipo de licencia](https://learn.microsoft.com/power-bi/fundamentals/service-features-license-type)), con licencia gratuita puedes crear contenido **para tu propio uso** en **My workspace**, pero no compartirlo ni publicar en workspaces de otras personas.

| Tarea | Licencia gratuita (My workspace) | Pro, PPU o capacidad |
|---|---|---|
| Publicar en **My workspace** | ✅ | ✅ |
| Dashboards en **My workspace** | ✅ Learn: "You can create dashboards in your own My Workspace without a Power BI Pro or Premium Per User (PPU) license" | ✅ |
| Alertas en mosaicos de **My workspace** | ✅ Learn: "You can set alerts on tiles in your My Workspace" | ✅ |
| Actualización programada en **My workspace** | ✅ Learn la incluye entre lo que pueden hacer los usuarios gratuitos en My workspace | ✅ (con Pro, hasta 8 al día) |
| Roles de RLS y **View as** en Desktop | ✅ (no necesita el servicio) | ✅ |
| Roles y **Test as role** en el servicio | Inténtalo: eres la propietaria del modelo. Si el servicio no te deja, usa la variante en papel | ✅ |
| Compartir con otras personas o publicar en otros workspaces | ❌ | ✅ |
| Guardar marcadores personales de un visual personalizado | Puede no estar disponible | ✅ según la configuración |

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Publicar en My workspace | 15 min |
| Ejercicio 2 — Un dashboard para el comité | 25 min |
| Ejercicio 3 — Una alerta | 15 min |
| Ejercicio 4 — Actualización programada | 30 min |
| Ejercicio 5 — RLS estática | 20 min |
| Ejercicio 6 — RLS dinámica con una tabla puente | 75 min |
| Ejercicio 7 — RLS en el servicio | 20 min |
| Ejercicio 8 — Personalizar visuales en el reporte publicado | 10 min |
| **Total** | **unas 3 h 30 min** (mejor en dos sesiones: Ejercicios 1 a 4 y 5 a 8) |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: **Publish**, **Modeling** > **Manage roles** (**Switch to DAX editor**), **View as**, Power Query (**Merge queries as new**, **Enter data**)
- Servicio de Power BI: **My workspace**, anclar visuales, dashboards, **Manage alerts**, **Schedule refresh**, **Security**, **Test as role**
- DAX: `USERPRINCIPALNAME`, `CALCULATETABLE`, `VALUES`, `IN`

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 125
- [ ] Una cuenta de trabajo o estudio con la que entrar en [app.powerbi.com](https://app.powerbi.com). Con el ambiente del curso ([Entornos y trials](/recursos/entornos-y-trials)) ya tienes una
- [ ] Inicia sesión en Power BI Desktop con esa cuenta (arriba a la derecha)

### Conocimiento previo

- Lab 117: parámetro `CarpetaDatos`, niveles de privacidad y el error de combinar orígenes en una consulta
- Lab 119: relaciones y dirección del filtro
- Lab 120: `CALCULATE` y cómo una tabla filtra a otra

---

## Ejercicio 1 — Publicar en My workspace

**Objetivo:** subir el reporte y su modelo al servicio.

1. Guarda el archivo. En la cinta **Home**, **Publish**. Elige **My workspace** y confirma.
2. Cuando termine, abre el enlace que muestra Power BI Desktop. En **My workspace** verás dos elementos con el mismo nombre: el **reporte** (las páginas) y el **modelo semántico** (las tablas, relaciones y medidas). Se publican juntos, pero son elementos distintos: el dashboard, la alerta y la actualización se configuran sobre ellos por separado.
3. Abre el reporte en el navegador y recorre las páginas. Prueba el drillthrough de Camila Restrepo (Lab 124): en el servicio, en modo lectura, basta un clic derecho, y los botones funcionan con un clic, sin **Ctrl**.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Elementos que aparecen en **My workspace** | ___ |
| ¿Funcionan el drillthrough y los botones en el navegador? | ___ |

---

## Ejercicio 2 — Un dashboard para el comité

**Objetivo:** una sola pantalla con lo esencial de varias páginas ([Learn: dashboards](https://learn.microsoft.com/power-bi/create-reports/service-dashboards)).

**Reporte frente a dashboard:** un reporte tiene páginas interactivas sobre un modelo; un dashboard es una sola página de **mosaicos** (*tiles*) anclados desde uno o varios reportes. En el dashboard no se filtra: un clic en un mosaico abre el reporte de origen.

> **Un mosaico anclado guarda los filtros que tenía al anclarlo.** Si el slicer estaba en 2025, la tarjeta muestra 2025 para siempre. Por eso, antes de anclar cada visual, elige el año en el slicer a propósito.

1. En el reporte publicado, página `Resumen comercial`, pon el slicer en **2025**. Pasa el puntero sobre la tarjeta `Ventas Totales` y selecciona el icono de anclar (la chincheta) ([Learn: anclar desde un reporte](https://learn.microsoft.com/power-bi/create-reports/service-dashboard-pin-tile-from-report)). Elige **New dashboard**, escribe `Comité comercial` y ancla.
2. Ancla también el gráfico de líneas mensual de la misma página (Lab 123) en **Existing dashboard** > `Comité comercial`.
3. Cambia el slicer a **2026** y ancla la tarjeta `% Cumplimiento` en el mismo dashboard. Esta es la que llevará la alerta: tiene que ser la del año en curso.
4. Ancla la página `Mensual` **entera**: en la barra del reporte, **…** > la opción de anclar a un dashboard la página completa (en muchas versiones se llama **Pin live**). Learn indica que, al anclar una página entera, los mosaicos son **en vivo**: reflejan los filtros y slicers de la página.
5. Abre el dashboard. Pon en el título de cada tarjeta de qué año es (menú **…** del mosaico > editar los detalles del mosaico): un dashboard no tiene slicer para preguntarlo.

### Resultado esperado del Ejercicio 2

| Mosaico | Valor |
|---|---|
| `Ventas Totales` 2025 | 20.840.961,90 (la tarjeta puede abreviarlo: "20,84M" o similar) |
| `% Cumplimiento` 2026 | **81,05 %** (18.936.520,50 de ventas hasta octubre contra 23.363.000 de objetivo anual) |

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Valor y año de cada tarjeta del dashboard | ___ |
| Qué pasa al hacer clic en un mosaico | ___ |

---

## Ejercicio 3 — Una alerta

**Objetivo:** que el director reciba un aviso cuando el cumplimiento de 2026 supere el objetivo ([Learn: alertas de datos](https://learn.microsoft.com/power-bi/create-reports/service-set-data-alerts)).

1. En el dashboard, abre el menú del mosaico `% Cumplimiento` 2026 (**…**) > **Manage alerts**.
2. **+ Add alert rule**. Deja **Active** encendido. Condición: **por encima** del 100 %. La medida es una fracción (1 = 100 %), pero la tarjeta muestra un porcentaje: escribe `1` y, al volver a abrir **Manage alerts**, comprueba cómo quedó el umbral (Learn no aclara si en una tarjeta con formato de porcentaje se escribe 1 o 100). Frecuencia: como máximo una vez al día.
3. Guarda la regla.

**Límites que da Learn:** solo se pueden poner alertas en mosaicos anclados desde visuales de reporte y solo en **tarjetas, KPI e indicadores** (*gauges*); únicamente sobre datos numéricos; no en tarjetas con medidas de fecha u hora; hasta 250 alertas en total.

> **Cuándo se evalúa:** Learn indica que las alertas solo funcionan con datos actualizados y que solo se envían si los datos cambian, para no avisar dos veces por el mismo valor. Hoy 2026 va en 81,05 %: la alerta saltará cuando una actualización traiga ventas suficientes para superar el 100 %. Si el modelo nunca se actualiza (Ejercicio 4), no saltará nunca.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Por qué no puedes poner la alerta en el gráfico de líneas | ___ |
| Por qué la alerta va en la tarjeta de 2026 y no en la de 2025 | ___ |

---

## Ejercicio 4 — Actualización programada

**Objetivo:** que el modelo se actualice solo, y entender qué necesita para conseguirlo ([Learn: actualización programada](https://learn.microsoft.com/power-bi/connect-data/refresh-scheduled-refresh)).

1. En **My workspace**, abre el **modelo semántico** (no el reporte) y busca **Refresh** > **Schedule refresh**.
2. Revisa las secciones de la configuración:
   - **Gateway and cloud connections**: con qué se conecta el servicio a tus orígenes.
   - **Data source credentials**: las credenciales de cada origen.
   - **Parameters**: el valor de `CarpetaDatos` (Lab 117) que usará el servicio.
   - **Configure a refresh schedule**: activa el control, elige una hora diaria (por ejemplo, 6:00) y **Apply**.
3. **Tus orígenes son de dos tipos:**
   - **Archivos de tu equipo** (la carpeta de SIT Ventas): el servicio está en la nube y no puede leer tu disco. Learn lo dice así: si el modelo usa un origen al que Power BI no puede llegar por una conexión de red directa, hay que configurar una **puerta de enlace** (*gateway*). Lo esperado es que la sección de la puerta de enlace aparezca deshabilitada o con un aviso para instalar una, y que la actualización no pueda completarse.
   - **Una URL**: `TiposCambio` se lee con el conector **Web** (Lab 117, credencial **Anonymous**). Ese origen está en internet y el servicio llega a él sin puerta de enlace. Lo verás en **Data source credentials**.
4. **Decide y documenta** una de estas opciones (no hace falta instalarla):

| Opción | Qué implica |
|---|---|
| Puerta de enlace en modo personal en tu equipo | El equipo tiene que estar encendido a la hora de la actualización; solo sirve para ti |
| Puerta de enlace estándar en un servidor | La administra TI y sirve para varios modelos. `CarpetaDatos` tendría que apuntar a una carpeta que vea el servidor (por ejemplo, una ruta de red `\\servidor\datos\sit-ventas\`), y ese valor se cambia en **Parameters** del modelo en el servicio |
| Llevar los CSV a SharePoint o OneDrive para empresas y leerlos con el conector de carpeta de SharePoint | El servicio llega sin puerta de enlace y se actualiza con la programación normal. Hay que reescribir las consultas de origen: cambiar `CarpetaDatos` no basta. Ojo: una carpeta de OneDrive **sincronizada en tu equipo** (`C:\Users\…\OneDrive\…`) sigue siendo una ruta local y sigue necesitando puerta de enlace |
| Leer cada archivo desde una URL (conector **Web**), como `TiposCambio` | Sin puerta de enlace, si la URL es pública o tiene credenciales que el servicio pueda usar |

> **No confundas dos cosas de OneDrive:** Learn describe una "actualización de OneDrive" que se aplica cuando el propio **archivo .pbix** está en OneDrive o SharePoint: Power BI lo revisa cada hora aproximadamente y ese intervalo no se configura. Eso sincroniza el modelo con el archivo, no lee tus CSV.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Qué te dice el servicio sobre la puerta de enlace y sobre cada origen | ___ |
| La opción que elegirías para SIT y por qué, en dos líneas | ___ |

---

## Ejercicio 5 — RLS estática

**Objetivo:** un rol que solo ve Colombia ([Learn: seguridad a nivel de fila](https://learn.microsoft.com/fabric/security/service-admin-row-level-security)).

Vuelve a **Power BI Desktop**.

1. Cinta **Modeling** > **Manage roles**. **New**: nombre `Solo Colombia`.
2. Elige la tabla `Regiones` y añade la regla `Pais` igual a `Colombia` (en el editor por defecto) o, con **Switch to DAX editor**:

```dax
[Pais] = "Colombia"   // la regla filtra Regiones; el filtro baja a Ventas por la relación
```

3. **Save**.
4. **Modeling** > **View as**: marca solo `Solo Colombia` y acepta. Arriba del lienzo aparece un aviso de que estás viendo el reporte como ese rol.

### Resultado esperado del Ejercicio 5 (2025)

`Ventas Totales` = **9.208.289,00** (Andina, Antioquia y Caribe), el total de Colombia del Lab 121.

5. **Mira `Objetivo Total`:** sigue mostrando el objetivo de **todos** los vendedores (19.884.000). `Regiones` no tiene relación con `Objetivos` (Lab 119): la regla protege las ventas, pero el objetivo de México, Chile y Perú se ve. **Una regla protege solo lo que su filtro alcanza por las relaciones.** El Ejercicio 6 lo resuelve.
6. Sal de la vista del rol (desde el aviso, o desmarcando el rol).

> **No pongas reglas en la tabla del grupo de cálculo** (`Inteligencia de tiempo`, Lab 121): no tiene datos que proteger y una regla ahí afectaría a cómo se calculan las medidas.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| `Ventas Totales` y `Objetivo Total` con `Solo Colombia` (2025) | ___ |
| Por qué el objetivo no se filtra | ___ |

---

## Ejercicio 6 — RLS dinámica con una tabla puente

**Objetivo:** un solo rol, `Comercial`, en el que cada persona ve sus regiones según su correo: los gerentes, su país; los ejecutivos, su región.

### Tarea 6.1 — La tabla puente

El archivo `vendedor-region.csv` dice en qué regiones trabaja cada persona: los ejecutivos en una, los dos gerentes en varias (13 filas). Le falta el correo, que es lo que devuelve `USERPRINCIPALNAME()`.

1. **Transform data** > **New Source** > **Text/CSV** > `vendedor-region.csv`. En el paso **Source**, cambia la ruta escrita por el parámetro `CarpetaDatos`, como en las demás consultas (Lab 117). Nombra la consulta `VendedorRegionOrigen`.
2. Asigna al archivo el nivel de privacidad **Organizational** (**Data source settings**, como en el Lab 118).
3. Combinar en una sola consulta un origen nuevo con otra consulta produce el error de combinación de datos que viste en el Lab 117. Por eso el cruce va en una consulta aparte: con `VendedorRegionOrigen` seleccionada, **Merge queries as new** con `Vendedores` por `VendedorID` (**Left outer**) y expande solo `Correo` (sin prefijo). Nombra la consulta nueva `VendedorRegion`.
4. `VendedorRegion` debe tener **13** filas y tres columnas: `VendedorID`, `RegionID`, `Correo`. Desmarca **Enable load** en `VendedorRegionOrigen` (es un paso intermedio). **Close & Apply**.
5. En **Model view**, si Power BI creó relaciones automáticas para `VendedorRegion`, bórralas: esta tabla no filtra nada, solo la consultan las reglas. Ocúltala (**Is hidden**).

> **Por qué una tabla desconectada y no relaciones en ambos sentidos:** el Lab 119 anunciaba que las tablas puente usan **Both**. Es la otra forma de hacerlo: relacionar la puente con `Vendedores` y `Regiones` y propagar el filtro de seguridad en las dos direcciones. Funciona, pero añade caminos ambiguos al modelo para todo el reporte, no solo para la seguridad. Con la tabla desconectada, la lógica vive en dos reglas que se leen solas.

### Tarea 6.2 — El rol

1. **Manage roles** > **New**: `Comercial`. **Switch to DAX editor**.
2. Regla en `Regiones` (qué regiones ve la persona):

```dax
[RegionID]
    IN CALCULATETABLE (
        VALUES ( VendedorRegion[RegionID] ),
        VendedorRegion[Correo] = USERPRINCIPALNAME ()   // las filas de la puente con el correo de quien abre el reporte
    )
```

3. Regla en `Vendedores` (qué vendedores ve: los que trabajan en esas regiones). Sin ella, `Objetivos` quedaría abierto, como en el Ejercicio 5:

```dax
VAR MisRegiones =
    CALCULATETABLE (
        VALUES ( VendedorRegion[RegionID] ),
        VendedorRegion[Correo] = USERPRINCIPALNAME ()
    )
RETURN
    [VendedorID]
        IN CALCULATETABLE (
            VALUES ( VendedorRegion[VendedorID] ),
            TREATAS ( MisRegiones, VendedorRegion[RegionID] )   // todos los que trabajan en mis regiones
        )
```

4. **Save**.

### Tarea 6.3 — Comprobar lo que ve cada persona

1. **Modeling** > **View as**: marca **solo** `Comercial` (los roles marcados a la vez se suman: con `Solo Colombia` también marcado verías otra cosa) y la opción para ver como **otro usuario** (en muchas versiones, **Other user**), y escribe el correo de la persona, por ejemplo `natalia.vargas@sit-demo.example.com`. Sin indicar otro usuario, `USERPRINCIPALNAME()` devuelve tu propio correo y verás el reporte vacío.
2. Con el slicer en **2025**, anota `Ventas Totales`, `Objetivo Total` y `% Cumplimiento` en `Resumen comercial`, y qué vendedores salen en la matriz.
3. Pon también `Ventas por Entrega` (Lab 119) en una tarjeta. Learn advierte que, con RLS, `USERELATIONSHIP` puede dar errores inesperados. Con estas reglas (en `Regiones` y `Vendedores`, fuera del camino de las fechas) no debería fallar: anota si da error.

### Resultado esperado de la Tarea 6.3 (2025)

| Usuario (correo) | Regiones | Ventas Totales | Objetivo Total | % Cumplimiento |
|---|---|---|---|---|
| Natalia Vargas, gerente Colombia | Andina, Antioquia, Caribe | **9.208.289,00** | 8.689.000 | 105,98 % |
| Ricardo Salinas, gerente México | Centro, Norte | **5.736.172,90** | 5.246.000 | 109,34 % |
| Camila Restrepo, ejecutiva | Antioquia | **4.303.248,20** | 3.896.000 | 110,45 % |
| Andrés Rojas, ejecutivo | Andina | **2.279.734,90** | 2.693.000 | 84,65 % |
| `nadie@sit-demo.example.com` | ninguna | (vacío) | (vacío) | (vacío) |

Calculado sobre los archivos del curso. Camila ve exactamente su fila del Lab 119 (4.303.248,20 contra 3.896.000), y quien no está en la tabla puente no ve nada: es el comportamiento seguro por defecto.

### Tarea 6.4 — Decisiones que el director tiene que tomar

1. **Andrés ve las ventas de Laura** (2.279.734,90 es toda Andina, donde trabajan los dos) y su `% Cumplimiento` (84,65 %) mezcla los dos. Con estas reglas, un ejecutivo ve **su región**, no solo lo suyo. ¿Es lo que quiere el director? Escribe cómo cambiarías la regla de `Vendedores` para que un ejecutivo solo se vea a sí mismo y un gerente vea a su equipo (pista: distinguir por `Vendedores[Cargo]`).
2. **Oculto no es seguro:** `VendedorRegion` está oculta, pero no tiene regla: cualquiera con permiso para crear contenido sobre el modelo podría ver los correos de todos. Si eso importa, la puente necesita su propia regla (y entonces las reglas de las otras tablas deben calcularse de otra forma).
3. **RLS no restringe a todos:** Learn indica que, en un workspace, RLS solo restringe a quienes tienen permisos de **Viewer**. Tú, como propietaria de **My workspace**, siempre ves todo.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Filas de `VendedorRegion` | ___ (esperado: 13) |
| Ventas y objetivo de Natalia Vargas en 2025 | ___ |
| ¿`Ventas por Entrega` dio error con el rol activo? | ___ |
| Tu propuesta para que un ejecutivo solo se vea a sí mismo | ___ |

---

## Ejercicio 7 — RLS en el servicio

**Objetivo:** ver los roles en el servicio y probarlos.

1. Publica de nuevo (**Publish**, reemplazando el que ya existe en **My workspace**).
2. En el servicio, en el menú **…** del modelo semántico, **Security**. Aparecen los roles `Solo Colombia` y `Comercial`. Learn indica que **Security** aparece a quien tiene rol de Contributor o superior en el workspace; en **My workspace** eres la propietaria.
3. Añade tu propio correo como miembro de `Solo Colombia` y usa **Test as role** (en **…** junto al rol): verás 9.208.289,00 en 2025. El encabezado **Now viewing as** indica con qué identidad lo ves. En **My workspace** la asignación no tiene efecto real, porque nadie más entra, pero comprueba que sabes hacerla.
4. **El rol dinámico en el servicio:** Learn advierte que **Test as role** evalúa la RLS dinámica **con tu identidad**: `USERPRINCIPALNAME()` devuelve tu correo, que no está en la puente, y `Comercial` saldrá vacío. Los correos `@sit-demo.example.com` no existen en tu tenant, así que no puedes elegirlos. Para probarlo de verdad:
   - En Power Query, **Home** > **Enter data**: una tabla `PruebaRLS` con una fila: `VendedorID` = `V03`, `RegionID` = `R02` y `Correo` = tu propio correo. Añádela a `VendedorRegion` con **Append queries**.
   - Publica y prueba `Comercial` con **Test as role**: deberías ver lo mismo que Camila (Antioquia, 4.303.248,20 en 2025).
   - **Quita esa fila antes de cualquier uso real**: una fila de prueba olvidada en una tabla de seguridad da acceso a quien no debe.
5. **Si el servicio no te deja asignar miembros o probar con licencia gratuita**, usa la variante en papel: escribe la tabla de asignación que harías (qué grupo de seguridad de Microsoft Entra iría en cada rol, por ejemplo "Gerentes comerciales" y "Ejecutivos de cuenta" en `Comercial`) y por qué un rol dinámico necesita **menos** mantenimiento que un rol por región.

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Roles que aparecen en **Security** | ___ |
| Qué viste con **Test as role** en `Comercial` antes y después de la fila de prueba | ___ |

---

## Ejercicio 8 — Personalizar visuales en el reporte publicado

**Objetivo:** probar lo que activaste en el Lab 124 ([Learn: personalize visuals](https://learn.microsoft.com/power-bi/create-reports/power-bi-personalize-visuals)).

1. Abre el reporte publicado en modo lectura. En el gráfico de barras de categorías de `Resumen comercial`, pasa el puntero y busca el icono de personalizar en el encabezado del visual.
2. Cambia el tipo a columnas o el eje a `Regiones[Pais]`, y vuelve a la vista original.
3. Guardar tu versión como marcador personal puede no estar disponible con licencia gratuita: Learn lo sitúa en contenido de capacidad con rol de Viewer. Si no aparece, anótalo. Learn indica además que los visuales personalizados no se exportan a PowerPoint ni a PDF.

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| **Publish** pide iniciar sesión o no muestra **My workspace** | Power BI Desktop no tiene sesión iniciada con tu cuenta | Inicia sesión arriba a la derecha |
| No aparece **Manage alerts** en un mosaico | No es una tarjeta, KPI o indicador, o no se ancló desde un reporte | Ancla una tarjeta |
| La actualización programada falla o no se puede activar | Los orígenes son archivos locales sin puerta de enlace | Ejercicio 4: elige y documenta una opción |
| `VendedorRegion` da un error de combinación de datos | El merge se hizo dentro de la consulta que lee el CSV | **Merge queries as new** en una consulta aparte (Tarea 6.1) |
| `Solo Colombia` filtra las ventas pero no el objetivo | `Regiones` no está relacionada con `Objetivos` | Regla en `Vendedores` (Ejercicio 6) |
| Con `Comercial`, todo sale vacío en Desktop | No marcaste la opción de otro usuario, o el correo no coincide exactamente (mayúsculas, espacios) | Revisa el diálogo de **View as** y `VendedorRegion[Correo]` |
| Con `Comercial`, Camila ve todas las regiones | El rol no está activo en **View as**, o está marcado también otro rol | Marca solo `Comercial` |
| `Comercial` sale vacío con **Test as role** en el servicio | **Test as role** usa tu identidad y tu correo no está en la puente | Ejercicio 7, fila de prueba |
| En el servicio, el propietario ve todo con el rol asignado | Es lo esperado: RLS solo restringe a Viewers | Prueba con **Test as role** |

## 🔧 Diagnóstico y reparación

### "Un gerente me dice que no ve nada"

1. **¿Su correo está en la puente?** Búscalo en `VendedorRegion`. Si no está, la regla devuelve una lista vacía y no ve nada (el comportamiento correcto ante la duda).
2. **¿Es el mismo correo con el que entra?** `USERPRINCIPALNAME()` devuelve el nombre de inicio de sesión, que a veces no es el correo que se usa para escribir. Pruébalo con una medida temporal `Quién soy = USERPRINCIPALNAME()` en una tarjeta.
3. **¿Está en el rol?** En el servicio, **Security** > **Members**.

## Checklist final

- [ ] Reporte y modelo semántico en **My workspace**
- [ ] Dashboard `Comité comercial` con `Ventas Totales` 2025, `% Cumplimiento` 2026 (81,05 %), la línea y la página `Mensual` en vivo
- [ ] Alerta en `% Cumplimiento` 2026 por encima del 100 %
- [ ] Actualización programada configurada, con la opción de puerta de enlace elegida
- [ ] `Solo Colombia`: 9.208.289,00 en 2025, con la observación del objetivo
- [ ] `Comercial`: Natalia 9.208.289,00 / 8.689.000; Camila 4.303.248,20 / 3.896.000; correo desconocido, vacío
- [ ] Roles en **Security** del servicio, probados con **Test as role** (o variante en papel)

## Evidencia esperada

- Captura de **My workspace** con el reporte y el modelo
- Captura del dashboard y de la regla de alerta
- Captura o texto de la configuración de actualización y tu decisión sobre la puerta de enlace
- Captura de **View as** con `Comercial` como Natalia Vargas
- Tus respuestas de la Tarea 6.4

## Criterios de aprobación

- El reporte está publicado y el dashboard reúne lo esencial con una alerta sobre el año en curso
- Explica por qué los archivos locales necesitan una puerta de enlace y propone una opción razonada
- El rol dinámico filtra ventas **y** objetivos, y lo comprueba con varios usuarios, incluido uno desconocido
- Prueba los roles en el servicio o, si su licencia no lo permite, entrega la variante en papel

## Competencias desarrolladas

- Publicar contenido en el servicio y crear dashboards
- Configurar alertas de datos y la actualización programada
- Implementar seguridad a nivel de fila estática y dinámica con `USERPRINCIPALNAME`
- Probar roles con **View as** y **Test as role**

## Reto adicional

**Reto básico:** crea un rol `Solo México` con la misma lógica que `Solo Colombia` y añade también la regla en `Vendedores` para que el objetivo quede filtrado. ¿Cuánto da `Objetivo Total` en 2025?

**Reto intermedio:** implementa la propuesta de la Tarea 6.4: un ejecutivo ve solo sus ventas y un gerente las de su equipo. Comprueba que Andrés Rojas ve 1.338.936,20 en 2025 y Natalia Vargas sigue viendo 9.208.289,00.

**Reto avanzado:** cambia el origen de `regiones.csv` para leerlo desde la URL de la app del curso con el conector **Web** (como `TiposCambio`). Si construyes la URL concatenando el parámetro, investiga por qué el servicio puede considerarla un origen dinámico que no se actualiza, y cómo lo evita la opción `RelativePath` de `Web.Contents`.

## Preguntas de repaso

1. ¿Qué diferencia hay entre un reporte y un dashboard?
2. ¿Por qué una alerta no se dispara si el modelo no se actualiza?
3. ¿Por qué el rol `Solo Colombia` no filtraba el objetivo y qué lo resolvió?
4. ¿Por qué **Test as role** muestra vacío el rol dinámico y cómo lo pruebas sin dar acceso a nadie?

## Limpieza del laboratorio

Quita la fila de `PruebaRLS` de la puente si la añadiste. El Lab 127 empieza un archivo nuevo, así que el reporte publicado ya no hace falta: consérvalo como evidencia de portafolio o bórralo (dashboard, reporte y modelo) de **My workspace**.

## Siguiente laboratorio recomendado

**[Lab 127 — Reto Pro sin pasos](/labs/lab-127-power-bi-reto-pro-sin-pasos)**: un caso nuevo, de los archivos al reporte publicado y protegido, evaluado con una rúbrica por dominio.

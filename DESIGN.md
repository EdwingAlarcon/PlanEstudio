---
name: PlanEstudio
description: Consola de aprendizaje Power Platform / Dynamics 365 que clona el lenguaje visual Fluent UI / Microsoft Learn
colors:
  primary: "hsl(206, 100%, 41.6%)"
  primary-foreground: "hsl(0, 0%, 100%)"
  secondary: "hsl(210, 20%, 96%)"
  secondary-foreground: "hsl(220, 14%, 14%)"
  muted: "hsl(210, 20%, 96%)"
  muted-foreground: "hsl(220, 9%, 38%)"
  accent: "hsl(204, 83%, 96%)"
  accent-foreground: "hsl(206, 100%, 30%)"
  destructive: "hsl(358, 64%, 50%)"
  destructive-foreground: "hsl(0, 0%, 100%)"
  background: "hsl(0, 0%, 100%)"
  foreground: "hsl(220, 14%, 14%)"
  card: "hsl(0, 0%, 100%)"
  border: "hsl(20, 5%, 88%)"
  ring: "hsl(206, 100%, 41.6%)"
  ms-blue: "#0078D4"
  ms-blue-hover: "#106EBE"
  ms-blue-light: "#EFF6FC"
  ms-success: "#107C10"
  ms-warning: "#FFB900"
  ms-danger: "#D13438"
  nivel-basico: "#107C10"
  nivel-intermedio: "#0078D4"
  nivel-avanzado: "#f97316"
  nivel-arquitecto: "#D13438"
  nivel-ia: "#9333ea"
  nivel-d365: "#0d9488"
typography:
  display:
    fontFamily: "Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 750
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
  title:
    fontFamily: "Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 650
  body:
    fontFamily: "Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    letterSpacing: "0.1em"
  mono:
    fontFamily: "Cascadia Code, Cascadia Mono, SF Mono, Fira Code, Fira Mono, Consolas, Liberation Mono, monospace"
rounded:
  sm: "calc(0.5rem - 4px)"
  md: "calc(0.5rem - 2px)"
  lg: "0.5rem"
  xl: "0.75rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
  badge-nivel-basico:
    backgroundColor: "{colors.nivel-basico}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "2px 10px"
  badge-nivel-intermedio:
    backgroundColor: "{colors.nivel-intermedio}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "2px 10px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "4px 12px"
---

# Design System: PlanEstudio

## Overview

**Creative North Star: "The Fluent Learning Console"**

PlanEstudio deliberadamente clona el lenguaje visual de Microsoft Learn / Fluent UI / Azure Portal, no lo reinterpreta. La fuente es Segoe UI del sistema (sin descargas remotas), el acento primario es el MS Blue exacto (`#0078D4`), y los cuatro colores semánticos de Fluent (success `#107C10`, warning `#FFB900`, danger `#D13438`, más el propio blue) se propagan sin cambios a badges de nivel, callouts y estados de quiz. Esto no es un accidente de shadcn/ui por defecto: el código nombra explícitamente un namespace `ms-*` y comentarios que dicen "matches Fluent UI / MS Learn" — la fidelidad es la decisión de diseño.

El sistema es denso en información y funciona como un panel de progreso/examen serio (checklist, quiz cronometrado, breakdown de errores), no como una landing de marketing. La superficie es casi plana: bordes finos (`#E1DFDD` en claro) hacen el trabajo de separación que en otros sistemas harían las sombras. La escala `shadow-fluent-1..8` existe como techo Fluent-consistente para elevación futura (sticky headers, overlays, modales), pero en el estado actual solo `fluent-1` está en uso, en el topbar sticky.

**Key Characteristics:**
- Fidelidad exacta a hex de Microsoft (`#0078D4`, `#107C10`, `#FFB900`, `#D13438`), nunca aproximaciones Tailwind genéricas.
- Superficie plana con bordes, no sombras, como separador primario.
- Un dot + badge de dos letras identifica cada nivel de certificación en toda la navegación.
- Todo el color de estado (correcto/incorrecto, aprobado/reprobado) reutiliza los mismos cuatro semánticos Fluent — nunca colores ad hoc.

## Colors

Paleta de producto Microsoft aplicada literalmente, más una capa semántica shadcn/ui (HSL) que la referencia por debajo.

### Primary
- **MS Blue** (`#0078D4` / `hsl(206, 100%, 41.6%)`): acento único del sistema — CTAs primarios, links activos, indicador de item activo en sidebar (barra de 2px + fondo `#EFF6FC`), foco/ring, barra de progreso de lectura, borde de blockquote.

### Neutral
- **Ink** (`#1F2328` / `hsl(220, 14%, 14%)`): texto principal claro, cercano a `#242424` de Fluent.
- **Slate Secondary** (`#616161` / `hsl(220, 9%, 38%)`): texto secundario/muted.
- **Cool Paper** (`hsl(210, 20%, 96%)` / `#F3F5F7`): fondos secundarios y muted.
- **Border Subtle** (`#E1DFDD` / `hsl(20, 5%, 88%)`): todo borde de card, tabla, separador — el separador primario del sistema.
- **Rich Navy** (`#0B1020`): fondo modo oscuro; no es negro puro, es azul-carbón Fluent-dark.

### Named Rules (optional, powerful)
**The Exact-Hex Rule.** Los colores de marca Microsoft (`#0078D4`, `#107C10`, `#FFB900`, `#D13438`) se escriben como hex literal en el código (namespace `ms-*` y `nivel-*`), nunca se aproximan a la paleta por defecto de Tailwind (`blue-600`, `green-500`). Nueva UI que necesite estos roles reutiliza el hex exacto o el token `ms-*`/`nivel-*` existente, no inventa un tono cercano.

## Typography

**Display / Body Font:** Segoe UI (con system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial como fallback) — pila 100% de sistema, sin fuentes remotas.
**Mono Font:** Cascadia Code (con Cascadia Mono, SF Mono, Fira Code, Consolas como fallback) — usado en código y en el prefijo `A.`/`B.`/`C.`/`D.` de opciones de quiz.

**Character:** Una sola familia sans-serif de sistema para todo el texto de UI y contenido — sin par display/body distinto, la jerarquía viene de peso y tamaño, no de cambio de tipografía. Esto refuerza la lectura como "herramienta de producto Microsoft", no "sitio editorial".

### Hierarchy
- **Display** (750, `clamp(1.75rem, 4vw, 2.5rem)`, tracking `-0.03em`): H1 de contenido de módulo (`.learning-content h1`).
- **Headline** (700, `1.4rem`): H2 de contenido, con borde inferior de 1px como separador de sección.
- **Title** (650, `1.15rem`): H3 de contenido, títulos de card.
- **Body** (400, `1rem`, line-height `1.8`): párrafos de contenido de módulo, ancho máximo 980px.
- **Label** (600, `0.625rem`–`0.6875rem`, tracking `0.1em`–`0.15em`, uppercase): encabezados de grupo de sidebar ("NIVELES", "RECURSOS"), etiquetas de badge.

## Layout

Shell de app fijo: sidebar de 288px (`w-72`) a la izquierda, colapsable a overlay bajo `lg`, y topbar sticky de 56px (`h-14`) con blur de fondo. El contenido de módulo se limita a 980px de ancho máximo y se centra — una columna de lectura, no un grid multi-columna. El sidebar agrupa navegación en secciones etiquetadas (Dominios, Niveles → Certificación / Transversal en caja con borde suave, Empleabilidad, Recursos) separadas por `<Separator>`. Los niveles transversales (IA, D365) viven visualmente agrupados en una caja `border border-border/70 bg-muted/25` para señalar que no son parte de la cadena de prerequisitos de los 4 niveles de certificación.

## Elevation & Depth

Casi plano en reposo: la separación de superficies la hace el borde de 1px (`--border`), no la sombra. La escala `shadow-fluent-1` a `shadow-fluent-4`/`shadow-fluent-8` está definida en `tailwind.config.ts` como techo Fluent-consistente para elevación futura, pero en el código actual solo `fluent-1` está en uso — en el topbar sticky, para separarlo del contenido que se desplaza debajo. Nuevas superficies flotantes (dropdowns, modales, toasts) deben escalar dentro de esta rampa existente (`fluent-1` → `fluent-8` según cuán "encima" estén), no introducir un valor de sombra nuevo.

### Shadow Vocabulary (if applicable)
- **fluent-1** (`0 1px 2px rgba(0,0,0,.08), 0 0 1px rgba(0,0,0,.06)`): topbar sticky sobre contenido con scroll — el único nivel actualmente en uso.
- **fluent-2** (`0 2px 4px rgba(0,0,0,.1), 0 0 2px rgba(0,0,0,.06)`): reservado — popovers/dropdowns de bajo nivel.
- **fluent-4** (`0 4px 8px rgba(0,0,0,.12), 0 0 2px rgba(0,0,0,.06)`): reservado — cards flotantes, menús.
- **fluent-8** (`0 8px 16px rgba(0,0,0,.14), 0 0 2px rgba(0,0,0,.06)`): reservado — modales, diálogos.

### Named Rules (optional)
**The Border-First Rule.** En reposo, toda superficie se separa con `border` de 1px, nunca con sombra. La sombra solo aparece cuando una superficie se sobrepone activamente a otra (sticky, overlay, modal) y debe tomarse de la escala `fluent-*` existente.

## Shapes

Radios moderados y consistentes vía la variable `--radius: 0.5rem`, derivados a `lg` (8px, radio completo), `md` (6px, `calc(radius - 2px)`) y `sm` (4px, `calc(radius - 4px)`). Botones e inputs usan `md`; cards y callouts usan `lg`/`xl` (12px); badges y dots de nivel usan `md` o `full` (círculo). Sin bordes gruesos ni esquinas afiladas en ningún componente interactivo — el único borde grueso intencional es el `border-l-4` de los callouts, que funciona como acento de color, no como marco.

## Components

Botones, cards e inputs comparten un carácter **utilitario y confiable**: bordes finos, radios moderados, sin decoración — prioriza claridad y velocidad de escaneo sobre expresión, coherente con un panel de progreso/examen serio.

### Buttons
- **Shape:** `rounded-md` (6px), altura `h-9` (36px) por defecto, `h-8`/`h-10` en `sm`/`lg`.
- **Primary:** fondo `bg-primary` (MS Blue) sobre texto blanco, padding `px-4 py-2`.
- **Hover / Focus:** `hover:bg-primary/90` (opacidad, no nuevo tono); foco con `ring-2 ring-ring ring-offset-2` en MS Blue.
- **Secondary / Outline / Ghost:** `secondary` usa fondo gris claro; `outline` usa borde + fondo transparente que se llena con `accent` (azul MS muy claro) en hover; `ghost` solo activa `accent` en hover, sin fondo en reposo.

### Chips (if used)
- **Style (Badge):** `rounded-md`, `px-2.5 py-0.5`, texto `text-xs font-semibold`. Variantes semánticas por nivel (`basico`/`intermedio`/`avanzado`/`arquitecto`/`ia`/`d365`) fijan el hex de marca exacto como fondo con texto blanco — no se derivan del token `primary`.
- **State:** sin variante seleccionada/no-seleccionada — los badges de nivel son siempre de solo lectura (indicador), no filtros interactivos.

### Cards / Containers
- **Corner Style:** `rounded-xl` (12px).
- **Background:** `bg-card` (blanco en claro, `#0F1628` en oscuro).
- **Shadow Strategy:** `shadow` base sutil de Tailwind — la única excepción documentada a la regla border-first, heredada de shadcn/ui por defecto; no añadir sombra adicional sobre cards.
- **Border:** `border` de 1px, `--border-subtle` (`#E1DFDD`).
- **Internal Padding:** `p-6` (24px) en header/content, `pt-0` para cerrar el gap entre header y content.

### Inputs / Fields
- **Style:** borde `border-input`, fondo `bg-background`, `rounded-md`, altura `h-9`, `shadow-sm` leve.
- **Focus:** `ring-2 ring-ring ring-offset-2` (MS Blue), sin cambio de borde.
- **Error / Disabled:** disabled baja opacidad a 50% y bloquea cursor; no hay estado de error de input dedicado — los errores de quiz usan el patrón Callout/feedback en su lugar, no bordes rojos de input.

### Navigation
- Item de sidebar: `rounded-md`, `px-3 py-2`, texto `text-sm`. Activo = fondo `#EFF6FC` (claro) / `rgba(33,150,243,0.12)` (oscuro) + texto MS Blue + barra izquierda de 2px (`w-0.5 h-[60%]`) en MS Blue, position absolute centrada verticalmente. Inactivo = `text-foreground/80`, hover activa `accent`. Mobile: sidebar se convierte en overlay fijo con backdrop `bg-black/40 backdrop-blur-sm`, trigger de menú en el topbar.

### Quiz Option Button (signature component)
Botón de opción de respuesta (A/B/C/D) con tres estados mutuamente excluyentes: reposo (`border-border`, hover activa `accent` + borde `primary/40`), seleccionado-sin-responder (`border-primary bg-primary/10`), y post-respuesta (`border-green-500 bg-green-50` si es correcta, `border-red-500 bg-red-50` si fue la selección incorrecta, `opacity-60` para el resto). El prefijo de letra (`A.`) siempre en `font-mono font-bold text-xs`. Este patrón de tres estados se reutiliza en el desglose de errores del resultado del quiz.

## Do's and Don'ts

### Do:
- **Do** usar el hex exacto de Microsoft (`#0078D4`, `#107C10`, `#FFB900`, `#D13438`) para cualquier nuevo elemento de marca o estado semántico — nunca el azul/verde/rojo por defecto de Tailwind.
- **Do** separar superficies con `border` de 1px en `--border-subtle` como primer recurso; reservar sombra para overlays reales (sticky, dropdown, modal), tomada de la escala `fluent-1..8` existente.
- **Do** mantener Segoe UI (pila de sistema) como única familia tipográfica; la jerarquía se construye con peso y tamaño, no con una segunda fuente.
- **Do** usar el patrón de barra izquierda de 2px + fondo `accent` para cualquier nuevo estado "activo" de navegación, replicando el de sidebar/tabs existente.

### Don't:
- **Don't** introducir una paleta de acento nueva o un segundo azul "de marca" — el sistema tiene un único primario (MS Blue) y la regla es que se usa con moderación como acento, no como color de fondo masivo.
- **Don't** añadir sombras decorativas a cards, badges o botones en reposo — el sistema es border-first; una sombra nueva fuera de la escala `fluent-*` rompe la consistencia con Fluent UI.
- **Don't** usar radios grandes tipo pill (`rounded-full`) fuera de badges/dots/avatares — el lenguaje de forma del sistema es `md`/`lg` moderado, no redondeo agresivo.
- **Don't** descargar fuentes web para contenido de UI o de módulo — la pila es 100% fuentes de sistema por diseño (sin dependencia de red, coincide con Fluent UI / MS Learn nativo).

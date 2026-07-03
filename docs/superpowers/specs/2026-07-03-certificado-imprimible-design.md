# Diseño: Certificado imprimible por nivel

**Fecha:** 2026-07-03
**Estado:** Aprobado

## Objetivo

Al completar el 100% de un nivel, el usuario puede generar un certificado tipo diploma, personalizado con su nombre, que puede imprimir o guardar como PDF (Ctrl+P). No hay backend ni autenticación — todo vive en el store de progreso ya existente (`localStorage` vía Zustand).

## Alcance

- Certificado por nivel (`basico`, `intermedio`, `avanzado`, `arquitecto`), no por módulo ni certificado global.
- Contenido: nombre del usuario, nivel (`UI.levels.badge[levelId]`), certificación objetivo (`UI.levels.cert[levelId]`), fecha de generación.
- Fuera de alcance (descartado explícitamente): promedio de quiz del nivel, conteo de módulos completados, página de "ajustes" dedicada.

## 1. Modelo de datos — `src/lib/progress.ts`

Agregar al store persistido:

```ts
export interface ProgressState {
  // ...existente
  userName: string | null;
}

export interface ProgressActions {
  // ...existente
  setUserName: (name: string) => void;
}
```

- `userName` inicia en `null` en `INITIAL_STATE`.
- `setUserName` hace `set({ userName: name })` sin validación adicional (el usuario es dueño de su propio dato local).
- Se persiste automáticamente junto al resto del estado (mismo `persist` middleware, misma key `plan-estudio-progress`).

## 2. Disparo — `LevelCompleteBanner` (`level-progress-banner.tsx`)

Se agrega un botón "Generar certificado" junto al botón existente de "Comenzar siguiente nivel":

- Si `userName` es `null`: abre un `Dialog` (shadcn/ui) con un input de texto y botón "Confirmar". Al confirmar: `setUserName(valor)` y `router.push(`/certificado/${levelId}`)`.
- Si `userName` ya tiene valor: navega directo a `/certificado/${levelId}` sin diálogo.
- El diálogo permite editar el nombre en cualquier generación futura (no se vuelve a preguntar automáticamente, pero se puede reabrir el mismo diálogo con un enlace pequeño "cambiar nombre" en la página del certificado).

## 3. Página del certificado — `app/certificado/[nivel]/page.tsx`

Client component (usa el store de Zustand, que es client-only):

- Valida que `nivel` (param de ruta) sea un `LevelId` válido; si no, `notFound()`.
- Lee `userName` y `getLevelProgress(levelId).percentage` del store.
  - Si `percentage < 100` o `userName` es `null`: redirige a `/nivel/[nivel]` (el certificado no debe ser accesible sin haber completado el nivel ni sin nombre configurado).
- Renderiza el componente `CertificateDiploma` (nuevo, en `src/components/modules/certificate-diploma.tsx`) con props: `levelId`, `userName`, `date` (calculada con `new Date()` en el momento del render, formateada en español).
- Incluye un botón "Imprimir" (`window.print()`) y un enlace "← Volver al nivel".
- Incluye un enlace pequeño "Cambiar nombre" que reabre el mismo `Dialog` de captura de nombre usado en el banner (componente compartido, ver sección 5).

## 4. Componente visual — `CertificateDiploma`

Estilo diploma elaborado:

- Orientación horizontal, tipografía serif para el título (ej. `font-serif`), orla decorativa mediante borde doble + esquinas ornamentales (pseudo-elementos CSS o un SVG inline simple — sin dependencias nuevas).
- Reutiliza los colores por nivel ya definidos en `LEVEL_COLORS` / `TROPHY_COLORS` de `level-progress-banner.tsx` (se extraen a un módulo compartido `src/lib/level-theme.ts` si conviene, o se duplican las 4 entradas — decisión de implementación).
- Contenido centrado: "Certificado de Finalización", nombre del usuario en tipografía grande, texto "{UI.levels.badge[levelId]}" y "Preparado para la certificación {UI.levels.cert[levelId]}", fecha, y el logo/nombre del plan de estudio ("Plan de Estudio Power Platform & D365").

## 5. Diálogo de captura de nombre — componente compartido

`src/components/modules/certificate-name-dialog.tsx`: `Dialog` con un `Input` controlado y botón "Confirmar". Se usa tanto desde `LevelCompleteBanner` (primera vez) como desde `CertificateDiploma` (para cambiar el nombre). Recibe `onConfirm(name: string)` como prop para desacoplar la navegación de la captura del dato.

## 6. Impresión limpia — CSS global

En `globals.css`, sin tocar la arquitectura de layouts (Next.js App Router no permite "desenvolver" el layout raíz):

```css
@media print {
  body * { visibility: hidden; }
  .certificate-print-area, .certificate-print-area * { visibility: visible; }
  .certificate-print-area { position: absolute; inset: 0; }
}
```

`CertificateDiploma` envuelve su contenido imprimible en un contenedor con clase `certificate-print-area`. Esto oculta sidebar/topbar/botones de navegación al imprimir, sin necesidad de una ruta con layout distinto.

## Testing

- Unit test para `setUserName` / `userName` en `progress.test.ts` (siguiendo el patrón existente de los otros setters).
- Unit test de que `/certificado/[nivel]` redirige cuando `percentage < 100` o `userName` es `null` (mock del store).
- No se agregan tests de snapshot visual del diploma (fuera de alcance del proyecto — no hay tests de este tipo en el resto de la app).

## Riesgos / notas

- `new Date()` en el render del cliente significa que la fecha mostrada es "hoy", no la fecha real de finalización del nivel (no se persiste fecha de completitud en el store actual). Aceptado como limitación conocida — no se pidió agregar `completionDate` al store.
- `src/components/ui/dialog.tsx` ya existe. `src/components/ui/input.tsx` **no existe todavía** — hay que agregarlo (componente shadcn/ui estándar, se puede copiar del patrón de los demás componentes en `src/components/ui/`).

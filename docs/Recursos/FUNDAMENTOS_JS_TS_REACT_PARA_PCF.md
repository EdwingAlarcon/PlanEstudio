# Fundamentos de JavaScript, TypeScript y React para PCF — antes del Módulo 13

El Módulo 13 (JavaScript y PCF Básico) necesita JavaScript puro para los Web Resources de
formulario, y un subconjunto pequeño de TypeScript + React para su primer control PCF. Hasta ahora
resolvía esto enlazando directamente al Módulo 56 (Fundamentos de JavaScript para Power Platform),
que vive en Nivel IA — un nivel transversal que no se toca en la ruta de certificación pura
(Básico→Intermedio→Avanzado→Arquitecto). Un alumno que sigue esa ruta puede llegar al Módulo 13
sin haber tocado Nivel IA, así que ese enlace era una promesa de contenido en otra rama del árbol,
no un prerrequisito realmente alcanzable en el camino más común. Este recurso resuelve eso: vive en
`/recursos/`, no ocupa un rango de nivel, y por lo tanto no hereda ese problema — el mismo patrón ya
usan los puentes de C#/.NET (Módulo 23) y TypeScript/React para PCF Avanzado (Módulos 27/28).

**Tipo de práctica de este recurso: conceptual, con la opción de profundizar en el Módulo 56 si
nunca programaste.** No repite contenido — remite a él para la parte de JavaScript puro y cubre
aquí solo el subconjunto de TypeScript/React que el Módulo 13 usa.

## Si nunca escribiste código

Completa primero el Módulo 56 — [Fundamentos de JavaScript para Power Platform](/nivel/ia/modulo/fundamentos-javascript-para-power-platform).
Enseña desde cero variables, funciones, objetos, arrays, callbacks y promesas, con la misma forma
que verás en el Módulo 13. Si ya programas en cualquier lenguaje, puedes saltar directo a la
sección siguiente.

## Lo que el Módulo 13 usa de JavaScript (recap, no repetición)

El Módulo 13 usa exactamente esto, ya cubierto en el Módulo 56: variables, funciones nombradas y
anónimas, objetos y acceso a propiedades, arrays y `.forEach()`, concatenación de strings,
callbacks, y promesas (`.then()/.catch()`, como en `Xrm.WebApi.retrieveMultipleRecords`). Si ya
reconoces estos seis conceptos, estás listo para el Módulo 13 en la parte de JavaScript.

## Lo que el Módulo 13 usa de TypeScript (nuevo en este recurso)

### Tipos primitivos en firmas de función

```typescript
// JavaScript — sin tipos
function getColor(value) {
  return value === 1 ? "#107C10" : "#605E5C";
}

// TypeScript — mismo código, con tipos declarados
function getColor(value: number): string {
  return value === 1 ? "#107C10" : "#605E5C";
}
```

El compilador avisa si llamás `getColor("1")` (un string donde esperaba un número) **antes** de
ejecutar el código.

### Interfaces — la forma de un objeto

```typescript
interface StatusBadgeProps {
  statusValue: number;
  statusLabel: string;
}
```

Una `interface` describe qué propiedades debe tener un objeto — exactamente lo que vas a usar para
describir las props de un componente de React en el Módulo 13.

### Optional chaining y nullish coalescing

```typescript
const statusValue = context.parameters.statusValue.raw ?? 0;
const statusLabel = context.parameters.statusValue.formatted ?? "";
```

`??` devuelve el valor de la izquierda si no es `null`/`undefined`, o el de la derecha si lo es —
se usa constantemente al leer valores de `IInputs` en PCF, que pueden venir vacíos.

### Un tipo genérico ya resuelto (no necesitas escribir uno)

```typescript
export class StatusBadge implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  // ...
}
```

`ComponentFramework.ReactControl<IInputs, IOutputs>` es un genérico — pero el toolchain de PCF ya
te entrega `IInputs`/`IOutputs` generados a partir del manifest. Para el Módulo 13 **no necesitas
escribir tus propios genéricos** (`function primero<T>(...)`), solo reconocer que estás usando uno
ya resuelto.

## Lo que el Módulo 13 usa de React (nuevo en este recurso)

### Componente funcional tipado + JSX

```tsx
import * as React from "react";

interface StatusBadgeProps {
  statusValue: number;
  statusLabel: string;
}

const StatusBadgeComponent: React.FC<StatusBadgeProps> = ({ statusValue, statusLabel }) => {
  return <span>{statusLabel || "Sin estado"}</span>;
};
```

- `React.FC<Props>` es un componente funcional que declara explícitamente qué tipo de props recibe.
- El cuerpo retorna JSX (HTML mezclado con TypeScript entre `{ }`), igual que en cualquier
  componente de React.

### `React.CSSProperties` — un tipo utilitario, no un hook

```tsx
const styles: React.CSSProperties = {
  backgroundColor: "#107C10",
  color: "white",
  padding: "4px 12px",
};
```

Es un tipo que describe un objeto de estilos válido para la propiedad `style` de un elemento — lo
usarás para pintar el badge de colores según el estado.

## Lo que el Módulo 13 NO usa de React (y por qué no te bloquea)

El Módulo 13 **no usa hooks** (`useState`, `useEffect`). Su control PCF es puramente
presentacional: el estado del control lo maneja la clase `ComponentFramework` (`init`,
`updateView`, `getOutputs`, `destroy`), no React. Si más adelante llegas al Módulo 27 (PCF
Avanzado) o al Módulo 28 (Code Apps), ahí sí vas a necesitar `useState` — ese contenido ya existe
en [Fundamentos de TypeScript y React para PCF](/recursos/fundamentos-typescript-react), el puente
que ya usan esos dos módulos. Este recurso es deliberadamente más chico: cubre solo lo que el
Módulo 13 exige.

## Práctica — proyecto Vite local (sin Dataverse)

1. Instala [Node.js](https://nodejs.org) si no lo tienes (`node --version` para verificar).
2. Crea un proyecto: `npm create vite@latest mi-primer-badge -- --template react-ts`, entra a la
   carpeta y corre `npm install`.
3. En `src/App.tsx`, crea una interfaz `BadgeProps { statusValue: number; statusLabel: string }` y
   un componente `StatusBadge` tipado con `React.FC<BadgeProps>` que devuelva un `<span>` con el
   color según `statusValue` (1 = verde, 2 = rojo, cualquier otro = gris) usando
   `React.CSSProperties`.
4. Renderízalo tres veces en `App` con distintos `statusValue` (1, 2, 3) para confirmar que cambia
   de color.
5. Corre `npm run dev` y confirma los tres colores en el navegador.

**Evidencia esperada:** captura de los tres badges con sus colores distintos, guardada en tu
bitácora.

## Errores comunes

- **Error:** olvidar tipar las props y dejar que TypeScript infiera `any`. **Por qué pasa:** compila
  igual, así que parece "estar bien". **Cómo evitarlo:** declara siempre una `interface` para las
  props — es la mitad del valor de usar TypeScript en vez de JavaScript.
- **Error:** confundir `.ts` con `.tsx`. **Cómo evitarlo:** cualquier archivo que devuelva JSX (HTML
  dentro del código) necesita extensión `.tsx`, no `.ts`.
- **Error:** usar `||` en vez de `??` para un valor que puede ser legítimamente `0`. **Por qué
  pasa:** `0 || "valor por defecto"` siempre devuelve `"valor por defecto"` porque `0` es falsy en
  JavaScript. **Cómo evitarlo:** usa `??`, que solo reemplaza `null`/`undefined`, no `0` ni `""`.

## Criterio de aprobación

Puedes seguir al Módulo 13 cuando puedas, sin mirar este documento:

- [ ] Escribir una `interface` simple para props de un componente.
- [ ] Escribir un componente funcional de React tipado con `React.FC<Props>` que devuelva JSX.
- [ ] Usar `React.CSSProperties` para un objeto de estilos.
- [ ] Explicar la diferencia entre `??` y `||` cuando el valor puede ser `0`.

## Siguiente paso

→ [Módulo 13 — JavaScript y PCF Básico](/nivel/intermedio/modulo/javascript-y-pcf-basico)

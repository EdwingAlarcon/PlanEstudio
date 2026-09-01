# Fundamentos de TypeScript y React para PCF — antes del Módulo 27

El Módulo 27 (PCF Avanzado con TypeScript y React) se declara a sí mismo exigente en TypeScript sólido
y JSX/TSX; el Módulo 28 (Code Apps con React y TypeScript) exige el mismo stack sin ni siquiera
advertirlo. El Módulo 56 (Fundamentos de JavaScript) cierra la brecha de JS vainilla para el Módulo 13,
pero **no cubre TypeScript ni React** — esta es la brecha que faltaba.

**Tipo de práctica de este recurso: conceptual + ejecutable en tu máquina (sin Dataverse todavía).**
Corre en un proyecto Vite local — no necesitás ambiente Developer ni tenant para esta parte.

## Objetivo

Poder leer y escribir el TypeScript y JSX mínimos que un componente PCF o una Code App exigen: tipos,
interfaces, componentes funcionales de React, props y el ciclo básico de estado (`useState`).

## Prerrequisito

Este recurso asume que ya completaste [Fundamentos de JavaScript para Power Platform](/nivel/ia/modulo/fundamentos-javascript-para-power-platform)
(Módulo 56) — variables, funciones, objetos, arrays, callbacks y promesas. TypeScript es JavaScript
con tipos agregados; si esas bases todavía no son sólidas, andá primero ahí.

## 1. TypeScript = JavaScript + tipos

```typescript
// JavaScript (Módulo 56)
function calcularTotal(precio, cantidad) {
  return precio * cantidad;
}

// TypeScript — mismo código, con tipos declarados
function calcularTotal(precio: number, cantidad: number): number {
  return precio * cantidad;
}
```

El compilador de TypeScript te avisa si llamás `calcularTotal("10", 5)` (un string donde esperaba un
número) **antes** de ejecutar el código — el mismo tipo de error que en C# (ver el puente de C#/.NET
si también vas a la ruta Developer completa), pero en el mundo JavaScript.

### Interfaces — la forma de un objeto

```typescript
interface Solicitud {
  titulo: string;
  prioridad: number;
  resuelta: boolean;
}

function mostrarResumen(s: Solicitud): string {
  return `${s.titulo} (prioridad ${s.prioridad})`;
}
```

Una `interface` describe qué propiedades debe tener un objeto — si le pasás uno al que le falta
`prioridad`, TypeScript te avisa antes de ejecutar.

### Genéricos (lo mínimo para reconocerlos)

```typescript
function primero<T>(lista: T[]): T {
  return lista[0];
}
```

`<T>` es un "tipo variable" — la función funciona con cualquier tipo de lista, y TypeScript sabe que el
resultado es del mismo tipo que los elementos. No necesitás escribir genéricos complejos para PCF
básico, pero vas a *verlos* en las interfaces `IInputs`/`IOutputs` que el manifest de PCF genera.

## 2. React — lo mínimo para un componente PCF/Code App

### Componente funcional + JSX/TSX

```tsx
import React from "react";

interface SaludoProps {
  nombre: string;
}

function Saludo({ nombre }: SaludoProps) {
  return <div>Hola, {nombre}</div>;
}
```

- Un componente de React es una **función que devuelve JSX** (HTML mezclado con JavaScript/TypeScript
  entre `{ }`).
- `SaludoProps` es la interfaz que describe qué recibe el componente desde afuera (sus "props" —
  parámetros, en el vocabulario de React).
- `.tsx` es la extensión de archivo para TypeScript + JSX (`.ts` es TypeScript sin JSX).

### Estado con `useState`

```tsx
import { useState } from "react";

function Contador() {
  const [valor, setValor] = useState(0);

  return (
    <div>
      <p>Valor: {valor}</p>
      <button onClick={() => setValor(valor + 1)}>Sumar</button>
    </div>
  );
}
```

- `useState(0)` crea una variable de estado (`valor`) que empieza en `0`, y una función para
  actualizarla (`setValor`).
- Cuando llamás `setValor(...)`, React vuelve a renderizar el componente con el nuevo valor — esto es
  la base de cómo un control PCF reacciona a cambios de datos.

## 3. Práctica — proyecto Vite local (sin Dataverse)

1. Instalá [Node.js](https://nodejs.org) si no lo tenés (`node --version` para verificar).
2. Creá un proyecto: `npm create vite@latest mi-primer-componente -- --template react-ts`, entrá a la
   carpeta y corré `npm install`.
3. En `src/App.tsx`, creá una interfaz `Tarea { titulo: string; completada: boolean }`, un estado
   `tareas` (array de `Tarea`) inicializado con 3 elementos, y un componente que las liste con un
   `.map()`, mostrando ✅ o ⬜ según `completada`.
4. Agregá un botón que agregue una tarea nueva al hacer clic (usando `setTareas`).
5. Corré `npm run dev` y confirmá que la lista se actualiza al hacer clic.

**Evidencia esperada:** captura de la app corriendo en el navegador con al menos una tarea agregada
por vos (no solo las 3 iniciales), guardada en tu bitácora.

## Errores comunes

- **Error:** mutar el array de estado directamente (`tareas.push(nueva)`) en vez de crear uno nuevo.
  **Por qué pasa:** en JavaScript plano `push` funciona y no rompe nada visible. **Cómo evitarlo:**
  React no detecta la mutación directa — usá `setTareas([...tareas, nueva])` para que sepa que debe
  volver a renderizar.
- **Error:** olvidar tipar las props y dejar que TypeScript infiera `any`. **Por qué pasa:** compila
  igual, así que parece "estar bien". **Cómo evitarlo:** declará siempre una `interface` para las
  props — es la mitad del valor de usar TypeScript en vez de JavaScript.
- **Error:** confundir `.ts` con `.tsx`. **Cómo evitarlo:** cualquier archivo que devuelva JSX (HTML
  dentro del código) necesita extensión `.tsx`, no `.ts`.

## Criterio de aprobación

Podés seguir al Módulo 27 o al Módulo 28 cuando puedas, sin mirar este documento:

- [ ] Escribir una `interface` simple y una función tipada que la use.
- [ ] Escribir un componente funcional de React con props tipadas.
- [ ] Usar `useState` para actualizar la UI al hacer clic en un botón.
- [ ] Explicar por qué mutar el estado directamente no actualiza la pantalla.

## Qué este puente NO cubre (y por qué no bloquea el Módulo 27/28)

Hooks avanzados (`useEffect`, `useMemo`, `useCallback`), manejo de formularios complejos, testing de
componentes React, y el SDK específico de PCF (`ComponentFramework.Context`, ciclo de vida
`init`/`updateView`/`getOutputs`/`destroy`) — esos se aprenden *en* el Módulo 27 con el andamiaje del
propio contenido. Este puente solo cierra la brecha de sintaxis básica de TypeScript/React.

## Siguiente paso

→ [Módulo 27 — PCF Avanzado con TypeScript y React](/nivel/avanzado/modulo/pcf-avanzado-con-typescript-y-react)
→ [Módulo 28 — Code Apps con React y TypeScript](/nivel/avanzado/modulo/code-apps-con-react-y-typescript)

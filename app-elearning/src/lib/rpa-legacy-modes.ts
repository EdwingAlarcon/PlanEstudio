/**
 * Modos del sandbox "SIT Registro Legacy" (selector **Modo**).
 *
 * El orden y las etiquetas son los que ve el alumno; los valores son los `value` de las opciones del `<select>` y los
 * labs y módulos los nombran por su etiqueta. No cambies los existentes: hay flujos de PAD construidos sobre ellos.
 */

export type LegacyMode =
  | "normal"
  | "duplicate"
  | "blocked"
  | "layout-shift"
  | "slow-confirmation"
  | "disabled-submit"
  | "unexpected-modal";

export const LEGACY_MODES: ReadonlyArray<{ value: LegacyMode; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "duplicate", label: "Duplicado" },
  { value: "blocked", label: "Bloqueo simulado" },
  { value: "layout-shift", label: "Layout cambiado" },
  { value: "slow-confirmation", label: "Confirmación lenta" },
  { value: "disabled-submit", label: "Botón deshabilitado" },
  { value: "unexpected-modal", label: "Modal inesperado" },
];

/**
 * Regla determinista del modo "Modal inesperado": el diálogo "Aviso de sesión" sale en el **primer Registrar** después
 * de elegir el modo, antes de procesar el registro. Una vez cerrado no vuelve a salir hasta que se elija el modo otra
 * vez (Reset devuelve el modo a Normal, así que tras Reset hay que volver a elegirlo).
 */
export function shouldInterruptRegister(mode: LegacyMode, alreadyShown: boolean): boolean {
  return mode === "unexpected-modal" && !alreadyShown;
}

import { describe, expect, it } from "vitest";
import { LEGACY_MODES, shouldInterruptRegister } from "../rpa-legacy-modes";

describe("modos del simulador legacy", () => {
  it("conserva el orden y las etiquetas de los modos existentes y añade Modal inesperado al final", () => {
    expect(LEGACY_MODES.map((mode) => mode.label)).toEqual([
      "Normal",
      "Duplicado",
      "Bloqueo simulado",
      "Layout cambiado",
      "Confirmación lenta",
      "Botón deshabilitado",
      "Modal inesperado",
    ]);
    expect(new Set(LEGACY_MODES.map((mode) => mode.value)).size).toBe(LEGACY_MODES.length);
  });

  it("el aviso solo interrumpe el primer Registrar del modo Modal inesperado", () => {
    expect(shouldInterruptRegister("unexpected-modal", false)).toBe(true);
    expect(shouldInterruptRegister("unexpected-modal", true)).toBe(false);
    for (const mode of LEGACY_MODES.filter((item) => item.value !== "unexpected-modal")) {
      expect(shouldInterruptRegister(mode.value, false)).toBe(false);
    }
  });
});

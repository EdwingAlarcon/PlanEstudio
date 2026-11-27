import { test, expect } from "@playwright/test";

// Ruta principal (2026-11-27): desarrollo y Dynamics 365 quedan opcionales y fuera del progreso.
test.describe("Ruta principal funcional", () => {
  test("el nivel separa los módulos opcionales y el módulo lo avisa", async ({ page }) => {
    await page.goto("/nivel/avanzado", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("5 módulos", { exact: true })).toBeVisible();
    const optional = page.getByTestId("optional-modules");
    await expect(optional.locator("summary")).toContainText("Opcional (desarrollo y Dynamics 365) · 8 módulos");

    await page.goto("/nivel/avanzado/modulo/c-plugins-para-dataverse", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("optional-module-note")).toBeVisible();
  });
});

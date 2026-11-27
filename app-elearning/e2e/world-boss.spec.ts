import { test, expect } from "@playwright/test";

// F5 de "El camino jugable" (2026-11-27): modo por pasos en todo el curso y "jefe" de cada mundo.
test.describe("Modo por pasos en todo el curso y jefe del mundo", () => {
  test("un módulo de otro nivel también tiene el modo por pasos", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform", { waitUntil: "domcontentloaded" });
    await page.getByTestId("module-step-mode-link").click();
    await expect(page).toHaveURL(/\/pasos/);
    await expect(page.getByTestId("lesson-step-title")).toHaveText("Antes de empezar");
  });

  test("el jefe del Mundo 1 abre el reto sin pasos y, al hacerlo, queda superado", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const boss = page.getByTestId("world-boss");
    await expect(boss).toContainText("Jefe del Mundo 1");
    await boss.getByRole("link").click();
    await expect(page).toHaveURL(/\/pasos#paso-\d+$/);
    await expect(page.getByTestId("lesson-step-title")).toHaveText("Reto de transferencia");

    await expect(async () => {
      await page.getByTestId("lesson-step-next").click();
      await expect(page.getByTestId("lesson-step-title")).toHaveText("Comprueba", { timeout: 1000 });
    }).toPass({ timeout: 15000 });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("world-boss")).toContainText("Jefe del Mundo 1 superado");
  });
});

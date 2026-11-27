import { test, expect } from "@playwright/test";

// F2 de "El camino jugable" (2026-11-27): lección por pasos, piloto en el Módulo 11.
const MODULE = "/nivel/intermedio/modulo/power-automate-avanzado";

test.describe("Lección por pasos (Módulo 11)", () => {
  test("el módulo enlaza al modo por pasos y el primer paso es Antes de empezar", async ({ page }) => {
    await page.goto(MODULE, { waitUntil: "domcontentloaded" });
    await page.getByTestId("module-step-mode-link").click();
    await expect(page).toHaveURL(new RegExp(`${MODULE}/pasos`));
    await expect(page.getByTestId("lesson-step-title")).toHaveText("Antes de empezar");
  });

  test("avanzar marca el paso, se guarda y la micropráctica va dentro del paso", async ({ page }) => {
    await page.goto(`${MODULE}/pasos`, { waitUntil: "domcontentloaded" });
    const steps = page.getByTestId("lesson-steps");
    await expect(page.getByTestId("lesson-step-title")).toHaveText("Antes de empezar");

    // Reintenta el clic hasta que React hidrate el botón.
    await expect(async () => {
      await page.getByTestId("lesson-step-next").click();
      await expect(page.getByTestId("lesson-step-title")).toContainText("Microlección 1", { timeout: 1000 });
    }).toPass({ timeout: 15000 });
    await expect(page).toHaveURL(/#paso-2$/);

    await page.getByTestId("lesson-step-next").click();
    await expect(page).toHaveURL(/#paso-3$/);
    // Paso de micropráctica: la práctica está incrustada y el botón principal espera a que se resuelva.
    await expect(steps.getByText("Micropráctica", { exact: true }).first()).toBeVisible();
    await expect(page.getByTestId("lesson-step-next")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Saltar por ahora" })).toBeVisible();

    const stored = await page.evaluate(() => JSON.parse(window.localStorage.getItem("plan-estudio-progress") ?? "{}"));
    expect(stored.state.completedSteps).toEqual(["intermedio-11#intro", "intermedio-11#m1-concepto"]);

    // Al volver, abre el primer paso sin hacer.
    await page.goto(`${MODULE}/pasos`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("lesson-step-title")).toContainText("Microlección 1");
    await expect(page.getByRole("button", { name: "Saltar por ahora" })).toBeVisible();
  });

  test("el último paso remite al quiz del módulo", async ({ page }) => {
    await page.goto(`${MODULE}/pasos`, { waitUntil: "domcontentloaded" });
    const last = page.locator('ol[aria-label^="Paso"] li').last().getByRole("button");
    await expect(async () => {
      await last.click();
      await expect(page.getByRole("link", { name: /Hacer el quiz/ })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });
    await expect(page.getByRole("link", { name: /Hacer el quiz/ })).toHaveAttribute("href", `${MODULE}#comprueba`);
  });
});

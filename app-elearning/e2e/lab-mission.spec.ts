import { test, expect } from "@playwright/test";

// F3 de "El camino jugable" (2026-11-27): el lab como misión. Con todas las comprobaciones marcadas y la evidencia
// anotada se entrega; el lab queda completado y vale 100 XP en lugar de 25.
test.describe("Lab como misión", () => {
  test("entregar la misión con evidencia completa el lab y da 100 XP", async ({ page }) => {
    await page.goto("/labs/lab-02-dataverse-modelo-datos", { waitUntil: "domcontentloaded" });
    const mission = page.getByTestId("lab-mission");
    await expect(mission).toBeVisible();
    await expect(page.getByTestId("lab-mission-reward")).toContainText("100 XP con evidencia");
    const submit = page.getByTestId("lab-mission-submit");
    await expect(submit).toBeDisabled();

    const checks = mission.locator('input[type="checkbox"]');
    const total = await checks.count();
    expect(total).toBeGreaterThan(0);
    await expect(async () => {
      await checks.first().check();
      await expect(checks.first()).toBeChecked({ timeout: 1000 });
    }).toPass({ timeout: 15000 });
    for (let i = 1; i < total; i++) await checks.nth(i).check();

    await expect(submit).toBeDisabled();
    await page.getByTestId("lab-mission-note").fill("Solución SIT_SolicitudesInternas, tablas sit_categoria y sit_solicitud.");
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByTestId("lab-mission-done")).toBeVisible();
    await expect(page.getByRole("button", { name: "Completado" })).toBeVisible();

    await page.goto("/progreso#xp", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("xp-total")).toHaveText("100 XP");
  });
});

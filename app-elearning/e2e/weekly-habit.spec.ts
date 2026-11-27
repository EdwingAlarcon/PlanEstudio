import { test, expect } from "@playwright/test";

// F4 de "El camino jugable" (2026-11-27): meta semanal y racha por semanas.
test.describe("Meta semanal", () => {
  test("el inicio muestra la meta de la semana; cambiar la meta se guarda en su propio store", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const goal = page.getByTestId("weekly-goal");
    await expect(goal).toBeVisible();
    await expect(page.getByTestId("weekly-goal-count")).toHaveText("0 / 3 días");
    await expect(page.getByTestId("weekly-streak")).toContainText("Racha: 0 semanas");

    await expect(async () => {
      await goal.locator("select").selectOption("2");
      await expect(page.getByTestId("weekly-goal-count")).toHaveText("0 / 2 días", { timeout: 1000 });
    }).toPass({ timeout: 15000 });
    const stored = await page.evaluate(() => JSON.parse(window.localStorage.getItem("planestudio.habit.v1") ?? "{}"));
    expect(stored.state.weeklyGoal).toBe(2);

    await goal.getByRole("button", { name: "Semana de descanso" }).click();
    await expect(page.getByTestId("weekly-goal-count")).toHaveText("Semana de descanso");
  });

  test("marcar un módulo cuenta hoy como día con actividad", async ({ page }) => {
    await page.goto("/progreso", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("activity-grid")).toContainText("0 días con actividad");
    await expect(page.getByTestId("trophy-shelf")).toContainText("Mundo 1");
    await expect(page.getByTestId("domain-mastery")).toContainText("Dataverse");

    // Marcar un módulo cambia el progreso académico; el ActivityTracker registra hoy.
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform", { waitUntil: "domcontentloaded" });
    const mark = page.getByRole("button", { name: /Marcar como completado/ }).first();
    await expect(async () => {
      await mark.click();
      await expect(page.getByRole("button", { name: /Marcar como incompleto/ }).first()).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("weekly-goal-count")).toHaveText("1 / 3 días");
  });
});

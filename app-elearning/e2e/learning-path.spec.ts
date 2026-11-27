import { test, expect } from "@playwright/test";

// F1 de "El camino jugable" (2026-11-27): camino por mundos en el inicio y XP/rango derivados.
test.describe("Camino del inicio y XP", () => {
  test("sin progreso: Mundo 1 abierto, primer módulo para empezar y rango Aprendiz I con 0 XP", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const path = page.getByTestId("learning-path");
    await expect(path.getByRole("tab", { name: /Mundo 1/ })).toHaveAttribute("aria-selected", "true");
    await expect(path.locator('[aria-current="step"]')).toContainText("Empezar");
    await expect(path.getByText(/Trofeo del Mundo 1/)).toBeVisible();

    const rank = page.getByTestId("sidebar-rank");
    await expect(rank).toContainText("Aprendiz I");
    await expect(rank).toContainText("0 XP");
  });

  test("con progreso: la XP sale del quiz aprobado y del lab, no de marcar el módulo", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "plan-estudio-progress",
        JSON.stringify({
          state: {
            completedModules: ["basico-1", "basico-2"],
            quizScores: { "1": 90, "2": 60 },
            completedLabs: ["lab-02-dataverse-modelo-datos"],
            checklistItems: {},
            lastVisited: null,
            userName: null,
            moduleNotes: {},
          },
          version: 1,
        }),
      );
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    // 50 (quiz del M1 ≥ 80 %) + 25 (un lab autodeclarado) = 75 → Aprendiz I. Marcar M1 y M2 no suma.
    const rank = page.getByTestId("sidebar-rank");
    await expect(rank).toContainText("75 XP");
    await expect(rank).toContainText("Aprendiz I");
    await expect(page.getByTestId("learning-path").locator('[aria-current="step"]')).toContainText("M3");

    // Cambiar de mundo con las pestañas.
    await page.getByRole("tab", { name: /Mundo 2/ }).click();
    await expect(page.getByRole("tab", { name: /Mundo 2/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText(/Trofeo del Mundo 2/)).toBeVisible();

    await page.goto("/progreso#xp", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("xp-total")).toHaveText("75 XP");
  });
});

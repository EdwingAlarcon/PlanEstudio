import { test, expect } from "@playwright/test";
import fs from "fs";

const PROGRESS_KEY = "plan-estudio-progress";
const MODULE_PATH = "/nivel/basico/modulo/introduccion-al-ecosistema-power-platform";

test.describe("Backup completo, notas y continuar", () => {
  test.setTimeout(90_000); // primer acceso al módulo compila la ruta en dev
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("las notas del módulo se guardan y el home ofrece continuar", async ({ page }) => {
    await page.goto(MODULE_PATH);
    await page.getByLabel("Notas personales del módulo").fill("recordar entornos");
    await expect
      .poll(() => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "{}").state?.moduleNotes?.["basico-1"], PROGRESS_KEY))
      .toBe("recordar entornos");

    await page.goto("/");
    await expect(page.getByText("Continuar donde lo dejaste")).toBeVisible();
    await page.reload();
    await page.goto(MODULE_PATH);
    await expect(page.getByLabel("Notas personales del módulo")).toHaveValue("recordar entornos");
  });

  test("exportar e importar un backup completo restaura el progreso", async ({ page }) => {
    await page.goto("/progreso");
    await page.evaluate(
      (k) => localStorage.setItem(k, JSON.stringify({ state: { completedModules: ["basico-1"], moduleNotes: { "basico-1": "hola" } }, version: 0 })),
      PROGRESS_KEY
    );
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Exportar backup completo" }).click(),
    ]);
    const file = test.info().outputPath("backup.json");
    fs.writeFileSync(file, fs.readFileSync((await download.path())!, "utf8"));
    await page.evaluate((k) => localStorage.removeItem(k), PROGRESS_KEY);

    page.on("dialog", (dialog) => void dialog.accept());
    const section = page.locator('section[aria-labelledby="full-backup-heading"]');
    await section.locator("input[type=file]").setInputFiles(file);
    await expect(section.getByText("Válido")).toBeVisible();
    await section.getByRole("button", { name: "Importar", exact: true }).click();

    await expect
      .poll(() => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "{}").state?.completedModules, PROGRESS_KEY))
      .toEqual(["basico-1"]);
  });

  test("un archivo ajeno se rechaza sin tocar el progreso", async ({ page }) => {
    await page.goto("/progreso");
    const section = page.locator('section[aria-labelledby="full-backup-heading"]');
    await section.locator("input[type=file]").setInputFiles({
      name: "otro.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ format: "otra-cosa" })),
    });
    await expect(section.getByText("Corrupto")).toBeVisible();
    await expect(section.getByRole("button", { name: "Importar", exact: true })).toBeDisabled();
  });
});

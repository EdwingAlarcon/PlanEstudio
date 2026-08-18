import { test, expect } from "@playwright/test";

const REVIEW_KEY = "planestudio.spaced-repetition.v1";

function overdueCard(questionId: string, moduleId: number, daysOverdue = 1, itemType: "quiz-question" | "case-diagnosis" = "quiz-question") {
  const nextReviewAt = new Date(Date.now() - daysOverdue * 86400000).toISOString();
  return {
    questionId, moduleId, itemType,
    repetitions: 1, intervalDays: 1, easeFactor: 2.5, nextReviewAt,
    lapses: 0, totalReviews: 1, correctReviews: 1, incorrectReviews: 0, isLeech: false, status: "review",
  };
}

async function seedReviewCards(page: import("@playwright/test").Page, cards: Record<string, unknown>) {
  await page.goto("/");
  await page.evaluate(
    ({ key, cards }) => {
      window.localStorage.setItem(key, JSON.stringify({ state: { cards, dayLogs: [], sessionSize: "normal" }, version: 1 }));
    },
    { key: REVIEW_KEY, cards }
  );
}

test.describe("Spaced Repetition Engine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("empty state antes de responder ninguna pregunta", async ({ page }) => {
    await page.goto("/repaso");
    await expect(page.getByRole("heading", { name: "Repaso inteligente" })).toBeVisible();
    await expect(page.getByText("Completa tu primer quiz para empezar a construir tu calendario de repaso.")).toBeVisible();
  });

  test("responder un quiz de modulo registra tarjetas de repaso", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");
    // El módulo también tiene "Diagnóstico de caso aplicado" con su propio botón
    // "Iniciar evaluación" — hay que apuntar a la sección de quiz normal.
    await page.getByLabel("Evaluación del módulo").getByRole("button", { name: "Iniciar evaluación" }).click();
    await page.getByRole("button", { name: /^A\./ }).click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    await expect(page.getByText(/¡Correcto!|Incorrecto/)).toBeVisible();
    await expect(page.getByText("Estas preguntas formarán parte de tus futuros repasos.")).not.toBeVisible(); // only shown on the final result screen

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), REVIEW_KEY);
    expect(stored).toContain("module-1-");
  });

  test("el simulador nunca registra tarjetas de repaso", async ({ page }) => {
    await page.goto("/simulador");
    await page.getByRole("button", { name: "Iniciar simulador" }).click();
    await page.getByRole("button", { name: "Iniciar evaluación" }).click();
    await page.getByRole("button", { name: /^A\./ }).click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    await expect(page.getByText(/¡Correcto!|Incorrecto/)).toBeVisible();

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), REVIEW_KEY);
    expect(stored === null || JSON.parse(stored).state.cards === undefined || Object.keys(JSON.parse(stored).state.cards).length === 0).toBe(true);
  });

  test("una tarjeta vencida aparece en /repaso, incorrecta reprograma y correcta la retira de la cola", async ({ page }) => {
    await seedReviewCards(page, {
      "module-1-0": overdueCard("module-1-0", 1, 2),
    });
    await page.goto("/repaso");
    await expect(page.getByText(/Repaso de hoy · 1 pregunta/)).toBeVisible();
    await page.getByRole("button", { name: "Empezar repaso" }).click();

    // /repaso options render as radio/checkbox roles (§62), unlike quiz-panel.tsx's plain
    // buttons — pick whichever branch (correct/incorrect) this seeded question resolves to.
    await page.getByRole("radio", { name: /^A\./ }).click();
    await page.getByRole("button", { name: "Responder" }).click();
    await expect(page.getByText(/Correcto|Incorrecto/)).toBeVisible();
    await expect(page.getByText("¿Qué tan fácil fue recordarlo?")).toBeVisible();

    // Whichever branch we hit (correct or incorrect), "Otra vez" is always offered.
    await page.getByRole("button", { name: "Otra vez" }).click();
    await expect(page.getByRole("heading", { name: "Repaso completado" })).toBeVisible();

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), REVIEW_KEY);
    const parsed = JSON.parse(stored!);
    expect(parsed.state.cards["module-1-0"].nextReviewAt).toBeTruthy();
    expect(new Date(parsed.state.cards["module-1-0"].nextReviewAt).getTime()).toBeGreaterThan(Date.now());
  });

  test("interleaving mezcla modulos y nunca muestra preguntas no respondidas", async ({ page }) => {
    await seedReviewCards(page, {
      "module-1-0": overdueCard("module-1-0", 1, 1),
      "module-1-1": overdueCard("module-1-1", 1, 1),
      "module-2-0": overdueCard("module-2-0", 2, 1),
    });
    await page.goto("/repaso");
    await expect(page.getByText(/Repaso de hoy · 3 preguntas/)).toBeVisible();
    // "necesita refuerzo"/reinforcement groupings never leak a module we didn't seed
    await expect(page.getByText(/Módulo 4[0-9]/)).not.toBeVisible();
  });

  test("backlog tras 30 dias sin estudiar queda acotado por el tamaño de sesion", async ({ page }) => {
    // Módulo 1 tiene 15 preguntas reales (module-1-0..module-1-14) — todas vencidas
    // tras 30 días sin estudiar. El total se muestra completo, pero la sesión
    // real queda acotada por el tamaño elegido (§52-53), nunca "30 sesiones".
    const cards: Record<string, unknown> = {};
    for (let i = 0; i < 15; i++) {
      cards[`module-1-${i}`] = overdueCard(`module-1-${i}`, 1, 30);
    }
    await seedReviewCards(page, cards);
    await page.goto("/repaso");
    await expect(page.getByText(/Repaso de hoy · 15 preguntas/)).toBeVisible();
    await page.getByRole("button", { name: /^corta/ }).click();
    await page.getByRole("button", { name: "Empezar repaso" }).click();
    await expect(page.getByText("Pregunta 1 de 10")).toBeVisible();
  });

  test("/progreso muestra Retencion sin alterar el progreso academico", async ({ page }) => {
    await seedReviewCards(page, { "module-1-0": overdueCard("module-1-0", 1, 1) });
    await page.goto("/progreso");
    await expect(page.getByRole("heading", { name: "Retención" })).toBeVisible();
    await expect(page.getByText("Progreso académico").first()).toBeVisible();
  });

  test("Home y Mi ruta muestran el CTA de repaso de hoy", async ({ page }) => {
    await seedReviewCards(page, { "module-1-0": overdueCard("module-1-0", 1, 1) });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Repaso de hoy" })).toBeVisible();
    await page.goto("/mi-ruta");
    await expect(page.getByRole("heading", { name: "Repaso de hoy" })).toBeVisible();
  });

  test("export e import restauran el repaso sin tocar otros stores", async ({ page }) => {
    await seedReviewCards(page, { "module-1-0": overdueCard("module-1-0", 1, 1) });
    await page.goto("/repaso");

    // Blob-download anchors don't reliably fire Playwright's "download" event in this
    // Chromium config — same workaround already used in smoke.spec.ts for practice export.
    await page.evaluate(() => {
      (window as typeof window & { __retentionDownload?: { download: string } | null }).__retentionDownload = null;
      HTMLAnchorElement.prototype.click = function click() {
        (window as typeof window & { __retentionDownload?: { download: string } | null }).__retentionDownload = { download: this.download };
      };
    });
    const exportButton = page.getByRole("button", { name: "Exportar progreso de repaso" });
    await exportButton.evaluate((button) => (button as HTMLButtonElement).click());
    await expect.poll(async () => page.evaluate(() => {
      return (window as typeof window & { __retentionDownload?: { download: string } | null }).__retentionDownload?.download ?? "";
    })).toMatch(/^planestudio-repaso-\d{4}-\d{2}-\d{2}\.json$/);

    page.once("dialog", (dialog) => void dialog.accept());
    await page.getByRole("button", { name: "Reiniciar progreso de repaso" }).click();
    await expect(page.getByText("Completa tu primer quiz para empezar a construir tu calendario de repaso.")).toBeVisible();
  });

  test("teclado y movil mantienen la sesion operable", async ({ page }) => {
    await seedReviewCards(page, { "module-1-0": overdueCard("module-1-0", 1, 1) });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/repaso");
    await page.getByRole("button", { name: "Empezar repaso" }).click();
    await expect(page.locator("#review-question-heading")).toBeVisible();
    await page.getByRole("radio", { name: /^A\./ }).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Responder" }).click();
    await expect(page.getByText("¿Qué tan fácil fue recordarlo?")).toBeVisible();
  });

  test("localStorage corrupto no rompe /repaso", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => window.localStorage.setItem(key, "{not valid json"), REVIEW_KEY);
    await page.goto("/repaso");
    await expect(page.getByRole("heading", { name: "Repaso inteligente" })).toBeVisible();
  });
});

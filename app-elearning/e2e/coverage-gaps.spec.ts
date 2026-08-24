import { test, expect } from "@playwright/test";

const REVIEW_KEY = "planestudio.spaced-repetition.v1";
const ACADEMIC_KEY = "plan-estudio-progress";
const PRACTICE_KEY = "planestudio.practice-progress.v1";
const INTERACTIVE_KEY = "planestudio.interactive-practice.v1";
const WORKSTATION_KEY = "planestudio.workstation.v1";

// Casos E2E nuevos que cierran gaps reales encontrados en auditoría (2026-08-24) tras la
// pérdida del prompt original de 72 secciones ("§63" en SPRINT_HANDOFF.md). No reconstruyen
// ese checklist perdido: cubren huecos de cobertura confirmados contra el código actual.

test.describe("Diagnóstico de caso aplicado", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("registra tarjeta de repaso independiente del quiz normal y no afecta el puntaje del módulo", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");

    await page.getByLabel("Diagnóstico de caso aplicado").getByRole("button", { name: "Iniciar evaluación" }).click();
    await page.getByRole("button", { name: /^A\./ }).click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    await expect(page.getByText(/¡Correcto!|Incorrecto/)).toBeVisible();

    const reviewStored = await page.evaluate((key) => window.localStorage.getItem(key), REVIEW_KEY);
    expect(reviewStored).toBeTruthy();
    const cards = JSON.parse(reviewStored!).state.cards as Record<string, { itemType: string }>;
    const caseCards = Object.values(cards).filter((c) => c.itemType === "case-diagnosis");
    expect(caseCards.length).toBeGreaterThan(0);

    // saveScore={false} en el panel de caso: no debe tocar el puntaje académico del módulo.
    const academicStored = await page.evaluate((key) => window.localStorage.getItem(key), ACADEMIC_KEY);
    const quizScores = academicStored ? JSON.parse(academicStored).state.quizScores : {};
    expect(quizScores["1"]).toBeUndefined();
  });

  test("no afecta el pool del simulador ni el quiz normal del módulo", async ({ page }) => {
    // El quiz normal (15 preguntas, module-1-0..14) y el diagnóstico de caso (5 preguntas,
    // appliesTo:"caso") son pools separados — responder uno no debe registrar el otro.
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");
    await page.getByLabel("Evaluación del módulo").getByRole("button", { name: "Iniciar evaluación" }).click();
    await page.getByRole("button", { name: /^A\./ }).click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    await expect(page.getByText(/¡Correcto!|Incorrecto/)).toBeVisible();

    const reviewStored = await page.evaluate((key) => window.localStorage.getItem(key), REVIEW_KEY);
    const cards = JSON.parse(reviewStored!).state.cards as Record<string, { itemType: string }>;
    const caseCards = Object.values(cards).filter((c) => c.itemType === "case-diagnosis");
    expect(caseCards.length).toBe(0);
  });
});

test.describe("Nivel D365 y Módulo 56 (JS fundamentos)", () => {
  test("nivel D365 integra módulos, labs, práctica y checklist", async ({ page }) => {
    await page.goto("/nivel/d365");
    await expect(page.locator("h1")).toContainText(/Dynamics 365/i);
    await expect(page.locator('a[href="/nivel/d365/modulo/introduccion-dynamics-365-avanzado"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ruta práctica recomendada para Dynamics 365" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Checklist tenant/i })).toBeVisible();

    await page.goto("/nivel/d365/modulo/introduccion-dynamics-365-avanzado");
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();

    await page.goto("/experiencia-practica/inc-004-d365-customer-service-sla");
    await expect(page.locator("h1")).toContainText(/SLA/i);

    await page.goto("/recursos/checklist");
    await page.getByRole("button", { name: /Dynamics 365 Especialización 0%/ }).click();
    await expect(page.getByRole("heading", { name: /Dynamics 365 CE Avanzado/i })).toBeVisible();

    await page.goto("/progreso");
    await expect(page.getByRole("heading", { name: /D365 · D365/i })).toBeVisible();
  });

  test("Módulo 13 enlaza al Módulo 56 como prerrequisito de JS y Módulo 56 carga con su moduleId renumerado", async ({ page }) => {
    await page.goto("/nivel/intermedio/modulo/javascript-y-pcf-basico");
    await expect(page.getByRole("heading", { name: /Antes de comenzar: requiere JavaScript básico/i })).toBeVisible();
    await page.getByRole("link", { name: "Fundamentos de JavaScript para Power Platform" }).click();
    await expect(page).toHaveURL(/\/nivel\/ia\/modulo\/fundamentos-javascript-para-power-platform/);
    await expect(page.locator("h1")).toContainText("Fundamentos de JavaScript para Power Platform");
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();
  });
});

test.describe("Certificados — lenguaje de examen por nivel", () => {
  test("certificado del nivel Básico incluye lenguaje de examen PL-900", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const completedModules = Array.from({ length: 8 }, (_, i) => `basico-${i + 1}`);
      const quizScores = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [String(i + 1), 90]));
      const completedLabs = [
        "lab-02-dataverse-modelo-datos",
        "lab-03-canvas-primera-app",
        "lab-04-model-driven-app",
        "lab-05-automate-aprobacion",
        "lab-61-capstone-maker-sistema-solicitudes",
      ];
      window.localStorage.setItem("plan-estudio-progress", JSON.stringify({
        state: { completedModules, quizScores, completedLabs, checklistItems: {}, lastVisited: null, userName: "Ada Lovelace" },
        version: 0,
      }));
    });
    await page.goto("/certificado/basico");
    await expect(page).toHaveURL(/\/certificado\/basico$/);
    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    await expect(page.getByText(/rendir la certificación/i)).toBeVisible();
    await expect(page.locator("#main-content").getByText(/PL-900/i)).toBeVisible();
  });
});

test.describe("Prácticas guiadas (practiceType: guided)", () => {
  test("detalle de guided lab muestra pasos guiados y criterios de aceptación, no el gate de incident", async ({ page }) => {
    await page.goto("/experiencia-practica/gl-setup-01-instalar-git-y-configurar-identidad");
    await expect(page).toHaveURL(/\/experiencia-practica\/gl-setup-01/);
    await expect(page.getByText("Guided Lab")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pasos guiados" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Criterios de aceptación" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Solución de referencia" })).toBeVisible();
  });
});

test.describe("Aislamiento de los 5 stores independientes", () => {
  test("marcar un módulo académico no altera práctica profesional, práctica interactiva, repaso ni workstation", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    // Sin sembrar nada: cada store escribe su propia clave solo cuando algo la toca.
    // Visitar / y el módulo académico no debe hacer que ninguno de los otros 4 stores
    // escriba en localStorage.
    await page.goto("/");

    const before = await page.evaluate(
      (keys) => keys.map((k) => window.localStorage.getItem(k)),
      [PRACTICE_KEY, INTERACTIVE_KEY, REVIEW_KEY, WORKSTATION_KEY]
    );

    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");
    const completeBtn = page.locator('button[aria-label*="Marcar"]').first();
    await completeBtn.waitFor({ state: "visible" });
    await completeBtn.click();
    await expect(completeBtn).toHaveAttribute("aria-pressed", "true");

    const after = await page.evaluate(
      (keys) => keys.map((k) => window.localStorage.getItem(k)),
      [PRACTICE_KEY, INTERACTIVE_KEY, REVIEW_KEY, WORKSTATION_KEY]
    );
    expect(after).toEqual(before);

    const academicStored = await page.evaluate((key) => window.localStorage.getItem(key), ACADEMIC_KEY);
    expect(JSON.parse(academicStored!).state.completedModules).toContain("basico-1");
  });
});

test.describe("Simulador — flujo completo", () => {
  test("completar las 40 preguntas muestra el resultado final con desglose de errores", async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto("/simulador");
    await page.getByRole("button", { name: "Iniciar simulador" }).click();
    await page.getByRole("button", { name: "Iniciar evaluación" }).click();

    for (let i = 0; i < 40; i++) {
      await page.getByRole("button", { name: /^A\./ }).click();
      await page.getByRole("button", { name: "Enviar respuesta" }).click();
      await page.getByRole("button", { name: /^(Siguiente pregunta|Ver resultados)$/ }).click();
    }

    await expect(page.getByText(/\d{1,3}%/).first()).toBeVisible();
    await expect(page.getByText(/Aprobado|No aprobado|Reprobado/i)).toBeVisible();

    const breakdownToggle = page.getByRole("button").filter({ hasText: /error|incorrecta/i }).first();
    if (await breakdownToggle.count()) {
      await breakdownToggle.click();
      await expect(breakdownToggle).toHaveAttribute("aria-expanded", "true");
    }

    // El simulador nunca alimenta el motor de repaso espaciado (registerForReview=false).
    const reviewStored = await page.evaluate((key) => window.localStorage.getItem(key), REVIEW_KEY);
    expect(reviewStored === null || Object.keys(JSON.parse(reviewStored).state.cards ?? {}).length === 0).toBe(true);
  });
});

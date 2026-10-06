import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts"],
      exclude: [
        "src/lib/i18n.ts",
        "src/lib/utils.ts",          // trivial re-export, no logic to test
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        // vitest 5 mide ramas con remapeo AST (más estricto): ~72% donde vitest 3 medía ~81%.
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});

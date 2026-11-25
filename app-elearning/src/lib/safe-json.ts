// Guardia común de las importaciones locales: rechaza claves que podrían usarse
// para contaminar prototipos y estructuras anidadas más hondas que cualquier export real.
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function findDangerousKey(value: unknown, depth = 0): string | null {
  if (!value || typeof value !== "object") return null;
  if (depth > 12) return "profundidad excesiva";
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (DANGEROUS_KEYS.has(key)) return key;
    const found = findDangerousKey(nested, depth + 1);
    if (found) return found;
  }
  return null;
}

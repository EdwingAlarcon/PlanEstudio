// Los labs declaran el rol con texto libre (más de 40 variantes, en dos idiomas). La interfaz las agrupa en pocas
// familias para filtrar y mostrar sin repetidos; el frontmatter no se toca.
const FAMILIES: [string, RegExp][] = [
  ["Desarrollador", /developer|desarrollador|devops/i],
  ["Arquitecto", /arquitect|architect/i],
  ["Administración y gobierno", /admin|governance|gobierno|coe|legacy|migration|support|operations|\bqa\b/i],
  ["Analista de datos", /analista de datos|data /i],
  ["Automatización", /automat|rpa/i],
  ["IA y agentes", /\bai\b|copilot|agent/i],
  ["Consultor funcional", /funcional|functional|consult|specialist|analyst|practitioner|lead|marketing|crm|^sales$|^todos$/i],
  ["Maker", /maker/i],
];

export function roleFamily(role: string): string {
  return FAMILIES.find(([, pattern]) => pattern.test(role))?.[0] ?? "Otros";
}

export function roleFamilies(roles: string[]): string[] {
  return [...new Set(roles.map(roleFamily))];
}

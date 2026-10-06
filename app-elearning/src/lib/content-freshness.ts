// Content currency: modules/labs may declare `lastVerified: "YYYY-MM"` in their
// frontmatter (month they were last checked against Microsoft Learn).

export const FRESHNESS_MAX_AGE_MONTHS = 6;
export type Freshness = "fresh" | "stale" | "unknown";

const LAST_VERIFIED_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function isValidLastVerified(value: string): boolean {
  return LAST_VERIFIED_PATTERN.test(value);
}

export function monthsSince(lastVerified: string, now: Date): number {
  const match = LAST_VERIFIED_PATTERN.exec(lastVerified);
  if (!match) return Number.POSITIVE_INFINITY;
  const verifiedIndex = Number(match[1]) * 12 + Number(match[2]) - 1;
  const nowIndex = now.getUTCFullYear() * 12 + now.getUTCMonth();
  return nowIndex - verifiedIndex;
}

export function getFreshness(
  lastVerified: string | undefined,
  now: Date,
  maxAgeMonths = FRESHNESS_MAX_AGE_MONTHS
): Freshness {
  if (!lastVerified || !isValidLastVerified(lastVerified)) return "unknown";
  return monthsSince(lastVerified, now) > maxAgeMonths ? "stale" : "fresh";
}

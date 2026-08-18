// Centralized local-date utilities for the spaced repetition engine.
// Everything here takes an explicit `now`/`date` — nothing reaches for
// `Date.now()` internally, so scheduler tests can freeze time deterministically.

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" in the *local* timezone (never UTC) — the unit "due today" is measured in. */
export function toLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = startOfLocalDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** A card is due once its local calendar day has arrived (not a strict 24h countdown). */
export function isDueOn(nextReviewAt: string, now: Date): boolean {
  const parsed = parseIsoDate(nextReviewAt);
  if (!parsed) return false;
  return startOfLocalDay(parsed).getTime() <= startOfLocalDay(now).getTime();
}

/** Whole local-calendar days between `from` and `to` (can be negative). */
export function localDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfLocalDay(to).getTime() - startOfLocalDay(from).getTime()) / DAY_MS);
}

/** Rejects NaN dates, non-finite timestamps and non-string/non-Date input. Never throws. */
export function parseIsoDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

export function toIsoDate(date: Date): string {
  return date.toISOString();
}

/** Single injection point the UI uses instead of calling `new Date()` directly. */
export function getReviewNow(): Date {
  return new Date();
}

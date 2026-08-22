import {
  INTERACTIVE_DOMAIN_LABELS,
  type InteractivePractice,
  type InteractivePracticeDomain,
  type InteractivePracticeLevel,
  type InteractivePracticeType,
} from "@/lib/interactive-practices";
import type { InteractivePracticeRecord } from "@/lib/interactive-practice-progress";

export type InteractivePracticeDomainFilter = "all" | InteractivePracticeDomain;
export type InteractivePracticeTypeFilter = "all" | InteractivePracticeType;
export type InteractivePracticeLevelFilter = "all" | InteractivePracticeLevel;
export type InteractivePracticeMasteryFilter = "all" | "needs-review" | "completed" | "not-started";

export interface InteractivePracticeFilters {
  domain: InteractivePracticeDomainFilter;
  type: InteractivePracticeTypeFilter;
  level: InteractivePracticeLevelFilter;
  mastery: InteractivePracticeMasteryFilter;
  query: string;
}

export const DEFAULT_INTERACTIVE_PRACTICE_FILTERS: InteractivePracticeFilters = {
  domain: "all",
  type: "all",
  level: "all",
  mastery: "all",
  query: "",
};

export function filterInteractivePractices(
  practices: InteractivePractice[],
  records: Record<string, InteractivePracticeRecord>,
  filters: InteractivePracticeFilters
): InteractivePractice[] {
  const normalized = filters.query.trim().toLowerCase();
  return practices.filter((practice) => {
    const record = records[practice.id];
    const matchesDomain = filters.domain === "all" || practice.domain === filters.domain;
    const matchesType = filters.type === "all" || practice.type === filters.type;
    const matchesLevel = filters.level === "all" || practice.level === filters.level;
    const matchesMastery =
      filters.mastery === "all" ||
      (filters.mastery === "needs-review" && record?.mastery === "needs-review") ||
      (filters.mastery === "completed" && record?.status === "completed") ||
      (filters.mastery === "not-started" && !record);
    const matchesText =
      !normalized ||
      [practice.title, practice.description, practice.tags.join(" "), INTERACTIVE_DOMAIN_LABELS[practice.domain]]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    return matchesDomain && matchesType && matchesLevel && matchesMastery && matchesText;
  });
}

export function syncSelectedInteractivePracticeSlug(currentSlug: string, filtered: InteractivePractice[]): string {
  if (filtered.some((practice) => practice.slug === currentSlug)) return currentSlug;
  return filtered[0]?.slug ?? "";
}

export function hasActiveInteractivePracticeFilters(filters: InteractivePracticeFilters): boolean {
  return filters.domain !== "all" ||
    filters.type !== "all" ||
    filters.level !== "all" ||
    filters.mastery !== "all" ||
    filters.query.trim().length > 0;
}

import { describe, expect, it } from "vitest";
import { countDaysInWeek, getActivityGrid, getWeekDays, getWeeklyStreak, mergeActivityDays, startOfWeek, weekKey } from "../habit";
import { sanitizeHabitState } from "../habit-store";

// Jueves 26 de noviembre de 2026; su semana empieza el lunes 23.
const today = new Date(2026, 10, 26, 15, 0, 0);
const set = (...days: string[]) => new Set(days);

describe("semanas", () => {
  it("la semana empieza el lunes, también un domingo", () => {
    expect(weekKey(today)).toBe("2026-11-23");
    expect(weekKey(new Date(2026, 10, 29))).toBe("2026-11-23");
    expect(weekKey(new Date(2026, 10, 30))).toBe("2026-11-30");
    expect(startOfWeek(today).getDay()).toBe(1);
  });

  it("marca los días de esta semana, hoy y los futuros", () => {
    const days = getWeekDays(set("2026-11-23", "2026-11-26"), today);
    expect(days.map((d) => d.label)).toEqual(["L", "M", "X", "J", "V", "S", "D"]);
    expect(days.filter((d) => d.active).map((d) => d.key)).toEqual(["2026-11-23", "2026-11-26"]);
    expect(days.find((d) => d.today)!.key).toBe("2026-11-26");
    expect(days.filter((d) => d.future)).toHaveLength(3);
    expect(countDaysInWeek(set("2026-11-23", "2026-11-26", "2026-11-30"), startOfWeek(today))).toBe(2);
  });
});

describe("getWeeklyStreak", () => {
  const goal = 2;
  const previous = ["2026-11-16", "2026-11-17", "2026-11-09", "2026-11-12"]; // dos semanas anteriores con 2 días

  it("la semana en curso sin cumplir no rompe la racha", () => {
    expect(getWeeklyStreak(set(...previous), goal, set(), today)).toBe(2);
  });

  it("la semana en curso suma cuando ya cumplió", () => {
    expect(getWeeklyStreak(set(...previous, "2026-11-23", "2026-11-24"), goal, set(), today)).toBe(3);
  });

  it("una semana sin la meta corta la racha, y una de descanso no", () => {
    const conHueco = ["2026-11-16", "2026-11-17", "2026-11-02", "2026-11-03"]; // la del 9 no cumple
    expect(getWeeklyStreak(set(...conHueco), goal, set(), today)).toBe(1);
    expect(getWeeklyStreak(set(...conHueco), goal, set("2026-11-09"), today)).toBe(2);
  });

  it("sin actividad es 0", () => {
    expect(getWeeklyStreak(set(), 3, set(), today)).toBe(0);
  });
});

describe("actividad", () => {
  it("une los días registrados, el repaso y las prácticas en hora local", () => {
    const days = mergeActivityDays(["2026-11-20"], ["2026-11-21"], [new Date(2026, 10, 22, 23, 30).toISOString(), "no es fecha"]);
    expect([...days].sort()).toEqual(["2026-11-20", "2026-11-21", "2026-11-22"]);
  });

  it("la cuadrícula tiene 12 semanas de 7 días y termina en la actual", () => {
    const grid = getActivityGrid(set("2026-11-24"), today, 12);
    expect(grid).toHaveLength(12);
    expect(grid.every((w) => w.days.length === 7)).toBe(true);
    expect(grid.at(-1)!.weekKey).toBe("2026-11-23");
    expect(grid.flatMap((w) => w.days).filter((d) => d.active)).toHaveLength(1);
  });
});

describe("sanitizeHabitState", () => {
  it("limpia valores corruptos y deja la meta por defecto", () => {
    const s = sanitizeHabitState({ weeklyGoal: 9, activeDays: ["2026-11-20", "x", 3, "2026-11-20"], restWeeks: "no" });
    expect(s).toEqual({ schemaVersion: 1, weeklyGoal: 3, activeDays: ["2026-11-20"], restWeeks: [] });
    expect(sanitizeHabitState(null).weeklyGoal).toBe(3);
    expect(sanitizeHabitState({ weeklyGoal: 4 }).weeklyGoal).toBe(4);
  });
});

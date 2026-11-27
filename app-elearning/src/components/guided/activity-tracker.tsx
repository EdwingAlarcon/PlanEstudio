"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/lib/progress";
import { useInteractivePracticeProgressStore } from "@/lib/interactive-practice-progress";
import { useHabitStore } from "@/lib/habit-store";
import { toLocalDayKey } from "@/lib/review-date";

// Registra "hoy" como día con actividad cuando cambia el progreso académico (quiz, lab, paso, módulo).
// El repaso y las prácticas interactivas ya guardan sus fechas y se suman al calcular la semana (mergeActivityDays),
// así que aquí basta con el store académico. Solo escucha cambios hechos por el alumno, no la carga inicial.
export function ActivityTracker() {
  useEffect(() => {
    const record = () => useHabitStore.getState().recordActivity(toLocalDayKey(new Date()));
    let unsubscribe = () => {};
    const start = () => {
      unsubscribe = useProgressStore.subscribe((state, prev) => {
        if (
          state.quizScores !== prev.quizScores ||
          state.completedLabs !== prev.completedLabs ||
          state.completedModules !== prev.completedModules ||
          state.completedSteps !== prev.completedSteps
        ) {
          record();
        }
      });
    };
    if (useProgressStore.persist.hasHydrated()) start();
    const unsubHydration = useProgressStore.persist.onFinishHydration(() => {
      unsubscribe();
      start();
    });
    // Abrir o intentar una práctica interactiva también es actividad de hoy (se guarda en su propio store).
    const unsubPractice = useInteractivePracticeProgressStore.subscribe((state, prev) => {
      if (useInteractivePracticeProgressStore.persist.hasHydrated() && state.records !== prev.records && prev.records !== undefined) {
        const changed = Object.keys(state.records).some((id) => state.records[id] !== prev.records[id] && state.records[id]?.attemptCount !== prev.records[id]?.attemptCount);
        if (changed) record();
      }
    });
    return () => {
      unsubscribe();
      unsubHydration();
      unsubPractice();
    };
  }, []);
  return null;
}

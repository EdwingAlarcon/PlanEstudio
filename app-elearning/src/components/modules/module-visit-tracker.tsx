"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/lib/progress";

// Records the module being read so the home page can offer "Continuar".
export function ModuleVisitTracker({ moduleId }: { moduleId: string }) {
  const setLastVisited = useProgressStore((s) => s.setLastVisited);
  useEffect(() => {
    setLastVisited(moduleId);
  }, [moduleId, setLastVisited]);
  return null;
}

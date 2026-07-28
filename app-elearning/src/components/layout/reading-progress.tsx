"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // AppShell scrolls its own <main id="main-content">, not window
    // (root is h-screen overflow-hidden) — the progress bar must track that
    // element, not window.scrollY, or it stays frozen at 0%.
    const scrollEl = document.getElementById("main-content");
    if (!scrollEl) return;

    let ticking = false;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const docHeight = scrollHeight - clientHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateProgress);
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      id="reading-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}

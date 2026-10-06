"use client";

import { useEffect } from "react";

// Registers the offline-reading service worker in production builds only, so dev
// and E2E runs are never affected by cached responses.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => {
      // Offline support is an enhancement; failing to register must never break the app.
    });
  }, []);
  return null;
}

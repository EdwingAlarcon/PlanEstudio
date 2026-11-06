// Fuente única del formato del simulador. Vive fuera de simulator-client.tsx
// ("use client") para que las páginas de servidor (home, /simulador) puedan leer
// estos valores sin duplicarlos a mano.
export const SIMULATOR_QUESTIONS = 40;
export const SIMULATOR_MINUTES = 50;
export const SIMULATOR_TIME_SECONDS = SIMULATOR_MINUTES * 60;
export const SIMULATOR_PASS_PERCENT = 70;

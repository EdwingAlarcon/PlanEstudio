// Logo "La P que avanza": una P de un trazo y un punto, tu siguiente paso. El mismo dibujo está en app/icon.svg,
// en los PNG de public/ y en la imagen para compartir (app/og.png).
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <rect width="64" height="64" rx="14" fill="#0078D4" />
      <path d="M21 51 V15 H34 C42 15 47 20 47 27 C47 34 42 39 34 39 H31" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="43" cy="49" r="5.5" fill="#7FD36B" />
    </svg>
  );
}

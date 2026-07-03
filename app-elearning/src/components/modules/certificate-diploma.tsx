import { UI, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CertificateDiplomaProps {
  levelId: LevelId;
  userName: string;
  date: Date;
}

const BORDER_COLORS: Record<LevelId, string> = {
  basico:     "border-emerald-600 dark:border-emerald-400",
  intermedio: "border-blue-600    dark:border-blue-400",
  avanzado:   "border-orange-600  dark:border-orange-400",
  arquitecto: "border-red-600     dark:border-red-400",
};

const ACCENT_TEXT_COLORS: Record<LevelId, string> = {
  basico:     "text-emerald-700 dark:text-emerald-400",
  intermedio: "text-blue-700    dark:text-blue-400",
  avanzado:   "text-orange-700  dark:text-orange-400",
  arquitecto: "text-red-700     dark:text-red-400",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function CertificateDiploma({ levelId, userName, date }: CertificateDiplomaProps) {
  return (
    <div
      className={cn(
        "certificate-print-area mx-auto max-w-3xl aspect-[1.414/1] w-full",
        "border-8 double p-10 flex flex-col items-center justify-center text-center gap-6",
        "bg-background relative",
        BORDER_COLORS[levelId]
      )}
    >
      <div
        className={cn(
          "absolute inset-3 border-2 pointer-events-none",
          BORDER_COLORS[levelId]
        )}
        aria-hidden
      />

      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Plan de Estudio Power Platform &amp; D365
      </p>

      <h1 className="font-serif text-3xl font-bold">Certificado de Finalización</h1>

      <p className="text-sm text-muted-foreground">Se otorga el presente certificado a</p>

      <p className="font-serif text-4xl font-semibold">{userName}</p>

      <p className="text-base leading-relaxed max-w-lg">
        por haber completado exitosamente el{" "}
        <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
          {UI.levels.badge[levelId]}
        </span>
        , quedando preparado para rendir la certificación{" "}
        <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
          {UI.levels.cert[levelId]}
        </span>
        .
      </p>

      <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
    </div>
  );
}

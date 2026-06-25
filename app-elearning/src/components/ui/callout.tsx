import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { ReactNode } from "react";

type CalloutVariant = "info" | "warning" | "success" | "error";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const VARIANT_CONFIG: Record<CalloutVariant, {
  icon: typeof Info;
  wrapper: string;
  iconClass: string;
  titleClass: string;
}> = {
  info: {
    icon: Info,
    wrapper: "border-[#0078D4] bg-[#EFF6FC] dark:bg-[rgba(0,120,212,0.12)] dark:border-[#2196F3]",
    iconClass: "text-[#0078D4] dark:text-[#4DB8FF]",
    titleClass: "text-[#0078D4] dark:text-[#4DB8FF]",
  },
  warning: {
    icon: AlertTriangle,
    wrapper: "border-[#FFB900] bg-[#FFFBE6] dark:bg-[rgba(255,185,0,0.1)] dark:border-[#FFB900]",
    iconClass: "text-[#B37800] dark:text-[#FFB900]",
    titleClass: "text-[#B37800] dark:text-[#FFB900]",
  },
  success: {
    icon: CheckCircle2,
    wrapper: "border-[#107C10] bg-[#EFF8EE] dark:bg-[rgba(16,124,16,0.12)] dark:border-[#2DB52D]",
    iconClass: "text-[#107C10] dark:text-[#2DB52D]",
    titleClass: "text-[#107C10] dark:text-[#2DB52D]",
  },
  error: {
    icon: XCircle,
    wrapper: "border-[#D13438] bg-[#FEF0F0] dark:bg-[rgba(209,52,56,0.12)] dark:border-[#E85555]",
    iconClass: "text-[#D13438] dark:text-[#E85555]",
    titleClass: "text-[#D13438] dark:text-[#E85555]",
  },
};

export function Callout({ variant = "info", title, children, className }: CalloutProps) {
  const cfg = VARIANT_CONFIG[variant];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border-l-4 px-4 py-4 text-sm",
        cfg.wrapper,
        className
      )}
      role={variant === "warning" || variant === "error" ? "alert" : "note"}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", cfg.iconClass)} aria-hidden />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("mb-1 font-semibold leading-snug", cfg.titleClass)}>
            {title}
          </p>
        )}
        <div className="leading-relaxed text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

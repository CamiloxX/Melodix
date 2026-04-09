import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionBadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Pequeño badge de etiqueta para encabezar secciones.
 * Ej: "✦ Funciones" encima del título de sección.
 */
export default function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase",
        "bg-violet-500/10 border border-violet-500/30 text-violet-400",
        className
      )}
    >
      {children}
    </span>
  );
}

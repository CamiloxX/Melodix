import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de forma segura, resolviendo conflictos.
 * Usa clsx para condicionales y tailwind-merge para deduplicar.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

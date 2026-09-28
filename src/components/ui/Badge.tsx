import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "success" | "warn" | "danger" | "info" | "neutral";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantMap: Record<Variant, string> = {
  success: "bg-harvest-100 text-harvest-800 border border-harvest-200",
  warn: "bg-cream-200 text-cream-800 border border-cream-300",
  danger: "bg-terracotta-100 text-terracotta-700 border border-terracotta-200",
  info: "bg-ink-100 text-ink-700 border border-ink-200",
  neutral: "bg-white text-ink-700 border border-cream-200",
};

export function Badge({ variant = "neutral", className, ...rest }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        variantMap[variant],
        className
      )}
      {...rest}
    />
  );
}

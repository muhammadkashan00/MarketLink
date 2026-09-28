"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-harvest-800 text-cream-50 shadow-soft hover:bg-harvest-900 hover:shadow-lift focus-visible:ring-harvest-500",
  secondary:
    "border-2 border-harvest-800 bg-transparent text-harvest-800 hover:bg-harvest-800 hover:text-cream-50 focus-visible:ring-harvest-500",
  accent:
    "bg-terracotta-500 text-cream-50 shadow-soft hover:bg-terracotta-600 hover:shadow-lift focus-visible:ring-terracotta-400",
  ghost:
    "bg-transparent text-ink-700 hover:bg-cream-200/60 focus-visible:ring-ink-300",
  danger:
    "bg-terracotta-600 text-cream-50 shadow-soft hover:bg-terracotta-700 focus-visible:ring-terracotta-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, leftIcon, rightIcon, children, className, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all outline-none focus-visible:ring-4 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

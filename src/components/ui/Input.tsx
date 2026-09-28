"use client";
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, className, id, ...rest }, ref
) {
  const inputId = id || rest.name;
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <div className="relative">
        {leftIcon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border-2 bg-white/80 py-3 text-sm text-ink-900 placeholder-ink-400 shadow-inner-soft transition-all outline-none",
            leftIcon ? "pl-11 pr-4" : "px-4",
            error ? "border-terracotta-500 focus:ring-4 focus:ring-terracotta-100"
                  : "border-cream-200 focus:border-harvest-500 focus:bg-white focus:ring-4 focus:ring-harvest-100",
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-terracotta-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...rest }, ref
) {
  const inputId = id || rest.name;
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-xl border-2 bg-white/80 px-4 py-3 text-sm text-ink-900 placeholder-ink-400 shadow-inner-soft transition-all outline-none",
          error ? "border-terracotta-500" : "border-cream-200 focus:border-harvest-500 focus:bg-white focus:ring-4 focus:ring-harvest-100",
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-terracotta-600">{error}</p>}
    </div>
  );
});

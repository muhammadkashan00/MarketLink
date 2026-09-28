"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Wraps next/image but falls back to a branded placeholder when the URL
// is missing or fails to load — keeps product cards from ever showing
// the browser's broken-image icon.
export function SafeImage({
  src,
  alt,
  fill,
  className,
  fallbackEmoji = "🌿",
  fallbackLabel,
  sizes,
  priority,
}: {
  src?: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  fallbackEmoji?: string;
  fallbackLabel?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const shouldFallback = failed || !src;

  if (shouldFallback) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-harvest-50 via-cream-100 to-cream-200",
          fill ? "absolute inset-0" : "h-full w-full",
          className
        )}
      >
        <span className="text-5xl opacity-70">{fallbackEmoji}</span>
        {fallbackLabel && (
          <span className="serif-heading px-3 text-center text-sm italic text-ink-600 line-clamp-2">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

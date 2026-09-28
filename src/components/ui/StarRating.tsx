"use client";
import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = 16,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(n)}
          className={cn(
            "transition-transform",
            !readOnly && "hover:scale-125 cursor-pointer",
            readOnly && "cursor-default"
          )}
        >
          <Star
            width={size}
            height={size}
            className={cn(
              "transition-colors",
              n <= active ? "fill-cream-500 text-cream-500" : "fill-cream-100 text-cream-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}

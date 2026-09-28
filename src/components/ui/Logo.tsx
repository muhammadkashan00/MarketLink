import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Custom hand-crafted SVG leaf-basket logo */}
      <div className="relative">
        <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5A9540" />
              <stop offset="100%" stopColor="#2D5F3F" />
            </linearGradient>
            <linearGradient id="basketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EBC985" />
              <stop offset="100%" stopColor="#C9633D" />
            </linearGradient>
          </defs>
          {/* Basket base */}
          <path d="M8 22 L32 22 L28 34 Q28 36 26 36 L14 36 Q12 36 12 34 Z" fill="url(#basketGrad)" />
          {/* Basket weave lines */}
          <path d="M10 26 L30 26 M11 30 L29 30 M12 34 L28 34" stroke="#8B6229" strokeWidth="0.6" opacity="0.6" />
          {/* Leaf 1 */}
          <path d="M20 4 Q14 8 14 16 Q14 22 20 22 Q26 22 26 16 Q26 8 20 4 Z" fill="url(#leafGrad)" />
          {/* Leaf vein */}
          <path d="M20 6 L20 22 M20 10 Q17 12 15 14 M20 10 Q23 12 25 14 M20 14 Q17 16 15 18 M20 14 Q23 16 25 18" stroke="#1F3E28" strokeWidth="0.5" fill="none" opacity="0.4" />
          {/* Sparkle */}
          <circle cx="30" cy="10" r="1.2" fill="#E3B355" />
          <circle cx="33" cy="14" r="0.8" fill="#E3B355" opacity="0.7" />
        </svg>
      </div>
      {showText && (
        <span className="serif-heading text-xl font-semibold text-harvest-800 tracking-tight">
          MarketLink
        </span>
      )}
    </div>
  );
}

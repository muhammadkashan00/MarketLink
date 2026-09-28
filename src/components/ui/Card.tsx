import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  lift?: boolean;
  glass?: boolean;
}

export function Card({ lift, glass, className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-soft transition-all",
        glass ? "border-cream-200 bg-white/70 backdrop-blur-md" : "border-cream-200 bg-white",
        lift && "hover:-translate-y-1 hover:shadow-lift",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-cream-200 p-5", className)} {...rest} />;
}
export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...rest} />;
}
export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t border-cream-200 p-5", className)} {...rest} />;
}

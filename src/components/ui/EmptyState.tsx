import { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50/50 px-6 py-16 text-center">
      <div className="rounded-full bg-cream-200 p-4 text-harvest-700">{icon ?? <PackageOpen className="h-8 w-8" />}</div>
      <div>
        <h3 className="serif-heading text-xl text-ink-900">{title}</h3>
        {description && <p className="mt-1 max-w-md text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

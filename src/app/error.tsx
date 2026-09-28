"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-6">
      <div className="max-w-lg text-center">
        <h1 className="serif-heading text-5xl text-ink-900">Something went wrong</h1>
        <p className="mt-4 text-ink-600">
          {error?.message || "An unexpected error occurred while loading this page."}
        </p>
        {error?.digest && (
          <p className="mt-3 text-xs font-mono text-ink-500">Digest: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

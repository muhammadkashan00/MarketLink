"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 40, background: "#FDF8F0", color: "#2A2823" }}>
        <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center" }}>
          <h1 style={{ fontSize: 48, marginBottom: 16 }}>Something went wrong</h1>
          <p style={{ color: "#736B5C", marginBottom: 24 }}>
            {error?.message || "An unexpected error occurred while loading the page."}
          </p>
          {error?.digest && (
            <p style={{ fontSize: 12, color: "#8F8776", fontFamily: "monospace", marginBottom: 16 }}>
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              background: "#2D5F3F",
              color: "#FDF8F0",
              padding: "12px 24px",
              borderRadius: 999,
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              marginRight: 8,
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#2D5F3F",
              padding: "12px 24px",
              borderRadius: 999,
              border: "2px solid #2D5F3F",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Home
          </a>
        </div>
      </body>
    </html>
  );
}

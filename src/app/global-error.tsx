"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          background: "#0b1219",
          color: "#f3f5f7",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
            Application error
          </h1>
          <p style={{ opacity: 0.8 }}>
            A critical error occurred.{" "}
            {error?.digest ? `Reference: ${error.digest}` : null}
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.25rem",
              background: "#f59e0b",
              color: "#0b1219",
              border: 0,
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

export default function Loading() {
  return (
    <div
      className="container py-24"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}

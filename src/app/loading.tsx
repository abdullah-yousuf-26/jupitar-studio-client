export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div role="status">
        <p className="flex items-center gap-3 text-sm font-semibold tracking-wide text-[var(--muted)]">
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] motion-safe:animate-spin"
          />
          Loading JUPITAR STUDIO…
        </p>

        <div aria-hidden="true" className="mt-8 motion-safe:animate-pulse">
          <div className="h-9 w-2/3 max-w-sm rounded bg-[var(--border)]" />
          <div className="mt-3 h-3 w-1/2 max-w-xs rounded bg-[var(--border)]" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="overflow-hidden rounded-xl border border-[var(--border)]"
              >
                <div className="aspect-[16/9] bg-[var(--border)]" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-[var(--border)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--border)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
  
}

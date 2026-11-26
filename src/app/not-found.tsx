import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[65vh] w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
      <div>
        <p className="text-sm font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">
          Error 404
        </p>

        <h1 className="studio-heading mt-3 text-6xl leading-none uppercase sm:text-7xl">
          Page not found
        </h1>

        <p className="mt-5 max-w-md leading-7 text-[var(--muted)]">
          We couldn’t find the page you opened. Head back to JUPITAR STUDIO
          to explore spaces for your next session.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6845] px-6 py-3 font-semibold text-[#191919] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Return to Home
        </Link>
      </div>

      <div
        aria-hidden="true"
        className="relative mx-auto grid aspect-[4/3] w-full max-w-md place-items-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[#201e1c]"
      >
        {/* A studio clapperboard serves as the illustration until you add a PNG. */}
        <div className="relative w-40 -rotate-6 sm:w-48">
          <div
            className="h-8 origin-bottom-left -rotate-12 rounded-sm border-2 border-[#f6edcf]"
            style={{
              background:
                "repeating-linear-gradient(125deg, #f6edcf 0 14px, #272522 14px 28px)",
            }}
          />

          <div className="rounded-b-lg border-2 border-[#f6edcf] px-5 py-4">
            <span className="studio-heading block text-5xl leading-none text-[#ff6845]">
              404
            </span>
            <div className="mt-3 h-px bg-[#f6edcf]" />
            <div className="mt-2 h-px w-2/3 bg-[#f6edcf]" />
          </div>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | JUPITAR STUDIO",
  description:
    "Meet JUPITAR STUDIO, a marketplace connecting creators with local hosts who offer photography studios, podcast rooms, music suites, and creative workspaces.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="studio-heading text-6xl leading-none uppercase sm:text-7xl">
            About Jupitar Studio
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
            A product shoot might need a daylight loft for two hours. A podcast
            interview might need a quiet room with two microphones. JUPITAR
            STUDIO connects creators with local hosts who offer spaces by the
            hour.
          </p>

          <Link
            href="/studios"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6845] px-6 font-semibold text-[#191919] hover:underline"
          >
            Explore Studios
          </Link>
        </div>

        <div
          aria-hidden="true"
          className="aspect-[16/10] rounded-xl border border-[var(--border)] bg-cover bg-center"
          style={{
            backgroundImage:
              'url("/images/about/studio-space.png"), linear-gradient(135deg, #874328, #392a25 48%, #191919)',
          }}
        />
      </header>

      <section
        aria-label="Who JUPITAR STUDIO serves"
        className="mt-12 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-2 lg:mt-16 lg:gap-12"
      >
        <div>
          <h2 className="studio-heading text-4xl uppercase">For creators</h2>
          <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">
            Compare the details that matter for your session. Check whether
            your team will fit, which equipment is available, and how the
            hourly rate and security deposit fit your budget.
          </p>

          <Link
            href="/how-it-works"
            className="mt-4 inline-block font-semibold text-[var(--accent)] underline underline-offset-4"
          >
            How booking works
          </Link>
        </div>

        <div>
          <h2 className="studio-heading text-4xl uppercase">For studio hosts</h2>
          <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">
            Help creators picture a working day in your space. For a photo
            studio, show where the light falls. For a recording room, describe
            the microphones and sound treatment. Clear photos, rates, and
            equipment lists help creators choose a good fit.
          </p>
        </div>
      </section>
    </main>
  );
}

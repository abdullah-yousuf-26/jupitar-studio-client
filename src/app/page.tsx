import { ThemeSwitch } from "@/components/site-theme";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-12 lg:px-20">
      <div className="flex justify-end">
        <ThemeSwitch />
      </div>

      <section className="flex flex-1 flex-col items-start justify-center py-16">
        <p className="mb-5 text-sm font-semibold tracking-[0.2em] text-[var(--accent)]">
          CREATIVE STUDIO RENTALS
        </p>

        <h1 className="studio-heading text-7xl leading-[0.85] sm:text-9xl lg:text-[10rem]">
          JUPITAR
          <br />
          STUDIO
        </h1>

        <p className="mt-8 max-w-lg text-lg leading-8 text-[var(--muted)]">
          Find a space for your next photo shoot, podcast, or recording session.
          Book a creative studio by the hour.
        </p>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-[#191919] px-6 py-16 text-[#F5EDCF] sm:px-12 lg:px-20">
      <section className="mx-auto w-full max-w-6xl">
        <p className="mb-6 text-sm font-semibold tracking-[0.2em] text-[#FF6845]">
          CREATIVE STUDIO RENTALS
        </p>

        <h1 className="text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
          JUPITAR
          <br />
          STUDIO
        </h1>

        <p className="mt-8 max-w-lg text-lg leading-8">
          Find a space for your next photo shoot, podcast, or recording session.
          Book a creative studio by the hour.
        </p>
      </section>
    </main>
  );
}
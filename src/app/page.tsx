import { Suspense } from "react";
import HeroSlider from "@/components/hero-slider";
import FeaturedStudios from "@/components/featured-studios";

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">JUPITAR STUDIO — Creative Studio Rentals</h1>

      <Suspense
        fallback={
          <div
            role="status"
            className="mx-auto flex min-h-[28rem] w-full max-w-7xl items-center justify-center px-4 py-8"
          >
            <p className="text-sm text-[var(--muted)]">
              Loading studio slides…
            </p>
          </div>
        }
      >
        <HeroSlider />
      </Suspense>
      <FeaturedStudios />
    </main>
  );
}

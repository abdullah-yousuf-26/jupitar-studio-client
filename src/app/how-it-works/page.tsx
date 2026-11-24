import type { Metadata } from "next";
import Link from "next/link";
import HowBookingWorks from "@/components/how-booking-works";

export const metadata: Metadata = {
  title: "How It Works | JUPITAR STUDIO",
  description:
    "Learn how to find a creative studio, choose your hours, and request a booking with JUPITAR STUDIO.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <header className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:pt-16">
        <h1 className="studio-heading max-w-3xl text-6xl leading-none uppercase sm:text-7xl">
          How to book a studio
        </h1>

        <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">
          Start with the kind of space you need. Compare the hourly rate,
          capacity, and equipment, then choose the hours that fit your session.
        </p>

        <Link
          href="/studios"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6845] px-6 font-semibold text-[#191919] hover:underline"
        >
          Explore Studios
        </Link>
      </header>

      <HowBookingWorks />
    </main>
  );
}

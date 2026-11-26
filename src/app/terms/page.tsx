import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | JUPITAR STUDIO",
  description: "Guidelines for listing creative studios and requesting bookings.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="studio-heading text-5xl uppercase sm:text-7xl">
        Terms of use
      </h1>

      <p className="mt-5 leading-7 text-[var(--muted)]">
        JUPITAR STUDIO helps hosts list creative spaces and creators request
        studio time. These guidelines explain how to use your account,
        publish a listing, and manage a reservation.
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="studio-heading text-3xl uppercase">Your account</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">
            Use an email address you control and keep your sign-in details
            private. Sign out when you finish using a shared device.
          </p>
        </section>

        <section>
          <h2 className="studio-heading text-3xl uppercase">Listing a studio</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">
            List spaces you have permission to offer. Use photos you have
            permission to share and keep the hourly rate, security deposit,
            capacity, location, and amenities accurate. You can update these
            details from My Studio Listings.
          </p>
        </section>

        <section>
          <h2 className="studio-heading text-3xl uppercase">Requesting a booking</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">
            Review the studio details, hourly rate, and session times before
            submitting a request. New requests appear as Pending in My
            Bookings. Check the status before making plans to use the space.
          </p>
        </section>

        <section>
          <h2 className="studio-heading text-3xl uppercase">Cancelling a request</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">
            Open My Bookings, select a pending reservation, and choose Cancel
            booking. Review the studio name in the confirmation dialog before
            confirming your cancellation.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6845] px-6 py-3 font-semibold text-[#191919] hover:underline"
      >
        Return to Home
      </Link>
    </main>
  );
}

const bookingSteps = [
  {
    title: "Discover Spaces",
    description:
      "Explore studios by category. Compare photos, amenities, locations, and hourly rates.",
  },
  {
    title: "Select Shoot Hours",
    description:
      "Choose your date, start time, and end time. Review the booking price and security deposit.",
  },
  {
    title: "Book Instantly",
    description:
      "Submit your reservation. Open My Bookings to see its pending status and track confirmation.",
  },
  {
    title: "Create & Produce",
    description:
      "Once your booking is confirmed, bring your team and equipment to the studio at your reserved time.",
  },
];

export default function HowBookingWorks() {
  return (
    <section
      aria-labelledby="booking-steps-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16"
    >
      <h2
        id="booking-steps-heading"
        className="studio-heading mb-8 text-5xl leading-none uppercase sm:text-6xl"
      >
        How Booking Works
      </h2>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bookingSteps.map((step, index) => (
          <li
            key={step.title}
            className="rounded-xl border border-[var(--border)] p-5 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="studio-heading text-4xl leading-none text-[var(--accent)]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="studio-heading mt-5 text-3xl leading-tight">
              {step.title}
            </h3>

            <p className="mt-3 leading-7 text-[var(--muted)]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

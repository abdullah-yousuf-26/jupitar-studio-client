const supportTopics = [
  {
    title: "Liability protection",
    description:
      "Before booking, ask your host what their studio policy covers, how the security deposit works, and who handles accidental damage.",
  },
  {
    title: "Verified profiles",
    description:
      "Check the host profile and studio reviews before reserving. If you need confirmation about the space or its equipment, ask before your session.",
  },
  {
    title: "Equipment safety",
    description:
      "Walk through the equipment with your host at check-in. Note any existing damage and agree on how to return the gear after your session.",
  },
  {
    title: "24/7 host support",
    description:
      "Planning a late shoot? Confirm your host’s after-hours contact and studio access instructions before you arrive.",
  },
];

export default function HostCreatorSupport() {
  return (
    <section
      aria-labelledby="support-heading"
      className="border-y border-[var(--border)] bg-[var(--page)]"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <h2
          id="support-heading"
          className="studio-heading max-w-lg text-5xl leading-none uppercase sm:text-6xl"
        >
          Host Guarantee
          <br />
          <span className="text-[var(--accent)]">&amp; Creator Support</span>
        </h2>

        <dl className="divide-y divide-[var(--border)]">
          {supportTopics.map((topic) => (
            <div key={topic.title} className="py-5 first:pt-0 last:pb-0">
              <dt className="studio-heading text-3xl leading-tight">
                {topic.title}
              </dt>
              <dd className="mt-2 leading-7 text-[var(--muted)]">
                {topic.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

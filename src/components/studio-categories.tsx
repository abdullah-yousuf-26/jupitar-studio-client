import Link from "next/link";

const categories = [
  { value: "photo", label: "Photo Studios" },
  { value: "film", label: "Sound Stages" },
  { value: "podcast", label: "Podcast Rooms" },
  { value: "music", label: "Music Suites" },
  { value: "workshop", label: "Art Workshops" },
];

export default function StudioCategories() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16"
    >
      <h2
        id="categories-heading"
        className="studio-heading mb-8 text-5xl leading-none uppercase sm:text-6xl"
      >
        Browse by Studio Category
      </h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map(({ value, label }) => (
          <li key={value}>
            <Link
              href={`/studios?category=${value}`}
              className="group block overflow-hidden rounded-xl border border-[var(--border)] hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <div
                aria-hidden="true"
                className="aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage: `
                    url("/images/categories/${value}.png"),
                    radial-gradient(circle at 75% 30%, #874328 0%, #392a25 40%, #191919 85%)
                  `,
                }}
              />

              <div className="flex items-center justify-between gap-2 px-4 py-4">
                <h3 className="studio-heading text-2xl">{label}</h3>
                <span
                  aria-hidden="true"
                  className="text-xl text-[var(--accent)] transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

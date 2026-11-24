import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Explore Studios | JUPITAR STUDIO",
  description:
    "Browse creative studios by category, location, rating, and hourly rate.",
};

const categories = [
  { value: "photo", label: "Photo Studios" },
  { value: "film", label: "Sound Stages" },
  { value: "podcast", label: "Podcast Rooms" },
  { value: "music", label: "Music Suites" },
  { value: "workshop", label: "Art Workshops" },
];

type Studio = {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  rating: number;
  imageUrl: string | null;
};

type ExplorePageProps = {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
};

const controlStyle =
  "min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 text-[var(--text)]";

const actionStyle =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6845] px-5 text-sm font-semibold text-[#191919] hover:underline";

async function ExploreResults({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const selectedCategory = categories.find(
    (category) => category.value === params.category,
  );

  const query = typeof params.q === "string" ? params.q.trim() : "";

  // This component runs on the Next.js server, so it can call Express directly.
  const apiUrl = new URL(
    "/api/studios",
    process.env.API_ORIGIN || "http://localhost:5000",
  );

  if (selectedCategory) {
    apiUrl.searchParams.set("category", selectedCategory.value);
  }

  let studios: Studio[] = [];
  let loadFailed = false;

  try {
    const response = await fetch(apiUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Studios API returned ${response.status}`);
    }

    studios = await response.json();
  } catch (error) {
    console.error("Could not load Explore Studios:", error);
    loadFailed = true;
  }

  const searchText = query.toLowerCase();
  const results = studios.filter((studio) =>
    `${studio.title} ${studio.location}`.toLowerCase().includes(searchText),
  );

  return (
    <>
      <form
        action="/studios"
        method="get"
        className="mt-8 grid items-end gap-4 rounded-xl border border-[var(--border)] p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"
      >
        <label className="grid gap-2 text-sm font-semibold">
          Studio category
          <select
            key={selectedCategory?.value ?? "all"}
            name="category"
            defaultValue={selectedCategory?.value ?? ""}
            className={controlStyle}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Studio name or location
          <input
            key={query}
            type="search"
            name="q"
            defaultValue={query}
            placeholder="e.g. Orbit or Banani"
            className={controlStyle}
          />
        </label>

        <button type="submit" className={actionStyle}>
          Apply filters
        </button>
      </form>

      {loadFailed ? (
        <div role="alert" className="mt-8 rounded-xl border border-[var(--border)] p-6">
          <h2 className="studio-heading text-3xl">Studios couldn’t be loaded</h2>
          <p className="mt-2 text-[var(--muted)]">
            Use Apply filters to try loading these studios again.
          </p>
        </div>
      ) : (
        <>
          <div className="my-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold">
              {results.length} {results.length === 1 ? "studio" : "studios"} found
            </p>

            {(selectedCategory || query) && (
              <Link href="/studios" className="text-sm font-semibold underline">
                Clear filters
              </Link>
            )}
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-[var(--border)] p-8">
              <h2 className="studio-heading text-3xl">No matching studios</h2>
              <p className="mt-2 text-[var(--muted)]">
                Try another studio name, location, or category.
              </p>
              <Link href="/studios" className={`${actionStyle} mt-5`}>
                Browse all studios
              </Link>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((studio) => {
                const category = categories.find(
                  (item) => item.value === studio.category,
                );

                const imagePath =
                  studio.imageUrl || `/images/studios/${studio._id}.png`;

                return (
                  <li
                    key={studio._id}
                    className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)]"
                  >
                    <div
                      aria-hidden="true"
                      className="aspect-[16/10] border-b border-[var(--border)] bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${JSON.stringify(imagePath)}), linear-gradient(135deg, #874328, #191919)`,
                      }}
                    />

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="rounded-full border border-[var(--border)] px-3 py-1">
                          {category?.label ?? studio.category}
                        </span>
                        <span aria-label={`Rating ${studio.rating} out of 5`}>
                          <span aria-hidden="true" className="text-[var(--accent)]">
                            ★
                          </span>{" "}
                          {studio.rating.toFixed(1)}
                        </span>
                      </div>

                      <h2 className="studio-heading mt-4 text-3xl leading-tight">
                        {studio.title}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {studio.location}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                        <p>
                          <strong>${studio.hourlyRate}</strong> / hr
                        </p>
                        <Link
                          href={`/studios/${studio._id}`}
                          aria-label={`View details for ${studio.title}`}
                          className={actionStyle}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </>
  );
}

export default function ExploreStudiosPage({ searchParams }: ExplorePageProps) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="studio-heading text-6xl leading-none uppercase sm:text-7xl">
        Explore Studios
      </h1>

      <Suspense
        fallback={
          <p role="status" className="mt-8 animate-pulse text-[var(--muted)]">
            Loading JUPITAR STUDIO listings…
          </p>
        }
      >
        <ExploreResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

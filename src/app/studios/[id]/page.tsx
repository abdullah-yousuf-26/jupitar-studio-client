import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookWorkspaceButton from "@/components/book-workspace-button";

export const metadata: Metadata = {
  title: "Studio Details | JUPITAR STUDIO",
};

type Studio = {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  rating: number;
  ownerName: string;
  overview: string;
  amenities: string[];
  imageUrl: string | null;
  gallery: string[];
  reviews: { author: string; comment: string }[];
};

type StudioPageProps = {
  params: Promise<{ id: string }>;
};

const categoryLabels: Record<string, string> = {
  photo: "Photo Studio",
  film: "Sound Stage",
  podcast: "Podcast Room",
  music: "Music Suite",
  workshop: "Art Workshop",
};

const headingStyle = "studio-heading text-3xl uppercase";

async function StudioDetails({ params }: StudioPageProps) {
  const { id } = await params;

  if (!/^[0-9a-f]{24}$/i.test(id)) {
    notFound();
  }

  const apiUrl = new URL(
    `/api/studios/${id}`,
    process.env.API_ORIGIN || "http://localhost:5000",
  );

  const response = await fetch(apiUrl, { cache: "no-store" });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Studio details request failed (${response.status}).`);
  }

  const studio: Studio = await response.json();

  const images = studio.gallery.length
    ? studio.gallery
    : [studio.imageUrl || `/images/studios/${studio._id}.png`];

  return (
    <article>
      <header className="mb-6">
        <p className="text-sm font-semibold text-[var(--accent)]">
          {categoryLabels[studio.category] ?? studio.category}
        </p>
        <h1 className="studio-heading mt-2 text-5xl leading-none uppercase sm:text-7xl">
          {studio.title}
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          {studio.location} · ★ {studio.rating.toFixed(1)} / 5
        </p>
      </header>

      <section aria-label="Studio photo gallery">
        <div className="flex snap-x snap-mandatory overflow-x-auto rounded-xl border border-[var(--border)]">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              id={`photo-${index + 1}`}
              role="img"
              aria-label={`${studio.title}, photo ${index + 1}`}
              className="aspect-[16/9] max-h-[32rem] w-full shrink-0 snap-start scroll-mt-24 bg-cover bg-center"
              style={{
                backgroundImage: `url(${JSON.stringify(src)}), linear-gradient(135deg, #874328, #191919)`,
              }}
            />
          ))}
        </div>

        {images.length > 1 && (
          <nav aria-label="Choose a studio photo" className="mt-3 flex flex-wrap gap-2">
            {images.map((src, index) => (
              <a
                key={`${src}-${index}`}
                href={`#photo-${index + 1}`}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-sm hover:underline"
              >
                Photo {index + 1}
              </a>
            ))}
          </nav>
        )}
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className={headingStyle}>About this space</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
              {studio.overview}
            </p>
          </section>

          <section>
            <h2 className={headingStyle}>Amenities</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {studio.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={headingStyle}>Creator reviews</h2>
            {studio.reviews.length === 0 ? (
              <p className="mt-3 text-[var(--muted)]">
                This studio has no written reviews yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-4">
                {studio.reviews.map((review, index) => (
                  <li key={index} className="border-l-2 border-[var(--accent)] pl-4">
                    <p>{review.comment}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{review.author}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="rounded-xl border border-[var(--border)] p-6">
          <h2 className={headingStyle}>Studio details</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between gap-4">
              <dt>Hourly rate</dt>
              <dd className="font-semibold">${studio.hourlyRate} / hr</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Security deposit</dt>
              <dd>${studio.securityDeposit}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Capacity</dt>
              <dd>{studio.maxCapacity} people</dd>
            </div>
            <div className="border-t border-[var(--border)] pt-3">
              <dt className="text-sm text-[var(--muted)]">Hosted by</dt>
              <dd className="mt-1 font-semibold">{studio.ownerName}</dd>
            </div>
          </dl>
                    <BookWorkspaceButton
            studioId={studio._id}
            hourlyRate={studio.hourlyRate}
          />
        </aside>
      </div>
    </article>
  );
}

export default function StudioDetailsPage({ params }: StudioPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href="/studios"
        className="mb-6 inline-block text-sm font-semibold hover:underline"
      >
        ← Explore Studios
      </Link>

      <Suspense
        fallback={
          <p role="status" className="animate-pulse py-12 text-[var(--muted)]">
            Loading studio details…
          </p>
        }
      >
        <StudioDetails params={params} />
      </Suspense>
    </main>
  );
}

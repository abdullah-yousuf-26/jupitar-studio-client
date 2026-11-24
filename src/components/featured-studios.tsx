"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Studio = {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  rating: number;
  imageUrl: string | null;
};

const categoryLabels: Record<string, string> = {
  photo: "Photo Studio",
  film: "Sound Stage",
  podcast: "Podcast Room",
  music: "Music Suite",
  workshop: "Art Workshop",
};

function StudioImage({ studio }: { studio: Studio }) {
  const imagePath = studio.imageUrl || `/images/studios/${studio._id}.png`;
  const [failedPath, setFailedPath] = useState<string | null>(null);

  return (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
      {failedPath === imagePath ? (
        <div className="flex h-full items-center justify-center px-4">
          <span className="studio-heading text-2xl uppercase text-[var(--muted)]">
            Studio photo coming soon
          </span>
        </div>
      ) : (
        <Image
          src={imagePath}
          alt={studio.title}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          onError={() => setFailedPath(imagePath)}
        />
      )}
    </div>
  );
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudios() {
      try {
        const response = await fetch("/api/studios/featured", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load featured studios.");
        }

        const data: Studio[] = await response.json();

        if (!controller.signal.aborted) {
          setStudios(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadStudios();

    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setError(false);
    setLoading(true);
    setAttempt((previous) => previous + 1);
  }

  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16"
    >
      <h2
        id="featured-heading"
        className="studio-heading mb-8 text-5xl leading-none uppercase sm:text-6xl"
      >
        Featured Studios
      </h2>

      {loading && (
        <div role="status" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <span className="sr-only">Loading featured studios…</span>
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="aspect-[4/3] rounded-xl border border-[var(--border)] bg-[var(--text)]/5 motion-safe:animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <div role="alert">
          <p>Featured studios couldn’t be loaded.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-3 rounded-full border border-[var(--border)] px-5 py-2"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && studios.length === 0 && (
        <p className="text-[var(--muted)]">No featured studios are available yet.</p>
      )}

      {!loading && !error && studios.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <article
              key={studio._id}
              className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <StudioImage studio={studio} />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1">
                    {categoryLabels[studio.category] ?? studio.category}
                  </span>
                  <span aria-label={`Rating ${studio.rating} out of 5`}>
                    <span aria-hidden="true" className="text-[var(--accent)]">
                      ★
                    </span>{" "}
                    {studio.rating.toFixed(1)}
                  </span>
                </div>

                <h3 className="studio-heading mt-4 text-3xl leading-tight">
                  {studio.title}
                </h3>
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
                    className="rounded-full bg-[#ff6845] px-4 py-2 text-sm font-semibold text-[#191919] hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
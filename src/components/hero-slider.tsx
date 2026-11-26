"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";

const slides = [
  {
    category: "Photography Studio",
    heading: "Space for your next shot.",
    description:
      "Find a photography studio with the light, backdrop, and floor space your shoot needs.",
    filename: "photography-studio.png",
    alt: "Photography studio with lighting equipment and a backdrop",
  },
  {
    category: "Podcast Room",
    heading: "Give your voice a room.",
    description:
      "Explore podcast rooms for one-on-one interviews, roundtable conversations, and solo recordings.",
    filename: "podcast-room.png",
    alt: "Podcast recording room with microphones and headphones",
  },
  {
    category: "Music Studio",
    heading: "Make room for sound.",
    description:
      "Discover recording spaces for rehearsing a set, tracking vocals, or working on your next release.",
    filename: "music-studio.png",
    alt: "Music recording studio with a mixing desk",
  },
];

type HeroImageProps = {
  filename: string;
  alt: string;
};

function HeroImage({ filename, alt }: HeroImageProps) {
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <div className="relative isolate flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--page)] lg:aspect-auto lg:min-h-[28rem]">
      {imageMissing ? (
        <div className="px-5 text-center">
          <p className="studio-heading text-3xl uppercase text-[var(--accent)]">
            Image placeholder
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{filename}</p>
        </div>
      ) : (
        <Image
          src={`/images/hero/${filename}`}
          alt={alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          onError={() => setImageMissing(true)}
        />
      )}
    </div>
  );
}

function SliderControls({ activeIndex }: { activeIndex: number }) {
  const swiper = useSwiper();
  const buttonStyle =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-xl hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

  return (
    <div className="mt-5 flex items-center justify-end gap-3">
      <span className="mr-2 text-sm tabular-nums text-[var(--muted)]">
        {activeIndex + 1} / {slides.length}
      </span>

      <button
        type="button"
        aria-label="Previous studio slide"
        className={buttonStyle}
        onClick={() => swiper.slidePrev()}
      >
        ←
      </button>

      <button
        type="button"
        aria-label="Next studio slide"
        className={buttonStyle}
        onClick={() => swiper.slideNext()}
      >
        →
      </button>
    </div>
  );
}

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      aria-label="Discover creative studios"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12"
    >
      <Swiper
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        spaceBetween={24}
        rewind
        keyboard={{ enabled: true, onlyInViewport: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.filename}>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
              <HeroImage filename={slide.filename} alt={slide.alt} />

              <div className="flex flex-col items-start justify-center py-3 lg:py-10">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {slide.category}
                </p>

                <h2 className="studio-heading mt-4 max-w-xl text-6xl leading-[0.95] uppercase sm:text-7xl xl:text-8xl">
                  {slide.heading}
                </h2>

                <p className="mt-5 max-w-md leading-7 text-[var(--muted)]">
                  {slide.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/studios"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff6845] px-6 py-3 font-semibold text-[#191919] hover:underline"
                >
                  Explore Studios
                </Link>

                <Link
                  href="/studios"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-current px-6 py-3 font-semibold hover:underline"
                >
                  Host Your Space
                </Link>
              </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div slot="container-end">
          <SliderControls activeIndex={activeIndex} />
        </div>
      </Swiper>
    </section>
  );
}

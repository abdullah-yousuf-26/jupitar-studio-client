"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

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

type StudioSlide = (typeof slides)[number];

function HeroPanel({
  slide,
  index,
  active,
}: {
  slide: StudioSlide;
  index: number;
  active: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article
      inert={!active}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#292320] text-[#fff7e5]"
    >
      {!imageFailed && (
        <Image
          src={`/images/hero/${slide.filename}`}
          alt={slide.alt}
          fill
          unoptimized
          sizes="100vw"
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          className="absolute inset-0 -z-20 object-cover object-center"
          onError={() => setImageFailed(true)}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(0deg, rgba(12,10,9,.88) 0%, rgba(12,10,9,.28) 58%, rgba(12,10,9,.16) 100%), linear-gradient(90deg, rgba(12,10,9,.56), transparent 80%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-5 pt-32 pb-24 sm:px-8 sm:pb-28 lg:px-12">
        <p className="text-sm font-semibold tracking-[0.16em] text-[#ff987c] uppercase">
          {slide.category}
        </p>

        <h2 className="studio-heading mt-3 max-w-3xl text-6xl leading-[0.94] uppercase sm:text-7xl lg:text-8xl">
          {slide.heading}
        </h2>

        <p className="mt-4 max-w-lg text-base leading-7 text-[#fff7e5] sm:text-lg">
          {slide.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/studios"
            className="inline-flex min-h-11 items-center rounded-full bg-[#ff6845] px-6 py-3 font-semibold text-[#191919] hover:underline"
          >
            Explore Studios
          </Link>

          <Link
            href="/studios"
            className="inline-flex min-h-11 items-center rounded-full border border-[#fff7e5] bg-black/20 px-6 py-3 font-semibold text-[#fff7e5] hover:bg-black/40"
          >
            Host Your Space
          </Link>
        </div>
      </div>
    </article>
  );
}

function SliderControls({ activeIndex }: { activeIndex: number }) {
  const swiper = useSwiper();
  const [paused, setPaused] = useState(false);

  const control =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/50 bg-black/35 px-3 text-sm font-semibold text-white hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-white";

  function toggleAutoplay() {
    if (paused) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
    setPaused(!paused);
  }


}

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section aria-label="Discover creative studios" className="w-full">
      <Swiper
        className="relative w-full bg-[#292320]"
        modules={[A11y, Autoplay, EffectFade, Keyboard]}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={450}
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          waitForTransition: false,
        }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.filename}>
            <HeroPanel
              slide={slide}
              index={index}
              active={activeIndex === index}
            />
          </SwiperSlide>
        ))}

        <div slot="container-end">
        </div>
      </Swiper>
    </section>
  );
}

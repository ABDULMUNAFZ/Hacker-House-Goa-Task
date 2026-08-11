import { useEffect, useState } from "react";
import { ParticleText } from "./ParticleText";
import { TropicalScene } from "./TropicalScene";

export function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section id="top" className="grain relative overflow-hidden bg-goa-green pb-10 pt-10 sm:pb-16">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-90"
        style={{ transform: `translate3d(${tilt.x * -0.6}px, ${tilt.y * 0.3}px, 0)` }}
      >
        <TropicalScene className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="label-cond text-[0.62rem] text-goa-cream sm:text-xs">
          GOA, INDIA — 28–31 OCT 2026
        </p>

        <h1 className="mt-4 select-none">
          <span className="sr-only">Frame your Goa — HH Goa 2026 card generator</span>
          <span
            aria-hidden="true"
            className="display-xl block text-[19vw] leading-[0.82] text-goa-yellow sm:text-[15vw] lg:text-[11rem]"
            style={{ transform: `translateX(${tilt.x * 0.25}px)` }}
          >
            FRAME
          </span>
          <span
            aria-hidden="true"
            className="display-xl -mt-[0.06em] block bg-clip-text text-[19vw] leading-[0.82] text-transparent sm:text-[15vw] lg:text-[11rem]"
            style={{
              backgroundImage:
                "linear-gradient(115deg, #FFD400 0%, #FF168C 42%, #FFF8DD 60%, #FFD400 100%)",
              WebkitBackgroundClip: "text",
              transform: `translateX(${tilt.x * -0.2}px)`,
            }}
          >
            YOUR
          </span>
          <span className="relative -mt-[0.06em] block">
            <span
              aria-hidden="true"
              className="display-xl block text-[19vw] leading-[0.82] text-goa-cream sm:text-[15vw] lg:text-[11rem]"
            >
              GOA.
            </span>
            <span
              aria-hidden="true"
              className="absolute left-[42%] top-1/2 hidden h-3 w-[46%] -translate-y-1/2 rotate-[-4deg] bg-goa-pink sm:block"
            />
          </span>
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <div>
            <p className="max-w-md font-body text-base text-goa-cream/90 sm:text-lg">
              Upload a selfie. Get an HH Goa 2026 profile frame or a Builder ID card, designed like a
              proper poster — then take it straight to X.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#create" className="hh-btn hh-btn-primary">
                Create my card
              </a>
              <a href="#how" className="hh-btn hh-btn-ghost">
                How it works
              </a>
            </div>
            <p className="label-cond mt-5 text-[0.6rem] text-goa-yellow">#FRAMEINGOA</p>
          </div>

          <div className="hidden lg:block">
            <ParticleText text="HH GOA" height={200} />
          </div>
        </div>
      </div>

      <div className="relative mt-10 overflow-hidden border-y-2 border-goa-yellow/40 bg-goa-deep py-2">
        <div className="ticker flex w-max gap-8 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="label-cond flex gap-8 text-[0.65rem] text-goa-yellow">
              <span>MAKE SOMETHING WORTH SHARING</span>
              <span className="text-goa-pink">★</span>
              <span>BUILDERS OF THE HOUSE</span>
              <span className="text-goa-pink">★</span>
              <span>HH GOA 2026</span>
              <span className="text-goa-pink">★</span>
              <span>#FRAMEINGOA</span>
              <span className="text-goa-pink">★</span>
              <span>SEE YOU IN GOA</span>
              <span className="text-goa-pink">★</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import TextLoop from "./TextLoop";
import ScrambledText from "./ScrambledText";
import TextCursor from "./TextCursor";

export function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onMove = (e: PointerEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setTilt({
            x: (e.clientX / window.innerWidth - 0.5) * 18,
            y: (e.clientY / window.innerHeight - 0.5) * 12,
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section 
      id="top" 
      className="grain relative overflow-hidden bg-goa-green pt-32 sm:pt-40 lg:pt-48"
    >
      <TextCursor
        text="GOA"
        spacing={80}
        followMouseDirection={true}
        randomFloat={true}
        exitDuration={0.3}
        removalInterval={20}
        maxPoints={10}
      >
      {/* Illustrated background with parallax tilt and mathematical sizing */}
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat opacity-100"
        style={{ 
          backgroundImage: "url('/goa-bg.jpg')",
          backgroundSize: "94% auto",
          backgroundPosition: "center bottom -18vw",
          transform: `translate3d(${tilt.x * -0.4}px, ${tilt.y * 0.2}px, 0) scale(1.05)`,
          transformOrigin: "bottom center"
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Massive Brand Header (matching user's uploaded layout design) */}
        <div 
          className="flex flex-col items-center justify-center text-center transition-transform duration-300"
          style={{ transform: `translateX(${tilt.x * 0.15}px)` }}
        >
          {/* Inner wrapper that shrink-wraps to the width of the H1 */}
          <div className="inline-flex flex-col items-stretch max-w-full">
            {/* Top Line: HACKER [Goa logo] HOUSE */}
            <div className="flex flex-wrap items-center justify-center font-display text-[7.5vw] font-bold uppercase tracking-[0.14em] text-goa-yellow sm:text-[6.5vw] lg:text-[5.5rem] leading-none select-none text-poster-shadow">
              <span className="text-tall-display">HACKER</span>
              <div className="relative z-10 mx-[-1.2vw] h-[4.5vw] w-[4.5vw] lg:mx-[-1.2rem] lg:h-[3.6rem] lg:w-[3.6rem] shrink-0 animate-float">
                <img 
                  src="/goa-logo.png" 
                  alt="Goa Logo" 
                  className="h-full w-full object-contain" 
                />
              </div>
              <span className="text-tall-display">HOUSE</span>
            </div>

            {/* Bottom Line: FRAME YOUR GOA (Larger and less bold), wrapped in ScrambledText */}
            <h1 className="mt-6">
              <ScrambledText
                radius={250}
                duration={1.5}
                scrambleChars="HHGOA"
                className="font-display text-[19vw] font-medium uppercase tracking-tight text-goa-yellow sm:text-[18vw] lg:text-[16.5rem] leading-[0.85] select-none text-poster-shadow text-tall-display"
              >
                FRAME YOUR GOA
              </ScrambledText>
            </h1>

            {/* Location & Date Bar (Monospace Victor Mono font aligned to bounds) */}
            <div className="mt-4 flex w-full flex-col gap-2 text-[0.8rem] sm:text-[0.95rem] lg:text-[1.05rem] font-semibold tracking-[0.24em] text-goa-cream sm:flex-row sm:justify-between font-body uppercase select-none">
              <span>GOA, INDIA · 28 - 31 OCT 2026</span>
              <span>2:47 PM STUDIO</span>
            </div>
          </div>
        </div>

        {/* Action description section (our standard format) */}
        <div className="mt-10 flex flex-col items-center text-center">
          <p className="max-w-xl font-body text-sm text-goa-cream/95 sm:text-lg leading-relaxed px-4">
            Upload a selfie. Get an HH Goa 2026 profile frame or a Builder ID card, designed like a
            proper poster — then take it straight to X.
          </p>
          <p className="font-body mt-5 text-[0.85rem] sm:text-[0.95rem] font-bold text-goa-yellow tracking-[0.2em] uppercase">
            #FRAMEINGOA
          </p>
        </div>

        {/* Spacer inside flow to preserve section dimensions */}
        <div className="h-4 w-full" />
      </div>

      <div className="relative w-full -mt-16 sm:-mt-20 lg:-mt-28 overflow-hidden">
        <TextLoop
          text="MAKE SOMETHING WORTH SHARING ★ BUILDERS OF THE HOUSE ★ HH GOA 2026 ★ #FRAMEINGOA ★ SEE YOU IN GOA"
          shape="wave"
          speed={90}
          direction="forward"
          separator="★"
          curviness={20}
          fontSize={14}
          fontWeight={500}
          letterSpacing={1.2}
          uppercase
          color="#fee101"
          ribbon
          ribbonColor="#ff0080"
          ribbonWidth={30}
          pauseOnHover={false}
        />
      </div>

      {/* Cream Downbar Container (Fixed sticky bottom navigation tab that travels with scroll) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-8 pt-8 pb-5 flex justify-center items-center gap-6">
        {/* Custom SVG path rendering the exact rounded trapezoid shape with color #fffbe8 */}
        <svg 
          viewBox="0 0 1000 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full text-[#fffbe8] fill-current pointer-events-none drop-shadow-[0_-5px_15px_rgba(0,0,0,0.18)]"
        >
          <path 
            d="M 0 100 L 80 20 Q 110 0 140 0 L 860 0 Q 890 0 920 20 L 1000 100 Z" 
          />
        </svg>

        {/* Buttons positioned inside the shape */}
        <a href="#create" className="hh-btn hh-btn-primary relative z-10">
          <span className="btn-txt">Create my card</span>
        </a>
        <a href="#how" className="hh-btn hh-btn-pink relative z-10">
          <span className="btn-txt">How it works</span>
        </a>
      </div>
      </TextCursor>
    </section>
  );
}

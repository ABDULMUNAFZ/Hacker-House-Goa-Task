export function Footer() {
  return (
    <footer className="grain relative overflow-hidden border-t-4 border-goa-yellow bg-goa-deep py-16">
      {/* Tropical leaf/ocean SVG background */}
      <svg
        viewBox="0 0 400 140"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-32 w-80 opacity-45"
      >
        <g stroke="#FFD400" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M320 140 q 14 -70 4 -120" />
          <path d="M324 22 q -40 -20 -66 -4 M324 22 q -26 -34 -64 -32 M324 22 q 40 -28 70 -8" />
          <path d="M0 118 q 30 -14 60 0 t 60 0 t 60 0 t 60 0" opacity="0.6" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          {/* Main credit block */}
          <div className="space-y-3">
            <p className="font-cond text-xl font-bold uppercase tracking-[0.15em] text-goa-yellow sm:text-2xl md:text-3xl">
              BUILT FOR HH GOA 2026 <span className="text-goa-pink">·</span> #FrameInGoa <span className="text-goa-pink">·</span>{" "}
              <a
                href="https://hhgoa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-goa-pink/50 transition-colors hover:text-goa-pink hover:decoration-goa-pink"
              >
                hhgoa.com
              </a>
            </p>
            <p className="font-mono text-xs text-goa-cream/60">
              Done by Team —{" "}
              <a
                href="/#team"
                className="text-goa-yellow font-bold hover:text-goa-pink transition-colors underline decoration-dotted underline-offset-4"
              >
                Tech Mavericks
              </a>
            </p>
          </div>

          {/* Divider */}
          <div className="my-8 h-[2px] w-full bg-gradient-to-r from-transparent via-goa-yellow/30 to-transparent" />

          {/* Centered logo container */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a
              href="https://x.com/247pmstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/247pm-studio-logo.png"
                alt="2:47PM STUDIO"
                className="h-10 w-auto object-contain"
              />
            </a>
            <span className="hidden sm:inline text-goa-yellow/30 text-xl">|</span>
            <a
              href="https://hhgoa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/goa-logo.png"
                alt="HH Goa 2026"
                className="h-9 w-auto object-contain"
              />
            </a>
          </div>

          {/* X ID button */}
          <a
            href="https://x.com/247pmstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-goa-yellow/30 bg-goa-ink/65 px-5 py-2 text-xs text-goa-yellow transition-all duration-300 hover:border-goa-pink hover:bg-goa-ink hover:text-goa-pink hover:scale-105 hover:shadow-lg hover:shadow-goa-pink/10"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 transition-transform group-hover:rotate-12"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="font-cond font-bold tracking-widest text-[11px]">
              HHGoa’26 | 2:47Pm
            </span>
          </a>
        </div>

        <div className="mt-12 text-[0.62rem] text-goa-cream/40 label-cond tracking-[0.2em] uppercase">
          Goa, India — 28–31 Oct 2026
        </div>
      </div>
    </footer>
  );
}
